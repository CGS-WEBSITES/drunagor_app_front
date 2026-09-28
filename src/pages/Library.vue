<template>
  <div class="library-page">
    <h1 class="library-page__title cinzel-text">LIBRARY</h1>

    <div class="library-page__layout">
      <!-- Filters: side panel on desktop, collapsible on mobile -->
      <aside class="library-page__filters">
        <button class="library-page__filters-toggle" @click="filtersOpen = !filtersOpen">
          <span>FILTERS</span>
          <v-icon>{{ filtersOpen ? "mdi-chevron-up" : "mdi-chevron-down" }}</v-icon>
        </button>
        <h2 class="library-page__filters-title">FILTERS</h2>
        <div class="library-page__filters-body" :class="{ open: filtersOpen }">
          <LibraryFilters
            v-model:status="filterStatus"
            v-model:search="search"
            v-model:component-type="componentType"
            v-model:content="content"
            v-model:sort="nameFilter"
          />
        </div>
      </aside>

      <section class="library-page__boxes">
        <div v-if="filteredProducts.length" class="library-page__grid">
          <LibraryBoxCard
            v-for="product in filteredProducts"
            :key="product.id"
            :product="product"
            :matches="matchesFor(product.name)"
            @open="openBox(product)"
          />
        </div>
        <p v-else class="library-page__empty">No boxes match these filters.</p>
      </section>
    </div>

    <LibraryBoxDetail
      v-model="detailOpen"
      :product="selectedProduct"
      @toggle-wishlist="selectedProduct && toggleWishlist(selectedProduct.id)"
      @toggle-owned="selectedProduct && toggleOwned(selectedProduct.id)"
    />
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onBeforeMount, inject } from "vue";
import LibraryFilters from "@/components/Library/LibraryFilters.vue";
import LibraryBoxCard from "@/components/Library/LibraryBoxCard.vue";
import LibraryBoxDetail from "@/components/Library/LibraryBoxDetail.vue";
import {
  CONTENT_GROUPS,
  hasComponentType,
  matchComponents,
  type ComponentTypeKey,
} from "@/data/library";

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

const axios: any = inject("axios");
const url: string = inject("apiUrl") || "";

const token = localStorage.getItem("accessToken");
const storedUser = localStorage.getItem("app_user");
const appUser = storedUser ? JSON.parse(storedUser) : null;

const products = ref<Product[]>([]);
const wishlist = ref<number[]>([]);
const owned = ref<number[]>([]);

// Filters
const filterStatus = ref<"all" | "owned" | "wishlist">("all");
const search = ref<string | null>("");
const componentType = ref<ComponentTypeKey | null>(null);
const content = ref<string | null>(null);
const nameFilter = ref("A - Z");
const filtersOpen = ref(false);

// Box detail
const detailOpen = ref(false);
const selectedProductId = ref<number | null>(null);
const selectedProduct = computed(() => products.value.find((p) => p.id === selectedProductId.value) ?? null);

const openBox = (product: Product) => {
  selectedProductId.value = product.id;
  detailOpen.value = true;
};

const matchesFor = (boxName: string) => matchComponents(boxName, search.value ?? "", componentType.value);

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

const filteredProducts = computed(() => {
  // Drunagor Nights SKUs are not boxes of the collection.
  let result = products.value.filter((p) => !["underkeep", "underkeep2"].includes(p.name?.toLowerCase() ?? ""));

  if (filterStatus.value === "wishlist") {
    result = result.filter((product) => product.wish === true);
  } else if (filterStatus.value === "owned") {
    result = result.filter((product) => product.owned === true);
  }

  if (content.value) {
    const boxes = CONTENT_GROUPS.find((group) => group.label === content.value)?.boxes ?? [];
    result = result.filter((product) => boxes.includes(product.name));
  }

  // Searching shows only boxes with a matching component; a type alone
  // shows the boxes that have that kind of component.
  if (search.value?.trim()) {
    result = result.filter((product) => matchesFor(product.name).length > 0);
  } else if (componentType.value) {
    result = result.filter((product) => hasComponentType(product.name, componentType.value!));
  }

  return [...result].sort((a, b) =>
    nameFilter.value === "Z - A" ? b.name.localeCompare(a.name) : a.name.localeCompare(b.name),
  );
});

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
  } catch (error) {
    console.error("[Library] Failed to load boxes", error);
  }
};

onBeforeMount(fetchProducts);
</script>

<style scoped>
.library-page {
  max-width: 1400px;
  margin: 0 auto;
  padding: 96px 16px 48px;
  font-family: "Poppins", sans-serif;
  color: rgb(var(--v-theme-on-surface));
}
.library-page__title {
  margin-bottom: 24px;
  font-size: 3.5rem;
  font-weight: 900;
  text-align: center;
}
.library-page__layout {
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 16px;
  align-items: start;
}
.library-page__filters,
.library-page__boxes {
  padding: 16px;
  background: rgb(var(--v-theme-primary));
  border-radius: 12px;
}
.library-page__filters {
  position: sticky;
  top: 72px;
}
.library-page__filters-title {
  margin-bottom: 12px;
  font-size: 1.1rem;
  font-weight: 700;
}
.library-page__filters-toggle {
  display: none;
}
.library-page__grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}
.library-page__empty {
  padding: 32px 0;
  text-align: center;
  opacity: 0.7;
}
.cinzel-text {
  font-family: "Cinzel", serif;
}

@media (max-width: 959px) {
  .library-page {
    padding: calc(76px + env(safe-area-inset-top, 0px)) 12px 32px;
  }
  .library-page__title {
    font-size: 2.6rem;
    margin-bottom: 16px;
  }
  .library-page__layout {
    grid-template-columns: 1fr;
  }
  .library-page__filters {
    position: static;
    padding: 0;
  }
  .library-page__filters-title {
    display: none;
  }
  .library-page__filters-toggle {
    display: flex;
    justify-content: space-between;
    width: 100%;
    padding: 12px 16px;
    font-weight: 700;
  }
  .library-page__filters-body {
    display: none;
    padding: 0 16px 16px;
  }
  .library-page__filters-body.open {
    display: block;
  }
  .library-page__boxes {
    padding: 10px;
  }
  .library-page__grid {
    grid-template-columns: 1fr;
  }
}
</style>
