<script setup lang="ts">
import { ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";

const { t, locale } = useI18n();
/*

const router = useRouter();

const items = ref(getMenuItems());

function getMenuItems() {
  return [
    {
      label: t("menu.random-monster"),
      icon: "mdi-help",
      command: () => {
        router.push({ name: "CampaignTracker" });
      },
    },
    {
      label: t("menu.campaign"),
      icon: "mdi-account-group",
      command: () => {
        router.push({ name: "Campaign Overview" });
      },
    },
    {
      label: t("menu.keyword"),
      icon: "mdi-magnify",
      command: () => {
        router.push({ name: "Keyword" });
      },
    },
    {
      label: t("menu.settings"),
      icon: "mdi-cog",
      command: () => {
        router.push({ name: "Configuration" });
      },
    },
  ];
}

watch(locale, () => {
  items.value = getMenuItems();
});
*/

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
  { icon: 'mdi-help', value: 'CampaignTracker', route: '/campaign-tracker', text: "Randomize"},
  { icon: 'mdi-account-group', value: 'CampaignOverview', route: '/campaign-tracker/campaign', text: "Campaign" },
  { icon: 'mdi-magnify', value: 'Keyword', route: '/campaign-tracker/keyword', text: "Keywords" },
  { icon: 'mdi-cog-outline', value: 'settings', route: '/campaign-tracker/configuration', text: "Settings" },
]);





</script>

<!--
<template>
  
  <div class="card sticky top-0 z-20">
    <v-container max-width="800" style="min-width: 360px;" class="d-none d-md-flex">
      <v-card rounded="lg" elevation="3" class="mx-auto py-4 px-6 d-flex justify-center ">
    <v-tool-bar density="compact" class="d-flex justify-center">
      <v-btn
        color="black"
        class="mx-1 elevation-4"
        v-for="(item, i) in items"
        :key="i"
        @click="item.command()"
        :prepend-icon="item.icon"
        >{{ item.label }}
      </v-btn>
    </v-tool-bar>
  </v-card>
</v-container>


<v-container class="d-md-none">
    <v-row justify="space-between" align="center" class="ml-1 pb-4" style="max-width: 800px;">
      <v-btn
        color="black"
        class="mx-1 elevation-0"
        v-for="(item, i) in items"
        :key="i"
        @click="item.command()"
        :prepend-icon="item.icon"
        > 
      </v-btn>
  </v-row>
</v-container>



    
  </div>
</template>
-->


<template>
  <v-container max-width="800" style="min-width: 360px;" class="d-md-none pa-4">
    <v-card rounded="lg" elevation="3" class="mx-auto py-4 px-6 d-flex justify-center">
      <v-row justify="space-between" align="center" class="py-2" style="max-width: 800px;">
        <!-- Grupo 1: Profile e Edit -->
        <template v-for="(button, i) in buttons" :key="button.value">
          <v-btn :icon="button.icon" @click="navigateTo(button.route)">
          </v-btn>

        </template>

      </v-row>
    </v-card>
  </v-container>

  <v-container max-width="800" style="min-width: 360px;" class="d-none d-md-flex">
    <v-card rounded="lg" elevation="3" class="mx-auto py-4 px-6 d-flex justify-center ">
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

