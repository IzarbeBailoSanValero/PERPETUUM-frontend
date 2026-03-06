<template>
  <v-navigation-drawer permanent elevation="2" color="primary">

    <v-list class="pa-4">
      <v-list-item title="PERPETUUM" :subtitle="t('sidebar.admin.panel')" prepend-icon="mdi-infinity" />
    </v-list>

    <v-divider />

    <v-list nav>
      <v-list-item prepend-icon="mdi-view-dashboard" :title="t('sidebar.admin.dashboard')" to="/admin/dashboard" />
      <v-list-item prepend-icon="mdi-message-draw"   :title="t('sidebar.admin.moderation')" to="/admin/memories" />

      <v-list-group value="Management">
        <template v-slot:activator="{ props }">
          <v-list-item v-bind="props" prepend-icon="mdi-database" :title="t('sidebar.admin.entities')" />
        </template>

        <v-list-item prepend-icon="mdi-grave-stone"      :title="t('sidebar.admin.deceased')"     to="/admin/deceased" />
        <v-list-item prepend-icon="mdi-account-heart"    :title="t('sidebar.admin.guardians')"    to="/admin/guardians" />
        <v-list-item prepend-icon="mdi-account-hard-hat" :title="t('sidebar.admin.staff')"        to="/admin/staff" />
        <v-list-item prepend-icon="mdi-office-building"  :title="t('sidebar.admin.funeralHomes')" to="/admin/funeral-homes" />
      </v-list-group>
    </v-list>

    <!-- Controles de tema e idioma al pie del sidebar -->
    <template v-slot:append>
      <v-divider />
      <div class="d-flex justify-center align-center gap-1 pa-3">
        <ThemeToggle />
        <LangToggle />
      </div>
    </template>

  </v-navigation-drawer>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import ThemeToggle from '@/components/ui/ThemeToggle.vue'
import LangToggle from '@/components/ui/LangToggle.vue'

const { t } = useI18n()
</script>