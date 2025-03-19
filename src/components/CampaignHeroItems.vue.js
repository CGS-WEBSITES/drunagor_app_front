import CampaignHeroWeapon from "@/components/CampaignHeroWeapon.vue";
import CampaignHeroOffHand from "@/components/CampaignHeroOffHand.vue";
import CampaignHeroArmor from "@/components/CampaignHeroArmor.vue";
import CampaignHeroTrinket from "@/components/CampaignHeroTrinket.vue";
import CampaignHeroBagItem from "@/components/CampaignHeroBagItem.vue";
import { HeroStore } from "@/store/HeroStore";
import { HeroEquipment } from "@/store/Hero";
import { ref } from "vue";
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
const { t } = useI18n();
const heroStore = HeroStore();
const props = defineProps();
const filterProficiencies = ref(true);
const campaignHero = heroStore.findInCampaign(props.heroId, props.campaignId);
if (typeof campaignHero.equipment === "undefined") {
  campaignHero.equipment = new HeroEquipment();
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
  __VLS_elementAsFunction(
    __VLS_intrinsicElements.div,
    __VLS_intrinsicElements.div,
  )({ ...{ class: "" } });
  __VLS_elementAsFunction(
    __VLS_intrinsicElements.label,
    __VLS_intrinsicElements.label,
  )({});
  __VLS_elementAsFunction(__VLS_intrinsicElements.input)({
    type: "checkbox",
    id: "filter-proficiencies",
    ...{ class: "w-5 h-5 text-emerald-500 bg-base-100 rounded" },
  });
  __VLS_ctx.filterProficiencies;
  __VLS_ctx.t("label.filter-by-proficiency");
  __VLS_elementAsFunction(
    __VLS_intrinsicElements.div,
    __VLS_intrinsicElements.div,
  )({ ...{ class: "pt-4" } });
  __VLS_elementAsFunction(
    __VLS_intrinsicElements.span,
    __VLS_intrinsicElements.span,
  )({});
  __VLS_ctx.t("label.weapon");
  __VLS_elementAsFunction(
    __VLS_intrinsicElements.div,
    __VLS_intrinsicElements.div,
  )({ ...{ class: "hero-weapon-wrapper" } });
  // @ts-ignore
  [CampaignHeroWeapon];
  // @ts-ignore
  const __VLS_0 = __VLS_asFunctionalComponent(
    CampaignHeroWeapon,
    new CampaignHeroWeapon({
      ...{ onStash: {} },
      campaignId: __VLS_ctx.campaignId,
      heroId: __VLS_ctx.heroId,
      heroData: __VLS_ctx.hero,
      cardsDataRepository: __VLS_ctx.repository,
      filterProficiencies: __VLS_ctx.filterProficiencies,
    }),
  );
  const __VLS_1 = __VLS_0(
    {
      ...{ onStash: {} },
      campaignId: __VLS_ctx.campaignId,
      heroId: __VLS_ctx.heroId,
      heroData: __VLS_ctx.hero,
      cardsDataRepository: __VLS_ctx.repository,
      filterProficiencies: __VLS_ctx.filterProficiencies,
    },
    ...__VLS_functionalComponentArgsRest(__VLS_0),
  );
  let __VLS_5;
  const __VLS_6 = {
    onStash: (...[$event]) => {
      __VLS_ctx.$emit("stash");
    },
  };
  let __VLS_2;
  let __VLS_3;
  var __VLS_4;
  __VLS_elementAsFunction(
    __VLS_intrinsicElements.div,
    __VLS_intrinsicElements.div,
  )({ ...{ class: "pt-2 col-auto leading-10" } });
  __VLS_elementAsFunction(
    __VLS_intrinsicElements.span,
    __VLS_intrinsicElements.span,
  )({});
  __VLS_ctx.t("label.off-hand");
  __VLS_elementAsFunction(
    __VLS_intrinsicElements.div,
    __VLS_intrinsicElements.div,
  )({ ...{ class: "hero-offhand-wrapper" } });
  // @ts-ignore
  [CampaignHeroOffHand, CampaignHeroOffHand];
  // @ts-ignore
  const __VLS_7 = __VLS_asFunctionalComponent(
    CampaignHeroOffHand,
    new CampaignHeroOffHand({
      ...{ onStash: {} },
      campaignId: __VLS_ctx.campaignId,
      heroId: __VLS_ctx.heroId,
      heroData: __VLS_ctx.hero,
      cardsDataRepository: __VLS_ctx.repository,
      filterProficiencies: __VLS_ctx.filterProficiencies,
    }),
  );
  const __VLS_8 = __VLS_7(
    {
      ...{ onStash: {} },
      campaignId: __VLS_ctx.campaignId,
      heroId: __VLS_ctx.heroId,
      heroData: __VLS_ctx.hero,
      cardsDataRepository: __VLS_ctx.repository,
      filterProficiencies: __VLS_ctx.filterProficiencies,
    },
    ...__VLS_functionalComponentArgsRest(__VLS_7),
  );
  let __VLS_12;
  const __VLS_13 = {
    onStash: (...[$event]) => {
      __VLS_ctx.$emit("stash");
    },
  };
  let __VLS_9;
  let __VLS_10;
  var __VLS_11;
  __VLS_elementAsFunction(
    __VLS_intrinsicElements.div,
    __VLS_intrinsicElements.div,
  )({ ...{ class: "pt-2" } });
  __VLS_elementAsFunction(
    __VLS_intrinsicElements.span,
    __VLS_intrinsicElements.span,
  )({});
  __VLS_ctx.t("label.armor");
  __VLS_elementAsFunction(
    __VLS_intrinsicElements.div,
    __VLS_intrinsicElements.div,
  )({ ...{ class: "hero-armor-wrapper" } });
  // @ts-ignore
  [CampaignHeroArmor, CampaignHeroArmor];
  // @ts-ignore
  const __VLS_14 = __VLS_asFunctionalComponent(
    CampaignHeroArmor,
    new CampaignHeroArmor({
      ...{ onStash: {} },
      campaignId: __VLS_ctx.campaignId,
      heroId: __VLS_ctx.heroId,
      heroData: __VLS_ctx.hero,
      cardsDataRepository: __VLS_ctx.repository,
      filterProficiencies: __VLS_ctx.filterProficiencies,
    }),
  );
  const __VLS_15 = __VLS_14(
    {
      ...{ onStash: {} },
      campaignId: __VLS_ctx.campaignId,
      heroId: __VLS_ctx.heroId,
      heroData: __VLS_ctx.hero,
      cardsDataRepository: __VLS_ctx.repository,
      filterProficiencies: __VLS_ctx.filterProficiencies,
    },
    ...__VLS_functionalComponentArgsRest(__VLS_14),
  );
  let __VLS_19;
  const __VLS_20 = {
    onStash: (...[$event]) => {
      __VLS_ctx.$emit("stash");
    },
  };
  let __VLS_16;
  let __VLS_17;
  var __VLS_18;
  __VLS_elementAsFunction(
    __VLS_intrinsicElements.div,
    __VLS_intrinsicElements.div,
  )({ ...{ class: "pt-2" } });
  __VLS_elementAsFunction(
    __VLS_intrinsicElements.span,
    __VLS_intrinsicElements.span,
  )({});
  __VLS_ctx.t("label.trinket");
  __VLS_elementAsFunction(
    __VLS_intrinsicElements.div,
    __VLS_intrinsicElements.div,
  )({ ...{ class: "hero-trinket-wrapper" } });
  // @ts-ignore
  [CampaignHeroTrinket, CampaignHeroTrinket];
  // @ts-ignore
  const __VLS_21 = __VLS_asFunctionalComponent(
    CampaignHeroTrinket,
    new CampaignHeroTrinket({
      ...{ onStash: {} },
      campaignId: __VLS_ctx.campaignId,
      heroId: __VLS_ctx.heroId,
      cardsDataRepository: __VLS_ctx.repository,
    }),
  );
  const __VLS_22 = __VLS_21(
    {
      ...{ onStash: {} },
      campaignId: __VLS_ctx.campaignId,
      heroId: __VLS_ctx.heroId,
      cardsDataRepository: __VLS_ctx.repository,
    },
    ...__VLS_functionalComponentArgsRest(__VLS_21),
  );
  let __VLS_26;
  const __VLS_27 = {
    onStash: (...[$event]) => {
      __VLS_ctx.$emit("stash");
    },
  };
  let __VLS_23;
  let __VLS_24;
  var __VLS_25;
  __VLS_elementAsFunction(
    __VLS_intrinsicElements.div,
    __VLS_intrinsicElements.div,
  )({ ...{ class: "mt-8" } });
  __VLS_elementAsFunction(
    __VLS_intrinsicElements.div,
    __VLS_intrinsicElements.div,
  )({ ...{ class: "" } });
  __VLS_elementAsFunction(
    __VLS_intrinsicElements.span,
    __VLS_intrinsicElements.span,
  )({});
  __VLS_ctx.t("label.bag-slot");
  __VLS_elementAsFunction(
    __VLS_intrinsicElements.div,
    __VLS_intrinsicElements.div,
  )({ ...{ class: "hero-bag1-wrapper" } });
  // @ts-ignore
  [CampaignHeroBagItem, CampaignHeroBagItem];
  // @ts-ignore
  const __VLS_28 = __VLS_asFunctionalComponent(
    CampaignHeroBagItem,
    new CampaignHeroBagItem({
      ...{ onStash: {} },
      campaignId: __VLS_ctx.campaignId,
      heroId: __VLS_ctx.heroId,
      cardsDataRepository: __VLS_ctx.repository,
      bagSlot: 1,
    }),
  );
  const __VLS_29 = __VLS_28(
    {
      ...{ onStash: {} },
      campaignId: __VLS_ctx.campaignId,
      heroId: __VLS_ctx.heroId,
      cardsDataRepository: __VLS_ctx.repository,
      bagSlot: 1,
    },
    ...__VLS_functionalComponentArgsRest(__VLS_28),
  );
  let __VLS_33;
  const __VLS_34 = {
    onStash: (...[$event]) => {
      __VLS_ctx.$emit("stash");
    },
  };
  let __VLS_30;
  let __VLS_31;
  var __VLS_32;
  __VLS_elementAsFunction(
    __VLS_intrinsicElements.div,
    __VLS_intrinsicElements.div,
  )({ ...{ class: "pt-2" } });
  __VLS_elementAsFunction(
    __VLS_intrinsicElements.span,
    __VLS_intrinsicElements.span,
  )({});
  __VLS_ctx.t("label.bag-slot");
  __VLS_elementAsFunction(
    __VLS_intrinsicElements.div,
    __VLS_intrinsicElements.div,
  )({ ...{ class: "hero-bag2-wrapper" } });
  // @ts-ignore
  [CampaignHeroBagItem, CampaignHeroBagItem];
  // @ts-ignore
  const __VLS_35 = __VLS_asFunctionalComponent(
    CampaignHeroBagItem,
    new CampaignHeroBagItem({
      ...{ onStash: {} },
      campaignId: __VLS_ctx.campaignId,
      heroId: __VLS_ctx.heroId,
      cardsDataRepository: __VLS_ctx.repository,
      bagSlot: 2,
    }),
  );
  const __VLS_36 = __VLS_35(
    {
      ...{ onStash: {} },
      campaignId: __VLS_ctx.campaignId,
      heroId: __VLS_ctx.heroId,
      cardsDataRepository: __VLS_ctx.repository,
      bagSlot: 2,
    },
    ...__VLS_functionalComponentArgsRest(__VLS_35),
  );
  let __VLS_40;
  const __VLS_41 = {
    onStash: (...[$event]) => {
      __VLS_ctx.$emit("stash");
    },
  };
  let __VLS_37;
  let __VLS_38;
  var __VLS_39;
  __VLS_styleScopedClasses[""];
  __VLS_styleScopedClasses[""];
  __VLS_styleScopedClasses["w-5"];
  __VLS_styleScopedClasses["h-5"];
  __VLS_styleScopedClasses["text-emerald-500"];
  __VLS_styleScopedClasses["bg-base-100"];
  __VLS_styleScopedClasses["rounded"];
  __VLS_styleScopedClasses["pt-4"];
  __VLS_styleScopedClasses["hero-weapon-wrapper"];
  __VLS_styleScopedClasses["pt-2"];
  __VLS_styleScopedClasses["col-auto"];
  __VLS_styleScopedClasses["leading-10"];
  __VLS_styleScopedClasses["hero-offhand-wrapper"];
  __VLS_styleScopedClasses["pt-2"];
  __VLS_styleScopedClasses["hero-armor-wrapper"];
  __VLS_styleScopedClasses["pt-2"];
  __VLS_styleScopedClasses["hero-trinket-wrapper"];
  __VLS_styleScopedClasses["mt-8"];
  __VLS_styleScopedClasses["hero-bag1-wrapper"];
  __VLS_styleScopedClasses["pt-2"];
  __VLS_styleScopedClasses["hero-bag2-wrapper"];
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
      CampaignHeroWeapon: CampaignHeroWeapon,
      CampaignHeroOffHand: CampaignHeroOffHand,
      CampaignHeroArmor: CampaignHeroArmor,
      CampaignHeroTrinket: CampaignHeroTrinket,
      CampaignHeroBagItem: CampaignHeroBagItem,
      t: t,
      filterProficiencies: filterProficiencies,
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
