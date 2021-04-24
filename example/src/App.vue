<template>
  <div id="app">
    <h1>Vue Google API example</h1>
    <GSignIn 
      @success="onSuccess"
      v-if="!guser"
    />
    <div v-else>      
      <div>{{guser.getBasicProfile()}}</div>
      <div>
        <button @click="listFiles" :disabled="busy">List Google Drive Files</button>
        <button @click="$gapi.$signOut()">Sign out</button>
      </div>
      <div>      
        {{result}}
      </div>
    </div>    
  </div>
</template>

<script>

export default {
  name: 'App',
  components: {
    
  },
  data(){
    return {      
      guser:null,
      result:null,
      busy:false
    }
  },
  methods:{    
    onSuccess(guser){
      this.guser=guser;
      this.$gapi.$load('drive', 'v3', ()=>{
        console.log("gdrive ok");
      })
    },
    listFiles(){
      this.result=null;
      this.busy=true;
      this.$gapi.$grant(
        "https://www.googleapis.com/auth/drive"
      );
      this.$gapi.client.drive.files.list({
        pageSize: 5
      }).then((result)=>{
        this.result=result;
        this.busy=false;
      });
    },    
    onSignOut(){
      this.guser=null;  
      console.log("user sign out");      
    }
  },
  created(){    
    this.$gapi.$on("user:signOut", this.onSignOut);    
  },
  beforeDestroy(){
    this.$gapi.$off("user:signOut", this.onSignOut);
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
