<template>
  <v-container class="pa-0 mx-auto">
    <!-- Título -->
    <v-row justify="center">
      <v-col cols="12" class="text-center">
        <h1 class="text-h2 font-weight-bold pt-14">LIBRARY</h1>
      </v-col>
    </v-row>

    <!-- Conteúdo com Filtros e Produtos -->
    <v-row justify="center" class="bg-grey-darken-3 pa-4 rounded">
      <!-- Botão de Filtros no Mobile -->
      <v-btn class="d-md-none mb-4" color="#222222" block @click="toggleFilters">
        Filters
      </v-btn>

      <!-- Filtros -->
      <v-col cols="12" md="3" v-show="showFilters || isDesktop">
        <Filters @apply-filters="applyFilters" />
      </v-col>

      <!-- Galeria de Produtos -->
      <v-col cols="12" md="9">
        <v-row justify="center" align="center" dense>
          <v-col cols="12" sm="6" md="6" class="d-flex justify-center" v-for="product in products" :key="product.id">
            <!-- Componente de Card -->
            <ProductCard :product="product" class="w-100" @click="setDialog(product.name)" />
          </v-col>
        </v-row>
      </v-col>
    </v-row>
    <v-dialog v-model="dialog" max-width="500">
      <v-card>
        <v-card-title>
          {{ cardName }}
        </v-card-title>
        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn text="Close Dialog" @click="dialog = false"></v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script lang="ts" setup>
import { ref, computed, onBeforeMount, inject } from "vue";
import Filters from "@/components/Library/Filters.vue";
import ProductCard from "@/components/ProductCard.vue";
import { useUserStore } from "@/store/UserStore";

const filterStatus = ref("owned");
const rewardsStatus = ref("rewards_owned");
const selectedBox = ref("");
const componentChecked = ref(false);
const selectedComponentType = ref("");
const contentChecked = ref(false);
const selectedContent = ref("");
const user = useUserStore().user
const cardName = ref("")

const boxOptions = ["Companions and Furnitures", "AoDarkness", "Desert of Hellscar"];
const contentOptions = ["Core", "Cosmetic", "Game Content"];
const componentTypes = ["Books", "Cards", "Miniatures", "Maps", "Doors", "Playerboards", "Punchboards", "Scorepad", "Trays"];

const showFilters = ref(false);
const isDesktop = computed(() => window.innerWidth >= 960);
const setDialog = (name: string) => {
  cardName.value = name
  dialog.value = true
}

const dialog = ref(true)

const products = ref([
  {
    id: 1,
    name: "Corebox",
    image: "https://druna-assets.s3.us-east-2.amazonaws.com/Library/box-corebox.png",
    link: "https://aodarkness.com/boxes/chronicles-of-drunagor-age-of-darkness-core-box/",
  },
  {
    id: 2,
    name: "Desert Of Hellscar",
    image: "https://druna-assets.s3.us-east-2.amazonaws.com/Library/box-hellscar.png",
    link: "https://aodarkness.com/boxes/desert-of-hellscar/",
  },
  {
    id: 3,
    name: "Lordwrath",
    image: "https://druna-assets.s3.us-east-2.amazonaws.com/Library/box-handuriel.png",
    link: "https://aodarkness.com/boxes/lordwrath/",
  },
  {
    id: 4,
    name: "Monster Pack",
    image: "https://druna-assets.s3.us-east-2.amazonaws.com/Library/box-lordwrath.png",
    link: "https://aodarkness.com/boxes/monster-pack/",
  },
  {
    id: 5,
    name: "Ruin of Luccanor",
    image: "https://druna-assets.s3.us-east-2.amazonaws.com/Library/box-monsterpack.png",
    link: "https://aodarkness.com/boxes/ruin-of-luccanor/",
  },
  {
    id: 6,
    name: "Shadow World",
    image: "https://druna-assets.s3.us-east-2.amazonaws.com/Library/box-shadowworld.png",
    link: "https://aodarkness.com/boxes/shadow-world/",
  },
  {
    id: 7,
    name: "Spoils of War",
    image: "https://druna-assets.s3.us-east-2.amazonaws.com/Library/box-spoils.png",
    link: "https://aodarkness.com/boxes/spoils-of-war/",
  },
  {
    id: 8,
    name: "Undead Dragon",
    image: "https://druna-assets.s3.us-east-2.amazonaws.com/Library/box-undeaddragon.png",
    link: "https://aodarkness.com/boxes/undead-dragon/",
  },

]);

const toggleFilters = () => {
  showFilters.value = !showFilters.value;
};

const openLink = (link: string) => {
  window.open(link, "_blank");
};

const applyFilters = () => {
  // Aqui pode-se implementar lógica de filtros para ajustar os produtos exibidos
};

const axios: any = inject("axios");
const url: string = inject("apiUrl");

onBeforeMount(async () => {
  await axios
    .get(url + "skus/search", {
      limit: 30,
    })
    .then((response: any) => {
      console.log("API Response:", response);
    })
    .catch((error: any) => {
      console.log("API Response:", error);
    });
})

</script>
