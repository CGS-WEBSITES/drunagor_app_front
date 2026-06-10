/// <reference types="../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import { CampaignStore } from "@/store/CampaignStore";
import { useUserStore } from "@/store/UserStore";
import { ref, computed, onMounted, onBeforeUnmount } from "vue";
import axios from "axios";
const props = defineProps();
const emit = defineEmits();
const userStore = useUserStore();
const campaignStore = CampaignStore();
const isAdmin = ref(false);
const loading = ref(true);
const savingDoor = ref(false);
const saveError = ref("");
const saveSuccess = ref("");
const newDoorDetected = ref("");
const allDoors = ref([]);
const openedDoors = ref([]);
// Polling
const POLLING_INTERVAL = 5000; // 5 seconds
let pollingTimer = null;
const isPollingActive = ref(true);
// Door options from database
const doorOptions = computed(() => {
    const camp = campaignStore.findOptional(props.campaignId);
    const wingStr = (camp?.wing || "").toUpperCase();
    let filtered = allDoors.value;
    if (wingStr.includes("TUTORIAL") || wingStr.includes("WING 1 TUTORIAL")) {
        filtered = allDoors.value.filter(d => [1, 13, 14, 15, 16].includes(d.doors_pk));
    }
    else if (wingStr.includes("WING 1 ADVANCED")) {
        filtered = allDoors.value.filter(d => [1, 17, 18, 19, 20].includes(d.doors_pk));
    }
    else if (wingStr.includes("WING 2 ADVANCED") || wingStr.includes("WING 2")) {
        filtered = allDoors.value.filter(d => [1, 21, 22, 23, 24, 25].includes(d.doors_pk));
    }
    else if (wingStr.includes("WING 3")) {
        const wing3Names = [
            "FIRST SETUP",
            "DUNGEON FOYER",
            "QUEEN'S HALL",
            "THE FORGE",
            "ARTISAN'S GALLERY",
            "PROVING GROUNDS",
            "MAIN HALL"
        ];
        filtered = allDoors.value.filter(d => wing3Names.includes(d.name.toUpperCase()) || d.doors_pk === 1);
    }
    else if (wingStr.includes("WING 4")) {
        const wing4Names = [
            "FIRST SETUP",
            "DRACONIC CHAPEL",
            "CRYPTS",
            "BOTH OPEN",
            "LIBRARY",
            "LABORATORY",
            "DRAGON BOSS"
        ];
        filtered = allDoors.value.filter(d => wing4Names.includes(d.name.toUpperCase()) || d.doors_pk === 1);
    }
    return filtered.map((d) => ({
        name: d.name,
        code: d.code,
        doors_pk: d.doors_pk,
    }));
});
const door = computed({
    get() {
        return campaignStore.find(props.campaignId)?.door ?? "";
    },
    set(newValue) {
        if (isAdmin.value) {
            campaignStore.updateCampaignProperty(props.campaignId, "door", newValue);
        }
    },
});
const findDoorByName = (name) => {
    return allDoors.value.find((d) => d.name === name);
};
const isDoorOpened = (doorName) => {
    return openedDoors.value.find((od) => od.door_name === doorName);
};
const fetchAllDoors = async () => {
    try {
        const response = await axios.get("/doors/search");
        allDoors.value = response.data.doors || [];
    }
    catch (error) {
        console.error("Error fetching doors:", error);
    }
};
const fetchOpenedDoors = async () => {
    try {
        const response = await axios.get("/rl_campaigns_doors/search", {
            params: { campaign_fk: props.campaignId },
        });
        return response.data.campaign_doors || [];
    }
    catch (error) {
        console.error("Error fetching opened doors:", error);
        return [];
    }
};
const checkForNewDoors = async () => {
    if (!isPollingActive.value)
        return;
    try {
        const currentDoors = await fetchOpenedDoors();
        const currentIds = new Set(openedDoors.value.map((d) => d.rl_campaigns_doors_pk));
        const newDoors = currentDoors.filter((d) => !currentIds.has(d.rl_campaigns_doors_pk));
        if (newDoors.length > 0) {
            openedDoors.value = currentDoors;
            newDoors.forEach((newDoor) => {
                newDoorDetected.value = `New door opened: ${newDoor.door_name}`;
                emit("door-opened", newDoor);
                setTimeout(() => {
                    if (newDoorDetected.value === `New door opened: ${newDoor.door_name}`) {
                        newDoorDetected.value = "";
                    }
                }, 5000);
            });
            emit("doors-updated", currentDoors);
        }
    }
    catch (error) {
        console.error("Error checking for new doors:", error);
    }
};
const startPolling = () => {
    if (pollingTimer) {
        clearInterval(pollingTimer);
    }
    pollingTimer = setInterval(checkForNewDoors, POLLING_INTERVAL);
    console.log(`[SelectDoor] Polling started (${POLLING_INTERVAL}ms interval)`);
};
const stopPolling = () => {
    if (pollingTimer) {
        clearInterval(pollingTimer);
        pollingTimer = null;
        console.log("[SelectDoor] Polling stopped");
    }
};
const handleVisibilityChange = () => {
    if (document.hidden) {
        isPollingActive.value = false;
        stopPolling();
        console.log("[SelectDoor] Tab hidden - polling paused");
    }
    else {
        isPollingActive.value = true;
        checkForNewDoors();
        startPolling();
        console.log("[SelectDoor] Tab visible - polling resumed");
    }
};
const saveDoorOpening = async (doorName) => {
    const doorObj = findDoorByName(doorName);
    if (!doorObj) {
        saveError.value = `Door not found in database: ${doorName}`;
        return false;
    }
    if (isDoorOpened(doorName)) {
        return true;
    }
    savingDoor.value = true;
    saveError.value = "";
    saveSuccess.value = "";
    try {
        const response = await axios.post("/rl_campaigns_doors/cadastro", {
            doors_fk: doorObj.doors_pk,
            campaign_fk: parseInt(props.campaignId),
        });
        if (response.status === 201) {
            saveSuccess.value = "Door opened successfully!";
            const newOpenedDoor = {
                rl_campaigns_doors_pk: response.data.rl_campaign_door.rl_campaigns_doors_pk,
                doors_fk: doorObj.doors_pk,
                campaign_fk: parseInt(props.campaignId),
                date: response.data.rl_campaign_door.date,
                door_name: doorObj.name,
                door_code: doorObj.code,
            };
            openedDoors.value.push(newOpenedDoor);
            emit("door-opened", newOpenedDoor);
            setTimeout(() => {
                saveSuccess.value = "";
            }, 3000);
            return true;
        }
        return false;
    }
    catch (error) {
        if (error.response?.status === 409) {
            openedDoors.value = await fetchOpenedDoors();
            return true;
        }
        saveError.value =
            error.response?.data?.message || "Failed to save door opening";
        console.error("Error saving door opening:", error);
        return false;
    }
    finally {
        savingDoor.value = false;
    }
};
const onDoorChange = async (newDoor) => {
    if (!newDoor) {
        door.value = "";
        return;
    }
    door.value = newDoor;
    await saveDoorOpening(newDoor);
};
const checkUserRole = async () => {
    isAdmin.value = true;
};
const initialize = async () => {
    loading.value = true;
    try {
        await Promise.all([checkUserRole(), fetchAllDoors()]);
        openedDoors.value = await fetchOpenedDoors();
        startPolling();
        document.addEventListener("visibilitychange", handleVisibilityChange);
    }
    catch (error) {
        console.error("Error initializing SelectDoor:", error);
    }
    finally {
        loading.value = false;
    }
};
onBeforeUnmount(() => {
    stopPolling();
    document.removeEventListener("visibilitychange", handleVisibilityChange);
});
onMounted(initialize);
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['new-door-alert']} */ ;
/** @type {__VLS_StyleScopedClasses['new-door-alert']} */ ;
/** @type {__VLS_StyleScopedClasses['error-door-alert']} */ ;
/** @type {__VLS_StyleScopedClasses['v-alert__icon']} */ ;
/** @type {__VLS_StyleScopedClasses['error-door-alert']} */ ;
/** @type {__VLS_StyleScopedClasses['v-btn--icon']} */ ;
/** @type {__VLS_StyleScopedClasses['success-door-alert']} */ ;
/** @type {__VLS_StyleScopedClasses['v-alert__icon']} */ ;
/** @type {__VLS_StyleScopedClasses['success-door-alert']} */ ;
/** @type {__VLS_StyleScopedClasses['v-btn--icon']} */ ;
// CSS variable injection 
// CSS variable injection end 
if (__VLS_ctx.isAdmin && !__VLS_ctx.loading) {
    const __VLS_0 = {}.VSelect;
    /** @type {[typeof __VLS_components.VSelect, typeof __VLS_components.vSelect, ]} */ ;
    // @ts-ignore
    const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
        ...{ 'onUpdate:modelValue': {} },
        modelValue: (__VLS_ctx.door),
        label: "Select Door",
        items: (__VLS_ctx.doorOptions),
        itemTitle: "name",
        itemValue: "name",
        variant: "solo-filled",
        loading: (__VLS_ctx.savingDoor),
        clearable: true,
    }));
    const __VLS_2 = __VLS_1({
        ...{ 'onUpdate:modelValue': {} },
        modelValue: (__VLS_ctx.door),
        label: "Select Door",
        items: (__VLS_ctx.doorOptions),
        itemTitle: "name",
        itemValue: "name",
        variant: "solo-filled",
        loading: (__VLS_ctx.savingDoor),
        clearable: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_1));
    let __VLS_4;
    let __VLS_5;
    let __VLS_6;
    const __VLS_7 = {
        'onUpdate:modelValue': (__VLS_ctx.onDoorChange)
    };
    var __VLS_3;
    if (__VLS_ctx.saveError) {
        const __VLS_8 = {}.VAlert;
        /** @type {[typeof __VLS_components.VAlert, typeof __VLS_components.vAlert, typeof __VLS_components.VAlert, typeof __VLS_components.vAlert, ]} */ ;
        // @ts-ignore
        const __VLS_9 = __VLS_asFunctionalComponent(__VLS_8, new __VLS_8({
            ...{ 'onClick:close': {} },
            icon: "mdi-alert-circle",
            closable: true,
            ...{ class: "error-door-alert mt-2" },
        }));
        const __VLS_10 = __VLS_9({
            ...{ 'onClick:close': {} },
            icon: "mdi-alert-circle",
            closable: true,
            ...{ class: "error-door-alert mt-2" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_9));
        let __VLS_12;
        let __VLS_13;
        let __VLS_14;
        const __VLS_15 = {
            'onClick:close': (...[$event]) => {
                if (!(__VLS_ctx.isAdmin && !__VLS_ctx.loading))
                    return;
                if (!(__VLS_ctx.saveError))
                    return;
                __VLS_ctx.saveError = '';
            }
        };
        __VLS_11.slots.default;
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ class: "door-alert-text" },
        });
        (__VLS_ctx.saveError);
        var __VLS_11;
    }
    if (__VLS_ctx.saveSuccess) {
        const __VLS_16 = {}.VAlert;
        /** @type {[typeof __VLS_components.VAlert, typeof __VLS_components.vAlert, typeof __VLS_components.VAlert, typeof __VLS_components.vAlert, ]} */ ;
        // @ts-ignore
        const __VLS_17 = __VLS_asFunctionalComponent(__VLS_16, new __VLS_16({
            ...{ 'onClick:close': {} },
            icon: "mdi-check-circle",
            closable: true,
            ...{ class: "success-door-alert mt-2" },
        }));
        const __VLS_18 = __VLS_17({
            ...{ 'onClick:close': {} },
            icon: "mdi-check-circle",
            closable: true,
            ...{ class: "success-door-alert mt-2" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_17));
        let __VLS_20;
        let __VLS_21;
        let __VLS_22;
        const __VLS_23 = {
            'onClick:close': (...[$event]) => {
                if (!(__VLS_ctx.isAdmin && !__VLS_ctx.loading))
                    return;
                if (!(__VLS_ctx.saveSuccess))
                    return;
                __VLS_ctx.saveSuccess = '';
            }
        };
        __VLS_19.slots.default;
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ class: "door-alert-text" },
        });
        (__VLS_ctx.saveSuccess);
        var __VLS_19;
    }
    if (__VLS_ctx.newDoorDetected) {
        const __VLS_24 = {}.VAlert;
        /** @type {[typeof __VLS_components.VAlert, typeof __VLS_components.vAlert, typeof __VLS_components.VAlert, typeof __VLS_components.vAlert, ]} */ ;
        // @ts-ignore
        const __VLS_25 = __VLS_asFunctionalComponent(__VLS_24, new __VLS_24({
            ...{ 'onClick:close': {} },
            icon: "mdi-door-open",
            closable: true,
            ...{ class: "new-door-alert mt-2" },
        }));
        const __VLS_26 = __VLS_25({
            ...{ 'onClick:close': {} },
            icon: "mdi-door-open",
            closable: true,
            ...{ class: "new-door-alert mt-2" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_25));
        let __VLS_28;
        let __VLS_29;
        let __VLS_30;
        const __VLS_31 = {
            'onClick:close': (...[$event]) => {
                if (!(__VLS_ctx.isAdmin && !__VLS_ctx.loading))
                    return;
                if (!(__VLS_ctx.newDoorDetected))
                    return;
                __VLS_ctx.newDoorDetected = '';
            }
        };
        __VLS_27.slots.default;
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ class: "door-alert-text font-weight-bold" },
        });
        (__VLS_ctx.newDoorDetected);
        var __VLS_27;
    }
}
else if (!__VLS_ctx.loading) {
    const __VLS_32 = {}.VTextField;
    /** @type {[typeof __VLS_components.VTextField, typeof __VLS_components.vTextField, ]} */ ;
    // @ts-ignore
    const __VLS_33 = __VLS_asFunctionalComponent(__VLS_32, new __VLS_32({
        modelValue: (__VLS_ctx.door),
        label: "Door",
        variant: "solo-filled",
        readonly: true,
        persistentHint: true,
        disabled: true,
    }));
    const __VLS_34 = __VLS_33({
        modelValue: (__VLS_ctx.door),
        label: "Door",
        variant: "solo-filled",
        readonly: true,
        persistentHint: true,
        disabled: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_33));
    if (__VLS_ctx.newDoorDetected) {
        const __VLS_36 = {}.VAlert;
        /** @type {[typeof __VLS_components.VAlert, typeof __VLS_components.vAlert, typeof __VLS_components.VAlert, typeof __VLS_components.vAlert, ]} */ ;
        // @ts-ignore
        const __VLS_37 = __VLS_asFunctionalComponent(__VLS_36, new __VLS_36({
            ...{ 'onClick:close': {} },
            icon: "mdi-door-open",
            closable: true,
            ...{ class: "new-door-alert mt-2" },
        }));
        const __VLS_38 = __VLS_37({
            ...{ 'onClick:close': {} },
            icon: "mdi-door-open",
            closable: true,
            ...{ class: "new-door-alert mt-2" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_37));
        let __VLS_40;
        let __VLS_41;
        let __VLS_42;
        const __VLS_43 = {
            'onClick:close': (...[$event]) => {
                if (!!(__VLS_ctx.isAdmin && !__VLS_ctx.loading))
                    return;
                if (!(!__VLS_ctx.loading))
                    return;
                if (!(__VLS_ctx.newDoorDetected))
                    return;
                __VLS_ctx.newDoorDetected = '';
            }
        };
        __VLS_39.slots.default;
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ class: "door-alert-text font-weight-bold" },
        });
        (__VLS_ctx.newDoorDetected);
        var __VLS_39;
    }
}
else {
    const __VLS_44 = {}.VTextField;
    /** @type {[typeof __VLS_components.VTextField, typeof __VLS_components.vTextField, ]} */ ;
    // @ts-ignore
    const __VLS_45 = __VLS_asFunctionalComponent(__VLS_44, new __VLS_44({
        label: "Door",
        variant: "solo-filled",
        loading: true,
        readonly: true,
        disabled: true,
    }));
    const __VLS_46 = __VLS_45({
        label: "Door",
        variant: "solo-filled",
        loading: true,
        readonly: true,
        disabled: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_45));
    var __VLS_48 = {};
    var __VLS_47;
}
/** @type {__VLS_StyleScopedClasses['error-door-alert']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-2']} */ ;
/** @type {__VLS_StyleScopedClasses['door-alert-text']} */ ;
/** @type {__VLS_StyleScopedClasses['success-door-alert']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-2']} */ ;
/** @type {__VLS_StyleScopedClasses['door-alert-text']} */ ;
/** @type {__VLS_StyleScopedClasses['new-door-alert']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-2']} */ ;
/** @type {__VLS_StyleScopedClasses['door-alert-text']} */ ;
/** @type {__VLS_StyleScopedClasses['font-weight-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['new-door-alert']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-2']} */ ;
/** @type {__VLS_StyleScopedClasses['door-alert-text']} */ ;
/** @type {__VLS_StyleScopedClasses['font-weight-bold']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            isAdmin: isAdmin,
            loading: loading,
            savingDoor: savingDoor,
            saveError: saveError,
            saveSuccess: saveSuccess,
            newDoorDetected: newDoorDetected,
            doorOptions: doorOptions,
            door: door,
            onDoorChange: onDoorChange,
        };
    },
    __typeEmits: {},
    __typeProps: {},
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
    __typeEmits: {},
    __typeProps: {},
});
; /* PartiallyEnd: #4569/main.vue */
