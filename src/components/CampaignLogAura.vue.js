/// <reference types="../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import { ref, watch } from "vue";
import { HeroStore } from "@/store/HeroStore";
import { useI18n } from "vue-i18n";
import { ConfigurationStore } from "@/store/ConfigurationStore";
const props = defineProps();
const heroStore = HeroStore();
const configurationStore = ConfigurationStore();
const { t } = useI18n();
props.repository.load(configurationStore.enabledLanguage);
const auras = props.repository.findAll();
const auraId = ref("");
auraId.value =
    heroStore.findInCampaign(props.heroId, props.campaignId).auraId ?? "";
watch(auraId, (newAuraId) => {
    heroStore.findInCampaign(props.heroId, props.campaignId).auraId = newAuraId;
});
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    'data-testid': ('campaign-log-aura-' + __VLS_ctx.heroId),
});
const __VLS_0 = {}.VAutocomplete;
/** @type {[typeof __VLS_components.VAutocomplete, typeof __VLS_components.vAutocomplete, typeof __VLS_components.VAutocomplete, typeof __VLS_components.vAutocomplete, ]} */ ;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
    clearable: true,
    modelValue: (__VLS_ctx.auraId),
    items: (__VLS_ctx.auras),
    itemTitle: "name",
    itemValue: "id",
    label: (__VLS_ctx.$t('text.select-aura')),
    hint: (__VLS_ctx.t('text.aura-info')),
    variant: "outlined",
}));
const __VLS_2 = __VLS_1({
    clearable: true,
    modelValue: (__VLS_ctx.auraId),
    items: (__VLS_ctx.auras),
    itemTitle: "name",
    itemValue: "id",
    label: (__VLS_ctx.$t('text.select-aura')),
    hint: (__VLS_ctx.t('text.aura-info')),
    variant: "outlined",
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
if (__VLS_ctx.auraId) {
    const __VLS_4 = {}.VSheet;
    /** @type {[typeof __VLS_components.VSheet, typeof __VLS_components.vSheet, typeof __VLS_components.VSheet, typeof __VLS_components.vSheet, ]} */ ;
    // @ts-ignore
    const __VLS_5 = __VLS_asFunctionalComponent(__VLS_4, new __VLS_4({
        rounded: true,
        border: "md",
        ...{ class: "mb-6 pa-6 text-white" },
        ...{ style: {} },
    }));
    const __VLS_6 = __VLS_5({
        rounded: true,
        border: "md",
        ...{ class: "mb-6 pa-6 text-white" },
        ...{ style: {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_5));
    __VLS_7.slots.default;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({});
    (props.repository.find(__VLS_ctx.auraId)?.effect);
    var __VLS_7;
}
/** @type {__VLS_StyleScopedClasses['mb-6']} */ ;
/** @type {__VLS_StyleScopedClasses['pa-6']} */ ;
/** @type {__VLS_StyleScopedClasses['text-white']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            t: t,
            auras: auras,
            auraId: auraId,
        };
    },
    __typeProps: {},
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
    __typeProps: {},
});
; /* PartiallyEnd: #4569/main.vue */
