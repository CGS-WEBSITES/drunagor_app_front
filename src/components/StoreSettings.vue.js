/// <reference types="../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import { ref, computed } from "vue";
import { useUserStore } from "@/store/UserStore";
import StoreForm from "@/components/StoreForm.vue"; // Importa o componente do formulário
const user = computed(() => useUserStore().user); // Obtém os dados do usuário
const storeForms = ref([]); // Lista de formulários de loja
// Adiciona um novo formulário de loja
const addStoreForm = () => {
    storeForms.value.push({
        name: "",
        location: "",
        description: "",
    });
};
// Remove um formulário de loja específico
const removeStore = (index) => {
    storeForms.value.splice(index, 1);
};
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
// CSS variable injection 
// CSS variable injection end 
const __VLS_0 = {}.VContainer;
/** @type {[typeof __VLS_components.VContainer, typeof __VLS_components.vContainer, typeof __VLS_components.VContainer, typeof __VLS_components.vContainer, ]} */ ;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({}));
const __VLS_2 = __VLS_1({}, ...__VLS_functionalComponentArgsRest(__VLS_1));
var __VLS_4 = {};
__VLS_3.slots.default;
/** @type {[typeof StoreForm, ]} */ ;
// @ts-ignore
const __VLS_5 = __VLS_asFunctionalComponent(StoreForm, new StoreForm({}));
const __VLS_6 = __VLS_5({}, ...__VLS_functionalComponentArgsRest(__VLS_5));
const __VLS_8 = {}.VRow;
/** @type {[typeof __VLS_components.VRow, typeof __VLS_components.vRow, typeof __VLS_components.VRow, typeof __VLS_components.vRow, ]} */ ;
// @ts-ignore
const __VLS_9 = __VLS_asFunctionalComponent(__VLS_8, new __VLS_8({}));
const __VLS_10 = __VLS_9({}, ...__VLS_functionalComponentArgsRest(__VLS_9));
__VLS_11.slots.default;
for (const [store, index] of __VLS_getVForSourceType((__VLS_ctx.storeForms))) {
    const __VLS_12 = {}.VCol;
    /** @type {[typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ]} */ ;
    // @ts-ignore
    const __VLS_13 = __VLS_asFunctionalComponent(__VLS_12, new __VLS_12({
        ...{ class: "pa-0 ml-" },
        cols: "12",
        key: (index),
    }));
    const __VLS_14 = __VLS_13({
        ...{ class: "pa-0 ml-" },
        cols: "12",
        key: (index),
    }, ...__VLS_functionalComponentArgsRest(__VLS_13));
    __VLS_15.slots.default;
    /** @type {[typeof StoreForm, ]} */ ;
    // @ts-ignore
    const __VLS_16 = __VLS_asFunctionalComponent(StoreForm, new StoreForm({
        ...{ 'onRemove': {} },
        modelValue: (__VLS_ctx.storeForms[index]),
    }));
    const __VLS_17 = __VLS_16({
        ...{ 'onRemove': {} },
        modelValue: (__VLS_ctx.storeForms[index]),
    }, ...__VLS_functionalComponentArgsRest(__VLS_16));
    let __VLS_19;
    let __VLS_20;
    let __VLS_21;
    const __VLS_22 = {
        onRemove: (...[$event]) => {
            __VLS_ctx.removeStore(index);
        }
    };
    var __VLS_18;
    var __VLS_15;
}
var __VLS_11;
var __VLS_3;
/** @type {__VLS_StyleScopedClasses['pa-0']} */ ;
/** @type {__VLS_StyleScopedClasses['ml-']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            StoreForm: StoreForm,
            storeForms: storeForms,
            removeStore: removeStore,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
