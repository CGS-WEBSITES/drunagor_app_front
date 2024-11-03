<template>
  <v-app theme="light">
    <v-main>
      <v-row no-gutters>
        <v-app-bar flat class="border-b" title="App Drunagor">
          <!-- Links para navegação -->
          <v-spacer></v-spacer>
          <v-btn @click="$router.push({ name: 'Login' })">Login</v-btn>
          <v-btn @click="$router.push({ name: 'Teste' })">teste</v-btn>
        </v-app-bar>
      </v-row>

      <v-row>
        <!-- Exibe o conteúdo da rota -->
        <router-view />
      </v-row>
    </v-main>
  </v-app>
</template>
<script>
import { useRoute } from "vue-router";
</script>
