<template>
  <div class="hero-sum">
    <div class="hero-sum__main">
      <img :src="heroArt" :alt="hero.name" class="hero-sum__art" />

      <div class="hero-sum__info">
        <!-- Numbers at a glance -->
        <div class="hero-sum__stats">
          <template v-if="adventure">
            <span class="stat" title="Life points"><v-icon size="16" color="#e05353">mdi-heart</v-icon>{{ adventure.lifepoints ?? 0 }}</span>
            <span class="stat" title="Available / used cubes"><v-icon size="16">mdi-cube-outline</v-icon>{{ adventure.availableCubes ?? 0 }}/{{ adventure.usedCubes ?? 0 }}</span>
            <span class="stat" title="Curse cubes"><v-icon size="16" color="#9c6ade">mdi-cube</v-icon>{{ adventure.curseCubes ?? 0 }}</span>
            <span class="stat" title="Trauma cubes"><v-icon size="16" color="#9e9e9e">mdi-cube</v-icon>{{ adventure.traumaCubes ?? 0 }}</span>
          </template>
          <span class="stat" title="Class abilities"><v-icon size="16" color="accent">mdi-star-circle</v-icon>{{ state?.classAbilityCount ?? 0 }}</span>
          <span class="stat" title="Skills"><v-icon size="16">mdi-lightning-bolt</v-icon>{{ skillCount }} skills</span>
        </div>

        <!-- Equipped items -->
        <div class="hero-sum__items">
          <span v-for="item in equipped" :key="item.slot" class="sum-item" :title="item.slot">
            <v-icon size="14">{{ item.icon }}</v-icon>{{ item.name }}
          </span>
          <span v-if="!equipped.length" class="hero-sum__muted">No items equipped</span>
          <span v-if="state?.stashedCardIds?.length" class="hero-sum__muted">+{{ state.stashedCardIds.length }} in stash</span>
        </div>

        <!-- Effects -->
        <div v-if="effectCount" class="hero-sum__effects">
          <span v-if="state?.auraId" class="sum-chip">Aura</span>
          <span v-if="state?.statusIds?.length" class="sum-chip">{{ state.statusIds.length }} status</span>
          <span v-if="state?.outcomeIds?.length" class="sum-chip">{{ state.outcomeIds.length }} {{ campaign.campaign === "underkeep" ? "dungeon role" : "outcome" }}</span>
        </div>

        <div class="hero-sum__actions">
          <v-btn
            v-if="isSequentialAdventure"
            size="small"
            variant="tonal"
            prepend-icon="mdi-shield-half-full"
            class="shepherd-btn-manage-resources"
            @click.stop="openSequentialStateEditor"
          >
            {{ t("Manage Resources") }}
          </v-btn>
          <v-btn size="small" variant="flat" color="accent" prepend-icon="mdi-sword-cross" class="shepherd-btn-equipment-skills" @click.stop="openHeroEquipmentSkills">
            {{ t("label.equipment-skills") }}
          </v-btn>
          <v-btn size="small" variant="text" :append-icon="open ? 'mdi-chevron-up' : 'mdi-chevron-down'" @click="open = !open">
            {{ campaign.campaign === "underkeep" ? "Status · Dungeon role" : "Status · Outcome · Aura" }}
          </v-btn>
        </div>
      </div>
    </div>

    <v-expand-transition>
      <div v-if="open" class="hero-sum__editors">
        <v-row no-gutters>
            <v-col cols="12">
              <CampaignLogSequentialAdventure
                v-if="isSequentialAdventure"
                :hero="hero"
                :campaign-id="campaignId"
                :hide-manage-button="true"
              />
            </v-col>

            <v-col cols="12">
              <CampaignLogCore
                v-if="campaign.campaign == 'core'"
                :campaign-id="props.campaignId"
                :hero-id="props.heroId"
                :hide-equipment-button="true"
              />
            </v-col>

            <v-col cols="12">
              <CampaignLogAwakenings
                v-if="campaign.campaign == 'awakenings'"
                :campaign-id="props.campaignId"
                :hero-id="props.heroId"
                :hide-equipment-button="true"
              />
            </v-col>

            <v-col cols="12">
              <CampaignLogApocalypse
                v-if="campaign.campaign == 'apocalypse'"
                :campaign-id="props.campaignId"
                :hero-id="props.heroId"
                :hide-equipment-button="true"
              />
            </v-col>

            <v-col cols="12">
              <CampaignLogUnderKeep
                v-if="campaign.campaign == 'underkeep'"
                :campaign-id="props.campaignId"
                :hero-id="props.heroId"
                :hide-equipment-button="true"
              />
            </v-col>

            <v-col cols="12">
              <CampaignLogUnderKeep2
                v-if="campaign.campaign == 'underkeep2'"
                :campaign-id="props.campaignId"
                :hero-id="props.heroId"
                :hide-equipment-button="true"
              />
            </v-col>

        </v-row>
      </div>
    </v-expand-transition>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { HeroStore } from "@/store/HeroStore";
