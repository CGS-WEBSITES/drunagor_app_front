<template>
  <v-card elevation="2" class="assembly-guide">
    <v-card-text class="pa-0">
      <v-sheet class="image-container" :class="isMobile ? 'pa-2' : 'pa-4'" color="black">
        <div class="image-wrapper" @click="openZoomDialog">
          <v-img
            :src="currentStepData.image"
            :alt="`Assembly step ${currentStep + 1}`"
            contain
            class="rounded assembly-image"
            :max-height="isMobile ? '45vh' : '55vh'"
          >
            <template v-slot:placeholder>
              <v-row class="fill-height ma-0" align="center" justify="center">
                <v-progress-circular
                  indeterminate
                  color="primary"
                ></v-progress-circular>
              </v-row>
            </template>
          </v-img>
          
          <div class="zoom-hint-container">
            <div class="zoom-hint">
              <v-icon color="white" size="x-small">mdi-magnify-plus</v-icon>
              <span class="text-caption ml-1">Tap to zoom</span>
            </div>
          </div>
        </div>
      </v-sheet>

      <v-sheet
        v-if="currentStepData.instruction"
        class="instruction-box"
        :class="isMobile ? 'pa-3' : 'pa-4 pa-md-6'"
        color="grey-darken-4"
      >
        <p :class="isMobile ? 'text-body-2' : 'text-body-1'" class="text-justify mb-0">
          {{ currentStepData.instruction }}
        </p>
      </v-sheet>

      <v-sheet class="navigation-bar pa-3 pa-sm-4" color="grey-darken-3">
        <template v-if="isMobile">
          <v-progress-linear
            :model-value="progressPercentage"
            color="primary"
            height="3"
            rounded
            class="mb-3"
          ></v-progress-linear>
          
          <div class="d-flex justify-space-between align-center">
            <v-btn
              :disabled="currentStep === 0"
              color="primary"
              variant="elevated"
              size="small"
              @click="previousStep"
            >
              <v-icon start size="small">mdi-chevron-left</v-icon>
              Prev
            </v-btn>
            
            <span class="text-body-2 font-weight-medium">
              {{ currentStep + 1 }} / {{ assemblySteps.length }}
            </span>
            
            <v-btn
              :disabled="currentStep === assemblySteps.length - 1"
              color="primary"
              variant="elevated"
              size="small"
              @click="nextStep"
            >
              Next
              <v-icon end size="small">mdi-chevron-right</v-icon>
            </v-btn>
          </div>
        </template>
        
        <template v-else>
          <v-row justify="space-between" align="center" no-gutters>
            <v-col cols="auto">
              <v-btn
                :disabled="currentStep === 0"
                color="primary"
                variant="elevated"
                size="large"
                @click="previousStep"
              >
                <v-icon start>mdi-chevron-left</v-icon>
                Previous
              </v-btn>
            </v-col>

            <v-col cols="auto" class="text-center">
              <div class="d-flex flex-column align-center">
                <span class="text-body-1 font-weight-medium mb-1">
                  Step {{ currentStep + 1 }} of {{ assemblySteps.length }}
                </span>
                <v-progress-linear
                  :model-value="progressPercentage"
                  color="primary"
                  height="4"
                  rounded
                  style="width: 150px"
                ></v-progress-linear>
              </div>
            </v-col>

            <v-col cols="auto">
              <v-btn
                :disabled="currentStep === assemblySteps.length - 1"
                color="primary"
                variant="elevated"
                size="large"
                @click="nextStep"
              >
                Next
                <v-icon end>mdi-chevron-right</v-icon>
              </v-btn>
            </v-col>
          </v-row>
        </template>
      </v-sheet>
    </v-card-text>
  </v-card>

  <v-dialog
    v-model="zoomDialog"
    :max-width="isMobile ? '100%' : '95vw'"
    :fullscreen="isMobile"
    :transition="isMobile ? 'dialog-bottom-transition' : 'fade-transition'"
  >
    <v-card color="black" class="zoom-dialog-card">
      <v-card-title class="d-flex justify-space-between align-center pa-2 pa-sm-3 zoom-header">
        <span class="text-body-2 text-grey-lighten-1">
          Step {{ currentStep + 1 }} / {{ assemblySteps.length }}
        </span>
        <v-btn
          icon
          variant="text"
          color="white"
          @click="closeZoomDialog"
          size="small"
        >
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>

      <v-card-text class="pa-0 zoom-content" ref="zoomContainer">
        <div 
          class="zoom-image-wrapper"
          @touchstart="handleTouchStart"
          @touchmove="handleTouchMove"
          @touchend="handleTouchEnd"
          @wheel="handleWheel"
          @dblclick="handleDoubleClick"
        >
          <img
            ref="zoomImage"
            :src="currentStepData.image"
            :alt="`Assembly step ${currentStep + 1}`"
            class="zoom-image"
            :style="zoomImageStyle"
            draggable="false"
          />
        </div>
        
        <div v-if="!isMobile" class="zoom-controls">
          <v-btn
            icon
            variant="tonal"
            color="white"
            size="small"
            @click="zoomOut"
            :disabled="zoomLevel <= 1"
          >
            <v-icon>mdi-minus</v-icon>
          </v-btn>
          <span class="text-body-2 mx-2">{{ Math.round(zoomLevel * 100) }}%</span>
          <v-btn
            icon
            variant="tonal"
            color="white"
            size="small"
            @click="zoomIn"
            :disabled="zoomLevel >= 4"
          >
            <v-icon>mdi-plus</v-icon>
          </v-btn>
        </div>
        
        <div v-if="isMobile && showZoomHint" class="mobile-zoom-hint">
          <v-icon size="small" color="white">mdi-gesture-pinch</v-icon>
          <span class="text-caption ml-1">Pinch to zoom • Double tap to reset</span>
        </div>
      </v-card-text>

      <v-card-actions class="pa-2 pa-sm-3 zoom-navigation">
        <v-btn
          :disabled="currentStep === 0"
          color="primary"
          variant="tonal"
          size="small"
          @click="previousStepInZoom"
        >
          <v-icon start size="small">mdi-chevron-left</v-icon>
          Prev
        </v-btn>
        
        <v-spacer></v-spacer>
        
        <v-btn
          :disabled="currentStep === assemblySteps.length - 1"
          color="primary"
          variant="tonal"
          size="small"
          @click="nextStepInZoom"
        >
          Next
          <v-icon end size="small">mdi-chevron-right</v-icon>
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from "vue";
import { useDisplay } from "vuetify";
import { assemblySteps } from "@/data/assembly/assembly";

