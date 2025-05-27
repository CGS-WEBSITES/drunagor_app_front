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
        transform: `translate(${dragX}px, ${dragY}px)`,
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
            <v-list density="compact" nav>
              <v-list-item
                class="drawer-item"
                @click="currentView = 'player'"
                :class="{ 'drawer-item--active': currentView === 'player' }"
              >
                <template #prepend>
                  <v-icon color="#f0e6d2">mdi-book-open-page-variant</v-icon>
                </template>
                <v-list-item-title>Book Player</v-list-item-title>
              </v-list-item>
              <v-list-item
                class="drawer-item"
                @click="currentView = 'interactions'"
                :class="{
                  'drawer-item--active': currentView === 'interactions',
                }"
              >
                <template #prepend>
                  <v-icon color="#f0e6d2">mdi-hand-pointing</v-icon>
                </template>
                <v-list-item-title>Book Interactions</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-navigation-drawer>

          <v-main class="main-content">
            <v-card-text class="pa-0 scrollable-content">
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

                <div class="d-flex justify-end">
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

              <div v-else-if="currentView === 'interactions'">
                <v-container
                  class="py-2 px-4"
                  style="flex: 1; display: flex; flex-direction: column"
                >
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
                      <div class="interaction-header">
                        <h2 class="interaction-main-title">
                          {{ currentInteractionConfig?.title }}
                        </h2>
                        <p class="interaction-subtitle">
                          {{ currentInteractionConfig?.subtitle }}
                        </p>
                        <v-btn
                          icon
                          @click="dialog = false"
                          class="close-btn header-close"
                        >
                          <v-icon>mdi-close</v-icon>
                        </v-btn>
                      </div>
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

                  <div
                    v-else-if="interPage === 'titles'"
                    class="titles-background"
                    :style="{
                      backgroundImage: `url(${currentInteractionConfig?.background})`,
                    }"
                  >
                    <div class="buttons-overlay">
                      <v-row dense>
                        <v-col
                          v-for="item in interactions"
                          :key="item.id"
                          cols="12"
                          class="py-1"
                        >
                          <v-btn
                            class="interaction-btn"
                            block
                            @click="showContent(item.id)"
                          >
                            {{ item.title }}
                          </v-btn>
                        </v-col>
                      </v-row>
                    </div>
                  </div>

                  <div v-else class="content-page-interactions">
                    <div
                      class="content-wrapper-interactions"
                      ref="contentWrapper"
                    >
                      <div
                        v-for="item in interactions"
                        :key="item.id"
                        :id="item.id"
                        class="interaction-detail pa-4"
                      >
                        <h2 class="chapter-title-interactions mb-4">
                          {{ item.title }}
                        </h2>
                        <div class="body-text-interactions">
                          <p
                            v-for="(p, i) in item.body"
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
  nextTick,
  watch,
  onBeforeUnmount,
  CSSProperties,
} from "vue";
import { BrowserMultiFormatReader } from "@zxing/library";
import BarricadeImg from "@/assets/Interaction_01_The Barricade.png";
import ArmorImg from "@/assets/Interaction_03_ShinningArmor.png";
import WeaponsTableImg from "@/assets/Interaction_02_WeaponsTable.png";
import Player from "@/assets/json/Player.json";
import InteractionBarricade from "@/assets/json/InteractionBarricade.json";
import InteractionTheShiningArmor from "@/assets/json/InteractionTheShiningArmor.json";
import InteractionWeaponsTable from "@/assets/json/InteractionWeaponsTable.json";
import InteractionTheStoneGuardian from "@/assets/json/InteractionTheStoneGuardian.json";
import InteractionTheReservoir from "@/assets/json/InteractionTheReservoir.json";
import InteractionTreasuresOfAForgottenAge from "@/assets/json/InteractionTreasuresOfAForgottenAge.json";

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

