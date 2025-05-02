<script setup lang="ts">
import { ref } from "vue";
import axios from "axios";
import { useToast } from "primevue/usetoast";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import CoreLogo from "@/assets/campaign/logo/core.webp";
import ApocalypseLogo from "@/assets/campaign/logo/apocalypse.webp";
import AwakeningsLogo from "@/assets/campaign/logo/awakenings.webp";
import { CampaignStore } from "@/store/CampaignStore";
import { HeroStore } from "@/store/HeroStore";
import { Campaign } from "@/store/Campaign";

const toast = useToast();
const { t } = useI18n();
const router = useRouter();
const campaignStore = CampaignStore();
const heroStore = HeroStore();

const visible = ref(false);
const successDialogVisible = ref(false);
const token = ref("");
let createdCampaignId = ""

// ––– Gera token exatamente igual antes –––
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

// ––– Agora recebe o skus_pk diretamente –––
async function saveCampaign(boxId: number) {
  const resp = await axios.post("/campaigns/cadastro", {
    tracker_hash: token.value,
    conclusion_percentage: 0,
    box: boxId,
  });

  createdCampaignId = resp.data.campaign.campaigns_pk;

  toast.add({
    severity: "success",
    summary: t("label.success"),
    detail: "Campaign saved successfully.",
    life: 3000,
  });

  const users_pk = JSON.parse(localStorage.getItem("app_user")!).users_pk;
  await axios.post("rl_campaigns_users/cadastro", {
    users_fk: users_pk,
    campaigns_fk: resp.data.campaign.campaigns_pk,
    party_roles_fk: 1,
    skus_fk: boxId,
  });

  successDialogVisible.value = true;

  return createdCampaignId;
}

// ––– Fluxo principal –––
async function newCampaign(type: "core" | "apocalypse" | "awakenings") {
  const usersPk = JSON.parse(localStorage.getItem("app_user")!).users_pk;
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
    (s: any) => s.name?.toLowerCase() === expectedName.toLowerCase(),
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

  // adiciona no store
  campaignStore.add(new Campaign(createdCampaignId, type));

  // gera token e salva usando o skus_pk
  openModal(createdCampaignId);
  await saveCampaign(selectedSku.skus_pk);

  // redireciona pegando de fato o skus_pk
  router.push(
    `/campaign-tracker/campaign/${createdCampaignId}?sku=${selectedSku.skus_pk}`,
  );
}
</script>

<template>
  <v-btn variant="elevated" rounded @click="visible = true">
    {{ t("label.new-campaign") }}
  </v-btn>

  <v-dialog v-model="visible">
    <v-card>
      <v-card-title class="text-center">{{
        t("label.new-campaign")
      }}</v-card-title>
      <v-card-text class="d-flex flex-column align-center">
        <v-img
          width="300"
          class="cursor-pointer"
          :src="CoreLogo"
          @click="newCampaign('core')"
        />
        <v-img
          width="300"
          class="cursor-pointer"
          :src="ApocalypseLogo"
          @click="newCampaign('apocalypse')"
        />
        <v-img
          width="300"
          class="cursor-pointer"
          :src="AwakeningsLogo"
          @click="newCampaign('awakenings')"
        />
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
