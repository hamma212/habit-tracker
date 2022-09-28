<template>
  <div class="tabs is-toggle is-toggle-rounded is-centered">
  <ul>
    <li :class="{ 'is-active': selectedSort == 'name'}" @click="sortHabits('name')">
      <a>
        <span class="icon is-small"><i class="fa-solid fa-arrow-down-a-z"></i></span>
        <span>Name</span>
      </a>
    </li>
    <li :class="{ 'is-active': selectedSort == 'time'}" @click="sortHabits('time')">
      <a>
        <span class="icon is-small"><i class="fa-solid fa-hourglass-start"></i></span>
        <span>Recently Created</span>
      </a>
    </li>
    <li :class="{ 'is-active': selectedSort == 'today'}" @click="sortHabits('today')">
      <a>
        <span class="icon is-small"><i class="fa-solid fa-calendar-day"></i></span>
        <span>Today</span>
      </a>
    </li>
    <li :class="{ 'is-active': selectedSort == 'completed'}" @click="sortHabits('completed')">
      <a>
        <span class="icon is-small"><i class="fa-solid fa-circle-check"></i></span>
        <span>Completed</span>
      </a>
    </li>
  </ul>
</div>
</template>

<script>
export default {
    data: function() {
        return {
            selectedSort: 'name'
            
        }
    },
    methods: {
        sortHabits(sortType) {
            this.selectedSort = sortType
            this.$emit('sortHabits', sortType)
        }
    }
    
}
</script>

<style scoped>
    .tabs a {
        background-color: white;
    }
    .tabs .is-active a{
        background-color: #f76c6c !important;
        border-color: #f76c6c !important;
        color: black !important;
    }
</style>