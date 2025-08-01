<template>
  <v-container max-width="800" style="min-width: 360px" class="d-md-none pa-4">
    <v-card
      color="primary"
      rounded="lg"
      elevation="3"
      class="mx-auto py-4 px-6 d-flex justify-center"
    >
      <v-row
        justify="space-between"
        align="center"
        class="py-2"
        style="max-width: 800px"
      >
        <template v-if="user?.roles_fk === 2">
          <template
            v-for="(button, i) in usermobilebuttons"
            :key="button.value"
          >
            <v-btn
              :icon="button.icon"
              @click="
                button.value === 'logout' ? logOut() : navigateTo(button.route)
              "
            >
            </v-btn>
            <v-divider
              v-if="i % 2 === 0 && i !== usermobilebuttons.length - 1"
              vertical
            ></v-divider>
          </template>
        </template>

        <template v-else-if="user?.roles_fk === 3">
          <template
            v-for="(button, i) in retailmobilebuttons"
            :key="button.value"
          >
            <v-btn
              :icon="button.icon"
              @click="
                button.value === 'logout' ? logOut() : navigateTo(button.route)
              "
            >
            </v-btn>
            <v-divider
              v-if="i % 3 === 0 && i !== retailmobilebuttons.length - 1"
              vertical
            ></v-divider>
          </template>
        </template>
      </v-row>
    </v-card>
  </v-container>

  <v-container
    max-width="800"
    style="min-width: 360px"
    class="d-none d-md-flex"
  >
    <v-card
      color="primary"
      rounded="lg"
      elevation="3"
      class="mx-auto py-4 px-6 d-flex justify-center"
    >
      <v-row
        justify="space-between"
        align="center"
        class="py-2"
        style="max-width: 800px"
      >
        <template v-if="user?.roles_fk === 2">
          <template v-for="(button, index) in userbuttons" :key="index">
            <v-btn class="mx-1" rounded @click="navigateTo(button.route)">
              <v-icon style="font-size: 24px">{{ button.icon }}</v-icon>
              <span> {{ button.text }} </span>
            </v-btn>
          </template>
        </template>

        <template v-else-if="user?.roles_fk === 3">
          <template v-for="(button, index) in retailbuttons" :key="index">
            <v-btn class="mx-1" rounded @click="navigateTo(button.route)">
              <v-icon style="font-size: 24px">{{ button.icon }}</v-icon>
              <span> {{ button.text }} </span>
            </v-btn>
          </template>
        </template>
      </v-row>
    </v-card>
  </v-container>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "@/store/UserStore";

const user = useUserStore().user;
const router = useRouter();

const activeButton = ref<string | null>(null);

const retailbuttons = ref([
  {
    icon: "mdi-account",
    value: "PerfilHome",
    route: "/profile/home",
    text: "profile",
  },
  {
    icon: "mdi-store",
    value: "store",
    route: "/profile/store-settings",
    text: "stores",
  },
  {
    icon: "mdi-magnify",
    value: "search",
    route: "/profile/friend-store",
    text: "search users",
  },
  {
    icon: "mdi-account-group",
    value: "group",
    route: "/profile/friend-storelist",
    text: "friends",
  },
  {
    icon: "mdi-cog-outline",
    value: "settings",
    route: "/profile/settings",
    text: "settings",
  },
]);

const usermobilebuttons = ref([
  {
    icon: "mdi-account",
    value: "PerfilHome",
    route: "/profile/home",
    text: "profile",
  },
  {
    icon: "mdi-magnify",
    value: "search",
    route: "/profile/friend-store",
    text: "search users",
  },
  {
    icon: "mdi-account-group",
    value: "group",
    route: "/profile/friend-storelist",
    text: "friends",
  },
  {
    icon: "mdi-cog-outline",
    value: "settings",
    route: "/profile/settings",
    text: "settings",
  },
  { icon: "mdi-logout", value: "logout", route: "/login", text: "logout" },
]);

const retailmobilebuttons = ref([
  {
    icon: "mdi-account",
    value: "PerfilHome",
    route: "/profile/home",
    text: "profile",
  },
  {
    icon: "mdi-store",
    value: "store",
    route: "/profile/store-settings",
    text: "stores",
  },
  {
    icon: "mdi-magnify",
    value: "search",
    route: "/profile/friend-store",
    text: "search users",
  },
  {
    icon: "mdi-account-group",
    value: "group",
    route: "/profile/friend-storelist",
    text: "friends",
  },
  {
    icon: "mdi-cog-outline",
    value: "settings",
    route: "/profile/settings",
    text: "settings",
  },
  { icon: "mdi-logout", value: "logout", route: "/login", text: "logout" },
]);

const userbuttons = ref([
  {
    icon: "mdi-account",
    value: "PerfilHome",
    route: "/profile/home",
    text: "profile",
  },
  {
    icon: "mdi-magnify",
    value: "search",
    route: "/profile/friend-store",
    text: "search users",
  },
  {
    icon: "mdi-account-group",
    value: "group",
    route: "/profile/friend-storelist",
    text: "friends",
  },
  {
    icon: "mdi-cog-outline",
    value: "settings",
    route: "/profile/settings",
    text: "settings",
  },
]);

const navigateTo = (route: string) => {
  router.push(route);
};

const logOut = () => {
  localStorage.removeItem("accessToken");
  router.push({ name: "Login" });
};
</script>
