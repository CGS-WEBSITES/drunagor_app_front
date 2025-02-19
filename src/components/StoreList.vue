<template>
  <v-container max-width="776" class="pa-0">
    <!-- Caixa por trás -->
    <v-card rounded="lg" elevation="7" class="pa-2">
      <!-- Barra de Busca -->
      <v-text-field
        v-model="searchQuery"
        label="Search"
        variant="solo-filled"
        class="pb-0"
      ></v-text-field>

      <!-- Lista de Lojas -->
      <v-virtual-scroll :items="filteredStores" :item-height="100">
        <template #default="{ item }">
          <v-menu offset-y>
            <template #activator="{ props }">
              <v-card
                class="pa-1 mb-3"
                rounded="lg"
                elevation="10"
                v-bind="props"
                @click="setSelectedStore(item)"
              >
                <v-row>
                  <!-- Imagem -->
                  <v-col cols="4" lg="2" class="d-flex align-center justify-center pl-6">
                    <v-img
                      :src="item.image"
                      alt="Store Image"
                      max-width="90"
                      max-height="90"
                      class="rounded-lg"
                    ></v-img>
                  </v-col>

                  <!-- Informações -->
                  <v-col cols="7">
                    <p class="font-weight-bold text-truncate">{{ item.name }}</p>
                    <p class="text-body-2 grey--text">{{ item.address }}</p>
                  </v-col>

                  <!-- Pontuação -->
                  <!-- <v-col cols="" class="d-flex align-self-end justify-center">
                    <p class="text-body-2 text-bold">{{ item.points }}</p>
                  </v-col> -->
                </v-row>
              </v-card>
            </template>

            
          </v-menu>
        </template>
      </v-virtual-scroll>
    </v-card>
  </v-container>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue';

// Dados simulados
const stores = ref([
  {
    image: 'https://druna-assets.s3.us-east-2.amazonaws.com/CampaignTracker/hero-andreas-cleric.png',
    name: 'Andreas',
    address: 'Generic Information',
    points: '9418°',
  },
  {
    image: 'https://druna-assets.s3.us-east-2.amazonaws.com/CampaignTracker/hero-azriel-swordmage.png',
    name: 'Azriel Store',
    address: 'Generic Location, USA 00000-0000',
    points: '946338°',
  },
  {
    image: 'https://druna-assets.s3.us-east-2.amazonaws.com/CampaignTracker/hero-nyx-assasin.png',
    name: 'Nyx ',
    address: 'Generic Information',
    points: '946338°',
  },
]);

// Campo de busca
const searchQuery = ref('');

// Lista filtrada
const filteredStores = computed(() => {
  if (!searchQuery.value) return stores.value;
  return stores.value.filter((store) =>
    store.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

// Estado para o card selecionado
const selectedStore = ref(null);

// Define o card selecionado
const setSelectedStore = (store) => {
  selectedStore.value = store;
};

// Fecha o menu (limpa a seleção)
const closeMenu = () => {
  selectedStore.value = null;
};
</script>
