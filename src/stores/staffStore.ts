// Store para la gestión de empleados (Staff) de funerarias

import { defineStore } from 'pinia'
import { ref } from 'vue'
import apiClient from '@/plugins/axios'

export interface StaffResponse {
  id: number
  funeralHomeId: number | null
  name: string
  email: string
  dni: string
}

export const useStaffStore = defineStore('staff', () => {
  const staffList = ref<StaffResponse[]>([])
  const loading = ref(false)
  const currentFuneralHomeId = ref<number | null>(null)

  async function fetchByFuneralHome(funeralHomeId: number) {
    loading.value = true
    currentFuneralHomeId.value = funeralHomeId
    try {
      const response = await apiClient.get(`/Staff/funeralhome/${funeralHomeId}`)
      staffList.value = response.data
    } catch (error) {
      console.error('Error al cargar empleados:', error)
      staffList.value = []
    } finally {
      loading.value = false
    }
  }

  function addToList(item: StaffResponse) {
    staffList.value.push(item)
  }

  function updateInList(updated: StaffResponse) {
    const idx = staffList.value.findIndex(s => s.id === updated.id)
    if (idx !== -1) staffList.value[idx] = updated
  }

  function removeFromList(id: number) {
    staffList.value = staffList.value.filter(s => s.id !== id)
  }

  return {
    staffList,
    loading,
    currentFuneralHomeId,
    fetchByFuneralHome,
    addToList,
    updateInList,
    removeFromList
  }
})
