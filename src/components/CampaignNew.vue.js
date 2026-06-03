/// <reference types="../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import { ref, reactive } from "vue";
import axios from "axios";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import CoreLogo from "@/assets/campaign/logo/core.webp";
import ApocalypseLogo from "@/assets/campaign/logo/apocalypse.webp";
import AwakeningsLogo from "@/assets/campaign/logo/awakenings.webp";
import { CampaignStore } from "@/store/CampaignStore";
import { HeroStore } from "@/store/HeroStore";
import { Campaign } from "@/store/Campaign";
import { useUserStore } from "@/store/UserStore";
const { t } = useI18n();
const router = useRouter();
const campaignStore = CampaignStore();
const heroStore = HeroStore();
const visible = ref(false);
const user = useUserStore().user;
const loading = ref(false);
const snackbar = reactive({
    show: false,
    message: "",
    color: "error",
    timeout: 5000,
});
function showError(message) {
    snackbar.message = message;
    snackbar.color = "error";
    snackbar.show = true;
}
function generateCampaignHash(campaign) {
    const heroes = heroStore.findAllInCampaign(campaign.campaignId);
    const data = {
        campaignData: JSON.parse(JSON.stringify(campaign)),
        heroes: heroes.map((h) => JSON.parse(JSON.stringify(h))),
    };
    return btoa(JSON.stringify(data));
}
async function createCampaign(boxId, trackerHash) {
    return await axios.post("/campaigns/cadastro", {
        tracker_hash: trackerHash,
        conclusion_percentage: 0,
        party_name: "New Party",
        box: boxId,
        active: true,
    });
}
async function saveCampaign(campaignPk, trackerHash, partyName) {
    await axios.put(`/campaigns/alter/${campaignPk}`, {
        tracker_hash: trackerHash,
        party_name: partyName,
    });
}
async function addRelationship(users_pk, campaign_fk, boxId) {
    // CORREÇÃO:
    // 1. Usando 'params' para enviar como Query Parameters (exigência do Swagger)
    // 2. Removido 'party_roles_fk' pois o backend rejeitou (causa do erro 500)
    return await axios.post("rl_campaigns_users/cadastro", null, {
        params: {
            users_fk: users_pk,
            campaigns_fk: Number(campaign_fk),
            skus_fk: boxId,
            active: true,
        },
    });
}
async function newCampaign(type) {
    loading.value = true;
    try {
        const usersPk = user.users_pk;
        if (!usersPk) {
            showError(t("error.user-not-logged"));
            return;
        }
        const { data } = await axios.get("/skus/search", {
            params: { users_fk: usersPk },
        });
        const skuList = Array.isArray(data.skus) ? data.skus : Object.values(data);
        const expectedName = {
            core: "Corebox",
            apocalypse: "Apocalypse",
            awakenings: "Awakenings",
            underkeep: "underkeep",
            underkeep2: "underkeep2",
        }[type];
        const selectedSku = skuList.find((s) => s.name?.toLowerCase() === expectedName.toLowerCase());
        if (!selectedSku) {
            showError(t("error.sku-not-found", { type }));
            return;
        }
        const tempCampaign = new Campaign("temp", type);
        const initialHash = generateCampaignHash(tempCampaign);
        const campaignResp = await createCampaign(selectedSku.skus_pk, initialHash);
        const campaignPk = String(campaignResp.data.campaign.campaigns_pk);
        const newCampaignInstance = new Campaign(campaignPk, type);
        campaignStore.add(newCampaignInstance);
        const finalHash = generateCampaignHash(newCampaignInstance);
        await saveCampaign(campaignPk, finalHash, "New Party");
        try {
            await addRelationship(usersPk, campaignPk, selectedSku.skus_pk);
        }
        catch (relationshipError) {
            campaignStore.remove(campaignPk);
            if (relationshipError.response?.status === 409) {
                showError(t("error.campaign-already-exists"));
                return;
            }
            throw relationshipError;
        }
        visible.value = false;
        router.push({
            path: `/campaign-tracker/campaign/${campaignPk}`,
            query: { sku: selectedSku.skus_pk.toString() },
        });
    }
    catch (error) {
        console.error("Error creating campaign:", error);
        showError(error.response?.data?.message ||
            error.message ||
            t("error.campaign-creation-failed"));
    }
    finally {
        loading.value = false;
    }
}
const __VLS_exposed = {
    openModal: () => { visible.value = true; }
};
defineExpose(__VLS_exposed);
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['campaign-card']} */ ;
// CSS variable injection 
// CSS variable injection end 
const __VLS_0 = {}.VBtn;
/** @type {[typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ]} */ ;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
    ...{ 'onClick': {} },
    variant: "elevated",
    id: "campaign-new",
    rounded: true,
}));
const __VLS_2 = __VLS_1({
    ...{ 'onClick': {} },
    variant: "elevated",
    id: "campaign-new",
    rounded: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
let __VLS_4;
let __VLS_5;
let __VLS_6;
const __VLS_7 = {
    onClick: (...[$event]) => {
        __VLS_ctx.visible = true;
    }
};
__VLS_3.slots.default;
(__VLS_ctx.t("label.new-campaign"));
var __VLS_3;
const __VLS_8 = {}.VDialog;
/** @type {[typeof __VLS_components.VDialog, typeof __VLS_components.vDialog, typeof __VLS_components.VDialog, typeof __VLS_components.vDialog, ]} */ ;
// @ts-ignore
const __VLS_9 = __VLS_asFunctionalComponent(__VLS_8, new __VLS_8({
    modelValue: (__VLS_ctx.visible),
    maxWidth: "500px",
    persistent: true,
    scrollable: true,
}));
const __VLS_10 = __VLS_9({
    modelValue: (__VLS_ctx.visible),
    maxWidth: "500px",
    persistent: true,
    scrollable: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_9));
__VLS_11.slots.default;
const __VLS_12 = {}.VCard;
/** @type {[typeof __VLS_components.VCard, typeof __VLS_components.vCard, typeof __VLS_components.VCard, typeof __VLS_components.vCard, ]} */ ;
// @ts-ignore
const __VLS_13 = __VLS_asFunctionalComponent(__VLS_12, new __VLS_12({
    ...{ class: "rounded-xl" },
    color: "grey-darken-4",
    ...{ style: {} },
}));
const __VLS_14 = __VLS_13({
    ...{ class: "rounded-xl" },
    color: "grey-darken-4",
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_13));
__VLS_15.slots.default;
if (__VLS_ctx.loading) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "loading-container" },
    });
    const __VLS_16 = {}.VProgressCircular;
    /** @type {[typeof __VLS_components.VProgressCircular, typeof __VLS_components.vProgressCircular, typeof __VLS_components.VProgressCircular, typeof __VLS_components.vProgressCircular, ]} */ ;
    // @ts-ignore
    const __VLS_17 = __VLS_asFunctionalComponent(__VLS_16, new __VLS_16({
        size: (70),
        width: (7),
        color: "primary",
        indeterminate: true,
    }));
    const __VLS_18 = __VLS_17({
        size: (70),
        width: (7),
        color: "primary",
        indeterminate: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_17));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.h2, __VLS_intrinsicElements.h2)({
        ...{ class: "mt-4 text-grey-darken-1" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
        ...{ class: "text-grey-lighten-1" },
    });
}
else {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "d-flex flex-column" },
        ...{ style: {} },
    });
    const __VLS_20 = {}.VCardTitle;
    /** @type {[typeof __VLS_components.VCardTitle, typeof __VLS_components.vCardTitle, typeof __VLS_components.VCardTitle, typeof __VLS_components.vCardTitle, ]} */ ;
    // @ts-ignore
    const __VLS_21 = __VLS_asFunctionalComponent(__VLS_20, new __VLS_20({
        ...{ class: "d-flex justify-space-between align-center px-6 pt-6 pb-2" },
    }));
    const __VLS_22 = __VLS_21({
        ...{ class: "d-flex justify-space-between align-center px-6 pt-6 pb-2" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_21));
    __VLS_23.slots.default;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "text-h5 font-weight-black text-white" },
    });
    const __VLS_24 = {}.VBtn;
    /** @type {[typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ]} */ ;
    // @ts-ignore
    const __VLS_25 = __VLS_asFunctionalComponent(__VLS_24, new __VLS_24({
        ...{ 'onClick': {} },
        icon: "mdi-close",
        variant: "text",
        color: "white",
    }));
    const __VLS_26 = __VLS_25({
        ...{ 'onClick': {} },
        icon: "mdi-close",
        variant: "text",
        color: "white",
    }, ...__VLS_functionalComponentArgsRest(__VLS_25));
    let __VLS_28;
    let __VLS_29;
    let __VLS_30;
    const __VLS_31 = {
        onClick: (...[$event]) => {
            if (!!(__VLS_ctx.loading))
                return;
            __VLS_ctx.visible = false;
        }
    };
    var __VLS_27;
    var __VLS_23;
    const __VLS_32 = {}.VCardText;
    /** @type {[typeof __VLS_components.VCardText, typeof __VLS_components.vCardText, typeof __VLS_components.VCardText, typeof __VLS_components.vCardText, ]} */ ;
    // @ts-ignore
    const __VLS_33 = __VLS_asFunctionalComponent(__VLS_32, new __VLS_32({
        ...{ class: "px-6 pb-6 pt-2" },
        ...{ style: {} },
    }));
    const __VLS_34 = __VLS_33({
        ...{ class: "px-6 pb-6 pt-2" },
        ...{ style: {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_33));
    __VLS_35.slots.default;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "d-flex flex-column ga-4" },
    });
    const __VLS_36 = {}.VCard;
    /** @type {[typeof __VLS_components.VCard, typeof __VLS_components.vCard, typeof __VLS_components.VCard, typeof __VLS_components.vCard, ]} */ ;
    // @ts-ignore
    const __VLS_37 = __VLS_asFunctionalComponent(__VLS_36, new __VLS_36({
        ...{ 'onClick': {} },
        ...{ class: "campaign-card d-flex justify-center align-center pa-6 rounded-xl border-core" },
        height: "140",
        flat: true,
    }));
    const __VLS_38 = __VLS_37({
        ...{ 'onClick': {} },
        ...{ class: "campaign-card d-flex justify-center align-center pa-6 rounded-xl border-core" },
        height: "140",
        flat: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_37));
    let __VLS_40;
    let __VLS_41;
    let __VLS_42;
    const __VLS_43 = {
        onClick: (...[$event]) => {
            if (!!(__VLS_ctx.loading))
                return;
            __VLS_ctx.newCampaign('core');
        }
    };
    __VLS_39.slots.default;
    const __VLS_44 = {}.VImg;
    /** @type {[typeof __VLS_components.VImg, typeof __VLS_components.vImg, typeof __VLS_components.VImg, typeof __VLS_components.vImg, ]} */ ;
    // @ts-ignore
    const __VLS_45 = __VLS_asFunctionalComponent(__VLS_44, new __VLS_44({
        src: (__VLS_ctx.CoreLogo.toString()),
        maxWidth: "320",
        maxHeight: "90",
        contain: true,
    }));
    const __VLS_46 = __VLS_45({
        src: (__VLS_ctx.CoreLogo.toString()),
        maxWidth: "320",
        maxHeight: "90",
        contain: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_45));
    var __VLS_39;
    const __VLS_48 = {}.VCard;
    /** @type {[typeof __VLS_components.VCard, typeof __VLS_components.vCard, typeof __VLS_components.VCard, typeof __VLS_components.vCard, ]} */ ;
    // @ts-ignore
    const __VLS_49 = __VLS_asFunctionalComponent(__VLS_48, new __VLS_48({
        ...{ 'onClick': {} },
        ...{ class: "campaign-card d-flex justify-center align-center pa-6 rounded-xl border-apocalypse" },
        height: "140",
        flat: true,
    }));
    const __VLS_50 = __VLS_49({
        ...{ 'onClick': {} },
        ...{ class: "campaign-card d-flex justify-center align-center pa-6 rounded-xl border-apocalypse" },
        height: "140",
        flat: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_49));
    let __VLS_52;
    let __VLS_53;
    let __VLS_54;
    const __VLS_55 = {
        onClick: (...[$event]) => {
            if (!!(__VLS_ctx.loading))
                return;
            __VLS_ctx.newCampaign('apocalypse');
        }
    };
    __VLS_51.slots.default;
    const __VLS_56 = {}.VImg;
    /** @type {[typeof __VLS_components.VImg, typeof __VLS_components.vImg, typeof __VLS_components.VImg, typeof __VLS_components.vImg, ]} */ ;
    // @ts-ignore
    const __VLS_57 = __VLS_asFunctionalComponent(__VLS_56, new __VLS_56({
        src: (__VLS_ctx.ApocalypseLogo.toString()),
        maxWidth: "320",
        maxHeight: "90",
        contain: true,
    }));
    const __VLS_58 = __VLS_57({
        src: (__VLS_ctx.ApocalypseLogo.toString()),
        maxWidth: "320",
        maxHeight: "90",
        contain: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_57));
    var __VLS_51;
    const __VLS_60 = {}.VCard;
    /** @type {[typeof __VLS_components.VCard, typeof __VLS_components.vCard, typeof __VLS_components.VCard, typeof __VLS_components.vCard, ]} */ ;
    // @ts-ignore
    const __VLS_61 = __VLS_asFunctionalComponent(__VLS_60, new __VLS_60({
        ...{ 'onClick': {} },
        ...{ class: "campaign-card d-flex justify-center align-center pa-6 rounded-xl border-awakenings" },
        height: "140",
        flat: true,
    }));
    const __VLS_62 = __VLS_61({
        ...{ 'onClick': {} },
        ...{ class: "campaign-card d-flex justify-center align-center pa-6 rounded-xl border-awakenings" },
        height: "140",
        flat: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_61));
    let __VLS_64;
    let __VLS_65;
    let __VLS_66;
    const __VLS_67 = {
        onClick: (...[$event]) => {
            if (!!(__VLS_ctx.loading))
                return;
            __VLS_ctx.newCampaign('awakenings');
        }
    };
    __VLS_63.slots.default;
    const __VLS_68 = {}.VImg;
    /** @type {[typeof __VLS_components.VImg, typeof __VLS_components.vImg, typeof __VLS_components.VImg, typeof __VLS_components.vImg, ]} */ ;
    // @ts-ignore
    const __VLS_69 = __VLS_asFunctionalComponent(__VLS_68, new __VLS_68({
        src: (__VLS_ctx.AwakeningsLogo.toString()),
        maxWidth: "320",
        maxHeight: "90",
        contain: true,
    }));
    const __VLS_70 = __VLS_69({
        src: (__VLS_ctx.AwakeningsLogo.toString()),
        maxWidth: "320",
        maxHeight: "90",
        contain: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_69));
    var __VLS_63;
    var __VLS_35;
}
var __VLS_15;
var __VLS_11;
const __VLS_72 = {}.VSnackbar;
/** @type {[typeof __VLS_components.VSnackbar, typeof __VLS_components.vSnackbar, typeof __VLS_components.VSnackbar, typeof __VLS_components.vSnackbar, ]} */ ;
// @ts-ignore
const __VLS_73 = __VLS_asFunctionalComponent(__VLS_72, new __VLS_72({
    modelValue: (__VLS_ctx.snackbar.show),
    color: (__VLS_ctx.snackbar.color),
    timeout: (__VLS_ctx.snackbar.timeout),
    location: "top",
}));
const __VLS_74 = __VLS_73({
    modelValue: (__VLS_ctx.snackbar.show),
    color: (__VLS_ctx.snackbar.color),
    timeout: (__VLS_ctx.snackbar.timeout),
    location: "top",
}, ...__VLS_functionalComponentArgsRest(__VLS_73));
__VLS_75.slots.default;
(__VLS_ctx.snackbar.message);
{
    const { actions: __VLS_thisSlot } = __VLS_75.slots;
    const __VLS_76 = {}.VBtn;
    /** @type {[typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ]} */ ;
    // @ts-ignore
    const __VLS_77 = __VLS_asFunctionalComponent(__VLS_76, new __VLS_76({
        ...{ 'onClick': {} },
        variant: "text",
    }));
    const __VLS_78 = __VLS_77({
        ...{ 'onClick': {} },
        variant: "text",
    }, ...__VLS_functionalComponentArgsRest(__VLS_77));
    let __VLS_80;
    let __VLS_81;
    let __VLS_82;
    const __VLS_83 = {
        onClick: (...[$event]) => {
            __VLS_ctx.snackbar.show = false;
        }
    };
    __VLS_79.slots.default;
    (__VLS_ctx.t("label.close"));
    var __VLS_79;
}
var __VLS_75;
/** @type {__VLS_StyleScopedClasses['rounded-xl']} */ ;
/** @type {__VLS_StyleScopedClasses['loading-container']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-4']} */ ;
/** @type {__VLS_StyleScopedClasses['text-grey-darken-1']} */ ;
/** @type {__VLS_StyleScopedClasses['text-grey-lighten-1']} */ ;
/** @type {__VLS_StyleScopedClasses['d-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-column']} */ ;
/** @type {__VLS_StyleScopedClasses['d-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-space-between']} */ ;
/** @type {__VLS_StyleScopedClasses['align-center']} */ ;
/** @type {__VLS_StyleScopedClasses['px-6']} */ ;
/** @type {__VLS_StyleScopedClasses['pt-6']} */ ;
/** @type {__VLS_StyleScopedClasses['pb-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-h5']} */ ;
/** @type {__VLS_StyleScopedClasses['font-weight-black']} */ ;
/** @type {__VLS_StyleScopedClasses['text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['px-6']} */ ;
/** @type {__VLS_StyleScopedClasses['pb-6']} */ ;
/** @type {__VLS_StyleScopedClasses['pt-2']} */ ;
/** @type {__VLS_StyleScopedClasses['d-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-column']} */ ;
/** @type {__VLS_StyleScopedClasses['ga-4']} */ ;
/** @type {__VLS_StyleScopedClasses['campaign-card']} */ ;
/** @type {__VLS_StyleScopedClasses['d-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['align-center']} */ ;
/** @type {__VLS_StyleScopedClasses['pa-6']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-xl']} */ ;
/** @type {__VLS_StyleScopedClasses['border-core']} */ ;
/** @type {__VLS_StyleScopedClasses['campaign-card']} */ ;
/** @type {__VLS_StyleScopedClasses['d-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['align-center']} */ ;
/** @type {__VLS_StyleScopedClasses['pa-6']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-xl']} */ ;
/** @type {__VLS_StyleScopedClasses['border-apocalypse']} */ ;
/** @type {__VLS_StyleScopedClasses['campaign-card']} */ ;
/** @type {__VLS_StyleScopedClasses['d-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['align-center']} */ ;
/** @type {__VLS_StyleScopedClasses['pa-6']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-xl']} */ ;
/** @type {__VLS_StyleScopedClasses['border-awakenings']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            CoreLogo: CoreLogo,
            ApocalypseLogo: ApocalypseLogo,
            AwakeningsLogo: AwakeningsLogo,
            t: t,
            visible: visible,
            loading: loading,
            snackbar: snackbar,
            newCampaign: newCampaign,
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
