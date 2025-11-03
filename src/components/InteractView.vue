<template>
  <div class="interact-container">
    <div class="back-button-container">
      <v-btn
        @click="$emit('back')"
        prepend-icon="mdi-arrow-left"
        variant="outlined"
        class="back-button"
      >
        Back to Books
      </v-btn>
    </div>

    <v-card class="content-card" elevation="0">
      <!-- Scanner -->
      <div v-if="interPage === 'scan'" class="scanner-container">
        <v-card-title class="text-center">
          <v-icon start>mdi-qrcode-scan</v-icon>
          QR Code Scan
        </v-card-title>

        <v-card-text class="text-center">
          <div class="video-wrapper">
            <video id="qr-video" class="qr-video" autoplay muted playsinline />
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

      <!-- Lista -->
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
            @click="loadInteractionByKey(String(key))"
            :title="config.title"
            :subtitle="config.subtitle"
            prepend-icon="mdi-play-box"
          />
        </v-list>
      </div>

      <!-- Títulos (choices) -->
      <div
        v-else-if="interPage === 'titles' && currentInteractionConfig"
        class="interaction-content"
      >
        <v-img
          :src="currentInteractionConfig.background"
          height="300"
          cover
          class="interaction-hero"
          gradient="to bottom, rgba(0,0,0,0.1), rgba(0,0,0,0.3)"
        />

        <v-card-text class="interaction-text-content">
          <div class="text-center mb-4">
            <h2 class="interaction-title mb-2">
              {{ currentInteractionConfig.title }}
            </h2>
            <div class="body-text mt-3">
              <div v-html="getInteractionIntroBody()"></div>
            </div>
          </div>

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

        <v-card-actions class="justify-center pa-4">
          <v-btn @click="resetScan" prepend-icon="mdi-close" variant="outlined"
            >Close</v-btn
          >
        </v-card-actions>
      </div>

      <!-- Conteúdo -->
      <div v-else-if="interPage === 'content' && activeInteraction">
        <v-toolbar color="transparent" flat>
          <v-btn icon @click="backToTitles">
            <v-icon>mdi-arrow-left</v-icon>
          </v-btn>
          <v-toolbar-title>{{ activeInteraction.title }}</v-toolbar-title>
          <v-btn icon @click="resetScan">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>

        <v-card-text>
          <div
            v-for="(p, i) in activeInteraction.body"
            :key="'p-' + i"
            v-html="p"
            class="interaction-body"
          />
          <v-row v-if="availableActions.length > 0" class="mt-4">
            <v-col
              v-for="(action, idx) in availableActions"
              :key="'action-' + idx"
              cols="12"
              sm="6"
            >
              <v-btn @click="executeAction(action)" block variant="outlined">
                {{ action.text }}
              </v-btn>
            </v-col>
          </v-row>
        </v-card-text>
      </div>
    </v-card>

    <!-- Dialog permissão -->
    <v-dialog v-model="showCameraDeniedDialog" max-width="400">
      <v-card>
        <v-card-title>Camera Permission Required</v-card-title>
        <v-card-text>
          To scan QR codes, please enable camera access in your browser
          settings.
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn @click="showCameraDeniedDialog = false">OK</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import {
  ref,
  computed,
  onMounted,
  onBeforeUnmount,
  nextTick,
  watch,
} from "vue";
import { BrowserMultiFormatReader } from "@zxing/library";
import { useRouter, useRoute } from "vue-router";

// Configs e assets
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

// JSONs de interação
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

// Types
interface GameAction {
  text: string;
  type: "PROCEED" | "RETURN_TO_CHOICES";
  target?: string;
  condition?: string;
}
interface InteractionItem {
  id: string;
  type: "choice" | "resolution" | "intro";
  title: string;
  body: string[];
  actions?: GameAction[];
}
interface InteractionConfig {
  id: string;
  title: string;
  subtitle: string;
  background: string;
  items: InteractionItem[];
}

