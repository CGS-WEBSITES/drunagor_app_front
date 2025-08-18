<template>
  <v-main>
    <v-row class="d-none d-md-flex justify-center align-center ml-16">
      <v-col cols="12" sm="10" md="8" class="px-6">
        <v-row no-gutters>
          <v-col cols="4">
            <v-avatar size="236" rounded="0" class="avatar-overlayuser">
              <v-img
                :src="
                  user.picture_hash
                    ? assets + '/Profile/' + user.picture_hash
                    : assets + '/Profile/user.png'
                "
                alt="Profile"
                style="
                  border: 0.5px solid black;
                  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
                  background-color: black;
                "
                a
              />
            </v-avatar>
            <v-card-title class="user_nameuser text-h3">{{
              user.user_name
            }}</v-card-title>
          </v-col>
        </v-row>
      </v-col>
    </v-row>

    <v-row class="d-md-none justify-center align-center ml-0">
      <v-card
        color="background"
        class="card-overlay full-screen-card"
        :image="assets + '/Profile/profile-bg-warriors-transparent.png'"
        flat
      >
        <v-card
          color="primary"
          height="136"
          class="card-overlay1 full-screen-card"
          flat
        ></v-card>
      </v-card>
      <v-col cols="12">
        <v-row no-gutters>
          <v-col cols="8" class="avatar-mobile">
            <v-avatar size="140" rounded="0">
              <v-img
                :src="
                  user.picture_hash
                    ? assets + '/Profile/' + user.picture_hash
                    : assets + '/Profile/user.png'
                "
                alt="Profile"
                style="
                  border: 3.5px solid black;
                  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
                  background-color: black;
                "
              />
            </v-avatar>
            <v-card-title class="user_name2 text-h5">{{
              user.user_name
            }}</v-card-title>
          </v-col>
        </v-row>
      </v-col>
    </v-row>

    <v-row class="mt-4 d-none d-md-flex justify-center align-center ma-0 w-100">
      <v-col cols="12" sm="12" md="8" class="px-6">
        <v-card
          color="primary"
          height="116px"
          class="move_topouser pt-12"
        ></v-card>
        <v-card color="secundary" class="move_topouser pt-12">
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
                      :class="{ 'on-hover': isHovering }"
                      :elevation="isHovering ? 12 : 2"
                      v-bind="props"
                      :disabled="index > 3 ? true : false"
                      @click="router.push(item.route)"
                    >
                      <v-img
                        :src="item.img"
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

          <v-row
            class="mt-4 d-flex justify-center align-center py-6"
            no-gutters
          >
            <v-col cols="12" sm="12" md="12" class="px-5 mb-0">
              <div
                v-if="loading"
                class="d-flex justify-center align-center"
                style="min-height: 350px"
              >
                <v-progress-circular
                  :size="60"
                  :width="6"
                  color="primary"
                  indeterminate
                ></v-progress-circular>
              </div>
              <v-carousel
                hide-delimiters
                v-else-if="campaignList.length > 0"
                :height="isMobile ? '400px' : 'auto'"
              >
                <v-carousel-item
                  v-for="(item, index) in campaignStore.findAll()"
                  :key="index"
                >
                  <v-row no-gutters class="justify-center">
                    <v-col cols="10" sm="10" md="12">
                      <v-card
                        color="primary"
                        class="mx-auto"
                        @click="
                          router.push({
                            name: 'Campaign',
                            params: { id: item.campaignId },
                          })
                        "
                      >
                        <v-img
                          v-if="item.campaign === 'core'"
                          src="https://assets.drunagor.app/CampaignTracker/CoreCompanion.webp"
                          cover
                        ></v-img>

                        <v-img
                          v-else-if="item.campaign === 'apocalypse'"
                          src="https://assets.drunagor.app/CampaignTracker/ApocCompanion.webp"
                          cover
                        ></v-img>

                        <v-img
                          v-else-if="item.campaign === 'awakenings'"
                          src="https://assets.drunagor.app/CampaignTracker/AwakComapanion.webp"
                          cover
                        ></v-img>

                        <v-img
                          v-else-if="item.campaign === 'underkeep'"
                          src="@/assets/underkeep.png"
                          cover
                          max-height="307"
                        ></v-img>

                        <v-card-title class="text-uppercase" v-if="item.name">
                          {{ item.name }}
                        </v-card-title>
                        <v-card-text>
                          <v-row no-gutters>
                            <v-col
                              class="d-flex"
                              v-for="hero in findHeroes(item.campaignId)"
                              :key="hero.heroId"
                            >
                              <v-avatar
                                rounded="0"
                                :image="hero.images.avatar"
                                size="120"
                              />
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
                      You don't have any campaigns saved yet. Click the button
                      below to create one.
                    </v-card-title>
                    <v-card-actions class="d-flex justify-center">
                      <v-btn @click="router.push({ name: 'Campaign Overview' })"
                        >Create Campaign</v-btn
                      >
                    </v-card-actions>
                  </v-card>
                </v-col>
              </v-row>

              <div v-if="loadingErrors.length > 0" class="w-100 mt-4 px-4">
                <BaseAlert
                  v-for="(error, index) in loadingErrors"
                  :key="error.id"
                  v-model="error.visible"
                  type="error"
                  icon="mdi-alert-octagram-outline"
                  title="Loading Error"
                  variant="elevated"
                  closable
                  @update:modelValue="() => loadingErrors.splice(index, 1)"
                  class="mb-3"
                >
                  {{ error.text }}
                </BaseAlert>
              </div>
            </v-col>
          </v-row>

          <v-row no-gutters class="justify-center pb-6 px-5">
            <v-col cols="12" md="12" lg="12">
              <v-card
                @click="router.push({ name: 'CommunityBuilds' })"
                flat
                style="cursor: pointer"
              >
                <v-img
                  src="https://druna-assets.s3.us-east-2.amazonaws.com/Dashboard/btn-CB-desk.png"
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
        >
          <v-col cols="6" v-for="(item, index) in carouselItems" :key="index">
            <v-hover v-slot="{ isHovering, props }">
              <v-card
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
                    index > 3 ? 'to top, rgba(0,0,0,1), rgba(0,0,0,.6)' : false
                  "
                />
              </v-card>
            </v-hover>
          </v-col>
        </v-row>

        <v-row class="d-flex justify-center align-center w-100" no-gutters>
          <v-col cols="12" sm="12" md="12" class="px-0 mb-0">
            <div
              v-if="loading"
              class="d-flex justify-center align-center"
              style="min-height: 420px"
            >
              <v-progress-circular
                :size="60"
                :width="6"
                color="primary"
                indeterminate
              ></v-progress-circular>
            </div>
            <v-carousel
              show-arrows="hover"
              hide-delimiters
              v-else-if="campaignList.length > 0"
              height="410"
            >
              <v-carousel-item
                v-for="(item, index) in campaignStore.findAll()"
                :key="index"
              >
                <v-row no-gutters class="justify-center">
                  <v-col cols="12" sm="12" md="12">
                    <v-card
                      class="mx-4"
                      @click="
                        router.push({
                          name: 'Campaign',
                          params: { id: item.campaignId },
                        })
                      "
                    >
                      <v-img
                        v-if="item.campaign === 'core'"
                        src="https://assets.drunagor.app/CampaignTracker/CoreCompanion.webp"
                        max-height="260"
                        cover
                      ></v-img>

                      <v-img
                        v-else-if="item.campaign === 'apocalypse'"
                        src="https://assets.drunagor.app/CampaignTracker/ApocCompanion.webp"
                        max-height="260"
                        cover
                      ></v-img>

                      <v-img
                        v-else-if="item.campaign === 'awakenings'"
                        src="https://assets.drunagor.app/CampaignTracker/AwakComapanion.webp"
                        max-height="260"
                        cover
                      ></v-img>
                      <v-img
                        v-else-if="item.campaign === 'underkeep'"
                        src="@/assets/underkeep.png"
                        cover
                        max-height="260"
                      ></v-img>
                      <v-card-subtitle
                        class="text-uppercase mt-3"
                        v-if="item.name"
                      >
                        {{ item.name }}
                      </v-card-subtitle>
                      <v-card-text>
                        <v-row no-gutters>
                          <v-col
                            class="d-flex"
                            v-for="hero in findHeroes(item.campaignId)"
                            :key="hero.heroId"
                          >
                            <v-avatar
                              rounded="0"
                              :image="hero.images.avatar"
                              size="66"
                            />
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
                  <v-card-title class="text-center">
                    You don't have any campaigns saved yet. Click the button
                    below to create one.
                  </v-card-title>
                  <v-card-actions class="d-flex justify-center">
                    <v-btn @click="router.push({ name: 'Campaign Overview' })"
                      >Create Campaign</v-btn
                    >
                  </v-card-actions>
                </v-card>
              </v-col>
            </v-row>

            <div v-if="loadingErrors.length > 0" class="w-100 mt-4 px-4">
              <BaseAlert
                v-for="(error, index) in loadingErrors"
                :key="error.id"
                v-model="error.visible"
                type="error"
                icon="mdi-alert-octagram-outline"
                title="Loading Error"
                variant="elevated"
                closable
                @update:modelValue="() => loadingErrors.splice(index, 1)"
                class="mb-3"
              >
                {{ error.text }}
              </BaseAlert>
            </div>
          </v-col>
        </v-row>
        
        <v-row no-gutters class="move_topo3 justify-center pb-6 px-4">
          <v-col cols="12">
            <v-card
              @click="router.push({ name: 'CommunityBuilds' })"
              flat
              style="cursor: pointer"
            >
              <v-img
                src="https://druna-assets.s3.us-east-2.amazonaws.com/Dashboard/btn-CB-mobile.png"
              />
            </v-card>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
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
import BaseAlert from "@/components/Alerts/BaseAlert.vue";

