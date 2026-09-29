<template>
  <div class="box-assembly-page-wrapper">
    <div class="page-background"></div>
    <v-container max-width="750" class="py-4 safe-area-padding guide-container px-2 px-sm-4">
      
      <!-- Back Button - Top Left -->
      <v-btn
        icon="mdi-arrow-left"
        variant="tonal"
        color="white"
        @click="router.push({ name: 'RetailerTutorial' })"
        class="back-button position-absolute"
        style="left: 16px; top: 16px;"
        title="Back to Retailer Guide"
      ></v-btn>

      <!-- Main Header Title (Outside Card) -->
      <div class="text-center mt-2 mb-4">
        <h1 class="main-header-title text-white font-weight-black text-center text-uppercase">
          BOX ASSEMBLY<br />& OGANIZATION
        </h1>
      </div>

      <!-- Single Main Card Container -->
      <v-card class="main-box-card rounded-xl pa-4 pa-sm-6 text-left elevation-16 overflow-hidden">
        
        <!-- Subtitle Text (INSIDE Card at the Top) -->
        <p class="subtitle-text text-center font-style-italic mb-6 mx-auto">
          Navigate through this page to learn how to organize your components and assemble your game box for Drunagor Nights. If you prefer to follow a PDF guide,
          <a
            href="https://s3.us-east-2.amazonaws.com/assets.drunagor.app/retaitlertutorial/box-assembly-guide/RETAILER+MANUAL+-+OP+KIT+preparation.pdf"
            target="_blank"
            rel="noopener noreferrer"
            class="pdf-guide-link"
          >click here<v-icon size="x-small" style="color: #BCA341;" class="ml-0.5">mdi-open-in-new</v-icon></a>.
        </p>

        <!-- The four steps, from guideSteps below. -->
        <div v-for="step in guideSteps" :key="step.n" class="step-section mb-4">
          <div
            class="step-banner rounded-lg d-flex align-center cursor-pointer"
            :class="{ 'banner-open': openSteps[step.n] }"
            @click="toggleStep(step.n)"
          >
            <span class="step-badge" :class="`badge-step-${step.n}`">STEP {{ step.n }}</span>
            <h2 class="step-title single-line-title font-weight-bold text-white pl-3 pr-3 py-2.5 flex-grow-1">
              {{ step.title }}
            </h2>
          </div>

          <v-expand-transition>
            <div v-show="openSteps[step.n]" class="step-open-container pt-4 pb-4 px-3 px-sm-5 mb-4">
              <p v-for="(text, i) in step.intro" :key="i" class="intro-p text-white mb-4" v-html="text"></p>

              <div v-if="step.image" class="text-center my-5">
                <v-img
                  :src="step.image.image"
                  eager
                  :alt="step.image.title"
                  max-width="280"
                  class="mx-auto rounded-lg shadow-elevation-8 cursor-pointer"
                  @click="openModal(step.image)"
                >
                  <template v-slot:error>
                    <div class="guide-image-fallback rounded-lg pa-5 text-center mx-auto">
                      <v-icon size="36" class="mb-1">mdi-image-off-outline</v-icon>
                      <div class="text-caption text-grey-lighten-1">{{ step.image.title }}</div>
                    </div>
                  </template>
                </v-img>
              </div>

              <div v-for="sub in step.substeps" :key="sub.heading" class="substep-block mb-5">
                <h3 class="substep-heading font-weight-bold text-white mb-2" v-html="sub.heading"></h3>
                <p v-if="sub.text" class="intro-p text-white mb-3" v-html="sub.text"></p>

                <div v-if="sub.items" class="checklist-items">
                  <div v-for="item in sub.items" :key="item.id" class="mb-1">
                    <div
                      class="checklist-row d-flex align-start py-2 cursor-pointer"
                      :class="{ 'row-checked': !item.details && isChecked(item.id) }"
                      @click="handleItemClick(item)"
                    >
                      <div
                        class="custom-checkbox flex-shrink-0"
                        :class="{ 'checked': isParentChecked(item) }"
                        @click.stop="toggleParentCheck(item)"
                      ></div>
                      <span
                        class="row-label text-white flex-grow-1"
                        :class="{ 'text-decoration-line-through opacity-50': item.details && isParentChecked(item) }"
                        v-html="item.label"
                      ></span>
                    </div>

                    <div v-if="item.details" class="sub-bullets pl-5 pl-sm-6 mt-0.5">
                      <div
                        v-for="detail in item.details"
                        :key="detail.id"
                        class="checklist-row d-flex align-start py-1.5 cursor-pointer mb-1"
                        :class="{ 'row-checked': isChecked(detail.id) }"
                        @click.stop="handleItemClick(detail)"
                      >
                        <div
                          class="custom-checkbox flex-shrink-0 mr-2"
                          :class="{ 'checked': isChecked(detail.id) }"
                          @click.stop="toggleCheck(detail.id)"
                        ></div>
                        <span class="row-label text-white flex-grow-1" v-html="detail.label"></span>
                      </div>
                    </div>
                  </div>
                </div>

                <p v-if="sub.note" class="note-text text-grey-lighten-1 mt-2 pl-7" v-html="sub.note"></p>

                <template v-if="sub.cardsTable">
                    <div class="cards-table-wrapper mb-2 overflow-x-auto">
                      <v-table theme="dark" class="mini-cards-table rounded-lg" style="min-width: 680px;">
                        <thead>
                          <tr>
                            <th class="text-center text-caption font-weight-bold text-white bg-grey-darken-3 py-3 border-col-right text-uppercase" style="width: 226px; min-width: 226px;">
                              HERO COMPONENTS
                            </th>
                            <th class="text-center text-caption font-weight-bold text-white bg-grey-darken-3 py-3 border-col-right text-uppercase" style="width: 226px; min-width: 226px;">
                              ENEMY COMPONENTS
                            </th>
                            <th class="text-center text-caption font-weight-bold text-white bg-grey-darken-3 py-3 text-uppercase" style="width: 228px; min-width: 228px;">
                              ADVENTURE COMPONENTS
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr v-for="rowIndex in maxCardRows" :key="rowIndex" class="table-row-custom">
                            <!-- Hero -->
                            <td class="table-cell-custom pa-3 align-top border-col-right text-center" style="width: 226px; min-width: 226px;">
                              <div 
                                v-if="heroCards[rowIndex - 1]" 
                                class="cell-check-item d-flex flex-column align-center justify-space-between pa-1 rounded cursor-pointer fill-height"
                                :class="{ 'cell-checked': isChecked(heroCards[rowIndex - 1].id) }"
                                @click="handleItemClick(heroCards[rowIndex - 1])"
                              >
                                <span class="text-caption text-white style-table-text mb-2 text-center">{{ heroCards[rowIndex - 1].label }}</span>
                                <div 
                                  class="custom-checkbox flex-shrink-0 ma-0" 
                                  :class="{ 'checked': isChecked(heroCards[rowIndex - 1].id) }"
                                  @click.stop="handleItemClick(heroCards[rowIndex - 1])"
                                ></div>
                              </div>
                            </td>

                            <!-- Enemy -->
                            <td class="table-cell-custom pa-3 align-top border-col-right text-center" style="width: 226px; min-width: 226px;">
                              <div 
                                v-if="enemyCards[rowIndex - 1]" 
                                class="cell-check-item d-flex flex-column align-center justify-space-between pa-1 rounded cursor-pointer fill-height"
                                :class="{ 'cell-checked': isChecked(enemyCards[rowIndex - 1].id) }"
                                @click="handleItemClick(enemyCards[rowIndex - 1])"
                              >
                                <span class="text-caption text-white style-table-text mb-2 text-center">{{ enemyCards[rowIndex - 1].label }}</span>
                                <div 
                                  class="custom-checkbox flex-shrink-0 ma-0" 
                                  :class="{ 'checked': isChecked(enemyCards[rowIndex - 1].id) }"
                                  @click.stop="handleItemClick(enemyCards[rowIndex - 1])"
                                ></div>
                              </div>
                            </td>

                            <!-- Adventure -->
                            <td class="table-cell-custom pa-3 align-top text-center" style="width: 228px; min-width: 228px;">
                              <div 
                                v-if="adventureCards[rowIndex - 1]" 
                                class="cell-check-item d-flex flex-column align-center justify-space-between pa-1 rounded cursor-pointer fill-height"
                                :class="{ 'cell-checked': isChecked(adventureCards[rowIndex - 1].id) }"
                                @click="handleItemClick(adventureCards[rowIndex - 1])"
                              >
                                <span class="text-caption text-white style-table-text mb-2 text-center">{{ adventureCards[rowIndex - 1].label }}</span>
                                <div 
                                  class="custom-checkbox flex-shrink-0 ma-0" 
                                  :class="{ 'checked': isChecked(adventureCards[rowIndex - 1].id) }"
                                  @click.stop="handleItemClick(adventureCards[rowIndex - 1])"
                                ></div>
                              </div>
                            </td>
                          </tr>
                        </tbody>
                      </v-table>
                    </div>

                    <!-- Scroll Indicator Cue for Mobile -->
                    <div class="d-flex align-center justify-center ga-1.5 mt-1 mb-4 text-caption text-grey-lighten-1 font-weight-medium d-sm-none">
                      <v-icon size="small" color="cyan-accent-3">mdi-arrow-left-right</v-icon>
                      <span>Scroll sideways to view ADVENTURE COMPONENTS</span>
                    </div>
                </template>

                <p v-if="sub.after" class="intro-p text-white mb-3" v-html="sub.after"></p>

                <div v-if="sub.image" class="text-center my-4">
                  <v-img
                    :src="sub.image.image"
                    eager
                    :alt="sub.image.title"
                    max-width="400"
                    class="mx-auto rounded-lg cursor-pointer"
                    @click="openModal(sub.image)"
                  >
                    <template v-slot:error>
                      <div class="guide-image-fallback rounded-lg pa-5 text-center mx-auto">
                        <v-icon size="36" class="mb-1">mdi-image-off-outline</v-icon>
                        <div class="text-caption text-grey-lighten-1">{{ sub.image.title }}</div>
                      </div>
                    </template>
                  </v-img>
                </div>
              </div>

              <div v-if="step.enjoy" class="py-1">
                <span class="step4-enjoy-text font-weight-bold text-white">Enjoy the game!</span>
              </div>
            </div>
          </v-expand-transition>
        </div>

        <!-- Bottom Back Button -->
        <div class="d-flex justify-center mt-6">
          <v-btn
            color="amber-accent-2"
            variant="outlined"
            rounded="pill"
            size="medium"
            class="font-weight-black text-white px-6 transition-swing"
            prepend-icon="mdi-arrow-left"
            @click="router.push({ name: 'RetailerTutorial' })"
            style="border-width: 2px;"
          >
            Back to Retailer Guide
          </v-btn>
        </div>

      </v-card>
    </v-container>

    <!-- Inspection Item Modal -->
    <v-dialog v-model="modalOpen" max-width="460" scrollable class="item-detail-dialog">
      <v-card color="#232323" class="rounded-xl overflow-hidden pa-0 modal-card" elevation="24">
        <!-- Dialog Title Bar Centered with Counter if multiple images -->
        <div class="pa-4 pt-5 text-center">
          <h3 class="text-subtitle-1 font-weight-bold text-white pa-0 ma-0">
            {{ activeModalItem.title || 'Item Inspection' }}
          </h3>
          <div v-if="activeModalImages.length > 1" class="text-caption text-grey-lighten-1 mt-0.5">
            {{ modalCurrentIndex + 1 }} / {{ activeModalImages.length }}
          </div>
        </div>

        <!-- Image Content Container with side navigation arrows -->
        <v-card-text class="pa-2 px-3 d-flex flex-column align-center justify-center position-relative" style="min-height: 250px;">
          <div v-if="activeModalItem.image" class="w-100 position-relative d-flex align-center justify-center">
            <!-- Left Chevron Arrow -->
            <v-btn
              v-if="activeModalImages.length > 1"
              icon="mdi-chevron-left"
              variant="flat"
              size="small"
              class="modal-nav-arrow position-absolute"
              style="left: 6px; z-index: 10;"
              @click.stop="prevModalImage"
              aria-label="Previous Image"
            ></v-btn>

            <v-img
              :src="activeModalItem.image"
              width="100%"
              contain
              max-height="50vh"
              class="rounded-lg"
            >
              <template v-slot:placeholder>
                <div class="d-flex align-center justify-center fill-height bg-grey-darken-4 rounded-lg">
                  <v-progress-circular indeterminate color="cyan-accent-3" size="32"></v-progress-circular>
                </div>
              </template>
              <template v-slot:error>
                <div class="d-flex flex-column align-center justify-center pa-8 bg-grey-darken-4 text-center rounded-lg w-100 fill-height">
                  <v-icon size="48" color="amber-accent-2" class="mb-3">mdi-book-open-page-variant</v-icon>
                  <div class="text-subtitle-2 font-weight-bold text-white mb-1">{{ activeModalItem.title }}</div>
                  <div class="text-caption text-grey-lighten-1">Illustration component preview</div>
                </div>
              </template>
            </v-img>

            <!-- Right Chevron Arrow -->
            <v-btn
              v-if="activeModalImages.length > 1"
              icon="mdi-chevron-right"
              variant="flat"
              size="small"
              class="modal-nav-arrow position-absolute"
              style="right: 6px; z-index: 10;"
              @click.stop="nextModalImage"
              aria-label="Next Image"
            ></v-btn>
          </div>
          
          <div v-else class="py-6 text-center">
            <v-icon size="40" color="amber-accent-2" class="mb-2">mdi-information-outline</v-icon>
            <div class="text-body-2 text-white font-weight-medium mb-1">{{ activeModalItem.title }}</div>
          </div>

          <!-- Indicator dots if multiple images -->
          <div v-if="activeModalImages.length > 1" class="d-flex justify-center align-center pt-3 pb-1 ga-2">
            <span
              v-for="(_, idx) in activeModalImages"
              :key="idx"
              class="modal-dot cursor-pointer"
              :class="{ 'dot-active': idx === modalCurrentIndex }"
              @click.stop="setModalImageIndex(idx)"
            ></span>
          </div>
        </v-card-text>

        <!-- Action Button Bar matching input_file_0.png -->
        <div class="pa-0 ma-0">
          <v-btn
            block
            size="large"
            variant="flat"
            class="font-weight-bold text-white py-3 rounded-0"
            :class="activeModalIsChecked ? 'mark-done-btn' : 'not-done-btn'"
            style="height: 52px;"
            @click="toggleActiveModalCheckOnly"
          >
            <v-icon start size="medium" class="mr-2">
              {{ activeModalIsChecked ? 'mdi-checkbox-marked' : 'mdi-checkbox-blank-outline' }}
            </v-icon>
            {{ activeModalIsChecked ? 'Checked as Done' : 'Not Done' }}
          </v-btn>
        </div>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const STORAGE_KEY = 'drunagor_box_assembly_checks';
