import { ref, watch } from "vue";
import { CampaignStore } from "@/store/CampaignStore";
import { ConfigurationStore } from "@/store/ConfigurationStore";
const {
  defineProps,
  defineSlots,
  defineEmits,
  defineExpose,
  defineModel,
  defineOptions,
  withDefaults,
} = await import("vue");
const props = defineProps();
const campaignStore = CampaignStore();
const configurationStore = ConfigurationStore();
props.repository.load(configurationStore.enabledLanguage);
const outcomes = props.repository.findAll();
const outcomeIds = ref([]);
outcomeIds.value = campaignStore.find(props.campaignId).outcomeIds ?? [];
function findOutcomes(outcomeIds) {
  const outcomes = [];
  outcomeIds.forEach((outcomeId) => {
    let outcome = props.repository.find(outcomeId);
    if (outcome) {
      outcomes.push(outcome);
    }
  });
  return outcomes;
}
watch(outcomeIds, (newOutcomeIds) => {
  campaignStore.find(props.campaignId).outcomeIds = newOutcomeIds;
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
  )({ "data-testid": "story-record-outcome" });
  const __VLS_0 = __VLS_resolvedLocalAndGlobalComponents.MultiSelect;
  /** @type { [typeof __VLS_components.MultiSelect, ] } */
  // @ts-ignore
  const __VLS_1 = __VLS_asFunctionalComponent(
    __VLS_0,
    new __VLS_0({
      modelValue: __VLS_ctx.outcomeIds,
      options: __VLS_ctx.outcomes,
      maxSelectedLabels: 1,
      filter: true,
      optionLabel: "name",
      optionValue: "id",
      placeholder: __VLS_ctx.$t("text.add-or-remove-outcome"),
      ...{ class: "w-full md:w-14rem" },
    }),
  );
  const __VLS_2 = __VLS_1(
    {
      modelValue: __VLS_ctx.outcomeIds,
      options: __VLS_ctx.outcomes,
      maxSelectedLabels: 1,
      filter: true,
      optionLabel: "name",
      optionValue: "id",
      placeholder: __VLS_ctx.$t("text.add-or-remove-outcome"),
      ...{ class: "w-full md:w-14rem" },
    },
    ...__VLS_functionalComponentArgsRest(__VLS_1),
  );
  if (__VLS_ctx.outcomeIds.length > 0) {
    __VLS_elementAsFunction(
      __VLS_intrinsicElements.p,
      __VLS_intrinsicElements.p,
    )({ ...{ class: "text-sm text-gray-500 py-2" } });
    __VLS_ctx.$t("text.outcome-info");
    for (const [outcome] of __VLS_getVForSourceType(
      __VLS_ctx.findOutcomes(__VLS_ctx.outcomeIds),
    )) {
      __VLS_elementAsFunction(
        __VLS_intrinsicElements.ul,
        __VLS_intrinsicElements.ul,
      )({
        id: "campaign-log-outcome-display",
        ...{ class: "list-disc list-inside" },
      });
      __VLS_elementAsFunction(
        __VLS_intrinsicElements.li,
        __VLS_intrinsicElements.li,
      )({});
      outcome.name;
      if (outcome.effect) {
        __VLS_elementAsFunction(
          __VLS_intrinsicElements.span,
          __VLS_intrinsicElements.span,
        )({ ...{ class: "px-4 block" } });
        outcome.effect;
      }
    }
  }
  __VLS_styleScopedClasses["w-full"];
  __VLS_styleScopedClasses["md:w-14rem"];
  __VLS_styleScopedClasses["text-sm"];
  __VLS_styleScopedClasses["text-gray-500"];
  __VLS_styleScopedClasses["py-2"];
  __VLS_styleScopedClasses["list-disc"];
  __VLS_styleScopedClasses["list-inside"];
  __VLS_styleScopedClasses["px-4"];
  __VLS_styleScopedClasses["block"];
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
      outcomes: outcomes,
      outcomeIds: outcomeIds,
      findOutcomes: findOutcomes,
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
