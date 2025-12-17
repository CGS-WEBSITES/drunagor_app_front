<template>
  <div class="sequential-adventure-display pa-4">
    <v-row dense>
      <v-col cols="6" sm="4">
        <div class="stat-item">
          <v-icon color="red-lighten-2" size="small">mdi-heart</v-icon>
          <span class="stat-label">{{ t("label.lifepoints") }}</span>
          <span class="stat-value">{{ state?.lifepoints ?? 0 }}</span>
        </div>
      </v-col>

      <v-col cols="6" sm="4">
        <div class="stat-item">
          <v-icon color="grey-darken-1" size="small">mdi-cube</v-icon>
          <span class="stat-label">{{ t("text.curse-cubes") }}</span>
          <span class="stat-value">{{ state?.curseCubes ?? 0 }}</span>
        </div>
      </v-col>

      <v-col cols="6" sm="4">
        <div class="stat-item">
          <v-icon color="purple-lighten-2" size="small">mdi-cube</v-icon>
          <span class="stat-label">{{ t("text.trauma-cubes") }}</span>
          <span class="stat-value">{{ state?.traumaCubes ?? 0 }}</span>
        </div>
      </v-col>

      <v-col cols="6" sm="4">
        <div class="stat-item">
          <div class="d-flex align-center">
            <v-icon size="x-small" color="yellow-darken-2">mdi-cube</v-icon>
            <v-icon size="x-small" color="red-darken-2">mdi-cube</v-icon>
            <v-icon size="x-small" color="green-darken-2">mdi-cube</v-icon>
            <v-icon size="x-small" color="blue-darken-2">mdi-cube</v-icon>
          </div>
          <span class="stat-label">Available</span>
          <span class="stat-value">{{ state?.availableCubes ?? 0 }}</span>
        </div>
      </v-col>

      <v-col cols="6" sm="4">
        <div class="stat-item faded">
          <div class="d-flex align-center">
            <v-icon size="x-small" color="yellow-darken-2">mdi-cube</v-icon>
            <v-icon size="x-small" color="red-darken-2">mdi-cube</v-icon>
            <v-icon size="x-small" color="green-darken-2">mdi-cube</v-icon>
            <v-icon size="x-small" color="blue-darken-2">mdi-cube</v-icon>
          </div>
          <span class="stat-label">Used</span>
          <span class="stat-value">{{ state?.usedCubes ?? 0 }}</span>
        </div>
      </v-col>
    </v-row>

    <v-divider class="my-3"></v-divider>
    <div class="text-subtitle-2 mb-2">{{ t("label.resources") }}</div>
    <v-row dense>
      <v-col
        v-for="resource in RESOURCE_DEFINITIONS"
        :key="resource.id"
        cols="6"
        sm="4"
        md="2"
      >
        <div class="resource-item">
          <span class="resource-label">{{ t(resource.translation_key) }}</span>
          <span class="resource-value">{{
            state?.resources?.[resource.id] ?? 0
          }}</span>
        </div>
      </v-col>
    </v-row>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import { usePlayableHeroStore } from "@/store/PlayableHeroStore";
import { RESOURCE_DEFINITIONS } from "@/store/Hero";
import type { HeroData } from "@/data/repository/HeroData";

const props = defineProps<{
  playableHeroesPk: number;
  heroStaticData: HeroData | null;
}>();

const { t } = useI18n();
const playableHeroStore = usePlayableHeroStore();

const heroView = computed(() =>
  playableHeroStore.findByPk(props.playableHeroesPk),
);
const state = computed(() => heroView.value?.state?.sequentialAdventureState);
</script>

<style scoped>
.sequential-adventure-display {
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: 8px;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 8px;
  background-color: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
}

.stat-item.faded {
  opacity: 0.6;
}

.stat-label {
  font-size: 0.7rem;
  color: rgba(255, 255, 255, 0.7);
  margin-top: 4px;
}

.stat-value {
  font-size: 1.2rem;
  font-weight: bold;
  color: white;
}

.resource-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 6px 10px;
  background-color: rgba(255, 255, 255, 0.05);
  border-radius: 6px;
}

.resource-label {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.8);
}

.resource-value {
  font-size: 1rem;
  font-weight: bold;
  color: white;
}
</style>
