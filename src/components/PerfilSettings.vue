<template>
  <!-- <v-col cols="12" class="d-flex justify-center pa-2">
    <v-btn
      density="default"
      color="#5CA148"
      style="width: 100%; max-width: 685px"
      min-height="50"
      class="text-h5 font-weight-black pa-0"
      >Save All Changes</v-btn
    >
  </v-col> -->

  <AccountForm />


  <privacy-settings />

  <AdOptions />
</template>


<script lang="ts" setup>
import { ref, computed } from "vue";
import { useUserStore } from "@/store/UserStore";
import StoreForm from "@/components/StoreForm.vue"; // Importa o componente do formulário

const user = computed(() => useUserStore().user); // Obtém os dados do usuário

const storeForms = ref([]); // Lista de formulários de loja

// Adiciona um novo formulário de loja
const addStoreForm = () => {
  storeForms.value.push({
    name: "",
    location: "",
    description: "",
  });
};

// Remove um formulário de loja específico
const removeStore = (index) => {
  storeForms.value.splice(index, 1);
};




</script>

<style scoped>
</style>
