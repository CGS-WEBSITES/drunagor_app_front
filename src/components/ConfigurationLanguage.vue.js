/// <reference types="../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import { setLanguage, loadLanguage } from "@/language";
import { LanguageStore } from "@/store/LanguageStore";
import { watch } from "vue";
import { useI18n } from "vue-i18n";
const languageStore = LanguageStore();
const { locale } = useI18n();
watch(locale, () => {
    setLanguage(locale.value);
    loadLanguage(locale.value);
});
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
// CSS variable injection 
// CSS variable injection end 
const __VLS_0 = {}.Card;
/** @type {[typeof __VLS_components.Card, typeof __VLS_components.Card, ]} */ ;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
    ...{ class: "w-full" },
    dataTestid: "configuration-language",
}));
const __VLS_2 = __VLS_1({
    ...{ class: "w-full" },
    dataTestid: "configuration-language",
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
var __VLS_4 = {};
__VLS_3.slots.default;
{
    const { title: __VLS_thisSlot } = __VLS_3.slots;
    (__VLS_ctx.$t("configuration.language"));
}
{
    const { content: __VLS_thisSlot } = __VLS_3.slots;
    for (const [language] of __VLS_getVForSourceType((__VLS_ctx.languageStore.getAll()))) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            key: (language.locale),
            ...{ class: "pb-4" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({
            ...{ class: "cursor-pointer" },
        });
        (__VLS_ctx.$t(language.translation_key));
        const __VLS_5 = {}.RadioButton;
        /** @type {[typeof __VLS_components.RadioButton, ]} */ ;
        // @ts-ignore
        const __VLS_6 = __VLS_asFunctionalComponent(__VLS_5, new __VLS_5({
            variant: "outlined",
            modelValue: (__VLS_ctx.$i18n.locale),
            dataTestid: ('configuration-language-' + language.locale),
            value: (language.locale),
            ...{ class: "float-right" },
        }));
        const __VLS_7 = __VLS_6({
            variant: "outlined",
            modelValue: (__VLS_ctx.$i18n.locale),
            dataTestid: ('configuration-language-' + language.locale),
            value: (language.locale),
            ...{ class: "float-right" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_6));
    }
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.a, __VLS_intrinsicElements.a)({
        target: "_blank",
        ...{ class: "underline" },
        href: "https://github.com/marcojanssen/drunagor-helper/blob/main/CONTRIBUTING.md",
    });
}
var __VLS_3;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['pb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['cursor-pointer']} */ ;
/** @type {__VLS_StyleScopedClasses['float-right']} */ ;
/** @type {__VLS_StyleScopedClasses['underline']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            languageStore: languageStore,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
