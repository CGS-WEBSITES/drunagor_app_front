/// <reference types="../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import { computed } from "vue";
import { useRoute } from "vue-router";
import MainMenu from "@/components/MainMenu.vue";
const route = useRoute();
const isCampaignRoute = computed(() => route.name === "Campaign");
const isHeroesRoute = computed(() => route.path.includes("/campaign-tracker/heroes") || route.name === "HeroesManager");
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
    fluid: true,
    ...{ class: "pa-0 pt-14 pt-md-16" },
}));
const __VLS_2 = __VLS_1({
    fluid: true,
    ...{ class: "pa-0 pt-14 pt-md-16" },
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
var __VLS_4 = {};
__VLS_3.slots.default;
if (!__VLS_ctx.isHeroesRoute) {
    /** @type {[typeof MainMenu, ]} */ ;
    // @ts-ignore
    const __VLS_5 = __VLS_asFunctionalComponent(MainMenu, new MainMenu({}));
    const __VLS_6 = __VLS_5({}, ...__VLS_functionalComponentArgsRest(__VLS_5));
}
const __VLS_8 = {}.RouterView;
/** @type {[typeof __VLS_components.RouterView, typeof __VLS_components.routerView, ]} */ ;
// @ts-ignore
const __VLS_9 = __VLS_asFunctionalComponent(__VLS_8, new __VLS_8({}));
const __VLS_10 = __VLS_9({}, ...__VLS_functionalComponentArgsRest(__VLS_9));
var __VLS_3;
/** @type {__VLS_StyleScopedClasses['pa-0']} */ ;
/** @type {__VLS_StyleScopedClasses['pt-14']} */ ;
/** @type {__VLS_StyleScopedClasses['pt-md-16']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            MainMenu: MainMenu,
            isHeroesRoute: isHeroesRoute,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
