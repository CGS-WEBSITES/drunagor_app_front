/// <reference types="../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import CampaignLogAura from "@/components/CampaignLogAura.vue";
import CampaignLogStatus from "@/components/CampaignLogStatus.vue";
import { CampaignLogStatusRepository } from "@/data/repository/campaign/awakenings/CampaignLogStatusRepository";
import { CampaignLogAuraRepository } from "@/data/repository/campaign/awakenings/CampaignLogAuraRepository";
import { useUserStore } from "@/store/UserStore";
import { HeroStore } from "@/store/HeroStore";
import { CampaignStore } from "@/store/CampaignStore";
import { useI18n } from "vue-i18n";
import { ref, onMounted } from "vue";
import axios from "axios";
const props = defineProps();
const statusRepository = new CampaignLogStatusRepository();
const auraRepository = new CampaignLogAuraRepository();
const userStore = useUserStore();
const heroStore = HeroStore();
const campaignStore = CampaignStore();
const { t } = useI18n();
const isAdmin = ref(false);
const loading = ref(true);
const checkUserRole = async () => {
    try {
        if (!userStore.user?.users_pk) {
            userStore.restoreFromStorage();
        }
        if (!userStore.user?.users_pk) {
            console.warn("[CampaignLogAwakenings] checkUserRole skipped: users_pk is missing");
            loading.value = false;
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
        console.error("CampaignLog - Error fetching user role:", error);
        isAdmin.value = false;
    }
    finally {
        loading.value = false;
    }
};
onMounted(async () => {
    await checkUserRole();
});
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "pt-2 w-full" },
});
/** @type {[typeof CampaignLogStatus, ]} */ ;
// @ts-ignore
const __VLS_0 = __VLS_asFunctionalComponent(CampaignLogStatus, new CampaignLogStatus({
    repository: (__VLS_ctx.statusRepository),
    campaignId: (props.campaignId),
    heroId: (props.heroId),
}));
const __VLS_1 = __VLS_0({
    repository: (__VLS_ctx.statusRepository),
    campaignId: (props.campaignId),
    heroId: (props.heroId),
}, ...__VLS_functionalComponentArgsRest(__VLS_0));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "pt-2 w-full" },
});
/** @type {[typeof CampaignLogAura, ]} */ ;
// @ts-ignore
const __VLS_3 = __VLS_asFunctionalComponent(CampaignLogAura, new CampaignLogAura({
    repository: (__VLS_ctx.auraRepository),
    campaignId: (props.campaignId),
    heroId: (props.heroId),
}));
const __VLS_4 = __VLS_3({
    repository: (__VLS_ctx.auraRepository),
    campaignId: (props.campaignId),
    heroId: (props.heroId),
}, ...__VLS_functionalComponentArgsRest(__VLS_3));
if (!props.hideEquipmentButton && __VLS_ctx.isAdmin && !__VLS_ctx.loading) {
    const __VLS_6 = {}.VRow;
    /** @type {[typeof __VLS_components.VRow, typeof __VLS_components.vRow, typeof __VLS_components.VRow, typeof __VLS_components.vRow, ]} */ ;
    // @ts-ignore
    const __VLS_7 = __VLS_asFunctionalComponent(__VLS_6, new __VLS_6({
        noGutters: true,
    }));
    const __VLS_8 = __VLS_7({
        noGutters: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_7));
    __VLS_9.slots.default;
    const __VLS_10 = {}.VCol;
    /** @type {[typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ]} */ ;
    // @ts-ignore
    const __VLS_11 = __VLS_asFunctionalComponent(__VLS_10, new __VLS_10({
        cols: "12",
    }));
    const __VLS_12 = __VLS_11({
        cols: "12",
    }, ...__VLS_functionalComponentArgsRest(__VLS_11));
    __VLS_13.slots.default;
    const __VLS_14 = {}.VBtn;
    /** @type {[typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ]} */ ;
    // @ts-ignore
    const __VLS_15 = __VLS_asFunctionalComponent(__VLS_14, new __VLS_14({
        ...{ 'onClick': {} },
        variant: "outlined",
    }));
    const __VLS_16 = __VLS_15({
        ...{ 'onClick': {} },
        variant: "outlined",
    }, ...__VLS_functionalComponentArgsRest(__VLS_15));
    let __VLS_18;
    let __VLS_19;
    let __VLS_20;
    const __VLS_21 = {
        onClick: (...[$event]) => {
            if (!(!props.hideEquipmentButton && __VLS_ctx.isAdmin && !__VLS_ctx.loading))
                return;
            __VLS_ctx.$router.push({
                name: 'Hero',
                params: { campaignId: __VLS_ctx.campaignId, heroId: props.heroId },
            });
        }
    };
    __VLS_17.slots.default;
    (__VLS_ctx.t("label.equipment-skills"));
    var __VLS_17;
    var __VLS_13;
    var __VLS_9;
}
/** @type {__VLS_StyleScopedClasses['pt-2']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['pt-2']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            CampaignLogAura: CampaignLogAura,
            CampaignLogStatus: CampaignLogStatus,
            statusRepository: statusRepository,
            auraRepository: auraRepository,
            t: t,
            isAdmin: isAdmin,
            loading: loading,
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
