<template>
    <v-container max-width="800" style="min-width: 360px;" class="pa-4">
      <v-card rounded="lg" elevation="3" class="pa-5">
        <!-- Cabeçalho -->
        <v-card-title class="d-flex justify-space-between">
          <span class="text-h6 text-uppercase text-bold">{{ title }}</span>
          <span class="text-body-2 grey--text text-bold">{{ total }}</span>
        </v-card-title>
  
        <!-- Virtual Scroller -->
        <v-virtual-scroll :items="badges" :item-height="130">
          <template #default="{ item }">
            <v-card
              rounded="lg"
              elevation="3"
              class="pa-3 mb-2 d-flex align-center"
              style="background-color: #484848;"
            >
              <v-row class="align-center">
                <!-- Ícone -->
                <v-col cols="3" class="d-flex align-center justify-center">
                  <v-img
                    :src="item.image"
                    alt="Achievement Icon"
                    max-width="70"
                    max-height="70"
                    class="rounded-lg"
                  ></v-img>
                </v-col>
  
                <!-- Detalhes -->
                <v-col cols="7">
                  <p class="text-body-1 text-bold white--text">{{ item.title }}</p>
                  <p class="text-body-2 grey--text">{{ item.description }}</p>
                  <p class="text-caption grey--text">Achieved {{ item.date }}</p>
                </v-col>
  
                <!-- Status -->
                <v-col cols="1" class="d-flex flex-column align-center justify-center">
                  <v-icon color="grey darken-1" size="24">{{ item.icon }}</v-icon>
                  <p class="text-body-2 grey--text">{{ item.progress }}</p>
                </v-col>
              </v-row>
            </v-card>
          </template>
        </v-virtual-scroll>
      </v-card>
    </v-container>
  </template>
  
  <script lang="ts" setup>
  import { defineProps } from 'vue';
  
  // Props para configurar o componente
  defineProps({
    title: {
      type: String,
      required: true,
      default: 'ACHIEVEMENTS',
    },
    total: {
      type: String,
      required: true,
      default: '[TOTAL]',
    },
    badges: {
      type: Array,
      required: true,
      default: () => [
        {
          image: 'https://cdn.mos.cms.futurecdn.net/P9nEHqSzs3dUrSdmBDrPxn.jpg',
          title: 'Great Achievement Name',
          description: 'Achievement short description here cabe duas linha aqui ó',
          date: '11/11/2024',
          icon: 'mdi-trophy',
          progress: '15/43',
        },
      ],
    },
  });
  </script>
  