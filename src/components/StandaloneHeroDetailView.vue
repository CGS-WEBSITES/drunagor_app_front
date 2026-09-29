<template>
  <div class="sheet-page">
    <!-- Top bar -->
    <div class="sheet-bar">
      <v-btn variant="text" prepend-icon="mdi-arrow-left" @click="router.push({ name: 'HeroesManager' } as any)">My heroes</v-btn>
      <v-spacer />
      <v-btn v-if="heroView" variant="text" color="error" class="sheet-remove" prepend-icon="mdi-delete-outline" @click="removeDialog = true">
        Remove
      </v-btn>
      <v-btn
        color="accent"
        variant="flat"
        :prepend-icon="dirty ? 'mdi-content-save' : 'mdi-check'"
        :loading="isSaving"
        :disabled="!heroView"
        @click="save"
      >
        {{ dirty ? "Save changes" : "Saved" }}
      </v-btn>
    </div>

    <div v-if="!isLoaded" class="text-center py-16">
      <v-progress-circular indeterminate color="primary" size="56" />
    </div>

    <p v-else-if="!heroView || !heroData" class="text-center py-16">Hero not found.</p>

    <template v-else>
      <!-- Banner: the hero's art with name, race, class and path. -->
      <header class="sheet-banner">
        <img :src="(heroData.images as any).trackerInfo || heroData.images.avatar" :alt="heroData.name" class="sheet-banner__img" />
        <span class="sheet-banner__box">
          <img v-if="CONTENT_LOGOS[heroData.content]" :src="CONTENT_LOGOS[heroData.content]" alt="" />
          {{ CONTENT_LABELS[heroData.content] }}
        </span>
      </header>

      <div class="sheet-grid">
        <!-- Vitals -->
        <section class="sheet-card">
          <h3 class="sheet-title">Vitals</h3>
          <StatStepper v-model="adventure.lifepoints" label="Life points" icon="mdi-heart" icon-color="#e05353" class="mb-4" />

          <div class="sheet-subtitle">Cubes</div>
          <div class="sheet-pairs">
            <StatStepper v-model="adventure.availableCubes" label="Available" icon="mdi-cube-outline" />
            <StatStepper v-model="adventure.usedCubes" label="Used" icon="mdi-cube-off-outline" />
            <StatStepper v-model="adventure.curseCubes" label="Curse" icon="mdi-cube" icon-color="#9c6ade" />
            <StatStepper v-model="adventure.traumaCubes" label="Trauma" icon="mdi-cube" icon-color="#9e9e9e" />
          </div>

          <div class="sheet-subtitle">Class abilities</div>
          <div class="sheet-abilities">
            <button
              v-for="n in 8"
              :key="n"
              class="sheet-ability"
              :class="{ on: n <= heroView.state.classAbilityCount }"
              :aria-label="`${n} class abilities`"
              @click="heroView.state.classAbilityCount = heroView.state.classAbilityCount === n ? n - 1 : n"
            >
              <v-icon size="20">{{ n <= heroView.state.classAbilityCount ? "mdi-star-circle" : "mdi-circle-outline" }}</v-icon>
            </button>
          </div>

          <div class="sheet-subtitle">Resources</div>
          <div class="sheet-pairs">
            <StatStepper
              v-for="resource in RESOURCE_DEFINITIONS"
              :key="resource.id"
              v-model="adventure.resources[resource.id]"
              :label="resource.name || t(resource.translation_key)"
            />
          </div>
        </section>

        <!-- Equipment and stash -->
        <section class="sheet-card">
          <HeroSheetEquipment :state="heroView.state" :hero="heroData" />
        </section>

        <!-- Skills -->
        <section class="sheet-card">
          <HeroSheetSkills :state="heroView.state" />
        </section>
      </div>
    </template>

    <v-dialog v-model="removeDialog" max-width="400">
      <v-card color="#2b2b2b" class="pa-5">
        <h3 class="sheet-title mb-2">Remove {{ heroData?.name }}?</h3>
        <p class="text-body-2 mb-4">Their equipment, skills and resources will be lost.</p>
        <div class="d-flex justify-end ga-2">
          <v-btn variant="text" @click="removeDialog = false">Cancel</v-btn>
          <v-btn color="error" variant="flat" :loading="removing" @click="removeHero">Remove</v-btn>
        </div>
      </v-card>
    </v-dialog>

    <v-snackbar v-model="snackbarVisible" :timeout="2500" :color="snackbarColor" location="top">
      {{ snackbarText }}
    </v-snackbar>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { usePlayableHeroStore } from "@/store/PlayableHeroStore";
import { useUserStore } from "@/store/UserStore";
import { HeroEquipment, RESOURCE_DEFINITIONS, SequentialAdventureState } from "@/store/Hero";
import { CONTENT_LABELS, CONTENT_LOGOS } from "@/data/heroMeta";
import StatStepper from "@/components/hero-sheet/StatStepper.vue";
import HeroSheetEquipment from "@/components/hero-sheet/HeroSheetEquipment.vue";
import HeroSheetSkills from "@/components/hero-sheet/HeroSheetSkills.vue";

const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const playableHeroStore = usePlayableHeroStore();
const userStore = useUserStore();

const playableHeroesPk = parseInt(String((route.params as any).heroId), 10);

const isLoaded = ref(false);
const isSaving = ref(false);
const dirty = ref(false);
const removeDialog = ref(false);
const removing = ref(false);

const heroView = computed(() => playableHeroStore.findByPk(playableHeroesPk));
const heroData = computed(() => heroView.value?.staticData ?? null);
const adventure = computed(() => heroView.value!.state.sequentialAdventureState!);

