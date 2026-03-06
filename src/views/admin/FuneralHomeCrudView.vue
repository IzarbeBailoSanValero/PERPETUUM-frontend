<template>
  <v-container>

    <div class="d-flex justify-space-between align-center mb-4">
      <h2 class="text-h4 font-weight-bold">Gestión de Funerarias</h2>
      <v-btn color="indigo" prepend-icon="mdi-plus" @click="openCreateModal">
        Nueva Funeraria
      </v-btn>
    </div>

    <v-card variant="outlined" class="rounded-xl">
      <v-data-table :headers="headers" :items="store.funeralHomes" :loading="store.loading">

        <template v-slot:item.name="{ item }">
          <FuneralHomeRow :item="item" />
        </template>

        <template v-slot:item.actions="{ item }">
          <v-btn icon="mdi-pencil" variant="text" color="blue" @click="openEditModal(item)"></v-btn>
          <v-btn icon="mdi-delete" variant="text" color="error" @click="confirmDelete(item.id)"></v-btn>
        </template>

      </v-data-table>
    </v-card>

    <v-dialog v-model="dialog" max-width="500">
      <v-card :title="isEditing ? 'Editar Funeraria' : 'Registrar Funeraria'" class="pa-4 rounded-lg">

        <VForm @submit="save" :validation-schema="schema" v-slot="{ errors }">
          <v-card-text>

            <Field name="name" v-slot="{ field }">
              <v-text-field v-bind="field" v-model="form.name" label="Nombre" variant="outlined" :error-messages="errors.name" class="mb-3" />
            </Field>

            <Field name="cif" v-slot="{ field }">
              <v-text-field v-bind="field" v-model="form.cif" label="CIF" variant="outlined" :error-messages="errors.cif" class="mb-3" />
            </Field>

            <Field name="contactEmail" v-slot="{ field }">
              <v-text-field v-bind="field" v-model="form.contactEmail" label="Email de contacto" variant="outlined" :error-messages="errors.contactEmail" class="mb-3" />
            </Field>

            <Field name="address" v-slot="{ field }">
              <v-text-field v-bind="field" v-model="form.address" label="Dirección" variant="outlined" :error-messages="errors.address" class="mb-3" />
            </Field>

            <Field name="phoneNumber" v-slot="{ field }">
              <v-text-field v-bind="field" v-model="form.phoneNumber" label="Teléfono" variant="outlined" :error-messages="errors.phoneNumber" />
            </Field>

          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn variant="text" @click="dialog = false">Cancelar</v-btn>
            <v-btn color="indigo" type="submit" :loading="saving">Guardar</v-btn>
          </v-card-actions>
        </VForm>

      </v-card>
    </v-dialog>

  </v-container>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { Form as VForm, Field } from 'vee-validate'
import * as yup from 'yup'
import Swal from 'sweetalert2'
import apiClient from '@/plugins/axios'
import { useFuneralHomeStore } from '@/stores/funeralHomeStore'
import FuneralHomeRow from '@/components/admin/FuneralHomeRow.vue'

const store = useFuneralHomeStore()

const dialog    = ref(false)
const saving    = ref(false)
const isEditing = ref(false)
const editId    = ref<number | null>(null)

const headers = [
  { title: 'Funeraria',  key: 'name',         align: 'start' as const },
  { title: 'Dirección',  key: 'address',       align: 'start' as const },
  { title: 'Teléfono',   key: 'phoneNumber',   align: 'start' as const },
  { title: 'Acciones',   key: 'actions',       align: 'end'   as const, sortable: false }
]

const form = reactive<any>({
  name:         '',
  cif:          '',
  contactEmail: '',
  address:      '',
  phoneNumber:  ''
})

const schema = yup.object({
  name:         yup.string().required('Nombre obligatorio').max(100, 'Máximo 100 caracteres'),
  cif:          yup.string().required('CIF obligatorio').max(9, 'Máximo 9 caracteres'),
  contactEmail: yup.string().required('Email obligatorio').email('Email inválido'),
  address:      yup.string().required('Dirección obligatoria').max(255, 'Máximo 255 caracteres'),
  phoneNumber:  yup.string().required('Teléfono obligatorio').matches(/^[+\d\s\-()]{6,20}$/, 'Formato de teléfono inválido')
})

function openCreateModal() {
  isEditing.value = false
  editId.value    = null
  Object.assign(form, { name: '', cif: '', contactEmail: '', address: '', phoneNumber: '' })
  dialog.value    = true
}

function openEditModal(item: any) {
  isEditing.value = true
  editId.value    = item.id
  Object.assign(form, {
    name:         item.name,
    cif:          item.cif,
    contactEmail: item.contactEmail,
    address:      item.address,
    phoneNumber:  item.phoneNumber
  })
  dialog.value = true
}

async function save(values: any, { resetForm }: any) {
  saving.value = true
  try {
    if (isEditing.value && editId.value !== null) {
      const payload = { id: editId.value, ...form }
      await apiClient.put(`/FuneralHome/${editId.value}`, payload)
      store.updateInList(payload)
      Swal.fire({ title: '¡Actualizada!', icon: 'success', timer: 1500, showConfirmButton: false })
    } else {
      const response = await apiClient.post('/FuneralHome', form)
      store.addToList(response.data)
      if (!response.data?.id && !response.data?.Id) await store.fetchAll()
      Swal.fire({ title: '¡Funeraria creada!', icon: 'success', timer: 1500, showConfirmButton: false })
    }
    dialog.value = false
  } catch (error: any) {
    const msg = error.response?.data?.message || error.response?.data || 'El CIF puede que ya esté registrado.'
    Swal.fire('Error al guardar', String(msg), 'error')
  } finally {
    saving.value = false
  }
}

async function confirmDelete(id: number) {
  const result = await Swal.fire({
    title: '¿Eliminar funeraria?',
    text: 'Esto puede afectar a los empleados y difuntos asociados.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonText: 'Cancelar',
    confirmButtonText: 'Sí, borrar'
  })

  if (result.isConfirmed) {
    try {
      await apiClient.delete(`/FuneralHome/${id}`)
      store.removeFromList(id)
      Swal.fire('Eliminada', '', 'success')
    } catch (e: any) {
      const msg = e.response?.data?.message || 'No se pudo eliminar la funeraria.'
      Swal.fire('Error', String(msg), 'error')
    }
  }
}

onMounted(() => store.fetchAll())
</script>