<template>
  <v-speed-dial v-model="speedDialOpen" transition="fade-transition">
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
      <v-tooltip activator="parent" location="start"> Instructions </v-tooltip>
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
                      style="padding: 0px !important"
                    >
                      <v-tabs
                        v-model="instructionTab"
                        density="compact"
                        grow
                        class="mb-3"
                      >
                        <v-tab v-if="showSaveCampaignButton" value="save">
                          Save Campaign
                        </v-tab>
                        <v-tab value="load">Load Campaign</v-tab>
                      </v-tabs>

                      <SaveInstructions
                        v-if="instructionTab === 'save'"
                        ref="saveInstructionsRef"
                        @save="handleSave"
                        @instruction-changed="onInstructionChanged"
                        @close="closeInstructions"
                        style="max-height: 25vh !important"
                      />
                      <LoadInstructions
                        v-else
                        ref="loadInstructionsRef"
                        @instruction-changed="onInstructionChanged"
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
                        >
                          Transfer Drunagor Master
                        </v-btn>

                        <div
                          v-if="showSaveCampaignButton"
                          class="mx-1 my-1 d-flex align-center"
                        >
                          <div class="mr-3">
                            <span class="text-caption font-weight-bold d-block"
                              >PARTY CODE:</span
                            >
                            <span class="info-text d-block"
                              >Use this code to invite your friends</span
                            >
                          </div>
                          <v-chip
                            v-if="partyCode"
                            label
                            size="large"
                          >
                            {{ partyCode }}
                          </v-chip>
                          <v-chip v-else label size="large">
                            Generating...
                          </v-chip>
                        </div>
                      </div>
                    </v-card-text>
                  </v-card>

                  <div>
                    <v-row no-gutters>
              
                      <v-col cols="12" md="6" class="pr-md-2">
                        <CampaignName :campaign-id="campaignId" class="mb-3" />
                        <SelectDoor :campaign-id="campaignId" class="mb-3" />
                        <CampaignRunes v-if="isSequentialAdventure" :campaign-id="campaignId" class="mb-3"/>
                      </v-col>

                      <v-col cols="12" md="6" class="pl-md-2">
                        <CampaignRuneCards v-if="isSequentialAdventure" :campaign-id="campaignId" class="mb-3"/>
                      </v-col>
                    </v-row>

                    <v-row
                      class="my-3"
                      no-gutters
                      v-if="showSaveCampaignButton"
                    >
                      <v-col cols="12">
                        <v-card class="pa-2" color="primary">
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
                        <v-sheet rounded border="md" class="text-white pa-2">
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
import CampaignLogAddHero from "@/components/CampaignLogAddHero.vue";
import CampaignLogRemoveHero from "@/components/CampaignLogRemoveHero.vue";
import CampaignLog from "@/components/CampaignLog.vue";
import { useRoute, useRouter } from "vue-router";
import { HeroStore } from "@/store/HeroStore";
import CampaignRemove from "@/components/CampaignRemove.vue";
import CampaignExport from "@/components/CampaignExport.vue";
import CampaignSavePut from "@/components/CampaignSavePut.vue";
import StoryRecord from "@/components/StoryRecord.vue";
import CampaignName from "@/components/CampaignName.vue";
import { CampaignStore } from "@/store/CampaignStore";
import { type Campaign } from "@/store/Campaign";
import { ref, onMounted, watch, nextTick, onBeforeUnmount } from "vue";
import CampaignRunes from "@/components/CampaignRunes.vue";
import CampaignBook from "@/components/CampaignBook.vue";
import SelectDoor from "@/components/SelectDoor.vue";
import { useUserStore } from "@/store/UserStore";
import axios from "axios";
import { ref as vueRef } from "vue";
import BaseAlert from "@/components/Alerts/BaseAlert.vue";
import CampaignPlayerList from "@/components/CampaignPlayerList.vue";
import SaveInstructions from "./SaveInstructions.vue";
import LoadInstructions from "./LoadInstructions.vue";
import ShareCampaignButton from "./ShareCampaignButton.vue";
import CampaignLogImportHero from "@/components/CampaignLogImportHero.vue";
import CampaignRuneCards from "@/components/CampaignRuneCards.vue";

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
const instructionTab = ref<"save" | "load">("load");
const loadInstructionsRef = vueRef<InstanceType<
  typeof LoadInstructions
> | null>(null);
const saveInstructionsRef = vueRef<InstanceType<
  typeof SaveInstructions
