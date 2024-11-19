<script setup lang="ts">
import { ref, watch } from "vue";
import type { Status } from "@/data/repository/campaign/Status";
import { HeroStore } from "@/store/HeroStore";
import type { StatusRepository } from "@/data/repository/campaign/StatusRepository";
import { useI18n } from "vue-i18n";
import { ConfigurationStore } from "@/store/ConfigurationStore";

const props = defineProps<{
  heroId: string;
  campaignId: string;
  repository: StatusRepository;
}>();

const heroStore = HeroStore();
const configurationStore = ConfigurationStore();
const { t } = useI18n();
props.repository.load(configurationStore.enabledLanguage);

const statuses = props.repository.findAll();

const statusIds = ref([] as string[]);
statusIds.value =
  heroStore.findInCampaign(props.heroId, props.campaignId).statusIds ?? [];

function findStatuses(statusIds: string[]): Status[] {
  const statuses: Status[] = [];
  statusIds.forEach((statusId) => {
    let status = props.repository.find(statusId);
    if (status) {
      statuses.push(status);
    }
  });

  return statuses;
}

watch(statusIds, (newStatusIds) => {
  heroStore.findInCampaign(props.heroId, props.campaignId).statusIds =
    newStatusIds;
});
</script>

<template>

  <span :data-testid="'campaign-log-status-' + heroId">

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

    <v-sheet v-if="outcomeIds.length > 0" rounded border="md" class="mb-6 pa-6 text-white">
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
    
    <MultiSelect
      v-model="statusIds"
      :options="statuses"
      :maxSelectedLabels="1"
      filter
      optionLabel="name"
      optionValue="id"
      :placeholder="$t('text.add-or-remove-status')"
      class="w-full md:w-14rem"
    />
    <template v-if="statusIds.length > 0">
      <p class="text-sm text-gray-500 py-2">{{ t("text.status-info") }}</p>
      <ul id="campaign-log-status-display" class="list-disc list-inside">
        <template v-for="status in findStatuses(statusIds)" :key="status.id">
          <li>
            {{ status.name }}
            <span class="px-4 block" v-if="status.effect">
              {{ status.effect }}
            </span>
          </li>
        </template>
      </ul>
    </template>
  </span>
</template>

<style scoped></style>