const BASE_IMG_URL = 'https://assets.drunagor.app/retaitlertutorial/box-assembly-guide/';

// Helper to construct exact image URL with space encoding
const getImg = (filename: string) => {
  if (!filename) return '';
  return `${BASE_IMG_URL}${encodeURIComponent(filename)}`;
};

// Reactive map storing checked states by item ID
const checkedItems = ref<Record<string, boolean>>({});

// Collapsible steps state (All steps come CLOSED by default as requested!)
const openSteps = ref<Record<number, boolean>>({
  1: false,
  2: false,
  3: false,
  4: false,
});

// Toggle collapsible step open/close
const toggleStep = (stepNumber: number) => {
  openSteps.value[stepNumber] = !openSteps.value[stepNumber];
};

// Modal state
const modalOpen = ref(false);
const activeModalItem = ref<{ id?: string; title?: string; image?: string }>({});
interface ModalImage {
  title: string;
  image: string;
}
const activeModalImages = ref<ModalImage[]>([]);
const modalCurrentIndex = ref(0);

// Helper: Check if item is checked
const isChecked = (id: string): boolean => {
  return !!checkedItems.value[id];
};

// Check if a parent item with sub-bullets is complete (all children checked)
const isParentChecked = (item: { id: string; details?: { id: string }[] }): boolean => {
  if (item.details && item.details.length > 0) {
    return item.details.every(d => !!checkedItems.value[d.id]);
  }
  return !!checkedItems.value[item.id];
};

