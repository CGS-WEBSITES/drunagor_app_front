import { CampaignStore } from "@/store/CampaignStore";
import StoryRecordApocalypse from "@/components/StoryRecordApocalypse.vue";
import StoryRecordAwakenings from "@/components/StoryRecordAwakenings.vue";
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
const campaignStore = CampaignStore();
const campaign = campaignStore.find(
  props.campaignId,
); /* PartiallyEnd: #3632/scriptSetup.vue */
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
  )({ ...{ class: "p-4" }, ...{ style: {} } });
  if (__VLS_ctx.campaign.campaign == "apocalypse") {
    // @ts-ignore
    [StoryRecordApocalypse];
    // @ts-ignore
    const __VLS_0 = __VLS_asFunctionalComponent(
      StoryRecordApocalypse,
      new StoryRecordApocalypse({ campaignId: props.campaignId }),
    );
    const __VLS_1 = __VLS_0(
      { campaignId: props.campaignId },
      ...__VLS_functionalComponentArgsRest(__VLS_0),
    );
  }
  if (__VLS_ctx.campaign.campaign == "awakenings") {
    // @ts-ignore
    [StoryRecordAwakenings];
    // @ts-ignore
    const __VLS_5 = __VLS_asFunctionalComponent(
      StoryRecordAwakenings,
      new StoryRecordAwakenings({ campaignId: props.campaignId }),
    );
    const __VLS_6 = __VLS_5(
      { campaignId: props.campaignId },
      ...__VLS_functionalComponentArgsRest(__VLS_5),
    );
  }
  __VLS_styleScopedClasses["p-4"];
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
      StoryRecordApocalypse: StoryRecordApocalypse,
      StoryRecordAwakenings: StoryRecordAwakenings,
      campaign: campaign,
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
