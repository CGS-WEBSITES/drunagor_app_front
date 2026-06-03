/// <reference types="../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import { inject, computed, ref } from "vue";
import { useRoute } from "vue-router";
import axios from "axios";
import { useUserStore } from "@/store/UserStore";
import BaseAlert from "@/components/Alerts/BaseAlert.vue";
import UserLibraryWidget from "@/components/UserLibraryWidget.vue";
import RecentCampaignWidget from "@/components/RecentCampaignWidget.vue";
const assets = inject("assets");
const route = useRoute();
const user = ref({});
// Buscar perfil do usuário sem expor URL
const fetchUserProfile = async () => {
    try {
        const encodedId = route.params.id;
        const userId = atob(encodedId);
        const response = await axios.get(`/users/${userId}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
        });
        user.value = response.data;
    }
    catch (error) {
        console.error("Erro ao buscar o perfil:", error);
    }
};
// Formatar a data de entrada do usuário
const formattedJoinDate = computed(() => {
    if (!user.value.join_date)
        return "Unknown";
    return new Date(user.value.join_date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "numeric",
        day: "numeric",
    });
});
fetchUserProfile();
const userStore = useUserStore();
const showAlert = ref(false);
const showErrorAlert = ref(false);
const errorMessage = ref("");
// Enviar pedido de amizade
const addFriend = async () => {
    try {
        const invite_users_fk = userStore.user?.users_pk;
        const recipient_users_fk = user?.value?.users_pk;
        if (!invite_users_fk || !recipient_users_fk) {
            console.error("❌ Erro: IDs dos usuários estão indefinidos.");
            return;
        }
        await axios.post("/friends/register", {
            invite_users_fk,
            recipient_users_fk,
            active: "true",
        }, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
        });
        showAlert.value = true;
        setTimeout(() => {
            showAlert.value = false;
        }, 1500);
    }
    catch (error) {
        showErrorAlert.value = true;
        errorMessage.value =
            error.response?.data?.message || "Erro ao enviar o pedido de amizade.";
        setTimeout(() => (showErrorAlert.value = false), 1500);
    }
};
// Verifica se o usuário já é amigo
const isFriend = ref(false);
const checkFriendStatus = async () => {
    try {
        const encodedId = route.params.id;
        const userId = parseInt(atob(encodedId));
        const response = await axios.get("/friends/list_friends", {
            params: { invite_users_fk: userStore.user?.users_pk },
            headers: {
                Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
        });
        const friendData = response.data.friends || [];
        const friend = friendData.find((f) => (f.invite_users_fk === userStore.user?.users_pk &&
            f.recipient_users_fk === userId) ||
            (f.invite_users_fk === userId &&
                f.recipient_users_fk === userStore.user?.users_pk));
        isFriend.value = friend?.accepted === true;
    }
    catch (error) {
        console.error("❌ Erro ao verificar status de amizade:", error);
    }
};
checkFriendStatus();
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
const __VLS_0 = {}.VCard;
/** @type {[typeof __VLS_components.VCard, typeof __VLS_components.vCard, typeof __VLS_components.VCard, typeof __VLS_components.vCard, ]} */ ;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
    color: "primary",
    ...{ class: "profile-card mx-auto py-0 mt-16" },
    rounded: "0",
    elevation: "3",
    ...{ style: {} },
}));
const __VLS_2 = __VLS_1({
    color: "primary",
    ...{ class: "profile-card mx-auto py-0 mt-16" },
    rounded: "0",
    elevation: "3",
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
__VLS_3.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "position-relative bg-grey-darken-4" },
    ...{ style: {} },
});
const __VLS_4 = {}.VImg;
/** @type {[typeof __VLS_components.VImg, typeof __VLS_components.vImg, typeof __VLS_components.VImg, typeof __VLS_components.vImg, ]} */ ;
// @ts-ignore
const __VLS_5 = __VLS_asFunctionalComponent(__VLS_4, new __VLS_4({
    src: (__VLS_ctx.user.background_hash
        ? __VLS_ctx.assets + '/Profile/' + __VLS_ctx.user.background_hash
        : __VLS_ctx.assets + '/Profile/profile-bg-warriors-transparent.png'),
    alt: "Background Image",
    maxHeight: "529px",
    cover: true,
    position: "center center",
}));
const __VLS_6 = __VLS_5({
    src: (__VLS_ctx.user.background_hash
        ? __VLS_ctx.assets + '/Profile/' + __VLS_ctx.user.background_hash
        : __VLS_ctx.assets + '/Profile/profile-bg-warriors-transparent.png'),
    alt: "Background Image",
    maxHeight: "529px",
    cover: true,
    position: "center center",
}, ...__VLS_functionalComponentArgsRest(__VLS_5));
const __VLS_8 = {}.VBtn;
/** @type {[typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ]} */ ;
// @ts-ignore
const __VLS_9 = __VLS_asFunctionalComponent(__VLS_8, new __VLS_8({
    ...{ 'onClick': {} },
    icon: "mdi-arrow-left",
    ...{ class: "position-absolute top-0 left-0 ma-2 d-none d-md-flex" },
    color: "rgba(0, 0, 0, 0.6)",
    ...{ style: {} },
    elevation: "3",
}));
const __VLS_10 = __VLS_9({
    ...{ 'onClick': {} },
    icon: "mdi-arrow-left",
    ...{ class: "position-absolute top-0 left-0 ma-2 d-none d-md-flex" },
    color: "rgba(0, 0, 0, 0.6)",
    ...{ style: {} },
    elevation: "3",
}, ...__VLS_functionalComponentArgsRest(__VLS_9));
let __VLS_12;
let __VLS_13;
let __VLS_14;
const __VLS_15 = {
    onClick: (...[$event]) => {
        __VLS_ctx.$router.go(-1);
    }
};
var __VLS_11;
if (__VLS_ctx.isFriend) {
    const __VLS_16 = {}.VMenu;
    /** @type {[typeof __VLS_components.VMenu, typeof __VLS_components.vMenu, typeof __VLS_components.VMenu, typeof __VLS_components.vMenu, ]} */ ;
    // @ts-ignore
    const __VLS_17 = __VLS_asFunctionalComponent(__VLS_16, new __VLS_16({
        openOnHover: true,
    }));
    const __VLS_18 = __VLS_17({
        openOnHover: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_17));
    __VLS_19.slots.default;
    {
        const { activator: __VLS_thisSlot } = __VLS_19.slots;
        const [{ props }] = __VLS_getSlotParams(__VLS_thisSlot);
        const __VLS_20 = {}.VBtn;
        /** @type {[typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ]} */ ;
        // @ts-ignore
        const __VLS_21 = __VLS_asFunctionalComponent(__VLS_20, new __VLS_20({
            ...(props),
            icon: "mdi-account-check",
            ...{ class: "position-absolute top-0 right-0 ma-2" },
            ...{ style: {} },
            color: "rgba(0, 0, 0, 0.6)",
            elevation: "3",
        }));
        const __VLS_22 = __VLS_21({
            ...(props),
            icon: "mdi-account-check",
            ...{ class: "position-absolute top-0 right-0 ma-2" },
            ...{ style: {} },
            color: "rgba(0, 0, 0, 0.6)",
            elevation: "3",
        }, ...__VLS_functionalComponentArgsRest(__VLS_21));
    }
    var __VLS_19;
}
else {
    const __VLS_24 = {}.VBtn;
    /** @type {[typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ]} */ ;
    // @ts-ignore
    const __VLS_25 = __VLS_asFunctionalComponent(__VLS_24, new __VLS_24({
        ...{ 'onClick': {} },
        icon: "mdi-account-plus",
        ...{ class: "position-absolute top-0 right-0 ma-2" },
        color: "rgba(0, 0, 0, 0.6)",
        ...{ style: {} },
        elevation: "3",
    }));
    const __VLS_26 = __VLS_25({
        ...{ 'onClick': {} },
        icon: "mdi-account-plus",
        ...{ class: "position-absolute top-0 right-0 ma-2" },
        color: "rgba(0, 0, 0, 0.6)",
        ...{ style: {} },
        elevation: "3",
    }, ...__VLS_functionalComponentArgsRest(__VLS_25));
    let __VLS_28;
    let __VLS_29;
    let __VLS_30;
    const __VLS_31 = {
        onClick: (__VLS_ctx.addFriend)
    };
    var __VLS_27;
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
    ...{ class: "user-join-date" },
    ...{ style: {} },
});
(__VLS_ctx.formattedJoinDate);
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "d-flex justify-center" },
    ...{ style: {} },
});
const __VLS_32 = {}.VImg;
/** @type {[typeof __VLS_components.VImg, typeof __VLS_components.vImg, typeof __VLS_components.VImg, typeof __VLS_components.vImg, ]} */ ;
// @ts-ignore
const __VLS_33 = __VLS_asFunctionalComponent(__VLS_32, new __VLS_32({
    key: (__VLS_ctx.reloadKey),
    src: (__VLS_ctx.user.picture_hash
        ? __VLS_ctx.assets + '/Profile/' + __VLS_ctx.user.picture_hash
        : __VLS_ctx.assets + '/Profile/user.png'),
    alt: (__VLS_ctx.user.picture_hash),
    width: "118",
    height: "118",
    cover: true,
    ...{ style: {} },
}));
const __VLS_34 = __VLS_33({
    key: (__VLS_ctx.reloadKey),
    src: (__VLS_ctx.user.picture_hash
        ? __VLS_ctx.assets + '/Profile/' + __VLS_ctx.user.picture_hash
        : __VLS_ctx.assets + '/Profile/user.png'),
    alt: (__VLS_ctx.user.picture_hash),
    width: "118",
    height: "118",
    cover: true,
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_33));
const __VLS_36 = {}.VCardText;
/** @type {[typeof __VLS_components.VCardText, typeof __VLS_components.vCardText, typeof __VLS_components.VCardText, typeof __VLS_components.vCardText, ]} */ ;
// @ts-ignore
const __VLS_37 = __VLS_asFunctionalComponent(__VLS_36, new __VLS_36({}));
const __VLS_38 = __VLS_37({}, ...__VLS_functionalComponentArgsRest(__VLS_37));
__VLS_39.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "user-info text-center mt-2" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "user-name d-flex justify-center align-center" },
    ...{ style: {} },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
(__VLS_ctx.user.user_name);
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "d-none d-md-flex justify-center align-center" },
});
if (__VLS_ctx.isFriend) {
    const __VLS_40 = {}.VMenu;
    /** @type {[typeof __VLS_components.VMenu, typeof __VLS_components.vMenu, typeof __VLS_components.VMenu, typeof __VLS_components.vMenu, ]} */ ;
    // @ts-ignore
    const __VLS_41 = __VLS_asFunctionalComponent(__VLS_40, new __VLS_40({
        openOnHover: true,
    }));
    const __VLS_42 = __VLS_41({
        openOnHover: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_41));
    __VLS_43.slots.default;
    {
        const { activator: __VLS_thisSlot } = __VLS_43.slots;
        const [{ props }] = __VLS_getSlotParams(__VLS_thisSlot);
        const __VLS_44 = {}.VBtn;
        /** @type {[typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ]} */ ;
        // @ts-ignore
        const __VLS_45 = __VLS_asFunctionalComponent(__VLS_44, new __VLS_44({
            ...(props),
            icon: "mdi-account-check",
            color: "rgba(0, 0, 0, 0.0)",
            elevation: "0",
            size: "small",
        }));
        const __VLS_46 = __VLS_45({
            ...(props),
            icon: "mdi-account-check",
            color: "rgba(0, 0, 0, 0.0)",
            elevation: "0",
            size: "small",
        }, ...__VLS_functionalComponentArgsRest(__VLS_45));
    }
    var __VLS_43;
}
else {
    const __VLS_48 = {}.VBtn;
    /** @type {[typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ]} */ ;
    // @ts-ignore
    const __VLS_49 = __VLS_asFunctionalComponent(__VLS_48, new __VLS_48({
        ...{ 'onClick': {} },
        icon: "mdi-account-plus",
        color: "rgba(0, 0, 0, 0.6)",
        elevation: "3",
        size: "small",
    }));
    const __VLS_50 = __VLS_49({
        ...{ 'onClick': {} },
        icon: "mdi-account-plus",
        color: "rgba(0, 0, 0, 0.6)",
        elevation: "3",
        size: "small",
    }, ...__VLS_functionalComponentArgsRest(__VLS_49));
    let __VLS_52;
    let __VLS_53;
    let __VLS_54;
    const __VLS_55 = {
        onClick: (__VLS_ctx.addFriend)
    };
    var __VLS_51;
}
/** @type {[typeof BaseAlert, typeof BaseAlert, ]} */ ;
// @ts-ignore
const __VLS_56 = __VLS_asFunctionalComponent(BaseAlert, new BaseAlert({
    modelValue: (__VLS_ctx.showAlert),
    type: "success",
    text: true,
    ...{ class: "custom-alert" },
}));
const __VLS_57 = __VLS_56({
    modelValue: (__VLS_ctx.showAlert),
    type: "success",
    text: true,
    ...{ class: "custom-alert" },
}, ...__VLS_functionalComponentArgsRest(__VLS_56));
__VLS_58.slots.default;
var __VLS_58;
/** @type {[typeof BaseAlert, typeof BaseAlert, ]} */ ;
// @ts-ignore
const __VLS_59 = __VLS_asFunctionalComponent(BaseAlert, new BaseAlert({
    modelValue: (__VLS_ctx.showErrorAlert),
    type: "error",
    ...{ class: "custom-alert" },
}));
const __VLS_60 = __VLS_59({
    modelValue: (__VLS_ctx.showErrorAlert),
    type: "error",
    ...{ class: "custom-alert" },
}, ...__VLS_functionalComponentArgsRest(__VLS_59));
__VLS_61.slots.default;
(__VLS_ctx.errorMessage);
var __VLS_61;
var __VLS_39;
var __VLS_3;
const __VLS_62 = {}.BadgesUser;
/** @type {[typeof __VLS_components.BadgesUser, ]} */ ;
// @ts-ignore
const __VLS_63 = __VLS_asFunctionalComponent(__VLS_62, new __VLS_62({}));
const __VLS_64 = __VLS_63({}, ...__VLS_functionalComponentArgsRest(__VLS_63));
if (__VLS_ctx.user.users_pk) {
    /** @type {[typeof RecentCampaignWidget, ]} */ ;
    // @ts-ignore
    const __VLS_66 = __VLS_asFunctionalComponent(RecentCampaignWidget, new RecentCampaignWidget({
        userId: (__VLS_ctx.user.users_pk),
    }));
    const __VLS_67 = __VLS_66({
        userId: (__VLS_ctx.user.users_pk),
    }, ...__VLS_functionalComponentArgsRest(__VLS_66));
}
if (__VLS_ctx.user.users_pk) {
    /** @type {[typeof UserLibraryWidget, ]} */ ;
    // @ts-ignore
    const __VLS_69 = __VLS_asFunctionalComponent(UserLibraryWidget, new UserLibraryWidget({
        userId: (__VLS_ctx.user.users_pk),
        userName: (__VLS_ctx.user.user_name),
    }));
    const __VLS_70 = __VLS_69({
        userId: (__VLS_ctx.user.users_pk),
        userName: (__VLS_ctx.user.user_name),
    }, ...__VLS_functionalComponentArgsRest(__VLS_69));
}
/** @type {__VLS_StyleScopedClasses['profile-card']} */ ;
/** @type {__VLS_StyleScopedClasses['mx-auto']} */ ;
/** @type {__VLS_StyleScopedClasses['py-0']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-16']} */ ;
/** @type {__VLS_StyleScopedClasses['position-relative']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-grey-darken-4']} */ ;
/** @type {__VLS_StyleScopedClasses['position-absolute']} */ ;
/** @type {__VLS_StyleScopedClasses['top-0']} */ ;
/** @type {__VLS_StyleScopedClasses['left-0']} */ ;
/** @type {__VLS_StyleScopedClasses['ma-2']} */ ;
/** @type {__VLS_StyleScopedClasses['d-none']} */ ;
/** @type {__VLS_StyleScopedClasses['d-md-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['position-absolute']} */ ;
/** @type {__VLS_StyleScopedClasses['top-0']} */ ;
/** @type {__VLS_StyleScopedClasses['right-0']} */ ;
/** @type {__VLS_StyleScopedClasses['ma-2']} */ ;
/** @type {__VLS_StyleScopedClasses['position-absolute']} */ ;
/** @type {__VLS_StyleScopedClasses['top-0']} */ ;
/** @type {__VLS_StyleScopedClasses['right-0']} */ ;
/** @type {__VLS_StyleScopedClasses['ma-2']} */ ;
/** @type {__VLS_StyleScopedClasses['user-join-date']} */ ;
/** @type {__VLS_StyleScopedClasses['d-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['user-info']} */ ;
/** @type {__VLS_StyleScopedClasses['text-center']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-2']} */ ;
/** @type {__VLS_StyleScopedClasses['user-name']} */ ;
/** @type {__VLS_StyleScopedClasses['d-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['align-center']} */ ;
/** @type {__VLS_StyleScopedClasses['d-none']} */ ;
/** @type {__VLS_StyleScopedClasses['d-md-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['align-center']} */ ;
/** @type {__VLS_StyleScopedClasses['custom-alert']} */ ;
/** @type {__VLS_StyleScopedClasses['custom-alert']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            BaseAlert: BaseAlert,
            UserLibraryWidget: UserLibraryWidget,
            RecentCampaignWidget: RecentCampaignWidget,
            assets: assets,
            user: user,
            formattedJoinDate: formattedJoinDate,
            showAlert: showAlert,
            showErrorAlert: showErrorAlert,
            errorMessage: errorMessage,
            addFriend: addFriend,
            isFriend: isFriend,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
