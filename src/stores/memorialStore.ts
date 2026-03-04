import { defineStore } from 'pinia'
import apiClient from '@/plugins/axios'
import type { Deceased, DeceasedSummary } from '@/models/Deceased'

// Coincide con MemoryResponseDTO
export interface Memory {
  id: number
  createdDate: string
  type: string
  status: string
  textContent: string | null
  mediaURL: string | null
  authorRelation: string | null
  userId: number
  deceasedId: number
}

/** Normaliza objeto del API (PascalCase) a camelCase para uso en la interfaz */
function normalizeDeceasedSummary(raw: any): DeceasedSummary {
  return {
    id: raw?.id ?? raw?.Id,
    name: raw?.name ?? raw?.Name ?? '',
    photoURL: raw?.photoURL ?? raw?.PhotoURL,
    deathDate: raw?.deathDate ?? raw?.DeathDate ?? ''
  }
}

function normalizeMemory(raw: any): Memory {
  return {
    id: raw?.id ?? raw?.Id,
    createdDate: raw?.createdDate ?? raw?.CreatedDate ?? '',
    type: raw?.type ?? raw?.Type ?? '',
    status: raw?.status ?? raw?.Status ?? '',
    textContent: raw?.textContent ?? raw?.TextContent ?? null,
    mediaURL: raw?.mediaURL ?? raw?.MediaURL ?? null,
    authorRelation: raw?.authorRelation ?? raw?.AuthorRelation ?? null,
    userId: raw?.userId ?? raw?.UserId,
    deceasedId: raw?.deceasedId ?? raw?.DeceasedId
  }
}

function normalizeDeceased(raw: any): Deceased | null {
  if (!raw) return null
  const memories = raw?.memories ?? raw?.Memories
  return {
    id: raw?.id ?? raw?.Id,
    name: raw?.name ?? raw?.Name ?? '',
    dni: raw?.dni ?? raw?.Dni ?? '',
    funeralHomeId: raw?.funeralHomeId ?? raw?.FuneralHomeId,
    guardianId: raw?.guardianId ?? raw?.GuardianId,
    staffId: raw?.staffId ?? raw?.StaffId,
    biography: raw?.biography ?? raw?.Biography ?? '',
    photoURL: raw?.photoURL ?? raw?.PhotoURL ?? '',
    birthDate: raw?.birthDate ?? raw?.BirthDate ?? '',
    deathDate: raw?.deathDate ?? raw?.DeathDate ?? '',
    epitaph: raw?.epitaph ?? raw?.Epitaph ?? '',
    memories: Array.isArray(memories) ? memories.map(normalizeMemory) : null
  }
}

// --- STORE ---
//  es como una base de datos local y reactiva. si los datos en el Store cambian, los componentes que los usan se repintan automáticamente.

export const useMemorialStore = defineStore('memorial', {
  state: () => ({     // función flecha que devuelve un objeto --> para que cada vez que se use el store los datos empiecen limpios y tipados
    deceasedList: [] as DeceasedSummary[],    //  DeceasedSummary ( DTO ligero) -  listado general
    currentDeceased: null as Deceased | null, // memorial individual
    loading: false,
    totalPages: 1                             // x defecto
  }),

  actions: { //  funciones que modifican el estado
    
    // ver el detalle de un memorial
    async fetchDeceasedById(id: number) {
      this.loading = true
      try {
        const response = await apiClient.get(`/Deceased/${id}`)
        this.currentDeceased = normalizeDeceased(response.data)
      } catch (error) {
        console.error("Error al obtener el difunto:", error)
        this.currentDeceased = null
      } finally {
        this.loading = false
      }
    },

    async fetchAllDeceased() {
      this.loading = true
      try {
        const response = await apiClient.get('/Deceased')
        const data = Array.isArray(response.data) ? response.data : []
        this.deceasedList = data.map(normalizeDeceasedSummary)
      } catch (error) {
        console.error("Error al traer el listado", error)
      } finally {
        this.loading = false
      }
    },

    async fetchAdvancedSearch(filters: any) {
      this.loading = true
      try {
        const response = await apiClient.get<any>('/Deceased/search', { params: filters })
        const items = response.data?.items ?? []
        this.deceasedList = items.map(normalizeDeceasedSummary)
        this.totalPages = response.data?.totalPages ?? 1
      } catch (error: any) {
        console.error("Error en búsqueda avanzada", error)
        if (error.code === 'ERR_NETWORK' || error.code === 'ECONNREFUSED') {
          await new Promise(resolve => setTimeout(resolve, 2000))
          try {
            const retry = await apiClient.get<any>('/Deceased/search', { params: filters })
            this.deceasedList = (retry.data?.items ?? []).map(normalizeDeceasedSummary)
            this.totalPages = retry.data?.totalPages ?? 1
            return
          } catch {
            // fall through
          }
        }
        this.deceasedList = []
        this.totalPages = 1
      } finally {
        this.loading = false
      }
    }
  }
})