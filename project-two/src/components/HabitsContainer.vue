<template>
    <div class="habits-container box mb-6 mt-6">
        <div class="columns is-centered is-multiline is-mobile mt-2 mr-2-desktop ml-2-desktop">
            <habit-item
                v-for="habit in habitsList"
                :key="habit.id"
                :title="habit.name"
                :id="habit.id"
            ></habit-item>

            
        </div>
    </div>
</template>

<script>
import HabitItem from './HabitItem.vue'
import { auth, db } from '@/firebaseConfig'
import * as dbFile from "@/db.js";

export default {
    components: {
        HabitItem
    },
    data: function() {
        return {
            habitsList: false
        }
    },
    props: {
        sortType: String
    },
    firestore: function() {
        return {
            habitsList: db.collection('habit')
                        .where('userId', '==', auth.currentUser.uid)
                        .orderBy('name')
        }
    },
    watch: {
        sortType: function() {
            if (this.sortType == 'name'){
                this.$bind('habitsList', db.collection('habit').where('userId', '==', auth.currentUser.uid).orderBy('name'))
            }
            else if (this.sortType == 'time'){
                this.$bind('habitsList', db.collection('habit').where('userId', '==', auth.currentUser.uid).orderBy('creationDate', 'desc'))
            }
            else if (this.sortType == 'today'){
                
                var timeStampNow = new Date();
                var today = dbFile.dayOfTheWeek(timeStampNow);

                this.$bind('habitsList', db.collection('habit').where('userId', '==', auth.currentUser.uid).where('daysOfWeek','array-contains', today).orderBy('name'))

            }
            else if (this.sortType == 'completed'){
                dbFile.getAllCompletedHabitsForUser(auth.currentUser.uid).then((res) => {
                    this.habitsList = res;
                });
            }
            else {
                console.log("Unsupported habit sorting type")
            }
        }
    }
}
</script>

<style>
    .habits-container {
        min-height: 100%;
        margin-left: 10%;
        margin-right: 10%;
        background-color: #afafaf2d;
    }
</style>