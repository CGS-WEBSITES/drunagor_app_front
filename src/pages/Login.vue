<template>
  <v-container
    class="login-page fill-height d-flex align-center justify-center pa-4"
    fluid
  >
    <v-row justify="center" class="w-100">
      <v-col cols="12" md="8" lg="7" xl="6">
        <v-card color="secundary" class="auth-card elevation-12">
          <v-card-text class="pa-0">
            <div v-if="activeTab === 0" class="auth-section">
              <div class="auth-header">
                <v-img
                  src="@/assets/darkness_white.svg"
                  max-width="56"
                  class="mx-auto mb-4"
                />
                <h1 class="text-center text-h4 font-weight-bold mb-2">
                  Welcome back!
                </h1>
              </div>

              <div class="auth-body">
                <BaseAlert
                  v-model="showAlert"
                  :type="alertType"
                  :icon="alertIcon"
                  :title="alertTitle"
                  class="mb-6"
                >
                  {{ alertText }}
                </BaseAlert>

                <v-form>
                  <v-text-field
                    label="Email or Username"
                    v-model="login"
                    prepend-inner-icon="mdi-email"
                    color="secundary"
                    variant="outlined"
                    density="comfortable"
                    hide-details="auto"
                    class="mb-4"
                  />
                  <v-text-field
                    label="Password"
                    v-model="password"
                    prepend-inner-icon="mdi-lock"
                    :append-inner-icon="showPass ? 'mdi-eye' : 'mdi-eye-off'"
                    :type="showPass ? 'text' : 'password'"
                    color="secundary"
                    variant="outlined"
                    density="comfortable"
                    hide-details="auto"
                    @click:append-inner="showPass = !showPass"
                    @keyup.enter="loginUser"
                  />
                </v-form>

                <p
                  class="auth-link text-center mt-4 mb-0"
                  @click="navigateTo('/forgotpassword')"
                >
                  Forgot your password?
                </p>

                <v-btn
                  class="mt-8"
                  color="black"
                  block
                  size="large"
                  :loading="isLoggingIn"
                  :disabled="isLoggingIn"
                  @click="loginUser"
                >
                  LOGIN
                </v-btn>

                <p class="auth-footer text-caption text-center mt-4 mb-0">
                  Don't have an account?
                </p>

                <v-btn
                  color="secundary"
                  class="mt-2"
                  variant="outlined"
                  block
                  @click="signupChoiceDialog = true"
                >
                  SIGN UP
                </v-btn>
              </div>
            </div>

            <div v-else class="auth-section">
              <div class="auth-header">
                <v-img
                  src="@/assets/darkness_white.svg"
                  max-width="56"
                  class="mx-auto mb-4"
                />
                <h1 class="text-center text-h4 font-weight-bold mb-2">
                  Create an Account
                </h1>
              </div>

              <div class="auth-body">
                <BaseAlert
                  v-model="showAlert"
                  :type="alertType"
                  :icon="alertIcon"
                  :title="alertTitle"
                  class="mb-6"
                >
                  {{ alertText }}
                </BaseAlert>

                <v-form ref="regForm">
                  <v-row>
                    <v-col cols="12" sm="6">
                      <v-text-field
                        label="Username"
                        v-model="signupUsername"
                        prepend-inner-icon="mdi-account"
                        :rules="[rules.required]"
                        color="secundary"
                        variant="outlined"
                        density="comfortable"
                        hide-details="auto"
                      />
                    </v-col>
                    <v-col cols="12" sm="6">
                      <v-text-field
                        label="Email"
                        v-model="signupEmail"
                        prepend-inner-icon="mdi-email"
                        type="email"
                        :rules="[rules.required, rules.email]"
                        color="secundary"
                        variant="outlined"
                        density="comfortable"
                        hide-details="auto"
                      />
                    </v-col>
                  </v-row>

                  <v-row>
                    <v-col cols="12" sm="6">
                      <v-text-field
                        label="Password"
                        v-model="signupPassword"
                        prepend-inner-icon="mdi-lock"
                        :append-inner-icon="showSignupPass ? 'mdi-eye' : 'mdi-eye-off'"
                        :type="showSignupPass ? 'text' : 'password'"
                        :rules="[rules.required, rules.min]"
                        color="secundary"
                        variant="outlined"
                        density="comfortable"
                        hide-details="auto"
                        @click:append-inner="showSignupPass = !showSignupPass"
                      />
                    </v-col>
                    <v-col cols="12" sm="6">
                      <v-text-field
                        label="Confirm Password"
                        v-model="signupConfirmPassword"
                        prepend-inner-icon="mdi-lock-check"
                        :type="showSignupPass ? 'text' : 'password'"
                        :rules="[rules.required, rules.matchPasswords]"
                        color="secundary"
                        variant="outlined"
                        density="comfortable"
                        hide-details="auto"
                      />
                    </v-col>
                  </v-row>

                  <div class="terms-box mt-2">
                    <div class="terms-check">
                      <v-checkbox
                        v-model="agreeTerms"
                        color="green"
                        hide-details
                      />
                    </div>
                    <p class="terms-copy mb-0">
                      I have read and agree to the
                      <strong
                        class="auth-link-inline"
                        @click="termsDialog = true"
                      >
                        terms and conditions
                      </strong>
                    </p>
                  </div>

                  <p
                    class="auth-link auth-link-retailer text-center mt-4 mb-0"
                    @click="navigateTo('/retailer-registration')"
                  >
                    Register as a retailer
                  </p>

                  <v-btn
                    class="mt-6"
                    color="black"
                    block
                    size="large"
                    :loading="isSigningUp"
                    :disabled="isSigningUp"
                    @click="submitForm"
                  >
                    SIGN UP
                  </v-btn>

                  <p class="auth-footer text-caption text-center mt-4 mb-0">
                    Already have an account?
                  </p>

                  <v-btn
                    color="secundary"
                    variant="outlined"
                    class="mt-2"
                    block
                    @click="activeTab = 0"
                  >
                    LOGIN
                  </v-btn>
                </v-form>
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-dialog v-model="termsDialog" max-width="500">
      <terms-card @close="termsDialog = false" />
    </v-dialog>

    <v-dialog v-model="privacyDialog" max-width="500">
      <privacy-card />
    </v-dialog>

    <!-- Signup Type Choice Dialog -->
    <v-dialog v-model="signupChoiceDialog" max-width="580" transition="dialog-bottom-transition">
      <v-card class="signup-dialog-card rounded-xl pa-6 text-center" color="primary">
        <!-- Close Button -->
        <v-btn
          icon="mdi-close"
          variant="text"
          color="white"
          class="position-absolute"
          style="right: 12px; top: 12px; z-index: 10;"
          @click="signupChoiceDialog = false"
        ></v-btn>

        <h3 class="text-h4 font-weight-black text-white cinzel-text mb-2 pt-2">
          JOIN THE ADVENTURE
        </h3>
        <p class="text-body-2 text-grey-lighten-2 mb-6 px-4">
          Choose your path to begin your descent into the Underkeep.
        </p>

        <v-row class="ma-0 ga-4 justify-center">
          <!-- User Account Card -->
          <v-col cols="12" sm="5" class="pa-0">
            <v-card
              class="choice-card h-100 pa-5 d-flex flex-column align-center justify-space-between rounded-xl cursor-pointer"
              variant="flat"
              @click="selectSignup('user')"
            >
              <div class="choice-icon-wrapper mb-4">
                <v-icon size="48" color="amber-accent-2">mdi-sword-cross</v-icon>
              </div>
              <div class="flex-grow-1 d-flex flex-column justify-center mb-4">
                <h4 class="text-h6 font-weight-black text-white mb-2 cinzel-text">User Account</h4>
              </div>
              <v-btn
                color="amber-accent-2"
                variant="outlined"
                rounded="pill"
                class="font-weight-bold text-white btn-choice"
                block
              >
                Create Account
              </v-btn>
            </v-card>
          </v-col>

          <!-- Retailer Account Card -->
          <v-col cols="12" sm="5" class="pa-0">
            <v-card
              class="choice-card h-100 pa-5 d-flex flex-column align-center justify-space-between rounded-xl cursor-pointer"
              variant="flat"
              @click="selectSignup('retailer')"
            >
              <div class="choice-icon-wrapper mb-4">
                <v-icon size="48" color="amber-accent-2">mdi-store</v-icon>
              </div>
              <div class="flex-grow-1 d-flex flex-column justify-center mb-4">
                <h4 class="text-h6 font-weight-black text-white mb-2 cinzel-text">Retailer Account</h4>
              </div>
              <v-btn
                color="amber-accent-2"
                variant="outlined"
                rounded="pill"
                class="font-weight-bold text-white btn-choice"
                block
              >
                Create Account
              </v-btn>
            </v-card>
          </v-col>
        </v-row>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup lang="ts">
