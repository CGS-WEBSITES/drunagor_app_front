<template>
  <v-expansion-panels variant="accordion" class="mb-2">
    <v-expansion-panel elevation="16" rounded style="background-color: #1f2937">
      <v-expansion-panel-title
        class="pa-3 hero-background-title"
        :style="heroBackgroundStyle"
      >
      </v-expansion-panel-title>

      <v-expansion-panel-text class="pa-0">
        <v-card-text class="px-4 pt-3 pb-2 position-relative">
          <v-row no-gutters>
            <v-col cols="12" class="position-relative">
              <div class="action-buttons-container">
                <v-btn
                  @click.stop="openSequentialStateEditor"
                  variant="elevated"
                  color="secondary"
                  rounded
                  class="action-btn manage-btn shepherd-btn-manage-resources"
                  size="small"
                >
                  {{ t("Manage Resources") }}
                </v-btn>

                <v-btn
                  @click.stop="openHeroEquipmentSkills"
                  variant="elevated"
                  color="primary"
                  rounded
                  class="action-btn ml-2 shepherd-btn-equipment-skills"
                  size="small"
                >
                  {{ t("label.equipment-skills") }}
                </v-btn>
              </div>
            </v-col>
          </v-row>
        </v-card-text>

        <v-card-actions class="pa-0">
          <v-row no-gutters>
            <v-col cols="12">
              <v-tabs v-model="activeTab" bg-color="transparent" grow>
                <v-tab value="resources">
                  {{ t("Manage Resources") }}
                </v-tab>
                <v-tab value="equipment">
                  {{ t("label.equipment-skills") }}
                </v-tab>
              </v-tabs>

              <v-tabs-window v-model="activeTab">
                <v-tabs-window-item value="resources">
                  <StandaloneHeroLogSequentialAdventure
                    :playable-heroes-pk="playableHeroesPk"
                    :hero-static-data="heroStaticData"
                  />
                </v-tabs-window-item>

                <v-tabs-window-item value="equipment">
                  <StandaloneHeroLogEquipment
                    :playable-heroes-pk="playableHeroesPk"
                    :hero-static-data="heroStaticData"
                  />
                </v-tabs-window-item>
              </v-tabs-window>
            </v-col>
          </v-row>
        </v-card-actions>

        <v-card-actions class="px-4 pb-3 pt-1 d-flex justify-end">
          <v-btn
            size="small"
            variant="text"
            color="error"
            @click.stop="$emit('remove')"
          >
            <v-icon start>mdi-delete-outline</v-icon>
            {{ t("label.remove-hero") || "Remove Hero" }}
          </v-btn>
        </v-card-actions>
      </v-expansion-panel-text>
    </v-expansion-panel>
  </v-expansion-panels>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { usePlayableHeroStore } from "@/store/PlayableHeroStore";
import { HeroDataRepository } from "@/data/repository/HeroDataRepository";
import type { HeroData } from "@/data/repository/HeroData";
import StandaloneHeroLogSequentialAdventure from "@/components/StandaloneHeroLogSequentialAdventure.vue";
import StandaloneHeroLogEquipment from "@/components/StandaloneHeroLogEquipment.vue";

const props = defineProps<{
  playableHeroesPk: number;
}>();

defineEmits<{
  (e: "remove"): void;
}>();

const { t } = useI18n();
const router = useRouter();
const playableHeroStore = usePlayableHeroStore();
const heroDataRepository = new HeroDataRepository();

const activeTab = ref("resources");

const heroView = computed(() =>
  playableHeroStore.findByPk(props.playableHeroesPk),
);
const heroStaticData = computed<HeroData | null>(() => {
  if (!heroView.value?.heroId) return null;
  return heroDataRepository.find(heroView.value.heroId) ?? null;
});

const heroBackgroundStyle = computed(() => ({
  backgroundImage: `url(${heroStaticData.value?.images?.trackerInfo || heroStaticData.value?.images?.background || ""})`,
  backgroundSize: "cover", // MUDANÇA: 'cover' garante que a imagem preencha todo o espaço sem distorcer ou sobrar espaço
  backgroundPosition: "center top",
  backgroundRepeat: "no-repeat",
}));

