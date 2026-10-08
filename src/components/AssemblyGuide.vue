<template>
  <div class="guide">
    <!-- Where you are -->
    <header class="guide__head">
      <div class="guide__steps" :style="{ '--steps': steps.length }">
        <button
          v-for="(step, index) in steps"
          :key="index"
          class="guide__step"
          :class="{ done: index < currentStep, current: index === currentStep }"
          :aria-label="`Step ${index + 1}`"
          @click="goToStep(index)"
        ></button>
      </div>
      <div class="guide__title">
        <span class="guide__count">{{ currentStep + 1 }}/{{ steps.length }}</span>
        <h3>{{ currentStepData.title || `Step ${currentStep + 1}` }}</h3>
      </div>
    </header>

    <!-- Picture -->
    <div class="guide__media" :class="{ 'guide__media--empty': !currentStepData.image }" @click="currentStepData.image && openZoomDialog()">
      <template v-if="currentStepData.image">
        <img :src="currentStepData.image" :alt="currentStepData.title || `Step ${currentStep + 1}`" />
        <span class="guide__zoom"><v-icon size="18">mdi-magnify-plus-outline</v-icon></span>
      </template>
      <template v-else>
        <v-icon size="40">mdi-image-outline</v-icon>
        <span>Image coming soon</span>
      </template>
    </div>

    <!-- Text -->
    <div class="guide__text html-instruction" v-html="currentStepData.instruction" @click="handleInstructionClick"></div>

    <!-- Navigation -->
    <nav class="guide__nav">
      <button class="guide__prev" :disabled="currentStep === 0" aria-label="Previous step" @click="previousStep">
        <v-icon>mdi-chevron-left</v-icon>
      </button>
      <button v-if="showFinish" class="guide__next guide__next--finish" @click="emit('finish')">
        {{ finishLabel }} <v-icon size="20">mdi-check</v-icon>
      </button>
      <button v-else class="guide__next" :disabled="isLastStep" @click="nextStep">
        <span class="guide__next-label">
          <small v-if="!isLastStep && steps[currentStep + 1]?.title">Next</small>
          {{ isLastStep ? "Done" : steps[currentStep + 1]?.title || "Next" }}
        </span>
        <v-icon size="20">mdi-chevron-right</v-icon>
      </button>
    </nav>
  </div>

  <v-dialog
    v-model="zoomDialog"
    :max-width="isMobile ? '100%' : '95vw'"
    :fullscreen="isMobile"
    :transition="isMobile ? 'dialog-bottom-transition' : 'fade-transition'"
  >
    <v-card color="black" class="zoom-dialog-card">
      <v-card-title
        class="d-flex justify-space-between align-center pa-2 pa-sm-3 zoom-header"
      >
        <span class="text-body-2 text-grey-lighten-1">
          Step {{ currentStep + 1 }} / {{ steps.length }}
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
            :src="zoomImageUrl || currentStepData.image"
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
          <span class="text-body-2 mx-2"
            >{{ Math.round(zoomLevel * 100) }}%</span
          >
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
          <span class="text-caption ml-1"
            >Pinch to zoom • Double tap to reset</span
          >
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
          :disabled="currentStep === steps.length - 1"
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

const props = defineProps({
  steps: { type: Array, default: () => assemblySteps },
  // When set, the last step shows this button instead of a disabled Next.
  finishLabel: { type: String, default: "" },
});

const emit = defineEmits(["finish"]);

const { mobile } = useDisplay();

const currentStep = ref(0);
const zoomDialog = ref(false);
const zoomImageUrl = ref("");
const zoomLevel = ref(1);
const zoomPosition = ref({ x: 0, y: 0 });
const showZoomHint = ref(true);

// Touch handling
const lastTouchDistance = ref(0);
const lastTouchCenter = ref({ x: 0, y: 0 });
const isDragging = ref(false);
const dragStart = ref({ x: 0, y: 0 });

