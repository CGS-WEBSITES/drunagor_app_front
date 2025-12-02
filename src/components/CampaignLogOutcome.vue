<template>
  <span :data-testid="'campaign-log-outcome-' + heroId">
    <template v-if="isAdmin && !loading">
      <v-select
        v-model="outcomeIds"
        clearable
        chips
        :label="dynamicLabel"
        :hint="dynamicHint"
        :items="outcomes"
        item-title="name"
        item-value="id"
        multiple
        variant="outlined"
      ></v-select>
    </template>

    <template v-else-if="!loading">
      <v-text-field
        :model-value="outcomeDisplayText"
        :label="dynamicLabel"
        variant="outlined"
        readonly
        persistent-hint
        class="mb-4"
        :disabled="!isAdmin"
      ></v-text-field>
    </template>

    <template v-else>
      <v-text-field
        :label="dynamicLabel"
        variant="outlined"
        loading
        readonly
        :disabled="!isAdmin"
      ></v-text-field>
    </template>
  </span>
</template>

<script setup lang="ts">
import { ref, watch, computed, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import { CampaignStore } from "@/store/CampaignStore";
import { useUserStore } from "@/store/UserStore";
import type { Outcome } from "@/data/repository/campaign/Outcome";
import { HeroStore } from "@/store/HeroStore";
import type { OutcomeRepository } from "@/data/repository/campaign/OutcomeRepository";
import { ConfigurationStore } from "@/store/ConfigurationStore";
import axios from "axios";

const props = defineProps<{
  heroId: string;
  campaignId: string;
  repository: OutcomeRepository;
}>();

const { t } = useI18n();
const heroStore = HeroStore();
const userStore = useUserStore();
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

const outcomeDisplayText = computed(() => {
  if (outcomeIds.value.length === 0) {
    return t("text.no-outcomes", "No outcomes selected");
  }

  const activeOutcomes = findOutcomes(outcomeIds.value);
  return activeOutcomes.map((outcome) => outcome.name).join(", ");
});

const checkUserRole = async () => {
  try {
    const response = await axios.get("rl_campaigns_users/search", {
      params: {
        users_fk: userStore.user?.users_pk,
        campaigns_fk: props.campaignId,
      },
    });
    isAdmin.value = response.data.campaigns[0]?.party_role === "Admin";
  } catch (error) {
    console.error("CampaignLogOutcome - Error fetching user role:", error);
    isAdmin.value = false;
  } finally {
    loading.value = false;
  }
};

function findOutcomes(outcomeIdsList: string[]): Outcome[] {
  const outcomesFound: Outcome[] = [];
  outcomeIdsList.forEach((outcomeId) => {
    const outcome = props.repository.find(outcomeId);
    if (outcome) {
      outcomesFound.push(outcome);
    }
  });
  return outcomesFound;
}

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
