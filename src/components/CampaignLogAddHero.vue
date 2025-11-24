<template>
  <v-btn
    variant="elevated"
    id="campaign-add-hero"
    rounded
    @click="openModal"
    :disabled="isLimitReached"
  >
    <v-icon start>mdi-plus</v-icon>
    {{ t("label.add-hero") }}
  </v-btn>

  <v-dialog v-model="visible" max-width="500">
    <v-card>
      <v-card-title class="text-center">
        {{ t("label.add-hero") }}
      </v-card-title>
      <v-card-text>
        <v-list lines="one">
          <v-list-item id="party-random-hero" @click="addRandomHeroToCampaign">
            <v-img :src="RandomImage" />
          </v-list-item>

          <v-list-item
            v-for="hero in filteredHeroes"
            :key="hero.id"
            @click="addHeroToCampaign(hero.id)"
          >
            <v-img :src="hero.images.trackerimage" />
          </v-list-item>
        </v-list>
      </v-card-text>
    </v-card>
  </v-dialog>

  <v-snackbar
    v-model="snackbarVisible"
    :timeout="3000"
    :color="snackbarColor"
    location="top"
  >
    {{ snackbarText }}
  </v-snackbar>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { EnabledHeroes } from "@/repository/EnabledHeroes";
import { HeroDataRepository } from "@/data/repository/HeroDataRepository";
import { RandomizeHero } from "@/service/RandomizeHero";
import RandomImage from "@/assets/hero/trackerimage/RandomAvatar.png";
import * as _ from "lodash-es";
import { HeroStore } from "@/store/HeroStore";
import { Hero, SequentialAdventureState } from "@/store/Hero";
import { useI18n } from "vue-i18n";
import type { HeroData } from "@/data/repository/HeroData";
import { CampaignStore } from "@/store/CampaignStore";
import { useUserStore } from "@/store/UserStore";
import axios from "axios";

const props = defineProps<{
  campaignId: string;
}>();

const { t } = useI18n();
const userStore = useUserStore();

const visible = ref(false);
const snackbarVisible = ref(false);
const snackbarText = ref("");
const snackbarColor = ref("success");

function openModal() {
  visible.value = true;
}

function closeModal() {
  visible.value = false;
}

const heroStore = HeroStore();
const campaignStore = CampaignStore();

const campaign = computed(() => campaignStore.find(props.campaignId));

const MAX_HEROES = 4;
const campaignHeroesCount = computed(
  () => heroStore.findAllInCampaign(props.campaignId).length,
);

const isLimitReached = computed(() => {
  if (!campaign.value) {
    return false;
  }
  if (campaign.value.campaign === "underkeep" || campaign.value.campaign === "underkeep2") {
    return campaignHeroesCount.value >= MAX_HEROES;
  }
  return false;
});

const availableHeroes = computed(() => {
  if (!campaign.value) {
    return [];
  }

  if (campaign.value.campaign === "underkeep" || campaign.value.campaign === "underkeep2") {
    const heroRepository = new HeroDataRepository();
    const allHeroes = heroRepository.findAll();
    return allHeroes.filter((hero: HeroData) => hero.content === "core");
  } else {
    return new EnabledHeroes().findAll();
  }
});

let filteredHeroes = computed(() => availableHeroes.value.filter(filterHero));

function filterHero(hero: HeroData) {
  if (heroStore.hasInCampaign(hero.id, props.campaignId)) {
    return false;
  }
  return true;
}

function createHeroWithResources(heroId: string): Hero {
  const newHero = new Hero(heroId, props.campaignId);

  if (!newHero.sequentialAdventureState) {
    newHero.sequentialAdventureState = new SequentialAdventureState();

    if (!newHero.sequentialAdventureState.resources) {
      newHero.sequentialAdventureState.resources = {};
    }

    const RESOURCE_DEFINITIONS = [
      "focus",
      "fruit-of-life",
      "ki",
      "shield",
      "fury",
    ];

    RESOURCE_DEFINITIONS.forEach((resource) => {
      newHero.sequentialAdventureState!.resources[resource] = 0;
    });
  }

  return newHero;
}

async function saveHeroToBackend(hero: Hero): Promise<number | null> {
  try {
    const heroHash = btoa(JSON.stringify(hero));

    const response = await axios.post("/playable_heroes/cadastro", {
      hero_hash: heroHash,
      users_fk: userStore.user.users_pk,
    });

    return response.data.playable_hero?.playable_heroes_pk || null;
  } catch (error) {
    console.error("Error saving hero to backend:", error);
    throw error;
  }
}

