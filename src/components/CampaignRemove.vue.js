/// <reference types="../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import { ref } from "vue";
import { CampaignStore } from "@/store/CampaignStore";
import { useRouter } from "vue-router";
import { HeroStore } from "@/store/HeroStore";
import { useI18n } from "vue-i18n";
import axios from "axios";
import BaseAlert from "@/components/Alerts/BaseAlert.vue";
const campaignStore = CampaignStore();
const heroStore = HeroStore();
const router = useRouter();
const { t } = useI18n();
const visible = ref(false);
const isLoading = ref(false);
const alertVisible = ref(false);
const alertMessage = ref("");
const alertType = ref("success");
const props = defineProps();
const openDialog = () => {
    alertVisible.value = false;
    visible.value = true;
};
const __VLS_exposed = {
    openDialog,
};
defineExpose(__VLS_exposed);
const closeModal = () => {
    visible.value = false;
};
const removeCampaign = () => {
    isLoading.value = true;
    const campaignId = props.campaignId;
    axios
        .get("/rl_campaigns_users/list_players", {
        params: {
            campaigns_fk: campaignId,
        },
    })
        .then(({ data }) => {
        const users = data.Users;
        return Promise.all(users.map((u) => axios.delete(`/rl_campaigns_users/${u.rl_campaigns_users_pk}/delete/`)));
    })
        .then(() => {
        return axios.delete(`/campaigns/${props.campaignId}/delete/`);
    })
        .then(() => {
        alertMessage.value = t("text.campaign-deleted-success");
        alertType.value = "success";
        alertVisible.value = true;
        campaignStore.remove(props.campaignId);
        heroStore
            .findAllInCampaign(props.campaignId)
            .forEach((hero) => heroStore.removeFromCampaign(hero.heroId, props.campaignId));
        setTimeout(() => {
            closeModal();
            router.push("/campaign-tracker/");
        }, 2000);
    })
        .catch((error) => {
        let detailMessage = t("text.error-removing-campaign");
        if (error.response?.data) {
            detailMessage =
                error.response.data.message ||
                    error.response.data.detail ||
                    JSON.stringify(error.response.data);
        }
        else {
            detailMessage = error.message;
        }
        alertMessage.value = detailMessage;
        alertType.value = "error";
        alertVisible.value = true;
        setTimeout(() => {
            closeModal();
            router.push("/campaign-tracker/");
        }, 2000);
    })
        .finally(() => {
        isLoading.value = false;
    });
};
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
    id: "campaign-remove",
    ...{ class: "px-6 my-2" },
    rounded: true,
}));
const __VLS_2 = __VLS_1({
    ...{ 'onClick': {} },
    variant: "elevated",
    id: "campaign-remove",
    ...{ class: "px-6 my-2" },
    rounded: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
let __VLS_4;
let __VLS_5;
let __VLS_6;
const __VLS_7 = {
    onClick: (__VLS_ctx.openDialog)
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
(__VLS_ctx.t("label.remove-campaign"));
var __VLS_3;
const __VLS_12 = {}.VDialog;
/** @type {[typeof __VLS_components.VDialog, typeof __VLS_components.vDialog, typeof __VLS_components.VDialog, typeof __VLS_components.vDialog, ]} */ ;
// @ts-ignore
const __VLS_13 = __VLS_asFunctionalComponent(__VLS_12, new __VLS_12({
    modelValue: (__VLS_ctx.visible),
    maxWidth: "500px",
    persistent: true,
}));
const __VLS_14 = __VLS_13({
    modelValue: (__VLS_ctx.visible),
    maxWidth: "500px",
    persistent: true,
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
(__VLS_ctx.t("label.remove-campaign"));
var __VLS_23;
const __VLS_24 = {}.VCardText;
/** @type {[typeof __VLS_components.VCardText, typeof __VLS_components.vCardText, typeof __VLS_components.VCardText, typeof __VLS_components.vCardText, ]} */ ;
// @ts-ignore
const __VLS_25 = __VLS_asFunctionalComponent(__VLS_24, new __VLS_24({}));
const __VLS_26 = __VLS_25({}, ...__VLS_functionalComponentArgsRest(__VLS_25));
__VLS_27.slots.default;
/** @type {[typeof BaseAlert, typeof BaseAlert, ]} */ ;
// @ts-ignore
const __VLS_28 = __VLS_asFunctionalComponent(BaseAlert, new BaseAlert({
    modelValue: (__VLS_ctx.alertVisible),
    type: (__VLS_ctx.alertType),
    closable: true,
}));
const __VLS_29 = __VLS_28({
    modelValue: (__VLS_ctx.alertVisible),
    type: (__VLS_ctx.alertType),
    closable: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_28));
__VLS_30.slots.default;
(__VLS_ctx.alertMessage);
var __VLS_30;
if (!__VLS_ctx.alertVisible) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
        ...{ class: "text-center mt-2" },
    });
    (__VLS_ctx.t("text.cannot-be-restored"));
}
var __VLS_27;
const __VLS_31 = {}.VDivider;
/** @type {[typeof __VLS_components.VDivider, typeof __VLS_components.vDivider, typeof __VLS_components.VDivider, typeof __VLS_components.vDivider, ]} */ ;
// @ts-ignore
const __VLS_32 = __VLS_asFunctionalComponent(__VLS_31, new __VLS_31({}));
const __VLS_33 = __VLS_32({}, ...__VLS_functionalComponentArgsRest(__VLS_32));
if (!__VLS_ctx.alertVisible) {
    const __VLS_35 = {}.VCardActions;
    /** @type {[typeof __VLS_components.VCardActions, typeof __VLS_components.vCardActions, typeof __VLS_components.VCardActions, typeof __VLS_components.vCardActions, ]} */ ;
    // @ts-ignore
    const __VLS_36 = __VLS_asFunctionalComponent(__VLS_35, new __VLS_35({}));
    const __VLS_37 = __VLS_36({}, ...__VLS_functionalComponentArgsRest(__VLS_36));
    __VLS_38.slots.default;
    const __VLS_39 = {}.VRow;
    /** @type {[typeof __VLS_components.VRow, typeof __VLS_components.vRow, typeof __VLS_components.VRow, typeof __VLS_components.vRow, ]} */ ;
    // @ts-ignore
    const __VLS_40 = __VLS_asFunctionalComponent(__VLS_39, new __VLS_39({
        noGutters: true,
    }));
    const __VLS_41 = __VLS_40({
        noGutters: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_40));
    __VLS_42.slots.default;
    const __VLS_43 = {}.VCol;
    /** @type {[typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ]} */ ;
    // @ts-ignore
    const __VLS_44 = __VLS_asFunctionalComponent(__VLS_43, new __VLS_43({
        cols: "6",
    }));
    const __VLS_45 = __VLS_44({
        cols: "6",
    }, ...__VLS_functionalComponentArgsRest(__VLS_44));
    __VLS_46.slots.default;
    const __VLS_47 = {}.VBtn;
    /** @type {[typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ]} */ ;
    // @ts-ignore
    const __VLS_48 = __VLS_asFunctionalComponent(__VLS_47, new __VLS_47({
        ...{ 'onClick': {} },
        variant: "text",
        width: "100%",
        loading: (__VLS_ctx.isLoading),
        disabled: (__VLS_ctx.isLoading),
    }));
    const __VLS_49 = __VLS_48({
        ...{ 'onClick': {} },
        variant: "text",
        width: "100%",
        loading: (__VLS_ctx.isLoading),
        disabled: (__VLS_ctx.isLoading),
    }, ...__VLS_functionalComponentArgsRest(__VLS_48));
    let __VLS_51;
    let __VLS_52;
    let __VLS_53;
    const __VLS_54 = {
        onClick: (__VLS_ctx.removeCampaign)
    };
    __VLS_50.slots.default;
    (__VLS_ctx.t("label.yes"));
    var __VLS_50;
    var __VLS_46;
    const __VLS_55 = {}.VCol;
    /** @type {[typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ]} */ ;
    // @ts-ignore
    const __VLS_56 = __VLS_asFunctionalComponent(__VLS_55, new __VLS_55({
        cols: "6",
    }));
    const __VLS_57 = __VLS_56({
        cols: "6",
    }, ...__VLS_functionalComponentArgsRest(__VLS_56));
    __VLS_58.slots.default;
    const __VLS_59 = {}.VBtn;
    /** @type {[typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ]} */ ;
    // @ts-ignore
    const __VLS_60 = __VLS_asFunctionalComponent(__VLS_59, new __VLS_59({
        ...{ 'onClick': {} },
        variant: "text",
        width: "100%",
        color: "red-accent-2",
        disabled: (__VLS_ctx.isLoading),
    }));
    const __VLS_61 = __VLS_60({
        ...{ 'onClick': {} },
        variant: "text",
        width: "100%",
        color: "red-accent-2",
        disabled: (__VLS_ctx.isLoading),
    }, ...__VLS_functionalComponentArgsRest(__VLS_60));
    let __VLS_63;
    let __VLS_64;
    let __VLS_65;
    const __VLS_66 = {
        onClick: (__VLS_ctx.closeModal)
    };
    __VLS_62.slots.default;
    (__VLS_ctx.t("label.no"));
    var __VLS_62;
    var __VLS_58;
    var __VLS_42;
    var __VLS_38;
}
var __VLS_19;
var __VLS_15;
/** @type {__VLS_StyleScopedClasses['px-6']} */ ;
/** @type {__VLS_StyleScopedClasses['my-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-center']} */ ;
/** @type {__VLS_StyleScopedClasses['text-center']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-2']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            BaseAlert: BaseAlert,
            t: t,
            visible: visible,
            isLoading: isLoading,
            alertVisible: alertVisible,
            alertMessage: alertMessage,
            alertType: alertType,
            openDialog: openDialog,
            closeModal: closeModal,
            removeCampaign: removeCampaign,
        };
    },
    __typeProps: {},
});
export default (await import('vue')).defineComponent({
    setup() {
        return {
            ...__VLS_exposed,
        };
    },
    __typeProps: {},
});
; /* PartiallyEnd: #4569/main.vue */
