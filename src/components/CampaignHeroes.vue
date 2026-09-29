<template>
  <div class="heroes-page">
    <div class="heroes-panel">
      <!-- Header -->
      <div class="heroes-head">
        <div>
          <h1 class="heroes-head__title">{{ view === "mine" ? "My Heroes" : "All Heroes" }}</h1>
          <p class="heroes-head__sub">
            {{ playableHeroStore.heroes.length }} {{ playableHeroStore.heroes.length === 1 ? "hero" : "heroes" }} in your roster
          </p>
        </div>
        <div class="d-flex ga-2">
          <v-btn variant="outlined" prepend-icon="mdi-dice-5" @click="rollRandom">Random hero</v-btn>
          <v-btn color="accent" variant="flat" prepend-icon="mdi-plus" @click="view = 'all'">Add hero</v-btn>
        </div>
      </div>

      <!-- Filters -->
      <div class="heroes-toolbar">
        <div class="heroes-seg">
          <button v-for="option in viewOptions" :key="option.value" :class="{ active: view === option.value }" @click="view = option.value">
            {{ option.label }}
          </button>
        </div>
        <div class="heroes-seg">
          <button
            v-for="option in contentOptions"
            :key="option.value"
            :class="{ active: contentScope === option.value }"
            :title="option.value === 'mine' ? 'Only the boxes set in My hero content' : 'Heroes from every box'"
            @click="contentScope = option.value"
          >
            {{ option.label }}
          </button>
        </div>
        <div class="heroes-sort">
          <span class="heroes-sort__label">Group by</span>
          <button
            v-for="option in groupOptions"
            :key="option.value"
            class="heroes-sort__item"
            :class="{ active: groupBy === option.value }"
            @click="groupBy = option.value"
          >
            {{ option.label }}
          </button>
        </div>
      </div>

      <p v-if="view === 'all'" class="heroes-hint">
        <v-icon size="16" class="mr-1">mdi-information-outline</v-icon>Faded heroes aren't in your roster yet. Click one to add it.
      </p>

      <v-alert v-if="playableHeroStore.error" type="error" variant="tonal" class="mb-4" border="start">
        {{ playableHeroStore.error }}
      </v-alert>

      <div v-if="playableHeroStore.loading" class="text-center py-12">
        <v-progress-circular indeterminate color="primary" />
      </div>

      <div v-else-if="!groups.length" class="heroes-empty">
        <v-icon size="44">mdi-shield-sword-outline</v-icon>
        <p v-if="view === 'mine'">No heroes yet. Add your first one.</p>
        <p v-else>No heroes match these filters.</p>
        <v-btn v-if="view === 'mine'" color="accent" variant="flat" prepend-icon="mdi-plus" @click="view = 'all'">Add hero</v-btn>
      </div>

      <!-- Groups flow in columns, like the hero board. -->
      <div v-else class="heroes-columns">
        <section v-for="group in groups" :key="group.key" class="heroes-group">
          <h2
            v-if="group.label"
            class="heroes-group__title"
            :style="group.style ? { background: group.style.bg, borderColor: group.style.stroke } : undefined"
          >
            <img v-if="group.style?.icon" :src="group.style.icon" alt="" class="heroes-group__icon" />
            {{ group.label }}
            <span>{{ group.heroes.length }}</span>
          </h2>
          <button
            v-for="entry in group.heroes"
            :key="entry.data.id"
            class="hero-row"
            :class="{ 'hero-row--locked': !entry.owned }"
            :style="{ background: classStyle(entry.data.class).bg, borderColor: classStyle(entry.data.class).stroke }"
            @click="entry.owned ? openHero(entry) : askToAdd(entry.data)"
          >
            <img :src="heroPortrait(entry.data)" alt="" class="hero-row__portrait" loading="lazy" />
            <span class="hero-row__text">
              <strong>{{ entry.data.name }}</strong>
              <small>{{ entry.data.race }} | {{ heroClassLabel(entry.data.class) }}</small>
              <em>{{ contentLabel(entry.data.content) }}</em>
            </span>
            <v-icon v-if="!entry.owned" class="hero-row__add" size="22">mdi-plus-circle</v-icon>
            <img v-else-if="classStyle(entry.data.class).icon" :src="classStyle(entry.data.class).icon" alt="" class="hero-row__class" />
          </button>
        </section>
      </div>
    </div>

    <!-- Adding a hero, picked or random, always asks first. -->
    <v-dialog :model-value="!!confirming" max-width="460" @update:model-value="!$event && (confirming = null)">
      <v-card v-if="confirming" class="hero-confirm" :style="{ background: classStyle(confirming.class).bg }">
        <img v-if="classStyle(confirming.class).icon" :src="classStyle(confirming.class).icon" alt="" class="hero-confirm__watermark" />
        <div class="hero-confirm__body">
          <img :src="heroPortrait(confirming)" alt="" class="hero-confirm__portrait" />
          <div>
            <span class="hero-confirm__kicker">{{ randomMode ? "Your random hero" : "Add hero" }}</span>
            <h3>{{ confirming.name }}</h3>
            <p>{{ confirming.race }} | {{ heroClassLabel(confirming.class) }}</p>
            <p class="hero-confirm__box">{{ contentLabel(confirming.content) }}</p>
          </div>
        </div>
        <div class="hero-confirm__actions">
          <v-btn variant="text" @click="confirming = null">Cancel</v-btn>
          <v-btn v-if="randomMode" variant="outlined" prepend-icon="mdi-dice-5" @click="rollRandom">Reroll</v-btn>
          <v-btn color="accent" variant="flat" :loading="adding" @click="confirmAdd">Add to my heroes</v-btn>
        </div>
      </v-card>
    </v-dialog>

    <v-snackbar v-model="snackbarVisible" :timeout="3000" :color="snackbarColor" location="top">
      {{ snackbarText }}
    </v-snackbar>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { useStorage } from "@vueuse/core";
