<template>
  <v-row no-gutters>
    <v-col cols="12">
      <StoryRecordFollower
        :repository="followerRepository"
        :campaign-id="props.campaignId"
      />
    </v-col>
  </v-row>

  <v-row no-gutters>
    <v-col cols="12">
      <StoryRecordStatus
        :repository="statusRepository"
        :campaign-id="props.campaignId"
      />
    </v-col>
  </v-row>

  <v-row no-gutters>
    <v-col cols="12">
      <StoryRecordOutcome
        :repository="outcomeRepository"
        :campaign-id="props.campaignId"
      />
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import { StoryRecordStatusRepository } from "@/data/repository/campaign/awakenings/StoryRecordStatusRepository";
import { StoryRecordOutcomeRepository } from "@/data/repository/campaign/awakenings/StoryRecordOutcomeRepository";
import { StoryRecordFollowerRepository } from "@/data/repository/campaign/awakenings/StoryRecordFollowerRepository";
import StoryRecordStatus from "@/components/StoryRecordStatus.vue";
import StoryRecordOutcome from "@/components/StoryRecordOutcome.vue";
import StoryRecordFollower from "@/components/StoryRecordFollower.vue";

const props = defineProps<{
  campaignId: string;
}>();

const statusRepository = new StoryRecordStatusRepository();
const outcomeRepository = new StoryRecordOutcomeRepository();
const followerRepository = new StoryRecordFollowerRepository();
</script>

<style scoped></style>
