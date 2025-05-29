<script setup lang="ts">
import { ref, computed } from "vue";
import { useToast } from "primevue/usetoast";
import { useI18n } from "vue-i18n";
import * as _ from "lodash-es";
import { HeroStore } from "@/store/HeroStore";
import { CampaignStore } from "@/store/CampaignStore";
import type { Hero } from "@/store/Hero";
import type { Campaign } from "@/store/Campaign";
import { EnabledHeroes } from "@/repository/EnabledHeroes";
import type { HeroData } from "@/data/repository/HeroData";


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
  return campaignStore.findAll().filter(campaign => campaign.campaignId !== props.campaignId);
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
  <v-btn variant="elevated" id="campaign-import-hero-from-campaign" rounded @click="openModal">
    <v-icon start>mdi-import</v-icon>
    {{ t("IMPORT HERO") }}
  </v-btn>

  <v-dialog v-model="visible" max-width="500" persistent>
    <v-card>
      <v-card-title class="text-center">
        <span v-if="!selectedSourceCampaignId">{{ t("Select Source Campaign") }}</span>
        <span v-else>{{ t("Select Hero to Import") }}</span>
      </v-card-title>

      <v-card-text>
        <div v-if="!selectedSourceCampaignId">
          <v-list lines="one" v-if="availableSourceCampaigns.length > 0">
            <v-list-item
              v-for="campaign in availableSourceCampaigns"
              :key="campaign.campaignId"
              :title="campaign.name"
              @click="selectSourceCampaign(campaign.campaignId)"
            >
              <template v-slot:prepend>
                <v-icon>mdi-folder-open-outline</v-icon>
              </template>
            </v-list-item>
          </v-list>
          <p v-else class="text-center">{{ t("No other campaigns available to import from.") }}</p>
        </div>

        <div v-else>
          <v-btn variant="text" @click="goBackToCampaignSelection" class="mb-2">
            <v-icon start>mdi-arrow-left</v-icon>
            {{ t("Back to Campaigns") }}
          </v-btn>
          
          <template v-if="heroesInSelectedSourceCampaign.length > 0">
            <v-list lines="one"> <v-list-item
                v-for="heroInstance in heroesInSelectedSourceCampaign"
                :key="heroInstance.heroId"
                @click="importHeroToCurrentCampaign(heroInstance)"
                class="pa-0" >
                <v-img
                  v-if="getStaticHeroData(heroInstance.heroId)?.images?.trackerimage"
                  :src="getStaticHeroData(heroInstance.heroId)?.images.trackerimage"
                  :alt="getStaticHeroData(heroInstance.heroId)?.name || heroInstance.heroId"
                  style="display: block; width: 100%; border-radius: 4px;" 
                  height="auto" ></v-img>
                <v-sheet
                  v-else
                  color="grey-darken-3"
                  width="100%"
                  height="80px" class="d-flex align-center justify-center"
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
        <v-btn color="grey-darken-1" variant="text" @click="closeModal">
          {{ t("Close") }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style scoped>
.hero-image-list.v-list { 
  padding: 0 !important;
  background-color: transparent !important;
}

.hero-image-list .v-list-item,
.v-dialog .v-list-item { 
  margin-bottom: 8px; 
}

.hero-image-list .v-list-item:last-child,
.v-dialog .v-list-item:last-child {
  margin-bottom: 0;
}
</style>