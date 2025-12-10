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

        <v-card-actions>
          <v-row no-gutters class="px-6">
            <v-col cols="12">
              <v-divider></v-divider>

              <div class="text-center text-h5">
                {{ t("label.equipment") }}
              </div>
              <StandaloneHeroItems
                v-if="repository && heroStaticData"
                :playable-heroes-pk="playableHeroesPk"
                :repository="repository"
                :hero="heroStaticData"
                @stash="onStash"
              />
            </v-col>
            <v-col cols="12">
              <v-divider></v-divider>

              <div class="text-center text-h5">
                {{ t("label.stash") }}
              </div>
              <StandaloneHeroStash
                v-if="repository"
                :playable-heroes-pk="playableHeroesPk"
                :repository="repository"
                :key="stash"
                class="px-2"
              />
            </v-col>
            <v-col cols="12">
              <v-divider></v-divider>

              <div class="text-center text-h5">
                {{ t("label.skills") }}
              </div>
              <StandaloneHeroSkills
                v-if="heroStaticData"
                :playable-heroes-pk="playableHeroesPk"
                :hero="heroStaticData"
              />
            </v-col>
            <v-col cols="12">
              <v-divider></v-divider>
              <div class="text-center text-h5 pt-4 pb-2">
                {{ t("label.class-abilities", "Class Abilities") }}
              </div>
              <div
                class="d-flex flex-wrap justify-center align-center pa-2 mb-2"
                style="gap: 8px"
              >
                <v-chip
                  v-for="n in 8"
                  :key="n"
                  @click="setAbilityCount(n)"
                  :variant="
                    n <= localClassAbilityCount ? 'elevated' : 'outlined'
                  "
                  :color="
                    n <= localClassAbilityCount ? 'amber-darken-2' : 'default'
                  "
                  size="large"
                  style="cursor: pointer"
                >
                  <v-icon
                    :icon="
                      n <= localClassAbilityCount
                        ? 'mdi-star-circle'
                        : 'mdi-circle-outline'
                    "
                  ></v-icon>
                </v-chip>
              </div>
            </v-col>
          </v-row>
        </v-card-actions>
      </v-card>
    </v-col>
  </v-row>

  <v-row v-if="isLoaded" no-gutters class="pt-6">
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
import { HeroDataRepository } from "@/data/repository/HeroDataRepository";
import type { HeroData } from "@/data/repository/HeroData";
import { CoreItemDataRepository } from "@/data/repository/campaign/core/CoreItemDataRepository";
import type { ItemDataRepository } from "@/data/repository/ItemDataRepository";
import StandaloneHeroItems from "@/components/StandaloneHeroItems.vue";
import StandaloneHeroStash from "@/components/StandaloneHeroStash.vue";
import StandaloneHeroSkills from "@/components/StandaloneHeroSkills.vue";

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
const repository = ref<ItemDataRepository | null>(null);

const localClassAbilityCount = ref(0);
const stash = ref(0);

const snackbarVisible = ref(false);
const snackbarText = ref("");
const snackbarColor = ref("success");
const snackbarTimeout = ref(3000);

function showSnackbar(text: string, color: string = "success") {
  snackbarText.value = text;
  snackbarColor.value = color;
  snackbarVisible.value = true;
}

function setAbilityCount(count: number) {
  if (localClassAbilityCount.value === count) {
    localClassAbilityCount.value = count - 1;
  } else {
    localClassAbilityCount.value = count;
  }
}

function onStash() {
  stash.value += 1;
}

function navigateBack() {
  router.push({ name: "HeroesManager" });
}

function syncStateToStore() {
  const heroView = playableHeroStore.findByPk(playableHeroesPk);
  if (heroView) {
    heroView.state.classAbilityCount = Number(localClassAbilityCount.value) || 0;
  }
}

async function saveAndGoBack() {
  syncStateToStore();
  isSaving.value = true;

  try {
    await playableHeroStore.saveHero(playableHeroesPk);
    showSnackbar("Equipment and skills saved successfully!");
    setTimeout(() => navigateBack(), 1000);
  } catch (error: any) {
    console.error("Error saving:", error);
    showSnackbar(
      error?.response?.data?.message || "Failed to save equipment and skills.",
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

      repository.value = new CoreItemDataRepository();

      if (!heroView.state.equipment) {
        heroView.state.equipment = {
          weaponId: "",
          offHandId: "",
          armorId: "",
          trinketId: "",
          bagOneId: "",
          bagTwoId: "",
        };
      }
      if (!heroView.state.stashedCardIds) {
        heroView.state.stashedCardIds = [];
      }
      if (!heroView.state.skillIds) {
        heroView.state.skillIds = [];
      }
      if (typeof heroView.state.classAbilityCount === "undefined") {
        heroView.state.classAbilityCount = 0;
      }

      localClassAbilityCount.value = heroView.state.classAbilityCount || 0;
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
#hero-card {
  background-image: url("@/assets/hero/flag-bg-red.webp");
  background-repeat: no-repeat;
}
</style>