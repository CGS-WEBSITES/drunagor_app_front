<template>
  <v-row class="ml-0 justify-center">
    <v-col cols="12" md="12" lg="12" xl="8">
      <v-card class="mb-2 pa-1" color="primary" style="width: 100%">
        <v-card-actions class="d-flex justify-space-between">
          <v-row no-gutters>
            <v-card style="width: 100%">
              <v-card-actions
                class="d-flex flex-wrap justify-space-around pa-2"
              >
                <CampaignRemove :campaign-id="campaignId" class="mx-1 my-1" />
                <CampaignExport :campaign-id="campaignId" class="mx-1 my-1" />
                <SequentialAdventureButton
                  :campaign-id="campaignId"
                  @sequential-adventure="onSequentialAdventure"
                  :disabled="isSequentialAdventure"
                  class="mx-1 my-1"
                />
                <CampaignCampPhase
                  :campaign-id="campaignId"
                  @camp-phase="onCampPhase"
                  class="mx-1 my-1"
                  :disabled="!isSequentialAdventure"
                />
                <CampaignSavePut
                  :campaign-id="campaignId"
                  class="mx-1 my-1"
                  @success="
                    setAlert(
                      'mdi-check',
                      'Success',
                      'The campaign was saved successfully!',
                      'success',
                    )
                  "
                  @fail="
                    setAlert(
                      'mdi-alert-circle',
                      'Error',
                      'The campaign could not be saved.',
                      'error',
                    )
                  "
                />
              </v-card-actions>
            </v-card>
          </v-row>
        </v-card-actions>
        <v-card-text v-if="showAlert" class="pa-0">
          <v-alert
            closable
            v-model="showAlert"
            :icon="alertIcon"
            :title="alertTitle"
            :text="alertText"
            :type="alertType"
            density="compact"
            class="ma-2"
          ></v-alert>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>

  <v-row class="ml-0 justify-center mb-4">
    <v-col cols="12" md="12" lg="12" xl="8">
      <v-btn block color="secondary" class="ma-0 pa-2" @click="openModal">
        <v-icon left class="mr-2">mdi-share-variant</v-icon>
        Share Campaign
      </v-btn>
    </v-col>
  </v-row>

  <v-dialog v-model="visible" max-width="500">
    <v-card>
      <v-card-title>Share Campaign</v-card-title>
      <v-card-text>
        <p class="py-2">Copy this token to share your campaign:</p>
        <v-textarea readonly auto-grow v-model="token" class="ma-0" />
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn @click="closeModal">Cancel</v-btn>
        <v-btn @click="copyToClipboard">Copy to clipboard</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <template v-if="campaign">
    <template v-if="campaign.campaign === 'underkeep'">
      <v-row class="ml-0 justify-center">
        <v-col cols="12" md="12" lg="12" xl="8">
          <v-tabs
            v-model="currentTab"
            centered
            grow
            bg-color="surface"
            density="compact"
            class="mb-2"
            style="border-radius: 4px"
            active-class="custom-active-tab"
            slider-color="white"
          >
            <v-tab value="normal" prepend-icon="mdi-clipboard-text-outline">
              Campaign Log
            </v-tab>
            <v-tab value="book" prepend-icon="mdi-book-open-variant">
              Campaign Book
            </v-tab>
          </v-tabs>
          <v-window v-model="currentTab">
            <v-window-item value="normal" class="pa-3">
              <CampaignName :campaign-id="campaignId" class="mb-4" />

              <v-row no-gutters class="d-flex justify-center mb-4">
                <v-col cols="12">
                  <SelectDoor :campaign-id="campaignId" />
                </v-col>
              </v-row>

              <v-row
                v-if="isSequentialAdventure"
                no-gutters
                class="d-flex justify-center mb-4"
              >
                <v-col cols="12">
                  <CampaignRunes :campaign-id="campaignId" />
                </v-col>
              </v-row>

              <v-row no-gutters class="justify-center pa-6">
                <v-col cols="12" sm="12" md="6" lg="4">
                  <div
                    class="d-flex align-center justify-center flex-wrap flex-sm-nowrap"
                    style="gap: 12px"
                  >
                    <CampaignLogAddHero :campaign-id="campaignId" />
                    <CampaignLogImportHero :campaign-id="campaignId" />
                    <CampaignLogRemoveHero :campaign-id="campaignId" />
                  </div>
                </v-col>
              </v-row>

              <v-row no-gutters class="d-flex justify-center">
                <v-sheet
                  rounded
                  border="md"
                  class="text-white pa-2"
                  width="100%"
                >
                  <div
                    v-if="heroStore.findAllInCampaign(campaignId).length === 0"
                    class="text-center pa-4"
                  >
                    No heroes added to this campaign yet.
                  </div>
                  <v-col
                    cols="12"
                    v-for="hero in heroStore.findAllInCampaign(campaignId)"
                    :key="hero.heroId"
                    class="pa-1"
                  >
                    <CampaignLog
                      :campaign-id="campaignId"
                      :hero-id="hero.heroId"
                      :is-sequential-adventure="isSequentialAdventure"
                    />
                  </v-col>
                </v-sheet>
              </v-row>
            </v-window-item>

            <v-window-item value="book" class="pa-0">
              <CampaignBook :campaign-id="campaignId" />
            </v-window-item>
          </v-window>
        </v-col>
      </v-row>
    </template>

    <template v-else>
      <v-row class="ml-0 justify-center">
        <v-col cols="12" md="12" lg="12" xl="8" class="pa-3">
          <CampaignName :campaign-id="campaignId" class="mb-4" />

          <v-row
            v-if="isSequentialAdventure"
            no-gutters
            class="d-flex justify-center mb-4"
          >
            <v-col cols="12">
              <CampaignRunes :campaign-id="campaignId" />
            </v-col>
          </v-row>

          <v-row
            no-gutters
            class="d-flex justify-center mb-4"
            v-if="
              campaign.campaign === 'awakenings' ||
              campaign.campaign === 'apocalypse'
            "
          >
            <v-col cols="12">
              <StoryRecord :campaign-id="campaignId" />
            </v-col>
          </v-row>

          <v-row
            no-gutters
            class="d-flex justify-center mb-4"
            v-if="campaign.campaign === 'apocalypse'"
          >
            <v-col cols="12">
              <v-sheet rounded border="md" class="pa-4 text-white">
                <p class="text-center">
                  Apocalypse campaign specific content (e.g., Legacy Trail,
                  Background & Trait) would appear here.
                </p>
              </v-sheet>
            </v-col>
          </v-row>

          <v-row no-gutters class="justify-center pa-2 mb-4">
            <v-col
              cols="12"
              sm="12"
              md="8"
              lg="6"
              class="d-flex flex-row justify-space-around"
            >
              <CampaignLogAddHero :campaign-id="campaignId" />
              <CampaignLogRemoveHero :campaign-id="campaignId" />
            </v-col>
          </v-row>

          <v-row no-gutters class="d-flex justify-center">
            <v-sheet rounded border="md" class="text-white pa-2" width="100%">
              <div
                v-if="heroStore.findAllInCampaign(campaignId).length === 0"
                class="text-center pa-4"
              >
                No heroes added to this campaign yet.
              </div>
              <v-col
                cols="12"
                v-for="hero in heroStore.findAllInCampaign(campaignId)"
                :key="hero.heroId"
                class="pa-1"
              >
                <CampaignLog
                  :campaign-id="campaignId"
                  :hero-id="hero.heroId"
                  :is-sequential-adventure="isSequentialAdventure"
                />
              </v-col>
            </v-sheet>
          </v-row>
        </v-col>
      </v-row>
    </template>
  </template>

  <template v-else-if="!campaign && !showAlert">
    <v-row class="justify-center">
      <v-col cols="12" md="8" class="text-center pa-5">
        <p>Loading campaign data...</p>
        <v-progress-circular
          indeterminate
          color="primary"
          class="mt-4"
        ></v-progress-circular>
      </v-col>
    </v-row>
  </template>
