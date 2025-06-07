<template>
    <v-container max-width="800" style="min-width: 360px;" class="pa-4">
      <v-card rounded="lg" elevation="3" color="primary" class="pl-1 pt-1 pr-1 pb-0">
        <!-- Cabeçalho -->
        <v-card-title class="d-flex justify-space-between pb-0 ">
          <span class="text-uppercase font-weight-black text-bold text-h5 mb-4 pb-0">{{ title }}</span>
          <span class="text-uppercase text-bold text-h5 mb-4 pb-0">{{ total }}</span>
        </v-card-title>
  
        <!-- Virtual Scroller -->
        <v-virtual-scroll class="pt-0":items="badges" :item-height="130">
          <template #default="{ item }">
            <v-card
              rounded="lg"
              elevation="3"
              class="py-2  px-0 mb-1 d-flex align-center"
              color="secundary"
            >
              <v-row class="align-center">
                <!-- Ícone -->
                <v-col cols="2" lg="2" class="d-flex align-center justify-center">
                  <v-img
                    :src="item.image"
                    alt="Achievement Icon"
                    max-height="80"
                    class="rounded-lg"
                  ></v-img>
                </v-col>
  
                <!-- Detalhes -->
                <v-col cols="10" class="pl-0 d-flex flex-column justify-center">
                  <p class="font-weight-bold white--text ma-0">{{ item.title }}</p>
                  <p class="text-body-2 grey--text ma-0">{{ item.description }}</p>
                  <p class="text-caption grey--text ma-0"> {{ item.date }}</p>
                </v-col>
  
                <!-- Status -->
                <!-- <v-col cols="1" lg="3" class="d-flex flex-column align-center justify-center">
                  <v-icon color="grey darken-1" size="24">{{ item.icon }}</v-icon>
                  <p class="text-body-2 grey--text">{{ item.progress }}</p>
                </v-col> -->
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
      default: 'BADGES',
    },
    total: {
      type: String,
      required: true,
      default: '[BETA]',
    },
    badges: {
      type: Array,
      required: true,
      default: () => [
        {
          image: 'https://druna-assets.s3.us-east-2.amazonaws.com/Profile/cgs-bagde.png',
          title: 'Early Adopter',
          description: 'Joined DrunagorAPP in its testing phase.',
          date: '',
          icon: 'mdi-trophy',
          progress: '15/43',
        },
      ],
    },
  });
  </script>
  