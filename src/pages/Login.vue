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

                    <v-col cols="12" class="d-flex align-center">
                      <v-checkbox
                        v-model="agreeTerms"
                        color="green"
                        :rules="[rules.required]"
                      ></v-checkbox>
                      <span>
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
    </v-row>
  <!-- Card com Lorem Ipsum -->
  <v-container class="pa-4" color="white" fluid>
      <v-card class="pa-4" color="white" elevation="2">
        <p>
          <strong>Welcome to the Drunagor App!</strong>
        </p>

        <p>
          Get ready to revolutionize your gaming experience! The Drunagor App is
          your ultimate companion for immersive adventures, campaign tracking,
          and epic events. Seamlessly manage your progress, connect with the
          community, and join exclusive <strong>Drunagor Nights</strong> for
          rewards and rankings. Be among the first to explore this exciting new
          platform and take your gameplay to the next level. Whether you're a
          seasoned adventurer or new to the world of Drunagor, this is your
          moment to shine.
        </p>

        <p>
          <strong>Sign up now and embark on your next adventure!</strong>
        </p>
      </v-card>
    </v-container>

    <!-- Seção de Vídeo -->
    <v-container class="bg-white">
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
    </v-container>

    <!-- Terms dialog -->
    <v-dialog v-model="termsDialog" max-width="500">
      <v-card title="Terms & Conditions">
        <v-card-text>
          <p><strong>Effective Date:</strong> January 2nd 2025</p>
          <p>
            <strong>1. Acceptance of Terms</strong> By accessing or using the
            Drunagor App (“App”), you agree to comply with these Terms &
            Conditions. If you do not agree, please refrain from using the App.
          </p>

          <p>
            <strong>2. Eligibility</strong>
            You must be at least 16 years old or have parental consent to use
            the App. By using the App, you confirm you meet this requirement.
          </p>

          <p><strong>3. User Responsibilities</strong> You agree to:</p>
          <ul class="ml-8"></ul>
          <li>
            Provide accurate and truthful information during registration.
          </li>
          <li>Use the App for its intended purposes.</li>

          <li>
            Not engage in prohibited activities, including hacking, transmitting
            viruses, or using automated systems.
          </li>
          <p>
            <strong>4. Intellectual Property</strong> All content, including but
            not limited to text, graphics, logos, and code, is the property of
            [Your Company Name] and protected under intellectual property laws.
          </p>
          <p>
            <strong>5. Privacy</strong> Your use of the App is governed by our
            <strong>Privacy Policy</strong>, which explains how we collect, use,
            and store your data.
          </p>

          <p>
            <strong>6. Disclaimer of Warranties</strong> The App is provided
            “as-is” and “as available.” We make no guarantees regarding its
            performance, reliability, or suitability for your purposes.
          </p>

          <p>
            <strong>7. Limitation of Liability</strong> We are not liable for
            indirect, incidental, or consequential damages arising from your use
            of the App.
          </p>

          <p>
            <strong>8. Modifications to Terms</strong> We may update these Terms
            & Conditions. Continued use of the App after changes constitutes
            acceptance.
          </p>

          <p>
            <strong>9. Governing Law</strong> These Terms are governed by the
            laws of Montana.
          </p>
          <p>
            <strong>10. Contact</strong> For inquiries, email:
            customerservice@wearecgs.com
          </p>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text="Close Dialog" @click="termsDialog = false"></v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="privacyDialog" max-width="500">
      <v-card title="Privacy Policy">
        <v-card-text>
          <p><strong>Effective Date:</strong> January 2nd 2025</p>

          <p>
            <strong>1. Introduction</strong>

            This Privacy Policy explains how [Creative Games Studio LLC
            collects, uses, and protects your personal data in compliance with
            GDPR and CCPA.
          </p>

          <p>
            <strong>2. Data We Collect</strong>
          </p>

          <ul class="ml-8">
            <li>
              <strong>Personal Information:</strong> Name, email, and location.
            </li>

            <li>
              <strong>Device Information:</strong> IP address, browser type, and
              operating system.
            </li>
            <li>
              <strong>Cookies and Cache:</strong> To improve user experience and
              analyze usage patterns.
            </li>
          </ul>

          <p>
            <strong>3. How We Use Your Data</strong>

            We use your data to:
          </p>

          <ul class="ml-8">
            <li>Provide App services and features.</li>

            <li>Communicate important updates.</li>

            <li>Improve user experience.</li>
            <li>Comply with legal obligations.</li>
          </ul>

          <p>
            <strong>4. Legal Bases for Processing (GDPR)</strong>
            We process your data based on:
          </p>

          <ul class="ml-8">
            <li>Your consent (e.g., signing up for the App).</li>
            <li>
              Fulfillment of a contract (e.g., providing App functionality).
            </li>
            <li>Legitimate interests (e.g., enhancing user experience).</li>
          </ul>

          <p>
            <strong>5. Your Rights</strong>
          </p>

          <p>
            <strong>Under GDPR (European Users):</strong>
            You have the right to:
          </p>

          <ul class="ml-8">
            <li>Access your data.</li>

            <li>Request corrections or deletion of your data.</li>

            <li>Restrict or object to data processing.</li>

            <li>Data portability.</li>
          </ul>

          <p>
            <strong>Under CCPA (California Users):</strong>
            You have the right to:
          </p>

          <ul class="ml-8">
            <li>Know what personal data is collected.</li>

            <li>Request deletion of personal data.</li>

            <li>Opt out of data selling (we do not sell personal data).</li>
          </ul>

          <p>
            <strong>6. Data Retention</strong>

            We retain your data for as long as necessary to provide the App
            services or comply with legal obligations.
          </p>

          <p>
            <strong>7. Cookies</strong>

            We use cookies to:
          </p>

          <ul class="ml-8">
            <li>Remember user preferences.</li>
            <li>Monitor App usage.</li>
          </ul>

          <p>
            <strong>8. Data Security</strong>

            We use encryption and other security measures to protect your data.
          </p>

          <p>
            <strong>9. Third-Party Services</strong>

            We may share your data with third-party service providers for the
            purposes of App functionality. These parties are contractually
            obligated to protect your data.
          </p>

          <p>
            <strong>10. International Data Transfers</strong>

            Data may be transferred to servers located outside of your country.
            We comply with GDPR and CCPA requirements for such transfers.
          </p>

          <p>
            <strong>11. Children's Privacy</strong>

            We do not knowingly collect data from children under 16 without
            parental consent.
          </p>

          <p>
            <strong>12. Updates to Policy</strong>

            We may update this Privacy Policy. Changes will be communicated via
            the App or email.
          </p>

          <p>
            <strong>13. Contact</strong>

            For privacy-related inquiries, email: customerservice@wearecgs.com
          </p>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text="Close Dialog" @click="privacyDialog = false"></v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup lang="ts">
import { ref, inject } from "vue";
import { useRouter } from "vue-router";
import { useAppStore } from "@/store/userstore";
import md5 from "js-md5"; // Certifique-se de que md5 está instalado corretamente
import type { VForm } from "vuetify/components";
import { flatMap } from "lodash-es";
import { defineStore } from "pinia";

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
const selectedCountry = ref<string | null>(null);
const agreeTerms = ref<boolean>(false);
const regValid = ref<boolean>(false);
const loginValid = ref<boolean>(false);
const videoThumbnail = ref<string>("");
const alertIcon = ref("");
const alertText = ref("");
const alertTitle = ref("");
const alertType = ref("");
const termsDialog = ref(false);
const privacyDialog = ref(false);
const showAlert = ref(false);
const showPass = ref(false);


const countries = ref<string[]>([
  "USA",
  "Canada",
  "Brazil",
  "Mexico",
  "Germany",
]);

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

const axios: any = inject("axios");
const url: string = inject("apiUrl");

// Função para exibir alertas
const setAllert = (
  icon: string,
  title: string,
  text: string,
  type: string
) => {
  alertIcon.value = icon;
  alertTitle.value = title;
  alertText.value = text;
  showAlert.value = true;
  alertType.value = type;
};

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
    .post(url + "users/login", {
      login: login.value,
      password: md5(password.value),
    })
    .then((response) => {
      console.log("API Response:", response.data);

      if (response.data && response.data.data) {
        const userName = response.data.data.user_name; // Certifique-se de que 'user_name' existe
        const email = response.data.data.email;

        // Atualiza a store com os dados do usuário
        appStore.setUser(userName, email);
        console.log("Store State Updated:", appStore.user);

        // Exibe alerta de sucesso
        setAllert("mdi-check", response.status, response.data.message, "success");

        // Redireciona para o Dashboard
        router.push({ name: "Dashboard" });
      } else {
        setAllert(
          "mdi-alert-circle",
          500,
          "Invalid API response structure.",
          "error"
        );
      }
    })
    .catch((error) => {
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
  console.log(valid, errors);
  regValid.value = valid;
};

const submitForm = async () => {
  await valReg();

  if (regValid.value) {
    await axios
      .post(url + "users/cadastro", {
        name: login.value,
        user_name: signupUsername.value,
        email: signupEmail.value,
        password: signupConfirmPassword.value,
        roles_fk: 2,
        active: true,
        verified: false,
        agreement: false,
      })
      .then((response) => {
        console.log(response);
        setAllert(
          "mdi-check",
          response.status,
          response.data.message,
          "success"
        );
        router.push({ name: "Login" });
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

    console.log("API Response:", response.data);

    // Armazena os dados do usuário no Pinia
    appStore.setUser({
      username: response.data.data.user_name, // Pega o user_name da resposta
      email: response.data.data.email, // Pega o email, se necessário
    });
  }
};
</script>