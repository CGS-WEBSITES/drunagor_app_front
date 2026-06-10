/// <reference types="../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
const props = defineProps({
    summary: String,
    detail: Error,
    life: Number,
});
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
const __VLS_0 = {}.VSnackbar;
/** @type {[typeof __VLS_components.VSnackbar, typeof __VLS_components.vSnackbar, typeof __VLS_components.VSnackbar, typeof __VLS_components.vSnackbar, ]} */ ;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
    modelValue: (props),
    timeout: (__VLS_ctx.timeout),
}));
const __VLS_2 = __VLS_1({
    modelValue: (props),
    timeout: (__VLS_ctx.timeout),
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
var __VLS_4 = {};
__VLS_3.slots.default;
(__VLS_ctx.text);
{
    const { actions: __VLS_thisSlot } = __VLS_3.slots;
    const __VLS_5 = {}.VBtn;
    /** @type {[typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ]} */ ;
    // @ts-ignore
    const __VLS_6 = __VLS_asFunctionalComponent(__VLS_5, new __VLS_5({
        ...{ 'onClick': {} },
        color: "blue",
        variant: "text",
    }));
    const __VLS_7 = __VLS_6({
        ...{ 'onClick': {} },
        color: "blue",
        variant: "text",
    }, ...__VLS_functionalComponentArgsRest(__VLS_6));
    let __VLS_9;
    let __VLS_10;
    let __VLS_11;
    const __VLS_12 = {
        onClick: (...[$event]) => {
            __VLS_ctx.snackbar = false;
        }
    };
    __VLS_8.slots.default;
    var __VLS_8;
}
var __VLS_3;
var __VLS_dollars;
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
});
; /* PartiallyEnd: #4569/main.vue */
