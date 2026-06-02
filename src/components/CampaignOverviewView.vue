<template>
  <v-container max-width="680" class="pt-0">
    <div v-if="loadingErrors.length > 0" class="mb-4">
      <BaseAlert
        v-for="(error, index) in loadingErrors"
        :key="error.id"
        :model-value="true"
        type="error"
        title="Loading Error"
        variant="elevated"
        closable
        class="mb-3"
        @update:modelValue="() => loadingErrors.splice(index, 1)"
      >
        {{ error.text }}
      </BaseAlert>
    </div>

    <!-- Hidden helper component triggers -->
    <div style="display: none;">
      <CampaignNew ref="campaignNewRef" />
      <CampaignImport ref="campaignImportRef" />
    </div>
    <HUB v-model="showHub" :my-events="myEvents" :user="userStore.user" />

    <!-- Main Play Action Button (identical to dashboard styling) -->
    <div class="d-flex justify-center mt-0 mb-4 pt-0">
      <v-btn
        color="playbutton"
        variant="flat"
        @click="openPlayOptions"
        size="x-large"
        rounded="lg"
        class="font-weight-black play-campaigns-btn w-100 text-uppercase"
        style="height: 58px; font-size: 1.35rem !important;"
        prepend-icon="mdi-sword-cross"
      >
        PLAY
      </v-btn>
    </div>

    <v-card class="mt-3 pa-3 elevation-0 d-flex flex-column ga-4">
      
      <div class="w-100">
        <v-select
          v-model="selectedBoxFilter"
          :items="boxOptions"
          label="Filter by Box"
          variant="outlined"
          density="compact"
          hide-details
          clearable
          style="max-width: 720px;"
        >
          <template #item="{ props, item }">
            <v-list-item v-bind="props">
              <template #prepend>
                <div class="mr-3 bg-grey-darken-4" style="width: 90px; height: 40px; border-radius: 4px; overflow: hidden;">
                  <v-img v-if="item.raw.value === 'core'" src="https://assets.drunagor.app/CampaignTracker/CoreCompanion.webp" cover class="w-100 h-100"></v-img>
                  <v-img v-else-if="item.raw.value === 'apocalypse'" src="https://assets.drunagor.app/CampaignTracker/ApocCompanion.webp" cover class="w-100 h-100"></v-img>
                  <v-img v-else-if="item.raw.value === 'awakenings'" src="https://assets.drunagor.app/CampaignTracker/AwakComapanion.webp" cover class="w-100 h-100"></v-img>
                  <v-img v-else-if="item.raw.value === 'underkeep'" src="@/assets/underkeep.png" cover class="w-100 h-100"></v-img>
                  <v-img v-else-if="item.raw.value === 'underkeep2'" src="@/assets/underkeep2.png" cover class="w-100 h-100"></v-img>
                  <v-icon v-else class="w-100 h-100 d-flex align-center justify-center">mdi-filter-variant</v-icon>
                </div>
              </template>
            </v-list-item>
          </template>
        </v-select>
      </div>

      <div class="d-flex flex-wrap align-center ga-4">
        <v-checkbox
          v-model="showOnlyFinished"
          label="Only Finished"
          color="red-darken-2"
          hide-details
          class="flex-grow-0"
        ></v-checkbox>

        <v-select
          v-model="sortOrder"
          :items="[{title: 'Newest First', value: 'desc'}, {title: 'Oldest First', value: 'asc'}]"
          label="Sort By"
          variant="outlined"
          density="compact"
          hide-details
          style="width: 160px; flex-grow: 0;"
        ></v-select>
      </div>
    </v-card>

    <div id="campaigns" class="grid gap-4 pt-4 place-items-center">
      <v-row v-if="loading" class="justify-center" no-gutters>
        <v-card width="100%" class="d-flex justify-center pa-16">
          <v-progress-circular
            indeterminate
            :size="80"
            :width="7"
            color="primary"
          ></v-progress-circular>
        </v-card>
      </v-row>

      <v-row v-else no-gutters>
        <v-col
          cols="12"
          class="py-3"
          v-for="campaign in allCampaigns"
          :key="campaign.campaignId"
        >
          <v-card
            color="primary"
            elevation="16"
            width="100%"
            class="transition-swing"
            @click="goToCampaign(campaign)"
          >
            <v-img
              v-if="campaign.campaign === 'core'"
              src="https://assets.drunagor.app/CampaignTracker/CoreCompanion.webp"
              max-height="200"
              cover
            ></v-img>

            <v-img
              v-else-if="campaign.campaign === 'apocalypse'"
              src="https://assets.drunagor.app/CampaignTracker/ApocCompanion.webp"
              max-height="200"
              cover
            ></v-img>

            <v-img
              v-else-if="campaign.campaign === 'awakenings'"
              src="https://assets.drunagor.app/CampaignTracker/AwakComapanion.webp"
              max-height="200"
              cover
            ></v-img>

            <v-img
              v-else-if="campaign.campaign === 'underkeep'"
              src="@/assets/underkeep.png"
              max-height="200"
              cover
            ></v-img>

            <v-img
              v-else-if="campaign.campaign === 'underkeep2'"
              src="@/assets/underkeep2.png"
              max-height="200"
              cover
            >
            </v-img>

            <v-card-title class="d-flex flex-column text-uppercase pb-1">
              <div class="d-flex justify-space-between align-center w-100">
                <span class="text-h5 font-weight-bold mb-0 text-truncate">
                  {{ campaign.name || "Unnamed Campaign" }}
                </span>
                <v-chip
                  v-if="campaign.campaign === 'underkeep2' && extraCampaignData[campaign.campaignId]?.isFinished"
                  color="red-darken-4"
                  size="small"
                  variant="flat"
                  class="font-weight-bold ml-2"
                >
                  FINISHED
                </v-chip>
              </div>

              <div class="d-flex align-center text-subtitle-1 mt-0">
                <span v-if="campaign.wing">{{ campaign.wing }}</span>
                <span v-if="campaign.campaign === 'underkeep2' && extraCampaignData[campaign.campaignId]?.lastDoorName" class="ml-2 text-truncate">
                  - Last Door: <span class="text-white font-weight-bold">{{ extraCampaignData[campaign.campaignId].lastDoorName }}</span>
                </span>
              </div>
            </v-card-title>

            <v-card-text v-if="campaign.campaign === 'underkeep2' && extraCampaignData[campaign.campaignId]">
              <div class="text-caption text-grey-lighten-1 mb-2">PLAYERS</div>
              <div class="d-flex flex-wrap gap-2">
                <v-chip
                  v-for="player in extraCampaignData[campaign.campaignId].players"
                  :key="player.rl_campaigns_users_pk"
                  class="bg-grey-darken-4 text-white font-weight-medium pl-1 pr-3"
                  size="small"
                >
                  <v-avatar start class="mr-1">
                    <v-img :src="getUserProfileImage(player.picture_hash)" cover></v-img>
                  </v-avatar>
                  {{ player.user_name }}
                </v-chip>
                <span v-if="extraCampaignData[campaign.campaignId].players.length === 0" class="text-caption text-grey font-italic">No players synced yet.</span>
              </div>
            </v-card-text>

            <v-card-text v-else>
              <v-row no-gutters>
                <v-col
                  v-for="hero in heroAvatars(campaign.campaignId)"
                  :key="hero.heroId"
                  cols="auto"
                  class="d-flex"
                >
                  <v-avatar
                    class="my-1 rounded-0 mx-1"
                    :image="hero.images.avatar"
                    :size="calculateAvatarSize(campaign.campaignId)"
                  ></v-avatar>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </div>

    <v-dialog v-model="showJoinCampaignDialog" max-width="400" persistent>
      <v-card style="position: relative">
        <div v-if="joiningCampaign" class="dialog-overlay">
          <v-progress-circular
            indeterminate
            size="80"
            width="7"
            color="primary"
          ></v-progress-circular>
        </div>

        <v-card-title class="d-flex justify-space-between align-center pa-0">
          <span class="text-h6 ml-4">Enter Campaign ID</span>

          <v-card-actions class="pa-0">
            <v-btn icon @click="showJoinCampaignDialog = false">
              <v-icon color="red">mdi-close</v-icon>
            </v-btn>
          </v-card-actions>
        </v-card-title>

        <v-card-text>
          <v-text-field
            v-model="joinCampaignId"
            label="Campaign ID"
            hide-details
            dense
          ></v-text-field>
        </v-card-text>

        <v-card-actions>
          <v-btn
            block
            color="green"
            elevation="4"
            class="mt-4"
            :disabled="!parsedCampaignFk"
            @click="confirmJoinCampaign"
          >
            Join
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Adventure Choice Dialog -->
    <v-dialog v-model="showPlayDialog" max-width="500" scrollable>
      <v-card color="grey-darken-4" rounded="xl" max-height="90vh" class="adventure-choice-card">
        <v-card-title class="d-flex justify-space-between align-center px-4 pt-4 pb-2">
          <span class="text-h5 font-weight-bold text-white">Choose your adventure</span>
          <v-btn icon variant="text" @click="showPlayDialog = false" color="white">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>

        <v-card-text class="pa-0" style="overflow-y: auto;">
          <v-window v-model="activePlayTab">
            <!-- Window 1: Main Selection (Drunagor Nights S1 vs Legacy) -->
            <v-window-item :value="0">
              <!-- Drunagor Nights S1 (Underkeep) -->
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
                  prepend-icon="mdi-qrcode-scan"
                  @click="playDrunagorNights"
                >
                  Scan Lobby QR Code
                </v-btn>
              </div>

              <v-divider class="mx-6 border-opacity-50" color="grey"></v-divider>

              <!-- Legacy Campaigns Selector -->
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
                  class="font-weight-black text-grey-darken-4 text-uppercase"
                  prepend-icon="mdi-book-open-page-variant"
                  @click="activePlayTab = 1"
                >
                  Play Legacy Campaigns
                </v-btn>
              </div>
            </v-window-item>

            <!-- Window 2: Legacy Campaigns Submenu -->
            <v-window-item :value="1">
              <div class="pa-5 text-center">
                <div class="d-flex align-center justify-start mb-4">
                  <v-btn 
                    variant="text" 
                    color="grey-lighten-1" 
                    density="comfortable" 
                    @click="activePlayTab = 0"
                    class="text-none"
                  >
                    <v-icon start>mdi-arrow-left</v-icon>
                    Back to Choice
                  </v-btn>
                </div>

                <div class="legacy-cluster mb-6 mt-2">
                  <div class="d-flex justify-center align-center ga-6 position-relative z-10">
                    <v-img :src="CoreLogo" height="70" max-width="110" contain class="legacy-logo"></v-img>
                    <v-img :src="AwakeningsLogo" height="70" max-width="110" contain class="legacy-logo"></v-img>
                  </div>
                  <div class="d-flex justify-center align-center mt-n6 position-relative z-20">
                    <v-img :src="ApocalypseLogo" height="80" max-width="130" contain class="legacy-logo apoc-logo"></v-img>
                  </div>
                </div>

                <h3 class="text-h5 font-weight-bold text-amber-accent-2 mb-2">Legacy Campaigns Options</h3>
                <p class="text-body-2 text-grey-lighten-1 mb-6">
                  Select whether you want to start a brand new legacy campaign, load an existing campaign, or import a save token.
                </p>

                <v-btn 
                  color="amber-accent-2" 
                  variant="flat" 
                  rounded="pill" 
                  size="x-large"
                  block
                  class="font-weight-black text-grey-darken-4 mb-3"
                  prepend-icon="mdi-plus"
                  @click="triggerNewCampaign"
                >
                  New Campaign
                </v-btn>

                <v-btn 
                  color="amber-accent-2" 
                  variant="flat" 
                  rounded="pill" 
                  size="x-large"
                  block
                  class="font-weight-black text-grey-darken-4 mb-3"
                  prepend-icon="mdi-folder-open"
                  @click="triggerLoadCampaign"
                >
                  Load Campaign
                </v-btn>

                <v-btn 
                  color="amber-accent-2" 
                  variant="outlined" 
                  rounded="pill" 
                  size="x-large"
                  block
                  class="font-weight-black mb-3"
                  prepend-icon="mdi-import"
                  @click="triggerImportCampaign"
                >
                  Import Campaign
                </v-btn>
              </div>
            </v-window-item>
          </v-window>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed, onBeforeMount } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useDisplay } from "vuetify"; // Importação do useDisplay
