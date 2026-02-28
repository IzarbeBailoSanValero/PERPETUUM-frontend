<template>
  <v-container class="fill-height justify-center">
    <v-card width="400" class="pa-6 rounded-lg" elevation="3">
      <v-card-title class="text-center text-h5 mb-4">Acceso a Perpetuum</v-card-title>


      <!--apuntes de vee-validate:
        Vuetify NO sabe validar por sí mismo. Entonces Vee‑Validate te da un objeto field que contiene porpiedades y se lo pasamos a v-text-field>


      piezas: 
      - Form:El contenedor del formulario. Controla el estado general (si es válido, si se envió, etc.).
      - Representa un campo individual. Se conecta a la validación y te da: value, errors...
      -  v-slot="{ field, errors }" -_> aqui se reciben herramientas par aconectar input

      flujo: 
      <Form> controla el envío. -> <Field> controla la validación del campo. -> -slot="{ field, errors }" te da: (field → eventos + valor   Y.  errors → lista de errores). -> v-bind="field" conecta el input con Vee‑Validate.
      -->

      <VForm @submit="handleLogin" :validation-schema="schema" v-slot="{ errors }">
        <v-card-text>
          <Field name="email" v-model="form.email" v-slot="{ field }">
            <v-text-field v-bind="field" label="Correo Electrónico" variant="outlined" prepend-inner-icon="mdi-email"
              :error-messages="errors.email" class="mb-2"></v-text-field>
          </Field>

          <Field name="password" v-model="form.password" v-slot="{ field }">
            <v-text-field v-bind="field" label="Contraseña" type="password" variant="outlined"
              prepend-inner-icon="mdi-lock" :error-messages="errors.password"></v-text-field>
          </Field>
        </v-card-text>

        <v-card-actions class="flex-column">
          <v-btn block color="primary" size="large" variant="elevated" :loading="loading" type="submit">
            Entrar
          </v-btn>

          <v-btn block variant="text" class="mt-2 text-none" to="/register">
            ¿No tienes cuenta? Regístrate
          </v-btn>
        </v-card-actions>
      </VForm>

      <v-alert v-if="errorMessage" type="error" variant="tonal" class="mt-4">
        {{ errorMessage }}
      </v-alert>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useAuthStore } from '@/stores/authStore'
import { useRouter } from 'vue-router'
import apiClient from '@/plugins/axios'

// componentes de validación
import { Form as VForm, Field } from 'vee-validate'
import * as yup from 'yup'

const auth = useAuthStore()
const router = useRouter()
const loading = ref(false)
const errorMessage = ref('')

const form = reactive({ email: '', password: '' })

// teoria: Esquema de Validación yup
// Aquí definimos las reglas de negocio.
const schema = yup.object({
  email: yup.string().required('El email es obligatorio').email('Formato de email inválido'), //Yup se encarga de verificar que los datos cumplen con tus requisitos antes de que el formulario se envíe.
  password: yup.string().required('La contraseña es obligatoria').min(6, 'Mínimo 6 caracteres')
})

async function handleLogin() {
  loading.value = true
  errorMessage.value = ''

  try {
    // 1. credenciales al backend
    const response = await apiClient.post('/Auth/login', form)

    // 2. guardar el token y decodificar automáticamente 
    auth.setToken(response.data.token)

    // 3. redirijo según rol decodificado -->  Si es Admin o Staff, al panel de administración. si no parte publica
    if (auth.userRole === 'Admin' || auth.userRole === 'Staff') {
      router.push('/admin/dashboard')
    } else {
      router.push('/')
    }

  } catch (error: any) {
    if (error.response?.status === 401) {
      errorMessage.value = "Correo o contraseña incorrectos."
    } else {
      errorMessage.value = "Error de conexión con el servidor."
    }
  } finally {
    loading.value = false
  }
}
</script>