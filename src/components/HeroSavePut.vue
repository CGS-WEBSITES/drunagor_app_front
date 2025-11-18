<template>
  <div style="display: none">
  </div>
</template>

<script setup lang="ts">
import { HeroStore } from "@/store/HeroStore";
import { CampaignStore } from "@/store/CampaignStore";

const props = defineProps<{
  campaignId: string;
  heroId?: string; 
}>();

const emit = defineEmits(["success", "fail"]);
const heroStore = HeroStore();
const campaignStore = CampaignStore();

function deepMerge(target: any, source: any): any {
  const output = { ...target };

  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach((key) => {
      if (isObject(source[key])) {
        if (!(key in target)) {
          output[key] = source[key];
        } else {
          output[key] = deepMerge(target[key], source[key]);
        }
      } else {
        output[key] = source[key];
      }
    });
  }

  return output;
}

function isObject(item: any): boolean {
  return item && typeof item === "object" && !Array.isArray(item);
}

async function saveHeroes() {
  try {
    const storageKey = `campaign_hash_${props.campaignId}`;

    const existingHash = localStorage.getItem(storageKey);

    let existingData: any = { heroes: [], campaignData: null };

    if (existingHash) {
      try {
        existingData = JSON.parse(atob(existingHash));
      } catch (error) {
        console.warn(
          "Erro ao decodificar hash existente, criando nova:",
          error,
        );

        const campaign = campaignStore.find(props.campaignId);
        if (campaign) {
          existingData.campaignData = JSON.parse(JSON.stringify(campaign));
        }
      }
    } else {
      const campaign = campaignStore.find(props.campaignId);
      if (campaign) {
        existingData.campaignData = JSON.parse(JSON.stringify(campaign));
      }
    }

    let heroesToSave;
    if (props.heroId) {
      const hero = heroStore.findInCampaign(props.heroId, props.campaignId);
      heroesToSave = [hero];
    } else {
      heroesToSave = heroStore.findAllInCampaign(props.campaignId);
    }

    const existingHeroesMap = new Map(
      (existingData.heroes || []).map((h: any) => [h.heroId, h]),
    );

    heroesToSave.forEach((hero) => {
      const heroCopy = JSON.parse(JSON.stringify(hero));
      const existingHero = existingHeroesMap.get(hero.heroId);

      if (existingHero) {
        existingHeroesMap.set(hero.heroId, deepMerge(existingHero, heroCopy));
      } else {
        existingHeroesMap.set(hero.heroId, heroCopy);
      }
    });

    const updatedData = {
      campaignData: existingData.campaignData,
      heroes: Array.from(existingHeroesMap.values()),
      savedAt: new Date().toISOString(),
    };

    const updatedHash = btoa(JSON.stringify(updatedData));
    localStorage.setItem(storageKey, updatedHash);

    if (props.heroId) {
      const oldKey = `hero_hash_${props.campaignId}_${props.heroId}`;
      localStorage.removeItem(oldKey);
    } else {
      heroesToSave.forEach((hero) => {
        const oldKey = `hero_hash_${props.campaignId}_${hero.heroId}`;
        localStorage.removeItem(oldKey);
      });

      const oldHeroesKey = `heroes_hash_${props.campaignId}`;
      localStorage.removeItem(oldHeroesKey);
    }

    // Quando o backend estiver pronto, descomentar:
    // await axios.put(`campaigns/alter/${props.campaignId}`, {
    //   tracker_hash: updatedHash,
    // });

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
