<template>
  <div id="app">
    <SideMenu></SideMenu>
    <router-view/>
  </div>
</template>

<script>
import { auth } from "@/firebaseConfig";
import * as db from "@/db.js";
import SideMenu from "@/components/SideMenu.vue"
export default {
  components: { SideMenu },   
  beforeCreate:function () {
    auth.getRedirectResult().then(result=>{
      if (result.user) {
        db.addUsers(result.user)     
        this.$router.push("/home")
      }
    }).catch(() => {
      this.$router.push("/404")
    }) 
  },
  methods:{

  }
}
</script>

<style>
@import "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.1.1/css/all.min.css";
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background-color: #374785;
}
html {
  height: 100%;
  background-color: #374785;
}
</style>

