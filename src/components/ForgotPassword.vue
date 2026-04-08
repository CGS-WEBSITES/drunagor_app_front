<template>
  <v-container
    class="forgot-password-page fill-height d-flex align-center justify-center pa-4"
    fluid
  >
    <v-row justify="center" class="w-100">
      <v-col cols="12" md="8" lg="7" xl="6">
        <v-card color="secundary" class="forgot-card elevation-12">
          <v-card-text class="pa-0">
            <section class="forgot-header">
              <v-btn
                icon
                variant="text"
                color="white"
                class="back-button"
                @click="navigateTo('/')"
              >
                <v-icon>mdi-arrow-left</v-icon>
              </v-btn>

              <v-img
                src="@/assets/darkness_white.svg"
                max-width="56"
                class="mx-auto mb-4"
              />

              <h1 class="text-center text-h4 font-weight-bold mb-2">
                Reset Your Password
              </h1>
            </section>

            <section class="forgot-body">
              <BaseAlert
                v-model="showAlert"
                :type="alertType"
                :icon="alertIcon"
                :title="alertTitle"
                class="mb-6"
              >
                {{ alertText }}
              </BaseAlert>

              <p class="forgot-copy text-center mb-6">
                Enter the email linked to your account and we'll send you reset instructions.
              </p>

              <v-form>
                <v-text-field
                  label="Email"
                  prepend-inner-icon="mdi-email"
                  type="email"
                  v-model="email"
                  color="secundary"
                  variant="outlined"
                  density="comfortable"
                  hide-details="auto"
                  :rules="[rules.required, rules.email]"
                />
              </v-form>

              <v-btn
                class="mt-6"
                color="black"
                block
                size="large"
                :loading="isSubmitting"
                :disabled="isSubmitting"
                @click="loginUser"
              >
                RESET PASSWORD
              </v-btn>
            </section>
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
import TermsCard from "@/components/TermsCard.vue";
import PrivacyCard from "@/components/PrivacyCard.vue";
import BaseAlert from "@/components/Alerts/BaseAlert.vue";

const router = useRouter();
const email = ref<string>("");
const alertIcon = ref("");
const alertText = ref("");
const alertTitle = ref("");
const alertType = ref("");
const showAlert = ref(false);
const termsDialog = ref(false);
const privacyDialog = ref(false);
const isSubmitting = ref(false);

const navigateTo = (route: string) => {
  router.push(route);
};

const rules = {
  required: (value: string) => !!value || "Required.",
  email: (value: string) => /.+@.+\..+/.test(value) || "E-mail must be valid",
};

const axios: any = inject("axios");

const trimValue = (value: string | null | undefined) => value?.trim?.() || "";

const sanitizeForgotPasswordFields = () => {
  email.value = trimValue(email.value);
};

const setAllert = (icon: string, title: string | number, text: string, type: string) => {
  alertIcon.value = icon;
  alertTitle.value = String(title);
  alertText.value = text;
  showAlert.value = true;
  alertType.value = type;

  setTimeout(() => {
    showAlert.value = false;
  }, 4000);
};

const loginUser = async () => {
  sanitizeForgotPasswordFields();

  if (!email.value) {
    setAllert("mdi-alert-circle", 400, "Email field is required.", "warning");
    return;
  }

  isSubmitting.value = true;

  try {
    const response = await axios.post("users/reset_password", {
      email: email.value,
    });

    setAllert(
      "mdi-check",
      response.status,
      response.data.message,
      "success",
    );
  } catch (error: any) {
    console.error("Error during password reset:", error);
    setAllert(
      "mdi-alert-circle",
      error.response?.status || 500,
      error.response?.data?.message || "A network error occurred.",
      "error",
    );
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<style scoped>
.forgot-password-page {
  background-image: url("https://assets.drunagor.app/backgrounds/login-background.png");
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  min-height: 100vh;
}

.forgot-card {
  border-radius: 24px;
  overflow: hidden;
}

.forgot-header {
  position: relative;
  padding: 36px 32px 20px;
  background: rgb(var(--v-theme-secundary));
  color: white;
}

.forgot-body {
  padding: 12px 32px 32px;
  background: rgb(var(--v-theme-secundary));
}

.forgot-copy {
  color: rgba(255, 255, 255, 0.78);
  line-height: 1.6;
}

.back-button {
  position: absolute;
  top: 20px;
  left: 20px;
}

@media (max-width: 600px) {
  .forgot-header {
    padding: 28px 20px 18px;
  }

  .forgot-body {
    padding: 10px 20px 24px;
  }
}
</style>
