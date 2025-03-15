import { SequentialAdventureState } from "@/store/Hero";
import { ref, watch } from "vue";
import { HeroStore } from "@/store/HeroStore";
import { HeroDataRepository } from "@/data/repository/HeroDataRepository";
import { useRoute } from "vue-router";
import { useI18n } from "vue-i18n";
const {
  defineProps,
  defineSlots,
  defineEmits,
  defineExpose,
  defineModel,
  defineOptions,
  withDefaults,
} = await import("vue");
const resourceDefinitions = [
  { id: "focus", translation_key: "label.focus" },
  { id: "fruit-of-life", translation_key: "label.fruit-of-life" },
  { id: "ki", translation_key: "label.ki" },
  { id: "shield", translation_key: "label.shield" },
  { id: "fury", translation_key: "label.fury" },
];
const heroStore = HeroStore();
const heroDataRepository = new HeroDataRepository();
const { t } = useI18n();
const route = useRoute();
const heroId = route.params.heroId.toString();
const campaignId = route.params.campaignId.toString();
const hero = heroDataRepository.find(heroId) ?? {};
const sequentialAdventureState = ref({});
const currentSeqAdv = heroStore.findInCampaign(
  heroId,
  campaignId,
).sequentialAdventureState;
const seqAdvState =
  typeof currentSeqAdv !== "undefined" && currentSeqAdv !== null
    ? currentSeqAdv
    : new SequentialAdventureState();
