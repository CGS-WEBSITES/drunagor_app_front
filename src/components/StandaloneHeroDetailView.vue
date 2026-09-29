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
      <!-- Banner: class color, class symbol, the hero and who they are. -->
      <header class="sheet-banner" :style="{ background: style.bg, borderColor: style.stroke }">
        <img v-if="style.icon" :src="style.icon" alt="" class="sheet-banner__watermark" />
        <div class="sheet-banner__text">
          <h1>{{ heroData.name }}</h1>
          <p class="sheet-banner__class">{{ heroData.race }} | {{ heroClassLabel(heroData.class) }}</p>
          <p class="sheet-banner__path">Path of {{ heroData.path }}</p>
          <div class="sheet-banner__meta">
            <span><v-icon size="14" class="mr-1">mdi-package-variant-closed</v-icon>{{ CONTENT_LABELS[heroData.content] }}</span>
            <span v-if="userStore.user?.user_name">Player: <strong>{{ userStore.user.user_name }}</strong></span>
          </div>
        </div>
        <img :src="heroPortrait(heroData)" :alt="heroData.name" class="sheet-banner__portrait" />
        <v-menu location="bottom end">
          <template #activator="{ props: menuProps }">
            <v-btn v-bind="menuProps" icon="mdi-dots-vertical" variant="text" size="small" class="sheet-banner__menu" aria-label="Hero options" />
          </template>
          <v-list density="compact" bg-color="#2b2b2b">
            <v-list-item prepend-icon="mdi-delete-outline" base-color="error" title="Remove hero" @click="removeDialog = true" />
          </v-list>
        </v-menu>
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

    <!-- Shows up only when something changed. -->
    <v-slide-y-reverse-transition>
      <div v-if="dirty" class="sheet-savebar">
        <span><v-icon size="18" class="mr-2">mdi-pencil-circle</v-icon>You have unsaved changes</span>
        <v-btn variant="text" :disabled="isSaving" @click="discard">Discard</v-btn>
        <v-btn color="accent" variant="flat" prepend-icon="mdi-content-save" :loading="isSaving" @click="save">Save</v-btn>
      </div>
    </v-slide-y-reverse-transition>

    <v-dialog v-model="removeDialog" max-width="400">
      <v-card color="#2b2b2b" class="pa-5">
        <h3 class="sheet-title mb-2">Remove {{ heroData?.name }}?</h3>
        <p class="text-body-2 mb-4">Their equipment, skills and resources will be lost. This can't be undone.</p>
        <div class="d-flex justify-end ga-2">
          <v-btn variant="text" @click="removeDialog = false">Cancel</v-btn>
          <v-btn color="error" variant="flat" :loading="removing" @click="removeHero">Remove hero</v-btn>
        </div>
      </v-card>
    </v-dialog>

    <v-dialog v-model="leaveDialog" max-width="400">
      <v-card color="#2b2b2b" class="pa-5">
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
import { CONTENT_LABELS, classStyle, heroClassLabel, heroPortrait } from "@/data/heroMeta";
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
const style = computed(() => classStyle(heroData.value?.class ?? ""));

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
  margin: 0 -8px 8px;
}

/* Banner, built like the hero board header. */
.sheet-banner {
  position: relative;
  display: flex;
  align-items: stretch;
  min-height: 200px;
  margin-bottom: 16px;
  overflow: hidden;
  border: 1px solid;
  border-radius: 14px;
}
.sheet-banner__watermark {
  position: absolute;
  top: 50%;
  right: 12%;
  width: 260px;
  opacity: 0.1;
  transform: translateY(-50%);
  pointer-events: none;
}
.sheet-banner__text {
  position: relative;
  z-index: 1;
  display: flex;
  flex: 1;
  flex-direction: column;
  padding: 24px 28px;
}
.sheet-banner__text h1 {
  font-size: 2.2rem;
  font-weight: 800;
  line-height: 1;
  text-transform: uppercase;
}
.sheet-banner__class {
  margin: 6px 0 0;
  font-size: 1.1rem;
  font-weight: 700;
  text-transform: uppercase;
}
.sheet-banner__path {
  margin: 0;
  font-size: 0.85rem;
  font-weight: 600;
  text-transform: uppercase;
  opacity: 0.85;
}
.sheet-banner__meta {
  display: flex;
  flex-direction: column;
  gap: 2px;
  margin-top: auto;
  padding-top: 16px;
  font-size: 0.8rem;
}
.sheet-banner__meta span:first-child {
  display: flex;
  align-items: center;
  font-weight: 700;
  text-transform: uppercase;
}
.sheet-banner__portrait {
  position: relative;
  z-index: 1;
  align-self: flex-end;
  width: 200px;
  height: 200px;
  margin-right: 5%;
  object-fit: contain;
  object-position: bottom;
}
.sheet-banner__menu {
  position: absolute !important;
  top: 8px;
  right: 8px;
  z-index: 2;
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
  background: rgba(43, 43, 43, 0.95);
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
  background: #1f1f1f;
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
  .sheet-banner {
    min-height: 150px;
  }
  .sheet-banner__text {
    padding: 16px;
  }
  .sheet-banner__text h1 {
    font-size: 1.5rem;
  }
  .sheet-banner__class {
    font-size: 0.85rem;
  }
  .sheet-banner__path,
  .sheet-banner__meta {
    font-size: 0.7rem;
  }
  .sheet-banner__portrait {
    width: 130px;
    height: 150px;
    margin-right: 0;
  }
  .sheet-banner__watermark {
    right: 0;
    width: 160px;
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
