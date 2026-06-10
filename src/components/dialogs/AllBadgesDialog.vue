<template>
  <v-dialog
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    max-width="650px"
    transition="dialog-bottom-transition"
  >
    <v-card color="#151515" class="rounded-lg overflow-hidden dialog-card" style="border: 1px solid rgba(255, 255, 255, 0.1);">
      <!-- Title Header -->
      <v-card-title class="d-flex justify-space-between align-center py-4 px-6 border-b border-light">
        <span class="text-h5 font-weight-black text-uppercase tracking-wider text-white">
          Badges
        </span>
        <v-btn icon variant="text" color="grey-lighten-1" @click="$emit('update:modelValue', false)">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>

      <!-- Loading / Content Area -->
      <v-card-text class="pa-6 content-area">
        <div v-if="loading" class="d-flex justify-center align-center py-12">
          <v-progress-circular indeterminate size="64" color="amber-accent-4" />
        </div>

        <div v-else-if="allRewards.length === 0" class="text-center py-12 text-grey">
          <v-icon size="48" class="mb-2">mdi-trophy-outline</v-icon>
          <div>No achievements found.</div>
        </div>

        <div v-else class="badges-list pr-1">
          <v-card
            v-for="reward in allRewards"
            :key="reward.rewards_pk"
            rounded="lg"
            elevation="3"
            class="badge-card mb-3 d-flex flex-column position-relative"
            :class="{ 'locked-badge': !isUnlocked(reward.rewards_pk) }"
            color="secundary"
          >
            <!-- Card Body (Identical layout to outer profile widget) -->
            <v-row class="align-center py-2 px-0 my-0">
              <v-col
                cols="3"
                sm="2"
                class="d-flex align-center justify-center pl-4 pr-2"
              >
                <v-img
                  :src="getRewardImage(reward.picture_hash)"
                  alt="Reward Icon"
                  max-height="80"
                  class="rounded-lg"
                  contain
                >
                  <template #placeholder>
                    <v-row class="fill-height ma-0" align="center" justify="center">
                      <v-progress-circular indeterminate size="20" color="grey" />
                    </v-row>
                  </template>
                </v-img>
              </v-col>

              <v-col cols="9" sm="10" class="pl-2 d-flex flex-column justify-center">
                <p class="font-weight-bold white--text ma-0">
                  {{ reward.name }}
                </p>
                <p class="text-body-2 grey--text ma-0">
                  {{ reward.description }}
                </p>
              </v-col>
            </v-row>

            <!-- Date in the bottom right corner (Identical to outer profile widget) -->
            <div
              v-if="isUnlocked(reward.rewards_pk)"
              class="date-position text-caption grey--text"
              :style="{ bottom: hasUnlocks(reward.rewards_pk) ? '48px' : '8px' }"
            >
              {{ getEarnedDate(reward.rewards_pk) }}
            </div>

            <!-- Unlocks strip below the card (Images only, no text names) -->
            <div v-if="hasUnlocks(reward.rewards_pk)" class="px-4 py-2 d-flex align-center bg-black-opacity mt-2" style="border-top: 1px solid rgba(255, 255, 255, 0.05);">
              <span class="text-caption text-grey-darken-1 mr-3">Unlocks:</span>
              <div class="d-flex align-center ga-2">
                <!-- Avatars -->
                <v-avatar
                  v-for="avatar in getUnlocks(reward.rewards_pk).avatars"
                  :key="avatar.hash"
                  size="24"
                  rounded="sm"
                  class="border border-grey"
                >
                  <v-img :src="`${assets}/Profile/${avatar.hash}`" />
                </v-avatar>

                <!-- Backgrounds -->
                <v-img
                  v-for="bg in getUnlocks(reward.rewards_pk).backgrounds"
                  :key="bg.hash"
                  :src="`${assets}/Profile/${bg.hash}`"
                  width="36"
                  height="20"
                  cover
                  class="rounded border border-grey"
                />
              </div>
            </div>
          </v-card>
        </div>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
import { ref, computed, watch, inject } from "vue";
import axios from "axios";
import { getToken } from "@/service/AccessToken";

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
  userId: {
    type: [Number, String],
    required: true,
  },
});

defineEmits(["update:modelValue"]);

const axiosInstance = inject<any>("axios") || axios;
const assets = inject<string>("assets") || "https://assets.drunagor.app";

const loading = ref(false);
const allRewards = ref<any[]>([]);
const rawUserRewards = ref<any[]>([]);