const { mobile } = useDisplay();

const currentStep = ref(0);
const zoomDialog = ref(false);
const zoomLevel = ref(1);
const zoomPosition = ref({ x: 0, y: 0 });
const showZoomHint = ref(true);

// Touch handling
const lastTouchDistance = ref(0);
const lastTouchCenter = ref({ x: 0, y: 0 });
const isDragging = ref(false);
const dragStart = ref({ x: 0, y: 0 });

const isMobile = computed(() => mobile.value);

const currentStepData = computed(() => assemblySteps[currentStep.value]);

const progressPercentage = computed(() => 
  ((currentStep.value + 1) / assemblySteps.length) * 100
);

const zoomImageStyle = computed(() => ({
  transform: `scale(${zoomLevel.value}) translate(${zoomPosition.value.x}px, ${zoomPosition.value.y}px)`,
  transformOrigin: 'center center',
  transition: isDragging.value ? 'none' : 'transform 0.2s ease-out'
}));

const nextStep = () => {
  if (currentStep.value < assemblySteps.length - 1) {
    currentStep.value++;
    scrollToTop();
  }
};

const previousStep = () => {
  if (currentStep.value > 0) {
    currentStep.value--;
    scrollToTop();
  }
};

const nextStepInZoom = () => {
  if (currentStep.value < assemblySteps.length - 1) {
    currentStep.value++;
    resetZoom();
  }
};

