<template>
  <div class="book-container">
    <v-bottom-sheet v-model="mobileMenuSheet">
      <v-card class="mobile-menu-card">
        <v-toolbar dark color="surface">
          <v-toolbar-title>Library Contents</v-toolbar-title>
          <v-spacer />
          <v-btn icon @click="mobileMenuSheet = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>

        <v-list class="mobile-menu-list" v-model:opened="openGroups">
          <v-list-subheader class="font-weight-bold text-uppercase mt-2">Adventure Story</v-list-subheader>
          <v-list-group
            v-for="(sectionItems, sectionName) in wingGroups"
            :key="String(sectionName)"
            :value="String(sectionName)"
          >
            <template #activator="{ props }">
              <v-list-item
                v-bind="props"
                prepend-icon="mdi-book-open-page-variant"
                :title="String(sectionName)"
                class="mobile-section-header"
              />
            </template>
            <v-list-item
              v-for="(navItem, index) in sectionItems"
              :key="navItem.id"
              @click="handleNavigation(navItem)"
              :active="navItem.id === activeItemId"
              class="mobile-nav-item"
            >
              <template #prepend>
                <v-avatar size="24"><span class="text-caption">{{ index + 1 }}</span></v-avatar>
              </template>
              <v-list-item-title>{{ navItem.title }}</v-list-item-title>
            </v-list-item>
          </v-list-group>

          <v-divider class="my-4"></v-divider>

          <v-list-subheader class="font-weight-bold text-uppercase">Reference Library</v-list-subheader>
          <v-list-group
            v-for="(sectionItems, sectionName) in otherBookGroups"
            :key="String(sectionName)"
            :value="String(sectionName)"
          >
            <template #activator="{ props }">
              <v-list-item
                v-bind="props"
                prepend-icon="mdi-school"
                :title="String(sectionName)"
                class="mobile-section-header"
              />
            </template>
            <v-list-item
              v-for="(navItem, index) in sectionItems"
              :key="navItem.id"
              @click="handleNavigation(navItem)"
              :active="navItem.id === activeItemId"
              class="mobile-nav-item"
            >
              <template #prepend>
                <v-icon size="small" icon="mdi-bookmark" color="grey"></v-icon>
              </template>
              <v-list-item-title>{{ navItem.title }}</v-list-item-title>
            </v-list-item>
          </v-list-group>
        </v-list>
      </v-card>
    </v-bottom-sheet>

    <v-main class="main-content">
      <div class="navigation-container">
        <v-card flat class="navigation-card">
          <v-btn 
            v-if="smAndDown" 
            variant="text" 
            prepend-icon="mdi-format-list-bulleted" 
            @click="mobileMenuSheet = true"
          >
            Library
          </v-btn>
          <div v-else class="text-h6 text-center" style="font-family: 'Cinzel', serif;">
             {{ currentSectionTitle || 'Campaign Library' }}
          </div>
        </v-card>
      </div>

      <div class="scroll-root" ref="scrollableContentRef">
        <v-container fluid class="content-container pa-0">
          <transition name="fade-slide" mode="out-in">
            
            <div v-if="currentView === 'player' && currentPage" :key="'page-'+currentIndex">
              <v-sheet :style="backgroundStyle" class="book-page" elevation="0" rounded>
                <div v-if="isFullScreenWithBackground" class="background-overlay"></div>
                <v-container class="pa-0 pt-2 ml-3">
                  <v-row>
                    <v-col cols="12">
                      <div v-for="(item, idx) in currentPage.content" :key="idx" :id="'content-'+idx" class="content-block">
                        <div class="header-banner" :style="headerBannerStyle">
                          <div class="d-flex align-center justify-space-between pa-0 pb-0">
                            <h4 class="section-title">{{ currentPage.section }}</h4>
                          </div>
                          <h2 v-if="item.title" class="chapter-title-banner">{{ item.title }}</h2>
                        </div>
                        <div class="body-text mt-3 mx-6" v-html="item.body"></div>
                        <v-card v-if="item.instruction" class="instruction-card mt-6 py-0 " flat>
                          <v-card-text v-html="item.instruction" />
                        </v-card>
                        <v-card-text v-if="item.setup" v-html="item.setup" />
                        <div v-if="item.instruction" class="pt-5 px-16"><v-img src="@/assets/Barra.png" /></div>
                      </div>
                    </v-col>
                  </v-row>
                </v-container>
              </v-sheet>
            </div>

            <div v-else-if="currentAuxBook" :key="'aux-'+currentView">
                <v-sheet class="book-page ma-5" style="background-color: #fff; color: #212121; border-radius: 12px;">
                    <v-container class="pa-4">
                        <div v-for="(chapter, cIdx) in currentAuxBook.chapters || [{chapterTitle: currentAuxBook.chapterTitle, sections: currentAuxBook.mechanics}]" :key="cIdx" class="content-block mb-6">
                             <div class="header-banner" :style="headerBannerStyle">
                                <div class="d-flex align-center justify-space-between pa-0 pb-0">
                                    <h4 class="section-title">{{ currentAuxBook.pageTitle }}</h4>
                                </div>
                                <h2 class="chapter-title-banner">{{ chapter.chapterTitle || currentAuxBook.chapterTitle }}</h2>
                             </div>
                             
                             <div class="body-text-mechanics pa-4 mt-3">
                                 <template v-if="chapter.tutorials">
                                     <section v-for="(t, tIdx) in chapter.tutorials" :key="tIdx" :id="'sec-'+cIdx+'-'+tIdx" class="mb-4">
                                         <h3 class="tutorial-section-title">{{ t.title }}</h3>
                                         <div v-html="t.bodyHTML"></div>
                                     </section>
                                 </template>
                                 <template v-else-if="chapter.sections">
                                     <section v-for="(s, sIdx) in chapter.sections" :key="sIdx" :id="'sec-'+cIdx+'-'+sIdx" class="mb-4">
                                         <h3 class="tutorial-section-title">{{ s.title }}</h3>
                                         <div v-html="s.bodyHTML"></div>
                                     </section>
                                 </template>
                                 <template v-else-if="currentAuxBook.mechanics">
                                      <section :id="'sec-'+cIdx" class="mb-4">
                                         <h3 class="mechanic-title">{{ chapter.title }}</h3>
                                         <div v-html="chapter.bodyHTML"></div>
                                     </section>
                                 </template>
                             </div>
                        </div>
                    </v-container>
                </v-sheet>
            </div>

            <div v-else key="empty" class="text-center pa-10 text-grey">
                Select a section from the Library.
            </div>

          </transition>
        </v-container>
      </div>
    </v-main>

    <v-fab v-if="!smAndDown" icon="mdi-format-list-bulleted" @click="mobileMenuSheet = true" location="bottom right" class="mb-4 mr-4" color="primary" app />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick, type CSSProperties, watch } from "vue";
