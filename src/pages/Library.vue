<template>
  <v-container class="pb-12">
    <v-row>
      <v-col cols="12" class="text-center">
        <h1 class="text-h2 font-weight-bold">LIBRARY</h1>
      </v-col>
    </v-row>
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
      <v-col cols="12" md="3" v-show="showFilters || isDesktop">
        <v-card class="pa-4" color="#2A2A2A">
          <v-card-title class="pa-0 mb-4" color="#2A2A2A">FILTERS</v-card-title>
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
            <v-card-title class="pa-0 mb-2" color="#2A2A2A"
              >DRUNAGOR APP</v-card-title
            >

            <!-- Botões REWARDS OWNED e ALL REWARDS -->
            <v-btn-toggle v-model="rewardsStatus" mandatory class="d-flex mb-4">
              <v-btn
                value="rewards_owned"
                class="w-50"
                color="#5D3C76"
                height="36"
                style="font-size: 12px"
              >
                REWARDS OWNED
              </v-btn>
              <v-btn
                value="all_rewards"
                class="w-50"
                color="#5D3C76"
                height="36"
                style="font-size: 12px"
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

      <!-- Galeria de Produtos -->
      <v-col cols="12" md="9">
        <v-row>
          <v-col
            cols="12"
            sm="6"
            md="4"
            v-for="item in filteredProducts"
            :key="item.id"
          >
            <v-card color="#2A2A2A" @click="openDialog(item)">
              <v-img
                :src="item.image || '@/assets/apoc.png'"
                height="200px"
                class="opacity-80"
              ></v-img>
              <v-card-title>{{ item.name }}</v-card-title>
              <v-card-subtitle>
                <v-checkbox
                  label="CONTENT"
                  :model-value="item.contentChecked"
                  @update:model-value="
                    (value) => updateProduct(item, 'contentChecked', value)
                  "
                  hide-details
                ></v-checkbox>
                <v-checkbox
                  label="COMPONENT TYPE"
                  :model-value="item.componentChecked"
                  @update:model-value="
                    (value) => updateProduct(item, 'componentChecked', value)
                  "
                  hide-details
                ></v-checkbox>
              </v-card-subtitle>
            </v-card>
          </v-col>
        </v-row>
      </v-col>
    </v-row>

    <v-dialog v-model="dialogVisible" max-width="900px">
      <v-card class="pa-0" color="#0F7273">
        <v-row class="ma-0 pa-0">
          <!-- Coluna Esquerda: Imagem e Botões -->
          <v-col cols="12" md="4" class="d-flex flex-column align-center pa-4">
            <!-- Imagem -->
            <v-img
              :src="selectedProduct?.image || '@/assets/apoc.png'"
              class="rounded mb-4"
              height="240px"
              width="auto"
              alt="Product Image"
            ></v-img>

            <!-- Botões ADD TO WISHLIST e MARK AS OWNED juntos -->
            <div class="w-100">
              <v-btn
                prepend-icon="mdi mdi-star-check"
                color="#B89816"
                class="mb-1"
                block
                >ADD TO WISHLIST</v-btn
              >
              <v-btn prepend-icon="mdi mdi-plus-circle" color="#139394" block
                >MARK AS OWNED</v-btn
              >
            </div>

            <!-- Botão DIGITAL FILES na parte inferior -->
            <v-spacer></v-spacer>
            <v-btn
              prepend-icon="mdi mdi-file-download-outline"
              color="#312F2F"
              block
              max-height="50px"
              density="compact"
            >
              DIGITAL FILES
            </v-btn>
          </v-col>

          <!-- Coluna Direita -->
          <v-col cols="12" md="8" class="pa-0 position-relative">
            <!-- Imagem de fundo cobrindo o v-col -->
            <v-img
              src="@/assets/Apocalypse_Cover.png"
              cover
              height="100%"
              width="100%"
              class="opacity-80 fill-height"
            >
              <!-- Conteúdo sobreposto -->
              <v-container class="text-white pa-4" fluid>
                <v-card-title class="text-h5 font-weight-bold">
                  {{ selectedProduct?.name }}
                </v-card-title>
                <v-card-subtitle class="d-flex align-center">
                  <v-checkbox
                    label="CONTENT"
                    :model-value="selectedProduct?.contentChecked"
                    @update:model-value="
                      (value) => updateSelectedProduct('contentChecked', value)
                    "
                    hide-details
                  ></v-checkbox>
                  <v-checkbox
                    label="COMPONENT TYPE"
                    :model-value="selectedProduct?.componentChecked"
                    @update:model-value="
                      (value) =>
                        updateSelectedProduct('componentChecked', value)
                    "
                    hide-details
                  ></v-checkbox>
                </v-card-subtitle>

                <div class="mt-3">
                  <!-- Informações do Produto -->
                  <div v-if="selectedProduct" class="text-white">
                    <!-- Primeira linha: EPIC ITEMS, HERO CLASS, BOSSES, HEROES -->
                    <v-row>
                      <v-col cols="12" md="3">
                        <p class="text-subtitle-2 font-weight-bold">
                          EPIC ITEMS
                        </p>
                        <p class="text-body-2">Bane of shadows</p>
                        <p class="text-body-2">Dark Piercer</p>
                        <p class="text-body-2">Dragon eye of memory</p>
                        <p class="text-body-2">Dragonclaw shield</p>
                        <p class="text-body-2">Moonlight Dagger</p>
                      </v-col>

                      <v-col cols="12" md="3">
                        <p class="text-subtitle-2 font-weight-bold">
                          HERO CLASS
                        </p>
                        <p class="text-body-2">Paladin</p>
                      </v-col>

                      <v-col cols="12" md="3">
                        <p class="text-subtitle-2 font-weight-bold">BOSSES</p>
                        <p class="text-body-2">Aral'hezec</p>
                      </v-col>

                      <v-col cols="12" md="3">
                        <p class="text-subtitle-2 font-weight-bold">HEROES</p>
                        <p class="text-body-2">Drasek</p>
                        <p class="text-body-2">Jade</p>
                      </v-col>
                    </v-row>

                    <!-- Segunda linha: WHITE MONSTERS, DOORS -->
                    <v-row>
                      <v-col cols="12" md="3">
                        <p class="text-subtitle-2 font-weight-bold">
                          WHITE MONSTERS
                        </p>
                        <p class="text-body-2">Corrupted Farmer</p>
                        <p class="text-body-2">Dark Piercer</p>
                      </v-col>

                      <v-col cols="12" md="12">
                        <p class="text-subtitle-2 font-weight-bold">DOORS</p>
                        <p class="text-body-2">
                          Door 01 - Crashing the party - Chapter 1
                        </p>
                        <p class="text-body-2">
                          Door 02 - The entrance to the citadel - Chapter 2
                        </p>
                        <p class="text-body-2">
                          Door 03 - The inner courtyard - Chapter 2
                        </p>
                        <p class="text-body-2">
                          Door 04 - The ancient throne room - Chapter 2
                        </p>
                        <p class="text-body-2">
                          Door 05 - The ascending paths - Chapter 3
                        </p>
                        <p class="text-body-2">
                          Door 06 - The room of memories - Chapter 3
                        </p>
                      </v-col>
                    </v-row>
                  </div>

                  <!-- Botão de Fechar no Final -->
                  <v-card-actions class="justify-end pa-3">
                    <v-btn
                      color="red"
                      text
                      @click="dialogVisible = false"
                      class="text-white"
                    >
                      CLOSE
                    </v-btn>
                  </v-card-actions>
                </div>
              </v-container>
            </v-img>
          </v-col>
        </v-row>
      </v-card>
    </v-dialog>

    <!-- Diálogo para itens do tipo "item" -->
    <v-dialog v-model="itemDialogVisible" max-width="900px">
      <v-card class="pa-0" color="#0F7273">
        <v-row class="ma-0 pa-0">
          <!-- Coluna Esquerda: Imagem e Botões -->
          <v-col cols="12" md="4" class="d-flex flex-column align-center pa-4">
            <!-- Imagem -->
            <v-img
              :src="selectedProduct?.image || '@/assets/apoc.png'"
              class="rounded mb-4"
              height="240px"
              width="auto"
              alt="Product Image"
            ></v-img>

            <!-- Botões ADD TO WISHLIST e MARK AS OWNED juntos -->
            <div class="w-100">
              <v-btn
                prepend-icon="mdi mdi-star-check"
                color="#B89816"
                class="mb-1"
                block
                >ADD TO WISHLIST</v-btn
              >
              <v-btn prepend-icon="mdi mdi-plus-circle" color="#139394" block
                >MARK AS OWNED</v-btn
              >
            </div>

            <!-- Botão DIGITAL FILES na parte inferior -->
            <v-spacer></v-spacer>
            <v-btn
              prepend-icon="mdi mdi-file-download-outline"
              color="#312F2F"
              block
              max-height="80px"
              density="compact"
            >
              Explore
            </v-btn>
          </v-col>

          <!-- Coluna Direita -->
          <v-col cols="12" md="8" class="pa-0 position-relative">
            <!-- Imagem de fundo cobrindo o v-col -->
            <v-img
              src="@/assets/Apocalypse_Cover.png"
              cover
              height="100%"
              width="100%"
              class="opacity-80 fill-height"
            >
              <!-- Conteúdo sobreposto -->
              <v-container class="text-white pa-4" fluid>
                <v-card-title class="text-h5 font-weight-bold">
                  {{ selectedProduct?.name }}
                </v-card-title>
                <v-card-subtitle class="d-flex align-center">
                  <v-checkbox
                    label="CONTENT"
                    :model-value="selectedProduct?.contentChecked"
                    @update:model-value="
                      (value) => updateSelectedProduct('contentChecked', value)
                    "
                    hide-details
                  ></v-checkbox>
                  <v-checkbox
                    label="COMPONENT TYPE"
                    :model-value="selectedProduct?.componentChecked"
                    @update:model-value="
                      (value) =>
                        updateSelectedProduct('componentChecked', value)
                    "
                    hide-details
                  ></v-checkbox>
                </v-card-subtitle>

                <div class="mt-3">
                  <!-- Informações do Produto -->
                  <div v-if="selectedProduct" class="text-white">
                    <!-- Primeira linha: EPIC ITEMS, HERO CLASS, BOSSES, HEROES -->

                    <!-- Segunda linha: WHITE MONSTERS, DOORS -->
                    <v-row>
                      <v-col cols="12" md="10">
                        <p class="text-subtitle-2 font-weight-bold">
                          Lorem ipsum dolor sit amet consectetur adipisicing
                          elit. Voluptatibus distinctio similique reiciendis
                          assumenda dignissimos deserunt. Inventore eum iste aut
                          exercitationem consequuntur optio, est fugit veritatis
                          cum reiciendis aperiam, labore dolore?
                        </p>
                      </v-col>
                    </v-row>
                  </div>

                  <!-- Botão de Fechar no Final -->

                  <v-card-actions class="pa-3">
                    <v-spacer></v-spacer><br /><br /><br /><br /><br /><br />
                    <v-btn
                      class="mt-auto text-white"
                      color="red"
                      text
                      @click="itemDialogVisible = false"
                    >
                      CLOSE
                    </v-btn>
                  </v-card-actions>
                </div>
              </v-container>
            </v-img>
          </v-col>
        </v-row>
      </v-card>
    </v-dialog>
  </v-container>