// Helper: Toggle item check state and persist
const toggleCheck = (id: string) => {
  if (!id) return;
  checkedItems.value[id] = !checkedItems.value[id];
  saveToLocalStorage();
};

// Toggle all sub-items when clicking parent checkbox
const toggleParentCheck = (item: { id: string; details?: { id: string }[] }) => {
  if (item.details && item.details.length > 0) {
    const allChecked = item.details.every(d => !!checkedItems.value[d.id]);
    const targetState = !allChecked;
    item.details.forEach(d => {
      checkedItems.value[d.id] = targetState;
    });
    checkedItems.value[item.id] = targetState;
  } else {
    toggleCheck(item.id);
  }
  saveToLocalStorage();
};

// Handle clicking on an item line:
// If item has an image/images modal, open the modal dialog!
// Otherwise, directly toggle the check state.
const handleItemClick = (item: { id?: string; label?: string; title?: string; image?: string; images?: ModalImage[] }) => {
  if ((item.images && item.images.length > 0) || item.image) {
    openModal(item);
  } else if (item.id) {
    toggleCheck(item.id);
  }
};

// Save to LocalStorage
const saveToLocalStorage = () => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(checkedItems.value));
  } catch (e) {
    console.error('Failed to save box assembly state to localStorage:', e);
  }
};

