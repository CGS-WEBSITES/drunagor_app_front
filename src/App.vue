<template>
  <v-app :theme="theme">
    <Toast />

    <!-- Barra de Navegação Superior (Desktop - Mantido igual) -->
    <v-row no-gutters v-if="display.mdAndUp">
      <v-app-bar app min-height="50" color="secundary">
        <div
          @click="$router.push({ name: 'Dashboard' })"
          style="cursor: pointer"
          class="d-flex align-center pl-6"
        >
          <!-- Ícone Drunagor -->
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

        <v-btn
          v-if="
            [
              'Home',
              'Login',
              'Gama',
              'Community',
              'RetailerRegistration',
              'ForgotPassword',
              'ShareEvent',
            ].includes(route.name)
          "
          color="WHITE"
          large
          @click="$router.push({ name: 'Login', query: { tab: 'signup' } })"
        >
          Sign up
        </v-btn>

        <div class="d-flex w-100 align-center justify-space-between" v-else>
          <div class="d-flex justify-center w-100">
            <v-hover v-for="(item, index) in menuItems" :key="index">
              <template v-slot:default="{ isHovering, props }">
                <v-btn
                  v-bind="props"
                  color="secundary"
                  :elevation="isHovering ? 10 : 0"
                  :disabled="item.disabled"
                  class="mx-2"
                  @click="item.to ? router.push(item.to) : item.do()"
                >
                  {{ item.title }}
                </v-btn>
              </template>
            </v-hover>
          </div>

          <v-menu open-on-click offset-y>
            <template v-slot:activator="{ props }">
              <v-btn v-bind="props" text class="px-3">
                <span class="pr-1">{{ user.user_name }}</span>
                <v-avatar size="35" class="mr-2">
                  <v-img
                    :src="
                      user.picture_hash
                        ? assets + '/Profile/' + user.picture_hash
                        : assets + '/Profile/user.png'
                    "
                  />
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

    <!-- Mobile/Tablet - Barra Padrão -->
    <!-- ESCONDIDA se for a tela de detalhe da campanha (isCampaignDetail) -->
    <v-row
      no-gutters
      v-else-if="
        route.name !== 'Home' &&
        route.name !== 'Login' &&
        route.name !== 'RetailerRegistration' &&
        route.name !== 'Gama' &&
        route.name !== 'Community' &&
        !isCampaignDetail
      "
    >
      <v-app-bar app min-height="56" color="secundary" elevation="4">
        <!-- Menu Padrão Mobile (Logo + Hamburguer) -->
        <div class="d-flex align-center w-100">
          <div
            @click="$router.push({ name: 'Dashboard' })"
            style="cursor: pointer"
            class="d-flex align-center pl-4"
          >
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

          <!-- Botão Hamburguer -->
          <v-btn icon @click="drawer = !drawer" class="mr-2">
            <v-icon>mdi-menu</v-icon>
          </v-btn>
        </div>
      </v-app-bar>

      <!-- Navigation Drawer (Mantido igual) -->
      <v-navigation-drawer
        v-model="drawer"
        temporary
        location="right"
        width="280"
      >
        <v-list-item
          class="pa-4"
          :prepend-avatar="
            user.picture_hash
              ? assets + '/Profile/' + user.picture_hash
              : assets + '/Profile/user.png'
          "
          :title="user.user_name || 'User'"
          :subtitle="role === 3 ? 'Retailer' : 'Player'"
        >
        </v-list-item>

        <v-divider></v-divider>

        <v-list density="compact" nav>
          <v-list-item
            v-for="(item, index) in menuItems"
            :key="index"
            :disabled="item.disabled"
            @click="handleMenuClick(item)"
            :value="item.title"
            class="my-1"
          >
            <template v-slot:prepend>
              <div
                class="d-flex align-center"
                style="width: 24px; margin-right: 16px"
              >
                <v-img
                  v-if="item.iconImage"
                  :src="item.iconImage"
                  width="24"
                  height="24"
                  contain
                ></v-img>
                <v-icon v-else size="24">{{ item.icon }}</v-icon>
              </div>
            </template>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item>
        </v-list>

        <template v-slot:append>
          <div class="pa-2">
            <v-divider class="mb-2"></v-divider>
            <v-list-item @click="logOut" class="my-1">
              <template v-slot:prepend>
                <div
                  class="d-flex align-center"
                  style="width: 24px; margin-right: 16px"
                >
                  <v-icon size="24">mdi-logout</v-icon>
                </div>
              </template>
              <v-list-item-title>Log Out</v-list-item-title>
            </v-list-item>
          </div>
        </template>
      </v-navigation-drawer>
    </v-row>


    <!-- Exibe o conteúdo da rota -->
    <router-view :style="contentStyle" />

    <!-- Footer Section (Mantido igual) -->
    <v-footer
      v-if="['Login', 'RetailerRegistration', 'Home'].includes(route.name)"
      class="footer black bg-black pb-12"
      padless
    >
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
            alt="Discord"
            style="cursor: pointer"
            @click="openPopup('https://discord.gg/7STSkSe5')"
          ></v-img>
        </v-col>

        <v-col cols="12" sm="4" class="text-center">
          <h3 class="white--text">Social medias</h3>
          <v-btn
            fab
            icon
            color="black"
            dark
            @click="openPopup('https://www.instagram.com/wearecreativegames/')"
          >
            <v-icon color="white">mdi-instagram</v-icon>
          </v-btn>
          <v-btn
            fab
            icon
            color="black"
            dark
            @click="openPopup('https://www.facebook.com/wearecgs')"
          >
            <v-icon color="white">mdi-facebook</v-icon>
          </v-btn>
          <v-btn
            fab
            icon
            color="black"
            dark
            @click="openPopup('https://www.youtube.com/@wearecgs')"
          >
            <v-icon color="white">mdi-youtube</v-icon>
          </v-btn>
        </v-col>
      </v-row>
    </v-footer>
  </v-app>