interface Props {
  navigationItems?: any[];
}
const props = withDefaults(defineProps<Props>(), {
  navigationItems: () => [],
});

const emit = defineEmits<{
  (e: "back"): void;
  (e: "navigate-to-book", bookId: string): void;
}>();

// Router
const router = useRouter();
const route = useRoute();

// State
const interPage = ref<"scan" | "titles" | "content" | "list">("scan");
const currentInteractionConfig = ref<InteractionConfig | null>(null);
const activeInteraction = ref<InteractionItem | null>(null);
const availableActions = ref<GameAction[]>([]);

const availableCameras = ref<MediaDeviceInfo[]>([]);
const currentCameraIndex = ref(0);
const isCameraSwitchVisible = ref(false);
const showCameraDeniedDialog = ref(false);

const codeReader = new BrowserMultiFormatReader();

// Maps para import dinâmico
const importedImageAssets: Record<string, string> = {
  BarricadeImg,
  ArmorImg,
  WeaponsTableImg,
  ReservoirImg,
  TreasuresImg,
  GargoyleImg,
  PrisonerImg,
  SeedImg,
  ForgeImg,
  AltarImg,
  BeerImg,
  RunicImg,
};

const importedItemAssets: Record<string, InteractionItem[]> = {
  InteractionBarricade,
  InteractionTheShiningArmor,
  InteractionWeaponsTable,
  InteractionTheStoneGuardian,
  InteractionTheReservoir,
  InteractionTreasuresOfAForgottenAge,
  InteractionThePrisoner,
  InteractionTheSeed,
  InteractionTheForge,
  InteractionDraconianAltar,
  InteractionBeerFactory,
  InteractionTheRunic,
};

const interactionConfigs = ref<Record<string, InteractionConfig>>({});

// Inicializa configs
const initializeInteractionConfigs = () => {
  const configs: Record<string, InteractionConfig> = {};
  for (const key in rawInteractionConfigsData as any) {
    const rawConfig = (rawInteractionConfigsData as any)[key] as {
      id: string;
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
      id: rawConfig.id,
      title: rawConfig.title,
      subtitle: rawConfig.subtitle,
      background: backgroundImage || "",
      items: itemsData || [],
    };
  }
  interactionConfigs.value = configs;
};

// Computed
const interactionChoices = computed(() => {
  if (!currentInteractionConfig.value) return [];
  return currentInteractionConfig.value.items.filter(
    (i) => i.type === "choice",
  );
});

