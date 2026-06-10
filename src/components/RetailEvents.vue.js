/// <reference types="../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import { ref, computed, watch, onMounted, onUnmounted, inject, nextTick, } from "vue";
import { useUserStore } from "@/store/UserStore";
import { useRouter, useRoute } from "vue-router";
import { useTutorialStore } from "@/store/TutorialStore";
import TutorialPromptDialog from "@/components/dialogs/TutorialPromptDialog.vue";
import ManageEventDialog from "@/components/dialogs/ManageEventDialog.vue";
import s1flag from "@/assets/s1flag.png";
import s2flag from "@/assets/s2flag.png";
import { extractMonth, extractDay, extractTime, formatEventDate, parseApiDate, } from "@/utils/dateHelpers";
const userStore = useUserStore();
const router = useRouter();
const route = useRoute();
const tutorialStore = useTutorialStore();
const axios = inject("axios");
const LOCKED_RETAILER_SEASON_PK = 3;
const RETAILER_ALLOWED_SCENERIES = [5, 6];
const FALLBACK_RETAILER_SEASON = {
    seasons_pk: LOCKED_RETAILER_SEASON_PK,
    name: "Season 2",
};
const createDefaultNewEvent = () => ({
    date: "",
    hour: "12",
    minute: "00",
    ampm: "AM",
    store: "",
    season: 2,
    scenario: null,
    address: "",
});
const showTutorialPrompt = ref(false);
const isEditable = ref(false);
const selectedRewards = ref([]);
const dialog = ref(false);
const manageDialog = ref(false);
const selectedEvent = ref(null);
const activeTab = ref(1);
const sortBy = ref("date");
const events = ref([]);
const sceneries = ref([]);
const userCreatedEvents = ref([]);
const createEventDialog = ref(false);
const newEvent = ref(createDefaultNewEvent());
const stores = ref([]);
const editEventDialog = ref(false);
const editableEvent = ref({ rewards_pk: [] });
const showSuccessAlert = ref(false);
const existingRewards = ref([]);
const allRewards = ref([]);
const eventRewards = ref([]);
const showPast = ref(false);
const loading = ref(false);
const errorDialog = ref({
    show: false,
    message: "",
});
const successDialog = ref(false);
const eventsInterval = ref(null);
const turnAwayConfirmDialog = ref({
    show: false,
    player: null,
});
const seasons = ref([]);
const manageDialogRef = ref(null);
const lastCreatedEventId = ref(null);
const lastCreatedEventFallback = ref(null);
const pendingSuccessAfterTutorial = ref(false);
const openingManageDialog = ref(false);
const getSeasonInfo = (fk) => {
    if (fk == 2)
        return { flag: s1flag, name: "Season 1" };
    if (fk == 3)
        return { flag: s2flag, name: "Season 2" };
    return { flag: null, name: "" };
};
const getRetailWingLabel = (sceneryPk) => {
    if (sceneryPk === 2)
        return "Wing 1 Tutorial";
    if (sceneryPk === 3)
        return "Wing 1 Advanced";
    if (sceneryPk === 4)
        return "Wing 2 Advanced";
    if (sceneryPk === 5)
        return "Wing 3";
    if (sceneryPk === 6)
        return "Wing 4";
    return "";
};
const decorateScenario = (scenario) => {
    const wingLabel = getRetailWingLabel(scenario.sceneries_pk);
    return {
        ...scenario,
        wingLabel,
        displayName: wingLabel ? `${wingLabel} - ${scenario.name}` : scenario.name,
    };
};
const sortRetailScenarios = (a, b) => RETAILER_ALLOWED_SCENERIES.indexOf(a.sceneries_pk) -
    RETAILER_ALLOWED_SCENERIES.indexOf(b.sceneries_pk);
const getStoreDisplayName = (store) => (store && (store.name || store.storename)) || "";
const buildStoreAddress = (store) => {
    if (!store)
        return "";
    return [
        store.address,
        store.streetNumber,
        store.complement,
        store.city,
        store.state,
    ]
        .filter(Boolean)
        .join(", ");
};
const findStoreByNameInList = (storeList, selectedStoreName) => {
    const normalizedName = selectedStoreName
        ? selectedStoreName.toLowerCase().trim()
        : "";
    if (!normalizedName)
        return null;
    return (storeList.find((store) => getStoreDisplayName(store).toLowerCase().trim() === normalizedName) || null);
};
const findStoreByName = (selectedStoreName) => findStoreByNameInList(stores.value, selectedStoreName);
const userTimezone = computed(() => userStore.user?.timezone?.iana_name ?? "America/Chicago");
const retailerSeasonOptions = computed(() => {
    const allowedSg = seasons.value.filter((season) => season.seasons_pk === 2 || season.seasons_pk === 3);
    const items = allowedSg.length === 0
        ? [
            { seasons_pk: 2, name: "Season 1" },
            { seasons_pk: 3, name: "Season 2" }
        ]
        : allowedSg.map(s => ({ seasons_pk: s.seasons_pk, name: s.name }));
    return items.map(item => {
        if (item.seasons_pk === 3) {
            return {
                ...item,
                disabled: true
            };
        }
        return item;
    });
});
const availableStores = computed(() => {
    const names = stores.value
        .map((store) => getStoreDisplayName(store))
        .filter(Boolean);
    return [...new Set(names)];
});
const hourOptions = Array.from({ length: 12 }, (_, index) => String(index + 1).padStart(2, "0"));
const minuteOptions = ["00", "15", "30", "45"];
const confirmTurnAway = (player) => {
    turnAwayConfirmDialog.value = {
        show: true,
        player: player,
    };
};
const executeTurnAway = () => {
    if (turnAwayConfirmDialog.value.player) {
        turnAwayConfirmDialog.value = { show: false, player: null };
    }
};
const sortedEvents = computed(() => {
    if (sortBy.value === "date") {
        return events.value.sort((a, b) => new Date(a.date) - new Date(b.date));
    }
    return events.value;
});
const filteredScenarios = computed(() => {
    const currentSeason = newEvent.value.season;
    if (currentSeason === 2) {
        return sceneries.value
            .filter((scenario) => [3, 4].includes(scenario.sceneries_pk))
            .sort((a, b) => a.sceneries_pk - b.sceneries_pk)
            .map(decorateScenario);
    }
    if (currentSeason === 3) {
        return sceneries.value
            .filter((scenario) => [5, 6].includes(scenario.sceneries_pk))
            .sort((a, b) => a.sceneries_pk - b.sceneries_pk)
            .map(decorateScenario);
    }
    return [];
});
const editableScenarios = computed(() => {
    const currentSeason = editableEvent.value.seasons_fk ?? selectedEvent.value?.seasons_fk;
    if (currentSeason === 2) {
        return sceneries.value
            .filter((scenario) => [3, 4].includes(scenario.sceneries_pk))
            .map(decorateScenario);
    }
    if (currentSeason === LOCKED_RETAILER_SEASON_PK) {
        return sceneries.value
            .filter((scenario) => RETAILER_ALLOWED_SCENERIES.includes(scenario.sceneries_pk))
            .sort(sortRetailScenarios)
            .map(decorateScenario);
    }
    return sceneries.value.map(decorateScenario);
});
const editableRewardsItems = computed(() => {
    if (!editableEvent.value.rewards_pk)
        return [];
    return editableEvent.value.rewards_pk
        .map((pk) => allRewards.value.find((r) => r.rewards_pk === pk))
        .filter(Boolean);
});
const createEventReady = computed(() => !!newEvent.value.store &&
    !!newEvent.value.season &&
    !!newEvent.value.scenario &&
    !!newEvent.value.date &&
    isValid12HourTime(getFormattedNewEventTime()) &&
    !!newEvent.value.ampm);
