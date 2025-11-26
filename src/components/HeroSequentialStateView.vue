<template>
  <v-row no-gutters class="pt-6">
    <v-col cols="12" class="d-flex justify-center pb-4">
      <v-btn
        variant="elevated"
        color="primary"
        @click="saveAndGoBack"
        :disabled="!isLoaded"
      >
        {{ t("Save Changes") }}
      </v-btn>
    </v-col>
  </v-row>

  <HeroSavePut
    ref="heroSavePutRef"
    :campaign-id="campaignId"
    :hero-id="heroId"
    @success="onSaveSuccess"
    @fail="onSaveFail"
    style="display: none"
  />

  <!-- Loading State -->
  <v-row v-if="!isLoaded" no-gutters>
    <v-col
      cols="12"
      class="d-flex justify-center align-center"
      style="min-height: 400px"
    >
      <v-progress-circular indeterminate color="primary" size="64" />
    </v-col>
  </v-row>

  <v-row v-else no-gutters>
    <v-col cols="12" class="d-flex align-center justify-center">
      <v-card
        elevation="16"
        rounded
        style="background-color: #1f2937"
        width="800px"
        class="sequential-state-card rounded-t-xl"
      >
        <v-img :src="hero?.images?.trackerInfo" class="rounded-0" contain />

        <v-card-actions>
          <v-row no-gutters class="px-6 py-4">
            <v-col cols="12">
              <div class="text-center text-h5 mb-4">
                {{ t("Manage Resources") }}
              </div>

              <!-- Life Points -->
              <v-row no-gutters class="mb-4">
                <v-col cols="12">
                  <v-sheet
                    rounded
                    border="md"
                    class="pa-4 text-white"
                    style="background-color: #374151 !important"
                  >
                    <div class="text-subtitle-1 mb-2 d-flex align-center">
                      <v-icon start>mdi-heart</v-icon>
                      {{ t("label.lifepoints", "Life Points") }}
                    </div>
                    <v-text-field
                      v-model.number="localState.lifepoints"
                      type="number"
                      variant="outlined"
                      density="compact"
                      hide-details
                    />
                  </v-sheet>
                </v-col>
              </v-row>

              <!-- Curse and Trauma Cubes -->
              <v-row no-gutters class="mb-4">
                <v-col cols="6" class="pr-2">
                  <v-sheet
                    rounded
                    border="md"
                    class="pa-4 text-white"
                    style="background-color: #374151 !important"
                  >
                    <div class="text-subtitle-1 mb-2 d-flex align-center">
                      <v-icon color="black" start>mdi-cube</v-icon>
                      {{ t("text.curse-cubes") }}
                    </div>
                    <v-text-field
                      v-model.number="localState.curseCubes"
                      type="number"
                      variant="outlined"
                      density="compact"
                      hide-details
                    />
                  </v-sheet>
                </v-col>
                <v-col cols="6" class="pl-2">
                  <v-sheet
                    rounded
                    border="md"
                    class="pa-4 text-white"
                    style="background-color: #374151 !important"
                  >
                    <div class="text-subtitle-1 mb-2 d-flex align-center">
                      <v-icon color="purple-lighten-2" start>mdi-cube</v-icon>
                      {{ t("text.trauma-cubes") }}
                    </div>
                    <v-text-field
                      v-model.number="localState.traumaCubes"
                      type="number"
                      variant="outlined"
                      density="compact"
                      hide-details
                    />
                  </v-sheet>
                </v-col>
              </v-row>

              <!-- Available and Used Cubes -->
              <v-row no-gutters class="mb-4">
                <v-col cols="6" class="pr-2">
                  <v-sheet
                    rounded
                    border="md"
                    class="pa-4 text-white"
                    style="background-color: #374151 !important"
                  >
                    <div class="text-subtitle-1 mb-2 d-flex align-center">
                      <div class="ml-2">
                        <v-icon size="x-small" color="yellow-darken-2"
                          >mdi-cube</v-icon
                        >
                        <v-icon size="x-small" color="red-darken-2"
                          >mdi-cube</v-icon
                        >
                        <v-icon size="x-small" color="green-darken-2"
                          >mdi-cube</v-icon
                        >
                        <v-icon size="x-small" color="blue-darken-2"
                          >mdi-cube</v-icon
                        >
                      </div>
                      {{ t("Available Cubes") }}
                    </div>
                    <v-text-field
                      v-model.number="localState.availableCubes"
                      type="number"
                      variant="outlined"
                      density="compact"
                      hide-details
                    />
                  </v-sheet>
                </v-col>
                <v-col cols="6" class="pl-2">
                  <v-sheet
                    rounded
                    border="md"
                    class="pa-4 text-white"
                    style="background-color: #374151 !important"
                  >
                    <div class="text-subtitle-1 mb-2 d-flex align-center">
                      <div class="ml-2 faded-cubes">
                        <v-icon size="x-small" color="yellow-darken-2"
                          >mdi-cube</v-icon
                        >
                        <v-icon size="x-small" color="red-darken-2"
                          >mdi-cube</v-icon
                        >
                        <v-icon size="x-small" color="green-darken-2"
                          >mdi-cube</v-icon
                        >
                        <v-icon size="x-small" color="blue-darken-2"
                          >mdi-cube</v-icon
                        >
                      </div>
                      {{ t("Used Cubes") }}
                    </div>
                    <v-text-field
                      v-model.number="localState.usedCubes"
                      type="number"
                      variant="outlined"
                      density="compact"
                      hide-details
                    />
                  </v-sheet>
                </v-col>
              </v-row>

              <!-- Resources -->
              <v-row no-gutters>
                <v-col cols="12">
                  <v-sheet
                    rounded
                    border="md"
                    class="pa-4 text-white"
                    style="background-color: #374151 !important"
                  >
                    <div class="text-subtitle-1 mb-3">
                      {{ t("label.resources") }}
                    </div>
                    <v-row
                      v-for="resource in RESOURCE_DEFINITIONS"
                      :key="resource.id"
                      no-gutters
                      class="mb-2"
                    >
                      <v-col cols="12">
                        <div class="d-flex align-items-center">
                          <span
                            class="text-body-2 mr-3"
                            style="min-width: 150px"
                          >
                            {{ t(resource.translation_key) }}
                          </span>
                          <v-text-field
                            v-model.number="localState.resources[resource.id]"
                            type="number"
                            variant="outlined"
                            density="compact"
                            hide-details
                            style="max-width: 120px"
                          />
                        </div>
                      </v-col>
                    </v-row>
                  </v-sheet>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-card-actions>
      </v-card>
    </v-col>
  </v-row>

  <v-row v-if="isLoaded" no-gutters class="pt-6 pb-6">
    <v-col cols="12" class="d-flex justify-center">
      <v-btn variant="elevated" color="primary" @click="saveAndGoBack">
        {{ t("Save Changes") }}
      </v-btn>
    </v-col>
  </v-row>

  <!-- Snackbar para feedback -->
  <v-snackbar
    v-model="snackbarVisible"
    :timeout="snackbarTimeout"
    :color="snackbarColor"
    location="top"
  >
    {{ snackbarText }}
  </v-snackbar>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import HeroSavePut from "@/components/HeroSavePut.vue";
