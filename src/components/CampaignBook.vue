<template>
  <div>
    <v-btn
      color="brown darken-3"
      class="text-white rounded-xl text-uppercase font-weight-bold"
      @click="dialog = true"
      prepend-icon="mdi-book-open-page-variant"
      style="font-family: 'Uncial Antiqua', serif; letter-spacing: 1px;"
    >
      Open Campaign Book
    </v-btn>

    <v-dialog v-model="dialog" max-width="720px" max-height="85vh">
      <v-card class="book-dialog" elevation="8">
        <v-card-title class="d-flex justify-space-between align-center">
          <span class="text-h6">Campaign Book</span>
          <v-btn icon @click="dialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>

        <v-card-text class="pa-0">
          <v-sheet
            v-if="currentPage"
            :key="currentIndex"
            class="book-page"
            :style="backgroundStyle"
            elevation="0"
            rounded
            @click="handlePageClick"
          >
            <div v-if="isFullScreenWithBackground" class="background-overlay"></div>

            <v-container class="pa-6">
              <v-row>
                <v-col cols="12">
                  <h4 class="section-title">{{ currentPage.section }}</h4>
                  <h2 class="chapter-title">{{ currentPage.title }}</h2>
                  <div class="body-text" v-html="currentPage.body"></div>

                  <v-alert
                    v-if="currentPage.instruction"
                    type="info"
                    border="start"
                    elevation="2"
                    class="mt-6 instruction-box"
                  >
                    <strong>📜 Instruction:</strong><br />
                    {{ currentPage.instruction }}
                  </v-alert>

                  <div class="d-flex justify-end mt-8">
                    <v-btn
                      color="primary"
                      variant="tonal"
                      @click="prevPage"
                      :disabled="currentIndex === 0"
                      class="me-2"
                    >
                      ◀ Previous
                    </v-btn>
                    <v-btn
                      color="primary"
                      variant="tonal"
                      @click="nextPage"
                      :disabled="currentIndex >= pages.length - 1"
                    >
                      Next ▶
                    </v-btn>
                  </div>
                </v-col>
              </v-row>
            </v-container>
          </v-sheet>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";

const dialog = ref(false);

const pages = ref([
  {
    section: "CHAPTER INTRO",
    title: "A Cry for Help",
    body: `<p>A desperate scream awakens you in the night...</p>`,
    instruction: "Trigger event X if all heroes are in darkness.",
    layout: "single-column",
    background: "url('../assets/bg-apoc.png')"
  },
  {
    section: "ADVENTURE CONTINUES",
    title: "Into the Unknown",
    body: `<p>You enter the fog. Something follows...</p>`,
    instruction: "Draw the next Rune and reveal the enemy.",
    layout: "full-screen",
    background: "url('../assets/bg2.png')"
  }
]);

const backgroundStyle = computed(() => {
  const bg = currentPage.value?.background;
  if (bg) {
    return {
      backgroundImage: bg,
      backgroundSize: "cover",
      backgroundRepeat: "no-repeat",
      backgroundPosition: "center center",
      color: "white",
      position: "relative",
      borderRadius: "12px"
    };
  }
  return {
    backgroundColor: "#1c1c1c",
    color: "#eee",
    borderRadius: "12px"
  };
});

const currentIndex = ref(0);
const currentPage = computed(() => pages.value[currentIndex.value]);

const isFullScreenWithBackground = computed(() => {
  return (
    currentPage.value?.layout === "full-screen" &&
    !!currentPage.value?.background
  );
});

function handlePageClick(event: MouseEvent) {
  const width = (event.currentTarget as HTMLElement).offsetWidth;
  const clickX = event.offsetX;

  if (clickX < width * 0.33 && currentIndex.value > 0) {
    prevPage();
  } else if (clickX > width * 0.66 && currentIndex.value < pages.value.length - 1) {
    nextPage();
  }
}

function nextPage() {
  if (currentIndex.value < pages.value.length - 1) currentIndex.value++;
}

function prevPage() {
  if (currentIndex.value > 0) currentIndex.value--;
}

// onMounted(async () => {
//   try {
//     const { data } = await axios.get(`/api/campaigns/${campaignId}/book`);
//     pages.value = data.pages;
//   } catch (err) {
//     console.error("Failed to load book:", err);
//   }
// });
</script>

<style scoped>
.book-dialog {
  max-height: 85vh;
  overflow-y: auto;
  border-radius: 16px;
  background-color: transparent;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.4);
}

.book-page {
  position: relative;
  border-radius: 16px;
  padding: 32px;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  backdrop-filter: blur(3px);
  background-color: rgba(0, 0, 0, 0.55);
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.7);
}

.section-title {
  color: #c0392b;
  text-transform: uppercase;
  font-weight: bold;
  font-size: 1rem;
  letter-spacing: 1.5px;
  font-family: 'Uncial Antiqua', serif;
}

.chapter-title {
  font-size: 2.2rem;
  font-weight: bold;
  margin-bottom: 1.25rem;
  font-family: 'Uncial Antiqua', serif;
  color: #f4e7c1;
  text-shadow: 1px 1px 3px #000;
}

.body-text p {
  font-size: 1.05rem;
  line-height: 1.8;
  margin-bottom: 1rem;
  text-align: justify;
  color: #f0e6d2;
  font-family: 'EB Garamond', serif;
}

.instruction-box {
  background-color: rgba(30, 30, 30, 0.85);
  color: #f4f4f4;
  border-left: 4px solid #81d4fa;
  padding: 12px;
  margin-top: 1.5rem;
  font-size: 1rem;
  font-style: italic;
  border-radius: 8px;
}
</style>
