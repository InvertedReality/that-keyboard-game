import Vue from 'vue';

import { playNextNote, pickTune } from '@/obnoxiousness';
import prandomId from '@/utils/prandomId';
import { PlayerState, PLAY_TIME } from '@/consts';


export function initKey() {
  return {
    id: prandomId(),
    key: Math.floor(Math.random() * 4),
  };
}

export function checkPlayerId(state, playerId) {
  if (!playerId) {
    console.error(`${playerId} is not defined`);
    return false;
  }

  if (!state.players[playerId]) {
    console.error(`${playerId} is not a valid player`);
    return false;
  }

  return true;
}


export default {
  state() {
    return {
      players: {},
    };
  },

  mutations: {
    initPlayer(state, { playerId }) {
      Vue.set(state.players, `${playerId}`, {
        state: PlayerState.IDLE,
        // NOTE: Handled with initPlayerKeys.
        keys: Array(7).join().split(',').map(initKey),

        // Idle State.
        idlePlayingIntervalId: null,

        // Playing State.
        blockedKey: null,
        blockedTimerId: null,
        timeLeft: 0,
        timeLeftIntervalId: null,
        keysScored: 0,
      });
    },

    updatePlayerPlayState(state, { playerId, state: nextPlayState }) {
      state.players[playerId].state = nextPlayState;
    },

    startPlayerIdlePlaying(state, { playerId, intervalId }) {
      state.players[playerId].idlePlayingIntervalId = intervalId;
    },

    stopPlayerIdlePlaying(state, { playerId }) {
      state.players[playerId].idlePlayingIntervalId = null;
    },

    setPlayerTimeLeft(state, { playerId, timeLeft }) {
      state.players[playerId].timeLeft = timeLeft;
    },

    startPlayerTimeLeft(state, { playerId, timerId }) {
      state.players[playerId].timeLeftIntervalId = timerId;
    },

    stopPlayerTimeLeft(state, { playerId }) {
      state.players[playerId].timeLeftIntervalId = null;
    },

    decrementPlayerTimeLeft(state, { playerId }) {
      state.players[playerId].timeLeft -= 1;
    },

    incrementPlayerKeysScored(state, { playerId }) {
      state.players[playerId].keysScored += 1;
    },

    rotatePlayerKeys(state, { playerId }) {
      const player = state.players[playerId];
      const nextKeys = player.keys.slice();

      nextKeys.shift();
      nextKeys.push(initKey());

      player.keys = nextKeys;
    },

    blockPlayerWithKey(state, { playerId, key, timerId }) {
      const player = state.players[playerId];

      player.blockedKey = key;
      player.blockedTimerId = timerId;
    },

    unblockPlayer(state, { playerId }) {
      const player = state.players[playerId];

      player.blockedKey = null;
      player.blockedTimerId = null;
    },
  },

  actions: {
    initPlayer({ commit }, { playerId }) {
      commit('initPlayer', { playerId });
    },

    idlePlayer({ state, commit, dispatch }, { playerId }) {
      if (!checkPlayerId(state, playerId)) return;
      commit('updatePlayerPlayState', { playerId, state: PlayerState.IDLE });
      commit('startPlayerIdlePlaying', {
        playerId,
        intervalId: setInterval(
          () => {
            // Just to make it less boring, add a chance of not playing.
            if (Math.random() < 0.9) {
              return;
            }

            dispatch('advanceIdlePlayer', { playerId });
          },
          0.2e3,
        ),
      });

      // Sound stuff!
      pickTune(playerId);
    },

    beginPlayerPlay({ state, commit, dispatch }, { playerId }) {
      if (!checkPlayerId(state, playerId)) return;

      if (state.players[playerId].idlePlayingIntervalId != null) {
        clearInterval(state.players[playerId].idlePlayingIntervalId);
      }

      // First, clean slate to keep out demo data.
      dispatch('initPlayer', { playerId });

      // Now, play stuff.
      commit('stopPlayerIdlePlaying', { playerId });
      commit('updatePlayerPlayState', { playerId, state: PlayerState.PLAYING });
      commit('setPlayerTimeLeft', { playerId, timeLeft: PLAY_TIME });

      // Sound stuff!
      pickTune(playerId);
    },

    playerHitKey({ state, commit, dispatch }, { playerId, key }) {
      if (!checkPlayerId(state, playerId)) return;

      const player = state.players[playerId];

      switch (player.state) {
        case PlayerState.IDLE: {
          dispatch('beginPlayerPlay', { playerId });
          return;
        }

        case PlayerState.PLAYING: {
          break;
        }

        case PlayerState.DONE: {
          return;
        }

        default: {
          console.error(`Received key press in invalid player state "${player.state}"`);
          return;
        }
      }

      if (player.blockedTimerId != null) {
        console.log(`Player tried to hit key ${key} while blocked!`);
        return;
      }

      if (player.timeLeftIntervalId == null) {
        const timerId = setInterval(() => {
          dispatch('tickPlayerTimeLeft', { playerId });
        }, 1e3);

        commit('startPlayerTimeLeft', { playerId, timerId });
      }

      if (player.keys[0].key === key) {
        dispatch('advancePlayer', { playerId });
      }
      else {
        dispatch('blockPlayer', { playerId, key });
      }
    },

    tickPlayerTimeLeft({ state, commit, dispatch }, { playerId }) {
      if (!checkPlayerId(state, playerId)) return;

      const player = state.players[playerId];

      if (player.timeLeft >= 0) {
        commit('decrementPlayerTimeLeft', { playerId });
      }
      else {
        dispatch('endPlayerPlay', { playerId });
      }
    },

    advanceIdlePlayer({ state, dispatch }, { playerId }) {
      if (!checkPlayerId(state, playerId)) return;

      // Check if any other players are actively playing.
      // If so, just skip this action.

      const players = Object.keys(state.players).map(id => state.players[id]);
      if (players.some(player => player.state !== PlayerState.IDLE)) {
        return;
      }

      dispatch('advancePlayer', { playerId });
    },

    advancePlayer({ state, commit }, { playerId }) {
      if (!checkPlayerId(state, playerId)) return;

      commit('rotatePlayerKeys', { playerId });

      if (state.players[playerId].state === PlayerState.PLAYING) {
        commit('incrementPlayerKeysScored', { playerId });
      }

      playNextNote(playerId);
    },

    blockPlayer({ state, commit, dispatch }, { playerId, key }) {
      if (!checkPlayerId(state, playerId)) return;

      const timerId = setTimeout(() => {
        dispatch('unblockPlayer', { playerId });
      }, 2e3);

      commit('blockPlayerWithKey', { playerId, key, timerId });
    },

    unblockPlayer({ state, commit }, { playerId }) {
      if (!checkPlayerId(state, playerId)) return;

      if (state.players[playerId].blockedTimerId != null) {
        clearTimeout(state.players[playerId].blockedTimerId);
        commit('unblockPlayer', { playerId });
      }
    },

    endPlayerPlay({ state, commit, dispatch }, { playerId }) {
      if (!checkPlayerId(state, playerId)) return;

      const player = state.players[playerId];

      dispatch('unblockPlayer', { playerId });
      commit('updatePlayerPlayState', { playerId, state: PlayerState.DONE });

      if (player.timeLeftIntervalId != null) {
        clearInterval(player.timeLeftIntervalId);
        commit('stopPlayerTimeLeft', { playerId });
      }

      // Let them see their score for however many seconds.
      setTimeout(() => {
        dispatch('initPlayer', { playerId });
        dispatch('idlePlayer', { playerId });
      }, 10e3);
    },
  },
};
