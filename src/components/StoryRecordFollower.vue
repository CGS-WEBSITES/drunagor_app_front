<script setup lang="ts">
import { ref, watch } from "vue";
import type { FollowerRepository } from "@/data/repository/campaign/FollowerRepository";
import { CampaignStore } from "@/store/CampaignStore";
import type { Follower } from "@/data/repository/campaign/Follower";

const props = defineProps<{
  campaignId: string;
  repository: FollowerRepository;
}>();

const campaignStore = CampaignStore();

const followers = props.repository.findAll();

const followerIds = ref([] as string[]);
followerIds.value = campaignStore.find(props.campaignId).followerIds ?? [];

function findFollowers(followerIds: string[]): Follower[] {
  const followers: Follower[] = [];
  followerIds.forEach((followerId) => {
    let follower = props.repository.find(followerId);
    if (follower) {
      followers.push(follower);
    }
  });

  return followers;
}

watch(followerIds, (newFollowerIds) => {
  campaignStore.find(props.campaignId).followerIds = newFollowerIds;
});
</script>

<template>
  <span data-testid="story-record-follower">
    <v-select
      v-model="followerIds"
      clearable
      chips
      :label="$t('text.add-or-remove-follower')"
      :items="findFollowers(followerIds)"
      multiple
      variant="outlined"
    ></v-select>

    <MultiSelect
      v-model="followerIds"
      :options="followers"
      :maxSelectedLabels="1"
      filter
      optionLabel="name"
      optionValue="id"
      class="w-full md:w-14rem"
    />
  </span>
</template>

<style scoped></style>
