<template>
  <v-container fluid class="pa-0" :style="contentStyle">
    <v-row no-gutters class=" cinzel-text font-weight-black pt-15 pb-4 justify-center text-center text-h2">
      COMPANION</v-row
    >
    <MainMenu />
        <router-view />

  </v-container>
</template>

<script>
import MainMenu from "@/components/MainMenu.vue";
</script>

<style>
.cinzel-text {
  font-family: 'Cinzel', serif;
}



</style>
