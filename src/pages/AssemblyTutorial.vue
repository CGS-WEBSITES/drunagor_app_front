<template>
  <div class="assembly-page-wrapper">
    <div class="page-background"></div>
    <v-container max-width="850" class="safe-area-padding assembly-container px-4 px-sm-6">
      <v-row justify="center" class="ma-0 w-100">
        <v-col cols="12" class="text-center position-relative px-0 py-2" style="min-width: 0;">
          <!-- Centered Header -->
          <div class="mb-8">
            <h1 class="text-h4 text-sm-h3 font-weight-black text-white cinzel-text page-title mt-1">
              ASSEMBLY GUIDE
            </h1>
          </div>

          <!-- Retailer Logged In: Show Assembly Guide -->
          <v-card v-slot:default v-if="isRetailer" class="pa-0 rounded-xl main-card text-left" color="primary" elevation="16">
            <AssemblyGuide />
          </v-card>

          <!-- Not Logged In or Not a Retailer: Show Restrict Message -->
          <v-card v-else class="pa-6 pa-sm-12 rounded-xl main-card text-center" color="primary" elevation="16">
            <v-icon size="64" color="amber-accent-2" class="mb-6">mdi-store-lock</v-icon>
            <h2 class="text-h4 font-weight-bold text-white mb-4 cinzel-text">
              Retailer Access Required
            </h2>
            <p class="mb-8 text-grey-lighten-2 text-body-1 mx-auto" style="max-width: 600px; line-height: 1.6;">
              This step-by-step assembly guide is designed specifically for store owners and event organizers. 
              To access this guide, you must be logged in as a registered <span class="text-amber-accent-2 font-weight-bold">Retailer</span>.
            </p>

            <v-row justify="center" class="ma-0 ga-4">
              <!-- Log In Button -->
              <v-btn
                color="amber-accent-2"
                variant="outlined"
                rounded="pill"
                size="large"
                class="font-weight-black text-white px-8"
                prepend-icon="mdi-login"
                @click="goToLogin"
                style="border-width: 2px;"
              >
                Log In
              </v-btn>

              <!-- Register Button -->
              <v-btn
                color="amber-accent-2"
                variant="flat"
                rounded="pill"
                size="large"
                class="font-weight-black text-black px-8 bg-amber-accent-2"
                prepend-icon="mdi-store-plus"
                @click="goToRegister"
              >
                Create Retailer Account
              </v-btn>
            </v-row>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "@/store/UserStore";
import AssemblyGuide from "@/components/AssemblyGuide.vue";

const router = useRouter();
const userStore = useUserStore();

const isRetailer = computed(() => userStore.user?.roles_fk === 3);

const goToLogin = () => {
  router.push({ path: "/" });
};

const goToRegister = () => {
  router.push({ name: "RetailerRegistration" });
};
</script>

<style scoped>
.safe-area-padding {
  padding-top: 96px !important;
}

@media (max-width: 959px) {
  .safe-area-padding {
    padding-top: calc(80px + env(safe-area-inset-top, 0px)) !important;
  }
}

.page-title {
  letter-spacing: 2px;
  text-shadow: 0 4px 12px rgba(0,0,0,0.6);
}

.main-card {
  background: rgba(var(--v-theme-surface), 0.75) !important;
  backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  overflow: hidden;
}

.assembly-page-wrapper {
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

.assembly-container {
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
</style>
