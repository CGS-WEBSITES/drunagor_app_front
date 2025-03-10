import { ref } from "vue";
import { useToast } from "primevue/usetoast";
import { CampaignStore } from "@/store/CampaignStore";
import { HeroStore } from "@/store/HeroStore";
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
const props = defineProps();
const visible = ref(false);
const campaignStore = CampaignStore();
const heroStore = HeroStore();
const token = ref("");
const { t } = useI18n();
function openModal() {
  const campaignCopy = JSON.parse(
    JSON.stringify(campaignStore.find(props.campaignId)),
  );
  campaignCopy.campaignId = "";
  const heroes = heroStore.findAllInCampaign(props.campaignId);
  const data = {
    campaignData: campaignCopy,
    heroes: heroes.map((h) => {
      const clone = JSON.parse(JSON.stringify(h));
      clone.campaignId = "";
      return clone;
    }),
  };
  token.value = btoa(JSON.stringify(data));
  visible.value = true;
}
function copyToClipboard() {
  navigator.clipboard.writeText(token.value);
  toast.add({
    severity: "success",
    summary: t("label.success"),
    detail: "Token has been copied to clipboard.",
    life: 3000,
  });
  closeModal();
}
function closeModal() {
  visible.value = false;
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
  const __VLS_0 = __VLS_resolvedLocalAndGlobalComponents.Button;
  /** @type { [typeof __VLS_components.Button, typeof __VLS_components.Button, ] } */
  // @ts-ignore
  const __VLS_1 = __VLS_asFunctionalComponent(
    __VLS_0,
    new __VLS_0({
      ...{ onClick: {} },
      outlined: true,
      id: "campaign-export",
      label: __VLS_ctx.t("label.export-campaign"),
    }),
  );
  const __VLS_2 = __VLS_1(
    {
      ...{ onClick: {} },
      outlined: true,
      id: "campaign-export",
      label: __VLS_ctx.t("label.export-campaign"),
    },
    ...__VLS_functionalComponentArgsRest(__VLS_1),
  );
  let __VLS_6;
  const __VLS_7 = {
    onClick: __VLS_ctx.openModal,
  };
  let __VLS_3;
  let __VLS_4;
  var __VLS_5;
  const __VLS_8 = __VLS_resolvedLocalAndGlobalComponents.Dialog;
  /** @type { [typeof __VLS_components.Dialog, typeof __VLS_components.Dialog, ] } */
  // @ts-ignore
  const __VLS_9 = __VLS_asFunctionalComponent(
    __VLS_8,
    new __VLS_8({
      visible: __VLS_ctx.visible,
      modal: true,
      header: __VLS_ctx.t("label.export-campaign"),
      dismissableMask: true,
      ...{ class: "w-full md:w-1/3 m-2" },
    }),
  );
  const __VLS_10 = __VLS_9(
    {
      visible: __VLS_ctx.visible,
      modal: true,
      header: __VLS_ctx.t("label.export-campaign"),
      dismissableMask: true,
      ...{ class: "w-full md:w-1/3 m-2" },
    },
    ...__VLS_functionalComponentArgsRest(__VLS_9),
  );
  __VLS_elementAsFunction(
    __VLS_intrinsicElements.div,
    __VLS_intrinsicElements.div,
  )({ ...{ class: "py-4" } });
  __VLS_ctx.t("text.copy-this-token");
  const __VLS_14 = __VLS_resolvedLocalAndGlobalComponents.Textarea;
  /** @type { [typeof __VLS_components.Textarea, typeof __VLS_components.Textarea, ] } */
  // @ts-ignore
  const __VLS_15 = __VLS_asFunctionalComponent(
    __VLS_14,
    new __VLS_14({
      id: "campaign-token",
      modelValue: __VLS_ctx.token,
      rows: "5",
      cols: "25",
      ...{ class: "w-full" },
    }),
  );
  const __VLS_16 = __VLS_15(
    {
      id: "campaign-token",
      modelValue: __VLS_ctx.token,
      rows: "5",
      cols: "25",
      ...{ class: "w-full" },
    },
    ...__VLS_functionalComponentArgsRest(__VLS_15),
  );
  const __VLS_20 = __VLS_resolvedLocalAndGlobalComponents.BaseButtonMenu;
  /** @type { [typeof __VLS_components.BaseButtonMenu, typeof __VLS_components.BaseButtonMenu, ] } */
  // @ts-ignore
  const __VLS_21 = __VLS_asFunctionalComponent(__VLS_20, new __VLS_20({}));
  const __VLS_22 = __VLS_21({}, ...__VLS_functionalComponentArgsRest(__VLS_21));
  const __VLS_26 = __VLS_resolvedLocalAndGlobalComponents.Button;
  /** @type { [typeof __VLS_components.Button, typeof __VLS_components.Button, ] } */
  // @ts-ignore
  const __VLS_27 = __VLS_asFunctionalComponent(
    __VLS_26,
    new __VLS_26({
      ...{ onClick: {} },
      outlined: true,
      label: __VLS_ctx.t("label.copy-to-clipboard"),
    }),
  );
  const __VLS_28 = __VLS_27(
    {
      ...{ onClick: {} },
      outlined: true,
      label: __VLS_ctx.t("label.copy-to-clipboard"),
    },
    ...__VLS_functionalComponentArgsRest(__VLS_27),
  );
  let __VLS_32;
  const __VLS_33 = {
    onClick: __VLS_ctx.copyToClipboard,
  };
  let __VLS_29;
  let __VLS_30;
  var __VLS_31;
  const __VLS_34 = __VLS_resolvedLocalAndGlobalComponents.Button;
  /** @type { [typeof __VLS_components.Button, typeof __VLS_components.Button, ] } */
  // @ts-ignore
  const __VLS_35 = __VLS_asFunctionalComponent(
    __VLS_34,
    new __VLS_34({
      ...{ onClick: {} },
      outlined: true,
      label: __VLS_ctx.t("label.cancel"),
    }),
  );
  const __VLS_36 = __VLS_35(
    { ...{ onClick: {} }, outlined: true, label: __VLS_ctx.t("label.cancel") },
    ...__VLS_functionalComponentArgsRest(__VLS_35),
  );
  let __VLS_40;
  const __VLS_41 = {
    onClick: __VLS_ctx.closeModal,
  };
  let __VLS_37;
  let __VLS_38;
  var __VLS_39;
  __VLS_nonNullable(__VLS_25.slots).default;
  var __VLS_25;
  __VLS_nonNullable(__VLS_13.slots).default;
  var __VLS_13;
  __VLS_styleScopedClasses["w-full"];
  __VLS_styleScopedClasses["md:w-1/3"];
  __VLS_styleScopedClasses["m-2"];
  __VLS_styleScopedClasses["py-4"];
  __VLS_styleScopedClasses["w-full"];
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
      visible: visible,
      token: token,
      t: t,
      openModal: openModal,
      copyToClipboard: copyToClipboard,
      closeModal: closeModal,
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
