<template>
  <span :data-testid="'campaign-log-status-' + heroId">
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
      style="background-color: #1f2937 !important"
    >
      <ul>
        <li
          class="py-1"
          v-for="statuses in findStatuses(statusIds)"
          :key="statuses.id"
        >
          {{ statuses.name }}
          <div class="px-4 font-italic" v-if="statuses.effect">
            {{ statuses.effect }}
          </div>
        </li>
      </ul>
    </v-sheet>
  </span>
</template>

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

const statusIds = ref([] as string[]);

props.repository.load(configurationStore.enabledLanguage);

const statuses = props.repository.findAll();

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

<style scoped></style>
