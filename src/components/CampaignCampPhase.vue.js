/// <reference types="../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import { ref } from "vue";
import { CampaignStore } from "@/store/CampaignStore";
import { HeroStore } from "@/store/HeroStore";
import { useI18n } from "vue-i18n";
const emit = defineEmits(["campPhase"]);
const { t } = useI18n();
const visible = ref(false);
const campaignStore = CampaignStore();
const heroStore = HeroStore();
function openModal() {
    visible.value = true;
}
function closeModal() {
    visible.value = false;
}
const props = defineProps();
function campPhase() {
    const campaign = campaignStore.find(props.campaignId);
    campaign.statusIds = [];
    campaign.isSequentialAdventure = false;
    campaign.sequentialAdventureRunes = 0;
    heroStore.findAllInCampaign(props.campaignId).forEach((hero) => {
        hero.statusIds = [];
        hero.sequentialAdventureState = null;
    });
    closeModal();
    emit("campPhase");
}
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
// CSS variable injection 
// CSS variable injection end 
const __VLS_0 = {}.VBtn;
/** @type {[typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ]} */ ;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
    ...{ 'onClick': {} },
    variant: "elevated",
    id: "camp-phase",
    ...{ class: "px-6 my-2" },
    rounded: true,
}));
const __VLS_2 = __VLS_1({
    ...{ 'onClick': {} },
    variant: "elevated",
    id: "camp-phase",
    ...{ class: "px-6 my-2" },
    rounded: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
let __VLS_4;
let __VLS_5;
let __VLS_6;
const __VLS_7 = {
    onClick: (__VLS_ctx.openModal)
};
__VLS_3.slots.default;
const __VLS_8 = {}.VIcon;
/** @type {[typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, ]} */ ;
// @ts-ignore
const __VLS_9 = __VLS_asFunctionalComponent(__VLS_8, new __VLS_8({
    start: true,
}));
const __VLS_10 = __VLS_9({
    start: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_9));
__VLS_11.slots.default;
var __VLS_11;
(__VLS_ctx.t("label.camp-phase"));
var __VLS_3;
const __VLS_12 = {}.VDialog;
/** @type {[typeof __VLS_components.VDialog, typeof __VLS_components.vDialog, typeof __VLS_components.VDialog, typeof __VLS_components.vDialog, ]} */ ;
// @ts-ignore
const __VLS_13 = __VLS_asFunctionalComponent(__VLS_12, new __VLS_12({
    modelValue: (__VLS_ctx.visible),
    modal: true,
}));
const __VLS_14 = __VLS_13({
    modelValue: (__VLS_ctx.visible),
    modal: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_13));
__VLS_15.slots.default;
const __VLS_16 = {}.VCard;
/** @type {[typeof __VLS_components.VCard, typeof __VLS_components.vCard, typeof __VLS_components.VCard, typeof __VLS_components.vCard, ]} */ ;
// @ts-ignore
const __VLS_17 = __VLS_asFunctionalComponent(__VLS_16, new __VLS_16({}));
const __VLS_18 = __VLS_17({}, ...__VLS_functionalComponentArgsRest(__VLS_17));
__VLS_19.slots.default;
const __VLS_20 = {}.VCardTitle;
/** @type {[typeof __VLS_components.VCardTitle, typeof __VLS_components.vCardTitle, typeof __VLS_components.VCardTitle, typeof __VLS_components.vCardTitle, ]} */ ;
// @ts-ignore
const __VLS_21 = __VLS_asFunctionalComponent(__VLS_20, new __VLS_20({
    ...{ class: "text-center" },
}));
const __VLS_22 = __VLS_21({
    ...{ class: "text-center" },
}, ...__VLS_functionalComponentArgsRest(__VLS_21));
__VLS_23.slots.default;
(__VLS_ctx.t("label.camp-phase"));
var __VLS_23;
const __VLS_24 = {}.VCardText;
/** @type {[typeof __VLS_components.VCardText, typeof __VLS_components.vCardText, typeof __VLS_components.VCardText, typeof __VLS_components.vCardText, ]} */ ;
// @ts-ignore
const __VLS_25 = __VLS_asFunctionalComponent(__VLS_24, new __VLS_24({}));
const __VLS_26 = __VLS_25({}, ...__VLS_functionalComponentArgsRest(__VLS_25));
__VLS_27.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
(__VLS_ctx.t("text.reset-state"));
var __VLS_27;
const __VLS_28 = {}.VDivider;
/** @type {[typeof __VLS_components.VDivider, typeof __VLS_components.vDivider, typeof __VLS_components.VDivider, typeof __VLS_components.vDivider, ]} */ ;
// @ts-ignore
const __VLS_29 = __VLS_asFunctionalComponent(__VLS_28, new __VLS_28({}));
const __VLS_30 = __VLS_29({}, ...__VLS_functionalComponentArgsRest(__VLS_29));
const __VLS_32 = {}.VCardAction;
/** @type {[typeof __VLS_components.VCardAction, typeof __VLS_components.vCardAction, typeof __VLS_components.VCardAction, typeof __VLS_components.vCardAction, ]} */ ;
// @ts-ignore
const __VLS_33 = __VLS_asFunctionalComponent(__VLS_32, new __VLS_32({}));
const __VLS_34 = __VLS_33({}, ...__VLS_functionalComponentArgsRest(__VLS_33));
__VLS_35.slots.default;
const __VLS_36 = {}.VRow;
/** @type {[typeof __VLS_components.VRow, typeof __VLS_components.vRow, typeof __VLS_components.VRow, typeof __VLS_components.vRow, ]} */ ;
// @ts-ignore
const __VLS_37 = __VLS_asFunctionalComponent(__VLS_36, new __VLS_36({
    noGutters: true,
}));
const __VLS_38 = __VLS_37({
    noGutters: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_37));
__VLS_39.slots.default;
const __VLS_40 = {}.VCol;
/** @type {[typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ]} */ ;
// @ts-ignore
const __VLS_41 = __VLS_asFunctionalComponent(__VLS_40, new __VLS_40({
    cols: "12",
    ...{ class: "d-flex flex-row justify-center" },
}));
const __VLS_42 = __VLS_41({
    cols: "12",
    ...{ class: "d-flex flex-row justify-center" },
}, ...__VLS_functionalComponentArgsRest(__VLS_41));
__VLS_43.slots.default;
const __VLS_44 = {}.VBtn;
/** @type {[typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ]} */ ;
// @ts-ignore
const __VLS_45 = __VLS_asFunctionalComponent(__VLS_44, new __VLS_44({
    ...{ 'onClick': {} },
    variant: "text",
    width: "100%",
}));
const __VLS_46 = __VLS_45({
    ...{ 'onClick': {} },
    variant: "text",
    width: "100%",
}, ...__VLS_functionalComponentArgsRest(__VLS_45));
let __VLS_48;
let __VLS_49;
let __VLS_50;
const __VLS_51 = {
    onClick: (__VLS_ctx.campPhase)
};
__VLS_47.slots.default;
(__VLS_ctx.t("label.yes"));
var __VLS_47;
var __VLS_43;
const __VLS_52 = {}.VDivider;
/** @type {[typeof __VLS_components.VDivider, typeof __VLS_components.vDivider, typeof __VLS_components.VDivider, typeof __VLS_components.vDivider, ]} */ ;
// @ts-ignore
const __VLS_53 = __VLS_asFunctionalComponent(__VLS_52, new __VLS_52({
    vertical: true,
}));
const __VLS_54 = __VLS_53({
    vertical: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_53));
const __VLS_56 = {}.VCol;
/** @type {[typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ]} */ ;
// @ts-ignore
const __VLS_57 = __VLS_asFunctionalComponent(__VLS_56, new __VLS_56({
    cols: "12",
    ...{ class: "d-flex flex-row justify-center" },
}));
const __VLS_58 = __VLS_57({
    cols: "12",
    ...{ class: "d-flex flex-row justify-center" },
}, ...__VLS_functionalComponentArgsRest(__VLS_57));
__VLS_59.slots.default;
const __VLS_60 = {}.VBtn;
/** @type {[typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ]} */ ;
// @ts-ignore
const __VLS_61 = __VLS_asFunctionalComponent(__VLS_60, new __VLS_60({
    ...{ 'onClick': {} },
    variant: "text",
    width: "100%",
    color: "red-accent-2",
}));
const __VLS_62 = __VLS_61({
    ...{ 'onClick': {} },
    variant: "text",
    width: "100%",
    color: "red-accent-2",
}, ...__VLS_functionalComponentArgsRest(__VLS_61));
let __VLS_64;
let __VLS_65;
let __VLS_66;
const __VLS_67 = {
    onClick: (__VLS_ctx.closeModal)
};
__VLS_63.slots.default;
(__VLS_ctx.t("label.no"));
var __VLS_63;
var __VLS_59;
var __VLS_39;
var __VLS_35;
var __VLS_19;
var __VLS_15;
/** @type {__VLS_StyleScopedClasses['px-6']} */ ;
/** @type {__VLS_StyleScopedClasses['my-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-center']} */ ;
/** @type {__VLS_StyleScopedClasses['d-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-row']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['d-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-row']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            t: t,
            visible: visible,
            openModal: openModal,
            closeModal: closeModal,
            campPhase: campPhase,
        };
    },
    emits: {},
    __typeProps: {},
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
    emits: {},
    __typeProps: {},
});
; /* PartiallyEnd: #4569/main.vue */
