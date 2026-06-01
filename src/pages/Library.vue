<template>
  <v-container class="pa-0 mt-14 mt-md-16 pb-12" fluid>
    <!-- Título -->
    <v-row justify="center" class="d-none d-md-flex">
      <v-col cols="12" class="text-center mb-4">
        <h1 class="cinzel-text font-weight-black pt-4 pb-4 justify-center text-center text-h2 text-white">
          LIBRARY
        </h1>
      </v-col>
    </v-row>

    <!-- Desktop Layout -->
    <v-row class="pa-2 pa-md-4 rounded justify-center d-none d-md-flex" align="stretch" style="min-height: calc(100vh - 200px); max-width: 1400px; margin: 0 auto;">
      <v-col cols="12" md="3" class="px-3">
        <v-card color="primary" class="pa-4 h-100 d-flex flex-column" rounded="lg" elevation="0">
          <v-card-title class="pa-0 mb-4 text-white">FILTERS</v-card-title>
          <Filters
            :filter-status="filterStatus"
            :name-filter="nameFilter"
            :name-options="nameOptions"
            @update:filterStatus="filterStatus = $event"
            @update:nameFilter="nameFilter = $event"
          />
        </v-card>
      </v-col>
      
      <v-col cols="12" md="9">
        <v-card class="pa-4 h-100" color="primary" rounded="lg">
          <div class="library-scroll-container pr-1 pr-md-2">
            <v-row dense>
            <v-col v-for="product in filteredProducts" :key="product.id" cols="12" md="6">
              <ProductCard :product="product" @click="() => goToLink(product.link)" class="cursor-pointer">
                <template #actions>
                  <div class="d-flex w-100 justify-space-between mt-2" @click.stop>
                    <v-btn
                      prepend-icon="mdi-star"
                      size="small"
                      :variant="product.wish ? 'flat' : 'outlined'"
                      :color="product.wish ? '#136D6D' : 'rgba(255,255,255,0.7)'"
                      @click.stop="toggleWishlist(product.id)"
                      class="text-caption rounded-pill flex-grow-1 mr-1"
                    >
                      WISHLIST
                    </v-btn>
                    
                    <v-btn
                      prepend-icon="mdi-check-circle"
                      size="small"
                      :variant="product.owned ? 'flat' : 'outlined'"
                      :color="product.owned ? '#136D6D' : 'rgba(255,255,255,0.7)'"
                      @click.stop="toggleOwned(product.id)"
                      class="text-caption rounded-pill flex-grow-1 ml-1"
                    >
                      OWNED
                    </v-btn>
                  </div>
                </template>
              </ProductCard>
            </v-col>
          </v-row>
        </div>
        </v-card>
      </v-col>
    </v-row>

    <!-- Mobile Layout -->
    <v-row class="pa-2 justify-center mx-auto d-flex d-md-none align-start" style="max-width: 800px;">
      <v-col cols="12" class="px-2">
        <v-card color="primary" class="pa-3 pa-sm-4 d-flex flex-column justify-start" rounded="lg" style="min-height: calc(100vh - 100px);">
          <!-- Filtros como Expansion Panel -->
          <v-expansion-panels class="mb-4">
            <v-expansion-panel bg-color="secondary" elevation="0" style="border: 1px solid rgba(255,255,255,0.05);">
              <v-expansion-panel-title class="font-weight-bold text-white text-h6 px-4">
                FILTERS
              </v-expansion-panel-title>
              <v-expansion-panel-text>
                <Filters
                  :filter-status="filterStatus"
                  :name-filter="nameFilter"
                  :name-options="nameOptions"
                  @update:filterStatus="filterStatus = $event"
                  @update:nameFilter="nameFilter = $event"
                />
              </v-expansion-panel-text>
            </v-expansion-panel>
          </v-expansion-panels>
          
          <!-- Lista de Produtos -->
          <div class="library-scroll-container">
            <v-row no-gutters>
              <v-col v-for="product in filteredProducts" :key="product.id" cols="12">
                <ProductCard :product="product" @click="() => goToLink(product.link)" class="cursor-pointer mb-3">
                  <template #actions>
                    <div class="d-flex w-100 justify-space-between mt-1" @click.stop>
                      <v-btn
                        prepend-icon="mdi-star"
                        size="small"
                        :variant="product.wish ? 'flat' : 'outlined'"
                        :color="product.wish ? '#136D6D' : 'rgba(255,255,255,0.7)'"
                        @click.stop="toggleWishlist(product.id)"
                        class="text-caption rounded-pill flex-grow-1 mr-1"
                      >
                        WISHLIST
                      </v-btn>
                      
                      <v-btn
                        prepend-icon="mdi-check-circle"
                        size="small"
                        :variant="product.owned ? 'flat' : 'outlined'"
                        :color="product.owned ? '#136D6D' : 'rgba(255,255,255,0.7)'"
                        @click.stop="toggleOwned(product.id)"
                        class="text-caption rounded-pill flex-grow-1 ml-1"
                      >
                        OWNED
                      </v-btn>
                    </div>
                  </template>
                </ProductCard>
              </v-col>
            </v-row>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <!-- Dialog -->
    <v-dialog v-model="dialog" max-width="440">
      <v-card class="custom-background">
        <v-card-title class="font-weight-bold text-h4">
          {{ cardName }}
        </v-card-title>
        <v-img src="https://assets.drunagor.app/Library/box-corebox.png" class="my-4" height="200"></v-img>

        <v-col cols="12">
          <v-btn block prepend-icon="mdi-script-text" color="#312F2F" class="explore rounded-lg" @click="() => goToLink('https://aodarkness.com')">
            Explore
          </v-btn>
        </v-col>

        <h3 class="pl-4 font-weight-medium text-h5">Description</h3>
        <h2 class="pl-4 pb-4 text-body-1">{{ Description }}</h2>

        <v-btn class="rounded-0" color="red" text="Close" @click="dialog = false"></v-btn>
      </v-card>
    </v-dialog>

  </v-container>
