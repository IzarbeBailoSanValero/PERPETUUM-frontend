<template>
  <v-container fluid>
    <v-card border flat class="rounded-xl pa-4">
      <v-card-title class="d-flex align-center">
        <v-icon icon="mdi-book-open-variant" class="mr-3" />
        Mis memoriales (difuntos a mi cargo)
      </v-card-title>
      <v-divider class="my-4" />

      <v-progress-linear v-if="loading" indeterminate color="primary" class="mb-4" />

      <v-row v-else-if="deceasedList.length > 0" class="ma-0">
        <v-col v-for="d in deceasedList" :key="d.id" cols="12" sm="6" md="4">
          <v-card border variant="tonal" class="rounded-lg">
            <div class="card-image-1-1">
              <v-img
                :src="d.photoURL || 'https://via.placeholder.com/400x400?text=Sin+imagen'"
                cover
                referrerpolicy="no-referrer"
                class="align-end"
                gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
              >
                <v-card-title class="text-white">{{ d.name }}</v-card-title>
              </v-img>
            </div>
            <v-card-subtitle class="pt-2">
              Fallecimiento: {{ formatDate(d.deathDate) }}
            </v-card-subtitle>
            <v-card-actions>
              <v-btn
                color="primary"
                variant="flat"
                :to="`/memorial/${d.id}`"
                prepend-icon="mdi-eye"
              >
                Ver memorial
              </v-btn>
              <v-btn
                variant="tonal"
                color="indigo"
                :to="`/guardian/edit-memorial/${d.id}`"
                prepend-icon="mdi-pencil"
              >
                Editar
              </v-btn>
              <v-btn
                variant="text"
                to="/guardian/moderation"
                prepend-icon="mdi-shield-check"
              >
                Moderar
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>

      <v-alert v-else type="info" variant="tonal" class="mt-4">
        No tienes ningún memorial asignado. Contacta con la funeraria si crees que deberías tener acceso.
      </v-alert>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/authStore'
import apiClient from '@/plugins/axios'

const auth = useAuthStore()
const loading = ref(true)
const deceasedList = ref<{ id: number; name: string; photoURL?: string; deathDate: string }[]>([])

function formatDate (dateStr: string) {
  if (!dateStr) return '—'
  const d = new Date(dateStr)
  return d.toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })
}

onMounted(async () => {
  const id = auth.user?.id
  if (!id) return
  try {
    const response = await apiClient.get(`/MemorialGuardian/${id}`)
    deceasedList.value = response.data?.deceasedList ?? []
  } catch (e) {
    console.error('Error cargando memoriales del guardián:', e)
  } finally {
    loading.value = false
  }
})
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
