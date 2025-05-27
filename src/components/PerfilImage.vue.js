/// <reference types="../../node_modules/.vue-global-types/vue_3.5_false.d.ts" />
import { ref } from 'vue';
const isExpanded = ref(false);
const isExpanded1 = ref(false);
const isExpanded2 = ref(false);
const avatars = ref([
    { image: 'https://pbs.twimg.com/media/FMFSl1nWUAEWfH4.png' }, // Substitua com URLs de imagens reais
    { image: 'https://pbs.twimg.com/media/F_QpCoAXEAAQ4i5.png' },
    { image: 'https://pbs.twimg.com/media/F_QyAkqWQAEoa8B.png' },
    { image: 'https://pbs.twimg.com/media/FMIx8qWWQAUSWcH.jpg:large' },
    { image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS1nEi1_5tCqWt4-fy-nIHQOzULoJbreh0qIQ&s' },
    { image: 'https://pbs.twimg.com/media/FON11yUXEAUQ62z.jpg' },
]);
const back = ref([
    { image: 'https://i.pinimg.com/originals/47/24/3e/47243e1d51883c7982c681759c99b720.jpg' }, // Substitua com URLs de imagens reais
    { image: 'https://wallpapergod.com/images/hd/anime-1920X1080-wallpaper-zt2ofpcty3uddiht.jpeg' },
    { image: 'https://wallpapersmug.com/download/1920x1080/058c6f/a-world-full-of-red.jpg' },
    { image: 'https://wallpapers.com/images/hd/dark-anime-scenery-wot9wg412s7h8yxa.jpg' },
    { image: 'https://i.redd.it/4g3lhgf6t9sb1.jpg' },
    { image: 'https://wallpapercat.com/w/full/3/a/3/5816740-1920x1080-desktop-hd-cool-anime-background-image.jpg' },
]);
const color = ref([
    { image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/62/Solid_red.svg/1024px-Solid_red.svg.png' }, // Substitua com URLs de imagens reais
    { image: 'https://cdn.shopify.com/s/files/1/0560/8177/6714/products/wall-paint-color-vernice-rc-neutrals-017-50565A.jpg?v=1666960890' },
    { image: 'https://images.tcdn.com.br/img/img_prod/700425/tinta_acrilica_ss288_bright_green_8941_1_e555cddd9def8b0f2f50d16803f67982.jpg' },
]);
const toggleExpanded = () => {
    isExpanded.value = !isExpanded.value;
};
const toggleExpanded1 = () => {
    isExpanded1.value = !isExpanded1.value;
};
const toggleExpanded2 = () => {
    isExpanded2.value = !isExpanded2.value;
};
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
        ...{ class: ("pa-2") },
    }));
    const __VLS_2 = __VLS_1({
        maxWidth: ("800"),
        ...{ class: ("pa-2") },
    }, ...__VLS_functionalComponentArgsRest(__VLS_1));
    const __VLS_6 = {}.VCard;
    /** @type { [typeof __VLS_components.VCard, typeof __VLS_components.vCard, typeof __VLS_components.VCard, typeof __VLS_components.vCard, ] } */ ;
    // @ts-ignore
    const __VLS_7 = __VLS_asFunctionalComponent(__VLS_6, new __VLS_6({
        rounded: ("lg"),
        elevation: ("3"),
    }));
    const __VLS_8 = __VLS_7({
        rounded: ("lg"),
        elevation: ("3"),
    }, ...__VLS_functionalComponentArgsRest(__VLS_7));
    const __VLS_12 = {}.VCardTitle;
    /** @type { [typeof __VLS_components.VCardTitle, typeof __VLS_components.vCardTitle, typeof __VLS_components.VCardTitle, typeof __VLS_components.vCardTitle, ] } */ ;
    // @ts-ignore
    const __VLS_13 = __VLS_asFunctionalComponent(__VLS_12, new __VLS_12({
        ...{ 'onClick': {} },
        ...{ class: ("d-flex justify-space-between align-center") },
    }));
    const __VLS_14 = __VLS_13({
        ...{ 'onClick': {} },
        ...{ class: ("d-flex justify-space-between align-center") },
    }, ...__VLS_functionalComponentArgsRest(__VLS_13));
    let __VLS_18;
    const __VLS_19 = {
        onClick: (__VLS_ctx.toggleExpanded)
    };
    let __VLS_15;
    let __VLS_16;
    __VLS_elementAsFunction(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: ("text-h5 font-weight-black pl-3 pt-2 pb-2") },
    });
    const __VLS_20 = {}.VIcon;
    /** @type { [typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, ] } */ ;
    // @ts-ignore
    const __VLS_21 = __VLS_asFunctionalComponent(__VLS_20, new __VLS_20({}));
    const __VLS_22 = __VLS_21({}, ...__VLS_functionalComponentArgsRest(__VLS_21));
    (__VLS_ctx.isExpanded ? 'mdi-chevron-up' : 'mdi-chevron-down');
    __VLS_25.slots.default;
    var __VLS_25;
    __VLS_17.slots.default;
    var __VLS_17;
    const __VLS_26 = {}.VExpandTransition;
    /** @type { [typeof __VLS_components.VExpandTransition, typeof __VLS_components.vExpandTransition, typeof __VLS_components.VExpandTransition, typeof __VLS_components.vExpandTransition, ] } */ ;
    // @ts-ignore
    const __VLS_27 = __VLS_asFunctionalComponent(__VLS_26, new __VLS_26({}));
    const __VLS_28 = __VLS_27({}, ...__VLS_functionalComponentArgsRest(__VLS_27));
    if (__VLS_ctx.isExpanded) {
        const __VLS_32 = {}.VCardText;
        /** @type { [typeof __VLS_components.VCardText, typeof __VLS_components.vCardText, typeof __VLS_components.VCardText, typeof __VLS_components.vCardText, ] } */ ;
        // @ts-ignore
        const __VLS_33 = __VLS_asFunctionalComponent(__VLS_32, new __VLS_32({}));
        const __VLS_34 = __VLS_33({}, ...__VLS_functionalComponentArgsRest(__VLS_33));
        const __VLS_38 = {}.VRow;
        /** @type { [typeof __VLS_components.VRow, typeof __VLS_components.vRow, typeof __VLS_components.VRow, typeof __VLS_components.vRow, ] } */ ;
        // @ts-ignore
        const __VLS_39 = __VLS_asFunctionalComponent(__VLS_38, new __VLS_38({}));
        const __VLS_40 = __VLS_39({}, ...__VLS_functionalComponentArgsRest(__VLS_39));
        for (const [avatar, index] of __VLS_getVForSourceType((__VLS_ctx.avatars))) {
            const __VLS_44 = {}.VCol;
            /** @type { [typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ] } */ ;
            // @ts-ignore
            const __VLS_45 = __VLS_asFunctionalComponent(__VLS_44, new __VLS_44({
                key: ((index)),
                cols: ("4"),
                sm: ("4"),
                lg: ("3"),
                ...{ class: ("d-flex justify-center align-center") },
            }));
            const __VLS_46 = __VLS_45({
                key: ((index)),
                cols: ("4"),
                sm: ("4"),
                lg: ("3"),
                ...{ class: ("d-flex justify-center align-center") },
            }, ...__VLS_functionalComponentArgsRest(__VLS_45));
            const __VLS_50 = {}.VImg;
            /** @type { [typeof __VLS_components.VImg, typeof __VLS_components.vImg, ] } */ ;
            // @ts-ignore
            const __VLS_51 = __VLS_asFunctionalComponent(__VLS_50, new __VLS_50({
                src: ((avatar.image)),
                alt: ("Avatar"),
                maxWidth: ("200"),
                maxHeight: ("200"),
                ...{ class: ("rounded-lg") },
            }));
            const __VLS_52 = __VLS_51({
                src: ((avatar.image)),
                alt: ("Avatar"),
                maxWidth: ("200"),
                maxHeight: ("200"),
                ...{ class: ("rounded-lg") },
            }, ...__VLS_functionalComponentArgsRest(__VLS_51));
            __VLS_49.slots.default;
            var __VLS_49;
        }
        __VLS_43.slots.default;
        var __VLS_43;
        __VLS_37.slots.default;
        var __VLS_37;
    }
    __VLS_31.slots.default;
    var __VLS_31;
    __VLS_11.slots.default;
    var __VLS_11;
    __VLS_5.slots.default;
    var __VLS_5;
    const __VLS_56 = {}.VContainer;
    /** @type { [typeof __VLS_components.VContainer, typeof __VLS_components.vContainer, typeof __VLS_components.VContainer, typeof __VLS_components.vContainer, ] } */ ;
    // @ts-ignore
    const __VLS_57 = __VLS_asFunctionalComponent(__VLS_56, new __VLS_56({
        maxWidth: ("800"),
        ...{ class: ("pa-2") },
    }));
    const __VLS_58 = __VLS_57({
        maxWidth: ("800"),
        ...{ class: ("pa-2") },
    }, ...__VLS_functionalComponentArgsRest(__VLS_57));
    const __VLS_62 = {}.VCard;
    /** @type { [typeof __VLS_components.VCard, typeof __VLS_components.vCard, typeof __VLS_components.VCard, typeof __VLS_components.vCard, ] } */ ;
    // @ts-ignore
    const __VLS_63 = __VLS_asFunctionalComponent(__VLS_62, new __VLS_62({
        rounded: ("lg"),
        elevation: ("3"),
    }));
    const __VLS_64 = __VLS_63({
        rounded: ("lg"),
        elevation: ("3"),
    }, ...__VLS_functionalComponentArgsRest(__VLS_63));
    const __VLS_68 = {}.VCardTitle;
    /** @type { [typeof __VLS_components.VCardTitle, typeof __VLS_components.vCardTitle, typeof __VLS_components.VCardTitle, typeof __VLS_components.vCardTitle, ] } */ ;
    // @ts-ignore
    const __VLS_69 = __VLS_asFunctionalComponent(__VLS_68, new __VLS_68({
        ...{ 'onClick': {} },
        ...{ class: ("d-flex justify-space-between align-center") },
    }));
    const __VLS_70 = __VLS_69({
        ...{ 'onClick': {} },
        ...{ class: ("d-flex justify-space-between align-center") },
    }, ...__VLS_functionalComponentArgsRest(__VLS_69));
    let __VLS_74;
    const __VLS_75 = {
        onClick: (__VLS_ctx.toggleExpanded1)
    };
    let __VLS_71;
    let __VLS_72;
    __VLS_elementAsFunction(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: ("text-h5 font-weight-black pl-3 pt-2 pb-2") },
    });
    const __VLS_76 = {}.VIcon;
    /** @type { [typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, ] } */ ;
    // @ts-ignore
    const __VLS_77 = __VLS_asFunctionalComponent(__VLS_76, new __VLS_76({}));
    const __VLS_78 = __VLS_77({}, ...__VLS_functionalComponentArgsRest(__VLS_77));
    (__VLS_ctx.isExpanded1 ? 'mdi-chevron-up' : 'mdi-chevron-down');
    __VLS_81.slots.default;
    var __VLS_81;
    __VLS_73.slots.default;
    var __VLS_73;
    const __VLS_82 = {}.VExpandTransition;
    /** @type { [typeof __VLS_components.VExpandTransition, typeof __VLS_components.vExpandTransition, typeof __VLS_components.VExpandTransition, typeof __VLS_components.vExpandTransition, ] } */ ;
    // @ts-ignore
    const __VLS_83 = __VLS_asFunctionalComponent(__VLS_82, new __VLS_82({}));
    const __VLS_84 = __VLS_83({}, ...__VLS_functionalComponentArgsRest(__VLS_83));
    if (__VLS_ctx.isExpanded1) {
        const __VLS_88 = {}.VCardText;
        /** @type { [typeof __VLS_components.VCardText, typeof __VLS_components.vCardText, typeof __VLS_components.VCardText, typeof __VLS_components.vCardText, ] } */ ;
        // @ts-ignore
        const __VLS_89 = __VLS_asFunctionalComponent(__VLS_88, new __VLS_88({}));
        const __VLS_90 = __VLS_89({}, ...__VLS_functionalComponentArgsRest(__VLS_89));
        const __VLS_94 = {}.VRow;
        /** @type { [typeof __VLS_components.VRow, typeof __VLS_components.vRow, typeof __VLS_components.VRow, typeof __VLS_components.vRow, ] } */ ;
        // @ts-ignore
        const __VLS_95 = __VLS_asFunctionalComponent(__VLS_94, new __VLS_94({}));
        const __VLS_96 = __VLS_95({}, ...__VLS_functionalComponentArgsRest(__VLS_95));
        for (const [avatar, index] of __VLS_getVForSourceType((__VLS_ctx.back))) {
            const __VLS_100 = {}.VCol;
            /** @type { [typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ] } */ ;
            // @ts-ignore
            const __VLS_101 = __VLS_asFunctionalComponent(__VLS_100, new __VLS_100({
                key: ((index)),
                cols: ("6"),
                sm: (""),
                lg: ("6"),
                ...{ class: ("d-flex justify-center align-center") },
            }));
            const __VLS_102 = __VLS_101({
                key: ((index)),
                cols: ("6"),
                sm: (""),
                lg: ("6"),
                ...{ class: ("d-flex justify-center align-center") },
            }, ...__VLS_functionalComponentArgsRest(__VLS_101));
            const __VLS_106 = {}.VImg;
            /** @type { [typeof __VLS_components.VImg, typeof __VLS_components.vImg, ] } */ ;
            // @ts-ignore
            const __VLS_107 = __VLS_asFunctionalComponent(__VLS_106, new __VLS_106({
                src: ((avatar.image)),
                alt: ("Avatar"),
                maxWidth: ("800"),
                maxHeight: ("600"),
                ...{ class: ("rounded-lg") },
            }));
            const __VLS_108 = __VLS_107({
                src: ((avatar.image)),
                alt: ("Avatar"),
                maxWidth: ("800"),
                maxHeight: ("600"),
                ...{ class: ("rounded-lg") },
            }, ...__VLS_functionalComponentArgsRest(__VLS_107));
            __VLS_105.slots.default;
            var __VLS_105;
        }
        __VLS_99.slots.default;
        var __VLS_99;
        __VLS_93.slots.default;
        var __VLS_93;
    }
    __VLS_87.slots.default;
    var __VLS_87;
    __VLS_67.slots.default;
    var __VLS_67;
    __VLS_61.slots.default;
    var __VLS_61;
    const __VLS_112 = {}.VContainer;
    /** @type { [typeof __VLS_components.VContainer, typeof __VLS_components.vContainer, typeof __VLS_components.VContainer, typeof __VLS_components.vContainer, ] } */ ;
    // @ts-ignore
    const __VLS_113 = __VLS_asFunctionalComponent(__VLS_112, new __VLS_112({
        maxWidth: ("800"),
        ...{ class: ("pa-2") },
    }));
    const __VLS_114 = __VLS_113({
        maxWidth: ("800"),
        ...{ class: ("pa-2") },
    }, ...__VLS_functionalComponentArgsRest(__VLS_113));
    const __VLS_118 = {}.VCard;
    /** @type { [typeof __VLS_components.VCard, typeof __VLS_components.vCard, typeof __VLS_components.VCard, typeof __VLS_components.vCard, ] } */ ;
    // @ts-ignore
    const __VLS_119 = __VLS_asFunctionalComponent(__VLS_118, new __VLS_118({
        rounded: ("lg"),
        elevation: ("3"),
    }));
    const __VLS_120 = __VLS_119({
        rounded: ("lg"),
        elevation: ("3"),
    }, ...__VLS_functionalComponentArgsRest(__VLS_119));
    const __VLS_124 = {}.VCardTitle;
    /** @type { [typeof __VLS_components.VCardTitle, typeof __VLS_components.vCardTitle, typeof __VLS_components.VCardTitle, typeof __VLS_components.vCardTitle, ] } */ ;
    // @ts-ignore
    const __VLS_125 = __VLS_asFunctionalComponent(__VLS_124, new __VLS_124({
        ...{ 'onClick': {} },
        ...{ class: ("d-flex justify-space-between align-center") },
    }));
    const __VLS_126 = __VLS_125({
        ...{ 'onClick': {} },
        ...{ class: ("d-flex justify-space-between align-center") },
    }, ...__VLS_functionalComponentArgsRest(__VLS_125));
    let __VLS_130;
    const __VLS_131 = {
        onClick: (__VLS_ctx.toggleExpanded2)
    };
    let __VLS_127;
    let __VLS_128;
    __VLS_elementAsFunction(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: ("text-h5 font-weight-black pl-3 pt-2 pb-2") },
    });
    const __VLS_132 = {}.VIcon;
    /** @type { [typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, ] } */ ;
    // @ts-ignore
    const __VLS_133 = __VLS_asFunctionalComponent(__VLS_132, new __VLS_132({}));
    const __VLS_134 = __VLS_133({}, ...__VLS_functionalComponentArgsRest(__VLS_133));
    (__VLS_ctx.isExpanded2 ? 'mdi-chevron-up' : 'mdi-chevron-down');
    __VLS_137.slots.default;
    var __VLS_137;
    __VLS_129.slots.default;
    var __VLS_129;
    const __VLS_138 = {}.VExpandTransition;
    /** @type { [typeof __VLS_components.VExpandTransition, typeof __VLS_components.vExpandTransition, typeof __VLS_components.VExpandTransition, typeof __VLS_components.vExpandTransition, ] } */ ;
    // @ts-ignore
    const __VLS_139 = __VLS_asFunctionalComponent(__VLS_138, new __VLS_138({}));
    const __VLS_140 = __VLS_139({}, ...__VLS_functionalComponentArgsRest(__VLS_139));
    if (__VLS_ctx.isExpanded2) {
        const __VLS_144 = {}.VCardText;
        /** @type { [typeof __VLS_components.VCardText, typeof __VLS_components.vCardText, typeof __VLS_components.VCardText, typeof __VLS_components.vCardText, ] } */ ;
        // @ts-ignore
        const __VLS_145 = __VLS_asFunctionalComponent(__VLS_144, new __VLS_144({}));
        const __VLS_146 = __VLS_145({}, ...__VLS_functionalComponentArgsRest(__VLS_145));
        const __VLS_150 = {}.VRow;
        /** @type { [typeof __VLS_components.VRow, typeof __VLS_components.vRow, typeof __VLS_components.VRow, typeof __VLS_components.vRow, ] } */ ;
        // @ts-ignore
        const __VLS_151 = __VLS_asFunctionalComponent(__VLS_150, new __VLS_150({}));
        const __VLS_152 = __VLS_151({}, ...__VLS_functionalComponentArgsRest(__VLS_151));
        for (const [avatar, index] of __VLS_getVForSourceType((__VLS_ctx.color))) {
            const __VLS_156 = {}.VCol;
            /** @type { [typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ] } */ ;
            // @ts-ignore
            const __VLS_157 = __VLS_asFunctionalComponent(__VLS_156, new __VLS_156({
                key: ((index)),
                cols: ("4"),
                sm: ("4"),
                lg: ("3"),
                ...{ class: ("d-flex justify-center align-center") },
            }));
            const __VLS_158 = __VLS_157({
                key: ((index)),
                cols: ("4"),
                sm: ("4"),
                lg: ("3"),
                ...{ class: ("d-flex justify-center align-center") },
            }, ...__VLS_functionalComponentArgsRest(__VLS_157));
            const __VLS_162 = {}.VImg;
            /** @type { [typeof __VLS_components.VImg, typeof __VLS_components.vImg, ] } */ ;
            // @ts-ignore
            const __VLS_163 = __VLS_asFunctionalComponent(__VLS_162, new __VLS_162({
                src: ((avatar.image)),
                alt: ("Avatar"),
                maxWidth: ("200"),
                maxHeight: ("200"),
                ...{ class: ("rounded-lg") },
            }));
            const __VLS_164 = __VLS_163({
                src: ((avatar.image)),
                alt: ("Avatar"),
                maxWidth: ("200"),
                maxHeight: ("200"),
                ...{ class: ("rounded-lg") },
            }, ...__VLS_functionalComponentArgsRest(__VLS_163));
            __VLS_161.slots.default;
            var __VLS_161;
        }
        __VLS_155.slots.default;
        var __VLS_155;
        __VLS_149.slots.default;
        var __VLS_149;
    }
    __VLS_143.slots.default;
    var __VLS_143;
    __VLS_123.slots.default;
    var __VLS_123;
    __VLS_117.slots.default;
    var __VLS_117;
    ['pa-2', 'd-flex', 'justify-space-between', 'align-center', 'text-h5', 'font-weight-black', 'pl-3', 'pt-2', 'pb-2', 'd-flex', 'justify-center', 'align-center', 'rounded-lg', 'pa-2', 'd-flex', 'justify-space-between', 'align-center', 'text-h5', 'font-weight-black', 'pl-3', 'pt-2', 'pb-2', 'd-flex', 'justify-center', 'align-center', 'rounded-lg', 'pa-2', 'd-flex', 'justify-space-between', 'align-center', 'text-h5', 'font-weight-black', 'pl-3', 'pt-2', 'pb-2', 'd-flex', 'justify-center', 'align-center', 'rounded-lg',];
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
        return {
            isExpanded: isExpanded,
            isExpanded1: isExpanded1,
            isExpanded2: isExpanded2,
            avatars: avatars,
            back: back,
            color: color,
            toggleExpanded: toggleExpanded,
            toggleExpanded1: toggleExpanded1,
            toggleExpanded2: toggleExpanded2,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
