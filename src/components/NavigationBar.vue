<template>
  <v-container max-width="800" style="min-width: 360px;" class="d-md-none pa-4">
    <v-card rounded="lg" elevation="3" class="mx-auto py-4 px-6 d-flex justify-center">
      <v-row justify="space-between" align="center" class="py-2" style="max-width: 800px;">
        <!-- Grupo 1: Profile e Edit -->
        <template v-for="(button, i) in buttons" :key="button.value">
          <v-btn :icon="button.icon" @click="navigateTo(button.route)">
          </v-btn>
          <v-divider v-if="i % 2 === 0 && i != 4" vertical="true"></v-divider>

        </template>

      </v-row>
    </v-card>
  </v-container>

  <v-container max-width="800" style="min-width: 360px;" class="d-none d-md-flex">
    <v-card color="primary" rounded="lg" elevation="3" class="mx-auto py-4 px-6 d-flex justify-center ">
      <v-row justify="space-between" align="center" class="py-2" style="max-width: 800px;">
        <!-- Grupo 1: Profile e Edit -->
        <template v-for="(button,) in buttons" :key="button.value">
          <v-btn class="mx-1" rounded @click="navigateTo(button.route)">
            <v-icon style="font-size: 24px;">{{ button.icon }}</v-icon>
            <span> {{ button.text }} </span>
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
const buttons = ref([
  { icon: 'mdi-account', value: 'PerfilHome', route: '/perfil/home', text: "perfil" },
  { icon: 'mdi-magnify', value: 'search', route: '/perfil/friend-store', text: "search users" },
  { icon: 'mdi-account-group', value: 'group', route: '/perfil/friend-storelist', text: "friends" },
  { icon: 'mdi-cog-outline', value: 'settings', route: '/perfil/perfil-settings', text: "user config" },
  { icon: 'mdi-logout', value: 'logout', route: '/Perfil', text: "logout" },
]);

</script>
