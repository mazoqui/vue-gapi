import Vue from "vue";
/* 
  @description: A Google API and autentication Vue wrapper 
  @author: Marco Aurelio Zoqui

  Google Authentication Reference:
  https://developers.google.com/identity/sign-in/web/reference#gapiauth2clientconfig
  
  List of all api and its scopes:
  https://developers.google.com/oauthplayground/

  All Api scopes
  https://developers.google.com/oauthplayground/getScopes
  
  Firebase authentication integration
  https://github.com/msukmanowsky/gapi-firebase

  */

Vue.component('GSignIn', { 
  render(h) {
    return h('div', {
      'style': {
        "position":"relative",
        "display":"inline-block"
      },
      on:{
        success: $e => {          
          this.$emit('success', $e.detail)
        },
        error: $e => {          
          this.$emit('error', $e.detail)
        }
      }
    })
  },
  mounted(){
    this.$gapi.$btnSignedIn(this.$el);
  }
});


// firebase app if present
const fb = (options)=>{
  const it = {};
  it.app = null;
  
  /*** sign in firebase ***/
  it.signIn=(id_token, access_token)=>{
    if (window.firebase){          
      let cred=window.firebase.auth.GoogleAuthProvider.credential(
        id_token, access_token
      );
      it.app.auth().signInWithCredential(cred)
      .then(({ user }) => {
        console.log('firebase: user signed in!', {
          displayName: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
        })
      });
    }
  };

  /*** sign out firebase ***/
  it.signOut=()=>{
    it.app.auth().signOut();
  };

  // initialize
  options = options || {};
  options.onReady = options.onReady || (()=>{});
  if (!window.firebase && options){
    let script = document.createElement('script');
    script.setAttribute('src', 'https://www.gstatic.com/firebasejs/8.4.0/firebase.js');
    script.setAttribute('type', 'text/javascript');
    script.onload=()=>{
      it.app = window.firebase.initializeApp(options);
      options.onReady(it);
    };
    script.onerror=()=>{
      window.firebase=null;
      options.onReady(null);
    };
    document.getElementsByTagName('head')[0].appendChild(script);
  }
  return it;
};

export default {  
  
  install(Vue, options) { 
    let self=this;    
    self.listeners = [];

    Object.defineProperty(Vue.prototype, '$gapi', { 
      get(){
        return {...window.gapi , ...self};        
      }      
    });    

    const authState=function(signIn){
      
      const event = signIn ? "user:signIn" : "user:signOut";
      self.listeners.forEach(o=>{        
        if (o.e==event && o.f && typeof o.f=="function"){
          (async function (f){
            f(self.$user);            
          })(o.f);
        }
      });    

      if (self.$fb){
        if (signIn){
          self.$fb.signIn(self.$idToken, self.$accessToken);          
        }
        else{
          self.$fb.signOut();
        }
      }
    };

    if (!window.gapi){
      const onReady = (options||{})?.onReady||function(){};
      let script = document.createElement('script');
      script.setAttribute('src', 'https://apis.google.com/js/platform.js');
      script.setAttribute('type', 'text/javascript');
      script.onload=()=>{
        
        window.gapi.load("client",()=>{
          if (options?.apiKey){
            window.gapi.setApiKey=options?.apiKey;
          }
        }); 
        
        window.gapi.load('auth2', ()=>{
          // https://developers.google.com/identity/sign-in/web/reference#gapiauth2clientconfig
          window.gapi.auth2.init({
            client_id: options.client_id,
            scope: options.scope
          }).then((gauth)=>{
            window.gapi.auth2.getAuthInstance().isSignedIn.listen(authState);
            authState(self.$isSignedIn); // important call when user is already logged in
            if (gauth){
                           
              onReady(window.gapi);
            }
            else{
              onReady(null);  
            }
          }).catch(()=>{
            onReady(null);
          });
        });
      };
      script.onerror=()=>{        
        onReady(null);
      };
      document.getElementsByTagName('head')[0].appendChild(script);
    }

    // load firebase
    if (!window.firebase && options.firebase){
      fb({
        ...options.firebase,
        apiKey:options.apiKey,
        onReady: (fbApp)=>{
          self.fb = fbApp;
        }
      });
    }
  },

  /* google api sign in button */
  $btnSignedIn(el){
    if (!el) return;    
    if (!el.id){
      el.id="_gd"+new Date().getTime();
    }
    let cfg={
      'scope':"profile",
      'longtitle': false,
      'theme':"dark",
      'onsuccess': (guser)=>{        
        el.dispatchEvent(new CustomEvent("success",{detail:guser}));
      },
      'onerror':(e)=>{
        el.dispatchEvent(new CustomEvent("error", {detail:e}));            
      }
    };
    ['scope','width','height','longtitle','theme'].forEach((i)=>{
      if (i in el?.dataset && el?.dataset[i]){
        cfg[i]=el?.dataset[i]
      }
    });
    window.gapi.signin2.render(el.id,cfg);
  },

  /* google api sign in call */
  $signIn(){
    if (window?.gapi?.auth2?.getAuthInstance()){
      return window.gapi.auth2.getAuthInstance()?.signIn();
    } 
  },

  /* google api sign call call */
  $signOut(){
    if (window?.gapi?.auth2?.getAuthInstance()){
      return window.gapi.auth2.getAuthInstance()?.signOut();
    }    
  }, 
  
  /* load and gapi */
  $load(name, version, callback){    
    let _cb=callback||function(){};    
    window.gapi.client.load(name, version, _cb);
  },

  /* add additional scopes */
  $grant(scopes){
    let user = this.$user;
    if (user){
      let lst = (scopes||"").split(" ").filter((scope)=>!user.hasGrantedScopes(scope))
      if (lst.length){
        user.grant({
          scope: lst.join(" ")
        });
      }
    }    
  },

  /* app.__vue__.$gapi.$scopes */
  get $scopes(){
    return window?.gapi && window?.gapi?.auth2?.getAuthInstance()?.currentUser?.get().getGrantedScopes() || "";
  },

  // app.__vue__.$gapi.$idToken
  get $user(){
    return window?.gapi && window?.gapi?.auth2?.getAuthInstance()?.currentUser?.get() || null;
  },

  // app.__vue__.$gapi.$basicProfile
  get $basicProfile(){
    return window?.gapi && window?.gapi?.auth2?.getAuthInstance()?.currentUser?.get()?.getBasicProfile() || null;
  },

  // app.__vue__.$gapi.$isSignedIn
  get $isSignedIn(){
    return window?.gapi && window?.gapi?.auth2?.getAuthInstance()?.isSignedIn?.get() || null;
  },

  // app.__vue__.$gapi.$accessToken
  get $accessToken(){    
    return this?.$user ? this?.$user?.getAuthResponse(true)?.access_token:null;
  },

  // app.__vue__.$gapi.$idToken
  get $idToken(){    
    return this?.$user ? this?.$user?.getAuthResponse(true)?.id_token:null;
  },

  // app.__vue__.$gapi.$fb
  get $fb(){    
    return this.fb;
  },

  $on(event, fn){
    // this.$off(event,fn); // only one instance of the same handler
    this.listeners.push({e:event, f:fn})
  },

  $off(event, fn){
    this.listeners = this.listeners.filter(o=>{
      return !(o.e==event && o.f==fn);
    })
  },
};