<template>
  <v-app id="inspire" fluid>
    <p class="tittle-login pt-16">Drunagor App</p>
    <v-content>
      <v-container class="fill-height" fluid>
        <v-row align="center" justify="center">
          <v-col cols="12" sm="8" md="8">
            <v-card class="elevation-12">
              <v-window v-model="step">
                <v-window-item :value="1">
                  <v-row>
                    <v-col cols="12" md="8">
                      <v-card-text class="mt-12">
                        <div class="text-center">
                          <v-img
                            src="@/assets/darkness.png"
                            max-width="50"
                            alt="Welcome Back Icon"
                            class="center-icon"
                          ></v-img>
                          <h1 class="text-center display-2">Welcome Back!</h1>
                        </div>
                        <h4 class="text-center mt-4">
                          Ensure your email for registration
                        </h4>
                        <v-form>
                          <v-text-field
                            label="Email"
                            v-model="loginEmail"
                            prepend-icon="mdi-email"
                            type="text"
                            color="black"
                          />
                          <v-text-field
                            id="password"
                            v-model="loginPassword"
                            label="Password"
                            prepend-icon="mdi-lock"
                            type="password"
                            color="black"
                          />
                        </v-form>
                        <h3 class="text-center mt-4">Forgot your password?</h3>
                        <br /><br />
                      </v-card-text>
                      <div class="text-center mt-3">
                        <v-btn style="background-color: black; color: white"
                          >SIGN IN</v-btn
                        >
                      </div>
                      <br /><br />
                    </v-col>
                    <v-col
                      cols="12"
                      md="4"
                      style="background-color: black !important"
                      class="teal accent-3"
                    >
                      <v-card-text class="white--text mt-12">
                        <h1 class="text-center text-white display-1">
                          Don’t have an account?
                        </h1>
                        <br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br />
                        <h5 class="text-center text-white text-h6">
                          Enter your personal details and start journay with us
                        </h5>
                      </v-card-text>
                      <div class="text-center">
                        <v-btn outlined light @click="step++">SIGN UP</v-btn>
                      </div>
                      <br />
                    </v-col>
                  </v-row>
                </v-window-item>

                <!-- Parte de Create Account -->
                <v-window-item :value="2">
                  <v-row class="fill-height">
                    <v-col cols="12" md="8">
                      <v-card-text class="mt-12">
                        <div class="text-center">
                          <v-img
                            src="@/assets/darkness.png"
                            max-width="50"
                            alt="Create Account Icon"
                            class="center-icon"
                          ></v-img>
                          <h1 class="text-center display-2">
                            Create an User Account
                          </h1>
                        </div>

                        <h4 class="text-center mt-4">
                          Ensure your email for registration
                        </h4>
                        <br />

                        <v-form ref="form">
                          <v-row>
                            <v-col cols="12" sm="6">
                              <v-text-field
                                label="Username"
                                v-model="username"
                                prepend-icon="mdi-account"
                                type="text"
                                :rules="[rules.required]"
                                color="black"
                              />
                            </v-col>
                            <v-col cols="12" sm="6">
                              <v-text-field
                                label="Email"
                                v-model="email"
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
                                v-model="password"
                                prepend-icon="mdi-lock"
                                type="password"
                                :rules="[rules.required, rules.min]"
                                color="black"
                              />
                            </v-col>
                            <v-col cols="12" sm="6">
                              <v-text-field
                                label="Confirm Password"
                                v-model="confirmPassword"
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

                          <!-- Checkbox for Terms and Conditions -->
                          <v-row>
                            <v-col cols="12">
                              <v-checkbox
                                v-model="agreeTerms"
                                label="I have read and agree to the terms and conditions"
                                :rules="[rules.required]"
                                color="black"
                              />
                              <p>
                                Check out our <a href="#">privacy notice</a> for
                                details on how we’ll use your information, and
                                how we keep your data safe from the Darkness.
                              </p>
                            </v-col>
                          </v-row>
                          <div class="text-center mt-n5">
                            <v-btn
                              style="color: white; background-color: black"
                              @click="submitForm"
                            >
                              SIGN UP
                            </v-btn>
                          </div>
                        </v-form>
                      </v-card-text>
                    </v-col>

                    <!-- Parte preta de retorno ao Sign In -->
                    <v-col
                      cols="12"
                      md="4"
                      style="background-color: black !important"
                      class="teal accent-3"
                    >
                      <v-card-text class="white--text mt-12">
                        <h2 class="text-center text-white">Welcome to</h2>
                        <h1 class="text-center display-1 text-white">
                          Drunagor App
                        </h1>
                        <br /><br /><br /><br /><br />
                        <h5 class="text-center text-white text-h6">
                          Enter your personal details and start your journey
                          with us
                        </h5>
                      </v-card-text>
                      <div class="text-center text-white mt-8">
                        <br /><br /><br /><br /><br /><br /><br /><br /><br /><br />
                        <h5 class="white--text text-white text-h6">
                          Already have an account?
                        </h5>
                        <br />
                        <v-btn outlined light @click="step--">Login</v-btn>
                      </div>
                      <br />
                    </v-col>
                  </v-row>
                </v-window-item>
              </v-window>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
      <hr />

      <!-- Texto limitado -->
      <v-container class="pa-4" color="white" fluid>
        <v-card class="pa-4" color="white" elevation="2">
          Lorem ipsum dolor sit amet, consectetur adipisicing elit.
          Voluptatibus, dignissimos in, ipsam fugit, dolores quisquam blanditiis
          id quae pariatur harum sequi praesentium! Officiis officia omnis
          facilis expedita suscipit molestiae eius? Lorem ipsum dolor sit amet,
          consectetur adipisicing elit. Saepe sunt, delectus nulla alias ex,
          exercitationem enim, eaque odit impedit quas repellendus itaque
          voluptates architecto fuga? Eveniet vel velit omnis enim.
        </v-card>
      </v-container>

      <!-- Video Section -->
      <v-container fluid class="bg-white">
        <v-row align="center" justify="center" class="bg-white">
          <v-col cols="12" class="text-center">
            <div class="video-section">
              <h2>Video Section</h2>
              <v-img
                v-if="videoThumbnail !== ''"
                :src="videoThumbnail"
                alt="Video"
                class="video-placeholder"
              ></v-img>
            </div>
          </v-col>
        </v-row>
      </v-container>
      <hr />

      <!-- Footer Section -->
      <v-footer class="footer black" padless>
        <v-container fluid>
          <v-row justify="space-between" align="center">
            <v-col cols="12" sm="4">
              <v-img
                class="logocgs"
                src="@/assets/cgs.png"
                max-width="92"
                alt="logo"
              />
            </v-col>
            <v-col cols="12" sm="4" class="info-footer">
              <h3 class="white--text">Footer Infos Here</h3>
              <p class="white--text">Big name info 1</p>
              <p class="white--text">Big name info 2</p>
              <p class="white--text">Big name info 3</p>
            </v-col>
            <v-col cols="12" sm="4" class="text-center">
              <h3 class="white--text">Social medias</h3>
              <v-btn fab icon color="black" dark>
                <v-icon color="white">mdi-instagram</v-icon>
              </v-btn>
              <v-btn fab icon color="black" dark>
                <v-icon color="white">mdi-facebook</v-icon>
              </v-btn>
              <v-btn fab icon color="black" dark>
                <v-icon color="white">mdi-youtube</v-icon>
              </v-btn>
            </v-col>
          </v-row>
        </v-container>
      </v-footer>
    </v-content>
  </v-app>
