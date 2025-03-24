<script setup lang="ts">
import { ref, computed } from "vue";
import { useRoute } from "vue-router";
import { KeywordDataRepository } from "@/data/repository/KeywordDataRepository";
import BaseListSearch from "@/components/BaseListSearch.vue";
import { ConfigurationStore } from "@/store/ConfigurationStore";
import { useI18n } from "vue-i18n";

const getImageUrl = (path) => new URL(`@/${path}`, import.meta.url).href
const { t } = useI18n();
const route = useRoute();
const keywordDataRepository = new KeywordDataRepository();
const configurationStore = ConfigurationStore();
keywordDataRepository.load(configurationStore.enabledLanguage);
const keywords = keywordDataRepository.findAll();

let preselectedKeyword = "";
let preselectedKeywordId = "";
if (route.hash) {
  preselectedKeywordId = route.hash.toString().replace(/[#]/g, "");
  preselectedKeyword = preselectedKeywordId.replace(/[-]/g, " ");
}

let filteredKeyword = computed(() =>
  query.value === ""
    ? keywords
    : keywords.filter((keyword) =>
        keyword.keyword
          .toLowerCase()
          .replace(/\s+/g, "")
          .includes(query.value.toLowerCase().replace(/\s+/g, ""))
      )
);

let query = ref("");
query.value = preselectedKeyword;
</script>

<template>
  <div class="grid place-items-center w-full">
    <v-container max-width="680">
    <v-card class="pa-1">
      <v-card-title> {{ t("menu.keyword") }} </v-card-title>
      <v-card-actions>
        <BaseListSearch
          id="keyword-search"
          @search="query = $event"
          :value="query"
        />
      </v-card-actions>
      <v-card-text>
        <v-expansion-panels >
  <v-expansion-panel
    v-for="keyword in filteredKeyword"
    :key="keyword.id"
    color="background"
    class="my-2"
  >
    <template #title>
      <div class="d-flex align-center gap-2">
        <img
      v-if="keyword.icon"
      :src="keyword.icon"
      alt="icon"
      style="width: 30px; height: 30px; margin-right: 10px;"
    />
        {{ keyword.keyword }}
      </div>
    </template>

    <template #text>
  {{ keyword.description }}

  <div
    v-if="keyword.icon"
    class="d-flex justify-center align-center mt-2"
  >
    <img
      :src="keyword.icon"
      alt="icon"
      style="width: 80px; height: 80px;"
    />
  </div>
</template>
  </v-expansion-panel>
</v-expansion-panels>
      </v-card-text>
    </v-card>
  </v-container>
  </div>
</template>

<style scoped></style>
