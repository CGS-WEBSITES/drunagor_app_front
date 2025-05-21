/// <reference types="../../node_modules/.vue-global-types/vue_3.5_false.d.ts" />
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
; /* PartiallyEnd: #3632/script.vue */
function __VLS_template() {
    const __VLS_ctx = {};
    let __VLS_components;
    let __VLS_directives;
    ['my-mobile-card',];
    // CSS variable injection 
    // CSS variable injection end 
    const __VLS_0 = {}.VCard;
    /** @type { [typeof __VLS_components.VCard, typeof __VLS_components.vCard, typeof __VLS_components.VCard, typeof __VLS_components.vCard, ] } */ ;
    // @ts-ignore
    const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
        ...{ class: ("pa-0 mt-2 mx-auto d-flex") },
        ...{ class: ((__VLS_ctx.isMobile ? 'my-mobile-card' : '')) },
    }));
    const __VLS_2 = __VLS_1({
        ...{ class: ("pa-0 mt-2 mx-auto d-flex") },
        ...{ class: ((__VLS_ctx.isMobile ? 'my-mobile-card' : '')) },
    }, ...__VLS_functionalComponentArgsRest(__VLS_1));
    var __VLS_6 = {};
    const __VLS_7 = {}.VRow;
    /** @type { [typeof __VLS_components.VRow, typeof __VLS_components.vRow, typeof __VLS_components.VRow, typeof __VLS_components.vRow, ] } */ ;
    // @ts-ignore
    const __VLS_8 = __VLS_asFunctionalComponent(__VLS_7, new __VLS_7({
        ...{ class: ("ma-0 pa-0 d-flex align-stretch flex-nowrap") },
    }));
    const __VLS_9 = __VLS_8({
        ...{ class: ("ma-0 pa-0 d-flex align-stretch flex-nowrap") },
    }, ...__VLS_functionalComponentArgsRest(__VLS_8));
    const __VLS_13 = {}.VCol;
    /** @type { [typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ] } */ ;
    // @ts-ignore
    const __VLS_14 = __VLS_asFunctionalComponent(__VLS_13, new __VLS_13({
        cols: ((__VLS_ctx.isMobile ? 4 : 4)),
        md: ((4)),
        ...{ class: ("d-flex flex-column align-center") },
        ...{ class: ((__VLS_ctx.isMobile ? 'pa-' : 'pa-4')) },
        ...{ style: (({
                backgroundColor: __VLS_ctx.product.color
            })) },
    }));
    const __VLS_15 = __VLS_14({
        cols: ((__VLS_ctx.isMobile ? 4 : 4)),
        md: ((4)),
        ...{ class: ("d-flex flex-column align-center") },
        ...{ class: ((__VLS_ctx.isMobile ? 'pa-' : 'pa-4')) },
        ...{ style: (({
                backgroundColor: __VLS_ctx.product.color
            })) },
    }, ...__VLS_functionalComponentArgsRest(__VLS_14));
    const __VLS_19 = {}.VImg;
    /** @type { [typeof __VLS_components.VImg, typeof __VLS_components.vImg, typeof __VLS_components.VImg, typeof __VLS_components.vImg, ] } */ ;
    // @ts-ignore
    const __VLS_20 = __VLS_asFunctionalComponent(__VLS_19, new __VLS_19({
        src: ((__VLS_ctx.product.image || require('@/assets/defalt-box.png'))),
        ...{ class: ("rounded") },
        height: ((__VLS_ctx.isMobile ? '75px' : '75px')),
        width: ("100%"),
        alt: ("Product Image"),
    }));
    const __VLS_21 = __VLS_20({
        src: ((__VLS_ctx.product.image || require('@/assets/defalt-box.png'))),
        ...{ class: ("rounded") },
        height: ((__VLS_ctx.isMobile ? '75px' : '75px')),
        width: ("100%"),
        alt: ("Product Image"),
    }, ...__VLS_functionalComponentArgsRest(__VLS_20));
    __VLS_18.slots.default;
    var __VLS_18;
    const __VLS_25 = {}.VCol;
    /** @type { [typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ] } */ ;
    // @ts-ignore
    const __VLS_26 = __VLS_asFunctionalComponent(__VLS_25, new __VLS_25({
        ...{ class: ("box-shadow text-white") },
        ...{ class: ((__VLS_ctx.isMobile ? 'pa-3' : 'pa-4')) },
        ...{ style: (({
                backgroundImage: `url(${__VLS_ctx.product.cardbg})`,
                backgroundColor: 'rgba(0, 0, 0, 0.4)',
                backgroundBlendMode: 'darken',
                backgroundPosition: 'center',
                backgroundSize: 'cover',
                height: '150px',
                paddingTop: '300px'
            })) },
    }));
    const __VLS_27 = __VLS_26({
        ...{ class: ("box-shadow text-white") },
        ...{ class: ((__VLS_ctx.isMobile ? 'pa-3' : 'pa-4')) },
        ...{ style: (({
                backgroundImage: `url(${__VLS_ctx.product.cardbg})`,
                backgroundColor: 'rgba(0, 0, 0, 0.4)',
                backgroundBlendMode: 'darken',
                backgroundPosition: 'center',
                backgroundSize: 'cover',
                height: '150px',
                paddingTop: '300px'
            })) },
    }, ...__VLS_functionalComponentArgsRest(__VLS_26));
    const __VLS_31 = {}.VCardTitle;
    /** @type { [typeof __VLS_components.VCardTitle, typeof __VLS_components.vCardTitle, typeof __VLS_components.VCardTitle, typeof __VLS_components.vCardTitle, ] } */ ;
    // @ts-ignore
    const __VLS_32 = __VLS_asFunctionalComponent(__VLS_31, new __VLS_31({
        ...{ class: ((__VLS_ctx.isMobile ? 'text-h6' : 'text-h5')) },
        ...{ class: ("element3 font-weight-bold") },
    }));
    const __VLS_33 = __VLS_32({
        ...{ class: ((__VLS_ctx.isMobile ? 'text-h6' : 'text-h5')) },
        ...{ class: ("element3 font-weight-bold") },
    }, ...__VLS_functionalComponentArgsRest(__VLS_32));
    (__VLS_ctx.product.name || "No Product Selected");
    __VLS_36.slots.default;
    var __VLS_36;
    __VLS_30.slots.default;
    var __VLS_30;
    __VLS_12.slots.default;
    var __VLS_12;
    __VLS_5.slots.default;
    var __VLS_5;
    ['pa-0', 'mt-2', 'mx-auto', 'd-flex', 'ma-0', 'pa-0', 'd-flex', 'align-stretch', 'flex-nowrap', 'd-flex', 'flex-column', 'align-center', 'rounded', 'box-shadow', 'text-white', 'element3', 'font-weight-bold',];
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
