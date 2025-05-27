<script setup lang="ts">
import { ref, computed } from "vue";
import BaseList from "@/components/BaseList.vue";
import BaseListItem from "@/components/BaseListItem.vue";
import { EnabledHeroes } from "@/repository/EnabledHeroes";
import { RandomizeHero } from "@/service/RandomizeHero";
import { useToast } from "primevue/usetoast";
import RandomImage from "@/assets/hero/trackerimage/RandomAvatar.png";
import * as _ from "lodash-es";
import { HeroStore } from "@/store/HeroStore";
import { Hero } from "@/store/Hero";
import { useI18n } from "vue-i18n";
import type { HeroData } from "@/data/repository/HeroData";

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
const heroes = new EnabledHeroes().findAll();

let filteredHeroes = computed(() => heroes.filter(filterHero));

function filterHero(hero: HeroData) {
  if (heroStore.hasInCampaign(hero.id, props.campaignId)) {
    return false;
  }
  return true;
}

function addHeroToCampaign(heroId: string) {
  heroStore.add(new Hero(heroId, props.campaignId));
  closeModal();
}

function addRandomHeroToCampaign() {
  const randomHero = new RandomizeHero().randomize(
    _.map(heroStore.findAllInCampaign(props.campaignId), "heroId")
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

<template>
  <v-btn variant="elevated" id="campaign-add-hero" rounded @click="openModal">
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
          <v-list-item
            id="party-random-hero"
            @click="addRandomHeroToCampaign"
          >
             <v-img
    :src="RandomImage" 
  /></v-list-item>
     
          
          <v-list-item
  v-for="hero in filteredHeroes"
  :key="hero.id"
  @click="addHeroToCampaign(hero.id)"
>
  <v-img
    :src="hero.images.trackerimage" 
  />
</v-list-item>
        </v-list>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<style scoped></style>
