<template>
  <div>
    <v-btn
      color="brown darken-3"
      class="text-white rounded-xl text-uppercase font-weight-bold"
      @click="dialog = true"
      prepend-icon="mdi-book-open-page-variant"
    >
      Open Campaign Book
    </v-btn>

    <v-dialog 
      v-model="dialog"
      max-width="550px"
      :scrim="false"
      :persistent="true"
      :hide-overlay="true"
      no-click-animation
      :retain-focus="false"
      content-class="transparent-dialog"
      :style="{ 
        'position': 'fixed',
        'transform': `translate(${dragX}px, ${dragY}px)`,
        'transition': 'transform 0.1s',
        'z-index': 1000
      }"
    >
      <v-card 
        class="book-dialog" 
        elevation="10"
        @mousedown="startDrag"
      >
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
                  <div 
                    class="d-flex align-center justify-space-between pa-6 pb-0"
                    @mousedown.stop="startDrag"
                  >
                    <h4 class="section-title">{{ currentPage.section }}</h4>
                    <v-btn 
                      icon 
                      @click="dialog = false"
                      class="close-btn"
                    >
                      <v-icon>mdi-close</v-icon>
                    </v-btn>
                  </div>
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
                      color="amber-darken-2"
                      variant="flat"
                      @click.stop="prevPage"
                      :disabled="currentIndex === 0"
                      class="mx-4 px-6 text-white font-weight-bold"
                    >
                      ◀ Previous
                    </v-btn>
                    <v-btn
                      color="amber-darken-2"
                      variant="flat"
                      @click.stop="nextPage"
                      :disabled="currentIndex >= pages.length - 1"
                      class="mx-4 px-6 text-white font-weight-bold"
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
    body: `
      <p>
        A desperate, piercing scream rips through the silence of the night, jolting you awake.
        Rain taps gently on the wooden shutters, and the embers in the hearth glow faintly as you rise from a restless sleep.
        The cry echoes again, now distant but unmistakable — a cry for help.
      </p>
      <p>
        Without hesitation, you grab your cloak and weapon, instincts taking over.
        You exit the safety of the parish house into the damp darkness beyond, guided only by moonlight and the pull of duty.
        Your boots sink slightly into the wet forest floor as you tread deeper into the unknown.
      </p>
      <p>
        A sense of urgency quickens your pace, though you know not what awaits.
        Tales of revenants and cursed woods linger in your mind, but still, you press forward.
        Tonight, something calls to you from within the trees, and whether it is fate, madness, or providence — you intend to answer.
      </p>
    `,
    instruction: "Mark this chapter as 'Discovered'. All players must draw 1 Fate card.",
    layout: "single-column",
    background: "url('/img/bg-apoc.png')"
  },
  {
    section: "ADVENTURE CONTINUES",
    title: "Into the Unknown",
    body: `
      <p>
        As you push through the brush, the woods grow unnaturally silent. The fog thickens, wrapping around your limbs like a living thing.
        Shadows move at the edges of your vision, but when you turn, nothing is there. Your breath becomes visible in the air, though the night isn't cold.
      </p>
      <p>
        Then you see it — a faint blue glow hovering above the forest path. You step closer, and it takes shape: a wisp, beckoning you forward.
        You follow. Not because you trust it, but because you must know.
      </p>
      <p>
        The path twists unnaturally, looping in on itself. Trees seem to shift when you glance away. Time dilates.
        You find a tattered journal on a broken stone altar, its pages torn, the ink smeared but still legible:
        <em>"The darkness watches... it learns."</em>
      </p>
    `,
    instruction: "All heroes must test Wits (difficulty 3). If failed, place 1 Curse Cube.",
    layout: "full-screen",
    background: "url('/img/bg2.png')"
  },
  {
    section: "CHAPTER INTRO",
    title: "A Cry for Help",
    body: `
      <p>
        A desperate, piercing scream rips through the silence of the night, jolting you awake.
        Rain taps gently on the wooden shutters, and the embers in the hearth glow faintly as you rise from a restless sleep.
        The cry echoes again, now distant but unmistakable — a cry for help.
      </p>
      <p>
        Without hesitation, you grab your cloak and weapon, instincts taking over.
        You exit the safety of the parish house into the damp darkness beyond, guided only by moonlight and the pull of duty.
        Your boots sink slightly into the wet forest floor as you tread deeper into the unknown.
      </p>
      <p>
        A sense of urgency quickens your pace, though you know not what awaits.
        Tales of revenants and cursed woods linger in your mind, but still, you press forward.
        Tonight, something calls to you from within the trees, and whether it is fate, madness, or providence — you intend to answer.
      </p>
    `,
    instruction: "Mark this chapter as 'Discovered'. All players must draw 1 Fate card.",
    layout: "single-column",
    background: "url('/img/bg-apoc.png')"
  },
  {
    section: "ADVENTURE CONTINUES",
    title: "Into the Unknown",
    body: `
      <p>
        As you push through the brush, the woods grow unnaturally silent. The fog thickens, wrapping around your limbs like a living thing.
        Shadows move at the edges of your vision, but when you turn, nothing is there. Your breath becomes visible in the air, though the night isn't cold.
      </p>
      <p>
        Then you see it — a faint blue glow hovering above the forest path. You step closer, and it takes shape: a wisp, beckoning you forward.
        You follow. Not because you trust it, but because you must know.
      </p>
      <p>
        The path twists unnaturally, looping in on itself. Trees seem to shift when you glance away. Time dilates.
        You find a tattered journal on a broken stone altar, its pages torn, the ink smeared but still legible:
        <em>"The darkness watches... it learns."</em>
      </p>
    `,
    instruction: "All heroes must test Wits (difficulty 3). If failed, place 1 Curse Cube.",
    layout: "full-screen",
    background: "url('/img/bg2.png')"
  },
]);

