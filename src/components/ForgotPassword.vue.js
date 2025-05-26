/// <reference types="../../node_modules/.vue-global-types/vue_3.5_false.d.ts" />
import { ref, inject } from "vue";
import { useRouter } from "vue-router";
import TermsCard from "@/components/TermsCard.vue";
import PrivacyCard from "@/components/PrivacyCard.vue";
import { useUserStore } from "@/store/UserStore";
const userStore = useUserStore();
// Variáveis reativas
const router = useRouter();
const email = ref(""); // Login do usuário
const signupPassword = ref(""); // Senha para cadastro
const alertIcon = ref("");
const alertText = ref("");
const alertTitle = ref("");
const alertType = ref("");
const termsDialog = ref(false);
const showAlert = ref(false);
const privacyDialog = ref(false);
const navigateTo = (route) => {
    router.push(route);
};
// Regras de validação
const rules = {
    required: (value) => !!value || "Required.",
    email: (value) => /.+@.+\..+/.test(value) || "E-mail must be valid",
    min: (v) => v.length >= 8 || "Min 8 characters",
    matchPasswords: (v) => v === signupPassword.value || "The passwords must match",
};
const axios = inject("axios");
// Função para exibir alertas
const setAllert = (icon, title, text, type) => {
    alertIcon.value = icon;
    alertTitle.value = title;
    alertText.value = text;
    showAlert.value = true;
    alertType.value = type;
};
// Função de login
const loginUser = async () => {
    if (!email.value?.trim()) {
        setAllert("mdi-alert-circle", 404, "Email field is required.", "warning");
        return;
    }
    email.value = email.value.trim();
    await axios
        .post("users/reset_password", {
        email: email.value,
    })
        .then((response) => {
        console.log("API Response:", response);
        // Exibe alerta de sucesso
        setAllert("mdi-check", response.status, response.data.message, "success");
    })
        .catch((error) => {
        console.error("Error during login:", error);
        // Trata erros com mensagens apropriadas
        setAllert("mdi-alert-circle", error.response?.status || 500, error.response?.data?.message || "A network error occurred.", "error");
    });
};
; /* PartiallyEnd: #3632/scriptSetup.vue */
function __VLS_template() {
    const __VLS_ctx = {};
    let __VLS_components;
    let __VLS_directives;
    const __VLS_0 = {}.VContainer;
    /** @type { [typeof __VLS_components.VContainer, typeof __VLS_components.vContainer, typeof __VLS_components.VContainer, typeof __VLS_components.vContainer, ] } */ ;
    // @ts-ignore
    const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
        ...{ class: ("fill-height d-flex align-center justify-center pa-4") },
        fluid: (true),
    }));
    const __VLS_2 = __VLS_1({
        ...{ class: ("fill-height d-flex align-center justify-center pa-4") },
        fluid: (true),
    }, ...__VLS_functionalComponentArgsRest(__VLS_1));
    var __VLS_6 = {};
    const __VLS_7 = {}.VRow;
    /** @type { [typeof __VLS_components.VRow, typeof __VLS_components.vRow, typeof __VLS_components.VRow, typeof __VLS_components.vRow, ] } */ ;
    // @ts-ignore
    const __VLS_8 = __VLS_asFunctionalComponent(__VLS_7, new __VLS_7({
        align: ("center"),
        justify: ("center"),
    }));
    const __VLS_9 = __VLS_8({
        align: ("center"),
        justify: ("center"),
    }, ...__VLS_functionalComponentArgsRest(__VLS_8));
    const __VLS_13 = {}.VCol;
    /** @type { [typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ] } */ ;
    // @ts-ignore
    const __VLS_14 = __VLS_asFunctionalComponent(__VLS_13, new __VLS_13({
        cols: ("12"),
        md: ("8"),
        lg: ("6"),
        xl: ("4"),
    }));
    const __VLS_15 = __VLS_14({
        cols: ("12"),
        md: ("8"),
        lg: ("6"),
        xl: ("4"),
    }, ...__VLS_functionalComponentArgsRest(__VLS_14));
    const __VLS_19 = {}.VCard;
    /** @type { [typeof __VLS_components.VCard, typeof __VLS_components.vCard, typeof __VLS_components.VCard, typeof __VLS_components.vCard, ] } */ ;
    // @ts-ignore
    const __VLS_20 = __VLS_asFunctionalComponent(__VLS_19, new __VLS_19({
        ...{ class: ("elevation-12") },
    }));
    const __VLS_21 = __VLS_20({
        ...{ class: ("elevation-12") },
    }, ...__VLS_functionalComponentArgsRest(__VLS_20));
    const __VLS_25 = {}.VCardText;
    /** @type { [typeof __VLS_components.VCardText, typeof __VLS_components.vCardText, typeof __VLS_components.VCardText, typeof __VLS_components.vCardText, ] } */ ;
    // @ts-ignore
    const __VLS_26 = __VLS_asFunctionalComponent(__VLS_25, new __VLS_25({}));
    const __VLS_27 = __VLS_26({}, ...__VLS_functionalComponentArgsRest(__VLS_26));
    const __VLS_31 = {}.VBtn;
    /** @type { [typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ] } */ ;
    // @ts-ignore
    const __VLS_32 = __VLS_asFunctionalComponent(__VLS_31, new __VLS_31({
        ...{ 'onClick': {} },
        color: ("primary"),
    }));
    const __VLS_33 = __VLS_32({
        ...{ 'onClick': {} },
        color: ("primary"),
    }, ...__VLS_functionalComponentArgsRest(__VLS_32));
    let __VLS_37;
    const __VLS_38 = {
        onClick: (...[$event]) => {
            __VLS_ctx.navigateTo('/login');
        }
    };
    let __VLS_34;
    let __VLS_35;
    const __VLS_39 = {}.VIcon;
    /** @type { [typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, ] } */ ;
    // @ts-ignore
    const __VLS_40 = __VLS_asFunctionalComponent(__VLS_39, new __VLS_39({}));
    const __VLS_41 = __VLS_40({}, ...__VLS_functionalComponentArgsRest(__VLS_40));
    __VLS_44.slots.default;
    var __VLS_44;
    __VLS_36.slots.default;
    var __VLS_36;
    const __VLS_45 = {}.VContainer;
    /** @type { [typeof __VLS_components.VContainer, typeof __VLS_components.vContainer, typeof __VLS_components.VContainer, typeof __VLS_components.vContainer, ] } */ ;
    // @ts-ignore
    const __VLS_46 = __VLS_asFunctionalComponent(__VLS_45, new __VLS_45({
        ...{ class: ("d-flex justify-center align-center") },
    }));
    const __VLS_47 = __VLS_46({
        ...{ class: ("d-flex justify-center align-center") },
    }, ...__VLS_functionalComponentArgsRest(__VLS_46));
    const __VLS_51 = {}.VRow;
    /** @type { [typeof __VLS_components.VRow, typeof __VLS_components.vRow, typeof __VLS_components.VRow, typeof __VLS_components.vRow, ] } */ ;
    // @ts-ignore
    const __VLS_52 = __VLS_asFunctionalComponent(__VLS_51, new __VLS_51({
        justify: ("center"),
    }));
    const __VLS_53 = __VLS_52({
        justify: ("center"),
    }, ...__VLS_functionalComponentArgsRest(__VLS_52));
    const __VLS_57 = {}.VCol;
    /** @type { [typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ] } */ ;
    // @ts-ignore
    const __VLS_58 = __VLS_asFunctionalComponent(__VLS_57, new __VLS_57({
        cols: ("12"),
        md: ("6"),
        ...{ class: ("text-center") },
    }));
    const __VLS_59 = __VLS_58({
        cols: ("12"),
        md: ("6"),
        ...{ class: ("text-center") },
    }, ...__VLS_functionalComponentArgsRest(__VLS_58));
    const __VLS_63 = {}.VImg;
    /** @type { [typeof __VLS_components.VImg, typeof __VLS_components.vImg, ] } */ ;
    // @ts-ignore
    const __VLS_64 = __VLS_asFunctionalComponent(__VLS_63, new __VLS_63({
        src: ("@/assets/darkness.png"),
        maxWidth: ("50"),
        alt: ("Centered Icon"),
        ...{ class: ("mx-auto") },
    }));
    const __VLS_65 = __VLS_64({
        src: ("@/assets/darkness.png"),
        maxWidth: ("50"),
        alt: ("Centered Icon"),
        ...{ class: ("mx-auto") },
    }, ...__VLS_functionalComponentArgsRest(__VLS_64));
    __VLS_62.slots.default;
    var __VLS_62;
    const __VLS_69 = {}.VCol;
    /** @type { [typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ] } */ ;
    // @ts-ignore
    const __VLS_70 = __VLS_asFunctionalComponent(__VLS_69, new __VLS_69({
        cols: ("12"),
    }));
    const __VLS_71 = __VLS_70({
        cols: ("12"),
    }, ...__VLS_functionalComponentArgsRest(__VLS_70));
    __VLS_elementAsFunction(__VLS_intrinsicElements.h1, __VLS_intrinsicElements.h1)({
        ...{ class: ("display-2 font-weight-bold") },
    });
    __VLS_74.slots.default;
    var __VLS_74;
    __VLS_56.slots.default;
    var __VLS_56;
    __VLS_50.slots.default;
    var __VLS_50;
    const __VLS_75 = {}.VAlert;
    /** @type { [typeof __VLS_components.VAlert, typeof __VLS_components.vAlert, typeof __VLS_components.VAlert, typeof __VLS_components.vAlert, ] } */ ;
    // @ts-ignore
    const __VLS_76 = __VLS_asFunctionalComponent(__VLS_75, new __VLS_75({
        closable: (true),
        modelValue: ((__VLS_ctx.showAlert)),
        icon: ((__VLS_ctx.alertIcon)),
        title: ((__VLS_ctx.alertTitle)),
        text: ((__VLS_ctx.alertText)),
        type: ((__VLS_ctx.alertType)),
    }));
    const __VLS_77 = __VLS_76({
        closable: (true),
        modelValue: ((__VLS_ctx.showAlert)),
        icon: ((__VLS_ctx.alertIcon)),
        title: ((__VLS_ctx.alertTitle)),
        text: ((__VLS_ctx.alertText)),
        type: ((__VLS_ctx.alertType)),
    }, ...__VLS_functionalComponentArgsRest(__VLS_76));
    __VLS_elementAsFunction(__VLS_intrinsicElements.h4, __VLS_intrinsicElements.h4)({
        ...{ class: ("text-center mt-4 py-3") },
    });
    const __VLS_81 = {}.VForm;
    /** @type { [typeof __VLS_components.VForm, typeof __VLS_components.vForm, typeof __VLS_components.VForm, typeof __VLS_components.vForm, ] } */ ;
    // @ts-ignore
    const __VLS_82 = __VLS_asFunctionalComponent(__VLS_81, new __VLS_81({}));
    const __VLS_83 = __VLS_82({}, ...__VLS_functionalComponentArgsRest(__VLS_82));
    const __VLS_87 = {}.VRow;
    /** @type { [typeof __VLS_components.VRow, typeof __VLS_components.vRow, typeof __VLS_components.VRow, typeof __VLS_components.vRow, ] } */ ;
    // @ts-ignore
    const __VLS_88 = __VLS_asFunctionalComponent(__VLS_87, new __VLS_87({}));
    const __VLS_89 = __VLS_88({}, ...__VLS_functionalComponentArgsRest(__VLS_88));
    const __VLS_93 = {}.VCol;
    /** @type { [typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ] } */ ;
    // @ts-ignore
    const __VLS_94 = __VLS_asFunctionalComponent(__VLS_93, new __VLS_93({
        cols: ("11"),
    }));
    const __VLS_95 = __VLS_94({
        cols: ("11"),
    }, ...__VLS_functionalComponentArgsRest(__VLS_94));
    const __VLS_99 = {}.VTextField;
    /** @type { [typeof __VLS_components.VTextField, typeof __VLS_components.vTextField, ] } */ ;
    // @ts-ignore
    const __VLS_100 = __VLS_asFunctionalComponent(__VLS_99, new __VLS_99({
        label: ("Email"),
        prependIcon: ("mdi-email"),
        type: ("text"),
        modelValue: ((__VLS_ctx.email)),
        color: ("black"),
        outlined: (true),
        dense: (true),
        rules: (([__VLS_ctx.rules.required])),
    }));
    const __VLS_101 = __VLS_100({
        label: ("Email"),
        prependIcon: ("mdi-email"),
        type: ("text"),
        modelValue: ((__VLS_ctx.email)),
        color: ("black"),
        outlined: (true),
        dense: (true),
        rules: (([__VLS_ctx.rules.required])),
    }, ...__VLS_functionalComponentArgsRest(__VLS_100));
    __VLS_98.slots.default;
    var __VLS_98;
    __VLS_92.slots.default;
    var __VLS_92;
    const __VLS_105 = {}.VRow;
    /** @type { [typeof __VLS_components.VRow, typeof __VLS_components.vRow, typeof __VLS_components.VRow, typeof __VLS_components.vRow, ] } */ ;
    // @ts-ignore
    const __VLS_106 = __VLS_asFunctionalComponent(__VLS_105, new __VLS_105({}));
    const __VLS_107 = __VLS_106({}, ...__VLS_functionalComponentArgsRest(__VLS_106));
    __VLS_86.slots.default;
    var __VLS_86;
    const __VLS_111 = {}.VBtn;
    /** @type { [typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ] } */ ;
    // @ts-ignore
    const __VLS_112 = __VLS_asFunctionalComponent(__VLS_111, new __VLS_111({
        ...{ 'onClick': {} },
        ...{ class: ("mt-4") },
        color: ("black"),
        dark: (true),
        block: (true),
    }));
    const __VLS_113 = __VLS_112({
        ...{ 'onClick': {} },
        ...{ class: ("mt-4") },
        color: ("black"),
        dark: (true),
        block: (true),
    }, ...__VLS_functionalComponentArgsRest(__VLS_112));
    let __VLS_117;
    const __VLS_118 = {
        onClick: (__VLS_ctx.loginUser)
    };
    let __VLS_114;
    let __VLS_115;
    __VLS_116.slots.default;
    var __VLS_116;
    __VLS_30.slots.default;
    var __VLS_30;
    __VLS_24.slots.default;
    var __VLS_24;
    __VLS_18.slots.default;
    var __VLS_18;
    __VLS_12.slots.default;
    var __VLS_12;
    const __VLS_119 = {}.VDialog;
    /** @type { [typeof __VLS_components.VDialog, typeof __VLS_components.vDialog, typeof __VLS_components.VDialog, typeof __VLS_components.vDialog, ] } */ ;
    // @ts-ignore
    const __VLS_120 = __VLS_asFunctionalComponent(__VLS_119, new __VLS_119({
        modelValue: ((__VLS_ctx.termsDialog)),
        maxWidth: ("500"),
    }));
    const __VLS_121 = __VLS_120({
        modelValue: ((__VLS_ctx.termsDialog)),
        maxWidth: ("500"),
    }, ...__VLS_functionalComponentArgsRest(__VLS_120));
    // @ts-ignore
    /** @type { [typeof TermsCard, ] } */ ;
    // @ts-ignore
    const __VLS_125 = __VLS_asFunctionalComponent(TermsCard, new TermsCard({}));
    const __VLS_126 = __VLS_125({}, ...__VLS_functionalComponentArgsRest(__VLS_125));
    __VLS_124.slots.default;
    var __VLS_124;
    const __VLS_130 = {}.VDialog;
    /** @type { [typeof __VLS_components.VDialog, typeof __VLS_components.vDialog, typeof __VLS_components.VDialog, typeof __VLS_components.vDialog, ] } */ ;
    // @ts-ignore
    const __VLS_131 = __VLS_asFunctionalComponent(__VLS_130, new __VLS_130({
        modelValue: ((__VLS_ctx.privacyDialog)),
        maxWidth: ("500"),
    }));
    const __VLS_132 = __VLS_131({
        modelValue: ((__VLS_ctx.privacyDialog)),
        maxWidth: ("500"),
    }, ...__VLS_functionalComponentArgsRest(__VLS_131));
    // @ts-ignore
    /** @type { [typeof PrivacyCard, ] } */ ;
    // @ts-ignore
    const __VLS_136 = __VLS_asFunctionalComponent(PrivacyCard, new PrivacyCard({}));
    const __VLS_137 = __VLS_136({}, ...__VLS_functionalComponentArgsRest(__VLS_136));
    __VLS_135.slots.default;
    var __VLS_135;
    __VLS_5.slots.default;
    var __VLS_5;
    ['fill-height', 'd-flex', 'align-center', 'justify-center', 'pa-4', 'elevation-12', 'd-flex', 'justify-center', 'align-center', 'text-center', 'mx-auto', 'display-2', 'font-weight-bold', 'text-center', 'mt-4', 'py-3', 'mt-4',];
    var __VLS_slots;
    var $slots;
    let __VLS_inheritedAttrs;
    var $attrs;
    const __VLS_refs = {};
    var $refs;
    var $el;
    return {
        attrs: {},
        slots: __VLS_slots,
        refs: $refs,
        rootEl: $el,
    };
}
;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            TermsCard: TermsCard,
            PrivacyCard: PrivacyCard,
            email: email,
            alertIcon: alertIcon,
            alertText: alertText,
            alertTitle: alertTitle,
            alertType: alertType,
            termsDialog: termsDialog,
            showAlert: showAlert,
            privacyDialog: privacyDialog,
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
    __typeEl: {},
});
; /* PartiallyEnd: #4569/main.vue */
