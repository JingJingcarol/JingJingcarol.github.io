// import "font-awesome/css/font-awesome.css";
import "./css/global.css";
import Vue from 'vue'
import App from './App.vue'
import store from './store'


Vue.config.productionTip = false

new Vue({
  store,
  render: h => h(App)
}).$mount('#root')

