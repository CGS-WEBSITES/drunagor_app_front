<script setup lang="ts">
import { ref, computed } from "vue";
import { useToast } from "primevue/usetoast";
import { useI18n } from "vue-i18n";
import * as _ from "lodash-es";

import { HeroStore } from "@/store/HeroStore";
import { CampaignStore } from "@/store/CampaignStore";
import type { Hero } from "@/store/Hero";
import type { Campaign } from "@/store/Campaign";

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
          <v-list lines="one" v-if="heroesInSelectedSourceCampaign.length > 0">
            <v-list-item
              v-for="hero in heroesInSelectedSourceCampaign"
              :key="hero.heroId"
              @click="importHeroToCurrentCampaign(hero)"
            >
              <v-list-item-title>
                {{ hero.heroId }} </v-list-item-title>
              <template v-slot:prepend>
                <v-icon>mdi-account</v-icon> </template>
            </v-list-item>
          </v-list>
          <p v-else class="text-center">{{ t("No new heroes to import from this campaign.") }}</p>
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

</style>