const openInGoogleMaps = () => {
    const event = selectedEvent.value;
    if (!event?.store_name || event.latitude == null || event.longitude == null)
        return;
    const encodedName = event.store_name.split(" ").join("+");
    const lat = event.latitude;
    const lng = event.longitude;
    const query = `${encodedName}%20${lat},${lng}`;
    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${query}`;
    window.open(mapsUrl, "_blank");
};
const normalize12HourTime = (value) => {
    if (!value || value.length !== 5 || !value.includes(":"))
        return;
    let [hh, mm] = value.split(":");
    hh = parseInt(hh);
    mm = parseInt(mm);
    if (isNaN(hh) || hh < 1)
        hh = 1;
    if (hh > 12)
        hh = 12;
    if (isNaN(mm))
        mm = 0;
    if (mm > 59)
        mm = 59;
    return `${hh.toString().padStart(2, "0")}:${mm.toString().padStart(2, "0")}`;
};
const validateTime = () => {
    editableEvent.value.hour = normalize12HourTime(editableEvent.value.hour);
};
const validateNewEventTime = () => {
    const normalizedHour = String(newEvent.value.hour || "").padStart(2, "0");
    if (hourOptions.includes(normalizedHour)) {
        newEvent.value.hour = normalizedHour;
    }
    if (!minuteOptions.includes(newEvent.value.minute)) {
        newEvent.value.minute = "00";
    }
};
const isValid12HourTime = (value) => /^(0[1-9]|1[0-2]):[0-5][0-9]$/.test(value);
const getFormattedNewEventTime = () => `${String(newEvent.value.hour || "").padStart(2, "0")}:${String(newEvent.value.minute || "00").padStart(2, "0")}`;
const ensureRetailerSeasonLocked = () => {
    if (!newEvent.value.season) {
        newEvent.value.season = 2;
    }
};
const resetCreateEventForm = () => {
    newEvent.value = createDefaultNewEvent();
    selectedRewards.value = [];
    errorDialog.value = {
        show: false,
        message: "",
    };
};
const openManageDialog = (event) => {
    selectedEvent.value = event;
    manageDialog.value = true;
};
const handleRefresh = () => {
    fetchUserCreatedEvents(showPast.value);
    fetchPlayerEvents(showPast.value);
};
const startOfToday = new Date();
startOfToday.setHours(0, 0, 0, 0);
const dateRules = [
    (value) => {
        if (!value)
            return "The date is required.";
        const inputDate = new Date(`${value}T00:00:00`);
        if (inputDate < startOfToday) {
            return "The date cannot be in the past.";
        }
        if (inputDate > oneYearFromToday) {
            return "The date cannot be more than 1 year in the future.";
        }
        return true;
    },
];
const today = new Date();
const todayISO = today.toISOString().split("T")[0];
const oneYearFromToday = new Date();
oneYearFromToday.setFullYear(today.getFullYear() + 1);
const oneYearFromTodayISO = oneYearFromToday.toISOString().split("T")[0];
const openDialog = (event) => {
    selectedEvent.value = event;
    dialog.value = true;
    axios
        .get("/rl_events_rewards/list_rewards", {
        params: { events_fk: event.events_pk },
        headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
    })
        .then((res) => {
        eventRewards.value = res.data.rewards || [];
    })
        .catch(() => {
        eventRewards.value = [];
    });
};
const fetchPlayerEvents = async (past, isPolling = false) => {
    if (!isPolling)
        loading.value = true;
    try {
        const { data } = await axios.get("/events/list_events/", {
            params: {
                player_fk: userStore.user.users_pk,
                past_events: past.toString(),
            },
            headers: {
                Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
        });
        const eventsData = data.events || [];
        const eventsWithRewards = await Promise.all(eventsData.map(async (event) => {
            try {
                const rewardsResponse = await axios.get("/rl_events_rewards/list_rewards", {
                    params: { events_fk: event.events_pk },
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                    },
                });
                const rewards = rewardsResponse.data.rewards || [];
                const formattedRewards = rewards.map((r) => ({
                    ...r,
                    image: `https://assets.drunagor.app/${r.picture_hash}`,
                }));
                return { ...event, rewards: formattedRewards };
            }
            catch (rewardError) {
                return { ...event, rewards: [] };
            }
        }));
        events.value = eventsWithRewards;
    }
    catch (err) {
        console.error("Error fetching player events:", err);
        events.value = [];
    }
    finally {
        if (!isPolling)
            loading.value = false;
    }
};
const fetchUserCreatedEvents = async (past, isPolling = false) => {
    if (!isPolling)
        loading.value = true;
    try {
        const params = {
            retailer_fk: userStore.user.users_pk,
            active: "true",
            past_events: past.toString(),
            limit: 30,
            offset: 0,
        };
        const { data } = await axios.get("/events/my_events/retailer", {
            params,
            headers: {
                Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
        });
        const eventsData = data.events || [];
        const eventsWithRewards = await Promise.all(eventsData.map(async (event) => {
            try {
                const rewardsResponse = await axios.get("/rl_events_rewards/list_rewards", {
                    params: { events_fk: event.events_pk },
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                    },
                });
                const rewards = rewardsResponse.data.rewards || [];
                const formattedRewards = rewards.map((r) => ({
                    ...r,
                    image: `https://assets.drunagor.app/${r.picture_hash}`,
                }));
                return { ...event, rewards: formattedRewards };
            }
            catch (rewardError) {
                return { ...event, rewards: [] };
            }
        }));
        userCreatedEvents.value = eventsWithRewards;
    }
    catch (error) {
        console.error("Error fetching my events:", error);
        userCreatedEvents.value = [];
    }
    finally {
        if (!isPolling)
            loading.value = false;
    }
};
const fetchSeasons = async () => {
    try {
        const { data } = await axios.get("/seasons/search", {
            params: { active: true },
            headers: {
                Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
        });
        seasons.value = data.seasons || [];
    }
    catch (error) {
        console.error("Error fetching seasons:", error);
    }
};
const fetchSceneries = async () => {
    await axios
        .get("/sceneries/search", {
        params: { active: true },
        headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
    })
        .then((response) => {
        sceneries.value = [...response.data.sceneries];
    })
        .catch((error) => {
        console.error("Error fetching sceneries:", error);
    });
};
const removeReward = async (reward) => {
    try {
        const relationPk = reward.rl_events_rewards_pk;
        await axios.put(`/rl_events_rewards/alter/${relationPk}`, {
            events_fk: selectedEvent.value.events_pk,
            rewards_fk: reward.rewards_pk,
            active: false,
        }, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
        });
        existingRewards.value = existingRewards.value.filter((r) => r.rl_events_rewards_pk !== relationPk);
        editableEvent.value.rewards_pk = editableEvent.value.rewards_pk.filter((id) => id !== reward.rewards_pk);
    }
    catch (err) {
        console.error("Error removing reward:", err);
        errorDialog.value = { show: true, message: "Failed to remove reward." };
    }
};
const addEvent = () => {
    loading.value = true;
    errorDialog.value.show = false;
    successDialog.value = false;
    const userId = userStore.user.users_pk;
    ensureRetailerSeasonLocked();
    validateNewEventTime();
    if (!newEvent.value.date ||
        !newEvent.value.store ||
        !newEvent.value.season ||
        !newEvent.value.scenario ||
        !userId) {
        errorDialog.value = {
            show: true,
            message: "Please fill in all fields before creating the event.",
        };
        loading.value = false;
        return;
    }
    const formattedTime = getFormattedNewEventTime();
    if (!isValid12HourTime(formattedTime)) {
        errorDialog.value = {
            show: true,
            message: "Please enter a valid time in HH:MM format.",
        };
        loading.value = false;
        return;
    }
    axios
        .get("/stores/list", {
        params: { users_fk: userId },
        headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
    })
        .then(({ data }) => {
        const allStores = data.stores || [];
        const found = findStoreByNameInList(allStores, newEvent.value.store);
        if (!found)
            throw new Error("StoreNotFound");
        if (!found.active)
            throw new Error("StoreInactive");
        if (!found.verified)
            throw new Error("StoreUnverified");
        return {
            storesFk: found.stores_pk,
            storeAddress: buildStoreAddress(found),
        };
    })
        .then(({ storesFk, storeAddress }) => {
        const date = `${newEvent.value.date}; ${formattedTime} ${newEvent.value.ampm || "AM"}`;
        return axios
            .post("/events/cadastro", null, {
            params: {
                seats_number: 4,
                seasons_fk: newEvent.value.season,
                sceneries_fk: newEvent.value.scenario,
                date,
                stores_fk: storesFk,
                users_fk: userId,
                active: true,
            },
            headers: {
                Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
        })
            .then(({ data }) => ({ data, storeAddress }));
    })
        .then(async ({ data, storeAddress }) => {
        const created = data.event;
        const id = created?.events_pk;
        if (!id)
            throw new Error("EventCreationFailed");
        lastCreatedEventId.value = id;
        lastCreatedEventFallback.value = {
            ...created,
            events_pk: id,
            store_name: newEvent.value.store,
            address: storeAddress || newEvent.value.address,
            scenario: filteredScenarios.value.find((scenario) => scenario.sceneries_pk === newEvent.value.scenario)?.name || "",
        };
        await createInitialTableForEvent(id);
        return Promise.all(selectedRewards.value.map((reward) => axios
            .post("/rl_events_rewards/cadastro", {
            events_fk: id,
            rewards_fk: reward.rewards_pk,
            active: true,
        }, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
        })
            .catch(() => null))).then(() => id);
    })
        .then(() => {
        createEventDialog.value = false;
        fetchUserCreatedEvents(showPast.value);
        if (tutorialStore.shouldShowInitialSetup) {
            pendingSuccessAfterTutorial.value = true;
            showTutorialPrompt.value = true;
        }
        else {
            successDialog.value = true;
        }
        resetCreateEventForm();
    })
        .catch((err) => {
        const knownMessages = {
            StoreNotFound: "We couldn't find the selected store. Please choose a valid store and try again.",
            StoreInactive: "This store is inactive and can't host events right now.",
            StoreUnverified: "This store still needs verification before creating events.",
            EventCreationFailed: "The event could not be created correctly. Please try again.",
        };
        if (knownMessages[err.message]) {
            errorDialog.value = {
                show: true,
                message: knownMessages[err.message],
            };
            return;
        }
        console.error("Unexpected error:", err);
        errorDialog.value = {
            show: true,
            message: err.response?.data?.message ||
                "An error occurred while creating the event.",
        };
    })
        .finally(() => {
        loading.value = false;
    });
};
const createInitialTableForEvent = async (eventPk) => {
    try {
        await axios.post("/event_tables/create", {
            events_fk: eventPk,
            max_players: 4,
            active: true,
        }, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
        });
    }
    catch (err) {
        console.error("Error creating initial table:", err);
    }
};
const handleEventCreatedOk = async () => {
    successDialog.value = false;
    openingManageDialog.value = true;
    try {
        await fetchUserCreatedEvents(showPast.value);
    }
    catch (_) { }
    let eventToOpen = null;
    if (lastCreatedEventId.value) {
        eventToOpen = userCreatedEvents.value.find((e) => e.events_pk === lastCreatedEventId.value);
    }
    if (!eventToOpen && lastCreatedEventFallback.value) {
        eventToOpen = lastCreatedEventFallback.value;
    }
    if (!eventToOpen) {
        openingManageDialog.value = false;
        return;
    }
    openManageDialog(eventToOpen);
    await nextTick();
    await new Promise((resolve) => setTimeout(resolve, 100));
    manageDialogRef.value?.openTablesAndStartQrTutorial?.();
    activeTab.value = 2;
    await nextTick();
    openingManageDialog.value = false;
};
const deleteEvent = (events_pk) => {
    axios
        .delete(`/events/${events_pk}/delete/`, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
    })
        .then(() => {
        fetchUserCreatedEvents(showPast.value);
        fetchPlayerEvents(showPast.value);
    })
        .catch((error) => {
        console.error("Error deleting event:", error);
    });
};
const openCreateEventDialog = () => {
    ensureRetailerSeasonLocked();
    createEventDialog.value = true;
};
const openEditDialog = (event, editable = false) => {
    const parsed = parseApiDate(event.event_date);
    const hours24 = parsed ? parsed.getHours() : 0;
    const minutes = parsed ? String(parsed.getMinutes()).padStart(2, "0") : "00";
    const datePart = parsed
        ? `${parsed.getFullYear()}-${String(parsed.getMonth() + 1).padStart(2, "0")}-${String(parsed.getDate()).padStart(2, "0")}`
        : "";
    const hours12 = hours24 % 12 || 12;
    const ampm = hours24 >= 12 ? "PM" : "AM";
    editableEvent.value = {
        events_pk: event.events_pk,
        date: datePart,
        hour: `${String(hours12).padStart(2, "0")}:${minutes}`,
        ampm,
        seats_number: event.seats_number,
        seasons_fk: event.seasons_fk,
        sceneries_fk: event.sceneries_fk,
        store: event.store_name,
        rewards: event.rewards || [],
    };
    eventRewards.value = [];
    selectedEvent.value = event;
    isEditable.value = editable;
    editEventDialog.value = true;
    let chain = Promise.resolve();
    if (!sceneries.value.length) {
        chain = chain.then(() => fetchSceneries());
    }
    chain = chain.then(() => {
        const found = sceneries.value.find((s) => s.name === event.scenario);
        editableEvent.value.sceneries_fk = found ? found.sceneries_pk : null;
    });
    if (editable) {
        chain = chain
            .then(() => axios.get("/rl_events_rewards/list_rewards", {
            params: { events_fk: event.events_pk },
        }))
            .then(({ data }) => {
            existingRewards.value = data.rewards || [];
            editableEvent.value.rewards_pk = existingRewards.value.map((r) => r.rewards_pk);
        })
            .catch((err) => {
            console.error("Error fetching existing rewards:", err);
            existingRewards.value = [];
            editableEvent.value.rewards_pk = [];
        });
    }
    chain = chain
        .then(() => fetchAllRewards())
        .catch((err) => {
        console.error("Error fetching all rewards:", err);
    });
    return chain;
};
const saveEditedEvent = () => {
    loading.value = true;
    const eventPk = editableEvent.value.events_pk;
    if (!eventPk) {
        console.error("Event without events_pk");
        return;
    }
    axios
        .get("/stores/list", {
        params: { users_fk: userStore.user.users_pk },
        headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
    })
        .then((response) => {
        const allStores = response.data.stores || [];
        const foundStore = findStoreByNameInList(allStores, editableEvent.value.store);
        if (!foundStore) {
            console.error(`Store "${editableEvent.value.store}" not found`);
            throw new Error("StoreNotFound");
        }
        return foundStore.stores_pk;
    })
        .then((storesFk) => {
        const seasonsFk = editableEvent.value.seasons_fk ??
            selectedEvent.value?.seasons_fk ??
            LOCKED_RETAILER_SEASON_PK;
        const hour = (editableEvent.value.hour || "12:00").trim();
        const ampm = editableEvent.value.ampm || "PM";
        const dateFormatted = `${editableEvent.value.date}; ${hour} ${ampm}`;
        const payload = {
            events_pk: eventPk,
            seats_number: editableEvent.value.seats_number,
            seasons_fk: seasonsFk,
            sceneries_fk: editableEvent.value.sceneries_fk,
            date: dateFormatted,
            stores_fk: storesFk,
        };
        return axios.put("/events/alter", payload, {
            params: { events_pk: eventPk },
        });
    })
        .then(() => {
        const before = existingRewards.value.map((r) => r.rewards_pk);
        const after = editableEvent.value.rewards_pk;
        const toAdd = after.filter((id) => !before.includes(id));
        const toRemove = before.filter((id) => !after.includes(id));
        const promises = [
            ...toAdd.map((id) => axios.post("/rl_events_rewards/cadastro", { events_fk: eventPk, rewards_fk: id, active: true }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                },
            })),
            ...toRemove.map((id) => axios.post("/rl_events_rewards/cadastro", { events_fk: eventPk, rewards_fk: id, active: false }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                },
            })),
        ];
        return Promise.all(promises);
    })
        .then(() => {
        showSuccessAlert.value = true;
        setTimeout(() => {
            editEventDialog.value = false;
            fetchUserCreatedEvents(showPast.value);
            fetchPlayerEvents(showPast.value);
        }, 1500);
    })
        .catch((error) => {
        if (error.message === "StoreNotFound")
            return;
        console.error("Error saving event:", error);
        loading.value = false;
    })
        .finally(() => {
        loading.value = false;
    });
};
const fetchAllRewards = () => {
    axios
        .get("/rewards/search", {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
    })
        .then((res) => {
        allRewards.value = res.data.rewards || [];
    })
        .catch((err) => {
        console.error("Error fetching rewards:", err);
    });
};
const handleTutorialCompleted = () => {
    if (pendingSuccessAfterTutorial.value) {
        pendingSuccessAfterTutorial.value = false;
        successDialog.value = true;
    }
};
onMounted(async () => {
    if (route.query.action === "create") {
        activeTab.value = 2;
        openCreateEventDialog();
        router.replace({ query: null });
    }
    await axios
        .get("/stores/list", {
        params: { users_fk: userStore.user.users_pk },
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
    fetchSeasons();
    fetchSceneries();
    fetchAllRewards();
    await fetchPlayerEvents(showPast.value);
    await fetchUserCreatedEvents(showPast.value);
    eventsInterval.value = setInterval(() => {
        if (activeTab.value === 1) {
            fetchPlayerEvents(showPast.value, true);
        }
        else {
            fetchUserCreatedEvents(showPast.value, true);
        }
    }, 5000);
});
watch(() => newEvent.value.season, () => {
    newEvent.value.scenario = null;
});
watch(createEventDialog, (isOpen) => {
    if (isOpen) {
        ensureRetailerSeasonLocked();
        return;
    }
    resetCreateEventForm();
});
watch(filteredScenarios, (scenarioOptions) => {
    const hasSelectedScenario = scenarioOptions.some((scenario) => scenario.sceneries_pk === newEvent.value.scenario);
    if (!hasSelectedScenario) {
        newEvent.value.scenario = null;
    }
});
onUnmounted(() => {
    clearInterval(eventsInterval.value);
});
watch(showPast, async (novo) => {
    if (activeTab.value == 1) {
        await fetchPlayerEvents(novo);
    }
    else {
        await fetchUserCreatedEvents(novo);
    }
});
watch(activeTab, async (novo) => {
    if (novo == 1) {
        await fetchPlayerEvents(showPast.value);
    }
    else {
        await fetchUserCreatedEvents(showPast.value);
    }
});
watch(() => newEvent.value.store, (selectedStoreName) => {
    const selectedStore = findStoreByName(selectedStoreName);
    if (selectedStore) {
        newEvent.value.address = buildStoreAddress(selectedStore);
    }
    else {
        newEvent.value.address = "";
    }
});
watch(() => newEvent.value.scenario, (newScenarioPk) => {
    if (!newScenarioPk) {
        selectedRewards.value = [];
        return;
    }
    let targetRewardPk = null;
    if (newScenarioPk === 5)
        targetRewardPk = 5;
    else if (newScenarioPk === 6)
        targetRewardPk = 6;
    else if (newScenarioPk === 2 || newScenarioPk === 3)
        targetRewardPk = 2; // Wing 1 Tutorial / Wing 1 Advanced -> Tutorial Completed
    else if (newScenarioPk === 4)
        targetRewardPk = 3; // Wing 2 Advanced -> Season 1 Completed
    if (targetRewardPk) {
        const rewardObject = allRewards.value.find((r) => r.rewards_pk === targetRewardPk);
        if (rewardObject) {
            selectedRewards.value = [rewardObject];
        }
    }
});
watch(() => editableEvent.value.sceneries_fk, (newScenarioPk) => {
    const currentSeason = editableEvent.value.seasons_fk ?? selectedEvent.value?.seasons_fk;
    if (currentSeason !== 2 && currentSeason !== LOCKED_RETAILER_SEASON_PK)
        return;
    if (!newScenarioPk) {
        editableEvent.value.rewards_pk = [];
        return;
    }
    let targetRewardPk = null;
    if (newScenarioPk === 5)
        targetRewardPk = 5;
    else if (newScenarioPk === 6)
        targetRewardPk = 6;
    else if (newScenarioPk === 2 || newScenarioPk === 3)
        targetRewardPk = 2; // Wing 1 Tutorial / Wing 1 Advanced -> Tutorial Completed
    else if (newScenarioPk === 4)
        targetRewardPk = 3; // Wing 2 Advanced -> Season 1 Completed
    if (targetRewardPk) {
        editableEvent.value.rewards_pk = [targetRewardPk];
    }
});
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['map-link']} */ ;
/** @type {__VLS_StyleScopedClasses['sort-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['scheduled-box']} */ ;
/** @type {__VLS_StyleScopedClasses['event-card']} */ ;
/** @type {__VLS_StyleScopedClasses['event-card']} */ ;
/** @type {__VLS_StyleScopedClasses['create-event-header']} */ ;
/** @type {__VLS_StyleScopedClasses['close-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['download-fab']} */ ;
/** @type {__VLS_StyleScopedClasses['create-event-header']} */ ;
/** @type {__VLS_StyleScopedClasses['create-event-header']} */ ;
/** @type {__VLS_StyleScopedClasses['create-event-body']} */ ;
/** @type {__VLS_StyleScopedClasses['create-event-actions']} */ ;
/** @type {__VLS_StyleScopedClasses['create-event-actions']} */ ;
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
    ...{ class: "cinzel-text font-weight-black pt-15 pb-4 justify-center text-center text-h2" },
});
var __VLS_7;
var __VLS_3;
const __VLS_8 = {}.VCol;
/** @type {[typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ]} */ ;
// @ts-ignore
const __VLS_9 = __VLS_asFunctionalComponent(__VLS_8, new __VLS_8({
    cols: "12",
    md: "10",
    ...{ class: "mx-auto" },
}));
const __VLS_10 = __VLS_9({
    cols: "12",
    md: "10",
    ...{ class: "mx-auto" },
}, ...__VLS_functionalComponentArgsRest(__VLS_9));
__VLS_11.slots.default;
const __VLS_12 = {}.VCard;
/** @type {[typeof __VLS_components.VCard, typeof __VLS_components.vCard, typeof __VLS_components.VCard, typeof __VLS_components.vCard, ]} */ ;
// @ts-ignore
const __VLS_13 = __VLS_asFunctionalComponent(__VLS_12, new __VLS_12({
    ...{ class: "pb-12" },
    minHeight: "500px",
    color: "#151515",
}));
const __VLS_14 = __VLS_13({
    ...{ class: "pb-12" },
    minHeight: "500px",
    color: "#151515",
}, ...__VLS_functionalComponentArgsRest(__VLS_13));
__VLS_15.slots.default;
if (__VLS_ctx.openingManageDialog) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "page-loading-overlay" },
    });
    const __VLS_16 = {}.VProgressCircular;
    /** @type {[typeof __VLS_components.VProgressCircular, typeof __VLS_components.vProgressCircular, ]} */ ;
    // @ts-ignore
    const __VLS_17 = __VLS_asFunctionalComponent(__VLS_16, new __VLS_16({
        indeterminate: true,
        size: "80",
        color: "primary",
    }));
    const __VLS_18 = __VLS_17({
        indeterminate: true,
        size: "80",
        color: "primary",
    }, ...__VLS_functionalComponentArgsRest(__VLS_17));
}
const __VLS_20 = {}.VDialog;
/** @type {[typeof __VLS_components.VDialog, typeof __VLS_components.vDialog, typeof __VLS_components.VDialog, typeof __VLS_components.vDialog, ]} */ ;
// @ts-ignore
const __VLS_21 = __VLS_asFunctionalComponent(__VLS_20, new __VLS_20({
    modelValue: (__VLS_ctx.errorDialog.show),
    maxWidth: "400",
}));
const __VLS_22 = __VLS_21({
    modelValue: (__VLS_ctx.errorDialog.show),
    maxWidth: "400",
}, ...__VLS_functionalComponentArgsRest(__VLS_21));
__VLS_23.slots.default;
const __VLS_24 = {}.VCard;
/** @type {[typeof __VLS_components.VCard, typeof __VLS_components.vCard, typeof __VLS_components.VCard, typeof __VLS_components.vCard, ]} */ ;
// @ts-ignore
const __VLS_25 = __VLS_asFunctionalComponent(__VLS_24, new __VLS_24({}));
const __VLS_26 = __VLS_25({}, ...__VLS_functionalComponentArgsRest(__VLS_25));
__VLS_27.slots.default;
const __VLS_28 = {}.VCardTitle;
/** @type {[typeof __VLS_components.VCardTitle, typeof __VLS_components.vCardTitle, typeof __VLS_components.VCardTitle, typeof __VLS_components.vCardTitle, ]} */ ;
// @ts-ignore
const __VLS_29 = __VLS_asFunctionalComponent(__VLS_28, new __VLS_28({
    ...{ class: "headline" },
}));
const __VLS_30 = __VLS_29({
    ...{ class: "headline" },
}, ...__VLS_functionalComponentArgsRest(__VLS_29));
__VLS_31.slots.default;
var __VLS_31;
const __VLS_32 = {}.VCardText;
/** @type {[typeof __VLS_components.VCardText, typeof __VLS_components.vCardText, typeof __VLS_components.VCardText, typeof __VLS_components.vCardText, ]} */ ;
// @ts-ignore
const __VLS_33 = __VLS_asFunctionalComponent(__VLS_32, new __VLS_32({}));
const __VLS_34 = __VLS_33({}, ...__VLS_functionalComponentArgsRest(__VLS_33));
__VLS_35.slots.default;
(__VLS_ctx.errorDialog.message);
var __VLS_35;
const __VLS_36 = {}.VCardActions;
/** @type {[typeof __VLS_components.VCardActions, typeof __VLS_components.vCardActions, typeof __VLS_components.VCardActions, typeof __VLS_components.vCardActions, ]} */ ;
// @ts-ignore
const __VLS_37 = __VLS_asFunctionalComponent(__VLS_36, new __VLS_36({}));
const __VLS_38 = __VLS_37({}, ...__VLS_functionalComponentArgsRest(__VLS_37));
__VLS_39.slots.default;
const __VLS_40 = {}.VSpacer;
/** @type {[typeof __VLS_components.VSpacer, typeof __VLS_components.vSpacer, ]} */ ;
// @ts-ignore
const __VLS_41 = __VLS_asFunctionalComponent(__VLS_40, new __VLS_40({}));
const __VLS_42 = __VLS_41({}, ...__VLS_functionalComponentArgsRest(__VLS_41));
const __VLS_44 = {}.VBtn;
/** @type {[typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ]} */ ;
// @ts-ignore
const __VLS_45 = __VLS_asFunctionalComponent(__VLS_44, new __VLS_44({
    ...{ 'onClick': {} },
    text: true,
}));
const __VLS_46 = __VLS_45({
    ...{ 'onClick': {} },
    text: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_45));
