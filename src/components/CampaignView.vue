<template>
  <div class="campaign-menu">
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
              :closable="false"
            >
              Players can only view information for this campaign.
              Only a Drunagor Master can save, edit, or delete a campaign.
            </BaseAlert>
          </v-card-text>
          <v-card class="mb-2" color="primary">
            <v-card-actions class="pa-2">
              <div class="d-flex justify-center w-100">
                <v-menu offset-y>
                  <template #activator="{ props }">
                    <v-btn v-bind="props" variant="elevated" rounded>
                      <v-icon start>mdi-cog</v-icon>
                      Campaign Actions
                      <v-icon end>mdi-chevron-down</v-icon>
                    </v-btn>
                  </template>

                  <v-list density="compact">
                    <v-list-item v-if="showSaveCampaignButton">
                      <v-btn
                        variant="elevated"
                        rounded
                        prepend-icon="mdi-content-save-outline"
                        block
                        class="mx-1 my-1"
                        @click="openSavePanel"
                      >
                        {{ t("label.save-campaign-put") || "Save Campaign" }}
                      </v-btn>
                    </v-list-item>

                    <v-list-item @click="toggleInstructions">
                      <v-btn
                        variant="elevated"
                        rounded
                        prepend-icon="mdi-lightbulb-on-outline"
                        block
                        class="mx-1 my-1"
                      >
                        Instructions
                      </v-btn>
                    </v-list-item>

                    <v-divider class="my-1"></v-divider>

                    <div v-if="showSaveCampaignButton">
                      <v-list-item>
                        <CampaignRemove :campaign-id="campaignId" block />
                      </v-list-item>
                    </div>

                    <v-list-item>
                      <fieldset
                        :disabled="!showSaveCampaignButton"
                        class="d-contents"
                      >
                        <CampaignExport :campaign-id="campaignId" block />
                      </fieldset>
                    </v-list-item>

                    <v-list-item>
                      <ShareCampaignButton :campaignId="campaignId" block />
                    </v-list-item>
                  </v-list>
                </v-menu>
              </div>
              <div style="display: none">
                <CampaignSavePut
                  ref="savePutRef"
                  :campaign-id="campaignId"
                  @success="onSaveSuccess"
                  @fail="onSaveFail"
                />
              </div>
            </v-card-actions>

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

            <v-card-text v-if="expandedPanel.length" class="pa-0">
              <v-expansion-panels
                v-model="expandedPanel"
                accordion
                variant="accordion"
                class="instructions-panel"
              >
                <v-expansion-panel>
                  <v-expansion-panel-text class="pa-0">
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
                    />
                    <LoadInstructions
                      v-else
                      ref="loadInstructionsRef"
                      @instruction-changed="onInstructionChanged"
                      @close="closeInstructions"
                    />
                  </v-expansion-panel-text>
                </v-expansion-panel>
              </v-expansion-panels>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>

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
                  <fieldset :disabled="!showSaveCampaignButton">
                    <v-card class="mb-3" color="primary">
                      <v-card-text class="pa-3">
                        <CampaignPlayerList
                          ref="campaignPlayerListRef"
                          :campaign-id="campaignId"
                          density="compact"
                        />
                        <div class="d-flex justify-space-between align-center mt-2 flex-wrap">
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
                          <RemovePlayersButton
                            :campaignId="campaignId"
                            :showSaveCampaignButton="showSaveCampaignButton"
                            @playersRemoved="onPlayerRemoved"
                            class="mx-1 my-1"
                          />
                        </div>
                      </v-card-text>
                    </v-card>

                    <CampaignName :campaign-id="campaignId" class="mb-3" />

                    <v-row class="mb-3" no-gutters>
                      <v-col cols="12">
                        <SelectDoor :campaign-id="campaignId" />
                      </v-col>
                    </v-row>

                    <v-row v-if="isSequentialAdventure" class="mb-3" no-gutters>
                      <v-col cols="12">
                        <CampaignRunes :campaign-id="campaignId" />
                      </v-col>
                    </v-row>

                    <v-row class="mb-3" no-gutters>
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
                  </fieldset>
                </v-window-item>

                <v-window-item value="book">
                  <CampaignBook :campaign-id="campaignId" />
                </v-window-item>
              </v-window>
            </v-col>
          </v-row>
        </template>

        <template v-else>
          <fieldset :disabled="!showSaveCampaignButton">
            <v-row justify="center" no-gutters>
              <v-col cols="12" lg="10" xl="8">
                <div class="pa-2">
                  <CampaignName :campaign-id="campaignId" class="mb-3" />

                  <div v-if="isSequentialAdventure" class="mb-3">
                    <CampaignRunes :campaign-id="campaignId" />
                  </div>

                  <div
                    v-if="
                      campaign.campaign === 'awakenings' ||
                      campaign.campaign === 'apocalypse'
                    "
                    class="mb-3"
                  >
                    <StoryRecord :campaign-id="campaignId" />
                  </div>

                  <div v-if="campaign.campaign === 'apocalypse'" class="mb-3">
                    <v-sheet rounded border="md" class="pa-3 text-white">
                      <p class="text-center text-caption">
                        Apocalypse campaign specific content (e.g., Legacy
                        Trail, Background & Trait) would appear here.
                      </p>
                    </v-sheet>
                  </div>

                  <v-row class="mb-3" no-gutters>
                    <v-col cols="12">
                      <div class="d-flex justify-center flex-wrap gap-2">
                        <CampaignLogAddHero
                          :campaign-id="campaignId"
                          class="mx-1 my-1"
                        />
                        <CampaignLogRemoveHero
                          :campaign-id="campaignId"
                          class="mx-1 my-1"
                        />
                      </div>
                    </v-col>
                  </v-row>

                  <v-sheet rounded border="md" class="text-white pa-2">
                    <div
                      v-if="
                        heroStore.findAllInCampaign(campaignId).length === 0
                      "
                      class="text-center pa-4"
                    >
                      No heroes added to this campaign yet.
                    </div>
                    <div
                      v-for="hero in heroStore.findAllInCampaign(campaignId)"
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
                </div>
              </v-col>
            </v-row>
          </fieldset>
        </template>
      </template>

      <template v-else-if="!campaign && !showAlert">
        <v-row justify="center">
          <v-col cols="12" md="8" class="text-center pa-5">
            <p>Loading campaign data...</p>
            <v-progress-circular indeterminate color="primary" class="mt-4" />
          </v-col>
        </v-row>
      </template>
    </v-container>
  </div>

  <v-dialog v-model="transferDialogVisible" max-width="400px">
    <v-card>
      <v-card-title>Transfer Drunagor Master</v-card-title>
      <v-card-text v-if="transferAlertVisible" class="pa-2">
        <BaseAlert
          v-model="transferAlertVisible"
          :type="transferAlertType"
          text
          border="start"
          variant="tonal"
          closable
        >
          {{ transferAlertText }}
        </BaseAlert>
      </v-card-text>
      <v-card-text>
        <div v-if="transferLoading" class="d-flex justify-center pa-4">
          <v-progress-circular indeterminate color="primary" />
        </div>
        <template v-else>
          <v-list v-if="!confirmingTransfer">
            <v-list-item
              v-for="user in players"
              :key="user.rl_campaigns_users_pk"
              :disabled="user.party_roles_fk === 1"
              @click="initTransfer(user)"
            >
              <v-list-item-title>
                {{ user.user_name }} — {{ user.role_name }}
              </v-list-item-title>
            </v-list-item>
          </v-list>
          <div v-else class="pa-4">
            <p class="text-center">
              Do you want to transfer Drunagor Master to
              <strong>{{ selectedUser!.user_name }}</strong
              >?
            </p>
          </div>
        </template>
      </v-card-text>
      <v-card-actions v-if="!confirmingTransfer" class="d-flex justify-end">
        <v-btn
          variant="text"
          @click="closeTransferDialog"
          :disabled="transferLoading"
        >
          Close
        </v-btn>
      </v-card-actions>
      <v-card-actions v-if="confirmingTransfer" class="d-flex justify-end">
        <v-btn color="red" :disabled="transferLoading" @click="cancelTransfer">
          No
        </v-btn>
        <v-btn
          color="green"
          :disabled="transferLoading"
          @click="confirmTransfer"
        >
          Yes
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
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
import RemovePlayersButton from "@/components/RemovePlayersButton.vue";
import ShareCampaignButton from "./ShareCampaignButton.vue";
import CampaignLogImportHero from "@/components/CampaignLogImportHero.vue";

