import { ref } from "vue";
import CoreLogo from "@/assets/campaign/logo/core.webp";
import ApocalypseLogo from "@/assets/campaign/logo/apocalypse.webp";
import AwakeningsLogo from "@/assets/campaign/logo/awakenings.webp";
import { CampaignStore } from "@/store/CampaignStore";
import { Campaign } from "@/store/Campaign";
import { customAlphabet } from "nanoid";
import { useRouter } from "vue-router";
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
const visible = ref(false);
const campaignStore = CampaignStore();
const nanoid = customAlphabet("1234567890", 5);
const router = useRouter();
const { t } = useI18n();
function newCampaign(campaign) {
  let campaignId = nanoid();
  campaignStore.add(new Campaign(campaignId, campaign));
  visible.value = false;
  router.push("/campaign/" + campaignId);
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
      id: "campaign-new",
      label: __VLS_ctx.t("label.new-campaign"),
    }),
  );
  const __VLS_2 = __VLS_1(
    {
      ...{ onClick: {} },
      outlined: true,
      id: "campaign-new",
      label: __VLS_ctx.t("label.new-campaign"),
    },
    ...__VLS_functionalComponentArgsRest(__VLS_1),
  );
  let __VLS_6;
  const __VLS_7 = {
    onClick: (...[$event]) => {
      __VLS_ctx.visible = true;
    },
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
      header: __VLS_ctx.t("label.new-campaign"),
      dismissableMask: true,
      ...{ class: "w-full md:w-1/3 m-2" },
    }),
  );
  const __VLS_10 = __VLS_9(
    {
      visible: __VLS_ctx.visible,
      modal: true,
      header: __VLS_ctx.t("label.new-campaign"),
      dismissableMask: true,
      ...{ class: "w-full md:w-1/3 m-2" },
    },
    ...__VLS_functionalComponentArgsRest(__VLS_9),
  );
  __VLS_elementAsFunction(
    __VLS_intrinsicElements.div,
    __VLS_intrinsicElements.div,
  )({ ...{ class: "grid place-items-center gap-2" } });
  __VLS_elementAsFunction(__VLS_intrinsicElements.img)({
    ...{
      onClick: (...[$event]) => {
        __VLS_ctx.newCampaign("core");
      },
    },
    id: "campaign-core",
    ...{ class: "cursor-pointer" },
    src: __VLS_ctx.CoreLogo.toString(),
  });
  __VLS_elementAsFunction(__VLS_intrinsicElements.img)({
    ...{
      onClick: (...[$event]) => {
        __VLS_ctx.newCampaign("apocalypse");
      },
    },
    id: "campaign-apocalypse",
    ...{ class: "cursor-pointer" },
    src: __VLS_ctx.ApocalypseLogo.toString(),
  });
  __VLS_elementAsFunction(__VLS_intrinsicElements.img)({
    ...{
      onClick: (...[$event]) => {
        __VLS_ctx.newCampaign("awakenings");
      },
    },
    id: "campaign-awakenings",
    ...{ class: "cursor-pointer" },
    src: __VLS_ctx.AwakeningsLogo.toString(),
  });
  __VLS_nonNullable(__VLS_13.slots).default;
  var __VLS_13;
  __VLS_styleScopedClasses["w-full"];
  __VLS_styleScopedClasses["md:w-1/3"];
  __VLS_styleScopedClasses["m-2"];
  __VLS_styleScopedClasses["grid"];
  __VLS_styleScopedClasses["place-items-center"];
  __VLS_styleScopedClasses["gap-2"];
  __VLS_styleScopedClasses["cursor-pointer"];
  __VLS_styleScopedClasses["cursor-pointer"];
  __VLS_styleScopedClasses["cursor-pointer"];
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
      CoreLogo: CoreLogo,
      ApocalypseLogo: ApocalypseLogo,
      AwakeningsLogo: AwakeningsLogo,
      visible: visible,
      t: t,
      newCampaign: newCampaign,
    };
  },
});
export default (await import("vue")).defineComponent({
  setup() {
    return {};
  },
}); /* PartiallyEnd: #4569/main.vue */
