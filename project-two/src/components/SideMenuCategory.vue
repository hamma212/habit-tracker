<template>

  <b-list-group-item 
      @click="$router.push({name: 'oneCategory', params: {id: id}}); updateCurrentLink(id)" 
      :style="{backgroundColor: category.color, color: getTitleTextColor}" 
      class="page-link" 
      :class="{'has-text-weight-bold': currentLink==id}"
    >
      {{category.name}}
    </b-list-group-item>

</template>

<script>
import { getTextColorFromBackgroundColor } from "@/textColor.js"
import {db} from '@/firebaseConfig'
export default {
    data: function() {
        return {
            category: false,
        }
    },
    props: {
        id: String,
        currentLink: String
    },
    methods: {
        updateCurrentLink: function(id) {
            this.$emit('updateCurrentLink', id)
        }
    },
    firestore: function() {
        return {
            category: db.collection('category').doc(this.id)
        }
    },
    computed: {
        getTitleTextColor: function() {
            let textColor = "white"
            if (this.category){
                textColor = getTextColorFromBackgroundColor(this.category.color)
            }
            return textColor
        }
    }
}
</script>

<style>

</style>