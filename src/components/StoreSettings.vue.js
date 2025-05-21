/// <reference types="../../node_modules/.vue-global-types/vue_3.5_false.d.ts" />
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
; /* PartiallyEnd: #3632/scriptSetup.vue */
function __VLS_template() {
    const __VLS_ctx = {};
    let __VLS_components;
    let __VLS_directives;
    // CSS variable injection 
    // CSS variable injection end 
    const __VLS_0 = {}.VContainer;
    /** @type { [typeof __VLS_components.VContainer, typeof __VLS_components.vContainer, typeof __VLS_components.VContainer, typeof __VLS_components.vContainer, ] } */ ;
    // @ts-ignore
    const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({}));
    const __VLS_2 = __VLS_1({}, ...__VLS_functionalComponentArgsRest(__VLS_1));
    var __VLS_6 = {};
    // @ts-ignore
    /** @type { [typeof StoreForm, ] } */ ;
    // @ts-ignore
    const __VLS_7 = __VLS_asFunctionalComponent(StoreForm, new StoreForm({}));
    const __VLS_8 = __VLS_7({}, ...__VLS_functionalComponentArgsRest(__VLS_7));
    const __VLS_12 = {}.VRow;
    /** @type { [typeof __VLS_components.VRow, typeof __VLS_components.vRow, typeof __VLS_components.VRow, typeof __VLS_components.vRow, ] } */ ;
    // @ts-ignore
    const __VLS_13 = __VLS_asFunctionalComponent(__VLS_12, new __VLS_12({}));
    const __VLS_14 = __VLS_13({}, ...__VLS_functionalComponentArgsRest(__VLS_13));
    for (const [store, index] of __VLS_getVForSourceType((__VLS_ctx.storeForms))) {
        const __VLS_18 = {}.VCol;
        /** @type { [typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ] } */ ;
        // @ts-ignore
        const __VLS_19 = __VLS_asFunctionalComponent(__VLS_18, new __VLS_18({
            ...{ class: ("pa-0 ml-") },
            cols: ("12"),
            key: ((index)),
        }));
        const __VLS_20 = __VLS_19({
            ...{ class: ("pa-0 ml-") },
            cols: ("12"),
            key: ((index)),
        }, ...__VLS_functionalComponentArgsRest(__VLS_19));
        // @ts-ignore
        /** @type { [typeof StoreForm, ] } */ ;
        // @ts-ignore
        const __VLS_24 = __VLS_asFunctionalComponent(StoreForm, new StoreForm({
            ...{ 'onRemove': {} },
            modelValue: ((__VLS_ctx.storeForms[index])),
        }));
        const __VLS_25 = __VLS_24({
            ...{ 'onRemove': {} },
            modelValue: ((__VLS_ctx.storeForms[index])),
        }, ...__VLS_functionalComponentArgsRest(__VLS_24));
        let __VLS_29;
        const __VLS_30 = {
            onRemove: (...[$event]) => {
                __VLS_ctx.removeStore(index);
            }
        };
        let __VLS_26;
        let __VLS_27;
        var __VLS_28;
        __VLS_23.slots.default;
        var __VLS_23;
    }
    __VLS_17.slots.default;
    var __VLS_17;
    __VLS_5.slots.default;
    var __VLS_5;
    ['pa-0', 'ml-',];
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
    __typeEl: {},
});
; /* PartiallyEnd: #4569/main.vue */
