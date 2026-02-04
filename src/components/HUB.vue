<template>
  <v-dialog
    v-model="dialog"
    max-width="500"
    transition="dialog-bottom-transition"
    class="hub-dialog"
    scrollable
  >
    <v-card color="#121212" class="rounded-lg">
      <v-toolbar color="transparent" density="compact" class="border-b border-opacity-25 pl-2 pr-2 flex-shrink-0">
        <v-toolbar-title class="text-subtitle-1 font-weight-bold text-white">
           SCAN QR CODE
        </v-toolbar-title>
        <v-btn icon @click="closeDialog" density="compact" color="white">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>

      <v-card-text class="pa-4" style="overflow-y: auto;">
        
        <div class="scanner-container text-center">
            
            <div class="video-wrapper mb-4">
                <video id="qr-video" class="qr-video" autoplay muted playsinline />
                
                <v-btn
                  v-if="isCameraSwitchVisible"
                  @click="switchCamera"
                  icon="mdi-camera-flip"
                  size="small"
                  class="camera-switch"
                  :title="'Flip camera'"
                />
                
                <div class="scan-overlay"></div>

                <div v-if="processing" class="processing-overlay d-flex align-center justify-center">
                   <v-progress-circular indeterminate color="primary"></v-progress-circular>
                </div>
            </div>
            
            <p class="text-caption text-grey-lighten-1 mb-4 font-weight-medium">
               Point your camera at the <span class="text-white font-weight-bold">Event QR Code</span> to join the table.
            </p>

            <v-alert v-if="errorMessage" type="error" variant="tonal" density="compact" class="mb-3 text-left">
               {{ errorMessage }}
            </v-alert>

        </div>
      </v-card-text>
    </v-card>

    <v-dialog v-model="showCameraDeniedDialog" max-width="400">
      <v-card color="#1e1e1e">
        <v-card-title class="text-white">Camera Permission Required</v-card-title>
        <v-card-text class="text-grey-lighten-1">
          To scan QR codes, please enable camera access in your browser settings.
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="primary" @click="showCameraDeniedDialog = false">OK</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-snackbar v-model="snackbar.show" :color="snackbar.color" location="top" :timeout="3000">
        {{ snackbar.text }}
    </v-snackbar>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, computed, nextTick, onBeforeUnmount, watch, inject } from 'vue';
import { useRouter } from 'vue-router';
import {
  BrowserMultiFormatReader,
  BarcodeFormat,
  DecodeHintType,
} from "@zxing/library";

const props = defineProps<{
  modelValue: boolean;
}>();

const emit = defineEmits(['update:modelValue']);
const router = useRouter();
const axios: any = inject('axios');

const showCameraDeniedDialog = ref(false);
const processing = ref(false);
const snackbar = ref({ show: false, text: '', color: 'error' });
const errorMessage = ref('');

const codeReader = new BrowserMultiFormatReader(undefined, 400);
const zxingHints = new Map();
zxingHints.set(DecodeHintType.POSSIBLE_FORMATS, [BarcodeFormat.QR_CODE]);
zxingHints.set(DecodeHintType.TRY_HARDER, true);
(codeReader as any).hints = zxingHints;

const availableCameras = ref<MediaDeviceInfo[]>([]);
const currentCameraIndex = ref(0);
const isCameraSwitchVisible = ref(false);

const dialog = computed({
  get: () => props.modelValue,
  set: (val) => {
      emit('update:modelValue', val);
      if (val) {
          errorMessage.value = '';
          startScanner();
      } else {
          stopScanner();
      }
  }
});

watch(() => props.modelValue, (val) => {
    if(val) {
        errorMessage.value = '';
        startScanner();
    } else {
        stopScanner();
    }
});

const closeDialog = () => dialog.value = false;

const goToLobby = (eventId: string | number, tablePk?: string | number) => {
    stopScanner();
    dialog.value = false;

    router.push({ 
        name: 'Lobby', 
        params: { id: eventId },
        query: tablePk ? { table_pk: tablePk } : {}
    });
};

