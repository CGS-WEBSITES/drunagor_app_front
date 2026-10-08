<template>
  <div data-testid="story-record-unfolding">
    <EffectPicker v-model="unfoldingIds" title="Unfolding" :items="unfoldings" placeholder="Add or remove unfolding" />
  </div>
</template>

<script setup lang="ts">
import EffectPicker from "@/components/EffectPicker.vue";
import { ref, watch } from "vue";
import { StoryRecordUnfoldingRepository } from "@/data/repository/campaign/apocalypse/StoryRecordUnfoldingRepository";
import { CampaignStore } from "@/store/CampaignStore";
import type { Unfolding } from "@/data/repository/campaign/apocalypse/Unfolding";

const props = defineProps<{
  campaignId: string;
}>();

const campaignStore = CampaignStore();
const repository = new StoryRecordUnfoldingRepository();
const unfoldings = repository.findAll();

const unfoldingIds = ref([] as string[]);
unfoldingIds.value = campaignStore.find(props.campaignId).unfoldingIds ?? [];

function findUnfoldings(followerIds: string[]): Unfolding[] {
  const outcomes: Unfolding[] = [];
  followerIds.forEach((followerId) => {
    let outcome = repository.find(followerId);
    if (outcome) {
      outcomes.push(outcome);
    }
  });

  return outcomes;
}

watch(unfoldingIds, (newUnfoldingIds) => {
  campaignStore.find(props.campaignId).unfoldingIds = newUnfoldingIds;
  console.log("findUnfoldings", findUnfoldings(newUnfoldingIds));
});
</script>

<style scoped></style>
