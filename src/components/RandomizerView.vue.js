import { VariantStore } from "@/store/VariantStore";
import { RandomizeMonster } from "@/service/RandomizeMonster";
import { RandomizeCommander } from "@/service/RandomizeCommander";
import { ref } from "vue";
import { useToast } from "primevue/usetoast";
import { useI18n } from "vue-i18n";
import SwappableImage from "@/components/SwappableImage.vue";
import RandomizerTitle from "@/assets/Randomizer.webp";
import backgroundImage from "@/assets/monster/big/Background.webp";
import RandomizerQuickSelect from "@/components/RandomizerQuickSelect.vue";
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
const { t } = useI18n();
const name = ref(t("randomizer.random-monster"));
const variant = ref("");
const currentCharacterId = ref("");
const frontImage = ref(RandomizerTitle.toString());
const backImage = ref("");
const excludeCurrentCharacter = ref(true);
const variantStore = VariantStore();
function getExcludedCharacters() {
  let excludedCharacters = [];
  if (excludeCurrentCharacter.value) {
    excludedCharacters = [currentCharacterId.value];
  }
  return excludedCharacters;
}
function getRandomMonster(color) {
  let monster = new RandomizeMonster().randomizeByColor(
    color,
    getExcludedCharacters(),
  );
  if (monster === null) {
    toast.add({
      severity: "error",
      summary: "Error",
      detail: t("randomizer.error.no-other-monster-available"),
      life: 3000,
    });
    return;
  }
  currentCharacterId.value = monster.id;
  name.value = t(monster.translation_key);
  variant.value = t(
    variantStore.find(monster.getRandomVariant()).translation_key,
  );
  frontImage.value = monster.image.main;
  backImage.value = monster.image.miniature;
}
function getRandomCommander() {
  let commander = new RandomizeCommander().randomize(getExcludedCharacters());
  if (commander === null) {
    toast.add({
      severity: "error",
      summary: "Error",
      detail: t("randomizer.error.no-other-commander-available"),
      life: 3000,
    });
    return;
  }
  currentCharacterId.value = commander.id;
  name.value = t(commander.translation_key);
  variant.value = t("randomizer.commander");
  if (commander.id === "demon-lord" || commander.id === "fallen-sisters") {
    variant.value = t("randomizer.overlord");
  }
  frontImage.value = commander.image.main;
  backImage.value = commander.image.miniature;
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
  const __VLS_0 = __VLS_resolvedLocalAndGlobalComponents.VRow;
  /** @type { [typeof __VLS_components.VRow, typeof __VLS_components.vRow, typeof __VLS_components.VRow, typeof __VLS_components.vRow, ] } */
  // @ts-ignore
  const __VLS_1 = __VLS_asFunctionalComponent(
    __VLS_0,
    new __VLS_0({ noGutters: true, ...{ class: "justify-center" } }),
  );
  const __VLS_2 = __VLS_1(
    { noGutters: true, ...{ class: "justify-center" } },
    ...__VLS_functionalComponentArgsRest(__VLS_1),
  );
  var __VLS_6 = {};
  const __VLS_7 = __VLS_resolvedLocalAndGlobalComponents.VCol;
  /** @type { [typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ] } */
  // @ts-ignore
  const __VLS_8 = __VLS_asFunctionalComponent(
    __VLS_7,
    new __VLS_7({ cols: "12", ...{ class: "pa-4" } }),
  );
  const __VLS_9 = __VLS_8(
    { cols: "12", ...{ class: "pa-4" } },
    ...__VLS_functionalComponentArgsRest(__VLS_8),
  );
  // @ts-ignore
  [RandomizerQuickSelect];
  // @ts-ignore
  const __VLS_13 = __VLS_asFunctionalComponent(
    RandomizerQuickSelect,
    new RandomizerQuickSelect({}),
  );
  const __VLS_14 = __VLS_13({}, ...__VLS_functionalComponentArgsRest(__VLS_13));
  __VLS_nonNullable(__VLS_12.slots).default;
  var __VLS_12;
  const __VLS_18 = __VLS_resolvedLocalAndGlobalComponents.VCol;
  /** @type { [typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ] } */
  // @ts-ignore
  const __VLS_19 = __VLS_asFunctionalComponent(
    __VLS_18,
    new __VLS_18({ cols: "12", ...{ class: "pa-4" } }),
  );
  const __VLS_20 = __VLS_19(
    { cols: "12", ...{ class: "pa-4" } },
    ...__VLS_functionalComponentArgsRest(__VLS_19),
  );
  // @ts-ignore
  [SwappableImage];
  // @ts-ignore
  const __VLS_24 = __VLS_asFunctionalComponent(
    SwappableImage,
    new SwappableImage({
      title: __VLS_ctx.name,
      subTitle: __VLS_ctx.variant,
      background: __VLS_ctx.backgroundImage,
      frontImage: __VLS_ctx.frontImage,
      backImage: __VLS_ctx.backImage,
    }),
  );
  const __VLS_25 = __VLS_24(
    {
      title: __VLS_ctx.name,
      subTitle: __VLS_ctx.variant,
      background: __VLS_ctx.backgroundImage,
      frontImage: __VLS_ctx.frontImage,
      backImage: __VLS_ctx.backImage,
    },
    ...__VLS_functionalComponentArgsRest(__VLS_24),
  );
  __VLS_nonNullable(__VLS_23.slots).default;
  var __VLS_23;
  const __VLS_29 = __VLS_resolvedLocalAndGlobalComponents.VCol;
  /** @type { [typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ] } */
  // @ts-ignore
  const __VLS_30 = __VLS_asFunctionalComponent(
    __VLS_29,
    new __VLS_29({ cols: "12", ...{ class: "d-flex justify-center pa-4" } }),
  );
  const __VLS_31 = __VLS_30(
    { cols: "12", ...{ class: "d-flex justify-center pa-4" } },
    ...__VLS_functionalComponentArgsRest(__VLS_30),
  );
  const __VLS_35 = __VLS_resolvedLocalAndGlobalComponents.VCheckbox;
  /** @type { [typeof __VLS_components.VCheckbox, typeof __VLS_components.vCheckbox, typeof __VLS_components.VCheckbox, typeof __VLS_components.vCheckbox, ] } */
  // @ts-ignore
  const __VLS_36 = __VLS_asFunctionalComponent(
    __VLS_35,
    new __VLS_35({
      label: __VLS_ctx.$t("randomizer.exclude-current-monster"),
      modelValue: __VLS_ctx.excludeCurrentCharacter,
    }),
  );
  const __VLS_37 = __VLS_36(
    {
      label: __VLS_ctx.$t("randomizer.exclude-current-monster"),
      modelValue: __VLS_ctx.excludeCurrentCharacter,
    },
    ...__VLS_functionalComponentArgsRest(__VLS_36),
  );
  __VLS_nonNullable(__VLS_34.slots).default;
  var __VLS_34;
  const __VLS_41 = __VLS_resolvedLocalAndGlobalComponents.VCol;
  /** @type { [typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ] } */
  // @ts-ignore
  const __VLS_42 = __VLS_asFunctionalComponent(
    __VLS_41,
    new __VLS_41({ cols: "12", ...{ class: "pa-4" } }),
  );
  const __VLS_43 = __VLS_42(
    { cols: "12", ...{ class: "pa-4" } },
    ...__VLS_functionalComponentArgsRest(__VLS_42),
  );
  const __VLS_47 = __VLS_resolvedLocalAndGlobalComponents.VCard;
  /** @type { [typeof __VLS_components.VCard, typeof __VLS_components.vCard, typeof __VLS_components.VCard, typeof __VLS_components.vCard, ] } */
  // @ts-ignore
  const __VLS_48 = __VLS_asFunctionalComponent(
    __VLS_47,
    new __VLS_47({ ...{ class: "d-flex justify-center pa-4" } }),
  );
  const __VLS_49 = __VLS_48(
    { ...{ class: "d-flex justify-center pa-4" } },
    ...__VLS_functionalComponentArgsRest(__VLS_48),
  );
  const __VLS_53 = __VLS_resolvedLocalAndGlobalComponents.VBtn;
  /** @type { [typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ] } */
  // @ts-ignore
  const __VLS_54 = __VLS_asFunctionalComponent(
    __VLS_53,
    new __VLS_53({
      ...{ onClick: {} },
      ...{ class: "mx-2" },
      variant: "outlined",
    }),
  );
  const __VLS_55 = __VLS_54(
    { ...{ onClick: {} }, ...{ class: "mx-2" }, variant: "outlined" },
    ...__VLS_functionalComponentArgsRest(__VLS_54),
  );
  let __VLS_59;
  const __VLS_60 = {
    onClick: (...[$event]) => {
      __VLS_ctx.getRandomMonster("white");
    },
  };
  let __VLS_56;
  let __VLS_57;
  __VLS_ctx.$t("randomizer.white");
  __VLS_nonNullable(__VLS_58.slots).default;
  var __VLS_58;
  const __VLS_61 = __VLS_resolvedLocalAndGlobalComponents.VBtn;
  /** @type { [typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ] } */
  // @ts-ignore
  const __VLS_62 = __VLS_asFunctionalComponent(
    __VLS_61,
    new __VLS_61({
      ...{ onClick: {} },
      ...{ class: "mx-2" },
      variant: "outlined",
    }),
  );
  const __VLS_63 = __VLS_62(
    { ...{ onClick: {} }, ...{ class: "mx-2" }, variant: "outlined" },
    ...__VLS_functionalComponentArgsRest(__VLS_62),
  );
  let __VLS_67;
  const __VLS_68 = {
    onClick: (...[$event]) => {
      __VLS_ctx.getRandomMonster("gray");
    },
  };
  let __VLS_64;
  let __VLS_65;
  __VLS_ctx.$t("randomizer.gray");
  __VLS_nonNullable(__VLS_66.slots).default;
  var __VLS_66;
  const __VLS_69 = __VLS_resolvedLocalAndGlobalComponents.VBtn;
  /** @type { [typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ] } */
  // @ts-ignore
  const __VLS_70 = __VLS_asFunctionalComponent(
    __VLS_69,
    new __VLS_69({
      ...{ onClick: {} },
      ...{ class: "mx-2" },
      variant: "outlined",
    }),
  );
  const __VLS_71 = __VLS_70(
    { ...{ onClick: {} }, ...{ class: "mx-2" }, variant: "outlined" },
    ...__VLS_functionalComponentArgsRest(__VLS_70),
  );
  let __VLS_75;
  const __VLS_76 = {
    onClick: (...[$event]) => {
      __VLS_ctx.getRandomMonster("black");
    },
  };
  let __VLS_72;
  let __VLS_73;
  __VLS_ctx.$t("randomizer.black");
  __VLS_nonNullable(__VLS_74.slots).default;
  var __VLS_74;
  const __VLS_77 = __VLS_resolvedLocalAndGlobalComponents.VBtn;
  /** @type { [typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ] } */
  // @ts-ignore
  const __VLS_78 = __VLS_asFunctionalComponent(
    __VLS_77,
    new __VLS_77({
      ...{ onClick: {} },
      ...{ class: "mx-2" },
      variant: "outlined",
    }),
  );
  const __VLS_79 = __VLS_78(
    { ...{ onClick: {} }, ...{ class: "mx-2" }, variant: "outlined" },
    ...__VLS_functionalComponentArgsRest(__VLS_78),
  );
  let __VLS_83;
  const __VLS_84 = {
    onClick: (...[$event]) => {
      __VLS_ctx.getRandomCommander();
    },
  };
  let __VLS_80;
  let __VLS_81;
  __VLS_ctx.$t("randomizer.commander");
  __VLS_nonNullable(__VLS_82.slots).default;
  var __VLS_82;
  __VLS_nonNullable(__VLS_52.slots).default;
  var __VLS_52;
  __VLS_nonNullable(__VLS_46.slots).default;
  var __VLS_46;
  __VLS_nonNullable(__VLS_5.slots).default;
  var __VLS_5;
  __VLS_styleScopedClasses["justify-center"];
  __VLS_styleScopedClasses["pa-4"];
  __VLS_styleScopedClasses["pa-4"];
  __VLS_styleScopedClasses["d-flex"];
  __VLS_styleScopedClasses["justify-center"];
  __VLS_styleScopedClasses["pa-4"];
  __VLS_styleScopedClasses["pa-4"];
  __VLS_styleScopedClasses["d-flex"];
  __VLS_styleScopedClasses["justify-center"];
  __VLS_styleScopedClasses["pa-4"];
  __VLS_styleScopedClasses["mx-2"];
  __VLS_styleScopedClasses["mx-2"];
  __VLS_styleScopedClasses["mx-2"];
  __VLS_styleScopedClasses["mx-2"];
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
      SwappableImage: SwappableImage,
      backgroundImage: backgroundImage,
      RandomizerQuickSelect: RandomizerQuickSelect,
      name: name,
      variant: variant,
      frontImage: frontImage,
      backImage: backImage,
      excludeCurrentCharacter: excludeCurrentCharacter,
      getRandomMonster: getRandomMonster,
      getRandomCommander: getRandomCommander,
    };
  },
});
export default (await import("vue")).defineComponent({
  setup() {
    return {};
  },
  __typeEl: {},
}); /* PartiallyEnd: #4569/main.vue */
