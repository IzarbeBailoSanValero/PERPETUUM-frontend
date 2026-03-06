<template>
  <div class="d-flex align-center py-2">
    <v-avatar color="indigo-lighten-4" size="40" class="mr-3">
      <v-icon color="indigo">mdi-office-building</v-icon>
    </v-avatar>

    <div>
      <div class="text-subtitle-1 font-weight-bold">{{ item.name }}</div>
      <div class="text-caption text-grey">
        <v-icon size="12" class="mr-1">mdi-clipboard-account</v-icon>{{ item.cif }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  item: {
    name: string
    cif: string
  }
}>()
</script>