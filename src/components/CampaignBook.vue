<template>
  <div>
    <v-card
      class="book-dialog pa-0"
      @mousedown="startDrag"
    >
      <v-layout>
        <v-navigation-drawer
          expand-on-hover
          rail
          permanent
          width="240"
          class="nav-drawer"
          :floating="false"
          absolute
        >
          <v-list density="compact" nav>
            <v-list-item prepend-icon="mdi-account-group" title="Gamer Player" value="player" class="drawer-item">
              <template v-slot:prepend>
                <v-icon color="#f0e6d2"></v-icon>
              </template>
            </v-list-item>
            <v-list-item prepend-icon="mdi-calendar" title="Events" value="events" class="drawer-item"
              @click="navigateToEvents">
              <template v-slot:prepend>
                <v-icon color="#f0e6d2"></v-icon>
              </template>
            </v-list-item>
            <v-list-item prepend-icon="mdi-bookshelf" title="Library" value="library" class="drawer-item"
              @click="navigateToLibrary">
              <template v-slot:prepend>
                <v-icon color="#f0e6d2"></v-icon>
              </template>
            </v-list-item>
          </v-list>
        </v-navigation-drawer>

        <v-main class="main-content">
          <v-card-text class="pa-0 scrollable-content">
            <v-sheet
              v-if="currentPage"
              :key="currentIndex"
              :style="backgroundStyle as CSSProperties"
              class="book-page"
              elevation="0"
              rounded
              @click="handlePageClick"
            >
              <div v-if="isFullScreenWithBackground" class="background-overlay"></div>
              <v-container class="pa-3 ml-2">
                <v-row>
                  <v-col cols="12">
                    <div class="header-banner">
                      <div class="d-flex align-center justify-space-between pa-0 pb-0" @mousedown.stop="startDrag">
                        <h4 class="section-title">{{ currentPage.section }}</h4>
                        <v-btn icon class="close-btn" @click="hideCard = true">
                          <v-icon>mdi-close</v-icon>
                        </v-btn>
                      </div>
                      <h2 class="chapter-title">{{ currentPage.title }}</h2>
                    </div>

                    <div class="body-text" v-html="currentPage.body"></div>

                    <v-card v-if="currentPage.instruction" class="instruction-card mt-6 py-0" flat>
                      <v-card-text v-html="currentPage.instruction" />
                    </v-card>

                    <div class="d-flex justify-end mt-8">
                      <v-btn color="amber-darken-2" variant="flat" @click.stop="prevPage"
                        :disabled="currentIndex === 0" class="mx-4 px-6 text-white font-weight-bold">
                        ◀ Previous
                      </v-btn>
                      <v-btn color="amber-darken-2" variant="flat" @click.stop="nextPage"
                        :disabled="currentIndex >= pages.length - 1" class="mx-4 px-6 text-white font-weight-bold">
                        Next ▶
                      </v-btn>
                    </div>

                  </v-col>
                </v-row>
              </v-container>
            </v-sheet>
          </v-card-text>
        </v-main>
      </v-layout>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, CSSProperties } from "vue";
import { useRouter } from 'vue-router';

const router = useRouter();

const dialog = ref(false);
const drag = ref(false);
const dragX = ref(20);
const dragY = ref(20);
const startX = ref(0);
const startY = ref(0);

