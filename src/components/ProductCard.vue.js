/// <reference types="../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
export default (await import('vue')).defineComponent({
    props: {
        product: {
            type: Object,
            required: true,
        },
    },
    data() {
        return {
            isMobile: false,
        };
    },
    mounted() {
        this.checkIfMobile();
        window.addEventListener("resize", this.checkIfMobile);
    },
    beforeUnmount() {
        window.removeEventListener("resize", this.checkIfMobile);
    },
    methods: {
        checkIfMobile() {
            this.isMobile = window.innerWidth < 600;
        },
    },
});
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
// CSS variable injection 
// CSS variable injection end 
if (__VLS_ctx.isMobile) {
    const __VLS_0 = {}.VCard;
    /** @type {[typeof __VLS_components.VCard, typeof __VLS_components.vCard, typeof __VLS_components.VCard, typeof __VLS_components.vCard, ]} */ ;
    // @ts-ignore
    const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
        ...{ class: "pa-0 mx-auto d-flex my-mobile-card" },
        elevation: "0",
        ...{ style: {} },
    }));
    const __VLS_2 = __VLS_1({
        ...{ class: "pa-0 mx-auto d-flex my-mobile-card" },
        elevation: "0",
        ...{ style: {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_1));
    var __VLS_4 = {};
    __VLS_3.slots.default;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "d-flex w-100 h-100" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "d-flex align-center justify-center pa-0" },
        ...{ style: ({ backgroundColor: __VLS_ctx.product.color, width: '36.6%', height: '100%' }) },
    });
    const __VLS_5 = {}.VImg;
    /** @type {[typeof __VLS_components.VImg, typeof __VLS_components.vImg, typeof __VLS_components.VImg, typeof __VLS_components.vImg, ]} */ ;
    // @ts-ignore
    const __VLS_6 = __VLS_asFunctionalComponent(__VLS_5, new __VLS_5({
        src: (__VLS_ctx.product.image || require('@/assets/defalt-box.png')),
        contain: true,
        alt: "Product Image",
        ...{ style: {} },
    }));
    const __VLS_7 = __VLS_6({
        src: (__VLS_ctx.product.image || require('@/assets/defalt-box.png')),
        contain: true,
        alt: "Product Image",
        ...{ style: {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_6));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "d-flex flex-column justify-space-between text-white pa-2" },
        ...{ style: ({
                flex: 1,
                height: '100%',
                backgroundImage: `url(${__VLS_ctx.product.cardbg})`,
                backgroundColor: 'rgba(20, 20, 25, 0.7)',
                backgroundBlendMode: 'overlay',
                backgroundPosition: 'center',
                backgroundSize: '100% 100%',
                backgroundRepeat: 'no-repeat'
            }) },
    });
    const __VLS_9 = {}.VCardTitle;
    /** @type {[typeof __VLS_components.VCardTitle, typeof __VLS_components.vCardTitle, typeof __VLS_components.VCardTitle, typeof __VLS_components.vCardTitle, ]} */ ;
    // @ts-ignore
    const __VLS_10 = __VLS_asFunctionalComponent(__VLS_9, new __VLS_9({
        ...{ class: "font-weight-bold pa-0 text-wrap" },
        ...{ style: {} },
    }));
    const __VLS_11 = __VLS_10({
        ...{ class: "font-weight-bold pa-0 text-wrap" },
        ...{ style: {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_10));
    __VLS_12.slots.default;
    (__VLS_ctx.product.name || "No Product Selected");
    var __VLS_12;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "mt-auto d-flex align-center w-100" },
    });
    var __VLS_13 = {};
    var __VLS_3;
}
else {
    const __VLS_15 = {}.VCard;
    /** @type {[typeof __VLS_components.VCard, typeof __VLS_components.vCard, typeof __VLS_components.VCard, typeof __VLS_components.vCard, ]} */ ;
    // @ts-ignore
    const __VLS_16 = __VLS_asFunctionalComponent(__VLS_15, new __VLS_15({
        ...{ class: "pa-0 mt-2 mx-auto d-flex my-desktop-card" },
        elevation: "0",
        ...{ style: {} },
    }));
    const __VLS_17 = __VLS_16({
        ...{ class: "pa-0 mt-2 mx-auto d-flex my-desktop-card" },
        elevation: "0",
        ...{ style: {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_16));
    var __VLS_19 = {};
    __VLS_18.slots.default;
    const __VLS_20 = {}.VRow;
    /** @type {[typeof __VLS_components.VRow, typeof __VLS_components.vRow, typeof __VLS_components.VRow, typeof __VLS_components.vRow, ]} */ ;
    // @ts-ignore
    const __VLS_21 = __VLS_asFunctionalComponent(__VLS_20, new __VLS_20({
        ...{ class: "ma-0 pa-0 flex-nowrap w-100" },
    }));
    const __VLS_22 = __VLS_21({
        ...{ class: "ma-0 pa-0 flex-nowrap w-100" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_21));
    __VLS_23.slots.default;
    const __VLS_24 = {}.VCol;
    /** @type {[typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ]} */ ;
    // @ts-ignore
    const __VLS_25 = __VLS_asFunctionalComponent(__VLS_24, new __VLS_24({
        cols: "4",
        ...{ class: "d-flex align-center justify-center pa-2" },
        ...{ style: ({ backgroundColor: __VLS_ctx.product.color }) },
    }));
    const __VLS_26 = __VLS_25({
        cols: "4",
        ...{ class: "d-flex align-center justify-center pa-2" },
        ...{ style: ({ backgroundColor: __VLS_ctx.product.color }) },
    }, ...__VLS_functionalComponentArgsRest(__VLS_25));
    __VLS_27.slots.default;
    const __VLS_28 = {}.VImg;
    /** @type {[typeof __VLS_components.VImg, typeof __VLS_components.vImg, typeof __VLS_components.VImg, typeof __VLS_components.vImg, ]} */ ;
    // @ts-ignore
    const __VLS_29 = __VLS_asFunctionalComponent(__VLS_28, new __VLS_28({
        src: (__VLS_ctx.product.image || require('@/assets/defalt-box.png')),
        ...{ class: "rounded" },
        maxHeight: "150px",
        contain: true,
        alt: "Product Image",
        ...{ style: {} },
    }));
    const __VLS_30 = __VLS_29({
        src: (__VLS_ctx.product.image || require('@/assets/defalt-box.png')),
        ...{ class: "rounded" },
        maxHeight: "150px",
        contain: true,
        alt: "Product Image",
        ...{ style: {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_29));
    var __VLS_27;
    const __VLS_32 = {}.VCol;
    /** @type {[typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ]} */ ;
    // @ts-ignore
    const __VLS_33 = __VLS_asFunctionalComponent(__VLS_32, new __VLS_32({
        cols: "8",
        ...{ class: "d-flex flex-column justify-space-between text-white pa-3" },
        ...{ style: ({
                backgroundImage: `url(${__VLS_ctx.product.cardbg})`,
                backgroundColor: 'rgba(20, 20, 25, 0.7)',
                backgroundBlendMode: 'overlay',
                backgroundPosition: 'center',
                backgroundSize: 'cover'
            }) },
    }));
    const __VLS_34 = __VLS_33({
        cols: "8",
        ...{ class: "d-flex flex-column justify-space-between text-white pa-3" },
        ...{ style: ({
                backgroundImage: `url(${__VLS_ctx.product.cardbg})`,
                backgroundColor: 'rgba(20, 20, 25, 0.7)',
                backgroundBlendMode: 'overlay',
                backgroundPosition: 'center',
                backgroundSize: 'cover'
            }) },
    }, ...__VLS_functionalComponentArgsRest(__VLS_33));
    __VLS_35.slots.default;
    const __VLS_36 = {}.VCardTitle;
    /** @type {[typeof __VLS_components.VCardTitle, typeof __VLS_components.vCardTitle, typeof __VLS_components.VCardTitle, typeof __VLS_components.vCardTitle, ]} */ ;
    // @ts-ignore
    const __VLS_37 = __VLS_asFunctionalComponent(__VLS_36, new __VLS_36({
        ...{ class: "text-h5 font-weight-bold pa-0 text-wrap" },
        ...{ style: {} },
    }));
    const __VLS_38 = __VLS_37({
        ...{ class: "text-h5 font-weight-bold pa-0 text-wrap" },
        ...{ style: {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_37));
    __VLS_39.slots.default;
    (__VLS_ctx.product.name || "No Product Selected");
    var __VLS_39;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "mt-auto d-flex align-center w-100" },
    });
    var __VLS_40 = {};
    var __VLS_35;
    var __VLS_23;
    var __VLS_18;
}
/** @type {__VLS_StyleScopedClasses['pa-0']} */ ;
/** @type {__VLS_StyleScopedClasses['mx-auto']} */ ;
/** @type {__VLS_StyleScopedClasses['d-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['my-mobile-card']} */ ;
/** @type {__VLS_StyleScopedClasses['d-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['w-100']} */ ;
/** @type {__VLS_StyleScopedClasses['h-100']} */ ;
/** @type {__VLS_StyleScopedClasses['d-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['align-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['pa-0']} */ ;
/** @type {__VLS_StyleScopedClasses['d-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-column']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-space-between']} */ ;
/** @type {__VLS_StyleScopedClasses['text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['pa-2']} */ ;
/** @type {__VLS_StyleScopedClasses['font-weight-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['pa-0']} */ ;
/** @type {__VLS_StyleScopedClasses['text-wrap']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-auto']} */ ;
/** @type {__VLS_StyleScopedClasses['d-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['align-center']} */ ;
/** @type {__VLS_StyleScopedClasses['w-100']} */ ;
/** @type {__VLS_StyleScopedClasses['pa-0']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-2']} */ ;
/** @type {__VLS_StyleScopedClasses['mx-auto']} */ ;
/** @type {__VLS_StyleScopedClasses['d-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['my-desktop-card']} */ ;
/** @type {__VLS_StyleScopedClasses['ma-0']} */ ;
/** @type {__VLS_StyleScopedClasses['pa-0']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-nowrap']} */ ;
/** @type {__VLS_StyleScopedClasses['w-100']} */ ;
/** @type {__VLS_StyleScopedClasses['d-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['align-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['pa-2']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded']} */ ;
/** @type {__VLS_StyleScopedClasses['d-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-column']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-space-between']} */ ;
/** @type {__VLS_StyleScopedClasses['text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['pa-3']} */ ;
/** @type {__VLS_StyleScopedClasses['text-h5']} */ ;
/** @type {__VLS_StyleScopedClasses['font-weight-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['pa-0']} */ ;
/** @type {__VLS_StyleScopedClasses['text-wrap']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-auto']} */ ;
/** @type {__VLS_StyleScopedClasses['d-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['align-center']} */ ;
/** @type {__VLS_StyleScopedClasses['w-100']} */ ;
// @ts-ignore
var __VLS_14 = __VLS_13, __VLS_41 = __VLS_40;
var __VLS_dollars;
let __VLS_self;
