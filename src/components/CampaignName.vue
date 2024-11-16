<script setup lang="ts">
import { CampaignStore } from "@/store/CampaignStore";
import { ref, watch } from "vue";
import { useI18n } from "vue-i18n";

const props = defineProps<{
  campaignId: string;
}>();
const { t } = useI18n();

const campaignStore = CampaignStore();
const campaign = campaignStore.find(props.campaignId);
const name = ref(campaign.name);

watch(name, async (newName) => {
  campaignStore.find(props.campaignId).name = newName;
});
</script>

<template>
  <v-text-field
    :label="t('text.party-name')"
    variant="outlined"
    v-model="name"
  ></v-text-field>
</template>

<style scoped></style>