let __VLS_48;
let __VLS_49;
let __VLS_50;
const __VLS_51 = {
    onClick: (() => {
        __VLS_ctx.errorDialog.show = false;
        __VLS_ctx.createEventDialog = false;
    })
};
__VLS_47.slots.default;
var __VLS_47;
var __VLS_39;
var __VLS_27;
var __VLS_23;
const __VLS_52 = {}.VDialog;
/** @type {[typeof __VLS_components.VDialog, typeof __VLS_components.vDialog, typeof __VLS_components.VDialog, typeof __VLS_components.vDialog, ]} */ ;
// @ts-ignore
const __VLS_53 = __VLS_asFunctionalComponent(__VLS_52, new __VLS_52({
    modelValue: (__VLS_ctx.successDialog),
    maxWidth: "400",
}));
const __VLS_54 = __VLS_53({
    modelValue: (__VLS_ctx.successDialog),
    maxWidth: "400",
}, ...__VLS_functionalComponentArgsRest(__VLS_53));
__VLS_55.slots.default;
const __VLS_56 = {}.VCard;
/** @type {[typeof __VLS_components.VCard, typeof __VLS_components.vCard, typeof __VLS_components.VCard, typeof __VLS_components.vCard, ]} */ ;
// @ts-ignore
const __VLS_57 = __VLS_asFunctionalComponent(__VLS_56, new __VLS_56({}));
const __VLS_58 = __VLS_57({}, ...__VLS_functionalComponentArgsRest(__VLS_57));
__VLS_59.slots.default;
const __VLS_60 = {}.VCardTitle;
/** @type {[typeof __VLS_components.VCardTitle, typeof __VLS_components.vCardTitle, typeof __VLS_components.VCardTitle, typeof __VLS_components.vCardTitle, ]} */ ;
// @ts-ignore
const __VLS_61 = __VLS_asFunctionalComponent(__VLS_60, new __VLS_60({
    ...{ class: "headline" },
}));
const __VLS_62 = __VLS_61({
    ...{ class: "headline" },
}, ...__VLS_functionalComponentArgsRest(__VLS_61));
__VLS_63.slots.default;
var __VLS_63;
const __VLS_64 = {}.VCardText;
/** @type {[typeof __VLS_components.VCardText, typeof __VLS_components.vCardText, typeof __VLS_components.VCardText, typeof __VLS_components.vCardText, ]} */ ;
// @ts-ignore
const __VLS_65 = __VLS_asFunctionalComponent(__VLS_64, new __VLS_64({}));
const __VLS_66 = __VLS_65({}, ...__VLS_functionalComponentArgsRest(__VLS_65));
__VLS_67.slots.default;
var __VLS_67;
const __VLS_68 = {}.VCardActions;
/** @type {[typeof __VLS_components.VCardActions, typeof __VLS_components.vCardActions, typeof __VLS_components.VCardActions, typeof __VLS_components.vCardActions, ]} */ ;
// @ts-ignore
const __VLS_69 = __VLS_asFunctionalComponent(__VLS_68, new __VLS_68({}));
const __VLS_70 = __VLS_69({}, ...__VLS_functionalComponentArgsRest(__VLS_69));
__VLS_71.slots.default;
const __VLS_72 = {}.VSpacer;
/** @type {[typeof __VLS_components.VSpacer, typeof __VLS_components.vSpacer, ]} */ ;
// @ts-ignore
const __VLS_73 = __VLS_asFunctionalComponent(__VLS_72, new __VLS_72({}));
const __VLS_74 = __VLS_73({}, ...__VLS_functionalComponentArgsRest(__VLS_73));
const __VLS_76 = {}.VBtn;
/** @type {[typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ]} */ ;
// @ts-ignore
const __VLS_77 = __VLS_asFunctionalComponent(__VLS_76, new __VLS_76({
    ...{ 'onClick': {} },
    text: true,
}));
const __VLS_78 = __VLS_77({
    ...{ 'onClick': {} },
    text: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_77));
let __VLS_80;
let __VLS_81;
let __VLS_82;
const __VLS_83 = {
    onClick: (__VLS_ctx.handleEventCreatedOk)
};
__VLS_79.slots.default;
var __VLS_79;
var __VLS_71;
var __VLS_59;
var __VLS_55;
const __VLS_84 = {}.VDialog;
/** @type {[typeof __VLS_components.VDialog, typeof __VLS_components.vDialog, typeof __VLS_components.VDialog, typeof __VLS_components.vDialog, ]} */ ;
// @ts-ignore
const __VLS_85 = __VLS_asFunctionalComponent(__VLS_84, new __VLS_84({
    modelValue: (__VLS_ctx.turnAwayConfirmDialog.show),
    maxWidth: "500",
    persistent: true,
}));
const __VLS_86 = __VLS_85({
    modelValue: (__VLS_ctx.turnAwayConfirmDialog.show),
    maxWidth: "500",
    persistent: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_85));
__VLS_87.slots.default;
const __VLS_88 = {}.VCard;
/** @type {[typeof __VLS_components.VCard, typeof __VLS_components.vCard, typeof __VLS_components.VCard, typeof __VLS_components.vCard, ]} */ ;
// @ts-ignore
const __VLS_89 = __VLS_asFunctionalComponent(__VLS_88, new __VLS_88({}));
const __VLS_90 = __VLS_89({}, ...__VLS_functionalComponentArgsRest(__VLS_89));
__VLS_91.slots.default;
const __VLS_92 = {}.VCardTitle;
/** @type {[typeof __VLS_components.VCardTitle, typeof __VLS_components.vCardTitle, typeof __VLS_components.VCardTitle, typeof __VLS_components.vCardTitle, ]} */ ;
// @ts-ignore
const __VLS_93 = __VLS_asFunctionalComponent(__VLS_92, new __VLS_92({
    ...{ class: "headline" },
}));
const __VLS_94 = __VLS_93({
    ...{ class: "headline" },
}, ...__VLS_functionalComponentArgsRest(__VLS_93));
__VLS_95.slots.default;
var __VLS_95;
const __VLS_96 = {}.VCardText;
/** @type {[typeof __VLS_components.VCardText, typeof __VLS_components.vCardText, typeof __VLS_components.VCardText, typeof __VLS_components.vCardText, ]} */ ;
// @ts-ignore
const __VLS_97 = __VLS_asFunctionalComponent(__VLS_96, new __VLS_96({}));
const __VLS_98 = __VLS_97({}, ...__VLS_functionalComponentArgsRest(__VLS_97));
__VLS_99.slots.default;
var __VLS_99;
const __VLS_100 = {}.VCardActions;
/** @type {[typeof __VLS_components.VCardActions, typeof __VLS_components.vCardActions, typeof __VLS_components.VCardActions, typeof __VLS_components.vCardActions, ]} */ ;
// @ts-ignore
const __VLS_101 = __VLS_asFunctionalComponent(__VLS_100, new __VLS_100({}));
const __VLS_102 = __VLS_101({}, ...__VLS_functionalComponentArgsRest(__VLS_101));
__VLS_103.slots.default;
const __VLS_104 = {}.VSpacer;
/** @type {[typeof __VLS_components.VSpacer, typeof __VLS_components.vSpacer, typeof __VLS_components.VSpacer, typeof __VLS_components.vSpacer, ]} */ ;
// @ts-ignore
const __VLS_105 = __VLS_asFunctionalComponent(__VLS_104, new __VLS_104({}));
const __VLS_106 = __VLS_105({}, ...__VLS_functionalComponentArgsRest(__VLS_105));
const __VLS_108 = {}.VBtn;
/** @type {[typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ]} */ ;
// @ts-ignore
const __VLS_109 = __VLS_asFunctionalComponent(__VLS_108, new __VLS_108({
    ...{ 'onClick': {} },
    text: true,
}));
const __VLS_110 = __VLS_109({
    ...{ 'onClick': {} },
    text: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_109));
let __VLS_112;
let __VLS_113;
let __VLS_114;
const __VLS_115 = {
    onClick: (...[$event]) => {
        __VLS_ctx.turnAwayConfirmDialog.show = false;
    }
};
__VLS_111.slots.default;
var __VLS_111;
const __VLS_116 = {}.VBtn;
/** @type {[typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ]} */ ;
// @ts-ignore
const __VLS_117 = __VLS_asFunctionalComponent(__VLS_116, new __VLS_116({
    ...{ 'onClick': {} },
    color: "red",
    text: true,
}));
const __VLS_118 = __VLS_117({
    ...{ 'onClick': {} },
    color: "red",
    text: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_117));
let __VLS_120;
let __VLS_121;
let __VLS_122;
const __VLS_123 = {
    onClick: (__VLS_ctx.executeTurnAway)
};
__VLS_119.slots.default;
var __VLS_119;
var __VLS_103;
var __VLS_91;
var __VLS_87;
const __VLS_124 = {}.VRow;
/** @type {[typeof __VLS_components.VRow, typeof __VLS_components.vRow, typeof __VLS_components.VRow, typeof __VLS_components.vRow, ]} */ ;
// @ts-ignore
const __VLS_125 = __VLS_asFunctionalComponent(__VLS_124, new __VLS_124({
    noGutters: true,
}));
const __VLS_126 = __VLS_125({
    noGutters: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_125));
