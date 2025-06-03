<template>
  <div>
    <v-card class="book-dialog pa-0" @mousedown="startDrag" v-if="!hideCard">
      <v-layout>
        <v-navigation-drawer expand-on-hover rail permanent width="270" class="nav-drawer" :floating="false">
          <v-list density="compact" nav v-model:opened="openGroups">

            <v-list-group v-for="(sectionItems, sectionName) in groupedNavigationItems" :key="sectionName.toString()"
              :value="sectionName.toString()">
              <template v-slot:activator="{ props: activatorPropsInternal, isOpen }">
                <v-list-item @click="currentView = 'player'" v-bind="activatorPropsInternal"
                  :title="sectionName.toString()" class="drawer-section-header">
                  <template v-slot:prepend>
                    <v-icon :color="isOpen ? '#FFFFFF' : '#f0e6d2'">{{ getSectionIcon(sectionName.toString())
                    }}</v-icon>
                  </template>
                </v-list-item>
              </template>

              <v-list-item v-for="(navItem, itemIndex) in sectionItems" :key="navItem.id" :title="navItem.title"
                :value="navItem.id" @click="navigateToContent(navItem.sectionIndex, navItem.id, navItem.sectionTitle)"
                class="drawer-item-index" :active="navItem.id === activeClickedItemId"
                active-class="v-list-item--active-book-index" density="compact">
                <template v-slot:prepend>
                  <v-avatar :color="navItem.id === activeClickedItemId ? 'amber-darken-2' : 'grey-darken-1'" size="24"
                    class="numbered-avatar">
                    <span class="text-caption font-weight-bold"
                      :style="{ color: navItem.id === activeClickedItemId ? 'white' : '#f0e6d2' }">
                      {{ itemIndex + 1 }}
                    </span>
                  </v-avatar>
                </template>
                <v-tooltip activator="parent" location="end">{{ navItem.title }}</v-tooltip>
              </v-list-item>
            </v-list-group>

            <v-divider v-if="Object.keys(groupedNavigationItems).length > 0"></v-divider>

            <v-list-item title="Book Interactions" value="interactions" @click="setView('interactions')"
              :active="'interactions' === activeClickedItemId" active-class="v-list-item--active-book-index"
              density="compact" class="drawer-section-header">
              <template v-slot:prepend>
                <v-icon :color="'interactions' === activeClickedItemId ? '#FFFFFF' : '#f0e6d2'">mdi-eye</v-icon>
              </template>
              <v-tooltip activator="parent" location="end">Book Interactions</v-tooltip>
            </v-list-item>

            <v-divider v-if="Object.keys(groupedNavigationItems).length > 0"></v-divider>

            <v-list-item title="Keywords" value="keywords" @click="setView('keywords')"
              :active="'keywords' === activeClickedItemId" active-class="v-list-item--active-book-index"
              density="compact" class="drawer-section-header">
              <template v-slot:prepend>
                <v-icon
                  :color="'keywords' === activeClickedItemId ? '#FFFFFF' : '#f0e6d2'">mdi-book-search-outline</v-icon>
              </template>
              <v-tooltip activator="parent" location="end">Keywords</v-tooltip>
            </v-list-item>

            <v-list-item title="Tutorial" value="tutorial" @click="setView('tutorial')"
              :active="'tutorial' === activeClickedItemId" active-class="v-list-item--active-book-index"
              density="compact" class="drawer-section-header">
              <template v-slot:prepend>
                <v-icon :color="'tutorial' === activeClickedItemId ? '#FFFFFF' : '#f0e6d2'">mdi-school-outline</v-icon>
              </template>
              <v-tooltip activator="parent" location="end">Tutorial</v-tooltip>
            </v-list-item>
            <v-list-item title="Game Mechanics" value="combatGuide" @click="setView('combatGuide')"
              :active="'combatGuide' === activeClickedItemId" active-class="v-list-item--active-book-index"
              density="compact" class="drawer-section-header">
              <template v-slot:prepend>
                <v-icon :color="'combatGuide' === activeClickedItemId ? '#FFFFFF' : '#f0e6d2'">mdi-sword-cross</v-icon>
              </template>
              <v-tooltip activator="parent" location="end">Game Mechanics</v-tooltip>
            </v-list-item>

            <v-list-item title="1st Encounter Clarifications" value="explorationTips" @click="setView('explorationTips')"
              :active="'explorationTips' === activeClickedItemId" active-class="v-list-item--active-book-index"
              density="compact" class="drawer-section-header">
              <template v-slot:prepend>
                <v-icon :color="'explorationTips' === activeClickedItemId ? '#FFFFFF' : '#f0e6d2'">mdi-numeric-1-box-outline</v-icon>
              </template>
              <v-tooltip activator="parent" location="end">1st Encounter Clarifications</v-tooltip>
            </v-list-item>

            <v-list-item title="2nd Encounter Clarifications" value="charProgression" @click="setView('charProgression')"
              :active="'charProgression' === activeClickedItemId" active-class="v-list-item--active-book-index"
              density="compact" class="drawer-section-header">
              <template v-slot:prepend>
                <v-icon :color="'charProgression' === activeClickedItemId ? '#FFFFFF' : '#f0e6d2'">mdi-numeric-2-box-outline</v-icon>
              </template>
              <v-tooltip activator="parent" location="end">2nd Encounter Clarifications</v-tooltip>
            </v-list-item>

          </v-list>
        </v-navigation-drawer>

        <v-main class="main-content">
          <v-card-text class="pa-0 scrollable-content" ref="scrollableContentRef">

            <div v-if="currentView === 'player'">
              <v-sheet v-if="currentPage" :key="currentIndex" :style="backgroundStyle as CSSProperties"
                class="book-page" elevation="0" rounded @click="handlePageClick">
                <div v-if="isFullScreenWithBackground" class="background-overlay"></div>
                <v-container class="pa-3 ml-2">
                  <v-row>
                    <v-col cols="12">
                      <div v-for="(item, contentLoopIndex) in currentPage.content"
                        :key="`content-${currentIndex}-${contentLoopIndex}`"
                        :id="`content-block-${currentIndex}-${contentLoopIndex}`" class="content-block">
                        <div class="header-banner">
                          <div class="d-flex align-center justify-space-between pa-0 pb-0">
                            <h4 class="section-title">{{ currentPage.section }}</h4>
                          </div>
                          <h2 v-if="item.title" class="chapter-title-banner">
                            {{ item.title }}
                          </h2>
                        </div>
                        <div class="body-text mt-3" v-html="item.body"></div>
                        <div class="pt-5 px-16">
                          <v-img src="@/assets/Barra.png"></v-img>
                        </div>
                        <v-card v-if="item.instruction" class="instruction-card mt-6 py-0" flat>
                          <v-card-text v-html="item.instruction" />
                        </v-card>
                        <div class="pt-5 px-16">
                          <v-img src="@/assets/Barra.png"></v-img>
                        </div>
                      </div>
                    </v-col>
                  </v-row>
                </v-container>
              </v-sheet>
              <div v-else class="text-center pa-5 fill-height d-flex align-center justify-center">
                <div>Selecione um capítulo no índice para começar.</div>
              </div>
            </div>

            <KeywordView v-else-if="currentView === 'keywords'" />

            <div v-else-if="currentView === 'tutorial'" class="fill-height d-flex align-center justify-center pa-3">
              <v-container class="text-center">
                <h2 class="mb-3">Tutorial</h2>
                <p>Welcome to the tutorial! Information and guides will be available here soon.</p>
                <v-icon size="x-large" class="mt-4" color="grey-lighten-1">mdi-school-outline</v-icon>
              </v-container>
            </div>
            <div v-else-if="currentView === 'combatGuide'"
                  class="book-page ma-5"
                  :style="{ backgroundColor: '#ffffff', color: '#212121', borderRadius: '12px', border: '1px solid #1e1e1e', boxShadow: '0 0 10px rgba(94, 69, 57, 0.3), inset 0 0 20px rgba(94, 69, 57, 0.2)'}">
              <v-container fluid class="pa-0">
                <v-row>
                  <v-col cols="12">
                    <div class="ml-6 mt-2 content-block">
                      <div class="header-banner">
                        <div class="d-flex align-center justify-space-between pa-0 pb-0">
                          <h4 class="section-title">{{ gameMechanicsBook.pageTitle }}</h4>
                        </div>
                        <h2 class="chapter-title-banner">{{ gameMechanicsBook.chapterTitle }}</h2>
                      </div>
                      <div class="body-text-mechanics pa-4 mt-3">
                        <template v-for="(mechanic, index) in gameMechanicsBook.mechanics" :key="mechanic.title">
                          <section class="mb-4">
                            <h3 class="mechanic-title">{{ mechanic.title }}</h3>
                            <div v-html="mechanic.bodyHTML"></div>
                          </section>
                          <div class="pt-5 px-16" v-if="index < gameMechanicsBook.mechanics.length - 1">
                            <v-img src="@/assets/Barra.png"></v-img>
                          </div>
                        </template>
                      </div>
                      <div class="pt-5 px-16" v-if="gameMechanicsBook.mechanics && gameMechanicsBook.mechanics.length > 0">
                        <v-img src="@/assets/Barra.png"></v-img>
                      </div>
                    </div>
                  </v-col>
                </v-row>
              </v-container>
            </div>

            <div v-else-if="currentView === 'explorationTips'" class="fill-height d-flex align-center justify-center pa-3">
              <v-container class="text-center">
                <h2 class="mb-3">Exploration Tips</h2>
                <p>Helpful tips and tricks for exploring the world will be available here soon.</p>
                <v-icon size="x-large" class="mt-4" color="grey-lighten-1">mdi-map-search-outline</v-icon>
              </v-container>
            </div>

            <div v-else-if="currentView === 'charProgression'" class="fill-height d-flex align-center justify-center pa-3">
              <v-container class="text-center">
                <h2 class="mb-3">Character Progression</h2>
                <p>Information on how to develop your characters will be available here soon.</p>
                  <v-icon size="x-large" class="mt-4" color="grey-lighten-1">mdi-account-arrow-up</v-icon>
              </v-container>
            </div>

            <div v-else-if="currentView === 'interactions'">
              <v-container class="py-2 px-4" style="flex: 1; display: flex; flex-direction: column">
                <v-row class="d-flex align-center justify-space-between mb-2 mt-2" style="flex-shrink: 0">
                  <template v-if="interPage === 'scan' && !scanned">
                    <h3 class="dialog-title">Scan QR Code</h3>
                  </template>
                  <template v-else-if="interPage === 'titles'">
                    <div class="interaction-header">
                      <div class="d-flex justify-space-between">
                        <h2 class="interaction-main-title">
                          {{ currentInteractionConfig?.title }}
                        </h2>
                        <v-btn icon @click="resetScan" class="close-btn header-close">
                          <v-icon>mdi-close</v-icon>
                        </v-btn>
                      </div>
                      <p class="interaction-subtitle">
                        {{ currentInteractionConfig?.subtitle }}
                      </p>
                    </div>
                  </template>
                  <template v-else>
                    <v-btn class="back-btn text-white mt-4" color="grey darken-2" @click="interPage = 'titles'">
                      <v-icon left>mdi-arrow-left</v-icon>
                      Back to Options
                    </v-btn>
                    <v-btn icon @click="resetScan" class="close-btn">
                      <v-icon>mdi-close</v-icon>
                    </v-btn>
                  </template>
                </v-row>
                <div v-if="interPage === 'scan' && !scanned"
                  class="scan-page d-flex flex-column align-center justify-center">
                  <video id="qr-video" class="qr-video mb-4" autoplay muted playsinline></video>
                  <p class="mt-4 text-white">
                    Aponte a câmera para o QR Code
                  </p>
                </div>
                <div v-else-if="interPage === 'titles'" class="titles-background" :style="{
                  backgroundImage: `url(${currentInteractionConfig?.background})`,
                }">
                  <div class="buttons-overlay">
                    <v-row dense>
                      <v-col v-for="item in interactions" :key="item.id" cols="12" class="py-1">
                        <v-btn class="interaction-btn" block @click="showContent(item.id)">
                          {{ item.title }}
                        </v-btn>
                      </v-col>
                    </v-row>
                  </div>
                </div>
                <div v-else class="content-page-interactions">
                  <div class="content-wrapper-interactions" ref="contentWrapper">
                    <div v-for="item in interactions" :key="item.id" :id="item.id" class="interaction-detail pa-4">
                      <h2 class="chapter-title-interactions mb-4">
                        {{ item.title }}
                      </h2>
                      <div class="body-text-interactions">
                        <p v-for="(p, i) in item.body" :key="i" v-html="p"></p>
                      </div>
                    </div>
                  </div>
                </div>
              </v-container>
            </div>
          </v-card-text>
        </v-main>
      </v-layout>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import KeywordView from '@/components/KeywordView.vue';
