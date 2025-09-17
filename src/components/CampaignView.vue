<template>
  <v-speed-dial
    v-if="currentTab !== 'book'"
    v-model="speedDialOpen"
    transition="fade-transition"
  >
    <template v-slot:activator="{ props: activatorProps }">
      <v-btn
        v-bind="activatorProps"
        :color="speedDialOpen ? 'red' : 'green'"
        size="large"
        icon
        class="speed-dial-activator"
        elevation="14"
      >
        <v-icon>{{
          speedDialOpen ? "mdi-close" : "mdi-script-text-outline"
        }}</v-icon>
      </v-btn>
    </template>

    <v-btn
      v-if="showSaveCampaignButton"
      key="save"
      size="small"
      color="success"
      icon
      class="speed-dial-item"
      @click="handleSpeedDialAction('save')"
    >
      <v-icon>mdi-content-save-outline</v-icon>
      <v-tooltip activator="parent" location="start">
        {{ t("label.save-campaign-put") || "Save Campaign" }}
      </v-tooltip>
    </v-btn>

    <v-btn
      v-if="campaign?.campaign === 'underkeep'"
      key="instructions"
      size="small"
      color="info"
      icon
      class="speed-dial-item"
      @click="handleSpeedDialAction('instructions')"
    >
      <v-icon>mdi-lightbulb-on-outline</v-icon>
      <v-tooltip activator="parent" location="start">
        Load Instructions
      </v-tooltip>
    </v-btn>

    <v-btn
      key="export"
      size="small"
      color="orange"
      icon
      class="speed-dial-item"
      :disabled="!showSaveCampaignButton"
      @click="handleSpeedDialAction('export')"
    >
      <v-icon>mdi-export</v-icon>
      <v-tooltip activator="parent" location="start">
        Export Campaign
      </v-tooltip>
    </v-btn>

    <v-btn
      key="share"
      size="small"
      color="secondary"
      icon
      class="speed-dial-item"
      @click="handleSpeedDialAction('share')"
    >
      <v-icon>mdi-account-group</v-icon>
      <v-tooltip activator="parent" location="start"> Invite Player </v-tooltip>
    </v-btn>

    <v-btn
      v-if="showSaveCampaignButton"
      key="remove"
      size="small"
      color="error"
      icon
      class="speed-dial-item"
      @click="handleSpeedDialAction('remove')"
    >
      <v-icon>mdi-delete-outline</v-icon>
      <v-tooltip activator="parent" location="start">
        Remove Campaign
      </v-tooltip>
    </v-btn>
  </v-speed-dial>

  <v-card
    class="campaign-menu pa-0 mx-2"
    color="transparent"
    elevation="0"
    v-if="expandedPanel.length && campaign?.campaign === 'underkeep'"
  >
    <v-container fluid class="pa-2">
      <v-row justify="center" no-gutters>
        <v-col cols="12" lg="9" xl="8">
          <v-card-text v-if="!showSaveCampaignButton" class="pa-2">
            <BaseAlert
              :modelValue="true"
              type="warning"
              text
              border="start"
              variant="tonal"
              :closable="true"
            >
              Players can only view information for this campaign. Only a
              Drunagor Master can save, edit, or delete a campaign.
            </BaseAlert>
          </v-card-text>

          <v-card class="mb-2" color="primary">
            <v-card-text v-if="showAlert" class="pa-2">
              <BaseAlert
                v-model="showAlert"
                :icon="alertIcon"
                :title="alertTitle"
                :type="alertType"
                text
                density="compact"
              >
                {{ alertText }}
              </BaseAlert>
            </v-card-text>

            <v-card-text class="pa-0">
              <div class="position-relative instructions-wrapper">
                <v-btn
                  @click="closeInstructions"
                  icon
                  size="small"
                  variant="text"
                  aria-label="Close instructions"
                >
                  <v-icon size="20">mdi-close</v-icon>
                </v-btn>

                <v-expansion-panels
                  v-model="expandedPanel"
                  accordion
                  variant="accordion"
                  class="instructions-panel"
                >
                  <v-expansion-panel>
                    <v-expansion-panel-text
                      class="pa-0"
                      style="padding: 0 !important"
                    >
                      <LoadInstructions
                        ref="loadInstructionsRef"
                        @instruction-changed="onInstructionChanged"
                        @action-click="handleInstructionAction"
                        @close="closeInstructions"
                        style="max-height: 25vh !important"
                      />
                    </v-expansion-panel-text>
                  </v-expansion-panel>
                </v-expansion-panels>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-card>

  <div class="campaign-content">
    <v-container fluid>
      <template v-if="campaign">
        <template v-if="campaign.campaign === 'underkeep'">
          <v-row justify="center" no-gutters>
            <v-col cols="12" lg="9" xl="8">
              <v-tabs
                v-model="currentTab"
                density="compact"
                grow
                bg-color="surface"
                class="mb-3 rounded"
                slider-color="white"
                @update:model-value="onTabChange"
              >
                <v-tab value="normal" class="text-caption">
                  <v-icon size="small" class="mr-1"
                    >mdi-clipboard-text-outline</v-icon
                  >
                  <span class="d-none d-sm-inline">Campaign Log</span>
                  <span class="d-sm-none">Log</span>
                </v-tab>
                <v-tab value="book" class="text-caption">
                  <v-icon size="small" class="mr-1"
                    >mdi-book-open-variant</v-icon
                  >
                  <span class="d-none d-sm-inline">Campaign Book</span>
                  <span class="d-sm-none">Book</span>
                </v-tab>
              </v-tabs>

              <v-window v-model="currentTab">
                <v-window-item value="normal">
                  <v-card class="mb-3" color="primary">
                    <v-card-text class="pa-3">
                      <CampaignPlayerList
                        ref="campaignPlayerListRef"
                        :campaign-id="campaignId"
                        :show-remove-button="showSaveCampaignButton"
                        @player-removed="onPlayerRemoved"
                        density="compact"
                      />

                      <div
                        class="d-flex justify-space-between align-center mt-2 flex-wrap"
                      >
                        <v-btn
                          v-if="showSaveCampaignButton"
                          class="mx-1 my-1"
                          @click="openTransferDialog"
                          variant="elevated"
                          rounded
                          prepend-icon="mdi-account-switch-outline"
                          >Transfer Drunagor Master</v-btn
                        >

                        <div
                          v-if="showSaveCampaignButton"
                          class="mx-1 my-1 d-flex align-center"
                        >
                          <div class="mr-3">
                            <div class="d-flex align-center">
                              <span class="text-caption font-weight-bold mr-1"
                                >CAMPAIGN ID:</span
                              >
                              <v-tooltip location="top">
                                <template #activator="{ props }">
                                  <v-icon
                                    v-bind="props"
                                    size="small"
                                    color="info"
                                    class="cursor-pointer"
                                  >
                                    mdi-information-outline
                                  </v-icon>
                                </template>
                                <span
                                  >Use this code to invite your friends</span
                                >
                              </v-tooltip>
                            </div>
                          </div>

                          <v-chip v-if="partyCode" label size="large">{{
                            partyCode
                          }}</v-chip>
                          <v-chip v-else label size="large"
                            >Generating...</v-chip
                          >
                        </div>
                      </div>
                    </v-card-text>
                  </v-card>

                  <div>
                    <v-row no-gutters>
                      <v-col cols="12" md="6" class="pr-md-2">
                        <CampaignName
                          :campaign-id="campaignId"
                          class="mb-3 shepherd-campaign-name"
                        />
                        <SelectDoor
                          :campaign-id="campaignId"
                          class="mb-3 shepherd-select-door"
                        />
                        <CampaignRunes
                          v-if="isSequentialAdventure"
                          :campaign-id="campaignId"
                          class="mb-3 shepherd-runes"
                        />
                      </v-col>

                      <v-col cols="12" md="6" class="pl-md-2">
                        <CampaignRuneCards
                          v-if="isSequentialAdventure"
                          :campaign-id="campaignId"
                          class="mb-3 shepherd-rune-cards"
                        />
                      </v-col>
                    </v-row>

                    <v-row
                      class="my-3"
                      no-gutters
                      v-if="showSaveCampaignButton"
                    >
                      <v-col cols="12">
                        <v-card
                          class="pa-2 shepherd-hero-actions"
                          color="primary"
                        >
                          <div class="d-flex justify-center flex-wrap gap-2">
                            <CampaignLogAddHero
                              :campaign-id="campaignId"
                              class="mx-1 my-1"
                            />
                            <CampaignLogImportHero
                              :campaign-id="campaignId"
                              class="mx-1 my-1"
                            />
                            <CampaignLogRemoveHero
                              :campaign-id="campaignId"
                              class="mx-1 my-1"
                            />
                          </div>
                        </v-card>
                      </v-col>
                    </v-row>

                    <v-row no-gutters>
                      <v-col cols="12">
                        <v-sheet
                          rounded
                          border="md"
                          class="text-white pa-2 shepherd-heroes-list"
                        >
                          <div
                            v-if="
                              heroStore.findAllInCampaign(campaignId).length ===
                              0
                            "
                            class="text-center pa-4"
                          >
                            No heroes added to this campaign yet.
                          </div>

                          <div
                            v-for="hero in heroStore.findAllInCampaign(
                              campaignId,
                            )"
                            :key="hero.heroId"
                            class="mb-2"
                          >
                            <CampaignLog
                              :campaign-id="campaignId"
                              :hero-id="hero.heroId"
                              :is-sequential-adventure="isSequentialAdventure"
                              :class="`shepherd-hero-${hero.heroId}`"
                            />
                          </div>
                        </v-sheet>
                      </v-col>
                    </v-row>
                  </div>
                </v-window-item>

                <v-window-item value="book">
                  <CampaignBook :campaign-id="campaignId" />
                </v-window-item>
              </v-window>
            </v-col>
          </v-row>
        </template>
      </template>
    </v-container>
  </div>

  <!-- refs ocultos -->
  <div style="display: none">
    <CampaignSavePut
      ref="savePutRef"
      :campaign-id="campaignId"
      @success="onSaveSuccess"
      @fail="onSaveFail"
    />
    <CampaignRemove
      ref="campaignRemoveRef"
      :campaign-id="campaignId"
      @removed="onCampaignRemoved"
    />
    <CampaignExport ref="campaignExportRef" :campaign-id="campaignId" />
    <ShareCampaignButton
      ref="shareCampaignRef"
      :campaignId="campaignId"
      :inviteCode="partyCode"
    />
  </div>
