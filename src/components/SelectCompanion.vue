<template>
    <template v-if="isAdmin">
      <v-switch
        v-model="hasCompanionHero"
        label="Did Matthias join the party?"
        color="green"
        inset
        density="compact"
        hide-details
      />
      <v-select
        v-if="hasCompanionHero"
        v-model="companionHeroStatus"
        label="Select Matthias Status"
        :items="companionOptions"
        variant="outlined"
        density="compact"
        class="mt-3"
        hide-details
        clearable
      />
    </template>
    
    <template v-else>
      <v-switch
        :model-value="hasCompanionHero"
        label="Did Matthias join the party?"
        color="green"
        inset
        readonly
        disabled
        density="compact"
        hide-details
      />
      <v-text-field
        v-if="hasCompanionHero"
        :model-value="companionHeroStatus"
        label="Matthias Status"
        variant="outlined"
        density="compact"
        class="mt-3"
        readonly
        disabled
        hide-details
      />
    </template>
</template>

<script setup lang="ts">
import { CampaignStore } from "@/store/CampaignStore";
import { computed } from "vue";

const props = defineProps<{
  campaignId: string;
  isAdmin: boolean;
}>();

const campaignStore = CampaignStore();

const companionOptions = [
  "Matthias Cormack (HEALTHY)",
  "Matthias Cormack (INSPIRED)",
  "Matthias Cormack (WOUNDED)",
  "Matthias Cormack (DEMORALIZED)",
];

const hasCompanionHero = computed({
  get() {
    return campaignStore.find(props.campaignId)?.hasCompanionHero ?? false;
  },
  set(newValue) {
    if (props.isAdmin) {
      campaignStore.updateCampaignProperty(props.campaignId, 'hasCompanionHero', newValue);
      if (!newValue) {
        campaignStore.updateCampaignProperty(props.campaignId, 'companionHeroStatus', null);
      }
    }
  },
});

const companionHeroStatus = computed({
  get() {
    return campaignStore.find(props.campaignId)?.companionHeroStatus ?? "";
  },
  set(newValue) {
    if (props.isAdmin) {
      campaignStore.updateCampaignProperty(props.campaignId, 'companionHeroStatus', newValue);
    }
  },
});
</script>