</template>





<script lang="ts">
import { defineComponent, ref, computed, onMounted } from "vue";

// Definição do tipo para o produto
interface Product {
  id: number;
  name: string;
  contentChecked: boolean;
  componentChecked: boolean;
  image: string;
  type: string; // Adicione esta linha
}

export default defineComponent({
  name: "LibraryPage",
  setup() {
    const dialogVisible = ref(false); // Estado para o diálogo padrão
    const itemDialogVisible = ref(false); // Estado para o diálogo de itens
    const selectedProduct = ref<Product | null>(null); // Produto selecionado

    // Função para abrir o diálogo correto com base no tipo do produto
    const openDialog = (item: Product) => {
      selectedProduct.value = item;
      if (item.type === "item") {
        // Abre o diálogo de itens
        itemDialogVisible.value = true;
      } else {
        // Abre o diálogo padrão
        dialogVisible.value = true;
      }
    };

    // Função para atualizar as propriedades de um produto na lista
    const updateProduct = (item: Product, key: string, value: any) => {
      const product = products.value.find((p) => p.id === item.id);
      if (product) {
        (product as any)[key] = value;
      }
    };

    // Função para atualizar o produto selecionado no Dialog
    const updateSelectedProduct = (key: string, value: any) => {
      if (selectedProduct.value) {
        (selectedProduct.value as any)[key] = value;
      }
    };

    // Produtos com o tipo correto
    const products = ref<Product[]>([
      {
        id: 1,
        name: "Companions and Furnitures",
        contentChecked: false,
        componentChecked: false,
        image: new URL("@/assets/apoc.png", import.meta.url).href, // Novo formato
        type: "standard",
      },
      {
        id: 2,
        name: "Item with lore in aodarkness",
        contentChecked: false,
        componentChecked: false,
        image: new URL("@/assets/apoc.png", import.meta.url).href,
        type: "item",
      },
      {
        id: 3,
        name: "Desert of Hellscar",
        contentChecked: false,
        componentChecked: false,
        image: new URL("@/assets/apoc.png", import.meta.url).href,
        type: "standard",
      },
    ]);

    const filteredProducts = ref(products.value);

    // Configuração de filtros e estado
    const filterStatus = ref("owned");
    const rewardsStatus = ref("rewards_owned");
    const selectedBox = ref("");
    const selectedComponentType = ref("");
    const selectedContent = ref("");
    const selectedName = ref("A - Z");

    const componentChecked = ref(false);
    const contentChecked = ref(false);

    const boxOptions = [
      "Apocalypse",
      "Awakenings",
      "Companions and Furnitures",
      "Corebox",
      "Desert of Hellscar",
      "Fallen Sister",
      "Four Horseman",
      "Handuriel",
      "Hero Pack",
      "LordWrath",
      "Lorien",
      "Monster Pack",
      "Rise of the Undead Dragon",
      "Ruin of Luccanor",
      "Shadow World",
      "Spoils of War",
    ];

    const contentOptions = ["Core", "Cosmetic", "Game Content"];

    const componentTypes = [
      "Books",
      "Cards",
      "Doors",
      "Maps",
      "Playerboards",
      "Punchboards",
      "Scorepad",
      "Miniatures",
      "Trays",
      "Dice, Cubes & More",
    ];

    const nameOptions = ["A - Z", "Z - A"];

    function applyFilters() {
      filteredProducts.value = products.value.filter((product) => {
        const matchesBox = boxOptions.includes(selectedBox.value);
        const matchesContent =
          selectedContent.value === "[NONE]" ||
          contentOptions.includes(selectedContent.value);
        const matchesComponent =
          selectedComponentType.value === "[NONE]" ||
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
      window.addEventListener("resize", handleResize);
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
      dialogVisible,
      itemDialogVisible,
      selectedProduct,
      openDialog,
      updateProduct,
      updateSelectedProduct,
    };
  },
});
</script>
