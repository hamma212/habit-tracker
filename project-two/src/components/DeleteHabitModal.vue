<template>
  <div id="delete-habit">
    <button @click="formActive = true" class="button is-dark" type="button">
      <span class="icon-text"
        ><span class="icon is-large mr-1"
          ><i class="fa fa-trash fa-large"></i></span
      ></span>
      Delete Habit
    </button>
    <div class="modal" :class="{ 'is-active': formActive }" @keydown.esc="formActive=false" id="delete-habit">
      <div class="modal-background" @click="formActive = false" />
      <div class="modal-card">
        <header class="modal-card-head">
          <p class="modal-card-title">
            Are you sure you want to delete this habit?
          </p>
          <button
            @click="formActive = false"
            class="delete"
            aria-label="close"
            type="button"
          ></button>
        </header>
        <section class="modal-card-body has-text-centered">
          <div class="buttons is-centered">
            <button ref="deleteButton" @click="deleteHabit" class="button is-danger" type="button">Delete</button>
            <button @click="formActive = false" class="button is-light" type="button">Cancel</button>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<script>
import * as db from "@/db.js";

export default {
  name: "DeleteHabitModal",
  components: {},
  data() {
    return {
      formActive: false,
    };
  },
  props: {
    habitId: String,
  },
  methods: {
    deleteHabit() {
      db.deleteHabit(this.habitId);
      this.$router.replace("/home")
    },
  },
  watch: {
    formActive: function() {
      if (this.formActive){
        this.$nextTick(() => {
          this.$refs.deleteButton.focus()
        })
      }
    }
  }
};
</script>
