import { ref, computed } from "vue";
import BaseList from "@/components/BaseList.vue";
import BaseListItem from "@/components/BaseListItem.vue";
import { EnabledHeroes } from "@/repository/EnabledHeroes";
import { RandomizeHero } from "@/service/RandomizeHero";
import { useToast } from "primevue/usetoast";
import RandomImage from "@/assets/hero/avatar/RandomAvatar.webp";
import * as _ from "lodash-es";
import { HeroStore } from "@/store/HeroStore";
import { Hero } from "@/store/Hero";
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
const toast = useToast();
const { t } = useI18n();
const visible = ref(false);
function openModal() {
  visible.value = true;
}
function closeModal() {
  visible.value = false;
}
const heroStore = HeroStore();
const heroes = new EnabledHeroes().findAll();
let filteredHeroes = computed(() => heroes.filter(filterHero));
function filterHero(hero) {
  if (heroStore.hasInCampaign(hero.id, props.campaignId)) {
    return false;
  }
  return true;
}
function addHeroToCampaign(heroId) {
  heroStore.add(new Hero(heroId, props.campaignId));
  closeModal();
}
function addRandomHeroToCampaign() {
  const randomHero = new RandomizeHero().randomize(
    _.map(heroStore.findAllInCampaign(props.campaignId), "heroId"),
  );
  if (randomHero === null) {
    toast.add({
      severity: "error",
      summary: "Error",
      detail: "No random hero available.",
      life: 3000,
    });
    return;
  }
  heroStore.add(new Hero(randomHero.id, props.campaignId));
  closeModal();
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
      id: "campaign-add-hero",
      label: __VLS_ctx.t("label.add-hero"),
    }),
  );
  const __VLS_2 = __VLS_1(
    {
      ...{ onClick: {} },
      outlined: true,
      id: "campaign-add-hero",
      label: __VLS_ctx.t("label.add-hero"),
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
      header: __VLS_ctx.t("label.add-hero"),
      dismissableMask: true,
      ...{ class: "w-full md:w-1/3 m-2" },
    }),
  );
  const __VLS_10 = __VLS_9(
    {
      visible: __VLS_ctx.visible,
      modal: true,
      header: __VLS_ctx.t("label.add-hero"),
      dismissableMask: true,
      ...{ class: "w-full md:w-1/3 m-2" },
    },
    ...__VLS_functionalComponentArgsRest(__VLS_9),
  );
  // @ts-ignore
  [BaseListItem, BaseListItem];
  // @ts-ignore
  const __VLS_14 = __VLS_asFunctionalComponent(
    BaseListItem,
    new BaseListItem({
      ...{ onClick: {} },
      id: "party-random-hero",
      avatar: __VLS_ctx.RandomImage.toString(),
    }),
  );
  const __VLS_15 = __VLS_14(
    {
      ...{ onClick: {} },
      id: "party-random-hero",
      avatar: __VLS_ctx.RandomImage.toString(),
    },
    ...__VLS_functionalComponentArgsRest(__VLS_14),
  );
  let __VLS_19;
  const __VLS_20 = {
    onClick: __VLS_ctx.addRandomHeroToCampaign,
  };
  let __VLS_16;
  let __VLS_17;
  __VLS_nonNullable(__VLS_18.slots).default;
  var __VLS_18;
  const __VLS_21 = __VLS_resolvedLocalAndGlobalComponents.Divider;
  /** @type { [typeof __VLS_components.Divider, ] } */
  // @ts-ignore
  const __VLS_22 = __VLS_asFunctionalComponent(
    __VLS_21,
    new __VLS_21({ ...{ class: "m-2" } }),
  );
  const __VLS_23 = __VLS_22(
    { ...{ class: "m-2" } },
    ...__VLS_functionalComponentArgsRest(__VLS_22),
  );
  // @ts-ignore
  [BaseList, BaseList];
  // @ts-ignore
  const __VLS_27 = __VLS_asFunctionalComponent(
    BaseList,
    new BaseList({ id: "campaign-add-heroes" }),
  );
  const __VLS_28 = __VLS_27(
    { id: "campaign-add-heroes" },
    ...__VLS_functionalComponentArgsRest(__VLS_27),
  );
  for (const [hero] of __VLS_getVForSourceType(__VLS_ctx.filteredHeroes)) {
    hero.id;
    // @ts-ignore
    [BaseListItem, BaseListItem];
    // @ts-ignore
    const __VLS_32 = __VLS_asFunctionalComponent(
      BaseListItem,
      new BaseListItem({ ...{ onClick: {} }, avatar: hero.images.avatar }),
    );
    const __VLS_33 = __VLS_32(
      { ...{ onClick: {} }, avatar: hero.images.avatar },
      ...__VLS_functionalComponentArgsRest(__VLS_32),
    );
    let __VLS_37;
    const __VLS_38 = {
      onClick: (...[$event]) => {
        __VLS_ctx.addHeroToCampaign(hero.id);
      },
    };
    let __VLS_34;
    let __VLS_35;
    hero.name;
    __VLS_nonNullable(__VLS_36.slots).default;
    var __VLS_36;
    const __VLS_39 = __VLS_resolvedLocalAndGlobalComponents.Divider;
    /** @type { [typeof __VLS_components.Divider, ] } */
    // @ts-ignore
    const __VLS_40 = __VLS_asFunctionalComponent(
      __VLS_39,
      new __VLS_39({ ...{ class: "m-2" } }),
    );
    const __VLS_41 = __VLS_40(
      { ...{ class: "m-2" } },
      ...__VLS_functionalComponentArgsRest(__VLS_40),
    );
  }
  __VLS_nonNullable(__VLS_31.slots).default;
  var __VLS_31;
  __VLS_nonNullable(__VLS_13.slots).default;
  var __VLS_13;
  __VLS_styleScopedClasses["w-full"];
  __VLS_styleScopedClasses["md:w-1/3"];
  __VLS_styleScopedClasses["m-2"];
  __VLS_styleScopedClasses["m-2"];
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
      BaseList: BaseList,
      BaseListItem: BaseListItem,
      RandomImage: RandomImage,
      t: t,
      visible: visible,
      openModal: openModal,
      filteredHeroes: filteredHeroes,
      addHeroToCampaign: addHeroToCampaign,
      addRandomHeroToCampaign: addRandomHeroToCampaign,
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