const previousStepInZoom = () => {
  if (currentStep.value > 0) {
    currentStep.value--;
    resetZoom();
  }
};

const scrollToTop = () => {
  const dialogContent = document.querySelector('.v-dialog .v-card-text');
  if (dialogContent) {
    dialogContent.scrollTo({ top: 0, behavior: 'smooth' });
  }
};

const openZoomDialog = () => {
  zoomDialog.value = true;
  resetZoom();
  showZoomHint.value = true;
  setTimeout(() => {
    showZoomHint.value = false;
  }, 3000);
};

const closeZoomDialog = () => {
  zoomDialog.value = false;
  resetZoom();
};

const resetZoom = () => {
  zoomLevel.value = 1;
  zoomPosition.value = { x: 0, y: 0 };
};

const zoomIn = () => {
  if (zoomLevel.value < 4) {
    zoomLevel.value = Math.min(4, zoomLevel.value + 0.5);
  }
};

const zoomOut = () => {
  if (zoomLevel.value > 1) {
    zoomLevel.value = Math.max(1, zoomLevel.value - 0.5);
    if (zoomLevel.value === 1) {
      zoomPosition.value = { x: 0, y: 0 };
    }
  }
};

const getTouchDistance = (touches) => {
  if (touches.length < 2) return 0;
  const dx = touches[0].clientX - touches[1].clientX;
  const dy = touches[0].clientY - touches[1].clientY;
  return Math.sqrt(dx * dx + dy * dy);
};

const getTouchCenter = (touches) => {
  if (touches.length < 2) {
    return { x: touches[0].clientX, y: touches[0].clientY };
  }
  return {
    x: (touches[0].clientX + touches[1].clientX) / 2,
    y: (touches[0].clientY + touches[1].clientY) / 2
  };
};

const handleTouchStart = (e) => {
  if (e.touches.length === 2) {
    e.preventDefault();
    lastTouchDistance.value = getTouchDistance(e.touches);
    lastTouchCenter.value = getTouchCenter(e.touches);
  } else if (e.touches.length === 1 && zoomLevel.value > 1) {
    isDragging.value = true;
    dragStart.value = {
      x: e.touches[0].clientX - zoomPosition.value.x * zoomLevel.value,
      y: e.touches[0].clientY - zoomPosition.value.y * zoomLevel.value
    };
  }
};

const handleTouchMove = (e) => {
  if (e.touches.length === 2) {
    e.preventDefault();
    const newDistance = getTouchDistance(e.touches);
    const scale = newDistance / lastTouchDistance.value;
    
    let newZoom = zoomLevel.value * scale;
    newZoom = Math.max(1, Math.min(4, newZoom));
    
    zoomLevel.value = newZoom;
    lastTouchDistance.value = newDistance;
    
    if (newZoom === 1) {
      zoomPosition.value = { x: 0, y: 0 };
    }
  } else if (e.touches.length === 1 && isDragging.value && zoomLevel.value > 1) {
    e.preventDefault();
    const maxOffset = (zoomLevel.value - 1) * 100;
    
    let newX = (e.touches[0].clientX - dragStart.value.x) / zoomLevel.value;
    let newY = (e.touches[0].clientY - dragStart.value.y) / zoomLevel.value;
    
    newX = Math.max(-maxOffset, Math.min(maxOffset, newX));
    newY = Math.max(-maxOffset, Math.min(maxOffset, newY));
    
    zoomPosition.value = { x: newX, y: newY };
  }
};

const handleTouchEnd = () => {
  isDragging.value = false;
  lastTouchDistance.value = 0;
};