</template>

<script>
export default {
  data: () => ({
    videoThumbnail: "",
    step: 1,
    loginEmail: "", // Variável de e-mail de login
    loginPassword: "", // Variável de senha de login
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    selectedCountry: null,
    agreeTerms: false,
    countries: [
      "Afghanistan",
      "Albania",
      "Algeria",
      "Andorra",
      "Angola",
      "Antigua and Barbuda",
      "Argentina",
      "Armenia",
      "Australia",
      "Austria",
      "Azerbaijan",
      "Bahamas",
      "Bahrain",
      "Bangladesh",
      "Barbados",
      "Belarus",
      "Belgium",
      "Belize",
      "Benin",
      "Bhutan",
      "Bolivia",
      "Bosnia and Herzegovina",
      "Botswana",
      "Brazil",
      "Brunei",
      "Bulgaria",
      "Burkina Faso",
      "Burundi",
      "Cabo Verde",
      "Cambodia",
      "Cameroon",
      "Canada",
      "Central African Republic",
      "Chad",
      "Chile",
      "China",
      "Colombia",
      "Comoros",
      "Congo (Congo-Brazzaville)",
      "Costa Rica",
      "Croatia",
      "Cuba",
      "Cyprus",
      "Czech Republic",
      "Democratic Republic of the Congo",
      "Denmark",
      "Djibouti",
      "Dominica",
      "Dominican Republic",
      "Ecuador",
      "Egypt",
      "El Salvador",
      "Equatorial Guinea",
      "Eritrea",
      "Estonia",
      "Eswatini",
      "Ethiopia",
      "Fiji",
      "Finland",
      "France",
      "Gabon",
      "Gambia",
      "Georgia",
      "Germany",
      "Ghana",
      "Greece",
      "Grenada",
      "Guatemala",
      "Guinea",
      "Guinea-Bissau",
      "Guyana",
      "Haiti",
      "Honduras",
      "Hungary",
      "Iceland",
      "India",
      "Indonesia",
      "Iran",
      "Iraq",
      "Ireland",
      "Israel",
      "Italy",
      "Jamaica",
      "Japan",
      "Jordan",
      "Kazakhstan",
      "Kenya",
      "Kiribati",
      "Kuwait",
      "Kyrgyzstan",
      "Laos",
      "Latvia",
      "Lebanon",
      "Lesotho",
      "Liberia",
      "Libya",
      "Liechtenstein",
      "Lithuania",
      "Luxembourg",
      "Madagascar",
      "Malawi",
      "Malaysia",
      "Maldives",
      "Mali",
      "Malta",
      "Marshall Islands",
      "Mauritania",
      "Mauritius",
      "Mexico",
      "Micronesia",
      "Moldova",
      "Monaco",
      "Mongolia",
      "Montenegro",
      "Morocco",
      "Mozambique",
      "Myanmar (Burma)",
      "Namibia",
      "Nauru",
      "Nepal",
      "Netherlands",
      "New Zealand",
      "Nicaragua",
      "Niger",
      "Nigeria",
      "North Korea",
      "North Macedonia",
      "Norway",
      "Oman",
      "Pakistan",
      "Palau",
      "Panama",
      "Papua New Guinea",
      "Paraguay",
      "Peru",
      "Philippines",
      "Poland",
      "Portugal",
      "Qatar",
      "Romania",
      "Russia",
      "Rwanda",
      "Saint Kitts and Nevis",
      "Saint Lucia",
      "Saint Vincent and the Grenadines",
      "Samoa",
      "San Marino",
      "Sao Tome and Principe",
      "Saudi Arabia",
      "Senegal",
      "Serbia",
      "Seychelles",
      "Sierra Leone",
      "Singapore",
      "Slovakia",
      "Slovenia",
      "Solomon Islands",
      "Somalia",
      "South Africa",
      "South Korea",
      "South Sudan",
      "Spain",
      "Sri Lanka",
      "Sudan",
      "Suriname",
      "Sweden",
      "Switzerland",
      "Syria",
      "Taiwan",
      "Tajikistan",
      "Tanzania",
      "Thailand",
      "Timor-Leste",
      "Togo",
      "Tonga",
      "Trinidad and Tobago",
      "Tunisia",
      "Turkey",
      "Turkmenistan",
      "Tuvalu",
      "Uganda",
      "Ukraine",
      "United Arab Emirates",
      "United Kingdom",
      "United States",
      "Uruguay",
      "Uzbekistan",
      "Vanuatu",
      "Vatican City",
      "Venezuela",
      "Vietnam",
      "Yemen",
      "Zambia",
      "Zimbabwe",
    ], // Lista de países
    rules: {
      required: (value) => !!value || "Required.",
      email: (value) => /.+@.+\..+/.test(value) || "E-mail must be valid",
      min: (v) => v.length >= 8 || "Min 8 characters",
    },
  }),
  methods: {
    matchPasswords(value) {
      return value === this.password || "Passwords must match";
    },
    isMobile() {
      switch (this.$vuetify.breakpoint.name) {
        case "xs":
          return true;
        case "sm":
          return true;
        case "md":
          return true;
        case "lg":
          return false;
        case "xl":
          return false;
        default:
          return false;
      }
    },
    submitForm() {
      if (this.$refs.form.validate()) {
        console.log("Formulário válido e enviado");
      }
    },
  },
};
</script>

