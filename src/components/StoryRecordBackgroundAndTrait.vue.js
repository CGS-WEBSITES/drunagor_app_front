import { ref, watch } from "vue";
import { CampaignStore } from "@/store/CampaignStore";
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
const backgroundAndTraitIds = ref([]);
backgroundAndTraitIds.value =
  campaignStore.find(props.campaignId).backgroundAndTraitIds ?? [];
watch(backgroundAndTraitIds, async (newBackgroundAndTraitsIds) => {
  campaignStore.find(props.campaignId).backgroundAndTraitIds =
    newBackgroundAndTraitsIds;
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
    __VLS_intrinsicElements.div,
    __VLS_intrinsicElements.div,
  )({
    id: "story-record-background-and-trait",
    ...{ class: "grid gap-1 form-control w-full" },
  });
  __VLS_elementAsFunction(
    __VLS_intrinsicElements.label,
    __VLS_intrinsicElements.label,
  )({ ...{ class: "cursor-pointer" } });
  __VLS_elementAsFunction(
    __VLS_intrinsicElements.span,
    __VLS_intrinsicElements.span,
  )({ ...{ class: "label-text text-base" } });
  const __VLS_0 = __VLS_resolvedLocalAndGlobalComponents.Checkbox;
  /** @type { [typeof __VLS_components.Checkbox, ] } */
  // @ts-ignore
  const __VLS_1 = __VLS_asFunctionalComponent(
    __VLS_0,
    new __VLS_0({
      variant: "outlined",
      modelValue: __VLS_ctx.backgroundAndTraitIds,
      value: "folk-hero",
      ...{ class: "float-right" },
    }),
  );
  const __VLS_2 = __VLS_1(
    {
      variant: "outlined",
      modelValue: __VLS_ctx.backgroundAndTraitIds,
      value: "folk-hero",
      ...{ class: "float-right" },
    },
    ...__VLS_functionalComponentArgsRest(__VLS_1),
  );
  __VLS_elementAsFunction(
    __VLS_intrinsicElements.label,
    __VLS_intrinsicElements.label,
  )({ ...{ class: "cursor-pointer" } });
  __VLS_elementAsFunction(
    __VLS_intrinsicElements.span,
    __VLS_intrinsicElements.span,
  )({ ...{ class: "label-text text-base" } });
  const __VLS_6 = __VLS_resolvedLocalAndGlobalComponents.Checkbox;
  /** @type { [typeof __VLS_components.Checkbox, ] } */
  // @ts-ignore
  const __VLS_7 = __VLS_asFunctionalComponent(
    __VLS_6,
    new __VLS_6({
      variant: "outlined",
      modelValue: __VLS_ctx.backgroundAndTraitIds,
      value: "knight-of-amir",
      ...{ class: "float-right" },
    }),
  );
  const __VLS_8 = __VLS_7(
    {
      variant: "outlined",
      modelValue: __VLS_ctx.backgroundAndTraitIds,
      value: "knight-of-amir",
      ...{ class: "float-right" },
    },
    ...__VLS_functionalComponentArgsRest(__VLS_7),
  );
  __VLS_elementAsFunction(
    __VLS_intrinsicElements.label,
    __VLS_intrinsicElements.label,
  )({ ...{ class: "cursor-pointer" } });
  __VLS_elementAsFunction(
    __VLS_intrinsicElements.span,
    __VLS_intrinsicElements.span,
  )({ ...{ class: "label-text text-base" } });
  const __VLS_12 = __VLS_resolvedLocalAndGlobalComponents.Checkbox;
  /** @type { [typeof __VLS_components.Checkbox, ] } */
  // @ts-ignore
  const __VLS_13 = __VLS_asFunctionalComponent(
    __VLS_12,
    new __VLS_12({
      variant: "outlined",
      modelValue: __VLS_ctx.backgroundAndTraitIds,
      value: "redeemer",
      ...{ class: "float-right" },
    }),
  );
  const __VLS_14 = __VLS_13(
    {
      variant: "outlined",
      modelValue: __VLS_ctx.backgroundAndTraitIds,
      value: "redeemer",
      ...{ class: "float-right" },
    },
    ...__VLS_functionalComponentArgsRest(__VLS_13),
  );
  __VLS_elementAsFunction(
    __VLS_intrinsicElements.label,
    __VLS_intrinsicElements.label,
  )({ ...{ class: "cursor-pointer" } });
  __VLS_elementAsFunction(
    __VLS_intrinsicElements.span,
    __VLS_intrinsicElements.span,
  )({ ...{ class: "label-text text-base" } });
  const __VLS_18 = __VLS_resolvedLocalAndGlobalComponents.Checkbox;
  /** @type { [typeof __VLS_components.Checkbox, ] } */
  // @ts-ignore
  const __VLS_19 = __VLS_asFunctionalComponent(
    __VLS_18,
    new __VLS_18({
      variant: "outlined",
      modelValue: __VLS_ctx.backgroundAndTraitIds,
      value: "passionate",
      ...{ class: "float-right" },
    }),
  );
  const __VLS_20 = __VLS_19(
    {
      variant: "outlined",
      modelValue: __VLS_ctx.backgroundAndTraitIds,
      value: "passionate",
      ...{ class: "float-right" },
    },
    ...__VLS_functionalComponentArgsRest(__VLS_19),
  );
  __VLS_styleScopedClasses["grid"];
  __VLS_styleScopedClasses["gap-1"];
  __VLS_styleScopedClasses["form-control"];
  __VLS_styleScopedClasses["w-full"];
  __VLS_styleScopedClasses["cursor-pointer"];
  __VLS_styleScopedClasses["label-text"];
  __VLS_styleScopedClasses["text-base"];
  __VLS_styleScopedClasses["float-right"];
  __VLS_styleScopedClasses["cursor-pointer"];
  __VLS_styleScopedClasses["label-text"];
  __VLS_styleScopedClasses["text-base"];
  __VLS_styleScopedClasses["float-right"];
  __VLS_styleScopedClasses["cursor-pointer"];
  __VLS_styleScopedClasses["label-text"];
  __VLS_styleScopedClasses["text-base"];
  __VLS_styleScopedClasses["float-right"];
  __VLS_styleScopedClasses["cursor-pointer"];
  __VLS_styleScopedClasses["label-text"];
  __VLS_styleScopedClasses["text-base"];
  __VLS_styleScopedClasses["float-right"];
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
      backgroundAndTraitIds: backgroundAndTraitIds,
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
