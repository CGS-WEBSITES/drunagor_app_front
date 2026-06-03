/// <reference types="../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import CampaignLogAura from "@/components/CampaignLogAura.vue";
import CampaignLogOutcome from "@/components/CampaignLogOutcome.vue";
import CampaignLogStatus from "@/components/CampaignLogStatus.vue";
import { CampaignLogStatusRepository } from "@/data/repository/campaign/apocalypse/CampaignLogStatusRepository";
import { CampaignLogAuraRepository } from "@/data/repository/campaign/apocalypse/CampaignLogAuraRepository";
import { CampaignLogOutcomeRepository } from "@/data/repository/campaign/apocalypse/CampaignLogOutcomeRepository";
import { useI18n } from "vue-i18n";
import { useUserStore } from "@/store/UserStore";
import { HeroStore } from "@/store/HeroStore";
import { CampaignStore } from "@/store/CampaignStore";
import { ref, onMounted } from "vue";
import axios from "axios";
const props = defineProps();
const statusRepository = new CampaignLogStatusRepository();
const auraRepository = new CampaignLogAuraRepository();
const outcomeRepository = new CampaignLogOutcomeRepository();
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
            console.warn("[CampaignLogApocalypse] checkUserRole skipped: users_pk is missing");
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
        console.error("CampaignLogApocalypse - Error fetching user role:", error);
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
}));
const __VLS_6 = __VLS_5({
    cols: "12",
}, ...__VLS_functionalComponentArgsRest(__VLS_5));
__VLS_7.slots.default;
/** @type {[typeof CampaignLogStatus, ]} */ ;
// @ts-ignore
const __VLS_8 = __VLS_asFunctionalComponent(CampaignLogStatus, new CampaignLogStatus({
    repository: (__VLS_ctx.statusRepository),
    campaignId: (props.campaignId),
    heroId: (props.heroId),
}));
const __VLS_9 = __VLS_8({
    repository: (__VLS_ctx.statusRepository),
    campaignId: (props.campaignId),
    heroId: (props.heroId),
}, ...__VLS_functionalComponentArgsRest(__VLS_8));
var __VLS_7;
var __VLS_3;
const __VLS_11 = {}.VRow;
/** @type {[typeof __VLS_components.VRow, typeof __VLS_components.vRow, typeof __VLS_components.VRow, typeof __VLS_components.vRow, ]} */ ;
// @ts-ignore
const __VLS_12 = __VLS_asFunctionalComponent(__VLS_11, new __VLS_11({
    noGutters: true,
}));
const __VLS_13 = __VLS_12({
    noGutters: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_12));
__VLS_14.slots.default;
const __VLS_15 = {}.VCol;
/** @type {[typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ]} */ ;
// @ts-ignore
const __VLS_16 = __VLS_asFunctionalComponent(__VLS_15, new __VLS_15({
    cols: "12",
}));
const __VLS_17 = __VLS_16({
    cols: "12",
}, ...__VLS_functionalComponentArgsRest(__VLS_16));
__VLS_18.slots.default;
/** @type {[typeof CampaignLogOutcome, ]} */ ;
// @ts-ignore
const __VLS_19 = __VLS_asFunctionalComponent(CampaignLogOutcome, new CampaignLogOutcome({
    repository: (__VLS_ctx.outcomeRepository),
    campaignId: (props.campaignId),
    heroId: (props.heroId),
}));
const __VLS_20 = __VLS_19({
    repository: (__VLS_ctx.outcomeRepository),
    campaignId: (props.campaignId),
    heroId: (props.heroId),
}, ...__VLS_functionalComponentArgsRest(__VLS_19));
var __VLS_18;
var __VLS_14;
const __VLS_22 = {}.VRow;
/** @type {[typeof __VLS_components.VRow, typeof __VLS_components.vRow, typeof __VLS_components.VRow, typeof __VLS_components.vRow, ]} */ ;
// @ts-ignore
const __VLS_23 = __VLS_asFunctionalComponent(__VLS_22, new __VLS_22({
    noGutters: true,
}));
const __VLS_24 = __VLS_23({
    noGutters: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_23));
__VLS_25.slots.default;
const __VLS_26 = {}.VCol;
/** @type {[typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ]} */ ;
// @ts-ignore
const __VLS_27 = __VLS_asFunctionalComponent(__VLS_26, new __VLS_26({
    cols: "12",
}));
const __VLS_28 = __VLS_27({
    cols: "12",
}, ...__VLS_functionalComponentArgsRest(__VLS_27));
__VLS_29.slots.default;
/** @type {[typeof CampaignLogAura, ]} */ ;
// @ts-ignore
const __VLS_30 = __VLS_asFunctionalComponent(CampaignLogAura, new CampaignLogAura({
    repository: (__VLS_ctx.auraRepository),
    campaignId: (props.campaignId),
    heroId: (props.heroId),
}));
const __VLS_31 = __VLS_30({
    repository: (__VLS_ctx.auraRepository),
    campaignId: (props.campaignId),
    heroId: (props.heroId),
}, ...__VLS_functionalComponentArgsRest(__VLS_30));
var __VLS_29;
var __VLS_25;
if (!props.hideEquipmentButton && __VLS_ctx.isAdmin && !__VLS_ctx.loading) {
    const __VLS_33 = {}.VRow;
    /** @type {[typeof __VLS_components.VRow, typeof __VLS_components.vRow, typeof __VLS_components.VRow, typeof __VLS_components.vRow, ]} */ ;
    // @ts-ignore
    const __VLS_34 = __VLS_asFunctionalComponent(__VLS_33, new __VLS_33({
        noGutters: true,
    }));
    const __VLS_35 = __VLS_34({
        noGutters: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_34));
    __VLS_36.slots.default;
    const __VLS_37 = {}.VCol;
    /** @type {[typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ]} */ ;
    // @ts-ignore
    const __VLS_38 = __VLS_asFunctionalComponent(__VLS_37, new __VLS_37({
        cols: "12",
    }));
    const __VLS_39 = __VLS_38({
        cols: "12",
    }, ...__VLS_functionalComponentArgsRest(__VLS_38));
    __VLS_40.slots.default;
    const __VLS_41 = {}.VBtn;
    /** @type {[typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ]} */ ;
    // @ts-ignore
    const __VLS_42 = __VLS_asFunctionalComponent(__VLS_41, new __VLS_41({
        ...{ 'onClick': {} },
        variant: "outlined",
    }));
    const __VLS_43 = __VLS_42({
        ...{ 'onClick': {} },
        variant: "outlined",
    }, ...__VLS_functionalComponentArgsRest(__VLS_42));
    let __VLS_45;
    let __VLS_46;
    let __VLS_47;
    const __VLS_48 = {
        onClick: (...[$event]) => {
            if (!(!props.hideEquipmentButton && __VLS_ctx.isAdmin && !__VLS_ctx.loading))
                return;
            __VLS_ctx.$router.push({
                name: 'Hero',
                params: { campaignId: props.campaignId, heroId: props.heroId },
            });
        }
    };
    __VLS_44.slots.default;
    (__VLS_ctx.t("label.equipment-skills"));
    var __VLS_44;
    var __VLS_40;
    var __VLS_36;
}
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            CampaignLogAura: CampaignLogAura,
            CampaignLogOutcome: CampaignLogOutcome,
            CampaignLogStatus: CampaignLogStatus,
            statusRepository: statusRepository,
            auraRepository: auraRepository,
            outcomeRepository: outcomeRepository,
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
