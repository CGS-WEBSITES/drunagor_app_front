/// <reference types="../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import { ContentDataStore } from "@/data/store/ContentDataStore";
import { ConfigurationStore } from "@/store/ConfigurationStore";
import { watch, ref } from "vue";
import { useToast } from "primevue/usetoast";
import { useI18n } from "vue-i18n";
const props = withDefaults(defineProps(), {
    noCard: false,
});
const toast = useToast();
const { t } = useI18n();
const contentStore = ContentDataStore();
const configurationStore = ConfigurationStore();
const heroContentSettings = ref([]);
configurationStore.enabledHeroContent.forEach((enabledContent) => {
    heroContentSettings.value.push(enabledContent);
});
watch(heroContentSettings, async (newSettings) => {
    if (newSettings.length > 0) {
        configurationStore.$patch({ enabledHeroContent: newSettings });
    }
    else {
        toast.add({
            severity: "error",
            summary: "Error",
            detail: t("configuration.error.atleast-one-selected"),
            life: 3000,
        });
    }
});
const getImageUrl = (contentId) => {
    const mapping = {
        "apocalypse": "apoc.png",
        "awakenings": "awak.png",
        "core": "core.png",
        "fallen-sisters": "fallen.png",
        "desert-of-hellscar": "hellscar.png",
        "the-ruin-of-luccanor": "luccanor.png",
        "monster-pack-1": "monsterpack.png",
        "the-shadow-world": "shadow.png",
        "spoils-of-war": "spoils.png",
        "rise-of-the-undead-dragon": "undeaddragon.png",
        "handuriel": "handuriel.png",
        "hero-pack-1": "heropack.png",
        "lorien": "lorien.png",
        "lordwrath": "lord.png",
    };
    if (mapping[contentId]) {
        return `https://assets.drunagor.app/CampaignTracker/ContentImages/${mapping[contentId]}`;
    }
    return "";
};
const toggleSelection = (contentId) => {
    if (heroContentSettings.value.includes(contentId)) {
        if (heroContentSettings.value.length > 1) {
            heroContentSettings.value = heroContentSettings.value.filter((id) => id !== contentId);
        }
        else {
            toast.add({
                severity: "error",
                summary: "Error",
                detail: t("configuration.error.atleast-one-selected"),
                life: 3000,
            });
        }
    }
    else {
        heroContentSettings.value = [...heroContentSettings.value, contentId];
    }
};
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_withDefaultsArg = (function (t) { return t; })({
    noCard: false,
});
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['content-box-card']} */ ;
/** @type {__VLS_StyleScopedClasses['content-box-card']} */ ;
/** @type {__VLS_StyleScopedClasses['content-box-card']} */ ;
/** @type {__VLS_StyleScopedClasses['box-image']} */ ;
/** @type {__VLS_StyleScopedClasses['content-box-card']} */ ;
/** @type {__VLS_StyleScopedClasses['selected']} */ ;
/** @type {__VLS_StyleScopedClasses['box-image']} */ ;
/** @type {__VLS_StyleScopedClasses['content-box-card']} */ ;
/** @type {__VLS_StyleScopedClasses['unselected']} */ ;
/** @type {__VLS_StyleScopedClasses['fallback-card']} */ ;
/** @type {__VLS_StyleScopedClasses['content-box-card']} */ ;
/** @type {__VLS_StyleScopedClasses['selected']} */ ;
/** @type {__VLS_StyleScopedClasses['fallback-card']} */ ;
// CSS variable injection 
// CSS variable injection end 
const __VLS_0 = {}.VContainer;
/** @type {[typeof __VLS_components.VContainer, typeof __VLS_components.vContainer, typeof __VLS_components.VContainer, typeof __VLS_components.vContainer, ]} */ ;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
    maxWidth: "660",
    ...{ class: "pa-0" },
}));
const __VLS_2 = __VLS_1({
    maxWidth: "660",
    ...{ class: "pa-0" },
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
var __VLS_4 = {};
__VLS_3.slots.default;
if (props.noCard) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "text-uppercase font-weight-bold text-left mb-3 mt-2 text-subtitle-1 px-1" },
    });
    (__VLS_ctx.$t("configuration.hero-content"));
    const __VLS_5 = {}.VRow;
    /** @type {[typeof __VLS_components.VRow, typeof __VLS_components.vRow, typeof __VLS_components.VRow, typeof __VLS_components.vRow, ]} */ ;
    // @ts-ignore
    const __VLS_6 = __VLS_asFunctionalComponent(__VLS_5, new __VLS_5({
        noGutters: true,
        ...{ class: "mx-n1" },
    }));
    const __VLS_7 = __VLS_6({
        noGutters: true,
        ...{ class: "mx-n1" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_6));
    __VLS_8.slots.default;
    for (const [content] of __VLS_getVForSourceType((__VLS_ctx.contentStore.getAllWithHeroes()))) {
        const __VLS_9 = {}.VCol;
        /** @type {[typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ]} */ ;
        // @ts-ignore
        const __VLS_10 = __VLS_asFunctionalComponent(__VLS_9, new __VLS_9({
            key: (content.id),
            cols: "12",
            sm: "6",
            ...{ class: "pa-1" },
        }));
        const __VLS_11 = __VLS_10({
            key: (content.id),
            cols: "12",
            sm: "6",
            ...{ class: "pa-1" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_10));
        __VLS_12.slots.default;
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ onClick: (...[$event]) => {
                    if (!(props.noCard))
                        return;
                    __VLS_ctx.toggleSelection(content.id);
                } },
            ...{ class: "content-box-card" },
            ...{ class: ({
                    selected: __VLS_ctx.heroContentSettings.includes(content.id),
                    unselected: !__VLS_ctx.heroContentSettings.includes(content.id)
                }) },
            'data-testid': ('configuration-content-hero-' + content.id),
        });
        if (__VLS_ctx.getImageUrl(content.id)) {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.img)({
                src: (__VLS_ctx.getImageUrl(content.id)),
                alt: (__VLS_ctx.$t(content.translation_key)),
                ...{ class: "box-image" },
            });
        }
        else {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: "fallback-card" },
            });
            (__VLS_ctx.$t(content.translation_key));
        }
        var __VLS_12;
    }
    var __VLS_8;
}
else {
    const __VLS_13 = {}.VCard;
    /** @type {[typeof __VLS_components.VCard, typeof __VLS_components.vCard, typeof __VLS_components.VCard, typeof __VLS_components.vCard, ]} */ ;
    // @ts-ignore
    const __VLS_14 = __VLS_asFunctionalComponent(__VLS_13, new __VLS_13({
        color: "primary",
        ...{ class: "my-4 pa-4 custom-card" },
    }));
    const __VLS_15 = __VLS_14({
        color: "primary",
        ...{ class: "my-4 pa-4 custom-card" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_14));
    __VLS_16.slots.default;
    const __VLS_17 = {}.VCardTitle;
    /** @type {[typeof __VLS_components.VCardTitle, typeof __VLS_components.vCardTitle, typeof __VLS_components.VCardTitle, typeof __VLS_components.vCardTitle, ]} */ ;
    // @ts-ignore
    const __VLS_18 = __VLS_asFunctionalComponent(__VLS_17, new __VLS_17({
        ...{ class: "text-uppercase font-weight-bold text-left mb-4" },
    }));
    const __VLS_19 = __VLS_18({
        ...{ class: "text-uppercase font-weight-bold text-left mb-4" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_18));
    __VLS_20.slots.default;
    (__VLS_ctx.$t("configuration.hero-content"));
    var __VLS_20;
    const __VLS_21 = {}.VCardText;
    /** @type {[typeof __VLS_components.VCardText, typeof __VLS_components.vCardText, typeof __VLS_components.VCardText, typeof __VLS_components.vCardText, ]} */ ;
    // @ts-ignore
    const __VLS_22 = __VLS_asFunctionalComponent(__VLS_21, new __VLS_21({
        ...{ class: "pa-2" },
    }));
    const __VLS_23 = __VLS_22({
        ...{ class: "pa-2" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_22));
    __VLS_24.slots.default;
    const __VLS_25 = {}.VRow;
    /** @type {[typeof __VLS_components.VRow, typeof __VLS_components.vRow, typeof __VLS_components.VRow, typeof __VLS_components.vRow, ]} */ ;
    // @ts-ignore
    const __VLS_26 = __VLS_asFunctionalComponent(__VLS_25, new __VLS_25({
        noGutters: true,
        ...{ class: "mx-n1" },
    }));
    const __VLS_27 = __VLS_26({
        noGutters: true,
        ...{ class: "mx-n1" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_26));
    __VLS_28.slots.default;
    for (const [content] of __VLS_getVForSourceType((__VLS_ctx.contentStore.getAllWithHeroes()))) {
        const __VLS_29 = {}.VCol;
        /** @type {[typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ]} */ ;
        // @ts-ignore
        const __VLS_30 = __VLS_asFunctionalComponent(__VLS_29, new __VLS_29({
            key: (content.id),
            cols: "12",
            sm: "6",
            ...{ class: "pa-1" },
        }));
        const __VLS_31 = __VLS_30({
            key: (content.id),
            cols: "12",
            sm: "6",
            ...{ class: "pa-1" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_30));
        __VLS_32.slots.default;
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ onClick: (...[$event]) => {
                    if (!!(props.noCard))
                        return;
                    __VLS_ctx.toggleSelection(content.id);
                } },
            ...{ class: "content-box-card" },
            ...{ class: ({
                    selected: __VLS_ctx.heroContentSettings.includes(content.id),
                    unselected: !__VLS_ctx.heroContentSettings.includes(content.id)
                }) },
            'data-testid': ('configuration-content-hero-' + content.id),
        });
        if (__VLS_ctx.getImageUrl(content.id)) {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.img)({
                src: (__VLS_ctx.getImageUrl(content.id)),
                alt: (__VLS_ctx.$t(content.translation_key)),
                ...{ class: "box-image" },
            });
        }
        else {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: "fallback-card" },
            });
            (__VLS_ctx.$t(content.translation_key));
        }
        var __VLS_32;
    }
    var __VLS_28;
    var __VLS_24;
    var __VLS_16;
}
var __VLS_3;
/** @type {__VLS_StyleScopedClasses['pa-0']} */ ;
/** @type {__VLS_StyleScopedClasses['text-uppercase']} */ ;
/** @type {__VLS_StyleScopedClasses['font-weight-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-left']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-3']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-subtitle-1']} */ ;
/** @type {__VLS_StyleScopedClasses['px-1']} */ ;
/** @type {__VLS_StyleScopedClasses['mx-n1']} */ ;
/** @type {__VLS_StyleScopedClasses['pa-1']} */ ;
/** @type {__VLS_StyleScopedClasses['content-box-card']} */ ;
/** @type {__VLS_StyleScopedClasses['selected']} */ ;
/** @type {__VLS_StyleScopedClasses['unselected']} */ ;
/** @type {__VLS_StyleScopedClasses['box-image']} */ ;
/** @type {__VLS_StyleScopedClasses['fallback-card']} */ ;
/** @type {__VLS_StyleScopedClasses['my-4']} */ ;
/** @type {__VLS_StyleScopedClasses['pa-4']} */ ;
/** @type {__VLS_StyleScopedClasses['custom-card']} */ ;
/** @type {__VLS_StyleScopedClasses['text-uppercase']} */ ;
/** @type {__VLS_StyleScopedClasses['font-weight-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-left']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['pa-2']} */ ;
/** @type {__VLS_StyleScopedClasses['mx-n1']} */ ;
/** @type {__VLS_StyleScopedClasses['pa-1']} */ ;
/** @type {__VLS_StyleScopedClasses['content-box-card']} */ ;
/** @type {__VLS_StyleScopedClasses['selected']} */ ;
/** @type {__VLS_StyleScopedClasses['unselected']} */ ;
/** @type {__VLS_StyleScopedClasses['box-image']} */ ;
/** @type {__VLS_StyleScopedClasses['fallback-card']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            contentStore: contentStore,
            heroContentSettings: heroContentSettings,
            getImageUrl: getImageUrl,
            toggleSelection: toggleSelection,
        };
    },
    __typeProps: {},
    props: {},
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
    __typeProps: {},
    props: {},
});
; /* PartiallyEnd: #4569/main.vue */
