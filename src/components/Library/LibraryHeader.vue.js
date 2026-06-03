/// <reference types="../../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import { ref, computed } from "vue";
// Importando os componentes
import LibraryHeader from "@/components/Library/LibraryHeader.vue";
import LibraryFilters from "@/components/Library/Filters.vue";
import ProductCard from "@/components/Library/ProductCard.vue";
// Lista de produtos fictícia
const products = ref([
    { id: 1, name: "Product A", description: "Description A", price: 100 },
    { id: 2, name: "Product B", description: "Description B", price: 150 },
    { id: 3, name: "Product C", description: "Description C", price: 200 },
]);
// Estado
const selectedProduct = ref(null);
const dialogVisible = ref(false);
const filters = ref({});
// Métodos
const handleFilter = (newFilters) => {
    filters.value = newFilters;
};
const handleViewDetails = (product) => {
    selectedProduct.value = product;
    dialogVisible.value = true;
};
// Computed para produtos filtrados
const filteredProducts = computed(() => {
    // Aqui você pode adicionar lógica para filtrar os produtos com base nos filtros aplicados
    return products.value;
});
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
const __VLS_0 = {}.VContainer;
/** @type {[typeof __VLS_components.VContainer, typeof __VLS_components.vContainer, typeof __VLS_components.VContainer, typeof __VLS_components.vContainer, ]} */ ;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({}));
const __VLS_2 = __VLS_1({}, ...__VLS_functionalComponentArgsRest(__VLS_1));
var __VLS_4 = {};
__VLS_3.slots.default;
/** @type {[typeof LibraryHeader, ]} */ ;
// @ts-ignore
const __VLS_5 = __VLS_asFunctionalComponent(LibraryHeader, new LibraryHeader({}));
const __VLS_6 = __VLS_5({}, ...__VLS_functionalComponentArgsRest(__VLS_5));
/** @type {[typeof LibraryFilters, ]} */ ;
// @ts-ignore
const __VLS_8 = __VLS_asFunctionalComponent(LibraryFilters, new LibraryFilters({
    ...{ 'onFilter': {} },
}));
const __VLS_9 = __VLS_8({
    ...{ 'onFilter': {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_8));
let __VLS_11;
let __VLS_12;
let __VLS_13;
const __VLS_14 = {
    onFilter: (__VLS_ctx.handleFilter)
};
var __VLS_10;
const __VLS_15 = {}.VRow;
/** @type {[typeof __VLS_components.VRow, typeof __VLS_components.vRow, typeof __VLS_components.VRow, typeof __VLS_components.vRow, ]} */ ;
// @ts-ignore
const __VLS_16 = __VLS_asFunctionalComponent(__VLS_15, new __VLS_15({
    ...{ class: "mt-4" },
}));
const __VLS_17 = __VLS_16({
    ...{ class: "mt-4" },
}, ...__VLS_functionalComponentArgsRest(__VLS_16));
__VLS_18.slots.default;
for (const [product] of __VLS_getVForSourceType((__VLS_ctx.filteredProducts))) {
    const __VLS_19 = {}.VCol;
    /** @type {[typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ]} */ ;
    // @ts-ignore
    const __VLS_20 = __VLS_asFunctionalComponent(__VLS_19, new __VLS_19({
        cols: "12",
        sm: "6",
        md: "4",
        key: (product.id),
        ...{ class: "d-flex justify-center" },
    }));
    const __VLS_21 = __VLS_20({
        cols: "12",
        sm: "6",
        md: "4",
        key: (product.id),
        ...{ class: "d-flex justify-center" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_20));
    __VLS_22.slots.default;
    /** @type {[typeof ProductCard, ]} */ ;
    // @ts-ignore
    const __VLS_23 = __VLS_asFunctionalComponent(ProductCard, new ProductCard({
        ...{ 'onViewDetails': {} },
        product: (product),
    }));
    const __VLS_24 = __VLS_23({
        ...{ 'onViewDetails': {} },
        product: (product),
    }, ...__VLS_functionalComponentArgsRest(__VLS_23));
    let __VLS_26;
    let __VLS_27;
    let __VLS_28;
    const __VLS_29 = {
        onViewDetails: (__VLS_ctx.handleViewDetails)
    };
    var __VLS_25;
    var __VLS_22;
}
var __VLS_18;
const __VLS_30 = {}.VDialog;
/** @type {[typeof __VLS_components.VDialog, typeof __VLS_components.vDialog, typeof __VLS_components.VDialog, typeof __VLS_components.vDialog, ]} */ ;
// @ts-ignore
const __VLS_31 = __VLS_asFunctionalComponent(__VLS_30, new __VLS_30({
    modelValue: (__VLS_ctx.dialogVisible),
    maxWidth: "500px",
}));
const __VLS_32 = __VLS_31({
    modelValue: (__VLS_ctx.dialogVisible),
    maxWidth: "500px",
}, ...__VLS_functionalComponentArgsRest(__VLS_31));
__VLS_33.slots.default;
const __VLS_34 = {}.VCard;
/** @type {[typeof __VLS_components.VCard, typeof __VLS_components.vCard, typeof __VLS_components.VCard, typeof __VLS_components.vCard, ]} */ ;
// @ts-ignore
const __VLS_35 = __VLS_asFunctionalComponent(__VLS_34, new __VLS_34({}));
const __VLS_36 = __VLS_35({}, ...__VLS_functionalComponentArgsRest(__VLS_35));
__VLS_37.slots.default;
const __VLS_38 = {}.VCardTitle;
/** @type {[typeof __VLS_components.VCardTitle, typeof __VLS_components.vCardTitle, typeof __VLS_components.VCardTitle, typeof __VLS_components.vCardTitle, ]} */ ;
// @ts-ignore
const __VLS_39 = __VLS_asFunctionalComponent(__VLS_38, new __VLS_38({}));
const __VLS_40 = __VLS_39({}, ...__VLS_functionalComponentArgsRest(__VLS_39));
__VLS_41.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.h2, __VLS_intrinsicElements.h2)({
    ...{ class: "text-h5" },
});
(__VLS_ctx.selectedProduct?.name);
var __VLS_41;
const __VLS_42 = {}.VCardText;
/** @type {[typeof __VLS_components.VCardText, typeof __VLS_components.vCardText, typeof __VLS_components.VCardText, typeof __VLS_components.vCardText, ]} */ ;
// @ts-ignore
const __VLS_43 = __VLS_asFunctionalComponent(__VLS_42, new __VLS_42({}));
const __VLS_44 = __VLS_43({}, ...__VLS_functionalComponentArgsRest(__VLS_43));
__VLS_45.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({});
(__VLS_ctx.selectedProduct?.description);
__VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.strong, __VLS_intrinsicElements.strong)({});
(__VLS_ctx.selectedProduct?.price);
var __VLS_45;
const __VLS_46 = {}.VCardActions;
/** @type {[typeof __VLS_components.VCardActions, typeof __VLS_components.vCardActions, typeof __VLS_components.VCardActions, typeof __VLS_components.vCardActions, ]} */ ;
// @ts-ignore
const __VLS_47 = __VLS_asFunctionalComponent(__VLS_46, new __VLS_46({}));
const __VLS_48 = __VLS_47({}, ...__VLS_functionalComponentArgsRest(__VLS_47));
__VLS_49.slots.default;
const __VLS_50 = {}.VBtn;
/** @type {[typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ]} */ ;
// @ts-ignore
const __VLS_51 = __VLS_asFunctionalComponent(__VLS_50, new __VLS_50({
    ...{ 'onClick': {} },
    color: "primary",
    text: true,
}));
const __VLS_52 = __VLS_51({
    ...{ 'onClick': {} },
    color: "primary",
    text: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_51));
let __VLS_54;
let __VLS_55;
let __VLS_56;
const __VLS_57 = {
    onClick: (...[$event]) => {
        __VLS_ctx.dialogVisible = false;
    }
};
__VLS_53.slots.default;
var __VLS_53;
var __VLS_49;
var __VLS_37;
var __VLS_33;
var __VLS_3;
/** @type {__VLS_StyleScopedClasses['mt-4']} */ ;
/** @type {__VLS_StyleScopedClasses['d-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['text-h5']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            LibraryHeader: LibraryHeader,
            LibraryFilters: LibraryFilters,
            ProductCard: ProductCard,
            selectedProduct: selectedProduct,
            dialogVisible: dialogVisible,
            handleFilter: handleFilter,
            handleViewDetails: handleViewDetails,
            filteredProducts: filteredProducts,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
