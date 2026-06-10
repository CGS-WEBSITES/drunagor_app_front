/// <reference types="../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import { ref, watch, computed } from "vue";
import { HeroStore } from "@/store/HeroStore";
import { CubeIcon } from "@heroicons/vue/24/solid";
import { useI18n } from "vue-i18n";
import { underkeepSkillCards, findSkillsFor, } from "@/data/repository/campaign/underkeep/underkeepSkillData.ts";
const props = defineProps();
const { t } = useI18n();
const heroStore = HeroStore();
const campaignHero = heroStore.findInCampaign(props.heroId, props.campaignId);
const useNewSkillSystem = computed(() => {
    const isUnderkeep = ["underkeep", "underkeep2"].includes(props.campaign.campaign);
    const specialHeroes = ["elros", "vorn", "lorelai", "maya", "jaheen"];
    const isSpecialHero = specialHeroes.includes(props.heroId);
    return isUnderkeep && isSpecialHero;
});
const generalSkills = [
    { id: "melee", name: "Melee", translationKey: "label.melee" },
    { id: "ranged", name: "Ranged", translationKey: "label.ranged" },
    { id: "agility", name: "Agility", translationKey: "label.agility" },
    { id: "wisdom", name: "Wisdom", translationKey: "label.wisdom" },
];
const selectedSkills = ref([]);
if (!campaignHero.skillIds)
    campaignHero.skillIds = [];
