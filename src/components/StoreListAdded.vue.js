/// <reference types="../../node_modules/.vue-global-types/vue_3.5_false.d.ts" />
import { ref, computed, onMounted, inject } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "@/store/UserStore";
const axios = inject("axios");
const apiUrl = inject("apiUrl") || "https://api.drunagor.app/test/system";
const userStore = useUserStore();
const userId = userStore.user.users_pk;
const router = useRouter();
// **Estados**
const activeTab = ref("friends");
const searchQuery = ref("");
const friends = ref([]);
const requests = ref([]);
const navigateToUser = (userId) => {
    try {
        if (!userId)
            throw new Error("ID do usuário não encontrado!");
        const encodedId = btoa(userId.toString());
        console.log("Navegando para ID codificado:", encodedId);
        router.push({ name: "User", params: { id: encodedId } });
    }
    catch (error) {
        console.error("Erro ao navegar:", error.message);
    }
};
const fetchFriends = async () => {
    try {
        const userStore = useUserStore();
        const userId = userStore.user?.users_pk; // Obtém o ID do usuário logado
        if (!userId) {
            console.error("❌ Erro: Usuário não identificado.");
            return;
        }
        const response = await axios.get(`${apiUrl}/friends/list_friends`, {
            params: { invite_users_fk: userId, accepted: true },
            headers: {
                Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
        });
        const friendData = response.data.friends;
        console.log("🔍 Dados dos amigos recebidos:", friendData);
        // Processa os amigos e define `friends_id` corretamente
        friends.value = friendData.map((friend) => ({
            friends_pk: friend.friends_pk,
            user_name: friend.user_name,
            friends_id: friend.invite_users_fk === userId
                ? friend.recipient_users_fk // Se o usuário logado foi quem enviou o pedido, pega o recebedor
                : friend.invite_users_fk, // Caso contrário, pega quem enviou
            image: friend.picture_hash
                ? `https://assets.drunagor.app.s3.us-east-2.amazonaws.com/Profile/${friend.picture_hash}`
                : `https://assets.drunagor.app.s3.us-east-2.amazonaws.com/Profile/user.png`,
            background_hash: friend.background_hash,
            accepted: true,
        }));
    }
    catch (error) {
        console.error("❌ Erro ao buscar amigos:", error.response?.data || error.message);
    }
};
const fetchRequests = async () => {
    try {
        const response = await axios.get(`${apiUrl}/friends/list_requests`, {
            params: { recipient_users_fk: userId, accepted: false, active: true },
            headers: {
                Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
        });
        const friendRequests = response.data.friends || [];
        requests.value = friendRequests.map((friend) => ({
            friends_pk: friend.friends_pk,
            user_name: friend.user_name,
            friends_id: friend.invite_users_fk,
            image: friend.picture_hash
                ? `https://assets.drunagor.app.s3.us-east-2.amazonaws.com/Profile/${friend.picture_hash}`
                : `https://assets.drunagor.app.s3.us-east-2.amazonaws.com/Profile/user.png`,
            background_hash: friend.background_hash,
            accepted: false,
        }));
    }
    catch (error) { }
};
const acceptFriend = async (friends_pk) => {
    if (!friends_pk) {
        console.error("❌ Erro: O ID do pedido de amizade (friends_pk) não foi fornecido.");
        return;
    }
    try {
        // Fazendo o PUT na API para aceitar a amizade
        await axios.put(`${apiUrl}/friends/accept/${friends_pk}`, {}, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
        });
        // 🔄 Atualiza a lista após aceitar
        await fetchFriends();
        await fetchRequests();
    }
    catch (error) {
        console.error("❌ Erro ao aceitar amizade:", error.response?.data || error.message);
    }
};
// **Recusar amizade após buscar friends_pk**
const declineFriend = async (recipientId) => {
    try {
        // 1️⃣ Busca o `friends_pk` com base no recipient_users_fk
        const response = await axios.get(`${apiUrl}/friends/list`, {
            params: { invite_users_fk: userId, accepted: false },
            headers: {
                Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
        });
        const request = response.data.friends.find((friend) => friend.invite_users_fk === recipientId);
        if (!request) {
            console.error("❌ Nenhuma solicitação de amizade encontrada para este usuário.");
            return;
        }
        const friends_pk = request.friends_pk; // Obtém o ID do pedido
        // 2️⃣ Recusa a amizade passando o `friends_pk`
        await axios.delete(`${apiUrl}/friends/${friends_pk}/delete`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
        });
        // 🔄 Atualiza a lista após recusar
        await fetchRequests();
    }
    catch (error) {
        console.error("❌ Erro ao recusar amizade:", error.response?.data || error.message);
    }
};
// **Lista filtrada**
const filteredList = computed(() => {
    const list = activeTab.value === "friends" ? friends.value : requests.value;
    if (!searchQuery.value)
        return list;
    return list.filter((item) => item.user_name.toLowerCase().includes(searchQuery.value.toLowerCase()));
});
watch(activeTab, (newTab) => {
    if (newTab === "friends") {
        fetchFriends();
    }
    else if (newTab === "requests") {
        fetchRequests();
    }
});
onMounted(fetchRequests);
onMounted(fetchFriends);
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
        ...{ class: ("pa-4") },
    }));
    const __VLS_2 = __VLS_1({
        maxWidth: ("776"),
        ...{ class: ("pa-4") },
    }, ...__VLS_functionalComponentArgsRest(__VLS_1));
    var __VLS_6 = {};
    const __VLS_7 = {}.VCard;
    /** @type { [typeof __VLS_components.VCard, typeof __VLS_components.vCard, typeof __VLS_components.VCard, typeof __VLS_components.vCard, ] } */ ;
    // @ts-ignore
    const __VLS_8 = __VLS_asFunctionalComponent(__VLS_7, new __VLS_7({
        color: ("primary"),
        rounded: ("lg"),
        elevation: ("6"),
        ...{ class: ("pa-4") },
    }));
    const __VLS_9 = __VLS_8({
        color: ("primary"),
        rounded: ("lg"),
        elevation: ("6"),
        ...{ class: ("pa-4") },
    }, ...__VLS_functionalComponentArgsRest(__VLS_8));
    const __VLS_13 = {}.VCol;
    /** @type { [typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ] } */ ;
    // @ts-ignore
    const __VLS_14 = __VLS_asFunctionalComponent(__VLS_13, new __VLS_13({
        cols: ("12"),
        ...{ class: ("d-flex justify-center pa-0") },
    }));
    const __VLS_15 = __VLS_14({
        cols: ("12"),
        ...{ class: ("d-flex justify-center pa-0") },
    }, ...__VLS_functionalComponentArgsRest(__VLS_14));
    const __VLS_19 = {}.VTabs;
    /** @type { [typeof __VLS_components.VTabs, typeof __VLS_components.vTabs, typeof __VLS_components.VTabs, typeof __VLS_components.vTabs, ] } */ ;
    // @ts-ignore
    const __VLS_20 = __VLS_asFunctionalComponent(__VLS_19, new __VLS_19({
        modelValue: ((__VLS_ctx.activeTab)),
        ...{ class: ("mb-4") },
    }));
    const __VLS_21 = __VLS_20({
        modelValue: ((__VLS_ctx.activeTab)),
        ...{ class: ("mb-4") },
    }, ...__VLS_functionalComponentArgsRest(__VLS_20));
    const __VLS_25 = {}.VTab;
    /** @type { [typeof __VLS_components.VTab, typeof __VLS_components.vTab, typeof __VLS_components.VTab, typeof __VLS_components.vTab, ] } */ ;
    // @ts-ignore
    const __VLS_26 = __VLS_asFunctionalComponent(__VLS_25, new __VLS_25({
        value: (('friends')),
        ...{ class: ("text-h5 text-bold") },
    }));
    const __VLS_27 = __VLS_26({
        value: (('friends')),
        ...{ class: ("text-h5 text-bold") },
    }, ...__VLS_functionalComponentArgsRest(__VLS_26));
    __VLS_30.slots.default;
    var __VLS_30;
    const __VLS_31 = {}.VTab;
    /** @type { [typeof __VLS_components.VTab, typeof __VLS_components.vTab, typeof __VLS_components.VTab, typeof __VLS_components.vTab, ] } */ ;
    // @ts-ignore
    const __VLS_32 = __VLS_asFunctionalComponent(__VLS_31, new __VLS_31({
        value: (('requests')),
        ...{ class: ("text-h5 text-bold") },
    }));
    const __VLS_33 = __VLS_32({
        value: (('requests')),
        ...{ class: ("text-h5 text-bold") },
    }, ...__VLS_functionalComponentArgsRest(__VLS_32));
    __VLS_36.slots.default;
    var __VLS_36;
    __VLS_24.slots.default;
    var __VLS_24;
    __VLS_18.slots.default;
    var __VLS_18;
    const __VLS_37 = {}.VTextField;
    /** @type { [typeof __VLS_components.VTextField, typeof __VLS_components.vTextField, typeof __VLS_components.VTextField, typeof __VLS_components.vTextField, ] } */ ;
    // @ts-ignore
    const __VLS_38 = __VLS_asFunctionalComponent(__VLS_37, new __VLS_37({
        modelValue: ((__VLS_ctx.searchQuery)),
        label: ("Search"),
        variant: ("solo-filled"),
        ...{ class: ("pb-0") },
    }));
    const __VLS_39 = __VLS_38({
        modelValue: ((__VLS_ctx.searchQuery)),
        label: ("Search"),
        variant: ("solo-filled"),
        ...{ class: ("pb-0") },
    }, ...__VLS_functionalComponentArgsRest(__VLS_38));
    const __VLS_43 = {}.VVirtualScroll;
    /** @type { [typeof __VLS_components.VVirtualScroll, typeof __VLS_components.vVirtualScroll, typeof __VLS_components.VVirtualScroll, typeof __VLS_components.vVirtualScroll, ] } */ ;
    // @ts-ignore
    const __VLS_44 = __VLS_asFunctionalComponent(__VLS_43, new __VLS_43({
        items: ((__VLS_ctx.filteredList)),
        itemHeight: ((100)),
    }));
    const __VLS_45 = __VLS_44({
        items: ((__VLS_ctx.filteredList)),
        itemHeight: ((100)),
    }, ...__VLS_functionalComponentArgsRest(__VLS_44));
    __VLS_elementAsFunction(__VLS_intrinsicElements.template, __VLS_intrinsicElements.template)({});
    {
        const { default: __VLS_thisSlot } = __VLS_48.slots;
        const [{ item }] = __VLS_getSlotParams(__VLS_thisSlot);
        const __VLS_49 = {}.VMenu;
        /** @type { [typeof __VLS_components.VMenu, typeof __VLS_components.vMenu, typeof __VLS_components.VMenu, typeof __VLS_components.vMenu, ] } */ ;
        // @ts-ignore
        const __VLS_50 = __VLS_asFunctionalComponent(__VLS_49, new __VLS_49({
            offsetY: (true),
        }));
        const __VLS_51 = __VLS_50({
            offsetY: (true),
        }, ...__VLS_functionalComponentArgsRest(__VLS_50));
        __VLS_elementAsFunction(__VLS_intrinsicElements.template, __VLS_intrinsicElements.template)({});
        {
            const { activator: __VLS_thisSlot } = __VLS_54.slots;
            const [{ props }] = __VLS_getSlotParams(__VLS_thisSlot);
            const __VLS_55 = {}.VCard;
            /** @type { [typeof __VLS_components.VCard, typeof __VLS_components.vCard, typeof __VLS_components.VCard, typeof __VLS_components.vCard, ] } */ ;
            // @ts-ignore
            const __VLS_56 = __VLS_asFunctionalComponent(__VLS_55, new __VLS_55({
                ...{ 'onClick': {} },
                ...{ class: ("pa-1 mb-3 cursor-pointer") },
                rounded: ("lg"),
                elevation: ("10"),
                ...(props),
            }));
            const __VLS_57 = __VLS_56({
                ...{ 'onClick': {} },
                ...{ class: ("pa-1 mb-3 cursor-pointer") },
                rounded: ("lg"),
                elevation: ("10"),
                ...(props),
            }, ...__VLS_functionalComponentArgsRest(__VLS_56));
            let __VLS_61;
            const __VLS_62 = {
                onClick: (...[$event]) => {
                    __VLS_ctx.navigateToUser(item.friends_id);
                }
            };
            let __VLS_58;
            let __VLS_59;
            __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: ("background-overlay") },
                ...{ style: (({
                        backgroundImage: item.background_hash
                            ? `url(https://assets.drunagor.app.s3.us-east-2.amazonaws.com/Profile/${item.background_hash})`
                            : 'url(https://assets.drunagor.app.s3.us-east-2.amazonaws.com/Profile/profile-bg-warriors-transparent.png)',
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
            const __VLS_63 = {}.VRow;
            /** @type { [typeof __VLS_components.VRow, typeof __VLS_components.vRow, typeof __VLS_components.VRow, typeof __VLS_components.vRow, ] } */ ;
            // @ts-ignore
            const __VLS_64 = __VLS_asFunctionalComponent(__VLS_63, new __VLS_63({}));
            const __VLS_65 = __VLS_64({}, ...__VLS_functionalComponentArgsRest(__VLS_64));
            const __VLS_69 = {}.VCol;
            /** @type { [typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ] } */ ;
            // @ts-ignore
            const __VLS_70 = __VLS_asFunctionalComponent(__VLS_69, new __VLS_69({
                cols: ("4"),
                lg: ("2"),
                ...{ class: ("d-flex align-center justify-center") },
            }));
            const __VLS_71 = __VLS_70({
                cols: ("4"),
                lg: ("2"),
                ...{ class: ("d-flex align-center justify-center") },
            }, ...__VLS_functionalComponentArgsRest(__VLS_70));
            const __VLS_75 = {}.VImg;
            /** @type { [typeof __VLS_components.VImg, typeof __VLS_components.vImg, typeof __VLS_components.VImg, typeof __VLS_components.vImg, ] } */ ;
            // @ts-ignore
            const __VLS_76 = __VLS_asFunctionalComponent(__VLS_75, new __VLS_75({
                src: ((item.image)),
                alt: ("User Image"),
                maxWidth: ("90"),
                maxHeight: ("90"),
                ...{ class: ("rounded-lg") },
            }));
            const __VLS_77 = __VLS_76({
                src: ((item.image)),
                alt: ("User Image"),
                maxWidth: ("90"),
                maxHeight: ("90"),
                ...{ class: ("rounded-lg") },
            }, ...__VLS_functionalComponentArgsRest(__VLS_76));
            __VLS_74.slots.default;
            var __VLS_74;
            const __VLS_81 = {}.VCol;
            /** @type { [typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ] } */ ;
            // @ts-ignore
            const __VLS_82 = __VLS_asFunctionalComponent(__VLS_81, new __VLS_81({
                cols: ("6"),
            }));
            const __VLS_83 = __VLS_82({
                cols: ("6"),
            }, ...__VLS_functionalComponentArgsRest(__VLS_82));
            __VLS_elementAsFunction(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
                ...{ class: ("font-weight-bold text-truncate") },
            });
            (item.user_name);
            __VLS_86.slots.default;
            var __VLS_86;
            if (!item.accepted) {
                const __VLS_87 = {}.VCol;
                /** @type { [typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ] } */ ;
                // @ts-ignore
                const __VLS_88 = __VLS_asFunctionalComponent(__VLS_87, new __VLS_87({
                    cols: ("2"),
                    md: ("4"),
                    ...{ class: ("d-flex justify-end align-center") },
                }));
                const __VLS_89 = __VLS_88({
                    cols: ("2"),
                    md: ("4"),
                    ...{ class: ("d-flex justify-end align-center") },
                }, ...__VLS_functionalComponentArgsRest(__VLS_88));
                const __VLS_93 = {}.VBtn;
                /** @type { [typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ] } */ ;
                // @ts-ignore
                const __VLS_94 = __VLS_asFunctionalComponent(__VLS_93, new __VLS_93({
                    ...{ 'onClick': {} },
                    ...{ class: ("ma-2") },
                    color: ("green"),
                }));
                const __VLS_95 = __VLS_94({
                    ...{ 'onClick': {} },
                    ...{ class: ("ma-2") },
                    color: ("green"),
                }, ...__VLS_functionalComponentArgsRest(__VLS_94));
                let __VLS_99;
                const __VLS_100 = {
                    onClick: (...[$event]) => {
                        if (!((!item.accepted)))
                            return;
                        __VLS_ctx.acceptFriend(item.friends_pk);
                    }
                };
                let __VLS_96;
                let __VLS_97;
                __VLS_98.slots.default;
                var __VLS_98;
                const __VLS_101 = {}.VBtn;
                /** @type { [typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ] } */ ;
                // @ts-ignore
                const __VLS_102 = __VLS_asFunctionalComponent(__VLS_101, new __VLS_101({
                    ...{ 'onClick': {} },
                    ...{ class: ("ma-2") },
                    color: ("red"),
                }));
                const __VLS_103 = __VLS_102({
                    ...{ 'onClick': {} },
                    ...{ class: ("ma-2") },
                    color: ("red"),
                }, ...__VLS_functionalComponentArgsRest(__VLS_102));
                let __VLS_107;
                const __VLS_108 = {
                    onClick: (...[$event]) => {
                        if (!((!item.accepted)))
                            return;
                        __VLS_ctx.declineFriend(item.friends_pk);
                    }
                };
                let __VLS_104;
                let __VLS_105;
                __VLS_106.slots.default;
                var __VLS_106;
                __VLS_92.slots.default;
                var __VLS_92;
            }
            __VLS_68.slots.default;
            var __VLS_68;
            __VLS_60.slots.default;
            var __VLS_60;
        }
        var __VLS_54;
    }
    var __VLS_48;
    __VLS_12.slots.default;
    var __VLS_12;
    __VLS_5.slots.default;
    var __VLS_5;
    ['pa-4', 'pa-4', 'd-flex', 'justify-center', 'pa-0', 'mb-4', 'text-h5', 'text-bold', 'text-h5', 'text-bold', 'pb-0', 'pa-1', 'mb-3', 'cursor-pointer', 'background-overlay', 'd-flex', 'align-center', 'justify-center', 'rounded-lg', 'font-weight-bold', 'text-truncate', 'd-flex', 'justify-end', 'align-center', 'ma-2', 'ma-2',];
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
            activeTab: activeTab,
            searchQuery: searchQuery,
            navigateToUser: navigateToUser,
            acceptFriend: acceptFriend,
            declineFriend: declineFriend,
            filteredList: filteredList,
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
