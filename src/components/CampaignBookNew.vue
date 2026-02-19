<template>
  <div class="book-container">
    
    <v-bottom-sheet v-model="mobileMenuSheet">
      <v-card class="mobile-menu-card">
        <v-toolbar color="surface" density="compact" class="border-b">
          <v-btn icon size="small" @click="backToLibrary" v-if="currentVolumeId">
            <v-icon>mdi-arrow-left</v-icon>
          </v-btn>
          <v-toolbar-title class="text-subtitle-2 font-weight-bold ml-2">
            {{ currentVolume?.title || "Library" }}
          </v-toolbar-title>
          <v-spacer />
          <v-btn icon size="small" @click="mobileMenuSheet = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>

        <v-list class="mobile-menu-list" v-model:opened="openGroups" density="compact">
          <v-list-group
            v-for="(sectionItems, sectionName) in currentVolumeGroups"
            :key="String(sectionName)"
            :value="String(sectionName)"
          >
            <template #activator="{ props }">
              <v-list-item
                v-bind="props"
                density="compact"
                :title="String(sectionName)"
                class="mobile-section-header"
              >
                <template v-slot:prepend>
                  <v-icon icon="mdi-bookmark-outline" size="small" class="text-grey"></v-icon>
                </template>
              </v-list-item>
            </template>
            <v-list-item
              v-for="(navItem, index) in sectionItems"
              :key="navItem.id"
              @click="handleMobileNavigation(navItem)"
              :active="navItem.id === activeItemId"
              class="mobile-nav-item"
              density="compact"
            >
              <template #prepend>
                <span class="text-caption text-grey mr-3">{{ index + 1 }}</span>
              </template>
              <v-list-item-title class="text-body-2">{{ navItem.title }}</v-list-item-title>
            </v-list-item>
          </v-list-group>
        </v-list>
      </v-card>
    </v-bottom-sheet>

    <v-main class="main-content">
      
      <div class="compact-nav-bar" v-if="!smAndDown && currentVolumeId">
        <v-container class="d-flex align-center py-0 px-4 fill-height" fluid>
          
          <v-btn 
            variant="text" 
            class="px-2 text-none text-grey-lighten-1 hover-white"
            @click="backToLibrary"
            height="32"
          >
            <v-icon start icon="mdi-bookshelf" size="small"></v-icon>
            Library
          </v-btn>

          <v-icon icon="mdi-chevron-right" size="small" class="mx-2 text-grey-darken-2"></v-icon>

          <div class="font-cinzel font-weight-bold text-white text-truncate" style="font-size: 1.1rem;">
             {{ currentVolume?.title }}
          </div>

          <v-spacer></v-spacer>

          <v-menu location="bottom end" max-height="500" width="300" :offset="10">
            <template v-slot:activator="{ props }">
              <v-btn v-bind="props" variant="text" size="small" class="text-none text-grey-lighten-1 mr-2">
                Contents
                <v-icon end>mdi-menu-down</v-icon>
              </v-btn>
            </template>
            <v-card class="bg-surface border-thin elevation-10">
              <v-list density="compact" nav>
                 <template v-for="(items, section) in currentVolumeGroups" :key="section">
                    <v-list-subheader class="text-uppercase font-weight-bold text-caption mt-2">{{ section }}</v-list-subheader>
                    <v-list-item 
                      v-for="(item, i) in items" 
                      :key="item.id" 
                      @click="handleMobileNavigation(item)"
                      :active="item.id === activeItemId"
                      rounded
                      density="compact"
                    >
                       <template v-slot:prepend><span class="text-caption mr-2 text-grey" style="width: 15px;">{{ i + 1 }}</span></template>
                       <v-list-item-title class="text-caption">{{ item.title }}</v-list-item-title>
                    </v-list-item>
                    <v-divider class="my-1 border-opacity-10"></v-divider>
                 </template>
              </v-list>
            </v-card>
          </v-menu>

          <div class="d-flex align-center border-s border-opacity-10 pl-2">
            <v-tooltip text="Interactions" location="bottom">
              <template v-slot:activator="{ props }">
                <v-btn 
                  v-if="currentView === 'player' || currentView === 'tutorial'"
                  icon="mdi-eye-outline"
                  variant="text"
                  density="comfortable"
                  :active="mobileNavValue === 'interactions'"
                  @click="navigateToInteract"
                  v-bind="props"
                  color="grey-lighten-1"
                ></v-btn>
              </template>
            </v-tooltip>
            
            <v-tooltip text="Keywords" location="bottom">
              <template v-slot:activator="{ props }">
                <v-btn 
                  icon="mdi-book-search-outline"
                  variant="text"
                  density="comfortable"
                  :active="mobileNavValue === 'keywords'"
                  @click="mobileNavValue = 'keywords'"
                  v-bind="props"
                  color="grey-lighten-1"
                ></v-btn>
              </template>
            </v-tooltip>
          </div>
        </v-container>
      </div>

      <div class="scroll-root" ref="scrollableContentRef" @scroll="onScroll">
        
        <div v-if="!currentVolumeId" key="bookshelf" class="bookshelf-view d-flex align-center justify-center">
           <v-container class="library-container">
                 <div class="text-center mb-4">
                    <h2 class="text-h5 font-cinzel text-white text-uppercase tracking-widest">Library</h2>
                 </div>

                 <div class="category-header text-caption text-grey text-uppercase mb-2 font-weight-bold">Adventures</div>
                 <v-row dense class="mb-4">
                    <v-col 
                       v-for="vol in storyVolumes" 
                       :key="vol.id" 
                       cols="6" sm="4" md="3"
                    >
                       <v-card 
                          class="library-card story-card"
                          @click="switchVolume(vol.id)"
                          hover
                          variant="tonal"
                       >
                          <div class="d-flex align-center fill-height px-3">
                             <v-icon :icon="vol.icon" size="24" class="mr-3 text-amber-accent-2"></v-icon>
                             <div class="d-flex flex-column text-truncate">
                                <span class="font-cinzel font-weight-bold text-white text-subtitle-2">{{ vol.title }}</span>
                                <span class="text-caption text-grey text-truncate" v-if="vol.subtitle">{{ vol.subtitle }}</span>
                             </div>
                          </div>
                       </v-card>
                    </v-col>
                 </v-row>

                 <div class="category-header text-caption text-grey text-uppercase mb-2 font-weight-bold mt-2">Rules & References</div>
                 <v-row dense>
                    <v-col 
                       v-for="vol in referenceVolumes" 
                       :key="vol.id" 
                       cols="6" sm="4" md="3"
                    >
                       <v-card 
                          class="library-card ref-card"
                          @click="switchVolume(vol.id)"
                          hover
                          variant="tonal"
                       >
                          <div class="d-flex align-center fill-height px-3">
                             <v-icon :icon="vol.icon" size="20" class="mr-3 text-blue-lighten-2"></v-icon>
                             <div class="d-flex flex-column text-truncate">
                                <span class="text-white text-caption font-weight-bold">{{ vol.title }}</span>
                             </div>
                          </div>
                       </v-card>
                    </v-col>
                 </v-row>
           </v-container>
        </div>

        <v-container v-else fluid class="content-container pa-0">
          <transition name="fade-slide" mode="out-in">
            
            <div
              v-if="currentView === 'player' && currentPage"
              :key="'player-' + currentIndex"
            >
              <v-sheet
                :key="'sheet-' + currentIndex"
                :style="backgroundStyle"
                class="book-page"
                :class="{ 'book-page-fullscreen': isFullscreen }"
                elevation="0"
                rounded
                @click="handlePageClick"
              >
                <div v-if="isFullScreenWithBackground" class="background-overlay"></div>

                <v-container class="pa-0 pt-2 ml-3">
                  <v-row>
                    <v-col cols="12">
                      <div
                        v-for="(item, contentLoopIndex) in currentPage.content"
                        :key="'content-' + currentIndex + '-' + contentLoopIndex"
                        :id="'content-block-' + currentIndex + '-' + contentLoopIndex"
                        class="content-block"
                      >
                        <div
                          class="header-banner"
                          :style="headerBannerStyle"
                          :class="{ 'header-banner-fullscreen': isFullscreen }"
                        >
                          <div class="d-flex align-center justify-space-between pa-0 pb-0">
                            <h4 class="section-title" :class="{'section-title-fullscreen': isFullscreen}">
                              {{ currentPage.section }}
                            </h4>
                          </div>
                          <h2
                            v-if="item.title"
                            class="chapter-title-banner"
                            :class="{'chapter-title-banner-fullscreen': isFullscreen}"
                          >
                            {{ item.title }}
                          </h2>
                        </div>

                        <div
                          class="body-text mt-3 mx-6"
                          :class="{ 'body-text-fullscreen': isFullscreen }"
                          v-html="item.body"
                        ></div>

                        <v-card v-if="item.instruction" class="instruction-card mt-6 py-0 mx-6 mb-6" flat>
                          <v-card-text class="pa-4" v-html="item.instruction" />
                        </v-card>

                        <v-card-text v-if="item.setup" v-html="item.setup" />

                        <div v-if="item.instruction" class="pt-5 px-16 text-center">
                          <v-img src="@/assets/Barra.png" max-height="20" contain />
                        </div>
                      </div>
                    </v-col>
                  </v-row>
                </v-container>
              </v-sheet>
            </div>

            <div v-else-if="isAuxiliaryView" :key="currentView">
              <div class="book-page ma-4 aux-page-style">
                <v-container fluid class="pa-0">
                  <div class="header-banner" :style="headerBannerStyle">
                      <div class="d-flex align-center justify-space-between pa-0 pb-0">
                         <h4 class="section-title">{{ currentAuxiliaryData.pageTitle }}</h4>
                      </div>
                      <h2 class="chapter-title-banner">{{ currentAuxiliaryData.chapterTitle }}</h2>
                  </div>
                  
                  <v-container class="pa-6">
                    <template v-for="(chapter, cIdx) in currentAuxiliaryData.chapters" :key="cIdx">
                       <div class="mb-8">
                          <h3 v-if="currentAuxiliaryData.chapters.length > 1" class="aux-chapter-title mb-4">{{ chapter.title }}</h3>
                          
                          <template v-for="(sec, sIdx) in chapter.sections" :key="sIdx">
                             <div :id="sec.id" class="mb-6">
                                <h4 class="tutorial-section-title">{{ sec.title }}</h4>
                                <div class="body-text-mechanics mt-2" v-html="sec.body"></div>
                             </div>
                             <div class="pt-5 px-16 text-center" v-if="sIdx < chapter.sections.length - 1">
                                <v-img src="@/assets/Barra.png" max-height="20" contain />
                             </div>
                          </template>
                       </div>
                    </template>
                  </v-container>
                </v-container>
              </div>
            </div>

            <div v-else-if="currentView === 'keywords'" key="keywords">
               <div class="back-button-container pa-4" v-if="smAndDown">
                <v-btn @click="exitToolMode" variant="text" prepend-icon="mdi-arrow-left">Back</v-btn>
              </div>
              <KeywordView />
            </div>

            <div v-else-if="currentView === 'interactions'" key="interactions">
              <InteractView
                ref="interactViewRef"
                :currentDoor="props.campaignWing || ''"
                :wing="props.campaignWing || ''"
                @close="exitToolMode"
              />
            </div>

          </transition>
        </v-container>
      </div>
    </v-main>

    <v-fab
      v-if="smAndDown && currentVolumeId && currentView !== 'keywords' && currentView !== 'interactions'"
      icon="mdi-format-list-bulleted"
      @click="mobileMenuSheet = true"
      location="bottom right"
      class="mb-4 mr-4"
      color="primary"
      app
      style="z-index: 100;"
      size="small"
    />
    
    <v-fab
      v-if="smAndDown && currentVolumeId"
      icon="mdi-arrow-left"
      @click="backToLibrary"
      location="bottom left"
      class="mb-4 ml-4"
      color="grey-darken-3"
      app
      style="z-index: 100;"
      size="small"
    />
  </div>
