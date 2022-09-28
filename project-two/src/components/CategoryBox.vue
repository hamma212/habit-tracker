<template>
    <div class="card column">
        <div class="card-header" :style="{backgroundColor: cat.color}">
            <div class="card-header-title is-centered is-size-3">
                <router-link class="" :style="{color: getTitleTextColor}" :to="{name: 'oneCategory', params: {id: this.id}}">{{cat.name}}</router-link>
            </div>
        </div>
        <div class="card-content columns" @drop="onDrop($event, cat.id)" @dragover.prevent @dragenter.prevent>
            <div v-for="habit in habits" :key="habit.id">
                <div draggable @dragstart="startDrag($event, habit)">
                    <OrganizeHabitsPicture :id="habit.id" :title="habit.name"/>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import {db} from '@/firebaseConfig'
import { dragAndDropCategory } from "@/db.js";
import OrganizeHabitsPicture from '@/components/OrganizeHabitsPicture.vue'
import { getTextColorFromBackgroundColor } from "@/textColor.js"

export default {
    props: ['id'],
    components: {
        OrganizeHabitsPicture
    },
    data: function() {
        return {
            cat: false,
            habits: false
        }
    },
    firestore: function() {
        return {
            cat: db.collection('category').doc(this.id),
            habits: db.collection("habit").where('category', '==', this.id)
        }
    },
    methods: {
        startDrag(evt, habit) {
            evt.dataTransfer.dropEffect = 'move'
            evt.dataTransfer.effectAllowed = 'move'
            evt.dataTransfer.setData('habitID', habit.id)
        },
        onDrop(evt, cat) {
            const habitId = evt.dataTransfer.getData('habitID')
            dragAndDropCategory(habitId, cat);
        },
        
    },
    computed: {
        getTitleTextColor: function() {
            let textColor = "black"
            if (this.cat)
                textColor = getTextColorFromBackgroundColor(this.cat.color)
            return textColor
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