> | null>(null);

// Speed Dial refs
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

// New refs and logic for Transfer Master feature
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

const generatePartyCode = () => {
  const prefix = Math.floor(1000 + Math.random() * 9000).toString();
  partyCode.value = `${prefix}${campaignId}`;
};

// ... (o restante do script permanece o mesmo)
const handleSpeedDialAction = (action: string) => {
  switch (action) {
    case "save":
      if (campaign.value?.campaign === "underkeep") {
        openSavePanel();
      } else {
        handleSave();
      }
      break;
    case "instructions":
      toggleInstructions();
      break;
    case "export":
      if (campaignExportRef.value?.export) {
        campaignExportRef.value.export();
      }
      break;
    case "share":
      if (shareCampaignRef.value?.openDialog) {
        shareCampaignRef.value.openDialog();
      }
      break;
    case "remove":
      if (campaignRemoveRef.value?.openDialog) {
        campaignRemoveRef.value.openDialog();
      }
      break;
  }

  speedDialOpen.value = false;
};

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
    .catch((err) => {
      console.error("Error fetching players:", err);
    })
    .finally(() => {
      transferLoading.value = false;
    });
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
      setTimeout(() => {
        transferAlertVisible.value = false;
      }, 1500);
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

watch(transferAlertVisible, (newVal) => {
  if (!newVal && transferAlertType.value === "success") {
    closeTransferDialog();
  }
});

const getInstructionStateKey = () => `campaign_${campaignId}_instruction_state`;
const getInstructionStepKey = (tab: string) =>
  `campaign_${campaignId}_instruction_step_${tab}`;
const getSessionStateKey = () => `campaign_${campaignId}_session_state`;

const saveSessionState = () => {
  if (typeof window !== "undefined") {
    const state = {
      expanded: expandedPanel.value.length > 0,
      tab: instructionTab.value,
      currentTab: currentTab.value,
      timestamp: Date.now(),
      saveStep:
        instructionTab.value === "save"
          ? localStorage.getItem(getInstructionStepKey("save"))
          : null,
      loadStep:
        instructionTab.value === "load"
          ? localStorage.getItem(getInstructionStepKey("load"))
          : null,
    };
    localStorage.setItem(getSessionStateKey(), JSON.stringify(state));

    saveInstructionState();
  }
};

const saveInstructionState = () => {
  if (typeof window !== "undefined") {
    const state = {
      expanded: expandedPanel.value.length > 0,
      tab: instructionTab.value,
      timestamp: Date.now(),
    };
    localStorage.setItem(getInstructionStateKey(), JSON.stringify(state));
  }
};

const onInstructionChanged = (step: number) => {
  if (typeof window !== "undefined") {
    localStorage.setItem(
      getInstructionStepKey(instructionTab.value),
      step.toString(),
    );
    saveSessionState();
  }
};

const closeInstructions = () => {
  expandedPanel.value = [];
  if (typeof window !== "undefined") {
    localStorage.removeItem(getSessionStateKey());
    localStorage.removeItem(getInstructionStateKey());
    localStorage.removeItem(getInstructionStepKey("save"));
    localStorage.removeItem(getInstructionStepKey("load"));
  }
  router.replace({
    query: { ...route.query, instructions: undefined, tab: undefined },
  });
};

