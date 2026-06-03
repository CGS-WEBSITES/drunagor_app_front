/// <reference types="../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import { ref, computed } from "vue";
import { useUserStore } from "@/store/UserStore";
const user = computed(() => useUserStore().user); // Obtém os dados do usuário
const storeForms = ref([]); // Lista de formulários de loja
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
// CSS variable injection 
// CSS variable injection end 
const __VLS_0 = {}.AccountForm;
/** @type {[typeof __VLS_components.AccountForm, ]} */ ;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({}));
const __VLS_2 = __VLS_1({}, ...__VLS_functionalComponentArgsRest(__VLS_1));
const __VLS_4 = {}.PrivacySettings;
/** @type {[typeof __VLS_components.PrivacySettings, typeof __VLS_components.privacySettings, ]} */ ;
// @ts-ignore
const __VLS_5 = __VLS_asFunctionalComponent(__VLS_4, new __VLS_4({}));
const __VLS_6 = __VLS_5({}, ...__VLS_functionalComponentArgsRest(__VLS_5));
const __VLS_8 = {}.AdOptions;
/** @type {[typeof __VLS_components.AdOptions, ]} */ ;
// @ts-ignore
const __VLS_9 = __VLS_asFunctionalComponent(__VLS_8, new __VLS_8({}));
const __VLS_10 = __VLS_9({}, ...__VLS_functionalComponentArgsRest(__VLS_9));
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
