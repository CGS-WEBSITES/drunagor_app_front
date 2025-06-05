<script setup lang="ts">
import { ref, computed } from "vue";
import { useToast } from "primevue/usetoast";
import { useI18n } from "vue-i18n";
import * as _ from "lodash-es";
// Stores
import { HeroStore } from "@/store/HeroStore";
import { CampaignStore } from "@/store/CampaignStore";
import type { Hero } from "@/store/Hero";
import type { Campaign } from "@/store/Campaign";
// Repositório de Heróis Habilitados
import { EnabledHeroes } from "@/repository/EnabledHeroes";
import type { HeroData } from "@/data/repository/HeroData";
// Importa a imagem local para a campanha 'underkeep'
// Certifique-se que este caminho para underkeep.png está correto
import UnderkeepCampaignImage from "@/assets/logo/underkeep.png";
const props = defineProps<{
  campaignId: string;
}>();
const toast = useToast();
const { t } = useI18n();
const visible = ref(false);
function openModal() {
  selectedSourceCampaignId.value = null;
  visible.value = true;
}
function closeModal() {
  visible.value = false;
}
const heroStore = HeroStore();
const campaignStore = CampaignStore();
const allEnabledHeroesList = new EnabledHeroes().findAll();
function getStaticHeroData(heroId: string): HeroData | undefined {
  return allEnabledHeroesList.find(h => h.id === heroId);
}
const selectedSourceCampaignId = ref<string | null>(null);
const availableSourceCampaigns = computed(() => {
  const allCampaigns = campaignStore.findAll();
  const filteredCampaigns = allCampaigns.filter(campaign => campaign.campaignId !== props.campaignId);
  return filteredCampaigns;
});
function selectSourceCampaign(campaignId: string) {
  selectedSourceCampaignId.value = campaignId;
}
const heroesInSelectedSourceCampaign = computed(() => {
  if (!selectedSourceCampaignId.value) {
    return [];
  }
  const sourceHeroes = heroStore.findAllInCampaign(selectedSourceCampaignId.value);
  return sourceHeroes.filter(hero => !heroStore.hasInCampaign(hero.heroId, props.campaignId));
});
function importHeroToCurrentCampaign(heroToImport: Hero) {
  if (!selectedSourceCampaignId.value) {
    toast.add({ severity: "warn", summary: t("Warning"), detail: t("No source campaign selected."), life: 3000 });
    return;
  }
  if (heroStore.hasInCampaign(heroToImport.heroId, props.campaignId)) {
    toast.add({
      severity: "info",
      summary: t("Info"),
      detail: t("Hero is already in this campaign."),
      life: 3000,
    });
    return;
  }
  const importSuccessful = heroStore.importAndCloneHeroToCampaign(heroToImport, props.campaignId);
  if (importSuccessful) {
    toast.add({
      severity: "success",
      summary: t("Success"),
      detail: t("Hero and all its data imported successfully!"),
      life: 3000,
    });
  } else {
    toast.add({
      severity: "warn",
      summary: t("Import Failed"),
      detail: t("Hero could not be imported. They might already be in the target campaign."),
      life: 3000,
    });
  }
}
function goBackToCampaignSelection() {
  selectedSourceCampaignId.value = null;
}
</script>

