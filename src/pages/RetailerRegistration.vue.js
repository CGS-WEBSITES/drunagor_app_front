/// <reference types="../../node_modules/.vue-global-types/vue_3.5_false.d.ts" />
import { ref, inject } from "vue";
import { useRouter } from "vue-router";
import TermsCard from "@/components/TermsCard.vue";
import PrivacyCard from "@/components/PrivacyCard.vue";
import { useUserStore } from "@/store/UserStore";
const userStore = useUserStore();
// Variáveis reativas
const regForm = ref();
const router = useRouter();
const successDialog = ref(false);
const activeTab = ref(1); // Controla as abas (Login/Sign Up)
const login = ref(""); // Login do usuário
const password = ref(""); // Senha do usuário
const signupUsername = ref(""); // Nome de usuário para cadastro
const signupEmail = ref(""); // Email para cadastro
const signupPassword = ref(""); // Senha para cadastro
const signupConfirmPassword = ref(""); // Confirmação de senha
const storeAddress = ref("");
const agreeTerms = ref(false);
const regValid = ref(false);
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
function convertDecimalToDMS(coordinate, isLatitude) {
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
function convertCoordinatesToDMS(coords) {
    const latDMS = convertDecimalToDMS(coords.lat, true);
    const lonDMS = convertDecimalToDMS(coords.lon, false);
    return `${latDMS} ${lonDMS}`;
}
const getCoordinates = async (address) => {
    try {
        const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`);
        const data = await response.json();
        if (data && data.length > 0) {
            return {
                lat: parseFloat(data[0].lat),
                lon: parseFloat(data[0].lon)
            };
        }
        else {
            console.error("Endereço não encontrado.");
            return null;
        }
    }
    catch (error) {
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
const navigateToLogin = () => {
    router.push({ name: "Login" });
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
            .then((response) => {
            console.log(response);
            setAllert("mdi-check", response.status, response.data.message, "success");
            activeTab.value = 0;
            successDialog.value = true;
        })
            .catch((response) => {
            console.log(response);
            setAllert("mdi-alert-circle", response.status, response.response.data.message, "error");
        });
    }
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
    const __VLS_25 = {}.VTabs;
    /** @type { [typeof __VLS_components.VTabs, typeof __VLS_components.vTabs, typeof __VLS_components.VTabs, typeof __VLS_components.vTabs, ] } */ ;
    // @ts-ignore
    const __VLS_26 = __VLS_asFunctionalComponent(__VLS_25, new __VLS_25({
        modelValue: ((__VLS_ctx.activeTab)),
        fixedTabs: (true),
        backgroundColor: ("white"),
    }));
    const __VLS_27 = __VLS_26({
        modelValue: ((__VLS_ctx.activeTab)),
        fixedTabs: (true),
        backgroundColor: ("white"),
    }, ...__VLS_functionalComponentArgsRest(__VLS_26));
    const __VLS_31 = {}.VTab;
    /** @type { [typeof __VLS_components.VTab, typeof __VLS_components.vTab, typeof __VLS_components.VTab, typeof __VLS_components.vTab, ] } */ ;
    // @ts-ignore
    const __VLS_32 = __VLS_asFunctionalComponent(__VLS_31, new __VLS_31({
        key: ((1)),
    }));
    const __VLS_33 = __VLS_32({
        key: ((1)),
    }, ...__VLS_functionalComponentArgsRest(__VLS_32));
    __VLS_36.slots.default;
    var __VLS_36;
    __VLS_30.slots.default;
    var __VLS_30;
    const __VLS_37 = {}.VTabsItems;
    /** @type { [typeof __VLS_components.VTabsItems, typeof __VLS_components.vTabsItems, typeof __VLS_components.VTabsItems, typeof __VLS_components.vTabsItems, ] } */ ;
    // @ts-ignore
    const __VLS_38 = __VLS_asFunctionalComponent(__VLS_37, new __VLS_37({
        modelValue: ((__VLS_ctx.activeTab)),
    }));
    const __VLS_39 = __VLS_38({
        modelValue: ((__VLS_ctx.activeTab)),
    }, ...__VLS_functionalComponentArgsRest(__VLS_38));
    const __VLS_43 = {}.VTabItem;
    /** @type { [typeof __VLS_components.VTabItem, typeof __VLS_components.vTabItem, typeof __VLS_components.VTabItem, typeof __VLS_components.vTabItem, ] } */ ;
    // @ts-ignore
    const __VLS_44 = __VLS_asFunctionalComponent(__VLS_43, new __VLS_43({
        value: ((0)),
    }));
    const __VLS_45 = __VLS_44({
        value: ((0)),
    }, ...__VLS_functionalComponentArgsRest(__VLS_44));
    if (__VLS_ctx.activeTab === 0) {
        const __VLS_49 = {}.VCardText;
        /** @type { [typeof __VLS_components.VCardText, typeof __VLS_components.vCardText, typeof __VLS_components.VCardText, typeof __VLS_components.vCardText, ] } */ ;
        // @ts-ignore
        const __VLS_50 = __VLS_asFunctionalComponent(__VLS_49, new __VLS_49({}));
        const __VLS_51 = __VLS_50({}, ...__VLS_functionalComponentArgsRest(__VLS_50));
        const __VLS_55 = {}.VBtn;
        /** @type { [typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ] } */ ;
        // @ts-ignore
        const __VLS_56 = __VLS_asFunctionalComponent(__VLS_55, new __VLS_55({
            ...{ 'onClick': {} },
            color: ("primary"),
        }));
        const __VLS_57 = __VLS_56({
            ...{ 'onClick': {} },
            color: ("primary"),
        }, ...__VLS_functionalComponentArgsRest(__VLS_56));
        let __VLS_61;
        const __VLS_62 = {
            onClick: (...[$event]) => {
                if (!((__VLS_ctx.activeTab === 0)))
                    return;
                __VLS_ctx.navigateTo('/login');
            }
        };
        let __VLS_58;
        let __VLS_59;
        const __VLS_63 = {}.VIcon;
        /** @type { [typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, ] } */ ;
        // @ts-ignore
        const __VLS_64 = __VLS_asFunctionalComponent(__VLS_63, new __VLS_63({}));
        const __VLS_65 = __VLS_64({}, ...__VLS_functionalComponentArgsRest(__VLS_64));
        __VLS_68.slots.default;
        var __VLS_68;
        __VLS_60.slots.default;
        var __VLS_60;
        const __VLS_69 = {}.VContainer;
        /** @type { [typeof __VLS_components.VContainer, typeof __VLS_components.vContainer, typeof __VLS_components.VContainer, typeof __VLS_components.vContainer, ] } */ ;
        // @ts-ignore
        const __VLS_70 = __VLS_asFunctionalComponent(__VLS_69, new __VLS_69({
            ...{ class: ("d-flex justify-center align-center") },
        }));
        const __VLS_71 = __VLS_70({
            ...{ class: ("d-flex justify-center align-center") },
        }, ...__VLS_functionalComponentArgsRest(__VLS_70));
        const __VLS_75 = {}.VRow;
        /** @type { [typeof __VLS_components.VRow, typeof __VLS_components.vRow, typeof __VLS_components.VRow, typeof __VLS_components.vRow, ] } */ ;
        // @ts-ignore
        const __VLS_76 = __VLS_asFunctionalComponent(__VLS_75, new __VLS_75({
            justify: ("center"),
        }));
        const __VLS_77 = __VLS_76({
            justify: ("center"),
        }, ...__VLS_functionalComponentArgsRest(__VLS_76));
        const __VLS_81 = {}.VCol;
        /** @type { [typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ] } */ ;
        // @ts-ignore
        const __VLS_82 = __VLS_asFunctionalComponent(__VLS_81, new __VLS_81({
            cols: ("12"),
            md: ("6"),
            ...{ class: ("text-center") },
        }));
        const __VLS_83 = __VLS_82({
            cols: ("12"),
            md: ("6"),
            ...{ class: ("text-center") },
        }, ...__VLS_functionalComponentArgsRest(__VLS_82));
        const __VLS_87 = {}.VImg;
        /** @type { [typeof __VLS_components.VImg, typeof __VLS_components.vImg, ] } */ ;
        // @ts-ignore
        const __VLS_88 = __VLS_asFunctionalComponent(__VLS_87, new __VLS_87({
            src: ("@/assets/darkness.png"),
            maxWidth: ("50"),
            alt: ("Centered Icon"),
            ...{ class: ("mx-auto") },
        }));
        const __VLS_89 = __VLS_88({
            src: ("@/assets/darkness.png"),
            maxWidth: ("50"),
            alt: ("Centered Icon"),
            ...{ class: ("mx-auto") },
        }, ...__VLS_functionalComponentArgsRest(__VLS_88));
        __VLS_86.slots.default;
        var __VLS_86;
        const __VLS_93 = {}.VCol;
        /** @type { [typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ] } */ ;
        // @ts-ignore
        const __VLS_94 = __VLS_asFunctionalComponent(__VLS_93, new __VLS_93({
            cols: ("12"),
        }));
        const __VLS_95 = __VLS_94({
            cols: ("12"),
        }, ...__VLS_functionalComponentArgsRest(__VLS_94));
        __VLS_elementAsFunction(__VLS_intrinsicElements.h1, __VLS_intrinsicElements.h1)({
            ...{ class: ("display-2 font-weight-bold pl-3") },
        });
        __VLS_98.slots.default;
        var __VLS_98;
        __VLS_80.slots.default;
        var __VLS_80;
        __VLS_74.slots.default;
        var __VLS_74;
        const __VLS_99 = {}.VAlert;
        /** @type { [typeof __VLS_components.VAlert, typeof __VLS_components.vAlert, typeof __VLS_components.VAlert, typeof __VLS_components.vAlert, ] } */ ;
        // @ts-ignore
        const __VLS_100 = __VLS_asFunctionalComponent(__VLS_99, new __VLS_99({
            closable: (true),
            modelValue: ((__VLS_ctx.showAlert)),
            icon: ((__VLS_ctx.alertIcon)),
            title: ((__VLS_ctx.alertTitle)),
            text: ((__VLS_ctx.alertText)),
            type: ((__VLS_ctx.alertType)),
        }));
        const __VLS_101 = __VLS_100({
            closable: (true),
            modelValue: ((__VLS_ctx.showAlert)),
            icon: ((__VLS_ctx.alertIcon)),
            title: ((__VLS_ctx.alertTitle)),
            text: ((__VLS_ctx.alertText)),
            type: ((__VLS_ctx.alertType)),
        }, ...__VLS_functionalComponentArgsRest(__VLS_100));
        const __VLS_105 = {}.VForm;
        /** @type { [typeof __VLS_components.VForm, typeof __VLS_components.vForm, typeof __VLS_components.VForm, typeof __VLS_components.vForm, ] } */ ;
        // @ts-ignore
        const __VLS_106 = __VLS_asFunctionalComponent(__VLS_105, new __VLS_105({
            ref: ("regForm"),
        }));
        const __VLS_107 = __VLS_106({
            ref: ("regForm"),
        }, ...__VLS_functionalComponentArgsRest(__VLS_106));
        // @ts-ignore navigation for `const regForm = ref()`
        /** @type { typeof __VLS_ctx.regForm } */ ;
        var __VLS_111 = {};
        const __VLS_112 = {}.VRow;
        /** @type { [typeof __VLS_components.VRow, typeof __VLS_components.vRow, typeof __VLS_components.VRow, typeof __VLS_components.vRow, ] } */ ;
        // @ts-ignore
        const __VLS_113 = __VLS_asFunctionalComponent(__VLS_112, new __VLS_112({}));
        const __VLS_114 = __VLS_113({}, ...__VLS_functionalComponentArgsRest(__VLS_113));
        const __VLS_118 = {}.VCol;
        /** @type { [typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ] } */ ;
        // @ts-ignore
        const __VLS_119 = __VLS_asFunctionalComponent(__VLS_118, new __VLS_118({
            cols: ("12"),
            sm: ("6"),
        }));
        const __VLS_120 = __VLS_119({
            cols: ("12"),
            sm: ("6"),
        }, ...__VLS_functionalComponentArgsRest(__VLS_119));
        const __VLS_124 = {}.VTextField;
        /** @type { [typeof __VLS_components.VTextField, typeof __VLS_components.vTextField, ] } */ ;
        // @ts-ignore
        const __VLS_125 = __VLS_asFunctionalComponent(__VLS_124, new __VLS_124({
            label: ("Login"),
            modelValue: ((__VLS_ctx.signupUsername)),
            prependIcon: ("mdi-account"),
            rules: (([__VLS_ctx.rules.required])),
            color: ("black"),
            outlined: (true),
            dense: (true),
        }));
        const __VLS_126 = __VLS_125({
            label: ("Login"),
            modelValue: ((__VLS_ctx.signupUsername)),
            prependIcon: ("mdi-account"),
            rules: (([__VLS_ctx.rules.required])),
            color: ("black"),
            outlined: (true),
            dense: (true),
        }, ...__VLS_functionalComponentArgsRest(__VLS_125));
        __VLS_123.slots.default;
        var __VLS_123;
        const __VLS_130 = {}.VCol;
        /** @type { [typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ] } */ ;
        // @ts-ignore
        const __VLS_131 = __VLS_asFunctionalComponent(__VLS_130, new __VLS_130({
            cols: ("12"),
            sm: ("6"),
        }));
        const __VLS_132 = __VLS_131({
            cols: ("12"),
            sm: ("6"),
        }, ...__VLS_functionalComponentArgsRest(__VLS_131));
        const __VLS_136 = {}.VTextField;
        /** @type { [typeof __VLS_components.VTextField, typeof __VLS_components.vTextField, ] } */ ;
        // @ts-ignore
        const __VLS_137 = __VLS_asFunctionalComponent(__VLS_136, new __VLS_136({
            label: ("Email"),
            modelValue: ((__VLS_ctx.signupEmail)),
            prependIcon: ("mdi-email"),
            type: ("email"),
            rules: (([__VLS_ctx.rules.required, __VLS_ctx.rules.email])),
            color: ("black"),
            outlined: (true),
            dense: (true),
        }));
        const __VLS_138 = __VLS_137({
            label: ("Email"),
            modelValue: ((__VLS_ctx.signupEmail)),
            prependIcon: ("mdi-email"),
            type: ("email"),
            rules: (([__VLS_ctx.rules.required, __VLS_ctx.rules.email])),
            color: ("black"),
            outlined: (true),
            dense: (true),
        }, ...__VLS_functionalComponentArgsRest(__VLS_137));
        __VLS_135.slots.default;
        var __VLS_135;
        __VLS_117.slots.default;
        var __VLS_117;
        const __VLS_142 = {}.VRow;
        /** @type { [typeof __VLS_components.VRow, typeof __VLS_components.vRow, typeof __VLS_components.VRow, typeof __VLS_components.vRow, ] } */ ;
        // @ts-ignore
        const __VLS_143 = __VLS_asFunctionalComponent(__VLS_142, new __VLS_142({}));
        const __VLS_144 = __VLS_143({}, ...__VLS_functionalComponentArgsRest(__VLS_143));
        const __VLS_148 = {}.VCol;
        /** @type { [typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ] } */ ;
        // @ts-ignore
        const __VLS_149 = __VLS_asFunctionalComponent(__VLS_148, new __VLS_148({
            cols: ("11"),
            sm: ("5"),
        }));
        const __VLS_150 = __VLS_149({
            cols: ("11"),
            sm: ("5"),
        }, ...__VLS_functionalComponentArgsRest(__VLS_149));
        const __VLS_154 = {}.VTextField;
        /** @type { [typeof __VLS_components.VTextField, typeof __VLS_components.vTextField, ] } */ ;
        // @ts-ignore
        const __VLS_155 = __VLS_asFunctionalComponent(__VLS_154, new __VLS_154({
            label: ("Password"),
            prependIcon: ("mdi-lock"),
            type: ((__VLS_ctx.showPass ? 'text' : 'password')),
            modelValue: ((__VLS_ctx.signupPassword)),
            rules: (([__VLS_ctx.rules.required, __VLS_ctx.rules.min])),
            color: ("black"),
            outlined: (true),
            dense: (true),
        }));
        const __VLS_156 = __VLS_155({
            label: ("Password"),
            prependIcon: ("mdi-lock"),
            type: ((__VLS_ctx.showPass ? 'text' : 'password')),
            modelValue: ((__VLS_ctx.signupPassword)),
            rules: (([__VLS_ctx.rules.required, __VLS_ctx.rules.min])),
            color: ("black"),
            outlined: (true),
            dense: (true),
        }, ...__VLS_functionalComponentArgsRest(__VLS_155));
        __VLS_153.slots.default;
        var __VLS_153;
        const __VLS_160 = {}.VCol;
        /** @type { [typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ] } */ ;
        // @ts-ignore
        const __VLS_161 = __VLS_asFunctionalComponent(__VLS_160, new __VLS_160({
            cols: ("1"),
            ...{ class: ("d-flex justify-center align-center") },
        }));
        const __VLS_162 = __VLS_161({
            cols: ("1"),
            ...{ class: ("d-flex justify-center align-center") },
        }, ...__VLS_functionalComponentArgsRest(__VLS_161));
        if (__VLS_ctx.showPass) {
            const __VLS_166 = {}.VIcon;
            /** @type { [typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, ] } */ ;
            // @ts-ignore
            const __VLS_167 = __VLS_asFunctionalComponent(__VLS_166, new __VLS_166({
                ...{ 'onClick': {} },
                ...{ class: ("olho") },
                tag: ("i"),
            }));
            const __VLS_168 = __VLS_167({
                ...{ 'onClick': {} },
                ...{ class: ("olho") },
                tag: ("i"),
            }, ...__VLS_functionalComponentArgsRest(__VLS_167));
            let __VLS_172;
            const __VLS_173 = {
                onClick: (...[$event]) => {
                    if (!((__VLS_ctx.activeTab === 0)))
                        return;
                    if (!((__VLS_ctx.showPass)))
                        return;
                    __VLS_ctx.showPass = !__VLS_ctx.showPass;
                }
            };
            let __VLS_169;
            let __VLS_170;
            __VLS_171.slots.default;
            var __VLS_171;
        }
        else {
            const __VLS_174 = {}.VIcon;
            /** @type { [typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, ] } */ ;
            // @ts-ignore
            const __VLS_175 = __VLS_asFunctionalComponent(__VLS_174, new __VLS_174({
                ...{ 'onClick': {} },
                ...{ class: ("olho") },
                tag: ("i"),
            }));
            const __VLS_176 = __VLS_175({
                ...{ 'onClick': {} },
                ...{ class: ("olho") },
                tag: ("i"),
            }, ...__VLS_functionalComponentArgsRest(__VLS_175));
            let __VLS_180;
            const __VLS_181 = {
                onClick: (...[$event]) => {
                    if (!((__VLS_ctx.activeTab === 0)))
                        return;
                    if (!(!((__VLS_ctx.showPass))))
                        return;
                    __VLS_ctx.showPass = !__VLS_ctx.showPass;
                }
            };
            let __VLS_177;
            let __VLS_178;
            __VLS_179.slots.default;
            var __VLS_179;
        }
        __VLS_165.slots.default;
        var __VLS_165;
        const __VLS_182 = {}.VCol;
        /** @type { [typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ] } */ ;
        // @ts-ignore
        const __VLS_183 = __VLS_asFunctionalComponent(__VLS_182, new __VLS_182({
            cols: ("12"),
            sm: ("6"),
        }));
        const __VLS_184 = __VLS_183({
            cols: ("12"),
            sm: ("6"),
        }, ...__VLS_functionalComponentArgsRest(__VLS_183));
        const __VLS_188 = {}.VTextField;
        /** @type { [typeof __VLS_components.VTextField, typeof __VLS_components.vTextField, ] } */ ;
        // @ts-ignore
        const __VLS_189 = __VLS_asFunctionalComponent(__VLS_188, new __VLS_188({
            label: ("Confirm Password"),
            modelValue: ((__VLS_ctx.signupConfirmPassword)),
            prependIcon: ("mdi-lock"),
            type: ("password"),
            rules: (([__VLS_ctx.rules.required, __VLS_ctx.rules.matchPasswords])),
            color: ("black"),
            outlined: (true),
            dense: (true),
        }));
        const __VLS_190 = __VLS_189({
            label: ("Confirm Password"),
            modelValue: ((__VLS_ctx.signupConfirmPassword)),
            prependIcon: ("mdi-lock"),
            type: ("password"),
            rules: (([__VLS_ctx.rules.required, __VLS_ctx.rules.matchPasswords])),
            color: ("black"),
            outlined: (true),
            dense: (true),
        }, ...__VLS_functionalComponentArgsRest(__VLS_189));
        __VLS_187.slots.default;
        var __VLS_187;
        const __VLS_194 = {}.VCol;
        /** @type { [typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ] } */ ;
        // @ts-ignore
        const __VLS_195 = __VLS_asFunctionalComponent(__VLS_194, new __VLS_194({
            cols: ("12"),
            ...{ class: ("d-flex align-center") },
        }));
        const __VLS_196 = __VLS_195({
            cols: ("12"),
            ...{ class: ("d-flex align-center") },
        }, ...__VLS_functionalComponentArgsRest(__VLS_195));
        const __VLS_200 = {}.VCheckbox;
        /** @type { [typeof __VLS_components.VCheckbox, typeof __VLS_components.vCheckbox, typeof __VLS_components.VCheckbox, typeof __VLS_components.vCheckbox, ] } */ ;
        // @ts-ignore
        const __VLS_201 = __VLS_asFunctionalComponent(__VLS_200, new __VLS_200({
            modelValue: ((__VLS_ctx.agreeTerms)),
            color: ("green"),
            rules: (([__VLS_ctx.rules.required])),
        }));
        const __VLS_202 = __VLS_201({
            modelValue: ((__VLS_ctx.agreeTerms)),
            color: ("green"),
            rules: (([__VLS_ctx.rules.required])),
        }, ...__VLS_functionalComponentArgsRest(__VLS_201));
        __VLS_elementAsFunction(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ class: ("ml-4") },
        });
        __VLS_elementAsFunction(__VLS_intrinsicElements.strong, __VLS_intrinsicElements.strong)({
            ...{ onClick: (...[$event]) => {
                    if (!((__VLS_ctx.activeTab === 0)))
                        return;
                    __VLS_ctx.termsDialog = true;
                } },
            ...{ style: ({}) },
        });
        __VLS_elementAsFunction(__VLS_intrinsicElements.strong, __VLS_intrinsicElements.strong)({
            ...{ onClick: (...[$event]) => {
                    if (!((__VLS_ctx.activeTab === 0)))
                        return;
                    __VLS_ctx.privacyDialog = true;
                } },
            ...{ style: ({}) },
        });
        __VLS_199.slots.default;
        var __VLS_199;
        __VLS_147.slots.default;
        var __VLS_147;
        const __VLS_206 = {}.VBtn;
        /** @type { [typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ] } */ ;
        // @ts-ignore
        const __VLS_207 = __VLS_asFunctionalComponent(__VLS_206, new __VLS_206({
            ...{ 'onClick': {} },
            ...{ class: ("mt-4") },
            color: ("black"),
            dark: (true),
            block: (true),
        }));
        const __VLS_208 = __VLS_207({
            ...{ 'onClick': {} },
            ...{ class: ("mt-4") },
            color: ("black"),
            dark: (true),
            block: (true),
        }, ...__VLS_functionalComponentArgsRest(__VLS_207));
        let __VLS_212;
        const __VLS_213 = {
            onClick: (__VLS_ctx.submitForm)
        };
        let __VLS_209;
        let __VLS_210;
        __VLS_211.slots.default;
        var __VLS_211;
        __VLS_110.slots.default;
        var __VLS_110;
        __VLS_54.slots.default;
        var __VLS_54;
    }
    __VLS_48.slots.default;
    var __VLS_48;
    __VLS_42.slots.default;
    var __VLS_42;
    __VLS_24.slots.default;
    var __VLS_24;
    __VLS_18.slots.default;
    var __VLS_18;
    __VLS_12.slots.default;
    var __VLS_12;
    const __VLS_214 = {}.VDialog;
    /** @type { [typeof __VLS_components.VDialog, typeof __VLS_components.vDialog, typeof __VLS_components.VDialog, typeof __VLS_components.vDialog, ] } */ ;
    // @ts-ignore
    const __VLS_215 = __VLS_asFunctionalComponent(__VLS_214, new __VLS_214({
        modelValue: ((__VLS_ctx.termsDialog)),
        maxWidth: ("500"),
    }));
    const __VLS_216 = __VLS_215({
        modelValue: ((__VLS_ctx.termsDialog)),
        maxWidth: ("500"),
    }, ...__VLS_functionalComponentArgsRest(__VLS_215));
    // @ts-ignore
    /** @type { [typeof TermsCard, ] } */ ;
    // @ts-ignore
    const __VLS_220 = __VLS_asFunctionalComponent(TermsCard, new TermsCard({}));
    const __VLS_221 = __VLS_220({}, ...__VLS_functionalComponentArgsRest(__VLS_220));
    __VLS_219.slots.default;
    var __VLS_219;
    const __VLS_225 = {}.VDialog;
    /** @type { [typeof __VLS_components.VDialog, typeof __VLS_components.vDialog, typeof __VLS_components.VDialog, typeof __VLS_components.vDialog, ] } */ ;
    // @ts-ignore
    const __VLS_226 = __VLS_asFunctionalComponent(__VLS_225, new __VLS_225({
        modelValue: ((__VLS_ctx.privacyDialog)),
        maxWidth: ("500"),
    }));
    const __VLS_227 = __VLS_226({
        modelValue: ((__VLS_ctx.privacyDialog)),
        maxWidth: ("500"),
    }, ...__VLS_functionalComponentArgsRest(__VLS_226));
    // @ts-ignore
    /** @type { [typeof PrivacyCard, ] } */ ;
    // @ts-ignore
    const __VLS_231 = __VLS_asFunctionalComponent(PrivacyCard, new PrivacyCard({}));
    const __VLS_232 = __VLS_231({}, ...__VLS_functionalComponentArgsRest(__VLS_231));
    __VLS_230.slots.default;
    var __VLS_230;
    __VLS_5.slots.default;
    var __VLS_5;
    ['fill-height', 'd-flex', 'align-center', 'justify-center', 'pa-4', 'elevation-12', 'd-flex', 'justify-center', 'align-center', 'text-center', 'mx-auto', 'display-2', 'font-weight-bold', 'pl-3', 'd-flex', 'justify-center', 'align-center', 'olho', 'olho', 'd-flex', 'align-center', 'ml-4', 'mt-4',];
    var __VLS_slots;
    var $slots;
    let __VLS_inheritedAttrs;
    var $attrs;
    const __VLS_refs = {
        'regForm': __VLS_111,
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
            TermsCard: TermsCard,
            PrivacyCard: PrivacyCard,
            regForm: regForm,
            activeTab: activeTab,
            signupUsername: signupUsername,
            signupEmail: signupEmail,
            signupPassword: signupPassword,
            signupConfirmPassword: signupConfirmPassword,
            agreeTerms: agreeTerms,
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
    __typeRefs: {},
    __typeEl: {},
});
; /* PartiallyEnd: #4569/main.vue */
