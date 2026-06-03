/// <reference types="../../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
export default (await import('vue')).defineComponent({
    props: {
        dialogVisible: Boolean,
        product: Object,
    },
    emits: ["update:dialogVisible"],
    methods: {
        updateProduct(key, value) {
            if (this.product) {
                this.$emit("update:product", { ...this.product, [key]: value });
            }
        },
    },
});
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
const __VLS_0 = {}.VDialog;
/** @type {[typeof __VLS_components.VDialog, typeof __VLS_components.vDialog, typeof __VLS_components.VDialog, typeof __VLS_components.vDialog, ]} */ ;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
    ...{ 'onUpdate:modelValue': {} },
    modelValue: (__VLS_ctx.dialogVisible),
    maxWidth: "900px",
}));
const __VLS_2 = __VLS_1({
    ...{ 'onUpdate:modelValue': {} },
    modelValue: (__VLS_ctx.dialogVisible),
    maxWidth: "900px",
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
let __VLS_4;
let __VLS_5;
let __VLS_6;
const __VLS_7 = {
    'onUpdate:modelValue': (...[$event]) => {
        __VLS_ctx.$emit('update:dialogVisible', $event);
    }
};
var __VLS_8 = {};
__VLS_3.slots.default;
const __VLS_9 = {}.VCard;
/** @type {[typeof __VLS_components.VCard, typeof __VLS_components.vCard, typeof __VLS_components.VCard, typeof __VLS_components.vCard, ]} */ ;
// @ts-ignore
const __VLS_10 = __VLS_asFunctionalComponent(__VLS_9, new __VLS_9({
    ...{ class: "pa-0" },
    color: "#0F7273",
}));
const __VLS_11 = __VLS_10({
    ...{ class: "pa-0" },
    color: "#0F7273",
}, ...__VLS_functionalComponentArgsRest(__VLS_10));
__VLS_12.slots.default;
const __VLS_13 = {}.VRow;
/** @type {[typeof __VLS_components.VRow, typeof __VLS_components.vRow, typeof __VLS_components.VRow, typeof __VLS_components.vRow, ]} */ ;
// @ts-ignore
const __VLS_14 = __VLS_asFunctionalComponent(__VLS_13, new __VLS_13({
    ...{ class: "ma-0 pa-0" },
}));
const __VLS_15 = __VLS_14({
    ...{ class: "ma-0 pa-0" },
}, ...__VLS_functionalComponentArgsRest(__VLS_14));
__VLS_16.slots.default;
const __VLS_17 = {}.VCol;
/** @type {[typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ]} */ ;
// @ts-ignore
const __VLS_18 = __VLS_asFunctionalComponent(__VLS_17, new __VLS_17({
    cols: "12",
    md: "4",
    ...{ class: "d-flex flex-column align-center pa-4" },
}));
const __VLS_19 = __VLS_18({
    cols: "12",
    md: "4",
    ...{ class: "d-flex flex-column align-center pa-4" },
}, ...__VLS_functionalComponentArgsRest(__VLS_18));
__VLS_20.slots.default;
const __VLS_21 = {}.VImg;
/** @type {[typeof __VLS_components.VImg, typeof __VLS_components.vImg, typeof __VLS_components.VImg, typeof __VLS_components.vImg, ]} */ ;
// @ts-ignore
const __VLS_22 = __VLS_asFunctionalComponent(__VLS_21, new __VLS_21({
    src: (__VLS_ctx.product?.image || '@/assets/apoc.png'),
    ...{ class: "rounded mb-4" },
    height: "240px",
    width: "auto",
    alt: "Product Image",
}));
const __VLS_23 = __VLS_22({
    src: (__VLS_ctx.product?.image || '@/assets/apoc.png'),
    ...{ class: "rounded mb-4" },
    height: "240px",
    width: "auto",
    alt: "Product Image",
}, ...__VLS_functionalComponentArgsRest(__VLS_22));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "w-100" },
});
const __VLS_25 = {}.VBtn;
/** @type {[typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ]} */ ;
// @ts-ignore
const __VLS_26 = __VLS_asFunctionalComponent(__VLS_25, new __VLS_25({
    prependIcon: "mdi mdi-star-check",
    color: "#B89816",
    ...{ class: "mb-1" },
    block: true,
}));
const __VLS_27 = __VLS_26({
    prependIcon: "mdi mdi-star-check",
    color: "#B89816",
    ...{ class: "mb-1" },
    block: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_26));
