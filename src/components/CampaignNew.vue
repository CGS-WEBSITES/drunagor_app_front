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
          <v-btn
            icon="mdi-close"
            variant="text"
            @click="visible = false"
          ></v-btn>
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
                  <v-img
                    :src="CoreLogo.toString()"
                    width="280"
                    height="100"
                    contain
                  ></v-img>
                </v-card>
              </v-col>

              <v-col cols="12" sm="6">
                <v-card
                  class="campaign-card d-flex flex-column justify-center align-center pa-4"
                  @click="newCampaign('apocalypse')"
                  hover
                  height="200"
                >
                  <v-img
                    :src="ApocalypseLogo.toString()"
                    width="280"
                    height="100"
                    contain
                  ></v-img>
                </v-card>
              </v-col>

              <v-col cols="12" sm="12">
                <v-card
                  class="campaign-card d-flex flex-column justify-center align-center pa-4"
                  @click="newCampaign('awakenings')"
                  hover
                  height="200"
                >
                  <v-img
                    :src="AwakeningsLogo.toString()"
                    width="280"
                    height="100"
                    contain
                  ></v-img>
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
                  <v-img
                    :src="UnderKeepLogo.toString()"
                    width="280"
                    height="100"
                    contain
                  ></v-img>
                </v-card>
              </v-col>

              <v-col cols="12" sm="6">
                <v-card
                  class="campaign-card d-flex flex-column justify-center align-center pa-4"
                  @click="newCampaign('underkeep2')"
                  hover
                  height="200"
                >
                  <v-img
                    :src="UnderKeep2Logo.toString()"
                    width="280"
                    height="100"
                    contain
                  ></v-img>
                </v-card>
              </v-col>
            -->
            </v-row>
          </v-container>
        </v-card-text>
      </div>
    </v-card>
  </v-dialog>

  <v-snackbar
    v-model="snackbar.show"
    :color="snackbar.color"
    :timeout="snackbar.timeout"
    location="top"
  >
    {{ snackbar.message }}
    <template v-slot:actions>
      <v-btn variant="text" @click="snackbar.show = false">
        {{ t("label.close") }}
      </v-btn>
    </template>
  </v-snackbar>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import axios from "axios";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import CoreLogo from "@/assets/campaign/logo/core.webp";
import ApocalypseLogo from "@/assets/campaign/logo/apocalypse.webp";
import AwakeningsLogo from "@/assets/campaign/logo/awakenings.webp";
import UnderKeepLogo from "@/assets/logo/underkeep.png";
import UnderKeep2Logo from "@/assets/logo/underkeep2.png";
import { CampaignStore } from "@/store/CampaignStore";
import { HeroStore } from "@/store/HeroStore";
import { Campaign } from "@/store/Campaign";
import { useUserStore } from "@/store/UserStore";

const { t } = useI18n();
const router = useRouter();
const campaignStore = CampaignStore();
const heroStore = HeroStore();

const visible = ref(false);
const user = useUserStore().user;
const loading = ref(false);

const snackbar = reactive({
  show: false,
  message: "",
  color: "error",
  timeout: 5000,
});

function showError(message: string) {
  snackbar.message = message;
  snackbar.color = "error";
  snackbar.show = true;
}

function generateCampaignHash(campaign: Campaign): string {
  const heroes = heroStore.findAllInCampaign(campaign.campaignId);

  const data = {
    campaignData: JSON.parse(JSON.stringify(campaign)),
    heroes: heroes.map((h) => JSON.parse(JSON.stringify(h))),
  };

  return btoa(JSON.stringify(data));
}



async function createCampaign(boxId: number, trackerHash: string) {
  return await axios.post("/campaigns/cadastro", {
    tracker_hash: trackerHash,
    conclusion_percentage: 0,
    party_name: "New Party",
    box: boxId,
    active: true,
  });
}

async function saveCampaign(
  campaignPk: string,
  trackerHash: string,
  partyName: string
) {
  await axios.put(`/campaigns/alter/${campaignPk}`, {
    tracker_hash: trackerHash,
    party_name: partyName,
  });
}

async function addRelationship(
  users_pk: number,
  campaign_fk: string,
  boxId: number
) {
  // CORREÇÃO:
  // 1. Usando 'params' para enviar como Query Parameters (exigência do Swagger)
  // 2. Removido 'party_roles_fk' pois o backend rejeitou (causa do erro 500)
  return await axios.post("rl_campaigns_users/cadastro", null, {
    params: {
      users_fk: users_pk,
      campaigns_fk: Number(campaign_fk),
      skus_fk: boxId,
      active: true,
    },
  });
}

async function newCampaign(
  type: "core" | "apocalypse" | "awakenings" | "underkeep" | "underkeep2"
) {
  loading.value = true;

  try {
    const usersPk = user.users_pk;

    if (!usersPk) {
      showError(t("error.user-not-logged"));
      return;
    }

    const { data } = await axios.get("/skus/search", {
      params: { users_fk: usersPk },
    });

    const skuList = Array.isArray(data.skus) ? data.skus : Object.values(data);
    const expectedName = {
      core: "Corebox",
      apocalypse: "Apocalypse",
      awakenings: "Awakenings",
      underkeep: "underkeep",
      underkeep2: "underkeep2",
    }[type];

    const selectedSku = skuList.find(
      (s: any) => s.name?.toLowerCase() === expectedName.toLowerCase()
    );

    if (!selectedSku) {
      showError(t("error.sku-not-found", { type }));
      return;
    }


    const tempCampaign = new Campaign("temp", type);
    const initialHash = generateCampaignHash(tempCampaign);

    const campaignResp = await createCampaign(selectedSku.skus_pk, initialHash);
    const campaignPk = String(campaignResp.data.campaign.campaigns_pk);

    const newCampaignInstance = new Campaign(campaignPk, type);
    campaignStore.add(newCampaignInstance);

    const finalHash = generateCampaignHash(newCampaignInstance);

    await saveCampaign(campaignPk, finalHash, "New Party");

    try {
      await addRelationship(usersPk, campaignPk, selectedSku.skus_pk);
    } catch (relationshipError: any) {
      campaignStore.remove(campaignPk);

      if (relationshipError.response?.status === 409) {
        showError(t("error.campaign-already-exists"));
        return;
      }
      throw relationshipError;
    }

    visible.value = false;

    router.push({
      path: `/campaign-tracker/campaign/${campaignPk}`,
      query: { sku: selectedSku.skus_pk.toString() },
    });
  } catch (error: any) {
    console.error("Error creating campaign:", error);
    showError(
      error.response?.data?.message ||
        error.message ||
        t("error.campaign-creation-failed")
    );
  } finally {
    loading.value = false;
  }
}
</script>

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