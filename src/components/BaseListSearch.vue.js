import InputGroup from "primevue/inputgroup";
import InputGroupAddon from "primevue/inputgroupaddon";
const { defineProps, defineSlots, defineEmits, defineExpose, defineModel, defineOptions, withDefaults, } = await import('vue');
const props = defineProps();
const emit = defineEmits();
function search(event) {
    const target = event.target;
    emit("search", target.value || "");
}
; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_fnComponent = (await import('vue')).defineComponent({
    __typeEmits: {},
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
    // CSS variable injection 
    // CSS variable injection end 
    let __VLS_resolvedLocalAndGlobalComponents;
    __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ id: ((props.id)), ...{ class: ((props.class)) }, });
    const __VLS_0 = __VLS_resolvedLocalAndGlobalComponents.InputGroup;
    /** @type { [typeof __VLS_components.InputGroup, typeof __VLS_components.InputGroup, ] } */
    // @ts-ignore
    const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({}));
    const __VLS_2 = __VLS_1({}, ...__VLS_functionalComponentArgsRest(__VLS_1));
    const __VLS_6 = __VLS_resolvedLocalAndGlobalComponents.InputText;
    /** @type { [typeof __VLS_components.InputText, ] } */
    // @ts-ignore
    const __VLS_7 = __VLS_asFunctionalComponent(__VLS_6, new __VLS_6({ ...{ 'onInput': {} }, placeholder: ("Search"), name: ("search"), value: ((props.value)), }));
    const __VLS_8 = __VLS_7({ ...{ 'onInput': {} }, placeholder: ("Search"), name: ("search"), value: ((props.value)), }, ...__VLS_functionalComponentArgsRest(__VLS_7));
    let __VLS_12;
    const __VLS_13 = {
        onInput: ((event) => __VLS_ctx.search(event))
    };
    let __VLS_9;
    let __VLS_10;
    var __VLS_11;
    const __VLS_14 = __VLS_resolvedLocalAndGlobalComponents.InputGroupAddon;
    /** @type { [typeof __VLS_components.InputGroupAddon, typeof __VLS_components.InputGroupAddon, ] } */
    // @ts-ignore
    const __VLS_15 = __VLS_asFunctionalComponent(__VLS_14, new __VLS_14({}));
    const __VLS_16 = __VLS_15({}, ...__VLS_functionalComponentArgsRest(__VLS_15));
    __VLS_elementAsFunction(__VLS_intrinsicElements.i, __VLS_intrinsicElements.i)({ ...{ class: ("pi pi-search") }, });
    __VLS_nonNullable(__VLS_19.slots).default;
    var __VLS_19;
    __VLS_nonNullable(__VLS_5.slots).default;
    var __VLS_5;
    var __VLS_20 = {};
    __VLS_styleScopedClasses['pi'];
    __VLS_styleScopedClasses['pi-search'];
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
        return {
            InputGroup: InputGroup,
            InputGroupAddon: InputGroupAddon,
            search: search,
        };
    },
    __typeEmits: {},
    __typeProps: {},
});
const __VLS_component = (await import('vue')).defineComponent({
    setup() {
        return {};
    },
    __typeEmits: {},
    __typeProps: {},
    __typeEl: {},
});
export default {};
; /* PartiallyEnd: #4569/main.vue */
