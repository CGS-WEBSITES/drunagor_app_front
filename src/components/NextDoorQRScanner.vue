<template>
  <div class="next-door-scanner">
    <v-container class="fill-height pa-0" fluid>
      <v-row no-gutters class="fill-height align-center justify-center">
        
        <v-col cols="6" md="6" class="d-flex justify-center align-center pa-4">
          <div class="video-wrapper">
            <video id="nd-qr-video" class="qr-video" autoplay muted playsinline />
            <v-btn
              v-if="isCameraSwitchVisible"
              @click="switchCamera"
              icon="mdi-camera-flip"
              size="small"
              class="camera-switch"
              variant="flat"
              :disabled="isProcessing"
            />
            <div class="scan-overlay" :class="{ 'scanning-success': isProcessing }"></div>
          </div>
        </v-col>

        <v-col cols="6" md="6" class="d-flex flex-column justify-center align-center pa-4">
          <div class="text-h5 font-weight-bold text-white mb-2 text-center">
            Scan Door Card
          </div>
          <div class="text-body-2 text-grey-lighten-1 mb-6 text-center" style="max-width: 300px;">
            Point your camera at the QR Code found on the Door card to advance.
          </div>

          <v-divider class="w-75 mb-6 border-opacity-25"></v-divider>
        </v-col>
      </v-row>
    </v-container>

    <v-dialog v-model="showCameraDeniedDialog" max-width="400">
      <v-card class="bg-grey-darken-3">
        <v-card-title>Camera Required</v-card-title>
        <v-card-text>Please enable camera access to scan the door QR code.</v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="primary" @click="showCameraDeniedDialog = false">OK</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue';
import { BrowserMultiFormatReader, BarcodeFormat, DecodeHintType } from '@zxing/library';

const emit = defineEmits(['scanned', 'manual-advance']);

const codeReader = new BrowserMultiFormatReader(undefined, 400);
const zxingHints = new Map();
zxingHints.set(DecodeHintType.POSSIBLE_FORMATS, [BarcodeFormat.QR_CODE]);
zxingHints.set(DecodeHintType.TRY_HARDER, true);
(codeReader as any).hints = zxingHints;

const availableCameras = ref<MediaDeviceInfo[]>([]);
const currentCameraIndex = ref(0);
const isCameraSwitchVisible = ref(false);
const showCameraDeniedDialog = ref(false);
const isMounted = ref(false);
const isProcessing = ref(false); // Evita ler múltiplos QRs seguidos
let activeStream: MediaStream | null = null;

const stopCamera = () => {
  codeReader.reset();

  if (activeStream) {
    activeStream.getTracks().forEach(track => track.stop());
    activeStream = null;
  }

  const videoElement = document.getElementById('nd-qr-video') as HTMLVideoElement;
  if (videoElement && videoElement.srcObject) {
    const stream = videoElement.srcObject as MediaStream;
    stream.getTracks().forEach(track => track.stop());
    videoElement.srcObject = null;
  }
};

const startScanner = async () => {
  try {
    stopCamera();
    await nextTick();
    
    if (!isMounted.value) return;

    const videoElement = document.getElementById('nd-qr-video') as HTMLVideoElement;
    if (!videoElement) return;

    const devices = await codeReader.listVideoInputDevices();
    if (!devices.length) return;

    availableCameras.value = devices;
    isCameraSwitchVisible.value = devices.length > 1;

    const rearIndex = devices.findIndex(d => d.label.toLowerCase().includes('back') || d.label.toLowerCase().includes('rear') || d.label.toLowerCase().includes('environment'));
    currentCameraIndex.value = rearIndex >= 0 ? rearIndex : devices.length - 1;

    const deviceId = devices[currentCameraIndex.value].deviceId;

    if (!isMounted.value) return;

    await codeReader.decodeFromVideoDevice(deviceId, videoElement, (result) => {
      if (!isMounted.value) {
        stopCamera();
        return;
      }
      if (result && !isProcessing.value) {
        const text = result.getText().trim();
        if (text) {
          isProcessing.value = true; // Trava o leitor
          stopCamera(); 
          emit('scanned', text);
        }
      }
    });

    if (videoElement.srcObject) {
      activeStream = videoElement.srcObject as MediaStream;
    }

    if (!isMounted.value) {
      stopCamera();
    }

  } catch (e) {
    console.error("Scanner error", e);
    if (isMounted.value) {
      showCameraDeniedDialog.value = true;
    }
  }
};

const switchCamera = () => {
  if (availableCameras.value.length <= 1 || isProcessing.value) return;
  stopCamera();
  currentCameraIndex.value = (currentCameraIndex.value + 1) % availableCameras.value.length;
  nextTick(() => startScanner());
};

onMounted(() => { 
  isMounted.value = true;
  startScanner(); 
});

onBeforeUnmount(() => { 
  isMounted.value = false;
  stopCamera(); 
});
</script>

<style scoped>
.next-door-scanner {
  background-color: #121212;
  color: white;
  height: 100%;
  width: 100%;
  overflow: hidden;
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

.scanning-success {
  border-color: rgba(76, 175, 80, 0.8) !important;
  background: rgba(76, 175, 80, 0.2);
  transition: all 0.3s ease;
}

@media (max-width: 600px) {
  .video-wrapper {
    max-width: 240px; 
  }
}

.qr-video {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.scan-overlay {
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  border: 40px solid rgba(0,0,0,0.3);
  pointer-events: none;
}

.camera-switch {
  position: absolute;
  top: 10px;
  right: 10px;
  background: rgba(0,0,0,0.6);
  color: white;
  z-index: 10;
}
</style>