<template>
  <div class="interact-view-new">
    <header class="iv-head">
      <img src="@/assets/interaction.png" alt="" class="iv-head__icon" />
      <div class="iv-head__text">
        <span class="iv-head__kicker">Room interactions</span>
        <strong class="iv-head__room">{{ roomName }}</strong>
      </div>
      <v-btn icon="mdi-close" variant="text" color="white" @click="$emit('close')"></v-btn>
    </header>

    <div class="main-container-scroll">
      <div v-if="!interactionStageActive" class="iv-body">
        <section class="iv-panel iv-list">
          <h3 class="iv-panel__title">
            Available here
            <span v-if="visibleInteractions.length" class="iv-panel__count">{{ visibleInteractions.length }}</span>
          </h3>

          <div
            v-for="interaction in visibleInteractions"
            :key="interaction.id"
            class="interaction-list-item"
            :class="{ 'interaction-list-item--new': interaction.isNew }"
            @click="chooseInteraction(interaction.id)"
          >
            <img src="@/assets/interaction.png" class="interaction-list-icon" alt="" />
            <div class="interaction-list-title">
              <span class="interaction-list-number">Interaction {{ interaction.number }}</span>
              <span class="interaction-list-name">{{ interaction.title }}</span>
              <div v-if="interaction.isNew || interaction.appOnly" class="interaction-list-tags">
                <span v-if="interaction.isNew" class="interaction-tag interaction-tag--new">New in this room</span>
                <span v-if="interaction.appOnly" class="interaction-tag">App only · no QR code</span>
              </div>
            </div>
            <v-icon class="interaction-list-chevron">mdi-chevron-right</v-icon>
          </div>

          <div v-if="visibleInteractions.length === 0" class="iv-empty">
            <v-icon size="28">mdi-eye-off-outline</v-icon>
            <span>No interactions in this room.</span>
          </div>
        </section>

        <section class="iv-panel iv-scan">
          <h3 class="iv-panel__title">Scan a QR code</h3>
          <div class="video-wrapper">
            <video id="interact-qr-video" class="qr-video" autoplay muted playsinline />
            <div class="scan-frame"></div>
            <v-btn
              v-if="isCameraSwitchVisible"
              @click="switchCamera"
              icon="mdi-camera-flip"
              size="small"
              class="camera-switch"
              variant="flat"
            />
          </div>
          <p class="iv-scan__hint">Point the camera at the QR code on the Interaction token.</p>
        </section>
      </div>

      <div v-else class="interaction-detail-overlay w-100">
         <v-toolbar color="transparent" density="compact" class="px-4 pt-2">
            <v-btn variant="text" color="grey-lighten-1" @click="closeInteraction" class="text-none">
              <v-icon start>mdi-arrow-left</v-icon> Back to Interactions List
            </v-btn>
         </v-toolbar>

         <div class="detail-container pb-10">
             
             <div v-if="interactionStage === 'titles' && currentConfig" class="text-center pa-4">
                 <v-img 
                    v-if="currentConfig.background"
                    :src="currentConfig.background" 
                    max-height="300" 
                    class="rounded-lg mb-4 mx-auto"
                    style="max-width: 600px;" 
                 ></v-img>
                 
                 <h2 class="text-h4 font-cinzel text-white mb-4">{{ currentConfig.title }}</h2>
                 
                 <div class="narrative-text mb-6 text-left mx-auto" style="max-width: 800px;">
                     <div v-html="getInteractionIntroBody()"></div>
                 </div>

                 <v-row justify="center" class="mb-4" style="max-width: 900px; margin: 0 auto;">
                     <v-col 
                        v-for="item in interactionChoices" 
                        :key="item.id" 
                        cols="12" 
                        sm="6"
                        md="6"
                        class="d-flex"
                      >
                          <v-btn 
                            block 
                            size="x-large" 
                            variant="outlined" 
                            color="amber-lighten-1" 
                            class="choice-btn" 
                            @click="selectChoice(item)"
                          >
                              <span class="text-wrap">{{ item.title }}</span>
                          </v-btn>
                      </v-col>
                 </v-row>
             </div>

             <div v-else-if="interactionStage === 'content' && currentItem" class="text-left pa-4 mx-auto" style="max-width: 800px;">
                 <div class="text-h5 font-cinzel mb-6 text-white border-b pb-2">{{ currentItem.title }}</div>
                 
                 <div class="narrative-text mb-8">
                     <div v-for="(p, i) in currentItem.body" :key="i" v-html="p" class="mb-3"></div>
                 </div>

                 <v-row v-if="currentItem.actions && currentItem.actions.length > 0">
                     <v-col v-for="(action, idx) in currentItem.actions" :key="idx" cols="12" sm="6">
                         <v-btn 
                            block 
                            variant="elevated" 
                            color="primary" 
                            size="large" 
                            class="action-btn"
                            @click="executeAction(action)"
                          >
                             <span class="text-wrap">{{ action.text }}</span>
                          </v-btn>
                     </v-col>
                 </v-row>
                 
                 <v-btn v-else block class="mt-6" variant="tonal" size="large" @click="backToTitles">
                    Return to Options
                 </v-btn>
             </div>
         </div>
      </div>
    </div>

    <v-dialog v-model="barricadeCheck" max-width="440">
      <v-card class="barricade-check rounded-xl">
        <div class="barricade-check__head">
          <img src="@/assets/interaction.png" alt="" class="barricade-check__icon" />
          <div>
            <div class="barricade-check__kicker">Interaction 1</div>
            <div class="barricade-check__title">The Barricade</div>
          </div>
        </div>
        <v-card-text class="barricade-check__body">
          <template v-if="!barricadeNotYet">
            This interaction has no QR code. The <strong>Game State Check-Up</strong> card on the Initiative Track,
            on its <strong>‘The Barricade’</strong> side, tells you when to open it.
            <div class="barricade-check__question">Have you read ‘The Barricade’ card?</div>
          </template>
          <template v-else>
            Read the <strong>‘The Barricade’</strong> side of the Game State Check-Up card first. Come back here when it
            tells you to resolve the interaction.
          </template>
        </v-card-text>
        <v-card-actions class="barricade-check__actions">
          <template v-if="!barricadeNotYet">
            <v-btn variant="text" color="grey-lighten-1" @click="barricadeNotYet = true">Not yet</v-btn>
            <v-btn variant="flat" color="playbutton" class="text-none font-weight-bold" @click="confirmBarricade">Yes, open it</v-btn>
          </template>
          <v-btn v-else variant="flat" color="playbutton" class="text-none font-weight-bold" @click="barricadeCheck = false">Got it</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="showCameraDeniedDialog" max-width="400">
      <v-card class="bg-grey-darken-3">
        <v-card-title>Camera Required</v-card-title>
        <v-card-text>Please enable camera access to scan QR codes.</v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="primary" @click="showCameraDeniedDialog = false">OK</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, nextTick } from 'vue';
