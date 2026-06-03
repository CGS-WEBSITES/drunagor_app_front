/// <reference types="../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import { ref, watch, computed } from "vue";
import { useI18n } from "vue-i18n";
import { sortBy } from "lodash-es";
const props = defineProps();
const emit = defineEmits(["clear", "selected", "stash"]);
const placeholder = "Select Bag Slot " + props.bagSlot;
const selectedId = ref(props.value);
const { t } = useI18n();
let items = computed(() => {
    let globalItems = [];
    props.categories.map((category) => {
        const translatedItems = category.items.map((item) => {
            return {
                ...item,
                name: t(item.translation_key),
            };
        });
        sortBy(translatedItems, ["name"]).map((sortedItem) => {
            globalItems.push(sortedItem);
        });
    });
    return globalItems;
});
function onStash() {
    emit("stash");
    selectedId.value = "";
}
watch(selectedId, (newSelectedId) => {
    emit("selected", newSelectedId);
});
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
// CSS variable injection 
// CSS variable injection end 
const __VLS_0 = {}.VAutocomplete;
/** @type {[typeof __VLS_components.VAutocomplete, typeof __VLS_components.vAutocomplete, typeof __VLS_components.VAutocomplete, typeof __VLS_components.vAutocomplete, ]} */ ;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
    ...{ 'onInput': {} },
    clearable: true,
    modelValue: (__VLS_ctx.selectedId),
    items: (__VLS_ctx.items),
    itemTitle: "name",
    itemValue: "id",
    label: (__VLS_ctx.placeholder),
    hint: (__VLS_ctx.$t('label.stash')),
    variant: "outlined",
}));
const __VLS_2 = __VLS_1({
    ...{ 'onInput': {} },
    clearable: true,
    modelValue: (__VLS_ctx.selectedId),
    items: (__VLS_ctx.items),
    itemTitle: "name",
    itemValue: "id",
    label: (__VLS_ctx.placeholder),
    hint: (__VLS_ctx.$t('label.stash')),
    variant: "outlined",
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
let __VLS_4;
let __VLS_5;
let __VLS_6;
const __VLS_7 = {
    onInput: (__VLS_ctx.onStash)
};
var __VLS_8 = {};
var __VLS_3;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            placeholder: placeholder,
            selectedId: selectedId,
            items: items,
            onStash: onStash,
        };
    },
    emits: {},
    __typeProps: {},
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
    emits: {},
    __typeProps: {},
});
; /* PartiallyEnd: #4569/main.vue */
