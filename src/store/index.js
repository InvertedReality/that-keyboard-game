import Vue from 'vue';

import prandomId from '@/utils/prandomId';
import { PlayerState } from '@/consts';


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
        blockedKey: null,
        blockedTimerId: null,
        timeLeft: 0,
        timeLeftTimerId: null,
        keysScored: 0,
      });
    },

    updatePlayerPlayState(state, { playerId, state: nextPlayState }) {
      state.players[playerId].state = nextPlayState;
    },

    setPlayerTimeLeft(state, { playerId, timeLeft }) {
      state.players[playerId].timeLeft = timeLeft;
    },

    startPlayerTimeLeft(state, { playerId, timerId }) {
      state.players[playerId].timeLeftTimerId = timerId;
    },

    stopPlayerTimeLeft(state, { playerId }) {
      state.players[playerId].timeLeftTimerId = null;
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

    idlePlayer({ state, commit }, { playerId }) {
      if (!checkPlayerId(state, playerId)) return;
      commit('updatePlayerPlayState', { playerId, state: PlayerState.IDLE });
    },

    beginPlayerPlay({ state, commit, dispatch }, { playerId }) {
      if (!checkPlayerId(state, playerId)) return;
      // First, clean slate to keep out demo data.
      dispatch('initPlayer', { playerId });

      // Now, play stuff.
      commit('updatePlayerPlayState', { playerId, state: PlayerState.PLAYING });
      commit('setPlayerTimeLeft', { playerId, timeLeft: 30 });
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

      if (player.timeLeftTimerId == null) {
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

    advancePlayer({ state, commit }, { playerId }) {
      if (!checkPlayerId(state, playerId)) return;

      commit('incrementPlayerKeysScored', { playerId });
      commit('rotatePlayerKeys', { playerId });
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

      if (player.timeLeftTimerId != null) {
        clearInterval(player.timeLeftTimerId);
        commit('stopPlayerTimeLeft', { playerId });
      }

      // Let them see their score for however many seconds.
      setTimeout(() => {
        dispatch('initPlayer', { playerId });
      }, 10e3);
    },
  },
};
