/// <reference types="../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import { VariantStore } from "@/store/VariantStore";
import { RandomizeMonster } from "@/service/RandomizeMonster";
import { RandomizeCommander } from "@/service/RandomizeCommander";
import { ref } from "vue";
import { useToast } from "primevue/usetoast";
import { useI18n } from "vue-i18n";
import SwappableImage from "@/components/SwappableImage.vue";
import RandomizerTitle from "@/assets/Randomizer.webp";
import backgroundImage from "@/assets/monster/big/Background.webp";
import RandomizerQuickSelect from "@/components/RandomizerQuickSelect.vue";
const toast = useToast();
const { t } = useI18n();
const name = ref(t("randomizer.random-monster"));
const variant = ref("");
const currentCharacterId = ref("");
const frontImage = ref(RandomizerTitle.toString());
const backImage = ref("");
const excludeCurrentCharacter = ref(true);
const variantStore = VariantStore();
function getExcludedCharacters() {
    let excludedCharacters = [];
    if (excludeCurrentCharacter.value) {
        excludedCharacters = [currentCharacterId.value];
    }
    return excludedCharacters;
}
function getRandomMonster(color) {
    let monster = new RandomizeMonster().randomizeByColor(color, getExcludedCharacters());
    if (monster === null) {
        toast.add({
            severity: "error",
            summary: "Error",
            detail: t("randomizer.error.no-other-monster-available"),
            life: 3000,
        });
        return;
    }
    currentCharacterId.value = monster.id;
    name.value = t(monster.translation_key);
    variant.value = t(variantStore.find(monster.getRandomVariant()).translation_key);
    frontImage.value = monster.image.main;
    backImage.value = monster.image.miniature;
}
function getRandomCommander() {
    let commander = new RandomizeCommander().randomize(getExcludedCharacters());
    if (commander === null) {
        toast.add({
            severity: "error",
            summary: "Error",
            detail: t("randomizer.error.no-other-commander-available"),
            life: 3000,
        });
        return;
    }
    currentCharacterId.value = commander.id;
    name.value = t(commander.translation_key);
    variant.value = t("randomizer.commander");
    if (commander.id === "demon-lord" || commander.id === "fallen-sisters") {
        variant.value = t("randomizer.overlord");
    }
    frontImage.value = commander.image.main;
    backImage.value = commander.image.miniature;
}
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
// CSS variable injection 
// CSS variable injection end 
const __VLS_0 = {}.VRow;
/** @type {[typeof __VLS_components.VRow, typeof __VLS_components.vRow, typeof __VLS_components.VRow, typeof __VLS_components.vRow, ]} */ ;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
    noGutters: true,
    ...{ class: "justify-center" },
}));
const __VLS_2 = __VLS_1({
    noGutters: true,
    ...{ class: "justify-center" },
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
var __VLS_4 = {};
__VLS_3.slots.default;
const __VLS_5 = {}.VCol;
/** @type {[typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ]} */ ;
// @ts-ignore
const __VLS_6 = __VLS_asFunctionalComponent(__VLS_5, new __VLS_5({
    cols: "12",
    ...{ class: "pa-0" },
}));
const __VLS_7 = __VLS_6({
    cols: "12",
    ...{ class: "pa-0" },
}, ...__VLS_functionalComponentArgsRest(__VLS_6));
__VLS_8.slots.default;
/** @type {[typeof SwappableImage, ]} */ ;
// @ts-ignore
const __VLS_9 = __VLS_asFunctionalComponent(SwappableImage, new SwappableImage({
    title: (__VLS_ctx.name),
    subTitle: (__VLS_ctx.variant),
    background: (__VLS_ctx.backgroundImage),
    frontImage: (__VLS_ctx.frontImage),
    backImage: (__VLS_ctx.backImage),
}));
const __VLS_10 = __VLS_9({
    title: (__VLS_ctx.name),
    subTitle: (__VLS_ctx.variant),
    background: (__VLS_ctx.backgroundImage),
    frontImage: (__VLS_ctx.frontImage),
    backImage: (__VLS_ctx.backImage),
}, ...__VLS_functionalComponentArgsRest(__VLS_9));
var __VLS_8;
const __VLS_12 = {}.VCol;
/** @type {[typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ]} */ ;
// @ts-ignore
const __VLS_13 = __VLS_asFunctionalComponent(__VLS_12, new __VLS_12({
    cols: "12",
    ...{ class: "d-flex justify-center pb-0 pt-0" },
}));
const __VLS_14 = __VLS_13({
    cols: "12",
    ...{ class: "d-flex justify-center pb-0 pt-0" },
}, ...__VLS_functionalComponentArgsRest(__VLS_13));
__VLS_15.slots.default;
const __VLS_16 = {}.VCheckbox;
/** @type {[typeof __VLS_components.VCheckbox, typeof __VLS_components.vCheckbox, typeof __VLS_components.VCheckbox, typeof __VLS_components.vCheckbox, ]} */ ;
// @ts-ignore
const __VLS_17 = __VLS_asFunctionalComponent(__VLS_16, new __VLS_16({
    label: (__VLS_ctx.$t('randomizer.exclude-current-monster')),
    modelValue: (__VLS_ctx.excludeCurrentCharacter),
}));
const __VLS_18 = __VLS_17({
    label: (__VLS_ctx.$t('randomizer.exclude-current-monster')),
    modelValue: (__VLS_ctx.excludeCurrentCharacter),
}, ...__VLS_functionalComponentArgsRest(__VLS_17));
var __VLS_15;
const __VLS_20 = {}.VContainer;
/** @type {[typeof __VLS_components.VContainer, typeof __VLS_components.vContainer, typeof __VLS_components.VContainer, typeof __VLS_components.vContainer, ]} */ ;
// @ts-ignore
const __VLS_21 = __VLS_asFunctionalComponent(__VLS_20, new __VLS_20({
    maxWidth: "680",
    ...{ class: "d-none d-md-flex pt-0" },
}));
const __VLS_22 = __VLS_21({
    maxWidth: "680",
    ...{ class: "d-none d-md-flex pt-0" },
}, ...__VLS_functionalComponentArgsRest(__VLS_21));
__VLS_23.slots.default;
const __VLS_24 = {}.VCol;
/** @type {[typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ]} */ ;
// @ts-ignore
const __VLS_25 = __VLS_asFunctionalComponent(__VLS_24, new __VLS_24({
    cols: "12",
}));
const __VLS_26 = __VLS_25({
    cols: "12",
}, ...__VLS_functionalComponentArgsRest(__VLS_25));
__VLS_27.slots.default;
const __VLS_28 = {}.VCard;
/** @type {[typeof __VLS_components.VCard, typeof __VLS_components.vCard, typeof __VLS_components.VCard, typeof __VLS_components.vCard, ]} */ ;
// @ts-ignore
const __VLS_29 = __VLS_asFunctionalComponent(__VLS_28, new __VLS_28({
    color: "primary",
    rounded: "",
    ...{ class: "d-flex justify-center pa-3 elevation-0" },
}));
const __VLS_30 = __VLS_29({
    color: "primary",
    rounded: "",
    ...{ class: "d-flex justify-center pa-3 elevation-0" },
}, ...__VLS_functionalComponentArgsRest(__VLS_29));
__VLS_31.slots.default;
const __VLS_32 = {}.VBtn;
/** @type {[typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ]} */ ;
// @ts-ignore
const __VLS_33 = __VLS_asFunctionalComponent(__VLS_32, new __VLS_32({
    ...{ 'onClick': {} },
    ...{ class: "mx-1" },
    variant: "elevated",
    ...{ style: {} },
}));
const __VLS_34 = __VLS_33({
    ...{ 'onClick': {} },
    ...{ class: "mx-1" },
    variant: "elevated",
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_33));
let __VLS_36;
let __VLS_37;
let __VLS_38;
const __VLS_39 = {
    onClick: (...[$event]) => {
        __VLS_ctx.getRandomMonster('white');
    }
};
__VLS_35.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ style: {} },
});
(__VLS_ctx.$t("randomizer.white"));
var __VLS_35;
const __VLS_40 = {}.VBtn;
/** @type {[typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ]} */ ;
// @ts-ignore
const __VLS_41 = __VLS_asFunctionalComponent(__VLS_40, new __VLS_40({
    ...{ 'onClick': {} },
    ...{ class: "mx-1" },
    variant: "elevated",
    ...{ style: {} },
}));
const __VLS_42 = __VLS_41({
    ...{ 'onClick': {} },
    ...{ class: "mx-1" },
    variant: "elevated",
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_41));
let __VLS_44;
let __VLS_45;
let __VLS_46;
const __VLS_47 = {
    onClick: (...[$event]) => {
        __VLS_ctx.getRandomMonster('gray');
    }
};
__VLS_43.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ style: {} },
});
(__VLS_ctx.$t("randomizer.gray"));
var __VLS_43;
const __VLS_48 = {}.VBtn;
/** @type {[typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ]} */ ;
// @ts-ignore
const __VLS_49 = __VLS_asFunctionalComponent(__VLS_48, new __VLS_48({
    ...{ 'onClick': {} },
    ...{ class: "mx-1" },
    variant: "elevated",
    ...{ style: {} },
}));
const __VLS_50 = __VLS_49({
    ...{ 'onClick': {} },
    ...{ class: "mx-1" },
    variant: "elevated",
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_49));
let __VLS_52;
let __VLS_53;
let __VLS_54;
const __VLS_55 = {
    onClick: (...[$event]) => {
        __VLS_ctx.getRandomMonster('black');
    }
};
__VLS_51.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ style: {} },
});
(__VLS_ctx.$t("randomizer.black"));
var __VLS_51;
const __VLS_56 = {}.VBtn;
/** @type {[typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ]} */ ;
// @ts-ignore
const __VLS_57 = __VLS_asFunctionalComponent(__VLS_56, new __VLS_56({
    ...{ 'onClick': {} },
    ...{ class: "mx-1" },
    variant: "elevated",
    ...{ style: {} },
}));
const __VLS_58 = __VLS_57({
    ...{ 'onClick': {} },
    ...{ class: "mx-1" },
    variant: "elevated",
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_57));
let __VLS_60;
let __VLS_61;
let __VLS_62;
const __VLS_63 = {
    onClick: (...[$event]) => {
        __VLS_ctx.getRandomCommander();
    }
};
__VLS_59.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ style: {} },
});
(__VLS_ctx.$t("randomizer.commander"));
var __VLS_59;
var __VLS_31;
var __VLS_27;
var __VLS_23;
const __VLS_64 = {}.VContainer;
/** @type {[typeof __VLS_components.VContainer, typeof __VLS_components.vContainer, typeof __VLS_components.VContainer, typeof __VLS_components.vContainer, ]} */ ;
// @ts-ignore
const __VLS_65 = __VLS_asFunctionalComponent(__VLS_64, new __VLS_64({
    ...{ class: "d-md-none pa-4" },
}));
const __VLS_66 = __VLS_65({
    ...{ class: "d-md-none pa-4" },
}, ...__VLS_functionalComponentArgsRest(__VLS_65));
__VLS_67.slots.default;
const __VLS_68 = {}.VCard;
/** @type {[typeof __VLS_components.VCard, typeof __VLS_components.vCard, typeof __VLS_components.VCard, typeof __VLS_components.vCard, ]} */ ;
// @ts-ignore
const __VLS_69 = __VLS_asFunctionalComponent(__VLS_68, new __VLS_68({}));
const __VLS_70 = __VLS_69({}, ...__VLS_functionalComponentArgsRest(__VLS_69));
__VLS_71.slots.default;
const __VLS_72 = {}.VCard;
/** @type {[typeof __VLS_components.VCard, typeof __VLS_components.vCard, typeof __VLS_components.VCard, typeof __VLS_components.vCard, ]} */ ;
// @ts-ignore
const __VLS_73 = __VLS_asFunctionalComponent(__VLS_72, new __VLS_72({
    ...{ class: "d-flex justify-center pa-3 elevation-0" },
}));
const __VLS_74 = __VLS_73({
    ...{ class: "d-flex justify-center pa-3 elevation-0" },
}, ...__VLS_functionalComponentArgsRest(__VLS_73));
__VLS_75.slots.default;
const __VLS_76 = {}.VBtn;
/** @type {[typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ]} */ ;
// @ts-ignore
const __VLS_77 = __VLS_asFunctionalComponent(__VLS_76, new __VLS_76({
    ...{ 'onClick': {} },
    ...{ class: "mx-1" },
    variant: "elevated",
    ...{ style: {} },
}));
const __VLS_78 = __VLS_77({
    ...{ 'onClick': {} },
    ...{ class: "mx-1" },
    variant: "elevated",
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_77));
let __VLS_80;
let __VLS_81;
let __VLS_82;
const __VLS_83 = {
    onClick: (...[$event]) => {
        __VLS_ctx.getRandomMonster('white');
    }
};
__VLS_79.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ style: {} },
});
(__VLS_ctx.$t("randomizer.white"));
var __VLS_79;
const __VLS_84 = {}.VBtn;
/** @type {[typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ]} */ ;
// @ts-ignore
const __VLS_85 = __VLS_asFunctionalComponent(__VLS_84, new __VLS_84({
    ...{ 'onClick': {} },
    ...{ class: "mx-1" },
    variant: "elevated",
    ...{ style: {} },
}));
const __VLS_86 = __VLS_85({
    ...{ 'onClick': {} },
    ...{ class: "mx-1" },
    variant: "elevated",
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_85));
let __VLS_88;
let __VLS_89;
let __VLS_90;
const __VLS_91 = {
    onClick: (...[$event]) => {
        __VLS_ctx.getRandomMonster('gray');
    }
};
__VLS_87.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ style: {} },
});
(__VLS_ctx.$t("randomizer.gray"));
var __VLS_87;
const __VLS_92 = {}.VBtn;
/** @type {[typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ]} */ ;
// @ts-ignore
const __VLS_93 = __VLS_asFunctionalComponent(__VLS_92, new __VLS_92({
    ...{ 'onClick': {} },
    ...{ class: "mx-1" },
    variant: "elevated",
    ...{ style: {} },
}));
const __VLS_94 = __VLS_93({
    ...{ 'onClick': {} },
    ...{ class: "mx-1" },
    variant: "elevated",
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_93));
let __VLS_96;
let __VLS_97;
let __VLS_98;
const __VLS_99 = {
    onClick: (...[$event]) => {
        __VLS_ctx.getRandomMonster('black');
    }
};
__VLS_95.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ style: {} },
});
(__VLS_ctx.$t("randomizer.black"));
var __VLS_95;
var __VLS_75;
const __VLS_100 = {}.VCard;
/** @type {[typeof __VLS_components.VCard, typeof __VLS_components.vCard, typeof __VLS_components.VCard, typeof __VLS_components.vCard, ]} */ ;
// @ts-ignore
const __VLS_101 = __VLS_asFunctionalComponent(__VLS_100, new __VLS_100({
    ...{ class: "d-flex justify-center pb-3 elevation-0" },
}));
const __VLS_102 = __VLS_101({
    ...{ class: "d-flex justify-center pb-3 elevation-0" },
}, ...__VLS_functionalComponentArgsRest(__VLS_101));
__VLS_103.slots.default;
const __VLS_104 = {}.VBtn;
/** @type {[typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ]} */ ;
// @ts-ignore
const __VLS_105 = __VLS_asFunctionalComponent(__VLS_104, new __VLS_104({
    ...{ 'onClick': {} },
    ...{ class: "mx-" },
    variant: "elevated",
    ...{ style: {} },
}));
const __VLS_106 = __VLS_105({
    ...{ 'onClick': {} },
    ...{ class: "mx-" },
    variant: "elevated",
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_105));
let __VLS_108;
let __VLS_109;
let __VLS_110;
const __VLS_111 = {
    onClick: (...[$event]) => {
        __VLS_ctx.getRandomCommander();
    }
};
__VLS_107.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ style: {} },
});
(__VLS_ctx.$t("randomizer.commander"));
var __VLS_107;
var __VLS_103;
var __VLS_71;
var __VLS_67;
const __VLS_112 = {}.VCol;
/** @type {[typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ]} */ ;
// @ts-ignore
const __VLS_113 = __VLS_asFunctionalComponent(__VLS_112, new __VLS_112({
    cols: "12",
    ...{ class: "" },
}));
const __VLS_114 = __VLS_113({
    cols: "12",
    ...{ class: "" },
}, ...__VLS_functionalComponentArgsRest(__VLS_113));
__VLS_115.slots.default;
const __VLS_116 = {}.ConfigurationVariant;
/** @type {[typeof __VLS_components.ConfigurationVariant, ]} */ ;
// @ts-ignore
const __VLS_117 = __VLS_asFunctionalComponent(__VLS_116, new __VLS_116({}));
const __VLS_118 = __VLS_117({}, ...__VLS_functionalComponentArgsRest(__VLS_117));
/** @type {[typeof RandomizerQuickSelect, ]} */ ;
// @ts-ignore
const __VLS_120 = __VLS_asFunctionalComponent(RandomizerQuickSelect, new RandomizerQuickSelect({}));
const __VLS_121 = __VLS_120({}, ...__VLS_functionalComponentArgsRest(__VLS_120));
var __VLS_115;
var __VLS_3;
/** @type {__VLS_StyleScopedClasses['']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['pa-0']} */ ;
/** @type {__VLS_StyleScopedClasses['d-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['pb-0']} */ ;
/** @type {__VLS_StyleScopedClasses['pt-0']} */ ;
/** @type {__VLS_StyleScopedClasses['d-none']} */ ;
/** @type {__VLS_StyleScopedClasses['d-md-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['pt-0']} */ ;
/** @type {__VLS_StyleScopedClasses['d-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['pa-3']} */ ;
/** @type {__VLS_StyleScopedClasses['elevation-0']} */ ;
/** @type {__VLS_StyleScopedClasses['mx-1']} */ ;
/** @type {__VLS_StyleScopedClasses['mx-1']} */ ;
/** @type {__VLS_StyleScopedClasses['mx-1']} */ ;
/** @type {__VLS_StyleScopedClasses['mx-1']} */ ;
/** @type {__VLS_StyleScopedClasses['d-md-none']} */ ;
/** @type {__VLS_StyleScopedClasses['pa-4']} */ ;
/** @type {__VLS_StyleScopedClasses['d-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['pa-3']} */ ;
/** @type {__VLS_StyleScopedClasses['elevation-0']} */ ;
/** @type {__VLS_StyleScopedClasses['mx-1']} */ ;
/** @type {__VLS_StyleScopedClasses['mx-1']} */ ;
/** @type {__VLS_StyleScopedClasses['mx-1']} */ ;
/** @type {__VLS_StyleScopedClasses['d-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['pb-3']} */ ;
/** @type {__VLS_StyleScopedClasses['elevation-0']} */ ;
/** @type {__VLS_StyleScopedClasses['mx-']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            SwappableImage: SwappableImage,
            backgroundImage: backgroundImage,
            RandomizerQuickSelect: RandomizerQuickSelect,
            name: name,
            variant: variant,
            frontImage: frontImage,
            backImage: backImage,
            excludeCurrentCharacter: excludeCurrentCharacter,
            getRandomMonster: getRandomMonster,
            getRandomCommander: getRandomCommander,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
