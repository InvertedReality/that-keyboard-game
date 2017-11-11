<template lang="html">
  <div class="game">
    <PlayerKeys class="keys" :playerId="0" />
    <PlayerTimer class="timer" :playerId="0" />
    <PlayerTimer class="timer" :playerId="1" />
    <PlayerKeys class="keys" :playerId="1" />
  </div>
</template>

<script>
import { Player0Keys, Player1Keys } from '@/consts';

import PlayerKeys from './PlayerKeys';
import PlayerTimer from './PlayerTimer';

export default {
  data() {
    return {
      keyDownHandler: null,
    };
  },

  mounted() {
    this.keyDownHandler = (event) => {
      let keyPressed;

      if (event.key) {
        keyPressed = event.key.toLowerCase();
      }
      else if (event.keyCode) {
        keyPressed = String.fromCharCode(event.keyCode).toLowerCase();
      }
      else {
        console.log('Could not process keydown event!');
        return;
      }

      if (Player0Keys[keyPressed] != null) {
        this.handlePlayerKeyPress('0', Player0Keys[keyPressed]);
      }
      else if (Player1Keys[keyPressed] != null) {
        this.handlePlayerKeyPress('1', Player1Keys[keyPressed]);
      }
    };

    document.addEventListener('keydown', this.keyDownHandler);
  },

  beforeDestroy() {
    document.removeEventListener('keydown', this.keyDownHandler);
  },

  methods: {
    handlePlayerKeyPress(playerId, key) {
      this.$store.dispatch('playerHitKey', { playerId, key });
    },
  },

  components: {
    PlayerKeys,
    PlayerTimer,
  },
};
</script>

<style scoped lang="scss">
.game {
  width: 100%;
  height: 100%;

  display: flex;
  flex-direction: row;
}

.keys {
  flex: 1 1 auto;
}

.timer {
  flex: 0 0 auto;
}
</style>
