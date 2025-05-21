/// <reference types="../../node_modules/.vue-global-types/vue_3.5_false.d.ts" />
import { inject, computed, ref } from "vue";
import { useRoute } from "vue-router";
import axios from "axios";
const assets = inject("assets");
const route = useRoute();
const user = ref({});
const fetchUserProfile = async () => {
    try {
        const encodedId = route.params.id;
        const userId = atob(encodedId);
        const response = await axios.get(`https://api.drunagor.app/test/system/users/${userId}`, {
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
import { useUserStore } from "@/store/UserStore";
const userStore = useUserStore();
const apiUrl = inject("apiUrl") || "https://api.drunagor.app/test/system";
const showAlert = ref(false);
const showErrorAlert = ref(false);
const errorMessage = ref("");
const addFriend = async () => {
    try {
        const invite_users_fk = userStore.user?.users_pk;
        const recipient_users_fk = user?.value?.users_pk;
        if (!invite_users_fk || !recipient_users_fk) {
            console.error("❌ Erro: IDs dos usuários estão indefinidos.");
            return;
        }
        const response = await axios.post(`${apiUrl}/friends/register`, {
            invite_users_fk,
            recipient_users_fk,
            active: "true",
        }, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
        });
        // Exibir alerta de sucesso
        showAlert.value = true;
        // Esconder alerta após 3 segundos
        setTimeout(() => {
            showAlert.value = false;
        }, 3000);
    }
    catch (error) {
        showErrorAlert.value = true;
        errorMessage.value = error.response?.data?.message || "Erro ao enviar o pedido de amizade.";
        setTimeout(() => (showErrorAlert.value = false), 3000);
    }
};
const isFriend = ref(); // Define se o usuário já é amigo ou não
const checkFriendStatus = async () => {
    try {
        const encodedId = route.params.id;
        const userId = parseInt(atob(encodedId)); // Converte de Base64 para número
        const response = await axios.get(`${apiUrl}/friends/list_friends`, {
            params: { invite_users_fk: userStore.user?.users_pk },
            headers: {
                Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
        });
        const friendData = response.data.friends || [];
        // 🔥 Verifica se a amizade já existe e está aceita
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
// Chama a função de verificação ao carregar a página
checkFriendStatus();
; /* PartiallyEnd: #3632/scriptSetup.vue */
function __VLS_template() {
    const __VLS_ctx = {};
    let __VLS_components;
    let __VLS_directives;
    // CSS variable injection 
    // CSS variable injection end 
    const __VLS_0 = {}.VCard;
    /** @type { [typeof __VLS_components.VCard, typeof __VLS_components.vCard, typeof __VLS_components.VCard, typeof __VLS_components.vCard, ] } */ ;
    // @ts-ignore
    const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
        color: ("primary"),
        ...{ class: ("profile-card mx-auto py-0") },
        rounded: ("0"),
        elevation: ("3"),
        ...{ style: ({}) },
    }));
    const __VLS_2 = __VLS_1({
        color: ("primary"),
        ...{ class: ("profile-card mx-auto py-0") },
        rounded: ("0"),
        elevation: ("3"),
        ...{ style: ({}) },
    }, ...__VLS_functionalComponentArgsRest(__VLS_1));
    __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: ("position-relative") },
    });
    const __VLS_6 = {}.VImg;
    /** @type { [typeof __VLS_components.VImg, typeof __VLS_components.vImg, typeof __VLS_components.VImg, typeof __VLS_components.vImg, ] } */ ;
    // @ts-ignore
    const __VLS_7 = __VLS_asFunctionalComponent(__VLS_6, new __VLS_6({
        src: ((__VLS_ctx.user.background_hash
            ? __VLS_ctx.assets + '/Profile/' + __VLS_ctx.user.background_hash
            : 'https://druna-assets.s3.us-east-2.amazonaws.com/Profile/profile-bg-warriors-transparent.png')),
        alt: ("Background Image"),
        maxHeight: ("529px"),
        maxWidth: ("100%"),
        cover: (true),
        ...{ style: ({}) },
    }));
    const __VLS_8 = __VLS_7({
        src: ((__VLS_ctx.user.background_hash
            ? __VLS_ctx.assets + '/Profile/' + __VLS_ctx.user.background_hash
            : 'https://druna-assets.s3.us-east-2.amazonaws.com/Profile/profile-bg-warriors-transparent.png')),
        alt: ("Background Image"),
        maxHeight: ("529px"),
        maxWidth: ("100%"),
        cover: (true),
        ...{ style: ({}) },
    }, ...__VLS_functionalComponentArgsRest(__VLS_7));
    const __VLS_12 = {}.VBtn;
    /** @type { [typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ] } */ ;
    // @ts-ignore
    const __VLS_13 = __VLS_asFunctionalComponent(__VLS_12, new __VLS_12({
        ...{ 'onClick': {} },
        icon: ("mdi-arrow-left"),
        ...{ class: ("position-absolute top-0 left-0 ma-2") },
        color: ("rgba(0, 0, 0, 0.6)"),
        elevation: ("3"),
    }));
    const __VLS_14 = __VLS_13({
        ...{ 'onClick': {} },
        icon: ("mdi-arrow-left"),
        ...{ class: ("position-absolute top-0 left-0 ma-2") },
        color: ("rgba(0, 0, 0, 0.6)"),
        elevation: ("3"),
    }, ...__VLS_functionalComponentArgsRest(__VLS_13));
    let __VLS_18;
    const __VLS_19 = {
        onClick: (...[$event]) => {
            __VLS_ctx.$router.go(-1);
        }
    };
    let __VLS_15;
    let __VLS_16;
    var __VLS_17;
    if (__VLS_ctx.isFriend) {
        const __VLS_20 = {}.VMenu;
        /** @type { [typeof __VLS_components.VMenu, typeof __VLS_components.vMenu, typeof __VLS_components.VMenu, typeof __VLS_components.vMenu, ] } */ ;
        // @ts-ignore
        const __VLS_21 = __VLS_asFunctionalComponent(__VLS_20, new __VLS_20({
            openOnHover: (true),
        }));
        const __VLS_22 = __VLS_21({
            openOnHover: (true),
        }, ...__VLS_functionalComponentArgsRest(__VLS_21));
        __VLS_elementAsFunction(__VLS_intrinsicElements.template, __VLS_intrinsicElements.template)({});
        {
            const { activator: __VLS_thisSlot } = __VLS_25.slots;
            const [{ props }] = __VLS_getSlotParams(__VLS_thisSlot);
            const __VLS_26 = {}.VBtn;
            /** @type { [typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ] } */ ;
            // @ts-ignore
            const __VLS_27 = __VLS_asFunctionalComponent(__VLS_26, new __VLS_26({
                ...(props),
                icon: ("mdi-account-check"),
                ...{ class: ("position-absolute top-0 right-0 ma-2") },
                color: ("rgba(0, 0, 0, 0.6)"),
                elevation: ("3"),
            }));
            const __VLS_28 = __VLS_27({
                ...(props),
                icon: ("mdi-account-check"),
                ...{ class: ("position-absolute top-0 right-0 ma-2") },
                color: ("rgba(0, 0, 0, 0.6)"),
                elevation: ("3"),
            }, ...__VLS_functionalComponentArgsRest(__VLS_27));
        }
        var __VLS_25;
    }
    else {
        const __VLS_32 = {}.VBtn;
        /** @type { [typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ] } */ ;
        // @ts-ignore
        const __VLS_33 = __VLS_asFunctionalComponent(__VLS_32, new __VLS_32({
            ...{ 'onClick': {} },
            icon: ("mdi-account-plus"),
            ...{ class: ("position-absolute top-0 right-0 ma-2") },
            color: ("rgba(0, 0, 0, 0.6)"),
            elevation: ("3"),
        }));
        const __VLS_34 = __VLS_33({
            ...{ 'onClick': {} },
            icon: ("mdi-account-plus"),
            ...{ class: ("position-absolute top-0 right-0 ma-2") },
            color: ("rgba(0, 0, 0, 0.6)"),
            elevation: ("3"),
        }, ...__VLS_functionalComponentArgsRest(__VLS_33));
        let __VLS_38;
        const __VLS_39 = {
            onClick: (__VLS_ctx.addFriend)
        };
        let __VLS_35;
        let __VLS_36;
        var __VLS_37;
    }
    __VLS_elementAsFunction(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
        ...{ class: ("user-join-date") },
        ...{ style: ({}) },
    });
    (__VLS_ctx.formattedJoinDate);
    __VLS_11.slots.default;
    var __VLS_11;
    const __VLS_40 = {}.VImg;
    /** @type { [typeof __VLS_components.VImg, typeof __VLS_components.vImg, typeof __VLS_components.VImg, typeof __VLS_components.vImg, ] } */ ;
    // @ts-ignore
    const __VLS_41 = __VLS_asFunctionalComponent(__VLS_40, new __VLS_40({
        key: ((__VLS_ctx.reloadKey)),
        src: ((__VLS_ctx.user.picture_hash
            ? __VLS_ctx.assets + '/Profile/' + __VLS_ctx.user.picture_hash
            : __VLS_ctx.assets + '/Profile/user.png')),
        alt: ((__VLS_ctx.user.picture_hash)),
        maxWidth: ("118"),
        ...{ style: ({}) },
    }));
    const __VLS_42 = __VLS_41({
        key: ((__VLS_ctx.reloadKey)),
        src: ((__VLS_ctx.user.picture_hash
            ? __VLS_ctx.assets + '/Profile/' + __VLS_ctx.user.picture_hash
            : __VLS_ctx.assets + '/Profile/user.png')),
        alt: ((__VLS_ctx.user.picture_hash)),
        maxWidth: ("118"),
        ...{ style: ({}) },
    }, ...__VLS_functionalComponentArgsRest(__VLS_41));
    const __VLS_46 = {}.VCardText;
    /** @type { [typeof __VLS_components.VCardText, typeof __VLS_components.vCardText, typeof __VLS_components.VCardText, typeof __VLS_components.vCardText, ] } */ ;
    // @ts-ignore
    const __VLS_47 = __VLS_asFunctionalComponent(__VLS_46, new __VLS_46({}));
    const __VLS_48 = __VLS_47({}, ...__VLS_functionalComponentArgsRest(__VLS_47));
    __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: ("user-info") },
        ...{ style: ({}) },
    });
    __VLS_elementAsFunction(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
        ...{ class: ("user-name") },
        ...{ style: ({}) },
    });
    (__VLS_ctx.user.user_name);
    __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: ("d-none d-md-inline justify-center align-center") },
    });
    if (__VLS_ctx.isFriend) {
        const __VLS_52 = {}.VMenu;
        /** @type { [typeof __VLS_components.VMenu, typeof __VLS_components.vMenu, typeof __VLS_components.VMenu, typeof __VLS_components.vMenu, ] } */ ;
        // @ts-ignore
        const __VLS_53 = __VLS_asFunctionalComponent(__VLS_52, new __VLS_52({
            openOnHover: (true),
        }));
        const __VLS_54 = __VLS_53({
            openOnHover: (true),
        }, ...__VLS_functionalComponentArgsRest(__VLS_53));
        __VLS_elementAsFunction(__VLS_intrinsicElements.template, __VLS_intrinsicElements.template)({});
        {
            const { activator: __VLS_thisSlot } = __VLS_57.slots;
            const [{ props }] = __VLS_getSlotParams(__VLS_thisSlot);
            const __VLS_58 = {}.VBtn;
            /** @type { [typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ] } */ ;
            // @ts-ignore
            const __VLS_59 = __VLS_asFunctionalComponent(__VLS_58, new __VLS_58({
                ...(props),
                icon: ("mdi-account-check"),
                color: ("rgba(0, 0, 0, 0.0)"),
                elevation: ("0"),
                size: ("small"),
            }));
            const __VLS_60 = __VLS_59({
                ...(props),
                icon: ("mdi-account-check"),
                color: ("rgba(0, 0, 0, 0.0)"),
                elevation: ("0"),
                size: ("small"),
            }, ...__VLS_functionalComponentArgsRest(__VLS_59));
        }
        var __VLS_57;
    }
    else {
        const __VLS_64 = {}.VBtn;
        /** @type { [typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ] } */ ;
        // @ts-ignore
        const __VLS_65 = __VLS_asFunctionalComponent(__VLS_64, new __VLS_64({
            ...{ 'onClick': {} },
            icon: ("mdi-account-plus"),
            color: ("rgba(0, 0, 0, 0.6)"),
            elevation: ("3"),
            size: ("small"),
        }));
        const __VLS_66 = __VLS_65({
            ...{ 'onClick': {} },
            icon: ("mdi-account-plus"),
            color: ("rgba(0, 0, 0, 0.6)"),
            elevation: ("3"),
            size: ("small"),
        }, ...__VLS_functionalComponentArgsRest(__VLS_65));
        let __VLS_70;
        const __VLS_71 = {
            onClick: (__VLS_ctx.addFriend)
        };
        let __VLS_67;
        let __VLS_68;
        var __VLS_69;
    }
    if (__VLS_ctx.showAlert) {
        const __VLS_72 = {}.VAlert;
        /** @type { [typeof __VLS_components.VAlert, typeof __VLS_components.vAlert, typeof __VLS_components.VAlert, typeof __VLS_components.vAlert, ] } */ ;
        // @ts-ignore
        const __VLS_73 = __VLS_asFunctionalComponent(__VLS_72, new __VLS_72({
            type: ("success"),
            ...{ class: ("custom-alert") },
            text: (true),
        }));
        const __VLS_74 = __VLS_73({
            type: ("success"),
            ...{ class: ("custom-alert") },
            text: (true),
        }, ...__VLS_functionalComponentArgsRest(__VLS_73));
        __VLS_77.slots.default;
        var __VLS_77;
    }
    if (__VLS_ctx.showErrorAlert) {
        const __VLS_78 = {}.VAlert;
        /** @type { [typeof __VLS_components.VAlert, typeof __VLS_components.vAlert, typeof __VLS_components.VAlert, typeof __VLS_components.vAlert, ] } */ ;
        // @ts-ignore
        const __VLS_79 = __VLS_asFunctionalComponent(__VLS_78, new __VLS_78({
            type: ("error"),
            ...{ class: ("custom-alert") },
        }));
        const __VLS_80 = __VLS_79({
            type: ("error"),
            ...{ class: ("custom-alert") },
        }, ...__VLS_functionalComponentArgsRest(__VLS_79));
        (__VLS_ctx.errorMessage);
        __VLS_83.slots.default;
        var __VLS_83;
    }
    __VLS_51.slots.default;
    var __VLS_51;
    __VLS_5.slots.default;
    var __VLS_5;
    const __VLS_84 = {}.Badges;
    /** @type { [typeof __VLS_components.Badges, ] } */ ;
    // @ts-ignore
    const __VLS_85 = __VLS_asFunctionalComponent(__VLS_84, new __VLS_84({}));
    const __VLS_86 = __VLS_85({}, ...__VLS_functionalComponentArgsRest(__VLS_85));
    const __VLS_90 = {}.FavoriteCampaignCard;
    /** @type { [typeof __VLS_components.FavoriteCampaignCard, typeof __VLS_components.favoriteCampaignCard, ] } */ ;
    // @ts-ignore
    const __VLS_91 = __VLS_asFunctionalComponent(__VLS_90, new __VLS_90({}));
    const __VLS_92 = __VLS_91({}, ...__VLS_functionalComponentArgsRest(__VLS_91));
    ['profile-card', 'mx-auto', 'py-0', 'position-relative', 'position-absolute', 'top-0', 'left-0', 'ma-2', 'position-absolute', 'top-0', 'right-0', 'ma-2', 'position-absolute', 'top-0', 'right-0', 'ma-2', 'user-join-date', 'user-info', 'user-name', 'd-none', 'd-md-inline', 'justify-center', 'align-center', 'custom-alert', 'custom-alert',];
    var __VLS_slots;
    var $slots;
    let __VLS_inheritedAttrs;
    var $attrs;
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
