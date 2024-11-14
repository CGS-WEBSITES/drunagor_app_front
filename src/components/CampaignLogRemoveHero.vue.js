import { ref, computed } from "vue";
import BaseList from "@/components/BaseList.vue";
import BaseListItem from "@/components/BaseListItem.vue";
import { HeroDataRepository } from "@/data/repository/HeroDataRepository";
import { HeroStore } from "@/store/HeroStore";
import { useI18n } from "vue-i18n";
const { defineProps, defineSlots, defineEmits, defineExpose, defineModel, defineOptions, withDefaults, } = await import('vue');
const props = defineProps();
const visible = ref(false);
const { t } = useI18n();
function openModal() {
    visible.value = true;
}
function closeModal() {
    visible.value = false;
}
const heroStore = HeroStore();
const heroes = new HeroDataRepository().findAll();
let filteredHeroes = computed(() => heroes.filter(filterHero));
function filterHero(hero) {
    if (heroStore.hasInCampaign(hero.id, props.campaignId) == false) {
        return false;
    }
    return true;
}
function removeHeroFromCampaign(heroId) {
    heroStore.removeFromCampaign(heroId, props.campaignId);
    closeModal();
}
; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_fnComponent = (await import('vue')).defineComponent({});
;
let __VLS_functionalComponentProps;
function __VLS_template() {
    const __VLS_ctx = {};
    const __VLS_localComponents = {
        ...{},
        ...{},
        ...__VLS_ctx,
    };
    let __VLS_components;
    const __VLS_localDirectives = {
        ...{},
        ...__VLS_ctx,
    };
    let __VLS_directives;
    let __VLS_styleScopedClasses;
    // CSS variable injection 
    // CSS variable injection end 
    let __VLS_resolvedLocalAndGlobalComponents;
    const __VLS_0 = __VLS_resolvedLocalAndGlobalComponents.Button;
    /** @type { [typeof __VLS_components.Button, typeof __VLS_components.Button, ] } */
    // @ts-ignore
    const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({ ...{ 'onClick': {} }, outlined: (true), id: ("campaign-remove-hero"), label: ((__VLS_ctx.t('label.remove-hero'))), disabled: ((__VLS_ctx.filteredHeroes.length === 0)), }));
    const __VLS_2 = __VLS_1({ ...{ 'onClick': {} }, outlined: (true), id: ("campaign-remove-hero"), label: ((__VLS_ctx.t('label.remove-hero'))), disabled: ((__VLS_ctx.filteredHeroes.length === 0)), }, ...__VLS_functionalComponentArgsRest(__VLS_1));
    let __VLS_6;
    const __VLS_7 = {
        onClick: (__VLS_ctx.openModal)
    };
    let __VLS_3;
    let __VLS_4;
    var __VLS_5;
    const __VLS_8 = __VLS_resolvedLocalAndGlobalComponents.Dialog;
    /** @type { [typeof __VLS_components.Dialog, typeof __VLS_components.Dialog, ] } */
    // @ts-ignore
    const __VLS_9 = __VLS_asFunctionalComponent(__VLS_8, new __VLS_8({ visible: ((__VLS_ctx.visible)), modal: (true), header: ((__VLS_ctx.t('label.remove-hero'))), dismissableMask: ((true)), ...{ class: ("w-full md:w-1/3 m-2") }, }));
    const __VLS_10 = __VLS_9({ visible: ((__VLS_ctx.visible)), modal: (true), header: ((__VLS_ctx.t('label.remove-hero'))), dismissableMask: ((true)), ...{ class: ("w-full md:w-1/3 m-2") }, }, ...__VLS_functionalComponentArgsRest(__VLS_9));
    // @ts-ignore
    [BaseList, BaseList,];
    // @ts-ignore
    const __VLS_14 = __VLS_asFunctionalComponent(BaseList, new BaseList({ id: ("campaign-remove-heroes"), }));
    const __VLS_15 = __VLS_14({ id: ("campaign-remove-heroes"), }, ...__VLS_functionalComponentArgsRest(__VLS_14));
    for (const [hero] of __VLS_getVForSourceType((__VLS_ctx.filteredHeroes))) {
        (hero.id);
        // @ts-ignore
        [BaseListItem, BaseListItem,];
        // @ts-ignore
        const __VLS_19 = __VLS_asFunctionalComponent(BaseListItem, new BaseListItem({ ...{ 'onClick': {} }, avatar: ((hero.images.avatar)), }));
        const __VLS_20 = __VLS_19({ ...{ 'onClick': {} }, avatar: ((hero.images.avatar)), }, ...__VLS_functionalComponentArgsRest(__VLS_19));
        let __VLS_24;
        const __VLS_25 = {
            onClick: (...[$event]) => {
                __VLS_ctx.removeHeroFromCampaign(hero.id);
            }
        };
        let __VLS_21;
        let __VLS_22;
        (hero.name);
        __VLS_nonNullable(__VLS_23.slots).default;
        var __VLS_23;
        const __VLS_26 = __VLS_resolvedLocalAndGlobalComponents.Divider;
        /** @type { [typeof __VLS_components.Divider, ] } */
        // @ts-ignore
        const __VLS_27 = __VLS_asFunctionalComponent(__VLS_26, new __VLS_26({ ...{ class: ("m-2") }, }));
        const __VLS_28 = __VLS_27({ ...{ class: ("m-2") }, }, ...__VLS_functionalComponentArgsRest(__VLS_27));
    }
    __VLS_nonNullable(__VLS_18.slots).default;
    var __VLS_18;
    __VLS_nonNullable(__VLS_13.slots).default;
    var __VLS_13;
    __VLS_styleScopedClasses['w-full'];
    __VLS_styleScopedClasses['md:w-1/3'];
    __VLS_styleScopedClasses['m-2'];
    __VLS_styleScopedClasses['m-2'];
    var __VLS_slots;
    var __VLS_inheritedAttrs;
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
            BaseList: BaseList,
            BaseListItem: BaseListItem,
            visible: visible,
            t: t,
            openModal: openModal,
            filteredHeroes: filteredHeroes,
            removeHeroFromCampaign: removeHeroFromCampaign,
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
