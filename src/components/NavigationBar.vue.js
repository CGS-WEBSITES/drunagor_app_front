/// <reference types="../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "@/store/UserStore";
const user = useUserStore().user;
const router = useRouter();
const activeButton = ref(null);
const retailbuttons = ref([
    {
        icon: "mdi-account",
        value: "PerfilHome",
        route: "/profile/home",
        text: "profile",
    },
    {
        icon: "mdi-store",
        value: "store",
        route: "/profile/store-settings",
        text: "stores",
    },
    {
        icon: "mdi-account-group",
        value: "group",
        route: "/profile/friend-storelist",
        text: "friends",
    },
    {
        icon: "mdi-cog-outline",
        value: "settings",
        route: "/profile/settings",
        text: "settings",
    },
]);
const usermobilebuttons = ref([
    {
        icon: "mdi-account",
        value: "PerfilHome",
        route: "/profile/home",
        text: "profile",
    },
    {
        icon: "mdi-account-group",
        value: "group",
        route: "/profile/friend-storelist",
        text: "friends",
    },
    {
        icon: "mdi-cog-outline",
        value: "settings",
        route: "/profile/settings",
        text: "settings",
    },
    { icon: "mdi-logout", value: "logout", route: "/login", text: "logout" },
]);
const retailmobilebuttons = ref([
    {
        icon: "mdi-account",
        value: "PerfilHome",
        route: "/profile/home",
        text: "profile",
    },
    {
        icon: "mdi-store",
        value: "store",
        route: "/profile/store-settings",
        text: "stores",
    },
    {
        icon: "mdi-account-group",
        value: "group",
        route: "/profile/friend-storelist",
        text: "friends",
    },
    {
        icon: "mdi-cog-outline",
        value: "settings",
        route: "/profile/settings",
        text: "settings",
    },
    { icon: "mdi-logout", value: "logout", route: "/login", text: "logout" },
]);
const userbuttons = ref([
    {
        icon: "mdi-account",
        value: "PerfilHome",
        route: "/profile/home",
        text: "profile",
    },
    {
        icon: "mdi-account-group",
        value: "group",
        route: "/profile/friend-storelist",
        text: "friends",
    },
    {
        icon: "mdi-cog-outline",
        value: "settings",
        route: "/profile/settings",
        text: "settings",
    },
]);
const navigateTo = (route) => {
    router.push(route);
};
const logOut = () => {
    localStorage.removeItem("accessToken");
    router.push({ name: "Login" });
};
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
const __VLS_0 = {}.VContainer;
/** @type {[typeof __VLS_components.VContainer, typeof __VLS_components.vContainer, typeof __VLS_components.VContainer, typeof __VLS_components.vContainer, ]} */ ;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
    maxWidth: "800",
    ...{ class: "d-md-none pa-4" },
}));
const __VLS_2 = __VLS_1({
    maxWidth: "800",
    ...{ class: "d-md-none pa-4" },
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
__VLS_3.slots.default;
const __VLS_4 = {}.VCard;
/** @type {[typeof __VLS_components.VCard, typeof __VLS_components.vCard, typeof __VLS_components.VCard, typeof __VLS_components.vCard, ]} */ ;
// @ts-ignore
const __VLS_5 = __VLS_asFunctionalComponent(__VLS_4, new __VLS_4({
    color: "primary",
    rounded: "lg",
    elevation: "3",
    ...{ class: "mx-auto py-4 px-6 d-flex justify-center" },
}));
const __VLS_6 = __VLS_5({
    color: "primary",
    rounded: "lg",
    elevation: "3",
    ...{ class: "mx-auto py-4 px-6 d-flex justify-center" },
}, ...__VLS_functionalComponentArgsRest(__VLS_5));
__VLS_7.slots.default;
const __VLS_8 = {}.VRow;
/** @type {[typeof __VLS_components.VRow, typeof __VLS_components.vRow, typeof __VLS_components.VRow, typeof __VLS_components.vRow, ]} */ ;
// @ts-ignore
const __VLS_9 = __VLS_asFunctionalComponent(__VLS_8, new __VLS_8({
    justify: "space-between",
    align: "center",
    ...{ class: "py-2" },
    ...{ style: {} },
}));
const __VLS_10 = __VLS_9({
    justify: "space-between",
    align: "center",
    ...{ class: "py-2" },
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_9));
__VLS_11.slots.default;
if (__VLS_ctx.user?.roles_fk === 2) {
    for (const [button, i] of __VLS_getVForSourceType((__VLS_ctx.usermobilebuttons))) {
        (button.value);
        const __VLS_12 = {}.VBtn;
        /** @type {[typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ]} */ ;
        // @ts-ignore
        const __VLS_13 = __VLS_asFunctionalComponent(__VLS_12, new __VLS_12({
            ...{ 'onClick': {} },
            icon: (button.icon),
        }));
        const __VLS_14 = __VLS_13({
            ...{ 'onClick': {} },
            icon: (button.icon),
        }, ...__VLS_functionalComponentArgsRest(__VLS_13));
        let __VLS_16;
        let __VLS_17;
        let __VLS_18;
        const __VLS_19 = {
            onClick: (...[$event]) => {
                if (!(__VLS_ctx.user?.roles_fk === 2))
                    return;
                button.value === 'logout' ? __VLS_ctx.logOut() : __VLS_ctx.navigateTo(button.route);
            }
        };
        var __VLS_15;
        if (i % 2 === 0 && i !== __VLS_ctx.usermobilebuttons.length - 1) {
            const __VLS_20 = {}.VDivider;
            /** @type {[typeof __VLS_components.VDivider, typeof __VLS_components.vDivider, typeof __VLS_components.VDivider, typeof __VLS_components.vDivider, ]} */ ;
            // @ts-ignore
            const __VLS_21 = __VLS_asFunctionalComponent(__VLS_20, new __VLS_20({
                vertical: true,
            }));
            const __VLS_22 = __VLS_21({
                vertical: true,
            }, ...__VLS_functionalComponentArgsRest(__VLS_21));
        }
    }
}
else if (__VLS_ctx.user?.roles_fk === 3) {
    for (const [button, i] of __VLS_getVForSourceType((__VLS_ctx.retailmobilebuttons))) {
        (button.value);
        const __VLS_24 = {}.VBtn;
        /** @type {[typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ]} */ ;
        // @ts-ignore
        const __VLS_25 = __VLS_asFunctionalComponent(__VLS_24, new __VLS_24({
            ...{ 'onClick': {} },
            icon: (button.icon),
        }));
        const __VLS_26 = __VLS_25({
            ...{ 'onClick': {} },
            icon: (button.icon),
        }, ...__VLS_functionalComponentArgsRest(__VLS_25));
        let __VLS_28;
        let __VLS_29;
        let __VLS_30;
        const __VLS_31 = {
            onClick: (...[$event]) => {
                if (!!(__VLS_ctx.user?.roles_fk === 2))
                    return;
                if (!(__VLS_ctx.user?.roles_fk === 3))
                    return;
                button.value === 'logout' ? __VLS_ctx.logOut() : __VLS_ctx.navigateTo(button.route);
            }
        };
        var __VLS_27;
        if (i % 3 === 0 && i !== __VLS_ctx.retailmobilebuttons.length - 1) {
            const __VLS_32 = {}.VDivider;
            /** @type {[typeof __VLS_components.VDivider, typeof __VLS_components.vDivider, typeof __VLS_components.VDivider, typeof __VLS_components.vDivider, ]} */ ;
            // @ts-ignore
            const __VLS_33 = __VLS_asFunctionalComponent(__VLS_32, new __VLS_32({
                vertical: true,
            }));
            const __VLS_34 = __VLS_33({
                vertical: true,
            }, ...__VLS_functionalComponentArgsRest(__VLS_33));
        }
    }
}
var __VLS_11;
var __VLS_7;
var __VLS_3;
const __VLS_36 = {}.VContainer;
/** @type {[typeof __VLS_components.VContainer, typeof __VLS_components.vContainer, typeof __VLS_components.VContainer, typeof __VLS_components.vContainer, ]} */ ;
// @ts-ignore
const __VLS_37 = __VLS_asFunctionalComponent(__VLS_36, new __VLS_36({
    maxWidth: "800",
    ...{ style: {} },
    ...{ class: "d-none d-md-flex" },
}));
const __VLS_38 = __VLS_37({
    maxWidth: "800",
    ...{ style: {} },
    ...{ class: "d-none d-md-flex" },
}, ...__VLS_functionalComponentArgsRest(__VLS_37));
__VLS_39.slots.default;
const __VLS_40 = {}.VCard;
/** @type {[typeof __VLS_components.VCard, typeof __VLS_components.vCard, typeof __VLS_components.VCard, typeof __VLS_components.vCard, ]} */ ;
// @ts-ignore
const __VLS_41 = __VLS_asFunctionalComponent(__VLS_40, new __VLS_40({
    color: "primary",
    rounded: "lg",
    elevation: "3",
    ...{ class: "mx-auto py-4 px-6 d-flex justify-center" },
}));
const __VLS_42 = __VLS_41({
    color: "primary",
    rounded: "lg",
    elevation: "3",
    ...{ class: "mx-auto py-4 px-6 d-flex justify-center" },
}, ...__VLS_functionalComponentArgsRest(__VLS_41));
__VLS_43.slots.default;
const __VLS_44 = {}.VRow;
/** @type {[typeof __VLS_components.VRow, typeof __VLS_components.vRow, typeof __VLS_components.VRow, typeof __VLS_components.vRow, ]} */ ;
// @ts-ignore
const __VLS_45 = __VLS_asFunctionalComponent(__VLS_44, new __VLS_44({
    justify: "space-between",
    align: "center",
    ...{ class: "py-2" },
    ...{ style: {} },
}));
const __VLS_46 = __VLS_45({
    justify: "space-between",
    align: "center",
    ...{ class: "py-2" },
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_45));
__VLS_47.slots.default;
if (__VLS_ctx.user?.roles_fk === 2) {
    for (const [button, index] of __VLS_getVForSourceType((__VLS_ctx.userbuttons))) {
        const __VLS_48 = {}.VBtn;
        /** @type {[typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ]} */ ;
        // @ts-ignore
        const __VLS_49 = __VLS_asFunctionalComponent(__VLS_48, new __VLS_48({
            ...{ 'onClick': {} },
            ...{ class: "mx-1" },
            rounded: true,
        }));
        const __VLS_50 = __VLS_49({
            ...{ 'onClick': {} },
            ...{ class: "mx-1" },
            rounded: true,
        }, ...__VLS_functionalComponentArgsRest(__VLS_49));
        let __VLS_52;
        let __VLS_53;
        let __VLS_54;
        const __VLS_55 = {
            onClick: (...[$event]) => {
                if (!(__VLS_ctx.user?.roles_fk === 2))
                    return;
                __VLS_ctx.navigateTo(button.route);
            }
        };
        __VLS_51.slots.default;
        const __VLS_56 = {}.VIcon;
        /** @type {[typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, ]} */ ;
        // @ts-ignore
        const __VLS_57 = __VLS_asFunctionalComponent(__VLS_56, new __VLS_56({
            ...{ style: {} },
        }));
        const __VLS_58 = __VLS_57({
            ...{ style: {} },
        }, ...__VLS_functionalComponentArgsRest(__VLS_57));
        __VLS_59.slots.default;
        (button.icon);
        var __VLS_59;
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
        (button.text);
        var __VLS_51;
    }
}
else if (__VLS_ctx.user?.roles_fk === 3) {
    for (const [button, index] of __VLS_getVForSourceType((__VLS_ctx.retailbuttons))) {
        const __VLS_60 = {}.VBtn;
        /** @type {[typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ]} */ ;
        // @ts-ignore
        const __VLS_61 = __VLS_asFunctionalComponent(__VLS_60, new __VLS_60({
            ...{ 'onClick': {} },
            ...{ class: "mx-1" },
            rounded: true,
        }));
        const __VLS_62 = __VLS_61({
            ...{ 'onClick': {} },
            ...{ class: "mx-1" },
            rounded: true,
        }, ...__VLS_functionalComponentArgsRest(__VLS_61));
        let __VLS_64;
        let __VLS_65;
        let __VLS_66;
        const __VLS_67 = {
            onClick: (...[$event]) => {
                if (!!(__VLS_ctx.user?.roles_fk === 2))
                    return;
                if (!(__VLS_ctx.user?.roles_fk === 3))
                    return;
                __VLS_ctx.navigateTo(button.route);
            }
        };
        __VLS_63.slots.default;
        const __VLS_68 = {}.VIcon;
        /** @type {[typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, ]} */ ;
        // @ts-ignore
        const __VLS_69 = __VLS_asFunctionalComponent(__VLS_68, new __VLS_68({
            ...{ style: {} },
        }));
        const __VLS_70 = __VLS_69({
            ...{ style: {} },
        }, ...__VLS_functionalComponentArgsRest(__VLS_69));
        __VLS_71.slots.default;
        (button.icon);
        var __VLS_71;
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
        (button.text);
        var __VLS_63;
    }
}
var __VLS_47;
var __VLS_43;
var __VLS_39;
/** @type {__VLS_StyleScopedClasses['d-md-none']} */ ;
/** @type {__VLS_StyleScopedClasses['pa-4']} */ ;
/** @type {__VLS_StyleScopedClasses['mx-auto']} */ ;
/** @type {__VLS_StyleScopedClasses['py-4']} */ ;
/** @type {__VLS_StyleScopedClasses['px-6']} */ ;
/** @type {__VLS_StyleScopedClasses['d-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['py-2']} */ ;
/** @type {__VLS_StyleScopedClasses['d-none']} */ ;
/** @type {__VLS_StyleScopedClasses['d-md-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['mx-auto']} */ ;
/** @type {__VLS_StyleScopedClasses['py-4']} */ ;
/** @type {__VLS_StyleScopedClasses['px-6']} */ ;
/** @type {__VLS_StyleScopedClasses['d-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['py-2']} */ ;
/** @type {__VLS_StyleScopedClasses['mx-1']} */ ;
/** @type {__VLS_StyleScopedClasses['mx-1']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            user: user,
            retailbuttons: retailbuttons,
            usermobilebuttons: usermobilebuttons,
            retailmobilebuttons: retailmobilebuttons,
            userbuttons: userbuttons,
            navigateTo: navigateTo,
            logOut: logOut,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
