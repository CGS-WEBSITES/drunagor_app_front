<template>
  <div style="display: none"></div>
</template>

<script setup lang="ts">
import { HeroStore } from "@/store/HeroStore";
import { useUserStore } from "@/store/UserStore";
import { CampaignLoadFromStorage } from "@/utils/CampaignLoadFromStorage";
import axios from "axios";

const props = defineProps<{
  campaignId: string;
  heroId?: string;
}>();

const emit = defineEmits(["success", "fail"]);
const heroStore = HeroStore();
const userStore = useUserStore();
const campaignLoader = new CampaignLoadFromStorage();

function generateHeroHash(heroData: any): string {
  const cleanData = JSON.parse(JSON.stringify(heroData));

  delete cleanData.playableHeroesPk;
  return btoa(JSON.stringify(cleanData));
}

async function getPlayableHeroesPk(hero: any): Promise<number | null> {
  if (hero.playableHeroesPk) {
    return hero.playableHeroesPk;
  }

  try {
    const response = await axios.get("/rl_campaigns_users/list_players", {
      params: {
        campaigns_fk: props.campaignId,
      },
    });

    if (response.data?.Users?.length) {
      const currentUser = response.data.Users.find(
        (u: any) => u.user_name === userStore.user.user_name,
      );

      if (currentUser?.playable_heroes_fk) {
        heroStore.setPlayableHeroesPk(
          hero.heroId,
          props.campaignId,
          currentUser.playable_heroes_fk,
        );
        return currentUser.playable_heroes_fk;
      }
    }

    return null;
  } catch (error) {
    console.error("[HeroSavePut] Error getting playable_heroes_pk:", error);
    return null;
  }
}

async function updateHeroInBackend(hero: any): Promise<boolean> {
  const playableHeroesPk = await getPlayableHeroesPk(hero);

  if (!playableHeroesPk) {
    console.error(
      `[HeroSavePut] No playable_heroes_pk found for hero ${hero.heroId}`,
    );
    throw new Error(
      `Hero ${hero.heroId} is not linked to the campaign. Please add the hero first.`,
    );
  }

  const heroHash = generateHeroHash(hero);

  await axios.put("/playable_heroes/alter", {
    playable_heroes_pk: playableHeroesPk,
    hero_hash: heroHash,
  });

  return true;
}

async function saveHeroes(): Promise<boolean> {
  try {
    let heroesToSave;

    if (props.heroId) {
      const hero = heroStore.findInCampaignOptional(
        props.heroId,
        props.campaignId,
      );
      if (!hero) {
        throw new Error(
          `Hero ${props.heroId} not found in campaign ${props.campaignId}`,
        );
      }
      heroesToSave = [hero];
    } else {
      heroesToSave = heroStore.findAllInCampaign(props.campaignId);
    }

    if (heroesToSave.length === 0) {
      emit("success");
      return true;
    }

    for (const hero of heroesToSave) {
      await updateHeroInBackend(hero);
    }

    emit("success");
    return true;
  } catch (err) {
    console.error("[HeroSavePut] Error saving heroes:", err);
    emit("fail");
    throw err;
  }
}

defineExpose({ save: saveHeroes });
</script>
