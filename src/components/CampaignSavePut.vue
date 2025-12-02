<template>
  <v-btn variant="elevated" id="campaign-save" rounded @click="handleClick">
    <v-icon start>mdi-content-save-outline</v-icon>
    {{ t("label.save-campaign-put") }}
  </v-btn>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { CampaignStore } from "@/store/CampaignStore";
import { HeroStore } from "@/store/HeroStore";
import { useI18n } from "vue-i18n";
/* import axios from "axios"; */
  <div></div>
</template>

<script setup lang="ts">
import axios from "axios";
import { CampaignStore } from "@/store/CampaignStore";

const props = defineProps<{
  campaignId: string;
}>();

const emit = defineEmits<{
  (e: "success"): void;
  (e: "fail"): void;
}>();

const campaignStore = CampaignStore();

function generateCampaignHash(): string {
  const campaign = campaignStore.find(props.campaignId);
  const heroes = campaignStore.findAllHeroes(props.campaignId);

  const campaignData = JSON.parse(JSON.stringify(campaign));
  delete campaignData.heroes; 

  const heroesData = heroes.map((hero) => {
    const cleanHero = JSON.parse(JSON.stringify(hero));
    delete cleanHero.playableHeroesPk;
    return cleanHero;
  });

  const data = {
    campaignData,
    heroes: heroesData,
    savedAt: new Date().toISOString(),
  };

  return btoa(JSON.stringify(data));
}

function mergeWithExistingHash() {
  const storageKey = `campaign_hash_${props.campaignId}`;
  const existingHash = localStorage.getItem(storageKey);

  if (!existingHash) {
    return token.value;
  }

  try {
    const existingData = JSON.parse(atob(existingHash));
    const newData = JSON.parse(atob(token.value));

    const mergedCampaign = {
      ...existingData.campaignData,
      ...newData.campaignData,
    };

    const existingHeroesMap = new Map(
      (existingData.heroes || []).map((h: any) => [h.heroId, h]),
    );

    newData.heroes.forEach((newHero: any) => {
      const existingHero = existingHeroesMap.get(newHero.heroId);

      if (existingHero) {
        existingHeroesMap.set(newHero.heroId, deepMerge(existingHero, newHero));
      } else {
        existingHeroesMap.set(newHero.heroId, newHero);
      }
    });

    const mergedData = {
      campaignData: mergedCampaign,
      heroes: Array.from(existingHeroesMap.values()),
      savedAt: new Date().toISOString(),
    };

    return btoa(JSON.stringify(mergedData));
  } catch (error) {
    console.error("Error merging with existing hash:", error);
    return token.value;
  }
}

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

async function saveCampaign() {
  const party_name = compressCampaignComplete(props.campaignId);

  try {
    const mergedHash = mergeWithExistingHash();

    const storageKey = `campaign_hash_${props.campaignId}`;
    localStorage.setItem(storageKey, mergedHash);

    const heroes = heroStore.findAllInCampaign(props.campaignId);
    heroes.forEach((hero) => {
      const oldKey = `hero_hash_${props.campaignId}_${hero.heroId}`;
      localStorage.removeItem(oldKey);
    });

    const oldHeroesKey = `heroes_hash_${props.campaignId}`;
    localStorage.removeItem(oldHeroesKey);

    // Quando o backend estiver pronto, descomentar:
    // await axios.put(`campaigns/alter/${props.campaignId}`, {
    //   tracker_hash: mergedHash,
    //   party_name: party_name,
    // });

    emit("success");
    return true;
  } catch (err) {
    console.error("Error saving campaign:", err);
    emit("fail");
    throw err;
  }
}

async function handleClick() {
  try {
    await saveCampaign();
    emit("open-save-panel");
  } catch (error) {
    console.error("Error saving campaign:", error);
  }
}

defineExpose({ save: saveCampaign });
</script>