</template>

<script setup lang="ts">
import {
  ref,
  computed,
  onMounted,
  watch,
  nextTick,
  type CSSProperties,
} from "vue";
import { useRoute } from "vue-router";
import KeywordView from "@/components/KeywordView.vue";
import InteractView from "@/components/InteractViewNew.vue"; 

// Data Imports
import startHereData from "@/data/book/StartHere.json";
import bookPagesData from "@/data/book/bookPages.json";
import gameMechanicsData from "@/data/book/gameMechanicsRulebook.json";
import playerTutorialsData from "@/data/book/playerTutorials.json";
import firstEncounterClarificationsData from "@/data/book/firstEncounterClarifications.json";
import secondEncounterClarificationsData from "@/data/book/secondEncounterClarifications.json";
import dragonClarificationsData from "@/data/book/dragonClarifications.json";

// Images
import booktopImg from "@/assets/booktop.png";
import booktops2Img from "@/assets/booktops2.png";

import { useDisplay } from "vuetify";
const { smAndDown } = useDisplay();

const props = defineProps<{ campaignWing?: string }>();

// --- TIPOS ---
interface Volume {
  id: string;
  title: string;
  subtitle?: string;
  icon: string;
  type: 'story' | 'reference';
  data?: any;
}

interface PageContentItem { id: string; title?: string; body: string; instruction?: string; setup?: string; }
interface PageSection { section: string; content: PageContentItem[]; layout: string; background: string; }
interface NavigationItem { id: string; title: string; sectionTitle: string; originalId?: string; targetId?: string; viewType: string; sectionIndex?: number; }

