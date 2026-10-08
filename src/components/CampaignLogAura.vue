<template>
  <div :data-testid="'campaign-log-aura-' + heroId">
    <EffectPicker
      :model-value="auraId ? [auraId] : []"
      title="Aura"
      :items="auras"
      :multiple="false"
      placeholder="Select an aura"
      :hint="t('text.aura-info')"
      @update:model-value="auraId = $event[0] ?? ''"
    />
  </div>
</template>

<script setup lang="ts">
import EffectPicker from "@/components/EffectPicker.vue";
import { ref, watch } from "vue";
import type { AuraRepository } from "@/data/repository/campaign/AuraRepository";
import { HeroStore } from "@/store/HeroStore";
import { useI18n } from "vue-i18n";
import { ConfigurationStore } from "@/store/ConfigurationStore";

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

<style scoped></style>