const campaignStore = CampaignStore();
const heroStore = HeroStore();
const userStore = useUserStore();
const router = useRouter();
const route = useRoute();
const { t } = useI18n();
const campaignId = (route.params as { id: string }).id.toString();

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
        // Optional: force a refresh or navigate away since user is no longer the master
        router.push({ name: 'Campaigns' }); 
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
  if (!newVal && transferAlertType.value === 'success') {
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
  closeInstructions();
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
  const foundCampaign = campaignStore.find(campaignId);
  if (foundCampaign) {
    campaign.value = foundCampaign;
  } else {
    setAlert(
      "mdi-alert-circle",
      "Error",
      `Campaign with ID ${campaignId} not found.`,
      "error",
    );
  }

  await fetchRole();

  restoreInstructionState();
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
  max-height: 30vh;
  overflow-y: auto;
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
}

@media (max-width: 960px) {
  .instructions-panel :deep(.v-expansion-panel-text__wrapper) {
    max-height: 25vh;
  }

  .action-group {
    min-width: 45%;
  }
}

.d-contents {
  display: contents;
}

.gap-2 {
  gap: 8px;
}

fieldset {
  border: none;
  padding: 0;
  margin: 0;
}

fieldset:disabled {
  pointer-events: none;
  opacity: 0.6;
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
</style>