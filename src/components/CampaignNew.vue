<script setup lang="ts">
import { ref } from "vue";
import CoreLogo from "@/assets/campaign/logo/core.webp";
import ApocalypseLogo from "@/assets/campaign/logo/apocalypse.webp";
import AwakeningsLogo from "@/assets/campaign/logo/awakenings.webp";
import { CampaignStore } from "@/store/CampaignStore";
import { Campaign } from "@/store/Campaign";
import { customAlphabet } from "nanoid";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";

const visible = ref(false);
const campaignStore = CampaignStore();
const nanoid = customAlphabet("1234567890", 5);
const router = useRouter();
const { t } = useI18n();

function newCampaign(campaign: "core" | "apocalypse" | "awakenings") {
  let campaignId = nanoid();
  campaignStore.add(new Campaign(campaignId, campaign));
  visible.value = false;
  router.push("/campaign-tracker/campaign/" + campaignId);
}
</script>

<template>
  <v-btn variant="elevated" id="campaign-new" @click="visible = true">{{
    t("label.new-campaign")
  }}</v-btn>
  <v-dialog v-model="visible">
    <v-card>
      <v-card-title class="text-center">
        {{ t("label.new-campaign") }}
      </v-card-title>
      <v-card-text class="d-flex flex-column align-center justify-center">
        <v-img
          center
          width="300"
          id="campaign-core"
          class="cursor-pointer"
          :src="CoreLogo.toString()"
          @click="newCampaign('core')"
        />
        <v-img
          width="300"
          id="campaign-apocalypse"
          class="cursor-pointer"
          :src="ApocalypseLogo.toString()"
          @click="newCampaign('apocalypse')"
        />
        <v-img
          width="300"
          id="campaign-awakenings"
          class="cursor-pointer"
          :src="AwakeningsLogo.toString()"
          @click="newCampaign('awakenings')"
        />
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<style scoped></style>
