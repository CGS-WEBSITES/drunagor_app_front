<template>
  <v-app theme="light">
    <v-main>
      <v-row no-gutters>
        <v-app-bar flat class="border-b" title="App Drunagor">
          <!-- Links para navegação -->
          <v-spacer></v-spacer>
          <v-btn @click="$router.push({ name: 'Login' })">Login</v-btn>
          <v-btn @click="$router.push({ name: 'Teste' })">teste</v-btn>
          <v-btn @click="$router.push({ name: 'Dashboard' })">Dashboard</v-btn>
          <v-btn @click="$router.push({ name: 'Library' })">Library</v-btn>
        </v-app-bar>
      </v-row>

      <v-row>
        <!-- Exibe o conteúdo da rota -->
        <router-view />
      </v-row>
    </v-main>
   


<!-- Fixed Bottom Navigation for Mobile -->
<v-bottom-navigation
  app
  v-model="bottomNavVisible"
  class="hidden-md-and-up fixed bg-black text-white"
  elevation="10"
  :style="{ width: '100%', padding: '0', overflow: 'hidden' }" 
>
  <v-btn
    @click="action1"
    class="pa-0 flex-grow-1"
    min-width="0" 
  >
    <v-icon>mdi-home</v-icon>
  </v-btn>
  <v-btn
    @click="action2"
    class="pa-0 flex-grow-1"
    min-width="0"
  >
    <v-icon>mdi-magnify</v-icon>
  </v-btn>
  <v-btn
    @click="action3"
    class="pa-0 flex-grow-1"
    min-width="0"
  >
    <v-icon>mdi-plus-circle</v-icon>
  </v-btn>
  <v-btn
    @click="action4"
    class="pa-0 flex-grow-1"
    min-width="0"
  >
    <v-icon>mdi-heart</v-icon>
  </v-btn>
  <v-btn
    @click="action5"
    class="pa-0 flex-grow-1"
    min-width="0"
  >
    <v-icon>mdi-account</v-icon>
  </v-btn>
</v-bottom-navigation>

  <!-- Footer Section -->
     <v-footer class="footer black bg-black pb-12" padless>
      <v-container fluid>
        <v-row justify="center" align="center" class="text-center">
          <v-col cols="12" sm="4">
            <v-img
              class="logocgs mx-auto"
              src="@/assets/cgs.png"
              max-width="92"
              alt="logo"
            />
          </v-col>

          <v-col cols="12" sm="4" class="info-footer text-center">
            <h3 class="white--text">Footer Infos Here</h3>
            <p class="white--text">Big name info 1</p>
            <p class="white--text">Big name info 2</p>
            <p class="white--text">Big name info 3</p>
          </v-col>

          <v-col cols="12" sm="4" class="text-center">
            <h3 class="white--text">Social medias</h3>
            <v-btn fab icon color="black" dark>
              <v-icon color="white">mdi-instagram</v-icon>
            </v-btn>
            <v-btn fab icon color="black" dark>
              <v-icon color="white">mdi-facebook</v-icon>
            </v-btn>
            <v-btn fab icon color="black" dark>
              <v-icon color="white">mdi-youtube</v-icon>
            </v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-footer>
  </v-app>
</template>
<script>
import { useRoute } from "vue-router";
</script>