// Cosmetic unlocks mapping based on PerfilImage.vue
const badgeUnlocks: Record<number, { avatars: any[]; backgrounds: any[] }> = {
  1: {
    avatars: [{ hash: "Tharmagar.png", name: "Tharmagar" }],
    backgrounds: [{ hash: "EarlyBackNew.png", name: "Early Adopter BG" }],
  },
  2: {
    avatars: [{ hash: "Archer.png", name: "Archer" }],
    backgrounds: [],
  },
  3: {
    avatars: [{ hash: "Pietro.png", name: "Pietro" }],
    backgrounds: [],
  },
  5: {
    avatars: [{ hash: "Mathias.png", name: "Mathias" }],
    backgrounds: [],
  },
  6: {
    avatars: [{ hash: "DragonS2.png", name: "Dragon S2" }],
    backgrounds: [{ hash: "Season2Background.png", name: "Season 2 BG" }],
  },
};

// Deduplicate user rewards, keeping the oldest achievement date for each unique rewards_pk
const oldestUserRewardsMap = computed(() => {
  const map = new Map<number, any>();
  for (const reward of rawUserRewards.value) {
    const pk = reward.rewards_pk;
    const existing = map.get(pk);
    const currentDate = reward.date || reward.created_at || reward.date_conquest || new Date().toISOString();
    if (!existing) {
      map.set(pk, { ...reward, resolvedDate: currentDate });
    } else {
      const existingDate = existing.resolvedDate;
      if (new Date(currentDate) < new Date(existingDate)) {
        map.set(pk, { ...reward, resolvedDate: currentDate });
      }
    }
  }
  return map;
});

const isUnlocked = (rewardPk: number) => {
  return oldestUserRewardsMap.value.has(rewardPk);
};

const getEarnedDate = (rewardPk: number) => {
  const userReward = oldestUserRewardsMap.value.get(rewardPk);
  if (!userReward) return "";
  return new Date(userReward.resolvedDate).toLocaleDateString("en-US", {
    year: "numeric",
    month: "numeric",
    day: "numeric",
  });
};

const getRewardImage = (pictureHash: string) => {
  if (!pictureHash) return "https://s3.us-east-2.amazonaws.com/assets.drunagor.app/Profile/store.png";
  if (pictureHash.startsWith("http")) return pictureHash;
  return `https://assets.drunagor.app/${pictureHash}`;
};

const hasUnlocks = (rewardPk: number) => {
  const unlocks = badgeUnlocks[rewardPk];
  if (!unlocks) return false;
  return (unlocks.avatars && unlocks.avatars.length > 0) || (unlocks.backgrounds && unlocks.backgrounds.length > 0);
};

const getUnlocks = (rewardPk: number) => {
  return badgeUnlocks[rewardPk] || { avatars: [], backgrounds: [] };
};

const fetchData = async () => {
  if (!props.modelValue || !props.userId) return;

  loading.value = true;
  try {
    const headers = getToken();

    // Fetch all achievements
    const allRewardsRes = await axiosInstance.get("/rewards/search", { headers });
    allRewards.value = allRewardsRes.data.rewards || [];

    // Fetch this user's unlocked achievements
    const userRewardsRes = await axiosInstance.get("/rl_users_rewards/list_rewards", {
      params: { users_fk: props.userId },
      headers,
    });
    rawUserRewards.value = userRewardsRes.data.rewards || [];
  } catch (err) {
    console.error("ÔØî Error fetching achievements list:", err);
  } finally {
    loading.value = false;
  }
};

watch(
  () => props.modelValue,
  (newVal) => {
    if (newVal) {
      fetchData();
    }
  }
);
</script>

<style scoped>
.border-b {
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}
.content-area {
  max-height: 550px;
  overflow-y: auto;
}

/* Scrollbar customizations */
.content-area::-webkit-scrollbar {
  width: 6px;
}
.content-area::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.2);
}
.content-area::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.15);
  border-radius: 3px;
}
.content-area::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.3);
}

.badge-card {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.badge-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.4);
}

.locked-badge {
  opacity: 0.4;
  filter: grayscale(100%);
}

.bg-black-opacity {
  background-color: rgba(0, 0, 0, 0.25);
}

.border-grey {
  border: 1px solid rgba(255, 255, 255, 0.15) !important;
}

.date-position {
  position: absolute;
  right: 12px;
}
</style>
