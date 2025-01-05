<template>
  <!-- Profile Section -->
  <v-main>
    <v-row class="mt-4 d-flex justify-center align-center ma-0 w-100">
      <v-col cols="12" sm="10" md="8" class="px-6">
        <v-card class="pa-4">
          <v-row no-gutters>
            <v-col cols="3">
              <v-avatar size="100">
                <v-img
                  :src="
                    user.picture_hash
                      ? assets + '/Profile/' + user.picture_hash
                      : assets + '/Profile/user.png'
                  "
                  alt="Profile"
                />
              </v-avatar>
            </v-col>
            <v-col cols="9">
              <!-- Exibe o username -->
              <v-card-title>{{ user.user_name }}</v-card-title>

              <!-- <v-card-subtitle>RANKING: 5123</v-card-subtitle> -->
              <!-- Icons below the name -->
              <!-- <v-row no-gutters>
              <v-col cols="auto" class="mr-2 pl-3">
                <v-icon>mdi-shield</v-icon>
              </v-col>
              <v-col cols="auto" class="mr-2">
                <v-icon>mdi-sword</v-icon>
              </v-col>
              <v-col cols="auto" class="mr-2">
                <v-icon>mdi-book</v-icon>
              </v-col>
              <v-col cols="auto">
                <v-icon>mdi-map</v-icon>
              </v-col>
            </v-row> -->
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>

    <!-- Navigation Drawer -->

    <!-- Navigation Boxes Section -->
    <v-row class="mt-2 d-flex justify-center align-center ma-0 w-100">
      <v-col cols="12" sm="10" md="8" class="px-6">
        <!-- Primeiro Carrossel para dispositivos móveis -->
        <v-carousel
          :height="isMobile ? '400px' : 'auto'"
          hide-delimiters
          v-if="isMobile"
        >
          <v-carousel-item
            v-for="(item, index) in carouselItems"
            :key="index"
            class="d-flex justify-center"
          >
            <v-card
              :style="{ height: isMobile ? '400px' : 'auto' }"
              class="mx-auto"
              :disabled="index > 0 ? true : false"
              @click="router.push(item.route)"
            >
              <v-img
                :src="item.img"
                height="300"
                cover
                :gradient="
                  index > 0 ? 'to top, rgba(0,0,0,1), rgba(0,0,0,.6)' : false
                "
              />
              <v-card-actions>
                <v-row class="d-flex justify-center">
                  <v-btn class="text-center">{{ item.label }}</v-btn>
                </v-row>
              </v-card-actions>
              <div
                v-if="index > 0"
                style="
                  height: 0px;
                  width: 100%;
                  position: relative;
                  left: 0;
                  bottom: 200px;
                "
                class="text-center"
              >
                WIP
              </div>
            </v-card>
          </v-carousel-item>
        </v-carousel>

        <v-row v-else align="center" justify="center">
          <v-col
            cols="12"
            md="4"
            lg="3"
            v-for="(item, index) in carouselItems"
            :key="index"
          >
            <v-hover v-slot="{ isHovering, props }">
              <v-card
                :class="{ 'on-hover': isHovering }"
                :elevation="isHovering ? 12 : 2"
                v-bind="props"
                :disabled="index > 0 ? true : false"
                @click="router.push(item.route)"
              >
                <v-img
                  :src="item.img"
                  height="300"
                  cover
                  :gradient="
                    index > 0 ? 'to top, rgba(0,0,0,1), rgba(0,0,0,.6)' : false
                  "
                />
                <v-card-actions>
                  <v-row class="d-flex justify-center">
                    <v-btn class="text-center">{{ item.label }}</v-btn>
                  </v-row>
                </v-card-actions>
                <div
                  v-if="index > 0"
                  style="
                    height: 0px;
                    width: 100%;
                    position: relative;
                    left: 0;
                    bottom: 200px;
                  "
                  class="text-center"
                >
                  WIP
                </div>
              </v-card>
            </v-hover>
          </v-col>
        </v-row>
      </v-col>
    </v-row>

    <!-- Carousel Section -->

    <v-row class="mt-4 d-flex justify-center align-center w-100" no-gutters>
      <v-col cols="12" sm="10" md="8" class="px-5 mb-0">
        <v-carousel hide-delimiters v-if="campaignList.length > 0">
          <v-carousel-item
            v-for="(item, index) in campaignStore.findAll()"
            :key="index"
          >
            <v-row no-gutters class="justify-center">
              <v-col cols="10">
                <v-card class="mx-auto">
                  <v-img src="@/assets/campaign.jpg" height="200" cover />
                  <v-card-title>
                    {{ item.campaign }}
                  </v-card-title>
                  <v-card-subtitle v-if="item.name">
                    {{ item.name }}
                  </v-card-subtitle>
                  <v-card-text>
                    <v-row no-gutters class="justify-center">
                      <v-col
                        cols="4"
                        sm="2"
                        md="2"
                        lg="2"
                        xl="1"
                        class="d-flex justify-center"
                        v-for="hero in findHeroes(item.campaignId)"
                        :key="hero.heroId"
                      >
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
                <v-btn @click="router.push({ name: 'Campaign Overview' })"
                  >create campaign</v-btn
                >
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
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
import CampaignOverviewView from "@/components/CampaignOverviewView.vue";

const campaignStore = CampaignStore();

const campaignList = computed(() => {
  return campaignStore.findAll();
});

const heroStore = HeroStore();

const router = useRouter();

const user = useUserStore().user;

const display = ref(useDisplay());

const assets = inject<string>("assets");

// Configurações de evento para rolagem
onMounted(() => {});

// Verificação de mobile
const isMobile = computed(() => {
  console.log(display.value.mdAndUp);
  return !display.value.mdAndUp;
});

// Dados do carrossel
const carouselItems = ref([
  {
    img: new URL("@/assets/perfil.webp", import.meta.url).href,
    label: "CAMPAIGN",
    route: { name: "CampaignTracker" },
  },
  {
    img: new URL("@/assets/Corebox.png", import.meta.url).href,
    label: "LIBRARY",
    route: { name: "Library" },
  },
  {
    img: new URL("@/assets/events.jpg", import.meta.url).href,
    label: "EVENTS",
    route: { name: "Library" },
  },
  {
    img: new URL("@/assets/leaderboard.jpg", import.meta.url).href,
    label: "LEADERBOARD",
    route: { name: "Library" },
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
</style>