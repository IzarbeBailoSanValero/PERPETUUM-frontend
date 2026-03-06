<template>
  <v-container fluid>
    <div class="d-flex justify-space-between align-center mb-6">
      <div>
        <h1 class="text-h4 font-weight-bold">{{ t('admin.dashboard.title') }}</h1>
        <p class="text-subtitle-1 text-medium-emphasis">{{ t('admin.dashboard.subtitle') }}</p>
      </div>

      <v-col cols="12" md="6" class="d-flex justify-md-end align-center gap-3">
        <v-select 
          v-model="timeRange" :items="periodItems"
          :label="t('admin.dashboard.period')" variant="outlined" density="compact" hide-details style="max-width: 200px;" class="mr-4"
          @update:model-value="loadDashboardData"
        >
        </v-select>

        <v-btn prepend-icon="mdi-refresh" color="primary" variant="elevated" @click="loadDashboardData" :loading="loading">
          Actualizar 
        </v-btn>
      </v-col>
    </div>

    <v-row v-if="!loading">
      <v-col cols="12" sm="6" md="3">
        <KpiCard :title="t('admin.dashboard.kpi.memorials')" :value="stats.totalMemorials" icon="mdi-grave-stone"  color="primary"   />
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <KpiCard :title="t('admin.dashboard.kpi.pending')"   :value="stats.pendingMemories" icon="mdi-message-alert" color="warning"   />
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <KpiCard :title="t('admin.dashboard.kpi.guardians')" :value="stats.guardianCount"   icon="mdi-account-heart" color="secondary" />
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <KpiCard :title="t('admin.dashboard.kpi.avg')"       :value="stats.avgMemories"     icon="mdi-chart-line"    color="success"   />
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
import { ref, reactive, onMounted, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useTheme } from 'vuetify'
import type { ApexOptions } from 'apexcharts'
import KpiCard from '@/components/admin/KpiCard.vue'

const { t } = useI18n()
const loading = ref(true)
const timeRange = ref('6months')

// Paleta orgánica — mismos valores que vuetify.ts para que las gráficas
// estén siempre alineadas con el tema visual aunque ApexCharts no acceda
// directamente a las variables CSS de Vuetify
const PALETTE = {
  light: {
    primary:   '#6B5344', // madera oscura
    secondary: '#5C8FA3', // azul cielo
    warning:   '#8C6230', // ámbar tierra
    success:   '#5A7A5A', // salvia verde
    text:      '#2A1F16', // texto oscuro cálido
    textMuted: '#7A6A5A', // texto secundario
    grid:      '#DDD5C8', // líneas de cuadrícula
    bg:        'transparent'
  },
  dark: {
    primary:   '#C8A882', // arena cálida
    secondary: '#88B8CC', // cielo claro
    warning:   '#C8A050', // ámbar dorado
    success:   '#88B488', // salvia clara
    text:      '#EDE5D8', // texto claro cálido
    textMuted: '#A89880', // texto secundario oscuro
    grid:      '#3A3028', // líneas de cuadrícula oscuras
    bg:        'transparent'
  }
}

// Vuetify expone el tema activo; lo usamos para sincronizar ApexCharts
const vuetifyTheme = useTheme()
const isDark = computed(() => vuetifyTheme.global.current.value.dark)
const palette = computed(() => isDark.value ? PALETTE.dark : PALETTE.light)

// Objeto stats: guarda los números simples
const stats = reactive({
  totalMemorials: 0,
  pendingMemories: 0,
  guardianCount: 0,
  avgMemories: '0.0' // Media de recuerdos por difunto
})

// ─── Opciones base de ApexCharts (se recomputan al cambiar tema) ─────────────

// Opciones compartidas para que los ejes y tooltips se lean bien en ambos modos
function baseChartTheme(): Partial<ApexOptions> {
  const p = palette.value
  return {
    chart: {
      background: p.bg,
      foreColor: p.text,       // color de texto de ejes y labels
      toolbar: { show: false }
    },
    grid: {
      borderColor: p.grid
    },
    tooltip: {
      theme: isDark.value ? 'dark' : 'light'
    },
    xaxis: {
      labels: { style: { colors: p.textMuted } },
      axisBorder: { color: p.grid },
      axisTicks: { color: p.grid }
    },
    yaxis: {
      labels: { style: { colors: p.textMuted } }
    }
  }
}

// A Gráfica de Barras
const barSeries = ref([{ name: 'Memoriales', data: [] as number[] }])
const barOptions = computed<ApexOptions>(() => ({
  ...baseChartTheme(),
  chart: { ...baseChartTheme().chart, id: 'bar-growth' },
  xaxis: { ...baseChartTheme().xaxis, categories: ['Sept', 'Oct', 'Nov', 'Dic', 'Ene', 'Feb'] },
  colors: [palette.value.primary],
  plotOptions: { bar: { borderRadius: 6 } }
}))

// B Gráfica de Donut
const donutSeries = ref([] as number[])
const donutOptions = computed<ApexOptions>(() => ({
  ...baseChartTheme(),
  labels: ['Condolencias', 'Anécdotas', 'Fotos'],
  // Tres tonos de la paleta: madera, cielo, ámbar
  colors: [palette.value.primary, palette.value.secondary, palette.value.warning],
  legend: {
    position: 'bottom',
    labels: { colors: palette.value.text }
  },
  dataLabels: {
    style: { colors: ['#fff'] }
  }
}))

// C Gráfica de Líneas 
const lineSeries = ref([{ name: 'Interacciones', data: [] as number[] }])
const lineOptions = computed<ApexOptions>(() => ({
  ...baseChartTheme(),
  chart: { ...baseChartTheme().chart, id: 'line-trend', zoom: { enabled: false } },
  stroke: { curve: 'smooth', width: 4 },
  xaxis: { ...baseChartTheme().xaxis, categories: ['Sept', 'Oct', 'Nov', 'Dic', 'Ene', 'Feb'] },
  colors: [palette.value.secondary],
  dataLabels: { enabled: false },
  markers: { size: 5, colors: [palette.value.secondary] }
}))

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
</style>