import ConfigurationContentHero from "@/components/ConfigurationContentHero.vue";
import ConfigurationContentMonster from "@/components/ConfigurationContentMonster.vue";
import ConfigurationLanguage from "@/components/ConfigurationLanguage.vue";
import ConfigurationVariant from "@/components/ConfigurationVariant.vue";
const { defineProps, defineSlots, defineEmits, defineExpose, defineModel, defineOptions, withDefaults, } = await import('vue');
; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_fnComponent = (await import('vue')).defineComponent({});
;
let __VLS_functionalComponentProps;
function __VLS_template() {
    const __VLS_ctx = {};
    const __VLS_localComponents = {
        ...{},
        ...{},
        ...__VLS_ctx,
    };
    let __VLS_components;
    const __VLS_localDirectives = {
        ...{},
        ...__VLS_ctx,
    };
    let __VLS_directives;
    let __VLS_styleScopedClasses;
    // CSS variable injection 
    // CSS variable injection end 
    let __VLS_resolvedLocalAndGlobalComponents;
    __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ ...{ class: ("grid gap-4 place-items-center w-full") }, });
    // @ts-ignore
    [ConfigurationLanguage,];
    // @ts-ignore
    const __VLS_0 = __VLS_asFunctionalComponent(ConfigurationLanguage, new ConfigurationLanguage({}));
    const __VLS_1 = __VLS_0({}, ...__VLS_functionalComponentArgsRest(__VLS_0));
    // @ts-ignore
    [ConfigurationVariant,];
    // @ts-ignore
    const __VLS_5 = __VLS_asFunctionalComponent(ConfigurationVariant, new ConfigurationVariant({}));
    const __VLS_6 = __VLS_5({}, ...__VLS_functionalComponentArgsRest(__VLS_5));
    // @ts-ignore
    [ConfigurationContentMonster,];
    // @ts-ignore
    const __VLS_10 = __VLS_asFunctionalComponent(ConfigurationContentMonster, new ConfigurationContentMonster({}));
    const __VLS_11 = __VLS_10({}, ...__VLS_functionalComponentArgsRest(__VLS_10));
    // @ts-ignore
    [ConfigurationContentHero,];
    // @ts-ignore
    const __VLS_15 = __VLS_asFunctionalComponent(ConfigurationContentHero, new ConfigurationContentHero({}));
    const __VLS_16 = __VLS_15({}, ...__VLS_functionalComponentArgsRest(__VLS_15));
    __VLS_styleScopedClasses['grid'];
    __VLS_styleScopedClasses['gap-4'];
    __VLS_styleScopedClasses['place-items-center'];
    __VLS_styleScopedClasses['w-full'];
    var __VLS_slots;
    var __VLS_inheritedAttrs;
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
    __typeEl: {},
});
; /* PartiallyEnd: #4569/main.vue */
