<template>
  <div class="book-container">
    <!-- Bottom sheet (mobile TOC) -->
    <v-bottom-sheet v-model="mobileMenuSheet">
      <v-card class="mobile-menu-card">
        <v-toolbar dark>
          <v-spacer />
          <v-btn icon @click="mobileMenuSheet = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>

        <v-list class="mobile-menu-list" v-model:opened="openGroups">
          <!-- WING (books) -->
          <v-list-group
            v-for="(sectionItems, sectionName) in wingGroups"
            :key="String(sectionName)"
            :value="String(sectionName)"
          >
            <template #activator="{ props }">
              <v-list-item
                v-bind="props"
                :prepend-icon="getSectionIcon(String(sectionName))"
                :title="String(sectionName)"
                class="mobile-section-header"
              />
            </template>

            <v-list-item
              v-for="(navItem, index) in sectionItems"
              :key="navItem.id"
              @click="handleMobileNavigation(navItem)"
              :active="navItem.id === activeItemId"
              class="mobile-nav-item"
            >
              <template #prepend>
                <v-avatar size="24">
                  <span class="text-caption">{{ index + 1 }}</span>
                </v-avatar>
              </template>
              <v-list-item-title>{{ navItem.title }}</v-list-item-title>
            </v-list-item>
          </v-list-group>

          <!-- Outras seções (Tutorial, Mechanics, etc.) -->
          <template v-if="Object.keys(otherBookGroups).length > 0">
            <v-divider class="my-2" />
            <v-list-group
              v-for="(sectionItems, sectionName) in otherBookGroups"
              :key="String(sectionName)"
              :value="String(sectionName)"
            >
              <template #activator="{ props }">
                <v-list-item
                  v-bind="props"
                  :prepend-icon="getSectionIcon(String(sectionName))"
                  :title="String(sectionName)"
                  class="mobile-section-header"
                />
              </template>

              <v-list-item
                v-for="(navItem, index) in sectionItems"
                :key="navItem.id"
                @click="handleMobileNavigation(navItem)"
                :active="navItem.id === activeItemId"
                class="mobile-nav-item"
              >
                <template #prepend>
                  <v-avatar size="24" color="secondary">
                    <span class="text-caption">{{ index + 1 }}</span>
                  </v-avatar>
                </template>
                <v-list-item-title>{{ navItem.title }}</v-list-item-title>
              </v-list-item>
            </v-list-group>
          </template>
        </v-list>
      </v-card>
    </v-bottom-sheet>

    <v-main class="main-content">
      <!-- Barra de navegação superior -->
      <div class="navigation-container">
        <v-card flat class="navigation-card">
          <v-btn-toggle
            v-model="mobileNavValue"
            variant="outlined"
            divided
            class="navigation-buttons"
          >
            <v-btn value="menu" @click="mobileMenuSheet = true">
              <v-icon>mdi-book-open-page-variant</v-icon>
              <span class="ml-2">Books</span>
            </v-btn>

            <v-btn
              value="interactions"
              @click="mobileNavValue = 'interactions'"
            >
              <v-icon>mdi-eye</v-icon>
              <span class="ml-2">Interact</span>
            </v-btn>

            <v-btn value="keywords" @click="mobileNavValue = 'keywords'">
              <v-icon>mdi-book-search</v-icon>
              <span class="ml-2">Keywords</span>
            </v-btn>
          </v-btn-toggle>
        </v-card>
      </div>

      <!-- Conteúdo com rolagem interna -->
      <div class="scroll-root" ref="scrollableContentRef" @scroll="onScroll">
        <v-container fluid class="content-container pa-0">
          <transition name="fade-slide" mode="out-in">
            <!-- PLAYER VIEW (Books) -->
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
                <div
                  v-if="isFullScreenWithBackground"
                  class="background-overlay"
                ></div>

                <v-container class="pa-0 pt-2 ml-3">
                  <v-row>
                    <v-col cols="12">
                      <div
                        v-for="(item, contentLoopIndex) in currentPage.content"
                        :key="
                          'content-' + currentIndex + '-' + contentLoopIndex
                        "
                        :id="
                          'content-block-' +
                          currentIndex +
                          '-' +
                          contentLoopIndex
                        "
                        class="content-block"
                      >
                        <div
                          class="header-banner"
                          :style="headerBannerStyle"
                          :class="{ 'header-banner-fullscreen': isFullscreen }"
                        >
                          <div
                            class="d-flex align-center justify-space-between pa-0 pb-0"
                          >
                            <h4
                              class="section-title"
                              :class="{
                                'section-title-fullscreen': isFullscreen,
                              }"
                            >
                              {{ currentPage.section }}
                            </h4>
                          </div>

                          <h2
                            v-if="item.title"
                            class="chapter-title-banner"
                            :class="{
                              'chapter-title-banner-fullscreen': isFullscreen,
                            }"
                          >
                            {{ item.title }}
                          </h2>
                        </div>

                        <div
                          class="body-text mt-3"
                          :class="{ 'body-text-fullscreen': isFullscreen }"
                          v-html="item.body"
                        ></div>

                        <v-card
                          v-if="item.instruction"
                          class="instruction-card mt-6 py-0"
                          flat
                        >
                          <v-card-text v-html="item.instruction" />
                        </v-card>

                        <v-card-text v-if="item.setup" v-html="item.setup" />

                        <div v-if="item.instruction" class="pt-5 px-16">
                          <v-img src="@/assets/Barra.png" />
                        </div>
                      </div>
                    </v-col>
                  </v-row>
                </v-container>
              </v-sheet>
            </div>

            <!-- KEYWORDS -->
            <div v-else-if="currentView === 'keywords'" key="keywords">
              <div class="back-button-container">
                <v-btn
                  @click="goBackToBooks"
                  prepend-icon="mdi-arrow-left"
                  variant="outlined"
                  class="back-button"
                >
                  Back to Books
                </v-btn>
              </div>
              <KeywordView />
            </div>

            <!-- INTERACTIONS -->
            <div v-else-if="currentView === 'interactions'" key="interactions">
              <InteractView
                ref="interactViewRef"
                :navigation-items="navigationItems"
                @back="goBackToBooks"
                @navigate-to-book="handleNavigateToBook"
              />
            </div>

            <!-- Tutorial -->
            <div v-else-if="currentView === 'tutorial'" key="tutorial">
              <div class="back-button-container">
                <v-btn
                  @click="goBackToBooks"
                  prepend-icon="mdi-arrow-left"
                  variant="outlined"
                  class="back-button"
                >
                  Back to Books
                </v-btn>
              </div>

              <div
                class="book-page ma-5"
                :style="{
                  backgroundColor: '#ffffff',
                  color: '#212121',
                  borderRadius: '12px',
                  border: '1px solid #1e1e1e',
                  boxShadow:
                    '0 0 10px rgba(94, 69, 57, 0.3), inset 0 0 20px rgba(94, 69, 57, 0.2)',
                }"
              >
                <v-container fluid class="pa-3">
                  <v-row>
                    <v-col cols="12">
                      <template
                        v-for="(
                          chapter, chapterIndex
                        ) in playerTutorials.chapters"
                        :key="'tutorial-ch-' + chapter.chapterTitle"
                      >
                        <div
                          class="content-block"
                          :class="{
                            'mb-6':
                              chapterIndex <
                              playerTutorials.chapters.length - 1,
                          }"
                        >
                          <div class="header-banner" :style="headerBannerStyle">
                            <div
                              class="d-flex align-center justify-space-between pa-0 pb-0"
                            >
                              <h4 class="section-title">
                                {{ playerTutorials.pageTitle }}
                              </h4>
                            </div>
                            <h2 class="chapter-title-banner">
                              {{ chapter.chapterTitle }}
                            </h2>
                          </div>

                          <div class="body-text-mechanics pa-4 mt-3">
                            <template
                              v-for="(
                                tutorial, tutorialIndex
                              ) in chapter.tutorials"
                              :key="'tutorial-' + tutorial.title"
                            >
                              <section
                                :id="
                                  'tutorial-section-' +
                                  chapter.chapterTitle +
                                  '-' +
                                  tutorialIndex
                                "
                                class="mb-4"
                              >
                                <h3 class="tutorial-section-title">
                                  {{ tutorial.title }}
                                </h3>
                                <div v-html="tutorial.bodyHTML"></div>
                              </section>
                            </template>
                          </div>
                        </div>
                      </template>
                    </v-col>
                  </v-row>
                </v-container>
              </div>
            </div>

            <!-- Combat Guide -->
            <div v-else-if="currentView === 'combatGuide'" key="combatGuide">
              <div class="back-button-container">
                <v-btn
                  @click="goBackToBooks"
                  prepend-icon="mdi-arrow-left"
                  variant="outlined"
                  class="back-button"
                >
                  Back to Books
                </v-btn>
              </div>

              <div
                class="book-page ma-5"
                :style="{
                  backgroundColor: '#ffffff',
                  color: '#212121',
                  borderRadius: '12px',
                  border: '1px solid #1e1e1e',
                  boxShadow:
                    '0 0 10px rgba(94, 69, 57, 0.3), inset 0 0 20px rgba(94, 69, 57, 0.2)',
                }"
              >
                <v-container fluid class="pa-3">
                  <v-row>
                    <v-col cols="12">
                      <div class="content-block ml-4">
                        <div class="header-banner" :style="headerBannerStyle">
                          <div
                            class="d-flex align-center justify-space-between pa-0 pb-0"
                          >
                            <h4 class="section-title">
                              {{ gameMechanicsBook.pageTitle }}
                            </h4>
                          </div>
                          <h2 class="chapter-title-banner">
                            {{ gameMechanicsBook.chapterTitle }}
                          </h2>
                        </div>

                        <div class="body-text-mechanics pa-4 mt-3">
                          <template
                            v-for="(
                              mechanic, index
                            ) in gameMechanicsBook.mechanics"
                            :key="'mechanic-' + mechanic.title"
                          >
                            <section
                              :id="'mechanic-item-' + index"
                              class="mb-4"
                            >
                              <h3 class="mechanic-title">
                                {{ mechanic.title }}
                              </h3>
                              <div v-html="mechanic.bodyHTML"></div>
                            </section>

                            <div
                              class="pt-5 px-16"
                              v-if="
                                index < gameMechanicsBook.mechanics.length - 1
                              "
                            >
                              <v-img src="@/assets/Barra.png" />
                            </div>
                          </template>
                        </div>
                      </div>
                    </v-col>
                  </v-row>
                </v-container>
              </div>
            </div>

            <!-- Exploration Tips -->
            <div
              v-else-if="currentView === 'explorationTips'"
              key="explorationTips"
            >
              <div class="back-button-container">
                <v-btn
                  @click="goBackToBooks"
                  prepend-icon="mdi-arrow-left"
                  variant="outlined"
                  class="back-button"
                >
                  Back to Books
                </v-btn>
              </div>

              <div
                class="book-page ma-5"
                :style="{
                  backgroundColor: '#ffffff',
                  color: '#212121',
                  borderRadius: '12px',
                  border: '1px solid #1e1e1e',
                  boxShadow:
                    '0 0 10px rgba(94, 69, 57, 0.3), inset 0 0 20px rgba(94, 69, 57, 0.2)',
                }"
              >
                <v-container class="pa-3">
                  <v-row>
                    <v-col cols="12">
                      <template
                        v-for="(
                          chapter, chapterIdx
                        ) in firstEncounterClarifications.chapters"
                        :key="'explore-ch-' + chapter.chapterTitle"
                      >
                        <div
                          class="content-block ml-4"
                          :class="{
                            'mb-6':
                              chapterIdx <
                              firstEncounterClarifications.chapters.length - 1,
                          }"
                        >
                          <div class="header-banner" :style="headerBannerStyle">
                            <div
                              class="d-flex align-center justify-space-between pa-0 pb-0"
                            >
                              <h4 class="section-title">
                                {{ firstEncounterClarifications.pageTitle }}
                              </h4>
                            </div>
                            <h2 class="chapter-title-banner">
                              {{ chapter.chapterTitle }}
                            </h2>
                          </div>

                          <div class="body-text-mechanics pa-4 mt-3">
                            <template
                              v-for="(section, sectionIdx) in chapter.sections"
                              :key="
                                'explore-sec-' + chapterIdx + '-' + sectionIdx
                              "
                            >
                              <section
                                :id="
                                  '1st-enc-section-' +
                                  chapterIdx +
                                  '-' +
                                  sectionIdx
                                "
                                class="mb-4"
                              >
                                <h3 class="tutorial-section-title">
                                  {{ section.title }}
                                </h3>
                                <div v-html="section.bodyHTML"></div>
                              </section>

                              <div
                                class="pt-5 px-16"
                                v-if="sectionIdx < chapter.sections.length - 1"
                              >
                                <v-img src="@/assets/Barra.png" />
                              </div>
                            </template>
                          </div>
                        </div>
                      </template>
                    </v-col>
                  </v-row>
                </v-container>
              </div>
            </div>

            <!-- Char Progression -->
            <div
              v-else-if="currentView === 'charProgression'"
              key="charProgression"
            >
              <div class="back-button-container">
                <v-btn
                  @click="goBackToBooks"
                  prepend-icon="mdi-arrow-left"
                  variant="outlined"
                  class="back-button"
                >
                  Back to Books
                </v-btn>
              </div>

              <div
                class="book-page ma-5"
                :style="{
                  backgroundColor: '#ffffff',
                  color: '#212121',
                  borderRadius: '12px',
                  border: '1px solid #1e1e1e',
                  boxShadow:
                    '0 0 10px rgba(94, 69, 57, 0.3), inset 0 0 20px rgba(94, 69, 57, 0.2)',
                }"
              >
                <v-container class="pa-3">
                  <v-row>
                    <v-col cols="12">
                      <template
                        v-for="(
                          chapter, chapterIdx
                        ) in secondEncounterClarifications.chapters"
                        :key="'char-ch-' + chapter.chapterTitle"
                      >
                        <div
                          class="content-block ml-4"
                          :class="{
                            'mb-6':
                              chapterIdx <
                              secondEncounterClarifications.chapters.length - 1,
                          }"
                        >
                          <div class="header-banner" :style="headerBannerStyle">
                            <div
                              class="d-flex align-center justify-space-between pa-0 pb-0"
                            >
                              <h4 class="section-title">
                                {{ secondEncounterClarifications.pageTitle }}
                              </h4>
                            </div>
                            <h2 class="chapter-title-banner">
                              {{ chapter.chapterTitle }}
                            </h2>
                          </div>

                          <div class="body-text-mechanics pa-4 mt-3">
                            <template
                              v-for="(section, sectionIdx) in chapter.sections"
                              :key="'char-sec-' + chapterIdx + '-' + sectionIdx"
                            >
                              <section
                                :id="
                                  '2nd-enc-section-' +
                                  chapterIdx +
                                  '-' +
                                  sectionIdx
                                "
                                class="mb-4"
                              >
                                <h3 class="tutorial-section-title">
                                  {{ section.title }}
                                </h3>
                                <div v-html="section.bodyHTML"></div>
                              </section>

                              <div
                                class="pt-5 px-16"
                                v-if="sectionIdx < chapter.sections.length - 1"
                              >
                                <v-img src="@/assets/Barra.png" />
                              </div>
                            </template>
                          </div>
                        </div>
                      </template>
                    </v-col>
                  </v-row>
                </v-container>
              </div>
            </div>

            <!-- Dragon Clarifications -->
            <div
              v-else-if="currentView === 'dragonClarifications'"
              key="dragonClarifications"
            >
              <div class="back-button-container">
                <v-btn
                  @click="goBackToBooks"
                  prepend-icon="mdi-arrow-left"
                  variant="outlined"
                  class="back-button"
                >
                  Back to Books
                </v-btn>
              </div>

              <div
                class="book-page ma-5"
                :style="{
                  backgroundColor: '#ffffff',
                  color: '#212121',
                  borderRadius: '12px',
                  border: '1px solid #1e1e1e',
                  boxShadow:
                    '0 0 10px rgba(94, 69, 57, 0.3), inset 0 0 20px rgba(94, 69, 57, 0.2)',
                }"
              >
                <v-container class="pa-3">
                  <v-row>
                    <v-col cols="12">
                      <template
                        v-for="(
                          chapter, chapterIdx
                        ) in dragonClarifications.chapters"
                        :key="'dragon-ch-' + chapter.chapterTitle"
                      >
                        <div
                          class="content-block ml-4"
                          :class="{
                            'mb-6':
                              chapterIdx <
                              dragonClarifications.chapters.length - 1,
                          }"
                        >
                          <div class="header-banner" :style="headerBannerStyle">
                            <div
                              class="d-flex align-center justify-space-between pa-0 pb-0"
                            >
                              <h4 class="section-title">
                                {{ dragonClarifications.pageTitle }}
                              </h4>
                            </div>
                            <h2 class="chapter-title-banner">
                              {{ chapter.chapterTitle }}
                            </h2>
                          </div>

                          <div class="body-text-mechanics pa-4 mt-3">
                            <template
                              v-for="(section, sectionIdx) in chapter.sections"
                              :key="
                                'dragon-sec-' + chapterIdx + '-' + sectionIdx
                              "
                            >
                              <section
                                :id="
                                  'dragon-clarifications-section-' +
                                  chapterIdx +
                                  '-' +
                                  sectionIdx
                                "
                                class="mb-4"
                              >
                                <h3 class="tutorial-section-title">
                                  {{ section.title }}
                                </h3>
                                <div v-html="section.bodyHTML"></div>
                              </section>

                              <div
                                class="pt-5 px-16"
                                v-if="sectionIdx < chapter.sections.length - 1"
                              >
                                <v-img src="@/assets/Barra.png" />
                              </div>
                            </template>
                          </div>
                        </div>
                      </template>
                    </v-col>
                  </v-row>
                </v-container>
              </div>
            </div>

            <!-- Vazio -->
            <div v-else key="empty">
              <div
                class="text-center pa-5 fill-height d-flex align-center justify-center"
              >
                <div>Select a chapter from the table of contents to begin.</div>
              </div>
            </div>
          </transition>
        </v-container>
      </div>
    </v-main>

    <v-fab
      v-if="false"
      icon="mdi-bug"
      @click="debugScroll"
      size="small"
      class="debug-fab"
      location="bottom start"
      color="error"
    />
  </div>
