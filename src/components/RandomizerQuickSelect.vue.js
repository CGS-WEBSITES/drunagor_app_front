import ConfigurationContentMonster from "./ConfigurationContentMonster.vue";
import ConfigurationVariant from "./ConfigurationVariant.vue";
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
    const __VLS_0 = __VLS_resolvedLocalAndGlobalComponents.VExpansionPanels;
    /** @type { [typeof __VLS_components.VExpansionPanels, typeof __VLS_components.vExpansionPanels, typeof __VLS_components.VExpansionPanels, typeof __VLS_components.vExpansionPanels, ] } */
    // @ts-ignore
    const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({}));
    const __VLS_2 = __VLS_1({}, ...__VLS_functionalComponentArgsRest(__VLS_1));
    var __VLS_6 = {};
    const __VLS_7 = __VLS_resolvedLocalAndGlobalComponents.VExpansionPanel;
    /** @type { [typeof __VLS_components.VExpansionPanel, typeof __VLS_components.vExpansionPanel, typeof __VLS_components.VExpansionPanel, typeof __VLS_components.vExpansionPanel, ] } */
    // @ts-ignore
    const __VLS_8 = __VLS_asFunctionalComponent(__VLS_7, new __VLS_7({ dark: (true), title: ((__VLS_ctx.$t('randomizer.enabled-content'))), ...{ class: ("px-4") }, }));
    const __VLS_9 = __VLS_8({ dark: (true), title: ((__VLS_ctx.$t('randomizer.enabled-content'))), ...{ class: ("px-4") }, }, ...__VLS_functionalComponentArgsRest(__VLS_8));
    const __VLS_13 = __VLS_resolvedLocalAndGlobalComponents.VExpansionPanelText;
    /** @type { [typeof __VLS_components.VExpansionPanelText, typeof __VLS_components.vExpansionPanelText, typeof __VLS_components.VExpansionPanelText, typeof __VLS_components.vExpansionPanelText, ] } */
    // @ts-ignore
    const __VLS_14 = __VLS_asFunctionalComponent(__VLS_13, new __VLS_13({}));
    const __VLS_15 = __VLS_14({}, ...__VLS_functionalComponentArgsRest(__VLS_14));
    // @ts-ignore
    [ConfigurationVariant,];
    // @ts-ignore
    const __VLS_19 = __VLS_asFunctionalComponent(ConfigurationVariant, new ConfigurationVariant({}));
    const __VLS_20 = __VLS_19({}, ...__VLS_functionalComponentArgsRest(__VLS_19));
    // @ts-ignore
    [ConfigurationContentMonster,];
    // @ts-ignore
    const __VLS_24 = __VLS_asFunctionalComponent(ConfigurationContentMonster, new ConfigurationContentMonster({}));
    const __VLS_25 = __VLS_24({}, ...__VLS_functionalComponentArgsRest(__VLS_24));
    __VLS_nonNullable(__VLS_18.slots).default;
    var __VLS_18;
    __VLS_nonNullable(__VLS_12.slots).default;
    var __VLS_12;
    __VLS_nonNullable(__VLS_5.slots).default;
    var __VLS_5;
    __VLS_styleScopedClasses['px-4'];
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
            ConfigurationContentMonster: ConfigurationContentMonster,
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
