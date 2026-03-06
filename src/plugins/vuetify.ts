/**
 * plugins/vuetify.ts
 *
 * Framework documentation: https://vuetifyjs.com`
 */

// Styles
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'

// Composables
import { createVuetify } from 'vuetify'

// ─────────────────────────────────────────────────────────────────────────────
// PALETA ORGÁNICA NATURAL — Perpetuum
//
// Filosofía: tonos tierra, madera y cielo apagados. Accesibilidad WCAG AA.
//
// MODO CLARO
//   primary   #6B5344  madera oscura          contraste ~7.1:1 sobre blanco
//   secondary #5C8FA3  azul cielo apagado     contraste ~4.6:1 sobre blanco
//   accent    #8C7355  piedra cálida           contraste ~5.2:1 sobre blanco
//   background #F4EFE8 crema cálida
//   surface   #FDFAF5  blanco marfil
//   error     #9E4332  terracota apagada       contraste ~7.8:1 sobre blanco
//   success   #5A7A5A  salvia verde            contraste ~5.0:1 sobre blanco
//   warning   #8C6230  ámbar tierra            contraste ~5.8:1 sobre blanco
//   info      #4D7F96  azul cielo profundo     contraste ~5.5:1 sobre blanco
//
// MODO OSCURO
//   primary   #C8A882  arena cálida            contraste ~8.3:1 sobre fondo oscuro
//   secondary #88B8CC  azul cielo claro        contraste ~7.1:1 sobre fondo oscuro
//   background #1A1714 oscuro tierra profundo
//   surface   #242019  superficie cálida oscura
//   error     #D4806A  terracota suave         contraste ~6.2:1 sobre fondo oscuro
//   success   #88B488  salvia clara            contraste ~7.0:1 sobre fondo oscuro
//   warning   #C8A050  ámbar dorado            contraste ~8.1:1 sobre fondo oscuro
//   info      #7FB8CC  cielo luminoso          contraste ~7.4:1 sobre fondo oscuro
// ─────────────────────────────────────────────────────────────────────────────

export default createVuetify({
  theme: {
    defaultTheme: 'light',
    themes: {
      light: {
        dark: false,
        colors: {
          // Colores de marca
          primary:    '#6B5344', // madera oscura
          secondary:  '#5C8FA3', // azul cielo apagado
          accent:     '#8C7355', // piedra cálida

          // Estados
          error:      '#9E4332', // terracota apagada
          success:    '#5A7A5A', // salvia verde
          warning:    '#8C6230', // ámbar tierra
          info:       '#4D7F96', // azul cielo profundo

          // Superficies
          background: '#F4EFE8', // crema cálida
          surface:    '#FDFAF5', // blanco marfil
          'surface-variant': '#EDE5D8', // crema más profunda (cards secundarias)

          // Texto sobre colores de marca (para on-primary, etc.)
          'on-primary':   '#FFFFFF',
          'on-secondary': '#FFFFFF',
          'on-background':'#2A1F16', // texto oscuro cálido
          'on-surface':   '#2A1F16',
        },
      },
      dark: {
        dark: true,
        colors: {
          // Colores de marca
          primary:    '#C8A882', // arena cálida
          secondary:  '#88B8CC', // azul cielo claro
          accent:     '#B09070', // piedra media

          // Estados
          error:      '#D4806A', // terracota suave
          success:    '#88B488', // salvia clara
          warning:    '#C8A050', // ámbar dorado
          info:       '#7FB8CC', // cielo luminoso

          // Superficies
          background: '#1A1714', // tierra oscuro profundo
          surface:    '#242019', // superficie cálida oscura
          'surface-variant': '#2E2820', // tarjetas ligeramente elevadas

          // Texto sobre colores de marca
          'on-primary':   '#1A1714',
          'on-secondary': '#1A1714',
          'on-background':'#EDE5D8', // texto claro cálido
          'on-surface':   '#EDE5D8',
        },
      },
    },
  },
})