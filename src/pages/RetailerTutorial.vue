<template>
  <div class="tutorial-page-wrapper">
    <div class="page-background"></div>
    <v-container max-width="850" class="py-8 safe-area-padding tutorial-container px-4 px-sm-6">
      <v-row justify="center" class="ma-0 w-100">
        <v-col cols="12" class="text-center position-relative px-0 py-2" style="min-width: 0;">
        <!-- Back Button - Top Left Positioned -->
        <v-btn
          icon="mdi-arrow-left"
          variant="tonal"
          color="white"
          @click="router.push({ name: 'Login' })"
          class="back-button position-absolute"
          style="left: 16px; top: 8px;"
          title="Back to Login"
        ></v-btn>

        <!-- Centered Header -->
        <div class="mb-8 pt-12 pt-sm-2">
          <h1 class="text-h4 text-sm-h3 font-weight-black text-white cinzel-text tutorial-title mt-1">
            RETAILER GUIDE
          </h1>
        </div>

        <v-card class="pa-3 pa-sm-8 rounded-xl main-tutorial-card text-left" color="primary" elevation="16">
          <v-card-text class="text-grey-lighten-2 text-body-1 px-1 px-sm-3">
            <p class="mb-8 font-weight-medium text-center text-sm-left text-body-1 text-grey-lighten-1">
              Welcome, Retailer! Start by assembling your OP Kit. Then follow the three steps below to create and run your Drunagor Nights events.
            </p>

            <!-- Box Assembly & Organization Guide Card -->
            <v-card 
              class="mb-8 pa-5 pa-sm-6 step-card rounded-xl cursor-pointer hover-card" 
              flat
              @click="router.push({ name: 'BoxAssemblyGuide' })"
            >
              <h2 class="text-h5 font-weight-bold text-white mb-3 d-flex align-center">
                <v-icon color="amber-accent-2" class="mr-3">mdi-package-variant-closed</v-icon>
                Assemble your OP Kit
              </h2>
              <p class="mb-5 text-grey-lighten-1 text-body-2">
                Just received Drunagor Nights? Follow the step-by-step guide to sort the Core Box, the Build Your Own Dungeon add-on and the Organized Play Kit into one box ready for your events.
              </p>
              <div class="d-flex justify-center w-100">
                <v-btn
                  color="amber-accent-2"
                  variant="flat"
                  rounded="pill"
                  class="font-weight-black text-black text-none text-uppercase assembly-guide-btn mx-auto"
                  @click.stop="router.push({ name: 'BoxAssemblyGuide' })"
                >
                  <span class="btn-label-text">OP KIT ASSEMBLY GUIDE</span>
                  <v-icon end size="small" class="ml-2 flex-shrink-0">mdi-arrow-right</v-icon>
                </v-btn>
              </div>
            </v-card>

            <!-- Creating and running events -->
            <v-card v-for="(step, n) in eventSteps" :key="step.title" class="mb-8 pa-5 pa-sm-6 step-card rounded-xl" flat>
              <h2 class="text-h5 font-weight-bold text-white mb-3 d-flex align-center">
                <v-icon color="amber-accent-2" class="mr-3">mdi-numeric-{{ n + 1 }}-circle</v-icon>
                {{ step.title }}
              </h2>
              <p v-for="(line, i) in step.text" :key="i" class="mb-3 text-grey-lighten-1" v-html="line"></p>

              <div class="d-flex align-center justify-space-between mb-2 mt-4 px-1">
                <span class="text-caption text-grey-lighten-1">Screenshots:</span>
                <span class="text-caption text-amber-accent-2 d-flex align-center swipe-hint">
                  Scroll sideways <v-icon size="small" class="ml-1 animate-swipe">mdi-swap-horizontal</v-icon>
                </span>
              </div>
              <div class="d-flex ga-4 overflow-x-auto pb-3 px-1 flex-nowrap swiper-container">
                <v-card
                  v-for="(img, idx) in step.images"
                  :key="idx"
                  flat
                  class="image-thumbnail-card flex-shrink-0 rounded-lg overflow-hidden"
                  width="180"
                  @click="openLightbox(img)"
                >
                  <v-img :src="img" aspect-ratio="9/16" contain class="thumbnail-img">
                    <template v-slot:placeholder>
                      <div class="d-flex align-center justify-center fill-height bg-grey-darken-3">
                        <v-progress-circular indeterminate color="primary" size="24"></v-progress-circular>
                      </div>
                    </template>
                  </v-img>
                  <div class="tap-zoom-hint text-center py-1 text-caption text-grey-lighten-1 bg-black-opacity">
                    <v-icon size="x-small" class="mr-1">mdi-magnify-plus</v-icon> Click to Zoom
                  </div>
                </v-card>
              </div>
            </v-card>

            <!-- Back to login prompt -->
            <div class="d-flex justify-center mt-8">
              <v-btn
                color="amber-accent-2"
                variant="outlined"
                rounded="pill"
                size="large"
                class="font-weight-black text-white px-8 transition-swing"
                prepend-icon="mdi-login"
                @click="router.push({ name: 'Login' })"
                style="border-width: 2px;"
              >
                Go to login
              </v-btn>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Lightbox Modal -->
    <v-dialog v-model="showLightbox" max-width="500" class="lightbox-dialog" scrollable>
      <v-card color="grey-darken-4" class="position-relative overflow-hidden pa-1" rounded="xl">
        <v-btn
          icon="mdi-close"
          variant="flat"
          color="rgba(0,0,0,0.6)"
          class="lightbox-close-btn text-white"
          @click="showLightbox = false"
        ></v-btn>
        <v-card-text class="pa-2 d-flex align-center justify-center bg-black" style="min-height: 350px;">
          <v-img :src="activeImage" width="100%" contain max-height="82vh"></v-img>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-container>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

