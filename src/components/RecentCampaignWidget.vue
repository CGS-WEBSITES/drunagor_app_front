<template>
  <v-container v-if="loading || campaign" max-width="800" class="pa-4 pt-0 pb-0">
    <v-card rounded="lg" elevation="3" color="primary" class="pl-1 pt-1 pr-1 pb-5">
      <v-card-title class="d-flex justify-space-between pb-0 px-3">
        <span class="text-uppercase font-weight-black text-bold text-h5 mb-2 pb-0 text-white">
          {{ isOwner ? 'MY RECENT ADVENTURE' : 'RECENT ADVENTURE' }}
        </span>
      </v-card-title>

      <div v-if="loading" class="d-flex justify-center align-center py-16">
        <v-progress-circular indeterminate color="white" size="50"></v-progress-circular>
      </div>

      <div v-else-if="campaign" class="px-2">
        <v-card
          color="secundary"
          elevation="16"
          width="100%"
        >
          <!-- Banner Image -->
          <v-img
            v-if="campaign.campaign === 'core'"
            src="https://assets.drunagor.app/CampaignTracker/CoreCompanion.webp"
            max-height="200"
            cover
          ></v-img>

          <v-img
            v-slot:default
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
          ></v-img>

          <!-- Campaign Header/Title -->
          <v-card-title class="d-flex flex-column text-uppercase pb-1">
            <div class="d-flex justify-space-between align-center w-100">
              <span class="text-h5 font-weight-bold mb-0 text-truncate text-white">
                {{ campaign.name || "Unnamed Campaign" }}
              </span>
              <v-chip
                v-if="['underkeep', 'underkeep2'].includes(campaign.campaign) && isFinished"
                color="red-darken-4"
                size="small"
                variant="flat"
                class="font-weight-bold ml-2"
              >
                FINISHED
              </v-chip>
            </div>

            <div class="d-flex align-center text-subtitle-1 mt-0 text-grey-lighten-1">
              <span v-if="campaign.wing">{{ campaign.wing }}</span>
              <span v-if="['underkeep', 'underkeep2'].includes(campaign.campaign) && lastDoorName" class="ml-2 text-truncate">
                - Last Door: <span class="text-white font-weight-bold">{{ lastDoorName }}</span>
              </span>
            </div>
          </v-card-title>

          <!-- Underkeep style: Players list -->
          <v-card-text v-if="['underkeep', 'underkeep2'].includes(campaign.campaign)">
            <div class="text-caption text-grey-lighten-1 mb-2">PLAYERS</div>
            <div class="d-flex flex-wrap gap-2">
              <v-chip
                v-for="player in players"
                :key="player.rl_campaigns_users_pk"
                class="bg-grey-darken-4 text-white font-weight-medium pl-1 pr-3"
                size="small"
              >
                <v-avatar start class="mr-1">
                  <v-img :src="getUserProfileImage(player.picture_hash)" cover></v-img>
                </v-avatar>
                {{ player.user_name }}
              </v-chip>
              <span v-if="players.length === 0" class="text-caption text-grey font-italic">No players synced yet.</span>
            </div>
          </v-card-text>

          <!-- Legacy style: Hero Avatars -->
          <v-card-text v-else>
            <v-row no-gutters>
              <v-col
                v-for="hero in heroAvatars"
                :key="hero.heroId"
                cols="auto"
                class="d-flex"
              >
                <v-avatar
                  class="my-1 rounded-0 mx-1"
                  :image="hero.images.avatar"
                  :size="calculateAvatarSize"
                ></v-avatar>
              </v-col>
            </v-row>
          </v-card-text>

          <!-- Last Update Date -->
          <div class="px-4 pb-3 pt-0 d-flex justify-end">
            <span class="text-caption text-grey-lighten-1 last-update-text">
              LAST UPDATE: {{ formattedLastUpdate }}
            </span>
          </div>
        </v-card>
      </div>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, inject } from "vue";
import { useRouter } from "vue-router";
import { useDisplay } from "vuetify";
import { useUserStore } from "@/store/UserStore";
import { HeroDataRepository } from "@/data/repository/HeroDataRepository";
import type { HeroData } from "@/data/repository/HeroData";

const props = defineProps({
  userId: {
    type: [String, Number],
    required: true,
  },
});

const router = useRouter();
const userStore = useUserStore();
const { mdAndUp } = useDisplay();
const axios: any = inject("axios");

const isOwner = computed(() => {
  return String(userStore.user?.users_pk) === String(props.userId);
});

const loading = ref(true);
const campaign = ref<any | null>(null);
const lastDoorName = ref("None");
const isFinished = ref(false);
const players = ref<any[]>([]);
const lastUpdateDate = ref<Date | null>(null);

// Get User Profile Image
const getUserProfileImage = (pictureHash: string | null) => {
  if (pictureHash) {
    return `https://assets.drunagor.app/Profile/${pictureHash}`;
  }
  return "/assets/hero/avatar/default.webp";
};

// Formatted last update date
const formattedLastUpdate = computed(() => {
  if (!lastUpdateDate.value) return "Unknown";
  return lastUpdateDate.value.toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
});