__VLS_127.slots.default;
const __VLS_128 = {}.VCol;
/** @type {[typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ]} */ ;
// @ts-ignore
const __VLS_129 = __VLS_asFunctionalComponent(__VLS_128, new __VLS_128({
    cols: "12",
}));
const __VLS_130 = __VLS_129({
    cols: "12",
}, ...__VLS_functionalComponentArgsRest(__VLS_129));
__VLS_131.slots.default;
const __VLS_132 = {}.VTabs;
/** @type {[typeof __VLS_components.VTabs, typeof __VLS_components.vTabs, typeof __VLS_components.VTabs, typeof __VLS_components.vTabs, ]} */ ;
// @ts-ignore
const __VLS_133 = __VLS_asFunctionalComponent(__VLS_132, new __VLS_132({
    ...{ class: "EventsTabs mb-3" },
    modelValue: (__VLS_ctx.activeTab),
    fixedTabs: true,
    alignTabs: "center",
    color: "white",
}));
const __VLS_134 = __VLS_133({
    ...{ class: "EventsTabs mb-3" },
    modelValue: (__VLS_ctx.activeTab),
    fixedTabs: true,
    alignTabs: "center",
    color: "white",
}, ...__VLS_functionalComponentArgsRest(__VLS_133));
__VLS_135.slots.default;
const __VLS_136 = {}.VTab;
/** @type {[typeof __VLS_components.VTab, typeof __VLS_components.vTab, typeof __VLS_components.VTab, typeof __VLS_components.vTab, ]} */ ;
// @ts-ignore
const __VLS_137 = __VLS_asFunctionalComponent(__VLS_136, new __VLS_136({
    ...{ class: "text-h5" },
    value: (1),
}));
const __VLS_138 = __VLS_137({
    ...{ class: "text-h5" },
    value: (1),
}, ...__VLS_functionalComponentArgsRest(__VLS_137));
__VLS_139.slots.default;
var __VLS_139;
const __VLS_140 = {}.VTab;
/** @type {[typeof __VLS_components.VTab, typeof __VLS_components.vTab, typeof __VLS_components.VTab, typeof __VLS_components.vTab, ]} */ ;
// @ts-ignore
const __VLS_141 = __VLS_asFunctionalComponent(__VLS_140, new __VLS_140({
    ...{ class: "text-h5" },
    value: (2),
}));
const __VLS_142 = __VLS_141({
    ...{ class: "text-h5" },
    value: (2),
}, ...__VLS_functionalComponentArgsRest(__VLS_141));
__VLS_143.slots.default;
var __VLS_143;
var __VLS_135;
var __VLS_131;
var __VLS_127;
const __VLS_144 = {}.VRow;
/** @type {[typeof __VLS_components.VRow, typeof __VLS_components.vRow, typeof __VLS_components.VRow, typeof __VLS_components.vRow, ]} */ ;
// @ts-ignore
const __VLS_145 = __VLS_asFunctionalComponent(__VLS_144, new __VLS_144({
    ...{ class: "mb-4" },
    align: "center",
}));
const __VLS_146 = __VLS_145({
    ...{ class: "mb-4" },
    align: "center",
}, ...__VLS_functionalComponentArgsRest(__VLS_145));
__VLS_147.slots.default;
const __VLS_148 = {}.VCol;
/** @type {[typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ]} */ ;
// @ts-ignore
const __VLS_149 = __VLS_asFunctionalComponent(__VLS_148, new __VLS_148({
    cols: "12",
    sm: "6",
    ...{ class: "d-flex align-center" },
}));
const __VLS_150 = __VLS_149({
    cols: "12",
    sm: "6",
    ...{ class: "d-flex align-center" },
}, ...__VLS_functionalComponentArgsRest(__VLS_149));
__VLS_151.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "ml-2" },
});
const __VLS_152 = {}.VSwitch;
/** @type {[typeof __VLS_components.VSwitch, typeof __VLS_components.vSwitch, typeof __VLS_components.VSwitch, typeof __VLS_components.vSwitch, ]} */ ;
// @ts-ignore
const __VLS_153 = __VLS_asFunctionalComponent(__VLS_152, new __VLS_152({
    modelValue: (__VLS_ctx.showPast),
    hideDetails: true,
    color: "secundary",
    ...{ class: "mx-4" },
}));
const __VLS_154 = __VLS_153({
    modelValue: (__VLS_ctx.showPast),
    hideDetails: true,
    color: "secundary",
    ...{ class: "mx-4" },
}, ...__VLS_functionalComponentArgsRest(__VLS_153));
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
var __VLS_151;
var __VLS_147;
if (__VLS_ctx.activeTab === 1) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
    if (__VLS_ctx.loading) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "loading-overlay" },
        });
        const __VLS_156 = {}.VProgressCircular;
        /** @type {[typeof __VLS_components.VProgressCircular, typeof __VLS_components.vProgressCircular, ]} */ ;
        // @ts-ignore
        const __VLS_157 = __VLS_asFunctionalComponent(__VLS_156, new __VLS_156({
            indeterminate: true,
            size: "80",
            color: "primary",
        }));
        const __VLS_158 = __VLS_157({
            indeterminate: true,
            size: "80",
            color: "primary",
        }, ...__VLS_functionalComponentArgsRest(__VLS_157));
    }
    else {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "list-container" },
        });
        if (__VLS_ctx.events.length > 0) {
            const __VLS_160 = {}.VRow;
            /** @type {[typeof __VLS_components.VRow, typeof __VLS_components.vRow, typeof __VLS_components.VRow, typeof __VLS_components.vRow, ]} */ ;
            // @ts-ignore
            const __VLS_161 = __VLS_asFunctionalComponent(__VLS_160, new __VLS_160({}));
            const __VLS_162 = __VLS_161({}, ...__VLS_functionalComponentArgsRest(__VLS_161));
            __VLS_163.slots.default;
            for (const [event, index] of __VLS_getVForSourceType((__VLS_ctx.sortedEvents))) {
                const __VLS_164 = {}.VCol;
                /** @type {[typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ]} */ ;
                // @ts-ignore
                const __VLS_165 = __VLS_asFunctionalComponent(__VLS_164, new __VLS_164({
                    ...{ class: "py-2 pl-1 pr-1" },
                    cols: "12",
                    md: "6",
                    key: (index),
                }));
                const __VLS_166 = __VLS_165({
                    ...{ class: "py-2 pl-1 pr-1" },
                    cols: "12",
                    md: "6",
                    key: (index),
                }, ...__VLS_functionalComponentArgsRest(__VLS_165));
                __VLS_167.slots.default;
                const __VLS_168 = {}.VCard;
                /** @type {[typeof __VLS_components.VCard, typeof __VLS_components.vCard, typeof __VLS_components.VCard, typeof __VLS_components.vCard, ]} */ ;
                // @ts-ignore
                const __VLS_169 = __VLS_asFunctionalComponent(__VLS_168, new __VLS_168({
                    ...{ 'onClick': {} },
                    color: "terciary",
                    ...{ class: "pt-0 event-card" },
                }));
                const __VLS_170 = __VLS_169({
                    ...{ 'onClick': {} },
                    color: "terciary",
                    ...{ class: "pt-0 event-card" },
                }, ...__VLS_functionalComponentArgsRest(__VLS_169));
                let __VLS_172;
                let __VLS_173;
                let __VLS_174;
                const __VLS_175 = {
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
                __VLS_171.slots.default;
                if (__VLS_ctx.getSeasonInfo(event.seasons_fk).flag) {
                    const __VLS_176 = {}.VImg;
                    /** @type {[typeof __VLS_components.VImg, typeof __VLS_components.vImg, ]} */ ;
                    // @ts-ignore
                    const __VLS_177 = __VLS_asFunctionalComponent(__VLS_176, new __VLS_176({
                        src: (__VLS_ctx.getSeasonInfo(event.seasons_fk).flag),
                        ...{ class: "season-flag" },
                    }));
                    const __VLS_178 = __VLS_177({
                        src: (__VLS_ctx.getSeasonInfo(event.seasons_fk).flag),
                        ...{ class: "season-flag" },
                    }, ...__VLS_functionalComponentArgsRest(__VLS_177));
                }
                const __VLS_180 = {}.VRow;
                /** @type {[typeof __VLS_components.VRow, typeof __VLS_components.vRow, typeof __VLS_components.VRow, typeof __VLS_components.vRow, ]} */ ;
                // @ts-ignore
                const __VLS_181 = __VLS_asFunctionalComponent(__VLS_180, new __VLS_180({
                    noGutters: true,
                }));
                const __VLS_182 = __VLS_181({
                    noGutters: true,
                }, ...__VLS_functionalComponentArgsRest(__VLS_181));
                __VLS_183.slots.default;
                const __VLS_184 = {}.VCol;
                /** @type {[typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ]} */ ;
                // @ts-ignore
                const __VLS_185 = __VLS_asFunctionalComponent(__VLS_184, new __VLS_184({
                    cols: "4",
                    sm: "2",
                }));
                const __VLS_186 = __VLS_185({
                    cols: "4",
                    sm: "2",
                }, ...__VLS_functionalComponentArgsRest(__VLS_185));
                __VLS_187.slots.default;
                __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                    ...{ class: "text-center ml-3" },
                    ...{ style: {} },
                });
                __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
                    ...{ class: "pt-3 text-caption font-weight-bold" },
                });
                (__VLS_ctx.extractMonth(event.event_date, __VLS_ctx.userTimezone));
                __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
                    color: "primary",
                    ...{ class: "cinzel-text text-h3 font-weight-bold" },
                });
                (__VLS_ctx.extractDay(event.event_date, __VLS_ctx.userTimezone));
                __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
                    ...{ class: "text-caption font-weight-bold" },
                });
                (__VLS_ctx.extractTime(event.event_date, __VLS_ctx.userTimezone));
                var __VLS_187;
                const __VLS_188 = {}.VCol;
                /** @type {[typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ]} */ ;
                // @ts-ignore
                const __VLS_189 = __VLS_asFunctionalComponent(__VLS_188, new __VLS_188({
                    cols: "8",
                    sm: "10",
                    ...{ class: "pt-2" },
                }));
                const __VLS_190 = __VLS_189({
                    cols: "8",
                    sm: "10",
                    ...{ class: "pt-2" },
                }, ...__VLS_functionalComponentArgsRest(__VLS_189));
                __VLS_191.slots.default;
                __VLS_asFunctionalElement(__VLS_intrinsicElements.h3, __VLS_intrinsicElements.h3)({
                    ...{ class: "pb-1" },
                });
                const __VLS_192 = {}.VIcon;
                /** @type {[typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, ]} */ ;
                // @ts-ignore
                const __VLS_193 = __VLS_asFunctionalComponent(__VLS_192, new __VLS_192({
                    ...{ class: "pr-1" },
                    size: "small",
                    color: "black",
                }));
                const __VLS_194 = __VLS_193({
                    ...{ class: "pr-1" },
                    size: "small",
                    color: "black",
                }, ...__VLS_functionalComponentArgsRest(__VLS_193));
                __VLS_195.slots.default;
                var __VLS_195;
                (event.store_name);
                __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
                    ...{ class: "text-caption text-truncate" },
                });
                const __VLS_196 = {}.VIcon;
                /** @type {[typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, ]} */ ;
                // @ts-ignore
                const __VLS_197 = __VLS_asFunctionalComponent(__VLS_196, new __VLS_196({
                    color: "red",
                }));
                const __VLS_198 = __VLS_197({
                    color: "red",
                }, ...__VLS_functionalComponentArgsRest(__VLS_197));
                __VLS_199.slots.default;
                var __VLS_199;
                (event.address);
                __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
                    ...{ class: "text-caption" },
                });
                const __VLS_200 = {}.VIcon;
                /** @type {[typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, ]} */ ;
                // @ts-ignore
                const __VLS_201 = __VLS_asFunctionalComponent(__VLS_200, new __VLS_200({
                    color: "red",
                }));
                const __VLS_202 = __VLS_201({
                    color: "red",
                }, ...__VLS_functionalComponentArgsRest(__VLS_201));
                __VLS_203.slots.default;
                var __VLS_203;
                (event.scenario);
                if (event.rewards && event.rewards.length) {
                    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
                        ...{ class: "text-caption ml-3" },
                    });
                    const __VLS_204 = {}.VRow;
                    /** @type {[typeof __VLS_components.VRow, typeof __VLS_components.vRow, typeof __VLS_components.VRow, typeof __VLS_components.vRow, ]} */ ;
                    // @ts-ignore
                    const __VLS_205 = __VLS_asFunctionalComponent(__VLS_204, new __VLS_204({
                        ...{ class: "d-flex align-center rewards-container" },
                    }));
                    const __VLS_206 = __VLS_205({
                        ...{ class: "d-flex align-center rewards-container" },
                    }, ...__VLS_functionalComponentArgsRest(__VLS_205));
                    __VLS_207.slots.default;
                    const __VLS_208 = {}.VIcon;
                    /** @type {[typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, ]} */ ;
                    // @ts-ignore
                    const __VLS_209 = __VLS_asFunctionalComponent(__VLS_208, new __VLS_208({
                        ...{ class: "mr-1" },
                        color: "red",
                    }));
                    const __VLS_210 = __VLS_209({
                        ...{ class: "mr-1" },
                        color: "red",
                    }, ...__VLS_functionalComponentArgsRest(__VLS_209));
                    __VLS_211.slots.default;
                    var __VLS_211;
                    for (const [reward, index] of __VLS_getVForSourceType((event.rewards))) {
                        const __VLS_212 = {}.VCol;
                        /** @type {[typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ]} */ ;
                        // @ts-ignore
                        const __VLS_213 = __VLS_asFunctionalComponent(__VLS_212, new __VLS_212({
                            cols: "auto",
                            key: (index),
                        }));
                        const __VLS_214 = __VLS_213({
                            cols: "auto",
                            key: (index),
                        }, ...__VLS_functionalComponentArgsRest(__VLS_213));
                        __VLS_215.slots.default;
                        const __VLS_216 = {}.VImg;
                        /** @type {[typeof __VLS_components.VImg, typeof __VLS_components.vImg, typeof __VLS_components.VImg, typeof __VLS_components.vImg, ]} */ ;
                        // @ts-ignore
                        const __VLS_217 = __VLS_asFunctionalComponent(__VLS_216, new __VLS_216({
                            src: (reward.image),
                            height: "20",
                            width: "20",
                            contain: true,
                            ...{ class: "reward-icon" },
                        }));
                        const __VLS_218 = __VLS_217({
                            src: (reward.image),
                            height: "20",
                            width: "20",
                            contain: true,
                            ...{ class: "reward-icon" },
                        }, ...__VLS_functionalComponentArgsRest(__VLS_217));
                        var __VLS_215;
                    }
                    var __VLS_207;
                }
                var __VLS_191;
                var __VLS_183;
                var __VLS_171;
                var __VLS_167;
            }
            var __VLS_163;
        }
        else {
            const __VLS_220 = {}.VRow;
            /** @type {[typeof __VLS_components.VRow, typeof __VLS_components.vRow, typeof __VLS_components.VRow, typeof __VLS_components.vRow, ]} */ ;
            // @ts-ignore
            const __VLS_221 = __VLS_asFunctionalComponent(__VLS_220, new __VLS_220({}));
            const __VLS_222 = __VLS_221({}, ...__VLS_functionalComponentArgsRest(__VLS_221));
            __VLS_223.slots.default;
            const __VLS_224 = {}.VCol;
            /** @type {[typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ]} */ ;
            // @ts-ignore
            const __VLS_225 = __VLS_asFunctionalComponent(__VLS_224, new __VLS_224({
                ...{ class: "text-center" },
            }));
            const __VLS_226 = __VLS_225({
                ...{ class: "text-center" },
            }, ...__VLS_functionalComponentArgsRest(__VLS_225));
            __VLS_227.slots.default;
            var __VLS_227;
            var __VLS_223;
        }
    }
}
if (__VLS_ctx.activeTab === 2) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
    if (__VLS_ctx.loading) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "loading-overlay" },
        });
        const __VLS_228 = {}.VProgressCircular;
        /** @type {[typeof __VLS_components.VProgressCircular, typeof __VLS_components.vProgressCircular, ]} */ ;
        // @ts-ignore
        const __VLS_229 = __VLS_asFunctionalComponent(__VLS_228, new __VLS_228({
            indeterminate: true,
            size: "80",
            color: "primary",
        }));
        const __VLS_230 = __VLS_229({
            indeterminate: true,
            size: "80",
            color: "primary",
        }, ...__VLS_functionalComponentArgsRest(__VLS_229));
    }
    else {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "list-container" },
        });
        const __VLS_232 = {}.VRow;
        /** @type {[typeof __VLS_components.VRow, typeof __VLS_components.vRow, typeof __VLS_components.VRow, typeof __VLS_components.vRow, ]} */ ;
        // @ts-ignore
        const __VLS_233 = __VLS_asFunctionalComponent(__VLS_232, new __VLS_232({
            ...{ class: "CreateNew align-center bg-gray text-white" },
        }));
        const __VLS_234 = __VLS_233({
            ...{ class: "CreateNew align-center bg-gray text-white" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_233));
        __VLS_235.slots.default;
        const __VLS_236 = {}.VCol;
        /** @type {[typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ]} */ ;
        // @ts-ignore
        const __VLS_237 = __VLS_asFunctionalComponent(__VLS_236, new __VLS_236({
            cols: "2",
        }));
        const __VLS_238 = __VLS_237({
            cols: "2",
        }, ...__VLS_functionalComponentArgsRest(__VLS_237));
        const __VLS_240 = {}.VCol;
        /** @type {[typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ]} */ ;
        // @ts-ignore
        const __VLS_241 = __VLS_asFunctionalComponent(__VLS_240, new __VLS_240({
            cols: "3",
        }));
        const __VLS_242 = __VLS_241({
            cols: "3",
        }, ...__VLS_functionalComponentArgsRest(__VLS_241));
        __VLS_243.slots.default;
        const __VLS_244 = {}.VBtn;
        /** @type {[typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ]} */ ;
        // @ts-ignore
        const __VLS_245 = __VLS_asFunctionalComponent(__VLS_244, new __VLS_244({
            ...{ 'onClick': {} },
            variant: "text",
            ...{ class: "sort-btn" },
        }));
        const __VLS_246 = __VLS_245({
            ...{ 'onClick': {} },
            variant: "text",
            ...{ class: "sort-btn" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_245));
        let __VLS_248;
        let __VLS_249;
        let __VLS_250;
        const __VLS_251 = {
            onClick: (__VLS_ctx.openCreateEventDialog)
        };
        __VLS_247.slots.default;
        const __VLS_252 = {}.VIcon;
        /** @type {[typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, ]} */ ;
        // @ts-ignore
        const __VLS_253 = __VLS_asFunctionalComponent(__VLS_252, new __VLS_252({}));
        const __VLS_254 = __VLS_253({}, ...__VLS_functionalComponentArgsRest(__VLS_253));
        __VLS_255.slots.default;
        var __VLS_255;
        var __VLS_247;
        var __VLS_243;
        var __VLS_235;
        if (__VLS_ctx.userCreatedEvents.length === 0) {
            const __VLS_256 = {}.VRow;
            /** @type {[typeof __VLS_components.VRow, typeof __VLS_components.vRow, typeof __VLS_components.VRow, typeof __VLS_components.vRow, ]} */ ;
            // @ts-ignore
            const __VLS_257 = __VLS_asFunctionalComponent(__VLS_256, new __VLS_256({}));
            const __VLS_258 = __VLS_257({}, ...__VLS_functionalComponentArgsRest(__VLS_257));
            __VLS_259.slots.default;
            const __VLS_260 = {}.VCol;
            /** @type {[typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ]} */ ;
            // @ts-ignore
            const __VLS_261 = __VLS_asFunctionalComponent(__VLS_260, new __VLS_260({
                ...{ class: "text-center" },
            }));
            const __VLS_262 = __VLS_261({
                ...{ class: "text-center" },
            }, ...__VLS_functionalComponentArgsRest(__VLS_261));
            __VLS_263.slots.default;
            var __VLS_263;
            var __VLS_259;
        }
        else {
            const __VLS_264 = {}.VRow;
            /** @type {[typeof __VLS_components.VRow, typeof __VLS_components.vRow, typeof __VLS_components.VRow, typeof __VLS_components.vRow, ]} */ ;
            // @ts-ignore
            const __VLS_265 = __VLS_asFunctionalComponent(__VLS_264, new __VLS_264({}));
            const __VLS_266 = __VLS_265({}, ...__VLS_functionalComponentArgsRest(__VLS_265));
            __VLS_267.slots.default;
            for (const [event, index] of __VLS_getVForSourceType((__VLS_ctx.userCreatedEvents))) {
                const __VLS_268 = {}.VCol;
                /** @type {[typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ]} */ ;
                // @ts-ignore
                const __VLS_269 = __VLS_asFunctionalComponent(__VLS_268, new __VLS_268({
                    key: (event.events_pk),
                    ...{ class: "py-2 pl-1 pr-1" },
                    cols: "12",
                    md: "6",
                }));
                const __VLS_270 = __VLS_269({
                    key: (event.events_pk),
                    ...{ class: "py-2 pl-1 pr-1" },
                    cols: "12",
                    md: "6",
                }, ...__VLS_functionalComponentArgsRest(__VLS_269));
                __VLS_271.slots.default;
                const __VLS_272 = {}.VCard;
                /** @type {[typeof __VLS_components.VCard, typeof __VLS_components.vCard, typeof __VLS_components.VCard, typeof __VLS_components.vCard, ]} */ ;
                // @ts-ignore
                const __VLS_273 = __VLS_asFunctionalComponent(__VLS_272, new __VLS_272({
                    ...{ 'onClick': {} },
                    color: "white",
                    maxHeight: "120",
                    ...{ class: "pt-0 pl-0 pb-0 event-card" },
                }));
                const __VLS_274 = __VLS_273({
                    ...{ 'onClick': {} },
                    color: "white",
                    maxHeight: "120",
                    ...{ class: "pt-0 pl-0 pb-0 event-card" },
                }, ...__VLS_functionalComponentArgsRest(__VLS_273));
                let __VLS_276;
                let __VLS_277;
                let __VLS_278;
                const __VLS_279 = {
                    onClick: (...[$event]) => {
                        if (!(__VLS_ctx.activeTab === 2))
                            return;
                        if (!!(__VLS_ctx.loading))
                            return;
                        if (!!(__VLS_ctx.userCreatedEvents.length === 0))
                            return;
                        __VLS_ctx.openManageDialog(event);
                    }
                };
                __VLS_275.slots.default;
                const __VLS_280 = {}.VRow;
                /** @type {[typeof __VLS_components.VRow, typeof __VLS_components.vRow, typeof __VLS_components.VRow, typeof __VLS_components.vRow, ]} */ ;
                // @ts-ignore
                const __VLS_281 = __VLS_asFunctionalComponent(__VLS_280, new __VLS_280({
                    noGutters: true,
                }));
                const __VLS_282 = __VLS_281({
                    noGutters: true,
                }, ...__VLS_functionalComponentArgsRest(__VLS_281));
                __VLS_283.slots.default;
                const __VLS_284 = {}.VCol;
                /** @type {[typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ]} */ ;
                // @ts-ignore
                const __VLS_285 = __VLS_asFunctionalComponent(__VLS_284, new __VLS_284({
                    cols: "auto",
                    ...{ class: "redbutton pt-13 pl-3" },
                }));
                const __VLS_286 = __VLS_285({
                    cols: "auto",
                    ...{ class: "redbutton pt-13 pl-3" },
                }, ...__VLS_functionalComponentArgsRest(__VLS_285));
                __VLS_287.slots.default;
                const __VLS_288 = {}.VBtn;
                /** @type {[typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ]} */ ;
                // @ts-ignore
                const __VLS_289 = __VLS_asFunctionalComponent(__VLS_288, new __VLS_288({
                    ...{ 'onClick': {} },
                    color: "#AB2929",
                    icon: true,
                    ...{ class: "delete-btn" },
                }));
                const __VLS_290 = __VLS_289({
                    ...{ 'onClick': {} },
                    color: "#AB2929",
                    icon: true,
                    ...{ class: "delete-btn" },
                }, ...__VLS_functionalComponentArgsRest(__VLS_289));
                let __VLS_292;
                let __VLS_293;
                let __VLS_294;
                const __VLS_295 = {
                    onClick: (...[$event]) => {
                        if (!(__VLS_ctx.activeTab === 2))
                            return;
                        if (!!(__VLS_ctx.loading))
                            return;
                        if (!!(__VLS_ctx.userCreatedEvents.length === 0))
                            return;
                        __VLS_ctx.deleteEvent(event.events_pk);
                    }
                };
                __VLS_291.slots.default;
                const __VLS_296 = {}.VIcon;
                /** @type {[typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, ]} */ ;
                // @ts-ignore
                const __VLS_297 = __VLS_asFunctionalComponent(__VLS_296, new __VLS_296({}));
                const __VLS_298 = __VLS_297({}, ...__VLS_functionalComponentArgsRest(__VLS_297));
                __VLS_299.slots.default;
                var __VLS_299;
                var __VLS_291;
                var __VLS_287;
                const __VLS_300 = {}.VCol;
                /** @type {[typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ]} */ ;
                // @ts-ignore
                const __VLS_301 = __VLS_asFunctionalComponent(__VLS_300, new __VLS_300({
                    cols: "8",
                    ...{ class: "pt-6 pr-3" },
                }));
                const __VLS_302 = __VLS_301({
                    cols: "8",
                    ...{ class: "pt-6 pr-3" },
                }, ...__VLS_functionalComponentArgsRest(__VLS_301));
                __VLS_303.slots.default;
                const __VLS_304 = {}.VRow;
                /** @type {[typeof __VLS_components.VRow, typeof __VLS_components.vRow, typeof __VLS_components.VRow, typeof __VLS_components.vRow, ]} */ ;
                // @ts-ignore
                const __VLS_305 = __VLS_asFunctionalComponent(__VLS_304, new __VLS_304({
                    noGutters: true,
                }));
                const __VLS_306 = __VLS_305({
                    noGutters: true,
                }, ...__VLS_functionalComponentArgsRest(__VLS_305));
                __VLS_307.slots.default;
                const __VLS_308 = {}.VCol;
                /** @type {[typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ]} */ ;
                // @ts-ignore
                const __VLS_309 = __VLS_asFunctionalComponent(__VLS_308, new __VLS_308({
                    cols: "4",
                    sm: "2",
                }));
                const __VLS_310 = __VLS_309({
                    cols: "4",
                    sm: "2",
                }, ...__VLS_functionalComponentArgsRest(__VLS_309));
                __VLS_311.slots.default;
                __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                    ...{ class: "text-center ml-2 pr-3" },
                    ...{ style: {} },
                });
                __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
                    ...{ class: "pt-3 text-caption font-weight-bold" },
                });
                (__VLS_ctx.extractMonth(event.event_date, __VLS_ctx.userTimezone));
                __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
                    color: "primary",
                    ...{ class: "cinzel-text text-h3 font-weight-bold" },
                });
                (__VLS_ctx.extractDay(event.event_date, __VLS_ctx.userTimezone));
                __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
                    ...{ class: "text-caption font-weight-bold" },
                });
                (__VLS_ctx.extractTime(event.event_date, __VLS_ctx.userTimezone));
                var __VLS_311;
                const __VLS_312 = {}.VCol;
                /** @type {[typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ]} */ ;
                // @ts-ignore
                const __VLS_313 = __VLS_asFunctionalComponent(__VLS_312, new __VLS_312({
                    cols: "8",
                    sm: "10",
                    ...{ class: "pt-2 pl-5" },
                }));
                const __VLS_314 = __VLS_313({
                    cols: "8",
                    sm: "10",
                    ...{ class: "pt-2 pl-5" },
                }, ...__VLS_functionalComponentArgsRest(__VLS_313));
                __VLS_315.slots.default;
                __VLS_asFunctionalElement(__VLS_intrinsicElements.h3, __VLS_intrinsicElements.h3)({
                    ...{ class: "pb-1 text-truncate" },
                });
                const __VLS_316 = {}.VIcon;
                /** @type {[typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, ]} */ ;
                // @ts-ignore
                const __VLS_317 = __VLS_asFunctionalComponent(__VLS_316, new __VLS_316({
                    ...{ class: "pr-1" },
                    size: "small",
                    color: "black",
                }));
                const __VLS_318 = __VLS_317({
                    ...{ class: "pr-1" },
                    size: "small",
                    color: "black",
                }, ...__VLS_functionalComponentArgsRest(__VLS_317));
                __VLS_319.slots.default;
                var __VLS_319;
                (event.store_name);
                __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
                    ...{ class: "text-caption text-truncate" },
                });
                const __VLS_320 = {}.VIcon;
                /** @type {[typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, ]} */ ;
                // @ts-ignore
                const __VLS_321 = __VLS_asFunctionalComponent(__VLS_320, new __VLS_320({
                    color: "red",
                }));
                const __VLS_322 = __VLS_321({
                    color: "red",
                }, ...__VLS_functionalComponentArgsRest(__VLS_321));
                __VLS_323.slots.default;
                var __VLS_323;
                (event.address);
                if (event.scenario) {
                    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
                        ...{ class: "text-caption" },
                    });
                    const __VLS_324 = {}.VIcon;
                    /** @type {[typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, ]} */ ;
                    // @ts-ignore
                    const __VLS_325 = __VLS_asFunctionalComponent(__VLS_324, new __VLS_324({
                        color: "red",
                    }));
                    const __VLS_326 = __VLS_325({
                        color: "red",
                    }, ...__VLS_functionalComponentArgsRest(__VLS_325));
                    __VLS_327.slots.default;
                    var __VLS_327;
                    (event.scenario);
                }
                var __VLS_315;
                var __VLS_307;
                var __VLS_303;
                var __VLS_283;
                const __VLS_328 = {}.VCol;
                /** @type {[typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ]} */ ;
                // @ts-ignore
                const __VLS_329 = __VLS_asFunctionalComponent(__VLS_328, new __VLS_328({
                    cols: "auto",
                    ...{ class: "editbutton pt-13 pl-3" },
                }));
                const __VLS_330 = __VLS_329({
                    cols: "auto",
                    ...{ class: "editbutton pt-13 pl-3" },
                }, ...__VLS_functionalComponentArgsRest(__VLS_329));
                __VLS_331.slots.default;
                const __VLS_332 = {}.VBtn;
                /** @type {[typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ]} */ ;
                // @ts-ignore
                const __VLS_333 = __VLS_asFunctionalComponent(__VLS_332, new __VLS_332({
                    ...{ 'onClick': {} },
                    color: "white",
                    icon: true,
                    ...{ class: "delete-btn" },
                }));
                const __VLS_334 = __VLS_333({
                    ...{ 'onClick': {} },
                    color: "white",
                    icon: true,
                    ...{ class: "delete-btn" },
                }, ...__VLS_functionalComponentArgsRest(__VLS_333));
                let __VLS_336;
                let __VLS_337;
                let __VLS_338;
                const __VLS_339 = {
                    onClick: (...[$event]) => {
                        if (!(__VLS_ctx.activeTab === 2))
                            return;
                        if (!!(__VLS_ctx.loading))
                            return;
                        if (!!(__VLS_ctx.userCreatedEvents.length === 0))
                            return;
                        __VLS_ctx.openEditDialog(event, true);
                    }
                };
                __VLS_335.slots.default;
                const __VLS_340 = {}.VIcon;
                /** @type {[typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, ]} */ ;
                // @ts-ignore
                const __VLS_341 = __VLS_asFunctionalComponent(__VLS_340, new __VLS_340({}));
                const __VLS_342 = __VLS_341({}, ...__VLS_functionalComponentArgsRest(__VLS_341));
                __VLS_343.slots.default;
                var __VLS_343;
                var __VLS_335;
                var __VLS_331;
                var __VLS_275;
                var __VLS_271;
            }
            var __VLS_267;
        }
    }
}
const __VLS_344 = {}.VDialog;
/** @type {[typeof __VLS_components.VDialog, typeof __VLS_components.vDialog, typeof __VLS_components.VDialog, typeof __VLS_components.vDialog, ]} */ ;
// @ts-ignore
const __VLS_345 = __VLS_asFunctionalComponent(__VLS_344, new __VLS_344({
    modelValue: (__VLS_ctx.dialog),
    maxWidth: "600",
    minHeight: "410",
}));
const __VLS_346 = __VLS_345({
    modelValue: (__VLS_ctx.dialog),
    maxWidth: "600",
    minHeight: "410",
}, ...__VLS_functionalComponentArgsRest(__VLS_345));
__VLS_347.slots.default;
const __VLS_348 = {}.VCard;
/** @type {[typeof __VLS_components.VCard, typeof __VLS_components.vCard, typeof __VLS_components.VCard, typeof __VLS_components.vCard, ]} */ ;
// @ts-ignore
const __VLS_349 = __VLS_asFunctionalComponent(__VLS_348, new __VLS_348({
    color: "surface",
}));
const __VLS_350 = __VLS_349({
    color: "surface",
}, ...__VLS_functionalComponentArgsRest(__VLS_349));
__VLS_351.slots.default;
const __VLS_352 = {}.VCardActions;
/** @type {[typeof __VLS_components.VCardActions, typeof __VLS_components.vCardActions, typeof __VLS_components.VCardActions, typeof __VLS_components.vCardActions, ]} */ ;
// @ts-ignore
const __VLS_353 = __VLS_asFunctionalComponent(__VLS_352, new __VLS_352({
    ...{ class: "d-flex justify-left" },
}));
const __VLS_354 = __VLS_353({
    ...{ class: "d-flex justify-left" },
}, ...__VLS_functionalComponentArgsRest(__VLS_353));
__VLS_355.slots.default;
const __VLS_356 = {}.VBtn;
/** @type {[typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ]} */ ;
// @ts-ignore
const __VLS_357 = __VLS_asFunctionalComponent(__VLS_356, new __VLS_356({
    ...{ 'onClick': {} },
    color: "red",
}));
const __VLS_358 = __VLS_357({
    ...{ 'onClick': {} },
    color: "red",
}, ...__VLS_functionalComponentArgsRest(__VLS_357));
let __VLS_360;
let __VLS_361;
let __VLS_362;
const __VLS_363 = {
    onClick: (...[$event]) => {
        __VLS_ctx.dialog = false;
    }
};
__VLS_359.slots.default;
var __VLS_359;
var __VLS_355;
const __VLS_364 = {}.VCardText;
/** @type {[typeof __VLS_components.VCardText, typeof __VLS_components.vCardText, typeof __VLS_components.VCardText, typeof __VLS_components.vCardText, ]} */ ;
// @ts-ignore
const __VLS_365 = __VLS_asFunctionalComponent(__VLS_364, new __VLS_364({}));
const __VLS_366 = __VLS_365({}, ...__VLS_functionalComponentArgsRest(__VLS_365));
__VLS_367.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({});
const __VLS_368 = {}.VIcon;
/** @type {[typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, ]} */ ;
// @ts-ignore
const __VLS_369 = __VLS_asFunctionalComponent(__VLS_368, new __VLS_368({}));
const __VLS_370 = __VLS_369({}, ...__VLS_functionalComponentArgsRest(__VLS_369));
__VLS_371.slots.default;
var __VLS_371;
(__VLS_ctx.selectedEvent?.seats_number);
__VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({});
const __VLS_372 = {}.VIcon;
/** @type {[typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, ]} */ ;
// @ts-ignore
const __VLS_373 = __VLS_asFunctionalComponent(__VLS_372, new __VLS_372({}));
const __VLS_374 = __VLS_373({}, ...__VLS_functionalComponentArgsRest(__VLS_373));
__VLS_375.slots.default;
var __VLS_375;
(__VLS_ctx.selectedEvent?.scenario);
if (__VLS_ctx.getSeasonInfo(__VLS_ctx.selectedEvent?.seasons_fk).name) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({});
    const __VLS_376 = {}.VIcon;
    /** @type {[typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, ]} */ ;
    // @ts-ignore
    const __VLS_377 = __VLS_asFunctionalComponent(__VLS_376, new __VLS_376({}));
    const __VLS_378 = __VLS_377({}, ...__VLS_functionalComponentArgsRest(__VLS_377));
    __VLS_379.slots.default;
    var __VLS_379;
    (__VLS_ctx.getSeasonInfo(__VLS_ctx.selectedEvent.seasons_fk).name);
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
    ...{ class: "text-end scheduled-box" },
});
(__VLS_ctx.formatEventDate(__VLS_ctx.selectedEvent?.event_date, __VLS_ctx.userTimezone));
var __VLS_367;
const __VLS_380 = {}.VCard;
/** @type {[typeof __VLS_components.VCard, typeof __VLS_components.vCard, typeof __VLS_components.VCard, typeof __VLS_components.vCard, ]} */ ;
// @ts-ignore
const __VLS_381 = __VLS_asFunctionalComponent(__VLS_380, new __VLS_380({
    ...{ 'onClick': {} },
    color: "primary",
    minHeight: "130px",
    ...{ class: "mr-4 event-card" },
}));
const __VLS_382 = __VLS_381({
    ...{ 'onClick': {} },
    color: "primary",
    minHeight: "130px",
    ...{ class: "mr-4 event-card" },
}, ...__VLS_functionalComponentArgsRest(__VLS_381));
let __VLS_384;
let __VLS_385;
let __VLS_386;
const __VLS_387 = {
    onClick: (...[$event]) => {
        __VLS_ctx.openInGoogleMaps();
    }
};
__VLS_383.slots.default;
const __VLS_388 = {}.VRow;
/** @type {[typeof __VLS_components.VRow, typeof __VLS_components.vRow, typeof __VLS_components.VRow, typeof __VLS_components.vRow, ]} */ ;
// @ts-ignore
const __VLS_389 = __VLS_asFunctionalComponent(__VLS_388, new __VLS_388({
    noGutters: true,
}));
const __VLS_390 = __VLS_389({
    noGutters: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_389));
