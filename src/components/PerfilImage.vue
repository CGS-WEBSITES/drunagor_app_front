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

    <!-- Custom Badge Alert Dialog Overlay -->
    <v-dialog
      v-if="selectedBadgeAlert"
      v-model="selectedBadgeAlert.show"
      max-width="450px"
      transition="dialog-bottom-transition"
    >
      <v-card
        color="#151515"
        class="pa-4 rounded-lg overflow-hidden"
        style="border: 1px solid rgba(255, 255, 255, 0.1);"
      >
        <!-- Top alert status strip with color matching success/warning -->
        <div
          class="pl-3 py-1 mb-3"
          :style="{ borderLeft: selectedBadgeAlert.owned ? '4px solid #4caf50' : '4px solid #ff9800' }"
        >
          <div class="font-weight-bold text-subtitle-1 text-white">
            {{ selectedBadgeAlert.owned ? 'You have the badge' : 'You do not have the badge' }}
          </div>
        </div>

        <!-- Styled Badge Card (Exactly like outer profile widget) -->
        <v-card
          rounded="lg"
          elevation="3"
          class="py-2 px-0 d-flex align-center position-relative mt-2"
          color="secundary"
          style="border: 1px solid rgba(255, 255, 255, 0.05);"
          :style="{ opacity: selectedBadgeAlert.owned ? 1 : 0.4, filter: selectedBadgeAlert.owned ? 'none' : 'grayscale(100%)' }"
        >
          <v-row class="align-center no-gutters w-100">
            <v-col
              cols="3"
              class="d-flex align-center justify-center pl-3"
            >
              <v-img
                :src="getBadgeImageUrl(selectedBadgeAlert.badge.picture_hash)"
                alt="Reward Icon"
                max-height="70"
                class="rounded-lg"
                contain
              ></v-img>
            </v-col>

            <v-col cols="8" class="pl-2 d-flex flex-column justify-center">
              <p class="font-weight-bold white--text ma-0">
                {{ selectedBadgeAlert.badge.name }}
              </p>
              <p class="text-body-2 grey--text ma-0">
                {{ selectedBadgeAlert.badge.description }}
              </p>
            </v-col>
          </v-row>

          <!-- Absolute Date Position on bottom-right -->
          <div v-if="selectedBadgeAlert.owned && selectedBadgeAlert.earnedDate" class="date-position text-caption grey--text">
            {{ selectedBadgeAlert.earnedDate }}
          </div>
        </v-card>

        <v-card-actions class="justify-end pt-4 pb-0 px-0">
          <v-btn
            color="grey-lighten-1"
            variant="text"
            @click="selectedBadgeAlert.show = false"
            class="font-weight-bold"
          >
            Close
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

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
                <div class="text-subtitle-2 font-weight-bold mb-4 text-grey-lighten-1 text-uppercase tracking-wider">Default</div>
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
                        class="cursor-pointer avatar-card position-relative"
                        :class="{
                          'selected-border': isAvatarSelected(item.hash),
                          'locked-item': !isUnlocked(item)
                        }"
                        @click="handleItemClick(item, true)"
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

                        <!-- Badge Indicator Overlay Icon -->
                        <div
                          v-if="item.badgeId !== undefined"
                          style="position: absolute; top: 4px; right: 4px; z-index: 2; background: rgba(0, 0, 0, 0.75); border-radius: 50%; width: 26px; height: 26px; display: flex; align-items: center; justify-content: center; padding: 2px; border: 1px solid rgba(255, 255, 255, 0.15);"
                        >
                          <v-img
                            :src="getBadgeIconUrl(item.badgeId)"
                            alt="Badge Icon"
                            class="rounded-circle"
                            cover
                            max-width="22"
                            max-height="22"
                          />
                        </div>
                      </v-card>
                    </v-hover>
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
                <div class="text-subtitle-2 font-weight-bold mb-4 text-grey-lighten-1 text-uppercase tracking-wider">Default</div>
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
                        class="cursor-pointer bg-card w-100 position-relative"
                        :class="{
                          'selected-border': isBackgroundSelected(item.hash),
                          'locked-item': !isUnlocked(item)
                        }"
                        @click="handleItemClick(item, false)"
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

                        <!-- Badge Indicator Overlay Icon -->
                        <div
                          v-if="item.badgeId !== undefined"
                          style="position: absolute; top: 4px; right: 4px; z-index: 2; background: rgba(0, 0, 0, 0.75); border-radius: 50%; width: 26px; height: 26px; display: flex; align-items: center; justify-content: center; padding: 2px; border: 1px solid rgba(255, 255, 255, 0.15);"
                        >
                          <v-img
                            :src="getBadgeIconUrl(item.badgeId)"
                            alt="Badge Icon"
                            class="rounded-circle"
                            cover
                            max-width="22"
                            max-height="22"
                          />
                        </div>
                      </v-card>
                    </v-hover>
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

const selectedBadgeAlert = ref<{
  show: boolean;
  owned: boolean;
  badge: any;
  earnedDate?: string;
} | null>(null);

const getBadgeImageUrl = (pictureHash: string | undefined) => {
  if (!pictureHash) return "https://s3.us-east-2.amazonaws.com/assets.drunagor.app/Profile/store.png";
  if (pictureHash.startsWith("http")) return pictureHash;
  
  let cleanHash = pictureHash;
  if (cleanHash.includes("%26")) {
    cleanHash = cleanHash.replace(/%26/g, "&");
  }
  if (cleanHash.includes("%20")) {
    cleanHash = cleanHash.replace(/%20/g, " ");
  }
  
  if (cleanHash.startsWith("/")) return `https://assets.drunagor.app${cleanHash}`;
  return `https://assets.drunagor.app/${cleanHash}`;
};

