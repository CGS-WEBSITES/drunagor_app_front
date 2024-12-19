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
                <h4 class="text-center mt-4 py-3">
                  Ensure your email for registration
                </h4>
                <v-form>
                  <v-text-field
                    label="Email"
                    prepend-icon="mdi-email"
                    type="text"
                    v-model="loginEmail"
                    color="black"
                    outlined
                    dense
                  />
                  <v-text-field
                    label="Password"
                    prepend-icon="mdi-lock"
                    type="password"
                    v-model="loginPassword"
                    color="black"
                    outlined
                    dense
                  />
                </v-form>
                <h3 class="text-center mt-4">Forgot your password?</h3>
                <v-btn class="mt-4" color="black" dark block> SIGN IN </v-btn>
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

                <h4 class="text-center mt-4 py-3">
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
                    <v-col cols="12" sm="6">
                      <v-text-field
                        label="Password"
                        v-model="signupPassword"
                        prepend-icon="mdi-lock"
                        type="password"
                        :rules="[rules.required, rules.min]"
                        color="black"
                        outlined
                        dense
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
                        outlined
                        dense
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
                        outlined
                        dense
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

    <!-- Card com Lorem Ipsum -->
    <v-container class="pa-4" color="white" fluid>
      <v-card class="pa-4" color="white" elevation="2">
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Voluptatibus,
        dignissimos in, ipsam fugit, dolores quisquam blanditiis id quae
        pariatur harum sequi praesentium! Officiis officia omnis facilis
        expedita suscipit molestiae eius? Lorem ipsum dolor sit amet,
        consectetur adipisicing elit. Saepe sunt, delectus nulla alias ex,
        exercitationem enim, eaque odit impedit quas repellendus itaque
        voluptates architecto fuga? Eveniet vel velit omnis enim.
      </v-card>
    </v-container>

    <!-- Seção de Vídeo -->
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
            />
          </div>
        </v-col>
      </v-row>
    </v-container>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      activeTab: 0,
      loginEmail: "",
      loginPassword: "",
      signupUsername: "",
      signupEmail: "",
      signupPassword: "",
      signupConfirmPassword: "",
      selectedCountry: null,
      agreeTerms: false,
      countries: ["USA", "Canada", "Brazil", "Mexico", "Germany"],
      rules: {
        required: (value) => !!value || "Required.",
        email: (value) => /.+@.+\..+/.test(value) || "E-mail must be valid",
        min: (v) => v.length >= 8 || "Min 8 characters",
      },
      videoThumbnail: "", // Insira o caminho da imagem ou URL do thumbnail
    };
  },
  methods: {
    matchPasswords(value) {
      return value === this.signupPassword || "Passwords must match";
    },
    submitForm() {
      if (this.$refs.form.validate()) {
        console.log("Form Submitted!");
      }
    },
  },
};
</script>
