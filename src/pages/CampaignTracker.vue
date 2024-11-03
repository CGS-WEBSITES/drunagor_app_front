<template>
  <v-container>
    <v-row no-gutters class="pa-6 justify-center text-center text-h2">
      Campaign Tracker</v-row
    >
    <Toast />
    <MainMenu />
    <v-row no-gutters class="pa-6 justify-center">
      <v-card class="pa-6 elevation-12">
        <router-view />
      </v-card>
    </v-row>
  </v-container>
</template>

<script>
import Toast from "primevue/toast";
import MainMenu from "@/components/MainMenu.vue";
</script>

<style>
</style>