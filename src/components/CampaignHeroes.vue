<template>
  <div class="campaign-heroes">
    <v-container fluid class="pa-0 mx-auto" style="max-width: 1024px">
      
      <v-row class="mb-4 pt-4 px-4" align="center" no-gutters>
        <v-col cols="4" class="d-flex justify-start">
           <v-btn
            variant="text"
            color="white"
            prepend-icon="mdi-arrow-left"
            @click="router.back()"
            class="d-none d-sm-flex" 
          >
            {{ t('label.back') || 'Back' }}
          </v-btn>
        </v-col>

        <v-col cols="4" class="d-flex justify-center">
        </v-col>

        <v-col cols="4" class="d-flex justify-end">
          <v-btn variant="elevated" rounded color="primary" @click="openAddHeroDialog">
            <v-icon start>mdi-plus</v-icon>
            {{ t("label.add-hero") || "Add Hero" }}
          </v-btn>
        </v-col>
      </v-row>

      <v-row no-gutters class="px-2">
        <v-col cols="12">
          <v-alert
            v-if="playableHeroStore.error"
            type="error"
            variant="tonal"
            class="mb-4 mx-2"
            border="start"
          >
            {{ playableHeroStore.error }}
          </v-alert>

          <div v-if="playableHeroStore.loading" class="text-center py-8">
            <v-progress-circular indeterminate color="primary" />
          </div>

          <div v-else>
            <div v-if="!playableHeroStore.hasHeroes" class="text-center pa-4 text-white">
              {{
                t("No heroes found for this user.") ||
                "You don't have any heroes yet."
              }}
            </div>

            <div
              v-for="hero in playableHeroStore.heroes"
              :key="hero.pk"
              class="mb-2"
            >
              <StandaloneHeroLog
                :playable-heroes-pk="hero.pk"
                @remove="handleRemoveHero(hero)"
              />
            </div>
          </div>
        </v-col>
      </v-row>
    </v-container>

    <v-dialog v-model="addHeroDialogVisible" max-width="500">
      <v-card>
        <v-card-title class="text-center">
          {{ t("label.add-hero") || "Add Hero" }}
        </v-card-title>
        <v-card-text>
          <v-list lines="one">
            <v-list-item @click="addRandomHero">
              <v-img :src="RandomImage" />
            </v-list-item>

            <v-list-item
              v-for="heroData in availableHeroes"
              :key="heroData.id"
              @click="addHero(heroData.id)"
            >
              <v-img :src="heroData.images.trackerimage" />
            </v-list-item>
          </v-list>
        </v-card-text>
      </v-card>
    </v-dialog>

    <v-snackbar
      v-model="snackbarVisible"
      :timeout="snackbarTimeout"
      :color="snackbarColor"
      location="top"
    >
      {{ snackbarText }}
    </v-snackbar>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import {
  usePlayableHeroStore,
  type PlayableHeroView,
} from "@/store/PlayableHeroStore";
import { useUserStore } from "@/store/UserStore";
import { HeroDataRepository } from "@/data/repository/HeroDataRepository";
import type { HeroData } from "@/data/repository/HeroData";
import { RandomizeHero } from "@/service/RandomizeHero";
import RandomImage from "@/assets/hero/trackerimage/RandomAvatar.png";
import StandaloneHeroLog from "@/components/StandaloneHeroLog.vue";

const { t } = useI18n();
const router = useRouter();
const playableHeroStore = usePlayableHeroStore();
const userStore = useUserStore();
const heroDataRepository = new HeroDataRepository();
const addHeroDialogVisible = ref(false);
const snackbarVisible = ref(false);
const snackbarText = ref("");
const snackbarColor = ref("success");
const snackbarTimeout = ref(3000);

const availableHeroes = computed(() => {
  const allHeroes = heroDataRepository.findAll();
  const existingHeroIds = playableHeroStore.heroes.map((h) => h.heroId);
  return allHeroes.filter(
    (hero: HeroData) => !existingHeroIds.includes(hero.id),
  );
});

function showSnackbar(text: string, color: string = "success") {
  snackbarText.value = text;
  snackbarColor.value = color;
  snackbarVisible.value = true;
}

function openAddHeroDialog() {
  addHeroDialogVisible.value = true;
}

async function addHero(heroId: string) {
  try {
    await playableHeroStore.createHero(heroId, userStore.user.users_pk);
    showSnackbar(t("Hero added successfully!") || "Hero added successfully!");
    addHeroDialogVisible.value = false;
  } catch (e: any) {
    console.error("[CampaignHeroes] Error adding hero:", e);
    showSnackbar(
      e?.response?.data?.message || t("Failed to add hero."),
      "error",
    );
  }
}

async function addRandomHero() {
  const existingHeroIds = playableHeroStore.heroes.map((h) => h.heroId);
  const randomHero = new RandomizeHero().randomize(
    existingHeroIds,
    availableHeroes.value,
  );

  if (!randomHero) {
    showSnackbar(t("No random hero available."), "warning");
    return;
  }

  await addHero(randomHero.id);
}

async function handleRemoveHero(hero: PlayableHeroView) {
  const confirmed = window.confirm(
    t("Are you sure you want to delete this hero?") || "Delete hero?",
  );
  if (!confirmed) return;

  try {
    await playableHeroStore.deleteHero(hero.pk);
    showSnackbar(t("Hero removed successfully!"));
  } catch (e: any) {
    console.error("[CampaignHeroes] Error deleting hero:", e);
    showSnackbar(e?.response?.data?.message || t("Failed to remove hero."), "error");
  }
}

onMounted(async () => {
    await playableHeroStore.fetchHeroes(userStore.user.users_pk);
});
</script>

<style scoped>
.campaign-heroes {
  width: 100%;
}
.cinzel-text {
  font-family: "Cinzel", serif;
}
</style>