<template>
  <v-container>
    <div class="d-flex justify-space-between align-center mb-4">
      <h2 class="text-h4 font-weight-bold">Gestión de Guardianes</h2>
      
      <v-btn color="indigo" prepend-icon="mdi-plus" @click="openCreateModal">
        Nuevo Familiar
      </v-btn>
    </div>

    <v-card variant="outlined" class="rounded-xl">
      <v-data-table :headers="headers" :items="store.guardians" :loading="store.loading">
        
        <template v-slot:item.name="{ item }">
          <GuardianRow :item="item" />
        </template>

        <template v-slot:item.actions="{ item }">
          <v-btn icon="mdi-pencil" variant="text" color="blue" @click="openEditModal(item)"></v-btn>
          <v-btn icon="mdi-delete" variant="text" color="error" @click="confirmDelete(item.id)"></v-btn>
        </template>

      </v-data-table>
    </v-card>

    <v-dialog v-model="dialog" max-width="500">
      <v-card :title="isEditing ? t('admin.guardians.editTitle') : t('admin.guardians.createTitle')" class="pa-4 rounded-lg">
        
        <VForm @submit="save" :validation-schema="schema" :initial-values="initialValues" v-slot="{ errors }">          <v-card-text>
            
            <Field name="name" v-slot="{ field }">
              <v-text-field v-bind="field" v-model="form.name" :label="t('admin.guardians.fieldName')" variant="outlined" :error-messages="errors.name" class="mb-3" />
            </Field>

            <Field name="dni" v-slot="{ field }">
              <v-text-field v-bind="field" v-model="form.dni" :label="t('admin.guardians.fieldDni')" variant="outlined" :error-messages="errors.dni" class="mb-3" />
            </Field>

            <Field name="email" v-slot="{ field }">
              <v-text-field v-bind="field" v-model="form.email" :label="t('admin.guardians.fieldEmail')" variant="outlined" :error-messages="errors.email" class="mb-3" />
            </Field>

            <Field name="phone" v-slot="{ field }">
              <v-text-field v-bind="field" v-model="form.phoneNumber" :label="t('admin.guardians.fieldPhone')" variant="outlined" :error-messages="errors.phone" class="mb-3" />
            </Field>

            <Field v-if="!isEditing" name="password" v-slot="{ field }">
              <v-text-field v-bind="field" v-model="form.password" :label="t('admin.guardians.fieldPassword')" type="password" variant="outlined" :error-messages="errors.password" />
            </Field>
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn variant="text" @click="dialog = false">{{ t('admin.guardians.cancel') }}</v-btn>
            <v-btn color="indigo" type="submit" :loading="saving">{{ t('admin.guardians.save') }}</v-btn>
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
import { useGuardianStore } from '@/stores/guardianStore'
import GuardianRow from '@/components/admin/GuardianRow.vue' 

import { Form as VForm, Field } from 'vee-validate'
import * as yup from 'yup'


//  INTERFACES 
interface Guardian {
  id: number;
  name: string;
  dni: string;
  email: string;
  phoneNumber: string;
  funeralHomeId: number | null;
}
const { t } = useI18n()
const auth = useAuthStore()
const store = useGuardianStore()
const dialog = ref(false)
const saving = ref(false)

// Controladores de modo Edición
const isEditing = ref(false) // false ->Crear true -> Editar
const editId = ref<number | null>(null) // id de elemento que estamos editando


// CONFIGURACIÓN DE TABLA + FORMULARIO
const headers = computed(() => [
  { title: t('admin.guardians.colName'),    key: 'name' },
  { title: t('admin.guardians.colPhone'),   key: 'phoneNumber' },
  { title: t('admin.guardians.colActions'), key: 'actions', align: 'end' as const, sortable: false }
])

