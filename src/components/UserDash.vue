<template>
  <v-main
    style="
      display: flex;
      flex-direction: column;
      height: 100dvh;
      max-height: 100dvh;
      overflow: hidden;
      --v-layout-top: 0px;
      box-sizing: border-box;
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
          height="166"
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
                  background-color: rgba(var(--v-theme-surface), 0.7);
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
        marginTop: display.xs ? '-95px' : '-85px',
        overflow: 'hidden',
        minHeight: '0',
        zIndex: 1,
        width: '100%',
        display: 'flex',
        flexDirection: 'column'
      }"
    >
      <v-container
        class="mx-auto px-4 fill-height align-stretch"
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
                color="playbutton"
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
          <!-- Return to Recent Campaign Option -->
          <div v-if="recentCampaign" class="pa-5 text-center">
            <h3 class="text-h5 font-weight-bold text-amber-accent-2 mb-4">Return to Recent Campaign</h3>
            
            <v-card
              color="secundary"
              elevation="16"
              width="100%"
              class="mx-auto cursor-pointer transition-swing rounded-xl text-left"
              style="overflow: hidden; max-width: 440px;"
              @click="resumeRecentCampaign"
            >
              <!-- Banner Image -->
              <v-img
                :src="getCampaignBanner(recentCampaign.campaign)"
                height="120"
                cover
              ></v-img>

              <v-card-title class="d-flex flex-column text-uppercase pb-1 px-3 pt-2">
                <div class="d-flex justify-space-between align-center w-100">
                  <span class="text-h6 font-weight-bold mb-0 text-truncate text-white" style="font-size: 1.15rem !important; letter-spacing: 0.5px;">
                    {{ recentCampaign.name }}
                  </span>
                  <v-chip
                    v-if="['underkeep', 'underkeep2'].includes(recentCampaign.campaign) && recentCampaign.isFinished"
                    color="red-darken-4"
                    size="x-small"
                    variant="flat"
                    class="font-weight-bold ml-2"
                  >
                    FINISHED
                  </v-chip>
                </div>

                <div class="d-flex align-center text-subtitle-2 mt-0 text-grey-lighten-1 w-100" style="font-size: 0.75rem !important;">
                  <span v-if="recentCampaign.wing">{{ formatWingName(recentCampaign.wing) }}</span>
                  <span v-if="['underkeep', 'underkeep2'].includes(recentCampaign.campaign) && recentCampaign.door" class="ml-2">
                    - Door: <span class="text-white font-weight-bold">{{ recentCampaign.door }}</span>
                  </span>
                  <span v-if="['underkeep', 'underkeep2'].includes(recentCampaign.campaign)" class="ml-auto text-amber-accent-2 font-weight-bold">
                    {{ calculateCompletionPercentage(recentCampaign) }}%
                  </span>
                </div>
              </v-card-title>

              <v-progress-linear
                v-if="['underkeep', 'underkeep2'].includes(recentCampaign.campaign)"
                :model-value="calculateCompletionPercentage(recentCampaign)"
                color="amber-accent-2"
                height="3"
                class="mb-0"
              ></v-progress-linear>

              <!-- Players list (Compact standees) -->
              <div v-if="['underkeep', 'underkeep2'].includes(recentCampaign.campaign)" class="mt-1 px-3 pt-0 pb-3">
                <div class="d-flex flex-wrap align-center standees-list-container-compact">
                  <div
                    v-for="player in recentPlayers"
                    :key="player.rl_campaigns_users_pk"
                    class="player-standee-container-compact"
                  >
                    <div class="hero-standee-card-compact">
                      <v-img
                        v-slot:default
                        v-if="getPlayerHeroAvatar(player)"
                        :src="getPlayerHeroAvatar(player)"
                        cover
                        class="w-100 h-100"
                      ></v-img>
                      <v-icon v-else size="small" color="grey" class="ma-auto">mdi-help</v-icon>
                      <div class="player-name-overlay-compact">
                        <span class="player-name-text-compact">{{ player.user_name }}</span>
                      </div>
                    </div>
                  </div>
                  <span v-if="recentPlayers.length === 0" class="text-caption text-grey font-italic pb-2">No players synced yet.</span>
                </div>
              </div>

              <!-- Legacy style: Hero Avatars -->
              <div v-else class="mt-1 px-3 pt-0 pb-3">
                <div class="d-flex flex-wrap align-center standees-list-container-compact">
                  <div
                    v-for="hero in getLegacyHeroes(recentCampaign)"
                    :key="hero.heroId"
                    class="player-standee-container-compact"
                  >
                    <div class="hero-standee-card-compact">
                      <v-img
                        :src="hero.images.avatar"
                        cover
                        class="w-100 h-100"
                      ></v-img>
                    </div>
                  </div>
                </div>
              </div>
            </v-card>
          </div>

          <v-divider v-if="recentCampaign" class="mx-6 border-opacity-50" color="grey"></v-divider>

          <div class="pa-5 text-center">
            <v-img 
              src="@/assets/underkeep.png" 
              height="140" 
              cover
              class="mb-4 rounded-xl elevation-4"
            ></v-img>
            
            <h3 class="text-h5 font-weight-bold text-green-accent-3 mb-1">Drunagor Nights S1</h3>
            <p class="text-body-2 text-grey-lighten-1 mb-5 px-2">
              Scan the Lobby QR Code to join your party and dive into the Underkeep adventures.
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
import { useDisplay, useTheme } from "vuetify";
import { useUserStore } from "@/store/UserStore";
import { useRouter } from "vue-router";
import { CampaignStore } from "@/store/CampaignStore";
import { HeroDataRepository } from "@/data/repository/HeroDataRepository";
import { HeroStore } from "@/store/HeroStore";
import axios from "axios";
import DashboardEvents from "@/components/DashboardEvents.vue";
import HUB from "@/components/HUB.vue";
import RecentCampaignWidget from "@/components/RecentCampaignWidget.vue";

