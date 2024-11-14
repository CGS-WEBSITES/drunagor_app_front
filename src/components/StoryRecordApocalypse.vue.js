import { StoryRecordStatusRepository } from "@/data/repository/campaign/apocalypse/StoryRecordStatusRepository";
import { StoryRecordOutcomeRepository } from "@/data/repository/campaign/apocalypse/StoryRecordOutcomeRepository";
import { StoryRecordFollowerRepository } from "@/data/repository/campaign/apocalypse/StoryRecordFollowerRepository";
import StoryRecordStatus from "@/components/StoryRecordStatus.vue";
import StoryRecordOutcome from "@/components/StoryRecordOutcome.vue";
import StoryRecordFollower from "@/components/StoryRecordFollower.vue";
import StoryRecordUnfolding from "@/components/StoryRecordUnfolding.vue";
const { defineProps, defineSlots, defineEmits, defineExpose, defineModel, defineOptions, withDefaults, } = await import('vue');
const props = defineProps();
const statusRepository = new StoryRecordStatusRepository();
const outcomeRepository = new StoryRecordOutcomeRepository();
const followerRepository = new StoryRecordFollowerRepository();
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
    [StoryRecordFollower,];
    // @ts-ignore
    const __VLS_0 = __VLS_asFunctionalComponent(StoryRecordFollower, new StoryRecordFollower({ repository: ((__VLS_ctx.followerRepository)), campaignId: ((props.campaignId)), }));
    const __VLS_1 = __VLS_0({ repository: ((__VLS_ctx.followerRepository)), campaignId: ((props.campaignId)), }, ...__VLS_functionalComponentArgsRest(__VLS_0));
    __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ ...{ class: ("pt-2 w-full") }, });
    // @ts-ignore
    [StoryRecordOutcome,];
    // @ts-ignore
    const __VLS_5 = __VLS_asFunctionalComponent(StoryRecordOutcome, new StoryRecordOutcome({ repository: ((__VLS_ctx.outcomeRepository)), campaignId: ((props.campaignId)), }));
    const __VLS_6 = __VLS_5({ repository: ((__VLS_ctx.outcomeRepository)), campaignId: ((props.campaignId)), }, ...__VLS_functionalComponentArgsRest(__VLS_5));
    __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ ...{ class: ("pt-2 w-full") }, });
    // @ts-ignore
    [StoryRecordStatus,];
    // @ts-ignore
    const __VLS_10 = __VLS_asFunctionalComponent(StoryRecordStatus, new StoryRecordStatus({ repository: ((__VLS_ctx.statusRepository)), campaignId: ((props.campaignId)), }));
    const __VLS_11 = __VLS_10({ repository: ((__VLS_ctx.statusRepository)), campaignId: ((props.campaignId)), }, ...__VLS_functionalComponentArgsRest(__VLS_10));
    __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ ...{ class: ("pt-2 w-full") }, });
    // @ts-ignore
    [StoryRecordUnfolding,];
    // @ts-ignore
    const __VLS_15 = __VLS_asFunctionalComponent(StoryRecordUnfolding, new StoryRecordUnfolding({ campaignId: ((props.campaignId)), }));
    const __VLS_16 = __VLS_15({ campaignId: ((props.campaignId)), }, ...__VLS_functionalComponentArgsRest(__VLS_15));
    __VLS_styleScopedClasses['pt-2'];
    __VLS_styleScopedClasses['w-full'];
    __VLS_styleScopedClasses['pt-2'];
    __VLS_styleScopedClasses['w-full'];
    __VLS_styleScopedClasses['pt-2'];
    __VLS_styleScopedClasses['w-full'];
    __VLS_styleScopedClasses['pt-2'];
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
            StoryRecordStatus: StoryRecordStatus,
            StoryRecordOutcome: StoryRecordOutcome,
            StoryRecordFollower: StoryRecordFollower,
            StoryRecordUnfolding: StoryRecordUnfolding,
            statusRepository: statusRepository,
            outcomeRepository: outcomeRepository,
            followerRepository: followerRepository,
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
