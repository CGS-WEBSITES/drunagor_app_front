<template>
  <v-col cols="12" class="d-flex justify-center pa-0">
    <v-container max-width="804" class="py-4">
      <!-- Card com funcionalidade de colapsar -->
      <v-card color="primary" elevation="2" rounded="lg">
        <!-- Cabeçalho com título e seta -->
        <v-card-title
          class="d-flex justify-space-between align-center"
          @click="toggleForm"
        >
          <span class="text-h5 font-weight-black pl-2 pt-2 pb-2 text-uppercase"
            >MY ACCOUNT</span
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
              <p class="text-h6 font-weight-medium pl-3 pb-3 pt-0">Name</p>
              <v-text-field label="" variant="solo-filled" v-model="form.name" class="mb-0"></v-text-field>

              <p class="text-h6 font-weight-medium pl-3 pb-3 pt-0">Username</p>
              <v-text-field label="" variant="solo-filled" v-model="form.user_name" class="mb-0"></v-text-field>

              <!-- Email -->
              <p class="text-h6 font-weight-medium pl-3 pb-3 pt-0">Email</p>
              <v-row no-gutters>
                <v-col cols="10" sm="11">
                  <v-text-field
                    :disabled="!changeEmail"
                    label=""
                    variant="solo-filled"
                    v-model="form.new_email"
                    :rules="[rules.email]"
                    class="mb-0"
                  ></v-text-field>
                </v-col>
                <v-col
                  cols="2"
                  sm="1"
                  class="d-flex justify-center align-center"
                >
                  <v-icon @click="changeEmail = !changeEmail" class="mb-4"
                    >mdi-pencil</v-icon
                  >
                </v-col>
              </v-row>

              <v-row v-if="changeEmail" no-gutters>
                <v-col>
                  <p class="text-h6 font-weight-medium pl-3 pb-3 pt-0">
                    Confirm Email
                  </p>
                  <v-text-field
                    label=""
                    variant="solo-filled"
                    v-model="form.confirm_email"
                    :rules="[rules.matchEmails]"
                    class="mb-0"
                  ></v-text-field>
                </v-col>
              </v-row>

              <!-- Switch para atualizações por email -->
              <v-switch
                v-model="form.email_updates"
                label="Send email updates for friend requests, events next to you and app updates."
                inset
                class="mb-0"
                color="green"
              ></v-switch>

              <v-row no-gutters>
                <v-col cols="12">
                  <p class="text-h6 font-weight-medium pl-3 pb-3 pt-0">
                    Country
                  </p>
                  <v-autocomplete
                    v-model="form.country"
                    :items="countriesList"
                    item-title="name"
                    item-value="name"
                    variant="solo-filled"
                    label="Select or type a country"
                    class="mb-0"
                  ></v-autocomplete>
                </v-col>
              </v-row>

              <!-- CEP -->
              <p
                v-if="form.country === 'US'"
                class="text-h6 font-weight-medium pl-3 pb-3 pt-0">
                Zipcode
              </p>
              <v-text-field 
                v-if="form.country === 'US'"
                label="" 
                variant="solo-filled" 
                v-model="form.zip_code" 
                class="mb-0"
              ></v-text-field>

              <v-row no-gutters>
                <v-col cols="12">
                  <p class="text-h6 font-weight-medium pl-3 pb-3 pt-0">
                    Password
                  </p>
                </v-col>
                <v-col cols="10" sm="11">
                  <v-text-field
                    label=""
                    variant="solo-filled"
                    v-model="form.new_password"
                    class="mb-0"
                    :rules="changePassword ? [rules.min] : []"
                    type="password"
                    :disabled="!changePassword"
                  ></v-text-field>
                </v-col>
                <v-col
                  cols="2"
                  sm="1"
                  class="d-flex justify-center align-start pt-5"
                >
                  <v-icon
                    class="olho"
                    tag="i"
                    @click="changePassword = !changePassword"
                    >mdi-pencil</v-icon
                  >
                </v-col>
              </v-row>

              <v-row no-gutters v-if="changePassword">
                <v-col cols="12">
                  <p class="text-h6 font-weight-medium pl-3 pb-3 pt-0">
                    Confirm New Password
                  </p>
                </v-col>
                <v-col cols="10" sm="11">
                  <v-text-field
                    label=""
                    variant="solo-filled"
                    :type="showPass ? 'text' : 'password'"
                    v-model="form.confirm_password"
                    class="mb-0"
                    :rules="[rules.matchPasswords]"
                  ></v-text-field>
                </v-col>
                <v-col
                  cols="2"
                  sm="1"
                  class="d-flex justify-center align-start pt-5"
                >
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
import { ref, inject, onMounted } from "vue";

import { useUserStore } from "@/store/UserStore";
import type { VForm } from "vuetify/components";
import { getToken } from "@/service/AccessToken";
import { create } from "lodash-es";

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
  confirm_email: user.email,
  email_updates: user.email_updates,
  new_password: "",
  confirm_password: "",
  country: user.countries_fk || null,
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

interface Country {
  countries_pk: number;
  name: string;
  abbreviation: string;
}

const countriesList = ref<Country[]>([]);

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
          users_pk: user.users_pk,
          name: form.name,
          user_name: form.user_name,
          zip_code: form.zip_code,
          email: changeEmail.value ? form.confirm_email : user.email,
          receive_email: form.email_updates,
          password: changePassword.value ? form.confirm_password : undefined,
          countries_fk: countriesList.value.find(country => country.name === form.country)?.countries_pk,
        },
        {
          headers: getToken(),
        }
      )
      .then((response: any) => {
        console.log("API Response:", response);

        const dbUser = response.data.data;
        userStore.setUser({ ...user, ...dbUser });

        setAllert("mdi-check", response.status, response.data.message, "success");
      })
      .catch((error: any) => {
        console.error("Erro ao salvar usuário:", error);
        setAllert(
          "mdi-alert-circle",
          error.response?.status || 500,
          error.response?.data?.message || "Erro de rede.",
          "error"
        );
      });
  }
};

const fetchCountries = () => {
  axios.get("countries/search")
    .then((response: any) => {
      countriesList.value = response.data.countries.map((country: any) => ({
        countries_pk: country.countries_pk,
        name: country.name,
        abbreviation: country.abbreviation,
      }));

      const userCountry = countriesList.value.find(
        (country) => country.countries_pk === form.country
      );

      form.country = userCountry ? userCountry.name : "";
    })
    .catch((error: any) => {
      console.error("Erro ao buscar países:", error);
    });
};

onMounted(() => {
  fetchCountries();
});

const cancelForm = () => {
  console.log("Form Cancelled");
};
</script>