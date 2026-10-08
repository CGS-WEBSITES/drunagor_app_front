<template>
  <div>
    <!-- Renderiza o Dashboard correto com base em roles_fk -->
    <template v-if="user?.roles_fk === 2 || user?.roles_fk === 1">
      <!-- PC and large tablets get the management dashboard; phones keep the play-first one. -->
      <DesktopDash v-if="mdAndUp" />
      <UserDash v-else />
    </template>
    <template v-else-if="user?.roles_fk === 3">
      <!-- Retailers on PC get an event-management dashboard. -->
      <RetailerDesktopDash v-if="mdAndUp" />
      <RetailDash v-else />
    </template>
    <SupportDash v-else-if="user?.roles_fk === 4" />
    <p v-else>Loading dashboard...</p>
  </div>
</template>

<script lang="ts" setup>
import { computed } from "vue";
import { useDisplay } from "vuetify";
import { useUserStore } from "@/store/UserStore";
import UserDash from "@/components/UserDash.vue";
import DesktopDash from "@/components/DesktopDash.vue";
import RetailDash from "@/components/RetailDash.vue";
import RetailerDesktopDash from "@/components/RetailerDesktopDash.vue";
import SupportDash from "@/components/SupportDash.vue";

// Obtém o usuário da store
const user = computed(() => useUserStore().user);
const { mdAndUp } = useDisplay();
</script>