// Load from LocalStorage
const loadFromLocalStorage = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      checkedItems.value = JSON.parse(data);
    }
  } catch (e) {
    console.error('Failed to load box assembly state from localStorage:', e);
  }
};

// Open detail modal supporting multiple images / carousel
const openModal = (item: {
  id?: string;
  label?: string;
  title?: string;
  image?: string;
  images?: ModalImage[];
}) => {
  const fallbackTitle = item.title || (item.label ? item.label.replace(/<[^>]*>/g, '') : '');

  if (item.images && item.images.length > 0) {
    activeModalImages.value = item.images.map(img => ({
      image: img.image,
      title: img.title || fallbackTitle
    }));
  } else if (item.image) {
    activeModalImages.value = [{
      image: item.image,
      title: fallbackTitle
    }];
  } else {
    activeModalImages.value = [];
  }

  modalCurrentIndex.value = 0;
  const currentImg = activeModalImages.value[0];
  activeModalItem.value = {
    id: item.id,
    title: currentImg?.title || fallbackTitle,
    image: currentImg?.image || item.image,
  };
  modalOpen.value = true;
};

// Carousel navigation functions
const nextModalImage = () => {
  if (activeModalImages.value.length <= 1) return;
  modalCurrentIndex.value = (modalCurrentIndex.value + 1) % activeModalImages.value.length;
  updateModalDisplay();
};

const prevModalImage = () => {
  if (activeModalImages.value.length <= 1) return;
  modalCurrentIndex.value = (modalCurrentIndex.value - 1 + activeModalImages.value.length) % activeModalImages.value.length;
  updateModalDisplay();
};

const setModalImageIndex = (index: number) => {
  if (index >= 0 && index < activeModalImages.value.length) {
    modalCurrentIndex.value = index;
    updateModalDisplay();
  }
};

const updateModalDisplay = () => {
  const current = activeModalImages.value[modalCurrentIndex.value];
  if (current) {
    activeModalItem.value.title = current.title;
    activeModalItem.value.image = current.image;
  }
};

// Computed for modal action button state
const activeModalIsChecked = computed(() => {
  if (!activeModalItem.value.id) return false;
  const parentWithDetails = findParentItem(activeModalItem.value.id);
  if (parentWithDetails) {
    return isParentChecked(parentWithDetails);
  }
  return isChecked(activeModalItem.value.id);
});

// Toggle check from inside modal (stays open for user feedback until clicking outside)
const toggleActiveModalCheckOnly = () => {
  if (activeModalItem.value.id) {
    const parentWithDetails = findParentItem(activeModalItem.value.id);
    if (parentWithDetails) {
      toggleParentCheck(parentWithDetails);
    } else {
      toggleCheck(activeModalItem.value.id);
    }
  }
};

onMounted(() => {
  loadFromLocalStorage();
});

// Guide content, following the "Retailer Manual – OP Kit preparation" text.
// Images live in the assets bucket (see getImg).
interface GuideItem {
  id: string;
  label: string;
  title?: string;
  image?: string;
  images?: ModalImage[];
  details?: GuideItem[];
}
interface GuideSubstep {
  heading: string;
  text?: string;
  items?: GuideItem[];
  note?: string;
  cardsTable?: boolean;
  after?: string;
  image?: { id: string; title: string; image: string };
}
interface GuideStep {
  n: number;
  title: string;
  intro: string[];
  image?: { id: string; title: string; image: string };
  substeps: GuideSubstep[];
  enjoy?: boolean;
}

const b = (text: string) => `<strong class="text-white font-weight-bold">${text}</strong>`;
const loud = (text: string) => `<strong class="text-white font-weight-black">${text}</strong>`;
const item = (id: string, label: string, file: string, title: string, extra: Partial<GuideItem> = {}): GuideItem => ({
  id,
  label,
  image: getImg(file),
  title,
  ...extra,
});

// Mini Cards Table Data
const heroCards = [
  { id: 'step2_3_h1', label: '5x Hero Initiative Cards (1 per Hero)', image: getImg('Hero Initiative Cards DNS1.png'), title: 'Hero Initiative Cards' },
  { id: 'step2_3_h2', label: '20x Hero Skill Cards (4 per Hero)', image: getImg('Hero Skills Cards DNS1.png'), title: 'Hero Skill Cards' },
  { id: 'step2_3_h3', label: '20x Class Skill Cards (4 per Class)', image: getImg('Class Skill Cards DNS1.png'), title: 'Class Skill Cards' },
  { id: 'step2_3_h4', label: '10x Themed Starting Equipment Cards (2 per Hero)', image: getImg('Hero Starting Gear Cards DNS1.png'), title: 'Hero Starting Gear Cards' },
  { id: 'step2_3_h5', label: '10x Party Role Cards (2 per Role)', image: getImg('Dungeon Role Cards DNS1.png'), title: 'Dungeon Role Cards' }
];

const enemyCards = [
  { id: 'step2_3_e1', label: '28x Monster Cards (White, Gray, and Black)', image: getImg('Monsters Cards DNS1.png'), title: 'Monster Cards' },
  { id: 'step2_3_e2', label: '3x Commander Cards', image: getImg('Commanders Cards DNS1.png'), title: 'Commander Cards' },
  { id: 'step2_3_e3', label: '1x Boss Card', image: getImg('Boss Cards DNS1.png'), title: 'Boss Card' },
  { id: 'step2_3_e4', label: '1x Minion Card', image: getImg('Minions Cards DNS1.png'), title: 'Minion Card' },
  { id: 'step2_3_e5', label: '10x Commander Attack Cards', image: getImg('Commander Attack Cards DNS1.png'), title: 'Commander Attack Cards' },
  { id: 'step2_3_e6', label: '8x Boss Attack Cards', image: getImg('Boss Attack Cards DNS1.png'), title: 'Boss Attack Cards' }
];

