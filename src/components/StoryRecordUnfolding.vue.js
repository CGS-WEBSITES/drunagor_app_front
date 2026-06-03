/// <reference types="../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import { ref, watch } from "vue";
import { StoryRecordUnfoldingRepository } from "@/data/repository/campaign/apocalypse/StoryRecordUnfoldingRepository";
import { CampaignStore } from "@/store/CampaignStore";
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
    console.log("findUnfoldings", findUnfoldings(newUnfoldingIds));
});
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    'data-testid': "story-record-unfolding",
});
const __VLS_0 = {}.VSelect;
/** @type {[typeof __VLS_components.VSelect, typeof __VLS_components.vSelect, typeof __VLS_components.VSelect, typeof __VLS_components.vSelect, ]} */ ;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
    modelValue: (__VLS_ctx.unfoldingIds),
    clearable: true,
    chips: true,
    label: "Add or remove unfolding",
    items: (__VLS_ctx.unfoldings),
    itemTitle: "name",
    itemValue: "id",
    multiple: true,
    variant: "outlined",
}));
const __VLS_2 = __VLS_1({
    modelValue: (__VLS_ctx.unfoldingIds),
    clearable: true,
    chips: true,
    label: "Add or remove unfolding",
    items: (__VLS_ctx.unfoldings),
    itemTitle: "name",
    itemValue: "id",
    multiple: true,
    variant: "outlined",
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
if (__VLS_ctx.unfoldingIds.length > 0) {
    const __VLS_4 = {}.VSheet;
    /** @type {[typeof __VLS_components.VSheet, typeof __VLS_components.vSheet, typeof __VLS_components.VSheet, typeof __VLS_components.vSheet, ]} */ ;
    // @ts-ignore
    const __VLS_5 = __VLS_asFunctionalComponent(__VLS_4, new __VLS_4({
        rounded: true,
        border: "md",
        ...{ class: "mb-6 pa-6 text-white" },
    }));
    const __VLS_6 = __VLS_5({
        rounded: true,
        border: "md",
        ...{ class: "mb-6 pa-6 text-white" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_5));
    __VLS_7.slots.default;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.ul, __VLS_intrinsicElements.ul)({});
    for (const [unfolding] of __VLS_getVForSourceType((__VLS_ctx.findUnfoldings(__VLS_ctx.unfoldingIds)))) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.li, __VLS_intrinsicElements.li)({
            ...{ class: "py-1" },
            key: (unfolding.id),
        });
        (unfolding.name);
    }
    var __VLS_7;
}
/** @type {__VLS_StyleScopedClasses['mb-6']} */ ;
/** @type {__VLS_StyleScopedClasses['pa-6']} */ ;
/** @type {__VLS_StyleScopedClasses['text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['py-1']} */ ;
var __VLS_dollars;
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
});
; /* PartiallyEnd: #4569/main.vue */
