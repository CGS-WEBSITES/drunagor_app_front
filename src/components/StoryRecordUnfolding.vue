<template>
  <span data-testid="story-record-unfolding">
    <v-select
      v-model="unfoldingIds"
      clearable
      chips
      label="Add or remove unfolding"
      :items="unfoldings"
      item-title="name"
      item-value="id"
      multiple
      variant="outlined"
    ></v-select>

    <v-sheet
      v-if="unfoldingIds.length > 0"
      rounded
      border="md"
      class="mb-6 pa-6 text-white"
    >
      <ul>
        <li
          class="py-1"
          v-for="unfolding in findUnfoldings(unfoldingIds)"
          :key="unfolding.id"
        >
          {{ unfolding.name }}
        </li>
      </ul>
    </v-sheet>
  </span>
</template>

<script setup lang="ts">
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