</template>

<script setup lang="ts">
import { useI18n } from "vue-i18n";
import { useRoute, useRouter } from "vue-router";
import { ref, onMounted, watch, nextTick, onBeforeUnmount } from "vue";
import { ref as vueRef } from "vue";
import axios from "axios";

import CampaignLogAddHero from "@/components/CampaignLogAddHero.vue";
import CampaignLogRemoveHero from "@/components/CampaignLogRemoveHero.vue";
import CampaignLog from "@/components/CampaignLog.vue";
import CampaignRemove from "@/components/CampaignRemove.vue";
import CampaignExport from "@/components/CampaignExport.vue";
import CampaignSavePut from "@/components/CampaignSavePut.vue";
import CampaignName from "@/components/CampaignName.vue";
import CampaignRunes from "@/components/CampaignRunes.vue";
import CampaignBook from "@/components/CampaignBook.vue";
import SelectDoor from "@/components/SelectDoor.vue";
import BaseAlert from "@/components/Alerts/BaseAlert.vue";
import CampaignPlayerList from "@/components/CampaignPlayerList.vue";
import LoadInstructions from "./LoadInstructions.vue";
import ShareCampaignButton from "./ShareCampaignButton.vue";
import CampaignLogImportHero from "@/components/CampaignLogImportHero.vue";
import CampaignRuneCards from "@/components/CampaignRuneCards.vue";

