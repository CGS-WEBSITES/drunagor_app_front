/// <reference types="../../../node_modules/.vue-global-types/vue_3.5_false.d.ts" />
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
; /* PartiallyEnd: #3632/script.vue */
function __VLS_template() {
    const __VLS_ctx = {};
    let __VLS_components;
    let __VLS_directives;
    const __VLS_0 = {}.VDialog;
    /** @type { [typeof __VLS_components.VDialog, typeof __VLS_components.vDialog, typeof __VLS_components.VDialog, typeof __VLS_components.vDialog, ] } */ ;
    // @ts-ignore
    const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
        ...{ 'onUpdate:modelValue': {} },
        modelValue: ((__VLS_ctx.dialogVisible)),
        maxWidth: ("900px"),
    }));
    const __VLS_2 = __VLS_1({
        ...{ 'onUpdate:modelValue': {} },
        modelValue: ((__VLS_ctx.dialogVisible)),
        maxWidth: ("900px"),
    }, ...__VLS_functionalComponentArgsRest(__VLS_1));
    var __VLS_6 = {};
    let __VLS_7;
    const __VLS_8 = {
        'onUpdate:modelValue': (...[$event]) => {
            __VLS_ctx.$emit('update:dialogVisible', $event);
        }
    };
    let __VLS_3;
    let __VLS_4;
    const __VLS_9 = {}.VCard;
    /** @type { [typeof __VLS_components.VCard, typeof __VLS_components.vCard, typeof __VLS_components.VCard, typeof __VLS_components.vCard, ] } */ ;
    // @ts-ignore
    const __VLS_10 = __VLS_asFunctionalComponent(__VLS_9, new __VLS_9({
        ...{ class: ("pa-0") },
        color: ("#0F7273"),
    }));
    const __VLS_11 = __VLS_10({
        ...{ class: ("pa-0") },
        color: ("#0F7273"),
    }, ...__VLS_functionalComponentArgsRest(__VLS_10));
    const __VLS_15 = {}.VRow;
    /** @type { [typeof __VLS_components.VRow, typeof __VLS_components.vRow, typeof __VLS_components.VRow, typeof __VLS_components.vRow, ] } */ ;
    // @ts-ignore
    const __VLS_16 = __VLS_asFunctionalComponent(__VLS_15, new __VLS_15({
        ...{ class: ("ma-0 pa-0") },
    }));
    const __VLS_17 = __VLS_16({
        ...{ class: ("ma-0 pa-0") },
    }, ...__VLS_functionalComponentArgsRest(__VLS_16));
    const __VLS_21 = {}.VCol;
    /** @type { [typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ] } */ ;
    // @ts-ignore
    const __VLS_22 = __VLS_asFunctionalComponent(__VLS_21, new __VLS_21({
        cols: ("12"),
        md: ("4"),
        ...{ class: ("d-flex flex-column align-center pa-4") },
    }));
    const __VLS_23 = __VLS_22({
        cols: ("12"),
        md: ("4"),
        ...{ class: ("d-flex flex-column align-center pa-4") },
    }, ...__VLS_functionalComponentArgsRest(__VLS_22));
    const __VLS_27 = {}.VImg;
    /** @type { [typeof __VLS_components.VImg, typeof __VLS_components.vImg, typeof __VLS_components.VImg, typeof __VLS_components.vImg, ] } */ ;
    // @ts-ignore
    const __VLS_28 = __VLS_asFunctionalComponent(__VLS_27, new __VLS_27({
        src: ((__VLS_ctx.product?.image || '@/assets/apoc.png')),
        ...{ class: ("rounded mb-4") },
        height: ("240px"),
        width: ("auto"),
        alt: ("Product Image"),
    }));
    const __VLS_29 = __VLS_28({
        src: ((__VLS_ctx.product?.image || '@/assets/apoc.png')),
        ...{ class: ("rounded mb-4") },
        height: ("240px"),
        width: ("auto"),
        alt: ("Product Image"),
    }, ...__VLS_functionalComponentArgsRest(__VLS_28));
    __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: ("w-100") },
    });
    const __VLS_33 = {}.VBtn;
    /** @type { [typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ] } */ ;
    // @ts-ignore
    const __VLS_34 = __VLS_asFunctionalComponent(__VLS_33, new __VLS_33({
        prependIcon: ("mdi mdi-star-check"),
        color: ("#B89816"),
        ...{ class: ("mb-1") },
        block: (true),
    }));
    const __VLS_35 = __VLS_34({
        prependIcon: ("mdi mdi-star-check"),
        color: ("#B89816"),
        ...{ class: ("mb-1") },
        block: (true),
    }, ...__VLS_functionalComponentArgsRest(__VLS_34));
    __VLS_38.slots.default;
    var __VLS_38;
    const __VLS_39 = {}.VBtn;
    /** @type { [typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ] } */ ;
    // @ts-ignore
    const __VLS_40 = __VLS_asFunctionalComponent(__VLS_39, new __VLS_39({
        prependIcon: ("mdi mdi-plus-circle"),
        color: ("#139394"),
        block: (true),
    }));
    const __VLS_41 = __VLS_40({
        prependIcon: ("mdi mdi-plus-circle"),
        color: ("#139394"),
        block: (true),
    }, ...__VLS_functionalComponentArgsRest(__VLS_40));
    __VLS_44.slots.default;
    var __VLS_44;
    const __VLS_45 = {}.VSpacer;
    /** @type { [typeof __VLS_components.VSpacer, typeof __VLS_components.vSpacer, typeof __VLS_components.VSpacer, typeof __VLS_components.vSpacer, ] } */ ;
    // @ts-ignore
    const __VLS_46 = __VLS_asFunctionalComponent(__VLS_45, new __VLS_45({}));
    const __VLS_47 = __VLS_46({}, ...__VLS_functionalComponentArgsRest(__VLS_46));
    const __VLS_51 = {}.VBtn;
    /** @type { [typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ] } */ ;
    // @ts-ignore
    const __VLS_52 = __VLS_asFunctionalComponent(__VLS_51, new __VLS_51({
        prependIcon: ("mdi mdi-file-download-outline"),
        color: ("#312F2F"),
        block: (true),
        maxHeight: ("50px"),
        density: ("compact"),
    }));
    const __VLS_53 = __VLS_52({
        prependIcon: ("mdi mdi-file-download-outline"),
        color: ("#312F2F"),
        block: (true),
        maxHeight: ("50px"),
        density: ("compact"),
    }, ...__VLS_functionalComponentArgsRest(__VLS_52));
    __VLS_56.slots.default;
    var __VLS_56;
    __VLS_26.slots.default;
    var __VLS_26;
    const __VLS_57 = {}.VCol;
    /** @type { [typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ] } */ ;
    // @ts-ignore
    const __VLS_58 = __VLS_asFunctionalComponent(__VLS_57, new __VLS_57({
        cols: ("12"),
        md: ("8"),
        ...{ class: ("pa-0 position-relative") },
    }));
    const __VLS_59 = __VLS_58({
        cols: ("12"),
        md: ("8"),
        ...{ class: ("pa-0 position-relative") },
    }, ...__VLS_functionalComponentArgsRest(__VLS_58));
    const __VLS_63 = {}.VImg;
    /** @type { [typeof __VLS_components.VImg, typeof __VLS_components.vImg, typeof __VLS_components.VImg, typeof __VLS_components.vImg, ] } */ ;
    // @ts-ignore
    const __VLS_64 = __VLS_asFunctionalComponent(__VLS_63, new __VLS_63({
        src: ("@/assets/Apocalypse_Cover.png"),
        cover: (true),
        height: ("100%"),
        width: ("100%"),
        ...{ class: ("opacity-80 fill-height") },
    }));
    const __VLS_65 = __VLS_64({
        src: ("@/assets/Apocalypse_Cover.png"),
        cover: (true),
        height: ("100%"),
        width: ("100%"),
        ...{ class: ("opacity-80 fill-height") },
    }, ...__VLS_functionalComponentArgsRest(__VLS_64));
    const __VLS_69 = {}.VContainer;
    /** @type { [typeof __VLS_components.VContainer, typeof __VLS_components.vContainer, typeof __VLS_components.VContainer, typeof __VLS_components.vContainer, ] } */ ;
    // @ts-ignore
    const __VLS_70 = __VLS_asFunctionalComponent(__VLS_69, new __VLS_69({
        ...{ class: ("text-white pa-4") },
        fluid: (true),
    }));
    const __VLS_71 = __VLS_70({
        ...{ class: ("text-white pa-4") },
        fluid: (true),
    }, ...__VLS_functionalComponentArgsRest(__VLS_70));
    const __VLS_75 = {}.VCardTitle;
    /** @type { [typeof __VLS_components.VCardTitle, typeof __VLS_components.vCardTitle, typeof __VLS_components.VCardTitle, typeof __VLS_components.vCardTitle, ] } */ ;
    // @ts-ignore
    const __VLS_76 = __VLS_asFunctionalComponent(__VLS_75, new __VLS_75({
        ...{ class: ("text-h5 font-weight-bold") },
    }));
    const __VLS_77 = __VLS_76({
        ...{ class: ("text-h5 font-weight-bold") },
    }, ...__VLS_functionalComponentArgsRest(__VLS_76));
    (__VLS_ctx.product?.name || "No Product Selected");
    __VLS_80.slots.default;
    var __VLS_80;
    const __VLS_81 = {}.VCardSubtitle;
    /** @type { [typeof __VLS_components.VCardSubtitle, typeof __VLS_components.vCardSubtitle, typeof __VLS_components.VCardSubtitle, typeof __VLS_components.vCardSubtitle, ] } */ ;
    // @ts-ignore
    const __VLS_82 = __VLS_asFunctionalComponent(__VLS_81, new __VLS_81({
        ...{ class: ("d-flex align-center") },
    }));
    const __VLS_83 = __VLS_82({
        ...{ class: ("d-flex align-center") },
    }, ...__VLS_functionalComponentArgsRest(__VLS_82));
    const __VLS_87 = {}.VCheckbox;
    /** @type { [typeof __VLS_components.VCheckbox, typeof __VLS_components.vCheckbox, typeof __VLS_components.VCheckbox, typeof __VLS_components.vCheckbox, ] } */ ;
    // @ts-ignore
    const __VLS_88 = __VLS_asFunctionalComponent(__VLS_87, new __VLS_87({
        ...{ 'onUpdate:modelValue': {} },
        label: ("CONTENT"),
        modelValue: ((__VLS_ctx.product?.contentChecked)),
        hideDetails: (true),
    }));
    const __VLS_89 = __VLS_88({
        ...{ 'onUpdate:modelValue': {} },
        label: ("CONTENT"),
        modelValue: ((__VLS_ctx.product?.contentChecked)),
        hideDetails: (true),
    }, ...__VLS_functionalComponentArgsRest(__VLS_88));
    let __VLS_93;
    const __VLS_94 = {
        'onUpdate:modelValue': ((value) => __VLS_ctx.updateProduct('contentChecked', value))
    };
    let __VLS_90;
    let __VLS_91;
    var __VLS_92;
    const __VLS_95 = {}.VCheckbox;
    /** @type { [typeof __VLS_components.VCheckbox, typeof __VLS_components.vCheckbox, typeof __VLS_components.VCheckbox, typeof __VLS_components.vCheckbox, ] } */ ;
    // @ts-ignore
    const __VLS_96 = __VLS_asFunctionalComponent(__VLS_95, new __VLS_95({
        ...{ 'onUpdate:modelValue': {} },
        label: ("COMPONENT TYPE"),
        modelValue: ((__VLS_ctx.product?.componentChecked)),
        hideDetails: (true),
    }));
    const __VLS_97 = __VLS_96({
        ...{ 'onUpdate:modelValue': {} },
        label: ("COMPONENT TYPE"),
        modelValue: ((__VLS_ctx.product?.componentChecked)),
        hideDetails: (true),
    }, ...__VLS_functionalComponentArgsRest(__VLS_96));
    let __VLS_101;
    const __VLS_102 = {
        'onUpdate:modelValue': ((value) => __VLS_ctx.updateProduct('componentChecked', value))
    };
    let __VLS_98;
    let __VLS_99;
    var __VLS_100;
    __VLS_86.slots.default;
    var __VLS_86;
    __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: ("mt-3") },
    });
    if (__VLS_ctx.product) {
        __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: ("text-white") },
        });
        const __VLS_103 = {}.VRow;
        /** @type { [typeof __VLS_components.VRow, typeof __VLS_components.vRow, typeof __VLS_components.VRow, typeof __VLS_components.vRow, ] } */ ;
        // @ts-ignore
        const __VLS_104 = __VLS_asFunctionalComponent(__VLS_103, new __VLS_103({}));
        const __VLS_105 = __VLS_104({}, ...__VLS_functionalComponentArgsRest(__VLS_104));
        const __VLS_109 = {}.VCol;
        /** @type { [typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ] } */ ;
        // @ts-ignore
        const __VLS_110 = __VLS_asFunctionalComponent(__VLS_109, new __VLS_109({
            cols: ("12"),
            md: ("3"),
        }));
        const __VLS_111 = __VLS_110({
            cols: ("12"),
            md: ("3"),
        }, ...__VLS_functionalComponentArgsRest(__VLS_110));
        __VLS_elementAsFunction(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
            ...{ class: ("text-subtitle-2 font-weight-bold") },
        });
        __VLS_elementAsFunction(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
            ...{ class: ("text-body-2") },
        });
        __VLS_elementAsFunction(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
            ...{ class: ("text-body-2") },
        });
        __VLS_elementAsFunction(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
            ...{ class: ("text-body-2") },
        });
        __VLS_elementAsFunction(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
            ...{ class: ("text-body-2") },
        });
        __VLS_elementAsFunction(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
            ...{ class: ("text-body-2") },
        });
        __VLS_114.slots.default;
        var __VLS_114;
        const __VLS_115 = {}.VCol;
        /** @type { [typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ] } */ ;
        // @ts-ignore
        const __VLS_116 = __VLS_asFunctionalComponent(__VLS_115, new __VLS_115({
            cols: ("12"),
            md: ("3"),
        }));
        const __VLS_117 = __VLS_116({
            cols: ("12"),
            md: ("3"),
        }, ...__VLS_functionalComponentArgsRest(__VLS_116));
        __VLS_elementAsFunction(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
            ...{ class: ("text-subtitle-2 font-weight-bold") },
        });
        __VLS_elementAsFunction(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
            ...{ class: ("text-body-2") },
        });
        __VLS_120.slots.default;
        var __VLS_120;
        const __VLS_121 = {}.VCol;
        /** @type { [typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ] } */ ;
        // @ts-ignore
        const __VLS_122 = __VLS_asFunctionalComponent(__VLS_121, new __VLS_121({
            cols: ("12"),
            md: ("3"),
        }));
        const __VLS_123 = __VLS_122({
            cols: ("12"),
            md: ("3"),
        }, ...__VLS_functionalComponentArgsRest(__VLS_122));
        __VLS_elementAsFunction(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
            ...{ class: ("text-subtitle-2 font-weight-bold") },
        });
        __VLS_elementAsFunction(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
            ...{ class: ("text-body-2") },
        });
        __VLS_126.slots.default;
        var __VLS_126;
        const __VLS_127 = {}.VCol;
        /** @type { [typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ] } */ ;
        // @ts-ignore
        const __VLS_128 = __VLS_asFunctionalComponent(__VLS_127, new __VLS_127({
            cols: ("12"),
            md: ("3"),
        }));
        const __VLS_129 = __VLS_128({
            cols: ("12"),
            md: ("3"),
        }, ...__VLS_functionalComponentArgsRest(__VLS_128));
        __VLS_elementAsFunction(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
            ...{ class: ("text-subtitle-2 font-weight-bold") },
        });
        __VLS_elementAsFunction(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
            ...{ class: ("text-body-2") },
        });
        __VLS_elementAsFunction(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
            ...{ class: ("text-body-2") },
        });
        __VLS_132.slots.default;
        var __VLS_132;
        __VLS_108.slots.default;
        var __VLS_108;
        const __VLS_133 = {}.VRow;
        /** @type { [typeof __VLS_components.VRow, typeof __VLS_components.vRow, typeof __VLS_components.VRow, typeof __VLS_components.vRow, ] } */ ;
        // @ts-ignore
        const __VLS_134 = __VLS_asFunctionalComponent(__VLS_133, new __VLS_133({}));
        const __VLS_135 = __VLS_134({}, ...__VLS_functionalComponentArgsRest(__VLS_134));
        const __VLS_139 = {}.VCol;
        /** @type { [typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ] } */ ;
        // @ts-ignore
        const __VLS_140 = __VLS_asFunctionalComponent(__VLS_139, new __VLS_139({
            cols: ("12"),
            md: ("3"),
        }));
        const __VLS_141 = __VLS_140({
            cols: ("12"),
            md: ("3"),
        }, ...__VLS_functionalComponentArgsRest(__VLS_140));
        __VLS_elementAsFunction(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
            ...{ class: ("text-subtitle-2 font-weight-bold") },
        });
        __VLS_elementAsFunction(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
            ...{ class: ("text-body-2") },
        });
        __VLS_elementAsFunction(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
            ...{ class: ("text-body-2") },
        });
        __VLS_144.slots.default;
        var __VLS_144;
        const __VLS_145 = {}.VCol;
        /** @type { [typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ] } */ ;
        // @ts-ignore
        const __VLS_146 = __VLS_asFunctionalComponent(__VLS_145, new __VLS_145({
            cols: ("12"),
            md: ("12"),
        }));
        const __VLS_147 = __VLS_146({
            cols: ("12"),
            md: ("12"),
        }, ...__VLS_functionalComponentArgsRest(__VLS_146));
        __VLS_elementAsFunction(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
            ...{ class: ("text-subtitle-2 font-weight-bold") },
        });
        __VLS_elementAsFunction(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
            ...{ class: ("text-body-2") },
        });
        __VLS_elementAsFunction(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
            ...{ class: ("text-body-2") },
        });
        __VLS_elementAsFunction(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
            ...{ class: ("text-body-2") },
        });
        __VLS_elementAsFunction(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
            ...{ class: ("text-body-2") },
        });
        __VLS_elementAsFunction(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
            ...{ class: ("text-body-2") },
        });
        __VLS_elementAsFunction(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
            ...{ class: ("text-body-2") },
        });
        __VLS_150.slots.default;
        var __VLS_150;
        __VLS_138.slots.default;
        var __VLS_138;
    }
    const __VLS_151 = {}.VCardActions;
    /** @type { [typeof __VLS_components.VCardActions, typeof __VLS_components.vCardActions, typeof __VLS_components.VCardActions, typeof __VLS_components.vCardActions, ] } */ ;
    // @ts-ignore
    const __VLS_152 = __VLS_asFunctionalComponent(__VLS_151, new __VLS_151({
        ...{ class: ("justify-end pa-3") },
    }));
    const __VLS_153 = __VLS_152({
        ...{ class: ("justify-end pa-3") },
    }, ...__VLS_functionalComponentArgsRest(__VLS_152));
    const __VLS_157 = {}.VBtn;
    /** @type { [typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ] } */ ;
    // @ts-ignore
    const __VLS_158 = __VLS_asFunctionalComponent(__VLS_157, new __VLS_157({
        ...{ 'onClick': {} },
        color: ("red"),
        text: (true),
        ...{ class: ("text-white") },
    }));
    const __VLS_159 = __VLS_158({
        ...{ 'onClick': {} },
        color: ("red"),
        text: (true),
        ...{ class: ("text-white") },
    }, ...__VLS_functionalComponentArgsRest(__VLS_158));
    let __VLS_163;
    const __VLS_164 = {
        onClick: (...[$event]) => {
            __VLS_ctx.$emit('update:dialogVisible', false);
        }
    };
    let __VLS_160;
    let __VLS_161;
    __VLS_162.slots.default;
    var __VLS_162;
    __VLS_156.slots.default;
    var __VLS_156;
    __VLS_74.slots.default;
    var __VLS_74;
    __VLS_68.slots.default;
    var __VLS_68;
    __VLS_62.slots.default;
    var __VLS_62;
    __VLS_20.slots.default;
    var __VLS_20;
    __VLS_14.slots.default;
    var __VLS_14;
    __VLS_5.slots.default;
    var __VLS_5;
    ['pa-0', 'ma-0', 'pa-0', 'd-flex', 'flex-column', 'align-center', 'pa-4', 'rounded', 'mb-4', 'w-100', 'mb-1', 'pa-0', 'position-relative', 'opacity-80', 'fill-height', 'text-white', 'pa-4', 'text-h5', 'font-weight-bold', 'd-flex', 'align-center', 'mt-3', 'text-white', 'text-subtitle-2', 'font-weight-bold', 'text-body-2', 'text-body-2', 'text-body-2', 'text-body-2', 'text-body-2', 'text-subtitle-2', 'font-weight-bold', 'text-body-2', 'text-subtitle-2', 'font-weight-bold', 'text-body-2', 'text-subtitle-2', 'font-weight-bold', 'text-body-2', 'text-body-2', 'text-subtitle-2', 'font-weight-bold', 'text-body-2', 'text-body-2', 'text-subtitle-2', 'font-weight-bold', 'text-body-2', 'text-body-2', 'text-body-2', 'text-body-2', 'text-body-2', 'text-body-2', 'justify-end', 'pa-3', 'text-white',];
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
