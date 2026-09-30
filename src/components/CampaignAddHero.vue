<template>
  <!-- Legacy campaigns: one place to add a hero, from scratch, another campaign or My heroes. -->
  <v-btn variant="elevated" rounded prepend-icon="mdi-plus" :disabled="isFull" v-bind="$attrs" @click="open">
    {{ t("label.add-hero") }}
    <v-tooltip v-if="isFull" activator="parent" location="top">This campaign already has {{ MAX_HEROES }} heroes</v-tooltip>
  </v-btn>

  <v-dialog v-model="visible" max-width="760" scrollable>
    <v-card class="add-hero" color="#232323">
      <div class="add-hero__head">
        <h2>Add hero</h2>
        <v-btn icon="mdi-close" variant="text" size="small" aria-label="Close" @click="visible = false" />
      </div>

      <div class="add-hero__tabs" role="tablist">
        <button v-for="tab in TABS" :key="tab.value" role="tab" :class="{ active: source === tab.value }" @click="source = tab.value">
          <v-icon size="18">{{ tab.icon }}</v-icon>{{ tab.label }}
        </button>
      </div>

      <v-card-text class="add-hero__body">
        <!-- New hero -->
        <template v-if="source === 'new'">
          <v-text-field
            v-model="search"
            placeholder="Search hero"
            prepend-inner-icon="mdi-magnify"
            variant="solo"
            density="compact"
            flat
            hide-details
            clearable
            class="add-hero__search"
          />
          <div class="add-hero__grid">
            <button v-if="!search" class="pick-tile pick-tile--random" @click="addRandom">
              <v-icon size="40">mdi-dice-5</v-icon>
              <strong>Random</strong>
            </button>
            <button v-for="hero in newHeroes" :key="hero.id" class="pick-tile" @click="addNew(hero)">
              <img :src="hero.images.avatar" :alt="hero.name" />
              <span class="pick-tile__text">
                <strong>{{ hero.name }}</strong>
                <small>{{ heroClassLabel(hero.class) }}</small>
              </span>
            </button>
          </div>
        </template>

        <!-- From another campaign -->
        <template v-else-if="source === 'campaign'">
          <template v-if="!sourceCampaignId">
            <p v-if="!otherCampaigns.length" class="add-hero__empty">No other campaigns with heroes.</p>
            <button v-for="entry in otherCampaigns" :key="entry.campaignId" class="source-row" @click="sourceCampaignId = entry.campaignId">
              <img v-if="campaignLogo(entry.campaign)" :src="campaignLogo(entry.campaign)" alt="" class="source-row__logo" />
              <span class="source-row__name">{{ entry.name || "Unnamed campaign" }}</span>
              <span class="source-row__count">{{ (entry.heroes ?? []).length }} heroes</span>
              <v-icon>mdi-chevron-right</v-icon>
            </button>
          </template>
          <template v-else>
            <v-btn variant="text" size="small" prepend-icon="mdi-arrow-left" class="mb-2" @click="sourceCampaignId = null">All campaigns</v-btn>
            <p v-if="!campaignHeroes.length" class="add-hero__empty">No heroes to import from this campaign.</p>
            <div class="add-hero__list">
              <button v-for="entry in campaignHeroes" :key="entry.state.heroId" class="import-row" :disabled="entry.inCampaign" @click="importHero(entry.state)">
                <img :src="entry.data?.images.avatar" alt="" />
                <span class="import-row__text">
                  <strong>{{ entry.data?.name ?? entry.state.heroId }}</strong>
                  <small>{{ entry.data ? `${entry.data.race} | ${heroClassLabel(entry.data.class)}` : "" }}</small>
                  <span v-if="entry.foreignItems" class="import-row__warn">
                    <v-icon size="14">mdi-alert-outline</v-icon>{{ entry.foreignItems }} {{ entry.foreignItems === 1 ? "item" : "items" }} from other expansions
                  </span>
                </span>
                <span v-if="entry.inCampaign" class="import-row__tag">Already here</span>
                <v-icon v-else>mdi-plus-circle</v-icon>
              </button>
            </div>
          </template>
        </template>

        <!-- From My heroes -->
        <template v-else>
          <div v-if="playableHeroStore.loading" class="text-center py-6"><v-progress-circular indeterminate /></div>
          <p v-else-if="!myHeroes.length" class="add-hero__empty">You don't have heroes in My heroes yet.</p>
          <div class="add-hero__list">
            <button v-for="entry in myHeroes" :key="entry.pk" class="import-row" :disabled="entry.inCampaign" @click="importHero(entry.state)">
              <img :src="entry.data?.images.avatar" alt="" />
              <span class="import-row__text">
                <strong>{{ entry.data?.name ?? entry.state.heroId }}</strong>
                <small>{{ entry.data ? `${entry.data.race} | ${heroClassLabel(entry.data.class)}` : "" }}</small>
                <span v-if="entry.foreignItems" class="import-row__warn">
                  <v-icon size="14">mdi-alert-outline</v-icon>{{ entry.foreignItems }} {{ entry.foreignItems === 1 ? "item" : "items" }} from other expansions
                </span>
              </span>
              <span v-if="entry.inCampaign" class="import-row__tag">Already here</span>
              <v-icon v-else>mdi-plus-circle</v-icon>
            </button>
          </div>
        </template>
      </v-card-text>
    </v-card>
  </v-dialog>

  <v-snackbar v-model="snackbar" :timeout="3000" :color="snackbarColor" location="top">{{ snackbarText }}</v-snackbar>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";
