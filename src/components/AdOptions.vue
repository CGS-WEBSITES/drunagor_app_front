<template>
    <v-col cols="12" class="d-flex justify-center pa-0">
      <v-container max-width="804" class="py-4">
        <!-- Card com funcionalidade de colapsar -->
        <v-card elevation="2" rounded="lg">
          <!-- Cabeçalho com título e seta -->
          <v-card-title
            class="d-flex justify-space-between align-center"
            @click="toggleOptions"
          >
            <span class="text-h5 text-bold pa-2">ADDITIONAL OPTIONS</span>
            <v-icon>{{ isExpanded ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
          </v-card-title>
  
          <!-- Conteúdo do formulário (visível apenas se expandido) -->
          <v-expand-transition>
            <v-card-text v-if="isExpanded">
              <v-btn
                block
                color="red darken-2"
                class="text-white text-bold mb-3"
                @click="deleteAccount"
              >
                DELETE
              </v-btn>
  
              <v-btn
                block
                color="amber darken-2"
                class="text-white text-bold mb-3"
                @click="giveFeedback"
              >
                FEEDBACK
              </v-btn>
  
              <v-btn
                block
                color="purple darken-2"
                class="text-white text-bold"
                @click="updateToRetailer"
              >
                UPDATE
              </v-btn>
            </v-card-text>
          </v-expand-transition>
        </v-card>
      </v-container>
    </v-col>
  </template>
  
  <script lang="ts" setup>
  import { ref } from 'vue';
  
  // Estado de expansão
  const isExpanded = ref(true);
  
  // Alternar abertura/fechamento
  const toggleOptions = () => {
    isExpanded.value = !isExpanded.value;
  };
  
  // Funções para os botões
  const deleteAccount = () => {
    console.log('Delete Account');
    alert('Account deletion requested!');
  };
  
  const giveFeedback = () => {
    console.log('Give Feedback');
    alert('Feedback form opened!');
  };
  
  const updateToRetailer = () => {
    console.log('Update to Retailer Account');
    alert('Account update to retailer requested!');
  };
  </script>
  