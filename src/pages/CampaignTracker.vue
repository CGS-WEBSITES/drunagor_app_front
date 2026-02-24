<template>
  <v-container fluid class="pa-0">
    <v-row
      v-if="!isCampaignRoute && !isHeroesRoute"
      no-gutters
      class="cinzel-text font-weight-black pt-15 pb-4 justify-center text-center text-h2"
    >
      COMPANION
    </v-row>
    <MainMenu v-if="!isHeroesRoute" />
    <router-view />
  </v-container>
</template>

<script setup>
import { computed } from "vue";
import { useRoute } from "vue-router";
import MainMenu from "@/components/MainMenu.vue";

const route = useRoute();

const isCampaignRoute = computed(() => route.name === "Campaign");
const isHeroesRoute = computed(() => route.path.includes("/campaign-tracker/heroes") || route.name === "HeroesManager");
</script>

<style>
.cinzel-text {
  font-family: "Cinzel", serif;
}
</style>