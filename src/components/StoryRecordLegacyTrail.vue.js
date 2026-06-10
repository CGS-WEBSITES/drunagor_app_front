/// <reference types="../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import { ref, watch } from "vue";
import { CampaignStore } from "@/store/CampaignStore";
const props = defineProps();
const campaignStore = CampaignStore();
const perseverance = ref(0);
perseverance.value =
    campaignStore.find(props.campaignId).legacyTrail.perseverance ?? 0;
watch(perseverance, async (newPersverance) => {
    campaignStore.find(props.campaignId).legacyTrail.perseverance =
        newPersverance;
});
const tragedy = ref(0);
tragedy.value = campaignStore.find(props.campaignId).legacyTrail.tragedy ?? 0;
watch(tragedy, async (newTragedy) => {
    campaignStore.find(props.campaignId).legacyTrail.tragedy = newTragedy;
});
const doom = ref(0);
doom.value = campaignStore.find(props.campaignId).legacyTrail.doom ?? 0;
watch(doom, async (newDoom) => {
    campaignStore.find(props.campaignId).legacyTrail.doom = newDoom;
});
const heroism = ref(0);
heroism.value = campaignStore.find(props.campaignId).legacyTrail.heroism ?? 0;
watch(heroism, async (newHeroism) => {
    campaignStore.find(props.campaignId).legacyTrail.heroism = newHeroism;
});
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    id: "story-record-legacy-trail",
    ...{ class: "form-control w-full" },
});
const __VLS_0 = {}.VRow;
/** @type {[typeof __VLS_components.VRow, typeof __VLS_components.vRow, typeof __VLS_components.VRow, typeof __VLS_components.vRow, ]} */ ;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
    noGutters: true,
}));
const __VLS_2 = __VLS_1({
    noGutters: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
__VLS_3.slots.default;
const __VLS_4 = {}.VCol;
/** @type {[typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ]} */ ;
// @ts-ignore
const __VLS_5 = __VLS_asFunctionalComponent(__VLS_4, new __VLS_4({
    cols: "12",
    ...{ class: "text-left" },
}));
const __VLS_6 = __VLS_5({
    cols: "12",
    ...{ class: "text-left" },
}, ...__VLS_functionalComponentArgsRest(__VLS_5));
__VLS_7.slots.default;
var __VLS_7;
const __VLS_8 = {}.VCol;
/** @type {[typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ]} */ ;
// @ts-ignore
const __VLS_9 = __VLS_asFunctionalComponent(__VLS_8, new __VLS_8({
    cols: "12",
}));
const __VLS_10 = __VLS_9({
    cols: "12",
}, ...__VLS_functionalComponentArgsRest(__VLS_9));
__VLS_11.slots.default;
const __VLS_12 = {}.VRadioGroup;
/** @type {[typeof __VLS_components.VRadioGroup, typeof __VLS_components.vRadioGroup, typeof __VLS_components.VRadioGroup, typeof __VLS_components.vRadioGroup, ]} */ ;
// @ts-ignore
const __VLS_13 = __VLS_asFunctionalComponent(__VLS_12, new __VLS_12({
    modelValue: (__VLS_ctx.perseverance),
    inline: true,
    ...{ class: "d-flex flex-row justify-end" },
}));
const __VLS_14 = __VLS_13({
    modelValue: (__VLS_ctx.perseverance),
    inline: true,
    ...{ class: "d-flex flex-row justify-end" },
}, ...__VLS_functionalComponentArgsRest(__VLS_13));
__VLS_15.slots.default;
const __VLS_16 = {}.VRadio;
/** @type {[typeof __VLS_components.VRadio, typeof __VLS_components.vRadio, typeof __VLS_components.VRadio, typeof __VLS_components.vRadio, ]} */ ;
// @ts-ignore
const __VLS_17 = __VLS_asFunctionalComponent(__VLS_16, new __VLS_16({
    label: "0",
    value: "0",
}));
const __VLS_18 = __VLS_17({
    label: "0",
    value: "0",
}, ...__VLS_functionalComponentArgsRest(__VLS_17));
const __VLS_20 = {}.VRadio;
/** @type {[typeof __VLS_components.VRadio, typeof __VLS_components.vRadio, typeof __VLS_components.VRadio, typeof __VLS_components.vRadio, ]} */ ;
// @ts-ignore
const __VLS_21 = __VLS_asFunctionalComponent(__VLS_20, new __VLS_20({
    label: "1",
    value: "1",
}));
const __VLS_22 = __VLS_21({
    label: "1",
    value: "1",
}, ...__VLS_functionalComponentArgsRest(__VLS_21));
const __VLS_24 = {}.VRadio;
/** @type {[typeof __VLS_components.VRadio, typeof __VLS_components.vRadio, typeof __VLS_components.VRadio, typeof __VLS_components.vRadio, ]} */ ;
// @ts-ignore
const __VLS_25 = __VLS_asFunctionalComponent(__VLS_24, new __VLS_24({
    label: "2",
    value: "2",
}));
const __VLS_26 = __VLS_25({
    label: "2",
    value: "2",
}, ...__VLS_functionalComponentArgsRest(__VLS_25));
const __VLS_28 = {}.VRadio;
/** @type {[typeof __VLS_components.VRadio, typeof __VLS_components.vRadio, typeof __VLS_components.VRadio, typeof __VLS_components.vRadio, ]} */ ;
// @ts-ignore
const __VLS_29 = __VLS_asFunctionalComponent(__VLS_28, new __VLS_28({
    label: "3",
    value: "3",
}));
const __VLS_30 = __VLS_29({
    label: "3",
    value: "3",
}, ...__VLS_functionalComponentArgsRest(__VLS_29));
var __VLS_15;
var __VLS_11;
const __VLS_32 = {}.VCol;
/** @type {[typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ]} */ ;
// @ts-ignore
const __VLS_33 = __VLS_asFunctionalComponent(__VLS_32, new __VLS_32({
    cols: "12",
    ...{ class: "text-left" },
}));
const __VLS_34 = __VLS_33({
    cols: "12",
    ...{ class: "text-left" },
}, ...__VLS_functionalComponentArgsRest(__VLS_33));
__VLS_35.slots.default;
var __VLS_35;
const __VLS_36 = {}.VCol;
/** @type {[typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ]} */ ;
// @ts-ignore
const __VLS_37 = __VLS_asFunctionalComponent(__VLS_36, new __VLS_36({
    cols: "12",
}));
const __VLS_38 = __VLS_37({
    cols: "12",
}, ...__VLS_functionalComponentArgsRest(__VLS_37));
__VLS_39.slots.default;
const __VLS_40 = {}.VRadioGroup;
/** @type {[typeof __VLS_components.VRadioGroup, typeof __VLS_components.vRadioGroup, typeof __VLS_components.VRadioGroup, typeof __VLS_components.vRadioGroup, ]} */ ;
// @ts-ignore
const __VLS_41 = __VLS_asFunctionalComponent(__VLS_40, new __VLS_40({
    modelValue: (__VLS_ctx.tragedy),
    inline: true,
    ...{ class: "d-flex flex-row justify-end" },
}));
const __VLS_42 = __VLS_41({
    modelValue: (__VLS_ctx.tragedy),
    inline: true,
    ...{ class: "d-flex flex-row justify-end" },
}, ...__VLS_functionalComponentArgsRest(__VLS_41));
__VLS_43.slots.default;
const __VLS_44 = {}.VRadio;
/** @type {[typeof __VLS_components.VRadio, typeof __VLS_components.vRadio, typeof __VLS_components.VRadio, typeof __VLS_components.vRadio, ]} */ ;
// @ts-ignore
const __VLS_45 = __VLS_asFunctionalComponent(__VLS_44, new __VLS_44({
    label: "0",
    value: "0",
}));
const __VLS_46 = __VLS_45({
    label: "0",
    value: "0",
}, ...__VLS_functionalComponentArgsRest(__VLS_45));
const __VLS_48 = {}.VRadio;
/** @type {[typeof __VLS_components.VRadio, typeof __VLS_components.vRadio, typeof __VLS_components.VRadio, typeof __VLS_components.vRadio, ]} */ ;
// @ts-ignore
const __VLS_49 = __VLS_asFunctionalComponent(__VLS_48, new __VLS_48({
    label: "1",
    value: "1",
}));
const __VLS_50 = __VLS_49({
    label: "1",
    value: "1",
}, ...__VLS_functionalComponentArgsRest(__VLS_49));
const __VLS_52 = {}.VRadio;
/** @type {[typeof __VLS_components.VRadio, typeof __VLS_components.vRadio, typeof __VLS_components.VRadio, typeof __VLS_components.vRadio, ]} */ ;
// @ts-ignore
const __VLS_53 = __VLS_asFunctionalComponent(__VLS_52, new __VLS_52({
    label: "2",
    value: "2",
}));
const __VLS_54 = __VLS_53({
    label: "2",
    value: "2",
}, ...__VLS_functionalComponentArgsRest(__VLS_53));
const __VLS_56 = {}.VRadio;
/** @type {[typeof __VLS_components.VRadio, typeof __VLS_components.vRadio, typeof __VLS_components.VRadio, typeof __VLS_components.vRadio, ]} */ ;
// @ts-ignore
const __VLS_57 = __VLS_asFunctionalComponent(__VLS_56, new __VLS_56({
    label: "3",
    value: "3",
}));
const __VLS_58 = __VLS_57({
    label: "3",
    value: "3",
}, ...__VLS_functionalComponentArgsRest(__VLS_57));
var __VLS_43;
var __VLS_39;
const __VLS_60 = {}.VCol;
/** @type {[typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ]} */ ;
// @ts-ignore
const __VLS_61 = __VLS_asFunctionalComponent(__VLS_60, new __VLS_60({
    cols: "12",
    ...{ class: "text-left" },
}));
const __VLS_62 = __VLS_61({
    cols: "12",
    ...{ class: "text-left" },
}, ...__VLS_functionalComponentArgsRest(__VLS_61));
__VLS_63.slots.default;
var __VLS_63;
const __VLS_64 = {}.VCol;
/** @type {[typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ]} */ ;
// @ts-ignore
const __VLS_65 = __VLS_asFunctionalComponent(__VLS_64, new __VLS_64({
    cols: "12",
}));
const __VLS_66 = __VLS_65({
    cols: "12",
}, ...__VLS_functionalComponentArgsRest(__VLS_65));
__VLS_67.slots.default;
const __VLS_68 = {}.VRadioGroup;
/** @type {[typeof __VLS_components.VRadioGroup, typeof __VLS_components.vRadioGroup, typeof __VLS_components.VRadioGroup, typeof __VLS_components.vRadioGroup, ]} */ ;
// @ts-ignore
const __VLS_69 = __VLS_asFunctionalComponent(__VLS_68, new __VLS_68({
    modelValue: (__VLS_ctx.doom),
    inline: true,
    ...{ class: "d-flex flex-row justify-end" },
}));
const __VLS_70 = __VLS_69({
    modelValue: (__VLS_ctx.doom),
    inline: true,
    ...{ class: "d-flex flex-row justify-end" },
}, ...__VLS_functionalComponentArgsRest(__VLS_69));
__VLS_71.slots.default;
const __VLS_72 = {}.VRadio;
/** @type {[typeof __VLS_components.VRadio, typeof __VLS_components.vRadio, typeof __VLS_components.VRadio, typeof __VLS_components.vRadio, ]} */ ;
// @ts-ignore
const __VLS_73 = __VLS_asFunctionalComponent(__VLS_72, new __VLS_72({
    label: "0",
    value: "0",
}));
const __VLS_74 = __VLS_73({
    label: "0",
    value: "0",
}, ...__VLS_functionalComponentArgsRest(__VLS_73));
const __VLS_76 = {}.VRadio;
/** @type {[typeof __VLS_components.VRadio, typeof __VLS_components.vRadio, typeof __VLS_components.VRadio, typeof __VLS_components.vRadio, ]} */ ;
// @ts-ignore
const __VLS_77 = __VLS_asFunctionalComponent(__VLS_76, new __VLS_76({
    label: "1",
    value: "1",
}));
const __VLS_78 = __VLS_77({
    label: "1",
    value: "1",
}, ...__VLS_functionalComponentArgsRest(__VLS_77));
const __VLS_80 = {}.VRadio;
/** @type {[typeof __VLS_components.VRadio, typeof __VLS_components.vRadio, typeof __VLS_components.VRadio, typeof __VLS_components.vRadio, ]} */ ;
// @ts-ignore
const __VLS_81 = __VLS_asFunctionalComponent(__VLS_80, new __VLS_80({
    label: "2",
    value: "2",
}));
const __VLS_82 = __VLS_81({
    label: "2",
    value: "2",
}, ...__VLS_functionalComponentArgsRest(__VLS_81));
const __VLS_84 = {}.VRadio;
/** @type {[typeof __VLS_components.VRadio, typeof __VLS_components.vRadio, typeof __VLS_components.VRadio, typeof __VLS_components.vRadio, ]} */ ;
// @ts-ignore
const __VLS_85 = __VLS_asFunctionalComponent(__VLS_84, new __VLS_84({
    label: "3",
    value: "3",
}));
const __VLS_86 = __VLS_85({
    label: "3",
    value: "3",
}, ...__VLS_functionalComponentArgsRest(__VLS_85));
var __VLS_71;
var __VLS_67;
const __VLS_88 = {}.VCol;
/** @type {[typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ]} */ ;
// @ts-ignore
const __VLS_89 = __VLS_asFunctionalComponent(__VLS_88, new __VLS_88({
    cols: "12",
    ...{ class: "text-left" },
}));
const __VLS_90 = __VLS_89({
    cols: "12",
    ...{ class: "text-left" },
}, ...__VLS_functionalComponentArgsRest(__VLS_89));
__VLS_91.slots.default;
var __VLS_91;
const __VLS_92 = {}.VCol;
/** @type {[typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ]} */ ;
// @ts-ignore
const __VLS_93 = __VLS_asFunctionalComponent(__VLS_92, new __VLS_92({
    cols: "12",
}));
const __VLS_94 = __VLS_93({
    cols: "12",
}, ...__VLS_functionalComponentArgsRest(__VLS_93));
__VLS_95.slots.default;
const __VLS_96 = {}.VRadioGroup;
/** @type {[typeof __VLS_components.VRadioGroup, typeof __VLS_components.vRadioGroup, typeof __VLS_components.VRadioGroup, typeof __VLS_components.vRadioGroup, ]} */ ;
// @ts-ignore
const __VLS_97 = __VLS_asFunctionalComponent(__VLS_96, new __VLS_96({
    modelValue: (__VLS_ctx.heroism),
    inline: true,
    ...{ class: "d-flex flex-row justify-end" },
}));
const __VLS_98 = __VLS_97({
    modelValue: (__VLS_ctx.heroism),
    inline: true,
    ...{ class: "d-flex flex-row justify-end" },
}, ...__VLS_functionalComponentArgsRest(__VLS_97));
__VLS_99.slots.default;
const __VLS_100 = {}.VRadio;
/** @type {[typeof __VLS_components.VRadio, typeof __VLS_components.vRadio, typeof __VLS_components.VRadio, typeof __VLS_components.vRadio, ]} */ ;
// @ts-ignore
const __VLS_101 = __VLS_asFunctionalComponent(__VLS_100, new __VLS_100({
    label: "0",
    value: "0",
}));
const __VLS_102 = __VLS_101({
    label: "0",
    value: "0",
}, ...__VLS_functionalComponentArgsRest(__VLS_101));
const __VLS_104 = {}.VRadio;
/** @type {[typeof __VLS_components.VRadio, typeof __VLS_components.vRadio, typeof __VLS_components.VRadio, typeof __VLS_components.vRadio, ]} */ ;
// @ts-ignore
const __VLS_105 = __VLS_asFunctionalComponent(__VLS_104, new __VLS_104({
    label: "1",
    value: "1",
}));
const __VLS_106 = __VLS_105({
    label: "1",
    value: "1",
}, ...__VLS_functionalComponentArgsRest(__VLS_105));
const __VLS_108 = {}.VRadio;
/** @type {[typeof __VLS_components.VRadio, typeof __VLS_components.vRadio, typeof __VLS_components.VRadio, typeof __VLS_components.vRadio, ]} */ ;
// @ts-ignore
const __VLS_109 = __VLS_asFunctionalComponent(__VLS_108, new __VLS_108({
    label: "2",
    value: "2",
}));
const __VLS_110 = __VLS_109({
    label: "2",
    value: "2",
}, ...__VLS_functionalComponentArgsRest(__VLS_109));
const __VLS_112 = {}.VRadio;
/** @type {[typeof __VLS_components.VRadio, typeof __VLS_components.vRadio, typeof __VLS_components.VRadio, typeof __VLS_components.vRadio, ]} */ ;
// @ts-ignore
const __VLS_113 = __VLS_asFunctionalComponent(__VLS_112, new __VLS_112({
    label: "3",
    value: "3",
}));
const __VLS_114 = __VLS_113({
    label: "3",
    value: "3",
}, ...__VLS_functionalComponentArgsRest(__VLS_113));
var __VLS_99;
var __VLS_95;
var __VLS_3;
/** @type {__VLS_StyleScopedClasses['form-control']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['text-left']} */ ;
/** @type {__VLS_StyleScopedClasses['d-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-row']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-end']} */ ;
/** @type {__VLS_StyleScopedClasses['text-left']} */ ;
/** @type {__VLS_StyleScopedClasses['d-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-row']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-end']} */ ;
/** @type {__VLS_StyleScopedClasses['text-left']} */ ;
/** @type {__VLS_StyleScopedClasses['d-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-row']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-end']} */ ;
/** @type {__VLS_StyleScopedClasses['text-left']} */ ;
/** @type {__VLS_StyleScopedClasses['d-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-row']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-end']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            perseverance: perseverance,
            tragedy: tragedy,
            doom: doom,
            heroism: heroism,
        };
    },
    __typeProps: {},
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
    __typeProps: {},
});
; /* PartiallyEnd: #4569/main.vue */
