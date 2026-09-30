<template>
  <!-- Aura, status and outcome pickers with the Core campaign data, without a campaign. -->
  <v-container max-width="420" class="py-6">
    <div class="dev-effects">
      <EffectPicker v-model="auraIds" title="Aura" :items="auras" :multiple="false" placeholder="Select an aura" hint="Aura is removed when you receive a trauma cube or another aura" />
      <EffectPicker v-model="statusIds" title="Status" :items="statuses" placeholder="Add or remove status" hint="Statuses are removed during the camp phase" />
      <EffectPicker v-model="outcomeIds" title="Outcome" :items="outcomes" placeholder="Add or remove outcome" hint="Remain in effect for the entire campaign unless some other effect changes them" />
    </div>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from "vue";
import EffectPicker from "@/components/EffectPicker.vue";
import { ConfigurationStore } from "@/store/ConfigurationStore";
import { CampaignLogAuraRepository } from "@/data/repository/campaign/core/CampaignLogAuraRepository";
import { CampaignLogStatusRepository } from "@/data/repository/campaign/core/CampaignLogStatusRepository";
import { CampaignLogOutcomeRepository } from "@/data/repository/campaign/core/CampaignLogOutcomeRepository";

const language = ConfigurationStore().enabledLanguage;
const auraRepository = new CampaignLogAuraRepository();
const statusRepository = new CampaignLogStatusRepository();
const outcomeRepository = new CampaignLogOutcomeRepository();
auraRepository.load(language);
statusRepository.load(language);
outcomeRepository.load(language);

const auras = auraRepository.findAll();
const statuses = statusRepository.findAll();
const outcomes = outcomeRepository.findAll();

const auraIds = ref<string[]>(auras[0] ? [auras[0].id] : []);
const statusIds = ref<string[]>(statuses.slice(0, 3).map((status) => status.id));
const outcomeIds = ref<string[]>(outcomes.slice(0, 3).map((outcome) => outcome.id));
</script>

<style scoped>
.dev-effects {
  padding: 16px;
  background: rgb(var(--v-theme-primary));
  border-radius: 12px;
}
</style>
