/// <reference types="../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import { CampaignStore } from "@/store/CampaignStore";
import { HeroStore } from "@/store/HeroStore";
import { SequentialAdventureState } from "@/store/Hero";
import { useI18n } from "vue-i18n";
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
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
// CSS variable injection 
// CSS variable injection end 
const __VLS_0 = {}.VBtn;
/** @type {[typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ]} */ ;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
    ...{ 'onClick': {} },
    variant: "elevated",
    id: "sequential-adventure-btn",
    rounded: true,
    ...{ class: "px-6 my-2" },
}));
const __VLS_2 = __VLS_1({
    ...{ 'onClick': {} },
    variant: "elevated",
    id: "sequential-adventure-btn",
    rounded: true,
    ...{ class: "px-6 my-2" },
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
let __VLS_4;
let __VLS_5;
let __VLS_6;
const __VLS_7 = {
    onClick: (__VLS_ctx.startSequentialAdventure)
};
var __VLS_8 = {};
__VLS_3.slots.default;
const __VLS_9 = {}.VIcon;
/** @type {[typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, ]} */ ;
// @ts-ignore
const __VLS_10 = __VLS_asFunctionalComponent(__VLS_9, new __VLS_9({
    start: true,
}));
const __VLS_11 = __VLS_10({
    start: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_10));
__VLS_12.slots.default;
var __VLS_12;
(__VLS_ctx.t("label.sequential-adventure"));
var __VLS_3;
/** @type {__VLS_StyleScopedClasses['px-6']} */ ;
/** @type {__VLS_StyleScopedClasses['my-2']} */ ;
var __VLS_dollars;
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
});
; /* PartiallyEnd: #4569/main.vue */
