/// <reference types="../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import ConfigurationContentHero from "@/components/ConfigurationContentHero.vue";
import ConfigurationContentMonster from "@/components/ConfigurationContentMonster.vue";
import ConfigurationLanguage from "@/components/ConfigurationLanguage.vue";
import ConfigurationVariant from "@/components/ConfigurationVariant.vue";
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "grid gap-4 place-items-center w-full" },
});
/** @type {[typeof ConfigurationLanguage, ]} */ ;
// @ts-ignore
const __VLS_0 = __VLS_asFunctionalComponent(ConfigurationLanguage, new ConfigurationLanguage({}));
const __VLS_1 = __VLS_0({}, ...__VLS_functionalComponentArgsRest(__VLS_0));
/** @type {[typeof ConfigurationVariant, ]} */ ;
// @ts-ignore
const __VLS_3 = __VLS_asFunctionalComponent(ConfigurationVariant, new ConfigurationVariant({}));
const __VLS_4 = __VLS_3({}, ...__VLS_functionalComponentArgsRest(__VLS_3));
/** @type {[typeof ConfigurationContentMonster, ]} */ ;
// @ts-ignore
const __VLS_6 = __VLS_asFunctionalComponent(ConfigurationContentMonster, new ConfigurationContentMonster({}));
const __VLS_7 = __VLS_6({}, ...__VLS_functionalComponentArgsRest(__VLS_6));
/** @type {[typeof ConfigurationContentHero, ]} */ ;
// @ts-ignore
const __VLS_9 = __VLS_asFunctionalComponent(ConfigurationContentHero, new ConfigurationContentHero({}));
const __VLS_10 = __VLS_9({}, ...__VLS_functionalComponentArgsRest(__VLS_9));
/** @type {__VLS_StyleScopedClasses['grid']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-4']} */ ;
/** @type {__VLS_StyleScopedClasses['place-items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            ConfigurationContentHero: ConfigurationContentHero,
            ConfigurationContentMonster: ConfigurationContentMonster,
            ConfigurationLanguage: ConfigurationLanguage,
            ConfigurationVariant: ConfigurationVariant,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
