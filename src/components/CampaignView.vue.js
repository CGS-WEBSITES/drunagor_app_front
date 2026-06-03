/// <reference types="../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import { useI18n } from "vue-i18n";
import { useRoute, useRouter } from "vue-router";
import { ref, onMounted, watch, nextTick, onBeforeUnmount, computed, inject, } from "vue";
import { ref as vueRef } from "vue";
import CampaignLogAddHero from "@/components/CampaignLogAddHero.vue";
import CampaignLogRemoveHero from "@/components/CampaignLogRemoveHero.vue";
import CampaignLog from "@/components/CampaignLog.vue";
import CampaignRemove from "@/components/CampaignRemove.vue";
import CampaignExport from "@/components/CampaignExport.vue";
import CampaignSavePut from "@/components/CampaignSavePut.vue";
import CampaignName from "@/components/CampaignName.vue";
import CampaignBook from "@/components/CampaignBookNew.vue";
import CampaignPlayerList from "@/components/CampaignPlayerList.vue";
import ShareCampaignButton from "./ShareCampaignButton.vue";
import CampaignLogImportHero from "@/components/CampaignLogImportHero.vue";
import CampaignRuneCards from "@/components/CampaignRuneCards.vue";
import CampaignRunes from "@/components/CampaignRunes.vue";
import SelectDoor from "@/components/SelectDoor.vue";
import StoryRecord from "@/components/StoryRecord.vue";
import StoryRecordLegacyTrail from "@/components/StoryRecordLegacyTrail.vue";
import StoryRecordBackgroundAndTrait from "@/components/StoryRecordBackgroundAndTrait.vue";
import { CampaignStore } from "@/store/CampaignStore";
import { HeroStore } from "@/store/HeroStore";
import { useUserStore } from "@/store/UserStore";
import { useSaveCampaignTour } from "@/components/Composable/useSaveCampaignTour";
import { useLoadCampaignTour } from "@/components/Composable/useLoadCampaignTour";
import CampaignImmersiveView from "@/components/CampaignImmersiveView.vue";
import TharmagarChat from "@/components/TharmagarChat.vue";
import { CampaignLoadFromStorage } from "@/utils/CampaignLoadFromStorage";
const campaignStore = CampaignStore();
const heroStore = HeroStore();
const userStore = useUserStore();
const router = useRouter();
const route = useRoute();
const axios = inject("axios");
const { t } = useI18n();
const campaignId = route.params.id.toString();
const isImmersiveMode = computed(() => {
    if (!campaign.value)
        return false;
    if (campaign.value.campaign === "underkeep2")
        return true;
    const wing = (campaign.value.wing || "").toUpperCase();
    return wing.includes("WING 1") || wing.includes("WING 2") || wing.includes("WING 01") || wing.includes("WING 02") || wing.includes("TUTORIAL");
});
const playerListDialogVisible = ref(false);
const partyCode = ref(null);
const isSequentialAdventure = ref(true);
const campaign = ref(null);
const currentTab = ref("normal");
watch(currentTab, () => {
    window.scrollTo({ top: 0, behavior: "instant" });
    if (document.documentElement)
        document.documentElement.scrollTop = 0;
    if (document.body)
        document.body.scrollTop = 0;
});
const isAdminUser = ref(true);
const isSyncingFromServer = ref(false);
let pollingTimer = null;
let autoSaveTimeout = null;
const checkUserRole = async () => {
    isAdminUser.value = true;
};
const triggerAutoSave = () => {
    if (!isAdminUser.value)
        return;
    if (isSyncingFromServer.value)
        return;
    if (autoSaveTimeout) {
        clearTimeout(autoSaveTimeout);
    }
    autoSaveTimeout = setTimeout(async () => {
        console.log("[CampaignView] Auto-saving campaign state...");
        await handleSave();
    }, 1500);
};
const startPollingForUpdates = () => {
    if (pollingTimer) {
        clearInterval(pollingTimer);
    }
    pollingTimer = setInterval(async () => {
        try {
            if (!userStore.user?.users_pk) {
                userStore.restoreFromStorage();
            }
            if (!userStore.user?.users_pk) {
                console.warn("[CampaignView] Polling skipped: users_pk is missing");
                return;
            }
            const urlParams = new URLSearchParams(window.location.search);
            const skuStr = urlParams.get('sku');
            let showSeason2 = false;
            const existingCampaign = campaignStore.findOptional(campaignId);
            if (existingCampaign) {
                showSeason2 = existingCampaign.campaign === 'underkeep2';
            }
            else if (skuStr) {
                showSeason2 = Number(skuStr) === 39;
            }
            let response;
            try {
                response = await axios.get("/rl_campaigns_users/search", {
                    params: {
                        users_fk: userStore.user.users_pk,
                        campaigns_fk: campaignId,
                        show_season2: showSeason2
                    },
                });
            }
            catch (err) {
                console.warn(`[CampaignView] Polling primary search failed (show_season2=${showSeason2}):`, err);
            }
            if (!response?.data?.campaigns?.length) {
                try {
                    response = await axios.get("/rl_campaigns_users/search", {
                        params: {
                            users_fk: userStore.user.users_pk,
                            campaigns_fk: campaignId,
                            show_season2: !showSeason2
                        },
                    });
                }
                catch (err) {
                    console.warn(`[CampaignView] Polling fallback search failed (show_season2=${!showSeason2}):`, err);
                }
            }
            if (response?.data?.campaigns?.length > 0) {
                const campaignData = response.data.campaigns[0];
                if (campaignData.tracker_hash) {
                    const currentLocalHash = localStorage.getItem(`campaign_hash_${campaignId}`);
                    if (campaignData.tracker_hash !== currentLocalHash) {
                        console.log("[CampaignView] New tracker hash detected! Reloading campaign in real-time...");
                        isSyncingFromServer.value = true;
                        const loader = new CampaignLoadFromStorage();
                        await loader.loadCampaignComplete(campaignId);
                        const updatedCampaign = campaignStore.findOptional(campaignId);
                        if (updatedCampaign) {
                            campaign.value = updatedCampaign;
                        }
                        isSyncingFromServer.value = false;
                    }
                }
            }
        }
        catch (err) {
            console.error("[CampaignView] Error polling for campaign updates:", err);
        }
    }, 4000);
};
// Deep watch on campaign state for auto-saving modifications
watch(campaign, (newVal) => {
    if (newVal && !isSyncingFromServer.value) {
        triggerAutoSave();
    }
}, { deep: true });
const showLoadInstructions = ref(false);
const snackbarVisible = ref(false);
const snackbarText = ref("");
const snackbarTitle = ref("");
const snackbarIcon = ref("mdi-check");
const snackbarColor = ref("success");
const snackbarIconColor = ref("white");
const snackbarTimeout = ref(3000);
const speedDialOpen = ref(true);
const tharmagarDialogVisible = ref(false);
const bottomNavValue = ref(null);
const savingState = ref("idle");
let savingStateTimeout = null;
const onSaving = () => {
    savingState.value = "saving";
    if (savingStateTimeout)
        clearTimeout(savingStateTimeout);
};
const REWARDS_DATA = {
    2: {
        name: "Tutorial Completed",
        picture_hash: "badges%26achievements/Tutorial%20Complete.png",
        description: "complete wing 1 tutorial"
    },
    3: {
        name: "Season 1 Completed",
        picture_hash: "badges%26achievements/Season%201%20Complete%20(4)-min.png",
        description: "complete wing 2 advanced"
    }
};
const newBadgeDialog = ref({ visible: false, reward: null });
const savePutRef = vueRef();
const campaignBookRef = vueRef(null);
const campaignPlayerListRef = vueRef(null);
const campaignRemoveRef = vueRef(null);
const campaignExportRef = vueRef(null);
const shareCampaignRef = vueRef(null);
const { startSaveTour, destroyTour: destroySaveTour, isActive: saveTourActive, pauseTourForNavigation, tryAutoResume, hasPausedTour, } = useSaveCampaignTour({
    onSaveClick: handleSave,
    onManageResourcesClick: handleManageResourcesAction,
    onEquipmentSkillsClick: handleEquipmentSkillsAction,
    campaignId,
});
const { startLoadTour, destroyTour: destroyLoadTour } = useLoadCampaignTour({
    onManageResourcesClick: handleManageResourcesAction,
    onEquipmentSkillsClick: handleEquipmentSkillsAction,
    campaignId,
});
const checkAndResumeTour = async () => {
    await nextTick();
    await new Promise((resolve) => setTimeout(resolve, 800));
    if (hasPausedTour()) {
        await tryAutoResume();
    }
};
function setAlert(icon, title, text, type, duration = 3000) {
    const colorMap = {
        success: { bg: "success", icon: "white" },
        info: { bg: "info", icon: "white" },
        warning: { bg: "warning", icon: "black" },
        error: { bg: "error", icon: "white" },
    };
    const colors = colorMap[type || "info"];
    snackbarIcon.value = icon;
    snackbarTitle.value = title;
    snackbarText.value = text;
    snackbarColor.value = colors.bg;
    snackbarIconColor.value = colors.icon;
    snackbarTimeout.value = duration;
    snackbarVisible.value = true;
}
function scrollToHeroSection() {
    const heroSection = document.querySelector(".v-sheet.rounded.border-md");
    if (!heroSection)
        return;
    heroSection.scrollIntoView({ behavior: "smooth", block: "start" });
    heroSection.style.transition = "box-shadow 0.3s ease";
    heroSection.style.boxShadow = "0 0 20px rgba(var(--v-theme-primary), 0.5)";
    setTimeout(() => (heroSection.style.boxShadow = ""), 2000);
}
function showHeroSelectionAlert(action, heroes) {
    const heroList = heroes.map((h) => h.name || `Hero ${h.heroId}`).join(", ");
    const actionText = action === "manage-resources" ? "Manage Resources" : "Equipment & Skills";
    setAlert("mdi-account-multiple-outline", "Multiple Heroes Found", `Multiple heroes found in this campaign: ${heroList}. Please scroll down to select the "${actionText}" button for the specific hero you want to manage.`, "info", 5000);
    setTimeout(() => scrollToHeroSection(), 500);
}
function navigateToHeroSequentialState(heroId) {
    if (saveTourActive.value) {
        console.log("[CampaignView] Pausando tour para navegação - manage resources");
        pauseTourForNavigation("manage-resources");
    }
    router.push({
        name: "HeroSequentialState",
        params: { campaignId: campaignId, heroId },
    });
}
function navigateToHeroEquipmentSkills(heroId) {
    if (saveTourActive.value) {
        console.log("[CampaignView] Pausando tour para navegação - equipment skills");
        pauseTourForNavigation("equipment-skills");
    }
    router.push({ name: "Hero", params: { campaignId: campaignId, heroId } });
}
function handleManageResourcesAction() {
    const heroes = campaignStore.findAllHeroes(campaignId);
    if (heroes.length === 0) {
        setAlert("mdi-information-outline", "Info", "No heroes found in this campaign. Please add heroes first.", "info");
        return;
    }
    if (heroes.length === 1) {
        navigateToHeroSequentialState(heroes[0].heroId);
        return;
    }
    showHeroSelectionAlert("manage-resources", heroes);
}
function handleEquipmentSkillsAction() {
    const heroes = campaignStore.findAllHeroes(campaignId);
    if (heroes.length === 0) {
        setAlert("mdi-information-outline", "Info", "No heroes found in this campaign. Please add heroes first.", "info");
        return;
    }
    if (heroes.length === 1) {
        navigateToHeroEquipmentSkills(heroes[0].heroId);
        return;
    }
    showHeroSelectionAlert("equipment-skills", heroes);
}
function handleQRCodeAction() {
    if (campaign.value &&
        ["underkeep", "underkeep2"].includes(campaign.value.campaign)) {
        currentTab.value = "book";
        nextTick(() => {
            if (campaignBookRef.value &&
                typeof campaignBookRef.value.forceNavigateToInteract === "function") {
                campaignBookRef.value.forceNavigateToInteract();
            }
        });
    }
    else {
        setAlert("mdi-information-outline", "Info", "QR Code interactions are only available for Underkeep campaigns.", "info");
    }
}
const generatePartyCode = () => {
    const prefix = Math.floor(1000 + Math.random() * 9000).toString();
    partyCode.value = `${prefix}${campaignId}`;
};
const openPlayerListDialog = async () => {
    if (campaignPlayerListRef.value) {
        await campaignPlayerListRef.value.fetchPlayers();
    }
    playerListDialogVisible.value = true;
};
const handleSpeedDialAction = (action) => {
    executeAction(action);
    speedDialOpen.value = false;
};
const handleBottomNavAction = (action) => {
    setTimeout(() => {
        bottomNavValue.value = null;
    }, 100);
    executeAction(action);
};
const executeAction = (action) => {
    switch (action) {
        case "save":
            // Bypassing Shepherd step-by-step tour as requested by user to save directly and instantly!
            handleSave();
            break;
        case "load-instructions":
            startLoadTour();
            break;
        case "qrcode":
            handleQRCodeAction();
            break;
        case "keywords":
            handleKeywordsAction();
            break;
        case "export":
            campaignExportRef.value?.export?.();
            break;
        case "player-list":
            openPlayerListDialog();
            break;
        case "tharmagar":
            tharmagarDialogVisible.value = true;
            break;
        case "remove":
            campaignRemoveRef.value?.openDialog?.();
            break;
    }
};
function handleKeywordsAction() {
    if (campaign.value &&
        ["underkeep", "underkeep2"].includes(campaign.value.campaign)) {
        currentTab.value = "book";
        nextTick(() => {
            if (campaignBookRef.value &&
                typeof campaignBookRef.value.navigateToKeywords === "function") {
                campaignBookRef.value.navigateToKeywords();
            }
        });
    }
    else {
        setAlert("mdi-information-outline", "Info", "Keywords are only available for Underkeep campaigns.", "info");
    }
}
async function handleSave() {
    if (!savePutRef.value) {
        console.error("savePutRef não está disponível");
        setAlert("mdi-alert-circle", "Error", "Save component not initialized. Please try again.", "error");
        return;
    }
    try {
        await savePutRef.value.save();
    }
    catch (error) {
        console.error("Erro ao salvar:", error);
    }
}
const onSaveSuccess = () => {
    savingState.value = "saved";
    if (savingStateTimeout)
        clearTimeout(savingStateTimeout);
    savingStateTimeout = setTimeout(() => {
        savingState.value = "idle";
    }, 2000);
    if (saveTourActive.value) {
        setTimeout(() => {
            destroySaveTour();
        }, 500);
    }
};
const onSaveFail = () => {
    savingState.value = "error";
    if (savingStateTimeout)
        clearTimeout(savingStateTimeout);
    savingStateTimeout = setTimeout(() => {
        savingState.value = "idle";
    }, 4000);
};
const onCampaignRemoved = () => {
    setAlert("mdi-check", "Success", "Campaign removed successfully", "success");
    router.push({ name: "Campaigns" });
};
const onPlayerRemoved = async () => {
    setAlert("mdi-check", "Success", "Player successfully removed", "success");
    if (campaignPlayerListRef.value) {
        await campaignPlayerListRef.value.fetchPlayers();
    }
};
watch(campaign, (c) => {
    if (c) {
        isSequentialAdventure.value = c.isSequentialAdventure ?? false;
        if (!["underkeep", "underkeep2"].includes(c.campaign)) {
            currentTab.value = "normal";
        }
    }
}, { deep: true });
watch(() => route.path, async (newPath, oldPath) => {
    const isReturningFromHero = oldPath &&
        (oldPath.includes("/hero-sequential-state/") ||
            oldPath.includes("/hero/")) &&
        newPath.includes(`/campaign/${campaignId}`);
    if (isReturningFromHero) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        await checkAndResumeTour();
    }
}, { immediate: false });
onBeforeUnmount(() => {
    window.removeEventListener("pageshow", () => { });
    destroySaveTour({ keepProgress: true });
    destroyLoadTour({ keepProgress: true });
    if (pollingTimer) {
        clearInterval(pollingTimer);
        pollingTimer = null;
    }
    if (autoSaveTimeout) {
        clearTimeout(autoSaveTimeout);
        autoSaveTimeout = null;
    }
});
onMounted(async () => {
    if (!campaignId) {
        setAlert("mdi-alert-circle", "Error", "Campaign ID is missing.", "error");
        return;
    }
    try {
        const existingCampaign = campaignStore.findOptional(campaignId);
        const heroCount = existingCampaign?.heroes?.length || 0;
        if (!existingCampaign || heroCount === 0) {
            const loader = new CampaignLoadFromStorage();
            const success = await loader.loadCampaignComplete(campaignId);
            if (!success) {
                throw new Error("loadCampaignComplete failed to find or load the campaign");
            }
        }
        else {
            console.log(`[CampaignView] Campaign already in store with ${heroCount} heroes, skipping load`);
        }
    }
    catch (error) {
        console.error("[CampaignView] Error loading campaign from backend:", error);
        setAlert("mdi-alert-circle", "Error", "Failed to load campaign data. Please try again.", "error");
        return;
    }
    const found = campaignStore.find(campaignId);
    if (found) {
        campaign.value = found;
        if (!campaign.value.isSequentialAdventure) {
            campaign.value.isSequentialAdventure = true;
            campaign.value.sequentialAdventureRunes = 0;
        }
        checkAndAwardSeason1Achievements();
    }
    else {
        setAlert("mdi-alert-circle", "Error", "Campaign with ID ${campaignId} not found.", "error");
        return;
    }
    // fetchRole removido. Acesso é total por padrão agora.
    generatePartyCode();
    await checkUserRole();
    startPollingForUpdates();
    const openInstructions = route.query.openInstructions;
    showLoadInstructions.value = openInstructions === "load";
    const isUnderkeepCampaign = campaign.value &&
        ["underkeep", "underkeep2"].includes(campaign.value.campaign);
    window.addEventListener("pageshow", async (event) => {
        if (isUnderkeepCampaign && hasPausedTour()) {
            await new Promise((resolve) => setTimeout(resolve, 500));
            await checkAndResumeTour();
        }
    });
    if (isUnderkeepCampaign && openInstructions === "load") {
        await nextTick();
        await new Promise((resolve) => setTimeout(resolve, 300));
        await startLoadTour();
    }
    else if (isUnderkeepCampaign) {
        await nextTick();
        await new Promise((resolve) => setTimeout(resolve, 1000));
        await checkAndResumeTour();
    }
    if (openInstructions === "load") {
        router.replace({
            path: route.path,
            query: { ...route.query, openInstructions: undefined },
        });
    }
});
const checkAndAwardSeason1Achievements = async () => {
    if (!campaign.value || campaign.value.campaign !== "underkeep" || !userStore.user?.users_pk)
        return;
    try {
        const { data: relationData } = await axios.get("/rl_campaigns_users/search", {
            params: {
                users_fk: userStore.user.users_pk,
                campaigns_fk: campaignId,
            },
        });
        if (relationData?.campaigns?.length > 0) {
            const relation = relationData.campaigns[0];
            if (relation.events_fk) {
                const wingStr = (campaign.value.wing || "").toUpperCase();
                let rewardPk = null;
                if (wingStr.includes("TUTORIAL") || wingStr.includes("WING 1 TUTORIAL")) {
                    rewardPk = 2;
                }
                else if (wingStr.includes("WING 2 ADVANCED") || wingStr.includes("WING 2")) {
                    rewardPk = 3;
                }
                if (rewardPk) {
                    const { data: rewardData } = await axios.get("/rl_users_rewards/list_rewards", {
                        params: { users_fk: userStore.user.users_pk }
                    });
                    const userRewards = rewardData.rewards || [];
                    const hasReward = userRewards.some((r) => r.rewards_pk === rewardPk);
                    if (!hasReward) {
                        await axios.post("/rl_users_rewards/cadastro", {
                            users_fk: userStore.user.users_pk,
                            rewards_fk: rewardPk
                        });
                        newBadgeDialog.value = {
                            visible: true,
                            reward: REWARDS_DATA[rewardPk]
                        };
                    }
                }
            }
        }
    }
    catch (error) {
        console.error("Error checking or awarding Season 1 achievements:", error);
    }
};
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['global-snackbar']} */ ;
/** @type {__VLS_StyleScopedClasses['v-snackbar__wrapper']} */ ;
/** @type {__VLS_StyleScopedClasses['campaign-content']} */ ;
/** @type {__VLS_StyleScopedClasses['speed-dial-activator']} */ ;
/** @type {__VLS_StyleScopedClasses['speed-dial-item']} */ ;
/** @type {__VLS_StyleScopedClasses['speed-dial-item']} */ ;
/** @type {__VLS_StyleScopedClasses['speed-dial-item-qr']} */ ;
/** @type {__VLS_StyleScopedClasses['speed-dial-item-qr']} */ ;
/** @type {__VLS_StyleScopedClasses['bottom-nav-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['v-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['bottom-nav-btn-qr']} */ ;
/** @type {__VLS_StyleScopedClasses['bottom-nav-btn-qr']} */ ;
/** @type {__VLS_StyleScopedClasses['v-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['hero-highlight']} */ ;
/** @type {__VLS_StyleScopedClasses['action-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['action-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['action-group']} */ ;
/** @type {__VLS_StyleScopedClasses['campaign-content']} */ ;
/** @type {__VLS_StyleScopedClasses['with-bottom-nav']} */ ;
/** @type {__VLS_StyleScopedClasses['action-group']} */ ;
/** @type {__VLS_StyleScopedClasses['campaign-content']} */ ;
/** @type {__VLS_StyleScopedClasses['campaign-content']} */ ;
/** @type {__VLS_StyleScopedClasses['with-bottom-nav']} */ ;
/** @type {__VLS_StyleScopedClasses['bottom-nav-label']} */ ;
/** @type {__VLS_StyleScopedClasses['bottom-nav-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['v-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['bottom-nav-label-qr']} */ ;
/** @type {__VLS_StyleScopedClasses['bottom-nav-btn-qr']} */ ;
/** @type {__VLS_StyleScopedClasses['v-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['saving-indicator-bubble']} */ ;
/** @type {__VLS_StyleScopedClasses['saving-indicator-bubble']} */ ;
/** @type {__VLS_StyleScopedClasses['saving-indicator-bubble']} */ ;
// CSS variable injection 
// CSS variable injection end 
if (__VLS_ctx.isImmersiveMode) {
    /** @type {[typeof CampaignImmersiveView, ]} */ ;
    // @ts-ignore
    const __VLS_0 = __VLS_asFunctionalComponent(CampaignImmersiveView, new CampaignImmersiveView({
        ...{ 'onRefreshCampaign': {} },
        campaignId: (__VLS_ctx.campaignId),
        campaign: (__VLS_ctx.campaign),
        heroStore: (__VLS_ctx.heroStore),
        userStore: (__VLS_ctx.userStore),
        showSaveCampaignButton: (true),
    }));
    const __VLS_1 = __VLS_0({
        ...{ 'onRefreshCampaign': {} },
        campaignId: (__VLS_ctx.campaignId),
        campaign: (__VLS_ctx.campaign),
        heroStore: (__VLS_ctx.heroStore),
        userStore: (__VLS_ctx.userStore),
        showSaveCampaignButton: (true),
    }, ...__VLS_functionalComponentArgsRest(__VLS_0));
    let __VLS_3;
    let __VLS_4;
    let __VLS_5;
    const __VLS_6 = {
        onRefreshCampaign: (() => { })
    };
    var __VLS_7 = {};
    var __VLS_2;
}
else {
    const __VLS_8 = {}.VSnackbar;
    /** @type {[typeof __VLS_components.VSnackbar, typeof __VLS_components.vSnackbar, typeof __VLS_components.VSnackbar, typeof __VLS_components.vSnackbar, ]} */ ;
    // @ts-ignore
    const __VLS_9 = __VLS_asFunctionalComponent(__VLS_8, new __VLS_8({
        modelValue: (__VLS_ctx.snackbarVisible),
        timeout: (__VLS_ctx.snackbarTimeout),
        color: (__VLS_ctx.snackbarColor),
        location: "top",
        elevation: "24",
        rounded: "lg",
        multiLine: true,
        ...{ class: "global-snackbar" },
    }));
    const __VLS_10 = __VLS_9({
        modelValue: (__VLS_ctx.snackbarVisible),
        timeout: (__VLS_ctx.snackbarTimeout),
        color: (__VLS_ctx.snackbarColor),
        location: "top",
        elevation: "24",
        rounded: "lg",
        multiLine: true,
        ...{ class: "global-snackbar" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_9));
    __VLS_11.slots.default;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "d-flex align-center" },
    });
    const __VLS_12 = {}.VIcon;
    /** @type {[typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, ]} */ ;
    // @ts-ignore
    const __VLS_13 = __VLS_asFunctionalComponent(__VLS_12, new __VLS_12({
        color: (__VLS_ctx.snackbarIconColor),
        ...{ class: "mr-3" },
    }));
    const __VLS_14 = __VLS_13({
        color: (__VLS_ctx.snackbarIconColor),
        ...{ class: "mr-3" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_13));
    __VLS_15.slots.default;
    (__VLS_ctx.snackbarIcon);
    var __VLS_15;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
    if (__VLS_ctx.snackbarTitle) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "font-weight-bold" },
        });
        (__VLS_ctx.snackbarTitle);
    }
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
    (__VLS_ctx.snackbarText);
    var __VLS_11;
    const __VLS_16 = {}.VDialog;
    /** @type {[typeof __VLS_components.VDialog, typeof __VLS_components.vDialog, typeof __VLS_components.VDialog, typeof __VLS_components.vDialog, ]} */ ;
    // @ts-ignore
    const __VLS_17 = __VLS_asFunctionalComponent(__VLS_16, new __VLS_16({
        modelValue: (__VLS_ctx.playerListDialogVisible),
        maxWidth: "600px",
    }));
    const __VLS_18 = __VLS_17({
        modelValue: (__VLS_ctx.playerListDialogVisible),
        maxWidth: "600px",
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
        ...{ class: "d-flex justify-space-between align-center" },
    }));
    const __VLS_26 = __VLS_25({
        ...{ class: "d-flex justify-space-between align-center" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_25));
    __VLS_27.slots.default;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "text-h5" },
    });
    const __VLS_28 = {}.VBtn;
    /** @type {[typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ]} */ ;
    // @ts-ignore
    const __VLS_29 = __VLS_asFunctionalComponent(__VLS_28, new __VLS_28({
        ...{ 'onClick': {} },
        icon: "mdi-close",
        variant: "text",
    }));
    const __VLS_30 = __VLS_29({
        ...{ 'onClick': {} },
        icon: "mdi-close",
        variant: "text",
    }, ...__VLS_functionalComponentArgsRest(__VLS_29));
    let __VLS_32;
    let __VLS_33;
    let __VLS_34;
    const __VLS_35 = {
        onClick: (...[$event]) => {
            if (!!(__VLS_ctx.isImmersiveMode))
                return;
            __VLS_ctx.playerListDialogVisible = false;
        }
    };
    var __VLS_31;
    var __VLS_27;
    const __VLS_36 = {}.VCardText;
    /** @type {[typeof __VLS_components.VCardText, typeof __VLS_components.vCardText, typeof __VLS_components.VCardText, typeof __VLS_components.vCardText, ]} */ ;
    // @ts-ignore
    const __VLS_37 = __VLS_asFunctionalComponent(__VLS_36, new __VLS_36({}));
    const __VLS_38 = __VLS_37({}, ...__VLS_functionalComponentArgsRest(__VLS_37));
    __VLS_39.slots.default;
    /** @type {[typeof CampaignPlayerList, ]} */ ;
    // @ts-ignore
    const __VLS_40 = __VLS_asFunctionalComponent(CampaignPlayerList, new CampaignPlayerList({
        ...{ 'onPlayerRemoved': {} },
        ref: "campaignPlayerListRef",
        campaignId: (__VLS_ctx.campaignId),
        showRemoveButton: (true),
        density: "compact",
    }));
    const __VLS_41 = __VLS_40({
        ...{ 'onPlayerRemoved': {} },
        ref: "campaignPlayerListRef",
        campaignId: (__VLS_ctx.campaignId),
        showRemoveButton: (true),
        density: "compact",
    }, ...__VLS_functionalComponentArgsRest(__VLS_40));
    let __VLS_43;
    let __VLS_44;
    let __VLS_45;
    const __VLS_46 = {
        onPlayerRemoved: (__VLS_ctx.onPlayerRemoved)
    };
    /** @type {typeof __VLS_ctx.campaignPlayerListRef} */ ;
    var __VLS_47 = {};
    var __VLS_42;
    var __VLS_39;
    const __VLS_49 = {}.VDivider;
    /** @type {[typeof __VLS_components.VDivider, typeof __VLS_components.vDivider, typeof __VLS_components.VDivider, typeof __VLS_components.vDivider, ]} */ ;
    // @ts-ignore
    const __VLS_50 = __VLS_asFunctionalComponent(__VLS_49, new __VLS_49({}));
    const __VLS_51 = __VLS_50({}, ...__VLS_functionalComponentArgsRest(__VLS_50));
    const __VLS_53 = {}.VCardActions;
    /** @type {[typeof __VLS_components.VCardActions, typeof __VLS_components.vCardActions, typeof __VLS_components.VCardActions, typeof __VLS_components.vCardActions, ]} */ ;
    // @ts-ignore
    const __VLS_54 = __VLS_asFunctionalComponent(__VLS_53, new __VLS_53({
        ...{ class: "d-flex flex-wrap justify-space-around pa-4" },
    }));
    const __VLS_55 = __VLS_54({
        ...{ class: "d-flex flex-wrap justify-space-around pa-4" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_54));
    __VLS_56.slots.default;
    const __VLS_57 = {}.VBtn;
    /** @type {[typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ]} */ ;
    // @ts-ignore
    const __VLS_58 = __VLS_asFunctionalComponent(__VLS_57, new __VLS_57({
        ...{ 'onClick': {} },
        variant: "elevated",
        rounded: true,
        prependIcon: "mdi-account-plus-outline",
        ...{ class: "my-2" },
    }));
    const __VLS_59 = __VLS_58({
        ...{ 'onClick': {} },
        variant: "elevated",
        rounded: true,
        prependIcon: "mdi-account-plus-outline",
        ...{ class: "my-2" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_58));
    let __VLS_61;
    let __VLS_62;
    let __VLS_63;
    const __VLS_64 = {
        onClick: (...[$event]) => {
            if (!!(__VLS_ctx.isImmersiveMode))
                return;
            __VLS_ctx.shareCampaignRef?.openDialog?.();
        }
    };
    __VLS_60.slots.default;
    var __VLS_60;
    var __VLS_56;
    var __VLS_23;
    var __VLS_19;
    const __VLS_65 = {}.VSpeedDial;
    /** @type {[typeof __VLS_components.VSpeedDial, typeof __VLS_components.vSpeedDial, typeof __VLS_components.VSpeedDial, typeof __VLS_components.vSpeedDial, ]} */ ;
    // @ts-ignore
    const __VLS_66 = __VLS_asFunctionalComponent(__VLS_65, new __VLS_65({
        modelValue: (__VLS_ctx.speedDialOpen),
        transition: "fade-transition",
        ...{ class: "d-none d-md-flex" },
    }));
    const __VLS_67 = __VLS_66({
        modelValue: (__VLS_ctx.speedDialOpen),
        transition: "fade-transition",
        ...{ class: "d-none d-md-flex" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_66));
    __VLS_68.slots.default;
    {
        const { activator: __VLS_thisSlot } = __VLS_68.slots;
        const { props: activatorProps } = __VLS_getSlotParam(__VLS_thisSlot);
        const __VLS_69 = {}.VBtn;
        /** @type {[typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ]} */ ;
        // @ts-ignore
        const __VLS_70 = __VLS_asFunctionalComponent(__VLS_69, new __VLS_69({
            ...(activatorProps),
            color: (__VLS_ctx.speedDialOpen ? 'red' : 'green'),
            size: "large",
            icon: true,
            ...{ class: "speed-dial-activator d-none d-md-flex" },
            elevation: "14",
        }));
        const __VLS_71 = __VLS_70({
            ...(activatorProps),
            color: (__VLS_ctx.speedDialOpen ? 'red' : 'green'),
            size: "large",
            icon: true,
            ...{ class: "speed-dial-activator d-none d-md-flex" },
            elevation: "14",
        }, ...__VLS_functionalComponentArgsRest(__VLS_70));
        __VLS_72.slots.default;
        const __VLS_73 = {}.VIcon;
        /** @type {[typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, ]} */ ;
        // @ts-ignore
        const __VLS_74 = __VLS_asFunctionalComponent(__VLS_73, new __VLS_73({}));
        const __VLS_75 = __VLS_74({}, ...__VLS_functionalComponentArgsRest(__VLS_74));
        __VLS_76.slots.default;
        (__VLS_ctx.speedDialOpen ? "mdi-close" : "mdi-script-text-outline");
        var __VLS_76;
        var __VLS_72;
    }
    const __VLS_77 = {}.VBtn;
    /** @type {[typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ]} */ ;
    // @ts-ignore
    const __VLS_78 = __VLS_asFunctionalComponent(__VLS_77, new __VLS_77({
        ...{ 'onClick': {} },
        key: "save",
        size: "small",
        color: "success",
        icon: true,
        ...{ class: "speed-dial-item" },
    }));
    const __VLS_79 = __VLS_78({
        ...{ 'onClick': {} },
        key: "save",
        size: "small",
        color: "success",
        icon: true,
        ...{ class: "speed-dial-item" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_78));
    let __VLS_81;
    let __VLS_82;
    let __VLS_83;
    const __VLS_84 = {
        onClick: (...[$event]) => {
            if (!!(__VLS_ctx.isImmersiveMode))
                return;
            __VLS_ctx.handleSpeedDialAction('save');
        }
    };
    __VLS_80.slots.default;
    const __VLS_85 = {}.VIcon;
    /** @type {[typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, ]} */ ;
    // @ts-ignore
    const __VLS_86 = __VLS_asFunctionalComponent(__VLS_85, new __VLS_85({}));
    const __VLS_87 = __VLS_86({}, ...__VLS_functionalComponentArgsRest(__VLS_86));
    __VLS_88.slots.default;
    var __VLS_88;
    const __VLS_89 = {}.VTooltip;
    /** @type {[typeof __VLS_components.VTooltip, typeof __VLS_components.vTooltip, typeof __VLS_components.VTooltip, typeof __VLS_components.vTooltip, ]} */ ;
    // @ts-ignore
    const __VLS_90 = __VLS_asFunctionalComponent(__VLS_89, new __VLS_89({
        activator: "parent",
        location: "start",
    }));
    const __VLS_91 = __VLS_90({
        activator: "parent",
        location: "start",
    }, ...__VLS_functionalComponentArgsRest(__VLS_90));
    __VLS_92.slots.default;
    (__VLS_ctx.t("label.save-campaign-put") || "Save Campaign");
    var __VLS_92;
    var __VLS_80;
    if (__VLS_ctx.campaign &&
        ['underkeep', 'underkeep2'].includes(__VLS_ctx.campaign.campaign) &&
        __VLS_ctx.showLoadInstructions) {
        const __VLS_93 = {}.VBtn;
        /** @type {[typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ]} */ ;
        // @ts-ignore
        const __VLS_94 = __VLS_asFunctionalComponent(__VLS_93, new __VLS_93({
            ...{ 'onClick': {} },
            key: "load-instructions",
            size: "small",
            color: "info",
            icon: true,
            ...{ class: "speed-dial-item" },
        }));
        const __VLS_95 = __VLS_94({
            ...{ 'onClick': {} },
            key: "load-instructions",
            size: "small",
            color: "info",
            icon: true,
            ...{ class: "speed-dial-item" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_94));
        let __VLS_97;
        let __VLS_98;
        let __VLS_99;
        const __VLS_100 = {
            onClick: (...[$event]) => {
                if (!!(__VLS_ctx.isImmersiveMode))
                    return;
                if (!(__VLS_ctx.campaign &&
                    ['underkeep', 'underkeep2'].includes(__VLS_ctx.campaign.campaign) &&
                    __VLS_ctx.showLoadInstructions))
                    return;
                __VLS_ctx.handleSpeedDialAction('load-instructions');
            }
        };
        __VLS_96.slots.default;
        const __VLS_101 = {}.VIcon;
        /** @type {[typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, ]} */ ;
        // @ts-ignore
        const __VLS_102 = __VLS_asFunctionalComponent(__VLS_101, new __VLS_101({}));
        const __VLS_103 = __VLS_102({}, ...__VLS_functionalComponentArgsRest(__VLS_102));
        __VLS_104.slots.default;
        var __VLS_104;
        const __VLS_105 = {}.VTooltip;
        /** @type {[typeof __VLS_components.VTooltip, typeof __VLS_components.vTooltip, typeof __VLS_components.VTooltip, typeof __VLS_components.vTooltip, ]} */ ;
        // @ts-ignore
        const __VLS_106 = __VLS_asFunctionalComponent(__VLS_105, new __VLS_105({
            activator: "parent",
            location: "start",
        }));
        const __VLS_107 = __VLS_106({
            activator: "parent",
            location: "start",
        }, ...__VLS_functionalComponentArgsRest(__VLS_106));
        __VLS_108.slots.default;
        var __VLS_108;
        var __VLS_96;
    }
    const __VLS_109 = {}.VBtn;
    /** @type {[typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ]} */ ;
    // @ts-ignore
    const __VLS_110 = __VLS_asFunctionalComponent(__VLS_109, new __VLS_109({
        ...{ 'onClick': {} },
        key: "export",
        size: "small",
        color: "orange",
        icon: true,
        ...{ class: "speed-dial-item" },
    }));
    const __VLS_111 = __VLS_110({
        ...{ 'onClick': {} },
        key: "export",
        size: "small",
        color: "orange",
        icon: true,
        ...{ class: "speed-dial-item" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_110));
    let __VLS_113;
    let __VLS_114;
    let __VLS_115;
    const __VLS_116 = {
        onClick: (...[$event]) => {
            if (!!(__VLS_ctx.isImmersiveMode))
                return;
            __VLS_ctx.handleSpeedDialAction('export');
        }
    };
    __VLS_112.slots.default;
    const __VLS_117 = {}.VIcon;
    /** @type {[typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, ]} */ ;
    // @ts-ignore
    const __VLS_118 = __VLS_asFunctionalComponent(__VLS_117, new __VLS_117({}));
    const __VLS_119 = __VLS_118({}, ...__VLS_functionalComponentArgsRest(__VLS_118));
    __VLS_120.slots.default;
    var __VLS_120;
    const __VLS_121 = {}.VTooltip;
    /** @type {[typeof __VLS_components.VTooltip, typeof __VLS_components.vTooltip, typeof __VLS_components.VTooltip, typeof __VLS_components.vTooltip, ]} */ ;
    // @ts-ignore
    const __VLS_122 = __VLS_asFunctionalComponent(__VLS_121, new __VLS_121({
        activator: "parent",
        location: "start",
    }));
    const __VLS_123 = __VLS_122({
        activator: "parent",
        location: "start",
    }, ...__VLS_functionalComponentArgsRest(__VLS_122));
    __VLS_124.slots.default;
    var __VLS_124;
    var __VLS_112;
    const __VLS_125 = {}.VBtn;
    /** @type {[typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ]} */ ;
    // @ts-ignore
    const __VLS_126 = __VLS_asFunctionalComponent(__VLS_125, new __VLS_125({
        ...{ 'onClick': {} },
        key: "player-list",
        size: "small",
        color: "secondary",
        icon: true,
        ...{ class: "speed-dial-item" },
    }));
    const __VLS_127 = __VLS_126({
        ...{ 'onClick': {} },
        key: "player-list",
        size: "small",
        color: "secondary",
        icon: true,
        ...{ class: "speed-dial-item" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_126));
    let __VLS_129;
    let __VLS_130;
    let __VLS_131;
    const __VLS_132 = {
        onClick: (__VLS_ctx.openPlayerListDialog)
    };
    __VLS_128.slots.default;
    const __VLS_133 = {}.VIcon;
    /** @type {[typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, ]} */ ;
    // @ts-ignore
    const __VLS_134 = __VLS_asFunctionalComponent(__VLS_133, new __VLS_133({}));
    const __VLS_135 = __VLS_134({}, ...__VLS_functionalComponentArgsRest(__VLS_134));
    __VLS_136.slots.default;
    var __VLS_136;
    const __VLS_137 = {}.VTooltip;
    /** @type {[typeof __VLS_components.VTooltip, typeof __VLS_components.vTooltip, typeof __VLS_components.VTooltip, typeof __VLS_components.vTooltip, ]} */ ;
    // @ts-ignore
    const __VLS_138 = __VLS_asFunctionalComponent(__VLS_137, new __VLS_137({
        activator: "parent",
        location: "start",
    }));
    const __VLS_139 = __VLS_138({
        activator: "parent",
        location: "start",
    }, ...__VLS_functionalComponentArgsRest(__VLS_138));
    __VLS_140.slots.default;
    var __VLS_140;
    var __VLS_128;
    const __VLS_141 = {}.VBtn;
    /** @type {[typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ]} */ ;
    // @ts-ignore
    const __VLS_142 = __VLS_asFunctionalComponent(__VLS_141, new __VLS_141({
        ...{ 'onClick': {} },
        key: "tharmagar",
        size: "small",
        color: "amber-darken-2",
        icon: true,
        ...{ class: "speed-dial-item" },
    }));
    const __VLS_143 = __VLS_142({
        ...{ 'onClick': {} },
        key: "tharmagar",
        size: "small",
        color: "amber-darken-2",
        icon: true,
        ...{ class: "speed-dial-item" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_142));
    let __VLS_145;
    let __VLS_146;
    let __VLS_147;
    const __VLS_148 = {
        onClick: (...[$event]) => {
            if (!!(__VLS_ctx.isImmersiveMode))
                return;
            __VLS_ctx.handleSpeedDialAction('tharmagar');
        }
    };
    __VLS_144.slots.default;
    const __VLS_149 = {}.VIcon;
    /** @type {[typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, ]} */ ;
    // @ts-ignore
    const __VLS_150 = __VLS_asFunctionalComponent(__VLS_149, new __VLS_149({}));
    const __VLS_151 = __VLS_150({}, ...__VLS_functionalComponentArgsRest(__VLS_150));
    __VLS_152.slots.default;
    var __VLS_152;
    const __VLS_153 = {}.VTooltip;
    /** @type {[typeof __VLS_components.VTooltip, typeof __VLS_components.vTooltip, typeof __VLS_components.VTooltip, typeof __VLS_components.vTooltip, ]} */ ;
    // @ts-ignore
    const __VLS_154 = __VLS_asFunctionalComponent(__VLS_153, new __VLS_153({
        activator: "parent",
        location: "start",
    }));
    const __VLS_155 = __VLS_154({
        activator: "parent",
        location: "start",
    }, ...__VLS_functionalComponentArgsRest(__VLS_154));
    __VLS_156.slots.default;
    var __VLS_156;
    var __VLS_144;
    const __VLS_157 = {}.VBtn;
    /** @type {[typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ]} */ ;
    // @ts-ignore
    const __VLS_158 = __VLS_asFunctionalComponent(__VLS_157, new __VLS_157({
        ...{ 'onClick': {} },
        key: "remove",
        size: "small",
        color: "error",
        icon: true,
        ...{ class: "speed-dial-item" },
    }));
    const __VLS_159 = __VLS_158({
        ...{ 'onClick': {} },
        key: "remove",
        size: "small",
        color: "error",
        icon: true,
        ...{ class: "speed-dial-item" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_158));
    let __VLS_161;
    let __VLS_162;
    let __VLS_163;
    const __VLS_164 = {
        onClick: (...[$event]) => {
            if (!!(__VLS_ctx.isImmersiveMode))
                return;
            __VLS_ctx.handleSpeedDialAction('remove');
        }
    };
    __VLS_160.slots.default;
    const __VLS_165 = {}.VIcon;
    /** @type {[typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, ]} */ ;
    // @ts-ignore
    const __VLS_166 = __VLS_asFunctionalComponent(__VLS_165, new __VLS_165({}));
    const __VLS_167 = __VLS_166({}, ...__VLS_functionalComponentArgsRest(__VLS_166));
    __VLS_168.slots.default;
    var __VLS_168;
    const __VLS_169 = {}.VTooltip;
    /** @type {[typeof __VLS_components.VTooltip, typeof __VLS_components.vTooltip, typeof __VLS_components.VTooltip, typeof __VLS_components.vTooltip, ]} */ ;
    // @ts-ignore
    const __VLS_170 = __VLS_asFunctionalComponent(__VLS_169, new __VLS_169({
        activator: "parent",
        location: "start",
    }));
    const __VLS_171 = __VLS_170({
        activator: "parent",
        location: "start",
    }, ...__VLS_functionalComponentArgsRest(__VLS_170));
    __VLS_172.slots.default;
    var __VLS_172;
    var __VLS_160;
    var __VLS_68;
    const __VLS_173 = {}.VBottomNavigation;
    /** @type {[typeof __VLS_components.VBottomNavigation, typeof __VLS_components.vBottomNavigation, typeof __VLS_components.VBottomNavigation, typeof __VLS_components.vBottomNavigation, ]} */ ;
    // @ts-ignore
    const __VLS_174 = __VLS_asFunctionalComponent(__VLS_173, new __VLS_173({
        modelValue: (__VLS_ctx.bottomNavValue),
        ...{ class: "d-md-none mobile-bottom-nav" },
        bgColor: "surface",
        grow: true,
        elevation: "8",
        height: "65",
    }));
    const __VLS_175 = __VLS_174({
        modelValue: (__VLS_ctx.bottomNavValue),
        ...{ class: "d-md-none mobile-bottom-nav" },
        bgColor: "surface",
        grow: true,
        elevation: "8",
        height: "65",
    }, ...__VLS_functionalComponentArgsRest(__VLS_174));
    __VLS_176.slots.default;
    const __VLS_177 = {}.VBtn;
    /** @type {[typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ]} */ ;
    // @ts-ignore
    const __VLS_178 = __VLS_asFunctionalComponent(__VLS_177, new __VLS_177({
        ...{ 'onClick': {} },
        value: "save",
        ...{ class: "bottom-nav-btn" },
    }));
    const __VLS_179 = __VLS_178({
        ...{ 'onClick': {} },
        value: "save",
        ...{ class: "bottom-nav-btn" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_178));
    let __VLS_181;
    let __VLS_182;
    let __VLS_183;
    const __VLS_184 = {
        onClick: (...[$event]) => {
            if (!!(__VLS_ctx.isImmersiveMode))
                return;
            __VLS_ctx.handleBottomNavAction('save');
        }
    };
    __VLS_180.slots.default;
    const __VLS_185 = {}.VIcon;
    /** @type {[typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, ]} */ ;
    // @ts-ignore
    const __VLS_186 = __VLS_asFunctionalComponent(__VLS_185, new __VLS_185({}));
    const __VLS_187 = __VLS_186({}, ...__VLS_functionalComponentArgsRest(__VLS_186));
    __VLS_188.slots.default;
    var __VLS_188;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "bottom-nav-label" },
    });
    var __VLS_180;
    if (__VLS_ctx.campaign &&
        ['underkeep', 'underkeep2'].includes(__VLS_ctx.campaign.campaign) &&
        __VLS_ctx.showLoadInstructions) {
        const __VLS_189 = {}.VBtn;
        /** @type {[typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ]} */ ;
        // @ts-ignore
        const __VLS_190 = __VLS_asFunctionalComponent(__VLS_189, new __VLS_189({
            ...{ 'onClick': {} },
            value: "load-instructions",
            ...{ class: "bottom-nav-btn" },
        }));
        const __VLS_191 = __VLS_190({
            ...{ 'onClick': {} },
            value: "load-instructions",
            ...{ class: "bottom-nav-btn" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_190));
        let __VLS_193;
        let __VLS_194;
        let __VLS_195;
        const __VLS_196 = {
            onClick: (...[$event]) => {
                if (!!(__VLS_ctx.isImmersiveMode))
                    return;
                if (!(__VLS_ctx.campaign &&
                    ['underkeep', 'underkeep2'].includes(__VLS_ctx.campaign.campaign) &&
                    __VLS_ctx.showLoadInstructions))
                    return;
                __VLS_ctx.handleBottomNavAction('load-instructions');
            }
        };
        __VLS_192.slots.default;
        const __VLS_197 = {}.VIcon;
        /** @type {[typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, ]} */ ;
        // @ts-ignore
        const __VLS_198 = __VLS_asFunctionalComponent(__VLS_197, new __VLS_197({}));
        const __VLS_199 = __VLS_198({}, ...__VLS_functionalComponentArgsRest(__VLS_198));
        __VLS_200.slots.default;
        var __VLS_200;
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ class: "bottom-nav-label" },
        });
        var __VLS_192;
    }
    const __VLS_201 = {}.VBtn;
    /** @type {[typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ]} */ ;
    // @ts-ignore
    const __VLS_202 = __VLS_asFunctionalComponent(__VLS_201, new __VLS_201({
        ...{ 'onClick': {} },
        value: "export",
        ...{ class: "bottom-nav-btn" },
    }));
    const __VLS_203 = __VLS_202({
        ...{ 'onClick': {} },
        value: "export",
        ...{ class: "bottom-nav-btn" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_202));
    let __VLS_205;
    let __VLS_206;
    let __VLS_207;
    const __VLS_208 = {
        onClick: (...[$event]) => {
            if (!!(__VLS_ctx.isImmersiveMode))
                return;
            __VLS_ctx.handleBottomNavAction('export');
        }
    };
    __VLS_204.slots.default;
    const __VLS_209 = {}.VIcon;
    /** @type {[typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, ]} */ ;
    // @ts-ignore
    const __VLS_210 = __VLS_asFunctionalComponent(__VLS_209, new __VLS_209({}));
    const __VLS_211 = __VLS_210({}, ...__VLS_functionalComponentArgsRest(__VLS_210));
    __VLS_212.slots.default;
    var __VLS_212;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "bottom-nav-label" },
    });
    var __VLS_204;
    const __VLS_213 = {}.VBtn;
    /** @type {[typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ]} */ ;
    // @ts-ignore
    const __VLS_214 = __VLS_asFunctionalComponent(__VLS_213, new __VLS_213({
        ...{ 'onClick': {} },
        value: "qrcode",
        ...{ class: "bottom-nav-btn" },
    }));
    const __VLS_215 = __VLS_214({
        ...{ 'onClick': {} },
        value: "qrcode",
        ...{ class: "bottom-nav-btn" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_214));
    let __VLS_217;
    let __VLS_218;
    let __VLS_219;
    const __VLS_220 = {
        onClick: (...[$event]) => {
            if (!!(__VLS_ctx.isImmersiveMode))
                return;
            __VLS_ctx.handleBottomNavAction('qrcode');
        }
    };
    __VLS_216.slots.default;
    const __VLS_221 = {}.VIcon;
    /** @type {[typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, ]} */ ;
    // @ts-ignore
    const __VLS_222 = __VLS_asFunctionalComponent(__VLS_221, new __VLS_221({}));
    const __VLS_223 = __VLS_222({}, ...__VLS_functionalComponentArgsRest(__VLS_222));
    __VLS_224.slots.default;
    var __VLS_224;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "bottom-nav-label" },
    });
    var __VLS_216;
    const __VLS_225 = {}.VBtn;
    /** @type {[typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ]} */ ;
    // @ts-ignore
    const __VLS_226 = __VLS_asFunctionalComponent(__VLS_225, new __VLS_225({
        ...{ 'onClick': {} },
        value: "keywords",
        ...{ class: "bottom-nav-btn" },
    }));
    const __VLS_227 = __VLS_226({
        ...{ 'onClick': {} },
        value: "keywords",
        ...{ class: "bottom-nav-btn" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_226));
    let __VLS_229;
    let __VLS_230;
    let __VLS_231;
    const __VLS_232 = {
        onClick: (...[$event]) => {
            if (!!(__VLS_ctx.isImmersiveMode))
                return;
            __VLS_ctx.handleBottomNavAction('keywords');
        }
    };
    __VLS_228.slots.default;
    const __VLS_233 = {}.VIcon;
    /** @type {[typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, ]} */ ;
    // @ts-ignore
    const __VLS_234 = __VLS_asFunctionalComponent(__VLS_233, new __VLS_233({}));
    const __VLS_235 = __VLS_234({}, ...__VLS_functionalComponentArgsRest(__VLS_234));
    __VLS_236.slots.default;
    var __VLS_236;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "bottom-nav-label" },
    });
    var __VLS_228;
    const __VLS_237 = {}.VBtn;
    /** @type {[typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ]} */ ;
    // @ts-ignore
    const __VLS_238 = __VLS_asFunctionalComponent(__VLS_237, new __VLS_237({
        ...{ 'onClick': {} },
        value: "tharmagar",
        ...{ class: "bottom-nav-btn" },
    }));
    const __VLS_239 = __VLS_238({
        ...{ 'onClick': {} },
        value: "tharmagar",
        ...{ class: "bottom-nav-btn" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_238));
    let __VLS_241;
    let __VLS_242;
    let __VLS_243;
    const __VLS_244 = {
        onClick: (...[$event]) => {
            if (!!(__VLS_ctx.isImmersiveMode))
                return;
            __VLS_ctx.handleBottomNavAction('tharmagar');
        }
    };
    __VLS_240.slots.default;
    const __VLS_245 = {}.VIcon;
    /** @type {[typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, ]} */ ;
    // @ts-ignore
    const __VLS_246 = __VLS_asFunctionalComponent(__VLS_245, new __VLS_245({}));
    const __VLS_247 = __VLS_246({}, ...__VLS_functionalComponentArgsRest(__VLS_246));
    __VLS_248.slots.default;
    var __VLS_248;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "bottom-nav-label" },
    });
    var __VLS_240;
    var __VLS_176;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "campaign-content" },
        ...{ class: ({ 'with-bottom-nav': true }) },
    });
    const __VLS_249 = {}.VContainer;
    /** @type {[typeof __VLS_components.VContainer, typeof __VLS_components.vContainer, typeof __VLS_components.VContainer, typeof __VLS_components.vContainer, ]} */ ;
    // @ts-ignore
    const __VLS_250 = __VLS_asFunctionalComponent(__VLS_249, new __VLS_249({
        fluid: true,
    }));
    const __VLS_251 = __VLS_250({
        fluid: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_250));
    __VLS_252.slots.default;
    if (__VLS_ctx.campaign) {
        const __VLS_253 = {}.VRow;
        /** @type {[typeof __VLS_components.VRow, typeof __VLS_components.vRow, typeof __VLS_components.VRow, typeof __VLS_components.vRow, ]} */ ;
        // @ts-ignore
        const __VLS_254 = __VLS_asFunctionalComponent(__VLS_253, new __VLS_253({
            justify: "center",
            noGutters: true,
        }));
        const __VLS_255 = __VLS_254({
            justify: "center",
            noGutters: true,
        }, ...__VLS_functionalComponentArgsRest(__VLS_254));
        __VLS_256.slots.default;
        const __VLS_257 = {}.VCol;
        /** @type {[typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ]} */ ;
        // @ts-ignore
        const __VLS_258 = __VLS_asFunctionalComponent(__VLS_257, new __VLS_257({
            cols: "12",
            lg: "9",
            xl: "8",
        }));
        const __VLS_259 = __VLS_258({
            cols: "12",
            lg: "9",
            xl: "8",
        }, ...__VLS_functionalComponentArgsRest(__VLS_258));
        __VLS_260.slots.default;
        if (['underkeep', 'underkeep2'].includes(__VLS_ctx.campaign.campaign)) {
            const __VLS_261 = {}.VCard;
            /** @type {[typeof __VLS_components.VCard, typeof __VLS_components.vCard, typeof __VLS_components.VCard, typeof __VLS_components.vCard, ]} */ ;
            // @ts-ignore
            const __VLS_262 = __VLS_asFunctionalComponent(__VLS_261, new __VLS_261({
                ...{ class: "mb-4" },
                variant: "outlined",
                ...{ style: {} },
            }));
            const __VLS_263 = __VLS_262({
                ...{ class: "mb-4" },
                variant: "outlined",
                ...{ style: {} },
            }, ...__VLS_functionalComponentArgsRest(__VLS_262));
            __VLS_264.slots.default;
            const __VLS_265 = {}.VCardText;
            /** @type {[typeof __VLS_components.VCardText, typeof __VLS_components.vCardText, typeof __VLS_components.VCardText, typeof __VLS_components.vCardText, ]} */ ;
            // @ts-ignore
            const __VLS_266 = __VLS_asFunctionalComponent(__VLS_265, new __VLS_265({
                ...{ class: "pa-4" },
            }));
            const __VLS_267 = __VLS_266({
                ...{ class: "pa-4" },
            }, ...__VLS_functionalComponentArgsRest(__VLS_266));
            __VLS_268.slots.default;
            const __VLS_269 = {}.VRow;
            /** @type {[typeof __VLS_components.VRow, typeof __VLS_components.vRow, typeof __VLS_components.VRow, typeof __VLS_components.vRow, ]} */ ;
            // @ts-ignore
            const __VLS_270 = __VLS_asFunctionalComponent(__VLS_269, new __VLS_269({
                align: "center",
                noGutters: true,
            }));
            const __VLS_271 = __VLS_270({
                align: "center",
                noGutters: true,
            }, ...__VLS_functionalComponentArgsRest(__VLS_270));
            __VLS_272.slots.default;
            const __VLS_273 = {}.VCol;
            /** @type {[typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ]} */ ;
            // @ts-ignore
            const __VLS_274 = __VLS_asFunctionalComponent(__VLS_273, new __VLS_273({
                cols: "12",
                sm: "8",
                ...{ class: "pr-sm-4" },
            }));
            const __VLS_275 = __VLS_274({
                cols: "12",
                sm: "8",
                ...{ class: "pr-sm-4" },
            }, ...__VLS_functionalComponentArgsRest(__VLS_274));
            __VLS_276.slots.default;
            /** @type {[typeof CampaignName, ]} */ ;
            // @ts-ignore
            const __VLS_277 = __VLS_asFunctionalComponent(CampaignName, new CampaignName({
                campaignId: (__VLS_ctx.campaignId),
                isAdmin: (__VLS_ctx.isAdminUser),
                ...{ class: "mb-0 shepherd-campaign-name" },
            }));
            const __VLS_278 = __VLS_277({
                campaignId: (__VLS_ctx.campaignId),
                isAdmin: (__VLS_ctx.isAdminUser),
                ...{ class: "mb-0 shepherd-campaign-name" },
            }, ...__VLS_functionalComponentArgsRest(__VLS_277));
            var __VLS_276;
            const __VLS_280 = {}.VCol;
            /** @type {[typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ]} */ ;
            // @ts-ignore
            const __VLS_281 = __VLS_asFunctionalComponent(__VLS_280, new __VLS_280({
                cols: "12",
                sm: "4",
                ...{ class: "d-flex align-center justify-start justify-sm-end mt-3 mt-sm-0" },
            }));
            const __VLS_282 = __VLS_281({
                cols: "12",
                sm: "4",
                ...{ class: "d-flex align-center justify-start justify-sm-end mt-3 mt-sm-0" },
            }, ...__VLS_functionalComponentArgsRest(__VLS_281));
            __VLS_283.slots.default;
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: "d-flex align-center bg-grey-darken-4 px-3 py-2 rounded-lg border-thin" },
            });
            __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
                ...{ class: "text-caption font-weight-bold text-grey-lighten-1 mr-1" },
            });
            const __VLS_284 = {}.VTooltip;
            /** @type {[typeof __VLS_components.VTooltip, typeof __VLS_components.vTooltip, typeof __VLS_components.VTooltip, typeof __VLS_components.vTooltip, ]} */ ;
            // @ts-ignore
            const __VLS_285 = __VLS_asFunctionalComponent(__VLS_284, new __VLS_284({
                location: "top",
            }));
            const __VLS_286 = __VLS_285({
                location: "top",
            }, ...__VLS_functionalComponentArgsRest(__VLS_285));
            __VLS_287.slots.default;
            {
                const { activator: __VLS_thisSlot } = __VLS_287.slots;
                const [{ props }] = __VLS_getSlotParams(__VLS_thisSlot);
                const __VLS_288 = {}.VIcon;
                /** @type {[typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, ]} */ ;
                // @ts-ignore
                const __VLS_289 = __VLS_asFunctionalComponent(__VLS_288, new __VLS_288({
                    ...(props),
                    size: "small",
                    color: "grey-lighten-1",
                    ...{ class: "cursor-pointer mr-2" },
                }));
                const __VLS_290 = __VLS_289({
                    ...(props),
                    size: "small",
                    color: "grey-lighten-1",
                    ...{ class: "cursor-pointer mr-2" },
                }, ...__VLS_functionalComponentArgsRest(__VLS_289));
                __VLS_291.slots.default;
                var __VLS_291;
            }
            __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
            var __VLS_287;
            if (__VLS_ctx.partyCode) {
                const __VLS_292 = {}.VChip;
                /** @type {[typeof __VLS_components.VChip, typeof __VLS_components.vChip, typeof __VLS_components.VChip, typeof __VLS_components.vChip, ]} */ ;
                // @ts-ignore
                const __VLS_293 = __VLS_asFunctionalComponent(__VLS_292, new __VLS_292({
                    label: true,
                    size: "small",
                    color: "amber-darken-2",
                    variant: "flat",
                    ...{ class: "font-weight-bold" },
                }));
                const __VLS_294 = __VLS_293({
                    label: true,
                    size: "small",
                    color: "amber-darken-2",
                    variant: "flat",
                    ...{ class: "font-weight-bold" },
                }, ...__VLS_functionalComponentArgsRest(__VLS_293));
                __VLS_295.slots.default;
                (__VLS_ctx.partyCode);
                var __VLS_295;
            }
            else {
                const __VLS_296 = {}.VChip;
                /** @type {[typeof __VLS_components.VChip, typeof __VLS_components.vChip, typeof __VLS_components.VChip, typeof __VLS_components.vChip, ]} */ ;
                // @ts-ignore
                const __VLS_297 = __VLS_asFunctionalComponent(__VLS_296, new __VLS_296({
                    label: true,
                    size: "small",
                    color: "grey",
                    variant: "flat",
                    ...{ class: "font-weight-bold" },
                }));
                const __VLS_298 = __VLS_297({
                    label: true,
                    size: "small",
                    color: "grey",
                    variant: "flat",
                    ...{ class: "font-weight-bold" },
                }, ...__VLS_functionalComponentArgsRest(__VLS_297));
                __VLS_299.slots.default;
                var __VLS_299;
            }
            const __VLS_300 = {}.VBtn;
            /** @type {[typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ]} */ ;
            // @ts-ignore
            const __VLS_301 = __VLS_asFunctionalComponent(__VLS_300, new __VLS_300({
                ...{ 'onClick': {} },
                icon: true,
                variant: "text",
                density: "comfortable",
                color: "grey-lighten-1",
                ...{ class: "ml-2" },
            }));
            const __VLS_302 = __VLS_301({
                ...{ 'onClick': {} },
                icon: true,
                variant: "text",
                density: "comfortable",
                color: "grey-lighten-1",
                ...{ class: "ml-2" },
            }, ...__VLS_functionalComponentArgsRest(__VLS_301));
            let __VLS_304;
            let __VLS_305;
            let __VLS_306;
            const __VLS_307 = {
                onClick: (__VLS_ctx.openPlayerListDialog)
            };
            __VLS_303.slots.default;
            const __VLS_308 = {}.VIcon;
            /** @type {[typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, ]} */ ;
            // @ts-ignore
            const __VLS_309 = __VLS_asFunctionalComponent(__VLS_308, new __VLS_308({}));
            const __VLS_310 = __VLS_309({}, ...__VLS_functionalComponentArgsRest(__VLS_309));
            __VLS_311.slots.default;
            var __VLS_311;
            const __VLS_312 = {}.VTooltip;
            /** @type {[typeof __VLS_components.VTooltip, typeof __VLS_components.vTooltip, typeof __VLS_components.VTooltip, typeof __VLS_components.vTooltip, ]} */ ;
            // @ts-ignore
            const __VLS_313 = __VLS_asFunctionalComponent(__VLS_312, new __VLS_312({
                activator: "parent",
                location: "top",
            }));
            const __VLS_314 = __VLS_313({
                activator: "parent",
                location: "top",
            }, ...__VLS_functionalComponentArgsRest(__VLS_313));
            __VLS_315.slots.default;
            var __VLS_315;
            var __VLS_303;
            var __VLS_283;
            var __VLS_272;
            var __VLS_268;
            var __VLS_264;
            const __VLS_316 = {}.VTabs;
            /** @type {[typeof __VLS_components.VTabs, typeof __VLS_components.vTabs, typeof __VLS_components.VTabs, typeof __VLS_components.vTabs, ]} */ ;
            // @ts-ignore
            const __VLS_317 = __VLS_asFunctionalComponent(__VLS_316, new __VLS_316({
                modelValue: (__VLS_ctx.currentTab),
                density: "compact",
                grow: true,
                bgColor: "surface",
                ...{ class: "mb-3 rounded shepherd-campaign-tabs" },
                sliderColor: "white",
            }));
            const __VLS_318 = __VLS_317({
                modelValue: (__VLS_ctx.currentTab),
                density: "compact",
                grow: true,
                bgColor: "surface",
                ...{ class: "mb-3 rounded shepherd-campaign-tabs" },
                sliderColor: "white",
            }, ...__VLS_functionalComponentArgsRest(__VLS_317));
            __VLS_319.slots.default;
            const __VLS_320 = {}.VTab;
            /** @type {[typeof __VLS_components.VTab, typeof __VLS_components.vTab, typeof __VLS_components.VTab, typeof __VLS_components.vTab, ]} */ ;
            // @ts-ignore
            const __VLS_321 = __VLS_asFunctionalComponent(__VLS_320, new __VLS_320({
                value: "normal",
                ...{ class: "text-caption" },
            }));
            const __VLS_322 = __VLS_321({
                value: "normal",
                ...{ class: "text-caption" },
            }, ...__VLS_functionalComponentArgsRest(__VLS_321));
            __VLS_323.slots.default;
            const __VLS_324 = {}.VIcon;
            /** @type {[typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, ]} */ ;
            // @ts-ignore
            const __VLS_325 = __VLS_asFunctionalComponent(__VLS_324, new __VLS_324({
                size: "small",
                ...{ class: "mr-1" },
            }));
            const __VLS_326 = __VLS_325({
                size: "small",
                ...{ class: "mr-1" },
            }, ...__VLS_functionalComponentArgsRest(__VLS_325));
            __VLS_327.slots.default;
            var __VLS_327;
            __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
                ...{ class: "d-none d-sm-inline" },
            });
            __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
                ...{ class: "d-sm-none" },
            });
            var __VLS_323;
            const __VLS_328 = {}.VTab;
            /** @type {[typeof __VLS_components.VTab, typeof __VLS_components.vTab, typeof __VLS_components.VTab, typeof __VLS_components.vTab, ]} */ ;
            // @ts-ignore
            const __VLS_329 = __VLS_asFunctionalComponent(__VLS_328, new __VLS_328({
                value: "book",
                ...{ class: "text-caption" },
            }));
            const __VLS_330 = __VLS_329({
                value: "book",
                ...{ class: "text-caption" },
            }, ...__VLS_functionalComponentArgsRest(__VLS_329));
            __VLS_331.slots.default;
            const __VLS_332 = {}.VIcon;
            /** @type {[typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, ]} */ ;
            // @ts-ignore
            const __VLS_333 = __VLS_asFunctionalComponent(__VLS_332, new __VLS_332({
                size: "small",
                ...{ class: "mr-1" },
            }));
            const __VLS_334 = __VLS_333({
                size: "small",
                ...{ class: "mr-1" },
            }, ...__VLS_functionalComponentArgsRest(__VLS_333));
            __VLS_335.slots.default;
            var __VLS_335;
            __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
                ...{ class: "d-none d-sm-inline" },
            });
            __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
                ...{ class: "d-sm-none" },
            });
            var __VLS_331;
            var __VLS_319;
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
            __VLS_asFunctionalDirective(__VLS_directives.vShow)(null, { ...__VLS_directiveBindingRestFields, value: (__VLS_ctx.currentTab === 'normal') }, null, null);
            const __VLS_336 = {}.VRow;
            /** @type {[typeof __VLS_components.VRow, typeof __VLS_components.vRow, typeof __VLS_components.VRow, typeof __VLS_components.vRow, ]} */ ;
            // @ts-ignore
            const __VLS_337 = __VLS_asFunctionalComponent(__VLS_336, new __VLS_336({
                noGutters: true,
                ...{ class: "mt-3 px-2" },
            }));
            const __VLS_338 = __VLS_337({
                noGutters: true,
                ...{ class: "mt-3 px-2" },
            }, ...__VLS_functionalComponentArgsRest(__VLS_337));
            __VLS_339.slots.default;
            const __VLS_340 = {}.VCol;
            /** @type {[typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ]} */ ;
            // @ts-ignore
            const __VLS_341 = __VLS_asFunctionalComponent(__VLS_340, new __VLS_340({
                cols: "12",
                md: "6",
                ...{ class: "pr-md-2" },
            }));
            const __VLS_342 = __VLS_341({
                cols: "12",
                md: "6",
                ...{ class: "pr-md-2" },
            }, ...__VLS_functionalComponentArgsRest(__VLS_341));
            __VLS_343.slots.default;
            const __VLS_344 = {}.VCard;
            /** @type {[typeof __VLS_components.VCard, typeof __VLS_components.vCard, typeof __VLS_components.VCard, typeof __VLS_components.vCard, ]} */ ;
            // @ts-ignore
            const __VLS_345 = __VLS_asFunctionalComponent(__VLS_344, new __VLS_344({
                color: "primary",
                ...{ class: "pa-4 mb-3" },
            }));
            const __VLS_346 = __VLS_345({
                color: "primary",
                ...{ class: "pa-4 mb-3" },
            }, ...__VLS_functionalComponentArgsRest(__VLS_345));
            __VLS_347.slots.default;
            const __VLS_348 = {}.VCardTitle;
            /** @type {[typeof __VLS_components.VCardTitle, typeof __VLS_components.vCardTitle, typeof __VLS_components.VCardTitle, typeof __VLS_components.vCardTitle, ]} */ ;
            // @ts-ignore
            const __VLS_349 = __VLS_asFunctionalComponent(__VLS_348, new __VLS_348({
                ...{ class: "text-h6 pa-0 mb-4" },
            }));
            const __VLS_350 = __VLS_349({
                ...{ class: "text-h6 pa-0 mb-4" },
            }, ...__VLS_functionalComponentArgsRest(__VLS_349));
            __VLS_351.slots.default;
            var __VLS_351;
            /** @type {[typeof SelectDoor, ]} */ ;
            // @ts-ignore
            const __VLS_352 = __VLS_asFunctionalComponent(SelectDoor, new SelectDoor({
                campaignId: (__VLS_ctx.campaignId),
                campaignType: (__VLS_ctx.campaign.campaign),
                ...{ class: "mb-3 shepherd-select-door" },
            }));
            const __VLS_353 = __VLS_352({
                campaignId: (__VLS_ctx.campaignId),
                campaignType: (__VLS_ctx.campaign.campaign),
                ...{ class: "mb-3 shepherd-select-door" },
            }, ...__VLS_functionalComponentArgsRest(__VLS_352));
            if (__VLS_ctx.isSequentialAdventure) {
                /** @type {[typeof CampaignRunes, ]} */ ;
                // @ts-ignore
                const __VLS_355 = __VLS_asFunctionalComponent(CampaignRunes, new CampaignRunes({
                    campaignId: (__VLS_ctx.campaignId),
                    ...{ class: "mb-0 shepherd-runes" },
                }));
                const __VLS_356 = __VLS_355({
                    campaignId: (__VLS_ctx.campaignId),
                    ...{ class: "mb-0 shepherd-runes" },
                }, ...__VLS_functionalComponentArgsRest(__VLS_355));
            }
            var __VLS_347;
            var __VLS_343;
            const __VLS_358 = {}.VCol;
            /** @type {[typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ]} */ ;
            // @ts-ignore
            const __VLS_359 = __VLS_asFunctionalComponent(__VLS_358, new __VLS_358({
                cols: "12",
                md: "6",
                ...{ class: "pl-md-2" },
            }));
            const __VLS_360 = __VLS_359({
                cols: "12",
                md: "6",
                ...{ class: "pl-md-2" },
            }, ...__VLS_functionalComponentArgsRest(__VLS_359));
            __VLS_361.slots.default;
            if (__VLS_ctx.isSequentialAdventure) {
                /** @type {[typeof CampaignRuneCards, ]} */ ;
                // @ts-ignore
                const __VLS_362 = __VLS_asFunctionalComponent(CampaignRuneCards, new CampaignRuneCards({
                    campaignId: (__VLS_ctx.campaignId),
                    campaignType: (__VLS_ctx.campaign.campaign),
                    ...{ class: "mb-3 shepherd-rune-cards" },
                }));
                const __VLS_363 = __VLS_362({
                    campaignId: (__VLS_ctx.campaignId),
                    campaignType: (__VLS_ctx.campaign.campaign),
                    ...{ class: "mb-3 shepherd-rune-cards" },
                }, ...__VLS_functionalComponentArgsRest(__VLS_362));
            }
            var __VLS_361;
            var __VLS_339;
            const __VLS_365 = {}.VRow;
            /** @type {[typeof __VLS_components.VRow, typeof __VLS_components.vRow, typeof __VLS_components.VRow, typeof __VLS_components.vRow, ]} */ ;
            // @ts-ignore
            const __VLS_366 = __VLS_asFunctionalComponent(__VLS_365, new __VLS_365({
                ...{ class: "my-3 px-2" },
                noGutters: true,
            }));
            const __VLS_367 = __VLS_366({
                ...{ class: "my-3 px-2" },
                noGutters: true,
            }, ...__VLS_functionalComponentArgsRest(__VLS_366));
            __VLS_368.slots.default;
            const __VLS_369 = {}.VCol;
            /** @type {[typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ]} */ ;
            // @ts-ignore
            const __VLS_370 = __VLS_asFunctionalComponent(__VLS_369, new __VLS_369({
                cols: "12",
            }));
            const __VLS_371 = __VLS_370({
                cols: "12",
            }, ...__VLS_functionalComponentArgsRest(__VLS_370));
            __VLS_372.slots.default;
            const __VLS_373 = {}.VCard;
            /** @type {[typeof __VLS_components.VCard, typeof __VLS_components.vCard, typeof __VLS_components.VCard, typeof __VLS_components.vCard, ]} */ ;
            // @ts-ignore
            const __VLS_374 = __VLS_asFunctionalComponent(__VLS_373, new __VLS_373({
                ...{ class: "pa-2 shepherd-hero-actions" },
                color: "primary",
            }));
            const __VLS_375 = __VLS_374({
                ...{ class: "pa-2 shepherd-hero-actions" },
                color: "primary",
            }, ...__VLS_functionalComponentArgsRest(__VLS_374));
            __VLS_376.slots.default;
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: "d-flex justify-center flex-wrap gap-2" },
            });
            /** @type {[typeof CampaignLogAddHero, ]} */ ;
            // @ts-ignore
            const __VLS_377 = __VLS_asFunctionalComponent(CampaignLogAddHero, new CampaignLogAddHero({
                campaignId: (__VLS_ctx.campaignId),
                ...{ class: "mx-1 my-1" },
            }));
            const __VLS_378 = __VLS_377({
                campaignId: (__VLS_ctx.campaignId),
                ...{ class: "mx-1 my-1" },
            }, ...__VLS_functionalComponentArgsRest(__VLS_377));
            /** @type {[typeof CampaignLogImportHero, ]} */ ;
            // @ts-ignore
            const __VLS_380 = __VLS_asFunctionalComponent(CampaignLogImportHero, new CampaignLogImportHero({
                campaignId: (__VLS_ctx.campaignId),
                ...{ class: "mx-1 my-1" },
            }));
            const __VLS_381 = __VLS_380({
                campaignId: (__VLS_ctx.campaignId),
                ...{ class: "mx-1 my-1" },
            }, ...__VLS_functionalComponentArgsRest(__VLS_380));
            /** @type {[typeof CampaignLogRemoveHero, ]} */ ;
            // @ts-ignore
            const __VLS_383 = __VLS_asFunctionalComponent(CampaignLogRemoveHero, new CampaignLogRemoveHero({
                campaignId: (__VLS_ctx.campaignId),
                ...{ class: "mx-1 my-1" },
            }));
            const __VLS_384 = __VLS_383({
                campaignId: (__VLS_ctx.campaignId),
                ...{ class: "mx-1 my-1" },
            }, ...__VLS_functionalComponentArgsRest(__VLS_383));
            var __VLS_376;
            var __VLS_372;
            var __VLS_368;
            const __VLS_386 = {}.VRow;
            /** @type {[typeof __VLS_components.VRow, typeof __VLS_components.vRow, typeof __VLS_components.VRow, typeof __VLS_components.vRow, ]} */ ;
            // @ts-ignore
            const __VLS_387 = __VLS_asFunctionalComponent(__VLS_386, new __VLS_386({
                ...{ class: "px-2 mt-2" },
                noGutters: true,
            }));
            const __VLS_388 = __VLS_387({
                ...{ class: "px-2 mt-2" },
                noGutters: true,
            }, ...__VLS_functionalComponentArgsRest(__VLS_387));
            __VLS_389.slots.default;
            const __VLS_390 = {}.VCol;
            /** @type {[typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ]} */ ;
            // @ts-ignore
            const __VLS_391 = __VLS_asFunctionalComponent(__VLS_390, new __VLS_390({
                cols: "12",
                ...{ class: "shepherd-heroes-list" },
            }));
            const __VLS_392 = __VLS_391({
                cols: "12",
                ...{ class: "shepherd-heroes-list" },
            }, ...__VLS_functionalComponentArgsRest(__VLS_391));
            __VLS_393.slots.default;
            if (__VLS_ctx.heroStore.findAllInCampaign(__VLS_ctx.campaignId).length ===
                0) {
                __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                    ...{ class: "text-center pa-4 text-white" },
                });
            }
            else {
                for (const [hero] of __VLS_getVForSourceType((__VLS_ctx.heroStore.findAllInCampaign(__VLS_ctx.campaignId)))) {
                    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                        key: (hero.heroId),
                        ...{ class: "mb-4" },
                    });
                    /** @type {[typeof CampaignLog, ]} */ ;
                    // @ts-ignore
                    const __VLS_394 = __VLS_asFunctionalComponent(CampaignLog, new CampaignLog({
                        campaignId: (__VLS_ctx.campaignId),
                        heroId: (hero.heroId),
                        isSequentialAdventure: (__VLS_ctx.isSequentialAdventure),
                        ...{ class: (`shepherd-hero-${hero.heroId}`) },
                    }));
                    const __VLS_395 = __VLS_394({
                        campaignId: (__VLS_ctx.campaignId),
                        heroId: (hero.heroId),
                        isSequentialAdventure: (__VLS_ctx.isSequentialAdventure),
                        ...{ class: (`shepherd-hero-${hero.heroId}`) },
                    }, ...__VLS_functionalComponentArgsRest(__VLS_394));
                }
            }
            var __VLS_393;
            var __VLS_389;
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: "d-flex justify-center mt-6 mb-4" },
            });
            const __VLS_397 = {}.VBtn;
            /** @type {[typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ]} */ ;
            // @ts-ignore
            const __VLS_398 = __VLS_asFunctionalComponent(__VLS_397, new __VLS_397({
                ...{ 'onClick': {} },
                color: "error",
                variant: "outlined",
                rounded: "pill",
                size: "small",
                prependIcon: "mdi-delete-outline",
                ...{ class: "px-4" },
            }));
            const __VLS_399 = __VLS_398({
                ...{ 'onClick': {} },
                color: "error",
                variant: "outlined",
                rounded: "pill",
                size: "small",
                prependIcon: "mdi-delete-outline",
                ...{ class: "px-4" },
            }, ...__VLS_functionalComponentArgsRest(__VLS_398));
            let __VLS_401;
            let __VLS_402;
            let __VLS_403;
            const __VLS_404 = {
                onClick: (...[$event]) => {
                    if (!!(__VLS_ctx.isImmersiveMode))
                        return;
                    if (!(__VLS_ctx.campaign))
                        return;
                    if (!(['underkeep', 'underkeep2'].includes(__VLS_ctx.campaign.campaign)))
                        return;
                    __VLS_ctx.executeAction('remove');
                }
            };
            __VLS_400.slots.default;
            var __VLS_400;
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
            __VLS_asFunctionalDirective(__VLS_directives.vShow)(null, { ...__VLS_directiveBindingRestFields, value: (__VLS_ctx.currentTab === 'book') }, null, null);
            /** @type {[typeof CampaignBook, ]} */ ;
            // @ts-ignore
            const __VLS_405 = __VLS_asFunctionalComponent(CampaignBook, new CampaignBook({
                ref: "campaignBookRef",
                campaignWing: (__VLS_ctx.campaign?.wing || ''),
                campaignType: (__VLS_ctx.campaign?.campaign || ''),
            }));
            const __VLS_406 = __VLS_405({
                ref: "campaignBookRef",
                campaignWing: (__VLS_ctx.campaign?.wing || ''),
                campaignType: (__VLS_ctx.campaign?.campaign || ''),
            }, ...__VLS_functionalComponentArgsRest(__VLS_405));
            /** @type {typeof __VLS_ctx.campaignBookRef} */ ;
            var __VLS_408 = {};
            var __VLS_407;
        }
        else {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
            const __VLS_410 = {}.VRow;
            /** @type {[typeof __VLS_components.VRow, typeof __VLS_components.vRow, typeof __VLS_components.VRow, typeof __VLS_components.vRow, ]} */ ;
            // @ts-ignore
            const __VLS_411 = __VLS_asFunctionalComponent(__VLS_410, new __VLS_410({
                noGutters: true,
                align: "center",
                ...{ class: "mb-3" },
            }));
            const __VLS_412 = __VLS_411({
                noGutters: true,
                align: "center",
                ...{ class: "mb-3" },
            }, ...__VLS_functionalComponentArgsRest(__VLS_411));
            __VLS_413.slots.default;
            const __VLS_414 = {}.VCol;
            /** @type {[typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ]} */ ;
            // @ts-ignore
            const __VLS_415 = __VLS_asFunctionalComponent(__VLS_414, new __VLS_414({
                cols: "12",
                sm: "8",
            }));
            const __VLS_416 = __VLS_415({
                cols: "12",
                sm: "8",
            }, ...__VLS_functionalComponentArgsRest(__VLS_415));
            __VLS_417.slots.default;
            /** @type {[typeof CampaignName, ]} */ ;
            // @ts-ignore
            const __VLS_418 = __VLS_asFunctionalComponent(CampaignName, new CampaignName({
                campaignId: (__VLS_ctx.campaignId),
                isAdmin: (__VLS_ctx.isAdminUser),
            }));
            const __VLS_419 = __VLS_418({
                campaignId: (__VLS_ctx.campaignId),
                isAdmin: (__VLS_ctx.isAdminUser),
            }, ...__VLS_functionalComponentArgsRest(__VLS_418));
            var __VLS_417;
            const __VLS_421 = {}.VCol;
            /** @type {[typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ]} */ ;
            // @ts-ignore
            const __VLS_422 = __VLS_asFunctionalComponent(__VLS_421, new __VLS_421({
                cols: "12",
                sm: "4",
            }));
            const __VLS_423 = __VLS_422({
                cols: "12",
                sm: "4",
            }, ...__VLS_functionalComponentArgsRest(__VLS_422));
            __VLS_424.slots.default;
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: "d-flex justify-start justify-sm-end align-center" },
            });
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: "mx-1 my-1 d-flex align-center" },
            });
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: "mr-3" },
            });
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: "d-flex align-center" },
            });
            __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
                ...{ class: "text-caption font-weight-bold mr-1" },
            });
            const __VLS_425 = {}.VTooltip;
            /** @type {[typeof __VLS_components.VTooltip, typeof __VLS_components.vTooltip, typeof __VLS_components.VTooltip, typeof __VLS_components.vTooltip, ]} */ ;
            // @ts-ignore
            const __VLS_426 = __VLS_asFunctionalComponent(__VLS_425, new __VLS_425({
                location: "top",
            }));
            const __VLS_427 = __VLS_426({
                location: "top",
            }, ...__VLS_functionalComponentArgsRest(__VLS_426));
            __VLS_428.slots.default;
            {
                const { activator: __VLS_thisSlot } = __VLS_428.slots;
                const [{ props }] = __VLS_getSlotParams(__VLS_thisSlot);
                const __VLS_429 = {}.VIcon;
                /** @type {[typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, ]} */ ;
                // @ts-ignore
                const __VLS_430 = __VLS_asFunctionalComponent(__VLS_429, new __VLS_429({
                    ...(props),
                    size: "small",
                    color: "info",
                    ...{ class: "cursor-pointer" },
                }));
                const __VLS_431 = __VLS_430({
                    ...(props),
                    size: "small",
                    color: "info",
                    ...{ class: "cursor-pointer" },
                }, ...__VLS_functionalComponentArgsRest(__VLS_430));
                __VLS_432.slots.default;
                var __VLS_432;
            }
            __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
            var __VLS_428;
            if (__VLS_ctx.partyCode) {
                const __VLS_433 = {}.VChip;
                /** @type {[typeof __VLS_components.VChip, typeof __VLS_components.vChip, typeof __VLS_components.VChip, typeof __VLS_components.vChip, ]} */ ;
                // @ts-ignore
                const __VLS_434 = __VLS_asFunctionalComponent(__VLS_433, new __VLS_433({
                    label: true,
                    size: "large",
                }));
                const __VLS_435 = __VLS_434({
                    label: true,
                    size: "large",
                }, ...__VLS_functionalComponentArgsRest(__VLS_434));
                __VLS_436.slots.default;
                (__VLS_ctx.partyCode);
                var __VLS_436;
            }
            else {
                const __VLS_437 = {}.VChip;
                /** @type {[typeof __VLS_components.VChip, typeof __VLS_components.vChip, typeof __VLS_components.VChip, typeof __VLS_components.vChip, ]} */ ;
                // @ts-ignore
                const __VLS_438 = __VLS_asFunctionalComponent(__VLS_437, new __VLS_437({
                    label: true,
                    size: "large",
                }));
                const __VLS_439 = __VLS_438({
                    label: true,
                    size: "large",
                }, ...__VLS_functionalComponentArgsRest(__VLS_438));
                __VLS_440.slots.default;
                var __VLS_440;
            }
            const __VLS_441 = {}.VBtn;
            /** @type {[typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ]} */ ;
            // @ts-ignore
            const __VLS_442 = __VLS_asFunctionalComponent(__VLS_441, new __VLS_441({
                ...{ 'onClick': {} },
                icon: true,
                variant: "text",
                density: "comfortable",
                color: "grey-lighten-1",
                ...{ class: "ml-2" },
            }));
            const __VLS_443 = __VLS_442({
                ...{ 'onClick': {} },
                icon: true,
                variant: "text",
                density: "comfortable",
                color: "grey-lighten-1",
                ...{ class: "ml-2" },
            }, ...__VLS_functionalComponentArgsRest(__VLS_442));
            let __VLS_445;
            let __VLS_446;
            let __VLS_447;
            const __VLS_448 = {
                onClick: (__VLS_ctx.openPlayerListDialog)
            };
            __VLS_444.slots.default;
            const __VLS_449 = {}.VIcon;
            /** @type {[typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, ]} */ ;
            // @ts-ignore
            const __VLS_450 = __VLS_asFunctionalComponent(__VLS_449, new __VLS_449({}));
            const __VLS_451 = __VLS_450({}, ...__VLS_functionalComponentArgsRest(__VLS_450));
            __VLS_452.slots.default;
            var __VLS_452;
            const __VLS_453 = {}.VTooltip;
            /** @type {[typeof __VLS_components.VTooltip, typeof __VLS_components.vTooltip, typeof __VLS_components.VTooltip, typeof __VLS_components.vTooltip, ]} */ ;
            // @ts-ignore
            const __VLS_454 = __VLS_asFunctionalComponent(__VLS_453, new __VLS_453({
                activator: "parent",
                location: "top",
            }));
            const __VLS_455 = __VLS_454({
                activator: "parent",
                location: "top",
            }, ...__VLS_functionalComponentArgsRest(__VLS_454));
            __VLS_456.slots.default;
            var __VLS_456;
            var __VLS_444;
            var __VLS_424;
            var __VLS_413;
            if (__VLS_ctx.campaign.campaign == 'awakenings' ||
                __VLS_ctx.campaign.campaign == 'apocalypse') {
                const __VLS_457 = {}.VRow;
                /** @type {[typeof __VLS_components.VRow, typeof __VLS_components.vRow, typeof __VLS_components.VRow, typeof __VLS_components.vRow, ]} */ ;
                // @ts-ignore
                const __VLS_458 = __VLS_asFunctionalComponent(__VLS_457, new __VLS_457({
                    noGutters: true,
                    ...{ class: "d-flex justify-center mb-3" },
                }));
                const __VLS_459 = __VLS_458({
                    noGutters: true,
                    ...{ class: "d-flex justify-center mb-3" },
                }, ...__VLS_functionalComponentArgsRest(__VLS_458));
                __VLS_460.slots.default;
                const __VLS_461 = {}.VCol;
                /** @type {[typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ]} */ ;
                // @ts-ignore
                const __VLS_462 = __VLS_asFunctionalComponent(__VLS_461, new __VLS_461({
                    cols: "12",
                    ...{ class: "px-2" },
                }));
                const __VLS_463 = __VLS_462({
                    cols: "12",
                    ...{ class: "px-2" },
                }, ...__VLS_functionalComponentArgsRest(__VLS_462));
                __VLS_464.slots.default;
                /** @type {[typeof StoryRecord, ]} */ ;
                // @ts-ignore
                const __VLS_465 = __VLS_asFunctionalComponent(StoryRecord, new StoryRecord({
                    campaignId: (__VLS_ctx.campaignId),
                }));
                const __VLS_466 = __VLS_465({
                    campaignId: (__VLS_ctx.campaignId),
                }, ...__VLS_functionalComponentArgsRest(__VLS_465));
                var __VLS_464;
                var __VLS_460;
            }
            if (__VLS_ctx.campaign.campaign == 'apocalypse') {
                const __VLS_468 = {}.VRow;
                /** @type {[typeof __VLS_components.VRow, typeof __VLS_components.vRow, typeof __VLS_components.VRow, typeof __VLS_components.vRow, ]} */ ;
                // @ts-ignore
                const __VLS_469 = __VLS_asFunctionalComponent(__VLS_468, new __VLS_468({
                    noGutters: true,
                    ...{ class: "d-flex justify-center mb-3" },
                }));
                const __VLS_470 = __VLS_469({
                    noGutters: true,
                    ...{ class: "d-flex justify-center mb-3" },
                }, ...__VLS_functionalComponentArgsRest(__VLS_469));
                __VLS_471.slots.default;
                const __VLS_472 = {}.VCol;
                /** @type {[typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ]} */ ;
                // @ts-ignore
                const __VLS_473 = __VLS_asFunctionalComponent(__VLS_472, new __VLS_472({
                    cols: "12",
                    ...{ class: "px-2" },
                }));
                const __VLS_474 = __VLS_473({
                    cols: "12",
                    ...{ class: "px-2" },
                }, ...__VLS_functionalComponentArgsRest(__VLS_473));
                __VLS_475.slots.default;
                const __VLS_476 = {}.VSheet;
                /** @type {[typeof __VLS_components.VSheet, typeof __VLS_components.vSheet, typeof __VLS_components.VSheet, typeof __VLS_components.vSheet, ]} */ ;
                // @ts-ignore
                const __VLS_477 = __VLS_asFunctionalComponent(__VLS_476, new __VLS_476({
                    rounded: true,
                    border: "md",
                    ...{ class: "pa-6 text-white bg-surface" },
                }));
                const __VLS_478 = __VLS_477({
                    rounded: true,
                    border: "md",
                    ...{ class: "pa-6 text-white bg-surface" },
                }, ...__VLS_functionalComponentArgsRest(__VLS_477));
                __VLS_479.slots.default;
                /** @type {[typeof StoryRecordLegacyTrail, ]} */ ;
                // @ts-ignore
                const __VLS_480 = __VLS_asFunctionalComponent(StoryRecordLegacyTrail, new StoryRecordLegacyTrail({
                    campaignId: (__VLS_ctx.campaignId),
                }));
                const __VLS_481 = __VLS_480({
                    campaignId: (__VLS_ctx.campaignId),
                }, ...__VLS_functionalComponentArgsRest(__VLS_480));
                /** @type {[typeof StoryRecordBackgroundAndTrait, ]} */ ;
                // @ts-ignore
                const __VLS_483 = __VLS_asFunctionalComponent(StoryRecordBackgroundAndTrait, new StoryRecordBackgroundAndTrait({
                    campaignId: (__VLS_ctx.campaignId),
                }));
                const __VLS_484 = __VLS_483({
                    campaignId: (__VLS_ctx.campaignId),
                }, ...__VLS_functionalComponentArgsRest(__VLS_483));
                var __VLS_479;
                var __VLS_475;
                var __VLS_471;
            }
            const __VLS_486 = {}.VRow;
            /** @type {[typeof __VLS_components.VRow, typeof __VLS_components.vRow, typeof __VLS_components.VRow, typeof __VLS_components.vRow, ]} */ ;
            // @ts-ignore
            const __VLS_487 = __VLS_asFunctionalComponent(__VLS_486, new __VLS_486({
                ...{ class: "my-3" },
                noGutters: true,
            }));
            const __VLS_488 = __VLS_487({
                ...{ class: "my-3" },
                noGutters: true,
            }, ...__VLS_functionalComponentArgsRest(__VLS_487));
            __VLS_489.slots.default;
            const __VLS_490 = {}.VCol;
            /** @type {[typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ]} */ ;
            // @ts-ignore
            const __VLS_491 = __VLS_asFunctionalComponent(__VLS_490, new __VLS_490({
                cols: "12",
            }));
            const __VLS_492 = __VLS_491({
                cols: "12",
            }, ...__VLS_functionalComponentArgsRest(__VLS_491));
            __VLS_493.slots.default;
            const __VLS_494 = {}.VCard;
            /** @type {[typeof __VLS_components.VCard, typeof __VLS_components.vCard, typeof __VLS_components.VCard, typeof __VLS_components.vCard, ]} */ ;
            // @ts-ignore
            const __VLS_495 = __VLS_asFunctionalComponent(__VLS_494, new __VLS_494({
                ...{ class: "pa-2" },
                color: "primary",
            }));
            const __VLS_496 = __VLS_495({
                ...{ class: "pa-2" },
                color: "primary",
            }, ...__VLS_functionalComponentArgsRest(__VLS_495));
            __VLS_497.slots.default;
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: "d-flex justify-center flex-wrap gap-2" },
            });
            /** @type {[typeof CampaignLogAddHero, ]} */ ;
            // @ts-ignore
            const __VLS_498 = __VLS_asFunctionalComponent(CampaignLogAddHero, new CampaignLogAddHero({
                campaignId: (__VLS_ctx.campaignId),
                ...{ class: "mx-1 my-1" },
            }));
            const __VLS_499 = __VLS_498({
                campaignId: (__VLS_ctx.campaignId),
                ...{ class: "mx-1 my-1" },
            }, ...__VLS_functionalComponentArgsRest(__VLS_498));
            /** @type {[typeof CampaignLogImportHero, ]} */ ;
            // @ts-ignore
            const __VLS_501 = __VLS_asFunctionalComponent(CampaignLogImportHero, new CampaignLogImportHero({
                campaignId: (__VLS_ctx.campaignId),
                ...{ class: "mx-1 my-1" },
            }));
            const __VLS_502 = __VLS_501({
                campaignId: (__VLS_ctx.campaignId),
                ...{ class: "mx-1 my-1" },
            }, ...__VLS_functionalComponentArgsRest(__VLS_501));
            /** @type {[typeof CampaignLogRemoveHero, ]} */ ;
            // @ts-ignore
            const __VLS_504 = __VLS_asFunctionalComponent(CampaignLogRemoveHero, new CampaignLogRemoveHero({
                campaignId: (__VLS_ctx.campaignId),
                ...{ class: "mx-1 my-1" },
            }));
            const __VLS_505 = __VLS_504({
                campaignId: (__VLS_ctx.campaignId),
                ...{ class: "mx-1 my-1" },
            }, ...__VLS_functionalComponentArgsRest(__VLS_504));
            var __VLS_497;
            var __VLS_493;
            var __VLS_489;
            const __VLS_507 = {}.VRow;
            /** @type {[typeof __VLS_components.VRow, typeof __VLS_components.vRow, typeof __VLS_components.VRow, typeof __VLS_components.vRow, ]} */ ;
            // @ts-ignore
            const __VLS_508 = __VLS_asFunctionalComponent(__VLS_507, new __VLS_507({
                noGutters: true,
            }));
            const __VLS_509 = __VLS_508({
                noGutters: true,
            }, ...__VLS_functionalComponentArgsRest(__VLS_508));
            __VLS_510.slots.default;
            const __VLS_511 = {}.VCol;
            /** @type {[typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ]} */ ;
            // @ts-ignore
            const __VLS_512 = __VLS_asFunctionalComponent(__VLS_511, new __VLS_511({
                cols: "12",
            }));
            const __VLS_513 = __VLS_512({
                cols: "12",
            }, ...__VLS_functionalComponentArgsRest(__VLS_512));
            __VLS_514.slots.default;
            const __VLS_515 = {}.VSheet;
            /** @type {[typeof __VLS_components.VSheet, typeof __VLS_components.vSheet, typeof __VLS_components.VSheet, typeof __VLS_components.vSheet, ]} */ ;
            // @ts-ignore
            const __VLS_516 = __VLS_asFunctionalComponent(__VLS_515, new __VLS_515({
                rounded: true,
                border: "md",
                ...{ class: "text-white pa-2 shepherd-heroes-list" },
            }));
            const __VLS_517 = __VLS_516({
                rounded: true,
                border: "md",
                ...{ class: "text-white pa-2 shepherd-heroes-list" },
            }, ...__VLS_functionalComponentArgsRest(__VLS_516));
            __VLS_518.slots.default;
            if (__VLS_ctx.heroStore.findAllInCampaign(__VLS_ctx.campaignId).length === 0) {
                __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                    ...{ class: "text-center pa-4" },
                });
            }
            for (const [hero] of __VLS_getVForSourceType((__VLS_ctx.heroStore.findAllInCampaign(__VLS_ctx.campaignId)))) {
                __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                    key: (hero.heroId),
                    ...{ class: "mb-2" },
                });
                /** @type {[typeof CampaignLog, ]} */ ;
                // @ts-ignore
                const __VLS_519 = __VLS_asFunctionalComponent(CampaignLog, new CampaignLog({
                    campaignId: (__VLS_ctx.campaignId),
                    heroId: (hero.heroId),
                    isSequentialAdventure: (__VLS_ctx.isSequentialAdventure),
                }));
                const __VLS_520 = __VLS_519({
                    campaignId: (__VLS_ctx.campaignId),
                    heroId: (hero.heroId),
                    isSequentialAdventure: (__VLS_ctx.isSequentialAdventure),
                }, ...__VLS_functionalComponentArgsRest(__VLS_519));
            }
            var __VLS_518;
            var __VLS_514;
            var __VLS_510;
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: "d-flex justify-center mt-6 mb-4" },
            });
            const __VLS_522 = {}.VBtn;
            /** @type {[typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ]} */ ;
            // @ts-ignore
            const __VLS_523 = __VLS_asFunctionalComponent(__VLS_522, new __VLS_522({
                ...{ 'onClick': {} },
                color: "error",
                variant: "outlined",
                rounded: "pill",
                size: "small",
                prependIcon: "mdi-delete-outline",
                ...{ class: "px-4" },
            }));
            const __VLS_524 = __VLS_523({
                ...{ 'onClick': {} },
                color: "error",
                variant: "outlined",
                rounded: "pill",
                size: "small",
                prependIcon: "mdi-delete-outline",
                ...{ class: "px-4" },
            }, ...__VLS_functionalComponentArgsRest(__VLS_523));
            let __VLS_526;
            let __VLS_527;
            let __VLS_528;
            const __VLS_529 = {
                onClick: (...[$event]) => {
                    if (!!(__VLS_ctx.isImmersiveMode))
                        return;
                    if (!(__VLS_ctx.campaign))
                        return;
                    if (!!(['underkeep', 'underkeep2'].includes(__VLS_ctx.campaign.campaign)))
                        return;
                    __VLS_ctx.executeAction('remove');
                }
            };
            __VLS_525.slots.default;
            var __VLS_525;
        }
        var __VLS_260;
        var __VLS_256;
    }
    var __VLS_252;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ style: {} },
    });
    /** @type {[typeof CampaignSavePut, ]} */ ;
    // @ts-ignore
    const __VLS_530 = __VLS_asFunctionalComponent(CampaignSavePut, new CampaignSavePut({
        ...{ 'onSaving': {} },
        ...{ 'onSuccess': {} },
        ...{ 'onFail': {} },
        ref: "savePutRef",
        campaignId: (__VLS_ctx.campaignId),
        isAdmin: (true),
    }));
    const __VLS_531 = __VLS_530({
        ...{ 'onSaving': {} },
        ...{ 'onSuccess': {} },
        ...{ 'onFail': {} },
        ref: "savePutRef",
        campaignId: (__VLS_ctx.campaignId),
        isAdmin: (true),
    }, ...__VLS_functionalComponentArgsRest(__VLS_530));
    let __VLS_533;
    let __VLS_534;
    let __VLS_535;
    const __VLS_536 = {
        onSaving: (__VLS_ctx.onSaving)
    };
    const __VLS_537 = {
        onSuccess: (__VLS_ctx.onSaveSuccess)
    };
    const __VLS_538 = {
        onFail: (__VLS_ctx.onSaveFail)
    };
    /** @type {typeof __VLS_ctx.savePutRef} */ ;
    var __VLS_539 = {};
    var __VLS_532;
    /** @type {[typeof CampaignRemove, ]} */ ;
    // @ts-ignore
    const __VLS_541 = __VLS_asFunctionalComponent(CampaignRemove, new CampaignRemove({
        ...{ 'onRemoved': {} },
        ref: "campaignRemoveRef",
        campaignId: (__VLS_ctx.campaignId),
    }));
    const __VLS_542 = __VLS_541({
        ...{ 'onRemoved': {} },
        ref: "campaignRemoveRef",
        campaignId: (__VLS_ctx.campaignId),
    }, ...__VLS_functionalComponentArgsRest(__VLS_541));
    let __VLS_544;
    let __VLS_545;
    let __VLS_546;
    const __VLS_547 = {
        onRemoved: (__VLS_ctx.onCampaignRemoved)
    };
    /** @type {typeof __VLS_ctx.campaignRemoveRef} */ ;
    var __VLS_548 = {};
    var __VLS_543;
    /** @type {[typeof CampaignExport, ]} */ ;
    // @ts-ignore
    const __VLS_550 = __VLS_asFunctionalComponent(CampaignExport, new CampaignExport({
        ref: "campaignExportRef",
        campaignId: (__VLS_ctx.campaignId),
    }));
    const __VLS_551 = __VLS_550({
        ref: "campaignExportRef",
        campaignId: (__VLS_ctx.campaignId),
    }, ...__VLS_functionalComponentArgsRest(__VLS_550));
    /** @type {typeof __VLS_ctx.campaignExportRef} */ ;
    var __VLS_553 = {};
    var __VLS_552;
    /** @type {[typeof ShareCampaignButton, ]} */ ;
    // @ts-ignore
    const __VLS_555 = __VLS_asFunctionalComponent(ShareCampaignButton, new ShareCampaignButton({
        ref: "shareCampaignRef",
        campaignId: (__VLS_ctx.campaignId),
        inviteCode: (__VLS_ctx.partyCode),
    }));
    const __VLS_556 = __VLS_555({
        ref: "shareCampaignRef",
        campaignId: (__VLS_ctx.campaignId),
        inviteCode: (__VLS_ctx.partyCode),
    }, ...__VLS_functionalComponentArgsRest(__VLS_555));
    /** @type {typeof __VLS_ctx.shareCampaignRef} */ ;
    var __VLS_558 = {};
    var __VLS_557;
    const __VLS_560 = {}.VDialog;
    /** @type {[typeof __VLS_components.VDialog, typeof __VLS_components.vDialog, typeof __VLS_components.VDialog, typeof __VLS_components.vDialog, ]} */ ;
    // @ts-ignore
    const __VLS_561 = __VLS_asFunctionalComponent(__VLS_560, new __VLS_560({
        modelValue: (__VLS_ctx.tharmagarDialogVisible),
        fullscreen: true,
        transition: "dialog-bottom-transition",
    }));
    const __VLS_562 = __VLS_561({
        modelValue: (__VLS_ctx.tharmagarDialogVisible),
        fullscreen: true,
        transition: "dialog-bottom-transition",
    }, ...__VLS_functionalComponentArgsRest(__VLS_561));
    __VLS_563.slots.default;
    const __VLS_564 = {}.VCard;
    /** @type {[typeof __VLS_components.VCard, typeof __VLS_components.vCard, typeof __VLS_components.VCard, typeof __VLS_components.vCard, ]} */ ;
    // @ts-ignore
    const __VLS_565 = __VLS_asFunctionalComponent(__VLS_564, new __VLS_564({
        color: "black",
        ...{ class: "position-relative" },
    }));
    const __VLS_566 = __VLS_565({
        color: "black",
        ...{ class: "position-relative" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_565));
    __VLS_567.slots.default;
    const __VLS_568 = {}.VBtn;
    /** @type {[typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ]} */ ;
    // @ts-ignore
    const __VLS_569 = __VLS_asFunctionalComponent(__VLS_568, new __VLS_568({
        ...{ 'onClick': {} },
        icon: "mdi-close",
        variant: "flat",
        color: "rgba(255,255,255,0.1)",
        ...{ class: "text-white" },
        ...{ style: {} },
    }));
    const __VLS_570 = __VLS_569({
        ...{ 'onClick': {} },
        icon: "mdi-close",
        variant: "flat",
        color: "rgba(255,255,255,0.1)",
        ...{ class: "text-white" },
        ...{ style: {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_569));
    let __VLS_572;
    let __VLS_573;
    let __VLS_574;
    const __VLS_575 = {
        onClick: (...[$event]) => {
            if (!!(__VLS_ctx.isImmersiveMode))
                return;
            __VLS_ctx.tharmagarDialogVisible = false;
        }
    };
    var __VLS_571;
    /** @type {[typeof TharmagarChat, ]} */ ;
    // @ts-ignore
    const __VLS_576 = __VLS_asFunctionalComponent(TharmagarChat, new TharmagarChat({}));
    const __VLS_577 = __VLS_576({}, ...__VLS_functionalComponentArgsRest(__VLS_576));
    var __VLS_567;
    var __VLS_563;
    const __VLS_579 = {}.VDialog;
    /** @type {[typeof __VLS_components.VDialog, typeof __VLS_components.vDialog, typeof __VLS_components.VDialog, typeof __VLS_components.vDialog, ]} */ ;
    // @ts-ignore
    const __VLS_580 = __VLS_asFunctionalComponent(__VLS_579, new __VLS_579({
        modelValue: (__VLS_ctx.newBadgeDialog.visible),
        maxWidth: "500",
        persistent: true,
        transition: "dialog-bottom-transition",
    }));
    const __VLS_581 = __VLS_580({
        modelValue: (__VLS_ctx.newBadgeDialog.visible),
        maxWidth: "500",
        persistent: true,
        transition: "dialog-bottom-transition",
    }, ...__VLS_functionalComponentArgsRest(__VLS_580));
    __VLS_582.slots.default;
    const __VLS_583 = {}.VCard;
    /** @type {[typeof __VLS_components.VCard, typeof __VLS_components.vCard, typeof __VLS_components.VCard, typeof __VLS_components.vCard, ]} */ ;
    // @ts-ignore
    const __VLS_584 = __VLS_asFunctionalComponent(__VLS_583, new __VLS_583({
        color: "#1e1e1e",
        ...{ class: "text-center d-flex flex-column align-center pa-6 rounded-lg" },
        ...{ style: {} },
    }));
    const __VLS_585 = __VLS_584({
        color: "#1e1e1e",
        ...{ class: "text-center d-flex flex-column align-center pa-6 rounded-lg" },
        ...{ style: {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_584));
    __VLS_586.slots.default;
    const __VLS_587 = {}.VIcon;
    /** @type {[typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, ]} */ ;
    // @ts-ignore
    const __VLS_588 = __VLS_asFunctionalComponent(__VLS_587, new __VLS_587({
        color: "amber-accent-4",
        size: "80",
        ...{ class: "mb-4" },
    }));
    const __VLS_589 = __VLS_588({
        color: "amber-accent-4",
        size: "80",
        ...{ class: "mb-4" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_588));
    __VLS_590.slots.default;
    var __VLS_590;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "text-h5 font-weight-black text-amber-accent-4 mb-4" },
        ...{ style: {} },
    });
    if (__VLS_ctx.newBadgeDialog.reward) {
        const __VLS_591 = {}.VCard;
        /** @type {[typeof __VLS_components.VCard, typeof __VLS_components.vCard, typeof __VLS_components.VCard, typeof __VLS_components.vCard, ]} */ ;
        // @ts-ignore
        const __VLS_592 = __VLS_asFunctionalComponent(__VLS_591, new __VLS_591({
            rounded: "lg",
            elevation: "10",
            width: "100%",
            ...{ class: "py-3 px-2 mb-6" },
            color: "secundary",
            ...{ style: {} },
        }));
        const __VLS_593 = __VLS_592({
            rounded: "lg",
            elevation: "10",
            width: "100%",
            ...{ class: "py-3 px-2 mb-6" },
            color: "secundary",
            ...{ style: {} },
        }, ...__VLS_functionalComponentArgsRest(__VLS_592));
        __VLS_594.slots.default;
        const __VLS_595 = {}.VRow;
        /** @type {[typeof __VLS_components.VRow, typeof __VLS_components.vRow, typeof __VLS_components.VRow, typeof __VLS_components.vRow, ]} */ ;
        // @ts-ignore
        const __VLS_596 = __VLS_asFunctionalComponent(__VLS_595, new __VLS_595({
            ...{ class: "align-center" },
        }));
        const __VLS_597 = __VLS_596({
            ...{ class: "align-center" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_596));
        __VLS_598.slots.default;
        const __VLS_599 = {}.VCol;
        /** @type {[typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ]} */ ;
        // @ts-ignore
        const __VLS_600 = __VLS_asFunctionalComponent(__VLS_599, new __VLS_599({
            cols: "3",
            ...{ class: "d-flex align-center justify-center pl-4" },
        }));
        const __VLS_601 = __VLS_600({
            cols: "3",
            ...{ class: "d-flex align-center justify-center pl-4" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_600));
        __VLS_602.slots.default;
        const __VLS_603 = {}.VImg;
        /** @type {[typeof __VLS_components.VImg, typeof __VLS_components.vImg, typeof __VLS_components.VImg, typeof __VLS_components.vImg, ]} */ ;
        // @ts-ignore
        const __VLS_604 = __VLS_asFunctionalComponent(__VLS_603, new __VLS_603({
            src: (`https://assets.drunagor.app/${__VLS_ctx.newBadgeDialog.reward.picture_hash}`),
            alt: "Reward Icon",
            maxHeight: "80",
            contain: true,
        }));
        const __VLS_605 = __VLS_604({
            src: (`https://assets.drunagor.app/${__VLS_ctx.newBadgeDialog.reward.picture_hash}`),
            alt: "Reward Icon",
            maxHeight: "80",
            contain: true,
        }, ...__VLS_functionalComponentArgsRest(__VLS_604));
        var __VLS_602;
        const __VLS_607 = {}.VCol;
        /** @type {[typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ]} */ ;
        // @ts-ignore
        const __VLS_608 = __VLS_asFunctionalComponent(__VLS_607, new __VLS_607({
            cols: "9",
            ...{ class: "pl-2 d-flex flex-column justify-center text-left" },
        }));
        const __VLS_609 = __VLS_608({
            cols: "9",
            ...{ class: "pl-2 d-flex flex-column justify-center text-left" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_608));
        __VLS_610.slots.default;
        __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
            ...{ class: "font-weight-black text-h6 text-amber-accent-4 ma-0 pb-1" },
            ...{ style: {} },
        });
        (__VLS_ctx.newBadgeDialog.reward.name);
        __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
            ...{ class: "text-body-2 text-white ma-0 font-weight-medium" },
        });
        (__VLS_ctx.newBadgeDialog.reward.description);
        var __VLS_610;
        var __VLS_598;
        var __VLS_594;
    }
    const __VLS_611 = {}.VBtn;
    /** @type {[typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ]} */ ;
    // @ts-ignore
    const __VLS_612 = __VLS_asFunctionalComponent(__VLS_611, new __VLS_611({
        ...{ 'onClick': {} },
        color: "amber-accent-4",
        ...{ class: "text-black font-weight-black px-8" },
        rounded: "pill",
        size: "large",
    }));
    const __VLS_613 = __VLS_612({
        ...{ 'onClick': {} },
        color: "amber-accent-4",
        ...{ class: "text-black font-weight-black px-8" },
        rounded: "pill",
        size: "large",
    }, ...__VLS_functionalComponentArgsRest(__VLS_612));
    let __VLS_615;
    let __VLS_616;
    let __VLS_617;
    const __VLS_618 = {
        onClick: (...[$event]) => {
            if (!!(__VLS_ctx.isImmersiveMode))
                return;
            __VLS_ctx.newBadgeDialog.visible = false;
        }
    };
    __VLS_614.slots.default;
    var __VLS_614;
    var __VLS_586;
    var __VLS_582;
    if (__VLS_ctx.savingState !== 'idle') {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "saving-indicator-bubble d-flex align-center pa-2 px-3 rounded-pill" },
            ...{ class: (__VLS_ctx.savingState) },
        });
        if (__VLS_ctx.savingState === 'saving') {
            const __VLS_619 = {}.VProgressCircular;
            /** @type {[typeof __VLS_components.VProgressCircular, typeof __VLS_components.vProgressCircular, typeof __VLS_components.VProgressCircular, typeof __VLS_components.vProgressCircular, ]} */ ;
            // @ts-ignore
            const __VLS_620 = __VLS_asFunctionalComponent(__VLS_619, new __VLS_619({
                indeterminate: true,
                size: "16",
                width: "2",
                ...{ class: "mr-2 text-white" },
            }));
            const __VLS_621 = __VLS_620({
                indeterminate: true,
                size: "16",
                width: "2",
                ...{ class: "mr-2 text-white" },
            }, ...__VLS_functionalComponentArgsRest(__VLS_620));
            __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
                ...{ class: "text-caption font-weight-bold text-white uppercase-tracking" },
            });
        }
        else if (__VLS_ctx.savingState === 'saved') {
            const __VLS_623 = {}.VIcon;
            /** @type {[typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, ]} */ ;
            // @ts-ignore
            const __VLS_624 = __VLS_asFunctionalComponent(__VLS_623, new __VLS_623({
                size: "16",
                color: "green-lighten-2",
                ...{ class: "mr-2" },
            }));
            const __VLS_625 = __VLS_624({
                size: "16",
                color: "green-lighten-2",
                ...{ class: "mr-2" },
            }, ...__VLS_functionalComponentArgsRest(__VLS_624));
            __VLS_626.slots.default;
            var __VLS_626;
            __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
                ...{ class: "text-caption font-weight-bold text-green-lighten-2 uppercase-tracking" },
            });
        }
        else if (__VLS_ctx.savingState === 'error') {
            const __VLS_627 = {}.VIcon;
            /** @type {[typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, ]} */ ;
            // @ts-ignore
            const __VLS_628 = __VLS_asFunctionalComponent(__VLS_627, new __VLS_627({
                size: "16",
                color: "red-lighten-2",
                ...{ class: "mr-2" },
            }));
            const __VLS_629 = __VLS_628({
                size: "16",
                color: "red-lighten-2",
                ...{ class: "mr-2" },
            }, ...__VLS_functionalComponentArgsRest(__VLS_628));
            __VLS_630.slots.default;
            var __VLS_630;
            __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
                ...{ class: "text-caption font-weight-bold text-red-lighten-2 uppercase-tracking" },
            });
        }
    }
}
/** @type {__VLS_StyleScopedClasses['global-snackbar']} */ ;
/** @type {__VLS_StyleScopedClasses['d-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['align-center']} */ ;
/** @type {__VLS_StyleScopedClasses['mr-3']} */ ;
/** @type {__VLS_StyleScopedClasses['font-weight-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['d-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-space-between']} */ ;
/** @type {__VLS_StyleScopedClasses['align-center']} */ ;
/** @type {__VLS_StyleScopedClasses['text-h5']} */ ;
/** @type {__VLS_StyleScopedClasses['d-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-wrap']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-space-around']} */ ;
/** @type {__VLS_StyleScopedClasses['pa-4']} */ ;
/** @type {__VLS_StyleScopedClasses['my-2']} */ ;
/** @type {__VLS_StyleScopedClasses['d-none']} */ ;
/** @type {__VLS_StyleScopedClasses['d-md-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['speed-dial-activator']} */ ;
/** @type {__VLS_StyleScopedClasses['d-none']} */ ;
/** @type {__VLS_StyleScopedClasses['d-md-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['speed-dial-item']} */ ;
/** @type {__VLS_StyleScopedClasses['speed-dial-item']} */ ;
/** @type {__VLS_StyleScopedClasses['speed-dial-item']} */ ;
/** @type {__VLS_StyleScopedClasses['speed-dial-item']} */ ;
/** @type {__VLS_StyleScopedClasses['speed-dial-item']} */ ;
/** @type {__VLS_StyleScopedClasses['speed-dial-item']} */ ;
/** @type {__VLS_StyleScopedClasses['d-md-none']} */ ;
/** @type {__VLS_StyleScopedClasses['mobile-bottom-nav']} */ ;
/** @type {__VLS_StyleScopedClasses['bottom-nav-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['bottom-nav-label']} */ ;
/** @type {__VLS_StyleScopedClasses['bottom-nav-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['bottom-nav-label']} */ ;
/** @type {__VLS_StyleScopedClasses['bottom-nav-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['bottom-nav-label']} */ ;
/** @type {__VLS_StyleScopedClasses['bottom-nav-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['bottom-nav-label']} */ ;
/** @type {__VLS_StyleScopedClasses['bottom-nav-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['bottom-nav-label']} */ ;
/** @type {__VLS_StyleScopedClasses['bottom-nav-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['bottom-nav-label']} */ ;
/** @type {__VLS_StyleScopedClasses['campaign-content']} */ ;
/** @type {__VLS_StyleScopedClasses['with-bottom-nav']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['pa-4']} */ ;
/** @type {__VLS_StyleScopedClasses['pr-sm-4']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-0']} */ ;
/** @type {__VLS_StyleScopedClasses['shepherd-campaign-name']} */ ;
/** @type {__VLS_StyleScopedClasses['d-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['align-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-start']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-sm-end']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-3']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-sm-0']} */ ;
/** @type {__VLS_StyleScopedClasses['d-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['align-center']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-grey-darken-4']} */ ;
/** @type {__VLS_StyleScopedClasses['px-3']} */ ;
/** @type {__VLS_StyleScopedClasses['py-2']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['border-thin']} */ ;
/** @type {__VLS_StyleScopedClasses['text-caption']} */ ;
/** @type {__VLS_StyleScopedClasses['font-weight-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-grey-lighten-1']} */ ;
/** @type {__VLS_StyleScopedClasses['mr-1']} */ ;
/** @type {__VLS_StyleScopedClasses['cursor-pointer']} */ ;
/** @type {__VLS_StyleScopedClasses['mr-2']} */ ;
/** @type {__VLS_StyleScopedClasses['font-weight-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['font-weight-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['ml-2']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-3']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded']} */ ;
/** @type {__VLS_StyleScopedClasses['shepherd-campaign-tabs']} */ ;
/** @type {__VLS_StyleScopedClasses['text-caption']} */ ;
/** @type {__VLS_StyleScopedClasses['mr-1']} */ ;
/** @type {__VLS_StyleScopedClasses['d-none']} */ ;
/** @type {__VLS_StyleScopedClasses['d-sm-inline']} */ ;
/** @type {__VLS_StyleScopedClasses['d-sm-none']} */ ;
/** @type {__VLS_StyleScopedClasses['text-caption']} */ ;
/** @type {__VLS_StyleScopedClasses['mr-1']} */ ;
/** @type {__VLS_StyleScopedClasses['d-none']} */ ;
/** @type {__VLS_StyleScopedClasses['d-sm-inline']} */ ;
/** @type {__VLS_StyleScopedClasses['d-sm-none']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-3']} */ ;
/** @type {__VLS_StyleScopedClasses['px-2']} */ ;
/** @type {__VLS_StyleScopedClasses['pr-md-2']} */ ;
/** @type {__VLS_StyleScopedClasses['pa-4']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-3']} */ ;
/** @type {__VLS_StyleScopedClasses['text-h6']} */ ;
/** @type {__VLS_StyleScopedClasses['pa-0']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-3']} */ ;
/** @type {__VLS_StyleScopedClasses['shepherd-select-door']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-0']} */ ;
/** @type {__VLS_StyleScopedClasses['shepherd-runes']} */ ;
/** @type {__VLS_StyleScopedClasses['pl-md-2']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-3']} */ ;
/** @type {__VLS_StyleScopedClasses['shepherd-rune-cards']} */ ;
/** @type {__VLS_StyleScopedClasses['my-3']} */ ;
/** @type {__VLS_StyleScopedClasses['px-2']} */ ;
/** @type {__VLS_StyleScopedClasses['pa-2']} */ ;
/** @type {__VLS_StyleScopedClasses['shepherd-hero-actions']} */ ;
/** @type {__VLS_StyleScopedClasses['d-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-wrap']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
/** @type {__VLS_StyleScopedClasses['mx-1']} */ ;
/** @type {__VLS_StyleScopedClasses['my-1']} */ ;
/** @type {__VLS_StyleScopedClasses['mx-1']} */ ;
/** @type {__VLS_StyleScopedClasses['my-1']} */ ;
/** @type {__VLS_StyleScopedClasses['mx-1']} */ ;
/** @type {__VLS_StyleScopedClasses['my-1']} */ ;
/** @type {__VLS_StyleScopedClasses['px-2']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-2']} */ ;
/** @type {__VLS_StyleScopedClasses['shepherd-heroes-list']} */ ;
/** @type {__VLS_StyleScopedClasses['text-center']} */ ;
/** @type {__VLS_StyleScopedClasses['pa-4']} */ ;
/** @type {__VLS_StyleScopedClasses['text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['d-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-6']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['px-4']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-3']} */ ;
/** @type {__VLS_StyleScopedClasses['d-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-start']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-sm-end']} */ ;
/** @type {__VLS_StyleScopedClasses['align-center']} */ ;
/** @type {__VLS_StyleScopedClasses['mx-1']} */ ;
/** @type {__VLS_StyleScopedClasses['my-1']} */ ;
/** @type {__VLS_StyleScopedClasses['d-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['align-center']} */ ;
/** @type {__VLS_StyleScopedClasses['mr-3']} */ ;
/** @type {__VLS_StyleScopedClasses['d-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['align-center']} */ ;
/** @type {__VLS_StyleScopedClasses['text-caption']} */ ;
/** @type {__VLS_StyleScopedClasses['font-weight-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['mr-1']} */ ;
/** @type {__VLS_StyleScopedClasses['cursor-pointer']} */ ;
/** @type {__VLS_StyleScopedClasses['ml-2']} */ ;
/** @type {__VLS_StyleScopedClasses['d-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-3']} */ ;
/** @type {__VLS_StyleScopedClasses['px-2']} */ ;
/** @type {__VLS_StyleScopedClasses['d-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-3']} */ ;
/** @type {__VLS_StyleScopedClasses['px-2']} */ ;
/** @type {__VLS_StyleScopedClasses['pa-6']} */ ;
/** @type {__VLS_StyleScopedClasses['text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-surface']} */ ;
/** @type {__VLS_StyleScopedClasses['my-3']} */ ;
/** @type {__VLS_StyleScopedClasses['pa-2']} */ ;
/** @type {__VLS_StyleScopedClasses['d-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-wrap']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
/** @type {__VLS_StyleScopedClasses['mx-1']} */ ;
/** @type {__VLS_StyleScopedClasses['my-1']} */ ;
/** @type {__VLS_StyleScopedClasses['mx-1']} */ ;
/** @type {__VLS_StyleScopedClasses['my-1']} */ ;
/** @type {__VLS_StyleScopedClasses['mx-1']} */ ;
/** @type {__VLS_StyleScopedClasses['my-1']} */ ;
/** @type {__VLS_StyleScopedClasses['text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['pa-2']} */ ;
/** @type {__VLS_StyleScopedClasses['shepherd-heroes-list']} */ ;
/** @type {__VLS_StyleScopedClasses['text-center']} */ ;
/** @type {__VLS_StyleScopedClasses['pa-4']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-2']} */ ;
/** @type {__VLS_StyleScopedClasses['d-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-6']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['px-4']} */ ;
/** @type {__VLS_StyleScopedClasses['position-relative']} */ ;
/** @type {__VLS_StyleScopedClasses['text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['text-center']} */ ;
/** @type {__VLS_StyleScopedClasses['d-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-column']} */ ;
/** @type {__VLS_StyleScopedClasses['align-center']} */ ;
/** @type {__VLS_StyleScopedClasses['pa-6']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['text-h5']} */ ;
/** @type {__VLS_StyleScopedClasses['font-weight-black']} */ ;
/** @type {__VLS_StyleScopedClasses['text-amber-accent-4']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['py-3']} */ ;
/** @type {__VLS_StyleScopedClasses['px-2']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-6']} */ ;
/** @type {__VLS_StyleScopedClasses['align-center']} */ ;
/** @type {__VLS_StyleScopedClasses['d-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['align-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['pl-4']} */ ;
/** @type {__VLS_StyleScopedClasses['pl-2']} */ ;
/** @type {__VLS_StyleScopedClasses['d-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-column']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['text-left']} */ ;
/** @type {__VLS_StyleScopedClasses['font-weight-black']} */ ;
/** @type {__VLS_StyleScopedClasses['text-h6']} */ ;
/** @type {__VLS_StyleScopedClasses['text-amber-accent-4']} */ ;
/** @type {__VLS_StyleScopedClasses['ma-0']} */ ;
/** @type {__VLS_StyleScopedClasses['pb-1']} */ ;
/** @type {__VLS_StyleScopedClasses['text-body-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['ma-0']} */ ;
/** @type {__VLS_StyleScopedClasses['font-weight-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['text-black']} */ ;
/** @type {__VLS_StyleScopedClasses['font-weight-black']} */ ;
/** @type {__VLS_StyleScopedClasses['px-8']} */ ;
/** @type {__VLS_StyleScopedClasses['saving-indicator-bubble']} */ ;
/** @type {__VLS_StyleScopedClasses['d-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['align-center']} */ ;
/** @type {__VLS_StyleScopedClasses['pa-2']} */ ;
/** @type {__VLS_StyleScopedClasses['px-3']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-pill']} */ ;
/** @type {__VLS_StyleScopedClasses['mr-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['text-caption']} */ ;
/** @type {__VLS_StyleScopedClasses['font-weight-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['uppercase-tracking']} */ ;
/** @type {__VLS_StyleScopedClasses['mr-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-caption']} */ ;
/** @type {__VLS_StyleScopedClasses['font-weight-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-green-lighten-2']} */ ;
/** @type {__VLS_StyleScopedClasses['uppercase-tracking']} */ ;
/** @type {__VLS_StyleScopedClasses['mr-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-caption']} */ ;
/** @type {__VLS_StyleScopedClasses['font-weight-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-red-lighten-2']} */ ;
/** @type {__VLS_StyleScopedClasses['uppercase-tracking']} */ ;
// @ts-ignore
var __VLS_48 = __VLS_47, __VLS_409 = __VLS_408, __VLS_540 = __VLS_539, __VLS_549 = __VLS_548, __VLS_554 = __VLS_553, __VLS_559 = __VLS_558;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            CampaignLogAddHero: CampaignLogAddHero,
            CampaignLogRemoveHero: CampaignLogRemoveHero,
            CampaignLog: CampaignLog,
            CampaignRemove: CampaignRemove,
            CampaignExport: CampaignExport,
            CampaignSavePut: CampaignSavePut,
            CampaignName: CampaignName,
            CampaignBook: CampaignBook,
            CampaignPlayerList: CampaignPlayerList,
            ShareCampaignButton: ShareCampaignButton,
            CampaignLogImportHero: CampaignLogImportHero,
            CampaignRuneCards: CampaignRuneCards,
            CampaignRunes: CampaignRunes,
            SelectDoor: SelectDoor,
            StoryRecord: StoryRecord,
            StoryRecordLegacyTrail: StoryRecordLegacyTrail,
            StoryRecordBackgroundAndTrait: StoryRecordBackgroundAndTrait,
            CampaignImmersiveView: CampaignImmersiveView,
            TharmagarChat: TharmagarChat,
            heroStore: heroStore,
            userStore: userStore,
            t: t,
            campaignId: campaignId,
            isImmersiveMode: isImmersiveMode,
            playerListDialogVisible: playerListDialogVisible,
            partyCode: partyCode,
            isSequentialAdventure: isSequentialAdventure,
            campaign: campaign,
            currentTab: currentTab,
            isAdminUser: isAdminUser,
            showLoadInstructions: showLoadInstructions,
            snackbarVisible: snackbarVisible,
            snackbarText: snackbarText,
            snackbarTitle: snackbarTitle,
            snackbarIcon: snackbarIcon,
            snackbarColor: snackbarColor,
            snackbarIconColor: snackbarIconColor,
            snackbarTimeout: snackbarTimeout,
            speedDialOpen: speedDialOpen,
            tharmagarDialogVisible: tharmagarDialogVisible,
            bottomNavValue: bottomNavValue,
            savingState: savingState,
            onSaving: onSaving,
            newBadgeDialog: newBadgeDialog,
            savePutRef: savePutRef,
            campaignBookRef: campaignBookRef,
            campaignPlayerListRef: campaignPlayerListRef,
            campaignRemoveRef: campaignRemoveRef,
            campaignExportRef: campaignExportRef,
            shareCampaignRef: shareCampaignRef,
            openPlayerListDialog: openPlayerListDialog,
            handleSpeedDialAction: handleSpeedDialAction,
            handleBottomNavAction: handleBottomNavAction,
            executeAction: executeAction,
            onSaveSuccess: onSaveSuccess,
            onSaveFail: onSaveFail,
            onCampaignRemoved: onCampaignRemoved,
            onPlayerRemoved: onPlayerRemoved,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
