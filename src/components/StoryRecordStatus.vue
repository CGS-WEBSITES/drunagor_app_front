<template>
  <div data-testid="story-record-status">
    <EffectPicker v-model="statusIds" title="Status" :items="statuses" placeholder="Add or remove status" :hint="t('text.status-info')" />
  </div>
</template>

<script setup lang="ts">
import EffectPicker from "@/components/EffectPicker.vue";
import { ref, watch } from "vue";
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

watch(statusIds, (newStatusIds) => {
  campaignStore.find(props.campaignId).statusIds = newStatusIds;
});
</script>

<style scoped></style>
