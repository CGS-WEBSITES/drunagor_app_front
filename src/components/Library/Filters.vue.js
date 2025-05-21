/// <reference types="../../../node_modules/.vue-global-types/vue_3.5_false.d.ts" />
export default (await import('vue')).defineComponent({
    props: {
        filterStatus: String,
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
        ...{ class: ("pa-4  d-flex flex-column justify-space-between") },
        color: ("#2A2A2A"),
    }));
    const __VLS_2 = __VLS_1({
        ...{ class: ("pa-4  d-flex flex-column justify-space-between") },
        color: ("#2A2A2A"),
    }, ...__VLS_functionalComponentArgsRest(__VLS_1));
    var __VLS_6 = {};
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
    const __VLS_13 = {}.VRow;
    /** @type { [typeof __VLS_components.VRow, typeof __VLS_components.vRow, typeof __VLS_components.VRow, typeof __VLS_components.vRow, ] } */ ;
    // @ts-ignore
    const __VLS_14 = __VLS_asFunctionalComponent(__VLS_13, new __VLS_13({
        ...{ class: ("") },
        dense: (true),
    }));
    const __VLS_15 = __VLS_14({
        ...{ class: ("") },
        dense: (true),
    }, ...__VLS_functionalComponentArgsRest(__VLS_14));
    const __VLS_19 = {}.VCol;
    /** @type { [typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ] } */ ;
    // @ts-ignore
    const __VLS_20 = __VLS_asFunctionalComponent(__VLS_19, new __VLS_19({
        cols: ("12"),
    }));
    const __VLS_21 = __VLS_20({
        cols: ("12"),
    }, ...__VLS_functionalComponentArgsRest(__VLS_20));
    const __VLS_25 = {}.VBtn;
    /** @type { [typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ] } */ ;
    // @ts-ignore
    const __VLS_26 = __VLS_asFunctionalComponent(__VLS_25, new __VLS_25({
        ...{ 'onClick': {} },
        block: (true),
        size: ("small"),
        rounded: ("lg"),
        color: ("primary"),
    }));
    const __VLS_27 = __VLS_26({
        ...{ 'onClick': {} },
        block: (true),
        size: ("small"),
        rounded: ("lg"),
        color: ("primary"),
    }, ...__VLS_functionalComponentArgsRest(__VLS_26));
    let __VLS_31;
    const __VLS_32 = {
        onClick: (...[$event]) => {
            __VLS_ctx.filter = 'all';
        }
    };
    let __VLS_28;
    let __VLS_29;
    __VLS_30.slots.default;
    var __VLS_30;
    __VLS_24.slots.default;
    var __VLS_24;
    const __VLS_33 = {}.VCol;
    /** @type { [typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ] } */ ;
    // @ts-ignore
    const __VLS_34 = __VLS_asFunctionalComponent(__VLS_33, new __VLS_33({
        cols: ("6"),
    }));
    const __VLS_35 = __VLS_34({
        cols: ("6"),
    }, ...__VLS_functionalComponentArgsRest(__VLS_34));
    const __VLS_39 = {}.VBtn;
    /** @type { [typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ] } */ ;
    // @ts-ignore
    const __VLS_40 = __VLS_asFunctionalComponent(__VLS_39, new __VLS_39({
        ...{ 'onClick': {} },
        block: (true),
        size: ("small"),
        rounded: ("lg"),
        color: ("#0E7576"),
        variant: ("flat"),
    }));
    const __VLS_41 = __VLS_40({
        ...{ 'onClick': {} },
        block: (true),
        size: ("small"),
        rounded: ("lg"),
        color: ("#0E7576"),
        variant: ("flat"),
    }, ...__VLS_functionalComponentArgsRest(__VLS_40));
    let __VLS_45;
    const __VLS_46 = {
        onClick: (...[$event]) => {
            __VLS_ctx.filter = 'owned';
        }
    };
    let __VLS_42;
    let __VLS_43;
    __VLS_44.slots.default;
    var __VLS_44;
    __VLS_38.slots.default;
    var __VLS_38;
    const __VLS_47 = {}.VCol;
    /** @type { [typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ] } */ ;
    // @ts-ignore
    const __VLS_48 = __VLS_asFunctionalComponent(__VLS_47, new __VLS_47({
        cols: ("6"),
    }));
    const __VLS_49 = __VLS_48({
        cols: ("6"),
    }, ...__VLS_functionalComponentArgsRest(__VLS_48));
    const __VLS_53 = {}.VBtn;
    /** @type { [typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ] } */ ;
    // @ts-ignore
    const __VLS_54 = __VLS_asFunctionalComponent(__VLS_53, new __VLS_53({
        ...{ 'onClick': {} },
        block: (true),
        size: ("small"),
        rounded: ("lg"),
        color: ("#947A11"),
        variant: ("flat"),
    }));
    const __VLS_55 = __VLS_54({
        ...{ 'onClick': {} },
        block: (true),
        size: ("small"),
        rounded: ("lg"),
        color: ("#947A11"),
        variant: ("flat"),
    }, ...__VLS_functionalComponentArgsRest(__VLS_54));
    let __VLS_59;
    const __VLS_60 = {
        onClick: (...[$event]) => {
            __VLS_ctx.filter = 'wishlist';
        }
    };
    let __VLS_56;
    let __VLS_57;
    __VLS_58.slots.default;
    var __VLS_58;
    __VLS_52.slots.default;
    var __VLS_52;
    __VLS_18.slots.default;
    var __VLS_18;
    __VLS_5.slots.default;
    var __VLS_5;
    ['', 'pa-4', 'd-flex', 'flex-column', 'justify-space-between', 'pa-0', 'mb-4', 'text-white',];
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
