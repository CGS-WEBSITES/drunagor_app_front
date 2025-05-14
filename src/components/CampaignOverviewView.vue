<script setup lang="ts">
import CampaignNew from "@/components/CampaignNew.vue";
import type { HeroData } from "@/data/repository/HeroData";
import { HeroDataRepository } from "@/data/repository/HeroDataRepository";
import { Campaign } from "@/store/Campaign";
import { CampaignStore } from "@/store/CampaignStore";
import { Hero } from "@/store/Hero";
import { HeroStore } from "@/store/HeroStore";
import { PartyStore } from "@/store/PartyStore";
import { customAlphabet } from "nanoid";
import CampaignImport from "@/components/CampaignImport.vue";

const partyStore = PartyStore();
const legacyCampaign = partyStore.findAll();
const campaignStore = CampaignStore();
const heroStore = HeroStore();
const nanoid = customAlphabet("1234567890", 5);

//backwards compatibility
if (legacyCampaign.length > 0) {
  let campaignId = nanoid();
  campaignStore.add(new Campaign(campaignId, "core"));

  legacyCampaign.forEach((hero) => {
    let newHero = new Hero(hero.heroId, campaignId);
    newHero.auraId = hero.auraId;
    newHero.outcomeIds = hero.outcomeIds;
    newHero.statusIds = hero.statusIds;

    heroStore.add(newHero);
    partyStore.removeMember(hero.heroId);
  });
}

const heroDataRepository = new HeroDataRepository();

function findHeroes(campaignId: string): HeroData[] {
  const heroes: HeroData[] = [];
  heroStore.findAllInCampaign(campaignId).forEach((hero) => {
    heroes.push(heroDataRepository.find(hero.heroId) ?? ({} as HeroData));
  });

  return heroes;
}






</script>

<template>
  <v-container max-width="680">
  <v-card color="primary" class="d-none d-md-flex justify-center pa-3 elevation-0">
    <v-card-actions>
      <CampaignNew />
      <CampaignImport />
    </v-card-actions>
  </v-card>

  <v-card class="d-md-none justify-center pa-3 elevation-0">
    <v-card-actions class="d-flex justify-center">
      <CampaignNew />
    </v-card-actions>
    <v-card-actions class="d-flex justify-center">
    <CampaignImport />
  </v-card-actions>
  </v-card>


  

  <div id="campaigns" class="grid gap-4 pt-4 place-items-center">
    <v-row no-gutters>
      <v-col
        cols="12"
        class="py-3"
        v-for="campaign in campaignStore.findAll()"
        :key="campaign.campaignId"
      >
      <v-card
      color="primary"
  elevation="16"
  width="100%"
  @click="
    $router.push({
      name: 'Campaign',
      params: { id: campaign.campaignId },
    })
  "
>
  <!-- Definição direta da imagem com v-if e v-else-if -->
  <v-img
    v-if="campaign.campaign === 'core'"
    src="https://assets.drunagor.app/CampaignTracker/CoreCompanion.webp"
    max-height="200"
    cover
  ></v-img>

  <v-img
    v-else-if="campaign.campaign === 'apocalypse'"
    src="https://assets.drunagor.app/CampaignTracker/ApocCompanion.webp"
    max-height="200"
    cover
  ></v-img>

  <v-img
    v-else-if="campaign.campaign === 'awakenings'"
    src="https://assets.drunagor.app/CampaignTracker/AwakComapanion.webp"
    max-height="200"
    cover
  ></v-img>

  <v-img
    v-else-if="campaign.campaign === 'underkeep'"
    src="@/assets/underkeep.png"
    max-height="200"
    cover
  ></v-img>

  <v-card-title class="text-uppercase" v-if="campaign.name">
    {{ campaign.name }}
  </v-card-title>
  <v-card-text>
    <v-row no-gutters>
      <v-col
  class="d-flex"
  v-for="hero in findHeroes(campaign.campaignId)"
  :key="hero.heroId"
  :cols="$vuetify.display.mdAndUp 
    ? (findHeroes(campaign.campaignId).length <= 4 ? 3 : undefined) 
    : undefined"
>
  <v-avatar 
    class="my-1" 
    rounded="0" 
    :image="hero.images.avatar" 
    :size="$vuetify.display.mdAndUp ? 120 : 70"
  />
</v-col>
    </v-row>
  </v-card-text>
</v-card>
      </v-col>
    </v-row>
  </div>
</v-container>
</template>

<style scoped></style>
