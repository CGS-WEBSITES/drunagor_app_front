/// <reference types="../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import { ref, computed, inject, onBeforeMount } from "vue";
import { useDisplay, useTheme } from "vuetify";
import { useUserStore } from "@/store/UserStore";
import { useRouter } from "vue-router";
import { CampaignStore } from "@/store/CampaignStore";
import { HeroDataRepository } from "@/data/repository/HeroDataRepository";
import { HeroStore } from "@/store/HeroStore";
import axios from "axios";
import DashboardEvents from "@/components/DashboardEvents.vue";
import HUB from "@/components/HUB.vue";
import CoreLogo from "@/assets/campaign/logo/core.webp";
import ApocalypseLogo from "@/assets/campaign/logo/apocalypse.webp";
import AwakeningsLogo from "@/assets/campaign/logo/awakenings.webp";
import Underkeep2Banner from "@/assets/underkeep2.png";
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
const showHub = ref(false);
const myEvents = ref([]);
const showPlaySelectionDialog = ref(false);
const showDrunagorSoonDialog = ref(false);
const themeInstance = useTheme();
const playButtonColor = computed(() => {
    const tName = themeInstance.global.name.value;
    switch (tName) {
        case "CoreTheme":
            return "#E2B13C";
        case "ApocTheme":
            return "#FB8C00";
        case "NightsTheme":
            return "#A3E635";
        case "EarthTheme":
            return "#10B981";
        case "BlueTheme":
            return "#F59E0B";
        case "CrimsonTheme":
            return "#FACC15";
        case "VioletTheme":
            return "#4ADE80";
        case "RoseTheme":
            return "#2DD4BF";
        case "DarkTheme":
        default:
            return "#118D8E";
    }
});
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
const goToLibrary = () => router.push({ name: "Library" });
const goToCampaigns = () => router.push({ name: "HeroesManager" });
const goToEvents = () => router.push({ name: "Events" });
const goToGroup = () => router.push({ name: "SocialHub" });
function importCampaign(token) { }
const openHub = async () => {
    showHub.value = true;
    if (user && user.users_pk) {
        try {
            const response = await axios.get('/events/my_events/player', {
                params: { player_fk: user.users_pk, past_events: false },
                headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
            });
            const now = new Date();
            myEvents.value = (response.data.events || [])
                .filter((e) => new Date(e.event_date) > now)
                .sort((a, b) => new Date(a.event_date).getTime() - new Date(b.event_date).getTime());
        }
        catch (e) {
            console.error("Error fetching events for HUB:", e);
            myEvents.value = [];
        }
    }
};
const openPlaySelection = () => {
    showPlaySelectionDialog.value = true;
};
const playDrunagorNights = () => {
    showPlaySelectionDialog.value = false;
    openHub();
};
const playLegacyCampaigns = () => {
    showPlaySelectionDialog.value = false;
    router.push({ path: "/campaign-tracker/" });
};
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
            catch (e) { }
        });
    }
    catch (apiError) {
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
/** @type {[typeof DashboardEvents, ]} */ ;
// @ts-ignore
const __VLS_53 = __VLS_asFunctionalComponent(DashboardEvents, new DashboardEvents({
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
    onClick: (__VLS_ctx.goToCampaigns)
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
    color: "playbutton",
    variant: "flat",
    size: (__VLS_ctx.display.xs ? 'large' : 'x-large'),
    rounded: "lg",
    ...{ class: "font-weight-bold w-100" },
    ...{ style: {} },
}));
const __VLS_90 = __VLS_89({
    ...{ 'onClick': {} },
    color: "playbutton",
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
    onClick: (__VLS_ctx.openPlaySelection)
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
    onClick: (__VLS_ctx.goToGroup)
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
/** @type {[typeof HUB, ]} */ ;
// @ts-ignore
const __VLS_116 = __VLS_asFunctionalComponent(HUB, new HUB({
    modelValue: (__VLS_ctx.showHub),
    myEvents: (__VLS_ctx.myEvents),
    user: (__VLS_ctx.user),
}));
const __VLS_117 = __VLS_116({
    modelValue: (__VLS_ctx.showHub),
    myEvents: (__VLS_ctx.myEvents),
    user: (__VLS_ctx.user),
}, ...__VLS_functionalComponentArgsRest(__VLS_116));
const __VLS_119 = {}.VDialog;
/** @type {[typeof __VLS_components.VDialog, typeof __VLS_components.vDialog, typeof __VLS_components.VDialog, typeof __VLS_components.vDialog, ]} */ ;
// @ts-ignore
const __VLS_120 = __VLS_asFunctionalComponent(__VLS_119, new __VLS_119({
    modelValue: (__VLS_ctx.showPlaySelectionDialog),
    maxWidth: "500",
    scrollable: true,
}));
const __VLS_121 = __VLS_120({
    modelValue: (__VLS_ctx.showPlaySelectionDialog),
    maxWidth: "500",
    scrollable: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_120));
__VLS_122.slots.default;
const __VLS_123 = {}.VCard;
/** @type {[typeof __VLS_components.VCard, typeof __VLS_components.vCard, typeof __VLS_components.VCard, typeof __VLS_components.vCard, ]} */ ;
// @ts-ignore
const __VLS_124 = __VLS_asFunctionalComponent(__VLS_123, new __VLS_123({
    color: "grey-darken-4",
    rounded: "xl",
    maxHeight: "90vh",
}));
const __VLS_125 = __VLS_124({
    color: "grey-darken-4",
    rounded: "xl",
    maxHeight: "90vh",
}, ...__VLS_functionalComponentArgsRest(__VLS_124));
__VLS_126.slots.default;
const __VLS_127 = {}.VCardTitle;
/** @type {[typeof __VLS_components.VCardTitle, typeof __VLS_components.vCardTitle, typeof __VLS_components.VCardTitle, typeof __VLS_components.vCardTitle, ]} */ ;
// @ts-ignore
const __VLS_128 = __VLS_asFunctionalComponent(__VLS_127, new __VLS_127({
    ...{ class: "d-flex justify-space-between align-center px-4 pt-4 pb-2" },
}));
const __VLS_129 = __VLS_128({
    ...{ class: "d-flex justify-space-between align-center px-4 pt-4 pb-2" },
}, ...__VLS_functionalComponentArgsRest(__VLS_128));
__VLS_130.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "text-h5 font-weight-bold" },
});
const __VLS_131 = {}.VBtn;
/** @type {[typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ]} */ ;
// @ts-ignore
const __VLS_132 = __VLS_asFunctionalComponent(__VLS_131, new __VLS_131({
    ...{ 'onClick': {} },
    icon: true,
    variant: "text",
}));
const __VLS_133 = __VLS_132({
    ...{ 'onClick': {} },
    icon: true,
    variant: "text",
}, ...__VLS_functionalComponentArgsRest(__VLS_132));
let __VLS_135;
let __VLS_136;
let __VLS_137;
const __VLS_138 = {
    onClick: (...[$event]) => {
        __VLS_ctx.showPlaySelectionDialog = false;
    }
};
__VLS_134.slots.default;
const __VLS_139 = {}.VIcon;
/** @type {[typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, ]} */ ;
// @ts-ignore
const __VLS_140 = __VLS_asFunctionalComponent(__VLS_139, new __VLS_139({}));
const __VLS_141 = __VLS_140({}, ...__VLS_functionalComponentArgsRest(__VLS_140));
__VLS_142.slots.default;
var __VLS_142;
var __VLS_134;
var __VLS_130;
const __VLS_143 = {}.VCardText;
/** @type {[typeof __VLS_components.VCardText, typeof __VLS_components.vCardText, typeof __VLS_components.VCardText, typeof __VLS_components.vCardText, ]} */ ;
// @ts-ignore
const __VLS_144 = __VLS_asFunctionalComponent(__VLS_143, new __VLS_143({
    ...{ class: "pa-0" },
    ...{ style: {} },
}));
const __VLS_145 = __VLS_144({
    ...{ class: "pa-0" },
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_144));
__VLS_146.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "pa-5 text-center" },
});
const __VLS_147 = {}.VImg;
/** @type {[typeof __VLS_components.VImg, typeof __VLS_components.vImg, typeof __VLS_components.VImg, typeof __VLS_components.vImg, ]} */ ;
// @ts-ignore
const __VLS_148 = __VLS_asFunctionalComponent(__VLS_147, new __VLS_147({
    src: "@/assets/underkeep.png",
    height: "140",
    cover: true,
    ...{ class: "mb-4 rounded-xl elevation-4" },
}));
const __VLS_149 = __VLS_148({
    src: "@/assets/underkeep.png",
    height: "140",
    cover: true,
    ...{ class: "mb-4 rounded-xl elevation-4" },
}, ...__VLS_functionalComponentArgsRest(__VLS_148));
__VLS_asFunctionalElement(__VLS_intrinsicElements.h3, __VLS_intrinsicElements.h3)({
    ...{ class: "text-h5 font-weight-bold text-green-accent-3 mb-1" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
    ...{ class: "text-body-2 text-grey-lighten-1 mb-5 px-2" },
});
const __VLS_151 = {}.VBtn;
/** @type {[typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ]} */ ;
// @ts-ignore
const __VLS_152 = __VLS_asFunctionalComponent(__VLS_151, new __VLS_151({
    ...{ 'onClick': {} },
    color: "green-accent-3",
    variant: "flat",
    rounded: "pill",
    size: "x-large",
    block: true,
    ...{ class: "font-weight-black text-grey-darken-4" },
}));
const __VLS_153 = __VLS_152({
    ...{ 'onClick': {} },
    color: "green-accent-3",
    variant: "flat",
    rounded: "pill",
    size: "x-large",
    block: true,
    ...{ class: "font-weight-black text-grey-darken-4" },
}, ...__VLS_functionalComponentArgsRest(__VLS_152));
let __VLS_155;
let __VLS_156;
let __VLS_157;
const __VLS_158 = {
    onClick: (__VLS_ctx.playDrunagorNights)
};
__VLS_154.slots.default;
const __VLS_159 = {}.VIcon;
/** @type {[typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, ]} */ ;
// @ts-ignore
const __VLS_160 = __VLS_asFunctionalComponent(__VLS_159, new __VLS_159({
    left: true,
    ...{ class: "mr-2" },
}));
const __VLS_161 = __VLS_160({
    left: true,
    ...{ class: "mr-2" },
}, ...__VLS_functionalComponentArgsRest(__VLS_160));
__VLS_162.slots.default;
var __VLS_162;
var __VLS_154;
const __VLS_163 = {}.VDivider;
/** @type {[typeof __VLS_components.VDivider, typeof __VLS_components.vDivider, typeof __VLS_components.VDivider, typeof __VLS_components.vDivider, ]} */ ;
// @ts-ignore
const __VLS_164 = __VLS_asFunctionalComponent(__VLS_163, new __VLS_163({
    ...{ class: "mx-6 border-opacity-50" },
    color: "grey",
}));
const __VLS_165 = __VLS_164({
    ...{ class: "mx-6 border-opacity-50" },
    color: "grey",
}, ...__VLS_functionalComponentArgsRest(__VLS_164));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "pa-5 text-center" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "legacy-cluster mb-6 mt-2" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "d-flex justify-center align-center ga-6 position-relative z-10" },
});
const __VLS_167 = {}.VImg;
/** @type {[typeof __VLS_components.VImg, typeof __VLS_components.vImg, typeof __VLS_components.VImg, typeof __VLS_components.vImg, ]} */ ;
// @ts-ignore
const __VLS_168 = __VLS_asFunctionalComponent(__VLS_167, new __VLS_167({
    src: (__VLS_ctx.CoreLogo),
    height: "70",
    maxWidth: "110",
    contain: true,
    ...{ class: "legacy-logo" },
}));
const __VLS_169 = __VLS_168({
    src: (__VLS_ctx.CoreLogo),
    height: "70",
    maxWidth: "110",
    contain: true,
    ...{ class: "legacy-logo" },
}, ...__VLS_functionalComponentArgsRest(__VLS_168));
const __VLS_171 = {}.VImg;
/** @type {[typeof __VLS_components.VImg, typeof __VLS_components.vImg, typeof __VLS_components.VImg, typeof __VLS_components.vImg, ]} */ ;
// @ts-ignore
const __VLS_172 = __VLS_asFunctionalComponent(__VLS_171, new __VLS_171({
    src: (__VLS_ctx.AwakeningsLogo),
    height: "70",
    maxWidth: "110",
    contain: true,
    ...{ class: "legacy-logo" },
}));
const __VLS_173 = __VLS_172({
    src: (__VLS_ctx.AwakeningsLogo),
    height: "70",
    maxWidth: "110",
    contain: true,
    ...{ class: "legacy-logo" },
}, ...__VLS_functionalComponentArgsRest(__VLS_172));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "d-flex justify-center align-center mt-n6 position-relative z-20" },
});
const __VLS_175 = {}.VImg;
/** @type {[typeof __VLS_components.VImg, typeof __VLS_components.vImg, typeof __VLS_components.VImg, typeof __VLS_components.vImg, ]} */ ;
// @ts-ignore
const __VLS_176 = __VLS_asFunctionalComponent(__VLS_175, new __VLS_175({
    src: (__VLS_ctx.ApocalypseLogo),
    height: "80",
    maxWidth: "130",
    contain: true,
    ...{ class: "legacy-logo apoc-logo" },
}));
const __VLS_177 = __VLS_176({
    src: (__VLS_ctx.ApocalypseLogo),
    height: "80",
    maxWidth: "130",
    contain: true,
    ...{ class: "legacy-logo apoc-logo" },
}, ...__VLS_functionalComponentArgsRest(__VLS_176));
__VLS_asFunctionalElement(__VLS_intrinsicElements.h3, __VLS_intrinsicElements.h3)({
    ...{ class: "text-h5 font-weight-bold text-amber-accent-2 mb-1" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
    ...{ class: "text-body-2 text-grey-lighten-1 mb-5 px-2" },
});
const __VLS_179 = {}.VBtn;
/** @type {[typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ]} */ ;
// @ts-ignore
const __VLS_180 = __VLS_asFunctionalComponent(__VLS_179, new __VLS_179({
    ...{ 'onClick': {} },
    color: "amber-accent-2",
    variant: "flat",
    rounded: "pill",
    size: "x-large",
    block: true,
    ...{ class: "font-weight-black text-grey-darken-4" },
}));
const __VLS_181 = __VLS_180({
    ...{ 'onClick': {} },
    color: "amber-accent-2",
    variant: "flat",
    rounded: "pill",
    size: "x-large",
    block: true,
    ...{ class: "font-weight-black text-grey-darken-4" },
}, ...__VLS_functionalComponentArgsRest(__VLS_180));
let __VLS_183;
let __VLS_184;
let __VLS_185;
const __VLS_186 = {
    onClick: (__VLS_ctx.playLegacyCampaigns)
};
__VLS_182.slots.default;
const __VLS_187 = {}.VIcon;
/** @type {[typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, ]} */ ;
// @ts-ignore
const __VLS_188 = __VLS_asFunctionalComponent(__VLS_187, new __VLS_187({
    left: true,
    ...{ class: "mr-2" },
}));
const __VLS_189 = __VLS_188({
    left: true,
    ...{ class: "mr-2" },
}, ...__VLS_functionalComponentArgsRest(__VLS_188));
__VLS_190.slots.default;
var __VLS_190;
var __VLS_182;
var __VLS_146;
var __VLS_126;
var __VLS_122;
const __VLS_191 = {}.VDialog;
/** @type {[typeof __VLS_components.VDialog, typeof __VLS_components.vDialog, typeof __VLS_components.VDialog, typeof __VLS_components.vDialog, ]} */ ;
// @ts-ignore
const __VLS_192 = __VLS_asFunctionalComponent(__VLS_191, new __VLS_191({
    modelValue: (__VLS_ctx.showDrunagorSoonDialog),
    maxWidth: "540",
    scrollable: true,
}));
const __VLS_193 = __VLS_192({
    modelValue: (__VLS_ctx.showDrunagorSoonDialog),
    maxWidth: "540",
    scrollable: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_192));
__VLS_194.slots.default;
const __VLS_195 = {}.VCard;
/** @type {[typeof __VLS_components.VCard, typeof __VLS_components.vCard, typeof __VLS_components.VCard, typeof __VLS_components.vCard, ]} */ ;
// @ts-ignore
const __VLS_196 = __VLS_asFunctionalComponent(__VLS_195, new __VLS_195({
    color: "grey-darken-4",
    rounded: "0",
    ...{ class: "overflow-hidden" },
}));
const __VLS_197 = __VLS_196({
    color: "grey-darken-4",
    rounded: "0",
    ...{ class: "overflow-hidden" },
}, ...__VLS_functionalComponentArgsRest(__VLS_196));
__VLS_198.slots.default;
const __VLS_199 = {}.VBtn;
/** @type {[typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ]} */ ;
// @ts-ignore
const __VLS_200 = __VLS_asFunctionalComponent(__VLS_199, new __VLS_199({
    ...{ 'onClick': {} },
    icon: true,
    variant: "text",
    ...{ class: "soon-close-btn" },
}));
const __VLS_201 = __VLS_200({
    ...{ 'onClick': {} },
    icon: true,
    variant: "text",
    ...{ class: "soon-close-btn" },
}, ...__VLS_functionalComponentArgsRest(__VLS_200));
let __VLS_203;
let __VLS_204;
let __VLS_205;
const __VLS_206 = {
    onClick: (...[$event]) => {
        __VLS_ctx.showDrunagorSoonDialog = false;
    }
};
__VLS_202.slots.default;
const __VLS_207 = {}.VIcon;
/** @type {[typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, ]} */ ;
// @ts-ignore
const __VLS_208 = __VLS_asFunctionalComponent(__VLS_207, new __VLS_207({}));
const __VLS_209 = __VLS_208({}, ...__VLS_functionalComponentArgsRest(__VLS_208));
__VLS_210.slots.default;
var __VLS_210;
var __VLS_202;
const __VLS_211 = {}.VCardText;
/** @type {[typeof __VLS_components.VCardText, typeof __VLS_components.vCardText, typeof __VLS_components.VCardText, typeof __VLS_components.vCardText, ]} */ ;
// @ts-ignore
const __VLS_212 = __VLS_asFunctionalComponent(__VLS_211, new __VLS_211({
    ...{ class: "pa-0 pb-6" },
}));
const __VLS_213 = __VLS_212({
    ...{ class: "pa-0 pb-6" },
}, ...__VLS_functionalComponentArgsRest(__VLS_212));
__VLS_214.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.img)({
    src: (__VLS_ctx.Underkeep2Banner),
    alt: "Drunagor Nights Season 2",
    ...{ class: "soon-banner" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "soon-content px-5 pt-5" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
    ...{ class: "text-overline text-green-accent-3 font-weight-bold mb-2" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.h3, __VLS_intrinsicElements.h3)({
    ...{ class: "text-h4 font-weight-black text-white mb-4" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "soon-media mb-6" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.video, __VLS_intrinsicElements.video)({
    autoplay: true,
    muted: true,
    loop: true,
    playsinline: true,
    ...{ class: "soon-video" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.source)({
    src: (__VLS_ctx.assets + '/landing-page/presentation-video.mp4'),
    type: "video/mp4",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "soon-media-overlay" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "text-body-1 text-grey-lighten-1 soon-copy" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
    ...{ class: "mb-4" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
    ...{ class: "mb-4" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
    ...{ class: "mb-4" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
    ...{ class: "mb-0" },
});
const __VLS_215 = {}.VBtn;
/** @type {[typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ]} */ ;
// @ts-ignore
const __VLS_216 = __VLS_asFunctionalComponent(__VLS_215, new __VLS_215({
    ...{ 'onClick': {} },
    color: "green-accent-3",
    variant: "flat",
    rounded: "pill",
    size: "large",
    block: true,
    ...{ class: "font-weight-black text-grey-darken-4 mt-6" },
}));
const __VLS_217 = __VLS_216({
    ...{ 'onClick': {} },
    color: "green-accent-3",
    variant: "flat",
    rounded: "pill",
    size: "large",
    block: true,
    ...{ class: "font-weight-black text-grey-darken-4 mt-6" },
}, ...__VLS_functionalComponentArgsRest(__VLS_216));
let __VLS_219;
let __VLS_220;
let __VLS_221;
const __VLS_222 = {
    onClick: (...[$event]) => {
        __VLS_ctx.showDrunagorSoonDialog = false;
    }
};
__VLS_218.slots.default;
var __VLS_218;
var __VLS_214;
var __VLS_198;
var __VLS_194;
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
/** @type {__VLS_StyleScopedClasses['d-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-space-between']} */ ;
/** @type {__VLS_StyleScopedClasses['align-center']} */ ;
/** @type {__VLS_StyleScopedClasses['px-4']} */ ;
/** @type {__VLS_StyleScopedClasses['pt-4']} */ ;
/** @type {__VLS_StyleScopedClasses['pb-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-h5']} */ ;
/** @type {__VLS_StyleScopedClasses['font-weight-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['pa-0']} */ ;
/** @type {__VLS_StyleScopedClasses['pa-5']} */ ;
/** @type {__VLS_StyleScopedClasses['text-center']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-xl']} */ ;
/** @type {__VLS_StyleScopedClasses['elevation-4']} */ ;
/** @type {__VLS_StyleScopedClasses['text-h5']} */ ;
/** @type {__VLS_StyleScopedClasses['font-weight-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-green-accent-3']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-1']} */ ;
/** @type {__VLS_StyleScopedClasses['text-body-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-grey-lighten-1']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-5']} */ ;
/** @type {__VLS_StyleScopedClasses['px-2']} */ ;
/** @type {__VLS_StyleScopedClasses['font-weight-black']} */ ;
/** @type {__VLS_StyleScopedClasses['text-grey-darken-4']} */ ;
/** @type {__VLS_StyleScopedClasses['mr-2']} */ ;
/** @type {__VLS_StyleScopedClasses['mx-6']} */ ;
/** @type {__VLS_StyleScopedClasses['border-opacity-50']} */ ;
/** @type {__VLS_StyleScopedClasses['pa-5']} */ ;
/** @type {__VLS_StyleScopedClasses['text-center']} */ ;
/** @type {__VLS_StyleScopedClasses['legacy-cluster']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-6']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-2']} */ ;
/** @type {__VLS_StyleScopedClasses['d-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['align-center']} */ ;
/** @type {__VLS_StyleScopedClasses['ga-6']} */ ;
/** @type {__VLS_StyleScopedClasses['position-relative']} */ ;
/** @type {__VLS_StyleScopedClasses['z-10']} */ ;
/** @type {__VLS_StyleScopedClasses['legacy-logo']} */ ;
/** @type {__VLS_StyleScopedClasses['legacy-logo']} */ ;
/** @type {__VLS_StyleScopedClasses['d-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['align-center']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-n6']} */ ;
/** @type {__VLS_StyleScopedClasses['position-relative']} */ ;
/** @type {__VLS_StyleScopedClasses['z-20']} */ ;
/** @type {__VLS_StyleScopedClasses['legacy-logo']} */ ;
/** @type {__VLS_StyleScopedClasses['apoc-logo']} */ ;
/** @type {__VLS_StyleScopedClasses['text-h5']} */ ;
/** @type {__VLS_StyleScopedClasses['font-weight-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-amber-accent-2']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-1']} */ ;
/** @type {__VLS_StyleScopedClasses['text-body-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-grey-lighten-1']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-5']} */ ;
/** @type {__VLS_StyleScopedClasses['px-2']} */ ;
/** @type {__VLS_StyleScopedClasses['font-weight-black']} */ ;
/** @type {__VLS_StyleScopedClasses['text-grey-darken-4']} */ ;
/** @type {__VLS_StyleScopedClasses['mr-2']} */ ;
/** @type {__VLS_StyleScopedClasses['overflow-hidden']} */ ;
/** @type {__VLS_StyleScopedClasses['soon-close-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['pa-0']} */ ;
/** @type {__VLS_StyleScopedClasses['pb-6']} */ ;
/** @type {__VLS_StyleScopedClasses['soon-banner']} */ ;
/** @type {__VLS_StyleScopedClasses['soon-content']} */ ;
/** @type {__VLS_StyleScopedClasses['px-5']} */ ;
/** @type {__VLS_StyleScopedClasses['pt-5']} */ ;
/** @type {__VLS_StyleScopedClasses['text-overline']} */ ;
/** @type {__VLS_StyleScopedClasses['text-green-accent-3']} */ ;
/** @type {__VLS_StyleScopedClasses['font-weight-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-h4']} */ ;
/** @type {__VLS_StyleScopedClasses['font-weight-black']} */ ;
/** @type {__VLS_StyleScopedClasses['text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['soon-media']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-6']} */ ;
/** @type {__VLS_StyleScopedClasses['soon-video']} */ ;
/** @type {__VLS_StyleScopedClasses['soon-media-overlay']} */ ;
/** @type {__VLS_StyleScopedClasses['text-body-1']} */ ;
/** @type {__VLS_StyleScopedClasses['text-grey-lighten-1']} */ ;
/** @type {__VLS_StyleScopedClasses['soon-copy']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-0']} */ ;
/** @type {__VLS_StyleScopedClasses['font-weight-black']} */ ;
/** @type {__VLS_StyleScopedClasses['text-grey-darken-4']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-6']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            DashboardEvents: DashboardEvents,
            HUB: HUB,
            CoreLogo: CoreLogo,
            ApocalypseLogo: ApocalypseLogo,
            AwakeningsLogo: AwakeningsLogo,
            Underkeep2Banner: Underkeep2Banner,
            user: user,
            assets: assets,
            display: display,
            showHub: showHub,
            myEvents: myEvents,
            showPlaySelectionDialog: showPlaySelectionDialog,
            showDrunagorSoonDialog: showDrunagorSoonDialog,
            containerMaxWidth: containerMaxWidth,
            goToProfile: goToProfile,
            goToCampaigns: goToCampaigns,
            goToGroup: goToGroup,
            openPlaySelection: openPlaySelection,
            playDrunagorNights: playDrunagorNights,
            playLegacyCampaigns: playLegacyCampaigns,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
