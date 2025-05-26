/// <reference types="../../node_modules/.vue-global-types/vue_3.5_false.d.ts" />
import { ref, inject, onMounted } from "vue";
import { useUserStore } from "@/store/UserStore";
import { getToken } from "@/service/AccessToken";
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
// Função para exibir alertas
const setAllert = (icon, title, text, type) => {
    alertIcon.value = icon;
    alertTitle.value = title;
    alertText.value = text;
    showAlert.value = true;
    alertType.value = type;
};
const valReg = async () => {
    const { valid, errors } = await userForm.value?.validate();
    validForm.value = valid;
};
// Funções de salvar e cancelar
const saveForm = async () => {
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
            countries_fk: countriesList.value.find(country => country.name === form.country)?.countries_pk,
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
            setAllert("mdi-alert-circle", error.response?.status || 500, error.response?.data?.message || "Erro de rede.", "error");
        });
    }
};
const fetchCountries = () => {
    axios.get("countries/search")
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
onMounted(() => {
    fetchCountries();
});
const cancelForm = () => {
    console.log("Form Cancelled");
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
        onClick: (__VLS_ctx.toggleForm)
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
        }));
        const __VLS_47 = __VLS_46({
            closable: (true),
            modelValue: ((__VLS_ctx.showAlert)),
            icon: ((__VLS_ctx.alertIcon)),
            title: ((__VLS_ctx.alertTitle)),
            text: ((__VLS_ctx.alertText)),
            type: ((__VLS_ctx.alertType)),
        }, ...__VLS_functionalComponentArgsRest(__VLS_46));
        const __VLS_51 = {}.VForm;
        /** @type { [typeof __VLS_components.VForm, typeof __VLS_components.vForm, typeof __VLS_components.VForm, typeof __VLS_components.vForm, ] } */ ;
        // @ts-ignore
        const __VLS_52 = __VLS_asFunctionalComponent(__VLS_51, new __VLS_51({
            ref: ("userForm"),
        }));
        const __VLS_53 = __VLS_52({
            ref: ("userForm"),
        }, ...__VLS_functionalComponentArgsRest(__VLS_52));
        // @ts-ignore navigation for `const userForm = ref()`
        /** @type { typeof __VLS_ctx.userForm } */ ;
        var __VLS_57 = {};
        __VLS_elementAsFunction(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
            ...{ class: ("text-h6 font-weight-medium pl-3 pb-3 pt-0") },
        });
        const __VLS_58 = {}.VTextField;
        /** @type { [typeof __VLS_components.VTextField, typeof __VLS_components.vTextField, typeof __VLS_components.VTextField, typeof __VLS_components.vTextField, ] } */ ;
        // @ts-ignore
        const __VLS_59 = __VLS_asFunctionalComponent(__VLS_58, new __VLS_58({
            label: (""),
            variant: ("solo-filled"),
            modelValue: ((__VLS_ctx.form.name)),
            ...{ class: ("mb-0") },
        }));
        const __VLS_60 = __VLS_59({
            label: (""),
            variant: ("solo-filled"),
            modelValue: ((__VLS_ctx.form.name)),
            ...{ class: ("mb-0") },
        }, ...__VLS_functionalComponentArgsRest(__VLS_59));
        __VLS_elementAsFunction(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
            ...{ class: ("text-h6 font-weight-medium pl-3 pb-3 pt-0") },
        });
        const __VLS_64 = {}.VTextField;
        /** @type { [typeof __VLS_components.VTextField, typeof __VLS_components.vTextField, typeof __VLS_components.VTextField, typeof __VLS_components.vTextField, ] } */ ;
        // @ts-ignore
        const __VLS_65 = __VLS_asFunctionalComponent(__VLS_64, new __VLS_64({
            label: (""),
            variant: ("solo-filled"),
            modelValue: ((__VLS_ctx.form.user_name)),
            ...{ class: ("mb-0") },
        }));
        const __VLS_66 = __VLS_65({
            label: (""),
            variant: ("solo-filled"),
            modelValue: ((__VLS_ctx.form.user_name)),
            ...{ class: ("mb-0") },
        }, ...__VLS_functionalComponentArgsRest(__VLS_65));
        __VLS_elementAsFunction(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
            ...{ class: ("text-h6 font-weight-medium pl-3 pb-3 pt-0") },
        });
        const __VLS_70 = {}.VRow;
        /** @type { [typeof __VLS_components.VRow, typeof __VLS_components.vRow, typeof __VLS_components.VRow, typeof __VLS_components.vRow, ] } */ ;
        // @ts-ignore
        const __VLS_71 = __VLS_asFunctionalComponent(__VLS_70, new __VLS_70({
            noGutters: (true),
        }));
        const __VLS_72 = __VLS_71({
            noGutters: (true),
        }, ...__VLS_functionalComponentArgsRest(__VLS_71));
        const __VLS_76 = {}.VCol;
        /** @type { [typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ] } */ ;
        // @ts-ignore
        const __VLS_77 = __VLS_asFunctionalComponent(__VLS_76, new __VLS_76({
            cols: ("10"),
            sm: ("11"),
        }));
        const __VLS_78 = __VLS_77({
            cols: ("10"),
            sm: ("11"),
        }, ...__VLS_functionalComponentArgsRest(__VLS_77));
        const __VLS_82 = {}.VTextField;
        /** @type { [typeof __VLS_components.VTextField, typeof __VLS_components.vTextField, typeof __VLS_components.VTextField, typeof __VLS_components.vTextField, ] } */ ;
        // @ts-ignore
        const __VLS_83 = __VLS_asFunctionalComponent(__VLS_82, new __VLS_82({
            disabled: ((!__VLS_ctx.changeEmail)),
            label: (""),
            variant: ("solo-filled"),
            modelValue: ((__VLS_ctx.form.new_email)),
            rules: (([__VLS_ctx.rules.email])),
            ...{ class: ("mb-0") },
        }));
        const __VLS_84 = __VLS_83({
            disabled: ((!__VLS_ctx.changeEmail)),
            label: (""),
            variant: ("solo-filled"),
            modelValue: ((__VLS_ctx.form.new_email)),
            rules: (([__VLS_ctx.rules.email])),
            ...{ class: ("mb-0") },
        }, ...__VLS_functionalComponentArgsRest(__VLS_83));
        __VLS_81.slots.default;
        var __VLS_81;
        const __VLS_88 = {}.VCol;
        /** @type { [typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ] } */ ;
        // @ts-ignore
        const __VLS_89 = __VLS_asFunctionalComponent(__VLS_88, new __VLS_88({
            cols: ("2"),
            sm: ("1"),
            ...{ class: ("d-flex justify-center align-center") },
        }));
        const __VLS_90 = __VLS_89({
            cols: ("2"),
            sm: ("1"),
            ...{ class: ("d-flex justify-center align-center") },
        }, ...__VLS_functionalComponentArgsRest(__VLS_89));
        const __VLS_94 = {}.VIcon;
        /** @type { [typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, ] } */ ;
        // @ts-ignore
        const __VLS_95 = __VLS_asFunctionalComponent(__VLS_94, new __VLS_94({
            ...{ 'onClick': {} },
            ...{ class: ("mb-4") },
        }));
        const __VLS_96 = __VLS_95({
            ...{ 'onClick': {} },
            ...{ class: ("mb-4") },
        }, ...__VLS_functionalComponentArgsRest(__VLS_95));
        let __VLS_100;
        const __VLS_101 = {
            onClick: (...[$event]) => {
                if (!((__VLS_ctx.isExpanded)))
                    return;
                __VLS_ctx.changeEmail = !__VLS_ctx.changeEmail;
            }
        };
        let __VLS_97;
        let __VLS_98;
        __VLS_99.slots.default;
        var __VLS_99;
        __VLS_93.slots.default;
        var __VLS_93;
        __VLS_75.slots.default;
        var __VLS_75;
        if (__VLS_ctx.changeEmail) {
            const __VLS_102 = {}.VRow;
            /** @type { [typeof __VLS_components.VRow, typeof __VLS_components.vRow, typeof __VLS_components.VRow, typeof __VLS_components.vRow, ] } */ ;
            // @ts-ignore
            const __VLS_103 = __VLS_asFunctionalComponent(__VLS_102, new __VLS_102({
                noGutters: (true),
            }));
            const __VLS_104 = __VLS_103({
                noGutters: (true),
            }, ...__VLS_functionalComponentArgsRest(__VLS_103));
            const __VLS_108 = {}.VCol;
            /** @type { [typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ] } */ ;
            // @ts-ignore
            const __VLS_109 = __VLS_asFunctionalComponent(__VLS_108, new __VLS_108({}));
            const __VLS_110 = __VLS_109({}, ...__VLS_functionalComponentArgsRest(__VLS_109));
            __VLS_elementAsFunction(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
                ...{ class: ("text-h6 font-weight-medium pl-3 pb-3 pt-0") },
            });
            const __VLS_114 = {}.VTextField;
            /** @type { [typeof __VLS_components.VTextField, typeof __VLS_components.vTextField, typeof __VLS_components.VTextField, typeof __VLS_components.vTextField, ] } */ ;
            // @ts-ignore
            const __VLS_115 = __VLS_asFunctionalComponent(__VLS_114, new __VLS_114({
                label: (""),
                variant: ("solo-filled"),
                modelValue: ((__VLS_ctx.form.confirm_email)),
                rules: (([__VLS_ctx.rules.matchEmails])),
                ...{ class: ("mb-0") },
            }));
            const __VLS_116 = __VLS_115({
                label: (""),
                variant: ("solo-filled"),
                modelValue: ((__VLS_ctx.form.confirm_email)),
                rules: (([__VLS_ctx.rules.matchEmails])),
                ...{ class: ("mb-0") },
            }, ...__VLS_functionalComponentArgsRest(__VLS_115));
            __VLS_113.slots.default;
            var __VLS_113;
            __VLS_107.slots.default;
            var __VLS_107;
        }
        const __VLS_120 = {}.VSwitch;
        /** @type { [typeof __VLS_components.VSwitch, typeof __VLS_components.vSwitch, typeof __VLS_components.VSwitch, typeof __VLS_components.vSwitch, ] } */ ;
        // @ts-ignore
        const __VLS_121 = __VLS_asFunctionalComponent(__VLS_120, new __VLS_120({
            modelValue: ((__VLS_ctx.form.email_updates)),
            label: ("Send email updates for friend requests, events next to you and app updates."),
            inset: (true),
            ...{ class: ("mb-0") },
            color: ("green"),
        }));
        const __VLS_122 = __VLS_121({
            modelValue: ((__VLS_ctx.form.email_updates)),
            label: ("Send email updates for friend requests, events next to you and app updates."),
            inset: (true),
            ...{ class: ("mb-0") },
            color: ("green"),
        }, ...__VLS_functionalComponentArgsRest(__VLS_121));
        const __VLS_126 = {}.VRow;
        /** @type { [typeof __VLS_components.VRow, typeof __VLS_components.vRow, typeof __VLS_components.VRow, typeof __VLS_components.vRow, ] } */ ;
        // @ts-ignore
        const __VLS_127 = __VLS_asFunctionalComponent(__VLS_126, new __VLS_126({
            noGutters: (true),
        }));
        const __VLS_128 = __VLS_127({
            noGutters: (true),
        }, ...__VLS_functionalComponentArgsRest(__VLS_127));
        const __VLS_132 = {}.VCol;
        /** @type { [typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ] } */ ;
        // @ts-ignore
        const __VLS_133 = __VLS_asFunctionalComponent(__VLS_132, new __VLS_132({
            cols: ("12"),
        }));
        const __VLS_134 = __VLS_133({
            cols: ("12"),
        }, ...__VLS_functionalComponentArgsRest(__VLS_133));
        __VLS_elementAsFunction(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
            ...{ class: ("text-h6 font-weight-medium pl-3 pb-3 pt-0") },
        });
        const __VLS_138 = {}.VAutocomplete;
        /** @type { [typeof __VLS_components.VAutocomplete, typeof __VLS_components.vAutocomplete, typeof __VLS_components.VAutocomplete, typeof __VLS_components.vAutocomplete, ] } */ ;
        // @ts-ignore
        const __VLS_139 = __VLS_asFunctionalComponent(__VLS_138, new __VLS_138({
            modelValue: ((__VLS_ctx.form.country)),
            items: ((__VLS_ctx.countriesList)),
            itemTitle: ("name"),
            itemValue: ("name"),
            variant: ("solo-filled"),
            label: ("Select or type a country"),
            ...{ class: ("mb-0") },
        }));
        const __VLS_140 = __VLS_139({
            modelValue: ((__VLS_ctx.form.country)),
            items: ((__VLS_ctx.countriesList)),
            itemTitle: ("name"),
            itemValue: ("name"),
            variant: ("solo-filled"),
            label: ("Select or type a country"),
            ...{ class: ("mb-0") },
        }, ...__VLS_functionalComponentArgsRest(__VLS_139));
        __VLS_137.slots.default;
        var __VLS_137;
        __VLS_131.slots.default;
        var __VLS_131;
        if (__VLS_ctx.form.country === 'US') {
            __VLS_elementAsFunction(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
                ...{ class: ("text-h6 font-weight-medium pl-3 pb-3 pt-0") },
            });
        }
        if (__VLS_ctx.form.country === 'US') {
            const __VLS_144 = {}.VTextField;
            /** @type { [typeof __VLS_components.VTextField, typeof __VLS_components.vTextField, typeof __VLS_components.VTextField, typeof __VLS_components.vTextField, ] } */ ;
            // @ts-ignore
            const __VLS_145 = __VLS_asFunctionalComponent(__VLS_144, new __VLS_144({
                label: (""),
                variant: ("solo-filled"),
                modelValue: ((__VLS_ctx.form.zip_code)),
                ...{ class: ("mb-0") },
            }));
            const __VLS_146 = __VLS_145({
                label: (""),
                variant: ("solo-filled"),
                modelValue: ((__VLS_ctx.form.zip_code)),
                ...{ class: ("mb-0") },
            }, ...__VLS_functionalComponentArgsRest(__VLS_145));
        }
        const __VLS_150 = {}.VRow;
        /** @type { [typeof __VLS_components.VRow, typeof __VLS_components.vRow, typeof __VLS_components.VRow, typeof __VLS_components.vRow, ] } */ ;
        // @ts-ignore
        const __VLS_151 = __VLS_asFunctionalComponent(__VLS_150, new __VLS_150({
            noGutters: (true),
        }));
        const __VLS_152 = __VLS_151({
            noGutters: (true),
        }, ...__VLS_functionalComponentArgsRest(__VLS_151));
        const __VLS_156 = {}.VCol;
        /** @type { [typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ] } */ ;
        // @ts-ignore
        const __VLS_157 = __VLS_asFunctionalComponent(__VLS_156, new __VLS_156({
            cols: ("12"),
        }));
        const __VLS_158 = __VLS_157({
            cols: ("12"),
        }, ...__VLS_functionalComponentArgsRest(__VLS_157));
        __VLS_elementAsFunction(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
            ...{ class: ("text-h6 font-weight-medium pl-3 pb-3 pt-0") },
        });
        __VLS_161.slots.default;
        var __VLS_161;
        const __VLS_162 = {}.VCol;
        /** @type { [typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ] } */ ;
        // @ts-ignore
        const __VLS_163 = __VLS_asFunctionalComponent(__VLS_162, new __VLS_162({
            cols: ("10"),
            sm: ("11"),
        }));
        const __VLS_164 = __VLS_163({
            cols: ("10"),
            sm: ("11"),
        }, ...__VLS_functionalComponentArgsRest(__VLS_163));
        const __VLS_168 = {}.VTextField;
        /** @type { [typeof __VLS_components.VTextField, typeof __VLS_components.vTextField, typeof __VLS_components.VTextField, typeof __VLS_components.vTextField, ] } */ ;
        // @ts-ignore
        const __VLS_169 = __VLS_asFunctionalComponent(__VLS_168, new __VLS_168({
            label: (""),
            variant: ("solo-filled"),
            modelValue: ((__VLS_ctx.form.new_password)),
            ...{ class: ("mb-0") },
            rules: ((__VLS_ctx.changePassword ? [__VLS_ctx.rules.min] : [])),
            type: ("password"),
            disabled: ((!__VLS_ctx.changePassword)),
        }));
        const __VLS_170 = __VLS_169({
            label: (""),
            variant: ("solo-filled"),
            modelValue: ((__VLS_ctx.form.new_password)),
            ...{ class: ("mb-0") },
            rules: ((__VLS_ctx.changePassword ? [__VLS_ctx.rules.min] : [])),
            type: ("password"),
            disabled: ((!__VLS_ctx.changePassword)),
        }, ...__VLS_functionalComponentArgsRest(__VLS_169));
        __VLS_167.slots.default;
        var __VLS_167;
        const __VLS_174 = {}.VCol;
        /** @type { [typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ] } */ ;
        // @ts-ignore
        const __VLS_175 = __VLS_asFunctionalComponent(__VLS_174, new __VLS_174({
            cols: ("2"),
            sm: ("1"),
            ...{ class: ("d-flex justify-center align-start pt-5") },
        }));
        const __VLS_176 = __VLS_175({
            cols: ("2"),
            sm: ("1"),
            ...{ class: ("d-flex justify-center align-start pt-5") },
        }, ...__VLS_functionalComponentArgsRest(__VLS_175));
        const __VLS_180 = {}.VIcon;
        /** @type { [typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, ] } */ ;
        // @ts-ignore
        const __VLS_181 = __VLS_asFunctionalComponent(__VLS_180, new __VLS_180({
            ...{ 'onClick': {} },
            ...{ class: ("olho") },
            tag: ("i"),
        }));
        const __VLS_182 = __VLS_181({
            ...{ 'onClick': {} },
            ...{ class: ("olho") },
            tag: ("i"),
        }, ...__VLS_functionalComponentArgsRest(__VLS_181));
        let __VLS_186;
        const __VLS_187 = {
            onClick: (...[$event]) => {
                if (!((__VLS_ctx.isExpanded)))
                    return;
                __VLS_ctx.changePassword = !__VLS_ctx.changePassword;
            }
        };
        let __VLS_183;
        let __VLS_184;
        __VLS_185.slots.default;
        var __VLS_185;
        __VLS_179.slots.default;
        var __VLS_179;
        __VLS_155.slots.default;
        var __VLS_155;
        if (__VLS_ctx.changePassword) {
            const __VLS_188 = {}.VRow;
            /** @type { [typeof __VLS_components.VRow, typeof __VLS_components.vRow, typeof __VLS_components.VRow, typeof __VLS_components.vRow, ] } */ ;
            // @ts-ignore
            const __VLS_189 = __VLS_asFunctionalComponent(__VLS_188, new __VLS_188({
                noGutters: (true),
            }));
            const __VLS_190 = __VLS_189({
                noGutters: (true),
            }, ...__VLS_functionalComponentArgsRest(__VLS_189));
            const __VLS_194 = {}.VCol;
            /** @type { [typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ] } */ ;
            // @ts-ignore
            const __VLS_195 = __VLS_asFunctionalComponent(__VLS_194, new __VLS_194({
                cols: ("12"),
            }));
            const __VLS_196 = __VLS_195({
                cols: ("12"),
            }, ...__VLS_functionalComponentArgsRest(__VLS_195));
            __VLS_elementAsFunction(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
                ...{ class: ("text-h6 font-weight-medium pl-3 pb-3 pt-0") },
            });
            __VLS_199.slots.default;
            var __VLS_199;
            const __VLS_200 = {}.VCol;
            /** @type { [typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ] } */ ;
            // @ts-ignore
            const __VLS_201 = __VLS_asFunctionalComponent(__VLS_200, new __VLS_200({
                cols: ("10"),
                sm: ("11"),
            }));
            const __VLS_202 = __VLS_201({
                cols: ("10"),
                sm: ("11"),
            }, ...__VLS_functionalComponentArgsRest(__VLS_201));
            const __VLS_206 = {}.VTextField;
            /** @type { [typeof __VLS_components.VTextField, typeof __VLS_components.vTextField, typeof __VLS_components.VTextField, typeof __VLS_components.vTextField, ] } */ ;
            // @ts-ignore
            const __VLS_207 = __VLS_asFunctionalComponent(__VLS_206, new __VLS_206({
                label: (""),
                variant: ("solo-filled"),
                type: ((__VLS_ctx.showPass ? 'text' : 'password')),
                modelValue: ((__VLS_ctx.form.confirm_password)),
                ...{ class: ("mb-0") },
                rules: (([__VLS_ctx.rules.matchPasswords])),
            }));
            const __VLS_208 = __VLS_207({
                label: (""),
                variant: ("solo-filled"),
                type: ((__VLS_ctx.showPass ? 'text' : 'password')),
                modelValue: ((__VLS_ctx.form.confirm_password)),
                ...{ class: ("mb-0") },
                rules: (([__VLS_ctx.rules.matchPasswords])),
            }, ...__VLS_functionalComponentArgsRest(__VLS_207));
            __VLS_205.slots.default;
            var __VLS_205;
            const __VLS_212 = {}.VCol;
            /** @type { [typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ] } */ ;
            // @ts-ignore
            const __VLS_213 = __VLS_asFunctionalComponent(__VLS_212, new __VLS_212({
                cols: ("2"),
                sm: ("1"),
                ...{ class: ("d-flex justify-center align-start pt-5") },
            }));
            const __VLS_214 = __VLS_213({
                cols: ("2"),
                sm: ("1"),
                ...{ class: ("d-flex justify-center align-start pt-5") },
            }, ...__VLS_functionalComponentArgsRest(__VLS_213));
            if (__VLS_ctx.showPass) {
                const __VLS_218 = {}.VIcon;
                /** @type { [typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, ] } */ ;
                // @ts-ignore
                const __VLS_219 = __VLS_asFunctionalComponent(__VLS_218, new __VLS_218({
                    ...{ 'onClick': {} },
                    ...{ class: ("olho") },
                    tag: ("i"),
                }));
                const __VLS_220 = __VLS_219({
                    ...{ 'onClick': {} },
                    ...{ class: ("olho") },
                    tag: ("i"),
                }, ...__VLS_functionalComponentArgsRest(__VLS_219));
                let __VLS_224;
                const __VLS_225 = {
                    onClick: (...[$event]) => {
                        if (!((__VLS_ctx.isExpanded)))
                            return;
                        if (!((__VLS_ctx.changePassword)))
                            return;
                        if (!((__VLS_ctx.showPass)))
                            return;
                        __VLS_ctx.showPass = !__VLS_ctx.showPass;
                    }
                };
                let __VLS_221;
                let __VLS_222;
                __VLS_223.slots.default;
                var __VLS_223;
            }
            else {
                const __VLS_226 = {}.VIcon;
                /** @type { [typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, ] } */ ;
                // @ts-ignore
                const __VLS_227 = __VLS_asFunctionalComponent(__VLS_226, new __VLS_226({
                    ...{ 'onClick': {} },
                    ...{ class: ("olho") },
                    tag: ("i"),
                }));
                const __VLS_228 = __VLS_227({
                    ...{ 'onClick': {} },
                    ...{ class: ("olho") },
                    tag: ("i"),
                }, ...__VLS_functionalComponentArgsRest(__VLS_227));
                let __VLS_232;
                const __VLS_233 = {
                    onClick: (...[$event]) => {
                        if (!((__VLS_ctx.isExpanded)))
                            return;
                        if (!((__VLS_ctx.changePassword)))
                            return;
                        if (!(!((__VLS_ctx.showPass))))
                            return;
                        __VLS_ctx.showPass = !__VLS_ctx.showPass;
                    }
                };
                let __VLS_229;
                let __VLS_230;
                __VLS_231.slots.default;
                var __VLS_231;
            }
            __VLS_217.slots.default;
            var __VLS_217;
            __VLS_193.slots.default;
            var __VLS_193;
        }
        __VLS_56.slots.default;
        var __VLS_56;
        const __VLS_234 = {}.VCardActions;
        /** @type { [typeof __VLS_components.VCardActions, typeof __VLS_components.vCardActions, typeof __VLS_components.VCardActions, typeof __VLS_components.vCardActions, ] } */ ;
        // @ts-ignore
        const __VLS_235 = __VLS_asFunctionalComponent(__VLS_234, new __VLS_234({}));
        const __VLS_236 = __VLS_235({}, ...__VLS_functionalComponentArgsRest(__VLS_235));
        const __VLS_240 = {}.VBtn;
        /** @type { [typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ] } */ ;
        // @ts-ignore
        const __VLS_241 = __VLS_asFunctionalComponent(__VLS_240, new __VLS_240({
            ...{ 'onClick': {} },
            color: ("green"),
        }));
        const __VLS_242 = __VLS_241({
            ...{ 'onClick': {} },
            color: ("green"),
        }, ...__VLS_functionalComponentArgsRest(__VLS_241));
        let __VLS_246;
        const __VLS_247 = {
            onClick: (__VLS_ctx.saveForm)
        };
        let __VLS_243;
        let __VLS_244;
        __VLS_245.slots.default;
        var __VLS_245;
        const __VLS_248 = {}.VBtn;
        /** @type { [typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ] } */ ;
        // @ts-ignore
        const __VLS_249 = __VLS_asFunctionalComponent(__VLS_248, new __VLS_248({
            ...{ 'onClick': {} },
            color: ("red"),
            text: (true),
        }));
        const __VLS_250 = __VLS_249({
            ...{ 'onClick': {} },
            color: ("red"),
            text: (true),
        }, ...__VLS_functionalComponentArgsRest(__VLS_249));
        let __VLS_254;
        const __VLS_255 = {
            onClick: (__VLS_ctx.cancelForm)
        };
        let __VLS_251;
        let __VLS_252;
        __VLS_253.slots.default;
        var __VLS_253;
        __VLS_239.slots.default;
        var __VLS_239;
        __VLS_44.slots.default;
        var __VLS_44;
    }
    __VLS_38.slots.default;
    var __VLS_38;
    __VLS_18.slots.default;
    var __VLS_18;
    __VLS_12.slots.default;
    var __VLS_12;
    __VLS_5.slots.default;
    var __VLS_5;
    ['d-flex', 'justify-center', 'pa-0', 'py-4', 'd-flex', 'justify-space-between', 'align-center', 'text-h5', 'font-weight-black', 'pl-2', 'pt-2', 'pb-2', 'text-uppercase', 'text-h6', 'font-weight-medium', 'pl-3', 'pb-3', 'pt-0', 'mb-0', 'text-h6', 'font-weight-medium', 'pl-3', 'pb-3', 'pt-0', 'mb-0', 'text-h6', 'font-weight-medium', 'pl-3', 'pb-3', 'pt-0', 'mb-0', 'd-flex', 'justify-center', 'align-center', 'mb-4', 'text-h6', 'font-weight-medium', 'pl-3', 'pb-3', 'pt-0', 'mb-0', 'mb-0', 'text-h6', 'font-weight-medium', 'pl-3', 'pb-3', 'pt-0', 'mb-0', 'text-h6', 'font-weight-medium', 'pl-3', 'pb-3', 'pt-0', 'mb-0', 'text-h6', 'font-weight-medium', 'pl-3', 'pb-3', 'pt-0', 'mb-0', 'd-flex', 'justify-center', 'align-start', 'pt-5', 'olho', 'text-h6', 'font-weight-medium', 'pl-3', 'pb-3', 'pt-0', 'mb-0', 'd-flex', 'justify-center', 'align-start', 'pt-5', 'olho', 'olho',];
    var __VLS_slots;
    var $slots;
    let __VLS_inheritedAttrs;
    var $attrs;
    const __VLS_refs = {
        'userForm': __VLS_57,
    };
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
            userForm: userForm,
            isExpanded: isExpanded,
            toggleForm: toggleForm,
            form: form,
            rules: rules,
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
    __typeRefs: {},
    __typeEl: {},
});
; /* PartiallyEnd: #4569/main.vue */
