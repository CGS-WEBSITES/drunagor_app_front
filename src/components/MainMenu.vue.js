/// <reference types="../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import { ref, computed } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter, useRoute } from "vue-router";
import { useDisplay } from "vuetify"; // Import necessário para isMobile se não estiver global
import { CampaignStore } from "@/store/CampaignStore";
const { t, locale } = useI18n();
const { mobile } = useDisplay(); // Adicionado para garantir que isMobile funcione
const router = useRouter();
const route = useRoute();
const isMobile = computed(() => mobile.value);
const isCampaignRoute = computed(() => route.name === 'Campaign');
const campaignStore = CampaignStore();
const campaign = computed(() => {
    if (route.name === 'Campaign' && route.params.id) {
        return campaignStore.findOptional(String(route.params.id));
    }
    return null;
});
const isImmersiveMode = computed(() => {
    if (!campaign.value)
        return false;
    if (campaign.value.campaign === 'underkeep2')
        return true;
    const wing = (campaign.value.wing || "").toUpperCase();
    return wing.includes("WING 1") || wing.includes("WING 2") || wing.includes("WING 01") || wing.includes("WING 02") || wing.includes("TUTORIAL");
});
// Nova lógica: Verifica se é a página de heróis pelo nome ou pelo path
const isHeroesRoute = computed(() => route.name === 'HeroesManager' ||
    route.path.includes('/campaign-tracker/heroes'));
