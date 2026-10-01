<template>
  <div class="hero-sum" :class="{ 'hero-sum--folded': folded }">
    <div class="hero-sum__main">
      <img :src="heroArt" :alt="hero.name" class="hero-sum__art" @click="isPhone && (collapsed = !collapsed)" />

      <div v-show="!folded" class="hero-sum__info">
        <!-- Numbers at a glance -->
        <div class="hero-sum__stats">
          <template v-if="adventure">
            <div class="stat" title="Life points">
              <v-icon size="18" color="#e05353">mdi-heart</v-icon>
              <strong>{{ adventure.lifepoints ?? 0 }}</strong>
              <small>Life</small>
            </div>
            <div class="stat" title="Available / used action cubes">
              <v-icon size="18">mdi-cube-outline</v-icon>
              <strong>{{ adventure.availableCubes ?? 0 }}<span>/{{ adventure.usedCubes ?? 0 }}</span></strong>
              <small>Cubes</small>
            </div>
            <div class="stat" title="Curse cubes">
              <v-icon size="18" color="#9c6ade">mdi-cube</v-icon>
              <strong>{{ adventure.curseCubes ?? 0 }}</strong>
              <small>Curse</small>
            </div>
            <div class="stat" title="Trauma cubes">
              <v-icon size="18" color="#9e9e9e">mdi-cube</v-icon>
              <strong>{{ adventure.traumaCubes ?? 0 }}</strong>
              <small>Trauma</small>
            </div>
          </template>
          <div class="stat" title="Class abilities">
            <v-icon size="18" color="accent">mdi-star-circle</v-icon>
            <strong>{{ state?.classAbilityCount ?? 0 }}</strong>
            <small>Abilities</small>
          </div>
          <div class="stat" title="Skills">
            <v-icon size="18">mdi-lightning-bolt</v-icon>
            <strong>{{ skillCount }}</strong>
            <small>Skills</small>
          </div>
        </div>

        <!-- Equipped items -->
        <div v-if="equipped.length" class="hero-sum__items">
          <div v-for="item in equipped" :key="item.key" class="sum-item">
            <span class="sum-item__icon"><SlotIcon :type="item.type" :size="24" /></span>
            <div class="sum-item__text">
              <strong>{{ item.name }}</strong>
              <small>{{ item.sub }}</small>
            </div>
          </div>
        </div>
        <p v-else class="hero-sum__muted">No items equipped</p>
      </div>
    </div>

    <div class="hero-sum__footer">
      <v-btn v-if="isPhone" size="small" variant="text" :append-icon="collapsed ? 'mdi-chevron-down' : 'mdi-chevron-up'" @click="collapsed = !collapsed">
        {{ collapsed ? "Show details" : "Hide details" }}
      </v-btn>
      <v-spacer />
      <v-btn size="small" variant="tonal" prepend-icon="mdi-pencil" class="shepherd-btn-equipment-skills" @click="openHeroEquipmentSkills">Edit hero</v-btn>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { HeroStore } from "@/store/HeroStore";
import { allItemsRepository } from "@/data/repository/AllItemsRepository";
import { HeroDataRepository } from "@/data/repository/HeroDataRepository";
import type { HeroData } from "@/data/repository/HeroData";
import { useRouter } from "vue-router";
import SlotIcon from "@/components/hero-sheet/SlotIcon.vue";
import { useDisplay } from "vuetify";
import { useStorage } from "@vueuse/core";
import { useI18n } from "vue-i18n";

const props = defineProps<{
  heroId: string;
  campaignId: string;
  isSequentialAdventure: boolean;
}>();

const heroDataRepository = new HeroDataRepository();
const router = useRouter();
const { t } = useI18n();

const hero = heroDataRepository.find(props.heroId) ?? ({} as HeroData);

const heroStore = HeroStore();
// Folded cards stay folded, per campaign and hero.
const heroArt = (hero.images as any)?.trackerInfo || hero.images?.avatar;
// Phones can fold a hero down to its art; on PC everything shows.
const { smAndDown } = useDisplay();
const isPhone = computed(() => smAndDown.value);
const collapsed = useStorage(`campaign.${props.campaignId}.hero.${props.heroId}.collapsed`, false);
const folded = computed(() => isPhone.value && collapsed.value);
const state = computed(() => heroStore.findInCampaignOptional(props.heroId, props.campaignId));
const adventure = computed(() => state.value?.sequentialAdventureState as any);
const skillCount = computed(() => (state.value?.skillIds ?? []).length);

// What the hero is using: bags and the stash are carried, not used.
const SLOTS = ["weaponId", "offHandId", "armorId", "trinketId"] as const;
const equipped = computed(() =>
  SLOTS.map((key) => {
    const id = (state.value?.equipment as any)?.[key] as string | undefined;
    if (!id) return null;
    const item: any = allItemsRepository.find(id);
    const kinds: string[] = item?.weaponTypes ?? item?.offHandTypes ?? item?.armorTypes ?? (item?.consumableType ? [item.consumableType] : []);
    return {
      key,
      type: item?.itemType ?? "Bag",
      name: item ? t(item.translation_key) : id,
      sub: kinds.length ? kinds.join(" | ") : item?.itemType ?? "",
    };
  }).filter((entry) => entry !== null) as { key: string; type: string; name: string; sub: string }[],
);


function openHeroEquipmentSkills() {
  router.push({
    name: "Hero",
    params: { campaignId: props.campaignId, heroId: props.heroId },
  });
}
</script>

