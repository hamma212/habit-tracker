<template>
  <div id="edit-habit">
    <button @click="formActive = true" class="button is-dark">
      <span class="icon-text"
        ><span class="icon is-large mr-1"
          ><i class="fa-regular fa-edit fa-xl"></i></span
      ></span>
      Edit Habit
    </button>
    <div
      class="modal"
      :class="{ 'is-active': formActive }"
      id="edit-habit-modal"
      @keydown.esc="formActive = false"
      ref="editHabitModal"
      tabindex="0"
    >
      <div class="modal-background" @click="formActive = false" />
      <div class="modal-card">
        <header class="modal-card-head">
          <p class="modal-card-title">Edit Habit</p>
          <button
            @click="formActive = false"
            class="delete"
            aria-label="close"
          ></button>
        </header>
        <section class="modal-card-body has-text-centered">
          <form v-on:submit="editHabit($event)" id="edit-habit-form">
            <label for="colorEnabled" class="label">
              Change way of representing your habit:
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
                value="#FFFFFF"
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
            <div class="field-body is-horizontal p-3">
              <div class="field">
                <label class="label required" style="padding-top: 1rem">
                  Habit Name
                </label>
                <input
                  id="name"
                  class="input"
                  type="text"
                  placeholder="Habit Name"
                  :value="habit.name"
                  required
                />
              </div>
              <div class="field">
                <input
                  id="goalEnabled"
                  type="checkbox"
                  name="goalDaysToggle"
                  class="switch is-rounded is-rtl is-small"
                  :checked="habit.goalDuration"
                  @click="toggleGoalDuration($event)"
                />
                <label for="goalEnabled" class="label is-size-6">
                  Goal Days
                </label>
                <div class="control">
                  <!-- ~5 year limit -->
                  <input
                    id="goalDuration"
                    type="number"
                    :min="habit.currentStreak ? habit.currentStreak : 7"
                    max="1825"
                    v-model="goalDuration"
                    :disabled="!habit.goalDuration"
                    @change="
                      () => {
                        if (
                          goalDuration > 1825 ||
                          goalDuration <
                            (habit.currentStreak ? habit.currentStreak : 7)
                        ) {
                          this.goalDuration = 7;
                        }
                      }
                    "
                  />
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
                  :checked="startingHabit"
                  @click="startingHabit = !startingHabit"
                />
                <label for="startingHabit"></label>
              </div>
              <div class="field has-text-centered" id="daysOfWeek">
                <div class="control">
                  <label class="label required">Days of the Week</label>
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
                    <!-- TODO: add a toggle all days button -->
                    <!-- TODO: dont allow submit if no days selected -->
                    <!-- TODO: general form validation -->
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
                <div class="buttons is-centered">
                  <DeleteHabitModal :habitId="habitId" />
                  <button type="submit" class="button is-dark">
                    <span class="icon-text"
                      ><span class="icon is-large mr-1"
                        ><i class="fa fa-save fa-large"></i></span
                    ></span>
                    Save Changes
                  </button>
                </div>
              </div>
            </footer>
          </form>
        </section>
      </div>
    </div>
  </div>
</template>

<script>
import { editHabit, editImage, getNextUpdateDay } from "@/db.js";

import firebase from "firebase/app";
import { auth, db } from "@/firebaseConfig";
import DeleteHabitModal from "@/components/DeleteHabitModal.vue";

export default {
  name: "EditHabitModal",
  components: { DeleteHabitModal },
  data: function () {
    return {
      habit: false,
      formActive: false,
      goalDuration: null,
      goalEnabled: false,
      updateFrequency: null,
      startingHabit: null,
      daysOfWeek: null,
      daysToggleAll: false,
      categories: [],
      selectedCategory: null,
      updateTimes: null,
      startDate: null,
      imageName: null,
      imageData: null,
      imageUrl: null,
      habitColor: null,
      chooseImage: false,
    };
  },
  props: {
    habitId: String,
  },
  mounted() {
    this.$bind("habit", db.collection("habit").doc(this.habitId))
      .then((doc) => {
        const data = doc;
        this.updateFrequency = data.updateFrequency;
        this.startingHabit = data.startingHabit;
        this.daysOfWeek = {
          Sun: data.daysOfWeek.includes("Sun"),
          Mon: data.daysOfWeek.includes("Mon"),
          Tue: data.daysOfWeek.includes("Tue"),
          Wed: data.daysOfWeek.includes("Wed"),
          Thu: data.daysOfWeek.includes("Thu"),
          Fri: data.daysOfWeek.includes("Fri"),
          Sat: data.daysOfWeek.includes("Sat"),
        };
        this.selectedCategory = data.category;

        this.imageName = data.imageName;
        this.imageUrl = data.imageUrl;
        this.imageData = true;
        this.updateTimes = data.updateTimes;
        this.startDate = data.startDate;
        this.habitColor = data.habitColor;
        this.goalEnabled = data.goalDuration !== undefined ? true : false;
        this.goalDuration = data.goalDuration ? data.goalDuration : 7;
        this.chooseImage =  data.imageName == "default" ? false : true;

      })
      .catch((error) => {
        console.log("error in loading: ", error);
      });
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
      } else {
        this.imageData = null;
      }
    },
    editHabit(e) {
      e.preventDefault();
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

      const habit = {
        latestSettingsUpdate: firebase.firestore.Timestamp.fromDate(new Date()),
        name: e.target.name.value,
        updateFrequency: this.updateFrequency,
        startingHabit: this.startingHabit,
        daysOfWeek: daysOfWeek,
        category: this.selectedCategory,
      };
      if (this.updateTimes.length == 0) {
        habit["nextUpdateDay"] = getNextUpdateDay(
          habit,
          this.startDate.toDate()
        );
      } else {
        habit["nextUpdateDay"] = getNextUpdateDay(
          habit,
          this.updateTimes[this.updateTimes.length - 1].toDate()
        );
      }
      if (e.target.goalEnabled.checked) {
        // conditional goalDuration
        habit["goalDuration"] = Number(this.goalDuration);
      } else {
        habit["goalDuration"] = firebase.firestore.FieldValue.delete();
      }

      if (this.chooseImage) {
        if (this.imageData != null && this.imageData != true) {
          editImage(this.imageData, this.habitId);
        }
      } else {
        if (this.habitColor != "#ffffff") {
          habit["habitColor"] = this.habitColor;
          habit["imageName"] = "default";
        }
      }
      
      editHabit(habit, this.habitId);
    },
    toggleGoalDuration(e) {
      document.getElementById("goalDuration").disabled = !e.target.checked;
    },
    toggleStartHabit() {
      this.startingHabit = !this.startingHabit;
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
    validDaysOfWeek: function () {
      return this.daysOfWeek
        ? Object.values(this.daysOfWeek).includes(true)
        : false;
    },
    chooseDisplayText: function () {
      return this.chooseImage ? "By Image" : "By Color";
    },
    allDaysSelected: function () {
      return this.daysOfWeek
        ? !Object.values(this.daysOfWeek).includes(false)
        : false;
    },
  },
  watch: {
    formActive: function () {
      if (this.formActive) {
        this.$nextTick(() => {
          this.$refs.editHabitModal.focus();
        });
      } else {
        // Reload habitStats after closing editModal
        this.$router.go();
      }
    },
    allDaysSelected: function () {
      this.daysToggleAll = this.allDaysSelected;
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
