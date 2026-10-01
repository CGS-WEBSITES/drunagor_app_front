<template>
  <div class="sheet-page">
    <div class="sheet-top">
      <v-btn variant="text" prepend-icon="mdi-arrow-left" @click="router.push({ name: 'HeroesManager' } as any)">My heroes</v-btn>
    </div>

    <div v-if="!isLoaded" class="text-center py-16">
      <v-progress-circular indeterminate color="primary" size="56" />
    </div>

    <p v-else-if="!heroView || !heroData" class="text-center py-16">Hero not found.</p>

    <template v-else>
      <!-- Banner: the hero art, whole. -->
      <header class="sheet-banner">
        <img :src="(heroData.images as any).trackerInfo || heroData.images.avatar" :alt="heroData.name" class="sheet-banner__img" />
        <!-- Box symbol and name, and whose hero this is. -->
        <div class="sheet-banner__meta">
          <span class="sheet-banner__box">
            <img v-if="CONTENT_SYMBOLS[heroData.content]" :src="CONTENT_SYMBOLS[heroData.content]" alt="" />
            {{ CONTENT_LABELS[heroData.content] }}
          </span>
          <span v-if="userStore.user?.user_name" class="sheet-banner__player">
            Player: <strong>{{ userStore.user.user_name }}</strong>
          </span>
        </div>
      </header>

      <div class="sheet-grid">
        <div class="sheet-stack">
        <!-- Resources: life, cubes, class abilities -->
        <SheetCard id="vitals">
          <h3 class="sheet-title">Resources</h3>
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

          <div class="sheet-subtitle">Class resources</div>
          <div class="sheet-pairs">
            <StatStepper
              v-for="resource in RESOURCE_DEFINITIONS"
              :key="resource.id"
              v-model="adventure.resources[resource.id]"
              :label="resource.name || t(resource.translation_key)"
            />
          </div>
        </SheetCard>

        <!-- Aura, status and outcome -->
        <SheetCard id="effects">
          <HeroSheetEffects :state="heroView.state" />
        </SheetCard>
        </div>

        <!-- Equipment and stash -->
        <SheetCard id="equipment">
          <HeroSheetEquipment :state="heroView.state" :hero="heroData" />
        </SheetCard>

        <!-- Skills -->
        <SheetCard id="skills">
          <HeroSheetSkills :state="heroView.state" />
        </SheetCard>
      </div>

      <!-- Removing lives at the end of the sheet, away from everyday actions. -->
      <div class="sheet-danger">
        <div>
          <strong>Remove {{ heroData.name }}</strong>
          <p>Takes the hero out of My heroes, with its equipment, skills and resources. Campaigns keep their own copy.</p>
        </div>
        <v-btn variant="tonal" color="error" prepend-icon="mdi-account-remove-outline" class="sheet-danger__btn" @click="removeDialog = true">
          Remove hero
        </v-btn>
      </div>
    </template>

    <!-- Shows up only when something changed. -->
    <v-slide-y-reverse-transition>
      <div v-if="dirty" class="sheet-savebar">
        <span><v-icon size="18" class="mr-2">mdi-pencil-circle</v-icon>You have unsaved changes</span>
        <v-btn variant="text" :disabled="isSaving" @click="discard">Discard</v-btn>
        <v-btn color="accent" variant="flat" prepend-icon="mdi-content-save" :loading="isSaving" @click="save">Save</v-btn>
      </div>
    </v-slide-y-reverse-transition>

    <v-dialog v-model="removeDialog" max-width="400">
      <v-card color="surface" class="pa-5">
        <h3 class="sheet-title mb-2">Remove {{ heroData?.name }}?</h3>
        <p class="text-body-2 mb-4">Their equipment, skills and resources will be lost. This can't be undone.</p>
        <div class="d-flex justify-end ga-2">
          <v-btn variant="text" @click="removeDialog = false">Cancel</v-btn>
          <v-btn color="error" variant="flat" :loading="removing" @click="removeHero">Remove hero</v-btn>
        </div>
      </v-card>
    </v-dialog>

    <v-dialog v-model="leaveDialog" max-width="400">
      <v-card color="surface" class="pa-5">
        <h3 class="sheet-title mb-2">Leave without saving?</h3>
        <p class="text-body-2 mb-4">Your changes to {{ heroData?.name }} will be lost.</p>
        <div class="d-flex justify-end ga-2">
          <v-btn variant="text" @click="leave(false)">Stay</v-btn>
          <v-btn variant="outlined" @click="leave(true)">Leave</v-btn>
          <v-btn color="accent" variant="flat" :loading="isSaving" @click="saveAndLeave">Save and leave</v-btn>
        </div>
      </v-card>
    </v-dialog>

    <v-snackbar v-model="snackbarVisible" :timeout="2500" :color="snackbarColor" location="top">
      {{ snackbarText }}
    </v-snackbar>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, ref, watch } from "vue";
import { onBeforeRouteLeave, useRoute, useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { usePlayableHeroStore } from "@/store/PlayableHeroStore";
import { useUserStore } from "@/store/UserStore";
import { HeroEquipment, RESOURCE_DEFINITIONS, SequentialAdventureState } from "@/store/Hero";
import { CONTENT_LABELS, CONTENT_SYMBOLS } from "@/data/heroMeta";
import HeroSheetEffects from "@/components/hero-sheet/HeroSheetEffects.vue";
import StatStepper from "@/components/hero-sheet/StatStepper.vue";
import SheetCard from "@/components/hero-sheet/SheetCard.vue";
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
    showSnackbar(`${heroData.value?.name ?? "Hero"} saved.`);
    return true;
  } catch (error: any) {
    console.error("Error saving hero:", error);
    showSnackbar(error?.response?.data?.message || "Failed to save the hero.", "error");
    return false;
  } finally {
    isSaving.value = false;
  }
}

