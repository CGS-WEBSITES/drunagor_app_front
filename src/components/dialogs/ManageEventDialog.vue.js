/// <reference types="../../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import { ref, computed, watch, inject, nextTick } from "vue";
import { useDisplay } from "vuetify";
import { jsPDF } from "jspdf";
import QrcodeVue from "qrcode-vue3";
import QRCode from "qrcode";
import InitialSetupViewer from "@/components/InitialSetupViewer.vue";
import s1flag from "@/assets/s1flag.png";
import s2flag from "@/assets/s2flag.png";
import { useUserStore } from "@/store/UserStore";
import { formatEventDate } from "@/utils/dateHelpers";
import TutorialPromptDialog from "@/components/dialogs/TutorialPromptDialog.vue";
const { smAndDown } = useDisplay();
const userStore = useUserStore();
const props = defineProps({
    modelValue: { type: Boolean, required: true },
    event: { type: Object, default: null },
});
const emit = defineEmits(["update:modelValue", "refresh"]);
const axios = inject("axios");
const activeTab = ref("details");
const dialogLoading = ref(false);
const tables = ref([]);
const loadingTables = ref(false);
const playersByEvent = ref([]);
const currentPage = ref(1);
const totalPages = ref(1);
const eventRewards = ref([]);
const statuses = ref([]);
const grantedStatus = ref(null);
const turnedAwayStatus = ref(null);
const JoinedtheQuest = ref(null);
const createTableDialog = ref(false);
const createMultipleTablesDialog = ref(false);
const creatingTable = ref(false);
const newTable = ref({ table_number: null, max_players: 4 });
const multipleTables = ref({ quantity: 4, max_players: 4 });
const qrCodeDialog = ref(false);
const generatingQR = ref(false);
const selectedTable = ref(null);
const qrCodeData = ref(null);
const showPlayers = ref(false);
const tablePlayers = ref([]);
const loadingTablePlayers = ref(false);
const startInTables = ref(false);
const setupDialog = ref(false);
const showTutorialPrompt = ref(false);
const zoomLevel = ref(1);
const panX = ref(0);
const panY = ref(0);
const isPanning = ref(false);
const isZooming = ref(false);
const lastPanX = ref(0);
const lastPanY = ref(0);
const startX = ref(0);
const startY = ref(0);
const imageContainer = ref(null);
let initialDistance = 0;
let initialZoom = 1;
const qrTutorial = ref({
    active: false,
    step: 1,
});
const qrCanvasWrap = ref(null);
const qrPngDataUrl = ref("");
const qrCanvasSize = computed(() => (smAndDown.value ? 240 : 300));
const downloadingPdf = ref(false);
const userTimezone = computed(() => userStore.userIanaTimezone());
const qrTutorialCopy = computed(() => {
    if (!qrTutorial.value.active)
        return null;
    return {
        title: "Generate a QR Code",
        message: "Generate a QR code by clicking the Generate QR Code button below and share it with your players. They will scan it to enter the table.",
    };
});
const tablesAlertCopy = computed(() => {
    if (qrTutorial.value.active && qrTutorialCopy.value)
        return qrTutorialCopy.value;
    return {
        title: "QR Code Setup",
        message: "Generate a QR code for each table and share it with your players. They will scan it to join the table.",
    };
});
const getSeasonInfo = (fk) => {
    if (fk == 2)
        return { flag: s1flag, name: "Season 1" };
    if (fk == 3)
        return { flag: s2flag, name: "Season 2" };
    return { flag: null, name: "" };
};
const openInGoogleMaps = () => {
    if (!props.event?.store_name ||
        props.event.latitude == null ||
        props.event.longitude == null)
        return;
    const encodedName = props.event.store_name.split(" ").join("+");
    const lat = props.event.latitude;
    const lng = props.event.longitude;
    const query = `${encodedName}%20${lat},${lng}`;
    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${query}`;
    window.open(mapsUrl, "_blank");
};
const closeDialog = () => emit("update:modelValue", false);
const openSetupDialog = () => {
    setupDialog.value = true;
    resetZoom();
};
const zoomIn = () => {
    if (zoomLevel.value < 3) {
        zoomLevel.value = Math.min(3, zoomLevel.value + 0.25);
    }
};
const zoomOut = () => {
    if (zoomLevel.value > 1) {
        zoomLevel.value = Math.max(1, zoomLevel.value - 0.25);
        if (zoomLevel.value === 1) {
            panX.value = 0;
            panY.value = 0;
        }
    }
};
const resetZoom = () => {
    zoomLevel.value = 1;
    panX.value = 0;
    panY.value = 0;
};
const handleWheel = (event) => {
    isZooming.value = true;
    const delta = event.deltaY > 0 ? -0.1 : 0.1;
    zoomLevel.value = Math.max(1, Math.min(3, zoomLevel.value + delta));
    if (zoomLevel.value === 1) {
        panX.value = 0;
        panY.value = 0;
    }
    setTimeout(() => {
        isZooming.value = false;
    }, 100);
};
const startPan = (event) => {
    if (zoomLevel.value > 1) {
        isPanning.value = true;
        startX.value = event.clientX - panX.value;
        startY.value = event.clientY - panY.value;
    }
};
const handlePan = (event) => {
    if (isPanning.value && zoomLevel.value > 1) {
        panX.value = event.clientX - startX.value;
        panY.value = event.clientY - startY.value;
    }
};
const endPan = () => {
    isPanning.value = false;
};
const getDistance = (touch1, touch2) => {
    const dx = touch1.clientX - touch2.clientX;
    const dy = touch1.clientY - touch2.clientY;
    return Math.sqrt(dx * dx + dy * dy);
};
const handleTouchStart = (event) => {
    if (event.touches.length === 2) {
        initialDistance = getDistance(event.touches[0], event.touches[1]);
        initialZoom = zoomLevel.value;
        isZooming.value = true;
    }
    else if (event.touches.length === 1 && zoomLevel.value > 1) {
        isPanning.value = true;
        const touch = event.touches[0];
        startX.value = touch.clientX - panX.value;
        startY.value = touch.clientY - panY.value;
    }
};
const handleTouchMove = (event) => {
    event.preventDefault();
    if (event.touches.length === 2 && initialDistance > 0) {
        const currentDistance = getDistance(event.touches[0], event.touches[1]);
        const scale = currentDistance / initialDistance;
        zoomLevel.value = Math.max(1, Math.min(3, initialZoom * scale));
        if (zoomLevel.value === 1) {
            panX.value = 0;
            panY.value = 0;
        }
    }
    else if (event.touches.length === 1 &&
        isPanning.value &&
        zoomLevel.value > 1) {
        const touch = event.touches[0];
        panX.value = touch.clientX - startX.value;
        panY.value = touch.clientY - startY.value;
    }
};
const handleTouchEnd = (event) => {
    if (event.touches.length < 2) {
        initialDistance = 0;
        isZooming.value = false;
    }
    if (event.touches.length === 0) {
        isPanning.value = false;
    }
};
const fetchTablesForEvent = async (eventFk) => {
    loadingTables.value = true;
    try {
        const { data } = await axios.get(`/event_tables/list/${eventFk}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
        });
        tables.value = data.tables || [];
    }
    catch (error) {
        console.error("Error fetching tables:", error);
        tables.value = [];
    }
    finally {
        loadingTables.value = false;
    }
};
const fetchPlayersForEvent = async (eventFk) => {
    dialogLoading.value = true;
    try {
        const params = {
            events_fk: eventFk,
            limit: 5,
            offset: (currentPage.value - 1) * 5,
        };
        const { data } = await axios.get("/rl_events_users/list_players", {
            params,
            headers: {
                Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
        });
        playersByEvent.value = data.players || [];
        totalPages.value = data.last_page || 1;
    }
    catch (error) {
        console.error("Error fetching players:", error);
        playersByEvent.value = [];
    }
    finally {
        dialogLoading.value = false;
    }
};
const fetchStatuses = async () => {
    try {
        const { data } = await axios.get("/event_status/search");
        statuses.value = data.event_status;
        grantedStatus.value = statuses.value.find((s) => s.name === "Granted Passage")?.event_status_pk;
        turnedAwayStatus.value = statuses.value.find((s) => s.name === "Turned Away")?.event_status_pk;
        JoinedtheQuest.value = statuses.value.find((s) => s.name === "Joined the Quest")?.event_status_pk;
    }
    catch (error) {
        console.error("Error fetching statuses:", error);
    }
};
const fetchEventRewards = async (eventFk) => {
    try {
        const { data } = await axios.get("/rl_events_rewards/list_rewards", {
            params: { events_fk: eventFk },
            headers: {
                Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
        });
        eventRewards.value = data.rewards || [];
    }
    catch (error) {
        console.error("Error fetching event rewards:", error);
        eventRewards.value = [];
    }
};
const refreshPlayers = () => {
    if (props.event?.events_pk)
        fetchPlayersForEvent(props.event.events_pk);
};
const updatePlayerStatus = async (player, statusPk) => {
    dialogLoading.value = true;
    const payload = {
        users_fk: player.users_pk,
        events_fk: props.event.events_pk,
        status: statusPk,
        active: true,
    };
    try {
        await axios.post("/rl_events_users/cadastro", payload, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
        });
        await fetchPlayersForEvent(props.event.events_pk);
        if (statusPk === JoinedtheQuest.value && eventRewards.value.length > 0) {
            await Promise.all(eventRewards.value.map((reward) => axios.post("/rl_users_rewards/cadastro", { users_fk: player.users_pk, rewards_fk: reward.rewards_pk }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                },
            })));
        }
    }
    catch (error) {
        console.error("Error updating player status:", error);
        alert("Failed to update player status");
    }
    finally {
        dialogLoading.value = false;
    }
};
const openCreateTableDialog = () => {
    newTable.value = { table_number: null, max_players: 4 };
    createTableDialog.value = true;
};
const openCreateMultipleTablesDialog = () => {
    multipleTables.value = { quantity: 4, max_players: 4 };
    createMultipleTablesDialog.value = true;
};
const createTable = async () => {
    creatingTable.value = true;
    try {
        const payload = {
            events_fk: props.event.events_pk,
            max_players: newTable.value.max_players || 4,
            active: true,
        };
        if (newTable.value.table_number)
            payload.table_number = newTable.value.table_number;
        await axios.post("/event_tables/create", payload, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
        });
        await fetchTablesForEvent(props.event.events_pk);
        createTableDialog.value = false;
        emit("refresh");
    }
    catch (error) {
        console.error("Error creating table:", error);
        alert(error.response?.data?.message || "Failed to create table");
    }
    finally {
        creatingTable.value = false;
    }
};
const createMultipleTables = async () => {
    creatingTable.value = true;
    try {
        const payload = {
            events_fk: props.event.events_pk,
            quantity: multipleTables.value.quantity,
            max_players: multipleTables.value.max_players || 4,
        };
        await axios.post("/event_tables/create_multiple", payload, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
        });
        await fetchTablesForEvent(props.event.events_pk);
        createMultipleTablesDialog.value = false;
        emit("refresh");
    }
    catch (error) {
        console.error("Error creating multiple tables:", error);
        alert(error.response?.data?.message || "Failed to create tables");
    }
    finally {
        creatingTable.value = false;
    }
};
const deleteTable = async (eventTablesPk) => {
    if (!confirm("Are you sure you want to delete this table?"))
        return;
    try {
        await axios.delete(`/event_tables/${eventTablesPk}/delete`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
        });
        await fetchTablesForEvent(props.event.events_pk);
        emit("refresh");
    }
    catch (error) {
        console.error("Error deleting table:", error);
        alert("Failed to delete table");
    }
};
const captureQrPngFromCanvas = async () => {
    qrPngDataUrl.value = "";
    if (!qrCanvasWrap.value)
        return;
    await nextTick();
    await new Promise((resolve) => requestAnimationFrame(resolve));
    const canvas = qrCanvasWrap.value.querySelector("canvas");
    if (!canvas)
        return;
    try {
        qrPngDataUrl.value = canvas.toDataURL("image/png");
    }
    catch (err) {
        console.error("Failed to read QR canvas:", err);
        qrPngDataUrl.value = "";
    }
};
const generateQRCode = async (table) => {
    selectedTable.value = table;
    generatingQR.value = true;
    qrCodeDialog.value = true;
    showPlayers.value = false;
    qrPngDataUrl.value = "";
    try {
        const { data } = await axios.post("/qr_code/generate", null, {
            params: {
                events_fk: props.event.events_pk,
                event_tables_pk: table.event_tables_pk,
                expires_in_hours: 24,
            },
            headers: {
                Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
        });
        qrCodeData.value = data;
        await captureQrPngFromCanvas();
    }
    catch (error) {
        console.error("Error generating QR Code:", error);
        alert(error.response?.data?.message || "Failed to generate QR Code");
        qrCodeDialog.value = false;
    }
    finally {
        generatingQR.value = false;
    }
};
watch([qrCodeDialog, qrCodeData], async ([open, data]) => {
    if (!open || !data?.code) {
        qrPngDataUrl.value = "";
        return;
    }
    await captureQrPngFromCanvas();
});
const showTablePlayers = async () => {
    if (!showPlayers.value)
        await fetchTablePlayers();
    showPlayers.value = !showPlayers.value;
};
const fetchTablePlayers = async () => {
    loadingTablePlayers.value = true;
    try {
        const { data } = await axios.get(`/rl_events_users/table_players/${props.event.events_pk}/${selectedTable.value.event_tables_pk}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
        });
        tablePlayers.value = data.players || [];
    }
    catch (error) {
        console.error("Error fetching table players:", error);
        tablePlayers.value = [];
    }
    finally {
        loadingTablePlayers.value = false;
    }
};
const openTablesAndStartQrTutorial = async () => {
    startInTables.value = true;
    qrTutorial.value = { active: true, step: 1 };
    if (props.modelValue) {
        activeTab.value = "tables";
        await nextTick();
    }
};
const __VLS_exposed = {
    openTablesAndStartQrTutorial,
};
defineExpose(__VLS_exposed);
const loadImage = (src) => new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
});
const getQrPngDataUrl = async () => {
    await nextTick();
    await new Promise((r) => requestAnimationFrame(r));
    const wrap = qrCanvasWrap.value;
    if (wrap) {
        const canvas = wrap.querySelector("canvas");
        if (canvas) {
            try {
                return canvas.toDataURL("image/png");
            }
            catch (e) {
                console.error("toDataURL(canvas) failed:", e);
            }
        }
        const svg = wrap.querySelector("svg");
        if (svg) {
            try {
                if (!svg.getAttribute("xmlns")) {
                    svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
                }
                const svgString = new XMLSerializer().serializeToString(svg);
                const svgUrl = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgString)}`;
                const img = await loadImage(svgUrl);
                const size = 900;
                const c = document.createElement("canvas");
                c.width = size;
                c.height = size;
                const ctx = c.getContext("2d");
                ctx.fillStyle = "#ffffff";
                ctx.fillRect(0, 0, size, size);
                ctx.drawImage(img, 0, 0, size, size);
                return c.toDataURL("image/png");
            }
            catch (e) {
                console.error("SVG -> PNG failed:", e);
            }
        }
    }
    if (qrCodeData.value?.code) {
        try {
            return await QRCode.toDataURL(qrCodeData.value.code, {
                errorCorrectionLevel: "H",
                width: 900,
                margin: 1,
            });
        }
        catch (e) {
            console.error("QRCode.toDataURL fallback failed:", e);
        }
    }
    return "";
};
const downloadQrPdf = async () => {
    try {
        downloadingPdf.value = true;
        const imgData = await getQrPngDataUrl();
        if (!imgData || !selectedTable.value) {
            alert("QR code image is not ready yet. Please try again.");
            return;
        }
        const doc = new jsPDF({
            orientation: "portrait",
            unit: "pt",
            format: "a4",
        });
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();
        const margin = 48;
        doc.setFontSize(18);
        doc.text(`Table ${selectedTable.value.table_number} — QR Code`, margin, 56);
        const qrSize = Math.min(360, pageWidth - margin * 2);
        doc.addImage(imgData, "PNG", (pageWidth - qrSize) / 2, 80, qrSize, qrSize);
        doc.setFontSize(12);
        const y = 80 + qrSize + 36;
        doc.text("How to use this QR code:", margin, y);
        const steps = [
            "1. Share this QR code with the players before the event.",
            "2. Players need to be logged into the Drunagor app - https://drunagor.app/",
            "3. After logging in, they will be directed to the Dashboard page, where there will be a 'PLAY' button.",
            "4. The player needs to click this button and scan the QR code provided by the retailer.",
            "5. By scanning the QR code, they will be redirected to the event table, where they need to select a hero.",
        ];
        doc.text(steps, margin, y + 18, { maxWidth: pageWidth - margin * 2 });
        doc.setFontSize(10);
        doc.setTextColor(120);
        doc.text("Tip: You can print this PDF and place it on the table.", margin, pageHeight - 40);
        const filename = `event-${props.event?.events_pk || "unknown"}-table-${selectedTable.value.table_number}-qr.pdf`;
        doc.save(filename);
    }
    catch (err) {
        console.error("downloadQrPdf failed:", err);
        alert("Failed to download the QR code PDF.");
    }
    finally {
        downloadingPdf.value = false;
    }
};
watch(() => props.modelValue, async (isOpen) => {
    if (isOpen && props.event) {
        currentPage.value = 1;
        activeTab.value = startInTables.value ? "tables" : "details";
        await Promise.all([
            fetchTablesForEvent(props.event.events_pk),
            fetchPlayersForEvent(props.event.events_pk),
            fetchStatuses(),
            fetchEventRewards(props.event.events_pk),
        ]);
        if (startInTables.value) {
            activeTab.value = "tables";
            qrTutorial.value = { active: true, step: 1 };
            await nextTick();
        }
    }
    if (!isOpen) {
        startInTables.value = false;
    }
});
watch(currentPage, () => {
    if (props.modelValue && props.event)
        fetchPlayersForEvent(props.event.events_pk);
});
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['setup-preview-card']} */ ;
/** @type {__VLS_StyleScopedClasses['image-zoom-container']} */ ;
/** @type {__VLS_StyleScopedClasses['event-card']} */ ;
/** @type {__VLS_StyleScopedClasses['table-card']} */ ;
/** @type {__VLS_StyleScopedClasses['event-card']} */ ;
/** @type {__VLS_StyleScopedClasses['qr-code-container']} */ ;
// CSS variable injection 
// CSS variable injection end 
const __VLS_0 = {}.VDialog;
/** @type {[typeof __VLS_components.VDialog, typeof __VLS_components.vDialog, typeof __VLS_components.VDialog, typeof __VLS_components.vDialog, ]} */ ;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
    ...{ 'onUpdate:modelValue': {} },
    modelValue: (__VLS_ctx.modelValue),
    scrollTarget: "#app",
    maxWidth: "900",
    fullscreen: (__VLS_ctx.smAndDown),
    persistent: true,
}));
const __VLS_2 = __VLS_1({
    ...{ 'onUpdate:modelValue': {} },
    modelValue: (__VLS_ctx.modelValue),
    scrollTarget: "#app",
    maxWidth: "900",
    fullscreen: (__VLS_ctx.smAndDown),
    persistent: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
let __VLS_4;
let __VLS_5;
let __VLS_6;
const __VLS_7 = {
    'onUpdate:modelValue': (...[$event]) => {
        __VLS_ctx.$emit('update:modelValue', $event);
    }
};
var __VLS_8 = {};
__VLS_3.slots.default;
const __VLS_9 = {}.VCard;
/** @type {[typeof __VLS_components.VCard, typeof __VLS_components.vCard, typeof __VLS_components.VCard, typeof __VLS_components.vCard, ]} */ ;
// @ts-ignore
const __VLS_10 = __VLS_asFunctionalComponent(__VLS_9, new __VLS_9({
    color: "surface",
}));
const __VLS_11 = __VLS_10({
    color: "surface",
}, ...__VLS_functionalComponentArgsRest(__VLS_10));
__VLS_12.slots.default;
if (__VLS_ctx.dialogLoading) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "dialog-overlay" },
    });
    const __VLS_13 = {}.VProgressCircular;
    /** @type {[typeof __VLS_components.VProgressCircular, typeof __VLS_components.vProgressCircular, ]} */ ;
    // @ts-ignore
    const __VLS_14 = __VLS_asFunctionalComponent(__VLS_13, new __VLS_13({
        indeterminate: true,
        size: "80",
        color: "primary",
    }));
    const __VLS_15 = __VLS_14({
        indeterminate: true,
        size: "80",
        color: "primary",
    }, ...__VLS_functionalComponentArgsRest(__VLS_14));
}
const __VLS_17 = {}.VCardTitle;
/** @type {[typeof __VLS_components.VCardTitle, typeof __VLS_components.vCardTitle, typeof __VLS_components.VCardTitle, typeof __VLS_components.vCardTitle, ]} */ ;
// @ts-ignore
const __VLS_18 = __VLS_asFunctionalComponent(__VLS_17, new __VLS_17({
    ...{ class: "d-flex justify-space-between align-center" },
}));
const __VLS_19 = __VLS_18({
    ...{ class: "d-flex justify-space-between align-center" },
}, ...__VLS_functionalComponentArgsRest(__VLS_18));
__VLS_20.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "text-h6" },
});
const __VLS_21 = {}.VBtn;
/** @type {[typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ]} */ ;
// @ts-ignore
const __VLS_22 = __VLS_asFunctionalComponent(__VLS_21, new __VLS_21({
    ...{ 'onClick': {} },
    icon: true,
    variant: "text",
}));
const __VLS_23 = __VLS_22({
    ...{ 'onClick': {} },
    icon: true,
    variant: "text",
}, ...__VLS_functionalComponentArgsRest(__VLS_22));
let __VLS_25;
let __VLS_26;
let __VLS_27;
const __VLS_28 = {
    onClick: (__VLS_ctx.closeDialog)
};
__VLS_24.slots.default;
const __VLS_29 = {}.VIcon;
/** @type {[typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, ]} */ ;
// @ts-ignore
const __VLS_30 = __VLS_asFunctionalComponent(__VLS_29, new __VLS_29({}));
const __VLS_31 = __VLS_30({}, ...__VLS_functionalComponentArgsRest(__VLS_30));
__VLS_32.slots.default;
var __VLS_32;
var __VLS_24;
var __VLS_20;
const __VLS_33 = {}.VTabs;
/** @type {[typeof __VLS_components.VTabs, typeof __VLS_components.vTabs, typeof __VLS_components.VTabs, typeof __VLS_components.vTabs, ]} */ ;
// @ts-ignore
const __VLS_34 = __VLS_asFunctionalComponent(__VLS_33, new __VLS_33({
    modelValue: (__VLS_ctx.activeTab),
    bgColor: "background",
    centered: true,
    grow: true,
    ...{ class: "mb-4" },
}));
const __VLS_35 = __VLS_34({
    modelValue: (__VLS_ctx.activeTab),
    bgColor: "background",
    centered: true,
    grow: true,
    ...{ class: "mb-4" },
}, ...__VLS_functionalComponentArgsRest(__VLS_34));
__VLS_36.slots.default;
const __VLS_37 = {}.VTab;
/** @type {[typeof __VLS_components.VTab, typeof __VLS_components.vTab, typeof __VLS_components.VTab, typeof __VLS_components.vTab, ]} */ ;
// @ts-ignore
const __VLS_38 = __VLS_asFunctionalComponent(__VLS_37, new __VLS_37({
    value: "details",
}));
const __VLS_39 = __VLS_38({
    value: "details",
}, ...__VLS_functionalComponentArgsRest(__VLS_38));
__VLS_40.slots.default;
const __VLS_41 = {}.VIcon;
/** @type {[typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, ]} */ ;
// @ts-ignore
const __VLS_42 = __VLS_asFunctionalComponent(__VLS_41, new __VLS_41({
    start: true,
}));
const __VLS_43 = __VLS_42({
    start: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_42));
