<template>
  <div class="pt-2 w-full">
    <CampaignLogStatus
      :repository="statusRepository"
      :campaign-id="props.campaignId"
      :hero-id="props.heroId"
    />
  </div>
  <div class="pt-2 w-full">
    <CampaignLogAura
      :repository="auraRepository"
      :campaign-id="props.campaignId"
      :hero-id="props.heroId"
    />
  </div>

  <!-- Botão Equipment Skills - apenas se não estiver oculto -->
  <v-row v-if="!props.hideEquipmentButton && isAdmin && !loading" no-gutters>
    <v-col cols="12">
      <v-btn
        variant="outlined"
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
import CampaignLogAura from "@/components/CampaignLogAura.vue";
import CampaignLogStatus from "@/components/CampaignLogStatus.vue";
import { CampaignLogStatusRepository } from "@/data/repository/campaign/awakenings/CampaignLogStatusRepository";
import { CampaignLogAuraRepository } from "@/data/repository/campaign/awakenings/CampaignLogAuraRepository";
import { useUserStore } from "@/store/UserStore";
import { useI18n } from "vue-i18n";
import { ref, onMounted } from "vue";
import axios from "axios";

const props = defineProps<{
  heroId: string;
  campaignId: string;
  hideEquipmentButton?: boolean; // Nova prop para ocultar o botão
}>();

const statusRepository = new CampaignLogStatusRepository();
const auraRepository = new CampaignLogAuraRepository();
const userStore = useUserStore();
const { t } = useI18n();

const isAdmin = ref(false);
const loading = ref(true);

const checkUserRole = async () => {
  try {
    const response = await axios.get("rl_campaigns_users/search", {
      params: { 
        users_fk: userStore.user?.users_pk, 
        campaigns_fk: props.campaignId 
      },
    });
    isAdmin.value = response.data.campaigns[0]?.party_role === "Admin";    
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

<style scoped></style>
