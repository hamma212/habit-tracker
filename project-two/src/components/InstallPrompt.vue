<template>
  <div v-if="shown">
    Add app to home screen?

    <button @click="installApp">Add to home.</button>

    <button @click="dismissPrompt">No, thanks</button>

  </div>
</template>

<script>
export default {
  data: () => ({
    shown: false,
  }),

  beforeMount() {
    window.addEventListener("beforeinstallprompt", (e) => {
      e.preventDefault();
      this.installEvent = e;
      this.shown = true;
    });
  },
  
  methods: {
    dismissPrompt() {
      this.shown = false;
    },

    installApp() {
      this.installEvent.prompt();
      this.installEvent.userChoice.then((choice) => {
        this.dismissPrompt(); // Hide the prompt once the user's clicked
        if (choice.outcome === "accepted") {
          console.log("Attempting to add app to home page.");
        } else {
          console.log("Add to home page declined.");
        }
      });
    },
  },
};
</script>
<style>
</style>