__VLS_28.slots.default;
var __VLS_28;
const __VLS_29 = {}.VBtn;
/** @type {[typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ]} */ ;
// @ts-ignore
const __VLS_30 = __VLS_asFunctionalComponent(__VLS_29, new __VLS_29({
    prependIcon: "mdi mdi-plus-circle",
    color: "#139394",
    block: true,
}));
const __VLS_31 = __VLS_30({
    prependIcon: "mdi mdi-plus-circle",
    color: "#139394",
    block: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_30));
__VLS_32.slots.default;
var __VLS_32;
const __VLS_33 = {}.VSpacer;
/** @type {[typeof __VLS_components.VSpacer, typeof __VLS_components.vSpacer, typeof __VLS_components.VSpacer, typeof __VLS_components.vSpacer, ]} */ ;
// @ts-ignore
const __VLS_34 = __VLS_asFunctionalComponent(__VLS_33, new __VLS_33({}));
const __VLS_35 = __VLS_34({}, ...__VLS_functionalComponentArgsRest(__VLS_34));
const __VLS_37 = {}.VBtn;
/** @type {[typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ]} */ ;
// @ts-ignore
const __VLS_38 = __VLS_asFunctionalComponent(__VLS_37, new __VLS_37({
    prependIcon: "mdi mdi-file-download-outline",
    color: "#312F2F",
    block: true,
    maxHeight: "50px",
    density: "compact",
}));
const __VLS_39 = __VLS_38({
    prependIcon: "mdi mdi-file-download-outline",
    color: "#312F2F",
    block: true,
    maxHeight: "50px",
    density: "compact",
}, ...__VLS_functionalComponentArgsRest(__VLS_38));
__VLS_40.slots.default;
var __VLS_40;
var __VLS_20;
const __VLS_41 = {}.VCol;
/** @type {[typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ]} */ ;
// @ts-ignore
const __VLS_42 = __VLS_asFunctionalComponent(__VLS_41, new __VLS_41({
    cols: "12",
    md: "8",
    ...{ class: "pa-0 position-relative" },
}));
const __VLS_43 = __VLS_42({
    cols: "12",
    md: "8",
    ...{ class: "pa-0 position-relative" },
}, ...__VLS_functionalComponentArgsRest(__VLS_42));
__VLS_44.slots.default;
const __VLS_45 = {}.VImg;
/** @type {[typeof __VLS_components.VImg, typeof __VLS_components.vImg, typeof __VLS_components.VImg, typeof __VLS_components.vImg, ]} */ ;
// @ts-ignore
const __VLS_46 = __VLS_asFunctionalComponent(__VLS_45, new __VLS_45({
    src: "@/assets/Apocalypse_Cover.png",
    cover: true,
    height: "100%",
    width: "100%",
    ...{ class: "opacity-80 fill-height" },
}));
const __VLS_47 = __VLS_46({
    src: "@/assets/Apocalypse_Cover.png",
    cover: true,
    height: "100%",
    width: "100%",
    ...{ class: "opacity-80 fill-height" },
}, ...__VLS_functionalComponentArgsRest(__VLS_46));
__VLS_48.slots.default;
const __VLS_49 = {}.VContainer;
/** @type {[typeof __VLS_components.VContainer, typeof __VLS_components.vContainer, typeof __VLS_components.VContainer, typeof __VLS_components.vContainer, ]} */ ;
// @ts-ignore
const __VLS_50 = __VLS_asFunctionalComponent(__VLS_49, new __VLS_49({
    ...{ class: "text-white pa-4" },
    fluid: true,
}));
const __VLS_51 = __VLS_50({
    ...{ class: "text-white pa-4" },
    fluid: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_50));
