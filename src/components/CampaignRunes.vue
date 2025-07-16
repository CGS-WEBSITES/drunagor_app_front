<template>
  <v-number-input
    :reverse="false"
    controlVariant="split"
    :label="t('text.number-of-runes')"
    :hideInput="false"
    :inset="false"
    variant="outlined"
    id="runes"
    :min="0"
    v-model="campaignStore.find(props.campaignId).sequentialAdventureRunes"
  ></v-number-input>
</template>

<script setup lang="ts">
import { CampaignStore } from "@/store/CampaignStore";
import { useI18n } from "vue-i18n";

const campaignStore = CampaignStore();
const { t } = useI18n();

const props = defineProps<{
  campaignId: string;
}>();
</script>

<style scoped></style>
