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
        class="hero-list-item rounded-t-xl"
      >
        <v-img :src="hero?.images?.trackerInfo" class="rounded-0" contain />

        <v-card-text>
          <v-row no-gutters class="px-6">
            <v-col cols="12" class="py-4">
              <v-number-input
                v-model="localState.lifepoints"
                :label="t('label.lifepoints', 'Life Points')"
                :min="0"
                :max="99"
                variant="outlined"
                controlVariant="split"
              >
                <template #prepend-inner>
                  <v-icon color="red-lighten-2">mdi-heart</v-icon>
                </template>
              </v-number-input>
            </v-col>

            <v-col cols="12" class="py-3">
              <v-number-input
                v-model="localState.curseCubes"
                :label="t('text.curse-cubes')"
                :min="0"
                :max="5"
                variant="outlined"
                controlVariant="split"
              >
                <template #prepend-inner>
                  <v-icon color="grey-darken-1">mdi-cube</v-icon>
                </template>
              </v-number-input>
            </v-col>

            <v-col cols="12" class="py-3">
              <v-number-input
                v-model="localState.traumaCubes"
                :label="t('text.trauma-cubes')"
                :min="0"
                :max="1"
                variant="outlined"
                controlVariant="split"
              >
                <template #prepend-inner>
                  <v-icon color="purple-lighten-2">mdi-cube</v-icon>
                </template>
              </v-number-input>
            </v-col>

            <v-col cols="12" class="py-3">
              <v-number-input
                v-model="localState.availableCubes"
                label="Available Cubes"
                :min="0"
                :max="20"
                variant="outlined"
                controlVariant="split"
              >
                <template #prepend-inner>
                  <div class="d-flex align-center mr-2">
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
                </template>
              </v-number-input>
            </v-col>

            <v-col cols="12" class="py-3">
              <v-number-input
                v-model="localState.usedCubes"
                label="Used Cubes"
                :min="0"
                :max="20"
                variant="outlined"
                controlVariant="split"
              >
                <template #prepend-inner>
                  <div class="faded-cubes d-flex align-center mr-2">
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
                </template>
              </v-number-input>
            </v-col>

            <v-col cols="12"><v-divider class="my-4" /></v-col>
            <v-col cols="12" class="pb-4 text-center text-h5">
              {{ t("label.resources") }}
            </v-col>

            <v-col
              cols="12"
              v-for="resource in RESOURCE_DEFINITIONS"
              :key="resource.id"
            >
              <v-number-input
                v-model="localState.resources[resource.id]"
                :label="t(resource.translation_key)"
                :min="0"
                :max="4"
                variant="outlined"
                controlVariant="split"
                class="mb-4"
              />
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>

  <v-row v-if="isLoaded" no-gutters class="pt-6">
    <v-col cols="12" class="d-flex justify-center pb-4">
      <v-btn variant="elevated" color="primary" @click="saveAndGoBack">
        {{ t("Save Changes") }}
      </v-btn>
    </v-col>
  </v-row>

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
import { CampaignStore } from "@/store/CampaignStore";
import { SequentialAdventureState, RESOURCE_DEFINITIONS } from "@/store/Hero";
import { HeroDataRepository } from "@/data/repository/HeroDataRepository";
import type { HeroData } from "@/data/repository/HeroData";
import { CampaignLoadFromStorage } from "@/utils/CampaignLoadFromStorage";
import HeroSavePut from "@/components/HeroSavePut.vue";

const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const campaignStore = CampaignStore();
const heroDataRepository = new HeroDataRepository();

const heroSavePutRef = ref();

const heroId = route.params.heroId.toString();
const campaignId = route.params.campaignId.toString();

const isLoaded = ref(false);

const hero = ref<HeroData | null>(null);
const campaignHeroRef = ref<any>(null);

const snackbarVisible = ref(false);
const snackbarText = ref("");
const snackbarColor = ref("success");
const snackbarTimeout = ref(3000);

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
  router.push({
    name: "Campaign",
    params: { id: campaignId },
    query: { instructions: "open", tab: "save" },
  });
}

function syncStateToStore() {
  if (campaignHeroRef.value) {
    if (!campaignHeroRef.value.sequentialAdventureState) {
      campaignHeroRef.value.sequentialAdventureState =
        new SequentialAdventureState();
    }
  });

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

    const updatedHero = campaignStore.findHeroOptional(campaignId, heroId);

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

      campaignStore.findAllHeroes(campaignId);

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
.faded-cubes {
  opacity: 0.5;
  filter: grayscale(50%);
}
</style>
