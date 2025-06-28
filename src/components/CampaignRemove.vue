<template>
  <v-btn variant="elevated" id="campaign-remove" class="px-6 my-2" rounded @click="openModal">
    <v-icon start>mdi-delete</v-icon>
    {{ t("label.remove-campaign") }}
  </v-btn>

  <v-dialog v-model="visible" max-width="500px" persistent>
    <v-card>
      <v-card-title class="text-center">{{ t("label.remove-campaign") }}</v-card-title>

      <v-card-text>
        <v-alert
          v-model="alertVisible"
          :type="alertType"
          closable
        >
          {{ alertMessage }}
        </v-alert>

        <p v-if="!alertVisible" class="text-center mt-2">
          {{ t("text.cannot-be-restored") }}
        </p>
      </v-card-text>
      
      <v-divider></v-divider>

      <v-card-actions v-if="!alertVisible">
        <v-row no-gutters>
          <v-col cols="6">
            <v-btn 
              variant="text" 
              @click="removeCampaign" 
              width="100%"
              :loading="isLoading"
              :disabled="isLoading"
            >
              {{ t("label.yes") }}
            </v-btn>
          </v-col>
          <v-col cols="6">
            <v-btn
              variant="text"
              @click="closeModal"
              width="100%"
              color="red-accent-2"
              :disabled="isLoading"
            >
              {{ t("label.no") }}
            </v-btn>
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
import axios from "axios";

const campaignStore = CampaignStore();
const heroStore = HeroStore();
const router = useRouter();
const { t } = useI18n();

const visible = ref(false);
const isLoading = ref(false);
const alertVisible = ref(false);
const alertMessage = ref('');
const alertType = ref<'success' | 'error'>('success');

const props = defineProps<{
  campaignId: string;
}>();

const openModal = () => {
  alertVisible.value = false;
  visible.value = true;
};

const closeModal = () => {
  visible.value = false;
};

const removeCampaign = () => {
  isLoading.value = true;
  const campaigns_pk = props.campaignId;

  axios
    .delete(`/campaigns/${campaigns_pk}/delete/`)
    .then(() => {
      alertMessage.value = "Your campaign was deleted successfully";
      alertType.value = 'success';
      alertVisible.value = true;

      campaignStore.remove(campaigns_pk);
      heroStore
        .findAllInCampaign(campaigns_pk)
        .forEach((hero) => {
          heroStore.removeFromCampaign(hero.heroId, campaigns_pk);
        });

      setTimeout(() => {
        closeModal();
        router.push("/campaign-tracker/");
      }, 2000);
    })
    .catch((error: any) => {
      let detailMessage = t("text.error-removing-campaign");
      if (error.response && error.response.data) {
        detailMessage = error.response.data.message || error.response.data.detail || JSON.stringify(error.response.data);
      } else {
        detailMessage = error.message;
      }
      
      alertMessage.value = detailMessage;
      alertType.value = 'error';
      alertVisible.value = true;

      setTimeout(() => {
        closeModal();
        router.push("/campaign-tracker/");
      }, 2000);
    })
    .finally(() => {
      isLoading.value = false;
    });
};
</script>

<style scoped></style>