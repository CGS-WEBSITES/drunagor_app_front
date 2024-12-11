<template>
  <v-app theme="dark">
    <!-- Barra de Navegação Superior -->
    <v-navigation-drawer
      v-model="drawer"
      app
      location="right"
      temporary
      class="d-none d-md-flex m"
    >
      <v-list class="me-4">
        <!-- Substitui "margin-right" -->
        <v-list-item class="py-5">
          <!-- Substitui "height: 114px" -->
          <v-row align="center" class="">
            <!-- Coluna para o texto à esquerda -->
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
    <v-row no-gutters>
      <router-view />
    </v-row>
    <!-- Toolbar (Barra de Topo) -->

    <!-- Conteúdo Principal -->



    <!-- Navegação Inferior Fixa (Mobile) -->
    <v-bottom-navigation
      app
      v-model="bottomNavVisible"
      class="hidden-md-and-up fixed bg-black text-white"
      elevation="10"
      style="width: 100%; max-width: 100vw; padding: 0; overflow: hidden"
    >
      <v-btn
        @click="navigateTo('Dashboard')"
        class="pa-0 flex-grow-1"
        min-width="0"
      >
        <v-icon>mdi-home</v-icon>
      </v-btn>
      <v-btn
        @click="navigateTo('Search')"
        class="pa-0 flex-grow-1"
        min-width="0"
      >
        <v-icon>mdi-magnify</v-icon>
      </v-btn>
      <v-btn @click="navigateTo('Add')" class="pa-0 flex-grow-1" min-width="0">
        <v-icon>mdi-plus-circle</v-icon>
      </v-btn>
      <v-btn
        @click="navigateTo('Favorites')"
        class="pa-0 flex-grow-1"
        min-width="0"
      >
        <v-icon>mdi-heart</v-icon>
      </v-btn>
      <v-btn
        @click="navigateTo('Profile')"
        class="pa-0 flex-grow-1"
        min-width="0"
      >
        <v-icon>mdi-account</v-icon>
      </v-btn>
    </v-bottom-navigation>

    <!-- Rodapé -->
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

<script setup>
import { ref, onMounted, onUnmounted } from "vue";

// Controle de visibilidade do menu de navegação inferior
const bottomNavVisible = ref(true);

// Função de controle de rolagem para mostrar/ocultar o menu de navegação inferior
function handleScroll() {
  bottomNavVisible.value = window.scrollY <= 100; // Ajuste conforme necessário
}

// Configurações de evento para rolagem
onMounted(() => {
  window.addEventListener("scroll", handleScroll);
  isMobile.value = window.innerWidth <= 600;
  window.addEventListener("resize", () => {
    isMobile.value = window.innerWidth <= 600;
  });
});

onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll);
});

// Verificação de mobile
const isMobile = ref(false);

// Variáveis reativas
const showPopup = ref(false);
const dialog = ref(false);
const drawer = ref(false); // Controle do drawer lateral

// Itens do menu de navegação
const menuItems = ref([
  { title: "Dashboard", icon: "mdi-view-dashboard" },
  { title: "Campaign", icon: "mdi-flag" },
  { title: "Library", icon: "mdi-book" },
  { title: "Profile", icon: "mdi-account" },
  { title: "Events", icon: "mdi-calendar" },
]);

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

const closeDialog = () => {
  dialog.value = false;
};
</script>
<style scoped>
</style>