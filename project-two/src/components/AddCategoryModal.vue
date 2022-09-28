<template>
  <div id="add-category">
    <button @click="formActive = true" class="button">
      <span class="icon-text"
        ><span class="icon is-large mr-1"
          ><i class="fa-regular fa-plus fa-xl"></i></span
      ></span>
      Add Category
    </button>
    <div class="modal" :class="{ 'is-active': formActive }" @keydown.esc="formActive = false" id="add-habit">
      <div class="modal-background" @click="formActive = false" />
      <div class="modal-card">
        <header class="modal-card-head">
          <p class="modal-card-title">Add Category</p>
          <button
            @click="formActive = false"
            class="delete"
            aria-label="close"
          ></button>
        </header>
        <section class="modal-card-body has-text-centered">
          <form v-on:submit="addCategory($event); formActive = false">
            <div class="field-body is-horizontal p-3">
              <div class="field">
                <label class="label"> Category Name </label>
                <input
                  ref="enterCategoryName"
                  id="name"
                  class="input"
                  type="text"
                  placeholder="Category Name"
                  v-model="catName"
                  required
                />
              </div>

              <div class="field">
                <label class="label"> Background Color:</label>
                  <input
                    id="color"
                    type="color"
                    value="#ffffff"
                    v-model="catColor"
                  />
              </div>
            </div>
            <footer class="modal-card-footer has-background-grey-light p-2">
              <div class="field">
                <button type="submit" class="button is-dark" >Add Category</button>
              </div>
            </footer>
          </form>
        </section>
      </div>
    </div>
  </div>
</template>

<script>
import * as db from "@/db.js";
import { auth } from "@/firebaseConfig";

export default {
  name: "AddHabitModal",
  components: {},
  data() {
    return {
      formActive: false,
      catName: "",
      catColor: "#ffffff"
    };
  },
  methods: {
    addCategory(e) {
      e.preventDefault();
      const category = {
        color: this.catColor,
        name: this.catName,
        userId: auth.currentUser.uid,
      };

      db.addCategory(category);
      e.target.color.value = "#ffffff"
      e.target.name.value = ""
    }
  },
  watch: {
    formActive: function() {
      if (this.formActive){
        this.$nextTick(() => {
          this.$refs.enterCategoryName.focus()
        });
      }
      //clear the form here *****
      else {
        this.catName = "";
        this.catColor = "#ffffff"
        //add statment to reset color ****
      }
    }
  }
}
</script>

<style></style>
