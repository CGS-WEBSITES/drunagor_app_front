/// <reference types="../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import { ref, computed, watch, onMounted, onUnmounted, inject } from "vue";
import { useUserStore } from "@/store/UserStore";
import { useEventStore } from "@/store/EventStore";
import { CampaignStore } from "@/store/CampaignStore";
import { HeroStore } from "@/store/HeroStore";
import { useRouter, useRoute } from "vue-router";
import { useToast } from "primevue/usetoast";
import { useI18n } from "vue-i18n";
import { Campaign } from "@/store/Campaign";
import { useDebounceFn } from "@vueuse/core";
import BaseAlert from "@/components/Alerts/BaseAlert.vue";
import DashboardEvents from "@/components/DashboardEvents.vue";
import s1flag from "@/assets/s1flag.png";
import s2flag from "@/assets/s2flag.png";
import { extractMonth, extractDay, extractTime, formatEventDate, } from "@/utils/dateHelpers";
const router = useRouter();
const toast = useToast();
const { t } = useI18n();
const userStore = useUserStore();
const campaignStore = CampaignStore();
const heroStore = HeroStore();
const eventStore = useEventStore();
const route = useRoute();
const toastUser = useUserStore();
const loading = ref(true);
const activeTab = ref(1);
const events = ref([]);
const eventPk = ref(null);
const isEditable = ref(false);
const players = ref([]);
const currentPage = ref(1);
const statuses = ref([]);
const grantedStatus = ref(null);
const turnedAwayStatus = ref(null);
const selectedRewards = ref([]);
const dialog = ref(false);
const selectedEvent = ref(null);
const eventRewards = ref([]);
const alertType = ref("success");
const alertMessage = ref("");
const joinedEventPk = ref(null);
const sortBy = ref("date");
const playerFk = ref(null);
const showPast = ref(false);
const myEvents = ref([]);
const sceneries = ref([]);
const availableRewards = ref([
    {
        name: "Vorn Armor",
        image: "https://s3.us-east-2.amazonaws.com/assets.drunagor.app/Profile/vorn.png",
        description: "REWARD DESCRIPTION Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
    },
    {
        name: "Jaheen Shield",
        image: "https://s3.us-east-2.amazonaws.com/assets.drunagor.app/Profile/jaheen.png",
        description: "REWARD DESCRIPTION Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
    },
    {
        name: "Lorelai Kiss",
        image: "https://s3.us-east-2.amazonaws.com/assets.drunagor.app/Profile/lorelai.png",
        description: "REWARD DESCRIPTION Lorem Ipsum is simply dummy text of the printing and typesetting industrsy.",
    },
]);
const createEventDialog = ref(false);
const newEvent = ref({});
const stores = ref([]);
const editEventDialog = ref(false);
const editableEvent = ref({});
const myDialog = ref(false);
const selectedMyEvent = ref(null);
const showQuitConfirmDialog = ref(false);
const rlEventsUsersPkToQuit = ref(null);
const isRefreshingStatus = ref(false);
const showQuitSuccessAlert = ref(false);
const showQuitErrorAlert = ref(false);
const quitErrorMessage = ref("");
const sharedLink = ref("");
const showDialog = ref(false);
const showAlert = ref(false);
const showCampaignDialog = ref(false);
const showLoadDialog = ref(false);
const campaigns = ref([]);
const selectedLoadCampaign = ref(null);
const showJoinCampaignDialog = ref(false);
const joinCampaignId = ref("");
const joinCampaignLoading = ref(false);
const eventRefreshInterval = ref(null);
const BOX_ID = 38;
const rewardsCache = ref({});
const axios = inject("axios");
if (!axios) {
    throw new Error("Axios não foi injetado na aplicação.");
}
const getSeasonInfo = (fk) => {
    if (fk == 2) {
        return { flag: s1flag, name: "Season 1" };
    }
    if (fk == 3) {
        return { flag: s2flag, name: "Season 2" };
    }
    return { flag: null, name: "" };
};
const userTimezone = computed(() => userStore.user?.timezone?.iana_name ?? "America/Chicago");
const user = computed(() => userStore.user);
const boxSku = computed(() => route.query.sku || "");
const sortedEvents = computed(() => {
    if (sortBy.value === "date") {
        return events.value.sort((a, b) => new Date(a.date) - new Date(b.date));
    }
    return events.value;
});
const pageSize = 5;
const totalPages = computed(() => Math.ceil(players.value.length / pageSize));
const paginatedPlayers = computed(() => {
    const start = (currentPage.value - 1) * pageSize;
    return players.value.slice(start, start + pageSize);
});
const appUserPk = computed(() => {
    const raw = localStorage.getItem("app_user");
    return raw ? JSON.parse(raw).users_pk : null;
});
const currentPlayer = computed(() => {
    if (!appUserPk.value)
        return null;
    if (myDialog.value && selectedMyEvent.value) {
        return {
            event_status: selectedMyEvent.value.status,
            users_pk: appUserPk.value,
        };
    }
    return players.value.find((p) => p.users_pk === appUserPk.value) || null;
});
const selectedStoreImage = computed(() => {
    const store = stores.value.find((s) => s.storename === selectedEvent.value?.store);
    return store?.picture_hash
        ? `http://druna-user-pic.s3-website.us-east-2.amazonaws.com/${store.picture_hash}`
        : "https://via.placeholder.com/150";
});
const selectedStore = computed(() => {
    return (stores.value.find((s) => s.name === selectedEvent.value?.store_name) || {});
});
const parsedCampaignFk = computed(() => {
    return joinCampaignId.value.length > 4 ? joinCampaignId.value.slice(4) : null;
});
const openInGoogleMaps = () => {
    const event = selectedEvent.value || selectedMyEvent.value;
    if (!event?.store_name || event.latitude == null || event.longitude == null)
        return;
    const encodedName = event.store_name.split(" ").join("+");
    const lat = event.latitude;
    const lng = event.longitude;
    const query = `${encodedName}%20${lat},${lng}`;
    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${query}`;
    window.open(mapsUrl, "_blank");
};
const fetchStatuses = () => {
    axios
        .get("/event_status/search")
        .then((response) => {
        statuses.value = response.data.event_status;
        grantedStatus.value = statuses.value.find((s) => s.name === "Granted Passage")?.event_status_pk;
        turnedAwayStatus.value = statuses.value.find((s) => s.name === "Turned Away")?.event_status_pk;
    })
        .catch((error) => {
        console.error("Error fetching statuses:", error.response?.data || error.message);
    });
};
const fetchPlayers = async (eventPk) => {
    try {
        const response = await axios.get("/rl_events_users/list_players", {
            params: { events_fk: eventPk },
        });
        players.value = response.data.players;
        if (selectedMyEvent.value && selectedMyEvent.value.events_pk === eventPk) {
            const currentUserEntry = players.value.find((p) => p.users_pk === appUserPk.value);
            if (currentUserEntry) {
                selectedMyEvent.value.status = currentUserEntry.event_status;
                const eventIndex = myEvents.value.findIndex((e) => e.events_pk === eventPk);
                if (eventIndex !== -1) {
                    myEvents.value[eventIndex].status = currentUserEntry.event_status;
                }
            }
        }
    }
    catch (error) {
        console.error("Error fetching players:", error.response?.data || error.message);
        players.value = [];
    }
};
const dateRules = [
    (value) => {
        if (!value)
            return "Date is required.";
        const inputDate = new Date(value);
        if (inputDate < today)
            return "Date cannot be in the past.";
        if (inputDate > oneYearFromToday)
            return "Date cannot be more than 1 year from today.";
        return true;
    },
];
const today = new Date();
const todayISO = today.toISOString().split("T")[0];
const oneYearFromToday = new Date();
oneYearFromToday.setFullYear(today.getFullYear() + 1);
const fetchRewardsForEvent = async (eventPk, forceRefresh = false) => {
    const cacheKey = eventPk;
    const now = Date.now();
    const cacheEntry = rewardsCache.value[cacheKey];
    const CACHE_DURATION_MS = 60000;
    if (!forceRefresh &&
        cacheEntry &&
        now - cacheEntry.timestamp < CACHE_DURATION_MS) {
        return cacheEntry.rewards;
    }
    try {
        const rewardsRes = await axios.get("/rl_events_rewards/list_rewards", {
            params: { events_fk: eventPk },
            headers: {
                Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
        });
        const rewards = (rewardsRes.data.rewards || []).map((r) => ({
            ...r,
            image: `https://assets.drunagor.app/${r.picture_hash}`,
        }));
        rewardsCache.value[cacheKey] = {
            rewards: rewards,
            timestamp: now,
        };
        return rewards;
    }
    catch (error) {
        console.error("Error fetching rewards:", error);
        if (cacheEntry) {
            return cacheEntry.rewards;
        }
        return [];
    }
};
const openDialog = async (event) => {
    selectedEvent.value = event;
    dialog.value = true;
    fetchPlayers(event.events_pk);
    eventRewards.value = await fetchRewardsForEvent(event.events_pk, true);
};
const compressCampaign = (campaignId) => {
    const campaignCopy = JSON.parse(JSON.stringify(campaignStore.find(campaignId)));
};
const handleNewCampaign = () => {
    if (!selectedMyEvent.value)
        return;
    const seasonFk = selectedMyEvent.value.seasons_fk;
    let campaignType = "";
    if (seasonFk == 2) {
        campaignType = "underkeep";
    }
    else if (seasonFk == 3) {
        campaignType = "underkeep2";
    }
    else {
        toast.add({
            severity: "warn",
            summary: "Warning",
            detail: "Cannot create campaign for this event season.",
        });
        return;
    }
    loading.value = true;
    const usersPk = userStore.user?.users_pk;
    let selectedSku;
    let campaignFk;
    axios
        .get("/skus/search", { params: { users_fk: usersPk } })
        .then(({ data }) => {
        const skuList = Array.isArray(data.skus)
            ? data.skus
            : Object.values(data.skus);
        selectedSku = skuList.find((s) => s.name?.toLowerCase() === campaignType.toLowerCase());
        if (!selectedSku) {
            return Promise.reject(new Error(`SKU for ${campaignType} not found`));
        }
        return axios.post("/campaigns/cadastro", {
            tracker_hash: "eyJjYW1wYWlnbkRhdGEiOnsiY2FtcGFpZ25JZCI6IiIsImNhbXBhaWduIjoidW5kZXJrZWVwIiwibmFtZSI6IiIsImRvb3IiOiIiLCJ3aW5nIjoiIiwic3RhdHVzSWRzIjpbXSwib3V0Y29tZUlkcyI6W10sImZvbGxvd2VySWRzIjpbXSwidW5mb2xkaW5nSWRzIjpbXSwiYmFja2dyb3VuZEFuZFRyYWl0SWRzIjpbXSwibGVnYWN5VHJhaWwiOnsicGVyc2V2ZXJhbmNlIjowLCJ0cmFnZWR5IjowLCJkb29tIjowLCJoZXJvaXNtIjowfSwiaXNTZXF1ZW50aWFsQWR2ZW50dXJlIjpmYWxzZSwic2VxdWVudGlhbEFkdmVudHVyZVJ1bmVzIjowfSwiaGVyb2VzIjpbXX0=",
            conclusion_percentage: 0,
            box: selectedSku.skus_pk,
        });
    })
        .then(({ data }) => {
        campaignFk = data.campaign.campaigns_pk;
        const newCamp = new Campaign(String(campaignFk), campaignType);
        campaignStore.add(newCamp);
        return axios.put(`/campaigns/alter/${campaignFk}`, {
            tracker_hash: "eyJjYW1wYWlnbkRhdGEiOnsiY2FtcGFpZ25JZCI6IiIsImNhbXBhaWduIjoidW5kZXJrZWVwIiwibmFtZSI6IiIsImRvb3IiOiIiLCJ3aW5nIjoiIiwic3RhdHVzSWRzIjpbXSwib3V0Y29tZUlkcyI6W10sImZvbGxvd2VySWRzIjpbXSwidW5mb2xkaW5nSWRzIjpbXSwiYmFja2dyb3VuZEFuZFRyYWl0SWRzIjpbXSwibGVnYWN5VHJhaWwiOnsicGVyc2V2ZXJhbmNlIjowLCJ0cmFnZWR5IjowLCJkb29tIjowLCJoZXJvaXNtIjowfSwiaXNTZXF1ZW50aWFsQWR2ZW50dXJlIjpmYWxzZSwic2VxdWVudGlhbEFkdmVudHVyZVJ1bmVzIjowfSwiaGVyb2VzIjpbXX0=",
            party_name: "",
        });
    })
        .then(() => {
        return axios.post("/rl_campaigns_users/cadastro", {
            users_fk: usersPk,
            campaigns_fk: campaignFk,
            party_roles_fk: 1,
            skus_fk: selectedSku.skus_pk,
        });
    })
        .then(() => {
        compressCampaign(String(campaignFk));
        toast.add({
            severity: "success",
            summary: t("label.success"),
            detail: "Campanha criada com sucesso!",
        });
        router.push({
            path: `/campaign-tracker/campaign/${campaignFk}`,
            query: { sku: String(selectedSku.skus_pk) },
        });
    })
        .catch((err) => {
        console.error("Erro no fluxo de criação:", err);
        toast.add({
            severity: "error",
            summary: t("label.error"),
            detail: err.message || "Falha ao criar campanha.",
        });
    })
        .finally(() => {
        loading.value = false;
    });
};
const loadCampaign = () => {
    loading.value = true;
    const usersPk = userStore.user.users_pk;
    const showSeason2 = selectedMyEvent.value?.seasons_fk === 3;
    axios
        .get("/rl_campaigns_users/search", {
        params: {
            users_fk: usersPk,
            show_season2: showSeason2,
        },
    })
        .then(({ data }) => {
        campaigns.value = data.campaigns;
        selectedLoadCampaign.value = null;
        showLoadDialog.value = true;
    })
        .catch((err) => {
        console.error("Failed to fetch campaigns:", err);
        toast.add({
            severity: "error",
            summary: "Error",
            detail: "Could not load campaigns.",
        });
    })
        .finally(() => {
        loading.value = false;
    });
};
const confirmLoadCampaign = () => {
    if (!selectedLoadCampaign.value)
        return;
    loading.value = true;
    try {
        toast.add({
            severity: "success",
            summary: "Success",
            detail: "Campaign loaded!",
        });
        const sku = selectedMyEvent.value?.seasons_fk === 3 ? 39 : 38;
        router.push({
            path: `/campaign-tracker/campaign/${selectedLoadCampaign.value}`,
            query: {
                sku: String(sku),
                openInstructions: "load",
            },
        });
    }
    catch (err) {
        console.error("Failed to load campaign:", err);
        toast.add({
            severity: "error",
            summary: "Error",
            detail: "Could not load campaign.",
        });
        loading.value = false;
    }
    finally {
        showLoadDialog.value = false;
        showCampaignDialog.value = false;
        myDialog.value = false;
    }
};
const fetchPlayerEvents = async (past) => {
    const params = {
        player_fk: playerFk.value,
        past_events: past.toString(),
    };
    try {
        const response = await axios.get("/events/list_events/", {
            params,
            headers: {
                Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
        });
        const eventsData = response.data.events || [];
        const eventsWithRewards = await Promise.all(eventsData.map(async (event) => {
            const rewards = await fetchRewardsForEvent(event.events_pk);
            return { ...event, rewards };
        }));
        events.value = eventsWithRewards;
    }
    catch (error) {
        console.error("Error fetching player events:", error);
        events.value = [];
    }
};
const fetchMyEvents = async (past) => {
    const params = {
        player_fk: playerFk.value,
        past_events: past.toString(),
        limit: 30,
        offset: 0,
    };
    try {
        const response = await axios.get("/events/my_events/player", {
            params,
            headers: {
                Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
        });
        const eventsData = response.data.events || [];
        const eventsWithRewards = await Promise.all(eventsData.map(async (event) => {
            const rewards = await fetchRewardsForEvent(event.events_pk);
            return { ...event, rewards };
        }));
        myEvents.value = eventsWithRewards;
        if (myDialog.value && selectedMyEvent.value) {
            const currentEvent = myEvents.value.find((e) => e.events_pk === selectedMyEvent.value.events_pk);
            if (currentEvent) {
                selectedMyEvent.value = currentEvent;
                fetchPlayers(currentEvent.events_pk);
            }
            else {
                myDialog.value = false;
                selectedMyEvent.value = null;
            }
        }
    }
    catch (error) {
        console.error("Error fetching my events:", error);
        myEvents.value = [];
    }
};
const fetchMyEventsDebounced = useDebounceFn(() => {
    if (!playerFk.value)
        return;
    fetchMyEvents();
}, 300);
const fetchSceneries = async () => {
    await axios
        .get("/sceneries/search", {
        params: { active: true },
        headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
    })
        .then((response) => {
        sceneries.value = response.data.sceneries || [];
    })
        .catch((error) => {
        console.error("Error fetching sceneries:", error);
    });
};
const createEvent = () => {
    createEventDialog.value = false;
};
const openMyEventsDialog = async (event) => {
    showQuitSuccessAlert.value = false;
    showQuitErrorAlert.value = false;
    selectedMyEvent.value = event;
    eventPk.value = event.events_pk;
    myDialog.value = true;
    isRefreshingStatus.value = true;
    await fetchPlayers(event.events_pk);
    isRefreshingStatus.value = false;
    eventRewards.value = await fetchRewardsForEvent(event.events_pk, true);
    const userStore = useUserStore();
    const userId = parseInt(userStore.user?.users_pk, 10);
    if (isNaN(userId)) {
        return;
    }
    const currentUserEntry = players.value.find((player) => player.users_pk === userId);
    rlEventsUsersPkToQuit.value = currentUserEntry
        ? currentUserEntry.rl_events_users_pk
        : null;
};
const refreshEventStatus = async () => {
    if (!selectedMyEvent.value?.events_pk) {
        console.warn("Nenhum evento selecionado para atualizar.");
        return;
    }
    isRefreshingStatus.value = true;
    loading.value = true;
    try {
        await fetchPlayers(selectedMyEvent.value.events_pk);
    }
    catch (error) {
        console.error("Erro ao atualizar status do evento:", error);
    }
    finally {
        isRefreshingStatus.value = false;
        loading.value = false;
    }
};
const quitEvent = () => {
    if (rlEventsUsersPkToQuit.value) {
        showQuitConfirmDialog.value = true;
    }
    else {
        toast.add({
            severity: "warn",
            summary: "Warning",
            detail: "Cannot quit event. Relationship ID not found.",
            life: 3000,
        });
    }
};
const confirmQuitEvent = () => {
    showQuitConfirmDialog.value = false;
    if (!rlEventsUsersPkToQuit.value) {
        quitErrorMessage.value = "Cannot quit event. Relationship ID not found.";
        showQuitErrorAlert.value = true;
        return;
    }
    loading.value = true;
    axios
        .delete(`/rl_events_users/${rlEventsUsersPkToQuit.value}/delete/`, {
        data: { status: 3 },
        headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
    })
        .then(() => {
        showQuitSuccessAlert.value = true;
        showQuitErrorAlert.value = false;
        return fetchMyEvents(showPast.value);
    })
        .then(() => { })
        .catch((error) => {
        console.error("Failed to quit event:", error);
        quitErrorMessage.value =
            "An unexpected error occurred. Please try again later.";
        showQuitErrorAlert.value = true;
    })
        .finally(() => {
        loading.value = false;
    });
};
const shareEvent = (eventId) => {
    Promise.resolve(eventId)
        .then((id) => {
        if (!id) {
            throw new Error("Event ID not found!");
        }
        return btoa(id.toString());
    })
        .then((encodedId) => {
        sharedLink.value = `${window.location.origin}/event/${encodedId}`;
        showDialog.value = true;
    })
        .catch((error) => {
        console.error("Error generating share link:", error);
    });
};
const copyLink = (link) => {
    navigator.clipboard
        .writeText(link)
        .then(() => {
        showDialog.value = false;
        showAlert.value = true;
    })
        .catch((error) => {
        console.error("Failed to copy link:", error);
    });
};
const getEventStatusInfo = (status) => {
    switch (status) {
        case "Seeks Entry":
            return {
                icon: "mdi-timer-sand",
                color: "orange",
                tooltip: "Waiting for the retailer to accept your entry.",
            };
        case "Granted Passage":
            return {
                icon: "mdi-check-circle",
                color: "success",
                tooltip: "Retailer accepted your passage to the event.",
            };
        case "Turned Away":
            return {
                icon: "mdi-cancel",
                color: "error",
                tooltip: "Retailer refused your entry or you left the event.",
            };
        case "Joined the Quest":
            return {
                icon: "mdi-sword",
                color: "purple",
                tooltip: "Your campaign is available and you can play now.",
            };
        default:
            return {
                icon: "mdi-help-circle",
                color: "grey",
                tooltip: "Unknown event status.",
            };
    }
};
const confirmJoinCampaign = () => {
    if (!parsedCampaignFk.value)
        return;
    loading.value = true;
    const usersPk = userStore.user.users_pk;
    const campaignId = parsedCampaignFk.value;
    const sku = selectedMyEvent.value?.seasons_fk === 3 ? 39 : 38;
    axios
        .post("/rl_campaigns_users/cadastro", {
        users_fk: usersPk,
        campaigns_fk: campaignId,
        party_roles_fk: 2,
        skus_fk: sku,
    }, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
    })
        .then(() => {
        return axios.get("/rl_campaigns_users/search", {
            params: {
                users_fk: usersPk,
                campaigns_fk: campaignId,
            },
            headers: {
                Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
        });
    })
        .then((campaignResponse) => {
        const campaignData = campaignResponse.data.campaigns[0];
        if (campaignData && campaignData.tracker_hash) {
            const data = JSON.parse(atob(campaignData.tracker_hash));
            const camp = data.campaignData;
            camp.campaignId = String(campaignData.campaigns_fk);
            campaignStore.add(camp);
            data.heroes.forEach((h) => {
                h.campaignId = String(campaignData.campaigns_fk);
                heroStore.add(h);
            });
            router.push({
                path: `/campaign-tracker/campaign/${campaignId}`,
                query: { sku: String(sku) },
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
    })
        .catch((err) => {
        console.error("Error during join process:", err);
        let errorMessage = "Error joining campaign.";
        let severity = "error";
        if (err.response?.data?.message?.includes("already exists") ||
            err.response?.data?.message?.includes("já existe")) {
            errorMessage = "You are already part of this campaign!";
            severity = "info";
            router.push({
                path: `/campaign-tracker/campaign/${campaignId}`,
                query: { sku: String(BOX_ID) },
            });
        }
        toast.add({
            severity: severity,
            summary: severity === "info" ? "Info" : "Error",
            detail: errorMessage,
        });
    })
        .finally(() => {
        loading.value = false;
        joinCampaignId.value = "";
        showJoinCampaignDialog.value = false;
    });
};
const joinEvent = async () => {
    showAlert.value = false;
    await axios
        .post("/rl_events_users/cadastro", {
        users_fk: userStore.user.users_pk,
        events_fk: selectedEvent.value.events_pk,
        status: 1,
    }, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
    })
        .then(() => {
        alertType.value = "success";
        alertMessage.value =
            "You’ve successfully joined this event! Visit the <strong>My Events</strong> page to view it.";
        showAlert.value = true;
        fetchMyEvents(showPast.value);
        setTimeout(async () => {
            dialog.value = false;
            activeTab.value = 2;
            showAlert.value = false;
        }, 2000);
    })
        .catch((error) => {
        const apiMessage = error.response?.data?.message;
        if (apiMessage) {
            alertMessage.value = apiMessage;
            if (apiMessage.includes("already signed up")) {
                alertType.value = "error";
                console.error("Erro ao tentar entrar no evento:", error);
            }
            showAlert.value = true;
        }
    });
};
const fetchStoresList = async () => {
    axios
        .get("/stores/list", {
        params: { users_fk: userStore.user?.users_pk },
        headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
    })
        .then((response) => {
        stores.value = response.data.stores || [];
    })
        .catch((error) => {
        console.error("Error fetching stores:", error);
    });
};
const startEventRefreshInterval = () => {
    if (eventRefreshInterval.value) {
        clearInterval(eventRefreshInterval.value);
    }
    eventRefreshInterval.value = setInterval(() => {
        if (playerFk.value) {
            fetchPlayerEvents(showPast.value);
            fetchMyEvents(showPast.value);
        }
    }, 5000);
};
onMounted(() => {
    const usersPk = localStorage.getItem("app_user");
    const appUser = usersPk ? JSON.parse(usersPk).users_pk : null;
    if (events.value.length) {
        fetchPlayers(events.value[0].events_pk);
    }
    stores.value = JSON.parse(localStorage.getItem("stores") || "[]");
    const rawUser = localStorage.getItem("app_user");
    playerFk.value = rawUser ? JSON.parse(rawUser).users_pk : null;
    openInGoogleMaps();
    fetchStoresList();
    fetchStatuses();
    fetchSceneries()
        .then(() => {
        loading.value = true;
        return Promise.all([
            fetchPlayerEvents(showPast.value),
            fetchMyEvents(showPast.value),
        ]);
    })
        .then(() => {
        loading.value = false;
        startEventRefreshInterval();
    })
        .catch((error) => {
        console.error("Error fetching sceneries or events:", error);
    })
        .finally(() => {
        if (loading.value) {
            loading.value = false;
        }
    });
});
onUnmounted(() => {
    if (eventRefreshInterval.value) {
        clearInterval(eventRefreshInterval.value);
        eventRefreshInterval.value = null;
    }
});
watch(showPast, async (novo) => {
    loading.value = true;
    await fetchPlayerEvents(novo);
    await fetchMyEvents(novo);
    loading.value = false;
});
watch(() => newEvent.value.store, (selectedStoreName) => {
    const selectedStore = stores.value.find((store) => store.storename === selectedStoreName);
    if (selectedStore) {
        const { address, streetNumber, complement, city, state } = selectedStore;
        newEvent.value.address = `${address}, ${streetNumber}, ${complement}, ${city}, ${state}`;
    }
    else {
        newEvent.value.address = "";
    }
});
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['sort-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['scheduled-box']} */ ;
/** @type {__VLS_StyleScopedClasses['event-card']} */ ;
// CSS variable injection 
// CSS variable injection end 
const __VLS_0 = {}.VRow;
/** @type {[typeof __VLS_components.VRow, typeof __VLS_components.vRow, typeof __VLS_components.VRow, typeof __VLS_components.vRow, ]} */ ;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
    justify: "center",
}));
const __VLS_2 = __VLS_1({
    justify: "center",
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
__VLS_3.slots.default;
const __VLS_4 = {}.VCol;
/** @type {[typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ]} */ ;
// @ts-ignore
const __VLS_5 = __VLS_asFunctionalComponent(__VLS_4, new __VLS_4({
    cols: "12",
    ...{ class: "text-center" },
}));
const __VLS_6 = __VLS_5({
    cols: "12",
    ...{ class: "text-center" },
}, ...__VLS_functionalComponentArgsRest(__VLS_5));
__VLS_7.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.h1, __VLS_intrinsicElements.h1)({
    ...{ class: "cinzel-text font-weight-black pt-4 pb-2 justify-center text-center text-h2" },
});
var __VLS_7;
var __VLS_3;
const __VLS_8 = {}.VCol;
/** @type {[typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ]} */ ;
// @ts-ignore
const __VLS_9 = __VLS_asFunctionalComponent(__VLS_8, new __VLS_8({
    cols: "12",
    md: "10",
    ...{ class: "mx-auto pt-0 d-flex flex-column" },
    ...{ style: {} },
}));
const __VLS_10 = __VLS_9({
    cols: "12",
    md: "10",
    ...{ class: "mx-auto pt-0 d-flex flex-column" },
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_9));
__VLS_11.slots.default;
const __VLS_12 = {}.VCard;
/** @type {[typeof __VLS_components.VCard, typeof __VLS_components.vCard, typeof __VLS_components.VCard, typeof __VLS_components.vCard, ]} */ ;
// @ts-ignore
const __VLS_13 = __VLS_asFunctionalComponent(__VLS_12, new __VLS_12({
    ...{ class: "pb-12 flex-grow-1" },
    color: "primary",
}));
const __VLS_14 = __VLS_13({
    ...{ class: "pb-12 flex-grow-1" },
    color: "primary",
}, ...__VLS_functionalComponentArgsRest(__VLS_13));
__VLS_15.slots.default;
const __VLS_16 = {}.VRow;
/** @type {[typeof __VLS_components.VRow, typeof __VLS_components.vRow, typeof __VLS_components.VRow, typeof __VLS_components.vRow, ]} */ ;
// @ts-ignore
const __VLS_17 = __VLS_asFunctionalComponent(__VLS_16, new __VLS_16({
    noGutters: true,
}));
const __VLS_18 = __VLS_17({
    noGutters: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_17));
__VLS_19.slots.default;
const __VLS_20 = {}.VCol;
/** @type {[typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ]} */ ;
// @ts-ignore
const __VLS_21 = __VLS_asFunctionalComponent(__VLS_20, new __VLS_20({
    cols: "12",
}));
const __VLS_22 = __VLS_21({
    cols: "12",
}, ...__VLS_functionalComponentArgsRest(__VLS_21));
__VLS_23.slots.default;
const __VLS_24 = {}.VTabs;
/** @type {[typeof __VLS_components.VTabs, typeof __VLS_components.vTabs, typeof __VLS_components.VTabs, typeof __VLS_components.vTabs, ]} */ ;
// @ts-ignore
const __VLS_25 = __VLS_asFunctionalComponent(__VLS_24, new __VLS_24({
    ...{ class: "EventsTabs mb-3" },
    modelValue: (__VLS_ctx.activeTab),
    fixedTabs: true,
    alignTabs: "center",
    color: "white",
}));
const __VLS_26 = __VLS_25({
    ...{ class: "EventsTabs mb-3" },
    modelValue: (__VLS_ctx.activeTab),
    fixedTabs: true,
    alignTabs: "center",
    color: "white",
}, ...__VLS_functionalComponentArgsRest(__VLS_25));
__VLS_27.slots.default;
const __VLS_28 = {}.VTab;
/** @type {[typeof __VLS_components.VTab, typeof __VLS_components.vTab, typeof __VLS_components.VTab, typeof __VLS_components.vTab, ]} */ ;
// @ts-ignore
const __VLS_29 = __VLS_asFunctionalComponent(__VLS_28, new __VLS_28({
    ...{ class: "text-h5" },
    value: (1),
}));
const __VLS_30 = __VLS_29({
    ...{ class: "text-h5" },
    value: (1),
}, ...__VLS_functionalComponentArgsRest(__VLS_29));
__VLS_31.slots.default;
var __VLS_31;
const __VLS_32 = {}.VTab;
/** @type {[typeof __VLS_components.VTab, typeof __VLS_components.vTab, typeof __VLS_components.VTab, typeof __VLS_components.vTab, ]} */ ;
// @ts-ignore
const __VLS_33 = __VLS_asFunctionalComponent(__VLS_32, new __VLS_32({
    ...{ class: "text-h5" },
    value: (2),
}));
const __VLS_34 = __VLS_33({
    ...{ class: "text-h5" },
    value: (2),
}, ...__VLS_functionalComponentArgsRest(__VLS_33));
__VLS_35.slots.default;
var __VLS_35;
var __VLS_27;
var __VLS_23;
var __VLS_19;
const __VLS_36 = {}.VRow;
/** @type {[typeof __VLS_components.VRow, typeof __VLS_components.vRow, typeof __VLS_components.VRow, typeof __VLS_components.vRow, ]} */ ;
// @ts-ignore
const __VLS_37 = __VLS_asFunctionalComponent(__VLS_36, new __VLS_36({
    ...{ class: "mb-4" },
    align: "center",
}));
const __VLS_38 = __VLS_37({
    ...{ class: "mb-4" },
    align: "center",
}, ...__VLS_functionalComponentArgsRest(__VLS_37));
__VLS_39.slots.default;
const __VLS_40 = {}.VCol;
/** @type {[typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ]} */ ;
// @ts-ignore
const __VLS_41 = __VLS_asFunctionalComponent(__VLS_40, new __VLS_40({
    cols: "12",
    sm: "6",
    ...{ class: "d-flex align-center" },
}));
const __VLS_42 = __VLS_41({
    cols: "12",
    sm: "6",
    ...{ class: "d-flex align-center" },
}, ...__VLS_functionalComponentArgsRest(__VLS_41));
__VLS_43.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "ml-2" },
});
const __VLS_44 = {}.VSwitch;
/** @type {[typeof __VLS_components.VSwitch, typeof __VLS_components.vSwitch, typeof __VLS_components.VSwitch, typeof __VLS_components.vSwitch, ]} */ ;
// @ts-ignore
const __VLS_45 = __VLS_asFunctionalComponent(__VLS_44, new __VLS_44({
    modelValue: (__VLS_ctx.showPast),
    hideDetails: true,
    color: "secundary",
    ...{ class: "mx-4" },
}));
const __VLS_46 = __VLS_45({
    modelValue: (__VLS_ctx.showPast),
    hideDetails: true,
    color: "secundary",
    ...{ class: "mx-4" },
}, ...__VLS_functionalComponentArgsRest(__VLS_45));
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
var __VLS_43;
var __VLS_39;
if (__VLS_ctx.activeTab === 1) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
    if (__VLS_ctx.loading) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "d-flex justify-center my-8" },
        });
        const __VLS_48 = {}.VProgressCircular;
        /** @type {[typeof __VLS_components.VProgressCircular, typeof __VLS_components.vProgressCircular, ]} */ ;
        // @ts-ignore
        const __VLS_49 = __VLS_asFunctionalComponent(__VLS_48, new __VLS_48({
            indeterminate: true,
            size: "80",
            color: "primary",
        }));
        const __VLS_50 = __VLS_49({
            indeterminate: true,
            size: "80",
            color: "primary",
        }, ...__VLS_functionalComponentArgsRest(__VLS_49));
    }
    else {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "list-container" },
        });
        if (__VLS_ctx.events.length > 0) {
            const __VLS_52 = {}.VRow;
            /** @type {[typeof __VLS_components.VRow, typeof __VLS_components.vRow, typeof __VLS_components.VRow, typeof __VLS_components.vRow, ]} */ ;
            // @ts-ignore
            const __VLS_53 = __VLS_asFunctionalComponent(__VLS_52, new __VLS_52({}));
            const __VLS_54 = __VLS_53({}, ...__VLS_functionalComponentArgsRest(__VLS_53));
            __VLS_55.slots.default;
            for (const [event, index] of __VLS_getVForSourceType((__VLS_ctx.sortedEvents))) {
                const __VLS_56 = {}.VCol;
                /** @type {[typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ]} */ ;
                // @ts-ignore
                const __VLS_57 = __VLS_asFunctionalComponent(__VLS_56, new __VLS_56({
                    key: (index),
                    ...{ class: "py-2 pl-1 pr-1" },
                    cols: "12",
                    md: "6",
                }));
                const __VLS_58 = __VLS_57({
                    key: (index),
                    ...{ class: "py-2 pl-1 pr-1" },
                    cols: "12",
                    md: "6",
                }, ...__VLS_functionalComponentArgsRest(__VLS_57));
                __VLS_59.slots.default;
                const __VLS_60 = {}.VCard;
                /** @type {[typeof __VLS_components.VCard, typeof __VLS_components.vCard, typeof __VLS_components.VCard, typeof __VLS_components.vCard, ]} */ ;
                // @ts-ignore
                const __VLS_61 = __VLS_asFunctionalComponent(__VLS_60, new __VLS_60({
                    ...{ 'onClick': {} },
                    color: "terciary",
                    ...{ class: "pt-0 event-card" },
                }));
                const __VLS_62 = __VLS_61({
                    ...{ 'onClick': {} },
                    color: "terciary",
                    ...{ class: "pt-0 event-card" },
                }, ...__VLS_functionalComponentArgsRest(__VLS_61));
                let __VLS_64;
                let __VLS_65;
                let __VLS_66;
                const __VLS_67 = {
                    onClick: (...[$event]) => {
                        if (!(__VLS_ctx.activeTab === 1))
                            return;
                        if (!!(__VLS_ctx.loading))
                            return;
                        if (!(__VLS_ctx.events.length > 0))
                            return;
                        __VLS_ctx.openDialog(event);
                    }
                };
                __VLS_63.slots.default;
                if (__VLS_ctx.getSeasonInfo(event.seasons_fk).flag) {
                    const __VLS_68 = {}.VImg;
                    /** @type {[typeof __VLS_components.VImg, typeof __VLS_components.vImg, ]} */ ;
                    // @ts-ignore
                    const __VLS_69 = __VLS_asFunctionalComponent(__VLS_68, new __VLS_68({
                        src: (__VLS_ctx.getSeasonInfo(event.seasons_fk).flag),
                        ...{ class: "season-flag" },
                    }));
                    const __VLS_70 = __VLS_69({
                        src: (__VLS_ctx.getSeasonInfo(event.seasons_fk).flag),
                        ...{ class: "season-flag" },
                    }, ...__VLS_functionalComponentArgsRest(__VLS_69));
                }
                const __VLS_72 = {}.VRow;
                /** @type {[typeof __VLS_components.VRow, typeof __VLS_components.vRow, typeof __VLS_components.VRow, typeof __VLS_components.vRow, ]} */ ;
                // @ts-ignore
                const __VLS_73 = __VLS_asFunctionalComponent(__VLS_72, new __VLS_72({
                    noGutters: true,
                    align: "center",
                }));
                const __VLS_74 = __VLS_73({
                    noGutters: true,
                    align: "center",
                }, ...__VLS_functionalComponentArgsRest(__VLS_73));
                __VLS_75.slots.default;
                const __VLS_76 = {}.VCol;
                /** @type {[typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ]} */ ;
                // @ts-ignore
                const __VLS_77 = __VLS_asFunctionalComponent(__VLS_76, new __VLS_76({
                    cols: "4",
                    sm: "2",
                }));
                const __VLS_78 = __VLS_77({
                    cols: "4",
                    sm: "2",
                }, ...__VLS_functionalComponentArgsRest(__VLS_77));
                __VLS_79.slots.default;
                __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                    ...{ class: "text-center ml-3" },
                    ...{ style: {} },
                });
                __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
                    ...{ class: "pt-3 text-caption font-weight-bold" },
                });
                (__VLS_ctx.extractMonth(event.event_date, __VLS_ctx.userTimezone));
                __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
                    ...{ class: "cinzel-text text-h3 font-weight-bold" },
                });
                (__VLS_ctx.extractDay(event.event_date, __VLS_ctx.userTimezone));
                __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
                    ...{ class: "text-caption font-weight-bold" },
                });
                (__VLS_ctx.extractTime(event.event_date, __VLS_ctx.userTimezone));
                var __VLS_79;
                const __VLS_80 = {}.VCol;
                /** @type {[typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ]} */ ;
                // @ts-ignore
                const __VLS_81 = __VLS_asFunctionalComponent(__VLS_80, new __VLS_80({
                    cols: "8",
                    sm: "10",
                    ...{ class: "pt-2" },
                }));
                const __VLS_82 = __VLS_81({
                    cols: "8",
                    sm: "10",
                    ...{ class: "pt-2" },
                }, ...__VLS_functionalComponentArgsRest(__VLS_81));
                __VLS_83.slots.default;
                __VLS_asFunctionalElement(__VLS_intrinsicElements.h3, __VLS_intrinsicElements.h3)({
                    ...{ class: "pb-1" },
                });
                const __VLS_84 = {}.VIcon;
                /** @type {[typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, ]} */ ;
                // @ts-ignore
                const __VLS_85 = __VLS_asFunctionalComponent(__VLS_84, new __VLS_84({
                    ...{ class: "pr-1" },
                    size: "small",
                    color: "black",
                }));
                const __VLS_86 = __VLS_85({
                    ...{ class: "pr-1" },
                    size: "small",
                    color: "black",
                }, ...__VLS_functionalComponentArgsRest(__VLS_85));
                __VLS_87.slots.default;
                var __VLS_87;
                (event.store_name);
                __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
                    ...{ class: "text-caption text-truncate" },
                });
                const __VLS_88 = {}.VIcon;
                /** @type {[typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, ]} */ ;
                // @ts-ignore
                const __VLS_89 = __VLS_asFunctionalComponent(__VLS_88, new __VLS_88({
                    color: "red",
                }));
                const __VLS_90 = __VLS_89({
                    color: "red",
                }, ...__VLS_functionalComponentArgsRest(__VLS_89));
                __VLS_91.slots.default;
                var __VLS_91;
                (event.address);
                __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
                    ...{ class: "text-caption" },
                });
                const __VLS_92 = {}.VIcon;
                /** @type {[typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, ]} */ ;
                // @ts-ignore
                const __VLS_93 = __VLS_asFunctionalComponent(__VLS_92, new __VLS_92({
                    color: "red",
                }));
                const __VLS_94 = __VLS_93({
                    color: "red",
                }, ...__VLS_functionalComponentArgsRest(__VLS_93));
                __VLS_95.slots.default;
                var __VLS_95;
                (event.scenario);
                if (event.rewards?.length) {
                    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
                        ...{ class: "text-caption ml-3" },
                    });
                    const __VLS_96 = {}.VRow;
                    /** @type {[typeof __VLS_components.VRow, typeof __VLS_components.vRow, typeof __VLS_components.VRow, typeof __VLS_components.vRow, ]} */ ;
                    // @ts-ignore
                    const __VLS_97 = __VLS_asFunctionalComponent(__VLS_96, new __VLS_96({
                        ...{ class: "d-flex align-center rewards-container" },
                    }));
                    const __VLS_98 = __VLS_97({
                        ...{ class: "d-flex align-center rewards-container" },
                    }, ...__VLS_functionalComponentArgsRest(__VLS_97));
                    __VLS_99.slots.default;
                    const __VLS_100 = {}.VIcon;
                    /** @type {[typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, ]} */ ;
                    // @ts-ignore
                    const __VLS_101 = __VLS_asFunctionalComponent(__VLS_100, new __VLS_100({
                        ...{ class: "mr-1" },
                        color: "red",
                    }));
                    const __VLS_102 = __VLS_101({
                        ...{ class: "mr-1" },
                        color: "red",
                    }, ...__VLS_functionalComponentArgsRest(__VLS_101));
                    __VLS_103.slots.default;
                    var __VLS_103;
                    for (const [reward, i] of __VLS_getVForSourceType((event.rewards))) {
                        const __VLS_104 = {}.VCol;
                        /** @type {[typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ]} */ ;
                        // @ts-ignore
                        const __VLS_105 = __VLS_asFunctionalComponent(__VLS_104, new __VLS_104({
                            key: (i),
                            cols: "auto",
                        }));
                        const __VLS_106 = __VLS_105({
                            key: (i),
                            cols: "auto",
                        }, ...__VLS_functionalComponentArgsRest(__VLS_105));
                        __VLS_107.slots.default;
                        const __VLS_108 = {}.VImg;
                        /** @type {[typeof __VLS_components.VImg, typeof __VLS_components.vImg, ]} */ ;
                        // @ts-ignore
                        const __VLS_109 = __VLS_asFunctionalComponent(__VLS_108, new __VLS_108({
                            src: (reward.image),
                            height: "20",
                            width: "20",
                            contain: true,
                            ...{ class: "reward-icon" },
                        }));
                        const __VLS_110 = __VLS_109({
                            src: (reward.image),
                            height: "20",
                            width: "20",
                            contain: true,
                            ...{ class: "reward-icon" },
                        }, ...__VLS_functionalComponentArgsRest(__VLS_109));
                        var __VLS_107;
                    }
                    var __VLS_99;
                }
                var __VLS_83;
                var __VLS_75;
                var __VLS_63;
                var __VLS_59;
            }
            var __VLS_55;
        }
        else {
            const __VLS_112 = {}.VRow;
            /** @type {[typeof __VLS_components.VRow, typeof __VLS_components.vRow, typeof __VLS_components.VRow, typeof __VLS_components.vRow, ]} */ ;
            // @ts-ignore
            const __VLS_113 = __VLS_asFunctionalComponent(__VLS_112, new __VLS_112({}));
            const __VLS_114 = __VLS_113({}, ...__VLS_functionalComponentArgsRest(__VLS_113));
            __VLS_115.slots.default;
            const __VLS_116 = {}.VCol;
            /** @type {[typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ]} */ ;
            // @ts-ignore
            const __VLS_117 = __VLS_asFunctionalComponent(__VLS_116, new __VLS_116({}));
            const __VLS_118 = __VLS_117({}, ...__VLS_functionalComponentArgsRest(__VLS_117));
            __VLS_119.slots.default;
            var __VLS_119;
            var __VLS_115;
        }
    }
    const __VLS_120 = {}.VDialog;
    /** @type {[typeof __VLS_components.VDialog, typeof __VLS_components.vDialog, typeof __VLS_components.VDialog, typeof __VLS_components.vDialog, ]} */ ;
    // @ts-ignore
    const __VLS_121 = __VLS_asFunctionalComponent(__VLS_120, new __VLS_120({
        modelValue: (__VLS_ctx.dialog),
        maxWidth: "600",
        minHeight: "431",
    }));
    const __VLS_122 = __VLS_121({
        modelValue: (__VLS_ctx.dialog),
        maxWidth: "600",
        minHeight: "431",
    }, ...__VLS_functionalComponentArgsRest(__VLS_121));
    __VLS_123.slots.default;
    const __VLS_124 = {}.VCard;
    /** @type {[typeof __VLS_components.VCard, typeof __VLS_components.vCard, typeof __VLS_components.VCard, typeof __VLS_components.vCard, ]} */ ;
    // @ts-ignore
    const __VLS_125 = __VLS_asFunctionalComponent(__VLS_124, new __VLS_124({
        color: "surface",
        ...{ style: {} },
    }));
    const __VLS_126 = __VLS_125({
        color: "surface",
        ...{ style: {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_125));
    __VLS_127.slots.default;
    if (__VLS_ctx.loading) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "dialog-overlay" },
        });
        const __VLS_128 = {}.VProgressCircular;
        /** @type {[typeof __VLS_components.VProgressCircular, typeof __VLS_components.vProgressCircular, ]} */ ;
        // @ts-ignore
        const __VLS_129 = __VLS_asFunctionalComponent(__VLS_128, new __VLS_128({
            indeterminate: true,
            size: "80",
            width: "7",
            color: "primary",
        }));
        const __VLS_130 = __VLS_129({
            indeterminate: true,
            size: "80",
            width: "7",
            color: "primary",
        }, ...__VLS_functionalComponentArgsRest(__VLS_129));
    }
    const __VLS_132 = {}.VCardActions;
    /** @type {[typeof __VLS_components.VCardActions, typeof __VLS_components.vCardActions, typeof __VLS_components.VCardActions, typeof __VLS_components.vCardActions, ]} */ ;
    // @ts-ignore
    const __VLS_133 = __VLS_asFunctionalComponent(__VLS_132, new __VLS_132({
        ...{ class: "d-flex justify-left" },
    }));
    const __VLS_134 = __VLS_133({
        ...{ class: "d-flex justify-left" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_133));
    __VLS_135.slots.default;
    const __VLS_136 = {}.VBtn;
    /** @type {[typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ]} */ ;
    // @ts-ignore
    const __VLS_137 = __VLS_asFunctionalComponent(__VLS_136, new __VLS_136({
        ...{ 'onClick': {} },
        color: "red",
    }));
    const __VLS_138 = __VLS_137({
        ...{ 'onClick': {} },
        color: "red",
    }, ...__VLS_functionalComponentArgsRest(__VLS_137));
    let __VLS_140;
    let __VLS_141;
    let __VLS_142;
    const __VLS_143 = {
        onClick: (...[$event]) => {
            if (!(__VLS_ctx.activeTab === 1))
                return;
            __VLS_ctx.dialog = false;
        }
    };
    __VLS_139.slots.default;
    var __VLS_139;
    var __VLS_135;
    const __VLS_144 = {}.VDialog;
    /** @type {[typeof __VLS_components.VDialog, typeof __VLS_components.vDialog, typeof __VLS_components.VDialog, typeof __VLS_components.vDialog, ]} */ ;
    // @ts-ignore
    const __VLS_145 = __VLS_asFunctionalComponent(__VLS_144, new __VLS_144({
        modelValue: (__VLS_ctx.showDialog),
        width: "400",
    }));
    const __VLS_146 = __VLS_145({
        modelValue: (__VLS_ctx.showDialog),
        width: "400",
    }, ...__VLS_functionalComponentArgsRest(__VLS_145));
    __VLS_147.slots.default;
    const __VLS_148 = {}.VCard;
    /** @type {[typeof __VLS_components.VCard, typeof __VLS_components.vCard, typeof __VLS_components.VCard, typeof __VLS_components.vCard, ]} */ ;
    // @ts-ignore
    const __VLS_149 = __VLS_asFunctionalComponent(__VLS_148, new __VLS_148({
        ...{ style: {} },
    }));
    const __VLS_150 = __VLS_149({
        ...{ style: {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_149));
    __VLS_151.slots.default;
    if (__VLS_ctx.loading) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "dialog-overlay" },
        });
        const __VLS_152 = {}.VProgressCircular;
        /** @type {[typeof __VLS_components.VProgressCircular, typeof __VLS_components.vProgressCircular, ]} */ ;
        // @ts-ignore
        const __VLS_153 = __VLS_asFunctionalComponent(__VLS_152, new __VLS_152({
            indeterminate: true,
            size: "80",
            width: "7",
            color: "primary",
        }));
        const __VLS_154 = __VLS_153({
            indeterminate: true,
            size: "80",
            width: "7",
            color: "primary",
        }, ...__VLS_functionalComponentArgsRest(__VLS_153));
    }
    const __VLS_156 = {}.VCardTitle;
    /** @type {[typeof __VLS_components.VCardTitle, typeof __VLS_components.vCardTitle, typeof __VLS_components.VCardTitle, typeof __VLS_components.vCardTitle, ]} */ ;
    // @ts-ignore
    const __VLS_157 = __VLS_asFunctionalComponent(__VLS_156, new __VLS_156({
        ...{ class: "text-h6" },
    }));
    const __VLS_158 = __VLS_157({
        ...{ class: "text-h6" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_157));
    __VLS_159.slots.default;
    var __VLS_159;
    const __VLS_160 = {}.VCardText;
    /** @type {[typeof __VLS_components.VCardText, typeof __VLS_components.vCardText, typeof __VLS_components.VCardText, typeof __VLS_components.vCardText, ]} */ ;
    // @ts-ignore
    const __VLS_161 = __VLS_asFunctionalComponent(__VLS_160, new __VLS_160({}));
    const __VLS_162 = __VLS_161({}, ...__VLS_functionalComponentArgsRest(__VLS_161));
    __VLS_163.slots.default;
    const __VLS_164 = {}.VTextField;
    /** @type {[typeof __VLS_components.VTextField, typeof __VLS_components.vTextField, ]} */ ;
    // @ts-ignore
    const __VLS_165 = __VLS_asFunctionalComponent(__VLS_164, new __VLS_164({
        modelValue: (__VLS_ctx.sharedLink),
        label: "Event Link",
        readonly: true,
        density: "compact",
        hideDetails: true,
    }));
    const __VLS_166 = __VLS_165({
        modelValue: (__VLS_ctx.sharedLink),
        label: "Event Link",
        readonly: true,
        density: "compact",
        hideDetails: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_165));
    var __VLS_163;
    const __VLS_168 = {}.VCardActions;
    /** @type {[typeof __VLS_components.VCardActions, typeof __VLS_components.vCardActions, typeof __VLS_components.VCardActions, typeof __VLS_components.vCardActions, ]} */ ;
    // @ts-ignore
    const __VLS_169 = __VLS_asFunctionalComponent(__VLS_168, new __VLS_168({}));
    const __VLS_170 = __VLS_169({}, ...__VLS_functionalComponentArgsRest(__VLS_169));
    __VLS_171.slots.default;
    const __VLS_172 = {}.VSpacer;
    /** @type {[typeof __VLS_components.VSpacer, typeof __VLS_components.vSpacer, ]} */ ;
    // @ts-ignore
    const __VLS_173 = __VLS_asFunctionalComponent(__VLS_172, new __VLS_172({}));
    const __VLS_174 = __VLS_173({}, ...__VLS_functionalComponentArgsRest(__VLS_173));
    const __VLS_176 = {}.VBtn;
    /** @type {[typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ]} */ ;
    // @ts-ignore
    const __VLS_177 = __VLS_asFunctionalComponent(__VLS_176, new __VLS_176({
        ...{ 'onClick': {} },
        color: "success",
        size: "small",
    }));
    const __VLS_178 = __VLS_177({
        ...{ 'onClick': {} },
        color: "success",
        size: "small",
    }, ...__VLS_functionalComponentArgsRest(__VLS_177));
    let __VLS_180;
    let __VLS_181;
    let __VLS_182;
    const __VLS_183 = {
        onClick: (...[$event]) => {
            if (!(__VLS_ctx.activeTab === 1))
                return;
            __VLS_ctx.copyLink(__VLS_ctx.sharedLink);
        }
    };
    __VLS_179.slots.default;
    var __VLS_179;
    const __VLS_184 = {}.VBtn;
    /** @type {[typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ]} */ ;
    // @ts-ignore
    const __VLS_185 = __VLS_asFunctionalComponent(__VLS_184, new __VLS_184({
        ...{ 'onClick': {} },
        color: "grey",
        size: "small",
    }));
    const __VLS_186 = __VLS_185({
        ...{ 'onClick': {} },
        color: "grey",
        size: "small",
    }, ...__VLS_functionalComponentArgsRest(__VLS_185));
    let __VLS_188;
    let __VLS_189;
    let __VLS_190;
    const __VLS_191 = {
        onClick: (...[$event]) => {
            if (!(__VLS_ctx.activeTab === 1))
                return;
            __VLS_ctx.showDialog = false;
        }
    };
    __VLS_187.slots.default;
    var __VLS_187;
    var __VLS_171;
    var __VLS_151;
    var __VLS_147;
    const __VLS_192 = {}.VCardText;
    /** @type {[typeof __VLS_components.VCardText, typeof __VLS_components.vCardText, typeof __VLS_components.VCardText, typeof __VLS_components.vCardText, ]} */ ;
    // @ts-ignore
    const __VLS_193 = __VLS_asFunctionalComponent(__VLS_192, new __VLS_192({}));
    const __VLS_194 = __VLS_193({}, ...__VLS_functionalComponentArgsRest(__VLS_193));
    __VLS_195.slots.default;
    const __VLS_196 = {}.VBtn;
    /** @type {[typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ]} */ ;
    // @ts-ignore
    const __VLS_197 = __VLS_asFunctionalComponent(__VLS_196, new __VLS_196({
        ...{ 'onClick': {} },
        block: true,
        color: "blue",
        size: "small",
        variant: "flat",
        ...{ class: "mt-2" },
    }));
    const __VLS_198 = __VLS_197({
        ...{ 'onClick': {} },
        block: true,
        color: "blue",
        size: "small",
        variant: "flat",
        ...{ class: "mt-2" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_197));
    let __VLS_200;
    let __VLS_201;
    let __VLS_202;
    const __VLS_203 = {
        onClick: (...[$event]) => {
            if (!(__VLS_ctx.activeTab === 1))
                return;
            __VLS_ctx.shareEvent(__VLS_ctx.selectedEvent?.events_pk);
        }
    };
    __VLS_199.slots.default;
    const __VLS_204 = {}.VIcon;
    /** @type {[typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, ]} */ ;
    // @ts-ignore
    const __VLS_205 = __VLS_asFunctionalComponent(__VLS_204, new __VLS_204({
        start: true,
    }));
    const __VLS_206 = __VLS_205({
        start: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_205));
    __VLS_207.slots.default;
    var __VLS_207;
    var __VLS_199;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({});
    const __VLS_208 = {}.VIcon;
    /** @type {[typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, ]} */ ;
    // @ts-ignore
    const __VLS_209 = __VLS_asFunctionalComponent(__VLS_208, new __VLS_208({}));
    const __VLS_210 = __VLS_209({}, ...__VLS_functionalComponentArgsRest(__VLS_209));
    __VLS_211.slots.default;
    var __VLS_211;
    (__VLS_ctx.selectedEvent?.seats_number);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({});
    const __VLS_212 = {}.VIcon;
    /** @type {[typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, ]} */ ;
    // @ts-ignore
    const __VLS_213 = __VLS_asFunctionalComponent(__VLS_212, new __VLS_212({}));
    const __VLS_214 = __VLS_213({}, ...__VLS_functionalComponentArgsRest(__VLS_213));
    __VLS_215.slots.default;
    var __VLS_215;
    (__VLS_ctx.selectedEvent?.scenario);
    if (__VLS_ctx.getSeasonInfo(__VLS_ctx.selectedEvent?.seasons_fk).name) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({});
        const __VLS_216 = {}.VIcon;
        /** @type {[typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, ]} */ ;
        // @ts-ignore
        const __VLS_217 = __VLS_asFunctionalComponent(__VLS_216, new __VLS_216({}));
        const __VLS_218 = __VLS_217({}, ...__VLS_functionalComponentArgsRest(__VLS_217));
        __VLS_219.slots.default;
        var __VLS_219;
        (__VLS_ctx.getSeasonInfo(__VLS_ctx.selectedEvent.seasons_fk).name);
    }
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
        ...{ class: "text-end scheduled-box" },
    });
    (__VLS_ctx.formatEventDate(__VLS_ctx.selectedEvent?.event_date, __VLS_ctx.userTimezone));
    var __VLS_195;
    const __VLS_220 = {}.VCard;
    /** @type {[typeof __VLS_components.VCard, typeof __VLS_components.vCard, typeof __VLS_components.VCard, typeof __VLS_components.vCard, ]} */ ;
    // @ts-ignore
    const __VLS_221 = __VLS_asFunctionalComponent(__VLS_220, new __VLS_220({
        ...{ 'onClick': {} },
        color: "primary",
        minHeight: "130px",
        ...{ class: "mr-4 event-card" },
    }));
    const __VLS_222 = __VLS_221({
        ...{ 'onClick': {} },
        color: "primary",
        minHeight: "130px",
        ...{ class: "mr-4 event-card" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_221));
    let __VLS_224;
    let __VLS_225;
    let __VLS_226;
    const __VLS_227 = {
        onClick: (...[$event]) => {
            if (!(__VLS_ctx.activeTab === 1))
                return;
            __VLS_ctx.openInGoogleMaps();
        }
    };
    __VLS_223.slots.default;
    const __VLS_228 = {}.VRow;
    /** @type {[typeof __VLS_components.VRow, typeof __VLS_components.vRow, typeof __VLS_components.VRow, typeof __VLS_components.vRow, ]} */ ;
    // @ts-ignore
    const __VLS_229 = __VLS_asFunctionalComponent(__VLS_228, new __VLS_228({
        noGutters: true,
    }));
    const __VLS_230 = __VLS_229({
        noGutters: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_229));
    __VLS_231.slots.default;
    const __VLS_232 = {}.VCol;
    /** @type {[typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ]} */ ;
    // @ts-ignore
    const __VLS_233 = __VLS_asFunctionalComponent(__VLS_232, new __VLS_232({
        cols: "3",
        lg: "3",
    }));
    const __VLS_234 = __VLS_233({
        cols: "3",
        lg: "3",
    }, ...__VLS_functionalComponentArgsRest(__VLS_233));
    __VLS_235.slots.default;
    const __VLS_236 = {}.VImg;
    /** @type {[typeof __VLS_components.VImg, typeof __VLS_components.vImg, ]} */ ;
    // @ts-ignore
    const __VLS_237 = __VLS_asFunctionalComponent(__VLS_236, new __VLS_236({
        src: (__VLS_ctx.selectedEvent?.picture_hash
            ? `https://assets.drunagor.app/${__VLS_ctx.selectedEvent.picture_hash}`
            : 'https://s3.us-east-2.amazonaws.com/assets.drunagor.app/Profile/store.png'),
        ...{ class: "event-img" },
    }));
    const __VLS_238 = __VLS_237({
        src: (__VLS_ctx.selectedEvent?.picture_hash
            ? `https://assets.drunagor.app/${__VLS_ctx.selectedEvent.picture_hash}`
            : 'https://s3.us-east-2.amazonaws.com/assets.drunagor.app/Profile/store.png'),
        ...{ class: "event-img" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_237));
    var __VLS_235;
    const __VLS_240 = {}.VCol;
    /** @type {[typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ]} */ ;
    // @ts-ignore
    const __VLS_241 = __VLS_asFunctionalComponent(__VLS_240, new __VLS_240({
        cols: "9",
        ...{ class: "pa-2" },
    }));
    const __VLS_242 = __VLS_241({
        cols: "9",
        ...{ class: "pa-2" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_241));
    __VLS_243.slots.default;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.h3, __VLS_intrinsicElements.h3)({
        ...{ class: "text-subtitle-1 font-weight-bold" },
    });
    (__VLS_ctx.selectedEvent?.store_name);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
        ...{ class: "text-caption" },
    });
    const __VLS_244 = {}.VIcon;
    /** @type {[typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, ]} */ ;
    // @ts-ignore
    const __VLS_245 = __VLS_asFunctionalComponent(__VLS_244, new __VLS_244({
        color: "red",
    }));
    const __VLS_246 = __VLS_245({
        color: "red",
    }, ...__VLS_functionalComponentArgsRest(__VLS_245));
    __VLS_247.slots.default;
    var __VLS_247;
    (__VLS_ctx.selectedEvent?.address);
    var __VLS_243;
    var __VLS_231;
    var __VLS_223;
    const __VLS_248 = {}.VCard;
    /** @type {[typeof __VLS_components.VCard, typeof __VLS_components.vCard, typeof __VLS_components.VCard, typeof __VLS_components.vCard, ]} */ ;
    // @ts-ignore
    const __VLS_249 = __VLS_asFunctionalComponent(__VLS_248, new __VLS_248({
        color: "primary",
        ...{ class: "mr-4 mt-4 event-card" },
    }));
    const __VLS_250 = __VLS_249({
        color: "primary",
        ...{ class: "mr-4 mt-4 event-card" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_249));
    __VLS_251.slots.default;
    const __VLS_252 = {}.VResponsive;
    /** @type {[typeof __VLS_components.VResponsive, typeof __VLS_components.vResponsive, typeof __VLS_components.VResponsive, typeof __VLS_components.vResponsive, ]} */ ;
    // @ts-ignore
    const __VLS_253 = __VLS_asFunctionalComponent(__VLS_252, new __VLS_252({
        ...{ style: {} },
        aspectRatio: "16/9",
    }));
    const __VLS_254 = __VLS_253({
        ...{ style: {} },
        aspectRatio: "16/9",
    }, ...__VLS_functionalComponentArgsRest(__VLS_253));
    __VLS_255.slots.default;
    if (__VLS_ctx.selectedEvent?.latitude) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.iframe)({
            src: (`https://www.google.com/maps?q=${__VLS_ctx.selectedEvent.latitude},${__VLS_ctx.selectedEvent.longitude}` +
                `&z=15&output=embed`),
            frameborder: "0",
            ...{ style: {} },
            allowfullscreen: true,
            loading: "lazy",
        });
    }
    var __VLS_255;
    var __VLS_251;
    if (__VLS_ctx.eventRewards.length) {
        const __VLS_256 = {}.VCardText;
        /** @type {[typeof __VLS_components.VCardText, typeof __VLS_components.vCardText, typeof __VLS_components.VCardText, typeof __VLS_components.vCardText, ]} */ ;
        // @ts-ignore
        const __VLS_257 = __VLS_asFunctionalComponent(__VLS_256, new __VLS_256({}));
        const __VLS_258 = __VLS_257({}, ...__VLS_functionalComponentArgsRest(__VLS_257));
        __VLS_259.slots.default;
        __VLS_asFunctionalElement(__VLS_intrinsicElements.h3, __VLS_intrinsicElements.h3)({
            ...{ class: "text-h6 font-weight-bold" },
        });
        for (const [reward, index] of __VLS_getVForSourceType((__VLS_ctx.eventRewards))) {
            const __VLS_260 = {}.VRow;
            /** @type {[typeof __VLS_components.VRow, typeof __VLS_components.vRow, typeof __VLS_components.VRow, typeof __VLS_components.vRow, ]} */ ;
            // @ts-ignore
            const __VLS_261 = __VLS_asFunctionalComponent(__VLS_260, new __VLS_260({
                key: (index),
                ...{ class: "align-center my-2" },
            }));
            const __VLS_262 = __VLS_261({
                key: (index),
                ...{ class: "align-center my-2" },
            }, ...__VLS_functionalComponentArgsRest(__VLS_261));
            __VLS_263.slots.default;
            const __VLS_264 = {}.VCol;
            /** @type {[typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ]} */ ;
            // @ts-ignore
            const __VLS_265 = __VLS_asFunctionalComponent(__VLS_264, new __VLS_264({
                cols: "3",
                md: "2",
            }));
            const __VLS_266 = __VLS_265({
                cols: "3",
                md: "2",
            }, ...__VLS_functionalComponentArgsRest(__VLS_265));
            __VLS_267.slots.default;
            const __VLS_268 = {}.VAvatar;
            /** @type {[typeof __VLS_components.VAvatar, typeof __VLS_components.vAvatar, typeof __VLS_components.VAvatar, typeof __VLS_components.vAvatar, ]} */ ;
            // @ts-ignore
            const __VLS_269 = __VLS_asFunctionalComponent(__VLS_268, new __VLS_268({
                size: "60",
            }));
            const __VLS_270 = __VLS_269({
                size: "60",
            }, ...__VLS_functionalComponentArgsRest(__VLS_269));
            __VLS_271.slots.default;
            const __VLS_272 = {}.VImg;
            /** @type {[typeof __VLS_components.VImg, typeof __VLS_components.vImg, ]} */ ;
            // @ts-ignore
            const __VLS_273 = __VLS_asFunctionalComponent(__VLS_272, new __VLS_272({
                src: (`https://assets.drunagor.app/${reward.picture_hash}`),
            }));
            const __VLS_274 = __VLS_273({
                src: (`https://assets.drunagor.app/${reward.picture_hash}`),
            }, ...__VLS_functionalComponentArgsRest(__VLS_273));
            var __VLS_271;
            var __VLS_267;
            const __VLS_276 = {}.VCol;
            /** @type {[typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ]} */ ;
            // @ts-ignore
            const __VLS_277 = __VLS_asFunctionalComponent(__VLS_276, new __VLS_276({
                cols: "9",
                md: "10",
            }));
            const __VLS_278 = __VLS_277({
                cols: "9",
                md: "10",
            }, ...__VLS_functionalComponentArgsRest(__VLS_277));
            __VLS_279.slots.default;
            __VLS_asFunctionalElement(__VLS_intrinsicElements.h4, __VLS_intrinsicElements.h4)({
                ...{ class: "text-subtitle-1 font-weight-bold" },
            });
            (reward.name);
            __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
                ...{ class: "text-body-2" },
            });
            (reward.description);
            var __VLS_279;
            var __VLS_263;
        }
        /** @type {[typeof BaseAlert, typeof BaseAlert, ]} */ ;
        // @ts-ignore
        const __VLS_280 = __VLS_asFunctionalComponent(BaseAlert, new BaseAlert({
            modelValue: (__VLS_ctx.showAlert),
            type: (__VLS_ctx.alertType),
            ...{ class: "mt-4" },
            border: "start",
            variant: "tonal",
            closable: true,
        }));
        const __VLS_281 = __VLS_280({
            modelValue: (__VLS_ctx.showAlert),
            type: (__VLS_ctx.alertType),
            ...{ class: "mt-4" },
            border: "start",
            variant: "tonal",
            closable: true,
        }, ...__VLS_functionalComponentArgsRest(__VLS_280));
        __VLS_282.slots.default;
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
        __VLS_asFunctionalDirective(__VLS_directives.vHtml)(null, { ...__VLS_directiveBindingRestFields, value: (__VLS_ctx.alertMessage) }, null, null);
        var __VLS_282;
        var __VLS_259;
    }
    const __VLS_283 = {}.VRow;
    /** @type {[typeof __VLS_components.VRow, typeof __VLS_components.vRow, typeof __VLS_components.VRow, typeof __VLS_components.vRow, ]} */ ;
    // @ts-ignore
    const __VLS_284 = __VLS_asFunctionalComponent(__VLS_283, new __VLS_283({
        ...{ class: "mt-2 ml-0" },
    }));
    const __VLS_285 = __VLS_284({
        ...{ class: "mt-2 ml-0" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_284));
    __VLS_286.slots.default;
    const __VLS_287 = {}.VCol;
    /** @type {[typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ]} */ ;
    // @ts-ignore
    const __VLS_288 = __VLS_asFunctionalComponent(__VLS_287, new __VLS_287({
        cols: "12",
        ...{ class: "mb-2" },
    }));
    const __VLS_289 = __VLS_288({
        cols: "12",
        ...{ class: "mb-2" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_288));
    __VLS_290.slots.default;
    const __VLS_291 = {}.VBtn;
    /** @type {[typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ]} */ ;
    // @ts-ignore
    const __VLS_292 = __VLS_asFunctionalComponent(__VLS_291, new __VLS_291({
        ...{ 'onClick': {} },
        block: true,
        color: "#539041",
        ...{ class: "rounded-0" },
    }));
    const __VLS_293 = __VLS_292({
        ...{ 'onClick': {} },
        block: true,
        color: "#539041",
        ...{ class: "rounded-0" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_292));
    let __VLS_295;
    let __VLS_296;
    let __VLS_297;
    const __VLS_298 = {
        onClick: (__VLS_ctx.joinEvent)
    };
    __VLS_294.slots.default;
    var __VLS_294;
    var __VLS_290;
    var __VLS_286;
    var __VLS_127;
    var __VLS_123;
}
else if (__VLS_ctx.activeTab === 2) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
    if (__VLS_ctx.loading) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "d-flex justify-center my-8" },
        });
        const __VLS_299 = {}.VProgressCircular;
        /** @type {[typeof __VLS_components.VProgressCircular, typeof __VLS_components.vProgressCircular, ]} */ ;
        // @ts-ignore
        const __VLS_300 = __VLS_asFunctionalComponent(__VLS_299, new __VLS_299({
            indeterminate: true,
            size: "80",
            color: "primary",
        }));
        const __VLS_301 = __VLS_300({
            indeterminate: true,
            size: "80",
            color: "primary",
        }, ...__VLS_functionalComponentArgsRest(__VLS_300));
    }
    else {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "list-container" },
        });
        if (__VLS_ctx.myEvents.length > 0) {
            const __VLS_303 = {}.VRow;
            /** @type {[typeof __VLS_components.VRow, typeof __VLS_components.vRow, typeof __VLS_components.VRow, typeof __VLS_components.vRow, ]} */ ;
            // @ts-ignore
            const __VLS_304 = __VLS_asFunctionalComponent(__VLS_303, new __VLS_303({}));
            const __VLS_305 = __VLS_304({}, ...__VLS_functionalComponentArgsRest(__VLS_304));
            __VLS_306.slots.default;
            for (const [evt, idx] of __VLS_getVForSourceType((__VLS_ctx.myEvents))) {
                const __VLS_307 = {}.VCol;
                /** @type {[typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ]} */ ;
                // @ts-ignore
                const __VLS_308 = __VLS_asFunctionalComponent(__VLS_307, new __VLS_307({
                    key: (evt.events_pk),
                    ...{ class: "py-2 pl-1 pr-1" },
                    cols: "12",
                    md: "6",
                }));
                const __VLS_309 = __VLS_308({
                    key: (evt.events_pk),
                    ...{ class: "py-2 pl-1 pr-1" },
                    cols: "12",
                    md: "6",
                }, ...__VLS_functionalComponentArgsRest(__VLS_308));
                __VLS_310.slots.default;
                const __VLS_311 = {}.VCard;
                /** @type {[typeof __VLS_components.VCard, typeof __VLS_components.vCard, typeof __VLS_components.VCard, typeof __VLS_components.vCard, ]} */ ;
                // @ts-ignore
                const __VLS_312 = __VLS_asFunctionalComponent(__VLS_311, new __VLS_311({
                    ...{ 'onClick': {} },
                    color: "terciary",
                    ...{ class: "pt-0 event-card" },
                }));
                const __VLS_313 = __VLS_312({
                    ...{ 'onClick': {} },
                    color: "terciary",
                    ...{ class: "pt-0 event-card" },
                }, ...__VLS_functionalComponentArgsRest(__VLS_312));
                let __VLS_315;
                let __VLS_316;
                let __VLS_317;
                const __VLS_318 = {
                    onClick: (...[$event]) => {
                        if (!!(__VLS_ctx.activeTab === 1))
                            return;
                        if (!(__VLS_ctx.activeTab === 2))
                            return;
                        if (!!(__VLS_ctx.loading))
                            return;
                        if (!(__VLS_ctx.myEvents.length > 0))
                            return;
                        __VLS_ctx.openMyEventsDialog(evt);
                    }
                };
                __VLS_314.slots.default;
                if (__VLS_ctx.getSeasonInfo(evt.seasons_fk).flag) {
                    const __VLS_319 = {}.VImg;
                    /** @type {[typeof __VLS_components.VImg, typeof __VLS_components.vImg, ]} */ ;
                    // @ts-ignore
                    const __VLS_320 = __VLS_asFunctionalComponent(__VLS_319, new __VLS_319({
                        src: (__VLS_ctx.getSeasonInfo(evt.seasons_fk).flag),
                        ...{ class: "season-flag" },
                    }));
                    const __VLS_321 = __VLS_320({
                        src: (__VLS_ctx.getSeasonInfo(evt.seasons_fk).flag),
                        ...{ class: "season-flag" },
                    }, ...__VLS_functionalComponentArgsRest(__VLS_320));
                }
                __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                    ...{ class: "status-icon-container" },
                });
                const __VLS_323 = {}.VTooltip;
                /** @type {[typeof __VLS_components.VTooltip, typeof __VLS_components.vTooltip, typeof __VLS_components.VTooltip, typeof __VLS_components.vTooltip, ]} */ ;
                // @ts-ignore
                const __VLS_324 = __VLS_asFunctionalComponent(__VLS_323, new __VLS_323({
                    text: (__VLS_ctx.getEventStatusInfo(evt.status).tooltip),
                    location: "top",
                }));
                const __VLS_325 = __VLS_324({
                    text: (__VLS_ctx.getEventStatusInfo(evt.status).tooltip),
                    location: "top",
                }, ...__VLS_functionalComponentArgsRest(__VLS_324));
                __VLS_326.slots.default;
                {
                    const { activator: __VLS_thisSlot } = __VLS_326.slots;
                    const [{ props }] = __VLS_getSlotParams(__VLS_thisSlot);
                    const __VLS_327 = {}.VIcon;
                    /** @type {[typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, ]} */ ;
                    // @ts-ignore
                    const __VLS_328 = __VLS_asFunctionalComponent(__VLS_327, new __VLS_327({
                        ...(props),
                        color: (__VLS_ctx.getEventStatusInfo(evt.status).color),
                        size: "large",
                    }));
                    const __VLS_329 = __VLS_328({
                        ...(props),
                        color: (__VLS_ctx.getEventStatusInfo(evt.status).color),
                        size: "large",
                    }, ...__VLS_functionalComponentArgsRest(__VLS_328));
                    __VLS_330.slots.default;
                    (__VLS_ctx.getEventStatusInfo(evt.status).icon);
                    var __VLS_330;
                }
                var __VLS_326;
                const __VLS_331 = {}.VRow;
                /** @type {[typeof __VLS_components.VRow, typeof __VLS_components.vRow, typeof __VLS_components.VRow, typeof __VLS_components.vRow, ]} */ ;
                // @ts-ignore
                const __VLS_332 = __VLS_asFunctionalComponent(__VLS_331, new __VLS_331({
                    noGutters: true,
                    align: "center",
                }));
                const __VLS_333 = __VLS_332({
                    noGutters: true,
                    align: "center",
                }, ...__VLS_functionalComponentArgsRest(__VLS_332));
                __VLS_334.slots.default;
                const __VLS_335 = {}.VCol;
                /** @type {[typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ]} */ ;
                // @ts-ignore
                const __VLS_336 = __VLS_asFunctionalComponent(__VLS_335, new __VLS_335({
                    cols: "4",
                    sm: "2",
                }));
                const __VLS_337 = __VLS_336({
                    cols: "4",
                    sm: "2",
                }, ...__VLS_functionalComponentArgsRest(__VLS_336));
                __VLS_338.slots.default;
                __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                    ...{ class: "text-center ml-3" },
                    ...{ style: {} },
                });
                __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
                    ...{ class: "pt-3 text-caption font-weight-bold" },
                });
                (__VLS_ctx.extractMonth(evt.event_date, __VLS_ctx.userTimezone));
                __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
                    ...{ class: "cinzel-text text-h3 font-weight-bold" },
                });
                (__VLS_ctx.extractDay(evt.event_date, __VLS_ctx.userTimezone));
                __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
                    ...{ class: "text-caption font-weight-bold" },
                });
                (__VLS_ctx.extractTime(evt.event_date, __VLS_ctx.userTimezone));
                var __VLS_338;
                const __VLS_339 = {}.VCol;
                /** @type {[typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ]} */ ;
                // @ts-ignore
                const __VLS_340 = __VLS_asFunctionalComponent(__VLS_339, new __VLS_339({
                    cols: "8",
                    sm: "10",
                    ...{ class: "pt-2 pr-10" },
                }));
                const __VLS_341 = __VLS_340({
                    cols: "8",
                    sm: "10",
                    ...{ class: "pt-2 pr-10" },
                }, ...__VLS_functionalComponentArgsRest(__VLS_340));
                __VLS_342.slots.default;
                __VLS_asFunctionalElement(__VLS_intrinsicElements.h3, __VLS_intrinsicElements.h3)({
                    ...{ class: "pb-1" },
                });
                const __VLS_343 = {}.VIcon;
                /** @type {[typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, ]} */ ;
                // @ts-ignore
                const __VLS_344 = __VLS_asFunctionalComponent(__VLS_343, new __VLS_343({
                    ...{ class: "pr-1" },
                    size: "small",
                    color: "black",
                }));
                const __VLS_345 = __VLS_344({
                    ...{ class: "pr-1" },
                    size: "small",
                    color: "black",
                }, ...__VLS_functionalComponentArgsRest(__VLS_344));
                __VLS_346.slots.default;
                var __VLS_346;
                (evt.store_name);
                __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
                    ...{ class: "text-caption text-truncate" },
                });
                const __VLS_347 = {}.VIcon;
                /** @type {[typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, ]} */ ;
                // @ts-ignore
                const __VLS_348 = __VLS_asFunctionalComponent(__VLS_347, new __VLS_347({
                    color: "red",
                }));
                const __VLS_349 = __VLS_348({
                    color: "red",
                }, ...__VLS_functionalComponentArgsRest(__VLS_348));
                __VLS_350.slots.default;
                var __VLS_350;
                (evt.address);
                __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
                    ...{ class: "text-caption" },
                });
                const __VLS_351 = {}.VIcon;
                /** @type {[typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, ]} */ ;
                // @ts-ignore
                const __VLS_352 = __VLS_asFunctionalComponent(__VLS_351, new __VLS_351({
                    color: "red",
                }));
                const __VLS_353 = __VLS_352({
                    color: "red",
                }, ...__VLS_functionalComponentArgsRest(__VLS_352));
                __VLS_354.slots.default;
                var __VLS_354;
                (evt.scenario);
                if (evt.rewards?.length) {
                    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
                        ...{ class: "text-caption ml-3" },
                    });
                    const __VLS_355 = {}.VRow;
                    /** @type {[typeof __VLS_components.VRow, typeof __VLS_components.vRow, typeof __VLS_components.VRow, typeof __VLS_components.vRow, ]} */ ;
                    // @ts-ignore
                    const __VLS_356 = __VLS_asFunctionalComponent(__VLS_355, new __VLS_355({
                        ...{ class: "d-flex align-center rewards-container" },
                    }));
                    const __VLS_357 = __VLS_356({
                        ...{ class: "d-flex align-center rewards-container" },
                    }, ...__VLS_functionalComponentArgsRest(__VLS_356));
                    __VLS_358.slots.default;
                    const __VLS_359 = {}.VIcon;
                    /** @type {[typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, ]} */ ;
                    // @ts-ignore
                    const __VLS_360 = __VLS_asFunctionalComponent(__VLS_359, new __VLS_359({
                        ...{ class: "mr-1" },
                        color: "red",
                    }));
                    const __VLS_361 = __VLS_360({
                        ...{ class: "mr-1" },
                        color: "red",
                    }, ...__VLS_functionalComponentArgsRest(__VLS_360));
                    __VLS_362.slots.default;
                    var __VLS_362;
                    for (const [reward, i] of __VLS_getVForSourceType((evt.rewards))) {
                        const __VLS_363 = {}.VCol;
                        /** @type {[typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ]} */ ;
                        // @ts-ignore
                        const __VLS_364 = __VLS_asFunctionalComponent(__VLS_363, new __VLS_363({
                            key: (i),
                            cols: "auto",
                        }));
                        const __VLS_365 = __VLS_364({
                            key: (i),
                            cols: "auto",
                        }, ...__VLS_functionalComponentArgsRest(__VLS_364));
                        __VLS_366.slots.default;
                        const __VLS_367 = {}.VImg;
                        /** @type {[typeof __VLS_components.VImg, typeof __VLS_components.vImg, ]} */ ;
                        // @ts-ignore
                        const __VLS_368 = __VLS_asFunctionalComponent(__VLS_367, new __VLS_367({
                            src: (reward.image),
                            height: "20",
                            width: "20",
                            contain: true,
                            ...{ class: "reward-icon" },
                        }));
                        const __VLS_369 = __VLS_368({
                            src: (reward.image),
                            height: "20",
                            width: "20",
                            contain: true,
                            ...{ class: "reward-icon" },
                        }, ...__VLS_functionalComponentArgsRest(__VLS_368));
                        var __VLS_366;
                    }
                    var __VLS_358;
                }
                var __VLS_342;
                var __VLS_334;
                var __VLS_314;
                var __VLS_310;
            }
            var __VLS_306;
        }
        else {
            const __VLS_371 = {}.VRow;
            /** @type {[typeof __VLS_components.VRow, typeof __VLS_components.vRow, typeof __VLS_components.VRow, typeof __VLS_components.vRow, ]} */ ;
            // @ts-ignore
            const __VLS_372 = __VLS_asFunctionalComponent(__VLS_371, new __VLS_371({}));
            const __VLS_373 = __VLS_372({}, ...__VLS_functionalComponentArgsRest(__VLS_372));
            __VLS_374.slots.default;
            const __VLS_375 = {}.VCol;
            /** @type {[typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ]} */ ;
            // @ts-ignore
            const __VLS_376 = __VLS_asFunctionalComponent(__VLS_375, new __VLS_375({
                ...{ class: "text-center" },
            }));
            const __VLS_377 = __VLS_376({
                ...{ class: "text-center" },
            }, ...__VLS_functionalComponentArgsRest(__VLS_376));
            __VLS_378.slots.default;
            var __VLS_378;
            var __VLS_374;
        }
    }
    const __VLS_379 = {}.VDialog;
    /** @type {[typeof __VLS_components.VDialog, typeof __VLS_components.vDialog, typeof __VLS_components.VDialog, typeof __VLS_components.vDialog, ]} */ ;
    // @ts-ignore
    const __VLS_380 = __VLS_asFunctionalComponent(__VLS_379, new __VLS_379({
        modelValue: (__VLS_ctx.myDialog),
        maxWidth: "700",
        minHeight: "500",
    }));
    const __VLS_381 = __VLS_380({
        modelValue: (__VLS_ctx.myDialog),
        maxWidth: "700",
        minHeight: "500",
    }, ...__VLS_functionalComponentArgsRest(__VLS_380));
    __VLS_382.slots.default;
    const __VLS_383 = {}.VCard;
    /** @type {[typeof __VLS_components.VCard, typeof __VLS_components.vCard, typeof __VLS_components.VCard, typeof __VLS_components.vCard, ]} */ ;
    // @ts-ignore
    const __VLS_384 = __VLS_asFunctionalComponent(__VLS_383, new __VLS_383({
        color: "surface",
        ...{ class: "pa-6" },
        ...{ style: {} },
    }));
    const __VLS_385 = __VLS_384({
        color: "surface",
        ...{ class: "pa-6" },
        ...{ style: {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_384));
    __VLS_386.slots.default;
    if (__VLS_ctx.loading) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "dialog-overlay" },
        });
        const __VLS_387 = {}.VProgressCircular;
        /** @type {[typeof __VLS_components.VProgressCircular, typeof __VLS_components.vProgressCircular, ]} */ ;
        // @ts-ignore
        const __VLS_388 = __VLS_asFunctionalComponent(__VLS_387, new __VLS_387({
            indeterminate: true,
            size: "80",
            width: "7",
            color: "primary",
        }));
        const __VLS_389 = __VLS_388({
            indeterminate: true,
            size: "80",
            width: "7",
            color: "primary",
        }, ...__VLS_functionalComponentArgsRest(__VLS_388));
    }
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "d-flex align-center justify-space-between pl-8" },
    });
    const __VLS_391 = {}.VCardTitle;
    /** @type {[typeof __VLS_components.VCardTitle, typeof __VLS_components.vCardTitle, typeof __VLS_components.VCardTitle, typeof __VLS_components.vCardTitle, ]} */ ;
    // @ts-ignore
    const __VLS_392 = __VLS_asFunctionalComponent(__VLS_391, new __VLS_391({
        ...{ class: "text-h6 font-weight-bold pa-0" },
    }));
    const __VLS_393 = __VLS_392({
        ...{ class: "text-h6 font-weight-bold pa-0" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_392));
    __VLS_394.slots.default;
    (__VLS_ctx.selectedMyEvent?.store_name);
    var __VLS_394;
    const __VLS_395 = {}.VIcon;
    /** @type {[typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, ]} */ ;
    // @ts-ignore
    const __VLS_396 = __VLS_asFunctionalComponent(__VLS_395, new __VLS_395({
        ...{ 'onClick': {} },
        color: "red",
        ...{ class: "mr-2" },
        ...{ style: {} },
    }));
    const __VLS_397 = __VLS_396({
        ...{ 'onClick': {} },
        color: "red",
        ...{ class: "mr-2" },
        ...{ style: {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_396));
    let __VLS_399;
    let __VLS_400;
    let __VLS_401;
    const __VLS_402 = {
        onClick: (...[$event]) => {
            if (!!(__VLS_ctx.activeTab === 1))
                return;
            if (!(__VLS_ctx.activeTab === 2))
                return;
            __VLS_ctx.myDialog = false;
        }
    };
    __VLS_398.slots.default;
    var __VLS_398;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "mt-1 pl-6" },
        ...{ style: {} },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
        ...{ class: "text-caption scheduled-box ma-0" },
    });
    (__VLS_ctx.formatEventDate(__VLS_ctx.selectedMyEvent?.event_date, __VLS_ctx.userTimezone));
    const __VLS_403 = {}.VRow;
    /** @type {[typeof __VLS_components.VRow, typeof __VLS_components.vRow, typeof __VLS_components.VRow, typeof __VLS_components.vRow, ]} */ ;
    // @ts-ignore
    const __VLS_404 = __VLS_asFunctionalComponent(__VLS_403, new __VLS_403({
        align: "center",
        justify: "space-between",
    }));
    const __VLS_405 = __VLS_404({
        align: "center",
        justify: "space-between",
    }, ...__VLS_functionalComponentArgsRest(__VLS_404));
    __VLS_406.slots.default;
    const __VLS_407 = {}.VCol;
    /** @type {[typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ]} */ ;
    // @ts-ignore
    const __VLS_408 = __VLS_asFunctionalComponent(__VLS_407, new __VLS_407({
        cols: "12",
        md: "6",
        ...{ class: "text-center pt-8" },
    }));
    const __VLS_409 = __VLS_408({
        cols: "12",
        md: "6",
        ...{ class: "text-center pt-8" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_408));
    const __VLS_411 = {}.VCol;
    /** @type {[typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ]} */ ;
    // @ts-ignore
    const __VLS_412 = __VLS_asFunctionalComponent(__VLS_411, new __VLS_411({
        cols: "12",
        ...{ class: "text-center px-5" },
    }));
    const __VLS_413 = __VLS_412({
        cols: "12",
        ...{ class: "text-center px-5" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_412));
    __VLS_414.slots.default;
    const __VLS_415 = {}.VRow;
    /** @type {[typeof __VLS_components.VRow, typeof __VLS_components.vRow, typeof __VLS_components.VRow, typeof __VLS_components.vRow, ]} */ ;
    // @ts-ignore
    const __VLS_416 = __VLS_asFunctionalComponent(__VLS_415, new __VLS_415({}));
    const __VLS_417 = __VLS_416({}, ...__VLS_functionalComponentArgsRest(__VLS_416));
    __VLS_418.slots.default;
    const __VLS_419 = {}.VCol;
    /** @type {[typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ]} */ ;
    // @ts-ignore
    const __VLS_420 = __VLS_asFunctionalComponent(__VLS_419, new __VLS_419({
        cols: "12",
        ...{ class: "d-flex align-center justify-center mb-2" },
    }));
    const __VLS_421 = __VLS_420({
        cols: "12",
        ...{ class: "d-flex align-center justify-center mb-2" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_420));
    __VLS_422.slots.default;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
        ...{ class: "text-subtitle-2 font-weight-medium my-0 mr-2" },
    });
    (__VLS_ctx.selectedMyEvent?.status);
    const __VLS_423 = {}.VBtn;
    /** @type {[typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ]} */ ;
    // @ts-ignore
    const __VLS_424 = __VLS_asFunctionalComponent(__VLS_423, new __VLS_423({
        ...{ 'onClick': {} },
        icon: "mdi-refresh",
        variant: "text",
        size: "small",
        loading: (__VLS_ctx.isRefreshingStatus),
        disabled: (__VLS_ctx.isRefreshingStatus),
    }));
    const __VLS_425 = __VLS_424({
        ...{ 'onClick': {} },
        icon: "mdi-refresh",
        variant: "text",
        size: "small",
        loading: (__VLS_ctx.isRefreshingStatus),
        disabled: (__VLS_ctx.isRefreshingStatus),
    }, ...__VLS_functionalComponentArgsRest(__VLS_424));
    let __VLS_427;
    let __VLS_428;
    let __VLS_429;
    const __VLS_430 = {
        onClick: (...[$event]) => {
            if (!!(__VLS_ctx.activeTab === 1))
                return;
            if (!(__VLS_ctx.activeTab === 2))
                return;
            __VLS_ctx.refreshEventStatus();
        }
    };
    var __VLS_426;
    var __VLS_422;
    const __VLS_431 = {}.VCol;
    /** @type {[typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ]} */ ;
    // @ts-ignore
    const __VLS_432 = __VLS_asFunctionalComponent(__VLS_431, new __VLS_431({
        cols: "12",
        md: "6",
        ...{ class: "py-0" },
    }));
    const __VLS_433 = __VLS_432({
        cols: "12",
        md: "6",
        ...{ class: "py-0" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_432));
    __VLS_434.slots.default;
    const __VLS_435 = {}.VBtn;
    /** @type {[typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ]} */ ;
    // @ts-ignore
    const __VLS_436 = __VLS_asFunctionalComponent(__VLS_435, new __VLS_435({
        ...{ 'onClick': {} },
        ...{ class: "mb-4" },
        block: true,
        color: "green",
        disabled: (!__VLS_ctx.currentPlayer ||
            __VLS_ctx.currentPlayer.event_status !== 'Joined the Quest'),
    }));
    const __VLS_437 = __VLS_436({
        ...{ 'onClick': {} },
        ...{ class: "mb-4" },
        block: true,
        color: "green",
        disabled: (!__VLS_ctx.currentPlayer ||
            __VLS_ctx.currentPlayer.event_status !== 'Joined the Quest'),
    }, ...__VLS_functionalComponentArgsRest(__VLS_436));
    let __VLS_439;
    let __VLS_440;
    let __VLS_441;
    const __VLS_442 = {
        onClick: (...[$event]) => {
            if (!!(__VLS_ctx.activeTab === 1))
                return;
            if (!(__VLS_ctx.activeTab === 2))
                return;
            __VLS_ctx.showCampaignDialog = true;
        }
    };
    __VLS_438.slots.default;
    var __VLS_438;
    var __VLS_434;
    const __VLS_443 = {}.VCol;
    /** @type {[typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ]} */ ;
    // @ts-ignore
    const __VLS_444 = __VLS_asFunctionalComponent(__VLS_443, new __VLS_443({
        cols: "12",
        md: "6",
        ...{ class: "py-0" },
    }));
    const __VLS_445 = __VLS_444({
        cols: "12",
        md: "6",
        ...{ class: "py-0" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_444));
    __VLS_446.slots.default;
    const __VLS_447 = {}.VBtn;
    /** @type {[typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ]} */ ;
    // @ts-ignore
    const __VLS_448 = __VLS_asFunctionalComponent(__VLS_447, new __VLS_447({
        ...{ 'onClick': {} },
        ...{ class: "mb-8" },
        block: true,
        color: "red",
    }));
    const __VLS_449 = __VLS_448({
        ...{ 'onClick': {} },
        ...{ class: "mb-8" },
        block: true,
        color: "red",
    }, ...__VLS_functionalComponentArgsRest(__VLS_448));
    let __VLS_451;
    let __VLS_452;
    let __VLS_453;
    const __VLS_454 = {
        onClick: (...[$event]) => {
            if (!!(__VLS_ctx.activeTab === 1))
                return;
            if (!(__VLS_ctx.activeTab === 2))
                return;
            __VLS_ctx.quitEvent();
        }
    };
    __VLS_450.slots.default;
    var __VLS_450;
    var __VLS_446;
    var __VLS_418;
    /** @type {[typeof BaseAlert, typeof BaseAlert, ]} */ ;
    // @ts-ignore
    const __VLS_455 = __VLS_asFunctionalComponent(BaseAlert, new BaseAlert({
        modelValue: (__VLS_ctx.showQuitSuccessAlert),
        type: "success",
        title: "Success",
        ...{ class: "mb-4" },
        variant: "tonal",
        closable: true,
    }));
    const __VLS_456 = __VLS_455({
        modelValue: (__VLS_ctx.showQuitSuccessAlert),
        type: "success",
        title: "Success",
        ...{ class: "mb-4" },
        variant: "tonal",
        closable: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_455));
    __VLS_457.slots.default;
    var __VLS_457;
    /** @type {[typeof BaseAlert, typeof BaseAlert, ]} */ ;
    // @ts-ignore
    const __VLS_458 = __VLS_asFunctionalComponent(BaseAlert, new BaseAlert({
        modelValue: (__VLS_ctx.showQuitErrorAlert),
        type: "error",
        title: "Failed to Leave Event",
        ...{ class: "mb-4" },
        variant: "tonal",
        closable: true,
    }));
    const __VLS_459 = __VLS_458({
        modelValue: (__VLS_ctx.showQuitErrorAlert),
        type: "error",
        title: "Failed to Leave Event",
        ...{ class: "mb-4" },
        variant: "tonal",
        closable: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_458));
    __VLS_460.slots.default;
    (__VLS_ctx.quitErrorMessage);
    var __VLS_460;
    var __VLS_414;
    var __VLS_406;
    const __VLS_461 = {}.VCard;
    /** @type {[typeof __VLS_components.VCard, typeof __VLS_components.vCard, typeof __VLS_components.VCard, typeof __VLS_components.vCard, ]} */ ;
    // @ts-ignore
    const __VLS_462 = __VLS_asFunctionalComponent(__VLS_461, new __VLS_461({
        ...{ 'onClick': {} },
        color: "primary",
        minHeight: "130px",
        ...{ class: "mr-4 event-card" },
    }));
    const __VLS_463 = __VLS_462({
        ...{ 'onClick': {} },
        color: "primary",
        minHeight: "130px",
        ...{ class: "mr-4 event-card" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_462));
    let __VLS_465;
    let __VLS_466;
    let __VLS_467;
    const __VLS_468 = {
        onClick: (...[$event]) => {
            if (!!(__VLS_ctx.activeTab === 1))
                return;
            if (!(__VLS_ctx.activeTab === 2))
                return;
            __VLS_ctx.openInGoogleMaps();
        }
    };
    __VLS_464.slots.default;
    const __VLS_469 = {}.VRow;
    /** @type {[typeof __VLS_components.VRow, typeof __VLS_components.vRow, typeof __VLS_components.VRow, typeof __VLS_components.vRow, ]} */ ;
    // @ts-ignore
    const __VLS_470 = __VLS_asFunctionalComponent(__VLS_469, new __VLS_469({
        noGutters: true,
    }));
    const __VLS_471 = __VLS_470({
        noGutters: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_470));
    __VLS_472.slots.default;
    const __VLS_473 = {}.VCol;
    /** @type {[typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ]} */ ;
    // @ts-ignore
    const __VLS_474 = __VLS_asFunctionalComponent(__VLS_473, new __VLS_473({
        cols: "3",
        lg: "3",
    }));
    const __VLS_475 = __VLS_474({
        cols: "3",
        lg: "3",
    }, ...__VLS_functionalComponentArgsRest(__VLS_474));
    __VLS_476.slots.default;
    const __VLS_477 = {}.VImg;
    /** @type {[typeof __VLS_components.VImg, typeof __VLS_components.vImg, ]} */ ;
    // @ts-ignore
    const __VLS_478 = __VLS_asFunctionalComponent(__VLS_477, new __VLS_477({
        src: (__VLS_ctx.selectedMyEvent?.picture_hash
            ? `https://assets.drunagor.app/${__VLS_ctx.selectedMyEvent.picture_hash}`
            : 'https://s3.us-east-2.amazonaws.com/assets.drunagor.app/Profile/store.png'),
        ...{ class: "event-img" },
    }));
    const __VLS_479 = __VLS_478({
        src: (__VLS_ctx.selectedMyEvent?.picture_hash
            ? `https://assets.drunagor.app/${__VLS_ctx.selectedMyEvent.picture_hash}`
            : 'https://s3.us-east-2.amazonaws.com/assets.drunagor.app/Profile/store.png'),
        ...{ class: "event-img" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_478));
    var __VLS_476;
    const __VLS_481 = {}.VCol;
    /** @type {[typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ]} */ ;
    // @ts-ignore
    const __VLS_482 = __VLS_asFunctionalComponent(__VLS_481, new __VLS_481({
        cols: "9",
        ...{ class: "pa-2" },
    }));
    const __VLS_483 = __VLS_482({
        cols: "9",
        ...{ class: "pa-2" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_482));
    __VLS_484.slots.default;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.h3, __VLS_intrinsicElements.h3)({
        ...{ class: "text-subtitle-1 font-weight-bold" },
    });
    (__VLS_ctx.selectedMyEvent?.store_name);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
        ...{ class: "text-caption" },
    });
    const __VLS_485 = {}.VIcon;
    /** @type {[typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, ]} */ ;
    // @ts-ignore
    const __VLS_486 = __VLS_asFunctionalComponent(__VLS_485, new __VLS_485({
        color: "red",
    }));
    const __VLS_487 = __VLS_486({
        color: "red",
    }, ...__VLS_functionalComponentArgsRest(__VLS_486));
    __VLS_488.slots.default;
    var __VLS_488;
    (__VLS_ctx.selectedMyEvent?.address);
    var __VLS_484;
    var __VLS_472;
    var __VLS_464;
    const __VLS_489 = {}.VCard;
    /** @type {[typeof __VLS_components.VCard, typeof __VLS_components.vCard, typeof __VLS_components.VCard, typeof __VLS_components.vCard, ]} */ ;
    // @ts-ignore
    const __VLS_490 = __VLS_asFunctionalComponent(__VLS_489, new __VLS_489({
        color: "primary",
        ...{ class: "mr-4 mt-4 event-card" },
    }));
    const __VLS_491 = __VLS_490({
        color: "primary",
        ...{ class: "mr-4 mt-4 event-card" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_490));
    __VLS_492.slots.default;
    const __VLS_493 = {}.VResponsive;
    /** @type {[typeof __VLS_components.VResponsive, typeof __VLS_components.vResponsive, typeof __VLS_components.VResponsive, typeof __VLS_components.vResponsive, ]} */ ;
    // @ts-ignore
    const __VLS_494 = __VLS_asFunctionalComponent(__VLS_493, new __VLS_493({
        ...{ style: {} },
        aspectRatio: "16/9",
    }));
    const __VLS_495 = __VLS_494({
        ...{ style: {} },
        aspectRatio: "16/9",
    }, ...__VLS_functionalComponentArgsRest(__VLS_494));
    __VLS_496.slots.default;
    if (__VLS_ctx.selectedEvent?.latitude) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.iframe)({
            src: (`https://www.google.com/maps?q=${__VLS_ctx.selectedEvent.latitude},${__VLS_ctx.selectedEvent.longitude}` +
                `&z=15&output=embed`),
            frameborder: "0",
            ...{ style: {} },
            allowfullscreen: true,
            loading: "lazy",
        });
    }
    var __VLS_496;
    var __VLS_492;
    if (__VLS_ctx.eventRewards.length) {
        const __VLS_497 = {}.VCardText;
        /** @type {[typeof __VLS_components.VCardText, typeof __VLS_components.vCardText, typeof __VLS_components.VCardText, typeof __VLS_components.vCardText, ]} */ ;
        // @ts-ignore
        const __VLS_498 = __VLS_asFunctionalComponent(__VLS_497, new __VLS_497({}));
        const __VLS_499 = __VLS_498({}, ...__VLS_functionalComponentArgsRest(__VLS_498));
        __VLS_500.slots.default;
        __VLS_asFunctionalElement(__VLS_intrinsicElements.h3, __VLS_intrinsicElements.h3)({
            ...{ class: "text-h6 font-weight-bold" },
        });
        for (const [reward, index] of __VLS_getVForSourceType((__VLS_ctx.eventRewards))) {
            const __VLS_501 = {}.VRow;
            /** @type {[typeof __VLS_components.VRow, typeof __VLS_components.vRow, typeof __VLS_components.VRow, typeof __VLS_components.vRow, ]} */ ;
            // @ts-ignore
            const __VLS_502 = __VLS_asFunctionalComponent(__VLS_501, new __VLS_501({
                key: (index),
                ...{ class: "align-center my-2" },
            }));
            const __VLS_503 = __VLS_502({
                key: (index),
                ...{ class: "align-center my-2" },
            }, ...__VLS_functionalComponentArgsRest(__VLS_502));
            __VLS_504.slots.default;
            const __VLS_505 = {}.VCol;
            /** @type {[typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ]} */ ;
            // @ts-ignore
            const __VLS_506 = __VLS_asFunctionalComponent(__VLS_505, new __VLS_505({
                cols: "3",
                md: "2",
            }));
            const __VLS_507 = __VLS_506({
                cols: "3",
                md: "2",
            }, ...__VLS_functionalComponentArgsRest(__VLS_506));
            __VLS_508.slots.default;
            const __VLS_509 = {}.VAvatar;
            /** @type {[typeof __VLS_components.VAvatar, typeof __VLS_components.vAvatar, typeof __VLS_components.VAvatar, typeof __VLS_components.vAvatar, ]} */ ;
            // @ts-ignore
            const __VLS_510 = __VLS_asFunctionalComponent(__VLS_509, new __VLS_509({
                size: "60",
            }));
            const __VLS_511 = __VLS_510({
                size: "60",
            }, ...__VLS_functionalComponentArgsRest(__VLS_510));
            __VLS_512.slots.default;
            const __VLS_513 = {}.VImg;
            /** @type {[typeof __VLS_components.VImg, typeof __VLS_components.vImg, ]} */ ;
            // @ts-ignore
            const __VLS_514 = __VLS_asFunctionalComponent(__VLS_513, new __VLS_513({
                src: (`https://assets.drunagor.app/${reward.picture_hash}`),
            }));
            const __VLS_515 = __VLS_514({
                src: (`https://assets.drunagor.app/${reward.picture_hash}`),
            }, ...__VLS_functionalComponentArgsRest(__VLS_514));
            var __VLS_512;
            var __VLS_508;
            const __VLS_517 = {}.VCol;
            /** @type {[typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ]} */ ;
            // @ts-ignore
            const __VLS_518 = __VLS_asFunctionalComponent(__VLS_517, new __VLS_517({
                cols: "9",
                md: "10",
            }));
            const __VLS_519 = __VLS_518({
                cols: "9",
                md: "10",
            }, ...__VLS_functionalComponentArgsRest(__VLS_518));
            __VLS_520.slots.default;
            __VLS_asFunctionalElement(__VLS_intrinsicElements.h4, __VLS_intrinsicElements.h4)({
                ...{ class: "text-subtitle-1 font-weight-bold" },
            });
            (reward.name);
            __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
                ...{ class: "text-body-2" },
            });
            (reward.description);
            var __VLS_520;
            var __VLS_504;
        }
        var __VLS_500;
    }
    var __VLS_386;
    var __VLS_382;
    const __VLS_521 = {}.VDialog;
    /** @type {[typeof __VLS_components.VDialog, typeof __VLS_components.vDialog, typeof __VLS_components.VDialog, typeof __VLS_components.vDialog, ]} */ ;
    // @ts-ignore
    const __VLS_522 = __VLS_asFunctionalComponent(__VLS_521, new __VLS_521({
        modelValue: (__VLS_ctx.showQuitConfirmDialog),
        maxWidth: "400",
    }));
    const __VLS_523 = __VLS_522({
        modelValue: (__VLS_ctx.showQuitConfirmDialog),
        maxWidth: "400",
    }, ...__VLS_functionalComponentArgsRest(__VLS_522));
    __VLS_524.slots.default;
    const __VLS_525 = {}.VCard;
    /** @type {[typeof __VLS_components.VCard, typeof __VLS_components.vCard, typeof __VLS_components.VCard, typeof __VLS_components.vCard, ]} */ ;
    // @ts-ignore
    const __VLS_526 = __VLS_asFunctionalComponent(__VLS_525, new __VLS_525({
        ...{ style: {} },
    }));
    const __VLS_527 = __VLS_526({
        ...{ style: {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_526));
    __VLS_528.slots.default;
    if (__VLS_ctx.loading) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "dialog-overlay" },
        });
        const __VLS_529 = {}.VProgressCircular;
        /** @type {[typeof __VLS_components.VProgressCircular, typeof __VLS_components.vProgressCircular, ]} */ ;
        // @ts-ignore
        const __VLS_530 = __VLS_asFunctionalComponent(__VLS_529, new __VLS_529({
            indeterminate: true,
            size: "80",
            width: "7",
            color: "primary",
        }));
        const __VLS_531 = __VLS_530({
            indeterminate: true,
            size: "80",
            width: "7",
            color: "primary",
        }, ...__VLS_functionalComponentArgsRest(__VLS_530));
    }
    const __VLS_533 = {}.VCardTitle;
    /** @type {[typeof __VLS_components.VCardTitle, typeof __VLS_components.vCardTitle, typeof __VLS_components.VCardTitle, typeof __VLS_components.vCardTitle, ]} */ ;
    // @ts-ignore
    const __VLS_534 = __VLS_asFunctionalComponent(__VLS_533, new __VLS_533({
        ...{ class: "text-h6" },
    }));
    const __VLS_535 = __VLS_534({
        ...{ class: "text-h6" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_534));
    __VLS_536.slots.default;
    var __VLS_536;
    const __VLS_537 = {}.VCardText;
    /** @type {[typeof __VLS_components.VCardText, typeof __VLS_components.vCardText, typeof __VLS_components.VCardText, typeof __VLS_components.vCardText, ]} */ ;
    // @ts-ignore
    const __VLS_538 = __VLS_asFunctionalComponent(__VLS_537, new __VLS_537({}));
    const __VLS_539 = __VLS_538({}, ...__VLS_functionalComponentArgsRest(__VLS_538));
    __VLS_540.slots.default;
    var __VLS_540;
    const __VLS_541 = {}.VCardActions;
    /** @type {[typeof __VLS_components.VCardActions, typeof __VLS_components.vCardActions, typeof __VLS_components.VCardActions, typeof __VLS_components.vCardActions, ]} */ ;
    // @ts-ignore
    const __VLS_542 = __VLS_asFunctionalComponent(__VLS_541, new __VLS_541({}));
    const __VLS_543 = __VLS_542({}, ...__VLS_functionalComponentArgsRest(__VLS_542));
    __VLS_544.slots.default;
    const __VLS_545 = {}.VSpacer;
    /** @type {[typeof __VLS_components.VSpacer, typeof __VLS_components.vSpacer, ]} */ ;
    // @ts-ignore
    const __VLS_546 = __VLS_asFunctionalComponent(__VLS_545, new __VLS_545({}));
    const __VLS_547 = __VLS_546({}, ...__VLS_functionalComponentArgsRest(__VLS_546));
    const __VLS_549 = {}.VBtn;
    /** @type {[typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ]} */ ;
    // @ts-ignore
    const __VLS_550 = __VLS_asFunctionalComponent(__VLS_549, new __VLS_549({
        ...{ 'onClick': {} },
        color: "grey",
        text: true,
    }));
    const __VLS_551 = __VLS_550({
        ...{ 'onClick': {} },
        color: "grey",
        text: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_550));
    let __VLS_553;
    let __VLS_554;
    let __VLS_555;
    const __VLS_556 = {
        onClick: (...[$event]) => {
            if (!!(__VLS_ctx.activeTab === 1))
                return;
            if (!(__VLS_ctx.activeTab === 2))
                return;
            __VLS_ctx.showQuitConfirmDialog = false;
        }
    };
    __VLS_552.slots.default;
    var __VLS_552;
    const __VLS_557 = {}.VBtn;
    /** @type {[typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ]} */ ;
    // @ts-ignore
    const __VLS_558 = __VLS_asFunctionalComponent(__VLS_557, new __VLS_557({
        ...{ 'onClick': {} },
        color: "red-darken-2",
        text: true,
    }));
    const __VLS_559 = __VLS_558({
        ...{ 'onClick': {} },
        color: "red-darken-2",
        text: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_558));
    let __VLS_561;
    let __VLS_562;
    let __VLS_563;
    const __VLS_564 = {
        onClick: (__VLS_ctx.confirmQuitEvent)
    };
    __VLS_560.slots.default;
    var __VLS_560;
    var __VLS_544;
    var __VLS_528;
    var __VLS_524;
    const __VLS_565 = {}.VDialog;
    /** @type {[typeof __VLS_components.VDialog, typeof __VLS_components.vDialog, typeof __VLS_components.VDialog, typeof __VLS_components.vDialog, ]} */ ;
    // @ts-ignore
    const __VLS_566 = __VLS_asFunctionalComponent(__VLS_565, new __VLS_565({
        modelValue: (__VLS_ctx.showCampaignDialog),
        maxWidth: "320",
        persistent: true,
    }));
    const __VLS_567 = __VLS_566({
        modelValue: (__VLS_ctx.showCampaignDialog),
        maxWidth: "320",
        persistent: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_566));
    __VLS_568.slots.default;
    const __VLS_569 = {}.VCard;
    /** @type {[typeof __VLS_components.VCard, typeof __VLS_components.vCard, typeof __VLS_components.VCard, typeof __VLS_components.vCard, ]} */ ;
    // @ts-ignore
    const __VLS_570 = __VLS_asFunctionalComponent(__VLS_569, new __VLS_569({
        ...{ style: {} },
    }));
    const __VLS_571 = __VLS_570({
        ...{ style: {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_570));
    __VLS_572.slots.default;
    if (__VLS_ctx.loading) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "dialog-overlay" },
        });
        const __VLS_573 = {}.VProgressCircular;
        /** @type {[typeof __VLS_components.VProgressCircular, typeof __VLS_components.vProgressCircular, ]} */ ;
        // @ts-ignore
        const __VLS_574 = __VLS_asFunctionalComponent(__VLS_573, new __VLS_573({
            indeterminate: true,
            size: "80",
            width: "7",
            color: "primary",
        }));
        const __VLS_575 = __VLS_574({
            indeterminate: true,
            size: "80",
            width: "7",
            color: "primary",
        }, ...__VLS_functionalComponentArgsRest(__VLS_574));
    }
    const __VLS_577 = {}.VCardTitle;
    /** @type {[typeof __VLS_components.VCardTitle, typeof __VLS_components.vCardTitle, typeof __VLS_components.VCardTitle, typeof __VLS_components.vCardTitle, ]} */ ;
    // @ts-ignore
    const __VLS_578 = __VLS_asFunctionalComponent(__VLS_577, new __VLS_577({
        ...{ class: "d-flex justify-space-between align-center pa-0" },
    }));
    const __VLS_579 = __VLS_578({
        ...{ class: "d-flex justify-space-between align-center pa-0" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_578));
    __VLS_580.slots.default;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "text-h6 ml-4" },
    });
    const __VLS_581 = {}.VCardActions;
    /** @type {[typeof __VLS_components.VCardActions, typeof __VLS_components.vCardActions, typeof __VLS_components.VCardActions, typeof __VLS_components.vCardActions, ]} */ ;
    // @ts-ignore
    const __VLS_582 = __VLS_asFunctionalComponent(__VLS_581, new __VLS_581({
        ...{ class: "pa-0" },
    }));
    const __VLS_583 = __VLS_582({
        ...{ class: "pa-0" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_582));
    __VLS_584.slots.default;
    const __VLS_585 = {}.VBtn;
    /** @type {[typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ]} */ ;
    // @ts-ignore
    const __VLS_586 = __VLS_asFunctionalComponent(__VLS_585, new __VLS_585({
        ...{ 'onClick': {} },
        icon: true,
    }));
    const __VLS_587 = __VLS_586({
        ...{ 'onClick': {} },
        icon: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_586));
    let __VLS_589;
    let __VLS_590;
    let __VLS_591;
    const __VLS_592 = {
        onClick: (...[$event]) => {
            if (!!(__VLS_ctx.activeTab === 1))
                return;
            if (!(__VLS_ctx.activeTab === 2))
                return;
            __VLS_ctx.showCampaignDialog = false;
        }
    };
    __VLS_588.slots.default;
    const __VLS_593 = {}.VIcon;
    /** @type {[typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, ]} */ ;
    // @ts-ignore
    const __VLS_594 = __VLS_asFunctionalComponent(__VLS_593, new __VLS_593({
        color: "red",
    }));
    const __VLS_595 = __VLS_594({
        color: "red",
    }, ...__VLS_functionalComponentArgsRest(__VLS_594));
    __VLS_596.slots.default;
    var __VLS_596;
    var __VLS_588;
    var __VLS_584;
    var __VLS_580;
    const __VLS_597 = {}.VCardText;
    /** @type {[typeof __VLS_components.VCardText, typeof __VLS_components.vCardText, typeof __VLS_components.VCardText, typeof __VLS_components.vCardText, ]} */ ;
    // @ts-ignore
    const __VLS_598 = __VLS_asFunctionalComponent(__VLS_597, new __VLS_597({}));
    const __VLS_599 = __VLS_598({}, ...__VLS_functionalComponentArgsRest(__VLS_598));
    __VLS_600.slots.default;
    var __VLS_600;
    const __VLS_601 = {}.VCardActions;
    /** @type {[typeof __VLS_components.VCardActions, typeof __VLS_components.vCardActions, typeof __VLS_components.VCardActions, typeof __VLS_components.vCardActions, ]} */ ;
    // @ts-ignore
    const __VLS_602 = __VLS_asFunctionalComponent(__VLS_601, new __VLS_601({
        ...{ class: "d-flex flex-column" },
    }));
    const __VLS_603 = __VLS_602({
        ...{ class: "d-flex flex-column" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_602));
    __VLS_604.slots.default;
    const __VLS_605 = {}.VBtn;
    /** @type {[typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ]} */ ;
    // @ts-ignore
    const __VLS_606 = __VLS_asFunctionalComponent(__VLS_605, new __VLS_605({
        ...{ 'onClick': {} },
        block: true,
        color: "success",
        ...{ class: "mb-2" },
    }));
    const __VLS_607 = __VLS_606({
        ...{ 'onClick': {} },
        block: true,
        color: "success",
        ...{ class: "mb-2" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_606));
    let __VLS_609;
    let __VLS_610;
    let __VLS_611;
    const __VLS_612 = {
        onClick: (...[$event]) => {
            if (!!(__VLS_ctx.activeTab === 1))
                return;
            if (!(__VLS_ctx.activeTab === 2))
                return;
            __VLS_ctx.showJoinCampaignDialog = true;
        }
    };
    __VLS_608.slots.default;
    var __VLS_608;
    const __VLS_613 = {}.VBtn;
    /** @type {[typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ]} */ ;
    // @ts-ignore
    const __VLS_614 = __VLS_asFunctionalComponent(__VLS_613, new __VLS_613({
        ...{ 'onClick': {} },
        block: true,
        color: "success",
        ...{ class: "mb-2" },
    }));
    const __VLS_615 = __VLS_614({
        ...{ 'onClick': {} },
        block: true,
        color: "success",
        ...{ class: "mb-2" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_614));
    let __VLS_617;
    let __VLS_618;
    let __VLS_619;
    const __VLS_620 = {
        onClick: (() => {
            __VLS_ctx.handleNewCampaign();
            __VLS_ctx.showCampaignDialog = false;
        })
    };
    __VLS_616.slots.default;
    var __VLS_616;
    const __VLS_621 = {}.VBtn;
    /** @type {[typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ]} */ ;
    // @ts-ignore
    const __VLS_622 = __VLS_asFunctionalComponent(__VLS_621, new __VLS_621({
        ...{ 'onClick': {} },
        block: true,
        color: "success",
    }));
    const __VLS_623 = __VLS_622({
        ...{ 'onClick': {} },
        block: true,
        color: "success",
    }, ...__VLS_functionalComponentArgsRest(__VLS_622));
    let __VLS_625;
    let __VLS_626;
    let __VLS_627;
    const __VLS_628 = {
        onClick: (__VLS_ctx.loadCampaign)
    };
    __VLS_624.slots.default;
    var __VLS_624;
    const __VLS_629 = {}.VDialog;
    /** @type {[typeof __VLS_components.VDialog, typeof __VLS_components.vDialog, typeof __VLS_components.VDialog, typeof __VLS_components.vDialog, ]} */ ;
    // @ts-ignore
    const __VLS_630 = __VLS_asFunctionalComponent(__VLS_629, new __VLS_629({
        modelValue: (__VLS_ctx.showLoadDialog),
        maxWidth: "400",
        persistent: true,
    }));
    const __VLS_631 = __VLS_630({
        modelValue: (__VLS_ctx.showLoadDialog),
        maxWidth: "400",
        persistent: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_630));
    __VLS_632.slots.default;
    const __VLS_633 = {}.VCard;
    /** @type {[typeof __VLS_components.VCard, typeof __VLS_components.vCard, typeof __VLS_components.VCard, typeof __VLS_components.vCard, ]} */ ;
    // @ts-ignore
    const __VLS_634 = __VLS_asFunctionalComponent(__VLS_633, new __VLS_633({
        ...{ style: {} },
    }));
    const __VLS_635 = __VLS_634({
        ...{ style: {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_634));
    __VLS_636.slots.default;
    if (__VLS_ctx.loading) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "dialog-overlay" },
        });
        const __VLS_637 = {}.VProgressCircular;
        /** @type {[typeof __VLS_components.VProgressCircular, typeof __VLS_components.vProgressCircular, ]} */ ;
        // @ts-ignore
        const __VLS_638 = __VLS_asFunctionalComponent(__VLS_637, new __VLS_637({
            indeterminate: true,
            size: "80",
            width: "7",
            color: "primary",
        }));
        const __VLS_639 = __VLS_638({
            indeterminate: true,
            size: "80",
            width: "7",
            color: "primary",
        }, ...__VLS_functionalComponentArgsRest(__VLS_638));
    }
    const __VLS_641 = {}.VCardTitle;
    /** @type {[typeof __VLS_components.VCardTitle, typeof __VLS_components.vCardTitle, typeof __VLS_components.VCardTitle, typeof __VLS_components.vCardTitle, ]} */ ;
    // @ts-ignore
    const __VLS_642 = __VLS_asFunctionalComponent(__VLS_641, new __VLS_641({
        ...{ class: "d-flex justify-space-between align-center pa-0" },
    }));
    const __VLS_643 = __VLS_642({
        ...{ class: "d-flex justify-space-between align-center pa-0" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_642));
    __VLS_644.slots.default;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "text-h6 ml-4" },
    });
    const __VLS_645 = {}.VCardActions;
    /** @type {[typeof __VLS_components.VCardActions, typeof __VLS_components.vCardActions, typeof __VLS_components.VCardActions, typeof __VLS_components.vCardActions, ]} */ ;
    // @ts-ignore
    const __VLS_646 = __VLS_asFunctionalComponent(__VLS_645, new __VLS_645({
        ...{ class: "pa-0" },
    }));
    const __VLS_647 = __VLS_646({
        ...{ class: "pa-0" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_646));
    __VLS_648.slots.default;
    const __VLS_649 = {}.VBtn;
    /** @type {[typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ]} */ ;
    // @ts-ignore
    const __VLS_650 = __VLS_asFunctionalComponent(__VLS_649, new __VLS_649({
        ...{ 'onClick': {} },
        icon: true,
    }));
    const __VLS_651 = __VLS_650({
        ...{ 'onClick': {} },
        icon: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_650));
    let __VLS_653;
    let __VLS_654;
    let __VLS_655;
    const __VLS_656 = {
        onClick: (...[$event]) => {
            if (!!(__VLS_ctx.activeTab === 1))
                return;
            if (!(__VLS_ctx.activeTab === 2))
                return;
            __VLS_ctx.showLoadDialog = false;
        }
    };
    __VLS_652.slots.default;
    const __VLS_657 = {}.VIcon;
    /** @type {[typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, ]} */ ;
    // @ts-ignore
    const __VLS_658 = __VLS_asFunctionalComponent(__VLS_657, new __VLS_657({
        color: "red",
    }));
    const __VLS_659 = __VLS_658({
        color: "red",
    }, ...__VLS_functionalComponentArgsRest(__VLS_658));
    __VLS_660.slots.default;
    var __VLS_660;
    var __VLS_652;
    var __VLS_648;
    var __VLS_644;
    const __VLS_661 = {}.VCardText;
    /** @type {[typeof __VLS_components.VCardText, typeof __VLS_components.vCardText, typeof __VLS_components.VCardText, typeof __VLS_components.vCardText, ]} */ ;
    // @ts-ignore
    const __VLS_662 = __VLS_asFunctionalComponent(__VLS_661, new __VLS_661({}));
    const __VLS_663 = __VLS_662({}, ...__VLS_functionalComponentArgsRest(__VLS_662));
    __VLS_664.slots.default;
    const __VLS_665 = {}.VSelect;
    /** @type {[typeof __VLS_components.VSelect, typeof __VLS_components.vSelect, ]} */ ;
    // @ts-ignore
    const __VLS_666 = __VLS_asFunctionalComponent(__VLS_665, new __VLS_665({
        modelValue: (__VLS_ctx.selectedLoadCampaign),
        items: (__VLS_ctx.campaigns),
        itemTitle: "party_name",
        itemValue: "campaigns_fk",
        label: "Campaign",
        loading: (__VLS_ctx.loading),
        disabled: (__VLS_ctx.loading),
    }));
    const __VLS_667 = __VLS_666({
        modelValue: (__VLS_ctx.selectedLoadCampaign),
        items: (__VLS_ctx.campaigns),
        itemTitle: "party_name",
        itemValue: "campaigns_fk",
        label: "Campaign",
        loading: (__VLS_ctx.loading),
        disabled: (__VLS_ctx.loading),
    }, ...__VLS_functionalComponentArgsRest(__VLS_666));
    var __VLS_664;
    const __VLS_669 = {}.VCardActions;
    /** @type {[typeof __VLS_components.VCardActions, typeof __VLS_components.vCardActions, typeof __VLS_components.VCardActions, typeof __VLS_components.vCardActions, ]} */ ;
    // @ts-ignore
    const __VLS_670 = __VLS_asFunctionalComponent(__VLS_669, new __VLS_669({}));
    const __VLS_671 = __VLS_670({}, ...__VLS_functionalComponentArgsRest(__VLS_670));
    __VLS_672.slots.default;
    const __VLS_673 = {}.VBtn;
    /** @type {[typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ]} */ ;
    // @ts-ignore
    const __VLS_674 = __VLS_asFunctionalComponent(__VLS_673, new __VLS_673({
        ...{ 'onClick': {} },
        color: "green",
        elevation: "4",
        ...{ class: "mt-4" },
        disabled: (!__VLS_ctx.selectedLoadCampaign),
    }));
    const __VLS_675 = __VLS_674({
        ...{ 'onClick': {} },
        color: "green",
        elevation: "4",
        ...{ class: "mt-4" },
        disabled: (!__VLS_ctx.selectedLoadCampaign),
    }, ...__VLS_functionalComponentArgsRest(__VLS_674));
    let __VLS_677;
    let __VLS_678;
    let __VLS_679;
    const __VLS_680 = {
        onClick: (__VLS_ctx.confirmLoadCampaign)
    };
    __VLS_676.slots.default;
    var __VLS_676;
    var __VLS_672;
    var __VLS_636;
    var __VLS_632;
    const __VLS_681 = {}.VDialog;
    /** @type {[typeof __VLS_components.VDialog, typeof __VLS_components.vDialog, typeof __VLS_components.VDialog, typeof __VLS_components.vDialog, ]} */ ;
    // @ts-ignore
    const __VLS_682 = __VLS_asFunctionalComponent(__VLS_681, new __VLS_681({
        modelValue: (__VLS_ctx.showJoinCampaignDialog),
        maxWidth: "400",
        persistent: true,
    }));
    const __VLS_683 = __VLS_682({
        modelValue: (__VLS_ctx.showJoinCampaignDialog),
        maxWidth: "400",
        persistent: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_682));
    __VLS_684.slots.default;
    const __VLS_685 = {}.VCard;
    /** @type {[typeof __VLS_components.VCard, typeof __VLS_components.vCard, typeof __VLS_components.VCard, typeof __VLS_components.vCard, ]} */ ;
    // @ts-ignore
    const __VLS_686 = __VLS_asFunctionalComponent(__VLS_685, new __VLS_685({
        ...{ style: {} },
    }));
    const __VLS_687 = __VLS_686({
        ...{ style: {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_686));
    __VLS_688.slots.default;
    if (__VLS_ctx.loading) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "dialog-overlay" },
        });
        const __VLS_689 = {}.VProgressCircular;
        /** @type {[typeof __VLS_components.VProgressCircular, typeof __VLS_components.vProgressCircular, ]} */ ;
        // @ts-ignore
        const __VLS_690 = __VLS_asFunctionalComponent(__VLS_689, new __VLS_689({
            indeterminate: true,
            size: "80",
            width: "7",
            color: "primary",
        }));
        const __VLS_691 = __VLS_690({
            indeterminate: true,
            size: "80",
            width: "7",
            color: "primary",
        }, ...__VLS_functionalComponentArgsRest(__VLS_690));
    }
    const __VLS_693 = {}.VCardTitle;
    /** @type {[typeof __VLS_components.VCardTitle, typeof __VLS_components.vCardTitle, typeof __VLS_components.VCardTitle, typeof __VLS_components.vCardTitle, ]} */ ;
    // @ts-ignore
    const __VLS_694 = __VLS_asFunctionalComponent(__VLS_693, new __VLS_693({
        ...{ class: "d-flex justify-space-between align-center pa-0" },
    }));
    const __VLS_695 = __VLS_694({
        ...{ class: "d-flex justify-space-between align-center pa-0" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_694));
    __VLS_696.slots.default;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "text-h6 ml-4" },
    });
    const __VLS_697 = {}.VCardActions;
    /** @type {[typeof __VLS_components.VCardActions, typeof __VLS_components.vCardActions, typeof __VLS_components.VCardActions, typeof __VLS_components.vCardActions, ]} */ ;
    // @ts-ignore
    const __VLS_698 = __VLS_asFunctionalComponent(__VLS_697, new __VLS_697({
        ...{ class: "pa-0" },
    }));
    const __VLS_699 = __VLS_698({
        ...{ class: "pa-0" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_698));
    __VLS_700.slots.default;
    const __VLS_701 = {}.VBtn;
    /** @type {[typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ]} */ ;
    // @ts-ignore
    const __VLS_702 = __VLS_asFunctionalComponent(__VLS_701, new __VLS_701({
        ...{ 'onClick': {} },
        icon: true,
    }));
    const __VLS_703 = __VLS_702({
        ...{ 'onClick': {} },
        icon: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_702));
    let __VLS_705;
    let __VLS_706;
    let __VLS_707;
    const __VLS_708 = {
        onClick: (...[$event]) => {
            if (!!(__VLS_ctx.activeTab === 1))
                return;
            if (!(__VLS_ctx.activeTab === 2))
                return;
            __VLS_ctx.showJoinCampaignDialog = false;
        }
    };
    __VLS_704.slots.default;
    const __VLS_709 = {}.VIcon;
    /** @type {[typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, ]} */ ;
    // @ts-ignore
    const __VLS_710 = __VLS_asFunctionalComponent(__VLS_709, new __VLS_709({
        color: "red",
    }));
    const __VLS_711 = __VLS_710({
        color: "red",
    }, ...__VLS_functionalComponentArgsRest(__VLS_710));
    __VLS_712.slots.default;
    var __VLS_712;
    var __VLS_704;
    var __VLS_700;
    var __VLS_696;
    const __VLS_713 = {}.VCardText;
    /** @type {[typeof __VLS_components.VCardText, typeof __VLS_components.vCardText, typeof __VLS_components.VCardText, typeof __VLS_components.vCardText, ]} */ ;
    // @ts-ignore
    const __VLS_714 = __VLS_asFunctionalComponent(__VLS_713, new __VLS_713({}));
    const __VLS_715 = __VLS_714({}, ...__VLS_functionalComponentArgsRest(__VLS_714));
    __VLS_716.slots.default;
    const __VLS_717 = {}.VTextField;
    /** @type {[typeof __VLS_components.VTextField, typeof __VLS_components.vTextField, ]} */ ;
    // @ts-ignore
    const __VLS_718 = __VLS_asFunctionalComponent(__VLS_717, new __VLS_717({
        modelValue: (__VLS_ctx.joinCampaignId),
        label: "Campaign ID",
        hideDetails: true,
        dense: true,
    }));
    const __VLS_719 = __VLS_718({
        modelValue: (__VLS_ctx.joinCampaignId),
        label: "Campaign ID",
        hideDetails: true,
        dense: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_718));
    var __VLS_716;
    const __VLS_721 = {}.VCardActions;
    /** @type {[typeof __VLS_components.VCardActions, typeof __VLS_components.vCardActions, typeof __VLS_components.VCardActions, typeof __VLS_components.vCardActions, ]} */ ;
    // @ts-ignore
    const __VLS_722 = __VLS_asFunctionalComponent(__VLS_721, new __VLS_721({}));
    const __VLS_723 = __VLS_722({}, ...__VLS_functionalComponentArgsRest(__VLS_722));
    __VLS_724.slots.default;
    const __VLS_725 = {}.VBtn;
    /** @type {[typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ]} */ ;
    // @ts-ignore
    const __VLS_726 = __VLS_asFunctionalComponent(__VLS_725, new __VLS_725({
        ...{ 'onClick': {} },
        block: true,
        color: "green",
        elevation: "4",
        ...{ class: "mt-4" },
        disabled: (!__VLS_ctx.parsedCampaignFk),
    }));
    const __VLS_727 = __VLS_726({
        ...{ 'onClick': {} },
        block: true,
        color: "green",
        elevation: "4",
        ...{ class: "mt-4" },
        disabled: (!__VLS_ctx.parsedCampaignFk),
    }, ...__VLS_functionalComponentArgsRest(__VLS_726));
    let __VLS_729;
    let __VLS_730;
    let __VLS_731;
    const __VLS_732 = {
        onClick: (__VLS_ctx.confirmJoinCampaign)
    };
    __VLS_728.slots.default;
    var __VLS_728;
    var __VLS_724;
    var __VLS_688;
    var __VLS_684;
    var __VLS_604;
    var __VLS_572;
    var __VLS_568;
}
var __VLS_15;
var __VLS_11;
/** @type {__VLS_StyleScopedClasses['text-center']} */ ;
/** @type {__VLS_StyleScopedClasses['cinzel-text']} */ ;
/** @type {__VLS_StyleScopedClasses['font-weight-black']} */ ;
/** @type {__VLS_StyleScopedClasses['pt-4']} */ ;
/** @type {__VLS_StyleScopedClasses['pb-2']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['text-center']} */ ;
/** @type {__VLS_StyleScopedClasses['text-h2']} */ ;
/** @type {__VLS_StyleScopedClasses['mx-auto']} */ ;
/** @type {__VLS_StyleScopedClasses['pt-0']} */ ;
/** @type {__VLS_StyleScopedClasses['d-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-column']} */ ;
/** @type {__VLS_StyleScopedClasses['pb-12']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-grow-1']} */ ;
/** @type {__VLS_StyleScopedClasses['EventsTabs']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-3']} */ ;
/** @type {__VLS_StyleScopedClasses['text-h5']} */ ;
/** @type {__VLS_StyleScopedClasses['text-h5']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['d-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['align-center']} */ ;
/** @type {__VLS_StyleScopedClasses['ml-2']} */ ;
/** @type {__VLS_StyleScopedClasses['mx-4']} */ ;
/** @type {__VLS_StyleScopedClasses['d-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['my-8']} */ ;
/** @type {__VLS_StyleScopedClasses['list-container']} */ ;
/** @type {__VLS_StyleScopedClasses['py-2']} */ ;
/** @type {__VLS_StyleScopedClasses['pl-1']} */ ;
/** @type {__VLS_StyleScopedClasses['pr-1']} */ ;
/** @type {__VLS_StyleScopedClasses['pt-0']} */ ;
/** @type {__VLS_StyleScopedClasses['event-card']} */ ;
/** @type {__VLS_StyleScopedClasses['season-flag']} */ ;
/** @type {__VLS_StyleScopedClasses['text-center']} */ ;
/** @type {__VLS_StyleScopedClasses['ml-3']} */ ;
/** @type {__VLS_StyleScopedClasses['pt-3']} */ ;
/** @type {__VLS_StyleScopedClasses['text-caption']} */ ;
/** @type {__VLS_StyleScopedClasses['font-weight-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['cinzel-text']} */ ;
/** @type {__VLS_StyleScopedClasses['text-h3']} */ ;
/** @type {__VLS_StyleScopedClasses['font-weight-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-caption']} */ ;
/** @type {__VLS_StyleScopedClasses['font-weight-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['pt-2']} */ ;
/** @type {__VLS_StyleScopedClasses['pb-1']} */ ;
/** @type {__VLS_StyleScopedClasses['pr-1']} */ ;
/** @type {__VLS_StyleScopedClasses['text-caption']} */ ;
/** @type {__VLS_StyleScopedClasses['text-truncate']} */ ;
/** @type {__VLS_StyleScopedClasses['text-caption']} */ ;
/** @type {__VLS_StyleScopedClasses['text-caption']} */ ;
/** @type {__VLS_StyleScopedClasses['ml-3']} */ ;
/** @type {__VLS_StyleScopedClasses['d-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['align-center']} */ ;
/** @type {__VLS_StyleScopedClasses['rewards-container']} */ ;
/** @type {__VLS_StyleScopedClasses['mr-1']} */ ;
/** @type {__VLS_StyleScopedClasses['reward-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['dialog-overlay']} */ ;
/** @type {__VLS_StyleScopedClasses['d-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-left']} */ ;
/** @type {__VLS_StyleScopedClasses['dialog-overlay']} */ ;
/** @type {__VLS_StyleScopedClasses['text-h6']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-end']} */ ;
/** @type {__VLS_StyleScopedClasses['scheduled-box']} */ ;
/** @type {__VLS_StyleScopedClasses['mr-4']} */ ;
/** @type {__VLS_StyleScopedClasses['event-card']} */ ;
/** @type {__VLS_StyleScopedClasses['event-img']} */ ;
/** @type {__VLS_StyleScopedClasses['pa-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-subtitle-1']} */ ;
/** @type {__VLS_StyleScopedClasses['font-weight-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-caption']} */ ;
/** @type {__VLS_StyleScopedClasses['mr-4']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-4']} */ ;
/** @type {__VLS_StyleScopedClasses['event-card']} */ ;
/** @type {__VLS_StyleScopedClasses['text-h6']} */ ;
/** @type {__VLS_StyleScopedClasses['font-weight-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['align-center']} */ ;
/** @type {__VLS_StyleScopedClasses['my-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-subtitle-1']} */ ;
/** @type {__VLS_StyleScopedClasses['font-weight-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-body-2']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-4']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-2']} */ ;
/** @type {__VLS_StyleScopedClasses['ml-0']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-2']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-0']} */ ;
/** @type {__VLS_StyleScopedClasses['d-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['my-8']} */ ;
/** @type {__VLS_StyleScopedClasses['list-container']} */ ;
/** @type {__VLS_StyleScopedClasses['py-2']} */ ;
/** @type {__VLS_StyleScopedClasses['pl-1']} */ ;
/** @type {__VLS_StyleScopedClasses['pr-1']} */ ;
/** @type {__VLS_StyleScopedClasses['pt-0']} */ ;
/** @type {__VLS_StyleScopedClasses['event-card']} */ ;
/** @type {__VLS_StyleScopedClasses['season-flag']} */ ;
/** @type {__VLS_StyleScopedClasses['status-icon-container']} */ ;
/** @type {__VLS_StyleScopedClasses['text-center']} */ ;
/** @type {__VLS_StyleScopedClasses['ml-3']} */ ;
/** @type {__VLS_StyleScopedClasses['pt-3']} */ ;
/** @type {__VLS_StyleScopedClasses['text-caption']} */ ;
/** @type {__VLS_StyleScopedClasses['font-weight-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['cinzel-text']} */ ;
/** @type {__VLS_StyleScopedClasses['text-h3']} */ ;
/** @type {__VLS_StyleScopedClasses['font-weight-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-caption']} */ ;
/** @type {__VLS_StyleScopedClasses['font-weight-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['pt-2']} */ ;
/** @type {__VLS_StyleScopedClasses['pr-10']} */ ;
/** @type {__VLS_StyleScopedClasses['pb-1']} */ ;
/** @type {__VLS_StyleScopedClasses['pr-1']} */ ;
/** @type {__VLS_StyleScopedClasses['text-caption']} */ ;
/** @type {__VLS_StyleScopedClasses['text-truncate']} */ ;
/** @type {__VLS_StyleScopedClasses['text-caption']} */ ;
/** @type {__VLS_StyleScopedClasses['text-caption']} */ ;
/** @type {__VLS_StyleScopedClasses['ml-3']} */ ;
/** @type {__VLS_StyleScopedClasses['d-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['align-center']} */ ;
/** @type {__VLS_StyleScopedClasses['rewards-container']} */ ;
/** @type {__VLS_StyleScopedClasses['mr-1']} */ ;
/** @type {__VLS_StyleScopedClasses['reward-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['text-center']} */ ;
/** @type {__VLS_StyleScopedClasses['pa-6']} */ ;
/** @type {__VLS_StyleScopedClasses['dialog-overlay']} */ ;
/** @type {__VLS_StyleScopedClasses['d-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['align-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-space-between']} */ ;
/** @type {__VLS_StyleScopedClasses['pl-8']} */ ;
/** @type {__VLS_StyleScopedClasses['text-h6']} */ ;
/** @type {__VLS_StyleScopedClasses['font-weight-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['pa-0']} */ ;
/** @type {__VLS_StyleScopedClasses['mr-2']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-1']} */ ;
/** @type {__VLS_StyleScopedClasses['pl-6']} */ ;
/** @type {__VLS_StyleScopedClasses['text-caption']} */ ;
/** @type {__VLS_StyleScopedClasses['scheduled-box']} */ ;
/** @type {__VLS_StyleScopedClasses['ma-0']} */ ;
/** @type {__VLS_StyleScopedClasses['text-center']} */ ;
/** @type {__VLS_StyleScopedClasses['pt-8']} */ ;
/** @type {__VLS_StyleScopedClasses['text-center']} */ ;
/** @type {__VLS_StyleScopedClasses['px-5']} */ ;
/** @type {__VLS_StyleScopedClasses['d-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['align-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-subtitle-2']} */ ;
/** @type {__VLS_StyleScopedClasses['font-weight-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['my-0']} */ ;
/** @type {__VLS_StyleScopedClasses['mr-2']} */ ;
/** @type {__VLS_StyleScopedClasses['py-0']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['py-0']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-8']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['mr-4']} */ ;
/** @type {__VLS_StyleScopedClasses['event-card']} */ ;
/** @type {__VLS_StyleScopedClasses['event-img']} */ ;
/** @type {__VLS_StyleScopedClasses['pa-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-subtitle-1']} */ ;
/** @type {__VLS_StyleScopedClasses['font-weight-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-caption']} */ ;
/** @type {__VLS_StyleScopedClasses['mr-4']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-4']} */ ;
/** @type {__VLS_StyleScopedClasses['event-card']} */ ;
/** @type {__VLS_StyleScopedClasses['text-h6']} */ ;
/** @type {__VLS_StyleScopedClasses['font-weight-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['align-center']} */ ;
/** @type {__VLS_StyleScopedClasses['my-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-subtitle-1']} */ ;
/** @type {__VLS_StyleScopedClasses['font-weight-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-body-2']} */ ;
/** @type {__VLS_StyleScopedClasses['dialog-overlay']} */ ;
/** @type {__VLS_StyleScopedClasses['text-h6']} */ ;
/** @type {__VLS_StyleScopedClasses['dialog-overlay']} */ ;
/** @type {__VLS_StyleScopedClasses['d-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-space-between']} */ ;
/** @type {__VLS_StyleScopedClasses['align-center']} */ ;
/** @type {__VLS_StyleScopedClasses['pa-0']} */ ;
/** @type {__VLS_StyleScopedClasses['text-h6']} */ ;
/** @type {__VLS_StyleScopedClasses['ml-4']} */ ;
/** @type {__VLS_StyleScopedClasses['pa-0']} */ ;
/** @type {__VLS_StyleScopedClasses['d-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-column']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-2']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-2']} */ ;
/** @type {__VLS_StyleScopedClasses['dialog-overlay']} */ ;
/** @type {__VLS_StyleScopedClasses['d-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-space-between']} */ ;
/** @type {__VLS_StyleScopedClasses['align-center']} */ ;
/** @type {__VLS_StyleScopedClasses['pa-0']} */ ;
/** @type {__VLS_StyleScopedClasses['text-h6']} */ ;
/** @type {__VLS_StyleScopedClasses['ml-4']} */ ;
/** @type {__VLS_StyleScopedClasses['pa-0']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-4']} */ ;
/** @type {__VLS_StyleScopedClasses['dialog-overlay']} */ ;
/** @type {__VLS_StyleScopedClasses['d-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-space-between']} */ ;
/** @type {__VLS_StyleScopedClasses['align-center']} */ ;
/** @type {__VLS_StyleScopedClasses['pa-0']} */ ;
/** @type {__VLS_StyleScopedClasses['text-h6']} */ ;
/** @type {__VLS_StyleScopedClasses['ml-4']} */ ;
/** @type {__VLS_StyleScopedClasses['pa-0']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-4']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            BaseAlert: BaseAlert,
            extractMonth: extractMonth,
            extractDay: extractDay,
            extractTime: extractTime,
            formatEventDate: formatEventDate,
            loading: loading,
            activeTab: activeTab,
            events: events,
            dialog: dialog,
            selectedEvent: selectedEvent,
            eventRewards: eventRewards,
            alertType: alertType,
            alertMessage: alertMessage,
            showPast: showPast,
            myEvents: myEvents,
            myDialog: myDialog,
            selectedMyEvent: selectedMyEvent,
            showQuitConfirmDialog: showQuitConfirmDialog,
            isRefreshingStatus: isRefreshingStatus,
            showQuitSuccessAlert: showQuitSuccessAlert,
            showQuitErrorAlert: showQuitErrorAlert,
            quitErrorMessage: quitErrorMessage,
            sharedLink: sharedLink,
            showDialog: showDialog,
            showAlert: showAlert,
            showCampaignDialog: showCampaignDialog,
            showLoadDialog: showLoadDialog,
            campaigns: campaigns,
            selectedLoadCampaign: selectedLoadCampaign,
            showJoinCampaignDialog: showJoinCampaignDialog,
            joinCampaignId: joinCampaignId,
            getSeasonInfo: getSeasonInfo,
            userTimezone: userTimezone,
            sortedEvents: sortedEvents,
            currentPlayer: currentPlayer,
            parsedCampaignFk: parsedCampaignFk,
            openInGoogleMaps: openInGoogleMaps,
            openDialog: openDialog,
            handleNewCampaign: handleNewCampaign,
            loadCampaign: loadCampaign,
            confirmLoadCampaign: confirmLoadCampaign,
            openMyEventsDialog: openMyEventsDialog,
            refreshEventStatus: refreshEventStatus,
            quitEvent: quitEvent,
            confirmQuitEvent: confirmQuitEvent,
            shareEvent: shareEvent,
            copyLink: copyLink,
            getEventStatusInfo: getEventStatusInfo,
            confirmJoinCampaign: confirmJoinCampaign,
            joinEvent: joinEvent,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
