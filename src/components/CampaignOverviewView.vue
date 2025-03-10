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
  <v-card class="d-none d-md-flex justify-center pa-3 elevation-0">
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
          elevation="16"
          width="100%"
          @click="
            $router.push({
              name: 'Campaign',
              params: { id: campaign.campaignId },
            })
          "
        >
          <v-card-title>
            {{ campaign.campaign }}
          </v-card-title>
          <v-card-subtitle v-if="campaign.name">
            {{ campaign.name }}
          </v-card-subtitle>
          <v-card-text>
            <v-row no-gutters class="justify-center">
              <v-col
                cols="1"
                class="d-flex justify-center"
                v-for="hero in findHeroes(campaign.campaignId)"
                :key="hero.heroId"
              >
                <v-avatar :image="hero.images.avatar" size="40" />
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
