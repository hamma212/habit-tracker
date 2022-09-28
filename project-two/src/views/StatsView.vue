<template>
    <div class="stats-page" style="background-color: #374785;">
        <section class="hero">
            <div class="hero-body has-text-centered is-size-2 has-text-black">My Stats</div>
        </section>


     <div style="padding-bottom:1%;">
        <div class="container is-max-desktop" id="statDiv">
            <div class="box">
                <div class="columns">
                    <div class="column is-2 is-full-mobile has-text-centered" id="">
                        <div class="field" id="avatar">
                            <!-- <img id="avartarImg" 
                            src="../assets/logo.png" /> -->
                            <div v-if="userProfile.profileImage">
                                <img 
                                    id="avartarImg" 
                                    :src="userProfile.profileImage"
                                    style="height:130px; width:130px"
                                />     
                            </div>  
                            <div v-else>
                                <img id="avartarImg" style="height:130px;  width:130px" src="https://bulma.io/images/placeholders/128x128.png">
                            </div>                   
                        </div>
                    </div>


                    <div class="column is-10" style="margin-top:2%">
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
                                <p class="title">{{ percentage }}%</p>
                            </div>
                            </div>
                        </nav>
                    </div>               
                </div>  
            </div>                   
        </div>
        
        <div v-if="progressReady" class="container is-max-desktop is-max-mobile" style="margin-top:1%">
            <div class="box">
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
                <div class="columns is-mobile" v-if="dataReady && timeStampReady" id="">
                    <div class="column is-half-mobile" >
                        <!-- <LineChart />     -->
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

    </div>
</template>

<script>
// import { db, auth } from "@/firebaseConfig";
import * as db from "@/db.js";
import BarChart from '../components/BarChart.vue'
import LineChart from '../components/LineChart.vue'

export default {
    name: 'App',
    components: {
        LineChart,
        BarChart,
    },
    data: function() {
        return {
            userProfile: null,
            bestStreak: 0,
            completions: 0,
            percentage: 0,

            progressLabels: [],
            progressData: [],
            progressName: 'Completions',
            progressReady: false,  
            progressYTitle: 'Current Streak',
            progressXTitle: 'Dates',                      

            // Bar chart
            chartLabels: [],
            chartData: [],
            chartName: 'Updates',
            chartColor: [],
            dataReady: false,
            chartXTitle: 'WeekDays',
            chartYTitle: 'Update Times',            

            timeStampLabels: [],
            timeStampData: [],
            timeStampName: 'Last 24h',
            timeStampReady: false,
            timeStampYTitle: 'Update Density',
            timeStampXTitle: '24 Hours'                          

        }
    },    
    async mounted() {
        db.getUserProfile().then((res) => {
            this.userProfile = res[0];
        });
        db.getBestStreak().then((res) =>{
            this.bestStreak = res;
        });        
        db.getTotalCompletions().then((res) =>{
            this.completions = res
        });
        db.getTotalPercentage().then((res) => {
            this.percentage = res
        })   
        await db.getUserWeekBarChart().then((res) =>{
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
        await db.getUserTimeStamp(this.id).then((res) =>{
            let labels = []
            let data = []
            for(let i in res){
                // var dates = res[i].timeStamp.toDate().getHours()
                // labels.push(dates)
                // data.push(res[i].density)
                labels.push(res[i].hour)
                data.push(res[i].counts)                
            }
            this.timeStampLabels = labels
            this.timeStampData = data
            this.timeStampReady = true;
        });
        await db.getUserCompletionChart(this.id).then((res) =>{
            let labels = []
            let data = []
            for(let i in res){
                var dates = res[i].timeStamp.toDate().getMonth() + 1 + '/' + res[i].timeStamp.toDate().getDate() + '/' + res[i].timeStamp.toDate().getFullYear()
                labels.push(dates)
                data.push(res[i].counts)
            }
            this.progressLabels = labels
            this.progressData = data
            this.progressReady = true;
        });              
    },
        
    methods: {

    }
}
</script>

<style scoped>
#statDiv{
    margin-top: 2%;
}
#avatar{
    /* height: 95%;
    width: 40%; */
    /* margin-left:30%; */
    /* margin-top:0%; */
    border-radius: 50%;
    /* border-width:8px; */
    /* background-color: aquamarine; */
    /* border-color: black; */
    /* border-style: solid; */
}
#avartarImg{
    width:100%;
    border-radius: 50%;
    border-color: #f14668;
    border-style: solid;  
    border-width: 6px;
}
#chartColumn{
    height: 30%;
}
.hero {
  background-color: #A8D0E6;
  border-bottom: 1px solid #f14668;
  box-shadow: 0 1px 10px #f14668;
}
.stats-page {
    background-color: white;
}
</style>