<template lang="html">
  <div class="container">
    <div v-if="showIdle" class="overlay idle">
      <div class="idle__title">
        <h1>That Keyboard Game!</h1>
        <h2>Annoy your coworkers while wasting time!</h2>
      </div>
      <div class="idle__instructions">
        Press <span v-if="playerId === 0" class="player-0-keys">
          <span class="key">A</span>
          <span class="key">S</span>
          <span class="key">D</span>
          or
          <span class="key">F</span>
        </span><span v-if="playerId === 1" class="player-1-keys">
          <span class="key">K</span>
          <span class="key">L</span>
          <span class="key">;</span>
          or
          <span class="key">'</span>
        </span> to begin!
      </div>
    </div>
    <div v-if="showLastScore" class="overlay last-score">
      <div :class="['last-score__message', lastScoreMessageClass]">
        <h1 :class="lastScoreMessageClass">{{ lastScoreMessage }}</h1>
      </div>
      <div class="last-score__score">
        <h2>You pressed {{ lastScore }} keys!</h2>
      </div>
    </div>
  </div>
</template>

<script>
import { PlayerState } from '@/consts';

const scoreMessages = [
  { score: 80, message: 'YOU GOT THE T$ SKILLS' },
  { score: 60, message: 'Ain\'t you just Big Boss Texas' },
  { score: 40, message: 'Joe sometimes gets on the leaderboard too' },
  { score: 20, message: 'Congratulations on not being terrible!' },
  { score: 0, message: 'God you suck.' },
];

export default {
  props: {
    playerId: {
      type: Number,
      require: true,
    },
  },

  computed: {
    player() {
      return this.$store.state.players[this.playerId];
    },

    showIdle() {
      return this.player.state === PlayerState.IDLE;
    },

    showLastScore() {
      return this.player.state === PlayerState.DONE;
    },

    lastScore() {
      return this.player.keysScored;
    },

    lastScoreMessage() {
      const score = this.lastScore;
      return scoreMessages.find(message => score >= message.score).message;
    },

    lastScoreMessageClass() {
      const score = this.lastScore;
      const amazement = (
        scoreMessages.length
        - scoreMessages.findIndex(message => score >= message.score)
        - 1
      );

      return `last-score__message--amazement-${amazement}`;
    },
  },
};
</script>

<style scoped lang="scss">
@import "../styles/vars.scss";

.overlay {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
}

.idle,
.last-score {
  color: white;
  background: rgba(0, 0, 0, 0.6);
  box-shadow: inset 0 0 128px 0 rgba(0, 0, 0, 0.6);
  text-align: center;

  display: flex;
  flex-direction: column;
  justify-content: center;
}

@keyframes idle__title {
  from {
    transform: rotate(-5deg);
  }

  to {
    transform: rotate(5deg);
  }
}

.idle__title {
  animation: idle__title 2s ease-in-out 0s alternate infinite;
}

.idle__instructions {
  font-size: 1.5rem;
}

.idle {
  .key {
    font-family: monospace;

    background: black;
    border-radius: 5px;
    padding: 0.1em 0.4em;
    border: 2px solid rgba(0, 0, 0, 0.5);
  }

  .player-0-keys .key {
    background: darken($player-0-color, 25%);
    box-shadow:
      inset 0 0 0 1px darken($player-0-color, 20%),
      inset 0 0 8px 1px darken($player-0-color, 40%);
  }

  .player-1-keys .key {
    background: darken($player-1-color, 32%);
    box-shadow:
      inset 0 0 0 1px darken($player-1-color, 27%),
      inset 0 0 8px 1px darken($player-1-color, 45%);
  }
}

@keyframes amazement-spin {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}

@keyframes amazement-rock {
  from {
    transform: rotate(-5deg);
  }

  to {
    transform: rotate(5deg);
  }
}

@keyframes amazement-pulse {
  from {
    transform: scale(1);
  }

  to {
    transform: scale(1.25);
  }
}

.last-score__message--amazement-4 {
  animation: amazement-spin linear 1.2s 0s forwards infinite;

  & & {
    animation: amazement-pulse ease-in-out 0.43s 0s alternate infinite;
  }
}

.last-score__message--amazement-3,
.last-score__message--amazement-2,
.last-score__message--amazement-1 {
  animation: amazement-rock ease-in-out 1.2s 0s alternate infinite;

  & & {
    animation: amazement-pulse ease-in-out 0.76s 0s alternate infinite;
  }
}
</style>
