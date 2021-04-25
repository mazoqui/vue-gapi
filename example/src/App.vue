<template>
  <div id="app">
    <h1>Vue Google API example</h1>
    <GSignIn v-if="!$user"/>
    <div v-else>      
      <div>{{$user}}</div>
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
  data(){
    return {
      result:null,
      busy:false
    }
  },
  methods:{    
    $signedIn(){      
      this.$gapi.$load('drive', 'v3', ()=>{
        console.log("gdrive ok");
      })
    },
    listFiles(){
      this.result=null;
      this.busy=true;
      // scopes can be aditioned requested or all at once
      this.$gapi.$grant(
        "https://www.googleapis.com/auth/drive"
      );
      this.$gapi.client.drive.files.list({
        pageSize: 5
      }).then((result)=>{
        this.result=result;
        this.busy=false;
      });
    }
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
