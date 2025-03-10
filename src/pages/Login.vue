<template>
  <v-container
    class=" login-page fill-height d-flex align-center justify-center pa-4"
    fluid
  >

  <v-row justify="center">
      <v-col cols="12" class="text-center mb-4">
        <h1 class="cinzel-text font-weight-black pt-4 pb-4 justify-center text-center text-h2">
          DRUNAGOR APP
        </h1>
      </v-col>
    </v-row>


    <v-row  justify="center">
      <v-col cols="12" md="7" lg="7" xl="7">
        <v-card color="secundary" class="elevation-12">
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
                        src="@/assets/darkness_white.svg"
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
                </h4>
                <v-form>
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
                        @keyup.enter = "loginUser"
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
                <h3
                  @click="navigateTo('/forgotpassword')"

                  class="text-center mt-4 clickable-text"
                >
                  Forgot your password?
                </h3>
                <h3
                  @click="navigateTo('/retailer-registration')"

                  class="text-center mt-4 clickable-text"
                >
                  Are you a retailer?
                </h3>
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
                        src="@/assets/darkness_white.svg"
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

                    <v-col cols="12" class="d-flex align-center">
                      <v-checkbox
                        v-model="agreeTerms"
                        color="green"
                        :rules="[rules.required]"
                      ></v-checkbox>
                      <span class="ml-4">
                        I agree with the
                        <strong
                          style="cursor: pointer"
                          @click="termsDialog = true"
                        >
                          Terms & Conditions
                        </strong>
                        and
                        <strong
                          style="cursor: pointer"
                          @click="privacyDialog = true"
                        >
                          Privacy Policy
                        </strong>
                      </span>
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


     

<v-row justify="center">
      <v-col cols="11" md="7" lg="7" xl="7" >
        <v-card class="pa-4 d-flex flex-column align-center justify-center" color="white" elevation="2">
          <p>
            <strong>Welcome to the Drunagor App!</strong>
          </p>


          <p>
            Get ready to revolutionize your gaming experience! The Drunagor App
            is your ultimate companion for immersive adventures, campaign
            tracking, and epic events. Seamlessly manage your progress, connect
            with the community, and join exclusive
            <strong>Drunagor Nights</strong> for rewards and rankings. Be among
            the first to explore this exciting new platform and take your
            gameplay to the next level. Whether you're a seasoned adventurer or
            new to the world of Drunagor, this is your moment to shine.
          </p>

          <p>
            <strong>Sign up now and embark on your next adventure!</strong>
          </p>
        </v-card>
      </v-col>
    </v-row>
    </v-row>

    <iframe
            width="1130"
            height="584"
            src="https://www.youtube.com/embed/HjnZ0e5FTS4?si=-2wNSjqXfuILHVks"
            title="YouTube video player"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerpolicy="strict-origin-when-cross-origin"
            allowfullscreen
            class="pl- pt-7"

          ></iframe>

    <!-- Seção de Vídeo -->
    <!-- <v-container class="bg-white">
      <v-row align="center" justify="center" style="height: 50vh">
        <v-col cols="12" class="text-center">
          <div>
            <h2>Video Section</h2>
            <v-img
              :src="$assetsBucket + '/landing-page/presentation-video.mp4'"
              alt="Video"
            />
          </div>
        </v-col>
      </v-row>
    </v-container> -->

    <!-- Terms dialog -->
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
import { useRouter, useRoute } from "vue-router";
import md5 from "js-md5"; // Certifique-se de que md5 está instalado corretamente
import type { VForm } from "vuetify/components";
import TermsCard from "@/components/TermsCard.vue";
import PrivacyCard from "@/components/PrivacyCard.vue";
import { setToken } from "@/service/AccessToken";
import { useUserStore } from "@/store/UserStore";
import type { User } from "@/store/UserStore";

const userStore = useUserStore();

// Variáveis reativas
const regForm = ref<VForm>();
const router = useRouter();
const route = useRoute();
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

watch(
  () => route.query.tab,
  (newTab) => {
    if (newTab === "signup") {
      activeTab.value = 1;
    } else {
      activeTab.value = 0;
    }
  },
  { immediate: true }
);

onMounted(() => {
  if (route.query.tab === "signup") {
    activeTab.value = 1;
  } else {
    activeTab.value = 0;
  }
});

// Função de login
const loginUser = async () => {
  if (!login.value?.trim() || !password.value?.trim()) {
    setAllert(
      "mdi-alert-circle",
      400,
      "The email and password fields were not filled out correctly.",
      "warning"
    );
    return;
  }

  login.value = login.value.trim();
  password.value = password.value.trim();

  await axios
    .post("users/login", {
      login: login.value,
      password: md5(password.value),
    })
    .then((response: any) => {
      console.log("API Response:", response);

      const dbUser = response.data.data;

      const appUser: User = {
        email: dbUser.email,
        google_id: dbUser.google_id,
        name: dbUser.name,
        picture_hash: dbUser.picture_hash,
        roles_fk: dbUser.roles_fk,
        user_name: dbUser.user_name,
        users_pk: dbUser.users_pk,
        verified: dbUser.verified,
        zip_code: dbUser.zipcode,
        countries_fk: dbUser.countries_fk,
      };

      userStore.setUser(appUser);

      localStorage.setItem("app_user", JSON.stringify(appUser));

      // Exibe alerta de sucesso
      setAllert("mdi-check", response.status, response.data.message, "success");

      setToken(response.data.access_token);

      axios.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${response.data.access_token}`;

      // Redireciona para o Dashboard
      router.push({ name: "Dashboard" });
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

const valReg = async () => {
  const { valid, errors } = await regForm.value?.validate();
  regValid.value = valid;
};

const submitForm = async () => {
  await valReg();

  if (regValid.value) {
    await axios
      .post("users/cadastro", {
        name: login.value,
        user_name: signupUsername.value,
        email: signupEmail.value,
        password: signupConfirmPassword.value,
        roles_fk: 2,
        active: true,
        verified: false,
        agreement: true,
      })
      .then((response: any) => {
        console.log(response);

        setAllert(
          "mdi-check",
          response.status,
          response.data.message,
          "success"
        );
        activeTab.value = 0;
      })
      .catch((response) => {
        console.log(response);
        setAllert(
          "mdi-alert-circle",
          response.status,
          response.response.data.message,
          "error"
        );
      });
  }
};
</script>


<style>
.clickable-text {
  cursor: pointer; /* Transforma o cursor em uma mãozinha */
  transition: transform 0.2s ease-in-out; /* Efeito suave ao passar o mouse */
}

.clickable-text:hover {
  transform: scale(1.1); /* Aumenta o tamanho ao passar o mouse */
}

.login-page {
  background-image: url('https://druna-assets.s3.us-east-2.amazonaws.com/backgrounds/login-background.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  height: 100vh; /* Faz o fundo ocupar toda a altura da tela */
}
</style>