/// <reference types="../../node_modules/.vue-global-types/vue_3.5_false.d.ts" />
import { inject } from "vue";
import { useUserStore } from "@/store/UserStore";
const user = useUserStore().user; // Inicializa a store
const assets = inject("assets");
; /* PartiallyEnd: #3632/scriptSetup.vue */
function __VLS_template() {
    const __VLS_ctx = {};
    let __VLS_components;
    let __VLS_directives;
    // CSS variable injection 
    // CSS variable injection end 
    const __VLS_0 = {}.VRow;
    /** @type { [typeof __VLS_components.VRow, typeof __VLS_components.vRow, typeof __VLS_components.VRow, typeof __VLS_components.vRow, ] } */ ;
    // @ts-ignore
    const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
        noGutters: (true),
    }));
    const __VLS_2 = __VLS_1({
        noGutters: (true),
    }, ...__VLS_functionalComponentArgsRest(__VLS_1));
    var __VLS_6 = {};
    const __VLS_7 = {}.ProfileCard;
    /** @type { [typeof __VLS_components.ProfileCard, ] } */ ;
    // @ts-ignore
    const __VLS_8 = __VLS_asFunctionalComponent(__VLS_7, new __VLS_7({}));
    const __VLS_9 = __VLS_8({}, ...__VLS_functionalComponentArgsRest(__VLS_8));
    const __VLS_13 = {}.VCol;
    /** @type { [typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ] } */ ;
    // @ts-ignore
    const __VLS_14 = __VLS_asFunctionalComponent(__VLS_13, new __VLS_13({
        cols: ("12"),
    }));
    const __VLS_15 = __VLS_14({
        cols: ("12"),
    }, ...__VLS_functionalComponentArgsRest(__VLS_14));
    const __VLS_19 = {}.NavigationBar;
    /** @type { [typeof __VLS_components.NavigationBar, typeof __VLS_components.navigationBar, ] } */ ;
    // @ts-ignore
    const __VLS_20 = __VLS_asFunctionalComponent(__VLS_19, new __VLS_19({
        buttons: ((__VLS_ctx.buttons)),
        separators: (([true, false, true, true, false])),
    }));
    const __VLS_21 = __VLS_20({
        buttons: ((__VLS_ctx.buttons)),
        separators: (([true, false, true, true, false])),
    }, ...__VLS_functionalComponentArgsRest(__VLS_20));
    __VLS_18.slots.default;
    var __VLS_18;
    const __VLS_25 = {}.VCol;
    /** @type { [typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ] } */ ;
    // @ts-ignore
    const __VLS_26 = __VLS_asFunctionalComponent(__VLS_25, new __VLS_25({
        cols: ("12"),
    }));
    const __VLS_27 = __VLS_26({
        cols: ("12"),
    }, ...__VLS_functionalComponentArgsRest(__VLS_26));
    const __VLS_31 = {}.RouterView;
    /** @type { [typeof __VLS_components.RouterView, typeof __VLS_components.routerView, ] } */ ;
    // @ts-ignore
    const __VLS_32 = __VLS_asFunctionalComponent(__VLS_31, new __VLS_31({}));
    const __VLS_33 = __VLS_32({}, ...__VLS_functionalComponentArgsRest(__VLS_32));
    __VLS_30.slots.default;
    var __VLS_30;
    __VLS_5.slots.default;
    var __VLS_5;
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
        return {};
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
    __typeEl: {},
});
; /* PartiallyEnd: #4569/main.vue */
