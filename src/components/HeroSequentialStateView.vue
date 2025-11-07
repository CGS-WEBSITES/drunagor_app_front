<template>
  <v-row no-gutters class="pt-6">
    <v-col cols="12" class="d-flex justify-center pb-4">
      <v-btn variant="elevated" color="primary" @click="saveAndGoBack">
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
  
  <v-row no-gutters>
    <v-col cols="12" class="d-flex align-center justify-center">
      <v-card
        elevation="16"
        rounded
        style="background-color: #1f2937"
        width="800px"
        class="sequential-state-card rounded-t-xl"
      >
        <v-img :src="hero.images.trackerInfo" class="rounded-0" contain />

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
                        <v-icon size="x-small" color="yellow-darken-2">mdi-cube</v-icon>
                        <v-icon size="x-small" color="red-darken-2">mdi-cube</v-icon>
                        <v-icon size="x-small" color="green-darken-2">mdi-cube</v-icon>
                        <v-icon size="x-small" color="blue-darken-2">mdi-cube</v-icon>
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
                        <v-icon size="x-small" color="yellow-darken-2">mdi-cube</v-icon>
                        <v-icon size="x-small" color="red-darken-2">mdi-cube</v-icon>
                        <v-icon size="x-small" color="green-darken-2">mdi-cube</v-icon>
                        <v-icon size="x-small" color="blue-darken-2">mdi-cube</v-icon>
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
                      v-for="(value, key) in localState.resources" 
                      :key="key" 
                      no-gutters 
                      class="mb-2"
                    >
                      <v-col cols="12">
                        <div class="d-flex align-items-center">
                          <span class="text-body-2 mr-3" style="min-width: 150px">
                            {{ t(key) }}
                          </span>
                          <v-text-field
                            v-model.number="localState.resources[key]"
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

  <v-row no-gutters class="pt-6 pb-6">
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
import { ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import HeroSavePut from "@/components/HeroSavePut.vue";
import { HeroStore } from "@/store/HeroStore";
import { HeroDataRepository } from "@/data/repository/HeroDataRepository";
import type { HeroData } from "@/data/repository/HeroData";
import { SequentialAdventureState } from "@/store/Hero";

const route = useRoute();
const router = useRouter();
const { t } = useI18n();
const heroSavePutRef = ref();

const heroId = route.params.heroId.toString();
const campaignId = route.params.campaignId.toString();

const heroStore = HeroStore();
const heroDataRepository = new HeroDataRepository();
const hero = heroDataRepository.find(heroId) ?? ({} as HeroData);
const campaignHero = heroStore.findInCampaign(heroId, campaignId);

// Inicializa o estado sequencial se não existir
if (!campaignHero.sequentialAdventureState) {
  campaignHero.sequentialAdventureState = new SequentialAdventureState();
}

// Estado local para edição
const localState = ref({
  lifepoints: campaignHero.sequentialAdventureState.lifepoints,
  curseCubes: campaignHero.sequentialAdventureState.curseCubes,
  traumaCubes: campaignHero.sequentialAdventureState.traumaCubes,
  availableCubes: campaignHero.sequentialAdventureState.availableCubes,
  usedCubes: campaignHero.sequentialAdventureState.usedCubes,
  resources: { ...campaignHero.sequentialAdventureState.resources },
});

// Snackbar
const snackbarVisible = ref(false);
const snackbarText = ref("");
const snackbarColor = ref("success");
const snackbarTimeout = ref(3000);

// Watchers para atualizar o store em tempo real
watch(
  () => localState.value.lifepoints,
  (newVal) => {
    campaignHero.sequentialAdventureState!.lifepoints = Number(newVal) || 0;
  }
);

watch(
  () => localState.value.curseCubes,
  (newVal) => {
    campaignHero.sequentialAdventureState!.curseCubes = Number(newVal) || 0;
  }
);

watch(
  () => localState.value.traumaCubes,
  (newVal) => {
    campaignHero.sequentialAdventureState!.traumaCubes = Number(newVal) || 0;
  }
);

watch(
  () => localState.value.availableCubes,
  (newVal) => {
    campaignHero.sequentialAdventureState!.availableCubes = Number(newVal) || 0;
  }
);

watch(
  () => localState.value.usedCubes,
  (newVal) => {
    campaignHero.sequentialAdventureState!.usedCubes = Number(newVal) || 0;
  }
);

watch(
  () => localState.value.resources,
  (newVal) => {
    campaignHero.sequentialAdventureState!.resources = { ...newVal };
  },
  { deep: true }
);

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
          const stepStr = localStorage.getItem(getInstructionStepKey(state.tab));
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
};

const onSaveFail = () => {
  snackbarText.value = "Failed to save resources.";
  snackbarColor.value = "error";
  snackbarVisible.value = true;
};

function saveAndGoBack() {
  const instructionState = getInstructionState();

  if (heroSavePutRef.value && heroSavePutRef.value.save) {
    heroSavePutRef.value.save().then(() => {
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
    });
  } else {
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
}
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