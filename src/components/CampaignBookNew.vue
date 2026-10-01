<template>
  <div class="book-container" :class="{ 'book-container--dialog': closable }">
    
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

    <div class="main-content">
      
      <!-- One header: close, library, where you are, contents, text size, tools.
           It slides away while reading down and comes back on the way up. -->
      <header class="book-bar" :class="{ 'book-bar--hidden': barHidden }">
        <button v-if="closable" class="book-bar__icon" title="Close" @click="emit('close')">
          <v-icon>mdi-close</v-icon>
        </button>
        <button v-if="isToolView" class="book-bar__icon" title="Back" @click="exitToolMode">
          <v-icon>mdi-arrow-left</v-icon>
        </button>
        <button v-else-if="currentVolumeId" class="book-bar__icon" title="Library" @click="backToLibrary">
          <v-icon>mdi-bookshelf</v-icon>
        </button>

        <div class="book-bar__title">
          <small v-if="barKicker">{{ barKicker }}</small>
          <strong>{{ barTitle }}</strong>
        </div>

        <v-menu v-if="currentVolumeId && !isToolView && !smAndDown" location="bottom end" max-height="70vh" width="320" :offset="8">
          <template #activator="{ props: menuProps }">
            <button v-bind="menuProps" class="book-bar__btn" title="Contents">
              <v-icon size="20">mdi-format-list-bulleted</v-icon>
              <span class="d-none d-md-inline">Contents</span>
            </button>
          </template>
          <v-card class="book-menu">
            <v-list density="compact" nav>
              <template v-for="(items, section) in currentVolumeGroups" :key="section">
                <v-list-subheader class="text-uppercase font-weight-bold text-caption mt-2">{{ section }}</v-list-subheader>
                <v-list-item
                  v-for="(item, i) in items"
                  :key="item.id"
                  :active="item.id === activeItemId"
                  rounded
                  density="compact"
                  @click="handleMobileNavigation(item)"
                >
                  <template #prepend><span class="text-caption mr-2 text-grey" style="width: 15px">{{ i + 1 }}</span></template>
                  <v-list-item-title class="text-caption">{{ item.title }}</v-list-item-title>
                </v-list-item>
              </template>
            </v-list>
          </v-card>
        </v-menu>

        <v-menu v-if="currentVolumeId && !isToolView" location="bottom end" :offset="8" :close-on-content-click="false">
          <template #activator="{ props: menuProps }">
            <button v-bind="menuProps" class="book-bar__btn" title="Text size">
              <v-icon size="20">mdi-format-size</v-icon>
            </button>
          </template>
          <v-card class="book-menu book-size">
            <button :disabled="fontScale <= 0.85" title="Smaller text" @click="setFontScale(fontScale - 0.1)">A−</button>
            <span>{{ Math.round(fontScale * 100) }}%</span>
            <button :disabled="fontScale >= 1.45" title="Larger text" @click="setFontScale(fontScale + 0.1)">A+</button>
          </v-card>
        </v-menu>

        <v-menu v-if="smAndDown" location="bottom end" :offset="8">
          <template #activator="{ props: menuProps }">
            <button v-bind="menuProps" class="book-bar__btn" title="More">
              <v-icon size="20">mdi-dots-vertical</v-icon>
            </button>
          </template>
          <v-list class="book-menu" density="compact">
            <v-list-item prepend-icon="mdi-qrcode-scan" title="QR interactions" @click="navigateToInteract" />
            <v-list-item prepend-icon="mdi-book-search-outline" title="Keywords" @click="navigateToKeywords" />
          </v-list>
        </v-menu>
        <button
          v-if="!smAndDown"
          class="book-bar__btn"
          :class="{ active: currentView === 'interactions' }"
          title="QR interactions"
          @click="navigateToInteract"
        >
          <v-icon size="20">mdi-qrcode-scan</v-icon>
          <span class="d-none d-md-inline">QR</span>
        </button>
        <button
          v-if="!smAndDown"
          class="book-bar__btn"
          :class="{ active: currentView === 'keywords' }"
          title="Keywords"
          @click="navigateToKeywords"
        >
          <v-icon size="20">mdi-book-search-outline</v-icon>
          <span class="d-none d-md-inline">Keywords</span>
        </button>
      </header>
      <div v-if="currentVolumeId && !isToolView" class="book-progress">
        <span :style="{ width: progress + '%' }"></span>
      </div>

      <div class="book-backdrop" :style="{ backgroundImage: `url(${backdropArt})` }"></div>
      <div class="scroll-root" ref="scrollableContentRef" :style="{ '--book-font-scale': fontScale }" @scroll="onScroll">
        
        <div v-if="!currentVolumeId && !isToolView" key="bookshelf" class="shelf">
          <!-- Pick up where the party is, or where you stopped reading. -->
          <div v-if="hereScene || lastRead" class="shelf__resume">
            <button v-if="hereScene" class="resume-card resume-card--here" @click="openSceneByTarget(props.currentDoor!)">
              <v-icon size="26">mdi-map-marker-radius</v-icon>
              <span>
                <small>You are here</small>
                <strong>{{ hereScene.title }}</strong>
                <em>{{ hereScene.volumeTitle }}</em>
              </span>
              <v-icon>mdi-chevron-right</v-icon>
            </button>
            <button v-if="lastRead" class="resume-card" @click="resumeReading">
              <v-icon size="26">mdi-bookmark</v-icon>
              <span>
                <small>Continue reading</small>
                <strong>{{ lastRead.title }}</strong>
                <em>{{ lastRead.volumeTitle }}</em>
              </span>
              <v-icon>mdi-chevron-right</v-icon>
            </button>
          </div>

          <h3 class="shelf__label">Adventures</h3>
          <div class="shelf__covers">
            <button
              v-for="vol in storyVolumes"
              :key="vol.id"
              class="cover"
              :class="{ 'cover--here': hereScene?.volumeId === vol.id }"
              @click="switchVolume(vol.id)"
            >
              <img :src="coverOf(vol)" alt="" class="cover__art" />
              <span class="cover__text">
                <small>{{ vol.subtitle }}</small>
                <strong>{{ vol.title }}</strong>
              </span>
              <span v-if="hereScene?.volumeId === vol.id" class="cover__here">You are here</span>
            </button>
          </div>

          <h3 class="shelf__label">Rules & references</h3>
          <div class="shelf__refs">
            <button v-for="vol in referenceVolumes" :key="vol.id" class="ref" @click="switchVolume(vol.id)">
              <v-icon size="22">{{ vol.icon }}</v-icon>
              <span>{{ vol.title }}</span>
              <v-icon size="18" class="ref__go">mdi-chevron-right</v-icon>
            </button>
          </div>
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
                          @click="handleBodyClick"
                        ></div>

                        <v-card v-if="item.instruction" class="instruction-card mt-6 py-0 mx-6 mb-6" flat @click="handleBodyClick">
                          <v-card-text class="pa-4" v-html="item.instruction" />
                        </v-card>

                        <v-card-text v-if="item.setup" v-html="item.setup" @click="handleBodyClick" />

                        <div v-if="item.instruction" class="pt-5 px-16 text-center">
                          <v-img src="@/assets/Barra.png" max-height="20" contain />
                        </div>
                      </div>
                    </v-col>
                  </v-row>
                </v-container>
              </v-sheet>

              <nav class="page-turn">
                <button v-if="currentIndex > 0" class="page-turn__btn" @click="goToPage(currentIndex - 1)">
                  <v-icon>mdi-chevron-left</v-icon>
                  <span><small>Previous</small><strong>{{ pageTitle(currentIndex - 1) }}</strong></span>
                </button>
                <button
                  v-if="currentIndex < storyPages.length - 1"
                  class="page-turn__btn page-turn__btn--next"
                  @click="goToPage(currentIndex + 1)"
                >
                  <span><small>Next</small><strong>{{ pageTitle(currentIndex + 1) }}</strong></span>
                  <v-icon>mdi-chevron-right</v-icon>
                </button>
              </nav>
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
                                <div class="body-text-mechanics mt-2" v-html="sec.body" @click="handleBodyClick"></div>
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
                :campaign-type="props.campaignType || ''"
                @close="exitToolMode"
                @open-scene="handleOpenSceneFromInternal"
              />
            </div>

          </transition>
        </v-container>
      </div>
    </div>

    <nav v-if="smAndDown && currentVolumeId && !isToolView" class="book-dock">
      <button :disabled="!isStory || currentIndex === 0" @click="goToPage(currentIndex - 1)">
        <v-icon>mdi-chevron-left</v-icon><span>Previous</span>
      </button>
      <button @click="mobileMenuSheet = true">
        <v-icon>mdi-format-list-bulleted</v-icon><span>Contents</span>
      </button>
      <button :disabled="!isStory || currentIndex >= storyPages.length - 1" @click="goToPage(currentIndex + 1)">
        <span>Next</span><v-icon>mdi-chevron-right</v-icon>
      </button>
    </nav>

    <!-- Image Lightbox Dialog -->
    <v-dialog v-model="showLightbox" max-width="95%" width="1000px" class="lightbox-dialog" scrollable>
      <v-card class="position-relative overflow-hidden pa-0" rounded="xl" style="background: rgba(18, 18, 18, 0.95) !important; backdrop-filter: blur(15px); border: 1px solid rgba(255, 255, 255, 0.15); box-shadow: 0 20px 40px rgba(0,0,0,0.6);">
        <!-- Top Toolbar -->
        <div class="d-flex align-center justify-space-between py-3 px-4 border-b border-opacity-10" style="background: rgba(0, 0, 0, 0.4);">
          <div class="d-flex align-center">
            <v-icon icon="mdi-magnify-plus-outline" class="mr-2 text-amber"></v-icon>
            <span class="text-subtitle-1 font-cinzel font-weight-bold text-white tracking-wider">Image Zoom</span>
          </div>
          <div class="d-flex align-center">
            <!-- Zoom controls -->
            <v-btn
              icon="mdi-minus"
              variant="text"
              color="white"
              size="small"
              :disabled="zoomLevel <= 1"
              @click="zoomOut"
              class="mr-1"
            ></v-btn>
            <span class="text-caption text-white font-weight-bold mx-2" style="min-width: 45px; text-align: center;">
              {{ Math.round(zoomLevel * 100) }}%
            </span>
            <v-btn
              icon="mdi-plus"
              variant="text"
              color="white"
              size="small"
              :disabled="zoomLevel >= 3"
              @click="zoomIn"
              class="mr-2"
            ></v-btn>
            <v-btn
              icon="mdi-autorenew"
              variant="text"
              color="grey-lighten-1"
              size="small"
              :disabled="zoomLevel === 1"
              @click="resetZoom"
              class="mr-4"
              title="Reset Zoom"
            ></v-btn>
            
            <v-divider vertical class="mr-4 border-opacity-20"></v-divider>
            
            <!-- Close Button -->
            <v-btn
              icon="mdi-close"
              variant="tonal"
              color="grey-lighten-4"
              size="small"
              @click="closeLightbox"
            ></v-btn>
          </div>
        </div>

        <!-- Image Container -->
        <v-card-text class="pa-0 d-flex align-center justify-center bg-black overflow-hidden" style="height: 70vh; min-height: 350px; position: relative;">
          <div class="lightbox-image-wrapper">
            <img 
              :src="activeImage" 
              class="lightbox-image"
              :style="{
                width: zoomLevel === 1 ? 'auto' : (100 * zoomLevel) + '%',
                maxWidth: zoomLevel === 1 ? '100%' : 'none',
                maxHeight: zoomLevel === 1 ? '100%' : 'none',
                cursor: zoomLevel > 1 ? 'grab' : 'zoom-in'
              }"
              @click="zoomLevel === 1 ? zoomIn() : resetZoom()"
              alt="Book Illustration"
            />
          </div>
        </v-card-text>
        
        <!-- Helpful tip footer -->
        <div class="text-center py-2 bg-grey-darken-4 text-caption text-grey-lighten-1 border-t border-opacity-10">
          <v-icon icon="mdi-gesture-swipe" size="x-small" class="mr-1"></v-icon>
          <span>Use the controls or click the image to zoom. Drag or swipe to scroll when zoomed.</span>
        </div>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import {
  ref,
  computed,
  watch,
  nextTick,
  type CSSProperties,
} from "vue";
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
import underkeepArt from "@/assets/underkeep.png";
import underkeep2Art from "@/assets/underkeep2.png";

