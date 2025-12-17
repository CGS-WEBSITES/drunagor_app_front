<template>
  <v-btn variant="elevated" id="campaign-save" rounded @click="handleClick">
    <v-icon start>mdi-content-save-outline</v-icon>
    {{ t("label.save-campaign-put") }}
  </v-btn>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { CampaignStore } from "@/store/CampaignStore";
import { HeroStore } from "@/store/HeroStore";
import { useI18n } from "vue-i18n";
/* import axios from "axios"; */

const props = defineProps<{ campaignId: string }>();
const emit = defineEmits(["success", "fail", "open-save-panel"]);
const campaignStore = CampaignStore();
const heroStore = HeroStore();
const token = ref("");
const { t } = useI18n();

function compressCampaignComplete(campaignId: string) {
  const campaign = campaignStore.find(campaignId);
  const campaignCopy = JSON.parse(JSON.stringify(campaign));

  const heroes = heroStore.findAllInCampaign(campaignId);
  const heroesCopy = heroes.map((h) => JSON.parse(JSON.stringify(h)));

  const data = {
    campaignData: campaignCopy,
    heroes: heroesCopy,
    savedAt: new Date().toISOString(),
  };

  token.value = btoa(JSON.stringify(data));
  return campaign.name;
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
