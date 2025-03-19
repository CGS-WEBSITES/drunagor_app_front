import { setLanguage, loadLanguage } from "@/language";
import { LanguageStore } from "@/store/LanguageStore";
import { watch } from "vue";
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
const languageStore = LanguageStore();
const { locale } = useI18n();
watch(locale, () => {
  setLanguage(locale.value);
  loadLanguage(locale.value);
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
  const __VLS_0 = __VLS_resolvedLocalAndGlobalComponents.Card;
  /** @type { [typeof __VLS_components.Card, typeof __VLS_components.Card, ] } */
  // @ts-ignore
  const __VLS_1 = __VLS_asFunctionalComponent(
    __VLS_0,
    new __VLS_0({
      ...{ class: "w-full" },
      dataTestid: "configuration-language",
    }),
  );
  const __VLS_2 = __VLS_1(
    { ...{ class: "w-full" }, dataTestid: "configuration-language" },
    ...__VLS_functionalComponentArgsRest(__VLS_1),
  );
  var __VLS_6 = {};
  __VLS_elementAsFunction(
    __VLS_intrinsicElements.template,
    __VLS_intrinsicElements.template,
  )({});
  {
    const { title: __VLS_thisSlot } = __VLS_nonNullable(__VLS_5.slots);
    __VLS_ctx.$t("configuration.language");
  }
  __VLS_elementAsFunction(
    __VLS_intrinsicElements.template,
    __VLS_intrinsicElements.template,
  )({});
  {
    const { content: __VLS_thisSlot } = __VLS_nonNullable(__VLS_5.slots);
    for (const [language] of __VLS_getVForSourceType(
      __VLS_ctx.languageStore.getAll(),
    )) {
      __VLS_elementAsFunction(
        __VLS_intrinsicElements.div,
        __VLS_intrinsicElements.div,
      )({ key: language.locale, ...{ class: "pb-4" } });
      __VLS_elementAsFunction(
        __VLS_intrinsicElements.label,
        __VLS_intrinsicElements.label,
      )({ ...{ class: "cursor-pointer" } });
      __VLS_ctx.$t(language.translation_key);
      const __VLS_7 = __VLS_resolvedLocalAndGlobalComponents.RadioButton;
      /** @type { [typeof __VLS_components.RadioButton, ] } */
      // @ts-ignore
      const __VLS_8 = __VLS_asFunctionalComponent(
        __VLS_7,
        new __VLS_7({
          variant: "outlined",
          modelValue: __VLS_ctx.$i18n.locale,
          dataTestid: "configuration-language-" + language.locale,
          value: language.locale,
          ...{ class: "float-right" },
        }),
      );
      const __VLS_9 = __VLS_8(
        {
          variant: "outlined",
          modelValue: __VLS_ctx.$i18n.locale,
          dataTestid: "configuration-language-" + language.locale,
          value: language.locale,
          ...{ class: "float-right" },
        },
        ...__VLS_functionalComponentArgsRest(__VLS_8),
      );
    }
    __VLS_elementAsFunction(
      __VLS_intrinsicElements.div,
      __VLS_intrinsicElements.div,
    )({});
    __VLS_elementAsFunction(
      __VLS_intrinsicElements.a,
      __VLS_intrinsicElements.a,
    )({
      target: "_blank",
      ...{ class: "underline" },
      href: "https://github.com/marcojanssen/drunagor-helper/blob/main/CONTRIBUTING.md",
    });
  }
  var __VLS_5;
  __VLS_styleScopedClasses["w-full"];
  __VLS_styleScopedClasses["pb-4"];
  __VLS_styleScopedClasses["cursor-pointer"];
  __VLS_styleScopedClasses["float-right"];
  __VLS_styleScopedClasses["underline"];
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
      languageStore: languageStore,
    };
  },
});
export default (await import("vue")).defineComponent({
  setup() {
    return {};
  },
  __typeEl: {},
}); /* PartiallyEnd: #4569/main.vue */
