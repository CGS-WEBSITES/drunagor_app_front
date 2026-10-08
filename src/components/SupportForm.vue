<template>
  <div class="d-flex justify-center w-100 pa-0">
    <v-container max-width="804" class="py-4">
      <v-card class="account-card" elevation="2">
        <!-- Header: Toggle only if NOT embedded -->
        <v-card-title
          class="d-flex justify-space-between align-center"
          :style="{ cursor: embed ? 'default' : 'pointer' }"
          @click="!embed && toggleForm()"
        >
          <span class="support-title">
            <v-icon size="22">mdi-lifebuoy</v-icon>
            Contact support
          </span>
          <v-icon v-if="!embed">
            {{ isExpanded ? "mdi-chevron-up" : "mdi-chevron-down" }}
          </v-icon>
        </v-card-title>

        <!-- Form content (always visible if embedded, otherwise toggled) -->
        <v-expand-transition>
          <v-card-text v-if="embed || isExpanded">
            <div class="mb-4 text-body-2 text-grey-lighten-2 pl-3">
              Need help? Describe your request below. We will send an email to our support team and get back to you shortly.
            </div>

            <v-form ref="formRef" v-model="isFormValid">
              <!-- Email choice -->
              <p class="support-label">Reply to</p>
              <div class="support-choice mb-3 mx-3">
                <button type="button" :class="{ active: emailOption === 'account' }" @click="emailOption = 'account'">My account email</button>
                <button type="button" :class="{ active: emailOption === 'custom' }" @click="emailOption = 'custom'">Another email</button>
              </div>

              <div class="px-3 mb-4">
                <v-text-field
                  v-if="emailOption === 'custom'"
                  v-model="customEmail"
                  label="Enter contact email"
                  variant="solo-filled"
                  :rules="[rules.required, rules.email]"
                  color="secundary"
                  hide-details="auto"
                ></v-text-field>

                <v-text-field
                  v-else
                  :model-value="accountEmail"
                  variant="solo-filled"
                  readonly
                  prepend-inner-icon="mdi-email-outline"
                  hide-details
                ></v-text-field>
              </div>

              <!-- Message -->
              <p class="support-label">How can we help?</p>
              <div class="px-3">
                <v-textarea
                  v-model="message"
                  label=""
                  variant="solo-filled"
                  :rules="[rules.required, rules.minChar]"
                  rows="5"
                  placeholder="Please detail your issue or request here..."
                  class="mb-4"
                  hide-details="auto"
                ></v-textarea>
              </div>
            </v-form>

            <!-- Action buttons -->
            <v-card-actions class="px-3">
              <v-btn
                color="playbutton"
                variant="flat"
                size="large"
                block
                class="font-weight-bold"
                prepend-icon="mdi-send"
                :disabled="!isFormValid || loading"
                :loading="loading"
                @click="sendSupport"
              >
                Send request
              </v-btn>
              <v-btn v-if="!embed" color="red" text @click="cancelForm">
                Cancel
              </v-btn>
            </v-card-actions>
          </v-card-text>
        </v-expand-transition>
      </v-card>
    </v-container>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, inject } from "vue";
import { useUserStore } from "@/store/UserStore";
import { useToast } from "primevue/usetoast";

const axios: any = inject("axios");

const props = defineProps({
  embed: {
    type: Boolean,
    default: false,
  },
});

const userStore = useUserStore();
const toast = useToast();

const isExpanded = ref(false);
const formRef = ref<any>(null);
const isFormValid = ref(false);
const loading = ref(false);

const emailOption = ref<"account" | "custom">("account");
const customEmail = ref("");
const message = ref("");

const accountEmail = computed(() => userStore.user?.email || "");
const isRetailer = computed(() => userStore.user?.roles_fk === 3);

const targetEmail = computed(() => {
  return emailOption.value === "account" ? accountEmail.value : customEmail.value;
});

const rules = {
  required: (value: any) => !!value || "This field is required",
  minChar: (value: any) => (value && value.length >= 10) || "Message must be at least 10 characters long",
  email: (value: any) => {
    const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return pattern.test(value) || "Invalid e-mail format";
  },
};

const toggleForm = () => {
  isExpanded.value = !isExpanded.value;
};

const cancelForm = () => {
  isExpanded.value = false;
  resetForm();
};

const resetForm = () => {
  message.value = "";
  customEmail.value = "";
  emailOption.value = "account";
  loading.value = false;
  if (formRef.value) {
    formRef.value.resetValidation();
  }
};

const sendSupport = async () => {
  if (!isFormValid.value) return;

  const email = targetEmail.value;
  if (!email || rules.email(email) !== true) {
    toast.add({
      severity: "error",
      summary: "Invalid Email",
      detail: "The reply email address is invalid or missing.",
      life: 5000,
    });
    return;
  }

  loading.value = true;
  try {
    await axios.post("/support/send", {
      user_email: email,
      message: message.value,
      is_retailer: isRetailer.value,
    });

    toast.add({
      severity: "success",
      summary: "Support Request Sent",
      detail: "Your message has been sent to our IT support team successfully.",
      life: 5000,
    });

    resetForm();
    if (!props.embed) {
      isExpanded.value = false;
    }
  } catch (error: any) {
    console.error("Error sending support request:", error);
    toast.add({
      severity: "error",
      summary: "Submission Failed",
      detail: error.response?.data?.message || "There was an error sending your support request. Please try again.",
      life: 5000,
    });
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.opacity-70 {
  opacity: 0.7;
}
.support-title {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px;
  font-size: 1.15rem;
  font-weight: 800;
}
.support-label {
  margin: 4px 12px 8px;
  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 0.6px;
  text-transform: uppercase;
  opacity: 0.75;
}
.support-choice {
  display: flex;
  gap: 4px;
  padding: 4px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 10px;
}
.support-choice button {
  flex: 1;
  height: 40px;
  border-radius: 8px;
  font-size: 0.8rem;
  font-weight: 600;
  opacity: 0.7;
}
.support-choice button.active {
  background: rgb(var(--v-theme-terciary));
  color: rgb(var(--v-theme-on-terciary));
  opacity: 1;
}
</style>
