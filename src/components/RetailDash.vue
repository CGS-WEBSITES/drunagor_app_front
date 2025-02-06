<template>
  <!-- Profile Section -->
  <v-main>
    <!-- PC -->
    <v-row class="d-none d-md-flex justify-center align-center ml-16">

      <v-col cols="12" sm="10" md="8" class="px-6">
        <v-row no-gutters>
          <v-col cols="4">
            <v-avatar size="200" rounded="0" class="avatar-overlay">
              <v-img :src="user.picture_hash
                ? assets + '/Profile/' + user.picture_hash
                : assets + '/Profile/user.png'
                " alt="Profile" style="
                  border: 0.5px solid black;
                  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
                  background-color: black;
                  " />
            </v-avatar>
            
            <v-card-title class="user_name text-h3">{{ user.user_name }}</v-card-title>
          </v-col>
          (Retailer)
        </v-row>
      </v-col>
    </v-row>

    <!-- MOBILE -->
    <v-row class="d-md-none justify-center align-center ml-0">
      <v-card color="primary" class="card-overlay full-screen-card" :image="assets + '/Profile/profile-bg-warriors-transparent.png'"
        flat>
      </v-card>
      <v-col cols="12">
        <v-row no-gutters>
          <v-col cols="8" class="avatar-mobile">
            <v-avatar size="140" rounded="0">
              <v-img :src="user.picture_hash
                ? assets + '/Profile/' + user.picture_hash
                : assets + '/Profile/user.png'
                " alt="Profile" style="
                border: 3.5px solid black;
                box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
                background-color: black;
              " />
            </v-avatar>
            <v-card-title class="user_name2 text-h5">{{ user.user_name }}</v-card-title>
          </v-col>
        </v-row>
      </v-col>
    </v-row>


    <!-- Navigation Drawer -->
    <v-row class="mt-4 d-none d-md-flex justify-center align-center ma-0 w-100">
      <v-col cols="12" sm="12" md="8" class="px-6">
        <v-card color="hprimary" class="move_topo pt-12">

          <!-- Navigation Boxes Section -->
          <v-row class="mt-2 d-flex justify-center align-center ma-0 w-100">
            <v-col cols="12" sm="12" md="12" class="px-6 pt-12">
              <!-- Primeiro Carrossel para dispositivos móveis -->
              <v-carousel :height="isMobile ? '400px' : 'auto'" hide-delimiters v-if="isMobile">
                <v-carousel-item v-for="(item, index) in carouselItems" :key="index">
                  <v-row no-gutters class="justify-center">
                    <v-col cols="12">
                      <v-card :style="{ height: isMobile ? '400px' : 'auto' }" class="mx-auto"
                        :disabled="index > 0 ? true : false" @click="router.push(item.route)">
                        <v-img style="background-color: rgb(0, 0, 0)" :src="item.img" height="500" cover :gradient="index > 0
                          ? 'to top, rgba(0,0,0,1), rgba(0,0,0,.6)'
                          : false
                          " />
                        <v-card-actions>
                          <v-row class="d-flex justify-center">
                            <v-btn class="text-center">{{ item.label }}</v-btn>
                          </v-row>
                        </v-card-actions>
                        <div v-if="index > 0" style="
                      height: 0px;
                      width: 100%;
                      position: relative;
                      left: 0;
                      bottom: 200px;
                    " class="text-center">
                          <coming-soon></coming-soon>
                        </div>
                      </v-card>
                    </v-col>
                  </v-row>
                </v-carousel-item>
              </v-carousel>

              <v-row v-else align="center" justify="center">
                <v-col cols="12" md="4" lg="3" v-for="(item, index) in carouselItems" :key="index">
                  <v-hover v-slot="{ isHovering, props }">
                    <v-card color="primary" :class="{ 'on-hover': isHovering }" :elevation="isHovering ? 12 : 2" v-bind="props"
                      :disabled="index > 3 ? true : false" @click="router.push(item.route)">
                      <v-img :src="item.img" height with cover :gradient="index > 3 ? 'to top, rgba(0,0,0,1), rgba(0,0,0,.6)' : false
                        " />
                      <v-card-actions colo>
                        <v-row class="d-flex justify-center">
                          <v-btn class="text-center">{{ item.label }}</v-btn>
                        </v-row>
                      </v-card-actions>
                      <div v-if="index > 3" style="
                    height: 0px;
                    width: 100%;
                    position: relative;
                    left: 0;
                    bottom: 200px;
                  " class="text-center">
                        <coming-soon></coming-soon>
                      </div>
                    </v-card>
                  </v-hover>
                </v-col>
              </v-row>
            </v-col>
          </v-row>