</template>

<script setup lang="ts">
import {
  ref,
  computed,
  onMounted,
  onBeforeUnmount,
  watch,
  nextTick,
  type CSSProperties,
} from "vue";
import { useRoute } from "vue-router";
import KeywordView from "@/components/KeywordView.vue";
import InteractView from "@/components/InteractView.vue";

// Data
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

// Types
interface PageContentItem {
  id: string;
  title?: string;
  body: string;
  instruction?: string;
  setup?: string;
}

interface PageSection {
  section: string;
  content: PageContentItem[];
  layout: string;
  background: string;
}

type ViewType =
  | "player"
  | "tutorial"
  | "combatGuide"
  | "explorationTips"
  | "charProgression"
  | "dragonClarifications"
  | "keywords"
  | "interactions";

interface NavigationItemExtended {
  sectionTitle: string;
  title: string;
  id: string;
  viewType: ViewType;
  sectionIndex?: number;
  originalId?: string;
  targetId?: string;
}

interface GameMechanic {
  title: string;
  bodyHTML: string;
}
interface GameMechanicsBook {
  pageTitle: string;
  chapterTitle: string;
  mechanics: GameMechanic[];
}

interface PlayerTutorialSection {
  title: string;
  bodyHTML: string;
}
interface TutorialChapter {
  chapterTitle: string;
  tutorials: PlayerTutorialSection[];
}
interface PlayerTutorials {
  pageTitle: string;
  chapters: TutorialChapter[];
}

