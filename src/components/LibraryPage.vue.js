/// <reference types="../../node_modules/.vue-global-types/vue_3.5_false.d.ts" />
import { defineComponent, ref, computed, onMounted } from "vue";
import Filters from "@/components/Filters.vue";
import ProductGallery from "@/components/ProductGallery.vue";
import ProductDialog from "@/components/ProductDialog.vue";
export default defineComponent({
    components: { Filters, ProductGallery, ProductDialog },
    setup() {
        // Coloque aqui as funções e estados reutilizáveis
    },
});
; /* PartiallyEnd: #3632/script.vue */
function __VLS_template() {
    const __VLS_ctx = {};
    const __VLS_componentsOption = { Filters, ProductGallery, ProductDialog };
    let __VLS_components;
    let __VLS_directives;
    const __VLS_0 = {}.VContainer;
    /** @type { [typeof __VLS_components.VContainer, typeof __VLS_components.vContainer, typeof __VLS_components.VContainer, typeof __VLS_components.vContainer, ] } */ ;
    // @ts-ignore
    const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
        ...{ class: ("pb-12") },
    }));
    const __VLS_2 = __VLS_1({
        ...{ class: ("pb-12") },
    }, ...__VLS_functionalComponentArgsRest(__VLS_1));
    var __VLS_6 = {};
    const __VLS_7 = {}.VRow;
    /** @type { [typeof __VLS_components.VRow, typeof __VLS_components.vRow, typeof __VLS_components.VRow, typeof __VLS_components.vRow, ] } */ ;
    // @ts-ignore
    const __VLS_8 = __VLS_asFunctionalComponent(__VLS_7, new __VLS_7({}));
    const __VLS_9 = __VLS_8({}, ...__VLS_functionalComponentArgsRest(__VLS_8));
    const __VLS_13 = {}.VCol;
    /** @type { [typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ] } */ ;
    // @ts-ignore
    const __VLS_14 = __VLS_asFunctionalComponent(__VLS_13, new __VLS_13({
        cols: ("12"),
        ...{ class: ("text-center") },
    }));
    const __VLS_15 = __VLS_14({
        cols: ("12"),
        ...{ class: ("text-center") },
    }, ...__VLS_functionalComponentArgsRest(__VLS_14));
    __VLS_elementAsFunction(__VLS_intrinsicElements.h1, __VLS_intrinsicElements.h1)({
        ...{ class: ("text-h2 font-weight-bold") },
    });
    __VLS_18.slots.default;
    var __VLS_18;
    __VLS_12.slots.default;
    var __VLS_12;
    const __VLS_19 = {}.VRow;
    /** @type { [typeof __VLS_components.VRow, typeof __VLS_components.vRow, typeof __VLS_components.VRow, typeof __VLS_components.vRow, ] } */ ;
    // @ts-ignore
    const __VLS_20 = __VLS_asFunctionalComponent(__VLS_19, new __VLS_19({
        ...{ class: ("bg-grey-darken-3 pa-4 rounded") },
    }));
    const __VLS_21 = __VLS_20({
        ...{ class: ("bg-grey-darken-3 pa-4 rounded") },
    }, ...__VLS_functionalComponentArgsRest(__VLS_20));
    const __VLS_25 = {}.VBtn;
    /** @type { [typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ] } */ ;
    // @ts-ignore
    const __VLS_26 = __VLS_asFunctionalComponent(__VLS_25, new __VLS_25({
        ...{ 'onClick': {} },
        ...{ class: ("d-md-none mb-4") },
        color: ("#222222"),
        block: (true),
    }));
    const __VLS_27 = __VLS_26({
        ...{ 'onClick': {} },
        ...{ class: ("d-md-none mb-4") },
        color: ("#222222"),
        block: (true),
    }, ...__VLS_functionalComponentArgsRest(__VLS_26));
    let __VLS_31;
    const __VLS_32 = {
        onClick: (__VLS_ctx.toggleFilters)
    };
    let __VLS_28;
    let __VLS_29;
    __VLS_30.slots.default;
    var __VLS_30;
    const __VLS_33 = {}.VCol;
    /** @type { [typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ] } */ ;
    // @ts-ignore
    const __VLS_34 = __VLS_asFunctionalComponent(__VLS_33, new __VLS_33({
        cols: ("12"),
        md: ("3"),
    }));
    const __VLS_35 = __VLS_34({
        cols: ("12"),
        md: ("3"),
    }, ...__VLS_functionalComponentArgsRest(__VLS_34));
    __VLS_asFunctionalDirective(__VLS_directives.vShow)(null, { ...__VLS_directiveBindingRestFields, value: (__VLS_ctx.showFilters || __VLS_ctx.isDesktop) }, null, null);
    const __VLS_39 = {}.Filters;
    /** @type { [typeof __VLS_components.Filters, ] } */ ;
    // @ts-ignore
    const __VLS_40 = __VLS_asFunctionalComponent(__VLS_39, new __VLS_39({
        ...{ 'onApplyFilters': {} },
        filterStatus: ((__VLS_ctx.filterStatus)),
        rewardsStatus: ((__VLS_ctx.rewardsStatus)),
        selectedBox: ((__VLS_ctx.selectedBox)),
        selectedComponentType: ((__VLS_ctx.selectedComponentType)),
        selectedContent: ((__VLS_ctx.selectedContent)),
        selectedName: ((__VLS_ctx.selectedName)),
        componentChecked: ((__VLS_ctx.componentChecked)),
        contentChecked: ((__VLS_ctx.contentChecked)),
        boxOptions: ((__VLS_ctx.boxOptions)),
        contentOptions: ((__VLS_ctx.contentOptions)),
        componentTypes: ((__VLS_ctx.componentTypes)),
        nameOptions: ((__VLS_ctx.nameOptions)),
    }));
    const __VLS_41 = __VLS_40({
        ...{ 'onApplyFilters': {} },
        filterStatus: ((__VLS_ctx.filterStatus)),
        rewardsStatus: ((__VLS_ctx.rewardsStatus)),
        selectedBox: ((__VLS_ctx.selectedBox)),
        selectedComponentType: ((__VLS_ctx.selectedComponentType)),
        selectedContent: ((__VLS_ctx.selectedContent)),
        selectedName: ((__VLS_ctx.selectedName)),
        componentChecked: ((__VLS_ctx.componentChecked)),
        contentChecked: ((__VLS_ctx.contentChecked)),
        boxOptions: ((__VLS_ctx.boxOptions)),
        contentOptions: ((__VLS_ctx.contentOptions)),
        componentTypes: ((__VLS_ctx.componentTypes)),
        nameOptions: ((__VLS_ctx.nameOptions)),
    }, ...__VLS_functionalComponentArgsRest(__VLS_40));
    let __VLS_45;
    const __VLS_46 = {
        onApplyFilters: (__VLS_ctx.applyFilters)
    };
    let __VLS_42;
    let __VLS_43;
    var __VLS_44;
    __VLS_38.slots.default;
    var __VLS_38;
    const __VLS_47 = {}.VCol;
    /** @type { [typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ] } */ ;
    // @ts-ignore
    const __VLS_48 = __VLS_asFunctionalComponent(__VLS_47, new __VLS_47({
        cols: ("12"),
        md: ("9"),
    }));
    const __VLS_49 = __VLS_48({
        cols: ("12"),
        md: ("9"),
    }, ...__VLS_functionalComponentArgsRest(__VLS_48));
    const __VLS_53 = {}.ProductGallery;
    /** @type { [typeof __VLS_components.ProductGallery, ] } */ ;
    // @ts-ignore
    const __VLS_54 = __VLS_asFunctionalComponent(__VLS_53, new __VLS_53({
        ...{ 'onOpenDialog': {} },
        products: ((__VLS_ctx.filteredProducts)),
    }));
    const __VLS_55 = __VLS_54({
        ...{ 'onOpenDialog': {} },
        products: ((__VLS_ctx.filteredProducts)),
    }, ...__VLS_functionalComponentArgsRest(__VLS_54));
    let __VLS_59;
    const __VLS_60 = {
        onOpenDialog: (__VLS_ctx.openDialog)
    };
    let __VLS_56;
    let __VLS_57;
    var __VLS_58;
    __VLS_52.slots.default;
    var __VLS_52;
    __VLS_24.slots.default;
    var __VLS_24;
    if (__VLS_ctx.dialogVisible) {
        const __VLS_61 = {}.ProductDialog;
        /** @type { [typeof __VLS_components.ProductDialog, ] } */ ;
        // @ts-ignore
        const __VLS_62 = __VLS_asFunctionalComponent(__VLS_61, new __VLS_61({
            ...{ 'onUpdateProduct': {} },
            product: ((__VLS_ctx.selectedProduct)),
            dialogVisible: ((__VLS_ctx.dialogVisible)),
        }));
        const __VLS_63 = __VLS_62({
            ...{ 'onUpdateProduct': {} },
            product: ((__VLS_ctx.selectedProduct)),
            dialogVisible: ((__VLS_ctx.dialogVisible)),
        }, ...__VLS_functionalComponentArgsRest(__VLS_62));
        let __VLS_67;
        const __VLS_68 = {
            onUpdateProduct: (__VLS_ctx.updateSelectedProduct)
        };
        let __VLS_64;
        let __VLS_65;
        var __VLS_66;
    }
    __VLS_5.slots.default;
    var __VLS_5;
    ['pb-12', 'text-center', 'text-h2', 'font-weight-bold', 'bg-grey-darken-3', 'pa-4', 'rounded', 'd-md-none', 'mb-4',];
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
