import { ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
const {
  defineProps,
  defineSlots,
  defineEmits,
  defineExpose,
  defineModel,
  defineOptions,
  withDefaults,
} = await import("vue");
const { t, locale } = useI18n();
const router = useRouter();
const items = ref(getMenuItems());
function getMenuItems() {
  return [
    {
      label: t("menu.random-monster"),
      icon: "mdi-help",
      command: () => {
        router.push({ name: "Home" });
      },
    },
    {
      label: t("menu.campaign"),
      icon: "mdi-account-group",
      command: () => {
        router.push({ name: "Campaign Overview" });
      },
    },
    {
      label: t("menu.keyword"),
      icon: "mdi-magnify",
      command: () => {
        router.push({ name: "Keyword" });
      },
    },
    {
      label: t("menu.settings"),
      icon: "mdi-cog",
      command: () => {
        router.push({ name: "Configuration" });
      },
    },
  ];
}
watch(locale, () => {
  items.value = getMenuItems();
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
  let __VLS_resolvedLocalAndGlobalComponents;
  __VLS_elementAsFunction(
    __VLS_intrinsicElements.div,
    __VLS_intrinsicElements.div,
  )({ ...{ class: "card sticky top-0 z-20" } });
  const __VLS_0 = __VLS_resolvedLocalAndGlobalComponents.VToolBar;
  /** @type { [typeof __VLS_components.VToolBar, typeof __VLS_components.vToolBar, typeof __VLS_components.VToolBar, typeof __VLS_components.vToolBar, ] } */
  // @ts-ignore
  const __VLS_1 = __VLS_asFunctionalComponent(
    __VLS_0,
    new __VLS_0({ density: "compact", ...{ class: "d-flex justify-center" } }),
  );
  const __VLS_2 = __VLS_1(
    { density: "compact", ...{ class: "d-flex justify-center" } },
    ...__VLS_functionalComponentArgsRest(__VLS_1),
  );
  for (const [item, i] of __VLS_getVForSourceType(__VLS_ctx.items)) {
    const __VLS_6 = __VLS_resolvedLocalAndGlobalComponents.VBtn;
    /** @type { [typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ] } */
    // @ts-ignore
    const __VLS_7 = __VLS_asFunctionalComponent(
      __VLS_6,
      new __VLS_6({
        ...{ onClick: {} },
        color: "blue",
        ...{ class: "mx-4 elevation-4" },
        key: i,
        prependIcon: item.icon,
      }),
    );
    const __VLS_8 = __VLS_7(
      {
        ...{ onClick: {} },
        color: "blue",
        ...{ class: "mx-4 elevation-4" },
        key: i,
        prependIcon: item.icon,
      },
      ...__VLS_functionalComponentArgsRest(__VLS_7),
    );
    let __VLS_12;
    const __VLS_13 = {
      onClick: (...[$event]) => {
        item.command();
      },
    };
    let __VLS_9;
    let __VLS_10;
    item.label;
    __VLS_nonNullable(__VLS_11.slots).default;
    var __VLS_11;
  }
  __VLS_nonNullable(__VLS_5.slots).default;
  var __VLS_5;
  __VLS_styleScopedClasses["card"];
  __VLS_styleScopedClasses["sticky"];
  __VLS_styleScopedClasses["top-0"];
  __VLS_styleScopedClasses["z-20"];
  __VLS_styleScopedClasses["d-flex"];
  __VLS_styleScopedClasses["justify-center"];
  __VLS_styleScopedClasses["mx-4"];
  __VLS_styleScopedClasses["elevation-4"];
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
      items: items,
    };
  },
});
export default (await import("vue")).defineComponent({
  setup() {
    return {};
  },
  __typeEl: {},
}); /* PartiallyEnd: #4569/main.vue */
