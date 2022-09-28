<template>
  <div>
    <!-- <section class="hero is-light is-fullheight"> -->
      <!-- Hero head: will stick at the top -->
      <div class="is-light is-fullheight">
        <header class="navbar">
          <div class="container">
            <div class="navbar-brand">
              <a class="navbar-item"> <strong>APP NAME</strong> </a>
              <span class="navbar-burger" data-target="navbarMenuHeroC">
                <span></span>
                <span></span>
                <span></span>
              </span>
            </div>
            <div id="navbarMenuHeroC" class="navbar-menu">
              <div class="navbar-end">
                <router-link to="/" class="navbar-item is-active"
                  >Welcome</router-link
                >
                <router-link to="/home" class="navbar-item">Home</router-link>
                <router-link to="/about" class="navbar-item">About</router-link>

                <span class="navbar-item">
                  <LoginButton />
                </span>
              </div>
            </div>
          </div>
        </header>
      </div>
    <!-- </section> -->
  </div>
</template>

<script>
// @ is an alias to /src

import LoginButton from '../components/LoginButton'


export default {
  name: "SplashView",
  components: {
      LoginButton,
      
  },
};
</script>