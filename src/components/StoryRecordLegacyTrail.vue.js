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
const perseverance = ref(0);
perseverance.value =
  campaignStore.find(props.campaignId).legacyTrail.perseverance ?? 0;
watch(perseverance, async (newPersverance) => {
  campaignStore.find(props.campaignId).legacyTrail.perseverance =
    newPersverance;
});
const tragedy = ref(0);
tragedy.value = campaignStore.find(props.campaignId).legacyTrail.tragedy ?? 0;
watch(tragedy, async (newTragedy) => {
  campaignStore.find(props.campaignId).legacyTrail.tragedy = newTragedy;
});
const doom = ref(0);
doom.value = campaignStore.find(props.campaignId).legacyTrail.doom ?? 0;
watch(doom, async (newDoom) => {
  campaignStore.find(props.campaignId).legacyTrail.doom = newDoom;
});
const heroism = ref(0);
heroism.value = campaignStore.find(props.campaignId).legacyTrail.heroism ?? 0;
watch(heroism, async (newHeroism) => {
  campaignStore.find(props.campaignId).legacyTrail.heroism = newHeroism;
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
  )({ id: "story-record-legacy-trail", ...{ class: "form-control w-full" } });
  __VLS_elementAsFunction(
    __VLS_intrinsicElements.div,
    __VLS_intrinsicElements.div,
  )({ ...{ class: "flex flex-row" } });
  __VLS_elementAsFunction(
    __VLS_intrinsicElements.span,
    __VLS_intrinsicElements.span,
  )({ ...{ class: "w-1/2 lg:w-3/4" } });
  __VLS_elementAsFunction(
    __VLS_intrinsicElements.div,
    __VLS_intrinsicElements.div,
  )({ ...{ class: "w-1/2 lg:w-1/4 grid grid-cols-4 place-items-end" } });
  __VLS_elementAsFunction(
    __VLS_intrinsicElements.span,
    __VLS_intrinsicElements.span,
  )({});
  __VLS_elementAsFunction(
    __VLS_intrinsicElements.span,
    __VLS_intrinsicElements.span,
  )({});
  __VLS_elementAsFunction(
    __VLS_intrinsicElements.span,
    __VLS_intrinsicElements.span,
  )({});
  __VLS_elementAsFunction(
    __VLS_intrinsicElements.span,
    __VLS_intrinsicElements.span,
  )({});
  __VLS_elementAsFunction(
    __VLS_intrinsicElements.div,
    __VLS_intrinsicElements.div,
  )({ ...{ class: "flex flex-row" } });
  __VLS_elementAsFunction(
    __VLS_intrinsicElements.span,
    __VLS_intrinsicElements.span,
  )({ ...{ class: "w-1/2 lg:w-3/4" } });
  __VLS_elementAsFunction(
    __VLS_intrinsicElements.div,
    __VLS_intrinsicElements.div,
  )({ ...{ class: "w-1/2 lg:w-1/4 grid grid-cols-4 place-items-end" } });
  const __VLS_0 = __VLS_resolvedLocalAndGlobalComponents.RadioButton;
  /** @type { [typeof __VLS_components.RadioButton, ] } */
  // @ts-ignore
  const __VLS_1 = __VLS_asFunctionalComponent(
    __VLS_0,
    new __VLS_0({
      modelValue: __VLS_ctx.perseverance,
      name: "perseverance",
      value: "0",
    }),
  );
  const __VLS_2 = __VLS_1(
    { modelValue: __VLS_ctx.perseverance, name: "perseverance", value: "0" },
    ...__VLS_functionalComponentArgsRest(__VLS_1),
  );
  const __VLS_6 = __VLS_resolvedLocalAndGlobalComponents.RadioButton;
  /** @type { [typeof __VLS_components.RadioButton, ] } */
  // @ts-ignore
  const __VLS_7 = __VLS_asFunctionalComponent(
    __VLS_6,
    new __VLS_6({
      modelValue: __VLS_ctx.perseverance,
      name: "perseverance",
      value: "1",
    }),
  );
  const __VLS_8 = __VLS_7(
    { modelValue: __VLS_ctx.perseverance, name: "perseverance", value: "1" },
    ...__VLS_functionalComponentArgsRest(__VLS_7),
  );
  const __VLS_12 = __VLS_resolvedLocalAndGlobalComponents.RadioButton;
  /** @type { [typeof __VLS_components.RadioButton, ] } */
  // @ts-ignore
  const __VLS_13 = __VLS_asFunctionalComponent(
    __VLS_12,
    new __VLS_12({
      modelValue: __VLS_ctx.perseverance,
      name: "perseverance",
      value: "2",
    }),
  );
  const __VLS_14 = __VLS_13(
    { modelValue: __VLS_ctx.perseverance, name: "perseverance", value: "2" },
    ...__VLS_functionalComponentArgsRest(__VLS_13),
  );
  const __VLS_18 = __VLS_resolvedLocalAndGlobalComponents.RadioButton;
  /** @type { [typeof __VLS_components.RadioButton, ] } */
  // @ts-ignore
  const __VLS_19 = __VLS_asFunctionalComponent(
    __VLS_18,
    new __VLS_18({
      modelValue: __VLS_ctx.perseverance,
      name: "perseverance",
      value: "3",
    }),
  );
  const __VLS_20 = __VLS_19(
    { modelValue: __VLS_ctx.perseverance, name: "perseverance", value: "3" },
    ...__VLS_functionalComponentArgsRest(__VLS_19),
  );
  __VLS_elementAsFunction(
    __VLS_intrinsicElements.div,
    __VLS_intrinsicElements.div,
  )({ ...{ class: "flex flex-row" } });
  __VLS_elementAsFunction(
    __VLS_intrinsicElements.span,
    __VLS_intrinsicElements.span,
  )({ ...{ class: "w-1/2 lg:w-3/4" } });
  __VLS_elementAsFunction(
    __VLS_intrinsicElements.div,
    __VLS_intrinsicElements.div,
  )({ ...{ class: "w-1/2 lg:w-1/4 grid grid-cols-4 place-items-end" } });
  const __VLS_24 = __VLS_resolvedLocalAndGlobalComponents.RadioButton;
  /** @type { [typeof __VLS_components.RadioButton, ] } */
  // @ts-ignore
  const __VLS_25 = __VLS_asFunctionalComponent(
    __VLS_24,
    new __VLS_24({
      modelValue: __VLS_ctx.tragedy,
      name: "tragedy",
      value: "0",
    }),
  );
  const __VLS_26 = __VLS_25(
    { modelValue: __VLS_ctx.tragedy, name: "tragedy", value: "0" },
    ...__VLS_functionalComponentArgsRest(__VLS_25),
  );
  const __VLS_30 = __VLS_resolvedLocalAndGlobalComponents.RadioButton;
  /** @type { [typeof __VLS_components.RadioButton, ] } */
  // @ts-ignore
  const __VLS_31 = __VLS_asFunctionalComponent(
    __VLS_30,
    new __VLS_30({
      modelValue: __VLS_ctx.tragedy,
      name: "tragedy",
      value: "1",
    }),
  );
  const __VLS_32 = __VLS_31(
    { modelValue: __VLS_ctx.tragedy, name: "tragedy", value: "1" },
    ...__VLS_functionalComponentArgsRest(__VLS_31),
  );
  const __VLS_36 = __VLS_resolvedLocalAndGlobalComponents.RadioButton;
  /** @type { [typeof __VLS_components.RadioButton, ] } */
  // @ts-ignore
  const __VLS_37 = __VLS_asFunctionalComponent(
    __VLS_36,
    new __VLS_36({
      modelValue: __VLS_ctx.tragedy,
      name: "tragedy",
      value: "2",
    }),
  );
  const __VLS_38 = __VLS_37(
    { modelValue: __VLS_ctx.tragedy, name: "tragedy", value: "2" },
    ...__VLS_functionalComponentArgsRest(__VLS_37),
  );
  const __VLS_42 = __VLS_resolvedLocalAndGlobalComponents.RadioButton;
  /** @type { [typeof __VLS_components.RadioButton, ] } */
  // @ts-ignore
  const __VLS_43 = __VLS_asFunctionalComponent(
    __VLS_42,
    new __VLS_42({
      modelValue: __VLS_ctx.tragedy,
      name: "tragedy",
      value: "3",
    }),
  );
  const __VLS_44 = __VLS_43(
    { modelValue: __VLS_ctx.tragedy, name: "tragedy", value: "3" },
    ...__VLS_functionalComponentArgsRest(__VLS_43),
  );
  __VLS_elementAsFunction(
    __VLS_intrinsicElements.div,
    __VLS_intrinsicElements.div,
  )({ ...{ class: "flex flex-row" } });
  __VLS_elementAsFunction(
    __VLS_intrinsicElements.span,
    __VLS_intrinsicElements.span,
  )({ ...{ class: "w-1/2 lg:w-3/4" } });
  __VLS_elementAsFunction(
    __VLS_intrinsicElements.div,
    __VLS_intrinsicElements.div,
  )({ ...{ class: "w-1/2 lg:w-1/4 grid grid-cols-4 place-items-end" } });
  const __VLS_48 = __VLS_resolvedLocalAndGlobalComponents.RadioButton;
  /** @type { [typeof __VLS_components.RadioButton, ] } */
  // @ts-ignore
  const __VLS_49 = __VLS_asFunctionalComponent(
    __VLS_48,
    new __VLS_48({ modelValue: __VLS_ctx.doom, name: "doom", value: "0" }),
  );
  const __VLS_50 = __VLS_49(
    { modelValue: __VLS_ctx.doom, name: "doom", value: "0" },
    ...__VLS_functionalComponentArgsRest(__VLS_49),
  );
  const __VLS_54 = __VLS_resolvedLocalAndGlobalComponents.RadioButton;
  /** @type { [typeof __VLS_components.RadioButton, ] } */
  // @ts-ignore
  const __VLS_55 = __VLS_asFunctionalComponent(
    __VLS_54,
    new __VLS_54({ modelValue: __VLS_ctx.doom, name: "doom", value: "1" }),
  );
  const __VLS_56 = __VLS_55(
    { modelValue: __VLS_ctx.doom, name: "doom", value: "1" },
    ...__VLS_functionalComponentArgsRest(__VLS_55),
  );
  const __VLS_60 = __VLS_resolvedLocalAndGlobalComponents.RadioButton;
  /** @type { [typeof __VLS_components.RadioButton, ] } */
  // @ts-ignore
  const __VLS_61 = __VLS_asFunctionalComponent(
    __VLS_60,
    new __VLS_60({ modelValue: __VLS_ctx.doom, name: "doom", value: "2" }),
  );
  const __VLS_62 = __VLS_61(
    { modelValue: __VLS_ctx.doom, name: "doom", value: "2" },
    ...__VLS_functionalComponentArgsRest(__VLS_61),
  );
  const __VLS_66 = __VLS_resolvedLocalAndGlobalComponents.RadioButton;
  /** @type { [typeof __VLS_components.RadioButton, ] } */
  // @ts-ignore
  const __VLS_67 = __VLS_asFunctionalComponent(
    __VLS_66,
    new __VLS_66({ modelValue: __VLS_ctx.doom, name: "doom", value: "3" }),
  );
  const __VLS_68 = __VLS_67(
    { modelValue: __VLS_ctx.doom, name: "doom", value: "3" },
    ...__VLS_functionalComponentArgsRest(__VLS_67),
  );
  __VLS_elementAsFunction(
    __VLS_intrinsicElements.div,
    __VLS_intrinsicElements.div,
  )({ ...{ class: "flex flex-row" } });
  __VLS_elementAsFunction(
    __VLS_intrinsicElements.span,
    __VLS_intrinsicElements.span,
  )({ ...{ class: "w-1/2 lg:w-3/4" } });
  __VLS_elementAsFunction(
    __VLS_intrinsicElements.div,
    __VLS_intrinsicElements.div,
  )({ ...{ class: "w-1/2 lg:w-1/4 grid grid-cols-4 place-items-end" } });
  const __VLS_72 = __VLS_resolvedLocalAndGlobalComponents.RadioButton;
  /** @type { [typeof __VLS_components.RadioButton, ] } */
  // @ts-ignore
  const __VLS_73 = __VLS_asFunctionalComponent(
    __VLS_72,
    new __VLS_72({
      modelValue: __VLS_ctx.heroism,
      name: "heroism",
      value: "0",
    }),
  );
  const __VLS_74 = __VLS_73(
    { modelValue: __VLS_ctx.heroism, name: "heroism", value: "0" },
    ...__VLS_functionalComponentArgsRest(__VLS_73),
  );
  const __VLS_78 = __VLS_resolvedLocalAndGlobalComponents.RadioButton;
  /** @type { [typeof __VLS_components.RadioButton, ] } */
  // @ts-ignore
  const __VLS_79 = __VLS_asFunctionalComponent(
    __VLS_78,
    new __VLS_78({
      modelValue: __VLS_ctx.heroism,
      name: "heroism",
      value: "1",
    }),
  );
  const __VLS_80 = __VLS_79(
    { modelValue: __VLS_ctx.heroism, name: "heroism", value: "1" },
    ...__VLS_functionalComponentArgsRest(__VLS_79),
  );
  const __VLS_84 = __VLS_resolvedLocalAndGlobalComponents.RadioButton;
  /** @type { [typeof __VLS_components.RadioButton, ] } */
  // @ts-ignore
  const __VLS_85 = __VLS_asFunctionalComponent(
    __VLS_84,
    new __VLS_84({
      modelValue: __VLS_ctx.heroism,
      name: "heroism",
      value: "2",
    }),
  );
  const __VLS_86 = __VLS_85(
    { modelValue: __VLS_ctx.heroism, name: "heroism", value: "2" },
    ...__VLS_functionalComponentArgsRest(__VLS_85),
  );
  const __VLS_90 = __VLS_resolvedLocalAndGlobalComponents.RadioButton;
  /** @type { [typeof __VLS_components.RadioButton, ] } */
  // @ts-ignore
  const __VLS_91 = __VLS_asFunctionalComponent(
    __VLS_90,
    new __VLS_90({
      modelValue: __VLS_ctx.heroism,
      name: "heroism",
      value: "3",
    }),
  );
  const __VLS_92 = __VLS_91(
    { modelValue: __VLS_ctx.heroism, name: "heroism", value: "3" },
    ...__VLS_functionalComponentArgsRest(__VLS_91),
  );
  __VLS_styleScopedClasses["form-control"];
  __VLS_styleScopedClasses["w-full"];
  __VLS_styleScopedClasses["flex"];
  __VLS_styleScopedClasses["flex-row"];
  __VLS_styleScopedClasses["w-1/2"];
  __VLS_styleScopedClasses["lg:w-3/4"];
  __VLS_styleScopedClasses["w-1/2"];
  __VLS_styleScopedClasses["lg:w-1/4"];
  __VLS_styleScopedClasses["grid"];
  __VLS_styleScopedClasses["grid-cols-4"];
  __VLS_styleScopedClasses["place-items-end"];
  __VLS_styleScopedClasses["flex"];
  __VLS_styleScopedClasses["flex-row"];
  __VLS_styleScopedClasses["w-1/2"];
  __VLS_styleScopedClasses["lg:w-3/4"];
  __VLS_styleScopedClasses["w-1/2"];
  __VLS_styleScopedClasses["lg:w-1/4"];
  __VLS_styleScopedClasses["grid"];
  __VLS_styleScopedClasses["grid-cols-4"];
  __VLS_styleScopedClasses["place-items-end"];
  __VLS_styleScopedClasses["flex"];
  __VLS_styleScopedClasses["flex-row"];
  __VLS_styleScopedClasses["w-1/2"];
  __VLS_styleScopedClasses["lg:w-3/4"];
  __VLS_styleScopedClasses["w-1/2"];
  __VLS_styleScopedClasses["lg:w-1/4"];
  __VLS_styleScopedClasses["grid"];
  __VLS_styleScopedClasses["grid-cols-4"];
  __VLS_styleScopedClasses["place-items-end"];
  __VLS_styleScopedClasses["flex"];
  __VLS_styleScopedClasses["flex-row"];
  __VLS_styleScopedClasses["w-1/2"];
  __VLS_styleScopedClasses["lg:w-3/4"];
  __VLS_styleScopedClasses["w-1/2"];
  __VLS_styleScopedClasses["lg:w-1/4"];
  __VLS_styleScopedClasses["grid"];
  __VLS_styleScopedClasses["grid-cols-4"];
  __VLS_styleScopedClasses["place-items-end"];
  __VLS_styleScopedClasses["flex"];
  __VLS_styleScopedClasses["flex-row"];
  __VLS_styleScopedClasses["w-1/2"];
  __VLS_styleScopedClasses["lg:w-3/4"];
  __VLS_styleScopedClasses["w-1/2"];
  __VLS_styleScopedClasses["lg:w-1/4"];
  __VLS_styleScopedClasses["grid"];
  __VLS_styleScopedClasses["grid-cols-4"];
  __VLS_styleScopedClasses["place-items-end"];
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
      perseverance: perseverance,
      tragedy: tragedy,
      doom: doom,
      heroism: heroism,
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