import { CampaignStore } from "@/store/CampaignStore";
import { HeroStore } from "@/store/HeroStore";
import { useUserStore } from "@/store/UserStore";
import { type Campaign } from "@/store/Campaign";
import { useSaveCampaignTour } from "@/components/Composable/useSaveCampaignTour";

// const import opcional se precisar; mantive como no seu projeto original
// import { SequentialAdventureState } from "@/store/SequentialAdventureState";

const campaignStore = CampaignStore();
const heroStore = HeroStore();
const userStore = useUserStore();
const router = useRouter();
const route = useRoute();
const { t } = useI18n();

const campaignId = (route.params as { id: string }).id.toString();

const partyCode = ref<string | null>(null);
const isSequentialAdventure = ref(true);
const campaign = ref<Campaign | null>(null);

const alertIcon = ref("");
const alertText = ref("");
const alertTitle = ref("");
const alertType = ref<"success" | "info" | "warning" | "error" | undefined>(
  undefined,
);
const showAlert = ref(false);

const currentTab = ref("normal");
const savePutRef = vueRef<InstanceType<typeof CampaignSavePut>>();
const showSaveCampaignButton = ref(false);
const campaignPlayerListRef = vueRef<InstanceType<
  typeof CampaignPlayerList
> | null>(null);
const expandedPanel = ref<number[]>([]);
const loadInstructionsRef = vueRef<InstanceType<
  typeof LoadInstructions
