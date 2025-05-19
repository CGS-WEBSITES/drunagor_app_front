<template>
  <div>
    <v-btn
      color="brown darken-3"
      class="text-white rounded-xl text-uppercase font-weight-bold"
      @click="dialog = true"
      prepend-icon="mdi-book-open-page-variant"
    >
      Open Interactions
    </v-btn>

    <v-dialog
      v-model="dialog"
      max-width="800px"
      :scrim="false"
      :persistent="true"
      :hide-overlay="true"
      no-click-animation
      :retain-focus="false"
      content-class="transparent-dialog"
      :style="{
        position: 'fixed',
        transform: `translate(${dragX}px, ${dragY}px)`,
        transition: 'transform 0.1s',
        zIndex: 1000,
      }"
    >
      <v-card
        class="book-dialog"
        elevation="10"
        @mousedown="startDrag"
        :style="{ backgroundImage: 'url(@/assets/campaign.jpg)', backgroundSize: 'cover', backgroundPosition: 'center' }"
      >
        <v-container class="py-2 px-4" style="flex: 1; display: flex; flex-direction: column;">
          <!-- Header -->
          <v-row class="d-flex align-center justify-space-between mb-2" style="flex-shrink: 0;">
            <template v-if="currentPage === 'titles'">
              <h3 class="dialog-title">Interactions</h3>
            </template>
            <template v-else>
              <v-btn
                class="back-btn text-white"
                color="grey darken-2"
                @click="currentPage = 'titles'"
              >
                <v-icon left>mdi-arrow-left</v-icon>
                Back to Options
              </v-btn>
            </template>
            <v-btn icon @click="dialog = false" class="close-btn">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-row>

          <!-- Titles Page -->
          <div 
            v-show="currentPage === 'titles'"
            class="title-page"
          >
            <v-row class="mt-2">
              <v-col
                v-for="(interaction, idx) in interactions"
                :key="'title-' + idx"
                cols="12"
                class="text-center py-3"
              >
                <v-btn
                  color="amber-darken-3"
                  class="text-white font-weight-bold px-8 interaction-btn"
                  block
                  @click="showContent(interaction.id)"
                >
                  {{ interaction.title }}
                </v-btn>
              </v-col>
            </v-row>
          </div>

          <!-- Content Page -->
          <div
            v-show="currentPage === 'content'"
            class="content-page"
          >
            <div class="content-wrapper">
              <div
                v-for="(interaction, idx) in interactions"
                :key="'content-' + idx"
                :id="interaction.id"
                class="interaction-detail pa-4"
              >
                <h2 class="chapter-title mb-4">{{ interaction.title }}</h2>
                <div class="body-text">
                  <p
                    v-for="(p, i) in interaction.body"
                    :key="i"
                    v-html="p"
                  ></p>
                </div>
              </div>
            </div>
          </div>
        </v-container>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick, watch } from 'vue';

const dialog = ref(false);
const drag = ref(false);
const dragX = ref(20);
const dragY = ref(20);
const startX = ref(0);
const startY = ref(0);
const currentPage = ref<'titles' | 'content'>('titles');

const interactions = ref([
  {
    id: 'interaction-01',
    title: '#01: Talk to the girl',
    body: [
      `Seeing that the girl is terrified, you kneel next to her and greet her...`,
      `You face a dilemma: As a group, you and your partners must choose...`
    ]
  },
  {
    id: 'interaction-02',
    title: '#02: Try to calm the lady down',
    body: [
      `Realizing that the older woman is too scared for rational thought...`,
      `You face a dilemma: As a group, you and your partners must choose...`
    ]
  },
  {
    id: 'interaction-03',
    title: '#03: Step away and leave them alone',
    body: [
      `Keeping her weapon pointed to you, the older woman carefully leads the girl out of the hut...`,
      `The Party Leader writes the “Boon of Gratitude” Aura...`
    ]
  },
  {
    id: 'interaction-04',
    title: '#04: Pry the gems out',
    body: [
      `Impressed by their beauty, you pull out your thief’s tools...`,
      `Make a Dexterity (red) Skill Challenge of Difficulty 13...`,
      `FAILURE: The tools scratch...`,
      `You gain FOCUS 2 and suffer BURN 4 and KNOCKDOWN.`,
      `SUCCESS: With the skill of an expert safecracker...`,
      `Write down the “Fire Ruby” Status...`
    ]
  }
]);

