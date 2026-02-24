
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
      this.loading = true //antes de llamar a axios, lo pongo a true, cuando termina, lo pongo a false. A la hora d epintar, sin ponemos un atributo loading en vuetify, Vuetify mostrará una barrita de carga mientras los datos viajan
      try {
        // Llamo a  endpoint: GET /api/Deceased/{id}
        const response = await apiClient.get<Deceased>(`/Deceased/${id}`)
        this.currentDeceased = response.data
      } catch (error) {
        console.error("Error al obtener el difunto:", error)
      } finally {
        this.loading = false
      }
    }
  }
})