const findRearCamera = (devices: MediaDeviceInfo[]): number => {
  const rearKeywords = ["back", "rear", "environment", "world", "traseira"];
  for (let i = 0; i < devices.length; i++) {
    const label = devices[i].label?.toLowerCase?.() || "";
    if (rearKeywords.some((k) => label.includes(k))) return i;
  }
  return devices.length > 1 ? devices.length - 1 : 0;
};

const startScanner = async () => {
  if(!dialog.value) return;
  
  await nextTick();

  try {
    const videoElement = document.getElementById("qr-video") as HTMLVideoElement | null;
    if (!videoElement) return;

    const devices = await codeReader.listVideoInputDevices();
    if (!devices.length) {
      errorMessage.value = "No camera found on this device.";
      return;
    }

    availableCameras.value = devices;
    isCameraSwitchVisible.value = devices.length > 1;

    if (currentCameraIndex.value >= devices.length || currentCameraIndex.value === 0) {
      currentCameraIndex.value = findRearCamera(devices);
    }
    const deviceId = devices[currentCameraIndex.value].deviceId;

    codeReader.decodeFromVideoDevice(deviceId, videoElement, async (result: any, err: any) => {
      if (result && !processing.value) {
        const rawText = result.getText()?.trim?.() ?? "";
        if (rawText) {
             await processQrCodeData(rawText);
        }
      }
    });

  } catch (e) {
    console.error("Error starting scanner:", e);
    showCameraDeniedDialog.value = true;
  }
};

const processQrCodeData = async (qrContent: string) => {
    processing.value = true;
    stopScanner(); // Para o vídeo enquanto valida

    const cleanCode = qrContent.trim().replace(/^"|"$/g, '');

    try {
        const { data } = await axios.get(`/qr_code/validate/${cleanCode}`);

        if (data.valid) {
            if (data.is_full) {
                snackbar.value = { show: true, text: "This table is full!", color: "warning" };
                setTimeout(() => startScanner(), 2500); // Reinicia scan após aviso
            } else {
                // SUCESSO! Vai para o lobby com o ID do evento e da mesa
                goToLobby(data.events_fk, data.event_tables_pk);
            }
        } else {
            snackbar.value = { show: true, text: data.message || "Invalid or Expired QR Code", color: "error" };
            setTimeout(() => startScanner(), 2500);
        }

    } catch (error: any) {
        console.error("QR Validation Error:", error);
        const msg = error.response?.data?.message || "Error validating QR Code";
        snackbar.value = { show: true, text: msg, color: "error" };
        setTimeout(() => startScanner(), 2500);
    } finally {
        processing.value = false;
    }
};

const switchCamera = () => {
  if (availableCameras.value.length <= 1) return;
  codeReader.reset();
  currentCameraIndex.value = (currentCameraIndex.value + 1) % availableCameras.value.length;
  nextTick(() => startScanner());
};

const stopScanner = () => {
  codeReader.reset();
  availableCameras.value = [];
};

onBeforeUnmount(() => {
  codeReader.reset();
});
</script>

<style scoped>
.video-wrapper { 
    position: relative; 
    display: inline-block; 
    margin: 0 auto; 
    width: 100%;
    max-width: 280px;
    height: 280px; 
    border-radius: 12px; 
    overflow: hidden;
    background: #000;
    box-shadow: 0 0 20px rgba(0,0,0,0.5);
    border: 2px solid var(--v-theme-primary);
}

.qr-video { 
    width: 100%; 
    height: 100%; 
    object-fit: cover; 
}

.scan-overlay {
    position: absolute;
    top: 15%; left: 15%; right: 15%; bottom: 15%;
    border: 2px solid rgba(255,255,255,0.5);
    border-radius: 8px;
    box-shadow: 0 0 0 1000px rgba(0,0,0,0.4);
    pointer-events: none;
}

.processing-overlay {
    position: absolute;
    top: 0; left: 0; right: 0; bottom: 0;
    background: rgba(0,0,0,0.7);
    z-index: 20;
}

.camera-switch { 
    position: absolute !important; 
    top: 10px; 
    right: 10px; 
    background: rgba(0, 0, 0, 0.6) !important; 
    color: white !important; 
    z-index: 10; 
}

.scanner-container {
    animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
    from { opacity: 0; transform: translateY(-5px); }
    to { opacity: 1; transform: translateY(0); }
}
</style>