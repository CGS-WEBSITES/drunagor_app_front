/// <reference types="../../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
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
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
// CSS variable injection 
// CSS variable injection end 
const __VLS_0 = {}.VCard;
/** @type {[typeof __VLS_components.VCard, typeof __VLS_components.vCard, typeof __VLS_components.VCard, typeof __VLS_components.vCard, ]} */ ;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
    ...{ class: "pa-0 mx-auto" },
    maxWidth: "488px",
}));
const __VLS_2 = __VLS_1({
    ...{ class: "pa-0 mx-auto" },
    maxWidth: "488px",
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
var __VLS_4 = {};
__VLS_3.slots.default;
const __VLS_5 = {}.VRow;
/** @type {[typeof __VLS_components.VRow, typeof __VLS_components.vRow, typeof __VLS_components.VRow, typeof __VLS_components.vRow, ]} */ ;
// @ts-ignore
const __VLS_6 = __VLS_asFunctionalComponent(__VLS_5, new __VLS_5({
    ...{ class: "ma-0 pa-0 d-flex align-stretch flex-nowrap" },
}));
const __VLS_7 = __VLS_6({
    ...{ class: "ma-0 pa-0 d-flex align-stretch flex-nowrap" },
}, ...__VLS_functionalComponentArgsRest(__VLS_6));
__VLS_8.slots.default;
const __VLS_9 = {}.VCol;
/** @type {[typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ]} */ ;
// @ts-ignore
const __VLS_10 = __VLS_asFunctionalComponent(__VLS_9, new __VLS_9({
    cols: (__VLS_ctx.isMobile ? 3 : 6),
    md: (4),
    ...{ class: "d-flex flex-column align-center" },
    ...{ class: (__VLS_ctx.isMobile ? 'pa-2' : 'pa-4') },
    ...{ style: {} },
}));
const __VLS_11 = __VLS_10({
    cols: (__VLS_ctx.isMobile ? 3 : 6),
    md: (4),
    ...{ class: "d-flex flex-column align-center" },
    ...{ class: (__VLS_ctx.isMobile ? 'pa-2' : 'pa-4') },
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_10));
__VLS_12.slots.default;
const __VLS_13 = {}.VImg;
/** @type {[typeof __VLS_components.VImg, typeof __VLS_components.vImg, typeof __VLS_components.VImg, typeof __VLS_components.vImg, ]} */ ;
// @ts-ignore
const __VLS_14 = __VLS_asFunctionalComponent(__VLS_13, new __VLS_13({
    src: (__VLS_ctx.product.image || require('@/assets/default-box.png')),
    ...{ class: "rounded" },
    height: (__VLS_ctx.isMobile ? '100px' : '150px'),
    width: "100%",
    alt: "Product Image",
}));
const __VLS_15 = __VLS_14({
    src: (__VLS_ctx.product.image || require('@/assets/default-box.png')),
    ...{ class: "rounded" },
    height: (__VLS_ctx.isMobile ? '100px' : '150px'),
    width: "100%",
    alt: "Product Image",
}, ...__VLS_functionalComponentArgsRest(__VLS_14));
var __VLS_12;
const __VLS_17 = {}.VCol;
/** @type {[typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ]} */ ;
// @ts-ignore
const __VLS_18 = __VLS_asFunctionalComponent(__VLS_17, new __VLS_17({
    cols: (__VLS_ctx.isMobile ? 9 : 6),
    md: (8),
    ...{ class: "text-white" },
    ...{ class: (__VLS_ctx.isMobile ? 'pa-2' : 'pa-4') },
    id: "right-column",
}));
const __VLS_19 = __VLS_18({
    cols: (__VLS_ctx.isMobile ? 9 : 6),
    md: (8),
    ...{ class: "text-white" },
    ...{ class: (__VLS_ctx.isMobile ? 'pa-2' : 'pa-4') },
    id: "right-column",
}, ...__VLS_functionalComponentArgsRest(__VLS_18));
__VLS_20.slots.default;
const __VLS_21 = {}.VCardTitle;
/** @type {[typeof __VLS_components.VCardTitle, typeof __VLS_components.vCardTitle, typeof __VLS_components.VCardTitle, typeof __VLS_components.vCardTitle, ]} */ ;
// @ts-ignore
const __VLS_22 = __VLS_asFunctionalComponent(__VLS_21, new __VLS_21({
    ...{ class: (__VLS_ctx.isMobile ? 'text-h6' : 'text-h5') },
    ...{ class: "font-weight-bold" },
}));
const __VLS_23 = __VLS_22({
    ...{ class: (__VLS_ctx.isMobile ? 'text-h6' : 'text-h5') },
    ...{ class: "font-weight-bold" },
}, ...__VLS_functionalComponentArgsRest(__VLS_22));
__VLS_24.slots.default;
(__VLS_ctx.product.name || "No Product Selected");
var __VLS_24;
const __VLS_25 = {}.VCardSubtitle;
/** @type {[typeof __VLS_components.VCardSubtitle, typeof __VLS_components.vCardSubtitle, typeof __VLS_components.VCardSubtitle, typeof __VLS_components.vCardSubtitle, ]} */ ;
// @ts-ignore
const __VLS_26 = __VLS_asFunctionalComponent(__VLS_25, new __VLS_25({}));
const __VLS_27 = __VLS_26({}, ...__VLS_functionalComponentArgsRest(__VLS_26));
__VLS_28.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "d-flex align-center" },
    ...{ class: (__VLS_ctx.isMobile ? 'mb-1' : 'mb-2') },
});
const __VLS_29 = {}.VIcon;
/** @type {[typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, ]} */ ;
// @ts-ignore
const __VLS_30 = __VLS_asFunctionalComponent(__VLS_29, new __VLS_29({
    ...{ class: "mr-2" },
    color: "white",
}));
const __VLS_31 = __VLS_30({
    ...{ class: "mr-2" },
    color: "white",
}, ...__VLS_functionalComponentArgsRest(__VLS_30));
__VLS_32.slots.default;
var __VLS_32;
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "d-flex align-center" },
});
const __VLS_33 = {}.VIcon;
/** @type {[typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, ]} */ ;
// @ts-ignore
const __VLS_34 = __VLS_asFunctionalComponent(__VLS_33, new __VLS_33({
    ...{ class: "mr-2" },
    color: "white",
}));
const __VLS_35 = __VLS_34({
    ...{ class: "mr-2" },
    color: "white",
}, ...__VLS_functionalComponentArgsRest(__VLS_34));
__VLS_36.slots.default;
var __VLS_36;
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
var __VLS_28;
var __VLS_20;
var __VLS_8;
var __VLS_3;
/** @type {__VLS_StyleScopedClasses['pa-0']} */ ;
/** @type {__VLS_StyleScopedClasses['mx-auto']} */ ;
/** @type {__VLS_StyleScopedClasses['ma-0']} */ ;
/** @type {__VLS_StyleScopedClasses['pa-0']} */ ;
/** @type {__VLS_StyleScopedClasses['d-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['align-stretch']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-nowrap']} */ ;
/** @type {__VLS_StyleScopedClasses['d-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-column']} */ ;
/** @type {__VLS_StyleScopedClasses['align-center']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded']} */ ;
/** @type {__VLS_StyleScopedClasses['text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['font-weight-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['d-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['align-center']} */ ;
/** @type {__VLS_StyleScopedClasses['mr-2']} */ ;
/** @type {__VLS_StyleScopedClasses['d-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['align-center']} */ ;
/** @type {__VLS_StyleScopedClasses['mr-2']} */ ;
var __VLS_dollars;
let __VLS_self;
