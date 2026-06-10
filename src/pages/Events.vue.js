/// <reference types="../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import { computed } from "vue";
import { useUserStore } from "@/store/UserStore";
import UserEvents from "@/components/UserEvents.vue";
import RetailEvents from "@/components/RetailEvents.vue";
// Obtém o usuário da store
const user = computed(() => useUserStore().user);
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
if (__VLS_ctx.user?.roles_fk === 2) {
    /** @type {[typeof UserEvents, ]} */ ;
    // @ts-ignore
    const __VLS_0 = __VLS_asFunctionalComponent(UserEvents, new UserEvents({}));
    const __VLS_1 = __VLS_0({}, ...__VLS_functionalComponentArgsRest(__VLS_0));
}
else if (__VLS_ctx.user?.roles_fk === 3) {
    /** @type {[typeof RetailEvents, ]} */ ;
    // @ts-ignore
    const __VLS_3 = __VLS_asFunctionalComponent(RetailEvents, new RetailEvents({}));
    const __VLS_4 = __VLS_3({}, ...__VLS_functionalComponentArgsRest(__VLS_3));
}
else {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({});
}
var __VLS_dollars;
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
});
; /* PartiallyEnd: #4569/main.vue */