__VLS_44.slots.default;
var __VLS_44;
var __VLS_40;
const __VLS_45 = {}.VTab;
/** @type {[typeof __VLS_components.VTab, typeof __VLS_components.vTab, typeof __VLS_components.VTab, typeof __VLS_components.vTab, ]} */ ;
// @ts-ignore
const __VLS_46 = __VLS_asFunctionalComponent(__VLS_45, new __VLS_45({
    value: "tables",
}));
const __VLS_47 = __VLS_46({
    value: "tables",
}, ...__VLS_functionalComponentArgsRest(__VLS_46));
__VLS_48.slots.default;
const __VLS_49 = {}.VIcon;
/** @type {[typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, ]} */ ;
// @ts-ignore
const __VLS_50 = __VLS_asFunctionalComponent(__VLS_49, new __VLS_49({
    start: true,
}));
const __VLS_51 = __VLS_50({
    start: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_50));
__VLS_52.slots.default;
var __VLS_52;
var __VLS_48;
const __VLS_53 = {}.VTab;
/** @type {[typeof __VLS_components.VTab, typeof __VLS_components.vTab, typeof __VLS_components.VTab, typeof __VLS_components.vTab, ]} */ ;
// @ts-ignore
const __VLS_54 = __VLS_asFunctionalComponent(__VLS_53, new __VLS_53({
    value: "setup",
}));
const __VLS_55 = __VLS_54({
    value: "setup",
}, ...__VLS_functionalComponentArgsRest(__VLS_54));
__VLS_56.slots.default;
const __VLS_57 = {}.VIcon;
/** @type {[typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, ]} */ ;
// @ts-ignore
const __VLS_58 = __VLS_asFunctionalComponent(__VLS_57, new __VLS_57({
    start: true,
}));
const __VLS_59 = __VLS_58({
    start: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_58));
__VLS_60.slots.default;
var __VLS_60;
var __VLS_56;
const __VLS_61 = {}.VTab;
/** @type {[typeof __VLS_components.VTab, typeof __VLS_components.vTab, typeof __VLS_components.VTab, typeof __VLS_components.vTab, ]} */ ;
// @ts-ignore
const __VLS_62 = __VLS_asFunctionalComponent(__VLS_61, new __VLS_61({
    value: "players",
}));
const __VLS_63 = __VLS_62({
    value: "players",
}, ...__VLS_functionalComponentArgsRest(__VLS_62));
__VLS_64.slots.default;
const __VLS_65 = {}.VIcon;
/** @type {[typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, ]} */ ;
// @ts-ignore
const __VLS_66 = __VLS_asFunctionalComponent(__VLS_65, new __VLS_65({
    start: true,
}));
const __VLS_67 = __VLS_66({
    start: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_66));
__VLS_68.slots.default;
var __VLS_68;
var __VLS_64;
var __VLS_36;
const __VLS_69 = {}.VCardText;
/** @type {[typeof __VLS_components.VCardText, typeof __VLS_components.vCardText, typeof __VLS_components.VCardText, typeof __VLS_components.vCardText, ]} */ ;
// @ts-ignore
const __VLS_70 = __VLS_asFunctionalComponent(__VLS_69, new __VLS_69({}));
const __VLS_71 = __VLS_70({}, ...__VLS_functionalComponentArgsRest(__VLS_70));
__VLS_72.slots.default;
const __VLS_73 = {}.VWindow;
/** @type {[typeof __VLS_components.VWindow, typeof __VLS_components.vWindow, typeof __VLS_components.VWindow, typeof __VLS_components.vWindow, ]} */ ;
// @ts-ignore
const __VLS_74 = __VLS_asFunctionalComponent(__VLS_73, new __VLS_73({
    modelValue: (__VLS_ctx.activeTab),
}));
const __VLS_75 = __VLS_74({
    modelValue: (__VLS_ctx.activeTab),
}, ...__VLS_functionalComponentArgsRest(__VLS_74));
__VLS_76.slots.default;
const __VLS_77 = {}.VWindowItem;
/** @type {[typeof __VLS_components.VWindowItem, typeof __VLS_components.vWindowItem, typeof __VLS_components.VWindowItem, typeof __VLS_components.vWindowItem, ]} */ ;
// @ts-ignore
const __VLS_78 = __VLS_asFunctionalComponent(__VLS_77, new __VLS_77({
    value: "details",
}));
const __VLS_79 = __VLS_78({
    value: "details",
}, ...__VLS_functionalComponentArgsRest(__VLS_78));
__VLS_80.slots.default;
const __VLS_81 = {}.VCardText;
/** @type {[typeof __VLS_components.VCardText, typeof __VLS_components.vCardText, typeof __VLS_components.VCardText, typeof __VLS_components.vCardText, ]} */ ;
// @ts-ignore
const __VLS_82 = __VLS_asFunctionalComponent(__VLS_81, new __VLS_81({
    ...{ class: "pt-0" },
}));
const __VLS_83 = __VLS_82({
    ...{ class: "pt-0" },
}, ...__VLS_functionalComponentArgsRest(__VLS_82));
__VLS_84.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({});
const __VLS_85 = {}.VIcon;
/** @type {[typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, ]} */ ;
// @ts-ignore
const __VLS_86 = __VLS_asFunctionalComponent(__VLS_85, new __VLS_85({}));
const __VLS_87 = __VLS_86({}, ...__VLS_functionalComponentArgsRest(__VLS_86));
__VLS_88.slots.default;
var __VLS_88;
(__VLS_ctx.event?.seats_number);
__VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({});
const __VLS_89 = {}.VIcon;
/** @type {[typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, ]} */ ;
// @ts-ignore
const __VLS_90 = __VLS_asFunctionalComponent(__VLS_89, new __VLS_89({}));
const __VLS_91 = __VLS_90({}, ...__VLS_functionalComponentArgsRest(__VLS_90));
__VLS_92.slots.default;
var __VLS_92;
(__VLS_ctx.event?.scenario);
if (__VLS_ctx.getSeasonInfo(__VLS_ctx.event?.seasons_fk).name) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({});
    const __VLS_93 = {}.VIcon;
    /** @type {[typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, ]} */ ;
    // @ts-ignore
    const __VLS_94 = __VLS_asFunctionalComponent(__VLS_93, new __VLS_93({}));
    const __VLS_95 = __VLS_94({}, ...__VLS_functionalComponentArgsRest(__VLS_94));
    __VLS_96.slots.default;
    var __VLS_96;
    (__VLS_ctx.getSeasonInfo(__VLS_ctx.event.seasons_fk).name);
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
    ...{ class: "text-end scheduled-box" },
});
(__VLS_ctx.formatEventDate(__VLS_ctx.event?.event_date, __VLS_ctx.userTimezone));
var __VLS_84;
const __VLS_97 = {}.VCard;
/** @type {[typeof __VLS_components.VCard, typeof __VLS_components.vCard, typeof __VLS_components.VCard, typeof __VLS_components.vCard, ]} */ ;
// @ts-ignore
const __VLS_98 = __VLS_asFunctionalComponent(__VLS_97, new __VLS_97({
    ...{ 'onClick': {} },
    color: "primary",
    minHeight: "130px",
    ...{ class: "mr-4 event-card" },
}));
const __VLS_99 = __VLS_98({
    ...{ 'onClick': {} },
    color: "primary",
    minHeight: "130px",
    ...{ class: "mr-4 event-card" },
}, ...__VLS_functionalComponentArgsRest(__VLS_98));
let __VLS_101;
let __VLS_102;
let __VLS_103;
const __VLS_104 = {
    onClick: (...[$event]) => {
        __VLS_ctx.openInGoogleMaps();
    }
};
__VLS_100.slots.default;
const __VLS_105 = {}.VRow;
/** @type {[typeof __VLS_components.VRow, typeof __VLS_components.vRow, typeof __VLS_components.VRow, typeof __VLS_components.vRow, ]} */ ;
// @ts-ignore
const __VLS_106 = __VLS_asFunctionalComponent(__VLS_105, new __VLS_105({
    noGutters: true,
}));
const __VLS_107 = __VLS_106({
    noGutters: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_106));
