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

                    <v-col cols="12">
                      <v-checkbox
                        v-model="agreeTerms"
                        color="green"
                        :rules="[rules.required]"
                      ></v-checkbox>
                      <v-label>
                        I agree with the
                        <strong
                          style="cursor: pointer"
                          @click="termsDialog.value = true"
                          >Terms & Conditions</strong
                        >
                        and
                        <strong
                          style="cursor: pointer"
                          @click="privacyDialog.value = true"
                          >Privacy Policy</strong
                        >
                      </v-label>
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
          **Effective Date:** January 2nd 2025 **~~Last Updated:** [Insert
          Date]~~ **1. Acceptance of Terms** By accessing or using the Drunagor
          App (“App”), you agree to comply with these Terms & Conditions. If you
          do not agree, please refrain from using the App. **2. Eligibility**
          You must be at least 16 years old or have parental consent to use the
          App. By using the App, you confirm you meet this requirement. **3.
          User Responsibilities** You agree to: • Provide accurate and truthful
          information during registration. • Use the App for its intended
          purposes. • Not engage in prohibited activities, including hacking,
          transmitting viruses, or using automated systems. **4. Intellectual
          Property** All content, including but not limited to text, graphics,
          logos, and code, is the property of [Your Company Name] and protected
          under intellectual property laws. **5. Privacy** Your use of the App
          is governed by our **Privacy Policy**, which explains how we collect,
          use, and store your data. **6. Disclaimer of Warranties** The App is
          provided “as-is” and “as available.” We make no guarantees regarding
          its performance, reliability, or suitability for your purposes. **7.
          Limitation of Liability** We are not liable for indirect, incidental,
          or consequential damages arising from your use of the App. **8.
          Modifications to Terms** We may update these Terms & Conditions.
          Continued use of the App after changes constitutes acceptance. **9.
          Governing Law** These Terms are governed by the laws of Montana. **10.
          Contact** For inquiries, email: customerservice@wearecgs.com
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text="Close Dialog" @click="termsDialog.value = false"></v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="privacyDialog" max-width="500">
      <v-card title="Privacy Policy">
        <v-card-text>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            text="Close Dialog"
            @click="privacyDialog.value = false"
          ></v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>


<script setup lang="ts">
import { ref, inject } from "vue";
import { useRouter } from "vue-router";
import md5 from "js-md5"; // Certifique-se de que md5 esteja instalado e importado corretamente.
import type { VForm } from "vuetify/components";
import { flatMap } from "lodash-es";

const regForm = ref<VForm>();
const router = useRouter();
const activeTab = ref<number>(1);
const login = ref<string>("");
const password = ref<string>("");
const signupUsername = ref<string>("");
const signupEmail = ref<string>("");
const signupPassword = ref<string>("");
const signupConfirmPassword = ref<string>("");
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

const rules = {
  required: (value: string) => !!value || "Required.",
  email: (value: string) => /.+@.+\..+/.test(value) || "E-mail must be valid",
  min: (v: string) => v.length >= 3 || "Min 8 characters",
  matchPasswords: (v: string) =>
    v === signupPassword.value || "The passwords must match",
};

const axios: any = inject("axios");
const url: string = inject("apiUrl");

const setAllert = (icon: string, title: string, text: string, type: string) => {
  alertIcon.value = icon;
  alertTitle.value = title;
  alertText.value = text;
  showAlert.value = true;
  alertType.value = type;
};

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
  console.log(axios, url);

  await axios
    .post(url + "users/login", {
      login: login.value,
      password: md5(password.value),
      // senha: skipMd5.value ? password.value : md5(password.value),
    })
    .then((response) => {
      console.log(response);
      setAllert("mdi-check", response.status, response.data.message, "success");
      router.push({ name: "Dashboard" });
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
  }
};
</script>

