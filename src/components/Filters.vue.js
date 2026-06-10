/// <reference types="../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
export default (await import('vue')).defineComponent({
    props: {
        filterStatus: String,
        nameFilter: String,
        nameOptions: Array,
    },
    emits: [
        "update:filterStatus",
        "update:nameFilter",
    ],
});
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
const __VLS_0 = {}.VCard;
/** @type {[typeof __VLS_components.VCard, typeof __VLS_components.vCard, typeof __VLS_components.VCard, typeof __VLS_components.vCard, ]} */ ;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
    ...{ class: "pa-4 h-100 d-flex flex-column justify-space-between bg-transparent" },
    elevation: "0",
}));
const __VLS_2 = __VLS_1({
    ...{ class: "pa-4 h-100 d-flex flex-column justify-space-between bg-transparent" },
    elevation: "0",
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
var __VLS_4 = {};
__VLS_3.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
const __VLS_5 = {}.VCardText;
/** @type {[typeof __VLS_components.VCardText, typeof __VLS_components.vCardText, typeof __VLS_components.VCardText, typeof __VLS_components.vCardText, ]} */ ;
// @ts-ignore
const __VLS_6 = __VLS_asFunctionalComponent(__VLS_5, new __VLS_5({
    ...{ class: "pa-0" },
}));
const __VLS_7 = __VLS_6({
    ...{ class: "pa-0" },
}, ...__VLS_functionalComponentArgsRest(__VLS_6));
__VLS_8.slots.default;
const __VLS_9 = {}.VRow;
/** @type {[typeof __VLS_components.VRow, typeof __VLS_components.vRow, typeof __VLS_components.VRow, typeof __VLS_components.vRow, ]} */ ;
// @ts-ignore
const __VLS_10 = __VLS_asFunctionalComponent(__VLS_9, new __VLS_9({
    ...{ class: "mb-4" },
    dense: true,
}));
const __VLS_11 = __VLS_10({
    ...{ class: "mb-4" },
    dense: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_10));
__VLS_12.slots.default;
const __VLS_13 = {}.VCol;
/** @type {[typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ]} */ ;
// @ts-ignore
const __VLS_14 = __VLS_asFunctionalComponent(__VLS_13, new __VLS_13({
    cols: "4",
}));
const __VLS_15 = __VLS_14({
    cols: "4",
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
    color: (__VLS_ctx.filterStatus === 'all' || !__VLS_ctx.filterStatus ? 'white' : 'grey'),
    variant: (__VLS_ctx.filterStatus === 'all' || !__VLS_ctx.filterStatus ? 'flat' : 'outlined'),
    ...{ class: "text--caption px-1" },
    ...{ style: ({ whiteSpace: 'normal', fontSize: '10px' }) },
}));
const __VLS_19 = __VLS_18({
    ...{ 'onClick': {} },
    block: true,
    size: "small",
    rounded: "lg",
    color: (__VLS_ctx.filterStatus === 'all' || !__VLS_ctx.filterStatus ? 'white' : 'grey'),
    variant: (__VLS_ctx.filterStatus === 'all' || !__VLS_ctx.filterStatus ? 'flat' : 'outlined'),
    ...{ class: "text--caption px-1" },
    ...{ style: ({ whiteSpace: 'normal', fontSize: '10px' }) },
}, ...__VLS_functionalComponentArgsRest(__VLS_18));
let __VLS_21;
let __VLS_22;
let __VLS_23;
const __VLS_24 = {
    onClick: (...[$event]) => {
        __VLS_ctx.$emit('update:filterStatus', 'all');
    }
};
__VLS_20.slots.default;
var __VLS_20;
var __VLS_16;
const __VLS_25 = {}.VCol;
/** @type {[typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ]} */ ;
// @ts-ignore
const __VLS_26 = __VLS_asFunctionalComponent(__VLS_25, new __VLS_25({
    cols: "4",
}));
const __VLS_27 = __VLS_26({
    cols: "4",
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
    color: (__VLS_ctx.filterStatus === 'owned' ? '#0E7576' : 'grey'),
    variant: (__VLS_ctx.filterStatus === 'owned' ? 'flat' : 'outlined'),
    ...{ class: "text--caption px-1" },
    ...{ style: ({ whiteSpace: 'normal', fontSize: '10px', color: __VLS_ctx.filterStatus === 'owned' ? 'white' : 'inherit' }) },
}));
const __VLS_31 = __VLS_30({
    ...{ 'onClick': {} },
    block: true,
    size: "small",
    rounded: "lg",
    color: (__VLS_ctx.filterStatus === 'owned' ? '#0E7576' : 'grey'),
    variant: (__VLS_ctx.filterStatus === 'owned' ? 'flat' : 'outlined'),
    ...{ class: "text--caption px-1" },
    ...{ style: ({ whiteSpace: 'normal', fontSize: '10px', color: __VLS_ctx.filterStatus === 'owned' ? 'white' : 'inherit' }) },
}, ...__VLS_functionalComponentArgsRest(__VLS_30));
let __VLS_33;
let __VLS_34;
let __VLS_35;
const __VLS_36 = {
    onClick: (...[$event]) => {
        __VLS_ctx.$emit('update:filterStatus', 'owned');
    }
};
__VLS_32.slots.default;
var __VLS_32;
var __VLS_28;
const __VLS_37 = {}.VCol;
/** @type {[typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ]} */ ;
// @ts-ignore
const __VLS_38 = __VLS_asFunctionalComponent(__VLS_37, new __VLS_37({
    cols: "4",
}));
const __VLS_39 = __VLS_38({
    cols: "4",
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
    color: (__VLS_ctx.filterStatus === 'wishlist' ? '#947A11' : 'grey'),
    variant: (__VLS_ctx.filterStatus === 'wishlist' ? 'flat' : 'outlined'),
    ...{ class: "text--caption px-1" },
    ...{ style: ({ whiteSpace: 'normal', fontSize: '10px', color: __VLS_ctx.filterStatus === 'wishlist' ? 'white' : 'inherit' }) },
}));
const __VLS_43 = __VLS_42({
    ...{ 'onClick': {} },
    block: true,
    size: "small",
    rounded: "lg",
    color: (__VLS_ctx.filterStatus === 'wishlist' ? '#947A11' : 'grey'),
    variant: (__VLS_ctx.filterStatus === 'wishlist' ? 'flat' : 'outlined'),
    ...{ class: "text--caption px-1" },
    ...{ style: ({ whiteSpace: 'normal', fontSize: '10px', color: __VLS_ctx.filterStatus === 'wishlist' ? 'white' : 'inherit' }) },
}, ...__VLS_functionalComponentArgsRest(__VLS_42));
let __VLS_45;
let __VLS_46;
let __VLS_47;
const __VLS_48 = {
    onClick: (...[$event]) => {
        __VLS_ctx.$emit('update:filterStatus', 'wishlist');
    }
};
__VLS_44.slots.default;
var __VLS_44;
var __VLS_40;
var __VLS_12;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "d-flex align-center mb-2" },
});
const __VLS_49 = {}.VIcon;
/** @type {[typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, ]} */ ;
// @ts-ignore
const __VLS_50 = __VLS_asFunctionalComponent(__VLS_49, new __VLS_49({
    ...{ class: "mr-2" },
    color: "white",
}));
const __VLS_51 = __VLS_50({
    ...{ class: "mr-2" },
    color: "white",
}, ...__VLS_functionalComponentArgsRest(__VLS_50));
__VLS_52.slots.default;
var __VLS_52;
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "white--text" },
});
const __VLS_53 = {}.VSelect;
/** @type {[typeof __VLS_components.VSelect, typeof __VLS_components.vSelect, typeof __VLS_components.VSelect, typeof __VLS_components.vSelect, ]} */ ;
// @ts-ignore
const __VLS_54 = __VLS_asFunctionalComponent(__VLS_53, new __VLS_53({
    ...{ 'onUpdate:modelValue': {} },
    model: (__VLS_ctx.nameFilter),
    label: "NAME",
    items: (__VLS_ctx.nameOptions),
    variant: "outlined",
    density: "compact",
    ...{ class: "mb-4" },
    color: "grey-darken-3",
}));
const __VLS_55 = __VLS_54({
    ...{ 'onUpdate:modelValue': {} },
    model: (__VLS_ctx.nameFilter),
    label: "NAME",
    items: (__VLS_ctx.nameOptions),
    variant: "outlined",
    density: "compact",
    ...{ class: "mb-4" },
    color: "grey-darken-3",
}, ...__VLS_functionalComponentArgsRest(__VLS_54));
let __VLS_57;
let __VLS_58;
let __VLS_59;
const __VLS_60 = {
    'onUpdate:modelValue': (...[$event]) => {
        __VLS_ctx.$emit('update:nameFilter', $event);
    }
};
var __VLS_56;
var __VLS_8;
var __VLS_3;
/** @type {__VLS_StyleScopedClasses['pa-4']} */ ;
/** @type {__VLS_StyleScopedClasses['h-100']} */ ;
/** @type {__VLS_StyleScopedClasses['d-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-column']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-space-between']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-transparent']} */ ;
/** @type {__VLS_StyleScopedClasses['pa-0']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['text--caption']} */ ;
/** @type {__VLS_StyleScopedClasses['px-1']} */ ;
/** @type {__VLS_StyleScopedClasses['text--caption']} */ ;
/** @type {__VLS_StyleScopedClasses['px-1']} */ ;
/** @type {__VLS_StyleScopedClasses['text--caption']} */ ;
/** @type {__VLS_StyleScopedClasses['px-1']} */ ;
/** @type {__VLS_StyleScopedClasses['d-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['align-center']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-2']} */ ;
/** @type {__VLS_StyleScopedClasses['mr-2']} */ ;
/** @type {__VLS_StyleScopedClasses['white--text']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
var __VLS_dollars;
let __VLS_self;
