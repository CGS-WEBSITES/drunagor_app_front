<template>
  <v-text-field
    :label="t('text.party-name')"
    variant="outlined"
    v-model="partyName"
    :readonly="!isAdmin"
    :disabled="!isAdmin"
    :loading="loading"
  ></v-text-field>
</template>

<script setup lang="ts">
import { CampaignStore } from "@/store/CampaignStore";
import { useUserStore } from "@/store/UserStore";
import { ref, onMounted, computed } from "vue";
import { useI18n } from "vue-i18n";
import axios from "axios";

const props = defineProps<{
  campaignId: string;
}>();

const { t } = useI18n();
const userStore = useUserStore();
const campaignStore = CampaignStore();

const isAdmin = ref(false);
const loading = ref(true);

const partyName = computed({
  get() {
    return campaignStore.find(props.campaignId)?.name ?? '';
  },
  set(newValue) {
    if (isAdmin.value) {
      campaignStore.updateCampaignProperty(props.campaignId, 'name', newValue);
    }
  },
});

const checkUserRole = async () => {
  loading.value = true;
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

onMounted(checkUserRole);
</script>