<template>
  <LineChartGenerator
    :chart-options="chartOptions"
    :chart-data="chartData"
    :chart-id="chartId"
    :dataset-id-key="datasetIdKey"
    :plugins="plugins"
    :css-classes="cssClasses"
    :styles="styles"
    :width="width"
    :height="height"
  />
</template>

<script>
import { Line as LineChartGenerator } from 'vue-chartjs/legacy'
// import * as db from "@/db.js";


import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineElement,
  LinearScale,
  CategoryScale,
  PointElement
} from 'chart.js'

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  LineElement,
  LinearScale,
  CategoryScale,
  PointElement
)

export default {
  name: 'LineChart',
  components: {
    LineChartGenerator
  },
  props: {
    chartId: {
      type: String,
      default: 'line-chart'
    },
    datasetIdKey: {
      type: String,
      default: 'label'
    },
    width: {
      type: Number,
      default: 400
    },
    height: {
      type: Number,
      default: 400
    },
    cssClasses: {
      default: '',
      type: String
    },
    styles: {
      type: Object,
      default: () => {}
    },
    plugins: {
      type: Array,
      default: () => []
    },
    labels: {
      type: Array,
      default: () => []      
    },
    name:{
      type: String,
      default: 'data',
    },
    data: {
      type: Array,
      default: () => []      
    },
    ydisplay: {
      type:Boolean,
      default: true
    },
    ytitle: {
      type: String,
      default: 'Data'
    },
    xtitle: {
      type: String,
      default: 'Data'      
    }
  },
  data() {
    return {
      chartData: {
        labels: this.labels,
        datasets: [{
            label: this.name,
            data: this.data,
            lineTension: 0.3,
            borderColor: "#F76C6C",

          },]
      },
      chartOptions: {
        responsive: true,
        maintainAspectRatio: false,
        bezierCurve: true,
        scales: {  
          y: {
            display: this.ydisplay, 
            title: {
              display: true,
              text: this.ytitle
            },  
            beginAtZero:true           
          },
          x: {
            title: {
              display: true,
              text: this.xtitle
            }            
          }
        },        
      },
    }
  },
}
</script>
