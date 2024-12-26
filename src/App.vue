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
          <v-btn @click="$router.push({ name: 'Dashboard' })">Dashboard</v-btn>
          <v-btn @click="$router.push({ name: 'Library' })">Library</v-btn>
          <v-btn variant="icon" @click="toggleTheme()"
            ><v-icon>mdi-theme-light-dark</v-icon></v-btn
          >
        </v-app-bar>
      </v-row>

      <v-bottom-navigation
        app
        v-model="bottomNavVisible"
        class="hidden-md-and-up fixed bottom-0 bg-black text-white"
        elevation="10"
        dense
      >
        <v-row align="center" justify="space-between" no-gutters>
          <v-col class="text-center" cols="2">
            <v-btn @click="action1" icon>
              <v-icon>mdi-home</v-icon>
            </v-btn>
          </v-col>
          <v-col class="text-center" cols="2">
            <v-btn @click="action2" icon>
              <v-icon>mdi-magnify</v-icon>
            </v-btn>
          </v-col>
          <v-col class="text-center" cols="2">
            <v-btn @click="action3" icon>
              <v-icon>mdi-plus-circle</v-icon>
            </v-btn>
          </v-col>
          <v-col class="text-center" cols="2">
            <v-btn @click="action4" icon>
              <v-icon>mdi-heart</v-icon>
            </v-btn>
          </v-col>
          <v-col class="text-center" cols="2">
            <v-btn @click="action5" icon>
              <v-icon>mdi-account</v-icon>
            </v-btn>
          </v-col>
        </v-row>
      </v-bottom-navigation>

      <!-- Exibe o conteúdo da rota -->
      <router-view :style="{ 'background-image': 'url(' + $assetsBucket + '/backgrounds/backgrounds.png' +')' }"/>
    </v-main>

    <!-- Footer Section -->
    <v-footer class="footer black bg-black pb-12" padless>
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
    </v-footer>
  </v-app>
</template>
<script setup lang="ts">
import { ref } from "vue";

const theme = ref("myCustomTheme");
// Controle de visibilidade do menu de navegação inferior
const bottomNavVisible = ref(true);

// Função de controle de rolagem para mostrar/ocultar o menu de navegação inferior
function handleScroll() {
  bottomNavVisible.value = window.scrollY <= 100; // Ajuste conforme necessário
}

const toggleTheme = () => {
  theme.value = theme.value == "dark" ? "myCustomTheme" : "dark";
};

// Métodos de ação para os botões da navegação
const action1 = () => {
  console.log("Home button clicked");
  // Adicione a lógica específica para essa ação
};

const action2 = () => {
  console.log("Search button clicked");
  // Adicione a lógica específica para essa ação
};

const action3 = () => {
  console.log("Add button clicked");
  // Adicione a lógica específica para essa ação
};

const action4 = () => {
  console.log("Favorites button clicked");
  // Adicione a lógica específica para essa ação
};

const action5 = () => {
  console.log("Account button clicked");
  // Adicione a lógica específica para essa ação
};
</script>
<style>
.v-row {
  width: 100%;
}
</style>
