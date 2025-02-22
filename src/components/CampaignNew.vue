<script setup lang="ts">
import { ref } from "vue";
import CoreLogo from "@/assets/campaign/logo/core.webp";
import ApocalypseLogo from "@/assets/campaign/logo/apocalypse.webp";
import AwakeningsLogo from "@/assets/campaign/logo/awakenings.webp";
import { CampaignStore } from "@/store/CampaignStore";
import { Campaign } from "@/store/Campaign";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";

const visible = ref(false);
const campaignStore = CampaignStore();
const router = useRouter();
const { t } = useI18n();

// Defina os IDs fixos para cada campanha
const campaignIds: Record<"core" | "apocalypse" | "awakenings", string> = {
  core: "001",
  apocalypse: "002",
  awakenings: "003"
};

const appUserString = localStorage.getItem('app_user')
if (appUserString) {
  const appUser = JSON.parse(appUserString);
  const usersPk = appUser.users_pk;
  console.log('usersPk', usersPk)
}

function newCampaign(campaign: "core" | "apocalypse" | "awakenings") {
  let campaignId = campaignIds[campaign];
  campaignStore.add(new Campaign(campaignId, campaign));
  visible.value = false;
  console.log('usersPk', appUserString)
  router.push("/campaign-tracker/campaign/" + campaignId);
}
</script>

<template>
  <v-btn variant="elevated" id="campaign-new" rounded @click="visible = true">
    {{ t("label.new-campaign") }}
  </v-btn>
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