<template>
  <v-app :theme="theme">
    <Toast />

    <v-row no-gutters v-if="display.mdAndUp && route.name !== 'Campaign'">
      <v-app-bar app min-height="50" color="secundary">
        <div
          @click="$router.push({ name: 'Dashboard' })"
          style="cursor: pointer"
          class="d-flex align-center pl-6"
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
              <v-btn v-bind="props" icon class="mr-2" variant="text" style="min-width: 48px; width: 48px; height: 48px;">
                <div v-if="currentThemeObj" class="d-flex" style="width: 24px; height: 24px; border-radius: 50%; overflow: hidden; border: 2px solid rgba(255,255,255,0.8);">
                  <div :style="{ backgroundColor: currentThemeObj.bg }" style="width: 50%; height: 100%;"></div>
                  <div :style="{ backgroundColor: currentThemeObj.primary }" style="width: 50%; height: 100%;"></div>
                </div>
                <v-img v-else :src="themeIcon" max-height="24" max-width="24" contain></v-img>
              </v-btn>
            </template>
            <v-list class="bg-grey-darken-4 pa-2" min-width="220" rounded="lg">
              <v-list-item
                v-for="t in themesList"
                :key="t.name"
                @click="selectTheme(t.name)"
                :active="theme === t.name"
                class="rounded-lg my-1"
              >
                <template v-slot:prepend>
                  <div class="d-flex mr-3" style="width: 24px; height: 24px; border-radius: 50%; overflow: hidden; border: 1px solid rgba(255,255,255,0.3);">
                    <div :style="{ backgroundColor: t.bg }" style="width: 50%; height: 100%;"></div>
                    <div :style="{ backgroundColor: t.primary }" style="width: 50%; height: 100%;"></div>
                  </div>
                </template>
                <v-list-item-title class="text-white font-weight-medium">{{ t.label }}</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>

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

    <v-row
      no-gutters
      v-else-if="
        route.name !== 'Home' &&
        route.name !== 'Login' &&
        route.name !== 'RetailerRegistration' &&
        route.name !== 'Gama' &&
        route.name !== 'Community' &&
        route.name !== 'Lobby' &&
        route.name !== 'Campaign'
      "
    >
      <v-app-bar app min-height="56" color="secundary" elevation="4">
        <div
          v-if="route.name === 'Dashboard'"
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

        <v-btn v-else icon @click="$router.back()" class="mr-2">
          <v-icon>mdi-arrow-left</v-icon>
        </v-btn>

        <v-spacer></v-spacer>

        <v-btn icon @click="drawer = !drawer" class="mr-2">
          <v-icon>mdi-menu</v-icon>
        </v-btn>
      </v-app-bar>

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

        <v-divider></v-divider>
        <div class="px-4 py-2 text-overline text-grey-lighten-1">THEMES</div>
        <v-list density="compact" nav class="px-2">
          <v-list-item
            v-for="t in themesList"
            :key="t.name"
            @click="selectTheme(t.name)"
            :active="theme === t.name"
            class="my-1 rounded-lg"
          >
            <template v-slot:prepend>
              <div class="d-flex mr-3" style="width: 20px; height: 20px; border-radius: 50%; overflow: hidden; border: 1px solid rgba(255,255,255,0.3);">
                <div :style="{ backgroundColor: t.bg }" style="width: 50%; height: 100%;"></div>
                <div :style="{ backgroundColor: t.primary }" style="width: 50%; height: 100%;"></div>
              </div>
            </template>
            <v-list-item-title class="text-white text-body-2">{{ t.label }}</v-list-item-title>
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

    <router-view :style="contentStyle" :class="{ 'pt-10': display.mdAndUp }" />
  </v-app>
</template>

<script setup lang="ts">
import { ref, inject, computed, onMounted, onBeforeMount, watch } from "vue";
import { setToken } from "@/service/AccessToken";
import { useRouter, useRoute } from "vue-router";
import { useDisplay } from "vuetify";
import { useUserStore } from "@/store/UserStore";
import { useTutorialStore } from "@/store/TutorialStore";
import themeIcon from "@/assets/theme.png";
import VectorIcon from "@/assets/Vector.png";

const axios: any = inject("axios");
const openLink = (url) => {
  window.open(url, "_blank");
};

const userStore = useUserStore();
const tutorialStore = useTutorialStore();
const user = computed(() => userStore.user);

const display = ref(useDisplay());

const router = useRouter();
const route = useRoute();

const assets = inject<string>("assets");

const theme = ref(localStorage.getItem("appTheme") || "DarkTheme");
const themesList = [
  { name: "DarkTheme", label: "Dark", primary: "#363636", bg: "#141414" },
  { name: "CoreTheme", label: "Age of Darkness", primary: "#3C7376", bg: "#172A2C" },
  { name: "ApocTheme", label: "Apocalypse", primary: "#802222", bg: "#141414" },
  { name: "NightsTheme", label: "Purple", primary: "#5D3C76", bg: "#22162C" },
  { name: "EarthTheme", label: "Earth", primary: "#804F22", bg: "#3C2510" },
  { name: "BlueTheme", label: "Blue", primary: "#224780", bg: "#102139" },
  { name: "CrimsonTheme", label: "Crimson", primary: "#802222", bg: "#421111" },
  { name: "VioletTheme", label: "Violet", primary: "#622280", bg: "#2A0F36" },
  { name: "RoseTheme", label: "Rose", primary: "#763C3C", bg: "#392020" }
];

const currentThemeObj = computed(() => {
  return themesList.find(t => t.name === theme.value);
});

const selectTheme = (themeName: string) => {
  theme.value = themeName;
  localStorage.setItem("appTheme", themeName);
};

const drawer = ref(false);

const logOut = () => {
  userStore.clearUser();
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
      title: "Heroes",
      icon: "mdi-shield-sword",
      to: { name: "HeroesManager" },
      disabled: false,
    },
    // ALTERAÇÃO 2: Novo item adicionado
    {
      title: "Community Builds",
      icon: "mdi-hammer-wrench",
      to: { name: "CommunityBuilds" },
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
    drawer.value = false;
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

const contentStyle = computed(() => {
  if (
    route.name === "Login" ||
    route.name === "RetailerRegistration" ||
    route.name === "ForgotPassword"
  ) {
    return display.value.mdAndUp
      ? {
          "background-image":
            "url('https://s3.us-east-2.amazonaws.com/assets.drunagor.app/backgrounds/bg-login.webp')",
          "background-size": "cover",
          "background-position": "top center",
          "background-repeat": "no-repeat",
          "min-height": "100vh",
          width: "100%",
          "padding-top": "65px",
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

  return display.value.mdAndUp
    ? {
        "background-image":
          "url(" + assets + "/backgrounds/backgrounds.png" + ")",
        "background-repeat": "repeat",
        "padding-top": "65px",
      }
    : {
        "background-image":
          "url(" + assets + "/backgrounds/backgrounds.png" + ")",
        "background-repeat": "repeat-y",
        "padding-top": "env(safe-area-inset-top, 0px)",
      };
});

const openPopup = (url: string) => {
  window.open(url, "_blank", "width=800,height=600,scrollbars=yes");
};

onMounted(() => {
  userStore.restoreFromStorage();
  tutorialStore.loadPreferences();
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
