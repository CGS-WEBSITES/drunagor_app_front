/// <reference types="../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import { computed, ref, onMounted } from "vue";
import { HeroStore } from "@/store/HeroStore";
import { useUserStore } from "@/store/UserStore";
import { useRouter } from "vue-router";
import { SequentialAdventureState } from "@/store/Hero";
import { CampaignStore } from "@/store/CampaignStore";
import { useI18n } from "vue-i18n";
import axios from "axios";
const props = defineProps();
const heroStore = HeroStore();
const userStore = useUserStore();
const campaignStore = CampaignStore();
const router = useRouter();
const { t } = useI18n();
const isAdmin = ref(false);
const loading = ref(true);
const resourceDisplay = computed(() => {
    const resources = sequentialAdventureState.value?.resources;
    const resourcesToDisplay = [];
    for (const resource in resources) {
        if (resources[resource] > 0) {
            resourcesToDisplay.push({
                name: resource,
                count: resources[resource],
            });
        }
    }
    return resourcesToDisplay;
});
const sequentialAdventureState = ref({});
sequentialAdventureState.value =
    heroStore.findInCampaign(props.hero.id, props.campaignId)
        ?.sequentialAdventureState ?? new SequentialAdventureState();
const checkUserRole = async () => {
    try {
        if (!userStore.user?.users_pk) {
            userStore.restoreFromStorage();
        }
        if (!userStore.user?.users_pk) {
            console.warn("[CampaignLogSequentialAdventure] checkUserRole skipped: users_pk is missing");
            return;
        }
        const campaign = campaignStore.findOptional(props.campaignId);
        const showSeason2 = campaign ? campaign.campaign === "underkeep2" : false;
        const response = await axios.get("rl_campaigns_users/search", {
            params: {
                users_fk: userStore.user.users_pk,
                campaigns_fk: props.campaignId,
                show_season2: showSeason2
            },
        });
        const campaignRelation = response.data.campaigns?.[0];
        if (campaignRelation) {
            const isPartyAdmin = campaignRelation.party_role === "Admin";
            const activeHeroObj = heroStore.findInCampaignOptional(props.hero.id, props.campaignId);
            const isHeroOwner = activeHeroObj && Number(activeHeroObj.playableHeroesPk) === Number(campaignRelation.playable_heroes_fk);
            isAdmin.value = isPartyAdmin || isHeroOwner;
        }
        else {
            isAdmin.value = false;
        }
    }
    catch (error) {
        console.error("SequentialAdventureState - Error fetching user role:", error);
        isAdmin.value = false;
    }
    finally {
        loading.value = false;
    }
};
function openSequentialStateEditor() {
    if (!isAdmin.value) {
        console.log("SequentialAdventureState - Cannot navigate - not admin");
        return;
    }
    router.push({
        name: "HeroSequentialState",
        params: { campaignId: props.campaignId, heroId: props.hero.id },
    });
}
onMounted(async () => {
    await checkUserRole();
});
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['cursor-pointer']} */ ;
// CSS variable injection 
// CSS variable injection end 
const __VLS_0 = {}.VRow;
/** @type {[typeof __VLS_components.VRow, typeof __VLS_components.vRow, typeof __VLS_components.VRow, typeof __VLS_components.vRow, ]} */ ;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
    ...{ 'onClick': {} },
    noGutters: true,
    id: "seq-adv",
    ...{ class: ({
            'cursor-pointer': __VLS_ctx.isAdmin && !__VLS_ctx.loading,
            'justify-center': true,
        }) },
}));
const __VLS_2 = __VLS_1({
    ...{ 'onClick': {} },
    noGutters: true,
    id: "seq-adv",
    ...{ class: ({
            'cursor-pointer': __VLS_ctx.isAdmin && !__VLS_ctx.loading,
            'justify-center': true,
        }) },
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
let __VLS_4;
let __VLS_5;
let __VLS_6;
const __VLS_7 = {
    onClick: (...[$event]) => {
        __VLS_ctx.isAdmin && !__VLS_ctx.loading ? __VLS_ctx.openSequentialStateEditor() : null;
    }
};
__VLS_3.slots.default;
const __VLS_8 = {}.VCol;
/** @type {[typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ]} */ ;
// @ts-ignore
const __VLS_9 = __VLS_asFunctionalComponent(__VLS_8, new __VLS_8({
    cols: "12",
    ...{ class: "px-2" },
}));
const __VLS_10 = __VLS_9({
    cols: "12",
    ...{ class: "px-2" },
}, ...__VLS_functionalComponentArgsRest(__VLS_9));
__VLS_11.slots.default;
const __VLS_12 = {}.VSheet;
/** @type {[typeof __VLS_components.VSheet, typeof __VLS_components.vSheet, typeof __VLS_components.VSheet, typeof __VLS_components.vSheet, ]} */ ;
// @ts-ignore
const __VLS_13 = __VLS_asFunctionalComponent(__VLS_12, new __VLS_12({
    rounded: true,
    border: "md",
    ...{ class: "mb-6 pa-6 text-white" },
    width: "100%",
    ...{ style: {} },
    color: "red-darken-4",
}));
const __VLS_14 = __VLS_13({
    rounded: true,
    border: "md",
    ...{ class: "mb-6 pa-6 text-white" },
    width: "100%",
    ...{ style: {} },
    color: "red-darken-4",
}, ...__VLS_functionalComponentArgsRest(__VLS_13));
__VLS_15.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "text-h6 text-center d-flex align-center justify-center" },
});
const __VLS_16 = {}.VIcon;
/** @type {[typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, ]} */ ;
// @ts-ignore
const __VLS_17 = __VLS_asFunctionalComponent(__VLS_16, new __VLS_16({
    start: true,
}));
const __VLS_18 = __VLS_17({
    start: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_17));
