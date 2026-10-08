<template>
  <!-- Tap a background or trait to mark it. -->
  <div id="story-record-background-and-trait" class="traits">
    <button
      v-for="option in options"
      :key="option.id"
      class="trait"
      :class="{ on: backgroundAndTraitIds.includes(option.id) }"
      :aria-pressed="backgroundAndTraitIds.includes(option.id)"
      @click="toggle(option.id)"
    >
      <v-icon size="16">{{ backgroundAndTraitIds.includes(option.id) ? "mdi-check" : "mdi-plus" }}</v-icon>
      {{ option.label }}
    </button>
  </div>
</template>

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
});

const options = [
  { id: "folk-hero", label: "Folk Hero" },
  { id: "knight-of-amir", label: "Knight of Amira" },
  { id: "redeemer", label: "Redeemer" },
  { id: "passionate", label: "Passionate" },
];
function toggle(id: string) {
  backgroundAndTraitIds.value = backgroundAndTraitIds.value.includes(id)
    ? backgroundAndTraitIds.value.filter((value) => value !== id)
    : [...backgroundAndTraitIds.value, id];
}
</script>

<style scoped>
.traits {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.trait {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 7px 14px;
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 999px;
  font-size: 0.8rem;
  font-weight: 700;
  text-transform: uppercase;
  opacity: 0.7;
}
.trait.on {
  background: rgba(var(--v-theme-accent), 0.18);
  border-color: rgb(var(--v-theme-accent));
  color: rgb(var(--v-theme-accent));
  opacity: 1;
}
</style>
