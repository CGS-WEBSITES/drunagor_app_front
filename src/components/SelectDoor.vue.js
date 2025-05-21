/// <reference types="../../node_modules/.vue-global-types/vue_3.5_false.d.ts" />
import { CampaignStore } from "@/store/CampaignStore";
import { ref, watch, computed } from "vue";
import { useI18n } from "vue-i18n";
const props = defineProps();
const { t } = useI18n();
const campaignStore = CampaignStore();
const campaign = campaignStore.find(props.campaignId);
// Opções de campanha
const campaignOptions = [
    "Wing 1 - Tutorial",
    "Wing 1 - Advanced",
    "Wing 2 - Advanced",
];
// Lista completa de portas
const allDoorOptions = [
    "DOOR 1 - THE BARRICADED PATH",
    "DOOR 2 - THE KEEP'S COURTYARD",
    "DOOR 3 - THE ENTRY HALL",
    "DOOR 4 - THE GREAT HALL",
    "DOOR 1 - THE BARRICADED PATH",
    "DOOR 2 - THE KEEP'S COURTYARD",
    "DOOR 3 - THE ENTRY HALL",
    "DOOR 4 - THE GREAT HALL",
    "DOOR 1 - THE GREAT CISTERN",
    "DOOR 2 - THE DUNGEONS OF OBLIVION",
    "DOOR 3 - THE ALCHEMY LAB",
    "DOOR 4 - THE BURIED ARMORY",
    "DOOR 5 - THERE AND BACK AGAIN",
];
const selectedWing = ref(campaign.wing || "");
const selectedDoor = ref(campaign.door || "");
// Computa as portas com base na campanha escolhida
const filteredDoors = computed(() => {
    switch (selectedWing.value) {
        case "Wing 1 - Tutorial":
            return allDoorOptions.slice(0, 4);
        case "Wing 1 - Advanced":
            return allDoorOptions.slice(4, 8);
        case "Wing 2 - Advanced":
            return allDoorOptions.slice(8, 13);
        default:
            return [];
    }
});
// Atualiza o store ao selecionar uma wing
watch(selectedWing, (newValue) => {
    campaignStore.find(props.campaignId).wing = newValue;
});
// Atualiza o store ao selecionar uma porta
watch(selectedDoor, (newValue) => {
    campaignStore.find(props.campaignId).door = newValue;
});
; /* PartiallyEnd: #3632/scriptSetup.vue */
function __VLS_template() {
    const __VLS_ctx = {};
    let __VLS_components;
    let __VLS_directives;
    const __VLS_0 = {}.VSelect;
    /** @type { [typeof __VLS_components.VSelect, typeof __VLS_components.vSelect, ] } */ ;
    // @ts-ignore
    const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
        modelValue: ((__VLS_ctx.selectedWing)),
        label: ("Select Wing"),
        items: ((__VLS_ctx.campaignOptions)),
        variant: ("outlined"),
        ...{ class: ("mb-4") },
        clearable: (true),
    }));
    const __VLS_2 = __VLS_1({
        modelValue: ((__VLS_ctx.selectedWing)),
        label: ("Select Wing"),
        items: ((__VLS_ctx.campaignOptions)),
        variant: ("outlined"),
        ...{ class: ("mb-4") },
        clearable: (true),
    }, ...__VLS_functionalComponentArgsRest(__VLS_1));
    const __VLS_6 = {}.VSelect;
    /** @type { [typeof __VLS_components.VSelect, typeof __VLS_components.vSelect, ] } */ ;
    // @ts-ignore
    const __VLS_7 = __VLS_asFunctionalComponent(__VLS_6, new __VLS_6({
        modelValue: ((__VLS_ctx.selectedDoor)),
        label: ((('Select Door'))),
        items: ((__VLS_ctx.filteredDoors)),
        variant: ("outlined"),
        disabled: ((!__VLS_ctx.selectedWing)),
        clearable: (true),
    }));
    const __VLS_8 = __VLS_7({
        modelValue: ((__VLS_ctx.selectedDoor)),
        label: ((('Select Door'))),
        items: ((__VLS_ctx.filteredDoors)),
        variant: ("outlined"),
        disabled: ((!__VLS_ctx.selectedWing)),
        clearable: (true),
    }, ...__VLS_functionalComponentArgsRest(__VLS_7));
    ['mb-4',];
    var __VLS_slots;
    var $slots;
    let __VLS_inheritedAttrs;
    var $attrs;
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
            campaignOptions: campaignOptions,
            selectedWing: selectedWing,
            selectedDoor: selectedDoor,
            filteredDoors: filteredDoors,
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