function openSequentialStateEditor() {
  router.push({
    name: "StandaloneHeroSequentialState",
    params: { heroId: props.playableHeroesPk.toString() },
  });
}

function openHeroEquipmentSkills() {
  router.push({
    name: "StandaloneHero",
    params: { heroId: props.playableHeroesPk.toString() },
  });
}
</script>

<style scoped>
.action-buttons-container {
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  flex-wrap: wrap;
  /* margin-left removido para corrigir alinhamento torto */
}

.action-btn {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3) !important;
  min-width: auto !important;
  white-space: nowrap;
  transition: all 0.2s ease;
  flex: 0 0 auto;
}

.action-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.4) !important;
}

/* Ajustes de responsividade dos botões */
@media (max-width: 360px) {
  .action-buttons-container {
    width: 100%;
    gap: 4px;
  }
  .action-btn {
    font-size: 0.65rem !important;
    padding: 2px 4px !important;
    height: 24px !important;
    min-width: 60px !important;
  }
}

@media (min-width: 361px) and (max-width: 480px) {
  .action-btn {
    font-size: 0.7rem !important;
    padding: 2px 6px !important;
    height: 26px !important;
    min-width: 80px !important;
  }
}

@media (min-width: 481px) and (max-width: 640px) {
  .action-btn {
    font-size: 0.75rem !important;
    padding: 4px 8px !important;
    height: 28px !important;
    min-width: 90px !important;
  }
}

@media (min-width: 641px) and (max-width: 768px) {
  .action-btn {
    font-size: 0.8rem !important;
    padding: 4px 8px !important;
    height: 30px !important;
    min-width: 100px !important;
  }
}

@media (min-width: 769px) and (max-width: 1024px) {
  .action-btn {
    font-size: 0.85rem !important;
    padding: 6px 12px !important;
    height: 32px !important;
  }
}

.position-relative {
  position: relative;
}

/* Altura da imagem do herói */
.hero-background-title {
  position: relative;
  overflow: hidden;
  min-height: 280px !important;
}

.hero-background-title > .d-flex {
  position: relative;
  z-index: 2;
}

:deep(.v-expansion-panel-title) {
  min-height: 280px;
  position: relative;
  overflow: hidden;
}

:deep(.v-expansion-panel-title__overlay) {
  background-color: transparent !important;
}

:deep(.v-expansion-panel-text__wrapper) {
  padding: 0;
}

:deep(.v-expansion-panel) {
  background-color: #1f2937 !important;
}

:deep(.v-expansion-panel-title) {
  background-color: transparent !important;
  color: white !important;
}

/* Gradiente para o texto ficar legível sobre a imagem */
.hero-background-title::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1;
}

:deep(.v-expansion-panel-title:hover .hero-background-title::before) {
  background: linear-gradient(
    90deg,
    rgba(0, 0, 0, 0.1) 0%,
    rgba(0, 0, 0, 0.2) 30%,
    rgba(0, 0, 0, 0.5) 70%,
    rgba(0, 0, 0, 0.7) 100%
  );
}

/* Responsividade da altura da imagem */
@media (max-width: 768px) {
  .hero-background-title, :deep(.v-expansion-panel-title) {
    min-height: 250px !important;
  }
}

@media (max-width: 540px) {
  .hero-background-title, :deep(.v-expansion-panel-title) {
    min-height: 180px !important;
  }
}

@media (max-width: 430px) {
  .hero-background-title, :deep(.v-expansion-panel-title) {
    min-height: 130px !important;
  }
}

@media (max-width: 344px) {
  .hero-background-title, :deep(.v-expansion-panel-title) {
    min-height: 100px !important;
  }
}

@media (min-width: 1024px) {
  .hero-background-title, :deep(.v-expansion-panel-title) {
    min-height: 350px !important;
  }
}
</style>