import {
  ref,
  computed,
  nextTick,
  watch,
  onBeforeUnmount,
  CSSProperties,
} from "vue";
import { BrowserMultiFormatReader } from "@zxing/library";

// IMAGENS E ITENS DE INTERAÇÃO
import BarricadeImg from "@/assets/Interaction_01_The Barricade.png";
import ArmorImg from "@/assets/Interaction_03_ShinningArmor.png";
import WeaponsTableImg from "@/assets/Interaction_02_WeaponsTable.png";

import InteractionBarricade from "@/assets/json/InteractionBarricade.json";
import InteractionTheShiningArmor from "@/assets/json/InteractionTheShiningArmor.json";
import InteractionWeaponsTable from "@/assets/json/InteractionWeaponsTable.json";
import InteractionTheStoneGuardian from "@/assets/json/InteractionTheStoneGuardian.json";
import InteractionTheReservoir from "@/assets/json/InteractionTheReservoir.json";
import InteractionTreasuresOfAForgottenAge from "@/assets/json/InteractionTreasuresOfAForgottenAge.json";

// --- NOVAS IMPORTAÇÕES DOS DADOS DO LIVRO ---
import bookPagesData from '@/data/book/bookPages.json';
import rawInteractionConfigsData from '@/data/book/interactionConfigurations.json';
import gameMechanicsData from '@/data/book/gameMechanicsRulebook.json';

