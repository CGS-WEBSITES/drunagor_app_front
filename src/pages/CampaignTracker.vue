<template>
  <v-container fluid class="pa-0 pt-14 pt-md-16">
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