import { ref, inject, watch, onMounted, onBeforeMount } from "vue";
import { useRouter, useRoute } from "vue-router";
import md5 from "js-md5";
import type { VForm } from "vuetify/components";
import TermsCard from "@/components/TermsCard.vue";
import PrivacyCard from "@/components/PrivacyCard.vue";
import { setToken } from "@/service/AccessToken";
import { useUserStore } from "@/store/UserStore";
import type { User } from "@/store/UserStore";
import BaseAlert from "@/components/Alerts/BaseAlert.vue";

const userStore = useUserStore();

const regForm = ref<VForm>();
const router = useRouter();
const route = useRoute();
const activeTab = ref<number>(1);
const login = ref<string>("");
const password = ref<string>("");
const signupUsername = ref<string>("");
const signupEmail = ref<string>("");
const signupPassword = ref<string>("");
const signupConfirmPassword = ref<string>("");
const agreeTerms = ref<boolean>(false);
const regValid = ref<boolean>(false);
const termsDialog = ref(false);
const alertIcon = ref("");
const alertText = ref("");
const alertTitle = ref("");
const alertType = ref("");
const showAlert = ref(false);
const showPass = ref(false);
const showSignupPass = ref(false);
const privacyDialog = ref(false);
const isLoggingIn = ref(false);
const isSigningUp = ref(false);
const signupChoiceDialog = ref(false);

