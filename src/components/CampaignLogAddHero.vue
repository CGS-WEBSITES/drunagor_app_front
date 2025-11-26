<template>
  <v-btn
    variant="elevated"
    id="campaign-add-hero"
    rounded
    @click="openModal"
    :disabled="isLimitReached || isLoading"
    :loading="isLoading"
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
const heroStore = HeroStore();
const campaignStore = CampaignStore();

const visible = ref(false);
const isLoading = ref(false);
const snackbarVisible = ref(false);
const snackbarText = ref("");
const snackbarColor = ref("success");

const campaign = computed(() => campaignStore.find(props.campaignId));

const MAX_HEROES = 4;
const campaignHeroesCount = computed(
  () => heroStore.findAllInCampaign(props.campaignId).length,
);

const isLimitReached = computed(() => {
  if (!campaign.value) {
    return false;
  }
  if (
    campaign.value.campaign === "underkeep" ||
    campaign.value.campaign === "underkeep2"
  ) {
    return campaignHeroesCount.value >= MAX_HEROES;
  }
  return false;
});

const availableHeroes = computed(() => {
  if (!campaign.value) {
    return [];
  }

  if (
    campaign.value.campaign === "underkeep" ||
    campaign.value.campaign === "underkeep2"
  ) {
    const heroRepository = new HeroDataRepository();
    const allHeroes = heroRepository.findAll();
    return allHeroes.filter((hero: HeroData) => hero.content === "core");
  } else {
    return new EnabledHeroes().findAll();
  }
});

const filteredHeroes = computed(() =>
  availableHeroes.value.filter(
    (hero: HeroData) => !heroStore.hasInCampaign(hero.id, props.campaignId),
  ),
);

function openModal() {
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
  if (isLimitReached.value) {
    const campaignType =
      campaign.value?.campaign === "underkeep" ? "Underkeep" : "Underkeep 2";
    showSnackbar(
      `${campaignType} campaigns can only have ${MAX_HEROES} heroes.`,
      "warning",
    );
    closeModal();
    return;
  }

  isLoading.value = true;

  try {
    const newHero = createHeroWithResources(heroId);
    const playableHeroesPk = await saveHeroAndLink(newHero);

    newHero.playableHeroesPk = playableHeroesPk;
    heroStore.add(newHero);

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
  if (isLimitReached.value) {
    const campaignType =
      campaign.value?.campaign === "underkeep" ? "Underkeep" : "Underkeep 2";
    showSnackbar(
      `${campaignType} campaigns can only have ${MAX_HEROES} heroes.`,
      "warning",
    );
    closeModal();
    return;
  }

  const existingHeroIds = heroStore
    .findAllInCampaign(props.campaignId)
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
</script>

<style scoped></style>