import { allItemsRepository } from "@/data/repository/AllItemsRepository";
import { HeroDataRepository } from "@/data/repository/HeroDataRepository";
import type { HeroData } from "@/data/repository/HeroData";
import { CampaignStore } from "@/store/CampaignStore";
import { useRouter } from "vue-router";
import CampaignLogCore from "./CampaignLogCore.vue";
import CampaignLogUnderKeep from "./CampaignLogUnderKeep.vue";
import CampaignLogUnderKeep2 from "./CampaignLogUnderKeep2.vue";
import CampaignLogAwakenings from "./CampaignLogAwakenings.vue";
import CampaignLogApocalypse from "./CampaignLogApocalypse.vue";
import CampaignLogSequentialAdventure from "@/components/CampaignLogSequentialAdventure.vue";
import { useI18n } from "vue-i18n";

const props = defineProps<{
  heroId: string;
  campaignId: string;
  isSequentialAdventure: boolean;
}>();

const heroDataRepository = new HeroDataRepository();
const campaignStore = CampaignStore();
const router = useRouter();
const { t } = useI18n();

const campaign = campaignStore.find(props.campaignId);
const hero = heroDataRepository.find(props.heroId) ?? ({} as HeroData);

const heroStore = HeroStore();
const open = ref(false);
const state = computed(() => heroStore.findInCampaignOptional(props.heroId, props.campaignId));
const adventure = computed(() => state.value?.sequentialAdventureState as any);
const skillCount = computed(() => (state.value?.skillIds ?? []).length);
const effectCount = computed(
  () => (state.value?.auraId ? 1 : 0) + (state.value?.statusIds?.length ?? 0) + (state.value?.outcomeIds?.length ?? 0),
);

const SLOTS = [
  { key: "weaponId", slot: "Weapon", icon: "mdi-sword" },
  { key: "offHandId", slot: "Off hand", icon: "mdi-shield-half-full" },
  { key: "armorId", slot: "Armor", icon: "mdi-shield-account" },
  { key: "trinketId", slot: "Trinket", icon: "mdi-diamond-stone" },
  { key: "bagOneId", slot: "Bag", icon: "mdi-bag-personal" },
  { key: "bagTwoId", slot: "Bag", icon: "mdi-bag-personal" },
] as const;
const equipped = computed(() =>
  SLOTS.map((entry) => {
    const id = (state.value?.equipment as any)?.[entry.key];
    const item = id ? allItemsRepository.find(id) : undefined;
    return id ? { slot: entry.slot, icon: entry.icon, name: item ? t(item.translation_key) : id } : null;
  }).filter((entry) => entry !== null) as { slot: string; icon: string; name: string }[],
);
const heroArt = (hero.images as any)?.trackerInfo || hero.images?.avatar;


function openSequentialStateEditor() {
  router.push({
    name: "HeroSequentialState",
    params: { campaignId: props.campaignId, heroId: props.heroId },
  });
}

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
  gap: 16px;
}
/* The art keeps its shape: a fixed share of the card on PC. */
.hero-sum__art {
  display: block;
  flex: 0 0 44%;
  width: 44%;
  aspect-ratio: 1365 / 499;
  object-fit: cover;
  align-self: flex-start;
}
.hero-sum__info {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 8px;
  min-width: 0;
  padding: 12px 14px 12px 0;
}
.hero-sum__stats,
.hero-sum__items,
.hero-sum__effects {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}
.stat {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 3px 8px;
  background: rgb(var(--v-theme-secondary));
  border-radius: 6px;
  font-size: 0.8rem;
  font-weight: 700;
}
.sum-item {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  max-width: 100%;
  padding: 2px 8px;
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 999px;
  font-size: 0.72rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.sum-chip {
  padding: 2px 8px;
  background: rgba(var(--v-theme-accent), 0.2);
  border-radius: 999px;
  color: rgb(var(--v-theme-accent));
  font-size: 0.7rem;
  font-weight: 800;
  text-transform: uppercase;
}
.hero-sum__muted {
  font-size: 0.75rem;
  opacity: 0.6;
}
.hero-sum__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: auto;
}
.hero-sum__editors {
  padding: 12px 16px 4px;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
}
@media (max-width: 959px) {
  .hero-sum__main {
    flex-direction: column;
    gap: 0;
  }
  .hero-sum__art {
    width: 100%;
  }
  .hero-sum__info {
    padding: 12px;
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