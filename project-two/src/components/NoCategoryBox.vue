<template>
    <div class="card column">
        <div class="card-header" style="background-color: black">
            <div class="card-header-title is-centered is-size-3 has-text-white">
                No Category
            </div>
        </div>
        <div class="card-content columns" @drop="onDrop($event, '')" @dragover.prevent @dragenter.prevent>
            <div v-for="habit in habits" :key="habit.id">
                <div draggable @dragstart="startDrag($event, habit)">
                    <OrganizeHabitsPicture :id="habit.id" :title="habit.name"/>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import {db, auth} from '@/firebaseConfig'
import { dragAndDropCategory } from "@/db.js";
import OrganizeHabitsPicture from '@/components/OrganizeHabitsPicture.vue'

export default {
    props: ['id'],
    components: {
        OrganizeHabitsPicture
    },
    data: function() {
        return {
            habits: false
        }
    },
    firestore: function() {
        return {
            habits: db.collection("habit").where('category', '==', "").where('userId', '==', auth.currentUser.uid)
        }
    },
    methods: {
        startDrag(evt, habit) {
            evt.dataTransfer.dropEffect = 'move'
            evt.dataTransfer.effectAllowed = 'move'
            evt.dataTransfer.setData('habitID', habit.id)
        },
        onDrop(evt) {
            const habitId = evt.dataTransfer.getData('habitID')
            dragAndDropCategory(habitId, "");
        }
    }
}
</script>

<style scoped>
.card {
    height:21em;
    width: 21em;
    margin: 1em;
}
.card-content {
    display: flex;
    flex-wrap: wrap;
    margin-top: 2px;
    justify-content: space-evenly;
    height: 100%;
    overflow: auto;
    overflow-x: hidden;
}
</style>