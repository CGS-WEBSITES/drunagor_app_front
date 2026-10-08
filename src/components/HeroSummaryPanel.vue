<template>
  <div class="hero-summary-panel pa-4">
    <template v-if="summary">
      <p class="text-body-2 text-grey-lighten-1 font-italic mb-3">{{ summary.bark }}</p>

      <div class="text-caption text-amber-accent-4 font-weight-bold text-uppercase mb-1">Play style</div>
      <ul class="summary-list text-body-2 text-grey-lighten-2 mb-3">
        <li v-for="item in summary.playstyle" :key="item">{{ item }}</li>
      </ul>

      <div class="text-caption text-amber-accent-4 font-weight-bold text-uppercase mb-1">Recommended Gift</div>
      <p class="text-body-2 text-grey-lighten-2 mb-4">
        <strong class="text-white">{{ summary.gift.name }}</strong>: {{ summary.gift.description }}
      </p>
    </template>

    <v-btn block color="success" variant="flat" size="large" class="font-weight-bold" :loading="loading" @click.stop="emit('confirm')">
      <v-icon start>mdi-check-circle</v-icon> Confirm {{ heroName }}
    </v-btn>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import heroSummaries from "@/data/book/HeroSummary.json";

export type HeroSummary = {
  bark: string;
  playstyle: string[];
  gift: { name: string; description: string };
};

const props = defineProps<{ heroName: string; loading?: boolean }>();
const emit = defineEmits<{ (e: "confirm"): void }>();

const summary = computed<HeroSummary | undefined>(
  () => (heroSummaries as Record<string, HeroSummary>)[props.heroName],
);
</script>

<style scoped>
.hero-summary-panel {
  background: rgba(255, 255, 255, 0.04);
}
.summary-list {
  padding-left: 18px;
}
</style>