import { useDisplay } from "vuetify";

// IMPORTS DE DADOS
import bookPagesData from "@/data/book/bookPages.json";
import gameMechanicsData from "@/data/book/gameMechanicsRulebook.json";
import playerTutorialsData from "@/data/book/playerTutorials.json";
import firstEncounterClarificationsData from "@/data/book/firstEncounterClarifications.json";
import secondEncounterClarificationsData from "@/data/book/secondEncounterClarifications.json";
import dragonClarificationsData from "@/data/book/dragonClarifications.json";

import booktopImg from "@/assets/booktop.png";
import booktops2Img from "@/assets/booktops2.png";

const { smAndDown } = useDisplay();
const props = defineProps<{ campaignWing?: string }>();

const mobileMenuSheet = ref(false);
const openGroups = ref<string[]>([]);
const currentView = ref('player'); 
const currentIndex = ref(0);
const activeItemId = ref<string | null>(null);
const scrollableContentRef = ref<HTMLElement | null>(null);

const storyPages = ref<any[]>(bookPagesData);
const auxBooks = {
    tutorial: playerTutorialsData,
    mechanics: gameMechanicsData,
    firstEncounter: firstEncounterClarificationsData,
    secondEncounter: secondEncounterClarificationsData,
    dragon: dragonClarificationsData
};

const filteredStoryPages = computed(() => {
    if (!props.campaignWing) return storyPages.value;
    const wingKey = props.campaignWing.toUpperCase().includes("WING 3") ? "WING 3" :
                    props.campaignWing.toUpperCase().includes("WING 4") ? "WING 4" : "";
    if (!wingKey) return storyPages.value;
    return storyPages.value.filter(p => p.section.toUpperCase().includes(wingKey));
});

