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
    const hero = heroStore.findInCampaign(heroId, campaignId);
    heroes = [hero];
  } else {
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

  try {
    const storageKey = props.heroId 
      ? `hero_hash_${props.campaignId}_${props.heroId}`
      : `heroes_hash_${props.campaignId}`;
    
    // Pega a hash existente (se houver)
    const existingHash = localStorage.getItem(storageKey);
    
    let existingData: any = { heroes: [] };
    
    // Se já existe uma hash, decodifica ela
    if (existingHash) {
      try {
        existingData = JSON.parse(atob(existingHash));
      } catch (error) {
        console.warn("Erro ao decodificar hash existente, criando nova:", error);
        existingData = { heroes: [] };
      }
    }
    
    // Decodifica os novos dados
    const newData = JSON.parse(atob(token.value));
    
    if (props.heroId) {
      // Atualiza ou adiciona o herói específico
      const heroIndex = existingData.heroes.findIndex(
        (h: any) => h.heroId === props.heroId && h.campaignId === props.campaignId
      );
      
      if (heroIndex !== -1) {
        // Herói existe, atualiza
        existingData.heroes[heroIndex] = newData.heroes[0];
      } else {
        // Herói não existe, adiciona
        existingData.heroes.push(newData.heroes[0]);
      }
    } else {
      // Salva todos os heróis da campanha
      // Remove os heróis antigos desta campanha e adiciona os novos
      existingData.heroes = existingData.heroes.filter(
        (h: any) => h.campaignId !== props.campaignId
      );
      existingData.heroes.push(...newData.heroes);
    }
    
    // Recodifica e salva
    const updatedHash = btoa(JSON.stringify(existingData));
    localStorage.setItem(storageKey, updatedHash);
    
    // Quando o backend estiver pronto, descomentar:
    // if (props.heroId) {
    //   await axios.put(`heroes/alter/${props.campaignId}/${props.heroId}`, {
    //     hero_hash: updatedHash,
    //   });
    // } else {
    //   await axios.put(`heroes/alter/${props.campaignId}`, {
    //     heroes_hash: updatedHash,
    //   });
    // }
    
    emit("success");
    return true;
  } catch (err) {
    console.error("Erro ao salvar heróis:", err);
    emit("fail");
    throw err;
  }
}

defineExpose({ save: saveHeroes });
</script>