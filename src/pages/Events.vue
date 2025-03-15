<template>
    <div>
      <!-- Renderiza o Dashboard correto com base em roles_fk -->
      <UserEvents v-if="user?.roles_fk === 2" />
      <RetailEvents v-else-if="user?.roles_fk === 3" />
      <p v-else>Loading dashboard...</p>
    </div>
  </template>
  
  <script lang="ts" setup>
  import { computed } from "vue";
  import { useUserStore } from "@/store/UserStore";
  import UserEvents from "@/components/UserEvents.vue";
  import RetailEvents from "@/components/RetailEvents.vue";
  
  // Obtém o usuário da store
  const user = computed(() => useUserStore().user);
  </script>