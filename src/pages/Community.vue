<template>
  <v-container fluid class="pa-0">
    <v-row class="pl-5">
      <v-row class="d-flex justify-center align-center flex-nowrap">
        <v-col cols="auto" class="text-center pa-0">
          <v-title
            class="d-flex justify-center align-center text-h5 text-sm-h4 pt-12 pb-6"
            style="white-space: nowrap; font-size: clamp(1.5rem, 3vw, 2.5rem)"
          >
            <strong>Building Together: Our Supporters Nationwide !</strong> 
          </v-title>
        </v-col>
      </v-row>
      <br />
      <v-col cols="12" class="d-flex justify-center align-center">
        <ChoroplethMap />
      </v-col>

    </v-row>
    <br />
  </v-container>
</template>
  
  <script setup>
import { VContainer, VRow, VCol } from "vuetify/components";
import ChoroplethMap from "@/components/ChoroplethMap.vue";
</script>
  