// --- ESTADO ---
const mobileMenuSheet = ref(false);
const mobileNavValue = ref<"menu" | "interactions" | "keywords">("menu");
const openGroups = ref<string[]>([]);
const currentView = ref<string>("player");
const currentIndex = ref(0);
const activeItemId = ref<string | null>(null);
const currentVolumeId = ref<string | null>(null);

const isFullscreen = ref(false);
const scrollableContentRef = ref<HTMLElement | null>(null);
const interactViewRef = ref<InstanceType<typeof InteractView> | null>(null);

// --- DADOS BRUTOS ---
const rawStartHere = startHereData as PageSection[];
const rawStoryBooks = bookPagesData as PageSection[];

// --- LIVROS DISPONÍVEIS ---
const availableVolumes = computed<Volume[]>(() => {
  const vols: Volume[] = [];
  const wingKey = (props.campaignWing || "").toUpperCase();

  // Story Volumes
  if (wingKey.includes("WING 4")) {
    vols.push({ id: 'wing_4', title: 'Draconic Abyss', subtitle: 'Wing 4', icon: 'mdi-fire', type: 'story', data: rawStoryBooks.filter(p => p.section.toUpperCase().includes("WING 4")) });
  } else {
    // Default Wing 3 ou "Full Story"
    const data = rawStoryBooks.filter(p => p.section.toUpperCase().includes("WING 3"));
    vols.push({ id: 'wing_3', title: 'The Underkeep', subtitle: 'Wing 3', icon: 'mdi-sword-cross', type: 'story', data: data.length ? data : rawStoryBooks });
  }

  // Tutorial
  vols.unshift({ id: 'start_here', title: 'Start Here', subtitle: 'Tutorial', icon: 'mdi-school', type: 'story', data: rawStartHere });

  // Reference Volumes
  vols.push({ id: 'tutorials', title: 'Tutorials', subtitle: 'Reference', icon: 'mdi-help-circle-outline', type: 'reference', data: playerTutorialsData });
  vols.push({ id: 'mechanics', title: 'Game Mechanics', subtitle: 'Rules', icon: 'mdi-cogs', type: 'reference', data: gameMechanicsData });
  vols.push({ id: 'enc_1', title: '1st Encounter', subtitle: 'Rules', icon: 'mdi-numeric-1-box-outline', type: 'reference', data: firstEncounterClarificationsData });
  vols.push({ id: 'enc_2', title: '2nd Encounter', subtitle: 'Rules', icon: 'mdi-numeric-2-box-outline', type: 'reference', data: secondEncounterClarificationsData });
  vols.push({ id: 'dragon', title: 'Dragon Boss', subtitle: 'Rules', icon: 'mdi-alpha-d-box-outline', type: 'reference', data: dragonClarificationsData });

  return vols;
});

