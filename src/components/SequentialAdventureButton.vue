<template>
  <v-btn
    variant="elevated"
    id="sequential-adventure-btn"
    rounded
    class="px-6 my-2"
    @click="startSequentialAdventure"
  >
    <v-icon start>mdi-map-marker-path</v-icon
    >{{ t("label.sequential-adventure") }}</v-btn
  >
</template>

<script setup lang="ts">
import { CampaignStore } from "@/store/CampaignStore";
import { HeroStore } from "@/store/HeroStore";
import { SequentialAdventureState } from "@/store/Hero";
import { useI18n } from "vue-i18n";

const campaignStore = CampaignStore();
const heroStore = HeroStore();
const { t } = useI18n();

const props = defineProps<{
  campaignId: string;
}>();

const emit = defineEmits(["sequentialAdventure"]);

function startSequentialAdventure() {
  const campaign = campaignStore.find(props.campaignId);
  campaign.isSequentialAdventure = true;
  campaign.sequentialAdventureRunes = 0;

  heroStore.findAllInCampaign(props.campaignId).forEach((hero) => {
    hero.sequentialAdventureState = new SequentialAdventureState();
  });
  emit("sequentialAdventure");
}
</script>

<style scoped></style>
