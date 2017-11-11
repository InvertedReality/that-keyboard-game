<template lang="html">
  <div :class="['player-keys', `player-keys--${playerId}`]">
    <div class="keys-container">
      <div v-for="(key, index) in player.keys" :key="key.id" class="key-row">
        <div :class="keyClasses(0, key, index)"></div>
        <div :class="keyClasses(1, key, index)"></div>
        <div :class="keyClasses(2, key, index)"></div>
        <div :class="keyClasses(3, key, index)"></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    playerId: {
      type: Number,
      required: true,
    },
  },

  computed: {
    player() {
      return this.$store.state.players[this.playerId];
    },
  },

  methods: {
    keyClasses(thisKey, rowKey, rowIndex) {
      const missed = rowIndex === 0 && this.player.blockedKey === thisKey;

      return {
        key: true,
        'key--current': thisKey === rowKey.key && !missed,
        'key--missed': missed,
      };
    },
  },
};
</script>

<style scoped lang="scss">
@import "../styles/vars.scss";

.player-keys {
  overflow: hidden;
  background: #888;
}

.keys-container {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column-reverse;
}

.key-row {
  flex: 0 0 auto;
  height: 16.7%;

  display: flex;
  flex-direction: row;
  align-items: stretch;
}

.key {
  $border-radius: 10px;

  flex: 1 1 auto;

  margin-top: -10px;
  background-color: $color-ivory;

  border: 1px solid rgba(0, 0, 0, 0.5);
  border-top: 0 none;
  border-bottom-right-radius: $border-radius;
  border-bottom-left-radius: $border-radius;
  box-shadow:
    0 8px 12px -4px rgba(0, 0, 0, 0.7),
    inset 2px 2px 3px 0px rgba(255, 255, 255, 1),
    inset -1px -2px 3px 0px rgba(0, 0, 0, 0.4);
}

.key--current {
  .player-keys--0 & {
    background: $player-0-color;
  }

  .player-keys--1 & {
    background: $player-1-color;
  }
}

.key--missed {
  // animation: missedkey 1s ease-in-out 0s infinite alternate;
  animation: missedkey 0.7s steps(1, end) 0s infinite;
}
</style>
