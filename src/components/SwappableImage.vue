<script setup lang="ts">
import { ref, toRef, watch } from "vue";

const props = defineProps<{
  title: string;
  background: string;
  frontImage: string;
  subTitle?: string;
  backImage?: string;
}>();

const currentImage = ref("");
const frontImage = toRef(props, "frontImage");

currentImage.value = frontImage.value;

watch(frontImage, async (newImage: string) => {
  currentImage.value = newImage;
});

function swapImage() {
  if (props.backImage == undefined) {
    return;
  }
  if (currentImage.value === props.frontImage) {
    currentImage.value = props.backImage;
  } else {
    currentImage.value = props.frontImage;
  }
}
</script>

<template>
  <v-card class="d-flex flex-column justify-center align-center">
    <v-card-item>
      <v-card-title>
        {{ props.title }}
      </v-card-title>
      <v-card-subtitle>
        {{ props.subTitle }}
      </v-card-subtitle>
    </v-card-item>
    <v-card-text>
      <v-img rounded :src="currentImage" class="bg-black" width="378">
      </v-img>
    </v-card-text>
    <v-card-actions>
      <v-btn icon @click="swapImage()" v-if="backImage">
        <v-icon>mdi-swap-horizontal</v-icon>
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<style scoped>
.border-silver {
  border-width: 1px;
  border-style: solid;
  border-image: linear-gradient(to bottom, #d4d4d8, #111827) 1;
}

.top-border-silver {
  border-top: 2px solid #1f2937;
}
</style>
