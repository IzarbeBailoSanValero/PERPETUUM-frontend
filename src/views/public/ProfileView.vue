<template>
  <v-container class="py-12">

    <!-- Cabecera -->
    <v-row justify="center" class="mb-10">
      <v-col cols="12" md="7">
        <div class="d-flex align-center ga-4">
          <v-icon size="34" color="indigo">mdi-account-circle</v-icon>

          <div>
            <h2 class="text-h5 font-weight-bold mb-1">Mi Perfil</h2>
            <p class="text-body-2 text-grey">
              Gestiona tu cuenta de Perpetuum
            </p>
          </div>
        </div>
      </v-col>
    </v-row>

    <!-- Cargando -->
    <v-row justify="center" v-if="loading">
      <v-col cols="12" md="7">
        <v-progress-linear indeterminate color="indigo" class="rounded" />
      </v-col>
    </v-row>

    <!-- Error de carga -->
    <v-row justify="center" v-else-if="loadError">
      <v-col cols="12" md="7">
        <v-alert type="error" variant="tonal">
          No se pudo cargar el perfil. Inténtalo de nuevo.
          <template v-slot:append>
            <v-btn variant="text" @click="loadProfile">Reintentar</v-btn>
          </template>
        </v-alert>
      </v-col>
    </v-row>

    <v-row justify="center" v-else>
      <v-col cols="12" md="7">

        <!-- Avatar + info -->
        <v-card
          border
          flat
          class="rounded-xl pa-7 mb-6 d-flex align-center ga-5"
        >
          <v-avatar size="72" color="indigo-lighten-4">
            <span class="text-h5 font-weight-bold text-indigo">
              {{ initials }}
            </span>
          </v-avatar>

          <div>
            <p class="text-h6 font-weight-bold mb-1">{{ profile?.name }}</p>
            <p class="text-body-2 text-grey mb-3">{{ profile?.email }}</p>

            <v-chip size="small" color="indigo" variant="tonal">
              <v-icon start size="14">mdi-shield-account</v-icon>
              {{ roleLabel }}
            </v-chip>
          </div>
        </v-card>

        <!-- Formulario -->
        <v-card border flat class="rounded-xl pa-7 mb-6">

          <p class="text-subtitle-1 font-weight-bold text-grey-darken-2 mb-6">
            <v-icon size="18" class="mr-2">mdi-pencil-outline</v-icon>
            Editar datos personales
          </p>

          <VForm
            @submit="saveProfile"
            :validation-schema="schema"
            :initial-values="initialValues"
            v-slot="{ errors }"
          >

            <Field name="name" v-slot="{ field }">
              <v-text-field
                v-bind="field"
                v-model="form.name"
                label="Nombre completo"
                variant="outlined"
                prepend-inner-icon="mdi-account"
                :error-messages="errors.name"
                class="mb-4"
              />
            </Field>

            <Field name="email" v-slot="{ field }">
              <v-text-field
                v-bind="field"
                v-model="form.email"
                label="Correo electrónico"
                variant="outlined"
                prepend-inner-icon="mdi-email"
                :error-messages="errors.email"
                class="mb-4"
              />
            </Field>

            <Field name="phoneNumber" v-slot="{ field }">
              <v-text-field
                v-bind="field"
                v-model="form.phoneNumber"
                label="Teléfono (opcional)"
                variant="outlined"
                prepend-inner-icon="mdi-phone"
                :error-messages="errors.phoneNumber"
                class="mb-4"
              />
            </Field>

            <Field name="birthDate" v-slot="{ field }">
              <v-text-field
                v-bind="field"
                v-model="form.birthDate"
                label="Fecha de nacimiento (opcional)"
                variant="outlined"
                prepend-inner-icon="mdi-calendar"
                type="date"
                :error-messages="errors.birthDate"
                :max="today"
                class="mb-4"
              />
            </Field>

            <div class="d-flex justify-end mt-2">
              <v-btn
                color="indigo"
                type="submit"
                :loading="saving"
                prepend-icon="mdi-content-save"
              >
                Guardar cambios
              </v-btn>
            </div>

          </VForm>
        </v-card>

        <!-- Zona de peligro -->
        <v-card
          border
          flat
          class="rounded-xl pa-7"
          color="error-lighten-5"
        >

          <p class="text-subtitle-1 font-weight-bold text-error mb-3">
            <v-icon size="18" class="mr-2" color="error">
              mdi-alert-circle-outline
            </v-icon>
            Zona de peligro
          </p>

          <p class="text-body-2 text-grey-darken-1 mb-5">
            Eliminar tu cuenta es una acción permanente. Se borrarán todos tus datos y no podrás recuperarlos.
          </p>

          <v-btn
            color="error"
            variant="tonal"
            prepend-icon="mdi-delete-forever"
            @click="confirmDelete = true"
          >
            Eliminar mi cuenta
          </v-btn>

        </v-card>

      </v-col>
    </v-row>

    <!-- Dialog eliminar -->
    <v-dialog v-model="confirmDelete" max-width="420">
      <v-card class="pa-6 rounded-xl">

        <v-card-title class="d-flex align-center ga-2 text-error">
          <v-icon color="error">mdi-alert</v-icon>
          ¿Eliminar cuenta?
        </v-card-title>

        <v-card-text class="mt-2 mb-2">
          Esta acción es <strong>irreversible</strong>.  
          Se eliminarán todos tus datos de la plataforma.

          <br /><br />

          ¿Estás seguro de que quieres continuar?
        </v-card-text>

        <v-card-actions class="justify-end ga-2">
          <v-btn
            variant="text"
            @click="confirmDelete = false"
            :disabled="deleting"
          >
            Cancelar
          </v-btn>

          <v-btn
            color="error"
            variant="flat"
            :loading="deleting"
            @click="deleteAccount"
          >
            Sí, eliminar
          </v-btn>
        </v-card-actions>

      </v-card>
    </v-dialog>

  </v-container>