// Reload the last saved version.
async function discard() {
  if (!userStore.user.users_pk) return;
  await playableHeroStore.fetchHeroes(userStore.user.users_pk);
  fillDefaults();
  await nextTick();
  dirty.value = false;
}

async function removeHero() {
  removing.value = true;
  try {
    await playableHeroStore.deleteHero(playableHeroesPk);
    dirty.value = false;
    router.push({ name: "HeroesManager" } as any);
  } catch (error: any) {
    showSnackbar(error?.response?.data?.message || "Failed to remove the hero.", "error");
  } finally {
    removing.value = false;
    removeDialog.value = false;
  }
}

// Ask before leaving with unsaved changes.
const leaveDialog = ref(false);
let pendingLeave: ((ok: boolean) => void) | null = null;
onBeforeRouteLeave(() => {
  if (!dirty.value) return true;
  leaveDialog.value = true;
  return new Promise<boolean>((resolve) => (pendingLeave = resolve));
});
async function leave(ok: boolean) {
  leaveDialog.value = false;
  if (ok) await discard();
  pendingLeave?.(ok);
  pendingLeave = null;
}
async function saveAndLeave() {
  if (await save()) {
    leaveDialog.value = false;
    pendingLeave?.(true);
    pendingLeave = null;
  }
}

onMounted(async () => {
  try {
    if (!playableHeroStore.loaded && userStore.user.users_pk) await playableHeroStore.fetchHeroes(userStore.user.users_pk);
    fillDefaults();
  } finally {
    isLoaded.value = true;
  }
  await nextTick();
  // Any change after loading needs saving.
  watch(() => heroView.value?.state, () => (dirty.value = true), { deep: true });
});
</script>

<style scoped>
.sheet-page {
  width: 100%;
  max-width: 1500px;
  margin: 0 auto;
  padding: 12px 24px 96px;
  font-family: "Poppins", sans-serif;
  color: #fff;
}
.sheet-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin: 0 -8px 8px;
}
.sheet-danger {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 12px 24px;
  margin-top: 24px;
  padding: 16px 18px;
  background: rgb(var(--v-theme-primary));
  border: 1px solid rgba(255, 138, 128, 0.25);
  border-radius: 12px;
}
.sheet-danger strong {
  font-size: 0.9rem;
  text-transform: uppercase;
}
.sheet-danger p {
  margin: 2px 0 0;
  font-size: 0.8rem;
  opacity: 0.65;
}
.sheet-danger__btn {
  color: #ff8a80 !important;
}

/* Banner: the hero art, never cropped. */
.sheet-banner {
  position: relative;
  margin-bottom: 16px;
  overflow: hidden;
  border-radius: 14px;
  background: #3a3431;
}
.sheet-banner__img {
  display: block;
  width: 100%;
  height: auto;
}
/* On wide screens the art would get too tall: cap it, keeping the name side. */
@media (min-width: 768px) {
  .sheet-banner__img {
    max-height: 300px;
    object-fit: cover;
    object-position: left top;
  }
}
/* Box and owner over the art, under the printed name. */
.sheet-banner__meta {
  position: absolute;
  bottom: 16px;
  left: 4.8%;
  display: flex;
  flex-direction: column;
  gap: 2px;
  color: #fff;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.7);
}
.sheet-banner__box {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.8rem;
  font-weight: 700;
  text-transform: uppercase;
}
.sheet-banner__box img {
  height: 18px;
  width: auto;
}
.sheet-banner__player {
  font-size: 0.85rem;
}
.sheet-banner__player strong {
  font-weight: 700;
}
.sheet-stack {
  display: flex;
  flex-direction: column;
  gap: 16px;
  min-width: 0;
}

.sheet-grid {
  display: grid;
  grid-template-columns: minmax(280px, 340px) minmax(0, 1fr) minmax(0, 1fr);
  gap: 16px;
  align-items: start;
}
.sheet-card {
  min-width: 0;
  padding: 18px;
  background: rgb(var(--v-theme-primary));
  border-radius: 12px;
}
.sheet-card :deep(.sheet-title-row) {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 12px;
}
.sheet-card :deep(.sheet-title),
.sheet-title {
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

/* Save bar */
.sheet-savebar {
  position: fixed;
  bottom: 20px;
  left: 50%;
  z-index: 20;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 8px 8px 18px;
  background: rgb(var(--v-theme-surface));
  border: 1px solid rgba(var(--v-theme-accent), 0.6);
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.6);
  font-size: 0.85rem;
  font-weight: 600;
  transform: translateX(-50%);
}
.sheet-savebar span {
  display: flex;
  align-items: center;
  margin-right: 8px;
  white-space: nowrap;
}
@media (max-width: 1279px) {
  .sheet-grid {
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  }
  .sheet-grid > :first-child {
    grid-column: 1 / -1;
  }
}
@media (max-width: 767px) {
  .sheet-page {
    padding: 8px 12px 96px;
  }
  .sheet-grid {
    grid-template-columns: minmax(0, 1fr);
  }
  .sheet-savebar {
    right: 12px;
    left: 12px;
    transform: none;
  }
  .sheet-savebar span {
    flex: 1;
    white-space: normal;
  }
}
</style>
