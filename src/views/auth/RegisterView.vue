<template>
  <v-container class="fill-height justify-center">
    <v-card width="450" class="pa-6 rounded-lg" elevation="3">
      <v-card-title class="text-center text-h5 mb-4">{{ t('auth.registerTitle') }}</v-card-title>

      <VForm @submit="handleRegister" :validation-schema="schema" v-slot="{ errors }">
        <v-card-text>
          <Field name="name" v-model="form.name" v-slot="{ field }">
            <v-text-field v-bind="field" :label="t('auth.name')" variant="outlined"
              prepend-inner-icon="mdi-account" :error-messages="errors.name" class="mb-2" />
          </Field>

          <Field name="email" v-model="form.email" v-slot="{ field }">
            <v-text-field v-bind="field" :label="t('auth.email')" variant="outlined"
              prepend-inner-icon="mdi-email" :error-messages="errors.email" class="mb-2" />
          </Field>

          <Field name="password" v-model="form.password" v-slot="{ field }">
            <v-text-field v-bind="field" :label="t('auth.password')" type="password" variant="outlined"
              prepend-inner-icon="mdi-lock" :error-messages="errors.password" />
          </Field>
        </v-card-text>

        <v-card-actions class="flex-column">
          <v-btn block color="primary" size="large" variant="elevated" :loading="loading" type="submit">
            {{ t('auth.registerBtn') }}
          </v-btn>
          <v-btn block variant="text" class="mt-2 text-none" to="/login">
            {{ t('auth.goToLogin') }}
          </v-btn>
          <v-btn block variant="text" class="mt-1 text-none text-medium-emphasis" to="/" prepend-icon="mdi-home-outline">
            {{ t('auth.backHome') }}
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
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '@/stores/authStore'
import { useRouter } from 'vue-router'
import apiClient from '@/plugins/axios'
import { Form as VForm, Field } from 'vee-validate'
import * as yup from 'yup'

const { t } = useI18n()
const auth = useAuthStore()
const router = useRouter()
const loading = ref(false)
const errorMessage = ref('')

const form = reactive({ name: '', email: '', password: '' })

const schema = yup.object({
  name:     yup.string().required(() => t('validation.nameRequired')).min(3, () => t('validation.nameMin', { min: 3 })),
  email:    yup.string().required(() => t('validation.emailRequired')).email(() => t('validation.emailInvalid')),
  password: yup.string().required(() => t('validation.passwordRequired')).min(6, () => t('validation.passwordMin', { min: 6 }))
})

async function handleRegister() {
  loading.value = true
  errorMessage.value = ''
  try {
    const response = await apiClient.post('/Auth/Register', form)
    auth.setToken(response.data.token)
    const role = auth.userRole
    if (role === 'Admin' || role === 'Staff') {
      await router.push('/admin/dashboard')
    } else if (role === 'Guardian') {
      await router.push('/guardian/my-memorials')
    } else {
      await router.push('/')
    }
  } catch (error: any) {
    errorMessage.value = error.response?.status === 400 && error.response?.data?.message
      ? error.response.data.message
      : t('auth.errorRegister')
  } finally {
    loading.value = false
  }
}
</script>