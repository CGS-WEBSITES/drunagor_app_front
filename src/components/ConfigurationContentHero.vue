<template>
  <v-container max-width="660" class="pa-0">
    <template v-if="props.noCard">
      <!-- Section separator when nested in expansion panel -->
      <div class="text-uppercase font-weight-bold text-left mb-3 mt-2 text-subtitle-1 px-1">
        {{ $t("configuration.hero-content") }}
      </div>
      <v-row no-gutters class="mx-n1">
        <v-col
          v-for="content in contentStore.getAllWithHeroes()"
          :key="content.id"
          cols="12"
          sm="6"
          class="pa-1"
        >
          <div
            class="content-box-card"
            :class="{
              selected: heroContentSettings.includes(content.id),
              unselected: !heroContentSettings.includes(content.id)
            }"
            @click="toggleSelection(content.id)"
            :data-testid="'configuration-content-hero-' + content.id"
          >
            <!-- Box Image if available -->
            <template v-if="getImageUrl(content.id)">
              <img
                :src="getImageUrl(content.id)"
                :alt="$t(content.translation_key)"
                class="box-image"
              />
            </template>
            
            <!-- Fallback card if no image -->
            <template v-else>
              <div class="fallback-card">
                {{ $t(content.translation_key) }}
              </div>
            </template>
          </div>
        </v-col>
      </v-row>
    </template>
    
    <template v-else>
      <v-card color="primary" class="my-4 pa-4 custom-card">
        <v-card-title class="text-uppercase font-weight-bold text-left mb-4">
          {{ $t("configuration.hero-content") }}
        </v-card-title>
        <v-card-text class="pa-2">
          <v-row no-gutters class="mx-n1">
            <v-col
              v-for="content in contentStore.getAllWithHeroes()"
              :key="content.id"
              cols="12"
            sm="6"
              class="pa-1"
            >
              <div
                class="content-box-card"
                :class="{
                  selected: heroContentSettings.includes(content.id),
                  unselected: !heroContentSettings.includes(content.id)
                }"
                @click="toggleSelection(content.id)"
                :data-testid="'configuration-content-hero-' + content.id"
              >
                <!-- Box Image if available -->
                <template v-if="getImageUrl(content.id)">
                  <img
                    :src="getImageUrl(content.id)"
                    :alt="$t(content.translation_key)"
                    class="box-image"
                  />
                </template>
                
                <!-- Fallback card if no image -->
                <template v-else>
                  <div class="fallback-card">
                    {{ $t(content.translation_key) }}
                  </div>
                </template>
              </div>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </template>
  </v-container>
</template>

<script setup lang="ts">
import { ContentDataStore } from "@/data/store/ContentDataStore";
import type { ContentId } from "@/data/type/ContentId";
import { ConfigurationStore } from "@/store/ConfigurationStore";
import { watch, ref } from "vue";
import { useToast } from "primevue/usetoast";
import { useI18n } from "vue-i18n";

const props = withDefaults(
  defineProps<{
    noCard?: boolean;
  }>(),
  {
    noCard: false,
  }
);

const toast = useToast();
const { t } = useI18n();

const contentStore = ContentDataStore();
const configurationStore = ConfigurationStore();
const heroContentSettings = ref([] as ContentId[]);

configurationStore.enabledHeroContent.forEach((enabledContent) => {
  heroContentSettings.value.push(enabledContent);
});

watch(heroContentSettings, async (newSettings) => {
  if (newSettings.length > 0) {
    configurationStore.$patch({ enabledHeroContent: newSettings });
  } else {
    toast.add({
      severity: "error",
      summary: "Error",
      detail: t("configuration.error.atleast-one-selected"),
      life: 3000,
    });
  }
});

const getImageUrl = (contentId: string) => {
  const mapping: Record<string, string> = {
    "apocalypse": "apoc.png",
    "awakenings": "awak.png",
    "core": "core.png",
    "fallen-sisters": "fallen.png",
    "desert-of-hellscar": "hellscar.png",
    "the-ruin-of-luccanor": "luccanor.png",
    "monster-pack-1": "monsterpack.png",
    "the-shadow-world": "shadow.png",
    "spoils-of-war": "spoils.png",
    "rise-of-the-undead-dragon": "undeaddragon.png",
    "handuriel": "handuriel.png",
    "hero-pack-1": "heropack.png",
    "lorien": "lorien.png",
    "lordwrath": "lord.png",
  };
  
  if (mapping[contentId]) {
    return `https://assets.drunagor.app/CampaignTracker/ContentImages/${mapping[contentId]}`;
  }
  return "";
};

const toggleSelection = (contentId: ContentId) => {
  if (heroContentSettings.value.includes(contentId)) {
    if (heroContentSettings.value.length > 1) {
      heroContentSettings.value = heroContentSettings.value.filter((id) => id !== contentId);
    } else {
      toast.add({
        severity: "error",
        summary: "Error",
        detail: t("configuration.error.atleast-one-selected"),
        life: 3000,
      });
    }
  } else {
    heroContentSettings.value = [...heroContentSettings.value, contentId];
  }
};
</script>

<style scoped>
.custom-card {
  border-radius: 8px;
}

.content-box-card {
  position: relative;
  cursor: pointer;
  overflow: hidden;
  border-radius: 6px;
  border: 2px solid transparent;
  transition: all 0.2s ease-in-out;
  display: flex;
  flex-direction: column;
  width: 100%;
  aspect-ratio: 486 / 219;
}

.content-box-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.4);
}

.content-box-card.selected {
  border-color: #008c8c;
  box-shadow: 0 0 10px rgba(0, 140, 140, 0.4);
}

.box-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: filter 0.2s ease, opacity 0.2s ease;
}

.content-box-card.unselected .box-image {
  filter: grayscale(100%);
  opacity: 0.35;
}

.content-box-card.selected .box-image {
  filter: grayscale(0%);
  opacity: 1;
}

/* Fallback Card Styling */
.fallback-card {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px;
  text-align: center;
  font-weight: bold;
  font-size: 0.9rem;
  text-transform: uppercase;
  color: #fff;
  transition: all 0.2s ease;
  user-select: none;
  aspect-ratio: 486 / 219;
}

.content-box-card.unselected .fallback-card {
  background: linear-gradient(135deg, #1e1e1e, #2b2b2b) !important;
  color: #666;
  opacity: 0.5;
}

.content-box-card.selected .fallback-card {
  background: linear-gradient(135deg, #115e5f, #008c8c) !important;
  color: #fff;
  opacity: 1;
}
</style>
