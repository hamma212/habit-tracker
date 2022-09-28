<template>
  <div
    class=""
    @mousedown="testMousedown"
    @touchstart="testTouchstart"
    @click="testClick"
    @mouseout="testMouseout"
    @touchend="testTouchend"
    @touchcancel="testTouchcancel"
    @mouseup="testMouseup"
  >
    <!-- <router-link class="" :to="{ name: 'oneHabit', params: { id: id } }" :is="disableRouterLink ? 'span' : 'router-link'"> -->

    <div class="img-container">
      <vue-ellipse-progress
        :progress="dailyProgress"
        :color="categoryColor"
        line="round"
        empty-color="#eeeeee"
        :size="125"
        :thickness="3"
        :empty-thickness="3"
        lineMode="normal 0"
        :legend="false"
        animation="default 500 100"
        fontSize="1.5rem"
        mode="out-over"
        class="progress-circle center"
        :loading="dataLoading"
        :dot="getProgressDot"
      >
        <img
          slot="legend-caption"
          :src="imgUrl"
          class="is-rounded"
          id="image"
          :style="{ background: color }"
        />
      </vue-ellipse-progress>
    </div>

    <!-- </router-link> -->
  </div>
</template>

<script>
import { db } from "@/firebaseConfig";
import * as dbFile from "@/db.js";

///STREAK UPDATE
import firebase from "firebase/app";
import { getNextUpdateDay, dayOfTheWeek } from "@/db.js";

