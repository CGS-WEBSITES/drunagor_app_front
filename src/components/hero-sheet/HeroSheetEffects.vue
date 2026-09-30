<template>
  <div class="effects-card">
    <div class="sheet-title-row">
      <h3 class="sheet-title">Aura · Status · Outcome</h3>
    </div>

    <!-- Each campaign keeps its own picks; switching just shows another one. -->
    <v-select
      v-model="campaign"
      :items="campaigns"
      item-title="label"
      item-value="id"
      variant="solo"
      density="compact"
      flat
      hide-details
      prepend-inner-icon="mdi-book-open-page-variant"
      class="effects-card__campaign"
    >
      <template #item="{ props: itemProps, item }">
        <v-list-item v-bind="itemProps">
          <template #append>
            <span v-if="countFor(item.raw.id)" class="effects-count">{{ countFor(item.raw.id) }}</span>
          </template>
        </v-list-item>
      </template>
      <template #selection="{ item }">
        <span class="effects-card__selection">
          {{ item.raw.label }}
          <span v-if="countFor(item.raw.id)" class="effects-count">{{ countFor(item.raw.id) }}</span>
        </span>
      </template>
    </v-select>

    <EffectPicker
      v-if="current.aura"
      :model-value="picks.auraId ? [picks.auraId] : []"
      title="Aura"
      :items="current.aura"
      :multiple="false"
      placeholder="Select an aura"
      hint="Aura is removed when you receive a trauma cube or another aura"
      @update:model-value="picks.auraId = $event[0] ?? null"
    />
    <EffectPicker
      v-model="picks.statusIds"
      title="Status"
      :items="current.status"
      placeholder="Add or remove status"
      hint="Statuses are removed during the camp phase"
    />
    <EffectPicker
      v-if="current.outcome"
      v-model="picks.outcomeIds"
      :title="current.outcomeLabel"
      :items="current.outcome"
      :placeholder="`Add or remove ${current.outcomeLabel.toLowerCase()}`"
      hint="Remain in effect for the entire campaign unless some other effect changes them"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { Hero } from "@/store/Hero";
import { ConfigurationStore } from "@/store/ConfigurationStore";
import EffectPicker from "@/components/EffectPicker.vue";
import { CampaignLogAuraRepository as CoreAura } from "@/data/repository/campaign/core/CampaignLogAuraRepository";
import { CampaignLogStatusRepository as CoreStatus } from "@/data/repository/campaign/core/CampaignLogStatusRepository";
import { CampaignLogOutcomeRepository as CoreOutcome } from "@/data/repository/campaign/core/CampaignLogOutcomeRepository";
import { CampaignLogAuraRepository as AwakeningsAura } from "@/data/repository/campaign/awakenings/CampaignLogAuraRepository";
import { CampaignLogStatusRepository as AwakeningsStatus } from "@/data/repository/campaign/awakenings/CampaignLogStatusRepository";
import { CampaignLogAuraRepository as ApocalypseAura } from "@/data/repository/campaign/apocalypse/CampaignLogAuraRepository";
import { CampaignLogStatusRepository as ApocalypseStatus } from "@/data/repository/campaign/apocalypse/CampaignLogStatusRepository";
import { CampaignLogOutcomeRepository as ApocalypseOutcome } from "@/data/repository/campaign/apocalypse/CampaignLogOutcomeRepository";
import { CampaignLogStatusRepository as Season1Status } from "@/data/repository/campaign/underkeep/CampaignLogStatusRepository";
import { CampaignLogOutcomeRepository as Season1Outcome } from "@/data/repository/campaign/underkeep/CampaignLogOutcomeRepository";
import { CampaignLogStatusRepository as Season2Status } from "@/data/repository/campaign/underkeep2/CampaignLogStatusRepository";
import { CampaignLogOutcomeRepository as Season2Outcome } from "@/data/repository/campaign/underkeep2/CampaignLogOutcomeRepository";
import { NIGHTS_HEROES } from "@/data/heroMeta";

const props = defineProps<{ state: Hero }>();

