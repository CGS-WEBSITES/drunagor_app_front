/// <reference types="../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import { ref, computed, onMounted } from "vue";
import { EnabledHeroes } from "@/repository/EnabledHeroes";
import { HeroDataRepository } from "@/data/repository/HeroDataRepository";
import { RandomizeHero } from "@/service/RandomizeHero";
import RandomImage from "@/assets/hero/trackerimage/RandomAvatar.png";
import { Hero, SequentialAdventureState, RESOURCE_DEFINITIONS, } from "@/store/Hero";
import { useI18n } from "vue-i18n";
import { CampaignStore } from "@/store/CampaignStore";
import { useUserStore } from "@/store/UserStore";
import axios from "axios";
const props = defineProps();
const { t } = useI18n();
const userStore = useUserStore();
const campaignStore = CampaignStore();
const visible = ref(false);
const isLoading = ref(false);
const snackbarVisible = ref(false);
const snackbarText = ref("");
const snackbarColor = ref("success");
const userAlreadyHasHero = ref(false);
const checkingUserHero = ref(true);
const campaign = computed(() => campaignStore.findOptional(props.campaignId));
// Flag para saber se é Underkeep/Nights (Multiplayer real) ou Campanhas Legadas
const isMultiplayer = computed(() => {
    return (campaign.value?.campaign === "underkeep" ||
        campaign.value?.campaign === "underkeep2");
});
const campaignHeroesCount = computed(() => {
    return campaignStore.findAllHeroes(props.campaignId).length;
});
// Limite Dinâmico: 4 para Underkeep, 5 para as Legadas
const isLimitReached = computed(() => {
    if (!campaign.value)
        return false;
    if (isMultiplayer.value) {
        return campaignHeroesCount.value >= 4;
    }
    return campaignHeroesCount.value >= 5;
});
const availableHeroes = computed(() => {
    if (!campaign.value) {
        return [];
    }
    if (isMultiplayer.value) {
        const heroRepository = new HeroDataRepository();
        const allHeroes = heroRepository.findAll();
        return allHeroes.filter((hero) => hero.content === "core");
    }
    else {
        return new EnabledHeroes().findAll();
    }
});
const filteredHeroes = computed(() => availableHeroes.value.filter((hero) => !campaignStore.hasHero(props.campaignId, hero.id)));
async function checkUserHasHero() {
    checkingUserHero.value = true;
    // Se for campanha antiga (Core, Apoc, Awek), ignora a trava de 1 herói por usuário.
    if (!isMultiplayer.value) {
        userAlreadyHasHero.value = false;
        checkingUserHero.value = false;
        return;
    }
    try {
        const response = await axios.get("/rl_campaigns_users/list_players", {
            params: {
                campaigns_fk: props.campaignId,
            },
        });
        if (response.data?.Users?.length) {
            const currentUser = response.data.Users.find((u) => u.user_name === userStore.user.user_name);
            userAlreadyHasHero.value = currentUser?.playable_heroes_fk != null;
        }
    }
    catch (error) {
        console.error("[AddHero] Error checking user hero:", error);
        userAlreadyHasHero.value = false;
    }
    finally {
        checkingUserHero.value = false;
    }
}
function openModal() {
    if (userAlreadyHasHero.value) {
        showSnackbar("You already have a hero in this campaign. Each player can only have one hero.", "warning");
        return;
    }
    visible.value = true;
}
function closeModal() {
    visible.value = false;
}
function showSnackbar(text, color = "success") {
    snackbarText.value = text;
    snackbarColor.value = color;
    snackbarVisible.value = true;
}
function createHeroWithResources(heroId) {
    const newHero = new Hero(heroId, props.campaignId);
    newHero.sequentialAdventureState = new SequentialAdventureState();
    RESOURCE_DEFINITIONS.forEach((resource) => {
        newHero.sequentialAdventureState.resources[resource.id] = 0;
    });
    return newHero;
}
function generateHeroHash(hero) {
    const cleanData = JSON.parse(JSON.stringify(hero));
    delete cleanData.playableHeroesPk;
    return btoa(JSON.stringify(cleanData));
}
async function getUserCampaignRelationPk() {
    try {
        const response = await axios.get("/rl_campaigns_users/list_players", {
            params: {
                campaigns_fk: props.campaignId,
            },
        });
        if (response.data?.Users?.length) {
            const currentUser = response.data.Users.find((u) => u.user_name === userStore.user.user_name);
            if (currentUser) {
                return currentUser.rl_campaigns_users_pk;
            }
        }
        return null;
    }
    catch (error) {
        console.error("[AddHero] Error getting user campaign relation:", error);
        return null;
    }
}
async function saveHeroAndLink(hero) {
    const heroHash = generateHeroHash(hero);
    const createResponse = await axios.post("/playable_heroes/cadastro", {
        hero_hash: heroHash,
        users_fk: userStore.user.users_pk,
    });
    const playableHeroesPk = createResponse.data.playable_hero?.playable_heroes_pk;
    if (!playableHeroesPk) {
        throw new Error("Failed to get playable_heroes_pk from backend");
    }
    const rlCampaignsUsersPk = await getUserCampaignRelationPk();
    if (!rlCampaignsUsersPk) {
        throw new Error("User is not linked to this campaign");
    }
    await axios.put("/rl_campaigns_users/alter", {
        rl_campaigns_users_pk: rlCampaignsUsersPk,
        playable_heroes_fk: playableHeroesPk,
    });
    return playableHeroesPk;
}
async function addHeroToCampaign(heroId) {
    if (userAlreadyHasHero.value) {
        showSnackbar("You already have a hero in this campaign. Each player can only have one hero.", "warning");
        closeModal();
        return;
    }
    if (isLimitReached.value) {
        const limit = isMultiplayer.value ? 4 : 5;
        showSnackbar(`Campaigns can only have up to ${limit} heroes.`, "warning");
        closeModal();
        return;
    }
    isLoading.value = true;
    try {
        const newHero = createHeroWithResources(heroId);
        // Se for Nights (Multiplayer), salva no banco
        if (isMultiplayer.value) {
            const playableHeroesPk = await saveHeroAndLink(newHero);
            newHero.playableHeroesPk = playableHeroesPk;
            userAlreadyHasHero.value = true;
        }
        // Se for Core/Apoc/Awek, apenas injeta na Store
        campaignStore.addHero(props.campaignId, newHero);
        showSnackbar("Hero added successfully!", "success");
        closeModal();
    }
    catch (error) {
        console.error("[AddHero] Error adding hero:", error);
        let errorMessage = "Failed to add hero. Please try again.";
        if (error.message?.includes("not linked")) {
            errorMessage = "You are not linked to this campaign. Please join first.";
        }
        showSnackbar(errorMessage, "error");
    }
    finally {
        isLoading.value = false;
    }
}
async function addRandomHeroToCampaign() {
    if (userAlreadyHasHero.value) {
        showSnackbar("You already have a hero in this campaign. Each player can only have one hero.", "warning");
        closeModal();
        return;
    }
    if (isLimitReached.value) {
        const limit = isMultiplayer.value ? 4 : 5;
        showSnackbar(`Campaigns can only have up to ${limit} heroes.`, "warning");
        closeModal();
        return;
    }
    const existingHeroIds = campaignStore
        .findAllHeroes(props.campaignId)
        .map((h) => h.heroId);
    const randomHero = new RandomizeHero().randomize(existingHeroIds, availableHeroes.value);
    if (randomHero === null) {
        showSnackbar("No random hero available.", "error");
        return;
    }
    await addHeroToCampaign(randomHero.id);
}
onMounted(async () => {
    await checkUserHasHero();
});
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
// CSS variable injection 
// CSS variable injection end 
const __VLS_0 = {}.VBtn;
/** @type {[typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ]} */ ;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
    ...{ 'onClick': {} },
    variant: "elevated",
    id: "campaign-add-hero",
    rounded: true,
    disabled: (__VLS_ctx.isLimitReached || __VLS_ctx.isLoading || __VLS_ctx.userAlreadyHasHero),
    loading: (__VLS_ctx.isLoading),
}));
const __VLS_2 = __VLS_1({
    ...{ 'onClick': {} },
    variant: "elevated",
    id: "campaign-add-hero",
    rounded: true,
    disabled: (__VLS_ctx.isLimitReached || __VLS_ctx.isLoading || __VLS_ctx.userAlreadyHasHero),
    loading: (__VLS_ctx.isLoading),
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
let __VLS_4;
let __VLS_5;
let __VLS_6;
const __VLS_7 = {
    onClick: (__VLS_ctx.openModal)
};
__VLS_3.slots.default;
const __VLS_8 = {}.VIcon;
/** @type {[typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, ]} */ ;
// @ts-ignore
const __VLS_9 = __VLS_asFunctionalComponent(__VLS_8, new __VLS_8({
    start: true,
}));
const __VLS_10 = __VLS_9({
    start: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_9));
__VLS_11.slots.default;
var __VLS_11;
(__VLS_ctx.t("label.add-hero"));
if (__VLS_ctx.userAlreadyHasHero) {
    const __VLS_12 = {}.VTooltip;
    /** @type {[typeof __VLS_components.VTooltip, typeof __VLS_components.vTooltip, typeof __VLS_components.VTooltip, typeof __VLS_components.vTooltip, ]} */ ;
    // @ts-ignore
    const __VLS_13 = __VLS_asFunctionalComponent(__VLS_12, new __VLS_12({
        activator: "parent",
        location: "top",
    }));
    const __VLS_14 = __VLS_13({
        activator: "parent",
        location: "top",
    }, ...__VLS_functionalComponentArgsRest(__VLS_13));
    __VLS_15.slots.default;
    var __VLS_15;
}
var __VLS_3;
const __VLS_16 = {}.VDialog;
/** @type {[typeof __VLS_components.VDialog, typeof __VLS_components.vDialog, typeof __VLS_components.VDialog, typeof __VLS_components.vDialog, ]} */ ;
// @ts-ignore
const __VLS_17 = __VLS_asFunctionalComponent(__VLS_16, new __VLS_16({
    modelValue: (__VLS_ctx.visible),
    maxWidth: "500",
}));
const __VLS_18 = __VLS_17({
    modelValue: (__VLS_ctx.visible),
    maxWidth: "500",
}, ...__VLS_functionalComponentArgsRest(__VLS_17));
__VLS_19.slots.default;
const __VLS_20 = {}.VCard;
/** @type {[typeof __VLS_components.VCard, typeof __VLS_components.vCard, typeof __VLS_components.VCard, typeof __VLS_components.vCard, ]} */ ;
// @ts-ignore
const __VLS_21 = __VLS_asFunctionalComponent(__VLS_20, new __VLS_20({}));
const __VLS_22 = __VLS_21({}, ...__VLS_functionalComponentArgsRest(__VLS_21));
__VLS_23.slots.default;
const __VLS_24 = {}.VCardTitle;
/** @type {[typeof __VLS_components.VCardTitle, typeof __VLS_components.vCardTitle, typeof __VLS_components.VCardTitle, typeof __VLS_components.vCardTitle, ]} */ ;
// @ts-ignore
const __VLS_25 = __VLS_asFunctionalComponent(__VLS_24, new __VLS_24({
    ...{ class: "text-center" },
}));
const __VLS_26 = __VLS_25({
    ...{ class: "text-center" },
}, ...__VLS_functionalComponentArgsRest(__VLS_25));
__VLS_27.slots.default;
(__VLS_ctx.t("label.add-hero"));
var __VLS_27;
const __VLS_28 = {}.VCardText;
/** @type {[typeof __VLS_components.VCardText, typeof __VLS_components.vCardText, typeof __VLS_components.VCardText, typeof __VLS_components.vCardText, ]} */ ;
// @ts-ignore
const __VLS_29 = __VLS_asFunctionalComponent(__VLS_28, new __VLS_28({}));
const __VLS_30 = __VLS_29({}, ...__VLS_functionalComponentArgsRest(__VLS_29));
__VLS_31.slots.default;
const __VLS_32 = {}.VList;
/** @type {[typeof __VLS_components.VList, typeof __VLS_components.vList, typeof __VLS_components.VList, typeof __VLS_components.vList, ]} */ ;
// @ts-ignore
const __VLS_33 = __VLS_asFunctionalComponent(__VLS_32, new __VLS_32({
    lines: "one",
}));
const __VLS_34 = __VLS_33({
    lines: "one",
}, ...__VLS_functionalComponentArgsRest(__VLS_33));
__VLS_35.slots.default;
const __VLS_36 = {}.VListItem;
/** @type {[typeof __VLS_components.VListItem, typeof __VLS_components.vListItem, typeof __VLS_components.VListItem, typeof __VLS_components.vListItem, ]} */ ;
// @ts-ignore
const __VLS_37 = __VLS_asFunctionalComponent(__VLS_36, new __VLS_36({
    ...{ 'onClick': {} },
    id: "party-random-hero",
}));
const __VLS_38 = __VLS_37({
    ...{ 'onClick': {} },
    id: "party-random-hero",
}, ...__VLS_functionalComponentArgsRest(__VLS_37));
let __VLS_40;
let __VLS_41;
let __VLS_42;
const __VLS_43 = {
    onClick: (__VLS_ctx.addRandomHeroToCampaign)
};
__VLS_39.slots.default;
const __VLS_44 = {}.VImg;
/** @type {[typeof __VLS_components.VImg, typeof __VLS_components.vImg, ]} */ ;
// @ts-ignore
const __VLS_45 = __VLS_asFunctionalComponent(__VLS_44, new __VLS_44({
    src: (__VLS_ctx.RandomImage),
}));
const __VLS_46 = __VLS_45({
    src: (__VLS_ctx.RandomImage),
}, ...__VLS_functionalComponentArgsRest(__VLS_45));
var __VLS_39;
for (const [hero] of __VLS_getVForSourceType((__VLS_ctx.filteredHeroes))) {
    const __VLS_48 = {}.VListItem;
    /** @type {[typeof __VLS_components.VListItem, typeof __VLS_components.vListItem, typeof __VLS_components.VListItem, typeof __VLS_components.vListItem, ]} */ ;
    // @ts-ignore
    const __VLS_49 = __VLS_asFunctionalComponent(__VLS_48, new __VLS_48({
        ...{ 'onClick': {} },
        key: (hero.id),
    }));
    const __VLS_50 = __VLS_49({
        ...{ 'onClick': {} },
        key: (hero.id),
    }, ...__VLS_functionalComponentArgsRest(__VLS_49));
    let __VLS_52;
    let __VLS_53;
    let __VLS_54;
    const __VLS_55 = {
        onClick: (...[$event]) => {
            __VLS_ctx.addHeroToCampaign(hero.id);
        }
    };
    __VLS_51.slots.default;
    const __VLS_56 = {}.VImg;
    /** @type {[typeof __VLS_components.VImg, typeof __VLS_components.vImg, ]} */ ;
    // @ts-ignore
    const __VLS_57 = __VLS_asFunctionalComponent(__VLS_56, new __VLS_56({
        src: (hero.images.trackerimage),
    }));
    const __VLS_58 = __VLS_57({
        src: (hero.images.trackerimage),
    }, ...__VLS_functionalComponentArgsRest(__VLS_57));
    var __VLS_51;
}
var __VLS_35;
var __VLS_31;
var __VLS_23;
var __VLS_19;
const __VLS_60 = {}.VSnackbar;
/** @type {[typeof __VLS_components.VSnackbar, typeof __VLS_components.vSnackbar, typeof __VLS_components.VSnackbar, typeof __VLS_components.vSnackbar, ]} */ ;
// @ts-ignore
const __VLS_61 = __VLS_asFunctionalComponent(__VLS_60, new __VLS_60({
    modelValue: (__VLS_ctx.snackbarVisible),
    timeout: (3000),
    color: (__VLS_ctx.snackbarColor),
    location: "top",
}));
const __VLS_62 = __VLS_61({
    modelValue: (__VLS_ctx.snackbarVisible),
    timeout: (3000),
    color: (__VLS_ctx.snackbarColor),
    location: "top",
}, ...__VLS_functionalComponentArgsRest(__VLS_61));
__VLS_63.slots.default;
(__VLS_ctx.snackbarText);
var __VLS_63;
/** @type {__VLS_StyleScopedClasses['text-center']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            RandomImage: RandomImage,
            t: t,
            visible: visible,
            isLoading: isLoading,
            snackbarVisible: snackbarVisible,
            snackbarText: snackbarText,
            snackbarColor: snackbarColor,
            userAlreadyHasHero: userAlreadyHasHero,
            isLimitReached: isLimitReached,
            filteredHeroes: filteredHeroes,
            openModal: openModal,
            addHeroToCampaign: addHeroToCampaign,
            addRandomHeroToCampaign: addRandomHeroToCampaign,
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
