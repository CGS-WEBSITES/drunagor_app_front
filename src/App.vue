<template>
  <v-app :theme="theme">
    <Toast />
    <!-- Barra de Navegação Superior -->
    <v-navigation-drawer
      v-model="drawer"
      app
      location="right"
      temporary
      class="d-none d-md-flex m"
    >
      <v-list class="me-4">
        <v-list-item class="py-5">
          <v-row align="center" class="">
            <v-col cols="8">
              <v-list-item-title>Magoveio92magi</v-list-item-title>
              <v-list-item-subtitle>Points: 1337</v-list-item-subtitle>
            </v-col>

            <!-- Coluna para o avatar à direita -->
            <v-col cols="4" class="d-flex justify-end">
              <v-avatar size="100">
                <v-img
                  src="https://segredoquantico.com/wp-content/uploads/2023/07/o-arquetipo-do-mago.webp"
                  alt="Avatar"
                />
              </v-avatar>
            </v-col>
          </v-row>
        </v-list-item>

        <v-list-item
          v-for="(item, index) in menuItems"
          :key="index"
          link
          @click="selectItem(item)"
          :class="{ 'v-list-item--active': selectedItem === item }"
        >
          <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-row no-gutters>
      <v-app-bar app min-height="50" class="hidden-md-and-down" color="black">
        <div class="d-flex align-center pl-6">
          <!-- Ajuste o padding com pl-6 -->
          <v-img
            src="@/assets/darknessl.png"
            height="30"
            width="30"
            alt="Drunagor Icon"
            contain
            class="mr-2"
          ></v-img>
          <span>App Drunagor</span>
        </div>
        <v-spacer></v-spacer>
        <!-- Botão de Navegação alinhado à direita -->
        <v-app-bar-nav-icon
          class="me-4"
          @click="drawer = !drawer"
        ></v-app-bar-nav-icon>
      </v-app-bar>
    </v-row>

    <v-row
      no-gutters
      class="mt-9 py-8"
      :style="{
        'background-image':
          'url(' + assets + '/backgrounds/backgrounds.png' + ')',
        'background-repeat': 'repeat-y',
      }"
    >
      <!-- Exibe o conteúdo da rota -->
      <router-view />
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
import { ref, inject } from "vue";

const assets = inject<string>("assets");

const theme = ref("myCustomTheme");
// Controle de visibilidade do menu de navegação inferior
const bottomNavVisible = ref(true);

// Função de controle de rolagem para mostrar/ocultar o menu de navegação inferior
function handleScroll() {
  bottomNavVisible.value = window.scrollY <= 100; // Ajuste conforme necessário
}

const toggleTheme = () => {
  theme.value = theme.value === "dark" ? "myCustomTheme" : "dark";
};

// Controle de visibilidade de elementos reativos
const showPopup = ref(false);
const dialog = ref(false);
const drawer = ref(false); // Controle do drawer lateral

// Itens do menu de navegação
const menuItems = ref([
  { title: "Dashboard", icon: "mdi-view-dashboard", to: { name: "Dashboard" } },
  { title: "Campaign", icon: "mdi-flag", to: { name: "Campaign" } },
  { title: "Library", icon: "mdi-book", to: { name: "Library" } },
  { title: "Profile", icon: "mdi-account", to: { name: "Profile" } },
  { title: "Events", icon: "mdi-calendar", to: { name: "Events" } },
]);

// Métodos de ação para os botões da navegação
const action1 = () => console.log("Home button clicked");
const action2 = () => console.log("Search button clicked");
const action3 = () => console.log("Add button clicked");
const action4 = () => console.log("Favorites button clicked");
const action5 = () => console.log("Account button clicked");

// Função de navegação
const navigateTo = (route: any) => {
  if (route) router.push(route);
};

// Fechar diálogo
const closeDialog = () => {
  dialog.value = false;
};
</script>

<style>
.v-row {
  width: 100%;
}
</style>