<!--
          <v-row class="mt-4 d-flex justify-center align-center  py-6" no-gutters>
            <v-col cols="12" sm="12" md="12" class="px-5 mb-0">
              <v-carousel hide-delimiters v-if="campaignList.length > 0" :height="isMobile ? '400px' : 'auto'">
                <v-carousel-item v-for="(item, index) in campaignStore.findAll()" :key="index">
                  <v-row no-gutters class="justify-center">
                    <v-col cols="10" sm="10" md="12">
                      <v-card class="mx-auto" @click="
                        router.push({
                          name: 'Campaign',
                          params: { id: item.campaignId },
                        })
                        ">
                        <v-img :src="assets + '/Dashboard/img-campaigncore(1).png'" height with cover />
                        <v-card-title>
                          {{ item.campaign }}
                        </v-card-title>
                        <v-card-subtitle v-if="item.name">
                          {{ item.name }}
                        </v-card-subtitle>
                        <v-card-text>
                          <v-row no-gutters>
                            <v-col cols="4" sm="2" md="2" lg="2" xl="1" class="d-flex"
                              v-for="hero in findHeroes(item.campaignId)" :key="hero.heroId">
                              <v-avatar :image="hero.images.avatar" size="40" />
                            </v-col>
                          </v-row>
                        </v-card-text>
                      </v-card>
                    </v-col>
                  </v-row>
                </v-carousel-item>
              </v-carousel>

              <v-row v-else no-gutters class="justify-center py-6">
                <v-col cols="12">
                  <v-card class="mx-auto">
                    <v-card-title class="mx-auto text-center">
                      You don't have any campaign saved yet. Click on the folowing
                      button to create one
                    </v-card-title>
                    <v-card-actions class="d-flex justify-center">
                      <v-btn @click="router.push({ name: 'Campaign Overview' })">create campaign</v-btn>
                    </v-card-actions>
                  </v-card>
                </v-col>
              </v-row>
            </v-col>
          </v-row>

                    <v-card-title class="text-h4">
            MY LIBRARY
          </v-card-title>
          <v-row dense>
            <v-col v-for="(item, index) in libraryItems" :key="index" :cols="12" :sm="6" class="px-2 py-4">
              <div class="library-item" :style="{
                backgroundImage: `url(${item.image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }" @click="$router.push({ name: 'Library' })">
                <h3 class="library-title">{{ item.name }}</h3>
              </div>
            </v-col>
          </v-row>
    -->



        </v-card>






      </v-col>
    </v-row>

    <!-- Navigation Drawer -->
    <v-row class="move_topo2 d-md-none justify-center align-center ">
      <v-col cols="12" sm="12" md="12" class="px-0">

        <!-- Navigation Boxes Section -->


        <v-row class="d-sm justify-center align-center ma-0 w-100" justify="center">
          <v-col cols="6" v-for="(item, index) in carouselItems" :key="index">
            <v-hover v-slot="{ isHovering, props }">
              <v-card :class="{ 'on-hover': isHovering }" :elevation="isHovering ? 12 : 2" v-bind="props"
                :disabled="index > 3 ? true : false" @click="router.push(item.route)">
                <v-img :src="item.img" height with cover :gradient="index > 3 ? 'to top, rgba(0,0,0,1), rgba(0,0,0,.6)' : false
                  " />
                <v-card-actions>
                  <v-row class="d-flex justify-center">
                    <v-btn class="text-center">{{ item.label }}</v-btn>
                  </v-row>
                </v-card-actions>
                <div v-if="index > 3" style="
                    height: 0px;
                    width: 100%;
                    position: relative;
                    left: 0;
                    bottom: 200px;
                  " class="text-center">
                  <coming-soon></coming-soon>
                </div>
              </v-card>
            </v-hover>
          </v-col>
        </v-row>

<!--
        <v-row class="d-flex justify-center align-center w-100 " no-gutters>
          <v-col cols="12" sm="12" md="12" class="px-0 mb-0">
            <v-carousel show-arrows="hover" hide-delimiters v-if="campaignList.length > 0" height="500">
              <v-carousel-item v-for="(item, index) in campaignStore.findAll()" :key="index">
                <v-row no-gutters class="justify-center">
                  <v-col cols="12" sm="12" md="12">
                    <v-card class="mx-4" @click="
                      router.push({
                        name: 'Campaign',
                        params: { id: item.campaignId },
                      })
                      ">
                      <v-img :src="assets + '/Dashboard/img-campaigncore.png'" height with cover />
                      <v-card-title>
                        {{ item.campaign }}
                      </v-card-title>
                      <v-card-subtitle v-if="item.name">
                        {{ item.name }}
                      </v-card-subtitle>
                      <v-card-text>
                        <v-row no-gutters>
                          <v-col cols="1" sm="2" md="2" lg="2" xl="1" class="d-flex"
                            v-for="hero in findHeroes(item.campaignId)" :key="hero.heroId">
                            <v-avatar :image="hero.images.avatar" size="40" />
                          </v-col>
                        </v-row>
                      </v-card-text>
                    </v-card>
                  </v-col>
                </v-row>
              </v-carousel-item>
            </v-carousel>

            <v-row v-else no-gutters class="justify-center py-6">
              <v-col cols="10">
                <v-card class="mx-auto">
                  <v-card-title>
                    You don't have any campaign saved yet. Click on the folowing
                    button to create one
                  </v-card-title>
                  <v-card-actions class="d-flex justify-center">
                    <v-btn @click="router.push({ name: 'Campaign Overview' })">create campaign</v-btn>
                  </v-card-actions>
                </v-card>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
        <v-card-title class="librarytext text-h5">
          MY LIBRARY
        </v-card-title>
        <v-row dense>
          <v-col v-for="(item, index) in libraryItems" :key="index" :cols="12" class="px-4 py-2">
            <div class="library-item2" :style="{
              backgroundImage: `url(${item.image})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }">
              <h3 class="library-title">{{ item.name }}</h3>
            </div>
          </v-col>
        </v-row>
    -->





      </v-col>
    </v-row>

    <!-- Main Event Cards Section -->
    <!-- <v-row class="mt-4 d-flex justify-center align-center ma-0 w-100 " >
    <v-col cols="12" sm="10" md="8" class="px-2 bg-black rounded">
      <v-card-text
        class="text-h4 white--text color-white bg-black "
        color="white"
      >
        EVENTS
      </v-card-text> -->

    <!-- Main Event Cards -->

    <!-- <v-row class="mt-4 d-flex justify-center align-center ma-0 w-100" > -->
    <!-- Next Section (visible on desktop, hidden on mobile) -->
    <!-- <v-col cols="12" md="6">
          <v-card class="pa-4" color="grey-darken-4" dark>
            <v-card-title class="white--text hidden-sm-and-down"
              >Next</v-card-title
            > -->
    <!-- Container com rolagem -->
    <!-- <div style="max-height: 300px; overflow-y: auto">
              <v-list>
                <v-list-item
                  v-for="i in 10"
                  :key="i"
                  class="mb-4"
                  color="rgba(0,0,0,0.6)"
                  elevation="6"
                  shaped
                  @click="openDialog(i)"
                >
                  <v-list-item-content>
                    <v-row>
                      <v-col cols="3">
                        <v-avatar size="60">
                          <v-img
                            src="@/assets/perfil.webp"
                            alt="Profile"
                          ></v-img>
                        </v-avatar>
                      </v-col>
                      <v-col cols="6">
                        <v-list-item-title class="text-h6 white--text">
                          EVENTO DE LANÇAMENTO DRUNAGOR APP {{ i }}
                        </v-list-item-title>
                        <v-list-item-subtitle
                          class="text-subtitle-2 white--text"
                        >
                          JORGINHO ULTIMATE MEGA STORE PLUS
                        </v-list-item-subtitle>
                      </v-col>
                      <v-col cols="3" class="text-right">
                        <v-icon
                          color="red"
                          size="40"
                          @click.stop="openGoogleMaps"
                          >mdi-map-marker</v-icon
                        >
                        <v-list-item-subtitle
                          class="text-subtitle-1 white--text"
                          >12/29/24</v-list-item-subtitle
                        >
                      </v-col>
                    </v-row>
                  </v-list-item-content>
                </v-list-item>
              </v-list>
            </div>
          </v-card>
        </v-col> -->

    <!-- Count Me In Section (visible on desktop, hidden on mobile) -->
    <!-- <v-col cols="12" md="6">
          <v-card class="pa-4 hidden-sm-and-down" color="grey-darken-4" dark>
            <v-card-title class="white--text hidden-sm-and-down"
              >Count Me In</v-card-title
            >
            <div style="max-height: 300px; overflow-y: auto">
              <v-list>
                <v-list-item
                  v-for="i in 10"
                  :key="i"
                  class="mb-4"
                  color="rgba(0,0,0,0.6)"
                  elevation="6"
                  shaped
                  @click="openDialog(i)"
                >
                  <v-list-item-content>
                    <v-row>
                      <v-col cols="3">
                        <v-avatar size="60">
                          <v-img
                            src="@/assets/perfil.webp"
                            alt="Profile"
                          ></v-img>
                        </v-avatar>
                      </v-col>
                      <v-col cols="6">
                        <v-list-item-title class="text-h6 white--text">
                          EVENTO DE LANÇAMENTO DRUNAGOR APP {{ i }}
                        </v-list-item-title>
                        <v-list-item-subtitle
                          class="text-subtitle-2 white--text"
                        >
                          JORGINHO ULTIMATE MEGA STORE PLUS
                        </v-list-item-subtitle>
                      </v-col>
                      <v-col cols="3" class="text-right">
                        <v-icon
                          color="red"
                          size="40"
                          @click.stop="openGoogleMaps"
                          >mdi-map-marker</v-icon
                        >
                        <v-list-item-subtitle
                          class="text-subtitle-1 white--text"
                          >12/29/24</v-list-item-subtitle
                        >
                      </v-col>
                    </v-row>
                  </v-list-item-content>
                </v-list-item>
              </v-list>
            </div>
          </v-card>
        </v-col>
      </v-row> -->

    <!-- Dialog for Event Details -->
    <!-- <v-dialog v-model="dialog" max-width="600px">
        <v-card>
          <v-card-title
            class="headline d-flex justify-space-between align-center"
            style="padding-right: 16px"
          >
            <span>EVENTO DE LANÇAMENTO DRUNAGOR APPD</span>
            <v-btn
              icon
              @click="closeDialog"
              style="position: absolute; top: 8px; right: 8px"
            >
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-card-title>

          <v-card-subtitle>
            *event description* Lorem Ipsum is simply dummy text of the printing
            and typesetting industry.
          </v-card-subtitle>

          <v-card-text>
            <v-row>
              <v-col cols="12" sm="4">
                <v-avatar size="100">
                  <v-img src="@/assets/perfil.webp" alt="Event"></v-img>
                </v-avatar>
              </v-col>
              <v-col cols="12" sm="8">
                <v-list-item-title
                  >JORGINHO ULTIMATE MEGA STORE PLUS</v-list-item-title
                >
                <v-list-item-subtitle
                  >Engenheiro José Carlos de Morais Sarmento,
                  5747</v-list-item-subtitle
                >
                <v-row>
                  <v-col cols="auto">
                    <v-icon>mdi-shield</v-icon>
                    <v-icon>mdi-sword</v-icon>
                    <v-icon>mdi-book</v-icon>
                    <v-icon>mdi-map</v-icon>
                  </v-col>
                  <v-col class="d-flex justify-end">
                    <v-icon>mdi-facebook</v-icon>
                    <v-icon>mdi-instagram</v-icon>
                    <v-icon>mdi-twitter</v-icon>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>

            <v-divider></v-divider>

            <v-card-subtitle class="mt-4">REWARDS:</v-card-subtitle>
            <v-list-item>
              <v-avatar size="60">
                <v-img src="@/assets/perfil.webp"></v-img>
              </v-avatar>
              <v-list-item-content>
                <v-list-item-title>Reward Name</v-list-item-title>
                <v-list-item-subtitle
                  >Reward description goes here...</v-list-item-subtitle
                >
              </v-list-item-content>
            </v-list-item>

            <v-list-item>
              <v-avatar size="60">
                <v-img src="@/assets/perfil.webp"></v-img>
              </v-avatar>
              <v-list-item-content>
                <v-list-item-title>Drunagor APP Badges</v-list-item-title>
                <v-list-item-subtitle
                  >Check-in at the event to get an exclusive
                  badge!</v-list-item-subtitle
                >
              </v-list-item-content>
            </v-list-item>
          </v-card-text>

          <v-divider></v-divider> -->

    <!-- Updated Button Section -->
    <!-- <v-card-actions>
            <v-row class="d-flex justify-space-between">
              <v-col>
                <v-btn
                  block
                  color="#a87945"
                  class="text-uppercase white--text"
                  @click="closeDialog"
                  >MAYBE I'LL GO</v-btn
                >
              </v-col>
              <v-col>
                <v-btn
                  block
                  color="green darken-1"
                  class="text-uppercase white--text"
                  @click="closeDialog"
                  >COUNT ME IN</v-btn
                >
              </v-col>
            </v-row>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-col>
  </v-row> -->

    <!-- My Library Section -->

    <!-- Title for My Library -->
    <!-- <v-row class="mt-4 d-flex justify-center align-center ma-0 w-100">
      <v-col cols="12" sm="10" md="8" class="px-6">
        <v-card-title class="text-h5 font-weight-bold">MY LIBRARY</v-card-title>
      </v-col>
    </v-row>

    <v-row class="mt-4 justify-center ma-0">
      <v-col cols="12" sm="10" md="8">
        <v-row justify="center" align="center">
          <v-col cols="12" md="6" class="d-flex justify-center">
            <v-btn
              color="grey darken-2"
              class="white--text w-100 mb-4"
              height="60"
            >
              AWAKENINGS
            </v-btn>
          </v-col>
          <v-col cols="12" md="6" class="d-flex justify-center">
            <v-btn
              color="grey darken-2"
              class="white--text w-100 mb-4"
              height="60"
            >
              COREBOX
            </v-btn>
          </v-col>
        </v-row>

        <v-row justify="center" align="center">
          <v-col cols="12" md="6" class="d-flex justify-center">
            <v-btn
              color="grey darken-2"
              class="white--text w-100 mb-4"
              height="60"
            >
              APOCALYPSE
            </v-btn>
          </v-col>
          <v-col cols="12" md="6" class="d-flex justify-center">
            <v-btn
              color="grey darken-2"
              class="white--text w-100 mb-4"
              height="60"
            >
              RISE OF THE UNDEAD DRAGON
            </v-btn>
          </v-col>
        </v-row>
      </v-col>
    </v-row> -->

    <!-- Manage Library Button -->
    <!-- <v-row class="mt-4">
      <v-col cols="12" class="text-right">
        <v-btn small outlined color="black"> MANAGE LIBRARY </v-btn>
      </v-col>
    </v-row> -->

    <!-- Notification Button -->
    <!-- <v-row class="position-fixed bottom-0 right-0 mb-16 mr-6">
    <v-col cols="auto">
      <v-badge color="red" content="10" overlap>
        <v-btn fab dark color="black" @click="showPopup = !showPopup">
          <v-icon>mdi-bell</v-icon>
        </v-btn>
      </v-badge>
    </v-col>
  </v-row> -->

    <!-- Notification Dialog -->
    <!-- <v-dialog v-model="showPopup" max-width="600px">
    <v-card>
      <v-card-title>Notificações</v-card-title>
      <v-card-text>
        Conteúdo do diálogo
      </v-card-text>
      <v-card-actions>
        <v-btn text @click="showPopup = false">Fechar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog> -->
  </v-main>