</template>

<script lang="ts" setup>
import { ref, computed, onBeforeMount, inject, nextTick, watch } from "vue";
import Filters from "@/components/Filters.vue";
import ProductCard from "@/components/ProductCard.vue";
import { useUserStore } from "@/store/UserStore";
import { he } from "vuetify/locale";

const filterStatus = ref("all");
const nameFilter = ref("");
const user = useUserStore().user;
const cardName = ref("");
const boximage = ref("");
const Description = ref("");
const confirmationDialog = ref(false);
const confirmationMessage = ref("");
const dialog = ref(false);

const nameOptions = ["A - Z", "Z - A"];

const isDesktop = computed(() => window.innerWidth >= 960);
const setDialog = (name: string, description: string, image: string) => {
  cardName.value = name;
  dialog.value = true;
  Description.value = description;
  boximage.value = image;
};


interface Product {
  id: number;
  name: string;
  image: string;
  link: string;
  description: string;
  color: string;
  cardbg: string;
  owned: boolean | null;
  wish: boolean | null;
  libraries_pk: number | null;
}

const products = ref<Product[]>([]);

const goToLink = (link: string) => {
  if (link) {
    window.open(link, "_blank");
  } else {
    console.warn("Nenhum link encontrado para redirecionar.");
  }
};

const activeTab = ref(1);
const wishlist = ref<number[]>([]);
const owned = ref<number[]>([]);

const token = localStorage.getItem("accessToken");
const storedUser = localStorage.getItem("app_user");
const appUser = storedUser ? JSON.parse(storedUser) : null;

