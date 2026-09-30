<template>
  <!-- Four tracks, each from 0 to 3. -->
  <div id="story-record-legacy-trail" class="trail">
    <div v-for="track in tracks" :key="track.label" class="trail__row">
      <span class="trail__label">{{ track.label }}</span>
      <div class="trail__pips" role="radiogroup" :aria-label="track.label">
        <button
          v-for="n in 4"
          :key="n"
          role="radio"
          class="trail__pip"
          :class="{ on: Number(track.model.value) >= n - 1 && n > 1, current: Number(track.model.value) === n - 1 }"
          :aria-checked="Number(track.model.value) === n - 1"
          @click="track.model.value = n - 1"
        >
          {{ n - 1 }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { CampaignStore } from "@/store/CampaignStore";

const props = defineProps<{
  campaignId: string;
}>();

const campaignStore = CampaignStore();
// Older saves may not have a legacy trail yet.
const campaignRecord = campaignStore.find(props.campaignId);
if (!campaignRecord.legacyTrail) campaignRecord.legacyTrail = { perseverance: 0, tragedy: 0, doom: 0, heroism: 0 };

const perseverance = ref(0);
perseverance.value = Number(campaignStore.find(props.campaignId).legacyTrail.perseverance ?? 0);

watch(perseverance, async (newPersverance) => {
  campaignStore.find(props.campaignId).legacyTrail.perseverance =
    newPersverance;
});

const tragedy = ref(0);
tragedy.value = Number(campaignStore.find(props.campaignId).legacyTrail.tragedy ?? 0);

watch(tragedy, async (newTragedy) => {
  campaignStore.find(props.campaignId).legacyTrail.tragedy = newTragedy;
});

const doom = ref(0);
doom.value = Number(campaignStore.find(props.campaignId).legacyTrail.doom ?? 0);

watch(doom, async (newDoom) => {
  campaignStore.find(props.campaignId).legacyTrail.doom = newDoom;
});

const heroism = ref(0);
heroism.value = Number(campaignStore.find(props.campaignId).legacyTrail.heroism ?? 0);

watch(heroism, async (newHeroism) => {
  campaignStore.find(props.campaignId).legacyTrail.heroism = newHeroism;
});

const tracks = [
  { label: "Perseverance", model: perseverance },
  { label: "Tragedy", model: tragedy },
  { label: "Doom", model: doom },
  { label: "Heroism", model: heroism },
];
</script>

<style scoped>
.trail {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.trail__row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}
.trail__label {
  font-size: 0.85rem;
  font-weight: 700;
  text-transform: uppercase;
}
.trail__pips {
  display: flex;
  gap: 6px;
}
.trail__pip {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background: rgb(var(--v-theme-secondary));
  font-weight: 800;
  opacity: 0.7;
  transition: background 0.15s ease, opacity 0.15s ease;
}
.trail__pip.on {
  background: rgba(var(--v-theme-accent), 0.35);
  opacity: 1;
}
.trail__pip.current {
  background: rgb(var(--v-theme-accent));
  color: #141414;
  opacity: 1;
}
</style>
