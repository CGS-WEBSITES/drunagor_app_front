<template>
  <div data-testid="story-record-outcome">
    <EffectPicker v-model="outcomeIds" title="Outcomes" :items="outcomes" placeholder="Add or remove outcome" />
  </div>
</template>

<script setup lang="ts">
import EffectPicker from "@/components/EffectPicker.vue";
import { ref, watch } from "vue";
import type { OutcomeRepository } from "@/data/repository/campaign/OutcomeRepository";
import { CampaignStore } from "@/store/CampaignStore";
import { ConfigurationStore } from "@/store/ConfigurationStore";

const props = defineProps<{
  campaignId: string;
  repository: OutcomeRepository;
}>();

const campaignStore = CampaignStore();
const configurationStore = ConfigurationStore();
props.repository.load(configurationStore.enabledLanguage);

const outcomes = props.repository.findAll();

const outcomeIds = ref([] as string[]);
outcomeIds.value = campaignStore.find(props.campaignId).outcomeIds ?? [];

watch(outcomeIds, (newOutcomeIds) => {
  campaignStore.find(props.campaignId).outcomeIds = newOutcomeIds;
});
</script>

<style scoped></style>
