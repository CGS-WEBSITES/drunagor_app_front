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

  <template v-else-if="!isHeroesRoute">
    
    <v-container class="d-sm-none pa-4" style="margin-top: 65px">
      <v-card
        color="primary"
        rounded="lg"
        elevation="3"
        class="mx-auto py-3 px-2 justify-center"
      >
        <v-row
          justify="center" 
          align="center"
          class="py-2 pl-3" 
        >
          <template v-for="(button, i) in buttons" :key="button.value">
            <v-btn 
              class="mx-2 pa-0" 
              rounded="circle"
              @click="navigateTo(button.route)"
              width="52"
              height="52"
              min-width="52"
              elevation="2"
            >
              <template v-if="button.iconType === 'image'">
                <v-img
                  :src="button.icon"
                  width="30"
                  height="30"
                  contain
                />
              </template>
              <template v-else>
                <v-icon size="30">{{ button.icon }}</v-icon>
              </template>
            </v-btn>
          </template>
        </v-row>
      </v-card>
    </v-container>

    <v-container
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
                  contain
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
</template>

<script setup lang="ts">
// ... (O script permanece o mesmo)
import { ref, computed } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter, useRoute } from "vue-router";
import { useDisplay } from "vuetify";

const { t, locale } = useI18n();
const { mobile } = useDisplay();
const isMobile = computed(() => mobile.value);

const router = useRouter();
const route = useRoute();

const isCampaignRoute = computed(() => route.name === 'Campaign');
const isHeroesRoute = computed(() => route.path.includes('/campaign-tracker/heroes'));

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