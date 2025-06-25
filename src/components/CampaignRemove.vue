<template>
  <v-btn variant="elevated" id="campaign-remove" class="px-6 my-2" rounded @click="openModal">
    <v-icon start>mdi-delete</v-icon>
    {{
    t("label.remove-campaign")
  }}</v-btn>
  <v-dialog v-model="visible">
    <v-card>
      <v-card-tile class="text-center">{{
        t("label.remove-campaign")
      }}</v-card-tile>
      <v-card-text>
        {{ t("text.cannot-be-restored") }}
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-row no-gutters>
          <v-col cols="12" class="d-flex flex-row justify-center">
            <v-btn variant="text" @click="removeCampaign" width="100%">{{
              t("label.yes")
            }}</v-btn>
          </v-col>
          <v-divider vertical></v-divider>
          <v-col cols="12" class="d-flex flex-row justify-center">
            <v-btn
              variant="text"
              @click="closeModal"
              width="100%"
              color="red-accent-2"
              >{{ t("label.no") }}</v-btn
            >
          </v-col>
        </v-row>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { CampaignStore } from "@/store/CampaignStore";
import { useRouter } from "vue-router";
import { HeroStore } from "@/store/HeroStore";
import { useI18n } from "vue-i18n";
import { useToast } from "primevue/usetoast";
import axios from "axios";

const toast = useToast();
const campaignStore = CampaignStore();
const heroStore = HeroStore();
const router = useRouter();
const { t } = useI18n();

const visible = ref(false);

const props = defineProps<{
  campaignId: string;
}>();

const openModal = () => {
  visible.value = true;
}

const closeModal = () => {
  visible.value = false;
}

const removeCampaign = () => {
  const campaigns_pk = props.campaignId;

  axios
    .delete(`/campaigns/${campaigns_pk}/delete/`)
    .then(() => {

      return axios.delete(`/rl_campaigns_users/${campaigns_pk}/delete/`);
    })
    .then((response: any) => {
      console.log("Campaign relation removed:", response.data);

      campaignStore.remove(campaigns_pk);
      heroStore
        .findAllInCampaign(campaigns_pk)
        .forEach((hero) => {
          heroStore.removeFromCampaign(hero.heroId, campaigns_pk);
        });

      toast.add({
        severity: "success",
        summary: t("label.success"),
        detail: t("text.campaign-removed"),
        life: 3000,
      });

      closeModal();
      router.push("/campaign-tracker/");
    })
    .catch((error: any) => {
      console.error("Error removing campaign:", error);
      toast.add({
        severity: "error",
        summary: t("label.error"),
        detail: error.message || t("text.error-removing-campaign"),
        life: 3000,
      });
    });
}
</script>

<style scoped></style>
