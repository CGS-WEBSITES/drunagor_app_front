<template>
  <div></div>
</template>

<script setup lang="ts">
import axios from "axios";
import { CampaignStore } from "@/store/CampaignStore";

const props = defineProps<{
  campaignId: string;
}>();

const emit = defineEmits<{
  (e: "success"): void;
  (e: "fail"): void;
}>();

const campaignStore = CampaignStore();

function generateCampaignHash(): string {
  const campaign = campaignStore.find(props.campaignId);
  const heroes = campaignStore.findAllHeroes(props.campaignId);

  const campaignData = JSON.parse(JSON.stringify(campaign));
  delete campaignData.heroes; 

  const heroesData = heroes.map((hero) => {
    const cleanHero = JSON.parse(JSON.stringify(hero));
    delete cleanHero.playableHeroesPk;
    return cleanHero;
  });

  const data = {
    campaignData,
    heroes: heroesData,
    savedAt: new Date().toISOString(),
  };

  return btoa(JSON.stringify(data));
}

async function save(): Promise<void> {
  try {
    const campaign = campaignStore.find(props.campaignId);
    const trackerHash = generateCampaignHash();

    await axios.put(`/campaigns/alter/${props.campaignId}`, {
      tracker_hash: trackerHash,
      party_name: campaign.name || "",
    });

    const storageKey = `campaign_hash_${props.campaignId}`;
    localStorage.setItem(storageKey, trackerHash);

    emit("success");
  } catch (error) {
    console.error("[CampaignSavePut] Error saving campaign:", error);
    emit("fail");
  }
}

defineExpose({
  save,
});
</script>