// Import screenshots dynamically for Vite bundler
import img1_1 from "@/assets/retailertutorial/01.01.png";
import img1_2 from "@/assets/retailertutorial/01.02.png";
import img1_3 from "@/assets/retailertutorial/01.03.png";

import img2_1 from "@/assets/retailertutorial/02.01.png";
import img2_2 from "@/assets/retailertutorial/02.02.png";
import img2_3 from "@/assets/retailertutorial/02.03.png";

import img3_1 from "@/assets/retailertutorial/03.01.png";
import img3_2 from "@/assets/retailertutorial/03.02.png";
import img3_3 from "@/assets/retailertutorial/03.03.png";

import img4_1 from "@/assets/retailertutorial/04.01.png";
import img4_2 from "@/assets/retailertutorial/04.02.png";
import img4_3 from "@/assets/retailertutorial/04.03.png";


// Creating and running events, after the OP Kit is assembled.
const eventSteps = [
  {
    title: "Create your account and store",
    text: [
      `Open the <span class="text-white font-weight-bold">Drunagor.app</span> and log in or create your retailer account.`,
      `When you click <span class="text-white font-weight-bold">Create New Event</span> for the first time, you'll be asked to create your store.`,
    ],
    images: [img1_1, img1_2, img1_3, img2_1, img2_2, img2_3],
  },
  {
    title: "Create your event",
    text: [
      `On the event screen, choose the store where the event will be played (you can have more than one), the Season, the Date and the Time.`,
    ],
    images: [img3_1, img3_2, img3_3],
  },
  {
    title: "Run your tables",
    text: [
      `After creating the event you land on its <span class="text-white font-weight-bold">Tables</span> screen. Print each table's <span class="text-white font-weight-bold">QR Code</span> or show it on a screen: players scan it to join the table, pick their Heroes and start the campaign.`,
      `Before each Drunagor Night, open <span class="text-white font-weight-bold">Manage Event › Table Assembly</span> (or scan the "Setup the Game Table" QR Code) to prepare the table. The players prepare their Heroes and the First Setup.`,
    ],
    images: [img4_1, img4_2, img4_3],
  },
];

const showLightbox = ref(false);
const activeImage = ref("");

const openLightbox = (imgSrc: string) => {
  activeImage.value = imgSrc;
  showLightbox.value = true;
};
</script>

<style scoped>
.safe-area-padding {
  padding-top: calc(env(safe-area-inset-top, 0px) + 24px) !important;
}

.tutorial-title {
  letter-spacing: 2px;
  text-shadow: 0 4px 12px rgba(0,0,0,0.6);
}

