<script setup lang="ts">
import { ref, watch } from "vue";
import { CampaignStore } from "@/store/CampaignStore";

const props = defineProps<{
  campaignId: string;
}>();

const campaignStore = CampaignStore();

const backgroundAndTraitIds = ref([] as string[]);
backgroundAndTraitIds.value =
  campaignStore.find(props.campaignId).backgroundAndTraitIds ?? [];

watch(backgroundAndTraitIds, async (newBackgroundAndTraitsIds) => {
  campaignStore.find(props.campaignId).backgroundAndTraitIds =
    newBackgroundAndTraitsIds;
  console.log(newBackgroundAndTraitsIds);
});
</script>

<template>
  <div
    id="story-record-background-and-trait"
    class="grid gap-1 form-control w-full"
  >
    <v-row no-gutters>
      <v-col cols="8" class="text-left"> Folk Hero </v-col>
      <v-col cols="4" class="d-flex flex-row justify-end pr-9">
        <v-switch
          v-model="backgroundAndTraitIds"
          value="folk-hero"
          color="success"
          hide-details
          inset
        ></v-switch>
      </v-col>

      <v-col cols="8" class="text-left"> Knight of Amira </v-col>
      <v-col cols="4" class="d-flex flex-row justify-end pr-9">
        <v-switch
          v-model="backgroundAndTraitIds"
          value="knight-of-amir"
          color="success"
          hide-details
          inset
        ></v-switch>
      </v-col>

      <v-col cols="8" class="text-left"> Redeemer </v-col>
      <v-col cols="4" class="d-flex flex-row justify-end pr-9">
        <v-switch
          v-model="backgroundAndTraitIds"
          value="redeemer"
          color="success"
          hide-details
          inset
        ></v-switch>
      </v-col>

      <v-col cols="8" class="text-left"> Passionate </v-col>
      <v-col cols="4" class="d-flex flex-row justify-end pr-9">
        <v-switch
          v-model="backgroundAndTraitIds"
          value="passionate"
          color="success"
          hide-details
          inset
        ></v-switch>
      </v-col>
    </v-row>
  </div>
</template>

<style scoped></style>
