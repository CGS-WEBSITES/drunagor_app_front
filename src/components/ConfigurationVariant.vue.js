/// <reference types="../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import { ConfigurationStore } from "@/store/ConfigurationStore";
import { VariantStore } from "@/store/VariantStore.js";
import { watch, ref } from "vue";
import { useToast } from "primevue/usetoast";
import { useI18n } from "vue-i18n";
const toast = useToast();
const { t } = useI18n();
const variantStore = VariantStore();
const configurationStore = ConfigurationStore();
const variantSettings = ref([]);
configurationStore.enabledVariants.forEach((enabledVariant) => {
    variantSettings.value.push(enabledVariant);
});
watch(variantSettings, async (newSettings) => {
    configurationStore.$patch({ enabledVariants: newSettings });
}, { deep: true });
const toggleVariant = (variantId) => {
    if (variantSettings.value.includes(variantId)) {
        variantSettings.value = variantSettings.value.filter((id) => id !== variantId);
    }
    else {
        variantSettings.value = [...variantSettings.value, variantId];
    }
};
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['variant-button']} */ ;
// CSS variable injection 
// CSS variable injection end 
const __VLS_0 = {}.VContainer;
/** @type {[typeof __VLS_components.VContainer, typeof __VLS_components.vContainer, typeof __VLS_components.VContainer, typeof __VLS_components.vContainer, ]} */ ;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
    maxWidth: "660",
    ...{ class: "pa-0" },
}));
const __VLS_2 = __VLS_1({
    maxWidth: "660",
    ...{ class: "pa-0" },
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
var __VLS_4 = {};
__VLS_3.slots.default;
const __VLS_5 = {}.VCard;
/** @type {[typeof __VLS_components.VCard, typeof __VLS_components.vCard, typeof __VLS_components.VCard, typeof __VLS_components.vCard, ]} */ ;
// @ts-ignore
const __VLS_6 = __VLS_asFunctionalComponent(__VLS_5, new __VLS_5({
    color: "primary",
    ...{ class: "my-4 pa-3 custom-card" },
}));
const __VLS_7 = __VLS_6({
    color: "primary",
    ...{ class: "my-4 pa-3 custom-card" },
}, ...__VLS_functionalComponentArgsRest(__VLS_6));
__VLS_8.slots.default;
const __VLS_9 = {}.VCardTitle;
/** @type {[typeof __VLS_components.VCardTitle, typeof __VLS_components.vCardTitle, typeof __VLS_components.VCardTitle, typeof __VLS_components.vCardTitle, ]} */ ;
// @ts-ignore
const __VLS_10 = __VLS_asFunctionalComponent(__VLS_9, new __VLS_9({
    ...{ class: "text-uppercase font-weight-bold text-left mb-4" },
}));
const __VLS_11 = __VLS_10({
    ...{ class: "text-uppercase font-weight-bold text-left mb-4" },
}, ...__VLS_functionalComponentArgsRest(__VLS_10));
__VLS_12.slots.default;
var __VLS_12;
const __VLS_13 = {}.VCardText;
/** @type {[typeof __VLS_components.VCardText, typeof __VLS_components.vCardText, typeof __VLS_components.VCardText, typeof __VLS_components.vCardText, ]} */ ;
// @ts-ignore
const __VLS_14 = __VLS_asFunctionalComponent(__VLS_13, new __VLS_13({}));
const __VLS_15 = __VLS_14({}, ...__VLS_functionalComponentArgsRest(__VLS_14));
__VLS_16.slots.default;
const __VLS_17 = {}.VRow;
/** @type {[typeof __VLS_components.VRow, typeof __VLS_components.vRow, typeof __VLS_components.VRow, typeof __VLS_components.vRow, ]} */ ;
// @ts-ignore
const __VLS_18 = __VLS_asFunctionalComponent(__VLS_17, new __VLS_17({
    ...{ class: "variant-container" },
}));
const __VLS_19 = __VLS_18({
    ...{ class: "variant-container" },
}, ...__VLS_functionalComponentArgsRest(__VLS_18));
__VLS_20.slots.default;
for (const [variant, index] of __VLS_getVForSourceType((__VLS_ctx.variantStore.getAll()))) {
    const __VLS_21 = {}.VCol;
    /** @type {[typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ]} */ ;
    // @ts-ignore
    const __VLS_22 = __VLS_asFunctionalComponent(__VLS_21, new __VLS_21({
        key: (variant.id),
        cols: "4",
        ...{ class: "d-flex justify-center px-1" },
    }));
    const __VLS_23 = __VLS_22({
        key: (variant.id),
        cols: "4",
        ...{ class: "d-flex justify-center px-1" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_22));
    __VLS_24.slots.default;
    const __VLS_25 = {}.VBtn;
    /** @type {[typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ]} */ ;
    // @ts-ignore
    const __VLS_26 = __VLS_asFunctionalComponent(__VLS_25, new __VLS_25({
        ...{ 'onClick': {} },
        ...{ class: "variant-button px-1" },
        ...{ class: ({ active: __VLS_ctx.variantSettings.includes(variant.id) }) },
    }));
    const __VLS_27 = __VLS_26({
        ...{ 'onClick': {} },
        ...{ class: "variant-button px-1" },
        ...{ class: ({ active: __VLS_ctx.variantSettings.includes(variant.id) }) },
    }, ...__VLS_functionalComponentArgsRest(__VLS_26));
    let __VLS_29;
    let __VLS_30;
    let __VLS_31;
    const __VLS_32 = {
        onClick: (...[$event]) => {
            __VLS_ctx.toggleVariant(variant.id);
        }
    };
    __VLS_28.slots.default;
    (__VLS_ctx.$t(variant.translation_key));
    var __VLS_28;
    var __VLS_24;
}
var __VLS_20;
var __VLS_16;
var __VLS_8;
var __VLS_3;
/** @type {__VLS_StyleScopedClasses['pa-0']} */ ;
/** @type {__VLS_StyleScopedClasses['my-4']} */ ;
/** @type {__VLS_StyleScopedClasses['pa-3']} */ ;
/** @type {__VLS_StyleScopedClasses['custom-card']} */ ;
/** @type {__VLS_StyleScopedClasses['text-uppercase']} */ ;
/** @type {__VLS_StyleScopedClasses['font-weight-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-left']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['variant-container']} */ ;
/** @type {__VLS_StyleScopedClasses['d-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['px-1']} */ ;
/** @type {__VLS_StyleScopedClasses['variant-button']} */ ;
/** @type {__VLS_StyleScopedClasses['px-1']} */ ;
/** @type {__VLS_StyleScopedClasses['active']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            variantStore: variantStore,
            variantSettings: variantSettings,
            toggleVariant: toggleVariant,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
