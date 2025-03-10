import { HeroStore } from "@/store/HeroStore";
import ItemCardSelect from "@/components/ItemCardSelect.vue";
const {
  defineProps,
  defineSlots,
  defineEmits,
  defineExpose,
  defineModel,
  defineOptions,
  withDefaults,
} = await import("vue");
const heroStore = HeroStore();
const emit = defineEmits(["stash"]);
const props = defineProps();
const hero = heroStore.findInCampaign(props.heroId, props.campaignId);
const trinketId = hero.equipment.trinketId ?? "";
const offHandCards = props.cardsDataRepository.findByType("Trinket", null);
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function subTypeList(item) {
  return "";
}
function onClear() {
  hero.equipment.trinketId = "";
}
function onSelect(selectedId) {
  heroStore.findInCampaign(props.heroId, props.campaignId).equipment.trinketId =
    selectedId;
}
function onStash() {
  const heroState = heroStore.findInCampaign(props.heroId, props.campaignId);
  if (heroState.equipment.trinketId === "") return;
  heroStore
    .findInCampaign(props.heroId, props.campaignId)
    .stashedCardIds.push(heroState.equipment.trinketId);
  emit("stash");
} /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_fnComponent = (await import("vue")).defineComponent({
  emits: {},
});
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
  // @ts-ignore
  [ItemCardSelect, ItemCardSelect];
  // @ts-ignore
  const __VLS_0 = __VLS_asFunctionalComponent(
    ItemCardSelect,
    new ItemCardSelect({
      ...{ onClear: {} },
      ...{ onSelected: {} },
      ...{ onStash: {} },
      items: __VLS_ctx.offHandCards,
      itemType: "Trinket",
      subTypeList: __VLS_ctx.subTypeList,
      value: __VLS_ctx.trinketId,
      repository: __VLS_ctx.cardsDataRepository,
    }),
  );
  const __VLS_1 = __VLS_0(
    {
      ...{ onClear: {} },
      ...{ onSelected: {} },
      ...{ onStash: {} },
      items: __VLS_ctx.offHandCards,
      itemType: "Trinket",
      subTypeList: __VLS_ctx.subTypeList,
      value: __VLS_ctx.trinketId,
      repository: __VLS_ctx.cardsDataRepository,
    },
    ...__VLS_functionalComponentArgsRest(__VLS_0),
  );
  var __VLS_5 = {};
  let __VLS_6;
  const __VLS_7 = {
    onClear: __VLS_ctx.onClear,
  };
  const __VLS_8 = {
    onSelected: __VLS_ctx.onSelect,
  };
  const __VLS_9 = {
    onStash: __VLS_ctx.onStash,
  };
  let __VLS_2;
  let __VLS_3;
  var __VLS_4;
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
const __VLS_self = (await import("vue")).defineComponent({
  setup() {
    return {
      ItemCardSelect: ItemCardSelect,
      trinketId: trinketId,
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
export default (await import("vue")).defineComponent({
  setup() {
    return {};
  },
  emits: {},
  __typeProps: {},
  __typeEl: {},
}); /* PartiallyEnd: #4569/main.vue */
