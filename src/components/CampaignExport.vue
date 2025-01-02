<script setup lang="ts">
import { ref } from "vue";
import { useToast } from "primevue/usetoast";
import { CampaignStore } from "@/store/CampaignStore";
import { HeroStore } from "@/store/HeroStore";
import { useI18n } from "vue-i18n";

const toast = useToast();

const props = defineProps<{
  campaignId: string;
}>();

const visible = ref(false);
const campaignStore = CampaignStore();
const heroStore = HeroStore();
const token = ref("");
const { t } = useI18n();

function openModal() {
  const campaignCopy = JSON.parse(
    JSON.stringify(campaignStore.find(props.campaignId)),
  );
  campaignCopy.campaignId = "";

  const heroes = heroStore.findAllInCampaign(props.campaignId);

  const data = {
    campaignData: campaignCopy,
    heroes: heroes.map((h) => {
      const clone = JSON.parse(JSON.stringify(h));
      clone.campaignId = "";
      return clone;
    }),
  };
  token.value = btoa(JSON.stringify(data));

  visible.value = true;
}

function copyToClipboard() {
  navigator.clipboard.writeText(token.value);
  toast.add({
    severity: "success",
    summary: t("label.success"),
    detail: "Token has been copied to clipboard.",
    life: 3000,
  });
  closeModal();
}

function closeModal() {
  visible.value = false;
}
</script>

<template>
  <v-btn variant="elevated" id="campaign-export" rounded  @click="openModal">
    {{ t("label.export-campaign") }}
  </v-btn>
  <v-dialog v-model="visible">
    <v-card>
      <v-card-title>{{ t("label.export-campaign") }}</v-card-title>
      <v-card-text>
        <div class="py-4">{{ t("text.copy-this-token") }}</div>
        <v-textarea id="campaign-token" v-model="token"></v-textarea>
      </v-card-text>
    </v-card>
    <v-card>
      <v-btn variant="elevated" @click="copyToClipboard">{{
        t("label.copy-to-clipboard")
      }}</v-btn>
      <v-btn variant="elevated" @click="closeModal">{{
        t("label.cancel")
      }}</v-btn>
    </v-card>
  </v-dialog>
</template>

<style scoped></style>
