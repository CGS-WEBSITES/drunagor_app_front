<template>
  <v-container 
    v-if="!isCampaignRoute && !isHeroesRoute" 
    class="d-sm-none pa-4 safe-pwa-top"
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
        <template v-for="(button, i) in buttons" :key="i">
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
            <span> {{ $t(button.translationKey) }} </span>
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
import { CampaignStore } from "@/store/CampaignStore";

const { t, locale } = useI18n();
const { mobile } = useDisplay(); // Adicionado para garantir que isMobile funcione

const router = useRouter();
const route = useRoute();

const isMobile = computed(() => mobile.value);

const isCampaignRoute = computed(() => route.name === 'Campaign');

const campaignStore = CampaignStore();
const campaign = computed(() => {
  if (route.name === 'Campaign' && route.params.id) {
    return campaignStore.findOptional(String(route.params.id));
  }
  return null;
});

const isImmersiveMode = computed(() => {
  if (!campaign.value) return false;
  if (campaign.value.campaign === 'underkeep2') return true;
  const wing = (campaign.value.wing || "").toUpperCase();
  return wing.includes("WING 1") || wing.includes("WING 2") || wing.includes("WING 01") || wing.includes("WING 02") || wing.includes("TUTORIAL");
});

// Nova lógica: Verifica se é a página de heróis pelo nome ou pelo path
const isHeroesRoute = computed(() => 
  route.name === 'HeroesManager' || 
  route.path.includes('/campaign-tracker/heroes')
);

const navigateTo = (route: string) => {
  router.push(route);
};

const buttons = ref([
  {
    iconType: "image",
    icon: new URL("@/assets/randomiicon.png", import.meta.url).href,
    value: "Campaign Overview",
    route: "/campaign-tracker/randomizer",
    translationKey: "menu.random-monster",
  },
  {
    iconType: "mdi",
    icon: "mdi-sword",
    value: "Campaign Overview",
    route: "/campaign-tracker/",
    translationKey: "menu.campaign",
  },
  {
    iconType: "mdi",
    icon: "mdi-book-search-outline",
    value: "Keyword",
    route: "/campaign-tracker/keyword",
    translationKey: "menu.keyword",
  },
  {
    iconType: "mdi",
    icon: "mdi-package-variant-closed",
    value: "settings",
    route: "/campaign-tracker/configuration",
    translationKey: "menu.settings",
  },
]);
</script>

<style scoped>
.safe-pwa-top {
  padding-top: calc(env(safe-area-inset-top, 0px) + 16px) !important;
}
</style>