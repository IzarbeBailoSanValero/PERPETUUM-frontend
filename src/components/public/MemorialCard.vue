<template> <!-- Tarjeta de resumen de un difunto (usada en el listado Home) -->
  <v-container v-if="store.currentDeceased" class="py-10">
    
    <v-row justify="center" class="mb-10 text-center">
      <v-col cols="12" md="8">
        <v-avatar size="150" class="mb-4 border-lg">
          <v-img :src="store.currentDeceased.photoURL"></v-img>
        </v-avatar>
        <h1 class="text-h3 font-serif mb-2">{{ store.currentDeceased.name }}</h1>
        <p class="text-h6 opacity-60 italic">"{{ store.currentDeceased.epitaph }}"</p>
      </v-col>
    </v-row>

    <v-row justify="center">
      <v-col cols="12" md="8">
        <h2 class="text-h5 mb-4">Biografía</h2>
        <p class="text-body-1 mb-10">{{ store.currentDeceased.biography }}</p>
        
        <v-divider class="mb-10"></v-divider>

        <div class="d-flex justify-space-between align-center mb-6">
          <h2 class="text-h4">Muro de Recuerdos</h2>
          <v-btn color="primary" prepend-icon="mdi-heart">Dejar recuerdo</v-btn>
        </div>

        <div v-if="store.currentDeceased.memories && store.currentDeceased.memories.length > 0">
          <MemoryCard 
            v-for="item in store.currentDeceased.memories" 
            :key="item.id" 
            :memory="item" 
          />
        </div>
        
        <v-alert v-else type="info" variant="tonal" icon="mdi-message-off">
          Todavía no hay recuerdos compartidos. Sé el primero en escribir algo.
        </v-alert>
      </v-col>
    </v-row>
  </v-container>

  <v-container v-else-if="store.loading" class="fill-height justify-center align-center">
    <v-progress-circular indeterminate color="primary" size="64"></v-progress-circular>
  </v-container>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useMemorialStore } from '@/stores/memorialStore'
import MemoryCard from '@/components/public/MemoryCard.vue'   // componente hijo

const store = useMemorialStore()  //store de Pinia --> e da acceso a los datos y acciones del memorial
const route = useRoute() // Para acceder a los parámetros de la URL (:id)

onMounted(() => {     //para ejecutar código al cargar la vista
  const deceasedId = Number(route.params.id)    //Lee el ID del difunto desde la URL
  store.fetchDeceasedById(deceasedId)   //Llama al store para cargar los datos del difunto desde la API o backend


})
</script>



