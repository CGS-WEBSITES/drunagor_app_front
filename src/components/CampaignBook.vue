<template>
  <div>
    <v-btn
      color="brown darken-3"
      class="text-white rounded-xl text-uppercase font-weight-bold"
      @click="dialog = true"
      prepend-icon="mdi-book-open-page-variant"
    >
      Open Campaign Book
    </v-btn>

    <v-dialog
      v-model="dialog"
      max-width="800px"
      :scrim="false"
      persistent
      hide-overlay
      no-click-animation
      :retain-focus="false"
      content-class="transparent-dialog"
      :style="{
        position: 'fixed',
        transform: `translate(\${dragX}px, \${dragY}px)`,
        transition: 'transform 0.1s',
        zIndex: 1000,
      }"
    >
      <v-card class="book-dialog" elevation="10" @mousedown="startDrag">
        <v-layout>
          <v-navigation-drawer
            expand-on-hover
            rail
            permanent
            width="240"
            class="nav-drawer"
            absolute
          >
            <v-list density="compact" nav v-model="currentView">
              <v-list-item
                prepend-icon="mdi-book-open-page-variant"
                class="drawer-item"
                @click="currentView = 'player'"
                :class="{ 'drawer-item--active': currentView === 'player' }"
              >
                <template #prepend>
                  <v-icon color="#f0e6d2" />
                </template>
                <v-list-item-title>Book Player</v-list-item-title>
              </v-list-item>
              <v-list-item
                prepend-icon="mdi-hand-pointing"
                class="drawer-item"
                @click="currentView = 'interactions'"
                :class="{ 'drawer-item--active': currentView === 'interactions' }"
              >
                <template #prepend>
                  <v-icon color="#f0e6d2" />
                </template>
                <v-list-item-title>Book Interactions</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-navigation-drawer>

          <v-main class="main-content">
            <v-card-text class="pa-0 scrollable-content">
              <!-- Book Player -->
              <div v-if="currentView === 'player'">
                <v-sheet
                  v-if="currentPage"
                  :key="currentIndex"
                  :style="backgroundStyle as CSSProperties"
                  class="book-page"
                  elevation="0"
                  rounded
                  @click="handlePageClick"
                >
                  <div
                    v-if="isFullScreenWithBackground"
                    class="background-overlay"
                  ></div>
                  <v-container class="pa-6">
                    <v-row>
                      <v-col cols="12">
                        <div
                          class="d-flex align-center justify-space-between pa-6 pb-0"
                          @mousedown.stop="startDrag"
                        >
                          <h4 class="section-title">
                            {{ currentPage.section }}
                          </h4>
                          <v-btn icon @click="dialog = false" class="close-btn">
                            <v-icon>mdi-close</v-icon>
                          </v-btn>
                        </div>
                        <h2 class="chapter-title">{{ currentPage.title }}</h2>
                        <div class="body-text" v-html="currentPage.body"></div>

                        <v-alert
                          v-if="currentPage.instruction"
                          type="info"
                          border="start"
                          elevation="2"
                          class="mt-6 instruction-box"
                        >
                          <strong>📜 Instruction:</strong><br />
                          {{ currentPage.instruction }}
                        </v-alert>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-sheet>

                <div class="d-flex justify-end mt-8">
                  <v-btn
                    color="amber-darken-2"
                    variant="flat"
                    @click.stop="prevPage"
                    :disabled="currentIndex === 0"
                    class="mx-4 px-6 text-white font-weight-bold"
                  >
                    ◀ Previous
                  </v-btn>
                  <v-btn
                    color="amber-darken-2"
                    variant="flat"
                    @click.stop="nextPage"
                    :disabled="currentIndex >= pages.length - 1"
                    class="mx-4 px-6 text-white font-weight-bold"
                  >
                    Next ▶
                  </v-btn>
                </div>
              </div>

              <!-- Book Interactions (inline, sem diálogo extra) -->
              <div v-else-if="currentView === 'interactions'">
                <v-container
                  class="py-2 px-4"
                  style="flex: 1; display: flex; flex-direction: column"
                >
                  <!-- Header -->
                  <v-row
                    class="d-flex align-center justify-space-between mb-2 mt-2"
                    style="flex-shrink: 0"
                  >
                    <template v-if="interPage === 'scan' && !scanned">
                      <h3 class="dialog-title">Scan QR Code</h3>
                      <v-btn icon @click="dialog = false" class="close-btn">
                        <v-icon>mdi-close</v-icon>
                      </v-btn>
                    </template>
                    <template v-else-if="interPage === 'titles'">
                      <h3 class="dialog-title">Interactions</h3>
                      <v-btn icon @click="dialog = false" class="close-btn">
                        <v-icon>mdi-close</v-icon>
                      </v-btn>
                    </template>
                    <template v-else>
                      <v-btn
                        class="back-btn text-white mt-4"
                        color="grey darken-2"
                        @click="interPage = 'titles'"
                      >
                        <v-icon left>mdi-arrow-left</v-icon>
                        Back to Options
                      </v-btn>
                      <v-btn icon @click="dialog = false" class="close-btn">
                        <v-icon>mdi-close</v-icon>
                      </v-btn>
                    </template>
                  </v-row>

                  <!-- QR Scanner -->
                  <div
                    v-if="interPage === 'scan' && !scanned"
                    class="scan-page d-flex flex-column align-center justify-center"
                  >
                    <video
                      id="qr-video"
                      class="qr-video mb-4"
                      autoplay
                      muted
                      playsinline
                    ></video>
                    <p class="mt-4 text-white">
                      Aponte a câmera para o QR Code
                    </p>
                  </div>

                  <!-- Titles -->
                  <div v-else-if="interPage === 'titles'" class="title-page-interactions">
                    <v-row class="mt-2">
                      <v-col
                        v-for="(interaction, idx) in interactions"
                        :key="idx"
                        cols="12"
                        class="text-center py-3"
                      >
                        <v-btn
                          color="amber-darken-3"
                          class="text-white font-weight-bold px-8 interaction-btn"
                          block
                          @click="showContent(interaction.id)"
                        >
                          {{ interaction.title }}
                        </v-btn>
                      </v-col>
                    </v-row>
                  </div>

                  <!-- Content -->
                  <div v-else class="content-page-interactions">
                    <div class="content-wrapper-interactions">
                      <div
                        v-for="(interaction, idx) in interactions"
                        :key="idx"
                        :id="interaction.id"
                        class="interaction-detail pa-4"
                      >
                        <h2 class="chapter-title-interactions mb-4">
                          {{ interaction.title }}
                        </h2>
                        <div class="body-text-interactions">
                          <p
                            v-for="(p, i) in interaction.body"
                            :key="i"
                            v-html="p"
                          ></p>
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
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import {
  ref,
  computed,
  CSSProperties,
  nextTick,
  watch,
  onBeforeUnmount,
} from "vue";
import { BrowserMultiFormatReader, NotFoundException } from "@zxing/library";

