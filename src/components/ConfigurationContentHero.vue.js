import { ContentDataStore } from "@/data/store/ContentDataStore";
import { ConfigurationStore } from "@/store/ConfigurationStore";
import { watch, ref } from "vue";
import { useToast } from "primevue/usetoast";
import { useI18n } from "vue-i18n";
const { defineProps, defineSlots, defineEmits, defineExpose, defineModel, defineOptions, withDefaults, } = await import('vue');
const toast = useToast();
const { t } = useI18n();
const contentStore = ContentDataStore();
const configurationStore = ConfigurationStore();
const heroContentSettings = ref([]);
configurationStore.enabledHeroContent.forEach((enabledContent) => {
    heroContentSettings.value.push(enabledContent);
});
watch(heroContentSettings, async (newSettings) => {
    if (newSettings.length > 0) {
        configurationStore.$patch({ enabledHeroContent: newSettings });
    }
    else {
        toast.add({
            severity: "error",
            summary: "Error",
            detail: t("configuration.error.atleast-one-selected"),
            life: 3000,
        });
    }
});
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
    const __VLS_0 = __VLS_resolvedLocalAndGlobalComponents.Card;
    /** @type { [typeof __VLS_components.Card, typeof __VLS_components.Card, ] } */
    // @ts-ignore
    const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({ ...{ class: ("w-full") }, dataTestid: ("configuration-content-hero"), }));
    const __VLS_2 = __VLS_1({ ...{ class: ("w-full") }, dataTestid: ("configuration-content-hero"), }, ...__VLS_functionalComponentArgsRest(__VLS_1));
    var __VLS_6 = {};
    __VLS_elementAsFunction(__VLS_intrinsicElements.template, __VLS_intrinsicElements.template)({});
    {
        const { title: __VLS_thisSlot } = __VLS_nonNullable(__VLS_5.slots);
        (__VLS_ctx.$t("configuration.hero-content"));
    }
    __VLS_elementAsFunction(__VLS_intrinsicElements.template, __VLS_intrinsicElements.template)({});
    {
        const { content: __VLS_thisSlot } = __VLS_nonNullable(__VLS_5.slots);
        for (const [content] of __VLS_getVForSourceType((__VLS_ctx.contentStore.getAllWithHeroes()))) {
            __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ key: ((content.id)), ...{ class: ("pb-4") }, });
            __VLS_elementAsFunction(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({ ...{ class: ("cursor-pointer") }, });
            (__VLS_ctx.$t(content.translation_key));
            const __VLS_7 = __VLS_resolvedLocalAndGlobalComponents.Checkbox;
            /** @type { [typeof __VLS_components.Checkbox, ] } */
            // @ts-ignore
            const __VLS_8 = __VLS_asFunctionalComponent(__VLS_7, new __VLS_7({ variant: ("outlined"), dataTestid: (('configuration-content-hero-' + content.id)), modelValue: ((__VLS_ctx.heroContentSettings)), value: ((content.id)), ...{ class: ("float-right") }, }));
            const __VLS_9 = __VLS_8({ variant: ("outlined"), dataTestid: (('configuration-content-hero-' + content.id)), modelValue: ((__VLS_ctx.heroContentSettings)), value: ((content.id)), ...{ class: ("float-right") }, }, ...__VLS_functionalComponentArgsRest(__VLS_8));
        }
    }
    var __VLS_5;
    __VLS_styleScopedClasses['w-full'];
    __VLS_styleScopedClasses['pb-4'];
    __VLS_styleScopedClasses['cursor-pointer'];
    __VLS_styleScopedClasses['float-right'];
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
            contentStore: contentStore,
            heroContentSettings: heroContentSettings,
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