> | null>(null);

const speedDialOpen = ref(true);
const campaignRemoveRef = vueRef<InstanceType<typeof CampaignRemove> | null>(
  null,
);
const campaignExportRef = vueRef<InstanceType<typeof CampaignExport> | null>(
  null,
);
const shareCampaignRef = vueRef<InstanceType<
  typeof ShareCampaignButton
> | null>(null);

const transferLoading = ref(false);
const transferDialogVisible = ref(false);
const players = ref<
  Array<{
    rl_campaigns_users_pk: number;
    user_name: string;
    role_name: string;
    party_roles_fk: number;
    users_fk: number;
  }>
>([]);
const selectedUser = ref<(typeof players.value)[0] | null>(null);
const confirmingTransfer = ref(false);
const originalMaster = ref<(typeof players.value)[0] | null>(null);
const transferAlertVisible = ref(false);
const transferAlertText = ref("");
const transferAlertType = ref<"success" | "error">("success");

/** ========= helpers ========= **/
function setAlert(
  icon: string,
  title: string,
  text: string,
  type: "success" | "info" | "warning" | "error" | undefined,
  duration: number = 1500,
) {
  alertIcon.value = icon;
  alertTitle.value = title;
  alertText.value = text;
  showAlert.value = true;
  alertType.value = type;
  setTimeout(() => {
    showAlert.value = false;
  }, duration);
}

function scrollToHeroSection() {
  const heroSection = document.querySelector(
    ".v-sheet.rounded.border-md",
  ) as HTMLElement | null;
  if (!heroSection) return;
  heroSection.scrollIntoView({ behavior: "smooth", block: "start" });
  heroSection.style.transition = "box-shadow 0.3s ease";
  heroSection.style.boxShadow = "0 0 20px rgba(var(--v-theme-primary), 0.5)";
  setTimeout(() => (heroSection.style.boxShadow = ""), 2000);
}

function showHeroSelectionAlert(action: string, heroes: any[]) {
  const heroList = heroes.map((h) => h.name || `Hero ${h.heroId}`).join(", ");
  const actionText =
    action === "manage-resources" ? "Manage Resources" : "Equipment & Skills";
  setAlert(
    "mdi-account-multiple-outline",
    "Multiple Heroes Found",
    `Multiple heroes found in this campaign: ${heroList}. Please scroll down to select the "${actionText}" button for the specific hero you want to manage.`,
    "info",
    5000,
  );
  setTimeout(() => scrollToHeroSection(), 500);
}

function navigateToHeroSequentialState(heroId: string) {
  if (!showSaveCampaignButton.value) {
    setAlert(
      "mdi-alert-circle",
      "Access Denied",
      "Only the Drunagor Master can access this feature.",
      "error",
    );
    return;
  }
  router.push({
    name: "HeroSequentialState",
    params: { campaignId: campaignId, heroId },
  });
}

