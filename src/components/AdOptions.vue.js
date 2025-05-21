/// <reference types="../../node_modules/.vue-global-types/vue_3.5_false.d.ts" />
import { ref, inject } from "vue";
import { getToken } from "@/service/AccessToken";
import { useUserStore } from "@/store/UserStore";
import { useRouter } from "vue-router";
const user = useUserStore().user;
const axios = inject("axios");
const router = useRouter();
// Estado de expansão
const isExpanded = ref(false);
const alertIcon = ref("");
const alertText = ref("");
const alertTitle = ref("");
const alertType = ref("");
const showAlert = ref(false);
// Alternar abertura/fechamento
const toggleOptions = () => {
    isExpanded.value = !isExpanded.value;
};
// Função para exibir alertas
const setAllert = (icon, title, text, type) => {
    alertIcon.value = icon;
    alertTitle.value = title;
    alertText.value = text;
    showAlert.value = true;
    alertType.value = type;
};
const userStore = useUserStore();
const deleteUser = async () => {
    try {
        const user_pk = userStore.user?.users_pk;
        if (!user_pk) {
            console.error("❌ Usuário não encontrado.");
            return;
        }
        const response = await axios.delete(`/users/${user_pk}/delete/`, {
            headers: getToken(),
        });
        setAllert("mdi-check", response.status, response.data.message, "success");
        logOut();
    }
    catch (error) {
        console.error("❌ Erro ao deletar usuário:", error);
        setAllert("mdi-alert-circle", error.response?.status || 500, error.response?.data?.message || "A network error occurred.", "error");
    }
};
const logOut = () => {
    localStorage.removeItem("accessToken");
    router.push({ name: "Login" });
};
; /* PartiallyEnd: #3632/scriptSetup.vue */
function __VLS_template() {
    const __VLS_ctx = {};
    let __VLS_components;
    let __VLS_directives;
    const __VLS_0 = {}.VCol;
    /** @type { [typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ] } */ ;
    // @ts-ignore
    const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
        cols: ("12"),
        ...{ class: ("d-flex justify-center pa-0") },
    }));
    const __VLS_2 = __VLS_1({
        cols: ("12"),
        ...{ class: ("d-flex justify-center pa-0") },
    }, ...__VLS_functionalComponentArgsRest(__VLS_1));
    var __VLS_6 = {};
    const __VLS_7 = {}.VContainer;
    /** @type { [typeof __VLS_components.VContainer, typeof __VLS_components.vContainer, typeof __VLS_components.VContainer, typeof __VLS_components.vContainer, ] } */ ;
    // @ts-ignore
    const __VLS_8 = __VLS_asFunctionalComponent(__VLS_7, new __VLS_7({
        maxWidth: ("804"),
        ...{ class: ("py-4") },
    }));
    const __VLS_9 = __VLS_8({
        maxWidth: ("804"),
        ...{ class: ("py-4") },
    }, ...__VLS_functionalComponentArgsRest(__VLS_8));
    const __VLS_13 = {}.VCard;
    /** @type { [typeof __VLS_components.VCard, typeof __VLS_components.vCard, typeof __VLS_components.VCard, typeof __VLS_components.vCard, ] } */ ;
    // @ts-ignore
    const __VLS_14 = __VLS_asFunctionalComponent(__VLS_13, new __VLS_13({
        color: ("primary"),
        elevation: ("2"),
        rounded: ("lg"),
    }));
    const __VLS_15 = __VLS_14({
        color: ("primary"),
        elevation: ("2"),
        rounded: ("lg"),
    }, ...__VLS_functionalComponentArgsRest(__VLS_14));
    const __VLS_19 = {}.VCardTitle;
    /** @type { [typeof __VLS_components.VCardTitle, typeof __VLS_components.vCardTitle, typeof __VLS_components.VCardTitle, typeof __VLS_components.vCardTitle, ] } */ ;
    // @ts-ignore
    const __VLS_20 = __VLS_asFunctionalComponent(__VLS_19, new __VLS_19({
        ...{ 'onClick': {} },
        ...{ class: ("d-flex justify-space-between align-center") },
    }));
    const __VLS_21 = __VLS_20({
        ...{ 'onClick': {} },
        ...{ class: ("d-flex justify-space-between align-center") },
    }, ...__VLS_functionalComponentArgsRest(__VLS_20));
    let __VLS_25;
    const __VLS_26 = {
        onClick: (__VLS_ctx.toggleOptions)
    };
    let __VLS_22;
    let __VLS_23;
    __VLS_elementAsFunction(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: ("text-h5 font-weight-black pl-2 pt-2 pb-2 text-uppercase") },
    });
    const __VLS_27 = {}.VIcon;
    /** @type { [typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, ] } */ ;
    // @ts-ignore
    const __VLS_28 = __VLS_asFunctionalComponent(__VLS_27, new __VLS_27({}));
    const __VLS_29 = __VLS_28({}, ...__VLS_functionalComponentArgsRest(__VLS_28));
    (__VLS_ctx.isExpanded ? "mdi-chevron-up" : "mdi-chevron-down");
    __VLS_32.slots.default;
    var __VLS_32;
    __VLS_24.slots.default;
    var __VLS_24;
    const __VLS_33 = {}.VExpandTransition;
    /** @type { [typeof __VLS_components.VExpandTransition, typeof __VLS_components.vExpandTransition, typeof __VLS_components.VExpandTransition, typeof __VLS_components.vExpandTransition, ] } */ ;
    // @ts-ignore
    const __VLS_34 = __VLS_asFunctionalComponent(__VLS_33, new __VLS_33({}));
    const __VLS_35 = __VLS_34({}, ...__VLS_functionalComponentArgsRest(__VLS_34));
    if (__VLS_ctx.isExpanded) {
        const __VLS_39 = {}.VCardText;
        /** @type { [typeof __VLS_components.VCardText, typeof __VLS_components.vCardText, typeof __VLS_components.VCardText, typeof __VLS_components.vCardText, ] } */ ;
        // @ts-ignore
        const __VLS_40 = __VLS_asFunctionalComponent(__VLS_39, new __VLS_39({}));
        const __VLS_41 = __VLS_40({}, ...__VLS_functionalComponentArgsRest(__VLS_40));
        const __VLS_45 = {}.VAlert;
        /** @type { [typeof __VLS_components.VAlert, typeof __VLS_components.vAlert, typeof __VLS_components.VAlert, typeof __VLS_components.vAlert, ] } */ ;
        // @ts-ignore
        const __VLS_46 = __VLS_asFunctionalComponent(__VLS_45, new __VLS_45({
            closable: (true),
            modelValue: ((__VLS_ctx.showAlert)),
            icon: ((__VLS_ctx.alertIcon)),
            title: ((__VLS_ctx.alertTitle)),
            text: ((__VLS_ctx.alertText)),
            type: ((__VLS_ctx.alertType)),
            ...{ class: ("mb-6") },
        }));
        const __VLS_47 = __VLS_46({
            closable: (true),
            modelValue: ((__VLS_ctx.showAlert)),
            icon: ((__VLS_ctx.alertIcon)),
            title: ((__VLS_ctx.alertTitle)),
            text: ((__VLS_ctx.alertText)),
            type: ((__VLS_ctx.alertType)),
            ...{ class: ("mb-6") },
        }, ...__VLS_functionalComponentArgsRest(__VLS_46));
        const __VLS_51 = {}.VBtn;
        /** @type { [typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ] } */ ;
        // @ts-ignore
        const __VLS_52 = __VLS_asFunctionalComponent(__VLS_51, new __VLS_51({
            ...{ 'onClick': {} },
            block: (true),
            color: ("#A02C2C"),
            ...{ class: ("text-white text-body-1 font-weight-bold mb-3") },
        }));
        const __VLS_53 = __VLS_52({
            ...{ 'onClick': {} },
            block: (true),
            color: ("#A02C2C"),
            ...{ class: ("text-white text-body-1 font-weight-bold mb-3") },
        }, ...__VLS_functionalComponentArgsRest(__VLS_52));
        let __VLS_57;
        const __VLS_58 = {
            onClick: (...[$event]) => {
                if (!((__VLS_ctx.isExpanded)))
                    return;
                __VLS_ctx.deleteUser(__VLS_ctx.user_pk);
            }
        };
        let __VLS_54;
        let __VLS_55;
        __VLS_56.slots.default;
        var __VLS_56;
        __VLS_44.slots.default;
        var __VLS_44;
    }
    __VLS_38.slots.default;
    var __VLS_38;
    __VLS_18.slots.default;
    var __VLS_18;
    if (__VLS_ctx.alertDelete) {
        const __VLS_59 = {}.VAlert;
        /** @type { [typeof __VLS_components.VAlert, typeof __VLS_components.vAlert, typeof __VLS_components.VAlert, typeof __VLS_components.vAlert, ] } */ ;
        // @ts-ignore
        const __VLS_60 = __VLS_asFunctionalComponent(__VLS_59, new __VLS_59({
            ...{ 'onClick:close': {} },
            type: ("error"),
            ...{ class: ("mt-3") },
            text: (true),
            color: ("#A02C2C"),
            title: ("Account Deletion"),
            closeable: (true),
        }));
        const __VLS_61 = __VLS_60({
            ...{ 'onClick:close': {} },
            type: ("error"),
            ...{ class: ("mt-3") },
            text: (true),
            color: ("#A02C2C"),
            title: ("Account Deletion"),
            closeable: (true),
        }, ...__VLS_functionalComponentArgsRest(__VLS_60));
        let __VLS_65;
        const __VLS_66 = {
            'onClick:close': (...[$event]) => {
                if (!((__VLS_ctx.alertDelete)))
                    return;
                __VLS_ctx.alertDelete = false;
            }
        };
        let __VLS_62;
        let __VLS_63;
        __VLS_64.slots.default;
        var __VLS_64;
    }
    if (__VLS_ctx.alertFeedback) {
        const __VLS_67 = {}.VAlert;
        /** @type { [typeof __VLS_components.VAlert, typeof __VLS_components.vAlert, typeof __VLS_components.VAlert, typeof __VLS_components.vAlert, ] } */ ;
        // @ts-ignore
        const __VLS_68 = __VLS_asFunctionalComponent(__VLS_67, new __VLS_67({
            ...{ 'onClick:close': {} },
            type: ("info"),
            ...{ class: ("mt-3") },
            color: ("#C7A738"),
            text: (true),
            title: ("Feedback"),
            closeable: (true),
        }));
        const __VLS_69 = __VLS_68({
            ...{ 'onClick:close': {} },
            type: ("info"),
            ...{ class: ("mt-3") },
            color: ("#C7A738"),
            text: (true),
            title: ("Feedback"),
            closeable: (true),
        }, ...__VLS_functionalComponentArgsRest(__VLS_68));
        let __VLS_73;
        const __VLS_74 = {
            'onClick:close': (...[$event]) => {
                if (!((__VLS_ctx.alertFeedback)))
                    return;
                __VLS_ctx.alertFeedback = false;
            }
        };
        let __VLS_70;
        let __VLS_71;
        __VLS_72.slots.default;
        var __VLS_72;
    }
    if (__VLS_ctx.alertUpdate) {
        const __VLS_75 = {}.VAlert;
        /** @type { [typeof __VLS_components.VAlert, typeof __VLS_components.vAlert, typeof __VLS_components.VAlert, typeof __VLS_components.vAlert, ] } */ ;
        // @ts-ignore
        const __VLS_76 = __VLS_asFunctionalComponent(__VLS_75, new __VLS_75({
            ...{ 'onClick:close': {} },
            type: ("success"),
            ...{ class: ("mt-3") },
            text: (true),
            color: ("#550096"),
            title: ("Account Update"),
            closeable: (true),
        }));
        const __VLS_77 = __VLS_76({
            ...{ 'onClick:close': {} },
            type: ("success"),
            ...{ class: ("mt-3") },
            text: (true),
            color: ("#550096"),
            title: ("Account Update"),
            closeable: (true),
        }, ...__VLS_functionalComponentArgsRest(__VLS_76));
        let __VLS_81;
        const __VLS_82 = {
            'onClick:close': (...[$event]) => {
                if (!((__VLS_ctx.alertUpdate)))
                    return;
                __VLS_ctx.alertUpdate = false;
            }
        };
        let __VLS_78;
        let __VLS_79;
        __VLS_80.slots.default;
        var __VLS_80;
    }
    __VLS_12.slots.default;
    var __VLS_12;
    __VLS_5.slots.default;
    var __VLS_5;
    ['d-flex', 'justify-center', 'pa-0', 'py-4', 'd-flex', 'justify-space-between', 'align-center', 'text-h5', 'font-weight-black', 'pl-2', 'pt-2', 'pb-2', 'text-uppercase', 'mb-6', 'text-white', 'text-body-1', 'font-weight-bold', 'mb-3', 'mt-3', 'mt-3', 'mt-3',];
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
            isExpanded: isExpanded,
            alertIcon: alertIcon,
            alertText: alertText,
            alertTitle: alertTitle,
            alertType: alertType,
            showAlert: showAlert,
            toggleOptions: toggleOptions,
            deleteUser: deleteUser,
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
