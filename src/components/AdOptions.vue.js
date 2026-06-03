/// <reference types="../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import { ref, inject } from "vue";
import { getToken } from "@/service/AccessToken";
import { useUserStore } from "@/store/UserStore";
import BaseAlert from "@/components/Alerts/BaseAlert.vue";
// --- Refs e Injeções ---
const userStore = useUserStore();
const user = userStore.user;
const axios = inject("axios");
// --- Estado do Componente ---
const isExpanded = ref(false);
const showAlert = ref(false);
const alertIcon = ref("");
const alertText = ref("");
const alertTitle = ref("");
const alertType = ref("info");
const showDeleteDialog = ref(false);
const isDeleting = ref(false);
// --- Funções ---
/**
 * Alterna a visibilidade da seção de opções.
 */
const toggleOptions = () => {
    isExpanded.value = !isExpanded.value;
};
/**
 * Exibe um alerta temporário na tela.
 * @param icon Ícone do alerta.
 * @param title Título do alerta.
 * @param text Texto do alerta.
 * @param type Tipo do alerta (success, error, etc.).
 */
const setAlert = (icon, title, text, type) => {
    alertIcon.value = icon;
    alertTitle.value = title;
    alertText.value = text;
    alertType.value = type;
    showAlert.value = true;
    setTimeout(() => {
        showAlert.value = false;
    }, 4000);
};
/**
 * Confirma e executa a exclusão do usuário.
 */
