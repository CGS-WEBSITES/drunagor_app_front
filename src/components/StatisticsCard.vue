<template>
  <v-container max-width="800" style="min-width: 360px;" class="pa-4">
    <v-card rounded="lg" elevation="3" class="pa-0">
      <!-- Título -->
      <v-card-title class="text-uppercase text-bold text-h6 mb-4">
        {{ title }}
      </v-card-title>

      <v-card-text class="py-0">
    <v-row v-for="(stat, index) in stats" :key="index" class="mb-0">
    <v-col cols="12" class="py-0">
      <!-- Categoria -->
      <p class="text-h6 text-bold m-0">{{ stat.category }}</p>
      <!-- Nome da Estatística -->
      <p class="text-body-2 grey--text m-0">{{ stat.name }}</p>
    </v-col>
  </v-row>
</v-card-text>

<v-card-actions class="justify-end py-0">
  <p class="text-caption grey--text m-0">USER SINCE: {{ userSince }}</p>
</v-card-actions>


    </v-card>
  </v-container>
</template>

<script lang="ts" setup>
import { defineProps } from 'vue';

// Props para configurar o componente
defineProps({
  title: {
    type: String,
    required: true,
    default: 'STATISTICS',
  },
  stats: {
    type: Array,
    required: true,
    default: () => [],
  },
  userSince: {
    type: String,
    required: true,
    default: '',
  },
});
</script>