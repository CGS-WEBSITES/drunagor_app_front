<template>
  <v-container max-width="776" class="pa-4">
    <!-- Caixa por trás -->
    <v-card rounded="lg" elevation="6" class="pa-4">
      <!-- Barra de Busca -->
      <v-text-field
        v-model="searchQuery"
        label="Search"
        variant="outlined"
        class="mb-4"
      ></v-text-field>

      <!-- Lista de Lojas -->
      <v-virtual-scroll :items="filteredStores" :item-height="100">
        <template #default="{ item }">
          <v-menu offset-y>
            <template #activator="{ props }">
              <v-card
                class="pa-3 mb-3"
                rounded="lg"
                elevation="10"
                v-bind="props"
                @click="setSelectedStore(item)"
              >
                <v-row>
                  <!-- Imagem -->
                  <v-col cols="3" class="d-flex align-center justify-center">
                    <v-img
                      :src="item.image"
                      alt="Store Image"
                      max-width="70"
                      max-height="70"
                      class="rounded-lg"
                    ></v-img>
                  </v-col>

                  <!-- Informações -->
                  <v-col cols="7">
                    <p class="text-body-1 text-bold">{{ item.name }}</p>
                    <p class="text-body-2 grey--text">{{ item.address }}</p>
                  </v-col>

                  <!-- Pontuação -->
                  <v-col cols="1" class="d-flex align-self-end justify-center">
                    <p class="text-body-2 text-bold">{{ item.points }}</p>
                  </v-col>
                </v-row>
              </v-card>
            </template>

            <!-- Conteúdo do menu -->
            <v-card class="pa-4">
              <p class="text-h6 text-bold mb-2">{{ selectedStore?.name }}</p>
              <p class="text-body-2">{{ selectedStore?.address }}</p>
              <p class="text-body-2">Points: {{ selectedStore?.points }}</p>
              <v-btn text color="primary" class="mt-2" @click="closeMenu">
                Fechar
              </v-btn>
            </v-card>
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
    image: 'src/assets/Imagem colada.png',
    name: 'Robiinho7flecha1killWOOD',
    address: 'Rancho Santa Margarita, CA 92688-0001',
    points: '9418°',
  },
  {
    image: 'src/assets/cgsblue.png',
    name: 'Lojinha de Bugigangas do inspetor Bugiganga',
    address: 'Rancho Santa Margarita, CA 92688-0001',
    points: '946338°',
  },
  {
    image: 'src/assets/cgspurple.png',
    name: 'Lojinha de Bugigangas do NUBANK FODA DEMAIS',
    address: 'Rancho Santa Margarita, CA 92688-0001',
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
