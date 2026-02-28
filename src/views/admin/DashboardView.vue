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
        <p class="text-subtitle-1 text-grey">Análisis de la plataforma Perpetuum</p>
      </div>

      <!-- FILTRO DE FECHAS (v-select timeRange). -->
      <v-col cols="12" md="6" class="d-flex justify-md-end align-center gap-3">
        <v-select 
        v-model="timeRange" :items="['Últimos 7 días', 'Último mes', 'Últimos 6 meses', 'Todo el año']"
          label="Periodo" variant="outlined" density="compact" hide-details style="max-width: 200px;" class="mr-4"
          @update:model-value="loadDashboardData"
          >
        </v-select>




        <!-- Si la variable loading es verdadera, el botón muestra un círculo de carga automáticamente.-->
        <v-btn prepend-icon="mdi-refresh" color="primary" variant="tonal" @click="loadDashboardData" :loading="loading">
          Actualizar 
        </v-btn>
        </v-col>
    </div>

    <!--Solo mostramos las tarjetas cuando los datos ya han llegado. IF/ELSE  Si está cargando, pasamos al bloque v-else donde está el <v-progress-circular>          kpicard Es un componente personalizado. Le pasamos datos mediante props-->
    <v-row v-if="!loading">
      <v-col cols="12" sm="6" md="3">
        <KpiCard title="Memoriales Activos" :value="stats.totalMemorials" icon="mdi-grave-stone" color="blue" />
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <KpiCard title="RecUerdos Pendientes" :value="stats.pendingMemories" icon="mdi-message-alert" color="orange" />
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <KpiCard title="Guardianes Registrados" :value="stats.guardianCount" icon="mdi-account-heart" color="indigo" />
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <KpiCard title="Media de Recuerdos" :value="stats.avgMemories" icon="mdi-chart-line" color="green" />
      </v-col>
    </v-row>

    <v-row v-else justify="center" align="center" style="height: 200px;">
      <v-progress-circular indeterminate color="primary" size="64"></v-progress-circular>
    </v-row>

   <v-row class="mt-4">
      <v-col cols="12" md="8">
        <v-card border flat class="rounded-xl pa-4">
          <v-card-title class="text-subtitle-1 font-weight-bold">Nuevos Memoriales (Histórico)</v-card-title>
          <apexchart
            type="bar"
            height="300" 
            :options="barOptions"
            :series="barSeries"
          ></apexchart>
        </v-card>
      </v-col>

      <v-col cols="12" md="4">
        <v-card border flat class="rounded-xl pa-4">
          <v-card-title class="text-subtitle-1 font-weight-bold">Tipos de contenido</v-card-title>
          <apexchart type="donut" height="300" :options="donutOptions" :series="donutSeries"></apexchart>
        </v-card>
      </v-col>



      <!-- DIFERENCIA CLAVE: Aquí existe una TERCERA GRÁFICA (líneas).
           En el segundo código NO existe gráfica de líneas -->
      <v-col cols="12">
        <v-card border flat class="rounded-xl pa-4">
          <v-card-title class="text-subtitle-1 font-weight-bold">
            Interacciones en el tiempo (Recuerdos creados)
          </v-card-title>
          <apexchart
            type="line"
            height="300"
            :options="lineOptions"
            :series="lineSeries"
          ></apexchart>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
  

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import type { ApexOptions } from 'apexcharts'
import KpiCard from '@/components/admin/KpiCard.vue'

const loading = ref(true)
const timeRange = ref('Últimos 6 meses')

// Objeto stats: guarda los números simples
const stats = reactive({
  totalMemorials: 0,
  pendingMemories: 0,
  guardianCount: 0,
  avgMemories: '0.0' // Media de recuerdos por difunto
})

//GRAFICAS CONFIG

// A Gráfica de Barras
const barSeries = ref([{ name: 'Memoriales', data: [] as number[] }])
const barOptions = ref<ApexOptions>({
  chart: { id: 'bar-growth', toolbar: { show: false } },
  xaxis: { categories: ['Sept', 'Oct', 'Nov', 'Dic', 'Ene', 'Feb'] },
  colors: ['#1976D2'],
  plotOptions: { bar: { borderRadius: 6 } }
})

// B Gráfica de Donut
const donutSeries = ref([] as number[])
const donutOptions = ref<ApexOptions>({
  labels: ['Condolencias', 'Anécdotas', 'Fotos'],
  colors: ['#5C6BC0', '#26A69A', '#FFA726'],
  legend: { position: 'bottom' }
})


// C Gráfica de Líneas 
const lineSeries = ref([{ name: 'Interacciones', data: [] as number[] }])
const lineOptions = ref<ApexOptions>({
  chart: { id: 'line-trend', toolbar: { show: false }, zoom: { enabled: false } },
  stroke: { curve: 'smooth', width: 4 },
  xaxis: { categories: ['Sept', 'Oct', 'Nov', 'Dic', 'Ene', 'Feb'] },
  colors: ['#E91E63'], 
  dataLabels: { enabled: false },
  markers: { size: 5 }
})



// --- (SIMULACIÓN DE API / MOCK DATA) ---
//Uso una función asíncrona para simular la espera del servidor
async function loadDashboardData() {
  loading.value = true
  
  try {
    // Simulo un retraso de red 
    await new Promise(resolve => setTimeout(resolve, 800))

    // Estos datos son estáticos (HARCODEADOS!)
    
    const mockData = {
      totalDeceased: 156,
      pendingMemories: 14,
      totalGuardians: 89,
      avgMemories: "4.2",
      monthlyGrowth: [15, 25, 18, 42, 30, 56],// Datos para las barras
      interactionTrend: [45, 52, 38, 91, 60, 110], // Datos para la línea
      contentDistribution: [200, 85, 120]// Datos para el donut (Condolencias, Anécdotas, Fotos)
    }

    // ACTUALIZACIÓN DEL ESTADO --> (Vue detecta estos cambios y repinta la pantalla)
stats.totalMemorials = mockData.totalDeceased
    stats.pendingMemories = mockData.pendingMemories
    stats.guardianCount = mockData.totalGuardians
    stats.avgMemories = mockData.avgMemories
    // PONGO LOS IFS PORQUE ME DABA ERROR D EPOSIBLE UNDEFINED con los tipos
    if (barSeries.value[0]) {
      barSeries.value[0].data = mockData.monthlyGrowth
    }
    if (lineSeries.value[0]) {
      lineSeries.value[0].data = mockData.interactionTrend
    }
    donutSeries.value = mockData.contentDistribution

  } catch (error) {
    console.error("Error cargando estadísticas", error)
  } finally {
    loading.value = false
  }
}

// Ejecutamos la función nada más entrar el componente en el navegador
onMounted(() => {
  loadDashboardData()
})
</script>




<style scoped>
.gap-3 { gap: 12px; }
.apexcharts-tooltip { color: #000 !important; }/* fuerzo el color del texto dentro del tooltip de ApexCharts por porblema de conltraste */
</style>
