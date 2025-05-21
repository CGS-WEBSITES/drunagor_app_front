/// <reference types="../../node_modules/.vue-global-types/vue_3.5_false.d.ts" />
import { computed } from "vue";
import { useUserStore } from "@/store/UserStore";
import UserDash from "@/components/UserDash.vue";
import RetailDash from "@/components/RetailDash.vue";
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
        /** @type { [typeof UserDash, ] } */ ;
        // @ts-ignore
        const __VLS_0 = __VLS_asFunctionalComponent(UserDash, new UserDash({}));
        const __VLS_1 = __VLS_0({}, ...__VLS_functionalComponentArgsRest(__VLS_0));
    }
    else if (__VLS_ctx.user?.roles_fk === 3) {
        // @ts-ignore
        /** @type { [typeof RetailDash, ] } */ ;
        // @ts-ignore
        const __VLS_5 = __VLS_asFunctionalComponent(RetailDash, new RetailDash({}));
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
            UserDash: UserDash,
            RetailDash: RetailDash,
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
