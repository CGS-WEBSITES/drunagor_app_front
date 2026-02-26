<template>
  <v-container class="pa-0 mt-0" style="min-height: 100vh;">
    
    <v-row justify="center" no-gutters class="bg-transparent pt-16">
      <v-col cols="12" class="text-center mb-4">
        <h1 class="cinzel-text font-weight-black pt-4 pb-4 text-h2 text-uppercase">
          Library
        </h1>
      </v-col>
    </v-row>

    <v-card 
      color="primary" 
      min-height="100vh" 
      class="pa-2 rounded-t-lg main-container-card"
      flat
    >
      <v-tabs 
        v-model="activeTab" 
        align-tabs="center" 
        class="box-shadow centered-tabs d-flex justify-center mb-6"
        slider-color="secondary"
      >
        <v-tab :value="1" class="font-weight-bold">All Products</v-tab>
        <v-tab :value="2" class="font-weight-bold">Wishlist</v-tab>
        <v-tab :value="3" class="font-weight-bold">Owned</v-tab>
      </v-tabs>

      <v-window v-model="activeTab">
        
        <v-window-item :value="1">
          <v-row dense class="px-2">
            <v-col v-for="product in products" :key="product.id" cols="12" sm="6" md="6" lg="4">
              <div class="card-wrapper">
                <ProductCard :product="product" @click="() => goToLink(product.link)" />
                <div class="buttons-container">
                  <v-btn prepend-icon="mdi-list-box-outline" size="small" variant="outlined"
                    :style="{ backgroundColor: product.wish ? '#136D6D' : 'rgba(0,0,0,0.5)' }"
                    @click.stop="toggleWishlist(product.id)">
                    {{ product.wish ? "- Wishlist" : "+ Wishlist" }}
                  </v-btn>
                  <v-btn prepend-icon="mdi-tag-check-outline" variant="outlined" size="small"
                    :style="{ backgroundColor: product.owned ? '#136D6D' : 'rgba(0,0,0,0.5)' }"
                    @click.stop="toggleOwned(product.id)">
                    {{ product.owned ? "- Owned" : "+ Owned" }}
                  </v-btn>
                </div>
              </div>
            </v-col>
          </v-row>
        </v-window-item>

        <v-window-item :value="2">
          <v-row dense class="px-2">
            <v-col v-for="product in wishlistItems" :key="product.id" cols="12" sm="6" md="4">
              <v-card class="card-wrapper bg-transparent" flat>
                <ProductCard :product="product" @click="() => goToLink(product.link)" />
                <div class="wishlist-button-container">
                  <v-btn prepend-icon="mdi-list-box-outline" size="small" variant="outlined"
                    :style="{ backgroundColor: '#136D6D' }" @click.stop="toggleFromWishlist(product.id)">
                    - Wishlist
                  </v-btn>
                </div>
              </v-card>
            </v-col>
          </v-row>
        </v-window-item>

        <v-window-item :value="3">
          <v-row dense class="px-2">
            <v-col v-for="product in ownedItems" :key="product.id" cols="12" sm="6" md="4">
              <v-card class="card-wrapper bg-transparent" flat>
                <ProductCard :product="product" @click="() => goToLink(product.link)" />
                <div class="owned-button-container">
                  <v-btn prepend-icon="mdi-tag-check-outline" variant="outlined" size="small"
                    :style="{ backgroundColor: '#136D6D' }" @click.stop="toggleFromOwned(product.id)">
                    - Owned
                  </v-btn>
                </div>
              </v-card>
            </v-col>
          </v-row>
        </v-window-item>

      </v-window>
    </v-card>
  </v-container>

  <v-dialog v-model="dialog" max-width="440">
    <v-card class="custom-background">
      <v-card-title class="font-weight-bold text-h4">{{ cardName }}</v-card-title>
      <v-img src="https://assets.drunagor.app/Library/box-corebox.png" class="my-4" height="200"></v-img>
      <v-col cols="12">
        <v-btn block prepend-icon="mdi-script-text" color="#312F2F" class="explore rounded-lg"
          @click="() => goToLink('https://aodarkness.com')">Explore</v-btn>
      </v-col>
      <h3 class="pl-4 font-weight-medium text-h5">Description</h3>
      <h2 class="pl-4 pb-4 text-body-1">{{ Description }}</h2>
      <v-btn class="rounded-0" color="red" text="Close" @click="dialog = false"></v-btn>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
import { ref, computed, onBeforeMount, inject, nextTick, watch } from "vue";
import ProductCard from "@/components/ProductCard.vue";

const activeTab = ref(1);
const dialog = ref(false);
const cardName = ref("");
const boximage = ref("");
const Description = ref("");
const products = ref<Product[]>([]);
const confirmationDialog = ref(false);

