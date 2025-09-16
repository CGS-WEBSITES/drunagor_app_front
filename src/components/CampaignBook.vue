<template>
  <div class="book-container">
    <!-- Menu Sheet (All Screens) -->
    <v-bottom-sheet v-model="mobileMenuSheet">
      <v-card class="mobile-menu-card">
        <v-toolbar dark>
          <v-spacer />
          <v-btn icon @click="mobileMenuSheet = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>

        <v-list class="mobile-menu-list" v-model:opened="openGroups">
          <!-- Wing Groups -->
          <v-list-group
            v-for="(sectionItems, sectionName) in wingGroups"
            :key="sectionName.toString()"
            :value="sectionName.toString()"
          >
            <template v-slot:activator="{ props }">
              <v-list-item
                v-bind="props"
                :prepend-icon="getSectionIcon(sectionName.toString())"
                :title="sectionName.toString()"
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
              <template v-slot:prepend>
                <v-avatar size="24">
                  <span class="text-caption">{{ index + 1 }}</span>
                </v-avatar>
              </template>
              <v-list-item-title>{{ navItem.title }}</v-list-item-title>
            </v-list-item>
          </v-list-group>

          <!-- Other Groups -->
          <template v-if="Object.keys(otherBookGroups).length > 0">
            <v-divider class="my-2" />
            <v-list-group
              v-for="(sectionItems, sectionName) in otherBookGroups"
              :key="sectionName.toString()"
              :value="sectionName.toString()"
            >
              <template v-slot:activator="{ props }">
                <v-list-item
                  v-bind="props"
                  :prepend-icon="getSectionIcon(sectionName.toString())"
                  :title="sectionName.toString()"
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
                <template v-slot:prepend>
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

    <!-- Main Content Area -->
    <v-main class="main-content">
      <!-- Navigation Container -->
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
            <v-btn value="interactions">
              <v-icon>mdi-eye</v-icon>
              <span class="ml-2">Interact</span>
            </v-btn>
            <v-btn value="keywords">
              <v-icon>mdi-book-search</v-icon>
              <span class="ml-2">Keywords</span>
            </v-btn>
          </v-btn-toggle>
        </v-card>
      </div>

      <!-- Scroll Container -->
      <div class="scroll-root" ref="scrollableContentRef" @scroll="onScroll">
        <!-- Fullscreen Toggle -->
        <v-fab
          v-if="showFullscreenButton"
          :icon="isFullscreen ? 'mdi-fullscreen-exit' : 'mdi-fullscreen'"
          @click="toggleFullscreen"
          size="small"
          class="fullscreen-fab"
          location="top end"
        />

        <!-- Content Container -->
        <v-container fluid class="content-container pa-0">
          <!-- Player View -->
          <transition name="fade-slide" mode="out-in">
            <div
              v-if="currentView === 'player' && currentPage"
              :key="currentIndex"
            >
              <v-sheet
                :key="currentIndex"
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
                <v-container class="pa-3">
                  <v-row>
                    <v-col cols="12">
                      <div
                        v-for="(item, contentLoopIndex) in currentPage.content"
                        :key="`content-${currentIndex}-${contentLoopIndex}`"
                        :id="`content-block-${currentIndex}-${contentLoopIndex}`"
                        class="content-block"
                      >
                        <div
                          class="header-banner"
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

                        <v-card-text v-html="item.setup" />

                        <div v-if="item.instruction" class="pt-5 px-16">
                          <v-img src="@/assets/Barra.png"></v-img>
                        </div>
                      </div>
                    </v-col>
                  </v-row>
                </v-container>
              </v-sheet>
            </div>

            <!-- Keywords View -->
            <div v-else-if="currentView === 'keywords'" key="keywords">
              <KeywordView />
            </div>

            <!-- Interactions View -->
            <div v-else-if="currentView === 'interactions'" key="interactions">
              <v-card class="content-card" elevation="0">
                <!-- QR Scanner -->
                <div v-if="interPage === 'scan'" class="scanner-container">
                  <v-card-title class="text-center">
                    <v-icon start>mdi-qrcode-scan</v-icon>
                    Scan Interaction
                  </v-card-title>

                  <v-card-text class="text-center">
                    <div class="video-wrapper">
                      <video
                        id="qr-video"
                        class="qr-video"
                        autoplay
                        muted
                        playsinline
                      />

                      <v-btn
                        v-if="isCameraSwitchVisible"
                        @click="switchCamera"
                        icon="mdi-camera-flip"
                        size="small"
                        class="camera-switch"
                      />
                    </div>

                    <v-divider class="my-4">OR</v-divider>

                    <v-btn
                      @click="goToInteractionList"
                      prepend-icon="mdi-view-list"
                      variant="tonal"
                    >
                      View All Interactions
                    </v-btn>
                  </v-card-text>
                </div>

                <!-- Interaction List -->
                <div v-else-if="interPage === 'list'" class="interaction-list">
                  <v-toolbar color="transparent" flat>
                    <v-btn icon @click="resetScan">
                      <v-icon>mdi-arrow-left</v-icon>
                    </v-btn>
                    <v-toolbar-title>Available Interactions</v-toolbar-title>
                  </v-toolbar>

                  <v-list>
                    <v-list-item
                      v-for="(config, key) in interactionConfigs"
                      :key="key"
                      @click="loadInteractionByKey(key.toString())"
                      :title="config.title"
                      :subtitle="config.subtitle"
                      prepend-icon="mdi-play-box"
                    />
                  </v-list>
                </div>

                <!-- Interaction Content -->
                <div
                  v-else-if="interPage === 'titles' && currentInteractionConfig"
                  class="interaction-content"
                >
                  <!-- Imagem sem overlay -->
                  <v-img
                    :src="currentInteractionConfig.background"
                    height="300"
                    cover
                    class="interaction-hero"
                    gradient="to bottom, rgba(0,0,0,0.1), rgba(0,0,0,0.3)"
                  />

                  <!-- Conteúdo do texto abaixo da imagem -->
                  <v-card-text class="interaction-text-content">
                    <div class="text-center mb-4">
                      <h2 class="interaction-title mb-2">
                        {{ currentInteractionConfig.title }}
                      </h2>
                      <p class="interaction-subtitle text-medium-emphasis">
                        {{ currentInteractionConfig.subtitle }}
                      </p>
                    </div>

                    <!-- Botões de escolha organizados -->
                    <v-row class="interaction-choices" justify="center">
                      <v-col
                        v-for="item in interactionChoices"
                        :key="item.id"
                        cols="12"
                        sm="6"
                        md="4"
                        class="d-flex"
                      >
                        <v-btn
                          @click="selectInteraction(item)"
                          block
                          size="large"
                          variant="elevated"
                          class="interaction-choice-btn"
                          :ripple="true"
                        >
                          <span class="text-wrap">{{ item.title }}</span>
                        </v-btn>
                      </v-col>
                    </v-row>
                  </v-card-text>

                  <!-- Ações do rodapé -->
                  <v-card-actions class="justify-center pa-4">
                    <v-btn
                      @click="resetScan"
                      prepend-icon="mdi-close"
                      variant="outlined"
                    >
                      Close
                    </v-btn>
                  </v-card-actions>
                </div>

                <!-- Interaction Detail -->
                <div v-else-if="interPage === 'content' && activeInteraction">
                  <v-toolbar color="transparent" flat>
                    <v-btn icon @click="backToTitles">
                      <v-icon>mdi-arrow-left</v-icon>
                    </v-btn>
                    <v-toolbar-title>{{
                      activeInteraction.title
                    }}</v-toolbar-title>
                    <v-btn icon @click="resetScan">
                      <v-icon>mdi-close</v-icon>
                    </v-btn>
                  </v-toolbar>

                  <v-card-text>
                    <div
                      v-for="(p, i) in activeInteraction.body"
                      :key="i"
                      v-html="p"
                      class="interaction-body"
                    />

                    <v-row v-if="availableActions.length > 0" class="mt-4">
                      <v-col
                        v-for="(action, idx) in availableActions"
                        :key="idx"
                        cols="12"
                        sm="6"
                      >
                        <v-btn
                          @click="executeAction(action)"
                          block
                          variant="outlined"
                        >
                          {{ action.text }}
                        </v-btn>
                      </v-col>
                    </v-row>
                  </v-card-text>
                </div>
              </v-card>
            </div>

            <!-- Tutorial View -->
            <div v-else-if="currentView === 'tutorial'" key="tutorial">
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
                        :key="chapter.chapterTitle"
                      >
                        <div
                          class="content-block"
                          :class="{
                            'mb-6':
                              chapterIndex <
                              playerTutorials.chapters.length - 1,
                          }"
                        >
                          <div class="header-banner">
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
                              :key="tutorial.title"
                            >
                              <section
                                :id="`tutorial-section-${chapter.chapterTitle}-${tutorialIndex}`"
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

            <!-- Combat Guide View -->
            <div v-else-if="currentView === 'combatGuide'" key="combatGuide">
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
                        <div class="header-banner">
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
                            :key="mechanic.title"
                          >
                            <section
                              :id="`mechanic-item-${index}`"
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
                              <v-img src="@/assets/Barra.png"></v-img>
                            </div>
                          </template>
                        </div>
                      </div>
                    </v-col>
                  </v-row>
                </v-container>
              </div>
            </div>

            <!-- Exploration Tips View -->
            <div
              v-else-if="currentView === 'explorationTips'"
              key="explorationTips"
            >
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
                        :key="chapter.chapterTitle"
                      >
                        <div
                          class="content-block ml-4"
                          :class="{
                            'mb-6':
                              chapterIdx <
                              firstEncounterClarifications.chapters.length - 1,
                          }"
                        >
                          <div class="header-banner">
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
                              :key="section.title"
                            >
                              <section
                                :id="`1st-enc-section-${chapterIdx}-${sectionIdx}`"
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
                                <v-img src="@/assets/Barra.png"></v-img>
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

            <!-- Character Progression View -->
            <div
              v-else-if="currentView === 'charProgression'"
              key="charProgression"
            >
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
                        :key="chapter.chapterTitle"
                      >
                        <div
                          class="content-block ml-4"
                          :class="{
                            'mb-6':
                              chapterIdx <
                              secondEncounterClarifications.chapters.length - 1,
                          }"
                        >
                          <div class="header-banner">
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
                              :key="section.title"
                            >
                              <section
                                :id="`2nd-enc-section-${chapterIdx}-${sectionIdx}`"
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
                                <v-img src="@/assets/Barra.png"></v-img>
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

            <!-- Empty State -->
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

    <!-- Camera Permission Dialog -->
    <v-dialog v-model="showCameraDeniedDialog" max-width="400">
      <v-card>
        <v-card-title>Camera Permission Required</v-card-title>
        <v-card-text>
          To scan QR codes, please enable camera access in your browser
          settings.
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn @click="showCameraDeniedDialog = false"> OK </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Debug Button (Remover em produção) -->
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
  CSSProperties,
} from "vue";
import { BrowserMultiFormatReader } from "@zxing/library";
import KeywordView from "@/components/KeywordView.vue";

