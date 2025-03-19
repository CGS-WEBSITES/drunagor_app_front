import { ref, toRef, watch } from "vue";
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
const currentImage = ref("");
const frontImage = toRef(props, "frontImage");
currentImage.value = frontImage.value;
watch(frontImage, async (newImage) => {
  currentImage.value = newImage;
});
function swapImage() {
  if (props.backImage == undefined) {
    return;
  }
  if (currentImage.value === props.frontImage) {
    currentImage.value = props.backImage;
  } else {
    currentImage.value = props.frontImage;
  }
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
  const __VLS_0 = __VLS_resolvedLocalAndGlobalComponents.VCard;
  /** @type { [typeof __VLS_components.VCard, typeof __VLS_components.vCard, typeof __VLS_components.VCard, typeof __VLS_components.vCard, ] } */
  // @ts-ignore
  const __VLS_1 = __VLS_asFunctionalComponent(
    __VLS_0,
    new __VLS_0({
      ...{ class: "d-flex flex-column justify-center align-center" },
    }),
  );
  const __VLS_2 = __VLS_1(
    { ...{ class: "d-flex flex-column justify-center align-center" } },
    ...__VLS_functionalComponentArgsRest(__VLS_1),
  );
  var __VLS_6 = {};
  const __VLS_7 = __VLS_resolvedLocalAndGlobalComponents.VCardItem;
  /** @type { [typeof __VLS_components.VCardItem, typeof __VLS_components.vCardItem, typeof __VLS_components.VCardItem, typeof __VLS_components.vCardItem, ] } */
  // @ts-ignore
  const __VLS_8 = __VLS_asFunctionalComponent(__VLS_7, new __VLS_7({}));
  const __VLS_9 = __VLS_8({}, ...__VLS_functionalComponentArgsRest(__VLS_8));
  const __VLS_13 = __VLS_resolvedLocalAndGlobalComponents.VCardTitle;
  /** @type { [typeof __VLS_components.VCardTitle, typeof __VLS_components.vCardTitle, typeof __VLS_components.VCardTitle, typeof __VLS_components.vCardTitle, ] } */
  // @ts-ignore
  const __VLS_14 = __VLS_asFunctionalComponent(__VLS_13, new __VLS_13({}));
  const __VLS_15 = __VLS_14({}, ...__VLS_functionalComponentArgsRest(__VLS_14));
  props.title;
  __VLS_nonNullable(__VLS_18.slots).default;
  var __VLS_18;
  const __VLS_19 = __VLS_resolvedLocalAndGlobalComponents.VCardSubtitle;
  /** @type { [typeof __VLS_components.VCardSubtitle, typeof __VLS_components.vCardSubtitle, typeof __VLS_components.VCardSubtitle, typeof __VLS_components.vCardSubtitle, ] } */
  // @ts-ignore
  const __VLS_20 = __VLS_asFunctionalComponent(__VLS_19, new __VLS_19({}));
  const __VLS_21 = __VLS_20({}, ...__VLS_functionalComponentArgsRest(__VLS_20));
  props.subTitle;
  __VLS_nonNullable(__VLS_24.slots).default;
  var __VLS_24;
  __VLS_nonNullable(__VLS_12.slots).default;
  var __VLS_12;
  const __VLS_25 = __VLS_resolvedLocalAndGlobalComponents.VCardText;
  /** @type { [typeof __VLS_components.VCardText, typeof __VLS_components.vCardText, typeof __VLS_components.VCardText, typeof __VLS_components.vCardText, ] } */
  // @ts-ignore
  const __VLS_26 = __VLS_asFunctionalComponent(__VLS_25, new __VLS_25({}));
  const __VLS_27 = __VLS_26({}, ...__VLS_functionalComponentArgsRest(__VLS_26));
  const __VLS_31 = __VLS_resolvedLocalAndGlobalComponents.VImg;
  /** @type { [typeof __VLS_components.VImg, typeof __VLS_components.vImg, typeof __VLS_components.VImg, typeof __VLS_components.vImg, ] } */
  // @ts-ignore
  const __VLS_32 = __VLS_asFunctionalComponent(
    __VLS_31,
    new __VLS_31({
      rounded: true,
      src: __VLS_ctx.currentImage,
      ...{ class: "bg-black" },
      width: "378",
    }),
  );
  const __VLS_33 = __VLS_32(
    {
      rounded: true,
      src: __VLS_ctx.currentImage,
      ...{ class: "bg-black" },
      width: "378",
    },
    ...__VLS_functionalComponentArgsRest(__VLS_32),
  );
  __VLS_nonNullable(__VLS_30.slots).default;
  var __VLS_30;
  const __VLS_37 = __VLS_resolvedLocalAndGlobalComponents.VCardActions;
  /** @type { [typeof __VLS_components.VCardActions, typeof __VLS_components.vCardActions, typeof __VLS_components.VCardActions, typeof __VLS_components.vCardActions, ] } */
  // @ts-ignore
  const __VLS_38 = __VLS_asFunctionalComponent(__VLS_37, new __VLS_37({}));
  const __VLS_39 = __VLS_38({}, ...__VLS_functionalComponentArgsRest(__VLS_38));
  if (__VLS_ctx.backImage) {
    const __VLS_43 = __VLS_resolvedLocalAndGlobalComponents.VBtn;
    /** @type { [typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ] } */
    // @ts-ignore
    const __VLS_44 = __VLS_asFunctionalComponent(
      __VLS_43,
      new __VLS_43({ ...{ onClick: {} }, icon: true }),
    );
    const __VLS_45 = __VLS_44(
      { ...{ onClick: {} }, icon: true },
      ...__VLS_functionalComponentArgsRest(__VLS_44),
    );
    let __VLS_49;
    const __VLS_50 = {
      onClick: (...[$event]) => {
        if (!__VLS_ctx.backImage) return;
        __VLS_ctx.swapImage();
      },
    };
    let __VLS_46;
    let __VLS_47;
    const __VLS_51 = __VLS_resolvedLocalAndGlobalComponents.VIcon;
    /** @type { [typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, ] } */
    // @ts-ignore
    const __VLS_52 = __VLS_asFunctionalComponent(__VLS_51, new __VLS_51({}));
    const __VLS_53 = __VLS_52(
      {},
      ...__VLS_functionalComponentArgsRest(__VLS_52),
    );
    __VLS_nonNullable(__VLS_56.slots).default;
    var __VLS_56;
    __VLS_nonNullable(__VLS_48.slots).default;
    var __VLS_48;
  }
  __VLS_nonNullable(__VLS_42.slots).default;
  var __VLS_42;
  __VLS_nonNullable(__VLS_5.slots).default;
  var __VLS_5;
  __VLS_styleScopedClasses["d-flex"];
  __VLS_styleScopedClasses["flex-column"];
  __VLS_styleScopedClasses["justify-center"];
  __VLS_styleScopedClasses["align-center"];
  __VLS_styleScopedClasses["bg-black"];
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
      currentImage: currentImage,
      swapImage: swapImage,
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