const navigateTo = (route) => {
    router.push(route);
};
const buttons = ref([
    {
        iconType: "image",
        icon: new URL("@/assets/randomiicon.png", import.meta.url).href,
        value: "Campaign Overview",
        route: "/campaign-tracker/randomizer",
        translationKey: "menu.random-monster",
    },
    {
        iconType: "mdi",
        icon: "mdi-sword",
        value: "Campaign Overview",
        route: "/campaign-tracker/",
        translationKey: "menu.campaign",
    },
    {
        iconType: "mdi",
        icon: "mdi-book-search-outline",
        value: "Keyword",
        route: "/campaign-tracker/keyword",
        translationKey: "menu.keyword",
    },
    {
        iconType: "mdi",
        icon: "mdi-package-variant-closed",
        value: "settings",
        route: "/campaign-tracker/configuration",
        translationKey: "menu.settings",
    },
]);
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
// CSS variable injection 
// CSS variable injection end 
if (!__VLS_ctx.isCampaignRoute && !__VLS_ctx.isHeroesRoute) {
    const __VLS_0 = {}.VContainer;
    /** @type {[typeof __VLS_components.VContainer, typeof __VLS_components.vContainer, typeof __VLS_components.VContainer, typeof __VLS_components.vContainer, ]} */ ;
    // @ts-ignore
    const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
        ...{ class: "d-sm-none pa-4 safe-pwa-top" },
    }));
    const __VLS_2 = __VLS_1({
        ...{ class: "d-sm-none pa-4 safe-pwa-top" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_1));
    __VLS_3.slots.default;
    const __VLS_4 = {}.VCard;
    /** @type {[typeof __VLS_components.VCard, typeof __VLS_components.vCard, typeof __VLS_components.VCard, typeof __VLS_components.vCard, ]} */ ;
    // @ts-ignore
    const __VLS_5 = __VLS_asFunctionalComponent(__VLS_4, new __VLS_4({
        color: "primary",
        rounded: "lg",
        elevation: "3",
        ...{ class: "mx-auto py-4 px-6 d-flex justify-center" },
    }));
    const __VLS_6 = __VLS_5({
        color: "primary",
        rounded: "lg",
        elevation: "3",
        ...{ class: "mx-auto py-4 px-6 d-flex justify-center" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_5));
    __VLS_7.slots.default;
    const __VLS_8 = {}.VRow;
    /** @type {[typeof __VLS_components.VRow, typeof __VLS_components.vRow, typeof __VLS_components.VRow, typeof __VLS_components.vRow, ]} */ ;
    // @ts-ignore
    const __VLS_9 = __VLS_asFunctionalComponent(__VLS_8, new __VLS_8({
        justify: "space-between",
        align: "center",
        ...{ class: "py-2" },
        ...{ style: {} },
    }));
    const __VLS_10 = __VLS_9({
        justify: "space-between",
        align: "center",
        ...{ class: "py-2" },
        ...{ style: {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_9));
    __VLS_11.slots.default;
    for (const [button, i] of __VLS_getVForSourceType((__VLS_ctx.buttons))) {
        const __VLS_12 = {}.VBtn;
        /** @type {[typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ]} */ ;
        // @ts-ignore
        const __VLS_13 = __VLS_asFunctionalComponent(__VLS_12, new __VLS_12({
            ...{ 'onClick': {} },
            icon: true,
            ...{ class: "mx-1" },
            width: "56",
            height: "56",
        }));
        const __VLS_14 = __VLS_13({
            ...{ 'onClick': {} },
            icon: true,
            ...{ class: "mx-1" },
            width: "56",
            height: "56",
        }, ...__VLS_functionalComponentArgsRest(__VLS_13));
        let __VLS_16;
        let __VLS_17;
        let __VLS_18;
        const __VLS_19 = {
            onClick: (...[$event]) => {
                if (!(!__VLS_ctx.isCampaignRoute && !__VLS_ctx.isHeroesRoute))
                    return;
                __VLS_ctx.navigateTo(button.route);
            }
        };
        __VLS_15.slots.default;
        if (button.iconType === 'image') {
            const __VLS_20 = {}.VImg;
            /** @type {[typeof __VLS_components.VImg, typeof __VLS_components.vImg, ]} */ ;
            // @ts-ignore
            const __VLS_21 = __VLS_asFunctionalComponent(__VLS_20, new __VLS_20({
                src: (button.icon),
                width: "32",
                height: "32",
                ...{ style: {} },
            }));
            const __VLS_22 = __VLS_21({
                src: (button.icon),
                width: "32",
                height: "32",
                ...{ style: {} },
            }, ...__VLS_functionalComponentArgsRest(__VLS_21));
        }
        else {
            const __VLS_24 = {}.VIcon;
            /** @type {[typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, ]} */ ;
            // @ts-ignore
            const __VLS_25 = __VLS_asFunctionalComponent(__VLS_24, new __VLS_24({
                size: "32",
            }));
            const __VLS_26 = __VLS_25({
                size: "32",
            }, ...__VLS_functionalComponentArgsRest(__VLS_25));
            __VLS_27.slots.default;
            (button.icon);
            var __VLS_27;
        }
        var __VLS_15;
    }
    var __VLS_11;
    var __VLS_7;
    var __VLS_3;
}
if (!__VLS_ctx.isCampaignRoute && !__VLS_ctx.isHeroesRoute) {
    const __VLS_28 = {}.VContainer;
    /** @type {[typeof __VLS_components.VContainer, typeof __VLS_components.vContainer, typeof __VLS_components.VContainer, typeof __VLS_components.vContainer, ]} */ ;
    // @ts-ignore
    const __VLS_29 = __VLS_asFunctionalComponent(__VLS_28, new __VLS_28({
        maxWidth: "800",
        ...{ style: {} },
        ...{ class: "d-none d-sm-flex" },
    }));
    const __VLS_30 = __VLS_29({
        maxWidth: "800",
        ...{ style: {} },
        ...{ class: "d-none d-sm-flex" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_29));
    __VLS_31.slots.default;
    const __VLS_32 = {}.VCard;
    /** @type {[typeof __VLS_components.VCard, typeof __VLS_components.vCard, typeof __VLS_components.VCard, typeof __VLS_components.vCard, ]} */ ;
    // @ts-ignore
    const __VLS_33 = __VLS_asFunctionalComponent(__VLS_32, new __VLS_32({
        color: "primary",
        rounded: "lg",
        elevation: "3",
        ...{ class: "mx-auto py-4 px-6 d-flex justify-center" },
    }));
    const __VLS_34 = __VLS_33({
        color: "primary",
        rounded: "lg",
        elevation: "3",
        ...{ class: "mx-auto py-4 px-6 d-flex justify-center" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_33));
    __VLS_35.slots.default;
    const __VLS_36 = {}.VRow;
    /** @type {[typeof __VLS_components.VRow, typeof __VLS_components.vRow, typeof __VLS_components.VRow, typeof __VLS_components.vRow, ]} */ ;
    // @ts-ignore
    const __VLS_37 = __VLS_asFunctionalComponent(__VLS_36, new __VLS_36({
        justify: "space-between",
        align: "center",
        ...{ class: "py-2" },
        ...{ style: {} },
    }));
    const __VLS_38 = __VLS_37({
        justify: "space-between",
        align: "center",
        ...{ class: "py-2" },
        ...{ style: {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_37));
    __VLS_39.slots.default;
    for (const [button, i] of __VLS_getVForSourceType((__VLS_ctx.buttons))) {
        const __VLS_40 = {}.VBtn;
        /** @type {[typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ]} */ ;
        // @ts-ignore
        const __VLS_41 = __VLS_asFunctionalComponent(__VLS_40, new __VLS_40({
            ...{ 'onClick': {} },
            ...{ class: "mx-1" },
            rounded: true,
        }));
        const __VLS_42 = __VLS_41({
            ...{ 'onClick': {} },
            ...{ class: "mx-1" },
            rounded: true,
        }, ...__VLS_functionalComponentArgsRest(__VLS_41));
        let __VLS_44;
        let __VLS_45;
        let __VLS_46;
        const __VLS_47 = {
            onClick: (...[$event]) => {
                if (!(!__VLS_ctx.isCampaignRoute && !__VLS_ctx.isHeroesRoute))
                    return;
                __VLS_ctx.navigateTo(button.route);
            }
        };
        __VLS_43.slots.default;
        if (button.iconType === 'image') {
            const __VLS_48 = {}.VImg;
            /** @type {[typeof __VLS_components.VImg, typeof __VLS_components.vImg, ]} */ ;
            // @ts-ignore
            const __VLS_49 = __VLS_asFunctionalComponent(__VLS_48, new __VLS_48({
                src: (button.icon),
                width: "24",
                height: "24",
                ...{ class: "mr-2" },
                ...{ style: {} },
            }));
            const __VLS_50 = __VLS_49({
                src: (button.icon),
                width: "24",
                height: "24",
                ...{ class: "mr-2" },
                ...{ style: {} },
            }, ...__VLS_functionalComponentArgsRest(__VLS_49));
        }
        else {
            const __VLS_52 = {}.VIcon;
            /** @type {[typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, ]} */ ;
            // @ts-ignore
            const __VLS_53 = __VLS_asFunctionalComponent(__VLS_52, new __VLS_52({
                ...{ class: "mr-2" },
                ...{ style: {} },
            }));
            const __VLS_54 = __VLS_53({
                ...{ class: "mr-2" },
                ...{ style: {} },
            }, ...__VLS_functionalComponentArgsRest(__VLS_53));
            __VLS_55.slots.default;
            (button.icon);
            var __VLS_55;
        }
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
        (__VLS_ctx.$t(button.translationKey));
        var __VLS_43;
    }
    var __VLS_39;
    var __VLS_35;
    var __VLS_31;
}
/** @type {__VLS_StyleScopedClasses['d-sm-none']} */ ;
/** @type {__VLS_StyleScopedClasses['pa-4']} */ ;
/** @type {__VLS_StyleScopedClasses['safe-pwa-top']} */ ;
/** @type {__VLS_StyleScopedClasses['mx-auto']} */ ;
/** @type {__VLS_StyleScopedClasses['py-4']} */ ;
/** @type {__VLS_StyleScopedClasses['px-6']} */ ;
/** @type {__VLS_StyleScopedClasses['d-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['py-2']} */ ;
/** @type {__VLS_StyleScopedClasses['mx-1']} */ ;
/** @type {__VLS_StyleScopedClasses['d-none']} */ ;
/** @type {__VLS_StyleScopedClasses['d-sm-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['mx-auto']} */ ;
/** @type {__VLS_StyleScopedClasses['py-4']} */ ;
/** @type {__VLS_StyleScopedClasses['px-6']} */ ;
/** @type {__VLS_StyleScopedClasses['d-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['py-2']} */ ;
/** @type {__VLS_StyleScopedClasses['mx-1']} */ ;
/** @type {__VLS_StyleScopedClasses['mr-2']} */ ;
/** @type {__VLS_StyleScopedClasses['mr-2']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            isCampaignRoute: isCampaignRoute,
            isHeroesRoute: isHeroesRoute,
            navigateTo: navigateTo,
            buttons: buttons,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
