<template>
  <div class="page-background pa-4 pa-md-8">
    <v-container>
      <h2 class="text-h4 font-weight-bold mb-6">Frequently Asked Questions (FAQ)</h2>

      <v-row>
        <v-col cols="12">
          <div v-if="loading" class="text-center">
            <v-progress-circular indeterminate color="primary"></v-progress-circular>
          </div>

          <v-expansion-panels v-else-if="faqData.length > 0">
            <v-expansion-panel
              v-for="(item, i) in faqData"
              :key="i"
              elevation="2"
            >
              <v-expansion-panel-title expand-icon="mdi-chevron-down">
                <span class="font-weight-bold">Q: {{ item.question }}</span>
              </v-expansion-panel-title>
              <v-expansion-panel-text>
                <div class="answer-content" v-html="item.answer"></div>
              </v-expansion-panel-text>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script setup>
import { ref, onBeforeMount } from 'vue';

const faqData = ref([]);
const loading = ref(true);
const error = ref(false);

onBeforeMount(() => {
  fetch('https://druna-assets.s3.us-east-2.amazonaws.com/FAQ/FAQ.json')
    .then(response => {
      if (!response.ok) {
        throw new Error(`Erro na requisição: ${response.statusText} (${response.status})`);
      }
      return response.json();
    })
    .then(data => {
      faqData.value = data.faq;
    })
    .catch(e => {
      console.error("Falha ao buscar o arquivo FAQ:", e);
      error.value = true;
    })
    .finally(() => {
      loading.value = false;
    });
});
</script>

<style scoped>
.page-background {
  background-color: #121212;
  min-height: 100vh;
}
.answer-content {
  line-height: 1.7;
  text-align: justify;
}
.answer-content :deep(ul) {
  padding-left: 24px;
  margin-top: 12px;
  margin-bottom: 12px;
}
.answer-content :deep(li) {
  margin-bottom: 8px;
}
.v-expansion-panel-title {
    line-height: 1.4;
}
</style>