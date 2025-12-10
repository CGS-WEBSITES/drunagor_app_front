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
    <v-row no-gutters class="justify-center align-center ml-0 flex-grow-0 flex-shrink-0">
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

<<<<<<< HEAD
    <v-row class="mt-4 d-none d-md-flex justify-center align-center ma-0 w-100">
      <v-col cols="12" sm="12" md="8" class="px-6">
        <v-card color="primary" height="116px" class="move_topo pt-12"></v-card>
        <v-card color="background" class="move_topo pt-12">
          <v-row class="mt-2 d-flex justify-center align-center ma-0 w-100">
            <v-col cols="12" sm="12" md="12" class="ml-5 pt-12">
              <v-carousel
                :height="isMobile ? '400px' : 'auto'"
                hide-delimiters
                v-if="isMobile"
              >
                <v-carousel-item
                  v-for="(item, index) in carouselItems"
                  :key="index"
                >
                  <v-row no-gutters class="justify-center">
                    <v-col cols="12">
                      <v-card
                        :style="{ height: isMobile ? '400px' : 'auto' }"
                        class="mx-auto"
                        :disabled="index > 0 ? true : false"
                        @click="router.push(item.route)"
                      >
                        <v-img
                          style="background-color: rgb(0, 0, 0)"
                          :src="item.img"
                          height="500"
                          cover
                          :gradient="
                            index > 0
                              ? 'to top, rgba(0,0,0,1), rgba(0,0,0,.6)'
                              : false
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
                          <coming-soon></coming-soon>
                        </div>
                      </v-card>
                    </v-col>
                  </v-row>
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
                      color="primary"
                      :class="{ 'on-hover': isHovering }"
                      :elevation="isHovering ? 12 : 2"
                      v-bind="props"
                      :disabled="index > 3 ? true : false"
                      @click="router.push(item.route)"
                    >
                      <v-img
                        :src="item.img"
                        height
                        with
                        cover
                        :gradient="
                          index > 3
                            ? 'to top, rgba(0,0,0,1), rgba(0,0,0,.6)'
                            : false
                        "
                      />
                    </v-card>
                  </v-hover>
                </v-col>
              </v-row>
            </v-col>
          </v-row>

          <v-row class="justify-center pb-6 px-0 pl-5 mt-6">
            <v-col cols="12">
              <RetailerDashboardEvents />
            </v-col>
          </v-row>

          <v-row no-gutters class="justify-center pb-6 px-6">
            <v-col cols="12" md="12" lg="12">
              <v-card
                @click="router.push({ name: 'CommunityBuilds' })"
                flat
                style="cursor: pointer"
              >
                <v-img
                  src="https://assets.drunagor.app/Dashboard/btn-CB-desk.png"
                />
              </v-card>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>

    <v-row class="move_topo2 d-md-none justify-center align-center">
      <v-col cols="12" sm="12" md="12" class="px-0">
        <v-row
          class="d-sm justify-center align-center ma-0 w-100"
          justify="center"
=======
      <v-col cols="12" class="avatar-mobile pa-0">
        <v-container
          class="mx-auto pa-0"
          :style="{ maxWidth: containerMaxWidth }"
>>>>>>> main
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
<<<<<<< HEAD
              </v-card>
            </v-hover>
          </v-col>
        </v-row>

        <v-row class="justify-center pb-6 ml-1 mt-">
          <v-col cols="12">
            <RetailerDashboardEvents />
          </v-col>
        </v-row>

        <v-row no-gutters class="justify-center pb-6 px-3">
          <v-col cols="12">
            <v-card
              @click="router.push({ name: 'CommunityBuilds' })"
              flat
              style="cursor: pointer"
            >
              <v-img
                src="https://assets.drunagor.app/Dashboard/btn-CB-mobile.png"
              />
            </v-card>
          </v-col>
        </v-row>
=======
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
>>>>>>> main
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
                @click="goToFAQ"
                size="x-large"
              >
                <v-icon>mdi-help-circle-outline</v-icon>
              </v-btn>
            </v-col>
            
            <v-col cols="auto" class="px-2" style="width: 50%; max-width: 250px; min-width: 160px;">
              <v-btn
                color="#118D8E"
                variant="flat"
                @click="goToEvents"
                size="x-large"
                rounded="lg"
                class="font-weight-bold w-100"
              >
                <v-icon left class="mr-1">mdi-calendar</v-icon>
                Events
              </v-btn>
            </v-col>

            <v-col class="d-flex justify-center align-center">
              <v-btn
                icon
                variant="text"
                @click="goToStores"
                size="x-large"
              >
                <v-icon>mdi-store</v-icon>
              </v-btn>
            </v-col>

          </v-row>
        </v-toolbar>
      </v-container>
    </div>
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
import { Campaign } from "@/store/Campaign";
import { Hero } from "@/store/Hero";
import { HeroEquipment } from "@/store/Hero";
import axios from "axios";
import DashboardEvents from "@/components/DashboardEvents.vue";

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

const containerMaxWidth = computed(() => {
  if (display.lgAndUp.value) return "1024px";
  if (display.md.value) return "900px";
  if (display.sm.value) return "768px";
  return "100%";
});

// --- Rotas Atualizadas para Retailer ---
const goToProfile = () => router.push({ name: "PerfilHome" });
const goToFAQ = () => router.push({ name: "FAQ" });
const goToEvents = () => router.push({ name: "Events" });
const goToStores = () => router.push({ name: "stores" });

function getBoxName(boxId: number): string {
  switch (boxId) {
    case 22:
      return "Corebox";
    case 23:
      return "Apocalypse";
    case 34:
      return "Awakenings";
    case 38:
      return "Underkeep Drunagor Nights";
    case 39:
      return "Underkeep Drunagor Nights Season 2";
    default:
      return `Unknown Box (ID: ${boxId})`;
  }
}

function addLoadingError(message: string) {
  const newError = { id: Date.now(), text: message, visible: true };
  loadingErrors.value.push(newError);
  setTimeout(() => {
    removeErrorById(newError.id);
  }, 10000);
}

function removeErrorById(id: number) {
  loadingErrors.value = loadingErrors.value.filter((e) => e.id !== id);
}

function importCampaign(token: string) {
  let data;
  try {
    data = JSON.parse(atob(token));
  } catch (error) {
    throw new Error("Invalid data format (not a valid Base64 or JSON string).");
  }

  if (!("campaignData" in data) || !("heroes" in data)) {
    throw new Error("Incomplete campaign data structure.");
  }

  const campaign: Campaign = data.campaignData;
  campaignStore.add(campaign);

  const heroes = data.heroes as Hero[];
  heroes.forEach((h) => {
    h.campaignId = campaign.campaignId;
    if (typeof h.equipment === "undefined") {
      h.equipment = new HeroEquipment();
    }
    if (typeof h.sequentialAdventureState === "undefined") {
      h.sequentialAdventureState = null;
    }
    heroStore.add(h);
  });
}

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
      } catch (e: any) {
        console.error(
          `Failed to import campaign ID: ${element.campaigns_pk}`,
          e,
        );
      }
    });
  } catch (apiError) {
    console.error("Failed to fetch campaigns from API", apiError);
  } finally {
    loading.value = false;
  }
});
</script>

<style>
/* CSS idêntico ao componente de User */
.avatar-mobile {
  position: relative;
  transform: translateY(-95px);
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