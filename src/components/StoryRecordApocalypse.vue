<script setup lang="ts">
import { StoryRecordStatusRepository } from "@/data/repository/campaign/apocalypse/StoryRecordStatusRepository";
import { StoryRecordOutcomeRepository } from "@/data/repository/campaign/apocalypse/StoryRecordOutcomeRepository";
import { StoryRecordFollowerRepository } from "@/data/repository/campaign/apocalypse/StoryRecordFollowerRepository";
import StoryRecordStatus from "@/components/StoryRecordStatus.vue";
import StoryRecordOutcome from "@/components/StoryRecordOutcome.vue";
import StoryRecordFollower from "@/components/StoryRecordFollower.vue";
import StoryRecordUnfolding from "@/components/StoryRecordUnfolding.vue";

const props = defineProps<{
  campaignId: string;
}>();

const statusRepository = new StoryRecordStatusRepository();
const outcomeRepository = new StoryRecordOutcomeRepository();
const followerRepository = new StoryRecordFollowerRepository();
</script>

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
      <StoryRecordOutcome
        :repository="outcomeRepository"
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
      <StoryRecordUnfolding :campaign-id="props.campaignId" />
    </v-col>
  </v-row>

</template>

<style scoped></style>
