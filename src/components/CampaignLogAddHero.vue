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
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import BaseList from "@/components/BaseList.vue";
import BaseListItem from "@/components/BaseListItem.vue";
import { EnabledHeroes } from "@/repository/EnabledHeroes";
import { HeroDataRepository } from "@/data/repository/HeroDataRepository";
import { RandomizeHero } from "@/service/RandomizeHero";
import { useToast } from "primevue/usetoast";
import RandomImage from "@/assets/hero/trackerimage/RandomAvatar.png";
import * as _ from "lodash-es";
import { HeroStore } from "@/store/HeroStore";
import { Hero } from "@/store/Hero";
import { useI18n } from "vue-i18n";
import type { HeroData } from "@/data/repository/HeroData";
import { CampaignStore } from "@/store/CampaignStore";

const props = defineProps<{
  campaignId: string;
}>();

const toast = useToast();
const { t } = useI18n();

const visible = ref(false);

function openModal() {
  visible.value = true;
}

function closeModal() {
  visible.value = false;
}

const heroStore = HeroStore();
const campaignStore = CampaignStore();

const campaign = computed(() => campaignStore.find(props.campaignId));
console.log('Campaign:', campaign.value);

const MAX_HEROES = 4;
const campaignHeroesCount = computed(
  () => heroStore.findAllInCampaign(props.campaignId).length,
);

const isLimitReached = computed(() => {
  if (!campaign.value) {
    return false;
  }
  if (campaign.value.campaign === 'underkeep') {
    return campaignHeroesCount.value >= MAX_HEROES;
  }
  return false;
});

const availableHeroes = computed(() => {
  if (!campaign.value) {
    return [];
  }
  
  if (campaign.value.campaign === 'underkeep') {
    const heroRepository = new HeroDataRepository();
    const allHeroes = heroRepository.findAll();
    return allHeroes.filter((hero: HeroData) => hero.content === 'core');
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

function addHeroToCampaign(heroId: string) {
  if (isLimitReached.value) {
    toast.add({
      severity: "warn",
      summary: "Limit reached",
      detail: `Underkeep campaigns can only have ${MAX_HEROES} heroes.`,
      life: 3000,
    });
    closeModal();
    return;
  }
  heroStore.add(new Hero(heroId, props.campaignId));
  closeModal();
}

function addRandomHeroToCampaign() {
  if (isLimitReached.value) {
    toast.add({
      severity: "warn",
      summary: "Limit reached",
      detail: `Underkeep campaigns can only have ${MAX_HEROES} heroes.`,
      life: 3000,
    });
    closeModal();
    return;
  }

  const randomHero = new RandomizeHero().randomize(
    _.map(heroStore.findAllInCampaign(props.campaignId), "heroId"),
    availableHeroes.value 
  );

  if (randomHero === null) {
    toast.add({
      severity: "error",
      summary: "Error",
      detail: "No random hero available.",
      life: 3000,
    });
    return;
  }
  heroStore.add(new Hero(randomHero.id, props.campaignId));
  closeModal();
}
</script>

<style scoped></style>