import { BrowserMultiFormatReader, BarcodeFormat, DecodeHintType } from '@zxing/library';

import rawInteractionConfigsData from "@/data/book/interactionConfigurations.json";
import { roomInteractions, BARRICADE } from "@/utils/roomInteractions";

import BarricadeImg from "@/assets/Interaction_01_The Barricade-min.png";
import ArmorImg from "@/assets/Interaction_03_ShinningArmor-min.png";
import WeaponsTableImg from "@/assets/Interaction_02_WeaponsTable-min.png";
import ReservoirImg from "@/assets/01-Flood-Dungeon_v02-min.png";
import TreasuresImg from "@/assets/02-Arsenal-Dungeon-min.png";
import GargoyleImg from "@/assets/03-Gargoyle-min.png";
import PrisonerImg from "@/assets/Interaction_ThePrisoner-min.png";
import SeedImg from "@/assets/Interaction_TheSeed-min.png";
import ForgeImg from "@/assets/Interaction_TheForge-min.png";
import AltarImg from "@/assets/Interaction_DraconianAltar-min.png";
import BeerImg from "@/assets/Interaction_BeerFactory-min.png";
import RunicImg from "@/assets/Interaction_TheRunic-min.png";

import InteractionBarricade from "@/assets/json/InteractionBarricade.json";
import InteractionTheShiningArmor from "@/assets/json/InteractionTheShiningArmor.json";
import InteractionWeaponsTable from "@/assets/json/InteractionWeaponsTable.json";
import InteractionTheStoneGuardian from "@/assets/json/InteractionTheStoneGuardian.json";
import InteractionTheReservoir from "@/assets/json/InteractionTheReservoir.json";
import InteractionTreasuresOfAForgottenAge from "@/assets/json/InteractionTreasuresOfAForgottenAge.json";
import InteractionThePrisoner from "@/assets/json/InteractionThePrisoner.json";
import InteractionTheSeed from "@/assets/json/InteractionTheSeed.json";
import InteractionTheForge from "@/assets/json/InteractionTheForge.json";
import InteractionDraconianAltar from "@/assets/json/InteractionDraconianAltar.json";
import InteractionBeerFactory from "@/assets/json/InteractionBeerFactory.json";
import InteractionTheRunic from "@/assets/json/InteractionTheRunic.json";