const router = useRouter();
const userStore = useUserStore();
const user = userStore.user;
const campaignStore = CampaignStore();
const heroStore = HeroStore();
const display = ref(useDisplay());
const assets = inject<string>("assets");
const heroDataRepository = new HeroDataRepository();

const loading = ref(true);
const loadingErrors = ref<{ id: number; text: string; visible: boolean }[]>([]);

const carouselItems = ref([
  {
    img: "https://druna-assets.s3.us-east-2.amazonaws.com/Dashboard/btn-companion-1.0.png",
    label: "COMPANION",
    route: { name: "Campaign Overview" },
  },
  {
    img: "https://druna-assets.s3.us-east-2.amazonaws.com/Dashboard/btn-library-1.0.png",
    label: "LIBRARY",
    route: { name: "Library" },
  },
  {
    img: "https://druna-assets.s3.us-east-2.amazonaws.com/Dashboard/btn-events-1.0.png",
    label: "EVENTS",
    route: { name: "Events" },
  },
  {
    img: "https://druna-assets.s3.us-east-2.amazonaws.com/Dashboard/btn-profile-1.0.png",
    label: "PROFILE",
    route: { name: "PerfilHome" },
  },
]);

const libraryItems = ref([
  {
    name: "COREBOX",
    image: new URL(assets + "/Dashboard/btn-corebox.png", import.meta.url).href,
  },
  {
    name: "DESERT OF HELLSCAR",
    image: new URL(assets + "/Dashboard/btn-hellscar.png", import.meta.url)
      .href,
  },
  {
    name: "APOCALYPSE",
    image: new URL(assets + "/Dashboard/btn-apoc.png", import.meta.url).href,
  },
  {
    name: "AWAKENINGS",
    image: new URL(assets + "/Dashboard/btn-awakenings.png", import.meta.url)
      .href,
  },
]);

