<script setup lang="ts">
import { ref, watch } from "vue";
import { CampaignStore } from "@/store/CampaignStore";

const props = defineProps<{
  campaignId: string;
}>();

const campaignStore = CampaignStore();

const perseverance = ref(0);
perseverance.value =
  campaignStore.find(props.campaignId).legacyTrail.perseverance ?? 0;

watch(perseverance, async (newPersverance) => {
  campaignStore.find(props.campaignId).legacyTrail.perseverance =
    newPersverance;
});

const tragedy = ref(0);
tragedy.value = campaignStore.find(props.campaignId).legacyTrail.tragedy ?? 0;

watch(tragedy, async (newTragedy) => {
  campaignStore.find(props.campaignId).legacyTrail.tragedy = newTragedy;
});

const doom = ref(0);
doom.value = campaignStore.find(props.campaignId).legacyTrail.doom ?? 0;

watch(doom, async (newDoom) => {
  campaignStore.find(props.campaignId).legacyTrail.doom = newDoom;
});

const heroism = ref(0);
heroism.value = campaignStore.find(props.campaignId).legacyTrail.heroism ?? 0;

watch(heroism, async (newHeroism) => {
  campaignStore.find(props.campaignId).legacyTrail.heroism = newHeroism;
});
</script>

<template>
  <div id="story-record-legacy-trail" class="form-control w-full">
    <v-row no-gutters>
      <v-col cols="8" class="text-left"> Perseverance </v-col>
      <v-col cols="4">
        <v-radio-group v-model="perseverance" inline>
          <v-radio label="0" value="0"></v-radio>
          <v-radio label="1" value="1"></v-radio>
          <v-radio label="2" value="2"></v-radio>
          <v-radio label="3" value="3"></v-radio>
        </v-radio-group>
      </v-col>

      <v-col cols="8" class="text-left"> Tragedy </v-col>
      <v-col cols="4">
        <v-radio-group v-model="tragedy" inline>
          <v-radio label="0" value="0"></v-radio>
          <v-radio label="1" value="1"></v-radio>
          <v-radio label="2" value="2"></v-radio>
          <v-radio label="3" value="3"></v-radio>
        </v-radio-group>
      </v-col>

      <v-col cols="8" class="text-left"> Doom </v-col>
      <v-col cols="4">
        <v-radio-group v-model="doom" inline>
          <v-radio label="0" value="0"></v-radio>
          <v-radio label="1" value="1"></v-radio>
          <v-radio label="2" value="2"></v-radio>
          <v-radio label="3" value="3"></v-radio>
        </v-radio-group>
      </v-col>

      <v-col cols="8" class="text-left"> Heroism </v-col>
      <v-col cols="4">
        <v-radio-group v-model="heroism" inline>
          <v-radio label="0" value="0"></v-radio>
          <v-radio label="1" value="1"></v-radio>
          <v-radio label="2" value="2"></v-radio>
          <v-radio label="3" value="3"></v-radio>
        </v-radio-group>
      </v-col>
    </v-row>
  </div>
</template>

<style scoped></style>
