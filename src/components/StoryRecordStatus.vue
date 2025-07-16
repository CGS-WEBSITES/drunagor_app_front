<template>
  <span data-testid="story-record-status">
    <v-select
      v-model="statusIds"
      clearable
      chips
      :label="$t('text.add-or-remove-status')"
      :hint="$t('text.status-info')"
      :items="statuses"
      item-title="name"
      item-value="id"
      multiple
      variant="outlined"
    ></v-select>

    <v-sheet
      v-if="statusIds.length > 0"
      rounded
      border="md"
      class="mb-6 pa-6 text-white"
    >
      <ul>
        <li
          class="py-1"
          v-for="status in findStatuses(statusIds)"
          :key="status.id"
        >
          {{ status.name }}
          <div class="px-4 font-italic" v-if="status.effect">
            {{ status.effect }}
          </div>
        </li>
      </ul>
    </v-sheet>
  </span>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import type { Status } from "@/data/repository/campaign/Status";
import type { StatusRepository } from "@/data/repository/campaign/StatusRepository";
import { CampaignStore } from "@/store/CampaignStore";
import { useI18n } from "vue-i18n";
import { ConfigurationStore } from "@/store/ConfigurationStore";

const props = defineProps<{
  campaignId: string;
  repository: StatusRepository;
}>();

const campaignStore = CampaignStore();
const configurationStore = ConfigurationStore();
const { t } = useI18n();
props.repository.load(configurationStore.enabledLanguage);

const statuses = props.repository.findAll();

const statusIds = ref([] as string[]);
statusIds.value = campaignStore.find(props.campaignId).statusIds ?? [];

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
  campaignStore.find(props.campaignId).statusIds = newStatusIds;
});
</script>

<style scoped></style>
