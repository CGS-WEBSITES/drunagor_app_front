<template>
  <v-container fluid class="pa-0 mt-12"> 
    <v-row justify="center" no-gutters>
      <v-col cols="11" sm="10" md="8" lg="6">
        
        <v-card
          v-if="!isUserLoggedIn"
          class="mb-8 text-center"
          elevation="6"
          rounded="xl"
          :style="{ 
            backgroundImage: `url(${assets}/backgrounds/backgrounds.png)`,
            backgroundRepeat: 'repeat',
            border: '1px solid rgba(255, 255, 255, 0.15)'
          }"
        >
          <div class="pa-6">
            <h2 class="text-h4 font-weight-bold mb-3 text-white">
              Unlock the Full Experience!
            </h2>
            
            <p class="text-body-1 text-white mb-6 opacity-80">
              You are currently viewing Keywords. To explore our complete library, build campaigns, and track your heroes, create your account!
            </p>
            
            <div class="d-flex justify-center align-center gap-4">
              <v-btn
                variant="outlined"
                size="large"
                color="white"
                class="mx-2"
                @click="goToLogin"
              >
                Log In
              </v-btn>

              <v-btn
                variant="elevated"
                size="large"
                class="mx-2 font-weight-bold signup-btn"
                @click="goToSignup"
              >
                Sign Up Now
              </v-btn>
            </div>
          </div>
        </v-card>

        <div class="keyword-clean-wrapper">
          <KeywordView />
        </div>

      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { inject, computed } from "vue";
import { useRouter } from "vue-router";
import { isSignedIn } from "@/service/AccessToken"; // Importando sua função de check
import KeywordView from "@/components/KeywordView.vue";

const router = useRouter();
const assets = inject<string>("assets");

// Criamos uma propriedade computada para reagir ao estado de login
const isUserLoggedIn = computed(() => isSignedIn());

const goToLogin = () => {
  router.push({ name: "Login" });
};

const goToSignup = () => {
  router.push({ name: "Login", query: { tab: "signup" } });
};
</script>

<style scoped>
.gap-4 {
  gap: 16px;
}

.signup-btn {
  background: linear-gradient(45deg, #d4af37, #f9e27d) !important;
  color: #000 !important;
  transition: transform 0.2s ease;
}

.signup-btn:hover {
  transform: scale(1.05);
}

.keyword-clean-wrapper {
  width: 100%;
  margin: 0 auto;
}

:deep(.v-card) {
  margin-left: auto !important;
  margin-right: auto !important;
}

.opacity-80 {
  opacity: 0.8;
}

@media (max-width: 600px) {
  .text-h4 {
    font-size: 1.5rem !important;
  }
}
</style>