// Import all data and assets
import bookPagesData from "@/data/book/bookPages.json";
import rawInteractionConfigsData from "@/data/book/interactionConfigurations.json";
import gameMechanicsData from "@/data/book/gameMechanicsRulebook.json";
import playerTutorialsData from "@/data/book/playerTutorials.json";
import firstEncounterClarificationsData from "@/data/book/firstEncounterClarifications.json";
import secondEncounterClarificationsData from "@/data/book/secondEncounterClarifications.json";

// Import Images
import BarricadeImg from "@/assets/Interaction_01_The Barricade-min.png";
import ArmorImg from "@/assets/Interaction_03_ShinningArmor-min.png";
import WeaponsTableImg from "@/assets/Interaction_02_WeaponsTable-min.png";
import ReservoirImg from "@/assets/01-Flood-Dungeon_v02-min.png";
import TreasuresImg from "@/assets/02-Arsenal-Dungeon-min.png";
import GargoyleImg from "@/assets/03-Gargoyle-min.png";

// Import Interaction JSONs
import InteractionBarricade from "@/assets/json/InteractionBarricade.json";
import InteractionTheShiningArmor from "@/assets/json/InteractionTheShiningArmor.json";
import InteractionWeaponsTable from "@/assets/json/InteractionWeaponsTable.json";
import InteractionTheStoneGuardian from "@/assets/json/InteractionTheStoneGuardian.json";
import InteractionTheReservoir from "@/assets/json/InteractionTheReservoir.json";
import InteractionTreasuresOfAForgottenAge from "@/assets/json/InteractionTreasuresOfAForgottenAge.json";

