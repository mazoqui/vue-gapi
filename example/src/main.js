import Vue from 'vue'
import App from './App.vue'

Vue.config.productionTip = false

/* the google api plugin */
import gapi from "./plugins/gapi.js"

/* the authentication settings */
import GAPISettings from "./gapi.json";


/* Original */
// new Vue({
//   render: h => h(App),
// }).$mount('#app')

/* Modified */
Vue.use(gapi,{
  ...GAPISettings,
  onReady:()=>{
    new Vue({
      render: h => h(App),
    }).$mount('#app')
  }
});