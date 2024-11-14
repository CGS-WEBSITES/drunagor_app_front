import { ref, computed } from "vue";
import { useRoute } from "vue-router";
import { KeywordDataRepository } from "@/data/repository/KeywordDataRepository";
import BaseListSearch from "@/components/BaseListSearch.vue";
import { marked } from "marked";
import { ConfigurationStore } from "@/store/ConfigurationStore";
import { useI18n } from "vue-i18n";
import Card from "primevue/card";
import Accordion from "primevue/accordion";
import AccordionTab from "primevue/accordiontab";
const { defineProps, defineSlots, defineEmits, defineExpose, defineModel, defineOptions, withDefaults, } = await import('vue');
const { t } = useI18n();
const route = useRoute();
const keywordDataRepository = new KeywordDataRepository();
const configurationStore = ConfigurationStore();
keywordDataRepository.load(configurationStore.enabledLanguage);
const keywords = keywordDataRepository.findAll();
let preselectedKeyword = "";
let preselectedKeywordId = "";
if (route.hash) {
    preselectedKeywordId = route.hash.toString().replace(/[#]/g, "");
    preselectedKeyword = preselectedKeywordId.replace(/[-]/g, " ");
}
let filteredKeyword = computed(() => query.value === ""
    ? keywords
    : keywords.filter((keyword) => keyword.keyword
        .toLowerCase()
        .replace(/\s+/g, "")
        .includes(query.value.toLowerCase().replace(/\s+/g, ""))));
let query = ref("");
query.value = preselectedKeyword;
; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_fnComponent = (await import('vue')).defineComponent({});
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
    __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ ...{ class: ("grid place-items-center w-full") }, });
    const __VLS_0 = __VLS_resolvedLocalAndGlobalComponents.Card;
    /** @type { [typeof __VLS_components.Card, typeof __VLS_components.Card, ] } */
    // @ts-ignore
    const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({ ...{ class: ("w-full sticky top-16 z-10 mb-3") }, }));
    const __VLS_2 = __VLS_1({ ...{ class: ("w-full sticky top-16 z-10 mb-3") }, }, ...__VLS_functionalComponentArgsRest(__VLS_1));
    __VLS_elementAsFunction(__VLS_intrinsicElements.template, __VLS_intrinsicElements.template)({});
    {
        const { title: __VLS_thisSlot } = __VLS_nonNullable(__VLS_5.slots);
        (__VLS_ctx.t("menu.keyword"));
    }
    __VLS_elementAsFunction(__VLS_intrinsicElements.template, __VLS_intrinsicElements.template)({});
    {
        const { content: __VLS_thisSlot } = __VLS_nonNullable(__VLS_5.slots);
        // @ts-ignore
        [BaseListSearch,];
        // @ts-ignore
        const __VLS_6 = __VLS_asFunctionalComponent(BaseListSearch, new BaseListSearch({ ...{ 'onSearch': {} }, id: ("keyword-search"), value: ((__VLS_ctx.query)), }));
        const __VLS_7 = __VLS_6({ ...{ 'onSearch': {} }, id: ("keyword-search"), value: ((__VLS_ctx.query)), }, ...__VLS_functionalComponentArgsRest(__VLS_6));
        let __VLS_11;
        const __VLS_12 = {
            onSearch: (...[$event]) => {
                __VLS_ctx.query = $event;
            }
        };
        let __VLS_8;
        let __VLS_9;
        var __VLS_10;
    }
    var __VLS_5;
    const __VLS_13 = __VLS_resolvedLocalAndGlobalComponents.Accordion;
    /** @type { [typeof __VLS_components.Accordion, typeof __VLS_components.Accordion, ] } */
    // @ts-ignore
    const __VLS_14 = __VLS_asFunctionalComponent(__VLS_13, new __VLS_13({ id: ("keyword-list"), ...{ class: ("w-full") }, }));
    const __VLS_15 = __VLS_14({ id: ("keyword-list"), ...{ class: ("w-full") }, }, ...__VLS_functionalComponentArgsRest(__VLS_14));
    for (const [keyword] of __VLS_getVForSourceType((__VLS_ctx.filteredKeyword))) {
        const __VLS_19 = __VLS_resolvedLocalAndGlobalComponents.AccordionTab;
        /** @type { [typeof __VLS_components.AccordionTab, typeof __VLS_components.AccordionTab, ] } */
        // @ts-ignore
        const __VLS_20 = __VLS_asFunctionalComponent(__VLS_19, new __VLS_19({ header: ((keyword.keyword)), }));
        const __VLS_21 = __VLS_20({ header: ((keyword.keyword)), }, ...__VLS_functionalComponentArgsRest(__VLS_20));
        __VLS_elementAsFunction(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
        __VLS_asFunctionalDirective(__VLS_directives.vHtml)(null, { ...__VLS_directiveBindingRestFields, modifiers: {}, value: (__VLS_ctx.marked.parse(keyword.description)) }, null, null);
        __VLS_nonNullable(__VLS_24.slots).default;
        var __VLS_24;
    }
    __VLS_nonNullable(__VLS_18.slots).default;
    var __VLS_18;
    __VLS_styleScopedClasses['grid'];
    __VLS_styleScopedClasses['place-items-center'];
    __VLS_styleScopedClasses['w-full'];
    __VLS_styleScopedClasses['w-full'];
    __VLS_styleScopedClasses['sticky'];
    __VLS_styleScopedClasses['top-16'];
    __VLS_styleScopedClasses['z-10'];
    __VLS_styleScopedClasses['mb-3'];
    __VLS_styleScopedClasses['w-full'];
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
            BaseListSearch: BaseListSearch,
            marked: marked,
            Card: Card,
            Accordion: Accordion,
            AccordionTab: AccordionTab,
            t: t,
            filteredKeyword: filteredKeyword,
            query: query,
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
