<template>
  <v-container fluid>
    <v-card border flat class="rounded-xl pa-4">
      <v-card-title class="d-flex align-center flex-wrap ga-2">
        <v-btn
          v-if="deceasedId"
          icon="mdi-arrow-left"
          variant="text"
          size="small"
          class="mr-1"
          to="/guardian/my-memorials"
        />
        <v-icon icon="mdi-shield-check" class="mr-2" />
        <span>{{ t('guardian.moderation.title') }}</span>

        <!-- Chip con el nombre del difunto cuando se filtra -->
        <v-chip
          v-if="deceasedName"
          color="primary"
          variant="tonal"
          size="small"
          class="ml-2"
          prepend-icon="mdi-account"
        >
          {{ deceasedName }}
        </v-chip>

        <v-spacer />

        <v-text-field
          v-model="search"
          prepend-inner-icon="mdi-magnify"
          :label="t('guardian.moderation.filter')"
          density="compact" hide-details
          class="w-100 w-sm-auto" style="max-width: 320px;"
          variant="solo"
        />
      </v-card-title>

      <v-divider class="my-4" />
      <v-progress-linear v-if="store.loading" indeterminate color="primary" class="mb-4" />

      <div style="overflow-x: auto;">
      <v-table v-else>
        <thead>
          <tr>
            <th v-if="!deceasedId">{{ t('guardian.moderation.colDeceased') }}</th>
            <th>{{ t('guardian.moderation.colMessage') }}</th>
            <th>{{ t('guardian.moderation.colType') }}</th>
            <th>{{ t('guardian.moderation.colDate') }}</th>
            <th>{{ t('guardian.moderation.colActions') }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="memory in filteredMemories" :key="memory.id">
            <td v-if="!deceasedId">{{ memory.deceasedName }}</td>
            <td class="text-truncate" style="max-width: 420px;">
              {{ memory.textContent || memory.mediaURL || t('common.noContent') }}
            </td>
            <td>{{ getTypeLabel(memory.type) }}</td>
            <td>{{ formatDate(memory.createdDate) }}</td>
            <td>
              <div class="d-flex ga-2">
                <v-btn size="small" color="success" @click="moderate(memory.id, 1)">
                  {{ t('guardian.moderation.approve') }}
                </v-btn>
                <v-btn size="small" color="error" variant="tonal" @click="moderate(memory.id, 2)">
                  {{ t('guardian.moderation.reject') }}
                </v-btn>
              </div>
            </td>
          </tr>
        </tbody>
      </v-table>
      </div>

      <v-alert v-if="!store.loading && filteredMemories.length === 0" type="info" variant="tonal" class="mt-4">
        {{ t('guardian.moderation.noPending') }}
      </v-alert>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useMemoryStore } from '@/stores/memoryStore'
import { useUiStore } from '@/stores/uiStore'

const props = defineProps<{ deceasedId?: string }>()

const { t } = useI18n()
const store = useMemoryStore()
const ui = useUiStore()
const search = ref('')

const numericDeceasedId = computed(() =>
  props.deceasedId ? Number(props.deceasedId) : undefined
)

// Nombre del difunto — se extrae del primer recuerdo que coincida
const deceasedName = computed(() => {
  if (!numericDeceasedId.value) return ''
  return store.memories.find(m => m.deceasedId === numericDeceasedId.value)?.deceasedName ?? ''
})

const filteredMemories = computed(() =>
  store.memories.filter(m => {
    // Filtro por difunto en el frontend
    if (numericDeceasedId.value && m.deceasedId !== numericDeceasedId.value) return false

    // Filtro por buscador de texto
    const term = search.value.trim().toLowerCase()
    if (!term) return true
    return m.deceasedName.toLowerCase().includes(term) ||
      (m.textContent ?? '').toLowerCase().includes(term)
  })
)

function getTypeLabel(type: number | string | undefined) {
  const val = type === undefined ? '' : String(type)
  if (val === '1' || val === 'Condolence') return t('common.condolence')
  if (val === '2' || val === 'Anecdote')   return t('common.anecdote')
  if (val === '3' || val === 'Photo')      return t('common.photo')
  return val ? t('common.unknown') : '—'
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString()
}

async function moderate(id: number, status: 1 | 2) {
  try {
    await store.updateMemoryStatus(id, status)
    ui.notify(status === 1 ? t('guardian.moderation.approvedOk') : t('guardian.moderation.rejectedOk'), 'success')
  } catch {
    ui.notify(t('guardian.moderation.errorAction'), 'error')
  }
}

// Siempre carga todos los recuerdos pendientes, el filtrado es local
watch(() => props.deceasedId, () => store.fetchPendingMemories())

onMounted(() => store.fetchPendingMemories())
</script>