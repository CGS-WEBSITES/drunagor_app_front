<template>
  <v-col cols="12" class="d-flex justify-center pa-0">
    <v-container max-width="804" class="py-4">
      <!-- Card com opções adicionais -->
      <v-card color="primary" elevation="2" rounded="lg">
        <v-card-title
          class="d-flex justify-space-between align-center"
          @click="toggleOptions"
        >
          <span class="text-h5 font-weight-black pl-2 pt-2 pb-2 text-uppercase"
            >ADDITIONAL OPTIONS</span
          >
          <v-icon>{{
            isExpanded ? "mdi-chevron-up" : "mdi-chevron-down"
          }}</v-icon>
        </v-card-title>

        <v-expand-transition>
          <v-card-text v-if="isExpanded">
            <!-- Alerta genérico para feedback -->
            <v-alert
              closable
              v-model="showAlert"
              :icon="alertIcon"
              :title="alertTitle"
              :text="alertText"
              :type="alertType"
              class="mb-6"
            ></v-alert>

            <!-- Botão para deletar a conta -->
            <v-btn
              block
              color="#A02C2C"
              class="text-white text-body-1 font-weight-bold mb-3"
              @click="showDeleteDialog = true"
            >
              DELETE ACCOUNT
            </v-btn>
          </v-card-text>
        </v-expand-transition>
      </v-card>

      <!-- Diálogo de confirmação para exclusão -->
      <v-dialog v-model="showDeleteDialog" max-width="500px" persistent>
        <v-card>
          <v-card-title class="text-h5">Confirm Account Deletion</v-card-title>
          <v-card-text>
            Are you sure you want to delete your account? This action cannot be
            undone.
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn variant="text" @click="showDeleteDialog = false">
              Cancel
            </v-btn>
            <v-btn
              color="red-darken-1"
              variant="text"
              @click="confirmDelete"
              :loading="isDeleting"
            >
              Confirm
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-container>
  </v-col>
</template>

<script lang="ts" setup>
import { ref, inject } from "vue";
import { getToken } from "@/service/AccessToken";
import { useUserStore } from "@/store/UserStore";

// --- Refs e Injeções ---
const userStore = useUserStore();
const user = userStore.user;
const axios: any = inject("axios");

// --- Estado do Componente ---
const isExpanded = ref(false);
const showAlert = ref(false);
const alertIcon = ref("");
const alertText = ref("");
const alertTitle = ref("");
const alertType = ref<"success" | "error" | "warning" | "info">("info");
const showDeleteDialog = ref(false);
const isDeleting = ref(false);

// --- Funções ---

/**
 * Alterna a visibilidade da seção de opções.
 */
const toggleOptions = () => {
  isExpanded.value = !isExpanded.value;
};

/**
 * Exibe um alerta temporário na tela.
 * @param icon Ícone do alerta.
 * @param title Título do alerta.
 * @param text Texto do alerta.
 * @param type Tipo do alerta (success, error, etc.).
 */
const setAlert = (
  icon: string,
  title: string,
  text: string,
  type: "success" | "error" | "warning" | "info",
) => {
  alertIcon.value = icon;
  alertTitle.value = title;
  alertText.value = text;
  alertType.value = type;
  showAlert.value = true;

  setTimeout(() => {
    showAlert.value = false;
  }, 4000);
};

/**
 * Confirma e executa a exclusão do usuário.
 */
const confirmDelete = async () => {
  isDeleting.value = true; // Ativa o loading do botão
  try {
    const user_pk = user?.users_pk;
    if (!user_pk) {
      console.error("❌ User PK not found in store.");
      setAlert(
        "mdi-alert-circle",
        "Error",
        "User not found. Please log in again.",
        "error",
      );
      return;
    }

    const response = await axios.delete(`/users/${user_pk}/delete/`, {
      headers: getToken(),
    });

    // Mostra a mensagem de sucesso
    setAlert("mdi-check", "Success", response.data.message, "success");

    // Fecha o diálogo e aguarda um momento para o usuário ler a mensagem
    showDeleteDialog.value = false;
    setTimeout(() => {
      // Remove o token de acesso
      localStorage.removeItem("accessToken");
      // Redireciona para a página inicial do site
      window.location.href = window.location.origin;
    }, 2000);
  } catch (error: any) {
    console.error("❌ Error deleting user:", error);
    setAlert(
      "mdi-alert-circle",
      `Error ${error.response?.status || ""}`,
      error.response?.data?.message || "A network error occurred.",
      "error",
    );
  } finally {
    isDeleting.value = false; // Desativa o loading
    if (!showAlert.value) {
      // Se nenhum alerta foi exibido (ex: falha de rede sem resposta), fecha o diálogo.
      showDeleteDialog.value = false;
    }
  }
};
</script>
