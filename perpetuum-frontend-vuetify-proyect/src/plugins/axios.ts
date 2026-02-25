/*
- Apuntes sobre tuberías: conexiónc on el back:
      - Axios: El cartero que lleva y trae mensajes entre Vue y .NET.
      - Pinia Store: El almacén donde guardamos lo que el cartero nos trae.
      - Componente Vue: El encargado de pintar esos datos usando Vuetify.

Pasos: 
1º centralizamos la conexión. Si mañana cambias el puerto de tu Backend, solo lo tocas aquí.
 */

import axios from 'axios'

const apiClient = axios.create({
  // URL base API en .NET (hay que ajustar el puerto según  launchSettings.json)
  baseURL: 'http://localhost:5023/api', 
  headers: {
    'Content-Type': 'application/json'
  }
})

// Interceptor: Antes de cada petición, "inyectamos" el token si existe
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default apiClient