import CampaignLogAddHero from "@/components/CampaignLogAddHero.vue";
import CampaignLogRemoveHero from "@/components/CampaignLogRemoveHero.vue";
import CampaignLog from "@/components/CampaignLog.vue";
import { useRoute } from "vue-router";
import { HeroStore } from "@/store/HeroStore";
import CampaignRemove from "@/components/CampaignRemove.vue";
import CampaignExport from "@/components/CampaignExport.vue";
import StoryRecord from "@/components/StoryRecord.vue";
import CampaignName from "@/components/CampaignName.vue";
import { CampaignStore } from "@/store/CampaignStore";
import CampaignCampPhase from "@/components/CampaignCampPhase.vue";
import { ref } from "vue";
import CampaignRunes from "@/components/CampaignRunes.vue";
import SequentialAdventureButton from "@/components/SequentialAdventureButton.vue";
const { defineProps, defineSlots, defineEmits, defineExpose, defineModel, defineOptions, withDefaults, } = await import('vue');
const route = useRoute();
const campaignId = route.params.id.toString();
const campaignStore = CampaignStore();
const campaign = campaignStore.find(campaignId);
const heroStore = HeroStore();
const isSequentialAdventure = ref(false);
isSequentialAdventure.value =
    campaignStore.find(campaignId).isSequentialAdventure ?? false;
