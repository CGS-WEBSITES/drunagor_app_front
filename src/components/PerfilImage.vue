<template>
  <v-container max-width="800" class="pa-4 mt-2">
    <!-- Alert Area -->
    <v-row v-if="showAlert" no-gutters class="mb-4">
      <BaseAlert
        v-model="showAlert"
        :type="alertType"
        :icon="alertIcon"
        :title="alertTitle"
        closable
        class="w-100"
      >
        {{ alertText }}
      </BaseAlert>
    </v-row>

    <!-- Save Changes Button -->
    <v-row no-gutters class="mb-6">
      <v-col cols="12">
        <v-btn
          color="#599b4d"
          block
          size="large"
          class="save-all-btn text-white font-weight-black py-3 rounded-lg"
          elevation="3"
          :loading="isSaving"
          @click="saveAllChanges"
          style="font-size: 1.1rem; letter-spacing: 1.5px;"
        >
          SAVE ALL CHANGES
        </v-btn>
      </v-col>
    </v-row>

    <!-- AVATAR Section -->
    <v-row no-gutters class="mb-6">
      <v-col cols="12">
        <v-card color="primary" rounded="lg" elevation="2">
          <v-card-title
            class="d-flex justify-space-between align-center cursor-pointer py-4 px-6"
            @click="avatarExpanded = !avatarExpanded"
          >
            <span class="text-h5 font-weight-black text-uppercase">AVATAR</span>
            <v-icon>{{ avatarExpanded ? "mdi-chevron-up" : "mdi-chevron-down" }}</v-icon>
          </v-card-title>

          <v-expand-transition>
            <div v-show="avatarExpanded">
              <v-divider></v-divider>
              <v-card-text class="pa-6">
                <!-- Defaults Sub-section -->
                <div class="text-subtitle-2 font-weight-bold mb-4 text-grey-lighten-1 text-uppercase tracking-wider">Padrões</div>
                <v-row class="mb-6">
                  <v-col
                    v-for="item in defaultAvatars"
                    :key="item.hash"
                    cols="4"
                    sm="3"
                    md="2"
                    class="d-flex flex-column align-center pa-2"
                  >
                    <v-hover v-slot="{ isHovering, props }">
                      <v-card
                        v-bind="props"
                        :elevation="isHovering ? 12 : 2"
                        class="cursor-pointer avatar-card"
                        :class="{ 'selected-border': isAvatarSelected(item.hash) }"
                        @click="selectAvatar(item.hash)"
                      >
                        <v-img
                          :src="`${assets}/Profile/${item.hash}?t=${userStore.cacheBuster}`"
                          alt="Avatar"
                          aspect-ratio="1"
                          cover
                          class="rounded-lg"
                        />
                      </v-card>
                    </v-hover>
                  </v-col>
                </v-row>

                <!-- Rewards Sub-section -->
                <div class="text-subtitle-2 font-weight-bold mb-4 text-grey-lighten-1 text-uppercase tracking-wider">Badge Rewards</div>
                <v-row>
                  <v-col
                    v-for="item in rewardAvatars"
                    :key="item.hash"
                    cols="4"
                    sm="3"
                    md="2"
                    class="d-flex flex-column align-center pa-2"
                  >
                    <v-hover v-slot="{ isHovering, props }">
                      <v-card
                        v-bind="props"
                        :elevation="isHovering ? 12 : 2"
                        class="cursor-pointer avatar-card relative"
                        :class="{
                          'selected-border': isAvatarSelected(item.hash),
                          'locked-item': !isUnlocked(item)
                        }"
                        @click="isUnlocked(item) ? selectAvatar(item.hash) : showLockAlert(item)"
                      >
                        <v-img
                          :src="`${assets}/Profile/${item.hash}?t=${userStore.cacheBuster}`"
                          alt="Avatar"
                          aspect-ratio="1"
                          cover
                          class="rounded-lg"
                        >
                          <!-- Lock Overlay -->
                          <div
                            v-if="!isUnlocked(item)"
                            class="lock-overlay d-flex align-center justify-center"
                          >
                            <v-icon size="28" color="rgba(255, 255, 255, 0.9)">mdi-lock</v-icon>
                          </div>
                        </v-img>
                      </v-card>
                    </v-hover>
                    
                    <!-- Unlock Criteria Explanation -->
                    <div class="unlock-desc text-center mt-2 w-100">
                      <span class="badge-tag d-block text-uppercase font-weight-black text-caption">{{ item.badgeName }}</span>
                      <span 
                        class="desc-text text-grey mt-05" 
                        :class="item.badgeId === 1 ? 'early-adopter-text' : 'text-caption'"
                      >
                        {{ getRewardDescription(item) }}
                      </span>
                    </div>
                  </v-col>
                </v-row>
              </v-card-text>
            </div>
          </v-expand-transition>
        </v-card>
      </v-col>
    </v-row>

    <!-- BACKGROUND Section -->
    <v-row no-gutters class="mb-6">
      <v-col cols="12">
        <v-card color="primary" rounded="lg" elevation="2">
          <v-card-title
            class="d-flex justify-space-between align-center cursor-pointer py-4 px-6"
            @click="backgroundExpanded = !backgroundExpanded"
          >
            <span class="text-h5 font-weight-black text-uppercase">BACKGROUND</span>
            <v-icon>{{ backgroundExpanded ? "mdi-chevron-up" : "mdi-chevron-down" }}</v-icon>
          </v-card-title>

          <v-expand-transition>
            <div v-show="backgroundExpanded">
              <v-divider></v-divider>
              <v-card-text class="pa-6">
                <!-- Defaults Sub-section -->
                <div class="text-subtitle-2 font-weight-bold mb-4 text-grey-lighten-1 text-uppercase tracking-wider">Padrões</div>
                <v-row class="mb-6">
                  <v-col
                    v-for="item in defaultBackgrounds"
                    :key="item.hash"
                    cols="12"
                    sm="6"
                    md="4"
                    class="d-flex flex-column pa-2"
                  >
                    <v-hover v-slot="{ isHovering, props }">
                      <v-card
                        v-bind="props"
                        :elevation="isHovering ? 12 : 2"
                        class="cursor-pointer bg-card"
                        :class="{ 'selected-border': isBackgroundSelected(item.hash) }"
                        @click="selectBackground(item.hash)"
                      >
                        <v-img
                          :src="`${assets}/Profile/${item.hash}?t=${userStore.cacheBuster}`"
                          alt="Background"
                          aspect-ratio="16/9"
                          cover
                          class="rounded-lg"
                        />
                      </v-card>
                    </v-hover>
                  </v-col>
                </v-row>

                <!-- Rewards Sub-section -->
                <div class="text-subtitle-2 font-weight-bold mb-4 text-grey-lighten-1 text-uppercase tracking-wider">Badge Rewards</div>
                <v-row>
                  <v-col
                    v-for="item in rewardBackgrounds"
                    :key="item.hash"
                    cols="12"
                    sm="6"
                    md="4"
                    class="d-flex flex-column pa-2 align-center"
                  >
                    <v-hover v-slot="{ isHovering, props }">
                      <v-card
                        v-bind="props"
                        :elevation="isHovering ? 12 : 2"
                        class="cursor-pointer bg-card w-100 relative"
                        :class="{
                          'selected-border': isBackgroundSelected(item.hash),
                          'locked-item': !isUnlocked(item)
                        }"
                        @click="isUnlocked(item) ? selectBackground(item.hash) : showLockAlert(item)"
                      >
                        <v-img
                          :src="`${assets}/Profile/${item.hash}?t=${userStore.cacheBuster}`"
                          alt="Background"
                          aspect-ratio="16/9"
                          cover
                          class="rounded-lg"
                        >
                          <!-- Lock Overlay -->
                          <div
                            v-if="!isUnlocked(item)"
                            class="lock-overlay d-flex align-center justify-center"
                          >
                            <v-icon size="32" color="rgba(255, 255, 255, 0.9)">mdi-lock</v-icon>
                          </div>
                        </v-img>
                      </v-card>
                    </v-hover>

                    <!-- Unlock Criteria Explanation -->
                    <div class="unlock-desc text-center mt-2 px-2 w-100">
                      <span class="badge-tag d-block text-uppercase font-weight-black text-caption">{{ item.badgeName }}</span>
                      <span 
                        class="desc-text text-grey mt-05"
                        :class="item.badgeId === 1 ? 'early-adopter-text' : 'text-caption'"
                      >
                        {{ getRewardDescription(item) }}
                      </span>
                    </div>
                  </v-col>
                </v-row>
              </v-card-text>
            </div>
          </v-expand-transition>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
