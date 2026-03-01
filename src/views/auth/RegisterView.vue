<template>
  <v-container class="fill-height justify-center">
    <v-card width="450" class="pa-6 rounded-lg" elevation="3">
      <v-card-title class="text-center text-h5 mb-4">Crear Cuenta</v-card-title>

      <VForm @submit="handleRegister" :validation-schema="schema" v-slot="{ errors }"> 
        <v-card-text>
          
          <Field name="name" v-model="form.name" v-slot="{ field }">
            <v-text-field
              v-bind="field"
              label="Nombre Completo"
              variant="outlined"
              prepend-inner-icon="mdi-account"
              :error-messages="errors.name"
              class="mb-2"
            ></v-text-field>
          </Field>

          <Field name="email" v-model="form.email" v-slot="{ field }">
            <v-text-field
              v-bind="field"
              label="Correo Electrónico"
              variant="outlined"
              prepend-inner-icon="mdi-email"
              :error-messages="errors.email"
              class="mb-2"
            ></v-text-field>
          </Field>

          <Field name="password" v-model="form.password" v-slot="{ field }">
            <v-text-field
              v-bind="field"
              label="Contraseña"
              type="password"
              variant="outlined"
              prepend-inner-icon="mdi-lock"
              :error-messages="errors.password"
            ></v-text-field>
          </Field>

        </v-card-text>

        <v-card-actions class="flex-column">
          <v-btn 
            block 
            color="primary" 
            size="large" 
            variant="elevated"
            :loading="loading" 
            type="submit"
          >
            Registrarse
          </v-btn>
          
          <v-btn 
            block 
            variant="text" 
            class="mt-2 text-none" 
            to="/login"
          >
            ¿Ya tienes cuenta? Inicia sesión
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

import { Form as VForm, Field } from 'vee-validate'
import * as yup from 'yup'

const auth = useAuthStore()
const router = useRouter()
const loading = ref(false)
const errorMessage = ref('')

// coincide con UserDtoIn 
const form = reactive({ 
  name: '', 
  email: '', 
  password: '' 
})

// validación 
const schema = yup.object({
  name: yup.string().required('El nombre es obligatorio').min(3, 'Mínimo 3 caracteres'),
  email: yup.string().required('El email es obligatorio').email('Formato de email inválido'),
  password: yup.string().required('La contraseña es obligatoria').min(6, 'Mínimo 6 caracteres')
})

async function handleRegister() {
  loading.value = true
  errorMessage.value = ''
  
  try {
    const response = await apiClient.post('/Auth/Register', form)
    
    auth.setToken(response.data.token)

    // Redirigir según el rol del usuario
    if (auth.userRole === 'Admin' || auth.userRole === 'Staff') {
      router.push('/admin/dashboard')
    } else {
      router.push('/')
    }

  } catch (error: any) {
    if (error.response?.status === 400 && error.response?.data?.message) {
      errorMessage.value = error.response.data.message;
    } else {
      errorMessage.value = "Ocurrió un error al intentar registrar la cuenta.";
    }
  } finally {
    loading.value = false
  }
}
</script>