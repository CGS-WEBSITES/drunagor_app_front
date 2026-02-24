<template>
  <v-container v-if="isCampaignRoute" class="d-flex pa-4 justify-end">
    <v-btn
      class="mx-1 ml-md-6"
      rounded
      @click="goBack"
      variant="elevated"
      :size="isMobile ? 'small' : 'default'"
    >
      <v-icon class="mr-2" style="font-size: 24px">mdi-arrow-left</v-icon>
      <span> Return to Campaign List </span>
    </v-btn>
  </v-container>

  <v-container 
    v-if="!isCampaignRoute && !isHeroesRoute" 
    class="d-sm-none pa-4"
  >
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
        style="max-width: 800px"
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
                style="object-fit: contain"
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

  <v-container
    v-if="!isCampaignRoute && !isHeroesRoute"
    max-width="800"
    style="min-width: 360px"
    class="d-none d-sm-flex"
  >
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
        style="max-width: 800px"
      >
        <template v-for="(button, i) in buttons" :key="button.value">
          <v-btn class="mx-1" rounded @click="navigateTo(button.route)">
            <template v-if="button.iconType === 'image'">
              <v-img
                :src="button.icon"
                width="24"
                height="24"
                class="mr-2"
                style="object-fit: contain"
              />
            </template>
            <template v-else>
              <v-icon class="mr-2" style="font-size: 24px">{{
                button.icon
              }}</v-icon>
            </template>
            <span> {{ button.text }} </span>
          </v-btn>
        </template>
      </v-row>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter, useRoute } from "vue-router";
import { useDisplay } from "vuetify"; // Import necessário para isMobile se não estiver global

const { t, locale } = useI18n();
const { mobile } = useDisplay(); // Adicionado para garantir que isMobile funcione

const router = useRouter();
const route = useRoute();

const isMobile = computed(() => mobile.value);

const isCampaignRoute = computed(() => route.name === 'Campaign');

// Nova lógica: Verifica se é a página de heróis pelo nome ou pelo path
const isHeroesRoute = computed(() => 
  route.name === 'HeroesManager' || 
  route.path.includes('/campaign-tracker/heroes')
);

const navigateTo = (route: string) => {
  router.push(route);
};

const goBack = () => {
  router.push({ name: 'Campaign Overview' });
};

const buttons = ref([
  {
    iconType: "image",
    icon: new URL("@/assets/randomiicon.png", import.meta.url).href,
    value: "Campaign Overview",
    route: "/campaign-tracker/randomizer",
    text: "Randomize",
  },
  {
    iconType: "mdi",
    icon: "mdi-sword",
    value: "Campaign Overview",
    route: "/campaign-tracker/",
    text: "Campaign",
  },
  {
    iconType: "mdi",
    icon: "mdi-book-search-outline",
    value: "Keyword",
    route: "/campaign-tracker/keyword",
    text: "Keywords",
  },
  {
    iconType: "mdi",
    icon: "mdi-cog-outline",
    value: "settings",
    route: "/campaign-tracker/configuration",
    text: "Settings",
  },
]);
</script>