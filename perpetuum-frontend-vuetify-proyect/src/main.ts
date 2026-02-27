/**
 * main.ts
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

// Plugins
import { registerPlugins } from '@/plugins'
import VueApexCharts from "vue3-apexcharts";


import App from './App.vue'


import { createApp } from 'vue'


import 'unfonts.css'

const app = createApp(App)

registerPlugins(app)

app.use(VueApexCharts);     //Decirle a Vue que use ApexCharts de forma global

app.mount('#app')
