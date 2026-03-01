// (Entidad 2) Gestiona la creación y listado de familiares vinculados a la funeraria.

import { defineStore } from 'pinia'
import { ref } from 'vue'
import apiClient from '@/plugins/axios'

export const useGuardianStore = defineStore('guardian', () => {
  const guardians = ref<any[]>([])
  const loading = ref(false)

  async function fetchAllGuardians() {
    loading.value = true
    try {
      const response = await apiClient.get('/MemorialGuardian')
      guardians.value = response.data
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
