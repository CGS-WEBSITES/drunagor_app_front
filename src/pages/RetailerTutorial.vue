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
              Welcome to the Drunagor Retailer Tutorial. Below is a step-by-step guide to help you set up your store account, schedule events, and manage game tables.
            </p>

            <!-- Box Assembly & Organization Guide Card -->
            <v-card 
              class="mb-8 pa-5 pa-sm-6 step-card rounded-xl cursor-pointer hover-card" 
              flat
              @click="router.push({ name: 'BoxAssemblyGuide' })"
            >
              <h2 class="text-h5 font-weight-bold text-white mb-3 d-flex align-center">
                <v-icon color="amber-accent-2" class="mr-3">mdi-package-variant-closed</v-icon>
                Box Assembly & Organization Guide
              </h2>
              <p class="mb-5 text-grey-lighten-1 text-body-2">
                Follow our interactive step-by-step checklist to learn how to organize your components and assemble the game box for Drunagor Nights.
              </p>
              <div class="d-flex justify-start w-100">
                <v-btn
                  color="amber-accent-2"
                  variant="flat"
                  rounded="pill"
                  class="font-weight-black text-black text-none text-uppercase assembly-guide-btn"
                  @click.stop="router.push({ name: 'BoxAssemblyGuide' })"
                >
                  <span class="btn-label-text">ASSEMBLY & ORGANIZATION GUIDE</span>
                  <v-icon end size="small" class="ml-2 flex-shrink-0">mdi-arrow-right</v-icon>
                </v-btn>
              </div>
            </v-card>

            <!-- Step 1 -->
            <v-card class="mb-8 pa-5 pa-sm-6 step-card rounded-xl" flat>
              <h2 class="text-h5 font-weight-bold text-white mb-3 d-flex align-center">
                <v-icon color="amber-accent-2" class="mr-3">mdi-numeric-1-circle</v-icon>
                Open the Adventure Setup
              </h2>
              <p class="mb-5 text-grey-lighten-1">
                Open the <span class="text-white font-weight-bold">Drunagor.app</span> and log in or create your retailer account.
              </p>
              
              <!-- Swipe helper indicator -->
              <div class="d-flex align-center justify-space-between mb-2 px-1">
                <span class="text-caption text-grey-lighten-1">Screenshots:</span>
                <span class="text-caption text-amber-accent-2 d-flex align-center swipe-hint">
                  Scroll sideways <v-icon size="small" class="ml-1 animate-swipe">mdi-swap-horizontal</v-icon>
                </span>
              </div>

              <!-- Horizontal swiper for Step 1 -->
              <div class="d-flex ga-4 overflow-x-auto pb-3 px-1 flex-nowrap swiper-container">
                <v-card 
                  v-for="(img, idx) in step1Images" 
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

            <!-- Step 2 -->
            <v-card class="mb-8 pa-5 pa-sm-6 step-card rounded-xl" flat>
              <h2 class="text-h5 font-weight-bold text-white mb-3 d-flex align-center">
                <v-icon color="amber-accent-2" class="mr-3">mdi-numeric-2-circle</v-icon>
                Create Your Store
              </h2>
              <p class="mb-5 text-grey-lighten-1">
                When you click "Create New Event", you'll be asked to first create a store.
              </p>

              <!-- Swipe helper indicator -->
              <div class="d-flex align-center justify-space-between mb-2 px-1">
                <span class="text-caption text-grey-lighten-1">Screenshots:</span>
                <span class="text-caption text-amber-accent-2 d-flex align-center swipe-hint">
                  Scroll sideways <v-icon size="small" class="ml-1 animate-swipe">mdi-swap-horizontal</v-icon>
                </span>
              </div>

              <!-- Horizontal swiper for Step 2 -->
              <div class="d-flex ga-4 overflow-x-auto pb-3 px-1 flex-nowrap swiper-container">
                <v-card 
                  v-for="(img, idx) in step2Images" 
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

            <!-- Step 3 -->
            <v-card class="mb-8 pa-5 pa-sm-6 step-card rounded-xl" flat>
              <h2 class="text-h5 font-weight-bold text-white mb-3 d-flex align-center">
                <v-icon color="amber-accent-2" class="mr-3">mdi-numeric-3-circle</v-icon>
                Create Your Event
              </h2>
              <p class="mb-5 text-grey-lighten-1">
                After the store is created, the event creation screen will become accessible. On the event screen, select which store the event will be played at (since there is the possibility of having multiple stores), along with the Season, Time, and Date of the event. After creating the event, you'll be presented with a tutorial guide. If it is your first time setting up an Drunagor Nights event, you should follow the instructions presented there.
              </p>

              <!-- Swipe helper indicator -->
              <div class="d-flex align-center justify-space-between mb-2 px-1">
                <span class="text-caption text-grey-lighten-1">Screenshots:</span>
                <span class="text-caption text-amber-accent-2 d-flex align-center swipe-hint">
                  Scroll sideways <v-icon size="small" class="ml-1 animate-swipe">mdi-swap-horizontal</v-icon>
                </span>
              </div>

              <!-- Horizontal swiper for Step 3 -->
              <div class="d-flex ga-4 overflow-x-auto pb-3 px-1 flex-nowrap swiper-container">
                <v-card 
                  v-for="(img, idx) in step3Images" 
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

            <!-- Step 4 -->
            <v-card class="mb-8 pa-5 pa-sm-6 step-card rounded-xl" flat>
              <h2 class="text-h5 font-weight-bold text-white mb-3 d-flex align-center">
                <v-icon color="amber-accent-2" class="mr-3">mdi-numeric-4-circle</v-icon>
                Manage Your Tables & QR Codes
              </h2>
              <p class="mb-5 text-grey-lighten-1">
                Once created, you will land on the "tables" screen where you will have access to the TABLE QR CODE. Print this QR code or display it on a screen at each play table. When players arrive at your store, they will scan this QR code with their mobile devices to automatically join your event, access the active campaign session, track achievements, and sync their game state directly.
              </p>

              <!-- Swipe helper indicator -->
              <div class="d-flex align-center justify-space-between mb-2 px-1">
                <span class="text-caption text-grey-lighten-1">Screenshots:</span>
                <span class="text-caption text-amber-accent-2 d-flex align-center swipe-hint">
                  Scroll sideways <v-icon size="small" class="ml-1 animate-swipe">mdi-swap-horizontal</v-icon>
                </span>
              </div>

              <!-- Horizontal swiper for Step 4 -->
              <div class="d-flex ga-4 overflow-x-auto pb-3 px-1 flex-nowrap swiper-container">
                <v-card 
                  v-for="(img, idx) in step4Images" 
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

            <!-- Step 5 -->
            <v-card class="mb-4 pa-5 pa-sm-6 step-card rounded-xl" flat>
              <h2 class="text-h5 font-weight-bold text-white mb-3 d-flex align-center">
                <v-icon color="amber-accent-2" class="mr-3">mdi-numeric-5-circle</v-icon>
                First Setup Prep
              </h2>
              <p class="mb-5 text-grey-lighten-1">
                The First Setup is also accessible through the manage events screen, in the "FIRST SETUP" TAB.
              </p>

              <!-- Swipe helper indicator -->
              <div class="d-flex align-center justify-space-between mb-2 px-1">
                <span class="text-caption text-grey-lighten-1">Screenshots:</span>
                <span class="text-caption text-amber-accent-2 d-flex align-center swipe-hint">
                  Scroll sideways <v-icon size="small" class="ml-1 animate-swipe">mdi-swap-horizontal</v-icon>
                </span>
              </div>

              <!-- Horizontal swiper for Step 5 -->
              <div class="d-flex ga-4 overflow-x-auto pb-3 px-1 flex-nowrap swiper-container">
                <v-card 
                  v-for="(img, idx) in step5Images" 
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

              <v-alert type="info" variant="tonal" border="start" color="amber-accent-2" class="mt-4 text-body-2 text-left leading-relaxed">
                The First Room is prepared by the Store Owner. Players will learn how to set up future Rooms when they reach Door 1.
              </v-alert>
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

import img5_1 from "@/assets/retailertutorial/05.01.png";
import img5_2 from "@/assets/retailertutorial/05.02.png";

const step1Images = [img1_1, img1_2, img1_3];
const step2Images = [img2_1, img2_2, img2_3];
const step3Images = [img3_1, img3_2, img3_3];
const step4Images = [img4_1, img4_2, img4_3];
const step5Images = [img5_1, img5_2];

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
