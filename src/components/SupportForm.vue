<template>
  <v-col cols="12" class="d-flex justify-center pa-0">
    <v-container max-width="804" class="py-4">
      <v-card color="primary" elevation="2" rounded="lg">
        <!-- Header: Toggle only if NOT embedded -->
        <v-card-title
          class="d-flex justify-space-between align-center"
          :style="{ cursor: embed ? 'default' : 'pointer' }"
          @click="!embed && toggleForm()"
        >
          <span class="text-h5 font-weight-black pl-2 pt-2 pb-2 text-uppercase cinzel-font">
            Support (SAC)
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
              <p class="text-h6 font-weight-medium pl-3 pb-3 pt-2">Reply Email</p>
              <v-radio-group v-model="emailOption" density="compact" hide-details class="mb-4 pl-3">
                <v-radio
                  label="Use account email"
                  value="account"
                  color="secundary"
                  class="text-white"
                ></v-radio>
                <v-radio
                  label="Use a different email"
                  value="custom"
                  color="secundary"
                  class="text-white"
                ></v-radio>
              </v-radio-group>

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
                  :value="accountEmail"
                  label="Account email"
                  variant="solo-filled"
                  disabled
                  class="opacity-70"
                  hide-details
                ></v-text-field>
              </div>

              <!-- Message -->
              <p class="text-h6 font-weight-medium pl-3 pb-3 pt-0">How can we help you?</p>
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
                color="green"
                class="px-6 font-weight-bold"
                :disabled="!isFormValid || loading"
                :loading="loading"
                @click="sendSupport"
              >
                Send Request
              </v-btn>
              <v-btn v-if="!embed" color="red" text @click="cancelForm">
                Cancel
              </v-btn>
            </v-card-actions>
          </v-card-text>
        </v-expand-transition>
      </v-card>
    </v-container>
  </v-col>
</template>

<script lang="ts" setup>
import { ref, computed, inject } from "vue";
import { useUserStore } from "@/store/UserStore";
import { useToast } from "primevue/usetoast";

const props = defineProps({
  embed: {
    type: Boolean,
    default: false,
  },
});

const userStore = useUserStore();
const toast = useToast();
const axios: any = inject("axios");

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

  loading.value = true;
  try {
    await axios.post("/support/send", {
      user_email: targetEmail.value,
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
.cinzel-font {
  font-family: "Cinzel", serif !important;
}

.opacity-70 {
  opacity: 0.7;
}
</style>
