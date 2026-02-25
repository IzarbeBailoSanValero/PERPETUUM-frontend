// Gestiona el token JWT, login, logout y roles. Guarda el token cunado hacemos login

/*Apuntes sobre login 
1. creat auth.store para guardar token
2. Configurar el Interceptor de Axios: Para que Axios pegue automáticamente el token en cada petición
3. Crear la Vista de Login
*/

import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    // Intentamos recuperar el token si ya estaba guardado en el navegador
    token: localStorage.getItem('token') || null,
  }),
  getters: {                                //Un getter es como una propiedad calculada del store.
    isLoggedIn: (state) => !!state.token,   //isLoggedIn -->Se recalcula automáticamente cuando cambia state.token.Se usa para saber si el usuario está autenticado.            -->!! Convierte cualquier valor en un booleano: si hay ocntenido (token) ex true, si es null es false
  },
  actions: {        //lógica para cambiar el estado.
    setToken(newToken: string) {
      this.token = newToken
      localStorage.setItem('token', newToken)
    },
    logout() {
      this.token = null
      localStorage.removeItem('token')
    }
  }
})