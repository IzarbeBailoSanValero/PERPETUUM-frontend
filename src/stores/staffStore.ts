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
  isAdmin: boolean
}

/** Normaliza objeto del API (PascalCase o camelCase) a StaffResponse */
function normalizeStaff(item: any): StaffResponse {
  return {
    id: item?.id ?? item?.Id,
    funeralHomeId: item?.funeralHomeId ?? item?.FuneralHomeId ?? null,
    name: item?.name ?? item?.Name ?? '',
    email: item?.email ?? item?.Email ?? '',
    dni: item?.dni ?? item?.DNI ?? '',
    isAdmin: item?.isAdmin ?? item?.IsAdmin ?? false
  }
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
      const data = Array.isArray(response.data) ? response.data : []
      staffList.value = data.map(normalizeStaff)
    } catch (error) {
      console.error('Error al cargar empleados:', error)
      staffList.value = []
    } finally {
      loading.value = false
    }
  }

  function addToList(item: any) {
    staffList.value.push(normalizeStaff(item))
  }

  function updateInList(updated: StaffResponse | any) {
    const n = normalizeStaff(updated)
    const idx = staffList.value.findIndex(s => s.id === n.id)
    if (idx !== -1) staffList.value[idx] = n
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
