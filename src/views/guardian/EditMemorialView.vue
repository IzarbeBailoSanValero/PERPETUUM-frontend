<template>
  <v-container fluid>

    <!-- Cabecera con botón volver -->
    <div class="d-flex align-center mb-6 gap-3">
      <v-btn
        icon="mdi-arrow-left"
        variant="text"
        @click="$router.push('/guardian/my-memorials')"
      />
      <div>
        <h2 class="text-h5 font-weight-bold">Editar Memorial</h2>
        <p class="text-caption text-grey">
          {{ deceased?.name || '...' }} · Solo puedes editar la información personal del memorial
        </p>
      </div>
    </div>

    <!-- Cargando -->
    <v-progress-linear v-if="loading" indeterminate color="primary" class="mb-6 rounded" />

    <!-- Error al cargar -->
    <v-alert v-else-if="loadError" type="error" variant="tonal" class="mb-6">
      No se pudo cargar el memorial. Comprueba tu conexión o vuelve a intentarlo.
      <template v-slot:append>
        <v-btn variant="text" @click="loadDeceased">Reintentar</v-btn>
      </template>
    </v-alert>

    <!-- Formulario principal -->
    <v-row v-else-if="deceased">

      <!-- Columna izquierda: previsualización en tiempo real -->
      <v-col cols="12" md="4">
        <v-card border flat class="rounded-xl pa-4 text-center">
          <v-avatar size="160" class="mb-4" color="grey-lighten-3">
            <v-img
              :src="form.photoURL || 'https://via.placeholder.com/400x400?text=Sin+imagen'"
              cover
              referrerpolicy="no-referrer"
            >
              <template v-slot:error>
                <v-icon size="60" color="grey-lighten-1">mdi-image-off</v-icon>
              </template>
            </v-img>
          </v-avatar>

          <h3 class="text-h6 font-weight-bold mb-1">{{ deceased.name }}</h3>
          <p class="text-caption text-grey mb-3">
            {{ formatDate(deceased.birthDate) }} — {{ formatDate(deceased.deathDate) }}
          </p>

          <v-divider class="mb-3" />

          <p class="text-body-2 font-italic text-grey-darken-1 mb-2" v-if="form.epitaph">
            "{{ form.epitaph }}"
          </p>
          <p class="text-caption text-grey" v-else>Sin epitafio todavía</p>

          <v-divider class="my-3" />

          <!-- Datos de solo lectura -->
          <div class="text-left">
            <p class="text-caption text-grey mb-1">
              <v-icon size="14" class="mr-1">mdi-office-building</v-icon>
              Funeraria ID: {{ deceased.funeralHomeId }}
            </p>
            <p class="text-caption text-grey">
              <v-icon size="14" class="mr-1">mdi-card-account-details</v-icon>
              DNI: {{ deceased.dni }}
            </p>
          </div>
        </v-card>
      </v-col>

      <!-- Columna derecha: formulario -->
      <v-col cols="12" md="8">
        <v-card border flat class="rounded-xl pa-6">

          <VForm @submit="save" :validation-schema="schema" :initial-values="initialValues" v-slot="{ errors }">

            <!-- Foto -->
            <p class="text-subtitle-2 font-weight-bold text-grey-darken-2 mb-3">
              <v-icon size="16" class="mr-1">mdi-camera</v-icon>
              Foto del memorial
            </p>

            <Field name="photoURL" v-slot="{ field }">
              <v-text-field
                v-bind="field"
                v-model="form.photoURL"
                label="URL de la fotografía"
                variant="outlined"
                prepend-inner-icon="mdi-link"
                :error-messages="errors.photoURL"
                hint="Pega la URL de una imagen pública (https://...)"
                persistent-hint
                class="mb-5"
              />
            </Field>

            <v-divider class="mb-5" />

            <!-- Epitafio -->
            <p class="text-subtitle-2 font-weight-bold text-grey-darken-2 mb-3">
              <v-icon size="16" class="mr-1">mdi-format-quote-close</v-icon>
              Epitafio
            </p>

            <Field name="epitaph" v-slot="{ field }">
              <v-text-field
                v-bind="field"
                v-model="form.epitaph"
                label="Epitafio"
                variant="outlined"
                prepend-inner-icon="mdi-format-quote-open"
                :error-messages="errors.epitaph"
                counter="255"
                hint="Frase o dedicatoria que aparece en el perfil público"
                persistent-hint
                class="mb-5"
              />
            </Field>

            <v-divider class="mb-5" />

            <!-- Biografía -->
            <p class="text-subtitle-2 font-weight-bold text-grey-darken-2 mb-3">
              <v-icon size="16" class="mr-1">mdi-text-box-outline</v-icon>
              Biografía
            </p>

            <Field name="biography" v-slot="{ field }">
              <v-textarea
                v-bind="field"
                v-model="form.biography"
                label="Biografía"
                variant="outlined"
                rows="6"
                counter="1000"
                :error-messages="errors.biography"
                hint="Describe la vida y legado del difunto"
                persistent-hint
                class="mb-5"
              />
            </Field>

            <!-- Acciones -->
            <div class="d-flex justify-end gap-3 mt-2">
              <v-btn
                variant="text"
                @click="$router.push('/guardian/my-memorials')"
                :disabled="saving"
              >
                Cancelar
              </v-btn>
              <v-btn
                color="primary"
                type="submit"
                :loading="saving"
                prepend-icon="mdi-content-save"
              >
                Guardar cambios
              </v-btn>
            </div>

          </VForm>
        </v-card>
      </v-col>
    </v-row>

  </v-container>
