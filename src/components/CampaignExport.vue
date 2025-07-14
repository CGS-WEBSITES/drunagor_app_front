<template>
  <v-btn
    variant="elevated"
    id="campaign-export"
    class="px-6 my-2"
    rounded
    @click="openModal"
  >
    <v-icon start>mdi-export</v-icon>
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
      <!-- <v-btn variant="elevated" @click="saveCampaign">{{
        t("save")
      }}</v-btn> -->
      <v-btn variant="elevated" @click="copyToClipboard">{{
        t("label.copy-to-clipboard")
      }}</v-btn>
      <v-btn variant="elevated" @click="closeModal">{{
        t("label.cancel")
      }}</v-btn>
    </v-card>
  </v-dialog>

  <v-dialog v-model="successDialogVisible">
    <v-card>
      <v-card-title>{{ t("label.success") }}</v-card-title>
      <v-card-text>
        {{ t("Campaign created successfully") }}
      </v-card-text>
      <v-btn variant="elevated" @click="successDialogVisible = false">
        {{ t("label.close") }}
      </v-btn>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useToast } from "primevue/usetoast";
import { CampaignStore } from "@/store/CampaignStore";
import { HeroStore } from "@/store/HeroStore";
import { useI18n } from "vue-i18n";
// import { useRoute } from "vue-router";
// import axios from "axios";

const toast = useToast();
// const route = useRoute();

const props = defineProps<{
  campaignId: string;
}>();

const visible = ref(false);
const campaignStore = CampaignStore();
const successDialogVisible = ref(false);
const heroStore = HeroStore();
const token = ref("");
const { t } = useI18n();

// const boxSku = computed(() => route.query.sku || "");

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

<style scoped></style>
