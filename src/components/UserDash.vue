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
                @click="openHub"
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

// Variáveis para o HUB
const showHub = ref(false);
const myEvents = ref<any[]>([]);

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
  // Busca rápida dos eventos confirmados para exibir no HUB
  if (user && user.users_pk) {
    try {
      const response = await (axios as any).get('/events/my_events/player', {
        params: { player_fk: user.users_pk, past_events: false },
        headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
      });
      // Filtra e ordena (lógica similar ao DashboardEvents)
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