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
          <v-row no-gutters align="end" class="pa-4 flex-nowrap">
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
            <v-col class="ml-n4" style="min-width: 0;">
              <div
                class="pa-3 rounded-lg"
                style="
                  background-color: rgba(50, 50, 50, 0.7);
                  backdrop-filter: blur(5px);
                  cursor: pointer;
                  padding-left: 32px !important;
                  position: relative;
                  z-index: 4;
                  width: 100%;
                "
                @click="goToProfile"
              >
                <h5
                  class="text-h6 font-weight-bold text-white text-truncate"
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
      :style="{
        marginTop: display.xs ? '-130px' : '-120px',
        overflowY: 'auto',
        minHeight: '0',
        zIndex: 1,
        width: '100%'
      }"
    >
      <v-container
        class="mx-auto px-4 fill-height align-start"
        :style="{ maxWidth: containerMaxWidth }"
      >
        <DashboardEvents style="width: 100%" />
      </v-container>
    </div>

    <div class="pa-2 pa-sm-4 flex-grow-0 flex-shrink-0">
      <v-container
        style="padding: 0; width: 100%"
        class="mx-auto"
        :style="{ maxWidth: containerMaxWidth }"
      >
        <v-toolbar 
          :height="display.xs ? 80 : 96" 
          rounded="lg" 
          class="px-1 px-sm-2" 
          color="primary"
        >
          <v-row 
            no-gutters 
            align="center" 
            justify="space-between" 
            class="fill-height ma-0 w-100 flex-nowrap"
          >
            
            <v-col cols="auto" class="d-flex justify-center align-center">
              <v-btn
                icon
                variant="text"
                @click="goToCampaigns"
                :size="display.xs ? 'large' : 'x-large'"
              >
                <v-icon>mdi-cards</v-icon>
              </v-btn>
            </v-col>
            
            <v-col class="px-2 d-flex justify-center align-center">
              <v-btn
                color="#118D8E"
                variant="flat"
                @click="openPlaySelection"
                :size="display.xs ? 'large' : 'x-large'"
                rounded="lg"
                class="font-weight-bold w-100"
                style="max-width: 250px;" 
              >
                <v-icon left class="mr-1">mdi-sword-cross</v-icon>
                Play
              </v-btn>
            </v-col>

            <v-col cols="auto" class="d-flex justify-center align-center">
              <v-btn
                icon
                variant="text"
                @click="goToGroup"
                :size="display.xs ? 'large' : 'x-large'"
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

    <v-dialog v-model="showPlaySelectionDialog" max-width="500" scrollable>
      <v-card color="grey-darken-4" rounded="xl" max-height="90vh">
        <v-card-title class="d-flex justify-space-between align-center px-4 pt-4 pb-2">
          <span class="text-h5 font-weight-bold">Choose your adventure</span>
          <v-btn icon variant="text" @click="showPlaySelectionDialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        
        <v-card-text class="pa-0" style="overflow-y: auto;">
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

    <v-dialog v-model="showDrunagorSoonDialog" max-width="540" scrollable>
      <v-card color="grey-darken-4" rounded="0" class="overflow-hidden">
        <v-btn
          icon
          variant="text"
          class="soon-close-btn"
          @click="showDrunagorSoonDialog = false"
        >
          <v-icon>mdi-close</v-icon>
        </v-btn>

        <v-card-text class="pa-0 pb-6">
          <img
            :src="Underkeep2Banner"
            alt="Drunagor Nights Season 2"
            class="soon-banner"
          />

          <div class="soon-content px-5 pt-5">
            <p class="text-overline text-green-accent-3 font-weight-bold mb-2">
              Drunagor Nights Season 2
            </p>
            <h3 class="text-h4 font-weight-black text-white mb-4">Coming Soon</h3>

            <div class="soon-media mb-6">
              <video autoplay muted loop playsinline class="soon-video">
                <source
                  :src="assets + '/landing-page/presentation-video.mp4'"
                  type="video/mp4"
                />
              </video>
              <div class="soon-media-overlay"></div>
            </div>

            <div class="text-body-1 text-grey-lighten-1 soon-copy">
              <p class="mb-4">
                Welcome, fierce adventurers.
              </p>
              <p class="mb-4">
                A new descent into the Underkeep is almost upon us. Drunagor
                Nights S2 will soon open the gates to darker paths, deadlier
                encounters, and a brand-new chapter waiting in the shadows.
              </p>
              <p class="mb-4">
                For now, the journey is still being forged. Gather your party,
                keep your blades ready, and stay close. The Darkness is stirring,
                and Season 2 is coming soon.
              </p>
              <p class="mb-0">
                When the time comes, the fate of this adventure will rest in your
                hands once again.
              </p>
            </div>

            <v-btn
              color="green-accent-3"
              variant="flat"
              rounded="pill"
              size="large"
              block
              class="font-weight-black text-grey-darken-4 mt-6"
              @click="showDrunagorSoonDialog = false"
            >
              Stay Ready
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
import { HeroDataRepository } from "@/data/repository/HeroDataRepository";
import { HeroStore } from "@/store/HeroStore";
import axios from "axios";
import DashboardEvents from "@/components/DashboardEvents.vue";
import HUB from "@/components/HUB.vue";

import CoreLogo from "@/assets/campaign/logo/core.webp";
import ApocalypseLogo from "@/assets/campaign/logo/apocalypse.webp";
import AwakeningsLogo from "@/assets/campaign/logo/awakenings.webp";
import Underkeep2Banner from "@/assets/underkeep2.png";

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
const showDrunagorSoonDialog = ref(false);

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

const playDrunagorNights = () => {
  showPlaySelectionDialog.value = false;
  showDrunagorSoonDialog.value = true;
};

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

<style>
.soon-banner {
  display: block;
  width: 100%;
  height: auto;
  background: #111;
}

.soon-content {
  width: 100%;
  box-sizing: border-box;
}

.soon-media {
  position: relative;
  height: 190px;
  overflow: hidden;
  background: #0b0b0b;
}

.soon-video {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transform: scale(1.04);
  filter: saturate(0.95) brightness(0.7);
}

.soon-media-overlay {
  position: absolute;
  inset: 0;
  background:
    linear-gradient(180deg, rgba(6, 6, 6, 0.18) 0%, rgba(6, 6, 6, 0.6) 100%),
    radial-gradient(circle at center, transparent 35%, rgba(0, 0, 0, 0.3) 100%);
}

.soon-close-btn {
  position: absolute !important;
  top: 12px;
  right: 12px;
  z-index: 5;
  background: rgba(15, 15, 15, 0.55) !important;
  backdrop-filter: blur(6px);
}

.soon-copy {
  line-height: 1.7;
}

.legacy-cluster {
  position: relative;
  padding: 10px;
}
.legacy-logo {
  filter: drop-shadow(0px 8px 12px rgba(0, 0, 0, 0.7));
  transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275), filter 0.3s ease;
  cursor: pointer;
}
.legacy-logo:hover {
  transform: scale(1.1) translateY(-4px);
  filter: drop-shadow(0px 12px 20px rgba(255, 213, 79, 0.4));
  z-index: 30 !important;
}
.apoc-logo {
  z-index: 20;
}
.z-10 { z-index: 10; }
.z-20 { z-index: 20; }

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
