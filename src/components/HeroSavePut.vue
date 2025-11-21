<template>
  <div style="display: none"></div>
</template>

<script setup lang="ts">
import { HeroStore } from "@/store/HeroStore";
import { useUserStore } from "@/store/UserStore";
import axios from "axios";

const props = defineProps<{
  campaignId: string;
  heroId?: string;
}>();

const emit = defineEmits(["success", "fail"]);
const heroStore = HeroStore();
const userStore = useUserStore();

function generateHeroHash(heroData: any): string {
  const data = JSON.parse(JSON.stringify(heroData));
  return btoa(JSON.stringify(data));
}

async function getPlayableHeroesPk(heroId: string): Promise<number | null> {
  try {
    const searchResponse = await axios.get("/playable_heroes/search", {
      params: {
        users_fk: userStore.user.users_pk,
      },
    });

    if (searchResponse.data?.heroes?.length > 0) {
      const hero = searchResponse.data.heroes.find(
        (h: any) => h.hero_id === heroId && h.campaigns_fk === props.campaignId
      );
      
      if (hero) {
        return hero.playable_heroes_pk;
      }
    }

    return null;
  } catch (error) {
    console.error("Error getting playable_heroes_pk:", error);
    return null;
  }
}

async function updateHeroInBackend(heroData: any, heroHash: string) {
  try {
    const playableHeroesPk = await getPlayableHeroesPk(heroData.heroId);

    if (playableHeroesPk) {
      await axios.put(`/playable_heroes/alter`, {
        playable_heroes_pk: playableHeroesPk,
        hero_hash: heroHash,
      });
    } else {
      const createResponse = await axios.post("/playable_heroes/cadastro", {
        hero_hash: heroHash,
        users_fk: userStore.user.users_pk,
      });

      if (createResponse.data?.playable_heroes_pk) {
        const relationResponse = await axios.get("/rl_campaigns_users/search", {
          params: {
            users_fk: userStore.user.users_pk,
            campaigns_fk: props.campaignId,
          },
        });

        if (relationResponse.data?.campaigns?.length > 0) {
          const relation = relationResponse.data.campaigns[0];

          await axios.put("/rl_campaigns_users/alter", {
            rl_campaigns_users_pk: relation.rl_campaigns_users_pk,
            playable_heroes_fk: createResponse.data.playable_heroes_pk,
          });
        }
      }
    }

    return true;
  } catch (error) {
    console.error("Erro ao atualizar herói no backend:", error);
    throw error;
  }
}

async function saveHeroes() {
  try {
    let heroesToSave;
    if (props.heroId) {
      const hero = heroStore.findInCampaign(props.heroId, props.campaignId);
      heroesToSave = [hero];
    } else {
      heroesToSave = heroStore.findAllInCampaign(props.campaignId);
    }

    for (const hero of heroesToSave) {
      const heroHash = generateHeroHash(hero);
      await updateHeroInBackend(hero, heroHash);
    }

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