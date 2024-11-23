<script setup lang="ts">
import CampaignLogAura from "@/components/CampaignLogAura.vue";
import CampaignLogStatus from "@/components/CampaignLogStatus.vue";
import { CampaignLogStatusRepository } from "@/data/repository/campaign/awakenings/CampaignLogStatusRepository";
import { CampaignLogAuraRepository } from "@/data/repository/campaign/awakenings/CampaignLogAuraRepository";
import { useI18n } from "vue-i18n";

const props = defineProps<{
  heroId: string;
  campaignId: string;
}>();

const statusRepository = new CampaignLogStatusRepository();
const auraRepository = new CampaignLogAuraRepository();
const { t } = useI18n();
</script>

<template>
  <div class="pt-2 w-full">
    <CampaignLogStatus
      :repository="statusRepository"
      :campaign-id="props.campaignId"
      :hero-id="props.heroId"
    />
  </div>
  <div class="pt-2 w-full">
    <CampaignLogAura
      :repository="auraRepository"
      :campaign-id="props.campaignId"
      :hero-id="props.heroId"
    />
  </div>
  <v-row no-gutters>
    <v-col cols="12">
      <v-btn
        variant="outlined"
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
