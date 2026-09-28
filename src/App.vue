<template>
  <v-app :theme="theme">
    <Toast />

    <v-row no-gutters v-if="mdAndUp && showDesktopAppBar">
      <v-app-bar app height="44" flat class="top-bar">
        <div class="top-bar__inner">
          <div class="top-bar__brand" @click="$router.push({ name: 'Dashboard' })">
            <v-img src="@/assets/darknessl.png" height="22" width="22" alt="" contain />
            <span>DRUNAGOR APP</span>
          </div>

          <v-spacer />

          <v-btn
            v-if="isPublicRoute"
            color="white"
            variant="outlined"
            size="small"
            @click="$router.push({ name: 'Login', query: { tab: 'signup' } })"
          >
            Sign up
          </v-btn>

          <template v-else>
            <v-menu location="bottom end" offset="8">
              <template v-slot:activator="{ props }">
                <v-btn v-bind="props" icon variant="text" size="small" title="Profile">
                  <v-avatar size="28">
                    <v-img
                      :src="
                        user.picture_hash
                          ? assets + '/Profile/' + user.picture_hash
                          : assets + '/Profile/user.png'
                      "
                    />
                  </v-avatar>
                </v-btn>
              </template>
              <v-list min-width="200">
                <v-list-item :title="user.user_name || 'User'" :subtitle="roleLabel" />
                <v-divider />
                <v-list-item prepend-icon="mdi-account" title="My Profile" @click="router.push({ name: 'PerfilHome' })" />
                <v-list-item prepend-icon="mdi-logout" title="Log Out" @click="logOut" />
              </v-list>
            </v-menu>

            <v-btn icon variant="text" size="small" title="Menu" @click="drawer = !drawer">
              <v-icon size="26">mdi-menu</v-icon>
            </v-btn>
          </template>
        </div>
      </v-app-bar>
    </v-row>

    <v-row
      no-gutters
      v-else-if="showMobileAppBar"
    >
      <v-app-bar app min-height="56" elevation="4" class="safe-pwa-top-bar top-bar--mobile">
        <!-- Dashboard: brand on the left. Other pages: just a back button. -->
        <div class="top-bar__inner top-bar__inner--mobile">
          <v-btn v-if="route.name !== 'Dashboard'" icon variant="text" title="Back" @click="handleBack">
            <v-icon size="26">mdi-arrow-left</v-icon>
          </v-btn>
          <div
            v-else
            class="top-bar__brand top-bar__brand--mobile"
            @click="$router.push({ name: 'Dashboard' })"
          >
            <v-img src="@/assets/darknessl.png" height="30" width="30" alt="" contain />
            <span>DRUNAGOR APP</span>
          </div>

          <v-spacer />

          <v-btn icon variant="text" title="Menu" @click="drawer = !drawer">
            <v-icon size="28">mdi-menu</v-icon>
          </v-btn>
        </div>
      </v-app-bar>
    </v-row>

    <v-navigation-drawer
      v-model="drawer"
      temporary
      location="right"
      width="280"
      class="app-drawer"
    >
      <v-list-item
        class="pa-4"
        style="cursor: pointer"
        @click="router.push({ name: 'PerfilHome' }); drawer = false;"
        :prepend-avatar="
          user.picture_hash
            ? assets + '/Profile/' + user.picture_hash
            : assets + '/Profile/user.png'
        "
        :title="user.user_name || 'User'"
        :subtitle="roleLabel"
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

    <!-- Fixed page background: covers the viewport instead of tiling, so no
         seams show on long pages (background-attachment: fixed fails on iOS). -->
    <div v-if="usesAppBackground" class="app-background" :style="{ backgroundImage: `url(${assets}/backgrounds/backgrounds.png)` }" />

    <router-view :style="contentStyle" :class="{ 'pt-5': mdAndUp && showDesktopAppBar }" />
  </v-app>
</template>

<script setup lang="ts">
import { ref, inject, computed, onMounted, onBeforeMount, watch } from "vue";
import { setToken } from "@/service/AccessToken";
import { useRouter, useRoute } from "vue-router";
import { useDisplay } from "vuetify";
import { useUserStore } from "@/store/UserStore";
import { useTutorialStore } from "@/store/TutorialStore";
import { CampaignStore } from "@/store/CampaignStore";
import VectorIcon from "@/assets/Vector.png";

const axios: any = inject("axios");
const openLink = (url) => {
  window.open(url, "_blank");
};

const userStore = useUserStore();
const tutorialStore = useTutorialStore();
const campaignStore = CampaignStore();
const user = computed(() => userStore.user);

const { mdAndUp } = useDisplay();

const router = useRouter();
const route = useRoute();

const campaign = computed(() => {
  if (route.name === 'Campaign' && route.params.id) {
    return campaignStore.findOptional(String(route.params.id));
  }
  return null;
});

const isImmersiveMode = computed(() => {
  if (!campaign.value) return false;
  if (campaign.value.campaign === 'underkeep2') return true;
  const wing = (campaign.value.wing || "").toUpperCase();
  return wing.includes("WING 1") || wing.includes("WING 2") || wing.includes("WING 01") || wing.includes("WING 02") || wing.includes("TUTORIAL");
});

