import { CampaignStore } from "@/store/CampaignStore";
import { ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import FloatLabel from "primevue/floatlabel";
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
const { t } = useI18n();
const campaignStore = CampaignStore();
const campaign = campaignStore.find(props.campaignId);
const name = ref(campaign.name);
watch(name, async (newName) => {
  campaignStore.find(props.campaignId).name = newName;
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
  const __VLS_0 = __VLS_resolvedLocalAndGlobalComponents.FloatLabel;
  /** @type { [typeof __VLS_components.FloatLabel, typeof __VLS_components.FloatLabel, ] } */
  // @ts-ignore
  const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({}));
  const __VLS_2 = __VLS_1({}, ...__VLS_functionalComponentArgsRest(__VLS_1));
  var __VLS_6 = {};
  const __VLS_7 = __VLS_resolvedLocalAndGlobalComponents.InputText;
  /** @type { [typeof __VLS_components.InputText, ] } */
  // @ts-ignore
  const __VLS_8 = __VLS_asFunctionalComponent(
    __VLS_7,
    new __VLS_7({
      ...{ class: "w-full" },
      id: "campaign-log-name",
      modelValue: __VLS_ctx.name,
    }),
  );
  const __VLS_9 = __VLS_8(
    {
      ...{ class: "w-full" },
      id: "campaign-log-name",
      modelValue: __VLS_ctx.name,
    },
    ...__VLS_functionalComponentArgsRest(__VLS_8),
  );
  __VLS_elementAsFunction(
    __VLS_intrinsicElements.label,
    __VLS_intrinsicElements.label,
  )({ for: "campaign-log-name" });
  __VLS_ctx.t("text.party-name");
  __VLS_nonNullable(__VLS_5.slots).default;
  var __VLS_5;
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
      FloatLabel: FloatLabel,
      t: t,
      name: name,
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
