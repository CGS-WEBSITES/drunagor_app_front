/// <reference types="../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import { CampaignStore } from "@/store/CampaignStore";
import { computed } from "vue";
import { useI18n } from "vue-i18n";
const props = withDefaults(defineProps(), {
    isAdmin: true,
});
const { t } = useI18n();
const campaignStore = CampaignStore();
const partyName = computed({
    get() {
        return campaignStore.find(props.campaignId)?.name ?? '';
    },
    set(newValue) {
        if (props.isAdmin) {
            campaignStore.updateCampaignProperty(props.campaignId, 'name', newValue);
        }
    },
});
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_withDefaultsArg = (function (t) { return t; })({
    isAdmin: true,
});
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
if (__VLS_ctx.isAdmin) {
    const __VLS_0 = {}.VTextField;
    /** @type {[typeof __VLS_components.VTextField, typeof __VLS_components.vTextField, typeof __VLS_components.VTextField, typeof __VLS_components.vTextField, ]} */ ;
    // @ts-ignore
    const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
        label: (__VLS_ctx.t('text.party-name')),
        variant: "solo-filled",
        modelValue: (__VLS_ctx.partyName),
    }));
    const __VLS_2 = __VLS_1({
        label: (__VLS_ctx.t('text.party-name')),
        variant: "solo-filled",
        modelValue: (__VLS_ctx.partyName),
    }, ...__VLS_functionalComponentArgsRest(__VLS_1));
    var __VLS_4 = {};
    var __VLS_3;
}
else {
    const __VLS_5 = {}.VTextField;
    /** @type {[typeof __VLS_components.VTextField, typeof __VLS_components.vTextField, typeof __VLS_components.VTextField, typeof __VLS_components.vTextField, ]} */ ;
    // @ts-ignore
    const __VLS_6 = __VLS_asFunctionalComponent(__VLS_5, new __VLS_5({
        label: (__VLS_ctx.t('text.party-name')),
        variant: "solo-filled",
        modelValue: (__VLS_ctx.partyName),
        readonly: true,
        disabled: true,
    }));
    const __VLS_7 = __VLS_6({
        label: (__VLS_ctx.t('text.party-name')),
        variant: "solo-filled",
        modelValue: (__VLS_ctx.partyName),
        readonly: true,
        disabled: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_6));
    var __VLS_9 = {};
    var __VLS_8;
}
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            t: t,
            partyName: partyName,
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