const adventureCards = [
  { id: 'step2_3_a1', label: '22x Adventure Item Cards', image: getImg('Adventure Cards DNS1.png'), title: 'Adventure Item Cards' },
  { id: 'step2_3_a2', label: '18x Chest Cards', image: getImg('Chest Cards DNS1.png'), title: 'Chest Item Cards' },
  { id: 'step2_3_a3', label: '3x Tutorial Trigger Cards', image: getImg('Tutorial Trigger Cards DNS1.png'), title: 'Tutorial Trigger Cards' },
  { id: 'step2_3_a4', label: '2x Scene Trigger Cards', image: getImg('Scene Trigger Cards DNS1.png'), title: 'Scene Trigger Cards' },
  { id: 'step2_3_a5', label: '2x Rune Cards', image: getImg('Rune Cards DNS1.png'), title: 'Rune Cards' },
  { id: 'step2_3_a6', label: '2x Game Mechanic Cards', image: getImg('Game Mechenics Cards DNS1.png'), title: 'Game Mechanic Cards' },
  { id: 'step2_3_a7', label: '1x End of Round Trigger Card', image: getImg('End of Round Trigger Cards DNS1.png'), title: 'End of Round Trigger Cards' },
  { id: 'step2_3_a8', label: '1x Game Status Check Card', image: getImg('Game State Check-up Cards DNS1.png'), title: 'Game State Check-up Cards' }
];

const maxCardRows = Math.max(heroCards.length, enemyCards.length, adventureCards.length);