import { HeroStore } from "@/store/HeroStore";
import { HeroDataRepository } from "@/data/repository/HeroDataRepository";
import type { HeroData } from "@/data/repository/HeroData";
import { CampaignLoadFromStorage } from "@/utils/CampaignLoadFromStorage";
import { SequentialAdventureState, RESOURCE_DEFINITIONS } from "@/store/Hero";

const route = useRoute();
const router = useRouter();
const { t } = useI18n();
const heroSavePutRef = ref();

const heroId = route.params.heroId.toString();
const campaignId = route.params.campaignId.toString();

const heroStore = HeroStore();
const heroDataRepository = new HeroDataRepository();
const isLoaded = ref(false);

const hero = ref<HeroData | null>(null);
const campaignHeroRef = ref<any>(null);

const localState = ref({
  lifepoints: 0,
  curseCubes: 0,
  traumaCubes: 0,
  availableCubes: 0,
  usedCubes: 0,
  resources: {} as Record<string, number>,
});

RESOURCE_DEFINITIONS.forEach((resource) => {
  localState.value.resources[resource.id] = 0;
});

const snackbarVisible = ref(false);
const snackbarText = ref("");
const snackbarColor = ref("success");
const snackbarTimeout = ref(3000);

const getInstructionStateKey = () => `campaign_${campaignId}_instruction_state`;
const getInstructionStepKey = (tab: string) =>
  `campaign_${campaignId}_instruction_step_${tab}`;

const getInstructionState = () => {
  if (typeof window !== "undefined") {
    try {
      const stateStr = localStorage.getItem(getInstructionStateKey());

      if (stateStr) {
        const state = JSON.parse(stateStr);
        const now = Date.now();
        const thirtyMinutes = 30 * 60 * 1000;

        if (now - state.timestamp < thirtyMinutes) {
          const stepStr = localStorage.getItem(
            getInstructionStepKey(state.tab),
          );
          return {
            expanded: state.expanded,
            tab: state.tab,
            step: stepStr ? parseInt(stepStr) : undefined,
          };
        } else {
          localStorage.removeItem(getInstructionStateKey());
          localStorage.removeItem(getInstructionStepKey("load"));
          localStorage.removeItem(getInstructionStepKey("save"));
        }
      }
    } catch (error) {
      console.error("Erro ao obter estado das instruções:", error);
    }
  }
  return null;
};