const axios: any = inject("axios");
const url: string = inject("apiUrl") || "";
const token = localStorage.getItem("accessToken");
const storedUser = localStorage.getItem("app_user");
const appUser = storedUser ? JSON.parse(storedUser) : null;

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

const goToLink = (link: string) => { if (link) window.open(link, "_blank"); };

const wishlistItems = computed(() => products.value.filter(p => p.wish === true));
const ownedItems = computed(() => products.value.filter(p => p.owned === true));

const fetchProducts = async () => {
  try {
    const response = await axios.get(url + "skus/search", {
      params: { users_fk: appUser?.users_pk, limit: 30 },
      headers: { Authorization: `Bearer ${token}` }
    });
    const uniqueProducts = new Map();
    response.data.skus.forEach((el: any) => {
      if (!uniqueProducts.has(el.skus_pk)) {
        uniqueProducts.set(el.skus_pk, {
          id: el.skus_pk,
          name: el.name,
          image: el.picture_hash,
          link: el.link,
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
  } catch (error) { console.log("Erro API:", error); }
};

const toggleWishlist = async (productId: number) => {
  const product = products.value.find(p => p.id === productId);
  if (!product) return;
  const isCurrentlyWishlisted = product.wish === true;
  const method = product.libraries_pk ? 'put' : 'post';
  const endpoint = product.libraries_pk ? "libraries/alter" : "libraries/cadastro";
  
  await axios[method](url + endpoint, {
    libraries_pk: product.libraries_pk,
    users_fk: appUser.users_pk,
    skus_fk: productId,
    wish: isCurrentlyWishlisted ? "false" : "true",
    owned: "false",
  }, { headers: { Authorization: `Bearer ${token}` } }).then((res: any) => {
    product.wish = !isCurrentlyWishlisted;
    if (res.data?.libraries_pk) product.libraries_pk = res.data.libraries_pk;
  });
};

const toggleOwned = async (productId: number) => {
  const product = products.value.find(p => p.id === productId);
  if (!product) return;
  const isCurrentlyOwned = product.owned === true;
  const method = product.libraries_pk ? 'put' : 'post';
  const endpoint = product.libraries_pk ? "libraries/alter" : "libraries/cadastro";

  await axios[method](url + endpoint, {
    libraries_pk: product.libraries_pk,
    users_fk: appUser.users_pk,
    skus_fk: productId,
    owned: isCurrentlyOwned ? "false" : "true",
    wish: "false",
  }, { headers: { Authorization: `Bearer ${token}` } }).then((res: any) => {
    product.owned = !isCurrentlyOwned;
    if (res.data?.libraries_pk) product.libraries_pk = res.data.libraries_pk;
  });
};

const toggleFromWishlist = async (id: number) => {
  const p = products.value.find(x => x.id === id);
  if (p) await axios.put(url + "libraries/alter", { libraries_pk: p.libraries_pk, users_fk: appUser.users_pk, skus_fk: id, wish: "false", owned: "false" }, { headers: { Authorization: `Bearer ${token}` } }).then(() => { p.wish = false; fetchProducts(); });
};

const toggleFromOwned = async (id: number) => {
  const p = products.value.find(x => x.id === id);
  if (p) await axios.put(url + "libraries/alter", { libraries_pk: p.libraries_pk, users_fk: appUser.users_pk, skus_fk: id, owned: "false", wish: "false" }, { headers: { Authorization: `Bearer ${token}` } }).then(() => { p.owned = false; fetchProducts(); });
};

onBeforeMount(fetchProducts);
watch(confirmationDialog, async (v) => { if (v) { await nextTick(); await fetchProducts(); } });
</script>

<style scoped>
.cinzel-text { font-family: "Cinzel", serif; }

/* MELHORIA: Card principal agora tem transparência para o background do site aparecer */
.main-container-card {
  background-color: rgba(var(--v-theme-primary), 0.8) !important;
  backdrop-filter: blur(4px); /* Suaviza o fundo para destacar os itens */
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.box-shadow { background-color: rgba(0, 0, 0, 0.3); }

.card-wrapper {
  position: relative;
  transition: transform 0.2s;
}

.card-wrapper:hover {
  transform: scale(1.01);
}

.buttons-container {
  display: flex;
  flex-direction: column;
  gap: 8px;
  position: absolute;
  bottom: 30px;
  right: 35px;
  z-index: 5;
}

.wishlist-button-container, .owned-button-container {
  position: absolute;
  bottom: 20px;
  right: 25px;
  z-index: 5;
}

.custom-background {
  background-image: url("@/assets/Frame.png");
  background-size: cover;
  background-position: center;
}
</style>