import CoreLogo from "@/assets/campaign/logo/core.webp";
import ApocalypseLogo from "@/assets/campaign/logo/apocalypse.webp";
import AwakeningsLogo from "@/assets/campaign/logo/awakenings.webp";
import UnderkeepBanner from "@/assets/underkeep.png";
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
const themeInstance = useTheme();
const playButtonColor = computed(() => {
  const tName = themeInstance.global.name.value;
  switch (tName) {
    case "CoreTheme":
      return "#E2B13C";
    case "ApocTheme":
      return "#FB8C00";
    case "NightsTheme":
      return "#A3E635";
    case "EarthTheme":
      return "#10B981";
    case "BlueTheme":
      return "#F59E0B";
    case "CrimsonTheme":
      return "#FACC15";
    case "VioletTheme":
      return "#4ADE80";
    case "RoseTheme":
      return "#2DD4BF";
    case "DarkTheme":
    default:
      return "#118D8E";
  }
});


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
  openHub();
};


const playLegacyCampaigns = () => {
  showPlaySelectionDialog.value = false;
  router.push({ path: "/campaign-tracker/" });
};

const recentCampaign = ref<any | null>(null);
const recentPlayers = ref<any[]>([]);

const getPlayerHeroAvatar = (player: any) => {
  if (!player.resolvedHero) return null;
  const heroId = player.resolvedHero.heroId || player.resolvedHero.id;
  if (!heroId) return null;
  const staticData = heroDataRepository.find(heroId);
  return staticData ? staticData.images.avatar : null;
};

const getLegacyHeroes = (campaign: any) => {
  if (!campaign || !campaign.heroes) return [];
  return campaign.heroes
    .map((h: any) => heroDataRepository.find(h.heroId))
    .filter((h: any) => !!h);
};

const getCampaignBanner = (campType: string) => {
  if (campType === 'core') return "https://assets.drunagor.app/CampaignTracker/CoreCompanion.webp";
  if (campType === 'apocalypse') return "https://assets.drunagor.app/CampaignTracker/ApocCompanion.webp";
  if (campType === 'awakenings') return "https://assets.drunagor.app/CampaignTracker/AwakComapanion.webp";
  if (campType === 'underkeep2') return Underkeep2Banner;
  return UnderkeepBanner;
};