const restoreInstructionState = () => {
  if (typeof window === "undefined") return;

  const sessionStateStr = localStorage.getItem(getSessionStateKey());
  if (sessionStateStr) {
    try {
      const sessionState = JSON.parse(sessionStateStr);
      const now = Date.now();
      const thirtyMinutes = 30 * 60 * 1000;

      if (now - sessionState.timestamp < thirtyMinutes) {
        if (sessionState.expanded) {
          expandedPanel.value = [0];
          instructionTab.value = sessionState.tab;

          if (
            campaign.value?.campaign === "underkeep" &&
            sessionState.currentTab
          ) {
            currentTab.value = sessionState.currentTab;
          }

          nextTick(() => {
            if (sessionState.tab === "save" && sessionState.saveStep) {
              const step = parseInt(sessionState.saveStep);
              saveInstructionsRef.value?.setCurrentStep(step);
            } else if (sessionState.tab === "load" && sessionState.loadStep) {
              const step = parseInt(sessionState.loadStep);
              loadInstructionsRef.value?.setCurrentStep(step);
            }
          });

          router.replace({
            query: {
              ...route.query,
              instructions: "open",
              tab: sessionState.tab,
            },
          });
        }
        return;
      } else {
        localStorage.removeItem(getSessionStateKey());
      }
    } catch (error) {
      console.error("Error restoring session state:", error);
      localStorage.removeItem(getSessionStateKey());
    }
  }

  if (route.query.instructions === "open") {
    const queryTab = route.query.tab as string;

    if (queryTab === "save" && showSaveCampaignButton.value) {
      expandedPanel.value = [0];
      instructionTab.value = "save";

      const stepStr = localStorage.getItem(getInstructionStepKey("save"));
      if (stepStr) {
        const step = parseInt(stepStr);
        nextTick(() => saveInstructionsRef.value?.setCurrentStep(step));
      }
    } else if (queryTab === "load") {
      expandedPanel.value = [0];
      instructionTab.value = "load";

      const stepStr = localStorage.getItem(getInstructionStepKey("load"));
      if (stepStr) {
        const step = parseInt(stepStr);
        nextTick(() => loadInstructionsRef.value?.setCurrentStep(step));
      }
    } else {
      expandedPanel.value = [0];
      instructionTab.value = "load";

      const stepStr = localStorage.getItem(getInstructionStepKey("load"));
      if (stepStr) {
        const step = parseInt(stepStr);
        nextTick(() => loadInstructionsRef.value?.setCurrentStep(step));
      }

      router.replace({
        query: { instructions: "open", tab: "load" },
      });
    }
  } else {
    try {
      const stateStr = localStorage.getItem(getInstructionStateKey());
      if (stateStr) {
        const state = JSON.parse(stateStr);
        const now = Date.now();
        const thirtyMinutes = 30 * 60 * 1000;

        if (now - state.timestamp < thirtyMinutes) {
          expandedPanel.value = [0];
          instructionTab.value = "load";

          const stepStr = localStorage.getItem(getInstructionStepKey("load"));
          if (stepStr) {
            const step = parseInt(stepStr);
            nextTick(() => loadInstructionsRef.value?.setCurrentStep(step));
          }

          router.replace({
            query: { instructions: "open", tab: "load" },
          });
        } else {
          localStorage.removeItem(getInstructionStateKey());
          localStorage.removeItem(getInstructionStepKey("load"));
          localStorage.removeItem(getInstructionStepKey("save"));

          expandedPanel.value = [0];
          instructionTab.value = "load";

          router.replace({
            query: { instructions: "open", tab: "load" },
          });
        }
      } else {
        expandedPanel.value = [0];
        instructionTab.value = "load";

        router.replace({
          query: { instructions: "open", tab: "load" },
        });
      }
    } catch (error) {
      console.error("Error restoring state:", error);
      expandedPanel.value = [0];
      instructionTab.value = "load";

      router.replace({
        query: { instructions: "open", tab: "load" },
      });
    }
  }
};

const onTabChange = (newTab: string) => {
  if (newTab === "book") {
    if (expandedPanel.value.length > 0) {
      saveSessionState();
      closeInstructions();
    }
  } else if (newTab === "normal") {
    const sessionStateStr = localStorage.getItem(getSessionStateKey());
    if (sessionStateStr) {
      try {
        const sessionState = JSON.parse(sessionStateStr);
        const now = Date.now();
        const thirtyMinutes = 30 * 60 * 1000;

        if (
          now - sessionState.timestamp < thirtyMinutes &&
          sessionState.expanded
        ) {
          restoreInstructionState();
          return;
        }
      } catch (error) {
        console.error("Error checking session state:", error);
      }
    }

    if (expandedPanel.value.length === 0) {
      instructionTab.value = "load";
      expandedPanel.value = [0];
      router.replace({
        query: { ...route.query, instructions: "open", tab: "load" },
      });
    }
  }
};

const toggleInstructions = () => {
  if (expandedPanel.value.length) {
    closeInstructions();
  } else {
    instructionTab.value = "load";
    expandedPanel.value = [0];
    router.replace({
      query: { ...route.query, instructions: "open", tab: "load" },
    });
  }
};

const openSavePanel = () => {
  expandedPanel.value = [0];
  instructionTab.value = "save";
  router.replace({
    query: { ...route.query, instructions: "open", tab: "save" },
  });
};

const handleSave = async () => {
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
};