const interactionConfigs: Record<string, InteractionConfig> = {
  "https://qr1.be/FNMI": {
    title: `INTERACTION – THE VILLAGERS’ BARRICADE`,
    subtitle:
      `Wary of the fortress, the villagers improvised barricades using old planks, broken furniture, and any junk they could get their hands on to stop the night raids. ` +
      `But the structure is unstable, and pushing it to the other side may be the safest thing for you to do, but the sounds of battle and indistinguishable screams that echo from the other side reveal that you are not alone…`,
    background: BarricadeImg,
    items: InteractionBarricade,
  },
  "https://qr1.be/Y4ZP": {
    title: `INTERACTION – THE SHINING ARMOR`,
    subtitle:
      `An impressive suit of armor is displayed as a trophy. The golden carvings that delicately adorn the mirrored silver surface leave no doubt: ` +
      `if this work of art was not forged by the Elves of Valarai, at least it was designed by one. Such a piece can only belong to the Earl ` +
      `and should not be here, but on his chest. A displacement that comes in handy for you.`,
    background: ArmorImg,
    items: InteractionTheShiningArmor,
  },
  "https://qr1.be/0RLM": {
    title: `INTERACTION – THE WEAPONS TABLE`,
    subtitle:
      `Equipment of all kinds lies scattered across the table. Apparently, Blackriver didn't go down without a fight.` +
      `He just didn't have enough time to prepare the soldiers for the Earl's service. However, ` +
      `even if they were unable to resist the incursion, their efforts may not have been in vain: ` +
      `the weapons they gathered may yet serve other warriors in this battle…`,
    background: WeaponsTableImg,
    items: InteractionWeaponsTable,
  },
  "https://qr1.be/0RL": {
    title: `INTERACTION – THE RESERVOIR`,
    subtitle:
      `Against all odds, there is a subterranean reservoir beneath Blackriver’s fortress.` +
      `Did the population know about these dungeons? Did the Count? The purpose of this dam is unclear, ` +
      `but the ropes coming out of the stone and wrapping around a wheel-like mechanism clearly indicate that it controls the water level.`,
    background: WeaponsTableImg,
    items: InteractionWeaponsTable,
  },
  "https://qr1.be/0R": {
    title: `INTERACTION – TREASURES OF A FORGOTTEN AGE`,
    subtitle:
      `Weapons that seem to have been crafted by the most skilled hands you’ve ever seen` +
      `armor made from materials that don’t even seem of this world, and wooden pieces carved by hand—Treasures as valuable as castles are lost in time` +
      `hidden in darkness. Does the Count even know that his fortress sits atop a trove like this?`,
    background: WeaponsTableImg,
    items: InteractionWeaponsTable,
  },
  "https://qr1.be/0": {
    title: `INTERACTION – THE STONE GUARDIAN`,
    subtitle:
      `The hall is empty, save for a gargoyle with two large, gleaming rubies for eyes, perched atop a stone column` +
      `Two torches light the statue with mysterious blue flames` +
      `These details, however, are not the strangest things you find: a skull-shaped handle juts from the stone, ` +
      `and the monster holds a scroll in its mouth.`,
    background: WeaponsTableImg,
    items: InteractionWeaponsTable,
  }
};

const dialog = ref(false);
const drag = ref(false);
const dragX = ref(20);
const dragY = ref(20);
const startX = ref(0);
const startY = ref(0);

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

const currentView = ref<"player" | "interactions">("player");
const pages = ref(Player);
const currentIndex = ref(0);

const currentPage = computed(() => pages.value[currentIndex.value]);

const isFullScreenWithBackground = computed(
  () =>
    currentPage.value.layout === "full-screen" &&
    !!currentPage.value.background,
);

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

const interPage = ref<"scan" | "titles" | "content">("scan");
const scanned = ref(false);
const interactions = ref<InteractionItem[]>([]);
const currentInteractionConfig = ref<InteractionConfig | null>(null);
const codeReader = new BrowserMultiFormatReader();

