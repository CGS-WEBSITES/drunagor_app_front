<template>
  <v-text-field
    :label="t('text.party-name')"
    variant="solo-filled"
    v-model="partyName"
  ></v-text-field>
</template>

<script setup lang="ts">
import { CampaignStore } from "@/store/CampaignStore";
import { computed } from "vue";
import { useI18n } from "vue-i18n";

const props = defineProps<{
  campaignId: string;
}>();

const { t } = useI18n();
const campaignStore = CampaignStore();

const partyName = computed({
  get() {
    return campaignStore.find(props.campaignId)?.name ?? '';
  },
  set(newValue) {
    campaignStore.updateCampaignProperty(props.campaignId, 'name', newValue);
  },
});
</script>