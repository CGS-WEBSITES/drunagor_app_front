/// <reference types="../../node_modules/.vue-global-types/vue_3.5_false.d.ts" />
export default (await import('vue')).defineComponent({
    props: {
        filterStatus: String,
        rewardsStatus: String,
        selectedBox: String,
        selectedComponentType: String,
        selectedContent: String,
        nameFilter: String, // Adicionando a prop para o filtro de nome
        boxOptions: Array,
        contentOptions: Array,
        componentTypes: Array,
        nameOptions: Array, // Adicionando as opções para o filtro de nome
    },
    emits: [
        "update:filterStatus",
        "update:rewardsStatus",
        "update:selectedBox",
        "update:selectedComponentType",
        "update:selectedContent",
        "update:nameFilter", // Emitindo o evento de atualização para o nome
        "apply-filters",
    ],
});
; /* PartiallyEnd: #3632/script.vue */
function __VLS_template() {
    const __VLS_ctx = {};
    let __VLS_components;
    let __VLS_directives;
    const __VLS_0 = {}.VCard;
    /** @type { [typeof __VLS_components.VCard, typeof __VLS_components.vCard, typeof __VLS_components.VCard, typeof __VLS_components.vCard, ] } */ ;
    // @ts-ignore
    const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
        ...{ class: ("pa-4 h-100 d-flex flex-column justify-space-between") },
        color: ("#2A2A2A"),
    }));
    const __VLS_2 = __VLS_1({
        ...{ class: ("pa-4 h-100 d-flex flex-column justify-space-between") },
        color: ("#2A2A2A"),
    }, ...__VLS_functionalComponentArgsRest(__VLS_1));
    var __VLS_6 = {};
    __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
    const __VLS_7 = {}.VCardTitle;
    /** @type { [typeof __VLS_components.VCardTitle, typeof __VLS_components.vCardTitle, typeof __VLS_components.VCardTitle, typeof __VLS_components.vCardTitle, ] } */ ;
    // @ts-ignore
    const __VLS_8 = __VLS_asFunctionalComponent(__VLS_7, new __VLS_7({
        ...{ class: ("pa-0 mb-4 text-white") },
    }));
    const __VLS_9 = __VLS_8({
        ...{ class: ("pa-0 mb-4 text-white") },
    }, ...__VLS_functionalComponentArgsRest(__VLS_8));
    __VLS_12.slots.default;
    var __VLS_12;
    const __VLS_13 = {}.VCardText;
    /** @type { [typeof __VLS_components.VCardText, typeof __VLS_components.vCardText, typeof __VLS_components.VCardText, typeof __VLS_components.vCardText, ] } */ ;
    // @ts-ignore
    const __VLS_14 = __VLS_asFunctionalComponent(__VLS_13, new __VLS_13({
        ...{ class: ("pa-0") },
    }));
    const __VLS_15 = __VLS_14({
        ...{ class: ("pa-0") },
    }, ...__VLS_functionalComponentArgsRest(__VLS_14));
    const __VLS_19 = {}.VRow;
    /** @type { [typeof __VLS_components.VRow, typeof __VLS_components.vRow, typeof __VLS_components.VRow, typeof __VLS_components.vRow, ] } */ ;
    // @ts-ignore
    const __VLS_20 = __VLS_asFunctionalComponent(__VLS_19, new __VLS_19({
        ...{ class: ("mb-4") },
        dense: (true),
    }));
    const __VLS_21 = __VLS_20({
        ...{ class: ("mb-4") },
        dense: (true),
    }, ...__VLS_functionalComponentArgsRest(__VLS_20));
    const __VLS_25 = {}.VCol;
    /** @type { [typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ] } */ ;
    // @ts-ignore
    const __VLS_26 = __VLS_asFunctionalComponent(__VLS_25, new __VLS_25({
        cols: ("6"),
    }));
    const __VLS_27 = __VLS_26({
        cols: ("6"),
    }, ...__VLS_functionalComponentArgsRest(__VLS_26));
    const __VLS_31 = {}.VBtn;
    /** @type { [typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ] } */ ;
    // @ts-ignore
    const __VLS_32 = __VLS_asFunctionalComponent(__VLS_31, new __VLS_31({
        ...{ 'onClick': {} },
        block: (true),
        size: ("small"),
        rounded: ("lg"),
        color: ("#0E7576"),
        variant: ("flat"),
        ...{ class: ("text--sm") },
        ...{ style: (({ whiteSpace: 'normal' })) },
    }));
    const __VLS_33 = __VLS_32({
        ...{ 'onClick': {} },
        block: (true),
        size: ("small"),
        rounded: ("lg"),
        color: ("#0E7576"),
        variant: ("flat"),
        ...{ class: ("text--sm") },
        ...{ style: (({ whiteSpace: 'normal' })) },
    }, ...__VLS_functionalComponentArgsRest(__VLS_32));
    let __VLS_37;
    const __VLS_38 = {
        onClick: (...[$event]) => {
            __VLS_ctx.$emit('update:filterStatus', 'owned');
        }
    };
    let __VLS_34;
    let __VLS_35;
    __VLS_36.slots.default;
    var __VLS_36;
    __VLS_30.slots.default;
    var __VLS_30;
    const __VLS_39 = {}.VCol;
    /** @type { [typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ] } */ ;
    // @ts-ignore
    const __VLS_40 = __VLS_asFunctionalComponent(__VLS_39, new __VLS_39({
        cols: ("6"),
    }));
    const __VLS_41 = __VLS_40({
        cols: ("6"),
    }, ...__VLS_functionalComponentArgsRest(__VLS_40));
    const __VLS_45 = {}.VBtn;
    /** @type { [typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ] } */ ;
    // @ts-ignore
    const __VLS_46 = __VLS_asFunctionalComponent(__VLS_45, new __VLS_45({
        ...{ 'onClick': {} },
        block: (true),
        size: ("small"),
        rounded: ("lg"),
        color: ("#947A11"),
        variant: ("flat"),
        ...{ class: ("text--sm") },
        ...{ style: (({ whiteSpace: 'normal' })) },
    }));
    const __VLS_47 = __VLS_46({
        ...{ 'onClick': {} },
        block: (true),
        size: ("small"),
        rounded: ("lg"),
        color: ("#947A11"),
        variant: ("flat"),
        ...{ class: ("text--sm") },
        ...{ style: (({ whiteSpace: 'normal' })) },
    }, ...__VLS_functionalComponentArgsRest(__VLS_46));
    let __VLS_51;
    const __VLS_52 = {
        onClick: (...[$event]) => {
            __VLS_ctx.$emit('update:filterStatus', 'wishlist');
        }
    };
    let __VLS_48;
    let __VLS_49;
    __VLS_50.slots.default;
    var __VLS_50;
    __VLS_44.slots.default;
    var __VLS_44;
    __VLS_24.slots.default;
    var __VLS_24;
    const __VLS_53 = {}.VDivider;
    /** @type { [typeof __VLS_components.VDivider, typeof __VLS_components.vDivider, typeof __VLS_components.VDivider, typeof __VLS_components.vDivider, ] } */ ;
    // @ts-ignore
    const __VLS_54 = __VLS_asFunctionalComponent(__VLS_53, new __VLS_53({
        ...{ class: ("mb-4") },
    }));
    const __VLS_55 = __VLS_54({
        ...{ class: ("mb-4") },
    }, ...__VLS_functionalComponentArgsRest(__VLS_54));
    const __VLS_59 = {}.VCardSubtitle;
    /** @type { [typeof __VLS_components.VCardSubtitle, typeof __VLS_components.vCardSubtitle, typeof __VLS_components.VCardSubtitle, typeof __VLS_components.vCardSubtitle, ] } */ ;
    // @ts-ignore
    const __VLS_60 = __VLS_asFunctionalComponent(__VLS_59, new __VLS_59({
        ...{ class: ("pa-0 mb-2 text-white text-uppercase") },
    }));
    const __VLS_61 = __VLS_60({
        ...{ class: ("pa-0 mb-2 text-white text-uppercase") },
    }, ...__VLS_functionalComponentArgsRest(__VLS_60));
    __VLS_64.slots.default;
    var __VLS_64;
    const __VLS_65 = {}.VRow;
    /** @type { [typeof __VLS_components.VRow, typeof __VLS_components.vRow, typeof __VLS_components.VRow, typeof __VLS_components.vRow, ] } */ ;
    // @ts-ignore
    const __VLS_66 = __VLS_asFunctionalComponent(__VLS_65, new __VLS_65({
        ...{ class: ("mb-4") },
        dense: (true),
    }));
    const __VLS_67 = __VLS_66({
        ...{ class: ("mb-4") },
        dense: (true),
    }, ...__VLS_functionalComponentArgsRest(__VLS_66));
    const __VLS_71 = {}.VCol;
    /** @type { [typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ] } */ ;
    // @ts-ignore
    const __VLS_72 = __VLS_asFunctionalComponent(__VLS_71, new __VLS_71({
        cols: ("6"),
    }));
    const __VLS_73 = __VLS_72({
        cols: ("6"),
    }, ...__VLS_functionalComponentArgsRest(__VLS_72));
    const __VLS_77 = {}.VBtn;
    /** @type { [typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ] } */ ;
    // @ts-ignore
    const __VLS_78 = __VLS_asFunctionalComponent(__VLS_77, new __VLS_77({
        ...{ 'onClick': {} },
        block: (true),
        size: ("small"),
        rounded: ("lg"),
        color: ("#5D3C76"),
        variant: ("flat"),
        ...{ class: ("text--sm") },
        ...{ style: (({ whiteSpace: 'normal' })) },
    }));
    const __VLS_79 = __VLS_78({
        ...{ 'onClick': {} },
        block: (true),
        size: ("small"),
        rounded: ("lg"),
        color: ("#5D3C76"),
        variant: ("flat"),
        ...{ class: ("text--sm") },
        ...{ style: (({ whiteSpace: 'normal' })) },
    }, ...__VLS_functionalComponentArgsRest(__VLS_78));
    let __VLS_83;
    const __VLS_84 = {
        onClick: (...[$event]) => {
            __VLS_ctx.$emit('update:rewardsStatus', 'rewards_owned');
        }
    };
    let __VLS_80;
    let __VLS_81;
    __VLS_82.slots.default;
    var __VLS_82;
    __VLS_76.slots.default;
    var __VLS_76;
    const __VLS_85 = {}.VCol;
    /** @type { [typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ] } */ ;
    // @ts-ignore
    const __VLS_86 = __VLS_asFunctionalComponent(__VLS_85, new __VLS_85({
        cols: ("6"),
    }));
    const __VLS_87 = __VLS_86({
        cols: ("6"),
    }, ...__VLS_functionalComponentArgsRest(__VLS_86));
    const __VLS_91 = {}.VBtn;
    /** @type { [typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ] } */ ;
    // @ts-ignore
    const __VLS_92 = __VLS_asFunctionalComponent(__VLS_91, new __VLS_91({
        ...{ 'onClick': {} },
        block: (true),
        size: ("small"),
        rounded: ("lg"),
        color: ("#5D3C76"),
        variant: ("flat"),
        ...{ class: ("text--sm") },
        ...{ style: (({ whiteSpace: 'normal' })) },
    }));
    const __VLS_93 = __VLS_92({
        ...{ 'onClick': {} },
        block: (true),
        size: ("small"),
        rounded: ("lg"),
        color: ("#5D3C76"),
        variant: ("flat"),
        ...{ class: ("text--sm") },
        ...{ style: (({ whiteSpace: 'normal' })) },
    }, ...__VLS_functionalComponentArgsRest(__VLS_92));
    let __VLS_97;
    const __VLS_98 = {
        onClick: (...[$event]) => {
            __VLS_ctx.$emit('update:rewardsStatus', 'all_rewards');
        }
    };
    let __VLS_94;
    let __VLS_95;
    __VLS_96.slots.default;
    var __VLS_96;
    __VLS_90.slots.default;
    var __VLS_90;
    __VLS_70.slots.default;
    var __VLS_70;
    const __VLS_99 = {}.VSelect;
    /** @type { [typeof __VLS_components.VSelect, typeof __VLS_components.vSelect, typeof __VLS_components.VSelect, typeof __VLS_components.vSelect, ] } */ ;
    // @ts-ignore
    const __VLS_100 = __VLS_asFunctionalComponent(__VLS_99, new __VLS_99({
        ...{ 'onUpdate:modelValue': {} },
        modelValue: ((__VLS_ctx.selectedBox)),
        label: ("BOXES"),
        items: ((__VLS_ctx.boxOptions)),
        variant: ("outlined"),
        density: ("compact"),
        ...{ class: ("mb-4") },
        color: ("grey-darken-3"),
    }));
    const __VLS_101 = __VLS_100({
        ...{ 'onUpdate:modelValue': {} },
        modelValue: ((__VLS_ctx.selectedBox)),
        label: ("BOXES"),
        items: ((__VLS_ctx.boxOptions)),
        variant: ("outlined"),
        density: ("compact"),
        ...{ class: ("mb-4") },
        color: ("grey-darken-3"),
    }, ...__VLS_functionalComponentArgsRest(__VLS_100));
    let __VLS_105;
    const __VLS_106 = {
        'onUpdate:modelValue': (...[$event]) => {
            __VLS_ctx.$emit('update:selectedBox', $event);
        }
    };
    let __VLS_102;
    let __VLS_103;
    var __VLS_104;
    __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: ("d-flex align-center mb-2") },
    });
    const __VLS_107 = {}.VIcon;
    /** @type { [typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, ] } */ ;
    // @ts-ignore
    const __VLS_108 = __VLS_asFunctionalComponent(__VLS_107, new __VLS_107({
        ...{ class: ("mr-2") },
        color: ("white"),
    }));
    const __VLS_109 = __VLS_108({
        ...{ class: ("mr-2") },
        color: ("white"),
    }, ...__VLS_functionalComponentArgsRest(__VLS_108));
    __VLS_112.slots.default;
    var __VLS_112;
    __VLS_elementAsFunction(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: ("white--text") },
    });
    const __VLS_113 = {}.VSelect;
    /** @type { [typeof __VLS_components.VSelect, typeof __VLS_components.vSelect, typeof __VLS_components.VSelect, typeof __VLS_components.vSelect, ] } */ ;
    // @ts-ignore
    const __VLS_114 = __VLS_asFunctionalComponent(__VLS_113, new __VLS_113({
        ...{ 'onUpdate:modelValue': {} },
        modelValue: ((__VLS_ctx.selectedComponentType)),
        label: ("COMPONENT TYPE"),
        items: ((__VLS_ctx.componentTypes)),
        variant: ("outlined"),
        density: ("compact"),
        ...{ class: ("mb-4") },
        color: ("grey-darken-3"),
    }));
    const __VLS_115 = __VLS_114({
        ...{ 'onUpdate:modelValue': {} },
        modelValue: ((__VLS_ctx.selectedComponentType)),
        label: ("COMPONENT TYPE"),
        items: ((__VLS_ctx.componentTypes)),
        variant: ("outlined"),
        density: ("compact"),
        ...{ class: ("mb-4") },
        color: ("grey-darken-3"),
    }, ...__VLS_functionalComponentArgsRest(__VLS_114));
    let __VLS_119;
    const __VLS_120 = {
        'onUpdate:modelValue': (...[$event]) => {
            __VLS_ctx.$emit('update:selectedComponentType', $event);
        }
    };
    let __VLS_116;
    let __VLS_117;
    var __VLS_118;
    __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: ("d-flex align-center mb-2") },
    });
    const __VLS_121 = {}.VIcon;
    /** @type { [typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, ] } */ ;
    // @ts-ignore
    const __VLS_122 = __VLS_asFunctionalComponent(__VLS_121, new __VLS_121({
        ...{ class: ("mr-2") },
        color: ("white"),
    }));
    const __VLS_123 = __VLS_122({
        ...{ class: ("mr-2") },
        color: ("white"),
    }, ...__VLS_functionalComponentArgsRest(__VLS_122));
    __VLS_126.slots.default;
    var __VLS_126;
    __VLS_elementAsFunction(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: ("white--text") },
    });
    const __VLS_127 = {}.VSelect;
    /** @type { [typeof __VLS_components.VSelect, typeof __VLS_components.vSelect, typeof __VLS_components.VSelect, typeof __VLS_components.vSelect, ] } */ ;
    // @ts-ignore
    const __VLS_128 = __VLS_asFunctionalComponent(__VLS_127, new __VLS_127({
        ...{ 'onUpdate:modelValue': {} },
        modelValue: ((__VLS_ctx.selectedContent)),
        label: ("CONTENT"),
        items: ((__VLS_ctx.contentOptions)),
        variant: ("outlined"),
        density: ("compact"),
        ...{ class: ("mb-4") },
        color: ("grey-darken-3"),
    }));
    const __VLS_129 = __VLS_128({
        ...{ 'onUpdate:modelValue': {} },
        modelValue: ((__VLS_ctx.selectedContent)),
        label: ("CONTENT"),
        items: ((__VLS_ctx.contentOptions)),
        variant: ("outlined"),
        density: ("compact"),
        ...{ class: ("mb-4") },
        color: ("grey-darken-3"),
    }, ...__VLS_functionalComponentArgsRest(__VLS_128));
    let __VLS_133;
    const __VLS_134 = {
        'onUpdate:modelValue': (...[$event]) => {
            __VLS_ctx.$emit('update:selectedContent', $event);
        }
    };
    let __VLS_130;
    let __VLS_131;
    var __VLS_132;
    __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: ("d-flex align-center mb-2") },
    });
    const __VLS_135 = {}.VIcon;
    /** @type { [typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, ] } */ ;
    // @ts-ignore
    const __VLS_136 = __VLS_asFunctionalComponent(__VLS_135, new __VLS_135({
        ...{ class: ("mr-2") },
        color: ("white"),
    }));
    const __VLS_137 = __VLS_136({
        ...{ class: ("mr-2") },
        color: ("white"),
    }, ...__VLS_functionalComponentArgsRest(__VLS_136));
    __VLS_140.slots.default;
    var __VLS_140;
    __VLS_elementAsFunction(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: ("white--text") },
    });
    const __VLS_141 = {}.VSelect;
    /** @type { [typeof __VLS_components.VSelect, typeof __VLS_components.vSelect, typeof __VLS_components.VSelect, typeof __VLS_components.vSelect, ] } */ ;
    // @ts-ignore
    const __VLS_142 = __VLS_asFunctionalComponent(__VLS_141, new __VLS_141({
        ...{ 'onUpdate:modelValue': {} },
        model: ((__VLS_ctx.nameFilter)),
        label: ("NAME"),
        items: ((__VLS_ctx.nameOptions)),
        variant: ("outlined"),
        density: ("compact"),
        ...{ class: ("mb-4") },
        color: ("grey-darken-3"),
    }));
    const __VLS_143 = __VLS_142({
        ...{ 'onUpdate:modelValue': {} },
        model: ((__VLS_ctx.nameFilter)),
        label: ("NAME"),
        items: ((__VLS_ctx.nameOptions)),
        variant: ("outlined"),
        density: ("compact"),
        ...{ class: ("mb-4") },
        color: ("grey-darken-3"),
    }, ...__VLS_functionalComponentArgsRest(__VLS_142));
    let __VLS_147;
    const __VLS_148 = {
        'onUpdate:modelValue': (...[$event]) => {
            __VLS_ctx.$emit('update:nameFilter', $event);
        }
    };
    let __VLS_144;
    let __VLS_145;
    var __VLS_146;
    __VLS_18.slots.default;
    var __VLS_18;
    const __VLS_149 = {}.VCardActions;
    /** @type { [typeof __VLS_components.VCardActions, typeof __VLS_components.vCardActions, typeof __VLS_components.VCardActions, typeof __VLS_components.vCardActions, ] } */ ;
    // @ts-ignore
    const __VLS_150 = __VLS_asFunctionalComponent(__VLS_149, new __VLS_149({}));
    const __VLS_151 = __VLS_150({}, ...__VLS_functionalComponentArgsRest(__VLS_150));
    const __VLS_155 = {}.VBtn;
    /** @type { [typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ] } */ ;
    // @ts-ignore
    const __VLS_156 = __VLS_asFunctionalComponent(__VLS_155, new __VLS_155({
        ...{ 'onClick': {} },
        block: (true),
        color: ("black"),
        ...{ style: ({}) },
        size: ("small"),
    }));
    const __VLS_157 = __VLS_156({
        ...{ 'onClick': {} },
        block: (true),
        color: ("black"),
        ...{ style: ({}) },
        size: ("small"),
    }, ...__VLS_functionalComponentArgsRest(__VLS_156));
    let __VLS_161;
    const __VLS_162 = {
        onClick: (...[$event]) => {
            __VLS_ctx.$emit('apply-filters');
        }
    };
    let __VLS_158;
    let __VLS_159;
    __VLS_160.slots.default;
    var __VLS_160;
    __VLS_154.slots.default;
    var __VLS_154;
    __VLS_5.slots.default;
    var __VLS_5;
    ['pa-4', 'h-100', 'd-flex', 'flex-column', 'justify-space-between', 'pa-0', 'mb-4', 'text-white', 'pa-0', 'mb-4', 'text--sm', 'text--sm', 'mb-4', 'pa-0', 'mb-2', 'text-white', 'text-uppercase', 'mb-4', 'text--sm', 'text--sm', 'mb-4', 'd-flex', 'align-center', 'mb-2', 'mr-2', 'white--text', 'mb-4', 'd-flex', 'align-center', 'mb-2', 'mr-2', 'white--text', 'mb-4', 'd-flex', 'align-center', 'mb-2', 'mr-2', 'white--text', 'mb-4',];
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
