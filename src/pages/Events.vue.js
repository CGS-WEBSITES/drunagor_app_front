/// <reference types="../../node_modules/.vue-global-types/vue_3.5_false.d.ts" />
import { computed } from "vue";
import { useUserStore } from "@/store/UserStore";
import UserEvents from "@/components/UserEvents.vue";
import RetailEvents from "@/components/RetailEvents.vue";
// Obtém o usuário da store
const user = computed(() => useUserStore().user);
; /* PartiallyEnd: #3632/scriptSetup.vue */
function __VLS_template() {
    const __VLS_ctx = {};
    let __VLS_components;
    let __VLS_directives;
    __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
    if (__VLS_ctx.user?.roles_fk === 2) {
        // @ts-ignore
        /** @type { [typeof UserEvents, ] } */ ;
        // @ts-ignore
        const __VLS_0 = __VLS_asFunctionalComponent(UserEvents, new UserEvents({}));
        const __VLS_1 = __VLS_0({}, ...__VLS_functionalComponentArgsRest(__VLS_0));
    }
    else if (__VLS_ctx.user?.roles_fk === 3) {
        // @ts-ignore
        /** @type { [typeof RetailEvents, ] } */ ;
        // @ts-ignore
        const __VLS_5 = __VLS_asFunctionalComponent(RetailEvents, new RetailEvents({}));
        const __VLS_6 = __VLS_5({}, ...__VLS_functionalComponentArgsRest(__VLS_5));
    }
    else {
        __VLS_elementAsFunction(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({});
    }
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
            UserEvents: UserEvents,
            RetailEvents: RetailEvents,
            user: user,
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