import CampaignNew from "@/components/CampaignNew.vue";
import CampaignImport from "@/components/CampaignImport.vue";
import HUB from "@/components/HUB.vue";
import { CampaignStore } from "@/store/CampaignStore";
import { useUserStore } from "@/store/UserStore";
import type { HeroData } from "@/data/repository/HeroData";
import { HeroDataRepository } from "@/data/repository/HeroDataRepository";
import { useToast } from "primevue/usetoast";
import BaseAlert from "@/components/Alerts/BaseAlert.vue";
import axios from "axios";
import CoreLogo from "@/assets/campaign/logo/core.webp";
import ApocalypseLogo from "@/assets/campaign/logo/apocalypse.webp";
import AwakeningsLogo from "@/assets/campaign/logo/awakenings.webp";

const router = useRouter();
const route = useRoute();
const { mdAndUp } = useDisplay(); // Pegando a variável de breakpoint nativa do Vuetify
const userStore = useUserStore();
const campaignStore = CampaignStore();
const toast = useToast();

const campaignNewRef = ref<any>(null);
const campaignImportRef = ref<any>(null);

const showPlayDialog = ref(false);
const activePlayTab = ref(0);
const showHub = ref(false);
const myEvents = ref<any[]>([]);

const openPlayOptions = () => {
  showPlayDialog.value = true;
  activePlayTab.value = 0;
};

