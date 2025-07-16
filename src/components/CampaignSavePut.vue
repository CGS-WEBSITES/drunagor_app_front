<template>
  <v-btn variant="elevated" id="campaign-export" rounded @click="saveCampaign">
    {{ t("label.save-campaign-put") }}
  </v-btn>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { CampaignStore } from "@/store/CampaignStore";
import { HeroStore } from "@/store/HeroStore";
import { useI18n } from "vue-i18n";
import axios from "axios";
import { useRoute } from "vue-router";

const props = defineProps<{ campaignId: string }>();
const emit = defineEmits(["success", "fail"]);
const campaignStore = CampaignStore();
const heroStore = HeroStore();
const token = ref("");
const { t } = useI18n();
const route = useRoute();

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

  await axios
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
      return false;
    });
}

defineExpose({ save: saveCampaign });
</script>
