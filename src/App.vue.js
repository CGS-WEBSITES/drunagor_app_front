/// <reference types="../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import { ref, inject, computed, onMounted, onBeforeMount, watch } from "vue";
import { setToken } from "@/service/AccessToken";
import { useRouter, useRoute } from "vue-router";
import { useDisplay } from "vuetify";
import { useUserStore } from "@/store/UserStore";
import { useTutorialStore } from "@/store/TutorialStore";
import { CampaignStore } from "@/store/CampaignStore";
import themeIcon from "@/assets/theme.png";
import VectorIcon from "@/assets/Vector.png";
const axios = inject("axios");
const openLink = (url) => {
    window.open(url, "_blank");
};
const userStore = useUserStore();
const tutorialStore = useTutorialStore();
const campaignStore = CampaignStore();
const user = computed(() => userStore.user);
const display = ref(useDisplay());
const router = useRouter();
const route = useRoute();
const campaign = computed(() => {
    if (route.name === 'Campaign' && route.params.id) {
        return campaignStore.findOptional(String(route.params.id));
    }
    return null;
});
const isImmersiveMode = computed(() => {
    if (!campaign.value)
        return false;
    if (campaign.value.campaign === 'underkeep2')
        return true;
    const wing = (campaign.value.wing || "").toUpperCase();
    return wing.includes("WING 1") || wing.includes("WING 2") || wing.includes("WING 01") || wing.includes("WING 02") || wing.includes("TUTORIAL");
});
const showMobileAppBar = computed(() => {
    return (route.name !== 'Home' &&
        route.name !== 'Login' &&
        route.name !== 'RetailerRegistration' &&
        route.name !== 'Gama' &&
        route.name !== 'Community' &&
        route.name !== 'Lobby' &&
        route.name !== 'RetailerTutorial' &&
        route.name !== 'NightsCommunication' &&
        (route.name !== 'Campaign' || !isImmersiveMode.value));
});
const assets = inject("assets");
const theme = ref(localStorage.getItem("appTheme") || "DarkTheme");
const themesList = [
    { name: "DarkTheme", label: "Dark", primary: "#363636", bg: "#141414" },
    { name: "CoreTheme", label: "Age of Darkness", primary: "#3C7376", bg: "#172A2C" },
    { name: "ApocTheme", label: "Apocalypse", primary: "#802222", bg: "#141414" },
    { name: "NightsTheme", label: "Purple", primary: "#5D3C76", bg: "#22162C" },
    { name: "EarthTheme", label: "Earth", primary: "#804F22", bg: "#3C2510" },
    { name: "BlueTheme", label: "Blue", primary: "#224780", bg: "#102139" },
    { name: "CrimsonTheme", label: "Crimson", primary: "#802222", bg: "#421111" },
    { name: "VioletTheme", label: "Violet", primary: "#622280", bg: "#2A0F36" },
    { name: "RoseTheme", label: "Rose", primary: "#763C3C", bg: "#392020" }
];
const currentThemeObj = computed(() => {
    return themesList.find(t => t.name === theme.value);
});
const selectTheme = (themeName) => {
    theme.value = themeName;
    localStorage.setItem("appTheme", themeName);
};
const drawer = ref(false);
const logOut = () => {
    userStore.clearUser();
    localStorage.removeItem("accessToken");
    router.push({ name: "Login" });
};
const role = computed(() => userStore.user?.roles_fk || 2);
const menuItems = computed(() => {
    return [
        {
            title: role.value === 3 ? "Campaign Manager" : "Companion",
            iconImage: VectorIcon,
            to: { name: "Campaign Overview" },
            disabled: false,
        },
        {
            title: role.value === 3 ? "SKUs Manager" : "Library",
            icon: "mdi-book",
            to: { name: "Library" },
            disabled: false,
        },
        {
            title: "Heroes",
            icon: "mdi-shield-sword",
            to: { name: "HeroesManager" },
            disabled: false,
        },
        // ALTERAÇÃO 2: Novo item adicionado
        {
            title: "Community Builds",
            icon: "mdi-hammer-wrench",
            to: { name: "CommunityBuilds" },
            disabled: false,
        },
        {
            title: "Dashboard",
            icon: "mdi-view-dashboard",
            to: { name: "Dashboard" },
            disabled: false,
        },
        {
            title: "Events",
            icon: "mdi-calendar",
            to: { name: "Events" },
            disabled: false,
        },
        {
            title: "My Profile",
            icon: "mdi-account",
            to: { name: "PerfilHome" },
            disabled: false,
        },
    ];
});
const handleMenuClick = (item) => {
    if (item.to) {
        router.push(item.to);
        drawer.value = false;
    }
    else if (item.do) {
        item.do();
        drawer.value = false;
    }
};
watch(() => userStore.user?.roles_fk, (newRole) => {
    console.log("Role atualizada:", newRole);
}, { immediate: true });

