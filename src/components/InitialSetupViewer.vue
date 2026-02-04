<template>
  <div v-if="setupImage" class="initial-setup-viewer">
    <div v-if="!previewMode" class="mb-4">
      <h3 class="text-h6 font-weight-bold mb-2">
        <v-icon color="primary" class="mr-2">mdi-map</v-icon>
        Initial Setup
      </h3>
    </div>

    <v-card
      class="setup-image-card"
      :class="{ 'preview-card': previewMode }"
      elevation="4"
    >
      <v-img
        :src="setupImage"
        :alt="`Initial Setup for ${scenarioName}`"
        contain
        class="setup-image"
        :class="{ 'preview-image': previewMode }"
      >
        <template v-slot:placeholder>
          <div class="d-flex align-center justify-center fill-height">
            <v-progress-circular
              indeterminate
              color="primary"
            ></v-progress-circular>
          </div>
        </template>
      </v-img>
    </v-card>
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  scenario: { type: String, required: true },
  attach: { type: [String, Object], default: undefined },
  previewMode: { type: Boolean, default: false },
});

const SCENARIO_SETUP_MAP = {
  "Wing 04 Advanced": {
    image: "https://assets.drunagor.app/book/books2/002.png",
    name: "The Lost Vault",
    bookId: "book02.07",
  },
  "Wing 03 Advanced": {
    image: "https://assets.drunagor.app/book/books2/001.png",
    name: "The Underkeep Level 02",
    bookId: "book02.01",
  },
};

const setupData = computed(() => {
  return SCENARIO_SETUP_MAP[props.scenario] || null;
});

const setupImage = computed(() => {
  return setupData.value?.image || null;
});

const scenarioName = computed(() => {
  return setupData.value?.name || props.scenario;
});
</script>

<style scoped>
.initial-setup-viewer {
  width: 100%;
}

.setup-image-card {
  border-radius: 12px;
  overflow: hidden;
  background-color: #ffffff;
  position: relative;
}

.setup-image {
  width: 100%;
  height: auto;
  min-height: 500px;
  max-height: 700px;
  background-color: #ffffff;
}

.preview-card .setup-image,
.preview-image {
  min-height: 300px;
  max-height: 400px;
  pointer-events: none;
}

@media (max-width: 960px) {
  .setup-image {
    min-height: 400px;
    max-height: 600px;
  }

  .preview-image {
    min-height: 250px;
    max-height: 350px;
  }
}

@media (max-width: 600px) {
  .setup-image {
    min-height: 300px;
    max-height: 500px;
  }

  .preview-image {
    min-height: 200px;
    max-height: 300px;
  }
}
</style>