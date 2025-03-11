<template>
  <v-container>
    <StoreForm />

    <v-row>
      <v-col
        class="pa-0 ml-"
        cols="12"
        v-for="(store, index) in storeForms"
        :key="index"
      >
        <StoreForm v-model="storeForms[index]" @remove="removeStore(index)" />
      </v-col>
    </v-row>
  </v-container>
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

<style scoped></style>