interface ClarificationSection {
  title: string;
  bodyHTML: string;
}
interface ClarificationChapter {
  chapterTitle: string;
  sections: ClarificationSection[];
}
interface EncounterClarificationsBook {
  pageTitle: string;
  chapters: ClarificationChapter[];
}

interface LastBookState {
  view: ViewType;
  index: number;
  activeItemId: string | null;
  openGroups: string[];
}

const route = useRoute();

// Reactive State
const mobileMenuSheet = ref(false);
const mobileNavValue = ref<"menu" | "interactions" | "keywords">("menu");
const openGroups = ref<string[]>([]);
const currentView = ref<ViewType>("player");
const currentIndex = ref(0);
const activeItemId = ref<string | null>(null);

const isFullscreen = ref(false);
const fullscreenSupported = ref(false);

const scrollableContentRef = ref<HTMLElement | null>(null);
const interactViewRef = ref<InstanceType<typeof InteractView> | null>(null);

// Last book state
const lastBookState = ref<LastBookState>({
  view: "player",
  index: 0,
  activeItemId: null,
  openGroups: [],
});

// Data init
const pages = ref<PageSection[]>(bookPagesData as PageSection[]);
const gameMechanicsBook = ref<GameMechanicsBook>(
  gameMechanicsData as GameMechanicsBook,
);
const playerTutorials = ref<PlayerTutorials>(
  playerTutorialsData as PlayerTutorials,
);
const firstEncounterClarifications = ref<EncounterClarificationsBook>(
  firstEncounterClarificationsData as EncounterClarificationsBook,
);
const secondEncounterClarifications = ref<EncounterClarificationsBook>(
  secondEncounterClarificationsData as EncounterClarificationsBook,
);
const dragonClarifications = ref<EncounterClarificationsBook>(
  dragonClarificationsData as EncounterClarificationsBook,
);

