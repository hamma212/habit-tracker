<template>
  <div v-if="habitData" style="padding-bottom:1%">
    <div class="container is-max-desktop" id="statDiv">
      <div class="box">
      <div class="columns">
        <div class="column is-2" id="">
          <div class="field" id="avatar">

            <habit-picture
              :title="habitData.name"
              :id="id"
            ></habit-picture>            
            <div
              class="has-text-weight-bold has-text-centered is-size-5 has-text-black"
            >
              {{ habitData.name }}
            </div>
          </div>
        </div>
    

        <div class="column edit-habit is-1 is-full-mobile has-text-centered" id="buttonDiv">
          <CompletedHabitModal v-if="completed" :habitId="id"/>
          <EditHabitModal v-else :habitId="id" />
        </div>

        <div class="column is-9" style="margin-top:4%">

          <nav class="level is-mobile">
            <div class="level-item has-text-centered">
              <div>
                <p class="heading">Best Streak</p>
                <p class="title">{{ bestStreak }}</p>
              </div>
            </div>
            <div class="level-item has-text-centered">
              <div>
                <p class="heading">Completions</p>
                <p class="title">{{ completions }}</p>
              </div>
            </div>
            <div class="level-item has-text-centered">
              <div>
                <p class="heading">Percentage</p>
                <p class="title">{{ percentage }}</p>
              </div>
            </div>
          </nav>

        </div>
      </div>
      </div>
    </div>


      <div v-if="progressReady" class="container is-max-desktop is-max-mobile" style="margin-top:1%">
        <div class="box">

          <nav class="level is-mobile">
            <div class="level-item has-text-centered">
              <div>
                <p class="heading">Category</p>
                <p v-if="cateData.name == 'No Category' || !cateData" class="title is-4">{{ cateData.name }}</p>
                <p v-else class="title is-4">
                  <router-link  :to="{name: 'oneCategory', params: {id: this.habitData.category}}">{{cateData.name}}</router-link>
                </p>
              </div>
            </div>
            <!-- <div class="level-item has-text-centered">
              <div>
                <p class="heading">Start Date</p>
                <p class="title">{{ startDate }}</p>
              </div>
            </div>             -->
            <div class="level-item has-text-centered">
              <div>
                <p class="heading">Remaining Days</p>
                <p class="title">{{ remainingDays }}</p>
              </div>
            </div> 
            <div class="level-item has-text-centered">
              <div>
                <p class="heading">Completion Date</p>
                <p class="title is-4">{{ completionDate }}</p>
              </div>
            </div>
          </nav>          

          <div class="column" v-if="progressReady">
          <LineChart 
            :labels="progressLabels" 
            :data="progressData" 
            :name="progressName"
            :ytitle="progressYTitle"
            :xtitle="progressXTitle"           
          />
          </div>
        </div>
      </div>

    <div class="container is-max-desktop" style="margin-top:1%">
      <div class="box">
        <div class="columns is-mobile" v-if="timeStampReady && dataReady">
          <div class="column is-half-mobile" >
            <LineChart 
              :labels="timeStampLabels" 
              :data="timeStampData" 
              :name="timeStampName" 
              :ydisplay="false"
              :ytitle="timeStampYTitle"
              :xtitle="timeStampXTitle"
              />
          </div>
          <div class="column is-half-mobile" >
            <BarChart 
              :labels="chartLabels" 
              :data="chartData" 
              :name="chartName" 
              :color="chartColor"
              :ytitle="chartYTitle"
              :xtitle="chartXTitle"
              />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
/* eslint-disable */

import HabitPicture from "../components/HabitPicture.vue";
import { db, auth, storage } from "@/firebaseConfig";

import * as dbfile from "@/db.js";
// import { getImage } from "@/db.js";
import BarChart from "../components/BarChart.vue";
import LineChart from "../components/LineChart.vue";
import EditHabitModal from "../components/EditHabitModal.vue";
import CompletedHabitModal from "../components/CompletedHabitModal.vue";

