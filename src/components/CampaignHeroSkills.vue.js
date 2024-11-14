import { ref, watch } from "vue";
import { HeroStore } from "@/store/HeroStore";
import BaseList from "@/components/BaseList.vue";
import BaseListItem from "@/components/BaseListItem.vue";
import { CubeIcon } from "@heroicons/vue/24/solid";
import { useI18n } from "vue-i18n";
const { defineProps, defineSlots, defineEmits, defineExpose, defineModel, defineOptions, withDefaults, } = await import('vue');
const heroStore = HeroStore();
const props = defineProps();
const visible = ref(false);
const selectedSkillId = ref("");
const { t } = useI18n();
const cubeColors = ["Yellow", "Red", "Green", "Blue"];
const skills = [
    { id: "dungeon-role", name: "Dungeon Role", translationKey: "label.dungeon-role" },
    { id: "melee", name: "Melee", translationKey: "label.melee" },
    { id: "ranged", name: "Ranged", translationKey: "label.ranged" },
    { id: "agility", name: "Agility", translationKey: "label.agility" },
    { id: "wisdom", name: "Wisdom", translationKey: "label.wisdom" },
];
const hero = heroStore.findInCampaign(props.heroId, props.campaignId);
const selectedSkills = ref([]);
if (typeof hero.skillIds === "undefined")
    hero.skillIds = [];