// Helpers to persist/restore state
const saveCurrentBookState = () => {
  if (
    currentView.value === "player" ||
    currentView.value === "tutorial" ||
    currentView.value === "combatGuide" ||
    currentView.value === "explorationTips" ||
    currentView.value === "charProgression" ||
    currentView.value === "dragonClarifications"
  ) {
    lastBookState.value = {
      view: currentView.value,
      index: currentIndex.value,
      activeItemId: activeItemId.value,
      openGroups: [...openGroups.value],
    };
  }
};

const goBackToBooks = async () => {
  try {
    // restore
    currentView.value = lastBookState.value.view;
    currentIndex.value = lastBookState.value.index;
    activeItemId.value = lastBookState.value.activeItemId;
    openGroups.value = [...lastBookState.value.openGroups];

    // show books tab
    mobileNavValue.value = "menu";

    await nextTick();
    await new Promise((r) => setTimeout(r, 200));

    if (lastBookState.value.activeItemId) {
      const navigationItem = navigationItems.value.find(
        (i) => i.id === lastBookState.value.activeItemId,
      );
      if (navigationItem?.originalId) {
        await scrollToTarget(navigationItem.originalId);
      } else if (navigationItem?.targetId) {
        await scrollToTarget(navigationItem.targetId);
      } else {
        scrollToTop();
      }
    } else {
      scrollToTop();
    }
  } catch (e) {
    console.error("Error returning to books:", e);
    currentView.value = "player";
    mobileNavValue.value = "menu";
    scrollToTop();
  }
};

// Computed
const showFullscreenButton = computed(() => {
  return (
    smAndDown.value &&
    fullscreenSupported.value &&
    currentView.value === "player"
  );
});

const currentPage = computed(() => {
  if (
    currentView.value !== "player" ||
    currentIndex.value < 0 ||
    !pages.value?.length
  )
    return null;
  const clampedIndex = Math.max(
    0,
    Math.min(currentIndex.value, pages.value.length - 1),
  );
  return pages.value[clampedIndex] || null;
});

const isFullScreenWithBackground = computed(() => {
  return (
    currentPage.value?.layout === "full-screen" &&
    !!currentPage.value?.background
  );
});