const pages = ref([
  {
    section: "WING 1 - TUTORIAL",
    title: "INTO THE UNDERKEEP (TUTORIAL)",
    body: `
      <p>
      Times are changing...
      </p>

        <p>
      The bravery of adventurers is needed once again. 
      Blackriver, a county of the Kingdom of Elan, has been suffering from macabre events, beginning with the kidnapping of villagers under the cover of night. 
      People are frightened, and monstrous silhouettes wander in the darkness, gnashing teeth and claws.
      </p>

      <p>
       You arrived late, from far away. 
       In the twilight gloom, wherever you look, there is only desolation and bloodstains painting the walls and alleys red. 
       There’s no sign of your contractor. Or of any living soul, really. 
       Those who remain have locked themselves inside their homes, praying for a miracle.
      </p>

      <p>
    There is no mystery here: All tracks lead to the Count’s fortress, and whatever is happening there must be what you were hired to stop. 
    Or rather, to fight.
    The hair on your arms stands on end—it’s unmistakable...  
      </p>
    `,
    instruction: [
      `<div style="color: red; font-weight: bold; text-transform: uppercase; margin-bottom: px;">
        SCENARIO OBJECTIVE – DUNGEON CRAWL'.
      </div>`,
      `<div style="color: #1a120f;">
       To complete this Adventure, you must move through all the rooms, defeating every enemy in your way until you find the Adventure End Trigger.
      </div>`,
      `<div style="color: red; font-weight: bold; text-transform: uppercase; margin-top: 6px;">
        DEFEAT CONDITIONS – STANDARD'.
      </div>`,
      `<div style="color: #1a120f;">
        The Adventure immediately fails if any Hero’s Health Points are reduced to 0. The team cannot continue if even just one Hero is defeated.
      </div>`,
      `<div style="color: red; font-weight: bold; text-transform: uppercase; margin-top: 6px;">
        TUTORIAL – FIRST STEPS'.
      </div>`,
      `<div style="color: #1a120f;">
        Read the Tutorials “Turns and Rounds,” “A Hero’s Turn,” “Move Action,” “Cube Action,” and “Making Attacks”.
      </div>`,
      `<div style="color: red; font-weight: bold; text-transform: uppercase; margin-top: 6px;">
        STARTGAME TRIGGER'.
      </div>`,
      `<div style="color: #1a120f;">
        You may begin to play the Adventure. The Hero with the Defender Dungeon Role starts the game since that is the first card on the Initiative Track. 
        Once their turn ends, move the marker to the next card, the Vampire Monster, and read the Tutorials “The Monsters’ Turn” and “Reactions”.
      </div>`,
    ].join(""),


    layout: "single-column",
    background: "url('/img/bg-apoc.png')",
  },
   {
    section: "WING 1 - ADVANNCED",
    title: "INTO THE UNDERKEEP",
    body: `
      <p>
      Times are changing...
      </p>
        <p>
      The bravery of adventurers is needed once again.
      Blackriver, a county of the Kingdom of Elan, has been suffering from macabre events, beginning with the kidnapping of villagers under the cover of night. 
      People are frightened, and monstrous silhouettes wander in the darkness, gnashing teeth and claws.

      </p>

      <p>
       You arrived late, from far away. 
       In the twilight gloom, wherever you look, there is only desolation and bloodstains painting the walls and alleys red.
       There’s no sign of your contractor. Or of any living soul, really. 
       Those who remain have locked themselves inside their homes, praying for a miracle.
      </p>

      <p>
    There is no mystery here: All tracks lead to the Count’s fortress, and whatever is happening there must be what you were hired to stop. Or rather, to fight.
    The hair on your arms stands on end—it’s unmistakable.. 
      </p>
      
     <div style="color: Black; font-weight: bold; text-transform: uppercase; margin-top: 8px;">
        Blackriver needs your help. First, set up the components as shown below and then read the instructions for this Adventure:'.
      </div
    `,
    instruction: [
  `<div style="color: red; font-weight: bold; text-transform: uppercase; margin-bottom: 4px;">
    SCENARIO OBJECTIVE – DUNGEON CRAWL
  </div>`,
  `<div style="color: #1a120f;">
    To complete this Adventure, you must move through all the rooms defeating every enemy in your way until you find the Adventure End Trigger.
  </div>`,

  `<div style="color: red; font-weight: bold; text-transform: uppercase; margin-top: 12px; margin-bottom: 4px;">
    DEFEAT CONDITIONS – STANDARD
  </div>`,
  `<div style="color: #1a120f;">
    The Adventure immediately fails when one of the following occurs: 1) A Rune cannot be drawn from the bag; 2) any Hero collects their 2nd Trauma Cube; or 3) any Hero acquires their 6th Curse Cube. The team cannot proceed if any Hero is defeated.
  </div>`,

  `<div style="color: red; font-weight: bold; text-transform: uppercase; margin-top: 12px; margin-bottom: 4px;">
    RECOVERY ACTION PENALTY – SINGLE
  </div>`,
  `<div style="color: #1a120f;">
    Whenever Heroes take a Voluntary or Involuntary Recall Action, after completing the Action they are performing and recovering their Cubes, they receive 1 Curse Cube.
  </div>`,

  `<div style="color: red; font-weight: bold; text-transform: uppercase; margin-top: 12px; margin-bottom: 4px;">
    GAME MECHANIC – GROWING DARKNESS
  </div>`,
  `<div style="color: #1a120f;">
    Darkness lurks in the shadows, but it is too weak to manifest. Place the <span style="color: #0066cc;">Growing Darkness</span> Rune card with face A up in the Rune Slot at the bottom end of the Initiative Track.
  </div>`,

  `<div style="color: red; font-weight: bold; text-transform: uppercase; margin-top: 12px; margin-bottom: 4px;">
    GAME MECHANIC – DRUNAGOR NIGHTS
  </div>`,
  `<div style="color: #1a120f;">
    Doors are opened differently in this Adventure: Place the <span style="color: #0066cc;">End of Round</span> Game State Check-Up card in the Rune Slot at the bottom end of the Initiative Track, just below the Rune card, with face A up. It will help you manage this mechanic.
  </div>`,

  `<div style="color: red; font-weight: bold; text-transform: uppercase; margin-top: 12px; margin-bottom: 4px;">
    DUNGEON ACTION – DISTURBED DARKNESS
  </div>`,
  `<div style="color: #1a120f;">
    The hold of Darkness is strong here: Draw 24 Runes and place them on the Initiative Track. 12 remain in the bag, enough for 9 complete rounds before a Rune will fail to be drawn.
  </div>`,

  `<div style="color: red; font-weight: bold; text-transform: uppercase; margin-top: 12px; margin-bottom: 4px;">
    STARTGAME TRIGGER
  </div>`,
  `<div style="color: #1a120f;">
    With the Setup prepared and all these instructions read, you may begin playing the Adventure.
  </div>`
].join(""),




    layout: "single-column",
    background: "url('/img/bg-apoc.png')",
  }
]);

