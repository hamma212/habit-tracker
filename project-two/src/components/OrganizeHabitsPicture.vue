<template>
  <div>
      <div class="img-container habit">
        <span class="name-popup">{{habitData.name}}</span>
          <div v-if="this.habitData.imageName != 'default'">
            <img height="80px" :src="imgUrl" class="">
          </div>
          <div v-else>
            <figure class="image" :style="{ background: color }" style="border-radius: 50%">
              <img class="col is-rounded" src="https://bulma.io/images/placeholders/128x128.png" >
            </figure>
          </div>
      </div>
  </div>
</template>

<script>
import { db } from "@/firebaseConfig";

export default {
  components: {},
  props: {
    id: String,
    title: String,
  },
  data: function(){
      return {
          habitData: false,
          categoryData: false,
          imgUrl: '',
          color: '',
      }
  },
  firestore: function() {
      return {
          habitData: db.collection('habit').doc(this.id),
      }
  },
  watch: {
      habitData: function() {
        if (this.habitData.category != ""){
            this.$bind('categoryData', db.collection('category').doc(this.habitData.category))
        }if (this.habitData.imageName != "default") {
            this.color = "";
            this.imgUrl = this.habitData.imageUrl;
        } else {
            this.color = this.habitData.habitColor;
        }
      }
    },
};
</script>

<style scoped>
img{
  color: #616161;
  border-radius: 50%;
  height: 60px;
  width: 60px;
}
.center {
  margin: auto;
  display: block;
}
.col {
  visibility: hidden;
}

.img-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: -2em;
  width: 60px;
}
.name-popup {
  visibility: hidden;
  background-color: black;
  padding: 5px 10px;
  color: #fff;
  text-align: center;
  border-radius: 6px;
  opacity: 75%;
  width: 122px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
a {
  text-decoration: none;
}
.habit:hover .name-popup {
  visibility: visible;
}
</style>