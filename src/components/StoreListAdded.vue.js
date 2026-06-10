/// <reference types="../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import { ref, computed, onMounted, onBeforeUnmount, watch, inject } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "@/store/UserStore";
const axios = inject("axios");
const apiUrl = inject("apiUrl");
const userStore = useUserStore();
const router = useRouter();
const userId = userStore.user?.users_pk;
const mainTab = ref("network");
const activeTab = ref("friends");
const processingRequest = ref(null);
let pollingInterval = null;
const friends = ref([]);
const requests = ref([]);
const users = ref([]);
const friendSearchQuery = ref("");
const globalSearchQuery = ref("");
const filteredFriendsList = computed(() => {
    const list = activeTab.value === "friends" ? friends.value : requests.value;
    if (!friendSearchQuery.value)
        return list;
    return list.filter((item) => item.user_name.toLowerCase().includes(friendSearchQuery.value.toLowerCase()));
});
const filteredGlobalUsers = computed(() => {
    if (!globalSearchQuery.value)
        return users.value;
    return users.value.filter((user) => user.user_name.toLowerCase().startsWith(globalSearchQuery.value.toLowerCase()));
});
const getBackgroundStyle = (hash) => ({
    backgroundImage: hash ? `url(https://assets.drunagor.app/Profile/${hash})` : 'url(https://assets.drunagor.app/Profile/profile-bg-warriors-transparent.png)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
    borderRadius: '8px', zIndex: 0, filter: 'brightness(0.4)'
});
const navigateToUser = (id) => {
    if (!id)
        return;
    const encodedId = btoa(id.toString());
    router.push({ name: "User", params: { id: encodedId } });
};
const fetchFriendsData = async () => {
    if (!userId)
        return;
    try {
        const [friendsRes, requestsRes] = await Promise.all([
            axios.get(`${apiUrl}/friends/list_friends`, { params: { invite_users_fk: userId, accepted: true } }),
            axios.get(`${apiUrl}/friends/list_requests`, { params: { recipient_users_fk: userId, accepted: false, active: true } })
        ]);
        friends.value = (friendsRes.data.friends || []).map(f => ({
            ...f,
            friends_id: f.invite_users_fk === userId ? f.recipient_users_fk : f.invite_users_fk,
            image: f.picture_hash ? `https://assets.drunagor.app/Profile/${f.picture_hash}` : `https://assets.drunagor.app/Profile/user.png`,
            accepted: true
        }));
        requests.value = (requestsRes.data.friends || []).map(r => ({
            ...r,
            friends_id: r.invite_users_fk,
            image: r.picture_hash ? `https://assets.drunagor.app/Profile/${r.picture_hash}` : `https://assets.drunagor.app/Profile/user.png`,
            accepted: false
        }));
    }
    catch (e) {
        console.error(e);
    }
};
const fetchUsers = async () => {
    if (!globalSearchQuery.value) {
        users.value = [];
        return;
    }
    try {
        const response = await axios.get(`${apiUrl}/users/search`, { params: { user_name: globalSearchQuery.value } });
        users.value = (response.data.users || []).map(u => ({
            ...u,
            picture_hash: u.picture_hash ? `https://assets.drunagor.app/Profile/${u.picture_hash}` : "https://assets.drunagor.app/Profile/user.png"
        }));
    }
    catch (e) {
        users.value = [];
    }
};
const acceptFriend = async (item) => {
    processingRequest.value = item.friends_pk;
    try {
        await axios.put(`${apiUrl}/friends/accept/${item.friends_pk}`);
        await fetchFriendsData();
    }
    finally {
        processingRequest.value = null;
    }
};
const declineFriend = async (pk) => {
    processingRequest.value = pk;
    try {
        await axios.delete(`${apiUrl}/friends/${pk}/delete`);
        await fetchFriendsData();
    }
    finally {
        processingRequest.value = null;
    }
};
onMounted(() => {
    fetchFriendsData();
    pollingInterval = setInterval(() => { if (mainTab.value === 'network')
        fetchFriendsData(); }, 8000);
});
onBeforeUnmount(() => { if (pollingInterval)
    clearInterval(pollingInterval); });
