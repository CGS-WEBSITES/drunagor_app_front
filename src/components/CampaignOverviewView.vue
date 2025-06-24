<template>
  <v-container max-width="680">
    <div v-if="loadingErrors.length > 0" class="mb-4">
      <v-alert
        v-for="(error, index) in loadingErrors"
        :key="error.id"
        type="error"
        title="Loading Error"
        :text="error.text"
        variant="elevated"
        closable
        @click:close="loadingErrors.splice(index, 1)"
        class="mb-3"
      />
    </div>

    <v-card
      color="primary"
      class="d-none d-md-flex justify-center pa-3 elevation-0"
    >
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
          <v-progress-circular
            indeterminate
            :size="80"
            :width="7"
            color="primary"
          />
        </v-card>
      </v-row>

      <v-row v-else no-gutters>
        <v-col
          cols="12"
          class="py-3"
          v-for="campaign in allCampaigns"
          :key="campaign.campaignId"
        >
          <v-card
            color="primary"
            elevation="16"
            width="100%"
            @click="goToCampaign(campaign.campaignId)"
          >
            <v-img
              v-if="campaign.campaign === 'core'"
              src="https://assets.drunagor.app/CampaignTracker/CoreCompanion.webp"
              max-height="200"
              cover
            />
            <v-img
              v-else-if="campaign.campaign === 'apocalypse'"
              src="https://assets.drunagor.app/CampaignTracker/ApocCompanion.webp"
              max-height="200"
              cover
            />
            <v-img
              v-else-if="campaign.campaign === 'awakenings'"
              src="https://assets.drunagor.app/CampaignTracker/AwakComapanion.webp"
              max-height="200"
              cover
            />
            <v-img
              v-else-if="campaign.campaign === 'underkeep'"
              src="@/assets/underkeep.png"
              max-height="200"
              cover
            />

            <v-card-title class="d-flex flex-column text-uppercase">
              <span class="text-h5 font-weight-bold mb-0">{{
                campaign.name
              }}</span>
              <span class="text-subtitle-1 mt-0">{{ campaign.wing }}</span>
            </v-card-title>
            <v-card-text>
              <v-row no-gutters>
                <v-col
                  v-for="hero in heroAvatars(campaign.campaignId)"
                  :key="hero.heroId"
                  :cols="avatarCols(campaign.campaignId)"
                  class="d-flex"
                >
                  <v-avatar
                    class="my-1"
                    rounded="0"
                    :image="hero.images.avatar"
                    :size="avatarSize"
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

<script setup lang="ts">
import { ref, computed, onBeforeMount } from "vue";
import { useRouter, useRoute } from "vue-router";
import CampaignNew from "@/components/CampaignNew.vue";
import CampaignImport from "@/components/CampaignImport.vue";
import { CampaignStore } from "@/store/CampaignStore";
import { HeroStore } from "@/store/HeroStore";
import { PartyStore } from "@/store/PartyStore";
import { useUserStore } from "@/store/UserStore";
import { Campaign } from "@/store/Campaign";
import { Hero } from "@/store/Hero";
import type { HeroData } from "@/data/repository/HeroData";
import { HeroDataRepository } from "@/data/repository/HeroDataRepository";

import { customAlphabet } from "nanoid";
import axios from "axios";

const router = useRouter();
const route = useRoute();
const toastUser = useUserStore();

const partyStore = PartyStore();
const campaignStore = CampaignStore();
const heroStore = HeroStore();

const nanoid = customAlphabet("1234567890", 5);
const loading = ref(true);
const loadingErrors = ref<{ id: number; text: string }[]>([]);

const allCampaigns = computed(() => campaignStore.findAll());
const avatarSize = computed(() => (route.meta.mdAndUp ? 120 : 70));

onBeforeMount(() => {
  campaignStore.reset();
  heroStore.reset();
  loadingErrors.value = [];

  axios
    .get("/rl_campaigns_users/search", {
      params: { users_fk: toastUser.user!.users_pk },
    })
    .then((res) => {
      res.data.campaigns.forEach((el: any) => {
        try {
          importCampaign(el.tracker_hash, String(el.campaigns_pk));
        } catch {
          const boxName = getBoxName(el.box);
          const partyName = el.party_name || "Unnamed Party";
          addLoadingError(
            `Could not load the campaign "${partyName}" from the "${boxName}". ` +
              `Data seems corrupted. Please contact support.`,
          );
        }
      });
    })
    .catch(() => {
      addLoadingError("Error fetching campaigns. Please try again later.");
    })
    .finally(() => {
      const legacy = partyStore.findAll();
      if (legacy.length) {
        const id = nanoid();
        campaignStore.add(new Campaign(id, "core"));
        legacy.forEach((h) => {
          const hero = new Hero(h.heroId, id);
          Object.assign(hero, {
            auraId: h.auraId,
            outcomeIds: h.outcomeIds,
            statusIds: h.statusIds,
          });
          heroStore.add(hero);
          partyStore.removeMember(h.heroId);
        });
      }
      loading.value = false;
    });
});

const getBoxName = (boxId: number) => {
  const map: Record<number, string> = {
    22: "Corebox",
    23: "Apocalypse",
    34: "Awakenings",
    38: "Underkeep Drunagor Nights",
  };
  return map[boxId] || `Unknown Box (ID: ${boxId})`;
};

const addLoadingError = (text: string) => {
  const id = Date.now();
  loadingErrors.value.push({ id, text });
  setTimeout(() => {
    loadingErrors.value = loadingErrors.value.filter((e) => e.id !== id);
  }, 5000);
};

const importCampaign = (token: string, overrideId?: string) => {
  const data = JSON.parse(atob(token));
  if (!data.campaignData) return;
  const camp = data.campaignData;
  if (overrideId) camp.campaignId = overrideId;
  campaignStore.add(camp);

  data.heroes.forEach((h: any) => {
    h.campaignId = overrideId ?? h.campaignId;
    heroStore.add(h);
  });
};

const goToCampaign = (id: string) => {
  router.push({ name: "Campaign", params: { id } });
};

const heroAvatars = (campId: string): HeroData[] => {
  const repo = new HeroDataRepository();
  return heroStore
    .findAllInCampaign(campId)
    .map((h) => repo.find(h.heroId))
    .filter((h): h is HeroData => !!h);
};

const avatarCols = (campId: string) => {
  const count = heroAvatars(campId).length;
  return route.meta.mdAndUp && count <= 4 ? 3 : undefined;
};
</script>

<style scoped></style>