__VLS_19.slots.default;
var __VLS_19;
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
(__VLS_ctx.sequentialAdventureState.lifepoints);
const __VLS_20 = {}.VDivider;
/** @type {[typeof __VLS_components.VDivider, typeof __VLS_components.vDivider, typeof __VLS_components.VDivider, typeof __VLS_components.vDivider, ]} */ ;
// @ts-ignore
const __VLS_21 = __VLS_asFunctionalComponent(__VLS_20, new __VLS_20({
    ...{ class: "my-2" },
}));
const __VLS_22 = __VLS_21({
    ...{ class: "my-2" },
}, ...__VLS_functionalComponentArgsRest(__VLS_21));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "text-center text-body-2" },
});
(__VLS_ctx.t("label.lifepoints", "Life Points"));
var __VLS_15;
var __VLS_11;
const __VLS_24 = {}.VCol;
/** @type {[typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ]} */ ;
// @ts-ignore
const __VLS_25 = __VLS_asFunctionalComponent(__VLS_24, new __VLS_24({
    cols: "6",
    ...{ class: "px-2" },
}));
const __VLS_26 = __VLS_25({
    cols: "6",
    ...{ class: "px-2" },
}, ...__VLS_functionalComponentArgsRest(__VLS_25));
__VLS_27.slots.default;
const __VLS_28 = {}.VSheet;
/** @type {[typeof __VLS_components.VSheet, typeof __VLS_components.vSheet, typeof __VLS_components.VSheet, typeof __VLS_components.vSheet, ]} */ ;
// @ts-ignore
const __VLS_29 = __VLS_asFunctionalComponent(__VLS_28, new __VLS_28({
    rounded: true,
    border: "md",
    ...{ class: "mb-6 pa-6 text-white" },
    width: "100%",
    ...{ style: {} },
}));
const __VLS_30 = __VLS_29({
    rounded: true,
    border: "md",
    ...{ class: "mb-6 pa-6 text-white" },
    width: "100%",
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_29));
__VLS_31.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "text-h6 text-center d-flex align-center justify-center" },
});
const __VLS_32 = {}.VIcon;
/** @type {[typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, ]} */ ;
// @ts-ignore
const __VLS_33 = __VLS_asFunctionalComponent(__VLS_32, new __VLS_32({
    color: "black",
    start: true,
}));
const __VLS_34 = __VLS_33({
    color: "black",
    start: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_33));
