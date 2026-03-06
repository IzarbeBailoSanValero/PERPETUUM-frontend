<template>
  <v-container>

    <div class="d-flex justify-space-between align-center mb-4">
      <h2 class="text-h4 font-weight-bold">{{ t('admin.staff.title') }}</h2>
      <v-btn
        v-if="auth.userRole === 'Admin'"
        color="indigo"
        prepend-icon="mdi-account-plus"
        @click="openCreateModal"
      >
        Nuevo empleado
      </v-btn>
    </div>

    <v-card v-if="auth.userRole === 'Admin'" variant="tonal" class="rounded-xl mb-4 pa-4">
      <div class="d-flex align-center gap-3">
        <v-text-field
          v-model.number="funeralHomeSearch"
          :label="t('admin.staff.fieldFuneralHomeId')"
          prepend-inner-icon="mdi-office-building"
          variant="outlined"
          type="number"
          density="compact"
          hide-details
          class="max-w-xs"
          style="max-width: 220px"
        />
        <v-btn color="indigo" variant="tonal" @click="loadStaff" :loading="store.loading">
          Cargar empleados
        </v-btn>
      </div>
    </v-card>

    <v-alert v-else-if="auth.userRole === 'Staff'" type="info" variant="tonal" density="compact" class="mb-4">
      Vista de solo lectura: se muestran los empleados de tu funeraria.
    </v-alert>

    <v-card variant="outlined" class="rounded-xl">
      <v-data-table
        :headers="headers"
        :items="store.staffList"
        :loading="store.loading"
        no-data-text="No hay empleados. Como Admin: indica ID de funeraria y pulsa «Cargar empleados». Como Staff: se listan los de tu funeraria."
      >
        
        <template v-slot:item.name="{ item }">
          <StaffRow :item="item" />
        </template>

        <!-- Columna Funeraria / Rol -->
        <template v-slot:item.funeralHomeId="{ item }">
          <v-chip
            v-if="item.isAdmin || !item.funeralHomeId"
            color="indigo"
            size="small"
            variant="tonal"
          >
            Admin Global
          </v-chip>
          <v-chip v-else color="blue-grey" size="small" variant="tonal">
            Funeraria Nº{{ item.funeralHomeId }}
          </v-chip>
        </template>

        <!-- Columna Acciones (solo Admin) -->
        <template v-slot:item.actions="{ item }">
          <template v-if="auth.userRole === 'Admin'">
            <v-btn icon="mdi-pencil" variant="text" color="blue" @click="openEditModal(item)" />
            <v-btn icon="mdi-delete" variant="text" color="error" @click="confirmDelete(item.id)" />
          </template>
          <v-chip v-else color="grey" size="x-small" variant="tonal">{{ t('admin.staff.readOnly') }}</v-chip>
        </template>
      </v-data-table>
    </v-card>

    <v-dialog v-model="dialog" max-width="520">
      <v-card :title="isEditing ? t('admin.staff.editTitle') : t('admin.staff.createTitle')" class="pa-4 rounded-lg">

        <VForm @submit="save" :validation-schema="schema" :initial-values="initialValues" v-slot="{ errors }">          <v-card-text>

            <!-- Nombre -->
            <Field name="name" v-slot="{ field }">
              <v-text-field
                v-bind="field"
                v-model="form.name"
                label="Nombre Completo"
                prepend-inner-icon="mdi-account"
                variant="outlined"
                :error-messages="errors.name"
                class="mb-3"
              />
            </Field>

            <!-- Email -->
            <Field name="email" v-slot="{ field }">
              <v-text-field
                v-bind="field"
                v-model="form.email"
                label="Correo Electrónico"
                prepend-inner-icon="mdi-email"
                variant="outlined"
                :error-messages="errors.email"
                class="mb-3"
              />
            </Field>

            <!-- DNI -->
            <Field name="dni" v-slot="{ field }">
              <v-text-field
                v-bind="field"
                v-model="form.dni"
                label="DNI"
                prepend-inner-icon="mdi-card-account-details"
                variant="outlined"
                :error-messages="errors.dni"
                class="mb-3"
              />
            </Field>

            <!-- Contraseña (solo en creación) -->
            <Field v-if="!isEditing" name="password" v-slot="{ field }">
              <v-text-field
                v-bind="field"
                v-model="form.password"
                label="Contraseña"
                prepend-inner-icon="mdi-lock"
                type="password"
                variant="outlined"
                :error-messages="errors.password"
                class="mb-3"
              />
            </Field>

            <!-- ID Funeraria (solo en creación: Admin debe indicar funeraria; Staff no ve el campo) -->
            <Field v-if="!isEditing && auth.userRole === 'Admin' && !form.isAdmin" name="funeralHomeId" v-slot="{ field }">
              <v-text-field
                v-bind="field"
                v-model.number="form.funeralHomeId"
                label="ID de Funeraria"
                prepend-inner-icon="mdi-office-building"
                type="number"
                variant="outlined"
                :error-messages="errors.funeralHomeId"
                class="mb-3"
              />
            </Field>

            <!-- Es Admin -->
            <v-switch
              v-if="!isEditing"
              v-model="form.isAdmin"
              :label="t('admin.staff.isAdmin')"
              color="indigo"
              inset
              class="mb-2"
              @update:modelValue="onAdminToggle"
            />

            <v-alert
              v-if="form.isAdmin && !isEditing"
              type="info"
              variant="tonal"
              density="compact"
              :text="t('admin.staff.adminNote')"
              class="mb-2"
            />

          </v-card-text>

          <v-card-actions>
            <v-spacer />
            <v-btn variant="text" @click="dialog = false">{{ t('admin.staff.cancel') }}</v-btn>
            <v-btn color="indigo" type="submit" :loading="saving">
              {{ isEditing ? 'Actualizar' : 'Crear' }}
            </v-btn>
          </v-card-actions>
        </VForm>

      </v-card>
    </v-dialog>

  </v-container>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import apiClient from '@/plugins/axios'
