/// <reference types="../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import { HeroStore } from "@/store/HeroStore";
const heroStore = HeroStore();
const emit = defineEmits(["stash"]);
const props = defineProps();
const hero = heroStore.findInCampaign(props.heroId, props.campaignId);
const slotItem = props.bagSlot === 1 ? hero.equipment.bagOneId : hero.equipment.bagTwoId;
const itemId = slotItem ?? "";
const itemCards = props.cardsDataRepository.findAll();
const itemCardCategories = [
    {
        name: "Treasure Deck",
        items: itemCards.filter((item) => item.cardType === "Chest"),
    },
    {
        name: "Misc",
        items: itemCards.filter((item) => item.cardType !== "Chest"),
    },
];
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function subTypeList(item) {
    return "";
}
function onClear() {
    if (props.bagSlot === 1) {
        hero.equipment.bagOneId = "";
        return;
    }
    hero.equipment.bagTwoId = "";
}
function onSelect(selectedId) {
    if (props.bagSlot === 1) {
        heroStore.findInCampaign(props.heroId, props.campaignId).equipment.bagOneId = selectedId;
        return;
    }
    heroStore.findInCampaign(props.heroId, props.campaignId).equipment.bagTwoId =
        selectedId;
}
function onStash() {
    const heroState = heroStore.findInCampaign(props.heroId, props.campaignId);
    if (props.bagSlot === 1) {
        if (heroState.equipment.bagOneId === "")
            return;
        heroStore
            .findInCampaign(props.heroId, props.campaignId)
            .stashedCardIds.push(heroState.equipment.bagOneId);
        emit("stash");
        return;
    }
    if (heroState.equipment.bagTwoId === "")
        return;
    heroStore
        .findInCampaign(props.heroId, props.campaignId)
        .stashedCardIds.push(heroState.equipment.bagTwoId);
    emit("stash");
}
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
// CSS variable injection 
// CSS variable injection end 
const __VLS_0 = {}.ItemCardSelectCategorized;
/** @type {[typeof __VLS_components.ItemCardSelectCategorized, typeof __VLS_components.ItemCardSelectCategorized, ]} */ ;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
    ...{ 'onClear': {} },
    ...{ 'onSelected': {} },
    ...{ 'onStash': {} },
    categories: (__VLS_ctx.itemCardCategories),
    subTypeList: (__VLS_ctx.subTypeList),
    value: (__VLS_ctx.itemId),
    bagSlot: (__VLS_ctx.bagSlot),
    repository: (__VLS_ctx.cardsDataRepository),
}));
const __VLS_2 = __VLS_1({
    ...{ 'onClear': {} },
    ...{ 'onSelected': {} },
    ...{ 'onStash': {} },
    categories: (__VLS_ctx.itemCardCategories),
    subTypeList: (__VLS_ctx.subTypeList),
    value: (__VLS_ctx.itemId),
    bagSlot: (__VLS_ctx.bagSlot),
    repository: (__VLS_ctx.cardsDataRepository),
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
let __VLS_4;
let __VLS_5;
let __VLS_6;
const __VLS_7 = {
    onClear: (__VLS_ctx.onClear)
};
const __VLS_8 = {
    onSelected: (__VLS_ctx.onSelect)
};
const __VLS_9 = {
    onStash: (__VLS_ctx.onStash)
};
var __VLS_10 = {};
var __VLS_3;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            itemId: itemId,
            itemCardCategories: itemCardCategories,
            subTypeList: subTypeList,
            onClear: onClear,
            onSelect: onSelect,
            onStash: onStash,
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
