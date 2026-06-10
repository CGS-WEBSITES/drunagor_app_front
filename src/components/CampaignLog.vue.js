/// <reference types="../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import { computed } from "vue";
import { HeroDataRepository } from "@/data/repository/HeroDataRepository";
import { CampaignStore } from "@/store/CampaignStore";
import { useRouter } from "vue-router";
import CampaignLogCore from "./CampaignLogCore.vue";
import CampaignLogUnderKeep from "./CampaignLogUnderKeep.vue";
import CampaignLogUnderKeep2 from "./CampaignLogUnderKeep2.vue";
import CampaignLogAwakenings from "./CampaignLogAwakenings.vue";
import CampaignLogApocalypse from "./CampaignLogApocalypse.vue";
import CampaignLogSequentialAdventure from "@/components/CampaignLogSequentialAdventure.vue";
import { useI18n } from "vue-i18n";
const props = defineProps();
const heroDataRepository = new HeroDataRepository();
const campaignStore = CampaignStore();
const router = useRouter();
const { t } = useI18n();
const campaign = campaignStore.find(props.campaignId);
const hero = heroDataRepository.find(props.heroId) ?? {};
const heroBackgroundStyle = computed(() => ({
    backgroundImage: `url(${hero.images?.trackerInfo || hero.images?.background})`,
    backgroundSize: "cover",
    backgroundPosition: "center right",
    backgroundRepeat: "no-repeat",
}));
function openSequentialStateEditor() {
    router.push({
        name: "HeroSequentialState",
        params: { campaignId: props.campaignId, heroId: props.heroId },
    });
}
function openHeroEquipmentSkills() {
    router.push({
        name: "Hero",
        params: { campaignId: props.campaignId, heroId: props.heroId },
    });
}
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['action-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['action-buttons-container']} */ ;
/** @type {__VLS_StyleScopedClasses['action-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['action-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['action-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['action-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['action-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['hero-background-title']} */ ;
/** @type {__VLS_StyleScopedClasses['v-expansion-panel-title']} */ ;
/** @type {__VLS_StyleScopedClasses['hero-background-title']} */ ;
/** @type {__VLS_StyleScopedClasses['v-expansion-panel-title']} */ ;
/** @type {__VLS_StyleScopedClasses['hero-background-title']} */ ;
// CSS variable injection 
// CSS variable injection end 
const __VLS_0 = {}.VExpansionPanels;
/** @type {[typeof __VLS_components.VExpansionPanels, typeof __VLS_components.vExpansionPanels, typeof __VLS_components.VExpansionPanels, typeof __VLS_components.vExpansionPanels, ]} */ ;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
    variant: "accordion",
    ...{ class: "mb-2" },
}));
const __VLS_2 = __VLS_1({
    variant: "accordion",
    ...{ class: "mb-2" },
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
var __VLS_4 = {};
__VLS_3.slots.default;
const __VLS_5 = {}.VExpansionPanel;
/** @type {[typeof __VLS_components.VExpansionPanel, typeof __VLS_components.vExpansionPanel, typeof __VLS_components.VExpansionPanel, typeof __VLS_components.vExpansionPanel, ]} */ ;
// @ts-ignore
const __VLS_6 = __VLS_asFunctionalComponent(__VLS_5, new __VLS_5({
    elevation: "16",
    rounded: true,
    ...{ style: {} },
}));
const __VLS_7 = __VLS_6({
    elevation: "16",
    rounded: true,
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_6));
__VLS_8.slots.default;
const __VLS_9 = {}.VExpansionPanelTitle;
/** @type {[typeof __VLS_components.VExpansionPanelTitle, typeof __VLS_components.vExpansionPanelTitle, typeof __VLS_components.VExpansionPanelTitle, typeof __VLS_components.vExpansionPanelTitle, ]} */ ;
// @ts-ignore
const __VLS_10 = __VLS_asFunctionalComponent(__VLS_9, new __VLS_9({
    ...{ class: "pa-3 hero-background-title" },
    ...{ style: (__VLS_ctx.heroBackgroundStyle) },
}));
const __VLS_11 = __VLS_10({
    ...{ class: "pa-3 hero-background-title" },
    ...{ style: (__VLS_ctx.heroBackgroundStyle) },
}, ...__VLS_functionalComponentArgsRest(__VLS_10));
const __VLS_13 = {}.VExpansionPanelText;
/** @type {[typeof __VLS_components.VExpansionPanelText, typeof __VLS_components.vExpansionPanelText, typeof __VLS_components.VExpansionPanelText, typeof __VLS_components.vExpansionPanelText, ]} */ ;
// @ts-ignore
const __VLS_14 = __VLS_asFunctionalComponent(__VLS_13, new __VLS_13({
    ...{ class: "pa-0" },
}));
const __VLS_15 = __VLS_14({
    ...{ class: "pa-0" },
}, ...__VLS_functionalComponentArgsRest(__VLS_14));
__VLS_16.slots.default;
const __VLS_17 = {}.VCardText;
/** @type {[typeof __VLS_components.VCardText, typeof __VLS_components.vCardText, typeof __VLS_components.VCardText, typeof __VLS_components.vCardText, ]} */ ;
// @ts-ignore
const __VLS_18 = __VLS_asFunctionalComponent(__VLS_17, new __VLS_17({
    ...{ class: "px-0 pt-0 position-relative" },
}));
const __VLS_19 = __VLS_18({
    ...{ class: "px-0 pt-0 position-relative" },
}, ...__VLS_functionalComponentArgsRest(__VLS_18));
__VLS_20.slots.default;
const __VLS_21 = {}.VRow;
/** @type {[typeof __VLS_components.VRow, typeof __VLS_components.vRow, typeof __VLS_components.VRow, typeof __VLS_components.vRow, ]} */ ;
// @ts-ignore
const __VLS_22 = __VLS_asFunctionalComponent(__VLS_21, new __VLS_21({
    noGutters: true,
}));
const __VLS_23 = __VLS_22({
    noGutters: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_22));
__VLS_24.slots.default;
const __VLS_25 = {}.VCol;
/** @type {[typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ]} */ ;
// @ts-ignore
const __VLS_26 = __VLS_asFunctionalComponent(__VLS_25, new __VLS_25({
    cols: "12",
    ...{ class: "position-relative" },
}));
const __VLS_27 = __VLS_26({
    cols: "12",
    ...{ class: "position-relative" },
}, ...__VLS_functionalComponentArgsRest(__VLS_26));
__VLS_28.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "action-buttons-container" },
});
if (__VLS_ctx.isSequentialAdventure) {
    const __VLS_29 = {}.VBtn;
    /** @type {[typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ]} */ ;
    // @ts-ignore
    const __VLS_30 = __VLS_asFunctionalComponent(__VLS_29, new __VLS_29({
        ...{ 'onClick': {} },
        variant: "elevated",
        color: "secondary",
        rounded: true,
        ...{ class: "action-btn manage-btn shepherd-btn-manage-resources" },
        size: "small",
    }));
    const __VLS_31 = __VLS_30({
        ...{ 'onClick': {} },
        variant: "elevated",
        color: "secondary",
        rounded: true,
        ...{ class: "action-btn manage-btn shepherd-btn-manage-resources" },
        size: "small",
    }, ...__VLS_functionalComponentArgsRest(__VLS_30));
    let __VLS_33;
    let __VLS_34;
    let __VLS_35;
    const __VLS_36 = {
        onClick: (__VLS_ctx.openSequentialStateEditor)
    };
    __VLS_32.slots.default;
    (__VLS_ctx.t("Manage Resources"));
    var __VLS_32;
}
if ((__VLS_ctx.campaign.campaign == 'core' ||
    __VLS_ctx.campaign.campaign == 'awakenings' ||
    __VLS_ctx.campaign.campaign == 'apocalypse' ||
    __VLS_ctx.campaign.campaign == 'underkeep' ||
    __VLS_ctx.campaign.campaign == 'underkeep2')) {
    const __VLS_37 = {}.VBtn;
    /** @type {[typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ]} */ ;
    // @ts-ignore
    const __VLS_38 = __VLS_asFunctionalComponent(__VLS_37, new __VLS_37({
        ...{ 'onClick': {} },
        variant: "elevated",
        color: "primary",
        rounded: true,
        ...{ class: "action-btn equipment-btn ml-2 shepherd-btn-equipment-skills" },
        size: "small",
    }));
    const __VLS_39 = __VLS_38({
        ...{ 'onClick': {} },
        variant: "elevated",
        color: "primary",
        rounded: true,
        ...{ class: "action-btn equipment-btn ml-2 shepherd-btn-equipment-skills" },
        size: "small",
    }, ...__VLS_functionalComponentArgsRest(__VLS_38));
    let __VLS_41;
    let __VLS_42;
    let __VLS_43;
    const __VLS_44 = {
        onClick: (__VLS_ctx.openHeroEquipmentSkills)
    };
    __VLS_40.slots.default;
    (__VLS_ctx.t("label.equipment-skills"));
    var __VLS_40;
}
var __VLS_28;
var __VLS_24;
var __VLS_20;
const __VLS_45 = {}.VCardActions;
/** @type {[typeof __VLS_components.VCardActions, typeof __VLS_components.vCardActions, typeof __VLS_components.VCardActions, typeof __VLS_components.vCardActions, ]} */ ;
// @ts-ignore
const __VLS_46 = __VLS_asFunctionalComponent(__VLS_45, new __VLS_45({}));
const __VLS_47 = __VLS_46({}, ...__VLS_functionalComponentArgsRest(__VLS_46));
__VLS_48.slots.default;
const __VLS_49 = {}.VRow;
/** @type {[typeof __VLS_components.VRow, typeof __VLS_components.vRow, typeof __VLS_components.VRow, typeof __VLS_components.vRow, ]} */ ;
// @ts-ignore
const __VLS_50 = __VLS_asFunctionalComponent(__VLS_49, new __VLS_49({
    noGutters: true,
}));
const __VLS_51 = __VLS_50({
    noGutters: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_50));
