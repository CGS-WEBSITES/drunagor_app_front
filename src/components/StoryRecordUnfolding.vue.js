import { ref, watch } from "vue";
import { StoryRecordUnfoldingRepository } from "@/data/repository/campaign/apocalypse/StoryRecordUnfoldingRepository";
import { CampaignStore } from "@/store/CampaignStore";
const { defineProps, defineSlots, defineEmits, defineExpose, defineModel, defineOptions, withDefaults, } = await import('vue');
const props = defineProps();
const campaignStore = CampaignStore();
const repository = new StoryRecordUnfoldingRepository();
const unfoldings = repository.findAll();
const unfoldingIds = ref([]);
unfoldingIds.value = campaignStore.find(props.campaignId).unfoldingIds ?? [];
function findUnfoldings(followerIds) {
    const outcomes = [];
    followerIds.forEach((followerId) => {
        let outcome = repository.find(followerId);
        if (outcome) {
            outcomes.push(outcome);
        }
    });
    return outcomes;
}
watch(unfoldingIds, (newUnfoldingIds) => {
    campaignStore.find(props.campaignId).unfoldingIds = newUnfoldingIds;
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
    __VLS_elementAsFunction(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({ "data-testid": ("story-record-unfolding"), });
    const __VLS_0 = __VLS_resolvedLocalAndGlobalComponents.MultiSelect;
    /** @type { [typeof __VLS_components.MultiSelect, ] } */
    // @ts-ignore
    const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({ modelValue: ((__VLS_ctx.unfoldingIds)), options: ((__VLS_ctx.unfoldings)), maxSelectedLabels: ((1)), filter: (true), optionLabel: ("name"), optionValue: ("id"), placeholder: ("Add or remove unfolding"), ...{ class: ("w-full md:w-14rem") }, }));
    const __VLS_2 = __VLS_1({ modelValue: ((__VLS_ctx.unfoldingIds)), options: ((__VLS_ctx.unfoldings)), maxSelectedLabels: ((1)), filter: (true), optionLabel: ("name"), optionValue: ("id"), placeholder: ("Add or remove unfolding"), ...{ class: ("w-full md:w-14rem") }, }, ...__VLS_functionalComponentArgsRest(__VLS_1));
    if (__VLS_ctx.unfoldingIds.length > 0) {
        for (const [unfolding] of __VLS_getVForSourceType((__VLS_ctx.findUnfoldings(__VLS_ctx.unfoldingIds)))) {
            __VLS_elementAsFunction(__VLS_intrinsicElements.ul, __VLS_intrinsicElements.ul)({ ...{ class: ("list-disc list-inside py-2") }, });
            __VLS_elementAsFunction(__VLS_intrinsicElements.li, __VLS_intrinsicElements.li)({});
            (unfolding.name);
        }
    }
    __VLS_styleScopedClasses['w-full'];
    __VLS_styleScopedClasses['md:w-14rem'];
    __VLS_styleScopedClasses['list-disc'];
    __VLS_styleScopedClasses['list-inside'];
    __VLS_styleScopedClasses['py-2'];
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
            unfoldings: unfoldings,
            unfoldingIds: unfoldingIds,
            findUnfoldings: findUnfoldings,
        };
    },
    __typeProps: {},
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
    __typeProps: {},
    __typeEl: {},
});
; /* PartiallyEnd: #4569/main.vue */