async function linkHeroToCampaign(playableHeroesFk: number) {
  try {
    // Primeiro, tenta buscar pela lista de players
    const playersResponse = await axios.get("/rl_campaigns_users/list_players", {
      params: {
        campaigns_fk: props.campaignId,
      },
    });

    let rlCampaignsUsersPk = null;

    if (playersResponse.data?.Users?.length > 0) {
      // Tenta encontrar pelo role de Admin (party_roles_fk === 1)
      // assumindo que quem está adicionando é o Drunagor Master
      const adminUser = playersResponse.data.Users.find(
        (user: any) => user.party_roles_fk === 1
      );

      if (adminUser) {
        rlCampaignsUsersPk = adminUser.rl_campaigns_users_pk;
      }
    }

    // Se não encontrou pela lista de players, tenta pelo search
    if (!rlCampaignsUsersPk) {
      const searchResponse = await axios.get("/rl_campaigns_users/search", {
        params: {
          users_fk: userStore.user.users_pk,
          campaigns_fk: props.campaignId,
        },
      });

      if (searchResponse.data?.campaigns?.length > 0) {
        // O search não retorna rl_campaigns_users_pk diretamente,
        // então vamos usar list_players novamente mas com o user_name
        const userCampaignData = searchResponse.data.campaigns[0];
        
        // Busca novamente na lista de players pelo user_name
        const userInPlayers = playersResponse.data.Users.find(
          (user: any) => user.user_name === userStore.user.user_name
        );

        if (userInPlayers) {
          rlCampaignsUsersPk = userInPlayers.rl_campaigns_users_pk;
        }
      }
    }

    if (!rlCampaignsUsersPk) {
      throw new Error("Could not find user relation with campaign");
    }

    // Atualiza a relação com o playable_heroes_fk
    await axios.put("/rl_campaigns_users/alter", {
      rl_campaigns_users_pk: rlCampaignsUsersPk,
      playable_heroes_fk: playableHeroesFk,
    });
  } catch (error) {
    console.error("Error linking hero to campaign:", error);
    throw error;
  }
}

async function addHeroToCampaign(heroId: string) {
  if (isLimitReached.value) {
    snackbarText.value = `${campaign.value?.campaign === "underkeep" ? "Underkeep" : "Underkeep 2"} campaigns can only have ${MAX_HEROES} heroes.`;
    snackbarColor.value = "warning";
    snackbarVisible.value = true;
    closeModal();
    return;
  }

  try {
    // 1. Cria o herói com recursos
    const newHero = createHeroWithResources(heroId);

    // 2. Salva o herói no backend e recebe o playable_heroes_pk
    const playableHeroesPk = await saveHeroToBackend(newHero);

    if (!playableHeroesPk) {
      throw new Error("Failed to get playable_heroes_pk from backend");
    }

    // 3. Vincula o herói à campanha usando o playable_heroes_pk
    await linkHeroToCampaign(playableHeroesPk);

    // 4. Adiciona o herói ao store local
    heroStore.add(newHero);

    snackbarText.value = "Hero added and saved successfully!";
    snackbarColor.value = "success";
    snackbarVisible.value = true;

    closeModal();
  } catch (error) {
    console.error("Error adding hero:", error);
    snackbarText.value = "Failed to add hero. Please try again.";
    snackbarColor.value = "error";
    snackbarVisible.value = true;
  }
}

async function addRandomHeroToCampaign() {
  if (isLimitReached.value) {
    snackbarText.value = `${campaign.value?.campaign === "underkeep" ? "Underkeep" : "Underkeep 2"} campaigns can only have ${MAX_HEROES} heroes.`;
    snackbarColor.value = "warning";
    snackbarVisible.value = true;
    closeModal();
    return;
  }

  const randomHero = new RandomizeHero().randomize(
    _.map(heroStore.findAllInCampaign(props.campaignId), "heroId"),
    availableHeroes.value,
  );

  if (randomHero === null) {
    snackbarText.value = "No random hero available.";
    snackbarColor.value = "error";
    snackbarVisible.value = true;
    return;
  }

  try {
    // 1. Cria o herói com recursos
    const newHero = createHeroWithResources(randomHero.id);

    // 2. Salva o herói no backend e recebe o playable_heroes_pk
    const playableHeroesPk = await saveHeroToBackend(newHero);

    if (!playableHeroesPk) {
      throw new Error("Failed to get playable_heroes_pk from backend");
    }

    // 3. Vincula o herói à campanha usando o playable_heroes_pk
    await linkHeroToCampaign(playableHeroesPk);

    // 4. Adiciona o herói ao store local
    heroStore.add(newHero);

    snackbarText.value = "Random hero added and saved successfully!";
    snackbarColor.value = "success";
    snackbarVisible.value = true;

    closeModal();
  } catch (error) {
    console.error("Error adding random hero:", error);
    snackbarText.value = "Failed to add random hero. Please try again.";
    snackbarColor.value = "error";
    snackbarVisible.value = true;
  }
}
</script>

<style scoped></style>
