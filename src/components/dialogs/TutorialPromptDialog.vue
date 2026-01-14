<template>
  <v-dialog 
    v-model="dialog" 
    :max-width="isMobile ? '100%' : '600'" 
    :fullscreen="isMobile"
    persistent
    :transition="isMobile ? 'dialog-bottom-transition' : 'dialog-transition'"
  >
    <v-card class="dark-background">
      <v-card-title class="text-h5 pa-4 pa-sm-6">
        <div class="d-flex align-center">
          <v-icon color="primary" :size="isMobile ? 28 : 32" class="mr-2">
            mdi-lightbulb-on
          </v-icon>
          <span :class="isMobile ? 'text-h6' : 'text-h5'">
            Initial Setup Tutorial
          </span>
        </div>
      </v-card-title>

      <v-card-text class="pa-4 pa-sm-6">
        <p class="text-body-1 mb-4">
          You just created an event! Would you like to view the Initial Setup tutorial?
        </p>
        <p class="text-body-2 text-grey">
          This step-by-step guide will help you prepare the game components for your event.
        </p>
      </v-card-text>

      <v-card-actions class="pa-4 pa-sm-6 flex-column align-start">
        <div class="d-flex w-100 justify-end mb-3 flex-wrap gap-2">
          <v-btn
            color="grey"
            variant="text"
            @click="handleNo"
            :block="isMobile"
            :size="isMobile ? 'large' : 'default'"
          >
            No, thanks
          </v-btn>
          <v-btn
            color="primary"
            variant="elevated"
            :class="isMobile ? '' : 'ml-2'"
            @click="handleYes"
            :block="isMobile"
            :size="isMobile ? 'large' : 'default'"
          >
            <v-icon start v-if="!isMobile">mdi-play-circle</v-icon>
            Yes, show me
          </v-btn>
        </div>

        <v-checkbox
          v-model="dontShowAgain"
          label="Don't show this message again"
          hide-details
          density="compact"
          class="mt-0"
        ></v-checkbox>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <v-dialog 
    v-model="assemblyDialog" 
    :max-width="isMobile ? '100%' : '1200'"
    :fullscreen="isMobile"
    persistent
    scrollable
    :transition="isMobile ? 'dialog-bottom-transition' : 'dialog-transition'"
  >
    <v-card class="dark-background">
      <v-card-title class="d-flex justify-space-between align-center pa-4 sticky-header">
        <span :class="isMobile ? 'text-h6' : 'text-h5'">
          Initial Setup Tutorial
        </span>
        <v-btn
          icon
          variant="text"
          @click="closeAssemblyGuide"
          :size="isMobile ? 'small' : 'default'"
        >
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>

      <v-card-text class="pa-0">
        <AssemblyGuide />
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useDisplay } from 'vuetify';
import { useTutorialStore } from '@/store/TutorialStore';
import AssemblyGuide from '@/components/AssemblyGuide.vue';

const { mobile } = useDisplay();
const tutorialStore = useTutorialStore();

const dialog = defineModel('modelValue', { type: Boolean, default: false });
const dontShowAgain = ref(false);
const assemblyDialog = ref(false);

const isMobile = computed(() => mobile.value);

const handleYes = () => {
  if (dontShowAgain.value) {
    tutorialStore.setInitialSetupPreference(true);
  }
  dialog.value = false;
  assemblyDialog.value = true;
};

const handleNo = () => {
  if (dontShowAgain.value) {
    tutorialStore.setInitialSetupPreference(true);
  }
  dialog.value = false;
};

const closeAssemblyGuide = () => {
  assemblyDialog.value = false;
};
</script>

<style scoped>
.dark-background {
  background-color: #121212;
  color: white;
}

.sticky-header {
  position: sticky;
  top: 0;
  z-index: 10;
  background-color: #121212;
  border-bottom: 1px solid rgba(255, 255, 255, 0.12);
}

.gap-2 {
  gap: 8px;
}

/* Mobile adjustments */
@media (max-width: 600px) {
  .v-card-title {
    font-size: 1.25rem !important;
  }
  
  .v-card-text {
    font-size: 0.875rem !important;
  }
}
</style>