const guideSteps: GuideStep[] = [
  {
    n: 1,
    title: 'The “Age of Darkness” Core Box',
    intro: [`Open the ${b('Core Box')} and let’s sort through the components.`],
    substeps: [
      {
        heading: `1.1 – What you should ${loud('SET ASIDE')} (we won’t be using these):`,
        items: [
          item('step1_1_adventure_books', `The ${b('Adventure Book')} and ${b('Interactions Book')}.`, 'Adventure Book and Interaction Book.png', 'The Adventure Book and Interactions Book'),
          item('step1_1_campaign_log', `The ${b('Campaign Log Pad')}.`, 'Campaign log pad.png', 'Campaign Log Pad'),
          item('step1_1_start_here', `The ${b('“Start Here” Booklet')}.`, 'Start Here.png', 'The “Start Here” Booklet'),
          item('step1_1_doors', `The plastic wrap containing the ${b('Doors')}.`, 'Doors Pack.png', 'Doors'),
        ],
      },
      {
        heading: `1.2 – What you should ${loud('SEPARATE')} (keep nearby):`,
        items: [
          item('step1_2_rulebook', `${b('Rulebook')}.`, 'Rulebook.png', 'Rulebook'),
          item('step1_2_map_tiles', `${b('Map Tiles')}.`, 'Map Tiles CORE.png', 'Map Tiles'),
          item('step1_2_velvet_bag', `${b('Velvet Bag')}.`, 'Velvet BAG.png', 'Velvet Bag'),
          item('step1_2_punchboards', `All ${b('Punchboards')}.`, 'Punchboards.png', 'Punchboards'),
          item('step1_2_trays', `${b('All trays:')} Darkness Tiles, Token, Small Miniatures, and Dungeon.`, 'Darkness Tray Empty.png', 'All Trays', {
            images: [
              { title: 'Darkness Tiles Tray', image: getImg('Darkness Tray Empty.png') },
              { title: 'Token Tray', image: getImg('Tokens Tray Empty.png') },
              { title: 'Small Miniatures Tray', image: getImg('Small Miniature Tray.png') },
              { title: 'Dungeon Trays', image: getImg('Dungeon Trayz.png') },
            ],
          }),
          item('step1_2_cubes_bag', `The bag containing the ${b('colored cubes')}.`, 'Colored Cubes.png', 'Colored Cubes'),
          item('step1_2_large_tray', `The ${b('Large Miniatures Tray')}.`, 'Large Miniature Tray.png', 'Large Miniatures Tray'),
        ],
        note: `Note: The Large Miniatures Tray is located at the bottom of the box. ${b('Do not remove it.')}`,
      },
      {
        heading: `1.3 – What you should ${loud('SORT')} before setting aside and separating:`,
        items: [
          item('step1_3_boards', `Plastic wrap containing ${b('Hero Boards')} and ${b('Monster Status Boards')}.`, 'PLAYERBOARDS_CORE.png', 'Hero Boards and Monster Status Boards', {
            details: [
              item('step1_3_boards_aside', `${b('Set Aside')} the Hero Boards.`, 'PLAYERBOARDS_CORE.png', 'Hero Boards and Monster Status Boards'),
              item('step1_3_boards_separate', `${b('Separate')} the Monster Status Boards.`, 'Monster Status Boards.png', 'Monster Status Boards'),
            ],
          }),
          item('step1_3_minis', `${b('Mini Cards')} and ${b('Save Game Boxes')}.`, 'Mini Cards and Save Game Boxes.png', 'Mini Cards and Save Game Boxes', {
            details: [
              item('step1_3_minis_aside', `${b('Set Aside')} the Mini Cards.`, 'Mini Cards.png', 'Mini Cards'),
              item('step1_3_minis_separate', `${b('Separate')} the Save Game Boxes.`, 'Mini Save Game Boxes.png', 'Save Game Boxes'),
            ],
          }),
        ],
      },
      {
        heading: `1.3.1 – Rescue the Pet Cards <span class="text-amber-accent-2 text-caption font-weight-bold ml-1">(Special Step!)</span>`,
        text: `Open the card packs until you find and ${b('retrieve Maya’s 2 Pet Cards')} (${b('Wolf and Eagle')}). Add them to the components that will be used.`,
        items: [item('step1_3_pets', 'Retrieve Maya’s 2 Pet Cards (Wolf and Eagle).', 'Pets Maya.png', 'Maya’s Pet Cards (Wolf & Eagle)')],
        image: { id: 'step1_3_pets', title: 'Maya’s Pet Cards (Wolf & Eagle)', image: getImg('Pets Maya.png') },
      },
      {
        heading: '1.4 – Organizing Cubes, Trays and Boxes:',
        items: [
          item('step1_4_cubes', `${b('Colored Cubes:')} Sort them into the empty ${b('Save Game Boxes')}.`, 'Colored Cubes.png', 'Colored Cubes', {
            details: [
              item('step1_4_box_a', `${b('Box A:')} Place the ${b('Yellow and Red Cubes')} in one compartment, and the ${b('Green and Blue Cubes')} in the other. Place the ${b('two dice')} in the narrow space between the compartments.`, 'CUBE Tray 1.png', 'Box A – Cubes & Dice'),
              item('step1_4_box_b', `${b('Box B:')} Place the ${b('Black Cubes')} in one compartment and the ${b('White Cubes')} in the other. Place the ${b('Purple and Pink Cubes')} in the narrow space between the compartments.`, 'CUBE Tray 2.png', 'Box B – Cubes'),
            ],
          }),
          item('step1_4_cardboard', `${b('Cardboard Components (Punchboards):')} Punch out all components.`, 'Punchboards.png', 'Cardboard Components', {
            details: [
              item('step1_4_darkness', `${b('Darkness Tiles:')} Place them in the ${b('Darkness Tiles Tray')}.`, 'Darkness Tray Fullfiled.png', 'Darkness Tiles Tray'),
              item('step1_4_runes', `${b('Runes:')} Place them inside the ${b('Velvet Bag')}.`, 'Rune Bag.png', 'Rune Bag'),
              item('step1_4_tokens', `${b('Tokens:')} Place them in the ${b('Token Tray')}. Any tokens that do not fit should go into the plastic bag that held the cubes and be ${b('set aside')}.`, 'Tokens Tray Fullfiled.png', 'Token Tray'),
              item('step1_4_initiative', `${b('Initiative Track and Bridges:')} Keep them nearby.`, 'Initiative Bridge.png', 'Initiative Track and Bridges'),
            ],
          }),
        ],
      },
    ],
  },
  {
    n: 2,
    title: 'The “Build Your Own Dungeon” Add-On',
    intro: [],
    image: { id: 'byod_box', title: 'Build Your Own Dungeon Add-On', image: getImg('Build Your Own Dungeon.png') },
    substeps: [
      {
        heading: '2.1 – Open the Build Your Own Dungeon add-on:',
        items: [
          item('step2_1_maps', `${b('Set Aside')} the plastic wraps containing the ${b('Map Tiles')}.`, 'SETASIDE maps SERPARATE DGtray.png', 'Set aside the Map Tiles, separate the Dungeon Trays'),
          item('step2_1_trays', `${b('Separate')} the ${b('5 new Dungeon Trays')}.`, 'SETASIDE maps SERPARATE DGtray.png', 'Set aside the Map Tiles, separate the Dungeon Trays'),
        ],
        image: { id: 'step2_1_trays', title: 'Set aside the Map Tiles, separate the Dungeon Trays', image: getImg('SETASIDE maps SERPARATE DGtray.png') },
      },
      {
        heading: '2.2 – Return the plastic components to the Core Box:',
        items: [
          item('step2_2_trays', `${b('Trays:')} Return the ${b('Dungeon Trays')}, the ${b('Small Miniatures Tray')}, the ${b('Darkness Tiles Tray')}, and the ${b('Token Tray')} to the box.`, 'Dungeon Trayz.png', 'Trays', {
            images: [
              { title: 'Dungeon Trays', image: getImg('Dungeon Trayz.png') },
              { title: '5 new Dungeon Trays', image: getImg('5 New Trays.png') },
              { title: 'Small Miniatures Tray', image: getImg('Small Miniature Tray.png') },
              { title: 'Darkness Tiles Tray', image: getImg('Darkness Tray Fullfiled.png') },
              { title: 'Token Tray', image: getImg('Tokens Tray Fullfiled.png') },
            ],
          }),
        ],
      },
    ],
  },
  {
    n: 3,
    title: 'The Organized Play Kit',
    intro: [`Open the ${b('Organized Play Kit')} and combine its contents with the components we have already prepared.`],
    image: { id: 'op_kit_box', title: 'Organized Play Kit', image: getImg('Drunagor Nights Box.png') },
    substeps: [
      {
        heading: '3.1 – What to separate:',
        items: [
          item('step3_1_hero_boards', `${b('Hero Boards')} from the Kit.`, 'PLAYERBOARDS_DNS1.png', 'Hero Boards (Kit)'),
          item('step3_1_map_tiles', `${b('Map Tiles')}.`, 'Map Tiles DNS1.png', 'Map Tiles (Kit)'),
          item('step3_1_mini_cards', `${b('Mini Cards')}.`, 'Hero_Enemy_Adventure components.png', 'Mini Cards (Kit)'),
          item('step3_1_gift_cards', `${b('Gift Item Cards (80x)')}.`, 'GIFT CARDS.png', 'Gift Item Cards (80x)'),
          item('step3_1_doors', `${b('Doors')}.`, 'Doors Pack S1.png', 'Doors (Kit)'),
        ],
      },
      {
        heading: '3.2 – Store the Mini Cards inside the Save Game Boxes:',
        text: `Sort the Kit’s cards by category: ${b('Heroes, Enemies, and Adventures')}.`,
        cardsTable: true,
        after: `Store all Mini Cards inside the ${b('3 empty Save Game Boxes')}, one category per box.`,
        image: { id: 'save_boxes_layout', title: '3 Save Game Boxes', image: getImg('Hero_Enemy_Adventure components.png') },
      },
      {
        heading: '3.3 – Packing Everything Back into the Core Box:',
        text: `Now, return the following components to the ${b('Core Box')}:`,
        items: [
          item('step3_3_save_boxes', `All ${b('6 Save Game Boxes')} (now fully packed).`, 'The 6 Save Game Boxes.png', 'The 6 Save Game Boxes'),
          item('step3_3_velvet_bag', `The ${b('Velvet Bag')} containing the Runes.`, 'Rune Bag.png', 'Rune Bag'),
          item('step3_3_initiative', `The ${b('Initiative Track')} and ${b('Bridges')}.`, 'Initiative Bridge.png', 'Initiative Track and Bridges'),
          item('step3_3_map_tiles', `All ${b('Map Tiles')} (combining those from the Kit with those from the Core Box).`, 'Map Tiles DNS1.png', 'All Map Tiles'),
          item('step3_3_doors', `All ${b('Doors')}.`, 'Doors Pack S1.png', 'All Doors'),
          item('step3_3_hero_boards', `The ${b('Hero Boards')} from the Kit.`, 'PLAYERBOARDS_DNS1.png', 'Hero Boards'),
          item('step3_3_monster_boards', `Both ${b('Monster Status Boards')}.`, 'Monster Status Boards.png', 'Monster Status Boards'),
          item('step3_3_rulebook', `The ${b('Rulebook')}.`, 'Rulebook.png', 'Rulebook'),
        ],
      },
      {
        heading: '3.4 – Finish Up:',
        items: [item('step3_4_close_box', `Put the lid on and ${b('close the Core Box!')}`, 'corebox.png', 'Core Box closed')],
      },
    ],
  },
  {
    n: 4,
    title: 'Clean-Up and You’re Done!',
    intro: [
      `That’s it! Your ${b('Core Box')} is now fully optimized and ready for ${b('Drunagor Nights')}.`,
      `Take all the components you ${b('set aside')} during the previous steps and place them inside the now-empty ${b('Organized Play Kit box')}.`,
      'Store that box somewhere safe, as you may want to use the original Heroes or some of those components again in the future.',
    ],
    substeps: [],
    enjoy: true,
  },
];

