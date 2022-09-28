<template>
  <div>
    <div class="columns is-mobile">
      <div class="column"></div>
      <div class="column">
        <div class="card has-text-centered" style="z-index: 100; top: 70%; background-color: #A8D0E6;">
          <div class="card-header">
            <h1 class="card-header-title is-centered has-text-white">Habitual.ly</h1>
          </div>
          <div v-if="user === false" class="card-content has-text-white">
            <h3>Please Sign In To Continue.</h3>
            <div class="block"></div>
            <LoginButton/>
          </div>
          <div v-else class="card-content has-text-white">
            <h3>Welcome!</h3>
            <div class="block"></div>
            <router-link class="button is-danger" to="/home">Go to My Habits</router-link>
          </div>
        </div>
      </div>
      <div class="column"></div>
    </div>
    <ParticlesView/>
  </div>
</template>

<script>
// @ is an alias to /src
import ParticlesView from '@/components/ParticlesView.vue'
import LoginButton from '@/components/LoginButton.vue'
import { auth } from '@/firebaseConfig'
export default {
  name: "SplashView",
  components: {
    ParticlesView, LoginButton
  },
  data: function() {
    return {
      user: false
    }
  },
  beforeCreate: function() {
    auth.onAuthStateChanged(user => {
      if (user) {        
        this.user = true;
      }
    });
  }
};

</script>

<style scoped>
</style>
