<template>
  <v-btn
    variant="elevated"
    id="campaign-remove-hero"
    rounded
    @click="openModal"
    :disabled="filteredHeroes.length === 0"
  >
    <v-icon start>mdi-minus</v-icon>
    {{ t("label.remove-hero") }}
  </v-btn>

  <v-dialog v-model="visible" max-width="500">
    <v-card>
      <v-card-title class="text-center">
        {{ t("label.remove-hero") }}
      </v-card-title>
      <v-card-text>
        <v-list lines="one" id="campaign-remove-heroes">
          <v-list-item
            v-for="hero in filteredHeroes"
            :key="hero.id"
            @click="removeHeroFromCampaign(hero.id)"
          >
            <v-img :src="hero.images.trackerimage"
          /></v-list-item>
        </v-list>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import BaseList from "@/components/BaseList.vue";
import BaseListItem from "@/components/BaseListItem.vue";
import { HeroDataRepository } from "@/data/repository/HeroDataRepository";
import type { HeroData } from "@/data/repository/HeroData";
import { HeroStore } from "@/store/HeroStore";
import { useI18n } from "vue-i18n";

const visible = ref(false);
const { t } = useI18n();

const props = defineProps<{
  campaignId: string;
}>();

const heroStore = HeroStore();
const heroes = new HeroDataRepository().findAll();

let filteredHeroes = computed(() => heroes.filter(filterHero));

function openModal() {
  visible.value = true;
}
function closeModal() {
  visible.value = false;
}

function filterHero(hero: HeroData) {
  if (heroStore.hasInCampaign(hero.id, props.campaignId) == false) {
    return false;
  }
  return true;
}

function removeHeroFromCampaign(heroId: string) {
  heroStore.removeFromCampaign(heroId, props.campaignId);
  closeModal();
}
</script>

<style scoped></style>