__VLS_52.slots.default;
const __VLS_53 = {}.VCol;
/** @type {[typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ]} */ ;
// @ts-ignore
const __VLS_54 = __VLS_asFunctionalComponent(__VLS_53, new __VLS_53({
    cols: "12",
}));
const __VLS_55 = __VLS_54({
    cols: "12",
}, ...__VLS_functionalComponentArgsRest(__VLS_54));
__VLS_56.slots.default;
if (__VLS_ctx.isSequentialAdventure) {
    /** @type {[typeof CampaignLogSequentialAdventure, ]} */ ;
    // @ts-ignore
    const __VLS_57 = __VLS_asFunctionalComponent(CampaignLogSequentialAdventure, new CampaignLogSequentialAdventure({
        hero: (__VLS_ctx.hero),
        campaignId: (__VLS_ctx.campaignId),
        hideManageButton: (true),
    }));
    const __VLS_58 = __VLS_57({
        hero: (__VLS_ctx.hero),
        campaignId: (__VLS_ctx.campaignId),
        hideManageButton: (true),
    }, ...__VLS_functionalComponentArgsRest(__VLS_57));
}
var __VLS_56;
const __VLS_60 = {}.VCol;
/** @type {[typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ]} */ ;
// @ts-ignore
const __VLS_61 = __VLS_asFunctionalComponent(__VLS_60, new __VLS_60({
    cols: "12",
}));
const __VLS_62 = __VLS_61({
    cols: "12",
}, ...__VLS_functionalComponentArgsRest(__VLS_61));
__VLS_63.slots.default;
if (__VLS_ctx.campaign.campaign == 'core') {
    /** @type {[typeof CampaignLogCore, ]} */ ;
    // @ts-ignore
    const __VLS_64 = __VLS_asFunctionalComponent(CampaignLogCore, new CampaignLogCore({
        campaignId: (props.campaignId),
        heroId: (props.heroId),
        hideEquipmentButton: (true),
    }));
    const __VLS_65 = __VLS_64({
        campaignId: (props.campaignId),
        heroId: (props.heroId),
        hideEquipmentButton: (true),
    }, ...__VLS_functionalComponentArgsRest(__VLS_64));
}
var __VLS_63;
const __VLS_67 = {}.VCol;
/** @type {[typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ]} */ ;
// @ts-ignore
const __VLS_68 = __VLS_asFunctionalComponent(__VLS_67, new __VLS_67({
    cols: "12",
}));
const __VLS_69 = __VLS_68({
    cols: "12",
}, ...__VLS_functionalComponentArgsRest(__VLS_68));
__VLS_70.slots.default;
if (__VLS_ctx.campaign.campaign == 'awakenings') {
    /** @type {[typeof CampaignLogAwakenings, ]} */ ;
    // @ts-ignore
    const __VLS_71 = __VLS_asFunctionalComponent(CampaignLogAwakenings, new CampaignLogAwakenings({
        campaignId: (props.campaignId),
        heroId: (props.heroId),
        hideEquipmentButton: (true),
    }));
    const __VLS_72 = __VLS_71({
        campaignId: (props.campaignId),
        heroId: (props.heroId),
        hideEquipmentButton: (true),
    }, ...__VLS_functionalComponentArgsRest(__VLS_71));
}
var __VLS_70;
const __VLS_74 = {}.VCol;
/** @type {[typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ]} */ ;
// @ts-ignore
const __VLS_75 = __VLS_asFunctionalComponent(__VLS_74, new __VLS_74({
    cols: "12",
}));
const __VLS_76 = __VLS_75({
    cols: "12",
}, ...__VLS_functionalComponentArgsRest(__VLS_75));
__VLS_77.slots.default;
if (__VLS_ctx.campaign.campaign == 'apocalypse') {
    /** @type {[typeof CampaignLogApocalypse, ]} */ ;
    // @ts-ignore
    const __VLS_78 = __VLS_asFunctionalComponent(CampaignLogApocalypse, new CampaignLogApocalypse({
        campaignId: (props.campaignId),
        heroId: (props.heroId),
        hideEquipmentButton: (true),
    }));
    const __VLS_79 = __VLS_78({
        campaignId: (props.campaignId),
        heroId: (props.heroId),
        hideEquipmentButton: (true),
    }, ...__VLS_functionalComponentArgsRest(__VLS_78));
}
var __VLS_77;
const __VLS_81 = {}.VCol;
/** @type {[typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ]} */ ;
// @ts-ignore
const __VLS_82 = __VLS_asFunctionalComponent(__VLS_81, new __VLS_81({
    cols: "12",
}));
const __VLS_83 = __VLS_82({
    cols: "12",
}, ...__VLS_functionalComponentArgsRest(__VLS_82));
__VLS_84.slots.default;
if (__VLS_ctx.campaign.campaign == 'underkeep') {
    /** @type {[typeof CampaignLogUnderKeep, ]} */ ;
    // @ts-ignore
    const __VLS_85 = __VLS_asFunctionalComponent(CampaignLogUnderKeep, new CampaignLogUnderKeep({
        campaignId: (props.campaignId),
        heroId: (props.heroId),
        hideEquipmentButton: (true),
    }));
    const __VLS_86 = __VLS_85({
        campaignId: (props.campaignId),
        heroId: (props.heroId),
        hideEquipmentButton: (true),
    }, ...__VLS_functionalComponentArgsRest(__VLS_85));
}
var __VLS_84;
const __VLS_88 = {}.VCol;
/** @type {[typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ]} */ ;
// @ts-ignore
const __VLS_89 = __VLS_asFunctionalComponent(__VLS_88, new __VLS_88({
    cols: "12",
}));
const __VLS_90 = __VLS_89({
    cols: "12",
}, ...__VLS_functionalComponentArgsRest(__VLS_89));
__VLS_91.slots.default;
if (__VLS_ctx.campaign.campaign == 'underkeep2') {
    /** @type {[typeof CampaignLogUnderKeep2, ]} */ ;
    // @ts-ignore
    const __VLS_92 = __VLS_asFunctionalComponent(CampaignLogUnderKeep2, new CampaignLogUnderKeep2({
        campaignId: (props.campaignId),
        heroId: (props.heroId),
        hideEquipmentButton: (true),
    }));
    const __VLS_93 = __VLS_92({
        campaignId: (props.campaignId),
        heroId: (props.heroId),
        hideEquipmentButton: (true),
    }, ...__VLS_functionalComponentArgsRest(__VLS_92));
}
var __VLS_91;
var __VLS_52;
var __VLS_48;
var __VLS_16;
var __VLS_8;
var __VLS_3;
/** @type {__VLS_StyleScopedClasses['mb-2']} */ ;
/** @type {__VLS_StyleScopedClasses['pa-3']} */ ;
/** @type {__VLS_StyleScopedClasses['hero-background-title']} */ ;
/** @type {__VLS_StyleScopedClasses['pa-0']} */ ;
/** @type {__VLS_StyleScopedClasses['px-0']} */ ;
/** @type {__VLS_StyleScopedClasses['pt-0']} */ ;
/** @type {__VLS_StyleScopedClasses['position-relative']} */ ;
/** @type {__VLS_StyleScopedClasses['position-relative']} */ ;
/** @type {__VLS_StyleScopedClasses['action-buttons-container']} */ ;
/** @type {__VLS_StyleScopedClasses['action-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['manage-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['shepherd-btn-manage-resources']} */ ;
/** @type {__VLS_StyleScopedClasses['action-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['equipment-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['ml-2']} */ ;
/** @type {__VLS_StyleScopedClasses['shepherd-btn-equipment-skills']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            CampaignLogCore: CampaignLogCore,
            CampaignLogUnderKeep: CampaignLogUnderKeep,
            CampaignLogUnderKeep2: CampaignLogUnderKeep2,
            CampaignLogAwakenings: CampaignLogAwakenings,
            CampaignLogApocalypse: CampaignLogApocalypse,
            CampaignLogSequentialAdventure: CampaignLogSequentialAdventure,
            t: t,
            campaign: campaign,
            hero: hero,
            heroBackgroundStyle: heroBackgroundStyle,
            openSequentialStateEditor: openSequentialStateEditor,
            openHeroEquipmentSkills: openHeroEquipmentSkills,
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
