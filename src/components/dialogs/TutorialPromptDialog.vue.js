/// <reference types="../../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import { ref, computed, watch } from 'vue';
import { useDisplay } from 'vuetify';
import { useTutorialStore } from '@/store/TutorialStore';
import AssemblyGuide from '@/components/AssemblyGuide.vue';
const props = defineProps({
    startWithGuide: {
        type: Boolean,
        default: false,
    },
});
const { mobile } = useDisplay();
const tutorialStore = useTutorialStore();
const dialog = defineModel('modelValue', { type: Boolean, default: false });
const emit = defineEmits(['tutorial-completed']);
const dontShowAgain = ref(false);
const assemblyDialog = ref(false);
const isMobile = computed(() => mobile.value);
watch(dialog, (newVal) => {
    if (newVal && props.startWithGuide) {
        dialog.value = false;
        assemblyDialog.value = true;
    }
});
const handleYes = () => {
    if (dontShowAgain.value) {
        tutorialStore.setInitialSetupPreference(true);
    }
    dialog.value = false;
    assemblyDialog.value = true;
};
const handleNo = () => {
    if (dontShowAgain.value) {
        tutorialStore.setInitialSetupPreference(true);
    }
    dialog.value = false;
    emit('tutorial-completed');
};
const closeAssemblyGuide = () => {
    assemblyDialog.value = false;
    emit('tutorial-completed');
};
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_defaults = {
    'modelValue': false,
};
const __VLS_modelEmit = defineEmits();
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
// CSS variable injection 
// CSS variable injection end 
const __VLS_0 = {}.VDialog;
/** @type {[typeof __VLS_components.VDialog, typeof __VLS_components.vDialog, typeof __VLS_components.VDialog, typeof __VLS_components.vDialog, ]} */ ;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
    modelValue: (__VLS_ctx.dialog),
    maxWidth: (__VLS_ctx.isMobile ? '100%' : '600'),
    fullscreen: (__VLS_ctx.isMobile),
    persistent: true,
    transition: (__VLS_ctx.isMobile ? 'dialog-bottom-transition' : 'dialog-transition'),
}));
const __VLS_2 = __VLS_1({
    modelValue: (__VLS_ctx.dialog),
    maxWidth: (__VLS_ctx.isMobile ? '100%' : '600'),
    fullscreen: (__VLS_ctx.isMobile),
    persistent: true,
    transition: (__VLS_ctx.isMobile ? 'dialog-bottom-transition' : 'dialog-transition'),
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
__VLS_3.slots.default;
const __VLS_4 = {}.VCard;
/** @type {[typeof __VLS_components.VCard, typeof __VLS_components.vCard, typeof __VLS_components.VCard, typeof __VLS_components.vCard, ]} */ ;
// @ts-ignore
const __VLS_5 = __VLS_asFunctionalComponent(__VLS_4, new __VLS_4({
    ...{ class: "dark-background" },
}));
const __VLS_6 = __VLS_5({
    ...{ class: "dark-background" },
}, ...__VLS_functionalComponentArgsRest(__VLS_5));
__VLS_7.slots.default;
const __VLS_8 = {}.VCardTitle;
/** @type {[typeof __VLS_components.VCardTitle, typeof __VLS_components.vCardTitle, typeof __VLS_components.VCardTitle, typeof __VLS_components.vCardTitle, ]} */ ;
// @ts-ignore
const __VLS_9 = __VLS_asFunctionalComponent(__VLS_8, new __VLS_8({
    ...{ class: "text-h5 pa-4 pa-sm-6" },
}));
const __VLS_10 = __VLS_9({
    ...{ class: "text-h5 pa-4 pa-sm-6" },
}, ...__VLS_functionalComponentArgsRest(__VLS_9));
__VLS_11.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "d-flex align-center" },
});
const __VLS_12 = {}.VIcon;
/** @type {[typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, ]} */ ;
// @ts-ignore
const __VLS_13 = __VLS_asFunctionalComponent(__VLS_12, new __VLS_12({
    color: "primary",
    size: (__VLS_ctx.isMobile ? 28 : 32),
    ...{ class: "mr-2" },
}));
const __VLS_14 = __VLS_13({
    color: "primary",
    size: (__VLS_ctx.isMobile ? 28 : 32),
    ...{ class: "mr-2" },
}, ...__VLS_functionalComponentArgsRest(__VLS_13));
__VLS_15.slots.default;
var __VLS_15;
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: (__VLS_ctx.isMobile ? 'text-h6' : 'text-h5') },
});
var __VLS_11;
const __VLS_16 = {}.VCardText;
/** @type {[typeof __VLS_components.VCardText, typeof __VLS_components.vCardText, typeof __VLS_components.VCardText, typeof __VLS_components.vCardText, ]} */ ;
// @ts-ignore
const __VLS_17 = __VLS_asFunctionalComponent(__VLS_16, new __VLS_16({
    ...{ class: "pa-4 pa-sm-6" },
}));
const __VLS_18 = __VLS_17({
    ...{ class: "pa-4 pa-sm-6" },
}, ...__VLS_functionalComponentArgsRest(__VLS_17));
__VLS_19.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
    ...{ class: "text-body-1 mb-4" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
    ...{ class: "text-body-2 text-grey" },
});
var __VLS_19;
const __VLS_20 = {}.VCardActions;
/** @type {[typeof __VLS_components.VCardActions, typeof __VLS_components.vCardActions, typeof __VLS_components.VCardActions, typeof __VLS_components.vCardActions, ]} */ ;
// @ts-ignore
const __VLS_21 = __VLS_asFunctionalComponent(__VLS_20, new __VLS_20({
    ...{ class: "pa-4 pa-sm-6 flex-column align-start" },
}));
const __VLS_22 = __VLS_21({
    ...{ class: "pa-4 pa-sm-6 flex-column align-start" },
}, ...__VLS_functionalComponentArgsRest(__VLS_21));
__VLS_23.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "d-flex w-100 justify-end mb-3 flex-wrap gap-2" },
});
const __VLS_24 = {}.VBtn;
/** @type {[typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ]} */ ;
// @ts-ignore
const __VLS_25 = __VLS_asFunctionalComponent(__VLS_24, new __VLS_24({
    ...{ 'onClick': {} },
    color: "grey",
    variant: "text",
    block: (__VLS_ctx.isMobile),
    size: (__VLS_ctx.isMobile ? 'large' : 'default'),
}));
const __VLS_26 = __VLS_25({
    ...{ 'onClick': {} },
    color: "grey",
    variant: "text",
    block: (__VLS_ctx.isMobile),
    size: (__VLS_ctx.isMobile ? 'large' : 'default'),
}, ...__VLS_functionalComponentArgsRest(__VLS_25));
let __VLS_28;
let __VLS_29;
let __VLS_30;
const __VLS_31 = {
    onClick: (__VLS_ctx.handleNo)
};
__VLS_27.slots.default;
var __VLS_27;
const __VLS_32 = {}.VBtn;
/** @type {[typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ]} */ ;
// @ts-ignore
const __VLS_33 = __VLS_asFunctionalComponent(__VLS_32, new __VLS_32({
    ...{ 'onClick': {} },
    color: "primary",
    variant: "elevated",
    ...{ class: (__VLS_ctx.isMobile ? '' : 'ml-2') },
    block: (__VLS_ctx.isMobile),
    size: (__VLS_ctx.isMobile ? 'large' : 'default'),
}));
const __VLS_34 = __VLS_33({
    ...{ 'onClick': {} },
    color: "primary",
    variant: "elevated",
    ...{ class: (__VLS_ctx.isMobile ? '' : 'ml-2') },
    block: (__VLS_ctx.isMobile),
    size: (__VLS_ctx.isMobile ? 'large' : 'default'),
}, ...__VLS_functionalComponentArgsRest(__VLS_33));
let __VLS_36;
let __VLS_37;
let __VLS_38;
const __VLS_39 = {
    onClick: (__VLS_ctx.handleYes)
};
__VLS_35.slots.default;
if (!__VLS_ctx.isMobile) {
    const __VLS_40 = {}.VIcon;
    /** @type {[typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, ]} */ ;
    // @ts-ignore
    const __VLS_41 = __VLS_asFunctionalComponent(__VLS_40, new __VLS_40({
        start: true,
    }));
    const __VLS_42 = __VLS_41({
        start: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_41));
    __VLS_43.slots.default;
    var __VLS_43;
}
var __VLS_35;
const __VLS_44 = {}.VCheckbox;
/** @type {[typeof __VLS_components.VCheckbox, typeof __VLS_components.vCheckbox, typeof __VLS_components.VCheckbox, typeof __VLS_components.vCheckbox, ]} */ ;
// @ts-ignore
const __VLS_45 = __VLS_asFunctionalComponent(__VLS_44, new __VLS_44({
    modelValue: (__VLS_ctx.dontShowAgain),
    label: "Don't show this message again",
    hideDetails: true,
    density: "compact",
    ...{ class: "mt-0" },
}));
const __VLS_46 = __VLS_45({
    modelValue: (__VLS_ctx.dontShowAgain),
    label: "Don't show this message again",
    hideDetails: true,
    density: "compact",
    ...{ class: "mt-0" },
}, ...__VLS_functionalComponentArgsRest(__VLS_45));
var __VLS_23;
var __VLS_7;
var __VLS_3;
const __VLS_48 = {}.VDialog;
/** @type {[typeof __VLS_components.VDialog, typeof __VLS_components.vDialog, typeof __VLS_components.VDialog, typeof __VLS_components.vDialog, ]} */ ;
// @ts-ignore
const __VLS_49 = __VLS_asFunctionalComponent(__VLS_48, new __VLS_48({
    modelValue: (__VLS_ctx.assemblyDialog),
    maxWidth: (__VLS_ctx.isMobile ? '100%' : '1200'),
    fullscreen: (__VLS_ctx.isMobile),
    persistent: true,
    scrollable: true,
    transition: (__VLS_ctx.isMobile ? 'dialog-bottom-transition' : 'dialog-transition'),
}));
const __VLS_50 = __VLS_49({
    modelValue: (__VLS_ctx.assemblyDialog),
    maxWidth: (__VLS_ctx.isMobile ? '100%' : '1200'),
    fullscreen: (__VLS_ctx.isMobile),
    persistent: true,
    scrollable: true,
    transition: (__VLS_ctx.isMobile ? 'dialog-bottom-transition' : 'dialog-transition'),
}, ...__VLS_functionalComponentArgsRest(__VLS_49));
__VLS_51.slots.default;
const __VLS_52 = {}.VCard;
/** @type {[typeof __VLS_components.VCard, typeof __VLS_components.vCard, typeof __VLS_components.VCard, typeof __VLS_components.vCard, ]} */ ;
// @ts-ignore
const __VLS_53 = __VLS_asFunctionalComponent(__VLS_52, new __VLS_52({
    ...{ class: "dark-background" },
}));
const __VLS_54 = __VLS_53({
    ...{ class: "dark-background" },
}, ...__VLS_functionalComponentArgsRest(__VLS_53));
__VLS_55.slots.default;
const __VLS_56 = {}.VCardTitle;
/** @type {[typeof __VLS_components.VCardTitle, typeof __VLS_components.vCardTitle, typeof __VLS_components.VCardTitle, typeof __VLS_components.vCardTitle, ]} */ ;
// @ts-ignore
const __VLS_57 = __VLS_asFunctionalComponent(__VLS_56, new __VLS_56({
    ...{ class: "d-flex justify-space-between align-center pa-4 sticky-header" },
}));
const __VLS_58 = __VLS_57({
    ...{ class: "d-flex justify-space-between align-center pa-4 sticky-header" },
}, ...__VLS_functionalComponentArgsRest(__VLS_57));
__VLS_59.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: (__VLS_ctx.isMobile ? 'text-h6' : 'text-h5') },
});
const __VLS_60 = {}.VBtn;
/** @type {[typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ]} */ ;
// @ts-ignore
const __VLS_61 = __VLS_asFunctionalComponent(__VLS_60, new __VLS_60({
    ...{ 'onClick': {} },
    icon: true,
    variant: "text",
    size: (__VLS_ctx.isMobile ? 'small' : 'default'),
}));
const __VLS_62 = __VLS_61({
    ...{ 'onClick': {} },
    icon: true,
    variant: "text",
    size: (__VLS_ctx.isMobile ? 'small' : 'default'),
}, ...__VLS_functionalComponentArgsRest(__VLS_61));
let __VLS_64;
let __VLS_65;
let __VLS_66;
const __VLS_67 = {
    onClick: (__VLS_ctx.closeAssemblyGuide)
};
__VLS_63.slots.default;
const __VLS_68 = {}.VIcon;
/** @type {[typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, ]} */ ;
// @ts-ignore
const __VLS_69 = __VLS_asFunctionalComponent(__VLS_68, new __VLS_68({}));
const __VLS_70 = __VLS_69({}, ...__VLS_functionalComponentArgsRest(__VLS_69));
__VLS_71.slots.default;
var __VLS_71;
var __VLS_63;
var __VLS_59;
const __VLS_72 = {}.VCardText;
/** @type {[typeof __VLS_components.VCardText, typeof __VLS_components.vCardText, typeof __VLS_components.VCardText, typeof __VLS_components.vCardText, ]} */ ;
// @ts-ignore
const __VLS_73 = __VLS_asFunctionalComponent(__VLS_72, new __VLS_72({
    ...{ class: "pa-0" },
}));
const __VLS_74 = __VLS_73({
    ...{ class: "pa-0" },
}, ...__VLS_functionalComponentArgsRest(__VLS_73));
__VLS_75.slots.default;
/** @type {[typeof AssemblyGuide, ]} */ ;
// @ts-ignore
const __VLS_76 = __VLS_asFunctionalComponent(AssemblyGuide, new AssemblyGuide({}));
const __VLS_77 = __VLS_76({}, ...__VLS_functionalComponentArgsRest(__VLS_76));
var __VLS_75;
var __VLS_55;
var __VLS_51;
/** @type {__VLS_StyleScopedClasses['dark-background']} */ ;
/** @type {__VLS_StyleScopedClasses['text-h5']} */ ;
/** @type {__VLS_StyleScopedClasses['pa-4']} */ ;
/** @type {__VLS_StyleScopedClasses['pa-sm-6']} */ ;
/** @type {__VLS_StyleScopedClasses['d-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['align-center']} */ ;
/** @type {__VLS_StyleScopedClasses['mr-2']} */ ;
/** @type {__VLS_StyleScopedClasses['pa-4']} */ ;
/** @type {__VLS_StyleScopedClasses['pa-sm-6']} */ ;
/** @type {__VLS_StyleScopedClasses['text-body-1']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['text-body-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-grey']} */ ;
/** @type {__VLS_StyleScopedClasses['pa-4']} */ ;
/** @type {__VLS_StyleScopedClasses['pa-sm-6']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-column']} */ ;
/** @type {__VLS_StyleScopedClasses['align-start']} */ ;
/** @type {__VLS_StyleScopedClasses['d-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['w-100']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-end']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-3']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-wrap']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-0']} */ ;
/** @type {__VLS_StyleScopedClasses['dark-background']} */ ;
/** @type {__VLS_StyleScopedClasses['d-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-space-between']} */ ;
/** @type {__VLS_StyleScopedClasses['align-center']} */ ;
/** @type {__VLS_StyleScopedClasses['pa-4']} */ ;
/** @type {__VLS_StyleScopedClasses['sticky-header']} */ ;
/** @type {__VLS_StyleScopedClasses['pa-0']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            $emit: emit,
            AssemblyGuide: AssemblyGuide,
            dialog: dialog,
            dontShowAgain: dontShowAgain,
            assemblyDialog: assemblyDialog,
            isMobile: isMobile,
            handleYes: handleYes,
            handleNo: handleNo,
            closeAssemblyGuide: closeAssemblyGuide,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {
            $emit: emit,
        };
    },
});
; /* PartiallyEnd: #4569/main.vue */
