<template>
  <div class="interact-view-new">
    <v-toolbar color="black" density="compact" class="px-2">
      <v-toolbar-title class="text-white font-cinzel pl-2 text-center">
        Room Interactions
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon="mdi-close" variant="text" color="white" @click="$emit('close')"></v-btn>
    </v-toolbar>

    <v-container fluid class="fill-height align-start pa-0">
      
      <v-row v-if="!interactionStageActive" class="fill-height w-100 ma-0">
        
        <v-col cols="12" md="6" class="scanner-col d-flex flex-column align-center justify-center bg-grey-darken-4 border-r">
            <div class="text-h6 text-white mb-4 font-weight-bold">Scan Interaction Card</div>
            
            <div class="video-wrapper">
                <video id="interact-qr-video" class="qr-video" autoplay muted playsinline />
                <div class="scan-overlay"></div>
                <v-btn
                  v-if="isCameraSwitchVisible"
                  @click="switchCamera"
                  icon="mdi-camera-flip"
                  size="small"
                  class="camera-switch"
                  variant="flat"
                />
            </div>
            <div class="text-caption text-grey mt-2">Point camera at the QR Code</div>
        </v-col>

        <v-col cols="12" md="6" class="list-col bg-grey-darken-3 pa-4">
            <div class="text-h6 text-white mb-6 font-weight-bold text-center">Available Here</div>
            
            <v-row justify="center">
                <v-col 
                  v-for="interaction in visibleInteractions" 
                  :key="interaction.id" 
                  cols="4" sm="3" md="4"
                  class="d-flex flex-column align-center mb-4"
                >
                  <div 
                    class="interaction-token-wrapper"
                    @click="selectInteraction(interaction.id)"
                  >
                      <img src="@/assets/interaction.png" class="interaction-token-img" alt="Interact" />
                  </div>
                  <div class="text-center mt-2 text-caption text-white font-weight-bold interaction-label" style="line-height: 1.1;">
                      {{ interaction.title }}
                  </div>
                </v-col>

                <v-col cols="12" v-if="visibleInteractions.length === 0">
                    <div class="text-center text-grey mt-10">
                        <v-icon size="large" class="mb-2">mdi-eye-off</v-icon>
                        <div>No visible interactions in this area.</div>
                    </div>
                </v-col>
            </v-row>
        </v-col>
      </v-row>

      <div v-else class="interaction-detail-overlay">
         <div class="detail-container pt-5">
             
             <div v-if="interactionStage === 'titles' && currentConfig" class="text-center pa-4">
                 <v-img 
                    v-if="currentConfig.background"
                    :src="currentConfig.background" 
                    max-height="250" 
                    cover 
                    class="rounded-lg mb-4 mx-auto"
                    style="border: 1px solid #444; max-width: 600px;"
                  ></v-img>
                 
                 <h2 class="text-h4 font-cinzel text-white mb-4">{{ currentConfig.title }}</h2>
                 
                 <div class="narrative-text mb-6 text-left mx-auto" style="max-width: 800px;">
                     <div v-html="getInteractionIntroBody()"></div>
                 </div>

                 <v-row justify="center" class="mb-4" style="max-width: 900px; margin: 0 auto;">
                     <v-col 
                        v-for="item in interactionChoices" 
                        :key="item.id" 
                        cols="6" 
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
                 
                 <v-btn class="mt-4" variant="text" color="grey" @click="closeInteraction">
                    <v-icon start>mdi-arrow-left</v-icon> Back to List
                 </v-btn>
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
                    Return
                 </v-btn>
             </div>
         </div>
      </div>

    </v-container>

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

// Imports dos Dados
import rawInteractionConfigsData from "@/data/book/interactionConfigurations.json";

// Imagens
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

// JSONs de Conteúdo
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
}>();

const emit = defineEmits(['close']);

// --- METADADOS ---
const interactionMeta: Record<string, { number: number, title: string }> = {
    "InteractionThePrisoner": { number: 7, title: "The Prisoner" },
    "InteractionTheSeed": { number: 8, title: "Seed of Another World" },
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

// === ESTADO ===
const interactionConfigs = ref<Record<string, any>>({});
const activeInteractionId = ref<string | null>(null);
const interactionStage = ref<'titles' | 'content'>('titles');
const currentConfig = ref<any>(null);
const currentItem = ref<any>(null);

// Controla se estamos mostrando detalhes ou o scanner
const interactionStageActive = computed(() => !!currentConfig.value);

// === SCANNER SETUP ===
const codeReader = new BrowserMultiFormatReader(undefined, 400);
const zxingHints = new Map();
zxingHints.set(DecodeHintType.POSSIBLE_FORMATS, [BarcodeFormat.QR_CODE]);
(codeReader as any).hints = zxingHints;

const availableCameras = ref<MediaDeviceInfo[]>([]);
const currentCameraIndex = ref(0);
const isCameraSwitchVisible = ref(false);
const showCameraDeniedDialog = ref(false);
const isMounted = ref(false); // Flag de segurança
let activeStream: MediaStream | null = null;

// === LIFECYCLE ===
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

    // Iniciar Scanner somente se não estiver visualizando uma interação
    if (!interactionStageActive.value) {
        startScanner();
    }
});