import { useDisplay } from "vuetify";
const { smAndDown } = useDisplay();

// Type Interfaces
interface GameAction {
  text: string;
  type: "PROCEED" | "RETURN_TO_CHOICES";
  target?: string;
  condition?: string;
}

interface InteractionItem {
  id: string;
  type: "choice" | "resolution";
  title: string;
  body: string[];
  actions?: GameAction[];
}

interface InteractionConfig {
  title: string;
  subtitle: string;
  background: string;
  items: InteractionItem[];
}

interface PageContentItem {
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

interface NavigationItemExtended {
  sectionTitle: string;
  title: string;
  id: string;
  viewType:
    | "player"
    | "tutorial"
    | "combatGuide"
    | "explorationTips"
    | "charProgression"
    | "keywords"
    | "interactions";
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

// Reactive State
const mobileMenuSheet = ref(false);
const mobileNavValue = ref("chapters");
const openGroups = ref<string[]>([]);
const currentView = ref<string>("player");
const currentIndex = ref(0);
const activeItemId = ref<string | null>(null);
const isFullscreen = ref(false);
const fullscreenSupported = ref(false);
const showCameraDeniedDialog = ref(false);
const scrollableContentRef = ref<HTMLElement | null>(null);

// Interaction State
const interPage = ref<"scan" | "titles" | "content" | "list">("scan");
const currentInteractionConfig = ref<InteractionConfig | null>(null);
const activeInteraction = ref<InteractionItem | null>(null);
const availableActions = ref<GameAction[]>([]);
const availableCameras = ref<MediaDeviceInfo[]>([]);
const currentCameraIndex = ref(0);
const isCameraSwitchVisible = ref(false);
const codeReader = new BrowserMultiFormatReader();
const interactions = ref<InteractionItem[]>([]);

// Data Initialization
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

// Assets Maps
const importedImageAssets: Record<string, string> = {
  BarricadeImg,
  ArmorImg,
  WeaponsTableImg,
  ReservoirImg,
  TreasuresImg,
  GargoyleImg,
};

const importedItemAssets: Record<string, InteractionItem[]> = {
  InteractionBarricade,
  InteractionTheShiningArmor,
  InteractionWeaponsTable,
  InteractionTheStoneGuardian,
  InteractionTheReservoir,
  InteractionTreasuresOfAForgottenAge,
};

const interactionConfigs = ref<Record<string, InteractionConfig>>({});

// Initialize Interaction Configs
const initializeInteractionConfigs = () => {
  const configs: Record<string, InteractionConfig> = {};
  for (const key in rawInteractionConfigsData) {
    const rawConfig = (rawInteractionConfigsData as any)[key] as {
      title: string;
      subtitle: string;
      backgroundImportName: string;
      itemsImportName: string;
    };
    const backgroundImage = importedImageAssets[rawConfig.backgroundImportName];
    const itemsData = importedItemAssets[rawConfig.itemsImportName];

    if (!backgroundImage) {
      console.warn(
        `Background image '${rawConfig.backgroundImportName}' not found for interaction '${key}'`,
      );
    }
    if (!itemsData) {
      console.warn(
        `Items data '${rawConfig.itemsImportName}' not found for interaction '${key}'`,
      );
    }

    configs[key] = {
      title: rawConfig.title,
      subtitle: rawConfig.subtitle,
      background: backgroundImage || "",
      items: itemsData || [],
    };
  }
  interactionConfigs.value = configs;
};

// Computed Properties
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
    !pages.value ||
    pages.value.length === 0
  ) {
    return null;
  }
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
  if (currentPage.value.background) {
    s.backgroundImage = `url(${currentPage.value.background})`;
    s.backgroundSize = "cover";
    s.backgroundRepeat = "no-repeat";
    s.backgroundPosition = "center center";
  } else {
    s.backgroundColor = "#1c1c1c";
  }
  return s;
});