// Helper para dividir na estante
const storyVolumes = computed(() => availableVolumes.value.filter(v => v.type === 'story'));
const referenceVolumes = computed(() => availableVolumes.value.filter(v => v.type === 'reference'));

const currentVolume = computed(() => availableVolumes.value.find(v => v.id === currentVolumeId.value));

// --- CONTEÚDO ---
const storyPages = computed<PageSection[]>(() => {
  if (currentVolume.value?.type === 'story') {
    return currentVolume.value.data as PageSection[];
  }
  return [];
});

const currentPage = computed(() => {
  if (currentView.value !== "player" || !storyPages.value.length) return null;
  const clamped = Math.max(0, Math.min(currentIndex.value, storyPages.value.length - 1));
  return storyPages.value[clamped] || null;
});

const currentAuxiliaryData = computed(() => {
  if (currentVolume.value?.type !== 'reference') return { pageTitle: '', chapterTitle: '', chapters: [] };
  
  const raw = currentVolume.value.data;
  const normalizedChapters: { title: string, sections: { id: string, title: string, body: string }[] }[] = [];

  if (currentVolumeId.value === 'mechanics') {
     const sections = raw.mechanics.map((m: any, i: number) => ({ id: `mech-${i}`, title: m.title, body: m.bodyHTML }));
     normalizedChapters.push({ title: 'Game Mechanics', sections });
  } else if (currentVolumeId.value === 'tutorials') {
     raw.chapters.forEach((ch: any, cIdx: number) => {
        const sections = ch.tutorials.map((t: any, sIdx: number) => ({ id: `tut-${cIdx}-${sIdx}`, title: t.title, body: t.bodyHTML }));
        normalizedChapters.push({ title: ch.chapterTitle, sections });
     });
  } else {
     raw.chapters.forEach((ch: any, cIdx: number) => {
        const sections = ch.sections.map((s: any, sIdx: number) => ({ id: `ref-${cIdx}-${sIdx}`, title: s.title, body: s.bodyHTML }));
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

// --- NAVEGAÇÃO ---
const currentVolumeGroups = computed(() => {
  const groups: Record<string, NavigationItem[]> = {};

  if (currentVolume.value?.type === 'story') {
     storyPages.value.forEach((section, sIdx) => {
        const items: NavigationItem[] = [];
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
        if (items.length) groups[section.section] = items;
     });
  } else if (currentVolume.value?.type === 'reference') {
     currentAuxiliaryData.value.chapters.forEach(ch => {
        const items: NavigationItem[] = [];
        ch.sections.forEach(sec => {
           items.push({ 
              id: sec.id, 
              title: sec.title, 
              sectionTitle: ch.title, 
              targetId: sec.id, 
              viewType: currentVolumeId.value!
           });
        });
        if (items.length) groups[ch.title] = items;
     });
  }
  return groups;
});

const flatNavigationItems = computed(() => {
   const all: NavigationItem[] = [];
   Object.values(currentVolumeGroups.value).forEach(group => all.push(...group));
   return all;
});

// --- AÇÕES ---
function backToLibrary() {
  currentVolumeId.value = null;
  mobileMenuSheet.value = false;
  currentView.value = 'player';
  scrollToTop();
}

function switchVolume(volId: string) {
  currentVolumeId.value = volId;
  const vol = availableVolumes.value.find(v => v.id === volId);
  
  if (vol?.type === 'story') {
     currentView.value = 'player';
     currentIndex.value = 0;
  } else {
     currentView.value = volId; 
  }
  
  const keys = Object.keys(currentVolumeGroups.value);
  if (keys.length) openGroups.value = [keys[0]];
  
  scrollToTop();
}

function handleMobileNavigation(item: NavigationItem) {
   activeItemId.value = item.id;
   mobileMenuSheet.value = false;

   if (item.viewType === 'player') {
      if (typeof item.sectionIndex === 'number') {
         currentIndex.value = item.sectionIndex;
         nextTick(() => {
            setTimeout(() => {
               if (item.originalId) scrollToElement(item.originalId);
               else scrollToTop();
            }, 150);
         });
      }
   } else {
      nextTick(() => {
         setTimeout(() => {
            if (item.targetId) scrollToElement(item.targetId);
            else scrollToTop();
         }, 150);
      });
   }
}

function scrollToElement(id: string) {
   const el = document.getElementById(id);
   const container = scrollableContentRef.value;
   if (el && container) {
      const top = el.getBoundingClientRect().top - container.getBoundingClientRect().top + container.scrollTop - 20;
      container.scrollTo({ top, behavior: 'smooth' });
   }
}

function scrollToTop() {
   if (scrollableContentRef.value) scrollableContentRef.value.scrollTop = 0;
}

// --- ESTILOS ---
const headerBannerStyle = computed(() => {
  let img = booktopImg;
  const vol = currentVolume.value;
  const id = currentVolumeId.value || "";
  const title = (vol?.title || "").toUpperCase();
  const subtitle = (vol?.subtitle || "").toUpperCase();
  
  if (
      id === 'start_here' || 
      id === 'dragon' ||
      subtitle.includes("WING 3") || 
      subtitle.includes("WING 4") ||
      title.includes("WING 3") || 
      title.includes("WING 4")
  ) {
     img = booktops2Img;
  }
  return { backgroundImage: `url(${img})` };
});

const isFullScreenWithBackground = computed(() => currentPage.value?.layout === 'full-screen' && !!currentPage.value?.background);

const backgroundStyle = computed<CSSProperties>(() => {
  if (!currentPage.value) return {};
  const s: CSSProperties = { position: "relative", color: "#191919", borderRadius: "8px" };
  if (currentPage.value.background) {
    s.background = currentPage.value.background;
    s.backgroundSize = "cover";
    s.backgroundRepeat = "no-repeat";
    s.backgroundPosition = "center center";
  } else {
    s.backgroundColor = "#1c1c1c";
  }
  return s;
});

// --- WATCHERS E INIT ---
watch(() => props.campaignWing, (val) => {
   const key = (val || "").toUpperCase();
   if (key.includes("START")) {
      currentVolumeId.value = "start_here";
   } else {
      currentVolumeId.value = null; // Abre na Library
   }
   scrollToTop();
}, { immediate: true });

function exitToolMode() { 
  mobileNavValue.value = 'menu'; 
  if(currentVolume.value?.type === 'story') currentView.value = 'player';
  else currentView.value = currentVolumeId.value!;
}

function navigateToInteract() { mobileNavValue.value = 'interactions'; currentView.value = 'interactions'; }

function onScroll() {}
function handlePageClick() {}

watch(mobileNavValue, (val) => {
   if (val === 'menu') {
      if (currentVolumeId.value) switchVolume(currentVolumeId.value);
   } else if (val === 'keywords') {
      currentView.value = 'keywords';
   } else if (val === 'interactions') {
      currentView.value = 'interactions';
   }
});

defineExpose({ navigateToInteract });
</script>

<style scoped>
/* MAIN LAYOUT */
.book-container { height: 100vh; overflow: hidden; background: var(--v-theme-background); display: flex; flex-direction: column; }
.main-content { flex: 1; display: flex; flex-direction: column; overflow: hidden; padding-top: 0 !important; }

/* COMPACT NAV BAR DESKTOP */
.compact-nav-bar {
  height: 48px;
  background-color: #121212;
  border-bottom: 1px solid rgba(255,255,255,0.08);
  flex-shrink: 0;
  z-index: 50;
  box-shadow: 0 4px 6px rgba(0,0,0,0.2);
}
.hover-white:hover { color: white !important; }

/* BOOKSHELF - CLEAN MINIMALIST */
.bookshelf-view {
  min-height: 100%;
  background: #121212;
  padding-bottom: 60px;
}

.library-container {
  max-width: 1000px; 
  padding: 16px;
}

/* CARDS SIMPLIFICADOS (Estilo "Botão Largo" ou "Tile") */
.library-card {
  height: 56px; /* Altura fixa compacta */
  border-radius: 4px;
  background-color: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.1);
  transition: all 0.2s ease;
  cursor: pointer;
  overflow: hidden;
}
.library-card:hover {
  background-color: rgba(255,255,255,0.08);
  border-color: #d4af37;
  transform: translateY(-2px);
}

.story-card { border-left: 3px solid #b71c1c; }
.ref-card { border-left: 3px solid #1565C0; height: 48px; /* Referencias um pouco menores */ }

.tracking-widest { letter-spacing: 2px; }

/* SCROLL AREA */
.scroll-root { flex: 1; overflow-y: auto; overflow-x: hidden; scroll-behavior: smooth; position: relative; background: var(--v-theme-background); padding-bottom: 40px; }
.content-container { max-width: 960px; margin: 0 auto; padding: 24px; min-height: 100%; }

/* MOBILE MENU */
.mobile-menu-card { max-height: 70vh; overflow-y: auto; }
.mobile-nav-item { padding-left: 20px !important; }
.mobile-section-header { font-weight: 600; font-family: "Cinzel", serif; color: #ddd; }

/* READING AREA STYLES - RESTORED ORIGINAL PADDING/FONTS */
.book-page { background-color: #ffffff; color: #212121; border: 1px solid #1e1e1e; margin-bottom: 30px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); border-radius: 8px; min-height: 400px; overflow: hidden; }
.aux-page-style { background-color: #fff; color: #212121; border-radius: 8px; }

/* Header Banner - Paddings Originais Preservados */
.header-banner { 
  background-size: cover; 
  background-repeat: no-repeat; 
  background-position: top center; 
  padding: 0px 0px 1px; /* Restaurado */
  position: relative; 
  z-index: 1; 
  color: #212121; 
  border-top-left-radius: 6px; 
  border-top-right-radius: 6px; 
}
.section-title { 
  font-size: 0.7rem; 
  color: white; 
  padding: 10px 155px 20px; /* Restaurado */
  margin: 0; 
  text-transform: uppercase; 
  font-weight: bold; 
}
.chapter-title-banner { 
  font-family: "Cinzel Decorative", cursive; 
  font-size: 1.8rem; 
  color: white; 
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.6); 
  margin-top: 1px; 
  margin-bottom: 66px; 
  padding-left: 156px; /* Restaurado */
  padding-right: 44px; 
  text-align: left; 
}

/* Body Text */
.content-block { background-color: #fff; border-bottom: 1px solid #eee; padding-bottom: 24px; margin-bottom: 0; }
.content-block:last-child { border-bottom: none; }

.body-text :deep(p), .body-text-mechanics p { 
  font-family: "EB Garamond", serif; 
  font-size: 1.15rem; 
  line-height: 1.6; 
  text-indent: 1.5em; 
  color: #212121 !important; 
  margin-bottom: 1.2rem; 
}
.body-text-mechanics li { font-family: "EB Garamond", serif; font-size: 1.1rem; color: #212121; margin-bottom: 8px; }

.instruction-card { background: #e4e4e4 !important; border: 2px solid #212121 !important; color: #1a120f !important; box-shadow: 3px 3px 0px #212121; margin: 1rem 16px; }

.aux-chapter-title { font-family: "Cinzel", serif; font-size: 1.8rem; border-bottom: 2px solid #ddd; padding-bottom: 8px; color: #333; }
.tutorial-section-title { font-family: "EB Garamond", serif; font-size: 1.5rem; margin: 1.5rem 0 0.75rem; color: #191919; font-weight: bold; text-align: left; }

.font-cinzel { font-family: "Cinzel", serif !important; }
.font-garamond { font-family: "EB Garamond", serif !important; }

/* RESPONSIVE */
@media (max-width: 768px) {
  .header-banner { padding: 8px 10px 6px; background-position: left; }
  .chapter-title-banner { 
    font-size: 1.25rem; 
    padding-left: 0; 
    margin-left: 130px; 
    margin-top: 5px; 
    padding-right: 20px; 
    margin-bottom: 40px; 
    text-align: left; 
  }
  .section-title { 
    font-size: 0.6rem; 
    padding: 8px 0px 15px; 
    margin-left: 130px; 
    text-align: left; 
  }
  .content-container { padding: 8px; }
  .library-container { padding: 8px; }
  
  /* Ajuste no mobile: Cards um pouco mais compactos */
  .library-card { height: 50px; }
}

.back-button-container { padding: 10px; display: flex; justify-content: flex-end; }
</style>