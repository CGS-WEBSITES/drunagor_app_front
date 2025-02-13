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
            <span class="text-h5 font-weight-black pl-2 pt-2 pb-2 text-uppercase"
              >MY STORE</span
            >
  
            <v-icon>{{
              isExpanded ? "mdi-chevron-up" : "mdi-chevron-down"
              }}</v-icon>
          </v-card-title>
  
          <!-- Conteúdo do formulário (visível apenas se expandido) -->
          <v-expand-transition>
            <v-card-text v-if="isExpanded">
              <v-alert closable v-model="showAlert" :icon="alertIcon" :title="alertTitle" :text="alertText"
                :type="alertType"></v-alert>
              <v-form ref="userForm">
                <p class="text-h6 font-weight-medium pl-3 pb-3 pt-0">Store Name</p>
                <v-text-field label="" variant="solo-filled" v-model="form.storename" class="mb-0"></v-text-field>

                <p class="text-h6 font-weight-medium pl-3 pb-3 pt-0">Store Description</p>
                <v-text-field label="" variant="solo-filled" v-model="form.description" class="mb-0"></v-text-field>

                <p class="text-h6 font-weight-medium pl-3 pb-3 pt-0">Address Line 1</p>
                <v-text-field label="" variant="solo-filled" v-model="form.Address" class="mb-0"></v-text-field>

                <p class="text-h6 font-weight-medium pl-3 pb-3 pt-0">Address Line 2</p>
                <v-text-field label="" variant="solo-filled" v-model="form.Address" class="mb-0"></v-text-field>

                <p class="text-h6 font-weight-medium pl-3 pb-3 pt-0">City</p>
                <v-text-field label="" variant="solo-filled" v-model="form.Address" class="mb-0"></v-text-field>

                <p class="text-h6 font-weight-medium pl-3 pb-3 pt-0">State</p>
                <v-text-field label="" variant="solo-filled" v-model="form.Address" class="mb-0"></v-text-field>

                <p class="text-h6 font-weight-medium pl-3 pb-3 pt-0">Zip Code</p>
                <v-text-field label="" variant="solo-filled" v-model="form.zipcode" class="mb-0"></v-text-field>

                <p class="text-h6 font-weight-medium pl-3 pb-3 pt-0">Country</p>
                <v-text-field label="" variant="solo-filled" v-model="form.Address" class="mb-0"></v-text-field>

                <p class="text-h6 font-weight-medium pl-3 pb-3 pt-0">Merchant ID</p>
                <v-text-field label="" variant="solo-filled" v-model="form.MerchantID" class="mb-0"></v-text-field>

              </v-form>
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
  import { ref, inject } from "vue";
  
  import { useUserStore } from "@/store/UserStore";
  import type { VForm } from "vuetify/components";
  import { getToken } from "@/service/AccessToken";
  
  const userForm = ref<VForm>();
  const userStore = useUserStore();
  const user = userStore.user;
  // Estado de expansão
  const isExpanded = ref(false);
  // Alternar abertura/fechamento
  const toggleForm = () => {
    isExpanded.value = !isExpanded.value;
  };
  // Dados do formulário
  const form = reactive({
    name: user.name,
    user_name: user.user_name,
    zip_code: user.zip_code,
    new_email: user.email,
    confirm_email: null,
    email_updates: user.email_updates,
    new_password: null,
    confirm_password: null,
  });
  
  const rules = {
    email: (value: string) =>
      value.length === 0 || /.+@.+\..+/.test(value) || "E-mail must be valid",
    min: (v: string) => v.length === 0 || v.length >= 8 || "Min 8 characters",
    matchPasswords: (v: string) =>
      v === form.new_password || "The passwords must match",
    matchEmails: (v: string) =>
      v === form.new_email || "The Emails must match",
  
  };
  const alertIcon = ref("");
  const alertText = ref("");
  const alertTitle = ref("");
  const alertType = ref("");
  const showAlert = ref(false);
  const showPass = ref(false);
  const axios: any = inject("axios");
  const validForm = ref<boolean>(false);
  const changeEmail = ref<boolean>(false);
  const changePassword = ref<boolean>(false);
  
  // Função para exibir alertas
  const setAllert = (icon: string, title: string, text: string, type: string) => {
    alertIcon.value = icon;
    alertTitle.value = title;
    alertText.value = text;
    showAlert.value = true;
    alertType.value = type;
  };
  
  const valReg = async () => {
    const { valid, errors } = await userForm.value?.validate();
    validForm.value = valid;
  };
  
  // Funções de salvar e cancelar
  const saveForm = async () => {
    await valReg();
  
    if (validForm.value) {
      await axios
        .put(
          "users/alter",
          {
            users_pk: user.user_pk,
            name: form.name,
            user_name: form.user_name,
            zip_code: form.zipcode,
            email: form.confirm_email,
            password: form.confirm_password,
          },
          {
            // Headers
            headers: getToken(),
          }
        )
        .then(async (response: any) => {
          console.log("API Response:", response);
  
          const dbUser = response.data.data;
  
          userStore.setUser({
            email: dbUser.email,
            google_id: dbUser.google_id,
            name: dbUser.name,
            picture_hash: dbUser.picture_hash,
            roles_fk: dbUser.roles_fk,
            user_name: dbUser.user_name,
            user_pk: dbUser.users_pk,
            verified: dbUser.verified,
            zip_code: dbUser.zip_code,
          });
  
          // Exibe alerta de sucesso
          setAllert(
            "mdi-check",
            response.status,
            response.data.message,
            "success"
          );
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
    }
  };
  
  const cancelForm = () => {
    console.log("Form Cancelled");
  };
  </script>