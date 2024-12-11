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
            <span class="text-h5 font-weight-black pl-2 pt-2 pb-2">MY ACCOUNT</span>
            <v-icon>{{ isExpanded ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
          </v-card-title>
  
          <!-- Conteúdo do formulário (visível apenas se expandido) -->
          <v-expand-transition>
            <v-card-text v-if="isExpanded">
              <p class="text-h6 font-weight-medium pl-3 pb-3 pt-0">Nickname</p>
              <v-text-field
                label=""
                variant="solo-filled"
                v-model="form.nickname"
                class="mb-0"
                
              ></v-text-field>
  
              <!-- CEP -->
              <p class="text-h6 font-weight-medium pl-3 pb-3 pt-0">Zipcode</p>
              <v-text-field
                label=""
                variant="solo-filled"
                v-model="form.zipcode"
                class="mb-0"
              ></v-text-field>
  
              <!-- Email -->
              <p class="text-h6 font-weight-medium pl-3 pb-3 pt-0">Email</p>
              <v-text-field
                label=""
                variant="solo-filled"
                v-model="form.email"
                class="mb-0"
              ></v-text-field>
              <p class="text-h6 font-weight-medium pl-3 pb-3 pt-0">Confirm New Email</p>
              <v-text-field
                label=""
                variant="solo-filled"
                v-model="form.confirmEmail"
                class="mb-0"
              ></v-text-field>
  
              <!-- Switch para atualizações por email -->
              <v-switch
                v-model="form.sendEmailUpdates"
                label="Send email updates for friend requests, events next to you and app updates."
                inset
                class="mb-0"
                color="green"
              ></v-switch>
  
              <!-- Senha -->
              <p class="text-h6 font-weight-medium pl-3 pb-3 pt-0">Password</p>
              <v-text-field
                label=""
                variant="solo-filled"
                type="password"
                v-model="form.password"
                class="mb-0"
              ></v-text-field>
              <p class="text-h6 font-weight-medium pl-3 pb-3 pt-0"> Confirm New Password</p>
              <v-text-field
                label=""
                variant="solo-filled"
                type="password"
                v-model="form.confirmPassword"
                class="mb-0"
              ></v-text-field>
  
              <!-- Botões de Ação -->
              <v-card-actions>
                <v-btn color="green" @click="saveForm">Save</v-btn>
                <v-btn color="red" text @click="cancelForm">Cancel</v-btn>
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
  const isExpanded = ref(false);
  
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
  