import { useDisplay } from "vuetify";
const { smAndDown } = useDisplay();

const props = defineProps<{
  campaignWing?: string;
  campaignType?: string;
  activeWing?: string;
  // The party's door, to offer "You are here" on the shelf.
  currentDoor?: string;
  // Shows a close button in the header (the book inside a dialog).
  closable?: boolean;
}>();
const emit = defineEmits<{ (e: "close"): void }>();

const isSeason1 = computed(() => {
  const t = (props.campaignType || "").toLowerCase();
  if (t === 'core' || t === 'apocalypse' || t === 'awakenings') return true;
  const wingKey = (props.campaignWing || "").toUpperCase();
  if (wingKey.includes("WING 1") || wingKey.includes("WING 2")) return true;
  const activeKey = (props.activeWing || "").toUpperCase();
  if (activeKey.includes("WING 1") || activeKey.includes("WING 2") || activeKey.includes("WING 01") || activeKey.includes("WING 02")) return true;
  return false;
});

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

const showLightbox = ref(false);
const activeImage = ref("");
const zoomLevel = ref(1);

function handleBodyClick(event: MouseEvent) {
  const target = event.target as HTMLElement;
  if (target && target.tagName === 'IMG') {
    if (target.classList.contains('inline-icon')) {
      return;
    }
    const src = target.getAttribute('src');
    if (src && !src.includes('/icons/') && !src.endsWith('.svg')) {
      activeImage.value = src;
      zoomLevel.value = 1;
      showLightbox.value = true;
    }
  }
}

