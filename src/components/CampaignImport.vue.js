/// <reference types="../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import { ref } from "vue";
import { CampaignStore } from "@/store/CampaignStore";
import { HeroStore } from "@/store/HeroStore";
import { useRouter } from "vue-router";
import { Campaign } from "@/store/Campaign";
import { customAlphabet } from "nanoid";
import { HeroEquipment } from "@/store/Hero";
import { useToast } from "primevue/usetoast";
import { useI18n } from "vue-i18n";
const toast = useToast();
const visible = ref(false);
const campaignStore = CampaignStore();
const heroStore = HeroStore();
const router = useRouter();
const nanoid = customAlphabet("1234567890", 5);
const { t } = useI18n();
const token = ref("");
function importCampaign() {
    try {
        const data = JSON.parse(atob(token.value));
        const campaignId = nanoid();
        let campaign;
        if ("campaign" in data || "name" in data) {
            // This means that it's a legacy token
            campaign = new Campaign(campaignId, data.campaign);
            campaign.name = data.name ?? "";
        }
        else if ("campaignData" in data) {
            campaign = data.campaignData;
            campaign.campaignId = campaignId;
        }
        else {
            toast.add({
                severity: "error",
                summary: "Error",
                detail: "Invalid token.",
                life: 3000,
            });
            return;
        }
        campaignStore.add(campaign);
        const heroes = data.heroes;
        heroes.forEach((h) => {
            h.campaignId = campaignId;
            if (typeof h.equipment === "undefined") {
                h.equipment = new HeroEquipment();
            }
            if (typeof h.sequentialAdventureState === "undefined") {
                h.sequentialAdventureState = null;
            }
            heroStore.add(h);
        });
        closeModal();
        toast.add({
            severity: "success",
            summary: t("label.success"),
            detail: t("text.campaign-imported"),
            life: 3000,
        });
        router.push({ name: "Campaign", params: { id: campaignId } });
    }
    catch (e) {
        toast.add({
            severity: "error",
            summary: "Error",
            detail: "Invalid token",
            life: 3000,
        });
        return;
    }
}
function openModal() {
    visible.value = true;
}
function closeModal() {
    visible.value = false;
}
const __VLS_exposed = {
    openModal
};
defineExpose(__VLS_exposed);
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
    id: "campaign-import",
    rounded: true,
}));
const __VLS_2 = __VLS_1({
    ...{ 'onClick': {} },
    variant: "elevated",
    id: "campaign-import",
    rounded: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
let __VLS_4;
let __VLS_5;
let __VLS_6;
const __VLS_7 = {
    onClick: (__VLS_ctx.openModal)
};
__VLS_3.slots.default;
(__VLS_ctx.t("label.import-campaign"));
var __VLS_3;
const __VLS_8 = {}.VDialog;
/** @type {[typeof __VLS_components.VDialog, typeof __VLS_components.vDialog, typeof __VLS_components.VDialog, typeof __VLS_components.vDialog, ]} */ ;
// @ts-ignore
const __VLS_9 = __VLS_asFunctionalComponent(__VLS_8, new __VLS_8({
    modelValue: (__VLS_ctx.visible),
}));
const __VLS_10 = __VLS_9({
    modelValue: (__VLS_ctx.visible),
}, ...__VLS_functionalComponentArgsRest(__VLS_9));
__VLS_11.slots.default;
const __VLS_12 = {}.VCard;
/** @type {[typeof __VLS_components.VCard, typeof __VLS_components.vCard, typeof __VLS_components.VCard, typeof __VLS_components.vCard, ]} */ ;
// @ts-ignore
const __VLS_13 = __VLS_asFunctionalComponent(__VLS_12, new __VLS_12({}));
const __VLS_14 = __VLS_13({}, ...__VLS_functionalComponentArgsRest(__VLS_13));
__VLS_15.slots.default;
const __VLS_16 = {}.VCardTitle;
/** @type {[typeof __VLS_components.VCardTitle, typeof __VLS_components.vCardTitle, typeof __VLS_components.VCardTitle, typeof __VLS_components.vCardTitle, ]} */ ;
// @ts-ignore
const __VLS_17 = __VLS_asFunctionalComponent(__VLS_16, new __VLS_16({
    ...{ class: "text-center" },
}));
const __VLS_18 = __VLS_17({
    ...{ class: "text-center" },
}, ...__VLS_functionalComponentArgsRest(__VLS_17));
__VLS_19.slots.default;
(__VLS_ctx.t("label.import-campaign"));
var __VLS_19;
const __VLS_20 = {}.VCardText;
/** @type {[typeof __VLS_components.VCardText, typeof __VLS_components.vCardText, typeof __VLS_components.VCardText, typeof __VLS_components.vCardText, ]} */ ;
// @ts-ignore
const __VLS_21 = __VLS_asFunctionalComponent(__VLS_20, new __VLS_20({}));
const __VLS_22 = __VLS_21({}, ...__VLS_functionalComponentArgsRest(__VLS_21));
__VLS_23.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "py-4" },
});
(__VLS_ctx.t("text.input-token"));
const __VLS_24 = {}.VTextarea;
/** @type {[typeof __VLS_components.VTextarea, typeof __VLS_components.vTextarea, typeof __VLS_components.VTextarea, typeof __VLS_components.vTextarea, ]} */ ;
// @ts-ignore
const __VLS_25 = __VLS_asFunctionalComponent(__VLS_24, new __VLS_24({
    id: "campaign-token",
    modelValue: (__VLS_ctx.token),
}));
const __VLS_26 = __VLS_25({
    id: "campaign-token",
    modelValue: (__VLS_ctx.token),
}, ...__VLS_functionalComponentArgsRest(__VLS_25));
var __VLS_23;
const __VLS_28 = {}.VDivider;
/** @type {[typeof __VLS_components.VDivider, typeof __VLS_components.vDivider, typeof __VLS_components.VDivider, typeof __VLS_components.vDivider, ]} */ ;
// @ts-ignore
const __VLS_29 = __VLS_asFunctionalComponent(__VLS_28, new __VLS_28({}));
const __VLS_30 = __VLS_29({}, ...__VLS_functionalComponentArgsRest(__VLS_29));
const __VLS_32 = {}.VCardActions;
/** @type {[typeof __VLS_components.VCardActions, typeof __VLS_components.vCardActions, typeof __VLS_components.VCardActions, typeof __VLS_components.vCardActions, ]} */ ;
// @ts-ignore
const __VLS_33 = __VLS_asFunctionalComponent(__VLS_32, new __VLS_32({
    ...{ class: "d-flex flex-row justify-space-around" },
}));
const __VLS_34 = __VLS_33({
    ...{ class: "d-flex flex-row justify-space-around" },
}, ...__VLS_functionalComponentArgsRest(__VLS_33));
__VLS_35.slots.default;
const __VLS_36 = {}.VBtn;
/** @type {[typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ]} */ ;
// @ts-ignore
const __VLS_37 = __VLS_asFunctionalComponent(__VLS_36, new __VLS_36({
    ...{ 'onClick': {} },
    outlined: true,
    id: "import-button",
}));
const __VLS_38 = __VLS_37({
    ...{ 'onClick': {} },
    outlined: true,
    id: "import-button",
}, ...__VLS_functionalComponentArgsRest(__VLS_37));
let __VLS_40;
let __VLS_41;
let __VLS_42;
const __VLS_43 = {
    onClick: (__VLS_ctx.importCampaign)
};
__VLS_39.slots.default;
(__VLS_ctx.t("label.import"));
var __VLS_39;
const __VLS_44 = {}.VBtn;
/** @type {[typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ]} */ ;
// @ts-ignore
const __VLS_45 = __VLS_asFunctionalComponent(__VLS_44, new __VLS_44({
    ...{ 'onClick': {} },
    outlined: true,
    id: "import-button",
}));
const __VLS_46 = __VLS_45({
    ...{ 'onClick': {} },
    outlined: true,
    id: "import-button",
}, ...__VLS_functionalComponentArgsRest(__VLS_45));
let __VLS_48;
let __VLS_49;
let __VLS_50;
const __VLS_51 = {
    onClick: (__VLS_ctx.closeModal)
};
__VLS_47.slots.default;
(__VLS_ctx.t("label.cancel"));
var __VLS_47;
var __VLS_35;
var __VLS_15;
var __VLS_11;
/** @type {__VLS_StyleScopedClasses['text-center']} */ ;
/** @type {__VLS_StyleScopedClasses['py-4']} */ ;
/** @type {__VLS_StyleScopedClasses['d-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-row']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-space-around']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            visible: visible,
            t: t,
            token: token,
            importCampaign: importCampaign,
            openModal: openModal,
            closeModal: closeModal,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {
            ...__VLS_exposed,
        };
    },
});
; /* PartiallyEnd: #4569/main.vue */
