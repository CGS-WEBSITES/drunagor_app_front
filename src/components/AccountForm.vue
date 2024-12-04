<template>
    <v-col cols="12" class="d-flex justify-center pa-0">
      <v-container max-width="804" class="py-4">
        <!-- Card com funcionalidade de colapsar -->
        <v-card elevation="2" rounded="lg">
          <!-- Cabeçalho com título e seta -->
          <v-card-title
            class="d-flex justify-space-between align-center"
            @click="toggleForm"
          >
            <span class="text-h5 text-bold pa-2">MY ACCOUNT</span>
            <v-icon>{{ isExpanded ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
          </v-card-title>
  
          <!-- Conteúdo do formulário (visível apenas se expandido) -->
          <v-expand-transition>
            <v-card-text v-if="isExpanded">
              <!-- Nome e Sobrenome -->
              <v-text-field
                label="First Name"
                variant="outlined"
                v-model="form.firstName"
                class="mb-0"
              ></v-text-field>
              <v-text-field
                label="Last Name"
                variant="outlined"
                v-model="form.lastName"
                class="mb-0"
              ></v-text-field>
  
              <!-- Nickname -->
              <v-text-field
                label="Nickname"
                variant="outlined"
                v-model="form.nickname"
                class="mb-0"
              ></v-text-field>
  
              <!-- CEP -->
              <v-text-field
                label="Zipcode"
                variant="outlined"
                v-model="form.zipcode"
                class="mb-0"
              ></v-text-field>
  
              <!-- Email -->
              <v-text-field
                label="Email"
                variant="outlined"
                v-model="form.email"
                class="mb-0"
              ></v-text-field>
              <v-text-field
                label="Confirm New Email"
                variant="outlined"
                v-model="form.confirmEmail"
                class="mb-0"
              ></v-text-field>
  
              <!-- Switch para atualizações por email -->
              <v-switch
                v-model="form.sendEmailUpdates"
                label="Send email updates for friend requests, events next to you and app updates."
                inset
                class="mb-0"
              ></v-switch>
  
              <!-- Senha -->
              <v-text-field
                label="Password"
                variant="outlined"
                type="password"
                v-model="form.password"
                class="mb-0"
              ></v-text-field>
              <v-text-field
                label="Confirm New Password"
                variant="outlined"
                type="password"
                v-model="form.confirmPassword"
                class="mb-0"
              ></v-text-field>
  
              <!-- Botões de Ação -->
              <v-card-actions>
                <v-btn color="primary" @click="saveForm">Save</v-btn>
                <v-btn color="secondary" text @click="cancelForm">Cancel</v-btn>
              </v-card-actions>
            </v-card-text>
          </v-expand-transition>
        </v-card>
      </v-container>
    </v-col>
  </template>
  
  <script lang="ts" setup>
  import { reactive, ref } from 'vue';
  
  // Estado de expansão
  const isExpanded = ref(true);
  
  // Alternar abertura/fechamento
  const toggleForm = () => {
    isExpanded.value = !isExpanded.value;
  };
  
  // Dados do formulário
  const form = reactive({
    firstName: '',
    lastName: '',
    nickname: 'MagoVeio99MagiALot',
    zipcode: '',
    email: 'magoVeio@gmail.com',
    confirmEmail: '',
    sendEmailUpdates: true,
    password: '',
    confirmPassword: '',
  });
  
  // Funções de salvar e cancelar
  const saveForm = () => {
    console.log('Form Saved:', form);
  };
  
  const cancelForm = () => {
    console.log('Form Cancelled');
  };
  </script>
  