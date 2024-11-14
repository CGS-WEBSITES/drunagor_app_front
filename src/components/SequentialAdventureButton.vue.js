import { CampaignStore } from "@/store/CampaignStore";
import { HeroStore } from "@/store/HeroStore";
import { SequentialAdventureState } from "@/store/Hero";
import { useI18n } from "vue-i18n";
const { defineProps, defineSlots, defineEmits, defineExpose, defineModel, defineOptions, withDefaults, } = await import('vue');
const campaignStore = CampaignStore();
const heroStore = HeroStore();
const { t } = useI18n();
const props = defineProps();
const emit = defineEmits(["sequentialAdventure"]);
function startSequentialAdventure() {
    const campaign = campaignStore.find(props.campaignId);
    campaign.isSequentialAdventure = true;
    campaign.sequentialAdventureRunes = 0;
    heroStore.findAllInCampaign(props.campaignId).forEach((hero) => {
        hero.sequentialAdventureState = new SequentialAdventureState();
    });
    emit("sequentialAdventure");
}
; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_fnComponent = (await import('vue')).defineComponent({
    emits: {},
});
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
    const __VLS_0 = __VLS_resolvedLocalAndGlobalComponents.Button;
    /** @type { [typeof __VLS_components.Button, typeof __VLS_components.Button, ] } */
    // @ts-ignore
    const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({ ...{ 'onClick': {} }, outlined: (true), id: ("sequential-adventure-btn"), label: ((__VLS_ctx.t('label.sequential-adventure'))), }));
    const __VLS_2 = __VLS_1({ ...{ 'onClick': {} }, outlined: (true), id: ("sequential-adventure-btn"), label: ((__VLS_ctx.t('label.sequential-adventure'))), }, ...__VLS_functionalComponentArgsRest(__VLS_1));
    var __VLS_6 = {};
    let __VLS_7;
    const __VLS_8 = {
        onClick: (__VLS_ctx.startSequentialAdventure)
    };
    let __VLS_3;
    let __VLS_4;
    var __VLS_5;
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
            t: t,
            startSequentialAdventure: startSequentialAdventure,
        };
    },
    emits: {},
    __typeProps: {},
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
    emits: {},
    __typeProps: {},
    __typeEl: {},
});
; /* PartiallyEnd: #4569/main.vue */