export default {
  components: {},
  props: {
    id: String,
    title: String,
  },

  data: function () {
    return {
      habitData: false,
      categoryData: false,
      imgUrl: null,
      dataLoading: true,

      updateStreakTimer: null,
      disableRouterLink: false,

      window: {
        width: 0,
      },

      progressBarSize: 0,

      //STREAK UPDATE
      className: null,
      streak: 0,
      checkInTimes: null,
      currentDayUpdates: null,
      color: "",
    };
  },
  firestore: function () {
    return {
      habitData: db.collection("habit").doc(this.id),
    };
  },
  computed: {
    dailyProgress: function () {
      if (this.habitData) {
        if (this.habitData.updateTimes.length > 0) {
          if (!this.isNewDayProgress(this.habitData.updateTimes)) {
            return 100;
          } else {
            return (
              (this.habitData.currentDayUpdates /
                this.habitData.updateFrequency) *
              100
            );
          }
        } else {
          return (
            (this.habitData.currentDayUpdates /
              this.habitData.updateFrequency) *
            100
          );
        }
      } else {
        return 0;
      }
    },

    categoryColor: function () {
      if (this.categoryData) {
        // default color overwritten
        return this.categoryData.color;
      } else {
        // default color chosen for habits
        return "#2ff0af";
      }
    },
    getProgressDot: function () {
      var timeStampNow = new Date();
      var today = dbFile.dayOfTheWeek(timeStampNow);
      // display different dot depending on whether habit needs to be udpated today
      // can also check if today is in daysOfWeek
      if (this.habitData && this.habitData.daysOfWeek.includes(today)) {
        return "5% red";
      } else {
        return "5% gray";
      }
    },
    getProgressBarSize: function () {
      if (this.window.width > 1024) {
        return "140";
      } else {
        return "125";
      }
    },
  },

  watch: {
    habitData: function () {
      this.dataLoading = false;
      if (this.habitData.category != "") {
        this.$bind(
          "categoryData",
          db.collection("category").doc(this.habitData.category)
        );
      }
      if (this.habitData.imageName != "default") {
        this.color = "";
        this.imgUrl = this.habitData.imageUrl;
      } else {
        this.color = this.habitData.habitColor;
      }

      //STREAK UPDATE
      this.streak = this.habitData.currentStreak;
      this.currentDayUpdates = this.habitData.currentDayUpdates;
      this.checkInTimes = this.habitData.checkInTimes;
      if (this.habitData.updateTimes.length > 0) {
        //if its a new day
        if (this.isNewDay(this.habitData.updateTimes)) {
          //if today is an update day
          if (this.habitData.daysOfWeek.includes(dayOfTheWeek(new Date()))) {
            //check if the streak was broken
            if (!this.isGoalComplete()) {
              if (this.isBroken()) {
                if (this.currentDayUpdates == 0) {
                  this.$firestoreRefs.habitData.update({
                    nextUpdateDay: null,
                    currentStreak: 0,
                  });
                }
              }
            }
          }
        }
      }
    },
  },
  methods: {
    isNewDayProgress(times) {
      var date = new Date();
      var today =
        "Date: " +
        (date.getMonth() + 1) +
        "/" +
        date.getDate() +
        "/" +
        date.getFullYear();
      date = times[times.length - 1].toDate();
      var lastUpdate =
        "Date: " +
        (date.getMonth() + 1) +
        "/" +
        date.getDate() +
        "/" +
        date.getFullYear();
      if (lastUpdate == today) {
        if (this.habitData.currentDayUpdates < this.habitData.updateFrequency) {
          return true;
        } else {
          return false;
        }
      } else {
        return true;
      }
    },

    testMousedown: function () {
      // MOUSEDOWN
      this.startUpdateStreakTimer();
    },
    testTouchstart: function () {
      // TOUCHSTART
      this.startUpdateStreakTimer();
    },
    testClick: function () {
      // CLICK -- CANCEL
      this.cancelUpdateStreakTimer();
    },
    testMouseout: function () {
      // MOUSEOUT --  CANCEL
      this.cancelUpdateStreakTimer();
    },
    testTouchend: function () {
      // TOUCHEND -- CANCEL
      this.cancelUpdateStreakTimer();
    },
    testTouchcancel: function () {
      // console.log("NOT CALLED")
      // console.log("TOUCHCANCEL")
    },
    testMouseup: function () {
      // console.log("MOUSEUP -- CANCEL")
      this.cancelUpdateStreakTimer();
    },
    startUpdateStreakTimer: function () {
      this.updateStreakTimer = setTimeout(() => {
        this.disableRouterLink = true;
        // console.log("0.5 SECOND TOUCH!!!!!!")
        this.updateStreak();
      }, 500);
    },
    cancelUpdateStreakTimer: function () {
      this.disableRouterLink = false;
      clearTimeout(this.updateStreakTimer);
      this.updateStreakTimer = null;
    },

    ///STREAK UPDATE
    updateStreak() {
      if (this.habitData) {
        // check if its the first day
        if (
          this.habitData.updateTimes.length == 0 ||
          this.habitData.currentStreak == 0
        ) {
          this.firstDay();
        } else if (this.habitData.extended == true) {
          const currentTimestamp = firebase.firestore.Timestamp.fromDate(
            new Date()
          );
          this.currentDayUpdates += 1;
          //update however many times for day add check in time
          this.$firestoreRefs.habitData.update({
            currentDayUpdates: this.currentDayUpdates,
            checkInTimes:
              firebase.firestore.FieldValue.arrayUnion(currentTimestamp),
          });
          //if we've updated enough times for the day
          if (this.currentDayUpdates == this.habitData.updateFrequency) {
            this.streak += 1;
            //check if we completed duration of streak and add to completion days
            this.isGoalComplete();
            //add timestamp to updatetimes, increment streak
            this.$firestoreRefs.habitData.update({
              updateTimes:
                firebase.firestore.FieldValue.arrayUnion(currentTimestamp),
              currentStreak: this.streak,
              nextUpdateDay: getNextUpdateDay(
                this.habitData,
                currentTimestamp.toDate()
              ),
              extend: false,
            });
            this.isBestStreak();
          }
        } else {
          if (
            this.isNewDay(this.habitData.updateTimes) &&
            this.isDayToUpdate()
          ) {
            if (!this.isGoalComplete) {
              // get the current timestamp
              const currentTimestamp = firebase.firestore.Timestamp.fromDate(
                new Date()
              );
              this.currentDayUpdates += 1;
              //update however many times for day add check in time
              this.$firestoreRefs.habitData.update({
                currentDayUpdates: this.currentDayUpdates,
                checkInTimes:
                  firebase.firestore.FieldValue.arrayUnion(currentTimestamp),
              });
              //if we've updated enough times for the day
              if (this.currentDayUpdates == this.habitData.updateFrequency) {
                this.streak += 1;
                //check if we completed duration of streak and add to completion days
                this.isGoalComplete();
                //add timestamp to updatetimes, increment streak
                this.$firestoreRefs.habitData.update({
                  updateTimes:
                    firebase.firestore.FieldValue.arrayUnion(currentTimestamp),
                  currentStreak: this.streak,
                  nextUpdateDay: getNextUpdateDay(
                    this.habitData,
                    currentTimestamp.toDate()
                  ),
                });
                this.isBestStreak();
              }
            }
          }
        }
      }
    },
    firstDay() {
      if (this.habitData) {
        const currentTimestamp = firebase.firestore.Timestamp.fromDate(
          new Date()
        );
        if (
          this.habitData.daysOfWeek.includes(
            dayOfTheWeek(currentTimestamp.toDate())
          )
        ) {
          this.currentDayUpdates += 1;
          this.$firestoreRefs.habitData.update({
            currentDayUpdates: this.currentDayUpdates,
            checkInTimes:
              firebase.firestore.FieldValue.arrayUnion(currentTimestamp),
          });
          if (this.currentDayUpdates == this.habitData.updateFrequency) {
            if (!this.habitData.initialStartDate) {
              this.$firestoreRefs.habitData.update({
                initialStartDate: currentTimestamp,
              });
            }
            this.streak = 1;
            this.$firestoreRefs.habitData.update({
              updateTimes:
                firebase.firestore.FieldValue.arrayUnion(currentTimestamp),
              startDate: currentTimestamp,
              currentStreak: this.streak,
              nextUpdateDay: getNextUpdateDay(
                this.habitData,
                currentTimestamp.toDate()
              ),
            });
            // this.resetCurrentDay();
            this.isBestStreak();
          }
        }
      }
    },
    resetCurrentDay() {
      this.$firestoreRefs.habitData.update({
        currentDayUpdates: 0,
      });
    },
    isBestStreak() {
      if (this.habitData.bestStreak < this.streak) {
        this.$firestoreRefs.habitData.update({
          bestStreak: this.streak,
        });
      }
    },
    isNewDay(times) {
      var date = new Date();
      var today = this.makeIntoDate(date);

      date = times[times.length - 1].toDate();
      var lastUpdate = this.makeIntoDate(date);

      //last update was today
      if (lastUpdate == today) {
        // if there arent enough updates for the day
        if (this.habitData.currentDayUpdates < this.habitData.updateFrequency) {
          if (this.streak == this.habitData.bestStreak) {
            this.$firestoreRefs.habitData.update({
              bestStreak: this.habitData.bestStreak - 1,
            });
          }
          this.streak -= 1;
          this.$firestoreRefs.habitData.update({
            currentStreak: this.streak,
            updateTimes: firebase.firestore.FieldValue.arrayRemove(
              times[times.length - 1]
            ),
            nextUpdateDay: dayOfTheWeek(date),
          });
          return true;
        } else {
          return false;
        }
      } else {
        var lastCheckIn = this.checkInTimes;
        if (this.findLastCheckIn(lastCheckIn) == today) {
          return true;
        } else {
          this.resetCurrentDay();
          return true;
        }
      }
    },
    makeIntoDate(date) {
      var day =
        "Date: " +
        (date.getMonth() + 1) +
        "/" +
        date.getDate() +
        "/" +
        date.getFullYear();
      return day;
    },
    isGoalComplete() {
      if (this.habitData.goalDuration != undefined) {
        if (this.habitData.currentStreak == this.habitData.goalDuration) {
          return true;
        }
      }
      return false;
    },
    isDayToUpdate() {
      var timeStampNow = new Date();
      var updateDays = this.habitData.daysOfWeek;
      var today = dayOfTheWeek(timeStampNow);
      const elapsedDays = this.daysElapsed(timeStampNow);
      //Check if its a correct day to update
      if (updateDays.includes(today)) {
        if (this.habitData.nextUpdateDay == today) {
          //its the correct day but its been more than a week.
          if (elapsedDays > 8) {
            this.resetStreak();
            return false;
          } else {
            return true;
          }
        } else if (elapsedDays == 0) {
          // case where user updated days of week
          return true;
        } else {
          //you missed a day
          this.resetStreak();
          return false;
        }
      } else {
        return false;
      }
    },
    findLastCheckIn(lastCheckIn) {
      return this.makeIntoDate(lastCheckIn[lastCheckIn.length - 1].toDate());
    },
    resetStreak() {
      this.$firestoreRefs.habitData.update({
        nextUpdateDay: null,
        currentStreak: 0,
      });
      this.resetCurrentDay();
    },
    daysElapsed(timeStampNow) {
      var updateTimes = this.habitData.updateTimes;
      const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
      var lastDate = updateTimes[updateTimes.length - 1].toDate();
      var elapsedDays = Math.round(
        Math.abs((lastDate - timeStampNow) / oneDay)
      );
      return elapsedDays;
    },
    isBroken() {
      var timeStampNow = new Date();
      var updateDays = this.habitData.daysOfWeek;
      var today = dayOfTheWeek(timeStampNow);
      var elapsedDays = this.daysElapsed(timeStampNow);
      //Check if its a correct day to update
      if (updateDays.includes(today)) {
        if (this.habitData.nextUpdateDay == today) {
          if (elapsedDays > 8) {
            // this.resetStreak();
            return true;
          } else {
            return false;
          }
        } else {
          return true;
        }
      } else {
        return true;
      }
    },

    //CREDIT: https://codepen.io/sethdavis512/pen/EvNKWw
    //https://medium.com/emblatech/ways-to-force-vue-to-re-render-a-component-df866fbacf47
    handleResize() {
      this.window.width = window.innerWidth;
      if (this.window.width > 1024 && this.progressBarSize != 140) {
        this.progressBarSize = 140;
        // this.$emit('forceRerender');
      } else if (this.window.width > 1024 && this.progressBarSize != 125) {
        this.progressBarSize = 125;
        // this.$emit('forceRerender');
      }
    },
  },
  created() {
    window.addEventListener("resize", this.handleResize);
    this.handleResize();
  },
  destroyed() {
    window.removeEventListener("resize", this.handleResize);
  },
};
</script>

<style scoped>
.habit-picture {
  /* border: #4aa78f solid 2px; */
  /* box-shadow: 3px 3px 5px 1px #888888; */
}
.habit-picture:hover {
  /* box-shadow: 3px 3px 5px 1px #06443f; */
}

/* @media screen and (max-width: 1024px) {
  img {
    height: 110px !important;
    width: 110px !important;
  }
} */

img {
  color: #616161;
  border-radius: 50%;
  height: 110px;
  width: 110px;
}

.imageColor {
  background: #484877;
}

.center {
  margin: auto;
  display: block;
}

.progress-circle {
}

.center {
  margin: auto;
  display: block;
}

.img-container {
  display: flex;
}
</style>