</template>

<script setup lang="ts">
import CampaignLogAddHero from "@/components/CampaignLogAddHero.vue";
import CampaignLogRemoveHero from "@/components/CampaignLogRemoveHero.vue";
import CampaignLog from "@/components/CampaignLog.vue";
import { useRoute } from "vue-router";
import { HeroStore } from "@/store/HeroStore";
import CampaignRemove from "@/components/CampaignRemove.vue";
import CampaignExport from "@/components/CampaignExport.vue";
import CampaignSavePut from "@/components/CampaignSavePut.vue";
import StoryRecord from "@/components/StoryRecord.vue";
import CampaignName from "@/components/CampaignName.vue";
import { CampaignStore } from "@/store/CampaignStore";
import { type Campaign } from "@/store/Campaign";
import CampaignCampPhase from "@/components/CampaignCampPhase.vue";
import { ref, onMounted, watch } from "vue";
import CampaignRunes from "@/components/CampaignRunes.vue";
import SequentialAdventureButton from "@/components/SequentialAdventureButton.vue";
import CampaignBook from "@/components/CampaignBook.vue";
import SelectDoor from "@/components/SelectDoor.vue";
import { useToast } from "primevue/usetoast";

const route = useRoute();
const campaignStore = CampaignStore();
const heroStore = HeroStore();
const toast = useToast();

