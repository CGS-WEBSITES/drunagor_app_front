<script setup lang="ts">
import CampaignLogAddHero from "@/components/CampaignLogAddHero.vue";
import CampaignLogRemoveHero from "@/components/CampaignLogRemoveHero.vue";
import CampaignLog from "@/components/CampaignLog.vue";
import { useRoute } from "vue-router";
import { HeroStore } from "@/store/HeroStore";
import CampaignRemove from "@/components/CampaignRemove.vue";
import CampaignExport from "@/components/CampaignExport.vue";
import StoryRecord from "@/components/StoryRecord.vue";
import CampaignName from "@/components/CampaignName.vue";
import { CampaignStore } from "@/store/CampaignStore";
import CampaignCampPhase from "@/components/CampaignCampPhase.vue";
import { ref } from "vue";
import CampaignRunes from "@/components/CampaignRunes.vue";
import SequentialAdventureButton from "@/components/SequentialAdventureButton.vue";

const route = useRoute();

const campaignId = route.params.id.toString();
const campaignStore = CampaignStore();
const campaign = campaignStore.find(campaignId);

const heroStore = HeroStore();

const isSequentialAdventure = ref(false);
isSequentialAdventure.value =
  campaignStore.find(campaignId).isSequentialAdventure ?? false;

const update = ref(0);

function onCampPhase() {
  isSequentialAdventure.value = false;
  update.value++;
}

function onSequentialAdventure() {
  isSequentialAdventure.value = true;
  update.value++;
}
</script>

<template>
  <v-row no-gutters class="d-flex justify-center">
    <v-card class="mb-2" min-width="600">
      <v-card-actions class="d-flex justify-space-between">
        <CampaignRemove class="mr-2" :campaign-id="campaignId" />
        <CampaignExport :campaign-id="campaignId" />
        <SequentialAdventureButton
          :campaign-id="campaignId"
          @sequential-adventure="onSequentialAdventure"
          :disabled="isSequentialAdventure"
        />
        <CampaignCampPhase
          :campaign-id="campaignId"
          @camp-phase="onCampPhase"
        />
      </v-card-actions>
    </v-card>
  </v-row>

  <v-row no-gutters class="d-flex justify-center">
    <v-col cols="12 px-2">
      <CampaignName :campaign-id="campaignId" />
    </v-col>
  </v-row>

  <v-row v-if="isSequentialAdventure" no-gutters class="d-flex justify-center">
    <v-col cols="12 px-2">
      <CampaignRunes :campaign-id="campaignId" />
    </v-col>
  </v-row>

  <v-row
    no-gutters
    class="d-flex justify-center"
    v-if="
      campaign.campaign == 'awakenings' || campaign.campaign == 'apocalypse'
    "
  >
  <v-col cols="12" class="px-2">
    <StoryRecord :campaign-id="campaignId" />
  </v-col>
  </v-row>

  <v-row no-gutters class="d-flex justify-center">
    <template v-if="campaign.campaign == 'apocalypse'">
      <div
        class="bg-neutral form-control drop-shadow rounded-lg mb-2"
        :key="update"
      >
        <div class="p-4" style="background-color: #1f2937">
          <div class="pt-2 w-full">
            <StoryRecordLegacyTrail :campaign-id="campaignId" />
          </div>
          <div class="pt-4 w-full">
            <StoryRecordBackgroundAndTrait :campaign-id="campaignId" />
          </div>
        </div>
      </div>
    </template>
  </v-row>

  <v-row no-gutters class="d-flex justify-center">
    <CampaignLogAddHero :campaign-id="campaignId" />
    <CampaignLogRemoveHero :campaign-id="campaignId" />
  </v-row>

  <v-row no-gutters class="d-flex justify-center">
    <div id="heroes" class="grid pt-2 gap-2 w-full" :key="update">
      <template
        v-for="hero in heroStore.findAllInCampaign(campaignId)"
        :key="hero.heroId"
      >
        <div class="bg-neutral form-control drop-shadow rounded-lg">
          <CampaignLog
            :campaign-id="campaignId"
            :hero-id="hero.heroId"
            :is-sequential-adventure="isSequentialAdventure"
          />
        </div>
      </template>
    </div>
  </v-row>
</template>

<style scoped></style>