const calculateCompletionPercentage = (campaign: any): number => {
  const wing = (campaign.wing || "").toUpperCase();
  const currentDoor = (campaign.door || "").toUpperCase();
  
  let list: string[] = [];
  if (wing.includes("TUTORIAL")) {
    list = [
      "FIRST SETUP",
      "THE BARRICADED PATH (TUTORIAL)",
      "THE KEEP'S COURTYARD (TUTORIAL)",
      "THE ENTRY HALL (TUTORIAL)",
      "THE GREAT HALL (TUTORIAL)",
      "END GAME"
    ];
  } else if (wing.includes("WING 1") || wing.includes("WING 01")) {
    list = [
      "FIRST SETUP",
      "THE BARRICADED PATH",
      "THE KEEP'S COURTYARD",
      "THE ENTRY HALL",
      "THE GREAT HALL",
      "END GAME"
    ];
  } else if (wing.includes("WING 2") || wing.includes("WING 02")) {
    list = [
      "FIRST SETUP",
      "THE GREAT CISTERN",
      "THE DUNGEONS",
      "THE ALCHEMY LAB",
      "THE BURIED ARMORY",
      "THERE AND BACK AGAIN",
      "END GAME"
    ];
  } else if (wing.includes("WING 3") || wing.includes("WING 03")) {
    list = [
      "FIRST SETUP",
      "DUNGEON FOYER",
      "QUEEN'S HALL",
      "THE FORGE",
      "ARTISAN'S GALLERY",
      "PROVING GROUNDS",
      "MAIN HALL",
      "END GAME"
    ];
  } else if (wing.includes("WING 4") || wing.includes("WING 04")) {
    list = [
      "FIRST SETUP",
      "DRACONIC CHAPEL",
      "CRYPTS",
      "BOTH OPEN",
      "LIBRARY",
      "LABORATORY",
      "DRAGON BOSS",
      "END GAME"
    ];
  }

  if (list.length === 0) return 0;
  
  let idx = list.indexOf(currentDoor);
  if (idx === -1) {
    idx = list.findIndex(d => currentDoor.includes(d) || d.includes(currentDoor));
  }
  
  if (idx === -1) {
    if (currentDoor === "FIRST SETUP") idx = 0;
    else if (currentDoor === "END GAME") idx = list.length - 1;
    else idx = 0;
  }
  
  const pct = Math.round((idx / (list.length - 1)) * 100);
  return Math.min(100, Math.max(0, pct));
};

const formatWingName = (wing: string | null) => {
  if (!wing) return "";
  return wing
    .replace(/-\s*advanced/gi, "")
    .replace(/advanced\s*-/gi, "")
    .replace(/advanced/gi, "")
    .replace(/\s+/g, " ")
    .trim();
};

const formatCampaignDescription = (campaign: any) => {
  const parts = [];
  if (campaign.wing) {
    parts.push(formatWingName(campaign.wing));
  }
  if (campaign.door) {
    parts.push(`Door: ${campaign.door}`);
  }
  if (["underkeep", "underkeep2"].includes(campaign.campaign)) {
    const pct = calculateCompletionPercentage(campaign);
    parts.push(`${pct}% Complete`);
  }
  return parts.join(" • ");
};

const resumeRecentCampaign = () => {
  if (!recentCampaign.value) return;
  showPlaySelectionDialog.value = false;
  router.push({ name: "Campaign", params: { id: recentCampaign.value.campaignId } });
};

