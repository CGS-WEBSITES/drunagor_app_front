/// <reference types="../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import { defineProps } from "vue";
// Props para configurar o componente
const __VLS_props = defineProps({
    title: {
        type: String,
        required: true,
        default: "ACHIEVEMENTS",
    },
    total: {
        type: String,
        required: true,
        default: "[TOTAL]",
    },
    achievements: {
        type: Array,
        required: true,
        default: () => [
            {
                image: "/home/dudu/Downloads/Rectangle 121.png",
                title: "Great Achievement Name",
                description: "Achievement short description here cabe duas linha aqui ó",
                date: "11/11/2024",
                icon: "mdi-trophy",
                progress: "15/43",
            },
        ],
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
    ...{ style: {} },
    ...{ class: "pa-4" },
}));
const __VLS_2 = __VLS_1({
    maxWidth: "800",
    ...{ style: {} },
    ...{ class: "pa-4" },
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
var __VLS_4 = {};
__VLS_3.slots.default;
const __VLS_5 = {}.VCard;
/** @type {[typeof __VLS_components.VCard, typeof __VLS_components.vCard, typeof __VLS_components.VCard, typeof __VLS_components.vCard, ]} */ ;
// @ts-ignore
const __VLS_6 = __VLS_asFunctionalComponent(__VLS_5, new __VLS_5({
    rounded: "lg",
    elevation: "3",
    ...{ class: "pl-1 pt-1 pr-1 pb-0" },
}));
const __VLS_7 = __VLS_6({
    rounded: "lg",
    elevation: "3",
    ...{ class: "pl-1 pt-1 pr-1 pb-0" },
}, ...__VLS_functionalComponentArgsRest(__VLS_6));
__VLS_8.slots.default;
const __VLS_9 = {}.VCardTitle;
/** @type {[typeof __VLS_components.VCardTitle, typeof __VLS_components.vCardTitle, typeof __VLS_components.VCardTitle, typeof __VLS_components.vCardTitle, ]} */ ;
// @ts-ignore
const __VLS_10 = __VLS_asFunctionalComponent(__VLS_9, new __VLS_9({
    ...{ class: "d-flex justify-space-between pb-0" },
}));
const __VLS_11 = __VLS_10({
    ...{ class: "d-flex justify-space-between pb-0" },
}, ...__VLS_functionalComponentArgsRest(__VLS_10));
__VLS_12.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "text-uppercase font-weight-black text-bold text-h5 mb-4 pb-0" },
});
(__VLS_ctx.title);
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "text-uppercase text-bold text-h5 mb-4 pb-0" },
});
(__VLS_ctx.total);
var __VLS_12;
const __VLS_13 = {}.VVirtualScroll;
/** @type {[typeof __VLS_components.VVirtualScroll, typeof __VLS_components.vVirtualScroll, typeof __VLS_components.VVirtualScroll, typeof __VLS_components.vVirtualScroll, ]} */ ;
// @ts-ignore
const __VLS_14 = __VLS_asFunctionalComponent(__VLS_13, new __VLS_13({
    ...{ class: "pt-0" },
    items: (__VLS_ctx.achievements),
    itemHeight: (130),
}));
const __VLS_15 = __VLS_14({
    ...{ class: "pt-0" },
    items: (__VLS_ctx.achievements),
    itemHeight: (130),
}, ...__VLS_functionalComponentArgsRest(__VLS_14));
__VLS_16.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_16.slots;
    const [{ item }] = __VLS_getSlotParams(__VLS_thisSlot);
    const __VLS_17 = {}.VCard;
    /** @type {[typeof __VLS_components.VCard, typeof __VLS_components.vCard, typeof __VLS_components.VCard, typeof __VLS_components.vCard, ]} */ ;
    // @ts-ignore
    const __VLS_18 = __VLS_asFunctionalComponent(__VLS_17, new __VLS_17({
        rounded: "lg",
        elevation: "3",
        ...{ class: "pa-0 mb-1 d-flex align-center" },
        ...{ style: {} },
    }));
    const __VLS_19 = __VLS_18({
        rounded: "lg",
        elevation: "3",
        ...{ class: "pa-0 mb-1 d-flex align-center" },
        ...{ style: {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_18));
    __VLS_20.slots.default;
    const __VLS_21 = {}.VRow;
    /** @type {[typeof __VLS_components.VRow, typeof __VLS_components.vRow, typeof __VLS_components.VRow, typeof __VLS_components.vRow, ]} */ ;
    // @ts-ignore
    const __VLS_22 = __VLS_asFunctionalComponent(__VLS_21, new __VLS_21({
        ...{ class: "align-center" },
    }));
    const __VLS_23 = __VLS_22({
        ...{ class: "align-center" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_22));
    __VLS_24.slots.default;
    const __VLS_25 = {}.VCol;
    /** @type {[typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ]} */ ;
    // @ts-ignore
    const __VLS_26 = __VLS_asFunctionalComponent(__VLS_25, new __VLS_25({
        cols: "4",
        lg: "2",
        ...{ class: "d-flex align-center justify-start" },
    }));
    const __VLS_27 = __VLS_26({
        cols: "4",
        lg: "2",
        ...{ class: "d-flex align-center justify-start" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_26));
    __VLS_28.slots.default;
    const __VLS_29 = {}.VImg;
    /** @type {[typeof __VLS_components.VImg, typeof __VLS_components.vImg, typeof __VLS_components.VImg, typeof __VLS_components.vImg, ]} */ ;
    // @ts-ignore
    const __VLS_30 = __VLS_asFunctionalComponent(__VLS_29, new __VLS_29({
        src: (item.image),
        alt: "Achievement Icon",
        maxHeight: "80",
        ...{ class: "rounded-lg" },
    }));
    const __VLS_31 = __VLS_30({
        src: (item.image),
        alt: "Achievement Icon",
        maxHeight: "80",
        ...{ class: "rounded-lg" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_30));
    var __VLS_28;
    const __VLS_33 = {}.VCol;
    /** @type {[typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ]} */ ;
    // @ts-ignore
    const __VLS_34 = __VLS_asFunctionalComponent(__VLS_33, new __VLS_33({
        cols: "8",
        ...{ class: "pl-0 d-flex flex-column justify-center" },
    }));
    const __VLS_35 = __VLS_34({
        cols: "8",
        ...{ class: "pl-0 d-flex flex-column justify-center" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_34));
    __VLS_36.slots.default;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
        ...{ class: "font-weight-bold white--text" },
    });
    (item.title);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
        ...{ class: "text-body-2 grey--text" },
    });
    (item.description);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
        ...{ class: "text-caption grey--text" },
    });
    (item.date);
    var __VLS_36;
    var __VLS_24;
    var __VLS_20;
}
var __VLS_16;
var __VLS_8;
var __VLS_3;
/** @type {__VLS_StyleScopedClasses['pa-4']} */ ;
/** @type {__VLS_StyleScopedClasses['pl-1']} */ ;
/** @type {__VLS_StyleScopedClasses['pt-1']} */ ;
/** @type {__VLS_StyleScopedClasses['pr-1']} */ ;
/** @type {__VLS_StyleScopedClasses['pb-0']} */ ;
/** @type {__VLS_StyleScopedClasses['d-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-space-between']} */ ;
/** @type {__VLS_StyleScopedClasses['pb-0']} */ ;
/** @type {__VLS_StyleScopedClasses['text-uppercase']} */ ;
/** @type {__VLS_StyleScopedClasses['font-weight-black']} */ ;
/** @type {__VLS_StyleScopedClasses['text-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-h5']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['pb-0']} */ ;
/** @type {__VLS_StyleScopedClasses['text-uppercase']} */ ;
/** @type {__VLS_StyleScopedClasses['text-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-h5']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['pb-0']} */ ;
/** @type {__VLS_StyleScopedClasses['pt-0']} */ ;
/** @type {__VLS_StyleScopedClasses['pa-0']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-1']} */ ;
/** @type {__VLS_StyleScopedClasses['d-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['align-center']} */ ;
/** @type {__VLS_StyleScopedClasses['align-center']} */ ;
/** @type {__VLS_StyleScopedClasses['d-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['align-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-start']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['pl-0']} */ ;
/** @type {__VLS_StyleScopedClasses['d-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-column']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['font-weight-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['white--text']} */ ;
/** @type {__VLS_StyleScopedClasses['text-body-2']} */ ;
/** @type {__VLS_StyleScopedClasses['grey--text']} */ ;
/** @type {__VLS_StyleScopedClasses['text-caption']} */ ;
/** @type {__VLS_StyleScopedClasses['grey--text']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {};
    },
    props: {
        title: {
            type: String,
            required: true,
            default: "ACHIEVEMENTS",
        },
        total: {
            type: String,
            required: true,
            default: "[TOTAL]",
        },
        achievements: {
            type: Array,
            required: true,
            default: () => [
                {
                    image: "/home/dudu/Downloads/Rectangle 121.png",
                    title: "Great Achievement Name",
                    description: "Achievement short description here cabe duas linha aqui ó",
                    date: "11/11/2024",
                    icon: "mdi-trophy",
                    progress: "15/43",
                },
            ],
        },
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
    props: {
        title: {
            type: String,
            required: true,
            default: "ACHIEVEMENTS",
        },
        total: {
            type: String,
            required: true,
            default: "[TOTAL]",
        },
        achievements: {
            type: Array,
            required: true,
            default: () => [
                {
                    image: "/home/dudu/Downloads/Rectangle 121.png",
                    title: "Great Achievement Name",
                    description: "Achievement short description here cabe duas linha aqui ó",
                    date: "11/11/2024",
                    icon: "mdi-trophy",
                    progress: "15/43",
                },
            ],
        },
    },
});
; /* PartiallyEnd: #4569/main.vue */