</template>

<script lang="ts" setup>
import { ref, onMounted, computed, inject } from "vue";
import { useDisplay } from "vuetify";
import { useUserStore } from "@/store/UserStore";
import { useRouter } from "vue-router";
import { CampaignStore } from "@/store/CampaignStore";
import { HeroDataRepository } from "@/data/repository/HeroDataRepository";
import { HeroStore } from "@/store/HeroStore";



const campaignStore = CampaignStore();

const campaignList = computed(() => {
  return campaignStore.findAll();
});

const heroStore = HeroStore();

const router = useRouter();

const user = useUserStore().user;

const display = ref(useDisplay());

const assets = inject<string>("assets");

const campFig = (campName: string) => {

  console.log(campName)
  switch (campName) {
    case 'apocalypse':
      return assets + '/Dashboard/img-campaigncore.png';
    case 'core':
      return "400";
    case 'core':
      return "500";
    case 'core':
      return "500";
    case 'core':
      return "600";
    case 'core':
      return "700";
  }

}
// Configurações de evento para rolagem
onMounted(() => { });

// Verificação de mobile
const isMobile = computed(() => {
  console.log(display.value.mdAndUp);
  return !display.value.mdAndUp;
});

// Dados do carrossel
const carouselItems = ref([
  {
    img: new URL(assets + "/Dashboard/btn-campaigns.png", import.meta.url).href,
    label: "CAMPAIGN MANAGER",
    route: { name: "CampaignTracker" },
  },
  {
    img: new URL(assets + "/Dashboard/btn-library.png", import.meta.url).href,
    label: "SKUS MANAGER",
    route: { name: "Library" },
  },
  {
    img: new URL(assets + "/Dashboard/btn-profile.png", import.meta.url).href,
    label: "MY STORE",
    route: { name: "PerfilHome" },
  },

  {
    img: new URL(assets + "/Dashboard/btn-events.png", import.meta.url).href,
    label: "EVENTS",
    route: { name: "Events" },
  },
]);


