/// <reference types="../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import { ref, inject, watch, onMounted, onBeforeMount } from "vue";
import { useRouter, useRoute } from "vue-router";
import md5 from "js-md5";
import TermsCard from "@/components/TermsCard.vue";
import PrivacyCard from "@/components/PrivacyCard.vue";
import { setToken } from "@/service/AccessToken";
import { useUserStore } from "@/store/UserStore";
import BaseAlert from "@/components/Alerts/BaseAlert.vue";
const userStore = useUserStore();
const regForm = ref();
const router = useRouter();
const route = useRoute();
const activeTab = ref(1);
const login = ref("");
const password = ref("");
const signupUsername = ref("");
const signupEmail = ref("");
const signupPassword = ref("");
const signupConfirmPassword = ref("");
const agreeTerms = ref(false);
const regValid = ref(false);
const termsDialog = ref(false);
const alertIcon = ref("");
const alertText = ref("");
const alertTitle = ref("");
const alertType = ref("");
const showAlert = ref(false);
const showPass = ref(false);
const showSignupPass = ref(false);
const privacyDialog = ref(false);
const isLoggingIn = ref(false);
const isSigningUp = ref(false);
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
const sanitizeAuthFields = () => {
    login.value = trimValue(login.value);
    password.value = trimValue(password.value);
    signupUsername.value = trimValue(signupUsername.value);
    signupEmail.value = trimValue(signupEmail.value);
    signupPassword.value = trimValue(signupPassword.value);
    signupConfirmPassword.value = trimValue(signupConfirmPassword.value);
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
watch(() => route.query.tab, (newTab) => {
    activeTab.value = newTab === "signup" ? 1 : 0;
}, { immediate: true });
onMounted(() => {
    activeTab.value = route.query.tab === "signup" ? 1 : 0;
});
const loginUser = async () => {
    sanitizeAuthFields();
    if (!login.value || !password.value) {
        setAllert("mdi-alert-circle", "400", "The email and password fields were not filled out correctly.", "warning");
        return;
    }
    isLoggingIn.value = true;
    try {
        const response = await axios.post("users/login", {
            login: login.value,
            password: md5(password.value),
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
            timezone: dbUser.timezone ?? null,
        };
        userStore.setUser(appUser);
        setAllert("mdi-check", response.status.toString(), response.data.message, "success");
        setToken(response.data.access_token);
        axios.defaults.headers.common["Authorization"] =
            `Bearer ${response.data.access_token}`;
        router.push({ name: "Dashboard" });
    }
    catch (error) {
        console.error("Error during login:", error);
        setAllert("mdi-alert-circle", error.response?.status?.toString() || "500", error.response?.data?.message || "A network error occurred.", "error");
    }
    finally {
        isLoggingIn.value = false;
    }
};
const valReg = async () => {
    sanitizeAuthFields();
    const { valid } = await regForm.value?.validate();
    regValid.value = valid;
};
const submitForm = async () => {
    sanitizeAuthFields();
    await valReg();
    if (!regValid.value) {
        return;
    }
    if (!agreeTerms.value) {
        setAllert("mdi-alert-circle", "400", "You must agree to the terms and conditions.", "warning");
        return;
    }
    isSigningUp.value = true;
    try {
        const response = await axios.post("users/cadastro", {
            name: signupUsername.value,
            user_name: signupUsername.value,
            email: signupEmail.value,
            password: signupConfirmPassword.value,
            roles_fk: 2,
            active: true,
            verified: false,
            agreement: true,
        });
        setAllert("mdi-check", response.status.toString(), response.data.message, "success");
        activeTab.value = 0;
    }
    catch (error) {
        setAllert("mdi-alert-circle", error.response?.status?.toString() || "500", error.response?.data?.message || "An error occurred", "error");
    }
    finally {
        isSigningUp.value = false;
    }
};
onBeforeMount(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
        setToken(token);
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        router.push({ name: "Dashboard" });
    }
});
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['auth-header']} */ ;
/** @type {__VLS_StyleScopedClasses['auth-body']} */ ;
/** @type {__VLS_StyleScopedClasses['terms-box']} */ ;
// CSS variable injection 
// CSS variable injection end 
const __VLS_0 = {}.VContainer;
/** @type {[typeof __VLS_components.VContainer, typeof __VLS_components.vContainer, typeof __VLS_components.VContainer, typeof __VLS_components.vContainer, ]} */ ;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
    ...{ class: "login-page fill-height d-flex align-center justify-center pa-4" },
    fluid: true,
}));
const __VLS_2 = __VLS_1({
    ...{ class: "login-page fill-height d-flex align-center justify-center pa-4" },
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
    md: "8",
    lg: "7",
    xl: "6",
}));
const __VLS_11 = __VLS_10({
    cols: "12",
    md: "8",
    lg: "7",
    xl: "6",
}, ...__VLS_functionalComponentArgsRest(__VLS_10));
__VLS_12.slots.default;
const __VLS_13 = {}.VCard;
/** @type {[typeof __VLS_components.VCard, typeof __VLS_components.vCard, typeof __VLS_components.VCard, typeof __VLS_components.vCard, ]} */ ;
// @ts-ignore
const __VLS_14 = __VLS_asFunctionalComponent(__VLS_13, new __VLS_13({
    color: "secundary",
    ...{ class: "auth-card elevation-12" },
}));
const __VLS_15 = __VLS_14({
    color: "secundary",
    ...{ class: "auth-card elevation-12" },
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
if (__VLS_ctx.activeTab === 0) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "auth-section" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "auth-header" },
    });
    const __VLS_21 = {}.VImg;
    /** @type {[typeof __VLS_components.VImg, typeof __VLS_components.vImg, ]} */ ;
    // @ts-ignore
    const __VLS_22 = __VLS_asFunctionalComponent(__VLS_21, new __VLS_21({
        src: "@/assets/darkness_white.svg",
        maxWidth: "56",
        ...{ class: "mx-auto mb-4" },
    }));
    const __VLS_23 = __VLS_22({
        src: "@/assets/darkness_white.svg",
        maxWidth: "56",
        ...{ class: "mx-auto mb-4" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_22));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.h1, __VLS_intrinsicElements.h1)({
        ...{ class: "text-center text-h4 font-weight-bold mb-2" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "auth-body" },
    });
    /** @type {[typeof BaseAlert, typeof BaseAlert, ]} */ ;
    // @ts-ignore
    const __VLS_25 = __VLS_asFunctionalComponent(BaseAlert, new BaseAlert({
        modelValue: (__VLS_ctx.showAlert),
        type: (__VLS_ctx.alertType),
        icon: (__VLS_ctx.alertIcon),
        title: (__VLS_ctx.alertTitle),
        ...{ class: "mb-6" },
    }));
    const __VLS_26 = __VLS_25({
        modelValue: (__VLS_ctx.showAlert),
        type: (__VLS_ctx.alertType),
        icon: (__VLS_ctx.alertIcon),
        title: (__VLS_ctx.alertTitle),
        ...{ class: "mb-6" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_25));
    __VLS_27.slots.default;
    (__VLS_ctx.alertText);
    var __VLS_27;
    const __VLS_28 = {}.VForm;
    /** @type {[typeof __VLS_components.VForm, typeof __VLS_components.vForm, typeof __VLS_components.VForm, typeof __VLS_components.vForm, ]} */ ;
    // @ts-ignore
    const __VLS_29 = __VLS_asFunctionalComponent(__VLS_28, new __VLS_28({}));
    const __VLS_30 = __VLS_29({}, ...__VLS_functionalComponentArgsRest(__VLS_29));
    __VLS_31.slots.default;
    const __VLS_32 = {}.VTextField;
    /** @type {[typeof __VLS_components.VTextField, typeof __VLS_components.vTextField, ]} */ ;
    // @ts-ignore
    const __VLS_33 = __VLS_asFunctionalComponent(__VLS_32, new __VLS_32({
        label: "Email or Username",
        modelValue: (__VLS_ctx.login),
        prependInnerIcon: "mdi-email",
        color: "secundary",
        variant: "outlined",
        density: "comfortable",
        hideDetails: "auto",
        ...{ class: "mb-4" },
    }));
    const __VLS_34 = __VLS_33({
        label: "Email or Username",
        modelValue: (__VLS_ctx.login),
        prependInnerIcon: "mdi-email",
        color: "secundary",
        variant: "outlined",
        density: "comfortable",
        hideDetails: "auto",
        ...{ class: "mb-4" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_33));
    const __VLS_36 = {}.VTextField;
    /** @type {[typeof __VLS_components.VTextField, typeof __VLS_components.vTextField, ]} */ ;
    // @ts-ignore
    const __VLS_37 = __VLS_asFunctionalComponent(__VLS_36, new __VLS_36({
        ...{ 'onClick:appendInner': {} },
        ...{ 'onKeyup': {} },
        label: "Password",
        modelValue: (__VLS_ctx.password),
        prependInnerIcon: "mdi-lock",
        appendInnerIcon: (__VLS_ctx.showPass ? 'mdi-eye' : 'mdi-eye-off'),
        type: (__VLS_ctx.showPass ? 'text' : 'password'),
        color: "secundary",
        variant: "outlined",
        density: "comfortable",
        hideDetails: "auto",
    }));
    const __VLS_38 = __VLS_37({
        ...{ 'onClick:appendInner': {} },
        ...{ 'onKeyup': {} },
        label: "Password",
        modelValue: (__VLS_ctx.password),
        prependInnerIcon: "mdi-lock",
        appendInnerIcon: (__VLS_ctx.showPass ? 'mdi-eye' : 'mdi-eye-off'),
        type: (__VLS_ctx.showPass ? 'text' : 'password'),
        color: "secundary",
        variant: "outlined",
        density: "comfortable",
        hideDetails: "auto",
    }, ...__VLS_functionalComponentArgsRest(__VLS_37));
    let __VLS_40;
    let __VLS_41;
    let __VLS_42;
    const __VLS_43 = {
        'onClick:appendInner': (...[$event]) => {
            if (!(__VLS_ctx.activeTab === 0))
                return;
            __VLS_ctx.showPass = !__VLS_ctx.showPass;
        }
    };
    const __VLS_44 = {
        onKeyup: (__VLS_ctx.loginUser)
    };
    var __VLS_39;
    var __VLS_31;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
        ...{ onClick: (...[$event]) => {
                if (!(__VLS_ctx.activeTab === 0))
                    return;
                __VLS_ctx.navigateTo('/forgotpassword');
            } },
        ...{ class: "auth-link text-center mt-4 mb-0" },
    });
    const __VLS_45 = {}.VBtn;
    /** @type {[typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ]} */ ;
    // @ts-ignore
    const __VLS_46 = __VLS_asFunctionalComponent(__VLS_45, new __VLS_45({
        ...{ 'onClick': {} },
        ...{ class: "mt-8" },
        color: "black",
        block: true,
        size: "large",
        loading: (__VLS_ctx.isLoggingIn),
        disabled: (__VLS_ctx.isLoggingIn),
    }));
    const __VLS_47 = __VLS_46({
        ...{ 'onClick': {} },
        ...{ class: "mt-8" },
        color: "black",
        block: true,
        size: "large",
        loading: (__VLS_ctx.isLoggingIn),
        disabled: (__VLS_ctx.isLoggingIn),
    }, ...__VLS_functionalComponentArgsRest(__VLS_46));
    let __VLS_49;
    let __VLS_50;
    let __VLS_51;
    const __VLS_52 = {
        onClick: (__VLS_ctx.loginUser)
    };
    __VLS_48.slots.default;
    var __VLS_48;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
        ...{ class: "auth-footer text-caption text-center mt-4 mb-0" },
    });
    const __VLS_53 = {}.VBtn;
    /** @type {[typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ]} */ ;
    // @ts-ignore
    const __VLS_54 = __VLS_asFunctionalComponent(__VLS_53, new __VLS_53({
        ...{ 'onClick': {} },
        color: "secundary",
        ...{ class: "mt-2" },
        variant: "outlined",
        block: true,
    }));
    const __VLS_55 = __VLS_54({
        ...{ 'onClick': {} },
        color: "secundary",
        ...{ class: "mt-2" },
        variant: "outlined",
        block: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_54));
    let __VLS_57;
    let __VLS_58;
    let __VLS_59;
    const __VLS_60 = {
        onClick: (...[$event]) => {
            if (!(__VLS_ctx.activeTab === 0))
                return;
            __VLS_ctx.activeTab = 1;
        }
    };
    __VLS_56.slots.default;
    var __VLS_56;
}
else {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "auth-section" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "auth-header" },
    });
    const __VLS_61 = {}.VImg;
    /** @type {[typeof __VLS_components.VImg, typeof __VLS_components.vImg, ]} */ ;
    // @ts-ignore
    const __VLS_62 = __VLS_asFunctionalComponent(__VLS_61, new __VLS_61({
        src: "@/assets/darkness_white.svg",
        maxWidth: "56",
        ...{ class: "mx-auto mb-4" },
    }));
    const __VLS_63 = __VLS_62({
        src: "@/assets/darkness_white.svg",
        maxWidth: "56",
        ...{ class: "mx-auto mb-4" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_62));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.h1, __VLS_intrinsicElements.h1)({
        ...{ class: "text-center text-h4 font-weight-bold mb-2" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "auth-body" },
    });
    /** @type {[typeof BaseAlert, typeof BaseAlert, ]} */ ;
    // @ts-ignore
    const __VLS_65 = __VLS_asFunctionalComponent(BaseAlert, new BaseAlert({
        modelValue: (__VLS_ctx.showAlert),
        type: (__VLS_ctx.alertType),
        icon: (__VLS_ctx.alertIcon),
        title: (__VLS_ctx.alertTitle),
        ...{ class: "mb-6" },
    }));
    const __VLS_66 = __VLS_65({
        modelValue: (__VLS_ctx.showAlert),
        type: (__VLS_ctx.alertType),
        icon: (__VLS_ctx.alertIcon),
        title: (__VLS_ctx.alertTitle),
        ...{ class: "mb-6" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_65));
    __VLS_67.slots.default;
    (__VLS_ctx.alertText);
    var __VLS_67;
    const __VLS_68 = {}.VForm;
    /** @type {[typeof __VLS_components.VForm, typeof __VLS_components.vForm, typeof __VLS_components.VForm, typeof __VLS_components.vForm, ]} */ ;
    // @ts-ignore
    const __VLS_69 = __VLS_asFunctionalComponent(__VLS_68, new __VLS_68({
        ref: "regForm",
    }));
    const __VLS_70 = __VLS_69({
        ref: "regForm",
    }, ...__VLS_functionalComponentArgsRest(__VLS_69));
    /** @type {typeof __VLS_ctx.regForm} */ ;
    var __VLS_72 = {};
    __VLS_71.slots.default;
    const __VLS_74 = {}.VRow;
    /** @type {[typeof __VLS_components.VRow, typeof __VLS_components.vRow, typeof __VLS_components.VRow, typeof __VLS_components.vRow, ]} */ ;
    // @ts-ignore
    const __VLS_75 = __VLS_asFunctionalComponent(__VLS_74, new __VLS_74({}));
    const __VLS_76 = __VLS_75({}, ...__VLS_functionalComponentArgsRest(__VLS_75));
    __VLS_77.slots.default;
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
        label: "Username",
        modelValue: (__VLS_ctx.signupUsername),
        prependInnerIcon: "mdi-account",
        rules: ([__VLS_ctx.rules.required]),
        color: "secundary",
        variant: "outlined",
        density: "comfortable",
        hideDetails: "auto",
    }));
    const __VLS_84 = __VLS_83({
        label: "Username",
        modelValue: (__VLS_ctx.signupUsername),
        prependInnerIcon: "mdi-account",
        rules: ([__VLS_ctx.rules.required]),
        color: "secundary",
        variant: "outlined",
        density: "comfortable",
        hideDetails: "auto",
    }, ...__VLS_functionalComponentArgsRest(__VLS_83));
    var __VLS_81;
    const __VLS_86 = {}.VCol;
    /** @type {[typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ]} */ ;
    // @ts-ignore
    const __VLS_87 = __VLS_asFunctionalComponent(__VLS_86, new __VLS_86({
        cols: "12",
        sm: "6",
    }));
    const __VLS_88 = __VLS_87({
        cols: "12",
        sm: "6",
    }, ...__VLS_functionalComponentArgsRest(__VLS_87));
    __VLS_89.slots.default;
    const __VLS_90 = {}.VTextField;
    /** @type {[typeof __VLS_components.VTextField, typeof __VLS_components.vTextField, ]} */ ;
    // @ts-ignore
    const __VLS_91 = __VLS_asFunctionalComponent(__VLS_90, new __VLS_90({
        label: "Email",
        modelValue: (__VLS_ctx.signupEmail),
        prependInnerIcon: "mdi-email",
        type: "email",
        rules: ([__VLS_ctx.rules.required, __VLS_ctx.rules.email]),
        color: "secundary",
        variant: "outlined",
        density: "comfortable",
        hideDetails: "auto",
    }));
    const __VLS_92 = __VLS_91({
        label: "Email",
        modelValue: (__VLS_ctx.signupEmail),
        prependInnerIcon: "mdi-email",
        type: "email",
        rules: ([__VLS_ctx.rules.required, __VLS_ctx.rules.email]),
        color: "secundary",
        variant: "outlined",
        density: "comfortable",
        hideDetails: "auto",
    }, ...__VLS_functionalComponentArgsRest(__VLS_91));
    var __VLS_89;
    var __VLS_77;
    const __VLS_94 = {}.VRow;
    /** @type {[typeof __VLS_components.VRow, typeof __VLS_components.vRow, typeof __VLS_components.VRow, typeof __VLS_components.vRow, ]} */ ;
    // @ts-ignore
    const __VLS_95 = __VLS_asFunctionalComponent(__VLS_94, new __VLS_94({}));
    const __VLS_96 = __VLS_95({}, ...__VLS_functionalComponentArgsRest(__VLS_95));
    __VLS_97.slots.default;
    const __VLS_98 = {}.VCol;
    /** @type {[typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ]} */ ;
    // @ts-ignore
    const __VLS_99 = __VLS_asFunctionalComponent(__VLS_98, new __VLS_98({
        cols: "12",
        sm: "6",
    }));
    const __VLS_100 = __VLS_99({
        cols: "12",
        sm: "6",
    }, ...__VLS_functionalComponentArgsRest(__VLS_99));
    __VLS_101.slots.default;
    const __VLS_102 = {}.VTextField;
    /** @type {[typeof __VLS_components.VTextField, typeof __VLS_components.vTextField, ]} */ ;
    // @ts-ignore
    const __VLS_103 = __VLS_asFunctionalComponent(__VLS_102, new __VLS_102({
        ...{ 'onClick:appendInner': {} },
        label: "Password",
        modelValue: (__VLS_ctx.signupPassword),
        prependInnerIcon: "mdi-lock",
        appendInnerIcon: (__VLS_ctx.showSignupPass ? 'mdi-eye' : 'mdi-eye-off'),
        type: (__VLS_ctx.showSignupPass ? 'text' : 'password'),
        rules: ([__VLS_ctx.rules.required, __VLS_ctx.rules.min]),
        color: "secundary",
        variant: "outlined",
        density: "comfortable",
        hideDetails: "auto",
    }));
    const __VLS_104 = __VLS_103({
        ...{ 'onClick:appendInner': {} },
        label: "Password",
        modelValue: (__VLS_ctx.signupPassword),
        prependInnerIcon: "mdi-lock",
        appendInnerIcon: (__VLS_ctx.showSignupPass ? 'mdi-eye' : 'mdi-eye-off'),
        type: (__VLS_ctx.showSignupPass ? 'text' : 'password'),
        rules: ([__VLS_ctx.rules.required, __VLS_ctx.rules.min]),
        color: "secundary",
        variant: "outlined",
        density: "comfortable",
        hideDetails: "auto",
    }, ...__VLS_functionalComponentArgsRest(__VLS_103));
    let __VLS_106;
    let __VLS_107;
    let __VLS_108;
    const __VLS_109 = {
        'onClick:appendInner': (...[$event]) => {
            if (!!(__VLS_ctx.activeTab === 0))
                return;
            __VLS_ctx.showSignupPass = !__VLS_ctx.showSignupPass;
        }
    };
    var __VLS_105;
    var __VLS_101;
    const __VLS_110 = {}.VCol;
    /** @type {[typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ]} */ ;
    // @ts-ignore
    const __VLS_111 = __VLS_asFunctionalComponent(__VLS_110, new __VLS_110({
        cols: "12",
        sm: "6",
    }));
    const __VLS_112 = __VLS_111({
        cols: "12",
        sm: "6",
    }, ...__VLS_functionalComponentArgsRest(__VLS_111));
    __VLS_113.slots.default;
    const __VLS_114 = {}.VTextField;
    /** @type {[typeof __VLS_components.VTextField, typeof __VLS_components.vTextField, ]} */ ;
    // @ts-ignore
    const __VLS_115 = __VLS_asFunctionalComponent(__VLS_114, new __VLS_114({
        label: "Confirm Password",
        modelValue: (__VLS_ctx.signupConfirmPassword),
        prependInnerIcon: "mdi-lock-check",
        type: (__VLS_ctx.showSignupPass ? 'text' : 'password'),
        rules: ([__VLS_ctx.rules.required, __VLS_ctx.rules.matchPasswords]),
        color: "secundary",
        variant: "outlined",
        density: "comfortable",
        hideDetails: "auto",
    }));
    const __VLS_116 = __VLS_115({
        label: "Confirm Password",
        modelValue: (__VLS_ctx.signupConfirmPassword),
        prependInnerIcon: "mdi-lock-check",
        type: (__VLS_ctx.showSignupPass ? 'text' : 'password'),
        rules: ([__VLS_ctx.rules.required, __VLS_ctx.rules.matchPasswords]),
        color: "secundary",
        variant: "outlined",
        density: "comfortable",
        hideDetails: "auto",
    }, ...__VLS_functionalComponentArgsRest(__VLS_115));
    var __VLS_113;
    var __VLS_97;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "terms-box mt-2" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "terms-check" },
    });
    const __VLS_118 = {}.VCheckbox;
    /** @type {[typeof __VLS_components.VCheckbox, typeof __VLS_components.vCheckbox, ]} */ ;
    // @ts-ignore
    const __VLS_119 = __VLS_asFunctionalComponent(__VLS_118, new __VLS_118({
        modelValue: (__VLS_ctx.agreeTerms),
        color: "green",
        hideDetails: true,
    }));
    const __VLS_120 = __VLS_119({
        modelValue: (__VLS_ctx.agreeTerms),
        color: "green",
        hideDetails: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_119));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
        ...{ class: "terms-copy mb-0" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.strong, __VLS_intrinsicElements.strong)({
        ...{ onClick: (...[$event]) => {
                if (!!(__VLS_ctx.activeTab === 0))
                    return;
                __VLS_ctx.termsDialog = true;
            } },
        ...{ class: "auth-link-inline" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
        ...{ onClick: (...[$event]) => {
                if (!!(__VLS_ctx.activeTab === 0))
                    return;
                __VLS_ctx.navigateTo('/retailer-registration');
            } },
        ...{ class: "auth-link auth-link-retailer text-center mt-4 mb-0" },
    });
    const __VLS_122 = {}.VBtn;
    /** @type {[typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ]} */ ;
    // @ts-ignore
    const __VLS_123 = __VLS_asFunctionalComponent(__VLS_122, new __VLS_122({
        ...{ 'onClick': {} },
        ...{ class: "mt-6" },
        color: "black",
        block: true,
        size: "large",
        loading: (__VLS_ctx.isSigningUp),
        disabled: (__VLS_ctx.isSigningUp),
    }));
    const __VLS_124 = __VLS_123({
        ...{ 'onClick': {} },
        ...{ class: "mt-6" },
        color: "black",
        block: true,
        size: "large",
        loading: (__VLS_ctx.isSigningUp),
        disabled: (__VLS_ctx.isSigningUp),
    }, ...__VLS_functionalComponentArgsRest(__VLS_123));
    let __VLS_126;
    let __VLS_127;
    let __VLS_128;
    const __VLS_129 = {
        onClick: (__VLS_ctx.submitForm)
    };
    __VLS_125.slots.default;
    var __VLS_125;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
        ...{ class: "auth-footer text-caption text-center mt-4 mb-0" },
    });
    const __VLS_130 = {}.VBtn;
    /** @type {[typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ]} */ ;
    // @ts-ignore
    const __VLS_131 = __VLS_asFunctionalComponent(__VLS_130, new __VLS_130({
        ...{ 'onClick': {} },
        color: "secundary",
        variant: "outlined",
        ...{ class: "mt-2" },
        block: true,
    }));
    const __VLS_132 = __VLS_131({
        ...{ 'onClick': {} },
        color: "secundary",
        variant: "outlined",
        ...{ class: "mt-2" },
        block: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_131));
    let __VLS_134;
    let __VLS_135;
    let __VLS_136;
    const __VLS_137 = {
        onClick: (...[$event]) => {
            if (!!(__VLS_ctx.activeTab === 0))
                return;
            __VLS_ctx.activeTab = 0;
        }
    };
    __VLS_133.slots.default;
    var __VLS_133;
    var __VLS_71;
}
var __VLS_20;
var __VLS_16;
var __VLS_12;
var __VLS_8;
const __VLS_138 = {}.VDialog;
/** @type {[typeof __VLS_components.VDialog, typeof __VLS_components.vDialog, typeof __VLS_components.VDialog, typeof __VLS_components.vDialog, ]} */ ;
// @ts-ignore
const __VLS_139 = __VLS_asFunctionalComponent(__VLS_138, new __VLS_138({
    modelValue: (__VLS_ctx.termsDialog),
    maxWidth: "500",
}));
const __VLS_140 = __VLS_139({
    modelValue: (__VLS_ctx.termsDialog),
    maxWidth: "500",
}, ...__VLS_functionalComponentArgsRest(__VLS_139));
__VLS_141.slots.default;
/** @type {[typeof TermsCard, ]} */ ;
// @ts-ignore
const __VLS_142 = __VLS_asFunctionalComponent(TermsCard, new TermsCard({
    ...{ 'onClose': {} },
}));
const __VLS_143 = __VLS_142({
    ...{ 'onClose': {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_142));
let __VLS_145;
let __VLS_146;
let __VLS_147;
const __VLS_148 = {
    onClose: (...[$event]) => {
        __VLS_ctx.termsDialog = false;
    }
};
var __VLS_144;
var __VLS_141;
const __VLS_149 = {}.VDialog;
/** @type {[typeof __VLS_components.VDialog, typeof __VLS_components.vDialog, typeof __VLS_components.VDialog, typeof __VLS_components.vDialog, ]} */ ;
// @ts-ignore
const __VLS_150 = __VLS_asFunctionalComponent(__VLS_149, new __VLS_149({
    modelValue: (__VLS_ctx.privacyDialog),
    maxWidth: "500",
}));
const __VLS_151 = __VLS_150({
    modelValue: (__VLS_ctx.privacyDialog),
    maxWidth: "500",
}, ...__VLS_functionalComponentArgsRest(__VLS_150));
__VLS_152.slots.default;
/** @type {[typeof PrivacyCard, ]} */ ;
// @ts-ignore
const __VLS_153 = __VLS_asFunctionalComponent(PrivacyCard, new PrivacyCard({}));
const __VLS_154 = __VLS_153({}, ...__VLS_functionalComponentArgsRest(__VLS_153));
var __VLS_152;
var __VLS_3;
/** @type {__VLS_StyleScopedClasses['login-page']} */ ;
/** @type {__VLS_StyleScopedClasses['fill-height']} */ ;
/** @type {__VLS_StyleScopedClasses['d-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['align-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['pa-4']} */ ;
/** @type {__VLS_StyleScopedClasses['w-100']} */ ;
/** @type {__VLS_StyleScopedClasses['auth-card']} */ ;
/** @type {__VLS_StyleScopedClasses['elevation-12']} */ ;
/** @type {__VLS_StyleScopedClasses['pa-0']} */ ;
/** @type {__VLS_StyleScopedClasses['auth-section']} */ ;
/** @type {__VLS_StyleScopedClasses['auth-header']} */ ;
/** @type {__VLS_StyleScopedClasses['mx-auto']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['text-center']} */ ;
/** @type {__VLS_StyleScopedClasses['text-h4']} */ ;
/** @type {__VLS_StyleScopedClasses['font-weight-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-2']} */ ;
/** @type {__VLS_StyleScopedClasses['auth-body']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-6']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['auth-link']} */ ;
/** @type {__VLS_StyleScopedClasses['text-center']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-4']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-0']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-8']} */ ;
/** @type {__VLS_StyleScopedClasses['auth-footer']} */ ;
/** @type {__VLS_StyleScopedClasses['text-caption']} */ ;
/** @type {__VLS_StyleScopedClasses['text-center']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-4']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-0']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-2']} */ ;
/** @type {__VLS_StyleScopedClasses['auth-section']} */ ;
/** @type {__VLS_StyleScopedClasses['auth-header']} */ ;
/** @type {__VLS_StyleScopedClasses['mx-auto']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['text-center']} */ ;
/** @type {__VLS_StyleScopedClasses['text-h4']} */ ;
/** @type {__VLS_StyleScopedClasses['font-weight-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-2']} */ ;
/** @type {__VLS_StyleScopedClasses['auth-body']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-6']} */ ;
/** @type {__VLS_StyleScopedClasses['terms-box']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-2']} */ ;
/** @type {__VLS_StyleScopedClasses['terms-check']} */ ;
/** @type {__VLS_StyleScopedClasses['terms-copy']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-0']} */ ;
/** @type {__VLS_StyleScopedClasses['auth-link-inline']} */ ;
/** @type {__VLS_StyleScopedClasses['auth-link']} */ ;
/** @type {__VLS_StyleScopedClasses['auth-link-retailer']} */ ;
/** @type {__VLS_StyleScopedClasses['text-center']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-4']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-0']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-6']} */ ;
/** @type {__VLS_StyleScopedClasses['auth-footer']} */ ;
/** @type {__VLS_StyleScopedClasses['text-caption']} */ ;
/** @type {__VLS_StyleScopedClasses['text-center']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-4']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-0']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-2']} */ ;
// @ts-ignore
var __VLS_73 = __VLS_72;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            TermsCard: TermsCard,
            PrivacyCard: PrivacyCard,
            BaseAlert: BaseAlert,
            regForm: regForm,
            activeTab: activeTab,
            login: login,
            password: password,
            signupUsername: signupUsername,
            signupEmail: signupEmail,
            signupPassword: signupPassword,
            signupConfirmPassword: signupConfirmPassword,
            agreeTerms: agreeTerms,
            termsDialog: termsDialog,
            alertIcon: alertIcon,
            alertText: alertText,
            alertTitle: alertTitle,
            alertType: alertType,
            showAlert: showAlert,
            showPass: showPass,
            showSignupPass: showSignupPass,
            privacyDialog: privacyDialog,
            isLoggingIn: isLoggingIn,
            isSigningUp: isSigningUp,
            navigateTo: navigateTo,
            rules: rules,
            loginUser: loginUser,
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
