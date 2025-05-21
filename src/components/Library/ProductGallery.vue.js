/// <reference types="../../../node_modules/.vue-global-types/vue_3.5_false.d.ts" />
import ProductCard from "@/components/Library/ProductCard.vue";
export default (await import('vue')).defineComponent({
    components: { ProductCard },
    props: { products: Array },
});
; /* PartiallyEnd: #3632/script.vue */
function __VLS_template() {
    const __VLS_ctx = {};
    const __VLS_componentsOption = { ProductCard };
    let __VLS_components;
    let __VLS_directives;
    // CSS variable injection 
    // CSS variable injection end 
    const __VLS_0 = {}.VRow;
    /** @type { [typeof __VLS_components.VRow, typeof __VLS_components.vRow, typeof __VLS_components.VRow, typeof __VLS_components.vRow, ] } */ ;
    // @ts-ignore
    const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
        justify: ("center"),
        align: ("center"),
        ...{ class: ("gap-2") },
    }));
    const __VLS_2 = __VLS_1({
        justify: ("center"),
        align: ("center"),
        ...{ class: ("gap-2") },
    }, ...__VLS_functionalComponentArgsRest(__VLS_1));
    var __VLS_6 = {};
    for (const [item] of __VLS_getVForSourceType((__VLS_ctx.products))) {
        const __VLS_7 = {}.VCol;
        /** @type { [typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ] } */ ;
        // @ts-ignore
        const __VLS_8 = __VLS_asFunctionalComponent(__VLS_7, new __VLS_7({
            cols: ("12"),
            md: ("6"),
            lg: ("6"),
            ...{ class: ("d-flex justify-center") },
            key: ((item.id)),
        }));
        const __VLS_9 = __VLS_8({
            cols: ("12"),
            md: ("6"),
            lg: ("6"),
            ...{ class: ("d-flex justify-center") },
            key: ((item.id)),
        }, ...__VLS_functionalComponentArgsRest(__VLS_8));
        const __VLS_13 = {}.ProductCard;
        /** @type { [typeof __VLS_components.ProductCard, ] } */ ;
        // @ts-ignore
        const __VLS_14 = __VLS_asFunctionalComponent(__VLS_13, new __VLS_13({
            ...{ 'onClick': {} },
            id: ("product-card"),
            product: ((item)),
        }));
        const __VLS_15 = __VLS_14({
            ...{ 'onClick': {} },
            id: ("product-card"),
            product: ((item)),
        }, ...__VLS_functionalComponentArgsRest(__VLS_14));
        let __VLS_19;
        const __VLS_20 = {
            onClick: (...[$event]) => {
                __VLS_ctx.$emit('open-dialog', item);
            }
        };
        let __VLS_16;
        let __VLS_17;
        var __VLS_18;
        __VLS_12.slots.default;
        var __VLS_12;
    }
    __VLS_5.slots.default;
    var __VLS_5;
    ['gap-2', 'd-flex', 'justify-center',];
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
let __VLS_self;
