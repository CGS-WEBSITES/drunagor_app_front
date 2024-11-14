import CampaignLogAura from "@/components/CampaignLogAura.vue";
import CampaignLogStatus from "@/components/CampaignLogStatus.vue";
import { CampaignLogStatusRepository } from "@/data/repository/campaign/awakenings/CampaignLogStatusRepository";
import { CampaignLogAuraRepository } from "@/data/repository/campaign/awakenings/CampaignLogAuraRepository";
import { useI18n } from "vue-i18n";
const { defineProps, defineSlots, defineEmits, defineExpose, defineModel, defineOptions, withDefaults, } = await import('vue');
const props = defineProps();
const statusRepository = new CampaignLogStatusRepository();
const auraRepository = new CampaignLogAuraRepository();
const { t } = useI18n();
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
    __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ ...{ class: ("pt-2 w-full") }, });
    // @ts-ignore
    [CampaignLogStatus,];
    // @ts-ignore
    const __VLS_0 = __VLS_asFunctionalComponent(CampaignLogStatus, new CampaignLogStatus({ repository: ((__VLS_ctx.statusRepository)), campaignId: ((props.campaignId)), heroId: ((props.heroId)), }));
    const __VLS_1 = __VLS_0({ repository: ((__VLS_ctx.statusRepository)), campaignId: ((props.campaignId)), heroId: ((props.heroId)), }, ...__VLS_functionalComponentArgsRest(__VLS_0));
    __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ ...{ class: ("pt-2 w-full") }, });
    // @ts-ignore
    [CampaignLogAura,];
    // @ts-ignore
    const __VLS_5 = __VLS_asFunctionalComponent(CampaignLogAura, new CampaignLogAura({ repository: ((__VLS_ctx.auraRepository)), campaignId: ((props.campaignId)), heroId: ((props.heroId)), }));
    const __VLS_6 = __VLS_5({ repository: ((__VLS_ctx.auraRepository)), campaignId: ((props.campaignId)), heroId: ((props.heroId)), }, ...__VLS_functionalComponentArgsRest(__VLS_5));
    __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ ...{ class: ("pt-4 w-full") }, });
    const __VLS_10 = __VLS_resolvedLocalAndGlobalComponents.RouterLink;
    /** @type { [typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, ] } */
    // @ts-ignore
    const __VLS_11 = __VLS_asFunctionalComponent(__VLS_10, new __VLS_10({ to: (({ name: 'Hero', params: { campaignId: __VLS_ctx.campaignId, heroId: props.heroId } })), ...{ class: ("hero-detail-btn") }, }));
    const __VLS_12 = __VLS_11({ to: (({ name: 'Hero', params: { campaignId: __VLS_ctx.campaignId, heroId: props.heroId } })), ...{ class: ("hero-detail-btn") }, }, ...__VLS_functionalComponentArgsRest(__VLS_11));
    const __VLS_16 = __VLS_resolvedLocalAndGlobalComponents.Button;
    /** @type { [typeof __VLS_components.Button, typeof __VLS_components.Button, ] } */
    // @ts-ignore
    const __VLS_17 = __VLS_asFunctionalComponent(__VLS_16, new __VLS_16({ outlined: (true), label: ((__VLS_ctx.t('label.equipment-skills'))), ...{ class: ("w-full") }, }));
    const __VLS_18 = __VLS_17({ outlined: (true), label: ((__VLS_ctx.t('label.equipment-skills'))), ...{ class: ("w-full") }, }, ...__VLS_functionalComponentArgsRest(__VLS_17));
    __VLS_nonNullable(__VLS_15.slots).default;
    var __VLS_15;
    __VLS_styleScopedClasses['pt-2'];
    __VLS_styleScopedClasses['w-full'];
    __VLS_styleScopedClasses['pt-2'];
    __VLS_styleScopedClasses['w-full'];
    __VLS_styleScopedClasses['pt-4'];
    __VLS_styleScopedClasses['w-full'];
    __VLS_styleScopedClasses['hero-detail-btn'];
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
            CampaignLogAura: CampaignLogAura,
            CampaignLogStatus: CampaignLogStatus,
            statusRepository: statusRepository,
            auraRepository: auraRepository,
            t: t,
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
