import { ref, watch } from "vue";
import { HeroStore } from "@/store/HeroStore";
import { useI18n } from "vue-i18n";
import * as _ from "lodash-es";
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
}); /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_fnComponent = (await import("vue")).defineComponent({});
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
  __VLS_elementAsFunction(
    __VLS_intrinsicElements.span,
    __VLS_intrinsicElements.span,
  )({ "data-testid": "item-stash" });
  const __VLS_0 = __VLS_resolvedLocalAndGlobalComponents.MultiSelect;
  /** @type { [typeof __VLS_components.MultiSelect, typeof __VLS_components.MultiSelect, ] } */
  // @ts-ignore
  const __VLS_1 = __VLS_asFunctionalComponent(
    __VLS_0,
    new __VLS_0({
      modelValue: __VLS_ctx.stashedItemIds,
      options: __VLS_ctx.items,
      maxSelectedLabels: 1,
      filter: true,
      optionLabel: "name",
      optionValue: "id",
      placeholder: __VLS_ctx.$t("text.add-or-remove-stashed-items"),
      ...{ class: "w-full md:w-14rem" },
    }),
  );
  const __VLS_2 = __VLS_1(
    {
      modelValue: __VLS_ctx.stashedItemIds,
      options: __VLS_ctx.items,
      maxSelectedLabels: 1,
      filter: true,
      optionLabel: "name",
      optionValue: "id",
      placeholder: __VLS_ctx.$t("text.add-or-remove-stashed-items"),
      ...{ class: "w-full md:w-14rem" },
    },
    ...__VLS_functionalComponentArgsRest(__VLS_1),
  );
  if (__VLS_ctx.stashedItemIds.length > 0) {
    __VLS_elementAsFunction(
      __VLS_intrinsicElements.p,
      __VLS_intrinsicElements.p,
    )({ ...{ class: "text-sm text-gray-500 py-2" } });
    for (const [itemCard] of __VLS_getVForSourceType(
      __VLS_ctx.findItemCards(__VLS_ctx.stashedItemIds),
    )) {
      __VLS_elementAsFunction(
        __VLS_intrinsicElements.ul,
        __VLS_intrinsicElements.ul,
      )({ id: "hero-stash-display", ...{ class: "list-disc list-inside" } });
      __VLS_elementAsFunction(
        __VLS_intrinsicElements.li,
        __VLS_intrinsicElements.li,
      )({});
      __VLS_ctx.t(itemCard.translation_key);
    }
  }
  __VLS_styleScopedClasses["w-full"];
  __VLS_styleScopedClasses["md:w-14rem"];
  __VLS_styleScopedClasses["text-sm"];
  __VLS_styleScopedClasses["text-gray-500"];
  __VLS_styleScopedClasses["py-2"];
  __VLS_styleScopedClasses["list-disc"];
  __VLS_styleScopedClasses["list-inside"];
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
      items: items,
      stashedItemIds: stashedItemIds,
      t: t,
      findItemCards: findItemCards,
    };
  },
  __typeProps: {},
});
export default (await import("vue")).defineComponent({
  setup() {
    return {};
  },
  __typeProps: {},
  __typeEl: {},
}); /* PartiallyEnd: #4569/main.vue */
