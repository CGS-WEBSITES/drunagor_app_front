/// <reference types="../../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
export default (await import('vue')).defineComponent({
    props: {
        filterStatus: String,
    },
    data() {
        return {
            filter: 'all',
        };
    },
    emits: [
        "update:filterStatus",
        "update:rewardsStatus",
        "update:selectedBox",
        "update:selectedComponentType",
        "update:selectedContent",
        "update:nameFilter",
        "apply-filters",
    ],
});
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
const __VLS_0 = {}.VCard;
/** @type {[typeof __VLS_components.VCard, typeof __VLS_components.vCard, typeof __VLS_components.VCard, typeof __VLS_components.vCard, ]} */ ;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
    ...{ class: "pa-4 d-flex flex-column justify-space-between" },
    color: "#2A2A2A",
}));
const __VLS_2 = __VLS_1({
    ...{ class: "pa-4 d-flex flex-column justify-space-between" },
    color: "#2A2A2A",
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
var __VLS_4 = {};
__VLS_3.slots.default;
const __VLS_5 = {}.VCardTitle;
/** @type {[typeof __VLS_components.VCardTitle, typeof __VLS_components.vCardTitle, typeof __VLS_components.VCardTitle, typeof __VLS_components.vCardTitle, ]} */ ;
// @ts-ignore
const __VLS_6 = __VLS_asFunctionalComponent(__VLS_5, new __VLS_5({
    ...{ class: "pa-0 mb-4 text-white" },
}));
const __VLS_7 = __VLS_6({
    ...{ class: "pa-0 mb-4 text-white" },
}, ...__VLS_functionalComponentArgsRest(__VLS_6));
__VLS_8.slots.default;
var __VLS_8;
const __VLS_9 = {}.VRow;
/** @type {[typeof __VLS_components.VRow, typeof __VLS_components.vRow, typeof __VLS_components.VRow, typeof __VLS_components.vRow, ]} */ ;
// @ts-ignore
const __VLS_10 = __VLS_asFunctionalComponent(__VLS_9, new __VLS_9({
    ...{ class: "" },
    dense: true,
}));
const __VLS_11 = __VLS_10({
    ...{ class: "" },
    dense: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_10));
__VLS_12.slots.default;
const __VLS_13 = {}.VCol;
/** @type {[typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ]} */ ;
// @ts-ignore
const __VLS_14 = __VLS_asFunctionalComponent(__VLS_13, new __VLS_13({
    cols: "12",
}));
const __VLS_15 = __VLS_14({
    cols: "12",
}, ...__VLS_functionalComponentArgsRest(__VLS_14));
__VLS_16.slots.default;
const __VLS_17 = {}.VBtn;
/** @type {[typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ]} */ ;
// @ts-ignore
const __VLS_18 = __VLS_asFunctionalComponent(__VLS_17, new __VLS_17({
    ...{ 'onClick': {} },
    block: true,
    size: "small",
    rounded: "lg",
    color: "primary",
}));
const __VLS_19 = __VLS_18({
    ...{ 'onClick': {} },
    block: true,
    size: "small",
    rounded: "lg",
    color: "primary",
}, ...__VLS_functionalComponentArgsRest(__VLS_18));
let __VLS_21;
let __VLS_22;
let __VLS_23;
const __VLS_24 = {
    onClick: (...[$event]) => {
        __VLS_ctx.filter = 'all';
    }
};
__VLS_20.slots.default;
var __VLS_20;
var __VLS_16;
const __VLS_25 = {}.VCol;
/** @type {[typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ]} */ ;
// @ts-ignore
const __VLS_26 = __VLS_asFunctionalComponent(__VLS_25, new __VLS_25({
    cols: "6",
}));
const __VLS_27 = __VLS_26({
    cols: "6",
}, ...__VLS_functionalComponentArgsRest(__VLS_26));
__VLS_28.slots.default;
const __VLS_29 = {}.VBtn;
/** @type {[typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ]} */ ;
// @ts-ignore
const __VLS_30 = __VLS_asFunctionalComponent(__VLS_29, new __VLS_29({
    ...{ 'onClick': {} },
    block: true,
    size: "small",
    rounded: "lg",
    color: "#0E7576",
    variant: "flat",
}));
const __VLS_31 = __VLS_30({
    ...{ 'onClick': {} },
    block: true,
    size: "small",
    rounded: "lg",
    color: "#0E7576",
    variant: "flat",
}, ...__VLS_functionalComponentArgsRest(__VLS_30));
let __VLS_33;
let __VLS_34;
let __VLS_35;
const __VLS_36 = {
    onClick: (...[$event]) => {
        __VLS_ctx.filter = 'owned';
    }
};
__VLS_32.slots.default;
var __VLS_32;
var __VLS_28;
const __VLS_37 = {}.VCol;
/** @type {[typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ]} */ ;
// @ts-ignore
const __VLS_38 = __VLS_asFunctionalComponent(__VLS_37, new __VLS_37({
    cols: "6",
}));
const __VLS_39 = __VLS_38({
    cols: "6",
}, ...__VLS_functionalComponentArgsRest(__VLS_38));
__VLS_40.slots.default;
const __VLS_41 = {}.VBtn;
/** @type {[typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ]} */ ;
// @ts-ignore
const __VLS_42 = __VLS_asFunctionalComponent(__VLS_41, new __VLS_41({
    ...{ 'onClick': {} },
    block: true,
    size: "small",
    rounded: "lg",
    color: "#947A11",
    variant: "flat",
}));
const __VLS_43 = __VLS_42({
    ...{ 'onClick': {} },
    block: true,
    size: "small",
    rounded: "lg",
    color: "#947A11",
    variant: "flat",
}, ...__VLS_functionalComponentArgsRest(__VLS_42));
let __VLS_45;
let __VLS_46;
let __VLS_47;
const __VLS_48 = {
    onClick: (...[$event]) => {
        __VLS_ctx.filter = 'wishlist';
    }
};
__VLS_44.slots.default;
var __VLS_44;
var __VLS_40;
var __VLS_12;
var __VLS_3;
/** @type {__VLS_StyleScopedClasses['']} */ ;
/** @type {__VLS_StyleScopedClasses['pa-4']} */ ;
/** @type {__VLS_StyleScopedClasses['d-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-column']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-space-between']} */ ;
/** @type {__VLS_StyleScopedClasses['pa-0']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['text-white']} */ ;
var __VLS_dollars;
let __VLS_self;
