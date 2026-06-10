<template>
  <v-btn variant="elevated" id="campaign-new" rounded @click="visible = true">
    {{ t("label.new-campaign") }}
  </v-btn>

  <v-dialog v-model="visible" max-width="500px" persistent scrollable>
    <v-card class="rounded-xl" color="grey-darken-4" style="border: 1px solid rgba(255, 255, 255, 0.1);">
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

      <div v-else class="d-flex flex-column" style="max-height: 90vh;">
        <v-card-title class="d-flex justify-space-between align-center px-6 pt-6 pb-2">
          <span class="text-h5 font-weight-black text-white">Choose Campaign Box</span>
          <v-btn
            icon="mdi-close"
            variant="text"
            color="white"
            @click="visible = false"
          ></v-btn>
        </v-card-title>

        <v-card-text class="px-6 pb-6 pt-2" style="overflow-y: auto;">
          <div class="d-flex flex-column ga-4">
            <v-card
              class="campaign-card d-flex justify-center align-center pa-6 rounded-xl border-core"
              @click="newCampaign('core')"
              height="140"
              flat
            >
              <v-img
                :src="CoreLogo.toString()"
                max-width="320"
                max-height="90"
                contain
              ></v-img>
            </v-card>

            <v-card
              class="campaign-card d-flex justify-center align-center pa-6 rounded-xl border-apocalypse"
              @click="newCampaign('apocalypse')"
              height="140"
              flat
            >
              <v-img
                :src="ApocalypseLogo.toString()"
                max-width="320"
                max-height="90"
                contain
              ></v-img>
            </v-card>

            <v-card
              class="campaign-card d-flex justify-center align-center pa-6 rounded-xl border-awakenings"
              @click="newCampaign('awakenings')"
              height="140"
              flat
            >
              <v-img
                :src="AwakeningsLogo.toString()"
                max-width="320"
                max-height="90"
                contain
              ></v-img>
            </v-card>
          </div>
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

defineExpose({
  openModal: () => { visible.value = true; }
});
</script>

<style scoped>
.campaign-card {
  cursor: pointer;
  background: linear-gradient(145deg, rgba(45, 45, 45, 0.9) 0%, rgba(25, 25, 25, 0.9) 100%) !important;
  border: 2px solid rgba(255, 255, 255, 0.08) !important;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1) !important;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3) !important;
}

.campaign-card:hover {
  transform: translateY(-4px) scale(1.02);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.5) !important;
}

.border-core:hover {
  border-color: #3C7376 !important;
}

.border-apocalypse:hover {
  border-color: #802222 !important;
}

.border-awakenings:hover {
  border-color: #E2B13C !important;
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