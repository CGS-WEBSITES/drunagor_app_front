<template>
  <v-container
    class="fill-height d-flex align-center justify-center pa-4"
    fluid
  >
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="6">
        <v-card class="elevation-12">
          <!-- Tabs for Login and Sign Up -->
          <v-tabs v-model="activeTab" fixed-tabs background-color="white">
            <v-tab :key="0">LOGIN</v-tab>
            <v-tab :key="1">SIGN UP</v-tab>
          </v-tabs>

          <!-- Content for each tab -->
          <v-tabs-items v-model="activeTab">
            <!-- Login Tab -->
            <v-tab-item :value="0">
              <v-card-text v-if="activeTab === 0">
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
                      <h1 class="display-2 font-weight-bold">Welcome Back!</h1>
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
                  Ensure your email for registration
                </h4>
                <v-form ref="login">
                  <v-row>
                    <v-col cols="11">
                      <v-text-field
                        label="Email or User Name"
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
                    <v-col cols="11">
                      <v-text-field
                        label="Password"
                        prepend-icon="mdi-lock"
                        :type="showPass ? 'text' : 'password'"
                        v-model="password"
                        color="black"
                        outlined
                        dense
                      />
                    </v-col>
                    <v-col cols="1" class="d-flex justify-center align-center">
                      <v-icon
                        v-if="showPass"
                        class="olho"
                        tag="i"
                        @click="showPass = !showPass"
                        >mdi-eye</v-icon
                      >
                      <v-icon
                        v-else
                        class="olho"
                        tag="i"
                        @click="showPass = !showPass"
                        >mdi-eye-off</v-icon
                      >
                    </v-col>
                  </v-row>
                </v-form>
                <h3 class="text-center mt-4">Forgot your password?</h3>
                <v-btn class="mt-4" color="black" dark block @click="loginUser">
                  SIGN IN
                </v-btn>
              </v-card-text>
            </v-tab-item>

            <!-- Sign Up Tab -->
            <v-tab-item :value="1">
              <v-card-text v-if="activeTab === 1">
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
                      <h1 class="display-2 font-weight-bold pl-3">
                        Create an User Account
                      </h1>
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
                  Ensure your email for registration
                </h4>

                <v-form ref="regForm">
                  <v-row>
                    <v-col cols="12" sm="6">
                      <v-text-field
                        label="Username"
                        v-model="signupUsername"
                        prepend-icon="mdi-account"
                        :rules="[rules.required]"
                        color="black"
                        outlined
                        dense
                      />
                    </v-col>
                    <v-col cols="12" sm="6">
                      <v-text-field
                        label="Email"
                        v-model="signupEmail"
                        prepend-icon="mdi-email"
                        type="email"
                        :rules="[rules.required, rules.email]"
                        color="black"
                        outlined
                        dense
                      />
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="11" sm="5">
                      <v-text-field
                        label="Password"
                        prepend-icon="mdi-lock"
                        :type="showPass ? 'text' : 'password'"
                        v-model="signupPassword"
                        :rules="[rules.required, rules.min]"
                        color="black"
                        outlined
                        dense
                      />
                    </v-col>
                    <v-col cols="1" class="d-flex justify-center align-center">
                      <v-icon
                        v-if="showPass"
                        class="olho"
                        tag="i"
                        @click="showPass = !showPass"
                        >mdi-eye</v-icon
                      >
                      <v-icon
                        v-else
                        class="olho"
                        tag="i"
                        @click="showPass = !showPass"
                        >mdi-eye-off</v-icon
                      >
                    </v-col>
                    <v-col cols="12" sm="6">
                      <v-text-field
                        label="Confirm Password"
                        v-model="signupConfirmPassword"
                        prepend-icon="mdi-lock"
                        type="password"
                        :rules="[rules.required, rules.matchPasswords]"
                        color="black"
                        outlined
                        dense
                      />
                    </v-col>
                  </v-row>

                  <v-btn
                    class="mt-4"
                    color="black"
                    dark
                    block
                    @click="submitForm"
                  >
                    SIGN UP
                  </v-btn>
                </v-form>
              </v-card-text>
            </v-tab-item>
          </v-tabs-items>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref, inject } from "vue";
import { useRouter } from "vue-router";
import { useAppStore } from "@/store/app"; // Importa a store do Pinia
import md5 from "js-md5"; // Certifique-se de que md5 está instalado corretamente
import type { VForm } from "vuetify/components";

// Variáveis reativas
const regForm = ref<VForm>();
const router = useRouter();
const activeTab = ref<number>(0); // Controla as abas (Login/Sign Up)
const login = ref<string>(""); // Login do usuário
const password = ref<string>(""); // Senha do usuário
const signupUsername = ref<string>(""); // Nome de usuário para cadastro
const signupEmail = ref<string>(""); // Email para cadastro
const signupPassword = ref<string>(""); // Senha para cadastro
const signupConfirmPassword = ref<string>(""); // Confirmação de senha
const showAlert = ref(false); // Controla a exibição de alertas
const alertIcon = ref(""); // Ícone do alerta
const alertText = ref(""); // Texto do alerta
const alertTitle = ref(""); // Título do alerta
const alertType = ref(""); // Tipo de alerta (success, error, etc.)
const showPass = ref(false); // Alterna entre mostrar/ocultar senha

// Store do Pinia
const appStore = useAppStore();

// Regras de validação
const rules = {
  required: (value: string) => !!value || "Required.",
  email: (value: string) => /.+@.+\..+/.test(value) || "E-mail must be valid",
  min: (v: string) => v.length >= 3 || "Min 8 characters",
  matchPasswords: (v: string) =>
    v === signupPassword.value || "The passwords must match",
};

// Configurações para requisições (axios e URL base)
const axios: any = inject("axios");
const url: string = inject("apiUrl");

// Função para exibir alertas
const setAlert = (icon: string, title: string, text: string, type: string) => {
  alertIcon.value = icon;
  alertTitle.value = title;
  alertText.value = text;
  alertType.value = type;
  showAlert.value = true;
};

// Função de login
const loginUser = async () => {
  if (!login.value?.trim() || !password.value?.trim()) {
    setAlert(
      "mdi-alert-circle",
      "Login Error",
      "The email and password fields were not filled out correctly.",
      "warning"
    );
    return;
  }

  try {
    const response = await axios.post(url + "users/login", {
      login: login.value.trim(),
      password: md5(password.value.trim()), // Usa md5 para criptografar a senha
    });

    console.log("API Response:", response.data);

    // Armazena os dados do usuário no Pinia
    appStore.setUser({
      username: response.data.data.user_name, // Pega o `user_name` da resposta
      email: response.data.data.email,       // Pega o email, se necessário
    });

    // Exibe sucesso e redireciona para o Dashboard
    setAlert("mdi-check", "Success", response.data.message, "success");
    router.push({ name: "Dashboard" });
  } catch (error) {
    // Exibe erro em caso de falha
    setAlert(
      "mdi-alert-circle",
      "Login Error",
      error.response?.data?.message || "An error occurred.",
      "error"
    );
  }
};
</script>
