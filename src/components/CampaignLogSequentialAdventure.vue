<script setup lang="ts">
import { computed, ref } from "vue";
import { HeroStore } from "@/store/HeroStore";
import { useRouter } from "vue-router";
import { SequentialAdventureState } from "@/store/Hero";
import type { HeroData } from "@/data/repository/HeroData";
import { useI18n } from "vue-i18n";

const props = defineProps<{
  hero: HeroData;
  campaignId: string;
}>();

const heroStore = HeroStore();
const router = useRouter();
const { t } = useI18n();

const sequentialAdventureState = ref({} as SequentialAdventureState);
sequentialAdventureState.value =
  heroStore.findInCampaign(props.hero.id, props.campaignId)
    ?.sequentialAdventureState ?? new SequentialAdventureState();

const resourceDisplay = computed(() => {
  const resources = sequentialAdventureState.value?.resources;
  const resourcesToDisplay = [] as any[];

  for (const resource in resources) {
    if (resources[resource] > 0) {
      resourcesToDisplay.push({
        name: resource,
        count: resources[resource],
      });
    }
  }
  return resourcesToDisplay;
});

function openSequentialStateEditor() {
  router.push({
    name: "HeroSequentialState",
    params: { campaignId: props.campaignId, heroId: props.hero.id },
  });
}
</script>

<template>
  <v-row
    no-gutters
    id="seq-adv"
    @click="openSequentialStateEditor"
    class="cursor-pointer justify-center"
  >
    <v-col cols="6" class="px-2">
      <v-sheet
        rounded
        border="md"
        class="mb-6 pa-6 text-white"
        width="100%"
        style="background-color: #1f2937 !important"
      >
        <div class="text-h6 text-center">{{ sequentialAdventureState.curseCubes }}</div>
        <v-divider class="my-2"></v-divider>
        <div class="text-center text-body-2">
          {{ t("text.curse-cubes") }}
        </div>
      </v-sheet>
    </v-col>

    <v-col cols="6" class="px-2">
      <v-sheet
        rounded
        border="md"
        class="mb-6 pa-6 text-white"
        width="100%"
        style="background-color: #1f2937 !important"
      >
        <div class="text-h6 text-center">
          {{ sequentialAdventureState.traumaCubes }}
        </div>
        <v-divider class="my-2"></v-divider>
        <div class="text-center text-body-2">
          {{ t("text.trauma-cubes") }}
        </div>
      </v-sheet>
    </v-col>

    <v-col cols="12" class="px-2">
      <v-sheet
        rounded
        border="md"
        class="mb-6 pa-6 text-white"
        width="100%"
        style="background-color: #1f2937 !important"
      >
        <div id="resources" v-if="resourceDisplay.length > 0">
          <div
            v-for="resource in resourceDisplay"
            :key="resource.name"
            class="text-center text-body-1"
          >
            {{ resource.count }} - {{ t(resource.name) }}
          </div>
        </div>
        <div class="text-center font-italic" v-else>
          {{ t("text.no-resources") }}
        </div>
        <v-divider class="my-2"></v-divider>
        <div class="text-center text-body-2">{{ t("label.resources") }}</div>
      </v-sheet>
    </v-col>
  </v-row>

  <v-row no-gutters class="justify-center">
    <v-col cols="6" class="px-2">
      <v-sheet
        rounded
        border="md"
        class="mb-6 pa-6 text-white"
        width="100%"
        style="background-color: #1f2937 !important"
      >
        <div class="text-h6 text-center">{{ sequentialAdventureState.availableCubes }}</div>
        <v-divider class="my-2"></v-divider>
        <div class="text-center text-body-2">{{ t('Available Cubes') }}</div>
      </v-sheet>
    </v-col>

    <v-col cols="6" class="px-2">
      <v-sheet
        rounded
        border="md"
        class="mb-6 pa-6 text-white"
        width="100%"
        style="background-color: #1f2937 !important"
      >
        <div class="text-h6 text-center">{{ sequentialAdventureState.usedCubes }}</div>
        <v-divider class="my-2"></v-divider>
        <div class="text-center text-body-2">{{ t('Used Cubes') }}</div>
      </v-sheet>
    </v-col>
    
    <v-col cols="12" class="px-2 pb-4">

        <v-btn
          @click.stop="openSequentialStateEditor"
          variant="elevated"
          color="secundary"
          rounded
        >
          {{ t('Manage Resources') }}
        </v-btn>

    </v-col>
  </v-row>
</template>

<style scoped>
</style>