import { ref, inject, onMounted, onUnmounted } from "vue";
import { useUserStore } from "@/store/UserStore";
import { getToken } from "@/service/AccessToken";
import BaseAlert from "@/components/Alerts/BaseAlert.vue";

const axios: any = inject("axios");
const assets = inject<string>("assets");
const userStore = useUserStore();

const avatarExpanded = ref(true);
const backgroundExpanded = ref(true);

const isSaving = ref(false);
const isLoadingBadges = ref(true);
const unlockedBadgeIds = ref<Set<number>>(new Set());
const rewardsList = ref<any[]>([]);
const allRewardsList = ref<any[]>([]);

// Alert States
const showAlert = ref(false);
const alertIcon = ref("");
const alertText = ref("");
const alertTitle = ref("");
const alertType = ref<"success" | "error" | "warning" | "info">("info");

interface CustomizeOption {
  hash: string;
  name: string;
  badgeId?: number;
  badgeName?: string;
  lockReason?: string;
}

// Avatars
const defaultAvatars: CustomizeOption[] = [
  { hash: "user.png", name: "Padrão" },
  { hash: "jaheen.png", name: "Jaheen" },
  { hash: "lich.png", name: "Lich" },
  { hash: "lorelai.png", name: "Lorelai" },
  { hash: "maya.png", name: "Maya" },
  { hash: "vorn.png", name: "Vorn" },
];

