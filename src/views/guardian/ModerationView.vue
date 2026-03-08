<template>
  <v-container>

    <div class="d-flex justify-space-between align-center flex-wrap ga-3 mb-4">
      <h2 class="text-h4 font-weight-bold">
        {{ t('guardian.moderation.title') }}
      </h2>
    </div>

    <v-card class="rounded-xl pa-4">

      <!-- SIN MEMORIAS -->
      <div v-if="filteredMemories.length === 0">
        <v-alert type="info" variant="tonal">
          {{ t('guardian.moderation.noMemories') }}
        </v-alert>
      </div>

      <!-- TABLA -->
      <div v-else style="overflow-x:auto;">
        <v-table>

          <thead>
            <tr>
              <th v-if="!deceasedId">
                {{ t('guardian.moderation.colDeceased') }}
              </th>

              <th>
                {{ t('guardian.moderation.colMessage') }}
              </th>

              <th>
                {{ t('guardian.moderation.colType') }}
              </th>

              <th>
                {{ t('guardian.moderation.colDate') }}
              </th>

              <th>
                {{ t('guardian.moderation.colActions') }}
              </th>
            </tr>
          </thead>

          <tbody>
            <tr
              v-for="memory in filteredMemories"
              :key="memory.id"
            >

              <td v-if="!deceasedId">
                {{ memory.deceasedName }}
              </td>

              <td class="text-truncate" style="max-width:420px;">
                {{
                  memory.textContent ||
                  memory.mediaURL ||
                  t('common.noContent')
                }}
              </td>

              <td>
                {{ getTypeLabel(memory.type) }}
              </td>

              <td>
                {{ formatDate(memory.createdDate) }}
              </td>

              <td>
                <div class="d-flex ga-2">

                  <v-btn
                    size="small"
                    color="success"
                    @click="moderate(memory.id, 1)"
                  >
                    {{ t('guardian.moderation.approve') }}
                  </v-btn>

                  <v-btn
                    size="small"
                    color="error"
                    variant="tonal"
                    @click="moderate(memory.id, 2)"
                  >
                    {{ t('guardian.moderation.reject') }}
                  </v-btn>

                </div>
              </td>

            </tr>
          </tbody>

        </v-table>
      </div>

    </v-card>

  </v-container>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import apiClient from '@/plugins/axios'
import Swal from 'sweetalert2'

const { t } = useI18n()

const memories = ref<any[]>([])
const loading = ref(false)

const deceasedId = ref<number | null>(null)

const filteredMemories = computed(() => {
  if (!deceasedId.value) return memories.value
  return memories.value.filter(m => m.deceasedId === deceasedId.value)
})

function getTypeLabel(type: number) {
  const types: any = {
    0: 'Texto',
    1: 'Imagen',
    2: 'Video',
    3: 'Audio'
  }

  return types[type] || 'Otro'
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString()
}

async function fetchMemories() {
  loading.value = true

  try {
    const res = await apiClient.get('/MemorialMemory/pending')
    memories.value = res.data || []
  } catch (err) {
    console.error(err)

    Swal.fire(
      'Error',
      t('guardian.moderation.errorLoad'),
      'error'
    )
  } finally {
    loading.value = false
  }
}

async function moderate(id: number, status: number) {
  try {
    await apiClient.put(`/MemorialMemory/moderate/${id}`, { status })

    memories.value = memories.value.filter(m => m.id !== id)

    Swal.fire({
      title:
        status === 1
          ? t('guardian.moderation.approved')
          : t('guardian.moderation.rejected'),
      icon: 'success',
      timer: 1200,
      showConfirmButton: false
    })

  } catch (err) {
    console.error(err)

    Swal.fire(
      'Error',
      t('guardian.moderation.errorModerate'),
      'error'
    )
  }
}

onMounted(fetchMemories)
</script>