/// <reference types="../../node_modules/.vue-global-types/vue_3.5_false.d.ts" />
import { defineProps } from 'vue';
// Props para tornar o componente reutilizável
const __VLS_props = defineProps({
    image: {
        type: String,
        required: true,
        default: 'https://cf.geekdo-images.com/r8obvBpTbSiNr5C0B6g8MA__opengraph/img/eZOHrAK-dYl02EEXlrCI5vZWbB4=/0x0:906x476/fit-in/1200x630/filters:strip_icc()/pic7619515.png', // Placeholder para a imagem
    },
    title: {
        type: String,
        required: true,
        default: 'FAVORITE CAMPAIGN',
    },
    subtitle: {
        type: String,
        required: true,
        default: 'Chronicles of Drunagor: Age of Darkness',
    },
    subtitle2: {
        type: String,
        required: true,
        default: 'Chronicles of Drunagor: Age of Darkness',
    },
    progress: {
        type: Number,
        required: true,
        default: 100,
    },
    details: {
        type: String,
        required: true,
        default: 'Door 01 - The entrance to the citadel - Chapter 2',
    },
});
; /* PartiallyEnd: #3632/scriptSetup.vue */
function __VLS_template() {
    const __VLS_ctx = {};
    let __VLS_components;
    let __VLS_directives;
    const __VLS_0 = {}.VContainer;
    /** @type { [typeof __VLS_components.VContainer, typeof __VLS_components.vContainer, typeof __VLS_components.VContainer, typeof __VLS_components.vContainer, ] } */ ;
    // @ts-ignore
    const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
        maxWidth: ("800"),
        ...{ style: ({}) },
        ...{ class: ("pa-4") },
    }));
    const __VLS_2 = __VLS_1({
        maxWidth: ("800"),
        ...{ style: ({}) },
        ...{ class: ("pa-4") },
    }, ...__VLS_functionalComponentArgsRest(__VLS_1));
    var __VLS_6 = {};
    const __VLS_7 = {}.VCard;
    /** @type { [typeof __VLS_components.VCard, typeof __VLS_components.vCard, typeof __VLS_components.VCard, typeof __VLS_components.vCard, ] } */ ;
    // @ts-ignore
    const __VLS_8 = __VLS_asFunctionalComponent(__VLS_7, new __VLS_7({
        color: ("primary"),
        ...{ class: ("pl-2 pr-2 pb-2 pt-2") },
        rounded: ("lg"),
        elevation: ("3"),
    }));
    const __VLS_9 = __VLS_8({
        color: ("primary"),
        ...{ class: ("pl-2 pr-2 pb-2 pt-2") },
        rounded: ("lg"),
        elevation: ("3"),
    }, ...__VLS_functionalComponentArgsRest(__VLS_8));
    const __VLS_13 = {}.VImg;
    /** @type { [typeof __VLS_components.VImg, typeof __VLS_components.vImg, typeof __VLS_components.VImg, typeof __VLS_components.vImg, ] } */ ;
    // @ts-ignore
    const __VLS_14 = __VLS_asFunctionalComponent(__VLS_13, new __VLS_13({
        src: ("https://druna-assets.s3.us-east-2.amazonaws.com/Dashboard/img-campaigncore.png"),
        alt: ("Campaign Image"),
        maxWidth: ("800"),
        ...{ class: ("rounded-lg") },
        contain: (true),
    }));
    const __VLS_15 = __VLS_14({
        src: ("https://druna-assets.s3.us-east-2.amazonaws.com/Dashboard/img-campaigncore.png"),
        alt: ("Campaign Image"),
        maxWidth: ("800"),
        ...{ class: ("rounded-lg") },
        contain: (true),
    }, ...__VLS_functionalComponentArgsRest(__VLS_14));
    const __VLS_19 = {}.VCardText;
    /** @type { [typeof __VLS_components.VCardText, typeof __VLS_components.vCardText, typeof __VLS_components.VCardText, typeof __VLS_components.vCardText, ] } */ ;
    // @ts-ignore
    const __VLS_20 = __VLS_asFunctionalComponent(__VLS_19, new __VLS_19({
        ...{ class: ("pl-2 pt-0 pb-0") },
    }));
    const __VLS_21 = __VLS_20({
        ...{ class: ("pl-2 pt-0 pb-0") },
    }, ...__VLS_functionalComponentArgsRest(__VLS_20));
    __VLS_elementAsFunction(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
        ...{ class: ("ext-uppercase font-weight-black text-bold text-h5 pb-0 pt-1") },
    });
    (__VLS_ctx.title);
    __VLS_elementAsFunction(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
        ...{ class: ("font-weight-bold grey--text pt-0") },
    });
    (__VLS_ctx.subtitle);
    __VLS_24.slots.default;
    var __VLS_24;
    __VLS_12.slots.default;
    var __VLS_12;
    __VLS_5.slots.default;
    var __VLS_5;
    ['pa-4', 'pl-2', 'pr-2', 'pb-2', 'pt-2', 'rounded-lg', 'pl-2', 'pt-0', 'pb-0', 'ext-uppercase', 'font-weight-black', 'text-bold', 'text-h5', 'pb-0', 'pt-1', 'font-weight-bold', 'grey--text', 'pt-0',];
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
        return {};
    },
    props: {
        image: {
            type: String,
            required: true,
            default: 'https://cf.geekdo-images.com/r8obvBpTbSiNr5C0B6g8MA__opengraph/img/eZOHrAK-dYl02EEXlrCI5vZWbB4=/0x0:906x476/fit-in/1200x630/filters:strip_icc()/pic7619515.png', // Placeholder para a imagem
        },
        title: {
            type: String,
            required: true,
            default: 'FAVORITE CAMPAIGN',
        },
        subtitle: {
            type: String,
            required: true,
            default: 'Chronicles of Drunagor: Age of Darkness',
        },
        subtitle2: {
            type: String,
            required: true,
            default: 'Chronicles of Drunagor: Age of Darkness',
        },
        progress: {
            type: Number,
            required: true,
            default: 100,
        },
        details: {
            type: String,
            required: true,
            default: 'Door 01 - The entrance to the citadel - Chapter 2',
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
            default: 'https://cf.geekdo-images.com/r8obvBpTbSiNr5C0B6g8MA__opengraph/img/eZOHrAK-dYl02EEXlrCI5vZWbB4=/0x0:906x476/fit-in/1200x630/filters:strip_icc()/pic7619515.png', // Placeholder para a imagem
        },
        title: {
            type: String,
            required: true,
            default: 'FAVORITE CAMPAIGN',
        },
        subtitle: {
            type: String,
            required: true,
            default: 'Chronicles of Drunagor: Age of Darkness',
        },
        subtitle2: {
            type: String,
            required: true,
            default: 'Chronicles of Drunagor: Age of Darkness',
        },
        progress: {
            type: Number,
            required: true,
            default: 100,
        },
        details: {
            type: String,
            required: true,
            default: 'Door 01 - The entrance to the citadel - Chapter 2',
        },
    },
    __typeEl: {},
});
; /* PartiallyEnd: #4569/main.vue */
