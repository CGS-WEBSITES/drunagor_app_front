/// <reference types="../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import { ref, computed, onBeforeMount } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useDisplay } from "vuetify"; // Importação do useDisplay
import CampaignNew from "@/components/CampaignNew.vue";
import CampaignImport from "@/components/CampaignImport.vue";
import HUB from "@/components/HUB.vue";
import { CampaignStore } from "@/store/CampaignStore";
import { useUserStore } from "@/store/UserStore";
import { HeroDataRepository } from "@/data/repository/HeroDataRepository";
import { useToast } from "primevue/usetoast";
import BaseAlert from "@/components/Alerts/BaseAlert.vue";
import axios from "axios";
import CoreLogo from "@/assets/campaign/logo/core.webp";
import ApocalypseLogo from "@/assets/campaign/logo/apocalypse.webp";
import AwakeningsLogo from "@/assets/campaign/logo/awakenings.webp";
const router = useRouter();
const route = useRoute();
const { mdAndUp } = useDisplay(); // Pegando a variável de breakpoint nativa do Vuetify
const userStore = useUserStore();
const campaignStore = CampaignStore();
const toast = useToast();
const campaignNewRef = ref(null);
const campaignImportRef = ref(null);
const showPlayDialog = ref(false);
const activePlayTab = ref(0);
const showHub = ref(false);
const myEvents = ref([]);
const openPlayOptions = () => {
    showPlayDialog.value = true;
    activePlayTab.value = 0;
};
const triggerNewCampaign = () => {
    showPlayDialog.value = false;
    campaignNewRef.value?.openModal();
};
const triggerImportCampaign = () => {
    showPlayDialog.value = false;
    campaignImportRef.value?.openModal();
};
const handleJoinCampaign = () => {
    showPlayDialog.value = false;
    onJoinCampaign();
};
const openHub = async () => {
    showHub.value = true;
    if (userStore.user?.users_pk) {
        try {
            const response = await axios.get('/events/my_events/player', {
                params: { player_fk: userStore.user.users_pk, past_events: false },
                headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
            });
            const now = new Date();
            myEvents.value = (response.data.events || [])
                .filter((e) => new Date(e.event_date) > now)
                .sort((a, b) => new Date(a.event_date).getTime() - new Date(b.event_date).getTime());
        }
        catch (e) {
            console.error("Error fetching events for HUB:", e);
            myEvents.value = [];
        }
    }
};
const playDrunagorNights = () => {
    showPlayDialog.value = false;
    openHub();
};
const loading = ref(true);
const joiningCampaign = ref(false);
const loadingErrors = ref([]);
const showJoinCampaignDialog = ref(false);
const joinCampaignId = ref("");
const selectedBoxFilter = ref(null);
const boxOptions = [
    { title: 'All Campaigns', value: null },
    { title: 'CoD Core', value: 'core' },
    { title: 'CoD Apocalypse', value: 'apocalypse' },
    { title: 'CoD Awakenings', value: 'awakenings' },
    { title: 'Drunagor Nights S1', value: 'underkeep' },
    { title: 'Drunagor Nights S2', value: 'underkeep2' }
];
const showOnlyFinished = ref(false);
const sortOrder = ref('desc');
const extraCampaignData = ref({});
const BOX_ID = 38;
const allCampaigns = computed(() => {
    let campaigns = [...campaignStore.findAll()];
    if (selectedBoxFilter.value) {
        campaigns = campaigns.filter(c => c.campaign === selectedBoxFilter.value);
    }
    if (showOnlyFinished.value) {
        campaigns = campaigns.filter(c => extraCampaignData.value[c.campaignId]?.isFinished === true);
    }
    else {
        campaigns = campaigns.filter(c => !extraCampaignData.value[c.campaignId]?.isFinished);
    }
    return campaigns.sort((a, b) => {
        if (sortOrder.value === 'desc') {
            return Number(b.campaignId) - Number(a.campaignId);
        }
        return Number(a.campaignId) - Number(b.campaignId);
    });
});
const parsedCampaignFk = computed(() => {
    return joinCampaignId.value.length > 4 ? joinCampaignId.value.slice(4) : null;
});
const getBoxName = (boxId) => {
    const map = {
        22: "CoD Age of Darkness CORE",
        23: "CoD Apocalypse",
        24: "CoD Awakenings",
        34: "CoD Awakenings",
        38: "Drunagor Nights S1",
        39: "Drunagor Nights S2",
    };
    return map[boxId] || `Unknown Box (ID: ${boxId})`;
};
const getUserProfileImage = (pictureHash) => {
    if (pictureHash) {
        return `https://assets.drunagor.app/Profile/${pictureHash}`;
    }
    return '/assets/hero/avatar/default.webp';
};
const addLoadingError = (text) => {
    const id = Date.now();
    loadingErrors.value.push({ id, text });
    setTimeout(() => {
        loadingErrors.value = loadingErrors.value.filter((e) => e.id !== id);
    }, 5000);
};
const loadCampaignFromHash = (trackerHash, campaignPk, partyName) => {
    try {
        const data = JSON.parse(atob(trackerHash));
        if (!data.campaignData)
            return;
        const camp = data.campaignData;
        camp.campaignId = campaignPk;
        camp.name = partyName || camp.name || "Unnamed Campaign";
        if (data.heroes && Array.isArray(data.heroes)) {
            camp.heroes = data.heroes.map((h) => ({
                ...h,
                campaignId: campaignPk
            }));
        }
        else {
            camp.heroes = [];
        }
        campaignStore.add(camp);
    }
    catch (error) {
        console.error("Error loading campaign from hash:", error);
        throw error;
    }
};
const loadCampaignWithHeroes = async (campaignData) => {
    try {
        const campaignPk = String(campaignData.campaigns_fk);
        loadCampaignFromHash(campaignData.tracker_hash, campaignPk, campaignData.party_name);
        return true;
    }
    catch (error) {
        console.error("Error loading campaign:", error);
        const campaignId = String(campaignData.campaigns_fk);
        const boxName = getBoxName(campaignData.box);
        const partyName = campaignData.party_name || "Unnamed Party";
        addLoadingError(`Could not load the campaign "${partyName}" from the "${boxName}". ` +
            `Campaign ID: ${campaignId}. Data seems corrupted. Please contact support.`);
        return false;
    }
};
const loadExtraData = async (campaignId) => {
    try {
        const [doorsRes, playersRes] = await Promise.all([
            axios.get("/rl_campaigns_doors/search", { params: { campaign_fk: campaignId } }),
            axios.get("/rl_campaigns_users/list_players", { params: { campaigns_fk: campaignId } })
        ]);
        const doors = doorsRes.data.campaign_doors || [];
        let lastDoorName = "None";
        let isFinished = false;
        if (doors.length > 0) {
            doors.sort((a, b) => b.rl_campaigns_doors_pk - a.rl_campaigns_doors_pk);
            const latest = doors[0];
            lastDoorName = latest.door_name;
            if (latest.doors_fk === 7 || latest.doors_fk === 12 || latest.door_name === "END GAME") {
                isFinished = true;
            }
        }
        const players = playersRes.data.Users || [];
        extraCampaignData.value[campaignId] = {
            lastDoorName,
            isFinished,
            players
        };
        // Load heroes for each player in parallel using Promise.allSettled
        await Promise.allSettled(players.map(async (player) => {
            if (player.playable_heroes_fk) {
                try {
                    const res = await axios.get(`/playable_heroes/${player.playable_heroes_fk}`);
                    if (res.data?.hero_hash) {
                        const jsonStr = atob(res.data.hero_hash);
                        const heroObj = JSON.parse(jsonStr);
                        heroObj.campaignId = campaignId;
                        heroObj.playableHeroesPk = player.playable_heroes_fk;
                        campaignStore.addOrUpdateHero(campaignId, heroObj);
                    }
                }
                catch (err) {
                    console.warn(`[CampaignOverviewView] Failed to load hero ${player.playable_heroes_fk}:`, err);
                }
            }
        }));
    }
    catch (e) {
        console.error(`Error loading extra info for campaign ${campaignId}:`, e);
    }
};
const loadCampaigns = async () => {
    loading.value = true;
    campaignStore.reset();
    loadingErrors.value = [];
    if (!userStore.user?.users_pk) {
        userStore.restoreFromStorage();
    }
    if (!userStore.user?.users_pk) {
        loading.value = false;
        return;
    }
    try {
        // Primeira requisição: sem season 2 (ou season 2 = false)
        try {
            const campaignsResponse1 = await axios.get("/rl_campaigns_users/search", {
                params: {
                    users_fk: userStore.user.users_pk,
                    show_season2: false,
                    _t: Date.now(),
                },
            });
            if (campaignsResponse1.data?.campaigns) {
                for (const campaignData of campaignsResponse1.data.campaigns) {
                    await loadCampaignWithHeroes(campaignData);
                }
            }
        }
        catch (err1) {
            console.warn("Error loading Season 1 campaigns:", err1);
        }
        // Segunda requisição: com season 2 = true
        try {
            const campaignsResponse2 = await axios.get("/rl_campaigns_users/search", {
                params: {
                    users_fk: userStore.user.users_pk,
                    show_season2: true,
                    _t: Date.now(),
                },
            });
            if (campaignsResponse2.data?.campaigns) {
                for (const campaignData of campaignsResponse2.data.campaigns) {
                    await loadCampaignWithHeroes(campaignData);
                }
            }
        }
        catch (err2) {
            console.warn("Error loading Season 2 campaigns:", err2);
        }
        const storeCampaigns = campaignStore.findAll();
        const underkeepCampaigns = storeCampaigns.filter(c => c.campaign === 'underkeep' || c.campaign === 'underkeep2');
        await Promise.allSettled(underkeepCampaigns.map(c => loadExtraData(c.campaignId)));
    }
    catch (error) {
        console.error("Error fetching campaigns:", error);
        addLoadingError("Error fetching campaigns. Please try again later.");
    }
    finally {
        loading.value = false;
    }
};
const goToCampaign = (campaign) => {
    if (extraCampaignData.value[campaign.campaignId]?.isFinished) {
        toast.add({
            severity: 'info',
            summary: 'Campaign Finished',
            detail: 'This campaign is finalized. You can no longer interact with its state.',
            life: 4000
        });
        return;
    }
    router.push({ name: "Campaign", params: { id: campaign.campaignId } });
};
const heroAvatars = (campId) => {
    const repo = new HeroDataRepository();
    const heroes = campaignStore.findAllHeroes(campId);
    if (heroes.length === 0) {
        return [];
    }
    return heroes
        .map((h) => repo.find(h.heroId))
        .filter((h) => !!h);
};
// CÁLCULO DE TAMANHO REATIVO
const calculateAvatarSize = (campId) => {
    const heroCount = campaignStore.findAllHeroes(campId).length;
    // Desktop (PC): Mantém o tamanho grande que você curtiu
    if (mdAndUp.value) {
        return 110;
    }
    // Mobile: Reduz de forma inteligente para não quebrar a linha
    if (heroCount <= 4) {
        return 75; // Cabe 4 na linha
    }
    else {
        return 60; // Cabe 5 na linha
    }
};
const onJoinCampaign = () => {
    showJoinCampaignDialog.value = true;
};
const confirmJoinCampaign = async () => {
    if (!parsedCampaignFk.value)
        return;
    joiningCampaign.value = true;
    const usersPk = userStore.user.users_pk;
    const campaignId = parsedCampaignFk.value;
    try {
        // 1. Fetch the campaign info from server first to determine its box SKU
        const campaignInfoRes = await axios.get(`/campaigns/${campaignId}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` }
        });
        const campaignBox = campaignInfoRes.data?.box || BOX_ID;
        const isSeason2 = campaignBox === 39;
        // 2. Perform the cadastro with the correct skus_fk via Query Parameters
        await axios.post("/rl_campaigns_users/cadastro", null, {
            params: {
                users_fk: usersPk,
                campaigns_fk: Number(campaignId),
                skus_fk: campaignBox,
                active: true
            },
            headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
        });
        // 3. Search with correct show_season2 setting
        const campaignResponse = await axios.get("/rl_campaigns_users/search", {
            params: {
                users_fk: usersPk,
                campaigns_fk: campaignId,
                show_season2: isSeason2,
                _t: Date.now(),
            },
            headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
        });
        const campaignData = campaignResponse.data?.campaigns?.[0];
        if (campaignData && campaignData.tracker_hash) {
            await loadCampaignWithHeroes(campaignData);
            router.push({
                path: `/campaign-tracker/campaign/${campaignId}`,
                query: { sku: String(campaignBox) },
            });
            toast.add({
                severity: "success",
                summary: "Success",
                detail: "You have successfully joined the campaign!",
            });
        }
        else {
            throw new Error("Failed to retrieve campaign data after joining.");
        }
    }
    catch (err) {
        console.error("Error during join process:", err);
        let errorMessage = "Error joining campaign.";
        let severity = "error";
        // Since we failed, check if the user is already part of it or conflicts
        if (err.response?.data?.message?.includes("already exists") ||
            err.response?.data?.message?.includes("já existe") ||
            err.response?.status === 409) {
            errorMessage = "You are already part of this campaign!";
            severity = "info";
            // Attempt to retrieve campaign box to redirect correctly
            let campaignBox = BOX_ID;
            try {
                const campaignInfoRes = await axios.get(`/campaigns/${campaignId}`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` }
                });
                if (campaignInfoRes.data?.box) {
                    campaignBox = campaignInfoRes.data.box;
                }
            }
            catch (boxErr) {
                console.warn("Could not determine campaign box on redirect fallback", boxErr);
            }
            router.push({
                path: `/campaign-tracker/campaign/${campaignId}`,
                query: { sku: String(campaignBox) },
            });
        }
        toast.add({
            severity: severity,
            summary: severity === "info" ? "Info" : "Error",
            detail: errorMessage,
        });
    }
    finally {
        joiningCampaign.value = false;
        joinCampaignId.value = "";
        showJoinCampaignDialog.value = false;
    }
};
const heroRepo = new HeroDataRepository();
const isUnderkeep = (campaignType) => {
    return campaignType === 'underkeep' || campaignType === 'underkeep2';
};
const formatWingName = (wing) => {
    if (!wing)
        return "";
    return wing
        .replace(/-\s*advanced/gi, "")
        .replace(/advanced\s*-/gi, "")
        .replace(/advanced/gi, "")
        .replace(/\s+/g, " ")
        .trim();
};
const getPlayerHero = (campaignId, playableHeroFk) => {
    if (!playableHeroFk)
        return null;
    const hero = campaignStore.findHeroByPlayableHeroesPk(campaignId, playableHeroFk);
    if (!hero)
        return null;
    return heroRepo.find(hero.heroId) || null;
};
const calculateCompletionPercentage = (campaign) => {
    const wing = (campaign.wing || "").toUpperCase();
    const currentDoor = (campaign.door || "").toUpperCase();
    let list = [];
    if (wing.includes("TUTORIAL")) {
        list = [
            "FIRST SETUP",
            "THE BARRICADED PATH (TUTORIAL)",
            "THE KEEP'S COURTYARD (TUTORIAL)",
            "THE ENTRY HALL (TUTORIAL)",
            "THE GREAT HALL (TUTORIAL)",
            "END GAME"
        ];
    }
    else if (wing.includes("WING 1") || wing.includes("WING 01")) {
        list = [
            "FIRST SETUP",
            "THE BARRICADED PATH",
            "THE KEEP'S COURTYARD",
            "THE ENTRY HALL",
            "THE GREAT HALL",
            "END GAME"
        ];
    }
    else if (wing.includes("WING 2") || wing.includes("WING 02")) {
        list = [
            "FIRST SETUP",
            "THE GREAT CISTERN",
            "THE DUNGEONS",
            "THE ALCHEMY LAB",
            "THE BURIED ARMORY",
            "THERE AND BACK AGAIN",
            "END GAME"
        ];
    }
    else if (wing.includes("WING 3") || wing.includes("WING 03")) {
        list = [
            "FIRST SETUP",
            "DUNGEON FOYER",
            "QUEEN'S HALL",
            "THE FORGE",
            "ARTISAN'S GALLERY",
            "PROVING GROUNDS",
            "MAIN HALL",
            "END GAME"
        ];
    }
    else if (wing.includes("WING 4") || wing.includes("WING 04")) {
        list = [
            "FIRST SETUP",
            "DRACONIC CHAPEL",
            "CRYPTS",
            "BOTH OPEN",
            "LIBRARY",
            "LABORATORY",
            "DRAGON BOSS",
            "END GAME"
        ];
    }
    if (list.length === 0)
        return 0;
    let idx = list.indexOf(currentDoor);
    if (idx === -1) {
        idx = list.findIndex(d => currentDoor.includes(d) || d.includes(currentDoor));
    }
    if (idx === -1) {
        if (currentDoor === "FIRST SETUP")
            idx = 0;
        else if (currentDoor === "END GAME")
            idx = list.length - 1;
        else
            idx = 0;
    }
    const pct = Math.round((idx / (list.length - 1)) * 100);
    return Math.min(100, Math.max(0, pct));
};
onBeforeMount(async () => {
    await loadCampaigns();
});
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['play-campaigns-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['legacy-logo']} */ ;
/** @type {__VLS_StyleScopedClasses['hero-standee-card']} */ ;
/** @type {__VLS_StyleScopedClasses['player-standee-container']} */ ;
/** @type {__VLS_StyleScopedClasses['standees-list-container']} */ ;
/** @type {__VLS_StyleScopedClasses['hero-standee-card']} */ ;
/** @type {__VLS_StyleScopedClasses['player-standee-container']} */ ;
/** @type {__VLS_StyleScopedClasses['standees-list-container']} */ ;
// CSS variable injection 
// CSS variable injection end 
const __VLS_0 = {}.VContainer;
/** @type {[typeof __VLS_components.VContainer, typeof __VLS_components.vContainer, typeof __VLS_components.VContainer, typeof __VLS_components.vContainer, ]} */ ;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
    maxWidth: "680",
    ...{ class: "pt-0" },
}));
const __VLS_2 = __VLS_1({
    maxWidth: "680",
    ...{ class: "pt-0" },
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
var __VLS_4 = {};
__VLS_3.slots.default;
if (__VLS_ctx.loadingErrors.length > 0) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "mb-4" },
    });
    for (const [error, index] of __VLS_getVForSourceType((__VLS_ctx.loadingErrors))) {
        /** @type {[typeof BaseAlert, typeof BaseAlert, ]} */ ;
        // @ts-ignore
        const __VLS_5 = __VLS_asFunctionalComponent(BaseAlert, new BaseAlert({
            ...{ 'onUpdate:modelValue': {} },
            key: (error.id),
            modelValue: (true),
            type: "error",
            title: "Loading Error",
            variant: "elevated",
            closable: true,
            ...{ class: "mb-3" },
        }));
        const __VLS_6 = __VLS_5({
            ...{ 'onUpdate:modelValue': {} },
            key: (error.id),
            modelValue: (true),
            type: "error",
            title: "Loading Error",
            variant: "elevated",
            closable: true,
            ...{ class: "mb-3" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_5));
        let __VLS_8;
        let __VLS_9;
        let __VLS_10;
        const __VLS_11 = {
            'onUpdate:modelValue': (() => __VLS_ctx.loadingErrors.splice(index, 1))
        };
        __VLS_7.slots.default;
        (error.text);
        var __VLS_7;
    }
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ style: {} },
});
/** @type {[typeof CampaignNew, ]} */ ;
// @ts-ignore
const __VLS_12 = __VLS_asFunctionalComponent(CampaignNew, new CampaignNew({
    ref: "campaignNewRef",
}));
const __VLS_13 = __VLS_12({
    ref: "campaignNewRef",
}, ...__VLS_functionalComponentArgsRest(__VLS_12));
/** @type {typeof __VLS_ctx.campaignNewRef} */ ;
var __VLS_15 = {};
var __VLS_14;
/** @type {[typeof CampaignImport, ]} */ ;
// @ts-ignore
const __VLS_17 = __VLS_asFunctionalComponent(CampaignImport, new CampaignImport({
    ref: "campaignImportRef",
}));
const __VLS_18 = __VLS_17({
    ref: "campaignImportRef",
}, ...__VLS_functionalComponentArgsRest(__VLS_17));
/** @type {typeof __VLS_ctx.campaignImportRef} */ ;
var __VLS_20 = {};
var __VLS_19;
/** @type {[typeof HUB, ]} */ ;
// @ts-ignore
const __VLS_22 = __VLS_asFunctionalComponent(HUB, new HUB({
    modelValue: (__VLS_ctx.showHub),
    myEvents: (__VLS_ctx.myEvents),
    user: (__VLS_ctx.userStore.user),
}));
const __VLS_23 = __VLS_22({
    modelValue: (__VLS_ctx.showHub),
    myEvents: (__VLS_ctx.myEvents),
    user: (__VLS_ctx.userStore.user),
}, ...__VLS_functionalComponentArgsRest(__VLS_22));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "d-flex justify-center mt-0 mb-4 pt-0" },
});
const __VLS_25 = {}.VBtn;
/** @type {[typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ]} */ ;
// @ts-ignore
const __VLS_26 = __VLS_asFunctionalComponent(__VLS_25, new __VLS_25({
    ...{ 'onClick': {} },
    color: "playbutton",
    variant: "flat",
    size: "x-large",
    rounded: "lg",
    ...{ class: "font-weight-black play-campaigns-btn w-100 text-uppercase" },
    ...{ style: {} },
    prependIcon: "mdi-sword-cross",
}));
const __VLS_27 = __VLS_26({
    ...{ 'onClick': {} },
    color: "playbutton",
    variant: "flat",
    size: "x-large",
    rounded: "lg",
    ...{ class: "font-weight-black play-campaigns-btn w-100 text-uppercase" },
    ...{ style: {} },
    prependIcon: "mdi-sword-cross",
}, ...__VLS_functionalComponentArgsRest(__VLS_26));
let __VLS_29;
let __VLS_30;
let __VLS_31;
const __VLS_32 = {
    onClick: (__VLS_ctx.openPlayOptions)
};
__VLS_28.slots.default;
var __VLS_28;
const __VLS_33 = {}.VCard;
/** @type {[typeof __VLS_components.VCard, typeof __VLS_components.vCard, typeof __VLS_components.VCard, typeof __VLS_components.vCard, ]} */ ;
// @ts-ignore
const __VLS_34 = __VLS_asFunctionalComponent(__VLS_33, new __VLS_33({
    ...{ class: "mt-3 pa-3 elevation-0 d-flex flex-column ga-4" },
}));
const __VLS_35 = __VLS_34({
    ...{ class: "mt-3 pa-3 elevation-0 d-flex flex-column ga-4" },
}, ...__VLS_functionalComponentArgsRest(__VLS_34));
__VLS_36.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "w-100" },
});
const __VLS_37 = {}.VSelect;
/** @type {[typeof __VLS_components.VSelect, typeof __VLS_components.vSelect, typeof __VLS_components.VSelect, typeof __VLS_components.vSelect, ]} */ ;
// @ts-ignore
const __VLS_38 = __VLS_asFunctionalComponent(__VLS_37, new __VLS_37({
    modelValue: (__VLS_ctx.selectedBoxFilter),
    items: (__VLS_ctx.boxOptions),
    label: "Filter by Box",
    variant: "outlined",
    density: "compact",
    hideDetails: true,
    clearable: true,
    ...{ style: {} },
}));
const __VLS_39 = __VLS_38({
    modelValue: (__VLS_ctx.selectedBoxFilter),
    items: (__VLS_ctx.boxOptions),
    label: "Filter by Box",
    variant: "outlined",
    density: "compact",
    hideDetails: true,
    clearable: true,
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_38));
__VLS_40.slots.default;
{
    const { item: __VLS_thisSlot } = __VLS_40.slots;
    const [{ props, item }] = __VLS_getSlotParams(__VLS_thisSlot);
    const __VLS_41 = {}.VListItem;
    /** @type {[typeof __VLS_components.VListItem, typeof __VLS_components.vListItem, typeof __VLS_components.VListItem, typeof __VLS_components.vListItem, ]} */ ;
    // @ts-ignore
    const __VLS_42 = __VLS_asFunctionalComponent(__VLS_41, new __VLS_41({
        ...(props),
    }));
    const __VLS_43 = __VLS_42({
        ...(props),
    }, ...__VLS_functionalComponentArgsRest(__VLS_42));
    __VLS_44.slots.default;
    {
        const { prepend: __VLS_thisSlot } = __VLS_44.slots;
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "mr-3 bg-grey-darken-4" },
            ...{ style: {} },
        });
        if (item.raw.value === 'core') {
            const __VLS_45 = {}.VImg;
            /** @type {[typeof __VLS_components.VImg, typeof __VLS_components.vImg, typeof __VLS_components.VImg, typeof __VLS_components.vImg, ]} */ ;
            // @ts-ignore
            const __VLS_46 = __VLS_asFunctionalComponent(__VLS_45, new __VLS_45({
                src: "https://assets.drunagor.app/CampaignTracker/CoreCompanion.webp",
                cover: true,
                ...{ class: "w-100 h-100" },
            }));
            const __VLS_47 = __VLS_46({
                src: "https://assets.drunagor.app/CampaignTracker/CoreCompanion.webp",
                cover: true,
                ...{ class: "w-100 h-100" },
            }, ...__VLS_functionalComponentArgsRest(__VLS_46));
        }
        else if (item.raw.value === 'apocalypse') {
            const __VLS_49 = {}.VImg;
            /** @type {[typeof __VLS_components.VImg, typeof __VLS_components.vImg, typeof __VLS_components.VImg, typeof __VLS_components.vImg, ]} */ ;
            // @ts-ignore
            const __VLS_50 = __VLS_asFunctionalComponent(__VLS_49, new __VLS_49({
                src: "https://assets.drunagor.app/CampaignTracker/ApocCompanion.webp",
                cover: true,
                ...{ class: "w-100 h-100" },
            }));
            const __VLS_51 = __VLS_50({
                src: "https://assets.drunagor.app/CampaignTracker/ApocCompanion.webp",
                cover: true,
                ...{ class: "w-100 h-100" },
            }, ...__VLS_functionalComponentArgsRest(__VLS_50));
        }
        else if (item.raw.value === 'awakenings') {
            const __VLS_53 = {}.VImg;
            /** @type {[typeof __VLS_components.VImg, typeof __VLS_components.vImg, typeof __VLS_components.VImg, typeof __VLS_components.vImg, ]} */ ;
            // @ts-ignore
            const __VLS_54 = __VLS_asFunctionalComponent(__VLS_53, new __VLS_53({
                src: "https://assets.drunagor.app/CampaignTracker/AwakComapanion.webp",
                cover: true,
                ...{ class: "w-100 h-100" },
            }));
            const __VLS_55 = __VLS_54({
                src: "https://assets.drunagor.app/CampaignTracker/AwakComapanion.webp",
                cover: true,
                ...{ class: "w-100 h-100" },
            }, ...__VLS_functionalComponentArgsRest(__VLS_54));
        }
        else if (item.raw.value === 'underkeep') {
            const __VLS_57 = {}.VImg;
            /** @type {[typeof __VLS_components.VImg, typeof __VLS_components.vImg, typeof __VLS_components.VImg, typeof __VLS_components.vImg, ]} */ ;
            // @ts-ignore
            const __VLS_58 = __VLS_asFunctionalComponent(__VLS_57, new __VLS_57({
                src: "@/assets/underkeep.png",
                cover: true,
                ...{ class: "w-100 h-100" },
            }));
            const __VLS_59 = __VLS_58({
                src: "@/assets/underkeep.png",
                cover: true,
                ...{ class: "w-100 h-100" },
            }, ...__VLS_functionalComponentArgsRest(__VLS_58));
        }
        else if (item.raw.value === 'underkeep2') {
            const __VLS_61 = {}.VImg;
            /** @type {[typeof __VLS_components.VImg, typeof __VLS_components.vImg, typeof __VLS_components.VImg, typeof __VLS_components.vImg, ]} */ ;
            // @ts-ignore
            const __VLS_62 = __VLS_asFunctionalComponent(__VLS_61, new __VLS_61({
                src: "@/assets/underkeep2.png",
                cover: true,
                ...{ class: "w-100 h-100" },
            }));
            const __VLS_63 = __VLS_62({
                src: "@/assets/underkeep2.png",
                cover: true,
                ...{ class: "w-100 h-100" },
            }, ...__VLS_functionalComponentArgsRest(__VLS_62));
        }
        else {
            const __VLS_65 = {}.VIcon;
            /** @type {[typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, ]} */ ;
            // @ts-ignore
            const __VLS_66 = __VLS_asFunctionalComponent(__VLS_65, new __VLS_65({
                ...{ class: "w-100 h-100 d-flex align-center justify-center" },
            }));
            const __VLS_67 = __VLS_66({
                ...{ class: "w-100 h-100 d-flex align-center justify-center" },
            }, ...__VLS_functionalComponentArgsRest(__VLS_66));
            __VLS_68.slots.default;
            var __VLS_68;
        }
    }
    var __VLS_44;
}
var __VLS_40;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "d-flex flex-wrap align-center ga-4" },
});
const __VLS_69 = {}.VCheckbox;
/** @type {[typeof __VLS_components.VCheckbox, typeof __VLS_components.vCheckbox, typeof __VLS_components.VCheckbox, typeof __VLS_components.vCheckbox, ]} */ ;
// @ts-ignore
const __VLS_70 = __VLS_asFunctionalComponent(__VLS_69, new __VLS_69({
    modelValue: (__VLS_ctx.showOnlyFinished),
    label: "Only Finished",
    color: "red-darken-2",
    hideDetails: true,
    ...{ class: "flex-grow-0" },
}));
const __VLS_71 = __VLS_70({
    modelValue: (__VLS_ctx.showOnlyFinished),
    label: "Only Finished",
    color: "red-darken-2",
    hideDetails: true,
    ...{ class: "flex-grow-0" },
}, ...__VLS_functionalComponentArgsRest(__VLS_70));
const __VLS_73 = {}.VSelect;
/** @type {[typeof __VLS_components.VSelect, typeof __VLS_components.vSelect, typeof __VLS_components.VSelect, typeof __VLS_components.vSelect, ]} */ ;
// @ts-ignore
const __VLS_74 = __VLS_asFunctionalComponent(__VLS_73, new __VLS_73({
    modelValue: (__VLS_ctx.sortOrder),
    items: ([{ title: 'Newest First', value: 'desc' }, { title: 'Oldest First', value: 'asc' }]),
    label: "Sort By",
    variant: "outlined",
    density: "compact",
    hideDetails: true,
    ...{ style: {} },
}));
const __VLS_75 = __VLS_74({
    modelValue: (__VLS_ctx.sortOrder),
    items: ([{ title: 'Newest First', value: 'desc' }, { title: 'Oldest First', value: 'asc' }]),
    label: "Sort By",
    variant: "outlined",
    density: "compact",
    hideDetails: true,
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_74));
var __VLS_36;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    id: "campaigns",
    ...{ class: "grid gap-4 pt-4 place-items-center" },
});
if (__VLS_ctx.loading) {
    const __VLS_77 = {}.VRow;
    /** @type {[typeof __VLS_components.VRow, typeof __VLS_components.vRow, typeof __VLS_components.VRow, typeof __VLS_components.vRow, ]} */ ;
    // @ts-ignore
    const __VLS_78 = __VLS_asFunctionalComponent(__VLS_77, new __VLS_77({
        ...{ class: "justify-center" },
        noGutters: true,
    }));
    const __VLS_79 = __VLS_78({
        ...{ class: "justify-center" },
        noGutters: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_78));
    __VLS_80.slots.default;
    const __VLS_81 = {}.VCard;
    /** @type {[typeof __VLS_components.VCard, typeof __VLS_components.vCard, typeof __VLS_components.VCard, typeof __VLS_components.vCard, ]} */ ;
    // @ts-ignore
    const __VLS_82 = __VLS_asFunctionalComponent(__VLS_81, new __VLS_81({
        width: "100%",
        ...{ class: "d-flex justify-center pa-16" },
    }));
    const __VLS_83 = __VLS_82({
        width: "100%",
        ...{ class: "d-flex justify-center pa-16" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_82));
    __VLS_84.slots.default;
    const __VLS_85 = {}.VProgressCircular;
    /** @type {[typeof __VLS_components.VProgressCircular, typeof __VLS_components.vProgressCircular, typeof __VLS_components.VProgressCircular, typeof __VLS_components.vProgressCircular, ]} */ ;
    // @ts-ignore
    const __VLS_86 = __VLS_asFunctionalComponent(__VLS_85, new __VLS_85({
        indeterminate: true,
        size: (80),
        width: (7),
        color: "primary",
    }));
    const __VLS_87 = __VLS_86({
        indeterminate: true,
        size: (80),
        width: (7),
        color: "primary",
    }, ...__VLS_functionalComponentArgsRest(__VLS_86));
    var __VLS_84;
    var __VLS_80;
}
else {
    const __VLS_89 = {}.VRow;
    /** @type {[typeof __VLS_components.VRow, typeof __VLS_components.vRow, typeof __VLS_components.VRow, typeof __VLS_components.vRow, ]} */ ;
    // @ts-ignore
    const __VLS_90 = __VLS_asFunctionalComponent(__VLS_89, new __VLS_89({
        noGutters: true,
    }));
    const __VLS_91 = __VLS_90({
        noGutters: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_90));
    __VLS_92.slots.default;
    for (const [campaign] of __VLS_getVForSourceType((__VLS_ctx.allCampaigns))) {
        const __VLS_93 = {}.VCol;
        /** @type {[typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ]} */ ;
        // @ts-ignore
        const __VLS_94 = __VLS_asFunctionalComponent(__VLS_93, new __VLS_93({
            cols: "12",
            ...{ class: "py-3" },
            key: (campaign.campaignId),
        }));
        const __VLS_95 = __VLS_94({
            cols: "12",
            ...{ class: "py-3" },
            key: (campaign.campaignId),
        }, ...__VLS_functionalComponentArgsRest(__VLS_94));
        __VLS_96.slots.default;
        const __VLS_97 = {}.VCard;
        /** @type {[typeof __VLS_components.VCard, typeof __VLS_components.vCard, typeof __VLS_components.VCard, typeof __VLS_components.vCard, ]} */ ;
        // @ts-ignore
        const __VLS_98 = __VLS_asFunctionalComponent(__VLS_97, new __VLS_97({
            ...{ 'onClick': {} },
            color: "primary",
            elevation: "16",
            width: "100%",
            ...{ class: "transition-swing" },
            ...{ style: {} },
        }));
        const __VLS_99 = __VLS_98({
            ...{ 'onClick': {} },
            color: "primary",
            elevation: "16",
            width: "100%",
            ...{ class: "transition-swing" },
            ...{ style: {} },
        }, ...__VLS_functionalComponentArgsRest(__VLS_98));
        let __VLS_101;
        let __VLS_102;
        let __VLS_103;
        const __VLS_104 = {
            onClick: (...[$event]) => {
                if (!!(__VLS_ctx.loading))
                    return;
                __VLS_ctx.goToCampaign(campaign);
            }
        };
        __VLS_100.slots.default;
        if (campaign.campaign === 'core') {
            const __VLS_105 = {}.VImg;
            /** @type {[typeof __VLS_components.VImg, typeof __VLS_components.vImg, typeof __VLS_components.VImg, typeof __VLS_components.vImg, ]} */ ;
            // @ts-ignore
            const __VLS_106 = __VLS_asFunctionalComponent(__VLS_105, new __VLS_105({
                src: "https://assets.drunagor.app/CampaignTracker/CoreCompanion.webp",
                maxHeight: "200",
                cover: true,
            }));
            const __VLS_107 = __VLS_106({
                src: "https://assets.drunagor.app/CampaignTracker/CoreCompanion.webp",
                maxHeight: "200",
                cover: true,
            }, ...__VLS_functionalComponentArgsRest(__VLS_106));
        }
        else if (campaign.campaign === 'apocalypse') {
            const __VLS_109 = {}.VImg;
            /** @type {[typeof __VLS_components.VImg, typeof __VLS_components.vImg, typeof __VLS_components.VImg, typeof __VLS_components.vImg, ]} */ ;
            // @ts-ignore
            const __VLS_110 = __VLS_asFunctionalComponent(__VLS_109, new __VLS_109({
                src: "https://assets.drunagor.app/CampaignTracker/ApocCompanion.webp",
                maxHeight: "200",
                cover: true,
            }));
            const __VLS_111 = __VLS_110({
                src: "https://assets.drunagor.app/CampaignTracker/ApocCompanion.webp",
                maxHeight: "200",
                cover: true,
            }, ...__VLS_functionalComponentArgsRest(__VLS_110));
        }
        else if (campaign.campaign === 'awakenings') {
            const __VLS_113 = {}.VImg;
            /** @type {[typeof __VLS_components.VImg, typeof __VLS_components.vImg, typeof __VLS_components.VImg, typeof __VLS_components.vImg, ]} */ ;
            // @ts-ignore
            const __VLS_114 = __VLS_asFunctionalComponent(__VLS_113, new __VLS_113({
                src: "https://assets.drunagor.app/CampaignTracker/AwakComapanion.webp",
                maxHeight: "200",
                cover: true,
            }));
            const __VLS_115 = __VLS_114({
                src: "https://assets.drunagor.app/CampaignTracker/AwakComapanion.webp",
                maxHeight: "200",
                cover: true,
            }, ...__VLS_functionalComponentArgsRest(__VLS_114));
        }
        else if (campaign.campaign === 'underkeep') {
            const __VLS_117 = {}.VImg;
            /** @type {[typeof __VLS_components.VImg, typeof __VLS_components.vImg, typeof __VLS_components.VImg, typeof __VLS_components.vImg, ]} */ ;
            // @ts-ignore
            const __VLS_118 = __VLS_asFunctionalComponent(__VLS_117, new __VLS_117({
                src: "@/assets/underkeep.png",
                maxHeight: "200",
                cover: true,
            }));
            const __VLS_119 = __VLS_118({
                src: "@/assets/underkeep.png",
                maxHeight: "200",
                cover: true,
            }, ...__VLS_functionalComponentArgsRest(__VLS_118));
        }
        else if (campaign.campaign === 'underkeep2') {
            const __VLS_121 = {}.VImg;
            /** @type {[typeof __VLS_components.VImg, typeof __VLS_components.vImg, typeof __VLS_components.VImg, typeof __VLS_components.vImg, ]} */ ;
            // @ts-ignore
            const __VLS_122 = __VLS_asFunctionalComponent(__VLS_121, new __VLS_121({
                src: "@/assets/underkeep2.png",
                maxHeight: "200",
                cover: true,
            }));
            const __VLS_123 = __VLS_122({
                src: "@/assets/underkeep2.png",
                maxHeight: "200",
                cover: true,
            }, ...__VLS_functionalComponentArgsRest(__VLS_122));
        }
        const __VLS_125 = {}.VCardTitle;
        /** @type {[typeof __VLS_components.VCardTitle, typeof __VLS_components.vCardTitle, typeof __VLS_components.VCardTitle, typeof __VLS_components.vCardTitle, ]} */ ;
        // @ts-ignore
        const __VLS_126 = __VLS_asFunctionalComponent(__VLS_125, new __VLS_125({
            ...{ class: "d-flex flex-column text-uppercase pb-1" },
        }));
        const __VLS_127 = __VLS_126({
            ...{ class: "d-flex flex-column text-uppercase pb-1" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_126));
        __VLS_128.slots.default;
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "d-flex justify-space-between align-center w-100" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ class: "text-h5 font-weight-bold mb-0 text-truncate" },
        });
        (campaign.name || "Unnamed Campaign");
        if (__VLS_ctx.isUnderkeep(campaign.campaign) && __VLS_ctx.extraCampaignData[campaign.campaignId]?.isFinished) {
            const __VLS_129 = {}.VChip;
            /** @type {[typeof __VLS_components.VChip, typeof __VLS_components.vChip, typeof __VLS_components.VChip, typeof __VLS_components.vChip, ]} */ ;
            // @ts-ignore
            const __VLS_130 = __VLS_asFunctionalComponent(__VLS_129, new __VLS_129({
                color: "red-darken-4",
                size: "small",
                variant: "flat",
                ...{ class: "font-weight-bold ml-2" },
            }));
            const __VLS_131 = __VLS_130({
                color: "red-darken-4",
                size: "small",
                variant: "flat",
                ...{ class: "font-weight-bold ml-2" },
            }, ...__VLS_functionalComponentArgsRest(__VLS_130));
            __VLS_132.slots.default;
            var __VLS_132;
        }
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "d-flex align-center text-subtitle-1 mt-0 w-100" },
        });
        if (campaign.wing) {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
            (__VLS_ctx.formatWingName(campaign.wing));
        }
        if (__VLS_ctx.isUnderkeep(campaign.campaign) && __VLS_ctx.extraCampaignData[campaign.campaignId]?.lastDoorName) {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
                ...{ class: "ml-2" },
            });
            __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
                ...{ class: "text-white font-weight-bold" },
            });
            (__VLS_ctx.extraCampaignData[campaign.campaignId].lastDoorName);
        }
        if (__VLS_ctx.isUnderkeep(campaign.campaign)) {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
                ...{ class: "ml-auto text-amber-accent-2 font-weight-bold text-subtitle-2" },
            });
            (__VLS_ctx.calculateCompletionPercentage(campaign));
        }
        var __VLS_128;
        if (__VLS_ctx.isUnderkeep(campaign.campaign)) {
            const __VLS_133 = {}.VProgressLinear;
            /** @type {[typeof __VLS_components.VProgressLinear, typeof __VLS_components.vProgressLinear, typeof __VLS_components.VProgressLinear, typeof __VLS_components.vProgressLinear, ]} */ ;
            // @ts-ignore
            const __VLS_134 = __VLS_asFunctionalComponent(__VLS_133, new __VLS_133({
                modelValue: (__VLS_ctx.calculateCompletionPercentage(campaign)),
                color: "amber-accent-2",
                height: "3",
                ...{ class: "mb-0" },
            }));
            const __VLS_135 = __VLS_134({
                modelValue: (__VLS_ctx.calculateCompletionPercentage(campaign)),
                color: "amber-accent-2",
                height: "3",
                ...{ class: "mb-0" },
            }, ...__VLS_functionalComponentArgsRest(__VLS_134));
        }
        if (__VLS_ctx.isUnderkeep(campaign.campaign) && __VLS_ctx.extraCampaignData[campaign.campaignId]) {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: "mt-1 px-3 pt-0 pb-0" },
            });
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: "d-flex flex-wrap align-end mt-0 standees-list-container" },
            });
            for (const [player] of __VLS_getVForSourceType((__VLS_ctx.extraCampaignData[campaign.campaignId].players))) {
                __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                    key: (player.rl_campaigns_users_pk),
                    ...{ class: "d-flex flex-column align-center text-center player-standee-container" },
                });
                __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                    ...{ class: "hero-standee-card" },
                });
                if (__VLS_ctx.getPlayerHero(campaign.campaignId, player.playable_heroes_fk)) {
                    const __VLS_137 = {}.VImg;
                    /** @type {[typeof __VLS_components.VImg, typeof __VLS_components.vImg, typeof __VLS_components.VImg, typeof __VLS_components.vImg, ]} */ ;
                    // @ts-ignore
                    const __VLS_138 = __VLS_asFunctionalComponent(__VLS_137, new __VLS_137({
                        src: (__VLS_ctx.getPlayerHero(campaign.campaignId, player.playable_heroes_fk).images.avatar),
                        cover: true,
                        ...{ class: "w-100 h-100" },
                    }));
                    const __VLS_139 = __VLS_138({
                        src: (__VLS_ctx.getPlayerHero(campaign.campaignId, player.playable_heroes_fk).images.avatar),
                        cover: true,
                        ...{ class: "w-100 h-100" },
                    }, ...__VLS_functionalComponentArgsRest(__VLS_138));
                }
                else {
                    const __VLS_141 = {}.VIcon;
                    /** @type {[typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, ]} */ ;
                    // @ts-ignore
                    const __VLS_142 = __VLS_asFunctionalComponent(__VLS_141, new __VLS_141({
                        size: "large",
                        color: "grey",
                        ...{ class: "ma-auto" },
                    }));
                    const __VLS_143 = __VLS_142({
                        size: "large",
                        color: "grey",
                        ...{ class: "ma-auto" },
                    }, ...__VLS_functionalComponentArgsRest(__VLS_142));
                    __VLS_144.slots.default;
                    var __VLS_144;
                }
                __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                    ...{ class: "player-name-overlay" },
                });
                __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
                    ...{ class: "player-name-text" },
                });
                (player.user_name);
            }
            if (__VLS_ctx.extraCampaignData[campaign.campaignId].players.length === 0) {
                __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
                    ...{ class: "text-caption text-grey font-italic pb-3" },
                });
            }
        }
        else {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: "mt-1 px-3 pt-0 pb-0" },
            });
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: "d-flex flex-wrap align-end mt-0 standees-list-container" },
            });
            for (const [hero] of __VLS_getVForSourceType((__VLS_ctx.heroAvatars(campaign.campaignId)))) {
                __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                    key: (hero.heroId),
                    ...{ class: "d-flex flex-column align-center text-center player-standee-container" },
                });
                __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                    ...{ class: "hero-standee-card" },
                });
                const __VLS_145 = {}.VImg;
                /** @type {[typeof __VLS_components.VImg, typeof __VLS_components.vImg, typeof __VLS_components.VImg, typeof __VLS_components.vImg, ]} */ ;
                // @ts-ignore
                const __VLS_146 = __VLS_asFunctionalComponent(__VLS_145, new __VLS_145({
                    src: (hero.images.avatar),
                    cover: true,
                    ...{ class: "w-100 h-100" },
                }));
                const __VLS_147 = __VLS_146({
                    src: (hero.images.avatar),
                    cover: true,
                    ...{ class: "w-100 h-100" },
                }, ...__VLS_functionalComponentArgsRest(__VLS_146));
            }
        }
        var __VLS_100;
        var __VLS_96;
    }
    var __VLS_92;
}
const __VLS_149 = {}.VDialog;
/** @type {[typeof __VLS_components.VDialog, typeof __VLS_components.vDialog, typeof __VLS_components.VDialog, typeof __VLS_components.vDialog, ]} */ ;
// @ts-ignore
const __VLS_150 = __VLS_asFunctionalComponent(__VLS_149, new __VLS_149({
    modelValue: (__VLS_ctx.showJoinCampaignDialog),
    maxWidth: "400",
    persistent: true,
}));
const __VLS_151 = __VLS_150({
    modelValue: (__VLS_ctx.showJoinCampaignDialog),
    maxWidth: "400",
    persistent: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_150));
__VLS_152.slots.default;
const __VLS_153 = {}.VCard;
/** @type {[typeof __VLS_components.VCard, typeof __VLS_components.vCard, typeof __VLS_components.VCard, typeof __VLS_components.vCard, ]} */ ;
// @ts-ignore
const __VLS_154 = __VLS_asFunctionalComponent(__VLS_153, new __VLS_153({
    ...{ style: {} },
}));
const __VLS_155 = __VLS_154({
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_154));
__VLS_156.slots.default;
if (__VLS_ctx.joiningCampaign) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "dialog-overlay" },
    });
    const __VLS_157 = {}.VProgressCircular;
    /** @type {[typeof __VLS_components.VProgressCircular, typeof __VLS_components.vProgressCircular, typeof __VLS_components.VProgressCircular, typeof __VLS_components.vProgressCircular, ]} */ ;
    // @ts-ignore
    const __VLS_158 = __VLS_asFunctionalComponent(__VLS_157, new __VLS_157({
        indeterminate: true,
        size: "80",
        width: "7",
        color: "primary",
    }));
    const __VLS_159 = __VLS_158({
        indeterminate: true,
        size: "80",
        width: "7",
        color: "primary",
    }, ...__VLS_functionalComponentArgsRest(__VLS_158));
}
const __VLS_161 = {}.VCardTitle;
/** @type {[typeof __VLS_components.VCardTitle, typeof __VLS_components.vCardTitle, typeof __VLS_components.VCardTitle, typeof __VLS_components.vCardTitle, ]} */ ;
// @ts-ignore
const __VLS_162 = __VLS_asFunctionalComponent(__VLS_161, new __VLS_161({
    ...{ class: "d-flex justify-space-between align-center pa-0" },
}));
const __VLS_163 = __VLS_162({
    ...{ class: "d-flex justify-space-between align-center pa-0" },
}, ...__VLS_functionalComponentArgsRest(__VLS_162));
__VLS_164.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "text-h6 ml-4" },
});
const __VLS_165 = {}.VCardActions;
/** @type {[typeof __VLS_components.VCardActions, typeof __VLS_components.vCardActions, typeof __VLS_components.VCardActions, typeof __VLS_components.vCardActions, ]} */ ;
// @ts-ignore
const __VLS_166 = __VLS_asFunctionalComponent(__VLS_165, new __VLS_165({
    ...{ class: "pa-0" },
}));
const __VLS_167 = __VLS_166({
    ...{ class: "pa-0" },
}, ...__VLS_functionalComponentArgsRest(__VLS_166));
__VLS_168.slots.default;
const __VLS_169 = {}.VBtn;
/** @type {[typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ]} */ ;
// @ts-ignore
const __VLS_170 = __VLS_asFunctionalComponent(__VLS_169, new __VLS_169({
    ...{ 'onClick': {} },
    icon: true,
}));
const __VLS_171 = __VLS_170({
    ...{ 'onClick': {} },
    icon: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_170));
let __VLS_173;
let __VLS_174;
let __VLS_175;
const __VLS_176 = {
    onClick: (...[$event]) => {
        __VLS_ctx.showJoinCampaignDialog = false;
    }
};
__VLS_172.slots.default;
const __VLS_177 = {}.VIcon;
/** @type {[typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, ]} */ ;
// @ts-ignore
const __VLS_178 = __VLS_asFunctionalComponent(__VLS_177, new __VLS_177({
    color: "red",
}));
const __VLS_179 = __VLS_178({
    color: "red",
}, ...__VLS_functionalComponentArgsRest(__VLS_178));
__VLS_180.slots.default;
var __VLS_180;
var __VLS_172;
var __VLS_168;
var __VLS_164;
const __VLS_181 = {}.VCardText;
/** @type {[typeof __VLS_components.VCardText, typeof __VLS_components.vCardText, typeof __VLS_components.VCardText, typeof __VLS_components.vCardText, ]} */ ;
// @ts-ignore
const __VLS_182 = __VLS_asFunctionalComponent(__VLS_181, new __VLS_181({}));
const __VLS_183 = __VLS_182({}, ...__VLS_functionalComponentArgsRest(__VLS_182));
__VLS_184.slots.default;
const __VLS_185 = {}.VTextField;
/** @type {[typeof __VLS_components.VTextField, typeof __VLS_components.vTextField, typeof __VLS_components.VTextField, typeof __VLS_components.vTextField, ]} */ ;
// @ts-ignore
const __VLS_186 = __VLS_asFunctionalComponent(__VLS_185, new __VLS_185({
    modelValue: (__VLS_ctx.joinCampaignId),
    label: "Campaign ID",
    hideDetails: true,
    dense: true,
}));
const __VLS_187 = __VLS_186({
    modelValue: (__VLS_ctx.joinCampaignId),
    label: "Campaign ID",
    hideDetails: true,
    dense: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_186));
var __VLS_184;
const __VLS_189 = {}.VCardActions;
/** @type {[typeof __VLS_components.VCardActions, typeof __VLS_components.vCardActions, typeof __VLS_components.VCardActions, typeof __VLS_components.vCardActions, ]} */ ;
// @ts-ignore
const __VLS_190 = __VLS_asFunctionalComponent(__VLS_189, new __VLS_189({}));
const __VLS_191 = __VLS_190({}, ...__VLS_functionalComponentArgsRest(__VLS_190));
__VLS_192.slots.default;
const __VLS_193 = {}.VBtn;
/** @type {[typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ]} */ ;
// @ts-ignore
const __VLS_194 = __VLS_asFunctionalComponent(__VLS_193, new __VLS_193({
    ...{ 'onClick': {} },
    block: true,
    color: "green",
    elevation: "4",
    ...{ class: "mt-4" },
    disabled: (!__VLS_ctx.parsedCampaignFk),
}));
const __VLS_195 = __VLS_194({
    ...{ 'onClick': {} },
    block: true,
    color: "green",
    elevation: "4",
    ...{ class: "mt-4" },
    disabled: (!__VLS_ctx.parsedCampaignFk),
}, ...__VLS_functionalComponentArgsRest(__VLS_194));
let __VLS_197;
let __VLS_198;
let __VLS_199;
const __VLS_200 = {
    onClick: (__VLS_ctx.confirmJoinCampaign)
};
__VLS_196.slots.default;
var __VLS_196;
var __VLS_192;
var __VLS_156;
var __VLS_152;
const __VLS_201 = {}.VDialog;
/** @type {[typeof __VLS_components.VDialog, typeof __VLS_components.vDialog, typeof __VLS_components.VDialog, typeof __VLS_components.vDialog, ]} */ ;
// @ts-ignore
const __VLS_202 = __VLS_asFunctionalComponent(__VLS_201, new __VLS_201({
    modelValue: (__VLS_ctx.showPlayDialog),
    maxWidth: "500",
    scrollable: true,
}));
const __VLS_203 = __VLS_202({
    modelValue: (__VLS_ctx.showPlayDialog),
    maxWidth: "500",
    scrollable: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_202));
__VLS_204.slots.default;
const __VLS_205 = {}.VCard;
/** @type {[typeof __VLS_components.VCard, typeof __VLS_components.vCard, typeof __VLS_components.VCard, typeof __VLS_components.vCard, ]} */ ;
// @ts-ignore
const __VLS_206 = __VLS_asFunctionalComponent(__VLS_205, new __VLS_205({
    color: "grey-darken-4",
    rounded: "xl",
    maxHeight: "90vh",
    ...{ class: "adventure-choice-card" },
}));
const __VLS_207 = __VLS_206({
    color: "grey-darken-4",
    rounded: "xl",
    maxHeight: "90vh",
    ...{ class: "adventure-choice-card" },
}, ...__VLS_functionalComponentArgsRest(__VLS_206));
__VLS_208.slots.default;
const __VLS_209 = {}.VCardTitle;
/** @type {[typeof __VLS_components.VCardTitle, typeof __VLS_components.vCardTitle, typeof __VLS_components.VCardTitle, typeof __VLS_components.vCardTitle, ]} */ ;
// @ts-ignore
const __VLS_210 = __VLS_asFunctionalComponent(__VLS_209, new __VLS_209({
    ...{ class: "d-flex justify-space-between align-center px-4 pt-4 pb-2" },
}));
const __VLS_211 = __VLS_210({
    ...{ class: "d-flex justify-space-between align-center px-4 pt-4 pb-2" },
}, ...__VLS_functionalComponentArgsRest(__VLS_210));
__VLS_212.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "text-h5 font-weight-bold text-white" },
});
const __VLS_213 = {}.VBtn;
/** @type {[typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ]} */ ;
// @ts-ignore
const __VLS_214 = __VLS_asFunctionalComponent(__VLS_213, new __VLS_213({
    ...{ 'onClick': {} },
    icon: true,
    variant: "text",
    color: "white",
}));
const __VLS_215 = __VLS_214({
    ...{ 'onClick': {} },
    icon: true,
    variant: "text",
    color: "white",
}, ...__VLS_functionalComponentArgsRest(__VLS_214));
let __VLS_217;
let __VLS_218;
let __VLS_219;
const __VLS_220 = {
    onClick: (...[$event]) => {
        __VLS_ctx.showPlayDialog = false;
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
var __VLS_216;
var __VLS_212;
const __VLS_225 = {}.VCardText;
/** @type {[typeof __VLS_components.VCardText, typeof __VLS_components.vCardText, typeof __VLS_components.VCardText, typeof __VLS_components.vCardText, ]} */ ;
// @ts-ignore
const __VLS_226 = __VLS_asFunctionalComponent(__VLS_225, new __VLS_225({
    ...{ class: "pa-0" },
    ...{ style: {} },
}));
const __VLS_227 = __VLS_226({
    ...{ class: "pa-0" },
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_226));
__VLS_228.slots.default;
const __VLS_229 = {}.VWindow;
/** @type {[typeof __VLS_components.VWindow, typeof __VLS_components.vWindow, typeof __VLS_components.VWindow, typeof __VLS_components.vWindow, ]} */ ;
// @ts-ignore
const __VLS_230 = __VLS_asFunctionalComponent(__VLS_229, new __VLS_229({
    modelValue: (__VLS_ctx.activePlayTab),
}));
const __VLS_231 = __VLS_230({
    modelValue: (__VLS_ctx.activePlayTab),
}, ...__VLS_functionalComponentArgsRest(__VLS_230));
__VLS_232.slots.default;
const __VLS_233 = {}.VWindowItem;
/** @type {[typeof __VLS_components.VWindowItem, typeof __VLS_components.vWindowItem, typeof __VLS_components.VWindowItem, typeof __VLS_components.vWindowItem, ]} */ ;
// @ts-ignore
const __VLS_234 = __VLS_asFunctionalComponent(__VLS_233, new __VLS_233({
    value: (0),
}));
const __VLS_235 = __VLS_234({
    value: (0),
}, ...__VLS_functionalComponentArgsRest(__VLS_234));
__VLS_236.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "pa-5 text-center" },
});
const __VLS_237 = {}.VImg;
/** @type {[typeof __VLS_components.VImg, typeof __VLS_components.vImg, typeof __VLS_components.VImg, typeof __VLS_components.vImg, ]} */ ;
// @ts-ignore
const __VLS_238 = __VLS_asFunctionalComponent(__VLS_237, new __VLS_237({
    src: "@/assets/underkeep.png",
    height: "140",
    cover: true,
    ...{ class: "mb-4 rounded-xl elevation-4" },
}));
const __VLS_239 = __VLS_238({
    src: "@/assets/underkeep.png",
    height: "140",
    cover: true,
    ...{ class: "mb-4 rounded-xl elevation-4" },
}, ...__VLS_functionalComponentArgsRest(__VLS_238));
__VLS_asFunctionalElement(__VLS_intrinsicElements.h3, __VLS_intrinsicElements.h3)({
    ...{ class: "text-h5 font-weight-bold text-green-accent-3 mb-1" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
    ...{ class: "text-body-2 text-grey-lighten-1 mb-5 px-2" },
});
const __VLS_241 = {}.VBtn;
/** @type {[typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ]} */ ;
// @ts-ignore
const __VLS_242 = __VLS_asFunctionalComponent(__VLS_241, new __VLS_241({
    ...{ 'onClick': {} },
    color: "green-accent-3",
    variant: "flat",
    rounded: "pill",
    size: "x-large",
    block: true,
    ...{ class: "font-weight-black text-grey-darken-4" },
    prependIcon: "mdi-qrcode-scan",
}));
const __VLS_243 = __VLS_242({
    ...{ 'onClick': {} },
    color: "green-accent-3",
    variant: "flat",
    rounded: "pill",
    size: "x-large",
    block: true,
    ...{ class: "font-weight-black text-grey-darken-4" },
    prependIcon: "mdi-qrcode-scan",
}, ...__VLS_functionalComponentArgsRest(__VLS_242));
let __VLS_245;
let __VLS_246;
let __VLS_247;
const __VLS_248 = {
    onClick: (__VLS_ctx.playDrunagorNights)
};
__VLS_244.slots.default;
var __VLS_244;
const __VLS_249 = {}.VDivider;
/** @type {[typeof __VLS_components.VDivider, typeof __VLS_components.vDivider, typeof __VLS_components.VDivider, typeof __VLS_components.vDivider, ]} */ ;
// @ts-ignore
const __VLS_250 = __VLS_asFunctionalComponent(__VLS_249, new __VLS_249({
    ...{ class: "mx-6 border-opacity-50" },
    color: "grey",
}));
const __VLS_251 = __VLS_250({
    ...{ class: "mx-6 border-opacity-50" },
    color: "grey",
}, ...__VLS_functionalComponentArgsRest(__VLS_250));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "pa-5 text-center" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "legacy-cluster mb-6 mt-2" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "d-flex justify-center align-center ga-6 position-relative z-10" },
});
const __VLS_253 = {}.VImg;
/** @type {[typeof __VLS_components.VImg, typeof __VLS_components.vImg, typeof __VLS_components.VImg, typeof __VLS_components.vImg, ]} */ ;
// @ts-ignore
const __VLS_254 = __VLS_asFunctionalComponent(__VLS_253, new __VLS_253({
    src: (__VLS_ctx.CoreLogo),
    height: "70",
    maxWidth: "110",
    contain: true,
    ...{ class: "legacy-logo" },
}));
const __VLS_255 = __VLS_254({
    src: (__VLS_ctx.CoreLogo),
    height: "70",
    maxWidth: "110",
    contain: true,
    ...{ class: "legacy-logo" },
}, ...__VLS_functionalComponentArgsRest(__VLS_254));
const __VLS_257 = {}.VImg;
/** @type {[typeof __VLS_components.VImg, typeof __VLS_components.vImg, typeof __VLS_components.VImg, typeof __VLS_components.vImg, ]} */ ;
// @ts-ignore
const __VLS_258 = __VLS_asFunctionalComponent(__VLS_257, new __VLS_257({
    src: (__VLS_ctx.AwakeningsLogo),
    height: "70",
    maxWidth: "110",
    contain: true,
    ...{ class: "legacy-logo" },
}));
const __VLS_259 = __VLS_258({
    src: (__VLS_ctx.AwakeningsLogo),
    height: "70",
    maxWidth: "110",
    contain: true,
    ...{ class: "legacy-logo" },
}, ...__VLS_functionalComponentArgsRest(__VLS_258));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "d-flex justify-center align-center mt-n6 position-relative z-20" },
});
const __VLS_261 = {}.VImg;
/** @type {[typeof __VLS_components.VImg, typeof __VLS_components.vImg, typeof __VLS_components.VImg, typeof __VLS_components.vImg, ]} */ ;
// @ts-ignore
const __VLS_262 = __VLS_asFunctionalComponent(__VLS_261, new __VLS_261({
    src: (__VLS_ctx.ApocalypseLogo),
    height: "80",
    maxWidth: "130",
    contain: true,
    ...{ class: "legacy-logo apoc-logo" },
}));
const __VLS_263 = __VLS_262({
    src: (__VLS_ctx.ApocalypseLogo),
    height: "80",
    maxWidth: "130",
    contain: true,
    ...{ class: "legacy-logo apoc-logo" },
}, ...__VLS_functionalComponentArgsRest(__VLS_262));
__VLS_asFunctionalElement(__VLS_intrinsicElements.h3, __VLS_intrinsicElements.h3)({
    ...{ class: "text-h5 font-weight-bold text-amber-accent-2 mb-1" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
    ...{ class: "text-body-2 text-grey-lighten-1 mb-5 px-2" },
});
const __VLS_265 = {}.VBtn;
/** @type {[typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ]} */ ;
// @ts-ignore
const __VLS_266 = __VLS_asFunctionalComponent(__VLS_265, new __VLS_265({
    ...{ 'onClick': {} },
    color: "amber-accent-2",
    variant: "flat",
    rounded: "pill",
    size: "x-large",
    block: true,
    ...{ class: "font-weight-black text-grey-darken-4 text-uppercase" },
    prependIcon: "mdi-book-open-page-variant",
}));
const __VLS_267 = __VLS_266({
    ...{ 'onClick': {} },
    color: "amber-accent-2",
    variant: "flat",
    rounded: "pill",
    size: "x-large",
    block: true,
    ...{ class: "font-weight-black text-grey-darken-4 text-uppercase" },
    prependIcon: "mdi-book-open-page-variant",
}, ...__VLS_functionalComponentArgsRest(__VLS_266));
let __VLS_269;
let __VLS_270;
let __VLS_271;
const __VLS_272 = {
    onClick: (...[$event]) => {
        __VLS_ctx.activePlayTab = 1;
    }
};
__VLS_268.slots.default;
var __VLS_268;
var __VLS_236;
const __VLS_273 = {}.VWindowItem;
/** @type {[typeof __VLS_components.VWindowItem, typeof __VLS_components.vWindowItem, typeof __VLS_components.VWindowItem, typeof __VLS_components.vWindowItem, ]} */ ;
// @ts-ignore
const __VLS_274 = __VLS_asFunctionalComponent(__VLS_273, new __VLS_273({
    value: (1),
}));
const __VLS_275 = __VLS_274({
    value: (1),
}, ...__VLS_functionalComponentArgsRest(__VLS_274));
__VLS_276.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "pa-5 text-center" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "d-flex align-center justify-start mb-4" },
});
const __VLS_277 = {}.VBtn;
/** @type {[typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ]} */ ;
// @ts-ignore
const __VLS_278 = __VLS_asFunctionalComponent(__VLS_277, new __VLS_277({
    ...{ 'onClick': {} },
    variant: "text",
    color: "grey-lighten-1",
    density: "comfortable",
    ...{ class: "text-none" },
}));
const __VLS_279 = __VLS_278({
    ...{ 'onClick': {} },
    variant: "text",
    color: "grey-lighten-1",
    density: "comfortable",
    ...{ class: "text-none" },
}, ...__VLS_functionalComponentArgsRest(__VLS_278));
let __VLS_281;
let __VLS_282;
let __VLS_283;
const __VLS_284 = {
    onClick: (...[$event]) => {
        __VLS_ctx.activePlayTab = 0;
    }
};
__VLS_280.slots.default;
const __VLS_285 = {}.VIcon;
/** @type {[typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, ]} */ ;
// @ts-ignore
const __VLS_286 = __VLS_asFunctionalComponent(__VLS_285, new __VLS_285({
    start: true,
}));
const __VLS_287 = __VLS_286({
    start: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_286));
__VLS_288.slots.default;
var __VLS_288;
var __VLS_280;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "legacy-cluster mb-6 mt-2" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "d-flex justify-center align-center ga-6 position-relative z-10" },
});
const __VLS_289 = {}.VImg;
/** @type {[typeof __VLS_components.VImg, typeof __VLS_components.vImg, typeof __VLS_components.VImg, typeof __VLS_components.vImg, ]} */ ;
// @ts-ignore
const __VLS_290 = __VLS_asFunctionalComponent(__VLS_289, new __VLS_289({
    src: (__VLS_ctx.CoreLogo),
    height: "70",
    maxWidth: "110",
    contain: true,
    ...{ class: "legacy-logo" },
}));
const __VLS_291 = __VLS_290({
    src: (__VLS_ctx.CoreLogo),
    height: "70",
    maxWidth: "110",
    contain: true,
    ...{ class: "legacy-logo" },
}, ...__VLS_functionalComponentArgsRest(__VLS_290));
const __VLS_293 = {}.VImg;
/** @type {[typeof __VLS_components.VImg, typeof __VLS_components.vImg, typeof __VLS_components.VImg, typeof __VLS_components.vImg, ]} */ ;
// @ts-ignore
const __VLS_294 = __VLS_asFunctionalComponent(__VLS_293, new __VLS_293({
    src: (__VLS_ctx.AwakeningsLogo),
    height: "70",
    maxWidth: "110",
    contain: true,
    ...{ class: "legacy-logo" },
}));
const __VLS_295 = __VLS_294({
    src: (__VLS_ctx.AwakeningsLogo),
    height: "70",
    maxWidth: "110",
    contain: true,
    ...{ class: "legacy-logo" },
}, ...__VLS_functionalComponentArgsRest(__VLS_294));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "d-flex justify-center align-center mt-n6 position-relative z-20" },
});
const __VLS_297 = {}.VImg;
/** @type {[typeof __VLS_components.VImg, typeof __VLS_components.vImg, typeof __VLS_components.VImg, typeof __VLS_components.vImg, ]} */ ;
// @ts-ignore
const __VLS_298 = __VLS_asFunctionalComponent(__VLS_297, new __VLS_297({
    src: (__VLS_ctx.ApocalypseLogo),
    height: "80",
    maxWidth: "130",
    contain: true,
    ...{ class: "legacy-logo apoc-logo" },
}));
const __VLS_299 = __VLS_298({
    src: (__VLS_ctx.ApocalypseLogo),
    height: "80",
    maxWidth: "130",
    contain: true,
    ...{ class: "legacy-logo apoc-logo" },
}, ...__VLS_functionalComponentArgsRest(__VLS_298));
__VLS_asFunctionalElement(__VLS_intrinsicElements.h3, __VLS_intrinsicElements.h3)({
    ...{ class: "text-h5 font-weight-bold text-amber-accent-2 mb-2" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
    ...{ class: "text-body-2 text-grey-lighten-1 mb-6" },
});
const __VLS_301 = {}.VBtn;
/** @type {[typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ]} */ ;
// @ts-ignore
const __VLS_302 = __VLS_asFunctionalComponent(__VLS_301, new __VLS_301({
    ...{ 'onClick': {} },
    color: "amber-accent-2",
    variant: "flat",
    rounded: "pill",
    size: "x-large",
    block: true,
    ...{ class: "font-weight-black text-grey-darken-4 mb-3" },
    prependIcon: "mdi-plus",
}));
const __VLS_303 = __VLS_302({
    ...{ 'onClick': {} },
    color: "amber-accent-2",
    variant: "flat",
    rounded: "pill",
    size: "x-large",
    block: true,
    ...{ class: "font-weight-black text-grey-darken-4 mb-3" },
    prependIcon: "mdi-plus",
}, ...__VLS_functionalComponentArgsRest(__VLS_302));
let __VLS_305;
let __VLS_306;
let __VLS_307;
const __VLS_308 = {
    onClick: (__VLS_ctx.triggerNewCampaign)
};
__VLS_304.slots.default;
var __VLS_304;
const __VLS_309 = {}.VBtn;
/** @type {[typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ]} */ ;
// @ts-ignore
const __VLS_310 = __VLS_asFunctionalComponent(__VLS_309, new __VLS_309({
    ...{ 'onClick': {} },
    color: "amber-accent-2",
    variant: "flat",
    rounded: "pill",
    size: "x-large",
    block: true,
    ...{ class: "font-weight-black text-grey-darken-4 mb-3" },
    prependIcon: "mdi-account-plus",
}));
const __VLS_311 = __VLS_310({
    ...{ 'onClick': {} },
    color: "amber-accent-2",
    variant: "flat",
    rounded: "pill",
    size: "x-large",
    block: true,
    ...{ class: "font-weight-black text-grey-darken-4 mb-3" },
    prependIcon: "mdi-account-plus",
}, ...__VLS_functionalComponentArgsRest(__VLS_310));
let __VLS_313;
let __VLS_314;
let __VLS_315;
const __VLS_316 = {
    onClick: (__VLS_ctx.handleJoinCampaign)
};
__VLS_312.slots.default;
var __VLS_312;
const __VLS_317 = {}.VBtn;
/** @type {[typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ]} */ ;
// @ts-ignore
const __VLS_318 = __VLS_asFunctionalComponent(__VLS_317, new __VLS_317({
    ...{ 'onClick': {} },
    color: "amber-accent-2",
    variant: "outlined",
    rounded: "pill",
    size: "x-large",
    block: true,
    ...{ class: "font-weight-black mb-3" },
    prependIcon: "mdi-import",
}));
const __VLS_319 = __VLS_318({
    ...{ 'onClick': {} },
    color: "amber-accent-2",
    variant: "outlined",
    rounded: "pill",
    size: "x-large",
    block: true,
    ...{ class: "font-weight-black mb-3" },
    prependIcon: "mdi-import",
}, ...__VLS_functionalComponentArgsRest(__VLS_318));
let __VLS_321;
let __VLS_322;
let __VLS_323;
const __VLS_324 = {
    onClick: (__VLS_ctx.triggerImportCampaign)
};
__VLS_320.slots.default;
var __VLS_320;
var __VLS_276;
var __VLS_232;
var __VLS_228;
var __VLS_208;
var __VLS_204;
var __VLS_3;
/** @type {__VLS_StyleScopedClasses['pt-0']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-3']} */ ;
/** @type {__VLS_StyleScopedClasses['d-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-0']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['pt-0']} */ ;
/** @type {__VLS_StyleScopedClasses['font-weight-black']} */ ;
/** @type {__VLS_StyleScopedClasses['play-campaigns-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['w-100']} */ ;
/** @type {__VLS_StyleScopedClasses['text-uppercase']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-3']} */ ;
/** @type {__VLS_StyleScopedClasses['pa-3']} */ ;
/** @type {__VLS_StyleScopedClasses['elevation-0']} */ ;
/** @type {__VLS_StyleScopedClasses['d-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-column']} */ ;
/** @type {__VLS_StyleScopedClasses['ga-4']} */ ;
/** @type {__VLS_StyleScopedClasses['w-100']} */ ;
/** @type {__VLS_StyleScopedClasses['mr-3']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-grey-darken-4']} */ ;
/** @type {__VLS_StyleScopedClasses['w-100']} */ ;
/** @type {__VLS_StyleScopedClasses['h-100']} */ ;
/** @type {__VLS_StyleScopedClasses['w-100']} */ ;
/** @type {__VLS_StyleScopedClasses['h-100']} */ ;
/** @type {__VLS_StyleScopedClasses['w-100']} */ ;
/** @type {__VLS_StyleScopedClasses['h-100']} */ ;
/** @type {__VLS_StyleScopedClasses['w-100']} */ ;
/** @type {__VLS_StyleScopedClasses['h-100']} */ ;
/** @type {__VLS_StyleScopedClasses['w-100']} */ ;
/** @type {__VLS_StyleScopedClasses['h-100']} */ ;
/** @type {__VLS_StyleScopedClasses['w-100']} */ ;
/** @type {__VLS_StyleScopedClasses['h-100']} */ ;
/** @type {__VLS_StyleScopedClasses['d-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['align-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['d-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-wrap']} */ ;
/** @type {__VLS_StyleScopedClasses['align-center']} */ ;
/** @type {__VLS_StyleScopedClasses['ga-4']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-grow-0']} */ ;
/** @type {__VLS_StyleScopedClasses['grid']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-4']} */ ;
/** @type {__VLS_StyleScopedClasses['pt-4']} */ ;
/** @type {__VLS_StyleScopedClasses['place-items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['d-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['pa-16']} */ ;
/** @type {__VLS_StyleScopedClasses['py-3']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-swing']} */ ;
/** @type {__VLS_StyleScopedClasses['d-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-column']} */ ;
/** @type {__VLS_StyleScopedClasses['text-uppercase']} */ ;
/** @type {__VLS_StyleScopedClasses['pb-1']} */ ;
/** @type {__VLS_StyleScopedClasses['d-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-space-between']} */ ;
/** @type {__VLS_StyleScopedClasses['align-center']} */ ;
/** @type {__VLS_StyleScopedClasses['w-100']} */ ;
/** @type {__VLS_StyleScopedClasses['text-h5']} */ ;
/** @type {__VLS_StyleScopedClasses['font-weight-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-0']} */ ;
/** @type {__VLS_StyleScopedClasses['text-truncate']} */ ;
/** @type {__VLS_StyleScopedClasses['font-weight-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['ml-2']} */ ;
/** @type {__VLS_StyleScopedClasses['d-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['align-center']} */ ;
/** @type {__VLS_StyleScopedClasses['text-subtitle-1']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-0']} */ ;
/** @type {__VLS_StyleScopedClasses['w-100']} */ ;
/** @type {__VLS_StyleScopedClasses['ml-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['font-weight-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['ml-auto']} */ ;
/** @type {__VLS_StyleScopedClasses['text-amber-accent-2']} */ ;
/** @type {__VLS_StyleScopedClasses['font-weight-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-subtitle-2']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-0']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-1']} */ ;
/** @type {__VLS_StyleScopedClasses['px-3']} */ ;
/** @type {__VLS_StyleScopedClasses['pt-0']} */ ;
/** @type {__VLS_StyleScopedClasses['pb-0']} */ ;
/** @type {__VLS_StyleScopedClasses['d-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-wrap']} */ ;
/** @type {__VLS_StyleScopedClasses['align-end']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-0']} */ ;
/** @type {__VLS_StyleScopedClasses['standees-list-container']} */ ;
/** @type {__VLS_StyleScopedClasses['d-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-column']} */ ;
/** @type {__VLS_StyleScopedClasses['align-center']} */ ;
/** @type {__VLS_StyleScopedClasses['text-center']} */ ;
/** @type {__VLS_StyleScopedClasses['player-standee-container']} */ ;
/** @type {__VLS_StyleScopedClasses['hero-standee-card']} */ ;
/** @type {__VLS_StyleScopedClasses['w-100']} */ ;
/** @type {__VLS_StyleScopedClasses['h-100']} */ ;
/** @type {__VLS_StyleScopedClasses['ma-auto']} */ ;
/** @type {__VLS_StyleScopedClasses['player-name-overlay']} */ ;
/** @type {__VLS_StyleScopedClasses['player-name-text']} */ ;
/** @type {__VLS_StyleScopedClasses['text-caption']} */ ;
/** @type {__VLS_StyleScopedClasses['text-grey']} */ ;
/** @type {__VLS_StyleScopedClasses['font-italic']} */ ;
/** @type {__VLS_StyleScopedClasses['pb-3']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-1']} */ ;
/** @type {__VLS_StyleScopedClasses['px-3']} */ ;
/** @type {__VLS_StyleScopedClasses['pt-0']} */ ;
/** @type {__VLS_StyleScopedClasses['pb-0']} */ ;
/** @type {__VLS_StyleScopedClasses['d-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-wrap']} */ ;
/** @type {__VLS_StyleScopedClasses['align-end']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-0']} */ ;
/** @type {__VLS_StyleScopedClasses['standees-list-container']} */ ;
/** @type {__VLS_StyleScopedClasses['d-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-column']} */ ;
/** @type {__VLS_StyleScopedClasses['align-center']} */ ;
/** @type {__VLS_StyleScopedClasses['text-center']} */ ;
/** @type {__VLS_StyleScopedClasses['player-standee-container']} */ ;
/** @type {__VLS_StyleScopedClasses['hero-standee-card']} */ ;
/** @type {__VLS_StyleScopedClasses['w-100']} */ ;
/** @type {__VLS_StyleScopedClasses['h-100']} */ ;
/** @type {__VLS_StyleScopedClasses['dialog-overlay']} */ ;
/** @type {__VLS_StyleScopedClasses['d-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-space-between']} */ ;
/** @type {__VLS_StyleScopedClasses['align-center']} */ ;
/** @type {__VLS_StyleScopedClasses['pa-0']} */ ;
/** @type {__VLS_StyleScopedClasses['text-h6']} */ ;
/** @type {__VLS_StyleScopedClasses['ml-4']} */ ;
/** @type {__VLS_StyleScopedClasses['pa-0']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-4']} */ ;
/** @type {__VLS_StyleScopedClasses['adventure-choice-card']} */ ;
/** @type {__VLS_StyleScopedClasses['d-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-space-between']} */ ;
/** @type {__VLS_StyleScopedClasses['align-center']} */ ;
/** @type {__VLS_StyleScopedClasses['px-4']} */ ;
/** @type {__VLS_StyleScopedClasses['pt-4']} */ ;
/** @type {__VLS_StyleScopedClasses['pb-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-h5']} */ ;
/** @type {__VLS_StyleScopedClasses['font-weight-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['pa-0']} */ ;
/** @type {__VLS_StyleScopedClasses['pa-5']} */ ;
/** @type {__VLS_StyleScopedClasses['text-center']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-xl']} */ ;
/** @type {__VLS_StyleScopedClasses['elevation-4']} */ ;
/** @type {__VLS_StyleScopedClasses['text-h5']} */ ;
/** @type {__VLS_StyleScopedClasses['font-weight-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-green-accent-3']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-1']} */ ;
/** @type {__VLS_StyleScopedClasses['text-body-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-grey-lighten-1']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-5']} */ ;
/** @type {__VLS_StyleScopedClasses['px-2']} */ ;
/** @type {__VLS_StyleScopedClasses['font-weight-black']} */ ;
/** @type {__VLS_StyleScopedClasses['text-grey-darken-4']} */ ;
/** @type {__VLS_StyleScopedClasses['mx-6']} */ ;
/** @type {__VLS_StyleScopedClasses['border-opacity-50']} */ ;
/** @type {__VLS_StyleScopedClasses['pa-5']} */ ;
/** @type {__VLS_StyleScopedClasses['text-center']} */ ;
/** @type {__VLS_StyleScopedClasses['legacy-cluster']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-6']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-2']} */ ;
/** @type {__VLS_StyleScopedClasses['d-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['align-center']} */ ;
/** @type {__VLS_StyleScopedClasses['ga-6']} */ ;
/** @type {__VLS_StyleScopedClasses['position-relative']} */ ;
/** @type {__VLS_StyleScopedClasses['z-10']} */ ;
/** @type {__VLS_StyleScopedClasses['legacy-logo']} */ ;
/** @type {__VLS_StyleScopedClasses['legacy-logo']} */ ;
/** @type {__VLS_StyleScopedClasses['d-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['align-center']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-n6']} */ ;
/** @type {__VLS_StyleScopedClasses['position-relative']} */ ;
/** @type {__VLS_StyleScopedClasses['z-20']} */ ;
/** @type {__VLS_StyleScopedClasses['legacy-logo']} */ ;
/** @type {__VLS_StyleScopedClasses['apoc-logo']} */ ;
/** @type {__VLS_StyleScopedClasses['text-h5']} */ ;
/** @type {__VLS_StyleScopedClasses['font-weight-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-amber-accent-2']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-1']} */ ;
/** @type {__VLS_StyleScopedClasses['text-body-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-grey-lighten-1']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-5']} */ ;
/** @type {__VLS_StyleScopedClasses['px-2']} */ ;
/** @type {__VLS_StyleScopedClasses['font-weight-black']} */ ;
/** @type {__VLS_StyleScopedClasses['text-grey-darken-4']} */ ;
/** @type {__VLS_StyleScopedClasses['text-uppercase']} */ ;
/** @type {__VLS_StyleScopedClasses['pa-5']} */ ;
/** @type {__VLS_StyleScopedClasses['text-center']} */ ;
/** @type {__VLS_StyleScopedClasses['d-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['align-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-start']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['text-none']} */ ;
/** @type {__VLS_StyleScopedClasses['legacy-cluster']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-6']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-2']} */ ;
/** @type {__VLS_StyleScopedClasses['d-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['align-center']} */ ;
/** @type {__VLS_StyleScopedClasses['ga-6']} */ ;
/** @type {__VLS_StyleScopedClasses['position-relative']} */ ;
/** @type {__VLS_StyleScopedClasses['z-10']} */ ;
/** @type {__VLS_StyleScopedClasses['legacy-logo']} */ ;
/** @type {__VLS_StyleScopedClasses['legacy-logo']} */ ;
/** @type {__VLS_StyleScopedClasses['d-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['align-center']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-n6']} */ ;
/** @type {__VLS_StyleScopedClasses['position-relative']} */ ;
/** @type {__VLS_StyleScopedClasses['z-20']} */ ;
/** @type {__VLS_StyleScopedClasses['legacy-logo']} */ ;
/** @type {__VLS_StyleScopedClasses['apoc-logo']} */ ;
/** @type {__VLS_StyleScopedClasses['text-h5']} */ ;
/** @type {__VLS_StyleScopedClasses['font-weight-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-amber-accent-2']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-body-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-grey-lighten-1']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-6']} */ ;
/** @type {__VLS_StyleScopedClasses['font-weight-black']} */ ;
/** @type {__VLS_StyleScopedClasses['text-grey-darken-4']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-3']} */ ;
/** @type {__VLS_StyleScopedClasses['font-weight-black']} */ ;
/** @type {__VLS_StyleScopedClasses['text-grey-darken-4']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-3']} */ ;
/** @type {__VLS_StyleScopedClasses['font-weight-black']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-3']} */ ;
// @ts-ignore
var __VLS_16 = __VLS_15, __VLS_21 = __VLS_20;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            CampaignNew: CampaignNew,
            CampaignImport: CampaignImport,
            HUB: HUB,
            BaseAlert: BaseAlert,
            CoreLogo: CoreLogo,
            ApocalypseLogo: ApocalypseLogo,
            AwakeningsLogo: AwakeningsLogo,
            userStore: userStore,
            campaignNewRef: campaignNewRef,
            campaignImportRef: campaignImportRef,
            showPlayDialog: showPlayDialog,
            activePlayTab: activePlayTab,
            showHub: showHub,
            myEvents: myEvents,
            openPlayOptions: openPlayOptions,
            triggerNewCampaign: triggerNewCampaign,
            triggerImportCampaign: triggerImportCampaign,
            handleJoinCampaign: handleJoinCampaign,
            playDrunagorNights: playDrunagorNights,
            loading: loading,
            joiningCampaign: joiningCampaign,
            loadingErrors: loadingErrors,
            showJoinCampaignDialog: showJoinCampaignDialog,
            joinCampaignId: joinCampaignId,
            selectedBoxFilter: selectedBoxFilter,
            boxOptions: boxOptions,
            showOnlyFinished: showOnlyFinished,
            sortOrder: sortOrder,
            extraCampaignData: extraCampaignData,
            allCampaigns: allCampaigns,
            parsedCampaignFk: parsedCampaignFk,
            goToCampaign: goToCampaign,
            heroAvatars: heroAvatars,
            confirmJoinCampaign: confirmJoinCampaign,
            isUnderkeep: isUnderkeep,
            formatWingName: formatWingName,
            getPlayerHero: getPlayerHero,
            calculateCompletionPercentage: calculateCompletionPercentage,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
