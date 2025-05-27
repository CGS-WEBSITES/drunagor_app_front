/// <reference types="../../node_modules/.vue-global-types/vue_3.5_false.d.ts" />
import { defineProps } from 'vue';
// Props para configurar o componente
const __VLS_props = defineProps({
    title: {
        type: String,
        required: true,
        default: 'ACHIEVEMENTS',
    },
    total: {
        type: String,
        required: true,
        default: '[TOTAL]',
    },
    achievements: {
        type: Array,
        required: true,
        default: () => [
            {
                image: '/home/dudu/Downloads/Rectangle 121.png',
                title: 'Great Achievement Name',
                description: 'Achievement short description here cabe duas linha aqui ó',
                date: '11/11/2024',
                icon: 'mdi-trophy',
                progress: '15/43',
            },
        ],
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
        ...{ class: ("pl-1 pt-1 pr-1 pb-0") },
    }));
    const __VLS_9 = __VLS_8({
        rounded: ("lg"),
        elevation: ("3"),
        ...{ class: ("pl-1 pt-1 pr-1 pb-0") },
    }, ...__VLS_functionalComponentArgsRest(__VLS_8));
    const __VLS_13 = {}.VCardTitle;
    /** @type { [typeof __VLS_components.VCardTitle, typeof __VLS_components.vCardTitle, typeof __VLS_components.VCardTitle, typeof __VLS_components.vCardTitle, ] } */ ;
    // @ts-ignore
    const __VLS_14 = __VLS_asFunctionalComponent(__VLS_13, new __VLS_13({
        ...{ class: ("d-flex justify-space-between pb-0") },
    }));
    const __VLS_15 = __VLS_14({
        ...{ class: ("d-flex justify-space-between pb-0") },
    }, ...__VLS_functionalComponentArgsRest(__VLS_14));
    __VLS_elementAsFunction(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: ("text-uppercase font-weight-black text-bold text-h5 mb-4 pb-0") },
    });
    (__VLS_ctx.title);
    __VLS_elementAsFunction(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: ("text-uppercase text-bold text-h5 mb-4 pb-0") },
    });
    (__VLS_ctx.total);
    __VLS_18.slots.default;
    var __VLS_18;
    const __VLS_19 = {}.VVirtualScroll;
    /** @type { [typeof __VLS_components.VVirtualScroll, typeof __VLS_components.vVirtualScroll, typeof __VLS_components.VVirtualScroll, typeof __VLS_components.vVirtualScroll, ] } */ ;
    // @ts-ignore
    const __VLS_20 = __VLS_asFunctionalComponent(__VLS_19, new __VLS_19({
        ...{ class: ("pt-0") },
        items: ((__VLS_ctx.achievements)),
        itemHeight: ((130)),
    }));
    const __VLS_21 = __VLS_20({
        ...{ class: ("pt-0") },
        items: ((__VLS_ctx.achievements)),
        itemHeight: ((130)),
    }, ...__VLS_functionalComponentArgsRest(__VLS_20));
    __VLS_elementAsFunction(__VLS_intrinsicElements.template, __VLS_intrinsicElements.template)({});
    {
        const { default: __VLS_thisSlot } = __VLS_24.slots;
        const [{ item }] = __VLS_getSlotParams(__VLS_thisSlot);
        const __VLS_25 = {}.VCard;
        /** @type { [typeof __VLS_components.VCard, typeof __VLS_components.vCard, typeof __VLS_components.VCard, typeof __VLS_components.vCard, ] } */ ;
        // @ts-ignore
        const __VLS_26 = __VLS_asFunctionalComponent(__VLS_25, new __VLS_25({
            rounded: ("lg"),
            elevation: ("3"),
            ...{ class: ("pa-0 mb-1 d-flex align-center") },
            ...{ style: ({}) },
        }));
        const __VLS_27 = __VLS_26({
            rounded: ("lg"),
            elevation: ("3"),
            ...{ class: ("pa-0 mb-1 d-flex align-center") },
            ...{ style: ({}) },
        }, ...__VLS_functionalComponentArgsRest(__VLS_26));
        const __VLS_31 = {}.VRow;
        /** @type { [typeof __VLS_components.VRow, typeof __VLS_components.vRow, typeof __VLS_components.VRow, typeof __VLS_components.vRow, ] } */ ;
        // @ts-ignore
        const __VLS_32 = __VLS_asFunctionalComponent(__VLS_31, new __VLS_31({
            ...{ class: ("align-center") },
        }));
        const __VLS_33 = __VLS_32({
            ...{ class: ("align-center") },
        }, ...__VLS_functionalComponentArgsRest(__VLS_32));
        const __VLS_37 = {}.VCol;
        /** @type { [typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ] } */ ;
        // @ts-ignore
        const __VLS_38 = __VLS_asFunctionalComponent(__VLS_37, new __VLS_37({
            cols: ("4"),
            lg: ("2"),
            ...{ class: ("d-flex align-center justify-start") },
        }));
        const __VLS_39 = __VLS_38({
            cols: ("4"),
            lg: ("2"),
            ...{ class: ("d-flex align-center justify-start") },
        }, ...__VLS_functionalComponentArgsRest(__VLS_38));
        const __VLS_43 = {}.VImg;
        /** @type { [typeof __VLS_components.VImg, typeof __VLS_components.vImg, typeof __VLS_components.VImg, typeof __VLS_components.vImg, ] } */ ;
        // @ts-ignore
        const __VLS_44 = __VLS_asFunctionalComponent(__VLS_43, new __VLS_43({
            src: ((item.image)),
            alt: ("Achievement Icon"),
            maxHeight: ("80"),
            ...{ class: ("rounded-lg") },
        }));
        const __VLS_45 = __VLS_44({
            src: ((item.image)),
            alt: ("Achievement Icon"),
            maxHeight: ("80"),
            ...{ class: ("rounded-lg") },
        }, ...__VLS_functionalComponentArgsRest(__VLS_44));
        __VLS_42.slots.default;
        var __VLS_42;
        const __VLS_49 = {}.VCol;
        /** @type { [typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ] } */ ;
        // @ts-ignore
        const __VLS_50 = __VLS_asFunctionalComponent(__VLS_49, new __VLS_49({
            cols: ("8"),
            ...{ class: ("pl-0 d-flex flex-column justify-center") },
        }));
        const __VLS_51 = __VLS_50({
            cols: ("8"),
            ...{ class: ("pl-0 d-flex flex-column justify-center") },
        }, ...__VLS_functionalComponentArgsRest(__VLS_50));
        __VLS_elementAsFunction(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
            ...{ class: ("font-weight-bold white--text") },
        });
        (item.title);
        __VLS_elementAsFunction(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
            ...{ class: ("text-body-2 grey--text ") },
        });
        (item.description);
        __VLS_elementAsFunction(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
            ...{ class: ("text-caption  grey--text ") },
        });
        (item.date);
        __VLS_54.slots.default;
        var __VLS_54;
        __VLS_36.slots.default;
        var __VLS_36;
        __VLS_30.slots.default;
        var __VLS_30;
    }
    var __VLS_24;
    __VLS_12.slots.default;
    var __VLS_12;
    __VLS_5.slots.default;
    var __VLS_5;
    ['pa-4', 'pl-1', 'pt-1', 'pr-1', 'pb-0', 'd-flex', 'justify-space-between', 'pb-0', 'text-uppercase', 'font-weight-black', 'text-bold', 'text-h5', 'mb-4', 'pb-0', 'text-uppercase', 'text-bold', 'text-h5', 'mb-4', 'pb-0', 'pt-0', 'pa-0', 'mb-1', 'd-flex', 'align-center', 'align-center', 'd-flex', 'align-center', 'justify-start', 'rounded-lg', 'pl-0', 'd-flex', 'flex-column', 'justify-center', 'font-weight-bold', 'white--text', 'text-body-2', 'grey--text', 'text-caption', 'grey--text',];
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
            default: 'ACHIEVEMENTS',
        },
        total: {
            type: String,
            required: true,
            default: '[TOTAL]',
        },
        achievements: {
            type: Array,
            required: true,
            default: () => [
                {
                    image: '/home/dudu/Downloads/Rectangle 121.png',
                    title: 'Great Achievement Name',
                    description: 'Achievement short description here cabe duas linha aqui ó',
                    date: '11/11/2024',
                    icon: 'mdi-trophy',
                    progress: '15/43',
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
            default: 'ACHIEVEMENTS',
        },
        total: {
            type: String,
            required: true,
            default: '[TOTAL]',
        },
        achievements: {
            type: Array,
            required: true,
            default: () => [
                {
                    image: '/home/dudu/Downloads/Rectangle 121.png',
                    title: 'Great Achievement Name',
                    description: 'Achievement short description here cabe duas linha aqui ó',
                    date: '11/11/2024',
                    icon: 'mdi-trophy',
                    progress: '15/43',
                },
            ],
        },
    },
    __typeEl: {},
});
; /* PartiallyEnd: #4569/main.vue */