const interactionChoices = computed(() => {
  if (!currentInteractionConfig.value) return [];
  return currentInteractionConfig.value.items.filter(
    (item) => item.type === "choice",
  );
});

const navigationItems = computed<NavigationItemExtended[]>(() => {
  const items: NavigationItemExtended[] = [];

  // Pages
  pages.value.forEach((section, sectionGlobalIdx) => {
    if (section.content && section.content.length > 0) {
      section.content.forEach((contentItem, contentIdx) => {
        if (contentItem.title) {
          items.push({
            sectionTitle: section.section,
            title: contentItem.title,
            id: `nav-player-${sectionGlobalIdx}-${contentIdx}`,
            originalId: `content-block-${sectionGlobalIdx}-${contentIdx}`,
            viewType: "player",
            sectionIndex: sectionGlobalIdx,
          });
        }
      });
    }
  });

  // Tutorials
  if (playerTutorials.value && playerTutorials.value.chapters) {
    const sectionGroupTitle = playerTutorials.value.pageTitle || "Tutorials";
    let tutorialNavCounter = 0;
    playerTutorials.value.chapters.forEach((chapter) => {
      chapter.tutorials.forEach((tutorial, tutorialIndex) => {
        items.push({
          sectionTitle: sectionGroupTitle,
          title: tutorial.title,
          id: `nav-tutorial-${tutorialNavCounter}`,
          viewType: "tutorial",
          targetId: `tutorial-section-${chapter.chapterTitle}-${tutorialIndex}`,
        });
        tutorialNavCounter++;
      });
    });
  }

  // Game Mechanics
  if (gameMechanicsBook.value && gameMechanicsBook.value.mechanics) {
    const sectionGroupTitle =
      gameMechanicsBook.value.pageTitle || "Game Mechanics";
    gameMechanicsBook.value.mechanics.forEach((mechanic, index) => {
      items.push({
        sectionTitle: sectionGroupTitle,
        title: mechanic.title,
        id: `nav-mechanic-${index}`,
        viewType: "combatGuide",
        targetId: `mechanic-item-${index}`,
      });
    });
  }

  // First Encounter
  if (
    firstEncounterClarifications.value &&
    firstEncounterClarifications.value.chapters
  ) {
    const sectionGroupTitle =
      firstEncounterClarifications.value.pageTitle ||
      "1st Encounter Clarifications";
    firstEncounterClarifications.value.chapters.forEach(
      (chapter, chapterIdx) => {
        chapter.sections.forEach((section, sectionIdx) => {
          items.push({
            sectionTitle: sectionGroupTitle,
            title: section.title,
            id: `nav-1st-enc-chap${chapterIdx}-sec${sectionIdx}`,
            viewType: "explorationTips",
            targetId: `1st-enc-section-${chapterIdx}-${sectionIdx}`,
          });
        });
      },
    );
  }

  // Second Encounter
  if (
    secondEncounterClarifications.value &&
    secondEncounterClarifications.value.chapters
  ) {
    const sectionGroupTitle =
      secondEncounterClarifications.value.pageTitle ||
      "2nd Encounter Clarifications";
    secondEncounterClarifications.value.chapters.forEach(
      (chapter, chapterIdx) => {
        chapter.sections.forEach((section, sectionIdx) => {
          items.push({
            sectionTitle: sectionGroupTitle,
            title: section.title,
            id: `nav-2nd-enc-chap${chapterIdx}-sec${sectionIdx}`,
            viewType: "charProgression",
            targetId: `2nd-enc-section-${chapterIdx}-${sectionIdx}`,
          });
        });
      },
    );
  }

  return items;
});

