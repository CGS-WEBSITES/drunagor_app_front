<script setup lang="ts">
import { ref, watch, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { HeroStore } from "@/store/HeroStore";
import { SequentialAdventureState } from "@/store/Hero";
import { HeroDataRepository } from "@/data/repository/HeroDataRepository";
import type { HeroData } from "@/data/repository/HeroData";
import CampaignSavePut from "@/components/CampaignSavePut.vue";

// O mapeamento de ícones para recursos foi removido.

// Constantes e configurações
const RESOURCE_DEFINITIONS = [
  { id: "focus", translation_key: "label.focus" },
  { id: "fruit-of-life", translation_key: "label.fruit-of-life" },
  { id: "ki", translation_key: "label.ki" },
  { id: "shield", translation_key: "label.shield" },
  { id: "fury", translation_key: "label.fury" },
];

// Inicialização de dependências
const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const heroStore = HeroStore();
const heroDataRepository = new HeroDataRepository();

const savePutRef = ref();

const emit = defineEmits(["save-campaign"]);

// Obtenção de parâmetros da rota
const heroId = route.params.heroId.toString();
const campaignId = route.params.campaignId.toString();

// Dados do herói
const hero = computed<HeroData>(
  () => heroDataRepository.find(heroId) ?? ({} as HeroData)
);

// Estado da aventura sequencial
const sequentialAdventureState = ref<SequentialAdventureState>(
  initSequentialAdventureState()
);

function initSequentialAdventureState(): SequentialAdventureState {
  const currentState = heroStore.findInCampaign(
    heroId,
    campaignId
  )?.sequentialAdventureState;

  if (currentState) {
    if (currentState.lifepoints === undefined) {
      currentState.lifepoints = 0;
    }

    RESOURCE_DEFINITIONS.forEach((resource) => {
      if (currentState.resources[resource.id] === undefined) {
        currentState.resources[resource.id] = 0;
      }
    });
    return currentState;
  }

  return new SequentialAdventureState();
}

function saveAndGoBack() {
  if (savePutRef.value && savePutRef.value.save) {
    savePutRef.value.save().then(() => {
      router.go(-1);
    });
  } else {
    router.go(-1);
  }
}

// Persistência automática do estado
watch(
  sequentialAdventureState,
  (newState) => {
    const campaignHero = heroStore.findInCampaign(heroId, campaignId);
    if (campaignHero) {
      campaignHero.sequentialAdventureState = newState;
    }
  },
  { deep: true }
);
</script>

<template>
  <v-row no-gutters class="pt-6">
    <v-col cols="12" class="d-flex justify-center pb-4">
      <v-btn variant="elevated" color="primary" @click="saveAndGoBack">
        {{ t("Save Changes") }}
      </v-btn>
    </v-col>
  </v-row>

  <CampaignSavePut
    ref="savePutRef"
    :campaign-id="campaignId"
    style="display: none"
  />

  <v-row no-gutters>
    <v-col cols="12" class="d-flex align-center justify-center">
      <v-card
        elevation="16"
        rounded
        style="background-color: #1f2937"
        width="800px"
        class="hero-list-item rounded-t-xl"
      >
        <v-img :src="hero.images?.trackerInfo" class="rounded-0" contain />

        <v-card-text>
          <v-row no-gutters class="px-6">
            <v-col cols="12" class="py-4">
              <v-number-input
                :model-value="sequentialAdventureState.lifepoints"
                @update:model-value="
                  (val) => (sequentialAdventureState.lifepoints = val)
                "
                :label="t('label.lifepoints', 'Life Points')"
                :min="0"
                :max="99"
                variant="outlined"
                controlVariant="split"
              >
                <template #prepend-inner>
                  <v-icon color="red-lighten-2">mdi-heart</v-icon>
                </template>
              </v-number-input>
            </v-col>

            <v-col cols="12" class="py-3">
              <v-number-input
                :model-value="sequentialAdventureState.curseCubes"
                @update:model-value="
                  (val) => (sequentialAdventureState.curseCubes = val)
                "
                :label="t('text.curse-cubes')"
                :min="0"
                :max="5"
                variant="outlined"
                controlVariant="split"
              >
                <template #prepend-inner>
                  <v-icon color="grey-darken-1">mdi-cube</v-icon>
                </template>
              </v-number-input>
            </v-col>

            <v-col cols="12" class="py-3">
              <v-number-input
                :model-value="sequentialAdventureState.traumaCubes"
                @update:model-value="
                  (val) => (sequentialAdventureState.traumaCubes = val)
                "
                :label="t('text.trauma-cubes')"
                :min="0"
                :max="1"
                variant="outlined"
                controlVariant="split"
              >
                <template #prepend-inner>
                  <v-icon color="purple-lighten-2">mdi-cube</v-icon>
                </template>
              </v-number-input>
            </v-col>

            <v-col cols="12" class="py-3">
              <v-number-input
                :model-value="sequentialAdventureState.availableCubes"
                @update:model-value="
                  (val) => (sequentialAdventureState.availableCubes = val)
                "
                label="Available Cubes"
                :min="0"
                :max="20"
                variant="outlined"
                controlVariant="split"
              >
                <template #prepend-inner>
                  <div class="d-flex align-center mr-2">
                    <v-icon size="x-small" color="yellow-darken-2">mdi-cube</v-icon>
                    <v-icon size="x-small" color="red-darken-2">mdi-cube</v-icon>
                    <v-icon size="x-small" color="green-darken-2">mdi-cube</v-icon>
                    <v-icon size="x-small" color="blue-darken-2">mdi-cube</v-icon>
                  </div>
                </template>
              </v-number-input>
            </v-col>

            <v-col cols="12" class="py-3">
              <v-number-input
                :model-value="sequentialAdventureState.usedCubes"
                @update:model-value="
                  (val) => (sequentialAdventureState.usedCubes = val)
                "
                label="Used Cubes"
                :min="0"
                :max="20"
                variant="outlined"
                controlVariant="split"
              >
                <template #prepend-inner>
                  <div class="faded-cubes d-flex align-center mr-2">
                    <v-icon size="x-small" color="yellow-darken-2">mdi-cube</v-icon>
                    <v-icon size="x-small" color="red-darken-2">mdi-cube</v-icon>
                    <v-icon size="x-small" color="green-darken-2">mdi-cube</v-icon>
                    <v-icon size="x-small" color="blue-darken-2">mdi-cube</v-icon>
                  </div>
                </template>
              </v-number-input>
            </v-col>

            <v-col cols="12"><v-divider class="my-4" /></v-col>
            <v-col cols="12" class="pb-4 text-center text-h5">
              {{ t("label.resources") }}
            </v-col>

            <v-col cols="12" v-for="resource in RESOURCE_DEFINITIONS" :key="resource.id">
              <v-number-input
                :model-value="sequentialAdventureState.resources[resource.id]"
                @update:model-value="
                  (val) => (sequentialAdventureState.resources[resource.id] = val)
                "
                :label="t(resource.translation_key)"
                :min="0"
                :max="4"
                variant="outlined"
                controlVariant="split"
                class="mb-4"
              />
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>

  <v-row no-gutters class="pt-6">
    <v-col cols="12" class="d-flex justify-center pb-4">
      <v-btn variant="elevated" color="primary" @click="saveAndGoBack">
        {{ t("Save Changes") }}
      </v-btn>
    </v-col>
  </v-row>
</template>

<style scoped>
.faded-cubes {
  opacity: 0.5;
  filter: grayscale(50%);
}
</style>