import { HeroDataRepository } from "@/data/repository/HeroDataRepository";
import { useRoute } from "vue-router";
import CampaignHeroItems from "@/components/CampaignHeroItems.vue";
import CampaignHeroStash from "@/components/CampaignHeroStash.vue";
import CampaignHeroSkills from "@/components/CampaignHeroSkills.vue";
import { ref } from "vue";
import { CampaignStore } from "@/store/CampaignStore";
import { CoreItemDataRepository } from "@/data/repository/campaign/core/CoreItemDataRepository";
import { ApocalypseItemDataRepository } from "@/data/repository/campaign/apocalypse/ApocalypseItemDataRepository";
import { AwakeningsItemDataRepository } from "@/data/repository/campaign/awakenings/AwakeningsItemDataRepository";
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
const route = useRoute();
const heroDataRepository = new HeroDataRepository();
const { t } = useI18n();
const heroId = route.params.heroId.toString();
const campaignId = route.params.campaignId.toString();
const campaignStore = CampaignStore();
const campaign = campaignStore.find(campaignId);
let repository;
if (campaign.campaign === "core") {
  repository = new CoreItemDataRepository();
} else if (campaign.campaign === "apocalypse") {
  repository = new ApocalypseItemDataRepository();
} else if (campaign.campaign === "awakenings") {
  repository = new AwakeningsItemDataRepository();
} else {
  throw new Error("Unknown campaign");
}
const hero = heroDataRepository.find(heroId) ?? {};
let stash = ref(0);
function onStash() {
  stash.value += 1;
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
  )({});
  const __VLS_0 = __VLS_resolvedLocalAndGlobalComponents.Button;
  /** @type { [typeof __VLS_components.Button, typeof __VLS_components.Button, ] } */
  // @ts-ignore
  const __VLS_1 = __VLS_asFunctionalComponent(
    __VLS_0,
    new __VLS_0({
      ...{ onClick: {} },
      outlined: true,
      id: "campaign-export",
      label: __VLS_ctx.t("label.back"),
    }),
  );
  const __VLS_2 = __VLS_1(
    {
      ...{ onClick: {} },
      outlined: true,
      id: "campaign-export",
      label: __VLS_ctx.t("label.back"),
    },
    ...__VLS_functionalComponentArgsRest(__VLS_1),
  );
  let __VLS_6;
  const __VLS_7 = {
    onClick: (...[$event]) => {
      __VLS_ctx.$router.go(-1);
    },
  };
  let __VLS_3;
  let __VLS_4;
  var __VLS_5;
  __VLS_elementAsFunction(
    __VLS_intrinsicElements.div,
    __VLS_intrinsicElements.div,
  )({
    id: "hero-card",
    ...{ class: "bg-neutral form-control drop-shadow rounded-lg p-4 mt-4" },
    ...{ style: {} },
  });
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
  const __VLS_8 = __VLS_resolvedLocalAndGlobalComponents.Divider;
  /** @type { [typeof __VLS_components.Divider, typeof __VLS_components.Divider, ] } */
  // @ts-ignore
  const __VLS_9 = __VLS_asFunctionalComponent(__VLS_8, new __VLS_8({}));
  const __VLS_10 = __VLS_9({}, ...__VLS_functionalComponentArgsRest(__VLS_9));
  __VLS_ctx.t("label.equipment");
  __VLS_nonNullable(__VLS_13.slots).default;
  var __VLS_13;
  __VLS_elementAsFunction(
    __VLS_intrinsicElements.div,
    __VLS_intrinsicElements.div,
  )({ ...{ class: "py-2 w-full" } });
  // @ts-ignore
  [CampaignHeroItems];
  // @ts-ignore
  const __VLS_14 = __VLS_asFunctionalComponent(
    CampaignHeroItems,
    new CampaignHeroItems({
      ...{ onStash: {} },
      campaignId: __VLS_ctx.campaignId,
      heroId: __VLS_ctx.heroId,
      repository: __VLS_ctx.repository,
      hero: __VLS_ctx.hero,
    }),
  );
  const __VLS_15 = __VLS_14(
    {
      ...{ onStash: {} },
      campaignId: __VLS_ctx.campaignId,
      heroId: __VLS_ctx.heroId,
      repository: __VLS_ctx.repository,
      hero: __VLS_ctx.hero,
    },
    ...__VLS_functionalComponentArgsRest(__VLS_14),
  );
  let __VLS_19;
  const __VLS_20 = {
    onStash: __VLS_ctx.onStash,
  };
  let __VLS_16;
  let __VLS_17;
  var __VLS_18;
  const __VLS_21 = __VLS_resolvedLocalAndGlobalComponents.Divider;
  /** @type { [typeof __VLS_components.Divider, typeof __VLS_components.Divider, ] } */
  // @ts-ignore
  const __VLS_22 = __VLS_asFunctionalComponent(__VLS_21, new __VLS_21({}));
  const __VLS_23 = __VLS_22({}, ...__VLS_functionalComponentArgsRest(__VLS_22));
  __VLS_ctx.t("label.stash");
  __VLS_nonNullable(__VLS_26.slots).default;
  var __VLS_26;
  __VLS_elementAsFunction(
    __VLS_intrinsicElements.div,
    __VLS_intrinsicElements.div,
  )({ ...{ class: "hero-stash-wrapper py-2 w-full" } });
  // @ts-ignore
  [CampaignHeroStash];
  // @ts-ignore
  const __VLS_27 = __VLS_asFunctionalComponent(
    CampaignHeroStash,
    new CampaignHeroStash({
      campaignId: __VLS_ctx.campaignId,
      repository: __VLS_ctx.repository,
      heroId: __VLS_ctx.heroId,
      key: __VLS_ctx.stash,
    }),
  );
  const __VLS_28 = __VLS_27(
    {
      campaignId: __VLS_ctx.campaignId,
      repository: __VLS_ctx.repository,
      heroId: __VLS_ctx.heroId,
      key: __VLS_ctx.stash,
    },
    ...__VLS_functionalComponentArgsRest(__VLS_27),
  );
  const __VLS_32 = __VLS_resolvedLocalAndGlobalComponents.Divider;
  /** @type { [typeof __VLS_components.Divider, typeof __VLS_components.Divider, ] } */
  // @ts-ignore
  const __VLS_33 = __VLS_asFunctionalComponent(__VLS_32, new __VLS_32({}));
  const __VLS_34 = __VLS_33({}, ...__VLS_functionalComponentArgsRest(__VLS_33));
  __VLS_ctx.t("label.skills");
  __VLS_nonNullable(__VLS_37.slots).default;
  var __VLS_37;
  __VLS_elementAsFunction(
    __VLS_intrinsicElements.div,
    __VLS_intrinsicElements.div,
  )({ ...{ class: "py-2 w-full" } });
  // @ts-ignore
  [CampaignHeroSkills, CampaignHeroSkills];
  // @ts-ignore
  const __VLS_38 = __VLS_asFunctionalComponent(
    CampaignHeroSkills,
    new CampaignHeroSkills({
      campaignId: __VLS_ctx.campaignId,
      heroId: __VLS_ctx.heroId,
    }),
  );
  const __VLS_39 = __VLS_38(
    { campaignId: __VLS_ctx.campaignId, heroId: __VLS_ctx.heroId },
    ...__VLS_functionalComponentArgsRest(__VLS_38),
  );
  __VLS_styleScopedClasses["bg-neutral"];
  __VLS_styleScopedClasses["form-control"];
  __VLS_styleScopedClasses["drop-shadow"];
  __VLS_styleScopedClasses["rounded-lg"];
  __VLS_styleScopedClasses["p-4"];
  __VLS_styleScopedClasses["mt-4"];
  __VLS_styleScopedClasses["flex"];
  __VLS_styleScopedClasses["h-28"];
  __VLS_styleScopedClasses["-ml-1"];
  __VLS_styleScopedClasses["w-14"];
  __VLS_styleScopedClasses["rounded-full"];
  __VLS_styleScopedClasses["hero-image"];
  __VLS_styleScopedClasses["pl-8"];
  __VLS_styleScopedClasses["py-2"];
  __VLS_styleScopedClasses["w-full"];
  __VLS_styleScopedClasses["hero-stash-wrapper"];
  __VLS_styleScopedClasses["py-2"];
  __VLS_styleScopedClasses["w-full"];
  __VLS_styleScopedClasses["py-2"];
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
      CampaignHeroItems: CampaignHeroItems,
      CampaignHeroStash: CampaignHeroStash,
      CampaignHeroSkills: CampaignHeroSkills,
      t: t,
      heroId: heroId,
      campaignId: campaignId,
      repository: repository,
      hero: hero,
      stash: stash,
      onStash: onStash,
    };
  },
});
export default (await import("vue")).defineComponent({
  setup() {
    return {};
  },
}); /* PartiallyEnd: #4569/main.vue */