const selectSignup = (type: "user" | "retailer") => {
  signupChoiceDialog.value = false;
  if (type === "user") {
    activeTab.value = 1;
  } else {
    navigateTo("/retailer-registration");
  }
};

const navigateTo = (route: string) => {
  router.push(route);
};

const rules = {
  required: (value: string) => !!value || "Required.",
  email: (value: string) => /.+@.+\..+/.test(value) || "E-mail must be valid",
  min: (value: string) => value.length >= 8 || "Min 8 characters",
  matchPasswords: (value: string) =>
    value === signupPassword.value || "The passwords must match",
};

const axios: any = inject("axios");

const trimValue = (value: string) => value?.trim?.() || "";

const sanitizeAuthFields = () => {
  login.value = trimValue(login.value);
  password.value = trimValue(password.value);
  signupUsername.value = trimValue(signupUsername.value);
  signupEmail.value = trimValue(signupEmail.value);
  signupPassword.value = trimValue(signupPassword.value);
  signupConfirmPassword.value = trimValue(signupConfirmPassword.value);
};

const setAllert = (icon: string, title: string, text: string, type: string) => {
  alertIcon.value = icon;
  alertTitle.value = title;
  alertText.value = text;
  showAlert.value = true;
  alertType.value = type;

  setTimeout(() => {
    showAlert.value = false;
  }, 4000);
};

watch(
  () => route.query.tab,
  (newTab) => {
    activeTab.value = newTab === "signup" ? 1 : 0;
  },
  { immediate: true },
);

onMounted(() => {
  activeTab.value = route.query.tab === "signup" ? 1 : 0;
});

const loginUser = async () => {
  sanitizeAuthFields();

  if (!login.value || !password.value) {
    setAllert(
      "mdi-alert-circle",
      "400",
      "The email and password fields were not filled out correctly.",
      "warning",
    );
    return;
  }

  isLoggingIn.value = true;

  try {
    const response = await axios.post("users/login", {
      login: login.value,
      password: md5(password.value),
    });

    const dbUser = response.data.data;

    const appUser: User = {
      email: dbUser.email,
      google_id: dbUser.google_id,
      name: dbUser.name,
      picture_hash: dbUser.picture_hash,
      background_hash: dbUser.background_hash,
      roles_fk: dbUser.roles_fk,
      user_name: dbUser.user_name,
      users_pk: dbUser.users_pk,
      verified: dbUser.verified,
      zip_code: dbUser.zipcode,
      countries_fk: dbUser.countries_fk,
      join_date: dbUser.join_date,
      timezone: dbUser.timezone ?? null,
    };

    userStore.setUser(appUser);

    setAllert(
      "mdi-check",
      response.status.toString(),
      response.data.message,
      "success",
    );

    setToken(response.data.access_token);
    axios.defaults.headers.common["Authorization"] =
      `Bearer ${response.data.access_token}`;

    router.push({ name: "Dashboard" });
  } catch (error: any) {
    console.error("Error during login:", error);
    setAllert(
      "mdi-alert-circle",
      error.response?.status?.toString() || "500",
      error.response?.data?.message || "A network error occurred.",
      "error",
    );
  } finally {
    isLoggingIn.value = false;
  }
};