// --- INTERFACES ---
interface InteractionItem {
  id: string;
  title: string;
  body: string[];
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
}

interface PageSection {
  section: string;
  content: PageContentItem[];
  layout: string;
  background: string;
}

interface NavigationItem {
  sectionTitle: string;
  title: string;
  sectionIndex: number;
  contentIndex: number;
  id: string;
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

// --- REFS ---
const hideCard = ref(false);
const scanned = ref(false);
const interactions = ref<InteractionItem[]>([]);
const scrollableContentRef = ref<HTMLElement | null>(null);
const activeClickedItemId = ref<string | null>(null);
const openGroups = ref<string[]>([]);
const currentIndex = ref(0);
const currentInteractionConfig = ref<InteractionConfig | null>(null);
const contentWrapper = ref<HTMLElement | null>(null);
const interPage = ref<"scan" | "titles" | "content">("scan");
const codeReader = new BrowserMultiFormatReader();
// **** MODIFIED currentView TYPE ****
const currentView = ref<"player" | "interactions" | "keywords" | "tutorial" | "combatGuide" | "explorationTips" | "charProgression">("player");


// --- PROCESSAMENTO E INICIALIZAÇÃO DOS DADOS JSON ---
const pages = ref<PageSection[]>(bookPagesData as PageSection[]);

const importedImageAssets: Record<string, string> = {
  BarricadeImg,
  ArmorImg,
  WeaponsTableImg,
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
      console.warn(`[BookScript] Imagem de background '${rawConfig.backgroundImportName}' não encontrada para a interação '${key}'. Verifique 'importedImageAssets'.`);
    }
    if (!itemsData) {
      console.warn(`[BookScript] Dados de itens '${rawConfig.itemsImportName}' não encontrados para a interação '${key}'. Verifique 'importedItemAssets'.`);
    }
    configs[key] = {
      title: rawConfig.title,
      subtitle: rawConfig.subtitle,
      background: backgroundImage || '',
      items: itemsData || [],
    };
  }
  interactionConfigs.value = configs;
};
initializeInteractionConfigs();

