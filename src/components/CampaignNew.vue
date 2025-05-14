<script setup lang="ts">
import { ref } from "vue";
import CoreLogo from "@/assets/campaign/logo/core.webp";
import ApocalypseLogo from "@/assets/campaign/logo/apocalypse.webp";
import AwakeningsLogo from "@/assets/campaign/logo/awakenings.webp";
import UnderKeepLogo from "@/assets/logo/underkeep.png";
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

function newCampaign(campaign: "core" | "apocalypse" | "awakenings" | "underkeep") {
  let campaignId = nanoid();
  campaignStore.add(new Campaign(campaignId, campaign));
  visible.value = false;
  router.push("/campaign-tracker/campaign/" + campaignId);
}

const selected = ref(null);





</script>

<template>
  <v-btn variant="elevated" id="campaign-new" rounded @click="visible = true">
    {{ t("label.new-campaign") }}
  </v-btn>

  <v-dialog v-model="visible" max-width="800">
    <v-card>

      <v-card-text>
        <v-slide-group
          v-model="selected"
          class="pl-1"
          show-arrows
          center-active
        >
          <v-slide-item value="core">
            <v-img
              width="336"
              height="200"
              class="ma-2 cursor-pointer"
              :src="CoreLogo.toString()"
              @click="newCampaign('core')"
            />
          </v-slide-item>

          <v-slide-item value="apocalypse">
            <v-img
              width="336"
              height="200"
              class="ma-2 cursor-pointer"
              :src="ApocalypseLogo.toString()"
              @click="newCampaign('apocalypse')"
            />
          </v-slide-item>

          <v-slide-item value="awakenings">
            <v-img
              width="336"
              height="200"
              class="ma-2 cursor-pointer"
              :src="AwakeningsLogo.toString()"
              @click="newCampaign('awakenings')"
            />
          </v-slide-item>

          <v-slide-item value="underkeep">
            <v-img
              width="336"
              height="200"
              class="ml-0 cursor-pointer"
              :src="UnderKeepLogo.toString()"
              @click="newCampaign('underkeep')"
            />
          </v-slide-item>
        </v-slide-group>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<style scoped>

.v-slide-item--active {
  transform: scale(1.1);
  transition: transform 0.3s ease;
  z-index: 2;
}

</style>
