<template>
  <div class="sidebar">
    <b-button v-b-toggle.sidebar-1 squared variant="dark" class="toggle is-size-1"> ☰</b-button>
    <b-sidebar id="sidebar-1" title="Habitual.ly" shadow>
      <template #default="{ hide }">
        <div class="p-3">
          <nav class="mb-3">
            <b-nav vertical>
              <b-nav-item @click="hide" id="login" ><LoginButton></LoginButton></b-nav-item>
              <div class="is-size-4">
                <b-nav-item class="" @click="hide; updateCurrentLink('Home')"><router-link class="page-link has-text-black" :class="{'has-text-weight-bold': currentLink=='Home'}"  to="/home">Home</router-link></b-nav-item>
                <b-nav-item @click="hide; updateCurrentLink('Stats')"><router-link class="page-link has-text-black" :class="{'has-text-weight-bold': currentLink=='Stats'}" to="/stats">Stats</router-link></b-nav-item>
                <b-nav-item @click="hide; updateCurrentLink('Organize')"><router-link class="page-link has-text-black" :class="{'has-text-weight-bold': currentLink=='Organize'}" to="/organize">Organize Habits</router-link></b-nav-item>
                <b-nav-item><p class="has-text-grey">Categories:</p>
                    <b-list-group v-for="cat in categories" :key="cat.id">
                      <side-menu-category
                        :id="cat.id"
                        :currentLink="currentLink"
                        @updateCurrentLink="updateCurrentLink"
                      ></side-menu-category>
                    </b-list-group>
                </b-nav-item>                
              </div>
            </b-nav>
          </nav>
        </div>
      </template>
    </b-sidebar>
  </div>
</template>
<script>
import LoginButton from '@/components/LoginButton.vue'
import {db} from '@/firebaseConfig'
import { auth } from "@/firebaseConfig";
import SideMenuCategory from './SideMenuCategory.vue';

export default {
  name: "SideMenu",
  data: function() {
    return {
      categories: null,
      currentLink: ''
    }
  },
  components: {LoginButton, SideMenuCategory},
  firestore: function() {
    return {
      categories: db.collection("category").where("userId", "==", auth.currentUser.uid).orderBy('name')
    }
  },
  methods: {
    updateCurrentLink: function(linkName) {
      this.currentLink=linkName
    },
    
  },
  computed: {
    
  }
}
</script>

<style scoped>
.sidebar {
  position: absolute;
  z-index: 1000;
  top:0;
  left: 0;
}
/* #login {
    margin-left: -3em;
} */

a {
  text-decoration: none;
}

.page-link:hover {
  /* color: blue; */
  /* text-decoration: underline overline; */

  /* background-color: blue; */
}
</style>
