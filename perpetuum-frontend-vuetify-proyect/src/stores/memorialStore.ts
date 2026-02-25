
import { defineStore } from 'pinia'
import apiClient from '@/plugins/axios'

// --- MODELOS (Interfaces) ---


// Coincide con  MemoryResponseDTO de C# --> lo especifico porque va dentro de deceased
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

// Coincide con DeceasedResponseDTO de C#
export interface Deceased {
  id: number
  funeralHomeId: number
  guardianId: number
  dni: string
  name: string
  epitaph: string
  biography: string
  photoURL: string
  birthDate: string
  deathDate: string
  memories: Memory[] | null 
}



// --- STORE ---
//Un Store es como una base de datos local y reactiva.  significa que si los datos en el Store cambian, los componentes que los usan se repintan automáticamente.

export const useMemorialStore = defineStore('memorial', {
  state: () => ({     //función flecha que devuelve un objeto --> para que cada vez que se use el store, los datos empiecen limpios y tipados
    deceasedList: [] as Deceased[],    // Para  listado general, guardaré todos los difuntos
    currentDeceased: null as Deceased | null, // Para  memorial individual --> cunado entro a /memorial/5, guardo aquí los datos de ese difunto en concreto. Al pricnipio no hay ninguno seleccionado, se empieza en nuelo. Se le dice que puede tener dos estados: o null o un deceasedd
    loading: false
  }),

  actions: { //las actions son las funciones que modifican el estado
    // Acción para ver el detalle de un memorial
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

    //En lugar de pedir a la API cada vez que el usuario escribe una letra sar Computed Properties para filtrar los datos que ya tenemos en el Store.--> acción que traiga todos los difuntos para que el buscador tenga dónde buscar.
  async fetchAllDeceased() {
  this.loading = true
  try {
    // GET /api/Deceased (trae la lista completa)
    const response = await apiClient.get<Deceased[]>('/Deceased')
    this.deceasedList = response.data
  } catch (error) {
    console.error("Error al traer el listado", error)
  } finally {
    this.loading = false
  }
}



  }
})