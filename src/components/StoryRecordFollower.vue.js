/// <reference types="../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import { ref, watch } from "vue";
import { CampaignStore } from "@/store/CampaignStore";
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
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    'data-testid': "story-record-follower",
});
const __VLS_0 = {}.VSelect;
/** @type {[typeof __VLS_components.VSelect, typeof __VLS_components.vSelect, typeof __VLS_components.VSelect, typeof __VLS_components.vSelect, ]} */ ;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
    modelValue: (__VLS_ctx.followerIds),
    clearable: true,
    chips: true,
    label: (__VLS_ctx.$t('text.add-or-remove-follower')),
    items: (__VLS_ctx.followers),
    itemTitle: "name",
    itemValue: "id",
    multiple: true,
    variant: "outlined",
}));
const __VLS_2 = __VLS_1({
    modelValue: (__VLS_ctx.followerIds),
    clearable: true,
    chips: true,
    label: (__VLS_ctx.$t('text.add-or-remove-follower')),
    items: (__VLS_ctx.followers),
    itemTitle: "name",
    itemValue: "id",
    multiple: true,
    variant: "outlined",
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
if (__VLS_ctx.followerIds.length > 0) {
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
    for (const [follower] of __VLS_getVForSourceType((__VLS_ctx.findFollowers(__VLS_ctx.followerIds)))) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.li, __VLS_intrinsicElements.li)({
            ...{ class: "py-1" },
            key: (follower.id),
        });
        (follower.name);
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
});
; /* PartiallyEnd: #4569/main.vue */
