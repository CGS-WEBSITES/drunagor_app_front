import { ref } from "vue";
import { CampaignStore } from "@/store/CampaignStore";
import { HeroStore } from "@/store/HeroStore";
import { useRouter } from "vue-router";
import { Campaign } from "@/store/Campaign";
import { customAlphabet } from "nanoid";
import { HeroEquipment } from "@/store/Hero";
import { useToast } from "primevue/usetoast";
import { useI18n } from "vue-i18n";
const { defineProps, defineSlots, defineEmits, defineExpose, defineModel, defineOptions, withDefaults, } = await import('vue');
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
            toast.add({ severity: "error", summary: "Error", detail: "Invalid token.", life: 3000 });
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
        toast.add({ severity: "success", summary: t("label.success"), detail: t("text.campaign-imported"), life: 3000 });
        router.push({ name: "Campaign", params: { id: campaignId } });
    }
    catch (e) {
        toast.add({ severity: "error", summary: "Error", detail: "Invalid token", life: 3000 });
        return;
    }
}
function openModal() {
    visible.value = true;
}
function closeModal() {
    visible.value = false;
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
    const __VLS_0 = __VLS_resolvedLocalAndGlobalComponents.Button;
    /** @type { [typeof __VLS_components.Button, typeof __VLS_components.Button, ] } */
    // @ts-ignore
    const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({ ...{ 'onClick': {} }, outlined: (true), id: ("campaign-import"), label: ((__VLS_ctx.t('label.import-campaign'))), }));
    const __VLS_2 = __VLS_1({ ...{ 'onClick': {} }, outlined: (true), id: ("campaign-import"), label: ((__VLS_ctx.t('label.import-campaign'))), }, ...__VLS_functionalComponentArgsRest(__VLS_1));
    let __VLS_6;
    const __VLS_7 = {
        onClick: (__VLS_ctx.openModal)
    };
    let __VLS_3;
    let __VLS_4;
    var __VLS_5;
    const __VLS_8 = __VLS_resolvedLocalAndGlobalComponents.Dialog;
    /** @type { [typeof __VLS_components.Dialog, typeof __VLS_components.Dialog, ] } */
    // @ts-ignore
    const __VLS_9 = __VLS_asFunctionalComponent(__VLS_8, new __VLS_8({ visible: ((__VLS_ctx.visible)), modal: (true), header: ((__VLS_ctx.t('label.import-campaign'))), dismissableMask: ((true)), ...{ class: ("w-full md:w-1/3 m-2") }, }));
    const __VLS_10 = __VLS_9({ visible: ((__VLS_ctx.visible)), modal: (true), header: ((__VLS_ctx.t('label.import-campaign'))), dismissableMask: ((true)), ...{ class: ("w-full md:w-1/3 m-2") }, }, ...__VLS_functionalComponentArgsRest(__VLS_9));
    __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ ...{ class: ("py-4") }, });
    (__VLS_ctx.t("text.input-token"));
    const __VLS_14 = __VLS_resolvedLocalAndGlobalComponents.Textarea;
    /** @type { [typeof __VLS_components.Textarea, typeof __VLS_components.Textarea, ] } */
    // @ts-ignore
    const __VLS_15 = __VLS_asFunctionalComponent(__VLS_14, new __VLS_14({ id: ("campaign-token"), modelValue: ((__VLS_ctx.token)), rows: ("5"), cols: ("25"), ...{ class: ("w-full") }, }));
    const __VLS_16 = __VLS_15({ id: ("campaign-token"), modelValue: ((__VLS_ctx.token)), rows: ("5"), cols: ("25"), ...{ class: ("w-full") }, }, ...__VLS_functionalComponentArgsRest(__VLS_15));
    const __VLS_20 = __VLS_resolvedLocalAndGlobalComponents.BaseButtonMenu;
    /** @type { [typeof __VLS_components.BaseButtonMenu, typeof __VLS_components.BaseButtonMenu, ] } */
    // @ts-ignore
    const __VLS_21 = __VLS_asFunctionalComponent(__VLS_20, new __VLS_20({}));
    const __VLS_22 = __VLS_21({}, ...__VLS_functionalComponentArgsRest(__VLS_21));
    const __VLS_26 = __VLS_resolvedLocalAndGlobalComponents.Button;
    /** @type { [typeof __VLS_components.Button, typeof __VLS_components.Button, ] } */
    // @ts-ignore
    const __VLS_27 = __VLS_asFunctionalComponent(__VLS_26, new __VLS_26({ ...{ 'onClick': {} }, outlined: (true), id: ("import-button"), label: ((__VLS_ctx.t('label.import'))), }));
    const __VLS_28 = __VLS_27({ ...{ 'onClick': {} }, outlined: (true), id: ("import-button"), label: ((__VLS_ctx.t('label.import'))), }, ...__VLS_functionalComponentArgsRest(__VLS_27));
    let __VLS_32;
    const __VLS_33 = {
        onClick: (__VLS_ctx.importCampaign)
    };
    let __VLS_29;
    let __VLS_30;
    var __VLS_31;
    const __VLS_34 = __VLS_resolvedLocalAndGlobalComponents.Button;
    /** @type { [typeof __VLS_components.Button, typeof __VLS_components.Button, ] } */
    // @ts-ignore
    const __VLS_35 = __VLS_asFunctionalComponent(__VLS_34, new __VLS_34({ ...{ 'onClick': {} }, outlined: (true), id: ("import-button"), label: ((__VLS_ctx.t('label.cancel'))), }));
    const __VLS_36 = __VLS_35({ ...{ 'onClick': {} }, outlined: (true), id: ("import-button"), label: ((__VLS_ctx.t('label.cancel'))), }, ...__VLS_functionalComponentArgsRest(__VLS_35));
    let __VLS_40;
    const __VLS_41 = {
        onClick: (__VLS_ctx.closeModal)
    };
    let __VLS_37;
    let __VLS_38;
    var __VLS_39;
    __VLS_nonNullable(__VLS_25.slots).default;
    var __VLS_25;
    __VLS_nonNullable(__VLS_13.slots).default;
    var __VLS_13;
    __VLS_styleScopedClasses['w-full'];
    __VLS_styleScopedClasses['md:w-1/3'];
    __VLS_styleScopedClasses['m-2'];
    __VLS_styleScopedClasses['py-4'];
    __VLS_styleScopedClasses['w-full'];
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
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
