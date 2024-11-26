<template>
  <v-app :theme="theme">
    <Toast />
    <v-main>
      <v-row no-gutters>
        <v-app-bar flat class="border-b" title="App Drunagor">
          <!-- Links para navegação -->
          <v-spacer></v-spacer>
          <v-btn @click="$router.push({ name: 'Login' })">Login</v-btn>
          <v-btn @click="$router.push({ name: 'CampaignTracker' })">
            Campaign Tracker
          </v-btn>
          <v-btn @click="$router.push({ name: 'Teste' })">teste</v-btn>
          <v-btn variant="icon" @click="toggleTheme()"
            ><v-icon>mdi-theme-light-dark</v-icon></v-btn
          >
        </v-app-bar>
      </v-row>

      <v-row>
        <!-- Exibe o conteúdo da rota -->
        <router-view />
      </v-row>
    </v-main>
  </v-app>
</template>
<script setup lang="ts">
import Toast from "primevue/toast";
import { ref } from "vue";

const theme = ref("dark");

const toggleTheme = () => {
  theme.value = theme.value == "dark" ? "light" : "dark";
};
</script>
<style>
.v-row {
  width: 100%;
}
</style>
