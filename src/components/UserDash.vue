<template>
  <v-main
    style="
      display: flex;
      flex-direction: column;
      height: 100vh;
      max-height: 100vh;
      overflow: hidden;
      --v-layout-top: 0px;
    "
  >
    <v-row no-gutters class="justify-center align-center ml-0 flex-grow-0 flex-shrink-0 pt-md-0">
      <v-card
        color="background"
        class="card-overlay full-screen-card"
        :image="
          user.background_hash
            ? assets + '/Profile/' + user.background_hash
            : assets + '/Profile/profile-bg-warriors-transparent.png'
        "
        flat
      >
        <v-card
          color="transparent"
          height="136"
          class="card-overlay1 full-screen-card"
          flat
        ></v-card>
      </v-card>

      <v-col cols="12" class="avatar-mobile">
        <v-container
          class="mx-auto"
          :style="{ maxWidth: containerMaxWidth }"
        >
          <v-row no-gutters align="end" class="pa-4">
            <v-col cols="auto">
              <v-avatar
                size="100"
                rounded="lg"
                style="
                  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
                  cursor: pointer;
                  position: relative;
                  z-index: 5;
                "
                @click="goToProfile"
              >
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
            <v-col class="ml-n4">
              <div
                class="pa-3 rounded-lg"
                style="
                  background-color: rgba(50, 50, 50, 0.7);
                  backdrop-filter: blur(5px);
                  cursor: pointer;
                  padding-left: 32px !important;
                  position: relative;
                  z-index: 4;
                "
                @click="goToProfile"
              >
                <h5
                  class="text-h6 font-weight-bold text-white"
                  style="line-height: 1.25rem"
                >
                  {{ user.user_name }}
                </h5>
              </div>
            </v-col>
          </v-row>
        </v-container>
      </v-col>
    </v-row>

    <div
      class="flex-grow-1"
      style="
        margin-top: -120px;
        overflow-y: auto;
        min-height: 0;
        z-index: 1;
        width: 100%;
      "
    >
      <v-container
        class="mx-auto px-4 fill-height align-start"
        :style="{ maxWidth: containerMaxWidth }"
      >
        <DashboardEvents style="width: 100%" />
      </v-container>
    </div>

    <div class="pa-4 flex-grow-0 flex-shrink-0">
      <v-container
        style="padding: 0; width: 100%"
        class="mx-auto"
        :style="{ maxWidth: containerMaxWidth }"
      >
        <v-toolbar height="96" rounded="lg" class="px-2" color="primary">
          <v-row no-gutters align="center" class="fill-height ma-0 w-100">
            
            <v-col class="d-flex justify-center align-center">
              <v-btn
                icon
                variant="text"
                @click="goToCampaigns"
                size="x-large"
              >
                <v-icon>mdi-cards</v-icon>
              </v-btn>
            </v-col>
            
            <v-col cols="auto" class="px-2" style="width: 50%; max-width: 250px; min-width: 160px;">
              <v-btn
                color="#118D8E"
                variant="flat"
                @click="openPlaySelection"
                size="x-large"
                rounded="lg"
                class="font-weight-bold w-100"
              >
                <v-icon left class="mr-1">mdi-sword-cross</v-icon>
                Play
              </v-btn>
            </v-col>

            <v-col class="d-flex justify-center align-center">
              <v-btn
                icon
                variant="text"
                @click="goToGroup"
                size="x-large"
              >
                <v-icon>mdi-account-group</v-icon>
              </v-btn>
            </v-col>

          </v-row>
        </v-toolbar>
      </v-container>
    </div>

    <HUB 
      v-model="showHub" 
      :my-events="myEvents" 
      :user="user" 
    />

    <v-dialog v-model="showPlaySelectionDialog" max-width="500">
      <v-card color="grey-darken-4" rounded="xl">
        <v-card-title class="d-flex justify-space-between align-center px-4 pt-4 pb-2">
          <span class="text-h5 font-weight-bold">Choose your adventure</span>
          <v-btn icon variant="text" @click="showPlaySelectionDialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        
        <v-card-text class="pa-0">
          
          <div class="pa-5 text-center">
            <v-img 
              src="@/assets/underkeep2.png" 
              height="140" 
              cover
              class="mb-4 rounded-xl elevation-4"
            ></v-img>
            
            <h3 class="text-h5 font-weight-bold text-green-accent-3 mb-1">Drunagor Nights S2</h3>
            <p class="text-body-2 text-grey-lighten-1 mb-5 px-2">
              Scan the Lobby QR Code to join your party and dive into the new Underkeep adventures.
            </p>
            
            <v-btn 
              color="green-accent-3" 
              variant="flat" 
              rounded="pill" 
              size="x-large"
              block
              class="font-weight-black text-grey-darken-4"
              @click="playDrunagorNights"
            >
              <v-icon left class="mr-2">mdi-qrcode-scan</v-icon>
              Scan Lobby QR Code
            </v-btn>
          </div>

          <v-divider class="mx-6 border-opacity-50" color="grey"></v-divider>

          <div class="pa-5 text-center">
            
            <div class="legacy-cluster mb-6 mt-2">
              <div class="d-flex justify-center align-center ga-6 position-relative z-10">
                <v-img :src="CoreLogo" height="70" max-width="110" contain class="legacy-logo"></v-img>
                <v-img :src="AwakeningsLogo" height="70" max-width="110" contain class="legacy-logo"></v-img>
              </div>
              <div class="d-flex justify-center align-center mt-n6 position-relative z-20">
                <v-img :src="ApocalypseLogo" height="80" max-width="130" contain class="legacy-logo apoc-logo"></v-img>
              </div>
            </div>
            
            <h3 class="text-h5 font-weight-bold text-amber-accent-2 mb-1">Legacy Campaign Tracker</h3>
            <p class="text-body-2 text-grey-lighten-1 mb-5 px-2">
              Manage your classic campaigns from Age of Darkness.
            </p>
            
            <v-btn 
              color="amber-accent-2" 
              variant="flat" 
              rounded="pill" 
              size="x-large"
              block
              class="font-weight-black text-grey-darken-4"
              @click="playLegacyCampaigns"
            >
              <v-icon left class="mr-2">mdi-book-open-page-variant</v-icon>
              Open Tracker
            </v-btn>
          </div>

        </v-card-text>
      </v-card>
    </v-dialog>

  </v-main>
