// (Store de IU) Gestiona los Toasts (sweetalerts), el Tema ,idioma, etc.

import { defineStore } from 'pinia'
import Swal from 'sweetalert2'

export const useUiStore = defineStore('ui', { //El store se llama ui.Se podrá usar en componentes con: const ui = useUiStore()
  state: () => ({ //Aquí se definen las variables reactivas
    isDark: localStorage.getItem('theme') === 'dark',
    language: localStorage.getItem('lang') || 'es'
  }),
  actions: {
    toggleTheme() {
      this.isDark = !this.isDark
      localStorage.setItem('theme', this.isDark ? 'dark' : 'light') //Se inicializa leyendo localStorage. Si el valor guardado es "dark", activa el modo oscuro. Si no existe, se asume que está en modo claro.
    },
    // Método centralizado para usar SweetAlert2 en todo el proyecto --> Este método es un wrapper para usar SweetAlert2 de forma uniforme en toda la app.Muestra un toast en la esquina superior derecha. Dura 3 segundos. No tiene botón de confirmación...
    notify(title: string, icon: 'success' | 'error' | 'warning' = 'success') {
      Swal.fire({
        title,
        icon,
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true
      })
    }
  }
})