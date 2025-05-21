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
  {
    iconType: 'image',
    icon: new URL('@/assets/randomiicon.png', import.meta.url).href,
    value: 'Campaign Overview',
    route: '/campaign-tracker/randomizer',
    text: "Randomize"
  },
  {
    iconType: 'mdi',
    icon: 'mdi-sword',
    value: 'Campaign Overview',
    route: '/campaign-tracker/',
    text: "Campaign"
  },
  {
    iconType: 'mdi',
    icon: 'mdi-book-search-outline',
    value: 'Keyword',
    route: '/campaign-tracker/keyword',
    text: "Keywords"
  },
  {
    iconType: 'mdi',
    icon: 'mdi-cog-outline',
    value: 'settings',
    route: '/campaign-tracker/configuration',
    text: "Settings"
  }
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
  <!-- MOBILE -->
  <v-container class="d-md-none pa-4">
  <v-card
    color="primary"
    rounded="lg"
    elevation="3"
    class="mx-auto py-4 px-6 d-flex justify-center"
  >
    <v-row
      justify="space-between"
      align="center"
      class="py-2"
      style="max-width: 800px;"
    >
      <template v-for="(button, i) in buttons" :key="button.value">
        <v-btn
  icon
  @click="navigateTo(button.route)"
  class="mx-1"
  width="56"
  height="56"
>
  <template v-if="button.iconType === 'image'">
    <v-img
      :src="button.icon"
      width="32"
      height="32"
      style="object-fit: contain;"
    />
  </template>
  <template v-else>
    <v-icon size="32">{{ button.icon }}</v-icon>
  </template>
</v-btn>
      </template>
    </v-row>
  </v-card>
</v-container>


<!-- DESKTOP -->
<v-container max-width="800" style="min-width: 360px;" class="d-none d-md-flex">
  <v-card color="primary" rounded="lg" elevation="3" class="mx-auto py-4 px-6 d-flex justify-center">
    <v-row justify="space-between" align="center" class="py-2" style="max-width: 800px;">
      <template v-for="(button, i) in buttons" :key="button.value">
        <v-btn class="mx-1" rounded @click="navigateTo(button.route)">
          <template v-if="button.iconType === 'image'">
            <v-img :src="button.icon" width="24" height="24" class="mr-2" style="object-fit: contain;" />
          </template>
          <template v-else>
            <v-icon class="mr-2" style="font-size: 24px;">{{ button.icon }}</v-icon>
          </template>
          <span> {{ button.text }} </span>
        </v-btn>
      </template>
    </v-row>
  </v-card>
</v-container>
</template>

