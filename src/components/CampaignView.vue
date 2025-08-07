<template>
  <div class="campaign-menu">
    <v-container fluid class="pa-2">
      <v-row justify="center" no-gutters>
        <v-col cols="12" lg="10" xl="8">
          <v-card-text v-if="!showSaveCampaignButton" class="pa-2">
            <BaseAlert
              :modelValue="true"
              type="warning"
              text
              border="start"
              variant="tonal"
              :closable="false"
            >
              Players can only view this campaign. Only a Drunagor Master can
              save or delete a campaign.
            </BaseAlert>
          </v-card-text>

          <v-card class="mb-2" color="primary">
            <v-card-actions class="pa-2">
              <div class="d-flex justify-space-around align-center w-100">
                <v-menu offset-y>
                  <template #activator="{ props }">
                    <v-btn v-bind="props" variant="elevated" rounded>
                      <v-icon start>mdi-cog</v-icon>
                      Campaign Actions
                      <v-icon end>mdi-chevron-down</v-icon>
                    </v-btn>
                  </template>

                  <v-list density="compact">
                    <div v-if="showSaveCampaignButton">
                      <v-list-item>
                        <CampaignSavePut
                          ref="savePutRef"
                          :campaign-id="campaignId"
                          @open-save-panel="openSavePanel"
                          block
                        />
                      </v-list-item>
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

                <v-btn variant="elevated" rounded @click="toggleInstructions">
                  <v-icon size="small">mdi-lightbulb-outline</v-icon>
                  <span class="d-none d-sm-inline ml-1">Instructions</span>
                </v-btn>
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

            <v-card-text v-if="expandedPanel.length" class="pa-2">
              <v-expansion-panels
                v-model="expandedPanel"
                accordion
                variant="accordion"
                class="instructions-panel"
              >
                <v-expansion-panel>
                  <v-expansion-panel-text class="pa-2">
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
                    />
                    <LoadInstructions
                      v-else
                      ref="loadInstructionsRef"
                      @instruction-changed="onInstructionChanged"
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
                        <div class="d-flex justify-end mt-2">
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
                        <v-card class="pa-2" color="surface-variant">
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
</template>

<script setup lang="ts">
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
import { ref, onMounted, watch, nextTick } from "vue";
import CampaignRunes from "@/components/CampaignRunes.vue";
/* import SequentialAdventureButton from "@/components/SequentialAdventureButton.vue"; */
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

const campaignStore = CampaignStore();
const heroStore = HeroStore();
const userStore = useUserStore();
const router = useRouter();
const route = useRoute();

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
const showLoading = ref(false);
const players = ref<
  Array<{
    rl_campaigns_users_pk: number;
    user_name: string;
    picture_hash: string | null;
  }>
>([]);
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

// Chaves para localStorage (separadas por aba)
const getInstructionStateKey = () => `campaign_${campaignId}_instruction_state`;
const getInstructionStepKey = (tab: "save" | "load" = instructionTab.value) =>
  `campaign_${campaignId}_instruction_step_${tab}`;

// Função para salvar o estado no localStorage
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

// Função para salvar o passo atual da instrução
const onInstructionChanged = (step: number) => {
  if (typeof window !== "undefined") {
    localStorage.setItem(
      getInstructionStepKey(instructionTab.value),
      step.toString(),
    );
  }
};

// Função para restaurar o estado das instruções
const restoreInstructionState = () => {
  if (typeof window !== "undefined") {
    try {
      const stateStr = localStorage.getItem(getInstructionStateKey());

      if (stateStr) {
        const state = JSON.parse(stateStr);
        const now = Date.now();
        const thirtyMinutes = 30 * 60 * 1000; // 30 minutos em ms

        // Se o estado foi salvo há menos de 30 minutos, restaura
        if (now - state.timestamp < thirtyMinutes) {
          if (state.expanded) {
            expandedPanel.value = [0];
            instructionTab.value = state.tab;

            // Restaura o passo da instrução após o componente ser montado
            const stepStr = localStorage.getItem(
              getInstructionStepKey(state.tab),
            );
            if (stepStr) {
              const step = parseInt(stepStr);
              nextTick(() => {
                if (
                  state.tab === "load" &&
                  loadInstructionsRef.value &&
                  typeof loadInstructionsRef.value.setCurrentStep === "function"
                ) {
                  loadInstructionsRef.value.setCurrentStep(step);
                } else if (
                  state.tab === "save" &&
                  saveInstructionsRef.value &&
                  typeof saveInstructionsRef.value.setCurrentStep === "function"
                ) {
                  saveInstructionsRef.value.setCurrentStep(step);
                }
              });
            }

            router.replace({
              query: {
                ...route.query,
                instructions: "open",
                tab: state.tab,
              },
            });
            return true; // Estado restaurado
          }
        } else {
          // Remove estados expirados
          localStorage.removeItem(getInstructionStateKey());
          localStorage.removeItem(getInstructionStepKey("load"));
          localStorage.removeItem(getInstructionStepKey("save"));
        }
      }
    } catch (error) {
      console.error("Erro ao restaurar estado das instruções:", error);
    }
  }
  return false; // Estado não restaurado
};

const toggleInstructions = () => {
  if (expandedPanel.value.length) {
    expandedPanel.value = [];
    router.replace({
      query: {
        ...route.query,
        instructions: undefined,
        tab: undefined,
      },
    });
  } else {
    // Quando o usuário clica manualmente no botão, sempre abre na aba "load"
    instructionTab.value = "load";
    expandedPanel.value = [0];
    router.replace({
      query: {
        ...route.query,
        instructions: "open",
        tab: "load",
      },
    });
  }
  saveInstructionState();
};

