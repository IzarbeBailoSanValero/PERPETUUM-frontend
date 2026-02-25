

  


  <template>   
   <!-- Buscador avanzado (Filtros, Ordenación, Paginación  -->
  <v-container>
    <v-row class="text-center py-10">
      <v-col cols="12">
        <h1 class="text-h2 font-weight-bold mb-4">Buscador de Memoriales</h1>
        <p class="text-h6 text-grey">Encuentra y comparte recuerdos de tus seres queridos</p>
      </v-col>
    </v-row>

<!--BARRA DE BUSQUEDAD -> V-TEXT-FIELD.    v-model="searchQuery" enlaza el input con la variable reactiva searchQuery. Cada vez que el usuario escribe, searchQuery cambia. Ese cambio dispara automáticamente el computed que filtra la lista.-->
    <v-row justify="center">
      <v-col cols="12" md="6">
        <v-text-field   
          v-model="searchQuery"
          label="Buscar por nombre..."
          prepend-inner-icon="mdi-magnify"
          variant="solo-filled"
          rounded="pill"
          clearable
        ></v-text-field>
      </v-col>
    </v-row>

    <!-- v-hover para que las tarjetas se vean interactivas-->
    <v-row v-if="filteredDeceased.length > 0">
      <v-col v-for="item in filteredDeceased" :key="item.id" cols="12" sm="6" md="4">
        <v-hover v-slot="{ isHovering, props }"> <!--Detecta si el cursor está encima.Expone una variable reactiva: isHovering. Expone props que deben pasarse al elemento que quieres que reaccione al hover (onMouseenter, onMouseleave...).-->
          <v-card
            v-bind="props"
            :elevation="isHovering ? 12 : 2"
            class="rounded-xl transition-swing"
            :to="'/memorial/' + item.id" 
          >
            <v-img :src="item.photoURL" height="200" cover></v-img>
            <v-card-title>{{ item.name }}</v-card-title>
            <v-card-subtitle>{{ formatDate(item.deathDate) }}</v-card-subtitle>
            <v-card-text class="text-truncate">{{ item.epitaph }}</v-card-text>
          </v-card>
        </v-hover>
      </v-col>
    </v-row>

    <v-row v-else-if="!store.loading" justify="center" class="mt-10">
      <v-col cols="12" class="text-center">
        <v-icon size="64" color="grey-lighten-1">mdi-account-search-outline</v-icon>
        <p class="text-grey mt-4">No se han encontrado resultados para tu búsqueda.</p>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useMemorialStore } from '@/stores/memorialStore'

const store = useMemorialStore()
const searchQuery = ref('') // Estado local para el texto del buscador

// CONCEPTO TEÓRICO: Computed Property
// Es una función que "vigila" a searchQuery y a store.deceasedList.
// Si cualquiera de los dos cambia, se recalcula sola de forma eficiente.
const filteredDeceased = computed(() => {
  if (!searchQuery.value) return store.deceasedList
  
  return store.deceasedList.filter(item => 
    item.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

const formatDate = (date: string) => new Date(date).getFullYear()

onMounted(() => {
  store.fetchAllDeceased()
})
</script>

