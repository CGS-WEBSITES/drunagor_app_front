/// <reference types="../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import { ref, watch } from "vue";
import { HeroStore } from "@/store/HeroStore";
import { useI18n } from "vue-i18n";
import * as _ from "lodash-es";
const heroStore = HeroStore();
const props = defineProps();
let items = props.repository.findAll();
const stashedItemIds = ref([]);
const hero = heroStore.findInCampaign(props.heroId, props.campaignId);
const { t } = useI18n();
if (typeof hero.stashedCardIds === "undefined") {
    hero.stashedCardIds = [];
}
stashedItemIds.value = hero.stashedCardIds;
items = items.map((item) => {
    return {
        ...item,
        name: t(item.translation_key),
    };
});
items = _.sortBy(items, ["name"]);
function findItemCards(stashedItemIds) {
    const itemCards = [];
    stashedItemIds.forEach((stashedItemId) => {
        let itemCard = props.repository.find(stashedItemId);
        if (itemCard) {
            itemCards.push(itemCard);
        }
    });
    return itemCards;
}
watch(stashedItemIds, (newStashedItemCardIds) => {
    heroStore.findInCampaign(props.heroId, props.campaignId).stashedCardIds =
        newStashedItemCardIds;
});
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
const __VLS_0 = {}.VSelect;
/** @type {[typeof __VLS_components.VSelect, typeof __VLS_components.vSelect, typeof __VLS_components.VSelect, typeof __VLS_components.vSelect, ]} */ ;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
    modelValue: (__VLS_ctx.stashedItemIds),
    clearable: true,
    chips: true,
    label: (__VLS_ctx.$t('text.add-or-remove-stashed-items')),
    hint: "Cannot be used during a scenario",
    items: (__VLS_ctx.items),
    itemTitle: "name",
    itemValue: "id",
    multiple: true,
    variant: "outlined",
}));
const __VLS_2 = __VLS_1({
    modelValue: (__VLS_ctx.stashedItemIds),
    clearable: true,
    chips: true,
    label: (__VLS_ctx.$t('text.add-or-remove-stashed-items')),
    hint: "Cannot be used during a scenario",
    items: (__VLS_ctx.items),
    itemTitle: "name",
    itemValue: "id",
    multiple: true,
    variant: "outlined",
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
if (__VLS_ctx.stashedItemIds.length > 0) {
    const __VLS_4 = {}.VSheet;
    /** @type {[typeof __VLS_components.VSheet, typeof __VLS_components.vSheet, typeof __VLS_components.VSheet, typeof __VLS_components.vSheet, ]} */ ;
    // @ts-ignore
    const __VLS_5 = __VLS_asFunctionalComponent(__VLS_4, new __VLS_4({
        rounded: true,
        border: "md",
        ...{ class: "mb-6 pa-6 text-white" },
        ...{ style: {} },
    }));
    const __VLS_6 = __VLS_5({
        rounded: true,
        border: "md",
        ...{ class: "mb-6 pa-6 text-white" },
        ...{ style: {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_5));
    __VLS_7.slots.default;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.ul, __VLS_intrinsicElements.ul)({});
    for (const [itemCard] of __VLS_getVForSourceType((__VLS_ctx.findItemCards(__VLS_ctx.stashedItemIds)))) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.li, __VLS_intrinsicElements.li)({
            ...{ class: "py-1" },
            key: (itemCard.id),
        });
        (__VLS_ctx.t(itemCard.translation_key));
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
            items: items,
            stashedItemIds: stashedItemIds,
            t: t,
            findItemCards: findItemCards,
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