__VLS_391.slots.default;
const __VLS_392 = {}.VCol;
/** @type {[typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ]} */ ;
// @ts-ignore
const __VLS_393 = __VLS_asFunctionalComponent(__VLS_392, new __VLS_392({
    cols: "3",
    lg: "3",
}));
const __VLS_394 = __VLS_393({
    cols: "3",
    lg: "3",
}, ...__VLS_functionalComponentArgsRest(__VLS_393));
__VLS_395.slots.default;
const __VLS_396 = {}.VImg;
/** @type {[typeof __VLS_components.VImg, typeof __VLS_components.vImg, ]} */ ;
// @ts-ignore
const __VLS_397 = __VLS_asFunctionalComponent(__VLS_396, new __VLS_396({
    src: (__VLS_ctx.selectedEvent?.picture_hash
        ? `https://assets.drunagor.app/${__VLS_ctx.selectedEvent.picture_hash}`
        : 'https://s3.us-east-2.amazonaws.com/assets.drunagor.app/Profile/store.png'),
    ...{ class: "event-img" },
}));
const __VLS_398 = __VLS_397({
    src: (__VLS_ctx.selectedEvent?.picture_hash
        ? `https://assets.drunagor.app/${__VLS_ctx.selectedEvent.picture_hash}`
        : 'https://s3.us-east-2.amazonaws.com/assets.drunagor.app/Profile/store.png'),
    ...{ class: "event-img" },
}, ...__VLS_functionalComponentArgsRest(__VLS_397));
var __VLS_395;
const __VLS_400 = {}.VCol;
/** @type {[typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ]} */ ;
// @ts-ignore
const __VLS_401 = __VLS_asFunctionalComponent(__VLS_400, new __VLS_400({
    cols: "9",
    ...{ class: "pa-2" },
}));
const __VLS_402 = __VLS_401({
    cols: "9",
    ...{ class: "pa-2" },
}, ...__VLS_functionalComponentArgsRest(__VLS_401));
__VLS_403.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.h3, __VLS_intrinsicElements.h3)({
    ...{ class: "text-subtitle-1 font-weight-bold" },
});
(__VLS_ctx.selectedEvent?.store_name);
__VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
    ...{ class: "text-caption" },
});
const __VLS_404 = {}.VIcon;
/** @type {[typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, ]} */ ;
// @ts-ignore
const __VLS_405 = __VLS_asFunctionalComponent(__VLS_404, new __VLS_404({
    color: "red",
}));
const __VLS_406 = __VLS_405({
    color: "red",
}, ...__VLS_functionalComponentArgsRest(__VLS_405));
__VLS_407.slots.default;
var __VLS_407;
(__VLS_ctx.selectedEvent?.address);
var __VLS_403;
const __VLS_408 = {}.VCol;
/** @type {[typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ]} */ ;
// @ts-ignore
const __VLS_409 = __VLS_asFunctionalComponent(__VLS_408, new __VLS_408({
    cols: "2",
    ...{ class: "text-right pa-0" },
}));
const __VLS_410 = __VLS_409({
    cols: "2",
    ...{ class: "text-right pa-0" },
}, ...__VLS_functionalComponentArgsRest(__VLS_409));
var __VLS_391;
var __VLS_383;
const __VLS_412 = {}.VCard;
/** @type {[typeof __VLS_components.VCard, typeof __VLS_components.vCard, typeof __VLS_components.VCard, typeof __VLS_components.vCard, ]} */ ;
// @ts-ignore
const __VLS_413 = __VLS_asFunctionalComponent(__VLS_412, new __VLS_412({
    color: "primary",
    ...{ class: "mr-4 mt-4 event-card" },
}));
const __VLS_414 = __VLS_413({
    color: "primary",
    ...{ class: "mr-4 mt-4 event-card" },
}, ...__VLS_functionalComponentArgsRest(__VLS_413));
__VLS_415.slots.default;
const __VLS_416 = {}.VResponsive;
/** @type {[typeof __VLS_components.VResponsive, typeof __VLS_components.vResponsive, typeof __VLS_components.VResponsive, typeof __VLS_components.vResponsive, ]} */ ;
// @ts-ignore
const __VLS_417 = __VLS_asFunctionalComponent(__VLS_416, new __VLS_416({
    ...{ style: {} },
    aspectRatio: "16/9",
}));
const __VLS_418 = __VLS_417({
    ...{ style: {} },
    aspectRatio: "16/9",
}, ...__VLS_functionalComponentArgsRest(__VLS_417));
__VLS_419.slots.default;
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
var __VLS_419;
var __VLS_415;
const __VLS_420 = {}.VCardText;
/** @type {[typeof __VLS_components.VCardText, typeof __VLS_components.vCardText, typeof __VLS_components.VCardText, typeof __VLS_components.vCardText, ]} */ ;
// @ts-ignore
const __VLS_421 = __VLS_asFunctionalComponent(__VLS_420, new __VLS_420({}));
const __VLS_422 = __VLS_421({}, ...__VLS_functionalComponentArgsRest(__VLS_421));
__VLS_423.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.h3, __VLS_intrinsicElements.h3)({
    ...{ class: "text-h6 font-weight-bold" },
});
if (__VLS_ctx.eventRewards.length) {
    for (const [reward, index] of __VLS_getVForSourceType((__VLS_ctx.eventRewards))) {
        const __VLS_424 = {}.VRow;
        /** @type {[typeof __VLS_components.VRow, typeof __VLS_components.vRow, typeof __VLS_components.VRow, typeof __VLS_components.vRow, ]} */ ;
        // @ts-ignore
        const __VLS_425 = __VLS_asFunctionalComponent(__VLS_424, new __VLS_424({
            key: (index),
            ...{ class: "align-center my-2" },
        }));
        const __VLS_426 = __VLS_425({
            key: (index),
            ...{ class: "align-center my-2" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_425));
        __VLS_427.slots.default;
        const __VLS_428 = {}.VCol;
        /** @type {[typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ]} */ ;
        // @ts-ignore
        const __VLS_429 = __VLS_asFunctionalComponent(__VLS_428, new __VLS_428({
            cols: "3",
            md: "2",
        }));
        const __VLS_430 = __VLS_429({
            cols: "3",
            md: "2",
        }, ...__VLS_functionalComponentArgsRest(__VLS_429));
        __VLS_431.slots.default;
        const __VLS_432 = {}.VAvatar;
        /** @type {[typeof __VLS_components.VAvatar, typeof __VLS_components.vAvatar, typeof __VLS_components.VAvatar, typeof __VLS_components.vAvatar, ]} */ ;
        // @ts-ignore
        const __VLS_433 = __VLS_asFunctionalComponent(__VLS_432, new __VLS_432({
            size: "60",
        }));
        const __VLS_434 = __VLS_433({
            size: "60",
        }, ...__VLS_functionalComponentArgsRest(__VLS_433));
        __VLS_435.slots.default;
        const __VLS_436 = {}.VImg;
        /** @type {[typeof __VLS_components.VImg, typeof __VLS_components.vImg, ]} */ ;
        // @ts-ignore
        const __VLS_437 = __VLS_asFunctionalComponent(__VLS_436, new __VLS_436({
            src: (`https://assets.drunagor.app/${reward.picture_hash}`),
        }));
        const __VLS_438 = __VLS_437({
            src: (`https://assets.drunagor.app/${reward.picture_hash}`),
        }, ...__VLS_functionalComponentArgsRest(__VLS_437));
        var __VLS_435;
        var __VLS_431;
        const __VLS_440 = {}.VCol;
        /** @type {[typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ]} */ ;
        // @ts-ignore
        const __VLS_441 = __VLS_asFunctionalComponent(__VLS_440, new __VLS_440({
            cols: "9",
            md: "10",
        }));
        const __VLS_442 = __VLS_441({
            cols: "9",
            md: "10",
        }, ...__VLS_functionalComponentArgsRest(__VLS_441));
        __VLS_443.slots.default;
        __VLS_asFunctionalElement(__VLS_intrinsicElements.h4, __VLS_intrinsicElements.h4)({
            ...{ class: "text-subtitle-1 font-weight-bold" },
        });
        (reward.name);
        var __VLS_443;
        var __VLS_427;
    }
}
else {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
        ...{ class: "text-caption" },
    });
}
var __VLS_423;
const __VLS_444 = {}.VRow;
/** @type {[typeof __VLS_components.VRow, typeof __VLS_components.vRow, typeof __VLS_components.VRow, typeof __VLS_components.vRow, ]} */ ;
// @ts-ignore
const __VLS_445 = __VLS_asFunctionalComponent(__VLS_444, new __VLS_444({
    ...{ class: "mt-2 ml-0" },
}));
const __VLS_446 = __VLS_445({
    ...{ class: "mt-2 ml-0" },
}, ...__VLS_functionalComponentArgsRest(__VLS_445));
var __VLS_351;
var __VLS_347;
const __VLS_448 = {}.VDialog;
/** @type {[typeof __VLS_components.VDialog, typeof __VLS_components.vDialog, typeof __VLS_components.VDialog, typeof __VLS_components.vDialog, ]} */ ;
// @ts-ignore
const __VLS_449 = __VLS_asFunctionalComponent(__VLS_448, new __VLS_448({
    modelValue: (__VLS_ctx.createEventDialog),
    maxWidth: "1280",
    scrollTarget: "#app",
}));
const __VLS_450 = __VLS_449({
    modelValue: (__VLS_ctx.createEventDialog),
    maxWidth: "1280",
    scrollTarget: "#app",
}, ...__VLS_functionalComponentArgsRest(__VLS_449));
__VLS_451.slots.default;
const __VLS_452 = {}.VCard;
/** @type {[typeof __VLS_components.VCard, typeof __VLS_components.vCard, typeof __VLS_components.VCard, typeof __VLS_components.vCard, ]} */ ;
// @ts-ignore
const __VLS_453 = __VLS_asFunctionalComponent(__VLS_452, new __VLS_452({
    ...{ class: "create-event-shell dark-background" },
}));
const __VLS_454 = __VLS_453({
    ...{ class: "create-event-shell dark-background" },
}, ...__VLS_functionalComponentArgsRest(__VLS_453));
__VLS_455.slots.default;
if (__VLS_ctx.loading) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "loading-overlay" },
    });
    const __VLS_456 = {}.VProgressCircular;
    /** @type {[typeof __VLS_components.VProgressCircular, typeof __VLS_components.vProgressCircular, ]} */ ;
    // @ts-ignore
    const __VLS_457 = __VLS_asFunctionalComponent(__VLS_456, new __VLS_456({
        indeterminate: true,
        size: "80",
        color: "primary",
    }));
    const __VLS_458 = __VLS_457({
        indeterminate: true,
        size: "80",
        color: "primary",
    }, ...__VLS_functionalComponentArgsRest(__VLS_457));
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "create-event-header" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.h2, __VLS_intrinsicElements.h2)({
    ...{ class: "text-h5 font-weight-black mb-0" },
});
const __VLS_460 = {}.VBtn;
/** @type {[typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ]} */ ;
// @ts-ignore
const __VLS_461 = __VLS_asFunctionalComponent(__VLS_460, new __VLS_460({
    ...{ 'onClick': {} },
    icon: true,
    size: "default",
    ...{ class: "close-btn" },
}));
const __VLS_462 = __VLS_461({
    ...{ 'onClick': {} },
    icon: true,
    size: "default",
    ...{ class: "close-btn" },
}, ...__VLS_functionalComponentArgsRest(__VLS_461));
let __VLS_464;
let __VLS_465;
let __VLS_466;
const __VLS_467 = {
    onClick: (...[$event]) => {
        __VLS_ctx.createEventDialog = false;
    }
};
__VLS_463.slots.default;
const __VLS_468 = {}.VIcon;
/** @type {[typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, ]} */ ;
// @ts-ignore
const __VLS_469 = __VLS_asFunctionalComponent(__VLS_468, new __VLS_468({
    size: "20",
}));
const __VLS_470 = __VLS_469({
    size: "20",
}, ...__VLS_functionalComponentArgsRest(__VLS_469));
__VLS_471.slots.default;
var __VLS_471;
var __VLS_463;
const __VLS_472 = {}.VCardText;
/** @type {[typeof __VLS_components.VCardText, typeof __VLS_components.vCardText, typeof __VLS_components.VCardText, typeof __VLS_components.vCardText, ]} */ ;
// @ts-ignore
const __VLS_473 = __VLS_asFunctionalComponent(__VLS_472, new __VLS_472({
    ...{ class: "create-event-body" },
}));
const __VLS_474 = __VLS_473({
    ...{ class: "create-event-body" },
}, ...__VLS_functionalComponentArgsRest(__VLS_473));
__VLS_475.slots.default;
const __VLS_476 = {}.VRow;
/** @type {[typeof __VLS_components.VRow, typeof __VLS_components.vRow, typeof __VLS_components.VRow, typeof __VLS_components.vRow, ]} */ ;
// @ts-ignore
const __VLS_477 = __VLS_asFunctionalComponent(__VLS_476, new __VLS_476({
    dense: true,
}));
const __VLS_478 = __VLS_477({
    dense: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_477));
