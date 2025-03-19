<script setup lang="ts">
import { ref } from "vue";
import axios from "axios";
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

// const campaignIds: Record<"core" | "apocalypse" | "awakenings", string> = {
  //   core: "001",
  //   apocalypse: "002",
  //   awakenings: "003"
  // };
  
// Fixed ID for all new campaigns
const NEW_CAMPAIGN_ID = "001";

const campaignNames: Record<"core" | "apocalypse" | "awakenings", string> = {
  core: "Corebox",
  apocalypse: "Apocalypse",
  awakenings: "Awakenings"
};

let usersPk: number | null = null;

const appUserString = localStorage.getItem('app_user');
if (appUserString) {
  const appUser = JSON.parse(appUserString);
  usersPk = appUser.users_pk;
}

function newCampaign(campaign: "core" | "apocalypse" | "awakenings") {
  if (!usersPk) {
    console.error("User PK not found");
    return;
  }

  axios.get('/skus/search', { params: { users_fk: usersPk } })
    .then(response => {
      const data = response.data;

      let skuList: any[] = [];
      if (data && data.skus && Array.isArray(data.skus)) {
        skuList = data.skus;
      } else if (Array.isArray(data)) {
        skuList = data;
      } else {
        skuList = Object.values(data);
      }

      const expectedName = campaignNames[campaign];
      const selectedSku = skuList.find((sku: any) => {
        return sku.name && sku.name.toLowerCase() === expectedName.toLowerCase();
      });

      if (!selectedSku) {
        console.error(`SKU not found for campaign ${campaign}`);
        return;
      }

      campaignStore.add(new Campaign(NEW_CAMPAIGN_ID, campaign));

      visible.value = false;

      router.push(`/campaign-tracker/campaign/${NEW_CAMPAIGN_ID}?sku=${selectedSku.skus_pk}`);
    })
    .catch(error => {
      console.error(error);
    });
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
