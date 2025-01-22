<template>


<v-container class="pa-0 ">
    <!-- Título -->
    <v-row justify="center">
      <v-col cols="12" class="text-center">
        <h1 class="cinzel-text font-weight-black pt-15 pb-4 justify-center text-center text-h2">LIBRARY</h1>
      </v-col>
    </v-row>


  <v-card class="pa-2">
    

    <v-tabs v-model="activeTab" align-tabs="center"
    class="box-shadow centered-tabs d-flex justify-center">
      <v-tab :value="1">All Products</v-tab>
      <v-tab :value="2">Wishlist</v-tab>
      <v-tab :value="3">Owned</v-tab>
    </v-tabs>

    <!-- Conteúdo Condicional das Abas -->
    <div v-if="activeTab === 1">
      <!-- Todos os Produtos -->
      <v-row dense>
        <v-col
          v-for="product in products"
          :key="product.id"
          cols="12"
          sm="6"
          md="3"
        >
<!-- Product Card com Botões -->
<div class="card-wrapper">
        <!-- Componente do Product Card -->
        <ProductCard
          :product="product"
          @click="setDialog(product.name)"
        />
        
          <v-btn
          prepend-icon="mdi-list-box-outline"
           size="small"
            variant="outlined"
            class="movebotao"
            @click="toggleWishlist(product.id)"
          >
            {{ isInWishlist(product.id) ? " - Wishlist" : "+  Wishlist" }}
          </v-btn>
          <v-btn
          prepend-icon="mdi-tag-check-outline"
          variant="outlined"
            size="small"
            class="movebotao2"
            @click="toggleOwned(product.id)"
          >
            {{ isOwned(product.id) ? "-  Owned" : "+ Owned" }}
          </v-btn>
       
      </div>
    </v-col>
      </v-row>
    </div>

    <div v-if="activeTab === 2">
      <!-- Wishlist -->
      <v-row dense>
        <v-col
          v-for="product in wishlistItems"
          :key="product.id"
          cols="12"
          sm="6"
          md="4"
        >

          <v-card>
            <ProductCard
              :product="product"
              class="w-100"
              @click="setDialog(product.name)"
            />
            <v-btn
           size="small"
           prepend-icon="mdi-list-box-outline"
            variant="outlined"
            class="movebotao3"
            @click="toggleWishlist(product.id)"
          >
            {{ isInWishlist(product.id) ? " - Wishlist" : "+  Wishlist" }}
          </v-btn>
          </v-card>
        </v-col>
      </v-row>
    </div>

    <div v-if="activeTab === 3">
      <!-- Owned -->
      <v-row dense>
        <v-col
          v-for="product in ownedItems"
          :key="product.id"
          cols="12"
          sm="6"
          md="4"
        >
          <v-card>
            <ProductCard
              :product="product"
              class="w-100"
              @click="setDialog(product.name)"
            />
          <v-btn
          variant="outlined"
          prepend-icon="mdi-tag-check-outline"
            size="small"
            class="movebotao3"
            @click="toggleOwned(product.id)"
          >
            {{ isOwned(product.id) ? "- to Owned" : "+ to Owned" }}
          </v-btn>
          </v-card>
        </v-col>
      </v-row>
    </div>
  </v-card>
  </v-container>

  

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


const activeTab = ref(1);
const wishlist = ref<number[]>([]);
const owned = ref<number[]>([]);

const toggleWishlist = (productId: number) => {
  const index = wishlist.value.indexOf(productId);
  if (index === -1) {
    wishlist.value.push(productId);
    const ownedIndex = owned.value.indexOf(productId);
    if (ownedIndex !== -1) owned.value.splice(ownedIndex, 1);
  } else {
    wishlist.value.splice(index, 1);
  }
};

const toggleOwned = (productId: number) => {
  const index = owned.value.indexOf(productId);
  if (index === -1) {
    owned.value.push(productId);
    const wishlistIndex = wishlist.value.indexOf(productId);
    if (wishlistIndex !== -1) wishlist.value.splice(wishlistIndex, 1);
  } else {
    owned.value.splice(index, 1);
  }
};

const isInWishlist = (productId: number) => {
  return wishlist.value.includes(productId);
};

const isOwned = (productId: number) => {
  return owned.value.includes(productId);
};

const wishlistItems = computed(() =>
  products.value.filter((product) => wishlist.value.includes(product.id))
);
const ownedItems = computed(() =>
  products.value.filter((product) => owned.value.includes(product.id))
);




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
  position: 0;
  /* Move a imagem 10px para cima */
}

.box-shadow {
  background-color: rgba(0, 0, 0, 0.25); /* Preto com 70% de opacidade */
  
}

.centered-tabs {
  width: 100%;
}


.movebotao{
  position: absolute;
  margin-left: 162px;
  margin-top: -38px;
}

.movebotao2{
  position: absolute;
  margin-left: 162px;
  margin-top: -72px;
}

.movebotao3{
  position: absolute;
  margin-left: 208px;
  margin-top: -38px;
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