__VLS_479.slots.default;
const __VLS_480 = {}.VCol;
/** @type {[typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ]} */ ;
// @ts-ignore
const __VLS_481 = __VLS_asFunctionalComponent(__VLS_480, new __VLS_480({
    cols: "12",
}));
const __VLS_482 = __VLS_481({
    cols: "12",
}, ...__VLS_functionalComponentArgsRest(__VLS_481));
__VLS_483.slots.default;
const __VLS_484 = {}.VSelect;
/** @type {[typeof __VLS_components.VSelect, typeof __VLS_components.vSelect, ]} */ ;
// @ts-ignore
const __VLS_485 = __VLS_asFunctionalComponent(__VLS_484, new __VLS_484({
    modelValue: (__VLS_ctx.newEvent.store),
    items: (__VLS_ctx.availableStores),
    label: "STORE",
    variant: "outlined",
    prependInnerIcon: "mdi-store",
    loading: (__VLS_ctx.loading),
    noDataText: "No stores found",
}));
const __VLS_486 = __VLS_485({
    modelValue: (__VLS_ctx.newEvent.store),
    items: (__VLS_ctx.availableStores),
    label: "STORE",
    variant: "outlined",
    prependInnerIcon: "mdi-store",
    loading: (__VLS_ctx.loading),
    noDataText: "No stores found",
}, ...__VLS_functionalComponentArgsRest(__VLS_485));
var __VLS_483;
const __VLS_488 = {}.VCol;
/** @type {[typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ]} */ ;
// @ts-ignore
const __VLS_489 = __VLS_asFunctionalComponent(__VLS_488, new __VLS_488({
    cols: "12",
    sm: "6",
}));
const __VLS_490 = __VLS_489({
    cols: "12",
    sm: "6",
}, ...__VLS_functionalComponentArgsRest(__VLS_489));
__VLS_491.slots.default;
const __VLS_492 = {}.VSelect;
/** @type {[typeof __VLS_components.VSelect, typeof __VLS_components.vSelect, typeof __VLS_components.VSelect, typeof __VLS_components.vSelect, ]} */ ;
// @ts-ignore
const __VLS_493 = __VLS_asFunctionalComponent(__VLS_492, new __VLS_492({
    modelValue: (__VLS_ctx.newEvent.season),
    items: (__VLS_ctx.retailerSeasonOptions),
    itemTitle: "name",
    itemValue: "seasons_pk",
    label: "SEASON",
    variant: "outlined",
    prependInnerIcon: "mdi-flag-variant",
}));
const __VLS_494 = __VLS_493({
    modelValue: (__VLS_ctx.newEvent.season),
    items: (__VLS_ctx.retailerSeasonOptions),
    itemTitle: "name",
    itemValue: "seasons_pk",
    label: "SEASON",
    variant: "outlined",
    prependInnerIcon: "mdi-flag-variant",
}, ...__VLS_functionalComponentArgsRest(__VLS_493));
var __VLS_491;
const __VLS_496 = {}.VCol;
/** @type {[typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ]} */ ;
// @ts-ignore
const __VLS_497 = __VLS_asFunctionalComponent(__VLS_496, new __VLS_496({
    cols: "12",
    md: "6",
}));
const __VLS_498 = __VLS_497({
    cols: "12",
    md: "6",
}, ...__VLS_functionalComponentArgsRest(__VLS_497));
__VLS_499.slots.default;
const __VLS_500 = {}.VSelect;
/** @type {[typeof __VLS_components.VSelect, typeof __VLS_components.vSelect, typeof __VLS_components.VSelect, typeof __VLS_components.vSelect, ]} */ ;
// @ts-ignore
const __VLS_501 = __VLS_asFunctionalComponent(__VLS_500, new __VLS_500({
    modelValue: (__VLS_ctx.newEvent.scenario),
    items: (__VLS_ctx.filteredScenarios),
    itemTitle: "displayName",
    itemValue: "sceneries_pk",
    label: "WING",
    variant: "outlined",
    prependInnerIcon: "mdi-sword-cross",
    disabled: (!__VLS_ctx.filteredScenarios.length),
    noDataText: "No wings available",
}));
const __VLS_502 = __VLS_501({
    modelValue: (__VLS_ctx.newEvent.scenario),
    items: (__VLS_ctx.filteredScenarios),
    itemTitle: "displayName",
    itemValue: "sceneries_pk",
    label: "WING",
    variant: "outlined",
    prependInnerIcon: "mdi-sword-cross",
    disabled: (!__VLS_ctx.filteredScenarios.length),
    noDataText: "No wings available",
}, ...__VLS_functionalComponentArgsRest(__VLS_501));
__VLS_503.slots.default;
{
    const { item: __VLS_thisSlot } = __VLS_503.slots;
    const [{ item, props }] = __VLS_getSlotParams(__VLS_thisSlot);
    const __VLS_504 = {}.VListItem;
    /** @type {[typeof __VLS_components.VListItem, typeof __VLS_components.vListItem, typeof __VLS_components.VListItem, typeof __VLS_components.vListItem, ]} */ ;
    // @ts-ignore
    const __VLS_505 = __VLS_asFunctionalComponent(__VLS_504, new __VLS_504({
        ...(props),
        title: (item.raw.wingLabel || item.raw.name),
        subtitle: (item.raw.name),
    }));
    const __VLS_506 = __VLS_505({
        ...(props),
        title: (item.raw.wingLabel || item.raw.name),
        subtitle: (item.raw.name),
    }, ...__VLS_functionalComponentArgsRest(__VLS_505));
}
{
    const { selection: __VLS_thisSlot } = __VLS_503.slots;
    const [{ item }] = __VLS_getSlotParams(__VLS_thisSlot);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "select-short-value" },
    });
    (item.raw.wingLabel || item.raw.name);
}
var __VLS_503;
var __VLS_499;
const __VLS_508 = {}.VCol;
/** @type {[typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ]} */ ;
// @ts-ignore
const __VLS_509 = __VLS_asFunctionalComponent(__VLS_508, new __VLS_508({
    cols: "4",
    sm: "4",
    md: "2",
}));
const __VLS_510 = __VLS_509({
    cols: "4",
    sm: "4",
    md: "2",
}, ...__VLS_functionalComponentArgsRest(__VLS_509));
__VLS_511.slots.default;
const __VLS_512 = {}.VSelect;
/** @type {[typeof __VLS_components.VSelect, typeof __VLS_components.vSelect, typeof __VLS_components.VSelect, typeof __VLS_components.vSelect, ]} */ ;
// @ts-ignore
const __VLS_513 = __VLS_asFunctionalComponent(__VLS_512, new __VLS_512({
    modelValue: (__VLS_ctx.newEvent.hour),
    items: (__VLS_ctx.hourOptions),
    label: "HOUR",
    variant: "outlined",
    ...{ class: "time-input" },
}));
const __VLS_514 = __VLS_513({
    modelValue: (__VLS_ctx.newEvent.hour),
    items: (__VLS_ctx.hourOptions),
    label: "HOUR",
    variant: "outlined",
    ...{ class: "time-input" },
}, ...__VLS_functionalComponentArgsRest(__VLS_513));
var __VLS_511;
const __VLS_516 = {}.VCol;
/** @type {[typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ]} */ ;
// @ts-ignore
const __VLS_517 = __VLS_asFunctionalComponent(__VLS_516, new __VLS_516({
    cols: "4",
    sm: "4",
    md: "2",
}));
const __VLS_518 = __VLS_517({
    cols: "4",
    sm: "4",
    md: "2",
}, ...__VLS_functionalComponentArgsRest(__VLS_517));
__VLS_519.slots.default;
const __VLS_520 = {}.VSelect;
/** @type {[typeof __VLS_components.VSelect, typeof __VLS_components.vSelect, typeof __VLS_components.VSelect, typeof __VLS_components.vSelect, ]} */ ;
// @ts-ignore
const __VLS_521 = __VLS_asFunctionalComponent(__VLS_520, new __VLS_520({
    modelValue: (__VLS_ctx.newEvent.minute),
    items: (__VLS_ctx.minuteOptions),
    label: "MIN",
    variant: "outlined",
    ...{ class: "time-input" },
}));
const __VLS_522 = __VLS_521({
    modelValue: (__VLS_ctx.newEvent.minute),
    items: (__VLS_ctx.minuteOptions),
    label: "MIN",
    variant: "outlined",
    ...{ class: "time-input" },
}, ...__VLS_functionalComponentArgsRest(__VLS_521));
var __VLS_519;
const __VLS_524 = {}.VCol;
/** @type {[typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ]} */ ;
// @ts-ignore
const __VLS_525 = __VLS_asFunctionalComponent(__VLS_524, new __VLS_524({
    cols: "4",
    sm: "4",
    md: "2",
}));
const __VLS_526 = __VLS_525({
    cols: "4",
    sm: "4",
    md: "2",
}, ...__VLS_functionalComponentArgsRest(__VLS_525));
__VLS_527.slots.default;
const __VLS_528 = {}.VSelect;
/** @type {[typeof __VLS_components.VSelect, typeof __VLS_components.vSelect, typeof __VLS_components.VSelect, typeof __VLS_components.vSelect, ]} */ ;
// @ts-ignore
const __VLS_529 = __VLS_asFunctionalComponent(__VLS_528, new __VLS_528({
    modelValue: (__VLS_ctx.newEvent.ampm),
    items: (['AM', 'PM']),
    label: "AM/PM",
    variant: "outlined",
}));
const __VLS_530 = __VLS_529({
    modelValue: (__VLS_ctx.newEvent.ampm),
    items: (['AM', 'PM']),
    label: "AM/PM",
    variant: "outlined",
}, ...__VLS_functionalComponentArgsRest(__VLS_529));
var __VLS_527;
const __VLS_532 = {}.VCol;
/** @type {[typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ]} */ ;
// @ts-ignore
const __VLS_533 = __VLS_asFunctionalComponent(__VLS_532, new __VLS_532({
    cols: "12",
    sm: "6",
    md: "6",
    ...{ class: "d-flex align-center" },
}));
const __VLS_534 = __VLS_533({
    cols: "12",
    sm: "6",
    md: "6",
    ...{ class: "d-flex align-center" },
}, ...__VLS_functionalComponentArgsRest(__VLS_533));
__VLS_535.slots.default;
const __VLS_536 = {}.VTextField;
/** @type {[typeof __VLS_components.VTextField, typeof __VLS_components.vTextField, typeof __VLS_components.VTextField, typeof __VLS_components.vTextField, ]} */ ;
// @ts-ignore
const __VLS_537 = __VLS_asFunctionalComponent(__VLS_536, new __VLS_536({
    modelValue: (__VLS_ctx.newEvent.date),
    label: "DATE",
    type: "date",
    variant: "outlined",
    ...{ class: "date-input" },
    prependInnerIcon: "mdi-calendar",
    lang: "en-US",
    placeholder: "mm/dd/yyyy",
    min: (__VLS_ctx.today),
    max: (__VLS_ctx.oneYearFromTodayISO),
    rules: (__VLS_ctx.dateRules),
}));
const __VLS_538 = __VLS_537({
    modelValue: (__VLS_ctx.newEvent.date),
    label: "DATE",
    type: "date",
    variant: "outlined",
    ...{ class: "date-input" },
    prependInnerIcon: "mdi-calendar",
    lang: "en-US",
    placeholder: "mm/dd/yyyy",
    min: (__VLS_ctx.today),
    max: (__VLS_ctx.oneYearFromTodayISO),
    rules: (__VLS_ctx.dateRules),
}, ...__VLS_functionalComponentArgsRest(__VLS_537));
var __VLS_535;
if (__VLS_ctx.selectedRewards.length > 0) {
    const __VLS_540 = {}.VCol;
    /** @type {[typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ]} */ ;
    // @ts-ignore
    const __VLS_541 = __VLS_asFunctionalComponent(__VLS_540, new __VLS_540({
        cols: "12",
    }));
    const __VLS_542 = __VLS_541({
        cols: "12",
    }, ...__VLS_functionalComponentArgsRest(__VLS_541));
    __VLS_543.slots.default;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
        ...{ class: "text-subtitle-1 font-weight-bold mb-2" },
    });
    for (const [reward, index] of __VLS_getVForSourceType((__VLS_ctx.selectedRewards))) {
        const __VLS_544 = {}.VCard;
        /** @type {[typeof __VLS_components.VCard, typeof __VLS_components.vCard, typeof __VLS_components.VCard, typeof __VLS_components.vCard, ]} */ ;
        // @ts-ignore
        const __VLS_545 = __VLS_asFunctionalComponent(__VLS_544, new __VLS_544({
            key: (index),
            rounded: "lg",
            elevation: "2",
            ...{ class: "py-2 px-2 d-flex align-center position-relative mb-2" },
            color: "rgba(255, 255, 255, 0.05)",
        }));
        const __VLS_546 = __VLS_545({
            key: (index),
            rounded: "lg",
            elevation: "2",
            ...{ class: "py-2 px-2 d-flex align-center position-relative mb-2" },
            color: "rgba(255, 255, 255, 0.05)",
        }, ...__VLS_functionalComponentArgsRest(__VLS_545));
        __VLS_547.slots.default;
        const __VLS_548 = {}.VRow;
        /** @type {[typeof __VLS_components.VRow, typeof __VLS_components.vRow, typeof __VLS_components.VRow, typeof __VLS_components.vRow, ]} */ ;
        // @ts-ignore
        const __VLS_549 = __VLS_asFunctionalComponent(__VLS_548, new __VLS_548({
            ...{ class: "align-center" },
            noGutters: true,
        }));
        const __VLS_550 = __VLS_549({
            ...{ class: "align-center" },
            noGutters: true,
        }, ...__VLS_functionalComponentArgsRest(__VLS_549));
        __VLS_551.slots.default;
        const __VLS_552 = {}.VCol;
        /** @type {[typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ]} */ ;
        // @ts-ignore
        const __VLS_553 = __VLS_asFunctionalComponent(__VLS_552, new __VLS_552({
            cols: "3",
            sm: "2",
            ...{ class: "d-flex align-center justify-center pl-2" },
        }));
        const __VLS_554 = __VLS_553({
            cols: "3",
            sm: "2",
            ...{ class: "d-flex align-center justify-center pl-2" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_553));
        __VLS_555.slots.default;
        const __VLS_556 = {}.VImg;
        /** @type {[typeof __VLS_components.VImg, typeof __VLS_components.vImg, typeof __VLS_components.VImg, typeof __VLS_components.vImg, ]} */ ;
        // @ts-ignore
        const __VLS_557 = __VLS_asFunctionalComponent(__VLS_556, new __VLS_556({
            src: (`https://assets.drunagor.app/${reward.picture_hash}`),
            alt: "Reward Icon",
            maxHeight: "64",
            maxWidth: "64",
            contain: true,
        }));
        const __VLS_558 = __VLS_557({
            src: (`https://assets.drunagor.app/${reward.picture_hash}`),
            alt: "Reward Icon",
            maxHeight: "64",
            maxWidth: "64",
            contain: true,
        }, ...__VLS_functionalComponentArgsRest(__VLS_557));
        var __VLS_555;
        const __VLS_560 = {}.VCol;
        /** @type {[typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ]} */ ;
        // @ts-ignore
        const __VLS_561 = __VLS_asFunctionalComponent(__VLS_560, new __VLS_560({
            cols: "9",
            sm: "10",
            ...{ class: "pl-4 d-flex flex-column justify-center" },
        }));
        const __VLS_562 = __VLS_561({
            cols: "9",
            sm: "10",
            ...{ class: "pl-4 d-flex flex-column justify-center" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_561));
        __VLS_563.slots.default;
        __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
            ...{ class: "font-weight-bold white--text ma-0 text-h6" },
        });
        (reward.name);
        __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
            ...{ class: "text-body-2 grey--text ma-0" },
        });
        (reward.description);
        var __VLS_563;
        var __VLS_551;
        var __VLS_547;
    }
    var __VLS_543;
}
const __VLS_564 = {}.VCol;
/** @type {[typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ]} */ ;
// @ts-ignore
const __VLS_565 = __VLS_asFunctionalComponent(__VLS_564, new __VLS_564({
    cols: "12",
}));
const __VLS_566 = __VLS_565({
    cols: "12",
}, ...__VLS_functionalComponentArgsRest(__VLS_565));
__VLS_567.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "create-event-actions" },
});
const __VLS_568 = {}.VBtn;
/** @type {[typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ]} */ ;
// @ts-ignore
const __VLS_569 = __VLS_asFunctionalComponent(__VLS_568, new __VLS_568({
    ...{ 'onClick': {} },
    variant: "text",
    color: "white",
}));
const __VLS_570 = __VLS_569({
    ...{ 'onClick': {} },
    variant: "text",
    color: "white",
}, ...__VLS_functionalComponentArgsRest(__VLS_569));
let __VLS_572;
let __VLS_573;
let __VLS_574;
const __VLS_575 = {
    onClick: (...[$event]) => {
        __VLS_ctx.createEventDialog = false;
    }
};
__VLS_571.slots.default;
var __VLS_571;
const __VLS_576 = {}.VBtn;
/** @type {[typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ]} */ ;
// @ts-ignore
const __VLS_577 = __VLS_asFunctionalComponent(__VLS_576, new __VLS_576({
    ...{ 'onClick': {} },
    color: "secundary",
    ...{ class: "launch-btn" },
    loading: (__VLS_ctx.loading),
    disabled: (__VLS_ctx.loading || !__VLS_ctx.createEventReady),
}));
const __VLS_578 = __VLS_577({
    ...{ 'onClick': {} },
    color: "secundary",
    ...{ class: "launch-btn" },
    loading: (__VLS_ctx.loading),
    disabled: (__VLS_ctx.loading || !__VLS_ctx.createEventReady),
}, ...__VLS_functionalComponentArgsRest(__VLS_577));
let __VLS_580;
let __VLS_581;
let __VLS_582;
const __VLS_583 = {
    onClick: (__VLS_ctx.addEvent)
};
__VLS_579.slots.default;
var __VLS_579;
var __VLS_567;
var __VLS_479;
var __VLS_475;
var __VLS_455;
var __VLS_451;
const __VLS_584 = {}.VDialog;
/** @type {[typeof __VLS_components.VDialog, typeof __VLS_components.vDialog, typeof __VLS_components.VDialog, typeof __VLS_components.vDialog, ]} */ ;
// @ts-ignore
const __VLS_585 = __VLS_asFunctionalComponent(__VLS_584, new __VLS_584({
    modelValue: (__VLS_ctx.editEventDialog),
    scrollTarget: "#app",
    maxWidth: "800",
}));
const __VLS_586 = __VLS_585({
    modelValue: (__VLS_ctx.editEventDialog),
    scrollTarget: "#app",
    maxWidth: "800",
}, ...__VLS_functionalComponentArgsRest(__VLS_585));
__VLS_587.slots.default;
const __VLS_588 = {}.VCard;
/** @type {[typeof __VLS_components.VCard, typeof __VLS_components.vCard, typeof __VLS_components.VCard, typeof __VLS_components.vCard, ]} */ ;
// @ts-ignore
const __VLS_589 = __VLS_asFunctionalComponent(__VLS_588, new __VLS_588({
    ...{ class: "dark-background" },
}));
const __VLS_590 = __VLS_589({
    ...{ class: "dark-background" },
}, ...__VLS_functionalComponentArgsRest(__VLS_589));
__VLS_591.slots.default;
if (__VLS_ctx.loading) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "loading-overlay" },
    });
    const __VLS_592 = {}.VProgressCircular;
    /** @type {[typeof __VLS_components.VProgressCircular, typeof __VLS_components.vProgressCircular, ]} */ ;
    // @ts-ignore
    const __VLS_593 = __VLS_asFunctionalComponent(__VLS_592, new __VLS_592({
        indeterminate: true,
        size: "80",
        color: "primary",
    }));
    const __VLS_594 = __VLS_593({
        indeterminate: true,
        size: "80",
        color: "primary",
    }, ...__VLS_functionalComponentArgsRest(__VLS_593));
}
if (__VLS_ctx.showSuccessAlert) {
    const __VLS_596 = {}.VAlert;
    /** @type {[typeof __VLS_components.VAlert, typeof __VLS_components.vAlert, typeof __VLS_components.VAlert, typeof __VLS_components.vAlert, ]} */ ;
    // @ts-ignore
    const __VLS_597 = __VLS_asFunctionalComponent(__VLS_596, new __VLS_596({
        type: "success",
        ...{ class: "mb-4" },
        dense: true,
    }));
    const __VLS_598 = __VLS_597({
        type: "success",
        ...{ class: "mb-4" },
        dense: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_597));
    __VLS_599.slots.default;
    var __VLS_599;
}
const __VLS_600 = {}.VCardText;
/** @type {[typeof __VLS_components.VCardText, typeof __VLS_components.vCardText, typeof __VLS_components.VCardText, typeof __VLS_components.vCardText, ]} */ ;
// @ts-ignore
const __VLS_601 = __VLS_asFunctionalComponent(__VLS_600, new __VLS_600({}));
const __VLS_602 = __VLS_601({}, ...__VLS_functionalComponentArgsRest(__VLS_601));
__VLS_603.slots.default;
const __VLS_604 = {}.VRow;
/** @type {[typeof __VLS_components.VRow, typeof __VLS_components.vRow, typeof __VLS_components.VRow, typeof __VLS_components.vRow, ]} */ ;
// @ts-ignore
const __VLS_605 = __VLS_asFunctionalComponent(__VLS_604, new __VLS_604({}));
const __VLS_606 = __VLS_605({}, ...__VLS_functionalComponentArgsRest(__VLS_605));
__VLS_607.slots.default;
if (__VLS_ctx.isEditable) {
    const __VLS_608 = {}.VCol;
    /** @type {[typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ]} */ ;
    // @ts-ignore
    const __VLS_609 = __VLS_asFunctionalComponent(__VLS_608, new __VLS_608({
        cols: "6",
        md: "6",
    }));
    const __VLS_610 = __VLS_609({
        cols: "6",
        md: "6",
    }, ...__VLS_functionalComponentArgsRest(__VLS_609));
    __VLS_611.slots.default;
    const __VLS_612 = {}.VSelect;
    /** @type {[typeof __VLS_components.VSelect, typeof __VLS_components.vSelect, typeof __VLS_components.VSelect, typeof __VLS_components.vSelect, ]} */ ;
    // @ts-ignore
    const __VLS_613 = __VLS_asFunctionalComponent(__VLS_612, new __VLS_612({
        modelValue: (__VLS_ctx.editableEvent.seats_number),
        items: ([1, 2, 3, 4]),
        label: "SEATS",
        variant: "outlined",
    }));
    const __VLS_614 = __VLS_613({
        modelValue: (__VLS_ctx.editableEvent.seats_number),
        items: ([1, 2, 3, 4]),
        label: "SEATS",
        variant: "outlined",
    }, ...__VLS_functionalComponentArgsRest(__VLS_613));
    var __VLS_611;
}
if (__VLS_ctx.isEditable) {
    const __VLS_616 = {}.VCol;
    /** @type {[typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ]} */ ;
    // @ts-ignore
    const __VLS_617 = __VLS_asFunctionalComponent(__VLS_616, new __VLS_616({
        cols: "6",
        md: "6",
    }));
    const __VLS_618 = __VLS_617({
        cols: "6",
        md: "6",
    }, ...__VLS_functionalComponentArgsRest(__VLS_617));
    __VLS_619.slots.default;
    const __VLS_620 = {}.VSelect;
    /** @type {[typeof __VLS_components.VSelect, typeof __VLS_components.vSelect, typeof __VLS_components.VSelect, typeof __VLS_components.vSelect, ]} */ ;
    // @ts-ignore
    const __VLS_621 = __VLS_asFunctionalComponent(__VLS_620, new __VLS_620({
        modelValue: (__VLS_ctx.editableEvent.sceneries_fk),
        items: (__VLS_ctx.editableScenarios),
        itemTitle: "displayName",
        itemValue: "sceneries_pk",
        label: "SCENARIO",
        variant: "outlined",
        key: (__VLS_ctx.editableScenarios.length),
        clearable: true,
    }));
    const __VLS_622 = __VLS_621({
        modelValue: (__VLS_ctx.editableEvent.sceneries_fk),
        items: (__VLS_ctx.editableScenarios),
        itemTitle: "displayName",
        itemValue: "sceneries_pk",
        label: "SCENARIO",
        variant: "outlined",
        key: (__VLS_ctx.editableScenarios.length),
        clearable: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_621));
    var __VLS_619;
}
if (__VLS_ctx.isEditable) {
    const __VLS_624 = {}.VCol;
    /** @type {[typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ]} */ ;
    // @ts-ignore
    const __VLS_625 = __VLS_asFunctionalComponent(__VLS_624, new __VLS_624({
        cols: "12",
    }));
    const __VLS_626 = __VLS_625({
        cols: "12",
    }, ...__VLS_functionalComponentArgsRest(__VLS_625));
    __VLS_627.slots.default;
    const __VLS_628 = {}.VSelect;
    /** @type {[typeof __VLS_components.VSelect, typeof __VLS_components.vSelect, typeof __VLS_components.VSelect, typeof __VLS_components.vSelect, ]} */ ;
    // @ts-ignore
    const __VLS_629 = __VLS_asFunctionalComponent(__VLS_628, new __VLS_628({
        modelValue: (__VLS_ctx.editableEvent.store),
        items: (__VLS_ctx.availableStores),
        label: "STORE",
        variant: "outlined",
    }));
    const __VLS_630 = __VLS_629({
        modelValue: (__VLS_ctx.editableEvent.store),
        items: (__VLS_ctx.availableStores),
        label: "STORE",
        variant: "outlined",
    }, ...__VLS_functionalComponentArgsRest(__VLS_629));
    var __VLS_627;
}
if (__VLS_ctx.isEditable) {
    const __VLS_632 = {}.VCol;
    /** @type {[typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ]} */ ;
    // @ts-ignore
    const __VLS_633 = __VLS_asFunctionalComponent(__VLS_632, new __VLS_632({
        cols: "6",
        md: "3",
    }));
    const __VLS_634 = __VLS_633({
        cols: "6",
        md: "3",
    }, ...__VLS_functionalComponentArgsRest(__VLS_633));
    __VLS_635.slots.default;
    const __VLS_636 = {}.VTextField;
    /** @type {[typeof __VLS_components.VTextField, typeof __VLS_components.vTextField, typeof __VLS_components.VTextField, typeof __VLS_components.vTextField, ]} */ ;
    // @ts-ignore
    const __VLS_637 = __VLS_asFunctionalComponent(__VLS_636, new __VLS_636({
        ...{ 'onBlur': {} },
        modelValue: (__VLS_ctx.editableEvent.hour),
        label: "TIME",
        variant: "outlined",
        placeholder: "HH:MM",
        maxlength: "5",
    }));
    const __VLS_638 = __VLS_637({
        ...{ 'onBlur': {} },
        modelValue: (__VLS_ctx.editableEvent.hour),
        label: "TIME",
        variant: "outlined",
        placeholder: "HH:MM",
        maxlength: "5",
    }, ...__VLS_functionalComponentArgsRest(__VLS_637));
    let __VLS_640;
    let __VLS_641;
    let __VLS_642;
    const __VLS_643 = {
        onBlur: (__VLS_ctx.validateTime)
    };
    var __VLS_639;
    var __VLS_635;
}
if (__VLS_ctx.isEditable) {
    const __VLS_644 = {}.VCol;
    /** @type {[typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ]} */ ;
    // @ts-ignore
    const __VLS_645 = __VLS_asFunctionalComponent(__VLS_644, new __VLS_644({
        cols: "6",
        md: "2",
    }));
    const __VLS_646 = __VLS_645({
        cols: "6",
        md: "2",
    }, ...__VLS_functionalComponentArgsRest(__VLS_645));
    __VLS_647.slots.default;
    const __VLS_648 = {}.VSelect;
    /** @type {[typeof __VLS_components.VSelect, typeof __VLS_components.vSelect, typeof __VLS_components.VSelect, typeof __VLS_components.vSelect, ]} */ ;
    // @ts-ignore
    const __VLS_649 = __VLS_asFunctionalComponent(__VLS_648, new __VLS_648({
        modelValue: (__VLS_ctx.editableEvent.ampm),
        items: (['AM', 'PM']),
        label: "AM/PM",
        variant: "outlined",
    }));
    const __VLS_650 = __VLS_649({
        modelValue: (__VLS_ctx.editableEvent.ampm),
        items: (['AM', 'PM']),
        label: "AM/PM",
        variant: "outlined",
    }, ...__VLS_functionalComponentArgsRest(__VLS_649));
    var __VLS_647;
}
if (__VLS_ctx.isEditable) {
    const __VLS_652 = {}.VCol;
    /** @type {[typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ]} */ ;
    // @ts-ignore
    const __VLS_653 = __VLS_asFunctionalComponent(__VLS_652, new __VLS_652({
        cols: "12",
        md: "6",
        ...{ class: "d-flex align-center" },
    }));
    const __VLS_654 = __VLS_653({
        cols: "12",
        md: "6",
        ...{ class: "d-flex align-center" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_653));
    __VLS_655.slots.default;
    const __VLS_656 = {}.VTextField;
    /** @type {[typeof __VLS_components.VTextField, typeof __VLS_components.vTextField, typeof __VLS_components.VTextField, typeof __VLS_components.vTextField, ]} */ ;
    // @ts-ignore
    const __VLS_657 = __VLS_asFunctionalComponent(__VLS_656, new __VLS_656({
        modelValue: (__VLS_ctx.editableEvent.date),
        label: "DATE",
        type: "date",
        variant: "outlined",
        ...{ class: "date-input" },
        min: (__VLS_ctx.today),
        max: (__VLS_ctx.oneYearFromTodayISO),
        rules: (__VLS_ctx.dateRules),
    }));
    const __VLS_658 = __VLS_657({
        modelValue: (__VLS_ctx.editableEvent.date),
        label: "DATE",
        type: "date",
        variant: "outlined",
        ...{ class: "date-input" },
        min: (__VLS_ctx.today),
        max: (__VLS_ctx.oneYearFromTodayISO),
        rules: (__VLS_ctx.dateRules),
    }, ...__VLS_functionalComponentArgsRest(__VLS_657));
    var __VLS_655;
}
if (__VLS_ctx.editableRewardsItems.length > 0) {
    const __VLS_660 = {}.VCol;
    /** @type {[typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ]} */ ;
    // @ts-ignore
    const __VLS_661 = __VLS_asFunctionalComponent(__VLS_660, new __VLS_660({
        cols: "12",
    }));
    const __VLS_662 = __VLS_661({
        cols: "12",
    }, ...__VLS_functionalComponentArgsRest(__VLS_661));
    __VLS_663.slots.default;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
        ...{ class: "pb-2 font-weight-bold cinzel-text" },
    });
    for (const [reward, index] of __VLS_getVForSourceType((__VLS_ctx.editableRewardsItems))) {
        const __VLS_664 = {}.VCard;
        /** @type {[typeof __VLS_components.VCard, typeof __VLS_components.vCard, typeof __VLS_components.VCard, typeof __VLS_components.vCard, ]} */ ;
        // @ts-ignore
        const __VLS_665 = __VLS_asFunctionalComponent(__VLS_664, new __VLS_664({
            key: (index),
            rounded: "lg",
            elevation: "2",
            ...{ class: "py-2 px-2 d-flex align-center position-relative mb-2" },
            color: "rgba(255, 255, 255, 0.05)",
        }));
        const __VLS_666 = __VLS_665({
            key: (index),
            rounded: "lg",
            elevation: "2",
            ...{ class: "py-2 px-2 d-flex align-center position-relative mb-2" },
            color: "rgba(255, 255, 255, 0.05)",
        }, ...__VLS_functionalComponentArgsRest(__VLS_665));
        __VLS_667.slots.default;
        const __VLS_668 = {}.VRow;
        /** @type {[typeof __VLS_components.VRow, typeof __VLS_components.vRow, typeof __VLS_components.VRow, typeof __VLS_components.vRow, ]} */ ;
        // @ts-ignore
        const __VLS_669 = __VLS_asFunctionalComponent(__VLS_668, new __VLS_668({
            ...{ class: "align-center" },
            noGutters: true,
        }));
        const __VLS_670 = __VLS_669({
            ...{ class: "align-center" },
            noGutters: true,
        }, ...__VLS_functionalComponentArgsRest(__VLS_669));
        __VLS_671.slots.default;
        const __VLS_672 = {}.VCol;
        /** @type {[typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ]} */ ;
        // @ts-ignore
        const __VLS_673 = __VLS_asFunctionalComponent(__VLS_672, new __VLS_672({
            cols: "3",
            sm: "2",
            ...{ class: "d-flex align-center justify-center pl-2" },
        }));
        const __VLS_674 = __VLS_673({
            cols: "3",
            sm: "2",
            ...{ class: "d-flex align-center justify-center pl-2" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_673));
        __VLS_675.slots.default;
        const __VLS_676 = {}.VImg;
        /** @type {[typeof __VLS_components.VImg, typeof __VLS_components.vImg, typeof __VLS_components.VImg, typeof __VLS_components.vImg, ]} */ ;
        // @ts-ignore
        const __VLS_677 = __VLS_asFunctionalComponent(__VLS_676, new __VLS_676({
            src: (`https://assets.drunagor.app/${reward.picture_hash}`),
            alt: "Reward Icon",
            maxHeight: "64",
            maxWidth: "64",
            contain: true,
        }));
        const __VLS_678 = __VLS_677({
            src: (`https://assets.drunagor.app/${reward.picture_hash}`),
            alt: "Reward Icon",
            maxHeight: "64",
            maxWidth: "64",
            contain: true,
        }, ...__VLS_functionalComponentArgsRest(__VLS_677));
        var __VLS_675;
        const __VLS_680 = {}.VCol;
        /** @type {[typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ]} */ ;
        // @ts-ignore
        const __VLS_681 = __VLS_asFunctionalComponent(__VLS_680, new __VLS_680({
            cols: "9",
            sm: "10",
            ...{ class: "pl-4 d-flex flex-column justify-center" },
        }));
        const __VLS_682 = __VLS_681({
            cols: "9",
            sm: "10",
            ...{ class: "pl-4 d-flex flex-column justify-center" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_681));
        __VLS_683.slots.default;
        __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
            ...{ class: "font-weight-bold white--text ma-0 text-h6" },
        });
        (reward.name);
        __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
            ...{ class: "text-body-2 grey--text ma-0" },
        });
        (reward.description);
        var __VLS_683;
        var __VLS_671;
        var __VLS_667;
    }
    var __VLS_663;
}
const __VLS_684 = {}.VCol;
/** @type {[typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ]} */ ;
// @ts-ignore
const __VLS_685 = __VLS_asFunctionalComponent(__VLS_684, new __VLS_684({
    cols: "12",
    ...{ class: "d-flex justify-space-between" },
}));
const __VLS_686 = __VLS_685({
    cols: "12",
    ...{ class: "d-flex justify-space-between" },
}, ...__VLS_functionalComponentArgsRest(__VLS_685));
__VLS_687.slots.default;
const __VLS_688 = {}.VBtn;
/** @type {[typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ]} */ ;
// @ts-ignore
const __VLS_689 = __VLS_asFunctionalComponent(__VLS_688, new __VLS_688({
    ...{ 'onClick': {} },
    color: "red",
}));
const __VLS_690 = __VLS_689({
    ...{ 'onClick': {} },
    color: "red",
}, ...__VLS_functionalComponentArgsRest(__VLS_689));
let __VLS_692;
let __VLS_693;
let __VLS_694;
const __VLS_695 = {
    onClick: (...[$event]) => {
        __VLS_ctx.editEventDialog = false;
    }
};
__VLS_691.slots.default;
var __VLS_691;
if (__VLS_ctx.isEditable) {
    const __VLS_696 = {}.VBtn;
    /** @type {[typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ]} */ ;
    // @ts-ignore
    const __VLS_697 = __VLS_asFunctionalComponent(__VLS_696, new __VLS_696({
        ...{ 'onClick': {} },
        color: "green",
        loading: (__VLS_ctx.loading),
        disabled: (__VLS_ctx.loading),
    }));
    const __VLS_698 = __VLS_697({
        ...{ 'onClick': {} },
        color: "green",
        loading: (__VLS_ctx.loading),
        disabled: (__VLS_ctx.loading),
    }, ...__VLS_functionalComponentArgsRest(__VLS_697));
    let __VLS_700;
    let __VLS_701;
    let __VLS_702;
    const __VLS_703 = {
        onClick: (__VLS_ctx.saveEditedEvent)
    };
    __VLS_699.slots.default;
    var __VLS_699;
}
var __VLS_687;
var __VLS_607;
var __VLS_603;
var __VLS_591;
var __VLS_587;
var __VLS_15;
var __VLS_11;
/** @type {[typeof ManageEventDialog, ]} */ ;
// @ts-ignore
const __VLS_704 = __VLS_asFunctionalComponent(ManageEventDialog, new ManageEventDialog({
    ...{ 'onRefresh': {} },
    ref: "manageDialogRef",
    modelValue: (__VLS_ctx.manageDialog),
    event: (__VLS_ctx.selectedEvent),
}));
const __VLS_705 = __VLS_704({
    ...{ 'onRefresh': {} },
    ref: "manageDialogRef",
    modelValue: (__VLS_ctx.manageDialog),
    event: (__VLS_ctx.selectedEvent),
}, ...__VLS_functionalComponentArgsRest(__VLS_704));
let __VLS_707;
let __VLS_708;
let __VLS_709;
const __VLS_710 = {
    onRefresh: (__VLS_ctx.handleRefresh)
};
/** @type {typeof __VLS_ctx.manageDialogRef} */ ;
var __VLS_711 = {};
var __VLS_706;
/** @type {[typeof TutorialPromptDialog, ]} */ ;
// @ts-ignore
const __VLS_713 = __VLS_asFunctionalComponent(TutorialPromptDialog, new TutorialPromptDialog({
    ...{ 'onTutorialCompleted': {} },
    modelValue: (__VLS_ctx.showTutorialPrompt),
}));
const __VLS_714 = __VLS_713({
    ...{ 'onTutorialCompleted': {} },
    modelValue: (__VLS_ctx.showTutorialPrompt),
}, ...__VLS_functionalComponentArgsRest(__VLS_713));
let __VLS_716;
let __VLS_717;
let __VLS_718;
const __VLS_719 = {
    onTutorialCompleted: (__VLS_ctx.handleTutorialCompleted)
};
var __VLS_715;
/** @type {__VLS_StyleScopedClasses['text-center']} */ ;
/** @type {__VLS_StyleScopedClasses['cinzel-text']} */ ;
/** @type {__VLS_StyleScopedClasses['font-weight-black']} */ ;
/** @type {__VLS_StyleScopedClasses['pt-15']} */ ;
/** @type {__VLS_StyleScopedClasses['pb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['text-center']} */ ;
/** @type {__VLS_StyleScopedClasses['text-h2']} */ ;
/** @type {__VLS_StyleScopedClasses['mx-auto']} */ ;
/** @type {__VLS_StyleScopedClasses['pb-12']} */ ;
/** @type {__VLS_StyleScopedClasses['page-loading-overlay']} */ ;
/** @type {__VLS_StyleScopedClasses['headline']} */ ;
/** @type {__VLS_StyleScopedClasses['headline']} */ ;
/** @type {__VLS_StyleScopedClasses['headline']} */ ;
/** @type {__VLS_StyleScopedClasses['EventsTabs']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-3']} */ ;
/** @type {__VLS_StyleScopedClasses['text-h5']} */ ;
/** @type {__VLS_StyleScopedClasses['text-h5']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['d-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['align-center']} */ ;
/** @type {__VLS_StyleScopedClasses['ml-2']} */ ;
/** @type {__VLS_StyleScopedClasses['mx-4']} */ ;
/** @type {__VLS_StyleScopedClasses['loading-overlay']} */ ;
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
/** @type {__VLS_StyleScopedClasses['text-center']} */ ;
/** @type {__VLS_StyleScopedClasses['loading-overlay']} */ ;
/** @type {__VLS_StyleScopedClasses['list-container']} */ ;
/** @type {__VLS_StyleScopedClasses['CreateNew']} */ ;
/** @type {__VLS_StyleScopedClasses['align-center']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-gray']} */ ;
/** @type {__VLS_StyleScopedClasses['text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['sort-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['text-center']} */ ;
/** @type {__VLS_StyleScopedClasses['py-2']} */ ;
/** @type {__VLS_StyleScopedClasses['pl-1']} */ ;
/** @type {__VLS_StyleScopedClasses['pr-1']} */ ;
/** @type {__VLS_StyleScopedClasses['pt-0']} */ ;
/** @type {__VLS_StyleScopedClasses['pl-0']} */ ;
/** @type {__VLS_StyleScopedClasses['pb-0']} */ ;
/** @type {__VLS_StyleScopedClasses['event-card']} */ ;
/** @type {__VLS_StyleScopedClasses['redbutton']} */ ;
/** @type {__VLS_StyleScopedClasses['pt-13']} */ ;
/** @type {__VLS_StyleScopedClasses['pl-3']} */ ;
/** @type {__VLS_StyleScopedClasses['delete-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['pt-6']} */ ;
/** @type {__VLS_StyleScopedClasses['pr-3']} */ ;
/** @type {__VLS_StyleScopedClasses['text-center']} */ ;
/** @type {__VLS_StyleScopedClasses['ml-2']} */ ;
/** @type {__VLS_StyleScopedClasses['pr-3']} */ ;
/** @type {__VLS_StyleScopedClasses['pt-3']} */ ;
/** @type {__VLS_StyleScopedClasses['text-caption']} */ ;
/** @type {__VLS_StyleScopedClasses['font-weight-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['cinzel-text']} */ ;
/** @type {__VLS_StyleScopedClasses['text-h3']} */ ;
/** @type {__VLS_StyleScopedClasses['font-weight-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-caption']} */ ;
/** @type {__VLS_StyleScopedClasses['font-weight-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['pt-2']} */ ;
/** @type {__VLS_StyleScopedClasses['pl-5']} */ ;
/** @type {__VLS_StyleScopedClasses['pb-1']} */ ;
/** @type {__VLS_StyleScopedClasses['text-truncate']} */ ;
/** @type {__VLS_StyleScopedClasses['pr-1']} */ ;
/** @type {__VLS_StyleScopedClasses['text-caption']} */ ;
/** @type {__VLS_StyleScopedClasses['text-truncate']} */ ;
/** @type {__VLS_StyleScopedClasses['text-caption']} */ ;
/** @type {__VLS_StyleScopedClasses['editbutton']} */ ;
/** @type {__VLS_StyleScopedClasses['pt-13']} */ ;
/** @type {__VLS_StyleScopedClasses['pl-3']} */ ;
/** @type {__VLS_StyleScopedClasses['delete-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['d-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-left']} */ ;
/** @type {__VLS_StyleScopedClasses['text-end']} */ ;
/** @type {__VLS_StyleScopedClasses['scheduled-box']} */ ;
/** @type {__VLS_StyleScopedClasses['mr-4']} */ ;
/** @type {__VLS_StyleScopedClasses['event-card']} */ ;
/** @type {__VLS_StyleScopedClasses['event-img']} */ ;
/** @type {__VLS_StyleScopedClasses['pa-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-subtitle-1']} */ ;
/** @type {__VLS_StyleScopedClasses['font-weight-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-caption']} */ ;
/** @type {__VLS_StyleScopedClasses['text-right']} */ ;
/** @type {__VLS_StyleScopedClasses['pa-0']} */ ;
/** @type {__VLS_StyleScopedClasses['mr-4']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-4']} */ ;
/** @type {__VLS_StyleScopedClasses['event-card']} */ ;
/** @type {__VLS_StyleScopedClasses['text-h6']} */ ;
/** @type {__VLS_StyleScopedClasses['font-weight-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['align-center']} */ ;
/** @type {__VLS_StyleScopedClasses['my-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-subtitle-1']} */ ;
/** @type {__VLS_StyleScopedClasses['font-weight-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-caption']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-2']} */ ;
/** @type {__VLS_StyleScopedClasses['ml-0']} */ ;
/** @type {__VLS_StyleScopedClasses['create-event-shell']} */ ;
/** @type {__VLS_StyleScopedClasses['dark-background']} */ ;
/** @type {__VLS_StyleScopedClasses['loading-overlay']} */ ;
/** @type {__VLS_StyleScopedClasses['create-event-header']} */ ;
/** @type {__VLS_StyleScopedClasses['text-h5']} */ ;
/** @type {__VLS_StyleScopedClasses['font-weight-black']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-0']} */ ;
/** @type {__VLS_StyleScopedClasses['close-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['create-event-body']} */ ;
/** @type {__VLS_StyleScopedClasses['select-short-value']} */ ;
/** @type {__VLS_StyleScopedClasses['time-input']} */ ;
/** @type {__VLS_StyleScopedClasses['time-input']} */ ;
/** @type {__VLS_StyleScopedClasses['d-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['align-center']} */ ;
/** @type {__VLS_StyleScopedClasses['date-input']} */ ;
/** @type {__VLS_StyleScopedClasses['text-subtitle-1']} */ ;
/** @type {__VLS_StyleScopedClasses['font-weight-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-2']} */ ;
/** @type {__VLS_StyleScopedClasses['py-2']} */ ;
/** @type {__VLS_StyleScopedClasses['px-2']} */ ;
/** @type {__VLS_StyleScopedClasses['d-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['align-center']} */ ;
/** @type {__VLS_StyleScopedClasses['position-relative']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-2']} */ ;
/** @type {__VLS_StyleScopedClasses['align-center']} */ ;
/** @type {__VLS_StyleScopedClasses['d-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['align-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['pl-2']} */ ;
/** @type {__VLS_StyleScopedClasses['pl-4']} */ ;
/** @type {__VLS_StyleScopedClasses['d-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-column']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['font-weight-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['white--text']} */ ;
/** @type {__VLS_StyleScopedClasses['ma-0']} */ ;
/** @type {__VLS_StyleScopedClasses['text-h6']} */ ;
/** @type {__VLS_StyleScopedClasses['text-body-2']} */ ;
/** @type {__VLS_StyleScopedClasses['grey--text']} */ ;
/** @type {__VLS_StyleScopedClasses['ma-0']} */ ;
/** @type {__VLS_StyleScopedClasses['create-event-actions']} */ ;
/** @type {__VLS_StyleScopedClasses['launch-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['dark-background']} */ ;
/** @type {__VLS_StyleScopedClasses['loading-overlay']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['d-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['align-center']} */ ;
/** @type {__VLS_StyleScopedClasses['date-input']} */ ;
/** @type {__VLS_StyleScopedClasses['pb-2']} */ ;
/** @type {__VLS_StyleScopedClasses['font-weight-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['cinzel-text']} */ ;
/** @type {__VLS_StyleScopedClasses['py-2']} */ ;
/** @type {__VLS_StyleScopedClasses['px-2']} */ ;
/** @type {__VLS_StyleScopedClasses['d-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['align-center']} */ ;
/** @type {__VLS_StyleScopedClasses['position-relative']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-2']} */ ;
/** @type {__VLS_StyleScopedClasses['align-center']} */ ;
/** @type {__VLS_StyleScopedClasses['d-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['align-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['pl-2']} */ ;
/** @type {__VLS_StyleScopedClasses['pl-4']} */ ;
/** @type {__VLS_StyleScopedClasses['d-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-column']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['font-weight-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['white--text']} */ ;
/** @type {__VLS_StyleScopedClasses['ma-0']} */ ;
/** @type {__VLS_StyleScopedClasses['text-h6']} */ ;
/** @type {__VLS_StyleScopedClasses['text-body-2']} */ ;
/** @type {__VLS_StyleScopedClasses['grey--text']} */ ;
/** @type {__VLS_StyleScopedClasses['ma-0']} */ ;
/** @type {__VLS_StyleScopedClasses['d-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-space-between']} */ ;
// @ts-ignore
var __VLS_712 = __VLS_711;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            TutorialPromptDialog: TutorialPromptDialog,
            ManageEventDialog: ManageEventDialog,
            extractMonth: extractMonth,
            extractDay: extractDay,
            extractTime: extractTime,
            formatEventDate: formatEventDate,
            showTutorialPrompt: showTutorialPrompt,
            isEditable: isEditable,
            selectedRewards: selectedRewards,
            dialog: dialog,
            manageDialog: manageDialog,
            selectedEvent: selectedEvent,
            activeTab: activeTab,
            events: events,
            userCreatedEvents: userCreatedEvents,
            createEventDialog: createEventDialog,
            newEvent: newEvent,
            editEventDialog: editEventDialog,
            editableEvent: editableEvent,
            showSuccessAlert: showSuccessAlert,
            eventRewards: eventRewards,
            showPast: showPast,
            loading: loading,
            errorDialog: errorDialog,
            successDialog: successDialog,
            turnAwayConfirmDialog: turnAwayConfirmDialog,
            manageDialogRef: manageDialogRef,
            openingManageDialog: openingManageDialog,
            getSeasonInfo: getSeasonInfo,
            userTimezone: userTimezone,
            retailerSeasonOptions: retailerSeasonOptions,
            availableStores: availableStores,
            hourOptions: hourOptions,
            minuteOptions: minuteOptions,
            executeTurnAway: executeTurnAway,
            sortedEvents: sortedEvents,
            filteredScenarios: filteredScenarios,
            editableScenarios: editableScenarios,
            editableRewardsItems: editableRewardsItems,
            createEventReady: createEventReady,
            openInGoogleMaps: openInGoogleMaps,
            validateTime: validateTime,
            openManageDialog: openManageDialog,
            handleRefresh: handleRefresh,
            dateRules: dateRules,
            today: today,
            oneYearFromTodayISO: oneYearFromTodayISO,
            openDialog: openDialog,
            addEvent: addEvent,
            handleEventCreatedOk: handleEventCreatedOk,
            deleteEvent: deleteEvent,
            openCreateEventDialog: openCreateEventDialog,
            openEditDialog: openEditDialog,
            saveEditedEvent: saveEditedEvent,
            handleTutorialCompleted: handleTutorialCompleted,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