const showMobileAppBar = computed(() => {
  return (
    route.name !== 'Home' &&
    route.name !== 'Login' &&
    route.name !== 'RetailerRegistration' &&
    route.name !== 'Gama' &&
    route.name !== 'Community' &&
    route.name !== 'Lobby' &&
    route.name !== 'RetailerTutorial' &&
    route.name !== 'BoxAssemblyGuide' &&
    route.name !== 'NightsCommunication' &&
    (route.name !== 'Campaign' || !isImmersiveMode.value)
  );
});

const showDesktopAppBar = computed(() => {
  return (
    route.name !== 'BoxAssemblyGuide' &&
    (route.name !== 'Campaign' || !isImmersiveMode.value)
  );
});

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

const handleBack = () => {
  if (
    route.name === "Campaign" || 
    (route.path && route.path.includes("/campaign-tracker/campaign/"))
  ) {
    router.push({ name: "Campaign Overview" });
  } else if (route.name === "SupportDashboard") {
    router.push({ name: "Dashboard" });
  } else {
    router.back();
  }
};

const role = computed(() => userStore.user?.roles_fk || 2);
const roleLabel = computed(() =>
  role.value === 3 ? "Retailer" : role.value === 4 ? "Support" : role.value === 1 ? "Admin" : "Player",
);

// Public pages show a Sign up button instead of the profile and menu.
const PUBLIC_ROUTES = [
  "Home",
  "Login",
  "Gama",
  "Community",
  "RetailerRegistration",
  "ForgotPassword",
  "ShareEvent",
  "RetailerTutorial",
  "BoxAssemblyGuide",
  "NightsCommunication",
];
const isPublicRoute = computed(() => PUBLIC_ROUTES.includes(String(route.name)));

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
    ...(role.value === 1 || role.value === 4 ? [
      {
        title: "Support & Analytics",
        icon: "mdi-storefront",
        to: { name: "SupportDashboard" },
        disabled: false,
      }
    ] : []),
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
    return mdAndUp.value
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
          "background-position": "top center",
          "background-repeat": "no-repeat",
          "min-height": "100vh",
          width: "100%",
        };
  }

  const isImmersive = route.name === 'Campaign' && isImmersiveMode.value;

  // The page background itself is the fixed .app-background layer.
  return mdAndUp.value
    ? {
        position: "relative",
        "z-index": 1,
        "padding-top": isImmersive ? "0px" : "65px",
        "min-height": "100vh",
      }
    : {
        position: "relative",
        "z-index": 1,
        "padding-top": "env(safe-area-inset-top, 0px)",
        "min-height": "100vh",
      };
});

const usesAppBackground = computed(
  () => !["Login", "RetailerRegistration", "ForgotPassword"].includes(String(route.name)),
);

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

.app-background {
  position: fixed;
  inset: 0;
  z-index: 0;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  pointer-events: none;
}
/* Top bars follow the active theme. */
.top-bar {
  background: rgb(var(--v-theme-background)) !important;
  border-top: 3px solid rgb(var(--v-theme-primary));
  border-bottom: 1px solid rgba(var(--v-theme-on-surface), 0.08);
}
.top-bar--mobile {
  background: rgb(var(--v-theme-background)) !important;
  border-top: 3px solid rgb(var(--v-theme-primary));
  border-bottom: 1px solid rgba(var(--v-theme-on-surface), 0.08);
}
.top-bar__inner--mobile {
  position: relative;
  padding: 0 4px;
}
.top-bar__brand--mobile {
  padding-left: 8px;
  font-size: 1.1rem;
}
/* On mobile the side menu covers the full height, top bar included. */
@media (max-width: 959px) {
  .app-drawer.v-navigation-drawer {
    top: 0 !important;
    height: 100% !important;
    z-index: 2000 !important;
    padding-top: env(safe-area-inset-top, 0px);
  }
}
.top-bar .v-toolbar__content {
  justify-content: center;
}
.top-bar__inner {
  display: flex;
  align-items: center;
  gap: 4px;
  width: 100%;
  max-width: 1080px;
  padding: 0 16px;
}
.top-bar__brand {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  font-family: "Poppins", sans-serif;
  font-weight: 700;
  font-size: 0.9rem;
  letter-spacing: 0.5px;
  color: #fff;
}
/* On desktop the side menu stays a full-height side drawer, but reaches
   from the window edge to the hamburger button (40px wide, 16px inside the
   1080px content width), never narrower than its default 280px. */
@media (min-width: 960px) {
  .app-drawer.v-navigation-drawer {
    width: max(280px, calc((100% - 1080px) / 2 + 56px)) !important;
  }
  /* Vuetify hides it by its default 280px width; hide by the real width. */
  .app-drawer.v-navigation-drawer:not(.v-navigation-drawer--active) {
    transform: translateX(110%) !important;
  }
}
.safe-pwa-top-bar {
  padding-top: env(safe-area-inset-top, 0px) !important;
  height: calc(56px + env(safe-area-inset-top, 0px)) !important;
}
</style>
