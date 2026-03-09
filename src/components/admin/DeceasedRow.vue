<template>
  <div class="d-flex align-center py-2">
    <v-avatar size="45" color="surface-variant" class="mr-4">
      <v-img
        v-if="item.photoURL && item.photoURL.trim() !== ''"
        :src="item.photoURL"
        cover
        referrerpolicy="no-referrer"
      />
      <v-icon
        v-else
        icon="mdi-account-tie"
        size="28"
        color="secondary"
      />
    </v-avatar>

    <div>
      <div class="text-subtitle-1 font-weight-bold">
        {{ item.name }}
      </div>

    </div>

    
  </div>
</template>

<script setup lang="ts">
defineProps<{
  item: {
    id?: number
    name: string
    photoURL?: string
  }
}>()
</script>