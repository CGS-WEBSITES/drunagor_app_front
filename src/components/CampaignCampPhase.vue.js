import { ref } from "vue";
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
const emit = defineEmits(["campPhase"]);
const { t } = useI18n();
const visible = ref(false);
const campaignStore = CampaignStore();
const heroStore = HeroStore();
function openModal() {
  visible.value = true;
}
function closeModal() {
  visible.value = false;
}
const props = defineProps();
function campPhase() {
  const campaign = campaignStore.find(props.campaignId);
  campaign.statusIds = [];
  campaign.isSequentialAdventure = false;
  campaign.sequentialAdventureRunes = 0;
  heroStore.findAllInCampaign(props.campaignId).forEach((hero) => {
    hero.statusIds = [];
    hero.sequentialAdventureState = null;
  });
  closeModal();
  emit("campPhase");
} /* PartiallyEnd: #3632/scriptSetup.vue */
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
  const __VLS_0 = __VLS_resolvedLocalAndGlobalComponents.Button;
  /** @type { [typeof __VLS_components.Button, typeof __VLS_components.Button, ] } */
  // @ts-ignore
  const __VLS_1 = __VLS_asFunctionalComponent(
    __VLS_0,
    new __VLS_0({
      ...{ onClick: {} },
      outlined: true,
      id: "camp-phase",
      label: __VLS_ctx.t("label.camp-phase"),
    }),
  );
  const __VLS_2 = __VLS_1(
    {
      ...{ onClick: {} },
      outlined: true,
      id: "camp-phase",
      label: __VLS_ctx.t("label.camp-phase"),
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
      header: __VLS_ctx.t("label.camp-phase"),
      dismissableMask: true,
      ...{ class: "w-full md:w-1/3 m-2" },
    }),
  );
  const __VLS_10 = __VLS_9(
    {
      visible: __VLS_ctx.visible,
      modal: true,
      header: __VLS_ctx.t("label.camp-phase"),
      dismissableMask: true,
      ...{ class: "w-full md:w-1/3 m-2" },
    },
    ...__VLS_functionalComponentArgsRest(__VLS_9),
  );
  __VLS_elementAsFunction(
    __VLS_intrinsicElements.span,
    __VLS_intrinsicElements.span,
  )({});
  __VLS_ctx.t("text.reset-state");
  const __VLS_14 = __VLS_resolvedLocalAndGlobalComponents.BaseButtonMenu;
  /** @type { [typeof __VLS_components.BaseButtonMenu, typeof __VLS_components.BaseButtonMenu, ] } */
  // @ts-ignore
  const __VLS_15 = __VLS_asFunctionalComponent(__VLS_14, new __VLS_14({}));
  const __VLS_16 = __VLS_15({}, ...__VLS_functionalComponentArgsRest(__VLS_15));
  const __VLS_20 = __VLS_resolvedLocalAndGlobalComponents.Button;
  /** @type { [typeof __VLS_components.Button, typeof __VLS_components.Button, ] } */
  // @ts-ignore
  const __VLS_21 = __VLS_asFunctionalComponent(
    __VLS_20,
    new __VLS_20({
      ...{ onClick: {} },
      outlined: true,
      label: __VLS_ctx.t("label.yes"),
    }),
  );
  const __VLS_22 = __VLS_21(
    { ...{ onClick: {} }, outlined: true, label: __VLS_ctx.t("label.yes") },
    ...__VLS_functionalComponentArgsRest(__VLS_21),
  );
  let __VLS_26;
  const __VLS_27 = {
    onClick: __VLS_ctx.campPhase,
  };
  let __VLS_23;
  let __VLS_24;
  var __VLS_25;
  const __VLS_28 = __VLS_resolvedLocalAndGlobalComponents.Button;
  /** @type { [typeof __VLS_components.Button, typeof __VLS_components.Button, ] } */
  // @ts-ignore
  const __VLS_29 = __VLS_asFunctionalComponent(
    __VLS_28,
    new __VLS_28({
      ...{ onClick: {} },
      outlined: true,
      label: __VLS_ctx.t("label.no"),
    }),
  );
  const __VLS_30 = __VLS_29(
    { ...{ onClick: {} }, outlined: true, label: __VLS_ctx.t("label.no") },
    ...__VLS_functionalComponentArgsRest(__VLS_29),
  );
  let __VLS_34;
  const __VLS_35 = {
    onClick: __VLS_ctx.closeModal,
  };
  let __VLS_31;
  let __VLS_32;
  var __VLS_33;
  __VLS_nonNullable(__VLS_19.slots).default;
  var __VLS_19;
  __VLS_nonNullable(__VLS_13.slots).default;
  var __VLS_13;
  __VLS_styleScopedClasses["w-full"];
  __VLS_styleScopedClasses["md:w-1/3"];
  __VLS_styleScopedClasses["m-2"];
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
      visible: visible,
      openModal: openModal,
      closeModal: closeModal,
      campPhase: campPhase,
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
}); /* PartiallyEnd: #4569/main.vue */
