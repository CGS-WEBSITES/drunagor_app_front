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

      <!-- Groups side by side when they fit. -->
      <div v-else class="heroes-groups" :class="{ 'heroes-groups--flat': groupBy === 'none' }">
        <section v-for="group in groups" :key="group.key" class="heroes-group">
          <h2
            v-if="group.label"
            class="heroes-group__title"
            :style="group.style ? { background: group.style.bg, borderColor: group.style.stroke } : undefined"
          >
            <img v-if="group.style?.icon" :src="group.style.icon" alt="" class="heroes-group__icon" />
            <img v-else-if="group.logo" :src="group.logo" alt="" class="heroes-group__logo" />
            <v-icon v-else-if="groupBy === 'box'" size="24">mdi-package-variant-closed</v-icon>
            <span class="heroes-group__name">{{ group.label }}</span>
            <span class="heroes-group__count">{{ group.heroes.length }}</span>
          </h2>
          <div class="heroes-grid">
            <button
              v-for="entry in group.heroes"
              :key="entry.data.id"
              class="hero-tile"
              :class="{ 'hero-tile--locked': !entry.owned }"
              :title="entry.owned ? `Open ${entry.data.name}` : `Add ${entry.data.name} to your heroes`"
              @click="entry.owned ? openHero(entry) : askToAdd(entry.data)"
            >
              <img :src="entry.data.images.avatar" :alt="entry.data.name" class="hero-tile__img" loading="lazy" />
              <img
                v-if="CONTENT_LOGOS[entry.data.content]"
                :src="CONTENT_LOGOS[entry.data.content]"
                :alt="contentLabel(entry.data.content)"
                :title="contentLabel(entry.data.content)"
                class="hero-tile__box"
              />
              <span v-if="!entry.owned" class="hero-tile__add"><v-icon size="18">mdi-plus</v-icon> Add</span>
              <span class="hero-tile__text">
                <strong>{{ entry.data.name }}</strong>
                <small>{{ entry.data.race }} | {{ heroClassLabel(entry.data.class) }}</small>
              </span>
            </button>
          </div>
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
import { CONTENT_LABELS, CONTENT_LOGOS, classStyle, heroClassLabel, heroPortrait } from "@/data/heroMeta";

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
      logo: groupBy.value === "box" ? CONTENT_LOGOS[heroes[0].data.content] : undefined,
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
.heroes-groups {
  display: flex;
  flex-wrap: wrap;
  gap: 28px 24px;
}
.heroes-group {
  flex: 0 1 auto;
  min-width: 0;
}
.heroes-groups--flat .heroes-group {
  flex: 1 1 100%;
}
.heroes-group__title {
  display: flex;
  align-items: center;
  gap: 10px;
  min-height: 48px;
  margin-bottom: 12px;
  padding: 6px 14px;
  background: #3a3736;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 800;
  letter-spacing: 0.5px;
  text-transform: uppercase;
}
.heroes-group__name {
  flex: 1;
  white-space: nowrap;
}
/* How many heroes of this group. */
.heroes-group__count {
  min-width: 34px;
  padding: 2px 10px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 999px;
  font-size: 1.15rem;
  font-weight: 800;
  text-align: center;
}
.heroes-group__icon {
  width: 30px;
  height: 30px;
  object-fit: contain;
}
.heroes-group__logo {
  height: 26px;
  max-width: 70px;
  object-fit: contain;
}
.heroes-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

/* One hero: portrait, name at the bottom. */
.hero-tile {
  position: relative;
  width: 150px;
  aspect-ratio: 3 / 4;
  overflow: hidden;
  border: 2px solid transparent;
  border-radius: 10px;
  background: #1a1a1a;
  text-align: left;
  transition: transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;
}
.hero-tile:hover {
  border-color: rgb(var(--v-theme-accent));
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.5);
  transform: translateY(-3px);
}
.hero-tile__img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: filter 0.2s ease, transform 0.3s ease;
}
.hero-tile:hover .hero-tile__img {
  transform: scale(1.05);
}
.hero-tile--locked .hero-tile__img {
  filter: grayscale(1) brightness(0.5);
}
.hero-tile--locked:hover .hero-tile__img {
  filter: grayscale(0.3) brightness(0.75);
}
.hero-tile__box {
  position: absolute;
  top: 8px;
  right: 8px;
  height: 22px;
  max-width: 56px;
  object-fit: contain;
  filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.8));
}
.hero-tile__add {
  position: absolute;
  top: 50%;
  left: 50%;
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 6px 14px;
  background: rgb(var(--v-theme-accent));
  border-radius: 999px;
  color: #141414;
  font-size: 0.8rem;
  font-weight: 800;
  text-transform: uppercase;
  opacity: 0;
  transform: translate(-50%, -50%);
  transition: opacity 0.2s ease;
}
.hero-tile--locked:hover .hero-tile__add,
.hero-tile--locked:focus-visible .hero-tile__add {
  opacity: 1;
}
.hero-tile__text {
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  padding: 28px 10px 10px;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.9));
  color: #fff;
}
.hero-tile__text strong {
  font-size: 0.95rem;
  font-weight: 800;
  line-height: 1.2;
  text-transform: uppercase;
}
.hero-tile__text small {
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
  opacity: 0.8;
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
  .heroes-group {
    flex-basis: 100%;
  }
  .heroes-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 8px;
  }
  .hero-tile {
    width: auto;
  }
  .hero-tile__text strong {
    font-size: 0.8rem;
  }
  .hero-tile__text small {
    font-size: 0.6rem;
  }
}
</style>
