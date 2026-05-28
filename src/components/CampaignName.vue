<template>
  <v-text-field
    v-if="isAdmin"
    :label="t('text.party-name')"
    variant="solo-filled"
    v-model="partyName"
  ></v-text-field>
  <v-text-field
    v-else
    :label="t('text.party-name')"
    variant="solo-filled"
    :model-value="partyName"
    readonly
    disabled
  ></v-text-field>
</template>

<script setup lang="ts">
import { CampaignStore } from "@/store/CampaignStore";
import { computed } from "vue";
import { useI18n } from "vue-i18n";

const props = withDefaults(
  defineProps<{
    campaignId: string;
    isAdmin?: boolean;
  }>(),
  {
    isAdmin: true,
  }
);

const { t } = useI18n();
const campaignStore = CampaignStore();

const partyName = computed({
  get() {
    return campaignStore.find(props.campaignId)?.name ?? '';
  },
  set(newValue) {
    if (props.isAdmin) {
      campaignStore.updateCampaignProperty(props.campaignId, 'name', newValue);
    }
  },
});
</script>