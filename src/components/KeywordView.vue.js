/// <reference types="../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import { ref, computed } from "vue";
import { useRoute } from "vue-router";
import { KeywordDataRepository } from "@/data/repository/KeywordDataRepository";
import BaseListSearch from "@/components/BaseListSearch.vue";
import { ConfigurationStore } from "@/store/ConfigurationStore";
import { useI18n } from "vue-i18n";
const { t } = useI18n();
const route = useRoute();
const keywordDataRepository = new KeywordDataRepository();
const configurationStore = ConfigurationStore();
keywordDataRepository.load(configurationStore.enabledLanguage);
const keywords = keywordDataRepository.findAll();
let query = ref("");
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
query.value = preselectedKeyword;
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "grid place-items-center w-full" },
});
const __VLS_0 = {}.VContainer;
/** @type {[typeof __VLS_components.VContainer, typeof __VLS_components.vContainer, typeof __VLS_components.VContainer, typeof __VLS_components.vContainer, ]} */ ;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
    maxWidth: "680",
}));
const __VLS_2 = __VLS_1({
    maxWidth: "680",
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
__VLS_3.slots.default;
const __VLS_4 = {}.VCard;
/** @type {[typeof __VLS_components.VCard, typeof __VLS_components.vCard, typeof __VLS_components.VCard, typeof __VLS_components.vCard, ]} */ ;
// @ts-ignore
const __VLS_5 = __VLS_asFunctionalComponent(__VLS_4, new __VLS_4({
    color: "primary",
    ...{ class: "pa-1" },
}));
const __VLS_6 = __VLS_5({
    color: "primary",
    ...{ class: "pa-1" },
}, ...__VLS_functionalComponentArgsRest(__VLS_5));
__VLS_7.slots.default;
const __VLS_8 = {}.VCardTitle;
/** @type {[typeof __VLS_components.VCardTitle, typeof __VLS_components.vCardTitle, typeof __VLS_components.VCardTitle, typeof __VLS_components.vCardTitle, ]} */ ;
// @ts-ignore
const __VLS_9 = __VLS_asFunctionalComponent(__VLS_8, new __VLS_8({}));
const __VLS_10 = __VLS_9({}, ...__VLS_functionalComponentArgsRest(__VLS_9));
__VLS_11.slots.default;
(__VLS_ctx.t("menu.keyword"));
var __VLS_11;
const __VLS_12 = {}.VCardActions;
/** @type {[typeof __VLS_components.VCardActions, typeof __VLS_components.vCardActions, typeof __VLS_components.VCardActions, typeof __VLS_components.vCardActions, ]} */ ;
// @ts-ignore
const __VLS_13 = __VLS_asFunctionalComponent(__VLS_12, new __VLS_12({}));
const __VLS_14 = __VLS_13({}, ...__VLS_functionalComponentArgsRest(__VLS_13));
__VLS_15.slots.default;
/** @type {[typeof BaseListSearch, ]} */ ;
// @ts-ignore
const __VLS_16 = __VLS_asFunctionalComponent(BaseListSearch, new BaseListSearch({
    ...{ 'onSearch': {} },
    id: "keyword-search",
    value: (__VLS_ctx.query),
}));
const __VLS_17 = __VLS_16({
    ...{ 'onSearch': {} },
    id: "keyword-search",
    value: (__VLS_ctx.query),
}, ...__VLS_functionalComponentArgsRest(__VLS_16));
let __VLS_19;
let __VLS_20;
let __VLS_21;
const __VLS_22 = {
    onSearch: (...[$event]) => {
        __VLS_ctx.query = $event;
    }
};
var __VLS_18;
var __VLS_15;
const __VLS_23 = {}.VCardText;
/** @type {[typeof __VLS_components.VCardText, typeof __VLS_components.vCardText, typeof __VLS_components.VCardText, typeof __VLS_components.vCardText, ]} */ ;
// @ts-ignore
const __VLS_24 = __VLS_asFunctionalComponent(__VLS_23, new __VLS_23({}));
const __VLS_25 = __VLS_24({}, ...__VLS_functionalComponentArgsRest(__VLS_24));
__VLS_26.slots.default;
const __VLS_27 = {}.VExpansionPanels;
/** @type {[typeof __VLS_components.VExpansionPanels, typeof __VLS_components.vExpansionPanels, typeof __VLS_components.VExpansionPanels, typeof __VLS_components.vExpansionPanels, ]} */ ;
// @ts-ignore
const __VLS_28 = __VLS_asFunctionalComponent(__VLS_27, new __VLS_27({}));
const __VLS_29 = __VLS_28({}, ...__VLS_functionalComponentArgsRest(__VLS_28));
__VLS_30.slots.default;
for (const [keyword] of __VLS_getVForSourceType((__VLS_ctx.filteredKeyword))) {
    const __VLS_31 = {}.VExpansionPanel;
    /** @type {[typeof __VLS_components.VExpansionPanel, typeof __VLS_components.vExpansionPanel, typeof __VLS_components.VExpansionPanel, typeof __VLS_components.vExpansionPanel, ]} */ ;
    // @ts-ignore
    const __VLS_32 = __VLS_asFunctionalComponent(__VLS_31, new __VLS_31({
        key: (keyword.id),
        color: "background",
        ...{ class: "my-2" },
    }));
    const __VLS_33 = __VLS_32({
        key: (keyword.id),
        color: "background",
        ...{ class: "my-2" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_32));
    __VLS_34.slots.default;
    {
        const { title: __VLS_thisSlot } = __VLS_34.slots;
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "d-flex align-center gap-2" },
        });
        if (keyword.icon) {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.img)({
                src: (keyword.icon),
                alt: "icon",
                ...{ style: {} },
            });
        }
        (keyword.keyword);
    }
    {
        const { text: __VLS_thisSlot } = __VLS_34.slots;
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
        __VLS_asFunctionalDirective(__VLS_directives.vHtml)(null, { ...__VLS_directiveBindingRestFields, value: (keyword.description) }, null, null);
        if (keyword.icon) {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: "d-flex justify-center align-center mt-2" },
            });
            __VLS_asFunctionalElement(__VLS_intrinsicElements.img)({
                src: (keyword.icon),
                alt: "icon",
                ...{ style: {} },
            });
        }
    }
    var __VLS_34;
}
var __VLS_30;
var __VLS_26;
var __VLS_7;
var __VLS_3;
/** @type {__VLS_StyleScopedClasses['grid']} */ ;
/** @type {__VLS_StyleScopedClasses['place-items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['pa-1']} */ ;
/** @type {__VLS_StyleScopedClasses['my-2']} */ ;
/** @type {__VLS_StyleScopedClasses['d-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['align-center']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
/** @type {__VLS_StyleScopedClasses['d-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['align-center']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-2']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            BaseListSearch: BaseListSearch,
            t: t,
            query: query,
            filteredKeyword: filteredKeyword,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
