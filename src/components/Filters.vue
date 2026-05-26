<template>
  <v-card class="pa-4 h-100 d-flex flex-column justify-space-between bg-transparent" elevation="0">
    <!-- Título e Filtros -->
    <div>
      <v-card-text class="pa-0">
        <!-- OWNED e WISHLIST -->
        <v-row class="mb-4" dense>
          <v-col cols="4">
            <v-btn
              block
              size="small"  
              rounded="lg"
              :color="filterStatus === 'all' || !filterStatus ? 'white' : 'grey'"
              :variant="filterStatus === 'all' || !filterStatus ? 'flat' : 'outlined'"
              @click="$emit('update:filterStatus', 'all')"
              class="text--caption px-1"  
              :style="{ whiteSpace: 'normal', fontSize: '10px' }"
            >
              ALL
            </v-btn>
          </v-col>
          <v-col cols="4">
            <v-btn
              block
              size="small"  
              rounded="lg"
              :color="filterStatus === 'owned' ? '#0E7576' : 'grey'"
              :variant="filterStatus === 'owned' ? 'flat' : 'outlined'"
              @click="$emit('update:filterStatus', 'owned')"
              class="text--caption px-1"  
              :style="{ whiteSpace: 'normal', fontSize: '10px', color: filterStatus === 'owned' ? 'white' : 'inherit' }"
            >
              OWNED
            </v-btn>
          </v-col>
          <v-col cols="4">
            <v-btn
              block
              size="small"  
              rounded="lg"
              :color="filterStatus === 'wishlist' ? '#947A11' : 'grey'"
              :variant="filterStatus === 'wishlist' ? 'flat' : 'outlined'"
              @click="$emit('update:filterStatus', 'wishlist')"
              class="text--caption px-1"  
              :style="{ whiteSpace: 'normal', fontSize: '10px', color: filterStatus === 'wishlist' ? 'white' : 'inherit' }"
            >
              WISH
            </v-btn>
          </v-col>
        </v-row>



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
  </v-card>
</template>

<script lang="ts">
export default {
  props: {
    filterStatus: String,
    nameFilter: String,
    nameOptions: Array,
  },
  emits: [
    "update:filterStatus",
    "update:nameFilter",
  ],
};
</script>