const gameMechanicsBook = ref<GameMechanicsBook>(gameMechanicsData as GameMechanicsBook);

// --- PROPRIEDADES COMPUTADAS ---
const navigationItems = computed<NavigationItem[]>(() => {
  const items: NavigationItem[] = [];
  pages.value.forEach((section, sectionGlobalIdx) => {
    if (section.content && section.content.length > 0) {
      section.content.forEach((contentItem, contentIdx) => {
        if (contentItem.title) {
          items.push({
            sectionTitle: section.section,
            title: contentItem.title,
            sectionIndex: sectionGlobalIdx,
            contentIndex: contentIdx,
            id: `content-block-${sectionGlobalIdx}-${contentIdx}`
          });
        }
      });
    }
  });
  return items;
});

const groupedNavigationItems = computed(() => {
  const groups: { [key: string]: NavigationItem[] } = {};
  navigationItems.value.forEach(item => {
    if (!groups[item.sectionTitle]) {
      groups[item.sectionTitle] = [];
    }
    groups[item.sectionTitle].push(item);
  });
  return groups;
});

const currentPage = computed(() => {
  if (currentIndex.value < 0 || !pages.value || pages.value.length === 0) {
    return null;
  }
  const clampedIndex = Math.max(0, Math.min(currentIndex.value, pages.value.length - 1));
  return pages.value[clampedIndex] || null;
});

const isFullScreenWithBackground = computed(() => {
  return currentPage.value?.layout === "full-screen" && !!currentPage.value?.background;
});

const backgroundStyle = computed<CSSProperties>(() => {
  if (!currentPage.value) return {};
  const s: CSSProperties = {
    position: "relative",
    color: "#191919",
    borderRadius: "12px",
  };
  if (currentPage.value.background) {
    s.backgroundImage = currentPage.value.background;
    s.backgroundSize = "cover";
    s.backgroundRepeat = "no-repeat";
    s.backgroundPosition = "center center";
  } else {
    s.backgroundColor = "#1c1c1c";
  }
  return s;
});

// --- MÉTODOS ---
const getSectionIcon = (_sectionName: string) => 'mdi-book-open-page-variant';

function startDrag(event: MouseEvent) {
  console.log("startDrag called", event);
}

const navigateToContent = async (sectionGlobalIndex: number, contentBlockId: string, sectionTitle: string) => {
  if (sectionGlobalIndex < 0 || sectionGlobalIndex >= pages.value.length) {
    console.error(`[BookScript] Índice de seção inválido: ${sectionGlobalIndex}. Total de páginas: ${pages.value.length}`);
    return;
  }
  currentView.value = 'player';
  currentIndex.value = sectionGlobalIndex;
  activeClickedItemId.value = contentBlockId;
  openGroups.value = [sectionTitle];
  await nextTick();
  const element = document.getElementById(contentBlockId);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
  } else {
    console.warn(`[BookScript] Elemento com ID ${contentBlockId} não encontrado para scroll.`);
    scrollableContentRef.value?.scrollTo({ top: 0, behavior: 'smooth' });
  }
};

