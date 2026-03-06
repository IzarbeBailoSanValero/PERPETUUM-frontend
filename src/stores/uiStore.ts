// (Store de IU) Gestiona los Toasts (sweetalerts), el Tema y el idioma.
// Las traducciones de texto se gestionan con Vue I18n (src/i18n/).
// Este store solo mantiene: tema oscuro/claro y función notify centralizada.

import { defineStore } from 'pinia'
import Swal from 'sweetalert2'

export const useUiStore = defineStore('ui', {
  state: () => ({
    isDark: localStorage.getItem('theme') === 'dark',
    // 'language' se mantiene para que LangToggle pueda leerlo sin importar i18n
    language: localStorage.getItem('lang') || 'es'
  }),
  actions: {
    toggleTheme() {
      this.isDark = !this.isDark
      localStorage.setItem('theme', this.isDark ? 'dark' : 'light')
    },

    // Método centralizado para usar SweetAlert2 en todo el proyecto.
    // Los textos que se pasan aquí deben venir ya traducidos desde el componente:
    //   const { t } = useI18n()
    //   ui.notify(t('admin.memories.approvedOk'), 'success')
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