selectedSkills.value = [...campaignHero.skillIds];
watch(selectedSkills, (newSkills) => {
    heroStore.findInCampaign(props.heroId, props.campaignId).skillIds = newSkills;
});
const isCubeColorModalVisible = ref(false);
const selectedSkillId = ref("");
const cubeColors = ["Yellow", "Red", "Green", "Blue"];
if (typeof campaignHero.dungeonRoleSkillCubeColors === "undefined") {
    campaignHero.dungeonRoleSkillCubeColors = { rankOne: null, rankTwo: null };
}
function getSkillLabel(skillId, level) {
    if (!skillId.startsWith("dungeon-role"))
        return `${t("label.level")} ${level}`;
    const selectedCubes = campaignHero.dungeonRoleSkillCubeColors;
    const selectedCube = level === 1 ? selectedCubes.rankOne : selectedCubes.rankTwo;
    return selectedCube
        ? `${t("label.level")} ${level} (${t("label." + selectedCube.toLowerCase())})`
        : `${t("label.level")} ${level}`;
}
function onSkillSelect(skillId) {
    if (!skillId.startsWith("dungeon-role"))
        return;
    const wasSelected = selectedSkills.value.includes(skillId);
    if (wasSelected) {
        selectedSkillId.value = skillId;
        isCubeColorModalVisible.value = true;
    }
    else {
        clearCubeColor(skillId);
    }
}
function clearCubeColor(skillId) {
    if (skillId === "dungeon-role-1")
        campaignHero.dungeonRoleSkillCubeColors.rankOne = null;
    else if (skillId === "dungeon-role-2")
        campaignHero.dungeonRoleSkillCubeColors.rankTwo = null;
}
function setSelectedCubeColor(color) {
    if (selectedSkillId.value === "dungeon-role-1")
        campaignHero.dungeonRoleSkillCubeColors.rankOne = color;
    else if (selectedSkillId.value === "dungeon-role-2")
        campaignHero.dungeonRoleSkillCubeColors.rankTwo = color;
    isCubeColorModalVisible.value = false;
}
const skillTypes = [
    "melee",
    "ranged",
    "agility",
    "wisdom",
];
const isAddSkillModalVisible = ref(false);
const isViewSkillModalVisible = ref(false);
const currentSkillType = ref("melee");
const skillToView = ref(null);
const skillTypeColors = {
    melee: "yellow",
    ranged: "red",
    agility: "green",
    wisdom: "blue",
};
function getSelectedSkillCard(skillType) {
    const foundSkillId = selectedSkills.value.find((id) => id.includes(`-${skillType}-`));
    if (!foundSkillId)
        return undefined;
    return underkeepSkillCards.find((card) => card.id === foundSkillId);
}
const availableSkillsForModal = computed(() => {
    return findSkillsFor(props.heroId, currentSkillType.value);
});
function openAddSkillModal(skillType) {
    currentSkillType.value = skillType;
    isAddSkillModalVisible.value = true;
}
function openViewSkillModal(card) {
    skillToView.value = card;
    isViewSkillModalVisible.value = true;
}
function selectSkill(cardToSelect) {
    const otherSkills = selectedSkills.value.filter((id) => !id.includes(`-${cardToSelect.skillType}-`));
    selectedSkills.value = [...otherSkills, cardToSelect.id];
    isAddSkillModalVisible.value = false;
}
function deleteSkill() {
    if (!skillToView.value)
        return;
    const skillIdToDelete = skillToView.value.id;
    selectedSkills.value = selectedSkills.value.filter((id) => id !== skillIdToDelete);
    isViewSkillModalVisible.value = false;
    skillToView.value = null;
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
    ...{ class: "justify-space-around" },
}));
const __VLS_2 = __VLS_1({
    noGutters: true,
    ...{ class: "justify-space-around" },
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
__VLS_3.slots.default;
const __VLS_4 = {}.VCol;
/** @type {[typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ]} */ ;
// @ts-ignore
const __VLS_5 = __VLS_asFunctionalComponent(__VLS_4, new __VLS_4({
    cols: "12",
    ...{ class: "skill" },
}));
const __VLS_6 = __VLS_5({
    cols: "12",
    ...{ class: "skill" },
}, ...__VLS_functionalComponentArgsRest(__VLS_5));
__VLS_7.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.h3, __VLS_intrinsicElements.h3)({});
(__VLS_ctx.t("label.dungeon-role"));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "d-flex ga-4" },
});
for (const [level] of __VLS_getVForSourceType((2))) {
    const __VLS_8 = {}.VCheckbox;
    /** @type {[typeof __VLS_components.VCheckbox, typeof __VLS_components.vCheckbox, typeof __VLS_components.VCheckbox, typeof __VLS_components.vCheckbox, ]} */ ;
    // @ts-ignore
    const __VLS_9 = __VLS_asFunctionalComponent(__VLS_8, new __VLS_8({
        ...{ 'onUpdate:modelValue': {} },
        key: ('dungeon-role-' + level),
        modelValue: (__VLS_ctx.selectedSkills),
        value: ('dungeon-role-' + level),
        label: (__VLS_ctx.getSkillLabel('dungeon-role-' + level, level)),
    }));
    const __VLS_10 = __VLS_9({
        ...{ 'onUpdate:modelValue': {} },
        key: ('dungeon-role-' + level),
        modelValue: (__VLS_ctx.selectedSkills),
        value: ('dungeon-role-' + level),
        label: (__VLS_ctx.getSkillLabel('dungeon-role-' + level, level)),
    }, ...__VLS_functionalComponentArgsRest(__VLS_9));
    let __VLS_12;
    let __VLS_13;
    let __VLS_14;
    const __VLS_15 = {
        'onUpdate:modelValue': (...[$event]) => {
            __VLS_ctx.onSkillSelect('dungeon-role-' + level);
        }
    };
    var __VLS_11;
}
var __VLS_7;
var __VLS_3;
const __VLS_16 = {}.VDivider;
/** @type {[typeof __VLS_components.VDivider, typeof __VLS_components.vDivider, typeof __VLS_components.VDivider, typeof __VLS_components.vDivider, ]} */ ;
// @ts-ignore
const __VLS_17 = __VLS_asFunctionalComponent(__VLS_16, new __VLS_16({
    ...{ class: "my-4" },
}));
const __VLS_18 = __VLS_17({
    ...{ class: "my-4" },
}, ...__VLS_functionalComponentArgsRest(__VLS_17));
if (!__VLS_ctx.useNewSkillSystem) {
    const __VLS_20 = {}.VRow;
    /** @type {[typeof __VLS_components.VRow, typeof __VLS_components.vRow, typeof __VLS_components.VRow, typeof __VLS_components.vRow, ]} */ ;
    // @ts-ignore
    const __VLS_21 = __VLS_asFunctionalComponent(__VLS_20, new __VLS_20({
        noGutters: true,
        ...{ class: "justify-space-around" },
    }));
    const __VLS_22 = __VLS_21({
        noGutters: true,
        ...{ class: "justify-space-around" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_21));
    __VLS_23.slots.default;
    for (const [skill] of __VLS_getVForSourceType((__VLS_ctx.generalSkills))) {
        const __VLS_24 = {}.VCol;
        /** @type {[typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ]} */ ;
        // @ts-ignore
        const __VLS_25 = __VLS_asFunctionalComponent(__VLS_24, new __VLS_24({
            cols: "12",
            md: "2",
            lg: "2",
            key: (skill.id),
            ...{ class: "skill" },
        }));
        const __VLS_26 = __VLS_25({
            cols: "12",
            md: "2",
            lg: "2",
            key: (skill.id),
            ...{ class: "skill" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_25));
        __VLS_27.slots.default;
        __VLS_asFunctionalElement(__VLS_intrinsicElements.h3, __VLS_intrinsicElements.h3)({});
        (__VLS_ctx.t(skill.translationKey));
        for (const [level] of __VLS_getVForSourceType((2))) {
            const __VLS_28 = {}.VCheckbox;
            /** @type {[typeof __VLS_components.VCheckbox, typeof __VLS_components.vCheckbox, typeof __VLS_components.VCheckbox, typeof __VLS_components.vCheckbox, ]} */ ;
            // @ts-ignore
            const __VLS_29 = __VLS_asFunctionalComponent(__VLS_28, new __VLS_28({
                key: (skill.name + '-' + level),
                modelValue: (__VLS_ctx.selectedSkills),
                value: (skill.id + '-' + level),
                label: (`${__VLS_ctx.t('label.level')} ${level}`),
            }));
            const __VLS_30 = __VLS_29({
                key: (skill.name + '-' + level),
                modelValue: (__VLS_ctx.selectedSkills),
                value: (skill.id + '-' + level),
                label: (`${__VLS_ctx.t('label.level')} ${level}`),
            }, ...__VLS_functionalComponentArgsRest(__VLS_29));
        }
        var __VLS_27;
    }
    var __VLS_23;
}
else {
    const __VLS_32 = {}.VRow;
    /** @type {[typeof __VLS_components.VRow, typeof __VLS_components.vRow, typeof __VLS_components.VRow, typeof __VLS_components.vRow, ]} */ ;
    // @ts-ignore
    const __VLS_33 = __VLS_asFunctionalComponent(__VLS_32, new __VLS_32({
        noGutters: true,
        ...{ class: "justify-space-around" },
    }));
    const __VLS_34 = __VLS_33({
        noGutters: true,
        ...{ class: "justify-space-around" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_33));
    __VLS_35.slots.default;
    for (const [skillType, index] of __VLS_getVForSourceType((__VLS_ctx.skillTypes))) {
        const __VLS_36 = {}.VCol;
        /** @type {[typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ]} */ ;
        // @ts-ignore
        const __VLS_37 = __VLS_asFunctionalComponent(__VLS_36, new __VLS_36({
            key: (skillType),
            ...{ class: "text-center" },
            cols: "12",
            md: "6",
        }));
        const __VLS_38 = __VLS_37({
            key: (skillType),
            ...{ class: "text-center" },
            cols: "12",
            md: "6",
        }, ...__VLS_functionalComponentArgsRest(__VLS_37));
        __VLS_39.slots.default;
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "d-flex align-center justify-center mb-2" },
            ...{ style: {} },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.h3, __VLS_intrinsicElements.h3)({
            ...{ class: "text-capitalize" },
        });
        (__VLS_ctx.t("label." + skillType));
        const __VLS_40 = {}.VIcon;
        /** @type {[typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, ]} */ ;
        // @ts-ignore
        const __VLS_41 = __VLS_asFunctionalComponent(__VLS_40, new __VLS_40({
            size: "small",
            color: (__VLS_ctx.skillTypeColors[skillType]),
        }));
        const __VLS_42 = __VLS_41({
            size: "small",
            color: (__VLS_ctx.skillTypeColors[skillType]),
        }, ...__VLS_functionalComponentArgsRest(__VLS_41));
        __VLS_43.slots.default;
        var __VLS_43;
        if (__VLS_ctx.getSelectedSkillCard(skillType)) {
            const __VLS_44 = {}.VCard;
            /** @type {[typeof __VLS_components.VCard, typeof __VLS_components.vCard, typeof __VLS_components.VCard, typeof __VLS_components.vCard, ]} */ ;
            // @ts-ignore
            const __VLS_45 = __VLS_asFunctionalComponent(__VLS_44, new __VLS_44({
                ...{ 'onClick': {} },
                ...{ class: "mx-auto" },
                width: "300",
                height: "188",
                hover: true,
            }));
            const __VLS_46 = __VLS_45({
                ...{ 'onClick': {} },
                ...{ class: "mx-auto" },
                width: "300",
                height: "188",
                hover: true,
            }, ...__VLS_functionalComponentArgsRest(__VLS_45));
            let __VLS_48;
            let __VLS_49;
            let __VLS_50;
            const __VLS_51 = {
                onClick: (...[$event]) => {
                    if (!!(!__VLS_ctx.useNewSkillSystem))
                        return;
                    if (!(__VLS_ctx.getSelectedSkillCard(skillType)))
                        return;
                    __VLS_ctx.openViewSkillModal(__VLS_ctx.getSelectedSkillCard(skillType));
                }
            };
            __VLS_47.slots.default;
            const __VLS_52 = {}.VImg;
            /** @type {[typeof __VLS_components.VImg, typeof __VLS_components.vImg, typeof __VLS_components.VImg, typeof __VLS_components.vImg, ]} */ ;
            // @ts-ignore
            const __VLS_53 = __VLS_asFunctionalComponent(__VLS_52, new __VLS_52({
                src: (__VLS_ctx.getSelectedSkillCard(skillType).image),
                cover: true,
                alt: "Skill",
            }));
            const __VLS_54 = __VLS_53({
                src: (__VLS_ctx.getSelectedSkillCard(skillType).image),
                cover: true,
                alt: "Skill",
            }, ...__VLS_functionalComponentArgsRest(__VLS_53));
            var __VLS_47;
        }
        else {
            const __VLS_56 = {}.VCard;
            /** @type {[typeof __VLS_components.VCard, typeof __VLS_components.vCard, typeof __VLS_components.VCard, typeof __VLS_components.vCard, ]} */ ;
            // @ts-ignore
            const __VLS_57 = __VLS_asFunctionalComponent(__VLS_56, new __VLS_56({
                ...{ 'onClick': {} },
                ...{ style: {} },
                ...{ class: "d-flex justify-center align-center mx-auto" },
                width: "300",
                height: "188",
                hover: true,
            }));
            const __VLS_58 = __VLS_57({
                ...{ 'onClick': {} },
                ...{ style: {} },
                ...{ class: "d-flex justify-center align-center mx-auto" },
                width: "300",
                height: "188",
                hover: true,
            }, ...__VLS_functionalComponentArgsRest(__VLS_57));
            let __VLS_60;
            let __VLS_61;
            let __VLS_62;
            const __VLS_63 = {
                onClick: (...[$event]) => {
                    if (!!(!__VLS_ctx.useNewSkillSystem))
                        return;
                    if (!!(__VLS_ctx.getSelectedSkillCard(skillType)))
                        return;
                    __VLS_ctx.openAddSkillModal(skillType);
                }
            };
            __VLS_59.slots.default;
            const __VLS_64 = {}.VIcon;
            /** @type {[typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, ]} */ ;
            // @ts-ignore
            const __VLS_65 = __VLS_asFunctionalComponent(__VLS_64, new __VLS_64({
                size: "x-large",
                color: "grey",
            }));
            const __VLS_66 = __VLS_65({
                size: "x-large",
                color: "grey",
            }, ...__VLS_functionalComponentArgsRest(__VLS_65));
            __VLS_67.slots.default;
            var __VLS_67;
            var __VLS_59;
        }
        if (index < __VLS_ctx.skillTypes.length - 0) {
            const __VLS_68 = {}.VDivider;
            /** @type {[typeof __VLS_components.VDivider, typeof __VLS_components.vDivider, typeof __VLS_components.VDivider, typeof __VLS_components.vDivider, ]} */ ;
            // @ts-ignore
            const __VLS_69 = __VLS_asFunctionalComponent(__VLS_68, new __VLS_68({
                ...{ class: "my-6" },
            }));
            const __VLS_70 = __VLS_69({
                ...{ class: "my-6" },
            }, ...__VLS_functionalComponentArgsRest(__VLS_69));
        }
        var __VLS_39;
    }
    var __VLS_35;
}
const __VLS_72 = {}.VDialog;
/** @type {[typeof __VLS_components.VDialog, typeof __VLS_components.vDialog, typeof __VLS_components.VDialog, typeof __VLS_components.vDialog, ]} */ ;
// @ts-ignore
const __VLS_73 = __VLS_asFunctionalComponent(__VLS_72, new __VLS_72({
    modelValue: (__VLS_ctx.isCubeColorModalVisible),
    maxWidth: "400",
}));
const __VLS_74 = __VLS_73({
    modelValue: (__VLS_ctx.isCubeColorModalVisible),
    maxWidth: "400",
}, ...__VLS_functionalComponentArgsRest(__VLS_73));
__VLS_75.slots.default;
const __VLS_76 = {}.VCard;
/** @type {[typeof __VLS_components.VCard, typeof __VLS_components.vCard, typeof __VLS_components.VCard, typeof __VLS_components.vCard, ]} */ ;
// @ts-ignore
const __VLS_77 = __VLS_asFunctionalComponent(__VLS_76, new __VLS_76({}));
const __VLS_78 = __VLS_77({}, ...__VLS_functionalComponentArgsRest(__VLS_77));
__VLS_79.slots.default;
const __VLS_80 = {}.VCardTitle;
/** @type {[typeof __VLS_components.VCardTitle, typeof __VLS_components.vCardTitle, typeof __VLS_components.VCardTitle, typeof __VLS_components.vCardTitle, ]} */ ;
// @ts-ignore
const __VLS_81 = __VLS_asFunctionalComponent(__VLS_80, new __VLS_80({}));
const __VLS_82 = __VLS_81({}, ...__VLS_functionalComponentArgsRest(__VLS_81));
__VLS_83.slots.default;
(__VLS_ctx.t("text.select-action-cube-color"));
var __VLS_83;
const __VLS_84 = {}.VCardText;
/** @type {[typeof __VLS_components.VCardText, typeof __VLS_components.vCardText, typeof __VLS_components.VCardText, typeof __VLS_components.vCardText, ]} */ ;
// @ts-ignore
const __VLS_85 = __VLS_asFunctionalComponent(__VLS_84, new __VLS_84({}));
const __VLS_86 = __VLS_85({}, ...__VLS_functionalComponentArgsRest(__VLS_85));
__VLS_87.slots.default;
const __VLS_88 = {}.VList;
/** @type {[typeof __VLS_components.VList, typeof __VLS_components.vList, typeof __VLS_components.VList, typeof __VLS_components.vList, ]} */ ;
// @ts-ignore
const __VLS_89 = __VLS_asFunctionalComponent(__VLS_88, new __VLS_88({
    density: "compact",
}));
const __VLS_90 = __VLS_89({
    density: "compact",
}, ...__VLS_functionalComponentArgsRest(__VLS_89));
__VLS_91.slots.default;
for (const [color] of __VLS_getVForSourceType((__VLS_ctx.cubeColors))) {
    const __VLS_92 = {}.VListItem;
    /** @type {[typeof __VLS_components.VListItem, typeof __VLS_components.vListItem, typeof __VLS_components.VListItem, typeof __VLS_components.vListItem, ]} */ ;
    // @ts-ignore
    const __VLS_93 = __VLS_asFunctionalComponent(__VLS_92, new __VLS_92({
        ...{ 'onClick': {} },
        key: (color),
    }));
    const __VLS_94 = __VLS_93({
        ...{ 'onClick': {} },
        key: (color),
    }, ...__VLS_functionalComponentArgsRest(__VLS_93));
    let __VLS_96;
    let __VLS_97;
    let __VLS_98;
    const __VLS_99 = {
        onClick: (...[$event]) => {
            __VLS_ctx.setSelectedCubeColor(color);
        }
    };
    __VLS_95.slots.default;
    const __VLS_100 = {}.VListItemTitle;
    /** @type {[typeof __VLS_components.VListItemTitle, typeof __VLS_components.vListItemTitle, typeof __VLS_components.VListItemTitle, typeof __VLS_components.vListItemTitle, ]} */ ;
    // @ts-ignore
    const __VLS_101 = __VLS_asFunctionalComponent(__VLS_100, new __VLS_100({
        ...{ class: "d-flex align-center" },
        ...{ style: {} },
    }));
    const __VLS_102 = __VLS_101({
        ...{ class: "d-flex align-center" },
        ...{ style: {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_101));
    __VLS_103.slots.default;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    (__VLS_ctx.t("label." + color.toLowerCase()));
    const __VLS_104 = {}.CubeIcon;
    /** @type {[typeof __VLS_components.CubeIcon, ]} */ ;
    // @ts-ignore
    const __VLS_105 = __VLS_asFunctionalComponent(__VLS_104, new __VLS_104({
        ...{ style: ({ height: '28px', width: '28px' }) },
        ...{ class: (color.toLowerCase()) },
    }));
    const __VLS_106 = __VLS_105({
        ...{ style: ({ height: '28px', width: '28px' }) },
        ...{ class: (color.toLowerCase()) },
    }, ...__VLS_functionalComponentArgsRest(__VLS_105));
    var __VLS_103;
    var __VLS_95;
}
var __VLS_91;
var __VLS_87;
var __VLS_79;
var __VLS_75;
const __VLS_108 = {}.VDialog;
/** @type {[typeof __VLS_components.VDialog, typeof __VLS_components.vDialog, typeof __VLS_components.VDialog, typeof __VLS_components.vDialog, ]} */ ;
// @ts-ignore
const __VLS_109 = __VLS_asFunctionalComponent(__VLS_108, new __VLS_108({
    modelValue: (__VLS_ctx.isAddSkillModalVisible),
    maxWidth: "700",
}));
const __VLS_110 = __VLS_109({
    modelValue: (__VLS_ctx.isAddSkillModalVisible),
    maxWidth: "700",
}, ...__VLS_functionalComponentArgsRest(__VLS_109));
__VLS_111.slots.default;
const __VLS_112 = {}.VCard;
/** @type {[typeof __VLS_components.VCard, typeof __VLS_components.vCard, typeof __VLS_components.VCard, typeof __VLS_components.vCard, ]} */ ;
// @ts-ignore
const __VLS_113 = __VLS_asFunctionalComponent(__VLS_112, new __VLS_112({}));
const __VLS_114 = __VLS_113({}, ...__VLS_functionalComponentArgsRest(__VLS_113));
__VLS_115.slots.default;
const __VLS_116 = {}.VCardTitle;
/** @type {[typeof __VLS_components.VCardTitle, typeof __VLS_components.vCardTitle, typeof __VLS_components.VCardTitle, typeof __VLS_components.vCardTitle, ]} */ ;
// @ts-ignore
const __VLS_117 = __VLS_asFunctionalComponent(__VLS_116, new __VLS_116({
    ...{ class: "text-capitalize" },
}));
const __VLS_118 = __VLS_117({
    ...{ class: "text-capitalize" },
}, ...__VLS_functionalComponentArgsRest(__VLS_117));
__VLS_119.slots.default;
(__VLS_ctx.t("Select Skill"));
(__VLS_ctx.t("label." + __VLS_ctx.currentSkillType));
var __VLS_119;
const __VLS_120 = {}.VCardText;
/** @type {[typeof __VLS_components.VCardText, typeof __VLS_components.vCardText, typeof __VLS_components.VCardText, typeof __VLS_components.vCardText, ]} */ ;
// @ts-ignore
const __VLS_121 = __VLS_asFunctionalComponent(__VLS_120, new __VLS_120({}));
const __VLS_122 = __VLS_121({}, ...__VLS_functionalComponentArgsRest(__VLS_121));
__VLS_123.slots.default;
const __VLS_124 = {}.VRow;
/** @type {[typeof __VLS_components.VRow, typeof __VLS_components.vRow, typeof __VLS_components.VRow, typeof __VLS_components.vRow, ]} */ ;
// @ts-ignore
const __VLS_125 = __VLS_asFunctionalComponent(__VLS_124, new __VLS_124({}));
const __VLS_126 = __VLS_125({}, ...__VLS_functionalComponentArgsRest(__VLS_125));
__VLS_127.slots.default;
for (const [card] of __VLS_getVForSourceType((__VLS_ctx.availableSkillsForModal))) {
    const __VLS_128 = {}.VCol;
    /** @type {[typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ]} */ ;
    // @ts-ignore
    const __VLS_129 = __VLS_asFunctionalComponent(__VLS_128, new __VLS_128({
        key: (card.id),
        cols: "12",
    }));
    const __VLS_130 = __VLS_129({
        key: (card.id),
        cols: "12",
    }, ...__VLS_functionalComponentArgsRest(__VLS_129));
    __VLS_131.slots.default;
    const __VLS_132 = {}.VCard;
    /** @type {[typeof __VLS_components.VCard, typeof __VLS_components.vCard, typeof __VLS_components.VCard, typeof __VLS_components.vCard, ]} */ ;
    // @ts-ignore
    const __VLS_133 = __VLS_asFunctionalComponent(__VLS_132, new __VLS_132({
        ...{ 'onClick': {} },
        hover: true,
    }));
    const __VLS_134 = __VLS_133({
        ...{ 'onClick': {} },
        hover: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_133));
    let __VLS_136;
    let __VLS_137;
    let __VLS_138;
    const __VLS_139 = {
        onClick: (...[$event]) => {
            __VLS_ctx.selectSkill(card);
        }
    };
    __VLS_135.slots.default;
    const __VLS_140 = {}.VImg;
    /** @type {[typeof __VLS_components.VImg, typeof __VLS_components.vImg, typeof __VLS_components.VImg, typeof __VLS_components.vImg, ]} */ ;
    // @ts-ignore
    const __VLS_141 = __VLS_asFunctionalComponent(__VLS_140, new __VLS_140({
        src: (card.image),
        height: "240",
        alt: "Skill Card",
    }));
    const __VLS_142 = __VLS_141({
        src: (card.image),
        height: "240",
        alt: "Skill Card",
    }, ...__VLS_functionalComponentArgsRest(__VLS_141));
    const __VLS_144 = {}.VCardTitle;
    /** @type {[typeof __VLS_components.VCardTitle, typeof __VLS_components.vCardTitle, typeof __VLS_components.VCardTitle, typeof __VLS_components.vCardTitle, ]} */ ;
    // @ts-ignore
    const __VLS_145 = __VLS_asFunctionalComponent(__VLS_144, new __VLS_144({
        ...{ class: "text-subtitle-1" },
    }));
    const __VLS_146 = __VLS_145({
        ...{ class: "text-subtitle-1" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_145));
    __VLS_147.slots.default;
    (card.name);
    var __VLS_147;
    var __VLS_135;
    var __VLS_131;
}
var __VLS_127;
var __VLS_123;
var __VLS_115;
var __VLS_111;
const __VLS_148 = {}.VDialog;
/** @type {[typeof __VLS_components.VDialog, typeof __VLS_components.vDialog, typeof __VLS_components.VDialog, typeof __VLS_components.vDialog, ]} */ ;
// @ts-ignore
const __VLS_149 = __VLS_asFunctionalComponent(__VLS_148, new __VLS_148({
    modelValue: (__VLS_ctx.isViewSkillModalVisible),
    maxWidth: "500",
}));
const __VLS_150 = __VLS_149({
    modelValue: (__VLS_ctx.isViewSkillModalVisible),
    maxWidth: "500",
}, ...__VLS_functionalComponentArgsRest(__VLS_149));
__VLS_151.slots.default;
if (__VLS_ctx.skillToView) {
    const __VLS_152 = {}.VCard;
    /** @type {[typeof __VLS_components.VCard, typeof __VLS_components.vCard, typeof __VLS_components.VCard, typeof __VLS_components.vCard, ]} */ ;
    // @ts-ignore
    const __VLS_153 = __VLS_asFunctionalComponent(__VLS_152, new __VLS_152({}));
    const __VLS_154 = __VLS_153({}, ...__VLS_functionalComponentArgsRest(__VLS_153));
    __VLS_155.slots.default;
    const __VLS_156 = {}.VCardTitle;
    /** @type {[typeof __VLS_components.VCardTitle, typeof __VLS_components.vCardTitle, typeof __VLS_components.VCardTitle, typeof __VLS_components.vCardTitle, ]} */ ;
    // @ts-ignore
    const __VLS_157 = __VLS_asFunctionalComponent(__VLS_156, new __VLS_156({}));
    const __VLS_158 = __VLS_157({}, ...__VLS_functionalComponentArgsRest(__VLS_157));
    __VLS_159.slots.default;
    (__VLS_ctx.skillToView.name);
    var __VLS_159;
    const __VLS_160 = {}.VCardText;
    /** @type {[typeof __VLS_components.VCardText, typeof __VLS_components.vCardText, typeof __VLS_components.VCardText, typeof __VLS_components.vCardText, ]} */ ;
    // @ts-ignore
    const __VLS_161 = __VLS_asFunctionalComponent(__VLS_160, new __VLS_160({}));
    const __VLS_162 = __VLS_161({}, ...__VLS_functionalComponentArgsRest(__VLS_161));
    __VLS_163.slots.default;
    const __VLS_164 = {}.VImg;
    /** @type {[typeof __VLS_components.VImg, typeof __VLS_components.vImg, typeof __VLS_components.VImg, typeof __VLS_components.vImg, ]} */ ;
    // @ts-ignore
    const __VLS_165 = __VLS_asFunctionalComponent(__VLS_164, new __VLS_164({
        src: (__VLS_ctx.skillToView.image),
        alt: "Skill Card Detail",
    }));
    const __VLS_166 = __VLS_165({
        src: (__VLS_ctx.skillToView.image),
        alt: "Skill Card Detail",
    }, ...__VLS_functionalComponentArgsRest(__VLS_165));
    var __VLS_163;
    const __VLS_168 = {}.VCardActions;
    /** @type {[typeof __VLS_components.VCardActions, typeof __VLS_components.vCardActions, typeof __VLS_components.VCardActions, typeof __VLS_components.vCardActions, ]} */ ;
    // @ts-ignore
    const __VLS_169 = __VLS_asFunctionalComponent(__VLS_168, new __VLS_168({}));
    const __VLS_170 = __VLS_169({}, ...__VLS_functionalComponentArgsRest(__VLS_169));
    __VLS_171.slots.default;
    const __VLS_172 = {}.VSpacer;
    /** @type {[typeof __VLS_components.VSpacer, typeof __VLS_components.vSpacer, typeof __VLS_components.VSpacer, typeof __VLS_components.vSpacer, ]} */ ;
    // @ts-ignore
    const __VLS_173 = __VLS_asFunctionalComponent(__VLS_172, new __VLS_172({}));
    const __VLS_174 = __VLS_173({}, ...__VLS_functionalComponentArgsRest(__VLS_173));
    const __VLS_176 = {}.VBtn;
    /** @type {[typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ]} */ ;
    // @ts-ignore
    const __VLS_177 = __VLS_asFunctionalComponent(__VLS_176, new __VLS_176({
        ...{ 'onClick': {} },
        color: "error",
        variant: "elevated",
    }));
    const __VLS_178 = __VLS_177({
        ...{ 'onClick': {} },
        color: "error",
        variant: "elevated",
    }, ...__VLS_functionalComponentArgsRest(__VLS_177));
    let __VLS_180;
    let __VLS_181;
    let __VLS_182;
    const __VLS_183 = {
        onClick: (__VLS_ctx.deleteSkill)
    };
    __VLS_179.slots.default;
    (__VLS_ctx.t("Delete"));
    var __VLS_179;
    const __VLS_184 = {}.VBtn;
    /** @type {[typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ]} */ ;
    // @ts-ignore
    const __VLS_185 = __VLS_asFunctionalComponent(__VLS_184, new __VLS_184({
        ...{ 'onClick': {} },
    }));
    const __VLS_186 = __VLS_185({
        ...{ 'onClick': {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_185));
    let __VLS_188;
    let __VLS_189;
    let __VLS_190;
    const __VLS_191 = {
        onClick: (...[$event]) => {
            if (!(__VLS_ctx.skillToView))
                return;
            __VLS_ctx.isViewSkillModalVisible = false;
        }
    };
    __VLS_187.slots.default;
    (__VLS_ctx.t("Close"));
    var __VLS_187;
    var __VLS_171;
    var __VLS_155;
}
var __VLS_151;
/** @type {__VLS_StyleScopedClasses['justify-space-around']} */ ;
/** @type {__VLS_StyleScopedClasses['skill']} */ ;
/** @type {__VLS_StyleScopedClasses['d-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['ga-4']} */ ;
/** @type {__VLS_StyleScopedClasses['my-4']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-space-around']} */ ;
/** @type {__VLS_StyleScopedClasses['skill']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-space-around']} */ ;
/** @type {__VLS_StyleScopedClasses['text-center']} */ ;
/** @type {__VLS_StyleScopedClasses['d-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['align-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-capitalize']} */ ;
/** @type {__VLS_StyleScopedClasses['mx-auto']} */ ;
/** @type {__VLS_StyleScopedClasses['d-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['align-center']} */ ;
/** @type {__VLS_StyleScopedClasses['mx-auto']} */ ;
/** @type {__VLS_StyleScopedClasses['my-6']} */ ;
/** @type {__VLS_StyleScopedClasses['d-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['align-center']} */ ;
/** @type {__VLS_StyleScopedClasses['text-capitalize']} */ ;
/** @type {__VLS_StyleScopedClasses['text-subtitle-1']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            CubeIcon: CubeIcon,
            t: t,
            useNewSkillSystem: useNewSkillSystem,
            generalSkills: generalSkills,
            selectedSkills: selectedSkills,
            isCubeColorModalVisible: isCubeColorModalVisible,
            cubeColors: cubeColors,
            getSkillLabel: getSkillLabel,
            onSkillSelect: onSkillSelect,
            setSelectedCubeColor: setSelectedCubeColor,
            skillTypes: skillTypes,
            isAddSkillModalVisible: isAddSkillModalVisible,
            isViewSkillModalVisible: isViewSkillModalVisible,
            currentSkillType: currentSkillType,
            skillToView: skillToView,
            skillTypeColors: skillTypeColors,
            getSelectedSkillCard: getSelectedSkillCard,
            availableSkillsForModal: availableSkillsForModal,
            openAddSkillModal: openAddSkillModal,
            openViewSkillModal: openViewSkillModal,
            selectSkill: selectSkill,
            deleteSkill: deleteSkill,
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
