/// <reference types="../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import { defineProps } from "vue";
// Props para tornar o componente reutilizável
const __VLS_props = defineProps({
    image: {
        type: String,
        required: true,
        default: "https://cf.geekdo-images.com/r8obvBpTbSiNr5C0B6g8MA__opengraph/img/eZOHrAK-dYl02EEXlrCI5vZWbB4=/0x0:906x476/fit-in/1200x630/filters:strip_icc()/pic7619515.png", // Placeholder para a imagem
    },
    title: {
        type: String,
        required: true,
        default: "FAVORITE CAMPAIGN",
    },
    subtitle: {
        type: String,
        required: true,
        default: "Chronicles of Drunagor: Age of Darkness",
    },
    subtitle2: {
        type: String,
        required: true,
        default: "Chronicles of Drunagor: Age of Darkness",
    },
    progress: {
        type: Number,
        required: true,
        default: 100,
    },
    details: {
        type: String,
        required: true,
        default: "Door 01 - The entrance to the citadel - Chapter 2",
    },
});
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
const __VLS_0 = {}.VContainer;
/** @type {[typeof __VLS_components.VContainer, typeof __VLS_components.vContainer, typeof __VLS_components.VContainer, typeof __VLS_components.vContainer, ]} */ ;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
    maxWidth: "800",
    ...{ class: "pa-4" },
}));
const __VLS_2 = __VLS_1({
    maxWidth: "800",
    ...{ class: "pa-4" },
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
var __VLS_4 = {};
__VLS_3.slots.default;
const __VLS_5 = {}.VCard;
/** @type {[typeof __VLS_components.VCard, typeof __VLS_components.vCard, typeof __VLS_components.VCard, typeof __VLS_components.vCard, ]} */ ;
// @ts-ignore
const __VLS_6 = __VLS_asFunctionalComponent(__VLS_5, new __VLS_5({
    color: "primary",
    ...{ class: "pl-2 pr-2 pb-2 pt-2" },
    rounded: "lg",
    elevation: "3",
}));
const __VLS_7 = __VLS_6({
    color: "primary",
    ...{ class: "pl-2 pr-2 pb-2 pt-2" },
    rounded: "lg",
    elevation: "3",
}, ...__VLS_functionalComponentArgsRest(__VLS_6));
__VLS_8.slots.default;
const __VLS_9 = {}.VImg;
/** @type {[typeof __VLS_components.VImg, typeof __VLS_components.vImg, typeof __VLS_components.VImg, typeof __VLS_components.vImg, ]} */ ;
// @ts-ignore
const __VLS_10 = __VLS_asFunctionalComponent(__VLS_9, new __VLS_9({
    src: "https://assets.drunagor.app/Dashboard/img-campaigncore.png",
    alt: "Campaign Image",
    maxWidth: "800",
    ...{ class: "rounded-lg" },
    contain: true,
}));
const __VLS_11 = __VLS_10({
    src: "https://assets.drunagor.app/Dashboard/img-campaigncore.png",
    alt: "Campaign Image",
    maxWidth: "800",
    ...{ class: "rounded-lg" },
    contain: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_10));
const __VLS_13 = {}.VCardText;
/** @type {[typeof __VLS_components.VCardText, typeof __VLS_components.vCardText, typeof __VLS_components.VCardText, typeof __VLS_components.vCardText, ]} */ ;
// @ts-ignore
const __VLS_14 = __VLS_asFunctionalComponent(__VLS_13, new __VLS_13({
    ...{ class: "pl-2 pt-0 pb-0" },
}));
const __VLS_15 = __VLS_14({
    ...{ class: "pl-2 pt-0 pb-0" },
}, ...__VLS_functionalComponentArgsRest(__VLS_14));
__VLS_16.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
    ...{ class: "ext-uppercase font-weight-black text-bold text-h5 pb-0 pt-1" },
});
(__VLS_ctx.title);
__VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
    ...{ class: "font-weight-bold grey--text pt-0" },
});
(__VLS_ctx.subtitle);
var __VLS_16;
var __VLS_8;
var __VLS_3;
/** @type {__VLS_StyleScopedClasses['pa-4']} */ ;
/** @type {__VLS_StyleScopedClasses['pl-2']} */ ;
/** @type {__VLS_StyleScopedClasses['pr-2']} */ ;
/** @type {__VLS_StyleScopedClasses['pb-2']} */ ;
/** @type {__VLS_StyleScopedClasses['pt-2']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['pl-2']} */ ;
/** @type {__VLS_StyleScopedClasses['pt-0']} */ ;
/** @type {__VLS_StyleScopedClasses['pb-0']} */ ;
/** @type {__VLS_StyleScopedClasses['ext-uppercase']} */ ;
/** @type {__VLS_StyleScopedClasses['font-weight-black']} */ ;
/** @type {__VLS_StyleScopedClasses['text-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-h5']} */ ;
/** @type {__VLS_StyleScopedClasses['pb-0']} */ ;
/** @type {__VLS_StyleScopedClasses['pt-1']} */ ;
/** @type {__VLS_StyleScopedClasses['font-weight-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['grey--text']} */ ;
/** @type {__VLS_StyleScopedClasses['pt-0']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {};
    },
    props: {
        image: {
            type: String,
            required: true,
            default: "https://cf.geekdo-images.com/r8obvBpTbSiNr5C0B6g8MA__opengraph/img/eZOHrAK-dYl02EEXlrCI5vZWbB4=/0x0:906x476/fit-in/1200x630/filters:strip_icc()/pic7619515.png", // Placeholder para a imagem
        },
        title: {
            type: String,
            required: true,
            default: "FAVORITE CAMPAIGN",
        },
        subtitle: {
            type: String,
            required: true,
            default: "Chronicles of Drunagor: Age of Darkness",
        },
        subtitle2: {
            type: String,
            required: true,
            default: "Chronicles of Drunagor: Age of Darkness",
        },
        progress: {
            type: Number,
            required: true,
            default: 100,
        },
        details: {
            type: String,
            required: true,
            default: "Door 01 - The entrance to the citadel - Chapter 2",
        },
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
    props: {
        image: {
            type: String,
            required: true,
            default: "https://cf.geekdo-images.com/r8obvBpTbSiNr5C0B6g8MA__opengraph/img/eZOHrAK-dYl02EEXlrCI5vZWbB4=/0x0:906x476/fit-in/1200x630/filters:strip_icc()/pic7619515.png", // Placeholder para a imagem
        },
        title: {
            type: String,
            required: true,
            default: "FAVORITE CAMPAIGN",
        },
        subtitle: {
            type: String,
            required: true,
            default: "Chronicles of Drunagor: Age of Darkness",
        },
        subtitle2: {
            type: String,
            required: true,
            default: "Chronicles of Drunagor: Age of Darkness",
        },
        progress: {
            type: Number,
            required: true,
            default: 100,
        },
        details: {
            type: String,
            required: true,
            default: "Door 01 - The entrance to the citadel - Chapter 2",
        },
    },
});
; /* PartiallyEnd: #4569/main.vue */