const backgroundStyle = computed<CSSProperties>(() => {
  if (!currentPage.value) return {};
  const s: CSSProperties = {
    position: "relative",
    color: "#191919",
    borderRadius: "12px",
  };

  // o JSON traz 'background' já como "url('/img/bg.png')" — aplicar direto
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

const headerBannerStyle = computed(() => {
  let imageUrl = booktopImg;
  if (currentView.value === "dragonClarifications") {
    imageUrl = booktops2Img;
  } else if (currentView.value === "player" && currentPage.value) {
    const sectionName = currentPage.value.section || "";
    if (sectionName.includes("WING 3") || sectionName.includes("WING 4")) {
      imageUrl = booktops2Img;
    }
  }
  return { backgroundImage: `url(${imageUrl})` };
});

const navigationItems = computed<NavigationItemExtended[]>(() => {
  const items: NavigationItemExtended[] = [];

  // Pages -> itens com título
  pages.value.forEach((section, sectionGlobalIdx) => {
    if (section.content?.length) {
      section.content.forEach((contentItem, contentIdx) => {
        if (contentItem.title) {
          items.push({
            sectionTitle: section.section,
            title: contentItem.title,
            id: contentItem.id,
            originalId: "content-block-" + sectionGlobalIdx + "-" + contentIdx,
            viewType: "player",
            sectionIndex: sectionGlobalIdx,
          });
        }
      });
    }
  });

  // Tutorials
  if (playerTutorials.value?.chapters) {
    const sectionGroupTitle = playerTutorials.value.pageTitle || "Tutorials";
    let tutorialNavCounter = 0;
    playerTutorials.value.chapters.forEach((chapter) => {
      chapter.tutorials.forEach((tutorial, tutorialIndex) => {
        items.push({
          sectionTitle: sectionGroupTitle,
          title: tutorial.title,
          id: "nav-tutorial-" + tutorialNavCounter,
          viewType: "tutorial",
          targetId:
            "tutorial-section-" + chapter.chapterTitle + "-" + tutorialIndex,
        });
        tutorialNavCounter++;
      });
    });
  }

  // Mechanics
  if (gameMechanicsBook.value?.mechanics) {
    const sectionGroupTitle =
      gameMechanicsBook.value.pageTitle || "Game Mechanics";
    gameMechanicsBook.value.mechanics.forEach((mechanic, index) => {
      items.push({
        sectionTitle: sectionGroupTitle,
        title: mechanic.title,
        id: "nav-mechanic-" + index,
        viewType: "combatGuide",
        targetId: "mechanic-item-" + index,
      });
    });
  }

  // First Encounter
  if (firstEncounterClarifications.value?.chapters) {
    const sectionGroupTitle =
      firstEncounterClarifications.value.pageTitle ||
      "1st Encounter Clarifications";
    firstEncounterClarifications.value.chapters.forEach(
      (chapter, chapterIdx) => {
        chapter.sections.forEach((section, sectionIdx) => {
          items.push({
            sectionTitle: sectionGroupTitle,
            title: section.title,
            id: "nav-1st-enc-chap" + chapterIdx + "-sec" + sectionIdx,
            viewType: "explorationTips",
            targetId: "1st-enc-section-" + chapterIdx + "-" + sectionIdx,
          });
        });
      },
    );
  }

  // Second Encounter
  if (secondEncounterClarifications.value?.chapters) {
    const sectionGroupTitle =
      secondEncounterClarifications.value.pageTitle ||
      "2nd Encounter Clarifications";
    secondEncounterClarifications.value.chapters.forEach(
      (chapter, chapterIdx) => {
        chapter.sections.forEach((section, sectionIdx) => {
          items.push({
            sectionTitle: sectionGroupTitle,
            title: section.title,
            id: "nav-2nd-enc-chap" + chapterIdx + "-sec" + sectionIdx,
            viewType: "charProgression",
            targetId: "2nd-enc-section-" + chapterIdx + "-" + sectionIdx,
          });
        });
      },
    );
  }

  // Dragon Clarifications
  if (dragonClarifications.value?.chapters) {
    const sectionGroupTitle =
      dragonClarifications.value.pageTitle || "Dragon Clarifications";
    dragonClarifications.value.chapters.forEach((chapter, chapterIdx) => {
      chapter.sections.forEach((section, sectionIdx) => {
        items.push({
          sectionTitle: sectionGroupTitle,
          title: section.title,
          id:
            "nav-dragon-clarifications-chap" + chapterIdx + "-sec" + sectionIdx,
          viewType: "dragonClarifications",
          targetId:
            "dragon-clarifications-section-" + chapterIdx + "-" + sectionIdx,
        });
      });
    });
  }

  return items;
});

const groupedNavigationItems = computed(() => {
  const groups: Record<string, NavigationItemExtended[]> = {};
  navigationItems.value.forEach((item) => {
    if (!groups[item.sectionTitle]) groups[item.sectionTitle] = [];
    groups[item.sectionTitle].push(item);
  });
  return groups;
});

const wingGroups = computed(() => {
  const result: Record<string, NavigationItemExtended[]> = {};
  const wingTitles = pages.value.map((p) => p.section);
  wingTitles.forEach((title) => {
    if (groupedNavigationItems.value[title]) {
      result[title] = groupedNavigationItems.value[title];
    }
  });
  return result;
});

const tutorialSectionTitle = computed(
  () => playerTutorials.value.pageTitle || "Tutorials",
);
const gameMechanicsSectionTitle = computed(
  () => gameMechanicsBook.value.pageTitle || "Game Mechanics",
);
const firstEncounterSectionTitle = computed(
  () =>
    firstEncounterClarifications.value.pageTitle ||
    "1st Encounter Clarifications",
);
const secondEncounterSectionTitle = computed(
  () =>
    secondEncounterClarifications.value.pageTitle ||
    "2nd Encounter Clarifications",
);
const dragonClarificationsTitle = computed(
  () => dragonClarifications.value.pageTitle || "Dragon Clarifications",
);

const otherBookGroupTitlesInOrder = computed(() => [
  tutorialSectionTitle.value,
  gameMechanicsSectionTitle.value,
  firstEncounterSectionTitle.value,
  secondEncounterSectionTitle.value,
  dragonClarificationsTitle.value,
]);

const otherBookGroups = computed(() => {
  const result: Record<string, NavigationItemExtended[]> = {};
  otherBookGroupTitlesInOrder.value.forEach((title) => {
    if (groupedNavigationItems.value[title]) {
      result[title] = groupedNavigationItems.value[title];
    }
  });
  return result;
});

// Scroll helpers
const scrollToTop = () => {
  const container = scrollableContentRef.value;
  if (container) {
    container.scrollTo({ top: 0, behavior: "smooth" });
  } else {
    console.warn("scrollableContentRef not found");
  }
};

const scrollToTarget = async (targetId: string, retries = 3): Promise<void> => {
  return new Promise((resolve) => {
    const container = scrollableContentRef.value;
    if (!container) {
      console.warn("Scroll container not found");
      resolve();
      return;
    }

    const attemptScroll = () => {
      const target = document.getElementById(targetId);
      if (!target) {
        if (retries > 0) {
          setTimeout(() => {
            scrollToTarget(targetId, retries - 1).then(resolve);
          }, 150);
        } else {
          console.warn(
            `Element with ID "${targetId}" not found after 3 attempts`,
          );
          resolve();
        }
        return;
      }

      const containerRect = container.getBoundingClientRect();
      const targetRect = target.getBoundingClientRect();
      const currentScroll = container.scrollTop;
      const marginTop = 20;
      const targetPosition =
        currentScroll + (targetRect.top - containerRect.top) - marginTop;
      const finalPosition = Math.max(0, targetPosition);

      container.scrollTo({ top: finalPosition, behavior: "smooth" });
      setTimeout(() => resolve(), 300);
    };

    attemptScroll();
  });
};

const navigateToSection = async (item: NavigationItemExtended) => {
  try {
    currentView.value = item.viewType;
    activeItemId.value = item.id;
    openGroups.value = [item.sectionTitle];

    if (item.viewType === "player") {
      if (typeof item.sectionIndex === "number" && item.sectionIndex >= 0) {
        currentIndex.value = item.sectionIndex;
        await nextTick();
        await new Promise((r) => setTimeout(r, 200));
        if (item.originalId) await scrollToTarget(item.originalId);
        else scrollToTop();
      } else {
        currentIndex.value = -1;
        scrollToTop();
      }
    } else {
      await nextTick();
      await new Promise((r) => setTimeout(r, 200));
      if (item.targetId) await scrollToTarget(item.targetId);
      else scrollToTop();
    }
  } catch (e) {
    console.error("Navigation error:", e);
  }
};

const debugScroll = () => {
  const container = scrollableContentRef.value;
  if (container) container.scrollTo({ top: 200, behavior: "smooth" });
  else console.error("scrollableContentRef is null!");
};

const onScroll = (event: Event) => {
  const target = event.target as HTMLElement;
  // debug (mantido como log simples para não poluir)
  // console.log('Scroll:', target.scrollTop)
};

// Fullscreen helpers
const checkFullscreenSupport = () => {
  fullscreenSupported.value = !!(
    document.fullscreenEnabled ||
    (document as any).webkitFullscreenEnabled ||
    (document as any).mozFullScreenEnabled ||
    (document as any).msFullscreenEnabled
  );
};

const toggleFullscreen = async () => {
  try {
    if (!isFullscreen.value) {
      const element = document.documentElement;
      if (element.requestFullscreen) await element.requestFullscreen();
      else if ((element as any).webkitRequestFullscreen)
        await (element as any).webkitRequestFullscreen();
      else if ((element as any).mozRequestFullScreen)
        await (element as any).mozRequestFullScreen();
      else if ((element as any).msRequestFullscreen)
        await (element as any).msRequestFullscreen();
      isFullscreen.value = true;
    } else {
      if (document.exitFullscreen) await document.exitFullscreen();
      else if ((document as any).webkitExitFullscreen)
        await (document as any).webkitExitFullscreen();
      else if ((document as any).mozCancelFullScreen)
        await (document as any).mozCancelFullScreen();
      else if ((document as any).msExitFullscreen)
        await (document as any).msExitFullscreen();
      isFullscreen.value = false;
    }
  } catch (e) {
    console.warn("Fullscreen toggle error:", e);
  }
};

const handleFullscreenChange = () => {
  const isCurrentlyFullscreen = !!(
    document.fullscreenElement ||
    (document as any).webkitFullscreenElement ||
    (document as any).mozFullScreenElement ||
    (document as any).msFullscreenElement
  );
  isFullscreen.value = isCurrentlyFullscreen;
};

const getSectionIcon = (sectionName: string) => {
  if (sectionName === tutorialSectionTitle.value) return "mdi-school-outline";
  if (sectionName === gameMechanicsSectionTitle.value) return "mdi-sword-cross";
  if (sectionName === firstEncounterSectionTitle.value)
    return "mdi-numeric-1-box-outline";
  if (sectionName === secondEncounterSectionTitle.value)
    return "mdi-numeric-2-box-outline";
  if (sectionName === dragonClarificationsTitle.value)
    return "mdi-alpha-d-box-outline";
  if (sectionName.toLowerCase().includes("wing"))
    return "mdi-book-open-page-variant";
  return "mdi-book-open-variant";
};

const handleMobileNavigation = (item: NavigationItemExtended) => {
  navigateToSection(item);
  mobileMenuSheet.value = false;
};

function handlePageClick(event: MouseEvent) {
  const target = event.target as HTMLElement;
  if (
    target.closest(
      "button, a, .v-card, .v-btn, .header-banner, .v-navigation-drawer, .instruction-card",
    )
  ) {
    return;
  }
}

const openBookById = async (bookId: string) => {
  try {
    currentView.value = "player";

    const navItem = navigationItems.value.find((i) => i.id === bookId);
    if (!navItem) {
      console.warn("Book ID not found:", bookId);
      return;
    }

    openGroups.value = [navItem.sectionTitle];
    await navigateToSection(navItem);

    await nextTick();
    await new Promise((r) => setTimeout(r, 200));
    if (navItem.originalId) {
      await scrollToTarget(navItem.originalId);
    } else if (navItem.targetId) {
      await scrollToTarget(navItem.targetId);
    } else {
      scrollToTop();
    }

    activeItemId.value = navItem.id;
  } catch (e) {
    console.error("openBookById error:", e);
  }
};

const handleNavigateToBook = (bookId: string) => {
  const navItem = navigationItems.value.find((item) => item.id === bookId);
  if (navItem) {
    navigateToSection(navItem);
    mobileNavValue.value = "menu";
  } else {
    console.warn("Book ID not found:", bookId);
  }
};

// Watchers
watch(mobileNavValue, (newVal) => {
  if (newVal === "menu") {
    currentView.value = "player";
    if (currentIndex.value < 0) currentIndex.value = 0;
  } else if (newVal === "interactions") {
    saveCurrentBookState();
    currentView.value = "interactions";
    nextTick(() => {
      interactViewRef.value?.ensureCameraPermission();
    });
  } else if (newVal === "keywords") {
    saveCurrentBookState();
    currentView.value = "keywords";
  }
});

watch(currentView, async (newView, oldView) => {
  if (isFullscreen.value && newView !== "player") {
    await toggleFullscreen();
  }
  if (newView !== "player") {
    currentIndex.value = -1;
  }
  if (oldView !== newView) {
    await nextTick();
    await new Promise((r) => setTimeout(r, 100));
    scrollToTop();
  }
});

watch(
  () => route.params.bookId,
  async (newBookId, oldBookId) => {
    if (newBookId && newBookId !== oldBookId) {
      await nextTick();
      await new Promise((r) => setTimeout(r, 150));
      openBookById(String(newBookId));
    }
  }
);

// Lifecycle
onMounted(async () => {
  checkFullscreenSupport();
  document.addEventListener("fullscreenchange", handleFullscreenChange);
  document.addEventListener(
    "webkitfullscreenchange",
    handleFullscreenChange as any,
  );
  document.addEventListener(
    "mozfullscreenchange",
    handleFullscreenChange as any,
  );
  document.addEventListener(
    "MSFullscreenChange",
    handleFullscreenChange as any,
  );

  nextTick(() => {
    setTimeout(() => {
      debugScroll();
    }, 1000);
  });

  const initialBookId = String(route.params.bookId || "");
  if (initialBookId) {
    await nextTick();
    await new Promise((r) => setTimeout(r, 150));
    openBookById(initialBookId);
  }
});

onBeforeUnmount(() => {
  document.removeEventListener("fullscreenchange", handleFullscreenChange);
  document.removeEventListener(
    "webkitfullscreenchange",
    handleFullscreenChange as any,
  );
  document.removeEventListener(
    "mozfullscreenchange",
    handleFullscreenChange as any,
  );
  document.removeEventListener(
    "MSFullscreenChange",
    handleFullscreenChange as any,
  );
  if (isFullscreen.value) toggleFullscreen();
});

// Exposed (caso use fora)
const navigateToInteract = () => {
  mobileNavValue.value = "interactions";
  currentView.value = "interactions";
  nextTick(() => {
    interactViewRef.value?.ensureCameraPermission();
  });
};
const forceNavigateToInteract = () => {
  mobileNavValue.value = "interactions";
  currentView.value = "interactions";
  nextTick(() => {
    interactViewRef.value?.ensureCameraPermission();
  });
};
defineExpose({ navigateToInteract, forceNavigateToInteract });
</script>

<style scoped>
.book-container {
  height: 100vh;
  overflow: hidden;
  background: var(--v-theme-background);
  display: flex;
  flex-direction: column;
}
.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  padding-top: 0 !important;
}
.navigation-container {
  flex-shrink: 0;
  height: 80px;
  display: flex;
  align-items: center;
  background: var(--v-theme-surface);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  position: sticky;
  top: 0;
  z-index: 99;
}
.navigation-card {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: transparent !important;
}
.navigation-buttons {
  display: flex;
  justify-content: center;
  width: 100%;
  max-width: 600px;
}
.navigation-buttons .v-btn {
  flex: 1;
  max-width: 180px;
  margin: 0 4px;
}

.scroll-root {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  scroll-behavior: smooth;
  position: relative;
  background: var(--v-theme-background);
  -webkit-overflow-scrolling: touch;
  scroll-padding-top: 20px;
}
[id] {
  scroll-margin-top: 20px;
}

.content-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 16px;
  min-height: 100%;
}

