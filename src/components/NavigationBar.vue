<template>
  <v-container max-width="800" style="min-width: 360px;" class="d-md-none pa-4">
    <v-card rounded="lg" elevation="3" class="mx-auto py-4 px-6 d-flex justify-center">
      <v-row justify="space-between" align="center" class="py-2" style="max-width: 800px;">
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

        <template v-for="(button,) in group25" :key="button.value">
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

        <template v-for="(button,) in group4" :key="button.value">
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

  <v-container max-width="800" style="min-width: 360px;" class="d-none d-md-flex">
    <v-card rounded="lg" elevation="3" class="mx-auto py-4 px-6 d-flex justify-center ">
      <v-row justify="space-between" align="center" class="py-2" style="max-width: 800px;">
        <!-- Grupo 1: Profile e Edit -->
        <template v-for="(button,) in group1" :key="button.value">
          <v-btn
          rounded
           class=".d-none .d-md-flex .d-lg-none"
          :class="{ 'text-primary': activeButton === button.value }"
           @click="navigateTo(button.route)"
            >
            <v-icon style="font-size: 24px;">{{ button.icon }}</v-icon>
            <span class="ml-0 d-none d-md-inline"> PROFILE </span>
           </v-btn>
        </template>


        <!-- Grupo 2: Search e Group -->
        <template v-for="(button,) in group2" :key="button.value">
          <v-btn
          rounded
           class="d-flex align-center "
          :class="{ 'text-primary': activeButton === button.value }"
           @click="navigateTo(button.route)"
            >
            <v-icon style="font-size: 24px;">{{ button.icon }}</v-icon>
            <span class="ml-1 d-none d-md-inline">SEARCH USERS</span>
           </v-btn>
        </template>

        <template v-for="(button,) in group25" :key="button.value">
          <v-btn
          rounded
           class="d-flex align-center pa-3"
          :class="{ 'text-primary': activeButton === button.value }"
           @click="navigateTo(button.route)"
            >
            <v-icon style="font-size: 24px;">{{ button.icon }}</v-icon>
            <span class="ml-1 d-none d-md-inline">FRIENDS</span>
           </v-btn>
        </template>



        <!-- Grupo 3: Settings e Logout -->
        <template v-for="(button,) in group3" :key="button.value">
          <v-btn
          rounded
           class="d-flex align-center pa-3"
          :class="{ 'text-primary': activeButton === button.value }"
           @click="navigateTo(button.route)"
            >
            <v-icon style="font-size: 24px;">{{ button.icon }}</v-icon>
            <span class="ml-1 d-none d-md-inline">USER CONFIG</span>
           </v-btn>
        </template>

        <template v-for="(button,) in group4" :key="button.value">
          <v-btn
          rounded
           class="d-flex align-center pa-3"
          :class="{ 'text-primary': activeButton === button.value }"
           @click="navigateTo(button.route)"
            >
            <v-icon style="font-size: 24px;">{{ button.icon }}</v-icon>
            <span class="ml-2 d-none d-md-inline">LOGOUT</span>
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
  //{ icon: 'mdi-square-edit-outline', value: 'edit', route: '/Perfil' },
]);

const group2 = ref([
  { icon: 'mdi-magnify', value: 'search', route: '/perfil/friend-store' },
]);

const group25 = ref([
  { icon: 'mdi-account-group', value: 'group', route: '/perfil/friend-storelist' },
]);

const group3 = ref([
  { icon: 'mdi-cog-outline', value: 'settings', route: '/perfil/perfil-settings' },
]);

const group4 = ref([
{ icon: 'mdi-logout', value: 'logout', route: '/Perfil' },
]);
</script>