__VLS_108.slots.default;
const __VLS_109 = {}.VCol;
/** @type {[typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ]} */ ;
// @ts-ignore
const __VLS_110 = __VLS_asFunctionalComponent(__VLS_109, new __VLS_109({
    cols: "3",
    lg: "3",
}));
const __VLS_111 = __VLS_110({
    cols: "3",
    lg: "3",
}, ...__VLS_functionalComponentArgsRest(__VLS_110));
__VLS_112.slots.default;
const __VLS_113 = {}.VImg;
/** @type {[typeof __VLS_components.VImg, typeof __VLS_components.vImg, ]} */ ;
// @ts-ignore
const __VLS_114 = __VLS_asFunctionalComponent(__VLS_113, new __VLS_113({
    src: (__VLS_ctx.event?.picture_hash
        ? `https://assets.drunagor.app/${__VLS_ctx.event.picture_hash}`
        : 'https://s3.us-east-2.amazonaws.com/assets.drunagor.app/Profile/store.png'),
    ...{ class: "event-img" },
}));
const __VLS_115 = __VLS_114({
    src: (__VLS_ctx.event?.picture_hash
        ? `https://assets.drunagor.app/${__VLS_ctx.event.picture_hash}`
        : 'https://s3.us-east-2.amazonaws.com/assets.drunagor.app/Profile/store.png'),
    ...{ class: "event-img" },
}, ...__VLS_functionalComponentArgsRest(__VLS_114));
var __VLS_112;
const __VLS_117 = {}.VCol;
/** @type {[typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ]} */ ;
// @ts-ignore
const __VLS_118 = __VLS_asFunctionalComponent(__VLS_117, new __VLS_117({
    cols: "9",
    ...{ class: "pa-2" },
}));
const __VLS_119 = __VLS_118({
    cols: "9",
    ...{ class: "pa-2" },
}, ...__VLS_functionalComponentArgsRest(__VLS_118));
__VLS_120.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.h3, __VLS_intrinsicElements.h3)({
    ...{ class: "text-subtitle-1 font-weight-bold" },
});
(__VLS_ctx.event?.store_name);
__VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
    ...{ class: "text-caption" },
});
const __VLS_121 = {}.VIcon;
/** @type {[typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, ]} */ ;
// @ts-ignore
const __VLS_122 = __VLS_asFunctionalComponent(__VLS_121, new __VLS_121({
    color: "red",
}));
const __VLS_123 = __VLS_122({
    color: "red",
}, ...__VLS_functionalComponentArgsRest(__VLS_122));
__VLS_124.slots.default;
var __VLS_124;
(__VLS_ctx.event?.address);
var __VLS_120;
var __VLS_108;
var __VLS_100;
const __VLS_125 = {}.VCard;
/** @type {[typeof __VLS_components.VCard, typeof __VLS_components.vCard, typeof __VLS_components.VCard, typeof __VLS_components.vCard, ]} */ ;
// @ts-ignore
const __VLS_126 = __VLS_asFunctionalComponent(__VLS_125, new __VLS_125({
    color: "primary",
    ...{ class: "mr-4 mt-4 event-card" },
}));
const __VLS_127 = __VLS_126({
    color: "primary",
    ...{ class: "mr-4 mt-4 event-card" },
}, ...__VLS_functionalComponentArgsRest(__VLS_126));
__VLS_128.slots.default;
const __VLS_129 = {}.VResponsive;
/** @type {[typeof __VLS_components.VResponsive, typeof __VLS_components.vResponsive, typeof __VLS_components.VResponsive, typeof __VLS_components.vResponsive, ]} */ ;
// @ts-ignore
const __VLS_130 = __VLS_asFunctionalComponent(__VLS_129, new __VLS_129({
    ...{ style: {} },
    aspectRatio: "16/9",
}));
const __VLS_131 = __VLS_130({
    ...{ style: {} },
    aspectRatio: "16/9",
}, ...__VLS_functionalComponentArgsRest(__VLS_130));
__VLS_132.slots.default;
if (__VLS_ctx.event?.latitude) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.iframe)({
        src: (`https://www.google.com/maps?q=${__VLS_ctx.event.latitude},${__VLS_ctx.event.longitude}` +
            `&z=15&output=embed`),
        frameborder: "0",
        ...{ style: {} },
        allowfullscreen: true,
        loading: "lazy",
    });
}
var __VLS_132;
var __VLS_128;
const __VLS_133 = {}.VCardText;
/** @type {[typeof __VLS_components.VCardText, typeof __VLS_components.vCardText, typeof __VLS_components.VCardText, typeof __VLS_components.vCardText, ]} */ ;
// @ts-ignore
const __VLS_134 = __VLS_asFunctionalComponent(__VLS_133, new __VLS_133({}));
const __VLS_135 = __VLS_134({}, ...__VLS_functionalComponentArgsRest(__VLS_134));
__VLS_136.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.h3, __VLS_intrinsicElements.h3)({
    ...{ class: "text-h6 font-weight-bold" },
});
if (__VLS_ctx.eventRewards.length) {
    for (const [reward, index] of __VLS_getVForSourceType((__VLS_ctx.eventRewards))) {
        const __VLS_137 = {}.VRow;
        /** @type {[typeof __VLS_components.VRow, typeof __VLS_components.vRow, typeof __VLS_components.VRow, typeof __VLS_components.vRow, ]} */ ;
        // @ts-ignore
        const __VLS_138 = __VLS_asFunctionalComponent(__VLS_137, new __VLS_137({
            key: (index),
            ...{ class: "align-center my-2" },
        }));
        const __VLS_139 = __VLS_138({
            key: (index),
            ...{ class: "align-center my-2" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_138));
        __VLS_140.slots.default;
        const __VLS_141 = {}.VCol;
        /** @type {[typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ]} */ ;
        // @ts-ignore
        const __VLS_142 = __VLS_asFunctionalComponent(__VLS_141, new __VLS_141({
            cols: "3",
            md: "2",
        }));
        const __VLS_143 = __VLS_142({
            cols: "3",
            md: "2",
        }, ...__VLS_functionalComponentArgsRest(__VLS_142));
        __VLS_144.slots.default;
        const __VLS_145 = {}.VAvatar;
        /** @type {[typeof __VLS_components.VAvatar, typeof __VLS_components.vAvatar, typeof __VLS_components.VAvatar, typeof __VLS_components.vAvatar, ]} */ ;
        // @ts-ignore
        const __VLS_146 = __VLS_asFunctionalComponent(__VLS_145, new __VLS_145({
            size: "60",
        }));
        const __VLS_147 = __VLS_146({
            size: "60",
        }, ...__VLS_functionalComponentArgsRest(__VLS_146));
        __VLS_148.slots.default;
        const __VLS_149 = {}.VImg;
        /** @type {[typeof __VLS_components.VImg, typeof __VLS_components.vImg, ]} */ ;
        // @ts-ignore
        const __VLS_150 = __VLS_asFunctionalComponent(__VLS_149, new __VLS_149({
            src: (`https://assets.drunagor.app/${reward.picture_hash}`),
        }));
        const __VLS_151 = __VLS_150({
            src: (`https://assets.drunagor.app/${reward.picture_hash}`),
        }, ...__VLS_functionalComponentArgsRest(__VLS_150));
        var __VLS_148;
        var __VLS_144;
        const __VLS_153 = {}.VCol;
        /** @type {[typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ]} */ ;
        // @ts-ignore
        const __VLS_154 = __VLS_asFunctionalComponent(__VLS_153, new __VLS_153({
            cols: "9",
            md: "10",
        }));
        const __VLS_155 = __VLS_154({
            cols: "9",
            md: "10",
        }, ...__VLS_functionalComponentArgsRest(__VLS_154));
        __VLS_156.slots.default;
        __VLS_asFunctionalElement(__VLS_intrinsicElements.h4, __VLS_intrinsicElements.h4)({
            ...{ class: "text-subtitle-1 font-weight-bold" },
        });
        (reward.name);
        var __VLS_156;
        var __VLS_140;
    }
}
else {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
        ...{ class: "text-caption" },
    });
}
var __VLS_136;
var __VLS_80;
const __VLS_157 = {}.VWindowItem;
/** @type {[typeof __VLS_components.VWindowItem, typeof __VLS_components.vWindowItem, typeof __VLS_components.VWindowItem, typeof __VLS_components.vWindowItem, ]} */ ;
// @ts-ignore
const __VLS_158 = __VLS_asFunctionalComponent(__VLS_157, new __VLS_157({
    value: "tables",
}));
const __VLS_159 = __VLS_158({
    value: "tables",
}, ...__VLS_functionalComponentArgsRest(__VLS_158));
__VLS_160.slots.default;
const __VLS_161 = {}.VAlert;
/** @type {[typeof __VLS_components.VAlert, typeof __VLS_components.vAlert, typeof __VLS_components.VAlert, typeof __VLS_components.vAlert, ]} */ ;
// @ts-ignore
const __VLS_162 = __VLS_asFunctionalComponent(__VLS_161, new __VLS_161({
    type: "info",
    variant: "tonal",
    ...{ class: "mb-4" },
    border: "start",
}));
const __VLS_163 = __VLS_162({
    type: "info",
    variant: "tonal",
    ...{ class: "mb-4" },
    border: "start",
}, ...__VLS_functionalComponentArgsRest(__VLS_162));
__VLS_164.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "font-weight-bold" },
});
(__VLS_ctx.tablesAlertCopy.title);
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "mt-1" },
});
(__VLS_ctx.tablesAlertCopy.message);
var __VLS_164;
const __VLS_165 = {}.VRow;
/** @type {[typeof __VLS_components.VRow, typeof __VLS_components.vRow, typeof __VLS_components.VRow, typeof __VLS_components.vRow, ]} */ ;
// @ts-ignore
const __VLS_166 = __VLS_asFunctionalComponent(__VLS_165, new __VLS_165({
    ...{ class: "mb-4" },
}));
const __VLS_167 = __VLS_166({
    ...{ class: "mb-4" },
}, ...__VLS_functionalComponentArgsRest(__VLS_166));
__VLS_168.slots.default;
const __VLS_169 = {}.VCol;
/** @type {[typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ]} */ ;
// @ts-ignore
const __VLS_170 = __VLS_asFunctionalComponent(__VLS_169, new __VLS_169({
    cols: "12",
    ...{ class: "d-flex justify-space-between align-center flex-wrap" },
}));
const __VLS_171 = __VLS_170({
    cols: "12",
    ...{ class: "d-flex justify-space-between align-center flex-wrap" },
}, ...__VLS_functionalComponentArgsRest(__VLS_170));
__VLS_172.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.h3, __VLS_intrinsicElements.h3)({
    ...{ class: "text-h6 mb-2 mb-md-0" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "d-flex gap-3 flex-wrap" },
});
const __VLS_173 = {}.VBtn;
/** @type {[typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ]} */ ;
// @ts-ignore
const __VLS_174 = __VLS_asFunctionalComponent(__VLS_173, new __VLS_173({
    ...{ 'onClick': {} },
    color: "primary",
    size: "default",
}));
const __VLS_175 = __VLS_174({
    ...{ 'onClick': {} },
    color: "primary",
    size: "default",
}, ...__VLS_functionalComponentArgsRest(__VLS_174));
let __VLS_177;
let __VLS_178;
let __VLS_179;
const __VLS_180 = {
    onClick: (__VLS_ctx.openCreateTableDialog)
};
__VLS_176.slots.default;
const __VLS_181 = {}.VIcon;
/** @type {[typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, ]} */ ;
// @ts-ignore
const __VLS_182 = __VLS_asFunctionalComponent(__VLS_181, new __VLS_181({
    start: true,
}));
const __VLS_183 = __VLS_182({
    start: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_182));
__VLS_184.slots.default;
var __VLS_184;
var __VLS_176;
const __VLS_185 = {}.VBtn;
/** @type {[typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ]} */ ;
// @ts-ignore
const __VLS_186 = __VLS_asFunctionalComponent(__VLS_185, new __VLS_185({
    ...{ 'onClick': {} },
    color: "secondary",
    size: "default",
}));
const __VLS_187 = __VLS_186({
    ...{ 'onClick': {} },
    color: "secondary",
    size: "default",
}, ...__VLS_functionalComponentArgsRest(__VLS_186));
let __VLS_189;
let __VLS_190;
let __VLS_191;
const __VLS_192 = {
    onClick: (__VLS_ctx.openCreateMultipleTablesDialog)
};
__VLS_188.slots.default;
const __VLS_193 = {}.VIcon;
/** @type {[typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, ]} */ ;
// @ts-ignore
const __VLS_194 = __VLS_asFunctionalComponent(__VLS_193, new __VLS_193({
    start: true,
}));
const __VLS_195 = __VLS_194({
    start: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_194));