const props = defineProps<{
    currentDoor: string;
    wing: string;
    // Opens straight on this Interaction (a book button, not a QR code).
    startWith?: string;
}>();

const emit = defineEmits(['close', 'open-scene']);

const interactionMeta: Record<string, { number: number, title: string }> = {
    "https://qr1.be/WMJL": { number: 1, title: "The Barricade" },
    "https://qr1.be/FNMI": { number: 2, title: "The Weapons Table" },
    "https://qr1.be/0RLM": { number: 3, title: "The Shining Armor" },
    "https://qr1.be/60LT": { number: 4, title: "The Stone Guardian" },
    "https://qr1.be/LPF2": { number: 5, title: "The Reservoir" },
    "https://qr1.be/Y4ZP": { number: 6, title: "Treasures of a Forgotten Age" },
    "InteractionThePrisoner": { number: 7, title: "The Prisoner" },
    "InteractionTheSeed": { number: 8, title: "The Cube of Another World" },
    "InteractionTheForge": { number: 9, title: "Forgotten Forge" },
    "InteractionDraconianAltar": { number: 10, title: "Draconian Altar" },
    "InteractionBeerFactory": { number: 11, title: "Fantastic Beer Factory" },
    "InteractionTheRunic": { number: 12, title: "The Runic Circle" }
};

const importedImageAssets: Record<string, string> = {
  BarricadeImg, ArmorImg, WeaponsTableImg, ReservoirImg, TreasuresImg, GargoyleImg,
  PrisonerImg, SeedImg, ForgeImg, AltarImg, BeerImg, RunicImg
};

const importedItemAssets: Record<string, any> = {
  InteractionBarricade, InteractionTheShiningArmor, InteractionWeaponsTable,
  InteractionTheStoneGuardian, InteractionTheReservoir, InteractionTreasuresOfAForgottenAge,
  InteractionThePrisoner, InteractionTheSeed, InteractionTheForge,
  InteractionDraconianAltar, InteractionBeerFactory, InteractionTheRunic
};

const interactionConfigs = ref<Record<string, any>>({});
const activeInteractionId = ref<string | null>(null);
const interactionStage = ref<'titles' | 'content'>('titles');
const currentConfig = ref<any>(null);
const currentItem = ref<any>(null);

const interactionStageActive = computed(() => !!currentConfig.value);

const codeReader = new BrowserMultiFormatReader(undefined, 400);
const zxingHints = new Map();
zxingHints.set(DecodeHintType.POSSIBLE_FORMATS, [BarcodeFormat.QR_CODE]);
(codeReader as any).hints = zxingHints;

const availableCameras = ref<MediaDeviceInfo[]>([]);
const currentCameraIndex = ref(0);
const isCameraSwitchVisible = ref(false);
const showCameraDeniedDialog = ref(false);
const isMounted = ref(false);
let activeStream: MediaStream | null = null;

onMounted(() => {
    isMounted.value = true;
    const configs: Record<string, any> = {};
    for (const key in rawInteractionConfigsData as any) {
        const raw = (rawInteractionConfigsData as any)[key];
        configs[key] = {
            ...raw,
            background: importedImageAssets[raw.backgroundImportName] || "",
            items: importedItemAssets[raw.itemsImportName] || []
        };
    }
    interactionConfigs.value = configs;

    if (props.startWith) {
        selectInteraction(props.startWith);
    } else if (!interactionStageActive.value) {
        startScanner();
    }
});

onBeforeUnmount(() => {
    isMounted.value = false;
    stopCamera();
});