// diálogo e arrastar
const dialog = ref(false);
const drag = ref(false);
const dragX = ref(20);
const dragY = ref(20);
const startX = ref(0);
const startY = ref(0);
const currentView = ref<"player" | "interactions">("player");

// Book Player state
const pages = ref([
  {
    section: "CHAPTER INTRO",
    title: "A Cry for Help",
    body: `
      <p>
        A desperate, piercing scream rips through the silence of the night, jolting you awake.
        Rain taps gently on the wooden shutters, and the embers in the hearth glow faintly as you rise from a restless sleep.
        The cry echoes again, now distant but unmistakable — a cry for help.
      </p>
      <p>
        Without hesitation, you grab your cloak and weapon, instincts taking over.
        You exit the safety of the parish house into the damp darkness beyond, guided only by moonlight and the pull of duty.
        Your boots sink slightly into the wet forest floor as you tread deeper into the unknown.
      </p>
      <p>
        A sense of urgency quickens your pace, though you know not what awaits.
        Tales of revenants and cursed woods linger in your mind, but still, you press forward.
        Tonight, something calls to you from within the trees, and whether it is fate, madness, or providence — you intend to answer.
      </p>
    `,
    instruction:
      "Mark this chapter as 'Discovered'. All players must draw 1 Fate card.",
    layout: "single-column",
    background: "url('/img/bg-apoc.png')",
  },
  {
    section: "ADVENTURE CONTINUES",
    title: "Into the Unknown",
    body: `
      <p>
        As you push through the brush, the woods grow unnaturally silent. The fog thickens, wrapping around your limbs like a living thing.
        Shadows move at the edges of your vision, but when you turn, nothing is there. Your breath becomes visible in the air, though the night isn't cold.
      </p>
      <p>
        Then you see it — a faint blue glow hovering above the forest path. You step closer, and it takes shape: a wisp, beckoning you forward.
        You follow. Not because you trust it, but because you must know.
      </p>
      <p>
        The path twists unnaturally, looping in on itself. Trees seem to shift when you glance away. Time dilates.
        You find a tattered journal on a broken stone altar, its pages torn, the ink smeared but still legible:
        <em>"The darkness watches... it learns."</em>
      </p>
    `,
    instruction:
      "All heroes must test Wits (difficulty 3). If failed, place 1 Curse Cube.",
    layout: "full-screen",
    background: "url('/img/bg2.png')",
  },
]);