const snackbarVisible = ref(false);
const snackbarText = ref("");
const snackbarColor = ref("success");
function showSnackbar(text: string, color = "success") {
  snackbarText.value = text;
  snackbarColor.value = color;
  snackbarVisible.value = true;
}

// Older saves may miss some fields.
function fillDefaults() {
  const state = heroView.value?.state;
  if (!state) return;
  if (!state.equipment) state.equipment = new HeroEquipment();
  if (!state.stashedCardIds) state.stashedCardIds = [];
  if (!state.skillIds) state.skillIds = [];
  if (typeof state.classAbilityCount !== "number") state.classAbilityCount = 0;
  if (!state.dungeonRoleSkillCubeColors) state.dungeonRoleSkillCubeColors = { rankOne: null, rankTwo: null };
  if (!state.sequentialAdventureState) state.sequentialAdventureState = new SequentialAdventureState();
  const adventureState = state.sequentialAdventureState;
  if (!adventureState.resources) adventureState.resources = {};
  for (const resource of RESOURCE_DEFINITIONS) {
    if (typeof adventureState.resources[resource.id] !== "number") adventureState.resources[resource.id] = 0;
  }
  for (const key of ["lifepoints", "availableCubes", "usedCubes", "curseCubes", "traumaCubes"] as const) {
    if (typeof adventureState[key] !== "number") adventureState[key] = Number(adventureState[key]) || 0;
  }
}

async function save() {
  isSaving.value = true;
  try {
    await playableHeroStore.saveHero(playableHeroesPk);
    dirty.value = false;
    showSnackbar("Hero saved.");
  } catch (error: any) {
    console.error("Error saving hero:", error);
    showSnackbar(error?.response?.data?.message || "Failed to save the hero.", "error");
  } finally {
    isSaving.value = false;
  }
}

async function removeHero() {
  removing.value = true;
  try {
    await playableHeroStore.deleteHero(playableHeroesPk);
    router.push({ name: "HeroesManager" } as any);
  } catch (error: any) {
    showSnackbar(error?.response?.data?.message || "Failed to remove the hero.", "error");
  } finally {
    removing.value = false;
    removeDialog.value = false;
  }
}

onMounted(async () => {
  try {
    if (!playableHeroStore.loaded && userStore.user.users_pk) await playableHeroStore.fetchHeroes(userStore.user.users_pk);
    fillDefaults();
  } finally {
    isLoaded.value = true;
  }
  // Any change after loading needs saving.
  watch(() => heroView.value?.state, () => (dirty.value = true), { deep: true });
});
</script>

<style scoped>
.sheet-page {
  width: 100%;
  max-width: 1500px;
  margin: 0 auto;
  padding: 12px 24px 48px;
  font-family: "Poppins", sans-serif;
  color: #fff;
}
.sheet-bar {
  position: sticky;
  top: 48px;
  z-index: 5;
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0 -8px 12px;
  padding: 8px;
  background: rgba(20, 20, 20, 0.85);
  backdrop-filter: blur(6px);
  border-radius: 10px;
}
.sheet-remove {
  color: #ff8a80 !important;
}
.sheet-banner {
  position: relative;
  overflow: hidden;
  margin-bottom: 16px;
  border-radius: 14px;
  background: #3a3431;
}
.sheet-banner__img {
  display: block;
  width: 100%;
  max-height: 340px;
  object-fit: cover;
  /* Keep the name at the top; crop the art from the bottom. */
  object-position: center top;
}
.sheet-banner__box {
  position: absolute;
  bottom: 14px;
  left: 20px;
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px 4px 6px;
  background: rgba(0, 0, 0, 0.45);
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
}
.sheet-banner__box img {
  width: 22px;
  height: 22px;
  object-fit: contain;
}
.sheet-grid {
  display: grid;
  grid-template-columns: minmax(280px, 340px) 1fr 1fr;
  gap: 16px;
  align-items: start;
}
.sheet-card {
  padding: 18px;
  background: rgba(43, 43, 43, 0.92);
  border-radius: 12px;
}
.sheet-card :deep(.sheet-title-row) {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 12px;
}
.sheet-card :deep(.sheet-title) {
  font-size: 1.05rem;
  font-weight: 800;
  letter-spacing: 1px;
  text-transform: uppercase;
}
.sheet-card > .sheet-title {
  margin-bottom: 12px;
}
.sheet-subtitle {
  margin: 18px 0 8px;
  padding-top: 14px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  font-size: 0.8rem;
  font-weight: 800;
  text-transform: uppercase;
  opacity: 0.85;
}
.sheet-pairs {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}
.sheet-abilities {
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  gap: 4px;
}
.sheet-ability {
  display: flex;
  align-items: center;
  justify-content: center;
  aspect-ratio: 1;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.06);
  opacity: 0.6;
}
.sheet-ability.on {
  background: rgba(var(--v-theme-accent), 0.25);
  color: rgb(var(--v-theme-accent));
  opacity: 1;
}
@media (max-width: 1279px) {
  .sheet-grid {
    grid-template-columns: 1fr 1fr;
  }
  .sheet-grid > :first-child {
    grid-column: 1 / -1;
  }
}
@media (max-width: 767px) {
  .sheet-page {
    padding: 8px 12px 32px;
  }
  .sheet-bar {
    top: 56px;
    margin: 0 0 12px;
  }
  .sheet-remove :deep(.v-btn__content) {
    display: none;
  }
  .sheet-remove :deep(.v-btn__prepend) {
    margin: 0;
  }
  .sheet-grid {
    grid-template-columns: 1fr;
  }
  /* The whole art, uncropped, on small screens. */
  .sheet-banner__img {
    max-height: none;
  }
}
</style>