// Load the most recent campaign for a user
const loadMostRecentCampaign = async () => {
  if (!props.userId) return;

  loading.value = true;
  try {
    let legacyCampaigns = [];
    try {
      const resLegacy = await axios.get("/rl_campaigns_users/search", {
        params: {
          users_fk: props.userId,
          show_season2: false,
        },
      });
      legacyCampaigns = resLegacy.data?.campaigns || [];
    } catch (err1) {
      console.warn("[RecentCampaignWidget] Failed fetching legacy campaigns:", err1);
    }

    let s2Campaigns = [];
    try {
      const resS2 = await axios.get("/rl_campaigns_users/search", {
        params: {
          users_fk: props.userId,
          show_season2: true,
        },
      });
      s2Campaigns = resS2.data?.campaigns || [];
    } catch (err2) {
      console.warn("[RecentCampaignWidget] Failed fetching S2 campaigns:", err2);
    }

    const allCampaignsRaw = [
      ...legacyCampaigns,
      ...s2Campaigns,
    ];

    if (allCampaignsRaw.length === 0) {
      campaign.value = null;
      return;
    }

    const campaignsWithDates = allCampaignsRaw.map((c: any) => {
      let mtime = 0;
      let parsedHash: any = null;

      // Try to parse savedAt from tracker_hash
      if (c.tracker_hash) {
        try {
          parsedHash = JSON.parse(atob(c.tracker_hash));
          if (parsedHash.savedAt) {
            mtime = new Date(parsedHash.savedAt).getTime();
          }
        } catch (e) {
          // ignore parsing issues
        }
      }

      // Fallback/Compare to start_date
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

    // Sort by mtime descending to get the most recently updated one
    campaignsWithDates.sort((a, b) => b.mtime - a.mtime);

    const mostRecent = campaignsWithDates[0];
    const rawCamp = mostRecent.raw;
    const parsed = mostRecent.parsedHash;

    if (parsed && parsed.campaignData) {
      const campData = parsed.campaignData;
      campData.campaignId = String(rawCamp.campaigns_fk);
      campData.name = rawCamp.party_name || campData.name || "Unnamed Campaign";
      campData.heroes = parsed.heroes || [];
      campaign.value = campData;
    } else {
      campaign.value = {
        campaignId: String(rawCamp.campaigns_fk),
        name: rawCamp.party_name || "Unnamed Campaign",
        campaign: rawCamp.box === 38 ? "underkeep" : rawCamp.box === 39 ? "underkeep2" : "core",
        heroes: [],
      };
    }

    // Set last update date
    lastUpdateDate.value = mostRecent.mtime > 0 ? new Date(mostRecent.mtime) : null;

    // Load extra details for underkeep campaigns
    if (["underkeep", "underkeep2"].includes(campaign.value.campaign)) {
      try {
        const [doorsRes, playersRes] = await Promise.all([
          axios.get("/rl_campaigns_doors/search", {
            params: { campaign_fk: campaign.value.campaignId },
          }),
          axios.get("/rl_campaigns_users/list_players", {
            params: { campaigns_fk: campaign.value.campaignId },
          }),
        ]);

        const doors = doorsRes.data?.campaign_doors || [];
        if (doors.length > 0) {
          doors.sort((a: any, b: any) => b.rl_campaigns_doors_pk - a.rl_campaigns_doors_pk);
          const latest = doors[0];
          lastDoorName.value = latest.door_name;

          if (latest.doors_fk === 7 || latest.doors_fk === 12 || latest.door_name === "END GAME") {
            isFinished.value = true;
          }

          // Check if latest door date is newer than current lastUpdateDate
          const doorTime = new Date(latest.date).getTime();
          if (!lastUpdateDate.value || doorTime > lastUpdateDate.value.getTime()) {
            lastUpdateDate.value = new Date(doorTime);
          }
        } else {
          lastDoorName.value = "None";
          isFinished.value = false;
        }

        players.value = playersRes.data?.Users || [];
      } catch (e) {
        console.error("Error loading extra info for recent campaign:", e);
      }
    }
  } catch (err) {
    console.error("Error loading most recent campaign:", err);
  } finally {
    loading.value = false;
  }
};

// Calculate hero avatars for legacy campaigns
const heroAvatars = computed<HeroData[]>(() => {
  if (!campaign.value || !campaign.value.heroes) return [];
  const repo = new HeroDataRepository();
  return campaign.value.heroes
    .map((h: any) => repo.find(h.heroId))
    .filter((h: any): h is HeroData => !!h);
});

// Dynamic avatar sizing
const calculateAvatarSize = computed(() => {
  const heroCount = campaign.value?.heroes?.length || 0;
  if (mdAndUp.value) {
    return 110;
  }
  return heroCount <= 4 ? 68 : 54;
});

// Go to campaign details
const goToCampaign = () => {
  if (!campaign.value) return;
  router.push({ name: "Campaign", params: { id: campaign.value.campaignId } });
};

onMounted(loadMostRecentCampaign);
watch(() => props.userId, loadMostRecentCampaign);
</script>

<style scoped>
.cursor-pointer {
  cursor: pointer;
}
.transition-swing {
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
}
.transition-swing:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.5) !important;
}
@media (max-width: 600px) {
  .last-update-text {
    font-size: 0.65rem !important;
  }
}
</style>
