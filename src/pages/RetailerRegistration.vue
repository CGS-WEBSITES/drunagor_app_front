<template>
    <v-container class="retailer-registration fill-height d-flex align-center justify-center pa-4" fluid>
        <v-row justify="center" class="w-100">
            <v-col cols="12" md="9" lg="7" xl="5">
                <v-card color="secundary" class="registration-card elevation-12">
                    <v-card-text class="pa-0">
                        <div class="registration-shell">
                            <section class="registration-header">
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
                                    src="@/assets/darkness.png"
                                    width="56"
                                    height="56"
                                    alt="Drunagor icon"
                                    class="mx-auto mb-4"
                                />

                                <h1 class="text-h4 font-weight-bold text-center mb-2">
                                    Create Your Retailer Account
                                </h1>
                            </section>

                            <section class="registration-body">
                                <BaseAlert
                                    v-model="showAlert"
                                    :type="alertType"
                                    :icon="alertIcon"
                                    :title="alertTitle"
                                    closable
                                    class="mb-6"
                                >
                                    {{ alertText }}
                                </BaseAlert>

                                <v-form ref="regForm">
                                    <v-row class="form-grid">
                                        <v-col cols="12" sm="6">
                                            <v-text-field
                                                v-model="signupUsername"
                                                label="Username"
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
                                                v-model="signupEmail"
                                                label="Email"
                                                prepend-inner-icon="mdi-email"
                                                type="email"
                                                :rules="[rules.required, rules.email]"
                                                color="secundary"
                                                variant="outlined"
                                                density="comfortable"
                                                hide-details="auto"
                                            />
                                        </v-col>
                                        <v-col cols="12" sm="6">
                                            <v-text-field
                                                v-model="signupPassword"
                                                label="Password"
                                                prepend-inner-icon="mdi-lock"
                                                :append-inner-icon="showPass ? 'mdi-eye' : 'mdi-eye-off'"
                                                :type="showPass ? 'text' : 'password'"
                                                :rules="[rules.required, rules.min]"
                                                color="secundary"
                                                variant="outlined"
                                                density="comfortable"
                                                hide-details="auto"
                                                @click:append-inner="showPass = !showPass"
                                            />
                                        </v-col>
                                        <v-col cols="12" sm="6">
                                            <v-text-field
                                                v-model="signupConfirmPassword"
                                                label="Confirm Password"
                                                prepend-inner-icon="mdi-lock-check"
                                                :type="showPass ? 'text' : 'password'"
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
                                            I agree with the
                                            <strong class="terms-link" @click="termsDialog = true">
                                                Terms & Conditions
                                            </strong>
                                            and
                                            <strong class="terms-link" @click="privacyDialog = true">
                                                Privacy Policy
                                            </strong>
                                        </p>
                                    </div>

                                    <v-btn
                                        class="mt-6"
                                        color="black"
                                        size="large"
                                        block
                                        :loading="isSubmitting"
                                        :disabled="isSubmitting"
                                        @click="submitForm"
                                    >
                                        SIGN UP
                                    </v-btn>

                                    <p class="registration-footer text-center text-body-2 mt-5 mb-0">
                                        Already have access?
                                        <span class="footer-link" @click="navigateTo('/')">Go back to login</span>
                                    </p>
                                </v-form>
                            </section>
                        </div>
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
import { ref, inject, watch } from "vue";
import { useRouter } from "vue-router";
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
const signupUsername = ref<string>("");
const signupEmail = ref<string>("");
const signupPassword = ref<string>("");
const signupConfirmPassword = ref<string>("");
const storeAddress = ref<string>("");
const agreeTerms = ref<boolean>(false);
const regValid = ref<boolean>(false);
const isSubmitting = ref<boolean>(false);
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

const rules = {
    required: (value: string | boolean) => !!value || "Required.",
    email: (value: string) => /.+@.+\..+/.test(value) || "E-mail must be valid",
    min: (value: string) => value.length >= 8 || "Min 8 characters",
    matchPasswords: (value: string) =>
        value === signupPassword.value || "The passwords must match",
};

const axios: any = inject("axios");

const trimValue = (value: string | null | undefined) => value?.trim?.() || "";

