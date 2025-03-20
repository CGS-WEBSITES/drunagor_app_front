const {
  defineProps,
  defineSlots,
  defineEmits,
  defineExpose,
  defineModel,
  defineOptions,
  withDefaults,
} = await import("vue");
const props = defineProps(); /* PartiallyEnd: #3632/scriptSetup.vue */
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
    id: props.id,
    ...{ class: "flex items-center gap-4 p-2 h-16 cursor-pointer" },
  });
  if (props.avatar) {
    __VLS_elementAsFunction(__VLS_intrinsicElements.img)({
      ...{ class: "w-12 h-12 rounded-full bg-base-300" },
      src: props.avatar,
    });
  }
  var __VLS_0 = {};
  __VLS_styleScopedClasses["flex"];
  __VLS_styleScopedClasses["items-center"];
  __VLS_styleScopedClasses["gap-4"];
  __VLS_styleScopedClasses["p-2"];
  __VLS_styleScopedClasses["h-16"];
  __VLS_styleScopedClasses["cursor-pointer"];
  __VLS_styleScopedClasses["w-12"];
  __VLS_styleScopedClasses["h-12"];
  __VLS_styleScopedClasses["rounded-full"];
  __VLS_styleScopedClasses["bg-base-300"];
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
    return {};
  },
  __typeProps: {},
});
const __VLS_component = (await import("vue")).defineComponent({
  setup() {
    return {};
  },
  __typeProps: {},
  __typeEl: {},
});
export default {}; /* PartiallyEnd: #4569/main.vue */