// The item with sub-bullets that has this id, if any.
const findParentItem = (id?: string) =>
  guideSteps
    .flatMap((step) => step.substeps.flatMap((sub) => sub.items ?? []))
    .find((entry) => entry.id === id && entry.details);
</script>

<style scoped>
.guide-image-fallback {
  max-width: 400px;
  border: 1px dashed rgba(255, 255, 255, 0.2);
}

.safe-area-padding {
  padding-top: calc(env(safe-area-inset-top, 0px) + 20px) !important;
}

.box-assembly-page-wrapper {
  position: relative;
  width: 100%;
  overflow-x: hidden;
  min-height: 100vh;
  font-family: 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  font-weight: 300;
}

.page-background {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 0;
  background-image: 
    radial-gradient(circle at 50% 0%, rgba(20, 20, 20, 0.98) 0%, rgba(20, 20, 20, 0.85) 25%, rgba(20, 20, 20, 0) 65%),
    url('https://assets.drunagor.app/backgrounds/mblogin-background.png');
  background-size: cover, cover;
  background-position: top center, top center;
  background-repeat: no-repeat, no-repeat;
}

@media (min-width: 960px) {
  .page-background {
    background-image: 
      radial-gradient(circle at 50% 0%, rgba(20, 20, 20, 0.98) 0%, rgba(20, 20, 20, 0.85) 25%, rgba(20, 20, 20, 0) 65%),
      url('https://s3.us-east-2.amazonaws.com/assets.drunagor.app/backgrounds/bg-login.webp');
  }
}

.guide-container {
  position: relative;
  z-index: 1;
}

.main-header-title {
  font-family: 'Poppins', sans-serif !important;
  font-size: 1.8rem;
  line-height: 1.1;
  letter-spacing: 0.5px;
  font-weight: 800;
}

@media (min-width: 600px) {
  .main-header-title {
    font-size: 2.5rem;
  }
}

.subtitle-text {
  font-size: 0.78rem;
  color: rgba(255, 255, 255, 0.45) !important;
  max-width: 560px;
  line-height: 1.45;
  font-weight: 300;
}

.pdf-guide-link {
  color: #BCA341 !important;
  font-weight: 600;
  text-decoration: underline !important;
  transition: color 0.2s ease, text-shadow 0.2s ease;
  display: inline-flex;
  align-items: center;
  margin-left: 3px;
}

.pdf-guide-link:hover {
  color: #d8bd4f !important;
  text-shadow: 0 0 8px rgba(188, 163, 65, 0.4);
}

/* Single Main Box Card */
.main-box-card {
  background: #232323 !important;
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 12px 36px rgba(0,0,0,0.6) !important;
}

/* Step Banner Header */
.step-banner {
  background: #181818;
  border-radius: 12px;
  width: 100%;
  overflow: hidden;
  transition: background 0.2s ease;
}

.step-banner:hover {
  background: #202020;
}

.banner-open {
  border-bottom-left-radius: 0px !important;
  border-bottom-right-radius: 0px !important;
}

/* Step Open Grey Background Container matching input_file_0.png */
.step-open-container {
  background: #343434 !important;
  width: 100%;
  border-bottom-left-radius: 12px !important;
  border-bottom-right-radius: 12px !important;
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-top: none;
}