// Methods
const findRearCamera = (devices: MediaDeviceInfo[]): number => {
  const rearKeywords = ["back", "rear", "environment", "world", "traseira"];
  for (let i = 0; i < devices.length; i++) {
    const label = devices[i].label?.toLowerCase?.() || "";
    if (rearKeywords.some((k) => label.includes(k))) return i;
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

        // Nova sintaxe: book/<id>
        if (raw.startsWith("book/")) {
          const bookId = raw.split("/")[1];
          emit("navigate-to-book", bookId);
          codeReader.reset();
          return;
        }

        // Nova sintaxe: interaction/<id>
        if (raw.startsWith("interaction/")) {
          const interactionId = raw.split("/")[1];
          loadInteractionById(interactionId);
          codeReader.reset();
          return;
        }

        // Sintaxe antiga: URL completa -> normaliza
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
          interPage.value = "titles";
          codeReader.reset();
        } else {
          console.warn("Unknown QR Code:", raw);
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
  activeInteraction.value = null;
  isCameraSwitchVisible.value = false;
  availableCameras.value = [];
  currentCameraIndex.value = 0;
  nextTick(() => {
    codeReader.reset();
    startScanner();
  });
};

const goToInteractionList = () => {
  interPage.value = "list";
  codeReader.reset();
};

const loadInteractionByKey = (key: string) => {
  const cfg = interactionConfigs.value[key];
  if (cfg) {
    currentInteractionConfig.value = cfg;
    interPage.value = "titles";
  } else {
    console.error(`Configuration for key '${key}' not found`);
  }
};

const loadInteractionById = (interactionId: string) => {
  for (const key in interactionConfigs.value) {
    const config = interactionConfigs.value[key];
    if (config.id === interactionId) {
      currentInteractionConfig.value = config;
      interPage.value = "titles";
      return;
    }
  }
  console.error(`Interaction with ID '${interactionId}' not found`);
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

const getInteractionIntroBody = () => {
  if (!currentInteractionConfig.value) return "";
  const introItem = currentInteractionConfig.value.items.find(
    (i) => i.type === "intro",
  );
  if (introItem) return introItem.body.join("");
  if (currentInteractionConfig.value.items.length > 0)
    return currentInteractionConfig.value.items[0].body.join("");
  return "";
};

// Watchers
watch(interPage, (newPage) => {
  if (newPage === "scan") {
    nextTick(() => {
      codeReader.reset();
      startScanner();
    });
  }
});

// Lifecycle
onMounted(() => {
  initializeInteractionConfigs();

  // Se vier direto por rota: /campaign/:campaignId/interaction/:interactionId
  const interactionId = route.params.interactionId as string;
  if (interactionId) {
    loadInteractionById(interactionId);
    interPage.value = currentInteractionConfig.value ? "titles" : "scan";
  } else {
    ensureCameraPermission();
  }
});

onBeforeUnmount(() => {
  codeReader.reset();
});

// Expose p/ pai
defineExpose({ resetScan, ensureCameraPermission });
</script>

<style scoped>
/* Mantém todos os estilos originais + pequenos ajustes */
.interact-container {
  width: 100%;
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
.content-card {
  border-radius: 16px !important;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.07) !important;
  background: white;
  margin-bottom: 16px;
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

.interaction-content {
  border-radius: 16px;
  overflow: hidden;
  background: var(--v-theme-surface);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}
.interaction-hero {
  position: relative;
  border-radius: 0;
}
.interaction-text-content {
  padding: 24px !important;
  background: var(--v-theme-surface);
}
.interaction-title {
  font-size: 1.75rem !important;
  font-weight: 600;
  color: var(--v-theme-on-surface);
  line-height: 1.3;
}

.body-text {
  font-style: italic;
}
.body-text :deep(p) {
  font-family: "EB Garamond", serif;
  font-size: 1.1rem;
  line-height: 1.6;
  text-indent: 2em;
  color: #191919 !important;
  margin-bottom: 1.5rem;
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

.v-btn {
  letter-spacing: 1px;
  border: 1px solid #212121 !important;
}
.v-btn__content {
  grid-area: content;
  justify-content: center;
  white-space: normal !important;
}

/* Tablet */
@media (max-width: 768px) {
  .interaction-text-content {
    padding: 16px !important;
  }
  .interaction-title {
    font-size: 1.5rem !important;
  }
  .interaction-choice-btn {
    min-height: 48px;
    font-size: 0.9rem;
  }
  .back-button-container {
    padding: 12px;
  }
}

/* Mobile */
@media (max-width: 480px) {
  .interaction-hero {
    height: 250px !important;
  }
  .interaction-text-content {
    padding: 12px !important;
  }
  .interaction-title {
    font-size: 1.3rem !important;
  }
  .interaction-choices {
    margin-top: 16px;
  }
  .back-button-container {
    padding: 8px;
  }
  .back-button {
    font-size: 0.875rem;
  }
  .v-toolbar__content > .v-toolbar-title {
    font-size: 0.875rem !important;
  }
  .v-btn.v-btn--density-default {
    height: calc(var(--v-btn-height) + 20px) !important;
  }
}

@media (prefers-color-scheme: dark) {
  .content-card {
    background: var(--v-theme-surface);
  }
}
</style>
