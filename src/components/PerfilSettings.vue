<template>
  <AccountForm />

  <privacy-settings />

  <AdOptions />
</template>

<script lang="ts" setup>
import { ref, computed } from "vue";
import { useUserStore } from "@/store/UserStore";

const user = computed(() => useUserStore().user); // Obtém os dados do usuário

const storeForms = ref([]); // Lista de formulários de loja
</script>

<style scoped></style>
