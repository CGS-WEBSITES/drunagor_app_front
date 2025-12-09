<template>
  <v-dialog
    v-model="dialog"
    max-width="500"
    transition="dialog-bottom-transition"
    class="hub-dialog"
  >
    <v-card color="#121212" class="rounded-lg">
      <v-toolbar color="transparent" density="compact" class="border-b border-opacity-25 pl-2 pr-2">
        <v-toolbar-title class="text-subtitle-1 font-weight-bold text-white">
          SELECT MATCH
        </v-toolbar-title>
        <v-btn icon @click="closeDialog" density="compact" color="white">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>

      <v-card-text class="pa-4">
        <div v-if="scanning" class="scanner-container text-center">
            <div class="video-wrapper">
                <video id="qr-video" class="qr-video" autoplay muted playsinline />
                <v-btn
                  v-if="isCameraSwitchVisible"
                  @click="switchCamera"
                  icon="mdi-camera-flip"
                  size="small"
                  class="camera-switch"
                  :title="'Flip camera'"
                />
            </div>
            <p class="text-caption text-grey mb-4">Point your camera at the Event QR Code</p>
            <v-btn block color="red-darken-1" variant="outlined" @click="stopScanner">
                Cancel Scan
            </v-btn>
        </div>

        <div v-else class="d-flex flex-column">
          
          <div class="w-100 mb-4">
            <template v-if="displayEvents.length > 0">
              <v-card
                v-for="event in displayEvents"
                :key="event.events_pk"
                class="mb-3 event-card"
                color="#e0e0e0" 
                elevation="0"
                @click="goToLobby(event.events_pk)"
                rounded="lg"
              >
                <v-row no-gutters align="center">
                  <v-col cols="3" class="d-flex flex-column align-center justify-center py-3 border-e border-grey-lighten-1">
                    <span class="text-caption font-weight-bold text-grey-darken-2 text-uppercase">
                      {{ new Date(event.event_date).toLocaleDateString('en-US',{month:'short'}) }}
                    </span>
                    <span class="cinzel-text text-h4 font-weight-bold text-black" style="line-height: 1;">
                      {{ new Date(event.event_date).getDate() }}
                    </span>
                    <span class="text-caption font-weight-bold text-black">
                      {{ new Date(event.event_date).toLocaleTimeString('en-US',{hour:'2-digit',minute:'2-digit',hour12:true}) }}
                    </span>
                  </v-col>

                  <v-col cols="9" class="pl-4 py-2">
                    <h3 class="text-subtitle-1 font-weight-bold text-truncate pr-2 mb-0 text-black">
                      <v-icon size="x-small" color="black" class="mr-1">mdi-chess-rook</v-icon>
                      {{ event.store_name }}
                    </h3>
                    <div class="text-caption text-truncate text-grey-darken-3">
                      <v-icon size="x-small" color="red" class="mr-1">mdi-map-marker</v-icon>
                      {{ event.address || 'Unknown Location' }}
                    </div>
                  </v-col>
                </v-row>
              </v-card>
            </template>
            
            <div v-else class="text-center pa-6 text-grey-lighten-1">
              <v-icon size="64" color="grey-darken-2" class="mb-4">mdi-calendar-remove</v-icon>
              <h3 class="text-h6 font-weight-bold mb-2">No Active Events</h3>
              <p class="text-body-2 mb-4">
                You are not currently checked into any event. 
                <br>Please join an event via the <strong>Events List</strong> or scan a <strong>QR Code</strong> at the venue.
              </p>
            </div>
          </div>

          <div class="d-flex align-center w-100 mb-4">
            <v-divider color="grey-darken-2"></v-divider>
            <span class="mx-3 text-caption font-weight-bold text-grey">OR</span>
            <v-divider color="grey-darken-2"></v-divider>
          </div>

          <v-btn
            block
            size="large"
            color="primary"
            variant="flat"
            class="mb-2 font-weight-bold text-white"
            @click="startScanner"
          >
            <v-icon start>mdi-qrcode-scan</v-icon>
            SCAN QR CODE
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
import { ref, computed, nextTick, onBeforeUnmount } from 'vue';
import { useRouter } from 'vue-router';
import {
  BrowserMultiFormatReader,
  BarcodeFormat,
  DecodeHintType,
  NotFoundException,
} from "@zxing/library";

const props = defineProps<{
    modelValue: boolean;
    myEvents: any[];
    user: any;
}>();

const emit = defineEmits(['update:modelValue']);
const router = useRouter();

// --- Estados UI ---
const scanning = ref(false);
const showCameraDeniedDialog = ref(false);

// --- Estados ZXing ---
const codeReader = new BrowserMultiFormatReader(undefined, 400);
const zxingHints = new Map();
zxingHints.set(DecodeHintType.POSSIBLE_FORMATS, [BarcodeFormat.QR_CODE]);
zxingHints.set(DecodeHintType.TRY_HARDER, true);
(codeReader as any).hints = zxingHints;

const availableCameras = ref<MediaDeviceInfo[]>([]);
const currentCameraIndex = ref(0);
const isCameraSwitchVisible = ref(false);

// --- Computed ---
const dialog = computed({
  get: () => props.modelValue,
  set: (val) => {
      emit('update:modelValue', val);
      if (!val) stopScanner();
  }
});

const displayEvents = computed(() => {
    if (props.myEvents && props.myEvents.length > 0) return props.myEvents;
    return [];
});

// --- Métodos de Navegação ---
const closeDialog = () => dialog.value = false;

const goToLobby = (eventIdOrJwt: string) => {
    stopScanner();
    dialog.value = false;
    router.push({ name: 'Lobby', params: { id: eventIdOrJwt } });
};

// --- Métodos do Scanner ---
const findRearCamera = (devices: MediaDeviceInfo[]): number => {
  const rearKeywords = ["back", "rear", "environment", "world", "traseira"];
  for (let i = 0; i < devices.length; i++) {
    const label = devices[i].label?.toLowerCase?.() || "";
    if (rearKeywords.some((k) => label.includes(k))) return i;
  }
  return devices.length > 1 ? devices.length - 1 : 0;
};

const startScanner = async () => {
  scanning.value = true;
  await nextTick();

  try {
    const videoElement = document.getElementById("qr-video") as HTMLVideoElement | null;
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
      if (err && !(err instanceof NotFoundException)) {
         // console.error(err);
      }
    });

  } catch (e) {
    console.error("Error starting scanner:", e);
    showCameraDeniedDialog.value = true;
    scanning.value = false;
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
  scanning.value = false;
  availableCameras.value = [];
};

onBeforeUnmount(() => {
  codeReader.reset();
});
</script>

<style scoped>
.cinzel-text { font-family: "Cinzel", serif; }
.video-wrapper { position: relative; display: inline-block; margin: 0 auto; max-width: 100%; }
.qr-video { width: 100%; max-width: 300px; height: 300px; object-fit: cover; border-radius: 12px; border: 2px solid var(--v-theme-primary); background: #000; box-shadow: 0 0 20px rgba(0,0,0,0.5); }
.camera-switch { position: absolute !important; top: 10px; right: 10px; background: rgba(0, 0, 0, 0.6) !important; color: white !important; z-index: 10; }
.scanner-container { animation: fadeIn 0.3s ease-in-out; }
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
</style>