/// <reference types="../../../node_modules/.vue-global-types/vue_3.5_false.d.ts" />
export default (await import('vue')).defineComponent({
    props: {
        product: {
            type: Object,
            required: true,
        },
    },
    computed: {
        isMobile() {
            return window.innerWidth < 600; // Defina o limite do breakpoint
        },
    },
});
; /* PartiallyEnd: #3632/script.vue */
function __VLS_template() {
    const __VLS_ctx = {};
    let __VLS_components;
    let __VLS_directives;
    // CSS variable injection 
    // CSS variable injection end 
    const __VLS_0 = {}.VCard;
    /** @type { [typeof __VLS_components.VCard, typeof __VLS_components.vCard, typeof __VLS_components.VCard, typeof __VLS_components.vCard, ] } */ ;
    // @ts-ignore
    const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
        ...{ class: ("pa-0 mx-auto") },
        maxWidth: ("488px"),
    }));
    const __VLS_2 = __VLS_1({
        ...{ class: ("pa-0 mx-auto") },
        maxWidth: ("488px"),
    }, ...__VLS_functionalComponentArgsRest(__VLS_1));
    var __VLS_6 = {};
    const __VLS_7 = {}.VRow;
    /** @type { [typeof __VLS_components.VRow, typeof __VLS_components.vRow, typeof __VLS_components.VRow, typeof __VLS_components.vRow, ] } */ ;
    // @ts-ignore
    const __VLS_8 = __VLS_asFunctionalComponent(__VLS_7, new __VLS_7({
        ...{ class: ("ma-0 pa-0 d-flex align-stretch flex-nowrap") },
    }));
    const __VLS_9 = __VLS_8({
        ...{ class: ("ma-0 pa-0 d-flex align-stretch flex-nowrap") },
    }, ...__VLS_functionalComponentArgsRest(__VLS_8));
    const __VLS_13 = {}.VCol;
    /** @type { [typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ] } */ ;
    // @ts-ignore
    const __VLS_14 = __VLS_asFunctionalComponent(__VLS_13, new __VLS_13({
        cols: ((__VLS_ctx.isMobile ? 3 : 6)),
        md: ((4)),
        ...{ class: ("d-flex flex-column align-center") },
        ...{ class: ((__VLS_ctx.isMobile ? 'pa-2' : 'pa-4')) },
        ...{ style: ({}) },
    }));
    const __VLS_15 = __VLS_14({
        cols: ((__VLS_ctx.isMobile ? 3 : 6)),
        md: ((4)),
        ...{ class: ("d-flex flex-column align-center") },
        ...{ class: ((__VLS_ctx.isMobile ? 'pa-2' : 'pa-4')) },
        ...{ style: ({}) },
    }, ...__VLS_functionalComponentArgsRest(__VLS_14));
    const __VLS_19 = {}.VImg;
    /** @type { [typeof __VLS_components.VImg, typeof __VLS_components.vImg, typeof __VLS_components.VImg, typeof __VLS_components.vImg, ] } */ ;
    // @ts-ignore
    const __VLS_20 = __VLS_asFunctionalComponent(__VLS_19, new __VLS_19({
        src: ((__VLS_ctx.product.image || require('@/assets/default-box.png'))),
        ...{ class: ("rounded") },
        height: ((__VLS_ctx.isMobile ? '100px' : '150px')),
        width: ("100%"),
        alt: ("Product Image"),
    }));
    const __VLS_21 = __VLS_20({
        src: ((__VLS_ctx.product.image || require('@/assets/default-box.png'))),
        ...{ class: ("rounded") },
        height: ((__VLS_ctx.isMobile ? '100px' : '150px')),
        width: ("100%"),
        alt: ("Product Image"),
    }, ...__VLS_functionalComponentArgsRest(__VLS_20));
    __VLS_18.slots.default;
    var __VLS_18;
    const __VLS_25 = {}.VCol;
    /** @type { [typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ] } */ ;
    // @ts-ignore
    const __VLS_26 = __VLS_asFunctionalComponent(__VLS_25, new __VLS_25({
        cols: ((__VLS_ctx.isMobile ? 9 : 6)),
        md: ((8)),
        ...{ class: ("text-white") },
        ...{ class: ((__VLS_ctx.isMobile ? 'pa-2' : 'pa-4')) },
        id: ("right-column"),
    }));
    const __VLS_27 = __VLS_26({
        cols: ((__VLS_ctx.isMobile ? 9 : 6)),
        md: ((8)),
        ...{ class: ("text-white") },
        ...{ class: ((__VLS_ctx.isMobile ? 'pa-2' : 'pa-4')) },
        id: ("right-column"),
    }, ...__VLS_functionalComponentArgsRest(__VLS_26));
    const __VLS_31 = {}.VCardTitle;
    /** @type { [typeof __VLS_components.VCardTitle, typeof __VLS_components.vCardTitle, typeof __VLS_components.VCardTitle, typeof __VLS_components.vCardTitle, ] } */ ;
    // @ts-ignore
    const __VLS_32 = __VLS_asFunctionalComponent(__VLS_31, new __VLS_31({
        ...{ class: ((__VLS_ctx.isMobile ? 'text-h6' : 'text-h5')) },
        ...{ class: ("font-weight-bold") },
    }));
    const __VLS_33 = __VLS_32({
        ...{ class: ((__VLS_ctx.isMobile ? 'text-h6' : 'text-h5')) },
        ...{ class: ("font-weight-bold") },
    }, ...__VLS_functionalComponentArgsRest(__VLS_32));
    (__VLS_ctx.product.name || "No Product Selected");
    __VLS_36.slots.default;
    var __VLS_36;
    const __VLS_37 = {}.VCardSubtitle;
    /** @type { [typeof __VLS_components.VCardSubtitle, typeof __VLS_components.vCardSubtitle, typeof __VLS_components.VCardSubtitle, typeof __VLS_components.vCardSubtitle, ] } */ ;
    // @ts-ignore
    const __VLS_38 = __VLS_asFunctionalComponent(__VLS_37, new __VLS_37({}));
    const __VLS_39 = __VLS_38({}, ...__VLS_functionalComponentArgsRest(__VLS_38));
    __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: ("d-flex align-center") },
        ...{ class: ((__VLS_ctx.isMobile ? 'mb-1' : 'mb-2')) },
    });
    const __VLS_43 = {}.VIcon;
    /** @type { [typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, ] } */ ;
    // @ts-ignore
    const __VLS_44 = __VLS_asFunctionalComponent(__VLS_43, new __VLS_43({
        ...{ class: ("mr-2") },
        color: ("white"),
    }));
    const __VLS_45 = __VLS_44({
        ...{ class: ("mr-2") },
        color: ("white"),
    }, ...__VLS_functionalComponentArgsRest(__VLS_44));
    __VLS_48.slots.default;
    var __VLS_48;
    __VLS_elementAsFunction(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: ("d-flex align-center") },
    });
    const __VLS_49 = {}.VIcon;
    /** @type { [typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, ] } */ ;
    // @ts-ignore
    const __VLS_50 = __VLS_asFunctionalComponent(__VLS_49, new __VLS_49({
        ...{ class: ("mr-2") },
        color: ("white"),
    }));
    const __VLS_51 = __VLS_50({
        ...{ class: ("mr-2") },
        color: ("white"),
    }, ...__VLS_functionalComponentArgsRest(__VLS_50));
    __VLS_54.slots.default;
    var __VLS_54;
    __VLS_elementAsFunction(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    __VLS_42.slots.default;
    var __VLS_42;
    __VLS_30.slots.default;
    var __VLS_30;
    __VLS_12.slots.default;
    var __VLS_12;
    __VLS_5.slots.default;
    var __VLS_5;
    ['pa-0', 'mx-auto', 'ma-0', 'pa-0', 'd-flex', 'align-stretch', 'flex-nowrap', 'd-flex', 'flex-column', 'align-center', 'rounded', 'text-white', 'font-weight-bold', 'd-flex', 'align-center', 'mr-2', 'd-flex', 'align-center', 'mr-2',];
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