const onSaveSuccess = () => {
  setAlert(
    "mdi-check",
    "Success",
    "The campaign was saved successfully!",
    "success",
  );
  if (campaign.value?.campaign === "underkeep") {
    closeInstructions();
  }
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
    const response = await axios.get("rl_campaigns_users/search", {
      params: { users_fk: userStore.user.users_pk, campaigns_fk: campaignId },
    });
    showSaveCampaignButton.value =
      response.data.campaigns[0]?.party_role === "Admin";
  } catch (error) {
    showSaveCampaignButton.value = false;
  }
};

const setAlert = (
  icon: string,
  title: string,
  text: string,
  type: "success" | "info" | "warning" | "error" | undefined,
  duration: number = 1500,
) => {
  alertIcon.value = icon;
  alertTitle.value = title;
  alertText.value = text;
  showAlert.value = true;
  alertType.value = type;
  setTimeout(() => {
    showAlert.value = false;
  }, duration);
};

const onPlayerRemoved = async () => {
  setAlert("mdi-check", "Success", "Player successfully removed", "success");
  await campaignPlayerListRef.value?.fetchPlayers();
};

onBeforeUnmount(() => {
  if (expandedPanel.value.length > 0) {
    saveSessionState();
  }
});

onMounted(async () => {
  if (!campaignId) {
    setAlert("mdi-alert-circle", "Error", "Campaign ID is missing.", "error");
    return;
  }
  const foundCampaign = campaignStore.find(campaignId);
  if (foundCampaign) {
    campaign.value = foundCampaign;
    if (!campaign.value.isSequentialAdventure) {
      console.log(`Ativando Aventura Sequencial para a campanha: ${campaignId}`);
      campaign.value.isSequentialAdventure = true;
      campaign.value.sequentialAdventureRunes = 0; // Inicia as runas com 0

      // Para cada herói na campanha, inicia o estado da Aventura Sequencial.
      heroStore.findAllInCampaign(campaignId).forEach((hero) => {
        hero.sequentialAdventureState = new SequentialAdventureState();
      });
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
  if (campaign.value?.campaign === "underkeep") {
    restoreInstructionState();
  }
});

watch(
  [expandedPanel, instructionTab, currentTab],
  () => {
    if (expandedPanel.value.length > 0) {
      saveSessionState();
    }
  },
  { deep: true },
);

watch(instructionTab, (newTab) => {
  if (expandedPanel.value.length) {
    const tab =
      newTab === "save" && showSaveCampaignButton.value ? "save" : "load";

    router.replace({
      query: { ...route.query, instructions: "open", tab },
    });

    saveSessionState();
  }
});

watch(
  () => route.query,
  (newQuery) => {
    if (newQuery.instructions === "open") {
      if (newQuery.tab === "save" && showSaveCampaignButton.value) {
        expandedPanel.value = [0];
        instructionTab.value = "save";

        const stepStr = localStorage.getItem(getInstructionStepKey("save"));
        if (stepStr) {
          const step = parseInt(stepStr);
          nextTick(() => saveInstructionsRef.value?.setCurrentStep(step));
        }
      } else if (newQuery.tab === "load") {
        expandedPanel.value = [0];
        instructionTab.value = "load";

        const stepStr = localStorage.getItem(getInstructionStepKey("load"));
        if (stepStr) {
          const step = parseInt(stepStr);
          nextTick(() => loadInstructionsRef.value?.setCurrentStep(step));
        }
      }
    } else {
      expandedPanel.value = [];
    }
  },
);

watch(
  campaign,
  (newCampaign) => {
    if (newCampaign) {
      isSequentialAdventure.value = newCampaign.isSequentialAdventure ?? false;
      if (newCampaign.campaign !== "underkeep") {
        currentTab.value = "normal";
      }
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

.close-instructions-btn[data-v-9901feaa] {
  position: absolute;
  top: 47px;
  right: 29px;
  z-index: 25;
  background-color: rgba(244, 67, 54, 0.9) !important;
  border-radius: 50% !important;
  min-width: 28px !important;
  width: 28px !important;
  height: 28px !important;
  transition: all 0.2s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.close-instructions-btn:hover {
  background-color: rgba(244, 67, 54, 1) !important;
  transform: scale(1.15);
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.3);
}

.close-instructions-btn .v-icon {
  color: white !important;
  font-size: 16px !important;
}

.close-instructions-btn:hover .v-icon {
  color: white !important;
}

.speed-dial-activator {
  position: fixed;
  right: 24px;
  bottom: 62px;
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