const triggerNewCampaign = () => {
  showPlayDialog.value = false;
  campaignNewRef.value?.openModal();
};

const triggerImportCampaign = () => {
  showPlayDialog.value = false;
  campaignImportRef.value?.openModal();
};

const triggerLoadCampaign = () => {
  showPlayDialog.value = false;
  const el = document.getElementById("campaigns");
  if (el) {
    el.scrollIntoView({ behavior: "smooth" });
  }
};

const handleJoinCampaign = () => {
  showPlayDialog.value = false;
  onJoinCampaign();
};

const openHub = async () => {
  showHub.value = true;
  if (userStore.user?.users_pk) {
    try {
      const response = await axios.get('/events/my_events/player', {
        params: { player_fk: userStore.user.users_pk, past_events: false },
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

const playDrunagorNights = () => {
  showPlayDialog.value = false;
  openHub();
};

const loading = ref(true);
const joiningCampaign = ref(false);
const loadingErrors = ref<{ id: number; text: string }[]>([]);
const showJoinCampaignDialog = ref(false);
const joinCampaignId = ref("");

const selectedBoxFilter = ref<string | null>(null);
const boxOptions = [
  { title: 'All Campaigns', value: null },
  { title: 'CoD Core', value: 'core' },
  { title: 'CoD Apocalypse', value: 'apocalypse' },
  { title: 'CoD Awakenings', value: 'awakenings' },
  { title: 'Drunagor Nights S1', value: 'underkeep' },
  { title: 'Drunagor Nights S2', value: 'underkeep2' }
];

const showOnlyFinished = ref(false);
const sortOrder = ref('desc');

const extraCampaignData = ref<Record<string, { lastDoorName: string, isFinished: boolean, players: any[] }>>({});

const BOX_ID = 38;

const allCampaigns = computed(() => {
  let campaigns = [...campaignStore.findAll()];

  if (selectedBoxFilter.value) {
    campaigns = campaigns.filter(c => c.campaign === selectedBoxFilter.value);
  }

  if (showOnlyFinished.value) {
      campaigns = campaigns.filter(c => extraCampaignData.value[c.campaignId]?.isFinished === true);
  } else {
      campaigns = campaigns.filter(c => !extraCampaignData.value[c.campaignId]?.isFinished);
  }

  return campaigns.sort((a, b) => {
    if (sortOrder.value === 'desc') {
      return Number(b.campaignId) - Number(a.campaignId);
    }
    return Number(a.campaignId) - Number(b.campaignId);
  });
});

const parsedCampaignFk = computed(() => {
  return joinCampaignId.value.length > 4 ? joinCampaignId.value.slice(4) : null;
});

const getBoxName = (boxId: number) => {
  const map: Record<number, string> = {
    22: "CoD Age of Darkness CORE",
    23: "CoD Apocalypse",
    24: "CoD Awakenings",
    34: "CoD Awakenings",
    38: "Drunagor Nights S1",
    39: "Drunagor Nights S2",
  };

  return map[boxId] || `Unknown Box (ID: ${boxId})`;
};

const getUserProfileImage = (pictureHash: string | null) => {
    if (pictureHash) {
        return `https://assets.drunagor.app/Profile/${pictureHash}`;
    }
    return '/assets/hero/avatar/default.webp';
};

const addLoadingError = (text: string) => {
  const id = Date.now();
  loadingErrors.value.push({ id, text });
  setTimeout(() => {
    loadingErrors.value = loadingErrors.value.filter((e) => e.id !== id);
  }, 5000);
};

const loadCampaignFromHash = (trackerHash: string, campaignPk: string, partyName: string) => {
  try {
    const data = JSON.parse(atob(trackerHash));

    if (!data.campaignData) return;

    const camp = data.campaignData;
    camp.campaignId = campaignPk;
    camp.name = partyName || camp.name || "Unnamed Campaign";
    
    if (data.heroes && Array.isArray(data.heroes)) {
      camp.heroes = data.heroes.map((h: any) => ({
        ...h,
        campaignId: campaignPk
      }));
    } else {
      camp.heroes = [];
    }

    campaignStore.add(camp);
  } catch (error) {
    console.error("Error loading campaign from hash:", error);
    throw error;
  }
};

const loadCampaignWithHeroes = async (campaignData: any) => {
  try {
    const campaignPk = String(campaignData.campaigns_fk);
    loadCampaignFromHash(campaignData.tracker_hash, campaignPk, campaignData.party_name);
    return true;
  } catch (error) {
    console.error("Error loading campaign:", error);
    const campaignId = String(campaignData.campaigns_fk);
    const boxName = getBoxName(campaignData.box);
    const partyName = campaignData.party_name || "Unnamed Party";

    addLoadingError(
      `Could not load the campaign "${partyName}" from the "${boxName}". ` +
        `Campaign ID: ${campaignId}. Data seems corrupted. Please contact support.`,
    );
    return false;
  }
};

const loadExtraData = async (campaignId: string) => {
    try {
        const [doorsRes, playersRes] = await Promise.all([
            axios.get("/rl_campaigns_doors/search", { params: { campaign_fk: campaignId } }),
            axios.get("/rl_campaigns_users/list_players", { params: { campaigns_fk: campaignId } })
        ]);
        
        const doors = doorsRes.data.campaign_doors || [];
        let lastDoorName = "None";
        let isFinished = false;

        if (doors.length > 0) {
            doors.sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());
            const latest = doors[0];
            lastDoorName = latest.door_name;
            
            if (latest.doors_fk === 7 || latest.doors_fk === 12 || latest.door_name === "END GAME") {
                isFinished = true;
            }
        }

        const players = playersRes.data.Users || [];

        extraCampaignData.value[campaignId] = {
            lastDoorName,
            isFinished,
            players
        };
    } catch (e) {
        console.error(`Error loading extra info for campaign ${campaignId}:`, e);
    }
};

const loadCampaigns = async () => {
  loading.value = true;
  campaignStore.reset();
  loadingErrors.value = [];

  if (!userStore.user?.users_pk) {
    userStore.restoreFromStorage();
  }
  if (!userStore.user?.users_pk) {
    loading.value = false;
    return;
  }

  try {
    // Primeira requisição: sem season 2 (ou season 2 = false)
    try {
      const campaignsResponse1 = await axios.get("/rl_campaigns_users/search", {
        params: {
          users_fk: userStore.user.users_pk,
          show_season2: false,
        },
      });

      if (campaignsResponse1.data?.campaigns) {
        for (const campaignData of campaignsResponse1.data.campaigns) {
          await loadCampaignWithHeroes(campaignData);
        }
      }
    } catch (err1) {
      console.warn("Error loading Season 1 campaigns:", err1);
    }

    // Segunda requisição: com season 2 = true
    try {
      const campaignsResponse2 = await axios.get("/rl_campaigns_users/search", {
        params: {
          users_fk: userStore.user.users_pk,
          show_season2: true,
        },
      });

      if (campaignsResponse2.data?.campaigns) {
        for (const campaignData of campaignsResponse2.data.campaigns) {
          await loadCampaignWithHeroes(campaignData);
        }
      }
    } catch (err2) {
      console.warn("Error loading Season 2 campaigns:", err2);
    }

    const storeCampaigns = campaignStore.findAll();
    const underkeep2Campaigns = storeCampaigns.filter(c => c.campaign === 'underkeep2');
    
    await Promise.allSettled(
        underkeep2Campaigns.map(c => loadExtraData(c.campaignId))
    );

  } catch (error) {
    console.error("Error fetching campaigns:", error);
    addLoadingError("Error fetching campaigns. Please try again later.");
  } finally {
    loading.value = false;
  }
};

const goToCampaign = (campaign: any) => {
  if (extraCampaignData.value[campaign.campaignId]?.isFinished) {
      toast.add({
          severity: 'info',
          summary: 'Campaign Finished',
          detail: 'This campaign is finalized. You can no longer interact with its state.',
          life: 4000
      });
      return; 
  }
  router.push({ name: "Campaign", params: { id: campaign.campaignId } });
};

const heroAvatars = (campId: string): HeroData[] => {
  const repo = new HeroDataRepository();
  const heroes = campaignStore.findAllHeroes(campId);

  if (heroes.length === 0) {
    return [];
  }

  return heroes
    .map((h) => repo.find(h.heroId))
    .filter((h): h is HeroData => !!h);
};

// CÁLCULO DE TAMANHO REATIVO
const calculateAvatarSize = (campId: string): number => {
    const heroCount = campaignStore.findAllHeroes(campId).length;

    // Desktop (PC): Mantém o tamanho grande que você curtiu
    if (mdAndUp.value) {
        return 110; 
    } 

    // Mobile: Reduz de forma inteligente para não quebrar a linha
    if (heroCount <= 4) {
        return 75; // Cabe 4 na linha
    } else {
        return 60; // Cabe 5 na linha
    }
};

const onJoinCampaign = () => {
  showJoinCampaignDialog.value = true;
};

const confirmJoinCampaign = async () => {
  if (!parsedCampaignFk.value) return;

  joiningCampaign.value = true;
  const usersPk = userStore.user.users_pk;
  const campaignId = parsedCampaignFk.value;

  try {
    // 1. Fetch the campaign info from server first to determine its box SKU
    const campaignInfoRes = await axios.get(`/campaigns/${campaignId}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` }
    });
    
    const campaignBox = campaignInfoRes.data?.box || BOX_ID;
    const isSeason2 = campaignBox === 39;

    // 2. Perform the cadastro with the correct skus_fk via Query Parameters
    await axios.post(
      "/rl_campaigns_users/cadastro",
      null,
      {
        params: {
          users_fk: usersPk,
          campaigns_fk: Number(campaignId),
          skus_fk: campaignBox,
          active: true
        },
        headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
      },
    );

    // 3. Search with correct show_season2 setting
    const campaignResponse = await axios.get("/rl_campaigns_users/search", {
      params: {
        users_fk: usersPk,
        campaigns_fk: campaignId,
        show_season2: isSeason2,
      },
      headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
    });

    const campaignData = campaignResponse.data?.campaigns?.[0];

    if (campaignData && campaignData.tracker_hash) {
      await loadCampaignWithHeroes(campaignData);

      router.push({
        path: `/campaign-tracker/campaign/${campaignId}`,
        query: { sku: String(campaignBox) },
      });

      toast.add({
        severity: "success",
        summary: "Success",
        detail: "You have successfully joined the campaign!",
      });
    } else {
      throw new Error("Failed to retrieve campaign data after joining.");
    }
  } catch (err: any) {
    console.error("Error during join process:", err);
    let errorMessage = "Error joining campaign.";
    let severity = "error";

    // Since we failed, check if the user is already part of it or conflicts
    if (
      err.response?.data?.message?.includes("already exists") ||
      err.response?.data?.message?.includes("já existe") ||
      err.response?.status === 409
    ) {
      errorMessage = "You are already part of this campaign!";
      severity = "info";

      // Attempt to retrieve campaign box to redirect correctly
      let campaignBox = BOX_ID;
      try {
        const campaignInfoRes = await axios.get(`/campaigns/${campaignId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` }
        });
        if (campaignInfoRes.data?.box) {
          campaignBox = campaignInfoRes.data.box;
        }
      } catch (boxErr) {
        console.warn("Could not determine campaign box on redirect fallback", boxErr);
      }

      router.push({
        path: `/campaign-tracker/campaign/${campaignId}`,
        query: { sku: String(campaignBox) },
      });
    }

    toast.add({
      severity: severity,
      summary: severity === "info" ? "Info" : "Error",
      detail: errorMessage,
    });
  } finally {
    joiningCampaign.value = false;
    joinCampaignId.value = "";
    showJoinCampaignDialog.value = false;
  }
};

onBeforeMount(async () => {
  await loadCampaigns();
});
</script>

<style scoped>
.dialog-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
}

.adventure-choice-card {
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.6) !important;
}

.play-campaigns-btn {
  box-shadow: 0 4px 15px rgba(var(--v-theme-playbutton), 0.3) !important;
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out !important;
}

.play-campaigns-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(var(--v-theme-playbutton), 0.5) !important;
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
</style>