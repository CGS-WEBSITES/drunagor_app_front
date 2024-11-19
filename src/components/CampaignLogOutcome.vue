<script setup lang="ts">
import { ref, watch } from "vue";
import type { Outcome } from "@/data/repository/campaign/Outcome";
import { HeroStore } from "@/store/HeroStore";
import type { OutcomeRepository } from "@/data/repository/campaign/OutcomeRepository";
import { ConfigurationStore } from "@/store/ConfigurationStore";
import MultiSelect from "primevue/multiselect";

const props = defineProps<{
  heroId: string;
  campaignId: string;
  repository: OutcomeRepository;
}>();

const heroStore = HeroStore();
const configurationStore = ConfigurationStore();
props.repository.load(configurationStore.enabledLanguage);

const outcomes = props.repository.findAll();

const outcomeIds = ref([] as string[]);
outcomeIds.value =
  heroStore.findInCampaign(props.heroId, props.campaignId).outcomeIds ?? [];

function findOutcomes(outcomeIds: string[]): Outcome[] {
  const outcomes: Outcome[] = [];
  outcomeIds.forEach((outcomeId) => {
    let outcome = props.repository.find(outcomeId);
    if (outcome) {
      outcomes.push(outcome);
    }
  });

  return outcomes;
}

watch(outcomeIds, (newOutcomeIds) => {
  heroStore.findInCampaign(props.heroId, props.campaignId).outcomeIds =
    newOutcomeIds;
});
</script>

<template>
  <span :data-testid="'campaign-log-outcome-' + heroId">
    <v-select
      v-model="outcomeIds"
      clearable
      chips
      :label="$t('text.add-or-remove-outcome')"
      :hint="$t('text.outcome-info')"
      :items="outcomes"
      item-title="name"
      item-value="id"
      multiple
      variant="outlined"
    ></v-select>

    <v-sheet
      v-if="outcomeIds.length > 0"
      rounded
      border="md"
      class="mb-6 pa-6 text-white"
      style="background-color: #1f2937 !important"
    >
      <ul>
        <li
          class="py-1"
          v-for="outcome in findOutcomes(outcomeIds)" :key="outcome.id"
        >
          {{ outcome.name }}
          <div class="px-4 font-italic" v-if="outcome.effect">
            {{ outcome.effect }}
          </div>
        </li>
      </ul>
    </v-sheet>
  </span>
</template>

<style scoped></style>