const getBadgeIconUrl = (badgeId: number) => {
  const found = allRewardsList.value.find((r: any) => r.rewards_pk === badgeId);
  if (found && found.picture_hash) {
    return getBadgeImageUrl(found.picture_hash);
  }
  // Fallbacks
  if (badgeId === 1) return getBadgeImageUrl("badges&achievements/Season 1 Complete (4)-min.png");
  if (badgeId === 2) return getBadgeImageUrl("badges&achievements/Tutorial Complete.png");
  if (badgeId === 3) return getBadgeImageUrl("badges&achievements/Season 1 Complete (4)-min.png");
  if (badgeId === 5) return getBadgeImageUrl("badges&achievements/Tutorial Complete.png");
  if (badgeId === 6) return getBadgeImageUrl("badges&achievements/Season 1 Complete (4)-min.png");
  return getBadgeImageUrl("badges&achievements/Season 1 Complete (4)-min.png");
};

const handleItemClick = (item: CustomizeOption, isAvatar: boolean) => {
  if (item.badgeId === undefined) {
    if (isAvatar) {
      selectAvatar(item.hash);
    } else {
      selectBackground(item.hash);
    }
    selectedBadgeAlert.value = null;
    return;
  }

  const badgeId = item.badgeId;
  const owned = unlockedBadgeIds.value.has(badgeId);

  // Find badge details
  const badgeObjFromApi = allRewardsList.value.find((r: any) => r.rewards_pk === badgeId);
  const badgeObj = {
    rewards_pk: badgeId,
    name: badgeObjFromApi?.name || item.badgeName || "Badge",
    description: badgeObjFromApi?.description || getRewardDescription(item),
    picture_hash: badgeObjFromApi?.picture_hash || (badgeId === 2 ? "badges&achievements/Tutorial Complete.png" : "badges&achievements/Season 1 Complete (4)-min.png")
  };

  if (owned) {
    if (isAvatar) {
      selectAvatar(item.hash);
    } else {
      selectBackground(item.hash);
    }

    // Find earned date
    const userRewards = rewardsList.value.filter((r: any) => r.rewards_pk === badgeId);
    let earnedDate = "";
    if (userRewards.length > 0) {
      const oldest = userRewards.reduce((prev: any, curr: any) => {
        const prevDate = prev.date || prev.created_at || prev.date_conquest || new Date().toISOString();
        const currDate = curr.date || curr.created_at || curr.date_conquest || new Date().toISOString();
        return new Date(prevDate) < new Date(currDate) ? prev : curr;
      });
      const d = oldest.date || oldest.created_at || oldest.date_conquest;
      earnedDate = new Date(d).toLocaleDateString("en-US");
    } else {
      earnedDate = new Date().toLocaleDateString("en-US");
    }

    selectedBadgeAlert.value = {
      show: true,
      owned: true,
      badge: badgeObj,
      earnedDate
    };
  } else {
    selectedBadgeAlert.value = {
      show: true,
      owned: false,
      badge: badgeObj
    };
  }
  showAlert.value = false;
};

interface CustomizeOption {
  hash: string;
  name: string;
  badgeId?: number;
  badgeName?: string;
  lockReason?: string;
}

// Avatars
const defaultAvatars: CustomizeOption[] = [
  { hash: "user.png", name: "Default" },
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
    lockReason: "Your legend began before the first dawn.",
  },
  {
    hash: "Archer.png",
    name: "Archer",
    badgeId: 2,
    badgeName: "Tutorial Completed",
    lockReason: "Ready to face the darkness.",
  },
  {
    hash: "Pietro.png",
    name: "Pietro",
    badgeId: 3,
    badgeName: "Season 1 Completed",
    lockReason: "The first saga is written.",
  },
  {
    hash: "Mathias.png",
    name: "Mathias",
    badgeId: 5,
    badgeName: "Wing 3 Completed",
    lockReason: "Faced the growing shadows and descended deeper into the Underkeep.",
  },
  {
    hash: "DragonS2.png",
    name: "Dragon S2",
    badgeId: 6,
    badgeName: "Season 2 Completed",
    lockReason: "Secured the void portal, vanquished the dragon, and completed the second saga.",
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
  {
    hash: "Season2Background.png",
    name: "Season 2 BG",
    badgeId: 6,
    badgeName: "Season 2 Completed",
    lockReason: "Secured the void portal, vanquished the dragon, and completed the second saga.",
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
    `Required Badge: ${option.badgeName}`,
    getRewardDescription(option) || "You need to unlock this Badge to obtain this reward.",
    "warning"
  );
};

const getRewardDescription = (option: CustomizeOption) => {
  // Try to look up description from fetched API rewards first (for all reward items: Early Adopter, Tutorial, Season 1, etc.)
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
  if (option.badgeId === 5) return "Faced the growing shadows and descended deeper into the Underkeep.";
  if (option.badgeId === 6) return "Secured the void portal, vanquished the dragon, and completed the second saga.";
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

    setAlert("mdi-check-circle", "Success!", "Profile customization saved successfully!", "success");
  } catch (error: any) {
    console.error("Error saving customization changes:", error);
    setAlert(
      "mdi-alert-circle",
      `Error ${error.response?.status || ""}`,
      error.response?.data?.message || "An error occurred while saving the changes.",
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

.date-position {
  position: absolute;
  bottom: 8px;
  right: 12px;
}
</style>
