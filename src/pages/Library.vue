<template>
  <v-container class="pa-0 mx-auto">
    <!-- Título -->
    <v-row justify="center">
      <v-col cols="12" class="text-center">
        <h1 class=" cinzel-text font-weight-black pt-15 pb-4 justify-center text-center text-h2">LIBRARY</h1>
      </v-col>
    </v-row>


    <v-card class="mx-2">
    <v-row justify="center" class="pa-4 rounded">

      <v-tabs v-model="tab"
      align-tabs="center"
      class="box-shadow centered-tabs d-flex justify-center">
        <v-tab :value="1">Show All</v-tab>
      <v-tab :value="2">Owned</v-tab>
      <v-tab :value="3">Wishlist</v-tab>
      </v-tabs>
      
    



      <!-- Galeria de Produtos -->
      <v-col  cols="12" md="12">
        <v-row justify="center" align="center" dense>
          <v-col cols="12" sm="4" md="3" class="movecaixas d-flex justify-left" v-for="product in products" :key="product.id">
            <!-- Componente de Card -->
            <ProductCard :product="product" class="w-100" @click="setDialog(product.name)" />
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-card>

    <v-dialog v-model="dialog" max-width="440">

      <v-card class="custom-background">

        <v-card-title class="font-weight-bold text-h4">
          {{ cardName }}
        </v-card-title>
        <v-img src="https://druna-assets.s3.us-east-2.amazonaws.com/Library/box-corebox.png" class="my-4"
          height="200"></v-img>


        <v-col cols="12">
          <v-btn block prepend-icon="mdi-script-text" color="#312F2F" class="explore rounded-lg"
            @click="openLink(product.link)"> Explore</v-btn>
        </v-col>

        <h3 class="pl-4  font-weight-medium text-h5">Description</h3>
        <h2 class="pl-4 pb-4 text-body-1">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum
          has
          been the
          industry's standard dummy text ever since the 1500s, when an unknown </h2>

        <v-btn class="rounded-0" color="red" text="Close" @click="dialog = false"></v-btn>

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
const boximage = ref("")

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
    description: "Navigate through the legends of the Defenders of Daren, uncover the secrets of the Powers of Darkness in monstrous creatures, and unravel the mysteries of this devastated world. Join us on this journey where darkness reveals secrets, and challenges await those who dare to explore. Venture into AODarkness.com and discover the uncharted in Drunagor!",
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

  {
    id: 8,
    name: "Undead Dragon",
    image: "https://druna-assets.s3.us-east-2.amazonaws.com/Library/box-undeaddragon.png",
    link: "https://aodarkness.com/boxes/undead-dragon/",
  },

  {
    id: 8,
    name: "Undead Dragon",
    image: "https://druna-assets.s3.us-east-2.amazonaws.com/Library/box-undeaddragon.png",
    link: "https://aodarkness.com/boxes/undead-dragon/",
  },

  {
    id: 8,
    name: "Undead Dragon",
    image: "https://druna-assets.s3.us-east-2.amazonaws.com/Library/box-undeaddragon.png",
    link: "https://aodarkness.com/boxes/undead-dragon/",
  },

  {
    id: 8,
    name: "Undead Dragon",
    image: "https://druna-assets.s3.us-east-2.amazonaws.com/Library/box-undeaddragon.png",
    link: "https://aodarkness.com/boxes/undead-dragon/",
  },

  {
    id: 8,
    name: "Undead Dragon",
    image: "https://druna-assets.s3.us-east-2.amazonaws.com/Library/box-undeaddragon.png",
    link: "https://aodarkness.com/boxes/undead-dragon/",
  },

  {
    id: 8,
    name: "Undead Dragon",
    image: "https://druna-assets.s3.us-east-2.amazonaws.com/Library/box-undeaddragon.png",
    link: "https://aodarkness.com/boxes/undead-dragon/",
  },

  {
    id: 8,
    name: "Undead Dragon",
    image: "https://druna-assets.s3.us-east-2.amazonaws.com/Library/box-undeaddragon.png",
    link: "https://aodarkness.com/boxes/undead-dragon/",
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


<style>
.cinzel-text {
  font-family: 'Cinzel', serif;
}

.movecaixas {
  position: 30;
  /* Move a imagem 10px para cima */
}

.box-shadow {
  background-color: rgba(0, 0, 0, 0.25); /* Preto com 70% de opacidade */
  
}

.centered-tabs {
  width: 100%;
}



.custom-background {
  background-image: url('src/assets/Frame.png');
  background-size: cover;
  /* Garante que a imagem se ajuste ao conteúdo */
  background-repeat: no-repeat;
  /* Evita repetição da imagem */
  background-position: top center;
  /* Posiciona o fundo no topo e centraliza horizontalmente */
  background-position-y: -0px;
  /* Move a imagem 10px para cima */
  width: 100%;
  /* Ajusta para preencher a largura */
  height: 100%;
  /* Ajusta para preencher a altura */
  padding-top: px;
  /* Move o conteúdo para baixo para evitar cortes */
}
</style>
