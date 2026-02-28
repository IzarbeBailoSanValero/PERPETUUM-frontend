<template>   
  <v-container>

    <!-- Encabezado -->
    <v-row class="text-center py-10">
      <v-col cols="12">
        <h1 class="text-h2 font-weight-bold mb-4">Buscador de Memoriales</h1>
        <p class="text-h6 text-grey">Encuentra y comparte recuerdos de tus seres queridos</p>
      </v-col>
    </v-row>

    <!-- Filtros de búsqueda -->
    <v-card class="pa-4 mb-8 rounded-xl" elevation="2" variant="outlined">
      <v-row align="center">

        <!--  nombre -->
        <v-col cols="12" md="4">
          <v-text-field   
            v-model="searchParams.Name"
            label="Buscar por nombre..."
            prepend-inner-icon="mdi-magnify"
            variant="underlined"
            hide-details
            clearable
            @keyup.enter="executeSearch"
          />
        </v-col>

        <!-- Año de defunción -->
        <v-col cols="12" md="3">
          <v-text-field   
            v-model="searchParams.DeathYear"
            label="Año de defunción"
            prepend-inner-icon="mdi-calendar"
            type="number"
            variant="underlined"
            hide-details
            clearable
            @keyup.enter="executeSearch"
          />
        </v-col>

        <!-- Ordenar  -->
        <v-col cols="12" md="3">
          <v-select
            v-model="searchParams.SortBy"
            :items="['Recientes', 'Antiguos', 'A-Z']"
            label="Ordenar por"
            variant="underlined"
            hide-details
          />
        </v-col>

        <!-- ejecutar -->
        <v-col cols="12" md="2">
          <v-btn color="primary" block @click="executeSearch" :loading="store.loading">
            Buscar
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
            <v-img :src="item.photoURL" height="200" cover />
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
        <p class="text-grey mt-4">No se han encontrado resultados para tu búsqueda.</p>
      </v-col>
    </v-row>

  </v-container>
</template>


<script setup lang="ts">
import { reactive, onMounted } from 'vue'
import { useMemorialStore } from '@/stores/memorialStore'

const store = useMemorialStore()
/*voy a crear el objeto searchParams y enviarlo al backend */


// 1. DeceasedSearchDTO , uso reactive para no .value.   + Paginación
const searchParams = reactive({
  Name: '',
  DeathYear: null,
  SortBy: 'Recientes',
  Page: 1,      // Empieza en la página 1
  PageSize: 9   // Requisito: Cuántos elementos por página queremos
})

// 2. recoge los datos y los manda al Store
function executeSearch() {
  store.fetchAdvancedSearch(searchParams)
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