const sanitizeRetailerRegistrationFields = () => {
    signupUsername.value = trimValue(signupUsername.value);
    signupEmail.value = trimValue(signupEmail.value);
    signupPassword.value = trimValue(signupPassword.value);
    signupConfirmPassword.value = trimValue(signupConfirmPassword.value);
    storeAddress.value = trimValue(storeAddress.value);
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

function convertDecimalToDMS(coordinate: number, isLatitude: boolean): string {
    const absolute = Math.abs(coordinate);
    const degrees = Math.floor(absolute);
    const minutes = Math.floor((absolute - degrees) * 60);
    const seconds = ((absolute - degrees) * 60 - minutes) * 60;
    const secondsRounded = Math.round(seconds * 10) / 10;
    const direction = isLatitude
        ? coordinate >= 0
            ? "N"
            : "S"
        : coordinate >= 0
            ? "E"
            : "W";
    return `${degrees} deg ${minutes}'${secondsRounded}"${direction}`;
}

function convertCoordinatesToDMS(coords: { lat: number; lon: number }): string {
    const latDMS = convertDecimalToDMS(coords.lat, true);
    const lonDMS = convertDecimalToDMS(coords.lon, false);
    return `${latDMS} ${lonDMS}`;
}

const getCoordinates = async (
    address: string,
): Promise<{ lat: number; lon: number } | null> => {
    if (!address) {
        return null;
    }

    try {
        const response = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`,
        );
        const data = await response.json();
        if (data && data.length > 0) {
            return {
                lat: parseFloat(data[0].lat),
                lon: parseFloat(data[0].lon),
            };
        }

        console.error("Address not found.");
        return null;
    } catch (error) {
        console.error("Error getting coordinates:", error);
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
    sanitizeRetailerRegistrationFields();
    const { valid } = await regForm.value?.validate();
    regValid.value = valid;
};

const completeRetailerLogin = async (loginValue: string, rawPassword: string) => {
    const response = await axios.post("users/login", {
        login: loginValue,
        password: md5(rawPassword),
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
    };

    userStore.setUser(appUser);
    localStorage.setItem("app_user", JSON.stringify(appUser));

    setToken(response.data.access_token);
    axios.defaults.headers.common["Authorization"] =
        `Bearer ${response.data.access_token}`;
};

const submitForm = async () => {
    sanitizeRetailerRegistrationFields();
    await valReg();

    if (!regValid.value) {
        return;
    }

    if (!agreeTerms.value) {
        setAllert(
            "mdi-alert-circle",
            "400",
            "You must agree to the Terms & Conditions and Privacy Policy.",
            "warning",
        );
        return;
    }

    isSubmitting.value = true;

    try {
        const locationCoordinates = await getCoordinates(storeAddress.value);

        const signupResponse = await axios.post("users/cadastro", {
            name: signupUsername.value,
            user_name: signupUsername.value,
            email: signupEmail.value,
            password: signupConfirmPassword.value,
            roles_fk: 3,
            active: true,
            verified: false,
            agreement: true,
            google_id: locationCoordinates,
        });

        await completeRetailerLogin(signupEmail.value, signupConfirmPassword.value);

        setAllert(
            "mdi-check",
            signupResponse.status.toString(),
            "Retailer account created successfully. Redirecting to your dashboard...",
            "success",
        );

        router.push({ name: "Dashboard" });
    } catch (error: any) {
        console.error("Error during retailer registration:", error);
        setAllert(
            "mdi-alert-circle",
            error.response?.status?.toString() || "500",
            error.response?.data?.message ||
                "An error occurred while creating the retailer account.",
            "error",
        );
    } finally {
        isSubmitting.value = false;
    }
};
</script>

<style scoped>
.retailer-registration {
    background: url("https://assets.drunagor.app/backgrounds/login-background.png");
    background-size: cover;
    background-position: center;
}

.registration-card {
    border-radius: 24px;
    overflow: hidden;
}

.registration-header {
    position: relative;
    padding: 32px 32px 28px;
    background: rgb(var(--v-theme-secundary));
    color: white;
}

.registration-body {
    padding: 28px 32px 32px;
    background: rgb(var(--v-theme-secundary));
}

.back-button {
    position: absolute;
    top: 20px;
    left: 20px;
}

.form-grid {
    margin-top: 0;
}

.terms-box {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 8px 0 0;
}

.terms-check {
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 34px;
    flex-shrink: 0;
}

.terms-copy {
    line-height: 1.6;
    color: rgba(255, 255, 255, 0.8);
}

.terms-link,
.footer-link {
    cursor: pointer;
    color: #4fd1c5;
    font-weight: 700;
}

.registration-footer {
    color: rgba(255, 255, 255, 0.65);
}

@media (max-width: 600px) {
    .registration-header {
        padding: 28px 20px 24px;
    }

    .registration-body {
        padding: 24px 20px 28px;
    }

    .terms-box {
        gap: 2px;
    }
}
</style>