.mobile-menu-card {
  max-height: 70vh;
  overflow-y: auto;
}
.mobile-menu-list {
  padding-bottom: 20px;
}
.mobile-section-header {
  font-weight: 600;
}
.mobile-nav-item {
  padding-left: 32px !important;
}

.book-page {
  background-color: #ffffff;
  color: #212121;
  border: 1px solid #1e1e1e;
  margin: 20px;
  box-shadow:
    0 0 10px rgba(94, 69, 57, 0.3),
    inset 0 0 20px rgba(94, 69, 57, 0.2);
  border-radius: 12px;
  min-height: 400px;
}

.header-banner {
  background-size: cover;
  background-repeat: no-repeat;
  background-position: top center;
  padding: 12px 14px 10px;
  position: relative;
  z-index: 1;
  color: #212121;
  border-top-left-radius: 6px;
  border-top-right-radius: 6px;
}
.header-banner .d-flex {
  cursor: move;
}

.v-toolbar__content > .v-toolbar-title {
  margin-inline-start: 7px !important;
}
.v-card-text {
  flex: 1 1 auto;
  font-size: 0.875rem;
  font-weight: 400;
  letter-spacing: 0.0178571429em;
  opacity: var(--v-card-text-opacity, 1);
  padding: 0 !important;
  text-transform: none;
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

.content-block {
  background-color: #fff;
  border: 1px solid #dedede;
  border-radius: 6px;
  padding: 0 0 16px 0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}
.content-block .header-banner {
  padding-left: 16px;
  padding-right: 16px;
}
.content-block:not(:last-child) {
  margin-bottom: 24px;
}
.content-block:last-child {
  margin-bottom: 16px;
}

.body-text.mt-3 {
  margin-top: 1rem !important;
  padding: 0 16px;
}
.body-text {
  font-style: italic;
}
.body-text p {
  font-family: "EB Garamond", serif;
  font-size: 1.1rem;
  line-height: 1.6;
  text-indent: 2em;
  color: #191919 !important;
  margin-bottom: 1.5rem;
}
.body-text p strong {
  font-style: normal;
  font-weight: bold;
}
.body-text div[style*="color: Black"] {
  text-indent: 0em !important;
}

.body-text-mechanics :deep(p) {
  font-family: "EB Garamond", serif;
  font-size: 1rem;
  line-height: 1.6;
  text-indent: 2em;
  margin-bottom: 1em;
  color: #191919 !important;
}
.body-text-mechanics :deep(ul) {
  padding-left: 0;
  list-style: none;
  margin-top: 0.5em;
  margin-bottom: 1em;
}
.body-text-mechanics :deep(li) {
  padding-left: 1.8em;
  position: relative;
  margin-bottom: 0.5em;
  color: #191919 !important;
  font-family: "EB Garamond", serif;
  font-size: 1rem;
  line-height: 1.6;
}
.body-text-mechanics :deep(li:not(.custom-bullet)::before) {
  content: "•";
  position: absolute;
  left: 0.5em;
  top: 0.1em;
  color: #212121;
  font-size: 1.2em;
}
.body-text-mechanics :deep(li.custom-bullet::before) {
  position: absolute;
  left: 0.5em;
  top: 0.1em;
  font-size: 1.2em;
  color: #212121;
}
.body-text-mechanics :deep(li.custom-bullet.filled::before) {
  content: "•";
}
.body-text-mechanics :deep(li.custom-bullet.open::before) {
  content: "○";
}

.mechanic-title {
  font-family: "EB Garamond", serif;
  font-size: 1.5rem;
  margin-top: 1.5rem;
  margin-bottom: 0.75rem;
  text-align: left;
  position: relative;
  padding-left: 1.6em;
  text-shadow: 1px 1px 1px rgba(255, 255, 255, 0.7);
  color: #191919;
}
.mechanic-title::before {
  content: "->";
  position: absolute;
  left: 0.5em;
  top: 0;
  font-size: 1em;
  color: #191919;
}

.tutorial-section-title {
  font-family: "EB Garamond", serif;
  font-size: 1.5rem;
  margin-top: 1.5rem;
  margin-bottom: 0.75rem;
  text-align: left;
  color: #191919;
  font-weight: bold;
  text-shadow: 1px 1px 1px rgba(255, 255, 255, 0.7);
}

.instruction-card {
  background: #e4e4e4 !important;
  border: 2px solid #212121 !important;
  color: #1a120f !important;
  box-shadow: 3px 3px 0px #212121;
  margin-top: 1rem;
  margin-left: 16px;
  margin-right: 16px;
  width: calc(100% - 32px);
}

.book-page-fullscreen {
  margin: 0 !important;
  border-radius: 0 !important;
  height: 100vh !important;
  max-height: 100vh !important;
  border: none !important;
}
.section-title-fullscreen {
  font-size: 0.8rem !important;
}
.chapter-title-banner-fullscreen {
  font-size: 2rem !important;
}
.body-text-fullscreen p {
  font-size: 1.1rem !important;
  line-height: 1.7 !important;
}
.header-banner-fullscreen {
  padding-right: 60px !important;
}

.fullscreen-fab {
  position: fixed !important;
  top: 16px;
  right: 16px;
  z-index: 1000;
}
.debug-fab {
  position: fixed !important;
  bottom: 16px;
  left: 16px;
  z-index: 1000;
}

.back-button-container {
  padding: 16px;
  display: flex;
  justify-content: flex-end;
}
.back-button {
  font-weight: 500;
  letter-spacing: 0.5px;
  text-transform: none !important;
}

/* Animations */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.3s ease;
}
.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(20px);
}
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