function navigateToHeroEquipmentSkills(heroId: string) {
  if (!showSaveCampaignButton.value) {
    setAlert(
      "mdi-alert-circle",
      "Access Denied",
      "Only the Drunagor Master can access this feature.",
      "error",
    );
    return;
  }
  router.push({ name: "Hero", params: { campaignId: campaignId, heroId } });
}

function handleManageResourcesAction() {
  const heroes = heroStore.findAllInCampaign(campaignId);
  if (heroes.length === 0) {
    setAlert(
      "mdi-information-outline",
      "Info",
      "No heroes found in this campaign. Please add heroes first.",
      "info",
    );
    return;
  }
  if (heroes.length === 1) {
    navigateToHeroSequentialState(heroes[0].heroId);
    return;
  }
  showHeroSelectionAlert("manage-resources", heroes);
}

function handleEquipmentSkillsAction() {
  const heroes = heroStore.findAllInCampaign(campaignId);
  if (heroes.length === 0) {
    setAlert(
      "mdi-information-outline",
      "Info",
      "No heroes found in this campaign. Please add heroes first.",
      "info",
    );
    return;
  }
  if (heroes.length === 1) {
    navigateToHeroEquipmentSkills(heroes[0].heroId);
    return;
  }
  showHeroSelectionAlert("equipment-skills", heroes);
}

/** ========= Shepherd tour ========= **/
const {
  startSaveTour,
  destroyTour,
  isActive: tourActive,
} = useSaveCampaignTour({
  onSaveClick: handleSave,
  onManageResourcesClick: handleManageResourcesAction,
  onEquipmentSkillsClick: handleEquipmentSkillsAction,
  campaignId,
});

/** ========= resto ========= **/
const generatePartyCode = () => {
  const prefix = Math.floor(1000 + Math.random() * 9000).toString();
  partyCode.value = `${prefix}${campaignId}`;
};

const saveNavigationState = () => {
  if (typeof window === "undefined") return;
  const navigationState = {
    currentTab: currentTab.value,
    timestamp: Date.now(),
    returnFromNavigation: true,
  };
  localStorage.setItem(
    `campaign_${campaignId}_navigation_state`,
    JSON.stringify(navigationState),
  );
};

const handleInstructionAction = (action: string) => {
  saveNavigationState();
  setTimeout(() => {
    if (action === "manage-resources") handleManageResourcesAction();
    else if (action === "equipment-skills") handleEquipmentSkillsAction();
  }, 100);
};

function handleSpeedDialAction(action: string) {
  switch (action) {
    case "save":
      if (campaign.value?.campaign === "underkeep") startSaveTour();
      else handleSave();
      break;
    case "instructions":
      toggleInstructions();
      break;
    case "export":
      campaignExportRef.value?.export?.();
      break;
    case "share":
      shareCampaignRef.value?.openDialog?.();
      break;
    case "remove":
      campaignRemoveRef.value?.openDialog?.();
      break;
  }
  speedDialOpen.value = false;
}

const onCampaignRemoved = () => {
  setAlert("mdi-check", "Success", "Campaign removed successfully", "success");
  router.push({ name: "Campaigns" });
};

const initTransfer = (user: (typeof players.value)[0]) => {
  selectedUser.value = user;
  confirmingTransfer.value = true;
};

const openTransferDialog = () => {
  transferDialogVisible.value = true;
  transferLoading.value = true;
  axios
    .get("/rl_campaigns_users/list_players", {
      params: { campaigns_fk: campaignId },
    })
    .then(({ data }) => {
      players.value = data.Users;
      originalMaster.value =
        players.value.find((u) => u.party_roles_fk === 1) || null;
    })
    .catch((err) => console.error("Error fetching players:", err))
    .finally(() => (transferLoading.value = false));
};