</template>

<script lang="ts" setup>
import { ref, onMounted, computed, inject, onBeforeMount } from "vue";
import { useDisplay } from "vuetify";
import { useUserStore } from "@/store/UserStore";
import { useRouter } from "vue-router";
import { CampaignStore } from "@/store/CampaignStore";
import {
  HeroDataRepository,
  type HeroData,
} from "@/data/repository/HeroDataRepository";
import { HeroStore } from "@/store/HeroStore";
import axios from "axios";
import DashboardEvents from "@/components/DashboardEvents.vue";
import HUB from "@/components/HUB.vue";

// Importando os Logos
import CoreLogo from "@/assets/campaign/logo/core.webp";
import ApocalypseLogo from "@/assets/campaign/logo/apocalypse.webp";
import AwakeningsLogo from "@/assets/campaign/logo/awakenings.webp";

const router = useRouter();
const userStore = useUserStore();
const user = userStore.user;
const campaignStore = CampaignStore();
const heroStore = HeroStore();
const assets = inject<string>("assets");
const heroDataRepository = new HeroDataRepository();
const display = useDisplay();
const loading = ref(true);
const loadingErrors = ref<{ id: number; text: string; visible: boolean }[]>([]);

const showHub = ref(false);
const myEvents = ref<any[]>([]);
const showPlaySelectionDialog = ref(false);

const containerMaxWidth = computed(() => {
  if (display.lgAndUp.value) return "1024px";
  if (display.md.value) return "900px";
  if (display.sm.value) return "768px";
  return "100%";
});

const goToProfile = () => router.push({ name: "PerfilHome" });
const goToLibrary = () => router.push({ name: "Library" });
const goToCampaigns = () => router.push({ name: "HeroesManager" });
const goToEvents = () => router.push({ name: "Events" });
const goToGroup = () => router.push({ name: "SocialHub" });

function importCampaign(token: string) {}
  
const openHub = async () => {
  showHub.value = true;
  if (user && user.users_pk) {
    try {
      const response = await (axios as any).get('/events/my_events/player', {
        params: { player_fk: user.users_pk, past_events: false },
        headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
      });
      const now = new Date();
      myEvents.value = (response.data.events || [])
        .filter((e: any) => new Date(e.event_date) > now)
        .sort((a: any, b: any) => new Date(a.event_date).getTime() - new Date(b.event_date).getTime());
    } catch (e) {
      console.error("Error fetching events for HUB:", e);
      myEvents.value = [];
    }
  }
};

const openPlaySelection = () => {
  showPlaySelectionDialog.value = true;
};

// Abre o componente HUB (Lobby QR Scanner)
const playDrunagorNights = () => {
  showPlaySelectionDialog.value = false;
  openHub();
};

// Navega para a rota do Legacy Tracker
const playLegacyCampaigns = () => {
  showPlaySelectionDialog.value = false;
  router.push({ path: "/campaign-tracker/" });
};

onBeforeMount(async () => {
  campaignStore.reset();
  heroStore.reset();
  loadingErrors.value = [];
  loading.value = true;
  if (!user) {
    loading.value = false;
    return;
  }
  try {
    const res = await (axios as any).get("/rl_campaigns_users/search", {
      params: { users_fk: user.users_pk },
    });
    res.data.campaigns.forEach((element: any) => {
      try {
        importCampaign(element.tracker_hash);
      } catch (e: any) {}
    });
  } catch (apiError) {
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>
/* ESTILOS NOVOS PRO CLUSTER DE LOGOS */
.legacy-cluster {
  position: relative;
  padding: 10px;
}

.legacy-logo {
  /* Filtro de sombra estilo "recorte" da imagem, ótimo para PNG/WebP */
  filter: drop-shadow(0px 8px 12px rgba(0, 0, 0, 0.7));
  transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275), filter 0.3s ease;
  cursor: pointer;
}

/* Efeito ao passar o mouse ou segurar (mobile) */
.legacy-logo:hover {
  transform: scale(1.1) translateY(-4px);
  filter: drop-shadow(0px 12px 20px rgba(255, 213, 79, 0.4)); /* Sombra amarela estilizada */
  z-index: 30 !important;
}

/* Traz o Apocalipse levemente pra frente das outras duas */
.apoc-logo {
  z-index: 20;
}

.z-10 { z-index: 10; }
.z-20 { z-index: 20; }

/* Mantidos os estilos anteriores */
.avatar-mobile {
  position: relative;
  transform: translateY(-55px);
  z-index: 3;
}
.card-overlay {
  position: relative;
  transform: translateY(-6px);
  z-index: 3;
}
.card-overlay1 {
  position: relative;
  transform: translateY(14px);
  z-index: 2;
}
.full-screen-card {
  width: 100%;
  height: 150px;
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
  overflow: hidden;
}
</style>