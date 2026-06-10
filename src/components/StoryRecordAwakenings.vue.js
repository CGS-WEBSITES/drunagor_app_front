/// <reference types="../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import { StoryRecordStatusRepository } from "@/data/repository/campaign/awakenings/StoryRecordStatusRepository";
import { StoryRecordOutcomeRepository } from "@/data/repository/campaign/awakenings/StoryRecordOutcomeRepository";
import { StoryRecordFollowerRepository } from "@/data/repository/campaign/awakenings/StoryRecordFollowerRepository";
import StoryRecordStatus from "@/components/StoryRecordStatus.vue";
import StoryRecordOutcome from "@/components/StoryRecordOutcome.vue";
import StoryRecordFollower from "@/components/StoryRecordFollower.vue";
const props = defineProps();
const statusRepository = new StoryRecordStatusRepository();
const outcomeRepository = new StoryRecordOutcomeRepository();
const followerRepository = new StoryRecordFollowerRepository();
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
// CSS variable injection 
// CSS variable injection end 
const __VLS_0 = {}.VRow;
/** @type {[typeof __VLS_components.VRow, typeof __VLS_components.vRow, typeof __VLS_components.VRow, typeof __VLS_components.vRow, ]} */ ;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
    noGutters: true,
}));
const __VLS_2 = __VLS_1({
    noGutters: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
__VLS_3.slots.default;
const __VLS_4 = {}.VCol;
/** @type {[typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ]} */ ;
// @ts-ignore
const __VLS_5 = __VLS_asFunctionalComponent(__VLS_4, new __VLS_4({
    cols: "12",
}));
const __VLS_6 = __VLS_5({
    cols: "12",
}, ...__VLS_functionalComponentArgsRest(__VLS_5));
__VLS_7.slots.default;
/** @type {[typeof StoryRecordFollower, ]} */ ;
// @ts-ignore
const __VLS_8 = __VLS_asFunctionalComponent(StoryRecordFollower, new StoryRecordFollower({
    repository: (__VLS_ctx.followerRepository),
    campaignId: (props.campaignId),
}));
const __VLS_9 = __VLS_8({
    repository: (__VLS_ctx.followerRepository),
    campaignId: (props.campaignId),
}, ...__VLS_functionalComponentArgsRest(__VLS_8));
var __VLS_7;
var __VLS_3;
const __VLS_11 = {}.VRow;
/** @type {[typeof __VLS_components.VRow, typeof __VLS_components.vRow, typeof __VLS_components.VRow, typeof __VLS_components.vRow, ]} */ ;
// @ts-ignore
const __VLS_12 = __VLS_asFunctionalComponent(__VLS_11, new __VLS_11({
    noGutters: true,
}));
const __VLS_13 = __VLS_12({
    noGutters: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_12));
__VLS_14.slots.default;
const __VLS_15 = {}.VCol;
/** @type {[typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ]} */ ;
// @ts-ignore
const __VLS_16 = __VLS_asFunctionalComponent(__VLS_15, new __VLS_15({
    cols: "12",
}));
const __VLS_17 = __VLS_16({
    cols: "12",
}, ...__VLS_functionalComponentArgsRest(__VLS_16));
__VLS_18.slots.default;
/** @type {[typeof StoryRecordStatus, ]} */ ;
// @ts-ignore
const __VLS_19 = __VLS_asFunctionalComponent(StoryRecordStatus, new StoryRecordStatus({
    repository: (__VLS_ctx.statusRepository),
    campaignId: (props.campaignId),
}));
const __VLS_20 = __VLS_19({
    repository: (__VLS_ctx.statusRepository),
    campaignId: (props.campaignId),
}, ...__VLS_functionalComponentArgsRest(__VLS_19));
var __VLS_18;
var __VLS_14;
const __VLS_22 = {}.VRow;
/** @type {[typeof __VLS_components.VRow, typeof __VLS_components.vRow, typeof __VLS_components.VRow, typeof __VLS_components.vRow, ]} */ ;
// @ts-ignore
const __VLS_23 = __VLS_asFunctionalComponent(__VLS_22, new __VLS_22({
    noGutters: true,
}));
const __VLS_24 = __VLS_23({
    noGutters: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_23));
__VLS_25.slots.default;
const __VLS_26 = {}.VCol;
/** @type {[typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ]} */ ;
// @ts-ignore
const __VLS_27 = __VLS_asFunctionalComponent(__VLS_26, new __VLS_26({
    cols: "12",
}));
const __VLS_28 = __VLS_27({
    cols: "12",
}, ...__VLS_functionalComponentArgsRest(__VLS_27));
__VLS_29.slots.default;
/** @type {[typeof StoryRecordOutcome, ]} */ ;
// @ts-ignore
const __VLS_30 = __VLS_asFunctionalComponent(StoryRecordOutcome, new StoryRecordOutcome({
    repository: (__VLS_ctx.outcomeRepository),
    campaignId: (props.campaignId),
}));
const __VLS_31 = __VLS_30({
    repository: (__VLS_ctx.outcomeRepository),
    campaignId: (props.campaignId),
}, ...__VLS_functionalComponentArgsRest(__VLS_30));
var __VLS_29;
var __VLS_25;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            StoryRecordStatus: StoryRecordStatus,
            StoryRecordOutcome: StoryRecordOutcome,
            StoryRecordFollower: StoryRecordFollower,
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
