/// <reference types="../../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import { defineComponent, ref, computed, onMounted } from "vue";
import Filters from "@/components/Library/Filters.vue";
import ProductGallery from "@/components/Library/ProductGallery.vue";
import ProductDialog from "@/components/Library/ProductDialog.vue";
export default defineComponent({
    components: { Filters, ProductGallery, ProductDialog },
    setup() {
        // Coloque aqui as funções e estados reutilizáveis
    },
});
debugger; /* PartiallyEnd: #3632/script.vue */
const __VLS_ctx = {};
const __VLS_componentsOption = { Filters, ProductGallery, ProductDialog };
let __VLS_components;
let __VLS_directives;
const __VLS_0 = {}.VContainer;
/** @type {[typeof __VLS_components.VContainer, typeof __VLS_components.vContainer, typeof __VLS_components.VContainer, typeof __VLS_components.vContainer, ]} */ ;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
    ...{ class: "pb-12" },
}));
const __VLS_2 = __VLS_1({
    ...{ class: "pb-12" },
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
var __VLS_4 = {};
__VLS_3.slots.default;
const __VLS_5 = {}.VRow;
/** @type {[typeof __VLS_components.VRow, typeof __VLS_components.vRow, typeof __VLS_components.VRow, typeof __VLS_components.vRow, ]} */ ;
// @ts-ignore
const __VLS_6 = __VLS_asFunctionalComponent(__VLS_5, new __VLS_5({}));
const __VLS_7 = __VLS_6({}, ...__VLS_functionalComponentArgsRest(__VLS_6));
__VLS_8.slots.default;
const __VLS_9 = {}.VCol;
/** @type {[typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ]} */ ;
// @ts-ignore
const __VLS_10 = __VLS_asFunctionalComponent(__VLS_9, new __VLS_9({
    cols: "12",
    ...{ class: "text-center" },
}));
const __VLS_11 = __VLS_10({
    cols: "12",
    ...{ class: "text-center" },
}, ...__VLS_functionalComponentArgsRest(__VLS_10));
__VLS_12.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.h1, __VLS_intrinsicElements.h1)({
    ...{ class: "text-h2 font-weight-bold" },
});
var __VLS_12;
var __VLS_8;
const __VLS_13 = {}.VRow;
/** @type {[typeof __VLS_components.VRow, typeof __VLS_components.vRow, typeof __VLS_components.VRow, typeof __VLS_components.vRow, ]} */ ;
// @ts-ignore
const __VLS_14 = __VLS_asFunctionalComponent(__VLS_13, new __VLS_13({
    ...{ class: "bg-grey-darken-3 pa-4 rounded" },
}));
const __VLS_15 = __VLS_14({
    ...{ class: "bg-grey-darken-3 pa-4 rounded" },
}, ...__VLS_functionalComponentArgsRest(__VLS_14));
__VLS_16.slots.default;
const __VLS_17 = {}.VBtn;
/** @type {[typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ]} */ ;
// @ts-ignore
const __VLS_18 = __VLS_asFunctionalComponent(__VLS_17, new __VLS_17({
    ...{ 'onClick': {} },
    ...{ class: "d-md-none mb-4" },
    color: "#222222",
    block: true,
}));
const __VLS_19 = __VLS_18({
    ...{ 'onClick': {} },
    ...{ class: "d-md-none mb-4" },
    color: "#222222",
    block: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_18));
let __VLS_21;
let __VLS_22;
let __VLS_23;
const __VLS_24 = {
    onClick: (__VLS_ctx.toggleFilters)
};
__VLS_20.slots.default;
var __VLS_20;
const __VLS_25 = {}.VCol;
/** @type {[typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ]} */ ;
// @ts-ignore
const __VLS_26 = __VLS_asFunctionalComponent(__VLS_25, new __VLS_25({
    cols: "12",
    md: "3",
}));
const __VLS_27 = __VLS_26({
    cols: "12",
    md: "3",
}, ...__VLS_functionalComponentArgsRest(__VLS_26));
__VLS_asFunctionalDirective(__VLS_directives.vShow)(null, { ...__VLS_directiveBindingRestFields, value: (__VLS_ctx.showFilters || __VLS_ctx.isDesktop) }, null, null);
__VLS_28.slots.default;
const __VLS_29 = {}.Filters;
/** @type {[typeof __VLS_components.Filters, ]} */ ;
// @ts-ignore
const __VLS_30 = __VLS_asFunctionalComponent(__VLS_29, new __VLS_29({
    ...{ 'onApplyFilters': {} },
    filterStatus: (__VLS_ctx.filterStatus),
    rewardsStatus: (__VLS_ctx.rewardsStatus),
    selectedBox: (__VLS_ctx.selectedBox),
    selectedComponentType: (__VLS_ctx.selectedComponentType),
    selectedContent: (__VLS_ctx.selectedContent),
    selectedName: (__VLS_ctx.selectedName),
    componentChecked: (__VLS_ctx.componentChecked),
    contentChecked: (__VLS_ctx.contentChecked),
    boxOptions: (__VLS_ctx.boxOptions),
    contentOptions: (__VLS_ctx.contentOptions),
    componentTypes: (__VLS_ctx.componentTypes),
    nameOptions: (__VLS_ctx.nameOptions),
}));
const __VLS_31 = __VLS_30({
    ...{ 'onApplyFilters': {} },
    filterStatus: (__VLS_ctx.filterStatus),
    rewardsStatus: (__VLS_ctx.rewardsStatus),
    selectedBox: (__VLS_ctx.selectedBox),
    selectedComponentType: (__VLS_ctx.selectedComponentType),
    selectedContent: (__VLS_ctx.selectedContent),
    selectedName: (__VLS_ctx.selectedName),
    componentChecked: (__VLS_ctx.componentChecked),
    contentChecked: (__VLS_ctx.contentChecked),
    boxOptions: (__VLS_ctx.boxOptions),
    contentOptions: (__VLS_ctx.contentOptions),
    componentTypes: (__VLS_ctx.componentTypes),
    nameOptions: (__VLS_ctx.nameOptions),
}, ...__VLS_functionalComponentArgsRest(__VLS_30));
let __VLS_33;
let __VLS_34;
let __VLS_35;
const __VLS_36 = {
    onApplyFilters: (__VLS_ctx.applyFilters)
};
var __VLS_32;
var __VLS_28;
const __VLS_37 = {}.VCol;
/** @type {[typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ]} */ ;
// @ts-ignore
const __VLS_38 = __VLS_asFunctionalComponent(__VLS_37, new __VLS_37({
    cols: "12",
    md: "9",
}));
const __VLS_39 = __VLS_38({
    cols: "12",
    md: "9",
}, ...__VLS_functionalComponentArgsRest(__VLS_38));
__VLS_40.slots.default;
const __VLS_41 = {}.ProductGallery;
/** @type {[typeof __VLS_components.ProductGallery, ]} */ ;
// @ts-ignore
const __VLS_42 = __VLS_asFunctionalComponent(__VLS_41, new __VLS_41({
    ...{ 'onOpenDialog': {} },
    products: (__VLS_ctx.filteredProducts),
}));
const __VLS_43 = __VLS_42({
    ...{ 'onOpenDialog': {} },
    products: (__VLS_ctx.filteredProducts),
}, ...__VLS_functionalComponentArgsRest(__VLS_42));
let __VLS_45;
let __VLS_46;
let __VLS_47;
const __VLS_48 = {
    onOpenDialog: (__VLS_ctx.openDialog)
};
var __VLS_44;
var __VLS_40;
var __VLS_16;
if (__VLS_ctx.dialogVisible) {
    const __VLS_49 = {}.ProductDialog;
    /** @type {[typeof __VLS_components.ProductDialog, ]} */ ;
    // @ts-ignore
    const __VLS_50 = __VLS_asFunctionalComponent(__VLS_49, new __VLS_49({
        ...{ 'onUpdateProduct': {} },
        product: (__VLS_ctx.selectedProduct),
        dialogVisible: (__VLS_ctx.dialogVisible),
    }));
    const __VLS_51 = __VLS_50({
        ...{ 'onUpdateProduct': {} },
        product: (__VLS_ctx.selectedProduct),
        dialogVisible: (__VLS_ctx.dialogVisible),
    }, ...__VLS_functionalComponentArgsRest(__VLS_50));
    let __VLS_53;
    let __VLS_54;
    let __VLS_55;
    const __VLS_56 = {
        onUpdateProduct: (__VLS_ctx.updateSelectedProduct)
    };
    var __VLS_52;
}
var __VLS_3;
/** @type {__VLS_StyleScopedClasses['pb-12']} */ ;
/** @type {__VLS_StyleScopedClasses['text-center']} */ ;
/** @type {__VLS_StyleScopedClasses['text-h2']} */ ;
/** @type {__VLS_StyleScopedClasses['font-weight-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-grey-darken-3']} */ ;
/** @type {__VLS_StyleScopedClasses['pa-4']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded']} */ ;
/** @type {__VLS_StyleScopedClasses['d-md-none']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
var __VLS_dollars;
let __VLS_self;