async function startScanner() {
  try {
    const devices = await codeReader.listVideoInputDevices();
    if (!devices.length) throw new Error("No cameras found");
    const deviceId = devices[0].deviceId;

    codeReader.decodeFromVideoDevice(deviceId, "qr-video", (result, err) => {
      if (result) {
        const raw = result.getText().trim();
        let normalized: string;

        try {
          const u = new URL(raw);
          const path = u.pathname.replace(/\/$/, "");

          normalized = `${u.origin}${path}`;
        } catch {
          normalized = raw.replace(/\/$/, "");
        }
        console.log("📱 QR Code normalizado:", normalized);

        const cfg = interactionConfigs[normalized];
        if (cfg) {
          currentInteractionConfig.value = cfg;
          interactions.value = cfg.items;
          scanned.value = true;
          interPage.value = "titles";
          codeReader.reset();
        } else {
          console.warn("Unknown QR after normalization:", normalized);
        }
      }
    });
  } catch (e) {
    console.error(e);
  }
}

const contentWrapper = ref<HTMLElement | null>(null);

function showContent(id: string) {
  interPage.value = "content";
  nextTick(() => {
    const el = document.getElementById(id);
    const c = contentWrapper.value;
    if (el && c) {
      c.scrollTo({ top: el.offsetTop - 20, behavior: "smooth" });
    }
  });
}

watch(currentView, (v) => {
  if (v === "interactions") {
    interPage.value = "scan";
    startScanner();
  } else {
    codeReader.reset();
    scanned.value = false;
  }
});

watch(dialog, (open) => {
  if (open) {
    currentView.value = "player";
    interPage.value = "scan";
    scanned.value = false;
    codeReader.reset();
  }
});

onBeforeUnmount(() => codeReader.reset());
</script>

<style scoped>
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

.nav-drawer {
  background: #1a120f !important;
  border-right: 2px solid #212121 !important;
  z-index: 1001;
  height: 100%;
  position: absolute !important;
  transition: width 0.3s ease !important;
}

.v-btn {
  letter-spacing: 1px;
  border: 1px solid #212121 !important;
  transition: all 0.3s ease !important;
}

.interaction-btn {
  background: transparent !important;
  box-shadow: none !important;
  border: none !important;
  color: #f0e6d2 !important;
  text-align: left !important;
  white-space: normal !important;
}

.interaction-btn .v-btn__content {
  display: block !important;
  white-space: normal !important;
  word-break: break-word !important;
  width: 100%;
  padding: 4px 0;
}

.interaction-btn:hover {
  color: #fff !important;
  text-decoration: underline !important;
  cursor: pointer;
}

.close-btn {
  background-color: #212121 !important;
  color: #f0e6d2 !important;
  border-radius: 50%;
  box-shadow: 1px 1px 3px rgba(0, 0, 0, 0.3);
}

.titles-background {
  position: relative;
  background-size: cover;
  background-position: center;
  min-height: 400px;
  border-radius: 8px;
  overflow: hidden;
}

.titles-background .interaction-btn {
  background: transparent !important;
  box-shadow: none !important;
  border: none !important;
  color: #f0e6d2 !important;
}

.titles-background .interaction-btn:hover {
  color: #ffffff !important;
  text-decoration: underline !important;
  cursor: pointer;
}

.titles-background .interaction-btn .v-btn__content {
  color: #f0e6d2 !important;
}

.buttons-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(26, 18, 15, 0.7);
  padding: 16px;
  box-sizing: border-box;
  overflow-y: auto;
}

.buttons-overlay .interaction-btn {
  width: 100%;
  white-space: normal;
  text-align: center;
}

.buttons-grid .interaction-btn {
  white-space: pre-wrap !important;
  word-break: break-word !important;
  overflow-wrap: anywhere !important;
  line-height: 1.2 !important;
}

