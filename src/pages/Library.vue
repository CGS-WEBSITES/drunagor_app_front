<template>
  <v-container class="pa-0 mt-16">
    <v-row justify="center">
      <v-col cols="12" class="text-center mb-4">
        <h1 class="cinzel-text font-weight-black pt-15 pb-4 justify-center text-center text-h2">
          LIBRARY
        </h1>
      </v-col>
    </v-row>

    <v-card class="pa-2">
      <v-tabs v-model="activeTab" align-tabs="center" class="box-shadow centered-tabs d-flex justify-center">
        <v-tab :value="1">All Products</v-tab>
        <v-tab :value="2">Wishlist</v-tab>
        <v-tab :value="3">Owned</v-tab>
      </v-tabs>

      <div v-if="activeTab === 1">
        <v-row dense>
          <v-col v-for="product in products" :key="product.id" cols="12" sm="6" md="6" lg="4">
            <div class="card-wrapper">
              <ProductCard :product="product" @click="() => goToLink(product.link)" />

              <div class="buttons-container">
                <v-btn prepend-icon="mdi-list-box-outline" size="small" variant="outlined"
                  :style="{ backgroundColor: product.wish ? '#136D6D' : '' }" @click="toggleWishlist(product.id)">
                  {{ product.wish ? " - Wishlist" : "+ Wishlist" }}
                </v-btn>

                <v-btn prepend-icon="mdi-tag-check-outline" variant="outlined" size="small"
                  :style="{ backgroundColor: product.owned ? '#136D6D' : '' }" @click="toggleOwned(product.id)">
                  {{ product.owned ? "- Owned" : "+ Owned" }}
                </v-btn>
              </div>
            </div>
          </v-col>
        </v-row>
      </div>

      <div v-if="activeTab === 2">
        <v-row dense>
          <v-col v-for="product in wishlistItems" :key="product.id" cols="12" sm="6" md="4">
            <v-card>
              <ProductCard :product="product" @click="() => goToLink(product.link)" />

              <div class="wishlist-button-container">
                <v-btn prepend-icon="mdi-list-box-outline" variant="outlined" size="small"
                  @click="toggleFromWishlist(product.id)">
                  - Wishlist
                </v-btn>
              </div>
            </v-card>
          </v-col>
        </v-row>
      </div>

      <div v-if="activeTab === 3">
        <v-row dense>
          <v-col v-for="product in ownedItems" :key="product.id" cols="12" sm="6" md="4">
            <v-card>
              <ProductCard :product="product" @click="() => goToLink(product.link)" />

              <div class="owned-button-container">
                <v-btn variant="outlined" prepend-icon="mdi-tag-check-outline" size="small" class="movebotao4"
                  @click="toggleFromOwned(product.id)">
                  - Owned
                </v-btn>
              </div>
            </v-card>
          </v-col>
        </v-row>
      </div>
    </v-card>
  </v-container>

  <v-dialog v-model="confirmationDialog" max-width="1000">
    <v-card>
      <v-card-title class="font-weight-bold text-h4">
        {{ confirmationMessage }}
      </v-card-title>
      <v-card-actions>
        <v-btn color="green" text="true" @click="confirmationDialog = false">
          OK
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <v-dialog v-model="dialog" max-width="440">
    <v-card class="custom-background">
      <v-card-title class="font-weight-bold text-h4">
        {{ cardName }}
      </v-card-title>
      <v-img src="https://druna-assets.s3.us-east-2.amazonaws.com/Library/box-corebox.png" class="my-4"
        height="200"></v-img>

      <v-col cols="12">
        <v-btn block prepend-icon="mdi-script-text" color="#312F2F" class="explore rounded-lg"
          @click="() => goToLink('https://aodarkness.com')">
          Explore</v-btn>
      </v-col>

      <h3 class="pl-4 font-weight-medium text-h5">Description</h3>
      <h2 class="pl-4 pb-4 text-body-1">{{ Description }}</h2>

      <v-btn class="rounded-0" color="red" text="Close" @click="dialog = false"></v-btn>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
import { ref, computed, onBeforeMount, inject, nextTick } from "vue";
import Filters from "@/components/Library/Filters.vue";
import ProductCard from "@/components/ProductCard.vue";
import { useUserStore } from "@/store/UserStore";
import { he } from "vuetify/locale";

const filterStatus = ref("owned");
const rewardsStatus = ref("rewards_owned");
const selectedBox = ref("");
const componentChecked = ref(false);
const selectedComponentType = ref("");
const contentChecked = ref(false);
const selectedContent = ref("");
const user = useUserStore().user;
const cardName = ref("");
const boximage = ref("");
const Description = ref("");
const confirmationDialog = ref(false);
const confirmationMessage = ref("");
const dialog = ref(false);

