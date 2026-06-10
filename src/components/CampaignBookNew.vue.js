/// <reference types="../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import { ref, computed, watch, nextTick, } from "vue";
import KeywordView from "@/components/KeywordView.vue";
import InteractView from "@/components/InteractViewNew.vue";
import startHereData from "@/data/book/StartHere.json";
import startHereS1Data from "@/data/book/StartHereS1.json";
import bookPagesData from "@/data/book/bookPages.json";
import gameMechanicsData from "@/data/book/gameMechanicsRulebook.json";
import playerTutorialsData from "@/data/book/playerTutorials.json";
import firstEncounterClarificationsData from "@/data/book/firstEncounterClarifications.json";
import secondEncounterClarificationsData from "@/data/book/secondEncounterClarifications.json";
import dragonClarificationsData from "@/data/book/dragonClarifications.json";
import booktopImg from "@/assets/booktop.png";
import booktops2Img from "@/assets/booktops2.png";
import { useDisplay } from "vuetify";
const { smAndDown } = useDisplay();
const props = defineProps();
const isSeason1 = computed(() => {
    const t = (props.campaignType || "").toLowerCase();
    if (t === 'core' || t === 'apocalypse' || t === 'awakenings')
        return true;
    const wingKey = (props.campaignWing || "").toUpperCase();
    if (wingKey.includes("WING 1") || wingKey.includes("WING 2"))
        return true;
    const activeKey = (props.activeWing || "").toUpperCase();
    if (activeKey.includes("WING 1") || activeKey.includes("WING 2") || activeKey.includes("WING 01") || activeKey.includes("WING 02"))
        return true;
    return false;
});
const mobileMenuSheet = ref(false);
const mobileNavValue = ref("menu");
const openGroups = ref([]);
const currentView = ref("player");
const currentIndex = ref(0);
const activeItemId = ref(null);
const currentVolumeId = ref(null);
const isFullscreen = ref(false);
const scrollableContentRef = ref(null);
const interactViewRef = ref(null);
const rawStartHere = startHereData;
const rawStartHereS1 = startHereS1Data;
const rawStoryBooks = bookPagesData;
const availableVolumes = computed(() => {
    const vols = [];
    const wingKey = (props.campaignWing || "").toUpperCase();
    const isS1 = isSeason1.value;
    // Start Here volume should be accessible in Wing 3, Wing 1, or Tutorial
    const showStartHere = wingKey.includes("WING 3") || wingKey.includes("WING 1") || wingKey.includes("TUTORIAL") || wingKey.includes("START");
    if (showStartHere) {
        vols.push({
            id: 'start_here',
            title: 'Start Here',
            subtitle: 'Tutorial',
            icon: 'mdi-school',
            type: 'story',
            data: isS1 ? rawStartHereS1 : rawStartHere
        });
    }
    if (wingKey.includes("TUTORIAL") || wingKey.includes("WING 1 TUTORIAL")) {
        vols.push({
            id: 'wing_1_tutorial',
            title: 'Wing 1 Tutorial',
            subtitle: 'Campaign Book',
            icon: 'mdi-book-open-variant',
            type: 'story',
            data: rawStoryBooks.filter(p => p.section.toUpperCase().includes("WING 1 - TUTORIAL"))
        });
    }
    else if (wingKey.includes("WING 1 ADVANCED")) {
        vols.push({
            id: 'wing_1_advanced',
            title: 'Wing 1 Advanced',
            subtitle: 'Campaign Book',
            icon: 'mdi-sword',
            type: 'story',
            data: rawStoryBooks.filter(p => p.section.toUpperCase().includes("WING 1 - ADVANCED"))
        });
    }
    else if (wingKey.includes("WING 2 ADVANCED") || wingKey.includes("WING 2")) {
        vols.push({
            id: 'wing_2_advanced',
            title: 'Wing 2 Advanced',
            subtitle: 'Campaign Book',
            icon: 'mdi-shield',
            type: 'story',
            data: rawStoryBooks.filter(p => p.section.toUpperCase().includes("WING 2 - ADVANCED"))
        });
    }
    else if (wingKey.includes("WING 3")) {
        vols.push({
            id: 'wing_3',
            title: 'The Underkeep',
            subtitle: 'Wing 3',
            icon: 'mdi-sword-cross',
            type: 'story',
            data: rawStoryBooks.filter(p => p.section.toUpperCase().includes("WING 3"))
        });
    }
    else if (wingKey.includes("WING 4")) {
        vols.push({
            id: 'wing_4',
            title: 'Draconic Abyss',
            subtitle: 'Wing 4',
            icon: 'mdi-fire',
            type: 'story',
            data: rawStoryBooks.filter(p => p.section.toUpperCase().includes("WING 4"))
        });
    }
    else {
        // If no wing is explicitly active/selected, show all standard volumes
        vols.push({
            id: 'wing_1_tutorial',
            title: 'Wing 1 Tutorial',
            subtitle: 'Campaign Book',
            icon: 'mdi-book-open-variant',
            type: 'story',
            data: rawStoryBooks.filter(p => p.section.toUpperCase().includes("WING 1 - TUTORIAL"))
        });
        vols.push({
            id: 'wing_1_advanced',
            title: 'Wing 1 Advanced',
            subtitle: 'Campaign Book',
            icon: 'mdi-sword',
            type: 'story',
            data: rawStoryBooks.filter(p => p.section.toUpperCase().includes("WING 1 - ADVANCED"))
        });
        vols.push({
            id: 'wing_2_advanced',
            title: 'Wing 2 Advanced',
            subtitle: 'Campaign Book',
            icon: 'mdi-shield',
            type: 'story',
            data: rawStoryBooks.filter(p => p.section.toUpperCase().includes("WING 2 - ADVANCED"))
        });
        vols.push({
            id: 'wing_3',
            title: 'The Underkeep',
            subtitle: 'Wing 3',
            icon: 'mdi-sword-cross',
            type: 'story',
            data: rawStoryBooks.filter(p => p.section.toUpperCase().includes("WING 3"))
        });
        vols.push({
            id: 'wing_4',
            title: 'Draconic Abyss',
            subtitle: 'Wing 4',
            icon: 'mdi-fire',
            type: 'story',
            data: rawStoryBooks.filter(p => p.section.toUpperCase().includes("WING 4"))
        });
    }
    vols.push({ id: 'tutorials', title: 'Tutorials', subtitle: 'Reference', icon: 'mdi-help-circle-outline', type: 'reference', data: playerTutorialsData });
    vols.push({ id: 'mechanics', title: 'Game Mechanics', subtitle: 'Rules', icon: 'mdi-cogs', type: 'reference', data: gameMechanicsData });
    vols.push({ id: 'enc_1', title: '1st Encounter', subtitle: 'Rules', icon: 'mdi-numeric-1-box-outline', type: 'reference', data: firstEncounterClarificationsData });
    vols.push({ id: 'enc_2', title: '2nd Encounter', subtitle: 'Rules', icon: 'mdi-numeric-2-box-outline', type: 'reference', data: secondEncounterClarificationsData });
    // Dragon clarification book is not available in Season 1
    if (!isS1) {
        vols.push({ id: 'dragon', title: 'Dragon Boss', subtitle: 'Rules', icon: 'mdi-alpha-d-box-outline', type: 'reference', data: dragonClarificationsData });
    }
    return vols;
});
const storyVolumes = computed(() => availableVolumes.value.filter(v => v.type === 'story'));
const referenceVolumes = computed(() => availableVolumes.value.filter(v => v.type === 'reference'));
const currentVolume = computed(() => availableVolumes.value.find(v => v.id === currentVolumeId.value));
const storyPages = computed(() => {
    if (currentVolume.value?.type === 'story') {
        return currentVolume.value.data;
    }
    return [];
});
const currentPage = computed(() => {
    if (currentView.value !== "player" || !storyPages.value.length)
        return null;
    const clamped = Math.max(0, Math.min(currentIndex.value, storyPages.value.length - 1));
    return storyPages.value[clamped] || null;
});
const currentAuxiliaryData = computed(() => {
    if (currentVolume.value?.type !== 'reference')
        return { pageTitle: '', chapterTitle: '', chapters: [] };
    const raw = currentVolume.value.data;
    const normalizedChapters = [];
    if (currentVolumeId.value === 'mechanics') {
        const sections = raw.mechanics.map((m, i) => ({ id: `mech-${i}`, title: m.title, body: m.bodyHTML }));
        normalizedChapters.push({ title: 'Game Mechanics', sections });
    }
    else if (currentVolumeId.value === 'tutorials') {
        raw.chapters.forEach((ch, cIdx) => {
            const sections = ch.tutorials.map((t, sIdx) => ({ id: `tut-${cIdx}-${sIdx}`, title: t.title, body: t.bodyHTML }));
            normalizedChapters.push({ title: ch.chapterTitle, sections });
        });
    }
    else {
        raw.chapters.forEach((ch, cIdx) => {
            const sections = ch.sections.map((s, sIdx) => ({ id: `ref-${cIdx}-${sIdx}`, title: s.title, body: s.bodyHTML }));
            normalizedChapters.push({ title: ch.chapterTitle, sections });
        });
    }
    const chapTitle = normalizedChapters[0]?.title || raw.chapterTitle || "";
    return {
        pageTitle: raw.pageTitle || currentVolume.value?.title,
        chapterTitle: chapTitle,
        chapters: normalizedChapters
    };
});
const isAuxiliaryView = computed(() => currentVolume.value?.type === 'reference');
const currentVolumeGroups = computed(() => {
    const groups = {};
    if (currentVolume.value?.type === 'story') {
        storyPages.value.forEach((section, sIdx) => {
            const items = [];
            section.content.forEach((c, cIdx) => {
                if (c.title) {
                    items.push({
                        id: c.id,
                        title: c.title,
                        sectionTitle: section.section,
                        originalId: `content-block-${sIdx}-${cIdx}`,
                        viewType: 'player',
                        sectionIndex: sIdx
                    });
                }
            });
            if (items.length)
                groups[section.section] = items;
        });
    }
    else if (currentVolume.value?.type === 'reference') {
        currentAuxiliaryData.value.chapters.forEach(ch => {
            const items = [];
            ch.sections.forEach(sec => {
                items.push({
                    id: sec.id,
                    title: sec.title,
                    sectionTitle: ch.title,
                    targetId: sec.id,
                    viewType: currentVolumeId.value
                });
            });
            if (items.length)
                groups[ch.title] = items;
        });
    }
    return groups;
});
const flatNavigationItems = computed(() => {
    const all = [];
    Object.values(currentVolumeGroups.value).forEach(group => all.push(...group));
    return all;
});
function backToLibrary() {
    currentVolumeId.value = null;
    mobileMenuSheet.value = false;
    currentView.value = 'player';
    scrollToTop();
}
function switchVolume(volId) {
    currentVolumeId.value = volId;
    const vol = availableVolumes.value.find(v => v.id === volId);
    if (vol?.type === 'story') {
        currentView.value = 'player';
        currentIndex.value = 0;
    }
    else {
        currentView.value = volId;
    }
    const keys = Object.keys(currentVolumeGroups.value);
    if (keys.length)
        openGroups.value = [keys[0]];
    scrollToTop();
}
function handleMobileNavigation(item) {
    activeItemId.value = item.id;
    mobileMenuSheet.value = false;
    if (item.viewType === 'player') {
        if (typeof item.sectionIndex === 'number') {
            currentIndex.value = item.sectionIndex;
            nextTick(() => {
                setTimeout(() => {
                    if (item.originalId)
                        scrollToElement(item.originalId);
                    else
                        scrollToTop();
                }, 150);
            });
        }
    }
    else {
        nextTick(() => {
            setTimeout(() => {
                if (item.targetId)
                    scrollToElement(item.targetId);
                else
                    scrollToTop();
            }, 150);
        });
    }
}
function scrollToElement(id) {
    const el = document.getElementById(id);
    const container = scrollableContentRef.value;
    if (el && container) {
        const top = el.getBoundingClientRect().top - container.getBoundingClientRect().top + container.scrollTop - 20;
        container.scrollTo({ top, behavior: 'smooth' });
    }
}
function scrollToTop() {
    if (scrollableContentRef.value)
        scrollableContentRef.value.scrollTop = 0;
}
const headerBannerStyle = computed(() => {
    const isS1 = isSeason1.value;
    let img = booktopImg;
    const vol = currentVolume.value;
    const id = currentVolumeId.value || "";
    const title = (vol?.title || "").toUpperCase();
    const subtitle = (vol?.subtitle || "").toUpperCase();
    if ((id === 'start_here' && !isS1) ||
        id === 'dragon' ||
        subtitle.includes("WING 3") ||
        subtitle.includes("WING 4") ||
        title.includes("WING 3") ||
        title.includes("WING 4")) {
        img = booktops2Img;
    }
    return { backgroundImage: `url(${img})` };
});
const isFullScreenWithBackground = computed(() => currentPage.value?.layout === 'full-screen' && !!currentPage.value?.background);
const backgroundStyle = computed(() => {
    if (!currentPage.value)
        return {};
    const s = { position: "relative", color: "#191919", borderRadius: "8px" };
    if (currentPage.value.background) {
        s.background = currentPage.value.background;
        s.backgroundSize = "cover";
        s.backgroundRepeat = "no-repeat";
        s.backgroundPosition = "center center";
    }
    else {
        s.backgroundColor = "#1c1c1c";
    }
    return s;
});
watch(() => props.campaignWing, (val) => {
    const key = (val || "").toUpperCase();
    if (key.includes("START")) {
        currentVolumeId.value = "start_here";
    }
    else {
        currentVolumeId.value = null;
    }
    scrollToTop();
}, { immediate: true });
function exitToolMode() {
    mobileNavValue.value = 'menu';
    if (currentVolumeId.value) {
        const vol = availableVolumes.value.find(v => v.id === currentVolumeId.value);
        if (vol?.type === 'story')
            currentView.value = 'player';
        else
            currentView.value = currentVolumeId.value;
    }
    else {
        currentView.value = 'player';
    }
}
function navigateToInteract() {
    if (currentView.value === 'interactions') {
        exitToolMode();
    }
    else {
        mobileNavValue.value = 'interactions';
        currentView.value = 'interactions';
    }
}
function forceNavigateToInteract() {
    mobileNavValue.value = 'interactions';
    currentView.value = 'interactions';
}
function navigateToKeywords() {
    if (currentView.value === 'keywords') {
        exitToolMode();
    }
    else {
        mobileNavValue.value = 'keywords';
        currentView.value = 'keywords';
    }
}
function onScroll() { }
function handlePageClick() { }
watch(mobileNavValue, (val) => {
    if (val === 'menu') {
        if (currentVolumeId.value) {
            switchVolume(currentVolumeId.value);
        }
        else {
            currentView.value = 'player';
            scrollToTop();
        }
    }
    else if (val === 'keywords') {
        currentView.value = 'keywords';
        scrollToTop();
    }
    else if (val === 'interactions') {
        currentView.value = 'interactions';
        scrollToTop();
    }
});
function handleOpenSceneFromInternal(target) {
    currentView.value = 'player';
    openSceneByTarget(target);
}
function openSceneByTarget(target) {
    let titleTarget = target.toLowerCase().replace(/scene\s*[-–]\s*/, "").trim().replace(/-/g, " ");
    let foundVolId = null;
    let foundSectionIndex = -1;
    let foundItemOriginalId = null;
    for (const vol of availableVolumes.value) {
        if (vol.type !== 'story')
            continue;
        const sections = vol.data;
        for (let sIdx = 0; sIdx < sections.length; sIdx++) {
            const sec = sections[sIdx];
            for (let cIdx = 0; cIdx < sec.content.length; cIdx++) {
                const item = sec.content[cIdx];
                const itemTitle = (item.title || "").toLowerCase().trim();
                if (item.id === target ||
                    itemTitle === titleTarget ||
                    itemTitle.replace(/[^a-z0-9]/g, "") === titleTarget.replace(/[^a-z0-9]/g, "")) {
                    foundVolId = vol.id;
                    foundSectionIndex = sIdx;
                    foundItemOriginalId = `content-block-${sIdx}-${cIdx}`;
                    break;
                }
            }
            if (foundVolId)
                break;
        }
        if (foundVolId)
            break;
    }
    if (foundVolId) {
        currentVolumeId.value = foundVolId;
        currentView.value = 'player';
        currentIndex.value = foundSectionIndex;
        nextTick(() => {
            setTimeout(() => {
                if (foundItemOriginalId)
                    scrollToElement(foundItemOriginalId);
            }, 300);
        });
    }
}
const __VLS_exposed = { navigateToInteract, forceNavigateToInteract, navigateToKeywords, openSceneByTarget };
defineExpose(__VLS_exposed);
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['book-container']} */ ;
/** @type {__VLS_StyleScopedClasses['library-card']} */ ;
/** @type {__VLS_StyleScopedClasses['content-block']} */ ;
/** @type {__VLS_StyleScopedClasses['body-text-mechanics']} */ ;
/** @type {__VLS_StyleScopedClasses['header-banner']} */ ;
/** @type {__VLS_StyleScopedClasses['chapter-title-banner']} */ ;
/** @type {__VLS_StyleScopedClasses['section-title']} */ ;
/** @type {__VLS_StyleScopedClasses['content-container']} */ ;
/** @type {__VLS_StyleScopedClasses['library-container']} */ ;
/** @type {__VLS_StyleScopedClasses['library-card']} */ ;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "book-container" },
});
const __VLS_0 = {}.VBottomSheet;
/** @type {[typeof __VLS_components.VBottomSheet, typeof __VLS_components.vBottomSheet, typeof __VLS_components.VBottomSheet, typeof __VLS_components.vBottomSheet, ]} */ ;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
    modelValue: (__VLS_ctx.mobileMenuSheet),
}));
const __VLS_2 = __VLS_1({
    modelValue: (__VLS_ctx.mobileMenuSheet),
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
__VLS_3.slots.default;
const __VLS_4 = {}.VCard;
/** @type {[typeof __VLS_components.VCard, typeof __VLS_components.vCard, typeof __VLS_components.VCard, typeof __VLS_components.vCard, ]} */ ;
// @ts-ignore
const __VLS_5 = __VLS_asFunctionalComponent(__VLS_4, new __VLS_4({
    ...{ class: "mobile-menu-card" },
}));
const __VLS_6 = __VLS_5({
    ...{ class: "mobile-menu-card" },
}, ...__VLS_functionalComponentArgsRest(__VLS_5));
__VLS_7.slots.default;
const __VLS_8 = {}.VToolbar;
/** @type {[typeof __VLS_components.VToolbar, typeof __VLS_components.vToolbar, typeof __VLS_components.VToolbar, typeof __VLS_components.vToolbar, ]} */ ;
// @ts-ignore
const __VLS_9 = __VLS_asFunctionalComponent(__VLS_8, new __VLS_8({
    color: "surface",
    density: "compact",
    ...{ class: "border-b" },
}));
const __VLS_10 = __VLS_9({
    color: "surface",
    density: "compact",
    ...{ class: "border-b" },
}, ...__VLS_functionalComponentArgsRest(__VLS_9));
__VLS_11.slots.default;
if (__VLS_ctx.currentVolumeId) {
    const __VLS_12 = {}.VBtn;
    /** @type {[typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ]} */ ;
    // @ts-ignore
    const __VLS_13 = __VLS_asFunctionalComponent(__VLS_12, new __VLS_12({
        ...{ 'onClick': {} },
        icon: true,
        size: "small",
    }));
    const __VLS_14 = __VLS_13({
        ...{ 'onClick': {} },
        icon: true,
        size: "small",
    }, ...__VLS_functionalComponentArgsRest(__VLS_13));
    let __VLS_16;
    let __VLS_17;
    let __VLS_18;
    const __VLS_19 = {
        onClick: (__VLS_ctx.backToLibrary)
    };
    __VLS_15.slots.default;
    const __VLS_20 = {}.VIcon;
    /** @type {[typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, ]} */ ;
    // @ts-ignore
    const __VLS_21 = __VLS_asFunctionalComponent(__VLS_20, new __VLS_20({}));
    const __VLS_22 = __VLS_21({}, ...__VLS_functionalComponentArgsRest(__VLS_21));
    __VLS_23.slots.default;
    var __VLS_23;
    var __VLS_15;
}
const __VLS_24 = {}.VToolbarTitle;
/** @type {[typeof __VLS_components.VToolbarTitle, typeof __VLS_components.vToolbarTitle, typeof __VLS_components.VToolbarTitle, typeof __VLS_components.vToolbarTitle, ]} */ ;
// @ts-ignore
const __VLS_25 = __VLS_asFunctionalComponent(__VLS_24, new __VLS_24({
    ...{ class: "text-subtitle-2 font-weight-bold ml-2" },
}));
const __VLS_26 = __VLS_25({
    ...{ class: "text-subtitle-2 font-weight-bold ml-2" },
}, ...__VLS_functionalComponentArgsRest(__VLS_25));
__VLS_27.slots.default;
(__VLS_ctx.currentVolume?.title || "Library");
var __VLS_27;
const __VLS_28 = {}.VSpacer;
/** @type {[typeof __VLS_components.VSpacer, typeof __VLS_components.vSpacer, ]} */ ;
// @ts-ignore
const __VLS_29 = __VLS_asFunctionalComponent(__VLS_28, new __VLS_28({}));
const __VLS_30 = __VLS_29({}, ...__VLS_functionalComponentArgsRest(__VLS_29));
const __VLS_32 = {}.VBtn;
/** @type {[typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ]} */ ;
// @ts-ignore
const __VLS_33 = __VLS_asFunctionalComponent(__VLS_32, new __VLS_32({
    ...{ 'onClick': {} },
    icon: true,
    size: "small",
}));
const __VLS_34 = __VLS_33({
    ...{ 'onClick': {} },
    icon: true,
    size: "small",
}, ...__VLS_functionalComponentArgsRest(__VLS_33));
let __VLS_36;
let __VLS_37;
let __VLS_38;
const __VLS_39 = {
    onClick: (...[$event]) => {
        __VLS_ctx.mobileMenuSheet = false;
    }
};
__VLS_35.slots.default;
const __VLS_40 = {}.VIcon;
/** @type {[typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, ]} */ ;
// @ts-ignore
const __VLS_41 = __VLS_asFunctionalComponent(__VLS_40, new __VLS_40({}));
const __VLS_42 = __VLS_41({}, ...__VLS_functionalComponentArgsRest(__VLS_41));
__VLS_43.slots.default;
var __VLS_43;
var __VLS_35;
var __VLS_11;
const __VLS_44 = {}.VList;
/** @type {[typeof __VLS_components.VList, typeof __VLS_components.vList, typeof __VLS_components.VList, typeof __VLS_components.vList, ]} */ ;
// @ts-ignore
const __VLS_45 = __VLS_asFunctionalComponent(__VLS_44, new __VLS_44({
    ...{ class: "mobile-menu-list" },
    opened: (__VLS_ctx.openGroups),
    density: "compact",
}));
const __VLS_46 = __VLS_45({
    ...{ class: "mobile-menu-list" },
    opened: (__VLS_ctx.openGroups),
    density: "compact",
}, ...__VLS_functionalComponentArgsRest(__VLS_45));
__VLS_47.slots.default;
for (const [sectionItems, sectionName] of __VLS_getVForSourceType((__VLS_ctx.currentVolumeGroups))) {
    const __VLS_48 = {}.VListGroup;
    /** @type {[typeof __VLS_components.VListGroup, typeof __VLS_components.vListGroup, typeof __VLS_components.VListGroup, typeof __VLS_components.vListGroup, ]} */ ;
    // @ts-ignore
    const __VLS_49 = __VLS_asFunctionalComponent(__VLS_48, new __VLS_48({
        key: (String(sectionName)),
        value: (String(sectionName)),
    }));
    const __VLS_50 = __VLS_49({
        key: (String(sectionName)),
        value: (String(sectionName)),
    }, ...__VLS_functionalComponentArgsRest(__VLS_49));
    __VLS_51.slots.default;
    {
        const { activator: __VLS_thisSlot } = __VLS_51.slots;
        const [{ props }] = __VLS_getSlotParams(__VLS_thisSlot);
        const __VLS_52 = {}.VListItem;
        /** @type {[typeof __VLS_components.VListItem, typeof __VLS_components.vListItem, typeof __VLS_components.VListItem, typeof __VLS_components.vListItem, ]} */ ;
        // @ts-ignore
        const __VLS_53 = __VLS_asFunctionalComponent(__VLS_52, new __VLS_52({
            ...(props),
            density: "compact",
            title: (String(sectionName)),
            ...{ class: "mobile-section-header" },
        }));
        const __VLS_54 = __VLS_53({
            ...(props),
            density: "compact",
            title: (String(sectionName)),
            ...{ class: "mobile-section-header" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_53));
        __VLS_55.slots.default;
        {
            const { prepend: __VLS_thisSlot } = __VLS_55.slots;
            const __VLS_56 = {}.VIcon;
            /** @type {[typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, ]} */ ;
            // @ts-ignore
            const __VLS_57 = __VLS_asFunctionalComponent(__VLS_56, new __VLS_56({
                icon: "mdi-bookmark-outline",
                size: "small",
                ...{ class: "text-grey" },
            }));
            const __VLS_58 = __VLS_57({
                icon: "mdi-bookmark-outline",
                size: "small",
                ...{ class: "text-grey" },
            }, ...__VLS_functionalComponentArgsRest(__VLS_57));
        }
        var __VLS_55;
    }
    for (const [navItem, index] of __VLS_getVForSourceType((sectionItems))) {
        const __VLS_60 = {}.VListItem;
        /** @type {[typeof __VLS_components.VListItem, typeof __VLS_components.vListItem, typeof __VLS_components.VListItem, typeof __VLS_components.vListItem, ]} */ ;
        // @ts-ignore
        const __VLS_61 = __VLS_asFunctionalComponent(__VLS_60, new __VLS_60({
            ...{ 'onClick': {} },
            key: (navItem.id),
            active: (navItem.id === __VLS_ctx.activeItemId),
            ...{ class: "mobile-nav-item" },
            density: "compact",
        }));
        const __VLS_62 = __VLS_61({
            ...{ 'onClick': {} },
            key: (navItem.id),
            active: (navItem.id === __VLS_ctx.activeItemId),
            ...{ class: "mobile-nav-item" },
            density: "compact",
        }, ...__VLS_functionalComponentArgsRest(__VLS_61));
        let __VLS_64;
        let __VLS_65;
        let __VLS_66;
        const __VLS_67 = {
            onClick: (...[$event]) => {
                __VLS_ctx.handleMobileNavigation(navItem);
            }
        };
        __VLS_63.slots.default;
        {
            const { prepend: __VLS_thisSlot } = __VLS_63.slots;
            __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
                ...{ class: "text-caption text-grey mr-3" },
            });
            (index + 1);
        }
        const __VLS_68 = {}.VListItemTitle;
        /** @type {[typeof __VLS_components.VListItemTitle, typeof __VLS_components.vListItemTitle, typeof __VLS_components.VListItemTitle, typeof __VLS_components.vListItemTitle, ]} */ ;
        // @ts-ignore
        const __VLS_69 = __VLS_asFunctionalComponent(__VLS_68, new __VLS_68({
            ...{ class: "text-body-2" },
        }));
        const __VLS_70 = __VLS_69({
            ...{ class: "text-body-2" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_69));
        __VLS_71.slots.default;
        (navItem.title);
        var __VLS_71;
        var __VLS_63;
    }
    var __VLS_51;
}
var __VLS_47;
var __VLS_7;
var __VLS_3;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "main-content" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "compact-nav-bar" },
});
const __VLS_72 = {}.VContainer;
/** @type {[typeof __VLS_components.VContainer, typeof __VLS_components.vContainer, typeof __VLS_components.VContainer, typeof __VLS_components.vContainer, ]} */ ;
// @ts-ignore
const __VLS_73 = __VLS_asFunctionalComponent(__VLS_72, new __VLS_72({
    ...{ class: "d-flex align-center py-0 px-2 px-sm-4 fill-height" },
    fluid: true,
}));
const __VLS_74 = __VLS_73({
    ...{ class: "d-flex align-center py-0 px-2 px-sm-4 fill-height" },
    fluid: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_73));
