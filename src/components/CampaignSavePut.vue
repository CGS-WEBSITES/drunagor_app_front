<template>
  <div></div>
</template>

<script setup lang="ts">
import axios from "axios";
import { CampaignStore } from "@/store/CampaignStore";
import { HeroStore } from "@/store/HeroStore";
import { ref } from "vue";

const props = defineProps<{
  campaignId: string;
}>();

const emit = defineEmits<{
  (e: "success"): void;
  (e: "fail"): void;
}>();

const campaignStore = CampaignStore();
const heroStore = HeroStore();

function generateCampaignHash(): string {
  const campaign = campaignStore.find(props.campaignId);
  const heroes = heroStore.findAllInCampaign(props.campaignId);

  const data = {
    campaignData: JSON.parse(JSON.stringify(campaign)),
    heroes: heroes.map((h) => JSON.parse(JSON.stringify(h))),
  };

  return btoa(JSON.stringify(data));
}

async function save() {
  try {
    const campaign = campaignStore.find(props.campaignId);
    const trackerHash = generateCampaignHash();

    await axios.put(`/campaigns/alter/${props.campaignId}`, {
      tracker_hash: trackerHash,
      party_name: campaign.name,
    });

    emit("success");
  } catch (error) {
    console.error("Error saving campaign:", error);
    emit("fail");
  }
}

defineExpose({
  save,
});
</script>