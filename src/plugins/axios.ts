/*
- Apuntes sobre tuberías: conexiónc on el back:
      - Axios: El cartero que lleva y trae mensajes entre Vue y .NET.
      - Pinia Store: El almacén donde guardamos lo que el cartero nos trae.
      - Componente Vue: El encargado de pintar esos datos usando Vuetify.

Pasos: 
1º centralizamos la conexión. Si mañana cambias el puerto de tu Backend, solo lo tocas aquí.Lo configuro aquí para no tener que escribir la URL completa en cada archivo.
 */


import axios from 'axios'
import { useAuthStore } from '@/stores/authStore'
import router from '@/router'

const apiClient = axios.create({
  // Ojo: revisar que el puerto coincida con el de la API (launchSettings.json)
  baseURL: 'http://localhost:8080/api', 
  headers: {
    'Content-Type': 'application/json'
  }
})

//INTERCEPTOR DE SALIDA: Antes de que salga cualquier mensaje al servidor, miramos si tenemos el token. --> Si lo tenemos en el Store, se lo pegamos en la cabecera (Header) automáticamente.
apiClient.interceptors.request.use((config) => {
  const authStore = useAuthStore()
  
  if (authStore.token) {
    config.headers.Authorization = `Bearer ${authStore.token}`
  }
  return config
}, (error) => {
  return Promise.reject(error)
})

//INTERCEPTOR DE ENTRADA: Si el servidor nos devuelve un error 401 (token caducado o falso), cerramos sesión y mandamos al usuario al Login para que no se quede colgado.
apiClient.interceptors.response.use(
  (response) => response, 
  (error) => {
    // Si la respuesta es 401, el token ya no vale
    if (error.response?.status === 401) {
      const authStore = useAuthStore()
      authStore.logout() // Borro todo
      router.push({ name: 'Login' }) 
    }
    return Promise.reject(error)
  }
)

export default apiClient