</template>

<script setup lang="ts">
import { ref, inject, computed, onMounted, onBeforeMount, watch } from "vue";
import { setToken } from "@/service/AccessToken";
import { useRouter, useRoute } from "vue-router";
import { useDisplay } from "vuetify";
import { useUserStore } from "@/store/UserStore";
import themeIcon from "@/assets/theme.png";

// Import necessário para o MenuItems
import VectorIcon from "@/assets/Vector.png";

const axios: any = inject("axios");
const openLink = (url) => {
  window.open(url, "_blank");
};

const userStore = useUserStore();
const user = computed(() => userStore.user);

const display = ref(useDisplay());

const router = useRouter();
const route = useRoute();

const assets = inject<string>("assets");

const theme = ref("DarkTheme");
const themes = ["DarkTheme", "CoreTheme", "ApocTheme"];

const switchTheme = () => {
  const currentIndex = themes.indexOf(theme.value);
  theme.value = themes[(currentIndex + 1) % themes.length];
};

const drawer = ref(false);

const logOut = () => {
  localStorage.removeItem("accessToken");
  router.push({ name: "Login" });
};

const role = computed(() => userStore.user?.roles_fk || 2);

const menuItems = computed(() => {
  return [
    {
      title: role.value === 3 ? "Campaign Manager" : "Companion",
      iconImage: VectorIcon,
      to: { name: "Campaign Overview" },
      disabled: false,
    },
    {
      title: role.value === 3 ? "SKUs Manager" : "Library",
      icon: "mdi-book",
      to: { name: "Library" },
      disabled: false,
    },
    {
      title: "Dashboard",
      icon: "mdi-view-dashboard",
      to: { name: "Dashboard" },
      disabled: false,
    },
    {
      title: "Events",
      icon: "mdi-calendar",
      to: { name: "Events" },
      disabled: false,
    },
    {
      title: "My Profile",
      icon: "mdi-account",
      to: { name: "PerfilHome" },
      disabled: false,
    },
  ];
});

const handleMenuClick = (item) => {
  if (item.to) {
    router.push(item.to);
    drawer.value = false; // Fecha o drawer após navegar
  } else if (item.do) {
    item.do();
    drawer.value = false;
  }
};

watch(
  () => userStore.user?.roles_fk,
  (newRole) => {
    console.log("Role atualizada:", newRole);
  },
  { immediate: true },
);

// Nova computed property para detectar tela de campanha
const isCampaignDetail = computed(() => {
  return route.path.includes("/campaign-tracker/campaign/") && !!route.params.id;
});

const contentStyle = computed(() => {
  const isMobile = !display.value.mdAndUp;

  if (
    route.name === "Login" ||
    route.name === "RetailerRegistration" ||
    route.name === "ForgotPassword"
  ) {
    return !isMobile
      ? {
          "background-image":
            "url('https://s3.us-east-2.amazonaws.com/assets.drunagor.app/backgrounds/bg-login.webp')",
          "background-size": "cover",
          "background-position": "top center",
          "background-repeat": "no-repeat",
          "min-height": "100vh",
          width: "100%",
          "margin-top": "65px",
          display: "flex",
          "align-items": "center",
          "justify-content": "center",
        }
      : {
          "background-image":
            "url('https://assets.drunagor.app/backgrounds/mblogin-background.png')",
          "background-size": "cover",
          "background-position": "center",
          "background-repeat": "no-repeat",
          "min-height": "100vh",
          width: "100%",
        };
  }

  // Se for mobile e tela de campanha, remove a margem superior para aproveitar espaço
  if (isMobile && isCampaignDetail.value) {
    return {
      "background-image":
        "url(" + assets + "/backgrounds/backgrounds.png" + ")",
      "background-repeat": "repeat-y",
      "margin-top": "0px", // Remove margem da barra
    };
  }

  return !isMobile
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
        "margin-top": "56px",
      };
});

const openPopup = (url: string) => {
  window.open(url, "_blank", "width=800,height=600,scrollbars=yes");
};

onMounted(() => {
  const loggedUser = localStorage.getItem("app_user");
  const userObject = loggedUser ? JSON.parse(loggedUser) : null;

  if (userObject) {
    useUserStore().setUser(userObject);
  }
});

onBeforeMount(() => {
  const token = localStorage.getItem("accessToken");

  if (token) {
    setToken(token);

    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
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