const campaignList = computed(() => {
  return campaignStore.findAll();
});

const isMobile = computed(() => {
  return !display.value.mdAndUp;
});

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
    default:
      return `Unknown Box (ID: ${boxId})`;
  }
}

function addLoadingError(message: string) {
  const newError = { id: Date.now(), text: message, visible: true };
  loadingErrors.value.push(newError);
  // opcional: auto‐remover após X segundos
  setTimeout(() => {
    removeErrorById(newError.id);
  }, 10000);
}

function removeErrorById(id: number) {
  loadingErrors.value = loadingErrors.value.filter(e => e.id !== id);
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

function findHeroes(campaignId: string): HeroData[] {
  return heroStore
    .findAllInCampaign(campaignId)
    .map((h) => heroDataRepository.find(h.heroId))
    .filter((h): h is HeroData => !!h);
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
    const res = await axios.get("/rl_campaigns_users/search", {
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
        const partyName = element.party_name || "Unnamed Campaign";
        const boxName = getBoxName(element.box);
        const errorMessage = `Could not load the campaign "${partyName}" from the "${boxName}". The data seems to be corrupted. Please contact support if the issue persists.`;
        addLoadingError(errorMessage);
      }
    });
  } catch (apiError) {
    console.error("Failed to fetch campaigns from API", apiError);
    addLoadingError(
      "An error occurred while fetching your campaigns. Please try again later.",
    );
  } finally {
    loading.value = false;
  }
});
</script>

<style>
.v-badge__badge {
  position: absolute;
  top: -5px;
  right: -5px;
  color: rgb(266, green, blue);
}
.avatar-overlayuser {
  position: relative;
  transform: translateY(-28px);
  z-index: 2;
}
.avatar-mobile {
  position: relative;
  transform: translateY(-130px);
  z-index: 3;
}
.card-overlayuser {
  position: relative;
  transform: translateY(-6px);
  z-index: 3;
}
.card-overlay1 {
  position: relative;
  transform: translateY(96px);
  z-index: 2;
}
.user_nameuser {
  position: relative;
  transform: translateY(-165px) translateX(234px);
  z-index: 2;
}
.user_name2 {
  position: relative;
  transform: translateY(-85px) translateX(130px);
  z-index: 2;
}
.move_topouser {
  position: relative;
  transform: translateY(-283px);
}
.move_topo2 {
  position: relative;
  transform: translateY(-180px) translateX(12px);
}
.move_topo3 {
  position: relative;
  transform: translateY(-110px);
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