<template>
  <span :data-testid="'campaign-log-outcome-' + heroId">
    <v-select
      v-model="outcomeIds"
      clearable
      chips
      :label="dynamicLabel"
      :hint="dynamicHint"
      :items="outcomes"
      item-title="name"
      item-value="id"
      multiple
      variant="outlined"
    ></v-select>
  </span>
</template>

<script setup lang="ts">
import { ref, watch, computed } from "vue";
import { useI18n } from "vue-i18n";
import { CampaignStore } from "@/store/CampaignStore";
import type { Outcome } from "@/data/repository/campaign/Outcome";
import { HeroStore } from "@/store/HeroStore";
import type { OutcomeRepository } from "@/data/repository/campaign/OutcomeRepository";
import { ConfigurationStore } from "@/store/ConfigurationStore";

const props = defineProps<{
  heroId: string;
  campaignId: string;
  repository: OutcomeRepository;
}>();

const { t } = useI18n();
const heroStore = HeroStore();
const configurationStore = ConfigurationStore();
const campaignStore = CampaignStore();
const campaign = campaignStore.find(props.campaignId);
props.repository.load(configurationStore.enabledLanguage);

const outcomeIds = ref([] as string[]);

const dynamicLabel = computed(() => {
  if (campaign && campaign.campaign === "underkeep") {
    return t("Select Dungeon Role");
  }
  return t("text.add-or-remove-outcome");
});

const dynamicHint = computed(() => {
  if (campaign && campaign.campaign === "underkeep") {
    return t("select dungeon role");
  }
  return t("text.outcome-info");
});

const outcomes = props.repository.findAll();

outcomeIds.value =
  heroStore.findInCampaign(props.heroId, props.campaignId).outcomeIds ?? [];

watch(outcomeIds, (newOutcomeIds) => {
  heroStore.findInCampaign(props.heroId, props.campaignId).outcomeIds =
    newOutcomeIds;
});
</script>