import { cloneDeep } from "lodash-es";
import { CampaignStore } from "@/store/CampaignStore";
import { usePlayableHeroStore } from "@/store/PlayableHeroStore";
import { useUserStore } from "@/store/UserStore";
import { Hero, SequentialAdventureState, RESOURCE_DEFINITIONS } from "@/store/Hero";
import { EnabledHeroes } from "@/repository/EnabledHeroes";
import { HeroDataRepository } from "@/data/repository/HeroDataRepository";
import type { HeroData } from "@/data/repository/HeroData";
import type { ItemDataRepository } from "@/data/repository/ItemDataRepository";
import { RandomizeHero } from "@/service/RandomizeHero";
import { heroClassLabel } from "@/data/heroMeta";
import { CoreItemDataRepository } from "@/data/repository/campaign/core/CoreItemDataRepository";
import { AwakeningsItemDataRepository } from "@/data/repository/campaign/awakenings/AwakeningsItemDataRepository";
import { ApocalypseItemDataRepository } from "@/data/repository/campaign/apocalypse/ApocalypseItemDataRepository";
import coreLogo from "@/assets/logo/core.webp";
import awakeningsLogo from "@/assets/logo/awakenings.webp";
import apocalypseLogo from "@/assets/logo/apocalypse.webp";

defineOptions({ inheritAttrs: false });
const props = defineProps<{ campaignId: string }>();

const { t } = useI18n();
const campaignStore = CampaignStore();
const playableHeroStore = usePlayableHeroStore();
const userStore = useUserStore();
const heroRepository = new HeroDataRepository();

const MAX_HEROES = 5;
const TABS = [
  { value: "new", label: "New hero", icon: "mdi-account-plus-outline" },
  { value: "campaign", label: "Another campaign", icon: "mdi-book-open-page-variant-outline" },
  { value: "mine", label: "My heroes", icon: "mdi-shield-account-outline" },
] as const;

const visible = ref(false);
const source = ref<"new" | "campaign" | "mine">("new");
const search = ref("");
const sourceCampaignId = ref<string | null>(null);

const campaign = computed(() => campaignStore.findOptional(props.campaignId));
const heroesHere = computed(() => campaignStore.findAllHeroes(props.campaignId));
const isFull = computed(() => heroesHere.value.length >= MAX_HEROES);
const isHere = (heroId: string) => campaignStore.hasHero(props.campaignId, heroId);

const LOGOS: Record<string, string> = { core: coreLogo, awakenings: awakeningsLogo, apocalypse: apocalypseLogo };
const campaignLogo = (type: string) => LOGOS[type];

