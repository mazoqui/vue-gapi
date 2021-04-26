import Vue from 'vue'
import App from './App.vue'

Vue.config.productionTip = false

/* the google api plugin */
import gapi from "./plugins/gapi.js"
/* install the plugin */
Vue.use(gapi,{
  "client_id": "CLIENT_ID.apps.googleusercontent.com",
  "scope": "profile email",
  "apiKey": "API_KEY",
  "firebase": {
    "authDomain": "PROJECT_NAME.firebaseapp.com",
    "projectId": "PROJECT_NAME",
    "storageBucket": "PROJECT_NAME.appspot.com",
    "messagingSenderId": "PROJECT_ID",
    "appId": "APP_ID"
  }
});

new Vue({
  render: h => h(App),
}).$mount('#app')