<script setup lang="ts">
import { ref, onMounted } from "vue";
import axios from "axios";
import { useToast } from "primevue/usetoast";
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

const toast = useToast();
const { t } = useI18n();
const router = useRouter();
const campaignStore = CampaignStore();
const heroStore = HeroStore();

const visible = ref(false);
const successDialogVisible = ref(false);
const token = ref("");
const user = useUserStore().user

// const NEW_CAMPAIGN_ID = Date.now().toString();

function openModal(campaignId: string) {
  const campaignCopy = JSON.parse(
    JSON.stringify(campaignStore.find(campaignId)),
  );
  campaignCopy.campaignId = "";
  const heroes = heroStore
    .findAllInCampaign(campaignId)
    .map((h) => ({ ...h, campaignId: "" }));

  token.value = btoa(JSON.stringify({ campaignData: campaignCopy, heroes }));
}

async function saveCampaign(boxId: number) {
  const resp = await axios.post("/campaigns/cadastro", {
    tracker_hash: token.value,
    conclusion_percentage: 0,
    box: boxId,
  });

  const serverPk = resp.data.campaign.campaigns_pk.toString();
  toast.add({
    severity: "success",
    summary: t("label.success"),
    detail: "Campaign saved successfully.",
    life: 3000,
  });

  const users_pk = JSON.parse(localStorage.getItem("app_user")!).users_pk;
  await axios.post("rl_campaigns_users/cadastro", {
    users_fk: users_pk,
    campaigns_fk: serverPk,
    party_roles_fk: 1,
    skus_fk: boxId,
  });
  
  successDialogVisible.value = true;
  
  return serverPk;
}

// function newCampaign(campaign: "core" | "apocalypse" | "awakenings" | "underkeep") {
//   let campaignId = nanoid();
//   campaignStore.add(new Campaign(campaignId, campaign));
//   visible.value = false;
//   router.push("/campaign-tracker/campaign/" + campaignId);
// }

async function newCampaign(type: "core" | "apocalypse" | "awakenings") {
  const usersPk = user.users_pk;

  const { data } = await axios.get("/skus/search", {
    params: { users_fk: usersPk },
  });
  
  const skuList = Array.isArray(data.skus) ? data.skus : Object.values(data);
  const expectedName = {
    core: "Corebox",
    apocalypse: "Apocalypse",
    awakenings: "Awakenings",
  }[type];
  const selectedSku = skuList.find(
    (s: any) => s.name?.toLowerCase() === expectedName.toLowerCase()
  );

  if (!selectedSku) {
    toast.add({
      severity: "error",
      summary: t("label.error"),
      detail: `SKU for ${expectedName} not found.`,
      life: 3000,
    });
    return;
  }

  // 1) Primeiro, salve no back e pegue o ID real
  const serverPk = await saveCampaign(selectedSku.skus_pk);

  // 2) Agora crie a campanha no store usando o serverPk
  campaignStore.add(new Campaign(serverPk, type));

  // 3) Abra o modal para esse ID real
  openModal(serverPk);

  // 4) Redirecione usando o serverPk no path
  router.push({
    path: `/campaign-tracker/campaign/${serverPk}`,
    query: { sku: selectedSku.skus_pk.toString() },
  });
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
        <v-slide-group v-model="selected" class="pl-1" show-arrows center-active>
          <v-slide-item value="core">
            <v-img width="336" height="200" class="ma-2 cursor-pointer" :src="CoreLogo.toString()"
              @click="newCampaign('core')" />
          </v-slide-item>

          <v-slide-item value="apocalypse">
            <v-img width="336" height="200" class="ma-2 cursor-pointer" :src="ApocalypseLogo.toString()"
              @click="newCampaign('apocalypse')" />
          </v-slide-item>

          <v-slide-item value="awakenings">
            <v-img width="336" height="200" class="ma-2 cursor-pointer" :src="AwakeningsLogo.toString()"
              @click="newCampaign('awakenings')" />
          </v-slide-item>

          <v-slide-item value="underkeep">
            <v-img width="336" height="200" class="ml-0 cursor-pointer" :src="UnderKeepLogo.toString()"
              @click="newCampaign('underkeep')" />
          </v-slide-item>
        </v-slide-group>
      </v-card-text>
    </v-card>
  </v-dialog>

  <v-dialog v-model="successDialogVisible" max-width="300">
    <v-card>
      <v-card-title>{{ t("label.success") }}</v-card-title>
      <v-card-text>
        {{ t("Campaign created successfully") }}
      </v-card-text>
      <v-card-actions>
        <v-btn block @click="successDialogVisible = false">
          {{ t("label.close") }}
        </v-btn>
      </v-card-actions>
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