import Swal from 'sweetalert2'
import { useAuthStore } from '@/stores/authStore'
import { useStaffStore } from '@/stores/staffStore'
import StaffRow from '@/components/admin/StaffRow.vue'

import { Form as VForm, Field } from 'vee-validate'
import * as yup from 'yup'

// ─── STORES 
const { t } = useI18n()
const auth = useAuthStore()
const store = useStaffStore()

// ─── ESTADO DEL MODAL 
const dialog = ref(false)
const saving = ref(false)
const isEditing = ref(false)
const editId = ref<number | null>(null)
const funeralHomeSearch = ref<number | null>(null)

// ─── CABECERAS DE TABLA 
const headers = computed(() => [
  { title: t('admin.staff.colName'),        key: 'name' },
  { title: t('admin.staff.colDni'),         key: 'dni' },
  { title: t('admin.staff.colFuneralHome'), key: 'funeralHomeId' },
  { title: t('admin.staff.colActions'),     key: 'actions', align: 'end' as const, sortable: false }
])

// ─── FORMULARIO 
const form = reactive<any>({
  name: '',
  email: '',
  dni: '',
  password: '',
  funeralHomeId: auth.user?.funeralHomeId ?? null,
  isAdmin: false
})

// initialValues sincroniza vee-validate con los datos pre-cargados al editar.
// Sin esto, v-bind="field" muestra los campos vacíos aunque form.x ya tenga valor.

const initialValues = computed(() => ({ ...form }))

// ─── ESQUEMA DE VALIDACIÓN 

const schema = computed(() => {
  if (isEditing.value) {
    return yup.object({
      name: yup.string().required('Nombre obligatorio').max(100),
      email: yup.string().required('Email obligatorio').email('Email inválido'),
      dni: yup.string().required('DNI obligatorio').max(9)
    })
  }
  return yup.object({
    name: yup.string().required('Nombre obligatorio').max(100),
    email: yup.string().required('Email obligatorio').email('Email inválido'),
    dni: yup.string().required('DNI obligatorio').max(9),
    password: yup.string().required('Contraseña obligatoria').min(6, 'Mínimo 6 caracteres').max(20),
    funeralHomeId: form.isAdmin
      ? yup.number().nullable()
      : yup.number().nullable().required('ID de funeraria obligatorio para empleados')
  })
})

