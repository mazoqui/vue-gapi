# vue-gapi
A light and fast Google API Vuejs plugin. 

Firebase authentication support!

## Features

- Google UI SignIn button fully customizable
- API Injection
- Simplified Google API (gapi) and Google Firebase authentication 
- SignIn / SignOut events 
- Incremental scope request or all at once

## Instalation

Just copy gapi.js to your plugins directory

## Usage

Setup the Google authentication configuration for your application

### Basic settings
The minimal gdata authentication settings

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

*main.js*
``` javascript
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
```

Plugin and gapi instance are available as a Vue js plugin for all components:

``` javascript
this.$gapi
```
### user profile object access

``` html
<!-- from vue template: -->
<div>{{$gapi.$guser.getBasicProfile().getEmail()}}</div>
```
``` javascript
// from the js code
computed:{
  userEmail(){
    return this.$gapi.$guser.getBasicProfile().getEmail()
  },
  userName(){
    return this.$gapi.$guser.getBasicProfile().getName()
  }
}
```

### events

In order to perform custom sign in / out actions, you may define the following event handlers in your **methods** block:

**$signedIn**

called when a user has just signed in (or was already signed in when component was loaded)

*example:*
``` javascript
methods:{    
    $signedIn(){      
      this.$gapi.$load('drive', 'v3', ()=>{
        console.log("gdrive ok");
      })
    }
}
```
**$signedOut**

called when a user signed out

*example:*
``` javascript
methods:{    
    $signedOut(){      
      this.$router.push("/");
    }
}
```

Check example appplication for details
___

## References

### Google Authentication Reference:
  https://developers.google.com/identity/sign-in/web/reference#gapiauth2clientconfig
  
### List of all api and its scopes:
  https://developers.google.com/oauthplayground/

### All Api scopes
  https://developers.google.com/oauthplayground/getScopes
  
