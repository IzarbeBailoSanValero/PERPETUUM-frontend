<template>
  <v-container fluid>
    <div class="d-flex justify-space-between align-center mb-6">
      <div>
        <h1 class="text-h4 font-weight-bold">{{ t('admin.dashboard.title') }}</h1>
        <p class="text-subtitle-1 text-grey">{{ t('admin.dashboard.subtitle') }}</p>
      </div>

      <v-col cols="12" md="6" class="d-flex justify-md-end align-center gap-3">
        <v-select 
          v-model="timeRange" :items="periodItems"
          :label="t('admin.dashboard.period')" variant="outlined" density="compact" hide-details style="max-width: 200px;" class="mr-4"
          @update:model-value="loadDashboardData"
        >
        </v-select>

        <v-btn prepend-icon="mdi-refresh" color="indigo" variant="elevated" @click="loadDashboardData" :loading="loading">
          Actualizar 
        </v-btn>
      </v-col>
    </div>

    <v-row v-if="!loading">
      <v-col cols="12" sm="6" md="3">
        <KpiCard :title="t('admin.dashboard.kpi.memorials')" :value="stats.totalMemorials" icon="mdi-grave-stone" color="blue" />
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <KpiCard :title="t('admin.dashboard.kpi.pending')" :value="stats.pendingMemories" icon="mdi-message-alert" color="orange" />
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <KpiCard :title="t('admin.dashboard.kpi.guardians')" :value="stats.guardianCount" icon="mdi-account-heart" color="indigo" />
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <KpiCard :title="t('admin.dashboard.kpi.avg')" :value="stats.avgMemories" icon="mdi-chart-line" color="green" />
      </v-col>
    </v-row>

    <v-row v-else justify="center" align="center" style="height: 200px;">
      <v-progress-circular indeterminate color="primary" size="64"></v-progress-circular>
    </v-row>

    <v-row class="mt-4">
      <v-col cols="12" md="8">
        <v-card border flat class="rounded-xl pa-4">
          <v-card-title class="text-subtitle-1 font-weight-bold">{{ t('admin.dashboard.charts.growth') }}</v-card-title>
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
          <v-card-title class="text-subtitle-1 font-weight-bold">{{ t('admin.dashboard.charts.content') }}</v-card-title>
          <apexchart type="donut" height="300" :options="donutOptions" :series="donutSeries"></apexchart>
        </v-card>
      </v-col>

      <v-col cols="12">
        <v-card border flat class="rounded-xl pa-4">
          <v-card-title class="text-subtitle-1 font-weight-bold">
            {{ t('admin.dashboard.charts.trend') }}
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
import { ref, reactive, onMounted, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import type { ApexOptions } from 'apexcharts'
import KpiCard from '@/components/admin/KpiCard.vue'

const { t } = useI18n()
const loading = ref(true)
const timeRange = ref('6months')

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
const periodItems = computed(() => [
  { title: t('admin.dashboard.periods.7days'),  value: '7days'  },
  { title: t('admin.dashboard.periods.month'),  value: 'month'  },
  { title: t('admin.dashboard.periods.6months'),value: '6months'},
  { title: t('admin.dashboard.periods.year'),   value: 'year'   }
])

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
    
    // Actualización de series con tipado correcto
    barSeries.value = [{ name: 'Memoriales', data: mockData.monthlyGrowth }]
    lineSeries.value = [{ name: 'Interacciones', data: mockData.interactionTrend }]
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