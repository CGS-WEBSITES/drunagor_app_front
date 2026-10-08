<template>
  <div :data-testid="'campaign-log-status-' + heroId">
    <EffectPicker
      v-model="statusIds"
      title="Status"
      :items="statuses"
      :editable="isAdmin && !loading"
      :loading="loading"
      placeholder="Add or remove status"
      :hint="t('text.status-info')"
      empty-text="No status applied"
    />
  </div>
</template>

<script setup lang="ts">
import EffectPicker from "@/components/EffectPicker.vue";
import { ref, watch, onMounted } from "vue";
import { HeroStore } from "@/store/HeroStore";
import { useUserStore } from "@/store/UserStore";
import { CampaignStore } from "@/store/CampaignStore";
import type { StatusRepository } from "@/data/repository/campaign/StatusRepository";
import { useI18n } from "vue-i18n";
import { ConfigurationStore } from "@/store/ConfigurationStore";
import axios from "axios";

const props = defineProps<{
  heroId: string;
  campaignId: string;
  repository: StatusRepository;
}>();

const heroStore = HeroStore();
const userStore = useUserStore();
const campaignStore = CampaignStore();
const configurationStore = ConfigurationStore();
const { t } = useI18n();

const statusIds = ref<string[]>([]);
const isAdmin = ref(false);
const loading = ref(true);
const campaignHeroRef = ref<any>(null);

props.repository.load(configurationStore.enabledLanguage);
const statuses = props.repository.findAll();

const checkUserRole = async () => {
  try {
    if (!userStore.user?.users_pk) {
      userStore.restoreFromStorage();
    }
    if (!userStore.user?.users_pk) {
      console.warn("[CampaignLogStatus] checkUserRole skipped: users_pk is missing");
      return;
    }
    const campaign = campaignStore.findOptional(props.campaignId);
    const showSeason2 = campaign ? campaign.campaign === "underkeep2" : false;

    const response = await axios.get("rl_campaigns_users/search", {
      params: { 
        users_fk: userStore.user.users_pk, 
        campaigns_fk: props.campaignId,
        show_season2: showSeason2
      },
    });
    const campaignRelation = response.data.campaigns?.[0];
    
    if (campaignRelation) {
      const isPartyAdmin = campaignRelation.party_role === "Admin";
      
      const hero = heroStore.findInCampaignOptional(props.heroId, props.campaignId);
      const isHeroOwner = hero && Number(hero.playableHeroesPk) === Number(campaignRelation.playable_heroes_fk);
      
      isAdmin.value = !!(isPartyAdmin || isHeroOwner);
    } else {
      isAdmin.value = false;
    }
  } catch (error) {
    console.error("CampaignLogStatus - Error fetching user role:", error);
    isAdmin.value = false;
  } finally {
    loading.value = false;
  }
};

watch(statusIds, (newStatusIds) => {
  if (isAdmin.value && campaignHeroRef.value) {
    campaignHeroRef.value.statusIds = [...newStatusIds];
    console.log("[CampaignLogStatus] StatusIds updated:", newStatusIds);
  }
}, { deep: true });

onMounted(async () => {
  await checkUserRole();
  
  const hero = heroStore.findInCampaignOptional(props.heroId, props.campaignId);
  
  if (hero) {
    campaignHeroRef.value = hero;
    
    if (!hero.statusIds) {
      hero.statusIds = [];
    }
    
    statusIds.value = [...hero.statusIds];
  } else {
    console.warn(`[CampaignLogStatus] Hero ${props.heroId} not found in campaign ${props.campaignId}`);
  }
});
</script>

<style scoped></style>