.main-tutorial-card {
  background: rgba(var(--v-theme-surface), 0.75) !important;
  backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.step-card {
  background: rgba(var(--v-theme-surface), 0.35) !important;
  border: 1px solid rgba(255, 255, 255, 0.04);
  transition: all 0.3s ease;
}

.step-card:hover {
  border-color: rgba(255, 215, 0, 0.25);
  background: rgba(var(--v-theme-surface), 0.45) !important;
}

.swiper-container {
  scrollbar-width: thin;
  scrollbar-color: rgba(255, 255, 255, 0.2) transparent;
}

.swiper-container::-webkit-scrollbar {
  height: 6px;
}

.swiper-container::-webkit-scrollbar-track {
  background: transparent;
}

.swiper-container::-webkit-scrollbar-thumb {
  background: rgba(255, 179, 0, 0.5); /* Amber accent color */
  border-radius: 3px;
}

.tutorial-page-wrapper {
  position: relative;
  width: 100%;
  overflow-x: hidden;
  min-height: 100vh;
}

.page-background {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 0;
  background-image: 
    radial-gradient(circle at 50% 0%, rgba(20, 20, 20, 0.98) 0%, rgba(20, 20, 20, 0.8) 25%, rgba(20, 20, 20, 0) 65%),
    url('https://assets.drunagor.app/backgrounds/mblogin-background.png');
  background-size: cover, cover;
  background-position: top center, top center;
  background-repeat: no-repeat, no-repeat;
}

@media (min-width: 960px) {
  .page-background {
    background-image: 
      radial-gradient(circle at 50% 0%, rgba(20, 20, 20, 0.98) 0%, rgba(20, 20, 20, 0.8) 25%, rgba(20, 20, 20, 0) 65%),
      url('https://s3.us-east-2.amazonaws.com/assets.drunagor.app/backgrounds/bg-login.webp');
  }
}

.tutorial-container {
  position: relative;
  z-index: 1;
}

.swipe-hint {
  font-weight: 500;
  opacity: 0.85;
}

@keyframes swipeAnimation {
  0%, 100% { transform: translateX(0); }
  50% { transform: translateX(3px); }
}

.animate-swipe {
  animation: swipeAnimation 1.5s infinite ease-in-out;
}

.image-thumbnail-card {
  cursor: pointer;
  border: 2px solid rgba(255, 255, 255, 0.08);
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  background: rgba(0, 0, 0, 0.35) !important;
}

.image-thumbnail-card:hover {
  transform: translateY(-4px) scale(1.04);
  border-color: var(--v-theme-primary);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.5);
}

.thumbnail-img {
  transition: filter 0.3s ease;
}

.image-thumbnail-card:hover .thumbnail-img {
  filter: brightness(1.1);
}

.tap-zoom-hint {
  font-size: 0.65rem !important;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-weight: bold;
}

.bg-black-opacity {
  background: rgba(0, 0, 0, 0.65) !important;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
}

.back-button {
  background: rgba(255, 255, 255, 0.08) !important;
  transition: transform 0.3s ease, background-color 0.3s ease;
  z-index: 5;
}

.back-button:hover {
  transform: translateX(-4px);
  background: rgba(255, 255, 255, 0.15) !important;
}

.lightbox-close-btn {
  position: absolute !important;
  top: 16px;
  right: 16px;
  z-index: 10;
  backdrop-filter: blur(5px);
}

.lightbox-dialog {
  z-index: 9999 !important;
}

.video-container {
  position: relative;
  width: 100%;
  padding-bottom: 56.25%; /* 16:9 Aspect Ratio */
  height: 0;
  background: #000;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
}

.youtube-iframe {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border: none;
}

.border-2-amber {
  border: 2px solid rgba(255, 179, 0, 0.3) !important;
  transition: border-color 0.3s ease;
}

.border-2-amber:hover {
  border-color: rgba(255, 179, 0, 0.6) !important;
}

.assembly-guide-btn {
  max-width: 100% !important;
  height: auto !important;
  min-height: 46px !important;
  padding: 10px 20px !important;
  box-sizing: border-box !important;
}

.assembly-guide-btn :deep(.v-btn__content) {
  white-space: normal !important;
  text-align: center !important;
  line-height: 1.25 !important;
  font-size: clamp(0.75rem, 2.8vw, 0.92rem) !important;
  letter-spacing: 0.5px !important;
  flex-wrap: wrap !important;
  max-width: 100% !important;
}

.btn-label-text {
  max-width: 100%;
  white-space: normal;
  word-break: break-word;
}

</style>
