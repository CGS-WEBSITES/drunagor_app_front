<template>
  <div class="hero-summary-panel pa-4">
    <template v-if="summary">
      <div class="d-flex align-center mb-2">
        <v-chip color="amber-accent-4" variant="flat" size="small" class="font-weight-bold text-black mr-2">
          {{ summary.role }}
        </v-chip>
        <span class="text-body-2 text-grey-lighten-1 font-italic">{{ summary.bark }}</span>
      </div>

      <p class="text-body-2 text-white mb-3">{{ summary.playstyle }}</p>

      <div class="text-caption text-amber-accent-4 font-weight-bold text-uppercase mb-1">Play style</div>
      <ul class="summary-list text-body-2 text-grey-lighten-2 mb-3">
        <li v-for="ability in summary.abilities" :key="ability">{{ ability }}</li>
      </ul>

      <div class="text-caption text-amber-accent-4 font-weight-bold text-uppercase mb-1">Starting build</div>
      <ul class="summary-list text-body-2 text-grey-lighten-2 mb-1">
        <li v-for="item in summary.build" :key="item">{{ item }}</li>
      </ul>
      <p class="text-caption text-grey mb-3">
        Hero Skills and Class Abilities unlock as you progress during the Adventure.
      </p>

      <template v-if="summary.skills.length">
        <div class="text-caption text-amber-accent-4 font-weight-bold text-uppercase mb-1">Key skills</div>
        <div class="d-flex flex-wrap ga-1 mb-3">
          <v-chip v-for="skill in summary.skills" :key="skill" size="small" variant="outlined" color="grey-lighten-1">
            {{ skill }}
          </v-chip>
        </div>
      </template>
    </template>

    <v-btn block color="success" variant="flat" size="large" class="font-weight-bold" :loading="loading" @click.stop="emit('confirm')">
      <v-icon start>mdi-check-circle</v-icon> Confirm {{ heroName }}
    </v-btn>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import heroSummaries from "@/data/book/HeroSummary.json";

type HeroSummary = {
  role: string;
  bark: string;
  playstyle: string;
  abilities: string[];
  build: string[];
  skills: string[];
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
  border-top: 1px solid rgba(255, 193, 7, 0.4);
}
.summary-list {
  padding-left: 18px;
}
</style>