function showContent(id: string) {
  currentPage.value = 'content';
  
  nextTick(() => {
    setTimeout(() => {
      const el = document.getElementById(id);
      const container = document.querySelector('.content-wrapper');
      
      if (el && container) {
        const targetPosition = el.offsetTop - container.getBoundingClientRect().top;
        
        container.scrollTo({
          top: targetPosition - 20,
          behavior: 'smooth'
        });
      }
    }, 50);
  });
}

function startDrag(e: MouseEvent) {
  drag.value = true;
  startX.value = e.clientX - dragX.value;
  startY.value = e.clientY - dragY.value;
  document.addEventListener('mousemove', onDrag);
  document.addEventListener('mouseup', stopDrag);
}

function onDrag(e: MouseEvent) {
  if (!drag.value) return;
  dragX.value = e.clientX - startX.value;
  dragY.value = e.clientY - startY.value;
}

function stopDrag() {
  drag.value = false;
  document.removeEventListener('mousemove', onDrag);
  document.removeEventListener('mouseup', stopDrag);
}

watch(dialog, (newVal) => {
  if (!newVal) {
    currentPage.value = 'titles';
    // Opcional: resetar scroll também
    nextTick(() => {
      const container = document.querySelector('.content-wrapper');
      if (container) container.scrollTop = 0;
    });
  }
});
</script>

<style scoped>
.book-dialog {
  display: flex;
  flex-direction: column;
  width: 800px;
  max-height: 65vh;
  overflow: hidden;
  border-radius: 4px 16px 16px 4px;
  background-color: #212121;
  position: relative;
  border: 2px solid #1e1e1e;
  box-shadow:
    15px 0 15px -5px rgba(0, 0, 0, 0.3),
    0 10px 20px rgba(0, 0, 0, 0.5),
    inset 5px 0 10px rgba(255, 255, 255, 0.1);
}

.title-page {
  height: calc(65vh - 120px);
  padding: 40px 8px 16px;
  overflow-y: auto;
}

.content-page {
  height: calc(65vh - 80px);
  display: flex;
  flex-direction: column;
  padding-top: 30px;
  overflow: hidden;
}

.content-wrapper {
  height: 100%;
  overflow-y: auto;
  padding-right: 8px;
  transform: translateZ(0);
  scroll-snap-type: y proximity;
}

.interaction-detail {
  background: rgba(0, 0, 0, 0.3);
  border-radius: 8px;
  margin-bottom: 40px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  margin-top: 20px;
  scroll-snap-align: start;
}

.v-btn.interaction-btn {
  padding: 20px 24px !important;
  letter-spacing: 1.5px !important;
  transition: all 0.3s ease;
  border: 1px solid rgba(0, 0, 0, 0.2) !important;
  margin: 8px 0;
}

.v-btn.interaction-btn:hover {
  transform: scale(1.02);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
}

.chapter-title {
  font-family: "Cinzel Decorative", serif;
  font-size: 1.4rem;
  color: #fff8e1;
  text-align: center;
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.5);
  padding-bottom: 12px;
  border-bottom: 2px solid rgba(255, 255, 255, 0.1);
}

.body-text p {
  font-family: "EB Garamond", serif;
  font-size: 1rem;
  line-height: 1.6;
  color: #f0e6d2;
  margin-bottom: 1.5em;
  padding: 0 12px;
  text-indent: 2em;
}

.back-btn {
  align-self: flex-start;
  margin-left: 24px !important;
  margin-bottom: 12px;
  transition: all 0.3s ease;
}

.back-btn:hover {
  transform: translateX(-4px);
}

.dialog-title {
  font-family: "Uncial Antiqua", cursive;
  font-size: 1.3rem;
  color: #f0e6d2;
  margin: 0;
  padding-left: 8px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
}

.v-row.d-flex.align-center.justify-space-between.mb-2 {
  padding-top: 20px;
  margin-bottom: 20px !important;
}

@media (max-width: 600px) {
  .book-dialog {
    width: 90vw;
    max-height: 80vh;
  }
  
  .title-page {
    height: calc(80vh - 100px);
    padding-top: 30px;
    justify-content: flex-start;
  }
  
  .content-page {
    height: calc(80vh - 60px);
    padding-top: 20px;
  }
  
  .dialog-title {
    font-size: 1.1rem;
    padding-top: 10px;
  }
  
  .chapter-title {
    font-size: 1.2rem;
  }
  
  .body-text p {
    font-size: 0.95rem;
  }
}

::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.2);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: #5d4037;
  border-radius: 4px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}
</style>