__VLS_196.slots.default;
var __VLS_196;
var __VLS_188;
var __VLS_172;
var __VLS_168;
if (__VLS_ctx.loadingTables) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "text-center py-6" },
    });
    const __VLS_197 = {}.VProgressCircular;
    /** @type {[typeof __VLS_components.VProgressCircular, typeof __VLS_components.vProgressCircular, ]} */ ;
    // @ts-ignore
    const __VLS_198 = __VLS_asFunctionalComponent(__VLS_197, new __VLS_197({
        indeterminate: true,
        color: "primary",
    }));
    const __VLS_199 = __VLS_198({
        indeterminate: true,
        color: "primary",
    }, ...__VLS_functionalComponentArgsRest(__VLS_198));
}
else {
    const __VLS_201 = {}.VRow;
    /** @type {[typeof __VLS_components.VRow, typeof __VLS_components.vRow, typeof __VLS_components.VRow, typeof __VLS_components.vRow, ]} */ ;
    // @ts-ignore
    const __VLS_202 = __VLS_asFunctionalComponent(__VLS_201, new __VLS_201({}));
    const __VLS_203 = __VLS_202({}, ...__VLS_functionalComponentArgsRest(__VLS_202));
    __VLS_204.slots.default;
    if (__VLS_ctx.tables.length === 0) {
        const __VLS_205 = {}.VCol;
        /** @type {[typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ]} */ ;
        // @ts-ignore
        const __VLS_206 = __VLS_asFunctionalComponent(__VLS_205, new __VLS_205({
            cols: "12",
            ...{ class: "text-center text-grey py-6" },
        }));
        const __VLS_207 = __VLS_206({
            cols: "12",
            ...{ class: "text-center text-grey py-6" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_206));
        __VLS_208.slots.default;
        var __VLS_208;
    }
    for (const [table] of __VLS_getVForSourceType((__VLS_ctx.tables))) {
        const __VLS_209 = {}.VCol;
        /** @type {[typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ]} */ ;
        // @ts-ignore
        const __VLS_210 = __VLS_asFunctionalComponent(__VLS_209, new __VLS_209({
            key: (table.event_tables_pk),
            cols: "12",
            sm: "6",
            md: "4",
        }));
        const __VLS_211 = __VLS_210({
            key: (table.event_tables_pk),
            cols: "12",
            sm: "6",
            md: "4",
        }, ...__VLS_functionalComponentArgsRest(__VLS_210));
        __VLS_212.slots.default;
        const __VLS_213 = {}.VCard;
        /** @type {[typeof __VLS_components.VCard, typeof __VLS_components.vCard, typeof __VLS_components.VCard, typeof __VLS_components.vCard, ]} */ ;
        // @ts-ignore
        const __VLS_214 = __VLS_asFunctionalComponent(__VLS_213, new __VLS_213({
            ...{ 'onClick': {} },
            ...{ class: "pa-4 table-card" },
            elevation: "4",
            rounded: "lg",
        }));
        const __VLS_215 = __VLS_214({
            ...{ 'onClick': {} },
            ...{ class: "pa-4 table-card" },
            elevation: "4",
            rounded: "lg",
        }, ...__VLS_functionalComponentArgsRest(__VLS_214));
        let __VLS_217;
        let __VLS_218;
        let __VLS_219;
        const __VLS_220 = {
            onClick: (...[$event]) => {
                if (!!(__VLS_ctx.loadingTables))
                    return;
                __VLS_ctx.generateQRCode(table);
            }
        };
        __VLS_216.slots.default;
        const __VLS_221 = {}.VRow;
        /** @type {[typeof __VLS_components.VRow, typeof __VLS_components.vRow, typeof __VLS_components.VRow, typeof __VLS_components.vRow, ]} */ ;
        // @ts-ignore
        const __VLS_222 = __VLS_asFunctionalComponent(__VLS_221, new __VLS_221({
            noGutters: true,
        }));
        const __VLS_223 = __VLS_222({
            noGutters: true,
        }, ...__VLS_functionalComponentArgsRest(__VLS_222));
        __VLS_224.slots.default;
        const __VLS_225 = {}.VCol;
        /** @type {[typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ]} */ ;
        // @ts-ignore
        const __VLS_226 = __VLS_asFunctionalComponent(__VLS_225, new __VLS_225({
            cols: "12",
            ...{ class: "d-flex justify-space-between align-center mb-2" },
        }));
        const __VLS_227 = __VLS_226({
            cols: "12",
            ...{ class: "d-flex justify-space-between align-center mb-2" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_226));
        __VLS_228.slots.default;
        const __VLS_229 = {}.VChip;
        /** @type {[typeof __VLS_components.VChip, typeof __VLS_components.vChip, typeof __VLS_components.VChip, typeof __VLS_components.vChip, ]} */ ;
        // @ts-ignore
        const __VLS_230 = __VLS_asFunctionalComponent(__VLS_229, new __VLS_229({
            color: "primary",
            size: "small",
            label: true,
            ...{ class: "font-weight-bold" },
        }));
        const __VLS_231 = __VLS_230({
            color: "primary",
            size: "small",
            label: true,
            ...{ class: "font-weight-bold" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_230));
        __VLS_232.slots.default;
        const __VLS_233 = {}.VIcon;
        /** @type {[typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, ]} */ ;
        // @ts-ignore
        const __VLS_234 = __VLS_asFunctionalComponent(__VLS_233, new __VLS_233({
            start: true,
            color: "white",
            size: "small",
        }));
        const __VLS_235 = __VLS_234({
            start: true,
            color: "white",
            size: "small",
        }, ...__VLS_functionalComponentArgsRest(__VLS_234));
        __VLS_236.slots.default;
        var __VLS_236;
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ class: "table-number-text" },
        });
        (table.table_number);
        var __VLS_232;
        const __VLS_237 = {}.VBtn;
        /** @type {[typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ]} */ ;
        // @ts-ignore
        const __VLS_238 = __VLS_asFunctionalComponent(__VLS_237, new __VLS_237({
            ...{ 'onClick': {} },
            icon: true,
            size: "small",
            color: "red",
            variant: "text",
        }));
        const __VLS_239 = __VLS_238({
            ...{ 'onClick': {} },
            icon: true,
            size: "small",
            color: "red",
            variant: "text",
        }, ...__VLS_functionalComponentArgsRest(__VLS_238));
        let __VLS_241;
        let __VLS_242;
        let __VLS_243;
        const __VLS_244 = {
            onClick: (...[$event]) => {
                if (!!(__VLS_ctx.loadingTables))
                    return;
                __VLS_ctx.deleteTable(table.event_tables_pk);
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
        var __VLS_240;
        var __VLS_228;
        const __VLS_249 = {}.VCol;
        /** @type {[typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ]} */ ;
        // @ts-ignore
        const __VLS_250 = __VLS_asFunctionalComponent(__VLS_249, new __VLS_249({
            cols: "12",
        }));
        const __VLS_251 = __VLS_250({
            cols: "12",
        }, ...__VLS_functionalComponentArgsRest(__VLS_250));
        __VLS_252.slots.default;
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "d-flex align-center justify-space-between mb-2" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ class: "text-caption text-grey" },
        });
        const __VLS_253 = {}.VChip;
        /** @type {[typeof __VLS_components.VChip, typeof __VLS_components.vChip, typeof __VLS_components.VChip, typeof __VLS_components.vChip, ]} */ ;
        // @ts-ignore
        const __VLS_254 = __VLS_asFunctionalComponent(__VLS_253, new __VLS_253({
            size: "small",
            color: (table.is_full ? 'red' : 'green'),
            variant: "flat",
        }));
        const __VLS_255 = __VLS_254({
            size: "small",
            color: (table.is_full ? 'red' : 'green'),
            variant: "flat",
        }, ...__VLS_functionalComponentArgsRest(__VLS_254));
        __VLS_256.slots.default;
        (table.players_count);
        (table.max_players);
        var __VLS_256;
        const __VLS_257 = {}.VProgressLinear;
        /** @type {[typeof __VLS_components.VProgressLinear, typeof __VLS_components.vProgressLinear, ]} */ ;
        // @ts-ignore
        const __VLS_258 = __VLS_asFunctionalComponent(__VLS_257, new __VLS_257({
            modelValue: ((table.players_count / table.max_players) * 100),
            color: (table.is_full ? 'red' : 'green'),
            height: "8",
            rounded: true,
        }));
        const __VLS_259 = __VLS_258({
            modelValue: ((table.players_count / table.max_players) * 100),
            color: (table.is_full ? 'red' : 'green'),
            height: "8",
            rounded: true,
        }, ...__VLS_functionalComponentArgsRest(__VLS_258));
        var __VLS_252;
        const __VLS_261 = {}.VCol;
        /** @type {[typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ]} */ ;
        // @ts-ignore
        const __VLS_262 = __VLS_asFunctionalComponent(__VLS_261, new __VLS_261({
            cols: "12",
            ...{ class: "mt-3" },
        }));
        const __VLS_263 = __VLS_262({
            cols: "12",
            ...{ class: "mt-3" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_262));
        __VLS_264.slots.default;
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "text-caption text-grey" },
        });
        const __VLS_265 = {}.VIcon;
        /** @type {[typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, ]} */ ;
        // @ts-ignore
        const __VLS_266 = __VLS_asFunctionalComponent(__VLS_265, new __VLS_265({
            size: "small",
            ...{ class: "mr-1" },
        }));
        const __VLS_267 = __VLS_266({
            size: "small",
            ...{ class: "mr-1" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_266));
        __VLS_268.slots.default;
        var __VLS_268;
        (table.available_seats);
        var __VLS_264;
        const __VLS_269 = {}.VCol;
        /** @type {[typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ]} */ ;
        // @ts-ignore
        const __VLS_270 = __VLS_asFunctionalComponent(__VLS_269, new __VLS_269({
            cols: "12",
            ...{ class: "mt-2" },
        }));
        const __VLS_271 = __VLS_270({
            cols: "12",
            ...{ class: "mt-2" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_270));
        __VLS_272.slots.default;
        const __VLS_273 = {}.VBtn;
        /** @type {[typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ]} */ ;
        // @ts-ignore
        const __VLS_274 = __VLS_asFunctionalComponent(__VLS_273, new __VLS_273({
            ...{ 'onClick': {} },
            block: true,
            size: "small",
            color: "white",
            variant: "tonal",
        }));
        const __VLS_275 = __VLS_274({
            ...{ 'onClick': {} },
            block: true,
            size: "small",
            color: "white",
            variant: "tonal",
        }, ...__VLS_functionalComponentArgsRest(__VLS_274));
        let __VLS_277;
        let __VLS_278;
        let __VLS_279;
        const __VLS_280 = {
            onClick: (...[$event]) => {
                if (!!(__VLS_ctx.loadingTables))
                    return;
                __VLS_ctx.generateQRCode(table);
            }
        };
        __VLS_276.slots.default;
        const __VLS_281 = {}.VIcon;
        /** @type {[typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, ]} */ ;
        // @ts-ignore
        const __VLS_282 = __VLS_asFunctionalComponent(__VLS_281, new __VLS_281({
            start: true,
            size: "small",
        }));
        const __VLS_283 = __VLS_282({
            start: true,
            size: "small",
        }, ...__VLS_functionalComponentArgsRest(__VLS_282));
        __VLS_284.slots.default;
        var __VLS_284;
        var __VLS_276;
        var __VLS_272;
        var __VLS_224;
        var __VLS_216;
        var __VLS_212;
    }
    var __VLS_204;
}
var __VLS_160;
const __VLS_285 = {}.VWindowItem;
/** @type {[typeof __VLS_components.VWindowItem, typeof __VLS_components.vWindowItem, typeof __VLS_components.VWindowItem, typeof __VLS_components.vWindowItem, ]} */ ;
// @ts-ignore
const __VLS_286 = __VLS_asFunctionalComponent(__VLS_285, new __VLS_285({
    value: "setup",
}));
const __VLS_287 = __VLS_286({
    value: "setup",
}, ...__VLS_functionalComponentArgsRest(__VLS_286));
__VLS_288.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "setup-guide-container" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "mb-4 text-center" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.h3, __VLS_intrinsicElements.h3)({
    ...{ class: "text-h6 font-weight-bold mb-2" },
});
const __VLS_289 = {}.VIcon;
/** @type {[typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, ]} */ ;
// @ts-ignore
const __VLS_290 = __VLS_asFunctionalComponent(__VLS_289, new __VLS_289({
    color: "primary",
    ...{ class: "mr-2" },
}));
const __VLS_291 = __VLS_290({
    color: "primary",
    ...{ class: "mr-2" },
}, ...__VLS_functionalComponentArgsRest(__VLS_290));
__VLS_292.slots.default;
var __VLS_292;
(__VLS_ctx.event?.scenario);
__VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
    ...{ class: "text-body-2 mb-4" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "d-flex justify-center mb-4" },
});
const __VLS_9000 = {}.VBtn;
/** @type {[typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ]} */ ;
// @ts-ignore
const __VLS_9001 = __VLS_asFunctionalComponent(__VLS_9000, new __VLS_9000({
    ...{ 'onClick': {} },
    color: "amber-accent-2",
    variant: "tonal",
    rounded: "pill",
    ...{ class: "font-weight-bold text-white px-6" },
    prependIcon: "mdi-help-circle-outline",
}));
const __VLS_9002 = __VLS_9001({
    ...{ 'onClick': {} },
    color: "amber-accent-2",
    variant: "tonal",
    rounded: "pill",
    ...{ class: "font-weight-bold text-white px-6" },
    prependIcon: "mdi-help-circle-outline",
}, ...__VLS_functionalComponentArgsRest(__VLS_9001));
let __VLS_9004;
let __VLS_9005;
let __VLS_9006;
const __VLS_9007 = {
    onClick: (...[$event]) => {
        __VLS_ctx.showTutorialPrompt = true;
    }
};
__VLS_9002.slots.default;
if (__VLS_ctx.event?.scenario) {
    const __VLS_293 = {}.VCard;
    /** @type {[typeof __VLS_components.VCard, typeof __VLS_components.vCard, typeof __VLS_components.VCard, typeof __VLS_components.vCard, ]} */ ;
    // @ts-ignore
    const __VLS_294 = __VLS_asFunctionalComponent(__VLS_293, new __VLS_293({
        ...{ 'onClick': {} },
        ...{ class: "setup-preview-card mb-4" },
        elevation: "4",
    }));
    const __VLS_295 = __VLS_294({
        ...{ 'onClick': {} },
        ...{ class: "setup-preview-card mb-4" },
        elevation: "4",
    }, ...__VLS_functionalComponentArgsRest(__VLS_294));
    let __VLS_297;
    let __VLS_298;
    let __VLS_299;
    const __VLS_300 = {
        onClick: (__VLS_ctx.openSetupDialog)
    };
    __VLS_296.slots.default;
    /** @type {[typeof InitialSetupViewer, ]} */ ;
    // @ts-ignore
    const __VLS_301 = __VLS_asFunctionalComponent(InitialSetupViewer, new InitialSetupViewer({
        scenario: (__VLS_ctx.event.scenario),
        previewMode: true,
    }));
    const __VLS_302 = __VLS_301({
        scenario: (__VLS_ctx.event.scenario),
        previewMode: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_301));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "click-to-enlarge-hint" },
    });
    const __VLS_304 = {}.VIcon;
    /** @type {[typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, ]} */ ;
    // @ts-ignore
    const __VLS_305 = __VLS_asFunctionalComponent(__VLS_304, new __VLS_304({
        color: "white",
        size: "small",
    }));
    const __VLS_306 = __VLS_305({
        color: "white",
        size: "small",
    }, ...__VLS_functionalComponentArgsRest(__VLS_305));
    __VLS_307.slots.default;
    var __VLS_307;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "ml-1" },
    });
    var __VLS_296;
}
else {
    const __VLS_308 = {}.VAlert;
    /** @type {[typeof __VLS_components.VAlert, typeof __VLS_components.vAlert, typeof __VLS_components.VAlert, typeof __VLS_components.vAlert, ]} */ ;
    // @ts-ignore
    const __VLS_309 = __VLS_asFunctionalComponent(__VLS_308, new __VLS_308({
        type: "info",
        variant: "tonal",
        ...{ class: "text-center" },
    }));
    const __VLS_310 = __VLS_309({
        type: "info",
        variant: "tonal",
        ...{ class: "text-center" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_309));
    __VLS_311.slots.default;
    const __VLS_312 = {}.VIcon;
    /** @type {[typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, ]} */ ;
    // @ts-ignore
    const __VLS_313 = __VLS_asFunctionalComponent(__VLS_312, new __VLS_312({
        size: "48",
        ...{ class: "mb-2" },
    }));
    const __VLS_314 = __VLS_313({
        size: "48",
        ...{ class: "mb-2" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_313));
    __VLS_315.slots.default;
    var __VLS_315;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "text-body-1" },
    });
    var __VLS_311;
}
var __VLS_288;
const __VLS_316 = {}.VWindowItem;
/** @type {[typeof __VLS_components.VWindowItem, typeof __VLS_components.vWindowItem, typeof __VLS_components.VWindowItem, typeof __VLS_components.vWindowItem, ]} */ ;
// @ts-ignore
const __VLS_317 = __VLS_asFunctionalComponent(__VLS_316, new __VLS_316({
    value: "players",
}));
const __VLS_318 = __VLS_317({
    value: "players",
}, ...__VLS_functionalComponentArgsRest(__VLS_317));
__VLS_319.slots.default;
const __VLS_320 = {}.VRow;
/** @type {[typeof __VLS_components.VRow, typeof __VLS_components.vRow, typeof __VLS_components.VRow, typeof __VLS_components.vRow, ]} */ ;
// @ts-ignore
const __VLS_321 = __VLS_asFunctionalComponent(__VLS_320, new __VLS_320({}));
const __VLS_322 = __VLS_321({}, ...__VLS_functionalComponentArgsRest(__VLS_321));
__VLS_323.slots.default;
const __VLS_324 = {}.VCol;
/** @type {[typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ]} */ ;
// @ts-ignore
const __VLS_325 = __VLS_asFunctionalComponent(__VLS_324, new __VLS_324({
    cols: "12",
    ...{ class: "d-flex align-end flex-column" },
}));
const __VLS_326 = __VLS_325({
    cols: "12",
    ...{ class: "d-flex align-end flex-column" },
}, ...__VLS_functionalComponentArgsRest(__VLS_325));
__VLS_327.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
    ...{ class: "pb-3 font-weight-bold" },
});
const __VLS_328 = {}.VBtn;
/** @type {[typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ]} */ ;
// @ts-ignore
const __VLS_329 = __VLS_asFunctionalComponent(__VLS_328, new __VLS_328({
    ...{ 'onClick': {} },
    icon: true,
    size: "medium",
    variant: "text",
}));
const __VLS_330 = __VLS_329({
    ...{ 'onClick': {} },
    icon: true,
    size: "medium",
    variant: "text",
}, ...__VLS_functionalComponentArgsRest(__VLS_329));
let __VLS_332;
let __VLS_333;
let __VLS_334;
const __VLS_335 = {
    onClick: (__VLS_ctx.refreshPlayers)
};
__VLS_331.slots.default;
const __VLS_336 = {}.VIcon;
/** @type {[typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, ]} */ ;
// @ts-ignore
const __VLS_337 = __VLS_asFunctionalComponent(__VLS_336, new __VLS_336({
    ...{ class: "mb-1" },
    color: "white",
}));
const __VLS_338 = __VLS_337({
    ...{ class: "mb-1" },
    color: "white",
}, ...__VLS_functionalComponentArgsRest(__VLS_337));
__VLS_339.slots.default;
var __VLS_339;
var __VLS_331;
var __VLS_327;
for (const [player] of __VLS_getVForSourceType((__VLS_ctx.playersByEvent))) {
    const __VLS_340 = {}.VCol;
    /** @type {[typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ]} */ ;
    // @ts-ignore
    const __VLS_341 = __VLS_asFunctionalComponent(__VLS_340, new __VLS_340({
        cols: "12",
        key: (player.users_pk),
        ...{ class: "pa-1" },
    }));
    const __VLS_342 = __VLS_341({
        cols: "12",
        key: (player.users_pk),
        ...{ class: "pa-1" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_341));
    __VLS_343.slots.default;
    const __VLS_344 = {}.VCard;
    /** @type {[typeof __VLS_components.VCard, typeof __VLS_components.vCard, typeof __VLS_components.VCard, typeof __VLS_components.vCard, ]} */ ;
    // @ts-ignore
    const __VLS_345 = __VLS_asFunctionalComponent(__VLS_344, new __VLS_344({
        ...{ class: "player-card mb-3" },
        rounded: "lg",
        elevation: "10",
    }));
    const __VLS_346 = __VLS_345({
        ...{ class: "player-card mb-3" },
        rounded: "lg",
        elevation: "10",
    }, ...__VLS_functionalComponentArgsRest(__VLS_345));
    __VLS_347.slots.default;
    const __VLS_348 = {}.VRow;
    /** @type {[typeof __VLS_components.VRow, typeof __VLS_components.vRow, typeof __VLS_components.VRow, typeof __VLS_components.vRow, ]} */ ;
    // @ts-ignore
    const __VLS_349 = __VLS_asFunctionalComponent(__VLS_348, new __VLS_348({
        noGutters: true,
    }));
    const __VLS_350 = __VLS_349({
        noGutters: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_349));
    __VLS_351.slots.default;
    const __VLS_352 = {}.VCol;
    /** @type {[typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ]} */ ;
    // @ts-ignore
    const __VLS_353 = __VLS_asFunctionalComponent(__VLS_352, new __VLS_352({
        cols: "4",
        lg: "1",
        ...{ class: "d-flex" },
    }));
    const __VLS_354 = __VLS_353({
        cols: "4",
        lg: "1",
        ...{ class: "d-flex" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_353));
    __VLS_355.slots.default;
    const __VLS_356 = {}.VImg;
    /** @type {[typeof __VLS_components.VImg, typeof __VLS_components.vImg, ]} */ ;
    // @ts-ignore
    const __VLS_357 = __VLS_asFunctionalComponent(__VLS_356, new __VLS_356({
        src: (player.picture_hash
            ? `https://assets.drunagor.app/Profile/${player.picture_hash}`
            : 'https://s3.us-east-2.amazonaws.com/assets.drunagor.app/Profile/user.png'),
        alt: "Player Image",
        maxWidth: "90",
        maxHeight: "90",
        ...{ class: "rounded-lg" },
    }));
    const __VLS_358 = __VLS_357({
        src: (player.picture_hash
            ? `https://assets.drunagor.app/Profile/${player.picture_hash}`
            : 'https://s3.us-east-2.amazonaws.com/assets.drunagor.app/Profile/user.png'),
        alt: "Player Image",
        maxWidth: "90",
        maxHeight: "90",
        ...{ class: "rounded-lg" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_357));
    var __VLS_355;
    const __VLS_360 = {}.VCol;
    /** @type {[typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ]} */ ;
    // @ts-ignore
    const __VLS_361 = __VLS_asFunctionalComponent(__VLS_360, new __VLS_360({
        cols: "8",
        ...{ class: "pl-3 d-flex flex-column justify-center" },
    }));
    const __VLS_362 = __VLS_361({
        cols: "8",
        ...{ class: "pl-3 d-flex flex-column justify-center" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_361));
    __VLS_363.slots.default;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
        ...{ class: "font-weight-bold text-truncate" },
    });
    (player.user_name);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
        ...{ class: "text-caption" },
    });
    (player.event_status);
    if (player.status_date) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
            ...{ class: "text-caption grey--text" },
        });
        (__VLS_ctx.formatEventDate(player.status_date, __VLS_ctx.userTimezone));
    }
    var __VLS_363;
    const __VLS_364 = {}.VCol;
    /** @type {[typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ]} */ ;
    // @ts-ignore
    const __VLS_365 = __VLS_asFunctionalComponent(__VLS_364, new __VLS_364({
        cols: "12",
        md: "3",
        ...{ class: "d-flex flex-column" },
    }));
    const __VLS_366 = __VLS_365({
        cols: "12",
        md: "3",
        ...{ class: "d-flex flex-column" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_365));
    __VLS_367.slots.default;
    if (player.event_status === 'Granted Passage') {
        const __VLS_368 = {}.VBtn;
        /** @type {[typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ]} */ ;
        // @ts-ignore
        const __VLS_369 = __VLS_asFunctionalComponent(__VLS_368, new __VLS_368({
            ...{ 'onClick': {} },
            color: "deep-purple",
            size: "x-small",
            ...{ class: "mt-2 mt-md-0 pa-0" },
            block: true,
        }));
        const __VLS_370 = __VLS_369({
            ...{ 'onClick': {} },
            color: "deep-purple",
            size: "x-small",
            ...{ class: "mt-2 mt-md-0 pa-0" },
            block: true,
        }, ...__VLS_functionalComponentArgsRest(__VLS_369));
        let __VLS_372;
        let __VLS_373;
        let __VLS_374;
        const __VLS_375 = {
            onClick: (...[$event]) => {
                if (!(player.event_status === 'Granted Passage'))
                    return;
                __VLS_ctx.updatePlayerStatus(player, __VLS_ctx.JoinedtheQuest);
            }
        };
        __VLS_371.slots.default;
        const __VLS_376 = {}.VIcon;
        /** @type {[typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, ]} */ ;
        // @ts-ignore
        const __VLS_377 = __VLS_asFunctionalComponent(__VLS_376, new __VLS_376({
            start: true,
        }));
        const __VLS_378 = __VLS_377({
            start: true,
        }, ...__VLS_functionalComponentArgsRest(__VLS_377));
        __VLS_379.slots.default;
        var __VLS_379;
        var __VLS_371;
        const __VLS_380 = {}.VBtn;
        /** @type {[typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ]} */ ;
        // @ts-ignore
        const __VLS_381 = __VLS_asFunctionalComponent(__VLS_380, new __VLS_380({
            ...{ 'onClick': {} },
            color: "red",
            size: "x-small",
            ...{ class: "mt-2" },
            block: true,
        }));
        const __VLS_382 = __VLS_381({
            ...{ 'onClick': {} },
            color: "red",
            size: "x-small",
            ...{ class: "mt-2" },
            block: true,
        }, ...__VLS_functionalComponentArgsRest(__VLS_381));
        let __VLS_384;
        let __VLS_385;
        let __VLS_386;
        const __VLS_387 = {
            onClick: (...[$event]) => {
                if (!(player.event_status === 'Granted Passage'))
                    return;
                __VLS_ctx.updatePlayerStatus(player, __VLS_ctx.turnedAwayStatus);
            }
        };
        __VLS_383.slots.default;
        const __VLS_388 = {}.VIcon;
        /** @type {[typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, ]} */ ;
        // @ts-ignore
        const __VLS_389 = __VLS_asFunctionalComponent(__VLS_388, new __VLS_388({
            start: true,
        }));
        const __VLS_390 = __VLS_389({
            start: true,
        }, ...__VLS_functionalComponentArgsRest(__VLS_389));
        __VLS_391.slots.default;
        var __VLS_391;
        var __VLS_383;
    }
    else if (player.event_status === 'Joined the Quest') {
        const __VLS_392 = {}.VRow;
        /** @type {[typeof __VLS_components.VRow, typeof __VLS_components.vRow, typeof __VLS_components.VRow, typeof __VLS_components.vRow, ]} */ ;
        // @ts-ignore
        const __VLS_393 = __VLS_asFunctionalComponent(__VLS_392, new __VLS_392({
            noGutters: true,
            ...{ class: "fill-height" },
            align: "center",
            justify: "center",
        }));
        const __VLS_394 = __VLS_393({
            noGutters: true,
            ...{ class: "fill-height" },
            align: "center",
            justify: "center",
        }, ...__VLS_functionalComponentArgsRest(__VLS_393));
        __VLS_395.slots.default;
        const __VLS_396 = {}.VChip;
        /** @type {[typeof __VLS_components.VChip, typeof __VLS_components.vChip, typeof __VLS_components.VChip, typeof __VLS_components.vChip, ]} */ ;
        // @ts-ignore
        const __VLS_397 = __VLS_asFunctionalComponent(__VLS_396, new __VLS_396({
            color: "yellow",
            textColor: "black",
            ...{ class: "ma-1" },
            label: true,
        }));
        const __VLS_398 = __VLS_397({
            color: "yellow",
            textColor: "black",
            ...{ class: "ma-1" },
            label: true,
        }, ...__VLS_functionalComponentArgsRest(__VLS_397));
        __VLS_399.slots.default;
        const __VLS_400 = {}.VIcon;
        /** @type {[typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, ]} */ ;
        // @ts-ignore
        const __VLS_401 = __VLS_asFunctionalComponent(__VLS_400, new __VLS_400({
            start: true,
        }));
        const __VLS_402 = __VLS_401({
            start: true,
        }, ...__VLS_functionalComponentArgsRest(__VLS_401));
        __VLS_403.slots.default;
        var __VLS_403;
        var __VLS_399;
        var __VLS_395;
    }
    else if (player.event_status === 'Turned Away') {
        const __VLS_404 = {}.VRow;
        /** @type {[typeof __VLS_components.VRow, typeof __VLS_components.vRow, typeof __VLS_components.VRow, typeof __VLS_components.vRow, ]} */ ;
        // @ts-ignore
        const __VLS_405 = __VLS_asFunctionalComponent(__VLS_404, new __VLS_404({
            noGutters: true,
            ...{ class: "fill-height" },
            align: "center",
            justify: "center",
        }));
        const __VLS_406 = __VLS_405({
            noGutters: true,
            ...{ class: "fill-height" },
            align: "center",
            justify: "center",
        }, ...__VLS_functionalComponentArgsRest(__VLS_405));
        __VLS_407.slots.default;
        const __VLS_408 = {}.VBtn;
        /** @type {[typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ]} */ ;
        // @ts-ignore
        const __VLS_409 = __VLS_asFunctionalComponent(__VLS_408, new __VLS_408({
            icon: true,
            disabled: true,
            ...{ class: "ma-0 pa-0" },
        }));
        const __VLS_410 = __VLS_409({
            icon: true,
            disabled: true,
            ...{ class: "ma-0 pa-0" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_409));
        __VLS_411.slots.default;
        const __VLS_412 = {}.VIcon;
        /** @type {[typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, ]} */ ;
        // @ts-ignore
        const __VLS_413 = __VLS_asFunctionalComponent(__VLS_412, new __VLS_412({
            color: "red",
            size: "24",
        }));
        const __VLS_414 = __VLS_413({
            color: "red",
            size: "24",
        }, ...__VLS_functionalComponentArgsRest(__VLS_413));
        __VLS_415.slots.default;
        var __VLS_415;
        var __VLS_411;
        var __VLS_407;
    }
    else {
        const __VLS_416 = {}.VBtn;
        /** @type {[typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ]} */ ;
        // @ts-ignore
        const __VLS_417 = __VLS_asFunctionalComponent(__VLS_416, new __VLS_416({
            ...{ 'onClick': {} },
            color: "green",
            size: "x-small",
            ...{ class: "mt-2" },
            block: true,
        }));
        const __VLS_418 = __VLS_417({
            ...{ 'onClick': {} },
            color: "green",
            size: "x-small",
            ...{ class: "mt-2" },
            block: true,
        }, ...__VLS_functionalComponentArgsRest(__VLS_417));
        let __VLS_420;
        let __VLS_421;
        let __VLS_422;
        const __VLS_423 = {
            onClick: (...[$event]) => {
                if (!!(player.event_status === 'Granted Passage'))
                    return;
                if (!!(player.event_status === 'Joined the Quest'))
                    return;
                if (!!(player.event_status === 'Turned Away'))
                    return;
                __VLS_ctx.updatePlayerStatus(player, __VLS_ctx.grantedStatus);
            }
        };
        __VLS_419.slots.default;
        const __VLS_424 = {}.VIcon;
        /** @type {[typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, ]} */ ;
        // @ts-ignore
        const __VLS_425 = __VLS_asFunctionalComponent(__VLS_424, new __VLS_424({
            start: true,
        }));
        const __VLS_426 = __VLS_425({
            start: true,
        }, ...__VLS_functionalComponentArgsRest(__VLS_425));
        __VLS_427.slots.default;
        var __VLS_427;
        var __VLS_419;
        const __VLS_428 = {}.VBtn;
        /** @type {[typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ]} */ ;
        // @ts-ignore
        const __VLS_429 = __VLS_asFunctionalComponent(__VLS_428, new __VLS_428({
            ...{ 'onClick': {} },
            color: "red",
            size: "x-small",
            ...{ class: "mt-2" },
            block: true,
        }));
        const __VLS_430 = __VLS_429({
            ...{ 'onClick': {} },
            color: "red",
            size: "x-small",
            ...{ class: "mt-2" },
            block: true,
        }, ...__VLS_functionalComponentArgsRest(__VLS_429));
        let __VLS_432;
        let __VLS_433;
        let __VLS_434;
        const __VLS_435 = {
            onClick: (...[$event]) => {
                if (!!(player.event_status === 'Granted Passage'))
                    return;
                if (!!(player.event_status === 'Joined the Quest'))
                    return;
                if (!!(player.event_status === 'Turned Away'))
                    return;
                __VLS_ctx.updatePlayerStatus(player, __VLS_ctx.turnedAwayStatus);
            }
        };
        __VLS_431.slots.default;
        const __VLS_436 = {}.VIcon;
        /** @type {[typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, ]} */ ;
        // @ts-ignore
        const __VLS_437 = __VLS_asFunctionalComponent(__VLS_436, new __VLS_436({
            start: true,
        }));
        const __VLS_438 = __VLS_437({
            start: true,
        }, ...__VLS_functionalComponentArgsRest(__VLS_437));
        __VLS_439.slots.default;
        var __VLS_439;
        var __VLS_431;
    }
    var __VLS_367;
    var __VLS_351;
    var __VLS_347;
    var __VLS_343;
}
if (__VLS_ctx.totalPages > 1) {
    const __VLS_440 = {}.VCol;
    /** @type {[typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ]} */ ;
    // @ts-ignore
    const __VLS_441 = __VLS_asFunctionalComponent(__VLS_440, new __VLS_440({
        cols: "12",
        ...{ class: "d-flex justify-center" },
    }));
    const __VLS_442 = __VLS_441({
        cols: "12",
        ...{ class: "d-flex justify-center" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_441));
    __VLS_443.slots.default;
    const __VLS_444 = {}.VPagination;
    /** @type {[typeof __VLS_components.VPagination, typeof __VLS_components.vPagination, ]} */ ;
    // @ts-ignore
    const __VLS_445 = __VLS_asFunctionalComponent(__VLS_444, new __VLS_444({
        modelValue: (__VLS_ctx.currentPage),
        length: (__VLS_ctx.totalPages),
    }));
    const __VLS_446 = __VLS_445({
        modelValue: (__VLS_ctx.currentPage),
        length: (__VLS_ctx.totalPages),
    }, ...__VLS_functionalComponentArgsRest(__VLS_445));
    var __VLS_443;
}
var __VLS_323;
var __VLS_319;
var __VLS_76;
var __VLS_72;
var __VLS_12;
const __VLS_448 = {}.VDialog;
/** @type {[typeof __VLS_components.VDialog, typeof __VLS_components.vDialog, typeof __VLS_components.VDialog, typeof __VLS_components.vDialog, ]} */ ;
// @ts-ignore
const __VLS_449 = __VLS_asFunctionalComponent(__VLS_448, new __VLS_448({
    modelValue: (__VLS_ctx.qrCodeDialog),
    maxWidth: "500",
    fullscreen: (__VLS_ctx.smAndDown),
    persistent: true,
}));
const __VLS_450 = __VLS_449({
    modelValue: (__VLS_ctx.qrCodeDialog),
    maxWidth: "500",
    fullscreen: (__VLS_ctx.smAndDown),
    persistent: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_449));
__VLS_451.slots.default;
const __VLS_452 = {}.VCard;
/** @type {[typeof __VLS_components.VCard, typeof __VLS_components.vCard, typeof __VLS_components.VCard, typeof __VLS_components.vCard, ]} */ ;
// @ts-ignore
const __VLS_453 = __VLS_asFunctionalComponent(__VLS_452, new __VLS_452({
    color: "surface",
}));
const __VLS_454 = __VLS_453({
    color: "surface",
}, ...__VLS_functionalComponentArgsRest(__VLS_453));
__VLS_455.slots.default;
if (__VLS_ctx.generatingQR) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "dialog-overlay" },
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
const __VLS_460 = {}.VCardTitle;
/** @type {[typeof __VLS_components.VCardTitle, typeof __VLS_components.vCardTitle, typeof __VLS_components.VCardTitle, typeof __VLS_components.vCardTitle, ]} */ ;
// @ts-ignore
const __VLS_461 = __VLS_asFunctionalComponent(__VLS_460, new __VLS_460({
    ...{ class: "d-flex justify-space-between align-center" },
}));
const __VLS_462 = __VLS_461({
    ...{ class: "d-flex justify-space-between align-center" },
}, ...__VLS_functionalComponentArgsRest(__VLS_461));
__VLS_463.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "text-h6" },
});
(__VLS_ctx.selectedTable?.table_number);
const __VLS_464 = {}.VBtn;
/** @type {[typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ]} */ ;
// @ts-ignore
const __VLS_465 = __VLS_asFunctionalComponent(__VLS_464, new __VLS_464({
    ...{ 'onClick': {} },
    icon: true,
    variant: "text",
}));
const __VLS_466 = __VLS_465({
    ...{ 'onClick': {} },
    icon: true,
    variant: "text",
}, ...__VLS_functionalComponentArgsRest(__VLS_465));
let __VLS_468;
let __VLS_469;
let __VLS_470;
const __VLS_471 = {
    onClick: (...[$event]) => {
        __VLS_ctx.qrCodeDialog = false;
    }
};
__VLS_467.slots.default;
const __VLS_472 = {}.VIcon;
/** @type {[typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, ]} */ ;
// @ts-ignore
const __VLS_473 = __VLS_asFunctionalComponent(__VLS_472, new __VLS_472({}));
const __VLS_474 = __VLS_473({}, ...__VLS_functionalComponentArgsRest(__VLS_473));
__VLS_475.slots.default;
var __VLS_475;
var __VLS_467;
var __VLS_463;
const __VLS_476 = {}.VCardText;
/** @type {[typeof __VLS_components.VCardText, typeof __VLS_components.vCardText, typeof __VLS_components.VCardText, typeof __VLS_components.vCardText, ]} */ ;
// @ts-ignore
const __VLS_477 = __VLS_asFunctionalComponent(__VLS_476, new __VLS_476({
    ...{ class: "text-center" },
}));
const __VLS_478 = __VLS_477({
    ...{ class: "text-center" },
}, ...__VLS_functionalComponentArgsRest(__VLS_477));
__VLS_479.slots.default;
if (__VLS_ctx.qrCodeData) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "qr-code-container pa-6 mb-4" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ref: "qrCanvasWrap",
        ...{ class: "d-flex justify-center" },
    });
    /** @type {typeof __VLS_ctx.qrCanvasWrap} */ ;
    const __VLS_480 = {}.QrcodeVue;
    /** @type {[typeof __VLS_components.QrcodeVue, ]} */ ;
    // @ts-ignore
    const __VLS_481 = __VLS_asFunctionalComponent(__VLS_480, new __VLS_480({
        value: (__VLS_ctx.qrCodeData.code),
        size: (__VLS_ctx.qrCanvasSize),
        level: "H",
        renderAs: "canvas",
    }));
    const __VLS_482 = __VLS_481({
        value: (__VLS_ctx.qrCodeData.code),
        size: (__VLS_ctx.qrCanvasSize),
        level: "H",
        renderAs: "canvas",
    }, ...__VLS_functionalComponentArgsRest(__VLS_481));
}
if (__VLS_ctx.qrCodeData) {
    const __VLS_484 = {}.VAlert;
    /** @type {[typeof __VLS_components.VAlert, typeof __VLS_components.vAlert, typeof __VLS_components.VAlert, typeof __VLS_components.vAlert, ]} */ ;
    // @ts-ignore
    const __VLS_485 = __VLS_asFunctionalComponent(__VLS_484, new __VLS_484({
        type: "success",
        variant: "tonal",
        ...{ class: "mb-4" },
    }));
    const __VLS_486 = __VLS_485({
        type: "success",
        variant: "tonal",
        ...{ class: "mb-4" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_485));
    __VLS_487.slots.default;
    var __VLS_487;
}
const __VLS_488 = {}.VBtn;
/** @type {[typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ]} */ ;
// @ts-ignore
const __VLS_489 = __VLS_asFunctionalComponent(__VLS_488, new __VLS_488({
    ...{ 'onClick': {} },
    block: true,
    color: "primary",
    size: "large",
    ...{ class: "mb-4" },
    disabled: (!__VLS_ctx.qrCodeData),
    loading: (__VLS_ctx.downloadingPdf),
}));
const __VLS_490 = __VLS_489({
    ...{ 'onClick': {} },
    block: true,
    color: "primary",
    size: "large",
    ...{ class: "mb-4" },
    disabled: (!__VLS_ctx.qrCodeData),
    loading: (__VLS_ctx.downloadingPdf),
}, ...__VLS_functionalComponentArgsRest(__VLS_489));
let __VLS_492;
let __VLS_493;
let __VLS_494;
const __VLS_495 = {
    onClick: (__VLS_ctx.downloadQrPdf)
};
__VLS_491.slots.default;
const __VLS_496 = {}.VIcon;
/** @type {[typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, ]} */ ;
// @ts-ignore
const __VLS_497 = __VLS_asFunctionalComponent(__VLS_496, new __VLS_496({
    start: true,
}));
const __VLS_498 = __VLS_497({
    start: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_497));
__VLS_499.slots.default;
var __VLS_499;
var __VLS_491;
const __VLS_500 = {}.VBtn;
/** @type {[typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ]} */ ;
// @ts-ignore
const __VLS_501 = __VLS_asFunctionalComponent(__VLS_500, new __VLS_500({
    ...{ 'onClick': {} },
    block: true,
    color: "secondary",
    size: "large",
    ...{ class: "mb-4" },
}));
const __VLS_502 = __VLS_501({
    ...{ 'onClick': {} },
    block: true,
    color: "secondary",
    size: "large",
    ...{ class: "mb-4" },
}, ...__VLS_functionalComponentArgsRest(__VLS_501));
let __VLS_504;
let __VLS_505;
let __VLS_506;
const __VLS_507 = {
    onClick: (__VLS_ctx.showTablePlayers)
};
__VLS_503.slots.default;
const __VLS_508 = {}.VIcon;
/** @type {[typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, ]} */ ;
// @ts-ignore
const __VLS_509 = __VLS_asFunctionalComponent(__VLS_508, new __VLS_508({
    start: true,
}));
const __VLS_510 = __VLS_509({
    start: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_509));
__VLS_511.slots.default;
var __VLS_511;
(__VLS_ctx.tablePlayers.length);
var __VLS_503;
const __VLS_512 = {}.VExpandTransition;
/** @type {[typeof __VLS_components.VExpandTransition, typeof __VLS_components.vExpandTransition, typeof __VLS_components.VExpandTransition, typeof __VLS_components.vExpandTransition, ]} */ ;
// @ts-ignore
const __VLS_513 = __VLS_asFunctionalComponent(__VLS_512, new __VLS_512({}));
const __VLS_514 = __VLS_513({}, ...__VLS_functionalComponentArgsRest(__VLS_513));
__VLS_515.slots.default;
if (__VLS_ctx.showPlayers) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
    const __VLS_516 = {}.VDivider;
    /** @type {[typeof __VLS_components.VDivider, typeof __VLS_components.vDivider, ]} */ ;
    // @ts-ignore
    const __VLS_517 = __VLS_asFunctionalComponent(__VLS_516, new __VLS_516({
        ...{ class: "mb-4" },
    }));
    const __VLS_518 = __VLS_517({
        ...{ class: "mb-4" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_517));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.h4, __VLS_intrinsicElements.h4)({
        ...{ class: "text-left mb-3" },
    });
    if (__VLS_ctx.loadingTablePlayers) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "text-center py-4" },
        });
        const __VLS_520 = {}.VProgressCircular;
        /** @type {[typeof __VLS_components.VProgressCircular, typeof __VLS_components.vProgressCircular, ]} */ ;
        // @ts-ignore
        const __VLS_521 = __VLS_asFunctionalComponent(__VLS_520, new __VLS_520({
            indeterminate: true,
            color: "primary",
            size: "40",
        }));
        const __VLS_522 = __VLS_521({
            indeterminate: true,
            color: "primary",
            size: "40",
        }, ...__VLS_functionalComponentArgsRest(__VLS_521));
    }
    else if (__VLS_ctx.tablePlayers.length === 0) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "text-center text-grey py-4" },
        });
    }
    else {
        const __VLS_524 = {}.VList;
        /** @type {[typeof __VLS_components.VList, typeof __VLS_components.vList, typeof __VLS_components.VList, typeof __VLS_components.vList, ]} */ ;
        // @ts-ignore
        const __VLS_525 = __VLS_asFunctionalComponent(__VLS_524, new __VLS_524({
            ...{ class: "transparent" },
        }));
        const __VLS_526 = __VLS_525({
            ...{ class: "transparent" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_525));
        __VLS_527.slots.default;
        for (const [player] of __VLS_getVForSourceType((__VLS_ctx.tablePlayers))) {
            const __VLS_528 = {}.VListItem;
            /** @type {[typeof __VLS_components.VListItem, typeof __VLS_components.vListItem, typeof __VLS_components.VListItem, typeof __VLS_components.vListItem, ]} */ ;
            // @ts-ignore
            const __VLS_529 = __VLS_asFunctionalComponent(__VLS_528, new __VLS_528({
                key: (player.users_pk),
                ...{ class: "mb-2 rounded-lg" },
                elevation: "2",
            }));
            const __VLS_530 = __VLS_529({
                key: (player.users_pk),
                ...{ class: "mb-2 rounded-lg" },
                elevation: "2",
            }, ...__VLS_functionalComponentArgsRest(__VLS_529));
            __VLS_531.slots.default;
            {
                const { prepend: __VLS_thisSlot } = __VLS_531.slots;
                const __VLS_532 = {}.VAvatar;
                /** @type {[typeof __VLS_components.VAvatar, typeof __VLS_components.vAvatar, typeof __VLS_components.VAvatar, typeof __VLS_components.vAvatar, ]} */ ;
                // @ts-ignore
                const __VLS_533 = __VLS_asFunctionalComponent(__VLS_532, new __VLS_532({
                    size: "40",
                }));
                const __VLS_534 = __VLS_533({
                    size: "40",
                }, ...__VLS_functionalComponentArgsRest(__VLS_533));
                __VLS_535.slots.default;
                const __VLS_536 = {}.VImg;
                /** @type {[typeof __VLS_components.VImg, typeof __VLS_components.vImg, ]} */ ;
                // @ts-ignore
                const __VLS_537 = __VLS_asFunctionalComponent(__VLS_536, new __VLS_536({
                    src: (player.picture_hash
                        ? `https://assets.drunagor.app/Profile/${player.picture_hash}`
                        : 'https://s3.us-east-2.amazonaws.com/assets.drunagor.app/Profile/user.png'),
                }));
                const __VLS_538 = __VLS_537({
                    src: (player.picture_hash
                        ? `https://assets.drunagor.app/Profile/${player.picture_hash}`
                        : 'https://s3.us-east-2.amazonaws.com/assets.drunagor.app/Profile/user.png'),
                }, ...__VLS_functionalComponentArgsRest(__VLS_537));
                var __VLS_535;
            }
            const __VLS_540 = {}.VListItemTitle;
            /** @type {[typeof __VLS_components.VListItemTitle, typeof __VLS_components.vListItemTitle, typeof __VLS_components.VListItemTitle, typeof __VLS_components.vListItemTitle, ]} */ ;
            // @ts-ignore
            const __VLS_541 = __VLS_asFunctionalComponent(__VLS_540, new __VLS_540({}));
            const __VLS_542 = __VLS_541({}, ...__VLS_functionalComponentArgsRest(__VLS_541));
            __VLS_543.slots.default;
            (player.user_name);
            var __VLS_543;
            if (player.party_role) {
                const __VLS_544 = {}.VListItemSubtitle;
                /** @type {[typeof __VLS_components.VListItemSubtitle, typeof __VLS_components.vListItemSubtitle, typeof __VLS_components.VListItemSubtitle, typeof __VLS_components.vListItemSubtitle, ]} */ ;
                // @ts-ignore
                const __VLS_545 = __VLS_asFunctionalComponent(__VLS_544, new __VLS_544({}));
                const __VLS_546 = __VLS_545({}, ...__VLS_functionalComponentArgsRest(__VLS_545));
                __VLS_547.slots.default;
                (player.party_role);
                var __VLS_547;
            }
            var __VLS_531;
        }
        var __VLS_527;
    }
}
var __VLS_515;
var __VLS_479;
var __VLS_455;
var __VLS_451;
const __VLS_548 = {}.VDialog;
/** @type {[typeof __VLS_components.VDialog, typeof __VLS_components.vDialog, typeof __VLS_components.VDialog, typeof __VLS_components.vDialog, ]} */ ;
// @ts-ignore
const __VLS_549 = __VLS_asFunctionalComponent(__VLS_548, new __VLS_548({
    modelValue: (__VLS_ctx.setupDialog),
    maxWidth: "1400",
    fullscreen: (__VLS_ctx.smAndDown),
}));
const __VLS_550 = __VLS_549({
    modelValue: (__VLS_ctx.setupDialog),
    maxWidth: "1400",
    fullscreen: (__VLS_ctx.smAndDown),
}, ...__VLS_functionalComponentArgsRest(__VLS_549));
__VLS_551.slots.default;
const __VLS_552 = {}.VCard;
/** @type {[typeof __VLS_components.VCard, typeof __VLS_components.vCard, typeof __VLS_components.VCard, typeof __VLS_components.vCard, ]} */ ;
// @ts-ignore
const __VLS_553 = __VLS_asFunctionalComponent(__VLS_552, new __VLS_552({
    color: "surface",
}));
const __VLS_554 = __VLS_553({
    color: "surface",
}, ...__VLS_functionalComponentArgsRest(__VLS_553));
__VLS_555.slots.default;
const __VLS_556 = {}.VCardTitle;
/** @type {[typeof __VLS_components.VCardTitle, typeof __VLS_components.vCardTitle, typeof __VLS_components.VCardTitle, typeof __VLS_components.vCardTitle, ]} */ ;
// @ts-ignore
const __VLS_557 = __VLS_asFunctionalComponent(__VLS_556, new __VLS_556({
    ...{ class: "d-flex justify-space-between align-center" },
}));
const __VLS_558 = __VLS_557({
    ...{ class: "d-flex justify-space-between align-center" },
}, ...__VLS_functionalComponentArgsRest(__VLS_557));
__VLS_559.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "text-h6" },
});
const __VLS_560 = {}.VIcon;
/** @type {[typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, ]} */ ;
// @ts-ignore
const __VLS_561 = __VLS_asFunctionalComponent(__VLS_560, new __VLS_560({
    ...{ class: "mr-2" },
}));
const __VLS_562 = __VLS_561({
    ...{ class: "mr-2" },
}, ...__VLS_functionalComponentArgsRest(__VLS_561));
__VLS_563.slots.default;
var __VLS_563;
(__VLS_ctx.event?.scenario);
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "d-flex align-center gap-2" },
});
const __VLS_564 = {}.VBtn;
/** @type {[typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ]} */ ;
// @ts-ignore
const __VLS_565 = __VLS_asFunctionalComponent(__VLS_564, new __VLS_564({
    ...{ 'onClick': {} },
    icon: true,
    size: "small",
    variant: "text",
    disabled: (__VLS_ctx.zoomLevel <= 1),
}));
const __VLS_566 = __VLS_565({
    ...{ 'onClick': {} },
    icon: true,
    size: "small",
    variant: "text",
    disabled: (__VLS_ctx.zoomLevel <= 1),
}, ...__VLS_functionalComponentArgsRest(__VLS_565));
let __VLS_568;
let __VLS_569;
let __VLS_570;
const __VLS_571 = {
    onClick: (__VLS_ctx.zoomOut)
};
__VLS_567.slots.default;
const __VLS_572 = {}.VIcon;
/** @type {[typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, ]} */ ;
// @ts-ignore
const __VLS_573 = __VLS_asFunctionalComponent(__VLS_572, new __VLS_572({}));
const __VLS_574 = __VLS_573({}, ...__VLS_functionalComponentArgsRest(__VLS_573));
__VLS_575.slots.default;
var __VLS_575;
var __VLS_567;
const __VLS_576 = {}.VChip;
/** @type {[typeof __VLS_components.VChip, typeof __VLS_components.vChip, typeof __VLS_components.VChip, typeof __VLS_components.vChip, ]} */ ;
// @ts-ignore
const __VLS_577 = __VLS_asFunctionalComponent(__VLS_576, new __VLS_576({
    size: "small",
    variant: "flat",
}));
const __VLS_578 = __VLS_577({
    size: "small",
    variant: "flat",
}, ...__VLS_functionalComponentArgsRest(__VLS_577));
__VLS_579.slots.default;
(Math.round(__VLS_ctx.zoomLevel * 100));
var __VLS_579;
const __VLS_580 = {}.VBtn;
/** @type {[typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ]} */ ;
// @ts-ignore
const __VLS_581 = __VLS_asFunctionalComponent(__VLS_580, new __VLS_580({
    ...{ 'onClick': {} },
    icon: true,
    size: "small",
    variant: "text",
    disabled: (__VLS_ctx.zoomLevel >= 3),
}));
const __VLS_582 = __VLS_581({
    ...{ 'onClick': {} },
    icon: true,
    size: "small",
    variant: "text",
    disabled: (__VLS_ctx.zoomLevel >= 3),
}, ...__VLS_functionalComponentArgsRest(__VLS_581));
let __VLS_584;
let __VLS_585;
let __VLS_586;
const __VLS_587 = {
    onClick: (__VLS_ctx.zoomIn)
};
__VLS_583.slots.default;
const __VLS_588 = {}.VIcon;
/** @type {[typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, ]} */ ;
// @ts-ignore
const __VLS_589 = __VLS_asFunctionalComponent(__VLS_588, new __VLS_588({}));
const __VLS_590 = __VLS_589({}, ...__VLS_functionalComponentArgsRest(__VLS_589));
__VLS_591.slots.default;
var __VLS_591;
var __VLS_583;
if (__VLS_ctx.zoomLevel !== 1) {
    const __VLS_592 = {}.VBtn;
    /** @type {[typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ]} */ ;
    // @ts-ignore
    const __VLS_593 = __VLS_asFunctionalComponent(__VLS_592, new __VLS_592({
        ...{ 'onClick': {} },
        icon: true,
        size: "small",
        variant: "text",
    }));
    const __VLS_594 = __VLS_593({
        ...{ 'onClick': {} },
        icon: true,
        size: "small",
        variant: "text",
    }, ...__VLS_functionalComponentArgsRest(__VLS_593));
    let __VLS_596;
    let __VLS_597;
    let __VLS_598;
    const __VLS_599 = {
        onClick: (__VLS_ctx.resetZoom)
    };
    __VLS_595.slots.default;
    const __VLS_600 = {}.VIcon;
    /** @type {[typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, ]} */ ;
    // @ts-ignore
    const __VLS_601 = __VLS_asFunctionalComponent(__VLS_600, new __VLS_600({}));
    const __VLS_602 = __VLS_601({}, ...__VLS_functionalComponentArgsRest(__VLS_601));
    __VLS_603.slots.default;
    var __VLS_603;
    var __VLS_595;
}
const __VLS_604 = {}.VDivider;
/** @type {[typeof __VLS_components.VDivider, typeof __VLS_components.vDivider, ]} */ ;
// @ts-ignore
const __VLS_605 = __VLS_asFunctionalComponent(__VLS_604, new __VLS_604({
    vertical: true,
    ...{ class: "mx-2" },
}));
const __VLS_606 = __VLS_605({
    vertical: true,
    ...{ class: "mx-2" },
}, ...__VLS_functionalComponentArgsRest(__VLS_605));
const __VLS_608 = {}.VBtn;
/** @type {[typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ]} */ ;
// @ts-ignore
const __VLS_609 = __VLS_asFunctionalComponent(__VLS_608, new __VLS_608({
    ...{ 'onClick': {} },
    icon: true,
    variant: "text",
}));
const __VLS_610 = __VLS_609({
    ...{ 'onClick': {} },
    icon: true,
    variant: "text",
}, ...__VLS_functionalComponentArgsRest(__VLS_609));
let __VLS_612;
let __VLS_613;
let __VLS_614;
const __VLS_615 = {
    onClick: (...[$event]) => {
        __VLS_ctx.setupDialog = false;
    }
};
__VLS_611.slots.default;
const __VLS_616 = {}.VIcon;
/** @type {[typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, ]} */ ;
// @ts-ignore
const __VLS_617 = __VLS_asFunctionalComponent(__VLS_616, new __VLS_616({}));
const __VLS_618 = __VLS_617({}, ...__VLS_functionalComponentArgsRest(__VLS_617));
__VLS_619.slots.default;
var __VLS_619;
var __VLS_611;
var __VLS_559;
const __VLS_620 = {}.VCardText;
/** @type {[typeof __VLS_components.VCardText, typeof __VLS_components.vCardText, typeof __VLS_components.VCardText, typeof __VLS_components.vCardText, ]} */ ;
// @ts-ignore
const __VLS_621 = __VLS_asFunctionalComponent(__VLS_620, new __VLS_620({
    ...{ class: "pa-0 setup-dialog-content" },
}));
const __VLS_622 = __VLS_621({
    ...{ class: "pa-0 setup-dialog-content" },
}, ...__VLS_functionalComponentArgsRest(__VLS_621));
__VLS_623.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ onWheel: (__VLS_ctx.handleWheel) },
    ...{ onMousedown: (__VLS_ctx.startPan) },
    ...{ onMousemove: (__VLS_ctx.handlePan) },
    ...{ onMouseup: (__VLS_ctx.endPan) },
    ...{ onMouseleave: (__VLS_ctx.endPan) },
    ...{ onTouchstart: (__VLS_ctx.handleTouchStart) },
    ...{ onTouchmove: (__VLS_ctx.handleTouchMove) },
    ...{ onTouchend: (__VLS_ctx.handleTouchEnd) },
    ref: "imageContainer",
    ...{ class: "image-zoom-container" },
});
/** @type {typeof __VLS_ctx.imageContainer} */ ;
if (__VLS_ctx.event?.scenario && __VLS_ctx.setupDialog) {
    /** @type {[typeof InitialSetupViewer, ]} */ ;
    // @ts-ignore
    const __VLS_624 = __VLS_asFunctionalComponent(InitialSetupViewer, new InitialSetupViewer({
        scenario: (__VLS_ctx.event.scenario),
        ...{ style: ({
                transform: `translate(${__VLS_ctx.panX}px, ${__VLS_ctx.panY}px) scale(${__VLS_ctx.zoomLevel})`,
                transformOrigin: 'center center',
                transition: __VLS_ctx.isZooming ? 'none' : 'transform 0.1s ease-out',
                cursor: __VLS_ctx.zoomLevel > 1 ? (__VLS_ctx.isPanning ? 'grabbing' : 'grab') : 'default',
            }) },
    }));
    const __VLS_625 = __VLS_624({
        scenario: (__VLS_ctx.event.scenario),
        ...{ style: ({
                transform: `translate(${__VLS_ctx.panX}px, ${__VLS_ctx.panY}px) scale(${__VLS_ctx.zoomLevel})`,
                transformOrigin: 'center center',
                transition: __VLS_ctx.isZooming ? 'none' : 'transform 0.1s ease-out',
                cursor: __VLS_ctx.zoomLevel > 1 ? (__VLS_ctx.isPanning ? 'grabbing' : 'grab') : 'default',
            }) },
    }, ...__VLS_functionalComponentArgsRest(__VLS_624));
}
var __VLS_623;
var __VLS_555;
var __VLS_551;
const __VLS_627 = {}.VDialog;
/** @type {[typeof __VLS_components.VDialog, typeof __VLS_components.vDialog, typeof __VLS_components.VDialog, typeof __VLS_components.vDialog, ]} */ ;
// @ts-ignore
const __VLS_628 = __VLS_asFunctionalComponent(__VLS_627, new __VLS_627({
    modelValue: (__VLS_ctx.createTableDialog),
    maxWidth: "400",
}));
const __VLS_629 = __VLS_628({
    modelValue: (__VLS_ctx.createTableDialog),
    maxWidth: "400",
}, ...__VLS_functionalComponentArgsRest(__VLS_628));
__VLS_630.slots.default;
const __VLS_631 = {}.VCard;
/** @type {[typeof __VLS_components.VCard, typeof __VLS_components.vCard, typeof __VLS_components.VCard, typeof __VLS_components.vCard, ]} */ ;
// @ts-ignore
const __VLS_632 = __VLS_asFunctionalComponent(__VLS_631, new __VLS_631({
    color: "surface",
}));
const __VLS_633 = __VLS_632({
    color: "surface",
}, ...__VLS_functionalComponentArgsRest(__VLS_632));
__VLS_634.slots.default;
const __VLS_635 = {}.VCardTitle;
/** @type {[typeof __VLS_components.VCardTitle, typeof __VLS_components.vCardTitle, typeof __VLS_components.VCardTitle, typeof __VLS_components.vCardTitle, ]} */ ;
// @ts-ignore
const __VLS_636 = __VLS_asFunctionalComponent(__VLS_635, new __VLS_635({}));
const __VLS_637 = __VLS_636({}, ...__VLS_functionalComponentArgsRest(__VLS_636));
__VLS_638.slots.default;
var __VLS_638;
const __VLS_639 = {}.VCardText;
/** @type {[typeof __VLS_components.VCardText, typeof __VLS_components.vCardText, typeof __VLS_components.VCardText, typeof __VLS_components.vCardText, ]} */ ;
// @ts-ignore
const __VLS_640 = __VLS_asFunctionalComponent(__VLS_639, new __VLS_639({}));
const __VLS_641 = __VLS_640({}, ...__VLS_functionalComponentArgsRest(__VLS_640));
__VLS_642.slots.default;
const __VLS_643 = {}.VRow;
/** @type {[typeof __VLS_components.VRow, typeof __VLS_components.vRow, typeof __VLS_components.VRow, typeof __VLS_components.vRow, ]} */ ;
// @ts-ignore
const __VLS_644 = __VLS_asFunctionalComponent(__VLS_643, new __VLS_643({}));
const __VLS_645 = __VLS_644({}, ...__VLS_functionalComponentArgsRest(__VLS_644));
__VLS_646.slots.default;
const __VLS_647 = {}.VCol;
/** @type {[typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ]} */ ;
// @ts-ignore
const __VLS_648 = __VLS_asFunctionalComponent(__VLS_647, new __VLS_647({
    cols: "12",
}));
const __VLS_649 = __VLS_648({
    cols: "12",
}, ...__VLS_functionalComponentArgsRest(__VLS_648));
__VLS_650.slots.default;
const __VLS_651 = {}.VTextField;
/** @type {[typeof __VLS_components.VTextField, typeof __VLS_components.vTextField, ]} */ ;
// @ts-ignore
const __VLS_652 = __VLS_asFunctionalComponent(__VLS_651, new __VLS_651({
    modelValue: (__VLS_ctx.newTable.table_number),
    modelModifiers: { number: true, },
    label: "Table Number (optional)",
    type: "number",
    variant: "outlined",
    hint: "Leave empty to auto-generate",
}));
const __VLS_653 = __VLS_652({
    modelValue: (__VLS_ctx.newTable.table_number),
    modelModifiers: { number: true, },
    label: "Table Number (optional)",
    type: "number",
    variant: "outlined",
    hint: "Leave empty to auto-generate",
}, ...__VLS_functionalComponentArgsRest(__VLS_652));
var __VLS_650;
const __VLS_655 = {}.VCol;
/** @type {[typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ]} */ ;
// @ts-ignore
const __VLS_656 = __VLS_asFunctionalComponent(__VLS_655, new __VLS_655({
    cols: "12",
}));
const __VLS_657 = __VLS_656({
    cols: "12",
}, ...__VLS_functionalComponentArgsRest(__VLS_656));
__VLS_658.slots.default;
const __VLS_659 = {}.VTextField;
/** @type {[typeof __VLS_components.VTextField, typeof __VLS_components.vTextField, ]} */ ;
// @ts-ignore
const __VLS_660 = __VLS_asFunctionalComponent(__VLS_659, new __VLS_659({
    modelValue: (__VLS_ctx.newTable.max_players),
    modelModifiers: { number: true, },
    label: "Max Players",
    type: "number",
    variant: "outlined",
    rules: ([(v) => v > 0 || 'Must be greater than 0']),
}));
const __VLS_661 = __VLS_660({
    modelValue: (__VLS_ctx.newTable.max_players),
    modelModifiers: { number: true, },
    label: "Max Players",
    type: "number",
    variant: "outlined",
    rules: ([(v) => v > 0 || 'Must be greater than 0']),
}, ...__VLS_functionalComponentArgsRest(__VLS_660));
var __VLS_658;
var __VLS_646;
var __VLS_642;
const __VLS_663 = {}.VCardActions;
/** @type {[typeof __VLS_components.VCardActions, typeof __VLS_components.vCardActions, typeof __VLS_components.VCardActions, typeof __VLS_components.vCardActions, ]} */ ;
// @ts-ignore
const __VLS_664 = __VLS_asFunctionalComponent(__VLS_663, new __VLS_663({}));
const __VLS_665 = __VLS_664({}, ...__VLS_functionalComponentArgsRest(__VLS_664));
__VLS_666.slots.default;
const __VLS_667 = {}.VSpacer;
/** @type {[typeof __VLS_components.VSpacer, typeof __VLS_components.vSpacer, ]} */ ;
// @ts-ignore
const __VLS_668 = __VLS_asFunctionalComponent(__VLS_667, new __VLS_667({}));
const __VLS_669 = __VLS_668({}, ...__VLS_functionalComponentArgsRest(__VLS_668));
const __VLS_671 = {}.VBtn;
/** @type {[typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ]} */ ;
// @ts-ignore
const __VLS_672 = __VLS_asFunctionalComponent(__VLS_671, new __VLS_671({
    ...{ 'onClick': {} },
    color: "grey",
    variant: "text",
}));
const __VLS_673 = __VLS_672({
    ...{ 'onClick': {} },
    color: "grey",
    variant: "text",
}, ...__VLS_functionalComponentArgsRest(__VLS_672));
let __VLS_675;
let __VLS_676;
let __VLS_677;
const __VLS_678 = {
    onClick: (...[$event]) => {
        __VLS_ctx.createTableDialog = false;
    }
};
__VLS_674.slots.default;
var __VLS_674;
const __VLS_679 = {}.VBtn;
/** @type {[typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ]} */ ;
// @ts-ignore
const __VLS_680 = __VLS_asFunctionalComponent(__VLS_679, new __VLS_679({
    ...{ 'onClick': {} },
    loading: (__VLS_ctx.creatingTable),
}));
const __VLS_681 = __VLS_680({
    ...{ 'onClick': {} },
    loading: (__VLS_ctx.creatingTable),
}, ...__VLS_functionalComponentArgsRest(__VLS_680));
let __VLS_683;
let __VLS_684;
let __VLS_685;
const __VLS_686 = {
    onClick: (__VLS_ctx.createTable)
};
__VLS_682.slots.default;
var __VLS_682;
var __VLS_666;
var __VLS_634;
var __VLS_630;
const __VLS_687 = {}.VDialog;
/** @type {[typeof __VLS_components.VDialog, typeof __VLS_components.vDialog, typeof __VLS_components.VDialog, typeof __VLS_components.vDialog, ]} */ ;
// @ts-ignore
const __VLS_688 = __VLS_asFunctionalComponent(__VLS_687, new __VLS_687({
    modelValue: (__VLS_ctx.createMultipleTablesDialog),
    maxWidth: "400",
}));
const __VLS_689 = __VLS_688({
    modelValue: (__VLS_ctx.createMultipleTablesDialog),
    maxWidth: "400",
}, ...__VLS_functionalComponentArgsRest(__VLS_688));
__VLS_690.slots.default;
const __VLS_691 = {}.VCard;
/** @type {[typeof __VLS_components.VCard, typeof __VLS_components.vCard, typeof __VLS_components.VCard, typeof __VLS_components.vCard, ]} */ ;
// @ts-ignore
const __VLS_692 = __VLS_asFunctionalComponent(__VLS_691, new __VLS_691({
    color: "surface",
}));
const __VLS_693 = __VLS_692({
    color: "surface",
}, ...__VLS_functionalComponentArgsRest(__VLS_692));
__VLS_694.slots.default;
const __VLS_695 = {}.VCardTitle;
/** @type {[typeof __VLS_components.VCardTitle, typeof __VLS_components.vCardTitle, typeof __VLS_components.VCardTitle, typeof __VLS_components.vCardTitle, ]} */ ;
// @ts-ignore
const __VLS_696 = __VLS_asFunctionalComponent(__VLS_695, new __VLS_695({}));
const __VLS_697 = __VLS_696({}, ...__VLS_functionalComponentArgsRest(__VLS_696));
__VLS_698.slots.default;
var __VLS_698;
const __VLS_699 = {}.VCardText;
/** @type {[typeof __VLS_components.VCardText, typeof __VLS_components.vCardText, typeof __VLS_components.VCardText, typeof __VLS_components.vCardText, ]} */ ;
// @ts-ignore
const __VLS_700 = __VLS_asFunctionalComponent(__VLS_699, new __VLS_699({}));
const __VLS_701 = __VLS_700({}, ...__VLS_functionalComponentArgsRest(__VLS_700));
__VLS_702.slots.default;
const __VLS_703 = {}.VRow;
/** @type {[typeof __VLS_components.VRow, typeof __VLS_components.vRow, typeof __VLS_components.VRow, typeof __VLS_components.vRow, ]} */ ;
// @ts-ignore
const __VLS_704 = __VLS_asFunctionalComponent(__VLS_703, new __VLS_703({}));
const __VLS_705 = __VLS_704({}, ...__VLS_functionalComponentArgsRest(__VLS_704));
__VLS_706.slots.default;
const __VLS_707 = {}.VCol;
/** @type {[typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ]} */ ;
// @ts-ignore
const __VLS_708 = __VLS_asFunctionalComponent(__VLS_707, new __VLS_707({
    cols: "12",
}));
const __VLS_709 = __VLS_708({
    cols: "12",
}, ...__VLS_functionalComponentArgsRest(__VLS_708));
__VLS_710.slots.default;
const __VLS_711 = {}.VTextField;
/** @type {[typeof __VLS_components.VTextField, typeof __VLS_components.vTextField, ]} */ ;
// @ts-ignore
const __VLS_712 = __VLS_asFunctionalComponent(__VLS_711, new __VLS_711({
    modelValue: (__VLS_ctx.multipleTables.quantity),
    modelModifiers: { number: true, },
    label: "Number of Tables",
    type: "number",
    variant: "outlined",
    rules: ([(v) => (v > 0 && v <= 50) || 'Between 1 and 50']),
}));
const __VLS_713 = __VLS_712({
    modelValue: (__VLS_ctx.multipleTables.quantity),
    modelModifiers: { number: true, },
    label: "Number of Tables",
    type: "number",
    variant: "outlined",
    rules: ([(v) => (v > 0 && v <= 50) || 'Between 1 and 50']),
}, ...__VLS_functionalComponentArgsRest(__VLS_712));
var __VLS_710;
const __VLS_715 = {}.VCol;
/** @type {[typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ]} */ ;
// @ts-ignore
const __VLS_716 = __VLS_asFunctionalComponent(__VLS_715, new __VLS_715({
    cols: "12",
}));
const __VLS_717 = __VLS_716({
    cols: "12",
}, ...__VLS_functionalComponentArgsRest(__VLS_716));
__VLS_718.slots.default;
const __VLS_719 = {}.VTextField;
/** @type {[typeof __VLS_components.VTextField, typeof __VLS_components.vTextField, ]} */ ;
// @ts-ignore
const __VLS_720 = __VLS_asFunctionalComponent(__VLS_719, new __VLS_719({
    modelValue: (__VLS_ctx.multipleTables.max_players),
    modelModifiers: { number: true, },
    label: "Max Players per Table",
    type: "number",
    variant: "outlined",
    rules: ([(v) => v > 0 || 'Must be greater than 0']),
}));
const __VLS_721 = __VLS_720({
    modelValue: (__VLS_ctx.multipleTables.max_players),
    modelModifiers: { number: true, },
    label: "Max Players per Table",
    type: "number",
    variant: "outlined",
    rules: ([(v) => v > 0 || 'Must be greater than 0']),
}, ...__VLS_functionalComponentArgsRest(__VLS_720));
var __VLS_718;
var __VLS_706;
var __VLS_702;
const __VLS_723 = {}.VCardActions;
/** @type {[typeof __VLS_components.VCardActions, typeof __VLS_components.vCardActions, typeof __VLS_components.VCardActions, typeof __VLS_components.vCardActions, ]} */ ;
// @ts-ignore
const __VLS_724 = __VLS_asFunctionalComponent(__VLS_723, new __VLS_723({}));
const __VLS_725 = __VLS_724({}, ...__VLS_functionalComponentArgsRest(__VLS_724));
__VLS_726.slots.default;
const __VLS_727 = {}.VSpacer;
/** @type {[typeof __VLS_components.VSpacer, typeof __VLS_components.vSpacer, ]} */ ;
// @ts-ignore
const __VLS_728 = __VLS_asFunctionalComponent(__VLS_727, new __VLS_727({}));
const __VLS_729 = __VLS_728({}, ...__VLS_functionalComponentArgsRest(__VLS_728));
const __VLS_731 = {}.VBtn;
/** @type {[typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ]} */ ;
// @ts-ignore
const __VLS_732 = __VLS_asFunctionalComponent(__VLS_731, new __VLS_731({
    ...{ 'onClick': {} },
    color: "grey",
    variant: "text",
}));
const __VLS_733 = __VLS_732({
    ...{ 'onClick': {} },
    color: "grey",
    variant: "text",
}, ...__VLS_functionalComponentArgsRest(__VLS_732));
let __VLS_735;
let __VLS_736;
let __VLS_737;
const __VLS_738 = {
    onClick: (...[$event]) => {
        __VLS_ctx.createMultipleTablesDialog = false;
    }
};
__VLS_734.slots.default;
var __VLS_734;
const __VLS_739 = {}.VBtn;
/** @type {[typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ]} */ ;
// @ts-ignore
const __VLS_740 = __VLS_asFunctionalComponent(__VLS_739, new __VLS_739({
    ...{ 'onClick': {} },
    loading: (__VLS_ctx.creatingTable),
}));
const __VLS_741 = __VLS_740({
    ...{ 'onClick': {} },
    loading: (__VLS_ctx.creatingTable),
}, ...__VLS_functionalComponentArgsRest(__VLS_740));
let __VLS_743;
let __VLS_744;
let __VLS_745;
const __VLS_746 = {
    onClick: (__VLS_ctx.createMultipleTables)
};
const __VLS_9100 = {}.TutorialPromptDialog;
/** @type {[typeof TutorialPromptDialog, ]} */ ;
// @ts-ignore
const __VLS_9101 = __VLS_asFunctionalComponent(__VLS_9100, new __VLS_9100({
    modelValue: (__VLS_ctx.showTutorialPrompt),
    startWithGuide: true,
}));
const __VLS_9102 = __VLS_9101({
    modelValue: (__VLS_ctx.showTutorialPrompt),
    startWithGuide: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_9101));
