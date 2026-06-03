/// <reference types="../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import CampaignHeroWeapon from "@/components/CampaignHeroWeapon.vue";
import CampaignHeroOffHand from "@/components/CampaignHeroOffHand.vue";
import CampaignHeroArmor from "@/components/CampaignHeroArmor.vue";
import CampaignHeroTrinket from "@/components/CampaignHeroTrinket.vue";
import CampaignHeroBagItem from "@/components/CampaignHeroBagItem.vue";
import { HeroStore } from "@/store/HeroStore";
import { HeroEquipment } from "@/store/Hero";
import { ref } from "vue";
import { useI18n } from "vue-i18n";
const { t } = useI18n();
const heroStore = HeroStore();
const props = defineProps();
const filterProficiencies = ref(true);
const campaignHero = heroStore.findInCampaign(props.heroId, props.campaignId);
if (typeof campaignHero.equipment === "undefined") {
    campaignHero.equipment = new HeroEquipment();
}
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
// CSS variable injection 
// CSS variable injection end 
const __VLS_0 = {}.VRow;
/** @type {[typeof __VLS_components.VRow, typeof __VLS_components.vRow, typeof __VLS_components.VRow, typeof __VLS_components.vRow, ]} */ ;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
    noGutters: true,
}));
const __VLS_2 = __VLS_1({
    noGutters: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
__VLS_3.slots.default;
const __VLS_4 = {}.VCol;
/** @type {[typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ]} */ ;
// @ts-ignore
const __VLS_5 = __VLS_asFunctionalComponent(__VLS_4, new __VLS_4({
    cols: "12",
    ...{ class: "py-1" },
}));
const __VLS_6 = __VLS_5({
    cols: "12",
    ...{ class: "py-1" },
}, ...__VLS_functionalComponentArgsRest(__VLS_5));
__VLS_7.slots.default;
const __VLS_8 = {}.VLabel;
/** @type {[typeof __VLS_components.VLabel, typeof __VLS_components.vLabel, typeof __VLS_components.VLabel, typeof __VLS_components.vLabel, ]} */ ;
// @ts-ignore
const __VLS_9 = __VLS_asFunctionalComponent(__VLS_8, new __VLS_8({}));
const __VLS_10 = __VLS_9({}, ...__VLS_functionalComponentArgsRest(__VLS_9));
__VLS_11.slots.default;
const __VLS_12 = {}.VSwitch;
/** @type {[typeof __VLS_components.VSwitch, typeof __VLS_components.vSwitch, typeof __VLS_components.VSwitch, typeof __VLS_components.vSwitch, ]} */ ;
// @ts-ignore
const __VLS_13 = __VLS_asFunctionalComponent(__VLS_12, new __VLS_12({
    modelValue: (__VLS_ctx.filterProficiencies),
    color: "success",
    hideDetails: true,
    inset: true,
    ...{ class: "mr-3" },
}));
const __VLS_14 = __VLS_13({
    modelValue: (__VLS_ctx.filterProficiencies),
    color: "success",
    hideDetails: true,
    inset: true,
    ...{ class: "mr-3" },
}, ...__VLS_functionalComponentArgsRest(__VLS_13));
(__VLS_ctx.t("label.filter-by-proficiency"));
var __VLS_11;
var __VLS_7;
const __VLS_16 = {}.VCol;
/** @type {[typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ]} */ ;
// @ts-ignore
const __VLS_17 = __VLS_asFunctionalComponent(__VLS_16, new __VLS_16({
    cols: "12",
    ...{ class: "py-1" },
}));
const __VLS_18 = __VLS_17({
    cols: "12",
    ...{ class: "py-1" },
}, ...__VLS_functionalComponentArgsRest(__VLS_17));
__VLS_19.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "pb-3" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
(__VLS_ctx.t("label.weapon"));
/** @type {[typeof CampaignHeroWeapon, ]} */ ;
// @ts-ignore
const __VLS_20 = __VLS_asFunctionalComponent(CampaignHeroWeapon, new CampaignHeroWeapon({
    ...{ 'onStash': {} },
    campaignId: (__VLS_ctx.campaignId),
    heroId: (__VLS_ctx.heroId),
    heroData: (__VLS_ctx.hero),
    cardsDataRepository: (__VLS_ctx.repository),
    filterProficiencies: (__VLS_ctx.filterProficiencies),
}));
const __VLS_21 = __VLS_20({
    ...{ 'onStash': {} },
    campaignId: (__VLS_ctx.campaignId),
    heroId: (__VLS_ctx.heroId),
    heroData: (__VLS_ctx.hero),
    cardsDataRepository: (__VLS_ctx.repository),
    filterProficiencies: (__VLS_ctx.filterProficiencies),
}, ...__VLS_functionalComponentArgsRest(__VLS_20));
let __VLS_23;
let __VLS_24;
let __VLS_25;
const __VLS_26 = {
    onStash: (...[$event]) => {
        __VLS_ctx.$emit('stash');
    }
};
var __VLS_22;
var __VLS_19;
const __VLS_27 = {}.VCol;
/** @type {[typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ]} */ ;
// @ts-ignore
const __VLS_28 = __VLS_asFunctionalComponent(__VLS_27, new __VLS_27({
    cols: "12",
    ...{ class: "py-1" },
}));
const __VLS_29 = __VLS_28({
    cols: "12",
    ...{ class: "py-1" },
}, ...__VLS_functionalComponentArgsRest(__VLS_28));
__VLS_30.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "pb-3" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
(__VLS_ctx.t("label.off-hand"));
/** @type {[typeof CampaignHeroOffHand, typeof CampaignHeroOffHand, ]} */ ;
// @ts-ignore
const __VLS_31 = __VLS_asFunctionalComponent(CampaignHeroOffHand, new CampaignHeroOffHand({
    ...{ 'onStash': {} },
    campaignId: (__VLS_ctx.campaignId),
    heroId: (__VLS_ctx.heroId),
    heroData: (__VLS_ctx.hero),
    cardsDataRepository: (__VLS_ctx.repository),
    filterProficiencies: (__VLS_ctx.filterProficiencies),
}));
const __VLS_32 = __VLS_31({
    ...{ 'onStash': {} },
    campaignId: (__VLS_ctx.campaignId),
    heroId: (__VLS_ctx.heroId),
    heroData: (__VLS_ctx.hero),
    cardsDataRepository: (__VLS_ctx.repository),
    filterProficiencies: (__VLS_ctx.filterProficiencies),
}, ...__VLS_functionalComponentArgsRest(__VLS_31));
let __VLS_34;
let __VLS_35;
let __VLS_36;
const __VLS_37 = {
    onStash: (...[$event]) => {
        __VLS_ctx.$emit('stash');
    }
};
var __VLS_33;
var __VLS_30;
const __VLS_38 = {}.VCol;
/** @type {[typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ]} */ ;
// @ts-ignore
const __VLS_39 = __VLS_asFunctionalComponent(__VLS_38, new __VLS_38({
    cols: "12",
    ...{ class: "py-1" },
}));
const __VLS_40 = __VLS_39({
    cols: "12",
    ...{ class: "py-1" },
}, ...__VLS_functionalComponentArgsRest(__VLS_39));
__VLS_41.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "pb-3" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
(__VLS_ctx.t("label.armor"));
/** @type {[typeof CampaignHeroArmor, typeof CampaignHeroArmor, ]} */ ;
// @ts-ignore
const __VLS_42 = __VLS_asFunctionalComponent(CampaignHeroArmor, new CampaignHeroArmor({
    ...{ 'onStash': {} },
    campaignId: (__VLS_ctx.campaignId),
    heroId: (__VLS_ctx.heroId),
    heroData: (__VLS_ctx.hero),
    cardsDataRepository: (__VLS_ctx.repository),
    filterProficiencies: (__VLS_ctx.filterProficiencies),
}));
const __VLS_43 = __VLS_42({
    ...{ 'onStash': {} },
    campaignId: (__VLS_ctx.campaignId),
    heroId: (__VLS_ctx.heroId),
    heroData: (__VLS_ctx.hero),
    cardsDataRepository: (__VLS_ctx.repository),
    filterProficiencies: (__VLS_ctx.filterProficiencies),
}, ...__VLS_functionalComponentArgsRest(__VLS_42));
let __VLS_45;
let __VLS_46;
let __VLS_47;
const __VLS_48 = {
    onStash: (...[$event]) => {
        __VLS_ctx.$emit('stash');
    }
};
var __VLS_44;
var __VLS_41;
const __VLS_49 = {}.VCol;
/** @type {[typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ]} */ ;
// @ts-ignore
const __VLS_50 = __VLS_asFunctionalComponent(__VLS_49, new __VLS_49({
    cols: "12",
    ...{ class: "py-1" },
}));
const __VLS_51 = __VLS_50({
    cols: "12",
    ...{ class: "py-1" },
}, ...__VLS_functionalComponentArgsRest(__VLS_50));
__VLS_52.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "pb-3" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
(__VLS_ctx.t("label.trinket"));
/** @type {[typeof CampaignHeroTrinket, typeof CampaignHeroTrinket, ]} */ ;
// @ts-ignore
const __VLS_53 = __VLS_asFunctionalComponent(CampaignHeroTrinket, new CampaignHeroTrinket({
    ...{ 'onStash': {} },
    campaignId: (__VLS_ctx.campaignId),
    heroId: (__VLS_ctx.heroId),
    cardsDataRepository: (__VLS_ctx.repository),
}));
const __VLS_54 = __VLS_53({
    ...{ 'onStash': {} },
    campaignId: (__VLS_ctx.campaignId),
    heroId: (__VLS_ctx.heroId),
    cardsDataRepository: (__VLS_ctx.repository),
}, ...__VLS_functionalComponentArgsRest(__VLS_53));
let __VLS_56;
let __VLS_57;
let __VLS_58;
const __VLS_59 = {
    onStash: (...[$event]) => {
        __VLS_ctx.$emit('stash');
    }
};
var __VLS_55;
var __VLS_52;
var __VLS_3;
const __VLS_60 = {}.VCol;
/** @type {[typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ]} */ ;
// @ts-ignore
const __VLS_61 = __VLS_asFunctionalComponent(__VLS_60, new __VLS_60({
    cols: "12",
    ...{ class: "py-1" },
}));
const __VLS_62 = __VLS_61({
    cols: "12",
    ...{ class: "py-1" },
}, ...__VLS_functionalComponentArgsRest(__VLS_61));
__VLS_63.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "pb-3" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
(__VLS_ctx.t("label.bag-slot"));
/** @type {[typeof CampaignHeroBagItem, typeof CampaignHeroBagItem, ]} */ ;
// @ts-ignore
const __VLS_64 = __VLS_asFunctionalComponent(CampaignHeroBagItem, new CampaignHeroBagItem({
    ...{ 'onStash': {} },
    campaignId: (__VLS_ctx.campaignId),
    heroId: (__VLS_ctx.heroId),
    cardsDataRepository: (__VLS_ctx.repository),
    bagSlot: (1),
}));
const __VLS_65 = __VLS_64({
    ...{ 'onStash': {} },
    campaignId: (__VLS_ctx.campaignId),
    heroId: (__VLS_ctx.heroId),
    cardsDataRepository: (__VLS_ctx.repository),
    bagSlot: (1),
}, ...__VLS_functionalComponentArgsRest(__VLS_64));
let __VLS_67;
let __VLS_68;
let __VLS_69;
const __VLS_70 = {
    onStash: (...[$event]) => {
        __VLS_ctx.$emit('stash');
    }
};
var __VLS_66;
var __VLS_63;
const __VLS_71 = {}.VCol;
/** @type {[typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ]} */ ;
// @ts-ignore
const __VLS_72 = __VLS_asFunctionalComponent(__VLS_71, new __VLS_71({
    cols: "12",
    ...{ class: "py-1" },
}));
const __VLS_73 = __VLS_72({
    cols: "12",
    ...{ class: "py-1" },
}, ...__VLS_functionalComponentArgsRest(__VLS_72));
__VLS_74.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "pb-3" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
(__VLS_ctx.t("label.bag-slot"));
/** @type {[typeof CampaignHeroBagItem, typeof CampaignHeroBagItem, ]} */ ;
// @ts-ignore
const __VLS_75 = __VLS_asFunctionalComponent(CampaignHeroBagItem, new CampaignHeroBagItem({
    ...{ 'onStash': {} },
    campaignId: (__VLS_ctx.campaignId),
    heroId: (__VLS_ctx.heroId),
    cardsDataRepository: (__VLS_ctx.repository),
    bagSlot: (2),
}));
const __VLS_76 = __VLS_75({
    ...{ 'onStash': {} },
    campaignId: (__VLS_ctx.campaignId),
    heroId: (__VLS_ctx.heroId),
    cardsDataRepository: (__VLS_ctx.repository),
    bagSlot: (2),
}, ...__VLS_functionalComponentArgsRest(__VLS_75));
let __VLS_78;
let __VLS_79;
let __VLS_80;
const __VLS_81 = {
    onStash: (...[$event]) => {
        __VLS_ctx.$emit('stash');
    }
};
var __VLS_77;
var __VLS_74;
/** @type {__VLS_StyleScopedClasses['py-1']} */ ;
/** @type {__VLS_StyleScopedClasses['mr-3']} */ ;
/** @type {__VLS_StyleScopedClasses['py-1']} */ ;
/** @type {__VLS_StyleScopedClasses['pb-3']} */ ;
/** @type {__VLS_StyleScopedClasses['py-1']} */ ;
/** @type {__VLS_StyleScopedClasses['pb-3']} */ ;
/** @type {__VLS_StyleScopedClasses['py-1']} */ ;
/** @type {__VLS_StyleScopedClasses['pb-3']} */ ;
/** @type {__VLS_StyleScopedClasses['py-1']} */ ;
/** @type {__VLS_StyleScopedClasses['pb-3']} */ ;
/** @type {__VLS_StyleScopedClasses['py-1']} */ ;
/** @type {__VLS_StyleScopedClasses['pb-3']} */ ;
/** @type {__VLS_StyleScopedClasses['py-1']} */ ;
/** @type {__VLS_StyleScopedClasses['pb-3']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
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
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
    __typeProps: {},
});
; /* PartiallyEnd: #4569/main.vue */