const stopCamera = () => {
  codeReader.reset();
  
  if (activeStream) {
    activeStream.getTracks().forEach(track => track.stop());
    activeStream = null;
  }
  
  const videoElement = document.getElementById('interact-qr-video') as HTMLVideoElement;
  if (videoElement && videoElement.srcObject) {
    const stream = videoElement.srcObject as MediaStream;
    stream.getTracks().forEach(track => track.stop());
    videoElement.srcObject = null;
  }
};

const startScanner = async () => {
  if (interactionStageActive.value) return;
  
  try {
    stopCamera();
    await nextTick();
    
    if (!isMounted.value) return;

    const videoElement = document.getElementById('interact-qr-video') as HTMLVideoElement;
    if (!videoElement) return; 

    const devices = await codeReader.listVideoInputDevices();
    if (!devices.length) return;

    availableCameras.value = devices;
    isCameraSwitchVisible.value = devices.length > 1;
    const rearIndex = devices.findIndex(d => d.label.toLowerCase().includes('back') || d.label.toLowerCase().includes('rear'));
    currentCameraIndex.value = rearIndex >= 0 ? rearIndex : devices.length - 1;
    const deviceId = devices[currentCameraIndex.value].deviceId;

    if (!isMounted.value) return;

    await codeReader.decodeFromVideoDevice(deviceId, videoElement, (result) => {
        if (!isMounted.value) {
            stopCamera();
            return;
        }
        if (result) {
            const text = result.getText().trim();
            let id = text.includes("interaction/") ? text.split("/")[1] : text;
            selectInteraction(id);
        }
    });

    if (videoElement.srcObject) activeStream = videoElement.srcObject as MediaStream;
    
    if (!isMounted.value) stopCamera();

  } catch (e) {
    console.error("Scanner error", e);
    if (isMounted.value && !interactionStageActive.value) {
        showCameraDeniedDialog.value = true;
    }
  }
};

const switchCamera = () => {
  if (availableCameras.value.length <= 1) return;
  stopCamera();
  currentCameraIndex.value = (currentCameraIndex.value + 1) % availableCameras.value.length;
  nextTick(() => startScanner());
};

const room = computed(() => roomInteractions(props.wing, props.currentDoor));

// "THE ENTRY HALL (TUTORIAL)" → "The Entry Hall".
const roomName = computed(() =>
    (props.currentDoor || "First Setup")
        .replace(/\s*\(TUTORIAL\)\s*$/i, "")
        .toLowerCase()
        .replace(/(^|[\s-])([a-z])/g, (_m, sep, ch) => sep + ch.toUpperCase()),
);

// Newest first: what this room just added, then what is still on the board.
const visibleInteractions = computed(() =>
    room.value.available
        .filter((id) => interactionMeta[id])
        .map((id) => ({ id, ...interactionMeta[id], isNew: room.value.placedHere.includes(id), appOnly: id === BARRICADE }))
        .sort((a, b) => Number(b.isNew) - Number(a.isNew) || a.number - b.number),
);

// The Barricade has no QR code: the Game State Check-Up card sends the party here.
const barricadeCheck = ref(false);
const barricadeNotYet = ref(false);

function chooseInteraction(id: string) {
    if (id === BARRICADE) {
        barricadeNotYet.value = false;
        barricadeCheck.value = true;
        return;
    }
    selectInteraction(id);
}

function confirmBarricade() {
    barricadeCheck.value = false;
    selectInteraction(BARRICADE);
}

const getInteractionIntroBody = () => {
  if (!currentConfig.value) return "";
  const introItem = currentConfig.value.items.find((i:any) => i.type === "intro");
  if (introItem) return introItem.body.join("");
  // Season 1 cards keep their intro in the subtitle; the first item is already choice 1.
  return currentConfig.value.subtitle || "";
};

const interactionChoices = computed(() => {
  if (!currentConfig.value) return [];
  return currentConfig.value.items.filter((i:any) => i.type === "choice");
});

function selectInteraction(idOrKey: string) {
    let foundConfig = null;
    const target = idOrKey.trim();

    if (interactionConfigs.value[target]) {
        foundConfig = interactionConfigs.value[target];
    } 
    else {
        for (const key in interactionConfigs.value) {
            const config = interactionConfigs.value[key];
            if (
                config.id === target || 
                key === target ||
                key.toLowerCase() === target.toLowerCase() ||
                (config.itemsImportName && config.itemsImportName === target)
            ) {
                foundConfig = config;
                break;
            }
        }
    }

    if(foundConfig) {
        stopCamera();
        currentConfig.value = foundConfig;
        activeInteractionId.value = target;
        interactionStage.value = 'titles';
    } else {
        console.error("Config not found for interaction:", target);
    }
}