onBeforeUnmount(() => {
    isMounted.value = false;
    stopCamera();
});

// === LÓGICA DO SCANNER ===
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
  // Se já tem configuração ativa (user lendo texto), não liga camera
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
            // Lógica simples de parse
            let id = text.includes("interaction/") ? text.split("/")[1] : text;
            selectInteraction(id);
        }
    });

    if (videoElement.srcObject) activeStream = videoElement.srcObject as MediaStream;
    
    // Segurança final
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

// === FILTRO DE INTERAÇÕES VISÍVEIS (LISTA) ===
const visibleInteractions = computed(() => {
    const list: { id: string, number: number, title: string }[] = [];
    const w = (props.wing || "").toUpperCase();
    const d = (props.currentDoor || "").toUpperCase();

    const add = (key: string) => { 
        if(interactionMeta[key] && !list.find(i => i.id === key)) {
            list.push({ id: key, ...interactionMeta[key] }); 
        }
    };

    // WING 3 RULES
    if (w.includes("WING 3")) {
        const doorsOrder = ["FIRST SETUP", "DUNGEON FOYER", "QUEEN'S HALL", "THE FORGE", "ARTISAN'S GALLERY", "PROVING GROUNDS", "MAIN HALL"];
        const idx = doorsOrder.indexOf(d);
        if (idx >= 0) add("InteractionThePrisoner");
        if (idx >= 2) add("InteractionTheSeed");
        if (idx >= 3) add("InteractionTheForge");
    }

    // WING 4 RULES
    if (w.includes("WING 4")) {
        add("InteractionTheRunic"); 
        if (["DRACONIC CHAPEL", "BOTH OPEN", "LIBRARY", "LABORATORY"].includes(d)) add("InteractionDraconianAltar");
        if (["CRYPTS", "BOTH OPEN", "LIBRARY", "LABORATORY"].includes(d)) add("InteractionBeerFactory");
    }
    
    return list.sort((a,b) => a.number - b.number);
});

// === INTERACTION FLOW ===
const getInteractionIntroBody = () => {
  if (!currentConfig.value) return "";
  const introItem = currentConfig.value.items.find((i:any) => i.type === "intro");
  if (introItem) return introItem.body.join("");
  if (currentConfig.value.items.length > 0) return currentConfig.value.items[0].body.join("");
  return "";
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
        stopCamera(); // Importante: para a câmera ao entrar no modo leitura
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
    // Só reativa a câmera se o componente ainda estiver montado
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
        if (action.target === "next-adventure-step" || action.text.toLowerCase().includes("adventure") || action.text.toLowerCase().includes("close")) {
            emit('close');
            return;
        }

        if (action.target) {
            const nextItem = currentConfig.value.items.find((i:any) => i.id === action.target);
            if(nextItem) selectChoice(nextItem);
        }
    }
}
</script>

<style scoped>
.interact-view-new {
    background-color: #121212;
    min-height: 100vh;
    color: white;
    display: flex;
    flex-direction: column;
}
.font-cinzel { font-family: 'Cinzel', serif; }

/* SCANNER STYLES */
.scanner-col {
    position: relative;
    min-height: 50vh;
}
.video-wrapper {
    position: relative;
    width: 100%;
    max-width: 320px;
    aspect-ratio: 1;
    border-radius: 16px;
    overflow: hidden;
    border: 2px solid #007a68;
    background: black;
    box-shadow: 0 8px 24px rgba(0,0,0,0.5);
}
.qr-video { width: 100%; height: 100%; object-fit: cover; }
.scan-overlay {
    position: absolute; top: 0; left: 0; right: 0; bottom: 0;
    border: 40px solid rgba(0,0,0,0.3); pointer-events: none;
}
.camera-switch {
    position: absolute; top: 10px; right: 10px;
    background: rgba(0,0,0,0.6); color: white; z-index: 10;
}

/* LIST STYLES */
.list-col {
    min-height: 50vh;
    overflow-y: auto;
}
.interaction-token-wrapper {
    position: relative;
    cursor: pointer;
    transition: transform 0.2s;
}
.interaction-token-wrapper:hover {
    transform: scale(1.1);
    filter: brightness(1.2);
}
.interaction-token-img {
    width: 80px;
    height: 80px;
    filter: drop-shadow(0 0 8px rgba(0, 122, 104, 0.6)); 
}

/* DETAIL OVERLAY */
.interaction-detail-overlay {
    width: 100%;
    height: 100%;
    background-color: #121212;
    overflow-y: auto;
}
.narrative-text :deep(p) {
  font-family: 'EB Garamond', serif;
  font-size: 1.2rem;
  line-height: 1.6;
  margin-bottom: 1rem;
  color: #e0e0e0;
}

/* BUTTON STYLES */
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
    .border-r { border-right: none !important; border-bottom: 1px solid #333; }
    .scanner-col, .list-col { min-height: auto; }
    .interaction-label { font-size: 0.7rem !important; }
}
</style>