// Gestiona el token JWT, login, logout y roles. Guarda el token cunado hacemos login. He instalado un decoder de jwt para sacar la info oculta de los claims

/*Apuntes sobre login 
1. creat auth.store para guardar token
2. Configurar el Interceptor de Axios: Para que Axios pegue automáticamente el token en cada petición
3. Crear la Vista de Login
*/

import { defineStore } from 'pinia'
import { jwtDecode } from 'jwt-decode'
import type { User } from '@/models/User'





export const useAuthStore = defineStore('auth', {
  state: () => {
    // Al arrancar la app intento recuperar el token del  local storage
    const savedToken = localStorage.getItem('token');
    
    return {
      token: savedToken || null,
      //persistencia: si hay, me lo quedo
      user: savedToken ? decodeUserData(savedToken) : null as User | null,
    }
  },

  getters: {
    //  comprobar si hay una sesión activa o rol           !! es una forma rápida de convertir cualquier valor a un booleano:Si state.token tiene un valor “verdadero” (string no vacío, número distinto de 0, etc.),true.
    isLoggedIn: (state) => !!state.token, 
    userRole: (state) => state.user?.role || null,
  },

  actions: {
    //setToken: es llamado desde la vista de Login tras  respuesta del servidor. --> Guarda el token y extrae la información del usuario de los Claims.
    
    setToken(newToken: string) {
      this.token = newToken;
      localStorage.setItem('token', newToken);
      this.user = decodeUserData(newToken);
    },

    // logout: Borra  token y el usuario en el estado y  navegador.
     
    logout() {
      this.token = null;
      this.user = null;
      localStorage.removeItem('token');
    }
  }
})

// Toma el token cifrado y busca las etiquetas que backend inyecta.
function decodeUserData(token: string): User | null {
  try {
    const decoded: any = jwtDecode(token);

    // IMPORTANTE: mapeo los claims del token JWT
    return {
      id: parseInt(decoded.nameid || decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier']),
      name: decoded.unique_name || decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'],
      email: decoded.email || decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'],
      role: decoded.role || decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'],
      funeralHomeId: decoded.FuneralHomeId ? parseInt(decoded.FuneralHomeId) : null
    };
  } catch (error) {
    console.error("Error crítico decodificando el token JWT:", error);
    return null;
  }
}
