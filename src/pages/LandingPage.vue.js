/// <reference types="../../node_modules/.vue-global-types/vue_3.5_false.d.ts" />
import { inject, computed } from "vue";
import { useDisplay } from "vuetify";
const display = ref(useDisplay());
const assets = inject("assets");
const logoWidth = computed(() => {
    switch (display.value.name) {
        case "xs":
            return "300";
        case "sm":
            return "400";
        case "md":
            return "500";
        case "lg":
            return "500";
        case "xl":
            return "600";
        case "xxl":
            return "700";
    }
});
; /* PartiallyEnd: #3632/scriptSetup.vue */
function __VLS_template() {
    const __VLS_ctx = {};
    let __VLS_components;
    let __VLS_directives;
    // CSS variable injection 
    // CSS variable injection end 
    const __VLS_0 = {}.VContainer;
    /** @type { [typeof __VLS_components.VContainer, typeof __VLS_components.vContainer, typeof __VLS_components.VContainer, typeof __VLS_components.vContainer, ] } */ ;
    // @ts-ignore
    const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
        ...{ class: ("d-flex flex-column justify-center pa-0") },
        fluid: (true),
    }));
    const __VLS_2 = __VLS_1({
        ...{ class: ("d-flex flex-column justify-center pa-0") },
        fluid: (true),
    }, ...__VLS_functionalComponentArgsRest(__VLS_1));
    var __VLS_6 = {};
    __VLS_elementAsFunction(__VLS_intrinsicElements.video, __VLS_intrinsicElements.video)({
        autoplay: (true),
        muted: (true),
        loop: (true),
        id: ("myVideo"),
    });
    __VLS_elementAsFunction(__VLS_intrinsicElements.source)({
        src: ((__VLS_ctx.assets + '/landing-page/presentation-video.mp4')),
        type: ("video/mp4"),
    });
    __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: ("video-shader") },
    });
    __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ style: ({}) },
        ...{ class: ("content d-flex flex-column justify-center align-center") },
    });
    __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
    const __VLS_7 = {}.VImg;
    /** @type { [typeof __VLS_components.VImg, typeof __VLS_components.vImg, typeof __VLS_components.VImg, typeof __VLS_components.vImg, ] } */ ;
    // @ts-ignore
    const __VLS_8 = __VLS_asFunctionalComponent(__VLS_7, new __VLS_7({
        width: ((__VLS_ctx.logoWidth)),
        src: ("@/assets/core.webp"),
    }));
    const __VLS_9 = __VLS_8({
        width: ((__VLS_ctx.logoWidth)),
        src: ("@/assets/core.webp"),
    }, ...__VLS_functionalComponentArgsRest(__VLS_8));
    const __VLS_13 = {}.VRow;
    /** @type { [typeof __VLS_components.VRow, typeof __VLS_components.vRow, typeof __VLS_components.VRow, typeof __VLS_components.vRow, ] } */ ;
    // @ts-ignore
    const __VLS_14 = __VLS_asFunctionalComponent(__VLS_13, new __VLS_13({
        ...{ style: ({}) },
    }));
    const __VLS_15 = __VLS_14({
        ...{ style: ({}) },
    }, ...__VLS_functionalComponentArgsRest(__VLS_14));
    const __VLS_19 = {}.VCol;
    /** @type { [typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ] } */ ;
    // @ts-ignore
    const __VLS_20 = __VLS_asFunctionalComponent(__VLS_19, new __VLS_19({
        cols: ("6"),
        ...{ class: ("d-flex justify-center") },
    }));
    const __VLS_21 = __VLS_20({
        cols: ("6"),
        ...{ class: ("d-flex justify-center") },
    }, ...__VLS_functionalComponentArgsRest(__VLS_20));
    const __VLS_25 = {}.VBtn;
    /** @type { [typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ] } */ ;
    // @ts-ignore
    const __VLS_26 = __VLS_asFunctionalComponent(__VLS_25, new __VLS_25({
        ...{ 'onClick': {} },
        color: ("primary"),
        large: (true),
    }));
    const __VLS_27 = __VLS_26({
        ...{ 'onClick': {} },
        color: ("primary"),
        large: (true),
    }, ...__VLS_functionalComponentArgsRest(__VLS_26));
    let __VLS_31;
    const __VLS_32 = {
        onClick: (...[$event]) => {
            __VLS_ctx.$router.push({ name: 'Login', query: { tab: 'login' } });
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
        ...{ class: ("d-flex justify-center") },
    }));
    const __VLS_35 = __VLS_34({
        cols: ("6"),
        ...{ class: ("d-flex justify-center") },
    }, ...__VLS_functionalComponentArgsRest(__VLS_34));
    const __VLS_39 = {}.VBtn;
    /** @type { [typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ] } */ ;
    // @ts-ignore
    const __VLS_40 = __VLS_asFunctionalComponent(__VLS_39, new __VLS_39({
        ...{ 'onClick': {} },
        color: ("primary"),
        large: (true),
    }));
    const __VLS_41 = __VLS_40({
        ...{ 'onClick': {} },
        color: ("primary"),
        large: (true),
    }, ...__VLS_functionalComponentArgsRest(__VLS_40));
    let __VLS_45;
    const __VLS_46 = {
        onClick: (...[$event]) => {
            __VLS_ctx.$router.push({ name: 'Login', query: { tab: 'signup' } });
        }
    };
    let __VLS_42;
    let __VLS_43;
    __VLS_44.slots.default;
    var __VLS_44;
    __VLS_38.slots.default;
    var __VLS_38;
    __VLS_18.slots.default;
    var __VLS_18;
    __VLS_5.slots.default;
    var __VLS_5;
    ['d-flex', 'flex-column', 'justify-center', 'pa-0', 'video-shader', 'content', 'd-flex', 'flex-column', 'justify-center', 'align-center', 'd-flex', 'justify-center', 'd-flex', 'justify-center',];
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
            assets: assets,
            logoWidth: logoWidth,
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