const libraryItems = ref([
  {
    name: "COREBOX",
    image: new URL(assets + "/Dashboard/btn-corebox.png", import.meta.url).href,
  },
  {
    name: "DESERT OF HELLSCAR",
    image: new URL(assets + "/Dashboard/btn-hellscar.png", import.meta.url).href,
  },
  {
    name: "APOCALYPSE",
    image: new URL(assets + "/Dashboard/btn-apoc.png", import.meta.url).href,
  },
  {
    name: "AWAKENINGS",
    image: new URL(assets + "/Dashboard/btn-awakenings.png", import.meta.url).href,
  },
]);




// Variáveis reativas
const showPopup = ref(false);
const dialog = ref(false);

const closeDialog = () => {
  dialog.value = false;
};

const openGoogleMaps = (place: { name: string }) => {
  const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    place.name
  )}`;
  window.open(url, "_blank");
};

const heroDataRepository = new HeroDataRepository();

function findHeroes(campaignId: string): HeroData[] {
  const heroes: HeroData[] = [];
  heroStore.findAllInCampaign(campaignId).forEach((hero) => {
    heroes.push(heroDataRepository.find(hero.heroId) ?? ({} as HeroData));
  });

  return heroes;
}
</script>






<style>
.v-badge__badge {
  position: absolute;
  top: -5px;
  right: -5px;
  color: rgb(266, green, blue);
}

.avatar-overlay {
  position: relative;
  transform: translateY(-18px);
  z-index: 2;
}

.avatar-mobile {
  position: relative;
  transform: translateY(-130px);

  z-index: 3
}

.card-overlay {
  position: relative;
  transform: translateY(-6px);
  z-index: 2;
}

.user_name {
  position: relative;
  transform: translateY(-145px) translateX(204px);
  z-index: 2;
}

.user_name2 {
  position: relative;
  transform: translateY(-85px) translateX(130px);
  z-index: 2;
}

.move_topo {
  position: relative;
  transform: translateY(-150px);
}

.move_topo2 {
  position: relative;
  transform: translateY(-180px) translateX(12px);
}

.full-screen-card {
  width: 100vw;
  height: 24vh;
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  position: relative;
  z-index: 1;
}

body {
  font-family: "Poppins", sans-serif !important;
}

.library-item {
  width: 100%;
  height: 50px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: left;
  padding-left: 16px;
  color: white;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.7);
  overflow: hidden;
}

.library-item2 {
  transform: translateY(-195px);
  width: 100%;
  height: 50px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: left;
  padding-left: 16px;
  color: white;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.7);
  overflow: hidden;
}

.librarytext {
  transform: translateY(-195px);
}


.library-title {
  font-size: 1.2rem;
  font-weight: bold;
  margin: 0;
}
</style>
