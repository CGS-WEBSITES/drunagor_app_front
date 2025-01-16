<template>
  <v-container class="pa-0 mx-auto">
    <!-- Título -->
    <v-row justify="center">
      <v-col cols="12" class="text-center">
        <h1 class=" cinzel-text font-weight-black pt-15 pb-4 justify-center text-center text-h2">LIBRARY</h1>
      </v-col>
    </v-row>

    <!-- Conteúdo com Filtros e Produtos -->
    <v-row justify="center" class="bg-grey-darken-3 pa-4 rounded">
   

 

      <!-- Galeria de Produtos -->
      <v-col cols="12" md="12">
        <v-row justify="center" align="center" dense>
          <v-col cols="12" sm="6" md="6" class="d-flex justify-center" v-for="product in products" :key="product.id">
            <!-- Componente de Card -->
            <ProductCard :product="product" class="w-100" @click="setDialog(product.name)" />       
          </v-col>
        </v-row>
      </v-col>
    </v-row>

    <!-- 
    <v-dialog v-model="dialog" max-width="500">
      <v-card>
        
        <v-card-title class="text-h5">
          {{ cardName }}
        </v-card-title>
        <v-img :src="dialogProduct?.image" class="my-4" height="200"></v-img>
        <v-btn elevation="0"  class="" text="MORE DETAILS... " @click="openLink(product.link)"> </v-btn>
          <v-btn class="rounded-0" color="#0E7576" text="ADD TO OWNED" @click="toggleOwned(product)"> </v-btn>
          <v-btn class="rounded-0" color="#947A11" text="ADD TO WISHLIST" @click="toggleWishlist(product)"> </v-btn>    
        <v-btn class="rounded-0" color="red" text="Close Dialog" @click="dialog = false"></v-btn>
      </v-card>
      
    </v-dialog>
    -->

    
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



</style>

