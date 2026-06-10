/// <reference types="../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import { ref, toRef, watch, computed } from "vue";
const props = defineProps();
const currentImage = ref("");
const frontImage = toRef(props, "frontImage");
currentImage.value = frontImage.value;
const showHelp = ref(false);
const helpOverlayImage = new URL("@/assets/monster/big/help.webp", import.meta.url).href;
const monsterColorMap = {
    "hellish flayer": "gray",
    abomination: "black",
    "skeleton archer": "white",
    "faceless conjurer": "gray",
    "skeleton knight": "white",
    "shadow witch": "white",
    "shadow knight": "black",
    executioner: "gray",
    "rotten flesh": "gray",
    "shadow vampire": "gray",
    "shadow cultist": "white",
    "corrupted farmer": "white",
    "shadow pain": "white",
    "shadow guardian": "gray",
    "gremlin horde": "white",
    "nagian hunter": "white",
    "gorgoness witch": "white",
    "grim doctor": "white",
    "gorgon hexer": "gray",
    "night stalker": "gray",
    "fell asteris": "gray",
    "hellspawn brute": "gray",
    "wurm offspring": "gray",
    "lady claw": "gray",
    "death messenger": "gray",
    "scout of darkness": "white",
    "bone reaper": "gray",
    "shadow mistress": "white",
    "wallking horror": "white",
    ravager: "white",
    "corrupted worm": "gray",
    hunter: "commander",
    archon: "commander",
    bane: "commander",
    thern: "commander",
    horde: "commander",
    "demon lord": "commander",
    hexer: "commander",
    spawn: "commander",
    ox: "commander",
    flinch: "commander",
    twin: "commander",
    doctor: "commander",
    "fallen sisters": "commander",
    witch: "commander",
    wermuggdir: "commander",
    "walking horror": "white",
};
const resolvedColor = computed(() => {
    const key = props.title?.toLowerCase().trim();
    return monsterColorMap[key] || "black";
});
const subtitleColor = computed(() => {
    switch (resolvedColor.value) {
        case "white":
        case "gray":
            return "black";
        case "commander":
            return "transparent";
        case "black":
        default:
            return "white";
    }
});
const showSubtitle = computed(() => resolvedColor.value !== "commander");
watch(frontImage, async (newImage) => {
    currentImage.value = newImage;
});
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
// CSS variable injection 
// CSS variable injection end 
const __VLS_0 = {}.VContainer;
/** @type {[typeof __VLS_components.VContainer, typeof __VLS_components.vContainer, typeof __VLS_components.VContainer, typeof __VLS_components.vContainer, ]} */ ;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
    maxWidth: "666",
    ...{ class: "d-flex justify-center" },
}));
const __VLS_2 = __VLS_1({
    maxWidth: "666",
    ...{ class: "d-flex justify-center" },
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
var __VLS_4 = {};
__VLS_3.slots.default;
const __VLS_5 = {}.VCardText;
/** @type {[typeof __VLS_components.VCardText, typeof __VLS_components.vCardText, typeof __VLS_components.VCardText, typeof __VLS_components.vCardText, ]} */ ;
// @ts-ignore
const __VLS_6 = __VLS_asFunctionalComponent(__VLS_5, new __VLS_5({
    ...{ class: "pa-0" },
    ...{ style: {} },
}));
const __VLS_7 = __VLS_6({
    ...{ class: "pa-0" },
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_6));
__VLS_8.slots.default;
const __VLS_9 = {}.VImg;
/** @type {[typeof __VLS_components.VImg, typeof __VLS_components.vImg, typeof __VLS_components.VImg, typeof __VLS_components.vImg, ]} */ ;
// @ts-ignore
const __VLS_10 = __VLS_asFunctionalComponent(__VLS_9, new __VLS_9({
    src: (__VLS_ctx.currentImage),
    width: "100%",
    ...{ style: {} },
}));
const __VLS_11 = __VLS_10({
    src: (__VLS_ctx.currentImage),
    width: "100%",
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_10));
__VLS_12.slots.default;
const __VLS_13 = {}.VBtn;
/** @type {[typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ]} */ ;
// @ts-ignore
const __VLS_14 = __VLS_asFunctionalComponent(__VLS_13, new __VLS_13({
    ...{ 'onClick': {} },
    icon: true,
    size: "x-small",
    ...{ style: {} },
}));
const __VLS_15 = __VLS_14({
    ...{ 'onClick': {} },
    icon: true,
    size: "x-small",
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_14));
let __VLS_17;
let __VLS_18;
let __VLS_19;
const __VLS_20 = {
    onClick: (...[$event]) => {
        __VLS_ctx.showHelp = true;
    }
};
__VLS_16.slots.default;
const __VLS_21 = {}.VIcon;
/** @type {[typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, ]} */ ;
// @ts-ignore
const __VLS_22 = __VLS_asFunctionalComponent(__VLS_21, new __VLS_21({
    color: "white",
}));
const __VLS_23 = __VLS_22({
    color: "white",
}, ...__VLS_functionalComponentArgsRest(__VLS_22));
__VLS_24.slots.default;
var __VLS_24;
var __VLS_16;
if (__VLS_ctx.showSubtitle) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "d-sm-none" },
        ...{ style: ({
                position: 'absolute',
                top: '24px',
                left: '60px',
                color: __VLS_ctx.subtitleColor,
                WebkitTextStroke: '0.4px white',
                padding: '6px',
                borderRadius: '6px',
                fontSize: '1.15rem',
                fontWeight: '600',
                zIndex: 2,
            }) },
    });
    (props.subTitle);
}
if (__VLS_ctx.showSubtitle) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "d-none d-sm-flex d-md-none" },
        ...{ style: ({
                position: 'absolute',
                top: '44px',
                left: '102px',
                color: __VLS_ctx.subtitleColor,
                WebkitTextStroke: '0.3px white',
                padding: '8px',
                borderRadius: '6px',
                fontSize: '1.45rem',
                fontWeight: '800',
                zIndex: 2,
            }) },
    });
    (props.subTitle);
}
if (__VLS_ctx.showSubtitle) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "d-none d-md-flex" },
        ...{ style: ({
                position: 'absolute',
                top: 'clamp(42px, 21vw, 24px)',
                left: 'clamp(98px, 21vw, 24px)',
                color: __VLS_ctx.subtitleColor,
                WebkitTextStroke: '0.4px white',
                padding: 'clamp(4px, 1vw, 12px)',
                borderRadius: '6px',
                fontSize: 'clamp(1.4rem, 1.5vw, 1rem)',
                fontWeight: '800',
                zIndex: 2,
            }) },
    });
    (props.subTitle);
}
if (__VLS_ctx.showHelp) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ style: {} },
        ...{ class: "d-flex align-center justify-center" },
    });
    const __VLS_25 = {}.VImg;
    /** @type {[typeof __VLS_components.VImg, typeof __VLS_components.vImg, ]} */ ;
    // @ts-ignore
    const __VLS_26 = __VLS_asFunctionalComponent(__VLS_25, new __VLS_25({
        src: (__VLS_ctx.helpOverlayImage),
        width: "90%",
    }));
    const __VLS_27 = __VLS_26({
        src: (__VLS_ctx.helpOverlayImage),
        width: "90%",
    }, ...__VLS_functionalComponentArgsRest(__VLS_26));
    const __VLS_29 = {}.VBtn;
    /** @type {[typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ]} */ ;
    // @ts-ignore
    const __VLS_30 = __VLS_asFunctionalComponent(__VLS_29, new __VLS_29({
        ...{ 'onClick': {} },
        icon: true,
        size: "small",
        color: "white",
        ...{ style: {} },
    }));
    const __VLS_31 = __VLS_30({
        ...{ 'onClick': {} },
        icon: true,
        size: "small",
        color: "white",
        ...{ style: {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_30));
    let __VLS_33;
    let __VLS_34;
    let __VLS_35;
    const __VLS_36 = {
        onClick: (...[$event]) => {
            if (!(__VLS_ctx.showHelp))
                return;
            __VLS_ctx.showHelp = false;
        }
    };
    __VLS_32.slots.default;
    const __VLS_37 = {}.VIcon;
    /** @type {[typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, ]} */ ;
    // @ts-ignore
    const __VLS_38 = __VLS_asFunctionalComponent(__VLS_37, new __VLS_37({}));
    const __VLS_39 = __VLS_38({}, ...__VLS_functionalComponentArgsRest(__VLS_38));
    __VLS_40.slots.default;
    var __VLS_40;
    var __VLS_32;
}
var __VLS_12;
var __VLS_8;
var __VLS_3;
/** @type {__VLS_StyleScopedClasses['d-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['pa-0']} */ ;
/** @type {__VLS_StyleScopedClasses['d-sm-none']} */ ;
/** @type {__VLS_StyleScopedClasses['d-none']} */ ;
/** @type {__VLS_StyleScopedClasses['d-sm-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['d-md-none']} */ ;
/** @type {__VLS_StyleScopedClasses['d-none']} */ ;
/** @type {__VLS_StyleScopedClasses['d-md-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['d-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['align-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            currentImage: currentImage,
            showHelp: showHelp,
            helpOverlayImage: helpOverlayImage,
            subtitleColor: subtitleColor,
            showSubtitle: showSubtitle,
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
