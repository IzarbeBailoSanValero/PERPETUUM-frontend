

<template>   
  <v-container>
<!-- Encabezado -->
    <v-row class="text-center py-10">
      <v-col cols="12">
        <h1 class="text-h2 font-weight-bold mb-4">{{ t.title }}</h1>
        <p class="text-h6 text-grey">{{ t.subtitle }}</p>
      </v-col>
    </v-row>
    <!-- Filtros de búsqueda -->
    <v-card class="pa-4 mb-8 rounded-xl" elevation="2" variant="outlined">
      <v-row align="center">
   <!--  nombre -->
        <v-col cols="12" md="4">
          <v-text-field   
            v-model="searchParams.Name"
            :label="t.labelName"
            prepend-inner-icon="mdi-magnify"
            variant="underlined"
            hide-details
            clearable
            @keyup.enter="executeSearch"
            @click:clear="resetAndSearch"
          />
        </v-col>
  <!-- Año de defunción -->
        <v-col cols="12" md="3">
          <v-text-field   
            v-model="searchParams.DeathYear"
            :label="t.labelYear"
            prepend-inner-icon="mdi-calendar"
            type="number"
            variant="underlined"
            hide-details
            clearable
            @keyup.enter="executeSearch"
            @click:clear="resetAndSearch"
          />
        </v-col>
 <!-- Ordenar  -->
        <v-col cols="12" md="3">
          <v-select
            v-model="searchParams.SortBy"
            :items="sortOptions"
            item-title="title"
            item-value="value"
            :label="t.labelSort"
            variant="underlined"
            hide-details
            @update:modelValue="resetAndSearch"
          />
        </v-col>
     <!-- ejecutar -->
        <v-col cols="12" md="2">
          <v-btn color="primary" block @click="executeSearch" :loading="store.loading">
            {{ t.btnSearch }}
          </v-btn>
        </v-col>

      </v-row>
    </v-card>
    <!-- pinto resultados -->
    <v-row v-if="store.deceasedList.length > 0">
      <!-- tarjeta por  fallecido -->
      <v-col v-for="item in store.deceasedList" :key="item.id" cols="12" sm="6" md="4">
        <v-hover v-slot="{ isHovering, props }">
          <v-card
            v-bind="props"
            :elevation="isHovering ? 12 : 2"
            class="rounded-xl transition-swing"
            :to="'/memorial/' + item.id"
          >
            <div class="card-image-1-1">
              <v-img :src="item.photoURL" cover>
                <template v-slot:placeholder>
                  <div class="w-100 h-100 d-flex align-center justify-center bg-grey-lighten-3">
                    <v-icon size="60" color="grey-lighten-1">mdi-image-off</v-icon>
                  </div>
                </template>
                <template v-slot:error>
                  <div class="w-100 h-100 d-flex align-center justify-center bg-grey-lighten-3">
                    <v-icon size="60" color="grey-lighten-1">mdi-image-off</v-icon>
                  </div>
                </template>
              </v-img>
            </div>
            <v-card-title>{{ item.name }}</v-card-title>
            <v-card-subtitle>{{ formatDate(item.deathDate) }}</v-card-subtitle>
          </v-card>
        </v-hover>
      </v-col>
    </v-row>

    <v-row justify="center" class="mt-8" v-if="store.deceasedList.length > 0">
      <v-pagination
        v-model="searchParams.Page"
        :length="store.totalPages"
        @update:modelValue="executeSearch"
        active-color="primary"
      ></v-pagination>
    </v-row>
     <!-- cuando no hay resultados -->
    <v-row v-else-if="!store.loading" justify="center" class="mt-10">
      <v-col cols="12" class="text-center">
        <v-icon size="64" color="grey-lighten-1">mdi-account-search-outline</v-icon>
        <p class="text-grey mt-4">{{ t.noResults }}</p>
      </v-col>
    </v-row>

  </v-container>
</template>
















<script setup lang="ts">
import { reactive, onMounted, computed } from 'vue' //computed para las traducciones
import { useMemorialStore } from '@/stores/memorialStore'
import { useUiStore } from '@/stores/uiStore' // store de la interfaz para el idioma

const store = useMemorialStore()
const ui = useUiStore() // Accedemos al estado del idioma

// Lógica de traducciones 
const t = computed(() => {
  if (ui.language === 'en') {
    return {
      title: 'Memorial Search',
      subtitle: 'Find and share memories of your loved ones',
      labelName: 'Search by name...',
      labelYear: 'Death year',
      labelSort: 'Sort by',
      btnSearch: 'Search',
      noResults: 'No results found for your search.'
    }
  }
  return {
    title: 'Buscador de Memoriales',
    subtitle: 'Encuentra y comparte recuerdos de tus seres queridos',
    labelName: 'Buscar por nombre...',
    labelYear: 'Año de defunción',
    labelSort: 'Ordenar por',
    btnSearch: 'Buscar',
    noResults: 'No se han encontrado resultados para tu búsqueda.'
  }
})

const sortOptions = computed(() => {
  if (ui.language === 'en') {
    return [
      { title: 'Recent', value: 'DeathDate|DESC' },
      { title: 'Oldest', value: 'DeathDate|ASC' },
      { title: 'A-Z', value: 'Name|ASC' }
    ]
  }
  return [
    { title: 'Recientes', value: 'DeathDate|DESC' },
    { title: 'Antiguos', value: 'DeathDate|ASC' },
    { title: 'A-Z', value: 'Name|ASC' }
  ]
})

/*voy a crear el objeto searchParams y enviarlo al backend */

// 1. DeceasedSearchDTO , uso reactive para no .value.   + Paginación
const searchParams = reactive({
  Name: '',
  DeathYear: null,
  SortBy: 'DeathDate|DESC',
  SortOrder: 'DESC',
  Page: 1,      // Empieza en la página 1
  PageSize: 9   // Requisito: Cuántos elementos por página queremos
})

// 2. recoge los datos y los manda al Store
function executeSearch() {
  const selectedSort = searchParams.SortBy as string
  const [sortBy, sortOrder] = selectedSort.includes('|') 
    ? selectedSort.split('|') 
    : [selectedSort, 'ASC']
  
  store.fetchAdvancedSearch({
    ...searchParams,
    SortBy: sortBy,
    SortOrder: sortOrder
  })
}

// Resetea la página a 1 y ejecuta búsqueda
function resetAndSearch() {
  searchParams.Page = 1
  executeSearch()
}

const formatDate = (date: string) => new Date(date).getFullYear()

// 3. Al entrar a la página,  búsqueda vacía para que carguen todos
onMounted(() => {
  executeSearch()
})


/*
APUNTES :
- Petición con envio `searchParams` a C# mediante Axios.
- Paginada: Usamos <v-pagination> enlazado a `searchParams.Page`. Cuando el usuario hace clic en el botón , se dispara `@update:modelValue` y Vue vuelve a llamar a executeSearch() automáticamente.
- Ordenada y Fechas: Tenemos v-select (SortBy) y un input (DeathYear) integrados en la petición.
*/
</script>

<style scoped>
.card-image-1-1 {
  aspect-ratio: 1 / 1;
  overflow: hidden;
  width: 100%;
}
.card-image-1-1 :deep(.v-img) {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>