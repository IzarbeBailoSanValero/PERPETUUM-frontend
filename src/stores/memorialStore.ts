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
  authorName: string | null
  userId: number
  deceasedId: number
}

/** Normaliza objeto del API (PascalCase) a camelCase para uso en la interfaz */
function normalizeDeceasedSummary(raw: any): DeceasedSummary {
  return {
    id: raw?.Id ?? raw?.id,
    name: raw?.Name ?? raw?.name ?? '',
    photoURL: raw?.PhotoURL ?? raw?.photoURL,
    deathDate: raw?.DeathDate ?? raw?.deathDate ?? ''
  }
}

function normalizeMemory(raw: any): Memory {
  return {
    id: raw?.Id ?? raw?.id,
    createdDate: raw?.CreatedDate ?? raw?.createdDate ?? '',
    type: raw?.Type ?? raw?.type ?? '',
    status: raw?.Status ?? raw?.status ?? '',
    textContent: raw?.TextContent ?? raw?.textContent ?? null,
    mediaURL: raw?.MediaURL ?? raw?.mediaURL ?? null,
    authorRelation: raw?.AuthorRelation ?? raw?.authorRelation ?? null,
    authorName: raw?.AuthorName ?? raw?.authorName ?? null,
    userId: raw?.UserId ?? raw?.userId,
    deceasedId: raw?.DeceasedId ?? raw?.deceasedId
  }
}

function normalizeDeceased(raw: any): Deceased | null {
  if (!raw) return null
  const memories = raw?.Memories ?? raw?.memories
  return {
    id: raw?.Id ?? raw?.id,
    name: raw?.Name ?? raw?.name ?? '',
    dni: raw?.Dni ?? raw?.dni ?? '',
    funeralHomeId: raw?.FuneralHomeId ?? raw?.funeralHomeId,
    guardianId: raw?.GuardianId ?? raw?.guardianId,
    staffId: raw?.StaffId ?? raw?.staffId,
    biography: raw?.Biography ?? raw?.biography ?? '',
    photoURL: raw?.PhotoURL ?? raw?.photoURL ?? '',
    birthDate: raw?.BirthDate ?? raw?.birthDate ?? '',
    deathDate: raw?.DeathDate ?? raw?.deathDate ?? '',
    epitaph: raw?.Epitaph ?? raw?.epitaph ?? '',
    memories: Array.isArray(memories) ? memories.map(normalizeMemory) : null
  }
}

// --- STORE ---
export const useMemorialStore = defineStore('memorial', {
  state: () => ({
    deceasedList: [] as DeceasedSummary[],
    currentDeceased: null as Deceased | null,
    loading: false,
    totalPages: 1
  }),

  actions: {

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