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
  createdDate: string
  userId: number
  deceasedId: number
  status: number
}
/**El API puede devolver los datos en camelCase o PascalCase (ej: deceasedName o DeceasedName). 
 * Esta función los unifica en un formato consistente usando el operador ?? (nullish coalescing), intentando primero el formato camel y luego el pascal. 
 * Normaliza la respuesta del API (PascalCase o camelCase) al formato uniforme del store */
function normalizeMemory(raw: any): Memory {
  return {
    id: raw?.id ?? raw?.Id,
    deceasedName: raw?.deceasedName ?? raw?.DeceasedName ?? '',
    textContent: raw?.textContent ?? raw?.TextContent ?? null,
    mediaURL: raw?.mediaURL ?? raw?.MediaURL ?? null,
    authorRelation: raw?.authorRelation ?? raw?.AuthorRelation ?? null,
    type: raw?.type ?? raw?.Type ?? '',
    createdDate: raw?.createdDate ?? raw?.CreatedDate ?? '',
    userId: raw?.userId ?? raw?.UserId ?? 0,
    deceasedId: raw?.deceasedId ?? raw?.DeceasedId ?? 0,
    status: raw?.status ?? raw?.Status ?? 0,
  }
}

export const useMemoryStore = defineStore('memory', () => {
  const memories = ref<Memory[]>([])
  const loading = ref(false)

  async function fetchPendingMemories() {
    loading.value = true
    try {
      const response = await apiClient.get('/Memory/pending')
      const data = Array.isArray(response.data) ? response.data : []
      memories.value = data.map(normalizeMemory)
    } catch (error) {
      console.error('Error al cargar recuerdos pendientes:', error)
    } finally {
      loading.value = false
    }
  }

  async function updateMemoryStatus(id: number, status: number) {
    await apiClient.put(`/Memory/${id}/status`, null, { params: { status } }) // 1. construye url -> envi anull como body del put -> añade queryparams, si status es true lo añade --> ej. /Memory/10/status?status=active
    await fetchPendingMemories() // como hemos cambiado el elemnto en el backend a través del put, llamamos a fetchPending par aque la ui se actualice con la nueva lista
  }



  //RECUPERACIÓN
  async function fetchMemoriesByUser(userId: string) {
    loading.value = true;

    try {
      const response = await apiClient.get(`/Memory/user/${userId}`)
      const data = Array.isArray(response.data) ? response.data : []
      memories.value = data.map(normalizeMemory)
    } catch (error) {
      console.log("error al recuperar recuerdos por usuario")
    } finally {
      loading.value = false;
    }
  }

  //RECUPERACIÓN
  async function deleteMemory ( memoryId: string, userId: string) {
    loading.value = true

    try{
      const response = await apiClient.delete(`/Memory/${memoryId}`)
      await fetchMemoriesByUser(userId)
    }catch(error){
      console.log("error al borrar recuerdo")
    }finally{
      loading.value = false;
    }
  }





  return {
    memories,
    loading,
    fetchPendingMemories,
    updateMemoryStatus,
    fetchMemoriesByUser,
    deleteMemory
  }
})