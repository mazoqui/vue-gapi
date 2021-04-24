# vue-gapi
A light and fast Google API Vuejs plugin. 

Firebase authentication support!

## Features

- Google UI SignIn button fully customizable
- API Injection
- Simplified Google API (gapi) and Google Firebase authentication 
- SignIn / SignOut events 

## Instalation

Just copy gapi.js to your plugins directory

## Usage

Create your Google authentication settings file

### Basic settings

``` json
{
  "client_id": "CLIENT_ID.apps.googleusercontent.com",
  "scope": "profile email",
  "apiKey": "API_KEY"
}
```

### Firebase authentication settings
If you want your users to signin in your Google Firebase application you must include the Firebase settings by adding the firebase object to the :
 
``` json
{
  "client_id": "CLIENT_ID.apps.googleusercontent.com",
  "scope": "profile email",
  "apiKey": "API_KEY",
  "firebase": {
    "authDomain": "APP_NAME.firebaseapp.com",
    "projectId": "APP_NAME",
    "storageBucket": "APP_NAME.appspot.com",
    "messagingSenderId": "PROJECT_ID",
    "appId": "1:PROJECT_ID:web:XASDASDASSDSDSDSDSD"
  }
}
```

### Instalation
1. Copy the gapi.js file to your plugins folder (here ./plugins)
``` bash

```
2. Edit your main.js file and import the plugin

``` javascript
import Vue from 'vue'
import App from './App.vue'

/* the google api plugin */
import gapi from "./plugins/gapi.js"

/* the authentication settings */
import GAPISettings from "./gapi.json";

/* Original - no Google API support */
// new Vue({
//   render: h => h(App),
// }).$mount('#app')

/* Modified - Google API support */
Vue.use(gapi,{
  ...GAPISettings, // your json gapi settings
  onReady:()=>{
    new Vue({
      render: h => h(App),
    }).$mount('#app')
  }
});
```

The plugin and gapi instance are now available as a Vue js plugin for all components:

``` javascript
this.$gapi
```

Check example App for details on how to handle API methods from your component 

## References

### Google Authentication Reference:
  https://developers.google.com/identity/sign-in/web/reference#gapiauth2clientconfig
  
### List of all api and its scopes:
  https://developers.google.com/oauthplayground/

### All Api scopes
  https://developers.google.com/oauthplayground/getScopes
  
