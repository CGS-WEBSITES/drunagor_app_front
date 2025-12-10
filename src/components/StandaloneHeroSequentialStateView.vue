<template>
  <v-row no-gutters class="pt-6">
    <v-col cols="12" class="d-flex justify-center pb-4">
      <v-btn
        variant="elevated"
        color="primary"
        @click="saveAndGoBack"
        :disabled="!isLoaded"
        :loading="isSaving"
      >
        {{ t("Save Changes") }}
      </v-btn>
    </v-col>
  </v-row>

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
        <v-img
          v-if="heroStaticData?.images?.trackerInfo"
          :src="heroStaticData.images.trackerInfo"
          class="rounded-0"
          contain
        />

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
import { usePlayableHeroStore } from "@/store/PlayableHeroStore";
import { useUserStore } from "@/store/UserStore";
import { SequentialAdventureState, RESOURCE_DEFINITIONS } from "@/store/Hero";
import { HeroDataRepository } from "@/data/repository/HeroDataRepository";
import type { HeroData } from "@/data/repository/HeroData";

const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const playableHeroStore = usePlayableHeroStore();
const userStore = useUserStore();
const heroDataRepository = new HeroDataRepository();

const heroIdParam = route.params.heroId.toString();
const playableHeroesPk = parseInt(heroIdParam, 10);

const isLoaded = ref(false);
const isSaving = ref(false);
const heroStaticData = ref<HeroData | null>(null);

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

function showSnackbar(text: string, color: string = "success") {
  snackbarText.value = text;
  snackbarColor.value = color;
  snackbarVisible.value = true;
}

function navigateBack() {
  router.push({ name: "HeroesManager" });
}

function syncStateToStore() {
  const heroView = playableHeroStore.findByPk(playableHeroesPk);
  if (!heroView) return;

  if (!heroView.state.sequentialAdventureState) {
    heroView.state.sequentialAdventureState = new SequentialAdventureState();
  }

  heroView.state.sequentialAdventureState.lifepoints =
    Number(localState.value.lifepoints) || 0;
  heroView.state.sequentialAdventureState.curseCubes =
    Number(localState.value.curseCubes) || 0;
  heroView.state.sequentialAdventureState.traumaCubes =
    Number(localState.value.traumaCubes) || 0;
  heroView.state.sequentialAdventureState.availableCubes =
    Number(localState.value.availableCubes) || 0;
  heroView.state.sequentialAdventureState.usedCubes =
    Number(localState.value.usedCubes) || 0;

  Object.keys(localState.value.resources).forEach((key) => {
    heroView.state.sequentialAdventureState!.resources[key] =
      Number(localState.value.resources[key]) || 0;
  });
}

async function saveAndGoBack() {
  syncStateToStore();
  isSaving.value = true;

  try {
    await playableHeroStore.saveHero(playableHeroesPk);
    showSnackbar("Resources saved successfully!");
    setTimeout(() => navigateBack(), 1000);
  } catch (error: any) {
    console.error("Error saving:", error);
    showSnackbar(
      error?.response?.data?.message || "Failed to save resources.",
      "error",
    );
  } finally {
    isSaving.value = false;
  }
}

onMounted(async () => {
  try {
    if (!playableHeroStore.loaded) {
      await playableHeroStore.fetchHeroes(userStore.user.users_pk);
    }

    const heroView = playableHeroStore.findByPk(playableHeroesPk);

    if (heroView) {
      heroStaticData.value = heroView.staticData;

      if (!heroView.state.sequentialAdventureState) {
        heroView.state.sequentialAdventureState = new SequentialAdventureState();
      }

      if (!heroView.state.sequentialAdventureState.resources) {
        heroView.state.sequentialAdventureState.resources = {};
      }

      RESOURCE_DEFINITIONS.forEach((resource) => {
        if (
          heroView.state.sequentialAdventureState!.resources[resource.id] ===
          undefined
        ) {
          heroView.state.sequentialAdventureState!.resources[resource.id] = 0;
        }
      });

      localState.value = {
        lifepoints: heroView.state.sequentialAdventureState.lifepoints || 0,
        curseCubes: heroView.state.sequentialAdventureState.curseCubes || 0,
        traumaCubes: heroView.state.sequentialAdventureState.traumaCubes || 0,
        availableCubes:
          heroView.state.sequentialAdventureState.availableCubes || 0,
        usedCubes: heroView.state.sequentialAdventureState.usedCubes || 0,
        resources: { ...heroView.state.sequentialAdventureState.resources },
      };
    } else {
      console.error(`Hero with pk ${playableHeroesPk} not found`);
      showSnackbar("Hero not found.", "error");
    }
  } catch (error) {
    console.error("Error loading hero data:", error);
    showSnackbar("Error loading hero data.", "error");
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