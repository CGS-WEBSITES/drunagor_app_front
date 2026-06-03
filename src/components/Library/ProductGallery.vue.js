/// <reference types="../../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import ProductCard from "@/components/Library/ProductCard.vue";
export default (await import('vue')).defineComponent({
    components: { ProductCard },
    props: { products: Array },
});
const __VLS_ctx = {};
const __VLS_componentsOption = { ProductCard };
let __VLS_components;
let __VLS_directives;
// CSS variable injection 
// CSS variable injection end 
const __VLS_0 = {}.VRow;
/** @type {[typeof __VLS_components.VRow, typeof __VLS_components.vRow, typeof __VLS_components.VRow, typeof __VLS_components.vRow, ]} */ ;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
    justify: "center",
    align: "center",
    ...{ class: "gap-2" },
}));
const __VLS_2 = __VLS_1({
    justify: "center",
    align: "center",
    ...{ class: "gap-2" },
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
var __VLS_4 = {};
__VLS_3.slots.default;
for (const [item] of __VLS_getVForSourceType((__VLS_ctx.products))) {
    const __VLS_5 = {}.VCol;
    /** @type {[typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ]} */ ;
    // @ts-ignore
    const __VLS_6 = __VLS_asFunctionalComponent(__VLS_5, new __VLS_5({
        cols: "12",
        md: "6",
        lg: "6",
        ...{ class: "d-flex justify-center" },
        key: (item.id),
    }));
    const __VLS_7 = __VLS_6({
        cols: "12",
        md: "6",
        lg: "6",
        ...{ class: "d-flex justify-center" },
        key: (item.id),
    }, ...__VLS_functionalComponentArgsRest(__VLS_6));
    __VLS_8.slots.default;
    const __VLS_9 = {}.ProductCard;
    /** @type {[typeof __VLS_components.ProductCard, ]} */ ;
    // @ts-ignore
    const __VLS_10 = __VLS_asFunctionalComponent(__VLS_9, new __VLS_9({
        ...{ 'onClick': {} },
        id: "product-card",
        product: (item),
    }));
    const __VLS_11 = __VLS_10({
        ...{ 'onClick': {} },
        id: "product-card",
        product: (item),
    }, ...__VLS_functionalComponentArgsRest(__VLS_10));
    let __VLS_13;
    let __VLS_14;
    let __VLS_15;
    const __VLS_16 = {
        onClick: (...[$event]) => {
            __VLS_ctx.$emit('open-dialog', item);
        }
    };
    var __VLS_12;
    var __VLS_8;
}
var __VLS_3;
/** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
/** @type {__VLS_StyleScopedClasses['d-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
var __VLS_dollars;
let __VLS_self;
