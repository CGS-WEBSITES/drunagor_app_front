<template>
  <v-container>
    <v-row no-gutters class="pt-15 pb-4 justify-center text-center text-h2">
      Campaign Tracker</v-row
    >
    <MainMenu />
        <router-view />

  </v-container>
</template>

<script>
import MainMenu from "@/components/MainMenu.vue";
</script>

<style></style>
