/// <reference types="../../../node_modules/.vue-global-types/vue_3.5_false.d.ts" />
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
; /* PartiallyEnd: #3632/scriptSetup.vue */
function __VLS_template() {
    const __VLS_ctx = {};
    let __VLS_components;
    let __VLS_directives;
    const __VLS_0 = {}.VContainer;
    /** @type { [typeof __VLS_components.VContainer, typeof __VLS_components.vContainer, typeof __VLS_components.VContainer, typeof __VLS_components.vContainer, ] } */ ;
    // @ts-ignore
    const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({}));
    const __VLS_2 = __VLS_1({}, ...__VLS_functionalComponentArgsRest(__VLS_1));
    var __VLS_6 = {};
    // @ts-ignore
    /** @type { [typeof LibraryHeader, ] } */ ;
    // @ts-ignore
    const __VLS_7 = __VLS_asFunctionalComponent(LibraryHeader, new LibraryHeader({}));
    const __VLS_8 = __VLS_7({}, ...__VLS_functionalComponentArgsRest(__VLS_7));
    // @ts-ignore
    /** @type { [typeof LibraryFilters, ] } */ ;
    // @ts-ignore
    const __VLS_12 = __VLS_asFunctionalComponent(LibraryFilters, new LibraryFilters({
        ...{ 'onFilter': {} },
    }));
    const __VLS_13 = __VLS_12({
        ...{ 'onFilter': {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_12));
    let __VLS_17;
    const __VLS_18 = {
        onFilter: (__VLS_ctx.handleFilter)
    };
    let __VLS_14;
    let __VLS_15;
    var __VLS_16;
    const __VLS_19 = {}.VRow;
    /** @type { [typeof __VLS_components.VRow, typeof __VLS_components.vRow, typeof __VLS_components.VRow, typeof __VLS_components.vRow, ] } */ ;
    // @ts-ignore
    const __VLS_20 = __VLS_asFunctionalComponent(__VLS_19, new __VLS_19({
        ...{ class: ("mt-4") },
    }));
    const __VLS_21 = __VLS_20({
        ...{ class: ("mt-4") },
    }, ...__VLS_functionalComponentArgsRest(__VLS_20));
    for (const [product] of __VLS_getVForSourceType((__VLS_ctx.filteredProducts))) {
        const __VLS_25 = {}.VCol;
        /** @type { [typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ] } */ ;
        // @ts-ignore
        const __VLS_26 = __VLS_asFunctionalComponent(__VLS_25, new __VLS_25({
            cols: ("12"),
            sm: ("6"),
            md: ("4"),
            key: ((product.id)),
            ...{ class: ("d-flex justify-center") },
        }));
        const __VLS_27 = __VLS_26({
            cols: ("12"),
            sm: ("6"),
            md: ("4"),
            key: ((product.id)),
            ...{ class: ("d-flex justify-center") },
        }, ...__VLS_functionalComponentArgsRest(__VLS_26));
        // @ts-ignore
        /** @type { [typeof ProductCard, ] } */ ;
        // @ts-ignore
        const __VLS_31 = __VLS_asFunctionalComponent(ProductCard, new ProductCard({
            ...{ 'onViewDetails': {} },
            product: ((product)),
        }));
        const __VLS_32 = __VLS_31({
            ...{ 'onViewDetails': {} },
            product: ((product)),
        }, ...__VLS_functionalComponentArgsRest(__VLS_31));
        let __VLS_36;
        const __VLS_37 = {
            onViewDetails: (__VLS_ctx.handleViewDetails)
        };
        let __VLS_33;
        let __VLS_34;
        var __VLS_35;
        __VLS_30.slots.default;
        var __VLS_30;
    }
    __VLS_24.slots.default;
    var __VLS_24;
    const __VLS_38 = {}.VDialog;
    /** @type { [typeof __VLS_components.VDialog, typeof __VLS_components.vDialog, typeof __VLS_components.VDialog, typeof __VLS_components.vDialog, ] } */ ;
    // @ts-ignore
    const __VLS_39 = __VLS_asFunctionalComponent(__VLS_38, new __VLS_38({
        modelValue: ((__VLS_ctx.dialogVisible)),
        maxWidth: ("500px"),
    }));
    const __VLS_40 = __VLS_39({
        modelValue: ((__VLS_ctx.dialogVisible)),
        maxWidth: ("500px"),
    }, ...__VLS_functionalComponentArgsRest(__VLS_39));
    const __VLS_44 = {}.VCard;
    /** @type { [typeof __VLS_components.VCard, typeof __VLS_components.vCard, typeof __VLS_components.VCard, typeof __VLS_components.vCard, ] } */ ;
    // @ts-ignore
    const __VLS_45 = __VLS_asFunctionalComponent(__VLS_44, new __VLS_44({}));
    const __VLS_46 = __VLS_45({}, ...__VLS_functionalComponentArgsRest(__VLS_45));
    const __VLS_50 = {}.VCardTitle;
    /** @type { [typeof __VLS_components.VCardTitle, typeof __VLS_components.vCardTitle, typeof __VLS_components.VCardTitle, typeof __VLS_components.vCardTitle, ] } */ ;
    // @ts-ignore
    const __VLS_51 = __VLS_asFunctionalComponent(__VLS_50, new __VLS_50({}));
    const __VLS_52 = __VLS_51({}, ...__VLS_functionalComponentArgsRest(__VLS_51));
    __VLS_elementAsFunction(__VLS_intrinsicElements.h2, __VLS_intrinsicElements.h2)({
        ...{ class: ("text-h5") },
    });
    (__VLS_ctx.selectedProduct?.name);
    __VLS_55.slots.default;
    var __VLS_55;
    const __VLS_56 = {}.VCardText;
    /** @type { [typeof __VLS_components.VCardText, typeof __VLS_components.vCardText, typeof __VLS_components.VCardText, typeof __VLS_components.vCardText, ] } */ ;
    // @ts-ignore
    const __VLS_57 = __VLS_asFunctionalComponent(__VLS_56, new __VLS_56({}));
    const __VLS_58 = __VLS_57({}, ...__VLS_functionalComponentArgsRest(__VLS_57));
    __VLS_elementAsFunction(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({});
    (__VLS_ctx.selectedProduct?.description);
    __VLS_elementAsFunction(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({});
    __VLS_elementAsFunction(__VLS_intrinsicElements.strong, __VLS_intrinsicElements.strong)({});
    (__VLS_ctx.selectedProduct?.price);
    __VLS_61.slots.default;
    var __VLS_61;
    const __VLS_62 = {}.VCardActions;
    /** @type { [typeof __VLS_components.VCardActions, typeof __VLS_components.vCardActions, typeof __VLS_components.VCardActions, typeof __VLS_components.vCardActions, ] } */ ;
    // @ts-ignore
    const __VLS_63 = __VLS_asFunctionalComponent(__VLS_62, new __VLS_62({}));
    const __VLS_64 = __VLS_63({}, ...__VLS_functionalComponentArgsRest(__VLS_63));
    const __VLS_68 = {}.VBtn;
    /** @type { [typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ] } */ ;
    // @ts-ignore
    const __VLS_69 = __VLS_asFunctionalComponent(__VLS_68, new __VLS_68({
        ...{ 'onClick': {} },
        color: ("primary"),
        text: (true),
    }));
    const __VLS_70 = __VLS_69({
        ...{ 'onClick': {} },
        color: ("primary"),
        text: (true),
    }, ...__VLS_functionalComponentArgsRest(__VLS_69));
    let __VLS_74;
    const __VLS_75 = {
        onClick: (...[$event]) => {
            __VLS_ctx.dialogVisible = false;
        }
    };
    let __VLS_71;
    let __VLS_72;
    __VLS_73.slots.default;
    var __VLS_73;
    __VLS_67.slots.default;
    var __VLS_67;
    __VLS_49.slots.default;
    var __VLS_49;
    __VLS_43.slots.default;
    var __VLS_43;
    __VLS_5.slots.default;
    var __VLS_5;
    ['mt-4', 'd-flex', 'justify-center', 'text-h5',];
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
    __typeEl: {},
});
; /* PartiallyEnd: #4569/main.vue */
