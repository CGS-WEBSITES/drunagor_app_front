<template>
  <v-dialog v-model="model" max-width="640" scrollable persistent>
    <v-card color="#1e1e1e" class="rounded-lg">
      <v-card-title class="text-white text-center pt-4 pb-1 cinzel-text">
        Prepare your Hero
      </v-card-title>
      <div class="text-center text-caption text-grey-lighten-1 px-4 pb-3">
        Gather {{ heroName }}'s components before the adventure starts.
      </div>

      <v-card-text class="pa-3">
        <div v-if="heroSection" class="prep-page mb-3">
          <h3 class="prep-title">{{ heroSection.title }}</h3>
          <div class="prep-body" v-html="heroSection.body"></div>
        </div>
        <div v-if="generalSection" class="prep-page">
          <h3 class="prep-title">{{ generalSection.title }}</h3>
          <div class="prep-body" v-html="generalSection.body"></div>
        </div>
      </v-card-text>

      <v-card-actions class="pa-4">
        <v-btn block color="success" variant="flat" size="large" class="font-weight-bold" @click="model = false">
          <v-icon start>mdi-check</v-icon> I have my components
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { computed } from "vue";
import heroPreparation from "@/data/book/HeroPreparation.json";

type Section = { id?: string; title: string; body: string };
type SeasonPreparation = { general: Section; heroes: Record<string, Section> };

const props = defineProps<{ heroName: string; season: "s1" | "s2" }>();
const model = defineModel<boolean>({ default: false });

const data = heroPreparation as Record<"s1" | "s2", SeasonPreparation>;

const generalSection = computed(() => data[props.season].general);

// Season 2 has no page for every hero (e.g. Elros), so fall back to Season 1.
const heroSection = computed(
  () => data[props.season].heroes[props.heroName] ?? data.s1.heroes[props.heroName],
);
</script>

<style scoped>
.prep-page {
  background-color: #fff;
  color: #212121;
  border-radius: 8px;
  padding: 16px;
}
.prep-title {
  font-family: "Cinzel", serif;
  font-size: 1.1rem;
  margin-bottom: 8px;
}
.prep-body :deep(img) {
  max-width: 100%;
  height: auto;
}
</style>
