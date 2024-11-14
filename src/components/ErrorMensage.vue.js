const { defineProps, defineSlots, defineEmits, defineExpose, defineModel, defineOptions, withDefaults, } = await import('vue');
const props = defineProps({
    summary: String,
    detail: Error,
    life: Number,
});
; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_fnComponent = (await import('vue')).defineComponent({
    props: {
        summary: String,
        detail: Error,
        life: Number,
    },
});
;
let __VLS_functionalComponentProps;
function __VLS_template() {
    const __VLS_ctx = {};
    const __VLS_localComponents = {
        ...{},
        ...{},
        ...__VLS_ctx,
    };
    let __VLS_components;
    const __VLS_localDirectives = {
        ...{},
        ...__VLS_ctx,
    };
    let __VLS_directives;
    let __VLS_styleScopedClasses;
    let __VLS_resolvedLocalAndGlobalComponents;
    const __VLS_0 = __VLS_resolvedLocalAndGlobalComponents.VSnackbar;
    /** @type { [typeof __VLS_components.VSnackbar, typeof __VLS_components.vSnackbar, typeof __VLS_components.VSnackbar, typeof __VLS_components.vSnackbar, ] } */
    // @ts-ignore
    const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({ modelValue: ((props)), timeout: ((__VLS_ctx.timeout)), }));
    const __VLS_2 = __VLS_1({ modelValue: ((props)), timeout: ((__VLS_ctx.timeout)), }, ...__VLS_functionalComponentArgsRest(__VLS_1));
    var __VLS_6 = {};
    (__VLS_ctx.text);
    __VLS_elementAsFunction(__VLS_intrinsicElements.template, __VLS_intrinsicElements.template)({});
    {
        const { actions: __VLS_thisSlot } = __VLS_nonNullable(__VLS_5.slots);
        const __VLS_7 = __VLS_resolvedLocalAndGlobalComponents.VBtn;
        /** @type { [typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ] } */
        // @ts-ignore
        const __VLS_8 = __VLS_asFunctionalComponent(__VLS_7, new __VLS_7({ ...{ 'onClick': {} }, color: ("blue"), variant: ("text"), }));
        const __VLS_9 = __VLS_8({ ...{ 'onClick': {} }, color: ("blue"), variant: ("text"), }, ...__VLS_functionalComponentArgsRest(__VLS_8));
        let __VLS_13;
        const __VLS_14 = {
            onClick: (...[$event]) => {
                __VLS_ctx.snackbar = false;
            }
        };
        let __VLS_10;
        let __VLS_11;
        __VLS_nonNullable(__VLS_12.slots).default;
        var __VLS_12;
    }
    var __VLS_5;
    var __VLS_slots;
    var __VLS_inheritedAttrs;
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
        return {};
    },
    props: {
        summary: String,
        detail: Error,
        life: Number,
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
    props: {
        summary: String,
        detail: Error,
        life: Number,
    },
    __typeEl: {},
});
; /* PartiallyEnd: #4569/main.vue */
