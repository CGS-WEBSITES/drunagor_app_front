/// <reference types="../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { CampaignStore } from "@/store/CampaignStore";
import { HeroStore } from "@/store/HeroStore";
import { SequentialAdventureState, RESOURCE_DEFINITIONS } from "@/store/Hero";
import { HeroDataRepository } from "@/data/repository/HeroDataRepository";
import { CampaignLoadFromStorage } from "@/utils/CampaignLoadFromStorage";
import HeroSavePut from "@/components/HeroSavePut.vue";
const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const campaignStore = CampaignStore();
const heroStore = HeroStore();
const heroDataRepository = new HeroDataRepository();
const heroId = route.params.heroId.toString();
const campaignId = route.params.campaignId.toString();
const heroSavePutRef = ref();
const isLoaded = ref(false);
const isSaving = ref(false);
const heroStaticData = ref(null);
const campaignHeroRef = ref(null);
const snackbarVisible = ref(false);
const snackbarText = ref("");
const snackbarColor = ref("success");
const snackbarTimeout = ref(3000);
const localState = ref({
    lifepoints: 0,
    curseCubes: 0,
    traumaCubes: 0,
    availableCubes: 0,
    usedCubes: 0,
    resources: {},
});
RESOURCE_DEFINITIONS.forEach((resource) => {
    localState.value.resources[resource.id] = 0;
});
function showSnackbar(text, color = "success") {
    snackbarText.value = text;
    snackbarColor.value = color;
    snackbarVisible.value = true;
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
    if (!campaignHeroRef.value)
        return;
    if (!campaignHeroRef.value.sequentialAdventureState) {
        campaignHeroRef.value.sequentialAdventureState =
            new SequentialAdventureState();
    }
    campaignHeroRef.value.sequentialAdventureState.lifepoints =
        Number(localState.value.lifepoints) || 0;
    campaignHeroRef.value.sequentialAdventureState.curseCubes =
        Number(localState.value.curseCubes) || 0;
    campaignHeroRef.value.sequentialAdventureState.traumaCubes =
        Number(localState.value.traumaCubes) || 0;
    campaignHeroRef.value.sequentialAdventureState.availableCubes =
        Number(localState.value.availableCubes) || 0;
    campaignHeroRef.value.sequentialAdventureState.usedCubes =
        Number(localState.value.usedCubes) || 0;
    Object.keys(localState.value.resources).forEach((key) => {
        campaignHeroRef.value.sequentialAdventureState.resources[key] =
            Number(localState.value.resources[key]) || 0;
    });
}
const onSaveSuccess = () => {
    isSaving.value = false;
    snackbarText.value = "Resources saved successfully!";
    snackbarColor.value = "success";
    snackbarVisible.value = true;
    setTimeout(() => {
        navigateBack();
    }, 1000);
};
const onSaveFail = () => {
    isSaving.value = false;
    snackbarText.value = "Failed to save resources.";
    snackbarColor.value = "error";
    snackbarVisible.value = true;
};
function saveAndGoBack() {
    syncStateToStore();
    isSaving.value = true;
    if (heroSavePutRef.value && heroSavePutRef.value.save) {
        heroSavePutRef.value.save().catch((error) => {
            console.error("Error saving:", error);
            onSaveFail();
        });
    }
    else {
        isSaving.value = false;
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
        const updatedHero = heroStore.findInCampaignOptional(heroId, campaignId);
        if (updatedHero) {
            campaignHeroRef.value = updatedHero;
            heroStaticData.value = heroDataRepository.find(heroId) ?? null;
            if (!updatedHero.sequentialAdventureState) {
                updatedHero.sequentialAdventureState = new SequentialAdventureState();
            }
            if (!updatedHero.sequentialAdventureState.resources) {
                updatedHero.sequentialAdventureState.resources = {};
            }
            RESOURCE_DEFINITIONS.forEach((resource) => {
                if (updatedHero.sequentialAdventureState.resources[resource.id] ===
                    undefined) {
                    updatedHero.sequentialAdventureState.resources[resource.id] = 0;
                }
            });
            localState.value = {
                lifepoints: updatedHero.sequentialAdventureState.lifepoints || 0,
                curseCubes: updatedHero.sequentialAdventureState.curseCubes || 0,
                traumaCubes: updatedHero.sequentialAdventureState.traumaCubes || 0,
                availableCubes: updatedHero.sequentialAdventureState.availableCubes || 0,
                usedCubes: updatedHero.sequentialAdventureState.usedCubes || 0,
                resources: { ...updatedHero.sequentialAdventureState.resources },
            };
        }
        else {
            console.error(`Hero ${heroId} not found in campaign ${campaignId}`);
            showSnackbar("Hero not found in this campaign.", "error");
        }
    }
    catch (error) {
        console.error("Error loading hero data:", error);
        showSnackbar("Error loading hero data.", "error");
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
    loading: (__VLS_ctx.isSaving),
}));
const __VLS_10 = __VLS_9({
    ...{ 'onClick': {} },
    variant: "elevated",
    color: "primary",
    disabled: (!__VLS_ctx.isLoaded),
    loading: (__VLS_ctx.isSaving),
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
    if (__VLS_ctx.heroStaticData?.images?.trackerInfo) {
        const __VLS_50 = {}.VImg;
        /** @type {[typeof __VLS_components.VImg, typeof __VLS_components.vImg, ]} */ ;
        // @ts-ignore
        const __VLS_51 = __VLS_asFunctionalComponent(__VLS_50, new __VLS_50({
            src: (__VLS_ctx.heroStaticData.images.trackerInfo),
            ...{ class: "rounded-0" },
            contain: true,
        }));
        const __VLS_52 = __VLS_51({
            src: (__VLS_ctx.heroStaticData.images.trackerInfo),
            ...{ class: "rounded-0" },
            contain: true,
        }, ...__VLS_functionalComponentArgsRest(__VLS_51));
    }
    const __VLS_54 = {}.VCardText;
    /** @type {[typeof __VLS_components.VCardText, typeof __VLS_components.vCardText, typeof __VLS_components.VCardText, typeof __VLS_components.vCardText, ]} */ ;
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
        ...{ class: "py-4" },
    }));
    const __VLS_64 = __VLS_63({
        cols: "12",
        ...{ class: "py-4" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_63));
    __VLS_65.slots.default;
    const __VLS_66 = {}.VNumberInput;
    /** @type {[typeof __VLS_components.VNumberInput, typeof __VLS_components.vNumberInput, typeof __VLS_components.VNumberInput, typeof __VLS_components.vNumberInput, ]} */ ;
    // @ts-ignore
    const __VLS_67 = __VLS_asFunctionalComponent(__VLS_66, new __VLS_66({
        modelValue: (__VLS_ctx.localState.lifepoints),
        label: (__VLS_ctx.t('label.lifepoints', 'Life Points')),
        min: (0),
        max: (99),
        variant: "outlined",
        controlVariant: "split",
    }));
    const __VLS_68 = __VLS_67({
        modelValue: (__VLS_ctx.localState.lifepoints),
        label: (__VLS_ctx.t('label.lifepoints', 'Life Points')),
        min: (0),
        max: (99),
        variant: "outlined",
        controlVariant: "split",
    }, ...__VLS_functionalComponentArgsRest(__VLS_67));
    __VLS_69.slots.default;
    {
        const { 'prepend-inner': __VLS_thisSlot } = __VLS_69.slots;
        const __VLS_70 = {}.VIcon;
        /** @type {[typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, ]} */ ;
        // @ts-ignore
        const __VLS_71 = __VLS_asFunctionalComponent(__VLS_70, new __VLS_70({
            color: "red-lighten-2",
        }));
        const __VLS_72 = __VLS_71({
            color: "red-lighten-2",
        }, ...__VLS_functionalComponentArgsRest(__VLS_71));
        __VLS_73.slots.default;
        var __VLS_73;
    }
    var __VLS_69;
    var __VLS_65;
    const __VLS_74 = {}.VCol;
    /** @type {[typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ]} */ ;
    // @ts-ignore
    const __VLS_75 = __VLS_asFunctionalComponent(__VLS_74, new __VLS_74({
        cols: "12",
        ...{ class: "py-3" },
    }));
    const __VLS_76 = __VLS_75({
        cols: "12",
        ...{ class: "py-3" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_75));
    __VLS_77.slots.default;
    const __VLS_78 = {}.VNumberInput;
    /** @type {[typeof __VLS_components.VNumberInput, typeof __VLS_components.vNumberInput, typeof __VLS_components.VNumberInput, typeof __VLS_components.vNumberInput, ]} */ ;
    // @ts-ignore
    const __VLS_79 = __VLS_asFunctionalComponent(__VLS_78, new __VLS_78({
        modelValue: (__VLS_ctx.localState.curseCubes),
        label: (__VLS_ctx.t('text.curse-cubes')),
        min: (0),
        max: (5),
        variant: "outlined",
        controlVariant: "split",
    }));
    const __VLS_80 = __VLS_79({
        modelValue: (__VLS_ctx.localState.curseCubes),
        label: (__VLS_ctx.t('text.curse-cubes')),
        min: (0),
        max: (5),
        variant: "outlined",
        controlVariant: "split",
    }, ...__VLS_functionalComponentArgsRest(__VLS_79));
    __VLS_81.slots.default;
    {
        const { 'prepend-inner': __VLS_thisSlot } = __VLS_81.slots;
        const __VLS_82 = {}.VIcon;
        /** @type {[typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, ]} */ ;
        // @ts-ignore
        const __VLS_83 = __VLS_asFunctionalComponent(__VLS_82, new __VLS_82({
            color: "grey-darken-1",
        }));
        const __VLS_84 = __VLS_83({
            color: "grey-darken-1",
        }, ...__VLS_functionalComponentArgsRest(__VLS_83));
        __VLS_85.slots.default;
        var __VLS_85;
    }
    var __VLS_81;
    var __VLS_77;
    const __VLS_86 = {}.VCol;
    /** @type {[typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ]} */ ;
    // @ts-ignore
    const __VLS_87 = __VLS_asFunctionalComponent(__VLS_86, new __VLS_86({
        cols: "12",
        ...{ class: "py-3" },
    }));
    const __VLS_88 = __VLS_87({
        cols: "12",
        ...{ class: "py-3" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_87));
    __VLS_89.slots.default;
    const __VLS_90 = {}.VNumberInput;
    /** @type {[typeof __VLS_components.VNumberInput, typeof __VLS_components.vNumberInput, typeof __VLS_components.VNumberInput, typeof __VLS_components.vNumberInput, ]} */ ;
    // @ts-ignore
    const __VLS_91 = __VLS_asFunctionalComponent(__VLS_90, new __VLS_90({
        modelValue: (__VLS_ctx.localState.traumaCubes),
        label: (__VLS_ctx.t('text.trauma-cubes')),
        min: (0),
        max: (1),
        variant: "outlined",
        controlVariant: "split",
    }));
    const __VLS_92 = __VLS_91({
        modelValue: (__VLS_ctx.localState.traumaCubes),
        label: (__VLS_ctx.t('text.trauma-cubes')),
        min: (0),
        max: (1),
        variant: "outlined",
        controlVariant: "split",
    }, ...__VLS_functionalComponentArgsRest(__VLS_91));
    __VLS_93.slots.default;
    {
        const { 'prepend-inner': __VLS_thisSlot } = __VLS_93.slots;
        const __VLS_94 = {}.VIcon;
        /** @type {[typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, ]} */ ;
        // @ts-ignore
        const __VLS_95 = __VLS_asFunctionalComponent(__VLS_94, new __VLS_94({
            color: "purple-lighten-2",
        }));
        const __VLS_96 = __VLS_95({
            color: "purple-lighten-2",
        }, ...__VLS_functionalComponentArgsRest(__VLS_95));
        __VLS_97.slots.default;
        var __VLS_97;
    }
    var __VLS_93;
    var __VLS_89;
    const __VLS_98 = {}.VCol;
    /** @type {[typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ]} */ ;
    // @ts-ignore
    const __VLS_99 = __VLS_asFunctionalComponent(__VLS_98, new __VLS_98({
        cols: "12",
        ...{ class: "py-3" },
    }));
    const __VLS_100 = __VLS_99({
        cols: "12",
        ...{ class: "py-3" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_99));
    __VLS_101.slots.default;
    const __VLS_102 = {}.VNumberInput;
    /** @type {[typeof __VLS_components.VNumberInput, typeof __VLS_components.vNumberInput, typeof __VLS_components.VNumberInput, typeof __VLS_components.vNumberInput, ]} */ ;
    // @ts-ignore
    const __VLS_103 = __VLS_asFunctionalComponent(__VLS_102, new __VLS_102({
        modelValue: (__VLS_ctx.localState.availableCubes),
        label: "Available Cubes",
        min: (0),
        max: (20),
        variant: "outlined",
        controlVariant: "split",
    }));
    const __VLS_104 = __VLS_103({
        modelValue: (__VLS_ctx.localState.availableCubes),
        label: "Available Cubes",
        min: (0),
        max: (20),
        variant: "outlined",
        controlVariant: "split",
    }, ...__VLS_functionalComponentArgsRest(__VLS_103));
    __VLS_105.slots.default;
    {
        const { 'prepend-inner': __VLS_thisSlot } = __VLS_105.slots;
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "d-flex align-center mr-2" },
        });
        const __VLS_106 = {}.VIcon;
        /** @type {[typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, ]} */ ;
        // @ts-ignore
        const __VLS_107 = __VLS_asFunctionalComponent(__VLS_106, new __VLS_106({
            size: "x-small",
            color: "yellow-darken-2",
        }));
        const __VLS_108 = __VLS_107({
            size: "x-small",
            color: "yellow-darken-2",
        }, ...__VLS_functionalComponentArgsRest(__VLS_107));
        __VLS_109.slots.default;
        var __VLS_109;
        const __VLS_110 = {}.VIcon;
        /** @type {[typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, ]} */ ;
        // @ts-ignore
        const __VLS_111 = __VLS_asFunctionalComponent(__VLS_110, new __VLS_110({
            size: "x-small",
            color: "red-darken-2",
        }));
        const __VLS_112 = __VLS_111({
            size: "x-small",
            color: "red-darken-2",
        }, ...__VLS_functionalComponentArgsRest(__VLS_111));
        __VLS_113.slots.default;
        var __VLS_113;
        const __VLS_114 = {}.VIcon;
        /** @type {[typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, ]} */ ;
        // @ts-ignore
        const __VLS_115 = __VLS_asFunctionalComponent(__VLS_114, new __VLS_114({
            size: "x-small",
            color: "green-darken-2",
        }));
        const __VLS_116 = __VLS_115({
            size: "x-small",
            color: "green-darken-2",
        }, ...__VLS_functionalComponentArgsRest(__VLS_115));
        __VLS_117.slots.default;
        var __VLS_117;
        const __VLS_118 = {}.VIcon;
        /** @type {[typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, ]} */ ;
        // @ts-ignore
        const __VLS_119 = __VLS_asFunctionalComponent(__VLS_118, new __VLS_118({
            size: "x-small",
            color: "blue-darken-2",
        }));
        const __VLS_120 = __VLS_119({
            size: "x-small",
            color: "blue-darken-2",
        }, ...__VLS_functionalComponentArgsRest(__VLS_119));
        __VLS_121.slots.default;
        var __VLS_121;
    }
    var __VLS_105;
    var __VLS_101;
    const __VLS_122 = {}.VCol;
    /** @type {[typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ]} */ ;
    // @ts-ignore
    const __VLS_123 = __VLS_asFunctionalComponent(__VLS_122, new __VLS_122({
        cols: "12",
        ...{ class: "py-3" },
    }));
    const __VLS_124 = __VLS_123({
        cols: "12",
        ...{ class: "py-3" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_123));
    __VLS_125.slots.default;
    const __VLS_126 = {}.VNumberInput;
    /** @type {[typeof __VLS_components.VNumberInput, typeof __VLS_components.vNumberInput, typeof __VLS_components.VNumberInput, typeof __VLS_components.vNumberInput, ]} */ ;
    // @ts-ignore
    const __VLS_127 = __VLS_asFunctionalComponent(__VLS_126, new __VLS_126({
        modelValue: (__VLS_ctx.localState.usedCubes),
        label: "Used Cubes",
        min: (0),
        max: (20),
        variant: "outlined",
        controlVariant: "split",
    }));
    const __VLS_128 = __VLS_127({
        modelValue: (__VLS_ctx.localState.usedCubes),
        label: "Used Cubes",
        min: (0),
        max: (20),
        variant: "outlined",
        controlVariant: "split",
    }, ...__VLS_functionalComponentArgsRest(__VLS_127));
    __VLS_129.slots.default;
    {
        const { 'prepend-inner': __VLS_thisSlot } = __VLS_129.slots;
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "faded-cubes d-flex align-center mr-2" },
        });
        const __VLS_130 = {}.VIcon;
        /** @type {[typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, ]} */ ;
        // @ts-ignore
        const __VLS_131 = __VLS_asFunctionalComponent(__VLS_130, new __VLS_130({
            size: "x-small",
            color: "yellow-darken-2",
        }));
        const __VLS_132 = __VLS_131({
            size: "x-small",
            color: "yellow-darken-2",
        }, ...__VLS_functionalComponentArgsRest(__VLS_131));
        __VLS_133.slots.default;
        var __VLS_133;
        const __VLS_134 = {}.VIcon;
        /** @type {[typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, ]} */ ;
        // @ts-ignore
        const __VLS_135 = __VLS_asFunctionalComponent(__VLS_134, new __VLS_134({
            size: "x-small",
            color: "red-darken-2",
        }));
        const __VLS_136 = __VLS_135({
            size: "x-small",
            color: "red-darken-2",
        }, ...__VLS_functionalComponentArgsRest(__VLS_135));
        __VLS_137.slots.default;
        var __VLS_137;
        const __VLS_138 = {}.VIcon;
        /** @type {[typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, ]} */ ;
        // @ts-ignore
        const __VLS_139 = __VLS_asFunctionalComponent(__VLS_138, new __VLS_138({
            size: "x-small",
            color: "green-darken-2",
        }));
        const __VLS_140 = __VLS_139({
            size: "x-small",
            color: "green-darken-2",
        }, ...__VLS_functionalComponentArgsRest(__VLS_139));
        __VLS_141.slots.default;
        var __VLS_141;
        const __VLS_142 = {}.VIcon;
        /** @type {[typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, ]} */ ;
        // @ts-ignore
        const __VLS_143 = __VLS_asFunctionalComponent(__VLS_142, new __VLS_142({
            size: "x-small",
            color: "blue-darken-2",
        }));
        const __VLS_144 = __VLS_143({
            size: "x-small",
            color: "blue-darken-2",
        }, ...__VLS_functionalComponentArgsRest(__VLS_143));
        __VLS_145.slots.default;
        var __VLS_145;
    }
    var __VLS_129;
    var __VLS_125;
    const __VLS_146 = {}.VCol;
    /** @type {[typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ]} */ ;
    // @ts-ignore
    const __VLS_147 = __VLS_asFunctionalComponent(__VLS_146, new __VLS_146({
        cols: "12",
    }));
    const __VLS_148 = __VLS_147({
        cols: "12",
    }, ...__VLS_functionalComponentArgsRest(__VLS_147));
    __VLS_149.slots.default;
    const __VLS_150 = {}.VDivider;
    /** @type {[typeof __VLS_components.VDivider, typeof __VLS_components.vDivider, ]} */ ;
    // @ts-ignore
    const __VLS_151 = __VLS_asFunctionalComponent(__VLS_150, new __VLS_150({
        ...{ class: "my-4" },
    }));
    const __VLS_152 = __VLS_151({
        ...{ class: "my-4" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_151));
    var __VLS_149;
    const __VLS_154 = {}.VCol;
    /** @type {[typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ]} */ ;
    // @ts-ignore
    const __VLS_155 = __VLS_asFunctionalComponent(__VLS_154, new __VLS_154({
        cols: "12",
        ...{ class: "pb-4 text-center text-h5" },
    }));
    const __VLS_156 = __VLS_155({
        cols: "12",
        ...{ class: "pb-4 text-center text-h5" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_155));
    __VLS_157.slots.default;
    (__VLS_ctx.t("label.resources"));
    var __VLS_157;
    for (const [resource] of __VLS_getVForSourceType((__VLS_ctx.RESOURCE_DEFINITIONS))) {
        const __VLS_158 = {}.VCol;
        /** @type {[typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ]} */ ;
        // @ts-ignore
        const __VLS_159 = __VLS_asFunctionalComponent(__VLS_158, new __VLS_158({
            cols: "12",
            key: (resource.id),
        }));
        const __VLS_160 = __VLS_159({
            cols: "12",
            key: (resource.id),
        }, ...__VLS_functionalComponentArgsRest(__VLS_159));
        __VLS_161.slots.default;
        const __VLS_162 = {}.VNumberInput;
        /** @type {[typeof __VLS_components.VNumberInput, typeof __VLS_components.vNumberInput, ]} */ ;
        // @ts-ignore
        const __VLS_163 = __VLS_asFunctionalComponent(__VLS_162, new __VLS_162({
            modelValue: (__VLS_ctx.localState.resources[resource.id]),
            label: (__VLS_ctx.t(resource.translation_key)),
            min: (0),
            max: (4),
            variant: "outlined",
            controlVariant: "split",
            ...{ class: "mb-4" },
        }));
        const __VLS_164 = __VLS_163({
            modelValue: (__VLS_ctx.localState.resources[resource.id]),
            label: (__VLS_ctx.t(resource.translation_key)),
            min: (0),
            max: (4),
            variant: "outlined",
            controlVariant: "split",
            ...{ class: "mb-4" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_163));
        var __VLS_161;
    }
    var __VLS_61;
    var __VLS_57;
    var __VLS_49;
    var __VLS_45;
    var __VLS_41;
}
if (__VLS_ctx.isLoaded) {
    const __VLS_166 = {}.VRow;
    /** @type {[typeof __VLS_components.VRow, typeof __VLS_components.vRow, typeof __VLS_components.VRow, typeof __VLS_components.vRow, ]} */ ;
    // @ts-ignore
    const __VLS_167 = __VLS_asFunctionalComponent(__VLS_166, new __VLS_166({
        noGutters: true,
        ...{ class: "pt-6" },
    }));
    const __VLS_168 = __VLS_167({
        noGutters: true,
        ...{ class: "pt-6" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_167));
    __VLS_169.slots.default;
    const __VLS_170 = {}.VCol;
    /** @type {[typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ]} */ ;
    // @ts-ignore
    const __VLS_171 = __VLS_asFunctionalComponent(__VLS_170, new __VLS_170({
        cols: "12",
        ...{ class: "d-flex justify-center pb-4" },
    }));
    const __VLS_172 = __VLS_171({
        cols: "12",
        ...{ class: "d-flex justify-center pb-4" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_171));
    __VLS_173.slots.default;
    const __VLS_174 = {}.VBtn;
    /** @type {[typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ]} */ ;
    // @ts-ignore
    const __VLS_175 = __VLS_asFunctionalComponent(__VLS_174, new __VLS_174({
        ...{ 'onClick': {} },
        variant: "elevated",
        color: "primary",
        loading: (__VLS_ctx.isSaving),
    }));
    const __VLS_176 = __VLS_175({
        ...{ 'onClick': {} },
        variant: "elevated",
        color: "primary",
        loading: (__VLS_ctx.isSaving),
    }, ...__VLS_functionalComponentArgsRest(__VLS_175));
    let __VLS_178;
    let __VLS_179;
    let __VLS_180;
    const __VLS_181 = {
        onClick: (__VLS_ctx.saveAndGoBack)
    };
    __VLS_177.slots.default;
    (__VLS_ctx.t("Save Changes"));
    var __VLS_177;
    var __VLS_173;
    var __VLS_169;
}
const __VLS_182 = {}.VSnackbar;
/** @type {[typeof __VLS_components.VSnackbar, typeof __VLS_components.vSnackbar, typeof __VLS_components.VSnackbar, typeof __VLS_components.vSnackbar, ]} */ ;
// @ts-ignore
const __VLS_183 = __VLS_asFunctionalComponent(__VLS_182, new __VLS_182({
    modelValue: (__VLS_ctx.snackbarVisible),
    timeout: (__VLS_ctx.snackbarTimeout),
    color: (__VLS_ctx.snackbarColor),
    location: "top",
}));
const __VLS_184 = __VLS_183({
    modelValue: (__VLS_ctx.snackbarVisible),
    timeout: (__VLS_ctx.snackbarTimeout),
    color: (__VLS_ctx.snackbarColor),
    location: "top",
}, ...__VLS_functionalComponentArgsRest(__VLS_183));
__VLS_185.slots.default;
(__VLS_ctx.snackbarText);
var __VLS_185;
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
/** @type {__VLS_StyleScopedClasses['py-4']} */ ;
/** @type {__VLS_StyleScopedClasses['py-3']} */ ;
/** @type {__VLS_StyleScopedClasses['py-3']} */ ;
/** @type {__VLS_StyleScopedClasses['py-3']} */ ;
/** @type {__VLS_StyleScopedClasses['d-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['align-center']} */ ;
/** @type {__VLS_StyleScopedClasses['mr-2']} */ ;
/** @type {__VLS_StyleScopedClasses['py-3']} */ ;
/** @type {__VLS_StyleScopedClasses['faded-cubes']} */ ;
/** @type {__VLS_StyleScopedClasses['d-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['align-center']} */ ;
/** @type {__VLS_StyleScopedClasses['mr-2']} */ ;
/** @type {__VLS_StyleScopedClasses['my-4']} */ ;
/** @type {__VLS_StyleScopedClasses['pb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['text-center']} */ ;
/** @type {__VLS_StyleScopedClasses['text-h5']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
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
            RESOURCE_DEFINITIONS: RESOURCE_DEFINITIONS,
            HeroSavePut: HeroSavePut,
            t: t,
            heroId: heroId,
            campaignId: campaignId,
            heroSavePutRef: heroSavePutRef,
            isLoaded: isLoaded,
            isSaving: isSaving,
            heroStaticData: heroStaticData,
            snackbarVisible: snackbarVisible,
            snackbarText: snackbarText,
            snackbarColor: snackbarColor,
            snackbarTimeout: snackbarTimeout,
            localState: localState,
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
