/// <reference types="../../node_modules/.vue-global-types/vue_3.5_false.d.ts" />
import { defineProps } from 'vue';
// Props para configurar o componente
const __VLS_props = defineProps({
    title: {
        type: String,
        required: true,
        default: 'STATISTICS',
    },
    stats: {
        type: Array,
        required: true,
        default: () => [],
    },
    userSince: {
        type: String,
        required: true,
        default: '',
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
        rounded: ("lg"),
        elevation: ("3"),
        ...{ class: ("pl-1 pt-1") },
    }));
    const __VLS_9 = __VLS_8({
        rounded: ("lg"),
        elevation: ("3"),
        ...{ class: ("pl-1 pt-1") },
    }, ...__VLS_functionalComponentArgsRest(__VLS_8));
    const __VLS_13 = {}.VCardTitle;
    /** @type { [typeof __VLS_components.VCardTitle, typeof __VLS_components.vCardTitle, typeof __VLS_components.VCardTitle, typeof __VLS_components.vCardTitle, ] } */ ;
    // @ts-ignore
    const __VLS_14 = __VLS_asFunctionalComponent(__VLS_13, new __VLS_13({
        ...{ class: ("text-uppercase font-weight-black text-bold text-h5 mb-4 pb-0") },
    }));
    const __VLS_15 = __VLS_14({
        ...{ class: ("text-uppercase font-weight-black text-bold text-h5 mb-4 pb-0") },
    }, ...__VLS_functionalComponentArgsRest(__VLS_14));
    (__VLS_ctx.title);
    __VLS_18.slots.default;
    var __VLS_18;
    const __VLS_19 = {}.VCardText;
    /** @type { [typeof __VLS_components.VCardText, typeof __VLS_components.vCardText, typeof __VLS_components.VCardText, typeof __VLS_components.vCardText, ] } */ ;
    // @ts-ignore
    const __VLS_20 = __VLS_asFunctionalComponent(__VLS_19, new __VLS_19({
        ...{ class: ("py-0") },
    }));
    const __VLS_21 = __VLS_20({
        ...{ class: ("py-0") },
    }, ...__VLS_functionalComponentArgsRest(__VLS_20));
    for (const [stat, index] of __VLS_getVForSourceType((__VLS_ctx.stats))) {
        const __VLS_25 = {}.VRow;
        /** @type { [typeof __VLS_components.VRow, typeof __VLS_components.vRow, typeof __VLS_components.VRow, typeof __VLS_components.vRow, ] } */ ;
        // @ts-ignore
        const __VLS_26 = __VLS_asFunctionalComponent(__VLS_25, new __VLS_25({
            key: ((index)),
            ...{ class: ("mb-0") },
        }));
        const __VLS_27 = __VLS_26({
            key: ((index)),
            ...{ class: ("mb-0") },
        }, ...__VLS_functionalComponentArgsRest(__VLS_26));
        const __VLS_31 = {}.VCol;
        /** @type { [typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ] } */ ;
        // @ts-ignore
        const __VLS_32 = __VLS_asFunctionalComponent(__VLS_31, new __VLS_31({
            cols: ("12"),
            ...{ class: ("pt-0 pb-0 pl-1") },
        }));
        const __VLS_33 = __VLS_32({
            cols: ("12"),
            ...{ class: ("pt-0 pb-0 pl-1") },
        }, ...__VLS_functionalComponentArgsRest(__VLS_32));
        __VLS_elementAsFunction(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
            ...{ class: ("text-h6 text-bold m-0") },
        });
        (stat.category);
        __VLS_elementAsFunction(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
            ...{ class: ("text-h7 font-italic grey--text m-0") },
        });
        (stat.name);
        __VLS_36.slots.default;
        var __VLS_36;
        __VLS_30.slots.default;
        var __VLS_30;
    }
    __VLS_24.slots.default;
    var __VLS_24;
    const __VLS_37 = {}.VCardActions;
    /** @type { [typeof __VLS_components.VCardActions, typeof __VLS_components.vCardActions, typeof __VLS_components.VCardActions, typeof __VLS_components.vCardActions, ] } */ ;
    // @ts-ignore
    const __VLS_38 = __VLS_asFunctionalComponent(__VLS_37, new __VLS_37({
        ...{ class: ("justify-end py-0") },
    }));
    const __VLS_39 = __VLS_38({
        ...{ class: ("justify-end py-0") },
    }, ...__VLS_functionalComponentArgsRest(__VLS_38));
    __VLS_elementAsFunction(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
        ...{ class: ("font-weight-bold text-h7 text-caption") },
    });
    (__VLS_ctx.userSince);
    __VLS_42.slots.default;
    var __VLS_42;
    __VLS_12.slots.default;
    var __VLS_12;
    __VLS_5.slots.default;
    var __VLS_5;
    ['pa-4', 'pl-1', 'pt-1', 'text-uppercase', 'font-weight-black', 'text-bold', 'text-h5', 'mb-4', 'pb-0', 'py-0', 'mb-0', 'pt-0', 'pb-0', 'pl-1', 'text-h6', 'text-bold', 'm-0', 'text-h7', 'font-italic', 'grey--text', 'm-0', 'justify-end', 'py-0', 'font-weight-bold', 'text-h7', 'text-caption',];
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
        title: {
            type: String,
            required: true,
            default: 'STATISTICS',
        },
        stats: {
            type: Array,
            required: true,
            default: () => [],
        },
        userSince: {
            type: String,
            required: true,
            default: '',
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
            default: 'STATISTICS',
        },
        stats: {
            type: Array,
            required: true,
            default: () => [],
        },
        userSince: {
            type: String,
            required: true,
            default: '',
        },
    },
    __typeEl: {},
});
; /* PartiallyEnd: #4569/main.vue */