const navigateToLibrary = () => {
  router.push('/library');
};

const navigateToEvents = () => {
  router.push('/events');
};

const startDrag = (e: MouseEvent) => {
  drag.value = true;
  startX.value = e.clientX - dragX.value;
  startY.value = e.clientY - dragY.value;
  document.addEventListener("mousemove", onDrag);
  document.addEventListener("mouseup", stopDrag);
};

const onDrag = (e: MouseEvent) => {
  if (!drag.value) return;
  dragX.value = e.clientX - startX.value;
  dragY.value = e.clientY - startY.value;
};

const stopDrag = () => {
  drag.value = false;
  document.removeEventListener("mousemove", onDrag);
  document.removeEventListener("mouseup", stopDrag);
};

const currentIndex = ref(0);
const currentPage = computed(() => pages.value[currentIndex.value]);

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
    s.backgroundImage = currentPage.value.background;
    s.backgroundSize = "cover";
    s.backgroundRepeat = "no-repeat";
    s.backgroundPosition = "center center";
  } else {
    s.backgroundColor = "#1c1c1c";
  }
  return s;
});

function handlePageClick(event: MouseEvent) {
  const width = (event.currentTarget as HTMLElement).offsetWidth;
  const clickX = event.offsetX;

  if (clickX < width * 0.33 && currentIndex.value > 0) {
    prevPage();
  } else if (
    clickX > width * 0.66 &&
    currentIndex.value < pages.value.length - 1
  ) {
    nextPage();
  }
}

function nextPage() {
  if (currentIndex.value < pages.value.length - 1) currentIndex.value++;
}

function prevPage() {
  if (currentIndex.value > 0) currentIndex.value--;
}
</script>

<style scoped>
.book-dialog {
  width: 1000px;
  box-shadow:
    15px 0 15px -5px rgba(0, 0, 0, 0.3),
    0 10px 20px rgba(0, 0, 0, 0.5),
    inset 5px 0 10px rgba(255, 255, 255, 0.1);
}

.book-container {
  display: flex;
  height: 100%;
}

.book-content {
  flex: 1;
  overflow-y: auto;
  padding-left: 16px;
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
  margin: 20px;
  min-height: calc(90vh - 40px);
  overflow-y: auto !important;
}

.header-banner {
  background-image: url('@/assets/booktop.png');
  background-size: cover;
  background-repeat: no-repeat;
  background-position: top center;
  padding: 2px 14px 18px; /* topo, laterais, fundo */
  margin-bottom: 24px;
  position: relative;
  z-index: 1;
  color: #212121;
}

