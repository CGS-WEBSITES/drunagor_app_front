<template>
    <v-container max-width="800" style="min-width: 360px;" class="pa-4">
    <v-card class="pa-4" rounded="lg" elevation="3" >
      <!-- Imagem -->
      <v-img
        :src="image"
        alt="Campaign Image"
        width="800"
        class="rounded-lg"
        contain
      ></v-img>
  
      <!-- Informações -->
      <v-card-text>
        <!-- Título Principal -->
        <p class="text-h6 text-bold mb-2">{{ title }}</p>
  
        <!-- Subtítulo -->
        <p class="text-body-2 grey--text mb-2">{{ subtitle }}</p>
  
        <!-- Progresso -->
        <p class="text-body-2 text-bold mb-1">
          Progression [{{ progress }}%]
        </p>
  
        <!-- Detalhes Adicionais -->
        <p class="text-caption grey--text">{{ details }}</p>
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
      default: 'Chronicles of Drunagor: Age of Darkness The Rise of the Undead Dragon',
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
  