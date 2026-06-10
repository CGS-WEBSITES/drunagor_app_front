/// <reference types="../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import { HeroDataRepository } from "@/data/repository/HeroDataRepository";
import { useRoute, useRouter } from "vue-router";
import CampaignHeroItems from "@/components/CampaignHeroItems.vue";
import CampaignHeroStash from "@/components/CampaignHeroStash.vue";
import CampaignHeroSkills from "@/components/CampaignHeroSkills.vue";
import HeroSavePut from "@/components/HeroSavePut.vue";
import { ref, onMounted } from "vue";
import { CampaignStore } from "@/store/CampaignStore";
import { CoreItemDataRepository } from "@/data/repository/campaign/core/CoreItemDataRepository";
import { UnderKeepItemDataRepository } from "@/data/repository/campaign/underkeep/UnderKeepItemDataRepository";
import { UnderKeep2ItemDataRepository } from "@/data/repository/campaign/underkeep2/UnderKeep2ItemDataRepository";
import { ApocalypseItemDataRepository } from "@/data/repository/campaign/apocalypse/ApocalypseItemDataRepository";
import { AwakeningsItemDataRepository } from "@/data/repository/campaign/awakenings/AwakeningsItemDataRepository";
import { useI18n } from "vue-i18n";
import { HeroStore } from "@/store/HeroStore";
import { CampaignLoadFromStorage } from "@/utils/CampaignLoadFromStorage";
const route = useRoute();
const router = useRouter();
const heroDataRepository = new HeroDataRepository();
const { t } = useI18n();
const heroSavePutRef = ref();
const heroId = route.params.heroId.toString();
const campaignId = route.params.campaignId.toString();
const campaignStore = CampaignStore();
const heroStore = HeroStore();
const isLoaded = ref(false);
const campaign = ref(null);
const hero = ref(null);
const campaignHeroRef = ref(null);
const repository = ref(null);
const localClassAbilityCount = ref(0);
const stash = ref(0);
const snackbarVisible = ref(false);
const snackbarText = ref("");
const snackbarColor = ref("success");
const snackbarTimeout = ref(3000);
function getRepository(campaignType) {
    switch (campaignType) {
        case "core":
            return new CoreItemDataRepository();
        case "apocalypse":
            return new ApocalypseItemDataRepository();
        case "awakenings":
            return new AwakeningsItemDataRepository();
        case "underkeep":
            return new UnderKeepItemDataRepository();
        case "underkeep2":
            return new UnderKeep2ItemDataRepository();
        default:
            throw new Error(`Unknown campaign type: ${campaignType}`);
    }
}
function setAbilityCount(count) {
    if (localClassAbilityCount.value === count) {
        localClassAbilityCount.value = count - 1;
    }
    else {
        localClassAbilityCount.value = count;
    }
}
function onStash() {
    stash.value += 1;
}
const getInstructionStateKey = () => `campaign_${campaignId}_instruction_state`;
const getInstructionStepKey = (tab) => `campaign_${campaignId}_instruction_step_${tab}`;
const getInstructionState = () => {
    if (typeof window !== "undefined") {
        try {
            const stateStr = localStorage.getItem(getInstructionStateKey());
            if (stateStr) {
                const state = JSON.parse(stateStr);
                const now = Date.now();
                const thirtyMinutes = 30 * 60 * 1000;
                if (now - state.timestamp < thirtyMinutes) {
                    const stepStr = localStorage.getItem(getInstructionStepKey(state.tab));
                    return {
                        expanded: state.expanded,
                        tab: state.tab,
                        step: stepStr ? parseInt(stepStr) : undefined,
                    };
                }
                else {
                    localStorage.removeItem(getInstructionStateKey());
                    localStorage.removeItem(getInstructionStepKey("load"));
                    localStorage.removeItem(getInstructionStepKey("save"));
                }
            }
        }
        catch (error) {
            console.error("Erro ao obter estado das instruções:", error);
        }
    }
    return null;
};
const onSaveSuccess = () => {
    snackbarText.value = "Equipment and skills saved successfully!";
    snackbarColor.value = "success";
    snackbarVisible.value = true;
    setTimeout(() => {
        navigateBack();
    }, 1000);
};
const onSaveFail = () => {
    snackbarText.value = "Failed to save equipment and skills.";
    snackbarColor.value = "error";
    snackbarVisible.value = true;
};
function navigateBack() {
    const instructionState = getInstructionState();
    const query = {};
    if (instructionState && instructionState.expanded) {
        query.instructions = "open";
        query.tab = instructionState.tab;
    }
    router.push({
        name: "Campaign",
        params: { id: campaignId },
        query: query,
    });
}
function syncStateToStore() {
    if (campaignHeroRef.value) {
        campaignHeroRef.value.classAbilityCount =
            Number(localClassAbilityCount.value) || 0;
    }
}
function saveAndGoBack() {
    syncStateToStore();
    if (heroSavePutRef.value && heroSavePutRef.value.save) {
        heroSavePutRef.value.save().catch((error) => {
            console.error("Error saving:", error);
            onSaveFail();
        });
    }
    else {
        navigateBack();
    }
}
onMounted(async () => {
    try {
        const loader = new CampaignLoadFromStorage();
        await loader.loadCampaignComplete(campaignId);
        const foundCampaign = campaignStore.find(campaignId);
        if (!foundCampaign) {
            throw new Error(`Campaign ${campaignId} not found`);
        }
        campaign.value = foundCampaign;
        repository.value = getRepository(foundCampaign.campaign);
        const updatedHero = heroStore.findInCampaignOptional(heroId, campaignId);
        if (updatedHero) {
            campaignHeroRef.value = updatedHero;
            if (!updatedHero.equipment) {
                updatedHero.equipment = {
                    weaponId: "",
                    offHandId: "",
                    armorId: "",
                    trinketId: "",
                    bagOneId: "",
                    bagTwoId: "",
                };
            }
            if (!updatedHero.stashedCardIds) {
                updatedHero.stashedCardIds = [];
            }
            if (!updatedHero.skillIds) {
                updatedHero.skillIds = [];
            }
            if (typeof updatedHero.classAbilityCount === "undefined") {
                updatedHero.classAbilityCount = 0;
            }
            localClassAbilityCount.value = updatedHero.classAbilityCount || 0;
            hero.value = heroDataRepository.find(heroId) ?? null;
        }
        else {
            console.error(`Hero ${heroId} not found in campaign ${campaignId}`);
            snackbarText.value = "Hero not found in this campaign.";
            snackbarColor.value = "error";
            snackbarVisible.value = true;
        }
    }
    catch (error) {
        console.error("Error loading hero data:", error);
        snackbarText.value = "Error loading hero data.";
        snackbarColor.value = "error";
        snackbarVisible.value = true;
    }
    finally {
        isLoaded.value = true;
    }
});
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
    ...{ class: "pt-6" },
}));
const __VLS_2 = __VLS_1({
    noGutters: true,
    ...{ class: "pt-6" },
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
__VLS_3.slots.default;
const __VLS_4 = {}.VCol;
/** @type {[typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ]} */ ;
// @ts-ignore
const __VLS_5 = __VLS_asFunctionalComponent(__VLS_4, new __VLS_4({
    cols: "12",
    ...{ class: "d-flex justify-center pb-4" },
}));
const __VLS_6 = __VLS_5({
    cols: "12",
    ...{ class: "d-flex justify-center pb-4" },
}, ...__VLS_functionalComponentArgsRest(__VLS_5));
__VLS_7.slots.default;
const __VLS_8 = {}.VBtn;
/** @type {[typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ]} */ ;
// @ts-ignore
const __VLS_9 = __VLS_asFunctionalComponent(__VLS_8, new __VLS_8({
    ...{ 'onClick': {} },
    variant: "elevated",
    color: "primary",
    disabled: (!__VLS_ctx.isLoaded),
}));
const __VLS_10 = __VLS_9({
    ...{ 'onClick': {} },
    variant: "elevated",
    color: "primary",
    disabled: (!__VLS_ctx.isLoaded),
}, ...__VLS_functionalComponentArgsRest(__VLS_9));
let __VLS_12;
let __VLS_13;
let __VLS_14;
const __VLS_15 = {
    onClick: (__VLS_ctx.saveAndGoBack)
};
__VLS_11.slots.default;
(__VLS_ctx.t("Save Changes"));
var __VLS_11;
var __VLS_7;
var __VLS_3;
/** @type {[typeof HeroSavePut, ]} */ ;
// @ts-ignore
const __VLS_16 = __VLS_asFunctionalComponent(HeroSavePut, new HeroSavePut({
    ...{ 'onSuccess': {} },
    ...{ 'onFail': {} },
    ref: "heroSavePutRef",
    campaignId: (__VLS_ctx.campaignId),
    heroId: (__VLS_ctx.heroId),
    ...{ style: {} },
}));
const __VLS_17 = __VLS_16({
    ...{ 'onSuccess': {} },
    ...{ 'onFail': {} },
    ref: "heroSavePutRef",
    campaignId: (__VLS_ctx.campaignId),
    heroId: (__VLS_ctx.heroId),
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_16));
let __VLS_19;
let __VLS_20;
let __VLS_21;
const __VLS_22 = {
    onSuccess: (__VLS_ctx.onSaveSuccess)
};
const __VLS_23 = {
    onFail: (__VLS_ctx.onSaveFail)
};
/** @type {typeof __VLS_ctx.heroSavePutRef} */ ;
var __VLS_24 = {};
var __VLS_18;
if (!__VLS_ctx.isLoaded) {
    const __VLS_26 = {}.VRow;
    /** @type {[typeof __VLS_components.VRow, typeof __VLS_components.vRow, typeof __VLS_components.VRow, typeof __VLS_components.vRow, ]} */ ;
    // @ts-ignore
    const __VLS_27 = __VLS_asFunctionalComponent(__VLS_26, new __VLS_26({
        noGutters: true,
    }));
    const __VLS_28 = __VLS_27({
        noGutters: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_27));
    __VLS_29.slots.default;
    const __VLS_30 = {}.VCol;
    /** @type {[typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ]} */ ;
    // @ts-ignore
    const __VLS_31 = __VLS_asFunctionalComponent(__VLS_30, new __VLS_30({
        cols: "12",
        ...{ class: "d-flex justify-center align-center" },
        ...{ style: {} },
    }));
    const __VLS_32 = __VLS_31({
        cols: "12",
        ...{ class: "d-flex justify-center align-center" },
        ...{ style: {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_31));
    __VLS_33.slots.default;
    const __VLS_34 = {}.VProgressCircular;
    /** @type {[typeof __VLS_components.VProgressCircular, typeof __VLS_components.vProgressCircular, ]} */ ;
    // @ts-ignore
    const __VLS_35 = __VLS_asFunctionalComponent(__VLS_34, new __VLS_34({
        indeterminate: true,
        color: "primary",
        size: "64",
    }));
    const __VLS_36 = __VLS_35({
        indeterminate: true,
        color: "primary",
        size: "64",
    }, ...__VLS_functionalComponentArgsRest(__VLS_35));
    var __VLS_33;
    var __VLS_29;
}
else {
    const __VLS_38 = {}.VRow;
    /** @type {[typeof __VLS_components.VRow, typeof __VLS_components.vRow, typeof __VLS_components.VRow, typeof __VLS_components.vRow, ]} */ ;
    // @ts-ignore
    const __VLS_39 = __VLS_asFunctionalComponent(__VLS_38, new __VLS_38({
        noGutters: true,
    }));
    const __VLS_40 = __VLS_39({
        noGutters: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_39));
    __VLS_41.slots.default;
    const __VLS_42 = {}.VCol;
    /** @type {[typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ]} */ ;
    // @ts-ignore
    const __VLS_43 = __VLS_asFunctionalComponent(__VLS_42, new __VLS_42({
        cols: "12",
        ...{ class: "d-flex align-center justify-center" },
    }));
    const __VLS_44 = __VLS_43({
        cols: "12",
        ...{ class: "d-flex align-center justify-center" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_43));
    __VLS_45.slots.default;
    const __VLS_46 = {}.VCard;
    /** @type {[typeof __VLS_components.VCard, typeof __VLS_components.vCard, typeof __VLS_components.VCard, typeof __VLS_components.vCard, ]} */ ;
    // @ts-ignore
    const __VLS_47 = __VLS_asFunctionalComponent(__VLS_46, new __VLS_46({
        elevation: "16",
        rounded: true,
        ...{ style: {} },
        width: "800px",
        ...{ class: "hero-list-item rounded-t-xl" },
    }));
    const __VLS_48 = __VLS_47({
        elevation: "16",
        rounded: true,
        ...{ style: {} },
        width: "800px",
        ...{ class: "hero-list-item rounded-t-xl" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_47));
    __VLS_49.slots.default;
    const __VLS_50 = {}.VImg;
    /** @type {[typeof __VLS_components.VImg, typeof __VLS_components.vImg, ]} */ ;
    // @ts-ignore
    const __VLS_51 = __VLS_asFunctionalComponent(__VLS_50, new __VLS_50({
        src: (__VLS_ctx.hero?.images?.trackerInfo),
        ...{ class: "rounded-0" },
        contain: true,
    }));
    const __VLS_52 = __VLS_51({
        src: (__VLS_ctx.hero?.images?.trackerInfo),
        ...{ class: "rounded-0" },
        contain: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_51));
    const __VLS_54 = {}.VCardActions;
    /** @type {[typeof __VLS_components.VCardActions, typeof __VLS_components.vCardActions, typeof __VLS_components.VCardActions, typeof __VLS_components.vCardActions, ]} */ ;
    // @ts-ignore
    const __VLS_55 = __VLS_asFunctionalComponent(__VLS_54, new __VLS_54({}));
    const __VLS_56 = __VLS_55({}, ...__VLS_functionalComponentArgsRest(__VLS_55));
    __VLS_57.slots.default;
    const __VLS_58 = {}.VRow;
    /** @type {[typeof __VLS_components.VRow, typeof __VLS_components.vRow, typeof __VLS_components.VRow, typeof __VLS_components.vRow, ]} */ ;
    // @ts-ignore
    const __VLS_59 = __VLS_asFunctionalComponent(__VLS_58, new __VLS_58({
        noGutters: true,
        ...{ class: "px-6" },
    }));
    const __VLS_60 = __VLS_59({
        noGutters: true,
        ...{ class: "px-6" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_59));
    __VLS_61.slots.default;
    const __VLS_62 = {}.VCol;
    /** @type {[typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ]} */ ;
    // @ts-ignore
    const __VLS_63 = __VLS_asFunctionalComponent(__VLS_62, new __VLS_62({
        cols: "12",
    }));
    const __VLS_64 = __VLS_63({
        cols: "12",
    }, ...__VLS_functionalComponentArgsRest(__VLS_63));
    __VLS_65.slots.default;
    const __VLS_66 = {}.VDivider;
    /** @type {[typeof __VLS_components.VDivider, typeof __VLS_components.vDivider, typeof __VLS_components.VDivider, typeof __VLS_components.vDivider, ]} */ ;
    // @ts-ignore
    const __VLS_67 = __VLS_asFunctionalComponent(__VLS_66, new __VLS_66({}));
    const __VLS_68 = __VLS_67({}, ...__VLS_functionalComponentArgsRest(__VLS_67));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "text-center text-h5" },
    });
    (__VLS_ctx.t("label.equipment"));
    /** @type {[typeof CampaignHeroItems, ]} */ ;
    // @ts-ignore
    const __VLS_70 = __VLS_asFunctionalComponent(CampaignHeroItems, new CampaignHeroItems({
        ...{ 'onStash': {} },
        campaignId: (__VLS_ctx.campaignId),
        heroId: (__VLS_ctx.heroId),
        repository: (__VLS_ctx.repository),
        hero: (__VLS_ctx.hero),
    }));
    const __VLS_71 = __VLS_70({
        ...{ 'onStash': {} },
        campaignId: (__VLS_ctx.campaignId),
        heroId: (__VLS_ctx.heroId),
        repository: (__VLS_ctx.repository),
        hero: (__VLS_ctx.hero),
    }, ...__VLS_functionalComponentArgsRest(__VLS_70));
    let __VLS_73;
    let __VLS_74;
    let __VLS_75;
    const __VLS_76 = {
        onStash: (__VLS_ctx.onStash)
    };
    var __VLS_72;
    var __VLS_65;
    const __VLS_77 = {}.VCol;
    /** @type {[typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ]} */ ;
    // @ts-ignore
    const __VLS_78 = __VLS_asFunctionalComponent(__VLS_77, new __VLS_77({
        cols: "12",
    }));
    const __VLS_79 = __VLS_78({
        cols: "12",
    }, ...__VLS_functionalComponentArgsRest(__VLS_78));
    __VLS_80.slots.default;
    const __VLS_81 = {}.VDivider;
    /** @type {[typeof __VLS_components.VDivider, typeof __VLS_components.vDivider, typeof __VLS_components.VDivider, typeof __VLS_components.vDivider, ]} */ ;
    // @ts-ignore
    const __VLS_82 = __VLS_asFunctionalComponent(__VLS_81, new __VLS_81({}));
    const __VLS_83 = __VLS_82({}, ...__VLS_functionalComponentArgsRest(__VLS_82));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "text-center text-h5" },
    });
    (__VLS_ctx.t("label.stash"));
    /** @type {[typeof CampaignHeroStash, ]} */ ;
    // @ts-ignore
    const __VLS_85 = __VLS_asFunctionalComponent(CampaignHeroStash, new CampaignHeroStash({
        campaignId: (__VLS_ctx.campaignId),
        repository: (__VLS_ctx.repository),
        heroId: (__VLS_ctx.heroId),
        key: (__VLS_ctx.stash),
        ...{ class: "px-2" },
    }));
    const __VLS_86 = __VLS_85({
        campaignId: (__VLS_ctx.campaignId),
        repository: (__VLS_ctx.repository),
        heroId: (__VLS_ctx.heroId),
        key: (__VLS_ctx.stash),
        ...{ class: "px-2" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_85));
    var __VLS_80;
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
    const __VLS_92 = {}.VDivider;
    /** @type {[typeof __VLS_components.VDivider, typeof __VLS_components.vDivider, typeof __VLS_components.VDivider, typeof __VLS_components.vDivider, ]} */ ;
    // @ts-ignore
    const __VLS_93 = __VLS_asFunctionalComponent(__VLS_92, new __VLS_92({}));
    const __VLS_94 = __VLS_93({}, ...__VLS_functionalComponentArgsRest(__VLS_93));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "text-center text-h5" },
    });
    (__VLS_ctx.t("label.skills"));
    /** @type {[typeof CampaignHeroSkills, typeof CampaignHeroSkills, ]} */ ;
    // @ts-ignore
    const __VLS_96 = __VLS_asFunctionalComponent(CampaignHeroSkills, new CampaignHeroSkills({
        campaignId: (__VLS_ctx.campaignId),
        heroId: (__VLS_ctx.heroId),
        campaign: (__VLS_ctx.campaign),
        hero: (__VLS_ctx.hero),
    }));
    const __VLS_97 = __VLS_96({
        campaignId: (__VLS_ctx.campaignId),
        heroId: (__VLS_ctx.heroId),
        campaign: (__VLS_ctx.campaign),
        hero: (__VLS_ctx.hero),
    }, ...__VLS_functionalComponentArgsRest(__VLS_96));
    var __VLS_91;
    const __VLS_99 = {}.VCol;
    /** @type {[typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ]} */ ;
    // @ts-ignore
    const __VLS_100 = __VLS_asFunctionalComponent(__VLS_99, new __VLS_99({
        cols: "12",
    }));
    const __VLS_101 = __VLS_100({
        cols: "12",
    }, ...__VLS_functionalComponentArgsRest(__VLS_100));
    __VLS_102.slots.default;
    const __VLS_103 = {}.VDivider;
    /** @type {[typeof __VLS_components.VDivider, typeof __VLS_components.vDivider, typeof __VLS_components.VDivider, typeof __VLS_components.vDivider, ]} */ ;
    // @ts-ignore
    const __VLS_104 = __VLS_asFunctionalComponent(__VLS_103, new __VLS_103({}));
    const __VLS_105 = __VLS_104({}, ...__VLS_functionalComponentArgsRest(__VLS_104));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "text-center text-h5 pt-4 pb-2" },
    });
    (__VLS_ctx.t("label.class-abilities", "Class Abilities"));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "d-flex flex-wrap justify-center align-center pa-2 mb-2" },
        ...{ style: {} },
    });
    for (const [n] of __VLS_getVForSourceType((8))) {
        const __VLS_107 = {}.VChip;
        /** @type {[typeof __VLS_components.VChip, typeof __VLS_components.vChip, typeof __VLS_components.VChip, typeof __VLS_components.vChip, ]} */ ;
        // @ts-ignore
        const __VLS_108 = __VLS_asFunctionalComponent(__VLS_107, new __VLS_107({
            ...{ 'onClick': {} },
            key: (n),
            variant: (n <= __VLS_ctx.localClassAbilityCount ? 'elevated' : 'outlined'),
            color: (n <= __VLS_ctx.localClassAbilityCount ? 'amber-darken-2' : 'default'),
            size: "large",
            ...{ style: {} },
        }));
        const __VLS_109 = __VLS_108({
            ...{ 'onClick': {} },
            key: (n),
            variant: (n <= __VLS_ctx.localClassAbilityCount ? 'elevated' : 'outlined'),
            color: (n <= __VLS_ctx.localClassAbilityCount ? 'amber-darken-2' : 'default'),
            size: "large",
            ...{ style: {} },
        }, ...__VLS_functionalComponentArgsRest(__VLS_108));
        let __VLS_111;
        let __VLS_112;
        let __VLS_113;
        const __VLS_114 = {
            onClick: (...[$event]) => {
                if (!!(!__VLS_ctx.isLoaded))
                    return;
                __VLS_ctx.setAbilityCount(n);
            }
        };
        __VLS_110.slots.default;
        const __VLS_115 = {}.VIcon;
        /** @type {[typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, ]} */ ;
        // @ts-ignore
        const __VLS_116 = __VLS_asFunctionalComponent(__VLS_115, new __VLS_115({
            icon: (n <= __VLS_ctx.localClassAbilityCount
                ? 'mdi-star-circle'
                : 'mdi-circle-outline'),
        }));
        const __VLS_117 = __VLS_116({
            icon: (n <= __VLS_ctx.localClassAbilityCount
                ? 'mdi-star-circle'
                : 'mdi-circle-outline'),
        }, ...__VLS_functionalComponentArgsRest(__VLS_116));
        var __VLS_110;
    }
    var __VLS_102;
    var __VLS_61;
    var __VLS_57;
    var __VLS_49;
    var __VLS_45;
    var __VLS_41;
}
if (__VLS_ctx.isLoaded) {
    const __VLS_119 = {}.VRow;
    /** @type {[typeof __VLS_components.VRow, typeof __VLS_components.vRow, typeof __VLS_components.VRow, typeof __VLS_components.vRow, ]} */ ;
    // @ts-ignore
    const __VLS_120 = __VLS_asFunctionalComponent(__VLS_119, new __VLS_119({
        noGutters: true,
        ...{ class: "pt-6" },
    }));
    const __VLS_121 = __VLS_120({
        noGutters: true,
        ...{ class: "pt-6" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_120));
    __VLS_122.slots.default;
    const __VLS_123 = {}.VCol;
    /** @type {[typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ]} */ ;
    // @ts-ignore
    const __VLS_124 = __VLS_asFunctionalComponent(__VLS_123, new __VLS_123({
        cols: "12",
        ...{ class: "d-flex justify-center pb-4" },
    }));
    const __VLS_125 = __VLS_124({
        cols: "12",
        ...{ class: "d-flex justify-center pb-4" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_124));
    __VLS_126.slots.default;
    const __VLS_127 = {}.VBtn;
    /** @type {[typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ]} */ ;
    // @ts-ignore
    const __VLS_128 = __VLS_asFunctionalComponent(__VLS_127, new __VLS_127({
        ...{ 'onClick': {} },
        variant: "elevated",
        color: "primary",
    }));
    const __VLS_129 = __VLS_128({
        ...{ 'onClick': {} },
        variant: "elevated",
        color: "primary",
    }, ...__VLS_functionalComponentArgsRest(__VLS_128));
    let __VLS_131;
    let __VLS_132;
    let __VLS_133;
    const __VLS_134 = {
        onClick: (__VLS_ctx.saveAndGoBack)
    };
    __VLS_130.slots.default;
    (__VLS_ctx.t("Save Changes"));
    var __VLS_130;
    var __VLS_126;
    var __VLS_122;
}
const __VLS_135 = {}.VSnackbar;
/** @type {[typeof __VLS_components.VSnackbar, typeof __VLS_components.vSnackbar, typeof __VLS_components.VSnackbar, typeof __VLS_components.vSnackbar, ]} */ ;
// @ts-ignore
const __VLS_136 = __VLS_asFunctionalComponent(__VLS_135, new __VLS_135({
    modelValue: (__VLS_ctx.snackbarVisible),
    timeout: (__VLS_ctx.snackbarTimeout),
    color: (__VLS_ctx.snackbarColor),
    location: "top",
}));
const __VLS_137 = __VLS_136({
    modelValue: (__VLS_ctx.snackbarVisible),
    timeout: (__VLS_ctx.snackbarTimeout),
    color: (__VLS_ctx.snackbarColor),
    location: "top",
}, ...__VLS_functionalComponentArgsRest(__VLS_136));
__VLS_138.slots.default;
(__VLS_ctx.snackbarText);
var __VLS_138;
/** @type {__VLS_StyleScopedClasses['pt-6']} */ ;
/** @type {__VLS_StyleScopedClasses['d-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['pb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['d-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['align-center']} */ ;
/** @type {__VLS_StyleScopedClasses['d-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['align-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['hero-list-item']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-t-xl']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-0']} */ ;
/** @type {__VLS_StyleScopedClasses['px-6']} */ ;
/** @type {__VLS_StyleScopedClasses['text-center']} */ ;
/** @type {__VLS_StyleScopedClasses['text-h5']} */ ;
/** @type {__VLS_StyleScopedClasses['text-center']} */ ;
/** @type {__VLS_StyleScopedClasses['text-h5']} */ ;
/** @type {__VLS_StyleScopedClasses['px-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-center']} */ ;
/** @type {__VLS_StyleScopedClasses['text-h5']} */ ;
/** @type {__VLS_StyleScopedClasses['text-center']} */ ;
/** @type {__VLS_StyleScopedClasses['text-h5']} */ ;
/** @type {__VLS_StyleScopedClasses['pt-4']} */ ;
/** @type {__VLS_StyleScopedClasses['pb-2']} */ ;
/** @type {__VLS_StyleScopedClasses['d-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-wrap']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['align-center']} */ ;
/** @type {__VLS_StyleScopedClasses['pa-2']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-2']} */ ;
/** @type {__VLS_StyleScopedClasses['pt-6']} */ ;
/** @type {__VLS_StyleScopedClasses['d-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['pb-4']} */ ;
// @ts-ignore
var __VLS_25 = __VLS_24;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            CampaignHeroItems: CampaignHeroItems,
            CampaignHeroStash: CampaignHeroStash,
            CampaignHeroSkills: CampaignHeroSkills,
            HeroSavePut: HeroSavePut,
            t: t,
            heroSavePutRef: heroSavePutRef,
            heroId: heroId,
            campaignId: campaignId,
            isLoaded: isLoaded,
            campaign: campaign,
            hero: hero,
            repository: repository,
            localClassAbilityCount: localClassAbilityCount,
            stash: stash,
            snackbarVisible: snackbarVisible,
            snackbarText: snackbarText,
            snackbarColor: snackbarColor,
            snackbarTimeout: snackbarTimeout,
            setAbilityCount: setAbilityCount,
            onStash: onStash,
            onSaveSuccess: onSaveSuccess,
            onSaveFail: onSaveFail,
            saveAndGoBack: saveAndGoBack,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