const loadRecentCampaign = async () => {
  if (!userStore.user?.users_pk) return;
  try {
    let legacyCampaigns = [];
    try {
      const resLegacy = await axios.get("/rl_campaigns_users/search", {
        params: {
          users_fk: userStore.user.users_pk,
          show_season2: false,
          _t: Date.now()
        },
      });
      legacyCampaigns = resLegacy.data?.campaigns || [];
    } catch (err1) {
      console.warn("Failed fetching legacy campaigns:", err1);
    }

    let s2Campaigns = [];
    try {
      const resS2 = await axios.get("/rl_campaigns_users/search", {
        params: {
          users_fk: userStore.user.users_pk,
          show_season2: true,
          _t: Date.now()
        },
      });
      s2Campaigns = resS2.data?.campaigns || [];
    } catch (err2) {
      console.warn("Failed fetching S2 campaigns:", err2);
    }

    const allCampaignsRaw = [
      ...legacyCampaigns,
      ...s2Campaigns,
    ];

    if (allCampaignsRaw.length === 0) {
      recentCampaign.value = null;
      return;
    }

    const campaignsWithDates = allCampaignsRaw.map((c: any) => {
      let mtime = 0;
      let parsedHash: any = null;

      if (c.tracker_hash) {
        try {
          parsedHash = JSON.parse(atob(c.tracker_hash));
          if (parsedHash.savedAt) {
            mtime = new Date(parsedHash.savedAt).getTime();
          }
        } catch (e) {}
      }

      if (c.start_date) {
        const startTime = new Date(c.start_date).getTime();
        if (startTime > mtime) {
          mtime = startTime;
        }
      }

      return {
        raw: c,
        mtime,
        parsedHash,
      };
    });

    campaignsWithDates.sort((a, b) => b.mtime - a.mtime);

    const mostRecent = campaignsWithDates[0];
    const rawCamp = mostRecent.raw;
    const parsed = mostRecent.parsedHash;

    let campaignDataParsed: any = null;
    if (parsed && parsed.campaignData) {
      campaignDataParsed = parsed.campaignData;
      campaignDataParsed.campaignId = String(rawCamp.campaigns_fk);
      campaignDataParsed.name = rawCamp.party_name || campaignDataParsed.name || "Unnamed Campaign";
    } else {
      campaignDataParsed = {
        campaignId: String(rawCamp.campaigns_fk),
        name: rawCamp.party_name || "Unnamed Campaign",
        campaign: rawCamp.box === 38 ? "underkeep" : rawCamp.box === 39 ? "underkeep2" : "core",
        wing: "",
        door: ""
      };
    }

    recentPlayers.value = [];
    if (["underkeep", "underkeep2"].includes(campaignDataParsed.campaign)) {
      try {
        const [doorsRes, playersRes] = await Promise.all([
          axios.get("/rl_campaigns_doors/search", {
            params: { campaign_fk: campaignDataParsed.campaignId },
          }),
          axios.get("/rl_campaigns_users/list_players", {
            params: { campaigns_fk: campaignDataParsed.campaignId },
          }),
        ]);

        const doors = doorsRes.data?.campaign_doors || [];
        if (doors.length > 0) {
          doors.sort((a: any, b: any) => b.rl_campaigns_doors_pk - a.rl_campaigns_doors_pk);
          campaignDataParsed.door = doors[0].door_name;
          if (doors[0].doors_fk === 7 || doors[0].doors_fk === 12 || doors[0].door_name === "END GAME") {
            campaignDataParsed.isFinished = true;
          }
        }

        recentPlayers.value = playersRes.data?.Users || [];

        // Fetch hero info for each player
        await Promise.allSettled(
          recentPlayers.value.map(async (player: any) => {
            if (player.playable_heroes_fk) {
              try {
                const res = await axios.get(`/playable_heroes/${player.playable_heroes_fk}`);
                if (res.data?.hero_hash) {
                  const jsonStr = atob(res.data.hero_hash);
                  const heroObj = JSON.parse(jsonStr);
                  player.resolvedHero = heroObj;
                }
              } catch (err) {
                console.warn("Failed to load hero for recent player:", err);
              }
            }
          })
        );
      } catch (doorErr) {
        console.warn("Failed fetching latest door/players for recent campaign:", doorErr);
      }
    }

    recentCampaign.value = campaignDataParsed;
  } catch (err) {
    console.error("Error loading recent campaign:", err);
  }
};

onBeforeMount(async () => {
  campaignStore.reset();
  heroStore.reset();
  loadingErrors.value = [];
  loading.value = true;

  if (!userStore.user?.users_pk) {
    userStore.restoreFromStorage();
  }
  if (!userStore.user?.users_pk) {
    loading.value = false;
    return;
  }

  // Pre-load the recent campaign so it is instant inside the play dialog
  loadRecentCampaign();

  try {
    const res = await (axios as any).get("/rl_campaigns_users/search", {
      params: { users_fk: userStore.user.users_pk },
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
  height: 180px;
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
.standees-list-container-compact {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.player-standee-container-compact {
  width: 60px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
}
.hero-standee-card-compact {
  width: 60px;
  aspect-ratio: 120 / 170;
  border-radius: 0;
  overflow: hidden;
  position: relative;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  mask-image: linear-gradient(to bottom, transparent 0%, black 10%);
  -webkit-mask-image: linear-gradient(to bottom, transparent 0%, black 10%);
}
.player-name-overlay-compact {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.95) 0%, rgba(0, 0, 0, 0.5) 50%, rgba(0, 0, 0, 0) 100%);
  padding: 12px 2px 4px 2px;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2;
}
.player-name-text-compact {
  color: white;
  font-size: 0.55rem;
  font-weight: 800;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.8);
  text-align: center;
  width: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
