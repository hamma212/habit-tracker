<template>
  <div class="auth">
    <template v-if="!user">
      <button class="button is-danger" @click="signInWithGoogle">
        Sign in with Google
      </button>
    </template>
    <template v-if="user">
      <nav class="level">
        <div class="level-item">
          <div>
            <img
              class="avatar"
              :src="user.photoURL"
              alt="avatar"
              referrerpolicy="no-referrer"
            />
          </div>
        </div>
        <div class="level-item">
          <button @click="signOut" class="button">Sign Out</button>
        </div>
      </nav>
    </template>
  </div>
</template>

<script>
import { auth, provider } from "@/firebaseConfig";

export default {
  components: {},
  name: "LoginButton",
  data() {
    return {
      user: null,
    };
  },
  beforeCreate: function () {
    auth.onAuthStateChanged((user) => {
      // uncomment above to check out which user properties are available.
      if (user) {
        this.user = user;
      } else {
        this.user = null;
      }
    });
  },
  methods: {
    signInWithGoogle: function () {
      auth
        .signInWithRedirect(provider)
        .then((result) => {
          this.user = result.user;
        })
        .catch((err) => console.log(err));
    },
    signOut: function () {
      auth
        .signOut()
        .then(() => {
          this.user = null;
          if (this.$route.path !== "/") {
            this.$router.push("/");
          }
        })
        .catch((err) => console.log(err));
    },
  },
};
</script>

<style scoped>
.avatar {
  width: 4em;
  height: 4em;
  object-fit: contain;
}
.button {
  margin-left: -1em;
}
.level {
  margin-left: 1em;
}
</style>