// Items this campaign's box knows about; anything else is from another expansion.
const ITEM_REPOSITORIES: Record<string, () => ItemDataRepository> = {
  core: () => new CoreItemDataRepository(),
  awakenings: () => new AwakeningsItemDataRepository(),
  apocalypse: () => new ApocalypseItemDataRepository(),
};
const itemRepository = computed(() => ITEM_REPOSITORIES[campaign.value?.campaign ?? ""]?.() ?? null);
function foreignItemCount(state: Hero): number {
  if (!itemRepository.value) return 0;
  const ids = [...Object.values(state.equipment ?? {}), ...(state.stashedCardIds ?? [])].filter(Boolean) as string[];
  return ids.filter((id) => !itemRepository.value!.find(id)).length;
}

// New hero
const newHeroes = computed(() => {
  const query = (search.value ?? "").toLowerCase().trim();
  return new EnabledHeroes()
    .findAll()
    .filter((hero: HeroData) => !isHere(hero.id))
    .filter((hero: HeroData) => !query || hero.name.toLowerCase().includes(query));
});

function freshHero(heroId: string): Hero {
  const hero = new Hero(heroId, props.campaignId);
  hero.sequentialAdventureState = new SequentialAdventureState();
  RESOURCE_DEFINITIONS.forEach((resource) => {
    hero.sequentialAdventureState!.resources[resource.id] = 0;
  });
  return hero;
}

function addNew(hero: HeroData) {
  if (!guard()) return;
  campaignStore.addHero(props.campaignId, freshHero(hero.id));
  done(`${hero.name} joined the party!`);
}

function addRandom() {
  const existing = heroesHere.value.map((hero) => hero.heroId);
  const random = new RandomizeHero().randomize(existing);
  const hero = random ? heroRepository.find(random.id) : undefined;
  if (!hero) {
    notify("No random hero available.", "warning");
    return;
  }
  addNew(hero);
}

// From another campaign
const otherCampaigns = computed(() =>
  campaignStore
    .findAll()
    .filter((entry) => entry.campaignId !== props.campaignId && (entry.heroes ?? []).length > 0)
    .sort((a, b) => Number(b.campaignId) - Number(a.campaignId)),
);
const campaignHeroes = computed(() =>
  sourceCampaignId.value
    ? campaignStore.findAllHeroes(sourceCampaignId.value).map((state) => ({
        state,
        data: heroRepository.find(state.heroId),
        inCampaign: isHere(state.heroId),
        foreignItems: foreignItemCount(state),
      }))
    : [],
);

// From My heroes
const myHeroes = computed(() =>
  playableHeroStore.heroes.map((view) => ({
    pk: view.pk,
    state: view.state,
    data: view.staticData ?? heroRepository.find(view.heroId),
    inCampaign: isHere(view.heroId),
    foreignItems: foreignItemCount(view.state),
  })),
);

// A copy of the hero joins this campaign; the original stays where it was.
function importHero(state: Hero) {
  if (!guard() || isHere(state.heroId)) return;
  const copy = cloneDeep(state) as Hero & { effectsByCampaign?: Record<string, any>; effectsCampaign?: string };
  copy.campaignId = props.campaignId;
  copy.playableHeroesPk = null;
  // Effects picked on the hero sheet for this kind of campaign come along.
  const picks = copy.effectsByCampaign?.[campaign.value?.campaign ?? ""];
  copy.auraId = picks?.auraId ?? null;
  copy.statusIds = [...(picks?.statusIds ?? [])];
  copy.outcomeIds = [...(picks?.outcomeIds ?? [])];
  delete copy.effectsByCampaign;
  delete copy.effectsCampaign;
  campaignStore.addHero(props.campaignId, copy);
  const name = heroRepository.find(state.heroId)?.name ?? "Hero";
  const foreign = foreignItemCount(state);
  done(foreign ? `${name} joined, with ${foreign} item(s) from other expansions.` : `${name} joined the party!`);
}

function guard() {
  if (isFull.value) {
    notify(`Campaigns can only have up to ${MAX_HEROES} heroes.`, "warning");
    return false;
  }
  return true;
}

