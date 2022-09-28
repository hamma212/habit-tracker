<template>
  <div id="add-habit">
    <button @click="formActive = true" class="button" type="button">
      <span class="icon-text"
        ><span class="icon is-large mr-1"><i class="fa fa-plus"></i></span
      ></span>
      Add Habit
    </button>
    <div
      class="modal"
      :class="{ 'is-active': formActive }"
      @keydown.esc="resetForm"
      id="add-habit"
    >
      <div class="modal-background" @click="resetForm" />
      <div class="modal-card">
        <header class="modal-card-head">
          <p class="modal-card-title">Add Habit</p>
          <button @click="resetForm" class="delete" aria-label="close"></button>
        </header>
        <section class="modal-card-body has-text-centered">
          <form v-on:submit="addHabit($event)" id="add-habit-form">
            <label for="colorEnabled" class="label">
              Choose way of representing your habit:
            </label>
            <div class="field">
              <input
                id="colorEnabled"
                type="checkbox"
                name="displayToggle"
                class="switch is-rounded is-rtl is-small"
                @click="toggleChooseColor()"
              />
              <label for="colorEnabled" class="label">
                {{ chooseDisplayText }}</label
              >
            </div>

            <div class="field" v-if="!chooseImage">
              <input
                id="color"
                type="color"
                value="#374785"
                v-model="habitColor"
              />
            </div>
            <div class="field" v-else>
              <figure class="image is-64x64 is-inline-block">
                <img v-if="imageData" :src="imageUrl" />
              </figure>
              <div class="file is-small is-centered">
                <label class="file-label">
                  <input
                    type="file"
                    accept="image/*"
                    ref="imageInput"
                    class="file-input"
                    @change="showPreview"
                    required
                  />
                  <span class="file-cta">
                    <span class="file-icon">
                      <i class="fas fa-upload"></i>
                    </span>
                    <span class="file-label"> Image... </span>
                  </span>
                </label>
              </div>
            </div>

            <div class="field-body is-horizontal is-small p-3">
              <div class="field">
                <label class="label required" style="padding-top: 1rem">
                  Habit Name
                </label>
                <input
                  ref="enterHabitName"
                  id="name"
                  class="input"
                  type="text"
                  placeholder="Habit Name"
                  required
                />
              </div>
              <div class="field">
                <input
                  id="goalEnabled"
                  type="checkbox"
                  name="goalDaysToggle"
                  class="switch is-rounded is-rtl is-small"
                  @click="toggleGoalDuration($event)"
                />
                <label for="goalEnabled" class="label is-size-6">
                  Goal Days
                </label>
                <div class="control">
                  <input
                    id="goalDuration"
                    type="number"
                    min="7"
                    max="1825"
                    v-model="goalDuration"
                    disabled
                    @change="
                      () => {
                        if (goalDuration > 1825 || goalDuration < 7) {
                          this.goalDuration = 7;
                        }
                      }
                    "
                  />
                  <!-- <span class="select is-primary">
                    <select id="goalDuration" disabled>
                      <option value="7">7</option>
                      <option value="14">14</option>
                      <option value="30" id="defaultDuration" selected>
                        30
                      </option>
                      <option value="60">60</option>
                      <option value="90">90</option>
                    </select>
                  </span> -->
                </div>
              </div>
              <div class="field" style="padding-top: 1rem">
                <label class="label">{{ updateFrequency }} Times/Day</label>
                <div class="control">
                  <div class="buttons is-centered">
                    <button
                      @click="updateFrequency < 18 ? updateFrequency++ : null"
                      class="button is-success"
                      type="button"
                    >
                      <span class="icon-text"
                        ><span class="icon is-large"
                          ><i class="fas fa-plus"></i></span
                      ></span>
                    </button>
                    <button
                      @click="updateFrequency > 1 ? updateFrequency-- : null"
                      class="button is-danger"
                      type="button"
                    >
                      <span class="icon-text"
                        ><span class="icon is-large"
                          ><i class="fas fa-minus"></i></span
                      ></span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div class="field-body is-horizontal p-3">
              <div class="field">
                <label class="label">
                  {{ startingHabitText }}
                </label>
                <input
                  id="startingHabit"
                  type="checkbox"
                  class="switch is-rounded"
                  checked="checked"
                  @click="startingHabit = !startingHabit"
                />
                <label for="startingHabit"></label>
              </div>
              <div class="field has-text-centered" id="daysOfWeek">
                <div class="control">
                  <label class="label required"> Days of the Week </label>
                  <input
                    id="daysToggleAll"
                    type="checkbox"
                    class="switch is-rounded is-small is-rtl"
                    @change="toggleAllDays"
                    :checked="daysToggleAll"
                  />
                  <label
                    for="daysToggleAll"
                    class="label has-text-grey-dark has-text-weight-normal"
                  >
                    {{ allDaysSelected ? "Deselect All" : "Select All" }}
                  </label>
                  <div class="buttons is-small is-centered has-addons">
                    <div v-for="(value, day) in daysOfWeek" :key="day.key">
                      <button
                        @click="toggleDaySelected(day)"
                        :class="{ 'is-warning is-selected': value }"
                        class="button"
                        type="button"
                      >
                        {{ day }}
                      </button>
                    </div>
                  </div>
                  <p v-if="!validDaysOfWeek" class="help is-danger">
                    At least 1 day must be selected
                  </p>
                </div>
              </div>
            </div>
            <div class="field p-3">
              <div class="control">
                <label class="label">Add to Category</label>
                <div class="buttons is-small is-centered has-addons">
                  <div v-for="category in categories" :key="category.id">
                    <button
                      @click="selectedCategory = category.id"
                      :class="{
                        'is-link is-selected': selectedCategory == category.id,
                      }"
                      class="button"
                      type="button"
                    >
                      {{ category.name }}
                    </button>
                  </div>
                  <button
                    class="button"
                    type="button"
                    @click="selectedCategory = ''"
                    :class="{
                      'is-link is-danger': selectedCategory == '',
                    }"
                  >
                    <span class="icon-text"
                      ><span class="icon is-large mr-1"
                        ><i class="fas fa-ban"></i></span
                    ></span>
                    None
                  </button>
                </div>
              </div>
            </div>
            <footer class="modal-card-footer has-background-grey-light p-2">
              <div class="field">
                <button type="submit" class="button is-dark">
                  <span class="icon-text"
                    ><span class="icon is-large mr-1"
                      ><i class="fas fa-plus"></i></span
                  ></span>
                  Add Habit
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
import { addHabit } from "@/db.js";

