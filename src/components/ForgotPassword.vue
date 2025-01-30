<template>
  <v-container
    class="fill-height d-flex align-center justify-center pa-4"
    fluid
  >
    <v-row align="center" justify="center">
      <v-col cols="12" md="8" lg="6" xl="4">
        <v-card class="elevation-12">
          <!-- Tabs for Login and Sign Up -->
         

          <!-- Content for each tab -->
            <!-- Login Tab -->

              <v-card-text>
                <v-container class="d-flex justify-center align-center">
                  <v-row justify="center">
                    <v-col cols="12" md="6" class="text-center">
                      <v-img
                        src="@/assets/darkness.png"
                        max-width="50"
                        alt="Centered Icon"
                        class="mx-auto"
                      />
                    </v-col>
                    <v-col cols="12">
                      <h1 class="display-2 font-weight-bold">Enter your email to reset your password!</h1>
                    </v-col>
                  </v-row>
                </v-container>
                <v-alert
                  closable
                  v-model="showAlert"
                  :icon="alertIcon"
                  :title="alertTitle"
                  :text="alertText"
                  :type="alertType"
                ></v-alert>
                <h4 class="text-center mt-4 py-3">
                </h4>
                <v-form>
                  <v-row>
                    <v-col cols="11">
                      <v-text-field
                        label="Email"
                        prepend-icon="mdi-email"
                        type="text"
                        v-model="login"
                        color="black"
                        outlined
                        dense
                      />
                    </v-col>
                  </v-row>
                  <v-row>
                  </v-row>
                </v-form>
                <v-btn class="mt-4" color="black" dark block @click="loginUser">
                  RESET PASSWORD
                </v-btn>
              </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-dialog v-model="termsDialog" max-width="500">
      <terms-card />
    </v-dialog>

    <v-dialog v-model="privacyDialog" max-width="500">
      <privacy-card />
    </v-dialog>
  </v-container>
</template>

<script setup lang="ts">
import { ref, inject } from "vue";
import { useRouter } from "vue-router";
import md5 from "js-md5"; // Certifique-se de que md5 está instalado corretamente
import type { VForm } from "vuetify/components";
import TermsCard from "@/components/TermsCard.vue";
import PrivacyCard from "@/components/PrivacyCard.vue";
import { setToken } from "@/service/AccessToken";
import { useUserStore } from "@/store/UserStore";



const userStore = useUserStore();

// Variáveis reativas
const regForm = ref<VForm>();
const router = useRouter();
const activeTab = ref<number>(1); // Controla as abas (Login/Sign Up)
const login = ref<string>(""); // Login do usuário
const password = ref<string>(""); // Senha do usuário
const signupUsername = ref<string>(""); // Nome de usuário para cadastro
const signupEmail = ref<string>(""); // Email para cadastro
const signupPassword = ref<string>(""); // Senha para cadastro
const signupConfirmPassword = ref<string>(""); // Confirmação de senha
const agreeTerms = ref<boolean>(false);
const regValid = ref<boolean>(false);
const alertIcon = ref("");
const alertText = ref("");
const alertTitle = ref("");
const alertType = ref("");
const termsDialog = ref(false);
const showAlert = ref(false);
const showPass = ref(false);
const privacyDialog = ref(false);


const navigateTo = (route: string) => {
  router.push(route);
};




// Regras de validação
const rules = {
  required: (value: string) => !!value || "Required.",
  email: (value: string) => /.+@.+\..+/.test(value) || "E-mail must be valid",
  min: (v: string) => v.length >= 8 || "Min 8 characters",
  matchPasswords: (v: string) =>
    v === signupPassword.value || "The passwords must match",
};

const axios: any = inject("axios");

// Função para exibir alertas
const setAllert = (icon: string, title: string, text: string, type: string) => {
  alertIcon.value = icon;
  alertTitle.value = title;
  alertText.value = text;
  showAlert.value = true;
  alertType.value = type;
};

// Função de login
const loginUser = async () => {
  if (!email.value?.trim()) {
    setAllert(
      "mdi-alert-circle",
      404,
      "User not Found",
      "warning"
    );
    return;
  }

  email.value = email.value.trim();

  await axios
    .post("users/reset_password", {
      email: email.value,
    })
    .then((response: any) => {
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
      setAllert("mdi-check", response.status, response.data.message, "success");

      setToken(response.data.access_token);

      axios.defaults.headers.common["Authorization"] = `Bearer ${response.data.access_token}`;

      // Redireciona para o Dashboard
      router.push({ name: "Login" });
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

</script>