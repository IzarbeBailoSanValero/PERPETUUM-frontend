<!--hijo-->
<template>
  <div class="d-flex align-center py-2">
    <v-avatar color="surface-variant" size="40" class="mr-3">
      <v-icon color="primary">mdi-account-heart</v-icon>
    </v-avatar>
    
    <div>
      <div class="text-subtitle-1 font-weight-bold">{{ item.name }}</div>
      <div class="text-caption text-medium-emphasis">
        <v-icon size="12" class="mr-1">mdi-email</v-icon>{{ item.email }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  item: {
    name: string;
    email: string;
  }
}>()
</script>