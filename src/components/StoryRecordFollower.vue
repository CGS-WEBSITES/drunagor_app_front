<template>
  <div data-testid="story-record-follower">
    <EffectPicker v-model="followerIds" title="Followers" :items="followers" placeholder="Add or remove follower" />
  </div>
</template>

<script setup lang="ts">
import EffectPicker from "@/components/EffectPicker.vue";
import { ref, watch } from "vue";
import type { FollowerRepository } from "@/data/repository/campaign/FollowerRepository";
import { CampaignStore } from "@/store/CampaignStore";

const props = defineProps<{
  campaignId: string;
  repository: FollowerRepository;
}>();

const campaignStore = CampaignStore();

const followers = props.repository.findAll();

const followerIds = ref([] as string[]);
followerIds.value = campaignStore.find(props.campaignId).followerIds ?? [];

watch(followerIds, (newFollowerIds) => {
  campaignStore.find(props.campaignId).followerIds = newFollowerIds;
});
</script>

<style scoped></style>
