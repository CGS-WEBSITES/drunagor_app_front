<template>
  <div :class="isDialog ? 'dialog-wrapper pa-0' : 'tutorial-page-wrapper'">
    <div v-if="!isDialog" class="page-background"></div>
    
    <v-container :max-width="isDialog ? '100%' : '750'" class="py-4 safe-area-padding tutorial-container px-4 px-sm-6">
      <v-row justify="center" class="ma-0 w-100">
        <v-col cols="12" class="text-center position-relative px-0 py-2" style="min-width: 0;">
          <!-- Back/Close Button - Top Left/Right Positioned -->
          <v-btn
            v-if="isDialog"
            icon="mdi-close"
            variant="tonal"
            color="white"
            @click="$emit('close')"
            class="back-button position-absolute"
            style="right: 16px; top: 8px;"
            title="Close"
          ></v-btn>
          <v-btn
            v-else
            icon="mdi-arrow-left"
            variant="tonal"
            color="white"
            @click="$router.push({ name: 'Login' })"
            class="back-button position-absolute"
            style="left: 16px; top: 8px;"
            title="Back to Login"
          ></v-btn>

          <!-- Centered Header -->
          <div class="mb-8 pt-12 pt-sm-2">
            <h1 class="text-h4 text-sm-h3 font-weight-black text-white cinzel-text tutorial-title mt-1">
              SEASON 1 UPDATE
            </h1>
          </div>

          <v-card class="pa-4 pa-sm-8 rounded-xl main-tutorial-card text-left" color="primary" elevation="16">
            <!-- Season 1 Banner Image -->
            <div class="banner-container mb-6 overflow-hidden rounded-xl">
              <v-img
                :src="underkeepBanner"
                alt="Drunagor Nights Season 1 Banner"
                aspect-ratio="16/9"
                cover
                class="banner-img"
              >
                <template v-slot:placeholder>
                  <div class="d-flex align-center justify-center fill-height bg-grey-darken-3">
                    <v-progress-circular indeterminate color="primary" size="32"></v-progress-circular>
                  </div>
                </template>
              </v-img>
            </div>

            <v-card-text class="text-grey-lighten-2 text-body-1 px-1 px-sm-3">
              <h2 class="text-h5 font-weight-black text-white mb-4 d-flex align-center">
                <v-icon color="amber-accent-2" class="mr-3">mdi-wrench-clock</v-icon>
                Refining the Experience
              </h2>
              
              <p class="mb-4 text-grey-lighten-1 leading-relaxed">
                Welcome, brave heroes. 
              </p>
              
              <p class="mb-6 text-grey-lighten-1 leading-relaxed">
                To deliver the most balanced, dynamic, and seamless gameplay flow, the <span class="text-white font-weight-bold">Drunagor App</span> is actively being updated and optimized to improve the <span class="text-white font-weight-bold">Season 01</span> experience. We are working diligently to ensure the app provides the ultimate companion experience for your descent into the Underkeep.
              </p>

              <!-- Highlighted Release Box -->
              <v-alert
                type="info"
                variant="tonal"
                border="start"
                color="amber-accent-2"
                class="mb-8 text-body-1 text-left leading-relaxed rounded-lg py-4"
              >
                <div class="d-flex align-center mb-1">
                  <v-icon color="amber-accent-2" class="mr-2" size="large">mdi-calendar-check</v-icon>
                  <span class="font-weight-black text-white text-subtitle-1">EVENT CREATION RELEASE</span>
                </div>
                Event creation and official app support for <span class="text-white font-weight-bold">Drunagor Nights Season 01</span> will be fully unlocked on <span class="text-amber-accent-2 font-weight-black">July 1st (07/01)</span>.
              </v-alert>

              <h2 class="text-h5 font-weight-black text-white mb-4 d-flex align-center pt-2">
                <v-icon color="amber-accent-2" class="mr-3">mdi-apps</v-icon>
                Explore Other Features
              </h2>
              
              <p class="mb-6 text-grey-lighten-1 leading-relaxed">
                While the Season 01 updates are being finalized, the App is fully functional and ready with other core features to support your gaming sessions:
              </p>

              <!-- Feature Grid / List -->
              <v-row class="ma-0 w-100 ga-4 mb-8">
                <v-col cols="12" class="pa-0">
                  <div class="d-flex align-start ga-3 feature-item pa-4 rounded-lg">
                    <v-icon color="amber-accent-2" class="mt-1">mdi-book-open-page-variant</v-icon>
                    <div>
                      <h4 class="text-white font-weight-bold text-subtitle-1 mb-1">Legacy Campaign Tracking</h4>
                      <p class="text-body-2 text-grey-lighten-1 mb-3">
                        Log and manage your classic campaigns, track party achievements, hero level-ups, class abilities, and choices across adventures:
                      </p>
                      <!-- Campaign Icons with custom styles -->
                      <div class="d-flex ga-2 align-center flex-wrap pt-1">
                        <div class="d-flex align-center ga-1 border-campaign-icon rounded-pill px-3 py-1">
                          <v-img :src="coreIcon" width="16" height="16" contain></v-img>
                          <span class="text-caption text-grey-lighten-3 font-weight-bold">Core Box</span>
                        </div>
                        <div class="d-flex align-center ga-1 border-campaign-icon rounded-pill px-3 py-1">
                          <v-img :src="apocIcon" width="16" height="16" contain></v-img>
                          <span class="text-caption text-grey-lighten-3 font-weight-bold">Apocalypse</span>
                        </div>
                        <div class="d-flex align-center ga-1 border-campaign-icon rounded-pill px-3 py-1">
                          <v-img :src="awakeningsIcon" width="16" height="16" contain></v-img>
                          <span class="text-caption text-grey-lighten-3 font-weight-bold">Awakenings</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </v-col>

                <v-col cols="12" class="pa-0">
                  <div class="d-flex align-start ga-3 feature-item pa-4 rounded-lg">
                    <v-icon color="amber-accent-2" class="mt-1">mdi-account-group</v-icon>
                    <div>
                      <h4 class="text-white font-weight-bold text-subtitle-1 mb-1">Community Builds</h4>
                      <p class="text-body-2 text-grey-lighten-1 mb-0">
                        Explore custom initiative tracks created by the Drunagor community to spice up your play sessions.
                      </p>
                    </div>
                  </div>
                </v-col>

                <v-col cols="12" class="pa-0">
                  <div class="d-flex align-start ga-3 feature-item pa-4 rounded-lg">
                    <v-icon color="amber-accent-2" class="mt-1">mdi-book-open</v-icon>
                    <div>
                      <h4 class="text-white font-weight-bold text-subtitle-1 mb-1">The Digital Library</h4>
                      <p class="text-body-2 text-grey-lighten-1 mb-0">
                        Log your physical collection by selecting the expansions, boxes, and SKUs you own.
                      </p>
                    </div>
                  </div>
                </v-col>

                <v-col cols="12" class="pa-0">
                  <div class="d-flex align-start ga-3 feature-item pa-4 rounded-lg">
                    <v-icon color="amber-accent-2" class="mt-1">mdi-account-cog</v-icon>
                    <div>
                      <h4 class="text-white font-weight-bold text-subtitle-1 mb-1">Profile & Social</h4>
                      <p class="text-body-2 text-grey-lighten-1 mb-0">
                        Customize your profile, add friends, view other players' profiles, and browse their digital libraries and tracked campaigns.
                      </p>
                    </div>
                  </div>
                </v-col>
              </v-row>

              <!-- Go to Login Button -->
              <div v-if="!isDialog" class="d-flex justify-center mt-6">
                <v-btn
                  color="amber-accent-2"
                  variant="outlined"
                  rounded="pill"
                  size="large"
                  class="font-weight-black text-white px-8 transition-swing"
                  prepend-icon="mdi-login"
                  @click="$router.push({ name: 'Login' })"
                  style="border-width: 2px;"
                >
                  Go to login
                </v-btn>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script setup lang="ts">