/* Exact Hex Colors for Step Badges */
.step-badge {
  color: #ffffff;
  font-weight: 800;
  font-size: 0.95rem;
  padding: 11px 20px;
  letter-spacing: 0.5px;
  border-top-left-radius: 12px !important;
  border-bottom-left-radius: 0px !important;
  border-top-right-radius: 0px !important;
  border-bottom-right-radius: 0px !important;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

@media (min-width: 600px) {
  .step-badge {
    font-size: 1.05rem;
    padding: 12px 24px;
  }
}

.badge-step-1 {
  background: #108788 !important;
}

.badge-step-2 {
  background: #0BB574 !important;
}

.badge-step-3 {
  background: #BCA341 !important;
}

.badge-step-4 {
  background: #5D3C76 !important;
}

/* Single-line step titles with responsive clamp to prevent mobile truncation */
.single-line-title {
  font-family: 'Poppins', sans-serif !important;
  font-size: clamp(0.92rem, 3.5vw, 1.25rem) !important;
  white-space: nowrap !important;
  overflow: hidden !important;
  text-overflow: ellipsis !important;
  font-weight: 700 !important;
}

@media (min-width: 600px) {
  .single-line-title {
    font-size: 1.25rem !important;
  }
}

.substep-heading {
  font-size: 1.06rem !important;
  font-weight: 700 !important;
  letter-spacing: 0.2px;
  line-height: 1.4;
}

@media (min-width: 600px) {
  .substep-heading {
    font-size: 1.18rem !important;
  }
}

.intro-p {
  font-size: 0.84rem !important;
  color: #ffffff !important;
  font-weight: 300 !important;
  line-height: 1.45;
}

/* Modal Carousel Navigation Chevrons and Dots */
.modal-nav-arrow {
  backdrop-filter: blur(6px);
  background: rgba(0, 0, 0, 0.65) !important;
  border: 1px solid rgba(255, 255, 255, 0.25);
  color: #ffffff !important;
  transition: all 0.2s ease;
  width: 38px !important;
  height: 38px !important;
}

.modal-nav-arrow:hover {
  background: rgba(0, 0, 0, 0.9) !important;
  border-color: rgba(255, 255, 255, 0.6);
  transform: scale(1.12);
}

.modal-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.3);
  transition: all 0.2s ease;
}

.modal-dot.dot-active {
  width: 22px;
  border-radius: 4px;
  background: #00c853;
}

/* Custom crisp white square checkbox */
.custom-checkbox {
  width: 15px;
  height: 15px;
  min-width: 15px;
  min-height: 15px;
  background-color: #ffffff;
  border-radius: 3px;
  margin-right: 12px;
  margin-top: 3px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.15s ease;
  box-shadow: 0 1px 3px rgba(0,0,0,0.4);
}

.custom-checkbox.checked {
  background-color: #00c853;
}

.custom-checkbox.checked::after {
  content: '';
  width: 4px;
  height: 8px;
  border: solid #ffffff;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
  margin-bottom: 2px;
}

.row-label {
  font-size: 0.82rem !important;
  color: #ffffff !important;
  line-height: 1.45;
  font-weight: 300 !important;
}

/* Checklist rows with larger vertical touch padding to prevent accidental clicks */
.checklist-row {
  transition: opacity 0.2s ease, background 0.15s ease;
  border-radius: 6px;
  padding-left: 6px;
  padding-right: 6px;
  padding-top: 10px !important;
  padding-bottom: 10px !important;
}

.checklist-row:hover {
  background: rgba(255, 255, 255, 0.05);
}

.row-checked {
  opacity: 0.45;
}

.row-checked .row-label {
  text-decoration: line-through;
}

.note-text {
  font-size: 0.78rem !important;
  font-weight: 300 !important;
}

.sub-bullets {
  font-size: 0.78rem;
  color: #dddddd;
  font-weight: 300 !important;
}

/* Step 4 Enjoy text matching input_file_0.png */
.step4-enjoy-text {
  font-size: 0.95rem;
  font-weight: 700 !important;
}

/* Table matching input_file_2.png */
.cards-table-wrapper {
  max-width: 100%;
  overflow-x: auto !important;
  -webkit-overflow-scrolling: touch;
  padding-bottom: 6px;
}

.cards-table-wrapper::-webkit-scrollbar {
  height: 6px !important;
  display: block !important;
}

.cards-table-wrapper::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
}

.cards-table-wrapper::-webkit-scrollbar-thumb {
  background: #00b8d4;
  border-radius: 4px;
}

.cards-table-wrapper::-webkit-scrollbar-thumb:hover {
  background: #00e5ff;
}

.border-col-right {
  border-right: 1px solid rgba(255, 255, 255, 0.12) !important;
}

.style-table-text {
  font-size: 0.76rem !important;
  line-height: 1.3;
  color: #ffffff !important;
  font-weight: 300 !important;
}

.mini-cards-table {
  background: #363636 !important;
}

.mini-cards-table th {
  border-bottom: 1px solid rgba(255, 255, 255, 0.12) !important;
  font-weight: 600 !important;
}

.table-cell-custom {
  border-bottom: 1px solid rgba(255, 255, 255, 0.08) !important;
}

.width-33 {
  width: 33.33%;
}

.cell-check-item {
  background: transparent;
  transition: all 0.2s ease;
}

.cell-check-item:hover {
  background: rgba(255, 255, 255, 0.05);
}

.cell-checked {
  opacity: 0.45;
  text-decoration: line-through;
}

.border-glow {
  border: 2px solid rgba(0, 229, 255, 0.4);
  transition: all 0.3s ease;
}

.border-glow:hover {
  border-color: rgba(0, 229, 255, 0.8);
  box-shadow: 0 0 16px rgba(0, 229, 255, 0.4);
  transform: scale(1.02);
}

.border-subtle {
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
}

.border-subtle:hover {
  border-color: rgba(255, 215, 0, 0.4);
}

.back-button {
  background: rgba(255, 255, 255, 0.08) !important;
  transition: transform 0.3s ease, background-color 0.3s ease;
  z-index: 5;
}

.back-button:hover {
  transform: translateX(-4px);
  background: rgba(255, 255, 255, 0.15) !important;
}

.border-bottom-subtle {
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.border-top-subtle {
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.mark-done-btn {
  background-color: #00c853 !important;
  transition: background-color 0.2s ease;
}

.mark-done-btn:hover {
  background-color: #00e676 !important;
}

.not-done-btn {
  background-color: #4a4a4a !important;
  transition: background-color 0.2s ease;
}

.not-done-btn:hover {
  background-color: #555555 !important;
}

.box-preview-fallback,
.cards-preview-fallback,
.pet-preview-fallback,
.save-boxes-fallback,
.byod-fallback,
.trays-fallback {
  background: rgba(0, 0, 0, 0.4);
}
</style>