export default {
  components: {
    LineChart,
    BarChart,
    EditHabitModal,
    HabitPicture,
    CompletedHabitModal
  },
  data: function () {
    return {
      habitData: false,
      completed: false,
      imageUrl: null,

      userProfile: null,
      cateData: false,

      bestStreak: 0,
      completions: 0,
      percentage: 0,
      remainingDays: 0,
      completionDate: '',
      // startDate: '',

      // Bar chart
      chartLabels: [],
      chartData: [],
      chartName: 'Updates',
      chartColor: [],
      dataReady: false,
      chartXTitle: 'WeekDays',
      chartYTitle: 'Update Times',  
      
      // Big Line Chart
      progressLabels: [],
      progressData: [],
      progressName: 'Current Streaks',
      progressReady: false,
      progressYTitle: 'Current Streaks',
      progressXTitle: 'Dates',
      
      // Small Line Chart
      timeStampLabels: [],
      timeStampData: [],
      timeStampName: '24h',
      timeStampReady: false, 
      timeStampYTitle: 'Update Density',
      timeStampXTitle: '24 Hours'           

    };
  },
  props: {
    id: String,
  },
  firestore: function () {
    return {
      habitData: db.collection("habit").doc(this.id),
    };
  },
  async mounted() {
    if (this.habitData == null) {
      this.$router.replace("/404");
    }

    //check if the habit id belongs to the user
    dbfile.getHabitData(this.id).then((habit) => {
      if (habit.userId != auth.currentUser.uid) {
        this.$router.replace("/404");
      }
    });

    dbfile.getHabitData(this.id).then((res) => {
      this.bestStreak = res.bestStreak;
      this.completions = res.completions;
      if(res.percentage == 'No Data'){
        this.percentage = res.percentage;
      } else {
        this.percentage = res.percentage + '%';
      }
      this.completed = res.completed
      this.remainingDays = res.remainingDays
      this.completionDate = res.startDate + '~' + res.completionDate 
      // this.completionDate = res.completionDate 
      // this.startDate = res.startDate

    });
    await dbfile.getHabitWeekBarChart(this.id).then((res) =>{
        let labels = []
        let data = []
        let color = []
        for(let i in res){
            color.push(res[i].color)
            labels.push(res[i].weekDay)
            data.push(res[i].counts)
        }
        this.chartLabels = labels
        this.chartData = data
        this.chartColor = color
        this.dataReady = true;
    });
    await dbfile.getHabitProgressChart(this.id).then((res) =>{
        let labels = []
        let data = []
        for(let i in res){
            // var dates = res[i].timeStamp.toDate().getMonth() + 1 + '/' + res[i].timeStamp.toDate().getDate() 
            var datesTemp = new Date(res[i].timeStamp)
            var dates = datesTemp.getMonth() + 1 + '/' + datesTemp.getDate() 
            labels.push(dates)
            data.push(res[i].counts)
        }
        this.progressLabels = labels
        this.progressData = data
        this.progressReady = true;
    });
    await dbfile.getHabitTimeStamp(this.id).then((res) =>{
        let labels = []
        let data = []
        for(let i in res){
            labels.push(res[i].hour)
            data.push(res[i].counts)
        }
        this.timeStampLabels = labels
        this.timeStampData = data
        this.timeStampReady = true;
    });
    // dbfile.colorTransformation()
    dbfile.getHabitCateData(this.id).then((res) =>{
      this.cateData = res
    })
  },

  watch: {
    habitData(newVal) {
      if (this.habitData.category != ""){
          this.$bind('categoryData', db.collection('category').doc(this.habitData.category))
      }if (this.habitData.imageName != "default") {
          this.downloadImage(this.habitData.imageName);
      } else {
          this.imgUrl = "https://bulma.io/images/placeholders/128x128.png";
      }     
      this.completed = (newVal.goalDuration - newVal.currentStreak <= 0) 
    },
  },
  methods: {
    downloadImage(imageName) {
      var habitsRef = storage.ref(
        "habitImages/" + auth.currentUser.uid + "/" + imageName
      );
      habitsRef
        .getDownloadURL()
        .then((url) => {
          this.imageUrl = url;
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
};
</script>

<style scoped>

#statDiv {
  margin-top: 2%;
}

#avatar {
  /* height: 86%; */
  width: 40%;
  min-width: 140px;

  margin-left: 30%;
  /* margin-top:0%; */
  /* border-radius: 50%; */
  /* border-width:8px; */
  /* background-color: aquamarine; */
  /* border-color: black; */
  /* border-style: solid; */
  display: inline-block;
}
#buttonDiv {
  display: inline-block;
  margin-left: 1%;
  /* height:1%; */
}
#editButton {
  float: right;
  /* height: 10%;
    width:100% */
  /* margin-top:5% */
}

#avartarImg {
  height: 100%;
  width: 100%;
  border-radius: 50%;
}
</style>
