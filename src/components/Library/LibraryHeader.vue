<template>
  <v-container>
    <!-- Cabeçalho -->
    <LibraryHeader />

    <!-- Filtros -->
    <LibraryFilters @filter="handleFilter" />

    <!-- Lista de Produtos -->
    <v-row class="mt-4">
      <v-col
        cols="12"
        sm="6"
        md="4"
        v-for="product in filteredProducts"
        :key="product.id"
        class="d-flex justify-center"
      >
        <ProductCard
          :product="product"
          @view-details="handleViewDetails"
        />
      </v-col>
    </v-row>

    <!-- Diálogo para detalhes do produto -->
    <v-dialog v-model="dialogVisible" max-width="500px">
      <v-card>
        <v-card-title>
          <h2 class="text-h5">{{ selectedProduct?.name }}</h2>
        </v-card-title>
        <v-card-text>
          <p>{{ selectedProduct?.description }}</p>
          <p><strong>Price:</strong> ${{ selectedProduct?.price }}</p>
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" text @click="dialogVisible = false">
            Close
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup>
import { ref, computed } from "vue";

// Importando os componentes
import LibraryHeader from "@/components/Library/LibraryHeader.vue";
import LibraryFilters from "@/components/Library/Filters.vue";
import ProductCard from "@/components/Library/ProductCard.vue";

// Lista de produtos fictícia
const products = ref([
  { id: 1, name: "Product A", description: "Description A", price: 100 },
  { id: 2, name: "Product B", description: "Description B", price: 150 },
  { id: 3, name: "Product C", description: "Description C", price: 200 },
]);

// Estado
const selectedProduct = ref(null);
const dialogVisible = ref(false);
const filters = ref({});

// Métodos
const handleFilter = (newFilters) => {
  filters.value = newFilters;
};

const handleViewDetails = (product) => {
  selectedProduct.value = product;
  dialogVisible.value = true;
};

// Computed para produtos filtrados
const filteredProducts = computed(() => {
  // Aqui você pode adicionar lógica para filtrar os produtos com base nos filtros aplicados
  return products.value;
});
</script>
