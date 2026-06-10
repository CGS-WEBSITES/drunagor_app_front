/// <reference types="../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import { ref, inject, computed } from "vue";
import { useRouter } from "vue-router";
const router = useRouter();
// Obtém a instância do axios e a URL base da API
const axios = inject("axios");
const apiUrl = inject("apiUrl") || "https://api.drunagor.app/test/system";
// Variáveis
const users = ref([]);
const searchQuery = ref("");
// Computed para garantir que apenas os usuários cujo `user_name` começa com o termo sejam exibidos
const filteredUsers = computed(() => {
    if (!searchQuery.value)
        return users.value;
    return users.value.filter((user) => user.user_name.toLowerCase().startsWith(searchQuery.value.toLowerCase()));
});
const navigateToUser = (userId) => {
    if (!userId)
        return;
    const encodedId = btoa(userId.toString());
    router.push({ name: "User", params: { id: encodedId } });
};
// Busca usuários pelo nome digitado
const fetchUsers = async () => {
    if (!searchQuery.value)
        return;
    try {
        const response = await axios.get(`${apiUrl}/users/search`, {
            params: { user_name: searchQuery.value }, // Busca pelo nome de usuário
            headers: {
                Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
        });
        if (!response.data.users || response.data.users.length === 0) {
            users.value = [];
            return;
        }
        users.value = response.data.users.map((user) => ({
            users_pk: user.users_pk, // ID do usuário
            name: user.nome || "Name not available",
            user_name: user.user_name || "User not found",
            join_date: user.join_date || "Date not available",
            picture_hash: user.picture_hash
                ? `https://assets.drunagor.app/Profile/${user.picture_hash}`
                : "https://assets.drunagor.app/Profile/user.png",
            background_hash: user.background_hash,
        }));
    }
    catch (error) {
        users.value = [];
    }
};
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
const __VLS_0 = {}.VContainer;
/** @type {[typeof __VLS_components.VContainer, typeof __VLS_components.vContainer, typeof __VLS_components.VContainer, typeof __VLS_components.vContainer, ]} */ ;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
    maxWidth: "776",
    ...{ class: "pa-0 pb-8" },
}));
const __VLS_2 = __VLS_1({
    maxWidth: "776",
    ...{ class: "pa-0 pb-8" },
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
var __VLS_4 = {};
__VLS_3.slots.default;
const __VLS_5 = {}.VCard;
/** @type {[typeof __VLS_components.VCard, typeof __VLS_components.vCard, typeof __VLS_components.VCard, typeof __VLS_components.vCard, ]} */ ;
// @ts-ignore
const __VLS_6 = __VLS_asFunctionalComponent(__VLS_5, new __VLS_5({
    color: "primary",
    rounded: "lg",
    elevation: "7",
    ...{ class: "pa-2" },
}));
const __VLS_7 = __VLS_6({
    color: "primary",
    rounded: "lg",
    elevation: "7",
    ...{ class: "pa-2" },
}, ...__VLS_functionalComponentArgsRest(__VLS_6));
__VLS_8.slots.default;
const __VLS_9 = {}.VTextField;
/** @type {[typeof __VLS_components.VTextField, typeof __VLS_components.vTextField, typeof __VLS_components.VTextField, typeof __VLS_components.vTextField, ]} */ ;
// @ts-ignore
const __VLS_10 = __VLS_asFunctionalComponent(__VLS_9, new __VLS_9({
    ...{ 'onInput': {} },
    modelValue: (__VLS_ctx.searchQuery),
    label: "Search User",
    variant: "solo-filled",
    ...{ class: "pb-0" },
}));
const __VLS_11 = __VLS_10({
    ...{ 'onInput': {} },
    modelValue: (__VLS_ctx.searchQuery),
    label: "Search User",
    variant: "solo-filled",
    ...{ class: "pb-0" },
}, ...__VLS_functionalComponentArgsRest(__VLS_10));
let __VLS_13;
let __VLS_14;
let __VLS_15;
const __VLS_16 = {
    onInput: (__VLS_ctx.fetchUsers)
};
var __VLS_12;
for (const [user] of __VLS_getVForSourceType((__VLS_ctx.filteredUsers))) {
    const __VLS_17 = {}.VCard;
    /** @type {[typeof __VLS_components.VCard, typeof __VLS_components.vCard, typeof __VLS_components.VCard, typeof __VLS_components.vCard, ]} */ ;
    // @ts-ignore
    const __VLS_18 = __VLS_asFunctionalComponent(__VLS_17, new __VLS_17({
        ...{ 'onClick': {} },
        key: (user.users_pk),
        ...{ class: "pa-1 mt-3 position-relative" },
        rounded: "lg",
        elevation: "10",
    }));
    const __VLS_19 = __VLS_18({
        ...{ 'onClick': {} },
        key: (user.users_pk),
        ...{ class: "pa-1 mt-3 position-relative" },
        rounded: "lg",
        elevation: "10",
    }, ...__VLS_functionalComponentArgsRest(__VLS_18));
    let __VLS_21;
    let __VLS_22;
    let __VLS_23;
    const __VLS_24 = {
        onClick: (...[$event]) => {
            __VLS_ctx.navigateToUser(user.users_pk);
        }
    };
    __VLS_20.slots.default;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "background-overlay" },
        ...{ style: ({
                backgroundImage: user.background_hash
                    ? `url(https://assets.drunagor.app/Profile/${user.background_hash})`
                    : 'url(https://assets.drunagor.app/Profile/profile-bg-warriors-transparent.png)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                borderRadius: '8px',
                zIndex: 0,
            }) },
    });
    const __VLS_25 = {}.VRow;
    /** @type {[typeof __VLS_components.VRow, typeof __VLS_components.vRow, typeof __VLS_components.VRow, typeof __VLS_components.vRow, ]} */ ;
    // @ts-ignore
    const __VLS_26 = __VLS_asFunctionalComponent(__VLS_25, new __VLS_25({
        ...{ class: "position-relative" },
        ...{ style: {} },
    }));
    const __VLS_27 = __VLS_26({
        ...{ class: "position-relative" },
        ...{ style: {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_26));
    __VLS_28.slots.default;
    const __VLS_29 = {}.VCol;
    /** @type {[typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ]} */ ;
    // @ts-ignore
    const __VLS_30 = __VLS_asFunctionalComponent(__VLS_29, new __VLS_29({
        cols: "4",
        lg: "2",
        ...{ class: "d-flex align-center justify-center pl-6" },
    }));
    const __VLS_31 = __VLS_30({
        cols: "4",
        lg: "2",
        ...{ class: "d-flex align-center justify-center pl-6" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_30));
    __VLS_32.slots.default;
    const __VLS_33 = {}.VImg;
    /** @type {[typeof __VLS_components.VImg, typeof __VLS_components.vImg, typeof __VLS_components.VImg, typeof __VLS_components.vImg, ]} */ ;
    // @ts-ignore
    const __VLS_34 = __VLS_asFunctionalComponent(__VLS_33, new __VLS_33({
        src: (user.picture_hash),
        alt: "User Profile Image",
        maxWidth: "90",
        maxHeight: "90",
        ...{ class: "rounded-lg bg-background" },
    }));
    const __VLS_35 = __VLS_34({
        src: (user.picture_hash),
        alt: "User Profile Image",
        maxWidth: "90",
        maxHeight: "90",
        ...{ class: "rounded-lg bg-background" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_34));
    var __VLS_32;
    const __VLS_37 = {}.VCol;
    /** @type {[typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ]} */ ;
    // @ts-ignore
    const __VLS_38 = __VLS_asFunctionalComponent(__VLS_37, new __VLS_37({
        cols: "7",
    }));
    const __VLS_39 = __VLS_38({
        cols: "7",
    }, ...__VLS_functionalComponentArgsRest(__VLS_38));
    __VLS_40.slots.default;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
        ...{ class: "font-weight-bold text-truncate" },
    });
    (user.user_name);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
        ...{ class: "text-caption grey--text" },
    });
    (user.join_date);
    var __VLS_40;
    var __VLS_28;
    var __VLS_20;
}
var __VLS_8;
var __VLS_3;
/** @type {__VLS_StyleScopedClasses['pa-0']} */ ;
/** @type {__VLS_StyleScopedClasses['pb-8']} */ ;
/** @type {__VLS_StyleScopedClasses['pa-2']} */ ;
/** @type {__VLS_StyleScopedClasses['pb-0']} */ ;
/** @type {__VLS_StyleScopedClasses['pa-1']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-3']} */ ;
/** @type {__VLS_StyleScopedClasses['position-relative']} */ ;
/** @type {__VLS_StyleScopedClasses['background-overlay']} */ ;
/** @type {__VLS_StyleScopedClasses['position-relative']} */ ;
/** @type {__VLS_StyleScopedClasses['d-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['align-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['pl-6']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-background']} */ ;
/** @type {__VLS_StyleScopedClasses['font-weight-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-truncate']} */ ;
/** @type {__VLS_StyleScopedClasses['text-caption']} */ ;
/** @type {__VLS_StyleScopedClasses['grey--text']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            searchQuery: searchQuery,
            filteredUsers: filteredUsers,
            navigateToUser: navigateToUser,
            fetchUsers: fetchUsers,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
