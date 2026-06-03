/// <reference types="../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import { inject, computed } from "vue";
import { useDisplay } from "vuetify";
const display = ref(useDisplay());
const assets = inject("assets");
const logoWidth = computed(() => {
    switch (display.value.name) {
        case "xs": return "380";
        case "sm": return "400";
        case "md": return "500";
        case "lg": return "500";
        case "xl": return "600";
        case "xxl": return "700";
    }
});
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
// CSS variable injection 
// CSS variable injection end 
const __VLS_0 = {}.VContainer;
/** @type {[typeof __VLS_components.VContainer, typeof __VLS_components.vContainer, typeof __VLS_components.VContainer, typeof __VLS_components.vContainer, ]} */ ;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
    ...{ class: "landing-container" },
    fluid: true,
}));
const __VLS_2 = __VLS_1({
    ...{ class: "landing-container" },
    fluid: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
var __VLS_4 = {};
__VLS_3.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.video, __VLS_intrinsicElements.video)({
    autoplay: true,
    muted: true,
    loop: true,
    id: "myVideo",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.source)({
    src: (__VLS_ctx.assets + '/landing-page/presentation-video.mp4'),
    type: "video/mp4",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "content d-flex flex-column justify-center align-center text-center" },
});
const __VLS_5 = {}.VImg;
/** @type {[typeof __VLS_components.VImg, typeof __VLS_components.vImg, ]} */ ;
// @ts-ignore
const __VLS_6 = __VLS_asFunctionalComponent(__VLS_5, new __VLS_5({
    width: (__VLS_ctx.logoWidth),
    src: "@/assets/core.webp",
    ...{ class: "mb-6" },
}));
const __VLS_7 = __VLS_6({
    width: (__VLS_ctx.logoWidth),
    src: "@/assets/core.webp",
    ...{ class: "mb-6" },
}, ...__VLS_functionalComponentArgsRest(__VLS_6));
const __VLS_9 = {}.VRow;
/** @type {[typeof __VLS_components.VRow, typeof __VLS_components.vRow, typeof __VLS_components.VRow, typeof __VLS_components.vRow, ]} */ ;
// @ts-ignore
const __VLS_10 = __VLS_asFunctionalComponent(__VLS_9, new __VLS_9({
    ...{ class: "d-flex justify-center" },
    ...{ style: {} },
}));
const __VLS_11 = __VLS_10({
    ...{ class: "d-flex justify-center" },
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_10));
__VLS_12.slots.default;
const __VLS_13 = {}.VCol;
/** @type {[typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ]} */ ;
// @ts-ignore
const __VLS_14 = __VLS_asFunctionalComponent(__VLS_13, new __VLS_13({
    cols: "6",
    ...{ class: "d-flex justify-center" },
}));
const __VLS_15 = __VLS_14({
    cols: "6",
    ...{ class: "d-flex justify-center" },
}, ...__VLS_functionalComponentArgsRest(__VLS_14));
__VLS_16.slots.default;
const __VLS_17 = {}.VBtn;
/** @type {[typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ]} */ ;
// @ts-ignore
const __VLS_18 = __VLS_asFunctionalComponent(__VLS_17, new __VLS_17({
    ...{ 'onClick': {} },
    color: "primary",
    large: true,
}));
const __VLS_19 = __VLS_18({
    ...{ 'onClick': {} },
    color: "primary",
    large: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_18));
let __VLS_21;
let __VLS_22;
let __VLS_23;
const __VLS_24 = {
    onClick: (...[$event]) => {
        __VLS_ctx.$router.push({ name: 'Login', query: { tab: 'login' } });
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
    ...{ class: "d-flex justify-center" },
}));
const __VLS_27 = __VLS_26({
    cols: "6",
    ...{ class: "d-flex justify-center" },
}, ...__VLS_functionalComponentArgsRest(__VLS_26));
__VLS_28.slots.default;
const __VLS_29 = {}.VBtn;
/** @type {[typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ]} */ ;
// @ts-ignore
const __VLS_30 = __VLS_asFunctionalComponent(__VLS_29, new __VLS_29({
    ...{ 'onClick': {} },
    color: "primary",
    large: true,
}));
const __VLS_31 = __VLS_30({
    ...{ 'onClick': {} },
    color: "primary",
    large: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_30));
let __VLS_33;
let __VLS_34;
let __VLS_35;
const __VLS_36 = {
    onClick: (...[$event]) => {
        __VLS_ctx.$router.push({ name: 'Login', query: { tab: 'signup' } });
    }
};
__VLS_32.slots.default;
var __VLS_32;
var __VLS_28;
var __VLS_12;
var __VLS_3;
/** @type {__VLS_StyleScopedClasses['landing-container']} */ ;
/** @type {__VLS_StyleScopedClasses['content']} */ ;
/** @type {__VLS_StyleScopedClasses['d-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-column']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['align-center']} */ ;
/** @type {__VLS_StyleScopedClasses['text-center']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-6']} */ ;
/** @type {__VLS_StyleScopedClasses['d-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['d-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['d-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            assets: assets,
            logoWidth: logoWidth,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
