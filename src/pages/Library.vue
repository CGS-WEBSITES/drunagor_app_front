<template>
  <v-container class="pa-0 mx-auto">
    <!-- Título -->
    <v-row justify="center">
      <v-col cols="12" class="text-center">
        <h1 class="cinzel-text font-weight-black pt-15 pb-4 justify-center text-center text-h2">LIBRARY</h1>
      </v-col>
    </v-row>


    <v-card class="mx-2">
    <v-row justify="center" class="ma-0 pa-2 rounded">

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
          <v-col cols="12" sm="6" md="3" class="pl2 movecaixas d-flex justify-left" v-for="product in products" :key="product.id">
            <!-- Componente de Card -->
            <ProductCard :product="product" class="w-100" @click="setDialog(product.name) " />
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
          @click="() => goToLink('https://aodarkness.com')"  > Explore</v-btn>
        </v-col>

        <h3 class="pl-4  font-weight-medium text-h5">Description</h3>
        <h2 class="pl-4 pb-4 text-body-1">{{ Description}} </h2>

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
const Description = ref("");

const boxOptions = ["Companions and Furnitures", "AoDarkness", "Desert of Hellscar"];
const contentOptions = ["Core", "Cosmetic", "Game Content"];
const componentTypes = ["Books", "Cards", "Miniatures", "Maps", "Doors", "Playerboards", "Punchboards", "Scorepad", "Trays"];

const showFilters = ref(false);
const isDesktop = computed(() => window.innerWidth >= 960);
const setDialog = (name: string, description: string, boximage: string ) => {
  cardName.value = name
  dialog.value = true
  Description.value = description
  boximage.value = image
}

const dialog = ref(true)


const products = ref([
  {
    id: 1,
    name: "Corebox",
    image: "https://druna-assets.s3.us-east-2.amazonaws.com/Library/box-corebox.png",
    link: "https://aodarkness.com/boxes/chronicles-of-drunagor-age-of-darkness-core-box/",
    color: "#136D6D",
    cardbg:"https://s3.us-east-2.amazonaws.com/assets.drunagor.app/Library/bg-corebox.png",
    description: "Navigate through the legends of the Defenders of Daren, uncover the secrets of the Powers of Darkness in monstrous creatures, and unravel the mysteries of this devastated world. Join us on this journey where darkness reveals secrets, and challenges await those who dare to explore. Venture into AODarkness.com and discover the uncharted in Drunagor!",
   },
  {
    id: 2,
    name: "Apocalypse",
    image: "https://druna-assets.s3.us-east-2.amazonaws.com/Library/box-apoc.png",
    cardbg:"https://s3.us-east-2.amazonaws.com/assets.drunagor.app/Library/bg-apoc.png",
    color: "#660912",
    link: "https://aodarkness.com/boxes/desert-of-hellscar/",

  },
  {
    id: 3,
    name: "Lordwrath",
    image: "https://druna-assets.s3.us-east-2.amazonaws.com/Library/box-lordwrath.png",
    cardbg:"https://s3.us-east-2.amazonaws.com/assets.drunagor.app/Library/bg-lordwrath.png",
    color: "#136D6D",
    link: "https://aodarkness.com/boxes/lordwrath/",

  },
  {
    id: 4,
    name: "Monster Pack",
    image: "https://druna-assets.s3.us-east-2.amazonaws.com/Library/box-monsterpack.png",
    cardbg:"https://s3.us-east-2.amazonaws.com/assets.drunagor.app/Library/bg-monsterpack.png",
    color: "#136D6D",
    link: "https://aodarkness.com/boxes/monster-pack/",

  },
  {
    id: 5,
    name: "Ruin of Luccanor",
    image: "https://druna-assets.s3.us-east-2.amazonaws.com/Library/box-luccanor.png",
    cardbg:"https://s3.us-east-2.amazonaws.com/assets.drunagor.app/Library/bg-luccanor.png",
    color: "#4D5564",
    link: "https://aodarkness.com/boxes/ruin-of-luccanor/",


  },
  {
    id: 6,
    name: "Shadow World",
    image: "https://druna-assets.s3.us-east-2.amazonaws.com/Library/box-shadowworld.png",
    cardbg:"https://s3.us-east-2.amazonaws.com/assets.drunagor.app/Library/bg-shadowworld.png",
    color: "#955021",
    link: "https://aodarkness.com/boxes/shadow-world/",

  },
  {
    id: 7,
    name: "Spoils of War",
    image: "https://druna-assets.s3.us-east-2.amazonaws.com/Library/box-spoils.png",
    cardbg:"https://s3.us-east-2.amazonaws.com/assets.drunagor.app/Library/bg-spoils.png",
    color: "#261D43",
    link: "https://aodarkness.com/boxes/spoils-of-war/",

  },
  {
    id: 9,
    name: "Fallen Sisters",
    image: "https://druna-assets.s3.us-east-2.amazonaws.com/Library/box-fallen.png",
    cardbg:"https://s3.us-east-2.amazonaws.com/assets.drunagor.app/Library/bg-fallen.png",
    color: "#28242A",
    link: "https://aodarkness.com/boxes/undead-dragon/",
  },

  {
    id: 10,
    name: "Companions & Fornitures",
    image: "https://druna-assets.s3.us-east-2.amazonaws.com/Library/box-compandfurt.png",
    cardbg:"https://s3.us-east-2.amazonaws.com/assets.drunagor.app/Library/bg-compandfurt.png",
    color: "#660912",
    link: "https://aodarkness.com/boxes/undead-dragon/",
  },

  {
    id: 11,
    name: "Hero Pack",
    image: "https://druna-assets.s3.us-east-2.amazonaws.com/Library/box-heropack.png",
    cardbg:"https://s3.us-east-2.amazonaws.com/assets.drunagor.app/Library/bg-heropack.png",
    color: "#033E55",
    link: "https://aodarkness.com/boxes/undead-dragon/",
  },

  {
    id: 12,
    name: "Lorien",
    image: "https://druna-assets.s3.us-east-2.amazonaws.com/Library/box-lorien.png",
    cardbg:"https://s3.us-east-2.amazonaws.com/assets.drunagor.app/Library/bg-lorien.png",
    color: "#136D6D",
    link: "https://aodarkness.com/boxes/undead-dragon/",
  },

  {
    id: 13,
    name: "Four Horseman",
    image: "https://druna-assets.s3.us-east-2.amazonaws.com/Library/box-horseman.png",
    cardbg:"https://s3.us-east-2.amazonaws.com/assets.drunagor.app/Library/bg-horseman.png",
    color: "#660912",
    link: "https://aodarkness.com/boxes/undead-dragon/",
  },




]);




const goToLink = (link: string) => {
  if (link) {
    window.location.href = link; 
  } else {
    console.warn("Nenhum link encontrado para redirecionar.");
  }
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
  background-repeat: no-repeat;
  background-position: top center;
  background-position-y: -0px;
  width: 100%;
  height: 100%;
  padding-top: px;
}
</style>
