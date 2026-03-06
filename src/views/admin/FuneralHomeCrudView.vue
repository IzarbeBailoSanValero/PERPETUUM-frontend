<template>
  <v-container>
    <div class="d-flex justify-space-between align-center mb-4">
      <h2 class="text-h4 font-weight-bold  ">{{ t('admin.funeralHomes.title') }}</h2>
      <v-btn color="primary" prepend-icon="mdi-plus" @click="openCreateModal">
        {{ t('admin.funeralHomes.newBtn') }}
      </v-btn>
    </div>

    <v-card variant="outlined" class="rounded-xl">
      <v-data-table :headers="headers" :items="store.funeralHomes" :loading="store.loading">
        <template v-slot:item.name="{ item }">
          <FuneralHomeRow :item="item" />
        </template>
        <template v-slot:item.actions="{ item }">
          <v-btn icon="mdi-pencil" variant="text" color="primary"  @click="openEditModal(item)"></v-btn>
          <v-btn icon="mdi-delete" variant="text" color="error" @click="confirmDelete(item.id)"></v-btn>
        </template>
      </v-data-table>
    </v-card>

    <v-dialog v-model="dialog" max-width="500">
      <v-card :title="isEditing ? t('admin.funeralHomes.editTitle') : t('admin.funeralHomes.createTitle')" class="pa-4 rounded-lg">
        <VForm @submit="save" :validation-schema="schema" :initial-values="initialValues" v-slot="{ errors }">
          <v-card-text>
            <Field name="name" v-slot="{ field }">
              <v-text-field v-bind="field" v-model="form.name" :label="t('admin.funeralHomes.fieldName')" variant="outlined" :error-messages="errors.name" class="mb-3" />
            </Field>
            <Field name="cif" v-slot="{ field }">
              <v-text-field v-bind="field" v-model="form.cif" :label="t('admin.funeralHomes.fieldCif')" variant="outlined" :error-messages="errors.cif" class="mb-3" />
            </Field>
            <Field name="contactEmail" v-slot="{ field }">
              <v-text-field v-bind="field" v-model="form.contactEmail" :label="t('admin.funeralHomes.fieldEmail')" variant="outlined" :error-messages="errors.contactEmail" class="mb-3" />
            </Field>
            <Field name="address" v-slot="{ field }">
              <v-text-field v-bind="field" v-model="form.address" :label="t('admin.funeralHomes.fieldAddress')" variant="outlined" :error-messages="errors.address" class="mb-3" />
            </Field>
            <Field name="phoneNumber" v-slot="{ field }">
              <v-text-field v-bind="field" v-model="form.phoneNumber" :label="t('admin.funeralHomes.fieldPhone')" variant="outlined" :error-messages="errors.phoneNumber" />
            </Field>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn variant="text" @click="dialog = false">{{ t('admin.funeralHomes.cancel') }}</v-btn>
            <v-btn color="primary" type="submit" :loading="saving">{{ t('admin.funeralHomes.save') }}</v-btn>
          </v-card-actions>
        </VForm>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { Form as VForm, Field } from 'vee-validate'
import * as yup from 'yup'
import Swal from 'sweetalert2'
import apiClient from '@/plugins/axios'
import { useFuneralHomeStore } from '@/stores/funeralHomeStore'
import FuneralHomeRow from '@/components/admin/FuneralHomeRow.vue'

const { t } = useI18n()
const store = useFuneralHomeStore()

const dialog    = ref(false)
const saving    = ref(false)
const isEditing = ref(false)
const editId    = ref<number | null>(null)

const headers = computed(() => [
  { title: t('admin.funeralHomes.colName'),    key: 'name',        align: 'start' as const },
  { title: t('admin.funeralHomes.colAddress'), key: 'address',     align: 'start' as const },
  { title: t('admin.funeralHomes.colPhone'),   key: 'phoneNumber', align: 'start' as const },
  { title: t('admin.funeralHomes.colActions'), key: 'actions',     align: 'end'   as const, sortable: false }
])

const form = reactive<any>({ name: '', cif: '', contactEmail: '', address: '', phoneNumber: '' })
const initialValues = computed(() => ({ ...form }))

const schema = computed(() => yup.object({
  name:         yup.string().required(() => t('validation.nameRequired')).max(100, () => t('validation.nameMax', { max: 100 })),
  cif:          yup.string().required(() => t('validation.cifRequired')).max(9, () => t('validation.cifMax')),
  contactEmail: yup.string().required(() => t('validation.emailRequired')).email(() => t('validation.emailInvalid')),
  address:      yup.string().required(() => t('validation.addressRequired')).max(255, () => t('validation.nameMax', { max: 255 })),
  phoneNumber:  yup.string().required(() => t('validation.phoneRequired')).matches(/^[+\d\s\-()]{6,20}$/, () => t('validation.phoneInvalid'))
}))

function openCreateModal() {
  isEditing.value = false; editId.value = null
  Object.assign(form, { name: '', cif: '', contactEmail: '', address: '', phoneNumber: '' })
  dialog.value = true
}
function openEditModal(item: any) {
  isEditing.value = true; editId.value = item.id
  Object.assign(form, { name: item.name, cif: item.cif, contactEmail: item.contactEmail, address: item.address, phoneNumber: item.phoneNumber })
  dialog.value = true
}

async function save() {
  saving.value = true
  try {
    if (isEditing.value && editId.value !== null) {
      const payload = { id: editId.value, ...form }
      await apiClient.put(`/FuneralHome/${editId.value}`, payload)
      store.updateInList(payload)
      Swal.fire({ title: t('admin.funeralHomes.updatedOk'), icon: 'success', timer: 1500, showConfirmButton: false })
    } else {
      const response = await apiClient.post('/FuneralHome', form)
      store.addToList(response.data)
      if (!response.data?.id && !response.data?.Id) await store.fetchAll()
      Swal.fire({ title: t('admin.funeralHomes.createdOk'), icon: 'success', timer: 1500, showConfirmButton: false })
    }
    dialog.value = false
  } catch (error: any) {
    const msg = error.response?.data?.message || error.response?.data || t('admin.funeralHomes.errorSave')
    Swal.fire(t('common.error'), String(msg), 'error')
  } finally { saving.value = false }
}

async function confirmDelete(id: number) {
  const result = await Swal.fire({
    title: t('admin.funeralHomes.deleteTitle'),
    text:  t('admin.funeralHomes.deleteText'),
    icon: 'warning', showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonText: t('common.cancel'),
    confirmButtonText: t('admin.funeralHomes.deleteBtn')
  })
  if (result.isConfirmed) {
    try {
      await apiClient.delete(`/FuneralHome/${id}`)
      store.removeFromList(id)
      Swal.fire({ title: t('admin.funeralHomes.deletedOk'), icon: 'success', timer: 1200, showConfirmButton: false })
    } catch (e: any) {
      const msg = e.response?.data?.message || t('admin.funeralHomes.errorDelete')
      Swal.fire(t('common.error'), String(msg), 'error')
    }
  }
}

onMounted(() => store.fetchAll())
</script>