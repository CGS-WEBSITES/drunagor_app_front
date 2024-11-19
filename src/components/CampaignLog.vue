<script setup lang="ts">
import { HeroDataRepository } from "@/data/repository/HeroDataRepository";
import type { HeroData } from "@/data/repository/HeroData";
import { CampaignStore } from "@/store/CampaignStore";
import CampaignLogCore from "./CampaignLogCore.vue";
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

<template>
  <v-card elevation="16" rounded style="background-color: #1f2937" width="100%">
    <v-card-title class="text-h5">
      {{ hero.name }}
      <v-divider></v-divider>
    </v-card-title>
    <v-card-text class="hero-list-item" >
      <v-row no-gutters>
        <v-col cols="2" >
          <v-avatar
            :image="hero.images.avatar"
            size="65"
            class="ml-2"
          />
        </v-col>
        <v-col cols="10">
          <p>
            {{ t("label." + hero.race.toLowerCase()) }}
            {{ t("label." + hero.class.toLowerCase().replace(" ", "-")) }}
          </p>
          <p>{{ t("text.path-of") }} {{ t("label." + hero.path.toLowerCase()) }}</p>
        </v-col>
      </v-row>
    </v-card-text>
    <v-card-actions>
      <CampaignLogSequentialAdventure
        v-if="isSequentialAdventure"
        :hero="hero"
        :campaign-id="campaignId"
      />
      <CampaignLogCore
        v-if="campaign.campaign == 'core'"
        :campaign-id="props.campaignId"
        :hero-id="props.heroId"
      />
      <CampaignLogAwakenings
        v-if="campaign.campaign == 'awakenings'"
        :campaign-id="props.campaignId"
        :hero-id="props.heroId"
      />
      <CampaignLogApocalypse
        v-if="campaign.campaign == 'apocalypse'"
        :campaign-id="props.campaignId"
        :hero-id="props.heroId"
      />
    </v-card-actions>
  </v-card>
</template>

<style scoped>
.hero-list-item {
  padding: 16px;
  background-image: url("@/assets/hero/flag-bg-red.webp");
  background-repeat: no-repeat;
  background-origin: content-box;
}
</style>