const isMobile = computed(() => mobile.value);

const currentStepData = computed(() => props.steps[currentStep.value]);

const isLastStep = computed(() => currentStep.value === props.steps.length - 1);
const showFinish = computed(() => isLastStep.value && !!props.finishLabel);

const progressPercentage = computed(
  () => ((currentStep.value + 1) / props.steps.length) * 100,
);

const zoomImageStyle = computed(() => ({
  transform: `scale(${zoomLevel.value}) translate(${zoomPosition.value.x}px, ${zoomPosition.value.y}px)`,
  transformOrigin: "center center",
  transition: isDragging.value ? "none" : "transform 0.2s ease-out",
}));

const goToStep = (index) => {
  currentStep.value = index;
  scrollToTop();
};

const nextStep = () => {
  if (currentStep.value < props.steps.length - 1) {
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
  if (currentStep.value < props.steps.length - 1) {
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
  document.querySelectorAll(".guide__text").forEach((el) => (el.scrollTop = 0));
  const dialogContent = document.querySelector(".v-dialog .v-card-text");
  if (dialogContent) {
    dialogContent.scrollTo({ top: 0, behavior: "smooth" });
  }
};

const openZoomDialog = (url = null) => {
  zoomImageUrl.value = typeof url === 'string' ? url : currentStepData.value.image;
  zoomDialog.value = true;
  resetZoom();
  showZoomHint.value = true;
  setTimeout(() => {
    showZoomHint.value = false;
  }, 3000);
};

const handleInstructionClick = (event) => {
  const target = event.target;
  if (target.tagName === 'IMG') {
    openZoomDialog(target.src);
  }
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
    y: (touches[0].clientY + touches[1].clientY) / 2,
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
      y: e.touches[0].clientY - zoomPosition.value.y * zoomLevel.value,
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
  } else if (
    e.touches.length === 1 &&
    isDragging.value &&
    zoomLevel.value > 1
  ) {
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
    zoomImageUrl.value = currentStepData.value.image;
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

/* Fixed heights so the card never resizes and Next stays in place. */
.image-container {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 260px;
}

.image-placeholder {
  height: 100%;
  border: 2px dashed rgba(255, 255, 255, 0.2);
}

.step-title {
  color: rgb(var(--v-theme-accent));
  font-size: 1.1rem;
  font-weight: 700;
  letter-spacing: 0.5px;
  text-transform: uppercase;
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
  height: 180px;
  overflow-y: auto;
  border-top: 2px solid rgba(255, 255, 255, 0.1);
}

.instruction-box :deep(img) {
  max-width: 100%;
  height: auto;
  display: block;
  margin: 16px auto;
  border-radius: 4px;
  box-shadow: 0 4px 8px rgba(0,0,0,0.3);
  cursor: zoom-in;
  transition: transform 0.2s ease;
}

.instruction-box :deep(img):hover {
  transform: scale(1.02);
}

.instruction-box :deep(p) {
  margin-bottom: 12px;
}

.instruction-box :deep(ul) {
  margin-left: 20px;
  margin-bottom: 12px;
}

.instruction-box :deep(li) {
  margin-bottom: 6px;
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
  0% {
    opacity: 0;
  }
  15% {
    opacity: 1;
  }
  85% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
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

  .image-container {
    height: 230px;
  }
  .instruction-box {
    height: 200px;
  }

  .zoom-image-wrapper {
    padding: 4px;
  }
}

@media (min-width: 601px) and (max-width: 960px) {
  .zoom-hint-container {
    margin-top: 12px;
  }
}

/* Same type as the rest of the app. */
.assembly-guide {
  font-family: "Poppins", sans-serif;
}
.html-instruction,
.html-instruction :deep(p),
.html-instruction :deep(li) {
  font-family: "Poppins", sans-serif;
  font-size: 0.95rem;
  line-height: 1.65;
  color: rgba(255, 255, 255, 0.87);
}
.html-instruction :deep(em) {
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.85rem;
}
.html-instruction :deep(strong) {
  color: #fff;
}

/* Guide */
.guide {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: rgb(var(--v-theme-surface));
  border-radius: 14px;
  font-family: "Poppins", sans-serif;
}
.guide__head {
  padding: 14px 16px 10px;
}
.guide__steps {
  display: grid;
  grid-template-columns: repeat(var(--steps), minmax(0, 1fr));
  gap: 4px;
  margin-bottom: 12px;
}
.guide__step {
  height: 5px;
  background: rgba(var(--v-theme-on-surface), 0.15);
  border-radius: 999px;
  transition: background 0.2s ease;
}
.guide__step.done {
  background: rgba(var(--v-theme-accent), 0.55);
}
.guide__step.current {
  background: rgb(var(--v-theme-accent));
}
.guide__title {
  display: flex;
  align-items: baseline;
  gap: 10px;
}
.guide__count {
  flex-shrink: 0;
  font-size: 0.75rem;
  font-weight: 800;
  opacity: 0.6;
}
.guide__title h3 {
  overflow: hidden;
  font-size: 1.05rem;
  font-weight: 800;
  line-height: 1.3;
  text-overflow: ellipsis;
  white-space: nowrap;
}
/* The picture keeps one height so the buttons never move. */
.guide__media {
  position: relative;
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  height: clamp(200px, 38vh, 340px);
  margin: 0 12px;
  overflow: hidden;
  background: radial-gradient(circle at center, #1d1d1d 0%, #0b0b0b 100%);
  border-radius: 12px;
  cursor: zoom-in;
}
.guide__media img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}
.guide__media--empty {
  flex-direction: column;
  gap: 6px;
  border: 2px dashed rgba(255, 255, 255, 0.15);
  cursor: default;
  font-size: 0.8rem;
  opacity: 0.6;
}
.guide__zoom {
  position: absolute;
  right: 10px;
  bottom: 10px;
  display: grid;
  place-items: center;
  width: 34px;
  height: 34px;
  background: rgba(0, 0, 0, 0.7);
  border-radius: 50%;
  color: #fff;
}
.guide__text {
  flex-shrink: 0;
  height: 170px;
  overflow-y: auto;
  padding: 14px 16px 6px;
}
.guide__text :deep(p:last-child) {
  margin-bottom: 0;
}
.guide__text :deep(p) {
  margin-bottom: 10px;
}
.guide__text :deep(ul) {
  margin: 0 0 10px 20px;
}
.guide__text :deep(img) {
  display: block;
  max-width: 100%;
  height: auto;
  margin: 12px auto;
  border-radius: 6px;
  cursor: zoom-in;
}
.guide__nav {
  display: flex;
  gap: 8px;
  padding: 10px 12px 12px;
  border-top: 1px solid rgba(var(--v-theme-on-surface), 0.08);
}
.guide__prev {
  display: grid;
  flex-shrink: 0;
  place-items: center;
  width: 52px;
  height: 50px;
  background: rgb(var(--v-theme-secondary));
  border-radius: 12px;
}
.guide__next {
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  min-width: 0;
  height: 50px;
  padding: 0 14px 0 18px;
  background: rgb(var(--v-theme-playbutton));
  border-radius: 12px;
  color: rgb(var(--v-theme-on-playbutton));
  font-weight: 800;
  text-align: left;
}
.guide__next-label {
  display: flex;
  flex-direction: column;
  min-width: 0;
  overflow: hidden;
  font-size: 0.9rem;
  line-height: 1.2;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.guide__next-label small {
  font-size: 0.62rem;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  opacity: 0.75;
}
.guide__next--finish {
  justify-content: center;
}
.guide__prev:disabled,
.guide__next:disabled {
  opacity: 0.35;
  cursor: default;
}
@media (max-height: 520px) {
  .guide__media {
    height: 46vh;
  }
  .guide__text {
    height: 120px;
  }
}
</style>
