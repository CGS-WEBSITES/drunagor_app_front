<script setup lang="ts">
import { ref, watch } from "vue";
import type { AuraRepository } from "@/data/repository/campaign/AuraRepository";
import { HeroStore } from "@/store/HeroStore";
import { useI18n } from "vue-i18n";
import { ConfigurationStore } from "@/store/ConfigurationStore";
import Dropdown from "primevue/dropdown";

const props = defineProps<{
  heroId: string;
  campaignId: string;
  repository: AuraRepository;
}>();

const heroStore = HeroStore();
const configurationStore = ConfigurationStore();
const { t } = useI18n();
props.repository.load(configurationStore.enabledLanguage);
const auras = props.repository.findAll();

const auraId = ref("");
auraId.value =
  heroStore.findInCampaign(props.heroId, props.campaignId).auraId ?? "";

watch(auraId, (newAuraId) => {
  heroStore.findInCampaign(props.heroId, props.campaignId).auraId = newAuraId;
});
</script>

<template>
  <span :data-testid="'campaign-log-aura-' + heroId">
    <v-autocomplete
      clearable
      v-model="auraId"
      :items="auras"
      item-title="name"
      item-value="id"
      :label="$t('text.select-aura')"
      :hint="t('text.aura-info') "
      variant="outlined"
      ></v-autocomplete>      

    <v-sheet
      v-if="auraId"
      rounded
      border="md"
      class="mb-6 pa-6 text-white"
      style="background-color: #1f2937 !important"
    >
      <p>{{ props.repository.find(auraId)?.effect }}</p>
    </v-sheet>
  </span>
</template>

<style scoped></style>