.section-title {
  font-size: 0.7rem;
  color: white;
  padding: 23px 44px 48px; /* topo, laterais, fundo */
  margin: 0;
  text-transform: uppercase;
  font-weight: bold;
}

.chapter-title {
  font-family: "Cinzel Decorative", cursive;
  font-size: 1.8rem;
  color: white;
  margin: 0;
  text-shadow: 2px 2px 3px rgba(94, 69, 57, 0.2);
}

.body-text p {
  font-family: "EB Garamond", serif;
  font-size: 1.1rem;
  line-height: 1.6;
  text-indent: 2em;
  color: #191919 !important;
  margin-bottom: 1.5rem;
}

.close-btn {
  background-color: #212121 !important;
  color: #f0e6d2 !important;
  border: 1px solid #1e1e1e;
  border-radius: 50%;
  box-shadow: 1px 1px 3px rgba(0, 0, 0, 0.3);
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
}

.instruction-highlight {
  color: red !important;
  font-weight: bold !important;
  text-transform: uppercase !important;
  display: block;
  margin-bottom: 8px;
}

.instruction-default {
  color: #1a120f !important;
  display: block;
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
  position: absolute !important;
  transition: width 0.3s ease !important;
}

/* Ícones sempre visíveis */
.v-list-item__prepend {
  opacity: 1 !important;
  margin-right: 12px !important;
}

/* Títulos apenas quando expandido */
.v-list-item-title {
  opacity: 0;
  transition: opacity 0.2s ease;
  margin-left: 0px;
}

.nav-drawer:hover .v-list-item-title {
  opacity: 1;
  margin-left: 0;
  transition:
    opacity 0.3s ease 0.1s,
    margin-left 0.3s ease;
}

.v-navigation-drawer--rail {
  width: 56px !important;
}

.v-navigation-drawer--rail:hover {
  width: 240px !important;
}

.main-content {
  transition: margin 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.nav-drawer:hover~.main-content {
  margin-left: 240px;
}

.v-list-item__prepend {
  margin-right: 12px !important;
}

.v-list-item__title {
  white-space: nowrap;
  margin-left: 8px;
}

.scrollable-content {
  overflow-y: auto;
  max-height: 70vh;
}

@media (max-width: 960px) {
  .book-dialog {
    width: 90vw !important;
    max-height: 80vh !important;
  }

  .chapter-title {
    font-size: 1.8rem !important;
  }

  .body-text p {
    font-size: 1rem !important;
    line-height: 1.5;
  }
}

/* Mobile Styles */
@media (max-width: 600px) {
  .book-dialog {
    width: 96vw !important;
    max-height: 70vh !important;
  }

  .d-flex.justify-end {
    position: sticky;
    bottom: 0;
    background: linear-gradient(to bottom, transparent, #f0e6d2 30%);
    padding: 16px 0;
    z-index: 100;
  }

  .scrollable-content {
    overflow-y: auto;
    max-height: 70vh;
  }

  .nav-drawer {
    width: 48px !important;
  }

  .nav-drawer:hover {
    width: 180px !important;
  }

  .v-navigation-drawer--rail {
    width: 48px !important;
  }

  .main-content.mobile-padding {
    padding: 0 8px !important;
  }

  .section-title {
    font-size: 1rem !important;
    letter-spacing: 1px;
  }

  .chapter-title {
    font-size: 1.5rem !important;
    margin: 10px 0 !important;
  }

  .body-text p {
    font-size: 0.9rem !important;
    text-indent: 1em;
    line-height: 1.4;
  }

  .v-btn {
    font-size: 0.8rem !important;
    padding: 8px 12px !important;
    margin: 4px !important;
    width: auto !important;
  }

  .book-page {
    margin: 10px !important;
  }

  .instruction-box {
    font-size: 0.85rem !important;
    padding: 12px !important;
  }
}

/* Small Mobile */
@media (max-width: 400px) {
  .d-flex.justify-end {
    flex-direction: column;
    gap: 8px;
  }

  .v-btn {
    width: 100%;
    justify-content: center;
  }

  .book-dialog {
    width: 80vw !important;
    max-height: 70vh !important;
  }
}
</style>