.buttons-grid {
  margin: 0 -8px;
}

.buttons-grid > .v-col {
  padding: 0 8px;
}

.buttons-container {
  position: absolute;
  top: 0;
  right: 0;
  width: 40%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  padding: 16px;
  box-sizing: border-box;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
}

.button-overlay {
  background: linear-gradient(
    to left,
    rgba(26, 18, 15, 0.95) 60%,
    rgba(26, 18, 15, 0.7) 100%
  );
  position: relative;
  z-index: 2;
  height: 100%;
}

.book-page {
  background-image: url("data:image/png;base64,...");
  background-color: #f0e6d2;
  border: 1px solid #1e1e1e;
  box-shadow:
    0 0 10px rgba(94, 69, 57, 0.3),
    inset 0 0 20px rgba(94, 69, 57, 0.2);
  margin: 20px;
  min-height: calc(50vh - 40px);
  border-radius: 12px;
}

.section-title {
  font-family: "Uncial Antiqua", cursive;
  color: #212121;
  font-size: 1.2rem;
  text-shadow: 1px 1px 1px rgba(255, 255, 255, 0.5);
  border-bottom: 2px solid #1e1e1e;
}

.chapter-title {
  font-family: "Cinzel Decorative", cursive;
  font-size: 2rem;
  text-shadow: 2px 2px 3px rgba(94, 69, 57, 0.2);
}

.body-text p {
  font-family: "EB Garamond", serif;
  font-size: 1.1rem;
  line-height: 1.6;
  text-indent: 2em;
}

.content-page-interactions {
  display: flex;
  flex-direction: column;
  height: calc(70vh - 64px);
  overflow: hidden;
}

.content-wrapper-interactions {
  flex: 1;
  overflow-y: auto;
  scroll-behavior: smooth;
  padding-right: 8px;
}

.interaction-header {
  position: relative;
  display: flex;
  flex-direction: column;
  padding: 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.interaction-main-title {
  color: #f0e6d2;
  font-size: 1.4rem;
  margin: 0 0 8px;
}

.interaction-subtitle {
  font-family: "EB Garamond", serif;
  color: #ddd;
  font-size: 0.9rem;
  line-height: 1.4;
  margin: 0;
}

.header-close {
  position: absolute;
  top: 0;
  right: 16px;
}

@media (max-width: 960px) {
  .book-dialog {
    width: 90vw !important;
    max-height: 80vh !important;
  }

  .button-overlay {
    background: linear-gradient(
      to left,
      rgba(26, 18, 15, 0.95) 30%,
      rgba(26, 18, 15, 0.7) 100%
    );
  }

  .chapter-title {
    font-size: 1.8rem !important;
  }

  .interaction-btn {
    min-height: 54px !important;
    padding: 12px 16px !important;
    margin: 8px 0 !important;
    font-size: 0.875rem !important;
    line-height: 1.3 !important;
  }
}

@media (max-width: 600px) {
  .interaction-main-title {
    font-size: 1.2rem;
  }

  .interaction-subtitle {
    font-size: 0.8rem;
  }

  .image-background-container {
    min-height: 400px;
  }

  .book-page {
    margin: 10px !important;
    min-height: calc(70vh - 40px);
  }

  .section-title {
    font-size: 1rem !important;
  }

  .interaction-btn {
    min-height: 54px !important;
    padding: 12px 16px !important;
    margin: 8px 0 !important;
    font-size: 0.6rem !important;
    line-height: 1.3 !important;
  }

  .interaction-btn .v-btn__content {
    line-height: 1.3 !important;
  }
}

.scrollable-content {
  overflow-y: auto;
  max-height: 70vh;
}

.drawer-item--active {
  background-color: rgba(255, 193, 7, 0.2) !important;
}

::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.2);
}

::-webkit-scrollbar-thumb {
  background: #5d4037;
  border: 1px solid rgba(255, 255, 255, 0.1);
}
</style>
