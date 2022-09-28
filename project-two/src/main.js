import Vue from 'vue'
import App from './App.vue'
import router from './router'
import { firestorePlugin } from 'vuefire'
import { auth } from '@/firebaseConfig.js'
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import './registerServiceWorker'
Vue.use(BootstrapVue)
Vue.use(IconsPlugin)
Vue.use(firestorePlugin)

Vue.config.productionTip = false


import VueEllipseProgress from 'vue-ellipse-progress';
Vue.use(VueEllipseProgress);
// Vue.use(VueEllipseProgress, "vep"); you can define a name and use the plugin like <vep/>



//activate vuefire plugin

//add auth listener

// in main.js -- change how we init the vue app
let app
auth.onAuthStateChanged(()=>{
    if (!app) {
        new Vue({
            router,
            render: h => h(App)
        }).$mount('#app')
    }  
});