// Store para la gestión de funerarias (solo Admin)

import { defineStore } from 'pinia'
import { ref } from 'vue'
import apiClient from '@/plugins/axios'

export interface FuneralHomeResponse {
  id: number
  name: string
  cif: string
  contactEmail: string
  address: string
  phoneNumber: string
}

/** Normaliza PascalCase o camelCase → FuneralHomeResponse */
function normalizeFuneralHome(raw: any): FuneralHomeResponse {
  return {
    id:           raw?.id           ?? raw?.Id,
    name:         raw?.name         ?? raw?.Name         ?? '',
    cif:          raw?.cif          ?? raw?.CIF          ?? '',
    contactEmail: raw?.contactEmail ?? raw?.ContactEmail ?? '',
    address:      raw?.address      ?? raw?.Address      ?? '',
    phoneNumber:  raw?.phoneNumber  ?? raw?.PhoneNumber  ?? ''
  }
}

export const useFuneralHomeStore = defineStore('funeralHome', () => {
  const funeralHomes = ref<FuneralHomeResponse[]>([])
  const loading      = ref(false)

  async function fetchAll() {
    loading.value = true
    try {
      const response = await apiClient.get('/FuneralHome')
      const data = Array.isArray(response.data) ? response.data : []
      funeralHomes.value = data.map(normalizeFuneralHome)
    } catch (error) {
      console.error('Error al cargar funerarias:', error)
      funeralHomes.value = []
    } finally {
      loading.value = false
    }
  }

  function addToList(raw: any) {
    funeralHomes.value.push(normalizeFuneralHome(raw))
  }

  function updateInList(raw: any) {
    const updated = normalizeFuneralHome(raw)
    const idx = funeralHomes.value.findIndex(f => f.id === updated.id)
    if (idx !== -1) funeralHomes.value[idx] = updated
  }

  function removeFromList(id: number) {
    funeralHomes.value = funeralHomes.value.filter(f => f.id !== id)
  }

  return {
    funeralHomes,
    loading,
    fetchAll,
    addToList,
    updateInList,
    removeFromList
  }
})