<template>
  <!-- Act 3: after picking a Hero, the player gathers that Hero's components step by step. -->
  <v-dialog v-model="model" max-width="900" :fullscreen="smAndDown" scrollable persistent>
    <v-card color="#1e1e1e" class="prep-card">
      <div class="prep-head">
        <div>
          <small>Prepare your Hero</small>
          <strong class="cinzel-text">{{ heroName }}</strong>
        </div>
        <v-btn icon="mdi-close" variant="text" size="small" title="Close" @click="model = false" />
      </div>
      <v-card-text class="pa-2 pa-sm-4">
        <AssemblyGuide :key="heroName" :steps="steps" finish-label="I'm ready" @finish="model = false" />
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useDisplay } from "vuetify";
import AssemblyGuide from "@/components/AssemblyGuide.vue";
import heroSummaries from "@/data/book/HeroSummary.json";
import type { HeroSummary } from "@/components/HeroSummaryPanel.vue";
import { heroPreparationSteps } from "@/data/assembly/heroPreparation";

// season is kept for the callers; the Core Heroes prepare the same way in both seasons.
const props = defineProps<{ heroName: string; season: "s1" | "s2" }>();
const model = defineModel<boolean>({ default: false });
const { smAndDown } = useDisplay();

const steps = computed(() =>
  heroPreparationSteps(props.heroName, (heroSummaries as Record<string, HeroSummary>)[props.heroName]?.gift),
);
</script>

<style scoped>
.prep-card {
  border-radius: 14px !important;
}
.prep-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 10px 4px 20px;
}
.prep-head > div {
  display: flex;
  flex-direction: column;
}
.prep-head small {
  font-family: "Poppins", sans-serif;
  font-size: 0.68rem;
  font-weight: 800;
  letter-spacing: 0.6px;
  text-transform: uppercase;
  opacity: 0.6;
}
.prep-head strong {
  font-size: 1.3rem;
}
</style>
