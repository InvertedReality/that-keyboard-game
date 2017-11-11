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

  box-shadow: inset 0 0 20px 5px rgba(0, 0, 0, 0.2);
}

.player-timer--0 {
  background: darken($player-0-color, 35%);
}

.player-timer--1 {
  background: darken($player-1-color, 35%);
}

.remaining {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;

  height: 100%;

  transition: height;

  $stripes-gradient: linear-gradient(
    45deg,
    rgba(0,0,0,0.2) 25%,
    rgba(0,0,0,0) 25%,
    rgba(0,0,0,0) 50%,
    rgba(0,0,0,0.2) 50%,
    rgba(0,0,0,0.2) 75%,
    rgba(0,0,0,0) 75%,
    rgba(0,0,0,0) 0
  );

  $background-size: 50px;

  background-position: auto top;
  background-origin: padding-box;
  background-clip: border-box;

  box-shadow:
    inset 0 4px 4px -2px rgba(255, 255, 255, 0.4),
    inset -40px 0 50px -25px rgba(0, 0, 0, 0.5),
    inset 40px 0 50px -25px rgba(255, 255, 255, 0.6);

  .player-timer--0 & {
    background: $stripes-gradient, $player-0-color;
    background-size: $background-size $background-size;
  }

  .player-timer--1 & {
    background: $stripes-gradient, $player-1-color;
    background-size: $background-size $background-size;
  }
}
</style>
