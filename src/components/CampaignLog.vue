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
  <v-card elevation="16" rounded style="background-color: #1f2937" width="100%" class="hero-list-item">
    <v-card-title class="text-h5 px-2">
      {{ hero.name }}
      <v-divider></v-divider>
    </v-card-title>
    <v-card-text class="px-2">
      <v-row no-gutters>
        <v-col cols="2">
          <v-avatar :image="hero.images.avatar" size="65" />
        </v-col>
        <v-col cols="10" class="pl-8 d-md-none">
          <p class>
            {{ t("label." + hero.race.toLowerCase()) }}
            {{ t("label." + hero.class.toLowerCase().replace(" ", "-")) }}
          </p>
          <p>
            {{ t("text.path-of") }} {{ t("label." + hero.path.toLowerCase()) }}
          </p>
        </v-col>

        <v-col cols="12" class="pt-3 d-none d-md-flex">
          <p class>
            {{ t("label." + hero.race.toLowerCase()) }}
            {{ t("label." + hero.class.toLowerCase().replace(" ", "-")) }}
          </p>
        </v-col>
          <p class="d-none d-md-flex">
            {{ t("text.path-of") }} {{ t("label." + hero.path.toLowerCase()) }}
          </p>

  
        

        
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
      </v-row>
    </v-card-actions>
  </v-card>
</template>

<style scoped>
.hero-list-item {
  padding: 0px 16px 16px 16px;
  background-image: url("@/assets/hero/flag-bg-red.webp");
  background-repeat: no-repeat;
  background-origin: content-box;
}
</style>