const confirmTransfer = () => {
  if (!selectedUser.value || !originalMaster.value) return;
  transferLoading.value = true;

  const promote = axios.put("/rl_campaigns_users/alter", {
    rl_campaigns_users_pk: selectedUser.value.rl_campaigns_users_pk,
    party_roles_fk: 1,
  });
  const demote = axios.put("/rl_campaigns_users/alter", {
    rl_campaigns_users_pk: originalMaster.value.rl_campaigns_users_pk,
    party_roles_fk: 2,
  });

  Promise.all([promote, demote])
    .then(() => {
      transferAlertText.value = "Transfer successful!";
      transferAlertType.value = "success";
      transferAlertVisible.value = true;
      setTimeout(() => {
        transferAlertVisible.value = false;
        closeTransferDialog();
        router.push({ name: "Campaigns" });
      }, 1500);
    })
    .catch((err) => {
      const payload = err.response?.data;
      transferAlertText.value =
        payload?.message || JSON.stringify(payload?.errors || {});
      transferAlertType.value = "error";
      transferAlertVisible.value = true;
      setTimeout(() => (transferAlertVisible.value = false), 1500);
    })
    .finally(() => {
      transferLoading.value = false;
      confirmingTransfer.value = false;
      selectedUser.value = null;
    });
};

const cancelTransfer = () => {
  confirmingTransfer.value = false;
  selectedUser.value = null;
};

const closeTransferDialog = () => {
  transferDialogVisible.value = false;
  confirmingTransfer.value = false;
  selectedUser.value = null;
};

watch(transferAlertVisible, (v) => {
  if (!v && transferAlertType.value === "success") closeTransferDialog();
});

const onInstructionChanged = (_step: number) => {
  /* no-op: apenas LoadInstructions */
};

const closeInstructions = () => {
  expandedPanel.value = [];
  router.replace({ query: { ...route.query, instructions: undefined } });
};

const restoreInstructionState = () => {
  if (typeof window === "undefined") return;
  if (route.query.instructions === "open") expandedPanel.value = [0];
};

const onTabChange = (newTab: string) => {
  if (newTab === "book" && expandedPanel.value.length > 0) closeInstructions();
};

const toggleInstructions = () => {
  if (expandedPanel.value.length) closeInstructions();
  else {
    expandedPanel.value = [0];
    router.replace({ query: { ...route.query, instructions: "open" } });
  }
};

async function handleSave() {
  if (!savePutRef.value) {
    console.error("savePutRef não está disponível");
    setAlert(
      "mdi-alert-circle",
      "Error",
      "Save component not initialized. Please try again.",
      "error",
    );
    return;
  }
  try {
    await savePutRef.value.save();
  } catch (error) {
    console.error("Erro ao salvar:", error);
  }
}

const onSaveSuccess = () => {
  setAlert(
    "mdi-check",
    "Success",
    "The campaign was saved successfully!",
    "success",
  );
  if (tourActive.value) destroyTour();
};

const onSaveFail = () => {
  setAlert(
    "mdi-alert-circle",
    "Error",
    "The campaign could not be saved.",
    "error",
  );
};

const fetchRole = async () => {
  try {
    const { data } = await axios.get("rl_campaigns_users/search", {
      params: { users_fk: userStore.user.users_pk, campaigns_fk: campaignId },
    });
    showSaveCampaignButton.value = data.campaigns[0]?.party_role === "Admin";
  } catch {
    showSaveCampaignButton.value = false;
  }
};

const onPlayerRemoved = async () => {
  setAlert("mdi-check", "Success", "Player successfully removed", "success");
  await campaignPlayerListRef.value?.fetchPlayers();
};

onBeforeUnmount(() => destroyTour());

onMounted(async () => {
  if (!campaignId) {
    setAlert("mdi-alert-circle", "Error", "Campaign ID is missing.", "error");
    return;
  }
  const found = campaignStore.find(campaignId);
  if (found) {
    campaign.value = found;
    if (!campaign.value.isSequentialAdventure) {
      campaign.value.isSequentialAdventure = true;
      campaign.value.sequentialAdventureRunes = 0;
      // heroStore.findAllInCampaign(campaignId).forEach(h => {
      //   h.sequentialAdventureState = new SequentialAdventureState();
      // });
    }
  } else {
    setAlert(
      "mdi-alert-circle",
      "Error",
      `Campaign with ID ${campaignId} not found.`,
      "error",
    );
  }

  await fetchRole();
  generatePartyCode();
  if (campaign.value?.campaign === "underkeep") restoreInstructionState();
});