const rewardAvatars: CustomizeOption[] = [
  {
    hash: "Tharmagar.png",
    name: "Tharmagar",
    badgeId: 1,
    badgeName: "Early Adopter",
    lockReason: "Granted to the initial users who tested the application prior to the official launch.",
  },
  {
    hash: "Archer.png",
    name: "Archer",
    badgeId: 2,
    badgeName: "Tutorial Completed",
    lockReason: "Conquistado ao completar o tutorial de introdução.",
  },
  {
    hash: "Pietro.png",
    name: "Pietro",
    badgeId: 3,
    badgeName: "Season 1 Completed",
    lockReason: "Conquistado ao completar a Campanha da Season 1.",
  },
];

// Backgrounds (No Season 1 Completed extra background)
const defaultBackgrounds: CustomizeOption[] = [
  { hash: "profile-bg-corelich-transparent.png", name: "Core Lich" },
  { hash: "profile-bg-corewar-transparent.png", name: "Core War" },
  { hash: "profile-bg-warriors-transparent.png", name: "Warriors" },
];

const rewardBackgrounds: CustomizeOption[] = [
  {
    hash: "EarlyBackNew.png",
    name: "Early Adopter BG",
    badgeId: 1,
    badgeName: "Early Adopter",
    lockReason: "Your legend began before the first dawn.",
  },
];

const isUnlocked = (option: CustomizeOption) => {
  if (option.badgeId === undefined) return true;
  return unlockedBadgeIds.value.has(option.badgeId);
};

const selectAvatar = (hash: string) => {
  userStore.editingPictureHash = hash;
};

const selectBackground = (hash: string) => {
  userStore.editingBackgroundHash = hash;
};

const isAvatarSelected = (hash: string) => {
  return userStore.editingPictureHash === hash;
};

const isBackgroundSelected = (hash: string) => {
  return userStore.editingBackgroundHash === hash;
};

const setAlert = (
  icon: string,
  title: string,
  text: string,
  type: "success" | "error" | "warning" | "info",
) => {
  alertIcon.value = icon;
  alertTitle.value = title;
  alertText.value = text;
  alertType.value = type;
  showAlert.value = true;
};

const showLockAlert = (option: CustomizeOption) => {
  setAlert(
    "mdi-lock",
    `Badge Requerida: ${option.badgeName}`,
    getRewardDescription(option) || "Você precisa liberar esta Badge para obter este prêmio.",
    "warning"
  );
};

