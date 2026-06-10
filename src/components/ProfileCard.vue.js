/// <reference types="../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import { inject, computed } from "vue";
import { useUserStore } from "@/store/UserStore";
const reloadKey = ref(0);
const user = computed(() => useUserStore().user); // Inicializa a store
const assets = inject("assets");
const formattedJoinDate = computed(() => {
    if (!user.value.join_date)
        return "Unknown";
    return new Date(user.value.join_date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "numeric",
        day: "numeric",
    });
});
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
// CSS variable injection 
// CSS variable injection end 
const __VLS_0 = {}.VCard;
/** @type {[typeof __VLS_components.VCard, typeof __VLS_components.vCard, typeof __VLS_components.VCard, typeof __VLS_components.vCard, ]} */ ;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
    color: "primary",
    ...{ class: "profile-card mx-auto py-0 mt-16 mt-md-0" },
    rounded: "0",
    elevation: "3",
    ...{ style: {} },
}));
const __VLS_2 = __VLS_1({
    color: "primary",
    ...{ class: "profile-card mx-auto py-0 mt-16 mt-md-0" },
    rounded: "0",
    elevation: "3",
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
var __VLS_4 = {};
__VLS_3.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "position-relative" },
});
const __VLS_5 = {}.VImg;
/** @type {[typeof __VLS_components.VImg, typeof __VLS_components.vImg, typeof __VLS_components.VImg, typeof __VLS_components.vImg, ]} */ ;
// @ts-ignore
const __VLS_6 = __VLS_asFunctionalComponent(__VLS_5, new __VLS_5({
    key: (__VLS_ctx.reloadKey),
    src: (__VLS_ctx.user.background_hash
        ? __VLS_ctx.assets + '/Profile/' + __VLS_ctx.user.background_hash
        : __VLS_ctx.assets + '/Profile/profile-bg-warriors-transparent.png'),
    alt: (__VLS_ctx.user.picture_hash),
    maxHeight: "529px",
    maxWidth: "100%",
    cover: true,
    position: "top center",
}));
const __VLS_7 = __VLS_6({
    key: (__VLS_ctx.reloadKey),
    src: (__VLS_ctx.user.background_hash
        ? __VLS_ctx.assets + '/Profile/' + __VLS_ctx.user.background_hash
        : __VLS_ctx.assets + '/Profile/profile-bg-warriors-transparent.png'),
    alt: (__VLS_ctx.user.picture_hash),
    maxHeight: "529px",
    maxWidth: "100%",
    cover: true,
    position: "top center",
}, ...__VLS_functionalComponentArgsRest(__VLS_6));
__VLS_8.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
    ...{ class: "user-join-date" },
    ...{ style: {} },
});
(__VLS_ctx.formattedJoinDate);
const __VLS_9 = {}.VBtn;
/** @type {[typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ]} */ ;
// @ts-ignore
const __VLS_10 = __VLS_asFunctionalComponent(__VLS_9, new __VLS_9({
    icon: true,
    ...{ class: "position-absolute bottom-0 right-0 ma-1" },
    color: "rgba(0, 0, 0, 0.6)",
    elevation: "3",
    rounded: "xl",
    size: "x-small",
}));
const __VLS_11 = __VLS_10({
    icon: true,
    ...{ class: "position-absolute bottom-0 right-0 ma-1" },
    color: "rgba(0, 0, 0, 0.6)",
    elevation: "3",
    rounded: "xl",
    size: "x-small",
}, ...__VLS_functionalComponentArgsRest(__VLS_10));
__VLS_12.slots.default;
const __VLS_13 = {}.VIcon;
/** @type {[typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, ]} */ ;
// @ts-ignore
const __VLS_14 = __VLS_asFunctionalComponent(__VLS_13, new __VLS_13({}));
const __VLS_15 = __VLS_14({}, ...__VLS_functionalComponentArgsRest(__VLS_14));
__VLS_16.slots.default;
var __VLS_16;
const __VLS_17 = {}.ProfileBackgroundDialog;
/** @type {[typeof __VLS_components.ProfileBackgroundDialog, typeof __VLS_components.profileBackgroundDialog, ]} */ ;
// @ts-ignore
const __VLS_18 = __VLS_asFunctionalComponent(__VLS_17, new __VLS_17({}));
const __VLS_19 = __VLS_18({}, ...__VLS_functionalComponentArgsRest(__VLS_18));
var __VLS_12;
var __VLS_8;
const __VLS_21 = {}.VImg;
/** @type {[typeof __VLS_components.VImg, typeof __VLS_components.vImg, typeof __VLS_components.VImg, typeof __VLS_components.vImg, ]} */ ;
// @ts-ignore
const __VLS_22 = __VLS_asFunctionalComponent(__VLS_21, new __VLS_21({
    key: (__VLS_ctx.reloadKey),
    src: (__VLS_ctx.user.picture_hash
        ? __VLS_ctx.assets + '/Profile/' + __VLS_ctx.user.picture_hash
        : __VLS_ctx.assets + '/Profile/user.png'),
    alt: (__VLS_ctx.user.picture_hash),
    maxWidth: "118",
    ...{ style: {} },
}));
const __VLS_23 = __VLS_22({
    key: (__VLS_ctx.reloadKey),
    src: (__VLS_ctx.user.picture_hash
        ? __VLS_ctx.assets + '/Profile/' + __VLS_ctx.user.picture_hash
        : __VLS_ctx.assets + '/Profile/user.png'),
    alt: (__VLS_ctx.user.picture_hash),
    maxWidth: "118",
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_22));
__VLS_24.slots.default;
const __VLS_25 = {}.VBtn;
/** @type {[typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ]} */ ;
// @ts-ignore
const __VLS_26 = __VLS_asFunctionalComponent(__VLS_25, new __VLS_25({
    icon: true,
    ...{ class: "position-absolute bottom-0 right-0 ma-1" },
    color: "rgba(0, 0, 0, 0.6)",
    elevation: "3",
    rounded: "xl",
    size: "x-small",
}));
const __VLS_27 = __VLS_26({
    icon: true,
    ...{ class: "position-absolute bottom-0 right-0 ma-1" },
    color: "rgba(0, 0, 0, 0.6)",
    elevation: "3",
    rounded: "xl",
    size: "x-small",
}, ...__VLS_functionalComponentArgsRest(__VLS_26));
__VLS_28.slots.default;
const __VLS_29 = {}.VIcon;
/** @type {[typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, ]} */ ;
// @ts-ignore
const __VLS_30 = __VLS_asFunctionalComponent(__VLS_29, new __VLS_29({}));
const __VLS_31 = __VLS_30({}, ...__VLS_functionalComponentArgsRest(__VLS_30));
__VLS_32.slots.default;
var __VLS_32;
const __VLS_33 = {}.ProfilePicDialog;
/** @type {[typeof __VLS_components.ProfilePicDialog, typeof __VLS_components.profilePicDialog, typeof __VLS_components.ProfilePicDialog, typeof __VLS_components.profilePicDialog, ]} */ ;
// @ts-ignore
const __VLS_34 = __VLS_asFunctionalComponent(__VLS_33, new __VLS_33({}));
const __VLS_35 = __VLS_34({}, ...__VLS_functionalComponentArgsRest(__VLS_34));
var __VLS_28;
var __VLS_24;
const __VLS_37 = {}.VCardText;
/** @type {[typeof __VLS_components.VCardText, typeof __VLS_components.vCardText, typeof __VLS_components.VCardText, typeof __VLS_components.vCardText, ]} */ ;
// @ts-ignore
const __VLS_38 = __VLS_asFunctionalComponent(__VLS_37, new __VLS_37({}));
const __VLS_39 = __VLS_38({}, ...__VLS_functionalComponentArgsRest(__VLS_38));
__VLS_40.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "user-info" },
    ...{ style: {} },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
    ...{ class: "user-name" },
    ...{ style: {} },
});
(__VLS_ctx.user.user_name);
var __VLS_40;
var __VLS_3;
/** @type {__VLS_StyleScopedClasses['profile-card']} */ ;
/** @type {__VLS_StyleScopedClasses['mx-auto']} */ ;
/** @type {__VLS_StyleScopedClasses['py-0']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-16']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-md-0']} */ ;
/** @type {__VLS_StyleScopedClasses['position-relative']} */ ;
/** @type {__VLS_StyleScopedClasses['user-join-date']} */ ;
/** @type {__VLS_StyleScopedClasses['position-absolute']} */ ;
/** @type {__VLS_StyleScopedClasses['bottom-0']} */ ;
/** @type {__VLS_StyleScopedClasses['right-0']} */ ;
/** @type {__VLS_StyleScopedClasses['ma-1']} */ ;
/** @type {__VLS_StyleScopedClasses['position-absolute']} */ ;
/** @type {__VLS_StyleScopedClasses['bottom-0']} */ ;
/** @type {__VLS_StyleScopedClasses['right-0']} */ ;
/** @type {__VLS_StyleScopedClasses['ma-1']} */ ;
/** @type {__VLS_StyleScopedClasses['user-info']} */ ;
/** @type {__VLS_StyleScopedClasses['user-name']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            reloadKey: reloadKey,
            user: user,
            assets: assets,
            formattedJoinDate: formattedJoinDate,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
