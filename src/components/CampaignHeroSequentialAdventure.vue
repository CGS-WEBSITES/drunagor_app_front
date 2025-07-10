<script setup lang="ts">
import { ref, watch, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { HeroStore } from "@/store/HeroStore";
import { SequentialAdventureState } from "@/store/Hero";
import { HeroDataRepository } from "@/data/repository/HeroDataRepository";
import type { HeroData } from "@/data/repository/HeroData";
import CampaignSavePut from "@/components/CampaignSavePut.vue";

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

const emit = defineEmits(['save-campaign']);

// Obtenção de parâmetros da rota
const heroId = route.params.heroId.toString();
const campaignId = route.params.campaignId.toString();

// Dados do herói
const hero = computed<HeroData>(
  () => heroDataRepository.find(heroId) ?? ({} as HeroData),
);

// Estado da aventura sequencial
const sequentialAdventureState = ref<SequentialAdventureState>(
  initSequentialAdventureState(),
);

function initSequentialAdventureState(): SequentialAdventureState {
  const currentState = heroStore.findInCampaign(
    heroId,
    campaignId,
  )?.sequentialAdventureState;

  if (currentState) {
    if (currentState.lifepoints === undefined) {
      currentState.lifepoints = 0;
    }

    // Garante que todos os recursos existam no estado
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
  { deep: true },
);
</script>

<template>
  <v-row no-gutters>
    <v-col cols="12" class="py-6">
      <v-btn variant="outlined" @click="saveAndGoBack">
        {{ t("Save Changes") }}
      </v-btn>
    </v-col>

    <CampaignSavePut
      ref="savePutRef"
      :campaign-id="campaignId"
      style="display: none"
    />

    <v-col cols="12">
      <v-card
        elevation="16"
        rounded
        class="hero-list-item"
        :style="{ backgroundColor: '#1f2937' }"
      >
        <v-card-title class="text-h5 px-2">
          {{ hero.name }}
          <v-divider />
        </v-card-title>

        <v-card-text class="px-2">
          <v-row no-gutters>
            <v-col cols="2">
              <v-avatar :image="hero.images?.avatar" size="65" />
            </v-col>
            <v-col cols="10">
              <p>
                {{ t(`label.${hero.race?.toLowerCase()}`) }}
                {{ t(`label.${hero.class?.toLowerCase().replace(" ", "-")}`) }}
              </p>
              <p>
                {{ t("text.path-of") }}
                {{ t(`label.${hero.path?.toLowerCase()}`) }}
              </p>
            </v-col>

            <v-col cols="12" class="py-3">
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
              />
            </v-col>
            <template
              v-for="(cube, index) in [
                { id: 'curseCubes', label: 'text.curse-cubes', min: 0, max: 5 },
                {
                  id: 'traumaCubes',
                  label: 'text.trauma-cubes',
                  min: 0,
                  max: 1,
                },
                {
                  id: 'availableCubes',
                  label: 'Available Cubes',
                  min: 0,
                  max: 20,
                },
                { id: 'usedCubes', label: 'Used Cubes', min: 0, max: 20 },
              ]"
              :key="index"
            >
              <v-col cols="12" class="py-3">
                <v-number-input
                  :model-value="sequentialAdventureState[cube.id]"
                  @update:model-value="
                    (val) => (sequentialAdventureState[cube.id] = val)
                  "
                  :label="t(cube.label)"
                  :min="cube.min"
                  :max="cube.max"
                  variant="outlined"
                  controlVariant="split"
                />
              </v-col>
            </template>

            <v-divider />

            <v-col cols="12" class="py-6 text-center text-h6">
              {{ t("label.resources") }}
            </v-col>

            <v-col cols="12">
              <v-number-input
                v-for="resource in RESOURCE_DEFINITIONS"
                :key="resource.id"
                :model-value="sequentialAdventureState.resources[resource.id]"
                @update:model-value="
                  (val) =>
                    (sequentialAdventureState.resources[resource.id] = val)
                "
                :label="t(resource.translation_key)"
                :min="0"
                :max="4"
                variant="outlined"
                :id="resource.id"
                controlVariant="split"
                class="mb-4"
              />
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<style scoped>
.hero-list-item {
  padding: 0 16px 16px;
  background-image: url("@/assets/hero/flag-bg-red.webp");
  background-repeat: no-repeat;
  background-origin: content-box;
}
</style>