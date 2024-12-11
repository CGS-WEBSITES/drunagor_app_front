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
          <span class="text-h5 font-weight-black pl-2 pt-2 pb-2">ADDITIONAL OPTIONS</span>
          <v-icon>{{ isExpanded ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
        </v-card-title>

        <!-- Conteúdo do formulário (visível apenas se expandido) -->
        <v-expand-transition>
          <v-card-text v-if="isExpanded">
            <v-btn
              block
              color="#A02C2C"
              class="text-white text-bold mb-3"
              @click="showDeleteAlert"
            >
              DELETE
            </v-btn>

            <v-btn
              block
              color="#C7A738"
              class="text-white text-bold mb-3"
              @click="showFeedbackAlert"
            >
              FEEDBACK
            </v-btn>

            <v-btn
              block
              color="#550096"
              class="text-white text-bold"
              @click="showUpdateAlert"
            >
              UPDATE
            </v-btn>
          </v-card-text>
        </v-expand-transition>
      </v-card>

      <!-- Alerta de Exclusão -->
      <v-alert
        v-if="alertDelete"
        type="error"
        class="mt-3"
        text
        color="#A02C2C"
        title="Account Deletion"
        @click:close="alertDelete = false"
        closeable
      >
        Your account deletion request has been processed!
      </v-alert>

      <!-- Alerta de Feedback -->
      <v-alert
        v-if="alertFeedback"
        type="info"
        class="mt-3"
        color="#C7A738"
        text
        title="Feedback"
        @click:close="alertFeedback = false"
        closeable
      >
        Feedback form has been opened for you to fill out!
      </v-alert>

      <!-- Alerta de Atualização -->
      <v-alert
        v-if="alertUpdate"
        type="success"
        class="mt-3"
        text
        color="#550096"
        title="Account Update"
        @click:close="alertUpdate = false"
        closeable
      >
        Your account update to retailer has been requested!
      </v-alert>
    </v-container>
  </v-col>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

// Estado de expansão
const isExpanded = ref(false);

// Alternar abertura/fechamento
const toggleOptions = () => {
  isExpanded.value = !isExpanded.value;
};

// Estados para alertas
const alertDelete = ref(false);
const alertFeedback = ref(false);
const alertUpdate = ref(false);

// Funções para os botões
const showDeleteAlert = () => {
  alertDelete.value = true;
  console.log('Delete Account');
};

const showFeedbackAlert = () => {
  alertFeedback.value = true;
  console.log('Give Feedback');
};

const showUpdateAlert = () => {
  alertUpdate.value = true;
  console.log('Update to Retailer Account');
};
</script>