function selectChoice(item: any) {
    currentItem.value = item;
    interactionStage.value = 'content';
}

function backToTitles() {
    interactionStage.value = 'titles';
    currentItem.value = null;
}

function closeInteraction() {
    activeInteractionId.value = null;
    currentConfig.value = null;
    currentItem.value = null;
    if (isMounted.value) {
        nextTick(() => startScanner());
    }
}

function executeAction(action: any) {
    if (action.type === "RETURN_TO_CHOICES") {
        backToTitles();
        return;
    }
    
    if (action.type === "PROCEED") {
        if (action.target && action.target.startsWith("scene-")) {
            emit('open-scene', action.target);
            return;
        }

        const txt = action.text.toLowerCase();
        if (action.target === "next-adventure-step" || txt.includes("adventure") || txt.includes("close")) {
            emit('close');
            return;
        }

        if (action.target) {
            const nextItem = currentConfig.value.items.find((i:any) => i.id === action.target);
            if(nextItem) selectChoice(nextItem);
        }
    }
}

const ensureCameraPermission = () => {
    if (isMounted.value && !interactionStageActive.value) {
        startScanner();
    }
};

defineExpose({ ensureCameraPermission });
</script>

<style scoped>
.interact-view-new {
    background-color: #121212;
    height: 100%;
    color: white;
    display: flex;
    flex-direction: column;
}

.main-container-scroll {
    flex: 1;
    overflow-y: auto;
    overflow-x: hidden;
}

.font-cinzel { font-family: 'Cinzel', serif; }

/* Header: the official icon, then the room the party is in. */
.iv-head {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 10px 8px 10px 16px;
    background: #0b0b0c;
    border-bottom: 1px solid rgba(191, 82, 157, 0.35);
}
.iv-head__icon {
    width: 38px;
    height: 38px;
    object-fit: contain;
    flex-shrink: 0;
}
.iv-head__text {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
}
.iv-head__kicker {
    font-size: 0.68rem;
    font-weight: 800;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: #d77fbc;
}
.iv-head__room {
    font-family: 'Cinzel', serif;
    font-size: 1.1rem;
    line-height: 1.25;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

/* List and scanner side by side on PC, stacked (list first) on phones. */
.iv-body {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
    gap: 20px;
    max-width: 1040px;
    margin: 0 auto;
    padding: 24px;
}
.iv-panel {
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 18px;
    background: #1b1b1d;
    border: 1px solid rgba(255, 255, 255, 0.06);
    border-radius: 16px;
}
.iv-panel__title {
    display: flex;
    align-items: center;
    gap: 8px;
    margin: 0 0 4px;
    font-size: 0.78rem;
    font-weight: 800;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: rgba(255, 255, 255, 0.7);
}
.iv-panel__count {
    min-width: 20px;
    height: 20px;
    padding: 0 6px;
    border-radius: 999px;
    background: #bf529d;
    color: #fff;
    font-size: 0.7rem;
    line-height: 20px;
    text-align: center;
}
.iv-empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;
    padding: 28px 0;
    color: rgba(255, 255, 255, 0.45);
    font-size: 0.9rem;
}

