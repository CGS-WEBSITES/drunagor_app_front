import { ref, watch, computed } from "vue";
import { useI18n } from "vue-i18n";
import { sortBy } from "lodash-es";
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
const emit = defineEmits(["clear", "selected", "stash"]);
const placeholder = "Select Bag Slot " + props.bagSlot;
const selectedId = ref(props.value);
const { t } = useI18n();
let categories = computed(() => {
  return props.categories.map((category) => {
    const translatedItems = category.items.map((item) => {
      return {
        ...item,
        name: t(item.translation_key),
      };
    });
    const sortedItems = sortBy(translatedItems, ["name"]);
    return {
      ...category,
      items: sortedItems,
    };
  });
});
function onStash() {
  emit("stash");
  selectedId.value = "";
}
watch(selectedId, (newSelectedId) => {
  emit("selected", newSelectedId);
}); /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_fnComponent = (await import("vue")).defineComponent({
  emits: {},
});
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
  )({ ...{ class: "flex flex-row" } });
  __VLS_elementAsFunction(
    __VLS_intrinsicElements.div,
    __VLS_intrinsicElements.div,
  )({
    ...{ onClick: __VLS_ctx.onStash },
    ...{
      class:
        "hero-item-stash cursor-pointer text-slate-500 flex-shrink leading-10 pr-2",
    },
  });
  __VLS_ctx.t("label.stash");
  __VLS_elementAsFunction(
    __VLS_intrinsicElements.div,
    __VLS_intrinsicElements.div,
  )({
    ...{ class: "flex-auto" },
    "data-testid": "item-bag-slot-" + props.bagSlot,
  });
  const __VLS_0 = __VLS_resolvedLocalAndGlobalComponents.Dropdown;
  /** @type { [typeof __VLS_components.Dropdown, typeof __VLS_components.Dropdown, ] } */
  // @ts-ignore
  const __VLS_1 = __VLS_asFunctionalComponent(
    __VLS_0,
    new __VLS_0({
      modelValue: __VLS_ctx.selectedId,
      options: __VLS_ctx.categories,
      showClear: true,
      checkmark: true,
      filter: true,
      optionLabel: "name",
      optionValue: "id",
      optionGroupLabel: "name",
      optionGroupChildren: "items",
      placeholder: __VLS_ctx.placeholder,
      ...{ class: "w-full" },
    }),
  );
  const __VLS_2 = __VLS_1(
    {
      modelValue: __VLS_ctx.selectedId,
      options: __VLS_ctx.categories,
      showClear: true,
      checkmark: true,
      filter: true,
      optionLabel: "name",
      optionValue: "id",
      optionGroupLabel: "name",
      optionGroupChildren: "items",
      placeholder: __VLS_ctx.placeholder,
      ...{ class: "w-full" },
    },
    ...__VLS_functionalComponentArgsRest(__VLS_1),
  );
  __VLS_elementAsFunction(
    __VLS_intrinsicElements.template,
    __VLS_intrinsicElements.template,
  )({});
  {
    const { option: __VLS_thisSlot } = __VLS_nonNullable(__VLS_5.slots);
    const [slotProps] = __VLS_getSlotParams(__VLS_thisSlot);
    slotProps.option.name;
    if (__VLS_ctx.subTypeList(slotProps.option) !== "") {
      __VLS_elementAsFunction(
        __VLS_intrinsicElements.span,
        __VLS_intrinsicElements.span,
      )({ ...{ class: "text-slate-500 text-xs px-2" } });
      __VLS_ctx.subTypeList(slotProps.option);
    }
  }
  var __VLS_5;
  __VLS_styleScopedClasses["flex"];
  __VLS_styleScopedClasses["flex-row"];
  __VLS_styleScopedClasses["hero-item-stash"];
  __VLS_styleScopedClasses["cursor-pointer"];
  __VLS_styleScopedClasses["text-slate-500"];
  __VLS_styleScopedClasses["flex-shrink"];
  __VLS_styleScopedClasses["leading-10"];
  __VLS_styleScopedClasses["pr-2"];
  __VLS_styleScopedClasses["flex-auto"];
  __VLS_styleScopedClasses["w-full"];
  __VLS_styleScopedClasses["text-slate-500"];
  __VLS_styleScopedClasses["text-xs"];
  __VLS_styleScopedClasses["px-2"];
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
      placeholder: placeholder,
      selectedId: selectedId,
      t: t,
      categories: categories,
      onStash: onStash,
    };
  },
  emits: {},
  __typeProps: {},
});
export default (await import("vue")).defineComponent({
  setup() {
    return {};
  },
  emits: {},
  __typeProps: {},
  __typeEl: {},
}); /* PartiallyEnd: #4569/main.vue */
