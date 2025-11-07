<template>
  <v-btn
    variant="elevated"
    id="campaign-save"
    rounded
    @click="handleClick"
  >
    <v-icon start>mdi-content-save-outline</v-icon>
    {{ t("label.save-campaign-put") }}
  </v-btn>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { CampaignStore } from "@/store/CampaignStore";
import { useI18n } from "vue-i18n";
/* import axios from "axios"; */

const props = defineProps<{ campaignId: string }>();
const emit = defineEmits(["success", "fail", "open-save-panel"]);
const campaignStore = CampaignStore();
const token = ref("");
const { t } = useI18n();

function compressCampaign(campaignId: string) {
  const campaign = campaignStore.find(campaignId);
  const campaignCopy = JSON.parse(JSON.stringify(campaign));

  const data = {
    campaignData: campaignCopy,
  };

  token.value = btoa(JSON.stringify(data));
  return campaign.name;
}

async function saveCampaign() {
  const party_name = compressCampaign(props.campaignId);
  console.log("party_name:", party_name);
  // Salva no localStorage temporariamente
  try {
    localStorage.setItem(`campaign_hash_${props.campaignId}`, token.value);
    
    // Quando o backend estiver pronto, descomentar:
    // await axios.put(`campaigns/alter/${props.campaignId}`, {
    //   tracker_hash: token.value,
    //   party_name: party_name,
    // });
    
    emit("success");
    return true;
  } catch (err) {
    emit("fail");
    throw err;
  }
}

async function handleClick() {
  try {
    await saveCampaign();
    emit('open-save-panel');
  } catch (error) {
    console.error("Error saving campaign:", error);
  }
}

defineExpose({ save: saveCampaign });
</script>