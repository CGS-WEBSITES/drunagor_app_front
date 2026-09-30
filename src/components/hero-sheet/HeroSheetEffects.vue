<template>
  <div class="effects-card">
    <div class="sheet-title-row">
      <h3 class="sheet-title">Aura · Status · Outcome</h3>
    </div>

    <!-- Each campaign has its own effects. -->
    <v-select
      v-model="campaign"
      :items="CAMPAIGNS"
      item-title="label"
      item-value="id"
      variant="solo"
      density="compact"
      flat
      hide-details
      prepend-inner-icon="mdi-book-open-page-variant"
      class="effects-card__campaign"
    />

    <EffectPicker
      v-if="current.aura"
      :model-value="state.auraId ? [state.auraId] : []"
      title="Aura"
      :items="current.aura"
      :multiple="false"
      placeholder="Select an aura"
      hint="Aura is removed when you receive a trauma cube or another aura"
      @update:model-value="state.auraId = $event[0] ?? null"
    />
    <EffectPicker
      v-model="state.statusIds"
      title="Status"
      :items="current.status"
      placeholder="Add or remove status"
      hint="Statuses are removed during the camp phase"
    />
    <EffectPicker
      v-if="current.outcome"
      v-model="state.outcomeIds"
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

const props = defineProps<{ state: Hero }>();

type Effect = { id: string; name: string; effect?: string };
type Repo = { load(locale: string): void; findAll(): Effect[] };

// Repositories read translations with useI18n, so they load here in setup.
const language = ConfigurationStore().enabledLanguage;
const load = (repository: Repo) => {
  repository.load(language);
  return repository.findAll();
};

const CAMPAIGNS = [
  { id: "core", label: "Core campaign", aura: load(new CoreAura()), status: load(new CoreStatus()), outcome: load(new CoreOutcome()), outcomeLabel: "Outcome" },
  { id: "awakenings", label: "Awakenings", aura: load(new AwakeningsAura()), status: load(new AwakeningsStatus()), outcome: null, outcomeLabel: "Outcome" },
  { id: "apocalypse", label: "Apocalypse", aura: load(new ApocalypseAura()), status: load(new ApocalypseStatus()), outcome: load(new ApocalypseOutcome()), outcomeLabel: "Outcome" },
  { id: "underkeep", label: "Drunagor Nights – Season 1", aura: null, status: load(new Season1Status()), outcome: load(new Season1Outcome()), outcomeLabel: "Dungeon role" },
  { id: "underkeep2", label: "Drunagor Nights – Season 2", aura: null, status: load(new Season2Status()), outcome: load(new Season2Outcome()), outcomeLabel: "Outcome" },
];

const heroState = props.state as Hero & { effectsCampaign?: string };
if (!heroState.statusIds) heroState.statusIds = [];
if (!heroState.outcomeIds) heroState.outcomeIds = [];

// Which campaign's effects this hero uses, saved with the hero.
const campaign = computed({
  get: () => heroState.effectsCampaign ?? "core",
  set: (value: string) => {
    heroState.effectsCampaign = value;
  },
});
const current = computed(() => CAMPAIGNS.find((entry) => entry.id === campaign.value) ?? CAMPAIGNS[0]);
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
</style>
