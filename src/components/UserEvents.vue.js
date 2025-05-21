/// <reference types="../../node_modules/.vue-global-types/vue_3.5_false.d.ts" />
import { ref, computed } from "vue";
import { useUserStore } from "@/store/UserStore";
import { useEventStore } from "@/store/EventStore";
const user = computed(() => useUserStore().user);
const eventStore = useEventStore();
// If no events exist in the store, initialize with sample events.
if (!eventStore.events.length) {
    eventStore.setEvents([
        {
            name: "WORK IN PROGRESS - VISUAL PREVIEW",
            location: "Your Store location",
            date: "02/20/25",
            hour: "02:00",
            ampm: "AM",
            image: "https://www.turolgames.com/129805-thickbox_default/chronicles-of-drunagor-age-of-darkness-spanish.jpg",
            eventdesc: "This is a work in progress. Only the visual elements have been added. The functional elements will still be implemented. ",
            shopdesc: "YOUR STORE DESCRIPTION",
            eventseats: "4",
            shopname: "YOUR STORE NAME",
            shopimage: "https://www.turolgames.com/129805-thickbox_default/chronicles-of-drunagor-age-of-darkness-spanish.jpg",
            rewards: [
                {
                    name: "MEGA DUNGEON Badges",
                    description: "REWARD DESCRIPTION Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
                    image: "https://druna-assets.s3.us-east-2.amazonaws.com/Library/box-spoils.png",
                },
                {
                    name: "Drunagor APP Badges",
                    description: "Check-in in event and get an exclusive event badge to show in your profile. (Only official events drop exclusive event badges)",
                    image: "https://druna-assets.s3.us-east-2.amazonaws.com/Library/box-luccanor.png",
                },
                {
                    name: " Event Reward",
                    description: "REWARD DESCRIPTION Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
                    image: "https://druna-assets.s3.us-east-2.amazonaws.com/Library/box-corebox.png",
                },
                {
                    name: "Drunagor APP Badges",
                    description: "Check-in in event and get an exclusive event badge to show in your profile. (Only official events drop exclusive event badges)",
                    image: "https://druna-assets.s3.us-east-2.amazonaws.com/Library/box-apoc.png",
                },
            ],
        },
        {
            name: "EN PROCESO - VISTA PREVIA VISUAL",
            location: "Your Store location",
            date: "02/20/25",
            hour: "02:00",
            ampm: "AM",
            image: "https://www.turolgames.com/129805-thickbox_default/chronicles-of-drunagor-age-of-darkness-spanish.jpg",
            eventdesc: "This is a work in progress. Only the visual elements have been added. The functional elements will still be implemented. ",
            shopdesc: "YOUR STORE DESCRIPTION",
            eventseats: "4",
            shopname: "YOUR STORE NAME",
            shopimage: "https://www.turolgames.com/129805-thickbox_default/chronicles-of-drunagor-age-of-darkness-spanish.jpg",
            rewards: [
                {
                    name: "MEGA DUNGEON Badges",
                    description: "REWARD DESCRIPTION Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
                    image: "https://druna-assets.s3.us-east-2.amazonaws.com/Library/box-spoils.png",
                },
                {
                    name: "Drunagor APP Badges",
                    description: "Check-in in event and get an exclusive event badge to show in your profile. (Only official events drop exclusive event badges)",
                    image: "https://druna-assets.s3.us-east-2.amazonaws.com/Library/box-luccanor.png",
                },
                {
                    name: " Event Reward",
                    description: "REWARD DESCRIPTION Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
                    image: "https://druna-assets.s3.us-east-2.amazonaws.com/Library/box-corebox.png",
                },
                {
                    name: "Drunagor APP Badges",
                    description: "Check-in in event and get an exclusive event badge to show in your profile. (Only official events drop exclusive event badges)",
                    image: "https://druna-assets.s3.us-east-2.amazonaws.com/Library/box-apoc.png",
                },
            ],
        },
        {
            name: "IN ARBEIT - VISUELLE VORSCHAU",
            location: "Your Store location",
            date: "02/20/25",
            hour: "02:00",
            ampm: "AM",
            image: "https://www.turolgames.com/129805-thickbox_default/chronicles-of-drunagor-age-of-darkness-spanish.jpg",
            eventdesc: "This is a work in progress. Only the visual elements have been added. The functional elements will still be implemented. ",
            shopdesc: "YOUR STORE DESCRIPTION",
            eventseats: "4",
            shopname: "YOUR STORE NAME",
            shopimage: "https://www.turolgames.com/129805-thickbox_default/chronicles-of-drunagor-age-of-darkness-spanish.jpg",
            rewards: [
                {
                    name: "MEGA DUNGEON Badges",
                    description: "REWARD DESCRIPTION Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
                    image: "https://druna-assets.s3.us-east-2.amazonaws.com/Library/box-spoils.png",
                },
                {
                    name: "Drunagor APP Badges",
                    description: "Check-in in event and get an exclusive event badge to show in your profile. (Only official events drop exclusive event badges)",
                    image: "https://druna-assets.s3.us-east-2.amazonaws.com/Library/box-luccanor.png",
                },
                {
                    name: " Event Reward",
                    description: "REWARD DESCRIPTION Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
                    image: "https://druna-assets.s3.us-east-2.amazonaws.com/Library/box-corebox.png",
                },
                {
                    name: "Drunagor APP Badges",
                    description: "Check-in in event and get an exclusive event badge to show in your profile. (Only official events drop exclusive event badges)",
                    image: "https://druna-assets.s3.us-east-2.amazonaws.com/Library/box-apoc.png",
                },
            ],
        },
        {
            name: "EN COURS - APERÇU VISUEL",
            location: "Your Store location",
            date: "02/20/25",
            hour: "02:00",
            ampm: "AM",
            image: "https://www.turolgames.com/129805-thickbox_default/chronicles-of-drunagor-age-of-darkness-spanish.jpg",
            eventdesc: "This is a work in progress. Only the visual elements have been added. The functional elements will still be implemented. ",
            shopdesc: "YOUR STORE DESCRIPTION",
            eventseats: "4",
            shopname: "YOUR STORE NAME",
            shopimage: "https://www.turolgames.com/129805-thickbox_default/chronicles-of-drunagor-age-of-darkness-spanish.jpg",
            rewards: [
                {
                    name: "MEGA DUNGEON Badges",
                    description: "REWARD DESCRIPTION Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
                    image: "https://druna-assets.s3.us-east-2.amazonaws.com/Library/box-spoils.png",
                },
                {
                    name: "Drunagor APP Badges",
                    description: "Check-in in event and get an exclusive event badge to show in your profile. (Only official events drop exclusive event badges)",
                    image: "https://druna-assets.s3.us-east-2.amazonaws.com/Library/box-luccanor.png",
                },
                {
                    name: " Event Reward",
                    description: "REWARD DESCRIPTION Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
                    image: "https://druna-assets.s3.us-east-2.amazonaws.com/Library/box-corebox.png",
                },
                {
                    name: "Drunagor APP Badges",
                    description: "Check-in in event and get an exclusive event badge to show in your profile. (Only official events drop exclusive event badges)",
                    image: "https://druna-assets.s3.us-east-2.amazonaws.com/Library/box-apoc.png",
                },
            ],
        },
        {
            name: "IN LAVORAZIONE - ANTEPRIMA VISIVA",
            location: "Your Store location",
            date: "02/20/25",
            hour: "02:00",
            ampm: "AM",
            image: "https://www.turolgames.com/129805-thickbox_default/chronicles-of-drunagor-age-of-darkness-spanish.jpg",
            eventdesc: "This is a work in progress. Only the visual elements have been added. The functional elements will still be implemented. ",
            shopdesc: "YOUR STORE DESCRIPTION",
            eventseats: "4",
            shopname: "YOUR STORE NAME",
            shopimage: "https://www.turolgames.com/129805-thickbox_default/chronicles-of-drunagor-age-of-darkness-spanish.jpg",
            rewards: [
                {
                    name: "MEGA DUNGEON Badges",
                    description: "REWARD DESCRIPTION Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
                    image: "https://druna-assets.s3.us-east-2.amazonaws.com/Library/box-spoils.png",
                },
                {
                    name: "Drunagor APP Badges",
                    description: "Check-in in event and get an exclusive event badge to show in your profile. (Only official events drop exclusive event badges)",
                    image: "https://druna-assets.s3.us-east-2.amazonaws.com/Library/box-luccanor.png",
                },
                {
                    name: " Event Reward",
                    description: "REWARD DESCRIPTION Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
                    image: "https://druna-assets.s3.us-east-2.amazonaws.com/Library/box-corebox.png",
                },
                {
                    name: "Drunagor APP Badges",
                    description: "Check-in in event and get an exclusive event badge to show in your profile. (Only official events drop exclusive event badges)",
                    image: "https://druna-assets.s3.us-east-2.amazonaws.com/Library/box-apoc.png",
                },
            ],
        },
        {
            name: "قيد العمل - معاينة بصرية",
            location: "Your Store location",
            date: "02/20/25",
            hour: "02:00",
            ampm: "AM",
            image: "https://www.turolgames.com/129805-thickbox_default/chronicles-of-drunagor-age-of-darkness-spanish.jpg",
            eventdesc: "This is a work in progress. Only the visual elements have been added. The functional elements will still be implemented. ",
            shopdesc: "YOUR STORE DESCRIPTION",
            eventseats: "4",
            shopname: "YOUR STORE NAME",
            shopimage: "https://www.turolgames.com/129805-thickbox_default/chronicles-of-drunagor-age-of-darkness-spanish.jpg",
            rewards: [
                {
                    name: "MEGA DUNGEON Badges",
                    description: "REWARD DESCRIPTION Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
                    image: "https://druna-assets.s3.us-east-2.amazonaws.com/Library/box-spoils.png",
                },
                {
                    name: "Drunagor APP Badges",
                    description: "Check-in in event and get an exclusive event badge to show in your profile. (Only official events drop exclusive event badges)",
                    image: "https://druna-assets.s3.us-east-2.amazonaws.com/Library/box-luccanor.png",
                },
                {
                    name: " Event Reward",
                    description: "REWARD DESCRIPTION Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
                    image: "https://druna-assets.s3.us-east-2.amazonaws.com/Library/box-corebox.png",
                },
                {
                    name: "Drunagor APP Badges",
                    description: "Check-in in event and get an exclusive event badge to show in your profile. (Only official events drop exclusive event badges)",
                    image: "https://druna-assets.s3.us-east-2.amazonaws.com/Library/box-apoc.png",
                },
            ],
        },
        {
            name: "正在进行 - 视觉预览",
            location: "Your Store location",
            date: "02/20/25",
            hour: "02:00",
            ampm: "AM",
            image: "https://www.turolgames.com/129805-thickbox_default/chronicles-of-drunagor-age-of-darkness-spanish.jpg",
            eventdesc: "This is a work in progress. Only the visual elements have been added. The functional elements will still be implemented. ",
            shopdesc: "YOUR STORE DESCRIPTION",
            eventseats: "4",
            shopname: "YOUR STORE NAME",
            shopimage: "https://www.turolgames.com/129805-thickbox_default/chronicles-of-drunagor-age-of-darkness-spanish.jpg",
            rewards: [
                {
                    name: "MEGA DUNGEON Badges",
                    description: "REWARD DESCRIPTION Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
                    image: "https://druna-assets.s3.us-east-2.amazonaws.com/Library/box-spoils.png",
                },
                {
                    name: "Drunagor APP Badges",
                    description: "Check-in in event and get an exclusive event badge to show in your profile. (Only official events drop exclusive event badges)",
                    image: "https://druna-assets.s3.us-east-2.amazonaws.com/Library/box-luccanor.png",
                },
                {
                    name: " Event Reward",
                    description: "REWARD DESCRIPTION Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
                    image: "https://druna-assets.s3.us-east-2.amazonaws.com/Library/box-corebox.png",
                },
                {
                    name: "Drunagor APP Badges",
                    description: "Check-in in event and get an exclusive event badge to show in your profile. (Only official events drop exclusive event badges)",
                    image: "https://druna-assets.s3.us-east-2.amazonaws.com/Library/box-apoc.png",
                },
            ],
        },
        {
            name: "進行中 - ビジュアルプレビュー",
            location: "Your Store location",
            date: "02/20/25",
            hour: "02:00",
            ampm: "AM",
            image: "https://www.turolgames.com/129805-thickbox_default/chronicles-of-drunagor-age-of-darkness-spanish.jpg",
            eventdesc: "This is a work in progress. Only the visual elements have been added. The functional elements will still be implemented. ",
            shopdesc: "YOUR STORE DESCRIPTION",
            eventseats: "4",
            shopname: "YOUR STORE NAME",
            shopimage: "https://www.turolgames.com/129805-thickbox_default/chronicles-of-drunagor-age-of-darkness-spanish.jpg",
            rewards: [
                {
                    name: "MEGA DUNGEON Badges",
                    description: "REWARD DESCRIPTION Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
                    image: "https://druna-assets.s3.us-east-2.amazonaws.com/Library/box-spoils.png",
                },
                {
                    name: "Drunagor APP Badges",
                    description: "Check-in in event and get an exclusive event badge to show in your profile. (Only official events drop exclusive event badges)",
                    image: "https://druna-assets.s3.us-east-2.amazonaws.com/Library/box-luccanor.png",
                },
                {
                    name: " Event Reward",
                    description: "REWARD DESCRIPTION Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
                    image: "https://druna-assets.s3.us-east-2.amazonaws.com/Library/box-corebox.png",
                },
                {
                    name: "Drunagor APP Badges",
                    description: "Check-in in event and get an exclusive event badge to show in your profile. (Only official events drop exclusive event badges)",
                    image: "https://druna-assets.s3.us-east-2.amazonaws.com/Library/box-apoc.png",
                },
            ],
        },
    ]);
}
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
// Use events from the EventStore and sort them as needed
const sortedEvents = computed(() => {
    if (sortBy.value === "date") {
        return eventStore.events.sort((a, b) => new Date(a.date) - new Date(b.date));
    }
    return eventStore.events;
});
// Instead of a local events array, use store methods to add events.
const createEventDialog = ref(false);
const newEvent = ref({
    name: "",
    location: "Shopping Drunagor",
    eventdesc: "",
    eventseats: 4,
    date: "",
    hour: "",
    image: "",
    rewards: [],
});
const addEvent = () => {
    eventStore.addEvent({
        ...newEvent.value,
        rewards: [...selectedRewards.value],
    });
    // Reset form fields
    newEvent.value = {
        name: "",
        location: "Shopping Drunagor",
        eventdesc: "",
        eventseats: 4,
        date: "",
        hour: "",
        image: "",
        rewards: [],
    };
    createEventDialog.value = false;
};
const availableRewards = ref([
    {
        name: "Reward 1",
        image: "https://druna-assets.s3.us-east-2.amazonaws.com/Library/box-shadowworld.png",
        description: "REWARD DESCRIPTION Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
    },
    {
        name: "Reward 2",
        image: "https://druna-assets.s3.us-east-2.amazonaws.com/Library/box-spoils.png",
        description: "REWARD DESCRIPTION Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
    },
    {
        name: "Reward 3",
        image: "https://cf.geekdo-images.com/XVHxivhSyvJtJvyeTpeIOQ__itemrep/img/4irpWCwivBZi28pSvQ4vTc69QEQ=/fit-in/246x300/filters:strip_icc()/pic7883362.png",
        description: "REWARD DESCRIPTION Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
    },
]);
const stores = ["Shopping Drunagor"];
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
        newEvent.value.image = URL.createObjectURL(file); // Create a temporary URL
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
        color: ("primary"),
    }));
    const __VLS_20 = __VLS_19({
        ...{ class: ("pb-12") },
        color: ("primary"),
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
    __VLS_29.slots.default;
    var __VLS_29;
    const __VLS_36 = {}.VRow;
    /** @type { [typeof __VLS_components.VRow, typeof __VLS_components.vRow, typeof __VLS_components.VRow, typeof __VLS_components.vRow, ] } */ ;
    // @ts-ignore
    const __VLS_37 = __VLS_asFunctionalComponent(__VLS_36, new __VLS_36({
        ...{ class: ("black-bar SortBy align-center text-white") },
    }));
    const __VLS_38 = __VLS_37({
        ...{ class: ("black-bar SortBy align-center text-white") },
    }, ...__VLS_functionalComponentArgsRest(__VLS_37));
    const __VLS_42 = {}.VCol;
    /** @type { [typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ] } */ ;
    // @ts-ignore
    const __VLS_43 = __VLS_asFunctionalComponent(__VLS_42, new __VLS_42({
        cols: ("2"),
    }));
    const __VLS_44 = __VLS_43({
        cols: ("2"),
    }, ...__VLS_functionalComponentArgsRest(__VLS_43));
    __VLS_47.slots.default;
    var __VLS_47;
    const __VLS_48 = {}.VCol;
    /** @type { [typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ] } */ ;
    // @ts-ignore
    const __VLS_49 = __VLS_asFunctionalComponent(__VLS_48, new __VLS_48({
        cols: ("3"),
    }));
    const __VLS_50 = __VLS_49({
        cols: ("3"),
    }, ...__VLS_functionalComponentArgsRest(__VLS_49));
    const __VLS_54 = {}.VBtn;
    /** @type { [typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ] } */ ;
    // @ts-ignore
    const __VLS_55 = __VLS_asFunctionalComponent(__VLS_54, new __VLS_54({
        ...{ 'onClick': {} },
        variant: ("text"),
        ...{ class: ("sort-btn") },
        ...{ class: (({ 'active': __VLS_ctx.sortBy === 'date' })) },
    }));
    const __VLS_56 = __VLS_55({
        ...{ 'onClick': {} },
        variant: ("text"),
        ...{ class: ("sort-btn") },
        ...{ class: (({ 'active': __VLS_ctx.sortBy === 'date' })) },
    }, ...__VLS_functionalComponentArgsRest(__VLS_55));
    let __VLS_60;
    const __VLS_61 = {
        onClick: (...[$event]) => {
            __VLS_ctx.sortBy = 'date';
        }
    };
    let __VLS_57;
    let __VLS_58;
    __VLS_59.slots.default;
    var __VLS_59;
    __VLS_53.slots.default;
    var __VLS_53;
    const __VLS_62 = {}.VCol;
    /** @type { [typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ] } */ ;
    // @ts-ignore
    const __VLS_63 = __VLS_asFunctionalComponent(__VLS_62, new __VLS_62({
        cols: ("4"),
    }));
    const __VLS_64 = __VLS_63({
        cols: ("4"),
    }, ...__VLS_functionalComponentArgsRest(__VLS_63));
    const __VLS_68 = {}.VBtn;
    /** @type { [typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ] } */ ;
    // @ts-ignore
    const __VLS_69 = __VLS_asFunctionalComponent(__VLS_68, new __VLS_68({
        ...{ 'onClick': {} },
        variant: ("text"),
        ...{ class: ("sort-btn") },
        ...{ class: (({ 'active': __VLS_ctx.sortBy === 'location' })) },
    }));
    const __VLS_70 = __VLS_69({
        ...{ 'onClick': {} },
        variant: ("text"),
        ...{ class: ("sort-btn") },
        ...{ class: (({ 'active': __VLS_ctx.sortBy === 'location' })) },
    }, ...__VLS_functionalComponentArgsRest(__VLS_69));
    let __VLS_74;
    const __VLS_75 = {
        onClick: (...[$event]) => {
            __VLS_ctx.sortBy = 'location';
        }
    };
    let __VLS_71;
    let __VLS_72;
    __VLS_73.slots.default;
    var __VLS_73;
    __VLS_67.slots.default;
    var __VLS_67;
    const __VLS_76 = {}.VCol;
    /** @type { [typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ] } */ ;
    // @ts-ignore
    const __VLS_77 = __VLS_asFunctionalComponent(__VLS_76, new __VLS_76({
        cols: ("3"),
    }));
    const __VLS_78 = __VLS_77({
        cols: ("3"),
    }, ...__VLS_functionalComponentArgsRest(__VLS_77));
    const __VLS_82 = {}.VBtn;
    /** @type { [typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ] } */ ;
    // @ts-ignore
    const __VLS_83 = __VLS_asFunctionalComponent(__VLS_82, new __VLS_82({
        ...{ 'onClick': {} },
        variant: ("text"),
        ...{ class: ("sort-btn") },
        ...{ class: (({ 'active': __VLS_ctx.sortBy === 'store' })) },
    }));
    const __VLS_84 = __VLS_83({
        ...{ 'onClick': {} },
        variant: ("text"),
        ...{ class: ("sort-btn") },
        ...{ class: (({ 'active': __VLS_ctx.sortBy === 'store' })) },
    }, ...__VLS_functionalComponentArgsRest(__VLS_83));
    let __VLS_88;
    const __VLS_89 = {
        onClick: (...[$event]) => {
            __VLS_ctx.sortBy = 'store';
        }
    };
    let __VLS_85;
    let __VLS_86;
    __VLS_87.slots.default;
    var __VLS_87;
    __VLS_81.slots.default;
    var __VLS_81;
    __VLS_41.slots.default;
    var __VLS_41;
    const __VLS_90 = {}.VRow;
    /** @type { [typeof __VLS_components.VRow, typeof __VLS_components.vRow, typeof __VLS_components.VRow, typeof __VLS_components.vRow, ] } */ ;
    // @ts-ignore
    const __VLS_91 = __VLS_asFunctionalComponent(__VLS_90, new __VLS_90({}));
    const __VLS_92 = __VLS_91({}, ...__VLS_functionalComponentArgsRest(__VLS_91));
    for (const [event, index] of __VLS_getVForSourceType((__VLS_ctx.sortedEvents))) {
        const __VLS_96 = {}.VCol;
        /** @type { [typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ] } */ ;
        // @ts-ignore
        const __VLS_97 = __VLS_asFunctionalComponent(__VLS_96, new __VLS_96({
            ...{ class: ("py-2 pl-1 pr-1") },
            cols: ("12"),
            md: ("6"),
            key: ((index)),
        }));
        const __VLS_98 = __VLS_97({
            ...{ class: ("py-2 pl-1 pr-1") },
            cols: ("12"),
            md: ("6"),
            key: ((index)),
        }, ...__VLS_functionalComponentArgsRest(__VLS_97));
        const __VLS_102 = {}.VCard;
        /** @type { [typeof __VLS_components.VCard, typeof __VLS_components.vCard, typeof __VLS_components.VCard, typeof __VLS_components.vCard, ] } */ ;
        // @ts-ignore
        const __VLS_103 = __VLS_asFunctionalComponent(__VLS_102, new __VLS_102({
            ...{ 'onClick': {} },
            color: ("white"),
            ...{ class: ("pt-0 event-card") },
        }));
        const __VLS_104 = __VLS_103({
            ...{ 'onClick': {} },
            color: ("white"),
            ...{ class: ("pt-0 event-card") },
        }, ...__VLS_functionalComponentArgsRest(__VLS_103));
        let __VLS_108;
        const __VLS_109 = {
            onClick: (...[$event]) => {
                __VLS_ctx.openDialog(event);
            }
        };
        let __VLS_105;
        let __VLS_106;
        const __VLS_110 = {}.VRow;
        /** @type { [typeof __VLS_components.VRow, typeof __VLS_components.vRow, typeof __VLS_components.VRow, typeof __VLS_components.vRow, ] } */ ;
        // @ts-ignore
        const __VLS_111 = __VLS_asFunctionalComponent(__VLS_110, new __VLS_110({
            noGutters: (true),
        }));
        const __VLS_112 = __VLS_111({
            noGutters: (true),
        }, ...__VLS_functionalComponentArgsRest(__VLS_111));
        const __VLS_116 = {}.VCol;
        /** @type { [typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ] } */ ;
        // @ts-ignore
        const __VLS_117 = __VLS_asFunctionalComponent(__VLS_116, new __VLS_116({
            cols: ("4"),
            sm: ("2"),
        }));
        const __VLS_118 = __VLS_117({
            cols: ("4"),
            sm: ("2"),
        }, ...__VLS_functionalComponentArgsRest(__VLS_117));
        const __VLS_122 = {}.VImg;
        /** @type { [typeof __VLS_components.VImg, typeof __VLS_components.vImg, typeof __VLS_components.VImg, typeof __VLS_components.vImg, ] } */ ;
        // @ts-ignore
        const __VLS_123 = __VLS_asFunctionalComponent(__VLS_122, new __VLS_122({
            src: ((event.image)),
            ...{ class: ("mt-3 event-img") },
        }));
        const __VLS_124 = __VLS_123({
            src: ((event.image)),
            ...{ class: ("mt-3 event-img") },
        }, ...__VLS_functionalComponentArgsRest(__VLS_123));
        __VLS_121.slots.default;
        var __VLS_121;
        const __VLS_128 = {}.VCol;
        /** @type { [typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ] } */ ;
        // @ts-ignore
        const __VLS_129 = __VLS_asFunctionalComponent(__VLS_128, new __VLS_128({
            cols: ("8"),
            sm: ("10"),
            ...{ class: ("pt-2 pl-2") },
        }));
        const __VLS_130 = __VLS_129({
            cols: ("8"),
            sm: ("10"),
            ...{ class: ("pt-2 pl-2") },
        }, ...__VLS_functionalComponentArgsRest(__VLS_129));
        __VLS_elementAsFunction(__VLS_intrinsicElements.h3, __VLS_intrinsicElements.h3)({
            ...{ class: ("") },
        });
        (event.name);
        __VLS_elementAsFunction(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
            ...{ class: ("text-caption text-truncate") },
        });
        const __VLS_134 = {}.VIcon;
        /** @type { [typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, ] } */ ;
        // @ts-ignore
        const __VLS_135 = __VLS_asFunctionalComponent(__VLS_134, new __VLS_134({
            color: ("red"),
        }));
        const __VLS_136 = __VLS_135({
            color: ("red"),
        }, ...__VLS_functionalComponentArgsRest(__VLS_135));
        __VLS_139.slots.default;
        var __VLS_139;
        (event.location);
        __VLS_elementAsFunction(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
            ...{ class: ("text-caption") },
        });
        const __VLS_140 = {}.VRow;
        /** @type { [typeof __VLS_components.VRow, typeof __VLS_components.vRow, typeof __VLS_components.VRow, typeof __VLS_components.vRow, ] } */ ;
        // @ts-ignore
        const __VLS_141 = __VLS_asFunctionalComponent(__VLS_140, new __VLS_140({
            ...{ class: ("d-flex align-center rewards-container") },
        }));
        const __VLS_142 = __VLS_141({
            ...{ class: ("d-flex align-center rewards-container") },
        }, ...__VLS_functionalComponentArgsRest(__VLS_141));
        for (const [reward, index] of __VLS_getVForSourceType((event.rewards))) {
            const __VLS_146 = {}.VCol;
            /** @type { [typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ] } */ ;
            // @ts-ignore
            const __VLS_147 = __VLS_asFunctionalComponent(__VLS_146, new __VLS_146({
                cols: ("auto"),
                key: ((index)),
            }));
            const __VLS_148 = __VLS_147({
                cols: ("auto"),
                key: ((index)),
            }, ...__VLS_functionalComponentArgsRest(__VLS_147));
            const __VLS_152 = {}.VImg;
            /** @type { [typeof __VLS_components.VImg, typeof __VLS_components.vImg, typeof __VLS_components.VImg, typeof __VLS_components.vImg, ] } */ ;
            // @ts-ignore
            const __VLS_153 = __VLS_asFunctionalComponent(__VLS_152, new __VLS_152({
                src: ((reward.image)),
                height: ("30"),
                width: ("30"),
                contain: (true),
                ...{ class: ("reward-icon") },
            }));
            const __VLS_154 = __VLS_153({
                src: ((reward.image)),
                height: ("30"),
                width: ("30"),
                contain: (true),
                ...{ class: ("reward-icon") },
            }, ...__VLS_functionalComponentArgsRest(__VLS_153));
            __VLS_151.slots.default;
            var __VLS_151;
        }
        __VLS_145.slots.default;
        var __VLS_145;
        __VLS_elementAsFunction(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
            ...{ class: (" text-right text-caption") },
        });
        (event.date);
        __VLS_133.slots.default;
        var __VLS_133;
        __VLS_115.slots.default;
        var __VLS_115;
        __VLS_107.slots.default;
        var __VLS_107;
        __VLS_101.slots.default;
        var __VLS_101;
    }
    __VLS_95.slots.default;
    var __VLS_95;
    const __VLS_158 = {}.VDialog;
    /** @type { [typeof __VLS_components.VDialog, typeof __VLS_components.vDialog, typeof __VLS_components.VDialog, typeof __VLS_components.vDialog, ] } */ ;
    // @ts-ignore
    const __VLS_159 = __VLS_asFunctionalComponent(__VLS_158, new __VLS_158({
        modelValue: ((__VLS_ctx.dialog)),
        maxWidth: ("600"),
    }));
    const __VLS_160 = __VLS_159({
        modelValue: ((__VLS_ctx.dialog)),
        maxWidth: ("600"),
    }, ...__VLS_functionalComponentArgsRest(__VLS_159));
    const __VLS_164 = {}.VCard;
    /** @type { [typeof __VLS_components.VCard, typeof __VLS_components.vCard, typeof __VLS_components.VCard, typeof __VLS_components.vCard, ] } */ ;
    // @ts-ignore
    const __VLS_165 = __VLS_asFunctionalComponent(__VLS_164, new __VLS_164({
        color: ("surface"),
    }));
    const __VLS_166 = __VLS_165({
        color: ("surface"),
    }, ...__VLS_functionalComponentArgsRest(__VLS_165));
    const __VLS_170 = {}.VCardActions;
    /** @type { [typeof __VLS_components.VCardActions, typeof __VLS_components.vCardActions, typeof __VLS_components.VCardActions, typeof __VLS_components.vCardActions, ] } */ ;
    // @ts-ignore
    const __VLS_171 = __VLS_asFunctionalComponent(__VLS_170, new __VLS_170({
        ...{ class: ("d-flex justify-left") },
    }));
    const __VLS_172 = __VLS_171({
        ...{ class: ("d-flex justify-left") },
    }, ...__VLS_functionalComponentArgsRest(__VLS_171));
    const __VLS_176 = {}.VBtn;
    /** @type { [typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ] } */ ;
    // @ts-ignore
    const __VLS_177 = __VLS_asFunctionalComponent(__VLS_176, new __VLS_176({
        ...{ 'onClick': {} },
        color: ("red"),
    }));
    const __VLS_178 = __VLS_177({
        ...{ 'onClick': {} },
        color: ("red"),
    }, ...__VLS_functionalComponentArgsRest(__VLS_177));
    let __VLS_182;
    const __VLS_183 = {
        onClick: (...[$event]) => {
            __VLS_ctx.dialog = false;
        }
    };
    let __VLS_179;
    let __VLS_180;
    __VLS_181.slots.default;
    var __VLS_181;
    __VLS_175.slots.default;
    var __VLS_175;
    const __VLS_184 = {}.VCardTitle;
    /** @type { [typeof __VLS_components.VCardTitle, typeof __VLS_components.vCardTitle, typeof __VLS_components.VCardTitle, typeof __VLS_components.vCardTitle, ] } */ ;
    // @ts-ignore
    const __VLS_185 = __VLS_asFunctionalComponent(__VLS_184, new __VLS_184({
        ...{ class: ("ml-2 font-weight-bold") },
    }));
    const __VLS_186 = __VLS_185({
        ...{ class: ("ml-2 font-weight-bold") },
    }, ...__VLS_functionalComponentArgsRest(__VLS_185));
    (__VLS_ctx.selectedEvent?.name);
    __VLS_189.slots.default;
    var __VLS_189;
    const __VLS_190 = {}.VCardText;
    /** @type { [typeof __VLS_components.VCardText, typeof __VLS_components.vCardText, typeof __VLS_components.VCardText, typeof __VLS_components.vCardText, ] } */ ;
    // @ts-ignore
    const __VLS_191 = __VLS_asFunctionalComponent(__VLS_190, new __VLS_190({}));
    const __VLS_192 = __VLS_191({}, ...__VLS_functionalComponentArgsRest(__VLS_191));
    __VLS_elementAsFunction(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({});
    __VLS_elementAsFunction(__VLS_intrinsicElements.strong, __VLS_intrinsicElements.strong)({});
    (__VLS_ctx.selectedEvent?.eventdesc);
    __VLS_elementAsFunction(__VLS_intrinsicElements.br, __VLS_intrinsicElements.br)({});
    __VLS_elementAsFunction(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({});
    (__VLS_ctx.selectedEvent?.eventseats);
    __VLS_elementAsFunction(__VLS_intrinsicElements.br, __VLS_intrinsicElements.br)({});
    __VLS_elementAsFunction(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
        ...{ class: ("text-end scheduled-box") },
    });
    (__VLS_ctx.selectedEvent?.date);
    (__VLS_ctx.selectedEvent?.hour);
    (__VLS_ctx.selectedEvent?.ampm);
    __VLS_195.slots.default;
    var __VLS_195;
    const __VLS_196 = {}.VCard;
    /** @type { [typeof __VLS_components.VCard, typeof __VLS_components.vCard, typeof __VLS_components.VCard, typeof __VLS_components.vCard, ] } */ ;
    // @ts-ignore
    const __VLS_197 = __VLS_asFunctionalComponent(__VLS_196, new __VLS_196({
        color: ("primary"),
        minHeight: ("130px"),
        ...{ class: ("mr-4 event-card") },
    }));
    const __VLS_198 = __VLS_197({
        color: ("primary"),
        minHeight: ("130px"),
        ...{ class: ("mr-4 event-card") },
    }, ...__VLS_functionalComponentArgsRest(__VLS_197));
    const __VLS_202 = {}.VRow;
    /** @type { [typeof __VLS_components.VRow, typeof __VLS_components.vRow, typeof __VLS_components.VRow, typeof __VLS_components.vRow, ] } */ ;
    // @ts-ignore
    const __VLS_203 = __VLS_asFunctionalComponent(__VLS_202, new __VLS_202({
        noGutters: (true),
    }));
    const __VLS_204 = __VLS_203({
        noGutters: (true),
    }, ...__VLS_functionalComponentArgsRest(__VLS_203));
    const __VLS_208 = {}.VCol;
    /** @type { [typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ] } */ ;
    // @ts-ignore
    const __VLS_209 = __VLS_asFunctionalComponent(__VLS_208, new __VLS_208({
        cols: ("3"),
        lg: ("3"),
    }));
    const __VLS_210 = __VLS_209({
        cols: ("3"),
        lg: ("3"),
    }, ...__VLS_functionalComponentArgsRest(__VLS_209));
    const __VLS_214 = {}.VImg;
    /** @type { [typeof __VLS_components.VImg, typeof __VLS_components.vImg, typeof __VLS_components.VImg, typeof __VLS_components.vImg, ] } */ ;
    // @ts-ignore
    const __VLS_215 = __VLS_asFunctionalComponent(__VLS_214, new __VLS_214({
        src: ((__VLS_ctx.selectedEvent?.shopimage)),
        ...{ class: (" event-img") },
    }));
    const __VLS_216 = __VLS_215({
        src: ((__VLS_ctx.selectedEvent?.shopimage)),
        ...{ class: (" event-img") },
    }, ...__VLS_functionalComponentArgsRest(__VLS_215));
    __VLS_213.slots.default;
    var __VLS_213;
    const __VLS_220 = {}.VCol;
    /** @type { [typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ] } */ ;
    // @ts-ignore
    const __VLS_221 = __VLS_asFunctionalComponent(__VLS_220, new __VLS_220({
        cols: ("9"),
        ...{ class: ("pa-2") },
    }));
    const __VLS_222 = __VLS_221({
        cols: ("9"),
        ...{ class: ("pa-2") },
    }, ...__VLS_functionalComponentArgsRest(__VLS_221));
    __VLS_elementAsFunction(__VLS_intrinsicElements.h3, __VLS_intrinsicElements.h3)({
        ...{ class: ("text-subtitle-1 font-weight-bold") },
    });
    (__VLS_ctx.selectedEvent?.shopname);
    __VLS_elementAsFunction(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
        ...{ class: ("text-caption") },
    });
    const __VLS_226 = {}.VIcon;
    /** @type { [typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, ] } */ ;
    // @ts-ignore
    const __VLS_227 = __VLS_asFunctionalComponent(__VLS_226, new __VLS_226({
        color: ("red"),
    }));
    const __VLS_228 = __VLS_227({
        color: ("red"),
    }, ...__VLS_functionalComponentArgsRest(__VLS_227));
    __VLS_231.slots.default;
    var __VLS_231;
    (__VLS_ctx.selectedEvent?.location);
    __VLS_elementAsFunction(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
        ...{ class: ("text-caption") },
    });
    for (const [n] of __VLS_getVForSourceType((4))) {
        const __VLS_232 = {}.VIcon;
        /** @type { [typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, ] } */ ;
        // @ts-ignore
        const __VLS_233 = __VLS_asFunctionalComponent(__VLS_232, new __VLS_232({
            key: ((n)),
            size: ("18"),
        }));
        const __VLS_234 = __VLS_233({
            key: ((n)),
            size: ("18"),
        }, ...__VLS_functionalComponentArgsRest(__VLS_233));
        __VLS_237.slots.default;
        var __VLS_237;
    }
    __VLS_225.slots.default;
    var __VLS_225;
    const __VLS_238 = {}.VCol;
    /** @type { [typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ] } */ ;
    // @ts-ignore
    const __VLS_239 = __VLS_asFunctionalComponent(__VLS_238, new __VLS_238({
        cols: ("2"),
        ...{ class: ("text-right pa-0") },
    }));
    const __VLS_240 = __VLS_239({
        cols: ("2"),
        ...{ class: ("text-right pa-0") },
    }, ...__VLS_functionalComponentArgsRest(__VLS_239));
    __VLS_207.slots.default;
    var __VLS_207;
    __VLS_201.slots.default;
    var __VLS_201;
    const __VLS_244 = {}.VCardText;
    /** @type { [typeof __VLS_components.VCardText, typeof __VLS_components.vCardText, typeof __VLS_components.VCardText, typeof __VLS_components.vCardText, ] } */ ;
    // @ts-ignore
    const __VLS_245 = __VLS_asFunctionalComponent(__VLS_244, new __VLS_244({}));
    const __VLS_246 = __VLS_245({}, ...__VLS_functionalComponentArgsRest(__VLS_245));
    __VLS_elementAsFunction(__VLS_intrinsicElements.h3, __VLS_intrinsicElements.h3)({
        ...{ class: ("text-h6 font-weight-bold") },
    });
    for (const [reward, index] of __VLS_getVForSourceType((__VLS_ctx.selectedEvent?.rewards))) {
        const __VLS_250 = {}.VRow;
        /** @type { [typeof __VLS_components.VRow, typeof __VLS_components.vRow, typeof __VLS_components.VRow, typeof __VLS_components.vRow, ] } */ ;
        // @ts-ignore
        const __VLS_251 = __VLS_asFunctionalComponent(__VLS_250, new __VLS_250({
            key: ((index)),
            ...{ class: ("align-center my-2") },
        }));
        const __VLS_252 = __VLS_251({
            key: ((index)),
            ...{ class: ("align-center my-2") },
        }, ...__VLS_functionalComponentArgsRest(__VLS_251));
        const __VLS_256 = {}.VCol;
        /** @type { [typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ] } */ ;
        // @ts-ignore
        const __VLS_257 = __VLS_asFunctionalComponent(__VLS_256, new __VLS_256({
            cols: ("3"),
            md: ("2"),
        }));
        const __VLS_258 = __VLS_257({
            cols: ("3"),
            md: ("2"),
        }, ...__VLS_functionalComponentArgsRest(__VLS_257));
        const __VLS_262 = {}.VAvatar;
        /** @type { [typeof __VLS_components.VAvatar, typeof __VLS_components.vAvatar, typeof __VLS_components.VAvatar, typeof __VLS_components.vAvatar, ] } */ ;
        // @ts-ignore
        const __VLS_263 = __VLS_asFunctionalComponent(__VLS_262, new __VLS_262({
            size: ("60"),
        }));
        const __VLS_264 = __VLS_263({
            size: ("60"),
        }, ...__VLS_functionalComponentArgsRest(__VLS_263));
        const __VLS_268 = {}.VImg;
        /** @type { [typeof __VLS_components.VImg, typeof __VLS_components.vImg, typeof __VLS_components.VImg, typeof __VLS_components.vImg, ] } */ ;
        // @ts-ignore
        const __VLS_269 = __VLS_asFunctionalComponent(__VLS_268, new __VLS_268({
            src: ((reward.image)),
        }));
        const __VLS_270 = __VLS_269({
            src: ((reward.image)),
        }, ...__VLS_functionalComponentArgsRest(__VLS_269));
        __VLS_267.slots.default;
        var __VLS_267;
        __VLS_261.slots.default;
        var __VLS_261;
        const __VLS_274 = {}.VCol;
        /** @type { [typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ] } */ ;
        // @ts-ignore
        const __VLS_275 = __VLS_asFunctionalComponent(__VLS_274, new __VLS_274({
            cols: ("9"),
            md: ("10"),
        }));
        const __VLS_276 = __VLS_275({
            cols: ("9"),
            md: ("10"),
        }, ...__VLS_functionalComponentArgsRest(__VLS_275));
        __VLS_elementAsFunction(__VLS_intrinsicElements.h4, __VLS_intrinsicElements.h4)({
            ...{ class: ("text-subtitle-1 font-weight-bold") },
        });
        (reward.name);
        __VLS_elementAsFunction(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
            ...{ class: ("text-body-2") },
        });
        (reward.description);
        __VLS_279.slots.default;
        var __VLS_279;
        __VLS_255.slots.default;
        var __VLS_255;
    }
    __VLS_249.slots.default;
    var __VLS_249;
    const __VLS_280 = {}.VRow;
    /** @type { [typeof __VLS_components.VRow, typeof __VLS_components.vRow, typeof __VLS_components.VRow, typeof __VLS_components.vRow, ] } */ ;
    // @ts-ignore
    const __VLS_281 = __VLS_asFunctionalComponent(__VLS_280, new __VLS_280({
        ...{ class: ("mt-2 ml-0") },
    }));
    const __VLS_282 = __VLS_281({
        ...{ class: ("mt-2 ml-0") },
    }, ...__VLS_functionalComponentArgsRest(__VLS_281));
    const __VLS_286 = {}.VCol;
    /** @type { [typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ] } */ ;
    // @ts-ignore
    const __VLS_287 = __VLS_asFunctionalComponent(__VLS_286, new __VLS_286({
        cols: ("6"),
        ...{ class: ("pa-0") },
    }));
    const __VLS_288 = __VLS_287({
        cols: ("6"),
        ...{ class: ("pa-0") },
    }, ...__VLS_functionalComponentArgsRest(__VLS_287));
    const __VLS_292 = {}.VBtn;
    /** @type { [typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ] } */ ;
    // @ts-ignore
    const __VLS_293 = __VLS_asFunctionalComponent(__VLS_292, new __VLS_292({
        ...{ 'onClick': {} },
        block: (true),
        color: ("#907041"),
        ...{ class: ("rounded-0") },
    }));
    const __VLS_294 = __VLS_293({
        ...{ 'onClick': {} },
        block: (true),
        color: ("#907041"),
        ...{ class: ("rounded-0") },
    }, ...__VLS_functionalComponentArgsRest(__VLS_293));
    let __VLS_298;
    const __VLS_299 = {
        onClick: (__VLS_ctx.joinEvent)
    };
    let __VLS_295;
    let __VLS_296;
    __VLS_297.slots.default;
    var __VLS_297;
    __VLS_291.slots.default;
    var __VLS_291;
    const __VLS_300 = {}.VCol;
    /** @type { [typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ] } */ ;
    // @ts-ignore
    const __VLS_301 = __VLS_asFunctionalComponent(__VLS_300, new __VLS_300({
        cols: ("6"),
        ...{ class: ("pa-0") },
    }));
    const __VLS_302 = __VLS_301({
        cols: ("6"),
        ...{ class: ("pa-0") },
    }, ...__VLS_functionalComponentArgsRest(__VLS_301));
    const __VLS_306 = {}.VBtn;
    /** @type { [typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ] } */ ;
    // @ts-ignore
    const __VLS_307 = __VLS_asFunctionalComponent(__VLS_306, new __VLS_306({
        ...{ 'onClick': {} },
        block: (true),
        color: ("#539041"),
        ...{ class: ("rounded-0") },
    }));
    const __VLS_308 = __VLS_307({
        ...{ 'onClick': {} },
        block: (true),
        color: ("#539041"),
        ...{ class: ("rounded-0") },
    }, ...__VLS_functionalComponentArgsRest(__VLS_307));
    let __VLS_312;
    const __VLS_313 = {
        onClick: (__VLS_ctx.joinEvent)
    };
    let __VLS_309;
    let __VLS_310;
    __VLS_311.slots.default;
    var __VLS_311;
    __VLS_305.slots.default;
    var __VLS_305;
    __VLS_285.slots.default;
    var __VLS_285;
    __VLS_169.slots.default;
    var __VLS_169;
    __VLS_163.slots.default;
    var __VLS_163;
    __VLS_23.slots.default;
    var __VLS_23;
    __VLS_17.slots.default;
    var __VLS_17;
    ['', 'text-center', 'cinzel-text', 'font-weight-black', 'pt-15', 'pb-4', 'justify-center', 'text-center', 'text-h2', 'mx-auto', 'pb-12', 'black-bar', 'SortBy', 'align-center', 'text-white', 'sort-btn', 'active', 'sort-btn', 'active', 'sort-btn', 'active', 'py-2', 'pl-1', 'pr-1', 'pt-0', 'event-card', 'mt-3', 'event-img', 'pt-2', 'pl-2', 'text-caption', 'text-truncate', 'text-caption', 'd-flex', 'align-center', 'rewards-container', 'reward-icon', 'text-right', 'text-caption', 'd-flex', 'justify-left', 'ml-2', 'font-weight-bold', 'text-end', 'scheduled-box', 'mr-4', 'event-card', 'event-img', 'pa-2', 'text-subtitle-1', 'font-weight-bold', 'text-caption', 'text-caption', 'text-right', 'pa-0', 'text-h6', 'font-weight-bold', 'align-center', 'my-2', 'text-subtitle-1', 'font-weight-bold', 'text-body-2', 'mt-2', 'ml-0', 'pa-0', 'rounded-0', 'pa-0', 'rounded-0',];
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
            dialog: dialog,
            selectedEvent: selectedEvent,
            openDialog: openDialog,
            joinEvent: joinEvent,
            sortBy: sortBy,
            sortedEvents: sortedEvents,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
