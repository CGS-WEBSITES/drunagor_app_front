<template>
  <AccountForm />

  <privacy-settings />

  <AdOptions />

  <SupportForm />
</template>

<script lang="ts" setup>
import { ref, computed } from "vue";
import { useUserStore } from "@/store/UserStore";
import SupportForm from "@/components/SupportForm.vue";

const user = computed(() => useUserStore().user); // Obtém os dados do usuário

const storeForms = ref([]); // Lista de formulários de loja
</script>


<style scoped></style>
