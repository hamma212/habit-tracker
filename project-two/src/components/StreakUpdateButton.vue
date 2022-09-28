<template>
  <div class="sup-container is-hidden-desktop">
    <template v-if="!habitData">
      <button class="button is-dark is-loading"></button>
    </template>
    <template v-else>
      <button
        class="button is-dark is-small"
        :class="className"
        @click="updateStreak"
      >
        Update Streak
      </button>
    </template>
  </div>
</template>

<script>
import { db } from "@/firebaseConfig";
import firebase from "firebase/app";
import { getNextUpdateDay, dayOfTheWeek } from "@/db.js";

export default {
  props: {
    id: String,
  },
  data: function () {
    return {
      habitData: false,
      className: null,
      streak: 0,
      checkInTimes: null,
      currentDayUpdates: null,
    };
  },
  firestore: function () {
    return {
      habitData: db.collection("habit").doc(this.id),
    };
  },
  watch: {
    habitData: function () {
      this.streak = this.habitData.currentStreak;
      this.currentDayUpdates = this.habitData.currentDayUpdates;
      this.checkInTimes = this.habitData.checkInTimes;
      if (this.habitData.updateTimes.length > 0) {
        if (this.isNewDay(this.habitData.updateTimes)) {
          if (this.habitData.daysOfWeek.includes(dayOfTheWeek(new Date()))) {
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
  },
};
</script>

<style scoped>
.sup-container {
  display: flex;
  justify-content: center;
}
</style>