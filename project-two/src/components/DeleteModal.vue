<template>
    <div ref="modal" @keydown.esc="outDelete" tabindex="0" :class="{ 'is-active': confirmingDelete }" id="form-modal" class="modal">
            <div class="modal-background" @click="outDelete"></div>
            <div class="modal-content p-4 column is-5 has-background-info-light">
                <div class="card has-background-white">
                    <header class="card-header">
                      <p class="card-header-title is-size-3">Confirm deletion:</p>
                      <button @click="outDelete" class="delete is-large mr-3"></button>
                    </header>
                    <div class="card-content ">
                        <form @submit.prevent="">
                            <div class="field">
                              <p>Are you sure you want to delete <strong>{{ title }}</strong>?</p>
                            </div>
                            
                            <footer class="card-footer">
                                    <button ref="confirmDelete" @click="deleteObject" type="submit" class="card-footer-item button is-danger">
                                      Delete
                                    </button>
                                    <button @click="outDelete" value="none" class="card-footer-item button">
                                      Cancel
                                    </button>
                            </footer>
                            
                        </form>
                    </div>
                </div>
            </div>
    </div>
</template>

<script>
export default {
    data: function() {
        return {
        }
    },
    props: {
        confirmingDelete: Boolean,
        // generic title and id, so that the delete modal will also work for categories
        title: String,
        id: String
        // TODO: add more props that are specific to categories to display the correct information when deleting categories
    },
    methods: {
    // general function that deletes the current object that made the delete modal pop up
      deleteObject: function() {
          this.outDelete;
          this.$emit('deleteObject', this.id);
      },
      outDelete: function() {
          this.$emit('leaveDelete')
      },
      // focusConfirmDelete: function() {
      //     //$nextTick possibly redundant
      //     this.$nextTick(() => {
      //       this.$refs.confirmDelete.focus();
      //     });
      // },
      
    },
    watch: {
        confirmingDelete: function() {
          if (this.confirmingDelete){
            this.$nextTick(() => {
              this.$refs.confirmDelete.focus();
            });
          }
        }
      }
    // updated: function() {
    //     this.focusConfirmDelete();
    // }
}
</script>
    
<style scoped>
</style>