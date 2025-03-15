import { computed, ref } from "vue";
import { HeroStore } from "@/store/HeroStore";
import { useRouter } from "vue-router";
import { SequentialAdventureState } from "@/store/Hero";
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
const props = defineProps();
const heroStore = HeroStore();
const router = useRouter();
const { t } = useI18n();
const sequentialAdventureState = ref({});
sequentialAdventureState.value =
  heroStore.findInCampaign(props.hero.id, props.campaignId)
    ?.sequentialAdventureState ?? new SequentialAdventureState();
const resourceDisplay = computed(() => {
  const resources = sequentialAdventureState.value?.resources;
  const resourcesToDisplay = [];
  for (const resource in resources) {
    if (resources[resource] > 0) {
      resourcesToDisplay.push({
        name: resource,
        count: resources[resource],
      });
    }
  }
  return resourcesToDisplay;
});
function openSequentialStateEditor() {
  router.push({
    name: "HeroSequentialState",
    params: { campaignId: props.campaignId, heroId: props.hero.id },
  });
} /* PartiallyEnd: #3632/scriptSetup.vue */
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
    ...{ onClick: __VLS_ctx.openSequentialStateEditor },
    id: "seq-adv",
    ...{ class: "pt-2 w-full cursor-pointer" },
  });
  __VLS_elementAsFunction(
    __VLS_intrinsicElements.div,
    __VLS_intrinsicElements.div,
  )({
    id: "curse-cubes",
    ...{ class: "resource-wrapper text-center flex justify-end" },
  });
  __VLS_elementAsFunction(
    __VLS_intrinsicElements.div,
    __VLS_intrinsicElements.div,
  )({ ...{ class: "w-full" } });
  __VLS_elementAsFunction(
    __VLS_intrinsicElements.span,
    __VLS_intrinsicElements.span,
  )({ ...{ class: "block border-b text-lg" } });
  __VLS_ctx.sequentialAdventureState.curseCubes;
  __VLS_elementAsFunction(
    __VLS_intrinsicElements.span,
    __VLS_intrinsicElements.span,
  )({ ...{ class: "whitespace-nowrap" } });
  __VLS_ctx.t("text.curse-cubes");
  __VLS_elementAsFunction(
    __VLS_intrinsicElements.div,
    __VLS_intrinsicElements.div,
  )({
    id: "trauma-cubes",
    ...{ class: "resource-wrapper text-center flex justify-end" },
  });
  __VLS_elementAsFunction(
    __VLS_intrinsicElements.div,
    __VLS_intrinsicElements.div,
  )({ ...{ class: "w-full" } });
  __VLS_elementAsFunction(
    __VLS_intrinsicElements.span,
    __VLS_intrinsicElements.span,
  )({ ...{ class: "block border-b text-lg" } });
  __VLS_ctx.sequentialAdventureState.traumaCubes;
  __VLS_elementAsFunction(
    __VLS_intrinsicElements.span,
    __VLS_intrinsicElements.span,
  )({ ...{ class: "whitespace-nowrap" } });
  __VLS_ctx.t("text.trauma-cubes");
  __VLS_elementAsFunction(
    __VLS_intrinsicElements.div,
    __VLS_intrinsicElements.div,
  )({ ...{ class: "text-center" } });
  if (__VLS_ctx.resourceDisplay.length > 0) {
    __VLS_elementAsFunction(
      __VLS_intrinsicElements.div,
      __VLS_intrinsicElements.div,
    )({ id: "resources", ...{ class: "block border-b text-lg" } });
    for (const [resource] of __VLS_getVForSourceType(
      __VLS_ctx.resourceDisplay,
    )) {
      __VLS_elementAsFunction(
        __VLS_intrinsicElements.span,
        __VLS_intrinsicElements.span,
      )({ key: resource.name, ...{ class: "block" } });
      resource.count;
      __VLS_ctx.t(resource.name);
    }
  } else {
    __VLS_elementAsFunction(
      __VLS_intrinsicElements.div,
      __VLS_intrinsicElements.div,
    )({ ...{ class: "block border-b text-lg" } });
    __VLS_elementAsFunction(
      __VLS_intrinsicElements.span,
      __VLS_intrinsicElements.span,
    )({ ...{ class: "italic text-sm text-gray-500" } });
    __VLS_ctx.t("text.no-resources");
  }
  __VLS_elementAsFunction(
    __VLS_intrinsicElements.span,
    __VLS_intrinsicElements.span,
  )({});
  __VLS_ctx.t("label.resources");
  __VLS_styleScopedClasses["pt-2"];
  __VLS_styleScopedClasses["w-full"];
  __VLS_styleScopedClasses["cursor-pointer"];
  __VLS_styleScopedClasses["resource-wrapper"];
  __VLS_styleScopedClasses["text-center"];
  __VLS_styleScopedClasses["flex"];
  __VLS_styleScopedClasses["justify-end"];
  __VLS_styleScopedClasses["w-full"];
  __VLS_styleScopedClasses["block"];
  __VLS_styleScopedClasses["border-b"];
  __VLS_styleScopedClasses["text-lg"];
  __VLS_styleScopedClasses["whitespace-nowrap"];
  __VLS_styleScopedClasses["resource-wrapper"];
  __VLS_styleScopedClasses["text-center"];
  __VLS_styleScopedClasses["flex"];
  __VLS_styleScopedClasses["justify-end"];
  __VLS_styleScopedClasses["w-full"];
  __VLS_styleScopedClasses["block"];
  __VLS_styleScopedClasses["border-b"];
  __VLS_styleScopedClasses["text-lg"];
  __VLS_styleScopedClasses["whitespace-nowrap"];
  __VLS_styleScopedClasses["text-center"];
  __VLS_styleScopedClasses["block"];
  __VLS_styleScopedClasses["border-b"];
  __VLS_styleScopedClasses["text-lg"];
  __VLS_styleScopedClasses["block"];
  __VLS_styleScopedClasses["block"];
  __VLS_styleScopedClasses["border-b"];
  __VLS_styleScopedClasses["text-lg"];
  __VLS_styleScopedClasses["italic"];
  __VLS_styleScopedClasses["text-sm"];
  __VLS_styleScopedClasses["text-gray-500"];
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
      t: t,
      sequentialAdventureState: sequentialAdventureState,
      resourceDisplay: resourceDisplay,
      openSequentialStateEditor: openSequentialStateEditor,
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
