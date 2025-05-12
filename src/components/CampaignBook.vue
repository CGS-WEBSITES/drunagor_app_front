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
      max-width="500px"
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
        'z-index': 1000,
      }"
    >
      <v-card class="book-dialog" elevation="10" @mousedown="startDrag">
        <v-card-text class="pa-0">
          <v-sheet
          v-if="currentPage"
            :key="currentIndex"
            :style="backgroundStyle as CSSProperties"
            class="book-page"
            elevation="0"
            rounded
            @click="handlePageClick"
          >
            <div
              v-if="isFullScreenWithBackground"
              class="background-overlay"
            ></div>
            <v-container class="pa-6">
              <v-row>
                <v-col cols="12">
                  <div
                    class="d-flex align-center justify-space-between pa-6 pb-0"
                    @mousedown.stop="startDrag"
                  >
                    <h4 class="section-title">{{ currentPage.section }}</h4>
                    <v-btn icon @click="dialog = false" class="close-btn">
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
import { ref, computed, CSSProperties } from "vue";
/* import axios from "axios"; */

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
    instruction:
      "Mark this chapter as 'Discovered'. All players must draw 1 Fate card.",
    layout: "single-column",
    background: "url('/img/bg-apoc.png')",
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
    instruction:
      "All heroes must test Wits (difficulty 3). If failed, place 1 Curse Cube.",
    layout: "full-screen",
    background: "url('/img/bg2.png')",
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
    instruction:
      "Mark this chapter as 'Discovered'. All players must draw 1 Fate card.",
    layout: "single-column",
    background: "url('/img/bg-apoc.png')",
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
    instruction:
      "All heroes must test Wits (difficulty 3). If failed, place 1 Curse Cube.",
    layout: "full-screen",
    background: "url('/img/bg2.png')",
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
  document.addEventListener("mousemove", onDrag);
  document.addEventListener("mouseup", stopDrag);
};

const onDrag = (e: MouseEvent) => {
  if (!drag.value) return;
  dragX.value = e.clientX - startX.value;
  dragY.value = e.clientY - startY.value;
};

const stopDrag = () => {
  drag.value = false;
  document.removeEventListener("mousemove", onDrag);
  document.removeEventListener("mouseup", stopDrag);
};

const backgroundStyle = computed<CSSProperties>(() => {
  if (!currentPage.value) return {}
  const style: CSSProperties = {
    position: 'relative',
    color: '#191919',
    borderRadius: '12px'
  }
  if (currentPage.value.background) {
    style.backgroundImage   = currentPage.value.background
    style.backgroundSize    = 'cover'
    style.backgroundRepeat  = 'no-repeat'
    style.backgroundPosition= 'center center'
  } else {
    style.backgroundColor = '#1c1c1c'
  }
  return style
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
  } else if (
    clickX > width * 0.66 &&
    currentIndex.value < pages.value.length - 1
  ) {
    nextPage();
  }
}

function nextPage() {
  if (currentIndex.value < pages.value.length - 1) currentIndex.value++;
}

function prevPage() {
  if (currentIndex.value > 0) currentIndex.value--;
}

/* const campaignId = ref(""); 

onMounted(async () => {
  try {
    const { data } = await axios.get(`/api/campaigns/${campaignId.value}/book`);

    pages.value = data.pages;
  } catch (err) {
    console.error('Erro ao carregar book:', err);
  }
}); */
</script>

<style scoped>
.book-dialog {
  max-height: 50vh;
  width: 500px;
  overflow-y: auto;
  border-radius: 4px 16px 16px 4px;
  background: #212121;
  position: relative;
  border: 2px solid #1e1e1e;
  box-shadow:
    15px 0 15px -5px rgba(0, 0, 0, 0.3),
    0 10px 20px rgba(0, 0, 0, 0.5),
    inset 5px 0 10px rgba(255, 255, 255, 0.1);
}

.book-dialog::before {
  content: "";
  position: absolute;
  left: -15px;
  top: 0;
  height: 100%;
  width: 30px;
  background: linear-gradient(to right, #212121 0%, #1a120f 50%, #140d0b 100%);
  border-radius: 4px 0 0 4px;
  box-shadow: inset -5px 0 10px rgba(0, 0, 0, 0.2);
}

.book-page {
  background-image: url("data:image/png;base64,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");
  background-color: #f0e6d2;
  color: #212121;
  border: 1px solid #1e1e1e;
  margin: 20px 40px 20px 30px;
  box-shadow:
    0 0 10px rgba(94, 69, 57, 0.3),
    inset 0 0 20px rgba(94, 69, 57, 0.2);
}

.section-title {
  font-family: "Uncial Antiqua", cursive;
  color: #212121;
  font-size: 1.2rem;
  text-shadow: 1px 1px 1px rgba(255, 255, 255, 0.5);
  letter-spacing: 3px;
  border-bottom: 2px solid #1e1e1e;
  display: inline-block;
  padding: 0 15px 5px 0;
}

.chapter-title {
  font-family: "Cinzel Decorative", cursive;
  color: #212121;
  font-size: 2rem;
  margin: 15px 0;
  text-shadow: 2px 2px 3px rgba(94, 69, 57, 0.2);
}

.body-text p {
  font-family: "EB Garamond", serif;
  font-size: 1.1rem;
  line-height: 1.6;
  text-indent: 2em;
  color: #191919 !important;
  margin-bottom: 1.5rem;
}

.close-btn {
  background-color: #212121 !important;
  color: #f0e6d2 !important;
  border: 1px solid #1e1e1e;
  border-radius: 50%;
  box-shadow: 1px 1px 3px rgba(0, 0, 0, 0.3);
}

.close-btn:hover {
  background-color: #1e1e1e !important;
}

.instruction-box {
  background: #f0e6d2 !important;
  border: 2px solid #212121 !important;
  color: #1a120f !important;
  box-shadow: 3px 3px 0px #212121;
}

.v-btn {
  font-family: "Uncial Antiqua", cursive !important;
  letter-spacing: 1px;
  border: 1px solid #212121 !important;
}
</style>
