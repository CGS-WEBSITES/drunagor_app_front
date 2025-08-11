<template>
  <v-btn 
    variant="elevated" 
    id="campaign-export" 
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
import { HeroStore } from "@/store/HeroStore";
import { useI18n } from "vue-i18n";
import axios from "axios";

const props = defineProps<{ campaignId: string }>();
const emit = defineEmits(["success", "fail", "open-save-panel"]);
const campaignStore = CampaignStore();
const heroStore = HeroStore();
const token = ref("");
const { t } = useI18n();

function compressCampaign(campaignId: string) {
  const campaign = campaignStore.find(campaignId);

  const campaignCopy = JSON.parse(JSON.stringify(campaign));

  const heroes = heroStore.findAllInCampaign(campaignId);

  const data = {
    campaignData: campaignCopy,
    heroes: heroes.map((h) => {
      const clone = JSON.parse(JSON.stringify(h));
      return clone;
    }),
  };

  token.value = btoa(JSON.stringify(data));

  return campaign.name;
}

async function saveCampaign() {
  const party_name = compressCampaign(props.campaignId);

  return await axios
    .put(`campaigns/alter/${props.campaignId}`, {
      tracker_hash: token.value,
      party_name: party_name,
    })
    .then(() => {
      emit("success");
      return true;
    })
    .catch((err) => {
      emit("fail");
      throw err;
    });
}

function handleClick() {
  emit('open-save-panel');
}

defineExpose({ save: saveCampaign });
</script>