const handleWheel = (e) => {
  e.preventDefault();
  const delta = e.deltaY > 0 ? -0.1 : 0.1;
  let newZoom = zoomLevel.value + delta;
  newZoom = Math.max(1, Math.min(4, newZoom));
  zoomLevel.value = newZoom;
  
  if (newZoom === 1) {
    zoomPosition.value = { x: 0, y: 0 };
  }
};

const handleDoubleClick = () => {
  if (zoomLevel.value > 1) {
    resetZoom();
  } else {
    zoomLevel.value = 2;
  }
};

const handleKeyPress = (event) => {
  if (event.key === "ArrowLeft") {
    if (zoomDialog.value) {
      previousStepInZoom();
    } else {
      previousStep();
    }
  } else if (event.key === "ArrowRight") {
    if (zoomDialog.value) {
      nextStepInZoom();
    } else {
      nextStep();
    }
  } else if (event.key === "Escape" && zoomDialog.value) {
    closeZoomDialog();
  }
};

watch(currentStep, () => {
  if (zoomDialog.value) {
    resetZoom();
  }
});

onMounted(() => {
  window.addEventListener("keydown", handleKeyPress);
});

onUnmounted(() => {
  window.removeEventListener("keydown", handleKeyPress);
});
</script>

<style scoped>
.assembly-guide {
  max-width: 100%;
  margin: 0 auto;
  background-color: #1e1e1e;
}

.image-container {
  position: relative;
}

.image-wrapper {
  position: relative;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.assembly-image {
  width: 100%;
  background-color: #000;
}

.zoom-hint-container {
  width: 100%;
  display: flex;
  justify-content: flex-end;
  margin-top: 8px;
}

.zoom-hint {
  background-color: rgba(255, 255, 255, 0.15);
  padding: 4px 10px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  color: rgba(255, 255, 255, 0.8);
}

.zoom-hint:hover {
  background-color: rgba(255, 255, 255, 0.25);
}

.instruction-box {
  min-height: 60px;
  border-top: 2px solid rgba(255, 255, 255, 0.1);
}

.navigation-bar {
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.zoom-dialog-card {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.zoom-header {
  flex-shrink: 0;
  background-color: rgba(0, 0, 0, 0.95);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.zoom-content {
  flex: 1;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  touch-action: none;
  background-color: #000;
}

.zoom-image-wrapper {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.zoom-image {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  user-select: none;
  -webkit-user-drag: none;
}

.zoom-controls {
  position: absolute;
  bottom: 16px;
  left: 50%;
  transform: translateX(-50%);
  background-color: rgba(0, 0, 0, 0.8);
  padding: 8px 16px;
  border-radius: 24px;
  display: flex;
  align-items: center;
}

.mobile-zoom-hint {
  position: absolute;
  bottom: 16px;
  left: 50%;
  transform: translateX(-50%);
  background-color: rgba(0, 0, 0, 0.8);
  padding: 8px 16px;
  border-radius: 24px;
  display: flex;
  align-items: center;
  color: white;
  animation: fadeInOut 3s ease-in-out forwards;
}

@keyframes fadeInOut {
  0% { opacity: 0; }
  15% { opacity: 1; }
  85% { opacity: 1; }
  100% { opacity: 0; }
}

.zoom-navigation {
  flex-shrink: 0;
  background-color: rgba(0, 0, 0, 0.95);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.navigation-bar :deep(.v-btn--disabled) {
  opacity: 0.3 !important;
}

.zoom-navigation :deep(.v-btn--disabled) {
  opacity: 0.3 !important;
}

@media (max-width: 600px) {
  .zoom-hint {
    padding: 3px 8px;
  }
  
  .zoom-hint .text-caption {
    font-size: 0.7rem !important;
  }
  
  .instruction-box {
    min-height: 50px;
  }
  
  .zoom-image-wrapper {
    padding: 4px;
  }
}

@media (min-width: 601px) and (max-width: 960px) {
  .zoom-hint-container {
    margin-top: 12px;
  }
  </style>