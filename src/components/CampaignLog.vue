<template>
  <div class="hero-sum" :class="{ 'hero-sum--folded': folded }">
    <div class="hero-sum__main">
      <img :src="heroArt" :alt="hero.name" class="hero-sum__art" @click="isPhone && (collapsed = !collapsed)" />

      <div v-show="!folded" class="hero-sum__info">
        <div class="hero-sum__top">
          <!-- Numbers at a glance -->
          <div class="hero-sum__stats">
            <template v-if="adventure">
              <span class="stat" title="Life points"><v-icon size="16" color="#e05353">mdi-heart</v-icon><strong>{{ adventure.lifepoints ?? 0 }}</strong><small>Life</small></span>
              <span class="stat" title="Available / used action cubes"><v-icon size="16">mdi-cube-outline</v-icon><strong>{{ adventure.availableCubes ?? 0 }}<span>/{{ adventure.usedCubes ?? 0 }}</span></strong><small>Cubes</small></span>
              <span class="stat" title="Curse cubes"><v-icon size="16" color="#9c6ade">mdi-cube</v-icon><strong>{{ adventure.curseCubes ?? 0 }}</strong><small>Curse</small></span>
              <span class="stat" title="Trauma cubes"><v-icon size="16" color="#9e9e9e">mdi-cube</v-icon><strong>{{ adventure.traumaCubes ?? 0 }}</strong><small>Trauma</small></span>
            </template>
            <span class="stat" title="Class abilities"><v-icon size="16" color="accent">mdi-star-circle</v-icon><strong>{{ state?.classAbilityCount ?? 0 }}</strong><small>Abilities</small></span>
            <span class="stat" title="Skills"><v-icon size="16">mdi-lightning-bolt</v-icon><strong>{{ skillCount }}</strong><small>Skills</small></span>
          </div>
          <v-btn v-if="!isPhone" size="small" variant="tonal" prepend-icon="mdi-pencil" class="shepherd-btn-equipment-skills" @click="openHeroEquipmentSkills">Edit hero</v-btn>
        </div>

        <!-- Gear in use, one line each -->
        <div v-if="equipped.length" class="hero-sum__items">
          <div v-for="item in equipped" :key="item.key" class="sum-item" :title="`${item.name} · ${item.sub}`">
            <span class="sum-item__icon"><SlotIcon :type="item.type" :size="20" /></span>
            <strong>{{ item.name }}</strong>
            <small>{{ item.sub }}</small>
          </div>
        </div>
        <p v-else class="hero-sum__muted">No items equipped</p>
      </div>
    </div>

    <div v-if="isPhone" class="hero-sum__footer">
      <v-btn size="small" variant="text" :append-icon="collapsed ? 'mdi-chevron-down' : 'mdi-chevron-up'" @click="collapsed = !collapsed">
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
/* PC: the art sets the card's height. */
.hero-sum__main {
  display: flex;
  align-items: stretch;
}
.hero-sum__art {
  display: block;
  flex: 0 0 40%;
  width: 40%;
  aspect-ratio: 1365 / 499;
  object-fit: cover;
}
.hero-sum__info {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 10px;
  min-width: 0;
  padding: 12px 14px;
  overflow: hidden;
}
.hero-sum__top {
  display: flex;
  align-items: flex-start;
  gap: 8px;
}
.hero-sum__footer {
  display: flex;
  align-items: center;
  padding: 4px 12px 10px;
}
/* Stats: compact pills, icon · number · label. */
.hero-sum__stats {
  display: flex;
  flex: 1;
  flex-wrap: wrap;
  gap: 6px;
  min-width: 0;
}
.stat {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  height: 30px;
  padding: 0 10px;
  background: rgb(var(--v-theme-secondary));
  border-radius: 999px;
  white-space: nowrap;
}
.stat strong {
  font-size: 0.9rem;
  font-weight: 800;
}
.stat strong span {
  font-size: 0.72rem;
  font-weight: 600;
  opacity: 0.6;
}
.stat small {
  font-size: 0.62rem;
  font-weight: 700;
  letter-spacing: 0.4px;
  text-transform: uppercase;
  opacity: 0.6;
}
/* Items: one line each, two columns. */
.hero-sum__items {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 6px;
}
.sum-item {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
  height: 32px;
  padding: 0 10px 0 6px;
  background: rgb(var(--v-theme-secondary));
  border-radius: 8px;
  white-space: nowrap;
}
.sum-item__icon {
  display: flex;
  flex: 0 0 28px;
  width: 28px;
  overflow: hidden;
  align-items: center;
  justify-content: center;
}
.sum-item__icon :deep(img) {
  max-width: 100%;
}
.sum-item strong {
  flex: 0 1 auto;
  min-width: 0;
  overflow: hidden;
  font-size: 0.8rem;
  text-overflow: ellipsis;
}
.sum-item small {
  flex: 0 1000 auto;
  min-width: 0;
  overflow: hidden;
  font-size: 0.7rem;
  text-overflow: ellipsis;
  opacity: 0.65;
}
.sum-item small::before {
  content: "· ";
}
.hero-sum__muted {
  margin: 0;
  font-size: 0.75rem;
  opacity: 0.6;
}
/* PC: the info never makes the card taller than the art. */
@media (min-width: 960px) {
  .hero-sum__main {
    position: relative;
  }
  .hero-sum__info {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 40%;
    /* Always from the top-left, whatever the hero has. */
    justify-content: flex-start;
    container-type: size;
  }
  .stat small {
    display: none;
  }
  .stat {
    padding: 0 12px;
  }
}
/* Taller cards: bigger pills and rows, still one line each. */
@container (min-height: 150px) {
  .stat {
    height: 36px;
    padding: 0 14px;
    gap: 7px;
  }
  .stat strong {
    font-size: 1.02rem;
  }
  .hero-sum__items {
    gap: 8px;
  }
  .sum-item {
    height: 42px;
    padding: 0 12px 0 8px;
  }
  .sum-item strong {
    font-size: 0.86rem;
  }
}
/* Lots of room: labels on the numbers too. */
@container (min-height: 190px) and (min-width: 700px) {
  .stat small {
    display: inline;
  }
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
    padding: 12px 12px 4px;
  }
  .hero-sum__items {
    grid-template-columns: minmax(0, 1fr);
  }
  /* Phones: numbers in an even 3-column grid. */
  .hero-sum__stats {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
  .stat {
    justify-content: center;
    height: 34px;
    padding: 0 6px;
    border-radius: 8px;
  }
  .sum-item {
    height: 38px;
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