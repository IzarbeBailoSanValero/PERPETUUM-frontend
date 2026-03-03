
<template>  <!-- Vista detalle: Biografía + Muro de Recuerdos -->
  <v-container v-if="store.currentDeceased" class="py-10">
    
    <v-row justify="center" class="mb-10 text-center">
      <v-col cols="12" md="8">
        <v-avatar size="150" class="mb-4 border-lg" color="grey-lighten-2">
          <v-img :src="store.currentDeceased.photoURL">
            <template v-slot:placeholder>
              <div class="w-100 h-100 d-flex align-center justify-center">
                <v-icon size="80" color="grey-lighten-1">mdi-image-off</v-icon>
              </div>
            </template>
            <template v-slot:error>
              <div class="w-100 h-100 d-flex align-center justify-center">
                <v-icon size="80" color="grey-lighten-1">mdi-image-off</v-icon>
              </div>
            </template>
          </v-img>
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
          <AddMemoryModal
            v-if="auth.canCreateMemory"
            :deceasedId="store.currentDeceased.id" 
            @success="store.fetchDeceasedById(store.currentDeceased.id)" 
          />
          <v-btn
            v-else-if="!auth.isLoggedIn"
            to="/login"
            color="primary"
            prepend-icon="mdi-login"
          >
            Inicia sesión para comentar
          </v-btn>
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
import { useAuthStore } from '@/stores/authStore'
import MemoryCard from '@/components/public/MemoryCard.vue'
import AddMemoryModal from '@/components/public/AddMemoryModal.vue'

const store = useMemorialStore()
const auth = useAuthStore()
const route = useRoute() // Para acceder a los parámetros de la URL (:id)

onMounted(() => {
  // Sacamos el ID de la URL y pedimos los datos al Store
  const deceasedId = Number(route.params.id)
  store.fetchDeceasedById(deceasedId)
})
</script>
