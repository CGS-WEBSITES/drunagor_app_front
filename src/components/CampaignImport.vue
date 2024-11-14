<script setup lang="ts">
import { ref } from "vue";
import { CampaignStore } from "@/store/CampaignStore";
import { HeroStore } from "@/store/HeroStore";
import { useRouter } from "vue-router";
import { Campaign } from "@/store/Campaign";
import type { Hero } from "@/store/Hero";
import { customAlphabet } from "nanoid";
import { HeroEquipment } from "@/store/Hero";
import { useToast } from "primevue/usetoast";
import { useI18n } from "vue-i18n";

const toast = useToast();

const visible = ref(false);
const campaignStore = CampaignStore();
const heroStore = HeroStore();
const router = useRouter();
const nanoid = customAlphabet("1234567890", 5);
const { t } = useI18n();

const token = ref("");

function importCampaign() {
  try {
    const data = JSON.parse(atob(token.value));
    const campaignId = nanoid();

    let campaign: Campaign;
    if ("campaign" in data || "name" in data) {
      // This means that it's a legacy token
      campaign = new Campaign(campaignId, data.campaign);
      campaign.name = data.name ?? "";
    } else if ("campaignData" in data) {
      campaign = data.campaignData;
      campaign.campaignId = campaignId;
    } else {
      toast.add({
        severity: "error",
        summary: "Error",
        detail: "Invalid token.",
        life: 3000,
      });
      return;
    }

    campaignStore.add(campaign);

    const heroes = data.heroes as Hero[];
    heroes.forEach((h) => {
      h.campaignId = campaignId;

      if (typeof h.equipment === "undefined") {
        h.equipment = new HeroEquipment();
      }

      if (typeof h.sequentialAdventureState === "undefined") {
        h.sequentialAdventureState = null;
      }

      heroStore.add(h);
    });
    closeModal();
    toast.add({
      severity: "success",
      summary: t("label.success"),
      detail: t("text.campaign-imported"),
      life: 3000,
    });
    router.push({ name: "Campaign", params: { id: campaignId } });
  } catch (e) {
    toast.add({
      severity: "error",
      summary: "Error",
      detail: "Invalid token",
      life: 3000,
    });
    return;
  }
}

function openModal() {
  visible.value = true;
}

function closeModal() {
  visible.value = false;
}
</script>

<template>
  <v-btn variant="outlined" id="campaign-import" @click="openModal">{{
    t("label.import-campaign")
  }}</v-btn>
  <v-dialog v-model="visible">
    <v-card>
      <v-card-title class="text-center">
        {{ t("label.import-campaign") }}
      </v-card-title>
      <v-card-text>
        <div class="py-4">{{ t("text.input-token") }}</div>
        <v-textarea id="campaign-token" v-model="token"></v-textarea>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions class="d-flex flex-row justify-space-around">
        <v-btn outlined id="import-button" @click="importCampaign">{{
          t("label.import")
        }}</v-btn>
        <v-btn outlined id="import-button" @click="closeModal">{{
          t("label.cancel")
        }}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style scoped></style>
