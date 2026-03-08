<template>
  <v-footer class="bg-primary py-6 py-sm-10">
    <v-container>
      <v-row justify="space-between">
        
        <v-col cols="12" md="4" class="mb-6 mb-md-0">
          <h3 class="text-h5 font-weight-bold text-on-primary mb-2">PERPETUUM</h3>
          <p class="text-body-2 mb-4 footer-body-text">
            Dedicados a preservar la memoria de quienes amamos, creando espacios digitales de respeto y recuerdo eterno.
          </p>
          <div class="d-flex ga-3">
            <v-btn icon="mdi-facebook" variant="text" size="small" color="on-primary"></v-btn>
            <v-btn icon="mdi-twitter" variant="text" size="small" color="on-primary"></v-btn>
            <v-btn icon="mdi-instagram" variant="text" size="small" color="on-primary"></v-btn>
          </div>
        </v-col>

        <v-col cols="12" sm="6" md="2">
          <h4 class="text-subtitle-1 font-weight-bold text-on-primary mb-4">Empresa</h4>
          <nav class="d-flex flex-column ga-2">
            <router-link to="/about" class="footer-link">Acerca de</router-link>
            <router-link to="/contact" class="footer-link">Contacto</router-link>
            <router-link to="/privacy" class="footer-link">Privacidad</router-link>
          </nav>
        </v-col>

        <v-col cols="12" sm="6" md="3">
          <h4 class="text-subtitle-1 font-weight-bold text-on-primary mb-4">Asistencia</h4>
          <p class="text-caption footer-body-text d-flex align-center mb-2">
            <v-icon icon="mdi-email-outline" start size="small"></v-icon>
            soporte@perpetuum.com
          </p>
          <p class="text-caption footer-body-text d-flex align-center">
            <v-icon icon="mdi-help-circle-outline" start size="small"></v-icon>
            Preguntas frecuentes
          </p>
        </v-col>
      </v-row>

      <v-divider class="my-8 border-opacity-25"></v-divider>

      <v-row align="center">
        <v-col cols="12" class="text-center text-caption footer-body-text">
          <span>&copy; {{ new Date().getFullYear() }} <strong>PERPETUUM</strong>. Todos los derechos reservados.</span>
        </v-col>
      </v-row>
    </v-container>
  </v-footer>
</template>

<style scoped>

/* Texto secundario sobre fondo primary: on-primary con algo de transparencia */
.footer-body-text {
  color: rgba(var(--v-theme-on-primary), 0.75);
}

.footer-link {
  text-decoration: none;
  color: rgba(var(--v-theme-on-primary), 0.75);
  font-size: 0.875rem;
  transition: color 0.25s ease;
}

.footer-link:hover {
  color: rgb(var(--v-theme-on-primary));
}
</style>