function zoomIn() {
  if (zoomLevel.value < 3) {
    zoomLevel.value = parseFloat((zoomLevel.value + 0.5).toFixed(1));
  }
}

function zoomOut() {
  if (zoomLevel.value > 1) {
    zoomLevel.value = parseFloat((zoomLevel.value - 0.5).toFixed(1));
  }
}

function resetZoom() {
  zoomLevel.value = 1;
}

function closeLightbox() {
  showLightbox.value = false;
  zoomLevel.value = 1;
}

const rawStartHere = startHereData as PageSection[];
const rawStartHereS1 = startHereS1Data as PageSection[];
const rawStoryBooks = bookPagesData as PageSection[];

const availableVolumes = computed<Volume[]>(() => {
  const vols: Volume[] = [];
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
  } else if (!wingKey) {
    // General Library view: show both Start Here books so users can access either Season 1 or Season 2 tutorials
    vols.push({ 
      id: 'start_here_s1', 
      title: 'Start Here (S1)', 
      subtitle: 'Tutorial', 
      icon: 'mdi-school', 
      type: 'story', 
      data: rawStartHereS1 
    });
    vols.push({ 
      id: 'start_here_s2', 
      title: 'Start Here (S2)', 
      subtitle: 'Tutorial', 
      icon: 'mdi-school', 
      type: 'story', 
      data: rawStartHere 
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
  } else if (wingKey.includes("WING 1 ADVANCED")) {
    vols.push({ 
      id: 'wing_1_advanced', 
      title: 'Wing 1 Advanced', 
      subtitle: 'Campaign Book', 
      icon: 'mdi-sword', 
      type: 'story', 
      data: rawStoryBooks.filter(p => p.section.toUpperCase().includes("WING 1 - ADVANCED")) 
    });
  } else if (wingKey.includes("WING 2 ADVANCED") || wingKey.includes("WING 2")) {
    vols.push({ 
      id: 'wing_2_advanced', 
      title: 'Wing 2 Advanced', 
      subtitle: 'Campaign Book', 
      icon: 'mdi-shield', 
      type: 'story', 
      data: rawStoryBooks.filter(p => p.section.toUpperCase().includes("WING 2 - ADVANCED")) 
    });
  } else if (wingKey.includes("WING 3")) {
    vols.push({ 
      id: 'wing_3', 
      title: 'The Underkeep', 
      subtitle: 'Wing 3', 
      icon: 'mdi-sword-cross', 
      type: 'story', 
      data: rawStoryBooks.filter(p => p.section.toUpperCase().includes("WING 3")) 
    });
  } else if (wingKey.includes("WING 4")) {
    vols.push({ 
      id: 'wing_4', 
      title: 'Draconic Abyss', 
      subtitle: 'Wing 4', 
      icon: 'mdi-fire', 
      type: 'story', 
      data: rawStoryBooks.filter(p => p.section.toUpperCase().includes("WING 4")) 
    });
  } else {
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

const headerBannerStyle = computed(() => {
  const isS1 = isSeason1.value;
  let img = booktopImg;
  const vol = currentVolume.value;
  const id = currentVolumeId.value || "";
  const title = (vol?.title || "").toUpperCase();
  const subtitle = (vol?.subtitle || "").toUpperCase();
  
  if (
      (id === 'start_here' && !isS1) || 
      id === 'start_here_s2' ||
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

watch(() => props.campaignWing, (val) => {
   const key = (val || "").toUpperCase();
   if (key.includes("START")) {
      currentVolumeId.value = "start_here";
   } else {
      currentVolumeId.value = null; 
   }
   scrollToTop();
}, { immediate: true });

function exitToolMode() { 
  mobileNavValue.value = 'menu'; 
  if (currentVolumeId.value) {
     const vol = availableVolumes.value.find(v => v.id === currentVolumeId.value);
     if (vol?.type === 'story') currentView.value = 'player';
     else currentView.value = currentVolumeId.value!;
  } else {
     currentView.value = 'player';
  }
}

function navigateToInteract() { 
  if (currentView.value === 'interactions') {
    exitToolMode();
  } else {
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
  } else {
    mobileNavValue.value = 'keywords'; 
    currentView.value = 'keywords'; 
  }
}

// ---------- Reading aids ----------
const isToolView = computed(() => currentView.value === "keywords" || currentView.value === "interactions");
const isStory = computed(() => currentVolume.value?.type === "story");

const pageTitle = (index: number) => {
  const page = storyPages.value[index];
  return page?.content.find((item) => item.title)?.title || page?.section || "";
};

const barTitle = computed(() => {
  if (currentView.value === "keywords") return "Keywords";
  if (currentView.value === "interactions") return "QR Interactions";
  if (!currentVolume.value) return "Library";
  return isStory.value ? pageTitle(currentIndex.value) || currentVolume.value.title : currentVolume.value.title;
});
const barKicker = computed(() => (currentVolume.value && !isToolView.value && isStory.value ? currentVolume.value.title : ""));

// S2 wings (3 and 4, Start Here S2, the dragon) use the Season 2 art.
const isSeason2Volume = (vol?: Volume) => {
  if (!vol) return !isSeason1.value;
  const text = `${vol.id} ${vol.title} ${vol.subtitle}`.toUpperCase();
  if (vol.id === "start_here") return !isSeason1.value;
  return vol.id === "start_here_s2" || vol.id === "dragon" || text.includes("WING 3") || text.includes("WING 4");
};
const coverOf = (vol: Volume) => (vol.id.startsWith("start_here") ? (isSeason2Volume(vol) ? booktops2Img : booktopImg) : isSeason2Volume(vol) ? underkeep2Art : underkeepArt);
const backdropArt = computed(() => (isSeason2Volume(currentVolume.value) ? underkeep2Art : underkeepArt));

// Text size, remembered in this browser.
const FONT_KEY = "book.fontScale";
const readFontScale = () => {
  try {
    const value = Number(localStorage.getItem(FONT_KEY));
    return value >= 0.8 && value <= 1.5 ? value : 1;
  } catch {
    return 1;
  }
};
const fontScale = ref(readFontScale());
function setFontScale(value: number) {
  fontScale.value = Math.round(Math.min(1.5, Math.max(0.8, value)) * 100) / 100;
  try {
    localStorage.setItem(FONT_KEY, String(fontScale.value));
  } catch {
    // Not remembered: fine.
  }
}

// Progress through the book, and the header hiding while reading down.
const scrollFraction = ref(0);
const barHidden = ref(false);
let lastScrollTop = 0;
const progress = computed(() => {
  if (isStory.value && storyPages.value.length) return ((currentIndex.value + scrollFraction.value) / storyPages.value.length) * 100;
  return scrollFraction.value * 100;
});

// Where you stopped reading, per campaign wing.
const lastReadKey = computed(() => `book.lastRead.v1:${(props.campaignWing || "library").toUpperCase()}`);
type LastRead = { volumeId: string; volumeTitle: string; index: number; title: string; scrollTop: number };
const lastRead = ref<LastRead | null>(null);
function loadLastRead() {
  try {
    const saved = JSON.parse(localStorage.getItem(lastReadKey.value) || "null") as LastRead | null;
    lastRead.value = saved && availableVolumes.value.some((vol) => vol.id === saved.volumeId) ? saved : null;
  } catch {
    lastRead.value = null;
  }
}
let saveTimer: ReturnType<typeof setTimeout> | undefined;
function saveLastRead() {
  clearTimeout(saveTimer);
  saveTimer = setTimeout(() => {
    const vol = currentVolume.value;
    if (!vol || isToolView.value) return;
    const entry: LastRead = {
      volumeId: vol.id,
      volumeTitle: vol.title,
      index: isStory.value ? currentIndex.value : 0,
      title: isStory.value ? pageTitle(currentIndex.value) : vol.title,
      scrollTop: scrollableContentRef.value?.scrollTop ?? 0,
    };
    lastRead.value = entry;
    try {
      localStorage.setItem(lastReadKey.value, JSON.stringify(entry));
    } catch {
      // Not remembered: fine.
    }
  }, 400);
}
function resumeReading() {
  const entry = lastRead.value;
  if (!entry) return;
  switchVolume(entry.volumeId);
  if (isStory.value) currentIndex.value = entry.index;
  nextTick(() => setTimeout(() => scrollableContentRef.value?.scrollTo({ top: entry.scrollTop }), 200));
}
watch(lastReadKey, loadLastRead, { immediate: true });

function onScroll() {
  const el = scrollableContentRef.value;
  if (!el) return;
  const max = el.scrollHeight - el.clientHeight;
  scrollFraction.value = max > 0 ? Math.min(1, el.scrollTop / max) : 1;
  const top = el.scrollTop;
  if (Math.abs(top - lastScrollTop) > 8) {
    barHidden.value = top > lastScrollTop && top > 120;
    lastScrollTop = top;
  }
  saveLastRead();
}

function goToPage(index: number) {
  if (!isStory.value || index < 0 || index >= storyPages.value.length) return;
  currentIndex.value = index;
  activeItemId.value = null;
  barHidden.value = false;
  nextTick(scrollToTop);
  saveLastRead();
}
function handlePageClick() {}

watch(mobileNavValue, (val) => {
   if (val === 'menu') {
      if (currentVolumeId.value) {
         switchVolume(currentVolumeId.value);
      } else {
         currentView.value = 'player';
         scrollToTop();
      }
   } else if (val === 'keywords') {
      currentView.value = 'keywords';
      scrollToTop();
   } else if (val === 'interactions') {
      currentView.value = 'interactions';
      scrollToTop();
   }
});

function handleOpenSceneFromInternal(target: string) {
    currentView.value = 'player';
    openSceneByTarget(target);
}

function findScene(target: string) {
    let titleTarget = target.toLowerCase().replace(/scene\s*[-–]\s*/, "").trim().replace(/-/g, " ");
    
    let foundVolId = null;
    let foundSectionIndex = -1;
    let foundItemOriginalId = null;

    for (const vol of availableVolumes.value) {
        if (vol.type !== 'story') continue;
        const sections = vol.data as PageSection[];
        
        for (let sIdx = 0; sIdx < sections.length; sIdx++) {
            const sec = sections[sIdx];
            for (let cIdx = 0; cIdx < sec.content.length; cIdx++) {
                const item = sec.content[cIdx];
                const itemTitle = (item.title || "").toLowerCase().trim();
                
                if (
                    item.id === target || 
                    itemTitle === titleTarget || 
                    itemTitle.replace(/[^a-z0-9]/g, "") === titleTarget.replace(/[^a-z0-9]/g, "")
                ) {
                    foundVolId = vol.id;
                    foundSectionIndex = sIdx;
                    foundItemOriginalId = `content-block-${sIdx}-${cIdx}`;
                    break;
                }
            }
            if (foundVolId) break;
        }
        if (foundVolId) break;
    }

    if (!foundVolId) return null;
    const vol = availableVolumes.value.find((v) => v.id === foundVolId)!;
    const page = (vol.data as PageSection[])[foundSectionIndex];
    const item = page.content.find((_, cIdx) => `content-block-${foundSectionIndex}-${cIdx}` === foundItemOriginalId);
    return {
        volumeId: foundVolId as string,
        volumeTitle: vol.title,
        sectionIndex: foundSectionIndex,
        originalId: foundItemOriginalId as string | null,
        title: item?.title || page.section,
    };
}

const hereScene = computed(() => (props.currentDoor ? findScene(props.currentDoor) : null));

function openSceneByTarget(target: string) {
    const found = findScene(target);
    const foundVolId = found?.volumeId;
    const foundSectionIndex = found?.sectionIndex ?? -1;
    const foundItemOriginalId = found?.originalId;
    if (foundVolId) {
        currentVolumeId.value = foundVolId;
        currentView.value = 'player';
        currentIndex.value = foundSectionIndex;
        
        nextTick(() => {
            setTimeout(() => {
                if (foundItemOriginalId) scrollToElement(foundItemOriginalId);
            }, 300);
        });
    }
}

defineExpose({ navigateToInteract, forceNavigateToInteract, navigateToKeywords, openSceneByTarget });
</script>

<style scoped>
.book-container { 
  height: calc(100vh - 100px); 
  overflow: hidden; 
  background: var(--v-theme-background); 
  display: flex; 
  flex-direction: column; 
}
@media (max-width: 960px) {
  .book-container { 
    height: calc(100vh - 140px); 
  }
}
.book-container--dialog,
.book-container.book-container--dialog { height: 100dvh; }
.main-content { position: relative; flex: 1; display: flex; flex-direction: column; overflow: hidden; padding-top: 0 !important; }

/* Header */
.book-bar {
  position: relative;
  z-index: 50;
  display: flex;
  flex-shrink: 0;
  align-items: center;
  gap: 4px;
  height: 56px;
  margin-top: 0;
  padding: 0 8px;
  background: rgba(14, 14, 14, 0.92);
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(8px);
  transition: margin-top 0.25s ease;
}
.book-bar--hidden {
  margin-top: -56px;
}
.book-bar__icon,
.book-bar__btn {
  display: inline-flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  gap: 6px;
  height: 40px;
  min-width: 40px;
  padding: 0 10px;
  border-radius: 10px;
  color: rgba(255, 255, 255, 0.85);
  font-family: "Poppins", sans-serif;
  font-size: 0.78rem;
  font-weight: 600;
  transition: background 0.15s ease;
}
.book-bar__icon:hover,
.book-bar__btn:hover {
  background: rgba(255, 255, 255, 0.08);
}
.book-bar__btn.active {
  background: rgba(var(--v-theme-accent), 0.2);
  color: rgb(var(--v-theme-accent));
}
.book-bar__title {
  display: flex;
  flex: 1;
  flex-direction: column;
  min-width: 0;
  padding: 0 6px;
  line-height: 1.15;
}
.book-bar__title small {
  overflow: hidden;
  font-family: "Poppins", sans-serif;
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 0.5px;
  text-overflow: ellipsis;
  text-transform: uppercase;
  white-space: nowrap;
  opacity: 0.55;
}
.book-bar__title strong {
  overflow: hidden;
  font-family: "Cinzel", serif;
  font-size: 1rem;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.book-menu {
  background: rgb(var(--v-theme-surface)) !important;
}
.book-size {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px;
}
.book-size button {
  width: 44px;
  height: 40px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.08);
  font-weight: 800;
}
.book-size button:disabled {
  opacity: 0.3;
}
.book-size span {
  min-width: 44px;
  font-size: 0.8rem;
  text-align: center;
}
.book-progress {
  position: relative;
  z-index: 49;
  flex-shrink: 0;
  height: 3px;
  background: rgba(255, 255, 255, 0.08);
}
.book-progress span {
  display: block;
  height: 100%;
  background: rgb(var(--v-theme-accent));
  transition: width 0.15s linear;
}
/* The wing's art, blurred, around the page. */
.book-backdrop {
  position: absolute;
  inset: 0;
  z-index: 0;
  background-position: center;
  background-size: cover;
  filter: blur(18px) brightness(0.3);
  transform: scale(1.1);
  pointer-events: none;
}
.hover-white:hover { color: white !important; }

/* Shelf */
.shelf {
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px 16px 48px;
  font-family: "Poppins", sans-serif;
}
.shelf__resume {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 10px;
  margin-bottom: 24px;
}
.resume-card {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px 16px;
  background: rgb(var(--v-theme-primary));
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 14px;
  text-align: left;
  transition: border-color 0.15s ease, transform 0.15s ease;
}
.resume-card:hover {
  border-color: rgb(var(--v-theme-accent));
  transform: translateY(-1px);
}
.resume-card--here {
  background: linear-gradient(120deg, rgba(var(--v-theme-accent), 0.25), rgb(var(--v-theme-primary)) 70%);
  border-color: rgba(var(--v-theme-accent), 0.6);
}
.resume-card > span {
  display: flex;
  flex: 1;
  flex-direction: column;
  min-width: 0;
}
.resume-card small {
  font-size: 0.65rem;
  font-weight: 800;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  opacity: 0.65;
}
.resume-card strong {
  overflow: hidden;
  font-family: "Cinzel", serif;
  font-size: 1.05rem;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.resume-card em {
  font-size: 0.75rem;
  font-style: normal;
  opacity: 0.6;
}
.shelf__label {
  margin: 8px 0 10px;
  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 0.6px;
  text-transform: uppercase;
  opacity: 0.6;
}
.shelf__covers {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 12px;
  margin-bottom: 28px;
}
.cover {
  position: relative;
  display: flex;
  align-items: flex-end;
  aspect-ratio: 3 / 2;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 14px;
  text-align: left;
  transition: transform 0.2s ease, border-color 0.2s ease;
}
.cover:hover {
  border-color: rgb(var(--v-theme-accent));
  transform: translateY(-2px);
}
.cover--here {
  border-color: rgb(var(--v-theme-accent));
}
.cover__art {
  object-position: 78% center;
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s ease;
}
.cover:hover .cover__art {
  transform: scale(1.05);
}
.cover::after {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.9), rgba(0, 0, 0, 0.1) 65%);
  content: "";
}
.cover__text {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  padding: 12px 14px;
}
.cover__text small {
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  opacity: 0.75;
}
.cover__text strong {
  font-family: "Cinzel", serif;
  font-size: 1.1rem;
  line-height: 1.2;
}
.cover__here {
  position: absolute;
  top: 10px;
  left: 10px;
  z-index: 1;
  padding: 3px 9px;
  background: rgb(var(--v-theme-accent));
  border-radius: 999px;
  color: #111;
  font-size: 0.62rem;
  font-weight: 800;
  text-transform: uppercase;
}
.shelf__refs {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 8px;
}
.ref {
  display: flex;
  align-items: center;
  gap: 12px;
  height: 52px;
  padding: 0 12px 0 14px;
  background: rgb(var(--v-theme-primary));
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  font-size: 0.85rem;
  font-weight: 600;
  text-align: left;
  transition: border-color 0.15s ease;
}
.ref:hover {
  border-color: rgb(var(--v-theme-accent));
}
.ref span {
  flex: 1;
}
.ref__go {
  opacity: 0.5;
}
/* Previous / next at the end of a page */
.page-turn {
  display: flex;
  gap: 10px;
  margin: 0 0 32px;
  font-family: "Poppins", sans-serif;
}
.page-turn__btn {
  display: flex;
  flex: 1;
  align-items: center;
  gap: 8px;
  min-width: 0;
  min-height: 64px;
  padding: 10px 14px;
  background: rgba(20, 20, 20, 0.85);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 12px;
  text-align: left;
  transition: border-color 0.15s ease;
}
.page-turn__btn:hover {
  border-color: rgb(var(--v-theme-accent));
}
.page-turn__btn--next {
  justify-content: flex-end;
  text-align: right;
}
.page-turn__btn > span {
  display: flex;
  flex-direction: column;
  min-width: 0;
}
.page-turn__btn small {
  font-size: 0.65rem;
  font-weight: 800;
  text-transform: uppercase;
  opacity: 0.6;
}
.page-turn__btn strong {
  overflow: hidden;
  font-family: "Cinzel", serif;
  text-overflow: ellipsis;
  white-space: nowrap;
}
/* Phones: one dock instead of floating buttons. */
.book-dock {
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 60;
  display: flex;
  gap: 4px;
  padding: 6px 8px calc(6px + env(safe-area-inset-bottom, 0px));
  background: rgba(14, 14, 14, 0.95);
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  font-family: "Poppins", sans-serif;
}
.book-dock button {
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;
  gap: 4px;
  height: 44px;
  border-radius: 10px;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
}
.book-dock button:disabled {
  opacity: 0.3;
}
.tracking-widest { letter-spacing: 2px; }

.scroll-root { flex: 1; overflow-y: auto; overflow-x: hidden; scroll-behavior: smooth; position: relative; z-index: 1; padding-bottom: 40px; }
/* A comfortable reading width (~70 characters a line). */
.content-container { max-width: 780px; margin: 0 auto; padding: 24px 16px; min-height: 100%; }

.mobile-menu-card { max-height: 70vh; overflow-y: auto; }
.mobile-nav-item { padding-left: 20px !important; }
.mobile-section-header { font-weight: 600; font-family: "Cinzel", serif; color: #ddd; }

.book-page { background-color: #f6f1e6 !important; color: #212121; border: 1px solid #1e1e1e; margin-bottom: 30px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); border-radius: 8px; min-height: 400px; overflow: hidden; }
.aux-page-style { background-color: #f6f1e6; color: #212121; border-radius: 8px; }

.header-banner { 
  background-size: cover; 
  background-repeat: no-repeat; 
  background-position: top center; 
  padding: 0px 0px 1px; 
  position: relative; 
  z-index: 1; 
  color: #212121; 
  border-top-left-radius: 6px; 
  border-top-right-radius: 6px; 
}
.section-title { 
  font-size: 0.7rem; 
  color: white; 
  padding: 10px 155px 20px; 
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
  padding-left: 156px; 
  padding-right: 44px; 
  text-align: left; 
}

.content-block { background-color: transparent; border-bottom: 1px solid #eee; padding-bottom: 24px; margin-bottom: 0; }
.content-block:last-child { border-bottom: none; }

.body-text :deep(p), .body-text-mechanics :deep(p) { 
  font-family: "EB Garamond", serif; 
  font-size: calc(1.15rem * var(--book-font-scale, 1)); 
  line-height: 1.6; 
  text-indent: 1.5em; 
  color: #212121 !important; 
  margin-bottom: 1.2rem; 
}
.body-text-mechanics :deep(li) { font-family: "EB Garamond", serif; font-size: calc(1.1rem * var(--book-font-scale, 1)); color: #212121; margin-bottom: 8px; }

.instruction-card { background: #e4e4e4 !important; border: 2px solid #212121 !important; color: #1a120f !important; box-shadow: 3px 3px 0px #212121; margin: 1rem 16px; }

.aux-chapter-title { font-family: "Cinzel", serif; font-size: 1.8rem; border-bottom: 2px solid #ddd; padding-bottom: 8px; color: #333; }
.tutorial-section-title { font-family: "EB Garamond", serif; font-size: 1.5rem; margin: 1.5rem 0 0.75rem; color: #191919; font-weight: bold; text-align: left; }

.font-cinzel { font-family: "Cinzel", serif !important; }
.font-garamond { font-family: "EB Garamond", serif !important; }

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
  .content-container { padding: 8px 8px 72px; }
  .shelf { padding-bottom: 72px; }
  .shelf__covers { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 8px; }
  .cover__text strong { font-size: 0.9rem; }
  .page-turn { flex-direction: column; }
}

.back-button-container { padding: 10px; display: flex; justify-content: flex-end; }

:deep(.inline-icon) {
  height: 18px !important;
  max-height: 1.15em !important;
  width: auto !important;
  vertical-align: middle !important;
  display: inline-block !important;
  margin: 0 4px !important;
}

/* Diagrams never take more than about half the screen; tap one to zoom. */
.body-text :deep(img:not(.inline-icon)),
.body-text-mechanics :deep(img:not(.inline-icon)),
.instruction-card :deep(img:not(.inline-icon)) {
  display: block;
  width: auto !important;
  max-width: 100% !important;
  max-height: min(440px, 55vh);
  margin-right: auto !important;
  margin-left: auto !important;
  border-radius: 6px;
  cursor: zoom-in !important;
}

/* Image zoom rules */
.body-text :deep(img),
.body-text-mechanics :deep(img),
.instruction-card :deep(img) {
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.body-text :deep(img):hover,
.body-text-mechanics :deep(img):hover,
.instruction-card :deep(img):hover {
  transform: scale(1.01);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

/* Ensure inline-icons are not styled with pointer cursor or hover effects */
.body-text :deep(img.inline-icon),
.body-text-mechanics :deep(img.inline-icon),
.instruction-card :deep(img.inline-icon) {
  cursor: default !important;
  transform: none !important;
  box-shadow: none !important;
}

.lightbox-image-wrapper {
  overflow: auto;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #000000;
}

.lightbox-image {
  margin: auto;
  height: auto;
  object-fit: contain;
  transition: width 0.2s ease-out, max-width 0.2s ease-out, max-height 0.2s ease-out;
  user-select: none;
  -webkit-user-drag: none;
}
</style>