<template>
    <div class="column is-2-fullhd is-6-mobile mb-3">
        <habit-picture
          :title="title"
          :id="id"
          :key="componentKey"
          @forceRerender="forceRerender"
        ></habit-picture>
        <div>
          <habit-title-link
            :title="title"
            :id="id"
          ></habit-title-link>
        </div>
        <streak-update-button :id="id" />
    </div>
</template>

<script>


import HabitPicture from "./HabitPicture.vue";
import HabitTitleLink from "./HabitTitleLink.vue";
import StreakUpdateButton from './StreakUpdateButton.vue'

export default {
  components: { HabitPicture, HabitTitleLink, StreakUpdateButton },
  data: function() {
    return {
      componentKey: 0
    }
  },
  props: {
    title: String,
    id: String,
  },
  methods: {
    forceRerender() {
      this.componentKey += 1;
    }
  }
};
</script>

<style scoped>
</style>