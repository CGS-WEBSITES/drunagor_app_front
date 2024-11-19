<template>
  <v-container class="pb-12">
    <v-row>
      <v-col cols="12" class="text-center">
        <h1 class="text-h2 font-weight-bold">LIBRARY</h1>
      </v-col>
    </v-row >
    <v-row class="bg-grey-darken-3 pa-4 rounded">
      <!-- Botão "Filters" visível apenas no mobile -->
      <v-btn
        class="d-md-none mb-4"
        color="#222222"
        block
        @click="toggleFilters"
      >
        Filters
      </v-btn>

      <!-- Coluna com os filtros -->
      <v-col
        cols="12"
        md="3"
        v-show="showFilters || isDesktop"
      >
        <v-card class="pa-4" color="#2A2A2A">
          <v-card-title class=" pa-0 mb-4" color="#2A2A2A">FILTERS</v-card-title>
          <v-card-text class="pa-0" color="#2A2A2A">
            <!-- Botões OWNED e WISHLIST -->
            <v-btn-toggle v-model="filterStatus" mandatory class="d-flex mb-4">
              <v-btn value="owned" class="w-50" color="#0E7576" height="36">
                OWNED
              </v-btn>
              <v-btn value="wishlist" class="w-50" color="#947A11" height="36">
                WISHLIST
              </v-btn>
            </v-btn-toggle>

            <v-divider class="mb-4"></v-divider>
            <!-- Título DRUNAGOR APP -->
            <v-card-title class="pa-0 mb-2" color="#2A2A2A">DRUNAGOR APP</v-card-title>

            <!-- Botões REWARDS OWNED e ALL REWARDS -->
            <v-btn-toggle v-model="rewardsStatus" mandatory class="d-flex mb-4">
              <v-btn
                value="rewards_owned"
                class="w-50"
                color="#5D3C76"
                height="36"
                style="font-size: 12px;"
              >
                REWARDS OWNED
              </v-btn>
              <v-btn
                value="all_rewards"
                class="w-50"
                color="#5D3C76"
                height="36"
                style="font-size: 12px;"
              >
                ALL REWARDS
              </v-btn>
            </v-btn-toggle>

            <!-- Select de BOXES -->
            <v-select
              label="BOXES"
              :items="boxOptions"
              v-model="selectedBox"
              outlined
              dense
              class="mb-4"
              color="grey-darken-3"
            ></v-select>

            <!-- COMPONENT TYPE -->
            <v-checkbox
              label="COMPONENT TYPE"
              v-model="componentChecked"
              hide-details
              dense
              class="mb-2"
              color="white"
            ></v-checkbox>
            <v-select
              label="COMPONENT TYPE"
              :items="componentChecked ? componentTypes : ['[NONE]']"
              v-model="selectedComponentType"
              outlined
              dense
              class="mb-4"
              color="grey-darken-3"
            ></v-select>

            <!-- CONTENT -->
            <v-checkbox
              label="CONTENT"
              v-model="contentChecked"
              hide-details
              dense
              class="mb-2"
              color="white"
            ></v-checkbox>
            <v-select
              label="CONTENT"
              :items="contentChecked ? contentOptions : ['[NONE]']"
              v-model="selectedContent"
              outlined
              dense
              class="mb-4"
              color="grey-darken-3"
            ></v-select>

            <!-- NAME -->
            <v-select
              label="NAME"
              :items="nameOptions"
              v-model="selectedName"
              outlined
              dense
              class="mb-4"
              color="grey-darken-3"
            ></v-select>

            <!-- Botão APPLY -->
            <v-btn class="mt-4" color="#FFFFFF" block height="36">
              APPLY
            </v-btn>
          </v-card-text>
        </v-card>
      </v-col>
      

      <!-- Galeria de Produtos -->
      <v-col cols="12" md="9">
        <v-row>
          <v-col cols="12" sm="6" md="4" v-for="item in filteredProducts" :key="item.id">
            <v-card  color="#2A2A2A">
              <v-img src="@/assets/bg_apoc.png" height="200px" class="opacity-80 " ></v-img>
              <v-card-title>{{ item.name }}</v-card-title>
              <v-card-subtitle>
                <v-checkbox
                  label="CONTENT"
                  v-model="item.contentChecked"
                  hide-details
                ></v-checkbox>
                <v-checkbox
                  label="COMPONENT TYPE"
                  v-model="item.componentChecked"
                  hide-details
                ></v-checkbox>
              </v-card-subtitle>
            </v-card>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>


  
<script lang="ts">
import { defineComponent, ref, computed, onMounted } from 'vue';

export default defineComponent({
  name: 'LibraryPage',
  setup() {
    const filterStatus = ref('owned');
    const rewardsStatus = ref('rewards_owned');
    const selectedBox = ref('');
    const selectedComponentType = ref('');
    const selectedContent = ref('');
    const selectedName = ref('A - Z');

    // Estado dos checkboxes
    const componentChecked = ref(false);
    const contentChecked = ref(false);

    // Opções para os selects
    const boxOptions = [
      'Apocalypse',
      'Awakenings',
      'Companions and Furnitures',
      'Corebox',
      'Desert of Hellscar',
      'Fallen Sister',
      'Four Horseman',
      'Handuriel',
      'Hero Pack',
      'LordWrath',
      'Lorien',
      'Monster Pack',
      'Rise of the Undead Dragon',
      'Ruin of Luccanor',
      'Shadow World',
      'Spoils of War',
    ];

    const contentOptions = ['Core', 'Cosmetic', 'Game Content'];

    const componentTypes = [
      'Books',
      'Cards',
      'Doors',
      'Maps',
      'Playerboards',
      'Punchboards',
      'Scorepad',
      'Miniatures',
      'Trays',
      'Dice, Cubes & More',
    ];

    const nameOptions = ['A - Z', 'Z - A'];

    const products = ref([
      {
        id: 1,
        name: 'Product Name',
        contentChecked: false,
        componentChecked: false,
      },
      {
        id: 2,
        name: 'Product Name',
        contentChecked: false,
        componentChecked: false,
      },
      {
        id: 3,
        name: 'Product Name',
        contentChecked: false,
        componentChecked: false,
      },
    ]);

    const filteredProducts = ref(products.value);

    function applyFilters() {
      filteredProducts.value = products.value.filter((product) => {
        const matchesBox = boxOptions.includes(selectedBox.value);
        const matchesContent =
          selectedContent.value === '[NONE]' || contentOptions.includes(selectedContent.value);
        const matchesComponent =
          selectedComponentType.value === '[NONE]' ||
          componentTypes.includes(selectedComponentType.value);
        return matchesBox && matchesContent && matchesComponent;
      });
    }

    const showFilters = ref(false);

    const isDesktop = computed(() => window.innerWidth >= 960);

    const toggleFilters = () => {
      showFilters.value = !showFilters.value;
    };

    const handleResize = () => {
      showFilters.value = isDesktop.value;
    };

    onMounted(() => {
      window.addEventListener('resize', handleResize);
      handleResize();
    });

    return {
      filterStatus,
      rewardsStatus,
      selectedBox,
      selectedComponentType,
      selectedContent,
      selectedName,
      componentChecked,
      contentChecked,
      boxOptions,
      contentOptions,
      componentTypes,
      nameOptions,
      products,
      filteredProducts,
      applyFilters,
      showFilters,
      isDesktop,
      toggleFilters,
    };
  },
});
</script>
