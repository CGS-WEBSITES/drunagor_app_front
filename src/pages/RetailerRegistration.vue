<template>
    <v-container class="fill-height d-flex align-center justify-center pa-4" fluid>
        <v-row align="center" justify="center">
            <v-col cols="12" md="8" lg="6" xl="4">
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
                                            <v-img src="@/assets/darkness.png" max-width="50" alt="Centered Icon"
                                                class="mx-auto" />
                                        </v-col>
                                        <v-col cols="12">
                                            <h1 class="display-2 font-weight-bold">Welcome Back!</h1>
                                        </v-col>
                                    </v-row>
                                </v-container>
                                <v-alert closable v-model="showAlert" :icon="alertIcon" :title="alertTitle"
                                    :text="alertText" :type="alertType"></v-alert>
                                <h4 class="text-center mt-4 py-3">
                                    Ensure your email for registration
                                </h4>
                                <v-form>
                                    <v-row>
                                        <v-col cols="11">
                                            <v-text-field label="Login" prepend-icon="mdi-email" type="text"
                                                v-model="login" color="black" outlined dense />
                                        </v-col>
                                    </v-row>
                                    <v-row>
                                        <v-col cols="11">
                                            <v-text-field label="Password" prepend-icon="mdi-lock"
                                                :type="showPass ? 'text' : 'password'" v-model="password" color="black"
                                                outlined dense />
                                        </v-col>
                                        <v-col cols="1" class="d-flex justify-center align-center">
                                            <v-icon v-if="showPass" class="olho" tag="i" @click="showPass = !showPass">
                                                mdi-eye
                                            </v-icon>
                                            <v-icon v-else class="olho" tag="i" @click="showPass = !showPass">
                                                mdi-eye-off
                                            </v-icon>
                                        </v-col>
                                    </v-row>
                                </v-form>
                                <h3 @click="navigateTo('/forgotpassword')" class="text-center mt-4">
                                    Forgot your password?
                                </h3>
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
                                            <v-img src="@/assets/darkness.png" max-width="50" alt="Centered Icon"
                                                class="mx-auto" />
                                        </v-col>
                                        <v-col cols="12">
                                            <h1 class="display-2 font-weight-bold pl-3">
                                                Create an User Account
                                            </h1>
                                        </v-col>
                                    </v-row>
                                </v-container>

                                <v-alert closable v-model="showAlert" :icon="alertIcon" :title="alertTitle"
                                    :text="alertText" :type="alertType"></v-alert>

                                <v-form ref="regForm">
                                    <v-row>
                                        <v-col cols="12" sm="6">
                                            <v-text-field label="Login" v-model="signupUsername"
                                                prepend-icon="mdi-account" :rules="[rules.required]" color="black"
                                                outlined dense />
                                        </v-col>
                                        <v-col cols="12" sm="6">
                                            <v-text-field label="Email" v-model="signupEmail" prepend-icon="mdi-email"
                                                type="email" :rules="[rules.required, rules.email]" color="black"
                                                outlined dense />
                                        </v-col>
                                    </v-row>

                                    <!-- Campo para o endereço da loja -->
                                    <v-row>
                                        <v-col cols="12">
                                            <v-text-field label="Endereço da Loja" v-model="storeAddress"
                                                prepend-icon="mdi-map-marker" :rules="[rules.required]" color="black"
                                                outlined dense />
                                        </v-col>
                                    </v-row>

                                    <v-row>
                                        <v-col cols="11" sm="5">
                                            <v-text-field label="Password" prepend-icon="mdi-lock"
                                                :type="showPass ? 'text' : 'password'" v-model="signupPassword"
                                                :rules="[rules.required, rules.min]" color="black" outlined dense />
                                        </v-col>
                                        <v-col cols="1" class="d-flex justify-center align-center">
                                            <v-icon v-if="showPass" class="olho" tag="i" @click="showPass = !showPass">
                                                mdi-eye
                                            </v-icon>
                                            <v-icon v-else class="olho" tag="i" @click="showPass = !showPass">
                                                mdi-eye-off
                                            </v-icon>
                                        </v-col>
                                        <v-col cols="12" sm="6">
                                            <v-text-field label="Confirm Password" v-model="signupConfirmPassword"
                                                prepend-icon="mdi-lock" type="password"
                                                :rules="[rules.required, rules.matchPasswords]" color="black" outlined
                                                dense />
                                        </v-col>

                                        <v-col cols="12" class="d-flex align-center">
                                            <v-checkbox v-model="agreeTerms" color="green"
                                                :rules="[rules.required]"></v-checkbox>
                                            <span class="ml-4">
                                                I agree with the
                                                <strong style="cursor: pointer" @click="termsDialog = true">
                                                    Terms & Conditions
                                                </strong>
                                                and
                                                <strong style="cursor: pointer" @click="privacyDialog = true">
                                                    Privacy Policy
                                                </strong>
                                            </span>
                                        </v-col>
                                    </v-row>

                                    <v-btn class="mt-4" color="black" dark block @click="submitForm">
                                        SIGN UP
                                    </v-btn>
                                </v-form>
                            </v-card-text>
                        </v-tab-item>
                    </v-tabs-items>
                </v-card>
            </v-col>
        </v-row>

        <!-- Terms dialog -->
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
import md5 from "js-md5"; // Certifique-se de que md5 está instalado corretamente
import type { VForm } from "vuetify/components";
import TermsCard from "@/components/TermsCard.vue";
import PrivacyCard from "@/components/PrivacyCard.vue";
import { setToken } from "@/service/AccessToken";
import { useUserStore } from "@/store/UserStore";
import type { User } from "@/store/UserStore";