const getRewardDescription = (option: CustomizeOption) => {
  // Try to look up description from fetched API rewards first (for all reward items: Early Adopter, Tutorial, Season 1)
  const found = allRewardsList.value.find((r: any) => r.rewards_pk === option.badgeId);
  if (found && found.description) {
    return found.description;
  }

  // Fallback to unlocked rewards list
  const foundUnlocked = rewardsList.value.find((r: any) => r.rewards_pk === option.badgeId);
  if (foundUnlocked && foundUnlocked.description) {
    return foundUnlocked.description;
  }

  // Fallbacks if not found yet
  if (option.badgeId === 1) return "Your legend began before the first dawn.";
  if (option.badgeId === 2) return "Ready to face the darkness.";
  if (option.badgeId === 3) return "The first saga is written.";
  return option.lockReason || "";
};

const saveAllChanges = async () => {
  if (isSaving.value) return;

  isSaving.value = true;
  const user = userStore.user;

  const pictureHash = userStore.editingPictureHash || user.picture_hash;
  const backgroundHash = userStore.editingBackgroundHash || user.background_hash;

  try {
    const response = await axios.put(
      "users/alter",
      {
        users_pk: user.users_pk,
        picture_hash: pictureHash,
        background_hash: backgroundHash,
      },
      {
        headers: getToken(),
      },
    );

    // Save success update user info
    await userStore.setUser({
      ...user,
      picture_hash: pictureHash,
      background_hash: backgroundHash,
    });

    userStore.cacheBuster = Date.now();

    setAlert("mdi-check-circle", "Sucesso!", "Configurações de perfil salvas com sucesso!", "success");
  } catch (error: any) {
    console.error("Error saving customization changes:", error);
    setAlert(
      "mdi-alert-circle",
      `Erro ${error.response?.status || ""}`,
      error.response?.data?.message || "Ocorreu um erro ao salvar as alterações.",
      "error",
    );
  } finally {
    isSaving.value = false;
  }
};

const fetchUserRewards = async () => {
  try {
    const user = userStore.user;
    if (!user?.users_pk) return;

    const response = await axios.get("/rl_users_rewards/list_rewards", {
      params: { users_fk: user.users_pk },
      headers: getToken(),
    });

    const rewards = response.data.rewards || [];
    rewardsList.value = rewards;
    unlockedBadgeIds.value = new Set(rewards.map((r: any) => r.rewards_pk));
  } catch (err) {
    console.error("❌ Error fetching rewards for profile customizer:", err);
  } finally {
    isLoadingBadges.value = false;
  }
};

const fetchAllRewards = async () => {
  try {
    const response = await axios.get("/rewards/search", {
      headers: getToken(),
    });
    allRewardsList.value = response.data.rewards || [];
  } catch (err) {
    console.error("❌ Error fetching all rewards list:", err);
  }
};

onMounted(() => {
  // Initialize preview refs
  userStore.editingPictureHash = userStore.user.picture_hash;
  userStore.editingBackgroundHash = userStore.user.background_hash;
  fetchUserRewards();
  fetchAllRewards();
});

onUnmounted(() => {
  // Reset preview refs
  userStore.editingPictureHash = null;
  userStore.editingBackgroundHash = null;
});
</script>

<style scoped>
.cursor-pointer {
  cursor: pointer;
}

.avatar-card {
  width: 100%;
  max-width: 130px;
  border-radius: 8px;
  border: 3px solid transparent;
  transition: all 0.2s ease-in-out;
  position: relative;
  overflow: hidden;
}

.bg-card {
  border-radius: 8px;
  border: 3px solid transparent;
  transition: all 0.2s ease-in-out;
  position: relative;
  overflow: hidden;
}

.selected-border {
  border: 3px solid #599b4d !important;
  box-shadow: 0 0 12px rgba(89, 155, 77, 0.8);
}

.locked-item {
  filter: grayscale(1) contrast(0.85);
  opacity: 0.55;
}

.lock-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.4);
  z-index: 2;
}

.unlock-desc {
  line-height: 1.3;
}

.badge-tag {
  color: #c4963e;
  font-weight: bold;
  letter-spacing: 0.5px;
}

.early-adopter-text {
  font-size: 0.65rem !important;
  display: block;
}

.desc-text {
  font-size: 0.75rem !important;
  display: block;
}

.mt-05 {
  margin-top: 2px;
}

.save-all-btn {
  transition: all 0.2s ease;
}

.save-all-btn:hover {
  filter: brightness(1.1);
  transform: translateY(-1px);
}
</style>