</template>

<script setup lang="ts">
import { reactive, ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Form as VForm, Field } from 'vee-validate'
import * as yup from 'yup'
import apiClient from '@/plugins/axios'
import { useAuthStore } from '@/stores/authStore'
import { useUiStore } from '@/stores/uiStore'
import type { UserProfile } from '@/models/User'

const auth   = useAuthStore()
const ui     = useUiStore()
const router = useRouter()

const profile       = ref<UserProfile | null>(null)
const loading       = ref(true)
const loadError     = ref(false)
const saving        = ref(false)
const deleting      = ref(false)
const confirmDelete = ref(false)

const today = new Date().toISOString().split('T')[0]

const form = reactive({
  name: '',
  email: '',
  phoneNumber: null as string | null,
  birthDate: null as string | null
})

const initialValues = computed(() => ({
  name: form.name,
  email: form.email,
  phoneNumber: form.phoneNumber,
  birthDate: form.birthDate
}))

const initials = computed(() => {
  const name = profile.value?.name ?? ''
  return name
    .split(' ')
    .slice(0, 2)
    .map((w: string) => w[0]?.toUpperCase() ?? '')
    .join('')
})

const roleLabel = computed(() => {
  const map: Record<string, string> = {
    StandardUser: 'Usuario',
    Guardian: 'Familiar',
    Staff: 'Empleado',
    Admin: 'Administrador'
  }
  const role = profile.value?.role ?? ''
  return map[role] ?? role ?? '—'
})

const schema = yup.object({
  name: yup.string().required().min(3),
  email: yup.string().required().email(),
  phoneNumber: yup.string().nullable(),
  birthDate: yup.string().nullable()
})

function toDateInputValue(raw: string | null | undefined): string | null {
  if (!raw) return null
  return raw.split('T')[0] ?? null
}

async function loadProfile() {
  const userId = auth.user?.id
  if (!userId) {
    router.push('/login')
    return
  }

  loading.value = true
  loadError.value = false

  try {
    const { data } = await apiClient.get(`/User/${userId}`)

    profile.value = data

    form.name = data.name
    form.email = data.email
    form.phoneNumber = data.phoneNumber
    form.birthDate = toDateInputValue(data.birthDate)
  } catch (err) {
    loadError.value = true
  } finally {
    loading.value = false
  }
}

async function saveProfile() {
  const userId = auth.user?.id
  if (!userId) return

  saving.value = true

  try {
    await apiClient.put(`/User/${userId}`, form)

    ui.notify('Perfil actualizado correctamente.', 'success')
  } catch (err) {
    ui.notify('Error al guardar.', 'error')
  } finally {
    saving.value = false
  }
}

async function deleteAccount() {
  const userId = auth.user?.id
  if (!userId) return

  deleting.value = true

  try {
    await apiClient.delete(`/User/${userId}`)

    auth.logout()
    router.push('/')
  } catch (err) {
    ui.notify('Error eliminando la cuenta.', 'error')
  } finally {
    deleting.value = false
    confirmDelete.value = false
  }
}

onMounted(loadProfile)
</script>