function handlePageClick(event: MouseEvent) {
  const target = event.target as HTMLElement;
  if (target.closest('button, a, .v-card, .v-btn, .header-banner, .v-navigation-drawer, .instruction-card')) {
    return;
  }
}

async function startScanner() {
  try {
    const videoElement = document.getElementById('qr-video') as HTMLVideoElement | null;
    if (!videoElement) {
      console.error("[BookScript] Elemento de vídeo QR não encontrado.");
      return;
    }
    const devices = await codeReader.listVideoInputDevices();
    if (!devices.length) {
      console.error("[BookScript] Nenhuma câmera encontrada.");
      return;
    }
    const deviceId = devices[0].deviceId;
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
        console.log("📱 QR Code normalizado:", normalized);
        const cfg = interactionConfigs.value[normalized];
        if (cfg) {
          currentInteractionConfig.value = cfg;
          interactions.value = cfg.items;
          scanned.value = true;
          interPage.value = "titles";
          codeReader.reset?.();
        } else {
          console.warn("[BookScript] QR Code desconhecido após normalização:", normalized);
        }
      }
      if (err && !(err.name === 'NotFoundException' || err.name === 'FormatException')) {
        // console.error("QR Scan Error:", err);
      }
    });
  } catch (e) {
    console.error("[BookScript] Erro ao iniciar o scanner:", e);
  }
}

function resetScan() {
  interPage.value = "scan";
  scanned.value = false;
  currentInteractionConfig.value = null;
  interactions.value = [];
  if (currentView.value === 'interactions') {
    nextTick(() => {
      codeReader.reset?.();
      startScanner();
    });
  }
}

function showContent(id: string) {
  interPage.value = "content";
  nextTick(() => {
    const el = document.getElementById(id);
    const cWrapper = contentWrapper.value;
    if (el && cWrapper) {
      cWrapper.scrollTo({ top: el.offsetTop - (cWrapper.offsetTop > 20 ? 20 : cWrapper.offsetTop) , behavior: "smooth" });
    } else {
        console.warn(`[BookScript] Elemento de conteúdo '${id}' ou wrapper não encontrado para scroll.`);
    }
  });
}

// **** MODIFIED setView function parameter type ****
function setView(viewName: typeof currentView.value) {
  currentView.value = viewName;
  activeClickedItemId.value = viewName;
}

// --- WATCHERS ---
watch(currentView, (newView, oldView) => {
  // **** MODIFIED currentView watcher ****
  if (['keywords', 'tutorial', 'combatGuide', 'explorationTips', 'charProgression', 'interactions'].includes(newView)) {
    currentIndex.value = -1;
    if (openGroups.value.length > 0) openGroups.value = [];
  }

  if (newView === "interactions") {
    if (oldView !== 'interactions' || !scanned.value) {
      resetScan();
    }
  } else {
    codeReader.reset?.();
    scanned.value = false;
  }
});

// --- LIFECYCLE HOOKS ---
onBeforeUnmount(() => {
  codeReader.reset?.();
  scanned.value = false;
});

</script>

<style scoped>
/* Your existing styles - kept as is from your provided base */
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

.setup-placeholder {
  text-align: center;
  margin-top: 1.5rem;
  margin-bottom: 1.5rem;
  padding: 1rem;
  border: 2px dashed #ccc;
  background-color: #f9f9f9;
  font-size: 1.1em;
  font-style: normal !important;
}

.setup-placeholder strong {
  font-style: normal !important;
}

.book-dialog {
  position: relative;
  width: 1000px;
  box-shadow:
    15px 0 15px -5px rgba(0, 0, 0, 0.3),
    0 10px 20px rgba(0, 0, 0, 0.5),
    inset 5px 0 10px rgba(255, 255, 255, 0.1);
  margin: 5vh auto;
}

.book-page {
  background-color: #ffffff;
  color: #212121;
  border: 1px solid #1e1e1e;
  margin: 20px; /* ma-5 equivalent */
  box-shadow:
    0 0 10px rgba(94, 69, 57, 0.3),
    inset 0 0 20px rgba(94, 69, 57, 0.2);
  border-radius: 12px;
  min-height: calc(90vh - 40px);
}

.header-banner {
  background-image: url('@/assets/booktop.png');
  background-size: cover;
  background-repeat: no-repeat;
  background-position: top center;
  padding: 2px 14px 10px;
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
  padding: 23px 44px 5px;
  margin: 0;
  text-transform: uppercase;
  font-weight: bold;
}

