<template>
  <v-number-input
    v-if="isAdmin && !loading"
    :reverse="false"
    controlVariant="split"
    :label="t('text.number-of-runes')"
    :hideInput="false"
    :inset="false"
    variant="outlined"
    id="runes"
    :min="0"
    v-model="runesValue"
  ></v-number-input>

  <v-text-field
    v-else-if="!loading"
    :model-value="runesValue"
    :label="t('text.number-of-runes')"
    variant="outlined"
    readonly
    persistent-hint
    :disabled="!isAdmin"
  ></v-text-field>

  <v-text-field
    v-else
    :label="t('text.number-of-runes')"
    variant="outlined"
    loading
    readonly
    :disabled="!isAdmin"
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
const isAdmin = ref(false);
const loading = ref(true);
const runesValue = ref(campaign?.sequentialAdventureRunes || 0);

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
    console.error("CampaignRunes - Error fetching user role:", error);
    isAdmin.value = false;
  } finally {
    loading.value = false;
  }
};

watch(runesValue, (newValue) => {
  if (isAdmin.value && campaign) {
    campaign.sequentialAdventureRunes = newValue;
  } else {
    console.log('CampaignRunes - Cannot update - not admin or no campaign');
  }
});

onMounted(async () => {
  await checkUserRole();
});
</script>

<style scoped></style>