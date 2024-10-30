<template>
  <v-app theme="light">
    <v-app-bar flat class="border-b" title="App Drunagor">
      <!-- Links para navegação -->
      <v-spacer></v-spacer>
      <v-btn to="/login">Login</v-btn>
      <v-btn to="/dashboard">Dashboard</v-btn>
      <v-btn to="/teste">teste</v-btn>
      <v-btn to="/testedash">testedash</v-btn>

    </v-app-bar>

    <v-main>
      <!-- Exibe o conteúdo da rota -->
      <router-view />
    </v-main>
  </v-app>
</template>
