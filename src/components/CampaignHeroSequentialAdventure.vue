<script setup lang="ts">
import { SequentialAdventureState } from "@/store/Hero";
import { ref, watch } from "vue";
import { HeroStore } from "@/store/HeroStore";
import { HeroDataRepository } from "@/data/repository/HeroDataRepository";
import { useRoute } from "vue-router";
import type { HeroData } from "@/data/repository/HeroData";
import { useI18n } from "vue-i18n";
import { VNumberInput } from "vuetify/labs/VNumberInput";

const resourceDefinitions = [
  { id: "focus", translation_key: "label.focus" },
  { id: "fruit-of-life", translation_key: "label.fruit-of-life" },
  { id: "ki", translation_key: "label.ki" },
  { id: "shield", translation_key: "label.shield" },
  { id: "fury", translation_key: "label.fury" },
];

const heroStore = HeroStore();
const heroDataRepository = new HeroDataRepository();
const { t } = useI18n();

const route = useRoute();
const heroId = route.params.heroId.toString();
const campaignId = route.params.campaignId.toString();

const hero = heroDataRepository.find(heroId) ?? ({} as HeroData);
const sequentialAdventureState = ref({} as SequentialAdventureState);

const currentSeqAdv = heroStore.findInCampaign(
  heroId,
  campaignId
).sequentialAdventureState;
const seqAdvState =
  typeof currentSeqAdv !== "undefined" && currentSeqAdv !== null
    ? currentSeqAdv
    : new SequentialAdventureState();

sequentialAdventureState.value = seqAdvState;

watch(
  sequentialAdventureState,
  (newState) => {
    heroStore.findInCampaign(heroId, campaignId).sequentialAdventureState =
      newState;
  },
  { deep: true }
);
</script>

<template>
  <v-row no-gutters>
    <v-col cols="12" class="py-6">
      <v-btn variant="outlined" @click="$router.go(-1)">Back</v-btn>
    </v-col>

    <v-col cols="12">
      <v-card
        elevation="16"
        rounded
        style="background-color: #1f2937"
        width="100%"
        class="hero-list-item"
      >
        <v-card-title class="text-h5 px-2">
          {{ hero.name }}
          <v-divider></v-divider>
        </v-card-title>
        <v-card-text class="px-2">
          <v-row no-gutters>
            <v-col cols="2">
              <v-avatar :image="hero.images.avatar" size="65" />
            </v-col>
            <v-col cols="10">
              <p>
                {{ t("label." + hero.race.toLowerCase()) }}
                {{ t("label." + hero.class.toLowerCase().replace(" ", "-")) }}
              </p>
              <p>
                {{ t("text.path-of") }}
                {{ t("label." + hero.path.toLowerCase()) }}
              </p>
            </v-col>
            <v-col cols="12" class="py-6">
              <v-number-input
                :reverse="false"
                controlVariant="split"
                :label="t('text.curse-cubes')"
                :hideInput="false"
                :inset="false"
                variant="outlined"
                id="curse-cubes"
                :min="0"
                :max="5"
                v-model="sequentialAdventureState.curseCubes"
              ></v-number-input>
            </v-col>
            <v-col cols="12" class="py-6">
              <v-number-input
                :reverse="false"
                controlVariant="split"
                :label="t('text.trauma-cubes')"
                :hideInput="false"
                :inset="false"
                variant="outlined"
                id="trauma-cubes"
                :min="0"
                :max="1"
                v-model="sequentialAdventureState.traumaCubes"
              ></v-number-input>
            </v-col>
            <v-divider></v-divider>
            <v-col cols="12" class="py-6 text-center text-h6">{{
              t("label.resources")
            }}</v-col>
            <v-col cols="12"
              ><v-number-input
                v-for="resource in resourceDefinitions"
                :key="resource.id"
                :reverse="false"
                controlVariant="split"
                :label="t(resource.translation_key)"
                :hideInput="false"
                :inset="false"
                variant="outlined"
                id="resource.id"
                :min="0"
                :max="4"
                v-model="sequentialAdventureState.resources[resource.translation_key]"
              ></v-number-input
            ></v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<style scoped>
.hero-list-item {
  padding: 0px 16px 16px 16px;
  background-image: url("@/assets/hero/flag-bg-red.webp");
  background-repeat: no-repeat;
  background-origin: content-box;
}
</style>