const wingGroups = computed(() => {
    const groups: Record<string, any[]> = {};
    filteredStoryPages.value.forEach((section, sIdx) => {
        const items: any[] = [];
        section.content.forEach((c: any, cIdx: number) => {
            if(c.title) {
                items.push({ 
                    title: c.title, 
                    id: c.id, 
                    view: 'player', 
                    sIdx: sIdx, 
                    cIdx 
                });
            }
        });
        if(items.length) groups[section.section] = items;
    });
    return groups;
});

const otherBookGroups = computed(() => {
    const groups: Record<string, any[]> = {};
    
    // Tutorial
    const tutItems: any[] = [];
    auxBooks.tutorial.chapters.forEach((ch: any, cIdx: number) => {
        ch.tutorials.forEach((t: any, tIdx: number) => {
            tutItems.push({ title: t.title, id: `tut-${cIdx}-${tIdx}`, view: 'tutorial', targetId: `sec-${cIdx}-${tIdx}` });
        });
    });
    groups[auxBooks.tutorial.pageTitle || 'Tutorials'] = tutItems;

    // Mechanics
    const mechItems: any[] = [];
    auxBooks.mechanics.mechanics.forEach((m: any, mIdx: number) => {
        mechItems.push({ title: m.title, id: `mech-${mIdx}`, view: 'mechanics', targetId: `sec-${mIdx}` });
    });
    groups[auxBooks.mechanics.pageTitle || 'Game Mechanics'] = mechItems;

    // First Encounter
    const e1Items: any[] = [];
    auxBooks.firstEncounter.chapters.forEach((ch: any, cIdx: number) => {
        ch.sections.forEach((s: any, sIdx: number) => {
            e1Items.push({ title: s.title, id: `e1-${cIdx}-${sIdx}`, view: 'firstEncounter', targetId: `sec-${cIdx}-${sIdx}` });
        });
    });
    groups[auxBooks.firstEncounter.pageTitle] = e1Items;

    // Second Encounter
    const e2Items: any[] = [];
    auxBooks.secondEncounter.chapters.forEach((ch: any, cIdx: number) => {
        ch.sections.forEach((s: any, sIdx: number) => {
            e2Items.push({ title: s.title, id: `e2-${cIdx}-${sIdx}`, view: 'secondEncounter', targetId: `sec-${cIdx}-${sIdx}` });
        });
    });
    groups[auxBooks.secondEncounter.pageTitle] = e2Items;

    // Dragon Clarifications
    const dragItems: any[] = [];
    auxBooks.dragon.chapters.forEach((ch: any, cIdx: number) => {
        ch.sections.forEach((s: any, sIdx: number) => {
            dragItems.push({ title: s.title, id: `drag-${cIdx}-${sIdx}`, view: 'dragon', targetId: `sec-${cIdx}-${sIdx}` });
        });
    });
    groups[auxBooks.dragon.pageTitle] = dragItems;

    return groups;
});

const currentPage = computed(() => {
    if (currentView.value !== 'player') return null;
    return filteredStoryPages.value[currentIndex.value];
});

const currentAuxBook = computed(() => {
    if (currentView.value === 'player') return null;
    return (auxBooks as any)[currentView.value];
});

const currentSectionTitle = computed(() => {
    if(currentPage.value) return currentPage.value.section;
    if(currentAuxBook.value) return currentAuxBook.value.pageTitle;
    return '';
});

const backgroundStyle = computed<CSSProperties>(() => {
  if (!currentPage.value) return {};
  const s: CSSProperties = { position: "relative", color: "#191919", borderRadius: "12px" };
  if (currentPage.value.background) {
    s.background = currentPage.value.background;
    s.backgroundSize = "cover";
    s.backgroundRepeat = "no-repeat";
    s.backgroundPosition = "center center";
  } else {
    s.backgroundColor = "#fff";
  }
  return s;
});

const headerBannerStyle = computed(() => {
  let imageUrl = booktopImg;
  const sectionName = currentSectionTitle.value || "";
  if (sectionName.includes("WING 3") || sectionName.includes("WING 4") || currentView.value === 'dragon') {
      imageUrl = booktops2Img;
  }
  return { backgroundImage: `url(${imageUrl})` };
});

const isFullscreen = ref(false); 
const isFullScreenWithBackground = computed(() => currentPage.value?.layout === "full-screen" && !!currentPage.value?.background);

