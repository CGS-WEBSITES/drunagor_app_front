<template>
  <!-- Editing a campaign hero: the same sheet as My heroes, with this campaign's rules. -->
  <div class="sheet-page">
    <HeroSavePut ref="heroSavePutRef" :campaign-id="campaignId" :hero-id="heroId" @success="onSaved" @fail="onSaveFail" />

    <div class="sheet-top">
      <v-btn variant="text" prepend-icon="mdi-arrow-left" @click="goBack">Back to campaign</v-btn>
    </div>

    <div v-if="!isLoaded" class="text-center py-16">
      <v-progress-circular indeterminate color="primary" size="56" />
    </div>

    <p v-else-if="!state || !heroData || !campaign" class="text-center py-16">Hero not found in this campaign.</p>

    <template v-else>
      <header class="sheet-banner">
        <img :src="(heroData.images as any).trackerInfo || heroData.images.avatar" :alt="heroData.name" class="sheet-banner__img" />
        <div class="sheet-banner__meta">
          <span class="sheet-banner__box">
            <img v-if="CONTENT_SYMBOLS[heroData.content]" :src="CONTENT_SYMBOLS[heroData.content]" alt="" />
            {{ CONTENT_LABELS[heroData.content] }}
          </span>
          <span class="sheet-banner__player">Campaign: <strong>{{ campaign.name || "Unnamed" }}</strong></span>
        </div>
      </header>

      <div class="sheet-grid">
        <div class="sheet-stack">
          <!-- Vitals: resources only exist in Adventure mode. -->
          <SheetCard id="vitals">
            <h3 class="sheet-title">Vitals</h3>
            <template v-if="adventure">
              <StatStepper v-model="adventure.lifepoints" label="Life points" icon="mdi-heart" icon-color="#e05353" class="mb-4" />
              <div class="sheet-subtitle">Cubes</div>
              <div class="sheet-pairs">
                <StatStepper v-model="adventure.availableCubes" label="Available" icon="mdi-cube-outline" />
                <StatStepper v-model="adventure.usedCubes" label="Used" icon="mdi-cube-off-outline" />
                <StatStepper v-model="adventure.curseCubes" label="Curse" icon="mdi-cube" icon-color="#9c6ade" />
                <StatStepper v-model="adventure.traumaCubes" label="Trauma" icon="mdi-cube" icon-color="#9e9e9e" />
              </div>
            </template>

            <div class="sheet-subtitle" :class="{ 'sheet-subtitle--first': !adventure }">Class abilities</div>
            <div class="sheet-abilities">
              <button
                v-for="n in 8"
                :key="n"
                class="sheet-ability"
                :class="{ on: n <= state.classAbilityCount }"
                :aria-label="`${n} class abilities`"
                @click="state.classAbilityCount = state.classAbilityCount === n ? n - 1 : n"
              >
                <v-icon size="20">{{ n <= state.classAbilityCount ? "mdi-star-circle" : "mdi-circle-outline" }}</v-icon>
              </button>
            </div>

            <template v-if="adventure">
              <div class="sheet-subtitle">Resources</div>
              <div class="sheet-pairs">
                <StatStepper
                  v-for="resource in RESOURCE_DEFINITIONS"
                  :key="resource.id"
                  v-model="adventure.resources[resource.id]"
                  :label="resource.name || t(resource.translation_key)"
                />
              </div>
            </template>
          </SheetCard>

          <!-- This campaign's aura, status and outcome. -->
          <SheetCard v-if="effects" id="effects">
            <h3 class="sheet-title mb-3">{{ effects.aura ? "Aura · Status · " : "Status · " }}{{ effects.outcomeLabel }}</h3>
            <EffectPicker
              v-if="effects.aura"
              :model-value="state.auraId ? [state.auraId] : []"
              title="Aura"
              :items="effects.aura"
              :multiple="false"
              placeholder="Select an aura"
              hint="Aura is removed when you receive a trauma cube or another aura"
              @update:model-value="state.auraId = $event[0] ?? null"
            />
            <EffectPicker v-model="state.statusIds" title="Status" :items="effects.status" placeholder="Add or remove status" hint="Statuses are removed during the camp phase" />
            <EffectPicker
              v-if="effects.outcome"
              v-model="state.outcomeIds"
              :title="effects.outcomeLabel"
              :items="effects.outcome"
              :placeholder="`Add or remove ${effects.outcomeLabel.toLowerCase()}`"
              hint="Remain in effect for the entire campaign unless some other effect changes them"
            />
          </SheetCard>
        </div>

        <SheetCard id="equipment">
          <HeroSheetEquipment :state="state" :hero="heroData" :sources="itemSources" />
        </SheetCard>

        <SheetCard id="skills">
          <HeroSheetSkills :state="state" :lock="isNights ? 'nights' : 'normal'" />
        </SheetCard>
      </div>

      <!-- Leaving the party lives here, away from the campaign list. -->
      <div v-if="!isNights" class="sheet-danger">
        <div>
          <strong>Remove {{ heroData.name }} from this campaign</strong>
          <p>The hero leaves the party with its items and effects. My heroes is not affected.</p>
        </div>
        <v-btn variant="tonal" prepend-icon="mdi-account-remove-outline" class="sheet-danger__btn" @click="removeDialog = true">Remove hero</v-btn>
      </div>
    </template>

    <v-slide-y-reverse-transition>
      <div v-if="dirty" class="sheet-savebar">
        <span><v-icon size="18" class="mr-2">mdi-pencil-circle</v-icon>You have unsaved changes</span>
        <v-btn color="accent" variant="flat" prepend-icon="mdi-content-save" :loading="isSaving" @click="save">Save</v-btn>
      </div>
    </v-slide-y-reverse-transition>

    <v-dialog v-model="removeDialog" max-width="400">
      <v-card color="surface" class="pa-5">
        <h3 class="text-h6 font-weight-bold mb-2">Remove {{ heroData?.name }}?</h3>
        <p class="text-body-2 mb-4">The campaign is saved without this hero.</p>
        <div class="d-flex justify-end ga-2">
          <v-btn variant="text" @click="removeDialog = false">Cancel</v-btn>
          <v-btn color="error" variant="flat" :loading="isSaving" @click="removeHero">Remove</v-btn>
        </div>
      </v-card>
    </v-dialog>

    <v-snackbar v-model="snackbarVisible" :timeout="2500" :color="snackbarColor" location="top">{{ snackbarText }}</v-snackbar>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { HeroDataRepository } from "@/data/repository/HeroDataRepository";
