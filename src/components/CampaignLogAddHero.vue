<template>
  <v-btn
    variant="elevated"
    id="campaign-add-hero"
    rounded
    @click="openModal"
    :disabled="isLimitReached || isLoading || userAlreadyHasHero"
    :loading="isLoading"
  >
    <v-icon start>mdi-plus</v-icon>
    {{ t("label.add-hero") }}

    <v-tooltip v-if="userAlreadyHasHero" activator="parent" location="top">
      You already have a hero in this campaign
    </v-tooltip>
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
import { ref, computed, onMounted } from "vue";
import { EnabledHeroes } from "@/repository/EnabledHeroes";
import { HeroDataRepository } from "@/data/repository/HeroDataRepository";
import { RandomizeHero } from "@/service/RandomizeHero";
import RandomImage from "@/assets/hero/trackerimage/RandomAvatar.png";
import {
  Hero,
  SequentialAdventureState,
  RESOURCE_DEFINITIONS,
} from "@/store/Hero";
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
const campaignStore = CampaignStore();

const visible = ref(false);
const isLoading = ref(false);
const snackbarVisible = ref(false);
const snackbarText = ref("");
const snackbarColor = ref("success");

const userAlreadyHasHero = ref(false);
const checkingUserHero = ref(true);

const campaign = computed(() => campaignStore.findOptional(props.campaignId));

// Flag para saber se é Underkeep/Nights (Multiplayer real) ou Campanhas Legadas
const isMultiplayer = computed(() => {
  return (
    campaign.value?.campaign === "underkeep" ||
    campaign.value?.campaign === "underkeep2"
  );
});

const campaignHeroesCount = computed(() => {
  return campaignStore.findAllHeroes(props.campaignId).length;
});

// Limite Dinâmico: 4 para Underkeep, 5 para as Legadas
const isLimitReached = computed(() => {
  if (!campaign.value) return false;

  if (isMultiplayer.value) {
    return campaignHeroesCount.value >= 4;
  } 
  
  return campaignHeroesCount.value >= 5;
});

const availableHeroes = computed(() => {
  if (!campaign.value) {
    return [];
  }

  if (isMultiplayer.value) {
    const heroRepository = new HeroDataRepository();
    const allHeroes = heroRepository.findAll();
    return allHeroes.filter((hero: HeroData) => hero.content === "core");
  } else {
    return new EnabledHeroes().findAll();
  }
});

const filteredHeroes = computed(() =>
  availableHeroes.value.filter(
    (hero: HeroData) => !campaignStore.hasHero(props.campaignId, hero.id),
  ),
);

async function checkUserHasHero(): Promise<void> {
  checkingUserHero.value = true;

  // Se for campanha antiga (Core, Apoc, Awek), ignora a trava de 1 herói por usuário.
  if (!isMultiplayer.value) {
    userAlreadyHasHero.value = false;
    checkingUserHero.value = false;
    return;
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

      userAlreadyHasHero.value = currentUser?.playable_heroes_fk != null;
    }
  } catch (error) {
    console.error("[AddHero] Error checking user hero:", error);
    userAlreadyHasHero.value = false;
  } finally {
    checkingUserHero.value = false;
  }
}

function openModal() {
  if (userAlreadyHasHero.value) {
    showSnackbar(
      "You already have a hero in this campaign. Each player can only have one hero.",
      "warning",
    );
    return;
  }

  visible.value = true;
}

function closeModal() {
  visible.value = false;
}

function showSnackbar(text: string, color: string = "success") {
  snackbarText.value = text;
  snackbarColor.value = color;
  snackbarVisible.value = true;
}

function createHeroWithResources(heroId: string): Hero {
  const newHero = new Hero(heroId, props.campaignId);

  newHero.sequentialAdventureState = new SequentialAdventureState();

  RESOURCE_DEFINITIONS.forEach((resource) => {
    newHero.sequentialAdventureState!.resources[resource.id] = 0;
  });

  return newHero;
}

function generateHeroHash(hero: Hero): string {
  const cleanData = JSON.parse(JSON.stringify(hero));
  delete cleanData.playableHeroesPk;
  return btoa(JSON.stringify(cleanData));
}

async function getUserCampaignRelationPk(): Promise<number | null> {
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

      if (currentUser) {
        return currentUser.rl_campaigns_users_pk;
      }
    }

    return null;
  } catch (error) {
    console.error("[AddHero] Error getting user campaign relation:", error);
    return null;
  }
}

async function saveHeroAndLink(hero: Hero): Promise<number> {
  const heroHash = generateHeroHash(hero);

  const createResponse = await axios.post("/playable_heroes/cadastro", {
    hero_hash: heroHash,
    users_fk: userStore.user.users_pk,
  });

  const playableHeroesPk =
    createResponse.data.playable_hero?.playable_heroes_pk;

  if (!playableHeroesPk) {
    throw new Error("Failed to get playable_heroes_pk from backend");
  }

  const rlCampaignsUsersPk = await getUserCampaignRelationPk();

  if (!rlCampaignsUsersPk) {
    throw new Error("User is not linked to this campaign");
  }

  await axios.put("/rl_campaigns_users/alter", {
    rl_campaigns_users_pk: rlCampaignsUsersPk,
    playable_heroes_fk: playableHeroesPk,
  });

  return playableHeroesPk;
}

async function addHeroToCampaign(heroId: string) {
  if (userAlreadyHasHero.value) {
    showSnackbar(
      "You already have a hero in this campaign. Each player can only have one hero.",
      "warning",
    );
    closeModal();
    return;
  }

  if (isLimitReached.value) {
    const limit = isMultiplayer.value ? 4 : 5;
    showSnackbar(
      `Campaigns can only have up to ${limit} heroes.`,
      "warning",
    );
    closeModal();
    return;
  }

  isLoading.value = true;

  try {
    const newHero = createHeroWithResources(heroId);

    // Se for Nights (Multiplayer), salva no banco
    if (isMultiplayer.value) {
      const playableHeroesPk = await saveHeroAndLink(newHero);
      newHero.playableHeroesPk = playableHeroesPk;
      userAlreadyHasHero.value = true;
    }

    // Se for Core/Apoc/Awek, apenas injeta na Store
    campaignStore.addHero(props.campaignId, newHero);

    showSnackbar("Hero added successfully!", "success");
    closeModal();
  } catch (error: any) {
    console.error("[AddHero] Error adding hero:", error);

    let errorMessage = "Failed to add hero. Please try again.";
    if (error.message?.includes("not linked")) {
      errorMessage = "You are not linked to this campaign. Please join first.";
    }

    showSnackbar(errorMessage, "error");
  } finally {
    isLoading.value = false;
  }
}

async function addRandomHeroToCampaign() {
  if (userAlreadyHasHero.value) {
    showSnackbar(
      "You already have a hero in this campaign. Each player can only have one hero.",
      "warning",
    );
    closeModal();
    return;
  }

  if (isLimitReached.value) {
    const limit = isMultiplayer.value ? 4 : 5;
    showSnackbar(
      `Campaigns can only have up to ${limit} heroes.`,
      "warning",
    );
    closeModal();
    return;
  }

  const existingHeroIds = campaignStore
    .findAllHeroes(props.campaignId)
    .map((h) => h.heroId);

  const randomHero = new RandomizeHero().randomize(
    existingHeroIds,
    availableHeroes.value,
  );

  if (randomHero === null) {
    showSnackbar("No random hero available.", "error");
    return;
  }

  await addHeroToCampaign(randomHero.id);
}

onMounted(async () => {
  await checkUserHasHero();
});
</script>

<style scoped></style>