<template>
  <v-col cols="12" class="d-flex justify-center pa-0">
    <v-container max-width="804" class="py-4">
      <!-- Card com funcionalidade de colapsar -->
      <v-card elevation="2" rounded="lg">
        <!-- Cabeçalho com título e seta -->
        <v-card-title class="d-flex justify-space-between align-center" @click="toggleOptions">
          <span class="text-h5 font-weight-black pl-2 pt-2 pb-2 text-uppercase">ADDITIONAL OPTIONS</span>
          <v-icon>{{
            isExpanded ? "mdi-chevron-up" : "mdi-chevron-down"
            }}</v-icon>
        </v-card-title>

        <!-- Conteúdo do formulário (visível apenas se expandido) -->
        <v-expand-transition>
          <v-card-text v-if="isExpanded">
            <v-alert closable v-model="showAlert" :icon="alertIcon" :title="alertTitle" :text="alertText"
              :type="alertType" class="mb-6"></v-alert>
            <v-btn block color="#A02C2C" class="text-white text-body-1 font-weight-bold mb-3" @click="deleteUser()">
              DELETE
            </v-btn>

            <!-- <v-btn
              block
              color="#C7A738"
              class="text-white text-body-1 font-weight-bold mb-3"
              @click="showFeedbackAlert"
            >
              FEEDBACK
            </v-btn>

            <v-btn
              block
              color="#550096"
              class="text-white text-body-1 font-weight-bold"
              @click="showUpdateAlert"
            >
              UPDATE
            </v-btn> -->
          </v-card-text>
        </v-expand-transition>
      </v-card>

      <!-- Alerta de Exclusão -->
      <v-alert v-if="alertDelete" type="error" class="mt-3" text color="#A02C2C" title="Account Deletion"
        @click:close="alertDelete = false" closeable>
        Your account deletion request has been processed!
      </v-alert>

      <!-- Alerta de Feedback -->
      <v-alert v-if="alertFeedback" type="info" class="mt-3" color="#C7A738" text title="Feedback"
        @click:close="alertFeedback = false" closeable>
        Feedback form has been opened for you to fill out!
      </v-alert>

      <!-- Alerta de Atualização -->
      <v-alert v-if="alertUpdate" type="success" class="mt-3" text color="#550096" title="Account Update"
        @click:close="alertUpdate = false" closeable>
        Your account update to retailer has been requested!
      </v-alert>
    </v-container>
  </v-col>
</template>

<script lang="ts" setup>
import { ref, inject } from "vue";
import { getToken } from "@/service/AccessToken";
import { useUserStore } from "@/store/UserStore";
import { useRouter } from "vue-router";

const user = useUserStore().user;
const axios: any = inject("axios");
const url: string = inject("apiUrl");
const router = useRouter();
// Estado de expansão
const isExpanded = ref(false);
const alertIcon = ref("");
const alertText = ref("");
const alertTitle = ref("");
const alertType = ref("");
const showAlert = ref(false);

// Alternar abertura/fechamento
const toggleOptions = () => {
  isExpanded.value = !isExpanded.value;
};

// Função para exibir alertas
const setAllert = (icon: string, title: string, text: string, type: string) => {
  alertIcon.value = icon;
  alertTitle.value = title;
  alertText.value = text;
  showAlert.value = true;
  alertType.value = type;
};

const deleteUser = async () => {
  await axios
    .delete(url + `users/${user.user_pk}/delete/`, {
      // Headers
      headers: getToken(),
    })
    .then(async (response: any) => {
      console.log("API Response:", response);
      // Exibe alerta de sucesso
      setAllert("mdi-check", response.status, response.data.message, "success");
      logOut()
    })
    .catch((error: any) => {
      console.error("Error during login:", error);
      // Trata erros com mensagens apropriadas
      setAllert(
        "mdi-alert-circle",
        error.response?.status || 500,
        error.response?.data?.message || "A network error occurred.",
        "error"
      );

    });
};

const logOut = () => {
  localStorage.removeItem("accessToken");
  router.push({ name: "Login" });
};
</script>