const groupedNavigationItems = computed(() => {
  const groups: { [key: string]: NavigationItemExtended[] } = {};
  navigationItems.value.forEach((item) => {
    if (!groups[item.sectionTitle]) {
      groups[item.sectionTitle] = [];
    }
    groups[item.sectionTitle].push(item);
  });
  return groups;
});

const wingGroups = computed(() => {
  const result: { [key: string]: NavigationItemExtended[] } = {};
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

const otherBookGroupTitlesInOrder = computed(() => [
  tutorialSectionTitle.value,
  gameMechanicsSectionTitle.value,
  firstEncounterSectionTitle.value,
  secondEncounterSectionTitle.value,
]);

const otherBookGroups = computed(() => {
  const result: { [key: string]: NavigationItemExtended[] } = {};
  otherBookGroupTitlesInOrder.value.forEach((title) => {
    if (groupedNavigationItems.value[title]) {
      result[title] = groupedNavigationItems.value[title];
    }
  });
  return result;
});

const scrollToTop = (): void => {
  const container = scrollableContentRef.value;
  if (container) {
    container.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  } else {
    console.warn("scrollableContentRef não encontrado");
  }
};

const scrollToTarget = async (targetId: string, retries = 3): Promise<void> => {
  return new Promise((resolve) => {
    const container = scrollableContentRef.value;

    if (!container) {
      console.warn("Container de scroll não encontrado");
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
            `Elemento com ID "${targetId}" não encontrado após 3 tentativas`,
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

      container.scrollTo({
        top: finalPosition,
        behavior: "smooth",
      });

      setTimeout(() => resolve(), 300);
    };

    attemptScroll();
  });
};

const navigateToSection = async (
  item: NavigationItemExtended,
): Promise<void> => {
  try {
    currentView.value = item.viewType;
    activeItemId.value = item.id;
    openGroups.value = [item.sectionTitle];

    if (item.viewType === "player") {
      if (typeof item.sectionIndex === "number" && item.sectionIndex >= 0) {
        currentIndex.value = item.sectionIndex;

        await nextTick();
        await new Promise((resolve) => setTimeout(resolve, 200));

        if (item.originalId) {
          await scrollToTarget(item.originalId);
        } else {
          scrollToTop();
        }
      } else {
        currentIndex.value = -1;
        scrollToTop();
      }
    } else {
      // Para outras views
      await nextTick();
      await new Promise((resolve) => setTimeout(resolve, 200));

      if (item.targetId) {
        await scrollToTarget(item.targetId);
      } else {
        scrollToTop();
      }
    }
  } catch (error) {
    console.error("Erro na navegação:", error);
  }
};

const debugScroll = () => {
  const container = scrollableContentRef.value;
  if (container) {
    container.scrollTo({ top: 200, behavior: "smooth" });

    setTimeout(() => {}, 1000);
  } else {
    console.error("scrollableContentRef é null!");
  }
};

const onScroll = (event: Event) => {
  const target = event.target as HTMLElement;
  console.log("Scroll event:", target.scrollTop);
};

// Other Methods
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
      if (element.requestFullscreen) {
        await element.requestFullscreen();
      } else if ((element as any).webkitRequestFullscreen) {
        await (element as any).webkitRequestFullscreen();
      } else if ((element as any).mozRequestFullScreen) {
        await (element as any).mozRequestFullScreen();
      } else if ((element as any).msRequestFullscreen) {
        await (element as any).msRequestFullscreen();
      }
      isFullscreen.value = true;
    } else {
      if (document.exitFullscreen) {
        await document.exitFullscreen();
      } else if ((document as any).webkitExitFullscreen) {
        await (document as any).webkitExitFullscreen();
      } else if ((document as any).mozCancelFullScreen) {
        await (document as any).mozCancelFullScreen();
      } else if ((document as any).msExitFullscreen) {
        await (document as any).msExitFullscreen();
      }
      isFullscreen.value = false;
    }
  } catch (error) {
    console.warn("Fullscreen toggle error:", error);
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

// QR Scanner Methods
const findRearCamera = (devices: MediaDeviceInfo[]): number => {
  const rearKeywords = ["back", "rear", "environment", "world", "traseira"];
  for (let i = 0; i < devices.length; i++) {
    const device = devices[i];
    const label = device.label.toLowerCase();
    if (rearKeywords.some((keyword) => label.includes(keyword))) {
      return i;
    }
  }
  return devices.length > 1 ? devices.length - 1 : 0;
};

const startScanner = async () => {
  try {
    const videoElement = document.getElementById(
      "qr-video",
    ) as HTMLVideoElement | null;
    if (!videoElement) {
      console.error("Video element not found");
      return;
    }

    const devices = await codeReader.listVideoInputDevices();
    if (!devices.length) {
      console.error("No cameras found");
      return;
    }

    availableCameras.value = devices;
    isCameraSwitchVisible.value = devices.length > 1;

    if (currentCameraIndex.value >= devices.length) {
      currentCameraIndex.value = findRearCamera(devices);
    }

    const deviceId = devices[currentCameraIndex.value].deviceId;

    codeReader.decodeFromVideoDevice(deviceId, videoElement, (result, err) => {
      if (result) {
        const raw = result.getText().trim();
        let normalized: string;
        try {
          const u = new URL(raw);
          normalized = `${u.origin}${u.pathname.replace(/\/$/, "")}`;
        } catch {
          normalized = raw.replace(/\/$/, "");
        }
        const cfg = interactionConfigs.value[normalized];
        if (cfg) {
          currentInteractionConfig.value = cfg;
          interactions.value = cfg.items;
          interPage.value = "titles";
          codeReader.reset();
        } else {
          console.warn("Unknown QR Code:", normalized);
        }
      }
      if (
        err &&
        !(
          err.name === "NotFoundException" ||
          err.name === "FormatException" ||
          err.name === "ChecksumException"
        )
      ) {
        console.error("Scanner error:", err);
      }
    });
  } catch (e) {
    console.error("Error starting scanner:", e);
    showCameraDeniedDialog.value = true;
  }
};

const switchCamera = () => {
  if (availableCameras.value.length <= 1) return;
  codeReader.reset();
  currentCameraIndex.value =
    (currentCameraIndex.value + 1) % availableCameras.value.length;
  nextTick(() => startScanner());
};

const resetScan = () => {
  interPage.value = "scan";
  currentInteractionConfig.value = null;
  interactions.value = [];
  activeInteraction.value = null;
  isCameraSwitchVisible.value = false;
  availableCameras.value = [];
  currentCameraIndex.value = 0;

  if (currentView.value === "interactions") {
    nextTick(() => {
      codeReader.reset();
      startScanner();
    });
  }
};

const goToInteractionList = () => {
  interPage.value = "list";
  codeReader.reset();
};

const loadInteractionByKey = (key: string) => {
  const cfg = interactionConfigs.value[key];
  if (cfg) {
    currentInteractionConfig.value = cfg;
    interactions.value = cfg.items;
    interPage.value = "titles";
  } else {
    console.error(`Configuration for key '${key}' not found`);
  }
};

const findInteractionById = (id: string): InteractionItem | undefined => {
  return currentInteractionConfig.value?.items.find((item) => item.id === id);
};

const selectInteraction = (interaction: InteractionItem) => {
  activeInteraction.value = interaction;
  interPage.value = "content";
  availableActions.value = interaction.actions || [];
};

const backToTitles = () => {
  interPage.value = "titles";
  activeInteraction.value = null;
  availableActions.value = [];
};

const executeAction = (action: GameAction) => {
  if (action.type === "RETURN_TO_CHOICES") {
    backToTitles();
    return;
  }
  if (action.type === "PROCEED" && action.target) {
    if (action.target === "next-adventure-step") {
      backToTitles();
      return;
    }
    const nextInteraction = findInteractionById(action.target);
    if (nextInteraction) {
      selectInteraction(nextInteraction);
    } else {
      console.error(`Next interaction '${action.target}' not found`);
    }
  }
};

const ensureCameraPermission = async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    stream.getTracks().forEach((t) => t.stop());
    resetScan();
  } catch (err) {
    console.warn("Camera permission denied:", err);
    showCameraDeniedDialog.value = true;
  }
};

