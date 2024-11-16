import { ref, watch } from "vue";
import { HeroStore } from "@/store/HeroStore";
import { useI18n } from "vue-i18n";
import { ConfigurationStore } from "@/store/ConfigurationStore";
import Dropdown from "primevue/dropdown";
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
const configurationStore = ConfigurationStore();
const { t } = useI18n();
props.repository.load(configurationStore.enabledLanguage);
const auras = props.repository.findAll();
const auraId = ref("");
auraId.value =
  heroStore.findInCampaign(props.heroId, props.campaignId).auraId ?? "";
watch(auraId, (newAuraId) => {
  heroStore.findInCampaign(props.heroId, props.campaignId).auraId = newAuraId;
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
  )({ "data-testid": "campaign-log-aura-" + __VLS_ctx.heroId });
  const __VLS_0 = __VLS_resolvedLocalAndGlobalComponents.Dropdown;
  /** @type { [typeof __VLS_components.Dropdown, ] } */
  // @ts-ignore
  const __VLS_1 = __VLS_asFunctionalComponent(
    __VLS_0,
    new __VLS_0({
      modelValue: __VLS_ctx.auraId,
      options: __VLS_ctx.auras,
      showClear: true,
      checkmark: true,
      filter: true,
      optionLabel: "name",
      optionValue: "id",
      placeholder: __VLS_ctx.$t("text.select-aura"),
      ...{ class: "w-full md:w-14rem" },
    }),
  );
  const __VLS_2 = __VLS_1(
    {
      modelValue: __VLS_ctx.auraId,
      options: __VLS_ctx.auras,
      showClear: true,
      checkmark: true,
      filter: true,
      optionLabel: "name",
      optionValue: "id",
      placeholder: __VLS_ctx.$t("text.select-aura"),
      ...{ class: "w-full md:w-14rem" },
    },
    ...__VLS_functionalComponentArgsRest(__VLS_1),
  );
  if (__VLS_ctx.auraId) {
    __VLS_elementAsFunction(
      __VLS_intrinsicElements.p,
      __VLS_intrinsicElements.p,
    )({ ...{ class: "text-sm text-gray-500 py-2" } });
    __VLS_ctx.t("text.aura-info");
    __VLS_elementAsFunction(
      __VLS_intrinsicElements.p,
      __VLS_intrinsicElements.p,
    )({});
    props.repository.find(__VLS_ctx.auraId)?.effect;
  }
  __VLS_styleScopedClasses["w-full"];
  __VLS_styleScopedClasses["md:w-14rem"];
  __VLS_styleScopedClasses["text-sm"];
  __VLS_styleScopedClasses["text-gray-500"];
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
      Dropdown: Dropdown,
      t: t,
      auras: auras,
      auraId: auraId,
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
