import { ConfigurationStore } from "@/store/ConfigurationStore";
import { VariantStore } from "@/store/VariantStore.js";
import { watch, ref } from "vue";
import { useToast } from "primevue/usetoast";
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
const toast = useToast();
const { t } = useI18n();
const variantStore = VariantStore();
const configurationStore = ConfigurationStore();
const variantSettings = ref([]);
configurationStore.enabledVariants.forEach((enabledVariant) => {
  variantSettings.value.push(enabledVariant);
});
watch(variantSettings, async (newSettings) => {
  if (newSettings.length > 0) {
    configurationStore.$patch({ enabledVariants: newSettings });
  } else {
    toast.add({
      severity: "error",
      summary: "Error",
      detail: t("configuration.error.atleast-one-selected"),
      life: 3000,
    });
  }
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
  const __VLS_0 = __VLS_resolvedLocalAndGlobalComponents.VCard;
  /** @type { [typeof __VLS_components.VCard, typeof __VLS_components.vCard, typeof __VLS_components.VCard, typeof __VLS_components.vCard, ] } */
  // @ts-ignore
  const __VLS_1 = __VLS_asFunctionalComponent(
    __VLS_0,
    new __VLS_0({ ...{ class: "my-4" } }),
  );
  const __VLS_2 = __VLS_1(
    { ...{ class: "my-4" } },
    ...__VLS_functionalComponentArgsRest(__VLS_1),
  );
  var __VLS_6 = {};
  const __VLS_7 = __VLS_resolvedLocalAndGlobalComponents.VCardTitle;
  /** @type { [typeof __VLS_components.VCardTitle, typeof __VLS_components.vCardTitle, typeof __VLS_components.VCardTitle, typeof __VLS_components.vCardTitle, ] } */
  // @ts-ignore
  const __VLS_8 = __VLS_asFunctionalComponent(__VLS_7, new __VLS_7({}));
  const __VLS_9 = __VLS_8({}, ...__VLS_functionalComponentArgsRest(__VLS_8));
  __VLS_ctx.$t("configuration.enabled-variant");
  __VLS_nonNullable(__VLS_12.slots).default;
  var __VLS_12;
  const __VLS_13 = __VLS_resolvedLocalAndGlobalComponents.VCardText;
  /** @type { [typeof __VLS_components.VCardText, typeof __VLS_components.vCardText, typeof __VLS_components.VCardText, typeof __VLS_components.vCardText, ] } */
  // @ts-ignore
  const __VLS_14 = __VLS_asFunctionalComponent(__VLS_13, new __VLS_13({}));
  const __VLS_15 = __VLS_14({}, ...__VLS_functionalComponentArgsRest(__VLS_14));
  for (const [variant] of __VLS_getVForSourceType(
    __VLS_ctx.variantStore.getAll(),
  )) {
    const __VLS_19 = __VLS_resolvedLocalAndGlobalComponents.VCheckbox;
    /** @type { [typeof __VLS_components.VCheckbox, typeof __VLS_components.vCheckbox, typeof __VLS_components.VCheckbox, typeof __VLS_components.vCheckbox, ] } */
    // @ts-ignore
    const __VLS_20 = __VLS_asFunctionalComponent(
      __VLS_19,
      new __VLS_19({
        dense: true,
        key: variant.id,
        label: __VLS_ctx.$t(variant.translation_key),
        modelValue: __VLS_ctx.variantSettings,
        value: variant.id,
      }),
    );
    const __VLS_21 = __VLS_20(
      {
        dense: true,
        key: variant.id,
        label: __VLS_ctx.$t(variant.translation_key),
        modelValue: __VLS_ctx.variantSettings,
        value: variant.id,
      },
      ...__VLS_functionalComponentArgsRest(__VLS_20),
    );
  }
  __VLS_nonNullable(__VLS_18.slots).default;
  var __VLS_18;
  __VLS_nonNullable(__VLS_5.slots).default;
  var __VLS_5;
  __VLS_styleScopedClasses["my-4"];
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
      variantStore: variantStore,
      variantSettings: variantSettings,
    };
  },
});
export default (await import("vue")).defineComponent({
  setup() {
    return {};
  },
  __typeEl: {},
}); /* PartiallyEnd: #4569/main.vue */