__VLS_75.slots.default;
if (__VLS_ctx.currentView === 'keywords' || __VLS_ctx.currentView === 'interactions') {
    const __VLS_76 = {}.VBtn;
    /** @type {[typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ]} */ ;
    // @ts-ignore
    const __VLS_77 = __VLS_asFunctionalComponent(__VLS_76, new __VLS_76({
        ...{ 'onClick': {} },
        variant: "text",
        ...{ class: "px-1 px-sm-2 text-none text-grey-lighten-1 hover-white" },
        height: "32",
    }));
    const __VLS_78 = __VLS_77({
        ...{ 'onClick': {} },
        variant: "text",
        ...{ class: "px-1 px-sm-2 text-none text-grey-lighten-1 hover-white" },
        height: "32",
    }, ...__VLS_functionalComponentArgsRest(__VLS_77));
    let __VLS_80;
    let __VLS_81;
    let __VLS_82;
    const __VLS_83 = {
        onClick: (__VLS_ctx.exitToolMode)
    };
    __VLS_79.slots.default;
    const __VLS_84 = {}.VIcon;
    /** @type {[typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, ]} */ ;
    // @ts-ignore
    const __VLS_85 = __VLS_asFunctionalComponent(__VLS_84, new __VLS_84({
        start: true,
        icon: "mdi-arrow-left",
        size: "small",
    }));
    const __VLS_86 = __VLS_85({
        start: true,
        icon: "mdi-arrow-left",
        size: "small",
    }, ...__VLS_functionalComponentArgsRest(__VLS_85));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    var __VLS_79;
}
else if (__VLS_ctx.currentVolumeId) {
    const __VLS_88 = {}.VBtn;
    /** @type {[typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ]} */ ;
    // @ts-ignore
    const __VLS_89 = __VLS_asFunctionalComponent(__VLS_88, new __VLS_88({
        ...{ 'onClick': {} },
        variant: "text",
        ...{ class: "px-1 px-sm-2 text-none text-grey-lighten-1 hover-white" },
        height: "32",
    }));
    const __VLS_90 = __VLS_89({
        ...{ 'onClick': {} },
        variant: "text",
        ...{ class: "px-1 px-sm-2 text-none text-grey-lighten-1 hover-white" },
        height: "32",
    }, ...__VLS_functionalComponentArgsRest(__VLS_89));
    let __VLS_92;
    let __VLS_93;
    let __VLS_94;
    const __VLS_95 = {
        onClick: (__VLS_ctx.backToLibrary)
    };
    __VLS_91.slots.default;
    const __VLS_96 = {}.VIcon;
    /** @type {[typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, ]} */ ;
    // @ts-ignore
    const __VLS_97 = __VLS_asFunctionalComponent(__VLS_96, new __VLS_96({
        start: true,
        icon: "mdi-bookshelf",
        size: "small",
    }));
    const __VLS_98 = __VLS_97({
        start: true,
        icon: "mdi-bookshelf",
        size: "small",
    }, ...__VLS_functionalComponentArgsRest(__VLS_97));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "d-none d-sm-inline" },
    });
    var __VLS_91;
    const __VLS_100 = {}.VIcon;
    /** @type {[typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, ]} */ ;
    // @ts-ignore
    const __VLS_101 = __VLS_asFunctionalComponent(__VLS_100, new __VLS_100({
        icon: "mdi-chevron-right",
        size: "small",
        ...{ class: "mx-1 mx-sm-2 text-grey-darken-2" },
    }));
    const __VLS_102 = __VLS_101({
        icon: "mdi-chevron-right",
        size: "small",
        ...{ class: "mx-1 mx-sm-2 text-grey-darken-2" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_101));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "font-cinzel font-weight-bold text-white text-truncate text-subtitle-2 text-sm-h6" },
    });
    (__VLS_ctx.currentVolume?.title);
}
else {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "font-cinzel font-weight-bold text-white tracking-widest text-subtitle-2 text-sm-h6" },
    });
}
const __VLS_104 = {}.VSpacer;
/** @type {[typeof __VLS_components.VSpacer, typeof __VLS_components.vSpacer, typeof __VLS_components.VSpacer, typeof __VLS_components.vSpacer, ]} */ ;
// @ts-ignore
const __VLS_105 = __VLS_asFunctionalComponent(__VLS_104, new __VLS_104({}));
const __VLS_106 = __VLS_105({}, ...__VLS_functionalComponentArgsRest(__VLS_105));
if (__VLS_ctx.currentVolumeId && __VLS_ctx.currentView !== 'keywords' && __VLS_ctx.currentView !== 'interactions') {
    const __VLS_108 = {}.VMenu;
    /** @type {[typeof __VLS_components.VMenu, typeof __VLS_components.vMenu, typeof __VLS_components.VMenu, typeof __VLS_components.vMenu, ]} */ ;
    // @ts-ignore
    const __VLS_109 = __VLS_asFunctionalComponent(__VLS_108, new __VLS_108({
        location: "bottom end",
        maxHeight: "500",
        width: "300",
        offset: (10),
    }));
    const __VLS_110 = __VLS_109({
        location: "bottom end",
        maxHeight: "500",
        width: "300",
        offset: (10),
    }, ...__VLS_functionalComponentArgsRest(__VLS_109));
    __VLS_111.slots.default;
    {
        const { activator: __VLS_thisSlot } = __VLS_111.slots;
        const [{ props }] = __VLS_getSlotParams(__VLS_thisSlot);
        const __VLS_112 = {}.VBtn;
        /** @type {[typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ]} */ ;
        // @ts-ignore
        const __VLS_113 = __VLS_asFunctionalComponent(__VLS_112, new __VLS_112({
            ...(props),
            variant: "text",
            size: "small",
            ...{ class: "text-none text-grey-lighten-1 mr-1 mr-sm-2" },
        }));
        const __VLS_114 = __VLS_113({
            ...(props),
            variant: "text",
            size: "small",
            ...{ class: "text-none text-grey-lighten-1 mr-1 mr-sm-2" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_113));
        __VLS_115.slots.default;
        const __VLS_116 = {}.VIcon;
        /** @type {[typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, ]} */ ;
        // @ts-ignore
        const __VLS_117 = __VLS_asFunctionalComponent(__VLS_116, new __VLS_116({
            end: true,
        }));
        const __VLS_118 = __VLS_117({
            end: true,
        }, ...__VLS_functionalComponentArgsRest(__VLS_117));
        __VLS_119.slots.default;
        var __VLS_119;
        var __VLS_115;
    }
    const __VLS_120 = {}.VCard;
    /** @type {[typeof __VLS_components.VCard, typeof __VLS_components.vCard, typeof __VLS_components.VCard, typeof __VLS_components.vCard, ]} */ ;
    // @ts-ignore
    const __VLS_121 = __VLS_asFunctionalComponent(__VLS_120, new __VLS_120({
        ...{ class: "bg-surface border-thin elevation-10" },
    }));
    const __VLS_122 = __VLS_121({
        ...{ class: "bg-surface border-thin elevation-10" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_121));
    __VLS_123.slots.default;
    const __VLS_124 = {}.VList;
    /** @type {[typeof __VLS_components.VList, typeof __VLS_components.vList, typeof __VLS_components.VList, typeof __VLS_components.vList, ]} */ ;
    // @ts-ignore
    const __VLS_125 = __VLS_asFunctionalComponent(__VLS_124, new __VLS_124({
        density: "compact",
        nav: true,
    }));
    const __VLS_126 = __VLS_125({
        density: "compact",
        nav: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_125));
    __VLS_127.slots.default;
    for (const [items, section] of __VLS_getVForSourceType((__VLS_ctx.currentVolumeGroups))) {
        (section);
        const __VLS_128 = {}.VListSubheader;
        /** @type {[typeof __VLS_components.VListSubheader, typeof __VLS_components.vListSubheader, typeof __VLS_components.VListSubheader, typeof __VLS_components.vListSubheader, ]} */ ;
        // @ts-ignore
        const __VLS_129 = __VLS_asFunctionalComponent(__VLS_128, new __VLS_128({
            ...{ class: "text-uppercase font-weight-bold text-caption mt-2" },
        }));
        const __VLS_130 = __VLS_129({
            ...{ class: "text-uppercase font-weight-bold text-caption mt-2" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_129));
        __VLS_131.slots.default;
        (section);
        var __VLS_131;
        for (const [item, i] of __VLS_getVForSourceType((items))) {
            const __VLS_132 = {}.VListItem;
            /** @type {[typeof __VLS_components.VListItem, typeof __VLS_components.vListItem, typeof __VLS_components.VListItem, typeof __VLS_components.vListItem, ]} */ ;
            // @ts-ignore
            const __VLS_133 = __VLS_asFunctionalComponent(__VLS_132, new __VLS_132({
                ...{ 'onClick': {} },
                key: (item.id),
                active: (item.id === __VLS_ctx.activeItemId),
                rounded: true,
                density: "compact",
            }));
            const __VLS_134 = __VLS_133({
                ...{ 'onClick': {} },
                key: (item.id),
                active: (item.id === __VLS_ctx.activeItemId),
                rounded: true,
                density: "compact",
            }, ...__VLS_functionalComponentArgsRest(__VLS_133));
            let __VLS_136;
            let __VLS_137;
            let __VLS_138;
            const __VLS_139 = {
                onClick: (...[$event]) => {
                    if (!(__VLS_ctx.currentVolumeId && __VLS_ctx.currentView !== 'keywords' && __VLS_ctx.currentView !== 'interactions'))
                        return;
                    __VLS_ctx.handleMobileNavigation(item);
                }
            };
            __VLS_135.slots.default;
            {
                const { prepend: __VLS_thisSlot } = __VLS_135.slots;
                __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
                    ...{ class: "text-caption mr-2 text-grey" },
                    ...{ style: {} },
                });
                (i + 1);
            }
            const __VLS_140 = {}.VListItemTitle;
            /** @type {[typeof __VLS_components.VListItemTitle, typeof __VLS_components.vListItemTitle, typeof __VLS_components.VListItemTitle, typeof __VLS_components.vListItemTitle, ]} */ ;
            // @ts-ignore
            const __VLS_141 = __VLS_asFunctionalComponent(__VLS_140, new __VLS_140({
                ...{ class: "text-caption" },
            }));
            const __VLS_142 = __VLS_141({
                ...{ class: "text-caption" },
            }, ...__VLS_functionalComponentArgsRest(__VLS_141));
            __VLS_143.slots.default;
            (item.title);
            var __VLS_143;
            var __VLS_135;
        }
        const __VLS_144 = {}.VDivider;
        /** @type {[typeof __VLS_components.VDivider, typeof __VLS_components.vDivider, typeof __VLS_components.VDivider, typeof __VLS_components.vDivider, ]} */ ;
        // @ts-ignore
        const __VLS_145 = __VLS_asFunctionalComponent(__VLS_144, new __VLS_144({
            ...{ class: "my-1 border-opacity-10" },
        }));
        const __VLS_146 = __VLS_145({
            ...{ class: "my-1 border-opacity-10" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_145));
    }
    var __VLS_127;
    var __VLS_123;
    var __VLS_111;
}
if (!__VLS_ctx.$vuetify.display.xs) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "d-flex align-center border-s border-opacity-10 pl-1 pl-sm-2" },
    });
    const __VLS_148 = {}.VTooltip;
    /** @type {[typeof __VLS_components.VTooltip, typeof __VLS_components.vTooltip, typeof __VLS_components.VTooltip, typeof __VLS_components.vTooltip, ]} */ ;
    // @ts-ignore
    const __VLS_149 = __VLS_asFunctionalComponent(__VLS_148, new __VLS_148({
        text: "Interactions",
        location: "bottom",
    }));
    const __VLS_150 = __VLS_149({
        text: "Interactions",
        location: "bottom",
    }, ...__VLS_functionalComponentArgsRest(__VLS_149));
    __VLS_151.slots.default;
    {
        const { activator: __VLS_thisSlot } = __VLS_151.slots;
        const [{ props }] = __VLS_getSlotParams(__VLS_thisSlot);
        const __VLS_152 = {}.VBtn;
        /** @type {[typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ]} */ ;
        // @ts-ignore
        const __VLS_153 = __VLS_asFunctionalComponent(__VLS_152, new __VLS_152({
            ...{ 'onClick': {} },
            variant: "text",
            density: "comfortable",
            active: (__VLS_ctx.currentView === 'interactions'),
            ...(props),
            color: (__VLS_ctx.currentView === 'interactions' ? 'amber' : 'grey-lighten-1'),
            ...{ class: "text-none mr-2" },
        }));
        const __VLS_154 = __VLS_153({
            ...{ 'onClick': {} },
            variant: "text",
            density: "comfortable",
            active: (__VLS_ctx.currentView === 'interactions'),
            ...(props),
            color: (__VLS_ctx.currentView === 'interactions' ? 'amber' : 'grey-lighten-1'),
            ...{ class: "text-none mr-2" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_153));
        let __VLS_156;
        let __VLS_157;
        let __VLS_158;
        const __VLS_159 = {
            onClick: (__VLS_ctx.navigateToInteract)
        };
        __VLS_155.slots.default;
        const __VLS_160 = {}.VIcon;
        /** @type {[typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, ]} */ ;
        // @ts-ignore
        const __VLS_161 = __VLS_asFunctionalComponent(__VLS_160, new __VLS_160({
            start: true,
        }));
        const __VLS_162 = __VLS_161({
            start: true,
        }, ...__VLS_functionalComponentArgsRest(__VLS_161));
        __VLS_163.slots.default;
        var __VLS_163;
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
        var __VLS_155;
    }
    var __VLS_151;
    const __VLS_164 = {}.VTooltip;
    /** @type {[typeof __VLS_components.VTooltip, typeof __VLS_components.vTooltip, typeof __VLS_components.VTooltip, typeof __VLS_components.vTooltip, ]} */ ;
    // @ts-ignore
    const __VLS_165 = __VLS_asFunctionalComponent(__VLS_164, new __VLS_164({
        text: "Keywords",
        location: "bottom",
    }));
    const __VLS_166 = __VLS_165({
        text: "Keywords",
        location: "bottom",
    }, ...__VLS_functionalComponentArgsRest(__VLS_165));
    __VLS_167.slots.default;
    {
        const { activator: __VLS_thisSlot } = __VLS_167.slots;
        const [{ props }] = __VLS_getSlotParams(__VLS_thisSlot);
        const __VLS_168 = {}.VBtn;
        /** @type {[typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ]} */ ;
        // @ts-ignore
        const __VLS_169 = __VLS_asFunctionalComponent(__VLS_168, new __VLS_168({
            ...{ 'onClick': {} },
            variant: "text",
            density: "comfortable",
            active: (__VLS_ctx.currentView === 'keywords'),
            ...(props),
            color: (__VLS_ctx.currentView === 'keywords' ? 'amber' : 'grey-lighten-1'),
            ...{ class: "text-none" },
        }));
        const __VLS_170 = __VLS_169({
            ...{ 'onClick': {} },
            variant: "text",
            density: "comfortable",
            active: (__VLS_ctx.currentView === 'keywords'),
            ...(props),
            color: (__VLS_ctx.currentView === 'keywords' ? 'amber' : 'grey-lighten-1'),
            ...{ class: "text-none" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_169));
        let __VLS_172;
        let __VLS_173;
        let __VLS_174;
        const __VLS_175 = {
            onClick: (__VLS_ctx.navigateToKeywords)
        };
        __VLS_171.slots.default;
        const __VLS_176 = {}.VIcon;
        /** @type {[typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, ]} */ ;
        // @ts-ignore
        const __VLS_177 = __VLS_asFunctionalComponent(__VLS_176, new __VLS_176({
            start: true,
        }));
        const __VLS_178 = __VLS_177({
            start: true,
        }, ...__VLS_functionalComponentArgsRest(__VLS_177));
        __VLS_179.slots.default;
        var __VLS_179;
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
        var __VLS_171;
    }
    var __VLS_167;
}
var __VLS_75;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ onScroll: (__VLS_ctx.onScroll) },
    ...{ class: "scroll-root" },
    ref: "scrollableContentRef",
});
/** @type {typeof __VLS_ctx.scrollableContentRef} */ ;
if (!__VLS_ctx.currentVolumeId && __VLS_ctx.currentView !== 'keywords' && __VLS_ctx.currentView !== 'interactions') {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        key: "bookshelf",
        ...{ class: "bookshelf-view d-flex align-start justify-center" },
    });
    const __VLS_180 = {}.VContainer;
    /** @type {[typeof __VLS_components.VContainer, typeof __VLS_components.vContainer, typeof __VLS_components.VContainer, typeof __VLS_components.vContainer, ]} */ ;
    // @ts-ignore
    const __VLS_181 = __VLS_asFunctionalComponent(__VLS_180, new __VLS_180({
        ...{ class: "library-container" },
    }));
    const __VLS_182 = __VLS_181({
        ...{ class: "library-container" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_181));
    __VLS_183.slots.default;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "text-center mb-4" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.h2, __VLS_intrinsicElements.h2)({
        ...{ class: "text-h5 font-cinzel text-white text-uppercase tracking-widest" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "category-header text-caption text-grey text-uppercase mb-2 font-weight-bold" },
    });
    const __VLS_184 = {}.VRow;
    /** @type {[typeof __VLS_components.VRow, typeof __VLS_components.vRow, typeof __VLS_components.VRow, typeof __VLS_components.vRow, ]} */ ;
    // @ts-ignore
    const __VLS_185 = __VLS_asFunctionalComponent(__VLS_184, new __VLS_184({
        dense: true,
        ...{ class: "mb-4" },
    }));
    const __VLS_186 = __VLS_185({
        dense: true,
        ...{ class: "mb-4" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_185));
    __VLS_187.slots.default;
    for (const [vol] of __VLS_getVForSourceType((__VLS_ctx.storyVolumes))) {
        const __VLS_188 = {}.VCol;
        /** @type {[typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ]} */ ;
        // @ts-ignore
        const __VLS_189 = __VLS_asFunctionalComponent(__VLS_188, new __VLS_188({
            key: (vol.id),
            cols: "6",
            sm: "4",
            md: "3",
        }));
        const __VLS_190 = __VLS_189({
            key: (vol.id),
            cols: "6",
            sm: "4",
            md: "3",
        }, ...__VLS_functionalComponentArgsRest(__VLS_189));
        __VLS_191.slots.default;
        const __VLS_192 = {}.VCard;
        /** @type {[typeof __VLS_components.VCard, typeof __VLS_components.vCard, typeof __VLS_components.VCard, typeof __VLS_components.vCard, ]} */ ;
        // @ts-ignore
        const __VLS_193 = __VLS_asFunctionalComponent(__VLS_192, new __VLS_192({
            ...{ 'onClick': {} },
            ...{ class: "library-card story-card" },
            hover: true,
            variant: "tonal",
        }));
        const __VLS_194 = __VLS_193({
            ...{ 'onClick': {} },
            ...{ class: "library-card story-card" },
            hover: true,
            variant: "tonal",
        }, ...__VLS_functionalComponentArgsRest(__VLS_193));
        let __VLS_196;
        let __VLS_197;
        let __VLS_198;
        const __VLS_199 = {
            onClick: (...[$event]) => {
                if (!(!__VLS_ctx.currentVolumeId && __VLS_ctx.currentView !== 'keywords' && __VLS_ctx.currentView !== 'interactions'))
                    return;
                __VLS_ctx.switchVolume(vol.id);
            }
        };
        __VLS_195.slots.default;
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "d-flex align-center fill-height px-3" },
        });
        const __VLS_200 = {}.VIcon;
        /** @type {[typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, ]} */ ;
        // @ts-ignore
        const __VLS_201 = __VLS_asFunctionalComponent(__VLS_200, new __VLS_200({
            icon: (vol.icon),
            size: "24",
            ...{ class: "mr-3 text-amber-accent-2" },
        }));
        const __VLS_202 = __VLS_201({
            icon: (vol.icon),
            size: "24",
            ...{ class: "mr-3 text-amber-accent-2" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_201));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "d-flex flex-column text-truncate" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ class: "font-cinzel font-weight-bold text-white text-subtitle-2" },
        });
        (vol.title);
        if (vol.subtitle) {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
                ...{ class: "text-caption text-grey text-truncate" },
            });
            (vol.subtitle);
        }
        var __VLS_195;
        var __VLS_191;
    }
    var __VLS_187;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "category-header text-caption text-grey text-uppercase mb-2 font-weight-bold mt-2" },
    });
    const __VLS_204 = {}.VRow;
    /** @type {[typeof __VLS_components.VRow, typeof __VLS_components.vRow, typeof __VLS_components.VRow, typeof __VLS_components.vRow, ]} */ ;
    // @ts-ignore
    const __VLS_205 = __VLS_asFunctionalComponent(__VLS_204, new __VLS_204({
        dense: true,
    }));
    const __VLS_206 = __VLS_205({
        dense: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_205));
    __VLS_207.slots.default;
    for (const [vol] of __VLS_getVForSourceType((__VLS_ctx.referenceVolumes))) {
        const __VLS_208 = {}.VCol;
        /** @type {[typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ]} */ ;
        // @ts-ignore
        const __VLS_209 = __VLS_asFunctionalComponent(__VLS_208, new __VLS_208({
            key: (vol.id),
            cols: "6",
            sm: "4",
            md: "3",
        }));
        const __VLS_210 = __VLS_209({
            key: (vol.id),
            cols: "6",
            sm: "4",
            md: "3",
        }, ...__VLS_functionalComponentArgsRest(__VLS_209));
        __VLS_211.slots.default;
        const __VLS_212 = {}.VCard;
        /** @type {[typeof __VLS_components.VCard, typeof __VLS_components.vCard, typeof __VLS_components.VCard, typeof __VLS_components.vCard, ]} */ ;
        // @ts-ignore
        const __VLS_213 = __VLS_asFunctionalComponent(__VLS_212, new __VLS_212({
            ...{ 'onClick': {} },
            ...{ class: "library-card ref-card" },
            hover: true,
            variant: "tonal",
        }));
        const __VLS_214 = __VLS_213({
            ...{ 'onClick': {} },
            ...{ class: "library-card ref-card" },
            hover: true,
            variant: "tonal",
        }, ...__VLS_functionalComponentArgsRest(__VLS_213));
        let __VLS_216;
        let __VLS_217;
        let __VLS_218;
        const __VLS_219 = {
            onClick: (...[$event]) => {
                if (!(!__VLS_ctx.currentVolumeId && __VLS_ctx.currentView !== 'keywords' && __VLS_ctx.currentView !== 'interactions'))
                    return;
                __VLS_ctx.switchVolume(vol.id);
            }
        };
        __VLS_215.slots.default;
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "d-flex align-center fill-height px-3" },
        });
        const __VLS_220 = {}.VIcon;
        /** @type {[typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, ]} */ ;
        // @ts-ignore
        const __VLS_221 = __VLS_asFunctionalComponent(__VLS_220, new __VLS_220({
            icon: (vol.icon),
            size: "20",
            ...{ class: "mr-3 text-blue-lighten-2" },
        }));
        const __VLS_222 = __VLS_221({
            icon: (vol.icon),
            size: "20",
            ...{ class: "mr-3 text-blue-lighten-2" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_221));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "d-flex flex-column text-truncate" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ class: "text-white text-caption font-weight-bold" },
        });
        (vol.title);
        var __VLS_215;
        var __VLS_211;
    }
    var __VLS_207;
    var __VLS_183;
}
else {
    const __VLS_224 = {}.VContainer;
    /** @type {[typeof __VLS_components.VContainer, typeof __VLS_components.vContainer, typeof __VLS_components.VContainer, typeof __VLS_components.vContainer, ]} */ ;
    // @ts-ignore
    const __VLS_225 = __VLS_asFunctionalComponent(__VLS_224, new __VLS_224({
        fluid: true,
        ...{ class: "content-container pa-0" },
    }));
    const __VLS_226 = __VLS_225({
        fluid: true,
        ...{ class: "content-container pa-0" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_225));
    __VLS_227.slots.default;
    const __VLS_228 = {}.transition;
    /** @type {[typeof __VLS_components.Transition, typeof __VLS_components.transition, typeof __VLS_components.Transition, typeof __VLS_components.transition, ]} */ ;
    // @ts-ignore
    const __VLS_229 = __VLS_asFunctionalComponent(__VLS_228, new __VLS_228({
        name: "fade-slide",
        mode: "out-in",
    }));
    const __VLS_230 = __VLS_229({
        name: "fade-slide",
        mode: "out-in",
    }, ...__VLS_functionalComponentArgsRest(__VLS_229));
    __VLS_231.slots.default;
    if (__VLS_ctx.currentView === 'player' && __VLS_ctx.currentPage) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            key: ('player-' + __VLS_ctx.currentIndex),
        });
        const __VLS_232 = {}.VSheet;
        /** @type {[typeof __VLS_components.VSheet, typeof __VLS_components.vSheet, typeof __VLS_components.VSheet, typeof __VLS_components.vSheet, ]} */ ;
        // @ts-ignore
        const __VLS_233 = __VLS_asFunctionalComponent(__VLS_232, new __VLS_232({
            ...{ 'onClick': {} },
            key: ('sheet-' + __VLS_ctx.currentIndex),
            ...{ style: (__VLS_ctx.backgroundStyle) },
            ...{ class: "book-page" },
            ...{ class: ({ 'book-page-fullscreen': __VLS_ctx.isFullscreen }) },
            elevation: "0",
            rounded: true,
        }));
        const __VLS_234 = __VLS_233({
            ...{ 'onClick': {} },
            key: ('sheet-' + __VLS_ctx.currentIndex),
            ...{ style: (__VLS_ctx.backgroundStyle) },
            ...{ class: "book-page" },
            ...{ class: ({ 'book-page-fullscreen': __VLS_ctx.isFullscreen }) },
            elevation: "0",
            rounded: true,
        }, ...__VLS_functionalComponentArgsRest(__VLS_233));
        let __VLS_236;
        let __VLS_237;
        let __VLS_238;
        const __VLS_239 = {
            onClick: (__VLS_ctx.handlePageClick)
        };
        __VLS_235.slots.default;
        if (__VLS_ctx.isFullScreenWithBackground) {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: "background-overlay" },
            });
        }
        const __VLS_240 = {}.VContainer;
        /** @type {[typeof __VLS_components.VContainer, typeof __VLS_components.vContainer, typeof __VLS_components.VContainer, typeof __VLS_components.vContainer, ]} */ ;
        // @ts-ignore
        const __VLS_241 = __VLS_asFunctionalComponent(__VLS_240, new __VLS_240({
            ...{ class: "pa-0 pt-2 ml-3" },
        }));
        const __VLS_242 = __VLS_241({
            ...{ class: "pa-0 pt-2 ml-3" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_241));
        __VLS_243.slots.default;
        const __VLS_244 = {}.VRow;
        /** @type {[typeof __VLS_components.VRow, typeof __VLS_components.vRow, typeof __VLS_components.VRow, typeof __VLS_components.vRow, ]} */ ;
        // @ts-ignore
        const __VLS_245 = __VLS_asFunctionalComponent(__VLS_244, new __VLS_244({}));
        const __VLS_246 = __VLS_245({}, ...__VLS_functionalComponentArgsRest(__VLS_245));
        __VLS_247.slots.default;
        const __VLS_248 = {}.VCol;
        /** @type {[typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ]} */ ;
        // @ts-ignore
        const __VLS_249 = __VLS_asFunctionalComponent(__VLS_248, new __VLS_248({
            cols: "12",
        }));
        const __VLS_250 = __VLS_249({
            cols: "12",
        }, ...__VLS_functionalComponentArgsRest(__VLS_249));
        __VLS_251.slots.default;
        for (const [item, contentLoopIndex] of __VLS_getVForSourceType((__VLS_ctx.currentPage.content))) {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                key: ('content-' + __VLS_ctx.currentIndex + '-' + contentLoopIndex),
                id: ('content-block-' + __VLS_ctx.currentIndex + '-' + contentLoopIndex),
                ...{ class: "content-block" },
            });
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: "header-banner" },
                ...{ style: (__VLS_ctx.headerBannerStyle) },
                ...{ class: ({ 'header-banner-fullscreen': __VLS_ctx.isFullscreen }) },
            });
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: "d-flex align-center justify-space-between pa-0 pb-0" },
            });
            __VLS_asFunctionalElement(__VLS_intrinsicElements.h4, __VLS_intrinsicElements.h4)({
                ...{ class: "section-title" },
                ...{ class: ({ 'section-title-fullscreen': __VLS_ctx.isFullscreen }) },
            });
            (__VLS_ctx.currentPage.section);
            if (item.title) {
                __VLS_asFunctionalElement(__VLS_intrinsicElements.h2, __VLS_intrinsicElements.h2)({
                    ...{ class: "chapter-title-banner" },
                    ...{ class: ({ 'chapter-title-banner-fullscreen': __VLS_ctx.isFullscreen }) },
                });
                (item.title);
            }
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: "body-text mt-3 mx-6" },
                ...{ class: ({ 'body-text-fullscreen': __VLS_ctx.isFullscreen }) },
            });
            __VLS_asFunctionalDirective(__VLS_directives.vHtml)(null, { ...__VLS_directiveBindingRestFields, value: (item.body) }, null, null);
            if (item.instruction) {
                const __VLS_252 = {}.VCard;
                /** @type {[typeof __VLS_components.VCard, typeof __VLS_components.vCard, typeof __VLS_components.VCard, typeof __VLS_components.vCard, ]} */ ;
                // @ts-ignore
                const __VLS_253 = __VLS_asFunctionalComponent(__VLS_252, new __VLS_252({
                    ...{ class: "instruction-card mt-6 py-0 mx-6 mb-6" },
                    flat: true,
                }));
                const __VLS_254 = __VLS_253({
                    ...{ class: "instruction-card mt-6 py-0 mx-6 mb-6" },
                    flat: true,
                }, ...__VLS_functionalComponentArgsRest(__VLS_253));
                __VLS_255.slots.default;
                const __VLS_256 = {}.VCardText;
                /** @type {[typeof __VLS_components.VCardText, typeof __VLS_components.vCardText, ]} */ ;
                // @ts-ignore
                const __VLS_257 = __VLS_asFunctionalComponent(__VLS_256, new __VLS_256({
                    ...{ class: "pa-4" },
                }));
                const __VLS_258 = __VLS_257({
                    ...{ class: "pa-4" },
                }, ...__VLS_functionalComponentArgsRest(__VLS_257));
                __VLS_asFunctionalDirective(__VLS_directives.vHtml)(null, { ...__VLS_directiveBindingRestFields, value: (item.instruction) }, null, null);
                var __VLS_255;
            }
            if (item.setup) {
                const __VLS_260 = {}.VCardText;
                /** @type {[typeof __VLS_components.VCardText, typeof __VLS_components.vCardText, ]} */ ;
                // @ts-ignore
                const __VLS_261 = __VLS_asFunctionalComponent(__VLS_260, new __VLS_260({}));
                const __VLS_262 = __VLS_261({}, ...__VLS_functionalComponentArgsRest(__VLS_261));
                __VLS_asFunctionalDirective(__VLS_directives.vHtml)(null, { ...__VLS_directiveBindingRestFields, value: (item.setup) }, null, null);
            }
            if (item.instruction) {
                __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                    ...{ class: "pt-5 px-16 text-center" },
                });
                const __VLS_264 = {}.VImg;
                /** @type {[typeof __VLS_components.VImg, typeof __VLS_components.vImg, ]} */ ;
                // @ts-ignore
                const __VLS_265 = __VLS_asFunctionalComponent(__VLS_264, new __VLS_264({
                    src: "@/assets/Barra.png",
                    maxHeight: "20",
                    contain: true,
                }));
                const __VLS_266 = __VLS_265({
                    src: "@/assets/Barra.png",
                    maxHeight: "20",
                    contain: true,
                }, ...__VLS_functionalComponentArgsRest(__VLS_265));
            }
        }
        var __VLS_251;
        var __VLS_247;
        var __VLS_243;
        var __VLS_235;
    }
    else if (__VLS_ctx.isAuxiliaryView) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            key: (__VLS_ctx.currentView),
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "book-page ma-4 aux-page-style" },
        });
        const __VLS_268 = {}.VContainer;
        /** @type {[typeof __VLS_components.VContainer, typeof __VLS_components.vContainer, typeof __VLS_components.VContainer, typeof __VLS_components.vContainer, ]} */ ;
        // @ts-ignore
        const __VLS_269 = __VLS_asFunctionalComponent(__VLS_268, new __VLS_268({
            fluid: true,
            ...{ class: "pa-0" },
        }));
        const __VLS_270 = __VLS_269({
            fluid: true,
            ...{ class: "pa-0" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_269));
        __VLS_271.slots.default;
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "header-banner" },
            ...{ style: (__VLS_ctx.headerBannerStyle) },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "d-flex align-center justify-space-between pa-0 pb-0" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.h4, __VLS_intrinsicElements.h4)({
            ...{ class: "section-title" },
        });
        (__VLS_ctx.currentAuxiliaryData.pageTitle);
        __VLS_asFunctionalElement(__VLS_intrinsicElements.h2, __VLS_intrinsicElements.h2)({
            ...{ class: "chapter-title-banner" },
        });
        (__VLS_ctx.currentAuxiliaryData.chapterTitle);
        const __VLS_272 = {}.VContainer;
        /** @type {[typeof __VLS_components.VContainer, typeof __VLS_components.vContainer, typeof __VLS_components.VContainer, typeof __VLS_components.vContainer, ]} */ ;
        // @ts-ignore
        const __VLS_273 = __VLS_asFunctionalComponent(__VLS_272, new __VLS_272({
            ...{ class: "pa-6" },
        }));
        const __VLS_274 = __VLS_273({
            ...{ class: "pa-6" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_273));
        __VLS_275.slots.default;
        for (const [chapter, cIdx] of __VLS_getVForSourceType((__VLS_ctx.currentAuxiliaryData.chapters))) {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: "mb-8" },
            });
            if (__VLS_ctx.currentAuxiliaryData.chapters.length > 1) {
                __VLS_asFunctionalElement(__VLS_intrinsicElements.h3, __VLS_intrinsicElements.h3)({
                    ...{ class: "aux-chapter-title mb-4" },
                });
                (chapter.title);
            }
            for (const [sec, sIdx] of __VLS_getVForSourceType((chapter.sections))) {
                (sIdx);
                __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                    id: (sec.id),
                    ...{ class: "mb-6" },
                });
                __VLS_asFunctionalElement(__VLS_intrinsicElements.h4, __VLS_intrinsicElements.h4)({
                    ...{ class: "tutorial-section-title" },
                });
                (sec.title);
                __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                    ...{ class: "body-text-mechanics mt-2" },
                });
                __VLS_asFunctionalDirective(__VLS_directives.vHtml)(null, { ...__VLS_directiveBindingRestFields, value: (sec.body) }, null, null);
                if (sIdx < chapter.sections.length - 1) {
                    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                        ...{ class: "pt-5 px-16 text-center" },
                    });
                    const __VLS_276 = {}.VImg;
                    /** @type {[typeof __VLS_components.VImg, typeof __VLS_components.vImg, ]} */ ;
                    // @ts-ignore
                    const __VLS_277 = __VLS_asFunctionalComponent(__VLS_276, new __VLS_276({
                        src: "@/assets/Barra.png",
                        maxHeight: "20",
                        contain: true,
                    }));
                    const __VLS_278 = __VLS_277({
                        src: "@/assets/Barra.png",
                        maxHeight: "20",
                        contain: true,
                    }, ...__VLS_functionalComponentArgsRest(__VLS_277));
                }
            }
        }
        var __VLS_275;
        var __VLS_271;
    }
    else if (__VLS_ctx.currentView === 'keywords') {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            key: "keywords",
        });
        if (__VLS_ctx.smAndDown) {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: "back-button-container pa-4" },
            });
            const __VLS_280 = {}.VBtn;
            /** @type {[typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ]} */ ;
            // @ts-ignore
            const __VLS_281 = __VLS_asFunctionalComponent(__VLS_280, new __VLS_280({
                ...{ 'onClick': {} },
                variant: "text",
                prependIcon: "mdi-arrow-left",
            }));
            const __VLS_282 = __VLS_281({
                ...{ 'onClick': {} },
                variant: "text",
                prependIcon: "mdi-arrow-left",
            }, ...__VLS_functionalComponentArgsRest(__VLS_281));
            let __VLS_284;
            let __VLS_285;
            let __VLS_286;
            const __VLS_287 = {
                onClick: (__VLS_ctx.exitToolMode)
            };
            __VLS_283.slots.default;
            var __VLS_283;
        }
        /** @type {[typeof KeywordView, ]} */ ;
        // @ts-ignore
        const __VLS_288 = __VLS_asFunctionalComponent(KeywordView, new KeywordView({}));
        const __VLS_289 = __VLS_288({}, ...__VLS_functionalComponentArgsRest(__VLS_288));
    }
    else if (__VLS_ctx.currentView === 'interactions') {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            key: "interactions",
        });
        /** @type {[typeof InteractView, ]} */ ;
        // @ts-ignore
        const __VLS_291 = __VLS_asFunctionalComponent(InteractView, new InteractView({
            ...{ 'onClose': {} },
            ...{ 'onOpenScene': {} },
            ref: "interactViewRef",
            currentDoor: (props.campaignWing || ''),
            wing: (props.campaignWing || ''),
            campaignType: (props.campaignType || ''),
        }));
        const __VLS_292 = __VLS_291({
            ...{ 'onClose': {} },
            ...{ 'onOpenScene': {} },
            ref: "interactViewRef",
            currentDoor: (props.campaignWing || ''),
            wing: (props.campaignWing || ''),
            campaignType: (props.campaignType || ''),
        }, ...__VLS_functionalComponentArgsRest(__VLS_291));
        let __VLS_294;
        let __VLS_295;
        let __VLS_296;
        const __VLS_297 = {
            onClose: (__VLS_ctx.exitToolMode)
        };
        const __VLS_298 = {
            onOpenScene: (__VLS_ctx.handleOpenSceneFromInternal)
        };
        /** @type {typeof __VLS_ctx.interactViewRef} */ ;
        var __VLS_299 = {};
        var __VLS_293;
    }
    var __VLS_231;
    var __VLS_227;
}
if (__VLS_ctx.smAndDown && __VLS_ctx.currentVolumeId && __VLS_ctx.currentView !== 'keywords' && __VLS_ctx.currentView !== 'interactions') {
    const __VLS_301 = {}.VFab;
    /** @type {[typeof __VLS_components.VFab, typeof __VLS_components.vFab, ]} */ ;
    // @ts-ignore
    const __VLS_302 = __VLS_asFunctionalComponent(__VLS_301, new __VLS_301({
        ...{ 'onClick': {} },
        icon: "mdi-format-list-bulleted",
        location: "bottom right",
        ...{ class: "mb-4 mr-4" },
        color: "primary",
        app: true,
        ...{ style: {} },
        size: "small",
    }));
    const __VLS_303 = __VLS_302({
        ...{ 'onClick': {} },
        icon: "mdi-format-list-bulleted",
        location: "bottom right",
        ...{ class: "mb-4 mr-4" },
        color: "primary",
        app: true,
        ...{ style: {} },
        size: "small",
    }, ...__VLS_functionalComponentArgsRest(__VLS_302));
    let __VLS_305;
    let __VLS_306;
    let __VLS_307;
    const __VLS_308 = {
        onClick: (...[$event]) => {
            if (!(__VLS_ctx.smAndDown && __VLS_ctx.currentVolumeId && __VLS_ctx.currentView !== 'keywords' && __VLS_ctx.currentView !== 'interactions'))
                return;
            __VLS_ctx.mobileMenuSheet = true;
        }
    };
    var __VLS_304;
}
if (__VLS_ctx.smAndDown && __VLS_ctx.currentVolumeId && __VLS_ctx.currentView !== 'keywords' && __VLS_ctx.currentView !== 'interactions') {
    const __VLS_309 = {}.VFab;
    /** @type {[typeof __VLS_components.VFab, typeof __VLS_components.vFab, ]} */ ;
    // @ts-ignore
    const __VLS_310 = __VLS_asFunctionalComponent(__VLS_309, new __VLS_309({
        ...{ 'onClick': {} },
        icon: "mdi-arrow-left",
        location: "bottom left",
        ...{ class: "mb-4 ml-4" },
        color: "grey-darken-3",
        app: true,
        ...{ style: {} },
        size: "small",
    }));
    const __VLS_311 = __VLS_310({
        ...{ 'onClick': {} },
        icon: "mdi-arrow-left",
        location: "bottom left",
        ...{ class: "mb-4 ml-4" },
        color: "grey-darken-3",
        app: true,
        ...{ style: {} },
        size: "small",
    }, ...__VLS_functionalComponentArgsRest(__VLS_310));
    let __VLS_313;
    let __VLS_314;
    let __VLS_315;
    const __VLS_316 = {
        onClick: (__VLS_ctx.backToLibrary)
    };
    var __VLS_312;
}
/** @type {__VLS_StyleScopedClasses['book-container']} */ ;
/** @type {__VLS_StyleScopedClasses['mobile-menu-card']} */ ;
/** @type {__VLS_StyleScopedClasses['border-b']} */ ;
/** @type {__VLS_StyleScopedClasses['text-subtitle-2']} */ ;
/** @type {__VLS_StyleScopedClasses['font-weight-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['ml-2']} */ ;
/** @type {__VLS_StyleScopedClasses['mobile-menu-list']} */ ;
/** @type {__VLS_StyleScopedClasses['mobile-section-header']} */ ;
/** @type {__VLS_StyleScopedClasses['text-grey']} */ ;
/** @type {__VLS_StyleScopedClasses['mobile-nav-item']} */ ;
/** @type {__VLS_StyleScopedClasses['text-caption']} */ ;
/** @type {__VLS_StyleScopedClasses['text-grey']} */ ;
/** @type {__VLS_StyleScopedClasses['mr-3']} */ ;
/** @type {__VLS_StyleScopedClasses['text-body-2']} */ ;
/** @type {__VLS_StyleScopedClasses['main-content']} */ ;
/** @type {__VLS_StyleScopedClasses['compact-nav-bar']} */ ;
/** @type {__VLS_StyleScopedClasses['d-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['align-center']} */ ;
/** @type {__VLS_StyleScopedClasses['py-0']} */ ;
/** @type {__VLS_StyleScopedClasses['px-2']} */ ;
/** @type {__VLS_StyleScopedClasses['px-sm-4']} */ ;
/** @type {__VLS_StyleScopedClasses['fill-height']} */ ;
/** @type {__VLS_StyleScopedClasses['px-1']} */ ;
/** @type {__VLS_StyleScopedClasses['px-sm-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-none']} */ ;
/** @type {__VLS_StyleScopedClasses['text-grey-lighten-1']} */ ;
/** @type {__VLS_StyleScopedClasses['hover-white']} */ ;
/** @type {__VLS_StyleScopedClasses['px-1']} */ ;
/** @type {__VLS_StyleScopedClasses['px-sm-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-none']} */ ;
/** @type {__VLS_StyleScopedClasses['text-grey-lighten-1']} */ ;
/** @type {__VLS_StyleScopedClasses['hover-white']} */ ;
/** @type {__VLS_StyleScopedClasses['d-none']} */ ;
/** @type {__VLS_StyleScopedClasses['d-sm-inline']} */ ;
/** @type {__VLS_StyleScopedClasses['mx-1']} */ ;
/** @type {__VLS_StyleScopedClasses['mx-sm-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-grey-darken-2']} */ ;
/** @type {__VLS_StyleScopedClasses['font-cinzel']} */ ;
/** @type {__VLS_StyleScopedClasses['font-weight-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['text-truncate']} */ ;
/** @type {__VLS_StyleScopedClasses['text-subtitle-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm-h6']} */ ;
/** @type {__VLS_StyleScopedClasses['font-cinzel']} */ ;
/** @type {__VLS_StyleScopedClasses['font-weight-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['tracking-widest']} */ ;
/** @type {__VLS_StyleScopedClasses['text-subtitle-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm-h6']} */ ;
/** @type {__VLS_StyleScopedClasses['text-none']} */ ;
/** @type {__VLS_StyleScopedClasses['text-grey-lighten-1']} */ ;
/** @type {__VLS_StyleScopedClasses['mr-1']} */ ;
/** @type {__VLS_StyleScopedClasses['mr-sm-2']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-surface']} */ ;
/** @type {__VLS_StyleScopedClasses['border-thin']} */ ;
/** @type {__VLS_StyleScopedClasses['elevation-10']} */ ;
/** @type {__VLS_StyleScopedClasses['text-uppercase']} */ ;
/** @type {__VLS_StyleScopedClasses['font-weight-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-caption']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-caption']} */ ;
/** @type {__VLS_StyleScopedClasses['mr-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-grey']} */ ;
/** @type {__VLS_StyleScopedClasses['text-caption']} */ ;
/** @type {__VLS_StyleScopedClasses['my-1']} */ ;
/** @type {__VLS_StyleScopedClasses['border-opacity-10']} */ ;
/** @type {__VLS_StyleScopedClasses['d-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['align-center']} */ ;
/** @type {__VLS_StyleScopedClasses['border-s']} */ ;
/** @type {__VLS_StyleScopedClasses['border-opacity-10']} */ ;
/** @type {__VLS_StyleScopedClasses['pl-1']} */ ;
/** @type {__VLS_StyleScopedClasses['pl-sm-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-none']} */ ;
/** @type {__VLS_StyleScopedClasses['mr-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-none']} */ ;
/** @type {__VLS_StyleScopedClasses['scroll-root']} */ ;
/** @type {__VLS_StyleScopedClasses['bookshelf-view']} */ ;
/** @type {__VLS_StyleScopedClasses['d-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['align-start']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['library-container']} */ ;
/** @type {__VLS_StyleScopedClasses['text-center']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['text-h5']} */ ;
/** @type {__VLS_StyleScopedClasses['font-cinzel']} */ ;
/** @type {__VLS_StyleScopedClasses['text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['text-uppercase']} */ ;
/** @type {__VLS_StyleScopedClasses['tracking-widest']} */ ;
/** @type {__VLS_StyleScopedClasses['category-header']} */ ;
/** @type {__VLS_StyleScopedClasses['text-caption']} */ ;
/** @type {__VLS_StyleScopedClasses['text-grey']} */ ;
/** @type {__VLS_StyleScopedClasses['text-uppercase']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-2']} */ ;
/** @type {__VLS_StyleScopedClasses['font-weight-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['library-card']} */ ;
/** @type {__VLS_StyleScopedClasses['story-card']} */ ;
/** @type {__VLS_StyleScopedClasses['d-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['align-center']} */ ;
/** @type {__VLS_StyleScopedClasses['fill-height']} */ ;
/** @type {__VLS_StyleScopedClasses['px-3']} */ ;
/** @type {__VLS_StyleScopedClasses['mr-3']} */ ;
/** @type {__VLS_StyleScopedClasses['text-amber-accent-2']} */ ;
/** @type {__VLS_StyleScopedClasses['d-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-column']} */ ;
/** @type {__VLS_StyleScopedClasses['text-truncate']} */ ;
/** @type {__VLS_StyleScopedClasses['font-cinzel']} */ ;
/** @type {__VLS_StyleScopedClasses['font-weight-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['text-subtitle-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-caption']} */ ;
/** @type {__VLS_StyleScopedClasses['text-grey']} */ ;
/** @type {__VLS_StyleScopedClasses['text-truncate']} */ ;
/** @type {__VLS_StyleScopedClasses['category-header']} */ ;
/** @type {__VLS_StyleScopedClasses['text-caption']} */ ;
/** @type {__VLS_StyleScopedClasses['text-grey']} */ ;
/** @type {__VLS_StyleScopedClasses['text-uppercase']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-2']} */ ;
/** @type {__VLS_StyleScopedClasses['font-weight-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-2']} */ ;
/** @type {__VLS_StyleScopedClasses['library-card']} */ ;
/** @type {__VLS_StyleScopedClasses['ref-card']} */ ;
/** @type {__VLS_StyleScopedClasses['d-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['align-center']} */ ;
/** @type {__VLS_StyleScopedClasses['fill-height']} */ ;
/** @type {__VLS_StyleScopedClasses['px-3']} */ ;
/** @type {__VLS_StyleScopedClasses['mr-3']} */ ;
/** @type {__VLS_StyleScopedClasses['text-blue-lighten-2']} */ ;
/** @type {__VLS_StyleScopedClasses['d-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-column']} */ ;
/** @type {__VLS_StyleScopedClasses['text-truncate']} */ ;
/** @type {__VLS_StyleScopedClasses['text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['text-caption']} */ ;
/** @type {__VLS_StyleScopedClasses['font-weight-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['content-container']} */ ;
/** @type {__VLS_StyleScopedClasses['pa-0']} */ ;
/** @type {__VLS_StyleScopedClasses['book-page']} */ ;
/** @type {__VLS_StyleScopedClasses['book-page-fullscreen']} */ ;
/** @type {__VLS_StyleScopedClasses['background-overlay']} */ ;
/** @type {__VLS_StyleScopedClasses['pa-0']} */ ;
/** @type {__VLS_StyleScopedClasses['pt-2']} */ ;
/** @type {__VLS_StyleScopedClasses['ml-3']} */ ;
/** @type {__VLS_StyleScopedClasses['content-block']} */ ;
/** @type {__VLS_StyleScopedClasses['header-banner']} */ ;
/** @type {__VLS_StyleScopedClasses['header-banner-fullscreen']} */ ;
/** @type {__VLS_StyleScopedClasses['d-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['align-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-space-between']} */ ;
/** @type {__VLS_StyleScopedClasses['pa-0']} */ ;
/** @type {__VLS_StyleScopedClasses['pb-0']} */ ;
/** @type {__VLS_StyleScopedClasses['section-title']} */ ;
/** @type {__VLS_StyleScopedClasses['section-title-fullscreen']} */ ;
/** @type {__VLS_StyleScopedClasses['chapter-title-banner']} */ ;
/** @type {__VLS_StyleScopedClasses['chapter-title-banner-fullscreen']} */ ;
/** @type {__VLS_StyleScopedClasses['body-text']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-3']} */ ;
/** @type {__VLS_StyleScopedClasses['mx-6']} */ ;
/** @type {__VLS_StyleScopedClasses['body-text-fullscreen']} */ ;
/** @type {__VLS_StyleScopedClasses['instruction-card']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-6']} */ ;
/** @type {__VLS_StyleScopedClasses['py-0']} */ ;
/** @type {__VLS_StyleScopedClasses['mx-6']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-6']} */ ;
/** @type {__VLS_StyleScopedClasses['pa-4']} */ ;
/** @type {__VLS_StyleScopedClasses['pt-5']} */ ;
/** @type {__VLS_StyleScopedClasses['px-16']} */ ;
/** @type {__VLS_StyleScopedClasses['text-center']} */ ;
/** @type {__VLS_StyleScopedClasses['book-page']} */ ;
/** @type {__VLS_StyleScopedClasses['ma-4']} */ ;
/** @type {__VLS_StyleScopedClasses['aux-page-style']} */ ;
/** @type {__VLS_StyleScopedClasses['pa-0']} */ ;
/** @type {__VLS_StyleScopedClasses['header-banner']} */ ;
/** @type {__VLS_StyleScopedClasses['d-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['align-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-space-between']} */ ;
/** @type {__VLS_StyleScopedClasses['pa-0']} */ ;
/** @type {__VLS_StyleScopedClasses['pb-0']} */ ;
/** @type {__VLS_StyleScopedClasses['section-title']} */ ;
/** @type {__VLS_StyleScopedClasses['chapter-title-banner']} */ ;
/** @type {__VLS_StyleScopedClasses['pa-6']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-8']} */ ;
/** @type {__VLS_StyleScopedClasses['aux-chapter-title']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-6']} */ ;
/** @type {__VLS_StyleScopedClasses['tutorial-section-title']} */ ;
/** @type {__VLS_StyleScopedClasses['body-text-mechanics']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-2']} */ ;
/** @type {__VLS_StyleScopedClasses['pt-5']} */ ;
/** @type {__VLS_StyleScopedClasses['px-16']} */ ;
/** @type {__VLS_StyleScopedClasses['text-center']} */ ;
/** @type {__VLS_StyleScopedClasses['back-button-container']} */ ;
/** @type {__VLS_StyleScopedClasses['pa-4']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['mr-4']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['ml-4']} */ ;
// @ts-ignore
var __VLS_300 = __VLS_299;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            KeywordView: KeywordView,
            InteractView: InteractView,
            smAndDown: smAndDown,
            mobileMenuSheet: mobileMenuSheet,
            openGroups: openGroups,
            currentView: currentView,
            currentIndex: currentIndex,
            activeItemId: activeItemId,
            currentVolumeId: currentVolumeId,
            isFullscreen: isFullscreen,
            scrollableContentRef: scrollableContentRef,
            interactViewRef: interactViewRef,
            storyVolumes: storyVolumes,
            referenceVolumes: referenceVolumes,
            currentVolume: currentVolume,
            currentPage: currentPage,
            currentAuxiliaryData: currentAuxiliaryData,
            isAuxiliaryView: isAuxiliaryView,
            currentVolumeGroups: currentVolumeGroups,
            backToLibrary: backToLibrary,
            switchVolume: switchVolume,
            handleMobileNavigation: handleMobileNavigation,
            headerBannerStyle: headerBannerStyle,
            isFullScreenWithBackground: isFullScreenWithBackground,
            backgroundStyle: backgroundStyle,
            exitToolMode: exitToolMode,
            navigateToInteract: navigateToInteract,
            navigateToKeywords: navigateToKeywords,
            onScroll: onScroll,
            handlePageClick: handlePageClick,
            handleOpenSceneFromInternal: handleOpenSceneFromInternal,
        };
    },
    __typeProps: {},
});
export default (await import('vue')).defineComponent({
    setup() {
        return {
            ...__VLS_exposed,
        };
    },
    __typeProps: {},
});
; /* PartiallyEnd: #4569/main.vue */
