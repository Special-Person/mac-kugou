// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'

import axios from 'axios'
import jsonp from '../static/itools.js'
import store from './store/store'

Vue.prototype.axios = axios
Vue.prototype.jsonp = jsonp

// 禁用鼠标右键
document.oncontextmenu = () => false;

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
