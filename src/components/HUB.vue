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
          {{ scanning ? 'SCAN QR CODE' : 'SELECT EVENT' }}
        </v-toolbar-title>
        <v-btn icon @click="closeDialog" density="compact" color="white">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>

      <v-card-text class="pa-4" style="overflow-y: auto;">
        
        <div v-if="scanning" class="scanner-container text-center">
            
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
            </div>
            
            <p class="text-caption text-grey-lighten-1 mb-4 font-weight-medium">
               Point your camera at the <span class="text-white font-weight-bold">Event QR Code</span>
            </p>

            <div>
                <div class="d-flex align-center w-100 mb-4">
                    <v-divider color="grey-darken-2"></v-divider>
                    <span class="mx-3 text-caption font-weight-bold text-grey">OR</span>
                    <v-divider color="grey-darken-2"></v-divider>
                </div>

                <v-btn 
                    block 
                    size="large" 
                    color="surface-variant" 
                    variant="flat" 
                    @click="switchToListView"
                    class="font-weight-bold"
                >
                    <v-icon start>mdi-sword-cross</v-icon>
                      play My Upcoming Events
                </v-btn>
            </div>
        </div>

        <div v-else class="d-flex flex-column">
          
          <div class="w-100 mb-4">
            <template v-if="displayEvents.length > 0">
              <v-card
                v-for="event in displayEvents"
                :key="event.events_pk"
                class="mb-3 event-card"
                color="#FFFFFF" 
                elevation="2"
                @click="goToLobby(event.events_pk)"
                rounded="lg"
              >
                <v-row no-gutters align="center">
                    <v-col cols="3" class="d-flex flex-column align-center justify-center py-2  border-e">
                        <span class="text-caption font-weight-bold text-uppercase pt-1" style="font-size: 0.65rem;">
                            {{ new Date(event.event_date).toLocaleDateString('en-US',{month:'short'}) }}
                        </span>
                        <span class="cinzel-text text-h5 font-weight-bold text-black" style="line-height: 1;">
                            {{ new Date(event.event_date).getDate() }}
                        </span>
                        <span class="text-caption font-weight-bold text-black" style="font-size: 0.7rem;">
                            {{ new Date(event.event_date).toLocaleTimeString('en-US',{hour:'2-digit',minute:'2-digit',hour12:true}) }}
                        </span>
                    </v-col>

                    <v-col cols="9" class="pl-3 py-2 d-flex flex-column justify-center">
                        <h3 class="text-subtitle-2 font-weight-bold text-truncate text-black mb-0 d-flex align-center">
                            <v-icon size="x-small" color="black" class="mr-1">mdi-chess-rook</v-icon>
                            {{ event.store_name }}
                        </h3>

                        <p class="text-caption text-truncate mb-0">
                            <v-icon size="x-small" color="red" class="mr-1">mdi-map-marker</v-icon>
                            {{ event.address || 'Unknown Location' }}
                        </p>

                        <p class="text-caption text-black   mb-0">
                             <v-icon size="x-small" class="mr-1" color="red">mdi-sword-cross</v-icon>
                             {{ event.scenario || 'Wing Unknown' }}
                        </p>
                    </v-col>
                </v-row>
              </v-card>
            </template>
            
            <div v-else class="text-center pa-6 border-dashed rounded text-grey">
              No scheduled events found.
            </div>
          </div>

          <v-btn
            block
            size="large"
            color="primary"
            variant="flat"
            class="mb-2 font-weight-bold text-white"
            @click="switchToScannerView"
          >
            <v-icon start>mdi-qrcode-scan</v-icon>
            Back to Scanner
          </v-btn>
          
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
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, computed, nextTick, onBeforeUnmount, watch } from 'vue';
import { useRouter } from 'vue-router';
import {
  BrowserMultiFormatReader,
  BarcodeFormat,
  DecodeHintType,
} from "@zxing/library";

const props = defineProps<{
  modelValue: boolean;
  myEvents: any[];
  user: any;
}>();

const emit = defineEmits(['update:modelValue']);
const router = useRouter();

const scanning = ref(true); 
const showCameraDeniedDialog = ref(false);

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
          scanning.value = true;
          startScanner();
      } else {
          stopScanner();
      }
  }
});

const displayEvents = computed(() => {
    if (props.myEvents && props.myEvents.length > 0) {
        const futureEvents = props.myEvents.filter((e: any) => new Date(e.event_date) >= new Date(new Date().setHours(0,0,0,0)));
        return futureEvents.sort((a: any, b: any) => new Date(a.event_date).getTime() - new Date(b.event_date).getTime());
    }
    return [];
});

watch(() => props.modelValue, (val) => {
    if(val) {
        scanning.value = true;
        startScanner();
    } else {
        stopScanner();
    }
});

const closeDialog = () => dialog.value = false;

const switchToListView = () => {
    stopScanner(); 
    scanning.value = false; 
};

const switchToScannerView = () => {
    scanning.value = true;
    startScanner(); 
};

const goToLobby = (eventIdOrJwt: string) => {
    stopScanner();
    dialog.value = false;
    router.push({ name: 'Lobby', params: { id: eventIdOrJwt } });
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
      console.warn("No cameras found");
      return;
    }

    availableCameras.value = devices;
    isCameraSwitchVisible.value = devices.length > 1;

    if (currentCameraIndex.value >= devices.length || currentCameraIndex.value === 0) {
      currentCameraIndex.value = findRearCamera(devices);
    }
    const deviceId = devices[currentCameraIndex.value].deviceId;

    codeReader.decodeFromVideoDevice(deviceId, videoElement, (result: any, err: any) => {
      if (result) {
        const rawText = result.getText()?.trim?.() ?? "";
        if (rawText) {
             goToLobby(rawText);
        }
      }
    });

  } catch (e) {
    console.error("Error starting scanner:", e);
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
.cinzel-text { font-family: "Cinzel", serif; }

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

.camera-switch { 
    position: absolute !important; 
    top: 10px; 
    right: 10px; 
    background: rgba(0, 0, 0, 0.6) !important; 
    color: white !important; 
    z-index: 10; 
}

.event-card {
    border: 1px solid rgba(0,0,0,0.05);
    transition: transform 0.1s, box-shadow 0.1s;
}
.event-card:active {
    transform: scale(0.99);
}

.border-dashed {
    border: 1px dashed rgba(255,255,255,0.2) !important;
}

.scanner-container {
    animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
    from { opacity: 0; transform: translateY(-5px); }
    to { opacity: 1; transform: translateY(0); }
}
</style>