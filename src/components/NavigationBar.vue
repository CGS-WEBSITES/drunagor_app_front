<template>
  <v-container max-width="720" style="min-width: 360px;" class="pa-4">
    <v-card rounded="lg" elevation="3" class="mx-auto py-4 px-6 d-flex justify-center">
      <v-row justify="space-between" align="center" class="py-2" style="max-width: 400px;">
        <!-- Grupo 1: Profile e Edit -->
        <template v-for="(button,) in group1" :key="button.value">
          <v-btn
            icon
            size="45"
            :class="{ 'text-primary': activeButton === button.value }"
            @click="navigateTo(button.route)"
          >
            <v-icon style="font-size: 24px;">{{ button.icon }}</v-icon>
          </v-btn>
        </template>

        <!-- Separador -->
        <v-divider vertical class="mx-2"></v-divider>

        <!-- Grupo 2: Search e Group -->
        <template v-for="(button,) in group2" :key="button.value">
          <v-btn
            icon
            size="45"
            :class="{ 'text-primary': activeButton === button.value }"
            @click="navigateTo(button.route)"
          >
            <v-icon style="font-size: 24px;">{{ button.icon }}</v-icon>
          </v-btn>
        </template>

        <!-- Separador -->
        <v-divider vertical class="mx-2"></v-divider>

        <!-- Grupo 3: Settings e Logout -->
        <template v-for="(button,) in group3" :key="button.value">
          <v-btn
            icon
            size="45"
            :class="{ 'text-primary': activeButton === button.value }"
            @click="navigateTo(button.route)"
          >
            <v-icon style="font-size: 24px;">{{ button.icon }}</v-icon>
          </v-btn>
        </template>
      </v-row>
    </v-card>
  </v-container>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router'; // Importa o roteador

// Roteador
const router = useRouter();

// Função de navegação
const navigateTo = (route: string) => {
  router.push(route);
};

// Estado do botão ativo
const activeButton = ref<string | null>(null);

// Grupos de botões (divididos em 3 grupos)
const group1 = ref([
  { icon: 'mdi-account', value: 'Perfil', route: '/perfil/home' },
  { icon: 'mdi-square-edit-outline', value: 'edit', route: '/Perfil' },
]);

const group2 = ref([
  { icon: 'mdi-magnify', value: 'search', route: '/perfil/friend-store' },
  { icon: 'mdi-account-group', value: 'group', route: '/perfil/friend-storelist' },
]);

const group3 = ref([
  { icon: 'mdi-cog-outline', value: 'settings', route: '/perfil/perfil-settings' },
  { icon: 'mdi-logout', value: 'logout', route: '/Perfil' },
]);
</script>
