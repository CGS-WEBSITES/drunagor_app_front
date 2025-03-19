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
  <v-col cols="12">
    <v-row no-gutters class="d-flex justify-center pa-1">
      <v-card class="mb-2 pa-2" style="width: 100%;">
        <v-card-actions class="d-flex justify-space-between">
          <v-row no-gutter>
            <v-col
              cols="12"
              sm="6"
              md="3"
              lg="3"
              xl="3"
              class="d-flex justify-center"
            >
              <CampaignRemove class="mr-2" :campaign-id="campaignId" />
            </v-col>
            <v-col
              cols="12"
              sm="6"
              md="3"
              lg="3"
              xl="3"
              class="d-flex justify-center"
            >
              <CampaignExport :campaign-id="campaignId" />
            </v-col>
            <v-col
              cols="12"
              sm="6"
              md="3"
              lg="3"
              xl="3"
              class="d-flex justify-center"
            >
              <SequentialAdventureButton
                :campaign-id="campaignId"
                @sequential-adventure="onSequentialAdventure"
                :disabled="isSequentialAdventure"
              />
            </v-col>
            <v-col
              cols="12"
              sm="6"
              md="3"
              lg="3"
              xl="3"
              class="d-flex justify-center"
            >
              <CampaignCampPhase
                :campaign-id="campaignId"
                @camp-phase="onCampPhase"
              />
            </v-col>
          </v-row>
        </v-card-actions>
      </v-card>
    </v-row>
  </v-col>

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

  <v-row
    no-gutters
    class="d-flex justify-center"
    v-if="campaign.campaign == 'apocalypse'"
  >
    <v-col cols="12" class="pa-2">
      <v-sheet rounded border="md" class="mb-6 pa-6 text-white">
        <StoryRecordLegacyTrail :campaign-id="campaignId" />

        <StoryRecordBackgroundAndTrait :campaign-id="campaignId" />
      </v-sheet>
    </v-col>
  </v-row>

  <v-row no-gutters class="justify-center pa-6">
    <v-col
      cols="12"
      sm="12"
      md="6"
      lg="4"
      class="d-flex flex-row justify-space-around px-0"
    >
      <CampaignLogAddHero :campaign-id="campaignId" />
      <CampaignLogRemoveHero :campaign-id="campaignId" />
    </v-col>
  </v-row>

  <v-row no-gutters class="d-flex justify-center">
    <v-sheet rounded border="md" class="text-white" width="100%">
      <v-col
        cols="12"
        id="heroes"
        v-for="hero in heroStore.findAllInCampaign(campaignId)"
        :key="hero.heroId"
      >
        <CampaignLog
          :campaign-id="campaignId"
          :hero-id="hero.heroId"
          :is-sequential-adventure="isSequentialAdventure"
        />
      </v-col>
    </v-sheet>
  </v-row>
</template>

<style scoped></style>
