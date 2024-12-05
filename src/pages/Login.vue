<template>
  <v-container class="fill-height" fluid>
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
                <v-container class="text-center">
                  <v-row justify="center">
                    <v-col cols="12" class="text-center">
                      <v-img
                        src="@/assets/darkness.png"
                        max-width="50"
                        alt="Welcome Back Icon"
                        class="mx-auto"
                      ></v-img>
                    </v-col>
                    <v-col cols="12">
                      <h1 class="text-center display-2">Welcome Back!</h1>
                    </v-col>
                  </v-row>
                </v-container>
                <h4 class="text-center mt-4">
                  Ensure your email for registration
                </h4>
                <v-form>
                  <v-text-field
                    label="Email"
                    prepend-icon="mdi-email"
                    type="text"
                    v-model="loginEmail"
                    color="black"
                  />
                  <v-text-field
                    label="Password"
                    prepend-icon="mdi-lock"
                    type="password"
                    v-model="loginPassword"
                    color="black"
                  />
                </v-form>
                <h3 class="text-center mt-4">Forgot your password?</h3>
                <v-btn class="mt-4" color="black" dark block> SIGN IN </v-btn>
              </v-card-text>
            </v-tab-item>

            <!-- Sign Up Tab -->
            <v-tab-item :value="1">
              <v-card-text v-if="activeTab === 1">
                <v-container class="text-center">
                  <v-row justify="center">
                    <v-col cols="12" class="text-center">
                      <v-img
                        src="@/assets/darkness.png"
                        max-width="50"
                        alt="Create Account Icon"
                        class="mx-auto"
                      ></v-img>
                    </v-col>
                    <v-col cols="12">
                      <h1 class="text-center display-2">
                        Create an User Account
                      </h1>
                    </v-col>
                  </v-row>
                </v-container>

                <h4 class="text-center mt-4">
                  Ensure your email for registration
                </h4>

                <v-form ref="form">
                  <v-row>
                    <v-col cols="12" sm="6">
                      <v-text-field
                        label="Username"
                        v-model="signupUsername"
                        prepend-icon="mdi-account"
                        :rules="[rules.required]"
                        color="black"
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
                      />
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="12" sm="6">
                      <v-text-field
                        label="Password"
                        v-model="signupPassword"
                        prepend-icon="mdi-lock"
                        type="password"
                        :rules="[rules.required, rules.min]"
                        color="black"
                      />
                    </v-col>
                    <v-col cols="12" sm="6">
                      <v-text-field
                        label="Confirm Password"
                        v-model="signupConfirmPassword"
                        prepend-icon="mdi-lock"
                        type="password"
                        :rules="[rules.required, matchPasswords]"
                        color="black"
                      />
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="12">
                      <v-select
                        v-model="selectedCountry"
                        :items="countries"
                        label="Select your country"
                        prepend-icon="mdi-earth"
                        :rules="[rules.required]"
                        color="black"
                      />
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="12">
                      <v-checkbox
                        v-model="agreeTerms"
                        label="I have read and agree to the terms and conditions"
                        :rules="[rules.required]"
                        color="black"
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

  <!-- V-Card Section -->
  <v-container class="pa-4" color="white" fluid>
    <v-card class="pa-4" color="white" elevation="2">
      Lorem ipsum dolor sit amet, consectetur adipisicing elit. Voluptatibus,
      dignissimos in, ipsam fugit, dolores quisquam blanditiis id quae pariatur
      harum sequi praesentium! Officiis officia omnis facilis expedita suscipit
      molestiae eius? Lorem ipsum dolor sit amet, consectetur adipisicing elit.
      Saepe sunt, delectus nulla alias ex, exercitationem enim, eaque odit
      impedit quas repellendus itaque voluptates architecto fuga? Eveniet vel
      velit omnis enim.
    </v-card>
  </v-container>

  <!-- Video Section -->
  <v-container fluid class="bg-white">
    <v-row align="center" justify="center" style="height: 50vh">
      <v-col cols="12" class="text-center">
        <div>
          <h2>Video Section</h2>
          <v-img
            v-if="videoThumbnail !== ''"
            :src="videoThumbnail"
            alt="Video"
            max-width="80%"
            max-height="80%"
            cover
          ></v-img>
        </div>
      </v-col>
    </v-row>
  </v-container>

  <hr />
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";

export default defineComponent({
  name: "AuthForm",
  setup() {
    const activeTab = ref<number>(0);
    const loginEmail = ref<string>("");
    const loginPassword = ref<string>("");
    const signupUsername = ref<string>("");
    const signupEmail = ref<string>("");
    const signupPassword = ref<string>("");
    const signupConfirmPassword = ref<string>("");
    const selectedCountry = ref<string | null>(null);
    const agreeTerms = ref<boolean>(false);
    const videoThumbnail = ref<string>("");

    const countries = ref<string[]>(["USA", "Canada", "Brazil", "Mexico", "Germany"]);

    const rules = {
      required: (value: string) => !!value || "Required.",
      email: (value: string) => /.+@.+\..+/.test(value) || "E-mail must be valid",
      min: (v: string) => v.length >= 8 || "Min 8 characters",
    };

    const matchPasswords = (value: string) =>
      value === signupPassword.value || "Passwords must match";

    const submitForm = () => {
      console.log("Form Submitted!");
    };

    return {
      activeTab,
      loginEmail,
      loginPassword,
      signupUsername,
      signupEmail,
      signupPassword,
      signupConfirmPassword,
      selectedCountry,
      agreeTerms,
      countries,
      rules,
      matchPasswords,
      submitForm,
      videoThumbnail,
    };
  },
});
</script>
