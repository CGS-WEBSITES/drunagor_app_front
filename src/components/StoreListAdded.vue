<template>
  <v-container max-width="776" class="pa-4">
    <!-- Caixa por trás -->
    <v-card rounded="lg" elevation="6" class="pa-4">
      <!-- Seleção de Abas -->
      <v-col cols="12" class="d-flex justify-center pa-0">
      <v-tabs v-model="activeTab" class="mb-4">
        <v-tab :value="'friends'" class="text-h5 text-bold">Friends</v-tab>
        <v-tab :value="'requests'" class="text-h5 text-bold">Requests</v-tab>
      </v-tabs>
      </v-col>

      <!-- Barra de Busca -->
      <v-text-field
        v-model="searchQuery"
        label="Search"
        variant="solo-filled"
        class="pb-0"
      ></v-text-field>

      <!-- Lista Virtual -->
      <v-virtual-scroll :items="filteredList" :item-height="100">
        <template #default="{ item }">
          <v-menu offset-y>
            <template #activator="{ props }">
              <v-card
                class="pa-1 mb-3"
                rounded="lg"
                elevation="10"
                v-bind="props"
                @click="setSelectedItem(item)"
              >
                <v-row>
                  <!-- Imagem -->
                  <v-col cols="4" lg="2" class="d-flex align-center justify-center">
                    <v-img
                      :src="item.image"
                      alt="Item Image"
                      max-width="90"
                      max-height="90"
                      class="rounded-lg"
                    ></v-img>
                  </v-col>

                  <!-- Informações -->
                  <v-col cols="7">
                    <p class="font-weight-bold text-truncate">{{ item.name }}</p>
                    <p class="text-body-2 grey--text">{{ item.details }}</p>
                  </v-col>

                  <!-- Pontuação -->
                  <!-- <v-col cols="1" class="d-flex align-self-end justify-center">
                    <p class="text-body-2 text-bold">{{ item.points }}</p>
                  </v-col> -->
                </v-row>
              </v-card>
            </template>

            <!-- Conteúdo do menu -->
            <!-- <v-card class="pa-4">
              <p class="text-h6 text-bold mb-2">{{ selectedItem?.name }}</p>
              <p class="text-body-2">{{ selectedItem?.details }}</p>
              <p class="text-body-2">Points: {{ selectedItem?.points }}</p>
              <v-btn text color="primary" class="mt-2" @click="closeMenu">
                Fechar
              </v-btn>
            </v-card> -->
          </v-menu>
        </template>
      </v-virtual-scroll>
    </v-card>
  </v-container>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue';

// Dados simulados
const friends = ref([
  {
    image: 'https://pbs.twimg.com/media/FOMtN45XIAEjvgo.png',
    name: 'Robiinho7flecha1killWOOD',
    details: '99845651pts',
    points: '946338°',
  },
  {
    image: 'https://pbs.twimg.com/media/F_QvN7mWkAAqXBE.png',
    name: 'Lojinha de Bugigangas do inspetor Bugiganga',
    details: 'Rancho Santa Margarita, CA 92688-0001',
    points: '946338°',
  },
]);

const requests = ref([
  {
    image: 'https://pbs.twimg.com/media/FOMtN45XIAEjvgo.png',
    name: 'Request User 1',
    details: 'Pending Approval',
    points: '--',
  },
  {
    image: 'https://pbs.twimg.com/media/F_QvN7mWkAAqXBE.png',
    name: 'Request User 2',
    details: 'Pending Approval',
    points: '--',
  },
]);

// Abas ativas
const activeTab = ref('friends');

// Campo de busca
const searchQuery = ref('');

// Lista filtrada com base na aba ativa
const filteredList = computed(() => {
  const list = activeTab.value === 'friends' ? friends.value : requests.value;
  if (!searchQuery.value) return list;
  return list.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

// Estado para o item selecionado
const selectedItem = ref(null);

// Define o item selecionado
const setSelectedItem = (item) => {
  selectedItem.value = item;
};

// Fecha o menu (limpa a seleção)
const closeMenu = () => {
  selectedItem.value = null;
};
</script>
