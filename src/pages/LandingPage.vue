<template>
  <v-container class="d-flex flex-column justify-center pa-0" fluid>
    <!-- The video -->
    <video autoplay muted loop id="myVideo">
      <source
        :src="assets + '/landing-page/presentation-video.mp4'"
        type="video/mp4"
      />
      <div class="video-shader"></div>
    </video>
    <div
      style="height: 0px"
      class="content d-flex flex-column justify-center align-center"
    >
      <div>
        <v-img :width="logoWidth" src="@/assets/core.webp"></v-img>
      </div>
      <div class="mt-2">
        <v-btn 
          color="primary" 
          large 
          @click="$router.push({ name: 'Login', query: { tab: 'login' } })"
          >Login</v-btn
        >
      </div>
      <div class="mt-2">
        <v-btn 
          color="primary" 
          large 
          @click="$router.push({ name: 'Login', query: { tab: 'signup' } })"
          >Sign up</v-btn
        >
      </div>
    </div>
  </v-container>
</template>

<script setup lang="ts">
import { inject, computed, onMounted } from "vue";
import { useDisplay } from "vuetify";

const display = ref(useDisplay());
const assets = inject<string>("assets");

const logoWidth = computed(() => {
  switch (display.value.name) {
    case "xs":
      return "300";
    case "sm":
      return "400";
    case "md":
      return "500";
    case "lg":
      return "500";
    case "xl":
      return "600";
    case "xxl":
      return "700";
  }
});

</script>
<style scoped>
#myVideo {
  min-width: 100%;
  min-height: auto;
}
.content {
  position: relative;
  bottom: 50%;
  width: 100%;
}
.video-shader{
  width: 100%;
  height: 100%;
  background-color: black;
}
</style>