function handleNavigation(item: any) {
    currentView.value = item.view;
    activeItemId.value = item.id;
    mobileMenuSheet.value = false;

    if (item.view === 'player') {
        currentIndex.value = item.sIdx;
    } 
    
    nextTick(() => {
        const container = scrollableContentRef.value;
        if(container) {
            if(item.view === 'player') {
               const el = document.getElementById(`content-${item.cIdx}`);
               if(el) el.scrollIntoView({ behavior: 'smooth' });
               else container.scrollTop = 0;
            } else {
               const el = document.getElementById(item.targetId);
               if(el) el.scrollIntoView({ behavior: 'smooth' });
               else container.scrollTop = 0;
            }
        }
    });
}

const handlePageClick = (e: MouseEvent) => { };
const onScroll = (e: Event) => {};

onMounted(() => {
    const keys = Object.keys(wingGroups.value);
    if(keys.length > 0) {
        const firstGroup = wingGroups.value[keys[0]];
        if(firstGroup.length > 0) {
            handleNavigation(firstGroup[0]);
            openGroups.value = [keys[0]];
        }
    }
});

watch(() => props.campaignWing, () => {
    currentIndex.value = 0;
    const keys = Object.keys(wingGroups.value);
    if(keys.length > 0) {
        const firstGroup = wingGroups.value[keys[0]];
        if(firstGroup.length > 0) {
            handleNavigation(firstGroup[0]);
            openGroups.value = [keys[0]];
        }
    }
    const container = scrollableContentRef.value;
    if(container) container.scrollTop = 0;
});

</script>

<style scoped>
.book-container { height: 100vh; overflow: hidden; background: var(--v-theme-background); display: flex; flex-direction: column; }
.main-content { flex: 1; display: flex; flex-direction: column; overflow: hidden; padding-top: 0 !important; }
.navigation-container { flex-shrink: 0; height: 60px; display: flex; align-items: center; justify-content: center; background: var(--v-theme-surface); box-shadow: 0 2px 4px rgba(0,0,0,0.05); position: sticky; top: 0; z-index: 99; }
.scroll-root { flex: 1; overflow-y: auto; overflow-x: hidden; scroll-behavior: smooth; background: var(--v-theme-background); padding-bottom: 40px; }
.content-container { max-width: 1200px; margin: 0 auto; padding: 16px; min-height: 100%; }
.mobile-menu-card { max-height: 70vh; overflow-y: auto; }
.book-page { background-color: #ffffff; color: #212121; border: 1px solid #1e1e1e; margin: 20px; box-shadow: 0 0 10px rgba(94, 69, 57, 0.3); border-radius: 12px; min-height: 400px; }
.header-banner { background-size: cover; background-repeat: no-repeat; background-position: top center; padding: 0px 0px 1px; position: relative; z-index: 1; color: #212121; border-top-left-radius: 6px; border-top-right-radius: 6px; }
.section-title { font-size: 0.7rem; color: white; padding: 10px 155px 20px; margin: 0; text-transform: uppercase; font-weight: bold; }
.chapter-title-banner { font-family: "Cinzel Decorative", cursive; font-size: 1.8rem; color: white; text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.6); margin-top: 1px; margin-bottom: 66px; padding-left: 156px; padding-right: 44px; text-align: left; }
.content-block { background-color: #fff; border: 1px solid #dedede; border-radius: 6px; padding: 0 0 16px 0; margin-bottom: 24px; }
.body-text :deep(p) { font-family: "EB Garamond", serif; font-size: 1.1rem; line-height: 1.6; text-indent: 2em; color: #191919 !important; margin-bottom: 1.5rem; }
.instruction-card { background: #e4e4e4 !important; border: 2px solid #212121 !important; color: #1a120f !important; margin: 1rem 16px; }
.tutorial-section-title, .mechanic-title { font-family: "EB Garamond", serif; font-size: 1.5rem; margin: 1.5rem 0 0.75rem; text-align: left; color: #191919; font-weight: bold; }
.body-text-mechanics :deep(p) { font-family: "EB Garamond", serif; font-size: 1rem; color: #191919 !important; }
@media (max-width: 768px) { .header-banner { padding: 8px 10px; } .chapter-title-banner { padding-left: 0; margin-left: 130px; } .section-title { padding: 8px 0 15px; margin-left: 130px; } }
</style>