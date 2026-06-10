/// <reference types="../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import { ref, inject } from "vue";
import { useRouter } from "vue-router";
import TermsCard from "@/components/TermsCard.vue";
import PrivacyCard from "@/components/PrivacyCard.vue";
import BaseAlert from "@/components/Alerts/BaseAlert.vue";
const router = useRouter();
const email = ref("");
const alertIcon = ref("");
const alertText = ref("");
const alertTitle = ref("");
const alertType = ref("");
const showAlert = ref(false);
const termsDialog = ref(false);
const privacyDialog = ref(false);
const isSubmitting = ref(false);
const navigateTo = (route) => {
    router.push(route);
};
const rules = {
    required: (value) => !!value || "Required.",
    email: (value) => /.+@.+\..+/.test(value) || "E-mail must be valid",
};
const axios = inject("axios");
const trimValue = (value) => value?.trim?.() || "";
const sanitizeForgotPasswordFields = () => {
    email.value = trimValue(email.value);
};
const setAllert = (icon, title, text, type) => {
    alertIcon.value = icon;
    alertTitle.value = String(title);
    alertText.value = text;
    showAlert.value = true;
    alertType.value = type;
    setTimeout(() => {
        showAlert.value = false;
    }, 4000);
};
const loginUser = async () => {
    sanitizeForgotPasswordFields();
    if (!email.value) {
        setAllert("mdi-alert-circle", 400, "Email field is required.", "warning");
        return;
    }
    isSubmitting.value = true;
    try {
        const response = await axios.post("users/reset_password", {
            email: email.value,
        });
        setAllert("mdi-check", response.status, response.data.message, "success");
    }
    catch (error) {
        console.error("Error during password reset:", error);
        setAllert("mdi-alert-circle", error.response?.status || 500, error.response?.data?.message || "A network error occurred.", "error");
    }
    finally {
        isSubmitting.value = false;
    }
};
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['forgot-header']} */ ;
/** @type {__VLS_StyleScopedClasses['forgot-body']} */ ;
// CSS variable injection 
// CSS variable injection end 
const __VLS_0 = {}.VContainer;
/** @type {[typeof __VLS_components.VContainer, typeof __VLS_components.vContainer, typeof __VLS_components.VContainer, typeof __VLS_components.vContainer, ]} */ ;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
    ...{ class: "forgot-password-page fill-height d-flex align-center justify-center pa-4" },
    fluid: true,
}));
const __VLS_2 = __VLS_1({
    ...{ class: "forgot-password-page fill-height d-flex align-center justify-center pa-4" },
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
    ...{ class: "forgot-card elevation-12" },
}));
const __VLS_15 = __VLS_14({
    color: "secundary",
    ...{ class: "forgot-card elevation-12" },
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
__VLS_asFunctionalElement(__VLS_intrinsicElements.section, __VLS_intrinsicElements.section)({
    ...{ class: "forgot-header" },
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
    src: "@/assets/darkness_white.svg",
    maxWidth: "56",
    ...{ class: "mx-auto mb-4" },
}));
const __VLS_35 = __VLS_34({
    src: "@/assets/darkness_white.svg",
    maxWidth: "56",
    ...{ class: "mx-auto mb-4" },
}, ...__VLS_functionalComponentArgsRest(__VLS_34));
__VLS_asFunctionalElement(__VLS_intrinsicElements.h1, __VLS_intrinsicElements.h1)({
    ...{ class: "text-center text-h4 font-weight-bold mb-2" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.section, __VLS_intrinsicElements.section)({
    ...{ class: "forgot-body" },
});
/** @type {[typeof BaseAlert, typeof BaseAlert, ]} */ ;
// @ts-ignore
const __VLS_37 = __VLS_asFunctionalComponent(BaseAlert, new BaseAlert({
    modelValue: (__VLS_ctx.showAlert),
    type: (__VLS_ctx.alertType),
    icon: (__VLS_ctx.alertIcon),
    title: (__VLS_ctx.alertTitle),
    ...{ class: "mb-6" },
}));
const __VLS_38 = __VLS_37({
    modelValue: (__VLS_ctx.showAlert),
    type: (__VLS_ctx.alertType),
    icon: (__VLS_ctx.alertIcon),
    title: (__VLS_ctx.alertTitle),
    ...{ class: "mb-6" },
}, ...__VLS_functionalComponentArgsRest(__VLS_37));
__VLS_39.slots.default;
(__VLS_ctx.alertText);
var __VLS_39;
__VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
    ...{ class: "forgot-copy text-center mb-6" },
});
const __VLS_40 = {}.VForm;
/** @type {[typeof __VLS_components.VForm, typeof __VLS_components.vForm, typeof __VLS_components.VForm, typeof __VLS_components.vForm, ]} */ ;
// @ts-ignore
const __VLS_41 = __VLS_asFunctionalComponent(__VLS_40, new __VLS_40({}));
const __VLS_42 = __VLS_41({}, ...__VLS_functionalComponentArgsRest(__VLS_41));
__VLS_43.slots.default;
const __VLS_44 = {}.VTextField;
/** @type {[typeof __VLS_components.VTextField, typeof __VLS_components.vTextField, ]} */ ;
// @ts-ignore
const __VLS_45 = __VLS_asFunctionalComponent(__VLS_44, new __VLS_44({
    label: "Email",
    prependInnerIcon: "mdi-email",
    type: "email",
    modelValue: (__VLS_ctx.email),
    color: "secundary",
    variant: "outlined",
    density: "comfortable",
    hideDetails: "auto",
    rules: ([__VLS_ctx.rules.required, __VLS_ctx.rules.email]),
}));
const __VLS_46 = __VLS_45({
    label: "Email",
    prependInnerIcon: "mdi-email",
    type: "email",
    modelValue: (__VLS_ctx.email),
    color: "secundary",
    variant: "outlined",
    density: "comfortable",
    hideDetails: "auto",
    rules: ([__VLS_ctx.rules.required, __VLS_ctx.rules.email]),
}, ...__VLS_functionalComponentArgsRest(__VLS_45));
var __VLS_43;
const __VLS_48 = {}.VBtn;
/** @type {[typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ]} */ ;
// @ts-ignore
const __VLS_49 = __VLS_asFunctionalComponent(__VLS_48, new __VLS_48({
    ...{ 'onClick': {} },
    ...{ class: "mt-6" },
    color: "black",
    block: true,
    size: "large",
    loading: (__VLS_ctx.isSubmitting),
    disabled: (__VLS_ctx.isSubmitting),
}));
const __VLS_50 = __VLS_49({
    ...{ 'onClick': {} },
    ...{ class: "mt-6" },
    color: "black",
    block: true,
    size: "large",
    loading: (__VLS_ctx.isSubmitting),
    disabled: (__VLS_ctx.isSubmitting),
}, ...__VLS_functionalComponentArgsRest(__VLS_49));
let __VLS_52;
let __VLS_53;
let __VLS_54;
const __VLS_55 = {
    onClick: (__VLS_ctx.loginUser)
};
__VLS_51.slots.default;
var __VLS_51;
var __VLS_20;
var __VLS_16;
var __VLS_12;
var __VLS_8;
const __VLS_56 = {}.VDialog;
/** @type {[typeof __VLS_components.VDialog, typeof __VLS_components.vDialog, typeof __VLS_components.VDialog, typeof __VLS_components.vDialog, ]} */ ;
// @ts-ignore
const __VLS_57 = __VLS_asFunctionalComponent(__VLS_56, new __VLS_56({
    modelValue: (__VLS_ctx.termsDialog),
    maxWidth: "500",
}));
const __VLS_58 = __VLS_57({
    modelValue: (__VLS_ctx.termsDialog),
    maxWidth: "500",
}, ...__VLS_functionalComponentArgsRest(__VLS_57));
__VLS_59.slots.default;
/** @type {[typeof TermsCard, ]} */ ;
// @ts-ignore
const __VLS_60 = __VLS_asFunctionalComponent(TermsCard, new TermsCard({
    ...{ 'onClose': {} },
}));
const __VLS_61 = __VLS_60({
    ...{ 'onClose': {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_60));
let __VLS_63;
let __VLS_64;
let __VLS_65;
const __VLS_66 = {
    onClose: (...[$event]) => {
        __VLS_ctx.termsDialog = false;
    }
};
var __VLS_62;
var __VLS_59;
const __VLS_67 = {}.VDialog;
/** @type {[typeof __VLS_components.VDialog, typeof __VLS_components.vDialog, typeof __VLS_components.VDialog, typeof __VLS_components.vDialog, ]} */ ;
// @ts-ignore
const __VLS_68 = __VLS_asFunctionalComponent(__VLS_67, new __VLS_67({
    modelValue: (__VLS_ctx.privacyDialog),
    maxWidth: "500",
}));
const __VLS_69 = __VLS_68({
    modelValue: (__VLS_ctx.privacyDialog),
    maxWidth: "500",
}, ...__VLS_functionalComponentArgsRest(__VLS_68));
__VLS_70.slots.default;
/** @type {[typeof PrivacyCard, ]} */ ;
// @ts-ignore
const __VLS_71 = __VLS_asFunctionalComponent(PrivacyCard, new PrivacyCard({}));
const __VLS_72 = __VLS_71({}, ...__VLS_functionalComponentArgsRest(__VLS_71));
var __VLS_70;
var __VLS_3;
/** @type {__VLS_StyleScopedClasses['forgot-password-page']} */ ;
/** @type {__VLS_StyleScopedClasses['fill-height']} */ ;
/** @type {__VLS_StyleScopedClasses['d-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['align-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['pa-4']} */ ;
/** @type {__VLS_StyleScopedClasses['w-100']} */ ;
/** @type {__VLS_StyleScopedClasses['forgot-card']} */ ;
/** @type {__VLS_StyleScopedClasses['elevation-12']} */ ;
/** @type {__VLS_StyleScopedClasses['pa-0']} */ ;
/** @type {__VLS_StyleScopedClasses['forgot-header']} */ ;
/** @type {__VLS_StyleScopedClasses['back-button']} */ ;
/** @type {__VLS_StyleScopedClasses['mx-auto']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['text-center']} */ ;
/** @type {__VLS_StyleScopedClasses['text-h4']} */ ;
/** @type {__VLS_StyleScopedClasses['font-weight-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-2']} */ ;
/** @type {__VLS_StyleScopedClasses['forgot-body']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-6']} */ ;
/** @type {__VLS_StyleScopedClasses['forgot-copy']} */ ;
/** @type {__VLS_StyleScopedClasses['text-center']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-6']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-6']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            TermsCard: TermsCard,
            PrivacyCard: PrivacyCard,
            BaseAlert: BaseAlert,
            email: email,
            alertIcon: alertIcon,
            alertText: alertText,
            alertTitle: alertTitle,
            alertType: alertType,
            showAlert: showAlert,
            termsDialog: termsDialog,
            privacyDialog: privacyDialog,
            isSubmitting: isSubmitting,
            navigateTo: navigateTo,
            rules: rules,
            loginUser: loginUser,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
