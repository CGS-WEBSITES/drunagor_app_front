<template>
  <div></div>
</template>

<script setup lang="ts">
import axios from "axios";
import { CampaignStore } from "@/store/CampaignStore";
import { HeroStore } from "@/store/HeroStore";
import { useUserStore } from "@/store/UserStore";

const props = defineProps<{
  campaignId: string;
}>();

const emit = defineEmits<{
  (e: "success"): void;
  (e: "fail"): void;
}>();

const campaignStore = CampaignStore();
const heroStore = HeroStore();
const userStore = useUserStore();

async function getHeroHashesFromBackend(): Promise<any[]> {
  try {
    const response = await axios.get(`/playable_heroes/search`, {
      params: {
        users_fk: userStore.user.users_pk,
      },
    });

    if (response.data && Array.isArray(response.data.heroes)) {
      return response.data.heroes
        .filter((h: any) => h.hero_hash && h.campaigns_fk === props.campaignId)
        .map((h: any) => {
          try {
            return JSON.parse(atob(h.hero_hash));
          } catch {
            return null;
          }
        })
        .filter((h: any) => h !== null && h.campaignId === props.campaignId);
    }

    return [];
  } catch (error) {
    console.error("Error getting hero hashes:", error);
    return [];
  }
}

function generateCampaignHash(heroesData: any[]): string {
  const campaign = campaignStore.find(props.campaignId);

  const data = {
    campaignData: JSON.parse(JSON.stringify(campaign)),
    heroes: heroesData,
    savedAt: new Date().toISOString(),
  };

  return btoa(JSON.stringify(data));
}

async function save() {
  try {
    const campaign = campaignStore.find(props.campaignId);

    const heroesData = await getHeroHashesFromBackend();

    const trackerHash = generateCampaignHash(heroesData);

    await axios.put(`/campaigns/alter/${props.campaignId}`, {
      tracker_hash: trackerHash,
      party_name: campaign.name,
    });

    const storageKey = `campaign_hash_${props.campaignId}`;
    localStorage.setItem(storageKey, trackerHash);

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