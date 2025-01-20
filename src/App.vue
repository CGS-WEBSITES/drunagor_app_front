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
              <v-list-item-title>{{ user.user_name }}</v-list-item-title>
              <!-- <v-list-item-subtitle>Points: 1337</v-list-item-subtitle> -->
            </v-col>

            <!-- Coluna para o avatar à direita -->
            <v-col cols="4" class="d-flex justify-end">
              <v-avatar size="70">
                <v-img
                  :src="
                    user.picture_hash
                      ? assets + '/Profile/' + user.picture_hash
                      : assets + '/Profile/user.png'
                  "
                />
              </v-avatar>
            </v-col>
          </v-row>
        </v-list-item>

        <v-list-item
          v-for="(item, index) in menuItems"
          :key="index"
          link
          :disabled="item.disabled"
          @click="item.to ? router.push(item.to): item.do()"
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

    <v-row no-gutters v-if="display.mdAndUp">
      <v-app-bar app min-height="50" color="primary">
        <div class="d-flex align-center pl-6">
          <!-- Ajuste o padding com pl-6 -->
          <v-img
            src="@/assets/darknessl.png"
            height="30"
            width="30"
            alt="Drunagor Icon"
            contain
            class="mr-2"
            @click="$router.push({ name: 'Dashboard' })"
          ></v-img>
          <span>App Drunagor</span>
        </div>
        <v-spacer></v-spacer>
        <!-- Botão de Navegação alinhado à direita -->

        <v-btn
          v-if="route.name === 'Home' || route.name === 'Login'"
          color="#B8860B"
          large
          @click="$router.push({ name: 'Login' })"
          >Sign up</v-btn
        >

        <v-app-bar-nav-icon
          v-else
          class="me-4"
          @click="drawer = !drawer"
        ></v-app-bar-nav-icon>
      </v-app-bar>
    </v-row>

    <v-bottom-navigation
      v-else-if="route.name != 'Home' && route.name != 'Login'"
      app
      v-model="bottomNavVisible"
      class="hidden-md-and-up fixed bg-black text-white"
      elevation="10"
      dense
    >
      <v-row align="center" justify="space-between" no-gutters>
        <v-col
          v-for="(item, index) in menuItems"
          :key="index"
          link
          :class="{ 'v-list-item--active': selectedItem === item }"
          cols="2"
        >
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
          <v-img
            class="logocgs mx-auto"
            src="@/assets/cgs.png"
            max-width="92"
            alt="logo"
          />
        </v-col>

        <v-col
          cols="12"
          sm="4"
          class="d-flex flex-column info-footer text-center align-center"
        >
          <h3 class="white--text">Join us on Discord</h3>
          <v-img
            class="mt-4"
            width="30"
            src="@/assets/discord-mark-white.svg"
          ></v-img>
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
import { ref, inject, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useDisplay } from "vuetify";
import { useUserStore } from "@/store/UserStore";

const user = useUserStore().user;

const display = ref(useDisplay());

const router = useRouter();
const route = useRoute();

const assets = inject<string>("assets");

const theme = ref("myCustomTheme");
// Controle de visibilidade do menu de navegação inferior
const bottomNavVisible = ref(true);

const drawer = ref(false); // Controle do drawer lateral

const logOut = () => {
  localStorage.removeItem("accessToken");
  router.push({ name: "Login" });
};

// Itens do menu de navegação
const menuItems = ref([
  {
    title: "Dashboard",
    icon: "mdi-view-dashboard",
    to: { name: "Dashboard" },
    disabled: false,
  },
  {
    title: "Companion",
    icon: "mdi-flag",
    to: { name: "CampaignTracker", disabled: false },
  },
  {
    title: "Library",
    icon: "mdi-book",
    to: { name: "Library" },
    disabled: false,
  },
  {
    title: "Profile",
    icon: "mdi-account",
    to: { name: "PerfilHome" },
    disabled: false,
  },

  {
    title: "Events",
    icon: "mdi-calendar",
    to: { name: "Events" },
    disabled: true,
  },

  {
    title: "Logout",
    icon: "mdi-logout",
    disabled: false,
    do: logOut,
  },
]);

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


</script>

<style>

.v-app {
  font-family: 'Poppins', sans-serif !important;
}

.v-row {
  width: 100%;
}
</style>