const campaignId = (route.params as { id: string }).id.toString();

const isSequentialAdventure = ref(false);
const campaign = ref<Campaign | null>(null);
const alertIcon = ref("");
const alertText = ref("");
const alertTitle = ref("");
const alertType = ref<"success" | "info" | "warning" | "error" | undefined>(
  undefined,
);
const showAlert = ref(false);
const currentTab = ref("normal");
const visible = ref(false);
const token = ref("");

const setAlert = (
  icon: string,
  title: string,
  text: string,
  type: "success" | "info" | "warning" | "error" | undefined,
) => {
  alertIcon.value = icon;
  alertTitle.value = title;
  alertText.value = text;
  showAlert.value = true;
  alertType.value = type;

  setTimeout(() => {
    showAlert.value = false;
  }, 1500);
};

const onCampPhase = () => {
  isSequentialAdventure.value = false;
}

const onSequentialAdventure = () => {
  isSequentialAdventure.value = true;
}

const openModal = () => {
  const prefix = Math.floor(1000 + Math.random() * 9000).toString();
  token.value = `${prefix}${campaignId}`;
  visible.value = true;
}

const copyToClipboard = () => {
  navigator.clipboard
    .writeText(token.value)
    .then(() => {
      toast.add({
        severity: "success",
        summary: "Success",
        detail: "Token copied to clipboard",
        life: 3000,
      });
      closeModal();
    })
    .catch(() => {
      toast.add({
        severity: "error",
        summary: "Error",
        detail: "Failed to copy token",
        life: 3000,
      });
    });
}

const closeModal = () => {
  visible.value = false;
}

onMounted(() => {
  const foundCampaign = campaignStore.find(campaignId);
  if (foundCampaign) {
    campaign.value = foundCampaign;
    isSequentialAdventure.value = foundCampaign.isSequentialAdventure ?? false;
  } else {
    console.error(`Campaign with ID ${campaignId} not found.`);
    setAlert(
      "mdi-alert-circle",
      "Error",
      `Campaign with ID ${campaignId} not found.`,
      "error",
    );
  }
});

watch(
  campaign,
  (newCampaign) => {
    if (newCampaign) {
      isSequentialAdventure.value = newCampaign.isSequentialAdventure ?? false;
      if (newCampaign.campaign !== "underkeep") {
        currentTab.value = "normal";
      }
    }
  },
  { deep: true },
);
</script>

<style scoped>
.v-textarea textarea[readonly] {
  background-color: #f5f5f5;
}

.mx-1 {
  margin-left: 4px !important;
  margin-right: 4px !important;
}

.my-1 {
  margin-top: 4px !important;
  margin-bottom: 4px !important;
}

/* ESTILO PARA A ABA ATIVA PERSONALIZADA */
.v-tabs .custom-active-tab {
  background-color: rgb(var(--v-theme-secondary)) !important;
  /* Usa a cor 'secondary' do seu tema Vuetify */
  color: white !important;
  /* Garante que o texto seja branco ou outra cor de alto contraste */
  /* Você pode adicionar outros estilos aqui, como: */
  /* font-weight: bold; */
}

/* Opcional: Ajustar a cor do texto das abas não selecionadas se necessário */
/* .v-tabs .v-tab:not(.custom-active-tab) { */
/* color: rgba(var(--v-theme-on-surface), var(--v-high-emphasis-opacity)); */
/* Exemplo para texto em tema claro */
/* color: rgba(var(--v-theme-on-surface), 0.6); */
/* Ajuste a opacidade ou cor conforme necessário */
/* } */
</style>
