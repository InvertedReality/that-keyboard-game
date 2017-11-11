<template>
  <div id="app">
    <Game />
  </div>
</template>

<script>
import Game from '@/components/Game';

export default {
  name: 'app',
  components: {
    Game,
  },
};
</script>

<style lang="scss">
@import "./styles/animations.scss";

body {
  margin: 0;
  padding: 0;

  font-family: sans-serif;
}

#app {
  position: relative;
  width: 100vw;
  height: 100vh;
}
</style>