const handleSave = () => {
  savePutRef
    .value!.save()
    .then(() => {
      setAlert(
        "mdi-check",
        "Success",
        "The campaign was saved successfully!",
        "success",
      );
    })
    .catch(() => {
      setAlert(
        "mdi-alert-circle",
        "Error",
        "The campaign could not be saved.",
        "error",
      );
    });
};

const fetchRlCampaignsUsersListPlayers = async () => {
  await axios
    .get("rl_campaigns_users/list_players", {
      params: { campaigns_fk: campaignId },
    })
    .then((response) => {
      players.value = response.data.Users;
      console.log("Fetched players:", response.data.Users);
    })
    .catch(() => {
      showSaveCampaignButton.value = false;
    });
};

const openSavePanel = () => {
  // Esta função é chamada quando o usuário clica no botão "Save Campaign"
  expandedPanel.value = [0];
  instructionTab.value = "save";
  router.replace({
    query: {
      ...route.query,
      instructions: "open",
      tab: "save",
    },
  });
  saveInstructionState();
};

const fetchRole = async () => {
  axios
    .get("rl_campaigns_users/search", {
      params: { users_fk: userStore.user.users_pk, campaigns_fk: campaignId },
    })
    .then((response) => {
      showSaveCampaignButton.value = true
        ? response.data.campaigns[0].party_role === "Admin"
        : false;
    });
};

const setAlert = (
  icon: string,
  title: string,
  text: string,
  type: "success" | "info" | "warning" | "error" | undefined,
) => {
  alertIcon.value = icon;
  alertTitle.value = title;
  alertText.value = text;
  showAlert.value = true;
  alertType.value = type;

  setTimeout(() => {
    showAlert.value = false;
  }, 5000);
};

const onPlayerRemoved = async () => {
  setAlert("mdi-check", "Success", "Player successfully removed", "success");
  await campaignPlayerListRef.value?.fetchPlayers();
};

const syncPanelStateWithRoute = () => {
  if (route.query.instructions === "open") {
    expandedPanel.value = [0];
    instructionTab.value = (route.query.tab as "save" | "load") || "load";

    // Se há um passo salvo para a aba atual, restaura ele
    if (typeof window !== "undefined") {
      const stepStr = localStorage.getItem(
        getInstructionStepKey(instructionTab.value),
      );
      if (stepStr) {
        const step = parseInt(stepStr);
        nextTick(() => {
          if (
            instructionTab.value === "load" &&
            loadInstructionsRef.value &&
            typeof loadInstructionsRef.value.setCurrentStep === "function"
          ) {
            loadInstructionsRef.value.setCurrentStep(step);
          } else if (
            instructionTab.value === "save" &&
            saveInstructionsRef.value &&
            typeof saveInstructionsRef.value.setCurrentStep === "function"
          ) {
            saveInstructionsRef.value.setCurrentStep(step);
          }
        });
      }
    }
  } else {
    expandedPanel.value = [];
  }
  saveInstructionState();
};

// Watch para monitorar mudanças na aba de instrução e restaurar o passo
watch(instructionTab, (newTab) => {
  saveInstructionState();

  // Se mudou para alguma aba e há um passo salvo, restaura ele
  if (typeof window !== "undefined") {
    const stepStr = localStorage.getItem(getInstructionStepKey(newTab));
    if (stepStr) {
      const step = parseInt(stepStr);
      nextTick(() => {
        if (
          newTab === "load" &&
          loadInstructionsRef.value &&
          typeof loadInstructionsRef.value.setCurrentStep === "function"
        ) {
          loadInstructionsRef.value.setCurrentStep(step);
        } else if (
          newTab === "save" &&
          saveInstructionsRef.value &&
          typeof saveInstructionsRef.value.setCurrentStep === "function"
        ) {
          saveInstructionsRef.value.setCurrentStep(step);
        }
      });
    }
  }
});

// Watch para salvar estado quando houver mudanças no painel expandido
watch(
  expandedPanel,
  () => {
    saveInstructionState();
  },
  { deep: true },
);

onMounted(async () => {
  const foundCampaign = campaignStore.find(campaignId);
  if (foundCampaign) {
    campaign.value = foundCampaign;
    foundCampaign.isSequentialAdventure = true;
    isSequentialAdventure.value = true;
  } else {
    console.error(`Campaign with ID ${campaignId} not found.`);
    setAlert(
      "mdi-alert-circle",
      "Error",
      `Campaign with ID ${campaignId} not found.`,
      "error",
    );
  }

  await fetchRole();
  await fetchRlCampaignsUsersListPlayers();

  if (route.query.dialog) {
    showLoading.value = true;
  }

  // Tenta restaurar o estado anterior primeiro
  const stateRestored = restoreInstructionState();

  // Se não conseguiu restaurar o estado e não há parâmetros na URL,
  // abre as instruções na aba "load" por padrão
  if (!stateRestored && !route.query.instructions) {
    expandedPanel.value = [0];
    instructionTab.value = "load";
    router.replace({
      query: { instructions: "open", tab: "load" },
    });
    saveInstructionState();
  }
});

watch(() => route.query, syncPanelStateWithRoute, { immediate: true });

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
  padding-top: 1rem;
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
  max-height: 35vh;
  overflow-y: auto;
}

@media (max-width: 600px) {
  .instructions-panel :deep(.v-expansion-panel-text__wrapper) {
    max-height: 30vh;
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
    max-height: 32vh;
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