// Objeto reactivo enlazado a los inputs x v-model
const form = reactive<any>({
  name: '',
  dni: '',
  email: '',
  phoneNumber: '',
  password: '',
  funeralHomeId: auth.user?.funeralHomeId ?? 0,   // Staff: su funeraria; Admin global: 0 (debe elegir)
  staffId: auth.user?.id || 0
})

const initialValues = computed(() => ({ ...form }))

// VALIDACIÓN
const schema = computed(() => {
  if (isEditing.value) {
    // Al editar, campos opcionales
    return yup.object({
      name: yup.string().min(3, 'Nombre demasiado corto'),
      dni: yup.string(),
      email: yup.string().email('Email inválido'),
      phone: yup.string(),
      password: yup.string().nullable()
    })
  }
  // Al crear, campos requeridos
  return yup.object({
    name: yup.string().required('Nombre obligatorio').min(3, 'Nombre demasiado corto'),
    dni: yup.string().required('DNI obligatorio'),
    email: yup.string().email('Email inválido').required('Email obligatorio'),
    phone: yup.string().required('Teléfono obligatorio'),
    password: yup.string().required('Contraseña obligatoria').min(6, 'Mínimo 6 caracteres')
  })
})



// CRUD

// preparo crear: Limpia  formulario y abre modal
function openCreateModal() {
  isEditing.value = false
  editId.value = null
  Object.assign(form, { name: '', dni: '', email: '', phoneNumber: '', password: '' })
  dialog.value = true
}

// preparo editar: vuelca los datos de la fila seleccionada en el formulario
function openEditModal(item: any) {
  isEditing.value = true
  editId.value = item.id
  Object.assign(form, { 
    name: item.name, 
    dni: item.dni, 
    email: item.email, 
    phoneNumber: item.phoneNumber,
    password: '' // por seguridad vacía
  })
  dialog.value = true
}

// GUARDAR POST / PUT
async function save(values: any, { resetForm }: any) {
  saving.value = true
  try {
    if (isEditing.value && editId.value) {
      // MODO EDICIÓN PUT - Enviar solo campos con valor
      const updateData: any = { id: editId.value }
      if (form.name && form.name.trim()) updateData.name = form.name
      if (form.dni && form.dni.trim()) updateData.dni = form.dni
      if (form.email && form.email.trim()) updateData.email = form.email
      if (form.phoneNumber && form.phoneNumber.trim()) updateData.phoneNumber = form.phoneNumber
      
      await apiClient.put(`/MemorialGuardian/${editId.value}`, updateData)
      Swal.fire({ title: t('admin.guardians.updatedOk'), icon: 'success', timer: 1500, showConfirmButton: false })
    } else {
      // MODO CREACIÓN POST
      await apiClient.post('/MemorialGuardian', form)
      Swal.fire({ title: t('admin.guardians.createdOk'), icon: 'success', timer: 1500, showConfirmButton: false })
    }
    
    // cerramos modal y recargamos la lista
    dialog.value = false
    store.fetchAllGuardians()
  } catch (error: any) {
    console.error('Error al guardar:', error.response?.data || error)
    const errorMsg = error.response?.data?.message || error.response?.data || t('admin.guardians.errorSave')
    Swal.fire('Error', errorMsg, 'error')
  } finally { saving.value = false }
}

// DELETE ->Alerta antes 
async function confirmDelete(id: number) {
  const result = await Swal.fire({
    title: t('admin.guardians.deleteTitle'),
    text: t('admin.guardians.deleteText'),
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    confirmButtonText: t('admin.guardians.deleteBtn')
  })

  if (result.isConfirmed) {
    try {
      await apiClient.delete(`/MemorialGuardian/${id}`)
      store.fetchAllGuardians()
      Swal.fire(t('admin.guardians.deletedOk'), '', 'success')
    } catch (e) {
      Swal.fire('Error', t('admin.guardians.errorDelete'), 'error')
    }
  }
}



//AL CREAR COMPONENTE
onMounted(() => {
  store.fetchAllGuardians()
})
</script>