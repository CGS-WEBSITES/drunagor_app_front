import { HeroDataRepository } from "@/data/repository/HeroDataRepository";
import { CampaignStore } from "@/store/CampaignStore";
import CampaignLogCore from "./CampaignLogCore.vue";
import CampaignLogAwakenings from "./CampaignLogAwakenings.vue";
import CampaignLogApocalypse from "./CampaignLogApocalypse.vue";
import CampaignLogSequentialAdventure from "@/components/CampaignLogSequentialAdventure.vue";
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
const props = defineProps();
const heroDataRepository = new HeroDataRepository();
const campaignStore = CampaignStore();
const { t } = useI18n();
const campaign = campaignStore.find(props.campaignId);
const hero =
  heroDataRepository.find(props.heroId) ??
  {}; /* PartiallyEnd: #3632/scriptSetup.vue */
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
  )({ ...{ class: "hero-list-item p-4" }, ...{ style: {} } });
  __VLS_elementAsFunction(
    __VLS_intrinsicElements.div,
    __VLS_intrinsicElements.div,
  )({ ...{ class: "flex h-28" } });
  __VLS_elementAsFunction(
    __VLS_intrinsicElements.div,
    __VLS_intrinsicElements.div,
  )({});
  __VLS_elementAsFunction(__VLS_intrinsicElements.img)({
    ...{ class: "-ml-1 w-14 rounded-full hero-image" },
    src: __VLS_ctx.hero.images.avatar,
  });
  __VLS_elementAsFunction(
    __VLS_intrinsicElements.div,
    __VLS_intrinsicElements.div,
  )({ ...{ class: "pl-8" } });
  __VLS_elementAsFunction(
    __VLS_intrinsicElements.p,
    __VLS_intrinsicElements.p,
  )({});
  __VLS_ctx.hero.name;
  __VLS_elementAsFunction(
    __VLS_intrinsicElements.p,
    __VLS_intrinsicElements.p,
  )({});
  __VLS_ctx.t("label." + __VLS_ctx.hero.race.toLowerCase());
  __VLS_ctx.t("label." + __VLS_ctx.hero.class.toLowerCase().replace(" ", "-"));
  __VLS_elementAsFunction(
    __VLS_intrinsicElements.p,
    __VLS_intrinsicElements.p,
  )({});
  __VLS_ctx.t("text.path-of");
  __VLS_ctx.t("label." + __VLS_ctx.hero.path.toLowerCase());
  if (__VLS_ctx.isSequentialAdventure) {
    // @ts-ignore
    [CampaignLogSequentialAdventure];
    // @ts-ignore
    const __VLS_0 = __VLS_asFunctionalComponent(
      CampaignLogSequentialAdventure,
      new CampaignLogSequentialAdventure({
        hero: __VLS_ctx.hero,
        campaignId: __VLS_ctx.campaignId,
      }),
    );
    const __VLS_1 = __VLS_0(
      { hero: __VLS_ctx.hero, campaignId: __VLS_ctx.campaignId },
      ...__VLS_functionalComponentArgsRest(__VLS_0),
    );
  }
  if (__VLS_ctx.campaign.campaign == "core") {
    // @ts-ignore
    [CampaignLogCore];
    // @ts-ignore
    const __VLS_5 = __VLS_asFunctionalComponent(
      CampaignLogCore,
      new CampaignLogCore({
        campaignId: props.campaignId,
        heroId: props.heroId,
      }),
    );
    const __VLS_6 = __VLS_5(
      { campaignId: props.campaignId, heroId: props.heroId },
      ...__VLS_functionalComponentArgsRest(__VLS_5),
    );
  }
  if (__VLS_ctx.campaign.campaign == "awakenings") {
    // @ts-ignore
    [CampaignLogAwakenings];
    // @ts-ignore
    const __VLS_10 = __VLS_asFunctionalComponent(
      CampaignLogAwakenings,
      new CampaignLogAwakenings({
        campaignId: props.campaignId,
        heroId: props.heroId,
      }),
    );
    const __VLS_11 = __VLS_10(
      { campaignId: props.campaignId, heroId: props.heroId },
      ...__VLS_functionalComponentArgsRest(__VLS_10),
    );
  }
  if (__VLS_ctx.campaign.campaign == "apocalypse") {
    // @ts-ignore
    [CampaignLogApocalypse];
    // @ts-ignore
    const __VLS_15 = __VLS_asFunctionalComponent(
      CampaignLogApocalypse,
      new CampaignLogApocalypse({
        campaignId: props.campaignId,
        heroId: props.heroId,
      }),
    );
    const __VLS_16 = __VLS_15(
      { campaignId: props.campaignId, heroId: props.heroId },
      ...__VLS_functionalComponentArgsRest(__VLS_15),
    );
  }
  __VLS_styleScopedClasses["hero-list-item"];
  __VLS_styleScopedClasses["p-4"];
  __VLS_styleScopedClasses["flex"];
  __VLS_styleScopedClasses["h-28"];
  __VLS_styleScopedClasses["-ml-1"];
  __VLS_styleScopedClasses["w-14"];
  __VLS_styleScopedClasses["rounded-full"];
  __VLS_styleScopedClasses["hero-image"];
  __VLS_styleScopedClasses["pl-8"];
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
      CampaignLogCore: CampaignLogCore,
      CampaignLogAwakenings: CampaignLogAwakenings,
      CampaignLogApocalypse: CampaignLogApocalypse,
      CampaignLogSequentialAdventure: CampaignLogSequentialAdventure,
      t: t,
      campaign: campaign,
      hero: hero,
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
