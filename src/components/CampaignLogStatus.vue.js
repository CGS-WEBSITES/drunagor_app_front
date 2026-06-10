/// <reference types="../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import { ref, watch, computed, onMounted } from "vue";
import { HeroStore } from "@/store/HeroStore";
import { useUserStore } from "@/store/UserStore";
import { CampaignStore } from "@/store/CampaignStore";
import { useI18n } from "vue-i18n";
import { ConfigurationStore } from "@/store/ConfigurationStore";
import axios from "axios";
const props = defineProps();
const heroStore = HeroStore();
const userStore = useUserStore();
const campaignStore = CampaignStore();
const configurationStore = ConfigurationStore();
const { t } = useI18n();
const statusIds = ref([]);
const isAdmin = ref(false);
const loading = ref(true);
const campaignHeroRef = ref(null);
props.repository.load(configurationStore.enabledLanguage);
const statuses = props.repository.findAll();
const statusDisplayText = computed(() => {
    if (statusIds.value.length === 0) {
        return t('text.no-status', 'No status applied');
    }
    const activeStatuses = findStatuses(statusIds.value);
    return activeStatuses.map(status => status.name).join(', ');
});
const checkUserRole = async () => {
    try {
        if (!userStore.user?.users_pk) {
            userStore.restoreFromStorage();
        }
        if (!userStore.user?.users_pk) {
            console.warn("[CampaignLogStatus] checkUserRole skipped: users_pk is missing");
            return;
        }
        const campaign = campaignStore.findOptional(props.campaignId);
        const showSeason2 = campaign ? campaign.campaign === "underkeep2" : false;
        const response = await axios.get("rl_campaigns_users/search", {
            params: {
                users_fk: userStore.user.users_pk,
                campaigns_fk: props.campaignId,
                show_season2: showSeason2
            },
        });
        const campaignRelation = response.data.campaigns?.[0];
        if (campaignRelation) {
            const isPartyAdmin = campaignRelation.party_role === "Admin";
            const hero = heroStore.findInCampaignOptional(props.heroId, props.campaignId);
            const isHeroOwner = hero && Number(hero.playableHeroesPk) === Number(campaignRelation.playable_heroes_fk);
            isAdmin.value = isPartyAdmin || isHeroOwner;
        }
        else {
            isAdmin.value = false;
        }
    }
    catch (error) {
        console.error("CampaignLogStatus - Error fetching user role:", error);
        isAdmin.value = false;
    }
    finally {
        loading.value = false;
    }
};
function findStatuses(statusIdsList) {
    const statusesFound = [];
    statusIdsList.forEach((statusId) => {
        const status = props.repository.find(statusId);
        if (status) {
            statusesFound.push(status);
        }
    });
    return statusesFound;
}
function syncToStore() {
    if (campaignHeroRef.value && isAdmin.value) {
        campaignHeroRef.value.statusIds = [...statusIds.value];
        console.log("[CampaignLogStatus] Synced statusIds to store:", statusIds.value);
    }
}
watch(statusIds, (newStatusIds) => {
    if (isAdmin.value && campaignHeroRef.value) {
        campaignHeroRef.value.statusIds = [...newStatusIds];
        console.log("[CampaignLogStatus] StatusIds updated:", newStatusIds);
    }
}, { deep: true });
onMounted(async () => {
    await checkUserRole();
    const hero = heroStore.findInCampaignOptional(props.heroId, props.campaignId);
    if (hero) {
        campaignHeroRef.value = hero;
        if (!hero.statusIds) {
            hero.statusIds = [];
        }
        statusIds.value = [...hero.statusIds];
    }
    else {
        console.warn(`[CampaignLogStatus] Hero ${props.heroId} not found in campaign ${props.campaignId}`);
    }
});
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    'data-testid': ('campaign-log-status-' + __VLS_ctx.heroId),
});
if (__VLS_ctx.isAdmin && !__VLS_ctx.loading) {
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
}
else if (!__VLS_ctx.loading) {
    const __VLS_4 = {}.VTextField;
    /** @type {[typeof __VLS_components.VTextField, typeof __VLS_components.vTextField, typeof __VLS_components.VTextField, typeof __VLS_components.vTextField, ]} */ ;
    // @ts-ignore
    const __VLS_5 = __VLS_asFunctionalComponent(__VLS_4, new __VLS_4({
        modelValue: (__VLS_ctx.statusDisplayText),
        label: (__VLS_ctx.$t('text.add-or-remove-status')),
        variant: "outlined",
        readonly: true,
        persistentHint: true,
        ...{ class: "mb-4" },
        disabled: (!__VLS_ctx.isAdmin),
    }));
    const __VLS_6 = __VLS_5({
        modelValue: (__VLS_ctx.statusDisplayText),
        label: (__VLS_ctx.$t('text.add-or-remove-status')),
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
        label: (__VLS_ctx.$t('text.add-or-remove-status')),
        variant: "outlined",
        loading: true,
        readonly: true,
        ...{ class: "mb-4" },
        disabled: (!__VLS_ctx.isAdmin),
    }));
    const __VLS_10 = __VLS_9({
        label: (__VLS_ctx.$t('text.add-or-remove-status')),
        variant: "outlined",
        loading: true,
        readonly: true,
        ...{ class: "mb-4" },
        disabled: (!__VLS_ctx.isAdmin),
    }, ...__VLS_functionalComponentArgsRest(__VLS_9));
}
if (__VLS_ctx.statusIds.length > 0) {
    const __VLS_12 = {}.VSheet;
    /** @type {[typeof __VLS_components.VSheet, typeof __VLS_components.vSheet, typeof __VLS_components.VSheet, typeof __VLS_components.vSheet, ]} */ ;
    // @ts-ignore
    const __VLS_13 = __VLS_asFunctionalComponent(__VLS_12, new __VLS_12({
        rounded: true,
        border: "md",
        ...{ class: "mb-6 pa-6 text-white" },
        ...{ style: {} },
    }));
    const __VLS_14 = __VLS_13({
        rounded: true,
        border: "md",
        ...{ class: "mb-6 pa-6 text-white" },
        ...{ style: {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_13));
    __VLS_15.slots.default;
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
    var __VLS_15;
}
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
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
            statusIds: statusIds,
            isAdmin: isAdmin,
            loading: loading,
            statuses: statuses,
            statusDisplayText: statusDisplayText,
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
