/// <reference types="../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import { HeroStore } from "@/store/HeroStore";
import ItemCardSelect from "@/components/ItemCardSelect.vue";
import { heroCanUse } from "@/data/repository/HeroData";
import { computed } from "vue";
const heroStore = HeroStore();
const emit = defineEmits(["stash"]);
const props = defineProps();
const hero = heroStore.findInCampaign(props.heroId, props.campaignId);
const armorId = hero.equipment.armorId ?? "";
const offHandCards = computed(() => props.cardsDataRepository
    .findByType("Armor", null)
    .filter((item) => !props.filterProficiencies || heroCanUse(props.heroData, item))
    .map((card) => card));
function subTypeList(item) {
    if (typeof item.armorTypes === "undefined") {
        return "";
    }
    return item.armorTypes.join(" | ");
}
function onClear() {
    hero.equipment.armorId = "";
}
function onSelect(selectedId) {
    heroStore.findInCampaign(props.heroId, props.campaignId).equipment.armorId =
        selectedId;
}
function onStash() {
    const heroState = heroStore.findInCampaign(props.heroId, props.campaignId);
    if (heroState.equipment.armorId === "")
        return;
    heroStore
        .findInCampaign(props.heroId, props.campaignId)
        .stashedCardIds.push(heroState.equipment.armorId);
    emit("stash");
}
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
// CSS variable injection 
// CSS variable injection end 
/** @type {[typeof ItemCardSelect, typeof ItemCardSelect, ]} */ ;
// @ts-ignore
const __VLS_0 = __VLS_asFunctionalComponent(ItemCardSelect, new ItemCardSelect({
    ...{ 'onClear': {} },
    ...{ 'onSelected': {} },
    ...{ 'onStash': {} },
    items: (__VLS_ctx.offHandCards),
    itemType: "Armor",
    subTypeList: (__VLS_ctx.subTypeList),
    value: (__VLS_ctx.armorId),
    repository: (__VLS_ctx.cardsDataRepository),
}));
const __VLS_1 = __VLS_0({
    ...{ 'onClear': {} },
    ...{ 'onSelected': {} },
    ...{ 'onStash': {} },
    items: (__VLS_ctx.offHandCards),
    itemType: "Armor",
    subTypeList: (__VLS_ctx.subTypeList),
    value: (__VLS_ctx.armorId),
    repository: (__VLS_ctx.cardsDataRepository),
}, ...__VLS_functionalComponentArgsRest(__VLS_0));
let __VLS_3;
let __VLS_4;
let __VLS_5;
const __VLS_6 = {
    onClear: (__VLS_ctx.onClear)
};
const __VLS_7 = {
    onSelected: (__VLS_ctx.onSelect)
};
const __VLS_8 = {
    onStash: (__VLS_ctx.onStash)
};
var __VLS_9 = {};
var __VLS_2;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            ItemCardSelect: ItemCardSelect,
            armorId: armorId,
            offHandCards: offHandCards,
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
