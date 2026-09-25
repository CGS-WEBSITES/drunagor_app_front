<template>
  <v-container max-width="900" class="dev-preview py-8">
    <h1 class="text-h5 font-weight-bold mb-1">Dev Preview</h1>
    <p class="text-caption text-grey mb-4">
      Onboarding screens rendered without events, tables or QR codes. Available in dev mode only.
    </p>

    <div class="d-flex flex-wrap ga-2 mb-6">
      <v-btn
        v-for="item in screens"
        :key="item.id"
        :to="{ query: { screen: item.id } }"
        :color="screen === item.id ? 'amber-accent-4' : undefined"
        :variant="screen === item.id ? 'flat' : 'outlined'"
        size="small"
      >
        {{ item.label }}
      </v-btn>
    </div>

    <!-- Lobby: Choose your Hero (Act 3) -->
    <template v-if="screen === 'hero-select'">
      <div class="d-flex align-center ga-2 mb-3">
        <span class="text-body-2">Season:</span>
        <v-btn-toggle v-model="season" mandatory density="compact" color="amber-accent-4">
          <v-btn value="s1">S1</v-btn>
          <v-btn value="s2">S2</v-btn>
        </v-btn-toggle>
      </div>
      <v-card color="#1e1e1e" class="rounded-lg" max-width="600">
        <v-card-title class="text-white text-center pt-4 pb-2 cinzel-text">Choose your Hero</v-card-title>
        <v-card-text class="pa-2 d-flex flex-column">
          <div
            v-for="hero in heroes"
            :key="hero.id"
            class="hero-selection-card rounded-lg elevation-6 overflow-hidden my-1"
            :class="{ 'hero-selection-card--expanded': expandedHero === hero.name }"
            @click="expandedHero = expandedHero === hero.name ? null : hero.name"
          >
            <v-img :src="hero.images.trackerimage" width="100%" aspect-ratio="5.52" cover></v-img>
            <v-expand-transition>
              <HeroSummaryPanel
                v-if="expandedHero === hero.name"
                :hero-name="hero.name"
                @confirm="openPreparation(hero.name)"
              />
            </v-expand-transition>
          </div>
        </v-card-text>
      </v-card>
      <HeroPreparationDialog v-model="preparationDialog" :hero-name="preparedHero" :season="season" />
    </template>

    <!-- Hero preparation popup, opened directly -->
    <template v-else-if="screen === 'hero-prep'">
      <div class="d-flex flex-wrap ga-2">
        <v-btn v-for="hero in heroes" :key="hero.id" @click="openPreparation(hero.name)">{{ hero.name }}</v-btn>
      </div>
      <HeroPreparationDialog v-model="preparationDialog" :hero-name="preparedHero" :season="season" />
    </template>

    <!-- Retailer event lobby: Table Assembly tab (Act 2) -->
    <template v-else-if="screen === 'table-assembly'">
      <AssemblyGuide :steps="tableAssemblySteps" />
    </template>

    <!-- Player entering the campaign: First Setup then Start Here -->
    <template v-else-if="screen === 'first-setup'">
      <AssemblyGuide
        :steps="firstSetupSteps"
        finish-label="Continue to Start Here"
        @finish="finished = true"
      />
      <v-alert v-if="finished" type="success" variant="tonal" class="mt-4">
        In the campaign, this opens the Start Here book.
      </v-alert>
    </template>
  </v-container>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { useRoute } from "vue-router";
import AssemblyGuide from "@/components/AssemblyGuide.vue";
import HeroSummaryPanel from "@/components/HeroSummaryPanel.vue";
import HeroPreparationDialog from "@/components/dialogs/HeroPreparationDialog.vue";
import { HeroDataRepository } from "@/data/repository/HeroDataRepository";
import { tableAssemblySteps } from "@/data/assembly/tableAssembly";
import { firstSetupSteps } from "@/data/assembly/firstSetup";

const screens = [
  { id: "hero-select", label: "Choose your Hero" },
  { id: "hero-prep", label: "Hero Preparation" },
  { id: "table-assembly", label: "Table Assembly" },
  { id: "first-setup", label: "First Setup" },
];

const route = useRoute();
const screen = computed(() => String(route.query.screen || "hero-select"));

// Same heroes the Lobby allows for Drunagor Nights.
const HERO_NAMES = ["Vorn", "Lorelai", "Jaheen", "Maya", "Elros"];
const heroes = new HeroDataRepository()
  .findAll()
  .filter((hero) => HERO_NAMES.includes(hero.name)) as any[];

const season = ref<"s1" | "s2">("s1");
const expandedHero = ref<string | null>(null);
const preparationDialog = ref(false);
const preparedHero = ref("");
const finished = ref(false);

const openPreparation = (heroName: string) => {
  preparedHero.value = heroName;
  preparationDialog.value = true;
};

watch(screen, () => {
  expandedHero.value = null;
  finished.value = false;
});
</script>

<style scoped>
.hero-selection-card {
  cursor: pointer;
  border: 1px solid rgba(255, 255, 255, 0.2);
}
.hero-selection-card--expanded {
  border-color: rgba(255, 193, 7, 0.7);
}
</style>
