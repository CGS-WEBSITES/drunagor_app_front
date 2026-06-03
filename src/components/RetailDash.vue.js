/// <reference types="../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import { ref, computed, inject, onBeforeMount } from "vue";
import { useDisplay } from "vuetify";
import { useUserStore } from "@/store/UserStore";
import { useRouter } from "vue-router";
import { CampaignStore } from "@/store/CampaignStore";
import { HeroDataRepository, } from "@/data/repository/HeroDataRepository";
import { HeroStore } from "@/store/HeroStore";
import { HeroEquipment } from "@/store/Hero";
import axios from "axios";
import RetailerDashboardEvents from "@/components/RetailerDashboardEvents.vue";
const router = useRouter();
const userStore = useUserStore();
const user = userStore.user;
const campaignStore = CampaignStore();
const heroStore = HeroStore();
const assets = inject("assets");
const heroDataRepository = new HeroDataRepository();
const display = useDisplay();
const loading = ref(true);
const loadingErrors = ref([]);
const containerMaxWidth = computed(() => {
    if (display.lgAndUp.value)
        return "1024px";
    if (display.md.value)
        return "900px";
    if (display.sm.value)
        return "768px";
    return "100%";
});
const goToProfile = () => router.push({ name: "PerfilHome" });
const goToFAQ = () => router.push({ name: "FAQ" });
const goToEvents = () => router.push({ name: "Events" });
const goToStores = () => router.push({ name: "stores" });
function getBoxName(boxId) {
    switch (boxId) {
        case 22:
            return "Corebox";
        case 23:
            return "Apocalypse";
        case 34:
            return "Awakenings";
        case 38:
            return "Underkeep Drunagor Nights";
        case 39:
            return "Underkeep Drunagor Nights Season 2";
        default:
            return `Unknown Box (ID: ${boxId})`;
    }
}
function addLoadingError(message) {
    const newError = { id: Date.now(), text: message, visible: true };
    loadingErrors.value.push(newError);
    setTimeout(() => {
        removeErrorById(newError.id);
    }, 10000);
}
function removeErrorById(id) {
    loadingErrors.value = loadingErrors.value.filter((e) => e.id !== id);
}
function importCampaign(token) {
    let data;
    try {
        data = JSON.parse(atob(token));
    }
    catch (error) {
        throw new Error("Invalid data format (not a valid Base64 or JSON string).");
    }
    if (!("campaignData" in data) || !("heroes" in data)) {
        throw new Error("Incomplete campaign data structure.");
    }
    const campaign = data.campaignData;
    campaignStore.add(campaign);
    const heroes = data.heroes;
    heroes.forEach((h) => {
        h.campaignId = campaign.campaignId;
        if (typeof h.equipment === "undefined") {
            h.equipment = new HeroEquipment();
        }
        if (typeof h.sequentialAdventureState === "undefined") {
            h.sequentialAdventureState = null;
        }
        heroStore.add(h);
    });
}
onBeforeMount(async () => {
    campaignStore.reset();
    heroStore.reset();
    loadingErrors.value = [];
    loading.value = true;
    if (!userStore.user?.users_pk) {
        userStore.restoreFromStorage();
    }
    if (!userStore.user?.users_pk) {
        loading.value = false;
        return;
    }
    try {
        const res = await axios.get("/rl_campaigns_users/search", {
            params: { users_fk: userStore.user.users_pk },
        });
        res.data.campaigns.forEach((element) => {
            try {
                importCampaign(element.tracker_hash);
            }
            catch (e) {
                console.error(`Failed to import campaign ID: ${element.campaigns_pk}`, e);
            }
        });
    }
    catch (apiError) {
        console.error("Failed to fetch campaigns from API", apiError);
    }
    finally {
        loading.value = false;
    }
});
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
// CSS variable injection 
// CSS variable injection end 
const __VLS_0 = {}.VMain;
/** @type {[typeof __VLS_components.VMain, typeof __VLS_components.vMain, typeof __VLS_components.VMain, typeof __VLS_components.vMain, ]} */ ;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
    ...{ style: {} },
}));
const __VLS_2 = __VLS_1({
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
var __VLS_4 = {};
__VLS_3.slots.default;
const __VLS_5 = {}.VRow;
/** @type {[typeof __VLS_components.VRow, typeof __VLS_components.vRow, typeof __VLS_components.VRow, typeof __VLS_components.vRow, ]} */ ;
// @ts-ignore
const __VLS_6 = __VLS_asFunctionalComponent(__VLS_5, new __VLS_5({
    noGutters: true,
    ...{ class: "justify-center align-center ml-0 flex-grow-0 flex-shrink-0 pt-md-0" },
}));
const __VLS_7 = __VLS_6({
    noGutters: true,
    ...{ class: "justify-center align-center ml-0 flex-grow-0 flex-shrink-0 pt-md-0" },
}, ...__VLS_functionalComponentArgsRest(__VLS_6));
__VLS_8.slots.default;
const __VLS_9 = {}.VCard;
/** @type {[typeof __VLS_components.VCard, typeof __VLS_components.vCard, typeof __VLS_components.VCard, typeof __VLS_components.vCard, ]} */ ;
// @ts-ignore
const __VLS_10 = __VLS_asFunctionalComponent(__VLS_9, new __VLS_9({
    color: "background",
    ...{ class: "card-overlay full-screen-card" },
    image: (__VLS_ctx.user.background_hash
        ? __VLS_ctx.assets + '/Profile/' + __VLS_ctx.user.background_hash
        : __VLS_ctx.assets + '/Profile/profile-bg-warriors-transparent.png'),
    flat: true,
}));
const __VLS_11 = __VLS_10({
    color: "background",
    ...{ class: "card-overlay full-screen-card" },
    image: (__VLS_ctx.user.background_hash
        ? __VLS_ctx.assets + '/Profile/' + __VLS_ctx.user.background_hash
        : __VLS_ctx.assets + '/Profile/profile-bg-warriors-transparent.png'),
    flat: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_10));
__VLS_12.slots.default;
const __VLS_13 = {}.VCard;
/** @type {[typeof __VLS_components.VCard, typeof __VLS_components.vCard, typeof __VLS_components.VCard, typeof __VLS_components.vCard, ]} */ ;
// @ts-ignore
const __VLS_14 = __VLS_asFunctionalComponent(__VLS_13, new __VLS_13({
    color: "transparent",
    height: "136",
    ...{ class: "card-overlay1 full-screen-card" },
    flat: true,
}));
const __VLS_15 = __VLS_14({
    color: "transparent",
    height: "136",
    ...{ class: "card-overlay1 full-screen-card" },
    flat: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_14));
var __VLS_12;
const __VLS_17 = {}.VCol;
/** @type {[typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ]} */ ;
// @ts-ignore
const __VLS_18 = __VLS_asFunctionalComponent(__VLS_17, new __VLS_17({
    cols: "12",
    ...{ class: "avatar-mobile" },
}));
const __VLS_19 = __VLS_18({
    cols: "12",
    ...{ class: "avatar-mobile" },
}, ...__VLS_functionalComponentArgsRest(__VLS_18));
__VLS_20.slots.default;
const __VLS_21 = {}.VContainer;
/** @type {[typeof __VLS_components.VContainer, typeof __VLS_components.vContainer, typeof __VLS_components.VContainer, typeof __VLS_components.vContainer, ]} */ ;
// @ts-ignore
const __VLS_22 = __VLS_asFunctionalComponent(__VLS_21, new __VLS_21({
    ...{ class: "mx-auto" },
    ...{ style: ({ maxWidth: __VLS_ctx.containerMaxWidth }) },
}));
const __VLS_23 = __VLS_22({
    ...{ class: "mx-auto" },
    ...{ style: ({ maxWidth: __VLS_ctx.containerMaxWidth }) },
}, ...__VLS_functionalComponentArgsRest(__VLS_22));
__VLS_24.slots.default;
const __VLS_25 = {}.VRow;
/** @type {[typeof __VLS_components.VRow, typeof __VLS_components.vRow, typeof __VLS_components.VRow, typeof __VLS_components.vRow, ]} */ ;
// @ts-ignore
const __VLS_26 = __VLS_asFunctionalComponent(__VLS_25, new __VLS_25({
    noGutters: true,
    align: "end",
    ...{ class: "pa-4 flex-nowrap" },
}));
const __VLS_27 = __VLS_26({
    noGutters: true,
    align: "end",
    ...{ class: "pa-4 flex-nowrap" },
}, ...__VLS_functionalComponentArgsRest(__VLS_26));
__VLS_28.slots.default;
const __VLS_29 = {}.VCol;
/** @type {[typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ]} */ ;
// @ts-ignore
const __VLS_30 = __VLS_asFunctionalComponent(__VLS_29, new __VLS_29({
    cols: "auto",
}));
const __VLS_31 = __VLS_30({
    cols: "auto",
}, ...__VLS_functionalComponentArgsRest(__VLS_30));
__VLS_32.slots.default;
const __VLS_33 = {}.VAvatar;
/** @type {[typeof __VLS_components.VAvatar, typeof __VLS_components.vAvatar, typeof __VLS_components.VAvatar, typeof __VLS_components.vAvatar, ]} */ ;
// @ts-ignore
const __VLS_34 = __VLS_asFunctionalComponent(__VLS_33, new __VLS_33({
    ...{ 'onClick': {} },
    size: "100",
    rounded: "lg",
    ...{ style: {} },
}));
const __VLS_35 = __VLS_34({
    ...{ 'onClick': {} },
    size: "100",
    rounded: "lg",
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_34));
let __VLS_37;
let __VLS_38;
let __VLS_39;
const __VLS_40 = {
    onClick: (__VLS_ctx.goToProfile)
};
__VLS_36.slots.default;
const __VLS_41 = {}.VImg;
/** @type {[typeof __VLS_components.VImg, typeof __VLS_components.vImg, ]} */ ;
// @ts-ignore
const __VLS_42 = __VLS_asFunctionalComponent(__VLS_41, new __VLS_41({
    src: (__VLS_ctx.user.picture_hash
        ? __VLS_ctx.assets + '/Profile/' + __VLS_ctx.user.picture_hash
        : __VLS_ctx.assets + '/Profile/user.png'),
    alt: "Profile",
}));
const __VLS_43 = __VLS_42({
    src: (__VLS_ctx.user.picture_hash
        ? __VLS_ctx.assets + '/Profile/' + __VLS_ctx.user.picture_hash
        : __VLS_ctx.assets + '/Profile/user.png'),
    alt: "Profile",
}, ...__VLS_functionalComponentArgsRest(__VLS_42));
var __VLS_36;
var __VLS_32;
const __VLS_45 = {}.VCol;
/** @type {[typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ]} */ ;
// @ts-ignore
const __VLS_46 = __VLS_asFunctionalComponent(__VLS_45, new __VLS_45({
    ...{ class: "ml-n4" },
    ...{ style: {} },
}));
const __VLS_47 = __VLS_46({
    ...{ class: "ml-n4" },
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_46));
__VLS_48.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ onClick: (__VLS_ctx.goToProfile) },
    ...{ class: "pa-3 rounded-lg" },
    ...{ style: {} },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.h5, __VLS_intrinsicElements.h5)({
    ...{ class: "text-h6 font-weight-bold text-white text-truncate" },
    ...{ style: {} },
});
(__VLS_ctx.user.user_name);
var __VLS_48;
var __VLS_28;
var __VLS_24;
var __VLS_20;
var __VLS_8;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "flex-grow-1" },
    ...{ style: ({
            marginTop: __VLS_ctx.display.xs ? '-130px' : '-120px',
            overflowY: 'auto',
            minHeight: '0',
            zIndex: 1,
            width: '100%'
        }) },
});
const __VLS_49 = {}.VContainer;
/** @type {[typeof __VLS_components.VContainer, typeof __VLS_components.vContainer, typeof __VLS_components.VContainer, typeof __VLS_components.vContainer, ]} */ ;
// @ts-ignore
const __VLS_50 = __VLS_asFunctionalComponent(__VLS_49, new __VLS_49({
    ...{ class: "mx-auto px-4 fill-height align-start" },
    ...{ style: ({ maxWidth: __VLS_ctx.containerMaxWidth }) },
}));
const __VLS_51 = __VLS_50({
    ...{ class: "mx-auto px-4 fill-height align-start" },
    ...{ style: ({ maxWidth: __VLS_ctx.containerMaxWidth }) },
}, ...__VLS_functionalComponentArgsRest(__VLS_50));
__VLS_52.slots.default;
/** @type {[typeof RetailerDashboardEvents, ]} */ ;
// @ts-ignore
const __VLS_53 = __VLS_asFunctionalComponent(RetailerDashboardEvents, new RetailerDashboardEvents({
    ...{ style: {} },
}));
const __VLS_54 = __VLS_53({
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_53));
var __VLS_52;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "pa-2 pa-sm-4 flex-grow-0 flex-shrink-0" },
});
const __VLS_56 = {}.VContainer;
/** @type {[typeof __VLS_components.VContainer, typeof __VLS_components.vContainer, typeof __VLS_components.VContainer, typeof __VLS_components.vContainer, ]} */ ;
// @ts-ignore
const __VLS_57 = __VLS_asFunctionalComponent(__VLS_56, new __VLS_56({
    ...{ style: {} },
    ...{ class: "mx-auto" },
    ...{ style: ({ maxWidth: __VLS_ctx.containerMaxWidth }) },
}));
const __VLS_58 = __VLS_57({
    ...{ style: {} },
    ...{ class: "mx-auto" },
    ...{ style: ({ maxWidth: __VLS_ctx.containerMaxWidth }) },
}, ...__VLS_functionalComponentArgsRest(__VLS_57));
__VLS_59.slots.default;
const __VLS_60 = {}.VToolbar;
/** @type {[typeof __VLS_components.VToolbar, typeof __VLS_components.vToolbar, typeof __VLS_components.VToolbar, typeof __VLS_components.vToolbar, ]} */ ;
// @ts-ignore
const __VLS_61 = __VLS_asFunctionalComponent(__VLS_60, new __VLS_60({
    height: (__VLS_ctx.display.xs ? 80 : 96),
    rounded: "lg",
    ...{ class: "px-1 px-sm-2" },
    color: "primary",
}));
const __VLS_62 = __VLS_61({
    height: (__VLS_ctx.display.xs ? 80 : 96),
    rounded: "lg",
    ...{ class: "px-1 px-sm-2" },
    color: "primary",
}, ...__VLS_functionalComponentArgsRest(__VLS_61));
__VLS_63.slots.default;
const __VLS_64 = {}.VRow;
/** @type {[typeof __VLS_components.VRow, typeof __VLS_components.vRow, typeof __VLS_components.VRow, typeof __VLS_components.vRow, ]} */ ;
// @ts-ignore
const __VLS_65 = __VLS_asFunctionalComponent(__VLS_64, new __VLS_64({
    noGutters: true,
    align: "center",
    justify: "space-between",
    ...{ class: "fill-height ma-0 w-100 flex-nowrap" },
}));
const __VLS_66 = __VLS_65({
    noGutters: true,
    align: "center",
    justify: "space-between",
    ...{ class: "fill-height ma-0 w-100 flex-nowrap" },
}, ...__VLS_functionalComponentArgsRest(__VLS_65));
__VLS_67.slots.default;
const __VLS_68 = {}.VCol;
/** @type {[typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ]} */ ;
// @ts-ignore
const __VLS_69 = __VLS_asFunctionalComponent(__VLS_68, new __VLS_68({
    cols: "auto",
    ...{ class: "d-flex justify-center align-center" },
}));
const __VLS_70 = __VLS_69({
    cols: "auto",
    ...{ class: "d-flex justify-center align-center" },
}, ...__VLS_functionalComponentArgsRest(__VLS_69));
__VLS_71.slots.default;
const __VLS_72 = {}.VBtn;
/** @type {[typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ]} */ ;
// @ts-ignore
const __VLS_73 = __VLS_asFunctionalComponent(__VLS_72, new __VLS_72({
    ...{ 'onClick': {} },
    icon: true,
    variant: "text",
    size: (__VLS_ctx.display.xs ? 'large' : 'x-large'),
}));
const __VLS_74 = __VLS_73({
    ...{ 'onClick': {} },
    icon: true,
    variant: "text",
    size: (__VLS_ctx.display.xs ? 'large' : 'x-large'),
}, ...__VLS_functionalComponentArgsRest(__VLS_73));
let __VLS_76;
let __VLS_77;
let __VLS_78;
const __VLS_79 = {
    onClick: (__VLS_ctx.goToFAQ)
};
__VLS_75.slots.default;
const __VLS_80 = {}.VIcon;
/** @type {[typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, ]} */ ;
// @ts-ignore
const __VLS_81 = __VLS_asFunctionalComponent(__VLS_80, new __VLS_80({}));
const __VLS_82 = __VLS_81({}, ...__VLS_functionalComponentArgsRest(__VLS_81));
__VLS_83.slots.default;
var __VLS_83;
var __VLS_75;
var __VLS_71;
const __VLS_84 = {}.VCol;
/** @type {[typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ]} */ ;
// @ts-ignore
const __VLS_85 = __VLS_asFunctionalComponent(__VLS_84, new __VLS_84({
    ...{ class: "px-2 d-flex justify-center align-center" },
}));
const __VLS_86 = __VLS_85({
    ...{ class: "px-2 d-flex justify-center align-center" },
}, ...__VLS_functionalComponentArgsRest(__VLS_85));
__VLS_87.slots.default;
const __VLS_88 = {}.VBtn;
/** @type {[typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ]} */ ;
// @ts-ignore
const __VLS_89 = __VLS_asFunctionalComponent(__VLS_88, new __VLS_88({
    ...{ 'onClick': {} },
    color: "#118D8E",
    variant: "flat",
    size: (__VLS_ctx.display.xs ? 'large' : 'x-large'),
    rounded: "lg",
    ...{ class: "font-weight-bold w-100" },
    ...{ style: {} },
}));
const __VLS_90 = __VLS_89({
    ...{ 'onClick': {} },
    color: "#118D8E",
    variant: "flat",
    size: (__VLS_ctx.display.xs ? 'large' : 'x-large'),
    rounded: "lg",
    ...{ class: "font-weight-bold w-100" },
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_89));
let __VLS_92;
let __VLS_93;
let __VLS_94;
const __VLS_95 = {
    onClick: (__VLS_ctx.goToEvents)
};
__VLS_91.slots.default;
const __VLS_96 = {}.VIcon;
/** @type {[typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, ]} */ ;
// @ts-ignore
const __VLS_97 = __VLS_asFunctionalComponent(__VLS_96, new __VLS_96({
    left: true,
    ...{ class: "mr-1" },
}));
const __VLS_98 = __VLS_97({
    left: true,
    ...{ class: "mr-1" },
}, ...__VLS_functionalComponentArgsRest(__VLS_97));
__VLS_99.slots.default;
var __VLS_99;
var __VLS_91;
var __VLS_87;
const __VLS_100 = {}.VCol;
/** @type {[typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ]} */ ;
// @ts-ignore
const __VLS_101 = __VLS_asFunctionalComponent(__VLS_100, new __VLS_100({
    cols: "auto",
    ...{ class: "d-flex justify-center align-center" },
}));
const __VLS_102 = __VLS_101({
    cols: "auto",
    ...{ class: "d-flex justify-center align-center" },
}, ...__VLS_functionalComponentArgsRest(__VLS_101));
__VLS_103.slots.default;
const __VLS_104 = {}.VBtn;
/** @type {[typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ]} */ ;
// @ts-ignore
const __VLS_105 = __VLS_asFunctionalComponent(__VLS_104, new __VLS_104({
    ...{ 'onClick': {} },
    icon: true,
    variant: "text",
    size: (__VLS_ctx.display.xs ? 'large' : 'x-large'),
}));
const __VLS_106 = __VLS_105({
    ...{ 'onClick': {} },
    icon: true,
    variant: "text",
    size: (__VLS_ctx.display.xs ? 'large' : 'x-large'),
}, ...__VLS_functionalComponentArgsRest(__VLS_105));
let __VLS_108;
let __VLS_109;
let __VLS_110;
const __VLS_111 = {
    onClick: (__VLS_ctx.goToStores)
};
__VLS_107.slots.default;
const __VLS_112 = {}.VIcon;
/** @type {[typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, ]} */ ;
// @ts-ignore
const __VLS_113 = __VLS_asFunctionalComponent(__VLS_112, new __VLS_112({}));
const __VLS_114 = __VLS_113({}, ...__VLS_functionalComponentArgsRest(__VLS_113));
__VLS_115.slots.default;
var __VLS_115;
var __VLS_107;
var __VLS_103;
var __VLS_67;
var __VLS_63;
var __VLS_59;
var __VLS_3;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['align-center']} */ ;
/** @type {__VLS_StyleScopedClasses['ml-0']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-grow-0']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-shrink-0']} */ ;
/** @type {__VLS_StyleScopedClasses['pt-md-0']} */ ;
/** @type {__VLS_StyleScopedClasses['card-overlay']} */ ;
/** @type {__VLS_StyleScopedClasses['full-screen-card']} */ ;
/** @type {__VLS_StyleScopedClasses['card-overlay1']} */ ;
/** @type {__VLS_StyleScopedClasses['full-screen-card']} */ ;
/** @type {__VLS_StyleScopedClasses['avatar-mobile']} */ ;
/** @type {__VLS_StyleScopedClasses['mx-auto']} */ ;
/** @type {__VLS_StyleScopedClasses['pa-4']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-nowrap']} */ ;
/** @type {__VLS_StyleScopedClasses['ml-n4']} */ ;
/** @type {__VLS_StyleScopedClasses['pa-3']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['text-h6']} */ ;
/** @type {__VLS_StyleScopedClasses['font-weight-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['text-truncate']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-grow-1']} */ ;
/** @type {__VLS_StyleScopedClasses['mx-auto']} */ ;
/** @type {__VLS_StyleScopedClasses['px-4']} */ ;
/** @type {__VLS_StyleScopedClasses['fill-height']} */ ;
/** @type {__VLS_StyleScopedClasses['align-start']} */ ;
/** @type {__VLS_StyleScopedClasses['pa-2']} */ ;
/** @type {__VLS_StyleScopedClasses['pa-sm-4']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-grow-0']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-shrink-0']} */ ;
/** @type {__VLS_StyleScopedClasses['mx-auto']} */ ;
/** @type {__VLS_StyleScopedClasses['px-1']} */ ;
/** @type {__VLS_StyleScopedClasses['px-sm-2']} */ ;
/** @type {__VLS_StyleScopedClasses['fill-height']} */ ;
/** @type {__VLS_StyleScopedClasses['ma-0']} */ ;
/** @type {__VLS_StyleScopedClasses['w-100']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-nowrap']} */ ;
/** @type {__VLS_StyleScopedClasses['d-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['align-center']} */ ;
/** @type {__VLS_StyleScopedClasses['px-2']} */ ;
/** @type {__VLS_StyleScopedClasses['d-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['align-center']} */ ;
/** @type {__VLS_StyleScopedClasses['font-weight-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['w-100']} */ ;
/** @type {__VLS_StyleScopedClasses['mr-1']} */ ;
/** @type {__VLS_StyleScopedClasses['d-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['align-center']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            RetailerDashboardEvents: RetailerDashboardEvents,
            user: user,
            assets: assets,
            display: display,
            containerMaxWidth: containerMaxWidth,
            goToProfile: goToProfile,
            goToFAQ: goToFAQ,
            goToEvents: goToEvents,
            goToStores: goToStores,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
