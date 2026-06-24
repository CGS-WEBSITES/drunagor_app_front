<template>
  <div>
    <!-- Renderiza o Dashboard correto com base em roles_fk -->
    <UserDash v-if="user?.roles_fk === 2 || user?.roles_fk === 1" />
    <RetailDash v-else-if="user?.roles_fk === 3" />
    <SupportDash v-else-if="user?.roles_fk === 4" />
    <p v-else>Loading dashboard...</p>
  </div>
</template>

<script lang="ts" setup>
import { computed } from "vue";
import { useUserStore } from "@/store/UserStore";
import UserDash from "@/components/UserDash.vue";
import RetailDash from "@/components/RetailDash.vue";
import SupportDash from "@/components/SupportDash.vue";

// Obtém o usuário da store
const user = computed(() => useUserStore().user);
</script>