import { withDefaults, defineProps, defineEmits } from "vue";
import underkeepBanner from "@/assets/underkeep.png";
import coreIcon from "@/assets/core.webp";
import apocIcon from "@/assets/apocalypse.webp";
import awakeningsIcon from "@/assets/awakenings.webp";

withDefaults(
  defineProps<{
    isDialog?: boolean;
  }>(),
  {
    isDialog: false,
  }
);

defineEmits<{
  (e: "close"): void;
}>();
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

.banner-container {
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.4);
}

.banner-img {
  transition: transform 0.5s ease;
}

.banner-container:hover .banner-img {
  transform: scale(1.02);
}

.feature-item {
  background: rgba(var(--v-theme-surface), 0.35) !important;
  border: 1px solid rgba(255, 255, 255, 0.04);
  transition: all 0.3s ease;
}

.feature-item:hover {
  border-color: rgba(255, 215, 0, 0.2);
  background: rgba(var(--v-theme-surface), 0.45) !important;
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

.back-button {
  background: rgba(255, 255, 255, 0.08) !important;
  transition: transform 0.3s ease, background-color 0.3s ease;
  z-index: 5;
}

.back-button:hover {
  transform: translateX(-4px);
  background: rgba(255, 255, 255, 0.15) !important;
}

.border-campaign-icon {
  border: 1px solid rgba(255, 255, 255, 0.08);
  transition: all 0.3s ease;
  background: rgba(0, 0, 0, 0.45) !important;
}

.border-campaign-icon:hover {
  border-color: rgba(255, 179, 0, 0.3);
  background: rgba(0, 0, 0, 0.6) !important;
}
</style>
