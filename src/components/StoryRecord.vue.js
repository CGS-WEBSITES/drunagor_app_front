/// <reference types="../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import { CampaignStore } from "@/store/CampaignStore";
import StoryRecordApocalypse from "@/components/StoryRecordApocalypse.vue";
import StoryRecordAwakenings from "@/components/StoryRecordAwakenings.vue";
const props = defineProps();
const campaignStore = CampaignStore();
const campaign = campaignStore.find(props.campaignId);
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
// CSS variable injection 
// CSS variable injection end 
if (__VLS_ctx.campaign.campaign == 'apocalypse') {
    /** @type {[typeof StoryRecordApocalypse, ]} */ ;
    // @ts-ignore
    const __VLS_0 = __VLS_asFunctionalComponent(StoryRecordApocalypse, new StoryRecordApocalypse({
        campaignId: (props.campaignId),
    }));
    const __VLS_1 = __VLS_0({
        campaignId: (props.campaignId),
    }, ...__VLS_functionalComponentArgsRest(__VLS_0));
}
if (__VLS_ctx.campaign.campaign == 'awakenings') {
    /** @type {[typeof StoryRecordAwakenings, ]} */ ;
    // @ts-ignore
    const __VLS_3 = __VLS_asFunctionalComponent(StoryRecordAwakenings, new StoryRecordAwakenings({
        campaignId: (props.campaignId),
    }));
    const __VLS_4 = __VLS_3({
        campaignId: (props.campaignId),
    }, ...__VLS_functionalComponentArgsRest(__VLS_3));
}
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            StoryRecordApocalypse: StoryRecordApocalypse,
            StoryRecordAwakenings: StoryRecordAwakenings,
            campaign: campaign,
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
