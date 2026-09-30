<template>
  <div class="keywords-page">
    <div class="keywords-panel">
      <h1 class="keywords-title">{{ t("menu.keyword") }}</h1>

      <div class="keywords-search">
        <v-icon size="20" class="keywords-search__icon">mdi-magnify</v-icon>
        <input id="keyword-search" v-model="query" type="search" placeholder="Search" autocomplete="off" />
        <button v-if="query" class="keywords-search__clear" aria-label="Clear search" @click="query = ''">
          <v-icon size="18">mdi-close</v-icon>
        </button>
      </div>

      <div class="keywords-list">
        <div
          v-for="keyword in filteredKeyword"
          :id="keyword.id"
          :key="keyword.id"
          class="keyword-card"
          :class="{ open: openId === keyword.id }"
        >
          <button class="keyword-card__head" @click="openId = openId === keyword.id ? null : keyword.id">
            <img v-if="keyword.icon" :src="keyword.icon" alt="" class="keyword-card__icon" />
            <span>{{ keyword.keyword }}</span>
            <v-icon size="22">{{ openId === keyword.id ? "mdi-chevron-up" : "mdi-chevron-down" }}</v-icon>
          </button>
          <v-expand-transition>
            <div v-if="openId === keyword.id" class="keyword-card__body">
              <div class="keyword-card__text" v-html="keyword.description"></div>
              <img v-if="keyword.icon" :src="keyword.icon" alt="" class="keyword-card__big" />
            </div>
          </v-expand-transition>
        </div>
        <p v-if="!filteredKeyword.length" class="keywords-empty">No keyword matches "{{ query }}".</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { useRoute } from "vue-router";
import type { KeywordData } from "@/data/repository/KeywordData";
import { sortBy } from "lodash-es";
import { ConfigurationStore } from "@/store/ConfigurationStore";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const route = useRoute();
const configurationStore = ConfigurationStore();
const i18n = useI18n();
// Read the translations reactively: on a refresh they arrive after the page.
const keywords = computed<KeywordData[]>(() => {
  const messages = i18n.messages.value as Record<string, any>;
  const list = messages[configurationStore.enabledLanguage]?.keyword ?? messages[i18n.fallbackLocale.value as string]?.keyword ?? [];
  return sortBy(list as KeywordData[], ["keyword"]);
});

const query = ref("");
const openId = ref<string | null>(null);

// A link like /keyword#fire-trap searches for it and opens it.
if (route.hash) {
  const id = route.hash.toString().replace(/[#]/g, "");
  query.value = id.replace(/[-]/g, " ");
  openId.value = id;
}

const normalize = (text: string) => text.toLowerCase().replace(/\s+/g, "");
const filteredKeyword = computed(() =>
  query.value === "" ? keywords.value : keywords.value.filter((keyword) => normalize(keyword.keyword).includes(normalize(query.value))),
);

// With a single result, show it open.
const single = computed(() => (filteredKeyword.value.length === 1 ? filteredKeyword.value[0].id : null));
watch(single, (id) => {
  if (id) openId.value = id;
});
</script>

<style scoped>
.keywords-page {
  width: 100%;
  max-width: 760px;
  margin: 0 auto;
  padding: 16px 16px 48px;
  font-family: "Poppins", sans-serif;
  color: #fff;
}
.keywords-panel {
  padding: 20px;
  background: rgb(var(--v-theme-surface));
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
}
.keywords-title {
  margin-bottom: 14px;
  font-size: 1.4rem;
  font-weight: 800;
  letter-spacing: 1px;
  text-transform: uppercase;
}
.keywords-search {
  position: sticky;
  top: 56px;
  z-index: 2;
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 14px;
  padding: 0 12px;
  background: rgb(var(--v-theme-secondary));
  border-radius: 8px;
}
.keywords-search__icon {
  opacity: 0.7;
}
.keywords-search input {
  flex: 1;
  height: 44px;
  background: transparent;
  color: #fff;
  font-size: 0.95rem;
  outline: none;
}
.keywords-search input::placeholder {
  color: rgba(255, 255, 255, 0.55);
}
.keywords-search__clear {
  opacity: 0.7;
}
.keywords-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.keyword-card {
  overflow: hidden;
  background: rgb(var(--v-theme-primary));
  border-radius: 8px;
  scroll-margin-top: 120px;
}
.keyword-card__head {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  min-height: 48px;
  padding: 8px 14px;
  font-size: 0.92rem;
  font-weight: 800;
  text-align: left;
  text-transform: uppercase;
}
.keyword-card__head span {
  flex: 1;
}
.keyword-card__icon {
  width: 30px;
  height: 30px;
  object-fit: contain;
}
.keyword-card__body {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 16px 18px;
}
.keyword-card__text {
  align-self: stretch;
  font-size: 0.88rem;
  line-height: 1.55;
}
.keyword-card__text :deep(.inline-icon) {
  height: 1.2em;
  vertical-align: -0.2em;
  filter: brightness(0) invert(1);
}
.keyword-card__big {
  width: 110px;
  height: 110px;
  margin-top: 14px;
  object-fit: contain;
}
.keywords-empty {
  padding: 24px;
  font-size: 0.9rem;
  text-align: center;
  opacity: 0.7;
}
@media (min-width: 960px) {
  .keywords-search {
    top: 60px;
  }
}
</style>
