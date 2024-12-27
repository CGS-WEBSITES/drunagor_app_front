<template>
  <v-container class="fill-height d-flex justify-center" fluid>
    <!-- The video -->
    <video autoplay muted loop id="myVideo">
      <source
        :src="assets + '/landing-page/presentation-video.mp4'"
        type="video/mp4"
      />
    </video>
    <div class="content d-flex flex-column justify-center align-center">
      <div>
        <v-img width="500" src="@/assets/core.webp"></v-img>
      </div>
      <div class="mt-2">
        <v-btn color="#B8860B" large @click="$router.push({ name: 'Login' })"
          >Sign up</v-btn
        >
      </div>
    </div>
  </v-container>
</template>

<script setup lang="ts">
import { inject } from "vue";
const assets = inject<string>("assets");
</script>
<style scoped>
#myVideo {
  min-width: auto;
  min-height: 100%;
}
.content {
  position: relative;
  bottom: 60%;
  width: 100%;
}
</style>
