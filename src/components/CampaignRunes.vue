<script setup lang="ts">
import { CampaignStore } from "@/store/CampaignStore";
import { useI18n } from "vue-i18n";
import { VNumberInput } from 'vuetify/labs/VNumberInput'

const campaignStore = CampaignStore();

const props = defineProps<{
  campaignId: string;
}>();
const { t } = useI18n();
</script>

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

<style scoped></style>