var __VLS_3;
/** @type {__VLS_StyleScopedClasses['dialog-overlay']} */ ;
/** @type {__VLS_StyleScopedClasses['d-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-space-between']} */ ;
/** @type {__VLS_StyleScopedClasses['align-center']} */ ;
/** @type {__VLS_StyleScopedClasses['text-h6']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['pt-0']} */ ;
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
/** @type {__VLS_StyleScopedClasses['text-caption']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['font-weight-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-1']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['d-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-space-between']} */ ;
/** @type {__VLS_StyleScopedClasses['align-center']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-wrap']} */ ;
/** @type {__VLS_StyleScopedClasses['text-h6']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-2']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-md-0']} */ ;
/** @type {__VLS_StyleScopedClasses['d-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-3']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-wrap']} */ ;
/** @type {__VLS_StyleScopedClasses['text-center']} */ ;
/** @type {__VLS_StyleScopedClasses['py-6']} */ ;
/** @type {__VLS_StyleScopedClasses['text-center']} */ ;
/** @type {__VLS_StyleScopedClasses['text-grey']} */ ;
/** @type {__VLS_StyleScopedClasses['py-6']} */ ;
/** @type {__VLS_StyleScopedClasses['pa-4']} */ ;
/** @type {__VLS_StyleScopedClasses['table-card']} */ ;
/** @type {__VLS_StyleScopedClasses['d-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-space-between']} */ ;
/** @type {__VLS_StyleScopedClasses['align-center']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-2']} */ ;
/** @type {__VLS_StyleScopedClasses['font-weight-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['table-number-text']} */ ;
/** @type {__VLS_StyleScopedClasses['d-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['align-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-space-between']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-caption']} */ ;
/** @type {__VLS_StyleScopedClasses['text-grey']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-3']} */ ;
/** @type {__VLS_StyleScopedClasses['text-caption']} */ ;
/** @type {__VLS_StyleScopedClasses['text-grey']} */ ;
/** @type {__VLS_StyleScopedClasses['mr-1']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-2']} */ ;
/** @type {__VLS_StyleScopedClasses['setup-guide-container']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['text-center']} */ ;
/** @type {__VLS_StyleScopedClasses['text-h6']} */ ;
/** @type {__VLS_StyleScopedClasses['font-weight-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-2']} */ ;
/** @type {__VLS_StyleScopedClasses['mr-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-body-2']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['setup-preview-card']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['click-to-enlarge-hint']} */ ;
/** @type {__VLS_StyleScopedClasses['ml-1']} */ ;
/** @type {__VLS_StyleScopedClasses['text-center']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-body-1']} */ ;
/** @type {__VLS_StyleScopedClasses['d-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['align-end']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-column']} */ ;
/** @type {__VLS_StyleScopedClasses['pb-3']} */ ;
/** @type {__VLS_StyleScopedClasses['font-weight-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-1']} */ ;
/** @type {__VLS_StyleScopedClasses['pa-1']} */ ;
/** @type {__VLS_StyleScopedClasses['player-card']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-3']} */ ;
/** @type {__VLS_StyleScopedClasses['d-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['pl-3']} */ ;
/** @type {__VLS_StyleScopedClasses['d-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-column']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['font-weight-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-truncate']} */ ;
/** @type {__VLS_StyleScopedClasses['text-caption']} */ ;
/** @type {__VLS_StyleScopedClasses['text-caption']} */ ;
/** @type {__VLS_StyleScopedClasses['grey--text']} */ ;
/** @type {__VLS_StyleScopedClasses['d-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-column']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-2']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-md-0']} */ ;
/** @type {__VLS_StyleScopedClasses['pa-0']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-2']} */ ;
/** @type {__VLS_StyleScopedClasses['fill-height']} */ ;
/** @type {__VLS_StyleScopedClasses['ma-1']} */ ;
/** @type {__VLS_StyleScopedClasses['fill-height']} */ ;
/** @type {__VLS_StyleScopedClasses['ma-0']} */ ;
/** @type {__VLS_StyleScopedClasses['pa-0']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-2']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-2']} */ ;
/** @type {__VLS_StyleScopedClasses['d-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['dialog-overlay']} */ ;
/** @type {__VLS_StyleScopedClasses['d-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-space-between']} */ ;
/** @type {__VLS_StyleScopedClasses['align-center']} */ ;
/** @type {__VLS_StyleScopedClasses['text-h6']} */ ;
/** @type {__VLS_StyleScopedClasses['text-center']} */ ;
/** @type {__VLS_StyleScopedClasses['qr-code-container']} */ ;
/** @type {__VLS_StyleScopedClasses['pa-6']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['d-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['text-left']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-3']} */ ;
/** @type {__VLS_StyleScopedClasses['text-center']} */ ;
/** @type {__VLS_StyleScopedClasses['py-4']} */ ;
/** @type {__VLS_StyleScopedClasses['text-center']} */ ;
/** @type {__VLS_StyleScopedClasses['text-grey']} */ ;
/** @type {__VLS_StyleScopedClasses['py-4']} */ ;
/** @type {__VLS_StyleScopedClasses['transparent']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-2']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['d-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-space-between']} */ ;
/** @type {__VLS_StyleScopedClasses['align-center']} */ ;
/** @type {__VLS_StyleScopedClasses['text-h6']} */ ;
/** @type {__VLS_StyleScopedClasses['mr-2']} */ ;
/** @type {__VLS_StyleScopedClasses['d-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['align-center']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
/** @type {__VLS_StyleScopedClasses['mx-2']} */ ;
/** @type {__VLS_StyleScopedClasses['pa-0']} */ ;
/** @type {__VLS_StyleScopedClasses['setup-dialog-content']} */ ;
/** @type {__VLS_StyleScopedClasses['image-zoom-container']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            $props: __VLS_makeOptional(props),
            ...props,
            $emit: emit,
            QrcodeVue: QrcodeVue,
            InitialSetupViewer: InitialSetupViewer,
            formatEventDate: formatEventDate,
            smAndDown: smAndDown,
            activeTab: activeTab,
            dialogLoading: dialogLoading,
            tables: tables,
            loadingTables: loadingTables,
            playersByEvent: playersByEvent,
            currentPage: currentPage,
            totalPages: totalPages,
            eventRewards: eventRewards,
            grantedStatus: grantedStatus,
            turnedAwayStatus: turnedAwayStatus,
            JoinedtheQuest: JoinedtheQuest,
            createTableDialog: createTableDialog,
            createMultipleTablesDialog: createMultipleTablesDialog,
            creatingTable: creatingTable,
            newTable: newTable,
            multipleTables: multipleTables,
            qrCodeDialog: qrCodeDialog,
            generatingQR: generatingQR,
            selectedTable: selectedTable,
            qrCodeData: qrCodeData,
            showPlayers: showPlayers,
            tablePlayers: tablePlayers,
            loadingTablePlayers: loadingTablePlayers,
            setupDialog: setupDialog,
            showTutorialPrompt: showTutorialPrompt,
            TutorialPromptDialog: TutorialPromptDialog,
            zoomLevel: zoomLevel,
            panX: panX,
            panY: panY,
            isPanning: isPanning,
            isZooming: isZooming,
            imageContainer: imageContainer,
            qrCanvasWrap: qrCanvasWrap,
            qrCanvasSize: qrCanvasSize,
            downloadingPdf: downloadingPdf,
            userTimezone: userTimezone,
            tablesAlertCopy: tablesAlertCopy,
            getSeasonInfo: getSeasonInfo,
            openInGoogleMaps: openInGoogleMaps,
            closeDialog: closeDialog,
            openSetupDialog: openSetupDialog,
            zoomIn: zoomIn,
            zoomOut: zoomOut,
            resetZoom: resetZoom,
            handleWheel: handleWheel,
            startPan: startPan,
            handlePan: handlePan,
            endPan: endPan,
            handleTouchStart: handleTouchStart,
            handleTouchMove: handleTouchMove,
            handleTouchEnd: handleTouchEnd,
            refreshPlayers: refreshPlayers,
            updatePlayerStatus: updatePlayerStatus,
            openCreateTableDialog: openCreateTableDialog,
            openCreateMultipleTablesDialog: openCreateMultipleTablesDialog,
            createTable: createTable,
            createMultipleTables: createMultipleTables,
            deleteTable: deleteTable,
            generateQRCode: generateQRCode,
            showTablePlayers: showTablePlayers,
            downloadQrPdf: downloadQrPdf,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {
            $props: __VLS_makeOptional(props),
            ...props,
            $emit: emit,
            ...__VLS_exposed,
        };
    },
});
; /* PartiallyEnd: #4569/main.vue */
