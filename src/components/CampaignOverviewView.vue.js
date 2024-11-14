import CampaignNew from "@/components/CampaignNew.vue";
import { HeroDataRepository } from "@/data/repository/HeroDataRepository";
import { Campaign } from "@/store/Campaign";
import { CampaignStore } from "@/store/CampaignStore";
import { Hero } from "@/store/Hero";
import { HeroStore } from "@/store/HeroStore";
import { PartyStore } from "@/store/PartyStore";
import { customAlphabet } from "nanoid";
import CampaignImport from "@/components/CampaignImport.vue";
import Card from "primevue/card";
const { defineProps, defineSlots, defineEmits, defineExpose, defineModel, defineOptions, withDefaults, } = await import('vue');
const partyStore = PartyStore();
const legacyCampaign = partyStore.findAll();
const campaignStore = CampaignStore();
const heroStore = HeroStore();
const nanoid = customAlphabet("1234567890", 5);
//backwards compatibility
if (legacyCampaign.length > 0) {
    let campaignId = nanoid();
    campaignStore.add(new Campaign(campaignId, "core"));
    legacyCampaign.forEach((hero) => {
        let newHero = new Hero(hero.heroId, campaignId);
        newHero.auraId = hero.auraId;
        newHero.outcomeIds = hero.outcomeIds;
        newHero.statusIds = hero.statusIds;
        heroStore.add(newHero);
        partyStore.removeMember(hero.heroId);
    });
}
const heroDataRepository = new HeroDataRepository();
function findHeroes(campaignId) {
    const heroes = [];
    heroStore.findAllInCampaign(campaignId).forEach((hero) => {
        heroes.push(heroDataRepository.find(hero.heroId) ?? {});
    });
    return heroes;
}
; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_fnComponent = (await import('vue')).defineComponent({});
;
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
    const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({}));
    const __VLS_2 = __VLS_1({}, ...__VLS_functionalComponentArgsRest(__VLS_1));
    const __VLS_6 = __VLS_resolvedLocalAndGlobalComponents.VCardActions;
    /** @type { [typeof __VLS_components.VCardActions, typeof __VLS_components.vCardActions, typeof __VLS_components.VCardActions, typeof __VLS_components.vCardActions, ] } */
    // @ts-ignore
    const __VLS_7 = __VLS_asFunctionalComponent(__VLS_6, new __VLS_6({}));
    const __VLS_8 = __VLS_7({}, ...__VLS_functionalComponentArgsRest(__VLS_7));
    // @ts-ignore
    [CampaignNew,];
    // @ts-ignore
    const __VLS_12 = __VLS_asFunctionalComponent(CampaignNew, new CampaignNew({}));
    const __VLS_13 = __VLS_12({}, ...__VLS_functionalComponentArgsRest(__VLS_12));
    // @ts-ignore
    [CampaignImport,];
    // @ts-ignore
    const __VLS_17 = __VLS_asFunctionalComponent(CampaignImport, new CampaignImport({}));
    const __VLS_18 = __VLS_17({}, ...__VLS_functionalComponentArgsRest(__VLS_17));
    __VLS_nonNullable(__VLS_11.slots).default;
    var __VLS_11;
    __VLS_nonNullable(__VLS_5.slots).default;
    var __VLS_5;
    __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ id: ("campaigns"), ...{ class: ("grid gap-4 pt-4 place-items-center") }, });
    for (const [campaign] of __VLS_getVForSourceType((__VLS_ctx.campaignStore.findAll()))) {
        const __VLS_22 = __VLS_resolvedLocalAndGlobalComponents.RouterLink;
        /** @type { [typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, ] } */
        // @ts-ignore
        const __VLS_23 = __VLS_asFunctionalComponent(__VLS_22, new __VLS_22({ to: (({ name: 'Campaign', params: { id: campaign.campaignId } })), ...{ class: ("w-full") }, }));
        const __VLS_24 = __VLS_23({ to: (({ name: 'Campaign', params: { id: campaign.campaignId } })), ...{ class: ("w-full") }, }, ...__VLS_functionalComponentArgsRest(__VLS_23));
        const __VLS_28 = __VLS_resolvedLocalAndGlobalComponents.Card;
        /** @type { [typeof __VLS_components.Card, typeof __VLS_components.Card, ] } */
        // @ts-ignore
        const __VLS_29 = __VLS_asFunctionalComponent(__VLS_28, new __VLS_28({}));
        const __VLS_30 = __VLS_29({}, ...__VLS_functionalComponentArgsRest(__VLS_29));
        __VLS_elementAsFunction(__VLS_intrinsicElements.template, __VLS_intrinsicElements.template)({});
        {
            const { title: __VLS_thisSlot } = __VLS_nonNullable(__VLS_33.slots);
            __VLS_elementAsFunction(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({ ...{ class: ("capitalize") }, });
            (campaign.campaign);
            if (campaign.name) {
                (campaign.name);
            }
        }
        __VLS_elementAsFunction(__VLS_intrinsicElements.template, __VLS_intrinsicElements.template)({});
        {
            const { content: __VLS_thisSlot } = __VLS_nonNullable(__VLS_33.slots);
            __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ ...{ class: ("flex flex-wrap justify-center min-h-16") }, });
            for (const [hero] of __VLS_getVForSourceType((__VLS_ctx.findHeroes(campaign.campaignId)))) {
                const __VLS_34 = __VLS_resolvedLocalAndGlobalComponents.Avatar;
                /** @type { [typeof __VLS_components.Avatar, ] } */
                // @ts-ignore
                const __VLS_35 = __VLS_asFunctionalComponent(__VLS_34, new __VLS_34({ image: ((hero.images.avatar)), ...{ class: ("mr-2") }, size: ("large"), shape: ("circle"), }));
                const __VLS_36 = __VLS_35({ image: ((hero.images.avatar)), ...{ class: ("mr-2") }, size: ("large"), shape: ("circle"), }, ...__VLS_functionalComponentArgsRest(__VLS_35));
            }
        }
        var __VLS_33;
        __VLS_nonNullable(__VLS_27.slots).default;
        var __VLS_27;
    }
    __VLS_styleScopedClasses['grid'];
    __VLS_styleScopedClasses['gap-4'];
    __VLS_styleScopedClasses['pt-4'];
    __VLS_styleScopedClasses['place-items-center'];
    __VLS_styleScopedClasses['w-full'];
    __VLS_styleScopedClasses['capitalize'];
    __VLS_styleScopedClasses['flex'];
    __VLS_styleScopedClasses['flex-wrap'];
    __VLS_styleScopedClasses['justify-center'];
    __VLS_styleScopedClasses['min-h-16'];
    __VLS_styleScopedClasses['mr-2'];
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
;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            CampaignNew: CampaignNew,
            CampaignImport: CampaignImport,
            Card: Card,
            campaignStore: campaignStore,
            findHeroes: findHeroes,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
