/// <reference types="../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import { CampaignStore } from "@/store/CampaignStore";
import { useUserStore } from "@/store/UserStore";
import { ref, computed, onMounted } from "vue";
import { useI18n } from "vue-i18n";
const props = defineProps();
const { t } = useI18n();
const userStore = useUserStore();
const campaignStore = CampaignStore();
const isAdmin = ref(false);
const loading = ref(true);
const runes = computed({
    get() {
        return campaignStore.find(props.campaignId)?.sequentialAdventureRunes ?? 0;
    },
    set(newValue) {
        if (isAdmin.value) {
            campaignStore.updateCampaignProperty(props.campaignId, 'sequentialAdventureRunes', newValue);
        }
    },
});
const checkUserRole = async () => {
    isAdmin.value = true;
    loading.value = false;
};
onMounted(checkUserRole);
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
if (__VLS_ctx.isAdmin && !__VLS_ctx.loading) {
    const __VLS_0 = {}.VNumberInput;
    /** @type {[typeof __VLS_components.VNumberInput, typeof __VLS_components.vNumberInput, typeof __VLS_components.VNumberInput, typeof __VLS_components.vNumberInput, ]} */ ;
    // @ts-ignore
    const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
        reverse: (false),
        controlVariant: "split",
        label: (__VLS_ctx.t('text.number-of-runes')),
        hideInput: (false),
        inset: (false),
        variant: "solo-filled",
        id: "runes",
        min: (0),
        modelValue: (__VLS_ctx.runes),
    }));
    const __VLS_2 = __VLS_1({
        reverse: (false),
        controlVariant: "split",
        label: (__VLS_ctx.t('text.number-of-runes')),
        hideInput: (false),
        inset: (false),
        variant: "solo-filled",
        id: "runes",
        min: (0),
        modelValue: (__VLS_ctx.runes),
    }, ...__VLS_functionalComponentArgsRest(__VLS_1));
    var __VLS_4 = {};
    var __VLS_3;
}
else if (!__VLS_ctx.loading) {
    const __VLS_5 = {}.VTextField;
    /** @type {[typeof __VLS_components.VTextField, typeof __VLS_components.vTextField, typeof __VLS_components.VTextField, typeof __VLS_components.vTextField, ]} */ ;
    // @ts-ignore
    const __VLS_6 = __VLS_asFunctionalComponent(__VLS_5, new __VLS_5({
        modelValue: (__VLS_ctx.runes),
        label: (__VLS_ctx.t('text.number-of-runes')),
        variant: "solo-filled",
        readonly: true,
        persistentHint: true,
        disabled: (!__VLS_ctx.isAdmin),
    }));
    const __VLS_7 = __VLS_6({
        modelValue: (__VLS_ctx.runes),
        label: (__VLS_ctx.t('text.number-of-runes')),
        variant: "solo-filled",
        readonly: true,
        persistentHint: true,
        disabled: (!__VLS_ctx.isAdmin),
    }, ...__VLS_functionalComponentArgsRest(__VLS_6));
    var __VLS_9 = {};
    var __VLS_8;
}
else {
    const __VLS_10 = {}.VTextField;
    /** @type {[typeof __VLS_components.VTextField, typeof __VLS_components.vTextField, typeof __VLS_components.VTextField, typeof __VLS_components.vTextField, ]} */ ;
    // @ts-ignore
    const __VLS_11 = __VLS_asFunctionalComponent(__VLS_10, new __VLS_10({
        label: (__VLS_ctx.t('text.number-of-runes')),
        variant: "solo-filled",
        loading: true,
        readonly: true,
        disabled: (!__VLS_ctx.isAdmin),
    }));
    const __VLS_12 = __VLS_11({
        label: (__VLS_ctx.t('text.number-of-runes')),
        variant: "solo-filled",
        loading: true,
        readonly: true,
        disabled: (!__VLS_ctx.isAdmin),
    }, ...__VLS_functionalComponentArgsRest(__VLS_11));
    var __VLS_14 = {};
    var __VLS_13;
}
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            t: t,
            isAdmin: isAdmin,
            loading: loading,
            runes: runes,
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
