<template>
  <v-card class="pa-4  d-flex flex-column justify-space-between" color="#2A2A2A">
    <!-- Título e Filtros -->
    <v-card-title class="pa-0 mb-4 text-white">FILTERS</v-card-title>

    <!-- OWNED e WISHLIST -->
    <v-row class="" dense>
      <v-col cols=12> <v-btn block size="small" rounded="lg" color="primary" @click="filter = 'all'">Show All</v-btn>
      </v-col>
      <v-col cols="6">
        <v-btn block size="small" rounded="lg" color="#0E7576" variant="flat" @click="filter = 'owned'">Owned</v-btn>
      </v-col>
      <v-col cols="6">
        <v-btn block size="small" rounded="lg" color="#947A11" variant="flat" @click="filter = 'wishlist'">Wishlist</v-btn>
      </v-col>
    </v-row>
  </v-card>
</template>

<script lang="ts">
export default {
  props: {
    filterStatus: String,

  },
  emits: [
    "update:filterStatus",
    "update:rewardsStatus",
    "update:selectedBox",
    "update:selectedComponentType",
    "update:selectedContent",
    "update:nameFilter", // Emitindo o evento de atualização para o nome
    "apply-filters",
  ],
};


</script>