sequentialAdventureState.value = seqAdvState;
watch(
  sequentialAdventureState,
  (newState) => {
    heroStore.findInCampaign(heroId, campaignId).sequentialAdventureState =
      newState;
  },
  { deep: true },
); /* PartiallyEnd: #3632/scriptSetup.vue */
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
  )({});
  const __VLS_0 = __VLS_resolvedLocalAndGlobalComponents.Button;
  /** @type { [typeof __VLS_components.Button, typeof __VLS_components.Button, ] } */
  // @ts-ignore
  const __VLS_1 = __VLS_asFunctionalComponent(
    __VLS_0,
    new __VLS_0({ ...{ onClick: {} }, outlined: true, label: "Back" }),
  );
  const __VLS_2 = __VLS_1(
    { ...{ onClick: {} }, outlined: true, label: "Back" },
    ...__VLS_functionalComponentArgsRest(__VLS_1),
  );
  let __VLS_6;
  const __VLS_7 = {
    onClick: (...[$event]) => {
      __VLS_ctx.$router.go(-1);
    },
  };
  let __VLS_3;
  let __VLS_4;
  var __VLS_5;
  __VLS_elementAsFunction(
    __VLS_intrinsicElements.div,
    __VLS_intrinsicElements.div,
  )({
    id: "hero-card",
    ...{ class: "bg-neutral form-control drop-shadow rounded-lg p-4 mt-4" },
    ...{ style: {} },
  });
  __VLS_elementAsFunction(
    __VLS_intrinsicElements.div,
    __VLS_intrinsicElements.div,
  )({ ...{ class: "flex h-28" } });
  __VLS_elementAsFunction(
    __VLS_intrinsicElements.div,
    __VLS_intrinsicElements.div,
  )({});
  __VLS_elementAsFunction(__VLS_intrinsicElements.img)({
    ...{ class: "-ml-1 w-14 rounded-full hero-image" },
    src: __VLS_ctx.hero.images.avatar,
  });
  __VLS_elementAsFunction(
    __VLS_intrinsicElements.div,
    __VLS_intrinsicElements.div,
  )({ ...{ class: "pl-8" } });
  __VLS_elementAsFunction(
    __VLS_intrinsicElements.p,
    __VLS_intrinsicElements.p,
  )({});
  __VLS_ctx.hero.name;
  __VLS_elementAsFunction(
    __VLS_intrinsicElements.p,
    __VLS_intrinsicElements.p,
  )({});
  __VLS_ctx.t("label." + __VLS_ctx.hero.race.toLowerCase());
  __VLS_ctx.t("label." + __VLS_ctx.hero.class.toLowerCase().replace(" ", "-"));
  __VLS_elementAsFunction(
    __VLS_intrinsicElements.p,
    __VLS_intrinsicElements.p,
  )({});
  __VLS_ctx.t("text.path-of");
  __VLS_ctx.t("label." + __VLS_ctx.hero.path.toLowerCase());
  __VLS_elementAsFunction(
    __VLS_intrinsicElements.div,
    __VLS_intrinsicElements.div,
  )({ id: "sequential-select", ...{ class: "pt-4" } });
  __VLS_elementAsFunction(
    __VLS_intrinsicElements.label,
    __VLS_intrinsicElements.label,
  )({ for: "curse-cubes", ...{ class: "block pt-4" } });
  __VLS_ctx.t("text.curse-cubes");
  const __VLS_8 = __VLS_resolvedLocalAndGlobalComponents.InputNumber;
  /** @type { [typeof __VLS_components.InputNumber, ] } */
  // @ts-ignore
  const __VLS_9 = __VLS_asFunctionalComponent(
    __VLS_8,
    new __VLS_8({
      inputStyle: { width: "100%" },
      incrementButtonIcon: "pi pi-plus",
      decrementButtonIcon: "pi pi-minus",
      id: "curse-cubes",
      name: "curse-cubes",
      showButtons: true,
      buttonLayout: "horizontal",
      min: 0,
      max: 5,
      modelValue: __VLS_ctx.sequentialAdventureState.curseCubes,
    }),
  );
  const __VLS_10 = __VLS_9(
    {
      inputStyle: { width: "100%" },
      incrementButtonIcon: "pi pi-plus",
      decrementButtonIcon: "pi pi-minus",
      id: "curse-cubes",
      name: "curse-cubes",
      showButtons: true,
      buttonLayout: "horizontal",
      min: 0,
      max: 5,
      modelValue: __VLS_ctx.sequentialAdventureState.curseCubes,
    },
    ...__VLS_functionalComponentArgsRest(__VLS_9),
  );
  __VLS_elementAsFunction(
    __VLS_intrinsicElements.label,
    __VLS_intrinsicElements.label,
  )({ for: "trauma-cube", ...{ class: "block py-2" } });
  __VLS_ctx.t("text.trauma-cubes");
  const __VLS_14 = __VLS_resolvedLocalAndGlobalComponents.InputNumber;
  /** @type { [typeof __VLS_components.InputNumber, ] } */
  // @ts-ignore
  const __VLS_15 = __VLS_asFunctionalComponent(
    __VLS_14,
    new __VLS_14({
      inputStyle: { width: "100%" },
      incrementButtonIcon: "pi pi-plus",
      decrementButtonIcon: "pi pi-minus",
      id: "trauma-cube",
      name: "trauma-cube",
      showButtons: true,
      buttonLayout: "horizontal",
      min: 0,
      max: 1,
      modelValue: __VLS_ctx.sequentialAdventureState.traumaCubes,
    }),
  );
  const __VLS_16 = __VLS_15(
    {
      inputStyle: { width: "100%" },
      incrementButtonIcon: "pi pi-plus",
      decrementButtonIcon: "pi pi-minus",
      id: "trauma-cube",
      name: "trauma-cube",
      showButtons: true,
      buttonLayout: "horizontal",
      min: 0,
      max: 1,
      modelValue: __VLS_ctx.sequentialAdventureState.traumaCubes,
    },
    ...__VLS_functionalComponentArgsRest(__VLS_15),
  );
  const __VLS_20 = __VLS_resolvedLocalAndGlobalComponents.Divider;
  /** @type { [typeof __VLS_components.Divider, typeof __VLS_components.Divider, ] } */
  // @ts-ignore
  const __VLS_21 = __VLS_asFunctionalComponent(__VLS_20, new __VLS_20({}));
  const __VLS_22 = __VLS_21({}, ...__VLS_functionalComponentArgsRest(__VLS_21));
  __VLS_ctx.t("label.resources");
  __VLS_nonNullable(__VLS_25.slots).default;
  var __VLS_25;
  __VLS_elementAsFunction(
    __VLS_intrinsicElements.div,
    __VLS_intrinsicElements.div,
  )({ id: "resource-select" });
  for (const [resource] of __VLS_getVForSourceType(
    __VLS_ctx.resourceDefinitions,
  )) {
    resource.id;
    __VLS_elementAsFunction(
      __VLS_intrinsicElements.label,
      __VLS_intrinsicElements.label,
    )({ for: resource.id, ...{ class: "block py-2" } });
    __VLS_ctx.t(resource.translation_key);
    const __VLS_26 = __VLS_resolvedLocalAndGlobalComponents.InputNumber;
    /** @type { [typeof __VLS_components.InputNumber, ] } */
    // @ts-ignore
    const __VLS_27 = __VLS_asFunctionalComponent(
      __VLS_26,
      new __VLS_26({
        inputStyle: { width: "100%" },
        incrementButtonIcon: "pi pi-plus",
        decrementButtonIcon: "pi pi-minus",
        name: resource.id,
        id: resource.id,
        showButtons: true,
        buttonLayout: "horizontal",
        min: 0,
        max: 4,
        modelValue:
          __VLS_ctx.sequentialAdventureState.resources[
            resource.translation_key
          ],
      }),
    );
    const __VLS_28 = __VLS_27(
      {
        inputStyle: { width: "100%" },
        incrementButtonIcon: "pi pi-plus",
        decrementButtonIcon: "pi pi-minus",
        name: resource.id,
        id: resource.id,
        showButtons: true,
        buttonLayout: "horizontal",
        min: 0,
        max: 4,
        modelValue:
          __VLS_ctx.sequentialAdventureState.resources[
            resource.translation_key
          ],
      },
      ...__VLS_functionalComponentArgsRest(__VLS_27),
    );
  }
  __VLS_styleScopedClasses["bg-neutral"];
  __VLS_styleScopedClasses["form-control"];
  __VLS_styleScopedClasses["drop-shadow"];
  __VLS_styleScopedClasses["rounded-lg"];
  __VLS_styleScopedClasses["p-4"];
  __VLS_styleScopedClasses["mt-4"];
  __VLS_styleScopedClasses["flex"];
  __VLS_styleScopedClasses["h-28"];
  __VLS_styleScopedClasses["-ml-1"];
  __VLS_styleScopedClasses["w-14"];
  __VLS_styleScopedClasses["rounded-full"];
  __VLS_styleScopedClasses["hero-image"];
  __VLS_styleScopedClasses["pl-8"];
  __VLS_styleScopedClasses["pt-4"];
  __VLS_styleScopedClasses["block"];
  __VLS_styleScopedClasses["pt-4"];
  __VLS_styleScopedClasses["block"];
  __VLS_styleScopedClasses["py-2"];
  __VLS_styleScopedClasses["block"];
  __VLS_styleScopedClasses["py-2"];
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
      resourceDefinitions: resourceDefinitions,
      t: t,
      hero: hero,
      sequentialAdventureState: sequentialAdventureState,
    };
  },
});
export default (await import("vue")).defineComponent({
  setup() {
    return {};
  },
}); /* PartiallyEnd: #4569/main.vue */