const confirmDelete = async () => {
    isDeleting.value = true; // Ativa o loading do botão
    try {
        const user_pk = user?.users_pk;
        if (!user_pk) {
            console.error("❌ User PK not found in store.");
            setAlert("mdi-alert-circle", "Error", "User not found. Please log in again.", "error");
            return;
        }
        const response = await axios.delete(`/users/${user_pk}/delete/`, {
            headers: getToken(),
        });
        // Mostra a mensagem de sucesso
        setAlert("mdi-check", "Success", response.data.message, "success");
        // Fecha o diálogo e aguarda um momento para o usuário ler a mensagem
        showDeleteDialog.value = false;
        setTimeout(() => {
            // Remove o token de acesso
            localStorage.removeItem("accessToken");
            // Redireciona para a página inicial do site
            window.location.href = window.location.origin;
        }, 2000);
    }
    catch (error) {
        console.error("❌ Error deleting user:", error);
        setAlert("mdi-alert-circle", `Error ${error.response?.status || ""}`, error.response?.data?.message || "A network error occurred.", "error");
    }
    finally {
        isDeleting.value = false; // Desativa o loading
        if (!showAlert.value) {
            // Se nenhum alerta foi exibido (ex: falha de rede sem resposta), fecha o diálogo.
            showDeleteDialog.value = false;
        }
    }
};
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
const __VLS_0 = {}.VCol;
/** @type {[typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ]} */ ;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
    cols: "12",
    ...{ class: "d-flex justify-center pa-0" },
}));
const __VLS_2 = __VLS_1({
    cols: "12",
    ...{ class: "d-flex justify-center pa-0" },
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
var __VLS_4 = {};
__VLS_3.slots.default;
const __VLS_5 = {}.VContainer;
/** @type {[typeof __VLS_components.VContainer, typeof __VLS_components.vContainer, typeof __VLS_components.VContainer, typeof __VLS_components.vContainer, ]} */ ;
// @ts-ignore
const __VLS_6 = __VLS_asFunctionalComponent(__VLS_5, new __VLS_5({
    maxWidth: "804",
    ...{ class: "py-4" },
}));
const __VLS_7 = __VLS_6({
    maxWidth: "804",
    ...{ class: "py-4" },
}, ...__VLS_functionalComponentArgsRest(__VLS_6));
__VLS_8.slots.default;
const __VLS_9 = {}.VCard;
/** @type {[typeof __VLS_components.VCard, typeof __VLS_components.vCard, typeof __VLS_components.VCard, typeof __VLS_components.vCard, ]} */ ;
// @ts-ignore
const __VLS_10 = __VLS_asFunctionalComponent(__VLS_9, new __VLS_9({
    color: "primary",
    elevation: "2",
    rounded: "lg",
}));
const __VLS_11 = __VLS_10({
    color: "primary",
    elevation: "2",
    rounded: "lg",
}, ...__VLS_functionalComponentArgsRest(__VLS_10));
__VLS_12.slots.default;
const __VLS_13 = {}.VCardTitle;
/** @type {[typeof __VLS_components.VCardTitle, typeof __VLS_components.vCardTitle, typeof __VLS_components.VCardTitle, typeof __VLS_components.vCardTitle, ]} */ ;
// @ts-ignore
const __VLS_14 = __VLS_asFunctionalComponent(__VLS_13, new __VLS_13({
    ...{ 'onClick': {} },
    ...{ class: "d-flex justify-space-between align-center" },
}));
const __VLS_15 = __VLS_14({
    ...{ 'onClick': {} },
    ...{ class: "d-flex justify-space-between align-center" },
}, ...__VLS_functionalComponentArgsRest(__VLS_14));
let __VLS_17;
let __VLS_18;
let __VLS_19;
const __VLS_20 = {
    onClick: (__VLS_ctx.toggleOptions)
};
__VLS_16.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "text-h5 font-weight-black pl-2 pt-2 pb-2 text-uppercase" },
});
const __VLS_21 = {}.VIcon;
/** @type {[typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, ]} */ ;
// @ts-ignore
const __VLS_22 = __VLS_asFunctionalComponent(__VLS_21, new __VLS_21({}));
const __VLS_23 = __VLS_22({}, ...__VLS_functionalComponentArgsRest(__VLS_22));
__VLS_24.slots.default;
(__VLS_ctx.isExpanded ? "mdi-chevron-up" : "mdi-chevron-down");
var __VLS_24;
var __VLS_16;
const __VLS_25 = {}.VExpandTransition;
/** @type {[typeof __VLS_components.VExpandTransition, typeof __VLS_components.vExpandTransition, typeof __VLS_components.VExpandTransition, typeof __VLS_components.vExpandTransition, ]} */ ;
// @ts-ignore
const __VLS_26 = __VLS_asFunctionalComponent(__VLS_25, new __VLS_25({}));
const __VLS_27 = __VLS_26({}, ...__VLS_functionalComponentArgsRest(__VLS_26));
__VLS_28.slots.default;
if (__VLS_ctx.isExpanded) {
    const __VLS_29 = {}.VCardText;
    /** @type {[typeof __VLS_components.VCardText, typeof __VLS_components.vCardText, typeof __VLS_components.VCardText, typeof __VLS_components.vCardText, ]} */ ;
    // @ts-ignore
    const __VLS_30 = __VLS_asFunctionalComponent(__VLS_29, new __VLS_29({}));
    const __VLS_31 = __VLS_30({}, ...__VLS_functionalComponentArgsRest(__VLS_30));
    __VLS_32.slots.default;
    /** @type {[typeof BaseAlert, typeof BaseAlert, ]} */ ;
    // @ts-ignore
    const __VLS_33 = __VLS_asFunctionalComponent(BaseAlert, new BaseAlert({
        modelValue: (__VLS_ctx.showAlert),
        type: (__VLS_ctx.alertType),
        icon: (__VLS_ctx.alertIcon),
        title: (__VLS_ctx.alertTitle),
        text: true,
        ...{ class: "mb-6" },
    }));
    const __VLS_34 = __VLS_33({
        modelValue: (__VLS_ctx.showAlert),
        type: (__VLS_ctx.alertType),
        icon: (__VLS_ctx.alertIcon),
        title: (__VLS_ctx.alertTitle),
        text: true,
        ...{ class: "mb-6" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_33));
    __VLS_35.slots.default;
    (__VLS_ctx.alertText);
    var __VLS_35;
    const __VLS_36 = {}.VBtn;
    /** @type {[typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ]} */ ;
    // @ts-ignore
    const __VLS_37 = __VLS_asFunctionalComponent(__VLS_36, new __VLS_36({
        ...{ 'onClick': {} },
        block: true,
        color: "#A02C2C",
        ...{ class: "text-white text-body-1 font-weight-bold mb-3" },
    }));
    const __VLS_38 = __VLS_37({
        ...{ 'onClick': {} },
        block: true,
        color: "#A02C2C",
        ...{ class: "text-white text-body-1 font-weight-bold mb-3" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_37));
    let __VLS_40;
    let __VLS_41;
    let __VLS_42;
    const __VLS_43 = {
        onClick: (...[$event]) => {
            if (!(__VLS_ctx.isExpanded))
                return;
            __VLS_ctx.showDeleteDialog = true;
        }
    };
    __VLS_39.slots.default;
    var __VLS_39;
    var __VLS_32;
}
var __VLS_28;
var __VLS_12;
const __VLS_44 = {}.VDialog;
/** @type {[typeof __VLS_components.VDialog, typeof __VLS_components.vDialog, typeof __VLS_components.VDialog, typeof __VLS_components.vDialog, ]} */ ;
// @ts-ignore
const __VLS_45 = __VLS_asFunctionalComponent(__VLS_44, new __VLS_44({
    modelValue: (__VLS_ctx.showDeleteDialog),
    maxWidth: "500px",
    persistent: true,
}));
const __VLS_46 = __VLS_45({
    modelValue: (__VLS_ctx.showDeleteDialog),
    maxWidth: "500px",
    persistent: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_45));
__VLS_47.slots.default;
const __VLS_48 = {}.VCard;
/** @type {[typeof __VLS_components.VCard, typeof __VLS_components.vCard, typeof __VLS_components.VCard, typeof __VLS_components.vCard, ]} */ ;
// @ts-ignore
const __VLS_49 = __VLS_asFunctionalComponent(__VLS_48, new __VLS_48({}));
const __VLS_50 = __VLS_49({}, ...__VLS_functionalComponentArgsRest(__VLS_49));
__VLS_51.slots.default;
const __VLS_52 = {}.VCardTitle;
/** @type {[typeof __VLS_components.VCardTitle, typeof __VLS_components.vCardTitle, typeof __VLS_components.VCardTitle, typeof __VLS_components.vCardTitle, ]} */ ;
// @ts-ignore
const __VLS_53 = __VLS_asFunctionalComponent(__VLS_52, new __VLS_52({
    ...{ class: "text-h5" },
}));
const __VLS_54 = __VLS_53({
    ...{ class: "text-h5" },
}, ...__VLS_functionalComponentArgsRest(__VLS_53));
__VLS_55.slots.default;
var __VLS_55;
const __VLS_56 = {}.VCardText;
/** @type {[typeof __VLS_components.VCardText, typeof __VLS_components.vCardText, typeof __VLS_components.VCardText, typeof __VLS_components.vCardText, ]} */ ;
// @ts-ignore
const __VLS_57 = __VLS_asFunctionalComponent(__VLS_56, new __VLS_56({}));
const __VLS_58 = __VLS_57({}, ...__VLS_functionalComponentArgsRest(__VLS_57));
__VLS_59.slots.default;
var __VLS_59;
const __VLS_60 = {}.VCardActions;
/** @type {[typeof __VLS_components.VCardActions, typeof __VLS_components.vCardActions, typeof __VLS_components.VCardActions, typeof __VLS_components.vCardActions, ]} */ ;
// @ts-ignore
const __VLS_61 = __VLS_asFunctionalComponent(__VLS_60, new __VLS_60({}));
const __VLS_62 = __VLS_61({}, ...__VLS_functionalComponentArgsRest(__VLS_61));
__VLS_63.slots.default;
const __VLS_64 = {}.VSpacer;
/** @type {[typeof __VLS_components.VSpacer, typeof __VLS_components.vSpacer, typeof __VLS_components.VSpacer, typeof __VLS_components.vSpacer, ]} */ ;
// @ts-ignore
const __VLS_65 = __VLS_asFunctionalComponent(__VLS_64, new __VLS_64({}));
const __VLS_66 = __VLS_65({}, ...__VLS_functionalComponentArgsRest(__VLS_65));
const __VLS_68 = {}.VBtn;
/** @type {[typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ]} */ ;
// @ts-ignore
const __VLS_69 = __VLS_asFunctionalComponent(__VLS_68, new __VLS_68({
    ...{ 'onClick': {} },
    variant: "text",
}));
const __VLS_70 = __VLS_69({
    ...{ 'onClick': {} },
    variant: "text",
}, ...__VLS_functionalComponentArgsRest(__VLS_69));
let __VLS_72;
let __VLS_73;
let __VLS_74;
const __VLS_75 = {
    onClick: (...[$event]) => {
        __VLS_ctx.showDeleteDialog = false;
    }
};
__VLS_71.slots.default;
var __VLS_71;
const __VLS_76 = {}.VBtn;
/** @type {[typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ]} */ ;
// @ts-ignore
const __VLS_77 = __VLS_asFunctionalComponent(__VLS_76, new __VLS_76({
    ...{ 'onClick': {} },
    color: "red-darken-1",
    variant: "text",
    loading: (__VLS_ctx.isDeleting),
}));
const __VLS_78 = __VLS_77({
    ...{ 'onClick': {} },
    color: "red-darken-1",
    variant: "text",
    loading: (__VLS_ctx.isDeleting),
}, ...__VLS_functionalComponentArgsRest(__VLS_77));
let __VLS_80;
let __VLS_81;
let __VLS_82;
const __VLS_83 = {
    onClick: (__VLS_ctx.confirmDelete)
};
__VLS_79.slots.default;
var __VLS_79;
var __VLS_63;
var __VLS_51;
var __VLS_47;
var __VLS_8;
var __VLS_3;
/** @type {__VLS_StyleScopedClasses['d-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['pa-0']} */ ;
/** @type {__VLS_StyleScopedClasses['py-4']} */ ;
/** @type {__VLS_StyleScopedClasses['d-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-space-between']} */ ;
/** @type {__VLS_StyleScopedClasses['align-center']} */ ;
/** @type {__VLS_StyleScopedClasses['text-h5']} */ ;
/** @type {__VLS_StyleScopedClasses['font-weight-black']} */ ;
/** @type {__VLS_StyleScopedClasses['pl-2']} */ ;
/** @type {__VLS_StyleScopedClasses['pt-2']} */ ;
/** @type {__VLS_StyleScopedClasses['pb-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-uppercase']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-6']} */ ;
/** @type {__VLS_StyleScopedClasses['text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['text-body-1']} */ ;
/** @type {__VLS_StyleScopedClasses['font-weight-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-3']} */ ;
/** @type {__VLS_StyleScopedClasses['text-h5']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            BaseAlert: BaseAlert,
            isExpanded: isExpanded,
            showAlert: showAlert,
            alertIcon: alertIcon,
            alertText: alertText,
            alertTitle: alertTitle,
            alertType: alertType,
            showDeleteDialog: showDeleteDialog,
            isDeleting: isDeleting,
            toggleOptions: toggleOptions,
            confirmDelete: confirmDelete,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