hero.skillIds.forEach((s) => selectedSkills.value.push(s));
if (typeof hero.dungeonRoleSkillCubeColors === "undefined") {
    hero.dungeonRoleSkillCubeColors = {
        rankOne: null,
        rankTwo: null,
    };
}
function getSkillLabel(skillId, level) {
    if (!skillId.startsWith("dungeon-role")) {
        return `${t("label.level")} ${level}`;
    }
    const selectedCubes = heroStore.findInCampaign(props.heroId, props.campaignId).dungeonRoleSkillCubeColors;
    const selectedCube = level === 1 ? selectedCubes.rankOne : selectedCubes.rankTwo;
    return selectedCube !== null
        ? `${t("label.level")} ${level} (${t("label." + selectedCube.toLowerCase())})`
        : `${t("label.level")} ${level}`;
}
function openModal() {
    visible.value = true;
}
function closeModal() {
    visible.value = false;
}
function onSkillSelect(skillId) {
    if (!skillId.startsWith("dungeon-role")) {
        return;
    }
    const wasSelected = selectedSkills.value.filter((selectedSkillId) => selectedSkillId === skillId).length > 0;
    if (!wasSelected) {
        clearCubeColor(skillId);
        return;
    }
    selectedSkillId.value = skillId;
    openModal();
}
function clearCubeColor(skillId) {
    if (skillId === "dungeon-role-1") {
        heroStore.findInCampaign(props.heroId, props.campaignId).dungeonRoleSkillCubeColors.rankOne = null;
    }
    else if (skillId === "dungeon-role-2") {
        heroStore.findInCampaign(props.heroId, props.campaignId).dungeonRoleSkillCubeColors.rankTwo = null;
    }
}
function setSelectedCubeColor(color) {
    if (selectedSkillId.value === "dungeon-role-1") {
        heroStore.findInCampaign(props.heroId, props.campaignId).dungeonRoleSkillCubeColors.rankOne = color;
    }
    else if (selectedSkillId.value === "dungeon-role-2") {
        heroStore.findInCampaign(props.heroId, props.campaignId).dungeonRoleSkillCubeColors.rankTwo = color;
    }
    closeModal();
}
watch(selectedSkills, (newSkills) => {
    heroStore.findInCampaign(props.heroId, props.campaignId).skillIds = newSkills;
});
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
    __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ ...{ class: ("w-full skill-container") }, });
    for (const [skill] of __VLS_getVForSourceType((__VLS_ctx.skills))) {
        __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ key: ((skill.id)), ...{ class: ("skill") }, });
        __VLS_elementAsFunction(__VLS_intrinsicElements.h3, __VLS_intrinsicElements.h3)({});
        (__VLS_ctx.t(skill.translationKey));
        for (const [level] of __VLS_getVForSourceType((2))) {
            __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ key: ((skill.name + '-' + level)), });
            __VLS_elementAsFunction(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({ key: ((skill.id + '-' + level)), });
            const __VLS_0 = __VLS_resolvedLocalAndGlobalComponents.Checkbox;
            /** @type { [typeof __VLS_components.Checkbox, ] } */
            // @ts-ignore
            const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({ ...{ 'onChange': {} }, variant: ("outlined"), dataTestid: ((skill.id + '-' + level)), modelValue: ((__VLS_ctx.selectedSkills)), value: ((skill.id + '-' + level)), }));
            const __VLS_2 = __VLS_1({ ...{ 'onChange': {} }, variant: ("outlined"), dataTestid: ((skill.id + '-' + level)), modelValue: ((__VLS_ctx.selectedSkills)), value: ((skill.id + '-' + level)), }, ...__VLS_functionalComponentArgsRest(__VLS_1));
            let __VLS_6;
            const __VLS_7 = {
                onChange: (() => __VLS_ctx.onSkillSelect(skill.id + '-' + level))
            };
            let __VLS_3;
            let __VLS_4;
            var __VLS_5;
            __VLS_elementAsFunction(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({ ...{ class: ("ml-1 skill-label") }, });
            (__VLS_ctx.getSkillLabel(skill.id + "-" + level, level));
        }
    }
    const __VLS_8 = __VLS_resolvedLocalAndGlobalComponents.Dialog;
    /** @type { [typeof __VLS_components.Dialog, typeof __VLS_components.Dialog, ] } */
    // @ts-ignore
    const __VLS_9 = __VLS_asFunctionalComponent(__VLS_8, new __VLS_8({ visible: ((__VLS_ctx.visible)), modal: (true), header: ((__VLS_ctx.t('text.select-action-cube-color'))), dismissableMask: ((true)), ...{ class: ("w-full md:w-1/3 m-2") }, }));
    const __VLS_10 = __VLS_9({ visible: ((__VLS_ctx.visible)), modal: (true), header: ((__VLS_ctx.t('text.select-action-cube-color'))), dismissableMask: ((true)), ...{ class: ("w-full md:w-1/3 m-2") }, }, ...__VLS_functionalComponentArgsRest(__VLS_9));
    // @ts-ignore
    [BaseList, BaseList,];
    // @ts-ignore
    const __VLS_14 = __VLS_asFunctionalComponent(BaseList, new BaseList({}));
    const __VLS_15 = __VLS_14({}, ...__VLS_functionalComponentArgsRest(__VLS_14));
    for (const [color] of __VLS_getVForSourceType((__VLS_ctx.cubeColors))) {
        // @ts-ignore
        [BaseListItem, BaseListItem,];
        // @ts-ignore
        const __VLS_19 = __VLS_asFunctionalComponent(BaseListItem, new BaseListItem({ ...{ 'onClick': {} }, }));
        const __VLS_20 = __VLS_19({ ...{ 'onClick': {} }, }, ...__VLS_functionalComponentArgsRest(__VLS_19));
        let __VLS_24;
        const __VLS_25 = {
            onClick: (...[$event]) => {
                __VLS_ctx.setSelectedCubeColor(color);
            }
        };
        let __VLS_21;
        let __VLS_22;
        __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ ...{ class: ("flex pt-3 pb-2 pl-3 w-full rounded-lg") }, });
        const __VLS_26 = __VLS_resolvedLocalAndGlobalComponents.CubeIcon;
        /** @type { [typeof __VLS_components.CubeIcon, ] } */
        // @ts-ignore
        const __VLS_27 = __VLS_asFunctionalComponent(__VLS_26, new __VLS_26({ ...{ class: (('h-5 w-5 ' + color.toLowerCase())) }, }));
        const __VLS_28 = __VLS_27({ ...{ class: (('h-5 w-5 ' + color.toLowerCase())) }, }, ...__VLS_functionalComponentArgsRest(__VLS_27));
        __VLS_elementAsFunction(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({ ...{ class: ("ml-2") }, });
        (__VLS_ctx.t("label." + color.toLowerCase()));
        __VLS_nonNullable(__VLS_23.slots).default;
        var __VLS_23;
    }
    __VLS_nonNullable(__VLS_18.slots).default;
    var __VLS_18;
    __VLS_nonNullable(__VLS_13.slots).default;
    var __VLS_13;
    __VLS_styleScopedClasses['w-full'];
    __VLS_styleScopedClasses['skill-container'];
    __VLS_styleScopedClasses['skill'];
    __VLS_styleScopedClasses['ml-1'];
    __VLS_styleScopedClasses['skill-label'];
    __VLS_styleScopedClasses['w-full'];
    __VLS_styleScopedClasses['md:w-1/3'];
    __VLS_styleScopedClasses['m-2'];
    __VLS_styleScopedClasses['flex'];
    __VLS_styleScopedClasses['pt-3'];
    __VLS_styleScopedClasses['pb-2'];
    __VLS_styleScopedClasses['pl-3'];
    __VLS_styleScopedClasses['w-full'];
    __VLS_styleScopedClasses['rounded-lg'];
    __VLS_styleScopedClasses['ml-2'];
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
            BaseList: BaseList,
            BaseListItem: BaseListItem,
            CubeIcon: CubeIcon,
            visible: visible,
            t: t,
            cubeColors: cubeColors,
            skills: skills,
            selectedSkills: selectedSkills,
            getSkillLabel: getSkillLabel,
            onSkillSelect: onSkillSelect,
            setSelectedCubeColor: setSelectedCubeColor,
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
