<script setup lang="ts">
import CampaignLogAura from "@/components/CampaignLogAura.vue";
import CampaignLogOutcome from "@/components/CampaignLogOutcome.vue";
import CampaignLogStatus from "@/components/CampaignLogStatus.vue";
import { CampaignLogStatusRepository } from "@/data/repository/campaign/core/CampaignLogStatusRepository";
import { CampaignLogAuraRepository } from "@/data/repository/campaign/core/CampaignLogAuraRepository";
import { CampaignLogOutcomeRepository } from "@/data/repository/campaign/core/CampaignLogOutcomeRepository";
import { useI18n } from "vue-i18n";

const props = defineProps<{
  heroId: string;
  campaignId: string;
}>();

const statusRepository = new CampaignLogStatusRepository();
const auraRepository = new CampaignLogAuraRepository();
const outcomeRepository = new CampaignLogOutcomeRepository();
const { t } = useI18n();
</script>

<template>
  <v-row no-gutters>
    <v-col cols="12">
      <CampaignLogStatus
        :repository="statusRepository"
        :campaign-id="props.campaignId"
        :hero-id="props.heroId"
      />
    </v-col>
  </v-row>
  <v-row no-gutters>
    <v-col cols="12">
      <CampaignLogOutcome
        :repository="outcomeRepository"
        :campaign-id="props.campaignId"
        :hero-id="props.heroId"
      />
    </v-col>
  </v-row>
  <v-row no-gutters>
    <v-col cols="12">
      <CampaignLogAura
        :repository="auraRepository"
        :campaign-id="props.campaignId"
        :hero-id="props.heroId"
      />
    </v-col>
  </v-row>

   <v-row no-gutters>
    <v-col cols="12">
      <v-btn
        variant="elevated"
        @click="
          $router.push({
            name: 'Hero',
            params: { campaignId: campaignId, heroId: props.heroId },
          })
        "
        >{{ t("label.equipment-skills") }}</v-btn
      >
    </v-col>
  </v-row>
</template>

<style scoped></style>
