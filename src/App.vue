<template>
  <v-app :theme="theme">
    <Toast />

    <!-- Barra de Navegação Superior -->

    <v-row no-gutters v-if="display.mdAndUp">
      <v-app-bar app min-height="50" color="secundary">
        <div @click="$router.push({ name: 'Dashboard' })" style="cursor: pointer" class="d-flex align-center pl-6">
          <!-- Ícone Drunagor -->
          <v-img src="@/assets/darknessl.png" height="30" width="30" alt="Drunagor Icon" contain class="mr-2"></v-img>
          <span>App Drunagor</span>
        </div>

        <v-spacer></v-spacer>

        <!-- Avatar + Nome do Usuário + Menu Suspenso -->
        <v-menu open-on-hover offset-y>
          <v-list>
            <v-list-item @click="logout">
              <v-list-item-icon>
                <v-icon>mdi-logout</v-icon>
              </v-list-item-icon>
              <v-list-item-title>Log Out</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>

        <!-- Botão Sign Up (Aparece Apenas em Home, Login, Gama) -->
        <v-btn v-if="['Home', 'Login', 'Gama', 'Community'].includes(route.name)" color="WHITE" large
          @click="$router.push({ name: 'Community' })">
          Community
        </v-btn>

        <v-btn v-if="['Home', 'Login', 'Gama', 'Community'].includes(route.name)" color="WHITE" large
        @click="$router.push({ name: 'Login', query: { tab: 'signup' } })">
          Sign up
        </v-btn>

        <!-- Menu de Navegação Centralizado (Somente se NÃO for Home, Login e Gama) -->
        <div class="d-flex" v-else>
          <v-hover v-for="(item, index) in menuItems" :key="index">
            <template v-slot:default="{ isHovering, props }">
              <v-btn v-bind="props" color="secundary" :elevation="isHovering ? 10 : 0" :disabled="item.disabled"
                class="mx-2" @click="item.to ? router.push(item.to) : item.do()">
                {{ item.title }}
              </v-btn>
            </template>
          </v-hover>

          <v-menu open-on-hover offset-y>
            <template v-slot:activator="{ props }">
              <v-btn v-bind="props" text class="px-3">
                <span class="pr-1">{{ user.user_name }}</span>
                <v-avatar size="35" class="mr-2">
                  <v-img :src="user.picture_hash
                      ? assets + '/Profile/' + user.picture_hash
                      : assets + '/Profile/user.png'
                    " />
                </v-avatar>
                <v-icon right>mdi-chevron-down</v-icon>
              </v-btn>
            </template>

            <v-list>
              <v-list-item @click="logOut">
                <v-list-item-icon>
                  <v-icon>mdi-logout</v-icon>
                </v-list-item-icon>
                <v-list-item-title>Log Out</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </div>
      </v-app-bar>
    </v-row>

    <v-bottom-navigation v-else-if="
      route.name !== 'Home' &&
      route.name !== 'Login' &&
      route.name !== 'RetailerRegistration' &&
      route.name !== 'Gama' &&
      route.name !== 'Community'
    " app v-model="bottomNavVisible" class="hidden-md-and-up fixed bg-black text-white" elevation="10" dense>
      <v-row align="center" justify="space-between" no-gutters>
        <v-col v-for="(item, index) in menuItems" :key="index" link
          :class="{ 'v-list-item--active': selectedItem === item }" cols="2">
          <v-btn @click="router.push(item.to)" icon :disabled="item.disabled">
            <v-icon>{{ item.icon }}</v-icon>
          </v-btn>
        </v-col>
      </v-row>
    </v-bottom-navigation>

    <!-- Exibe o conteúdo da rota -->
    <router-view :style="contentStyle" />

    <!-- Footer Section -->
    <v-footer class="footer black bg-black pb-12" padless>
      <v-row justify="center" align="center" class="text-center">
        <v-col cols="12" sm="4">
          <v-img class="logocgs mx-auto" src="@/assets/cgs.png" max-width="92" alt="logo" />
        </v-col>

        <v-col cols="12" sm="4" class="d-flex flex-column info-footer text-center align-center">
          <h3 class="white--text">Join us on Discord</h3>
          <v-img class="mt-4" width="30" src="@/assets/discord-mark-white.svg" alt="Discord" style="cursor: pointer;"
            @click="openPopup('https://discord.gg/7STSkSe5')"></v-img>
        </v-col>

        <v-col cols="12" sm="4" class="text-center">
          <h3 class="white--text">Social medias</h3>
          <v-btn fab icon color="black" dark @click="openPopup('https://www.instagram.com/wearecreativegames/')">
            <v-icon color="white">mdi-instagram</v-icon>
          </v-btn>
          <v-btn fab icon color="black" dark @click="openPopup('https://www.facebook.com/wearecgs')">
            <v-icon color="white">mdi-facebook</v-icon>
          </v-btn>
          <v-btn fab icon color="black" dark @click="openPopup('https://www.youtube.com/@wearecgs')">
            <v-icon color="white">mdi-youtube</v-icon>
          </v-btn>
        </v-col>
      </v-row>
    </v-footer>
  </v-app>
</template>


<script setup lang="ts">
import { ref, inject, computed, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useDisplay } from "vuetify";
import { useUserStore } from "@/store/UserStore";

const userStore = useUserStore();
const user = userStore.user;

const display = ref(useDisplay());

const router = useRouter();
const route = useRoute();

const assets = inject<string>("assets");

const theme = ref("DarkTheme");
// Controle de visibilidade do menu de navegação inferior
const bottomNavVisible = ref(true);

const drawer = ref(false); // Controle do drawer lateral

const logOut = () => {
  localStorage.removeItem("accessToken");
  router.push({ name: "Login" });
};

// Itens do menu de navegação
const menuItems = computed(() => {
  const role = user?.roles_fk; // Obtém a role do usuário

  return [
    {
      title: role === 3 ? "Dashboard" : "Dashboard",
      icon: "mdi-view-dashboard",
      to: { name: "Dashboard" },
      disabled: false,
    },
    {
      title: role === 3 ? "CAMPAIGN MANAGER" : "Companion",
      icon: "mdi-flag",
      to: { name: "CampaignTracker" },
      disabled: false,
    },
    {
      title: role === 3 ? "SKUS MANAGER" : "Library",
      icon: "mdi-book",
      to: { name: "Library" },
      disabled: false,
    },
    {
      title: role === 3 ? "Profile" : "Profile",
      icon: "mdi-account",
      to: { name: "PerfilHome" },
      disabled: false,
    },
    {
      title: role === 3 ? "Events" : "Events",
      icon: "mdi-calendar",
      to: { name: "Events" },
      disabled: false,
    },
  ];
});

const contentStyle = computed(() => {
  return display.value.mdAndUp
    ? {
      "background-image":
        "url(" + assets + "/backgrounds/backgrounds.png" + ")",
      "background-repeat": "repeat",
      "margin-top": "65px",
    }
    : {
      "background-image":
        "url(" + assets + "/backgrounds/backgrounds.png" + ")",
      "background-repeat": "repeat-y",
    };
});

const openPopup = (url: string) => {
  window.open(url, '_blank', 'width=800,height=600,scrollbars=yes');
};

onMounted(() => {
  const loggedUser = localStorage.getItem("app_user");
  const userObject = loggedUser ? JSON.parse(loggedUser) : null;

  if (userObject) {
    useUserStore().setUser(userObject);
  }
});
</script>

<style>
.v-app {
  font-family: "Poppins", sans-serif !important;
}

.v-row {
  width: 100%;
}
</style>
