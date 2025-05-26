/// <reference types="../../../node_modules/.vue-global-types/vue_3.5_false.d.ts" />
export default (await import('vue')).defineComponent({
    props: {
        dialogVisible: Boolean,
        product: Object,
    },
    emits: ["update:dialogVisible"],
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
    const __VLS_21 = {}.VBtn;
    /** @type { [typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ] } */ ;
    // @ts-ignore
    const __VLS_22 = __VLS_asFunctionalComponent(__VLS_21, new __VLS_21({
        ...{ 'onClick': {} },
        icon: (true),
        ...{ class: ("position-absolute") },
        ...{ style: ({}) },
    }));
    const __VLS_23 = __VLS_22({
        ...{ 'onClick': {} },
        icon: (true),
        ...{ class: ("position-absolute") },
        ...{ style: ({}) },
    }, ...__VLS_functionalComponentArgsRest(__VLS_22));
    let __VLS_27;
    const __VLS_28 = {
        onClick: (...[$event]) => {
            __VLS_ctx.$emit('update:dialogVisible', false);
        }
    };
    let __VLS_24;
    let __VLS_25;
    const __VLS_29 = {}.VIcon;
    /** @type { [typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, ] } */ ;
    // @ts-ignore
    const __VLS_30 = __VLS_asFunctionalComponent(__VLS_29, new __VLS_29({}));
    const __VLS_31 = __VLS_30({}, ...__VLS_functionalComponentArgsRest(__VLS_30));
    __VLS_34.slots.default;
    var __VLS_34;
    __VLS_26.slots.default;
    var __VLS_26;
    const __VLS_35 = {}.VCol;
    /** @type { [typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ] } */ ;
    // @ts-ignore
    const __VLS_36 = __VLS_asFunctionalComponent(__VLS_35, new __VLS_35({
        cols: ("12"),
        md: ("4"),
        ...{ class: ("d-flex flex-column align-center pa-4") },
    }));
    const __VLS_37 = __VLS_36({
        cols: ("12"),
        md: ("4"),
        ...{ class: ("d-flex flex-column align-center pa-4") },
    }, ...__VLS_functionalComponentArgsRest(__VLS_36));
    const __VLS_41 = {}.VImg;
    /** @type { [typeof __VLS_components.VImg, typeof __VLS_components.vImg, typeof __VLS_components.VImg, typeof __VLS_components.vImg, ] } */ ;
    // @ts-ignore
    const __VLS_42 = __VLS_asFunctionalComponent(__VLS_41, new __VLS_41({
        src: ((__VLS_ctx.product.image || '@/assets/apoc.png')),
        ...{ class: ("rounded mb-4") },
        height: ("240px"),
        width: ("auto"),
        alt: ("Product Image"),
    }));
    const __VLS_43 = __VLS_42({
        src: ((__VLS_ctx.product.image || '@/assets/apoc.png')),
        ...{ class: ("rounded mb-4") },
        height: ("240px"),
        width: ("auto"),
        alt: ("Product Image"),
    }, ...__VLS_functionalComponentArgsRest(__VLS_42));
    __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: ("w-100") },
    });
    const __VLS_47 = {}.VBtn;
    /** @type { [typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ] } */ ;
    // @ts-ignore
    const __VLS_48 = __VLS_asFunctionalComponent(__VLS_47, new __VLS_47({
        prependIcon: ("mdi mdi-star-check"),
        color: ("#B89816"),
        ...{ class: ("mb-1") },
        block: (true),
    }));
    const __VLS_49 = __VLS_48({
        prependIcon: ("mdi mdi-star-check"),
        color: ("#B89816"),
        ...{ class: ("mb-1") },
        block: (true),
    }, ...__VLS_functionalComponentArgsRest(__VLS_48));
    __VLS_52.slots.default;
    var __VLS_52;
    const __VLS_53 = {}.VBtn;
    /** @type { [typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ] } */ ;
    // @ts-ignore
    const __VLS_54 = __VLS_asFunctionalComponent(__VLS_53, new __VLS_53({
        prependIcon: ("mdi mdi-plus-circle"),
        color: ("#139394"),
        block: (true),
    }));
    const __VLS_55 = __VLS_54({
        prependIcon: ("mdi mdi-plus-circle"),
        color: ("#139394"),
        block: (true),
    }, ...__VLS_functionalComponentArgsRest(__VLS_54));
    __VLS_58.slots.default;
    var __VLS_58;
    const __VLS_59 = {}.VSpacer;
    /** @type { [typeof __VLS_components.VSpacer, typeof __VLS_components.vSpacer, typeof __VLS_components.VSpacer, typeof __VLS_components.vSpacer, ] } */ ;
    // @ts-ignore
    const __VLS_60 = __VLS_asFunctionalComponent(__VLS_59, new __VLS_59({}));
    const __VLS_61 = __VLS_60({}, ...__VLS_functionalComponentArgsRest(__VLS_60));
    const __VLS_65 = {}.VBtn;
    /** @type { [typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ] } */ ;
    // @ts-ignore
    const __VLS_66 = __VLS_asFunctionalComponent(__VLS_65, new __VLS_65({
        prependIcon: ("mdi mdi-file-download-outline"),
        color: ("#312F2F"),
        block: (true),
        maxHeight: ("80px"),
        density: ("compact"),
    }));
    const __VLS_67 = __VLS_66({
        prependIcon: ("mdi mdi-file-download-outline"),
        color: ("#312F2F"),
        block: (true),
        maxHeight: ("80px"),
        density: ("compact"),
    }, ...__VLS_functionalComponentArgsRest(__VLS_66));
    __VLS_70.slots.default;
    var __VLS_70;
    __VLS_40.slots.default;
    var __VLS_40;
    const __VLS_71 = {}.VCol;
    /** @type { [typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ] } */ ;
    // @ts-ignore
    const __VLS_72 = __VLS_asFunctionalComponent(__VLS_71, new __VLS_71({
        cols: ("12"),
        md: ("8"),
        ...{ class: ("pa-0 position-relative") },
    }));
    const __VLS_73 = __VLS_72({
        cols: ("12"),
        md: ("8"),
        ...{ class: ("pa-0 position-relative") },
    }, ...__VLS_functionalComponentArgsRest(__VLS_72));
    const __VLS_77 = {}.VImg;
    /** @type { [typeof __VLS_components.VImg, typeof __VLS_components.vImg, typeof __VLS_components.VImg, typeof __VLS_components.vImg, ] } */ ;
    // @ts-ignore
    const __VLS_78 = __VLS_asFunctionalComponent(__VLS_77, new __VLS_77({
        src: ("@/assets/Apocalypse_Cover.png"),
        cover: (true),
        height: ("100%"),
        width: ("100%"),
        ...{ class: ("opacity-80 fill-height") },
    }));
    const __VLS_79 = __VLS_78({
        src: ("@/assets/Apocalypse_Cover.png"),
        cover: (true),
        height: ("100%"),
        width: ("100%"),
        ...{ class: ("opacity-80 fill-height") },
    }, ...__VLS_functionalComponentArgsRest(__VLS_78));
    const __VLS_83 = {}.VContainer;
    /** @type { [typeof __VLS_components.VContainer, typeof __VLS_components.vContainer, typeof __VLS_components.VContainer, typeof __VLS_components.vContainer, ] } */ ;
    // @ts-ignore
    const __VLS_84 = __VLS_asFunctionalComponent(__VLS_83, new __VLS_83({
        ...{ class: ("text-white pa-4") },
        fluid: (true),
    }));
    const __VLS_85 = __VLS_84({
        ...{ class: ("text-white pa-4") },
        fluid: (true),
    }, ...__VLS_functionalComponentArgsRest(__VLS_84));
    const __VLS_89 = {}.VCardTitle;
    /** @type { [typeof __VLS_components.VCardTitle, typeof __VLS_components.vCardTitle, typeof __VLS_components.VCardTitle, typeof __VLS_components.vCardTitle, ] } */ ;
    // @ts-ignore
    const __VLS_90 = __VLS_asFunctionalComponent(__VLS_89, new __VLS_89({
        ...{ class: ("text-h5 font-weight-bold") },
    }));
    const __VLS_91 = __VLS_90({
        ...{ class: ("text-h5 font-weight-bold") },
    }, ...__VLS_functionalComponentArgsRest(__VLS_90));
    (__VLS_ctx.product?.name);
    __VLS_94.slots.default;
    var __VLS_94;
    const __VLS_95 = {}.VCardSubtitle;
    /** @type { [typeof __VLS_components.VCardSubtitle, typeof __VLS_components.vCardSubtitle, typeof __VLS_components.VCardSubtitle, typeof __VLS_components.vCardSubtitle, ] } */ ;
    // @ts-ignore
    const __VLS_96 = __VLS_asFunctionalComponent(__VLS_95, new __VLS_95({
        ...{ class: ("d-flex align-center") },
    }));
    const __VLS_97 = __VLS_96({
        ...{ class: ("d-flex align-center") },
    }, ...__VLS_functionalComponentArgsRest(__VLS_96));
    const __VLS_101 = {}.VIcon;
    /** @type { [typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, ] } */ ;
    // @ts-ignore
    const __VLS_102 = __VLS_asFunctionalComponent(__VLS_101, new __VLS_101({
        ...{ class: ("me-2") },
    }));
    const __VLS_103 = __VLS_102({
        ...{ class: ("me-2") },
    }, ...__VLS_functionalComponentArgsRest(__VLS_102));
    __VLS_106.slots.default;
    var __VLS_106;
    __VLS_100.slots.default;
    var __VLS_100;
    const __VLS_107 = {}.VCardSubtitle;
    /** @type { [typeof __VLS_components.VCardSubtitle, typeof __VLS_components.vCardSubtitle, typeof __VLS_components.VCardSubtitle, typeof __VLS_components.vCardSubtitle, ] } */ ;
    // @ts-ignore
    const __VLS_108 = __VLS_asFunctionalComponent(__VLS_107, new __VLS_107({
        ...{ class: ("d-flex align-center") },
    }));
    const __VLS_109 = __VLS_108({
        ...{ class: ("d-flex align-center") },
    }, ...__VLS_functionalComponentArgsRest(__VLS_108));
    const __VLS_113 = {}.VIcon;
    /** @type { [typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, ] } */ ;
    // @ts-ignore
    const __VLS_114 = __VLS_asFunctionalComponent(__VLS_113, new __VLS_113({
        ...{ class: ("me-2") },
    }));
    const __VLS_115 = __VLS_114({
        ...{ class: ("me-2") },
    }, ...__VLS_functionalComponentArgsRest(__VLS_114));
    __VLS_118.slots.default;
    var __VLS_118;
    __VLS_112.slots.default;
    var __VLS_112;
    __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: ("mt-3") },
    });
    if (__VLS_ctx.product) {
        __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: ("text-white") },
        });
        const __VLS_119 = {}.VRow;
        /** @type { [typeof __VLS_components.VRow, typeof __VLS_components.vRow, typeof __VLS_components.VRow, typeof __VLS_components.vRow, ] } */ ;
        // @ts-ignore
        const __VLS_120 = __VLS_asFunctionalComponent(__VLS_119, new __VLS_119({}));
        const __VLS_121 = __VLS_120({}, ...__VLS_functionalComponentArgsRest(__VLS_120));
        const __VLS_125 = {}.VCol;
        /** @type { [typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ] } */ ;
        // @ts-ignore
        const __VLS_126 = __VLS_asFunctionalComponent(__VLS_125, new __VLS_125({
            cols: ("12"),
            md: ("10"),
        }));
        const __VLS_127 = __VLS_126({
            cols: ("12"),
            md: ("10"),
        }, ...__VLS_functionalComponentArgsRest(__VLS_126));
        __VLS_elementAsFunction(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
            ...{ class: ("text-subtitle-2 font-weight-bold") },
        });
        __VLS_130.slots.default;
        var __VLS_130;
        __VLS_124.slots.default;
        var __VLS_124;
    }
    __VLS_88.slots.default;
    var __VLS_88;
    __VLS_82.slots.default;
    var __VLS_82;
    __VLS_76.slots.default;
    var __VLS_76;
    __VLS_20.slots.default;
    var __VLS_20;
    __VLS_14.slots.default;
    var __VLS_14;
    __VLS_5.slots.default;
    var __VLS_5;
    ['pa-0', 'ma-0', 'pa-0', 'position-absolute', 'd-flex', 'flex-column', 'align-center', 'pa-4', 'rounded', 'mb-4', 'w-100', 'mb-1', 'pa-0', 'position-relative', 'opacity-80', 'fill-height', 'text-white', 'pa-4', 'text-h5', 'font-weight-bold', 'd-flex', 'align-center', 'me-2', 'd-flex', 'align-center', 'me-2', 'mt-3', 'text-white', 'text-subtitle-2', 'font-weight-bold',];
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
