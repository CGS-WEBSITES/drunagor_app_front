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

  <v-row no-gutters class="mt-4">
    <v-col cols="12" class="d-flex justify-center">
      <HeroDetailSummary
        :campaign-id="props.campaignId"
        :hero-id="props.heroId"
      />
    </v-col>
  </v-row>

  <v-row no-gutters class="mt-4">
    <v-col cols="12" class="d-flex  flex-wrap" style="gap: 8px">
      <v-btn
        variant="elevated"
        rounded
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

<script setup lang="ts">
import { useI18n } from "vue-i18n";
import CampaignLogOutcome from "@/components/CampaignLogOutcome.vue";
import CampaignLogStatus from "@/components/CampaignLogStatus.vue";
import { CampaignLogStatusRepository } from "@/data/repository/campaign/underkeep/CampaignLogStatusRepository";
import { CampaignLogOutcomeRepository } from "@/data/repository/campaign/underkeep/CampaignLogOutcomeRepository";
import HeroDetailSummary from "@/components/HeroDetailSummary.vue";

const props = defineProps<{
  heroId: string;
  campaignId: string;
}>();

const statusRepository = new CampaignLogStatusRepository();
const outcomeRepository = new CampaignLogOutcomeRepository();
const { t } = useI18n();
</script>