<template>
    <v-container class="pb-12">
      <v-row>
        <v-col cols="12" class="text-center">
          <h1 class="text-h2 font-weight-bold">LIBRARY</h1>
        </v-col>
      </v-row>
      <v-row class="bg-grey-darken-3 pa-4 rounded">
        <v-btn class="d-md-none mb-4" color="#222222" block @click="toggleFilters">
          Filters
        </v-btn>
        <v-col cols="12" md="3" v-show="showFilters || isDesktop">
          <Filters
            :filter-status="filterStatus"
            :rewards-status="rewardsStatus"
            :selected-box="selectedBox"
            :selected-component-type="selectedComponentType"
            :selected-content="selectedContent"
            :selected-name="selectedName"
            :component-checked="componentChecked"
            :content-checked="contentChecked"
            :box-options="boxOptions"
            :content-options="contentOptions"
            :component-types="componentTypes"
            :name-options="nameOptions"
            @apply-filters="applyFilters"
          />
        </v-col>
        <v-col cols="12" md="9">
          <ProductGallery
            :products="filteredProducts"
            @open-dialog="openDialog"
          />
        </v-col>
      </v-row>
      <ProductDialog
        v-if="dialogVisible"
        :product="selectedProduct"
        :dialog-visible.sync="dialogVisible"
        @update-product="updateSelectedProduct"
      />
    </v-container>
  </template>
  
  <script>
  import { defineComponent, ref, computed, onMounted } from "vue";
  import Filters from "@/components/Filters.vue";
  import ProductGallery from "@/components/ProductGallery.vue";
  import ProductDialog from "@/components/ProductDialog.vue";
  
  export default defineComponent({
    components: { Filters, ProductGallery, ProductDialog },
    setup() {
      // Coloque aqui as funções e estados reutilizáveis
    },
  });
  </script>
  