/// <reference types="../../node_modules/.vue-global-types/vue_3.5_false.d.ts" />
import { reactive, ref } from "vue";
const isExpanded = ref(false);
const togglePrivacy = () => {
    isExpanded.value = !isExpanded.value;
};
const privacy = reactive({
    profileVisibility: "Public",
    friendRequests: "Allow all",
    showAccountCreationDate: true,
    showRealName: false,
    showPoints: true,
    showRank: true,
    showStatistics: false,
});
const profileVisibilityOptions = ["Public", "Private", "Friends only"];
const friendRequestOptions = ["Allow all", "Friends only", "No one"];
const switches = [
    {
        key: "showAccountCreationDate",
        label: "Show account creation date to other users",
    },
    { key: "showRealName", label: "Show real name to other users" },
    { key: "showPoints", label: "Show your [POINTS NAME] to other users" },
    { key: "showRank", label: "Show your rank to other users" },
    { key: "showStatistics", label: "Show your statistics to other users" },
];
; /* PartiallyEnd: #3632/scriptSetup.vue */
function __VLS_template() {
    const __VLS_ctx = {};
    let __VLS_components;
    let __VLS_directives;
    const __VLS_0 = {}.VCol;
    /** @type { [typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ] } */ ;
    // @ts-ignore
    const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
        cols: ("12"),
        ...{ class: ("d-flex justify-center pa-0") },
    }));
    const __VLS_2 = __VLS_1({
        cols: ("12"),
        ...{ class: ("d-flex justify-center pa-0") },
    }, ...__VLS_functionalComponentArgsRest(__VLS_1));
    var __VLS_6 = {};
    const __VLS_7 = {}.VContainer;
    /** @type { [typeof __VLS_components.VContainer, typeof __VLS_components.vContainer, typeof __VLS_components.VContainer, typeof __VLS_components.vContainer, ] } */ ;
    // @ts-ignore
    const __VLS_8 = __VLS_asFunctionalComponent(__VLS_7, new __VLS_7({
        maxWidth: ("804"),
        ...{ class: ("py-4") },
    }));
    const __VLS_9 = __VLS_8({
        maxWidth: ("804"),
        ...{ class: ("py-4") },
    }, ...__VLS_functionalComponentArgsRest(__VLS_8));
    const __VLS_13 = {}.VCard;
    /** @type { [typeof __VLS_components.VCard, typeof __VLS_components.vCard, typeof __VLS_components.VCard, typeof __VLS_components.vCard, ] } */ ;
    // @ts-ignore
    const __VLS_14 = __VLS_asFunctionalComponent(__VLS_13, new __VLS_13({
        color: ("primary"),
        elevation: ("2"),
        rounded: ("lg"),
    }));
    const __VLS_15 = __VLS_14({
        color: ("primary"),
        elevation: ("2"),
        rounded: ("lg"),
    }, ...__VLS_functionalComponentArgsRest(__VLS_14));
    const __VLS_19 = {}.VCardTitle;
    /** @type { [typeof __VLS_components.VCardTitle, typeof __VLS_components.vCardTitle, typeof __VLS_components.VCardTitle, typeof __VLS_components.vCardTitle, ] } */ ;
    // @ts-ignore
    const __VLS_20 = __VLS_asFunctionalComponent(__VLS_19, new __VLS_19({
        ...{ 'onClick': {} },
        ...{ class: ("d-flex justify-space-between align-center") },
    }));
    const __VLS_21 = __VLS_20({
        ...{ 'onClick': {} },
        ...{ class: ("d-flex justify-space-between align-center") },
    }, ...__VLS_functionalComponentArgsRest(__VLS_20));
    let __VLS_25;
    const __VLS_26 = {
        onClick: (__VLS_ctx.togglePrivacy)
    };
    let __VLS_22;
    let __VLS_23;
    __VLS_elementAsFunction(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: ("text-h5 font-weight-black pl-2 pt-2 pb-2 text-wrap text-uppercase") },
    });
    const __VLS_27 = {}.VIcon;
    /** @type { [typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, ] } */ ;
    // @ts-ignore
    const __VLS_28 = __VLS_asFunctionalComponent(__VLS_27, new __VLS_27({}));
    const __VLS_29 = __VLS_28({}, ...__VLS_functionalComponentArgsRest(__VLS_28));
    (__VLS_ctx.isExpanded ? "mdi-chevron-up" : "mdi-chevron-down");
    __VLS_32.slots.default;
    var __VLS_32;
    __VLS_24.slots.default;
    var __VLS_24;
    const __VLS_33 = {}.VExpandTransition;
    /** @type { [typeof __VLS_components.VExpandTransition, typeof __VLS_components.vExpandTransition, typeof __VLS_components.VExpandTransition, typeof __VLS_components.vExpandTransition, ] } */ ;
    // @ts-ignore
    const __VLS_34 = __VLS_asFunctionalComponent(__VLS_33, new __VLS_33({}));
    const __VLS_35 = __VLS_34({}, ...__VLS_functionalComponentArgsRest(__VLS_34));
    if (__VLS_ctx.isExpanded) {
        const __VLS_39 = {}.VCardText;
        /** @type { [typeof __VLS_components.VCardText, typeof __VLS_components.vCardText, typeof __VLS_components.VCardText, typeof __VLS_components.vCardText, ] } */ ;
        // @ts-ignore
        const __VLS_40 = __VLS_asFunctionalComponent(__VLS_39, new __VLS_39({}));
        const __VLS_41 = __VLS_40({}, ...__VLS_functionalComponentArgsRest(__VLS_40));
        const __VLS_45 = {}.VRow;
        /** @type { [typeof __VLS_components.VRow, typeof __VLS_components.vRow, typeof __VLS_components.VRow, typeof __VLS_components.vRow, ] } */ ;
        // @ts-ignore
        const __VLS_46 = __VLS_asFunctionalComponent(__VLS_45, new __VLS_45({
            noGutters: (true),
        }));
        const __VLS_47 = __VLS_46({
            noGutters: (true),
        }, ...__VLS_functionalComponentArgsRest(__VLS_46));
        const __VLS_51 = {}.VCols;
        /** @type { [typeof __VLS_components.VCols, typeof __VLS_components.vCols, typeof __VLS_components.VCols, typeof __VLS_components.vCols, ] } */ ;
        // @ts-ignore
        const __VLS_52 = __VLS_asFunctionalComponent(__VLS_51, new __VLS_51({
            cols: (true),
        }));
        const __VLS_53 = __VLS_52({
            cols: (true),
        }, ...__VLS_functionalComponentArgsRest(__VLS_52));
        __VLS_50.slots.default;
        var __VLS_50;
        __VLS_elementAsFunction(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({});
        __VLS_elementAsFunction(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({});
        __VLS_elementAsFunction(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({});
        __VLS_44.slots.default;
        var __VLS_44;
    }
    __VLS_38.slots.default;
    var __VLS_38;
    __VLS_18.slots.default;
    var __VLS_18;
    __VLS_12.slots.default;
    var __VLS_12;
    __VLS_5.slots.default;
    var __VLS_5;
    ['d-flex', 'justify-center', 'pa-0', 'py-4', 'd-flex', 'justify-space-between', 'align-center', 'text-h5', 'font-weight-black', 'pl-2', 'pt-2', 'pb-2', 'text-wrap', 'text-uppercase',];
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
            isExpanded: isExpanded,
            togglePrivacy: togglePrivacy,
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
