<template>
 <v-container class="landing-container" fluid>
  <!-- Vídeo de fundo -->
  <video autoplay muted loop id="myVideo">
    <source
      :src="assets + '/landing-page/presentation-video.mp4'"
      type="video/mp4"
    />
  </video>

  <!-- Conteúdo Centralizado -->
  <div class="content d-flex flex-column justify-center align-center text-center">
    <v-img :width="logoWidth" src="@/assets/core.webp" class="mb-6" />

    <v-row
      class="d-flex justify-center"
      style="max-width: 200px; margin: 0 auto;"
    >
      <v-col cols="6" class="d-flex justify-center">
        <v-btn
          color="primary"
          large
          @click="$router.push({ name: 'Login', query: { tab: 'login' } })"
        >
          Login
        </v-btn>
      </v-col>
      <v-col cols="6" class="d-flex justify-center">
        <v-btn
          color="primary"
          large
          @click="$router.push({ name: 'Login', query: { tab: 'signup' } })"
        >
          Sign up
        </v-btn>
      </v-col>
    </v-row>
  </div>
</v-container>
</template>

<script setup lang="ts">
import { inject, computed } from "vue";
import { useDisplay } from "vuetify";

const display = ref(useDisplay());
const assets = inject<string>("assets");

const logoWidth = computed(() => {
  switch (display.value.name) {
    case "xs": return "380";
    case "sm": return "400";
    case "md": return "500";
    case "lg": return "500";
    case "xl": return "600";
    case "xxl": return "700";
  }
});
</script>

<style scoped>
.landing-container {
  height: 100vh;
  position: relative;
  overflow: hidden;
}

#myVideo {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  object-fit: cover;
  height: 100vh;
  z-index: 0;
}

.content {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1;
}

</style>
