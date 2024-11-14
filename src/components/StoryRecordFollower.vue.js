import { ref, watch } from "vue";
import { CampaignStore } from "@/store/CampaignStore";
const { defineProps, defineSlots, defineEmits, defineExpose, defineModel, defineOptions, withDefaults, } = await import('vue');
const props = defineProps();
const campaignStore = CampaignStore();
const followers = props.repository.findAll();
const followerIds = ref([]);
followerIds.value = campaignStore.find(props.campaignId).followerIds ?? [];
function findFollowers(followerIds) {
    const followers = [];
    followerIds.forEach((followerId) => {
        let follower = props.repository.find(followerId);
        if (follower) {
            followers.push(follower);
        }
    });
    return followers;
}
watch(followerIds, (newFollowerIds) => {
    campaignStore.find(props.campaignId).followerIds = newFollowerIds;
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
    __VLS_elementAsFunction(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({ "data-testid": ("story-record-follower"), });
    const __VLS_0 = __VLS_resolvedLocalAndGlobalComponents.MultiSelect;
    /** @type { [typeof __VLS_components.MultiSelect, ] } */
    // @ts-ignore
    const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({ modelValue: ((__VLS_ctx.followerIds)), options: ((__VLS_ctx.followers)), maxSelectedLabels: ((1)), filter: (true), optionLabel: ("name"), optionValue: ("id"), placeholder: ((__VLS_ctx.$t('text.add-or-remove-follower'))), ...{ class: ("w-full md:w-14rem") }, }));
    const __VLS_2 = __VLS_1({ modelValue: ((__VLS_ctx.followerIds)), options: ((__VLS_ctx.followers)), maxSelectedLabels: ((1)), filter: (true), optionLabel: ("name"), optionValue: ("id"), placeholder: ((__VLS_ctx.$t('text.add-or-remove-follower'))), ...{ class: ("w-full md:w-14rem") }, }, ...__VLS_functionalComponentArgsRest(__VLS_1));
    if (__VLS_ctx.followerIds.length > 0) {
        for (const [follower] of __VLS_getVForSourceType((__VLS_ctx.findFollowers(__VLS_ctx.followerIds)))) {
            __VLS_elementAsFunction(__VLS_intrinsicElements.ul, __VLS_intrinsicElements.ul)({ ...{ class: ("list-disc list-inside pt-2") }, });
            __VLS_elementAsFunction(__VLS_intrinsicElements.li, __VLS_intrinsicElements.li)({});
            (follower.name);
        }
    }
    __VLS_styleScopedClasses['w-full'];
    __VLS_styleScopedClasses['md:w-14rem'];
    __VLS_styleScopedClasses['list-disc'];
    __VLS_styleScopedClasses['list-inside'];
    __VLS_styleScopedClasses['pt-2'];
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
            followers: followers,
            followerIds: followerIds,
            findFollowers: findFollowers,
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