__VLS_35.slots.default;
var __VLS_35;
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
(__VLS_ctx.sequentialAdventureState.curseCubes);
const __VLS_36 = {}.VDivider;
/** @type {[typeof __VLS_components.VDivider, typeof __VLS_components.vDivider, typeof __VLS_components.VDivider, typeof __VLS_components.vDivider, ]} */ ;
// @ts-ignore
const __VLS_37 = __VLS_asFunctionalComponent(__VLS_36, new __VLS_36({
    ...{ class: "my-2" },
}));
const __VLS_38 = __VLS_37({
    ...{ class: "my-2" },
}, ...__VLS_functionalComponentArgsRest(__VLS_37));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "text-center text-body-2" },
});
(__VLS_ctx.t("text.curse-cubes"));
var __VLS_31;
var __VLS_27;
const __VLS_40 = {}.VCol;
/** @type {[typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ]} */ ;
// @ts-ignore
const __VLS_41 = __VLS_asFunctionalComponent(__VLS_40, new __VLS_40({
    cols: "6",
    ...{ class: "px-2" },
}));
const __VLS_42 = __VLS_41({
    cols: "6",
    ...{ class: "px-2" },
}, ...__VLS_functionalComponentArgsRest(__VLS_41));
__VLS_43.slots.default;
const __VLS_44 = {}.VSheet;
/** @type {[typeof __VLS_components.VSheet, typeof __VLS_components.vSheet, typeof __VLS_components.VSheet, typeof __VLS_components.vSheet, ]} */ ;
// @ts-ignore
const __VLS_45 = __VLS_asFunctionalComponent(__VLS_44, new __VLS_44({
    rounded: true,
    border: "md",
    ...{ class: "mb-6 pa-6 text-white" },
    width: "100%",
    ...{ style: {} },
}));
const __VLS_46 = __VLS_45({
    rounded: true,
    border: "md",
    ...{ class: "mb-6 pa-6 text-white" },
    width: "100%",
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_45));
__VLS_47.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "text-h6 text-center d-flex align-center justify-center" },
});
const __VLS_48 = {}.VIcon;
/** @type {[typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, ]} */ ;
// @ts-ignore
const __VLS_49 = __VLS_asFunctionalComponent(__VLS_48, new __VLS_48({
    start: true,
    color: "purple-lighten-2",
}));
const __VLS_50 = __VLS_49({
    start: true,
    color: "purple-lighten-2",
}, ...__VLS_functionalComponentArgsRest(__VLS_49));
__VLS_51.slots.default;
var __VLS_51;
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
(__VLS_ctx.sequentialAdventureState.traumaCubes);
const __VLS_52 = {}.VDivider;
/** @type {[typeof __VLS_components.VDivider, typeof __VLS_components.vDivider, typeof __VLS_components.VDivider, typeof __VLS_components.vDivider, ]} */ ;
// @ts-ignore
const __VLS_53 = __VLS_asFunctionalComponent(__VLS_52, new __VLS_52({
    ...{ class: "my-2" },
}));
const __VLS_54 = __VLS_53({
    ...{ class: "my-2" },
}, ...__VLS_functionalComponentArgsRest(__VLS_53));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "text-center text-body-2" },
});
(__VLS_ctx.t("text.trauma-cubes"));
var __VLS_47;
var __VLS_43;
const __VLS_56 = {}.VCol;
/** @type {[typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ]} */ ;
// @ts-ignore
const __VLS_57 = __VLS_asFunctionalComponent(__VLS_56, new __VLS_56({
    cols: "12",
    ...{ class: "px-2" },
}));
const __VLS_58 = __VLS_57({
    cols: "12",
    ...{ class: "px-2" },
}, ...__VLS_functionalComponentArgsRest(__VLS_57));
__VLS_59.slots.default;
const __VLS_60 = {}.VSheet;
/** @type {[typeof __VLS_components.VSheet, typeof __VLS_components.vSheet, typeof __VLS_components.VSheet, typeof __VLS_components.vSheet, ]} */ ;
// @ts-ignore
const __VLS_61 = __VLS_asFunctionalComponent(__VLS_60, new __VLS_60({
    rounded: true,
    border: "md",
    ...{ class: "mb-6 pa-6 text-white" },
    width: "100%",
    ...{ style: {} },
}));
const __VLS_62 = __VLS_61({
    rounded: true,
    border: "md",
    ...{ class: "mb-6 pa-6 text-white" },
    width: "100%",
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_61));
__VLS_63.slots.default;
if (__VLS_ctx.resourceDisplay.length > 0) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        id: "resources",
    });
    for (const [resource] of __VLS_getVForSourceType((__VLS_ctx.resourceDisplay))) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            key: (resource.name),
            ...{ class: "d-flex align-center justify-center text-body-1" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
        (resource.count);
        (__VLS_ctx.t(resource.name));
    }
}
else {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "text-center font-italic" },
    });
    (__VLS_ctx.t("text.no-resources"));
}
const __VLS_64 = {}.VDivider;
/** @type {[typeof __VLS_components.VDivider, typeof __VLS_components.vDivider, typeof __VLS_components.VDivider, typeof __VLS_components.vDivider, ]} */ ;
// @ts-ignore
const __VLS_65 = __VLS_asFunctionalComponent(__VLS_64, new __VLS_64({
    ...{ class: "my-2" },
}));
const __VLS_66 = __VLS_65({
    ...{ class: "my-2" },
}, ...__VLS_functionalComponentArgsRest(__VLS_65));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "text-center text-body-2" },
});
(__VLS_ctx.t("label.resources"));
var __VLS_63;
var __VLS_59;
var __VLS_3;
const __VLS_68 = {}.VRow;
/** @type {[typeof __VLS_components.VRow, typeof __VLS_components.vRow, typeof __VLS_components.VRow, typeof __VLS_components.vRow, ]} */ ;
// @ts-ignore
const __VLS_69 = __VLS_asFunctionalComponent(__VLS_68, new __VLS_68({
    noGutters: true,
    ...{ class: "justify-center" },
}));
const __VLS_70 = __VLS_69({
    noGutters: true,
    ...{ class: "justify-center" },
}, ...__VLS_functionalComponentArgsRest(__VLS_69));
__VLS_71.slots.default;
const __VLS_72 = {}.VCol;
/** @type {[typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ]} */ ;
// @ts-ignore
const __VLS_73 = __VLS_asFunctionalComponent(__VLS_72, new __VLS_72({
    cols: "6",
    ...{ class: "px-2" },
}));
const __VLS_74 = __VLS_73({
    cols: "6",
    ...{ class: "px-2" },
}, ...__VLS_functionalComponentArgsRest(__VLS_73));
__VLS_75.slots.default;
const __VLS_76 = {}.VSheet;
/** @type {[typeof __VLS_components.VSheet, typeof __VLS_components.vSheet, typeof __VLS_components.VSheet, typeof __VLS_components.vSheet, ]} */ ;
// @ts-ignore
const __VLS_77 = __VLS_asFunctionalComponent(__VLS_76, new __VLS_76({
    rounded: true,
    border: "md",
    ...{ class: "mb-6 pa-6 text-white" },
    width: "100%",
    ...{ style: {} },
}));
const __VLS_78 = __VLS_77({
    rounded: true,
    border: "md",
    ...{ class: "mb-6 pa-6 text-white" },
    width: "100%",
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_77));
__VLS_79.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "text-h6 text-center d-flex align-center justify-center" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
(__VLS_ctx.sequentialAdventureState.availableCubes);
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "ml-2" },
});
const __VLS_80 = {}.VIcon;
/** @type {[typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, ]} */ ;
// @ts-ignore
const __VLS_81 = __VLS_asFunctionalComponent(__VLS_80, new __VLS_80({
    size: "small",
    color: "yellow-darken-2",
}));
const __VLS_82 = __VLS_81({
    size: "small",
    color: "yellow-darken-2",
}, ...__VLS_functionalComponentArgsRest(__VLS_81));
__VLS_83.slots.default;
var __VLS_83;
const __VLS_84 = {}.VIcon;
/** @type {[typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, ]} */ ;
// @ts-ignore
const __VLS_85 = __VLS_asFunctionalComponent(__VLS_84, new __VLS_84({
    size: "small",
    color: "red-darken-2",
}));
const __VLS_86 = __VLS_85({
    size: "small",
    color: "red-darken-2",
}, ...__VLS_functionalComponentArgsRest(__VLS_85));
__VLS_87.slots.default;
var __VLS_87;
const __VLS_88 = {}.VIcon;
/** @type {[typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, ]} */ ;
// @ts-ignore
const __VLS_89 = __VLS_asFunctionalComponent(__VLS_88, new __VLS_88({
    size: "small",
    color: "green-darken-2",
}));
const __VLS_90 = __VLS_89({
    size: "small",
    color: "green-darken-2",
}, ...__VLS_functionalComponentArgsRest(__VLS_89));
__VLS_91.slots.default;
var __VLS_91;
const __VLS_92 = {}.VIcon;
/** @type {[typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, ]} */ ;
// @ts-ignore
const __VLS_93 = __VLS_asFunctionalComponent(__VLS_92, new __VLS_92({
    size: "small",
    color: "blue-darken-2",
}));
const __VLS_94 = __VLS_93({
    size: "small",
    color: "blue-darken-2",
}, ...__VLS_functionalComponentArgsRest(__VLS_93));
__VLS_95.slots.default;
var __VLS_95;
const __VLS_96 = {}.VDivider;
/** @type {[typeof __VLS_components.VDivider, typeof __VLS_components.vDivider, typeof __VLS_components.VDivider, typeof __VLS_components.vDivider, ]} */ ;
// @ts-ignore
const __VLS_97 = __VLS_asFunctionalComponent(__VLS_96, new __VLS_96({
    ...{ class: "my-2" },
}));
const __VLS_98 = __VLS_97({
    ...{ class: "my-2" },
}, ...__VLS_functionalComponentArgsRest(__VLS_97));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "text-center text-body-2" },
});
(__VLS_ctx.t("Available Cubes"));
var __VLS_79;
var __VLS_75;
const __VLS_100 = {}.VCol;
/** @type {[typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ]} */ ;
// @ts-ignore
const __VLS_101 = __VLS_asFunctionalComponent(__VLS_100, new __VLS_100({
    cols: "6",
    ...{ class: "px-2" },
}));
const __VLS_102 = __VLS_101({
    cols: "6",
    ...{ class: "px-2" },
}, ...__VLS_functionalComponentArgsRest(__VLS_101));
__VLS_103.slots.default;
const __VLS_104 = {}.VSheet;
/** @type {[typeof __VLS_components.VSheet, typeof __VLS_components.vSheet, typeof __VLS_components.VSheet, typeof __VLS_components.vSheet, ]} */ ;
// @ts-ignore
const __VLS_105 = __VLS_asFunctionalComponent(__VLS_104, new __VLS_104({
    rounded: true,
    border: "md",
    ...{ class: "mb-6 pa-6 text-white" },
    width: "100%",
    ...{ style: {} },
}));
const __VLS_106 = __VLS_105({
    rounded: true,
    border: "md",
    ...{ class: "mb-6 pa-6 text-white" },
    width: "100%",
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_105));
__VLS_107.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "text-h6 text-center d-flex align-center justify-center" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
(__VLS_ctx.sequentialAdventureState.usedCubes);
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "ml-2 faded-cubes" },
});
const __VLS_108 = {}.VIcon;
/** @type {[typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, ]} */ ;
// @ts-ignore
const __VLS_109 = __VLS_asFunctionalComponent(__VLS_108, new __VLS_108({
    size: "small",
    color: "yellow-darken-2",
}));
const __VLS_110 = __VLS_109({
    size: "small",
    color: "yellow-darken-2",
}, ...__VLS_functionalComponentArgsRest(__VLS_109));
__VLS_111.slots.default;
var __VLS_111;
const __VLS_112 = {}.VIcon;
/** @type {[typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, ]} */ ;
// @ts-ignore
const __VLS_113 = __VLS_asFunctionalComponent(__VLS_112, new __VLS_112({
    size: "small",
    color: "red-darken-2",
}));
const __VLS_114 = __VLS_113({
    size: "small",
    color: "red-darken-2",
}, ...__VLS_functionalComponentArgsRest(__VLS_113));
__VLS_115.slots.default;
var __VLS_115;
const __VLS_116 = {}.VIcon;
/** @type {[typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, ]} */ ;
// @ts-ignore
const __VLS_117 = __VLS_asFunctionalComponent(__VLS_116, new __VLS_116({
    size: "small",
    color: "green-darken-2",
}));
const __VLS_118 = __VLS_117({
    size: "small",
    color: "green-darken-2",
}, ...__VLS_functionalComponentArgsRest(__VLS_117));
__VLS_119.slots.default;
var __VLS_119;
const __VLS_120 = {}.VIcon;
/** @type {[typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, ]} */ ;
// @ts-ignore
const __VLS_121 = __VLS_asFunctionalComponent(__VLS_120, new __VLS_120({
    size: "small",
    color: "blue-darken-2",
}));
const __VLS_122 = __VLS_121({
    size: "small",
    color: "blue-darken-2",
}, ...__VLS_functionalComponentArgsRest(__VLS_121));
__VLS_123.slots.default;
var __VLS_123;
const __VLS_124 = {}.VDivider;
/** @type {[typeof __VLS_components.VDivider, typeof __VLS_components.vDivider, typeof __VLS_components.VDivider, typeof __VLS_components.vDivider, ]} */ ;
// @ts-ignore
const __VLS_125 = __VLS_asFunctionalComponent(__VLS_124, new __VLS_124({
    ...{ class: "my-2" },
}));
const __VLS_126 = __VLS_125({
    ...{ class: "my-2" },
}, ...__VLS_functionalComponentArgsRest(__VLS_125));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "text-center text-body-2" },
});
(__VLS_ctx.t("Used Cubes"));
var __VLS_107;
var __VLS_103;
if (!props.hideManageButton && __VLS_ctx.isAdmin && !__VLS_ctx.loading) {
    const __VLS_128 = {}.VCol;
    /** @type {[typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ]} */ ;
    // @ts-ignore
    const __VLS_129 = __VLS_asFunctionalComponent(__VLS_128, new __VLS_128({
        cols: "12",
        ...{ class: "px-2 pb-4" },
    }));
    const __VLS_130 = __VLS_129({
        cols: "12",
        ...{ class: "px-2 pb-4" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_129));
    __VLS_131.slots.default;
    const __VLS_132 = {}.VBtn;
    /** @type {[typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ]} */ ;
    // @ts-ignore
    const __VLS_133 = __VLS_asFunctionalComponent(__VLS_132, new __VLS_132({
        ...{ 'onClick': {} },
        variant: "elevated",
        color: "secundary",
        rounded: true,
    }));
    const __VLS_134 = __VLS_133({
        ...{ 'onClick': {} },
        variant: "elevated",
        color: "secundary",
        rounded: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_133));
    let __VLS_136;
    let __VLS_137;
    let __VLS_138;
    const __VLS_139 = {
        onClick: (__VLS_ctx.openSequentialStateEditor)
    };
    __VLS_135.slots.default;
    (__VLS_ctx.t("Manage Resources"));
    var __VLS_135;
    var __VLS_131;
}
var __VLS_71;
/** @type {__VLS_StyleScopedClasses['cursor-pointer']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['px-2']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-6']} */ ;
/** @type {__VLS_StyleScopedClasses['pa-6']} */ ;
/** @type {__VLS_StyleScopedClasses['text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['text-h6']} */ ;
/** @type {__VLS_StyleScopedClasses['text-center']} */ ;
/** @type {__VLS_StyleScopedClasses['d-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['align-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['my-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-center']} */ ;
/** @type {__VLS_StyleScopedClasses['text-body-2']} */ ;
/** @type {__VLS_StyleScopedClasses['px-2']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-6']} */ ;
/** @type {__VLS_StyleScopedClasses['pa-6']} */ ;
/** @type {__VLS_StyleScopedClasses['text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['text-h6']} */ ;
/** @type {__VLS_StyleScopedClasses['text-center']} */ ;
/** @type {__VLS_StyleScopedClasses['d-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['align-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['my-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-center']} */ ;
/** @type {__VLS_StyleScopedClasses['text-body-2']} */ ;
/** @type {__VLS_StyleScopedClasses['px-2']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-6']} */ ;
/** @type {__VLS_StyleScopedClasses['pa-6']} */ ;
/** @type {__VLS_StyleScopedClasses['text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['text-h6']} */ ;
/** @type {__VLS_StyleScopedClasses['text-center']} */ ;
/** @type {__VLS_StyleScopedClasses['d-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['align-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['my-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-center']} */ ;
/** @type {__VLS_StyleScopedClasses['text-body-2']} */ ;
/** @type {__VLS_StyleScopedClasses['px-2']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-6']} */ ;
/** @type {__VLS_StyleScopedClasses['pa-6']} */ ;
/** @type {__VLS_StyleScopedClasses['text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['d-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['align-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['text-body-1']} */ ;
/** @type {__VLS_StyleScopedClasses['text-center']} */ ;
/** @type {__VLS_StyleScopedClasses['font-italic']} */ ;
/** @type {__VLS_StyleScopedClasses['my-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-center']} */ ;
/** @type {__VLS_StyleScopedClasses['text-body-2']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['px-2']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-6']} */ ;
/** @type {__VLS_StyleScopedClasses['pa-6']} */ ;
/** @type {__VLS_StyleScopedClasses['text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['text-h6']} */ ;
/** @type {__VLS_StyleScopedClasses['text-center']} */ ;
/** @type {__VLS_StyleScopedClasses['d-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['align-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['ml-2']} */ ;
/** @type {__VLS_StyleScopedClasses['my-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-center']} */ ;
/** @type {__VLS_StyleScopedClasses['text-body-2']} */ ;
/** @type {__VLS_StyleScopedClasses['px-2']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-6']} */ ;
/** @type {__VLS_StyleScopedClasses['pa-6']} */ ;
/** @type {__VLS_StyleScopedClasses['text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['text-h6']} */ ;
/** @type {__VLS_StyleScopedClasses['text-center']} */ ;
/** @type {__VLS_StyleScopedClasses['d-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['align-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['ml-2']} */ ;
/** @type {__VLS_StyleScopedClasses['faded-cubes']} */ ;
/** @type {__VLS_StyleScopedClasses['my-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-center']} */ ;
/** @type {__VLS_StyleScopedClasses['text-body-2']} */ ;
/** @type {__VLS_StyleScopedClasses['px-2']} */ ;
/** @type {__VLS_StyleScopedClasses['pb-4']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            t: t,
            isAdmin: isAdmin,
            loading: loading,
            resourceDisplay: resourceDisplay,
            sequentialAdventureState: sequentialAdventureState,
            openSequentialStateEditor: openSequentialStateEditor,
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