import { CampaignStore } from "@/store/CampaignStore";
import { HeroStore } from "@/store/HeroStore";
import { HeroEquipment, RESOURCE_DEFINITIONS } from "@/store/Hero";
import type { Campaign } from "@/store/Campaign";
import { CampaignLoadFromStorage } from "@/utils/CampaignLoadFromStorage";
import { CONTENT_LABELS, CONTENT_SYMBOLS, type ItemSource } from "@/data/heroMeta";
import HeroSavePut from "@/components/HeroSavePut.vue";
import StatStepper from "@/components/hero-sheet/StatStepper.vue";
import SheetCard from "@/components/hero-sheet/SheetCard.vue";
import HeroSheetEquipment from "@/components/hero-sheet/HeroSheetEquipment.vue";
import HeroSheetSkills from "@/components/hero-sheet/HeroSheetSkills.vue";
import EffectPicker from "@/components/EffectPicker.vue";
import { useCampaignEffects } from "@/components/hero-sheet/useCampaignEffects";

const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const campaignStore = CampaignStore();
const heroStore = HeroStore();
const heroDataRepository = new HeroDataRepository();
const allEffects = useCampaignEffects();

// Ids come from the route, or from props (dev preview).
const props = defineProps<{ campaignIdProp?: string; heroIdProp?: string }>();
const params = route.params as { heroId?: string; campaignId?: string };
const heroId = String(props.heroIdProp ?? params.heroId);
const campaignId = String(props.campaignIdProp ?? params.campaignId);

const heroSavePutRef = ref<{ save: () => Promise<boolean> } | null>(null);
const isLoaded = ref(false);
const isSaving = ref(false);
const dirty = ref(false);
const campaign = ref<Campaign | null>(null);

const state = computed(() => heroStore.findInCampaignOptional(heroId, campaignId));
const heroData = computed(() => heroDataRepository.find(heroId) ?? null);
const adventure = computed(() => (state.value?.sequentialAdventureState as any) ?? null);
const isNights = computed(() => ["underkeep", "underkeep2"].includes(campaign.value?.campaign ?? ""));
const effects = computed(() => allEffects.find((entry) => entry.id === campaign.value?.campaign) ?? null);

