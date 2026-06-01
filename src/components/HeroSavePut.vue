<template>
  <div style="display: none"></div>
</template>

<script setup lang="ts">
import { CampaignStore } from "@/store/CampaignStore";
import { useUserStore } from "@/store/UserStore";
import axios from "axios";

const props = defineProps<{
  campaignId: string;
  heroId?: string;
}>();

const emit = defineEmits(["success", "fail"]);
const campaignStore = CampaignStore();
const userStore = useUserStore();

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
        campaignStore.setHeroPlayableHeroesPk(
          props.campaignId,
          hero.heroId,
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

async function saveCampaignOnly(campaignId: string): Promise<boolean> {
  const campaign = campaignStore.find(campaignId);
  const heroes = campaignStore.findAllHeroes(campaignId);

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

  const trackerHash = btoa(JSON.stringify(data));

  await axios.put(`/campaigns/alter/${campaignId}`, {
    tracker_hash: trackerHash,
    party_name: campaign.name || "",
  });

  const storageKey = `campaign_hash_${campaignId}`;
  localStorage.setItem(storageKey, trackerHash);

  return true;
}

async function saveHeroes(): Promise<boolean> {
  try {
    const campaign = campaignStore.find(props.campaignId);
    const isLegacy = ["core", "apocalypse", "awakenings"].includes(campaign.campaign);

    if (isLegacy) {
      await saveCampaignOnly(props.campaignId);
      emit("success");
      return true;
    }

    let heroesToSave;

    if (props.heroId) {
      const hero = campaignStore.findHeroOptional(props.campaignId, props.heroId);
      
      if (!hero) {
        const allHeroes = campaignStore.findAllHeroes(props.campaignId);
        console.error(
          `[HeroSavePut] Hero ${props.heroId} not found in campaign ${props.campaignId}. Available heroes:`,
          allHeroes.map(h => h.heroId)
        );
        throw new Error(
          `Hero ${props.heroId} not found in campaign ${props.campaignId}`,
        );
      }
      heroesToSave = [hero];
    } else {
      heroesToSave = campaignStore.findAllHeroes(props.campaignId);
    }

    if (heroesToSave.length === 0) {
      console.log("[HeroSavePut] No heroes to save");
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