const currentIndex = ref(0);
const currentPage = computed(() => pages.value[currentIndex.value]);
const isFullScreenWithBackground = computed(() => {
  return (
    currentPage.value.layout === "full-screen" && !!currentPage.value.background
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
function handlePageClick(e: MouseEvent) {
  const w = (e.currentTarget as HTMLElement).offsetWidth;
  const x = e.offsetX;
  if (x < w * 0.33) prevPage();
  else if (x > w * 0.66) nextPage();
}
function nextPage() {
  if (currentIndex.value < pages.value.length - 1) currentIndex.value++;
}
function prevPage() {
  if (currentIndex.value > 0) currentIndex.value--;
}

// Dragging
function startDrag(e: MouseEvent) {
  drag.value = true;
  startX.value = e.clientX - dragX.value;
  startY.value = e.clientY - dragY.value;
  document.addEventListener("mousemove", onDrag);
  document.addEventListener("mouseup", stopDrag);
}
function onDrag(e: MouseEvent) {
  if (!drag.value) return;
  dragX.value = e.clientX - startX.value;
  dragY.value = e.clientY - startY.value;
}
function stopDrag() {
  drag.value = false;
  document.removeEventListener("mousemove", onDrag);
  document.removeEventListener("mouseup", stopDrag);
}

// Book Interactions state
const interPage = ref<"scan" | "titles" | "content">("scan");
const scanned = ref(false);
const interactions = ref<any[]>([]);
const codeReader = new BrowserMultiFormatReader();

async function fetchInteractions(endpoint: string) {
  // aqui você pode substituir por fetch real:
  // const res = await fetch(endpoint);
  // return await res.json();
  return [
    {
      id: "interaction-01",
      title: "#01: Talk to the girl",
      body: [
        "Seeing that the girl is terrified...",
        "Você e o grupo devem escolher...",
      ],
    },
    {
      id: "interaction-02",
      title: "#02: Try to calm the lady down",
      body: [
        "Realizing that the older woman is too scared...",
        "Você e o grupo devem escolher...",
      ],
    },
    {
      id: "interaction-03",
      title: "#03: Step away and leave them alone",
      body: [
        "Keeping her weapon pointed to you...",
        "O líder de grupo escreve...",
      ],
    },
    {
      id: "interaction-04",
      title: "#04: Pry the gems out",
      body: [
        "Impressed by their beauty...",
        "FAILURE: The tools scratch...",
        "SUCCESS: With the skill...",
      ],
    },
  ];
}

async function startScanner() {
  try {
    const devices = await codeReader.listVideoInputDevices();
    if (!devices.length) throw new Error("Nenhuma câmera encontrada");
    const deviceId = devices[0].deviceId;
    codeReader.decodeFromVideoDevice(
      deviceId,
      "qr-video",
      async (result, err) => {
        if (result) {
          scanned.value = true;
          codeReader.reset();
          interactions.value = await fetchInteractions(result.getText());
          interPage.value = "titles";
        } else if (err && !(err instanceof NotFoundException)) {
          console.error(err);
        }
      }
    );
  } catch (e) {
    console.error(e);
  }
}

function showContent(id: string) {
  interPage.value = "content";
  nextTick(() => {
    setTimeout(() => {
      const el = document.getElementById(id),
        container = document.querySelector(".content-wrapper-interactions");
      if (el && container) {
        const top =
          el.offsetTop - (container as HTMLElement).getBoundingClientRect().top;
        (container as HTMLElement).scrollTo({
          top: top - 20,
          behavior: "smooth",
        });
      }
    }, 100); 
  });
}

// start/stop scanner when view toggles
watch(currentView, (val) => {
  if (val === "interactions") {
    interPage.value = "scan";
    startScanner();
  } else {
    codeReader.reset();
    scanned.value = false;
  }
});

watch(dialog, (open) => {
  if (open) {
    currentView.value = 'player';

    interPage.value = 'scan';
    codeReader.reset();
    scanned.value = false;
  }
})

onBeforeUnmount(() => {
  codeReader.reset();
});
</script>

<style scoped>
.drawer-item--active {
  background-color: rgba(255, 193, 7, 0.2) !important;
}

.book-dialog {
  max-height: 70vh;
  width: 800px;
  overflow-y: auto !important;
  border-radius: 4px 16px 16px 4px;
  background: #212121;
  position: relative;
  border: 2px solid #1e1e1e;
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
  background-image: url("data:image/png;base64,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");
  background-color: #f0e6d2;
  color: #212121;
  border: 1px solid #1e1e1e;
  margin: 20px;
  box-shadow:
    0 0 10px rgba(94, 69, 57, 0.3),
    inset 0 0 20px rgba(94, 69, 57, 0.2);
  border-radius: 12px;
  margin: 20px;
  min-height: calc(50vh - 40px);
  overflow-y: auto !important;
}

.section-title {
  font-family: "Uncial Antiqua", cursive;
  color: #212121;
  font-size: 1.2rem;
  text-shadow: 1px 1px 1px rgba(255, 255, 255, 0.5);
  letter-spacing: 3px;
  border-bottom: 2px solid #1e1e1e;
  display: inline-block;
  padding: 0 15px 5px 0;
}

.chapter-title {
  font-family: "Cinzel Decorative", cursive;
  color: #212121;
  font-size: 2rem;
  margin: 15px 0;
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

.instruction-box {
  background: #f0e6d2 !important;
  border: 2px solid #212121 !important;
  color: #1a120f !important;
  box-shadow: 3px 3px 0px #212121;
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

.nav-drawer:hover ~ .main-content {
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

.scan-page {
  flex: 1;
  text-align: center;
  padding-top: 32px;
}

.qr-video {
  width: 100%;
  max-width: 300px;
  border: 2px solid #fff;
  border-radius: 8px;
  background: #000;
}

.title-page-interactions {
  height: calc(65vh - 120px);
  padding: 40px 8px 16px;
  overflow-y: auto;
}

.content-page-interactions {
  height: calc(65vh - 80px);
  display: flex;
  flex-direction: column;
  padding-top: 30px;
  overflow: hidden;
}

.content-wrapper-interactions {
  height: 100%;
  overflow-y: auto;
  padding-right: 8px;
  transform: translateZ(0);
  scroll-snap-type: y proximity;
}

.interaction-detail {
  background: rgba(0, 0, 0, 0.3);
  border-radius: 8px;
  margin: 20px 0 40px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  scroll-snap-align: start;
}

.v-btn.interaction-btn {
  padding: 20px 24px !important;
  letter-spacing: 1.5px !important;
  transition: all 0.3s ease;
  border: 1px solid rgba(0, 0, 0, 0.2) !important;
  margin: 8px 0;
}
.v-btn.interaction-btn:hover {
  transform: scale(1.02);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
}

.chapter-title-interactions {
  font-family: "Cinzel Decorative", serif;
  font-size: 1.4rem;
  color: #fff8e1;
  text-align: center;
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.5);
  padding-bottom: 12px;
  border-bottom: 2px solid rgba(255, 255, 255, 0.1);
}

.body-text-interactions p {
  font-family: "EB Garamond", serif;
  font-size: 1rem;
  line-height: 1.6;
  color: #f0e6d2;
  margin-bottom: 1.5em;
  padding: 0 12px;
  text-indent: 2em;
}

.back-btn {
  align-self: flex-start;
  margin-left: 24px !important;
  margin-bottom: 12px;
  transition: all 0.3s ease;
}
.back-btn:hover {
  transform: translateX(-4px);
}

.dialog-title {
  font-family: "Uncial Antiqua", cursive;
  font-size: 1.3rem;
  color: #f0e6d2;
  margin: 0;
  padding-left: 15px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
}

@media (max-width: 600px) {
  .book-dialog {
    width: 90vw;
    max-height: 80vh;
  }
  .title-page-interactions {
    height: calc(80vh - 100px);
    padding-top: 30px;
  }
  .content-page-interactions {
    height: calc(80vh - 60px);
    padding-top: 20px;
  }
  .dialog-title {
    font-size: 1.1rem;
    padding-top: 10px;
  }
  .chapter-title-interactions {
    font-size: 1.2rem;
  }
  .body-text-interactions p {
    font-size: 0.95rem;
  }
}

::-webkit-scrollbar {
  width: 8px;
}
::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.2);
  border-radius: 4px;
}
::-webkit-scrollbar-thumb {
  background: #5d4037;
  border-radius: 4px;
  border: 1px solid rgba(255, 255, 255, 0.1);
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
    width: 80vw !important;
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