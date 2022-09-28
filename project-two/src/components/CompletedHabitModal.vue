<template>
  <div id="completed-habit">
    <button @click="formActive = true" class="button" type="button">
      <span class="icon">
        <i class="fa fa-arrow-up-right-dots"></i>
      </span>
      <span>Continue Habit</span>
    </button>
    <div
      class="modal"
      :class="{ 'is-active': formActive }"
      @keydown.esc="formActive = false"
      ref="completedHabitModal"
      id="completed-habit-modal"
      tabindex="0"
    >
      <div class="modal-background" @click="formActive = false" />
      <div class="modal-card">
        <header class="modal-card-head">
          <p class="modal-card-title">Continue Habit</p>
          <button
            @click="formActive = false"
            class="delete"
            aria-label="close"
          ></button>
        </header>
        <section class="modal-card-body has-text-centered">
          <form>
            <div class="field-body is-horizontal p-3">
              <div class="field">
                <button
                  @click="removeGoalDuration"
                  class="button is-link"
                  type="button"
                >
                  <span class="icon-text"
                    ><span class="icon is-large mr-1"
                      ><i class="fa-regular fa-calendar-xmark"></i></span
                  ></span>
                  Disable Goal Duration
                </button>
              </div>
            </div>
            <div class="field-body is-horizontal p-3">
              <div class="field">
                <label class="label">
                  Extend Goal by {{ selectedDuration }} days:</label
                >
                <span class="select is-primary">
                  <select id="extendDays" v-model="selectedDuration">
                    <option value="7">7</option>
                    <option value="14">14</option>
                    <option value="30">30</option>
                    <option value="60">60</option>
                    <option value="90">90</option>
                  </select>
                </span>
              </div>
              <div class="field">
                <button
                  @click="extendGoalDuration"
                  class="button"
                  type="button"
                >
                  <span class="icon-text"
                    ><span class="icon is-large mr-1"
                      ><i class="fa-regular fa-calendar-plus"></i></span
                  ></span>
                  Extend Goal Duration
                </button>
              </div>
            </div>
            <footer class="modal-card-footer has-background-grey-light p-2">
              <div class="field">
                <button
                  @click="formActive = false"
                  type="button"
                  class="button is-danger"
                >
                  Cancel
                </button>
              </div>
            </footer>
          </form>
        </section>
      </div>
    </div>
  </div>
</template>

<script>
import { editHabit } from "@/db";
import firebase from "firebase/app";

export default {
  data() {
    return {
      formActive: false,
      selectedDuration: "30",
    };
  },
  props: {
    habitId: String,
  },
  methods: {
    removeGoalDuration() {
      this.formActive = false;
      editHabit(
        {
          goalDuration: firebase.firestore.FieldValue.delete(),
        },
        this.habitId
      );
    },
    extendGoalDuration() {
      this.formActive = false;
      editHabit(
        {
          goalDuration: firebase.firestore.FieldValue.increment(
            Number(this.selectedDuration)
          ),
          extended: true,
        },
        this.habitId
      );
    },
  },
};
</script>

<style></style>