// Items offered by default: the boxes this campaign is played with.
const ITEM_SOURCES: Record<string, ItemSource[]> = {
  core: ["core"],
  awakenings: ["awakenings", "core"],
  apocalypse: ["apocalypse", "core"],
  underkeep: ["season-1"],
  underkeep2: ["season-2"],
};
const itemSources = computed(() => ITEM_SOURCES[campaign.value?.campaign ?? ""] ?? []);

const snackbarVisible = ref(false);
const snackbarText = ref("");
const snackbarColor = ref("success");
function notify(text: string, color = "success") {
  snackbarText.value = text;
  snackbarColor.value = color;
  snackbarVisible.value = true;
}

function fillDefaults() {
  const hero = state.value;
  if (!hero) return;
  if (!hero.equipment) hero.equipment = new HeroEquipment();
  if (!hero.stashedCardIds) hero.stashedCardIds = [];
  if (!hero.skillIds) hero.skillIds = [];
  if (!hero.statusIds) hero.statusIds = [];
  if (!hero.outcomeIds) hero.outcomeIds = [];
  if (typeof hero.classAbilityCount !== "number") hero.classAbilityCount = 0;
  if (!hero.dungeonRoleSkillCubeColors) hero.dungeonRoleSkillCubeColors = { rankOne: null, rankTwo: null };
  const adv = hero.sequentialAdventureState as any;
  if (adv) {
    if (!adv.resources) adv.resources = {};
    for (const resource of RESOURCE_DEFINITIONS) if (typeof adv.resources[resource.id] !== "number") adv.resources[resource.id] = 0;
    for (const key of ["lifepoints", "availableCubes", "usedCubes", "curseCubes", "traumaCubes"]) adv[key] = Number(adv[key]) || 0;
  }
}

async function save() {
  isSaving.value = true;
  try {
    await heroSavePutRef.value?.save();
  } catch {
    // onSaveFail shows the message.
  } finally {
    isSaving.value = false;
  }
}
function onSaved() {
  dirty.value = false;
  notify(`${heroData.value?.name ?? "Hero"} saved.`);
}
function onSaveFail() {
  notify("Failed to save the hero.", "error");
}

const removeDialog = ref(false);
async function removeHero() {
  heroStore.removeFromCampaign(heroId, campaignId);
  await save();
  removeDialog.value = false;
  dirty.value = false;
  goBack();
}

function goBack() {
  router.push({ name: "Campaign", params: { id: campaignId } } as any);
}

onMounted(async () => {
  try {
    await new CampaignLoadFromStorage().loadCampaignComplete(campaignId);
    campaign.value = campaignStore.findOptional(campaignId) ?? null;
    fillDefaults();
  } catch (error) {
    console.error("Error loading hero data:", error);
    notify("Error loading hero data.", "error");
  } finally {
    isLoaded.value = true;
  }
  await nextTick();
  watch(() => state.value, () => (dirty.value = true), { deep: true });
});
</script>

<style scoped>
.sheet-page {
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  padding: 12px 16px 96px;
  font-family: "Poppins", sans-serif;
  color: #fff;
}
.sheet-top {
  margin: 0 -8px 8px;
}
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
  max-height: 260px;
  object-fit: cover;
  object-position: left top;
}
/* Box and owner in a strip under the art. */
.sheet-banner__meta {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 4px 16px;
  padding: 10px 18px;
  background: rgba(0, 0, 0, 0.35);
  color: #fff;
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
  width: auto;
  height: 18px;
}
.sheet-banner__player {
  font-size: 0.85rem;
}
.sheet-grid {
  display: grid;
  grid-template-columns: minmax(280px, 340px) minmax(0, 1fr) minmax(0, 1fr);
  gap: 16px;
  align-items: start;
}
.sheet-stack {
  display: flex;
  flex-direction: column;
  gap: 16px;
  min-width: 0;
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
.sheet-subtitle--first {
  margin-top: 0;
  padding-top: 0;
  border-top: 0;
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
  background: rgba(255, 138, 128, 0.12) !important;
  color: #ff8a80 !important;
}
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
  .sheet-banner__img {
    max-height: none;
  }
  .sheet-savebar {
    right: 12px;
    left: 12px;
    bottom: 80px;
    transform: none;
  }
}
</style>
