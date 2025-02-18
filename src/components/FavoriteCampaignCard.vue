<template>
    <v-container max-width="800" style="min-width: 360px;" class="pa-4">
    <v-card class="pl-2 pr-2 pb-2 pt-2" rounded="lg" elevation="3" >
      <!-- Imagem -->
      <v-img
        src="https://druna-assets.s3.us-east-2.amazonaws.com/Dashboard/img-campaigncore.png"
        alt="Campaign Image"
        max-width="800"
        class="rounded-lg"
        contain
      ></v-img>
  
      <!-- Informações -->
      <v-card-text class="pl-2 pt-0 pb-0">
        <p class="ext-uppercase font-weight-black text-bold text-h5 pb-0 pt-1">{{ title }}</p>
        <p class="font-weight-bold grey--text pt-0">{{ subtitle }}</p>
        <p class="font-weight-bold grey--text pt-0">{{ subtitle2}}</p>

        
      </v-card-text>
    </v-card>
</v-container>
  </template>
  
  <script lang="ts" setup>
  import { defineProps } from 'vue';
  
  // Props para tornar o componente reutilizável
  defineProps({
    image: {
      type: String,
      required: true,
      default: 'https://cf.geekdo-images.com/r8obvBpTbSiNr5C0B6g8MA__opengraph/img/eZOHrAK-dYl02EEXlrCI5vZWbB4=/0x0:906x476/fit-in/1200x630/filters:strip_icc()/pic7619515.png', // Placeholder para a imagem
    },
    title: {
      type: String,
      required: true,
      default: 'FAVORITE CAMPAIGN',
    },
    subtitle: {
      type: String,
      required: true,
      default: 'Chronicles of Drunagor: Age of Darkness The Riasdasse of the Undead Dragon',
    },
    subtitle2: {
      type: String,
      required: true,
      default: 'Chronicles of Drunagor: Age of Darkness Thsdasdae Rise of the Undead Dragon',
    },
    progress: {
      type: Number,
      required: true,
      default: 100,
    },
    details: {
      type: String,
      required: true,
      default: 'Door 01 - The entrance to the citadel - Chapter 2',
    },
  });
  </script>
  