// Watchers
watch(mobileNavValue, (newVal) => {
  if (newVal === "menu") {
    currentView.value = "player";
    if (currentIndex.value < 0) currentIndex.value = 0;
  } else if (newVal === "interactions") {
    currentView.value = "interactions";
    ensureCameraPermission();
  } else if (newVal === "keywords") {
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

  if (newView === "interactions") {
    if (oldView !== "interactions") {
      resetScan();
    }
  } else if (oldView === "interactions") {
    codeReader.reset();
  }

  // Reset scroll position quando mudar de view
  if (oldView !== newView) {
    await nextTick();
    await new Promise((resolve) => setTimeout(resolve, 100));
    scrollToTop();
  }
});

// Lifecycle Hooks
onMounted(() => {
  checkFullscreenSupport();
  initializeInteractionConfigs();

  document.addEventListener("fullscreenchange", handleFullscreenChange);
  document.addEventListener("webkitfullscreenchange", handleFullscreenChange);
  document.addEventListener("mozfullscreenchange", handleFullscreenChange);
  document.addEventListener("MSFullscreenChange", handleFullscreenChange);

  nextTick(() => {
    setTimeout(() => {
      debugScroll();
    }, 1000);
  });
});

onBeforeUnmount(() => {
  document.removeEventListener("fullscreenchange", handleFullscreenChange);
  document.removeEventListener(
    "webkitfullscreenchange",
    handleFullscreenChange,
  );
  document.removeEventListener("mozfullscreenchange", handleFullscreenChange);
  document.removeEventListener("MSFullscreenChange", handleFullscreenChange);

  if (isFullscreen.value) {
    toggleFullscreen();
  }

  codeReader.reset();
});
</script>

<style scoped>
.interaction-content {
  border-radius: 16px;
  overflow: hidden;
  background: var(--v-theme-surface);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

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
}

.scroll-root {
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
  background-image: url("@/assets/booktop.png");
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

.section-title {
  font-size: 0.7rem;
  color: white;
  padding: 10px 125px 20px;
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
  padding-left: 126px;
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

.instruction-card :deep(ul) {
  list-style-position: inside;
  padding-left: 0;
  list-style-type: disc;
}

.instruction-card :deep(li) {
  margin-bottom: 0.5em;
  color: #1a120f !important;
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

.scanner-container {
  padding: 24px;
  min-height: 400px;
}

.video-wrapper {
  position: relative;
  display: inline-block;
  margin: 24px auto;
}

.qr-video {
  max-width: 100%;
  width: 300px;
  height: 300px;
  object-fit: cover;
  border-radius: 12px;
  border: 2px solid var(--v-theme-primary);
  background: #000;
}

.camera-switch {
  position: absolute !important;
  top: 8px;
  right: 8px;
  background: rgba(0, 0, 0, 0.6) !important;
  color: white !important;
}

.interaction-hero {
  position: relative;
  border-radius: 0;
}

.interaction-text-content {
  padding: 24px !important;
  background: var(--v-theme-surface);
}

.interaction-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 24px;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.8), transparent);
  color: white;
}

.interaction-title {
  font-size: 1.75rem !important;
  font-weight: 600;
  color: var(--v-theme-on-surface);
  line-height: 1.3;
}

.interaction-subtitle {
  font-size: 1rem;
  line-height: 1.5;
  color: var(--v-theme-on-surface-variant);
  max-width: 600px;
  margin: 0 auto;
}

.interaction-body {
  margin-bottom: 16px;
  line-height: 1.6;
}

.interaction-choices {
  margin-top: 24px;
}

.interaction-choice-btn {
  height: auto !important;
  min-height: 56px;
  padding: 12px 16px !important;
  border-radius: 12px !important;
  font-weight: 500;
  text-transform: none !important;
  letter-spacing: 0.5px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1) !important;
  transition: all 0.3s ease !important;
}

.interaction-choice-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2) !important;
}

.interaction-choice-btn .text-wrap {
  white-space: normal;
  line-height: 1.4;
  text-align: center;
}

.content-card {
  border-radius: 16px !important;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.07) !important;
  background: white;
  margin-bottom: 16px;
}

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

  .interaction-text-content {
    padding: 16px !important;
  }
  
  .interaction-title {
    font-size: 1.5rem !important;
  }
  
  .interaction-subtitle {
    font-size: 0.9rem;
  }
  
  .interaction-choice-btn {
    min-height: 48px;
    font-size: 0.9rem;
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
  }

  .chapter-title-banner {
    font-size: 1.25rem;
    padding-left: 60px;
    padding-right: 20px;
    margin-bottom: 40px;
  }

  .section-title {
    font-size: 0.6rem;
    padding: 8px 60px 15px;
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

  .interaction-hero {
    height: 250px !important;
  }
  
  .interaction-text-content {
    padding: 12px !important;
  }
  
  .interaction-title {
    font-size: 1.3rem !important;
  }
  
  .interaction-subtitle {
    font-size: 0.85rem;
  }
  
  .interaction-choices {
    margin-top: 16px;
  }
}

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
