// (Entidad 2) Gestiona la creación y listado de familiares vinculados a la funeraria.

import { defineStore } from 'pinia'
import { ref } from 'vue'
import apiClient from '@/plugins/axios'

function normalizeGuardian(raw: any) {
  return {
    id: raw?.id ?? raw?.Id,
    name: raw?.name ?? raw?.Name ?? '',
    dni: raw?.dni ?? raw?.Dni ?? '',
    email: raw?.email ?? raw?.Email ?? '',
    phoneNumber: raw?.phoneNumber ?? raw?.PhoneNumber ?? '',
    funeralHomeId: raw?.funeralHomeId ?? raw?.FuneralHomeId ?? null
  }
}

export const useGuardianStore = defineStore('guardian', () => {
  const guardians = ref<any[]>([])
  const loading = ref(false)

  async function fetchAllGuardians() {
    loading.value = true
    try {
      const response = await apiClient.get('/MemorialGuardian')
      const data = Array.isArray(response.data) ? response.data : []
      guardians.value = data.map(normalizeGuardian)
    } catch (error) {
      console.error('Error al cargar guardianes:', error)
    } finally {
      loading.value = false
    }
  }

  return { 
    guardians, 
    loading, 
    fetchAllGuardians 
  }
})