watch(
  () => route.query,
  (q) => {
    expandedPanel.value = q.instructions === "open" ? [0] : [];
  },
);

watch(
  campaign,
  (c) => {
    if (c) {
      isSequentialAdventure.value = c.isSequentialAdventure ?? false;
      if (c.campaign !== "underkeep") currentTab.value = "normal";
    }
  },
  { deep: true },
);
</script>

<style scoped>
.info-text {
  font-size: 0.6rem !important;
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.2;
}
.v-btn--slim {
  padding: 0 15px !important;
}
.text-caption {
  font-size: 0.85rem !important;
  font-weight: 400;
  line-height: 1.667;
  letter-spacing: 0.0333333333em !important;
  font-family: "Roboto", sans-serif;
  text-transform: none !important;
}
.campaign-menu {
  position: sticky;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
.campaign-content {
  position: relative;
  overflow-x: hidden;
}
.action-group {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  align-items: center;
}
.action-btn {
  margin: 2px;
}
.mx-1 {
  margin-left: 4px !important;
  margin-right: 4px !important;
}
.my-1 {
  margin-top: 4px !important;
  margin-bottom: 4px !important;
}
.instructions-panel :deep(.v-expansion-panel-text__wrapper) {
  max-height: 32vh;
  overflow-y: auto;
}
.instructions-wrapper {
  position: relative;
}
.position-relative {
  position: relative;
}
.speed-dial-activator {
  position: fixed;
  right: 10px;
  bottom: 80px;
  z-index: 2000;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
  width: 56px !important;
  height: 56px !important;
}
.speed-dial-activator:hover {
  transform: scale(1.1) !important;
  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.4) !important;
}
.speed-dial-item {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2) !important;
  margin-bottom: 12px !important;
  transition: all 0.2s ease !important;
  width: 48px !important;
  height: 48px !important;
}
.speed-dial-item:hover {
  transform: scale(1.15) !important;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.3) !important;
}
.speed-dial-item:disabled {
  opacity: 0.5 !important;
  transform: none !important;
}
.hero-highlight {
  transition: box-shadow 0.3s ease;
}
.hero-highlight.highlighted {
  box-shadow: 0 0 20px rgba(var(--v-theme-primary), 0.5) !important;
}
:deep(.action-buttons-container) {
  position: relative;
  z-index: 10;
}
:deep(.action-btn) {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3) !important;
  transition: all 0.2s ease;
}
:deep(.action-btn:hover) {
  transform: translateY(-1px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.4) !important;
}
@media (max-width: 960px) {
  .instructions-panel :deep(.v-expansion-panel-text__wrapper) {
    max-height: 25vh;
  }
  .action-group {
    min-width: 45%;
  }
  .campaign-actions-speed-dial {
    bottom: 20px;
    right: 20px;
  }
  .speed-dial-activator {
    width: 52px !important;
    height: 52px !important;
  }
  .speed-dial-item {
    width: 44px !important;
    height: 44px !important;
  }
}
@media (max-width: 600px) {
  .instructions-panel :deep(.v-expansion-panel-text__wrapper) {
    max-height: 25vh;
  }
  .action-group {
    justify-content: center;
    width: 100%;
  }
  .campaign-content {
    padding-top: 0.5rem;
  }
  .v-tab {
    min-width: 80px;
  }
  .campaign-actions-speed-dial {
    bottom: 16px;
    right: 16px;
  }
  .speed-dial-activator {
    width: 48px !important;
    height: 48px !important;
  }
  .speed-dial-item {
    width: 40px !important;
    height: 40px !important;
    margin-bottom: 8px !important;
  }
}
.d-contents {
  display: contents;
}
.gap-2 {
  gap: 8px;
}
.player-view {
  pointer-events: none;
}
.v-tabs .v-tab--selected {
  background-color: rgb(var(--v-theme-secondary)) !important;
  color: white !important;
}
.v-sheet {
  max-height: none;
}
.v-container {
  max-width: 100%;
}
.v-speed-dial .v-btn {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
}
</style>
