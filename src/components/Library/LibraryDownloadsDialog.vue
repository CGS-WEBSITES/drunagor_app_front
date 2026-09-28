<template>
  <v-dialog v-model="model" max-width="560" scrollable>
    <v-card class="downloads" color="surface">
      <div class="downloads__header">
        <div>
          <h2 class="downloads__title">Digital Files</h2>
          <span class="downloads__subtitle">{{ boxName }}</span>
        </div>
        <v-btn icon variant="text" size="small" @click="model = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </div>

      <template v-if="languages.length">
        <div class="downloads__tabs">
          <button
            v-for="lang in languages"
            :key="lang"
            class="downloads__tab"
            :class="{ active: language === lang }"
            @click="language = lang"
          >
            {{ LANGUAGE_LABELS[lang] }}
          </button>
        </div>

        <v-card-text class="pt-2">
          <section v-for="group in groups" :key="group.category" class="mb-4">
            <h3 class="downloads__category">{{ group.category }}</h3>
            <a
              v-for="file in group.files"
              :key="file.url"
              :href="file.url"
              target="_blank"
              rel="noopener"
              class="downloads__file"
            >
              <v-icon size="20" class="mr-3">mdi-file-pdf-box</v-icon>
              <span class="flex-grow-1">{{ file.label }}</span>
              <v-icon size="18">mdi-download</v-icon>
            </a>
          </section>
        </v-card-text>
      </template>

      <v-card-text v-else class="downloads__empty">
        There are no digital files for this box yet.
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { boxDownloads, LANGUAGE_LABELS, type DownloadFile, type LanguageCode } from "@/data/library";

const props = defineProps<{ boxName: string }>();
const model = defineModel<boolean>({ default: false });

const { locale } = useI18n();

const files = computed(() => boxDownloads(props.boxName));
const languages = computed(() =>
  (Object.keys(LANGUAGE_LABELS) as LanguageCode[]).filter((lang) => files.value[lang]?.length),
);

// Opens in the app language when that language has files.
const language = ref<LanguageCode>("en");
watch(
  [() => props.boxName, model],
  () => {
    const appLanguage = String(locale.value).slice(0, 2) as LanguageCode;
    language.value = languages.value.includes(appLanguage) ? appLanguage : languages.value[0] ?? "en";
  },
  { immediate: true },
);

const groups = computed(() => {
  const byCategory = new Map<string, DownloadFile[]>();
  (files.value[language.value] ?? []).forEach((file) => {
    byCategory.set(file.category, [...(byCategory.get(file.category) ?? []), file]);
  });
  return [...byCategory].map(([category, list]) => ({ category, files: list }));
});
</script>

<style scoped>
.downloads {
  font-family: "Poppins", sans-serif;
}
.downloads__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 16px 16px 8px 20px;
}
.downloads__title {
  font-size: 1.2rem;
  font-weight: 700;
  text-transform: uppercase;
}
.downloads__subtitle {
  font-size: 0.8rem;
  opacity: 0.7;
}
.downloads__tabs {
  display: flex;
  gap: 6px;
  margin: 0 16px;
  padding: 4px;
  background: rgb(var(--v-theme-primary));
  border-radius: 10px;
}
.downloads__tab {
  flex: 1;
  padding: 8px 4px;
  border-radius: 8px;
  font-size: 0.8rem;
  font-weight: 700;
  opacity: 0.75;
}
.downloads__tab.active {
  background: rgb(var(--v-theme-secondary));
  opacity: 1;
}
.downloads__category {
  margin: 8px 0 6px;
  font-size: 0.8rem;
  font-weight: 700;
  text-transform: uppercase;
  opacity: 0.7;
}
.downloads__file {
  display: flex;
  align-items: center;
  margin-bottom: 6px;
  padding: 10px 12px;
  background: rgb(var(--v-theme-primary));
  border-radius: 8px;
  color: inherit;
  font-size: 0.9rem;
  text-decoration: none;
  transition: background 0.2s ease;
}
.downloads__file:hover {
  background: rgb(var(--v-theme-secondary));
}
.downloads__empty {
  opacity: 0.7;
}
</style>
