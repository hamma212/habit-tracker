<template>
    <div>
        <Bar
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
    </div>
</template>

<script>
import { Bar } from 'vue-chartjs/legacy'
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

export default {
  name: 'BarChart',
  components: { Bar },
  props: {
    chartId: {
      type: String,
      default: 'bar-chart'
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
      type: Object,
      default: () => {}
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
    color:{
      type: Array,
      default: () => []    
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
        datasets: [ 
          { 
            label: this.name,
            data: this.data ,
            backgroundColor: this.color,
          } 
        ],
      },
      chartOptions: {
        responsive: true,
        maintainAspectRatio: false,
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
      }
    }
  }
}
</script>