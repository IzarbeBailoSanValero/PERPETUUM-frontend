<template>
  <v-container>
    <v-row class="text-center py-10">
      <v-col cols="12">
        <h1 class="text-h2 font-weight-bold mb-4">{{ t('home.title') }}</h1>
        <p class="text-h6 text-medium-emphasis">{{ t('home.subtitle') }}</p>
      </v-col>
    </v-row>

    <v-card class="pa-4 mb-8 rounded-xl" elevation="2" variant="outlined">
      <v-row align="center">
        <v-col cols="12" md="4">
          <v-text-field
            v-model="searchParams.Name"
            :label="t('home.labelName')"
            prepend-inner-icon="mdi-magnify"
            variant="underlined"
            hide-details clearable
            @keyup.enter="executeSearch"
            @click:clear="resetAndSearch"
          />
        </v-col>
        <v-col cols="12" md="3">
          <v-text-field
            v-model="searchParams.DeathYear"
            :label="t('home.labelYear')"
            prepend-inner-icon="mdi-calendar"
            type="number"
            variant="underlined"
            hide-details clearable
            @keyup.enter="executeSearch"
            @click:clear="resetAndSearch"
          />
        </v-col>
        <v-col cols="12" md="3">
          <v-select
            v-model="searchParams.SortBy"
            :items="sortOptions"
            item-title="title"
            item-value="value"
            :label="t('home.labelSort')"
            variant="underlined"
            hide-details
            @update:modelValue="resetAndSearch"
          />
        </v-col>
        <v-col cols="12" md="2">
          <v-btn color="primary" block @click="executeSearch" :loading="store.loading">
            {{ t('home.btnSearch') }}
          </v-btn>
        </v-col>
      </v-row>
    </v-card>

    <v-row v-if="store.deceasedList.length > 0">
      <v-col v-for="item in store.deceasedList" :key="item.id" cols="12" sm="6" md="4">
        <v-hover v-slot="{ isHovering, props }">
          <v-card v-bind="props" :elevation="isHovering ? 12 : 2" class="rounded-xl transition-swing" :to="'/memorial/' + item.id">
            <div class="card-image-1-1">
              <v-img :src="item.photoURL" cover referrerpolicy="no-referrer">
                <template v-slot:placeholder>
                  <div class="w-100 h-100 d-flex align-center justify-center bg-surface-variant">
                    <v-icon size="60" color="secondary">mdi-image-off</v-icon>
                  </div>
                </template>
              </v-img>
            </div>
            <v-card-title>{{ item.name }}</v-card-title>
            <v-card-subtitle>{{ formatDate(item.deathDate) }}</v-card-subtitle>
          </v-card>
        </v-hover>
      </v-col>
    </v-row>

    <v-row justify="center" class="mt-8" v-if="store.deceasedList.length > 0">
      <v-pagination v-model="searchParams.Page" :length="store.totalPages"
        @update:modelValue="executeSearch" active-color="primary" />
    </v-row>

    <v-row v-else-if="!store.loading" justify="center" class="mt-10">
      <v-col cols="12" class="text-center">
        <v-icon size="64" color="secondary">mdi-account-search-outline</v-icon>
        <p class="text-medium-emphasis mt-4">{{ t('home.noResults') }}</p>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { reactive, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useMemorialStore } from '@/stores/memorialStore'

const { t } = useI18n()
const store = useMemorialStore()

const sortOptions = computed(() => [
  { title: t('home.sortRecent'), value: 'DeathDate|DESC' },
  { title: t('home.sortOldest'), value: 'DeathDate|ASC'  },
  { title: t('home.sortAZ'),     value: 'Name|ASC'       }
])

const searchParams = reactive({
  Name: '', DeathYear: null, SortBy: 'DeathDate|DESC',
  SortOrder: 'DESC', Page: 1, PageSize: 9
})

function executeSearch() {
  const [sortBy, sortOrder] = (searchParams.SortBy as string).split('|')
  store.fetchAdvancedSearch({ ...searchParams, SortBy: sortBy, SortOrder: sortOrder })
}

function resetAndSearch() {
  searchParams.Page = 1
  executeSearch()
}

const formatDate = (date: string) => new Date(date).getFullYear()

onMounted(() => executeSearch())
</script>

<style scoped>
.card-image-1-1 { aspect-ratio: 1 / 1; overflow: hidden; width: 100%; }
.card-image-1-1 :deep(.v-img) { width: 100%; height: 100%; object-fit: cover; }
</style>