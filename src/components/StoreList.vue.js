/// <reference types="../../node_modules/.vue-global-types/vue_3.5_false.d.ts" />
import { ref, inject, computed } from "vue";
import { useRouter } from "vue-router";
const router = useRouter();
const navigateToUser = (userId) => {
    if (!userId)
        return;
    const encodedId = btoa(userId.toString());
    router.push({ name: "User", params: { id: encodedId } });
};
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
                ? `https://druna-assets.s3.us-east-2.amazonaws.com/Profile/${user.picture_hash}`
                : "https://druna-assets.s3.us-east-2.amazonaws.com/Profile/user.png",
            background_hash: user.background_hash,
        }));
    }
    catch (error) {
        users.value = [];
    }
};
; /* PartiallyEnd: #3632/scriptSetup.vue */
function __VLS_template() {
    const __VLS_ctx = {};
    let __VLS_components;
    let __VLS_directives;
    const __VLS_0 = {}.VContainer;
    /** @type { [typeof __VLS_components.VContainer, typeof __VLS_components.vContainer, typeof __VLS_components.VContainer, typeof __VLS_components.vContainer, ] } */ ;
    // @ts-ignore
    const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
        maxWidth: ("776"),
        ...{ class: ("pa-0 pb-8") },
    }));
    const __VLS_2 = __VLS_1({
        maxWidth: ("776"),
        ...{ class: ("pa-0 pb-8") },
    }, ...__VLS_functionalComponentArgsRest(__VLS_1));
    var __VLS_6 = {};
    const __VLS_7 = {}.VCard;
    /** @type { [typeof __VLS_components.VCard, typeof __VLS_components.vCard, typeof __VLS_components.VCard, typeof __VLS_components.vCard, ] } */ ;
    // @ts-ignore
    const __VLS_8 = __VLS_asFunctionalComponent(__VLS_7, new __VLS_7({
        color: ("primary"),
        rounded: ("lg"),
        elevation: ("7"),
        ...{ class: ("pa-2") },
    }));
    const __VLS_9 = __VLS_8({
        color: ("primary"),
        rounded: ("lg"),
        elevation: ("7"),
        ...{ class: ("pa-2") },
    }, ...__VLS_functionalComponentArgsRest(__VLS_8));
    const __VLS_13 = {}.VTextField;
    /** @type { [typeof __VLS_components.VTextField, typeof __VLS_components.vTextField, typeof __VLS_components.VTextField, typeof __VLS_components.vTextField, ] } */ ;
    // @ts-ignore
    const __VLS_14 = __VLS_asFunctionalComponent(__VLS_13, new __VLS_13({
        ...{ 'onInput': {} },
        modelValue: ((__VLS_ctx.searchQuery)),
        label: ("Search User"),
        variant: ("solo-filled"),
        ...{ class: ("pb-0") },
    }));
    const __VLS_15 = __VLS_14({
        ...{ 'onInput': {} },
        modelValue: ((__VLS_ctx.searchQuery)),
        label: ("Search User"),
        variant: ("solo-filled"),
        ...{ class: ("pb-0") },
    }, ...__VLS_functionalComponentArgsRest(__VLS_14));
    let __VLS_19;
    const __VLS_20 = {
        onInput: (__VLS_ctx.fetchUsers)
    };
    let __VLS_16;
    let __VLS_17;
    var __VLS_18;
    for (const [user] of __VLS_getVForSourceType((__VLS_ctx.filteredUsers))) {
        const __VLS_21 = {}.VCard;
        /** @type { [typeof __VLS_components.VCard, typeof __VLS_components.vCard, typeof __VLS_components.VCard, typeof __VLS_components.vCard, ] } */ ;
        // @ts-ignore
        const __VLS_22 = __VLS_asFunctionalComponent(__VLS_21, new __VLS_21({
            ...{ 'onClick': {} },
            key: ((user.users_pk)),
            ...{ class: ("pa-1 mt-3 position-relative") },
            rounded: ("lg"),
            elevation: ("10"),
        }));
        const __VLS_23 = __VLS_22({
            ...{ 'onClick': {} },
            key: ((user.users_pk)),
            ...{ class: ("pa-1 mt-3 position-relative") },
            rounded: ("lg"),
            elevation: ("10"),
        }, ...__VLS_functionalComponentArgsRest(__VLS_22));
        let __VLS_27;
        const __VLS_28 = {
            onClick: (...[$event]) => {
                __VLS_ctx.navigateToUser(user.users_pk);
            }
        };
        let __VLS_24;
        let __VLS_25;
        __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: ("background-overlay") },
            ...{ style: (({
                    backgroundImage: user.background_hash
                        ? `url(https://druna-assets.s3.us-east-2.amazonaws.com/Profile/${user.background_hash})`
                        : 'url(https://druna-assets.s3.us-east-2.amazonaws.com/Profile/profile-bg-warriors-transparent.png)',
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
                })) },
        });
        const __VLS_29 = {}.VRow;
        /** @type { [typeof __VLS_components.VRow, typeof __VLS_components.vRow, typeof __VLS_components.VRow, typeof __VLS_components.vRow, ] } */ ;
        // @ts-ignore
        const __VLS_30 = __VLS_asFunctionalComponent(__VLS_29, new __VLS_29({
            ...{ class: ("position-relative") },
            ...{ style: ({}) },
        }));
        const __VLS_31 = __VLS_30({
            ...{ class: ("position-relative") },
            ...{ style: ({}) },
        }, ...__VLS_functionalComponentArgsRest(__VLS_30));
        const __VLS_35 = {}.VCol;
        /** @type { [typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ] } */ ;
        // @ts-ignore
        const __VLS_36 = __VLS_asFunctionalComponent(__VLS_35, new __VLS_35({
            cols: ("4"),
            lg: ("2"),
            ...{ class: ("d-flex align-center justify-center pl-6") },
        }));
        const __VLS_37 = __VLS_36({
            cols: ("4"),
            lg: ("2"),
            ...{ class: ("d-flex align-center justify-center pl-6") },
        }, ...__VLS_functionalComponentArgsRest(__VLS_36));
        const __VLS_41 = {}.VImg;
        /** @type { [typeof __VLS_components.VImg, typeof __VLS_components.vImg, typeof __VLS_components.VImg, typeof __VLS_components.vImg, ] } */ ;
        // @ts-ignore
        const __VLS_42 = __VLS_asFunctionalComponent(__VLS_41, new __VLS_41({
            src: ((user.picture_hash)),
            alt: ("User Profile Image"),
            maxWidth: ("90"),
            maxHeight: ("90"),
            ...{ class: ("rounded-lg bg-background") },
        }));
        const __VLS_43 = __VLS_42({
            src: ((user.picture_hash)),
            alt: ("User Profile Image"),
            maxWidth: ("90"),
            maxHeight: ("90"),
            ...{ class: ("rounded-lg bg-background") },
        }, ...__VLS_functionalComponentArgsRest(__VLS_42));
        __VLS_40.slots.default;
        var __VLS_40;
        const __VLS_47 = {}.VCol;
        /** @type { [typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ] } */ ;
        // @ts-ignore
        const __VLS_48 = __VLS_asFunctionalComponent(__VLS_47, new __VLS_47({
            cols: ("7"),
        }));
        const __VLS_49 = __VLS_48({
            cols: ("7"),
        }, ...__VLS_functionalComponentArgsRest(__VLS_48));
        __VLS_elementAsFunction(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
            ...{ class: ("font-weight-bold text-truncate") },
        });
        (user.user_name);
        __VLS_elementAsFunction(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
            ...{ class: ("text-caption grey--text") },
        });
        (user.join_date);
        __VLS_52.slots.default;
        var __VLS_52;
        __VLS_34.slots.default;
        var __VLS_34;
        __VLS_26.slots.default;
        var __VLS_26;
    }
    __VLS_12.slots.default;
    var __VLS_12;
    __VLS_5.slots.default;
    var __VLS_5;
    ['pa-0', 'pb-8', 'pa-2', 'pb-0', 'pa-1', 'mt-3', 'position-relative', 'background-overlay', 'position-relative', 'd-flex', 'align-center', 'justify-center', 'pl-6', 'rounded-lg', 'bg-background', 'font-weight-bold', 'text-truncate', 'text-caption', 'grey--text',];
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
            navigateToUser: navigateToUser,
            searchQuery: searchQuery,
            filteredUsers: filteredUsers,
            fetchUsers: fetchUsers,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
    __typeEl: {},
});
; /* PartiallyEnd: #4569/main.vue */
