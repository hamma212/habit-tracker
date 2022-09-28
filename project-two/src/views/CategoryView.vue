<template>


  <div class="category">
    <section class="hero" :style="{ backgroundColor: category.color }">
      <div class="hero-body has-text-centered is-size-2" :style="{color: getTitleTextColor}">
        {{ category.name }}
      </div>
    </section>
    <div class="block"></div>
    <div class="buttons">
      <EditCategoryModal :categoryId="this.id" />
      <button class="button" @click="confirmingDelete = true">
        <span>Delete</span>
        <span class="icon">
          <i class="fas fa-trash"></i>
        </span>
      </button>
      <AddHabitModal :defaultCategory="this.id" />

    </div>
    
    <sort-habit-selector
      @sortHabits="sortHabits"
    ></sort-habit-selector>
    
    <div class="habits-container box mb-6 mt-6">
      <div class="columns is-centered is-multiline is-mobile mt-2 mr-2-desktop ml-2-desktop">
        <habit-item
          v-for="habit in habits"
          :key="habit.id"
          :title="habit.name"
          :id="habit.id"
        ></habit-item>
      </div>

      <delete-modal
        :confirmingDelete="confirmingDelete"
        :title="category.name"
        @leaveDelete="confirmingDelete = false"
        @deleteObject="deleteCategory"
      ></delete-modal>
    </div>
  </div>
</template>

<script>




import * as dbFile from "@/db.js";

/* eslint-disable */
import { db } from "@/firebaseConfig";
import firebase from "firebase/app";
import DeleteModal from "../components/DeleteModal.vue";
import HabitItem from "@/components/HabitItem.vue";
import EditCategoryModal from "@/components/EditCategoryModal.vue";
import AddHabitModal from "@/components/AddHabitModal.vue";
import SortHabitSelector from '../components/SortHabitSelector.vue'
import { getTextColorFromBackgroundColor } from "@/textColor.js"

export default {
  props: ["id"],
  components: {

    SortHabitSelector,
    HabitItem,
    EditCategoryModal,
    DeleteModal,
    AddHabitModal,

  },
  data: function () {
    return {
      category: false,
      habits: false,
      confirmingDelete: false,

      sortType: false
    };

  },
  firestore: function () {
    return {
      category: db.collection("category").doc(this.id),
      habits: db
        .collection("habit")
        .where("category", "==", this.id)
        .orderBy("name"),
    };
  },
  beforeUpdate: function () {
    if (this.category === null) {
      this.$router.replace({ name: "404" });
    }
  },
  computed: {
    getTitleTextColor: function() {
      let textColor = "black"
      if (this.category){
        textColor = getTextColorFromBackgroundColor(this.category.color)
      }
      return textColor
    }
  },


  watch: {
    id: function () {
      // $bind automatically unbinds the previously bound property
      this.category = false;
      this.$bind("category", db.collection("category").doc(this.id), {
        wait: true,
      });
      this.habits = false;
      this.$bind(
        "habits",
        db.collection("habit").where("category", "==", this.id),
        { wait: true }
      );
      
      this.sortHabits(this.sortType)
    },
  },
  methods: {
    deleteCategory: function () {
      db.collection("category").doc(this.id).delete();
      // For habits belong to the deleted category, set the habit.category to ''
      db.collection('habit').where('category', '==', this.id).get().then(response => {
          let batch = firebase.firestore().batch()
          response.docs.forEach((doc) => {
              const docRef = firebase.firestore().collection('habit').doc(doc.id)
              batch.update(docRef, {category: ''})
          })
          batch.commit().then(() => {
              console.log('updated all documents inside')
          })   
      })        
      this.$router.replace({ name: "home" });
    },
    
    sortHabits: function(sortType) {
          this.sortType = sortType
          if (sortType == 'name'){
            this.$bind('habits', db.collection('habit').where('category', '==', this.id).orderBy('name'))
          }
          else if (sortType == 'time'){
            this.$bind('habits', db.collection('habit').where('category', '==', this.id).orderBy('creationDate', 'desc'))
          }
          else if (sortType == 'today'){
            var timeStampNow = new Date();
            var today = dbFile.dayOfTheWeek(timeStampNow);

            this.$bind('habits', db.collection('habit').where('category', '==', this.id).where('daysOfWeek','array-contains', today).orderBy('name'))
          }
          else if (this.sortType == 'completed'){
                dbFile.getAllCompletedHabitsForCategory(this.id).then((res) => {
                    this.habits = res;
                });
            }
            else {
                console.log("Unsupported habit sorting type")
            }
        }
  },
};

</script>

<style scoped>
.buttons {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}
.hero {
  border-bottom: 1px solid white;
  box-shadow: 0 1px 10px white;
}
</style>
