<template>
  <v-footer class="bg-grey-darken-4 text-grey-lighten-1 py-10">
    <v-container>
      <v-row justify="space-between">
        
        <v-col cols="12" md="4" class="mb-6 mb-md-0">
          <h3 class="text-h5 font-weight-bold text-white mb-2">PERPETUUM</h3>
          <p class="text-body-2 mb-4">
            Dedicados a preservar la memoria de quienes amamos, creando espacios digitales de respeto y recuerdo eterno.
          </p>
          <div class="d-flex ga-3">
            <v-btn icon="mdi-facebook" variant="text" size="small" color="white"></v-btn>
            <v-btn icon="mdi-twitter" variant="text" size="small" color="white"></v-btn>
            <v-btn icon="mdi-instagram" variant="text" size="small" color="white"></v-btn>
          </div>
        </v-col>

        <v-col cols="6" md="2">
          <h4 class="text-subtitle-1 font-weight-bold text-white mb-4">Empresa</h4>
          <nav class="d-flex flex-column ga-2">
            <router-link to="/about" class="footer-link">Acerca de</router-link>
            <router-link to="/contact" class="footer-link">Contacto</router-link>
            <router-link to="/privacy" class="footer-link">Privacidad</router-link>
          </nav>
        </v-col>

        <v-col cols="6" md="3">
          <h4 class="text-subtitle-1 font-weight-bold text-white mb-4">Asistencia</h4>
          <p class="text-caption d-flex align-center mb-2">
            <v-icon icon="mdi-email-outline" start size="small"></v-icon>
            soporte@perpetuum.com
          </p>
          <p class="text-caption d-flex align-center">
            <v-icon icon="mdi-help-circle-outline" start size="small"></v-icon>
            Preguntas frecuentes
          </p>
        </v-col>
      </v-row>

      <v-divider class="my-8 border-opacity-25"></v-divider>

      <v-row align="center">
        <v-col cols="12" class="text-center text-caption">
          <span>&copy; {{ new Date().getFullYear() }} <strong>PERPETUUM</strong>. Todos los derechos reservados.</span>
        </v-col>
      </v-row>
    </v-container>
  </v-footer>
</template>

<style scoped>

.footer-link {
  text-decoration: none;
  color: inherit;
  font-size: 0.875rem;
  transition: color 0.3s ease;
}

.footer-link:hover {
  color: #6200EE; 
}
</style>