const drag = ref(false);
const dragX = ref(20);
const dragY = ref(20);
const startX = ref(0);
const startY = ref(0);

const startDrag = (e: MouseEvent) => {
  drag.value = true;
  startX.value = e.clientX - dragX.value;
  startY.value = e.clientY - dragY.value;
  document.addEventListener('mousemove', onDrag);
  document.addEventListener('mouseup', stopDrag);
};

const onDrag = (e: MouseEvent) => {
  if (!drag.value) return;
  dragX.value = e.clientX - startX.value;
  dragY.value = e.clientY - startY.value;
};

const stopDrag = () => {
  drag.value = false;
  document.removeEventListener('mousemove', onDrag);
  document.removeEventListener('mouseup', stopDrag);
};

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
  max-height: 50vh;
  width: 550px;
  overflow-y: auto;
  border-radius: 16px;
  background-color: transparent;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.4);
}

.book-page {
  position: relative;
  border-radius: 12px;
  padding: 24px;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  backdrop-filter: blur(3px);
  box-shadow: inset 0 0 60px rgba(0, 0, 0, 0.2), 0 0 30px rgba(0, 0, 0, 0.4);
  font-family: 'EB Garamond', serif;
}

.book-page::before {
  content: "";
  position: absolute;
  top: 16px;
  bottom: 16px;
  left: 16px;
  right: 16px;
  border: 3px double #5d4037;
  border-radius: 8px;
  pointer-events: none;
  z-index: 1;
}

.section-title {
  color: #6d4c41;
  text-transform: uppercase;
  font-weight: bold;
  font-size: 1rem;
  letter-spacing: 1.5px;
  margin: 0;
  padding: 8px 0;
}

.book-page::after {
  content: "";
  position: absolute;
  top: 0;
  right: 0;
  width: 15px;
  height: 100%;
  background: linear-gradient(to left, rgba(0, 0, 0, 0.2), transparent);
  border-top-right-radius: 12px;
  border-bottom-right-radius: 12px;
}

.close-btn {
  position: relative;
  top: -4px;
  right: -8px;
}

.chapter-title {
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 1.25rem;
  color: #f4e7c1;
  text-shadow: 1px 1px 3px #000;
}

.body-text p {
  font-size: 0.875rem;
  line-height: 1.8;
  margin-bottom: 1rem;
  text-align: justify;
  color: #f0e6d2;
  text-shadow: 1px 1px 1px #fff2e0;
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

.draggable-dialog {
  pointer-events: all;
  margin: 0 !important;
  top: 20px !important;
  right: 20px !important;
}

.drag-handle {
  cursor: move;
  user-select: none;
  padding: 12px 24px;
}

.v-overlay__scrim {
  opacity: 0 !important;
  pointer-events: none !important;
}

.book-dialog {
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.4) !important;
  border: 2px solid #5d4037 !important;
}

.transparent-dialog {
  pointer-events: none;
}

.transparent-dialog > * {
  pointer-events: all;
}
</style>
