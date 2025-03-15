<template>
  <v-card class="pa-4 h-100 d-flex flex-column justify-space-between" color="#2A2A2A">
    <!-- Título e Filtros -->
    <div>
      <v-card-title class="pa-0 mb-4 text-white">FILTERS</v-card-title>
      <v-card-text class="pa-0">
        <!-- OWNED e WISHLIST -->
        <v-row class="mb-4" dense>
          <v-col cols="6">
            <v-btn
              block
              size="small"  
              rounded="lg"
              color="#0E7576"
              variant="flat"
              @click="$emit('update:filterStatus', 'owned')"
              class="text--sm"  
              :style="{ whiteSpace: 'normal' }"
            >
              OWNED
            </v-btn>
          </v-col>
          <v-col cols="6">
            <v-btn
              block
              size="small"  
              rounded="lg"
              color="#947A11"
              variant="flat"
              @click="$emit('update:filterStatus', 'wishlist')"
              class="text--sm"  
              :style="{ whiteSpace: 'normal' }"
            >
              WISHLIST
            </v-btn>
          </v-col>
        </v-row>

        <v-divider class="mb-4"></v-divider>

        <!-- DRUNAGOR APP -->
        <v-card-subtitle class="pa-0 mb-2 text-white text-uppercase">
          Drunagor App
        </v-card-subtitle>

        <!-- REWARDS -->
        <v-row class="mb-4" dense>
          <v-col cols="6">
            <v-btn
              block
              size="small"  
              rounded="lg"
              color="#5D3C76"
              variant="flat"
              @click="$emit('update:rewardsStatus', 'rewards_owned')"
              class="text--sm"  
              :style="{ whiteSpace: 'normal' }"
            >
              REWARDS OWNED
            </v-btn>
          </v-col>
          <v-col cols="6">
            <v-btn
              block
              size="small"  
              rounded="lg"
              color="#5D3C76"
              variant="flat"
              @click="$emit('update:rewardsStatus', 'all_rewards')"
              class="text--sm"  
              :style="{ whiteSpace: 'normal' }"
            >
              ALL REWARDS
            </v-btn>
          </v-col>
        </v-row>

        <!-- BOXES -->
        <v-select
          :model-value="selectedBox"
          @update:model-value="$emit('update:selectedBox', $event)"
          label="BOXES"
          :items="boxOptions"
          variant="outlined"
          density="compact"
          class="mb-4"
          color="grey-darken-3"
        ></v-select>

        <!-- COMPONENT TYPE -->
        <div class="d-flex align-center mb-2">
          <v-icon class="mr-2" color="white">mdi-shape</v-icon>
          <span class="white--text">COMPONENT TYPE</span>
        </div>
        <v-select
          :model-value="selectedComponentType"
          @update:model-value="$emit('update:selectedComponentType', $event)"
          label="COMPONENT TYPE"
          :items="componentTypes"
          variant="outlined"
          density="compact"
          class="mb-4"
          color="grey-darken-3"
        ></v-select>

        <!-- CONTENT -->
        <div class="d-flex align-center mb-2">
          <v-icon class="mr-2" color="white">mdi-content-save</v-icon>
          <span class="white--text">CONTENT</span>
        </div>
        <v-select
          :model-value="selectedContent"
          @update:model-value="$emit('update:selectedContent', $event)"
          label="CONTENT"
          :items="contentOptions"
          variant="outlined"
          density="compact"
          class="mb-4"
          color="grey-darken-3"
        ></v-select>

        <!-- NOME (Agora um v-select, igual aos outros filtros) -->
        <div class="d-flex align-center mb-2">
          <v-icon class="mr-2" color="white">mdi-filter-outline</v-icon>
          <span class="white--text">NAME</span>
        </div>
        <v-select
          :model="nameFilter"
          @update:model-value="$emit('update:nameFilter', $event)"
          label="NAME"
          :items="nameOptions"
          variant="outlined"
          density="compact"
          class="mb-4"
          color="grey-darken-3"
        ></v-select>
      </v-card-text>
    </div>

    <!-- Botão APPLY na base -->
    <v-card-actions>
      <v-btn
        block
        color="black"
        style="background-color: white;"
        size="small"  
        @click="$emit('apply-filters')"
      >
        APPLY
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
export default {
  props: {
    filterStatus: String,
    rewardsStatus: String,
    selectedBox: String,
    selectedComponentType: String,
    selectedContent: String,
    nameFilter: String,  // Adicionando a prop para o filtro de nome
    boxOptions: Array,
    contentOptions: Array,
    componentTypes: Array,
    nameOptions: Array, // Adicionando as opções para o filtro de nome
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
