<template>
  <v-row no-gutters class="pt-6">
    <v-col cols="12" class="d-flex justify-center pb-4">
      <v-btn variant="elevated" color="primary" @click="saveAndGoBack">
        {{ t("Save Changes") }}
      </v-btn>
    </v-col>
  </v-row>

  <CampaignSavePut
    ref="savePutRef"
    :campaign-id="campaignId"
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
        class="hero-list-item rounded-t-xl"
      >
        <v-img :src="hero.images?.trackerInfo" class="rounded-0" contain />

        <v-card-text>
          <v-row no-gutters class="px-6">
            <v-col cols="12" class="py-4">
              <v-number-input
                :model-value="sequentialAdventureState.lifepoints"
                @update:model-value="
                  (val) => (sequentialAdventureState.lifepoints = val)
                "
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
                :model-value="sequentialAdventureState.curseCubes"
                @update:model-value="
                  (val) => (sequentialAdventureState.curseCubes = val)
                "
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
                :model-value="sequentialAdventureState.traumaCubes"
                @update:model-value="
                  (val) => (sequentialAdventureState.traumaCubes = val)
                "
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
                :model-value="sequentialAdventureState.availableCubes"
                @update:model-value="
                  (val) => (sequentialAdventureState.availableCubes = val)
                "
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
                :model-value="sequentialAdventureState.usedCubes"
                @update:model-value="
                  (val) => (sequentialAdventureState.usedCubes = val)
                "
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
                :model-value="sequentialAdventureState.resources[resource.id]"
                @update:model-value="
                  (val) =>
                    (sequentialAdventureState.resources[resource.id] = val)
                "
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

  <v-row no-gutters class="pt-6">
    <v-col cols="12" class="d-flex justify-center pb-4">
      <v-btn
        variant="elevated"
        color="primary"
        @click="saveAndGoBack"
        :loading="isSaving"
      >
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
import { HeroStore } from "@/store/HeroStore";
import { SequentialAdventureState } from "@/store/Hero";
import { HeroDataRepository } from "@/data/repository/HeroDataRepository";
import type { HeroData } from "@/data/repository/HeroData";
import { CampaignLoadFromStorage } from "@/utils/CampaignLoadFromStorage";
import HeroSavePut from "@/components/HeroSavePut.vue";

const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const heroStore = HeroStore();
const heroDataRepository = new HeroDataRepository();

const savePutRef = ref();

const heroId = route.params.heroId.toString();
const campaignId = route.params.campaignId.toString();

const snackbarVisible = ref(false);
const snackbarText = ref("");
const snackbarColor = ref("success");
const snackbarTimeout = ref(3000);

const hero = computed<HeroData>(
  () => heroDataRepository.find(heroId) ?? ({} as HeroData),
);

const sequentialAdventureState = ref<SequentialAdventureState>(
  initSequentialAdventureState(),
);


function initSequentialAdventureState(): SequentialAdventureState {
  const campaignHero = heroStore.findInCampaign(heroId, campaignId);

  if (!campaignHero) {
    console.warn(`Hero ${heroId} not found in campaign ${campaignId}`);
    return createDefaultState();
  }

  if (!campaignHero.sequentialAdventureState) {
    campaignHero.sequentialAdventureState = createDefaultState();
  }

  const currentState = campaignHero.sequentialAdventureState;

  if (!currentState.resources) {
    currentState.resources = {};
  }

  if (currentState.lifepoints === undefined) {
    currentState.lifepoints = 0;
  }

  if (currentState.curseCubes === undefined) {
    currentState.curseCubes = 0;
  }

  if (currentState.traumaCubes === undefined) {
    currentState.traumaCubes = 0;
  }

  if (currentState.availableCubes === undefined) {
    currentState.availableCubes = 0;
  }

  if (currentState.usedCubes === undefined) {
    currentState.usedCubes = 0;
  }

  RESOURCE_DEFINITIONS.forEach((resource) => {
    if (currentState.resources[resource.id] === undefined) {
      currentState.resources[resource.id] = 0;
    }
  };

  if (!state.resources) {
    state.resources = {};
  }

  RESOURCE_DEFINITIONS.forEach((resource) => {
    state.resources[resource.id] = 0;
  });

  return state;
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
  if (savePutRef.value && savePutRef.value.save) {
    savePutRef.value.save().then(() => {
      router.push({
        name: "Campaign",
        params: { id: campaignId },
        query: { instructions: "open", tab: "save" },
      });
    });
  } else {
    router.push({
      name: "Campaign",
      params: { id: campaignId },
      query: { instructions: "open", tab: "save" },
    });
  }
}

watch(
  sequentialAdventureState,
  (newState) => {
    const campaignHero = heroStore.findInCampaign(heroId, campaignId);
    if (campaignHero) {
      campaignHero.sequentialAdventureState = newState;
    }
  },
  { deep: true },
);

onMounted(() => {
  const loader = new CampaignLoadFromStorage();
  loader.loadCampaignComplete(campaignId);

  const updatedHero = heroStore.findInCampaign(heroId, campaignId);

  if (updatedHero && updatedHero.sequentialAdventureState) {
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

    sequentialAdventureState.value = updatedHero.sequentialAdventureState;
  } else {
    console.log(
      `No sequential adventure state found for hero ${heroId}, using defaults`,
    );
  }
});
</script>

<style scoped>
.faded-cubes {
  opacity: 0.5;
  filter: grayscale(50%);
}
</style>
