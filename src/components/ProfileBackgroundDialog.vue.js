/// <reference types="../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import { ref, inject, watch } from "vue";
import { useUserStore } from "@/store/UserStore";
import { getToken } from "@/service/AccessToken";
import BaseAlert from "@/components/Alerts/BaseAlert.vue";
const axios = inject("axios");
const assets = inject("assets");
const UserStore = useUserStore();
const dialogIsActive = ref(false);
const isSaving = ref(false);
const savingBackgroundHash = ref(null);
const showAlert = ref(false);
const alertIcon = ref("");
const alertText = ref("");
const alertTitle = ref("");
const alertType = ref("info");
const availableBackgrounds = ref([
    { hash: "profile-bg-corelich-transparent.png" },
    { hash: "profile-bg-corewar-transparent.png" },
    { hash: "profile-bg-warriors-transparent.png" },
]);
const setAlert = (icon, title, text, type) => {
    alertIcon.value = icon;
    alertTitle.value = title;
    alertText.value = text;
    alertType.value = type;
    showAlert.value = true;
};
const selectAndSaveBackground = async (backgroundHash) => {
    if (isSaving.value)
        return;
    isSaving.value = true;
    savingBackgroundHash.value = backgroundHash;
    const user = UserStore.user;
    try {
        const response = await axios.put("users/alter", {
            users_pk: user.users_pk,
            background_hash: backgroundHash,
        }, {
            headers: getToken(),
        });
        await UserStore.setUser({
            ...user,
            background_hash: backgroundHash,
        });
        setAlert("mdi-check-circle", "Success!", "Background updated!", "success");
        setTimeout(() => {
            dialogIsActive.value = false;
        }, 1500);
    }
    catch (error) {
        console.error("Error saving background:", error);
        setAlert("mdi-alert-circle", `Error ${error.response?.status || ""}`, error.response?.data?.message || "A network error occurred.", "error");
    }
    finally {
        setTimeout(() => {
            isSaving.value = false;
            savingBackgroundHash.value = null;
        }, 1500);
    }
};
watch(dialogIsActive, (isActive) => {
    if (!isActive) {
        showAlert.value = false;
    }
});
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
// CSS variable injection 
// CSS variable injection end 
const __VLS_0 = {}.VDialog;
/** @type {[typeof __VLS_components.VDialog, typeof __VLS_components.vDialog, typeof __VLS_components.VDialog, typeof __VLS_components.vDialog, ]} */ ;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
    modelValue: (__VLS_ctx.dialogIsActive),
    activator: "parent",
    maxWidth: "800",
}));
const __VLS_2 = __VLS_1({
    modelValue: (__VLS_ctx.dialogIsActive),
    activator: "parent",
    maxWidth: "800",
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
var __VLS_4 = {};
__VLS_3.slots.default;
const __VLS_5 = {}.VCard;
/** @type {[typeof __VLS_components.VCard, typeof __VLS_components.vCard, typeof __VLS_components.VCard, typeof __VLS_components.vCard, ]} */ ;
// @ts-ignore
const __VLS_6 = __VLS_asFunctionalComponent(__VLS_5, new __VLS_5({
    minHeight: "380",
}));
const __VLS_7 = __VLS_6({
    minHeight: "380",
}, ...__VLS_functionalComponentArgsRest(__VLS_6));
__VLS_8.slots.default;
const __VLS_9 = {}.VCardTitle;
/** @type {[typeof __VLS_components.VCardTitle, typeof __VLS_components.vCardTitle, typeof __VLS_components.VCardTitle, typeof __VLS_components.vCardTitle, ]} */ ;
// @ts-ignore
const __VLS_10 = __VLS_asFunctionalComponent(__VLS_9, new __VLS_9({
    ...{ class: "d-flex align-center" },
}));
const __VLS_11 = __VLS_10({
    ...{ class: "d-flex align-center" },
}, ...__VLS_functionalComponentArgsRest(__VLS_10));
__VLS_12.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
const __VLS_13 = {}.VBtn;
/** @type {[typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ]} */ ;
// @ts-ignore
const __VLS_14 = __VLS_asFunctionalComponent(__VLS_13, new __VLS_13({
    ...{ 'onClick': {} },
    icon: "mdi-close",
    ...{ class: "ml-auto" },
    variant: "text",
}));
const __VLS_15 = __VLS_14({
    ...{ 'onClick': {} },
    icon: "mdi-close",
    ...{ class: "ml-auto" },
    variant: "text",
}, ...__VLS_functionalComponentArgsRest(__VLS_14));
let __VLS_17;
let __VLS_18;
let __VLS_19;
const __VLS_20 = {
    onClick: (...[$event]) => {
        __VLS_ctx.dialogIsActive = false;
    }
};
var __VLS_16;
var __VLS_12;
const __VLS_21 = {}.VCardText;
/** @type {[typeof __VLS_components.VCardText, typeof __VLS_components.vCardText, typeof __VLS_components.VCardText, typeof __VLS_components.vCardText, ]} */ ;
// @ts-ignore
const __VLS_22 = __VLS_asFunctionalComponent(__VLS_21, new __VLS_21({}));
const __VLS_23 = __VLS_22({}, ...__VLS_functionalComponentArgsRest(__VLS_22));
__VLS_24.slots.default;
if (__VLS_ctx.showAlert) {
    const __VLS_25 = {}.VRow;
    /** @type {[typeof __VLS_components.VRow, typeof __VLS_components.vRow, typeof __VLS_components.VRow, typeof __VLS_components.vRow, ]} */ ;
    // @ts-ignore
    const __VLS_26 = __VLS_asFunctionalComponent(__VLS_25, new __VLS_25({
        noGutters: true,
        ...{ class: "pa-2" },
    }));
    const __VLS_27 = __VLS_26({
        noGutters: true,
        ...{ class: "pa-2" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_26));
    __VLS_28.slots.default;
    /** @type {[typeof BaseAlert, typeof BaseAlert, ]} */ ;
    // @ts-ignore
    const __VLS_29 = __VLS_asFunctionalComponent(BaseAlert, new BaseAlert({
        modelValue: (__VLS_ctx.showAlert),
        type: (__VLS_ctx.alertType),
        icon: (__VLS_ctx.alertIcon),
        title: (__VLS_ctx.alertTitle),
        text: true,
        ...{ class: "w-100" },
    }));
    const __VLS_30 = __VLS_29({
        modelValue: (__VLS_ctx.showAlert),
        type: (__VLS_ctx.alertType),
        icon: (__VLS_ctx.alertIcon),
        title: (__VLS_ctx.alertTitle),
        text: true,
        ...{ class: "w-100" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_29));
    __VLS_31.slots.default;
    (__VLS_ctx.alertText);
    var __VLS_31;
    var __VLS_28;
}
const __VLS_32 = {}.VRow;
/** @type {[typeof __VLS_components.VRow, typeof __VLS_components.vRow, typeof __VLS_components.VRow, typeof __VLS_components.vRow, ]} */ ;
// @ts-ignore
const __VLS_33 = __VLS_asFunctionalComponent(__VLS_32, new __VLS_32({}));
const __VLS_34 = __VLS_33({}, ...__VLS_functionalComponentArgsRest(__VLS_33));
__VLS_35.slots.default;
for (const [item, index] of __VLS_getVForSourceType((__VLS_ctx.availableBackgrounds))) {
    const __VLS_36 = {}.VCol;
    /** @type {[typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ]} */ ;
    // @ts-ignore
    const __VLS_37 = __VLS_asFunctionalComponent(__VLS_36, new __VLS_36({
        key: (index),
        cols: "12",
        md: "6",
        ...{ class: "pa-2" },
    }));
    const __VLS_38 = __VLS_37({
        key: (index),
        cols: "12",
        md: "6",
        ...{ class: "pa-2" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_37));
    __VLS_39.slots.default;
    const __VLS_40 = {}.VHover;
    /** @type {[typeof __VLS_components.VHover, typeof __VLS_components.vHover, typeof __VLS_components.VHover, typeof __VLS_components.vHover, ]} */ ;
    // @ts-ignore
    const __VLS_41 = __VLS_asFunctionalComponent(__VLS_40, new __VLS_40({}));
    const __VLS_42 = __VLS_41({}, ...__VLS_functionalComponentArgsRest(__VLS_41));
    {
        const { default: __VLS_thisSlot } = __VLS_43.slots;
        const [{ isHovering, props }] = __VLS_getSlotParams(__VLS_thisSlot);
        const __VLS_44 = {}.VCard;
        /** @type {[typeof __VLS_components.VCard, typeof __VLS_components.vCard, typeof __VLS_components.VCard, typeof __VLS_components.vCard, ]} */ ;
        // @ts-ignore
        const __VLS_45 = __VLS_asFunctionalComponent(__VLS_44, new __VLS_44({
            ...{ 'onClick': {} },
            ...(props),
            elevation: (isHovering ? 12 : 2),
            disabled: (__VLS_ctx.isSaving),
            ...{ class: "cursor-pointer" },
            ...{ class: ({
                    'active-selection': __VLS_ctx.UserStore.user.background_hash === item.hash,
                }) },
        }));
        const __VLS_46 = __VLS_45({
            ...{ 'onClick': {} },
            ...(props),
            elevation: (isHovering ? 12 : 2),
            disabled: (__VLS_ctx.isSaving),
            ...{ class: "cursor-pointer" },
            ...{ class: ({
                    'active-selection': __VLS_ctx.UserStore.user.background_hash === item.hash,
                }) },
        }, ...__VLS_functionalComponentArgsRest(__VLS_45));
        let __VLS_48;
        let __VLS_49;
        let __VLS_50;
        const __VLS_51 = {
            onClick: (...[$event]) => {
                __VLS_ctx.selectAndSaveBackground(item.hash);
            }
        };
        __VLS_47.slots.default;
        const __VLS_52 = {}.VImg;
        /** @type {[typeof __VLS_components.VImg, typeof __VLS_components.vImg, typeof __VLS_components.VImg, typeof __VLS_components.vImg, ]} */ ;
        // @ts-ignore
        const __VLS_53 = __VLS_asFunctionalComponent(__VLS_52, new __VLS_52({
            src: (`${__VLS_ctx.assets}/Profile/${item.hash}`),
            alt: (item.hash),
            aspectRatio: "16/9",
            cover: true,
        }));
        const __VLS_54 = __VLS_53({
            src: (`${__VLS_ctx.assets}/Profile/${item.hash}`),
            alt: (item.hash),
            aspectRatio: "16/9",
            cover: true,
        }, ...__VLS_functionalComponentArgsRest(__VLS_53));
        __VLS_55.slots.default;
        const __VLS_56 = {}.VOverlay;
        /** @type {[typeof __VLS_components.VOverlay, typeof __VLS_components.vOverlay, typeof __VLS_components.VOverlay, typeof __VLS_components.vOverlay, ]} */ ;
        // @ts-ignore
        const __VLS_57 = __VLS_asFunctionalComponent(__VLS_56, new __VLS_56({
            modelValue: (__VLS_ctx.isSaving && __VLS_ctx.savingBackgroundHash === item.hash),
            contained: true,
            ...{ class: "d-flex align-center justify-center" },
            scrim: "rgba(0, 0, 0, 0.5)",
        }));
        const __VLS_58 = __VLS_57({
            modelValue: (__VLS_ctx.isSaving && __VLS_ctx.savingBackgroundHash === item.hash),
            contained: true,
            ...{ class: "d-flex align-center justify-center" },
            scrim: "rgba(0, 0, 0, 0.5)",
        }, ...__VLS_functionalComponentArgsRest(__VLS_57));
        __VLS_59.slots.default;
        const __VLS_60 = {}.VProgressCircular;
        /** @type {[typeof __VLS_components.VProgressCircular, typeof __VLS_components.vProgressCircular, typeof __VLS_components.VProgressCircular, typeof __VLS_components.vProgressCircular, ]} */ ;
        // @ts-ignore
        const __VLS_61 = __VLS_asFunctionalComponent(__VLS_60, new __VLS_60({
            indeterminate: true,
            color: "white",
            size: "64",
        }));
        const __VLS_62 = __VLS_61({
            indeterminate: true,
            color: "white",
            size: "64",
        }, ...__VLS_functionalComponentArgsRest(__VLS_61));
        var __VLS_59;
        var __VLS_55;
        var __VLS_47;
        __VLS_43.slots['' /* empty slot name completion */];
    }
    var __VLS_43;
    var __VLS_39;
}
var __VLS_35;
var __VLS_24;
var __VLS_8;
var __VLS_3;
/** @type {__VLS_StyleScopedClasses['d-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['align-center']} */ ;
/** @type {__VLS_StyleScopedClasses['ml-auto']} */ ;
/** @type {__VLS_StyleScopedClasses['pa-2']} */ ;
/** @type {__VLS_StyleScopedClasses['w-100']} */ ;
/** @type {__VLS_StyleScopedClasses['pa-2']} */ ;
/** @type {__VLS_StyleScopedClasses['cursor-pointer']} */ ;
/** @type {__VLS_StyleScopedClasses['active-selection']} */ ;
/** @type {__VLS_StyleScopedClasses['d-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['align-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            BaseAlert: BaseAlert,
            assets: assets,
            UserStore: UserStore,
            dialogIsActive: dialogIsActive,
            isSaving: isSaving,
            savingBackgroundHash: savingBackgroundHash,
            showAlert: showAlert,
            alertIcon: alertIcon,
            alertText: alertText,
            alertTitle: alertTitle,
            alertType: alertType,
            availableBackgrounds: availableBackgrounds,
            selectAndSaveBackground: selectAndSaveBackground,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