import firebase from "firebase/app";
import { auth, db } from "@/firebaseConfig";

export default {
  name: "AddHabitModal",
  components: {},
  data() {
    return {
      formActive: false,
      goalDuration: 30,
      updateFrequency: 1,
      startingHabit: true,
      daysOfWeek: {
        Sun: false,
        Mon: false,
        Tue: false,
        Wed: false,
        Thu: false,
        Fri: false,
        Sat: false,
      },
      daysToggleAll: false,
      categories: [],

      selectedCategory: this.defaultCategory,

      imageData: null,
      imageUrl: null,
      imgName: null,
      habitColor: "#374785",
      chooseImage: false,
    };
  },
  props: {
    defaultCategory: {
      default: "",
      type: String,
    },
  },
  firestore: function () {
    return {
      categories: db
        .collection("category")
        .where("userId", "==", auth.currentUser.uid),
    };
  },
  methods: {
    showPreview() {
      if (this.$refs.imageInput.files) {
        this.imageData = this.$refs.imageInput.files[0];
        this.imageUrl = URL.createObjectURL(this.imageData);
        this.imgName = this.imageData.name;
      } else {
        this.imageData = null;
        this.imgName = null;
      }
    },
    addHabit(e) {
      e.preventDefault();
      //Add image to storage
      // if (this.imageData != null) {
      //   addImage(this.imageData);
      // } else {
      //   this.imgName = "default";
      // }
      if (this.imageData == null) {
        this.imgName = "default";
      }
      // format selected weekdays for db
      let daysOfWeek = [];
      const weekdays = Object.keys(this.daysOfWeek);
      const weekdaysValues = Object.values(this.daysOfWeek);
      for (let i = 0; i < 7; i++) {
        if (weekdaysValues[i]) {
          daysOfWeek.push(weekdays[i]);
        }
      }

      if (!this.validDaysOfWeek) {
        // must have at least 1 day selected
        alert("At least 1 day must be selected");
        return;
      }

      const currentTimestamp = firebase.firestore.Timestamp.fromDate(
        new Date()
      );

      const habit = {
        creationDate: currentTimestamp,
        startDate: currentTimestamp,
        name: e.target.name.value,
        startingHabit: this.startingHabit,
        daysOfWeek: daysOfWeek,
        category: this.selectedCategory,
        updateFrequency: this.updateFrequency,
        currentDayUpdates: 0,
        updateTimes: [],
        completionDays: [],
        checkInTimes: [],
        bestStreak: 0,
        currentStreak: 0,
        userId: auth.currentUser.uid,
        imageName: this.imgName,
        nextUpdateDay: null,
      };

      if (!this.chooseImage) {
        habit["habitColor"] = this.habitColor;
      }
      // habit["nextUpdateDay"] = getNextUpdateDay(habit, currentTimestamp.toDate());

      if (e.target.goalEnabled.checked) {
        // conditional goalDuration
        habit["goalDuration"] = Number(e.target.goalDuration.value);
      }

      addHabit(habit, this.imageData);

      this.resetForm();
    },
    resetForm() {
      this.formActive = false;
      document.getElementById("add-habit-form").reset(); // reset form fields
      document.getElementById("goalDuration").setAttribute("disabled", false);

      this.goalDuration = 30;
      this.updateFrequency = 1;
      this.startingHabit = true;
      this.daysOfWeek = {
        Sun: false,
        Mon: false,
        Tue: false,
        Wed: false,
        Thu: false,
        Fri: false,
        Sat: false,
      };

      this.selectedCategory = this.defaultCategory;

      this.imageData = null;
      this.imageUrl = null;
      this.imgName = null;
      this.chooseImage = false;
    },
    toggleGoalDuration(e) {
      document.getElementById("goalDuration").disabled = !e.target.checked;
    },
    toggleChooseColor() {
      this.chooseImage = !this.chooseImage;
    },
    isDaySelected(day) {
      return this.daysOfWeek[day];
    },
    toggleDaySelected(day) {
      this.daysOfWeek[day] = !this.daysOfWeek[day];
    },
    toggleAllDays() {
      this.daysToggleAll = !this.daysToggleAll;
      Object.keys(this.daysOfWeek).forEach((key) => {
        // if this.daysToggleAll == true, toggle days on
        // if this.daysToggleAll == false, toggle days off
        this.daysOfWeek[key] = this.daysToggleAll;
      });
    },
  },
  computed: {
    startingHabitText: function () {
      return this.startingHabit ? "Starting Habit" : "Breaking Habit";
    },
    chooseDisplayText: function () {
      return this.chooseImage ? "By Image" : "By Color";
    },
    validDaysOfWeek: function () {
      return Object.values(this.daysOfWeek).includes(true);
    },
    allDaysSelected: function () {
      return !Object.values(this.daysOfWeek).includes(false);
    },
  },
  watch: {
    formActive: function () {
      if (this.formActive) {
        this.$nextTick(() => {
          this.$refs.enterHabitName.focus();
        });
      }
    },
    allDaysSelected: function () {
      this.daysToggleAll = this.allDaysSelected;
    },
    defaultCategory: function () {
      this.selectedCategory = this.defaultCategory;
    },
  },
};
</script>

<style scoped>
@import "~bulma-switch";
.required:after {
  content: " *";
  color: red;
}
</style>