</template>

<script setup lang="ts">
import { reactive, ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Form as VForm, Field } from 'vee-validate'
import * as yup from 'yup'
import apiClient from '@/plugins/axios'
import { useUiStore } from '@/stores/uiStore'
import type { Deceased } from '@/models/Deceased'

const route  = useRoute()
const router = useRouter()
const ui     = useUiStore()

const deceasedId = Number(route.params.id)

// ── Estado ────────────────────────────────────────────────
const deceased  = ref<Deceased | null>(null)
const loading   = ref(true)
const loadError = ref(false)
const saving    = ref(false)

// Solo los 3 campos que el guardián puede editar
const form = reactive({
  photoURL:  '',
  epitaph:   '',
  biography: ''
})

// initialValues le dice a vee-validate cuáles son los valores iniciales de cada campo.
// Sin esto, su estado interno arranca vacío aunque form.x ya tenga datos cargados,
// y v-bind="field" muestra ese vacío sobreescribiendo el v-model.
const initialValues = computed(() => ({
  photoURL:  form.photoURL,
  epitaph:   form.epitaph,
  biography: form.biography
}))

// ── Validación ────────────────────────────────────────────
const schema = yup.object({
  photoURL: yup
    .string()
    .url('Debe ser una URL válida (https://...)')
    .nullable(),
  epitaph: yup
    .string()
    .max(255, 'Máximo 255 caracteres'),
  biography: yup
    .string()
    .max(1000, 'Máximo 1000 caracteres')
})

// ── Helpers ───────────────────────────────────────────────
function formatDate(dateStr: string) {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('es-ES', {
    year: 'numeric', month: 'long', day: 'numeric'
  })
}

function normalizeDeceased(raw: any): Deceased {
  return {
    id:            raw?.id            ?? raw?.Id,
    name:          raw?.name          ?? raw?.Name          ?? '',
    dni:           raw?.dni           ?? raw?.Dni           ?? '',
    funeralHomeId: raw?.funeralHomeId ?? raw?.FuneralHomeId ?? 0,
    guardianId:    raw?.guardianId    ?? raw?.GuardianId    ?? 0,
    staffId:       raw?.staffId       ?? raw?.StaffId       ?? 0,
    biography:     raw?.biography     ?? raw?.Biography     ?? '',
    photoURL:      raw?.photoURL      ?? raw?.PhotoURL      ?? '',
    birthDate:     raw?.birthDate     ?? raw?.BirthDate     ?? '',
    deathDate:     raw?.deathDate     ?? raw?.DeathDate     ?? '',
    epitaph:       raw?.epitaph       ?? raw?.Epitaph       ?? '',
    memories:      null
  }
}

// ── Carga ─────────────────────────────────────────────────
async function loadDeceased() {
  loading.value   = true
  loadError.value = false
  try {
    const { data } = await apiClient.get(`/Deceased/${deceasedId}`)
    deceased.value = normalizeDeceased(data)
    // Pre-relleno solo los campos editables
    form.photoURL  = deceased.value.photoURL  ?? ''
    form.epitaph   = deceased.value.epitaph   ?? ''
    form.biography = deceased.value.biography ?? ''
  } catch (err) {
    console.error('Error cargando difunto:', err)
    loadError.value = true
  } finally {
    loading.value = false
  }
}

// ── Guardado ──────────────────────────────────────────────
async function save() {
  if (!deceased.value) return
  saving.value = true

  // DeceasedUpdateDTO completo: campos originales + los 3 editados
  const payload = {
    id:            deceased.value.id,
    name:          deceased.value.name,
    dni:           deceased.value.dni,
    funeralHomeId: deceased.value.funeralHomeId,
    guardianId:    deceased.value.guardianId,
    staffId:       deceased.value.staffId,
    birthDate:     deceased.value.birthDate,
    deathDate:     deceased.value.deathDate,
    // Editables por el guardián:
    biography:     form.biography,
    epitaph:       form.epitaph,
    photoURL:      form.photoURL
  }

  try {
    await apiClient.put(`/Deceased/${deceasedId}`, payload)
    ui.notify('Memorial actualizado correctamente.', 'success')
    router.push('/guardian/my-memorials')
  } catch (err: any) {
    const status = err.response?.status
    const msg    = err.response?.data?.message ?? err.response?.data

    if (status === 403) {
      ui.notify('No tienes permiso para editar este memorial.', 'error')
    } else if (status === 404) {
      ui.notify('El memorial no existe o fue eliminado.', 'error')
    } else if (status === 409) {
      ui.notify(typeof msg === 'string' ? msg : 'Conflicto al guardar los datos.', 'error')
    } else {
      ui.notify('Error del servidor. Inténtalo de nuevo más tarde.', 'error')
    }
    console.error('Error al guardar memorial:', err)
  } finally {
    saving.value = false
  }
}

onMounted(loadDeceased)
</script>