/// <reference types="../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
// Importa as funções necessárias do Vue, incluindo reactive e nextTick
import { ref, inject, onMounted, reactive, nextTick } from "vue";
import { useUserStore } from "@/store/UserStore";
import { getToken } from "@/service/AccessToken";
import BaseAlert from "@/components/Alerts/BaseAlert.vue";
const userForm = ref();
const userStore = useUserStore();
const user = userStore.user;
// Estado de expansão
const isExpanded = ref(false);
// Alternar abertura/fechamento
const toggleForm = () => {
    isExpanded.value = !isExpanded.value;
};
// Dados do formulário
const form = reactive({
    name: user.name,
    user_name: user.user_name,
    zip_code: user.zip_code,
    new_email: user.email,
    confirm_email: user.email,
    email_updates: user.email_updates,
    new_password: "",
    confirm_password: "",
    country: user.countries_fk || null,
});
const rules = {
    email: (value) => value.length === 0 || /.+@.+\..+/.test(value) || "E-mail must be valid",
    min: (v) => v.length === 0 || v.length >= 8 || "Min 8 characters",
    matchPasswords: (v) => v === form.new_password || "The passwords must match",
    matchEmails: (v) => v === form.new_email || "The Emails must match",
};
const alertRef = ref(null);
const alertIcon = ref("");
const alertText = ref("");
const alertTitle = ref("");
const alertType = ref("");
const showAlert = ref(false);
const showPass = ref(false);
const axios = inject("axios");
const validForm = ref(false);
const changeEmail = ref(false);
const changePassword = ref(false);
const countriesList = ref([]);
const trimValue = (value) => value?.trim?.() || "";
const sanitizeAccountForm = () => {
    form.name = trimValue(form.name);
    form.user_name = trimValue(form.user_name);
    form.zip_code = trimValue(form.zip_code);
    form.new_email = trimValue(form.new_email);
    form.confirm_email = trimValue(form.confirm_email);
    form.new_password = trimValue(form.new_password);
    form.confirm_password = trimValue(form.confirm_password);
};
// Função para exibir alertas
const setAllert = (icon, title, text, type) => {
    alertIcon.value = icon;
    alertTitle.value = title;
    alertText.value = text;
    showAlert.value = true;
    alertType.value = type;
    // Usa nextTick para esperar o DOM ser atualizado
    nextTick(() => {
        // Verifica se a referência ao alerta existe
        if (alertRef.value) {
            // Rola a página até o elemento do alerta
            alertRef.value.$el.scrollIntoView({
                behavior: "smooth",
                block: "center",
            });
        }
    });
    setTimeout(() => {
        showAlert.value = false;
    }, 5000); // Aumentei o tempo para 5 segundos
};
const valReg = async () => {
    sanitizeAccountForm();
    const { valid } = await userForm.value.validate();
    validForm.value = valid;
};
// Funções de salvar e cancelar
const saveForm = async () => {
    sanitizeAccountForm();
    await valReg();
    if (validForm.value) {
        await axios
            .put("users/alter", {
            users_pk: user.users_pk,
            name: form.name,
            user_name: form.user_name,
            zip_code: form.zip_code,
            email: changeEmail.value ? form.confirm_email : user.email,
            receive_email: form.email_updates,
            password: changePassword.value ? form.confirm_password : undefined,
            countries_fk: countriesList.value.find((country) => country.name === form.country)?.countries_pk,
        }, {
            headers: getToken(),
        })
            .then((response) => {
            console.log("API Response:", response);
            const dbUser = response.data.data;
            userStore.setUser({ ...user, ...dbUser });
            setAllert("mdi-check", response.status, response.data.message, "success");
        })
            .catch((error) => {
            console.error("Erro ao salvar usuário:", error);
            setAllert("mdi-alert-circle", String(error.response?.status || 500), error.response?.data?.message || "Erro de rede.", "error");
        });
    }
};
const fetchCountries = () => {
    axios
        .get("countries/search")
        .then((response) => {
        countriesList.value = response.data.countries.map((country) => ({
            countries_pk: country.countries_pk,
            name: country.name,
            abbreviation: country.abbreviation,
        }));
        const userCountry = countriesList.value.find((country) => country.countries_pk === form.country);
        form.country = userCountry ? userCountry.name : "";
    })
        .catch((error) => {
        console.error("Erro ao buscar países:", error);
    });
};
const cancelForm = () => {
    console.log("Form Cancelled");
};
onMounted(() => {
    fetchCountries();
});
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
    onClick: (__VLS_ctx.toggleForm)
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
        ref: "alertRef",
        modelValue: (__VLS_ctx.showAlert),
        type: (__VLS_ctx.alertType),
        icon: (__VLS_ctx.alertIcon),
        title: (__VLS_ctx.alertTitle),
        text: true,
        ...{ class: "mb-4" },
    }));
    const __VLS_34 = __VLS_33({
        ref: "alertRef",
        modelValue: (__VLS_ctx.showAlert),
        type: (__VLS_ctx.alertType),
        icon: (__VLS_ctx.alertIcon),
        title: (__VLS_ctx.alertTitle),
        text: true,
        ...{ class: "mb-4" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_33));
    /** @type {typeof __VLS_ctx.alertRef} */ ;
    var __VLS_36 = {};
    __VLS_35.slots.default;
    (__VLS_ctx.alertText);
    var __VLS_35;
    const __VLS_38 = {}.VForm;
    /** @type {[typeof __VLS_components.VForm, typeof __VLS_components.vForm, typeof __VLS_components.VForm, typeof __VLS_components.vForm, ]} */ ;
    // @ts-ignore
    const __VLS_39 = __VLS_asFunctionalComponent(__VLS_38, new __VLS_38({
        ref: "userForm",
    }));
    const __VLS_40 = __VLS_39({
        ref: "userForm",
    }, ...__VLS_functionalComponentArgsRest(__VLS_39));
    /** @type {typeof __VLS_ctx.userForm} */ ;
    var __VLS_42 = {};
    __VLS_41.slots.default;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
        ...{ class: "text-h6 font-weight-medium pl-3 pb-3 pt-5" },
    });
    const __VLS_44 = {}.VTextField;
    /** @type {[typeof __VLS_components.VTextField, typeof __VLS_components.vTextField, typeof __VLS_components.VTextField, typeof __VLS_components.vTextField, ]} */ ;
    // @ts-ignore
    const __VLS_45 = __VLS_asFunctionalComponent(__VLS_44, new __VLS_44({
        label: "",
        variant: "solo-filled",
        modelValue: (__VLS_ctx.form.name),
        ...{ class: "mb-0" },
    }));
    const __VLS_46 = __VLS_45({
        label: "",
        variant: "solo-filled",
        modelValue: (__VLS_ctx.form.name),
        ...{ class: "mb-0" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_45));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
        ...{ class: "text-h6 font-weight-medium pl-3 pb-3 pt-0" },
    });
    const __VLS_48 = {}.VTextField;
    /** @type {[typeof __VLS_components.VTextField, typeof __VLS_components.vTextField, typeof __VLS_components.VTextField, typeof __VLS_components.vTextField, ]} */ ;
    // @ts-ignore
    const __VLS_49 = __VLS_asFunctionalComponent(__VLS_48, new __VLS_48({
        label: "",
        variant: "solo-filled",
        modelValue: (__VLS_ctx.form.user_name),
        ...{ class: "mb-0" },
    }));
    const __VLS_50 = __VLS_49({
        label: "",
        variant: "solo-filled",
        modelValue: (__VLS_ctx.form.user_name),
        ...{ class: "mb-0" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_49));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
        ...{ class: "text-h6 font-weight-medium pl-3 pb-3 pt-0" },
    });
    const __VLS_52 = {}.VRow;
    /** @type {[typeof __VLS_components.VRow, typeof __VLS_components.vRow, typeof __VLS_components.VRow, typeof __VLS_components.vRow, ]} */ ;
    // @ts-ignore
    const __VLS_53 = __VLS_asFunctionalComponent(__VLS_52, new __VLS_52({
        noGutters: true,
    }));
    const __VLS_54 = __VLS_53({
        noGutters: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_53));
    __VLS_55.slots.default;
    const __VLS_56 = {}.VCol;
    /** @type {[typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ]} */ ;
    // @ts-ignore
    const __VLS_57 = __VLS_asFunctionalComponent(__VLS_56, new __VLS_56({
        cols: "10",
        sm: "11",
    }));
    const __VLS_58 = __VLS_57({
        cols: "10",
        sm: "11",
    }, ...__VLS_functionalComponentArgsRest(__VLS_57));
    __VLS_59.slots.default;
    const __VLS_60 = {}.VTextField;
    /** @type {[typeof __VLS_components.VTextField, typeof __VLS_components.vTextField, typeof __VLS_components.VTextField, typeof __VLS_components.vTextField, ]} */ ;
    // @ts-ignore
    const __VLS_61 = __VLS_asFunctionalComponent(__VLS_60, new __VLS_60({
        disabled: (!__VLS_ctx.changeEmail),
        label: "",
        variant: "solo-filled",
        modelValue: (__VLS_ctx.form.new_email),
        rules: ([__VLS_ctx.rules.email]),
        ...{ class: "mb-0" },
    }));
    const __VLS_62 = __VLS_61({
        disabled: (!__VLS_ctx.changeEmail),
        label: "",
        variant: "solo-filled",
        modelValue: (__VLS_ctx.form.new_email),
        rules: ([__VLS_ctx.rules.email]),
        ...{ class: "mb-0" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_61));
    var __VLS_59;
    const __VLS_64 = {}.VCol;
    /** @type {[typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ]} */ ;
    // @ts-ignore
    const __VLS_65 = __VLS_asFunctionalComponent(__VLS_64, new __VLS_64({
        cols: "2",
        sm: "1",
        ...{ class: "d-flex justify-center align-center" },
    }));
    const __VLS_66 = __VLS_65({
        cols: "2",
        sm: "1",
        ...{ class: "d-flex justify-center align-center" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_65));
    __VLS_67.slots.default;
    const __VLS_68 = {}.VIcon;
    /** @type {[typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, ]} */ ;
    // @ts-ignore
    const __VLS_69 = __VLS_asFunctionalComponent(__VLS_68, new __VLS_68({
        ...{ 'onClick': {} },
        ...{ class: "mb-4" },
    }));
    const __VLS_70 = __VLS_69({
        ...{ 'onClick': {} },
        ...{ class: "mb-4" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_69));
    let __VLS_72;
    let __VLS_73;
    let __VLS_74;
    const __VLS_75 = {
        onClick: (...[$event]) => {
            if (!(__VLS_ctx.isExpanded))
                return;
            __VLS_ctx.changeEmail = !__VLS_ctx.changeEmail;
        }
    };
    __VLS_71.slots.default;
    var __VLS_71;
    var __VLS_67;
    var __VLS_55;
    if (__VLS_ctx.changeEmail) {
        const __VLS_76 = {}.VRow;
        /** @type {[typeof __VLS_components.VRow, typeof __VLS_components.vRow, typeof __VLS_components.VRow, typeof __VLS_components.vRow, ]} */ ;
        // @ts-ignore
        const __VLS_77 = __VLS_asFunctionalComponent(__VLS_76, new __VLS_76({
            noGutters: true,
        }));
        const __VLS_78 = __VLS_77({
            noGutters: true,
        }, ...__VLS_functionalComponentArgsRest(__VLS_77));
        __VLS_79.slots.default;
        const __VLS_80 = {}.VCol;
        /** @type {[typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ]} */ ;
        // @ts-ignore
        const __VLS_81 = __VLS_asFunctionalComponent(__VLS_80, new __VLS_80({}));
        const __VLS_82 = __VLS_81({}, ...__VLS_functionalComponentArgsRest(__VLS_81));
        __VLS_83.slots.default;
        __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
            ...{ class: "text-h6 font-weight-medium pl-3 pb-3 pt-0" },
        });
        const __VLS_84 = {}.VTextField;
        /** @type {[typeof __VLS_components.VTextField, typeof __VLS_components.vTextField, typeof __VLS_components.VTextField, typeof __VLS_components.vTextField, ]} */ ;
        // @ts-ignore
        const __VLS_85 = __VLS_asFunctionalComponent(__VLS_84, new __VLS_84({
            label: "",
            variant: "solo-filled",
            modelValue: (__VLS_ctx.form.confirm_email),
            rules: ([__VLS_ctx.rules.matchEmails]),
            ...{ class: "mb-0" },
        }));
        const __VLS_86 = __VLS_85({
            label: "",
            variant: "solo-filled",
            modelValue: (__VLS_ctx.form.confirm_email),
            rules: ([__VLS_ctx.rules.matchEmails]),
            ...{ class: "mb-0" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_85));
        var __VLS_83;
        var __VLS_79;
    }
    const __VLS_88 = {}.VSwitch;
    /** @type {[typeof __VLS_components.VSwitch, typeof __VLS_components.vSwitch, typeof __VLS_components.VSwitch, typeof __VLS_components.vSwitch, ]} */ ;
    // @ts-ignore
    const __VLS_89 = __VLS_asFunctionalComponent(__VLS_88, new __VLS_88({
        modelValue: (__VLS_ctx.form.email_updates),
        label: "Send email updates for friend requests, events next to you and app updates.",
        inset: true,
        ...{ class: "mb-0" },
        color: "green",
    }));
    const __VLS_90 = __VLS_89({
        modelValue: (__VLS_ctx.form.email_updates),
        label: "Send email updates for friend requests, events next to you and app updates.",
        inset: true,
        ...{ class: "mb-0" },
        color: "green",
    }, ...__VLS_functionalComponentArgsRest(__VLS_89));
    const __VLS_92 = {}.VRow;
    /** @type {[typeof __VLS_components.VRow, typeof __VLS_components.vRow, typeof __VLS_components.VRow, typeof __VLS_components.vRow, ]} */ ;
    // @ts-ignore
    const __VLS_93 = __VLS_asFunctionalComponent(__VLS_92, new __VLS_92({
        noGutters: true,
    }));
    const __VLS_94 = __VLS_93({
        noGutters: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_93));
    __VLS_95.slots.default;
    const __VLS_96 = {}.VCol;
    /** @type {[typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ]} */ ;
    // @ts-ignore
    const __VLS_97 = __VLS_asFunctionalComponent(__VLS_96, new __VLS_96({
        cols: "12",
    }));
    const __VLS_98 = __VLS_97({
        cols: "12",
    }, ...__VLS_functionalComponentArgsRest(__VLS_97));
    __VLS_99.slots.default;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
        ...{ class: "text-h6 font-weight-medium pl-3 pb-3 pt-0" },
    });
    const __VLS_100 = {}.VAutocomplete;
    /** @type {[typeof __VLS_components.VAutocomplete, typeof __VLS_components.vAutocomplete, typeof __VLS_components.VAutocomplete, typeof __VLS_components.vAutocomplete, ]} */ ;
    // @ts-ignore
    const __VLS_101 = __VLS_asFunctionalComponent(__VLS_100, new __VLS_100({
        modelValue: (__VLS_ctx.form.country),
        items: (__VLS_ctx.countriesList),
        itemTitle: "name",
        itemValue: "name",
        variant: "solo-filled",
        label: "Select or type a country",
        ...{ class: "mb-0" },
    }));
    const __VLS_102 = __VLS_101({
        modelValue: (__VLS_ctx.form.country),
        items: (__VLS_ctx.countriesList),
        itemTitle: "name",
        itemValue: "name",
        variant: "solo-filled",
        label: "Select or type a country",
        ...{ class: "mb-0" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_101));
    var __VLS_99;
    var __VLS_95;
    if (__VLS_ctx.form.country === 'US') {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
            ...{ class: "text-h6 font-weight-medium pl-3 pb-3 pt-0" },
        });
    }
    if (__VLS_ctx.form.country === 'US') {
        const __VLS_104 = {}.VTextField;
        /** @type {[typeof __VLS_components.VTextField, typeof __VLS_components.vTextField, typeof __VLS_components.VTextField, typeof __VLS_components.vTextField, ]} */ ;
        // @ts-ignore
        const __VLS_105 = __VLS_asFunctionalComponent(__VLS_104, new __VLS_104({
            label: "",
            variant: "solo-filled",
            modelValue: (__VLS_ctx.form.zip_code),
            ...{ class: "mb-0" },
        }));
        const __VLS_106 = __VLS_105({
            label: "",
            variant: "solo-filled",
            modelValue: (__VLS_ctx.form.zip_code),
            ...{ class: "mb-0" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_105));
    }
    const __VLS_108 = {}.VRow;
    /** @type {[typeof __VLS_components.VRow, typeof __VLS_components.vRow, typeof __VLS_components.VRow, typeof __VLS_components.vRow, ]} */ ;
    // @ts-ignore
    const __VLS_109 = __VLS_asFunctionalComponent(__VLS_108, new __VLS_108({
        noGutters: true,
    }));
    const __VLS_110 = __VLS_109({
        noGutters: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_109));
    __VLS_111.slots.default;
    const __VLS_112 = {}.VCol;
    /** @type {[typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ]} */ ;
    // @ts-ignore
    const __VLS_113 = __VLS_asFunctionalComponent(__VLS_112, new __VLS_112({
        cols: "12",
    }));
    const __VLS_114 = __VLS_113({
        cols: "12",
    }, ...__VLS_functionalComponentArgsRest(__VLS_113));
    __VLS_115.slots.default;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
        ...{ class: "text-h6 font-weight-medium pl-3 pb-3 pt-0" },
    });
    var __VLS_115;
    const __VLS_116 = {}.VCol;
    /** @type {[typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ]} */ ;
    // @ts-ignore
    const __VLS_117 = __VLS_asFunctionalComponent(__VLS_116, new __VLS_116({
        cols: "10",
        sm: "11",
    }));
    const __VLS_118 = __VLS_117({
        cols: "10",
        sm: "11",
    }, ...__VLS_functionalComponentArgsRest(__VLS_117));
    __VLS_119.slots.default;
    const __VLS_120 = {}.VTextField;
    /** @type {[typeof __VLS_components.VTextField, typeof __VLS_components.vTextField, typeof __VLS_components.VTextField, typeof __VLS_components.vTextField, ]} */ ;
    // @ts-ignore
    const __VLS_121 = __VLS_asFunctionalComponent(__VLS_120, new __VLS_120({
        label: "",
        variant: "solo-filled",
        modelValue: (__VLS_ctx.form.new_password),
        ...{ class: "mb-0" },
        rules: (__VLS_ctx.changePassword ? [__VLS_ctx.rules.min] : []),
        type: "password",
        disabled: (!__VLS_ctx.changePassword),
    }));
    const __VLS_122 = __VLS_121({
        label: "",
        variant: "solo-filled",
        modelValue: (__VLS_ctx.form.new_password),
        ...{ class: "mb-0" },
        rules: (__VLS_ctx.changePassword ? [__VLS_ctx.rules.min] : []),
        type: "password",
        disabled: (!__VLS_ctx.changePassword),
    }, ...__VLS_functionalComponentArgsRest(__VLS_121));
    var __VLS_119;
    const __VLS_124 = {}.VCol;
    /** @type {[typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ]} */ ;
    // @ts-ignore
    const __VLS_125 = __VLS_asFunctionalComponent(__VLS_124, new __VLS_124({
        cols: "2",
        sm: "1",
        ...{ class: "d-flex justify-center align-start pt-5" },
    }));
    const __VLS_126 = __VLS_125({
        cols: "2",
        sm: "1",
        ...{ class: "d-flex justify-center align-start pt-5" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_125));
    __VLS_127.slots.default;
    const __VLS_128 = {}.VIcon;
    /** @type {[typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, ]} */ ;
    // @ts-ignore
    const __VLS_129 = __VLS_asFunctionalComponent(__VLS_128, new __VLS_128({
        ...{ 'onClick': {} },
        ...{ class: "olho" },
        tag: "i",
    }));
    const __VLS_130 = __VLS_129({
        ...{ 'onClick': {} },
        ...{ class: "olho" },
        tag: "i",
    }, ...__VLS_functionalComponentArgsRest(__VLS_129));
    let __VLS_132;
    let __VLS_133;
    let __VLS_134;
    const __VLS_135 = {
        onClick: (...[$event]) => {
            if (!(__VLS_ctx.isExpanded))
                return;
            __VLS_ctx.changePassword = !__VLS_ctx.changePassword;
        }
    };
    __VLS_131.slots.default;
    var __VLS_131;
    var __VLS_127;
    var __VLS_111;
    if (__VLS_ctx.changePassword) {
        const __VLS_136 = {}.VRow;
        /** @type {[typeof __VLS_components.VRow, typeof __VLS_components.vRow, typeof __VLS_components.VRow, typeof __VLS_components.vRow, ]} */ ;
        // @ts-ignore
        const __VLS_137 = __VLS_asFunctionalComponent(__VLS_136, new __VLS_136({
            noGutters: true,
        }));
        const __VLS_138 = __VLS_137({
            noGutters: true,
        }, ...__VLS_functionalComponentArgsRest(__VLS_137));
        __VLS_139.slots.default;
        const __VLS_140 = {}.VCol;
        /** @type {[typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ]} */ ;
        // @ts-ignore
        const __VLS_141 = __VLS_asFunctionalComponent(__VLS_140, new __VLS_140({
            cols: "12",
        }));
        const __VLS_142 = __VLS_141({
            cols: "12",
        }, ...__VLS_functionalComponentArgsRest(__VLS_141));
        __VLS_143.slots.default;
        __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
            ...{ class: "text-h6 font-weight-medium pl-3 pb-3 pt-0" },
        });
        var __VLS_143;
        const __VLS_144 = {}.VCol;
        /** @type {[typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ]} */ ;
        // @ts-ignore
        const __VLS_145 = __VLS_asFunctionalComponent(__VLS_144, new __VLS_144({
            cols: "10",
            sm: "11",
        }));
        const __VLS_146 = __VLS_145({
            cols: "10",
            sm: "11",
        }, ...__VLS_functionalComponentArgsRest(__VLS_145));
        __VLS_147.slots.default;
        const __VLS_148 = {}.VTextField;
        /** @type {[typeof __VLS_components.VTextField, typeof __VLS_components.vTextField, typeof __VLS_components.VTextField, typeof __VLS_components.vTextField, ]} */ ;
        // @ts-ignore
        const __VLS_149 = __VLS_asFunctionalComponent(__VLS_148, new __VLS_148({
            label: "",
            variant: "solo-filled",
            type: (__VLS_ctx.showPass ? 'text' : 'password'),
            modelValue: (__VLS_ctx.form.confirm_password),
            ...{ class: "mb-0" },
            rules: ([__VLS_ctx.rules.matchPasswords]),
        }));
        const __VLS_150 = __VLS_149({
            label: "",
            variant: "solo-filled",
            type: (__VLS_ctx.showPass ? 'text' : 'password'),
            modelValue: (__VLS_ctx.form.confirm_password),
            ...{ class: "mb-0" },
            rules: ([__VLS_ctx.rules.matchPasswords]),
        }, ...__VLS_functionalComponentArgsRest(__VLS_149));
        var __VLS_147;
        const __VLS_152 = {}.VCol;
        /** @type {[typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ]} */ ;
        // @ts-ignore
        const __VLS_153 = __VLS_asFunctionalComponent(__VLS_152, new __VLS_152({
            cols: "2",
            sm: "1",
            ...{ class: "d-flex justify-center align-start pt-5" },
        }));
        const __VLS_154 = __VLS_153({
            cols: "2",
            sm: "1",
            ...{ class: "d-flex justify-center align-start pt-5" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_153));
        __VLS_155.slots.default;
        if (__VLS_ctx.showPass) {
            const __VLS_156 = {}.VIcon;
            /** @type {[typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, ]} */ ;
            // @ts-ignore
            const __VLS_157 = __VLS_asFunctionalComponent(__VLS_156, new __VLS_156({
                ...{ 'onClick': {} },
                ...{ class: "olho" },
                tag: "i",
            }));
            const __VLS_158 = __VLS_157({
                ...{ 'onClick': {} },
                ...{ class: "olho" },
                tag: "i",
            }, ...__VLS_functionalComponentArgsRest(__VLS_157));
            let __VLS_160;
            let __VLS_161;
            let __VLS_162;
            const __VLS_163 = {
                onClick: (...[$event]) => {
                    if (!(__VLS_ctx.isExpanded))
                        return;
                    if (!(__VLS_ctx.changePassword))
                        return;
                    if (!(__VLS_ctx.showPass))
                        return;
                    __VLS_ctx.showPass = !__VLS_ctx.showPass;
                }
            };
            __VLS_159.slots.default;
            var __VLS_159;
        }
        else {
            const __VLS_164 = {}.VIcon;
            /** @type {[typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, ]} */ ;
            // @ts-ignore
            const __VLS_165 = __VLS_asFunctionalComponent(__VLS_164, new __VLS_164({
                ...{ 'onClick': {} },
                ...{ class: "olho" },
                tag: "i",
            }));
            const __VLS_166 = __VLS_165({
                ...{ 'onClick': {} },
                ...{ class: "olho" },
                tag: "i",
            }, ...__VLS_functionalComponentArgsRest(__VLS_165));
            let __VLS_168;
            let __VLS_169;
            let __VLS_170;
            const __VLS_171 = {
                onClick: (...[$event]) => {
                    if (!(__VLS_ctx.isExpanded))
                        return;
                    if (!(__VLS_ctx.changePassword))
                        return;
                    if (!!(__VLS_ctx.showPass))
                        return;
                    __VLS_ctx.showPass = !__VLS_ctx.showPass;
                }
            };
            __VLS_167.slots.default;
            var __VLS_167;
        }
        var __VLS_155;
        var __VLS_139;
    }
    var __VLS_41;
    const __VLS_172 = {}.VCardActions;
    /** @type {[typeof __VLS_components.VCardActions, typeof __VLS_components.vCardActions, typeof __VLS_components.VCardActions, typeof __VLS_components.vCardActions, ]} */ ;
    // @ts-ignore
    const __VLS_173 = __VLS_asFunctionalComponent(__VLS_172, new __VLS_172({}));
    const __VLS_174 = __VLS_173({}, ...__VLS_functionalComponentArgsRest(__VLS_173));
    __VLS_175.slots.default;
    const __VLS_176 = {}.VBtn;
    /** @type {[typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ]} */ ;
    // @ts-ignore
    const __VLS_177 = __VLS_asFunctionalComponent(__VLS_176, new __VLS_176({
        ...{ 'onClick': {} },
        color: "green",
    }));
    const __VLS_178 = __VLS_177({
        ...{ 'onClick': {} },
        color: "green",
    }, ...__VLS_functionalComponentArgsRest(__VLS_177));
    let __VLS_180;
    let __VLS_181;
    let __VLS_182;
    const __VLS_183 = {
        onClick: (__VLS_ctx.saveForm)
    };
    __VLS_179.slots.default;
    var __VLS_179;
    const __VLS_184 = {}.VBtn;
    /** @type {[typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ]} */ ;
    // @ts-ignore
    const __VLS_185 = __VLS_asFunctionalComponent(__VLS_184, new __VLS_184({
        ...{ 'onClick': {} },
        color: "red",
        text: true,
    }));
    const __VLS_186 = __VLS_185({
        ...{ 'onClick': {} },
        color: "red",
        text: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_185));
    let __VLS_188;
    let __VLS_189;
    let __VLS_190;
    const __VLS_191 = {
        onClick: (__VLS_ctx.cancelForm)
    };
    __VLS_187.slots.default;
    var __VLS_187;
    var __VLS_175;
    var __VLS_32;
}
var __VLS_28;
var __VLS_12;
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
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['text-h6']} */ ;
/** @type {__VLS_StyleScopedClasses['font-weight-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['pl-3']} */ ;
/** @type {__VLS_StyleScopedClasses['pb-3']} */ ;
/** @type {__VLS_StyleScopedClasses['pt-5']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-0']} */ ;
/** @type {__VLS_StyleScopedClasses['text-h6']} */ ;
/** @type {__VLS_StyleScopedClasses['font-weight-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['pl-3']} */ ;
/** @type {__VLS_StyleScopedClasses['pb-3']} */ ;
/** @type {__VLS_StyleScopedClasses['pt-0']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-0']} */ ;
/** @type {__VLS_StyleScopedClasses['text-h6']} */ ;
/** @type {__VLS_StyleScopedClasses['font-weight-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['pl-3']} */ ;
/** @type {__VLS_StyleScopedClasses['pb-3']} */ ;
/** @type {__VLS_StyleScopedClasses['pt-0']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-0']} */ ;
/** @type {__VLS_StyleScopedClasses['d-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['align-center']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['text-h6']} */ ;
/** @type {__VLS_StyleScopedClasses['font-weight-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['pl-3']} */ ;
/** @type {__VLS_StyleScopedClasses['pb-3']} */ ;
/** @type {__VLS_StyleScopedClasses['pt-0']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-0']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-0']} */ ;
/** @type {__VLS_StyleScopedClasses['text-h6']} */ ;
/** @type {__VLS_StyleScopedClasses['font-weight-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['pl-3']} */ ;
/** @type {__VLS_StyleScopedClasses['pb-3']} */ ;
/** @type {__VLS_StyleScopedClasses['pt-0']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-0']} */ ;
/** @type {__VLS_StyleScopedClasses['text-h6']} */ ;
/** @type {__VLS_StyleScopedClasses['font-weight-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['pl-3']} */ ;
/** @type {__VLS_StyleScopedClasses['pb-3']} */ ;
/** @type {__VLS_StyleScopedClasses['pt-0']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-0']} */ ;
/** @type {__VLS_StyleScopedClasses['text-h6']} */ ;
/** @type {__VLS_StyleScopedClasses['font-weight-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['pl-3']} */ ;
/** @type {__VLS_StyleScopedClasses['pb-3']} */ ;
/** @type {__VLS_StyleScopedClasses['pt-0']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-0']} */ ;
/** @type {__VLS_StyleScopedClasses['d-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['align-start']} */ ;
/** @type {__VLS_StyleScopedClasses['pt-5']} */ ;
/** @type {__VLS_StyleScopedClasses['olho']} */ ;
/** @type {__VLS_StyleScopedClasses['text-h6']} */ ;
/** @type {__VLS_StyleScopedClasses['font-weight-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['pl-3']} */ ;
/** @type {__VLS_StyleScopedClasses['pb-3']} */ ;
/** @type {__VLS_StyleScopedClasses['pt-0']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-0']} */ ;
/** @type {__VLS_StyleScopedClasses['d-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['align-start']} */ ;
/** @type {__VLS_StyleScopedClasses['pt-5']} */ ;
/** @type {__VLS_StyleScopedClasses['olho']} */ ;
/** @type {__VLS_StyleScopedClasses['olho']} */ ;
// @ts-ignore
var __VLS_37 = __VLS_36, __VLS_43 = __VLS_42;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            BaseAlert: BaseAlert,
            userForm: userForm,
            isExpanded: isExpanded,
            toggleForm: toggleForm,
            form: form,
            rules: rules,
            alertRef: alertRef,
            alertIcon: alertIcon,
            alertText: alertText,
            alertTitle: alertTitle,
            alertType: alertType,
            showAlert: showAlert,
            showPass: showPass,
            changeEmail: changeEmail,
            changePassword: changePassword,
            countriesList: countriesList,
            saveForm: saveForm,
            cancelForm: cancelForm,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
