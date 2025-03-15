import Toast from "primevue/toast";
import { ref } from "vue";
const {
  defineProps,
  defineSlots,
  defineEmits,
  defineExpose,
  defineModel,
  defineOptions,
  withDefaults,
} = await import("vue");
const theme = ref("dark");
const toggleTheme = () => {
  theme.value = theme.value == "dark" ? "light" : "dark";
}; /* PartiallyEnd: #3632/scriptSetup.vue */
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
  const __VLS_0 = __VLS_resolvedLocalAndGlobalComponents.VApp;
  /** @type { [typeof __VLS_components.VApp, typeof __VLS_components.vApp, typeof __VLS_components.VApp, typeof __VLS_components.vApp, ] } */
  // @ts-ignore
  const __VLS_1 = __VLS_asFunctionalComponent(
    __VLS_0,
    new __VLS_0({ theme: __VLS_ctx.theme }),
  );
  const __VLS_2 = __VLS_1(
    { theme: __VLS_ctx.theme },
    ...__VLS_functionalComponentArgsRest(__VLS_1),
  );
  var __VLS_6 = {};
  const __VLS_7 = __VLS_resolvedLocalAndGlobalComponents.Toast;
  /** @type { [typeof __VLS_components.Toast, ] } */
  // @ts-ignore
  const __VLS_8 = __VLS_asFunctionalComponent(__VLS_7, new __VLS_7({}));
  const __VLS_9 = __VLS_8({}, ...__VLS_functionalComponentArgsRest(__VLS_8));
  const __VLS_13 = __VLS_resolvedLocalAndGlobalComponents.VMain;
  /** @type { [typeof __VLS_components.VMain, typeof __VLS_components.vMain, typeof __VLS_components.VMain, typeof __VLS_components.vMain, ] } */
  // @ts-ignore
  const __VLS_14 = __VLS_asFunctionalComponent(__VLS_13, new __VLS_13({}));
  const __VLS_15 = __VLS_14({}, ...__VLS_functionalComponentArgsRest(__VLS_14));
  const __VLS_19 = __VLS_resolvedLocalAndGlobalComponents.VRow;
  /** @type { [typeof __VLS_components.VRow, typeof __VLS_components.vRow, typeof __VLS_components.VRow, typeof __VLS_components.vRow, ] } */
  // @ts-ignore
  const __VLS_20 = __VLS_asFunctionalComponent(
    __VLS_19,
    new __VLS_19({ noGutters: true }),
  );
  const __VLS_21 = __VLS_20(
    { noGutters: true },
    ...__VLS_functionalComponentArgsRest(__VLS_20),
  );
  const __VLS_25 = __VLS_resolvedLocalAndGlobalComponents.VAppBar;
  /** @type { [typeof __VLS_components.VAppBar, typeof __VLS_components.vAppBar, typeof __VLS_components.VAppBar, typeof __VLS_components.vAppBar, ] } */
  // @ts-ignore
  const __VLS_26 = __VLS_asFunctionalComponent(
    __VLS_25,
    new __VLS_25({
      flat: true,
      ...{ class: "border-b" },
      title: "App Drunagor",
    }),
  );
  const __VLS_27 = __VLS_26(
    { flat: true, ...{ class: "border-b" }, title: "App Drunagor" },
    ...__VLS_functionalComponentArgsRest(__VLS_26),
  );
  const __VLS_31 = __VLS_resolvedLocalAndGlobalComponents.VSpacer;
  /** @type { [typeof __VLS_components.VSpacer, typeof __VLS_components.vSpacer, typeof __VLS_components.VSpacer, typeof __VLS_components.vSpacer, ] } */
  // @ts-ignore
  const __VLS_32 = __VLS_asFunctionalComponent(__VLS_31, new __VLS_31({}));
  const __VLS_33 = __VLS_32({}, ...__VLS_functionalComponentArgsRest(__VLS_32));
  const __VLS_37 = __VLS_resolvedLocalAndGlobalComponents.VBtn;
  /** @type { [typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ] } */
  // @ts-ignore
  const __VLS_38 = __VLS_asFunctionalComponent(
    __VLS_37,
    new __VLS_37({ ...{ onClick: {} } }),
  );
  const __VLS_39 = __VLS_38(
    { ...{ onClick: {} } },
    ...__VLS_functionalComponentArgsRest(__VLS_38),
  );
  let __VLS_43;
  const __VLS_44 = {
    onClick: (...[$event]) => {
      __VLS_ctx.$router.push({ name: "Login" });
    },
  };
  let __VLS_40;
  let __VLS_41;
  __VLS_nonNullable(__VLS_42.slots).default;
  var __VLS_42;
  const __VLS_45 = __VLS_resolvedLocalAndGlobalComponents.VBtn;
  /** @type { [typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ] } */
  // @ts-ignore
  const __VLS_46 = __VLS_asFunctionalComponent(
    __VLS_45,
    new __VLS_45({ ...{ onClick: {} } }),
  );
  const __VLS_47 = __VLS_46(
    { ...{ onClick: {} } },
    ...__VLS_functionalComponentArgsRest(__VLS_46),
  );
  let __VLS_51;
  const __VLS_52 = {
    onClick: (...[$event]) => {
      __VLS_ctx.$router.push({ name: "CampaignTracker" });
    },
  };
  let __VLS_48;
  let __VLS_49;
  __VLS_nonNullable(__VLS_50.slots).default;
  var __VLS_50;
  const __VLS_53 = __VLS_resolvedLocalAndGlobalComponents.VBtn;
  /** @type { [typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ] } */
  // @ts-ignore
  const __VLS_54 = __VLS_asFunctionalComponent(
    __VLS_53,
    new __VLS_53({ ...{ onClick: {} } }),
  );
  const __VLS_55 = __VLS_54(
    { ...{ onClick: {} } },
    ...__VLS_functionalComponentArgsRest(__VLS_54),
  );
  let __VLS_59;
  const __VLS_60 = {
    onClick: (...[$event]) => {
      __VLS_ctx.$router.push({ name: "Teste" });
    },
  };
  let __VLS_56;
  let __VLS_57;
  __VLS_nonNullable(__VLS_58.slots).default;
  var __VLS_58;
  const __VLS_61 = __VLS_resolvedLocalAndGlobalComponents.VBtn;
  /** @type { [typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ] } */
  // @ts-ignore
  const __VLS_62 = __VLS_asFunctionalComponent(
    __VLS_61,
    new __VLS_61({ ...{ onClick: {} }, variant: "icon" }),
  );
  const __VLS_63 = __VLS_62(
    { ...{ onClick: {} }, variant: "icon" },
    ...__VLS_functionalComponentArgsRest(__VLS_62),
  );
  let __VLS_67;
  const __VLS_68 = {
    onClick: (...[$event]) => {
      __VLS_ctx.toggleTheme();
    },
  };
  let __VLS_64;
  let __VLS_65;
  const __VLS_69 = __VLS_resolvedLocalAndGlobalComponents.VIcon;
  /** @type { [typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, ] } */
  // @ts-ignore
  const __VLS_70 = __VLS_asFunctionalComponent(__VLS_69, new __VLS_69({}));
  const __VLS_71 = __VLS_70({}, ...__VLS_functionalComponentArgsRest(__VLS_70));
  __VLS_nonNullable(__VLS_74.slots).default;
  var __VLS_74;
  __VLS_nonNullable(__VLS_66.slots).default;
  var __VLS_66;
  __VLS_nonNullable(__VLS_30.slots).default;
  var __VLS_30;
  __VLS_nonNullable(__VLS_24.slots).default;
  var __VLS_24;
  const __VLS_75 = __VLS_resolvedLocalAndGlobalComponents.VRow;
  /** @type { [typeof __VLS_components.VRow, typeof __VLS_components.vRow, typeof __VLS_components.VRow, typeof __VLS_components.vRow, ] } */
  // @ts-ignore
  const __VLS_76 = __VLS_asFunctionalComponent(__VLS_75, new __VLS_75({}));
  const __VLS_77 = __VLS_76({}, ...__VLS_functionalComponentArgsRest(__VLS_76));
  const __VLS_81 = __VLS_resolvedLocalAndGlobalComponents.RouterView;
  /** @type { [typeof __VLS_components.RouterView, typeof __VLS_components.routerView, ] } */
  // @ts-ignore
  const __VLS_82 = __VLS_asFunctionalComponent(__VLS_81, new __VLS_81({}));
  const __VLS_83 = __VLS_82({}, ...__VLS_functionalComponentArgsRest(__VLS_82));
  __VLS_nonNullable(__VLS_80.slots).default;
  var __VLS_80;
  __VLS_nonNullable(__VLS_18.slots).default;
  var __VLS_18;
  __VLS_nonNullable(__VLS_5.slots).default;
  var __VLS_5;
  __VLS_styleScopedClasses["border-b"];
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
      Toast: Toast,
      theme: theme,
      toggleTheme: toggleTheme,
    };
  },
});
export default (await import("vue")).defineComponent({
  setup() {
    return {};
  },
  __typeEl: {},
}); /* PartiallyEnd: #4569/main.vue */
