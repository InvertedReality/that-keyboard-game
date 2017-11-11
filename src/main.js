// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import Vuex from 'vuex';
import appStore from './store';
import App from './App';

Vue.config.productionTip = false;

Vue.use(Vuex);

const store = new Vuex.Store(appStore);

store.dispatch('initPlayer', { playerId: 0 });
store.dispatch('initPlayer', { playerId: 1 });

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  template: '<App/>',
  components: { App },
});