watch(mainTab, (val) => { if (val === 'network')
    fetchFriendsData(); });
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['scroll-area']} */ ;
/** @type {__VLS_StyleScopedClasses['scroll-area']} */ ;
/** @type {__VLS_StyleScopedClasses['background-overlay']} */ ;
// CSS variable injection 
// CSS variable injection end 
const __VLS_0 = {}.VContainer;
/** @type {[typeof __VLS_components.VContainer, typeof __VLS_components.vContainer, typeof __VLS_components.VContainer, typeof __VLS_components.vContainer, ]} */ ;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
    maxWidth: "850",
    ...{ class: "pa-4 pt-0 mt-0 social-wrapper" },
}));
const __VLS_2 = __VLS_1({
    maxWidth: "850",
    ...{ class: "pa-4 pt-0 mt-0 social-wrapper" },
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
var __VLS_4 = {};
__VLS_3.slots.default;
const __VLS_5 = {}.VCard;
/** @type {[typeof __VLS_components.VCard, typeof __VLS_components.vCard, typeof __VLS_components.VCard, typeof __VLS_components.vCard, ]} */ ;
// @ts-ignore
const __VLS_6 = __VLS_asFunctionalComponent(__VLS_5, new __VLS_5({
    color: "transparent",
    flat: true,
}));
const __VLS_7 = __VLS_6({
    color: "transparent",
    flat: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_6));
__VLS_8.slots.default;
const __VLS_9 = {}.VTabs;
/** @type {[typeof __VLS_components.VTabs, typeof __VLS_components.vTabs, typeof __VLS_components.VTabs, typeof __VLS_components.vTabs, ]} */ ;
// @ts-ignore
const __VLS_10 = __VLS_asFunctionalComponent(__VLS_9, new __VLS_9({
    modelValue: (__VLS_ctx.mainTab),
    grow: true,
    bgColor: "secondary",
    rounded: "lg",
    ...{ class: "mb-6 elevation-4" },
    indicatorColor: "white",
}));
const __VLS_11 = __VLS_10({
    modelValue: (__VLS_ctx.mainTab),
    grow: true,
    bgColor: "secondary",
    rounded: "lg",
    ...{ class: "mb-6 elevation-4" },
    indicatorColor: "white",
}, ...__VLS_functionalComponentArgsRest(__VLS_10));
__VLS_12.slots.default;
const __VLS_13 = {}.VTab;
/** @type {[typeof __VLS_components.VTab, typeof __VLS_components.vTab, typeof __VLS_components.VTab, typeof __VLS_components.vTab, ]} */ ;
// @ts-ignore
const __VLS_14 = __VLS_asFunctionalComponent(__VLS_13, new __VLS_13({
    value: "network",
}));
const __VLS_15 = __VLS_14({
    value: "network",
}, ...__VLS_functionalComponentArgsRest(__VLS_14));
__VLS_16.slots.default;
const __VLS_17 = {}.VIcon;
/** @type {[typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, ]} */ ;
// @ts-ignore
const __VLS_18 = __VLS_asFunctionalComponent(__VLS_17, new __VLS_17({
    start: true,
}));
const __VLS_19 = __VLS_18({
    start: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_18));
__VLS_20.slots.default;
var __VLS_20;
if (__VLS_ctx.requests.length > 0) {
    const __VLS_21 = {}.VBadge;
    /** @type {[typeof __VLS_components.VBadge, typeof __VLS_components.vBadge, typeof __VLS_components.VBadge, typeof __VLS_components.vBadge, ]} */ ;
    // @ts-ignore
    const __VLS_22 = __VLS_asFunctionalComponent(__VLS_21, new __VLS_21({
        color: "red",
        dot: true,
        offsetX: "-10",
        offsetY: "-10",
    }));
    const __VLS_23 = __VLS_22({
        color: "red",
        dot: true,
        offsetX: "-10",
        offsetY: "-10",
    }, ...__VLS_functionalComponentArgsRest(__VLS_22));
}
var __VLS_16;
const __VLS_25 = {}.VTab;
/** @type {[typeof __VLS_components.VTab, typeof __VLS_components.vTab, typeof __VLS_components.VTab, typeof __VLS_components.vTab, ]} */ ;
// @ts-ignore
const __VLS_26 = __VLS_asFunctionalComponent(__VLS_25, new __VLS_25({
    value: "search",
}));
const __VLS_27 = __VLS_26({
    value: "search",
}, ...__VLS_functionalComponentArgsRest(__VLS_26));
__VLS_28.slots.default;
const __VLS_29 = {}.VIcon;
/** @type {[typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, ]} */ ;
// @ts-ignore
const __VLS_30 = __VLS_asFunctionalComponent(__VLS_29, new __VLS_29({
    start: true,
}));
const __VLS_31 = __VLS_30({
    start: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_30));
__VLS_32.slots.default;
var __VLS_32;
var __VLS_28;
var __VLS_12;
const __VLS_33 = {}.VWindow;
/** @type {[typeof __VLS_components.VWindow, typeof __VLS_components.vWindow, typeof __VLS_components.VWindow, typeof __VLS_components.vWindow, ]} */ ;
// @ts-ignore
const __VLS_34 = __VLS_asFunctionalComponent(__VLS_33, new __VLS_33({
    modelValue: (__VLS_ctx.mainTab),
    ...{ class: "overflow-visible" },
}));
const __VLS_35 = __VLS_34({
    modelValue: (__VLS_ctx.mainTab),
    ...{ class: "overflow-visible" },
}, ...__VLS_functionalComponentArgsRest(__VLS_34));
__VLS_36.slots.default;
const __VLS_37 = {}.VWindowItem;
/** @type {[typeof __VLS_components.VWindowItem, typeof __VLS_components.vWindowItem, typeof __VLS_components.VWindowItem, typeof __VLS_components.vWindowItem, ]} */ ;
// @ts-ignore
const __VLS_38 = __VLS_asFunctionalComponent(__VLS_37, new __VLS_37({
    value: "network",
}));
const __VLS_39 = __VLS_38({
    value: "network",
}, ...__VLS_functionalComponentArgsRest(__VLS_38));
__VLS_40.slots.default;
const __VLS_41 = {}.VCard;
/** @type {[typeof __VLS_components.VCard, typeof __VLS_components.vCard, typeof __VLS_components.VCard, typeof __VLS_components.vCard, ]} */ ;
// @ts-ignore
const __VLS_42 = __VLS_asFunctionalComponent(__VLS_41, new __VLS_41({
    color: "primary",
    rounded: "lg",
    elevation: "6",
    ...{ class: "pa-4 fixed-main-card" },
}));
const __VLS_43 = __VLS_42({
    color: "primary",
    rounded: "lg",
    elevation: "6",
    ...{ class: "pa-4 fixed-main-card" },
}, ...__VLS_functionalComponentArgsRest(__VLS_42));
__VLS_44.slots.default;
const __VLS_45 = {}.VTabs;
/** @type {[typeof __VLS_components.VTabs, typeof __VLS_components.vTabs, typeof __VLS_components.VTabs, typeof __VLS_components.vTabs, ]} */ ;
// @ts-ignore
const __VLS_46 = __VLS_asFunctionalComponent(__VLS_45, new __VLS_45({
    modelValue: (__VLS_ctx.activeTab),
    ...{ class: "mb-4 overflow-visible-tabs" },
    centered: true,
}));
const __VLS_47 = __VLS_46({
    modelValue: (__VLS_ctx.activeTab),
    ...{ class: "mb-4 overflow-visible-tabs" },
    centered: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_46));
__VLS_48.slots.default;
const __VLS_49 = {}.VTab;
/** @type {[typeof __VLS_components.VTab, typeof __VLS_components.vTab, typeof __VLS_components.VTab, typeof __VLS_components.vTab, ]} */ ;
// @ts-ignore
const __VLS_50 = __VLS_asFunctionalComponent(__VLS_49, new __VLS_49({
    value: "friends",
    ...{ class: "text-h6" },
}));
const __VLS_51 = __VLS_50({
    value: "friends",
    ...{ class: "text-h6" },
}, ...__VLS_functionalComponentArgsRest(__VLS_50));
__VLS_52.slots.default;
var __VLS_52;
const __VLS_53 = {}.VBadge;
/** @type {[typeof __VLS_components.VBadge, typeof __VLS_components.vBadge, typeof __VLS_components.VBadge, typeof __VLS_components.vBadge, ]} */ ;
// @ts-ignore
const __VLS_54 = __VLS_asFunctionalComponent(__VLS_53, new __VLS_53({
    modelValue: (__VLS_ctx.requests.length > 0),
    color: "red",
    content: (__VLS_ctx.requests.length),
    location: "top end",
    offsetX: "8",
    offsetY: "8",
}));
const __VLS_55 = __VLS_54({
    modelValue: (__VLS_ctx.requests.length > 0),
    color: "red",
    content: (__VLS_ctx.requests.length),
    location: "top end",
    offsetX: "8",
    offsetY: "8",
}, ...__VLS_functionalComponentArgsRest(__VLS_54));
__VLS_56.slots.default;
const __VLS_57 = {}.VTab;
/** @type {[typeof __VLS_components.VTab, typeof __VLS_components.vTab, typeof __VLS_components.VTab, typeof __VLS_components.vTab, ]} */ ;
// @ts-ignore
const __VLS_58 = __VLS_asFunctionalComponent(__VLS_57, new __VLS_57({
    value: "requests",
    ...{ class: "text-h6" },
}));
const __VLS_59 = __VLS_58({
    value: "requests",
    ...{ class: "text-h6" },
}, ...__VLS_functionalComponentArgsRest(__VLS_58));
__VLS_60.slots.default;
var __VLS_60;
var __VLS_56;
var __VLS_48;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "search-bar-center mb-4" },
});
const __VLS_61 = {}.VTextField;
/** @type {[typeof __VLS_components.VTextField, typeof __VLS_components.vTextField, typeof __VLS_components.VTextField, typeof __VLS_components.vTextField, ]} */ ;
// @ts-ignore
const __VLS_62 = __VLS_asFunctionalComponent(__VLS_61, new __VLS_61({
    modelValue: (__VLS_ctx.friendSearchQuery),
    placeholder: "Filter list...",
    variant: "solo-filled",
    prependInnerIcon: "mdi-filter",
    hideDetails: true,
    density: "compact",
    ...{ class: "max-width-search" },
}));
const __VLS_63 = __VLS_62({
    modelValue: (__VLS_ctx.friendSearchQuery),
    placeholder: "Filter list...",
    variant: "solo-filled",
    prependInnerIcon: "mdi-filter",
    hideDetails: true,
    density: "compact",
    ...{ class: "max-width-search" },
}, ...__VLS_functionalComponentArgsRest(__VLS_62));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "scroll-area" },
});
const __VLS_65 = {}.VVirtualScroll;
/** @type {[typeof __VLS_components.VVirtualScroll, typeof __VLS_components.vVirtualScroll, typeof __VLS_components.VVirtualScroll, typeof __VLS_components.vVirtualScroll, ]} */ ;
// @ts-ignore
const __VLS_66 = __VLS_asFunctionalComponent(__VLS_65, new __VLS_65({
    items: (__VLS_ctx.filteredFriendsList),
    height: "100%",
    itemHeight: "110",
    ...{ class: "rounded-lg" },
}));
const __VLS_67 = __VLS_66({
    items: (__VLS_ctx.filteredFriendsList),
    height: "100%",
    itemHeight: "110",
    ...{ class: "rounded-lg" },
}, ...__VLS_functionalComponentArgsRest(__VLS_66));
__VLS_68.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_68.slots;
    const [{ item }] = __VLS_getSlotParams(__VLS_thisSlot);
    const __VLS_69 = {}.VCard;
    /** @type {[typeof __VLS_components.VCard, typeof __VLS_components.vCard, typeof __VLS_components.VCard, typeof __VLS_components.vCard, ]} */ ;
    // @ts-ignore
    const __VLS_70 = __VLS_asFunctionalComponent(__VLS_69, new __VLS_69({
        ...{ 'onClick': {} },
        ...{ class: "pa-1 mb-3 cursor-pointer position-relative" },
        rounded: "lg",
        elevation: "10",
    }));
    const __VLS_71 = __VLS_70({
        ...{ 'onClick': {} },
        ...{ class: "pa-1 mb-3 cursor-pointer position-relative" },
        rounded: "lg",
        elevation: "10",
    }, ...__VLS_functionalComponentArgsRest(__VLS_70));
    let __VLS_73;
    let __VLS_74;
    let __VLS_75;
    const __VLS_76 = {
        onClick: (...[$event]) => {
            __VLS_ctx.navigateToUser(item.friends_id);
        }
    };
    __VLS_72.slots.default;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "background-overlay" },
        ...{ style: (__VLS_ctx.getBackgroundStyle(item.background_hash)) },
    });
    const __VLS_77 = {}.VRow;
    /** @type {[typeof __VLS_components.VRow, typeof __VLS_components.vRow, typeof __VLS_components.VRow, typeof __VLS_components.vRow, ]} */ ;
    // @ts-ignore
    const __VLS_78 = __VLS_asFunctionalComponent(__VLS_77, new __VLS_77({
        align: "center",
        ...{ class: "ma-0 fill-height position-relative" },
        ...{ style: {} },
    }));
    const __VLS_79 = __VLS_78({
        align: "center",
        ...{ class: "ma-0 fill-height position-relative" },
        ...{ style: {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_78));
    __VLS_80.slots.default;
    const __VLS_81 = {}.VCol;
    /** @type {[typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ]} */ ;
    // @ts-ignore
    const __VLS_82 = __VLS_asFunctionalComponent(__VLS_81, new __VLS_81({
        cols: "3",
        sm: "2",
        ...{ class: "d-flex justify-center" },
    }));
    const __VLS_83 = __VLS_82({
        cols: "3",
        sm: "2",
        ...{ class: "d-flex justify-center" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_82));
    __VLS_84.slots.default;
    const __VLS_85 = {}.VAvatar;
    /** @type {[typeof __VLS_components.VAvatar, typeof __VLS_components.vAvatar, typeof __VLS_components.VAvatar, typeof __VLS_components.vAvatar, ]} */ ;
    // @ts-ignore
    const __VLS_86 = __VLS_asFunctionalComponent(__VLS_85, new __VLS_85({
        size: "60",
        rounded: "lg",
        ...{ class: "elevation-4 bg-black-alpha" },
    }));
    const __VLS_87 = __VLS_86({
        size: "60",
        rounded: "lg",
        ...{ class: "elevation-4 bg-black-alpha" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_86));
    __VLS_88.slots.default;
    const __VLS_89 = {}.VImg;
    /** @type {[typeof __VLS_components.VImg, typeof __VLS_components.vImg, typeof __VLS_components.VImg, typeof __VLS_components.vImg, ]} */ ;
    // @ts-ignore
    const __VLS_90 = __VLS_asFunctionalComponent(__VLS_89, new __VLS_89({
        src: (item.image),
    }));
    const __VLS_91 = __VLS_90({
        src: (item.image),
    }, ...__VLS_functionalComponentArgsRest(__VLS_90));
    var __VLS_88;
    var __VLS_84;
    const __VLS_93 = {}.VCol;
    /** @type {[typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ]} */ ;
    // @ts-ignore
    const __VLS_94 = __VLS_asFunctionalComponent(__VLS_93, new __VLS_93({
        cols: "5",
        sm: "6",
    }));
    const __VLS_95 = __VLS_94({
        cols: "5",
        sm: "6",
    }, ...__VLS_functionalComponentArgsRest(__VLS_94));
    __VLS_96.slots.default;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "text-subtitle-1 font-weight-bold text-truncate text-white" },
    });
    (item.user_name);
    var __VLS_96;
    if (!item.accepted) {
        const __VLS_97 = {}.VCol;
        /** @type {[typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ]} */ ;
        // @ts-ignore
        const __VLS_98 = __VLS_asFunctionalComponent(__VLS_97, new __VLS_97({
            cols: "4",
            ...{ class: "d-flex justify-end pr-2" },
        }));
        const __VLS_99 = __VLS_98({
            cols: "4",
            ...{ class: "d-flex justify-end pr-2" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_98));
        __VLS_100.slots.default;
        const __VLS_101 = {}.VBtn;
        /** @type {[typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ]} */ ;
        // @ts-ignore
        const __VLS_102 = __VLS_asFunctionalComponent(__VLS_101, new __VLS_101({
            ...{ 'onClick': {} },
            icon: "mdi-check",
            color: "green",
            size: "x-small",
            ...{ class: "mr-1" },
        }));
        const __VLS_103 = __VLS_102({
            ...{ 'onClick': {} },
            icon: "mdi-check",
            color: "green",
            size: "x-small",
            ...{ class: "mr-1" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_102));
        let __VLS_105;
        let __VLS_106;
        let __VLS_107;
        const __VLS_108 = {
            onClick: (...[$event]) => {
                if (!(!item.accepted))
                    return;
                __VLS_ctx.acceptFriend(item);
            }
        };
        var __VLS_104;
        const __VLS_109 = {}.VBtn;
        /** @type {[typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ]} */ ;
        // @ts-ignore
        const __VLS_110 = __VLS_asFunctionalComponent(__VLS_109, new __VLS_109({
            ...{ 'onClick': {} },
            icon: "mdi-close",
            color: "red",
            size: "x-small",
        }));
        const __VLS_111 = __VLS_110({
            ...{ 'onClick': {} },
            icon: "mdi-close",
            color: "red",
            size: "x-small",
        }, ...__VLS_functionalComponentArgsRest(__VLS_110));
        let __VLS_113;
        let __VLS_114;
        let __VLS_115;
        const __VLS_116 = {
            onClick: (...[$event]) => {
                if (!(!item.accepted))
                    return;
                __VLS_ctx.declineFriend(item.friends_pk);
            }
        };
        var __VLS_112;
        var __VLS_100;
    }
    var __VLS_80;
    var __VLS_72;
}
var __VLS_68;
if (__VLS_ctx.filteredFriendsList.length === 0) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "d-flex justify-center align-center h-100 opacity-50" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({});
}
var __VLS_44;
var __VLS_40;
const __VLS_117 = {}.VWindowItem;
/** @type {[typeof __VLS_components.VWindowItem, typeof __VLS_components.vWindowItem, typeof __VLS_components.VWindowItem, typeof __VLS_components.vWindowItem, ]} */ ;
// @ts-ignore
const __VLS_118 = __VLS_asFunctionalComponent(__VLS_117, new __VLS_117({
    value: "search",
}));
const __VLS_119 = __VLS_118({
    value: "search",
}, ...__VLS_functionalComponentArgsRest(__VLS_118));
__VLS_120.slots.default;
const __VLS_121 = {}.VCard;
/** @type {[typeof __VLS_components.VCard, typeof __VLS_components.vCard, typeof __VLS_components.VCard, typeof __VLS_components.vCard, ]} */ ;
// @ts-ignore
const __VLS_122 = __VLS_asFunctionalComponent(__VLS_121, new __VLS_121({
    color: "primary",
    rounded: "lg",
    elevation: "6",
    ...{ class: "pa-4 fixed-main-card" },
}));
const __VLS_123 = __VLS_122({
    color: "primary",
    rounded: "lg",
    elevation: "6",
    ...{ class: "pa-4 fixed-main-card" },
}, ...__VLS_functionalComponentArgsRest(__VLS_122));
__VLS_124.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "tabs-placeholder mb-4" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "search-bar-center mb-4" },
});
const __VLS_125 = {}.VTextField;
/** @type {[typeof __VLS_components.VTextField, typeof __VLS_components.vTextField, typeof __VLS_components.VTextField, typeof __VLS_components.vTextField, ]} */ ;
// @ts-ignore
const __VLS_126 = __VLS_asFunctionalComponent(__VLS_125, new __VLS_125({
    ...{ 'onInput': {} },
    modelValue: (__VLS_ctx.globalSearchQuery),
    placeholder: "Search players...",
    variant: "solo-filled",
    appendInnerIcon: "mdi-magnify",
    hideDetails: true,
    density: "compact",
    ...{ class: "max-width-search" },
}));
const __VLS_127 = __VLS_126({
    ...{ 'onInput': {} },
    modelValue: (__VLS_ctx.globalSearchQuery),
    placeholder: "Search players...",
    variant: "solo-filled",
    appendInnerIcon: "mdi-magnify",
    hideDetails: true,
    density: "compact",
    ...{ class: "max-width-search" },
}, ...__VLS_functionalComponentArgsRest(__VLS_126));
let __VLS_129;
let __VLS_130;
let __VLS_131;
const __VLS_132 = {
    onInput: (__VLS_ctx.fetchUsers)
};
var __VLS_128;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "scroll-area" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "results-wrapper" },
});
for (const [user] of __VLS_getVForSourceType((__VLS_ctx.filteredGlobalUsers))) {
    const __VLS_133 = {}.VCard;
    /** @type {[typeof __VLS_components.VCard, typeof __VLS_components.vCard, typeof __VLS_components.VCard, typeof __VLS_components.vCard, ]} */ ;
    // @ts-ignore
    const __VLS_134 = __VLS_asFunctionalComponent(__VLS_133, new __VLS_133({
        ...{ 'onClick': {} },
        key: (user.users_pk),
        ...{ class: "pa-1 mb-3 cursor-pointer position-relative" },
        rounded: "lg",
        elevation: "10",
    }));
    const __VLS_135 = __VLS_134({
        ...{ 'onClick': {} },
        key: (user.users_pk),
        ...{ class: "pa-1 mb-3 cursor-pointer position-relative" },
        rounded: "lg",
        elevation: "10",
    }, ...__VLS_functionalComponentArgsRest(__VLS_134));
    let __VLS_137;
    let __VLS_138;
    let __VLS_139;
    const __VLS_140 = {
        onClick: (...[$event]) => {
            __VLS_ctx.navigateToUser(user.users_pk);
        }
    };
    __VLS_136.slots.default;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "background-overlay" },
        ...{ style: (__VLS_ctx.getBackgroundStyle(user.background_hash)) },
    });
    const __VLS_141 = {}.VRow;
    /** @type {[typeof __VLS_components.VRow, typeof __VLS_components.vRow, typeof __VLS_components.VRow, typeof __VLS_components.vRow, ]} */ ;
    // @ts-ignore
    const __VLS_142 = __VLS_asFunctionalComponent(__VLS_141, new __VLS_141({
        align: "center",
        ...{ class: "ma-0 fill-height position-relative" },
        ...{ style: {} },
    }));
    const __VLS_143 = __VLS_142({
        align: "center",
        ...{ class: "ma-0 fill-height position-relative" },
        ...{ style: {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_142));
    __VLS_144.slots.default;
    const __VLS_145 = {}.VCol;
    /** @type {[typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ]} */ ;
    // @ts-ignore
    const __VLS_146 = __VLS_asFunctionalComponent(__VLS_145, new __VLS_145({
        cols: "3",
        sm: "2",
        ...{ class: "d-flex justify-center pl-4" },
    }));
    const __VLS_147 = __VLS_146({
        cols: "3",
        sm: "2",
        ...{ class: "d-flex justify-center pl-4" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_146));
    __VLS_148.slots.default;
    const __VLS_149 = {}.VAvatar;
    /** @type {[typeof __VLS_components.VAvatar, typeof __VLS_components.vAvatar, typeof __VLS_components.VAvatar, typeof __VLS_components.vAvatar, ]} */ ;
    // @ts-ignore
    const __VLS_150 = __VLS_asFunctionalComponent(__VLS_149, new __VLS_149({
        size: "60",
        rounded: "lg",
        ...{ class: "elevation-4 bg-black-alpha" },
    }));
    const __VLS_151 = __VLS_150({
        size: "60",
        rounded: "lg",
        ...{ class: "elevation-4 bg-black-alpha" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_150));
    __VLS_152.slots.default;
    const __VLS_153 = {}.VImg;
    /** @type {[typeof __VLS_components.VImg, typeof __VLS_components.vImg, typeof __VLS_components.VImg, typeof __VLS_components.vImg, ]} */ ;
    // @ts-ignore
    const __VLS_154 = __VLS_asFunctionalComponent(__VLS_153, new __VLS_153({
        src: (user.picture_hash),
    }));
    const __VLS_155 = __VLS_154({
        src: (user.picture_hash),
    }, ...__VLS_functionalComponentArgsRest(__VLS_154));
    var __VLS_152;
    var __VLS_148;
    const __VLS_157 = {}.VCol;
    /** @type {[typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ]} */ ;
    // @ts-ignore
    const __VLS_158 = __VLS_asFunctionalComponent(__VLS_157, new __VLS_157({
        cols: "9",
    }));
    const __VLS_159 = __VLS_158({
        cols: "9",
    }, ...__VLS_functionalComponentArgsRest(__VLS_158));
    __VLS_160.slots.default;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "text-subtitle-1 font-weight-bold text-white" },
    });
    (user.user_name);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "text-caption text-grey-lighten-1" },
    });
    (user.join_date);
    var __VLS_160;
    var __VLS_144;
    var __VLS_136;
}
if (__VLS_ctx.globalSearchQuery && __VLS_ctx.filteredGlobalUsers.length === 0) {
    const __VLS_161 = {}.VAlert;
    /** @type {[typeof __VLS_components.VAlert, typeof __VLS_components.vAlert, typeof __VLS_components.VAlert, typeof __VLS_components.vAlert, ]} */ ;
    // @ts-ignore
    const __VLS_162 = __VLS_asFunctionalComponent(__VLS_161, new __VLS_161({
        type: "info",
        variant: "tonal",
    }));
    const __VLS_163 = __VLS_162({
        type: "info",
        variant: "tonal",
    }, ...__VLS_functionalComponentArgsRest(__VLS_162));
    __VLS_164.slots.default;
    var __VLS_164;
}
var __VLS_124;
var __VLS_120;
var __VLS_36;
var __VLS_8;
var __VLS_3;
/** @type {__VLS_StyleScopedClasses['pa-4']} */ ;
/** @type {__VLS_StyleScopedClasses['pt-0']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-0']} */ ;
/** @type {__VLS_StyleScopedClasses['social-wrapper']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-6']} */ ;
/** @type {__VLS_StyleScopedClasses['elevation-4']} */ ;
/** @type {__VLS_StyleScopedClasses['overflow-visible']} */ ;
/** @type {__VLS_StyleScopedClasses['pa-4']} */ ;
/** @type {__VLS_StyleScopedClasses['fixed-main-card']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['overflow-visible-tabs']} */ ;
/** @type {__VLS_StyleScopedClasses['text-h6']} */ ;
/** @type {__VLS_StyleScopedClasses['text-h6']} */ ;
/** @type {__VLS_StyleScopedClasses['search-bar-center']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['max-width-search']} */ ;
/** @type {__VLS_StyleScopedClasses['scroll-area']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['pa-1']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-3']} */ ;
/** @type {__VLS_StyleScopedClasses['cursor-pointer']} */ ;
/** @type {__VLS_StyleScopedClasses['position-relative']} */ ;
/** @type {__VLS_StyleScopedClasses['background-overlay']} */ ;
/** @type {__VLS_StyleScopedClasses['ma-0']} */ ;
/** @type {__VLS_StyleScopedClasses['fill-height']} */ ;
/** @type {__VLS_StyleScopedClasses['position-relative']} */ ;
/** @type {__VLS_StyleScopedClasses['d-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['elevation-4']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-black-alpha']} */ ;
/** @type {__VLS_StyleScopedClasses['text-subtitle-1']} */ ;
/** @type {__VLS_StyleScopedClasses['font-weight-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-truncate']} */ ;
/** @type {__VLS_StyleScopedClasses['text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['d-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-end']} */ ;
/** @type {__VLS_StyleScopedClasses['pr-2']} */ ;
/** @type {__VLS_StyleScopedClasses['mr-1']} */ ;
/** @type {__VLS_StyleScopedClasses['d-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['align-center']} */ ;
/** @type {__VLS_StyleScopedClasses['h-100']} */ ;
/** @type {__VLS_StyleScopedClasses['opacity-50']} */ ;
/** @type {__VLS_StyleScopedClasses['pa-4']} */ ;
/** @type {__VLS_StyleScopedClasses['fixed-main-card']} */ ;
/** @type {__VLS_StyleScopedClasses['tabs-placeholder']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['search-bar-center']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['max-width-search']} */ ;
/** @type {__VLS_StyleScopedClasses['scroll-area']} */ ;
/** @type {__VLS_StyleScopedClasses['results-wrapper']} */ ;
/** @type {__VLS_StyleScopedClasses['pa-1']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-3']} */ ;
/** @type {__VLS_StyleScopedClasses['cursor-pointer']} */ ;
/** @type {__VLS_StyleScopedClasses['position-relative']} */ ;
/** @type {__VLS_StyleScopedClasses['background-overlay']} */ ;
/** @type {__VLS_StyleScopedClasses['ma-0']} */ ;
/** @type {__VLS_StyleScopedClasses['fill-height']} */ ;
/** @type {__VLS_StyleScopedClasses['position-relative']} */ ;
/** @type {__VLS_StyleScopedClasses['d-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['pl-4']} */ ;
/** @type {__VLS_StyleScopedClasses['elevation-4']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-black-alpha']} */ ;
/** @type {__VLS_StyleScopedClasses['text-subtitle-1']} */ ;
/** @type {__VLS_StyleScopedClasses['font-weight-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['text-caption']} */ ;
/** @type {__VLS_StyleScopedClasses['text-grey-lighten-1']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            mainTab: mainTab,
            activeTab: activeTab,
            requests: requests,
            friendSearchQuery: friendSearchQuery,
            globalSearchQuery: globalSearchQuery,
            filteredFriendsList: filteredFriendsList,
            filteredGlobalUsers: filteredGlobalUsers,
            getBackgroundStyle: getBackgroundStyle,
            navigateToUser: navigateToUser,
            fetchUsers: fetchUsers,
            acceptFriend: acceptFriend,
            declineFriend: declineFriend,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
