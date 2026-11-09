<template>
  <CampaignImmersiveView
    :campaign-id="DEV_CAMPAIGN_ID"
    :campaign="campaign"
    :hero-store="heroStore"
    :user-store="userStore"
    :show-save-campaign-button="true"
  />
</template>

<script setup lang="ts">
import { useRoute } from "vue-router";
import CampaignImmersiveView from "@/components/CampaignImmersiveView.vue";
import { HeroStore } from "@/store/HeroStore";
import { useUserStore } from "@/store/UserStore";
import { CampaignStore } from "@/store/CampaignStore";
import { createDevCampaign } from "@/dev/devSandbox";
import { DEV_CAMPAIGN_ID } from "@/dev/mockApi";

// Created in setup so the campaign exists before the real view mounts.
const campaign = createDevCampaign(["vorn", "lorelai", "maya"]);
const heroStore = HeroStore();
const userStore = useUserStore();

// ?filled=1: a campaign in progress, with Runes and your Hero (Vorn) filled in,
// so "Welcome back" has something to show.
if (useRoute().query.filled) {
  const campaignStore = CampaignStore();
  campaignStore.updateCampaignProperty(DEV_CAMPAIGN_ID, "door", "THE BARRICADED PATH");
  campaignStore.updateCampaignProperty(DEV_CAMPAIGN_ID, "sequentialAdventureRunes", 3);
  campaignStore.updateCampaignProperty(DEV_CAMPAIGN_ID, "runeCardIds", [2, 5]);
  const vorn = heroStore.findInCampaign("vorn", DEV_CAMPAIGN_ID);
  vorn.equipment.weaponId = "amiran-hammer";
  vorn.equipment.armorId = "smugglers-vest";
  vorn.skillIds = ["vorn-melee-1"];
}
</script>
