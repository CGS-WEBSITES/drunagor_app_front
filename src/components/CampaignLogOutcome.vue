<template>
  <div :data-testid="'campaign-log-outcome-' + heroId">
    <EffectPicker
      v-model="outcomeIds"
      :title="campaign && campaign.campaign === 'underkeep' ? 'Dungeon role' : 'Outcome'"
      :items="outcomes"
      :editable="isAdmin && !loading"
      :loading="loading"
      :placeholder="dynamicLabel"
      :hint="dynamicHint"
      empty-text="No outcomes selected"
    />
  </div>
</template>

<script setup lang="ts">
import EffectPicker from "@/components/EffectPicker.vue";
import { ref, watch, computed, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import { CampaignStore } from "@/store/CampaignStore";
import { HeroStore } from "@/store/HeroStore";
import type { OutcomeRepository } from "@/data/repository/campaign/OutcomeRepository";
import { ConfigurationStore } from "@/store/ConfigurationStore";

const props = defineProps<{
  heroId: string;
  campaignId: string;
  repository: OutcomeRepository;
}>();

const { t } = useI18n();
const heroStore = HeroStore();
const configurationStore = ConfigurationStore();
const campaignStore = CampaignStore();

const campaign = campaignStore.find(props.campaignId);
const outcomeIds = ref<string[]>([]);
const isAdmin = ref(false);
const loading = ref(true);
const campaignHeroRef = ref<any>(null);

props.repository.load(configurationStore.enabledLanguage);
const outcomes = props.repository.findAll();

const dynamicLabel = computed(() => {
  if (campaign && campaign.campaign === "underkeep") {
    return t("Select Dungeon Role");
  }
  return t("text.add-or-remove-outcome");
});

const dynamicHint = computed(() => {
  if (campaign && campaign.campaign === "underkeep") {
    return t("select dungeon role");
  }
  return t("text.outcome-info");
});

const checkUserRole = async () => {
  isAdmin.value = true;
  loading.value = false;
};

watch(
  outcomeIds,
  (newOutcomeIds) => {
    if (isAdmin.value && campaignHeroRef.value) {
      campaignHeroRef.value.outcomeIds = [...newOutcomeIds];
    }
  },
  { deep: true },
);

onMounted(async () => {
  await checkUserRole();

  const hero = heroStore.findInCampaignOptional(props.heroId, props.campaignId);

  if (hero) {
    campaignHeroRef.value = hero;

    if (!hero.outcomeIds) {
      hero.outcomeIds = [];
    }

    outcomeIds.value = [...hero.outcomeIds];
  } else {
    console.warn(
      `[CampaignLogOutcome] Hero ${props.heroId} not found in campaign ${props.campaignId}`,
    );
  }
});
</script>

<style scoped></style>
