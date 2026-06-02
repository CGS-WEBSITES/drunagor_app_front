<template>
  <v-row no-gutters>
    <v-col cols="12">
      <CampaignLogStatus
        :repository="statusRepository"
        :campaign-id="props.campaignId"
        :hero-id="props.heroId"
      />
    </v-col>
  </v-row>

  <v-row no-gutters>
    <v-col cols="12">
      <CampaignLogOutcome
        :repository="outcomeRepository"
        :campaign-id="props.campaignId"
        :hero-id="props.heroId"
      />
    </v-col>
  </v-row>

  <v-row no-gutters class="mt-4">
    <v-col cols="12" class="d-flex justify-center">
      <HeroDetailSummary
        :campaign-id="props.campaignId"
        :hero-id="props.heroId"
      />
    </v-col>
  </v-row>

  <v-row v-if="!props.hideEquipmentButton && isAdmin && !loading" no-gutters>
    <v-col cols="12">
      <v-btn
        variant="elevated"
        rounded
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

<script setup lang="ts">
import { useI18n } from "vue-i18n";
import CampaignLogOutcome from "@/components/CampaignLogOutcome.vue";
import CampaignLogStatus from "@/components/CampaignLogStatus.vue";
import { CampaignLogStatusRepository } from "@/data/repository/campaign/underkeep/CampaignLogStatusRepository";
import { CampaignLogOutcomeRepository } from "@/data/repository/campaign/underkeep/CampaignLogOutcomeRepository";
import HeroDetailSummary from "@/components/HeroDetailSummary.vue";
import { useUserStore } from "@/store/UserStore";
import { HeroStore } from "@/store/HeroStore";
import { CampaignStore } from "@/store/CampaignStore";
import { ref, onMounted } from "vue";
import axios from "axios";

const props = defineProps<{
  heroId: string;
  campaignId: string;
  hideEquipmentButton?: boolean;
}>();

const statusRepository = new CampaignLogStatusRepository();
const outcomeRepository = new CampaignLogOutcomeRepository();
const { t } = useI18n();
const userStore = useUserStore();
const heroStore = HeroStore();
const campaignStore = CampaignStore();
const isAdmin = ref(false);
const loading = ref(true);

const checkUserRole = async () => {
  try {
    if (!userStore.user?.users_pk) {
      userStore.restoreFromStorage();
    }
    if (!userStore.user?.users_pk) {
      console.warn("[UnderKeep] checkUserRole skipped: users_pk is missing");
      loading.value = false;
      return;
    }
    const campaign = campaignStore.findOptional(props.campaignId);
    const showSeason2 = campaign ? campaign.campaign === "underkeep2" : false;

    const response = await axios.get("rl_campaigns_users/search", {
      params: { 
        users_fk: userStore.user?.users_pk, 
        campaigns_fk: props.campaignId,
        show_season2: showSeason2
      },
    });
    const campaignRelation = response.data.campaigns?.[0];
    
    if (campaignRelation) {
      const isPartyAdmin = campaignRelation.party_role === "Admin";
      
      const hero = heroStore.findInCampaignOptional(props.heroId, props.campaignId);
      const isHeroOwner = hero && Number(hero.playableHeroesPk) === Number(campaignRelation.playable_heroes_fk);
      
      isAdmin.value = isPartyAdmin || isHeroOwner;
    } else {
      isAdmin.value = false;
    }
  } catch (error) {
    console.error("CampaignLog - Error fetching user role:", error);
    isAdmin.value = false;
  } finally {
    loading.value = false;
  }
};

onMounted(async () => {
  await checkUserRole();
});
</script>