import { usePlayableHeroStore } from "@/store/PlayableHeroStore";
import { useUserStore } from "@/store/UserStore";
import { ConfigurationStore } from "@/store/ConfigurationStore";
import { HeroDataRepository } from "@/data/repository/HeroDataRepository";
import type { HeroData } from "@/data/repository/HeroData";
import type { ContentId } from "@/data/type/ContentId";
import { RandomizeHero } from "@/service/RandomizeHero";
import { CONTENT_LABELS, classStyle, heroClassLabel, heroPortrait } from "@/data/heroMeta";

const router = useRouter();
const playableHeroStore = usePlayableHeroStore();
const userStore = useUserStore();
const configurationStore = ConfigurationStore();
const heroDataRepository = new HeroDataRepository();

type View = "mine" | "all";
type Scope = "mine" | "all";
type Group = "race" | "class" | "box" | "none";

const viewOptions: { value: View; label: string }[] = [
  { value: "mine", label: "My heroes" },
  { value: "all", label: "All heroes" },
];
const contentOptions: { value: Scope; label: string }[] = [
  { value: "mine", label: "My content" },
  { value: "all", label: "All boxes" },
];
const groupOptions: { value: Group; label: string }[] = [
  { value: "class", label: "Class" },
  { value: "race", label: "Race" },
  { value: "box", label: "Box" },
  { value: "none", label: "Name" },
];

// Remembered per browser.
const view = useStorage<View>("heroes.view", "mine");
const contentScope = useStorage<Scope>("heroes.content", "all");
const groupBy = useStorage<Group>("heroes.group", "class");

const contentLabel = (content: ContentId) => CONTENT_LABELS[content] ?? content;

interface Entry {
  data: HeroData;
  owned: boolean;
  pk: number | null;
}

const entries = computed<Entry[]>(() => {
  const owned = new Map(playableHeroStore.heroes.map((hero) => [hero.heroId, hero.pk]));
  return heroDataRepository
    .findAll()
    .filter((data: HeroData) => view.value === "all" || owned.has(data.id))
    .filter((data: HeroData) => contentScope.value === "all" || configurationStore.isEnabledHeroContent(data.content))
    .map((data: HeroData) => ({ data, owned: owned.has(data.id), pk: owned.get(data.id) ?? null }));
});

