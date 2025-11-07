<template>
  <div style="display: none">
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { HeroStore } from "@/store/HeroStore";
/* import axios from "axios"; */

const props = defineProps<{ 
  campaignId: string;
  heroId?: string; 
}>();

const emit = defineEmits(["success", "fail"]);
const heroStore = HeroStore();
const token = ref("");

function compressHeroes(campaignId: string, heroId?: string) {
  let heroes;
  
  if (heroId) {
    // Salva apenas um herói específico
    const hero = heroStore.findInCampaign(heroId, campaignId);
    heroes = [hero];
  } else {
    // Salva todos os heróis da campanha
    heroes = heroStore.findAllInCampaign(campaignId);
  }

  const data = {
    heroes: heroes.map((h) => {
      const clone = JSON.parse(JSON.stringify(h));
      return clone;
    }),
  };

  token.value = btoa(JSON.stringify(data));
}

async function saveHeroes() {
  compressHeroes(props.campaignId, props.heroId);

  // Salva no localStorage temporariamente
  try {
    const storageKey = props.heroId 
      ? `hero_hash_${props.campaignId}_${props.heroId}`
      : `heroes_hash_${props.campaignId}`;
    
    localStorage.setItem(storageKey, token.value);
    
    // Quando o backend estiver pronto, descomentar:
    // if (props.heroId) {
    //   await axios.put(`heroes/alter/${props.campaignId}/${props.heroId}`, {
    //     hero_hash: token.value,
    //   });
    // } else {
    //   await axios.put(`heroes/alter/${props.campaignId}`, {
    //     heroes_hash: token.value,
    //   });
    // }
    
    emit("success");
    return true;
  } catch (err) {
    emit("fail");
    throw err;
  }
}

defineExpose({ save: saveHeroes });
</script>