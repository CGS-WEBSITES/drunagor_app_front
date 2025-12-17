<template>
  <div style="display: none"></div>
</template>

<script setup lang="ts">
import { usePlayableHeroStore } from "@/store/PlayableHeroStore";
import axios from "axios";

const props = defineProps<{
  playableHeroesPk: number;
}>();

const emit = defineEmits(["success", "fail"]);
const playableHeroStore = usePlayableHeroStore();

function generateHeroHash(heroData: any): string {
  const cleanData = JSON.parse(JSON.stringify(heroData));
  delete cleanData.playableHeroesPk;
  return btoa(JSON.stringify(cleanData));
}

async function saveHero(): Promise<boolean> {
  try {
    const heroView = playableHeroStore.findByPk(props.playableHeroesPk);

    if (!heroView) {
      console.error(
        `[StandaloneHeroSavePut] Hero with pk ${props.playableHeroesPk} not found in store`,
      );
      throw new Error(`Hero with pk ${props.playableHeroesPk} not found`);
    }

    const heroHash = generateHeroHash(heroView.state);

    await axios.put("/playable_heroes/alter", null, {
      params: {
        playable_heroes_pk: props.playableHeroesPk,
        hero_hash: heroHash,
      },
    });

    emit("success");
    return true;
  } catch (err) {
    console.error("[StandaloneHeroSavePut] Error saving hero:", err);
    emit("fail");
    throw err;
  }
}

defineExpose({ save: saveHero });
</script>