const groups = computed(() => {
  const keyOf = (entry: Entry) => {
    if (groupBy.value === "race") return entry.data.race;
    if (groupBy.value === "class") return heroClassLabel(entry.data.class);
    if (groupBy.value === "box") return contentLabel(entry.data.content);
    return "";
  };
  const map = new Map<string, Entry[]>();
  for (const entry of entries.value) {
    const key = keyOf(entry);
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(entry);
  }
  return [...map.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, heroes]) => ({
      key: key || "all",
      label: key,
      style: groupBy.value === "class" ? classStyle(key) : null,
      // Owned heroes first, then by name.
      heroes: heroes.sort((a, b) => Number(b.owned) - Number(a.owned) || a.data.name.localeCompare(b.data.name)),
    }));
});

const snackbarVisible = ref(false);
const snackbarText = ref("");
const snackbarColor = ref("success");
function showSnackbar(text: string, color = "success") {
  snackbarText.value = text;
  snackbarColor.value = color;
  snackbarVisible.value = true;
}

function openHero(entry: Entry) {
  router.push({ name: "StandaloneHero", params: { heroId: String(entry.pk) } } as any);
}

const confirming = ref<HeroData | null>(null);
const randomMode = ref(false);
const adding = ref(false);

function askToAdd(hero: HeroData) {
  randomMode.value = false;
  confirming.value = hero;
}

function rollRandom() {
  const existing = playableHeroStore.heroes.map((hero) => hero.heroId);
  const random = new RandomizeHero().randomize(existing);
  if (!random) {
    showSnackbar("Every hero from your content is already in your roster.", "warning");
    return;
  }
  randomMode.value = true;
  confirming.value = heroDataRepository.find(random.id) ?? null;
}

// After adding, go straight to the new hero's sheet.
async function confirmAdd() {
  const hero = confirming.value;
  if (!hero || !userStore.user.users_pk) return;
  adding.value = true;
  try {
    const created = await playableHeroStore.createHero(hero.id, userStore.user.users_pk);
    confirming.value = null;
    showSnackbar(`${hero.name} joined your heroes!`);
    if (created?.pk) router.push({ name: "StandaloneHero", params: { heroId: String(created.pk) } } as any);
  } catch (e: any) {
    console.error("[CampaignHeroes] Error adding hero:", e);
    showSnackbar(e?.response?.data?.message || "Failed to add hero.", "error");
  } finally {
    adding.value = false;
  }
}

onMounted(() => {
  if (userStore.user.users_pk) playableHeroStore.fetchHeroes(userStore.user.users_pk);
});
</script>

<style scoped>
.heroes-page {
  width: 100%;
  max-width: 1600px;
  margin: 0 auto;
  padding: 16px 24px 48px;
  font-family: "Poppins", sans-serif;
  color: #fff;
}
.heroes-panel {
  padding: 24px;
  background: rgba(30, 30, 30, 0.92);
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
}
.heroes-head {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 16px;
}
.heroes-head__title {
  font-size: 1.6rem;
  font-weight: 800;
  letter-spacing: 1px;
  text-transform: uppercase;
}
.heroes-head__sub {
  margin: 0;
  font-size: 0.85rem;
  opacity: 0.65;
}
.heroes-toolbar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}
.heroes-seg {
  display: flex;
  padding: 4px;
  background: rgba(0, 0, 0, 0.35);
  border-radius: 10px;
}
.heroes-seg button {
  padding: 7px 14px;
  border-radius: 8px;
  font-size: 0.78rem;
  font-weight: 700;
  text-transform: uppercase;
  opacity: 0.65;
  transition: background 0.2s ease, opacity 0.2s ease;
}
.heroes-seg button.active {
  background: rgb(var(--v-theme-terciary));
  color: rgb(var(--v-theme-on-terciary));
  opacity: 1;
}
.heroes-sort {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 4px;
  margin-left: auto;
}
.heroes-sort__label {
  margin-right: 4px;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  opacity: 0.6;
}
.heroes-sort__item {
  padding: 5px 10px;
  border-radius: 999px;
  font-size: 0.78rem;
  font-weight: 600;
  text-transform: uppercase;
  opacity: 0.7;
}
.heroes-sort__item.active {
  background: rgba(var(--v-theme-accent), 0.2);
  color: rgb(var(--v-theme-accent));
  opacity: 1;
}
.heroes-hint {
  display: flex;
  align-items: center;
  margin: -4px 0 16px;
  font-size: 0.8rem;
  opacity: 0.7;
}
.heroes-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 48px 16px;
  border: 1px dashed rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  text-align: center;
}
.heroes-columns {
  columns: 3 320px;
  column-gap: 20px;
}
.heroes-group {
  break-inside: avoid;
  margin-bottom: 20px;
}
.heroes-group__title {
  display: flex;
  align-items: center;
  gap: 10px;
  min-height: 44px;
  margin-bottom: 8px;
  padding: 6px 14px;
  background: #3a3736;
  border: 1px solid transparent;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 800;
  letter-spacing: 0.5px;
  text-transform: uppercase;
}
.heroes-group__title span {
  margin-left: auto;
  font-size: 0.75rem;
  font-weight: 600;
  opacity: 0.6;
}
.heroes-group__icon {
  width: 28px;
  height: 28px;
  object-fit: contain;
}

