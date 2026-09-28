<template>
  <v-row no-gutters>
    <ProfileCard />

    <!-- Profile sections render in place as tabs. The URL still follows the
         tab (/profile/settings...) so existing links keep working. -->
    <v-col v-if="activeTab" cols="12">
      <div class="profile-tabs-wrapper">
        <nav class="profile-tabs">
          <button
            v-for="tab in tabs"
            :key="tab.path"
            class="profile-tabs__item"
            :class="{ active: activeTab === tab.path }"
            @click="selectTab(tab.path)"
          >
            <v-icon size="20">{{ tab.icon }}</v-icon>
            <span>{{ tab.label }}</span>
          </button>
        </nav>
      </div>

      <v-window :model-value="activeTab" class="profile-window">
        <v-window-item v-for="tab in tabs" :key="tab.path" :value="tab.path">
          <component :is="tab.component" />
        </v-window-item>
      </v-window>
    </v-col>

    <!-- Pages outside the tabs, like the profile editor. -->
    <v-col v-else cols="12">
      <router-view />
    </v-col>
  </v-row>
</template>

<script lang="ts" setup>
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useUserStore } from "@/store/UserStore";
import ProfileCard from "@/components/ProfileCard.vue";
import PerfilHome from "@/components/PerfilHome.vue";
import StoreSettings from "@/components/StoreSettings.vue";
import FriendStoreList from "@/components/FriendStoreList.vue";
import PerfilSettings from "@/components/PerfilSettings.vue";

const route = useRoute();
const router = useRouter();
const userStore = useUserStore();

const tabs = computed(() => [
  { path: "/profile/home", label: "Profile", icon: "mdi-account", component: PerfilHome },
  ...(userStore.user?.roles_fk === 3
    ? [{ path: "/profile/store-settings", label: "Stores", icon: "mdi-store", component: StoreSettings }]
    : []),
  { path: "/profile/friend-storelist", label: "Friends", icon: "mdi-account-group", component: FriendStoreList },
  { path: "/profile/settings", label: "Settings", icon: "mdi-cog-outline", component: PerfilSettings },
]);

const activeTab = computed(() => tabs.value.find((tab) => tab.path === route.path)?.path ?? null);

// Switch tabs without stacking history entries for each click.
const selectTab = (path: string) => router.replace(path);
</script>

<style scoped>
.profile-tabs-wrapper {
  max-width: 800px;
  margin: 16px auto;
  padding: 0 16px;
}
.profile-tabs {
  display: flex;
  gap: 6px;
  padding: 6px;
  background: rgb(var(--v-theme-primary));
  border-radius: 12px;
}
.profile-tabs__item {
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 10px 8px;
  border-radius: 8px;
  color: rgb(var(--v-theme-on-surface));
  font-family: "Poppins", sans-serif;
  font-size: 0.85rem;
  font-weight: 700;
  text-transform: uppercase;
  opacity: 0.75;
  transition: background 0.2s ease, opacity 0.2s ease;
}
.profile-tabs__item:hover {
  opacity: 1;
}
.profile-tabs__item.active {
  background: rgb(var(--v-theme-secondary));
  opacity: 1;
}
.profile-window {
  overflow: visible;
}
@media (max-width: 599px) {
  .profile-tabs__item {
    flex-direction: column;
    gap: 2px;
    font-size: 0.68rem;
  }
}
</style>
