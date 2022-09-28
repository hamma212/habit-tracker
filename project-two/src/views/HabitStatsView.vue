<template>
    <div>
        <div class="container is-max-desktop" id="statDiv">
            <div class="columns">
                <div class="column" id="">
                    <div class="field" id="avatar">
                        <img id="avartarImg" src="https://bulma.io/images/placeholders/128x128.png">
                        <!-- <img 
                            id="avartarImg" 
                            :src="userProfile.profileImage"
                        />                         -->
                    </div>                    
                    <div class="field" id="buttonDiv">
                        <button class="button" id="editButton">Edit</button>
                    </div>
                </div>
                <div class="column" style="margin-top:1%">
                    <h5 class="subtitle is-6">Best Streak</h5>
                    <h1 class="title">{{ bestStreak }}</h1>
                </div>
                <div class="column" style="margin-top:1%"> 
                    <h5 class="subtitle is-6">Completions</h5>
                    <h1 class="title">{{ completions }}</h1>                
                </div>
                <div class="column" style="margin-top:1%">                 
                    <h5 class="subtitle is-6">Percentage</h5>
                    <h1 class="title">{{ percentage }}%</h1>                  
                </div>                  
            </div>                     
        </div>
        
        <div v-if="processReady" class="container is-max-desktop">
            <LineChart :labels="processLabels" :data="processData" :name="processName"/>
        </div> 

        <div class="container is-max-desktop">
            <div class="columns" id="">
                <div class="column" v-if="dataReady" id="chartColumn">
                    <LineChart />    
                </div>
                <div class="column" v-if="dataReady" id="chartColumn">
                    <BarChart :labels="chartLabels" :data="chartData" :name="chartName"/>   
                </div>  
            </div>           
        </div>

    </div>

   

</template>

<script>
import * as db from "@/db.js";
import BarChart from '../components/BarChart.vue'
import LineChart from '../components/LineChart.vue'

export default {
    name: 'App',
    components: {
        LineChart,
        BarChart,
    },
    props: {
        id: {
            type: String,
            default: 'Pu9grjorZL0V03jYfoW6' //Pu9grjorZL0V03jYfoW6
        },
    },
    data: function() {
        return {
            userProfile: null,

            bestStreak: 0,
            completions: 0,
            percentage: 0,

            chartLabels: [],
            chartData: [],
            chartName: 'Completions',
            dataReady: false,  
            
            processLabels: [],
            processData: [],
            processName: 'Process',
            processReady: false,             
            
        }
    },    
    async mounted() {
        db.getHabitData(this.id).then((res) => {
            this.bestStreak = res.bestStreak
            this.completions = res.completions
            this.percentage = res.percentage
        });    
        await db.getHabitWeekBarChart(this.id).then((res) =>{
            let labels = []
            let data = []
            for(let i in res){
                var dates = res[i].timeStamp.toDate().getMonth() + 1 + '/' + res[i].timeStamp.toDate().getDate() + '/' + res[i].timeStamp.toDate().getFullYear()
                labels.push(dates)
                data.push(res[i].counts)
            }
            this.chartLabels = labels
            this.chartData = data
            this.dataReady = true;
        });
        await db.getHabitProcessChart(this.id).then((res) =>{
            let labels = []
            let data = []
            for(let i in res){
                var dates = res[i].timeStamp.toDate().getMonth() + 1 + '/' + res[i].timeStamp.toDate().getDate() + '/' + res[i].timeStamp.toDate().getFullYear()
                labels.push(dates)
                data.push(res[i].counts)
            }
            this.processLabels = labels
            this.processData = data
            this.processReady = true;
        })        
        // db.getHabitProcessChart(this.id);

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
    height: 86%;
    width: 40%;
    margin-left:30%;
    /* margin-top:0%; */
    border-radius: 50%;
    border-width:8px;
    /* background-color: aquamarine; */
    border-color: black;
    border-style: solid;
    display: inline-block;
}
#buttonDiv{
    display: inline-block;
    margin-left:1%;
    /* height:1%; */
}
#editButton{
    float:right;
    /* height: 10%;
    width:100% */
    /* margin-top:5% */
}
#avartarImg{
    height: 100%;
    width:100%;
    border-radius: 50%;    
}
#chartColumn{
    height: 30%;
}
</style>