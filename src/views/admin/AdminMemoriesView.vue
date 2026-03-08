<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12">
        <v-card border flat class="rounded-xl">
          <v-card-title class="d-flex align-center flex-wrap ga-2 pa-4">
            <v-icon icon="mdi-message-draw" class="mr-3" />
            {{ t('admin.memories.title') }}
            <v-spacer />
            <v-text-field
              v-model="search"
              prepend-inner-icon="mdi-magnify"
              :label="t('admin.memories.filter')"
              hide-details variant="solo" density="compact"
              class="w-100 w-sm-auto" style="max-width: 300px;"
            />
          </v-card-title>

          <div style="overflow-x: auto;">
          <v-table class="pa-2">
            <thead>
              <tr>
                <th>{{ t('admin.memories.colDeceased') }}</th>
                <th>{{ t('admin.memories.colMessage') }}</th>
                <th>{{ t('admin.memories.colType') }}</th>
                <th>{{ t('admin.memories.colDate') }}</th>
                <th>{{ t('admin.memories.colActions') }}</th>
              </tr>
            </thead>
            <tbody>
              <MemoryRow
                v-for="item in filteredMemories"
                :key="item.id"
                :memory="item"
                @approve="updateStatus(item.id, 1)"
                @reject="updateStatus(item.id, 2)"
              />
            </tbody>
          </v-table>
          </div>

          <v-alert v-if="store.memories.length === 0 && !store.loading" type="info" variant="tonal" class="ma-4">
            {{ t('admin.memories.noPending') }}
          </v-alert>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useMemoryStore } from '@/stores/memoryStore'
import { useUiStore } from '@/stores/uiStore'
import MemoryRow from '@/components/admin/MemoryRow.vue'

const { t } = useI18n()
const store = useMemoryStore()
const ui = useUiStore()
const search = ref('')

const filteredMemories = computed(() =>
  store.memories.filter(m =>
    m.deceasedName?.toLowerCase().includes(search.value.toLowerCase()) ||
    m.textContent?.toLowerCase().includes(search.value.toLowerCase())
  )
)

async function updateStatus(id: number, status: number) {
  try {
    await store.updateMemoryStatus(id, status)
    ui.notify(status === 1 ? t('admin.memories.approvedOk') : t('admin.memories.rejectedOk'), 'success')
  } catch {
    ui.notify(t('admin.memories.errorAction'), 'error')
  }
}

onMounted(() => store.fetchPendingMemories())
</script>