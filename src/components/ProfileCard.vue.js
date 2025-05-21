/// <reference types="../../node_modules/.vue-global-types/vue_3.5_false.d.ts" />
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
    var __VLS_6 = {};
    __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: ("position-relative") },
    });
    const __VLS_7 = {}.VImg;
    /** @type { [typeof __VLS_components.VImg, typeof __VLS_components.vImg, typeof __VLS_components.VImg, typeof __VLS_components.vImg, ] } */ ;
    // @ts-ignore
    const __VLS_8 = __VLS_asFunctionalComponent(__VLS_7, new __VLS_7({
        key: ((__VLS_ctx.reloadKey)),
        src: ((__VLS_ctx.user.background_hash
            ? __VLS_ctx.assets + '/Profile/' + __VLS_ctx.user.background_hash
            : __VLS_ctx.assets + '/Profile/profile-bg-warriors-transparent.png')),
        alt: ((__VLS_ctx.user.picture_hash)),
        maxHeight: ("529px"),
        maxWidth: ("100%"),
        cover: (true),
    }));
    const __VLS_9 = __VLS_8({
        key: ((__VLS_ctx.reloadKey)),
        src: ((__VLS_ctx.user.background_hash
            ? __VLS_ctx.assets + '/Profile/' + __VLS_ctx.user.background_hash
            : __VLS_ctx.assets + '/Profile/profile-bg-warriors-transparent.png')),
        alt: ((__VLS_ctx.user.picture_hash)),
        maxHeight: ("529px"),
        maxWidth: ("100%"),
        cover: (true),
    }, ...__VLS_functionalComponentArgsRest(__VLS_8));
    __VLS_elementAsFunction(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
        ...{ class: ("user-join-date") },
        ...{ style: ({}) },
    });
    (__VLS_ctx.formattedJoinDate);
    const __VLS_13 = {}.VBtn;
    /** @type { [typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ] } */ ;
    // @ts-ignore
    const __VLS_14 = __VLS_asFunctionalComponent(__VLS_13, new __VLS_13({
        icon: (true),
        ...{ class: ("position-absolute bottom-0 right-0 ma-1") },
        color: ("rgba(0, 0, 0, 0.6)"),
        elevation: ("3"),
        rounded: ("xl"),
        size: ("x-small"),
    }));
    const __VLS_15 = __VLS_14({
        icon: (true),
        ...{ class: ("position-absolute bottom-0 right-0 ma-1") },
        color: ("rgba(0, 0, 0, 0.6)"),
        elevation: ("3"),
        rounded: ("xl"),
        size: ("x-small"),
    }, ...__VLS_functionalComponentArgsRest(__VLS_14));
    const __VLS_19 = {}.VIcon;
    /** @type { [typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, ] } */ ;
    // @ts-ignore
    const __VLS_20 = __VLS_asFunctionalComponent(__VLS_19, new __VLS_19({}));
    const __VLS_21 = __VLS_20({}, ...__VLS_functionalComponentArgsRest(__VLS_20));
    __VLS_24.slots.default;
    var __VLS_24;
    const __VLS_25 = {}.ProfileBackgroundDialog;
    /** @type { [typeof __VLS_components.ProfileBackgroundDialog, typeof __VLS_components.profileBackgroundDialog, ] } */ ;
    // @ts-ignore
    const __VLS_26 = __VLS_asFunctionalComponent(__VLS_25, new __VLS_25({}));
    const __VLS_27 = __VLS_26({}, ...__VLS_functionalComponentArgsRest(__VLS_26));
    __VLS_18.slots.default;
    var __VLS_18;
    __VLS_12.slots.default;
    var __VLS_12;
    const __VLS_31 = {}.VImg;
    /** @type { [typeof __VLS_components.VImg, typeof __VLS_components.vImg, typeof __VLS_components.VImg, typeof __VLS_components.vImg, ] } */ ;
    // @ts-ignore
    const __VLS_32 = __VLS_asFunctionalComponent(__VLS_31, new __VLS_31({
        key: ((__VLS_ctx.reloadKey)),
        src: ((__VLS_ctx.user.picture_hash
            ? __VLS_ctx.assets + '/Profile/' + __VLS_ctx.user.picture_hash
            : __VLS_ctx.assets + '/Profile/user.png')),
        alt: ((__VLS_ctx.user.picture_hash)),
        maxWidth: ("118"),
        ...{ style: ({}) },
    }));
    const __VLS_33 = __VLS_32({
        key: ((__VLS_ctx.reloadKey)),
        src: ((__VLS_ctx.user.picture_hash
            ? __VLS_ctx.assets + '/Profile/' + __VLS_ctx.user.picture_hash
            : __VLS_ctx.assets + '/Profile/user.png')),
        alt: ((__VLS_ctx.user.picture_hash)),
        maxWidth: ("118"),
        ...{ style: ({}) },
    }, ...__VLS_functionalComponentArgsRest(__VLS_32));
    const __VLS_37 = {}.VBtn;
    /** @type { [typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ] } */ ;
    // @ts-ignore
    const __VLS_38 = __VLS_asFunctionalComponent(__VLS_37, new __VLS_37({
        icon: (true),
        ...{ class: ("position-absolute bottom-0 right-0 ma-1") },
        color: ("rgba(0, 0, 0, 0.6)"),
        elevation: ("3"),
        rounded: ("xl"),
        size: ("x-small"),
    }));
    const __VLS_39 = __VLS_38({
        icon: (true),
        ...{ class: ("position-absolute bottom-0 right-0 ma-1") },
        color: ("rgba(0, 0, 0, 0.6)"),
        elevation: ("3"),
        rounded: ("xl"),
        size: ("x-small"),
    }, ...__VLS_functionalComponentArgsRest(__VLS_38));
    const __VLS_43 = {}.VIcon;
    /** @type { [typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, ] } */ ;
    // @ts-ignore
    const __VLS_44 = __VLS_asFunctionalComponent(__VLS_43, new __VLS_43({}));
    const __VLS_45 = __VLS_44({}, ...__VLS_functionalComponentArgsRest(__VLS_44));
    __VLS_48.slots.default;
    var __VLS_48;
    const __VLS_49 = {}.ProfilePicDialog;
    /** @type { [typeof __VLS_components.ProfilePicDialog, typeof __VLS_components.profilePicDialog, typeof __VLS_components.ProfilePicDialog, typeof __VLS_components.profilePicDialog, ] } */ ;
    // @ts-ignore
    const __VLS_50 = __VLS_asFunctionalComponent(__VLS_49, new __VLS_49({}));
    const __VLS_51 = __VLS_50({}, ...__VLS_functionalComponentArgsRest(__VLS_50));
    __VLS_42.slots.default;
    var __VLS_42;
    __VLS_36.slots.default;
    var __VLS_36;
    const __VLS_55 = {}.VCardText;
    /** @type { [typeof __VLS_components.VCardText, typeof __VLS_components.vCardText, typeof __VLS_components.VCardText, typeof __VLS_components.vCardText, ] } */ ;
    // @ts-ignore
    const __VLS_56 = __VLS_asFunctionalComponent(__VLS_55, new __VLS_55({}));
    const __VLS_57 = __VLS_56({}, ...__VLS_functionalComponentArgsRest(__VLS_56));
    __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: ("user-info") },
        ...{ style: ({}) },
    });
    __VLS_elementAsFunction(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
        ...{ class: ("user-name") },
        ...{ style: ({}) },
    });
    (__VLS_ctx.user.user_name);
    __VLS_60.slots.default;
    var __VLS_60;
    __VLS_5.slots.default;
    var __VLS_5;
    ['profile-card', 'mx-auto', 'py-0', 'position-relative', 'user-join-date', 'position-absolute', 'bottom-0', 'right-0', 'ma-1', 'position-absolute', 'bottom-0', 'right-0', 'ma-1', 'user-info', 'user-name',];
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
    __typeEl: {},
});
; /* PartiallyEnd: #4569/main.vue */
