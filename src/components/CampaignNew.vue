<script setup lang="ts">
import { ref, onMounted } from "vue";
import axios from "axios";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import CoreLogo from "@/assets/campaign/logo/core.webp";
import ApocalypseLogo from "@/assets/campaign/logo/apocalypse.webp";
import AwakeningsLogo from "@/assets/campaign/logo/awakenings.webp";
import UnderKeepLogo from "@/assets/logo/underkeep.png";
import { CampaignStore } from "@/store/CampaignStore";
import { HeroStore } from "@/store/HeroStore";
import { Campaign } from "@/store/Campaign";
import { useUserStore } from "@/store/UserStore";

const { t } = useI18n();
const router = useRouter();
const campaignStore = CampaignStore();
const heroStore = HeroStore();

const visible = ref(false);
const successDialogVisible = ref(false);
const token = ref("");
const user = useUserStore().user
const loading = ref(false)

// const NEW_CAMPAIGN_ID = Date.now().toString();

function compressCampaign(campaignId: string) {

  const campaignCopy = JSON.parse(
    JSON.stringify(campaignStore.find(campaignId)),
  );

  const heroes = heroStore.findAllInCampaign(campaignId);

  const data = {
    campaignData: campaignCopy,
    heroes: heroes.map((h) => {
      const clone = JSON.parse(JSON.stringify(h));
      return clone;
    }),
  };

  token.value = btoa(JSON.stringify(data));
}

async function createCampaign(boxId: number) {
  return await axios.post("/campaigns/cadastro", {
    tracker_hash: "",
    conclusion_percentage: 0,
    box: boxId,
  }).then((res) => {
    return res.data
  })
}

async function saveCampaign(campaign_pk: number, party_name: string) {

  await axios.put(`campaigns/alter/${campaign_pk}`, {
    tracker_hash: token.value, party_name: party_name,
  });
}

async function addRelationship(users_pk: number, campaign_fk: string, boxId: number) {

  await axios.post("rl_campaigns_users/cadastro", {
    users_fk: users_pk,
    campaigns_fk: campaign_fk,
    party_roles_fk: 1,
    skus_fk: boxId,
  });

  successDialogVisible.value = true;

}

async function newCampaign(type: "core" | "apocalypse" | "awakenings" | "underkeep") {
  
  loading.value = true

  const usersPk = user.users_pk;

  const { data } = await axios.get("/skus/search", {
    params: { users_fk: usersPk },
  });

  const skuList = Array.isArray(data.skus) ? data.skus : Object.values(data);
  const expectedName = {
    core: "Corebox",
    apocalypse: "Apocalypse",
    awakenings: "Awakenings",
    underkeep: "underkeep"
  }[type];

  const selectedSku = skuList.find(
    (s: any) => s.name?.toLowerCase() === expectedName.toLowerCase()
  );

  let campaignResp = await createCampaign(selectedSku.skus_pk)

  let campaignFk = String(campaignResp.campaign.campaigns_pk)

  let newCampaign = new Campaign(campaignFk, type)

  campaignStore.add(newCampaign);

  compressCampaign(campaignFk)

  await saveCampaign(campaignFk, "")

  await addRelationship(usersPk, campaignFk, selectedSku.skus_pk)

  loading.value = false

  // 4) Redirecione usando o serverPk no path
  router.push({
    path: `/campaign-tracker/campaign/${campaignFk}`,
    query: { sku: selectedSku.skus_pk.toString() },
  });
}

const selected = ref(null);


</script>

<template>

  <v-btn variant="elevated" id="campaign-new" rounded @click="visible = true">
    {{ t("label.new-campaign") }}
  </v-btn>

   <v-dialog v-model="visible" max-width="750px" persistent>
    <v-card class="rounded-lg">
      <div v-if="loading" class="loading-container">
        <v-progress-circular
          :size="70"
          :width="7"
          color="primary"
          indeterminate
        ></v-progress-circular>
        <h2 class="mt-4 text-grey-darken-1">Building your adventure...</h2>
        <p class="text-grey-lighten-1">Please wait a moment.</p>
      </div>

      <div v-else>
        <div class="d-flex justify-end pa-2">
            <v-btn icon="mdi-close" variant="text" @click="visible = false"></v-btn>
        </div>
        
        <v-card-text class="pt-0">
          <v-container fluid>
            <v-row>
              <v-col cols="12" sm="6">
                <v-card
                  class="campaign-card d-flex flex-column justify-center align-center pa-4"
                  @click="newCampaign('core')"
                  hover
                  height="200"
                >
                  <v-img :src="CoreLogo.toString()" width="280" height="100" contain></v-img>
                </v-card>
              </v-col>

              <v-col cols="12" sm="6">
                <v-card
                  class="campaign-card d-flex flex-column justify-center align-center pa-4"
                  @click="newCampaign('apocalypse')"
                  hover
                  height="200"
                >
                  <v-img :src="ApocalypseLogo.toString()" width="280" height="100" contain></v-img>
                </v-card>
              </v-col>

              <v-col cols="12" sm="12">
                <v-card
                  class="campaign-card d-flex flex-column justify-center align-center pa-4"
                  @click="newCampaign('awakenings')"
                  hover
                  height="200"
                >
                  <v-img :src="AwakeningsLogo.toString()" width="280" height="100" contain></v-img>
                </v-card>
              </v-col>

              <!-- 
              <v-col cols="12" sm="6">
                <v-card
                  class="campaign-card d-flex flex-column justify-center align-center pa-4"
                  @click="newCampaign('underkeep')"
                  hover
                  height="200"
                >
                  <v-img :src="UnderKeepLogo.toString()" width="280" height="100" contain></v-img>
                </v-card>
              </v-col>
              -->
            </v-row>
          </v-container>
        </v-card-text>
      </div>
    </v-card>
  </v-dialog>
</template>

<style scoped>
.campaign-card {
  cursor: pointer;
  transition: transform 0.2s ease-in-out;
}

.campaign-card:hover {
  transform: translateY(-5px);
}

.loading-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 400px;
  text-align: center;
}
</style>