<style scoped>
.hero-sum {
  overflow: hidden;
  background: rgb(var(--v-theme-primary));
  border-radius: 12px;
  font-family: "Poppins", sans-serif;
}
.hero-sum__main {
  display: flex;
}
.hero-sum__art {
  flex: 0 0 40%;
  width: 40%;
  aspect-ratio: 1365 / 499;
  object-fit: cover;
  align-self: flex-start;
}
.hero-sum__info {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 12px;
  min-width: 0;
  padding: 14px 14px 0;
}
.hero-sum__footer {
  display: flex;
  align-items: center;
  padding: 8px 14px 12px;
}
/* Stats: one strip, equal columns, everything centered. */
.hero-sum__stats {
  display: grid;
  grid-auto-columns: minmax(0, 1fr);
  grid-auto-flow: column;
  overflow: hidden;
  background: rgb(var(--v-theme-secondary));
  border-radius: 10px;
}
.stat {
  display: grid;
  grid-template-areas: "icon value" "label label";
  justify-content: center;
  align-items: center;
  column-gap: 5px;
  row-gap: 2px;
  padding: 7px 4px;
  text-align: center;
}
.stat > :first-child {
  grid-area: icon;
}
.stat strong {
  grid-area: value;
}
.stat small {
  grid-area: label;
}
.stat + .stat {
  border-left: 1px solid rgba(255, 255, 255, 0.08);
}
.stat strong {
  font-size: 1.1rem;
  font-weight: 800;
  line-height: 1;
}
.stat strong span {
  font-size: 0.75rem;
  font-weight: 600;
  opacity: 0.6;
}
.stat small {
  font-size: 0.58rem;
  font-weight: 700;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  opacity: 0.6;
}
.hero-sum__items {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 6px;
}
.sum-item {
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
  padding: 6px 10px;
  background: rgb(var(--v-theme-secondary));
  border-radius: 8px;
}
/* Same box for every icon, so names line up. */
.sum-item__icon {
  display: flex;
  flex: 0 0 28px;
  align-items: center;
  justify-content: center;
  height: 28px;
}
.sum-item__text {
  display: flex;
  flex-direction: column;
  min-width: 0;
}
.sum-item__text strong {
  overflow: hidden;
  font-size: 0.82rem;
  line-height: 1.2;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.sum-item__text small {
  font-size: 0.7rem;
  opacity: 0.75;
}
.hero-sum__muted {
  margin: 0;
  font-size: 0.75rem;
  opacity: 0.6;
}
@media (max-width: 959px) {
  .hero-sum__main {
    flex-direction: column;
  }
  .hero-sum__art {
    width: 100%;
    cursor: pointer;
  }
  .hero-sum__info {
    padding: 12px 12px 0;
  }
}
.action-buttons-container {
  margin-top: 10px;
  display: flex;
  flex-direction: row;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  margin-left: 15px;
}

.action-btn {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4) !important;
  white-space: nowrap;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid rgba(255, 255, 255, 0.15) !important;
  font-weight: 800 !important;
  letter-spacing: 0.5px;
  text-transform: uppercase;
}

.action-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.6) !important;
  border-color: rgba(255, 255, 255, 0.35) !important;
}

@media (max-width: 360px) {
  .action-buttons-container {
    gap: 6px;
    margin-left: 8px;
  }

  .action-btn {
    font-size: 0.65rem !important;
    padding: 2px 6px !important;
    height: 28px !important;
  }
}

@media (min-width: 361px) and (max-width: 480px) {
  .action-btn {
    font-size: 0.7rem !important;
    padding: 4px 8px !important;
    height: 30px !important;
  }
}

@media (min-width: 481px) and (max-width: 640px) {
  .action-btn {
    font-size: 0.75rem !important;
    padding: 4px 10px !important;
    height: 32px !important;
  }
}

@media (min-width: 641px) and (max-width: 768px) {
  .action-btn {
    font-size: 0.8rem !important;
    padding: 6px 12px !important;
    height: 34px !important;
  }
}

@media (min-width: 769px) and (max-width: 1024px) {
  .action-btn {
    font-size: 0.85rem !important;
    padding: 6px 14px !important;
    height: 36px !important;
  }
}

.hero-list-item {
  padding: 0px 16px 16px 16px;
  background-image: url("@/assets/hero/flag-bg-red.webp");
  background-repeat: no-repeat;
  background-origin: content-box;
}

.position-relative {
  position: relative;
}

.hero-background-title, :deep(.v-expansion-panel-title) {
  width: 100%;
  aspect-ratio: 1365 / 499;
  min-height: auto !important;
  height: auto !important;
  position: relative;
  overflow: hidden;
}

.hero-background-title > .d-flex {
  position: relative;
  z-index: 2;
}

:deep(.v-expansion-panel-title__overlay) {
  background-color: transparent !important;
}

:deep(.v-expansion-panel-text__wrapper) {
  padding: 0;
}

:deep(.v-expansion-panel) {
  background-color: #1f2937 !important;
}

:deep(.v-expansion-panel-title) {
  background-color: transparent !important;
  color: white !important;
}

.hero-background-title::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1;
}

:deep(.v-expansion-panel-title:hover .hero-background-title::before) {
  background: linear-gradient(
    90deg,
    rgba(0, 0, 0, 0.1) 0%,
    rgba(0, 0, 0, 0.2) 30%,
    rgba(0, 0, 0, 0.5) 70%,
    rgba(0, 0, 0, 0.7) 100%
  );
}

</style>