const userStore = useUserStore();

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
const storeAddress = ref<string>("");
const agreeTerms = ref<boolean>(false);
const regValid = ref<boolean>(false);
const alertIcon = ref("");
const alertText = ref("");
const alertTitle = ref("");
const alertType = ref("");
const termsDialog = ref(false);
const showAlert = ref(false);
const showPass = ref(false);
const privacyDialog = ref(false);
let debounceTimeout: ReturnType<typeof setTimeout>;

const navigateTo = (route: string) => {
    router.push(route);
};

// Regras de validação
const rules = {
    required: (value: string) => !!value || "Required.",
    email: (value: string) => /.+@.+\..+/.test(value) || "E-mail must be valid",
    min: (v: string) => v.length >= 8 || "Min 8 characters",
    matchPasswords: (v: string) => v === signupPassword.value || "The passwords must match",
};

const axios: any = inject("axios");

// Função para exibir alertas
const setAllert = (icon: string, title: string, text: string, type: string) => {
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
            "400",
            "The email and password fields were not filled out correctly.",
            "warning"
        );
        return;
    }

    login.value = login.value.trim();
    password.value = password.value.trim();

    await axios
        .post("users/login", {
            login: login.value,
            password: md5(password.value),
        })
        .then((response: any) => {
            console.log("API Response:", response);

            const dbUser = response.data.data;

            const appUser: User = {
                email: dbUser.email,
                google_id: dbUser.google_id,
                name: dbUser.name,
                picture_hash: dbUser.picture_hash,
                roles_fk: 3,
                user_name: dbUser.user_name,
                users_pk: dbUser.users_pk,
                verified: dbUser.verified,
                zip_code: dbUser.zipcode,
            };

            userStore.setUser(appUser);

            localStorage.setItem("app_user", JSON.stringify(appUser));

            // Exibe alerta de sucesso
            setAllert("mdi-check", response.status, response.data.message, "success");

            setToken(response.data.access_token);

            axios.defaults.headers.common["Authorization"] = `Bearer ${response.data.access_token}`;

            // Redireciona para o Dashboard
            router.push({ name: "Dashboard" });
        })
        .catch((error: any) => {
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

function convertDecimalToDMS(coordinate: number, isLatitude: boolean): string {
    const absolute = Math.abs(coordinate);
    const degrees = Math.floor(absolute);
    const minutes = Math.floor((absolute - degrees) * 60);
    const seconds = ((absolute - degrees) * 60 - minutes) * 60;
    const secondsRounded = Math.round(seconds * 10) / 10;
    const direction = isLatitude
        ? coordinate >= 0 ? "N" : "S"
        : coordinate >= 0 ? "E" : "W";
    return `${degrees}°${minutes}'${secondsRounded}"${direction}`;
}

function convertCoordinatesToDMS(coords: { lat: number; lon: number }): string {
    const latDMS = convertDecimalToDMS(coords.lat, true);
    const lonDMS = convertDecimalToDMS(coords.lon, false);
    return `${latDMS} ${lonDMS}`;
}

const getCoordinates = async (address: string): Promise<{ lat: number; lon: number } | null> => {
    try {
        const response = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`
        );
        const data = await response.json();
        if (data && data.length > 0) {
            return {
                lat: parseFloat(data[0].lat),
                lon: parseFloat(data[0].lon)
            };
        } else {
            console.error("Endereço não encontrado.");
            return null;
        }
    } catch (error) {
        console.error("Erro ao obter coordenadas:", error);
        return null;
    }
};

watch(storeAddress, (newAddress) => {
    if (debounceTimeout) {
        clearTimeout(debounceTimeout);
    }

    if (newAddress && newAddress.trim() !== "") {
        debounceTimeout = setTimeout(async () => {
            const coords = await getCoordinates(newAddress);
            if (coords) {
                const formattedCoords = convertCoordinatesToDMS(coords);
                console.log(`Coordinates for "${newAddress}": ${formattedCoords}`);
            }
        }, 1000);
    }
});

const valReg = async () => {
    const { valid, errors } = await regForm.value?.validate();
    regValid.value = valid;
};

const submitForm = async () => {
    await valReg();

    if (regValid.value) {
        // Obter as coordenadas com base no endereço da loja informado
        const locationCoordinates = await getCoordinates(storeAddress.value);

        await axios
            .post("users/cadastro", {
                name: login.value,
                user_name: signupUsername.value,
                email: signupEmail.value,
                password: signupConfirmPassword.value,
                roles_fk: 3,
                active: true,
                verified: false,
                agreement: true,
                google_id: locationCoordinates, // Enviando as coordenadas obtidas
            })
            .then((response: any) => {
                console.log(response);

                setAllert("mdi-check", response.status, response.data.message, "success");
                activeTab.value = 0;
            })
            .catch((response: any) => {
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