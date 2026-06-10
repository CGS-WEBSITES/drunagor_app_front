/// <reference types="../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import { ref } from "vue";
const isExpanded = ref(false);
const isExpanded1 = ref(false);
const isExpanded2 = ref(false);
const avatars = ref([
    { image: "https://pbs.twimg.com/media/FMFSl1nWUAEWfH4.png" }, // Substitua com URLs de imagens reais
    { image: "https://pbs.twimg.com/media/F_QpCoAXEAAQ4i5.png" },
    { image: "https://pbs.twimg.com/media/F_QyAkqWQAEoa8B.png" },
    { image: "https://pbs.twimg.com/media/FMIx8qWWQAUSWcH.jpg:large" },
    {
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS1nEi1_5tCqWt4-fy-nIHQOzULoJbreh0qIQ&s",
    },
    { image: "https://pbs.twimg.com/media/FON11yUXEAUQ62z.jpg" },
]);
const back = ref([
    {
        image: "https://i.pinimg.com/originals/47/24/3e/47243e1d51883c7982c681759c99b720.jpg",
    }, // Substitua com URLs de imagens reais
    {
        image: "https://wallpapergod.com/images/hd/anime-1920X1080-wallpaper-zt2ofpcty3uddiht.jpeg",
    },
    {
        image: "https://wallpapersmug.com/download/1920x1080/058c6f/a-world-full-of-red.jpg",
    },
    {
        image: "https://wallpapers.com/images/hd/dark-anime-scenery-wot9wg412s7h8yxa.jpg",
    },
    { image: "https://i.redd.it/4g3lhgf6t9sb1.jpg" },
    {
        image: "https://wallpapercat.com/w/full/3/a/3/5816740-1920x1080-desktop-hd-cool-anime-background-image.jpg",
    },
]);
const color = ref([
    {
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/62/Solid_red.svg/1024px-Solid_red.svg.png",
    }, // Substitua com URLs de imagens reais
    {
        image: "https://cdn.shopify.com/s/files/1/0560/8177/6714/products/wall-paint-color-vernice-rc-neutrals-017-50565A.jpg?v=1666960890",
    },
    {
        image: "https://images.tcdn.com.br/img/img_prod/700425/tinta_acrilica_ss288_bright_green_8941_1_e555cddd9def8b0f2f50d16803f67982.jpg",
    },
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
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
const __VLS_0 = {}.VContainer;
/** @type {[typeof __VLS_components.VContainer, typeof __VLS_components.vContainer, typeof __VLS_components.VContainer, typeof __VLS_components.vContainer, ]} */ ;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
    maxWidth: "800",
    ...{ class: "pa-2" },
}));
const __VLS_2 = __VLS_1({
    maxWidth: "800",
    ...{ class: "pa-2" },
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
__VLS_3.slots.default;
const __VLS_4 = {}.VCard;
/** @type {[typeof __VLS_components.VCard, typeof __VLS_components.vCard, typeof __VLS_components.VCard, typeof __VLS_components.vCard, ]} */ ;
// @ts-ignore
const __VLS_5 = __VLS_asFunctionalComponent(__VLS_4, new __VLS_4({
    rounded: "lg",
    elevation: "3",
}));
const __VLS_6 = __VLS_5({
    rounded: "lg",
    elevation: "3",
}, ...__VLS_functionalComponentArgsRest(__VLS_5));
__VLS_7.slots.default;
const __VLS_8 = {}.VCardTitle;
/** @type {[typeof __VLS_components.VCardTitle, typeof __VLS_components.vCardTitle, typeof __VLS_components.VCardTitle, typeof __VLS_components.vCardTitle, ]} */ ;
// @ts-ignore
const __VLS_9 = __VLS_asFunctionalComponent(__VLS_8, new __VLS_8({
    ...{ 'onClick': {} },
    ...{ class: "d-flex justify-space-between align-center" },
}));
const __VLS_10 = __VLS_9({
    ...{ 'onClick': {} },
    ...{ class: "d-flex justify-space-between align-center" },
}, ...__VLS_functionalComponentArgsRest(__VLS_9));
let __VLS_12;
let __VLS_13;
let __VLS_14;
const __VLS_15 = {
    onClick: (__VLS_ctx.toggleExpanded)
};
__VLS_11.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "text-h5 font-weight-black pl-3 pt-2 pb-2" },
});
const __VLS_16 = {}.VIcon;
/** @type {[typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, ]} */ ;
// @ts-ignore
const __VLS_17 = __VLS_asFunctionalComponent(__VLS_16, new __VLS_16({}));
const __VLS_18 = __VLS_17({}, ...__VLS_functionalComponentArgsRest(__VLS_17));
__VLS_19.slots.default;
(__VLS_ctx.isExpanded ? "mdi-chevron-up" : "mdi-chevron-down");
var __VLS_19;
var __VLS_11;
const __VLS_20 = {}.VExpandTransition;
/** @type {[typeof __VLS_components.VExpandTransition, typeof __VLS_components.vExpandTransition, typeof __VLS_components.VExpandTransition, typeof __VLS_components.vExpandTransition, ]} */ ;
// @ts-ignore
const __VLS_21 = __VLS_asFunctionalComponent(__VLS_20, new __VLS_20({}));
const __VLS_22 = __VLS_21({}, ...__VLS_functionalComponentArgsRest(__VLS_21));
__VLS_23.slots.default;
if (__VLS_ctx.isExpanded) {
    const __VLS_24 = {}.VCardText;
    /** @type {[typeof __VLS_components.VCardText, typeof __VLS_components.vCardText, typeof __VLS_components.VCardText, typeof __VLS_components.vCardText, ]} */ ;
    // @ts-ignore
    const __VLS_25 = __VLS_asFunctionalComponent(__VLS_24, new __VLS_24({}));
    const __VLS_26 = __VLS_25({}, ...__VLS_functionalComponentArgsRest(__VLS_25));
    __VLS_27.slots.default;
    const __VLS_28 = {}.VRow;
    /** @type {[typeof __VLS_components.VRow, typeof __VLS_components.vRow, typeof __VLS_components.VRow, typeof __VLS_components.vRow, ]} */ ;
    // @ts-ignore
    const __VLS_29 = __VLS_asFunctionalComponent(__VLS_28, new __VLS_28({}));
    const __VLS_30 = __VLS_29({}, ...__VLS_functionalComponentArgsRest(__VLS_29));
    __VLS_31.slots.default;
    for (const [avatar, index] of __VLS_getVForSourceType((__VLS_ctx.avatars))) {
        const __VLS_32 = {}.VCol;
        /** @type {[typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ]} */ ;
        // @ts-ignore
        const __VLS_33 = __VLS_asFunctionalComponent(__VLS_32, new __VLS_32({
            key: (index),
            cols: "4",
            sm: "4",
            lg: "3",
            ...{ class: "d-flex justify-center align-center" },
        }));
        const __VLS_34 = __VLS_33({
            key: (index),
            cols: "4",
            sm: "4",
            lg: "3",
            ...{ class: "d-flex justify-center align-center" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_33));
        __VLS_35.slots.default;
        const __VLS_36 = {}.VImg;
        /** @type {[typeof __VLS_components.VImg, typeof __VLS_components.vImg, ]} */ ;
        // @ts-ignore
        const __VLS_37 = __VLS_asFunctionalComponent(__VLS_36, new __VLS_36({
            src: (avatar.image),
            alt: "Avatar",
            maxWidth: "200",
            maxHeight: "200",
            ...{ class: "rounded-lg" },
        }));
        const __VLS_38 = __VLS_37({
            src: (avatar.image),
            alt: "Avatar",
            maxWidth: "200",
            maxHeight: "200",
            ...{ class: "rounded-lg" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_37));
        var __VLS_35;
    }
    var __VLS_31;
    var __VLS_27;
}
var __VLS_23;
var __VLS_7;
var __VLS_3;
const __VLS_40 = {}.VContainer;
/** @type {[typeof __VLS_components.VContainer, typeof __VLS_components.vContainer, typeof __VLS_components.VContainer, typeof __VLS_components.vContainer, ]} */ ;
// @ts-ignore
const __VLS_41 = __VLS_asFunctionalComponent(__VLS_40, new __VLS_40({
    maxWidth: "800",
    ...{ class: "pa-2" },
}));
const __VLS_42 = __VLS_41({
    maxWidth: "800",
    ...{ class: "pa-2" },
}, ...__VLS_functionalComponentArgsRest(__VLS_41));
__VLS_43.slots.default;
const __VLS_44 = {}.VCard;
/** @type {[typeof __VLS_components.VCard, typeof __VLS_components.vCard, typeof __VLS_components.VCard, typeof __VLS_components.vCard, ]} */ ;
// @ts-ignore
const __VLS_45 = __VLS_asFunctionalComponent(__VLS_44, new __VLS_44({
    rounded: "lg",
    elevation: "3",
}));
const __VLS_46 = __VLS_45({
    rounded: "lg",
    elevation: "3",
}, ...__VLS_functionalComponentArgsRest(__VLS_45));
__VLS_47.slots.default;
const __VLS_48 = {}.VCardTitle;
/** @type {[typeof __VLS_components.VCardTitle, typeof __VLS_components.vCardTitle, typeof __VLS_components.VCardTitle, typeof __VLS_components.vCardTitle, ]} */ ;
// @ts-ignore
const __VLS_49 = __VLS_asFunctionalComponent(__VLS_48, new __VLS_48({
    ...{ 'onClick': {} },
    ...{ class: "d-flex justify-space-between align-center" },
}));
const __VLS_50 = __VLS_49({
    ...{ 'onClick': {} },
    ...{ class: "d-flex justify-space-between align-center" },
}, ...__VLS_functionalComponentArgsRest(__VLS_49));
let __VLS_52;
let __VLS_53;
let __VLS_54;
const __VLS_55 = {
    onClick: (__VLS_ctx.toggleExpanded1)
};
__VLS_51.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "text-h5 font-weight-black pl-3 pt-2 pb-2" },
});
const __VLS_56 = {}.VIcon;
/** @type {[typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, ]} */ ;
// @ts-ignore
const __VLS_57 = __VLS_asFunctionalComponent(__VLS_56, new __VLS_56({}));
const __VLS_58 = __VLS_57({}, ...__VLS_functionalComponentArgsRest(__VLS_57));
__VLS_59.slots.default;
(__VLS_ctx.isExpanded1 ? "mdi-chevron-up" : "mdi-chevron-down");
var __VLS_59;
var __VLS_51;
const __VLS_60 = {}.VExpandTransition;
/** @type {[typeof __VLS_components.VExpandTransition, typeof __VLS_components.vExpandTransition, typeof __VLS_components.VExpandTransition, typeof __VLS_components.vExpandTransition, ]} */ ;
// @ts-ignore
const __VLS_61 = __VLS_asFunctionalComponent(__VLS_60, new __VLS_60({}));
const __VLS_62 = __VLS_61({}, ...__VLS_functionalComponentArgsRest(__VLS_61));
__VLS_63.slots.default;
if (__VLS_ctx.isExpanded1) {
    const __VLS_64 = {}.VCardText;
    /** @type {[typeof __VLS_components.VCardText, typeof __VLS_components.vCardText, typeof __VLS_components.VCardText, typeof __VLS_components.vCardText, ]} */ ;
    // @ts-ignore
    const __VLS_65 = __VLS_asFunctionalComponent(__VLS_64, new __VLS_64({}));
    const __VLS_66 = __VLS_65({}, ...__VLS_functionalComponentArgsRest(__VLS_65));
    __VLS_67.slots.default;
    const __VLS_68 = {}.VRow;
    /** @type {[typeof __VLS_components.VRow, typeof __VLS_components.vRow, typeof __VLS_components.VRow, typeof __VLS_components.vRow, ]} */ ;
    // @ts-ignore
    const __VLS_69 = __VLS_asFunctionalComponent(__VLS_68, new __VLS_68({}));
    const __VLS_70 = __VLS_69({}, ...__VLS_functionalComponentArgsRest(__VLS_69));
    __VLS_71.slots.default;
    for (const [avatar, index] of __VLS_getVForSourceType((__VLS_ctx.back))) {
        const __VLS_72 = {}.VCol;
        /** @type {[typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ]} */ ;
        // @ts-ignore
        const __VLS_73 = __VLS_asFunctionalComponent(__VLS_72, new __VLS_72({
            key: (index),
            cols: "6",
            sm: "",
            lg: "6",
            ...{ class: "d-flex justify-center align-center" },
        }));
        const __VLS_74 = __VLS_73({
            key: (index),
            cols: "6",
            sm: "",
            lg: "6",
            ...{ class: "d-flex justify-center align-center" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_73));
        __VLS_75.slots.default;
        const __VLS_76 = {}.VImg;
        /** @type {[typeof __VLS_components.VImg, typeof __VLS_components.vImg, ]} */ ;
        // @ts-ignore
        const __VLS_77 = __VLS_asFunctionalComponent(__VLS_76, new __VLS_76({
            src: (avatar.image),
            alt: "Avatar",
            maxWidth: "800",
            maxHeight: "600",
            ...{ class: "rounded-lg" },
        }));
        const __VLS_78 = __VLS_77({
            src: (avatar.image),
            alt: "Avatar",
            maxWidth: "800",
            maxHeight: "600",
            ...{ class: "rounded-lg" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_77));
        var __VLS_75;
    }
    var __VLS_71;
    var __VLS_67;
}
var __VLS_63;
var __VLS_47;
var __VLS_43;
const __VLS_80 = {}.VContainer;
/** @type {[typeof __VLS_components.VContainer, typeof __VLS_components.vContainer, typeof __VLS_components.VContainer, typeof __VLS_components.vContainer, ]} */ ;
// @ts-ignore
const __VLS_81 = __VLS_asFunctionalComponent(__VLS_80, new __VLS_80({
    maxWidth: "800",
    ...{ class: "pa-2" },
}));
const __VLS_82 = __VLS_81({
    maxWidth: "800",
    ...{ class: "pa-2" },
}, ...__VLS_functionalComponentArgsRest(__VLS_81));
__VLS_83.slots.default;
const __VLS_84 = {}.VCard;
/** @type {[typeof __VLS_components.VCard, typeof __VLS_components.vCard, typeof __VLS_components.VCard, typeof __VLS_components.vCard, ]} */ ;
// @ts-ignore
const __VLS_85 = __VLS_asFunctionalComponent(__VLS_84, new __VLS_84({
    rounded: "lg",
    elevation: "3",
}));
const __VLS_86 = __VLS_85({
    rounded: "lg",
    elevation: "3",
}, ...__VLS_functionalComponentArgsRest(__VLS_85));
__VLS_87.slots.default;
const __VLS_88 = {}.VCardTitle;
/** @type {[typeof __VLS_components.VCardTitle, typeof __VLS_components.vCardTitle, typeof __VLS_components.VCardTitle, typeof __VLS_components.vCardTitle, ]} */ ;
// @ts-ignore
const __VLS_89 = __VLS_asFunctionalComponent(__VLS_88, new __VLS_88({
    ...{ 'onClick': {} },
    ...{ class: "d-flex justify-space-between align-center" },
}));
const __VLS_90 = __VLS_89({
    ...{ 'onClick': {} },
    ...{ class: "d-flex justify-space-between align-center" },
}, ...__VLS_functionalComponentArgsRest(__VLS_89));
let __VLS_92;
let __VLS_93;
let __VLS_94;
const __VLS_95 = {
    onClick: (__VLS_ctx.toggleExpanded2)
};
__VLS_91.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "text-h5 font-weight-black pl-3 pt-2 pb-2" },
});
const __VLS_96 = {}.VIcon;
/** @type {[typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, ]} */ ;
// @ts-ignore
const __VLS_97 = __VLS_asFunctionalComponent(__VLS_96, new __VLS_96({}));
const __VLS_98 = __VLS_97({}, ...__VLS_functionalComponentArgsRest(__VLS_97));
__VLS_99.slots.default;
(__VLS_ctx.isExpanded2 ? "mdi-chevron-up" : "mdi-chevron-down");
var __VLS_99;
var __VLS_91;
const __VLS_100 = {}.VExpandTransition;
/** @type {[typeof __VLS_components.VExpandTransition, typeof __VLS_components.vExpandTransition, typeof __VLS_components.VExpandTransition, typeof __VLS_components.vExpandTransition, ]} */ ;
// @ts-ignore
const __VLS_101 = __VLS_asFunctionalComponent(__VLS_100, new __VLS_100({}));
const __VLS_102 = __VLS_101({}, ...__VLS_functionalComponentArgsRest(__VLS_101));
__VLS_103.slots.default;
if (__VLS_ctx.isExpanded2) {
    const __VLS_104 = {}.VCardText;
    /** @type {[typeof __VLS_components.VCardText, typeof __VLS_components.vCardText, typeof __VLS_components.VCardText, typeof __VLS_components.vCardText, ]} */ ;
    // @ts-ignore
    const __VLS_105 = __VLS_asFunctionalComponent(__VLS_104, new __VLS_104({}));
    const __VLS_106 = __VLS_105({}, ...__VLS_functionalComponentArgsRest(__VLS_105));
    __VLS_107.slots.default;
    const __VLS_108 = {}.VRow;
    /** @type {[typeof __VLS_components.VRow, typeof __VLS_components.vRow, typeof __VLS_components.VRow, typeof __VLS_components.vRow, ]} */ ;
    // @ts-ignore
    const __VLS_109 = __VLS_asFunctionalComponent(__VLS_108, new __VLS_108({}));
    const __VLS_110 = __VLS_109({}, ...__VLS_functionalComponentArgsRest(__VLS_109));
    __VLS_111.slots.default;
    for (const [avatar, index] of __VLS_getVForSourceType((__VLS_ctx.color))) {
        const __VLS_112 = {}.VCol;
        /** @type {[typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ]} */ ;
        // @ts-ignore
        const __VLS_113 = __VLS_asFunctionalComponent(__VLS_112, new __VLS_112({
            key: (index),
            cols: "4",
            sm: "4",
            lg: "3",
            ...{ class: "d-flex justify-center align-center" },
        }));
        const __VLS_114 = __VLS_113({
            key: (index),
            cols: "4",
            sm: "4",
            lg: "3",
            ...{ class: "d-flex justify-center align-center" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_113));
        __VLS_115.slots.default;
        const __VLS_116 = {}.VImg;
        /** @type {[typeof __VLS_components.VImg, typeof __VLS_components.vImg, ]} */ ;
        // @ts-ignore
        const __VLS_117 = __VLS_asFunctionalComponent(__VLS_116, new __VLS_116({
            src: (avatar.image),
            alt: "Avatar",
            maxWidth: "200",
            maxHeight: "200",
            ...{ class: "rounded-lg" },
        }));
        const __VLS_118 = __VLS_117({
            src: (avatar.image),
            alt: "Avatar",
            maxWidth: "200",
            maxHeight: "200",
            ...{ class: "rounded-lg" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_117));
        var __VLS_115;
    }
    var __VLS_111;
    var __VLS_107;
}
var __VLS_103;
var __VLS_87;
var __VLS_83;
/** @type {__VLS_StyleScopedClasses['pa-2']} */ ;
/** @type {__VLS_StyleScopedClasses['d-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-space-between']} */ ;
/** @type {__VLS_StyleScopedClasses['align-center']} */ ;
/** @type {__VLS_StyleScopedClasses['text-h5']} */ ;
/** @type {__VLS_StyleScopedClasses['font-weight-black']} */ ;
/** @type {__VLS_StyleScopedClasses['pl-3']} */ ;
/** @type {__VLS_StyleScopedClasses['pt-2']} */ ;
/** @type {__VLS_StyleScopedClasses['pb-2']} */ ;
/** @type {__VLS_StyleScopedClasses['d-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['align-center']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['pa-2']} */ ;
/** @type {__VLS_StyleScopedClasses['d-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-space-between']} */ ;
/** @type {__VLS_StyleScopedClasses['align-center']} */ ;
/** @type {__VLS_StyleScopedClasses['text-h5']} */ ;
/** @type {__VLS_StyleScopedClasses['font-weight-black']} */ ;
/** @type {__VLS_StyleScopedClasses['pl-3']} */ ;
/** @type {__VLS_StyleScopedClasses['pt-2']} */ ;
/** @type {__VLS_StyleScopedClasses['pb-2']} */ ;
/** @type {__VLS_StyleScopedClasses['d-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['align-center']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['pa-2']} */ ;
/** @type {__VLS_StyleScopedClasses['d-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-space-between']} */ ;
/** @type {__VLS_StyleScopedClasses['align-center']} */ ;
/** @type {__VLS_StyleScopedClasses['text-h5']} */ ;
/** @type {__VLS_StyleScopedClasses['font-weight-black']} */ ;
/** @type {__VLS_StyleScopedClasses['pl-3']} */ ;
/** @type {__VLS_StyleScopedClasses['pt-2']} */ ;
/** @type {__VLS_StyleScopedClasses['pb-2']} */ ;
/** @type {__VLS_StyleScopedClasses['d-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['align-center']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
var __VLS_dollars;
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
