<template>
  <div class="home">
      <install-prompt/>
      <section class="hero is-primary">
        <div class="hero-body has-text-centered is-size-2 has-text-dark">All Habits</div>
      </section>
      <div class="block"></div>



      <div class="buttons is-centered">
        <AddHabitModal/><AddCategoryModal/>
      </div>

      <sort-habit-selector
        @sortHabits="sortHabits"
      ></sort-habit-selector>


      <habits-container
        :sortType="habitSortType"
      ></habits-container>

   






  </div>
</template>

<script>
import HabitsContainer from '../components/HabitsContainer.vue';
// @ is an alias to /src
import AddHabitModal from "@/components/AddHabitModal";
import AddCategoryModal from '@/components/AddCategoryModal';
import InstallPrompt from '@/components/InstallPrompt.vue';
import SortHabitSelector from '../components/SortHabitSelector.vue';

export default {
  name: "HomeView",
  components: {HabitsContainer,  AddHabitModal, AddCategoryModal, SortHabitSelector, InstallPrompt },
  data: function() {
    return {
      habitSortType: 'name'
    }
  },
  methods: {
    sortHabits: function(sortType) {
      this.habitSortType = sortType

    }
  },

};
</script>
<style scoped>
.buttons {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}
.hero {
  background-color: #A8D0E6;
  border-bottom: 1px solid #f14668;
  box-shadow: 0 1px 10px #f14668;
}
</style>