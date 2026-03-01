import { defineStore } from 'pinia'
import apiClient from '@/plugins/axios'
import type { Deceased, DeceasedSummary } from '@/models/Deceased'

// --- MODELOS (Interfaces) ---

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
      console.log('🔍 Intentando cargar difunto con ID:', id)
      try {
        const response = await apiClient.get<Deceased>(`/Deceased/${id}`)
        console.log('✅ Datos recibidos:', response.data)
        this.currentDeceased = response.data
      } catch (error) {
        console.error("❌ Error al obtener el difunto:", error)
        this.currentDeceased = null
      } finally {
        this.loading = false
      }
    },

    // trae todos los difuntos iniciales 
    async fetchAllDeceased() {
      this.loading = true
      try {
        // GET /api/Deceased (la primera página)
        const response = await apiClient.get<DeceasedSummary[]>('/Deceased')
        this.deceasedList = response.data
      } catch (error) {
        console.error("Error al traer el listado", error)
      } finally {
        this.loading = false
      }
    },

    // Búsqueda avanzada 
    async fetchAdvancedSearch(filters: any) {
      this.loading = true
      try {
        const response = await apiClient.get<any>('/Deceased/search', { params: filters })
        this.deceasedList = response.data.items;       
        this.totalPages = response.data.totalPages;    
      } catch (error: any) {
        console.error("Error en búsqueda avanzada", error)
        if (error.code === 'ERR_NETWORK' || error.code === 'ECONNREFUSED') {
          console.log('Backend no disponible, reintentando en 2 segundos...')
          await new Promise(resolve => setTimeout(resolve, 2000))
          try {
            const response = await apiClient.get<any>('/Deceased/search', { params: filters })
            this.deceasedList = response.data.items
            this.totalPages = response.data.totalPages
            return
          } catch (retryError) {
            console.error('Reintento fallido', retryError)
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