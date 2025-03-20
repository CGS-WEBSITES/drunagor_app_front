import { CampaignStore } from "@/store/CampaignStore";
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
const campaignStore = CampaignStore();
const props = defineProps();
const { t } = useI18n(); /* PartiallyEnd: #3632/scriptSetup.vue */
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
    __VLS_intrinsicElements.label,
    __VLS_intrinsicElements.label,
  )({ for: "runes", ...{ class: "block pb-4" } });
  __VLS_ctx.t("text.number-of-runes");
  const __VLS_0 = __VLS_resolvedLocalAndGlobalComponents.InputNumber;
  /** @type { [typeof __VLS_components.InputNumber, ] } */
  // @ts-ignore
  const __VLS_1 = __VLS_asFunctionalComponent(
    __VLS_0,
    new __VLS_0({
      inputStyle: { width: "100%" },
      incrementButtonIcon: "pi pi-plus",
      decrementButtonIcon: "pi pi-minus",
      id: "runes",
      name: "runes",
      showButtons: true,
      buttonLayout: "horizontal",
      min: 0,
      modelValue: __VLS_ctx.campaignStore.find(props.campaignId)
        .sequentialAdventureRunes,
    }),
  );
  const __VLS_2 = __VLS_1(
    {
      inputStyle: { width: "100%" },
      incrementButtonIcon: "pi pi-plus",
      decrementButtonIcon: "pi pi-minus",
      id: "runes",
      name: "runes",
      showButtons: true,
      buttonLayout: "horizontal",
      min: 0,
      modelValue: __VLS_ctx.campaignStore.find(props.campaignId)
        .sequentialAdventureRunes,
    },
    ...__VLS_functionalComponentArgsRest(__VLS_1),
  );
  __VLS_styleScopedClasses["block"];
  __VLS_styleScopedClasses["pb-4"];
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
      campaignStore: campaignStore,
      t: t,
    };
  },
  __typeProps: {},
});
export default (await import("vue")).defineComponent({
  setup() {
    return {};
  },
  __typeProps: {},
}); /* PartiallyEnd: #4569/main.vue */
