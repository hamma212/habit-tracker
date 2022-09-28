<template>
  <div class="organize">
      <section class="hero">
        <div class="hero-body has-text-centered is-size-2 is-size-3-mobile has-text-black">Organize Habits</div>
      </section>
      <div class="block has-text-centered"></div>
        <p class="subtitle has-text-centered has-text-white">Drag and drop habits to change their category.</p>
      <div>
        <div class="columns is-centered is-multiline is-mobile mt-2 mr-2 ml-2">
          <div>
            <NoCategoryBox/>
          </div>
          <div v-for="cat in categories" :key="cat.id">
            <CategoryBox :id="cat.id"/>
          </div>
        </div>
      </div>
      <div class="block"></div>
      <div class="trash">
        <span class="icon" @drop="onDrop($event)" @dragover.prevent @dragenter.prevent>
          <i class="fas fa-trash"></i>
        </span>
      </div>
      <div class="block"></div>
  </div>
</template>

<script>
import CategoryBox from '@/components/CategoryBox.vue'
import NoCategoryBox from '@/components/NoCategoryBox.vue'
import {db} from '@/firebaseConfig'
import { auth } from "@/firebaseConfig";

export default {
  data: function() {
    return {
      categories: false
    }
  },
  components: {
    CategoryBox,NoCategoryBox
  },
  firestore: function() {
    return {
      categories: db.collection("category").where("userId", "==", auth.currentUser.uid)
    }
  },
  methods: {
    onDrop(evt) {
      const habitId = evt.dataTransfer.getData('habitID')
      db.collection("habit").doc(habitId).delete();
      console.log("habit deleted")
    }
  }

}
</script>

<style scoped>
.hero {
  background-color: #A8D0E6;
  border-bottom: 1px solid #f14668;
  box-shadow: 0 1px 10px #f14668;
}
.trash {
  display: flex;
  justify-content: center;
}
.icon {
  padding: 0.5em;
  font-size: xxx-large;
  background-color: white;
  opacity: 75%;
  height: 2em;
  width: 2em;
  border-radius: 0.2em;
}
</style>