/* One hero: class color, portrait, name, class symbol. */
.hero-row {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  height: 56px;
  margin-bottom: 8px;
  padding: 0 12px 0 0;
  overflow: hidden;
  border: 1px solid;
  border-radius: 6px;
  text-align: left;
  transition: transform 0.15s ease, filter 0.15s ease, box-shadow 0.15s ease;
}
.hero-row:hover {
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.45);
  filter: brightness(1.15);
  transform: translateX(3px);
}
.hero-row__portrait {
  flex-shrink: 0;
  width: 60px;
  height: 56px;
  object-fit: cover;
  object-position: center top;
}
.hero-row__text {
  display: flex;
  flex: 1;
  flex-direction: column;
  min-width: 0;
  line-height: 1.15;
}
.hero-row__text strong {
  font-size: 0.95rem;
  font-weight: 800;
  text-transform: uppercase;
}
.hero-row__text small {
  font-size: 0.68rem;
  font-weight: 600;
  text-transform: uppercase;
  opacity: 0.9;
}
.hero-row__text em {
  font-size: 0.6rem;
  font-style: normal;
  text-transform: uppercase;
  opacity: 0.6;
}
.hero-row__class {
  flex-shrink: 0;
  width: 34px;
  height: 34px;
  object-fit: contain;
}
.hero-row--locked {
  filter: grayscale(0.85) brightness(0.6);
}
.hero-row--locked:hover {
  filter: grayscale(0.3) brightness(0.9);
}
.hero-row__add {
  flex-shrink: 0;
  color: rgb(var(--v-theme-accent));
}

/* Add confirmation */
.hero-confirm {
  position: relative;
  overflow: hidden;
  padding: 20px;
  color: #fff;
  font-family: "Poppins", sans-serif;
}
.hero-confirm__watermark {
  position: absolute;
  top: -10px;
  right: -10px;
  width: 170px;
  opacity: 0.12;
}
.hero-confirm__body {
  position: relative;
  display: flex;
  align-items: center;
  gap: 16px;
}
.hero-confirm__portrait {
  width: 110px;
  height: 110px;
  border-radius: 10px;
  object-fit: cover;
  object-position: center top;
  background: rgba(0, 0, 0, 0.25);
}
.hero-confirm__kicker {
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 1px;
  text-transform: uppercase;
  opacity: 0.7;
}
.hero-confirm h3 {
  font-size: 1.5rem;
  font-weight: 800;
  line-height: 1.1;
  text-transform: uppercase;
}
.hero-confirm p {
  margin: 2px 0 0;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
}
.hero-confirm__box {
  opacity: 0.65;
}
.hero-confirm__actions {
  position: relative;
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 20px;
}
@media (max-width: 599px) {
  .heroes-page {
    padding: 8px 12px 32px;
  }
  .heroes-panel {
    padding: 16px 12px;
  }
  .heroes-sort {
    margin-left: 0;
  }
}
</style>