const contentStyle = computed(() => {
    if (route.name === "Login" ||
        route.name === "RetailerRegistration" ||
        route.name === "ForgotPassword") {
        return display.value.mdAndUp
            ? {
                "background-image": "url('https://s3.us-east-2.amazonaws.com/assets.drunagor.app/backgrounds/bg-login.webp')",
                "background-size": "cover",
                "background-position": "top center",
                "background-repeat": "no-repeat",
                "min-height": "100vh",
                width: "100%",
                "padding-top": "65px",
                display: "flex",
                "align-items": "center",
                "justify-content": "center",
            }
            : {
                "background-image": "url('https://assets.drunagor.app/backgrounds/mblogin-background.png')",
                "background-size": "cover",
                "background-position": "center",
                "background-repeat": "no-repeat",
                "min-height": "100vh",
                width: "100%",
            };
    }
    const isImmersive = route.name === 'Campaign' && isImmersiveMode.value;
    return display.value.mdAndUp
        ? {
            "background-image": "url(" + assets + "/backgrounds/backgrounds.png" + ")",
            "background-repeat": "repeat",
            "padding-top": isImmersive ? "0px" : "65px",
            "min-height": "100vh",
        }
        : {
            "background-image": "url(" + assets + "/backgrounds/backgrounds.png" + ")",
            "background-repeat": "repeat-y",
            "padding-top": "env(safe-area-inset-top, 0px)",
            "min-height": "100vh",
        };
});
const openPopup = (url) => {
    window.open(url, "_blank", "width=800,height=600,scrollbars=yes");
};
onMounted(() => {
    userStore.restoreFromStorage();
    tutorialStore.loadPreferences();
});
onBeforeMount(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
        setToken(token);
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }
});
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
// CSS variable injection 
// CSS variable injection end 
const __VLS_0 = {}.VApp;
/** @type {[typeof __VLS_components.VApp, typeof __VLS_components.vApp, typeof __VLS_components.VApp, typeof __VLS_components.vApp, ]} */ ;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
    theme: (__VLS_ctx.theme),
}));
const __VLS_2 = __VLS_1({
    theme: (__VLS_ctx.theme),
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
var __VLS_4 = {};
__VLS_3.slots.default;
const __VLS_5 = {}.Toast;
/** @type {[typeof __VLS_components.Toast, ]} */ ;
// @ts-ignore
const __VLS_6 = __VLS_asFunctionalComponent(__VLS_5, new __VLS_5({}));
const __VLS_7 = __VLS_6({}, ...__VLS_functionalComponentArgsRest(__VLS_6));
if (__VLS_ctx.display.mdAndUp && (__VLS_ctx.route.name !== 'Campaign' || !__VLS_ctx.isImmersiveMode)) {
    const __VLS_9 = {}.VRow;
    /** @type {[typeof __VLS_components.VRow, typeof __VLS_components.vRow, typeof __VLS_components.VRow, typeof __VLS_components.vRow, ]} */ ;
    // @ts-ignore
    const __VLS_10 = __VLS_asFunctionalComponent(__VLS_9, new __VLS_9({
        noGutters: true,
    }));
    const __VLS_11 = __VLS_10({
        noGutters: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_10));
    __VLS_12.slots.default;
    const __VLS_13 = {}.VAppBar;
    /** @type {[typeof __VLS_components.VAppBar, typeof __VLS_components.vAppBar, typeof __VLS_components.VAppBar, typeof __VLS_components.vAppBar, ]} */ ;
    // @ts-ignore
    const __VLS_14 = __VLS_asFunctionalComponent(__VLS_13, new __VLS_13({
        app: true,
        minHeight: "50",
        color: "secundary",
    }));
    const __VLS_15 = __VLS_14({
        app: true,
        minHeight: "50",
        color: "secundary",
    }, ...__VLS_functionalComponentArgsRest(__VLS_14));
    __VLS_16.slots.default;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ onClick: (...[$event]) => {
                if (!(__VLS_ctx.display.mdAndUp && (__VLS_ctx.route.name !== 'Campaign' || !__VLS_ctx.isImmersiveMode)))
                    return;
                __VLS_ctx.$router.push({ name: 'Dashboard' });
            } },
        ...{ style: {} },
        ...{ class: "d-flex align-center pl-6" },
    });
    const __VLS_17 = {}.VImg;
    /** @type {[typeof __VLS_components.VImg, typeof __VLS_components.vImg, typeof __VLS_components.VImg, typeof __VLS_components.vImg, ]} */ ;
    // @ts-ignore
    const __VLS_18 = __VLS_asFunctionalComponent(__VLS_17, new __VLS_17({
        src: "@/assets/darknessl.png",
        height: "30",
        width: "30",
        alt: "Drunagor Icon",
        contain: true,
        ...{ class: "mr-2" },
    }));
    const __VLS_19 = __VLS_18({
        src: "@/assets/darknessl.png",
        height: "30",
        width: "30",
        alt: "Drunagor Icon",
        contain: true,
        ...{ class: "mr-2" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_18));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    const __VLS_21 = {}.VSpacer;
    /** @type {[typeof __VLS_components.VSpacer, typeof __VLS_components.vSpacer, typeof __VLS_components.VSpacer, typeof __VLS_components.vSpacer, ]} */ ;
    // @ts-ignore
    const __VLS_22 = __VLS_asFunctionalComponent(__VLS_21, new __VLS_21({}));
    const __VLS_23 = __VLS_22({}, ...__VLS_functionalComponentArgsRest(__VLS_22));
    const __VLS_25 = {}.VMenu;
    /** @type {[typeof __VLS_components.VMenu, typeof __VLS_components.vMenu, typeof __VLS_components.VMenu, typeof __VLS_components.vMenu, ]} */ ;
    // @ts-ignore
    const __VLS_26 = __VLS_asFunctionalComponent(__VLS_25, new __VLS_25({
        openOnHover: true,
        offsetY: true,
    }));
    const __VLS_27 = __VLS_26({
        openOnHover: true,
        offsetY: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_26));
    __VLS_28.slots.default;
    const __VLS_29 = {}.VList;
    /** @type {[typeof __VLS_components.VList, typeof __VLS_components.vList, typeof __VLS_components.VList, typeof __VLS_components.vList, ]} */ ;
    // @ts-ignore
    const __VLS_30 = __VLS_asFunctionalComponent(__VLS_29, new __VLS_29({}));
    const __VLS_31 = __VLS_30({}, ...__VLS_functionalComponentArgsRest(__VLS_30));
    __VLS_32.slots.default;
    const __VLS_33 = {}.VListItem;
    /** @type {[typeof __VLS_components.VListItem, typeof __VLS_components.vListItem, typeof __VLS_components.VListItem, typeof __VLS_components.vListItem, ]} */ ;
    // @ts-ignore
    const __VLS_34 = __VLS_asFunctionalComponent(__VLS_33, new __VLS_33({
        ...{ 'onClick': {} },
    }));
    const __VLS_35 = __VLS_34({
        ...{ 'onClick': {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_34));
    let __VLS_37;
    let __VLS_38;
    let __VLS_39;
    const __VLS_40 = {
        onClick: (__VLS_ctx.logout)
    };
    __VLS_36.slots.default;
    const __VLS_41 = {}.VListItemIcon;
    /** @type {[typeof __VLS_components.VListItemIcon, typeof __VLS_components.vListItemIcon, typeof __VLS_components.VListItemIcon, typeof __VLS_components.vListItemIcon, ]} */ ;
    // @ts-ignore
    const __VLS_42 = __VLS_asFunctionalComponent(__VLS_41, new __VLS_41({}));
    const __VLS_43 = __VLS_42({}, ...__VLS_functionalComponentArgsRest(__VLS_42));
    __VLS_44.slots.default;
    const __VLS_45 = {}.VIcon;
    /** @type {[typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, ]} */ ;
    // @ts-ignore
    const __VLS_46 = __VLS_asFunctionalComponent(__VLS_45, new __VLS_45({}));
    const __VLS_47 = __VLS_46({}, ...__VLS_functionalComponentArgsRest(__VLS_46));
    __VLS_48.slots.default;
    var __VLS_48;
    var __VLS_44;
    const __VLS_49 = {}.VListItemTitle;
    /** @type {[typeof __VLS_components.VListItemTitle, typeof __VLS_components.vListItemTitle, typeof __VLS_components.VListItemTitle, typeof __VLS_components.vListItemTitle, ]} */ ;
    // @ts-ignore
    const __VLS_50 = __VLS_asFunctionalComponent(__VLS_49, new __VLS_49({}));
    const __VLS_51 = __VLS_50({}, ...__VLS_functionalComponentArgsRest(__VLS_50));
    __VLS_52.slots.default;
    var __VLS_52;
    var __VLS_36;
    var __VLS_32;
    var __VLS_28;
    if ([
        'Home',
        'Login',
        'Gama',
        'Community',
        'RetailerRegistration',
        'ForgotPassword',
        'ShareEvent',
        'RetailerTutorial',
        'NightsCommunication',
    ].includes(__VLS_ctx.route.name)) {
        const __VLS_53 = {}.VBtn;
        /** @type {[typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ]} */ ;
        // @ts-ignore
        const __VLS_54 = __VLS_asFunctionalComponent(__VLS_53, new __VLS_53({
            ...{ 'onClick': {} },
            color: "WHITE",
            large: true,
        }));
        const __VLS_55 = __VLS_54({
            ...{ 'onClick': {} },
            color: "WHITE",
            large: true,
        }, ...__VLS_functionalComponentArgsRest(__VLS_54));
        let __VLS_57;
        let __VLS_58;
        let __VLS_59;
        const __VLS_60 = {
            onClick: (...[$event]) => {
                if (!(__VLS_ctx.display.mdAndUp && (__VLS_ctx.route.name !== 'Campaign' || !__VLS_ctx.isImmersiveMode)))
                    return;
                if (!([
                    'Home',
                    'Login',
                    'Gama',
                    'Community',
                    'RetailerRegistration',
                    'ForgotPassword',
                    'ShareEvent',
                ].includes(__VLS_ctx.route.name)))
                    return;
                __VLS_ctx.$router.push({ name: 'Login', query: { tab: 'signup' } });
            }
        };
        __VLS_56.slots.default;
        var __VLS_56;
    }
    else {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "d-flex w-100 align-center justify-space-between" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "d-flex justify-center w-100" },
        });
        for (const [item, index] of __VLS_getVForSourceType((__VLS_ctx.menuItems))) {
            const __VLS_61 = {}.VHover;
            /** @type {[typeof __VLS_components.VHover, typeof __VLS_components.vHover, typeof __VLS_components.VHover, typeof __VLS_components.vHover, ]} */ ;
            // @ts-ignore
            const __VLS_62 = __VLS_asFunctionalComponent(__VLS_61, new __VLS_61({
                key: (index),
            }));
            const __VLS_63 = __VLS_62({
                key: (index),
            }, ...__VLS_functionalComponentArgsRest(__VLS_62));
            __VLS_64.slots.default;
            {
                const { default: __VLS_thisSlot } = __VLS_64.slots;
                const [{ isHovering, props }] = __VLS_getSlotParams(__VLS_thisSlot);
                const __VLS_65 = {}.VBtn;
                /** @type {[typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ]} */ ;
                // @ts-ignore
                const __VLS_66 = __VLS_asFunctionalComponent(__VLS_65, new __VLS_65({
                    ...{ 'onClick': {} },
                    ...(props),
                    color: "secundary",
                    elevation: (isHovering ? 10 : 0),
                    disabled: (item.disabled),
                    ...{ class: "mx-2" },
                }));
                const __VLS_67 = __VLS_66({
                    ...{ 'onClick': {} },
                    ...(props),
                    color: "secundary",
                    elevation: (isHovering ? 10 : 0),
                    disabled: (item.disabled),
                    ...{ class: "mx-2" },
                }, ...__VLS_functionalComponentArgsRest(__VLS_66));
                let __VLS_69;
                let __VLS_70;
                let __VLS_71;
                const __VLS_72 = {
                    onClick: (...[$event]) => {
                        if (!(__VLS_ctx.display.mdAndUp && (__VLS_ctx.route.name !== 'Campaign' || !__VLS_ctx.isImmersiveMode)))
                            return;
                        if (!!([
                            'Home',
                            'Login',
                            'Gama',
                            'Community',
                            'RetailerRegistration',
                            'ForgotPassword',
                            'ShareEvent',
                        ].includes(__VLS_ctx.route.name)))
                            return;
                        item.to ? __VLS_ctx.router.push(item.to) : item.do();
                    }
                };
                __VLS_68.slots.default;
                (item.title);
                var __VLS_68;
            }
            var __VLS_64;
        }
        const __VLS_73 = {}.VMenu;
        /** @type {[typeof __VLS_components.VMenu, typeof __VLS_components.vMenu, typeof __VLS_components.VMenu, typeof __VLS_components.vMenu, ]} */ ;
        // @ts-ignore
        const __VLS_74 = __VLS_asFunctionalComponent(__VLS_73, new __VLS_73({
            openOnClick: true,
            offsetY: true,
        }));
        const __VLS_75 = __VLS_74({
            openOnClick: true,
            offsetY: true,
        }, ...__VLS_functionalComponentArgsRest(__VLS_74));
        __VLS_76.slots.default;
        {
            const { activator: __VLS_thisSlot } = __VLS_76.slots;
            const [{ props }] = __VLS_getSlotParams(__VLS_thisSlot);
            const __VLS_77 = {}.VBtn;
            /** @type {[typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ]} */ ;
            // @ts-ignore
            const __VLS_78 = __VLS_asFunctionalComponent(__VLS_77, new __VLS_77({
                ...(props),
                icon: true,
                ...{ class: "mr-2" },
                variant: "text",
                ...{ style: {} },
            }));
            const __VLS_79 = __VLS_78({
                ...(props),
                icon: true,
                ...{ class: "mr-2" },
                variant: "text",
                ...{ style: {} },
            }, ...__VLS_functionalComponentArgsRest(__VLS_78));
            __VLS_80.slots.default;
            if (__VLS_ctx.currentThemeObj) {
                __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                    ...{ class: "d-flex" },
                    ...{ style: {} },
                });
                __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                    ...{ style: ({ backgroundColor: __VLS_ctx.currentThemeObj.bg }) },
                    ...{ style: {} },
                });
                __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                    ...{ style: ({ backgroundColor: __VLS_ctx.currentThemeObj.primary }) },
                    ...{ style: {} },
                });
            }
            else {
                const __VLS_81 = {}.VImg;
                /** @type {[typeof __VLS_components.VImg, typeof __VLS_components.vImg, typeof __VLS_components.VImg, typeof __VLS_components.vImg, ]} */ ;
                // @ts-ignore
                const __VLS_82 = __VLS_asFunctionalComponent(__VLS_81, new __VLS_81({
                    src: (__VLS_ctx.themeIcon),
                    maxHeight: "24",
                    maxWidth: "24",
                    contain: true,
                }));
                const __VLS_83 = __VLS_82({
                    src: (__VLS_ctx.themeIcon),
                    maxHeight: "24",
                    maxWidth: "24",
                    contain: true,
                }, ...__VLS_functionalComponentArgsRest(__VLS_82));
            }
            var __VLS_80;
        }
        const __VLS_85 = {}.VList;
        /** @type {[typeof __VLS_components.VList, typeof __VLS_components.vList, typeof __VLS_components.VList, typeof __VLS_components.vList, ]} */ ;
        // @ts-ignore
        const __VLS_86 = __VLS_asFunctionalComponent(__VLS_85, new __VLS_85({
            ...{ class: "bg-grey-darken-4 pa-2" },
            minWidth: "220",
            rounded: "lg",
        }));
        const __VLS_87 = __VLS_86({
            ...{ class: "bg-grey-darken-4 pa-2" },
            minWidth: "220",
            rounded: "lg",
        }, ...__VLS_functionalComponentArgsRest(__VLS_86));
        __VLS_88.slots.default;
        for (const [t] of __VLS_getVForSourceType((__VLS_ctx.themesList))) {
            const __VLS_89 = {}.VListItem;
            /** @type {[typeof __VLS_components.VListItem, typeof __VLS_components.vListItem, typeof __VLS_components.VListItem, typeof __VLS_components.vListItem, ]} */ ;
            // @ts-ignore
            const __VLS_90 = __VLS_asFunctionalComponent(__VLS_89, new __VLS_89({
                ...{ 'onClick': {} },
                key: (t.name),
                active: (__VLS_ctx.theme === t.name),
                ...{ class: "rounded-lg my-1" },
            }));
            const __VLS_91 = __VLS_90({
                ...{ 'onClick': {} },
                key: (t.name),
                active: (__VLS_ctx.theme === t.name),
                ...{ class: "rounded-lg my-1" },
            }, ...__VLS_functionalComponentArgsRest(__VLS_90));
            let __VLS_93;
            let __VLS_94;
            let __VLS_95;
            const __VLS_96 = {
                onClick: (...[$event]) => {
                    if (!(__VLS_ctx.display.mdAndUp && (__VLS_ctx.route.name !== 'Campaign' || !__VLS_ctx.isImmersiveMode)))
                        return;
                    if (!!([
                        'Home',
                        'Login',
                        'Gama',
                        'Community',
                        'RetailerRegistration',
                        'ForgotPassword',
                        'ShareEvent',
                    ].includes(__VLS_ctx.route.name)))
                        return;
                    __VLS_ctx.selectTheme(t.name);
                }
            };
            __VLS_92.slots.default;
            {
                const { prepend: __VLS_thisSlot } = __VLS_92.slots;
                __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                    ...{ class: "d-flex mr-3" },
                    ...{ style: {} },
                });
                __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                    ...{ style: ({ backgroundColor: t.bg }) },
                    ...{ style: {} },
                });
                __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                    ...{ style: ({ backgroundColor: t.primary }) },
                    ...{ style: {} },
                });
            }
            const __VLS_97 = {}.VListItemTitle;
            /** @type {[typeof __VLS_components.VListItemTitle, typeof __VLS_components.vListItemTitle, typeof __VLS_components.VListItemTitle, typeof __VLS_components.vListItemTitle, ]} */ ;
            // @ts-ignore
            const __VLS_98 = __VLS_asFunctionalComponent(__VLS_97, new __VLS_97({
                ...{ class: "text-white font-weight-medium" },
            }));
            const __VLS_99 = __VLS_98({
                ...{ class: "text-white font-weight-medium" },
            }, ...__VLS_functionalComponentArgsRest(__VLS_98));
            __VLS_100.slots.default;
            (t.label);
            var __VLS_100;
            var __VLS_92;
        }
        var __VLS_88;
        var __VLS_76;
        const __VLS_101 = {}.VMenu;
        /** @type {[typeof __VLS_components.VMenu, typeof __VLS_components.vMenu, typeof __VLS_components.VMenu, typeof __VLS_components.vMenu, ]} */ ;
        // @ts-ignore
        const __VLS_102 = __VLS_asFunctionalComponent(__VLS_101, new __VLS_101({
            openOnClick: true,
            offsetY: true,
        }));
        const __VLS_103 = __VLS_102({
            openOnClick: true,
            offsetY: true,
        }, ...__VLS_functionalComponentArgsRest(__VLS_102));
        __VLS_104.slots.default;
        {
            const { activator: __VLS_thisSlot } = __VLS_104.slots;
            const [{ props }] = __VLS_getSlotParams(__VLS_thisSlot);
            const __VLS_105 = {}.VBtn;
            /** @type {[typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ]} */ ;
            // @ts-ignore
            const __VLS_106 = __VLS_asFunctionalComponent(__VLS_105, new __VLS_105({
                ...(props),
                text: true,
                ...{ class: "px-3" },
            }));
            const __VLS_107 = __VLS_106({
                ...(props),
                text: true,
                ...{ class: "px-3" },
            }, ...__VLS_functionalComponentArgsRest(__VLS_106));
            __VLS_108.slots.default;
            __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
                ...{ class: "pr-1" },
            });
            (__VLS_ctx.user.user_name);
            const __VLS_109 = {}.VAvatar;
            /** @type {[typeof __VLS_components.VAvatar, typeof __VLS_components.vAvatar, typeof __VLS_components.VAvatar, typeof __VLS_components.vAvatar, ]} */ ;
            // @ts-ignore
            const __VLS_110 = __VLS_asFunctionalComponent(__VLS_109, new __VLS_109({
                size: "35",
                ...{ class: "mr-2" },
            }));
            const __VLS_111 = __VLS_110({
                size: "35",
                ...{ class: "mr-2" },
            }, ...__VLS_functionalComponentArgsRest(__VLS_110));
            __VLS_112.slots.default;
            const __VLS_113 = {}.VImg;
            /** @type {[typeof __VLS_components.VImg, typeof __VLS_components.vImg, ]} */ ;
            // @ts-ignore
            const __VLS_114 = __VLS_asFunctionalComponent(__VLS_113, new __VLS_113({
                src: (__VLS_ctx.user.picture_hash
                    ? __VLS_ctx.assets + '/Profile/' + __VLS_ctx.user.picture_hash
                    : __VLS_ctx.assets + '/Profile/user.png'),
            }));
            const __VLS_115 = __VLS_114({
                src: (__VLS_ctx.user.picture_hash
                    ? __VLS_ctx.assets + '/Profile/' + __VLS_ctx.user.picture_hash
                    : __VLS_ctx.assets + '/Profile/user.png'),
            }, ...__VLS_functionalComponentArgsRest(__VLS_114));
            var __VLS_112;
            const __VLS_117 = {}.VIcon;
            /** @type {[typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, ]} */ ;
            // @ts-ignore
            const __VLS_118 = __VLS_asFunctionalComponent(__VLS_117, new __VLS_117({
                right: true,
            }));
            const __VLS_119 = __VLS_118({
                right: true,
            }, ...__VLS_functionalComponentArgsRest(__VLS_118));
            __VLS_120.slots.default;
            var __VLS_120;
            var __VLS_108;
        }
        const __VLS_121 = {}.VList;
        /** @type {[typeof __VLS_components.VList, typeof __VLS_components.vList, typeof __VLS_components.VList, typeof __VLS_components.vList, ]} */ ;
        // @ts-ignore
        const __VLS_122 = __VLS_asFunctionalComponent(__VLS_121, new __VLS_121({}));
        const __VLS_123 = __VLS_122({}, ...__VLS_functionalComponentArgsRest(__VLS_122));
        __VLS_124.slots.default;
        const __VLS_125 = {}.VListItem;
        /** @type {[typeof __VLS_components.VListItem, typeof __VLS_components.vListItem, typeof __VLS_components.VListItem, typeof __VLS_components.vListItem, ]} */ ;
        // @ts-ignore
        const __VLS_126 = __VLS_asFunctionalComponent(__VLS_125, new __VLS_125({
            ...{ 'onClick': {} },
        }));
        const __VLS_127 = __VLS_126({
            ...{ 'onClick': {} },
        }, ...__VLS_functionalComponentArgsRest(__VLS_126));
        let __VLS_129;
        let __VLS_130;
        let __VLS_131;
        const __VLS_132 = {
            onClick: (__VLS_ctx.logOut)
        };
        __VLS_128.slots.default;
        const __VLS_133 = {}.VListItemIcon;
        /** @type {[typeof __VLS_components.VListItemIcon, typeof __VLS_components.vListItemIcon, typeof __VLS_components.VListItemIcon, typeof __VLS_components.vListItemIcon, ]} */ ;
        // @ts-ignore
        const __VLS_134 = __VLS_asFunctionalComponent(__VLS_133, new __VLS_133({}));
        const __VLS_135 = __VLS_134({}, ...__VLS_functionalComponentArgsRest(__VLS_134));
        __VLS_136.slots.default;
        const __VLS_137 = {}.VIcon;
        /** @type {[typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, ]} */ ;
        // @ts-ignore
        const __VLS_138 = __VLS_asFunctionalComponent(__VLS_137, new __VLS_137({}));
        const __VLS_139 = __VLS_138({}, ...__VLS_functionalComponentArgsRest(__VLS_138));
        __VLS_140.slots.default;
        var __VLS_140;
        var __VLS_136;
        const __VLS_141 = {}.VListItemTitle;
        /** @type {[typeof __VLS_components.VListItemTitle, typeof __VLS_components.vListItemTitle, typeof __VLS_components.VListItemTitle, typeof __VLS_components.vListItemTitle, ]} */ ;
        // @ts-ignore
        const __VLS_142 = __VLS_asFunctionalComponent(__VLS_141, new __VLS_141({}));
        const __VLS_143 = __VLS_142({}, ...__VLS_functionalComponentArgsRest(__VLS_142));
        __VLS_144.slots.default;
        var __VLS_144;
        var __VLS_128;
        var __VLS_124;
        var __VLS_104;
    }
    var __VLS_16;
    var __VLS_12;
}
else if (__VLS_ctx.showMobileAppBar) {
    const __VLS_145 = {}.VRow;
    /** @type {[typeof __VLS_components.VRow, typeof __VLS_components.vRow, typeof __VLS_components.VRow, typeof __VLS_components.vRow, ]} */ ;
    // @ts-ignore
    const __VLS_146 = __VLS_asFunctionalComponent(__VLS_145, new __VLS_145({
        noGutters: true,
    }));
    const __VLS_147 = __VLS_146({
        noGutters: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_146));
    __VLS_148.slots.default;
    const __VLS_149 = {}.VAppBar;
    /** @type {[typeof __VLS_components.VAppBar, typeof __VLS_components.vAppBar, typeof __VLS_components.VAppBar, typeof __VLS_components.vAppBar, ]} */ ;
    // @ts-ignore
    const __VLS_150 = __VLS_asFunctionalComponent(__VLS_149, new __VLS_149({
        app: true,
        minHeight: "56",
        color: "secundary",
        elevation: "4",
        ...{ class: "safe-pwa-top-bar" },
    }));
    const __VLS_151 = __VLS_150({
        app: true,
        minHeight: "56",
        color: "secundary",
        elevation: "4",
        ...{ class: "safe-pwa-top-bar" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_150));
    __VLS_152.slots.default;
    if (__VLS_ctx.route.name === 'Dashboard') {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ onClick: (...[$event]) => {
                    if (!!(__VLS_ctx.display.mdAndUp && (__VLS_ctx.route.name !== 'Campaign' || !__VLS_ctx.isImmersiveMode)))
                        return;
                    if (!(__VLS_ctx.showMobileAppBar))
                        return;
                    if (!(__VLS_ctx.route.name === 'Dashboard'))
                        return;
                    __VLS_ctx.$router.push({ name: 'Dashboard' });
                } },
            ...{ style: {} },
            ...{ class: "d-flex align-center pl-4" },
        });
        const __VLS_153 = {}.VImg;
        /** @type {[typeof __VLS_components.VImg, typeof __VLS_components.vImg, typeof __VLS_components.VImg, typeof __VLS_components.vImg, ]} */ ;
        // @ts-ignore
        const __VLS_154 = __VLS_asFunctionalComponent(__VLS_153, new __VLS_153({
            src: "@/assets/darknessl.png",
            height: "30",
            width: "30",
            alt: "Drunagor Icon",
            contain: true,
            ...{ class: "mr-2" },
        }));
        const __VLS_155 = __VLS_154({
            src: "@/assets/darknessl.png",
            height: "30",
            width: "30",
            alt: "Drunagor Icon",
            contain: true,
            ...{ class: "mr-2" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_154));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    }
    else {
        const __VLS_157 = {}.VBtn;
        /** @type {[typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ]} */ ;
        // @ts-ignore
        const __VLS_158 = __VLS_asFunctionalComponent(__VLS_157, new __VLS_157({
            ...{ 'onClick': {} },
            icon: true,
            ...{ class: "mr-2" },
        }));
        const __VLS_159 = __VLS_158({
            ...{ 'onClick': {} },
            icon: true,
            ...{ class: "mr-2" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_158));
        let __VLS_161;
        let __VLS_162;
        let __VLS_163;
        const __VLS_164 = {
            onClick: (...[$event]) => {
                if (!!(__VLS_ctx.display.mdAndUp && (__VLS_ctx.route.name !== 'Campaign' || !__VLS_ctx.isImmersiveMode)))
                    return;
                if (!(__VLS_ctx.showMobileAppBar))
                    return;
                if (!!(__VLS_ctx.route.name === 'Dashboard'))
                    return;
                __VLS_ctx.$router.back();
            }
        };
        __VLS_160.slots.default;
        const __VLS_165 = {}.VIcon;
        /** @type {[typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, ]} */ ;
        // @ts-ignore
        const __VLS_166 = __VLS_asFunctionalComponent(__VLS_165, new __VLS_165({}));
        const __VLS_167 = __VLS_166({}, ...__VLS_functionalComponentArgsRest(__VLS_166));
        __VLS_168.slots.default;
        var __VLS_168;
        var __VLS_160;
    }
    const __VLS_169 = {}.VSpacer;
    /** @type {[typeof __VLS_components.VSpacer, typeof __VLS_components.vSpacer, typeof __VLS_components.VSpacer, typeof __VLS_components.vSpacer, ]} */ ;
    // @ts-ignore
    const __VLS_170 = __VLS_asFunctionalComponent(__VLS_169, new __VLS_169({}));
    const __VLS_171 = __VLS_170({}, ...__VLS_functionalComponentArgsRest(__VLS_170));
    const __VLS_173 = {}.VBtn;
    /** @type {[typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ]} */ ;
    // @ts-ignore
    const __VLS_174 = __VLS_asFunctionalComponent(__VLS_173, new __VLS_173({
        ...{ 'onClick': {} },
        icon: true,
        ...{ class: "mr-2" },
    }));
    const __VLS_175 = __VLS_174({
        ...{ 'onClick': {} },
        icon: true,
        ...{ class: "mr-2" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_174));
    let __VLS_177;
    let __VLS_178;
    let __VLS_179;
    const __VLS_180 = {
        onClick: (...[$event]) => {
            if (!!(__VLS_ctx.display.mdAndUp && (__VLS_ctx.route.name !== 'Campaign' || !__VLS_ctx.isImmersiveMode)))
                return;
            if (!(__VLS_ctx.showMobileAppBar))
                return;
            __VLS_ctx.drawer = !__VLS_ctx.drawer;
        }
    };
    __VLS_176.slots.default;
    const __VLS_181 = {}.VIcon;
    /** @type {[typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, ]} */ ;
    // @ts-ignore
    const __VLS_182 = __VLS_asFunctionalComponent(__VLS_181, new __VLS_181({}));
    const __VLS_183 = __VLS_182({}, ...__VLS_functionalComponentArgsRest(__VLS_182));
    __VLS_184.slots.default;
    var __VLS_184;
    var __VLS_176;
    var __VLS_152;
    const __VLS_185 = {}.VNavigationDrawer;
    /** @type {[typeof __VLS_components.VNavigationDrawer, typeof __VLS_components.vNavigationDrawer, typeof __VLS_components.VNavigationDrawer, typeof __VLS_components.vNavigationDrawer, ]} */ ;
    // @ts-ignore
    const __VLS_186 = __VLS_asFunctionalComponent(__VLS_185, new __VLS_185({
        modelValue: (__VLS_ctx.drawer),
        temporary: true,
        location: "right",
        width: "280",
    }));
    const __VLS_187 = __VLS_186({
        modelValue: (__VLS_ctx.drawer),
        temporary: true,
        location: "right",
        width: "280",
    }, ...__VLS_functionalComponentArgsRest(__VLS_186));
    __VLS_188.slots.default;
    const __VLS_189 = {}.VListItem;
    /** @type {[typeof __VLS_components.VListItem, typeof __VLS_components.vListItem, typeof __VLS_components.VListItem, typeof __VLS_components.vListItem, ]} */ ;
    // @ts-ignore
    const __VLS_190 = __VLS_asFunctionalComponent(__VLS_189, new __VLS_189({
        ...{ class: "pa-4" },
        prependAvatar: (__VLS_ctx.user.picture_hash
            ? __VLS_ctx.assets + '/Profile/' + __VLS_ctx.user.picture_hash
            : __VLS_ctx.assets + '/Profile/user.png'),
        title: (__VLS_ctx.user.user_name || 'User'),
        subtitle: (__VLS_ctx.role === 3 ? 'Retailer' : 'Player'),
    }));
    const __VLS_191 = __VLS_190({
        ...{ class: "pa-4" },
        prependAvatar: (__VLS_ctx.user.picture_hash
            ? __VLS_ctx.assets + '/Profile/' + __VLS_ctx.user.picture_hash
            : __VLS_ctx.assets + '/Profile/user.png'),
        title: (__VLS_ctx.user.user_name || 'User'),
        subtitle: (__VLS_ctx.role === 3 ? 'Retailer' : 'Player'),
    }, ...__VLS_functionalComponentArgsRest(__VLS_190));
    const __VLS_193 = {}.VDivider;
    /** @type {[typeof __VLS_components.VDivider, typeof __VLS_components.vDivider, typeof __VLS_components.VDivider, typeof __VLS_components.vDivider, ]} */ ;
    // @ts-ignore
    const __VLS_194 = __VLS_asFunctionalComponent(__VLS_193, new __VLS_193({}));
    const __VLS_195 = __VLS_194({}, ...__VLS_functionalComponentArgsRest(__VLS_194));
    const __VLS_197 = {}.VList;
    /** @type {[typeof __VLS_components.VList, typeof __VLS_components.vList, typeof __VLS_components.VList, typeof __VLS_components.vList, ]} */ ;
    // @ts-ignore
    const __VLS_198 = __VLS_asFunctionalComponent(__VLS_197, new __VLS_197({
        density: "compact",
        nav: true,
    }));
    const __VLS_199 = __VLS_198({
        density: "compact",
        nav: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_198));
    __VLS_200.slots.default;
    for (const [item, index] of __VLS_getVForSourceType((__VLS_ctx.menuItems))) {
        const __VLS_201 = {}.VListItem;
        /** @type {[typeof __VLS_components.VListItem, typeof __VLS_components.vListItem, typeof __VLS_components.VListItem, typeof __VLS_components.vListItem, ]} */ ;
        // @ts-ignore
        const __VLS_202 = __VLS_asFunctionalComponent(__VLS_201, new __VLS_201({
            ...{ 'onClick': {} },
            key: (index),
            disabled: (item.disabled),
            value: (item.title),
            ...{ class: "my-1" },
        }));
        const __VLS_203 = __VLS_202({
            ...{ 'onClick': {} },
            key: (index),
            disabled: (item.disabled),
            value: (item.title),
            ...{ class: "my-1" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_202));
        let __VLS_205;
        let __VLS_206;
        let __VLS_207;
        const __VLS_208 = {
            onClick: (...[$event]) => {
                if (!!(__VLS_ctx.display.mdAndUp && (__VLS_ctx.route.name !== 'Campaign' || !__VLS_ctx.isImmersiveMode)))
                    return;
                if (!(__VLS_ctx.showMobileAppBar))
                    return;
                __VLS_ctx.handleMenuClick(item);
            }
        };
        __VLS_204.slots.default;
        {
            const { prepend: __VLS_thisSlot } = __VLS_204.slots;
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: "d-flex align-center" },
                ...{ style: {} },
            });
            if (item.iconImage) {
                const __VLS_209 = {}.VImg;
                /** @type {[typeof __VLS_components.VImg, typeof __VLS_components.vImg, typeof __VLS_components.VImg, typeof __VLS_components.vImg, ]} */ ;
                // @ts-ignore
                const __VLS_210 = __VLS_asFunctionalComponent(__VLS_209, new __VLS_209({
                    src: (item.iconImage),
                    width: "24",
                    height: "24",
                    contain: true,
                }));
                const __VLS_211 = __VLS_210({
                    src: (item.iconImage),
                    width: "24",
                    height: "24",
                    contain: true,
                }, ...__VLS_functionalComponentArgsRest(__VLS_210));
            }
            else {
                const __VLS_213 = {}.VIcon;
                /** @type {[typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, ]} */ ;
                // @ts-ignore
                const __VLS_214 = __VLS_asFunctionalComponent(__VLS_213, new __VLS_213({
                    size: "24",
                }));
                const __VLS_215 = __VLS_214({
                    size: "24",
                }, ...__VLS_functionalComponentArgsRest(__VLS_214));
                __VLS_216.slots.default;
                (item.icon);
                var __VLS_216;
            }
        }
        const __VLS_217 = {}.VListItemTitle;
        /** @type {[typeof __VLS_components.VListItemTitle, typeof __VLS_components.vListItemTitle, typeof __VLS_components.VListItemTitle, typeof __VLS_components.vListItemTitle, ]} */ ;
        // @ts-ignore
        const __VLS_218 = __VLS_asFunctionalComponent(__VLS_217, new __VLS_217({}));
        const __VLS_219 = __VLS_218({}, ...__VLS_functionalComponentArgsRest(__VLS_218));
        __VLS_220.slots.default;
        (item.title);
        var __VLS_220;
        var __VLS_204;
    }
    var __VLS_200;
    const __VLS_221 = {}.VDivider;
    /** @type {[typeof __VLS_components.VDivider, typeof __VLS_components.vDivider, typeof __VLS_components.VDivider, typeof __VLS_components.vDivider, ]} */ ;
    // @ts-ignore
    const __VLS_222 = __VLS_asFunctionalComponent(__VLS_221, new __VLS_221({}));
    const __VLS_223 = __VLS_222({}, ...__VLS_functionalComponentArgsRest(__VLS_222));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "px-4 py-2 text-overline text-grey-lighten-1" },
    });
    const __VLS_225 = {}.VList;
    /** @type {[typeof __VLS_components.VList, typeof __VLS_components.vList, typeof __VLS_components.VList, typeof __VLS_components.vList, ]} */ ;
    // @ts-ignore
    const __VLS_226 = __VLS_asFunctionalComponent(__VLS_225, new __VLS_225({
        density: "compact",
        nav: true,
        ...{ class: "px-2" },
    }));
    const __VLS_227 = __VLS_226({
        density: "compact",
        nav: true,
        ...{ class: "px-2" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_226));
    __VLS_228.slots.default;
    for (const [t] of __VLS_getVForSourceType((__VLS_ctx.themesList))) {
        const __VLS_229 = {}.VListItem;
        /** @type {[typeof __VLS_components.VListItem, typeof __VLS_components.vListItem, typeof __VLS_components.VListItem, typeof __VLS_components.vListItem, ]} */ ;
        // @ts-ignore
        const __VLS_230 = __VLS_asFunctionalComponent(__VLS_229, new __VLS_229({
            ...{ 'onClick': {} },
            key: (t.name),
            active: (__VLS_ctx.theme === t.name),
            ...{ class: "my-1 rounded-lg" },
        }));
        const __VLS_231 = __VLS_230({
            ...{ 'onClick': {} },
            key: (t.name),
            active: (__VLS_ctx.theme === t.name),
            ...{ class: "my-1 rounded-lg" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_230));
        let __VLS_233;
        let __VLS_234;
        let __VLS_235;
        const __VLS_236 = {
            onClick: (...[$event]) => {
                if (!!(__VLS_ctx.display.mdAndUp && (__VLS_ctx.route.name !== 'Campaign' || !__VLS_ctx.isImmersiveMode)))
                    return;
                if (!(__VLS_ctx.showMobileAppBar))
                    return;
                __VLS_ctx.selectTheme(t.name);
            }
        };
        __VLS_232.slots.default;
        {
            const { prepend: __VLS_thisSlot } = __VLS_232.slots;
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: "d-flex mr-3" },
                ...{ style: {} },
            });
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ style: ({ backgroundColor: t.bg }) },
                ...{ style: {} },
            });
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ style: ({ backgroundColor: t.primary }) },
                ...{ style: {} },
            });
        }
        const __VLS_237 = {}.VListItemTitle;
        /** @type {[typeof __VLS_components.VListItemTitle, typeof __VLS_components.vListItemTitle, typeof __VLS_components.VListItemTitle, typeof __VLS_components.vListItemTitle, ]} */ ;
        // @ts-ignore
        const __VLS_238 = __VLS_asFunctionalComponent(__VLS_237, new __VLS_237({
            ...{ class: "text-white text-body-2" },
        }));
        const __VLS_239 = __VLS_238({
            ...{ class: "text-white text-body-2" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_238));
        __VLS_240.slots.default;
        (t.label);
        var __VLS_240;
        var __VLS_232;
    }
    var __VLS_228;
    {
        const { append: __VLS_thisSlot } = __VLS_188.slots;
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "pa-2" },
        });
        const __VLS_241 = {}.VDivider;
        /** @type {[typeof __VLS_components.VDivider, typeof __VLS_components.vDivider, typeof __VLS_components.VDivider, typeof __VLS_components.vDivider, ]} */ ;
        // @ts-ignore
        const __VLS_242 = __VLS_asFunctionalComponent(__VLS_241, new __VLS_241({
            ...{ class: "mb-2" },
        }));
        const __VLS_243 = __VLS_242({
            ...{ class: "mb-2" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_242));
        const __VLS_245 = {}.VListItem;
        /** @type {[typeof __VLS_components.VListItem, typeof __VLS_components.vListItem, typeof __VLS_components.VListItem, typeof __VLS_components.vListItem, ]} */ ;
        // @ts-ignore
        const __VLS_246 = __VLS_asFunctionalComponent(__VLS_245, new __VLS_245({
            ...{ 'onClick': {} },
            ...{ class: "my-1" },
        }));
        const __VLS_247 = __VLS_246({
            ...{ 'onClick': {} },
            ...{ class: "my-1" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_246));
        let __VLS_249;
        let __VLS_250;
        let __VLS_251;
        const __VLS_252 = {
            onClick: (__VLS_ctx.logOut)
        };
        __VLS_248.slots.default;
        {
            const { prepend: __VLS_thisSlot } = __VLS_248.slots;
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: "d-flex align-center" },
                ...{ style: {} },
            });
            const __VLS_253 = {}.VIcon;
            /** @type {[typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, ]} */ ;
            // @ts-ignore
            const __VLS_254 = __VLS_asFunctionalComponent(__VLS_253, new __VLS_253({
                size: "24",
            }));
            const __VLS_255 = __VLS_254({
                size: "24",
            }, ...__VLS_functionalComponentArgsRest(__VLS_254));
            __VLS_256.slots.default;
            var __VLS_256;
        }
        const __VLS_257 = {}.VListItemTitle;
        /** @type {[typeof __VLS_components.VListItemTitle, typeof __VLS_components.vListItemTitle, typeof __VLS_components.VListItemTitle, typeof __VLS_components.vListItemTitle, ]} */ ;
        // @ts-ignore
        const __VLS_258 = __VLS_asFunctionalComponent(__VLS_257, new __VLS_257({}));
        const __VLS_259 = __VLS_258({}, ...__VLS_functionalComponentArgsRest(__VLS_258));
        __VLS_260.slots.default;
        var __VLS_260;
        var __VLS_248;
    }
    var __VLS_188;
    var __VLS_148;
}
const __VLS_261 = {}.RouterView;
/** @type {[typeof __VLS_components.RouterView, typeof __VLS_components.routerView, ]} */ ;
// @ts-ignore
const __VLS_262 = __VLS_asFunctionalComponent(__VLS_261, new __VLS_261({
    ...{ style: (__VLS_ctx.contentStyle) },
    ...{ class: ({ 'pt-10': __VLS_ctx.display.mdAndUp && (__VLS_ctx.route.name !== 'Campaign' || !__VLS_ctx.isImmersiveMode) }) },
}));
const __VLS_263 = __VLS_262({
    ...{ style: (__VLS_ctx.contentStyle) },
    ...{ class: ({ 'pt-10': __VLS_ctx.display.mdAndUp && (__VLS_ctx.route.name !== 'Campaign' || !__VLS_ctx.isImmersiveMode) }) },
}, ...__VLS_functionalComponentArgsRest(__VLS_262));
var __VLS_3;
/** @type {__VLS_StyleScopedClasses['d-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['align-center']} */ ;
/** @type {__VLS_StyleScopedClasses['pl-6']} */ ;
/** @type {__VLS_StyleScopedClasses['mr-2']} */ ;
/** @type {__VLS_StyleScopedClasses['d-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['w-100']} */ ;
/** @type {__VLS_StyleScopedClasses['align-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-space-between']} */ ;
/** @type {__VLS_StyleScopedClasses['d-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['w-100']} */ ;
/** @type {__VLS_StyleScopedClasses['mx-2']} */ ;
/** @type {__VLS_StyleScopedClasses['mr-2']} */ ;
/** @type {__VLS_StyleScopedClasses['d-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-grey-darken-4']} */ ;
/** @type {__VLS_StyleScopedClasses['pa-2']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['my-1']} */ ;
/** @type {__VLS_StyleScopedClasses['d-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['mr-3']} */ ;
/** @type {__VLS_StyleScopedClasses['text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['font-weight-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['px-3']} */ ;
/** @type {__VLS_StyleScopedClasses['pr-1']} */ ;
/** @type {__VLS_StyleScopedClasses['mr-2']} */ ;
/** @type {__VLS_StyleScopedClasses['safe-pwa-top-bar']} */ ;
/** @type {__VLS_StyleScopedClasses['d-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['align-center']} */ ;
/** @type {__VLS_StyleScopedClasses['pl-4']} */ ;
/** @type {__VLS_StyleScopedClasses['mr-2']} */ ;
/** @type {__VLS_StyleScopedClasses['mr-2']} */ ;
/** @type {__VLS_StyleScopedClasses['mr-2']} */ ;
/** @type {__VLS_StyleScopedClasses['pa-4']} */ ;
/** @type {__VLS_StyleScopedClasses['my-1']} */ ;
/** @type {__VLS_StyleScopedClasses['d-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['align-center']} */ ;
/** @type {__VLS_StyleScopedClasses['px-4']} */ ;
/** @type {__VLS_StyleScopedClasses['py-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-overline']} */ ;
/** @type {__VLS_StyleScopedClasses['text-grey-lighten-1']} */ ;
/** @type {__VLS_StyleScopedClasses['px-2']} */ ;
/** @type {__VLS_StyleScopedClasses['my-1']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['d-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['mr-3']} */ ;
/** @type {__VLS_StyleScopedClasses['text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['text-body-2']} */ ;
/** @type {__VLS_StyleScopedClasses['pa-2']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-2']} */ ;
/** @type {__VLS_StyleScopedClasses['my-1']} */ ;
/** @type {__VLS_StyleScopedClasses['d-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['align-center']} */ ;
/** @type {__VLS_StyleScopedClasses['pt-10']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            themeIcon: themeIcon,
            user: user,
            display: display,
            router: router,
            route: route,
            isImmersiveMode: isImmersiveMode,
            showMobileAppBar: showMobileAppBar,
            assets: assets,
            theme: theme,
            themesList: themesList,
            currentThemeObj: currentThemeObj,
            selectTheme: selectTheme,
            drawer: drawer,
            logOut: logOut,
            role: role,
            menuItems: menuItems,
            handleMenuClick: handleMenuClick,
            contentStyle: contentStyle,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