<style scoped>
/* Parte de Título e Subtítulo */
.tittle-login {
  position: absolute;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 50px;
  text-align: center;
}

.subtittle-login {
  text-align: center;
}

/* Parte do ícone centralizado */
.center-icon {
  display: block;
  margin: 0 auto;
}

/* Texto limitado */
.text-wrapper {
  max-width: 60%;
  margin: 20px auto;
  padding: 20px;
  text-align: center;
  background-color: #f5f5f5;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* Parte do vídeo */
.video-section {
  padding: 200px 0;
  text-align: center;
}

.video-placeholder {
  max-width: 400px;
  background-color: #ccc;
}

.container--fluid {
  max-height: 1000px;
  overflow-y: auto;
}

/* Parte do Footer */
.footer {
  background-color: #000;
  color: white;
  width: 100%;
  padding: 20px 0;
}

.footer-container {
  max-width: 100%;
}

.logocgs {
  display: block;
  margin: 0 auto;
}

.footer h3,
.footer p {
  margin: 0;
  padding: 5px 0;
  text-align: center;
}

.info-footer {
  text-align: center;
}

.footer .v-btn {
  margin: 0 5px;
}

.v-footer .v-col {
  display: flex;
  justify-content: center;
  align-items: center;
}

.v-footer .text-center {
  text-align: center;
}
</style>
