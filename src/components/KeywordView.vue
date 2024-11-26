<script setup lang="ts">
import { ref, computed } from "vue";
import { useRoute } from "vue-router";
import { KeywordDataRepository } from "@/data/repository/KeywordDataRepository";
import BaseListSearch from "@/components/BaseListSearch.vue";
import { ConfigurationStore } from "@/store/ConfigurationStore";
import { useI18n } from "vue-i18n";


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
    <v-card class="pa-6">
      <v-card-title> {{ t("menu.keyword") }} </v-card-title>
      <v-card-actions>
        <BaseListSearch
          id="keyword-search"
          @search="query = $event"
          :value="query"
        />
      </v-card-actions>
      <v-card-text>
        <v-expansion-panels color="blue-darken-4" >
          <v-expansion-panel
          class="my-2"
            v-for="keyword in filteredKeyword"
            :key="keyword.id"
            :title="keyword.keyword"
            :text="keyword.description"
          >
          </v-expansion-panel>
        </v-expansion-panels>
      </v-card-text>
    </v-card>
  </div>
</template>

<style scoped></style>