.chapter-title-banner {
  font-family: "Cinzel Decorative", cursive;
  font-size: 1.8rem;
  color: white;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.6);
  margin-top: 5px;
  margin-bottom: 10px;
  padding-left: 44px;
  padding-right: 44px;
  text-align: left;
}

.close-btn {
  background-color: #212121 !important;
  color: #f0e6d2 !important;
  border: 1px solid #1e1e1e;
  border-radius: 50%;
  box-shadow: 1px 1px 3px rgba(0, 0, 0, 0.3);
}
.header-close {
    position: absolute;
    top: 10px;
    right: 10px;
    z-index: 2;
}


.close-btn:hover {
  background-color: #1e1e1e !important;
}

.instruction-card {
  background: #e4e4e4 !important;
  border: 2px solid #212121 !important;
  color: #1a120f !important;
  box-shadow: 3px 3px 0px #212121;
  padding: 16px;
  margin-top: 1rem;
}

.instruction-card ul {
  list-style-position: inside;
  padding-left: 0;
  list-style-type: disc;
}

.instruction-card li {
  margin-bottom: 0.5em;
}

.v-btn {
  font-family: "Uncial Antiqua", cursive !important;
  letter-spacing: 1px;
  border: 1px solid #212121 !important;
}

.nav-drawer {
  background: #1a120f !important;
  border-right: 2px solid #212121 !important;
  z-index: 1001;
  height: 100%;
  transition: width 0.3s ease !important;
}

.nav-drawer :deep(.v-list-item__title) {
  color: #f0e6d2;
  font-size: 0.8rem !important;
  line-height: 1.3 !important;
  white-space: normal !important;
  height: auto !important;
  overflow: visible !important;
  text-overflow: clip !important;
}

.drawer-section-header :deep(.v-list-item__title) {
  font-weight: bold;
  font-size: 0.85rem !important;
  color: #f5e1a9 !important;
}

.drawer-section-header.v-list-item--active-book-index .v-icon {
    color: #FFFFFF !important;
}


.drawer-item-index :deep(.v-list-item__title) {
  font-size: 0.75rem !important;
  font-family: "EB Garamond", serif;
  color: #d4be94 !important;
  margin-left: 8px;
}

.nav-drawer :deep(.v-list-item) {
  height: auto !important;
  min-height: 40px;
  padding-top: 8px !important;
  padding-bottom: 8px !important;
}

.nav-drawer .v-list-subheader {
  color: #e6c68a !important;
  font-size: 0.9rem;
  font-family: "Cinzel Decorative", cursive;
  padding-left: 16px;
  line-height: normal;
  height: auto;
  padding-top: 8px;
  padding-bottom: 8px;
}

.drawer-item-index.v-list-item--active-book-index,
.drawer-section-header.v-list-item--active-book-index {
  background-color: rgba(201, 170, 113, 0.2) !important;
}

.drawer-item-index.v-list-item--active-book-index .v-list-item-title,
.drawer-item-index:hover .v-list-item-title,
.drawer-section-header.v-list-item--active-book-index :deep(.v-list-item__title),
.drawer-section-header:hover :deep(.v-list-item__title) {
  color: #ffffff !important;
  font-weight: bold;
}

.drawer-item-index.v-list-item--active-book-index .numbered-avatar span {
  color: white !important;
}


.drawer-section-header.v-list-item,
.drawer-item-index.v-list-item {
  padding-inline-start: 12px !important;
}

.drawer-section-header.v-list-item .v-list-item__prepend .v-icon {
  margin-inline-end: 16px !important;
}

.drawer-item-index.v-list-item .v-list-item__prepend {
  min-width: 24px !important;
  max-width: 24px !important;
  margin-right: 16px !important;
  display: flex;
  justify-content: center;
  align-items: center;
}

.drawer-item-index .numbered-avatar {
  margin: 0 !important;
  flex-shrink: 0;
  font-weight: bold;
}

.drawer-item-index .numbered-avatar .text-caption {
  font-size: 0.75rem !important;
  line-height: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
}

:deep(.v-navigation-drawer--rail:not(.v-navigation-drawer--is-hovering)) .v-list-item__prepend {
  width: auto !important;
  margin-left: auto !important;
  margin-right: auto !important;
  justify-content: center !important;
}

:deep(.v-navigation-drawer--rail:not(.v-navigation-drawer--is-hovering)) .drawer-section-header.v-list-item .v-list-item__prepend .v-icon {
  margin: 0 !important;
}

:deep(.v-navigation-drawer--rail:not(.v-navigation-drawer--is-hovering)) .drawer-item-index.v-list-item .v-list-item__prepend .numbered-avatar {
  margin: 0 !important;
}

.v-navigation-drawer--rail:not(.v-navigation-drawer--is-hovering) .v-list-item__content {
  display: none !important;
}

