/// <reference types="../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import { ref, watch } from "vue";
import { CampaignStore } from "@/store/CampaignStore";
import { useI18n } from "vue-i18n";
import { ConfigurationStore } from "@/store/ConfigurationStore";
const props = defineProps();
const campaignStore = CampaignStore();
const configurationStore = ConfigurationStore();
const { t } = useI18n();
props.repository.load(configurationStore.enabledLanguage);
const statuses = props.repository.findAll();
const statusIds = ref([]);
statusIds.value = campaignStore.find(props.campaignId).statusIds ?? [];
function findStatuses(statusIds) {
    const statuses = [];
    statusIds.forEach((statusId) => {
        let status = props.repository.find(statusId);
        if (status) {
            statuses.push(status);
        }
    });
    return statuses;
}
watch(statusIds, (newStatusIds) => {
    campaignStore.find(props.campaignId).statusIds = newStatusIds;
});
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    'data-testid': "story-record-status",
});
const __VLS_0 = {}.VSelect;
/** @type {[typeof __VLS_components.VSelect, typeof __VLS_components.vSelect, typeof __VLS_components.VSelect, typeof __VLS_components.vSelect, ]} */ ;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
    modelValue: (__VLS_ctx.statusIds),
    clearable: true,
    chips: true,
    label: (__VLS_ctx.$t('text.add-or-remove-status')),
    hint: (__VLS_ctx.$t('text.status-info')),
    items: (__VLS_ctx.statuses),
    itemTitle: "name",
    itemValue: "id",
    multiple: true,
    variant: "outlined",
}));
const __VLS_2 = __VLS_1({
    modelValue: (__VLS_ctx.statusIds),
    clearable: true,
    chips: true,
    label: (__VLS_ctx.$t('text.add-or-remove-status')),
    hint: (__VLS_ctx.$t('text.status-info')),
    items: (__VLS_ctx.statuses),
    itemTitle: "name",
    itemValue: "id",
    multiple: true,
    variant: "outlined",
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
if (__VLS_ctx.statusIds.length > 0) {
    const __VLS_4 = {}.VSheet;
    /** @type {[typeof __VLS_components.VSheet, typeof __VLS_components.vSheet, typeof __VLS_components.VSheet, typeof __VLS_components.vSheet, ]} */ ;
    // @ts-ignore
    const __VLS_5 = __VLS_asFunctionalComponent(__VLS_4, new __VLS_4({
        rounded: true,
        border: "md",
        ...{ class: "mb-6 pa-6 text-white" },
    }));
    const __VLS_6 = __VLS_5({
        rounded: true,
        border: "md",
        ...{ class: "mb-6 pa-6 text-white" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_5));
    __VLS_7.slots.default;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.ul, __VLS_intrinsicElements.ul)({});
    for (const [status] of __VLS_getVForSourceType((__VLS_ctx.findStatuses(__VLS_ctx.statusIds)))) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.li, __VLS_intrinsicElements.li)({
            ...{ class: "py-1" },
            key: (status.id),
        });
        (status.name);
        if (status.effect) {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: "px-4 font-italic" },
            });
            (status.effect);
        }
    }
    var __VLS_7;
}
/** @type {__VLS_StyleScopedClasses['mb-6']} */ ;
/** @type {__VLS_StyleScopedClasses['pa-6']} */ ;
/** @type {__VLS_StyleScopedClasses['text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['py-1']} */ ;
/** @type {__VLS_StyleScopedClasses['px-4']} */ ;
/** @type {__VLS_StyleScopedClasses['font-italic']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            statuses: statuses,
            statusIds: statusIds,
            findStatuses: findStatuses,
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
