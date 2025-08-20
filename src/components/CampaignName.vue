<template>
  <v-text-field
    :label="t('text.party-name')"
    variant="outlined"
    v-model="name"
    :readonly="!isAdmin"
    :disabled="!isAdmin"
    :loading="loading"
  ></v-text-field>
</template>

<script setup lang="ts">
import { CampaignStore } from "@/store/CampaignStore";
import { useUserStore } from "@/store/UserStore";
import { ref, watch, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import axios from "axios";

const props = defineProps<{
  campaignId: string;
}>();

const { t } = useI18n();
const userStore = useUserStore();
const campaignStore = CampaignStore();

const campaign = campaignStore.find(props.campaignId);
const name = ref(campaign?.name || '');
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
    console.error("Error fetching user role:", error);
    isAdmin.value = false;
  } finally {
    loading.value = false;
  }
};

watch(name, (newName) => {
  if (isAdmin.value && campaign) {
    campaign.name = newName;
  } else {
    console.log('Cannot update - not admin or no campaign');
  }
});

onMounted(async () => {
  await checkUserRole();
});
</script>

<style scoped></style>