const toggleWishlist = async (productId: number) => {
  const product = products.value.find((p) => p.id === productId);
  if (!product) return;

  const isCurrentlyWishlisted = product.wish === true;
  const librariesPk = product.libraries_pk;

  if (!librariesPk) {
    await axios
      .post(
        url + "libraries/cadastro",
        {
          users_fk: appUser.users_pk,
          skus_fk: productId,
          wish: "true",
          owned: "false",
        },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then((response: any) => {
        product.wish = true;
        product.owned = false;
        product.libraries_pk = response.data.libraries_pk;
        wishlist.value.push(productId);
      })
      .catch((error: any) => {
        console.error("Erro ao adicionar à wishlist:", error);
      });
  } else {
    await axios
      .put(
        url + "libraries/alter",
        {
          libraries_pk: librariesPk,
          users_fk: appUser.users_pk,
          skus_fk: productId,
          wish: isCurrentlyWishlisted ? "false" : "true",
          owned: "false",
        },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then(() => {
        product.wish = isCurrentlyWishlisted ? false : true;
        product.owned = false;

        if (isCurrentlyWishlisted) {
          wishlist.value = wishlist.value.filter((id) => id !== productId);
        } else {
          wishlist.value.push(productId);
        }
      })
      .catch((error: any) => {
        console.error("Erro ao atualizar a wishlist:", error);
      });
  }
};

const toggleOwned = async (productId: number) => {
  const product = products.value.find((p) => p.id === productId);
  if (!product) return;

  const isCurrentlyOwned = product.owned === true;
  const librariesPk = product.libraries_pk;

  if (!librariesPk) {
    console.log("isCurrentlyOwned:", isCurrentlyOwned);
    await axios
      .post(
        url + "libraries/cadastro",
        {
          users_fk: appUser.users_pk,
          skus_fk: productId,
          owned: "true",
          wish: "false",
        },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then((response: any) => {
        product.owned = true;
        product.wish = false;
        product.libraries_pk = response.data.libraries_pk;
        owned.value.push(productId);
      })
      .catch((error: any) => {
        console.error("Erro ao adicionar ao owned:", error);
      });
  } else {
    await axios
      .put(
        url + "libraries/alter",
        {
          libraries_pk: librariesPk,
          users_fk: appUser.users_pk,
          skus_fk: productId,
          owned: isCurrentlyOwned ? "false" : "true",
          wish: "false",
        },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then(() => {
        product.owned = isCurrentlyOwned ? false : true;
        product.wish = false;

        if (isCurrentlyOwned) {
          owned.value = owned.value.filter((id) => id !== productId);
        } else {
          owned.value.push(productId);
        }
      })
      .catch((error: any) => {
        console.error("Erro ao atualizar o owned:", error);
      });
  }
};

const toggleFromWishlist = async (productId: number) => {
  const product = products.value.find((p) => p.id === productId);
  if (!product) return;

  await axios
    .put(
      url + "libraries/alter",
      {
        libraries_pk: product.libraries_pk,
        users_fk: appUser.users_pk,
        skus_fk: productId,
        wish: "false",
        owned: "false",
      },
      { headers: { Authorization: `Bearer ${token}` } }
    )
    .then(() => {
      product.wish = false;
      product.owned = false;
      wishlist.value = wishlist.value.filter((id) => id !== productId);
      confirmationMessage.value = `Product "${product.name}" removed from Wishlist!`;
      confirmationDialog.value = true;
    })
    .catch((error: any) => {
      console.error("Erro ao remover da wishlist:", error);
    });
};

const toggleFromOwned = async (productId: number) => {
  const product = products.value.find((p) => p.id === productId);
  if (!product) return;

  await axios
    .put(
      url + "libraries/alter",
      {
        libraries_pk: product.libraries_pk,
        users_fk: appUser.users_pk,
        skus_fk: productId,
        owned: "false",
        wish: "false",
      },
      { headers: { Authorization: `Bearer ${token}` } }
    )
    .then(() => {
      product.owned = false;
      product.wish = false;
      owned.value = owned.value.filter((id) => id !== productId);
      confirmationMessage.value = `Product "${product.name}" removed from Owned!`;
      confirmationDialog.value = true;
    })
    .catch((error: any) => {
      console.error("Erro ao remover do owned:", error);
    });
};

const filteredProducts = computed(() => {
  let result = products.value.filter(p => {
    const pName = p.name?.toLowerCase() || '';
    return !['underkeep', 'underkeep2'].includes(pName);
  });

  if (filterStatus.value === 'wishlist') {
    result = result.filter((product) => product.wish === true);
  } else if (filterStatus.value === 'owned') {
    result = result.filter((product) => product.owned === true);
  }

  // Optionally implement filtering by nameFilter, selectedBox, etc. if needed
  if (nameFilter.value === 'A - Z') {
    result.sort((a, b) => a.name.localeCompare(b.name));
  } else if (nameFilter.value === 'Z - A') {
    result.sort((a, b) => b.name.localeCompare(a.name));
  }

  return result;
});

const axios: any = inject("axios");
const url: string = inject("apiUrl") || "";

const fetchProducts = async () => {
  try {
    const response = await axios.get(url + "skus/search", {
      params: {
        users_fk: appUser.users_pk,
        limit: 30,
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const uniqueProducts = new Map();
    response.data.skus.forEach((el: any) => {
      if (!uniqueProducts.has(el.skus_pk)) {
        uniqueProducts.set(el.skus_pk, {
          id: el.skus_pk,
          name: el.name,
          image: el.picture_hash,
          link: el.link,
          skus_pk: el.skus_pk,
          description: "Descrição padrão",
          color: el.color,
          cardbg: el.background,
          owned: el.owned,
          wish: el.wish,
          libraries_pk: el.libraries_pk,
        });
      }
    });

    products.value = Array.from(uniqueProducts.values());
    console.log("Produtos:", products.value);
  } catch (error) {
    console.log("Erro na API:", error);
  }
};

onBeforeMount(fetchProducts);

watch(confirmationDialog, async (newVal) => {
  if (newVal) {
    await nextTick();
    await fetchProducts();
  }
});
</script>

<style>
.cinzel-text {
  font-family: "Cinzel", serif;
}

.movecaixas {
  position: 0;
  /* Move a imagem 10px para cima */
}

.library-scroll-container {
  max-height: calc(100vh - 250px);
  overflow-y: auto;
  overflow-x: hidden;
}

/* Scrollbar personalizada */
.library-scroll-container::-webkit-scrollbar {
  width: 6px;
}
.library-scroll-container::-webkit-scrollbar-track {
  background: rgba(0,0,0,0.2);
  border-radius: 4px;
}
.library-scroll-container::-webkit-scrollbar-thumb {
  background: #136D6D;
  border-radius: 4px;
}

.cursor-pointer {
  cursor: pointer;
}

.box-shadow {
  background-color: rgba(0, 0, 0, 0.25);
}

.centered-tabs {
  width: 100%;
}

@media (max-width: 600px) {
  .library-scroll-container::-webkit-scrollbar {
    display: none;
  }
  .library-scroll-container {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
}

</style>
