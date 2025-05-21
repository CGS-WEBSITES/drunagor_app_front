/// <reference types="../../node_modules/.vue-global-types/vue_3.5_false.d.ts" />
import { ref, computed, watch } from "vue";
import { useUserStore } from "@/store/UserStore";
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
const oneYearFromTodayISO = oneYearFromToday.toISOString().split("T")[0];
const handleTimeInput = (event) => {
    let raw = event.target.value.replace(/\D/g, "");
    raw = raw.slice(0, 4);
    let hh = raw.slice(0, 2);
    let mm = raw.slice(2, 4);
    if (hh.length === 2) {
        let h = parseInt(hh);
        if (h < 1)
            hh = "01";
        else if (h > 12)
            hh = "12";
        else
            hh = h.toString().padStart(2, "0");
    }
    if (mm.length === 2) {
        let m = parseInt(mm);
        if (m > 59)
            mm = "59";
        else
            mm = m.toString().padStart(2, "0");
    }
    if (mm) {
        newEvent.value.hour = `${hh}:${mm}`;
    }
    else {
        newEvent.value.hour = hh;
    }
};
const user = computed(() => useUserStore().user);
const selectedRewards = ref([]);
const toggleReward = (reward) => {
    if (selectedRewards.value.includes(reward)) {
        selectedRewards.value = selectedRewards.value.filter((r) => r !== reward);
    }
    else {
        selectedRewards.value.push(reward);
    }
};
const dialog = ref(false);
const selectedEvent = ref(null);
const openDialog = (event) => {
    selectedEvent.value = event;
    dialog.value = true;
};
const joinEvent = () => {
    alert(`You have joined the event: ${selectedEvent.value.name}`);
    dialog.value = false;
};
const activeTab = ref("events");
const sortBy = ref("date");
const selectedStoreImage = computed(() => {
    const store = stores.value.find((s) => s.storename === selectedEvent.value?.store);
    return store ? store.storeImage : "https://via.placeholder.com/150";
});
const selectedStore = computed(() => {
    return (stores.value.find((s) => s.storename === selectedEvent.value?.store) || {});
});
const events = ref([]);
const sortedEvents = computed(() => {
    if (sortBy.value === "date") {
        return events.value.sort((a, b) => new Date(a.date) - new Date(b.date));
    }
    return events.value;
});
const addEvent = () => {
    if (newEvent.value.location &&
        newEvent.value.date &&
        newEvent.value.location) {
        events.value.push({
            ...newEvent.value,
            rewards: [...selectedRewards.value],
            id: Date.now(),
            createdByUser: true,
        });
        localStorage.setItem("userEvents", JSON.stringify(events.value));
        newEvent.value = {
            location: "Shopping Drunagor",
            eventdesc: "",
            eventseats: 4,
            date: "",
            hour: "",
            rewards: [],
        };
        selectedRewards.value = [];
        createEventDialog.value = false;
    }
};
onMounted(() => {
    const savedEvents = localStorage.getItem("userEvents");
    if (savedEvents) {
        events.value = JSON.parse(savedEvents);
    }
});
const deleteEvent = (eventId) => {
    events.value = events.value.filter((event) => event.id !== eventId);
    localStorage.setItem("userEvents", JSON.stringify(events.value));
};
const userCreatedEvents = computed(() => {
    return events.value.filter((event) => event.createdByUser);
});
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
const newEvent = ref({
    location: "Shopping Drunagor",
    eventdesc: "",
    eventseats: 4,
    date: "",
    hour: "",
    ampm: "AM",
    rewards: [],
});
const stores = ref([]);
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
onMounted(() => {
    stores.value = JSON.parse(localStorage.getItem("stores") || "[]");
});
const createEvent = () => {
    console.log("Event Created:", newEvent.value);
    createEventDialog.value = false;
};
const openCreateEventDialog = () => {
    createEventDialog.value = true;
};
const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
        newEvent.value.image = URL.createObjectURL(file);
    }
};
const editEventDialog = ref(false);
const editableEvent = ref({});
const openEditDialog = (event) => {
    editableEvent.value = { ...event };
    editEventDialog.value = true;
};
const saveEditedEvent = () => {
    const index = events.value.findIndex((e) => e.id === editableEvent.value.id);
    if (index !== -1) {
        events.value[index] = { ...editableEvent.value };
    }
    editEventDialog.value = false;
};
const toggleEditReward = (reward) => {
    const index = editableEvent.value.rewards.findIndex((r) => r === reward);
    if (index === -1) {
        editableEvent.value.rewards.push(reward);
    }
    else {
        editableEvent.value.rewards.splice(index, 1);
    }
};
; /* PartiallyEnd: #3632/scriptSetup.vue */
function __VLS_template() {
    const __VLS_ctx = {};
    let __VLS_components;
    let __VLS_directives;
    ['sort-btn', 'scheduled-box',];
    // CSS variable injection 
    // CSS variable injection end 
    const __VLS_0 = {}.VRow;
    /** @type { [typeof __VLS_components.VRow, typeof __VLS_components.vRow, typeof __VLS_components.VRow, typeof __VLS_components.vRow, ] } */ ;
    // @ts-ignore
    const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
        justify: ("center"),
    }));
    const __VLS_2 = __VLS_1({
        justify: ("center"),
    }, ...__VLS_functionalComponentArgsRest(__VLS_1));
    const __VLS_6 = {}.VCol;
    /** @type { [typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ] } */ ;
    // @ts-ignore
    const __VLS_7 = __VLS_asFunctionalComponent(__VLS_6, new __VLS_6({
        cols: ("12"),
        ...{ class: ("text-center") },
    }));
    const __VLS_8 = __VLS_7({
        cols: ("12"),
        ...{ class: ("text-center") },
    }, ...__VLS_functionalComponentArgsRest(__VLS_7));
    __VLS_elementAsFunction(__VLS_intrinsicElements.h1, __VLS_intrinsicElements.h1)({
        ...{ class: ("cinzel-text font-weight-black pt-15 pb-4 justify-center text-center text-h2") },
    });
    __VLS_11.slots.default;
    var __VLS_11;
    __VLS_5.slots.default;
    var __VLS_5;
    const __VLS_12 = {}.VCol;
    /** @type { [typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ] } */ ;
    // @ts-ignore
    const __VLS_13 = __VLS_asFunctionalComponent(__VLS_12, new __VLS_12({
        cols: ("12"),
        md: ("10"),
        ...{ class: ("mx-auto") },
    }));
    const __VLS_14 = __VLS_13({
        cols: ("12"),
        md: ("10"),
        ...{ class: ("mx-auto") },
    }, ...__VLS_functionalComponentArgsRest(__VLS_13));
    const __VLS_18 = {}.VCard;
    /** @type { [typeof __VLS_components.VCard, typeof __VLS_components.vCard, typeof __VLS_components.VCard, typeof __VLS_components.vCard, ] } */ ;
    // @ts-ignore
    const __VLS_19 = __VLS_asFunctionalComponent(__VLS_18, new __VLS_18({
        ...{ class: ("pb-12") },
        minHeight: ("500px"),
        color: ("#151515"),
    }));
    const __VLS_20 = __VLS_19({
        ...{ class: ("pb-12") },
        minHeight: ("500px"),
        color: ("#151515"),
    }, ...__VLS_functionalComponentArgsRest(__VLS_19));
    const __VLS_24 = {}.VRow;
    /** @type { [typeof __VLS_components.VRow, typeof __VLS_components.vRow, typeof __VLS_components.VRow, typeof __VLS_components.vRow, ] } */ ;
    // @ts-ignore
    const __VLS_25 = __VLS_asFunctionalComponent(__VLS_24, new __VLS_24({
        noGutters: (true),
    }));
    const __VLS_26 = __VLS_25({
        noGutters: (true),
    }, ...__VLS_functionalComponentArgsRest(__VLS_25));
    const __VLS_30 = {}.VCol;
    /** @type { [typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ] } */ ;
    // @ts-ignore
    const __VLS_31 = __VLS_asFunctionalComponent(__VLS_30, new __VLS_30({
        cols: ("12"),
    }));
    const __VLS_32 = __VLS_31({
        cols: ("12"),
    }, ...__VLS_functionalComponentArgsRest(__VLS_31));
    const __VLS_36 = {}.VTabs;
    /** @type { [typeof __VLS_components.VTabs, typeof __VLS_components.vTabs, typeof __VLS_components.VTabs, typeof __VLS_components.vTabs, ] } */ ;
    // @ts-ignore
    const __VLS_37 = __VLS_asFunctionalComponent(__VLS_36, new __VLS_36({
        ...{ class: ("EventsTabs mb-3") },
        modelValue: ((__VLS_ctx.activeTab)),
        fixedTabs: (true),
        alignTabs: ("center"),
        color: ("white"),
    }));
    const __VLS_38 = __VLS_37({
        ...{ class: ("EventsTabs mb-3") },
        modelValue: ((__VLS_ctx.activeTab)),
        fixedTabs: (true),
        alignTabs: ("center"),
        color: ("white"),
    }, ...__VLS_functionalComponentArgsRest(__VLS_37));
    const __VLS_42 = {}.VTab;
    /** @type { [typeof __VLS_components.VTab, typeof __VLS_components.vTab, typeof __VLS_components.VTab, typeof __VLS_components.vTab, ] } */ ;
    // @ts-ignore
    const __VLS_43 = __VLS_asFunctionalComponent(__VLS_42, new __VLS_42({
        ...{ class: ("text-h5") },
        value: ((1)),
    }));
    const __VLS_44 = __VLS_43({
        ...{ class: ("text-h5") },
        value: ((1)),
    }, ...__VLS_functionalComponentArgsRest(__VLS_43));
    __VLS_47.slots.default;
    var __VLS_47;
    const __VLS_48 = {}.VTab;
    /** @type { [typeof __VLS_components.VTab, typeof __VLS_components.vTab, typeof __VLS_components.VTab, typeof __VLS_components.vTab, ] } */ ;
    // @ts-ignore
    const __VLS_49 = __VLS_asFunctionalComponent(__VLS_48, new __VLS_48({
        ...{ class: ("text-h5") },
        value: ((2)),
    }));
    const __VLS_50 = __VLS_49({
        ...{ class: ("text-h5") },
        value: ((2)),
    }, ...__VLS_functionalComponentArgsRest(__VLS_49));
    __VLS_53.slots.default;
    var __VLS_53;
    __VLS_41.slots.default;
    var __VLS_41;
    __VLS_35.slots.default;
    var __VLS_35;
    __VLS_29.slots.default;
    var __VLS_29;
    if (__VLS_ctx.activeTab === 1) {
        __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
        const __VLS_54 = {}.VRow;
        /** @type { [typeof __VLS_components.VRow, typeof __VLS_components.vRow, typeof __VLS_components.VRow, typeof __VLS_components.vRow, ] } */ ;
        // @ts-ignore
        const __VLS_55 = __VLS_asFunctionalComponent(__VLS_54, new __VLS_54({}));
        const __VLS_56 = __VLS_55({}, ...__VLS_functionalComponentArgsRest(__VLS_55));
        for (const [event, index] of __VLS_getVForSourceType((__VLS_ctx.sortedEvents))) {
            const __VLS_60 = {}.VCol;
            /** @type { [typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ] } */ ;
            // @ts-ignore
            const __VLS_61 = __VLS_asFunctionalComponent(__VLS_60, new __VLS_60({
                ...{ class: ("py-2 pl-1 pr-1") },
                cols: ("12"),
                md: ("6"),
                key: ((index)),
            }));
            const __VLS_62 = __VLS_61({
                ...{ class: ("py-2 pl-1 pr-1") },
                cols: ("12"),
                md: ("6"),
                key: ((index)),
            }, ...__VLS_functionalComponentArgsRest(__VLS_61));
            const __VLS_66 = {}.VCard;
            /** @type { [typeof __VLS_components.VCard, typeof __VLS_components.vCard, typeof __VLS_components.VCard, typeof __VLS_components.vCard, ] } */ ;
            // @ts-ignore
            const __VLS_67 = __VLS_asFunctionalComponent(__VLS_66, new __VLS_66({
                ...{ 'onClick': {} },
                color: ("terciary"),
                ...{ class: ("pt-0 event-card") },
            }));
            const __VLS_68 = __VLS_67({
                ...{ 'onClick': {} },
                color: ("terciary"),
                ...{ class: ("pt-0 event-card") },
            }, ...__VLS_functionalComponentArgsRest(__VLS_67));
            let __VLS_72;
            const __VLS_73 = {
                onClick: (...[$event]) => {
                    if (!((__VLS_ctx.activeTab === 1)))
                        return;
                    __VLS_ctx.openDialog(event);
                }
            };
            let __VLS_69;
            let __VLS_70;
            const __VLS_74 = {}.VRow;
            /** @type { [typeof __VLS_components.VRow, typeof __VLS_components.vRow, typeof __VLS_components.VRow, typeof __VLS_components.vRow, ] } */ ;
            // @ts-ignore
            const __VLS_75 = __VLS_asFunctionalComponent(__VLS_74, new __VLS_74({
                noGutters: (true),
            }));
            const __VLS_76 = __VLS_75({
                noGutters: (true),
            }, ...__VLS_functionalComponentArgsRest(__VLS_75));
            const __VLS_80 = {}.VCol;
            /** @type { [typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ] } */ ;
            // @ts-ignore
            const __VLS_81 = __VLS_asFunctionalComponent(__VLS_80, new __VLS_80({
                cols: ("4"),
                sm: ("2"),
            }));
            const __VLS_82 = __VLS_81({
                cols: ("4"),
                sm: ("2"),
            }, ...__VLS_functionalComponentArgsRest(__VLS_81));
            __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: ("text-center ml-3") },
                ...{ style: ({}) },
            });
            __VLS_elementAsFunction(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
                ...{ class: ("pt-3 text-caption font-weight-bold") },
            });
            (new Date(event.date)
                .toLocaleDateString("en-US", {
                month: "short",
            })
                .toUpperCase());
            __VLS_elementAsFunction(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
                color: ("primary"),
                ...{ class: ("cinzel-text text-h3 font-weight-bold") },
            });
            (String(event.date).split("-")[2]);
            __VLS_elementAsFunction(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
                ...{ class: ("text-caption font-weight-bold") },
            });
            (event.hour);
            (event.ampm);
            __VLS_85.slots.default;
            var __VLS_85;
            const __VLS_86 = {}.VCol;
            /** @type { [typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ] } */ ;
            // @ts-ignore
            const __VLS_87 = __VLS_asFunctionalComponent(__VLS_86, new __VLS_86({
                cols: ("8"),
                sm: ("10"),
                ...{ class: ("pt-2") },
            }));
            const __VLS_88 = __VLS_87({
                cols: ("8"),
                sm: ("10"),
                ...{ class: ("pt-2") },
            }, ...__VLS_functionalComponentArgsRest(__VLS_87));
            __VLS_elementAsFunction(__VLS_intrinsicElements.h3, __VLS_intrinsicElements.h3)({
                ...{ class: ("pb-1") },
            });
            const __VLS_92 = {}.VIcon;
            /** @type { [typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, ] } */ ;
            // @ts-ignore
            const __VLS_93 = __VLS_asFunctionalComponent(__VLS_92, new __VLS_92({
                ...{ class: ("pr-1") },
                size: ("small"),
                color: ("black"),
            }));
            const __VLS_94 = __VLS_93({
                ...{ class: ("pr-1") },
                size: ("small"),
                color: ("black"),
            }, ...__VLS_functionalComponentArgsRest(__VLS_93));
            __VLS_97.slots.default;
            var __VLS_97;
            (event.store);
            __VLS_elementAsFunction(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
                ...{ class: ("text-caption text-truncate") },
            });
            const __VLS_98 = {}.VIcon;
            /** @type { [typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, ] } */ ;
            // @ts-ignore
            const __VLS_99 = __VLS_asFunctionalComponent(__VLS_98, new __VLS_98({
                color: ("red"),
            }));
            const __VLS_100 = __VLS_99({
                color: ("red"),
            }, ...__VLS_functionalComponentArgsRest(__VLS_99));
            __VLS_103.slots.default;
            var __VLS_103;
            (event.address);
            __VLS_elementAsFunction(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
                ...{ class: ("text-caption") },
            });
            const __VLS_104 = {}.VIcon;
            /** @type { [typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, ] } */ ;
            // @ts-ignore
            const __VLS_105 = __VLS_asFunctionalComponent(__VLS_104, new __VLS_104({
                color: ("red"),
            }));
            const __VLS_106 = __VLS_105({
                color: ("red"),
            }, ...__VLS_functionalComponentArgsRest(__VLS_105));
            __VLS_109.slots.default;
            var __VLS_109;
            (event.scenario);
            if (event.rewards && event.rewards.length) {
                __VLS_elementAsFunction(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
                    ...{ class: ("text-caption ml-3") },
                });
                const __VLS_110 = {}.VRow;
                /** @type { [typeof __VLS_components.VRow, typeof __VLS_components.vRow, typeof __VLS_components.VRow, typeof __VLS_components.vRow, ] } */ ;
                // @ts-ignore
                const __VLS_111 = __VLS_asFunctionalComponent(__VLS_110, new __VLS_110({
                    ...{ class: ("d-flex align-center rewards-container") },
                }));
                const __VLS_112 = __VLS_111({
                    ...{ class: ("d-flex align-center rewards-container") },
                }, ...__VLS_functionalComponentArgsRest(__VLS_111));
                const __VLS_116 = {}.VIcon;
                /** @type { [typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, ] } */ ;
                // @ts-ignore
                const __VLS_117 = __VLS_asFunctionalComponent(__VLS_116, new __VLS_116({
                    ...{ class: ("mr-1") },
                    color: ("red"),
                }));
                const __VLS_118 = __VLS_117({
                    ...{ class: ("mr-1") },
                    color: ("red"),
                }, ...__VLS_functionalComponentArgsRest(__VLS_117));
                __VLS_121.slots.default;
                var __VLS_121;
                for (const [reward, index] of __VLS_getVForSourceType((event.rewards))) {
                    const __VLS_122 = {}.VCol;
                    /** @type { [typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ] } */ ;
                    // @ts-ignore
                    const __VLS_123 = __VLS_asFunctionalComponent(__VLS_122, new __VLS_122({
                        cols: ("auto"),
                        key: ((index)),
                    }));
                    const __VLS_124 = __VLS_123({
                        cols: ("auto"),
                        key: ((index)),
                    }, ...__VLS_functionalComponentArgsRest(__VLS_123));
                    const __VLS_128 = {}.VImg;
                    /** @type { [typeof __VLS_components.VImg, typeof __VLS_components.vImg, typeof __VLS_components.VImg, typeof __VLS_components.vImg, ] } */ ;
                    // @ts-ignore
                    const __VLS_129 = __VLS_asFunctionalComponent(__VLS_128, new __VLS_128({
                        src: ((reward.image)),
                        height: ("20"),
                        width: ("20"),
                        contain: (true),
                        ...{ class: ("reward-icon") },
                    }));
                    const __VLS_130 = __VLS_129({
                        src: ((reward.image)),
                        height: ("20"),
                        width: ("20"),
                        contain: (true),
                        ...{ class: ("reward-icon") },
                    }, ...__VLS_functionalComponentArgsRest(__VLS_129));
                    __VLS_127.slots.default;
                    var __VLS_127;
                }
                __VLS_115.slots.default;
                var __VLS_115;
            }
            __VLS_91.slots.default;
            var __VLS_91;
            __VLS_79.slots.default;
            var __VLS_79;
            __VLS_71.slots.default;
            var __VLS_71;
            __VLS_65.slots.default;
            var __VLS_65;
        }
        __VLS_59.slots.default;
        var __VLS_59;
        const __VLS_134 = {}.VDialog;
        /** @type { [typeof __VLS_components.VDialog, typeof __VLS_components.vDialog, typeof __VLS_components.VDialog, typeof __VLS_components.vDialog, ] } */ ;
        // @ts-ignore
        const __VLS_135 = __VLS_asFunctionalComponent(__VLS_134, new __VLS_134({
            modelValue: ((__VLS_ctx.dialog)),
            maxWidth: ("600"),
        }));
        const __VLS_136 = __VLS_135({
            modelValue: ((__VLS_ctx.dialog)),
            maxWidth: ("600"),
        }, ...__VLS_functionalComponentArgsRest(__VLS_135));
        const __VLS_140 = {}.VCard;
        /** @type { [typeof __VLS_components.VCard, typeof __VLS_components.vCard, typeof __VLS_components.VCard, typeof __VLS_components.vCard, ] } */ ;
        // @ts-ignore
        const __VLS_141 = __VLS_asFunctionalComponent(__VLS_140, new __VLS_140({
            color: ("surface"),
        }));
        const __VLS_142 = __VLS_141({
            color: ("surface"),
        }, ...__VLS_functionalComponentArgsRest(__VLS_141));
        const __VLS_146 = {}.VCardActions;
        /** @type { [typeof __VLS_components.VCardActions, typeof __VLS_components.vCardActions, typeof __VLS_components.VCardActions, typeof __VLS_components.vCardActions, ] } */ ;
        // @ts-ignore
        const __VLS_147 = __VLS_asFunctionalComponent(__VLS_146, new __VLS_146({
            ...{ class: ("d-flex justify-left") },
        }));
        const __VLS_148 = __VLS_147({
            ...{ class: ("d-flex justify-left") },
        }, ...__VLS_functionalComponentArgsRest(__VLS_147));
        const __VLS_152 = {}.VBtn;
        /** @type { [typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ] } */ ;
        // @ts-ignore
        const __VLS_153 = __VLS_asFunctionalComponent(__VLS_152, new __VLS_152({
            ...{ 'onClick': {} },
            color: ("red"),
        }));
        const __VLS_154 = __VLS_153({
            ...{ 'onClick': {} },
            color: ("red"),
        }, ...__VLS_functionalComponentArgsRest(__VLS_153));
        let __VLS_158;
        const __VLS_159 = {
            onClick: (...[$event]) => {
                if (!((__VLS_ctx.activeTab === 1)))
                    return;
                __VLS_ctx.dialog = false;
            }
        };
        let __VLS_155;
        let __VLS_156;
        __VLS_157.slots.default;
        var __VLS_157;
        __VLS_151.slots.default;
        var __VLS_151;
        const __VLS_160 = {}.VCardTitle;
        /** @type { [typeof __VLS_components.VCardTitle, typeof __VLS_components.vCardTitle, typeof __VLS_components.VCardTitle, typeof __VLS_components.vCardTitle, ] } */ ;
        // @ts-ignore
        const __VLS_161 = __VLS_asFunctionalComponent(__VLS_160, new __VLS_160({
            ...{ class: ("ml-2 font-weight-bold") },
        }));
        const __VLS_162 = __VLS_161({
            ...{ class: ("ml-2 font-weight-bold") },
        }, ...__VLS_functionalComponentArgsRest(__VLS_161));
        (__VLS_ctx.selectedStore?.storename);
        __VLS_165.slots.default;
        var __VLS_165;
        const __VLS_166 = {}.VCardText;
        /** @type { [typeof __VLS_components.VCardText, typeof __VLS_components.vCardText, typeof __VLS_components.VCardText, typeof __VLS_components.vCardText, ] } */ ;
        // @ts-ignore
        const __VLS_167 = __VLS_asFunctionalComponent(__VLS_166, new __VLS_166({}));
        const __VLS_168 = __VLS_167({}, ...__VLS_functionalComponentArgsRest(__VLS_167));
        __VLS_elementAsFunction(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({});
        __VLS_elementAsFunction(__VLS_intrinsicElements.strong, __VLS_intrinsicElements.strong)({});
        (__VLS_ctx.selectedEvent?.eventdesc);
        __VLS_elementAsFunction(__VLS_intrinsicElements.br)({});
        __VLS_elementAsFunction(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({});
        (__VLS_ctx.selectedEvent?.eventseats);
        __VLS_elementAsFunction(__VLS_intrinsicElements.br)({});
        __VLS_elementAsFunction(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
            ...{ class: ("text-end scheduled-box") },
        });
        (__VLS_ctx.selectedEvent?.date);
        (__VLS_ctx.selectedEvent?.hour);
        (__VLS_ctx.selectedEvent?.ampm);
        __VLS_171.slots.default;
        var __VLS_171;
        const __VLS_172 = {}.VCard;
        /** @type { [typeof __VLS_components.VCard, typeof __VLS_components.vCard, typeof __VLS_components.VCard, typeof __VLS_components.vCard, ] } */ ;
        // @ts-ignore
        const __VLS_173 = __VLS_asFunctionalComponent(__VLS_172, new __VLS_172({
            color: ("primary"),
            minHeight: ("130px"),
            ...{ class: ("mr-4 event-card") },
        }));
        const __VLS_174 = __VLS_173({
            color: ("primary"),
            minHeight: ("130px"),
            ...{ class: ("mr-4 event-card") },
        }, ...__VLS_functionalComponentArgsRest(__VLS_173));
        const __VLS_178 = {}.VRow;
        /** @type { [typeof __VLS_components.VRow, typeof __VLS_components.vRow, typeof __VLS_components.VRow, typeof __VLS_components.vRow, ] } */ ;
        // @ts-ignore
        const __VLS_179 = __VLS_asFunctionalComponent(__VLS_178, new __VLS_178({
            noGutters: (true),
        }));
        const __VLS_180 = __VLS_179({
            noGutters: (true),
        }, ...__VLS_functionalComponentArgsRest(__VLS_179));
        const __VLS_184 = {}.VCol;
        /** @type { [typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ] } */ ;
        // @ts-ignore
        const __VLS_185 = __VLS_asFunctionalComponent(__VLS_184, new __VLS_184({
            cols: ("3"),
            lg: ("3"),
        }));
        const __VLS_186 = __VLS_185({
            cols: ("3"),
            lg: ("3"),
        }, ...__VLS_functionalComponentArgsRest(__VLS_185));
        const __VLS_190 = {}.VImg;
        /** @type { [typeof __VLS_components.VImg, typeof __VLS_components.vImg, typeof __VLS_components.VImg, typeof __VLS_components.vImg, ] } */ ;
        // @ts-ignore
        const __VLS_191 = __VLS_asFunctionalComponent(__VLS_190, new __VLS_190({
            src: ((__VLS_ctx.selectedStore?.storeImage)),
            ...{ class: ("event-img") },
        }));
        const __VLS_192 = __VLS_191({
            src: ((__VLS_ctx.selectedStore?.storeImage)),
            ...{ class: ("event-img") },
        }, ...__VLS_functionalComponentArgsRest(__VLS_191));
        __VLS_189.slots.default;
        var __VLS_189;
        const __VLS_196 = {}.VCol;
        /** @type { [typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ] } */ ;
        // @ts-ignore
        const __VLS_197 = __VLS_asFunctionalComponent(__VLS_196, new __VLS_196({
            cols: ("9"),
            ...{ class: ("pa-2") },
        }));
        const __VLS_198 = __VLS_197({
            cols: ("9"),
            ...{ class: ("pa-2") },
        }, ...__VLS_functionalComponentArgsRest(__VLS_197));
        __VLS_elementAsFunction(__VLS_intrinsicElements.h3, __VLS_intrinsicElements.h3)({
            ...{ class: ("text-subtitle-1 font-weight-bold") },
        });
        (__VLS_ctx.selectedStore?.storename || "Select a store");
        __VLS_elementAsFunction(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
            ...{ class: ("text-caption") },
        });
        const __VLS_202 = {}.VIcon;
        /** @type { [typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, ] } */ ;
        // @ts-ignore
        const __VLS_203 = __VLS_asFunctionalComponent(__VLS_202, new __VLS_202({
            color: ("red"),
        }));
        const __VLS_204 = __VLS_203({
            color: ("red"),
        }, ...__VLS_functionalComponentArgsRest(__VLS_203));
        __VLS_207.slots.default;
        var __VLS_207;
        (__VLS_ctx.selectedStore?.address);
        (__VLS_ctx.selectedStore?.streetNumber);
        (__VLS_ctx.selectedStore?.complement);
        (__VLS_ctx.selectedStore?.city);
        (__VLS_ctx.selectedStore?.state);
        __VLS_201.slots.default;
        var __VLS_201;
        const __VLS_208 = {}.VCol;
        /** @type { [typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ] } */ ;
        // @ts-ignore
        const __VLS_209 = __VLS_asFunctionalComponent(__VLS_208, new __VLS_208({
            cols: ("2"),
            ...{ class: ("text-right pa-0") },
        }));
        const __VLS_210 = __VLS_209({
            cols: ("2"),
            ...{ class: ("text-right pa-0") },
        }, ...__VLS_functionalComponentArgsRest(__VLS_209));
        __VLS_183.slots.default;
        var __VLS_183;
        __VLS_177.slots.default;
        var __VLS_177;
        const __VLS_214 = {}.VCardText;
        /** @type { [typeof __VLS_components.VCardText, typeof __VLS_components.vCardText, typeof __VLS_components.VCardText, typeof __VLS_components.vCardText, ] } */ ;
        // @ts-ignore
        const __VLS_215 = __VLS_asFunctionalComponent(__VLS_214, new __VLS_214({}));
        const __VLS_216 = __VLS_215({}, ...__VLS_functionalComponentArgsRest(__VLS_215));
        __VLS_elementAsFunction(__VLS_intrinsicElements.h3, __VLS_intrinsicElements.h3)({
            ...{ class: ("text-h6 font-weight-bold") },
        });
        for (const [reward, index] of __VLS_getVForSourceType((__VLS_ctx.selectedEvent?.rewards))) {
            const __VLS_220 = {}.VRow;
            /** @type { [typeof __VLS_components.VRow, typeof __VLS_components.vRow, typeof __VLS_components.VRow, typeof __VLS_components.vRow, ] } */ ;
            // @ts-ignore
            const __VLS_221 = __VLS_asFunctionalComponent(__VLS_220, new __VLS_220({
                key: ((index)),
                ...{ class: ("align-center my-2") },
            }));
            const __VLS_222 = __VLS_221({
                key: ((index)),
                ...{ class: ("align-center my-2") },
            }, ...__VLS_functionalComponentArgsRest(__VLS_221));
            const __VLS_226 = {}.VCol;
            /** @type { [typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ] } */ ;
            // @ts-ignore
            const __VLS_227 = __VLS_asFunctionalComponent(__VLS_226, new __VLS_226({
                cols: ("3"),
                md: ("2"),
            }));
            const __VLS_228 = __VLS_227({
                cols: ("3"),
                md: ("2"),
            }, ...__VLS_functionalComponentArgsRest(__VLS_227));
            const __VLS_232 = {}.VAvatar;
            /** @type { [typeof __VLS_components.VAvatar, typeof __VLS_components.vAvatar, typeof __VLS_components.VAvatar, typeof __VLS_components.vAvatar, ] } */ ;
            // @ts-ignore
            const __VLS_233 = __VLS_asFunctionalComponent(__VLS_232, new __VLS_232({
                size: ("60"),
            }));
            const __VLS_234 = __VLS_233({
                size: ("60"),
            }, ...__VLS_functionalComponentArgsRest(__VLS_233));
            const __VLS_238 = {}.VImg;
            /** @type { [typeof __VLS_components.VImg, typeof __VLS_components.vImg, typeof __VLS_components.VImg, typeof __VLS_components.vImg, ] } */ ;
            // @ts-ignore
            const __VLS_239 = __VLS_asFunctionalComponent(__VLS_238, new __VLS_238({
                src: ((reward.image)),
            }));
            const __VLS_240 = __VLS_239({
                src: ((reward.image)),
            }, ...__VLS_functionalComponentArgsRest(__VLS_239));
            __VLS_237.slots.default;
            var __VLS_237;
            __VLS_231.slots.default;
            var __VLS_231;
            const __VLS_244 = {}.VCol;
            /** @type { [typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ] } */ ;
            // @ts-ignore
            const __VLS_245 = __VLS_asFunctionalComponent(__VLS_244, new __VLS_244({
                cols: ("9"),
                md: ("10"),
            }));
            const __VLS_246 = __VLS_245({
                cols: ("9"),
                md: ("10"),
            }, ...__VLS_functionalComponentArgsRest(__VLS_245));
            __VLS_elementAsFunction(__VLS_intrinsicElements.h4, __VLS_intrinsicElements.h4)({
                ...{ class: ("text-subtitle-1 font-weight-bold") },
            });
            (reward.name);
            __VLS_elementAsFunction(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
                ...{ class: ("text-body-2") },
            });
            (reward.description);
            __VLS_249.slots.default;
            var __VLS_249;
            __VLS_225.slots.default;
            var __VLS_225;
        }
        __VLS_219.slots.default;
        var __VLS_219;
        const __VLS_250 = {}.VRow;
        /** @type { [typeof __VLS_components.VRow, typeof __VLS_components.vRow, typeof __VLS_components.VRow, typeof __VLS_components.vRow, ] } */ ;
        // @ts-ignore
        const __VLS_251 = __VLS_asFunctionalComponent(__VLS_250, new __VLS_250({
            ...{ class: ("mt-2 ml-0") },
        }));
        const __VLS_252 = __VLS_251({
            ...{ class: ("mt-2 ml-0") },
        }, ...__VLS_functionalComponentArgsRest(__VLS_251));
        const __VLS_256 = {}.VCol;
        /** @type { [typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ] } */ ;
        // @ts-ignore
        const __VLS_257 = __VLS_asFunctionalComponent(__VLS_256, new __VLS_256({
            cols: ("6"),
            ...{ class: ("pa-0") },
        }));
        const __VLS_258 = __VLS_257({
            cols: ("6"),
            ...{ class: ("pa-0") },
        }, ...__VLS_functionalComponentArgsRest(__VLS_257));
        const __VLS_262 = {}.VBtn;
        /** @type { [typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ] } */ ;
        // @ts-ignore
        const __VLS_263 = __VLS_asFunctionalComponent(__VLS_262, new __VLS_262({
            ...{ 'onClick': {} },
            block: (true),
            color: ("#907041"),
            ...{ class: ("rounded-0") },
        }));
        const __VLS_264 = __VLS_263({
            ...{ 'onClick': {} },
            block: (true),
            color: ("#907041"),
            ...{ class: ("rounded-0") },
        }, ...__VLS_functionalComponentArgsRest(__VLS_263));
        let __VLS_268;
        const __VLS_269 = {
            onClick: (__VLS_ctx.joinEvent)
        };
        let __VLS_265;
        let __VLS_266;
        __VLS_267.slots.default;
        var __VLS_267;
        __VLS_261.slots.default;
        var __VLS_261;
        const __VLS_270 = {}.VCol;
        /** @type { [typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ] } */ ;
        // @ts-ignore
        const __VLS_271 = __VLS_asFunctionalComponent(__VLS_270, new __VLS_270({
            cols: ("6"),
            ...{ class: ("pa-0") },
        }));
        const __VLS_272 = __VLS_271({
            cols: ("6"),
            ...{ class: ("pa-0") },
        }, ...__VLS_functionalComponentArgsRest(__VLS_271));
        const __VLS_276 = {}.VBtn;
        /** @type { [typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ] } */ ;
        // @ts-ignore
        const __VLS_277 = __VLS_asFunctionalComponent(__VLS_276, new __VLS_276({
            ...{ 'onClick': {} },
            block: (true),
            color: ("#539041"),
            ...{ class: ("rounded-0") },
        }));
        const __VLS_278 = __VLS_277({
            ...{ 'onClick': {} },
            block: (true),
            color: ("#539041"),
            ...{ class: ("rounded-0") },
        }, ...__VLS_functionalComponentArgsRest(__VLS_277));
        let __VLS_282;
        const __VLS_283 = {
            onClick: (__VLS_ctx.joinEvent)
        };
        let __VLS_279;
        let __VLS_280;
        __VLS_281.slots.default;
        var __VLS_281;
        __VLS_275.slots.default;
        var __VLS_275;
        __VLS_255.slots.default;
        var __VLS_255;
        __VLS_145.slots.default;
        var __VLS_145;
        __VLS_139.slots.default;
        var __VLS_139;
    }
    if (__VLS_ctx.activeTab === 2) {
        __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
        const __VLS_284 = {}.VRow;
        /** @type { [typeof __VLS_components.VRow, typeof __VLS_components.vRow, typeof __VLS_components.VRow, typeof __VLS_components.vRow, ] } */ ;
        // @ts-ignore
        const __VLS_285 = __VLS_asFunctionalComponent(__VLS_284, new __VLS_284({
            ...{ class: ("CreateNew align-center bg-gray text-white") },
        }));
        const __VLS_286 = __VLS_285({
            ...{ class: ("CreateNew align-center bg-gray text-white") },
        }, ...__VLS_functionalComponentArgsRest(__VLS_285));
        const __VLS_290 = {}.VCol;
        /** @type { [typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ] } */ ;
        // @ts-ignore
        const __VLS_291 = __VLS_asFunctionalComponent(__VLS_290, new __VLS_290({
            cols: ("2"),
        }));
        const __VLS_292 = __VLS_291({
            cols: ("2"),
        }, ...__VLS_functionalComponentArgsRest(__VLS_291));
        const __VLS_296 = {}.VCol;
        /** @type { [typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ] } */ ;
        // @ts-ignore
        const __VLS_297 = __VLS_asFunctionalComponent(__VLS_296, new __VLS_296({
            cols: ("3"),
        }));
        const __VLS_298 = __VLS_297({
            cols: ("3"),
        }, ...__VLS_functionalComponentArgsRest(__VLS_297));
        const __VLS_302 = {}.VBtn;
        /** @type { [typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ] } */ ;
        // @ts-ignore
        const __VLS_303 = __VLS_asFunctionalComponent(__VLS_302, new __VLS_302({
            ...{ 'onClick': {} },
            variant: ("text"),
            ...{ class: ("sort-btn") },
        }));
        const __VLS_304 = __VLS_303({
            ...{ 'onClick': {} },
            variant: ("text"),
            ...{ class: ("sort-btn") },
        }, ...__VLS_functionalComponentArgsRest(__VLS_303));
        let __VLS_308;
        const __VLS_309 = {
            onClick: (__VLS_ctx.openCreateEventDialog)
        };
        let __VLS_305;
        let __VLS_306;
        const __VLS_310 = {}.VIcon;
        /** @type { [typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, ] } */ ;
        // @ts-ignore
        const __VLS_311 = __VLS_asFunctionalComponent(__VLS_310, new __VLS_310({}));
        const __VLS_312 = __VLS_311({}, ...__VLS_functionalComponentArgsRest(__VLS_311));
        __VLS_315.slots.default;
        var __VLS_315;
        __VLS_307.slots.default;
        var __VLS_307;
        __VLS_301.slots.default;
        var __VLS_301;
        const __VLS_316 = {}.VCol;
        /** @type { [typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ] } */ ;
        // @ts-ignore
        const __VLS_317 = __VLS_asFunctionalComponent(__VLS_316, new __VLS_316({
            cols: ("4"),
        }));
        const __VLS_318 = __VLS_317({
            cols: ("4"),
        }, ...__VLS_functionalComponentArgsRest(__VLS_317));
        const __VLS_322 = {}.VBtn;
        /** @type { [typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ] } */ ;
        // @ts-ignore
        const __VLS_323 = __VLS_asFunctionalComponent(__VLS_322, new __VLS_322({
            ...{ 'onClick': {} },
            variant: ("text"),
            ...{ class: ("sort-btn") },
        }));
        const __VLS_324 = __VLS_323({
            ...{ 'onClick': {} },
            variant: ("text"),
            ...{ class: ("sort-btn") },
        }, ...__VLS_functionalComponentArgsRest(__VLS_323));
        let __VLS_328;
        const __VLS_329 = {
            onClick: (__VLS_ctx.)
        };
        let __VLS_325;
        let __VLS_326;
        __VLS_327.slots.default;
        var __VLS_327;
        __VLS_321.slots.default;
        var __VLS_321;
        const __VLS_330 = {}.VCol;
        /** @type { [typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ] } */ ;
        // @ts-ignore
        const __VLS_331 = __VLS_asFunctionalComponent(__VLS_330, new __VLS_330({
            cols: ("3"),
        }));
        const __VLS_332 = __VLS_331({
            cols: ("3"),
        }, ...__VLS_functionalComponentArgsRest(__VLS_331));
        const __VLS_336 = {}.VBtn;
        /** @type { [typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ] } */ ;
        // @ts-ignore
        const __VLS_337 = __VLS_asFunctionalComponent(__VLS_336, new __VLS_336({
            ...{ 'onClick': {} },
            variant: ("text"),
            ...{ class: ("sort-btn") },
        }));
        const __VLS_338 = __VLS_337({
            ...{ 'onClick': {} },
            variant: ("text"),
            ...{ class: ("sort-btn") },
        }, ...__VLS_functionalComponentArgsRest(__VLS_337));
        let __VLS_342;
        const __VLS_343 = {
            onClick: (__VLS_ctx.)
        };
        let __VLS_339;
        let __VLS_340;
        __VLS_341.slots.default;
        var __VLS_341;
        __VLS_335.slots.default;
        var __VLS_335;
        __VLS_289.slots.default;
        var __VLS_289;
        const __VLS_344 = {}.VDialog;
        /** @type { [typeof __VLS_components.VDialog, typeof __VLS_components.vDialog, typeof __VLS_components.VDialog, typeof __VLS_components.vDialog, ] } */ ;
        // @ts-ignore
        const __VLS_345 = __VLS_asFunctionalComponent(__VLS_344, new __VLS_344({
            modelValue: ((__VLS_ctx.createEventDialog)),
            maxWidth: ("1280"),
        }));
        const __VLS_346 = __VLS_345({
            modelValue: ((__VLS_ctx.createEventDialog)),
            maxWidth: ("1280"),
        }, ...__VLS_functionalComponentArgsRest(__VLS_345));
        const __VLS_350 = {}.VBtn;
        /** @type { [typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ] } */ ;
        // @ts-ignore
        const __VLS_351 = __VLS_asFunctionalComponent(__VLS_350, new __VLS_350({
            ...{ 'onClick': {} },
            icon: (true),
            ...{ class: ("close-btn") },
        }));
        const __VLS_352 = __VLS_351({
            ...{ 'onClick': {} },
            icon: (true),
            ...{ class: ("close-btn") },
        }, ...__VLS_functionalComponentArgsRest(__VLS_351));
        let __VLS_356;
        const __VLS_357 = {
            onClick: (...[$event]) => {
                if (!((__VLS_ctx.activeTab === 2)))
                    return;
                __VLS_ctx.createEventDialog = false;
            }
        };
        let __VLS_353;
        let __VLS_354;
        const __VLS_358 = {}.VIcon;
        /** @type { [typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, ] } */ ;
        // @ts-ignore
        const __VLS_359 = __VLS_asFunctionalComponent(__VLS_358, new __VLS_358({}));
        const __VLS_360 = __VLS_359({}, ...__VLS_functionalComponentArgsRest(__VLS_359));
        __VLS_363.slots.default;
        var __VLS_363;
        __VLS_355.slots.default;
        var __VLS_355;
        const __VLS_364 = {}.VCard;
        /** @type { [typeof __VLS_components.VCard, typeof __VLS_components.vCard, typeof __VLS_components.VCard, typeof __VLS_components.vCard, ] } */ ;
        // @ts-ignore
        const __VLS_365 = __VLS_asFunctionalComponent(__VLS_364, new __VLS_364({
            ...{ class: ("pa-6 dark-background") },
        }));
        const __VLS_366 = __VLS_365({
            ...{ class: ("pa-6 dark-background") },
        }, ...__VLS_functionalComponentArgsRest(__VLS_365));
        const __VLS_370 = {}.VCardText;
        /** @type { [typeof __VLS_components.VCardText, typeof __VLS_components.vCardText, typeof __VLS_components.VCardText, typeof __VLS_components.vCardText, ] } */ ;
        // @ts-ignore
        const __VLS_371 = __VLS_asFunctionalComponent(__VLS_370, new __VLS_370({}));
        const __VLS_372 = __VLS_371({}, ...__VLS_functionalComponentArgsRest(__VLS_371));
        const __VLS_376 = {}.VRow;
        /** @type { [typeof __VLS_components.VRow, typeof __VLS_components.vRow, typeof __VLS_components.VRow, typeof __VLS_components.vRow, ] } */ ;
        // @ts-ignore
        const __VLS_377 = __VLS_asFunctionalComponent(__VLS_376, new __VLS_376({}));
        const __VLS_378 = __VLS_377({}, ...__VLS_functionalComponentArgsRest(__VLS_377));
        const __VLS_382 = {}.VCol;
        /** @type { [typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ] } */ ;
        // @ts-ignore
        const __VLS_383 = __VLS_asFunctionalComponent(__VLS_382, new __VLS_382({
            cols: ("12"),
            md: ("12"),
        }));
        const __VLS_384 = __VLS_383({
            cols: ("12"),
            md: ("12"),
        }, ...__VLS_functionalComponentArgsRest(__VLS_383));
        const __VLS_388 = {}.VSelect;
        /** @type { [typeof __VLS_components.VSelect, typeof __VLS_components.vSelect, ] } */ ;
        // @ts-ignore
        const __VLS_389 = __VLS_asFunctionalComponent(__VLS_388, new __VLS_388({
            modelValue: ((__VLS_ctx.newEvent.store)),
            items: ((__VLS_ctx.stores.map((store) => store.storename))),
            label: ("STORE"),
            variant: ("outlined"),
        }));
        const __VLS_390 = __VLS_389({
            modelValue: ((__VLS_ctx.newEvent.store)),
            items: ((__VLS_ctx.stores.map((store) => store.storename))),
            label: ("STORE"),
            variant: ("outlined"),
        }, ...__VLS_functionalComponentArgsRest(__VLS_389));
        __VLS_387.slots.default;
        var __VLS_387;
        const __VLS_394 = {}.VCol;
        /** @type { [typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ] } */ ;
        // @ts-ignore
        const __VLS_395 = __VLS_asFunctionalComponent(__VLS_394, new __VLS_394({
            cols: ("12"),
        }));
        const __VLS_396 = __VLS_395({
            cols: ("12"),
        }, ...__VLS_functionalComponentArgsRest(__VLS_395));
        const __VLS_400 = {}.VTextarea;
        /** @type { [typeof __VLS_components.VTextarea, typeof __VLS_components.vTextarea, typeof __VLS_components.VTextarea, typeof __VLS_components.vTextarea, ] } */ ;
        // @ts-ignore
        const __VLS_401 = __VLS_asFunctionalComponent(__VLS_400, new __VLS_400({
            modelValue: ((__VLS_ctx.newEvent.eventdesc)),
            label: ("EVENT DESCRIPTION"),
            counter: ("355"),
            variant: ("outlined"),
        }));
        const __VLS_402 = __VLS_401({
            modelValue: ((__VLS_ctx.newEvent.eventdesc)),
            label: ("EVENT DESCRIPTION"),
            counter: ("355"),
            variant: ("outlined"),
        }, ...__VLS_functionalComponentArgsRest(__VLS_401));
        __VLS_399.slots.default;
        var __VLS_399;
        const __VLS_406 = {}.VCol;
        /** @type { [typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ] } */ ;
        // @ts-ignore
        const __VLS_407 = __VLS_asFunctionalComponent(__VLS_406, new __VLS_406({
            cols: ("12"),
            md: ("6"),
        }));
        const __VLS_408 = __VLS_407({
            cols: ("12"),
            md: ("6"),
        }, ...__VLS_functionalComponentArgsRest(__VLS_407));
        const __VLS_412 = {}.VSelect;
        /** @type { [typeof __VLS_components.VSelect, typeof __VLS_components.vSelect, typeof __VLS_components.VSelect, typeof __VLS_components.vSelect, ] } */ ;
        // @ts-ignore
        const __VLS_413 = __VLS_asFunctionalComponent(__VLS_412, new __VLS_412({
            modelValue: ((__VLS_ctx.newEvent.seats)),
            items: (([1, 2, 3, 4])),
            label: ("SEATS"),
            variant: ("outlined"),
        }));
        const __VLS_414 = __VLS_413({
            modelValue: ((__VLS_ctx.newEvent.seats)),
            items: (([1, 2, 3, 4])),
            label: ("SEATS"),
            variant: ("outlined"),
        }, ...__VLS_functionalComponentArgsRest(__VLS_413));
        __VLS_411.slots.default;
        var __VLS_411;
        const __VLS_418 = {}.VCol;
        /** @type { [typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ] } */ ;
        // @ts-ignore
        const __VLS_419 = __VLS_asFunctionalComponent(__VLS_418, new __VLS_418({
            cols: ("6"),
            md: ("6"),
        }));
        const __VLS_420 = __VLS_419({
            cols: ("6"),
            md: ("6"),
        }, ...__VLS_functionalComponentArgsRest(__VLS_419));
        const __VLS_424 = {}.VSelect;
        /** @type { [typeof __VLS_components.VSelect, typeof __VLS_components.vSelect, typeof __VLS_components.VSelect, typeof __VLS_components.vSelect, ] } */ ;
        // @ts-ignore
        const __VLS_425 = __VLS_asFunctionalComponent(__VLS_424, new __VLS_424({
            modelValue: ((__VLS_ctx.newEvent.scenario)),
            items: (([
                'Wing 01 Tutorial',
                'Wing 01 Advanced',
                'Wing 02 Advanced',
            ])),
            label: ("SCENARIO"),
            variant: ("outlined"),
        }));
        const __VLS_426 = __VLS_425({
            modelValue: ((__VLS_ctx.newEvent.scenario)),
            items: (([
                'Wing 01 Tutorial',
                'Wing 01 Advanced',
                'Wing 02 Advanced',
            ])),
            label: ("SCENARIO"),
            variant: ("outlined"),
        }, ...__VLS_functionalComponentArgsRest(__VLS_425));
        __VLS_423.slots.default;
        var __VLS_423;
        const __VLS_430 = {}.VCol;
        /** @type { [typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ] } */ ;
        // @ts-ignore
        const __VLS_431 = __VLS_asFunctionalComponent(__VLS_430, new __VLS_430({
            cols: ("6"),
            md: ("3"),
        }));
        const __VLS_432 = __VLS_431({
            cols: ("6"),
            md: ("3"),
        }, ...__VLS_functionalComponentArgsRest(__VLS_431));
        const __VLS_436 = {}.VTextField;
        /** @type { [typeof __VLS_components.VTextField, typeof __VLS_components.vTextField, typeof __VLS_components.VTextField, typeof __VLS_components.vTextField, ] } */ ;
        // @ts-ignore
        const __VLS_437 = __VLS_asFunctionalComponent(__VLS_436, new __VLS_436({
            ...{ 'onInput': {} },
            modelValue: ((__VLS_ctx.newEvent.hour)),
            label: ("TIME"),
            variant: ("outlined"),
            placeholder: ("HH:MM"),
            maxlength: ("5"),
        }));
        const __VLS_438 = __VLS_437({
            ...{ 'onInput': {} },
            modelValue: ((__VLS_ctx.newEvent.hour)),
            label: ("TIME"),
            variant: ("outlined"),
            placeholder: ("HH:MM"),
            maxlength: ("5"),
        }, ...__VLS_functionalComponentArgsRest(__VLS_437));
        let __VLS_442;
        const __VLS_443 = {
            onInput: (__VLS_ctx.handleTimeInput)
        };
        let __VLS_439;
        let __VLS_440;
        var __VLS_441;
        __VLS_435.slots.default;
        var __VLS_435;
        const __VLS_444 = {}.VCol;
        /** @type { [typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ] } */ ;
        // @ts-ignore
        const __VLS_445 = __VLS_asFunctionalComponent(__VLS_444, new __VLS_444({
            cols: ("6"),
            md: ("2"),
        }));
        const __VLS_446 = __VLS_445({
            cols: ("6"),
            md: ("2"),
        }, ...__VLS_functionalComponentArgsRest(__VLS_445));
        const __VLS_450 = {}.VSelect;
        /** @type { [typeof __VLS_components.VSelect, typeof __VLS_components.vSelect, typeof __VLS_components.VSelect, typeof __VLS_components.vSelect, ] } */ ;
        // @ts-ignore
        const __VLS_451 = __VLS_asFunctionalComponent(__VLS_450, new __VLS_450({
            modelValue: ((__VLS_ctx.newEvent.ampm)),
            items: ((['AM', 'PM'])),
            label: ("AM/PM"),
            variant: ("outlined"),
        }));
        const __VLS_452 = __VLS_451({
            modelValue: ((__VLS_ctx.newEvent.ampm)),
            items: ((['AM', 'PM'])),
            label: ("AM/PM"),
            variant: ("outlined"),
        }, ...__VLS_functionalComponentArgsRest(__VLS_451));
        __VLS_449.slots.default;
        var __VLS_449;
        const __VLS_456 = {}.VCol;
        /** @type { [typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ] } */ ;
        // @ts-ignore
        const __VLS_457 = __VLS_asFunctionalComponent(__VLS_456, new __VLS_456({
            cols: ("12"),
            md: ("2"),
            ...{ class: ("d-flex align-center") },
        }));
        const __VLS_458 = __VLS_457({
            cols: ("12"),
            md: ("2"),
            ...{ class: ("d-flex align-center") },
        }, ...__VLS_functionalComponentArgsRest(__VLS_457));
        const __VLS_462 = {}.VTextField;
        /** @type { [typeof __VLS_components.VTextField, typeof __VLS_components.vTextField, typeof __VLS_components.VTextField, typeof __VLS_components.vTextField, ] } */ ;
        // @ts-ignore
        const __VLS_463 = __VLS_asFunctionalComponent(__VLS_462, new __VLS_462({
            modelValue: ((__VLS_ctx.newEvent.date)),
            label: ("DATE"),
            type: ("date"),
            variant: ("outlined"),
            ...{ class: ("date-input") },
            min: ((__VLS_ctx.today)),
            max: ((__VLS_ctx.oneYearFromTodayISO)),
            rules: ((__VLS_ctx.dateRules)),
        }));
        const __VLS_464 = __VLS_463({
            modelValue: ((__VLS_ctx.newEvent.date)),
            label: ("DATE"),
            type: ("date"),
            variant: ("outlined"),
            ...{ class: ("date-input") },
            min: ((__VLS_ctx.today)),
            max: ((__VLS_ctx.oneYearFromTodayISO)),
            rules: ((__VLS_ctx.dateRules)),
        }, ...__VLS_functionalComponentArgsRest(__VLS_463));
        __VLS_461.slots.default;
        var __VLS_461;
        const __VLS_468 = {}.VCol;
        /** @type { [typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ] } */ ;
        // @ts-ignore
        const __VLS_469 = __VLS_asFunctionalComponent(__VLS_468, new __VLS_468({
            cols: ("12"),
        }));
        const __VLS_470 = __VLS_469({
            cols: ("12"),
        }, ...__VLS_functionalComponentArgsRest(__VLS_469));
        __VLS_elementAsFunction(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
            ...{ class: ("pb-3 font-weight-bold") },
        });
        const __VLS_474 = {}.VRow;
        /** @type { [typeof __VLS_components.VRow, typeof __VLS_components.vRow, typeof __VLS_components.VRow, typeof __VLS_components.vRow, ] } */ ;
        // @ts-ignore
        const __VLS_475 = __VLS_asFunctionalComponent(__VLS_474, new __VLS_474({}));
        const __VLS_476 = __VLS_475({}, ...__VLS_functionalComponentArgsRest(__VLS_475));
        for (const [reward, index] of __VLS_getVForSourceType((__VLS_ctx.availableRewards))) {
            const __VLS_480 = {}.VRow;
            /** @type { [typeof __VLS_components.VRow, typeof __VLS_components.vRow, typeof __VLS_components.VRow, typeof __VLS_components.vRow, ] } */ ;
            // @ts-ignore
            const __VLS_481 = __VLS_asFunctionalComponent(__VLS_480, new __VLS_480({
                ...{ 'onClick': {} },
                ...{ class: (({
                        'selected-reward': __VLS_ctx.selectedRewards.includes(reward),
                        'unselected-reward': !__VLS_ctx.selectedRewards.includes(reward),
                    })) },
                cols: ("auto"),
                key: ((index)),
            }));
            const __VLS_482 = __VLS_481({
                ...{ 'onClick': {} },
                ...{ class: (({
                        'selected-reward': __VLS_ctx.selectedRewards.includes(reward),
                        'unselected-reward': !__VLS_ctx.selectedRewards.includes(reward),
                    })) },
                cols: ("auto"),
                key: ((index)),
            }, ...__VLS_functionalComponentArgsRest(__VLS_481));
            let __VLS_486;
            const __VLS_487 = {
                onClick: (...[$event]) => {
                    if (!((__VLS_ctx.activeTab === 2)))
                        return;
                    __VLS_ctx.toggleReward(reward);
                }
            };
            let __VLS_483;
            let __VLS_484;
            const __VLS_488 = {}.VAvatar;
            /** @type { [typeof __VLS_components.VAvatar, typeof __VLS_components.vAvatar, typeof __VLS_components.VAvatar, typeof __VLS_components.vAvatar, ] } */ ;
            // @ts-ignore
            const __VLS_489 = __VLS_asFunctionalComponent(__VLS_488, new __VLS_488({
                ...{ class: ("ml-4 mt-4") },
                size: ("70"),
            }));
            const __VLS_490 = __VLS_489({
                ...{ class: ("ml-4 mt-4") },
                size: ("70"),
            }, ...__VLS_functionalComponentArgsRest(__VLS_489));
            const __VLS_494 = {}.VImg;
            /** @type { [typeof __VLS_components.VImg, typeof __VLS_components.vImg, typeof __VLS_components.VImg, typeof __VLS_components.vImg, ] } */ ;
            // @ts-ignore
            const __VLS_495 = __VLS_asFunctionalComponent(__VLS_494, new __VLS_494({
                src: ((reward.image)),
            }));
            const __VLS_496 = __VLS_495({
                src: ((reward.image)),
            }, ...__VLS_functionalComponentArgsRest(__VLS_495));
            __VLS_493.slots.default;
            var __VLS_493;
            __VLS_elementAsFunction(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
                ...{ class: ("text-body-1 pt-10 pl-2") },
            });
            (reward.name);
            __VLS_elementAsFunction(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
                ...{ class: ("text-body-1 pt-10 pl-2") },
            });
            (reward.description);
            __VLS_485.slots.default;
            var __VLS_485;
        }
        __VLS_479.slots.default;
        var __VLS_479;
        __VLS_473.slots.default;
        var __VLS_473;
        const __VLS_500 = {}.VCol;
        /** @type { [typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ] } */ ;
        // @ts-ignore
        const __VLS_501 = __VLS_asFunctionalComponent(__VLS_500, new __VLS_500({
            cols: ("12"),
        }));
        const __VLS_502 = __VLS_501({
            cols: ("12"),
        }, ...__VLS_functionalComponentArgsRest(__VLS_501));
        const __VLS_506 = {}.VBtn;
        /** @type { [typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ] } */ ;
        // @ts-ignore
        const __VLS_507 = __VLS_asFunctionalComponent(__VLS_506, new __VLS_506({
            ...{ 'onClick': {} },
            block: (true),
            color: ("secundary"),
            ...{ class: ("launch-btn mt-12") },
        }));
        const __VLS_508 = __VLS_507({
            ...{ 'onClick': {} },
            block: (true),
            color: ("secundary"),
            ...{ class: ("launch-btn mt-12") },
        }, ...__VLS_functionalComponentArgsRest(__VLS_507));
        let __VLS_512;
        const __VLS_513 = {
            onClick: (__VLS_ctx.addEvent)
        };
        let __VLS_509;
        let __VLS_510;
        __VLS_511.slots.default;
        var __VLS_511;
        __VLS_505.slots.default;
        var __VLS_505;
        __VLS_381.slots.default;
        var __VLS_381;
        __VLS_375.slots.default;
        var __VLS_375;
        __VLS_369.slots.default;
        var __VLS_369;
        __VLS_349.slots.default;
        var __VLS_349;
        const __VLS_514 = {}.VRow;
        /** @type { [typeof __VLS_components.VRow, typeof __VLS_components.vRow, typeof __VLS_components.VRow, typeof __VLS_components.vRow, ] } */ ;
        // @ts-ignore
        const __VLS_515 = __VLS_asFunctionalComponent(__VLS_514, new __VLS_514({}));
        const __VLS_516 = __VLS_515({}, ...__VLS_functionalComponentArgsRest(__VLS_515));
        for (const [event, index] of __VLS_getVForSourceType((__VLS_ctx.userCreatedEvents))) {
            const __VLS_520 = {}.VCol;
            /** @type { [typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ] } */ ;
            // @ts-ignore
            const __VLS_521 = __VLS_asFunctionalComponent(__VLS_520, new __VLS_520({
                ...{ class: ("py-2 pl-1 pr-1") },
                cols: ("12"),
                md: ("6"),
                key: ((index)),
            }));
            const __VLS_522 = __VLS_521({
                ...{ class: ("py-2 pl-1 pr-1") },
                cols: ("12"),
                md: ("6"),
                key: ((index)),
            }, ...__VLS_functionalComponentArgsRest(__VLS_521));
            const __VLS_526 = {}.VCard;
            /** @type { [typeof __VLS_components.VCard, typeof __VLS_components.vCard, typeof __VLS_components.VCard, typeof __VLS_components.vCard, ] } */ ;
            // @ts-ignore
            const __VLS_527 = __VLS_asFunctionalComponent(__VLS_526, new __VLS_526({
                ...{ 'onClick': {} },
                color: ("white"),
                maxHeight: ("130"),
                ...{ class: ("pt-0 pl-0 pb-0 event-card") },
            }));
            const __VLS_528 = __VLS_527({
                ...{ 'onClick': {} },
                color: ("white"),
                maxHeight: ("130"),
                ...{ class: ("pt-0 pl-0 pb-0 event-card") },
            }, ...__VLS_functionalComponentArgsRest(__VLS_527));
            let __VLS_532;
            const __VLS_533 = {
                onClick: (...[$event]) => {
                    if (!((__VLS_ctx.activeTab === 2)))
                        return;
                    __VLS_ctx.openEditDialog(event);
                }
            };
            let __VLS_529;
            let __VLS_530;
            const __VLS_534 = {}.VRow;
            /** @type { [typeof __VLS_components.VRow, typeof __VLS_components.vRow, typeof __VLS_components.VRow, typeof __VLS_components.vRow, ] } */ ;
            // @ts-ignore
            const __VLS_535 = __VLS_asFunctionalComponent(__VLS_534, new __VLS_534({
                noGutters: (true),
            }));
            const __VLS_536 = __VLS_535({
                noGutters: (true),
            }, ...__VLS_functionalComponentArgsRest(__VLS_535));
            const __VLS_540 = {}.VCol;
            /** @type { [typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ] } */ ;
            // @ts-ignore
            const __VLS_541 = __VLS_asFunctionalComponent(__VLS_540, new __VLS_540({
                cols: ("auto"),
                ...{ class: ("redbutton pt-13 pl-3") },
            }));
            const __VLS_542 = __VLS_541({
                cols: ("auto"),
                ...{ class: ("redbutton pt-13 pl-3") },
            }, ...__VLS_functionalComponentArgsRest(__VLS_541));
            const __VLS_546 = {}.VBtn;
            /** @type { [typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ] } */ ;
            // @ts-ignore
            const __VLS_547 = __VLS_asFunctionalComponent(__VLS_546, new __VLS_546({
                ...{ 'onClick': {} },
                color: ("#AB2929"),
                icon: (true),
                ...{ class: ("delete-btn") },
            }));
            const __VLS_548 = __VLS_547({
                ...{ 'onClick': {} },
                color: ("#AB2929"),
                icon: (true),
                ...{ class: ("delete-btn") },
            }, ...__VLS_functionalComponentArgsRest(__VLS_547));
            let __VLS_552;
            const __VLS_553 = {
                onClick: (...[$event]) => {
                    if (!((__VLS_ctx.activeTab === 2)))
                        return;
                    __VLS_ctx.deleteEvent(event.id);
                }
            };
            let __VLS_549;
            let __VLS_550;
            const __VLS_554 = {}.VIcon;
            /** @type { [typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, ] } */ ;
            // @ts-ignore
            const __VLS_555 = __VLS_asFunctionalComponent(__VLS_554, new __VLS_554({}));
            const __VLS_556 = __VLS_555({}, ...__VLS_functionalComponentArgsRest(__VLS_555));
            __VLS_559.slots.default;
            var __VLS_559;
            __VLS_551.slots.default;
            var __VLS_551;
            __VLS_545.slots.default;
            var __VLS_545;
            const __VLS_560 = {}.VCol;
            /** @type { [typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ] } */ ;
            // @ts-ignore
            const __VLS_561 = __VLS_asFunctionalComponent(__VLS_560, new __VLS_560({
                cols: ("8"),
                sm: (""),
                ...{ class: ("pt-6 pr-3") },
            }));
            const __VLS_562 = __VLS_561({
                cols: ("8"),
                sm: (""),
                ...{ class: ("pt-6 pr-3") },
            }, ...__VLS_functionalComponentArgsRest(__VLS_561));
            const __VLS_566 = {}.VRow;
            /** @type { [typeof __VLS_components.VRow, typeof __VLS_components.vRow, typeof __VLS_components.VRow, typeof __VLS_components.vRow, ] } */ ;
            // @ts-ignore
            const __VLS_567 = __VLS_asFunctionalComponent(__VLS_566, new __VLS_566({
                noGutters: (true),
            }));
            const __VLS_568 = __VLS_567({
                noGutters: (true),
            }, ...__VLS_functionalComponentArgsRest(__VLS_567));
            const __VLS_572 = {}.VCol;
            /** @type { [typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ] } */ ;
            // @ts-ignore
            const __VLS_573 = __VLS_asFunctionalComponent(__VLS_572, new __VLS_572({
                cols: ("4"),
                sm: ("2"),
            }));
            const __VLS_574 = __VLS_573({
                cols: ("4"),
                sm: ("2"),
            }, ...__VLS_functionalComponentArgsRest(__VLS_573));
            __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: ("text-center ml-2 pr-3") },
                ...{ style: ({}) },
            });
            __VLS_elementAsFunction(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
                ...{ class: ("pt-3 text-caption font-weight-bold") },
            });
            (new Date(event.date)
                .toLocaleDateString("en-US", {
                month: "short",
            })
                .toUpperCase());
            __VLS_elementAsFunction(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
                color: ("primary"),
                ...{ class: ("cinzel-text text-h3 font-weight-bold") },
            });
            (String(event.date).split("-")[2]);
            __VLS_elementAsFunction(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
                ...{ class: ("text-caption font-weight-bold") },
            });
            (event.hour);
            (event.ampm);
            __VLS_577.slots.default;
            var __VLS_577;
            const __VLS_578 = {}.VCol;
            /** @type { [typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ] } */ ;
            // @ts-ignore
            const __VLS_579 = __VLS_asFunctionalComponent(__VLS_578, new __VLS_578({
                cols: ("8"),
                sm: ("10"),
                ...{ class: ("pt-2 pl-2") },
            }));
            const __VLS_580 = __VLS_579({
                cols: ("8"),
                sm: ("10"),
                ...{ class: ("pt-2 pl-2") },
            }, ...__VLS_functionalComponentArgsRest(__VLS_579));
            __VLS_elementAsFunction(__VLS_intrinsicElements.h3, __VLS_intrinsicElements.h3)({
                ...{ class: ("pb-1") },
            });
            const __VLS_584 = {}.VIcon;
            /** @type { [typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, ] } */ ;
            // @ts-ignore
            const __VLS_585 = __VLS_asFunctionalComponent(__VLS_584, new __VLS_584({
                ...{ class: ("pr-1") },
                size: ("small"),
                color: ("black"),
            }));
            const __VLS_586 = __VLS_585({
                ...{ class: ("pr-1") },
                size: ("small"),
                color: ("black"),
            }, ...__VLS_functionalComponentArgsRest(__VLS_585));
            __VLS_589.slots.default;
            var __VLS_589;
            (event.store);
            __VLS_elementAsFunction(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
                ...{ class: ("text-caption text-truncate") },
            });
            const __VLS_590 = {}.VIcon;
            /** @type { [typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, ] } */ ;
            // @ts-ignore
            const __VLS_591 = __VLS_asFunctionalComponent(__VLS_590, new __VLS_590({
                color: ("red"),
            }));
            const __VLS_592 = __VLS_591({
                color: ("red"),
            }, ...__VLS_functionalComponentArgsRest(__VLS_591));
            __VLS_595.slots.default;
            var __VLS_595;
            (event.address);
            if (event.scenario) {
                __VLS_elementAsFunction(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
                    ...{ class: ("text-caption") },
                });
                const __VLS_596 = {}.VIcon;
                /** @type { [typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, ] } */ ;
                // @ts-ignore
                const __VLS_597 = __VLS_asFunctionalComponent(__VLS_596, new __VLS_596({
                    color: ("red"),
                }));
                const __VLS_598 = __VLS_597({
                    color: ("red"),
                }, ...__VLS_functionalComponentArgsRest(__VLS_597));
                __VLS_601.slots.default;
                var __VLS_601;
                (event.scenario);
            }
            if (event.rewards && event.rewards.length) {
                __VLS_elementAsFunction(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
                    ...{ class: ("text-caption ml-3") },
                });
                const __VLS_602 = {}.VRow;
                /** @type { [typeof __VLS_components.VRow, typeof __VLS_components.vRow, typeof __VLS_components.VRow, typeof __VLS_components.vRow, ] } */ ;
                // @ts-ignore
                const __VLS_603 = __VLS_asFunctionalComponent(__VLS_602, new __VLS_602({
                    ...{ class: ("d-flex align-center rewards-container") },
                }));
                const __VLS_604 = __VLS_603({
                    ...{ class: ("d-flex align-center rewards-container") },
                }, ...__VLS_functionalComponentArgsRest(__VLS_603));
                const __VLS_608 = {}.VIcon;
                /** @type { [typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, ] } */ ;
                // @ts-ignore
                const __VLS_609 = __VLS_asFunctionalComponent(__VLS_608, new __VLS_608({
                    ...{ class: ("mr-1") },
                    color: ("red"),
                }));
                const __VLS_610 = __VLS_609({
                    ...{ class: ("mr-1") },
                    color: ("red"),
                }, ...__VLS_functionalComponentArgsRest(__VLS_609));
                __VLS_613.slots.default;
                var __VLS_613;
                for (const [reward, index] of __VLS_getVForSourceType((event.rewards))) {
                    const __VLS_614 = {}.VCol;
                    /** @type { [typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ] } */ ;
                    // @ts-ignore
                    const __VLS_615 = __VLS_asFunctionalComponent(__VLS_614, new __VLS_614({
                        cols: ("auto"),
                        key: ((index)),
                    }));
                    const __VLS_616 = __VLS_615({
                        cols: ("auto"),
                        key: ((index)),
                    }, ...__VLS_functionalComponentArgsRest(__VLS_615));
                    const __VLS_620 = {}.VImg;
                    /** @type { [typeof __VLS_components.VImg, typeof __VLS_components.vImg, typeof __VLS_components.VImg, typeof __VLS_components.vImg, ] } */ ;
                    // @ts-ignore
                    const __VLS_621 = __VLS_asFunctionalComponent(__VLS_620, new __VLS_620({
                        src: ((reward.image)),
                        height: ("20"),
                        width: ("20"),
                        contain: (true),
                        ...{ class: ("reward-icon") },
                    }));
                    const __VLS_622 = __VLS_621({
                        src: ((reward.image)),
                        height: ("20"),
                        width: ("20"),
                        contain: (true),
                        ...{ class: ("reward-icon") },
                    }, ...__VLS_functionalComponentArgsRest(__VLS_621));
                    __VLS_619.slots.default;
                    var __VLS_619;
                }
                __VLS_607.slots.default;
                var __VLS_607;
            }
            __VLS_583.slots.default;
            var __VLS_583;
            __VLS_571.slots.default;
            var __VLS_571;
            __VLS_565.slots.default;
            var __VLS_565;
            __VLS_539.slots.default;
            var __VLS_539;
            const __VLS_626 = {}.VCol;
            /** @type { [typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ] } */ ;
            // @ts-ignore
            const __VLS_627 = __VLS_asFunctionalComponent(__VLS_626, new __VLS_626({
                cols: ("auto"),
                ...{ class: ("editbutton pt-13 pl-3") },
            }));
            const __VLS_628 = __VLS_627({
                cols: ("auto"),
                ...{ class: ("editbutton pt-13 pl-3") },
            }, ...__VLS_functionalComponentArgsRest(__VLS_627));
            const __VLS_632 = {}.VBtn;
            /** @type { [typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ] } */ ;
            // @ts-ignore
            const __VLS_633 = __VLS_asFunctionalComponent(__VLS_632, new __VLS_632({
                ...{ 'onClick': {} },
                color: ("white"),
                icon: (true),
                ...{ class: ("delete-btn") },
            }));
            const __VLS_634 = __VLS_633({
                ...{ 'onClick': {} },
                color: ("white"),
                icon: (true),
                ...{ class: ("delete-btn") },
            }, ...__VLS_functionalComponentArgsRest(__VLS_633));
            let __VLS_638;
            const __VLS_639 = {
                onClick: (...[$event]) => {
                    if (!((__VLS_ctx.activeTab === 2)))
                        return;
                    __VLS_ctx.openEditDialog(event);
                }
            };
            let __VLS_635;
            let __VLS_636;
            const __VLS_640 = {}.VIcon;
            /** @type { [typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, ] } */ ;
            // @ts-ignore
            const __VLS_641 = __VLS_asFunctionalComponent(__VLS_640, new __VLS_640({}));
            const __VLS_642 = __VLS_641({}, ...__VLS_functionalComponentArgsRest(__VLS_641));
            __VLS_645.slots.default;
            var __VLS_645;
            __VLS_637.slots.default;
            var __VLS_637;
            __VLS_631.slots.default;
            var __VLS_631;
            __VLS_531.slots.default;
            var __VLS_531;
            __VLS_525.slots.default;
            var __VLS_525;
        }
        __VLS_519.slots.default;
        var __VLS_519;
        const __VLS_646 = {}.VDialog;
        /** @type { [typeof __VLS_components.VDialog, typeof __VLS_components.vDialog, typeof __VLS_components.VDialog, typeof __VLS_components.vDialog, ] } */ ;
        // @ts-ignore
        const __VLS_647 = __VLS_asFunctionalComponent(__VLS_646, new __VLS_646({
            modelValue: ((__VLS_ctx.editEventDialog)),
            maxWidth: ("1024"),
        }));
        const __VLS_648 = __VLS_647({
            modelValue: ((__VLS_ctx.editEventDialog)),
            maxWidth: ("1024"),
        }, ...__VLS_functionalComponentArgsRest(__VLS_647));
        const __VLS_652 = {}.VCard;
        /** @type { [typeof __VLS_components.VCard, typeof __VLS_components.vCard, typeof __VLS_components.VCard, typeof __VLS_components.vCard, ] } */ ;
        // @ts-ignore
        const __VLS_653 = __VLS_asFunctionalComponent(__VLS_652, new __VLS_652({
            ...{ class: ("pa-6 dark-background") },
        }));
        const __VLS_654 = __VLS_653({
            ...{ class: ("pa-6 dark-background") },
        }, ...__VLS_functionalComponentArgsRest(__VLS_653));
        const __VLS_658 = {}.VCardText;
        /** @type { [typeof __VLS_components.VCardText, typeof __VLS_components.vCardText, typeof __VLS_components.VCardText, typeof __VLS_components.vCardText, ] } */ ;
        // @ts-ignore
        const __VLS_659 = __VLS_asFunctionalComponent(__VLS_658, new __VLS_658({}));
        const __VLS_660 = __VLS_659({}, ...__VLS_functionalComponentArgsRest(__VLS_659));
        const __VLS_664 = {}.VRow;
        /** @type { [typeof __VLS_components.VRow, typeof __VLS_components.vRow, typeof __VLS_components.VRow, typeof __VLS_components.vRow, ] } */ ;
        // @ts-ignore
        const __VLS_665 = __VLS_asFunctionalComponent(__VLS_664, new __VLS_664({}));
        const __VLS_666 = __VLS_665({}, ...__VLS_functionalComponentArgsRest(__VLS_665));
        const __VLS_670 = {}.VCol;
        /** @type { [typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ] } */ ;
        // @ts-ignore
        const __VLS_671 = __VLS_asFunctionalComponent(__VLS_670, new __VLS_670({
            cols: ("12"),
        }));
        const __VLS_672 = __VLS_671({
            cols: ("12"),
        }, ...__VLS_functionalComponentArgsRest(__VLS_671));
        const __VLS_676 = {}.VTextarea;
        /** @type { [typeof __VLS_components.VTextarea, typeof __VLS_components.vTextarea, typeof __VLS_components.VTextarea, typeof __VLS_components.vTextarea, ] } */ ;
        // @ts-ignore
        const __VLS_677 = __VLS_asFunctionalComponent(__VLS_676, new __VLS_676({
            modelValue: ((__VLS_ctx.editableEvent.eventdesc)),
            label: ("EVENT DESCRIPTION"),
            counter: ("355"),
            variant: ("outlined"),
        }));
        const __VLS_678 = __VLS_677({
            modelValue: ((__VLS_ctx.editableEvent.eventdesc)),
            label: ("EVENT DESCRIPTION"),
            counter: ("355"),
            variant: ("outlined"),
        }, ...__VLS_functionalComponentArgsRest(__VLS_677));
        __VLS_675.slots.default;
        var __VLS_675;
        const __VLS_682 = {}.VCol;
        /** @type { [typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ] } */ ;
        // @ts-ignore
        const __VLS_683 = __VLS_asFunctionalComponent(__VLS_682, new __VLS_682({
            cols: ("6"),
            md: ("6"),
        }));
        const __VLS_684 = __VLS_683({
            cols: ("6"),
            md: ("6"),
        }, ...__VLS_functionalComponentArgsRest(__VLS_683));
        const __VLS_688 = {}.VSelect;
        /** @type { [typeof __VLS_components.VSelect, typeof __VLS_components.vSelect, typeof __VLS_components.VSelect, typeof __VLS_components.vSelect, ] } */ ;
        // @ts-ignore
        const __VLS_689 = __VLS_asFunctionalComponent(__VLS_688, new __VLS_688({
            modelValue: ((__VLS_ctx.editableEvent.eventseats)),
            items: (([1, 2, 3, 4])),
            label: ("SEATS"),
            variant: ("outlined"),
        }));
        const __VLS_690 = __VLS_689({
            modelValue: ((__VLS_ctx.editableEvent.eventseats)),
            items: (([1, 2, 3, 4])),
            label: ("SEATS"),
            variant: ("outlined"),
        }, ...__VLS_functionalComponentArgsRest(__VLS_689));
        __VLS_687.slots.default;
        var __VLS_687;
        const __VLS_694 = {}.VCol;
        /** @type { [typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ] } */ ;
        // @ts-ignore
        const __VLS_695 = __VLS_asFunctionalComponent(__VLS_694, new __VLS_694({
            cols: ("6"),
            md: ("6"),
        }));
        const __VLS_696 = __VLS_695({
            cols: ("6"),
            md: ("6"),
        }, ...__VLS_functionalComponentArgsRest(__VLS_695));
        const __VLS_700 = {}.VSelect;
        /** @type { [typeof __VLS_components.VSelect, typeof __VLS_components.vSelect, typeof __VLS_components.VSelect, typeof __VLS_components.vSelect, ] } */ ;
        // @ts-ignore
        const __VLS_701 = __VLS_asFunctionalComponent(__VLS_700, new __VLS_700({
            modelValue: ((__VLS_ctx.editableEvent.scenario)),
            items: (([
                'Wing 01 Tutorial',
                'Wing 01 Advanced',
                'Wing 02 Advanced',
            ])),
            label: ("SCENARIO"),
            variant: ("outlined"),
        }));
        const __VLS_702 = __VLS_701({
            modelValue: ((__VLS_ctx.editableEvent.scenario)),
            items: (([
                'Wing 01 Tutorial',
                'Wing 01 Advanced',
                'Wing 02 Advanced',
            ])),
            label: ("SCENARIO"),
            variant: ("outlined"),
        }, ...__VLS_functionalComponentArgsRest(__VLS_701));
        __VLS_699.slots.default;
        var __VLS_699;
        const __VLS_706 = {}.VCol;
        /** @type { [typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ] } */ ;
        // @ts-ignore
        const __VLS_707 = __VLS_asFunctionalComponent(__VLS_706, new __VLS_706({
            cols: ("6"),
            md: ("3"),
        }));
        const __VLS_708 = __VLS_707({
            cols: ("6"),
            md: ("3"),
        }, ...__VLS_functionalComponentArgsRest(__VLS_707));
        const __VLS_712 = {}.VTextField;
        /** @type { [typeof __VLS_components.VTextField, typeof __VLS_components.vTextField, typeof __VLS_components.VTextField, typeof __VLS_components.vTextField, ] } */ ;
        // @ts-ignore
        const __VLS_713 = __VLS_asFunctionalComponent(__VLS_712, new __VLS_712({
            modelValue: ((__VLS_ctx.editableEvent.hour)),
            label: ("TIME"),
            variant: ("outlined"),
            placeholder: ("HH:MM"),
            maxlength: ("5"),
        }));
        const __VLS_714 = __VLS_713({
            modelValue: ((__VLS_ctx.editableEvent.hour)),
            label: ("TIME"),
            variant: ("outlined"),
            placeholder: ("HH:MM"),
            maxlength: ("5"),
        }, ...__VLS_functionalComponentArgsRest(__VLS_713));
        __VLS_711.slots.default;
        var __VLS_711;
        const __VLS_718 = {}.VCol;
        /** @type { [typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ] } */ ;
        // @ts-ignore
        const __VLS_719 = __VLS_asFunctionalComponent(__VLS_718, new __VLS_718({
            cols: ("6"),
            md: ("2"),
        }));
        const __VLS_720 = __VLS_719({
            cols: ("6"),
            md: ("2"),
        }, ...__VLS_functionalComponentArgsRest(__VLS_719));
        const __VLS_724 = {}.VSelect;
        /** @type { [typeof __VLS_components.VSelect, typeof __VLS_components.vSelect, typeof __VLS_components.VSelect, typeof __VLS_components.vSelect, ] } */ ;
        // @ts-ignore
        const __VLS_725 = __VLS_asFunctionalComponent(__VLS_724, new __VLS_724({
            modelValue: ((__VLS_ctx.editableEvent.ampm)),
            items: ((['AM', 'PM'])),
            label: ("AM/PM"),
            variant: ("outlined"),
        }));
        const __VLS_726 = __VLS_725({
            modelValue: ((__VLS_ctx.editableEvent.ampm)),
            items: ((['AM', 'PM'])),
            label: ("AM/PM"),
            variant: ("outlined"),
        }, ...__VLS_functionalComponentArgsRest(__VLS_725));
        __VLS_723.slots.default;
        var __VLS_723;
        const __VLS_730 = {}.VCol;
        /** @type { [typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ] } */ ;
        // @ts-ignore
        const __VLS_731 = __VLS_asFunctionalComponent(__VLS_730, new __VLS_730({
            cols: ("12"),
            md: ("2"),
            ...{ class: ("d-flex align-center") },
        }));
        const __VLS_732 = __VLS_731({
            cols: ("12"),
            md: ("2"),
            ...{ class: ("d-flex align-center") },
        }, ...__VLS_functionalComponentArgsRest(__VLS_731));
        const __VLS_736 = {}.VTextField;
        /** @type { [typeof __VLS_components.VTextField, typeof __VLS_components.vTextField, typeof __VLS_components.VTextField, typeof __VLS_components.vTextField, ] } */ ;
        // @ts-ignore
        const __VLS_737 = __VLS_asFunctionalComponent(__VLS_736, new __VLS_736({
            modelValue: ((__VLS_ctx.editableEvent.date)),
            label: ("DATE"),
            type: ("date"),
            variant: ("outlined"),
            ...{ class: ("date-input") },
            min: ((__VLS_ctx.today)),
            max: ((__VLS_ctx.oneYearFromTodayISO)),
            rules: ((__VLS_ctx.dateRules)),
        }));
        const __VLS_738 = __VLS_737({
            modelValue: ((__VLS_ctx.editableEvent.date)),
            label: ("DATE"),
            type: ("date"),
            variant: ("outlined"),
            ...{ class: ("date-input") },
            min: ((__VLS_ctx.today)),
            max: ((__VLS_ctx.oneYearFromTodayISO)),
            rules: ((__VLS_ctx.dateRules)),
        }, ...__VLS_functionalComponentArgsRest(__VLS_737));
        __VLS_735.slots.default;
        var __VLS_735;
        const __VLS_742 = {}.VCol;
        /** @type { [typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ] } */ ;
        // @ts-ignore
        const __VLS_743 = __VLS_asFunctionalComponent(__VLS_742, new __VLS_742({
            cols: ("12"),
        }));
        const __VLS_744 = __VLS_743({
            cols: ("12"),
        }, ...__VLS_functionalComponentArgsRest(__VLS_743));
        __VLS_elementAsFunction(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
            ...{ class: ("pb-3 font-weight-bold") },
        });
        const __VLS_748 = {}.VRow;
        /** @type { [typeof __VLS_components.VRow, typeof __VLS_components.vRow, typeof __VLS_components.VRow, typeof __VLS_components.vRow, ] } */ ;
        // @ts-ignore
        const __VLS_749 = __VLS_asFunctionalComponent(__VLS_748, new __VLS_748({}));
        const __VLS_750 = __VLS_749({}, ...__VLS_functionalComponentArgsRest(__VLS_749));
        for (const [reward, index] of __VLS_getVForSourceType((__VLS_ctx.availableRewards))) {
            const __VLS_754 = {}.VCol;
            /** @type { [typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ] } */ ;
            // @ts-ignore
            const __VLS_755 = __VLS_asFunctionalComponent(__VLS_754, new __VLS_754({
                cols: ("auto"),
                key: ((index)),
            }));
            const __VLS_756 = __VLS_755({
                cols: ("auto"),
                key: ((index)),
            }, ...__VLS_functionalComponentArgsRest(__VLS_755));
            const __VLS_760 = {}.VAvatar;
            /** @type { [typeof __VLS_components.VAvatar, typeof __VLS_components.vAvatar, typeof __VLS_components.VAvatar, typeof __VLS_components.vAvatar, ] } */ ;
            // @ts-ignore
            const __VLS_761 = __VLS_asFunctionalComponent(__VLS_760, new __VLS_760({
                ...{ 'onClick': {} },
                size: ("50"),
                ...{ class: (({
                        'selected-reward': __VLS_ctx.editableEvent.rewards.includes(reward),
                        'unselected-reward': !__VLS_ctx.editableEvent.rewards.includes(reward),
                    })) },
            }));
            const __VLS_762 = __VLS_761({
                ...{ 'onClick': {} },
                size: ("50"),
                ...{ class: (({
                        'selected-reward': __VLS_ctx.editableEvent.rewards.includes(reward),
                        'unselected-reward': !__VLS_ctx.editableEvent.rewards.includes(reward),
                    })) },
            }, ...__VLS_functionalComponentArgsRest(__VLS_761));
            let __VLS_766;
            const __VLS_767 = {
                onClick: (...[$event]) => {
                    if (!((__VLS_ctx.activeTab === 2)))
                        return;
                    __VLS_ctx.toggleEditReward(reward);
                }
            };
            let __VLS_763;
            let __VLS_764;
            const __VLS_768 = {}.VImg;
            /** @type { [typeof __VLS_components.VImg, typeof __VLS_components.vImg, typeof __VLS_components.VImg, typeof __VLS_components.vImg, ] } */ ;
            // @ts-ignore
            const __VLS_769 = __VLS_asFunctionalComponent(__VLS_768, new __VLS_768({
                src: ((reward.image)),
            }));
            const __VLS_770 = __VLS_769({
                src: ((reward.image)),
            }, ...__VLS_functionalComponentArgsRest(__VLS_769));
            __VLS_765.slots.default;
            var __VLS_765;
            __VLS_759.slots.default;
            var __VLS_759;
        }
        __VLS_753.slots.default;
        var __VLS_753;
        __VLS_747.slots.default;
        var __VLS_747;
        const __VLS_774 = {}.VCol;
        /** @type { [typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ] } */ ;
        // @ts-ignore
        const __VLS_775 = __VLS_asFunctionalComponent(__VLS_774, new __VLS_774({
            cols: ("12"),
            ...{ class: ("d-flex justify-space-between") },
        }));
        const __VLS_776 = __VLS_775({
            cols: ("12"),
            ...{ class: ("d-flex justify-space-between") },
        }, ...__VLS_functionalComponentArgsRest(__VLS_775));
        const __VLS_780 = {}.VBtn;
        /** @type { [typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ] } */ ;
        // @ts-ignore
        const __VLS_781 = __VLS_asFunctionalComponent(__VLS_780, new __VLS_780({
            ...{ 'onClick': {} },
            color: ("red"),
        }));
        const __VLS_782 = __VLS_781({
            ...{ 'onClick': {} },
            color: ("red"),
        }, ...__VLS_functionalComponentArgsRest(__VLS_781));
        let __VLS_786;
        const __VLS_787 = {
            onClick: (...[$event]) => {
                if (!((__VLS_ctx.activeTab === 2)))
                    return;
                __VLS_ctx.editEventDialog = false;
            }
        };
        let __VLS_783;
        let __VLS_784;
        __VLS_785.slots.default;
        var __VLS_785;
        const __VLS_788 = {}.VBtn;
        /** @type { [typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ] } */ ;
        // @ts-ignore
        const __VLS_789 = __VLS_asFunctionalComponent(__VLS_788, new __VLS_788({
            ...{ 'onClick': {} },
            color: ("green"),
        }));
        const __VLS_790 = __VLS_789({
            ...{ 'onClick': {} },
            color: ("green"),
        }, ...__VLS_functionalComponentArgsRest(__VLS_789));
        let __VLS_794;
        const __VLS_795 = {
            onClick: (__VLS_ctx.saveEditedEvent)
        };
        let __VLS_791;
        let __VLS_792;
        __VLS_793.slots.default;
        var __VLS_793;
        __VLS_779.slots.default;
        var __VLS_779;
        __VLS_669.slots.default;
        var __VLS_669;
        __VLS_663.slots.default;
        var __VLS_663;
        __VLS_657.slots.default;
        var __VLS_657;
        __VLS_651.slots.default;
        var __VLS_651;
    }
    __VLS_23.slots.default;
    var __VLS_23;
    __VLS_17.slots.default;
    var __VLS_17;
    ['text-center', 'cinzel-text', 'font-weight-black', 'pt-15', 'pb-4', 'justify-center', 'text-center', 'text-h2', 'mx-auto', 'pb-12', 'EventsTabs', 'mb-3', 'text-h5', 'text-h5', 'py-2', 'pl-1', 'pr-1', 'pt-0', 'event-card', 'text-center', 'ml-3', 'pt-3', 'text-caption', 'font-weight-bold', 'cinzel-text', 'text-h3', 'font-weight-bold', 'text-caption', 'font-weight-bold', 'pt-2', 'pb-1', 'pr-1', 'text-caption', 'text-truncate', 'text-caption', 'text-caption', 'ml-3', 'd-flex', 'align-center', 'rewards-container', 'mr-1', 'reward-icon', 'd-flex', 'justify-left', 'ml-2', 'font-weight-bold', 'text-end', 'scheduled-box', 'mr-4', 'event-card', 'event-img', 'pa-2', 'text-subtitle-1', 'font-weight-bold', 'text-caption', 'text-right', 'pa-0', 'text-h6', 'font-weight-bold', 'align-center', 'my-2', 'text-subtitle-1', 'font-weight-bold', 'text-body-2', 'mt-2', 'ml-0', 'pa-0', 'rounded-0', 'pa-0', 'rounded-0', 'CreateNew', 'align-center', 'bg-gray', 'text-white', 'sort-btn', 'sort-btn', 'sort-btn', 'close-btn', 'pa-6', 'dark-background', 'd-flex', 'align-center', 'date-input', 'pb-3', 'font-weight-bold', 'selected-reward', 'unselected-reward', 'ml-4', 'mt-4', 'text-body-1', 'pt-10', 'pl-2', 'text-body-1', 'pt-10', 'pl-2', 'launch-btn', 'mt-12', 'py-2', 'pl-1', 'pr-1', 'pt-0', 'pl-0', 'pb-0', 'event-card', 'redbutton', 'pt-13', 'pl-3', 'delete-btn', 'pt-6', 'pr-3', 'text-center', 'ml-2', 'pr-3', 'pt-3', 'text-caption', 'font-weight-bold', 'cinzel-text', 'text-h3', 'font-weight-bold', 'text-caption', 'font-weight-bold', 'pt-2', 'pl-2', 'pb-1', 'pr-1', 'text-caption', 'text-truncate', 'text-caption', 'text-caption', 'ml-3', 'd-flex', 'align-center', 'rewards-container', 'mr-1', 'reward-icon', 'editbutton', 'pt-13', 'pl-3', 'delete-btn', 'pa-6', 'dark-background', 'd-flex', 'align-center', 'date-input', 'pb-3', 'font-weight-bold', 'selected-reward', 'unselected-reward', 'd-flex', 'justify-space-between',];
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
            dateRules: dateRules,
            today: today,
            oneYearFromTodayISO: oneYearFromTodayISO,
            handleTimeInput: handleTimeInput,
            selectedRewards: selectedRewards,
            toggleReward: toggleReward,
            dialog: dialog,
            selectedEvent: selectedEvent,
            openDialog: openDialog,
            joinEvent: joinEvent,
            activeTab: activeTab,
            selectedStore: selectedStore,
            sortedEvents: sortedEvents,
            addEvent: addEvent,
            deleteEvent: deleteEvent,
            userCreatedEvents: userCreatedEvents,
            availableRewards: availableRewards,
            createEventDialog: createEventDialog,
            newEvent: newEvent,
            stores: stores,
            openCreateEventDialog: openCreateEventDialog,
            editEventDialog: editEventDialog,
            editableEvent: editableEvent,
            openEditDialog: openEditDialog,
            saveEditedEvent: saveEditedEvent,
            toggleEditReward: toggleEditReward,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