/* Responsive */
@media (max-width: 1024px) {
  .section-title {
    padding: 10px 100px 5px;
  }
  .chapter-title-banner {
    font-size: 1.5rem;
    padding-left: 100px;
    padding-right: 30px;
    margin-bottom: 50px;
  }
}
@media (max-width: 768px) {
  .navigation-container {
    height: 70px;
  }
  .content-container {
    padding: 8px;
  }
  .book-page {
    margin: 10px;
  }
  .mobile-menu-card {
    max-height: 80vh;
  }
  .mobile-nav-item {
    padding: 12px 32px !important;
  }
  .mobile-section-header {
    padding: 16px 16px !important;
  }
  .back-button-container {
    padding: 12px;
  }
}
@media (max-width: 480px) {
  .navigation-container {
    height: 60px;
  }
  .book-page {
    margin: 5px;
  }
  .header-banner {
    padding: 8px 10px 6px;
    background-position: left;
  }
  .chapter-title-banner {
    font-size: 1.25rem;
    padding-left: 0;
    margin-left: 130px;
    margin-top: 5px;
    padding-right: 20px;
    margin-bottom: 40px;
  }
  .section-title {
    font-size: 0.6rem;
    padding: 8px 0px 15px;
    margin-left: 130px;
  }
  .body-text p {
    font-size: 1rem;
  }
  .navigation-buttons .v-btn {
    font-size: 0.75rem;
    padding: 0 8px;
  }
  .navigation-buttons .v-btn .ml-2 {
    margin-left: 4px !important;
  }
  .v-toolbar__content > .v-toolbar-title {
    font-size: 0.875rem !important;
  }
  .v-btn__content {
    grid-area: content;
    justify-content: center;
    white-space: normal !important;
  }
  .v-btn.v-btn--density-default {
    height: calc(var(--v-btn-height) + 20px) !important;
  }
  .back-button-container {
    padding: 8px;
  }
  .back-button {
    font-size: 0.875rem;
  }
}

/* Misc */
.text-h6,
.text-subtitle-1 {
  color: #191919 !important;
}
.v-btn {
  letter-spacing: 1px;
  border: 1px solid #212121 !important;
}
:deep(.inline-icon) {
  height: 1.2em;
  width: auto;
  vertical-align: middle;
  margin-bottom: 0.2em;
}

@media (prefers-color-scheme: dark) {
  .content-card {
    background: var(--v-theme-surface);
  }
}
</style>
