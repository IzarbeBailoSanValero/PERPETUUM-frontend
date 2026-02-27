 <!-- KPIs, Filtro global de fechas, 3 Gráficas (Barras, Tarta, Líneas) -->

 <!--apuntes
 Como mi api no tiene un endpoind con estadísticas, voy a hacer un mockdata en el front para calcularlo.


 <apexchart>: Es el componente de la librería.
    :options: Define el diseño (ejes, colores, leyendas).
    :series: Define los datos numéricos brutos.

  docum -> https://apexcharts.com/javascript-chart-demos/area-charts/basic/
 -->

<template>
  <v-container fluid>
    <div class="d-flex justify-space-between align-center mb-6"> 
      <div>
        <h1 class="text-h4 font-weight-bold">Dashboard de Gestión</h1>
        <p class="text-subtitle-1 text-grey">Resumen general de la plataforma Perpetuum</p>
      </div>
      
      <!-- Si la variable loading es verdadera, el botón muestra un círculo de carga automáticamente.-->
      <v-btn 
        prepend-icon="mdi-refresh" 
        color="primary" 
        variant="tonal" 
        @click="loadDashboardData" 
        :loading="loading"    
      >
        Actualizar datos
      </v-btn>
    </div>

    <!--Solo mostramos las tarjetas cuando los datos ya han llegado. IF/ELSE  Si está cargando, pasamos al bloque v-else donde está el <v-progress-circular>          kpicard Es un componente personalizado. Le pasamos datos mediante props-->
    <v-row v-if="!loading">
      <v-col cols="12" sm="4">
        <KpiCard title="Memoriales Activos" :value="stats.totalMemorials" icon="mdi-grave-stone" color="blue" />
      </v-col>
      <v-col cols="12" sm="4">
        <KpiCard title="Recuerdos Pendientes" :value="stats.pendingMemories" icon="mdi-message-alert" color="orange" />
      </v-col>
      <v-col cols="12" sm="4">
        <KpiCard title="Guardianes Registrados" :value="stats.guardianCount" icon="mdi-account-heart" color="indigo" />
      </v-col>
    </v-row>

    <v-row v-else justify="center" align="center" style="height: 200px;">
      <v-progress-circular indeterminate color="primary"></v-progress-circular>
    </v-row>

    <v-row class="mt-4">
      <v-col cols="12" md="8">
        <v-card border flat class="rounded-xl pa-4">
          <v-card-title class="text-subtitle-1 font-weight-bold">Nuevos Memoriales (Últimos 6 meses)</v-card-title>
          <apexchart
            type="bar"
            height="350"
            :options="barOptions"
            :series="barSeries"
          ></apexchart>
        </v-card>
      </v-col>

      <v-col cols="12" md="4">
        <v-card border flat class="rounded-xl pa-4">
          <v-card-title class="text-subtitle-1 font-weight-bold">Distribución de Recuerdos</v-card-title>
          <apexchart
            type="donut"
            height="350"
            :options="donutOptions"
            :series="donutSeries"
          ></apexchart>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import type { ApexOptions } from 'apexcharts'
// Importamos el componente de las tarjetas 
import KpiCard from '@/components/admin/KpiCard.vue'


const loading = ref(true)

// Objeto stats: guarda los números simples
const stats = reactive({
  totalMemorials: 0,
  pendingMemories: 0,
  guardianCount: 0
})

// Series de las gráficas: se vinculan a <apexchart>
const barSeries = ref([
  { name: 'Memoriales Creados', data: [] as number[] }
])

const donutSeries = ref([] as number[])

// --- CONFIGURACIÓN DE APEXCHARTS 
const barOptions = ref<ApexOptions>({
  chart: { id: 'bar-growth', toolbar: { show: false } },
  xaxis: { 
    categories: ['Sept', 'Oct', 'Nov', 'Dic', 'Ene', 'Feb'],
    labels: { style: { colors: '#9e9e9e' } }
  },
  colors: ['#1976D2'], // Color azul de Vuetify
  plotOptions: { bar: { borderRadius: 4, columnWidth: '45%' } },
  dataLabels: { enabled: false }
})

const donutOptions = ref<ApexOptions>({
  labels: ['Condolencias', 'Anécdotas', 'Fotos'],
  colors: ['#5C6BC0', '#26A69A', '#FFA726'],
  legend: { position: 'bottom' },
  stroke: { show: false }
})

// --- (SIMULACIÓN DE API / MOCK DATA) ---
//Uso una función asíncrona para simular la espera del servidor
async function loadDashboardData() {
  loading.value = true
  
  try {
    // Simulo un retraso de red 
    await new Promise(resolve => setTimeout(resolve, 800))

    // Estos datos son estáticos (HARCODEADOS!)
    const mockResponse = {
      totalDeceased: 156,
      pendingMemories: 23,
      totalGuardians: 89,
      monthlyData: [12, 19, 32, 45, 28, 56], // Datos para las barras
      typesDistribution: [120, 45, 67]        // Datos para el donut (Condolencias, Anécdotas, Fotos)
    }

    // ACTUALIZACIÓN DEL ESTADO --> (Vue detecta estos cambios y repinta la pantalla)
    stats.totalMemorials = mockResponse.totalDeceased
    stats.pendingMemories = mockResponse.pendingMemories
    stats.guardianCount = mockResponse.totalGuardians

    if (barSeries.value[0]) {
      barSeries.value[0].data = mockResponse.monthlyData
    }
    donutSeries.value = mockResponse.typesDistribution

  } catch (error) {
    console.error("Error al cargar datos del dashboard", error)
  } finally {
    loading.value = false
  }
}

// Ejecutamos la función nada más entrar el componente en el navegador
onMounted(() => {
  loadDashboardData()
})
</script>


<style>
/* fuerzo el color del texto dentro del tooltip de ApexCharts por porblema de conltraste */
.apexcharts-tooltip  {
  color: #000000 !important;
}
</style>