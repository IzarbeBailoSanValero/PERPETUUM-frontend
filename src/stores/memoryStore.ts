// Obtiene recuerdos pendientes, aprueba/rechaza y crea recuerdos.

import { defineStore } from 'pinia'
import { ref } from 'vue'
import apiClient from '@/plugins/axios'

export interface Memory {
  id: number
  deceasedName: string
  textContent: string | null
  mediaURL: string | null
  authorRelation: string | null
  /** Valor numérico (1, 2, 3) o string del API (Condolence, Anecdote, Photo) */
  type: number | string
  /** Respuesta del API en PascalCase cuando no se usa camelCase */
  Type?: number | string
  createdDate: string
  userId: number
  deceasedId: number
  status: number
}

export const useMemoryStore = defineStore('memory', () => {
  const memories = ref<Memory[]>([])
  const loading = ref(false)

  async function fetchPendingMemories(deceasedId?: number) {
    loading.value = true
    try {
      const response = await apiClient.get('/Memory/pending', {
        params: deceasedId ? { deceasedId } : undefined
      })
      memories.value = response.data
    } catch (error) {
      console.error('Error al cargar recuerdos pendientes:', error)
    } finally {
      loading.value = false
    }
  }

  async function updateMemoryStatus(id: number, status: number) {
    await apiClient.put(`/Memory/${id}/status`, null, { params: { status } })
    await fetchPendingMemories()
  }

  return {
    memories,
    loading,
    fetchPendingMemories,
    updateMemoryStatus
  }
})
