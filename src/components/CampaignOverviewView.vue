<script setup lang="ts">
import CampaignNew from "@/components/CampaignNew.vue";
import type { HeroData } from "@/data/repository/HeroData";
import { HeroDataRepository } from "@/data/repository/HeroDataRepository";
import { Campaign } from "@/store/Campaign";
import { CampaignStore } from "@/store/CampaignStore";
import { Hero } from "@/store/Hero";
import { HeroStore } from "@/store/HeroStore";
import { HeroEquipment } from "@/store/Hero";
import { PartyStore } from "@/store/PartyStore";
import { customAlphabet } from "nanoid";
import CampaignImport from "@/components/CampaignImport.vue";
import { useUserStore } from "@/store/UserStore";
import { useRouter } from "vue-router";
import { ref, computed, onMounted, onBeforeMount } from 'vue';
import axios from 'axios';

const router = useRouter();

const partyStore = PartyStore();
const legacyCampaign = partyStore.findAll();
const campaignStore = CampaignStore();
const heroStore = HeroStore();
const nanoid = customAlphabet("1234567890", 5);
const user = useUserStore().user
const loading = ref(true)


const allowedCampaignIds = ref<number[]>([]);

function importCampaign(token: string, overrideId?: string) {
  const data = JSON.parse(atob(token));
  if (!("campaignData" in data)) {
    console.warn("Payload invalid:", token);
    return;
  }

  const campaignObj = data.campaignData as any;
  if (overrideId) {
    campaignObj.campaignId = overrideId;
  }

  campaignStore.add(campaignObj);

  data.heroes.forEach((h: any) => {
    h.campaignId = overrideId ?? h.campaignId;
    heroStore.add(h);
  });
}

onBeforeMount(async () => {
  campaignStore.reset();
  heroStore.reset();

  try {
    const res = await axios.get("/rl_campaigns_users/search", {
      params: { users_fk: useUserStore().user!.users_pk },
    });

    res.data.campaigns.forEach((element: any) => {
      try { 
        const idStr = String(element.campaigns_pk);
        importCampaign(element.tracker_hash, idStr);
      } catch (e) { 
        console.error(`Falha ao importar campanha ID: ${element.campaigns_pk}`, e);
      }
    });
  } catch (apiError) {
    console.error("Falha ao buscar campanhas da API", apiError);
  }

  loading.value = false; 
});

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
  return heroStore
    .findAllInCampaign(campaignId)
    .map(h => heroDataRepository.find(h.heroId))
    .filter((h): h is HeroData => !!h);
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
      <v-row v-if="loading" class="justify-center" no-gutters>
        <v-card width="100%" class="d-flex justify-center pa-16">
          <v-progress-circular :size="80" :width="7" color="primary" indeterminate></v-progress-circular>
        </v-card>
      </v-row>

      <v-row v-else no-gutters>
        <v-col cols="12" class="py-3" v-for="campaign in campaignStore.findAll()" :key="campaign.campaignId">
          <v-card color="primary" elevation="16" width="100%" @click="
            $router.push({
              name: 'Campaign',
              params: { id: campaign.campaignId },
            })
            ">
            <!-- Definição direta da imagem com v-if e v-else-if -->
            <v-img v-if="campaign.campaign === 'core'"
              src="https://assets.drunagor.app/CampaignTracker/CoreCompanion.webp" max-height="200" cover></v-img>

            <v-img v-else-if="campaign.campaign === 'apocalypse'"
              src="https://assets.drunagor.app/CampaignTracker/ApocCompanion.webp" max-height="200" cover></v-img>

            <v-img v-else-if="campaign.campaign === 'awakenings'"
              src="https://assets.drunagor.app/CampaignTracker/AwakComapanion.webp" max-height="200" cover></v-img>

            <v-img v-else-if="campaign.campaign === 'underkeep'" src="@/assets/underkeep.png" max-height="200"
              cover></v-img>

            <v-card-title class="d-flex flex-column text-uppercase">
              <span class="text-h5 font-weight-bold mb-0">{{ campaign.name }}</span>
              <span class="text-subtitle-1 mt-0">{{ campaign.wing }}</span>
            </v-card-title>
            <v-card-text>
              <v-row no-gutters>
                <v-col class="d-flex" v-for="hero in findHeroes(campaign.campaignId)" :key="hero.heroId" :cols="$vuetify.display.mdAndUp
                  ? (findHeroes(campaign.campaignId).length <= 4 ? 3 : undefined)
                  : undefined">
                  <v-avatar class="my-1" rounded="0" :image="hero.images.avatar"
                    :size="$vuetify.display.mdAndUp ? 120 : 70" />
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