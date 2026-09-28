<template>
  <CampaignImmersiveView
    :campaign-id="DEV_CAMPAIGN_ID"
    :campaign="campaign"
    :hero-store="heroStore"
    :user-store="userStore"
    :show-save-campaign-button="false"
  />
</template>

<script setup lang="ts">
import CampaignImmersiveView from "@/components/CampaignImmersiveView.vue";
import { HeroStore } from "@/store/HeroStore";
import { useUserStore } from "@/store/UserStore";
import { createDevCampaign } from "@/dev/devSandbox";
import { DEV_CAMPAIGN_ID } from "@/dev/mockApi";

// Created in setup so the campaign exists before the real view mounts.
const campaign = createDevCampaign(["vorn", "lorelai", "maya"]);
const heroStore = HeroStore();
const userStore = useUserStore();
</script>
