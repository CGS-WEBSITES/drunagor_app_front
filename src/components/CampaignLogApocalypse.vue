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

  <v-row no-gutters>
    <v-col cols="12">
      <CampaignLogAura
        :repository="auraRepository"
        :campaign-id="props.campaignId"
        :hero-id="props.heroId"
      />
    </v-col>
  </v-row>

  <!-- Botão Equipment Skills - apenas se não estiver oculto -->
  <v-row v-if="!props.hideEquipmentButton && isAdmin && !loading" no-gutters>
    <v-col cols="12">
      <v-btn
        variant="outlined"
        @click="
          $router.push({
            name: 'Hero',
            params: { campaignId: props.campaignId, heroId: props.heroId },
          })
        "
      >
        {{ t("label.equipment-skills") }}
      </v-btn>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import CampaignLogAura from "@/components/CampaignLogAura.vue";
import CampaignLogOutcome from "@/components/CampaignLogOutcome.vue";
import CampaignLogStatus from "@/components/CampaignLogStatus.vue";
import { CampaignLogStatusRepository } from "@/data/repository/campaign/apocalypse/CampaignLogStatusRepository";
import { CampaignLogAuraRepository } from "@/data/repository/campaign/apocalypse/CampaignLogAuraRepository";
import { CampaignLogOutcomeRepository } from "@/data/repository/campaign/apocalypse/CampaignLogOutcomeRepository";
import { useI18n } from "vue-i18n";
import { useUserStore } from "@/store/UserStore";
import { HeroStore } from "@/store/HeroStore";
import { ref, onMounted } from "vue";
import axios from "axios";

const props = defineProps<{
  heroId: string;
  campaignId: string;
  hideEquipmentButton?: boolean; // Prop para ocultar o botão
}>();

const statusRepository = new CampaignLogStatusRepository();
const auraRepository = new CampaignLogAuraRepository();
const outcomeRepository = new CampaignLogOutcomeRepository();
const userStore = useUserStore();
const heroStore = HeroStore();
const { t } = useI18n();

const isAdmin = ref(false);
const loading = ref(true);

const checkUserRole = async () => {
  try {
    if (!userStore.user?.users_pk) {
      userStore.restoreFromStorage();
    }
    if (!userStore.user?.users_pk) {
      console.warn("[CampaignLogApocalypse] checkUserRole skipped: users_pk is missing");
      loading.value = false;
      return;
    }
    let response = await axios.get("rl_campaigns_users/search", {
      params: { 
        users_fk: userStore.user.users_pk, 
        campaigns_fk: props.campaignId,
        show_season2: true
      },
    });
    let campaignRelation = response.data.campaigns?.[0];
    if (!campaignRelation) {
      response = await axios.get("rl_campaigns_users/search", {
        params: { 
          users_fk: userStore.user.users_pk, 
          campaigns_fk: props.campaignId,
          show_season2: false
        },
      });
      campaignRelation = response.data.campaigns?.[0];
    }
    
    if (campaignRelation) {
      const isPartyAdmin = campaignRelation.party_role === "Admin";
      
      const hero = heroStore.findInCampaignOptional(props.heroId, props.campaignId);
      const isHeroOwner = hero && Number(hero.playableHeroesPk) === Number(campaignRelation.playable_heroes_fk);
      
      isAdmin.value = isPartyAdmin || isHeroOwner;
    } else {
      isAdmin.value = false;
    }
  } catch (error) {
    console.error("CampaignLogApocalypse - Error fetching user role:", error);
    isAdmin.value = false;
  } finally {
    loading.value = false;
  }
};

onMounted(async () => {
  await checkUserRole();
});
</script>

<style scoped></style>