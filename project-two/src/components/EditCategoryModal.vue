<template>
  <div id="edit-category">
    <button @click="formActive = true" class="button">
      <span>Edit</span>
      <span class="icon">
        <i class="fa fa-pencil"></i>
      </span>
    </button>
    <div class="modal" 
        v-if="category"
        :class="{ 'is-active': formActive }" 
        @keydown.esc="formActive=false" 
        ref="editCategoryModal" 
        id="edit-category"
        tabindex="0"
    >
      <div class="modal-background" @click="formActive = false" />
      <div class="modal-card">
        <header class="modal-card-head">
          <p class="modal-card-title">Edit Category</p>
          <button
            @click="formActive = false"
            class="delete"
            aria-label="close"
          ></button>
        </header>
        <section class="modal-card-body has-text-centered">
          <form v-on:submit="editCategory($event); formActive = false">
            <div class="field-body is-horizontal p-3">
              <div class="field">
                <label class="label"> Category Name </label>
                <input
                  id="name"
                  class="input"
                  type="text"
                  :value="category.name"
                  placeholder="Category Name"
                  required
                />
              </div>

              <div class="field">
                <label class="label"> Background Color:</label>
                  <input
                    id="color"
                    type="color"
                    :value="category.color"
                  />
              </div>
            </div>
            <footer class="modal-card-footer has-background-grey-light p-2">
              <div class="field">
                <button type="submit" class="button is-dark" >Save Category</button>
              </div>
            </footer>
          </form>
        </section>
      </div>
    </div>
  </div>
</template>

<script>
import { auth, db} from "@/firebaseConfig";
import { editCategory } from "@/db.js";

export default {
  name: "EditCategoryModal",
  components: {},
  data() {
    return {
      formActive: false,
      category: false
    };
  },
  props: {
    categoryId: String,
  },
  firestore: function() {
    return  {
      category: db.collection('category').doc(this.categoryId)
    }
  },
  watch: {
    categoryId: function () {
      this.$bind("category", db.collection("category").doc(this.categoryId))
        .catch((error) => {
          console.log("error in loading: ", error);
        });
    },
    formActive: function() {
      if (this.formActive){
        this.$nextTick(() => {
          this.$refs.editCategoryModal.focus()
        })
      }
    }
  },
  methods: {
    editCategory(e) {
      e.preventDefault();
      const category = {
        color: e.target.color.value,
        name: e.target.name.value,
        userId: auth.currentUser.uid,
      };
      editCategory(category, this.categoryId);
    }
  }
}
</script>

<style></style>