__VLS_52.slots.default;
const __VLS_53 = {}.VCardTitle;
/** @type {[typeof __VLS_components.VCardTitle, typeof __VLS_components.vCardTitle, typeof __VLS_components.VCardTitle, typeof __VLS_components.vCardTitle, ]} */ ;
// @ts-ignore
const __VLS_54 = __VLS_asFunctionalComponent(__VLS_53, new __VLS_53({
    ...{ class: "text-h5 font-weight-bold" },
}));
const __VLS_55 = __VLS_54({
    ...{ class: "text-h5 font-weight-bold" },
}, ...__VLS_functionalComponentArgsRest(__VLS_54));
__VLS_56.slots.default;
(__VLS_ctx.product?.name || "No Product Selected");
var __VLS_56;
const __VLS_57 = {}.VCardSubtitle;
/** @type {[typeof __VLS_components.VCardSubtitle, typeof __VLS_components.vCardSubtitle, typeof __VLS_components.VCardSubtitle, typeof __VLS_components.vCardSubtitle, ]} */ ;
// @ts-ignore
const __VLS_58 = __VLS_asFunctionalComponent(__VLS_57, new __VLS_57({
    ...{ class: "d-flex align-center" },
}));
const __VLS_59 = __VLS_58({
    ...{ class: "d-flex align-center" },
}, ...__VLS_functionalComponentArgsRest(__VLS_58));
__VLS_60.slots.default;
const __VLS_61 = {}.VCheckbox;
/** @type {[typeof __VLS_components.VCheckbox, typeof __VLS_components.vCheckbox, typeof __VLS_components.VCheckbox, typeof __VLS_components.vCheckbox, ]} */ ;
// @ts-ignore
const __VLS_62 = __VLS_asFunctionalComponent(__VLS_61, new __VLS_61({
    ...{ 'onUpdate:modelValue': {} },
    label: "CONTENT",
    modelValue: (__VLS_ctx.product?.contentChecked),
    hideDetails: true,
}));
const __VLS_63 = __VLS_62({
    ...{ 'onUpdate:modelValue': {} },
    label: "CONTENT",
    modelValue: (__VLS_ctx.product?.contentChecked),
    hideDetails: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_62));
let __VLS_65;
let __VLS_66;
let __VLS_67;
const __VLS_68 = {
    'onUpdate:modelValue': ((value) => __VLS_ctx.updateProduct('contentChecked', value))
};
var __VLS_64;
const __VLS_69 = {}.VCheckbox;
/** @type {[typeof __VLS_components.VCheckbox, typeof __VLS_components.vCheckbox, typeof __VLS_components.VCheckbox, typeof __VLS_components.vCheckbox, ]} */ ;
// @ts-ignore
const __VLS_70 = __VLS_asFunctionalComponent(__VLS_69, new __VLS_69({
    ...{ 'onUpdate:modelValue': {} },
    label: "COMPONENT TYPE",
    modelValue: (__VLS_ctx.product?.componentChecked),
    hideDetails: true,
}));
const __VLS_71 = __VLS_70({
    ...{ 'onUpdate:modelValue': {} },
    label: "COMPONENT TYPE",
    modelValue: (__VLS_ctx.product?.componentChecked),
    hideDetails: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_70));
