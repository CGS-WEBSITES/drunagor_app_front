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

              <v-col cols="12" sm="6">
                <v-card
                  class="campaign-card d-flex flex-column justify-center align-center pa-4"
                  @click="newCampaign('underkeep2')"
                  hover
                  height="200"
                >
                  <v-img :src="UnderKeep2Logo.toString()" width="280" height="100" contain></v-img>
                </v-card>
              </v-col>

            </v-row>
          </v-container>
        </v-card-text>
      </div>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref } from "vue";
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
    box: boxId,
  });
}

async function saveCampaign(campaignPk: string, trackerHash: string, partyName: string) {
  await axios.put(`/campaigns/alter/${campaignPk}`, {
    tracker_hash: trackerHash,
    party_name: partyName,
  });
}

async function addRelationship(
  users_pk: number,
  campaign_fk: string,
  boxId: number,
) {
  await axios.post("rl_campaigns_users/cadastro", {
    users_fk: users_pk,
    campaigns_fk: campaign_fk,
    party_roles_fk: 1,
    skus_fk: boxId,
  });
}

async function newCampaign(
  type: "core" | "apocalypse" | "awakenings" | "underkeep" | "underkeep2",
) {
  loading.value = true;

  try {
    const usersPk = user.users_pk;

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
      (s: any) => s.name?.toLowerCase() === expectedName.toLowerCase(),
    );

    if (!selectedSku) {
      throw new Error(`SKU not found for campaign type: ${type}`);
    }

    // Cria campanha temporária com hash inicial
    const tempCampaign = new Campaign("temp", type);
    const initialHash = generateCampaignHash(tempCampaign);

    // Cria a campanha no backend
    const campaignResp = await createCampaign(selectedSku.skus_pk, initialHash);
    const campaignPk = String(campaignResp.data.campaign.campaigns_pk);

    // Cria a campanha final com o ID correto
    const newCampaign = new Campaign(campaignPk, type);
    campaignStore.add(newCampaign);

    // Gera hash atualizado com o ID correto
    const finalHash = generateCampaignHash(newCampaign);

    // Atualiza a campanha com o hash correto
    await saveCampaign(campaignPk, finalHash, "");

    // Adiciona relacionamento usuário-campanha
    await addRelationship(usersPk, campaignPk, selectedSku.skus_pk);

    visible.value = false;

    // Redireciona para a campanha
    router.push({
      path: `/campaign-tracker/campaign/${campaignPk}`,
      query: { sku: selectedSku.skus_pk.toString() },
    });
  } catch (error) {
    console.error("Error creating campaign:", error);
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