const boxOptions = [
  "Companions and Furnitures",
  "AoDarkness",
  "Desert of Hellscar",
];
const contentOptions = ["Core", "Cosmetic", "Game Content"];
const componentTypes = [
  "Books",
  "Cards",
  "Miniatures",
  "Maps",
  "Doors",
  "Playerboards",
  "Punchboards",
  "Scorepad",
  "Trays",
];

const showFilters = ref(false);
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
  owned: "true" | "false" | null;
  wish: "true" | "false" | null;
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

  const isCurrentlyWishlisted = product.wish === "true";
  const isCurrentlyOwned = product.owned === "true";
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
        product.wish = "true";
        product.owned = "false";
        product.libraries_pk = response.data.libraries_pk;
        wishlist.value.push(productId);

        confirmationMessage.value = `Product "${product.name}" added to Wishlist!`;
        confirmationDialog.value = true;
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
          owned: isCurrentlyOwned ? "true" : "false",
        },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then(() => {
        product.wish = isCurrentlyWishlisted ? "false" : "true";
        product.owned = isCurrentlyOwned ? "true" : "false";

        if (isCurrentlyWishlisted) {
          wishlist.value = wishlist.value.filter((id) => id !== productId);
        } else {
          wishlist.value.push(productId);
        }

        confirmationMessage.value = `Product "${product.name}" ${isCurrentlyWishlisted ? "removed from" : "added to"
          } Wishlist!`;
        confirmationDialog.value = true;
      })
      .catch((error: any) => {
        console.error("Erro ao atualizar a wishlist:", error);
      });
  }
};

const toggleOwned = async (productId: number) => {
  const product = products.value.find((p) => p.id === productId);
  if (!product) return;

  const isCurrentlyOwned = product.owned === "true";
  const isCurrentlyWishlisted = product.wish === "true";
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
        product.owned = "true";
        product.libraries_pk = response.data.libraries_pk;
        owned.value.push(productId);

        confirmationMessage.value = `Product "${product.name}" added to Owned!`;
        confirmationDialog.value = true;
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
          wish: isCurrentlyWishlisted ? "true" : "false",
        },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then(() => {
        product.owned = isCurrentlyOwned ? "false" : "true";
        product.wish = "false";

        if (isCurrentlyOwned) {
          owned.value = owned.value.filter((id) => id !== productId);
        } else {
          owned.value.push(productId);
        }

        confirmationMessage.value = `Product "${product.name}" ${isCurrentlyOwned ? "removed from" : "added to"
          } Owned!`;
        confirmationDialog.value = true;
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
      product.wish = "false";
      product.owned = "false";
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
      product.owned = "false";
      product.wish = "false";
      owned.value = owned.value.filter((id) => id !== productId);
      confirmationMessage.value = `Product "${product.name}" removed from Owned!`;
      confirmationDialog.value = true;
    })
    .catch((error: any) => {
      console.error("Erro ao remover do owned:", error);
    });
};

// const isInWishlist = (productId: number) => {
//   return wishlistItems.value.some((product) => product.id === productId);
// };

// const isOwned = (productId: number) => {
//   return ownedItems.value.some((product) => product.id === productId);
// };

const wishlistItems = computed(() => {
  const itemsWithWishTrue = products.value.filter(
    (product) => product.wish === true
  );

  return itemsWithWishTrue;
});

const ownedItems = computed(() => {
  const itemsWithOwnedTrue = products.value.filter(
    (product) => product.owned === true
  );

  return itemsWithOwnedTrue;
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
        const owned =
          response.data.skus.filter(
            (p: any) => p.owned === el.owned && p.owned === true
          ).length > 0;
        const wish =
          response.data.skus.filter(
            (p: any) => p.wish === el.wish && p.wish === true
          ).length > 0;

        uniqueProducts.set(el.skus_pk, {
          id: el.skus_pk,
          name: el.name,
          image: el.picture_hash,
          link: el.link,
          skus_pk: el.skus_pk,
          description: "Descrição padrão",
          color: el.color,
          cardbg: el.background,
          owned,
          wish,
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

.box-shadow {
  background-color: rgba(0, 0, 0, 0.25);
  /* Preto com 70% de opacidade */
}

.centered-tabs {
  width: 100%;
}

.card-wrapper {
  position: relative;
  padding: 16px;
  /* border: 1px solid #ddd; */
  border-radius: 8px;
  /* background-color: white; */
}

/* Estiliza o container dos botões */
.buttons-container {
  display: flex;
  flex-direction: column;
  gap: 5px;
  position: absolute;
  bottom: 25px;
  right: 40px;
}

.wishlist-button-container {
  position: absolute;
  bottom: 10px;
  right: 20px;
}

.owned-button-container {
  position: absolute;
  bottom: 10px;
  right: 20px;
}

.custom-background {
  background-image: url("src/assets/Frame.png");
  background-size: cover;
  background-repeat: no-repeat;
  background-position: top center;
  background-position-y: -0px;
  width: 100%;
  height: 100%;
  padding-top: px;
}
</style>