const onSaveSuccess = () => {
  snackbarText.value = "Resources saved successfully!";
  snackbarColor.value = "success";
  snackbarVisible.value = true;

  setTimeout(() => {
    navigateBack();
  }, 1000);
};

const onSaveFail = () => {
  snackbarText.value = "Failed to save resources.";
  snackbarColor.value = "error";
  snackbarVisible.value = true;
};

function navigateBack() {
  const instructionState = getInstructionState();
  const query: any = {};

  if (instructionState && instructionState.expanded) {
    query.instructions = "open";
    query.tab = instructionState.tab;
  }

  router.push({
    name: "Campaign",
    params: { id: campaignId },
    query: query,
  });
}

function syncStateToStore() {
  if (campaignHeroRef.value) {
    if (!campaignHeroRef.value.sequentialAdventureState) {
      campaignHeroRef.value.sequentialAdventureState =
        new SequentialAdventureState();
    }

    campaignHeroRef.value.sequentialAdventureState.lifepoints =
      Number(localState.value.lifepoints) || 0;
    campaignHeroRef.value.sequentialAdventureState.curseCubes =
      Number(localState.value.curseCubes) || 0;
    campaignHeroRef.value.sequentialAdventureState.traumaCubes =
      Number(localState.value.traumaCubes) || 0;
    campaignHeroRef.value.sequentialAdventureState.availableCubes =
      Number(localState.value.availableCubes) || 0;
    campaignHeroRef.value.sequentialAdventureState.usedCubes =
      Number(localState.value.usedCubes) || 0;

    Object.keys(localState.value.resources).forEach((key) => {
      campaignHeroRef.value.sequentialAdventureState.resources[key] =
        Number(localState.value.resources[key]) || 0;
    });
  }
}

function saveAndGoBack() {
  syncStateToStore();

  if (heroSavePutRef.value && heroSavePutRef.value.save) {
    heroSavePutRef.value.save().catch((error: any) => {
      console.error("Error saving:", error);
      onSaveFail();
    });
  } else {
    navigateBack();
  }
}

onMounted(async () => {
  try {
    const loader = new CampaignLoadFromStorage();
    await loader.loadCampaignComplete(campaignId);

    const updatedHero = heroStore.findInCampaignOptional(heroId, campaignId);

    if (updatedHero) {
      campaignHeroRef.value = updatedHero;

      if (!updatedHero.sequentialAdventureState) {
        updatedHero.sequentialAdventureState = new SequentialAdventureState();
      }

      if (!updatedHero.sequentialAdventureState.resources) {
        updatedHero.sequentialAdventureState.resources = {};
      }

      RESOURCE_DEFINITIONS.forEach((resource) => {
        if (
          updatedHero.sequentialAdventureState!.resources[resource.id] ===
          undefined
        ) {
          updatedHero.sequentialAdventureState!.resources[resource.id] = 0;
        }
      });

      localState.value = {
        lifepoints: updatedHero.sequentialAdventureState.lifepoints || 0,
        curseCubes: updatedHero.sequentialAdventureState.curseCubes || 0,
        traumaCubes: updatedHero.sequentialAdventureState.traumaCubes || 0,
        availableCubes:
          updatedHero.sequentialAdventureState.availableCubes || 0,
        usedCubes: updatedHero.sequentialAdventureState.usedCubes || 0,
        resources: { ...updatedHero.sequentialAdventureState.resources },
      };

      hero.value = heroDataRepository.find(heroId) ?? null;
    } else {
      console.error(`Hero ${heroId} not found in campaign ${campaignId}`);
      snackbarText.value = "Hero not found in this campaign.";
      snackbarColor.value = "error";
      snackbarVisible.value = true;
    }
  } catch (error) {
    console.error("Error loading hero data:", error);
    snackbarText.value = "Error loading hero data.";
    snackbarColor.value = "error";
    snackbarVisible.value = true;
  } finally {
    isLoaded.value = true;
  }
});
</script>

<style scoped>
.sequential-state-card {
  background-color: #1f2937;
}

.faded-cubes {
  opacity: 0.6;
  filter: grayscale(40%);
}

:deep(.v-field__input) {
  text-align: center;
}
</style>
