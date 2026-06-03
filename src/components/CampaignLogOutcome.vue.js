/// <reference types="../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import { ref, watch, computed, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import { CampaignStore } from "@/store/CampaignStore";
import { useUserStore } from "@/store/UserStore";
import { HeroStore } from "@/store/HeroStore";
import { ConfigurationStore } from "@/store/ConfigurationStore";
const props = defineProps();
const { t } = useI18n();
const heroStore = HeroStore();
const userStore = useUserStore();
const configurationStore = ConfigurationStore();
const campaignStore = CampaignStore();
const campaign = campaignStore.find(props.campaignId);
const outcomeIds = ref([]);
const isAdmin = ref(false);
const loading = ref(true);
const campaignHeroRef = ref(null);
props.repository.load(configurationStore.enabledLanguage);
const outcomes = props.repository.findAll();
const dynamicLabel = computed(() => {
    if (campaign && campaign.campaign === "underkeep") {
        return t("Select Dungeon Role");
    }
    return t("text.add-or-remove-outcome");
});
const dynamicHint = computed(() => {
    if (campaign && campaign.campaign === "underkeep") {
        return t("select dungeon role");
    }
    return t("text.outcome-info");
});
const outcomeDisplayText = computed(() => {
    if (outcomeIds.value.length === 0) {
        return t("text.no-outcomes", "No outcomes selected");
    }
    const activeOutcomes = findOutcomes(outcomeIds.value);
    return activeOutcomes.map((outcome) => outcome.name).join(", ");
});
const checkUserRole = async () => {
    isAdmin.value = true;
    loading.value = false;
};
function findOutcomes(outcomeIdsList) {
    const outcomesFound = [];
    outcomeIdsList.forEach((outcomeId) => {
        const outcome = props.repository.find(outcomeId);
        if (outcome) {
            outcomesFound.push(outcome);
        }
    });
    return outcomesFound;
}
watch(outcomeIds, (newOutcomeIds) => {
    if (isAdmin.value && campaignHeroRef.value) {
        campaignHeroRef.value.outcomeIds = [...newOutcomeIds];
    }
}, { deep: true });
onMounted(async () => {
    await checkUserRole();
    const hero = heroStore.findInCampaignOptional(props.heroId, props.campaignId);
    if (hero) {
        campaignHeroRef.value = hero;
        if (!hero.outcomeIds) {
            hero.outcomeIds = [];
        }
        outcomeIds.value = [...hero.outcomeIds];
    }
    else {
        console.warn(`[CampaignLogOutcome] Hero ${props.heroId} not found in campaign ${props.campaignId}`);
    }
});
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    'data-testid': ('campaign-log-outcome-' + __VLS_ctx.heroId),
});
if (__VLS_ctx.isAdmin && !__VLS_ctx.loading) {
    const __VLS_0 = {}.VSelect;
    /** @type {[typeof __VLS_components.VSelect, typeof __VLS_components.vSelect, typeof __VLS_components.VSelect, typeof __VLS_components.vSelect, ]} */ ;
    // @ts-ignore
    const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
        modelValue: (__VLS_ctx.outcomeIds),
        clearable: true,
        chips: true,
        label: (__VLS_ctx.dynamicLabel),
        hint: (__VLS_ctx.dynamicHint),
        items: (__VLS_ctx.outcomes),
        itemTitle: "name",
        itemValue: "id",
        multiple: true,
        variant: "outlined",
    }));
    const __VLS_2 = __VLS_1({
        modelValue: (__VLS_ctx.outcomeIds),
        clearable: true,
        chips: true,
        label: (__VLS_ctx.dynamicLabel),
        hint: (__VLS_ctx.dynamicHint),
        items: (__VLS_ctx.outcomes),
        itemTitle: "name",
        itemValue: "id",
        multiple: true,
        variant: "outlined",
    }, ...__VLS_functionalComponentArgsRest(__VLS_1));
}
else if (!__VLS_ctx.loading) {
    const __VLS_4 = {}.VTextField;
    /** @type {[typeof __VLS_components.VTextField, typeof __VLS_components.vTextField, typeof __VLS_components.VTextField, typeof __VLS_components.vTextField, ]} */ ;
    // @ts-ignore
    const __VLS_5 = __VLS_asFunctionalComponent(__VLS_4, new __VLS_4({
        modelValue: (__VLS_ctx.outcomeDisplayText),
        label: (__VLS_ctx.dynamicLabel),
        variant: "outlined",
        readonly: true,
        persistentHint: true,
        ...{ class: "mb-4" },
        disabled: (!__VLS_ctx.isAdmin),
    }));
    const __VLS_6 = __VLS_5({
        modelValue: (__VLS_ctx.outcomeDisplayText),
        label: (__VLS_ctx.dynamicLabel),
        variant: "outlined",
        readonly: true,
        persistentHint: true,
        ...{ class: "mb-4" },
        disabled: (!__VLS_ctx.isAdmin),
    }, ...__VLS_functionalComponentArgsRest(__VLS_5));
}
else {
    const __VLS_8 = {}.VTextField;
    /** @type {[typeof __VLS_components.VTextField, typeof __VLS_components.vTextField, typeof __VLS_components.VTextField, typeof __VLS_components.vTextField, ]} */ ;
    // @ts-ignore
    const __VLS_9 = __VLS_asFunctionalComponent(__VLS_8, new __VLS_8({
        label: (__VLS_ctx.dynamicLabel),
        variant: "outlined",
        loading: true,
        readonly: true,
        disabled: (!__VLS_ctx.isAdmin),
    }));
    const __VLS_10 = __VLS_9({
        label: (__VLS_ctx.dynamicLabel),
        variant: "outlined",
        loading: true,
        readonly: true,
        disabled: (!__VLS_ctx.isAdmin),
    }, ...__VLS_functionalComponentArgsRest(__VLS_9));
}
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            outcomeIds: outcomeIds,
            isAdmin: isAdmin,
            loading: loading,
            outcomes: outcomes,
            dynamicLabel: dynamicLabel,
            dynamicHint: dynamicHint,
            outcomeDisplayText: outcomeDisplayText,
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