function open() {
  source.value = "new";
  search.value = "";
  sourceCampaignId.value = null;
  visible.value = true;
  if (!playableHeroStore.loaded && userStore.user?.users_pk) playableHeroStore.fetchHeroes(userStore.user.users_pk);
}

const snackbar = ref(false);
const snackbarText = ref("");
const snackbarColor = ref("success");
function notify(text: string, color = "success") {
  snackbarText.value = text;
  snackbarColor.value = color;
  snackbar.value = true;
}
function done(text: string) {
  notify(text);
  visible.value = false;
}
</script>

<style scoped>
.add-hero {
  color: #fff;
  font-family: "Poppins", sans-serif;
}
.add-hero__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 16px 8px 22px;
}
.add-hero__head h2 {
  font-size: 1.2rem;
  font-weight: 800;
  text-transform: uppercase;
}
.add-hero__tabs {
  display: flex;
  gap: 4px;
  margin: 0 16px 8px;
  padding: 4px;
  background: rgba(0, 0, 0, 0.35);
  border-radius: 10px;
}
.add-hero__tabs button {
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 8px 6px;
  border-radius: 8px;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  opacity: 0.65;
}
.add-hero__tabs button.active {
  background: rgb(var(--v-theme-terciary));
  color: rgb(var(--v-theme-on-terciary));
  opacity: 1;
}
.add-hero__body {
  min-height: 360px;
  padding: 8px 16px 16px !important;
}
.add-hero__search {
  margin-bottom: 12px;
}
.add-hero__search :deep(.v-field) {
  background: rgba(255, 255, 255, 0.08);
  border-radius: 8px;
}
.add-hero__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(110px, 1fr));
  gap: 10px;
}
.pick-tile {
  position: relative;
  aspect-ratio: 3 / 4;
  overflow: hidden;
  border: 2px solid transparent;
  border-radius: 10px;
  background: #1a1a1a;
  transition: border-color 0.15s ease, transform 0.15s ease;
}
.pick-tile:hover {
  border-color: rgb(var(--v-theme-accent));
  transform: translateY(-2px);
}
.pick-tile img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.pick-tile__text {
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  padding: 20px 8px 8px;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.9));
  text-align: left;
}
.pick-tile__text strong {
  font-size: 0.8rem;
  text-transform: uppercase;
}
.pick-tile__text small {
  font-size: 0.62rem;
  text-transform: uppercase;
  opacity: 0.8;
}
.pick-tile--random {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
  border: 2px dashed rgba(var(--v-theme-accent), 0.6);
  color: rgb(var(--v-theme-accent));
  text-transform: uppercase;
}
.add-hero__empty {
  padding: 32px 8px;
  text-align: center;
  opacity: 0.65;
}
.source-row,
.import-row {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  margin-bottom: 8px;
  padding: 10px 12px;
  background: rgba(255, 255, 255, 0.06);
  border-radius: 8px;
  text-align: left;
  transition: background 0.15s ease;
}
.source-row:hover,
.import-row:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.12);
}
.import-row:disabled {
  opacity: 0.45;
  cursor: default;
}
.source-row__logo {
  width: 56px;
  height: 28px;
  object-fit: contain;
}
.source-row__name {
  flex: 1;
  font-weight: 700;
}
.source-row__count {
  font-size: 0.75rem;
  opacity: 0.6;
}
.import-row img {
  width: 48px;
  height: 64px;
  border-radius: 6px;
  object-fit: cover;
}
.import-row__text {
  display: flex;
  flex: 1;
  flex-direction: column;
  min-width: 0;
}
.import-row__text strong {
  text-transform: uppercase;
}
.import-row__text small {
  font-size: 0.7rem;
  text-transform: uppercase;
  opacity: 0.7;
}
.import-row__warn {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-top: 4px;
  color: #ffc46b;
  font-size: 0.72rem;
  font-weight: 600;
}
.import-row__tag {
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  opacity: 0.8;
}
@media (max-width: 599px) {
  .add-hero__tabs button {
    flex-direction: column;
    gap: 2px;
    font-size: 0.62rem;
  }
}
</style>