let __VLS_73;
let __VLS_74;
let __VLS_75;
const __VLS_76 = {
    'onUpdate:modelValue': ((value) => __VLS_ctx.updateProduct('componentChecked', value))
};
var __VLS_72;
var __VLS_60;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "mt-3" },
});
if (__VLS_ctx.product) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "text-white" },
    });
    const __VLS_77 = {}.VRow;
    /** @type {[typeof __VLS_components.VRow, typeof __VLS_components.vRow, typeof __VLS_components.VRow, typeof __VLS_components.vRow, ]} */ ;
    // @ts-ignore
    const __VLS_78 = __VLS_asFunctionalComponent(__VLS_77, new __VLS_77({}));
    const __VLS_79 = __VLS_78({}, ...__VLS_functionalComponentArgsRest(__VLS_78));
    __VLS_80.slots.default;
    const __VLS_81 = {}.VCol;
    /** @type {[typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ]} */ ;
    // @ts-ignore
    const __VLS_82 = __VLS_asFunctionalComponent(__VLS_81, new __VLS_81({
        cols: "12",
        md: "3",
    }));
    const __VLS_83 = __VLS_82({
        cols: "12",
        md: "3",
    }, ...__VLS_functionalComponentArgsRest(__VLS_82));
    __VLS_84.slots.default;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
        ...{ class: "text-subtitle-2 font-weight-bold" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
        ...{ class: "text-body-2" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
        ...{ class: "text-body-2" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
        ...{ class: "text-body-2" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
        ...{ class: "text-body-2" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
        ...{ class: "text-body-2" },
    });
    var __VLS_84;
    const __VLS_85 = {}.VCol;
    /** @type {[typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ]} */ ;
    // @ts-ignore
    const __VLS_86 = __VLS_asFunctionalComponent(__VLS_85, new __VLS_85({
        cols: "12",
        md: "3",
    }));
    const __VLS_87 = __VLS_86({
        cols: "12",
        md: "3",
    }, ...__VLS_functionalComponentArgsRest(__VLS_86));
    __VLS_88.slots.default;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
        ...{ class: "text-subtitle-2 font-weight-bold" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
        ...{ class: "text-body-2" },
    });
    var __VLS_88;
    const __VLS_89 = {}.VCol;
    /** @type {[typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ]} */ ;
    // @ts-ignore
    const __VLS_90 = __VLS_asFunctionalComponent(__VLS_89, new __VLS_89({
        cols: "12",
        md: "3",
    }));
    const __VLS_91 = __VLS_90({
        cols: "12",
        md: "3",
    }, ...__VLS_functionalComponentArgsRest(__VLS_90));
    __VLS_92.slots.default;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
        ...{ class: "text-subtitle-2 font-weight-bold" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
        ...{ class: "text-body-2" },
    });
    var __VLS_92;
    const __VLS_93 = {}.VCol;
    /** @type {[typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ]} */ ;
    // @ts-ignore
    const __VLS_94 = __VLS_asFunctionalComponent(__VLS_93, new __VLS_93({
        cols: "12",
        md: "3",
    }));
    const __VLS_95 = __VLS_94({
        cols: "12",
        md: "3",
    }, ...__VLS_functionalComponentArgsRest(__VLS_94));
    __VLS_96.slots.default;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
        ...{ class: "text-subtitle-2 font-weight-bold" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
        ...{ class: "text-body-2" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
        ...{ class: "text-body-2" },
    });
    var __VLS_96;
    var __VLS_80;
    const __VLS_97 = {}.VRow;
    /** @type {[typeof __VLS_components.VRow, typeof __VLS_components.vRow, typeof __VLS_components.VRow, typeof __VLS_components.vRow, ]} */ ;
    // @ts-ignore
    const __VLS_98 = __VLS_asFunctionalComponent(__VLS_97, new __VLS_97({}));
    const __VLS_99 = __VLS_98({}, ...__VLS_functionalComponentArgsRest(__VLS_98));
    __VLS_100.slots.default;
    const __VLS_101 = {}.VCol;
    /** @type {[typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ]} */ ;
    // @ts-ignore
    const __VLS_102 = __VLS_asFunctionalComponent(__VLS_101, new __VLS_101({
        cols: "12",
        md: "3",
    }));
    const __VLS_103 = __VLS_102({
        cols: "12",
        md: "3",
    }, ...__VLS_functionalComponentArgsRest(__VLS_102));
    __VLS_104.slots.default;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
        ...{ class: "text-subtitle-2 font-weight-bold" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
        ...{ class: "text-body-2" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
        ...{ class: "text-body-2" },
    });
    var __VLS_104;
    const __VLS_105 = {}.VCol;
    /** @type {[typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ]} */ ;
    // @ts-ignore
    const __VLS_106 = __VLS_asFunctionalComponent(__VLS_105, new __VLS_105({
        cols: "12",
        md: "12",
    }));
    const __VLS_107 = __VLS_106({
        cols: "12",
        md: "12",
    }, ...__VLS_functionalComponentArgsRest(__VLS_106));
    __VLS_108.slots.default;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
        ...{ class: "text-subtitle-2 font-weight-bold" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
        ...{ class: "text-body-2" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
        ...{ class: "text-body-2" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
        ...{ class: "text-body-2" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
        ...{ class: "text-body-2" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
        ...{ class: "text-body-2" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
        ...{ class: "text-body-2" },
    });
    var __VLS_108;
    var __VLS_100;
}
const __VLS_109 = {}.VCardActions;
/** @type {[typeof __VLS_components.VCardActions, typeof __VLS_components.vCardActions, typeof __VLS_components.VCardActions, typeof __VLS_components.vCardActions, ]} */ ;
// @ts-ignore
const __VLS_110 = __VLS_asFunctionalComponent(__VLS_109, new __VLS_109({
    ...{ class: "justify-end pa-3" },
}));
const __VLS_111 = __VLS_110({
    ...{ class: "justify-end pa-3" },
}, ...__VLS_functionalComponentArgsRest(__VLS_110));
__VLS_112.slots.default;
const __VLS_113 = {}.VBtn;
/** @type {[typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ]} */ ;
// @ts-ignore
const __VLS_114 = __VLS_asFunctionalComponent(__VLS_113, new __VLS_113({
    ...{ 'onClick': {} },
    color: "red",
    text: true,
    ...{ class: "text-white" },
}));
const __VLS_115 = __VLS_114({
    ...{ 'onClick': {} },
    color: "red",
    text: true,
    ...{ class: "text-white" },
}, ...__VLS_functionalComponentArgsRest(__VLS_114));
let __VLS_117;
let __VLS_118;
let __VLS_119;
const __VLS_120 = {
    onClick: (...[$event]) => {
        __VLS_ctx.$emit('update:dialogVisible', false);
    }
};
__VLS_116.slots.default;
var __VLS_116;
var __VLS_112;
var __VLS_52;
var __VLS_48;
var __VLS_44;
var __VLS_16;
var __VLS_12;
var __VLS_3;
/** @type {__VLS_StyleScopedClasses['pa-0']} */ ;
/** @type {__VLS_StyleScopedClasses['ma-0']} */ ;
/** @type {__VLS_StyleScopedClasses['pa-0']} */ ;
/** @type {__VLS_StyleScopedClasses['d-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-column']} */ ;
/** @type {__VLS_StyleScopedClasses['align-center']} */ ;
/** @type {__VLS_StyleScopedClasses['pa-4']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['w-100']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-1']} */ ;
/** @type {__VLS_StyleScopedClasses['pa-0']} */ ;
/** @type {__VLS_StyleScopedClasses['position-relative']} */ ;
/** @type {__VLS_StyleScopedClasses['opacity-80']} */ ;
/** @type {__VLS_StyleScopedClasses['fill-height']} */ ;
/** @type {__VLS_StyleScopedClasses['text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['pa-4']} */ ;
/** @type {__VLS_StyleScopedClasses['text-h5']} */ ;
/** @type {__VLS_StyleScopedClasses['font-weight-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['d-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['align-center']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-3']} */ ;
/** @type {__VLS_StyleScopedClasses['text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['text-subtitle-2']} */ ;
/** @type {__VLS_StyleScopedClasses['font-weight-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-body-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-body-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-body-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-body-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-body-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-subtitle-2']} */ ;
/** @type {__VLS_StyleScopedClasses['font-weight-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-body-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-subtitle-2']} */ ;
/** @type {__VLS_StyleScopedClasses['font-weight-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-body-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-subtitle-2']} */ ;
/** @type {__VLS_StyleScopedClasses['font-weight-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-body-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-body-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-subtitle-2']} */ ;
/** @type {__VLS_StyleScopedClasses['font-weight-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-body-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-body-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-subtitle-2']} */ ;
/** @type {__VLS_StyleScopedClasses['font-weight-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-body-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-body-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-body-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-body-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-body-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-body-2']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-end']} */ ;
/** @type {__VLS_StyleScopedClasses['pa-3']} */ ;
/** @type {__VLS_StyleScopedClasses['text-white']} */ ;
var __VLS_dollars;
let __VLS_self;
