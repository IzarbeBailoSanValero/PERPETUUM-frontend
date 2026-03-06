// i18n/index.ts
// Configuración central de Vue I18n.
// Lee el idioma guardado en localStorage (puesto por LangToggle).
// Al cambiar idioma con setLocale(), el cambio es reactivo e instantáneo,
// sin necesidad de window.location.reload().

import { createI18n } from 'vue-i18n'
import es from './es.json'
import en from './en.json'

const savedLang = localStorage.getItem('lang') || 'es'

const i18n = createI18n({
  legacy: false,          // Composition API mode (useI18n en lugar de this.$t)
  locale: savedLang,
  fallbackLocale: 'es',   // Si falta una clave en 'en', usa la española
  messages: { es, en }
})

export default i18n

/** Cambia el idioma en runtime y lo persiste en localStorage */
export function setLocale(lang: 'es' | 'en') {
  i18n.global.locale.value = lang
  localStorage.setItem('lang', lang)
}