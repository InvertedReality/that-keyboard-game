<template lang="html">
  <div :class="['player-timer', `player-timer--${playerId}`]">
    <div class="remaining" :style="{ height: `${percentProgress}%` }"></div>
  </div>
</template>

<script>
import { PLAY_TIME } from '@/consts';

export default {
  props: {
    playerId: {
      type: Number,
      required: true,
    },
  },

  computed: {
    timeLeft() {
      return this.$store.state.players[this.playerId].timeLeft;
    },

    percentProgress() {
      return Math.round((this.timeLeft / PLAY_TIME) * 100);
    },
  },
};
</script>

<style scoped lang="scss">
@import "../styles/vars.scss";

.player-timer {
  position: relative;
  width: 64px;
}

.player-timer--0 {
  background: darken($player-0-color, 35%);
  box-shadow:
    inset 0 0 0 1px darken($player-0-color, 45%),
    inset 0 0 20px 5px darken($player-0-color, 40%);
}

.player-timer--1 {
  background: darken($player-1-color, 35%);
  box-shadow:
  inset 0 0 0 1px darken($player-1-color, 45%),
    inset 0 0 20px 5px darken($player-1-color, 40%);
}

@keyframes player-0-time-left {
  from {
    background: darken($player-0-color, 10%);
  }

  to {
    background: lighten($player-0-color, 10%);
  }
}

@keyframes player-1-time-left {
  from {
    background: darken($player-1-color, 15%);
  }

  to {
    background: lighten($player-1-color, 15%);
  }
}

.remaining {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;

  height: 100%;

  transition: height;

  box-shadow: inset 0 0 32px 0 rgba(0, 0, 0, 0.7);

  .player-timer--0 & {
    background: $player-0-color;
    animation: player-0-time-left ease-in-out 0.7s 0s alternate infinite;
  }

  .player-timer--1 & {
    background: $player-1-color;
    animation: player-1-time-left ease-in-out 0.7s 0s alternate infinite;
  }
}
</style>