const update = ref(0);
function onCampPhase() {
    isSequentialAdventure.value = false;
    update.value++;
}
function onSequentialAdventure() {
    isSequentialAdventure.value = true;
    update.value++;
}
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
    const __VLS_0 = __VLS_resolvedLocalAndGlobalComponents.BaseButtonMenu;
    /** @type { [typeof __VLS_components.BaseButtonMenu, typeof __VLS_components.BaseButtonMenu, ] } */
    // @ts-ignore
    const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({ ...{ class: ("mb-2") }, }));
    const __VLS_2 = __VLS_1({ ...{ class: ("mb-2") }, }, ...__VLS_functionalComponentArgsRest(__VLS_1));
    // @ts-ignore
    [CampaignRemove,];
    // @ts-ignore
    const __VLS_6 = __VLS_asFunctionalComponent(CampaignRemove, new CampaignRemove({ campaignId: ((__VLS_ctx.campaignId)), }));
    const __VLS_7 = __VLS_6({ campaignId: ((__VLS_ctx.campaignId)), }, ...__VLS_functionalComponentArgsRest(__VLS_6));
    // @ts-ignore
    [CampaignExport,];
    // @ts-ignore
    const __VLS_11 = __VLS_asFunctionalComponent(CampaignExport, new CampaignExport({ campaignId: ((__VLS_ctx.campaignId)), }));
    const __VLS_12 = __VLS_11({ campaignId: ((__VLS_ctx.campaignId)), }, ...__VLS_functionalComponentArgsRest(__VLS_11));
    // @ts-ignore
    [SequentialAdventureButton,];
    // @ts-ignore
    const __VLS_16 = __VLS_asFunctionalComponent(SequentialAdventureButton, new SequentialAdventureButton({ ...{ 'onSequentialAdventure': {} }, campaignId: ((__VLS_ctx.campaignId)), disabled: ((__VLS_ctx.isSequentialAdventure)), }));
    const __VLS_17 = __VLS_16({ ...{ 'onSequentialAdventure': {} }, campaignId: ((__VLS_ctx.campaignId)), disabled: ((__VLS_ctx.isSequentialAdventure)), }, ...__VLS_functionalComponentArgsRest(__VLS_16));
    let __VLS_21;
    const __VLS_22 = {
        onSequentialAdventure: (__VLS_ctx.onSequentialAdventure)
    };
    let __VLS_18;
    let __VLS_19;
    var __VLS_20;
    // @ts-ignore
    [CampaignCampPhase,];
    // @ts-ignore
    const __VLS_23 = __VLS_asFunctionalComponent(CampaignCampPhase, new CampaignCampPhase({ ...{ 'onCampPhase': {} }, campaignId: ((__VLS_ctx.campaignId)), }));
    const __VLS_24 = __VLS_23({ ...{ 'onCampPhase': {} }, campaignId: ((__VLS_ctx.campaignId)), }, ...__VLS_functionalComponentArgsRest(__VLS_23));
    let __VLS_28;
    const __VLS_29 = {
        onCampPhase: (__VLS_ctx.onCampPhase)
    };
    let __VLS_25;
    let __VLS_26;
    var __VLS_27;
    __VLS_nonNullable(__VLS_5.slots).default;
    var __VLS_5;
    const __VLS_30 = __VLS_resolvedLocalAndGlobalComponents.Card;
    /** @type { [typeof __VLS_components.Card, typeof __VLS_components.Card, ] } */
    // @ts-ignore
    const __VLS_31 = __VLS_asFunctionalComponent(__VLS_30, new __VLS_30({ ...{ class: ("mb-2") }, }));
    const __VLS_32 = __VLS_31({ ...{ class: ("mb-2") }, }, ...__VLS_functionalComponentArgsRest(__VLS_31));
    __VLS_elementAsFunction(__VLS_intrinsicElements.template, __VLS_intrinsicElements.template)({});
    {
        const { content: __VLS_thisSlot } = __VLS_nonNullable(__VLS_35.slots);
        // @ts-ignore
        [CampaignName,];
        // @ts-ignore
        const __VLS_36 = __VLS_asFunctionalComponent(CampaignName, new CampaignName({ campaignId: ((__VLS_ctx.campaignId)), }));
        const __VLS_37 = __VLS_36({ campaignId: ((__VLS_ctx.campaignId)), }, ...__VLS_functionalComponentArgsRest(__VLS_36));
    }
    var __VLS_35;
    if (__VLS_ctx.isSequentialAdventure) {
        const __VLS_41 = __VLS_resolvedLocalAndGlobalComponents.Card;
        /** @type { [typeof __VLS_components.Card, typeof __VLS_components.Card, ] } */
        // @ts-ignore
        const __VLS_42 = __VLS_asFunctionalComponent(__VLS_41, new __VLS_41({}));
        const __VLS_43 = __VLS_42({}, ...__VLS_functionalComponentArgsRest(__VLS_42));
        __VLS_elementAsFunction(__VLS_intrinsicElements.template, __VLS_intrinsicElements.template)({});
        {
            const { content: __VLS_thisSlot } = __VLS_nonNullable(__VLS_46.slots);
            // @ts-ignore
            [CampaignRunes,];
            // @ts-ignore
            const __VLS_47 = __VLS_asFunctionalComponent(CampaignRunes, new CampaignRunes({ campaignId: ((__VLS_ctx.campaignId)), }));
            const __VLS_48 = __VLS_47({ campaignId: ((__VLS_ctx.campaignId)), }, ...__VLS_functionalComponentArgsRest(__VLS_47));
        }
        var __VLS_46;
    }
    if (__VLS_ctx.campaign.campaign == 'awakenings' || __VLS_ctx.campaign.campaign == 'apocalypse') {
        __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ ...{ class: ("bg-neutral form-control drop-shadow rounded-lg mb-2") }, key: ((__VLS_ctx.update)), });
        // @ts-ignore
        [StoryRecord,];
        // @ts-ignore
        const __VLS_52 = __VLS_asFunctionalComponent(StoryRecord, new StoryRecord({ campaignId: ((__VLS_ctx.campaignId)), }));
        const __VLS_53 = __VLS_52({ campaignId: ((__VLS_ctx.campaignId)), }, ...__VLS_functionalComponentArgsRest(__VLS_52));
    }
    if (__VLS_ctx.campaign.campaign == 'apocalypse') {
        __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ ...{ class: ("bg-neutral form-control drop-shadow rounded-lg mb-2") }, key: ((__VLS_ctx.update)), });
        __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ ...{ class: ("p-4") }, ...{ style: ({}) }, });
        __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ ...{ class: ("pt-2 w-full") }, });
        const __VLS_57 = __VLS_resolvedLocalAndGlobalComponents.StoryRecordLegacyTrail;
        /** @type { [typeof __VLS_components.StoryRecordLegacyTrail, ] } */
        // @ts-ignore
        const __VLS_58 = __VLS_asFunctionalComponent(__VLS_57, new __VLS_57({ campaignId: ((__VLS_ctx.campaignId)), }));
        const __VLS_59 = __VLS_58({ campaignId: ((__VLS_ctx.campaignId)), }, ...__VLS_functionalComponentArgsRest(__VLS_58));
        __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ ...{ class: ("pt-4 w-full") }, });
        const __VLS_63 = __VLS_resolvedLocalAndGlobalComponents.StoryRecordBackgroundAndTrait;
        /** @type { [typeof __VLS_components.StoryRecordBackgroundAndTrait, ] } */
        // @ts-ignore
        const __VLS_64 = __VLS_asFunctionalComponent(__VLS_63, new __VLS_63({ campaignId: ((__VLS_ctx.campaignId)), }));
        const __VLS_65 = __VLS_64({ campaignId: ((__VLS_ctx.campaignId)), }, ...__VLS_functionalComponentArgsRest(__VLS_64));
    }
    const __VLS_69 = __VLS_resolvedLocalAndGlobalComponents.BaseButtonMenu;
    /** @type { [typeof __VLS_components.BaseButtonMenu, typeof __VLS_components.BaseButtonMenu, ] } */
    // @ts-ignore
    const __VLS_70 = __VLS_asFunctionalComponent(__VLS_69, new __VLS_69({}));
    const __VLS_71 = __VLS_70({}, ...__VLS_functionalComponentArgsRest(__VLS_70));
    // @ts-ignore
    [CampaignLogAddHero,];
    // @ts-ignore
    const __VLS_75 = __VLS_asFunctionalComponent(CampaignLogAddHero, new CampaignLogAddHero({ campaignId: ((__VLS_ctx.campaignId)), }));
    const __VLS_76 = __VLS_75({ campaignId: ((__VLS_ctx.campaignId)), }, ...__VLS_functionalComponentArgsRest(__VLS_75));
    // @ts-ignore
    [CampaignLogRemoveHero,];
    // @ts-ignore
    const __VLS_80 = __VLS_asFunctionalComponent(CampaignLogRemoveHero, new CampaignLogRemoveHero({ campaignId: ((__VLS_ctx.campaignId)), }));
    const __VLS_81 = __VLS_80({ campaignId: ((__VLS_ctx.campaignId)), }, ...__VLS_functionalComponentArgsRest(__VLS_80));
    __VLS_nonNullable(__VLS_74.slots).default;
    var __VLS_74;
    __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ id: ("heroes"), ...{ class: ("grid pt-2 gap-2 w-full") }, key: ((__VLS_ctx.update)), });
    for (const [hero] of __VLS_getVForSourceType((__VLS_ctx.heroStore.findAllInCampaign(__VLS_ctx.campaignId)))) {
        __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ ...{ class: ("bg-neutral form-control drop-shadow rounded-lg") }, });
        // @ts-ignore
        [CampaignLog,];
        // @ts-ignore
        const __VLS_85 = __VLS_asFunctionalComponent(CampaignLog, new CampaignLog({ campaignId: ((__VLS_ctx.campaignId)), heroId: ((hero.heroId)), isSequentialAdventure: ((__VLS_ctx.isSequentialAdventure)), }));
        const __VLS_86 = __VLS_85({ campaignId: ((__VLS_ctx.campaignId)), heroId: ((hero.heroId)), isSequentialAdventure: ((__VLS_ctx.isSequentialAdventure)), }, ...__VLS_functionalComponentArgsRest(__VLS_85));
    }
    __VLS_styleScopedClasses['mb-2'];
    __VLS_styleScopedClasses['mb-2'];
    __VLS_styleScopedClasses['bg-neutral'];
    __VLS_styleScopedClasses['form-control'];
    __VLS_styleScopedClasses['drop-shadow'];
    __VLS_styleScopedClasses['rounded-lg'];
    __VLS_styleScopedClasses['mb-2'];
    __VLS_styleScopedClasses['bg-neutral'];
    __VLS_styleScopedClasses['form-control'];
    __VLS_styleScopedClasses['drop-shadow'];
    __VLS_styleScopedClasses['rounded-lg'];
    __VLS_styleScopedClasses['mb-2'];
    __VLS_styleScopedClasses['p-4'];
    __VLS_styleScopedClasses['pt-2'];
    __VLS_styleScopedClasses['w-full'];
    __VLS_styleScopedClasses['pt-4'];
    __VLS_styleScopedClasses['w-full'];
    __VLS_styleScopedClasses['grid'];
    __VLS_styleScopedClasses['pt-2'];
    __VLS_styleScopedClasses['gap-2'];
    __VLS_styleScopedClasses['w-full'];
    __VLS_styleScopedClasses['bg-neutral'];
    __VLS_styleScopedClasses['form-control'];
    __VLS_styleScopedClasses['drop-shadow'];
    __VLS_styleScopedClasses['rounded-lg'];
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
            CampaignLogAddHero: CampaignLogAddHero,
            CampaignLogRemoveHero: CampaignLogRemoveHero,
            CampaignLog: CampaignLog,
            CampaignRemove: CampaignRemove,
            CampaignExport: CampaignExport,
            StoryRecord: StoryRecord,
            CampaignName: CampaignName,
            CampaignCampPhase: CampaignCampPhase,
            CampaignRunes: CampaignRunes,
            SequentialAdventureButton: SequentialAdventureButton,
            campaignId: campaignId,
            campaign: campaign,
            heroStore: heroStore,
            isSequentialAdventure: isSequentialAdventure,
            update: update,
            onCampPhase: onCampPhase,
            onSequentialAdventure: onSequentialAdventure,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
