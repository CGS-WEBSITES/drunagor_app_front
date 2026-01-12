<template>
  <v-card elevation="2" class="assembly-guide">
    <v-card-text class="pa-0">
      <v-sheet class="image-container pa-4" color="black">
        <v-img
          :src="currentStepData.image"
          :alt="`Assembly step ${currentStep + 1}`"
          aspect-ratio="16/9"
          cover
          class="rounded"
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
      </v-sheet>

      <v-sheet
        v-if="currentStepData.instruction"
        class="instruction-box pa-4 pa-md-6"
        color="grey-darken-4"
      >
        <p class="text-body-1 text-justify mb-0">
          {{ currentStepData.instruction }}
        </p>
      </v-sheet>

      <v-sheet class="pa-4" color="grey-darken-3">
        <v-row justify="space-between" align="center">
          <v-col cols="auto">
            <v-btn
              :disabled="currentStep === 0"
              color="primary"
              variant="elevated"
              size="large"
              @click="previousStep"
            >
              <v-icon start>mdi-chevron-left</v-icon>
              <span class="d-none d-sm-inline">Previous</span>
            </v-btn>
          </v-col>

          <!-- Step counter centralizado -->
          <v-col cols="auto" class="text-center">
            <span class="text-body-1 font-weight-medium">
              Step {{ currentStep + 1 }} of {{ assemblySteps.length }}
            </span>
          </v-col>

          <v-col cols="auto">
            <v-btn
              :disabled="currentStep === assemblySteps.length - 1"
              color="primary"
              variant="elevated"
              size="large"
              @click="nextStep"
            >
              <span class="d-none d-sm-inline">Next</span>
              <v-icon end>mdi-chevron-right</v-icon>
            </v-btn>
          </v-col>
        </v-row>
      </v-sheet>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { ref, computed } from "vue";
import { assemblySteps } from "@/data/assembly/assembly";

const currentStep = ref(0);

const currentStepData = computed(() => assemblySteps[currentStep.value]);

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

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
};

const handleKeyPress = (event) => {
  if (event.key === "ArrowLeft") {
    previousStep();
  } else if (event.key === "ArrowRight") {
    nextStep();
  }
};

import { onMounted, onUnmounted } from "vue";

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
}

.image-container {
  min-height: 300px;
}

.instruction-box {
  min-height: 100px;
  border-top: 2px solid rgba(255, 255, 255, 0.1);
}

@media (max-width: 600px) {
  .image-container {
    padding: 8px !important;
  }

  .instruction-box {
    padding: 16px !important;
  }
}
</style>