.nav-drawer:hover .v-list-item-title {
  opacity: 1;
  margin-left: 0;
  transition:
    opacity 0.3s ease 0.1s,
    margin-left 0.3s ease;
}

.v-navigation-drawer--rail {
  width: 66px !important;
}

.v-navigation-drawer--rail:hover {
  width: 270px !important;
}

.main-content {
  transition: margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
  min-height: 500px;
  height: calc(90vh - 40px);
  display: flex;
  flex-direction: column;
}

.scrollable-content {
  overflow-y: auto;
  flex-grow: 1;
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

.instruction-card {
  margin-left: 16px;
  margin-right: 16px;
  width: calc(100% - 32px);
}

.dialog-title {
    text-align: center;
    width: 100%;
    color: #f0e6d2;
    font-family: "Cinzel Decorative", cursive;
    font-size: 1.5rem;
}
.interaction-header {
    width: 100%;
    color: #f0e6d2;
    padding: 0 10px;
    position: relative;
}
.interaction-main-title {
    font-family: "Cinzel Decorative", cursive;
    font-size: 1.3rem;
    margin-bottom: 8px;
    line-height: 1.2;
    padding-right: 40px;
}
.interaction-subtitle {
    font-family: "EB Garamond", serif;
    font-size: 0.9rem;
    line-height: 1.4;
    opacity: 0.9;
    margin-bottom: 16px;
}
.scan-page {
    flex-grow: 1;
}
.qr-video {
    width: 80%;
    max-width: 300px;
    border: 2px solid #f0e6d2;
    border-radius: 8px;
    background-color: #000;
}
.titles-background {
    flex-grow: 1;
    background-size: cover;
    background-position: center;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
    border-radius: 8px;
    position: relative;
}
.buttons-overlay {
    background-color: rgba(0,0,0,0.6);
    padding: 20px;
    border-radius: 8px;
    width: 100%;
    max-width: 400px;
}
.interaction-btn {
    background-color: #3a2e29 !important;
    color: #f0e6d2 !important;
    border-color: #5c4a42 !important;
    margin-bottom: 8px;
    text-transform: none !important;
    font-family: "EB Garamond", serif !important;
    font-size: 1rem !important;
}
.content-page-interactions {
    flex-grow: 1;
    overflow-y: auto;
    color: #f0e6d2;
}
.content-wrapper-interactions {
    padding: 10px;
}
.chapter-title-interactions {
    font-family: "Cinzel Decorative", cursive;
    font-size: 1.5rem;
    color: #f5e1a9;
}
.body-text-interactions p {
    font-family: "EB Garamond", serif;
    font-size: 1rem;
    line-height: 1.5;
    color: #d4be94;
    margin-bottom: 1em;
}
.back-btn {
    font-family: "Uncial Antiqua", cursive !important;
}

/* STYLES FOR GAME MECHANICS PAGE (BOOK STYLE) - ATUALIZADO COM :deep() */
.body-text-mechanics { /* Regra para o container, não precisa de :deep() aqui */
  /* font-family, color, etc., serão herdados ou definidos especificamente pelos filhos com :deep() */
}

.body-text-mechanics :deep(p) {
  font-family: "EB Garamond", serif;
  font-size: 1rem;
  line-height: 1.6;
  text-indent: 2em;
  margin-bottom: 1em;
  color: #191919 !important;
}

.body-text-mechanics :deep(p:first-of-type) {
  /* text-indent: 0; */ /* Descomente se não quiser indentação no primeiro parágrafo */
}

.body-text-mechanics :deep(ul) {
  list-style: none;
  padding-left: 2.5em;
  margin-top: 0.5em;
  margin-bottom: 1em;
}

.body-text-mechanics :deep(li.custom-bullet) {
  position: relative;
  margin-bottom: 0.5em;
  padding-left: 0px;
  color: #191919 !important;
}

.body-text-mechanics :deep(li.custom-bullet::before) {
  position: absolute;
  left: -1.5em;
  top: 0.1em;
  font-size: 1.2em;
  color: #212121;
}

.body-text-mechanics :deep(li.custom-bullet.filled::before) {
  content: '•';
}

.body-text-mechanics :deep(li.custom-bullet.open::before) {
  content: '○';
}
/* FIM DOS ESTILOS ATUALIZADOS PARA GAME MECHANICS */

.mechanic-title { /* Regra para H3 no template, não precisa de :deep() */
  font-family: "EB Garamond", serif;
  font-size: 1.5rem;
  margin-top: 1.5rem;
  margin-bottom: 0.75rem;
  text-align: left;
  position: relative;
  padding-left: 1.6em;
  text-shadow: 1px 1px 1px rgba(255,255,255,0.7);
}

.mechanic-title::before { /* Regra para H3 no template, não precisa de :deep() */
  content: '->';
  position: absolute;
  left: 0.5em;
  top: 0;
  font-size: 1em;
}


@media (max-width: 960px) {
  .book-dialog {
    width: 90vw !important;
    max-height: 85vh !important;
    margin: 2.5vh auto;
  }

  .main-content, .scrollable-content {
    height: calc(85vh - 40px);
  }
  .book-page {
    min-height: unset;
    height: auto;
    margin: 16px; /* ma-4 */
  }

  .chapter-title-banner {
    font-size: 1.6rem !important;
  }

  .body-text p {
    font-size: 1rem !important;
    line-height: 1.5;
  }
  /* Abaixo, os estilos para .body-text-mechanics já estão com :deep() se necessário para os filhos.
      A classe .pa-4 em .body-text-mechanics é do Vuetify e não precisa de :deep(). */
  .content-block .header-banner,
  .body-text.mt-3,
  .body-text-mechanics.pa-4 {
    padding-left: 12px !important;
    padding-right: 12px !important;
  }
    .body-text-mechanics.pa-4 {
    padding-top: 12px !important;
    padding-bottom: 12px !important;
  }


  .instruction-card {
    margin-left: 12px;
    margin-right: 12px;
    width: calc(100% - 24px);
  }
  .mechanic-title {
    font-size: 1.3rem;
    padding-left: 1.5em;
  }
  .mechanic-title::before {
    left: 0.4em;
  }
}

@media (max-width: 600px) {
  .book-dialog {
    width: 96vw !important;
    max-height: 90vh !important;
    overflow: hidden;
    margin: 2vh auto;
  }

  .main-content, .scrollable-content {
    height: calc(90vh - 70px);
  }

  .d-flex.justify-end {
    position: sticky;
    bottom: 0;
    background: linear-gradient(to bottom, transparent, #f0e6d299 20%, #f0e6d2 60%);
    padding: 16px 0;
    z-index: 100;
  }

  .nav-drawer {
    width: 48px !important;
  }

  .v-navigation-drawer--rail {
    width: 62px !important;
  }

  .nav-drawer:hover,
  .v-navigation-drawer--rail:hover {
    width: 220px !important;
  }

  .header-banner {
    padding-left: 8px;
    padding-right: 8px;
  }
    .header-banner .d-flex {
    cursor: default;
  }


  .section-title {
    font-size: 0.6rem !important;
    padding: 15px 10px 5px 10px !important;
  }

  .chapter-title-banner {
    font-size: 1.4rem !important;
    padding-left: 10px !important;
    padding-right: 10px !important;
    margin-top: 2px;
    margin-bottom: 8px;
  }

  .body-text p {
    font-size: 0.9rem !important;
    text-indent: 1em;
    line-height: 1.4;
  }
  /* Os estilos :deep() para .body-text-mechanics p já cobrem isso */


  .v-btn {
    font-size: 0.8rem !important;
    padding: 8px 10px !important;
    margin: 4px !important;
  }
    .interaction-btn {
    font-size: 0.9rem !important;
  }

  .book-page {
    margin: 10px !important; /* ma-2.5 */
    min-height: unset;
  }

  .content-block .header-banner,
  .body-text.mt-3,
  .body-text-mechanics.pa-4 {
    padding-left: 8px !important;
    padding-right: 8px !important;
  }
  .body-text-mechanics.pa-4 {
    padding-top: 8px !important;
    padding-bottom: 8px !important;
  }


  .instruction-card {
    font-size: 0.85rem !important;
    padding: 12px !important;
    margin-left: 8px;
    margin-right: 8px;
    width: calc(100% - 16px);
  }

  .content-block:not(:last-child) {
    margin-bottom: 16px;
  }

  .mechanic-title {
    font-size: 1.2rem;
    padding-left: 1.4em;
  }
  .mechanic-title::before {
    left: 0.3em;
  }
  /* Os estilos :deep() para .body-text-mechanics ul/li já cobrem isso */

}

@media (max-width: 400px) {
  .d-flex.justify-end {
    flex-direction: column;
    gap: 8px;
  }

  .v-btn {
    width: 100% !important;
    justify-content: center;
  }

  .book-dialog {
    width: 98vw !important;
    max-height: 95vh !important;
    margin: auto;
  }

 .main-content, .scrollable-content {
    height: calc(95vh - 60px);
  }

  .header-banner {
    margin-bottom: 0;
  }

  .section-title {
    padding: 10px 8px 2px 8px !important;
    font-size: 0.55rem !important;
  }

  .chapter-title-banner {
    font-size: 1.3rem !important;
    padding-left: 8px !important;
    padding-right: 8px !important;
    margin-bottom: 5px;
  }
  .mechanic-title {
    font-size: 1.1rem;
    padding-left: 1.3em;
  }
  .mechanic-title::before {
    left: 0.2em;
  }
}
</style>