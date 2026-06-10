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
          class="d-flex flex-column"
          style="overflow: hidden;"
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
              <span v-if="campaign.wing">{{ formatWingName(campaign.wing) }}</span>
              <span v-if="['underkeep', 'underkeep2'].includes(campaign.campaign) && lastDoorName" class="ml-2">
                - Last Door: <span class="text-white font-weight-bold">{{ lastDoorName }}</span>
              </span>
              <span v-if="['underkeep', 'underkeep2'].includes(campaign.campaign)" class="ml-auto text-amber-accent-2 font-weight-bold text-subtitle-2">
                {{ calculateCompletionPercentage(campaign) }}%
              </span>
            </div>
          </v-card-title>

          <v-progress-linear
            v-if="['underkeep', 'underkeep2'].includes(campaign.campaign)"
            :model-value="calculateCompletionPercentage(campaign)"
            color="amber-accent-2"
            height="3"
            class="mb-0"
          ></v-progress-linear>



          <!-- Underkeep style: Players list -->
          <div v-if="['underkeep', 'underkeep2'].includes(campaign.campaign)" class="mt-1 px-3 pt-0 pb-0">
            <div class="d-flex flex-wrap align-end mt-0 standees-list-container">
              <div
                v-for="player in players"
                :key="player.rl_campaigns_users_pk"
                class="d-flex flex-column align-center text-center player-standee-container"
              >
                <!-- Hero Standee Card (120x170 proportional) -->
                <div class="hero-standee-card">
                  <v-img
                    v-if="getPlayerHero(campaign.campaignId, player.playable_heroes_fk)"
                    :src="getPlayerHero(campaign.campaignId, player.playable_heroes_fk).images.avatar"
                    cover
                    class="w-100 h-100"
                  ></v-img>
                  <v-icon v-else size="large" color="grey" class="ma-auto">mdi-help</v-icon>

                  <!-- Player Name overlay at bottom -->
                  <div class="player-name-overlay">
                    <span class="player-name-text">{{ player.user_name }}</span>
                  </div>
                </div>
              </div>
              <span v-if="players.length === 0" class="text-caption text-grey font-italic pb-3">No players synced yet.</span>

              <!-- Last Update Date inline -->
              <div class="ml-auto pb-1 align-self-end d-flex align-center text-grey-lighten-1 last-update-text" style="font-size: 0.7rem;">
                <v-icon size="12" class="mr-1">mdi-clock-outline</v-icon>
                <span>{{ formattedLastUpdate }}</span>
              </div>
            </div>
          </div>

          <!-- Legacy style: Hero Avatars -->
          <div v-else class="mt-1 px-3 pt-0 pb-0">
            <div class="d-flex flex-wrap align-end mt-0 standees-list-container">
              <div
                v-for="hero in heroAvatars"
                :key="hero.heroId"
                class="d-flex flex-column align-center text-center player-standee-container"
              >
                <!-- Hero Standee Card (120x170 proportional) -->
                <div class="hero-standee-card">
                  <v-img
                    :src="hero.images.avatar"
                    cover
                    class="w-100 h-100"
                  ></v-img>
                </div>
              </div>

              <!-- Last Update Date inline -->
              <div class="ml-auto pb-1 align-self-end d-flex align-center text-grey-lighten-1 last-update-text" style="font-size: 0.7rem;">
                <v-icon size="12" class="mr-1">mdi-clock-outline</v-icon>
                <span>{{ formattedLastUpdate }}</span>
              </div>
            </div>
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
import { CampaignStore } from "@/store/CampaignStore";
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
const campaignStore = CampaignStore();
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
    hour: "2-digit",
    minute: "2-digit",
  }).replace(",", "");
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
          _t: Date.now()
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
          _t: Date.now()
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

        // Load heroes for each player in parallel using Promise.allSettled
        await Promise.allSettled(
          players.value.map(async (player: any) => {
            if (player.playable_heroes_fk) {
              try {
                const res = await axios.get(`/playable_heroes/${player.playable_heroes_fk}`);
                if (res.data?.hero_hash) {
                  const jsonStr = atob(res.data.hero_hash);
                  const heroObj = JSON.parse(jsonStr);
                  heroObj.campaignId = campaign.value.campaignId;
                  heroObj.playableHeroesPk = player.playable_heroes_fk;
                  campaignStore.addOrUpdateHero(campaign.value.campaignId, heroObj);
                }
              } catch (err) {
                console.warn(`[RecentCampaignWidget] Failed to load hero ${player.playable_heroes_fk}:`, err);
              }
            }
          })
        );
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

const heroRepo = new HeroDataRepository();

const getPlayerHero = (campaignId: string, playableHeroFk: number | null) => {
  if (!playableHeroFk) return null;
  const hero = campaignStore.findHeroByPlayableHeroesPk(campaignId, playableHeroFk);
  if (!hero) return null;
  return heroRepo.find(hero.heroId) || null;
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

// Format wing name to exclude "advanced"
const formatWingName = (wing: string | null) => {
  if (!wing) return "";
  return wing
    .replace(/-\s*advanced/gi, "")
    .replace(/advanced\s*-/gi, "")
    .replace(/advanced/gi, "")
    .replace(/\s+/g, " ")
    .trim();
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
.hero-standee-card {
  width: 105px;
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
.player-standee-container {
  width: 105px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
}
.standees-list-container {
  gap: 12px;
}
.player-name-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.95) 0%, rgba(0, 0, 0, 0.5) 50%, rgba(0, 0, 0, 0) 100%);
  padding: 24px 4px 10px 4px;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2;
}
.player-name-text {
  color: white;
  font-size: 0.72rem;
  font-weight: 800;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.8);
  text-align: center;
  width: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
@media (max-width: 600px) {
  .last-update-text {
    font-size: 0.65rem !important;
  }
  .hero-standee-card {
    width: 82px;
  }
  .player-standee-container {
    width: 82px;
  }
  .standees-list-container {
    gap: 8px;
  }
}
@media (max-width: 360px) {
  .hero-standee-card {
    width: 72px;
  }
  .player-standee-container {
    width: 72px;
  }
  .standees-list-container {
    gap: 6px;
  }
}
</style>
