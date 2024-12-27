<template>
  <v-container class="pb-12">
 <!-- Navigation Drawer -->
     
    <v-row> 
      <v-col cols="12" class="text-center">
        <h1 class="text-h2 font-weight-bold pt-14">LIBRARY</h1>
      </v-col>
    </v-row>
    <v-row class="bg-grey-darken-3 pa-4 rounded">
      <!-- Botão de Filtros no Mobile -->
      <v-btn class="d-md-none mb-4" color="#222222" block @click="toggleFilters">
        Filters
      </v-btn>

      <!-- Filtros -->
      <v-col cols="12" md="3" v-show="showFilters || isDesktop">
        <Filters
          v-model:filterStatus="filterStatus"
          v-model:rewardsStatus="rewardsStatus"
          v-model:selectedBox="selectedBox"
          v-model:componentChecked="componentChecked"
          v-model:selectedComponentType="selectedComponentType"
          v-model:contentChecked="contentChecked"
          v-model:selectedContent="selectedContent"
          :box-options="boxOptions"
          :content-options="contentOptions"
          :component-types="componentTypes"
          @apply-filters="applyFilters"
        />
      </v-col>

      <!-- Galeria de Produtos -->
      <v-col cols="12" md="9">
        <ProductGallery
          :products="paginatedProducts"
          @open-dialog="openDialog"
        />
        <!-- Paginação -->
        <v-row justify="center" class="mt-4">
          <v-pagination
            v-model="currentPage"
            :length="totalPages"
            color="primary"
          ></v-pagination>
        </v-row>
      </v-col>
    </v-row>

    <!-- Diálogo para itens do tipo "item" -->
    <ItemDialog
      v-if="itemDialogVisible"
      v-model="itemDialogVisible"
      :product="selectedProduct"
    />

    <!-- Diálogo padrão para outros produtos -->
    <ProductDialog
      v-if="dialogVisible"
      v-model="dialogVisible"
      :product="selectedProduct"
    />
  </v-container>
</template>

<script>
import { defineComponent, ref, computed, onMounted } from "vue";
import Filters from "@/components/Library/Filters.vue";
import ProductGallery from "@/components/Library/ProductGallery.vue";
import ProductDialog from "@/components/Library/ProductDialog.vue";
import ItemDialog from "@/components/Library/ItemDialog.vue";

export default defineComponent({
  name: "Library",
  components: { Filters, ProductGallery, ProductDialog, ItemDialog },
  setup() {
    const filterStatus = ref("owned");
    const rewardsStatus = ref("rewards_owned");
    const selectedBox = ref("");
    const componentChecked = ref(false);
    const selectedComponentType = ref("");
    const contentChecked = ref(false);
    const selectedContent = ref("");
    const dialogVisible = ref(false);
    const itemDialogVisible = ref(false);
    const selectedProduct = ref(null);

    const products = ref([
      { id: 1, name: "Companions and Furnitures", description: "Product 1", price: 100,  image: new URL("@/assets/apoc.png", import.meta.url).href,},
      { id: 2, name: "Item with lore in aodarkness", description: "Product 2", price: 150,  image: new URL("@/assets/apoc.png", import.meta.url).href, },
      { id: 3, name: "Desert of Hellscar", description: "Product 3", price: 200 ,  image: new URL("@/assets/apoc.png", import.meta.url).href,},
      { id: 4, name: "New Expansion Set", description: "Product 4", price: 250,  image: new URL("@/assets/apoc.png", import.meta.url).href, },
      { id: 5, name: "Bosses of Darkness", description: "Product 5", price: 300,  image: new URL("@/assets/apoc.png", import.meta.url).href, },
      { id: 6, name: "Ancient Relics", description: "Product 6", price: 350,  image: new URL("@/assets/apoc.png", import.meta.url).href, },
      { id: 7, name: "Dark Crystals", description: "Product 7", price: 400,  image: new URL("@/assets/apoc.png", import.meta.url).href, },
      { id: 8, name: "Lightbringer Set", description: "Product 8", price: 450,  image: new URL("@/assets/apoc.png", import.meta.url).href, },
      { id: 9, name: "Shadow of the Past", description: "Product 9", price: 500,  image: new URL("@/assets/apoc.png", import.meta.url).href, },
      { id: 10, name: "Fury of the Storm", description: "Product 10", price: 550,  image: new URL("@/assets/apoc.png", import.meta.url).href, },
      { id: 11, name: "Ancient Guardians", description: "Product 11", price: 600 ,  image: new URL("@/assets/apoc.png", import.meta.url).href,},
      { id: 12, name: "Rise of the Phoenix", description: "Product 12", price: 650,  image: new URL("@/assets/apoc.png", import.meta.url).href, },
    ]);

    const currentPage = ref(1);
    const itemsPerPage = ref(6);

    const filteredProducts = ref(products.value);
 
    const paginatedProducts = computed(() => {
      const start = (currentPage.value - 1) * itemsPerPage.value;
      const end = start + itemsPerPage.value;
      return filteredProducts.value.slice(start, end);
    });

    const totalPages = computed(() =>
      Math.ceil(filteredProducts.value.length / itemsPerPage.value)
    );

    const boxOptions = [
      "Companions and Furnitures",
      "AoDarkness",
      "Desert of Hellscar",
    ];
    const contentOptions = ["Core", "Cosmetic", "Game Content"];
    const componentTypes = ["Books", "Cards", "Miniatures", "Maps", " Doors", "Playerboards", "Punchboards", "Scorepad", "Trays"];
    const nameFilter = ["A-Z", "Z-A"];

    const showFilters = ref(false);
    const isDesktop = computed(() => window.innerWidth >= 960);

    const toggleFilters = () => {
      showFilters.value = !showFilters.value;
    };

    const applyFilters = () => {
      filteredProducts.value = products.value.filter((product) => {
        const matchesBox =
          !selectedBox.value || product.box === selectedBox.value;

        const matchesComponentType =
          !componentChecked.value ||
          (!selectedComponentType.value || product.componentType === selectedComponentType);

        const matchesContentType =
          !contentChecked.value ||
          (!selectedContent.value || product.contentType === selectedContent);

        return matchesBox && matchesComponentType && matchesContentType;
      });
    };

    const openDialog = (product) => {
      selectedProduct.value = product;
      if (product.type === "item") {
        itemDialogVisible.value = true;
      } else {
        dialogVisible.value = true;
      }
    };

    

    onMounted(() => {
      const handleResize = () => {
        showFilters.value = isDesktop.value;
      };
      window.addEventListener("resize", handleResize);
      handleResize();
    });

    return {
      filterStatus,
      rewardsStatus,
      selectedBox,
      componentChecked,
      selectedComponentType,
      contentChecked,
      selectedContent,
      boxOptions,
      contentOptions,
      componentTypes,
      dialogVisible,
      itemDialogVisible,
      selectedProduct,
      products,
      filteredProducts,
      paginatedProducts,
      currentPage,
      totalPages,
      itemsPerPage,
      applyFilters,
      toggleFilters,
      showFilters,
      isDesktop,
      openDialog,
    };
  },
});
</script>
