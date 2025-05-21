/// <reference types="../../node_modules/.vue-global-types/vue_3.5_false.d.ts" />
import CampaignLogStatus from "@/components/CampaignLogStatus.vue";
import { CampaignLogStatusRepository } from "@/data/repository/campaign/underkeep/CampaignLogStatusRepository";
import { CampaignLogOutcomeRepository } from "@/data/repository/campaign/core/CampaignLogOutcomeRepository";
import { useI18n } from "vue-i18n";
const props = defineProps();
const statusRepository = new CampaignLogStatusRepository();
const outcomeRepository = new CampaignLogOutcomeRepository();
const { t } = useI18n();
; /* PartiallyEnd: #3632/scriptSetup.vue */
function __VLS_template() {
    const __VLS_ctx = {};
    let __VLS_components;
    let __VLS_directives;
    // CSS variable injection 
    // CSS variable injection end 
    const __VLS_0 = {}.VRow;
    /** @type { [typeof __VLS_components.VRow, typeof __VLS_components.vRow, typeof __VLS_components.VRow, typeof __VLS_components.vRow, ] } */ ;
    // @ts-ignore
    const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
        noGutters: (true),
    }));
    const __VLS_2 = __VLS_1({
        noGutters: (true),
    }, ...__VLS_functionalComponentArgsRest(__VLS_1));
    const __VLS_6 = {}.VCol;
    /** @type { [typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ] } */ ;
    // @ts-ignore
    const __VLS_7 = __VLS_asFunctionalComponent(__VLS_6, new __VLS_6({
        cols: ("12"),
    }));
    const __VLS_8 = __VLS_7({
        cols: ("12"),
    }, ...__VLS_functionalComponentArgsRest(__VLS_7));
    // @ts-ignore
    /** @type { [typeof CampaignLogStatus, ] } */ ;
    // @ts-ignore
    const __VLS_12 = __VLS_asFunctionalComponent(CampaignLogStatus, new CampaignLogStatus({
        repository: ((__VLS_ctx.statusRepository)),
        campaignId: ((props.campaignId)),
        heroId: ((props.heroId)),
    }));
    const __VLS_13 = __VLS_12({
        repository: ((__VLS_ctx.statusRepository)),
        campaignId: ((props.campaignId)),
        heroId: ((props.heroId)),
    }, ...__VLS_functionalComponentArgsRest(__VLS_12));
    __VLS_11.slots.default;
    var __VLS_11;
    __VLS_5.slots.default;
    var __VLS_5;
    const __VLS_17 = {}.VRow;
    /** @type { [typeof __VLS_components.VRow, typeof __VLS_components.vRow, typeof __VLS_components.VRow, typeof __VLS_components.vRow, ] } */ ;
    // @ts-ignore
    const __VLS_18 = __VLS_asFunctionalComponent(__VLS_17, new __VLS_17({
        noGutters: (true),
    }));
    const __VLS_19 = __VLS_18({
        noGutters: (true),
    }, ...__VLS_functionalComponentArgsRest(__VLS_18));
    const __VLS_23 = {}.VCol;
    /** @type { [typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ] } */ ;
    // @ts-ignore
    const __VLS_24 = __VLS_asFunctionalComponent(__VLS_23, new __VLS_23({
        cols: ("12"),
    }));
    const __VLS_25 = __VLS_24({
        cols: ("12"),
    }, ...__VLS_functionalComponentArgsRest(__VLS_24));
    const __VLS_29 = {}.VBtn;
    /** @type { [typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ] } */ ;
    // @ts-ignore
    const __VLS_30 = __VLS_asFunctionalComponent(__VLS_29, new __VLS_29({
        ...{ 'onClick': {} },
        variant: ("elevated"),
        rounded: (true),
    }));
    const __VLS_31 = __VLS_30({
        ...{ 'onClick': {} },
        variant: ("elevated"),
        rounded: (true),
    }, ...__VLS_functionalComponentArgsRest(__VLS_30));
    let __VLS_35;
    const __VLS_36 = {
        onClick: (...[$event]) => {
            __VLS_ctx.$router.push({
                name: 'Hero',
                params: { campaignId: __VLS_ctx.campaignId, heroId: props.heroId },
            });
        }
    };
    let __VLS_32;
    let __VLS_33;
    (__VLS_ctx.t("label.equipment-skills"));
    __VLS_34.slots.default;
    var __VLS_34;
    __VLS_28.slots.default;
    var __VLS_28;
    __VLS_22.slots.default;
    var __VLS_22;
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
            CampaignLogStatus: CampaignLogStatus,
            statusRepository: statusRepository,
            t: t,
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