// ─── HELPERS
function onAdminToggle(val: boolean) {
  if (val) form.funeralHomeId = null
  else form.funeralHomeId = auth.user?.funeralHomeId ?? null // Solo Staff tiene funeraria
}

// ─── CARGA INICIAL 
async function loadStaff() {
  const fhId = auth.user?.funeralHomeId ?? funeralHomeSearch.value
  if (!fhId) return
  await store.fetchByFuneralHome(fhId)
}

// ─── APERTURA MODALES 
function openCreateModal() {
  isEditing.value = false
  editId.value = null
  Object.assign(form, {
    name: '',
    email: '',
    dni: '',
    password: '',
    funeralHomeId: auth.user?.funeralHomeId ?? null,
    isAdmin: false
  })
  dialog.value = true
}

function openEditModal(item: any) {
  isEditing.value = true
  editId.value = item.id
  Object.assign(form, {
    name: item.name,
    email: item.email,
    dni: item.dni,
    password: '',
    funeralHomeId: item.funeralHomeId,
    isAdmin: false
  })
  dialog.value = true
}

// ─── GUARDAR (POST / PUT)
async function save(values: any, { resetForm }: any) {
  saving.value = true
  try {
    if (isEditing.value && editId.value !== null) {
      // PUT: solo name, email, dni
      const updatePayload = {
        id: editId.value,
        name: form.name,
        email: form.email,
        dni: form.dni
      }
      await apiClient.put(`/Staff/${editId.value}`, updatePayload)

      // Actualizo el store localmente
      store.updateInList({
        id: editId.value,
        funeralHomeId: form.funeralHomeId,
        name: form.name,
        email: form.email,
        dni: form.dni
      })

      Swal.fire({ title: t('admin.staff.updatedOk'), icon: 'success', timer: 1500, showConfirmButton: false })
    } else {
      // POST: create staff
      const createPayload: any = {
        name: form.name,
        email: form.email,
        dni: form.dni,
        password: form.password,
        isAdmin: form.isAdmin,
        funeralHomeId: form.isAdmin ? null : form.funeralHomeId
      }
      const response = await apiClient.post('/Staff', createPayload)
      store.addToList(response.data)

      // Si no tenemos datos del created, recargamos
      if (!response.data?.id) {
        await loadStaff()
      }

      Swal.fire({ title: t('admin.staff.createdOk'), icon: 'success', timer: 1500, showConfirmButton: false })
    }

    dialog.value = false

  } catch (error: any) {
    console.error('Error al guardar empleado:', error.response?.data || error)
    const msg = error.response?.data?.message
      || error.response?.data
      || t('admin.staff.errorSave')
    Swal.fire(t('common.error'), String(msg), 'error')
  } finally {
    saving.value = false
  }
}

// ─── ELIMINAR
async function confirmDelete(id: number) {
  const result = await Swal.fire({
    title: t('admin.staff.deleteTitle'),
    text: t('admin.staff.deleteText'),
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonText: 'Cancelar',
    confirmButtonText: t('admin.staff.deleteBtn')
  })

  if (result.isConfirmed) {
    try {
      await apiClient.delete(`/Staff/${id}`)
      store.removeFromList(id)
      Swal.fire({ title: t('admin.staff.deletedOk'), icon: 'success', timer: 1200, showConfirmButton: false })
    } catch (e: any) {
      const msg = e.response?.data?.message || t('admin.staff.errorDelete')
      Swal.fire('Error', String(msg), 'error')
    }
  }
}

// ─── ON MOUNTED 
onMounted(() => {
  // Solo Staff tiene funeraria asignada; Admin global debe indicar ID de funeraria para cargar empleados
  if (auth.user?.funeralHomeId) {
    loadStaff()
  }
})
</script>