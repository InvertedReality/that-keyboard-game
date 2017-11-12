<template lang="html">
  <div :class="['player-keys', `player-keys--${playerId}`]">
    <transition-group name="key-row" class="keys-container" tag="div">
      <div v-for="(key, rowIndex) in player.keys" :key="key.id" class="key-row">
        <div
          v-for="keyIndex in [0, 1, 2, 3]"
          :class="keyClasses(keyIndex, key, rowIndex)"
        >
          <div class="key-well">
            <div class="key-button">
              <div class="key-button-top"></div>
            </div>
          </div>
        </div>
      </div>
    </transition-group>
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
      const current = thisKey === rowKey.key && !missed;
      const active = current && rowIndex === 0;

      return {
        key: true,
        'key--current': current,
        'key--active': active,
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
  background: #333;
}

.keys-container {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column-reverse;
}


$key-row-transition-time: 0.3s;

.key-row {
  flex: 0 0 auto;
  height: 16.7%;

  display: flex;
  flex-direction: row;
  align-items: stretch;

  transition: height $key-row-transition-time;
}

.key-row-leave-active {
  height: 0%;
}

.key {
  $border-radius: 10px;

  flex: 1 1 auto;

  display: flex;
  align-items: stretch;

  margin-bottom: 0%;
  transition: margin-bottom $key-row-transition-time;

  .key-row-leave-active & {
    margin-bottom: -25%;
  }
}

.key-well {
  flex: 1 1 auto;
  margin: 5px;
  border-radius: 10px;

  display: flex;
  align-items: stretch;
  background: rgba(0, 0, 0, 0.5);
  box-shadow: 0 1px 1px 1px transparentize(#fff, 0.95);
}

$other-key-button-color: #333;
$other-key-button-top-color: #555;

.key-button,
.key-button-top {
  display: flex;
  flex: 1 1 auto;
  align-items: stretch;
  border-radius: 6px;
}

.key-button {
  margin: 8px 8px 4px;
  background: $other-key-button-color;
  box-shadow:
    inset 0 6px 6px 3px rgba(0, 0, 0, 0.5),
    inset 0 -8px 8px -4px rgba(0, 0, 0, 0.3);
}

.key-button-top {
  margin: -6px 0 10px;
  background: $other-key-button-top-color;

  box-shadow:
    inset -1px -1px 2px 0px rgba(0, 0, 0, 0.3),
    inset 0 0 32px 8px rgba(0, 0, 0, 0.3);
}

.key--current {
  .key-button {
    .player-keys--0 & {
      background: darken($player-0-color, 25%);
    }

    .player-keys--1 & {
      background: darken($player-1-color, 35%);
    }
  }

  .key-button-top {
    .player-keys--0 & {
      background: darken($player-0-color, 5%);
    }

    .player-keys--1 & {
      background: darken($player-1-color, 15%);
    }
  }
}

@keyframes player-0-active-key-button {
  from {
    background: darken($player-0-color, 35%);
  }

  to {
    background: darken($player-0-color, 15%);
  }
}

@keyframes player-1-active-key-button {
  from {
    background: darken($player-1-color, 45%);
  }

  to {
    background: darken($player-1-color, 25%);
  }
}

@keyframes player-0-active-key-button-top {
  from {
    background: darken($player-0-color, 15%);
  }

  to {
    background: lighten($player-0-color, 5%);
  }
}

@keyframes player-1-active-key-button-top {
  from {
    background: darken($player-1-color, 25%);
  }

  to {
    background: darken($player-1-color, 5%);
  }
}

.key--active {
  $pulse-animation-time: (0.7s / 2);

  .key-button {
    .player-keys--0 & {
      animation: player-0-active-key-button $pulse-animation-time ease-in-out 0s alternate infinite;
    }

    .player-keys--1 & {
      animation: player-1-active-key-button $pulse-animation-time ease-in-out 0s alternate infinite;
    }
  }

  .key-button-top {
    .player-keys--0 & {
      animation: player-0-active-key-button-top $pulse-animation-time ease-in-out 0s alternate infinite;
    }

    .player-keys--1 & {
      animation: player-1-active-key-button-top $pulse-animation-time ease-in-out 0s alternate infinite;
    }
  }
}

@keyframes missed-key-button {
  from {
    background-color: darken($key-missed-color, 25%);
  }

  50% {
    background-color: $other-key-button-color;
  }
}

@keyframes missed-key-button-top {
  from {
    background-color: $key-missed-color;
  }

  50% {
    background-color: $other-key-button-top-color;
  }
}

.key--missed {
  .key-button {
    animation: missed-key-button 0.7s step-end 0s infinite;
  }

  .key-button-top {
    animation: missed-key-button-top 0.7s step-end 0s infinite;
  }
}

// TODO: Implement press animations.
// .key-row--pressed .key--current {
//   .key-button {
//     .player-keys--0 & {
//       background: darken($player-0-color, 15%);
//     }
//
//     .player-keys--1 & {
//       background: darken($player-1-color, 25%);
//     }
//   }
//
//   .key--current .key-button-top {
//     .player-keys--0 & {
//       background: lighten($player-0-color, 10%);
//     }
//
//     .player-keys--1 & {
//       background: lighten($player-1-color, 0%);
//     }
//   }
// }
</style>
