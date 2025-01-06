<template>
  <v-row no-gutters>
    <v-col cols="12">
      <profile-card
      />
    </v-col>
    <!-- <v-col cols="12">
      <navigation-bar
        :buttons="buttons"
        :separators="[true, false, true, true, false]"
      />
    </v-col> -->
    <v-col cols="12">
      <router-view />
    </v-col>
  </v-row>
</template>

<script lang="ts" setup>
import {inject} from "vue";
import { useUserStore } from "@/store/UserStore";

const user = useUserStore().user; // Inicializa a store

const assets = inject<string>("assets");
</script>

<style scoped>
</style>