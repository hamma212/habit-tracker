<template>

    <router-link :to="{ name: 'oneHabit', params: { id: id } }">
        <p class="title button is-rounded pr-0 pl-0 pt-0 pb-0 is-size-6"
            :class="{ 'has-text-weight-bold': hoveringOverTitle, 'short-title': checkLongTitle }"
            :style="getTitleStyle"
            @mouseover="hoveringOverTitle=true"
            @mouseleave="hoveringOverTitle=false"
        >
             {{ getShortTitle }} 
        </p>
    </router-link>
</template>

<script>
import { db } from "@/firebaseConfig";
// import { getTextColorFromBackgroundColor } from "@/textColor.js"

export default {
    data: function() {
        return {
            hoveringOverTitle: false,
            hoverTitleStyle: {
                color: '#292929',
                'background-color': '#a8d0e6',
                'border': '3px solid #292929',
                'box-shadow': '0 1px 30px #a8d0e6'
                

            },
            titleStyle: {
                color: '#6d6d6d',
                border: 'none'

            },
            habitData: false,
            habitCategoryData: false,
        }
    },
    props: {
        title: String,
        id: String
    },
    computed: {
        getTitleStyle: function() {
            if (this.hoveringOverTitle){
                return this.hoverTitleStyle
            }
            else {
                return this.titleStyle
            }
        },
        checkLongTitle: function() {
            if (this.title.length >= 13){
                return true
            }
            return false
        },
        getShortTitle: function() {
            if (this.checkLongTitle){
                return this.title.substring(0,12) + "..."
            }
            return this.title
        }
    },
    firestore: function() {
        return {
            habitData: db.collection('habit').doc(this.id)
        }
    },
    watch: {
        habitData: function() {
            if (this.habitData.category != ""){
                this.$bind('habitCategoryData', db.collection('category').doc(this.habitData.category))
            }
            if (this.habitData.startingHabit){
                this.titleStyle = {
                    color: '#a8d0e6',
                    border: 'none',
                    'background-color': '#292929',
                }
                
            }
            else {
                this.titleStyle = {
                    color: '#f76c6c',
                    border: 'none',
                    'background-color': '#292929' ,

                }
                this.hoverTitleStyle = {
                    color: '#292929',
                    'background-color': '#f76c6c',
                    'border': '3px solid #292929',
                    'box-shadow': '0 1px 30px #f76c6c'

                }
            }
            
        },
        habitCategoryData: function() {
            if (this.habitCategoryData){

                // let textColor = getTextColorFromBackgroundColor(this.habitCategoryData.color)

                // this.hoverTitleStyle = {
                //     color: textColor,
                //     border: '5px solid #f2f2f2',
                //     'background-color': this.habitCategoryData.color,
                // }

            }
        }
    }
}
</script>

<style scoped>
    a {
        text-decoration: none;
        /* color: #ff0000 */
    }
    a:hover {

    }

    .title {
        display: flex;
        
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;

        width: 140px;
        margin: auto;
    }

    .short-title {
        justify-content: flex-start;
        padding-left: 10px !important;
    }

</style>