type Effect = { id: string; name: string; effect?: string };
type Repo = { load(locale: string): void; findAll(): Effect[] };
interface Picks {
  auraId: string | null;
  statusIds: string[];
  outcomeIds: string[];
}

// Repositories read translations with useI18n, so they load here in setup.
const language = ConfigurationStore().enabledLanguage;
const load = (repository: Repo) => {
  repository.load(language);
  return repository.findAll();
};

const ALL_CAMPAIGNS = [
  { id: "core", short: "Core", label: "Core campaign", aura: load(new CoreAura()), status: load(new CoreStatus()), outcome: load(new CoreOutcome()), outcomeLabel: "Outcome" },
  { id: "awakenings", short: "Awakenings", label: "Awakenings", aura: load(new AwakeningsAura()), status: load(new AwakeningsStatus()), outcome: null, outcomeLabel: "Outcome" },
  { id: "apocalypse", short: "Apocalypse", label: "Apocalypse", aura: load(new ApocalypseAura()), status: load(new ApocalypseStatus()), outcome: load(new ApocalypseOutcome()), outcomeLabel: "Outcome" },
  { id: "underkeep", short: "DN S1", label: "Drunagor Nights – Season 1", aura: null, status: load(new Season1Status()), outcome: load(new Season1Outcome()), outcomeLabel: "Dungeon role", nights: true },
  { id: "underkeep2", short: "DN S2", label: "Drunagor Nights – Season 2", aura: null, status: load(new Season2Status()), outcome: load(new Season2Outcome()), outcomeLabel: "Dungeon role", nights: true },
];

// Drunagor Nights is only played with the five Core heroes.
const campaigns = computed(() =>
  ALL_CAMPAIGNS.filter((entry) => !entry.nights || NIGHTS_HEROES.includes(props.state.heroId)),
);

type HeroWithEffects = Hero & { effectsCampaign?: string; effectsByCampaign?: Record<string, Picks> };
const heroState = props.state as HeroWithEffects;

// Older saves kept one shared list: it becomes the picks of the campaign it was made for.
if (!heroState.effectsByCampaign) {
  heroState.effectsByCampaign = {};
  const legacy = heroState.effectsCampaign ?? "core";
  if (heroState.auraId || heroState.statusIds?.length || heroState.outcomeIds?.length) {
    heroState.effectsByCampaign[legacy] = {
      auraId: heroState.auraId ?? null,
      statusIds: [...(heroState.statusIds ?? [])],
      outcomeIds: [...(heroState.outcomeIds ?? [])],
    };
  }
}

const campaign = computed({
  get: () => {
    const saved = heroState.effectsCampaign ?? "core";
    return campaigns.value.some((entry) => entry.id === saved) ? saved : "core";
  },
  set: (value: string) => {
    heroState.effectsCampaign = value;
  },
});
const current = computed(() => campaigns.value.find((entry) => entry.id === campaign.value) ?? campaigns.value[0]);

const picksFor = (id: string): Picks => {
  const all = heroState.effectsByCampaign!;
  if (!all[id]) all[id] = { auraId: null, statusIds: [], outcomeIds: [] };
  return all[id];
};
const picks = computed(() => picksFor(campaign.value));
const countFor = (id: string) => {
  const entry = heroState.effectsByCampaign?.[id];
  return entry ? (entry.auraId ? 1 : 0) + entry.statusIds.length + entry.outcomeIds.length : 0;
};
</script>

<style scoped>
.effects-card__campaign {
  margin-bottom: 16px;
}
.effects-card__campaign :deep(.v-field) {
  background: rgba(255, 255, 255, 0.08);
  border-radius: 6px;
  font-size: 0.85rem;
}
.effects-card__selection {
  display: flex;
  align-items: center;
  gap: 8px;
}
/* How many effects are picked in that campaign. */
.effects-count {
  min-width: 18px;
  padding: 0 6px;
  background: rgb(var(--v-theme-accent));
  border-radius: 999px;
  color: #141414;
  font-size: 0.68rem;
  font-weight: 800;
  line-height: 18px;
  text-align: center;
}
</style>