.iv-scan {
    align-items: center;
}
.iv-scan .iv-panel__title {
    align-self: stretch;
}
.iv-scan__hint {
    margin: 0;
    color: rgba(255, 255, 255, 0.5);
    font-size: 0.8rem;
    text-align: center;
}
.video-wrapper {
    position: relative;
    width: 100%;
    max-width: 300px;
    aspect-ratio: 1;
    border-radius: 14px;
    overflow: hidden;
    background: #000;
}
.qr-video { width: 100%; height: 100%; object-fit: cover; }
/* Corner marks around the scan area. */
.scan-frame {
    position: absolute;
    inset: 18%;
    pointer-events: none;
    background:
        linear-gradient(#2bb39a, #2bb39a) top left / 26px 3px,
        linear-gradient(#2bb39a, #2bb39a) top left / 3px 26px,
        linear-gradient(#2bb39a, #2bb39a) top right / 26px 3px,
        linear-gradient(#2bb39a, #2bb39a) top right / 3px 26px,
        linear-gradient(#2bb39a, #2bb39a) bottom left / 26px 3px,
        linear-gradient(#2bb39a, #2bb39a) bottom left / 3px 26px,
        linear-gradient(#2bb39a, #2bb39a) bottom right / 26px 3px,
        linear-gradient(#2bb39a, #2bb39a) bottom right / 3px 26px;
    background-repeat: no-repeat;
}
.camera-switch {
    position: absolute; top: 10px; right: 10px;
    background: rgba(0,0,0,0.6); color: white; z-index: 10;
}

.interaction-list-item {
    display: flex;
    align-items: center;
    gap: 14px;
    background-color: #242427;
    border: 1px solid rgba(191, 82, 157, 0.25);
    border-radius: 14px;
    padding: 12px 10px 12px 12px;
    cursor: pointer;
    transition: background-color 0.15s, border-color 0.15s;
}
.interaction-list-item:hover {
    background-color: rgba(191, 82, 157, 0.14);
    border-color: #bf529d;
}
.interaction-list-item:active {
    transform: scale(0.99);
}
.interaction-list-icon {
    width: 46px;
    height: 46px;
    object-fit: contain;
    flex-shrink: 0;
}
.interaction-list-title {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    text-align: left;
}
.interaction-list-number {
    font-size: 0.68rem;
    font-weight: 800;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: #d77fbc;
}
.interaction-list-name {
    font-size: 1.02rem;
    font-weight: 700;
    line-height: 1.3;
    color: #fff;
}

.interaction-list-item--new {
    border-color: #bf529d;
    box-shadow: 0 0 14px rgba(191, 82, 157, 0.35);
}

.interaction-list-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    margin-top: 4px;
}

.interaction-tag {
    font-size: 0.7rem;
    font-weight: 700;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    padding: 2px 8px;
    border-radius: 999px;
    color: rgba(255, 255, 255, 0.75);
    background: rgba(255, 255, 255, 0.08);
}

.interaction-tag--new {
    color: #fff;
    background: #bf529d;
}

.barricade-check {
    background: rgb(var(--v-theme-surface));
    border: 1px solid rgba(191, 82, 157, 0.45);
}

.barricade-check__head {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 20px 20px 4px;
}

.barricade-check__icon {
    width: 44px;
    height: 44px;
    object-fit: contain;
}

.barricade-check__kicker {
    font-size: 0.72rem;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: #bf529d;
}

.barricade-check__title {
    font-family: 'Cinzel', serif;
    font-size: 1.35rem;
    font-weight: 700;
    color: #fff;
}

.barricade-check__body {
    font-size: 0.95rem;
    line-height: 1.55;
    color: rgba(255, 255, 255, 0.85);
}

.barricade-check__question {
    margin-top: 14px;
    font-weight: 700;
    color: #fff;
}

.barricade-check__actions {
    justify-content: flex-end;
    gap: 8px;
    padding: 0 20px 18px;
}

.interaction-list-chevron {
    flex-shrink: 0;
    color: #bf529d;
    font-size: 1.6rem;
    opacity: 0.8;
    transition: transform 0.2s, opacity 0.2s;
}

.interaction-list-item:hover .interaction-list-chevron {
    opacity: 1;
    transform: translateX(4px);
}

.interaction-detail-overlay {
    width: 100%;
    min-height: 100%;
    background-color: #121212;
}

.narrative-text :deep(p) {
  font-family: 'EB Garamond', serif;
  font-size: 1.2rem;
  line-height: 1.6;
  margin-bottom: 1rem;
  color: #e0e0e0;
}

.choice-btn {
    text-transform: none !important;
    font-size: 1rem !important;
    white-space: normal !important;
    height: auto !important;
    min-height: 72px !important; 
    padding: 16px !important;
    display: flex;
    align-items: center;
    justify-content: center;
}

.choice-btn :deep(.v-btn__content) {
    white-space: normal !important;
    flex: 1 1 auto;
    width: 100%;
    line-height: 1.3;
}

.text-wrap {
    white-space: normal;
    display: block;
    width: 100%;
}

.action-btn {
    white-space: normal !important;
    height: auto !important;
    padding: 12px !important;
}

@media (max-width: 960px) {
    .iv-body {
        grid-template-columns: minmax(0, 1fr);
        gap: 14px;
        padding: 14px;
    }
}
</style>