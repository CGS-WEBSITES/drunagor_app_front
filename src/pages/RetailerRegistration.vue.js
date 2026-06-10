/// <reference types="../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import { ref, inject, watch } from "vue";
import { useRouter } from "vue-router";
import md5 from "js-md5";
import TermsCard from "@/components/TermsCard.vue";
import PrivacyCard from "@/components/PrivacyCard.vue";
import { setToken } from "@/service/AccessToken";
import { useUserStore } from "@/store/UserStore";
import BaseAlert from "@/components/Alerts/BaseAlert.vue";
const userStore = useUserStore();
const regForm = ref();
const router = useRouter();
const signupUsername = ref("");
const signupEmail = ref("");
const signupPassword = ref("");
const signupConfirmPassword = ref("");
const storeAddress = ref("");
const agreeTerms = ref(false);
const regValid = ref(false);
const isSubmitting = ref(false);
const alertIcon = ref("");
const alertText = ref("");
const alertTitle = ref("");
const alertType = ref("");
const termsDialog = ref(false);
const showAlert = ref(false);
const showPass = ref(false);
const privacyDialog = ref(false);
let debounceTimeout;
const navigateTo = (route) => {
    router.push(route);
};
const rules = {
    required: (value) => !!value || "Required.",
    email: (value) => /.+@.+\..+/.test(value) || "E-mail must be valid",
    min: (value) => value.length >= 8 || "Min 8 characters",
    matchPasswords: (value) => value === signupPassword.value || "The passwords must match",
};
const axios = inject("axios");
const trimValue = (value) => value?.trim?.() || "";
const sanitizeRetailerRegistrationFields = () => {
    signupUsername.value = trimValue(signupUsername.value);
    signupEmail.value = trimValue(signupEmail.value);
    signupPassword.value = trimValue(signupPassword.value);
    signupConfirmPassword.value = trimValue(signupConfirmPassword.value);
    storeAddress.value = trimValue(storeAddress.value);
};
const setAllert = (icon, title, text, type) => {
    alertIcon.value = icon;
    alertTitle.value = title;
    alertText.value = text;
    showAlert.value = true;
    alertType.value = type;
    setTimeout(() => {
        showAlert.value = false;
    }, 4000);
};
function convertDecimalToDMS(coordinate, isLatitude) {
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
function convertCoordinatesToDMS(coords) {
    const latDMS = convertDecimalToDMS(coords.lat, true);
    const lonDMS = convertDecimalToDMS(coords.lon, false);
    return `${latDMS} ${lonDMS}`;
}
const getCoordinates = async (address) => {
    if (!address) {
        return null;
    }
    try {
        const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`);
        const data = await response.json();
        if (data && data.length > 0) {
            return {
                lat: parseFloat(data[0].lat),
                lon: parseFloat(data[0].lon),
            };
        }
        console.error("Address not found.");
        return null;
    }
    catch (error) {
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
const completeRetailerLogin = async (loginValue, rawPassword) => {
    const response = await axios.post("users/login", {
        login: loginValue,
        password: md5(rawPassword),
    });
    const dbUser = response.data.data;
    const appUser = {
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
        setAllert("mdi-alert-circle", "400", "You must agree to the Terms & Conditions and Privacy Policy.", "warning");
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
        setAllert("mdi-check", signupResponse.status.toString(), "Retailer account created successfully. Redirecting to your dashboard...", "success");
        router.push({ name: "Dashboard" });
    }
    catch (error) {
        console.error("Error during retailer registration:", error);
        setAllert("mdi-alert-circle", error.response?.status?.toString() || "500", error.response?.data?.message ||
            "An error occurred while creating the retailer account.", "error");
    }
    finally {
        isSubmitting.value = false;
    }
};
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['registration-header']} */ ;
/** @type {__VLS_StyleScopedClasses['registration-body']} */ ;
/** @type {__VLS_StyleScopedClasses['terms-box']} */ ;
// CSS variable injection 
// CSS variable injection end 
const __VLS_0 = {}.VContainer;
/** @type {[typeof __VLS_components.VContainer, typeof __VLS_components.vContainer, typeof __VLS_components.VContainer, typeof __VLS_components.vContainer, ]} */ ;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
    ...{ class: "retailer-registration fill-height d-flex align-center justify-center pa-4" },
    fluid: true,
}));
const __VLS_2 = __VLS_1({
    ...{ class: "retailer-registration fill-height d-flex align-center justify-center pa-4" },
    fluid: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
var __VLS_4 = {};
__VLS_3.slots.default;
const __VLS_5 = {}.VRow;
/** @type {[typeof __VLS_components.VRow, typeof __VLS_components.vRow, typeof __VLS_components.VRow, typeof __VLS_components.vRow, ]} */ ;
// @ts-ignore
const __VLS_6 = __VLS_asFunctionalComponent(__VLS_5, new __VLS_5({
    justify: "center",
    ...{ class: "w-100" },
}));
const __VLS_7 = __VLS_6({
    justify: "center",
    ...{ class: "w-100" },
}, ...__VLS_functionalComponentArgsRest(__VLS_6));
__VLS_8.slots.default;
const __VLS_9 = {}.VCol;
/** @type {[typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ]} */ ;
// @ts-ignore
const __VLS_10 = __VLS_asFunctionalComponent(__VLS_9, new __VLS_9({
    cols: "12",
    md: "9",
    lg: "7",
    xl: "5",
}));
const __VLS_11 = __VLS_10({
    cols: "12",
    md: "9",
    lg: "7",
    xl: "5",
}, ...__VLS_functionalComponentArgsRest(__VLS_10));
__VLS_12.slots.default;
const __VLS_13 = {}.VCard;
/** @type {[typeof __VLS_components.VCard, typeof __VLS_components.vCard, typeof __VLS_components.VCard, typeof __VLS_components.vCard, ]} */ ;
// @ts-ignore
const __VLS_14 = __VLS_asFunctionalComponent(__VLS_13, new __VLS_13({
    color: "secundary",
    ...{ class: "registration-card elevation-12" },
}));
const __VLS_15 = __VLS_14({
    color: "secundary",
    ...{ class: "registration-card elevation-12" },
}, ...__VLS_functionalComponentArgsRest(__VLS_14));
__VLS_16.slots.default;
const __VLS_17 = {}.VCardText;
/** @type {[typeof __VLS_components.VCardText, typeof __VLS_components.vCardText, typeof __VLS_components.VCardText, typeof __VLS_components.vCardText, ]} */ ;
// @ts-ignore
const __VLS_18 = __VLS_asFunctionalComponent(__VLS_17, new __VLS_17({
    ...{ class: "pa-0" },
}));
const __VLS_19 = __VLS_18({
    ...{ class: "pa-0" },
}, ...__VLS_functionalComponentArgsRest(__VLS_18));
__VLS_20.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "registration-shell" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.section, __VLS_intrinsicElements.section)({
    ...{ class: "registration-header" },
});
const __VLS_21 = {}.VBtn;
/** @type {[typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ]} */ ;
// @ts-ignore
const __VLS_22 = __VLS_asFunctionalComponent(__VLS_21, new __VLS_21({
    ...{ 'onClick': {} },
    icon: true,
    variant: "text",
    color: "white",
    ...{ class: "back-button" },
}));
const __VLS_23 = __VLS_22({
    ...{ 'onClick': {} },
    icon: true,
    variant: "text",
    color: "white",
    ...{ class: "back-button" },
}, ...__VLS_functionalComponentArgsRest(__VLS_22));
let __VLS_25;
let __VLS_26;
let __VLS_27;
const __VLS_28 = {
    onClick: (...[$event]) => {
        __VLS_ctx.navigateTo('/');
    }
};
__VLS_24.slots.default;
const __VLS_29 = {}.VIcon;
/** @type {[typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, ]} */ ;
// @ts-ignore
const __VLS_30 = __VLS_asFunctionalComponent(__VLS_29, new __VLS_29({}));
const __VLS_31 = __VLS_30({}, ...__VLS_functionalComponentArgsRest(__VLS_30));
__VLS_32.slots.default;
var __VLS_32;
var __VLS_24;
const __VLS_33 = {}.VImg;
/** @type {[typeof __VLS_components.VImg, typeof __VLS_components.vImg, ]} */ ;
// @ts-ignore
const __VLS_34 = __VLS_asFunctionalComponent(__VLS_33, new __VLS_33({
    src: "@/assets/darkness.png",
    width: "56",
    height: "56",
    alt: "Drunagor icon",
    ...{ class: "mx-auto mb-4" },
}));
const __VLS_35 = __VLS_34({
    src: "@/assets/darkness.png",
    width: "56",
    height: "56",
    alt: "Drunagor icon",
    ...{ class: "mx-auto mb-4" },
}, ...__VLS_functionalComponentArgsRest(__VLS_34));
__VLS_asFunctionalElement(__VLS_intrinsicElements.h1, __VLS_intrinsicElements.h1)({
    ...{ class: "text-h4 font-weight-bold text-center mb-2" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.section, __VLS_intrinsicElements.section)({
    ...{ class: "registration-body" },
});
/** @type {[typeof BaseAlert, typeof BaseAlert, ]} */ ;
// @ts-ignore
const __VLS_37 = __VLS_asFunctionalComponent(BaseAlert, new BaseAlert({
    modelValue: (__VLS_ctx.showAlert),
    type: (__VLS_ctx.alertType),
    icon: (__VLS_ctx.alertIcon),
    title: (__VLS_ctx.alertTitle),
    closable: true,
    ...{ class: "mb-6" },
}));
const __VLS_38 = __VLS_37({
    modelValue: (__VLS_ctx.showAlert),
    type: (__VLS_ctx.alertType),
    icon: (__VLS_ctx.alertIcon),
    title: (__VLS_ctx.alertTitle),
    closable: true,
    ...{ class: "mb-6" },
}, ...__VLS_functionalComponentArgsRest(__VLS_37));
__VLS_39.slots.default;
(__VLS_ctx.alertText);
var __VLS_39;
const __VLS_40 = {}.VForm;
/** @type {[typeof __VLS_components.VForm, typeof __VLS_components.vForm, typeof __VLS_components.VForm, typeof __VLS_components.vForm, ]} */ ;
// @ts-ignore
const __VLS_41 = __VLS_asFunctionalComponent(__VLS_40, new __VLS_40({
    ref: "regForm",
}));
const __VLS_42 = __VLS_41({
    ref: "regForm",
}, ...__VLS_functionalComponentArgsRest(__VLS_41));
/** @type {typeof __VLS_ctx.regForm} */ ;
var __VLS_44 = {};
__VLS_43.slots.default;
const __VLS_46 = {}.VRow;
/** @type {[typeof __VLS_components.VRow, typeof __VLS_components.vRow, typeof __VLS_components.VRow, typeof __VLS_components.vRow, ]} */ ;
// @ts-ignore
const __VLS_47 = __VLS_asFunctionalComponent(__VLS_46, new __VLS_46({
    ...{ class: "form-grid" },
}));
const __VLS_48 = __VLS_47({
    ...{ class: "form-grid" },
}, ...__VLS_functionalComponentArgsRest(__VLS_47));
__VLS_49.slots.default;
const __VLS_50 = {}.VCol;
/** @type {[typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ]} */ ;
// @ts-ignore
const __VLS_51 = __VLS_asFunctionalComponent(__VLS_50, new __VLS_50({
    cols: "12",
    sm: "6",
}));
const __VLS_52 = __VLS_51({
    cols: "12",
    sm: "6",
}, ...__VLS_functionalComponentArgsRest(__VLS_51));
__VLS_53.slots.default;
const __VLS_54 = {}.VTextField;
/** @type {[typeof __VLS_components.VTextField, typeof __VLS_components.vTextField, ]} */ ;
// @ts-ignore
const __VLS_55 = __VLS_asFunctionalComponent(__VLS_54, new __VLS_54({
    modelValue: (__VLS_ctx.signupUsername),
    label: "Username",
    prependInnerIcon: "mdi-account",
    rules: ([__VLS_ctx.rules.required]),
    color: "secundary",
    variant: "outlined",
    density: "comfortable",
    hideDetails: "auto",
}));
const __VLS_56 = __VLS_55({
    modelValue: (__VLS_ctx.signupUsername),
    label: "Username",
    prependInnerIcon: "mdi-account",
    rules: ([__VLS_ctx.rules.required]),
    color: "secundary",
    variant: "outlined",
    density: "comfortable",
    hideDetails: "auto",
}, ...__VLS_functionalComponentArgsRest(__VLS_55));
var __VLS_53;
const __VLS_58 = {}.VCol;
/** @type {[typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ]} */ ;
// @ts-ignore
const __VLS_59 = __VLS_asFunctionalComponent(__VLS_58, new __VLS_58({
    cols: "12",
    sm: "6",
}));
const __VLS_60 = __VLS_59({
    cols: "12",
    sm: "6",
}, ...__VLS_functionalComponentArgsRest(__VLS_59));
__VLS_61.slots.default;
const __VLS_62 = {}.VTextField;
/** @type {[typeof __VLS_components.VTextField, typeof __VLS_components.vTextField, ]} */ ;
// @ts-ignore
const __VLS_63 = __VLS_asFunctionalComponent(__VLS_62, new __VLS_62({
    modelValue: (__VLS_ctx.signupEmail),
    label: "Email",
    prependInnerIcon: "mdi-email",
    type: "email",
    rules: ([__VLS_ctx.rules.required, __VLS_ctx.rules.email]),
    color: "secundary",
    variant: "outlined",
    density: "comfortable",
    hideDetails: "auto",
}));
const __VLS_64 = __VLS_63({
    modelValue: (__VLS_ctx.signupEmail),
    label: "Email",
    prependInnerIcon: "mdi-email",
    type: "email",
    rules: ([__VLS_ctx.rules.required, __VLS_ctx.rules.email]),
    color: "secundary",
    variant: "outlined",
    density: "comfortable",
    hideDetails: "auto",
}, ...__VLS_functionalComponentArgsRest(__VLS_63));
var __VLS_61;
const __VLS_66 = {}.VCol;
/** @type {[typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ]} */ ;
// @ts-ignore
const __VLS_67 = __VLS_asFunctionalComponent(__VLS_66, new __VLS_66({
    cols: "12",
    sm: "6",
}));
const __VLS_68 = __VLS_67({
    cols: "12",
    sm: "6",
}, ...__VLS_functionalComponentArgsRest(__VLS_67));
__VLS_69.slots.default;
const __VLS_70 = {}.VTextField;
/** @type {[typeof __VLS_components.VTextField, typeof __VLS_components.vTextField, ]} */ ;
// @ts-ignore
const __VLS_71 = __VLS_asFunctionalComponent(__VLS_70, new __VLS_70({
    ...{ 'onClick:appendInner': {} },
    modelValue: (__VLS_ctx.signupPassword),
    label: "Password",
    prependInnerIcon: "mdi-lock",
    appendInnerIcon: (__VLS_ctx.showPass ? 'mdi-eye' : 'mdi-eye-off'),
    type: (__VLS_ctx.showPass ? 'text' : 'password'),
    rules: ([__VLS_ctx.rules.required, __VLS_ctx.rules.min]),
    color: "secundary",
    variant: "outlined",
    density: "comfortable",
    hideDetails: "auto",
}));
const __VLS_72 = __VLS_71({
    ...{ 'onClick:appendInner': {} },
    modelValue: (__VLS_ctx.signupPassword),
    label: "Password",
    prependInnerIcon: "mdi-lock",
    appendInnerIcon: (__VLS_ctx.showPass ? 'mdi-eye' : 'mdi-eye-off'),
    type: (__VLS_ctx.showPass ? 'text' : 'password'),
    rules: ([__VLS_ctx.rules.required, __VLS_ctx.rules.min]),
    color: "secundary",
    variant: "outlined",
    density: "comfortable",
    hideDetails: "auto",
}, ...__VLS_functionalComponentArgsRest(__VLS_71));
let __VLS_74;
let __VLS_75;
let __VLS_76;
const __VLS_77 = {
    'onClick:appendInner': (...[$event]) => {
        __VLS_ctx.showPass = !__VLS_ctx.showPass;
    }
};
var __VLS_73;
var __VLS_69;
const __VLS_78 = {}.VCol;
/** @type {[typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ]} */ ;
// @ts-ignore
const __VLS_79 = __VLS_asFunctionalComponent(__VLS_78, new __VLS_78({
    cols: "12",
    sm: "6",
}));
const __VLS_80 = __VLS_79({
    cols: "12",
    sm: "6",
}, ...__VLS_functionalComponentArgsRest(__VLS_79));
__VLS_81.slots.default;
const __VLS_82 = {}.VTextField;
/** @type {[typeof __VLS_components.VTextField, typeof __VLS_components.vTextField, ]} */ ;
// @ts-ignore
const __VLS_83 = __VLS_asFunctionalComponent(__VLS_82, new __VLS_82({
    modelValue: (__VLS_ctx.signupConfirmPassword),
    label: "Confirm Password",
    prependInnerIcon: "mdi-lock-check",
    type: (__VLS_ctx.showPass ? 'text' : 'password'),
    rules: ([__VLS_ctx.rules.required, __VLS_ctx.rules.matchPasswords]),
    color: "secundary",
    variant: "outlined",
    density: "comfortable",
    hideDetails: "auto",
}));
const __VLS_84 = __VLS_83({
    modelValue: (__VLS_ctx.signupConfirmPassword),
    label: "Confirm Password",
    prependInnerIcon: "mdi-lock-check",
    type: (__VLS_ctx.showPass ? 'text' : 'password'),
    rules: ([__VLS_ctx.rules.required, __VLS_ctx.rules.matchPasswords]),
    color: "secundary",
    variant: "outlined",
    density: "comfortable",
    hideDetails: "auto",
}, ...__VLS_functionalComponentArgsRest(__VLS_83));
var __VLS_81;
var __VLS_49;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "terms-box mt-2" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "terms-check" },
});
const __VLS_86 = {}.VCheckbox;
/** @type {[typeof __VLS_components.VCheckbox, typeof __VLS_components.vCheckbox, ]} */ ;
// @ts-ignore
const __VLS_87 = __VLS_asFunctionalComponent(__VLS_86, new __VLS_86({
    modelValue: (__VLS_ctx.agreeTerms),
    color: "green",
    hideDetails: true,
}));
const __VLS_88 = __VLS_87({
    modelValue: (__VLS_ctx.agreeTerms),
    color: "green",
    hideDetails: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_87));
__VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
    ...{ class: "terms-copy mb-0" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.strong, __VLS_intrinsicElements.strong)({
    ...{ onClick: (...[$event]) => {
            __VLS_ctx.termsDialog = true;
        } },
    ...{ class: "terms-link" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.strong, __VLS_intrinsicElements.strong)({
    ...{ onClick: (...[$event]) => {
            __VLS_ctx.privacyDialog = true;
        } },
    ...{ class: "terms-link" },
});
const __VLS_90 = {}.VBtn;
/** @type {[typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ]} */ ;
// @ts-ignore
const __VLS_91 = __VLS_asFunctionalComponent(__VLS_90, new __VLS_90({
    ...{ 'onClick': {} },
    ...{ class: "mt-6" },
    color: "black",
    size: "large",
    block: true,
    loading: (__VLS_ctx.isSubmitting),
    disabled: (__VLS_ctx.isSubmitting),
}));
const __VLS_92 = __VLS_91({
    ...{ 'onClick': {} },
    ...{ class: "mt-6" },
    color: "black",
    size: "large",
    block: true,
    loading: (__VLS_ctx.isSubmitting),
    disabled: (__VLS_ctx.isSubmitting),
}, ...__VLS_functionalComponentArgsRest(__VLS_91));
let __VLS_94;
let __VLS_95;
let __VLS_96;
const __VLS_97 = {
    onClick: (__VLS_ctx.submitForm)
};
__VLS_93.slots.default;
var __VLS_93;
__VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
    ...{ class: "registration-footer text-center text-body-2 mt-5 mb-0" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ onClick: (...[$event]) => {
            __VLS_ctx.navigateTo('/');
        } },
    ...{ class: "footer-link" },
});
var __VLS_43;
var __VLS_20;
var __VLS_16;
var __VLS_12;
var __VLS_8;
const __VLS_98 = {}.VDialog;
/** @type {[typeof __VLS_components.VDialog, typeof __VLS_components.vDialog, typeof __VLS_components.VDialog, typeof __VLS_components.vDialog, ]} */ ;
// @ts-ignore
const __VLS_99 = __VLS_asFunctionalComponent(__VLS_98, new __VLS_98({
    modelValue: (__VLS_ctx.termsDialog),
    maxWidth: "500",
}));
const __VLS_100 = __VLS_99({
    modelValue: (__VLS_ctx.termsDialog),
    maxWidth: "500",
}, ...__VLS_functionalComponentArgsRest(__VLS_99));
__VLS_101.slots.default;
/** @type {[typeof TermsCard, ]} */ ;
// @ts-ignore
const __VLS_102 = __VLS_asFunctionalComponent(TermsCard, new TermsCard({
    ...{ 'onClose': {} },
}));
const __VLS_103 = __VLS_102({
    ...{ 'onClose': {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_102));
let __VLS_105;
let __VLS_106;
let __VLS_107;
const __VLS_108 = {
    onClose: (...[$event]) => {
        __VLS_ctx.termsDialog = false;
    }
};
var __VLS_104;
var __VLS_101;
const __VLS_109 = {}.VDialog;
/** @type {[typeof __VLS_components.VDialog, typeof __VLS_components.vDialog, typeof __VLS_components.VDialog, typeof __VLS_components.vDialog, ]} */ ;
// @ts-ignore
const __VLS_110 = __VLS_asFunctionalComponent(__VLS_109, new __VLS_109({
    modelValue: (__VLS_ctx.privacyDialog),
    maxWidth: "500",
}));
const __VLS_111 = __VLS_110({
    modelValue: (__VLS_ctx.privacyDialog),
    maxWidth: "500",
}, ...__VLS_functionalComponentArgsRest(__VLS_110));
__VLS_112.slots.default;
/** @type {[typeof PrivacyCard, ]} */ ;
// @ts-ignore
const __VLS_113 = __VLS_asFunctionalComponent(PrivacyCard, new PrivacyCard({}));
const __VLS_114 = __VLS_113({}, ...__VLS_functionalComponentArgsRest(__VLS_113));
var __VLS_112;
var __VLS_3;
/** @type {__VLS_StyleScopedClasses['retailer-registration']} */ ;
/** @type {__VLS_StyleScopedClasses['fill-height']} */ ;
/** @type {__VLS_StyleScopedClasses['d-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['align-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['pa-4']} */ ;
/** @type {__VLS_StyleScopedClasses['w-100']} */ ;
/** @type {__VLS_StyleScopedClasses['registration-card']} */ ;
/** @type {__VLS_StyleScopedClasses['elevation-12']} */ ;
/** @type {__VLS_StyleScopedClasses['pa-0']} */ ;
/** @type {__VLS_StyleScopedClasses['registration-shell']} */ ;
/** @type {__VLS_StyleScopedClasses['registration-header']} */ ;
/** @type {__VLS_StyleScopedClasses['back-button']} */ ;
/** @type {__VLS_StyleScopedClasses['mx-auto']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['text-h4']} */ ;
/** @type {__VLS_StyleScopedClasses['font-weight-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-center']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-2']} */ ;
/** @type {__VLS_StyleScopedClasses['registration-body']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-6']} */ ;
/** @type {__VLS_StyleScopedClasses['form-grid']} */ ;
/** @type {__VLS_StyleScopedClasses['terms-box']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-2']} */ ;
/** @type {__VLS_StyleScopedClasses['terms-check']} */ ;
/** @type {__VLS_StyleScopedClasses['terms-copy']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-0']} */ ;
/** @type {__VLS_StyleScopedClasses['terms-link']} */ ;
/** @type {__VLS_StyleScopedClasses['terms-link']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-6']} */ ;
/** @type {__VLS_StyleScopedClasses['registration-footer']} */ ;
/** @type {__VLS_StyleScopedClasses['text-center']} */ ;
/** @type {__VLS_StyleScopedClasses['text-body-2']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-5']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-0']} */ ;
/** @type {__VLS_StyleScopedClasses['footer-link']} */ ;
// @ts-ignore
var __VLS_45 = __VLS_44;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            TermsCard: TermsCard,
            PrivacyCard: PrivacyCard,
            BaseAlert: BaseAlert,
            regForm: regForm,
            signupUsername: signupUsername,
            signupEmail: signupEmail,
            signupPassword: signupPassword,
            signupConfirmPassword: signupConfirmPassword,
            agreeTerms: agreeTerms,
            isSubmitting: isSubmitting,
            alertIcon: alertIcon,
            alertText: alertText,
            alertTitle: alertTitle,
            alertType: alertType,
            termsDialog: termsDialog,
            showAlert: showAlert,
            showPass: showPass,
            privacyDialog: privacyDialog,
            navigateTo: navigateTo,
            rules: rules,
            submitForm: submitForm,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