const valReg = async () => {
  sanitizeAuthFields();
  const { valid } = await regForm.value?.validate();
  regValid.value = valid;
};

const submitForm = async () => {
  sanitizeAuthFields();
  await valReg();

  if (!regValid.value) {
    return;
  }

  if (!agreeTerms.value) {
    setAllert(
      "mdi-alert-circle",
      "400",
      "You must agree to the terms and conditions.",
      "warning",
    );
    return;
  }

  isSigningUp.value = true;

  try {
    const response = await axios.post("users/cadastro", {
      name: signupUsername.value,
      user_name: signupUsername.value,
      email: signupEmail.value,
      password: signupConfirmPassword.value,
      roles_fk: 2,
      active: true,
      verified: false,
      agreement: true,
    });

    setAllert(
      "mdi-check",
      response.status.toString(),
      response.data.message,
      "success",
    );
    activeTab.value = 0;
  } catch (error: any) {
    setAllert(
      "mdi-alert-circle",
      error.response?.status?.toString() || "500",
      error.response?.data?.message || "An error occurred",
      "error",
    );
  } finally {
    isSigningUp.value = false;
  }
};

onBeforeMount(() => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    setToken(token);
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    router.push({ name: "Dashboard" });
  }
});
</script>

<style scoped>
.login-page {
  background-image: url("https://assets.drunagor.app/backgrounds/login-background.png");
  background-size: cover;
  background-position: top center;
  background-repeat: no-repeat;
  min-height: 100vh;
}

.auth-card {
  border-radius: 24px;
  overflow: hidden;
}

.auth-section {
  background: rgb(var(--v-theme-secundary));
}

.auth-header {
  padding: 36px 32px 20px;
  background: rgb(var(--v-theme-secundary));
  color: white;
}

.auth-body {
  padding: 12px 32px 32px;
  background: rgb(var(--v-theme-secundary));
}

.auth-link,
.auth-link-inline {
  color: #4fd1c5;
  cursor: pointer;
  font-weight: 700;
}

.auth-link-retailer {
  font-size: 1rem;
  font-weight: 800;
}

.auth-footer {
  color: rgba(255, 255, 255, 0.68);
}

.terms-box {
  display: flex;
  align-items: center;
  gap: 10px;
  padding-top: 8px;
}

.terms-check {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 34px;
  flex-shrink: 0;
}

.terms-copy {
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.6;
}

@media (max-width: 600px) {
  .auth-header {
    padding: 28px 20px 18px;
  }

  .auth-body {
    padding: 10px 20px 24px;
  }

  .terms-box {
    gap: 6px;
    align-items: flex-start;
  }
}

.signup-dialog-card {
  background: rgba(20, 20, 20, 0.9) !important;
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.8) !important;
}

.choice-card {
  background: rgba(255, 255, 255, 0.03) !important;
  border: 1px solid rgba(255, 255, 255, 0.05);
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2) !important;
}

.choice-card:hover {
  transform: translateY(-6px);
  background: rgba(255, 255, 255, 0.06) !important;
  border-color: rgba(255, 215, 0, 0.3);
  box-shadow: 0 12px 24px rgba(255, 215, 0, 0.08) !important;
}

.choice-icon-wrapper {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 50%;
  padding: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.choice-card:hover .choice-icon-wrapper {
  background: rgba(255, 215, 0, 0.05);
  border-color: rgba(255, 215, 0, 0.2);
  transform: scale(1.05);
}

.btn-choice {
  border-width: 2px !important;
  transition: all 0.3s ease;
}

.choice-card:hover .btn-choice {
  background-color: rgb(255, 215, 0) !important;
  color: black !important;
  border-color: rgb(255, 215, 0) !important;
  box-shadow: 0 0 14px rgba(255, 215, 0, 0.4);
}
</style>