<template>
  <div class="d-flex align-center" style="gap: 8px;">
    <v-btn variant="elevated" id="campaign-import-hero-from-campaign" rounded @click="openModal">
      <v-icon start>mdi-import</v-icon>
      {{ t("IMPORT HERO") }}
    </v-btn>
  </div>

  <v-dialog v-model="visible" max-width="500">
    <v-card>
      <v-card-title class="text-center">
        <span v-if="!selectedSourceCampaignId">{{ t("Select Source Campaign") }}</span>
        <span v-else>{{ t("Select Hero to Import") }}</span>
        <v-tooltip location="top">
      <template  v-slot:activator="{ props: tooltipActivatorProps }">
        <v-icon class="pl-3" v-bind="tooltipActivatorProps" size="small" color="grey-darken-1" style="cursor: help;">mdi-information-outline</v-icon>
      </template>
      <span>Importing heroes from different content may cause errors.</span>
    </v-tooltip>
      </v-card-title>

      <v-card-text>
        <div v-if="!selectedSourceCampaignId">

          <template v-if="availableSourceCampaigns.length > 0">
            <v-list lines="one">
              <v-list-item
                v-for="campaign_item in availableSourceCampaigns" :key="campaign_item.campaignId"
                @click="selectSourceCampaign(campaign_item.campaignId)"
              >
                <template v-slot:prepend>
                  <div class="d-flex align-center" style="min-width: 60px; height: 36px;"> <v-img v-if="campaign_item.campaign === 'core'"
                          class="campaign-list-logo"
                          src="@/assets/logo/core.webp"
                          :alt="campaign_item.name + ' - Core'"
                          max-height="36" max-width="60" contain />
                    <v-img v-else-if="campaign_item.campaign === 'apocalypse'"
                          class="campaign-list-logo"
                          src="@/assets/logo/apocalypse.webp"
                          :alt="campaign_item.name + ' - Apocalypse'"
                          max-height="36" max-width="60" contain />
                    <v-img v-else-if="campaign_item.campaign === 'awakenings'"
                          class="campaign-list-logo"
                          src="@/assets/logo/awakenings.webp"
                          :alt="campaign_item.name + ' - Awakenings'"
                          max-height="36" max-width="60" contain />
                    <v-img v-else-if="campaign_item.campaign === 'underkeep'"
                          class="campaign-list-logo"
                          :src="UnderkeepCampaignImage"
                          :alt="campaign_item.name + ' - Underkeep'"
                          max-height="36" max-width="60" contain />
                    <v-icon v-else class="mx-auto">mdi-help-rhombus-outline</v-icon> </div>
                </template>

                <v-list-item-title class="pl-2">
                  {{ campaign_item.name }} 
                </v-list-item-title>

              </v-list-item>
            </v-list>
          </template>
          <p v-else class="text-center">{{ t("No other campaigns available to import from.") }}</p>
        </div>

        <div v-else>
          <v-btn variant="text" @click="goBackToCampaignSelection" class="mb-2">
            <v-icon start>mdi-arrow-left</v-icon>
            {{ t("Back to Campaigns") }}
          </v-btn>

          <template v-if="heroesInSelectedSourceCampaign.length > 0">
            <v-list lines="one"> 
              <v-list-item
                v-for="heroInstance in heroesInSelectedSourceCampaign"
                :key="heroInstance.heroId"
                @click="importHeroToCurrentCampaign(heroInstance)"
                class="pa-0" 
              >
                <v-img
                  v-if="getStaticHeroData(heroInstance.heroId)?.images?.trackerimage"
                  :src="getStaticHeroData(heroInstance.heroId)?.images.trackerimage"
                  :alt="getStaticHeroData(heroInstance.heroId)?.name || heroInstance.heroId"
                  style="display: block; width: 100%; border-radius: 4px;" 
                  height="auto" 
                  max-height="82px"
                ></v-img>
                <v-sheet
                  v-else
                  color="grey-darken-3"
                  width="100%"
                  height="80px" 
                  class="d-flex align-center justify-center"
                  style="border-radius: 4px;"
                >
                  <div class="text-center">
                    <v-icon size="large" color="grey-lighten-1">mdi-image-off-outline</v-icon>
                    <div class="text-caption text-grey-lighten-1">{{ heroInstance.heroId }}</div>
                  </div>
                </v-sheet>
              </v-list-item>
            </v-list>
          </template>
          <template v-else>
            <p class="text-center mt-4">{{ t("No new heroes to import from this campaign.") }}</p>
          </template>

        </div>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="red" variant="text" @click="closeModal">
          {{ t("Close") }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style scoped>
.v-dialog .v-list {
  padding-left: 0 !important;
  padding-right: 0 !important;
  padding-top: 4px !important;
  padding-bottom: 4px !important;
  background-color: transparent !important;
}
.v-dialog .v-list-item { 
  margin-bottom: 8px; 
}
.v-dialog .v-list-item:last-child {
  margin-bottom: 0;
}
.v-list-item--one-line .v-list-item-title {
  align-self: center;
}
.campaign-list-logo {
  border-radius: 3px;
}
</style>