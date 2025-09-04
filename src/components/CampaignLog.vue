<template>
  <v-expansion-panels
    variant="accordion"
    class="mb-2"
  >
    <v-expansion-panel
      elevation="16"
      rounded
      style="background-color: #1f2937"
    >
      <v-expansion-panel-title class="pa-3">
        <div class="d-flex align-center w-100">
          <v-avatar
            :image="hero.images?.avatar"
            size="48"
            class="mr-3"
            rounded="sm"
          />
          <div class="text-left">
            <h3 class="text-h6 font-weight-bold text-white mb-0">
              {{ hero.name }}
            </h3>
            <p class="text-caption text-grey-400 mb-0">
              {{ hero.class }} - Level {{ hero.level || 1 }}
            </p>
          </div>
        </div>
      </v-expansion-panel-title>

      <v-expansion-panel-text class="pa-0">
        <v-card-text class="px-0 pt-0">
          <v-row no-gutters>
            <v-col cols="12">
              <v-img :src="hero.images.trackerInfo" contain />
            </v-col>
          </v-row>
        </v-card-text>
        
        <v-card-actions>
          <v-row no-gutters>
            <v-col cols="12">
              <CampaignLogSequentialAdventure
                v-if="isSequentialAdventure"
                :hero="hero"
                :campaign-id="campaignId"
              />
            </v-col>

            <v-col cols="12">
              <CampaignLogCore
                v-if="campaign.campaign == 'core'"
                :campaign-id="props.campaignId"
                :hero-id="props.heroId"
              />
            </v-col>

            <v-col cols="12">
              <CampaignLogAwakenings
                v-if="campaign.campaign == 'awakenings'"
                :campaign-id="props.campaignId"
                :hero-id="props.heroId"
              />
            </v-col>

            <v-col cols="12">
              <CampaignLogApocalypse
                v-if="campaign.campaign == 'apocalypse'"
                :campaign-id="props.campaignId"
                :hero-id="props.heroId"
              />
            </v-col>

            <v-col cols="12">
              <CampaignLogUnderKeep
                v-if="campaign.campaign == 'underkeep'"
                :campaign-id="props.campaignId"
                :hero-id="props.heroId"
              />
            </v-col>
          </v-row>
        </v-card-actions>
      </v-expansion-panel-text>
    </v-expansion-panel>
  </v-expansion-panels>
</template>

<script setup lang="ts">
import { HeroDataRepository } from "@/data/repository/HeroDataRepository";
import type { HeroData } from "@/data/repository/HeroData";
import { CampaignStore } from "@/store/CampaignStore";
import CampaignLogCore from "./CampaignLogCore.vue";
import CampaignLogUnderKeep from "./CampaignLogUnderKeep.vue";
import CampaignLogAwakenings from "./CampaignLogAwakenings.vue";
import CampaignLogApocalypse from "./CampaignLogApocalypse.vue";
import CampaignLogSequentialAdventure from "@/components/CampaignLogSequentialAdventure.vue";
import { useI18n } from "vue-i18n";

const props = defineProps<{
  heroId: string;
  campaignId: string;
  isSequentialAdventure: boolean;
}>();

const heroDataRepository = new HeroDataRepository();
const campaignStore = CampaignStore();
const { t } = useI18n();

const campaign = campaignStore.find(props.campaignId);
const hero = heroDataRepository.find(props.heroId) ?? ({} as HeroData);
</script>

<style scoped>
.hero-list-item {
  padding: 0px 16px 16px 16px;
  background-image: url("@/assets/hero/flag-bg-red.webp");
  background-repeat: no-repeat;
  background-origin: content-box;
}

/* Customizar o painel de expansão */
:deep(.v-expansion-panel-title) {
  min-height: 72px;
}

:deep(.v-expansion-panel-title__overlay) {
  background-color: rgba(31, 41, 55, 0.8);
}

:deep(.v-expansion-panel-text__wrapper) {
  padding: 0;
}

:deep(.v-expansion-panel) {
  background-color: #1f2937 !important;
}

:deep(.v-expansion-panel-title) {
  background-color: #1f2937 !important;
  color: white !important;
}

:deep(.v-expansion-panel-title:hover) {
  background-color: #374151 !important;
}
</style>